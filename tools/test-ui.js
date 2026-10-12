#!/usr/bin/env node
/* ============================================================
   HSK 1 — UI / telemetry / theme test suite
   ------------------------------------------------------------
   Usage:  node tools/test-ui.js
   Exit 0  => every executed test passed.

   PART 1  teacher.html dashboard  (jsdom + stubbed network)  *
   PART 2  lesson.html telemetry   (real source, vm sandbox)
   PART 3  emerald theme           (css + pages)
   PART 4  config / registry / backend contract

   * PART 1 needs jsdom:  npm i -D jsdom
     If jsdom is absent the part is SKIPPED (not failed) so the
     suite still runs on a machine without dev dependencies.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');

let pass = 0, fail = 0, skip = 0, part = '';
function head(t) { part = t; console.log('\n── ' + t + ' ──'); }
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  ✅ ' + name); }
  else { fail++; console.log('  ❌ ' + name + (extra ? '  → ' + extra : '')); }
}
function skipped(name, why) { skip++; console.log('  ⏭ ' + name + ' (' + why + ')'); }
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ══════════════ fixtures: a fake class ══════════════ */
const NOW = Date.now(), H = 3600e3, D = 864e5;
function dev(id, label, firstMs, lastMs, logins) { return { id, label, firstMs, lastMs, logins }; }
function les(n, opens, minutes, quizBest, drillBest, mastered, total, lastMs) {
  return { n, opens, seconds: minutes * 60, minutes, quizBest, quizN: quizBest ? 1 : 0, drillBest, mastered, total, lastMs };
}
const PROGRESS = {
  ok: true, generated: '2026-10-10 20:00:00', days: 7,
  students: [
    {
      name: 'Sara', lastSeen: '2026-10-10 18:00', lastSeenMs: NOW - 2 * H, activeToday: true,
      logins: 3, lessonIds: [1, 3], lessons: 2, quizN: 2, quizSum: 17, quizBest: 9, quizAvg: 8.5,
      drillN: 1, drillBest: 5, flashN: 2, seconds: 45 * 60, minutes: 45, events: 40, shareFlag: false,
      deviceCount: 1, devices: [dev('dev-sara-1', 'Chrome · Windows', NOW - 5 * D, NOW - 2 * H, 3)],
      lessonsDetail: [les(1, 2, 20, 8, 5, 6, 10, NOW - 3 * H), les(3, 1, 25, 9, 0, 0, 0, NOW - 2 * H)]
    },
    {
      name: 'Omar', lastSeen: '2026-09-30 10:00', lastSeenMs: NOW - 10 * D, activeToday: false,
      logins: 1, lessonIds: [1], lessons: 1, quizN: 0, quizSum: 0, quizBest: 0, quizAvg: 0,
      drillN: 0, drillBest: 0, flashN: 0, seconds: 10 * 60, minutes: 10, events: 6, shareFlag: true,
      deviceCount: 2, devices: [dev('dev-omar-1', 'Safari · iPhone', NOW - 12 * D, NOW - 10 * D, 1),
                                dev('dev-omar-2', 'Edge · Windows', NOW - 10 * D - 3 * H, NOW - 10 * D, 1)],
      lessonsDetail: [les(1, 1, 10, 0, 0, 2, 10, NOW - 10 * D)]
    },
    {
      name: 'Lina', lastSeen: '', lastSeenMs: 0, activeToday: false,
      logins: 0, lessonIds: [], lessons: 0, quizN: 0, quizSum: 0, quizBest: 0, quizAvg: 0,
      drillN: 0, drillBest: 0, flashN: 0, seconds: 0, minutes: 0, events: 0, shareFlag: false,
      deviceCount: 0, devices: [], lessonsDetail: []
    }
  ],
  lessonTotals: [{ n: 1, opens: 3, students: 2 }, { n: 3, opens: 1, students: 1 }]
};
const TAIL = {
  ok: true, rows: [
    { ts: '2026-10-10 19:58:00', event: 'lesson_time', student: 'Sara', lesson: '3', detail: '', score: '', total: '', seconds: '60', device: 'dev-sara-1', devLabel: 'Chrome · Windows' },
    { ts: '2026-10-10 19:57:00', event: 'lesson_open', student: 'Sara', lesson: '3', detail: 'lesson 3', score: '', total: '', seconds: '', device: 'dev-sara-1', devLabel: 'Chrome · Windows' }
  ]
};

