/* ============================================================
   HSK 1 — v2 rebuild test suite (target: 32/32)
   Runs the REAL Code.gs against the mock Apps Script env,
   then the REAL js/sheets.js against stubbed browser globals.
   Includes the simulated leak: a code reused from a 2nd device
   inside the 2h window → shareFlag + same-time use.
   Run:  node tools/test-v2.js
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { makeEnv, loadCode } = require('./mock-server.js');

let pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; console.log('  ✅ ' + name); }
  else { fail++; console.log('  ❌ ' + name); }
}
const H = 3600000;
const T0 = Date.UTC(2026, 9, 4, 9, 0, 0);   // fixed clock base

/* ============ PART 1 — server (Code.gs v2) ============ */
console.log('\n── PART 1 · Code.gs v2 on mock Apps Script ──');
const env = makeEnv(T0);
const api = loadCode(env);

const devA = { id: 'dev-aaaa-chrome-win', label: 'Chrome/Windows · ar · Asia/Riyadh' };
const devB = { id: 'dev-bbbb-safari-ios', label: 'Safari/iOS · en · Asia/Riyadh' };

let r = api.setup();
/* mirror the teacher's LIVE sheet names (Mero/Bero/王五) instead of setup examples */
const stSeed = api.getSS().getSheetByName('Students');
stSeed.rows[1] = ['Mero', '1111', 'yes', ''];
stSeed.rows[2] = ['Bero', '2222', 'yes', ''];
stSeed.rows[3] = ['王五', '3333', 'no', ''];
ok('1  setup() seeds tabs', /OK/.test(r) && !!api.getSS().getSheetByName('Students'));
ok('2  Students seeded with 3 example rows', api.getSS().getSheetByName('Students').getLastRow() === 4);
ok('3  Settings seeded (teacher_code 9999)', api.getSS().getSheetByName('Settings').rows[1][1] === '9999');

let ping = api.get('ping');
ok('4  ping ok + v:2', ping.ok === true && ping.v === 2);
let health = api.get('health');
ok('5  health reports 11 log columns', health.logCols === 11);

let lg = api.post({ action: 'login', name: 'Mero', code: '1111', device: devA });
ok('6  login Mero/1111 ok', lg.ok === true && lg.student === 'Mero');
const logSheet = api.getSS().getSheetByName('Log');
const row1 = logSheet.rows[1];
ok('7  login row stores Device + DevLabel', row1[9] === devA.id && row1[10] === devA.label);
ok('8  bad code rejected', api.post({ action: 'login', name: 'Mero', code: '0000', device: devA }).error === 'bad_code');
ok('9  unknown student rejected', api.post({ action: 'login', name: 'Ghost', code: '1111', device: devA }).error === 'unknown_student');
ok('10 inactive student rejected', api.post({ action: 'login', name: '王五', code: '3333', device: devA }).error === 'inactive');
ok('11 roster hides inactive', api.get('roster').students.length === 2);

let logged = api.post({ action: 'log', device: devA, events: [
  { event: 'lesson_open', student: 'Mero', lesson: 7, detail: 'lesson 7' },
  { event: 'quiz_done', student: 'Mero', lesson: 7, detail: 'score 9/10', score: 9, total: 10 }
]});
ok('12 batch of 2 events appended', logged.appended === 2);
let skipped = api.post({ action: 'log', device: devA, events: [
  { event: 'lesson_open', student: 'Nobody', lesson: 1 },
  { event: 'lesson_time', student: 'Mero', lesson: 7, seconds: 60 }
]});
ok('13 unknown names skipped, known kept', skipped.skipped === 1 && skipped.appended === 1);

ok('14 progress rejects bad teacher code', api.get('progress', { code: 'nope' }).error === 'bad_teacher_code');
let prog = api.get('progress', { code: '9999', days: 0 });
const mero = prog.students.find(s => s.name === 'Mero');
ok('15 progress lists Mero', !!mero);
ok('16 one device so far', mero.deviceCount === 1);

/* ---- the simulated leak: code reused from a 2nd device ---- */
env.now.t = T0 + 5 * 60000;                      // +5 min, inside the 2h window
api.post({ action: 'login', name: 'Mero', code: '1111', device: devB });   // leaked code
api.post({ action: 'log', device: devB, events: [{ event: 'lesson_open', student: 'Mero', lesson: 8 }] });
prog = api.get('progress', { code: '9999', days: 0 });
const mero2 = prog.students.find(s => s.name === 'Mero');
ok('17 leak → deviceCount 2', mero2.deviceCount === 2);
ok('18 leak → shareFlag (same-time use!)', mero2.shareFlag === true);
ok('19 both device labels aggregated',
  mero2.devices.some(d => d.label === devA.label) && mero2.devices.some(d => d.label === devB.label));

