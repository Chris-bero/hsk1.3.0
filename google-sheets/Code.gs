/**
 * ============================================================
 *  HSK Standard Course 1 — Google Sheets Bridge (Apps Script)
 *  VERSION 2 — device tracking rebuild (2026-10-04)
 * ============================================================
 *  v2 changelog (rebuild of the lost 3/10 version, per spec):
 *   + Log tab gains two columns: Device | DevLabel (auto-migration
 *     of old 9-column logs — old rows keep working, new cols blank).
 *   + login/log accept body.device = {id, label} and store it.
 *   + new POST action 'check'  → daily check & active-kick:
 *       Active=no  →  {ok:false, error:'inactive', kick:true,
 *                      lastLoginMs, recent:<within 24h>}
 *   + progress_ aggregates per-student devices[] (id,label,first,
 *     last,logins) + deviceCount + shareFlag (two different devices
 *     for the same name within a 2-hour window → 'same-time use!').
 *
 *  v1 (recovered from Apps Script cloud) behaviour preserved 100%:
 *   tabs Students/Log/Settings · actions ping/roster/health/
 *   progress (GET) · login/log (POST) · teacher_code guard ·
 *   codes never leave the sheet · batch cap 60 · scan cap 40000.
 *
 *  SETUP / UPDATE:
 *   paste this whole file in Apps Script → Save →
 *   Deploy → Manage deployments → ✏️ → New version → Deploy.
 * ============================================================
 */

var TAB_STUDENTS = 'Students';
var TAB_LOG      = 'Log';
var TAB_SETTINGS = 'Settings';

var LOG_HEADERS     = ['Timestamp', 'Event', 'Student', 'Lesson', 'Detail', 'Score', 'Total', 'Seconds', 'EpochMs', 'Device', 'DevLabel'];
var LOG_COLS        = LOG_HEADERS.length; // 11
var STUDENT_HEADERS = ['Name', 'Code', 'Active', 'Note'];
var MAX_EVENTS_PER_POST = 60;
var MAX_LOG_SCAN = 40000;             // safety cap when aggregating
var SHARE_WINDOW_MS = 2 * 3600 * 1000;   // two devices, same name, ≤ 2h → flag
var KICK_WINDOW_MS  = 24 * 3600 * 1000;  // 'recent' login window for kicks

/* ---------------- one-time setup (run manually) ---------------- */
function setup() {
  ensureStructure_();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var st = ss.getSheetByName(TAB_STUDENTS);
  if (st.getLastRow() < 2) {
    st.getRange(2, 1, 3, 4).setValues([
      ['张三', '1111', 'yes', 'example row — replace with your students'],
      ['李四', '2222', 'yes', 'example row'],
      ['王五', '3333', 'no',  'example of an inactive student']
    ]);
  }
  var se = ss.getSheetByName(TAB_SETTINGS);
  if (se.getLastRow() < 2) {
    se.getRange(2, 1, 2, 2).setValues([
      ['teacher_code', '9999'],
      ['class_code',   '']
    ]);
  }
  return 'OK — tabs ready. Now fill Students + Settings, then Deploy as Web App.';
}

