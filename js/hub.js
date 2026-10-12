/* ============================================================
   HSK Course — Hub page logic
   Renders the course hero, the 15-lesson grid (with per-lesson
   progress from localStorage) and shared UI behaviors.
   ============================================================ */
(() => {
  'use strict';

  const C = window.COURSE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function readJSON(key, d) { try { const v = localStorage.getItem(key); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function writeJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { } }

  /* ---------- Settings (shared with lesson pages) ---------- */
  const SETT = 'hsk1:settings';
  const saved = readJSON(SETT, {});
  const state = {
    pinyin: saved.pinyin != null ? saved.pinyin : true,
    dark: saved.dark != null ? saved.dark : (window.matchMedia ? matchMedia('(prefers-color-scheme: dark)').matches : false)
  };
  function applyState() {
    document.body.classList.toggle('dark', state.dark);
    document.body.classList.toggle('no-pinyin', !state.pinyin);
    const py = $('#pyToggle'), dk = $('#darkBtn');
    if (py) { py.classList.toggle('on', state.pinyin); py.setAttribute('aria-pressed', state.pinyin); }
    if (dk) dk.textContent = state.dark ? '☀️' : '🌙';
    const merged = Object.assign(readJSON(SETT, {}), { pinyin: state.pinyin, dark: state.dark });
    writeJSON(SETT, merged);
  }

  /* ---------- Per-lesson progress ---------- */
  function lessonProgress(n) {
    const masteredObj = readJSON('hsk1-l' + n + ':mastered', {});
    const mastered = Object.keys(masteredObj).filter(k => masteredObj[k]).length;
    const quizBest = readJSON('hsk1-l' + n + ':quizBest', 0);
    return { mastered, quizBest };
  }

  /* ---------- Hero ---------- */
  function renderHero() {
    const ready = C.lessons.filter(l => l.status === 'ready');
    let totalMastered = 0;
    ready.forEach(l => { totalMastered += lessonProgress(l.n).mastered; });

    $('#hubStats').innerHTML = `
      <span class="chip"><b>${C.lessons.length}</b> lessons</span>
      <span class="chip"><b>${ready.length}</b> ready to study</span>
      <span class="chip hl"><b>${totalMastered}</b> words mastered</span>`;

    /* Continue button → last visited ready lesson, else first ready */
    let last = readJSON('hsk1:lastLesson', 0);
    if (!ready.some(l => l.n === last)) last = ready.length ? ready[0].n : 0;
    $('#hubCtas').innerHTML = last
      ? `<a class="btn btn-primary" href="lesson.html?id=${last}">▶ Continue — Lesson ${last}</a>
         <a class="btn btn-ghost" href="#lessons">📚 Browse all lessons</a>`
      : `<a class="btn btn-primary" href="#lessons">📚 Browse all lessons</a>`;
  }

  /* ---------- Lesson grid ---------- */
  function renderLessons() {
    $('#lessonGrid').innerHTML = C.lessons.map((l, i) => {
      const delay = Math.min(i * 45, 450);
      if (l.status === 'ready') {
        const p = lessonProgress(l.n);
        const total = l.wordCount || p.mastered || 1;
        const pct = Math.min(100, Math.round(p.mastered / total * 100));
        return `
        <a class="lcard ready card reveal" style="--d:${delay}ms" href="lesson.html?id=${l.n}">
          <div class="lcard-top">
            <div class="lnum hz">${l.num}</div>
            <div style="flex:1">
              <div class="lcard-kicker">Lesson ${l.n}</div>
              <h3 class="hz">${l.hz}</h3>
            </div>
            <span class="status-chip ready">✅ Ready</span>
          </div>
          <div class="lcard-py py">${l.py}</div>
          <div class="lcard-en en">${l.en}</div>
          <div class="lprogress" title="${p.mastered}/${total} words mastered"><i style="width:${pct}%"></i></div>
          <div class="lmeta">
            <span>✓ ${p.mastered}/${total} words</span>
            <span>🏆 quiz best: ${p.quizBest}/10</span>
            <span class="go">Open →</span>
          </div>
        </a>`;
      }
      return `
        <div class="lcard locked card reveal" style="--d:${delay}ms">
          <div class="lcard-top">
            <div class="lnum hz">${l.num}</div>
            <div style="flex:1">
              <div class="lcard-kicker">Lesson ${l.n}</div>
              <h3 class="hz">${l.hz}</h3>
            </div>
            <span class="status-chip soon">🔒 Soon</span>
          </div>
          <div class="lcard-py py">${l.py}</div>
          <div class="lcard-en en">${l.en}</div>
          <div class="lmeta"><span>In production — coming soon</span></div>
        </div>`;
    }).join('');
  }

  /* ---------- Toast ---------- */
  let toastTimer = null;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
  }

  /* ---------- Reveals / ripple / scroll UI ---------- */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in-view'); revealIO.unobserve(en.target); } });
  }, { threshold: 0.06, rootMargin: '0px 0px -36px 0px' });

  function init() {
    applyState();
    renderHero();
    renderLessons();
    $$('.reveal').forEach(el => revealIO.observe(el));

    $('#pyToggle').addEventListener('click', () => {
      state.pinyin = !state.pinyin; applyState();
      toast(state.pinyin ? 'Pinyin shown' : 'Pinyin hidden');
    });
    $('#darkBtn').addEventListener('click', () => { state.dark = !state.dark; applyState(); });

    /* Ripple */
    document.addEventListener('pointerdown', e => {
      const t = e.target.closest('.btn, .tgl, .lcard.ready');
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
        bar.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + '%';
        toTop.classList.toggle('show', h.scrollTop > 500);
        ticking = false;
      });
    }, { passive: true });
    toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

    /* Scroll spy */
    const links = $$('.nav-links a');
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    ['lessons', 'howto'].forEach(id => { const s = $('#' + id); if (s) spy.observe(s); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