ok('20 check() ok while active', api.post({ action: 'check', student: 'Mero', device: devA }).ok === true);
/* teacher deactivates Mero in the sheet */
const st = api.getSS().getSheetByName('Students');
st.rows[1][2] = 'no';
let chk = api.post({ action: 'check', student: 'Mero', device: devA });
ok('21 Active=no → check kicks (recent ≤24h)', chk.error === 'inactive' && chk.kick === true && chk.recent === true);
ok('22 deactivated login refused', api.post({ action: 'login', name: 'Mero', code: '1111', device: devA }).error === 'inactive');
ok('23 roster drops deactivated student', api.get('roster').students.length === 1);

/* ============ PART 2 — v1 → v2 migration on an OLD 9-column sheet ============ */
console.log('\n── PART 2 · v1 → v2 migration ──');
const env2 = makeEnv(T0);
const api2 = loadCode(env2);
const SS2 = env2.SS;
SS2.insertSheet('Students').rows = [
  ['Name', 'Code', 'Active', 'Note'],
  ['Mero', '1111', 'yes', '']
];
SS2.insertSheet('Log').rows = [
  ['Timestamp', 'Event', 'Student', 'Lesson', 'Detail', 'Score', 'Total', 'Seconds', 'EpochMs'],
  ['2026-09-20 10:00:00', 'lesson_open', 'Mero', 3, 'old row', '', '', '', T0 - 40 * 24 * H],
  ['2026-09-20 10:05:00', 'quiz_done', 'Mero', 3, 'old row', 8, 10, '', T0 - 40 * 24 * H]
];
SS2.insertSheet('Settings').rows = [['Key', 'Value'], ['teacher_code', '9999'], ['class_code', '']];
api2.get('ping');                                  // ensureStructure_ migrates on any call
const head2 = SS2.getSheetByName('Log').rows[0];
ok('24 old 9-col log auto-migrates headers', head2[9] === 'Device' && head2[10] === 'DevLabel');
const prog2 = api2.get('progress', { code: '9999', days: 0 });
const meroOld = prog2.students.find(s => s.name === 'Mero');
ok('25 old rows still aggregate (0 devices)', meroOld.events === 2 && meroOld.deviceCount === 0);

/* ============ PART 3 — raw log tail ============ */
console.log('\n── PART 3 · raw log tail ──');
ok('26 tail rejects bad teacher code', api.get('tail', { code: 'x' }).error === 'bad_teacher_code');
const tail = api.get('tail', { code: '9999', rows: 50 });
ok('27 tail newest-first', tail.rows[0].event === 'lesson_open' && tail.rows[0].lesson === 8);
ok('28 tail carries devLabel', tail.rows.some(x => x.devLabel === devB.label));

/* ============ PART 4 — share window boundaries + batch cap ============ */
console.log('\n── PART 4 · share window boundaries ──');
const env3 = makeEnv(T0);
const api3 = loadCode(env3);
api3.setup();
const st3 = api3.getSS().getSheetByName('Students');
st3.rows[1] = ['Mero', '1111', 'yes', ''];
st3.rows[2] = ['Bero', '2222', 'yes', ''];
st3.rows[3] = ['王五', '3333', 'no', ''];
const devC = { id: 'dev-cccc', label: 'Chrome/Windows · ar · Asia/Riyadh' };
const devD = { id: 'dev-dddd', label: 'Firefox/Linux · ar · Asia/Riyadh' };
api3.post({ action: 'login', name: 'Bero', code: '2222', device: devC });
api3.post({ action: 'log', device: devC, events: [{ event: 'lesson_open', student: 'Bero', lesson: 1 }] });
env3.now.t = T0 + 3 * H;                           // 3 hours later (> 2h window)
api3.post({ action: 'log', device: devD, events: [{ event: 'lesson_open', student: 'Bero', lesson: 2 }] });
const prog3 = api3.get('progress', { code: '9999', days: 0 });
const bero = prog3.students.find(s => s.name === 'Bero');
ok('29 two devices 3h apart → no flag', bero.deviceCount === 2 && bero.shareFlag === false);

const big = [];
for (let i = 0; i < 70; i++) big.push({ event: 'lesson_time', student: 'Bero', lesson: 1, seconds: 60 });
ok('30 post capped at 60 events', api3.post({ action: 'log', device: devC, events: big }).appended === 60);

