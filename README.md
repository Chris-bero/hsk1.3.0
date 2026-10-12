# HSK 1 Course — Interactive Digital Platform 📕

Digital, interactive edition of **New HSK Course 1** — built on the exact engine of the
finished HSK 2 platform (same lesson template, same design system, same integrity layer).

**Status: 🚧 engine + emerald identity + rebuilt dashboard live · lesson content in production (0/15 lessons ready).**
**Backend: connected** — `js/config.js` points at the HSK 1 Apps Script (`ping → service:"hsk1-sheets"`, `enabled: true`).
This clone keeps every HSK 2 feature; only the course data and the storage-key prefix differ.

## ▶ How to open

Open `index.html` (the course hub) in any browser — Chrome / Edge recommended.
No server needed: everything works from `file://`.

* **Hub** `index.html` — all 15 lessons, statuses, progress, "Continue" button
* **Lesson player** `lesson.html?id=1` — the universal template (Words · Grammar · Dialogues · Practice)

## 🗂 Architecture

```
hsk1-course/
├── index.html               ← course hub (lesson grid + progress)
├── lesson.html              ← universal lesson template (?id=N loads lesson N)
├── gate.html                ← class gate (name + student code) — see js/config.js
├── teacher.html             ← teacher dashboard (progress · devices · flags · raw log)
├── _headers                 ← Netlify immutable caching for /audio/* and /js/vendor/*
├── css/style.css            ← shared design system (light/dark, animations, hub styles)
├── js/
│   ├── course.js            ← REGISTRY: the 15 HSK 1 lessons (titles, status, counts)
│   ├── loader.js            ← reads ?id=N → injects data/lessonN.js → app.js
│   ├── hub.js               ← hub page logic
│   ├── app.js               ← lesson player logic (100% data-driven, lesson-agnostic)
│   ├── config.js            ← Apps Script /exec URL + switches (HSK1_CONFIG)
│   ├── sheets.js            ← device fingerprint · session · batched events · kick check
│   ├── data/
│   │   ├── _TEMPLATE.js     ← start every new lesson from this file
│   │   └── lesson1.js       ← ⚠ placeholder skeleton until the textbook data lands
│   └── vendor/              ← HanziWriter + stroke data (local, CDN only as fallback)
├── audio/
│   ├── l01 … l15/           ← per-lesson audio: words/ sentences/ dialogues/ grammar/
│   └── PRODUCTION_PLAN.md   ← batch tracking (two-voice standard)
├── google-sheets/Code.gs    ← Apps Script backend (level-agnostic; HSK 1 gets its own Sheet)
└── tools/
    ├── validate-lesson.js   ← data validator:  node tools/validate-lesson.js 1
    ├── test-v2.js           ← integrity suite: node tools/test-v2.js   (36/36)
    ├── mock-server.js       ← in-node mock of Apps Script used by the suite
    ├── build-packages.ps1   ← dist-online + dist-offline + two zips (Windows)
    └── push-github.ps1      ← build + mirror docs/tools + commit + push (Windows)
```

## 🔊 Audio status

**Not produced yet (0 clips).** Two-voice standard, identical to HSK 2:
👩 female narrator (words, sentences, grammar, questions, speaker A/B per `spVoices`)
+ 👨 male for the assigned dialogue speaker. Batches of **10 clips per message**;
every finished path is added to `audioReady` and ticked in `audio/PRODUCTION_PLAN.md`.
Missing files fall back to browser TTS automatically, so a lesson never breaks.

## 🆕 What HSK 1 adds on top of the HSK 2 engine

| Area | Change |
|---|---|
| **Identity** | Emerald theme (light + dark): `--acc #0e7a4f`, gradient to `#14b87a`, dark `#3ddc97`. Seals (汉 / 一 / 师), favicons, scroll bar, play-pulse and score-ring glow are all green. Red survives **only** as a semantic colour (`--bad`, wrong answers, sharing flags) with its own `--bad-soft` / `--bad-line`. |
| **Study-time tracking** | `lesson.html` now counts **visible** study time only: a 15 s accounting tick banks elapsed seconds while the tab is foregrounded, reports one `lesson_time` event per 60 banked seconds, and banks + flushes on `visibilitychange`/`pagehide`. A lesson left open in a hidden tab no longer inflates the minutes. |
| **Teacher dashboard** | Rebuilt into six tabs: 📊 Overview (7 KPI cards + class-per-lesson table) · ⏱ Time matrix (student × lesson minutes with heat shading, class totals and averages, click a cell to drill down) · 👥 Students (13 sortable columns, live search, expandable per-lesson detail, idle 💤 rows) · 🎯 One lesson (who studied, who never opened it, 5 KPIs) · 📱 Devices & flags · 📜 Raw log. Plus CSV export on five views, an idle-threshold selector (3/7/14/30 days), 60 s auto-refresh and dark mode. Class-level minutes are aggregated in the browser, so **`Code.gs` needed no change**. |
| **Tests** | New `tools/test-ui.js` — 83 checks: dashboard on jsdom with a stubbed network, the real telemetry block in a `vm` sandbox with a controllable clock, theme assertions and backend-contract assertions. |

## 🔁 Workflow — building a lesson (e.g. Lesson 1)

