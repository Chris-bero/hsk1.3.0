/* ============================================================
   HSK Course — Lesson player · Application logic v3
   Lesson-agnostic: works with any js/data/lessonN.js
   Vanilla JS · works from file:// · loaded via js/loader.js
   ============================================================ */
(() => {
  'use strict';

  const L = window.LESSON;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const shuffle = a => { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  if (!L) return; // data file missing — lesson.html shows its error box

  const LESSON_N = L.meta.lesson || window.__LESSON_ID__ || 7;

  /* ---------------- Storage ----------------
     settings → shared course-wide   ('hsk1:settings')
     progress → per lesson           ('hsk1-l7:mastered' …)  */
  const PROG = 'hsk1-l' + LESSON_N + ':';
  const SETT = 'hsk1:settings';

  function readJSON(key, d) { try { const v = localStorage.getItem(key); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function writeJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { } }
  function rawGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function rawSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }

  /* One-time migration from the single-lesson build (old 'hsk1l7:' keys) */
  (function migrate() {
    const oldP = 'hsk1l7:';
    if (LESSON_N === 7) {
      ['mastered', 'quizBest', 'drillBest'].forEach(k => {
        const ov = rawGet(oldP + k);
        if (ov != null && rawGet(PROG + k) == null) rawSet(PROG + k, ov);
      });
    }
    if (rawGet(SETT) == null) {
      const s = {};
      ['pinyin', 'en', 'dark', 'speed'].forEach(k => {
        const ov = rawGet(oldP + k);
        if (ov != null) { try { s[k] = JSON.parse(ov); } catch (e) { } }
      });
      if (Object.keys(s).length) writeJSON(SETT, s);
    }
  })();

  const saved = readJSON(SETT, {});
  const store = {
    get(k, d) { return readJSON(PROG + k, d); },
    set(k, v) { writeJSON(PROG + k, v); }
  };

  /* ---------------- State ---------------- */
  const state = {
    pinyin: saved.pinyin != null ? saved.pinyin : true,
    en: saved.en != null ? saved.en : true,
    dark: saved.dark != null ? saved.dark : (window.matchMedia ? matchMedia('(prefers-color-scheme: dark)').matches : false),
    speed: saved.speed != null ? saved.speed : 1,   // GLOBAL playback speed for every audio
    wordFilter: 'all',
    mastered: store.get('mastered', {}),
    quizBest: store.get('quizBest', 0),
    drillBest: store.get('drillBest', 0)
  };
  function saveSettings() {
    writeJSON(SETT, { pinyin: state.pinyin, en: state.en, dark: state.dark, speed: state.speed });
  }

  /* ---------------- Audio manager ----------------
     Real files listed in LESSON.audioReady play as recordings;
     anything else falls back to browser speech synthesis.
     state.speed applies to BOTH files and TTS everywhere.      */
  const readySet = new Set(L.audioReady || []);
  let zhVoice = null;

  function findVoice() {
    if (!('speechSynthesis' in window)) return null;
    const vs = speechSynthesis.getVoices() || [];
    return vs.find(v => /zh[-_]CN/i.test(v.lang) && /female|xiaoxiao|xiaoyi|yaoyao|huihui|ting|mei|han/i.test(v.name))
        || vs.find(v => /^zh/i.test(v.lang))
        || null;
  }
  if ('speechSynthesis' in window) {
    zhVoice = findVoice();
    speechSynthesis.onvoiceschanged = () => { zhVoice = findVoice(); };
  }

  const AM = {
    current: null,
    cancelled: false,

    tts(text, rate) {
      return new Promise(res => {
        if (!('speechSynthesis' in window) || !text) return res();
        try {
          speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(text);
          u.lang = 'zh-CN';
          if (zhVoice) u.voice = zhVoice;
          u.rate = clamp(rate == null ? state.speed : rate, 0.35, 1.4);
          let done = false;
          const fin = () => { if (!done) { done = true; res(); } };
          u.onend = fin; u.onerror = fin;
          speechSynthesis.speak(u);
          setTimeout(fin, 18000); // safety
        } catch (e) { res(); }
      });
    },

    /* Play a recorded file if available (at global speed), else speak it */
    play(path, text, rate) {
      const r = rate == null ? state.speed : rate;
      return new Promise(res => {
        if (this.current) { try { this.current.pause(); } catch (e) { } this.current = null; }
        if (!path || !readySet.has(path)) { this.tts(text, r).then(res); return; }
        const a = new Audio(L.meta.audioBase + path);
        a.playbackRate = clamp(r, 0.4, 1.6);
        this.current = a;
        let done = false;
        const finish = () => { if (!done) { done = true; res(); } };
        a.onended = finish;
        a.onerror = () => { this.tts(text, r).then(finish); };
        a.play().catch(() => { this.tts(text, r).then(finish); });
        setTimeout(finish, 60000); // safety
      });
    },

    stop() {
      this.cancelled = true;
      if (this.current) { try { this.current.pause(); } catch (e) { } this.current = null; }
      if ('speechSynthesis' in window) { try { speechSynthesis.cancel(); } catch (e) { } }
    }
  };

  async function playWithBtn(btn, path, text, rate) {
    if (btn) btn.classList.add('playing');
    await AM.play(path, text, rate);
    if (btn) btn.classList.remove('playing');
  }

  /* ---------------- Toast ---------------- */
  let toastTimer = null;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ---------------- Confetti ---------------- */
  function confetti(host) {
    if (!host) return;
    const colors = ['#e0483e', '#f97316', '#d99a2b', '#5b7cfa', '#22a35f', '#ff6f61', '#ffd98a'];
    for (let i = 0; i < 52; i++) {
      const c = document.createElement('i');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + '%';
      c.style.background = pick(colors);
      c.style.animationDelay = (Math.random() * 0.55) + 's';
      c.style.animationDuration = (1.4 + Math.random() * 1.3) + 's';
      if (Math.random() > 0.7) { c.style.borderRadius = '50%'; }
      host.appendChild(c);
      setTimeout(() => c.remove(), 3400);
    }
  }

  /* ---------------- Score ring animation ---------------- */
  function animateRing(el) {
    if (!el) return;
    const target = parseFloat(el.dataset.pct || 0);
    el.style.setProperty('--pct', 0);
    requestAnimationFrame(() => requestAnimationFrame(() => el.style.setProperty('--pct', target)));
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in-view'); revealIO.unobserve(en.target); }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -36px 0px' });
  function observeReveals(root) {
    $$('.reveal:not(.in-view)', root || document).forEach(el => revealIO.observe(el));
  }

  /* ---------------- Settings / toggles ---------------- */
  function applyState() {
    document.body.classList.toggle('dark', state.dark);
    document.body.classList.toggle('no-pinyin', !state.pinyin);
    document.body.classList.toggle('no-en', !state.en);
    const py = $('#pyToggle'), en = $('#enToggle'), dk = $('#darkBtn');
    if (py) { py.classList.toggle('on', state.pinyin); py.setAttribute('aria-pressed', state.pinyin); }
    if (en) { en.classList.toggle('on', state.en); en.setAttribute('aria-pressed', state.en); }
    if (dk) dk.textContent = state.dark ? '☀️' : '🌙';
    $$('#speedCtl button').forEach(b => b.classList.toggle('on', parseFloat(b.dataset.speed) === state.speed));
    const sn = $('#speedNote'); if (sn) sn.innerHTML = `Global speed: <b>${state.speed}×</b>`;
    saveSettings();
  }

  /* ---------------- HTML builders ---------------- */
  const pySpan = (txt, force) => `<span class="py${force ? ' force' : ''}">${txt}</span>`;

  function hlMark(hz, hl) {
    if (!hl) return hz;
    const i = hz.indexOf(hl);
    if (i < 0) return hz;
    return hz.slice(0, i) + '<mark>' + hl + '</mark>' + hz.slice(i + hl.length);
  }

  function playBtn(path, text, cls) {
    return `<button class="play ${cls || ''}" data-path="${path || ''}" data-text="${text}" title="Play audio">▶</button>`;
  }

  /* ---------------- Hero ---------------- */
  function renderHero() {
    const m = L.meta;
    $('#hero').innerHTML = `
      <div class="hero-seal" aria-hidden="true"><div><span>七</span><small>Lesson 7</small></div></div>
      <div class="hero-kicker">📕 ${m.course} · Lesson ${m.lesson}</div>
      <h1 class="hero-title hz grad-text">${m.title}</h1>
      <div class="hero-py py">${m.titlePinyin}</div>
      <div class="hero-en en">${m.titleEn}</div>
      <div class="hero-stats">
        <span class="chip"><b>${L.words.length}</b> new words</span>
        <span class="chip"><b>${L.grammar.length}</b> grammar points</span>
        <span class="chip"><b>${L.dialogues.length}</b> dialogues</span>
        <span class="chip hl" id="heroMastered"><b>0</b> mastered</span>
      </div>
      <div class="hero-ctas">
        <a class="btn btn-primary" href="#words">📖 Start learning</a>
        <a class="btn btn-ghost" href="#dialogue">🎧 Play dialogues</a>
        <a class="btn btn-ghost" href="#practice">🎯 Take the quiz</a>
      </div>
      <div class="hero-objectives card reveal">
        <div class="obj"><b>⭐ Key words</b><span>${m.objectives.keyWords.join(' · ')}</span></div>
        <div class="obj"><b>📐 Grammar</b><span>${m.objectives.grammar.join(' · ')}</span></div>
        <div class="obj"><b>🔊 Sound</b><span>${m.objectives.sound}</span></div>
        <div class="obj"><b>✍️ Characters</b><span>${m.objectives.characters}</span></div>
      </div>`;
  }

  /* ---------------- Words ---------------- */
  function wordCardHTML(w, i) {
    const mastered = state.mastered[w.id];
    return `
    <article class="wcard card reveal" style="--d:${Math.min(i * 45, 420)}ms" id="word-${w.id}" data-wid="${w.id}">
      <div class="wcard-top">
        <div class="w-main">
          ${pySpan(w.pinyin).replace('class="py"', 'class="py w-py"')}
          <span class="w-char hz">${w.hz}</span>
          <div class="w-meta">
            <span class="pos">${w.pos}</span>
            ${w.key ? '<span class="key-badge">⭐ key word</span>' : ''}
            ${mastered ? '<span class="mastered-badge">✓ mastered</span>' : ''}
          </div>
          <div class="w-en en">${w.en}</div>
        </div>
        <div class="w-actions">
          ${playBtn(w.audio.word, w.hz)}
          <button class="icon-btn stroke-btn" data-act="stroke" data-wid="${w.id}" title="Stroke order">✍️</button>
        </div>
      </div>
      <div class="w-example">
        <div class="ex-label">💬 Example</div>
        <div class="ex-row">
          <div class="ex-body">
            <div class="ex-py py">${w.example.pinyin}</div>
            <div class="ex-hz hz">${hlMark(w.example.hz, w.hz)}</div>
            <div class="ex-en en">${w.example.en}</div>
            ${w.note ? `<div class="w-note">💡 ${w.note}</div>` : ''}
          </div>
          ${playBtn(w.audio.sentence, w.example.hz, 'sm')}
        </div>
      </div>
    </article>`;
  }

  function renderWords() {
    const list = state.wordFilter === 'key' ? L.words.filter(w => w.key) : L.words;
    $('#wordGrid').innerHTML = list.map(wordCardHTML).join('');
    $('#wordCount').textContent = `${list.length} word${list.length > 1 ? 's' : ''}`;
    $$('.pill', $('#wordsToolbar')).forEach(p =>
      p.classList.toggle('active', p.dataset.filter === state.wordFilter));
    observeReveals($('#wordGrid'));
  }

  async function playAllWords() {
    const btn = $('#playAllBtn');
    if (btn.dataset.busy) { AM.stop(); delete btn.dataset.busy; btn.textContent = '▶ Play all words'; return; }
    btn.dataset.busy = '1';
    btn.textContent = '⏹ Stop';
    AM.cancelled = false;
    for (const w of L.words) {
      if (AM.cancelled) break;
      const card = $('#word-' + w.id);
      if (card) { card.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); card.classList.add('flash'); }
      await AM.play(w.audio.word, w.hz);
      if (card) card.classList.remove('flash');
      if (!AM.cancelled) await wait(420 / state.speed);
    }
    delete btn.dataset.busy;
    btn.textContent = '▶ Play all words';
  }

  /* ---------------- Grammar ---------------- */
  function renderGrammar() {
    const cards = L.grammar.map((g, i) => `
      <article class="gcard card reveal" style="--d:${i * 70}ms">
        <div class="gcard-head">
          <div class="g-badge hz">${g.badge}</div>
          <h3>${g.title}</h3>
        </div>
        <div class="g-patterns">${g.patterns.map(p => `<div class="g-pattern hz">${p}</div>`).join('')}</div>
        <p class="g-explain">${g.explain}</p>
        <div class="g-examples">
          ${g.examples.map((ex, ei) => `
            <div class="gex">
              <div class="gex-body">
                <div class="ex-py py">${ex.pinyin}</div>
                <div class="ex-hz hz">${hlMark(ex.hz, ex.hl)}</div>
                <div class="ex-en en">${ex.en}</div>
              </div>
              ${playBtn(`grammar/g${i + 1}-e${ei + 1}.mp3`, ex.hz, 'sm')}
            </div>`).join('')}
        </div>
        ${g.tip ? `<div class="g-tip">💡 ${g.tip}</div>` : ''}
      </article>`).join('');

    const bonus = L.bonus.map((b, i) => `
      <article class="bonus-card card reveal" style="--d:${i * 90}ms">
        <div class="gcard-head">
          <div class="g-badge ${b.badgeClass || ''} hz">${b.badge}</div>
          <h3>${b.title}</h3>
        </div>
        ${b.items.map(it => `
          <div class="bonus-item">
            <div class="bonus-char hz${it.char.length > 1 ? ' c' + Math.min(it.char.length, 3) : ''}">${it.char}</div>
            <div>
              <b>${it.name} <span style="color:var(--muted);font-weight:600">· ${it.nameEn}</span></b>
              <small>${it.meaning} — e.g. ${it.words}</small>
              <small class="in-lesson">In this lesson: ${it.inLesson}</small>
            </div>
          </div>`).join('')}
      </article>`).join('');

    $('#grammarList').innerHTML = cards;
    $('#bonusGrid').innerHTML = bonus;
    observeReveals($('#grammar'));
  }

  /* ---------------- Dialogues ---------------- */
  let currentDlg = L.dialogues[0].id;

  function renderDlgTabs() {
    $('#dlgTabs').innerHTML = L.dialogues.map(d => `
      <button class="dlg-tab ${d.id === currentDlg ? 'active' : ''}" data-act="dlg-tab" data-id="${d.id}">
        <b>${d.title}</b>
        <span>${d.kind === 'listening' ? '🎧 Listening' : 'Dialogue ' + (L.dialogues.indexOf(d) + 1)}</span>
      </button>`).join('');
  }

  function renderDlgPanel() {
    const d = L.dialogues.find(x => x.id === currentDlg);
    $('#dlgPanel').innerHTML = `
      <div class="dlg-head">
        <div>
          <h3>${d.title}</h3>
          <div class="en">${d.titleEn}</div>
        </div>
      </div>
      <div class="dlg-scene">${d.scene}</div>
      <div class="dlg-tags">${d.tags.map((t, i) => `<span class="dlg-tag hz" style="animation-delay:${i * 70}ms">${t}</span>`).join('')}</div>
      <div class="dlg-controls">
        <button class="btn btn-primary btn-sm" data-act="dlg-play-all">▶ Play full dialogue</button>
        <span class="speed-note" id="speedNote">Global speed: <b>${state.speed}×</b></span>
        ${d.kind === 'listening' ? '<button class="btn btn-ghost btn-sm" data-act="listening-mode">🎧 Listening challenge</button>' : ''}
      </div>
      <div class="dlg-lines">
        ${d.lines.map((ln, i) => `
          <div class="dline ${ln.sp.toLowerCase()}" data-li="${i}" style="animation-delay:${i * 90}ms">
            <div class="avatar">${ln.sp}</div>
            <div class="bubble">
              <div class="bubble-body">
                <div class="l-py py">${ln.pinyin}</div>
                <div class="l-hz hz">${ln.hz}</div>
                <div class="l-en en">${ln.en}</div>
              </div>
              ${playBtn(ln.audio, ln.hz, 'sm')}
            </div>
          </div>`).join('')}
      </div>
      ${d.questions.length ? `
      <div class="dlg-questions">
        <h4>🎧 Listen and answer <span style="color:var(--muted);font-weight:600;font-size:12px">(from the textbook)</span></h4>
        ${d.questions.map((q, qi) => `
          <div class="qcard">
            <div class="qrow">
              <div style="flex:1">
                <div class="q-py py">${q.q.pinyin}</div>
                <div class="q-hz hz">${q.q.hz}</div>
                <div class="q-en en">${q.q.en}</div>
              </div>
              ${playBtn(`dialogues/${d.id}-q${qi + 1}.mp3`, q.q.hz, 'sm')}
            </div>
            <button class="reveal-btn" data-act="reveal-answer">👁 Show answer</button>
            <div class="answer">
              <div class="a-tag">Answer</div>
              <div class="q-py py">${q.a.pinyin}</div>
              <div class="q-hz hz">${q.a.hz}</div>
              <div class="q-en en">${q.a.en}</div>
            </div>
          </div>`).join('')}
      </div>` : ''}`;
  }

  function renderDialogues() { renderDlgTabs(); renderDlgPanel(); }

  async function playFullDialogue() {
    const d = L.dialogues.find(x => x.id === currentDlg);
    AM.stop(); AM.cancelled = false;
    const lines = $$('.dline', $('#dlgPanel'));
    for (let i = 0; i < d.lines.length; i++) {
      if (AM.cancelled) break;
      lines[i] && lines[i].classList.add('playing');
      await AM.play(d.lines[i].audio, d.lines[i].hz);
      lines[i] && lines[i].classList.remove('playing');
      if (!AM.cancelled) await wait(480 / state.speed);
    }
  }

  /* ---------------- Practice: stats ---------------- */
  function updateStats() {
    const m = Object.keys(state.mastered).filter(k => state.mastered[k]).length;
    const set = (sel, html) => { const e = $(sel); if (e) e.innerHTML = html; };
    set('#statMastered', `<b>${m}</b><span>Words mastered / ${L.words.length}</span>`);
    set('#statQuiz', `<b>${state.quizBest}</b><span>Best quiz score / 10</span>`);
    set('#statDrill', `<b>${state.drillBest}</b><span>Best drill streak</span>`);
    const hm = $('#heroMastered'); if (hm) hm.innerHTML = `<b>${m}</b> mastered`;
    $$('.wcard').forEach(c => {
      const w = L.words.find(x => x.id === c.dataset.wid);
      if (!w) return;
      const has = !!c.querySelector('.mastered-badge');
      if (state.mastered[w.id] && !has) {
        c.querySelector('.w-meta').insertAdjacentHTML('beforeend', '<span class="mastered-badge">✓ mastered</span>');
      } else if (!state.mastered[w.id] && has) {
        c.querySelector('.mastered-badge').remove();
      }
    });
  }

  /* ---------------- Practice: Flashcards ---------------- */
  const FC = {
    deck: [], idx: 0, flipped: false,
    init() { this.deck = shuffle(L.words); this.idx = 0; this.flipped = false; this.render(); },
    current() { return this.deck[this.idx]; },
    render() {
      const w = this.current();
      if (!w) return this.summary();
      $('#practiceBody').innerHTML = `
        <div class="fc-wrap">
          <div class="fc-counter">Card ${this.idx + 1} of ${this.deck.length} · tap the card (or space) to flip</div>
          <div class="fcard ${this.flipped ? 'flipped' : ''}" data-act="fc-flip">
            <div class="fcard-inner">
              <div class="fc-face fc-front">
                <div>
                  <div class="fc-char hz">${w.hz}</div>
                  <div class="fc-hint">${state.mastered[w.id] ? '✓ mastered — keep it fresh!' : 'What does it mean?'}</div>
                </div>
              </div>
              <div class="fc-face fc-back">
                <div>
                  <div class="fc-py force py">${w.pinyin}</div>
                  <div class="fc-char-s hz">${w.hz}</div>
                  <div class="fc-en force en">${w.en}</div>
                  <div class="fc-ex">
                    <span class="hz">${w.example.hz}</span>
                    <span class="py force">${w.example.pinyin}</span>
                    <span class="en force">${w.example.en}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="fc-actions">
            <button class="play" data-path="${w.audio.word}" data-text="${w.hz}" title="Play word">▶</button>
            <button class="btn btn-again btn-sm" data-act="fc-rate" data-val="0">🔁 Still learning</button>
            <button class="btn btn-know btn-sm" data-act="fc-rate" data-val="1">✅ Got it</button>
            <button class="btn btn-ghost btn-sm" data-act="fc-skip">Skip →</button>
          </div>
          <div class="fc-actions" style="margin-top:-6px">
            <button class="btn btn-ghost btn-sm" data-act="fc-shuffle">🔀 Shuffle & restart</button>
          </div>
        </div>`;
    },
    flip() {
      this.flipped = !this.flipped;
      const c = $('.fcard');
      if (c) c.classList.toggle('flipped', this.flipped);
      const w = this.current();
      if (this.flipped && w) AM.play(w.audio.word, w.hz);
    },
    rate(known) {
      const w = this.current();
      state.mastered[w.id] = !!known;
      store.set('mastered', state.mastered);
      updateStats();
      this.next();
    },
    next() { this.idx++; this.flipped = false; this.render(); },
    summary() {
      const m = Object.keys(state.mastered).filter(k => state.mastered[k]).length;
      if (window.HSK1) HSK1.log('flashcards_done', m + ' mastered of ' + L.words.length);
      $('#practiceBody').innerHTML = `
        <div class="result-wrap">
          <div class="score-ring" data-pct="${Math.round(m / L.words.length * 100)}"><b>${m}<small>/${L.words.length}</small></b></div>
          <div class="result-msg">Deck complete! 🎉</div>
          <div class="result-sub">You marked ${m} of ${L.words.length} words as mastered.</div>
          <button class="btn btn-primary" data-act="fc-restart">🔁 Study again</button>
        </div>`;
      animateRing($('.score-ring'));
      if (m >= L.words.length) confetti($('.result-wrap'));
    }
  };

  /* ---------------- Practice: Memory drill ---------------- */
  const DRILL = {
    round: 0, score: 0, streak: 0, active: false, target: null, timer: null,

    intro() {
      this.active = false;
      clearInterval(this.timer);
      $('#practiceBody').innerHTML = `
        <div class="drill-stage">
          <h3 style="margin-bottom:8px">🎮 Memory drill — which word disappeared?</h3>
          <p style="color:var(--muted);max-width:530px;margin:0 auto 20px;font-size:14.5px">
            The digital version of the classroom recall game from your material:
            memorize the words, then one card vanishes. Pick the missing word before the rounds speed up!
          </p>
          <button class="btn btn-primary" data-act="drill-start">▶ Start game</button>
        </div>`;
    },

    start() { this.round = 0; this.score = 0; this.streak = 0; this.nextRound(); },

    nextRound() {
      this.round++;
      this.active = true;
      const n = Math.min(4 + this.round, 8);
      const viewMs = Math.max(4200 - (this.round - 1) * 350, 1600);
      const cards = shuffle(L.words).slice(0, n);
      this.target = pick(cards);

      $('#practiceBody').innerHTML = `
        <div class="drill-stage">
          <div class="drill-hud">
            <span class="chip">Round <b>${this.round}</b></span>
            <span class="chip">Score <b>${this.score}</b></span>
            <span class="chip">Streak <b>${this.streak}</b> 🔥</span>
            <span class="chip">Best <b>${state.drillBest}</b></span>
          </div>
          <div class="drill-msg" id="drillMsg">👀 Memorize the words…</div>
          <div class="drill-grid" id="drillGrid">
            ${cards.map((w, i) => `
              <div class="dcell" data-wid="${w.id}" style="animation-delay:${i * 55}ms">
                <div>
                  <div class="d-py py">${w.pinyin}</div>
                  <div class="d-hz hz">${w.hz}</div>
                </div>
              </div>`).join('')}
          </div>
          <div class="choice-row" id="drillChoices"></div>
        </div>`;

      clearInterval(this.timer);
      let left = Math.ceil(viewMs / 1000);
      const msg = $('#drillMsg');
      msg.textContent = `👀 Memorize the words… ${left}s`;
      this.timer = setInterval(() => {
        left--;
        if (left > 0) { msg.textContent = `👀 Memorize the words… ${left}s`; }
        else { clearInterval(this.timer); this.hidePhase(); }
      }, 1000);
    },

    hidePhase() {
      const msg = $('#drillMsg');
      msg.className = 'drill-msg';
      msg.textContent = '🫣 One word disappeared — which one?';
      const cell = $(`.dcell[data-wid="${this.target.id}"]`, $('#drillGrid'));
      if (cell) {
        cell.innerHTML = '<div class="d-hz hz" style="color:var(--acc)">؟</div>';
        cell.classList.add('gone');
        AM.play(this.target.audio.word, this.target.hz); // audio hint
      }
      const distractors = shuffle(L.words.filter(w => w.id !== this.target.id)).slice(0, 3);
      const opts = shuffle([this.target, ...distractors]);
      $('#drillChoices').innerHTML = opts.map((w, i) =>
        `<button class="choice hz" style="animation-delay:${i * 60}ms" data-act="drill-pick" data-wid="${w.id}">${w.hz}</button>`).join('');
    },

    pickAnswer(wid, btn) {
      if (!this.active) return;
      this.active = false;
      const correct = wid === this.target.id;
      $$('#drillChoices .choice').forEach(b => {
        b.disabled = true;
        if (b.dataset.wid === this.target.id) b.classList.add('correct');
        else if (b === btn) b.classList.add('wrong');
      });
      const msg = $('#drillMsg');
      if (correct) {
        this.score++; this.streak++;
        if (this.streak > state.drillBest) { state.drillBest = this.streak; store.set('drillBest', this.streak); }
        msg.textContent = `✅ Correct! ${this.target.hz} (${this.target.pinyin}) — ${this.target.en}`;
        msg.className = 'drill-msg good';
      } else {
        this.streak = 0;
        msg.textContent = `❌ It was ${this.target.hz} (${this.target.pinyin}) — ${this.target.en}`;
        msg.className = 'drill-msg bad';
      }
      updateStats();
      const next = document.createElement('button');
      next.className = 'btn btn-primary';
      next.style.marginTop = '14px';
      next.textContent = this.round >= 10 ? '🏁 See results' : 'Next round →';
      next.dataset.act = 'drill-next';
      $('#drillChoices').after(next);
    },

    next() { this.round >= 10 ? this.finish() : this.nextRound(); },

    finish() {
      this.active = false;
      if (window.HSK1) HSK1.log('drill_done', 'streak ' + this.streak, { score: this.streak });
      $('#practiceBody').innerHTML = `
        <div class="result-wrap">
          <div class="score-ring" data-pct="${this.score * 10}"><b>${this.score}<small>/10</small></b></div>
          <div class="result-msg">Game over! 🏁</div>
          <div class="result-sub">Best streak: ${state.drillBest} 🔥</div>
          <button class="btn btn-primary" data-act="drill-start">🔁 Play again</button>
        </div>`;
      animateRing($('.score-ring'));
      if (this.score >= 8) confetti($('.result-wrap'));
    }
  };

  /* ---------------- Practice: Quiz ---------------- */
  const QUIZ = {
    questions: [], idx: 0, score: 0, missed: [], locked: false,

    intro() {
      $('#practiceBody').innerHTML = `
        <div class="drill-stage">
          <h3 style="margin-bottom:8px">📝 Lesson quiz</h3>
          <p style="color:var(--muted);max-width:530px;margin:0 auto 20px;font-size:14.5px">
            10 mixed questions: meanings, pinyin, listening and fill-in-the-blank.
            Your best score: <b style="color:var(--acc)">${state.quizBest}/10</b>
          </p>
          <button class="btn btn-primary" data-act="quiz-start">▶ Start quiz</button>
        </div>`;
    },

    build() {
      const qs = [];
      const words = shuffle(L.words);
      const distractorsFor = w => shuffle(L.words.filter(x => x.id !== w.id)).slice(0, 3);

      words.slice(0, 3).forEach(w => qs.push({ type: 'meaning', w, opts: shuffle([w, ...distractorsFor(w)]) }));
      words.slice(3, 6).forEach(w => qs.push({ type: 'listen', w, opts: shuffle([w, ...distractorsFor(w)]) }));
      words.slice(6, 8).forEach(w => qs.push({ type: 'pinyin', w, opts: shuffle([w, ...distractorsFor(w)]) }));
      words.slice(8, 10).forEach(w => {
        const safe = L.words.filter(x => x.id !== w.id && !w.example.hz.includes(x.hz));
        qs.push({ type: 'blank', w, opts: shuffle([w, ...shuffle(safe).slice(0, 3)]) });
      });
      this.questions = shuffle(qs);
      this.idx = 0; this.score = 0; this.missed = [];
    },

    render() {
      const q = this.questions[this.idx];
      if (!q) return this.result();
      this.locked = false;

      const dots = this.questions.map((x, i) => {
        const cls = i < this.idx ? (x.hit ? 'done' : 'miss') : (i === this.idx ? 'now' : '');
        return `<div class="qdot ${cls}"></div>`;
      }).join('');

      let qHTML = '';
      if (q.type === 'meaning') {
        qHTML = `<div class="q-label">What does it mean?</div>
          <div class="q-big hz">${q.w.hz}</div>
          <div class="q-py py force">${q.w.pinyin}</div>`;
      } else if (q.type === 'listen') {
        qHTML = `<div class="q-label">Listen and choose the word you hear</div>
          <button class="play" style="width:66px;height:66px;font-size:22px;margin:10px auto" data-path="${q.w.audio.word}" data-text="${q.w.hz}">▶</button>`;
      } else if (q.type === 'pinyin') {
        qHTML = `<div class="q-label">Which is the correct pinyin?</div>
          <div class="q-big hz">${q.w.hz}</div>`;
      } else {
        const sent = q.w.example.hz.replace(q.w.hz, '______');
        qHTML = `<div class="q-label">Fill in the blank</div>
          <div class="q-sent-py py force">${q.w.example.pinyin}</div>
          <div class="q-sent hz">${sent}</div>
          <div class="q-en en force" style="color:var(--muted);font-size:14px;margin-top:6px">${q.w.example.en}</div>`;
      }

      const optsHTML = q.opts.map((o, i) => {
        let inner;
        if (q.type === 'meaning') inner = `<span class="en force">${o.en}</span>`;
        else if (q.type === 'pinyin') inner = `<span class="opt-py force" style="font-size:19px">${o.pinyin}</span>`;
        else inner = `<span class="hz">${o.hz}</span><span class="opt-py force">${o.pinyin}</span>`;
        return `<button class="opt" style="animation-delay:${i * 60}ms" data-act="quiz-pick" data-wid="${o.id}">${inner}</button>`;
      }).join('');

      $('#practiceBody').innerHTML = `
        <div class="quiz-progress">${dots}</div>
        <div class="quiz-q">${qHTML}</div>
        <div class="quiz-options">${optsHTML}</div>
        <div class="quiz-feedback" id="quizFb"></div>
        <button class="btn btn-primary quiz-next" id="quizNext" data-act="quiz-next">Next →</button>`;

      if (q.type === 'listen') {
        const btn = $('.quiz-q .play');
        setTimeout(() => playWithBtn(btn, q.w.audio.word, q.w.hz), 350);
      }
    },

    pick(wid, btn) {
      if (this.locked) return;
      this.locked = true;
      const q = this.questions[this.idx];
      const correct = wid === q.w.id;
      q.hit = correct;
      $$('.opt').forEach(b => {
        b.disabled = true;
        if (b.dataset.wid === q.w.id) b.classList.add('correct');
        else if (b === btn) b.classList.add('wrong');
      });
      const fb = $('#quizFb');
      if (correct) {
        this.score++;
        fb.className = 'quiz-feedback show good';
        fb.innerHTML = `✅ Correct! <b>${q.w.hz}</b> ${q.w.pinyin} — ${q.w.en}`;
      } else {
        this.missed.push(q.w);
        fb.className = 'quiz-feedback show bad';
        fb.innerHTML = `❌ The answer is <b>${q.w.hz}</b> ${q.w.pinyin} — ${q.w.en}<br>
          <span style="font-size:13px;opacity:.85" class="hz">${q.w.example.hz}</span>`;
      }
      $('#quizNext').classList.add('show');
      const dot = $$('.qdot')[this.idx];
      if (dot) dot.className = 'qdot ' + (correct ? 'done' : 'miss');
    },

    next() { this.idx++; this.render(); },

    result() {
      if (this.score > state.quizBest) { state.quizBest = this.score; store.set('quizBest', this.score); }
      if (window.HSK1) HSK1.log('quiz_done', 'score ' + this.score + '/10', { score: this.score, total: 10 });
      updateStats();
      const msg = this.score === 10 ? 'Perfect! 太好了！🏆' :
                  this.score >= 8 ? 'Excellent! 很好！🎉' :
                  this.score >= 6 ? 'Good job — keep going! 加油！💪' :
                  "Keep practicing — you'll get there! 加油！📖";
      $('#practiceBody').innerHTML = `
        <div class="result-wrap">
          <div class="score-ring" data-pct="${this.score * 10}"><b>${this.score}<small>/10</small></b></div>
          <div class="result-msg">${msg}</div>
          <div class="result-sub">Best score: ${state.quizBest}/10</div>
          ${this.missed.length ? `
            <div style="font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:8px">Review these words</div>
            <div class="missed-list">
              ${this.missed.map((w, i) => `<span class="missed" style="animation-delay:${i * 60}ms"><span class="hz">${w.hz}</span> ${w.pinyin} · ${w.en}</span>`).join('')}
            </div>` : ''}
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            <button class="btn btn-primary" data-act="quiz-start">🔁 Try again</button>
            <a class="btn btn-ghost" href="#words">📖 Back to words</a>
          </div>
        </div>`;
      animateRing($('.score-ring'));
      if (this.score >= 8) confetti($('.result-wrap'));
    }
  };

  /* ---------------- Practice tabs ---------------- */
  let currentPractice = 'flashcards';
  function renderPracticeTabs() {
    $('#practiceTabs').innerHTML = [
      ['flashcards', '🃏 Flashcards'],
      ['drill', '🎮 Memory drill'],
      ['quiz', '📝 Quiz']
    ].map(([id, label]) =>
      `<button class="pill ${id === currentPractice ? 'active' : ''}" data-act="practice-tab" data-id="${id}">${label}</button>`
    ).join('');
  }
  function showPractice(id) {
    currentPractice = id;
    renderPracticeTabs();
    if (id === 'flashcards') FC.init();
    else if (id === 'drill') DRILL.intro();
    else QUIZ.intro();
  }

  /* ---------------- Stroke order modal (HanziWriter — bundled locally, CDN fallback) ---------------- */
  let hwLoading = null;
  function loadScriptOnce(src) {
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => res(window.HanziWriter);
      s.onerror = () => rej(new Error('load-fail:' + src));
      document.head.appendChild(s);
    });
  }
  function loadHanziWriter() {
    if (window.HanziWriter) return Promise.resolve(window.HanziWriter);
    if (hwLoading) return hwLoading;
    hwLoading = loadScriptOnce('js/vendor/hanzi-writer.min.js')
      .catch(() => loadScriptOnce('https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js'));
    return hwLoading;
  }
  /* Character stroke data: local bundle first (js/vendor/hanzi-data), CDN as fallback */
  function hwCharDataLoader(char, onComplete) {
    const enc = encodeURIComponent(char);
    fetch('js/vendor/hanzi-data/' + enc + '.json')
      .then(r => { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(onComplete)
      .catch(() => {
        fetch('https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/' + enc + '.json')
          .then(r => { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
          .then(onComplete)
          .catch(() => { /* no data for this char — leave cell empty */ });
      });
  }

  async function openStroke(wid) {
    const w = L.words.find(x => x.id === wid);
    if (!w) return;
    const modal = $('#strokeModal');
    const chars = Array.from(w.hz);
    modal.innerHTML = `
      <div class="modal-box">
        <h3>${w.hz} <span style="color:var(--acc);font-size:16px">${w.pinyin}</span></h3>
        <div class="m-sub en force">${w.en} · stroke order</div>
        <div class="stroke-row" id="strokeRow">
          ${chars.map((c, i) => `
            <div class="stroke-cell">
              <div class="hw-target" id="hw-${i}"></div>
              <span class="sc-py">${c}</span>
            </div>`).join('')}
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary btn-sm" id="strokeAnimate">▶ Animate</button>
          <button class="btn btn-ghost btn-sm" data-act="close-modal">Close</button>
        </div>
      </div>`;
    modal.classList.remove('hidden');
    try {
      const HW = await loadHanziWriter();
      const writers = chars.map((c, i) =>
        HW.create(`hw-${i}`, c, {
          width: 96, height: 96, padding: 6,
          showOutline: true, showCharacter: false,
          strokeColor: '#e0483e', radicalColor: '#d99a2b',
          delayBetweenStrokes: 120,
          charDataLoader: hwCharDataLoader
        }));
      $('#strokeAnimate').onclick = async () => {
        for (const wr of writers) { wr.hideCharacter(); await wr.animateCharacter(); }
      };
      setTimeout(() => $('#strokeAnimate') && $('#strokeAnimate').click(), 300);
    } catch (e) {
      $('#strokeRow').innerHTML = `<div style="color:var(--muted);font-size:13.5px;padding:20px">
        Stroke animation could not load. Please refresh the page and try again.</div>`;
    }
  }

  /* ---------------- Global events ---------------- */
  function bindEvents() {
    /* Nav toggles */
    $('#pyToggle').addEventListener('click', () => {
      state.pinyin = !state.pinyin; applyState();
      toast(state.pinyin ? 'Pinyin shown' : 'Pinyin hidden — reading mode!');
    });
    $('#enToggle').addEventListener('click', () => {
      state.en = !state.en; applyState();
      toast(state.en ? 'English shown' : 'English hidden — challenge mode!');
    });
    $('#darkBtn').addEventListener('click', () => { state.dark = !state.dark; applyState(); });

    /* GLOBAL speed control */
    $('#speedCtl').addEventListener('click', e => {
      const b = e.target.closest('button[data-speed]');
      if (!b) return;
      state.speed = parseFloat(b.dataset.speed);
      applyState();
      toast(`🔊 Playback speed: ${state.speed}× — applies to every audio on the site`);
      const w0 = L.words[0];
      AM.play(w0.audio.word, w0.hz); // real preview at the new speed
    });

    /* Word toolbar */
    $('#wordsToolbar').addEventListener('click', e => {
      const pill = e.target.closest('.pill[data-filter]');
      if (pill) { state.wordFilter = pill.dataset.filter; renderWords(); }
    });
    $('#playAllBtn').addEventListener('click', playAllWords);

    /* Practice tabs */
    $('#practiceTabs').addEventListener('click', e => {
      const t = e.target.closest('[data-act="practice-tab"]');
      if (t) showPractice(t.dataset.id);
    });

    /* Delegated actions */
    document.addEventListener('click', e => {
      const play = e.target.closest('.play');
      if (play && (play.dataset.path || play.dataset.text)) {
        playWithBtn(play, play.dataset.path || null, play.dataset.text);
        return;
      }

      const el = e.target.closest('[data-act]');
      if (!el) return;
      switch (el.dataset.act) {
        case 'stroke': openStroke(el.dataset.wid); break;
        case 'close-modal': $('#strokeModal').classList.add('hidden'); break;
        case 'dlg-tab': currentDlg = el.dataset.id; AM.stop(); renderDialogues(); break;
        case 'dlg-play-all': playFullDialogue(); break;
        case 'listening-mode': {
          const panel = $('#dlgPanel');
          panel.classList.toggle('listening');
          el.textContent = panel.classList.contains('listening') ? '👁 Show text' : '🎧 Listening challenge';
          if (panel.classList.contains('listening')) toast('Listening mode: text blurred. Play the audio and answer the questions!');
          break;
        }
        case 'reveal-answer': {
          const ans = el.parentElement.querySelector('.answer');
          const show = !ans.classList.contains('show');
          ans.classList.toggle('show', show);
          el.textContent = show ? '🙈 Hide answer' : '👁 Show answer';
          break;
        }
        case 'fc-flip': FC.flip(); break;
        case 'fc-rate': FC.rate(el.dataset.val === '1'); break;
        case 'fc-skip': FC.next(); break;
        case 'fc-shuffle': case 'fc-restart': FC.init(); break;
        case 'drill-start': DRILL.start(); break;
        case 'drill-pick': DRILL.pickAnswer(el.dataset.wid, el); break;
        case 'drill-next': DRILL.next(); break;
        case 'quiz-start': QUIZ.build(); QUIZ.render(); break;
        case 'quiz-pick': QUIZ.pick(el.dataset.wid, el); break;
        case 'quiz-next': QUIZ.next(); break;
      }
    });

    /* Ripple micro-interaction */
    document.addEventListener('pointerdown', e => {
      const t = e.target.closest('.btn, .play, .pill, .choice, .opt, .tgl, .dlg-tab, .icon-btn, .speed-ctl button');
      if (!t) return;
      const r = document.createElement('span');
      r.className = 'ripple';
      const rect = t.getBoundingClientRect();
      r.style.left = (e.clientX - rect.left) + 'px';
      r.style.top = (e.clientY - rect.top) + 'px';
      t.appendChild(r);
      setTimeout(() => r.remove(), 650);
    });

    /* Scroll progress + back-to-top */
    const bar = $('#scrollProgress'), toTop = $('#toTop');
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const h = document.documentElement;
        const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100;
        bar.style.width = p + '%';
        toTop.classList.toggle('show', h.scrollTop > 620);
        ticking = false;
      });
    }, { passive: true });
    toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

    /* Modal close: backdrop / Esc */
    $('#strokeModal').addEventListener('click', e => {
      if (e.target.id === 'strokeModal') $('#strokeModal').classList.add('hidden');
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') $('#strokeModal').classList.add('hidden');
      if (e.key === ' ' && currentPractice === 'flashcards' && !e.target.closest('button,select,a')) {
        if ($('.fcard')) { e.preventDefault(); FC.flip(); }
      }
    });

    /* Scroll spy */
    const links = $$('.nav-links a');
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    ['words', 'grammar', 'dialogue', 'practice'].forEach(id => { const s = $('#' + id); if (s) spy.observe(s); });
  }

  /* ---------------- Nav & lesson-to-lesson navigation ---------------- */
  function renderNav() {
    const b = $('#navBrandText');
    if (b) b.innerHTML = `<b>${L.meta.course}</b><span>Lesson ${LESSON_N} · ${L.meta.title}</span>`;
    document.title = `${L.meta.course} · Lesson ${LESSON_N} — ${L.meta.title}`;
  }

  function renderLessonNav() {
    const host = $('#lessonNav');
    if (!host || !window.COURSE) return;
    const ls = window.COURSE.lessons;
    const mk = (l, label) => {
      if (!l) return '<span class="lnav-btn empty"></span>';
      if (l.status === 'ready')
        return `<a class="lnav-btn" href="lesson.html?id=${l.n}"><small>${label} · Lesson ${l.n}</small><b class="hz">${l.hz}</b></a>`;
      return `<span class="lnav-btn locked" title="Coming soon"><small>${label} · Lesson ${l.n} 🔒</small><b class="hz">${l.hz}</b></span>`;
    };
    host.innerHTML =
      mk(ls[LESSON_N - 2], '← Previous') +
      `<a class="lnav-current" href="index.html">🏠 All lessons</a>` +
      mk(ls[LESSON_N], 'Next →');
  }

  /* ---------------- Init ---------------- */
  function init() {
    const le = $('#loadError'); if (le) le.style.display = 'none';
    rawSet('hsk1:lastLesson', String(LESSON_N));
    renderNav();
    applyState();
    renderHero();
    $('#wordsSectionCount').textContent = L.words.length;
    renderWords();
    renderGrammar();
    renderDialogues();
    $('#statsStrip').innerHTML = `
      <div class="stat card reveal" id="statMastered"></div>
      <div class="stat card reveal" style="--d:80ms" id="statQuiz"></div>
      <div class="stat card reveal" style="--d:160ms" id="statDrill"></div>`;
    showPractice('flashcards');
    updateStats();
    bindEvents();
    renderLessonNav();
    observeReveals(document);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
