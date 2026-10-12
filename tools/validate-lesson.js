#!/usr/bin/env node
/* ============================================================
   HSK 1 — lesson data validator (rebuilt to the README contract)
   Usage:
     node tools/validate-lesson.js 7      # one lesson
     node tools/validate-lesson.js all    # all 15
   Exit code 0 ⇒ no ERRORS. Warnings = audio not on disk yet etc.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

function load(rel) {
  const src = fs.readFileSync(path.join(root, rel), 'utf8');
  const window = {};
  new Function('window', src)(window);
  return window;
}
const COURSE = load('js/course.js').COURSE;

function validate(n) {
  const errors = [], warns = [];
  let w;
  try { w = load('js/data/lesson' + n + '.js'); }
  catch (e) { return { errors: ['file unreadable: ' + e.message], warns }; }
  const L = w.LESSON;
  if (!L) return { errors: ['window.LESSON missing'], warns };

  /* ---- meta ---- */
  const m = L.meta || {};
  if (m.lesson !== n) errors.push('meta.lesson !== ' + n);
  if (!m.title) errors.push('meta.title missing');
  if (!m.titlePinyin) errors.push('meta.titlePinyin missing');
  if (!m.titleEn) errors.push('meta.titleEn missing');
  const base = 'audio/l' + String(n).padStart(2, '0') + '/';
  if (m.audioBase !== base) errors.push('meta.audioBase !== ' + base);

  /* ---- words ---- */
  const words = Array.isArray(L.words) ? L.words : [];
  if (!words.length) errors.push('words empty');
  words.forEach((wd, i) => {
    if (!wd.id) errors.push('words[' + i + '].id missing');
    if (!wd.hz) errors.push('words[' + i + '].hz missing');
    if (!wd.pinyin) errors.push('words[' + i + '].pinyin missing');
    if (!wd.en) errors.push('words[' + i + '].en missing');
    if (!wd.example || !wd.example.hz || !wd.example.en) errors.push('words[' + i + '].example incomplete');
    if (!wd.audio || !wd.audio.word) errors.push('words[' + i + '].audio.word missing');
  });

  /* ---- grammar ---- */
  const gr = Array.isArray(L.grammar) ? L.grammar : [];
  if (!gr.length) errors.push('grammar empty');
  gr.forEach((g, i) => {
    if (!g.id) errors.push('grammar[' + i + '].id missing');
    if (!g.title) errors.push('grammar[' + i + '].title missing');
    if (!Array.isArray(g.patterns) || !g.patterns.length) errors.push('grammar[' + i + '].patterns missing');
    if (!g.explain) errors.push('grammar[' + i + '].explain missing');
    const ex = Array.isArray(g.examples) ? g.examples : [];
    if (!ex.length) warns.push('grammar[' + i + '] has no examples');
    ex.forEach((e, j) => {
      if (!e.hz || !e.pinyin || !e.en) errors.push('grammar[' + i + '].examples[' + j + '] incomplete');
    });
  });

  /* ---- bonus (optional) ---- */
  if (L.bonus != null && !Array.isArray(L.bonus)) errors.push('bonus must be an array');

  /* ---- dialogues ---- */
  const dl = Array.isArray(L.dialogues) ? L.dialogues : [];
  if (!dl.length) errors.push('dialogues empty');
  dl.forEach((d, i) => {
    if (!d.id) errors.push('dialogues[' + i + '].id missing');
    const lines = Array.isArray(d.lines) ? d.lines : [];
    if (!lines.length) errors.push('dialogues[' + i + '].lines empty');
    const voices = d.spVoices || {};
    if (!Object.keys(voices).length) errors.push('dialogues[' + i + '].spVoices missing');
    lines.forEach((ln, j) => {
      if (!ln.sp || !voices[ln.sp]) errors.push('dialogues[' + i + '].lines[' + j + '].sp not in spVoices');
      if (!ln.hz || !ln.pinyin || !ln.en) errors.push('dialogues[' + i + '].lines[' + j + '] text incomplete');
      if (!ln.audio) warns.push('dialogues[' + i + '].lines[' + j + '] no audio path');
    });
    if (!Array.isArray(d.questions)) errors.push('dialogues[' + i + '].questions missing');
  });

  /* ---- registry cross-check ---- */
  const reg = (COURSE.lessons || []).find(x => x.n === n) || {};
  if (!reg.n) errors.push('lesson not in js/course.js registry');
  if (reg.wordCount != null && reg.wordCount !== words.length)
    errors.push('registry wordCount ' + reg.wordCount + ' != words ' + words.length);
  if (reg.grammarCount != null && reg.grammarCount !== gr.length)
    errors.push('registry grammarCount ' + reg.grammarCount + ' != grammar ' + gr.length);
  if (reg.dialogueCount != null && reg.dialogueCount !== dl.length)
    errors.push('registry dialogueCount ' + reg.dialogueCount + ' != dialogues ' + dl.length);
  if (reg.status !== 'ready') warns.push('registry status is not "ready"');

  /* ---- audio manifest vs disk ---- */
  const ready = Array.isArray(L.audioReady) ? L.audioReady : [];
  const seen = new Set();
  let missing = 0;
  ready.forEach(p => {
    if (seen.has(p)) errors.push('duplicate audioReady path ' + p);
    seen.add(p);
    if (!fs.existsSync(path.join(root, base, p))) missing++;
  });
  if (missing) warns.push(missing + ' audioReady file(s) not on disk (browser-TTS fallback until generated)');

  /* ---- referenced paths declared in manifest? ---- */
  const refs = [];
  words.forEach(wd => {
    if (wd.audio) {
      if (wd.audio.word) refs.push(wd.audio.word);
      if (wd.audio.sentence) refs.push(wd.audio.sentence);
    }
  });
  dl.forEach(d => (d.lines || []).forEach(ln => { if (ln.audio) refs.push(ln.audio); }));
  gr.forEach(g => (g.examples || []).forEach(e => { if (e.audio) refs.push(e.audio); }));
  const undeclared = refs.filter(p => !seen.has(p));
  if (undeclared.length) warns.push(undeclared.length + ' referenced audio path(s) missing from audioReady');

  return { errors, warns, stats: { words: words.length, grammar: gr.length, dialogues: dl.length, ready: ready.length } };
}

const arg = process.argv[2] || 'all';
const list = arg === 'all' ? COURSE.lessons.map(l => l.n) : [parseInt(arg, 10)];
let bad = 0;
list.forEach(n => {
  const r = validate(n);
  const tag = r.errors.length ? '❌' : '✅';
  console.log(tag + ' Lesson ' + n + ': ' + r.errors.length + ' errors, ' + r.warns.length + ' warnings' +
    (r.stats ? '  · words ' + r.stats.words + ' · grammar ' + r.stats.grammar +
      ' · dlg ' + r.stats.dialogues + ' · audioReady ' + r.stats.ready : ''));
  r.errors.slice(0, 8).forEach(e => console.log('     E: ' + e));
  r.warns.slice(0, 3).forEach(x => console.log('     W: ' + x));
  if (r.errors.length) bad = 1;
});
process.exit(bad);