/* ---------------- HTTP entry points ---------------- */
function doGet(e) {
  ensureStructure_();
  var p = (e && e.parameter) || {};
  var action = p.action || 'ping';
  try {
    if (action === 'ping')     return json_({ ok: true, service: 'hsk1-sheets', v: 2, time: nowStr_() });
    if (action === 'roster')   return json_(roster_());
    if (action === 'health')   return json_(health_());
    if (action === 'progress') return json_(progress_(p));
    if (action === 'tail')     return json_(tail_(p));
    return json_({ ok: false, error: 'unknown_action' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  ensureStructure_();
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'bad_json' });
  }
  try {
    if (body.action === 'login') return json_(login_(body));
    if (body.action === 'log')   return json_(logEvents_(body));
    if (body.action === 'check') return json_(check_(body));
    return json_({ ok: false, error: 'unknown_action' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/* ---------------- login (validates per-student code) ---------------- */
function login_(body) {
  var name = norm_(body.name);
  var code = String(body.code == null ? '' : body.code).trim();
  if (!name) return { ok: false, error: 'empty_name' };

  var students = readStudents_();
  var found = null;
  for (var i = 0; i < students.length; i++) {
    if (students[i].nameLow === name.toLowerCase()) { found = students[i]; break; }
  }
  if (!found) return { ok: false, error: 'unknown_student' };
  if (String(found.active).toLowerCase() === 'no') return { ok: false, error: 'inactive' };

  // per-student code first; optional shared class_code as fallback
  var expected = String(found.code || '').trim();
  if (!expected) expected = String(getSetting_('class_code') || '').trim();
  if (!expected) return { ok: false, error: 'no_code_set' };
  if (code !== expected) return { ok: false, error: 'bad_code' };

  var dev = body.device || {};
  appendRows_([[new Date(), 'login', found.name, '', 'web login', '', '', '', new Date().getTime(),
                String(dev.id || ''), String(dev.label || '')]]);
  return { ok: true, student: found.name, at: nowStr_() };
}

/* ---------------- daily check / active-kick ---------------- */
function check_(body) {
  var name = norm_(body.student || body.name);
  if (!name) return { ok: false, error: 'empty_name' };

  var students = readStudents_();
  var found = null;
  for (var i = 0; i < students.length; i++) {
    if (students[i].nameLow === name.toLowerCase()) { found = students[i]; break; }
  }
  if (!found) return { ok: false, error: 'unknown_student' };

  var active = String(found.active).toLowerCase() !== 'no';
  var lastLoginMs = lastLoginMs_(found.name);
  if (!active) {
    return {
      ok: false, error: 'inactive', kick: true,
      lastLoginMs: lastLoginMs,
      recent: lastLoginMs > 0 && (new Date().getTime() - lastLoginMs) <= KICK_WINDOW_MS
    };
  }
  return { ok: true, student: found.name, lastLoginMs: lastLoginMs, at: nowStr_() };
}

function lastLoginMs_(name) {
  var lg = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB_LOG);
  var last = lg.getLastRow();
  if (last < 2) return 0;
  var start = Math.max(2, last - MAX_LOG_SCAN + 1);
  var vals = lg.getRange(start, 1, last - start + 1, 9).getValues();
  for (var r = vals.length - 1; r >= 0; r--) {
    if (String(vals[r][2] || '') === name && String(vals[r][1] || '') === 'login') {
      return Number(vals[r][8]) || 0;
    }
  }
  return 0;
}

/* ---------------- event logging (batched from the site) ---------------- */
function logEvents_(body) {
  var events = body.events;
  if (!events || !events.length) return { ok: true, appended: 0 };
  if (events.length > MAX_EVENTS_PER_POST) events = events.slice(0, MAX_EVENTS_PER_POST);

  var known = {};
  var students = readStudents_();
  for (var i = 0; i < students.length; i++) known[students[i].nameLow] = students[i].name;

  var dev = body.device || {};
  var devId = String(dev.id || '');
  var devLb = String(dev.label || '');

  var rows = [];
  var skipped = 0;
  for (var j = 0; j < events.length; j++) {
    var ev = events[j] || {};
    var who = known[norm_(ev.student).toLowerCase()];
    if (!who) { skipped++; continue; } // ignore unknown names (garbage guard)
    rows.push([
      new Date(),
      cut_(ev.event, 40),
      who,
      (ev.lesson === '' || ev.lesson == null) ? '' : Number(ev.lesson),
      cut_(ev.detail, 180),
      num_(ev.score), num_(ev.total), num_(ev.seconds),
      new Date().getTime(),
      devId, devLb
    ]);
  }
  if (rows.length) appendRows_(rows);
  return { ok: true, appended: rows.length, skipped: skipped };
}

/* ---------------- roster (names only — codes never leave the sheet) ---------------- */
function roster_() {
  var students = readStudents_();
  var out = [];
  for (var i = 0; i < students.length; i++) {
    if (String(students[i].active).toLowerCase() !== 'no') out.push({ name: students[i].name });
  }
  return { ok: true, students: out };
}

/* ---------------- health (for smoke tests) ---------------- */
function health_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var lg = ss.getSheetByName(TAB_LOG);
  var usedCols = lg.getRange(1, 1, 1, LOG_COLS).getValues()[0].filter(String).length;
  return {
    ok: true, v: 2,
    students: readStudents_().length,
    logRows: Math.max(0, lg.getLastRow() - 1),
    logCols: usedCols,
    time: nowStr_()
  };
}

/* ---------------- teacher progress summary (+ devices & share flag) ---------------- */
function progress_(p) {
  var code = String(p.code || '').trim();
  var teacherCode = String(getSetting_('teacher_code') || '').trim();
  if (!teacherCode || code !== teacherCode) return { ok: false, error: 'bad_teacher_code' };

  var days = parseInt(p.days, 10);
  if (!days || days < 0) days = 0; // 0 = all time
  var since = days ? (new Date().getTime() - days * 86400000) : 0;

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var lg = ss.getSheetByName(TAB_LOG);
  var last = lg.getLastRow();
  var out = { ok: true, generated: nowStr_(), days: days, students: {}, order: [] };

  // register all known students (even without activity)
  var students = readStudents_();
  for (var i = 0; i < students.length; i++) {
    if (String(students[i].active).toLowerCase() === 'no') continue;
    out.students[students[i].name] = blankSummary_();
    out.order.push(students[i].name);
  }

  if (last >= 2) {
    var startRow = Math.max(2, last - MAX_LOG_SCAN + 1);
    var vals = lg.getRange(startRow, 1, last - startRow + 1, LOG_COLS).getValues();
    var dayStart = new Date(); dayStart.setHours(0, 0, 0, 0);
    for (var r = 0; r < vals.length; r++) {
      var row = vals[r];
      var ms = Number(row[8]) || 0;
      if (since && ms < since) continue;
      var name = String(row[2] || '');
      if (!name) continue;
      if (!out.students[name]) { out.students[name] = blankSummary_(); out.order.push(name); }
      var s = out.students[name];
      var ev = String(row[1] || '');
      if (ms > s.lastSeenMs) { s.lastSeenMs = ms; s.lastSeen = String(row[0] || ''); }
      if (ms >= dayStart.getTime()) s.activeToday = true;
      if (ev === 'login') s.logins++;
      else if (ev === 'lesson_open') {
        var ln = Number(row[3]);
        if (ln && s.lessonIds.indexOf(ln) === -1) s.lessonIds.push(ln);
      }
      else if (ev === 'quiz_done') {
        s.quizN++; s.quizSum += Number(row[5]) || 0;
        var sc = Number(row[5]) || 0;
        if (sc > s.quizBest) s.quizBest = sc;
      }
      else if (ev === 'drill_done') {
        s.drillN++;
        var dsc = Number(row[5]) || 0;
        if (dsc > s.drillBest) s.drillBest = dsc;
      }
      else if (ev === 'flashcards_done') s.flashN++;
      else if (ev === 'lesson_time') s.seconds += Number(row[7]) || 0;
      s.events++;

      /* ---- v2: device aggregation + same-time share window ---- */
      var devId = String(row[9] || '');
      if (devId) {
        var dm = s.devMap[devId];
        if (!dm) { dm = s.devMap[devId] = { id: devId, label: String(row[10] || ''), firstMs: ms, lastMs: ms, logins: 0 }; }
        if (ms < dm.firstMs) dm.firstMs = ms;
        if (ms > dm.lastMs) dm.lastMs = ms;
        if (ev === 'login') dm.logins++;
        if (!dm.label && row[10]) dm.label = String(row[10]);
        for (var dk in s.devTimes) {
          if (dk !== devId && Math.abs(ms - s.devTimes[dk]) <= SHARE_WINDOW_MS) s.shareFlag = true;
        }
        s.devTimes[devId] = ms;
      }

      /* ---- v2.1: per-lesson detail (opens · minutes · quiz · drill · mastery) ---- */
      if (row[3] !== '' && row[3] != null) {
        var LN = Number(row[3]);
        if (LN) {
          var lm = s.lessonMap[LN] || (s.lessonMap[LN] = {
            n: LN, opens: 0, seconds: 0, quizBest: 0, quizN: 0, drillBest: 0,
            mastered: 0, total: 0, lastMs: 0
          });
          if (ms > lm.lastMs) lm.lastMs = ms;
          if (ev === 'lesson_open') lm.opens++;
          else if (ev === 'lesson_time') lm.seconds += Number(row[7]) || 0;
          else if (ev === 'quiz_done') { lm.quizN++; var qs2 = Number(row[5]) || 0; if (qs2 > lm.quizBest) lm.quizBest = qs2; }
          else if (ev === 'drill_done') { var ds2 = Number(row[5]) || 0; if (ds2 > lm.drillBest) lm.drillBest = ds2; }
          else if (ev === 'mastery') { lm.mastered = Number(row[5]) || 0; lm.total = Number(row[6]) || 0; }
        }
      }
    }
  }

  // finalize
  var list = [];
  for (var k = 0; k < out.order.length; k++) {
    var nm = out.order[k];
    var sm = out.students[nm];
    sm.name = nm;
    sm.lessonIds.sort(function (a, b) { return a - b; });
    sm.lessons = sm.lessonIds.length;
    sm.quizAvg = sm.quizN ? Math.round(sm.quizSum / sm.quizN * 10) / 10 : 0;
    sm.minutes = Math.round(sm.seconds / 60);
    var det = [];
    for (var lk in sm.lessonMap) {
      var ld = sm.lessonMap[lk];
      ld.minutes = Math.round(ld.seconds / 60);
      det.push(ld);
    }
    det.sort(function (a, b) { return a.n - b.n; });
    sm.lessonsDetail = det;
    delete sm.lessonMap;
    var devs = [];
    for (var dkey in sm.devMap) devs.push(sm.devMap[dkey]);
    devs.sort(function (a, b) { return a.firstMs - b.firstMs; });
    sm.devices = devs;
    sm.deviceCount = devs.length;
    delete sm.devMap;
    delete sm.devTimes;
    list.push(sm);
  }
  list.sort(function (a, b) { return b.lastSeenMs - a.lastSeenMs; });

  // class-level per-lesson totals (opens = عدد الدخول لكل درس)
  var totMap = {};
  for (var ti = 0; ti < list.length; ti++) {
    var dd = list[ti].lessonsDetail || [];
    for (var tj = 0; tj < dd.length; tj++) {
      var t = totMap[dd[tj].n] || (totMap[dd[tj].n] = { n: dd[tj].n, opens: 0, students: 0 });
      t.opens += dd[tj].opens;
      if (dd[tj].lastMs > 0) t.students++;
    }
  }
  var totals = [];
  for (var tk in totMap) totals.push(totMap[tk]);
  totals.sort(function (a, b) { return a.n - b.n; });

  return { ok: true, generated: out.generated, days: days, students: list, lessonTotals: totals };
}

function blankSummary_() {
  return {
    lastSeenMs: 0, lastSeen: '', activeToday: false,
    logins: 0, lessonIds: [], lessons: 0,
    quizN: 0, quizSum: 0, quizBest: 0, quizAvg: 0,
    drillN: 0, drillBest: 0, flashN: 0,
    seconds: 0, minutes: 0, events: 0,
    devMap: {}, devTimes: {}, devices: [], deviceCount: 0, shareFlag: false,
    lessonMap: {}
  };
}

/* ---------------- raw log tail (teacher only) ---------------- */
function tail_(p) {
  var code = String(p.code || '').trim();
  var teacherCode = String(getSetting_('teacher_code') || '').trim();
  if (!teacherCode || code !== teacherCode) return { ok: false, error: 'bad_teacher_code' };
  var n = parseInt(p.rows, 10) || 150;
  if (n > 500) n = 500;
  var lg = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB_LOG);
  var last = lg.getLastRow();
  if (last < 2) return { ok: true, rows: [] };
  var start = Math.max(2, last - n + 1);
  var vals = lg.getRange(start, 1, last - start + 1, LOG_COLS).getValues();
  var rows = vals.map(function (r) {
    return {
      ts: String(r[0] || ''), event: String(r[1] || ''), student: String(r[2] || ''),
      lesson: (r[3] === '' || r[3] == null) ? '' : Number(r[3]),
      detail: String(r[4] || ''),
      score: r[5], total: r[6], seconds: r[7], ms: Number(r[8]) || 0,
      device: String(r[9] || ''), devLabel: String(r[10] || '')
    };
  });
  rows.reverse(); // newest first
  return { ok: true, rows: rows };
}

/* ---------------- helpers ---------------- */
function ensureStructure_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var st = ss.getSheetByName(TAB_STUDENTS) || ss.insertSheet(TAB_STUDENTS);
  if (st.getLastRow() === 0) { st.getRange(1, 1, 1, 4).setValues([STUDENT_HEADERS]); st.setFrozenRows(1); }
  var lg = ss.getSheetByName(TAB_LOG) || ss.insertSheet(TAB_LOG);
  if (lg.getLastRow() === 0) {
    lg.getRange(1, 1, 1, LOG_COLS).setValues([LOG_HEADERS]); lg.setFrozenRows(1);
  } else {
    // v1 → v2 migration: old logs have 9 columns; add the two device headers
    var head = lg.getRange(1, 1, 1, LOG_COLS).getValues()[0];
    if (!head[9]) lg.getRange(1, 10, 1, 2).setValues([['Device', 'DevLabel']]);
  }
  var se = ss.getSheetByName(TAB_SETTINGS) || ss.insertSheet(TAB_SETTINGS);
  if (se.getLastRow() === 0) { se.getRange(1, 1, 1, 2).setValues([['Key', 'Value']]); se.setFrozenRows(1); }
}

