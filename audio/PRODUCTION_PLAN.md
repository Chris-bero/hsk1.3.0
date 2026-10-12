# 🔊 Audio Production Plan — New HSK Course 1 (Two-Voice Standard)

**Voice plan (inherited verbatim from HSK 2):** two studio voices
- **F = Female** (educational, index 0) → words, example sentences, grammar examples,
  listening questions, and any dialogue speaker assigned `f` in `spVoices`
- **M = Male** (masculine, conversational, index 0) → dialogue speaker lines assigned `m`

Per-dialogue speaker voices live in each lesson's data file (`spVoices: { A, B }`),
matching the textbook's own 男的/女的 clues where available.

**Rule:** every play button must resolve to a real file listed in `audioReady`
(browser TTS is only an emergency fallback while production is in progress).
**Batch rule:** 10 clips per message → tick the batch here → add the paths to
`audioReady` immediately → run `node tools/validate-lesson.js N`.

## Inventory (fill per lesson as its data file is built)

| Lesson | words | sentences | dlg lines | grammar ex | questions | total | done |
|---|---|---|---|---|---|---|---|
| L1 | 14 | 14 | 10 | 6 | 0 (none in book yet) | **44** | 44 |
| L2 | 15 | 15 | TBD (课本 P6–P8) | 5 | 0 | **45** | 45 |
| L3 | 22 | 22 | TBD (课本 P10/P12/P14) | 13 | 0 | **69** | 69 |
- [x] **L3-A** (10 gen · M/F per speaker) — dialogue lines d1-l1/l2 · d2-l2/l3/l4 · d3-l1..l5  ✅ 2026-10-10
- [x] **L3-B** (10) — d3-l6 (F) · words w01-w09 (F)  ✅ 2026-10-10
- [x] **L3-C** (10 · F) — words w10-w19  ✅ 2026-10-10
- [x] **L3-D** (10 · F) — words w20-w22 · sentences s01-s07 · **d2-l1<-s07**  ✅ 2026-10-10
- [x] **L3-E** (10 · F) — sentences s08-s17  ✅ 2026-10-10
- [x] **L3-F** (10 · F) — sentences s18-s22 · grammar g1-e1..e3 · g2-e1,e2  ✅ 2026-10-10
- [x] **L3-G** (7 gen + 1 copy · F) — g3-e1..e4 · g4-e1..e3 · g2-e3<-s02 → 🏁 L3 AUDIO 69/66+3? = 69  ✅ 2026-10-10
| L4 | 21 | 21 | TBD (课本 P19/P22/P24) | 13 | 4 MCQ | **73** | 73 |
- [x] **L4-A** (10 · F) — words w01-w10  ✅ 2026-10-10
- [x] **L4-B** (10 · F) — words w11-w20  ✅ 2026-10-10
- [x] **L4-C** (10 · F) — word w21 · sentences s01-s09  ✅ 2026-10-10
- [x] **L4-D** (10 · F) — sentences s10-s19  ✅ 2026-10-10
- [x] **L4-E** (10 · F) — s20, s21 · g-mw e1-e4 · g-you e2/e3 · g-ne e2/e3  ✅ 2026-10-10
- [x] **L4-F** (10) — g-age e2/e3 · listening q d2-q1/q2 + d3-q1/q2 · lines d1-l1..l4  ✅ 2026-10-10
- [x] **L4-G** (10) — lines d2-l1..l4 · d3-l1..l6  ✅ 2026-10-10
- [x] **L4-H** (3 copies) — g-you-e1<-d1-l4 · g-ne-e1<-d2-l1 · g-age-e1<-s17 → 🏁 L4 = 73/73  ✅ 2026-10-10
| L5 | 22 | 22 | TBD (课本 P28/P30/P32) | 8 | 4 MCQ | **72** | 72 |
- [x] **L5-A** (10 · F) — words w01-w10  ✅ 2026-10-11
- [x] **L5-B** (10 · F) — words w11-w20  ✅ 2026-10-11
- [x] **L5-C** (10 · F) — words w21-w22 · sentences s01-s08  ✅ 2026-10-11
- [x] **L5-D** (10 · F) — sentences s09-s18  ✅ 2026-10-11
- [x] **L5-E** (10 · F) — s19-s22 · g-nompred e1/e2 · g-hui e1-e3 · d2-q1  ✅ 2026-10-11
- [x] **L5-F** (10 gen) — lines d1-l1..l4 · d2-l2..l4 · d3-l1..l3  ✅ 2026-10-11
- [x] **L5-G** (8 gen + 4 copies) — d3-l4..l6 · d2-q2 · d3-q1..q4 · d2-l1<-g3-e1 · g1-e1<-s03 · g1-e2<-s02 · g1-e3<-s05 → 🏁 L5 = 72/72  ✅ 2026-10-11
| L6 | — | — | — | — | — | **—** | 0 |
| L7 | — | — | — | — | — | **—** | 0 |
| L8 | — | — | — | — | — | **—** | 0 |
| L9 | — | — | — | — | — | **—** | 0 |
| L10 | — | — | — | — | — | **—** | 0 |
| L11 | — | — | — | — | — | **—** | 0 |
| L12 | — | — | — | — | — | **—** | 0 |
| L13 | — | — | — | — | — | **—** | 0 |
| L14 | — | — | — | — | — | **—** | 0 |
| L15 | — | — | — | — | — | **—** | 0 |