/* ============ PART 5 — client (js/sheets.js) on stubbed browser ============ */
console.log('\n── PART 5 · js/sheets.js on stubbed browser ──');
function bootSheetsJs(lsStore, fetchHandler) {
  const win = {
    HSK1_CONFIG: {
      sheetsUrl: 'https://mock/exec', enabled: true,
      gatePage: 'gate.html', sessionKey: 'hsk1:session', deviceKey: 'hsk1:deviceId',
      checkEveryMs: 12 * H, flushMs: 20000
    },
    localStorage: {
      getItem: k => (k in lsStore ? lsStore[k] : null),
      setItem: (k, v) => { lsStore[k] = String(v); },
      removeItem: k => { delete lsStore[k]; }
    },
    addEventListener() {},
    crypto: require('crypto').webcrypto
  };
  const loc = { replaced: null, pathname: '/index.html', search: '', replace(u) { this.replaced = u; } };
  const nav = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/129 Safari/537.36',
    language: 'ar'
  };
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'sheets.js'), 'utf8');
  const f = new Function('window', 'navigator', 'location', 'fetch',
    src + '\n;return window.HSK1;');
  return { H2: f(win, nav, loc, fetchHandler), loc: loc };
}

const lsStore = {};
const boot = bootSheetsJs(lsStore, (url, opts) => {
  const body = JSON.parse(opts.body);
  if (body.action === 'login') return Promise.resolve({ json: () => Promise.resolve({ ok: true, student: 'Mero' }) });
  if (body.action === 'check') return Promise.resolve({ json: () => Promise.resolve({ ok: false, error: 'inactive', kick: true, recent: true }) });
  return Promise.resolve({ json: () => Promise.resolve({ ok: true }) });
});
const H2 = boot.H2, loc = boot.loc;

ok('31 deviceId persisted + label format',
  !!lsStore['hsk1:deviceId'] &&
  /Chrome\/Windows · ar · /.test(H2.devLabel) &&
  bootSheetsJs(lsStore, () => Promise.resolve({ json: () => Promise.resolve({}) })).H2.deviceId === H2.deviceId);

H2.login('Mero', '1111').then(() => {
  const sess = JSON.parse(lsStore['hsk1:session'] || 'null');
  const sessOk = !!sess && sess.student === 'Mero' && sess.deviceId === H2.deviceId;
  return H2.check().then(() => {
    const kickOk = /gate\.html\?kick=1&msg=/.test(String(loc.replaced)) && !('hsk1:session' in lsStore);
    ok('32 login stores session + inactive check kicks to gate', sessOk && kickOk);

    /* ============ PART 6 — per-lesson analytics (v2.1) ============ */
    console.log('\n── PART 6 · per-lesson progress & opens ──');
    const env4 = makeEnv(T0);
    const api4 = loadCode(env4);
    api4.setup();
    const st4 = api4.getSS().getSheetByName('Students');
    st4.rows[1] = ['Mero', '1111', 'yes', ''];
    st4.rows[2] = ['Bero', '2222', 'yes', ''];
    st4.rows[3] = ['王五', '3333', 'no', ''];
    const devE = { id: 'dev-eeee', label: 'Chrome/Windows · ar · Asia/Riyadh' };
    api4.post({ action: 'login', name: 'Mero', code: '1111', device: devE });
    api4.post({ action: 'log', device: devE, events: [
      { event: 'lesson_open', student: 'Mero', lesson: 7 },
      { event: 'lesson_time', student: 'Mero', lesson: 7, seconds: 60 },
      { event: 'quiz_done', student: 'Mero', lesson: 7, score: 9, total: 10 },
      { event: 'mastery', student: 'Mero', lesson: 7, score: 5, total: 13 },
      { event: 'lesson_open', student: 'Mero', lesson: 7 },
      { event: 'quiz_done', student: 'Mero', lesson: 7, score: 6, total: 10 },
      { event: 'lesson_open', student: 'Mero', lesson: 8 }
    ]});
    const p4 = api4.get('progress', { code: '9999', days: 0 });
    const m4 = p4.students.find(s => s.name === 'Mero');
    const d7 = m4.lessonsDetail.find(d => d.n === 7);
    ok('33 per-lesson detail: opens & minutes', d7.opens === 2 && d7.minutes === 1);
    ok('34 per-lesson quiz best keeps max (9 not 6)', d7.quizBest === 9);
    ok('35 mastery latest stored (5/13)', d7.mastered === 5 && d7.total === 13);
    const t7 = p4.lessonTotals.find(t => t.n === 7);
    const t8 = p4.lessonTotals.find(t => t.n === 8);
    ok('36 class lessonTotals (L7 opens 2 · L8 opens 1)', t7.opens === 2 && t7.students === 1 && t8.opens === 1);

    console.log('\n════ RESULT: ' + pass + '/' + (pass + fail) + ' ════');
    process.exit(fail ? 1 : 0);
  });
});