function readStudents_() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB_STUDENTS);
  var last = sh.getLastRow();
  if (last < 2) return [];
  var vals = sh.getRange(2, 1, last - 1, 4).getValues();
  var out = [];
  for (var i = 0; i < vals.length; i++) {
    var name = norm_(vals[i][0]);
    if (!name) continue;
    out.push({ name: name, nameLow: name.toLowerCase(), code: vals[i][1], active: vals[i][2] || 'yes', note: vals[i][3] });
  }
  return out;
}

function getSetting_(key) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB_SETTINGS);
  var last = sh.getLastRow();
  if (last < 2) return '';
  var vals = sh.getRange(2, 1, last - 1, 2).getValues();
  for (var i = 0; i < vals.length; i++) {
    if (String(vals[i][0]).trim().toLowerCase() === String(key).toLowerCase()) return String(vals[i][1] == null ? '' : vals[i][1]).trim();
  }
  return '';
}

function appendRows_(rows) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB_LOG);
    var tz = SpreadsheetApp.getActiveSheet ? SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone() : 'Etc/GMT-8';
    tz = tz || 'Etc/GMT-8';
    var stamped = rows.map(function (r) {
      while (r.length < LOG_COLS) r.push('');
      r[0] = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss');
      return r;
    });
    sh.getRange(sh.getLastRow() + 1, 1, stamped.length, LOG_COLS).setValues(stamped);
  } finally {
    lock.releaseLock();
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function norm_(s) { return String(s == null ? '' : s).replace(/[\u3000\s]+/g, ' ').trim(); }
function cut_(s, n) { s = norm_(s); return s.length > n ? s.slice(0, n) : s; }
function num_(v) { return (v === '' || v == null || isNaN(Number(v))) ? '' : Number(v); }
function nowStr_() {
  var tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone() || 'Etc/GMT-8';
  return Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss');
}