1. **Source** — the lesson PDF from *New HSK Course 1*.
2. **Data** — copy `js/data/_TEMPLATE.js` → `js/data/lesson1.js` and fill:
   `meta` (+`audioBase: "audio/l01/"`), `words` (hz/pinyin/pos/en/example+audio paths),
   `grammar`, `bonus`, `dialogues` (+listening questions).
3. **Validate** — `node tools/validate-lesson.js 1` must pass with **0 errors**
   (warnings = audio not generated yet, which is fine at this stage).
4. **Audio** — generate clips in batches of 10 under `audio/l01/…` and add each path
   to `audioReady`.
5. **Publish** — in `js/course.js` set lesson 1 `status: "ready"` + `wordCount`
   (+`grammarCount`, `dialogueCount`). The hub card unlocks and prev/next navigation
   connects automatically.
6. **Push** — `tools/build-packages.ps1` then `tools/push-github.ps1` (protection rule #1).

## ✨ Lesson template features (same for every lesson)

| Section | Contents |
|---|---|
| **Words 生词** | cards: character · pinyin · meaning · example sentence — audio for both, ⭐ key words, stroke-order animation, "Play all" |
| **Grammar 语言点** | patterns, short explanations, highlighted examples with audio, bonus cards (radicals, intonation) |
| **Dialogues 课文** | chat bubbles, line/full playback, 🎧 listening mode (blurred text), textbook questions with hidden answers |
| **Practice 练习** | 🃏 flashcards (mastery saved) · 🎮 memory drill · 📝 10-question quiz with best-score tracking |
| **Global** | 🐢 speed control 0.5–1.25× for all audio · pinyin/English toggles · dark mode · prev/next lesson nav · progress in `localStorage` |

**Storage keys:** settings are course-wide (`hsk1:settings`); progress is per lesson
(`hsk1-l7:mastered`, `hsk1-l7:quizBest`, `hsk1-l7:drillBest`); integrity layer uses
`hsk1:session` + `hsk1:deviceId`. ⚠ The `hsk1:` prefix must never collide with `hsk2:` —
the two platforms can be open in the same browser without sharing any state.

## 🔐 Class gate & device tracking (v2 — inherited from HSK 2)

| Piece | Role |
|---|---|
| `gate.html` | per-student code login (roster autocomplete, bilingual errors, kick banner) |
| `js/config.js` | Apps Script `/exec` URL + switches — **HSK 1 needs its own Sheet** |
| `js/sheets.js` | device fingerprint (permanent id + readable label), session, batched event POSTs (20 s + sendBeacon), daily check & kick, page guard |
| `teacher.html` | teacher_code → progress table, Devices column (hover = device list), red row + `same-time use!` (2 h window), 🕵️ possible-sharing card, raw-log tab, 60 s auto-refresh |
| `google-sheets/Code.gs` | level-agnostic backend: `Students` / `Log` (11 cols) / `Settings`, actions `ping roster health progress tail login log check setBlocked`, auto-migration of old 9-col logs |

Events emitted: `login · lesson_open · lesson_time (60 s) · quiz_done · drill_done · flashcards_done · mastery`.

**Current switch state:** `js/config.js` ships with `sheetsUrl: ''` and `enabled: false`
(phase B pending) — the site runs full-featured with no gate until the HSK 1 Sheet is deployed.

## 🚀 Deployment — GitHub Pages (decision 2026-10-10, no Vercel)

`tools/build-packages.ps1` → `tools/push-github.ps1 -User <you> -Repo hsk1` →
repo Settings → Pages → Deploy from a branch → `main` / `(root)` →
`https://<user>.github.io/hsk1/`. All links are relative, so the subpath works as-is.
Decision 2026-10-10: one **public** repo named `hsk1` (no secrets are pushed — see `RESUME_AR.md`).

## 🧪 Tests

```bash
node tools/validate-lesson.js 1     # data integrity of lesson 1        → 0 errors
node tools/validate-lesson.js all   # every lesson in the registry      (errors expected for unbuilt lessons)
node tools/test-v2.js               # integrity layer: 36/36 (mock Apps Script env)
node tools/test-ui.js               # dashboard + telemetry + theme: 83 passed / 1 skipped
```

`test-ui.js` PART 1 needs jsdom (`npm i -D jsdom`); without it that part is **skipped**, not failed,
so the suite still runs on a machine with no dev dependencies.

## 🕳 Known gap inherited from the reference

The project brief lists a device-block feature (`setBlocked` action · `blocked_devices` list ·
block/unblock buttons in `teacher.html`). It does **not** exist in the HSK 2 reference that was
handed over: zero `blocked` hits in `Code.gs` / `sheets.js` / `gate.html` / `teacher.html`, and the
live HSK 1 endpoint answers `POST setBlocked` with `{"error":"unknown_action"}`.
`test-ui.js` reports it as a *skipped* check (76b) until a decision is made.

`validate-lesson.js all` reports an error for each registry lesson whose data file does not
exist yet — that is expected while the book is being built lesson by lesson.

## 📚 Method

`PLAYBOOK_AR.md` is the constitution of this system (contracts, phases, trap log) and is kept
**verbatim from HSK 2 on purpose** — it documents how any level is born, including this one.
