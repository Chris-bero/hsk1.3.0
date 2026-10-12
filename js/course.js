/* ============================================================
   COURSE REGISTRY — New HSK Course 1 (15 lessons)
   ------------------------------------------------------------
   status: 'ready'  → lesson.html?id=N is fully built & playable
           'soon'   → card shows as locked in the hub
   When a new lesson is finished:
     1) set its status to 'ready'
     2) fill wordCount (+ grammarCount, dialogueCount)
   NOTE: counts are intentionally absent while a lesson is 'soon' —
   validate-lesson.js only cross-checks a count when it is present.
   Titles below follow the standard New HSK Course 1 syllabus
   and MUST be re-verified against the textbook PDF of each lesson.
   ============================================================ */
window.COURSE = {
  id: "hsk1",
  name: "New HSK Course 1",
  nameHz: "新HSK教程 1",
  tagline: "15 lessons · words · grammar · dialogues · games — fully interactive",
  book: "《新HSK教程1》 New HSK Course 1 · FLTRP (外语教学与研究出版社)",
  lessons: [
    /* Lesson 1 — real title from 《新HSK教程1》第1课 courseware (FLTRP).
       Lessons 2-15 titles are PLACEHOLDERS until the book TOC (目录) is supplied:
       this series is NOT 《HSK标准教程》, so the earlier title list does not apply. */
    { n: 1,  num: "一",   hz: "AI小语，你好！", py: "AI Xiǎoyǔ, nǐ hǎo!", en: "Hello, AI Xiaoyu!", status: "ready", wordCount: 14, grammarCount: 2, dialogueCount: 3 },
    { n: 2,  num: "二", hz: "我叫李文", py: "Wǒ jiào Lǐ Wén", en: "My name is Li Wen", status: "ready", wordCount: 15, grammarCount: 2, dialogueCount: 3 },
    { n: 3,  num: "三", hz: "我是中国人", py: "Wǒ shì Zhōngguó rén", en: "I'm Chinese", status: "ready", wordCount: 22, grammarCount: 4, dialogueCount: 3 },
    { n: 4,  num: "四", hz: "我有两个孩子", py: "Wǒ yǒu liǎng gè háizi", en: "I have two children", status: "ready", wordCount: 21, grammarCount: 4, dialogueCount: 3 },
    { n: 5,  num: "五", hz: "今天我休息", py: "Jīntiān wǒ xiūxi", en: "I'm off today", status: "ready", wordCount: 22, grammarCount: 3, dialogueCount: 3 },
    { n: 6,  num: "六", hz: "—", py: "—", en: "Lesson 6 — title pending the book TOC", status: "soon" },
    { n: 7,  num: "七", hz: "—", py: "—", en: "Lesson 7 — title pending the book TOC", status: "soon" },
    { n: 8,  num: "八", hz: "—", py: "—", en: "Lesson 8 — title pending the book TOC", status: "soon" },
    { n: 9,  num: "九", hz: "—", py: "—", en: "Lesson 9 — title pending the book TOC", status: "soon" },
    { n: 10,  num: "十", hz: "—", py: "—", en: "Lesson 10 — title pending the book TOC", status: "soon" },
    { n: 11,  num: "十一", hz: "—", py: "—", en: "Lesson 11 — title pending the book TOC", status: "soon" },
    { n: 12,  num: "十二", hz: "—", py: "—", en: "Lesson 12 — title pending the book TOC", status: "soon" },
    { n: 13,  num: "十三", hz: "—", py: "—", en: "Lesson 13 — title pending the book TOC", status: "soon" },
    { n: 14,  num: "十四", hz: "—", py: "—", en: "Lesson 14 — title pending the book TOC", status: "soon" },
    { n: 15,  num: "十五", hz: "—", py: "—", en: "Lesson 15 — title pending the book TOC", status: "soon" }
  ]
};