/* ══════════════ PART 1 · teacher dashboard ══════════════ */
async function partDashboard() {
  head('PART 1 · teacher.html dashboard (jsdom + stubbed network)');
  let JSDOM, VirtualConsole;
  try { ({ JSDOM, VirtualConsole } = require('jsdom')); }
  catch (e) { skipped('dashboard suite', 'jsdom not installed — npm i -D jsdom'); return; }

  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push('jsdomError: ' + (e.message || e)));
  vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));

  let tailCalls = 0, progressCalls = 0;
  const blobs = [], downloads = [];

  /* Build the DOM without resource loading, then execute the page's own
     <script> tags in document order — fully offline and deterministic. */
  const html = read('teacher.html');
  const dom = new JSDOM(html, {
    runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: vc,
    url: 'https://local.test/teacher.html'
  });
  {
    const window = dom.window;
    window.fetch = function (url) {
      const u = String(url);
      if (/action=tail/.test(u)) { tailCalls++; return Promise.resolve({ json: () => Promise.resolve(TAIL) }); }
      if (/action=progress/.test(u)) { progressCalls++; return Promise.resolve({ json: () => Promise.resolve(PROGRESS) }); }
      return Promise.resolve({ json: () => Promise.resolve({ ok: true }) });
    };
    window.URL.createObjectURL = function (b) { blobs.push(b); return 'blob:mock-' + blobs.length; };
    window.URL.revokeObjectURL = function () {};
    window.HTMLAnchorElement.prototype.click = function () { downloads.push(this.download); };
    window.localStorage.setItem('hsk1:teacherCode', '9999');
    window.addEventListener('error', e => errors.push('window.onerror: ' + (e.message || (e.error && e.error.stack))));

    const re = /<script([^>]*)>([\s\S]*?)<\/script>/g;
    let m, ran = 0;
    while ((m = re.exec(html))) {
      const attrs = m[1] || '', body = m[2] || '';
      const srcM = attrs.match(/src="([^"]+)"/);
      const src = srcM ? fs.readFileSync(path.join(root, srcM[1]), 'utf8') : body;
      if (!src.trim()) continue;
      try { window.eval(src); ran++; }
      catch (e) { errors.push('eval ' + (srcM ? srcM[1] : 'inline#' + ran) + ': ' + e.message); }
    }
    if (!ran) errors.push('no scripts executed');
  }
  await sleep(150);
  const { window } = dom;
  const doc = window.document;
  const $ = s => doc.querySelector(s);
  const $$ = s => Array.prototype.slice.call(doc.querySelectorAll(s));
  await sleep(120);                       // let refresh() resolve
  const fire = (el, t) => el.dispatchEvent(new window.Event(t, { bubbles: true }));
  const click = el => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

  ok('1  page boots with no JS errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  ok('2  progress endpoint was called', progressCalls >= 1, 'calls=' + progressCalls);
  ok('3  generated line filled', /generated 2026-10-10/.test($('#genLine').textContent), $('#genLine').textContent);
  ok('4  7 KPI cards rendered', $$('#kpis .kpi').length === 7, $$('#kpis .kpi').length);
  ok('5  KPI study time = 55m (45+10+0)', $('#kpis').textContent.includes('55m'), $('#kpis').textContent.replace(/\s+/g, ' ').slice(0, 160));
  ok('6  KPI sharing flags = 1', /same-time use!/.test($('#kpis').textContent));
  ok('7  class table lists all 15 lessons', $$('#totBody tr').length === 15, $$('#totBody tr').length);
  const l3row = $$('#totBody tr')[2] || { textContent: '(missing)', innerHTML: '' };
  ok('8  L3 row: 1 student · 25m', /25m/.test(l3row.textContent) && />\s*1\s*</.test(l3row.innerHTML), l3row.textContent.replace(/\s+/g, ' '));

  /* time matrix */
  ok('9  matrix header = student + 15 lessons + total', $$('#mtxHead th').length === 17, $$('#mtxHead th').length);
  ok('10 matrix has 3 student rows', $$('#mtxBody tr').length === 3, $$('#mtxBody tr').length);
  const saraCells = ($$('#mtxBody tr')[0] || { querySelectorAll: () => [{ textContent: '', getAttribute: () => '' }] }).querySelectorAll('td');
  ok('11 Sara × L3 cell = 25', saraCells[3].textContent.trim() === '25', saraCells[3].textContent);
  ok('12 heat background applied to a studied cell', /rgba\(var\(--heat\)/.test(saraCells[3].getAttribute('style') || ''), saraCells[3].getAttribute('style'));
  ok('13 empty cell renders a dot, no heat', saraCells[2].textContent.trim() === '·');
  const foot = $$('#mxFoot tr').length ? $$('#mxFoot tr') : [{ textContent: '(missing)' }];
  ok('14 footer: class total 55m + avg row present', foot.length === 2 && /55m/.test(foot[0].textContent), foot[0] && foot[0].textContent.replace(/\s+/g, ' '));

  /* students tab: sorting + search + idle */
  click($('#views .pill[data-v="stu"]'));
  ok('15 students tab visible, others hidden', $('#v-stu').style.display === '' && $('#v-ov').style.display === 'none');
  ok('16 sortable headers rendered', $$('#dashHead th.srt').length === 13, $$('#dashHead th.srt').length);
  click($('#dashHead th[data-k="name"]'));
  ok('17 sort by name asc → Lina first', /Lina/.test($$('#dashBody tr.main')[0].textContent));
  click($('#dashHead th[data-k="minutes"]'));
  ok('18 sort by minutes desc → Sara first (45m)', /Sara/.test($$('#dashBody tr.main')[0].textContent) && /45m/.test($$('#dashBody tr.main')[0].textContent));
  $('#q').value = 'omar'; fire($('#q'), 'input');
  ok('19 search "omar" → 1 row', $$('#dashBody tr.main').length === 1 && /Omar/.test($('#dashBody').textContent));
  ok('20 flagged student row carries .flag + same-time use!', !!$('#dashBody tr.main.flag') && /same-time use!/.test($('#dashBody').textContent));
  ok('21 idle student row carries .idle + 💤', !!$('#dashBody tr.main.idle'));
  $('#q').value = ''; fire($('#q'), 'input');
  click($$('#dashBody tr.main')[0]);
  ok('22 clicking a row expands its per-lesson mini table', $$('#dashBody tr.drow').some(r => r.style.display !== 'none'));

  /* one-lesson drill-down */
  click($('#views .pill[data-v="les"]'));
  $('#lesSel').value = '3'; fire($('#lesSel'), 'change');
  ok('23 lesson 3: only Sara studied it', $$('#lesBody tr').length === 1 && /Sara/.test($('#lesBody').textContent), $('#lesBody').textContent.replace(/\s+/g, ' '));
  ok('24 lesson 3: Omar + Lina listed as never opened', /Omar/.test($('#lesNone').textContent) && /Lina/.test($('#lesNone').textContent));
  ok('25 lesson KPI cards rendered', $$('#lesKpis .kpi').length === 5, $$('#lesKpis .kpi').length);
  $('#lesSel').value = '1'; fire($('#lesSel'), 'change');
  ok('26 lesson 1: two students, 30m total', $$('#lesBody tr').length === 2 && /30m/.test($('#lesKpis').textContent), $('#lesKpis').textContent.replace(/\s+/g, ' '));

  /* devices + raw log */
  click($('#views .pill[data-v="dev"]'));
  ok('27 devices tab: 4 rows (1 + 2 + placeholder)', $$('#devBody tr').length === 4, $$('#devBody tr').length);
  ok('28 device labels rendered', /Chrome · Windows/.test($('#devBody').textContent) && /Safari · iPhone/.test($('#devBody').textContent));
  click($('#views .pill[data-v="log"]'));
  await sleep(80);
  ok('29 raw log fetched on tab open', tailCalls >= 1, 'calls=' + tailCalls);
  ok('30 raw log renders 2 events with seconds', $$('#logBody tr').length === 2 && /lesson_time/.test($('#logBody').textContent));

  /* CSV export */
  click($('#views .pill[data-v="stu"]'));
  click($('#csvStu'));
  ok('31 CSV download triggered with a file name', downloads.length === 1 && /hsk1-students\.csv/.test(downloads[0] || ''), downloads.join(','));
  const txt = blobs.length ? await blobs[blobs.length - 1].text() : '';
  ok('32 CSV header incl. Minutes/MasteredPct (BOM added in source)',
    /^Student,/.test(txt) && /Minutes/.test(txt) && /MasteredPct/.test(txt) && /'\\ufeff'/.test(read('teacher.html')),
    txt.split('\r\n')[0]);
  ok('33 CSV carries the student rows', /Sara/.test(txt) && /Omar/.test(txt) && /Lina/.test(txt));
  click($('#csvTime'));
  const mtx = blobs.length ? await blobs[blobs.length - 1].text() : '';
  ok('34 time-matrix CSV has 15 lesson columns', (mtx.split('\r\n')[0].match(/L\d+ min/g) || []).length === 15, mtx.split('\r\n')[0]);
  click($('#csvTot'));
  ok('35 class-per-lesson CSV exported', downloads.some(d => /class-per-lesson/.test(d)));

  /* idle threshold control */
  $('#idleDays').value = '30'; fire($('#idleDays'), 'change');
  ok('36 idle threshold 30d → Omar (10d) no longer idle', $('#idleCard').style.display === 'none' || !/Omar/.test($('#idleCard').textContent));
  $('#idleDays').value = '7'; fire($('#idleDays'), 'change');
  ok('37 idle threshold 7d → idle card shows Omar', /Omar/.test($('#idleCard').textContent) && $('#idleCard').style.display === 'block');

  ok('38 no JS errors during the whole run', errors.length === 0, errors.slice(0, 3).join(' | '));
  dom.window.close();
}

/* ══════════════ PART 2 · lesson telemetry ══════════════ */
function partTelemetry() {
  head('PART 2 · lesson.html study-time telemetry (visible time only)');
  const html = read('lesson.html');
  const blocks = html.match(/<script>([\s\S]*?)<\/script>/g) || [];
  const src = blocks.map(b => b.replace(/<\/?script>/g, '')).filter(s => /lesson_time/.test(s)).pop();
  ok('39 telemetry block found in lesson.html', !!src);
  if (!src) return;
  ok('40 telemetry gates on document.hidden', /document\.hidden/.test(src));
  ok('41 telemetry flushes on hide/pagehide', /visibilitychange/.test(src) && /pagehide/.test(src) && /HSK1\.flush\(\)/.test(src));

  /* run the REAL block in a sandbox with a controllable clock */
  const logs = []; let flushes = 0; const timers = [];
  let T = 1e12, hidden = false; const listeners = {};
  const sandbox = {
    console,
    document: { get hidden() { return hidden; }, addEventListener: (t, f) => { (listeners[t] = listeners[t] || []).push(f); } },
    localStorage: { getItem: () => JSON.stringify({ ni: true, hao: true }), setItem: () => {} },
    setInterval: (f, ms) => { timers.push({ f, ms }); return timers.length; },
    addEventListener: (t, f) => { (listeners[t] = listeners[t] || []).push(f); },
    Math, JSON, Date: { now: () => T },
    HSK1: { enabled: () => true, log: (e, d, x) => logs.push({ e, d, x: x || {} }), flush: () => flushes++ },
    window: null
  };
  sandbox.window = sandbox;
  sandbox.window.HSK1 = sandbox.HSK1;
  sandbox.window.__LESSON_ID__ = 3;
  sandbox.window.LESSON = { words: [{}, {}, {}, {}, {}] };
  vm.runInNewContext(src, vm.createContext(sandbox), { filename: 'lesson-telemetry.js' });

  ok('42 lesson_open logged once on start', logs.filter(l => l.e === 'lesson_open').length === 1);
  ok('43 accounting tick registered (15 s)', timers.length === 1 && timers[0].ms === 15000, JSON.stringify(timers.map(t => t.ms)));

  /* 60 visible seconds → one lesson_time of 60 s + a mastery pulse */
  for (let i = 0; i < 4; i++) { T += 15000; timers[0].f(); }
  const t1 = logs.filter(l => l.e === 'lesson_time');
  ok('44 60 visible seconds → lesson_time seconds=60', t1.length === 1 && t1[0].x.seconds === 60, JSON.stringify(t1));
  ok('45 mastery pulse sent with the report', logs.some(l => l.e === 'mastery' && l.x.total === 5 && l.x.score === 2), JSON.stringify(logs.filter(l => l.e === 'mastery')));

  /* hidden time must NOT be counted */
  const before = logs.length;
  hidden = true; T += 120000; timers[0].f(); timers[0].f();
  ok('46 hidden tab time is not counted', logs.filter(l => l.e === 'lesson_time').length === t1.length, 'new events=' + (logs.length - before));

  /* returning to the tab resumes counting; hiding banks + flushes the remainder */
  hidden = false; T += 30000; timers[0].f();
  ok('47 no report before 60 s are banked', logs.filter(l => l.e === 'lesson_time').length === t1.length);
  hidden = true; (listeners['visibilitychange'] || []).forEach(f => f());
  const t2 = logs.filter(l => l.e === 'lesson_time');
  ok('48 hiding the tab banks + reports the remainder (30 s)', t2.length === 2 && t2[1].x.seconds === 30, JSON.stringify(t2));
  ok('49 hiding the tab flushes the queue', flushes >= 1, 'flushes=' + flushes);

  /* pagehide also banks + flushes */
  hidden = false; T += 20000; const f0 = flushes;
  (listeners['pagehide'] || []).forEach(f => f());
  ok('50 pagehide banks (20 s) and flushes', logs.filter(l => l.e === 'lesson_time').length === 3 &&
    logs.filter(l => l.e === 'lesson_time')[2].x.seconds === 20 && flushes > f0);
}

/* ══════════════ PART 3 · emerald theme ══════════════ */
function partTheme() {
  head('PART 3 · emerald theme (HSK 1 identity)');
  const css = read('css/style.css');
  const lightRoot = css.slice(css.indexOf(':root'), css.indexOf('body.dark'));
  const darkRoot = css.slice(css.indexOf('body.dark'), css.indexOf('* { margin'));
  ok('51 light accent is emerald #0e7a4f', /--acc:\s*#0e7a4f/i.test(lightRoot));
  ok('52 light accent gradient uses #14b87a', /--grad-acc:[^;]*#14b87a/i.test(lightRoot));
  ok('53 dark accent is bright emerald #3ddc97', /--acc:\s*#3ddc97/i.test(darkRoot));
  ok('54 semantic red kept only as --bad', /--bad:\s*#dc2626/i.test(lightRoot) && /--bad:\s*#ff6f61/i.test(darkRoot));
  ok('55 --bad-soft/--bad-line exist (wrong answers stay red)', /--bad-soft/.test(lightRoot) && /--bad-line/.test(darkRoot));
  ok('56 no HSK2 red left in the css identity', !/#(e0483e|c9302c|ff8a5c|ff8a70|ff9068)/i.test(css));
  ok('57 pulse/scroll/ring shadows re-tinted green', (css.match(/rgba\(14,122,79/g) || []).length >= 3, String((css.match(/rgba\(14,122,79/g) || []).length));
  ok('58 wrong-answer rules use bad-soft, not acc-soft',
    /\.choice\.wrong[^}]*--bad-soft/.test(css) && /\.opt\.wrong[^}]*--bad-soft/.test(css) && /\.quiz-feedback\.bad[^}]*--bad-soft/.test(css));

  ['index.html', 'lesson.html', 'gate.html', 'teacher.html'].forEach(p => {
    const h = read(p);
    ok('59 favicon of ' + p + ' is green', /fill='%230e7a4f'/.test(h) && !/%23e0483e|%23d99a2b/.test(h));
  });
  const gate = read('gate.html');
  ok('60 gate.html has no --red identity left', !/--red\s*:/.test(gate) && !/var\(--red\)/.test(gate) && /--brand:#0e7a4f/.test(gate));
  ok('61 gate dark mode re-defines the brand green', /:root\{[^}]*--brand:#3ddc97/.test(gate));
  ok('62 teacher seal 师 no longer gold-inline', !/brand-seal" style="background:var\(--gold\)/.test(read('teacher.html')));
  ok('63 index seal shows the HSK 1 character 一', /<span>一<\/span><small>HSK 1<\/small>/.test(read('index.html')));
}

/* ══════════════ PART 4 · config / registry / backend ══════════════ */
function partConfig() {
  head('PART 4 · config · registry · backend contract');
  const cfgSrc = read('js/config.js');
  const w = {}; new Function('window', cfgSrc)(w);
  const cfg = w.HSK1_CONFIG;
  ok('64 HSK1_CONFIG exists (no HSK2_CONFIG)', !!cfg && !/HSK2_CONFIG/.test(cfgSrc));
  ok('65 sheetsUrl is the live HSK 1 /exec endpoint', /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(cfg.sheetsUrl || ''), String(cfg.sheetsUrl).slice(0, 60));
  ok('66 bridge enabled', cfg.enabled === true);
  ok('67 storage keys use the hsk1: prefix', cfg.sessionKey === 'hsk1:session' && cfg.deviceKey === 'hsk1:deviceId');
  ok('68 batch interval 20 s', cfg.flushMs === 20000);

  const cw = {}; new Function('window', read('js/course.js'))(cw);
  const C = cw.COURSE;
  ok('69 registry id/name follow the real book', C.id === 'hsk1' && C.name === 'New HSK Course 1' && C.nameHz === '新HSK教程 1');
  ok('70 registry has 15 lessons 1..15', C.lessons.length === 15 && C.lessons.every((l, i) => l.n === i + 1));
  ok('71 lessons 1-5 ready, 6-15 soon', C.lessons.slice(0,5).every(l => l.status === 'ready') && C.lessons.slice(5).every(l => l.status === 'soon'));
  ok('71c lesson 2 counts match its data (15/2/3)', C.lessons[1].wordCount === 15 && C.lessons[1].grammarCount === 2 && C.lessons[1].dialogueCount === 3);
  ok('71d lesson 3 counts match its data (22/4/3)', C.lessons[2].wordCount === 22 && C.lessons[2].grammarCount === 4 && C.lessons[2].dialogueCount === 3);
  ok('71e lesson 4 counts match its data (21/4/3)', C.lessons[3].wordCount === 21 && C.lessons[3].grammarCount === 4 && C.lessons[3].dialogueCount === 3);
  ok('71f lesson 5 counts match its data (22/3/3)', C.lessons[4].wordCount === 22 && C.lessons[4].grammarCount === 3 && C.lessons[4].dialogueCount === 3);
  ok('71b lesson 1 counts match its data (14/2/3)', C.lessons[0].wordCount === 14 && C.lessons[0].grammarCount === 2 && C.lessons[0].dialogueCount === 3);
  ok('72 soon lessons carry no counts (validator skips them)', C.lessons.slice(5).every(l => l.wordCount == null && l.grammarCount == null && l.dialogueCount == null));
  ok('73 lesson 1 title = AI小语，你好！ / Hello, AI Xiaoyu!', C.lessons[0].hz === 'AI小语，你好！' && C.lessons[0].en === 'Hello, AI Xiaoyu!');
  ok('73b lessons 6-15 are TOC placeholders (hz = —)', C.lessons.slice(5).every(l => l.hz === '—'));
  ok('73e lesson 3 title = 我是中国人 / I\'m Chinese', C.lessons[2].hz === '我是中国人' && C.lessons[2].en === "I'm Chinese");
  ok('73f lesson 4 title = 我有两个孩子 / I have two children', C.lessons[3].hz === '我有两个孩子' && C.lessons[3].en === 'I have two children');
  ok('73g lesson 5 title = 今天我休息 / I\'m off today', C.lessons[4].hz === '今天我休息' && C.lessons[4].en === "I'm off today");
  ok('73d lesson 2 title = 我叫李文 / My name is Li Wen', C.lessons[1].hz === '我叫李文' && C.lessons[1].en === 'My name is Li Wen');
  ok('73c book field names the FLTRP series', /新HSK教程1/.test(C.book || '') && /FLTRP/.test(C.book || ''));

  const gs = read('google-sheets/Code.gs');
  ok('74 Code.gs keeps the 11-column log contract', /LOG_HEADERS\s*=\s*\['Timestamp', 'Event', 'Student', 'Lesson', 'Detail', 'Score', 'Total', 'Seconds', 'EpochMs', 'Device', 'DevLabel'\]/.test(gs));
  ok('75 Code.gs identifies itself as hsk1-sheets', /service:\s*'hsk1-sheets'/.test(gs));
  ok('76 all 8 backend actions present', ['ping', 'roster', 'health', 'progress', 'tail', 'login_', 'logEvents_', 'check_'].every(a => gs.includes(a)));
  /* KNOWN GAP (found 2026-10-10): the HSK 2 reference shipped to us has NO device-block
     feature, although the project brief lists `setBlocked` + `blocked_devices` + block/unblock
     buttons in teacher.html. Verified three ways: zero "blocked" hits in Code.gs / sheets.js /
     gate.html / teacher.html, and the live HSK 1 endpoint answers POST setBlocked with
     {"error":"unknown_action"}. Tracked as an open decision, not a test failure. */
  if (/setBlocked/.test(gs)) ok('76b device-block action implemented', true);
  else skipped('76b setBlocked / blocked_devices', 'missing from the HSK 2 reference — awaiting decision');
  ok('77 share window 2 h · kick window 24 h unchanged', /SHARE_WINDOW_MS = 2 \* 3600 \* 1000/.test(gs) && /KICK_WINDOW_MS\s*=\s*24 \* 3600 \* 1000/.test(gs));

  const sheets = read('js/sheets.js');
  ok('78 sheets.js exports window.HSK1', /window\.HSK1\s*=/.test(sheets) && !/window\.HSK2\s*=/.test(sheets));
  const app = read('js/app.js'), hub = read('js/hub.js');
  ok('79 app/hub use hsk1: storage keys only', !/hsk2[:-]/.test(app) && !/hsk2[:-]/.test(hub) && /'hsk1-l'/.test(app) && /hsk1-l/.test(hub));
  const tele = read('lesson.html');
  ok('80 lesson.html reports through HSK1 (renamed global)', /HSK1\.log\('lesson_time'/.test(tele) && !/HSK2\./.test(tele));
}

/* ══════════════ run ══════════════ */
(async function main() {
  console.log('HSK 1 · UI & telemetry suite');
  await partDashboard();
  partTelemetry();
  partTheme();
  partConfig();
  console.log('\n════ RESULT: ' + pass + ' passed · ' + fail + ' failed' + (skip ? ' · ' + skip + ' skipped' : '') + ' ════');
  process.exit(fail ? 1 : 0);
})();