Grand total to produce: **TBD** (computed the moment each lesson's data file is filled).

## Batch schedule (check off as completed)

_No batches scheduled yet — the first batch is created together with Lesson 1 data._

- [x] **L1-A** (10 · F) — words w01–w10: 你好 王老师 请问 大家 好 学生 们 老师 您 你们  ✅ 2026-10-10 (workspace TTS · voice approved by user)
- [x] **L1-B** (9 gen + 1 smart copy · F) — words w11–w14 · sentences s01,s03–s06 · **s02←s01**  ✅ 2026-10-10
- [x] **L1-C** (10 · F) — sentences s07–s14 · grammar g1-e1, g1-e2  ✅ 2026-10-10
- [x] **L1-D** (9 gen + 1 smart copy) — dialogue lines d1-l1/l2 · d2-l1..l4 · d3-l1..l4 from 课本 P1-P3
      (d2-l1←s04 · voices: A=王一飞 F · B=小语 F · C=学生们 M)  ✅ 2026-10-10
- [x] **L1-E** (2 gen + 2 smart copies) — g2-e2, g2-e3 · g1-e3←s09 · g2-e1←s07 → 🏁 ALL KNOWN AUDIO COMPLETE  ✅ 2026-10-10
- [x] **L1-F** (3 · F) — w12-w14 regenerated SINGLE-READ (repetition fix)  ✅ 2026-10-10
- [x] **L2-A** (7 · F) — words w01-w07  ✅ 2026-10-10
- [x] **L2-B** (10 · F) — words w08-w15 · sentences s01, s02  ✅ 2026-10-10
- [x] **L2-C** (9 gen + 1 copy · F) — s03-s09, s11, s12 · **s10←s09**  ✅ 2026-10-10
- [x] **L2-D** (7 gen + 1 copy) — dialogue lines d2-l1..l4 (**d2-l4←w10**) · d3-l1..l4  ✅ 2026-10-10
- [x] **L2-E** (3 · F) — sentences s13-s15  ✅ 2026-10-10
- [x] **L2-F** (2 gen + 3 copies) — g1-e1, g1-e2 · g1-e3←s06 · g2-e1←s09 · g2-e2←s11  ✅ 2026-10-10
- [x] **L2-G** (2 gen) — dialogue d1 lines from 课本 P6 (user: nothing was cropped)  ✅ 2026-10-10 → 🏁 L2 AUDIO 45/45

After each batch: update the lesson's `audioReady` + tick the box here
+ run `node tools/validate-lesson.js N` (target: 0 warnings when the lesson is complete).

## Word-clip style (user decision 2026-10-10)

**One clear reading per word clip** — the earlier drill-style double reading
("你好。你好。") was heard as unwanted repetition. L1 words w01–w11 regenerated
single-read on 2026-10-10; w12–w14 next batch; all future lessons follow this style.
Smart copies stay (identical TEXT + VOICE reused), they are not repetition.
**Word clips = the bare word only** (user feedback 2026-10-10): the earlier host-phrase
style for particles (的/吗/还/们) made the word button play a phrase — those four clips
(l01 w07, l03 w02/w16/w18) were re-recorded bare. Context lives in the example button.

## Naming conventions (auto-derived where noted)

```
audio/lNN/words/wXX-slug.mp3          (in data: w.audio.word)
audio/lNN/sentences/sXX-slug.mp3      (in data: w.audio.sentence)
audio/lNN/dialogues/dX-lY.mp3         (in data: line.audio)
audio/lNN/grammar/gX-eY.mp3           (AUTO by app.js — list in audioReady only)
audio/lNN/dialogues/dX-qY.mp3         (AUTO by app.js — list in audioReady only)
```

## Smart copies (HSK 2 lesson learned)

When an example sentence is textually identical to a dialogue line (or a grammar
example is identical to a sentence), **copy the existing MP3** instead of
generating it again — HSK 2 saved ~11 clips in L1 alone this way. Every smart
copy is recorded in its batch line as `sNN←dX-lY`.

## If the user ever supplies human recordings

Drop files with the exact names above into the lesson's audio folder and add the
paths to `audioReady` — the site swaps them in with zero code changes.
