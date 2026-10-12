/* ============================================================
   New HSK Course 1 — Lesson 1 · AI小语，你好！ (Hello, AI Xiaoyu!)
   ------------------------------------------------------------
   SOURCE: 《新HSK教程1》第1课 courseware (FLTRP) — pages cited per entry.
   Dialogue lines transcribed 2026-10-10 from the user's textbook screenshots
   (课本 P1–P3): speakers 王一飞 Wáng Yīfēi (the teacher) · 小语 Xiǎoyǔ (AI
   assistant) · 学生们 the class chorus.
   ============================================================ */
window.LESSON = {

  meta: {
    course: "New HSK Course 1",
    lesson: 1,
    title: "AI小语，你好！",
    titlePinyin: "AI Xiǎoyǔ, nǐ hǎo!",
    titleEn: "Hello, AI Xiaoyu!",
    audioBase: "audio/l01/",
    objectives: {                                   /* courseware p.3 */
      keyWords: ["你好", "谢谢", "不客气", "再见", "您"],
      grammar: ["中文交际礼仪 — polite address 您 vs 你", "们 — the plural suffix"],
      sound: "打招呼、致谢、告别 — greetings, thanks and farewells",
      characters: "您 · 谢 · 再"
    }
  },

  /* Files that EXIST on disk (real recordings).
     Anything not listed here falls back to browser TTS automatically. */
  audioReady: [
    /* batch L1-A (2026-10-10) — 10 word clips, female narrator (approved voice) */
    "words/w01-nihao.mp3",
    "words/w02-wang-laoshi.mp3",
    "words/w03-qingwen.mp3",
    "words/w04-dajia.mp3",
    "words/w05-hao.mp3",
    "words/w06-xuesheng.mp3",
    "words/w07-men.mp3",
    "words/w08-laoshi.mp3",
    "words/w09-nin.mp3",
    "words/w10-nimen.mp3",
    /* batch L1-B (2026-10-10) — 4 words + 6 sentences (s02 = smart copy of s01) */
    "words/w11-xiexie.mp3",
    "words/w12-bu-keqi.mp3",
    "words/w13-tongxue.mp3",
    "words/w14-zaijian.mp3",
    "sentences/s01-nihao.mp3",
    "sentences/s02-wang-laoshi.mp3",
    "sentences/s03-qingwen.mp3",
    "sentences/s04-dajia.mp3",
    "sentences/s05-hao.mp3",
    "sentences/s06-xuesheng.mp3",
    /* batch L1-C (2026-10-10) — sentences s07-s14 + grammar examples g1-e1/e2 */
    "sentences/s07-men.mp3",
    "sentences/s08-laoshi.mp3",
    "sentences/s09-nin.mp3",
    "sentences/s10-nimen.mp3",
    "sentences/s11-xiexie.mp3",
    "sentences/s12-bu-keqi.mp3",
    "sentences/s13-tongxue.mp3",
    "sentences/s14-zaijian.mp3",
    "grammar/g1-e1.mp3",
    "grammar/g1-e2.mp3",
    /* batch L1-D (2026-10-10) — 10 dialogue lines from 课本 P1-P3
       (d2-l1 = smart copy of sentences/s04; C = class chorus on the male voice) */
    "dialogues/d1-l1.mp3",
    "dialogues/d1-l2.mp3",
    "dialogues/d2-l1.mp3",
    "dialogues/d2-l2.mp3",
    "dialogues/d2-l3.mp3",
    "dialogues/d2-l4.mp3",
    "dialogues/d3-l1.mp3",
    "dialogues/d3-l2.mp3",
    "dialogues/d3-l3.mp3",
    "dialogues/d3-l4.mp3",
    /* batch L1-E (2026-10-10) — final grammar examples:
       g1-e3 & g2-e1 are smart copies (s09 / s07); g2-e2 & g2-e3 generated  */
    "grammar/g1-e3.mp3",
    "grammar/g2-e1.mp3",
    "grammar/g2-e2.mp3",
    "grammar/g2-e3.mp3"
  ],

  /* ---- New words — courseware pp.5–9 (text 1), 11–18 (text 2), 25–32 (text 3) ---- */
  words: [
    {
      id: "nihao",
      hz: "你好", pinyin: "nǐ hǎo", pos: "intj.",
      en: "hello",
      key: true,
      note: "",
      audio: { word: "words/w01-nihao.mp3", sentence: "sentences/s01-nihao.mp3" },
      example: { hz: "你好，王老师！", pinyin: "Nǐ hǎo, Wáng lǎoshī!", en: "Hello, Ms. Wang!" }
    },
    {
      id: "wang-laoshi",
      hz: "王老师", pinyin: "Wáng lǎoshī", pos: "proper n.",
      en: "Ms. Wang; Teacher Wang",
      key: false,
      note: "专有名词 · 王 (surname) + 老师 (teacher) = Teacher Wang",
      audio: { word: "words/w02-wang-laoshi.mp3", sentence: "sentences/s02-wang-laoshi.mp3" },
      example: { hz: "你好，王老师！", pinyin: "Nǐ hǎo, Wáng lǎoshī!", en: "Hello, Ms. Wang!" }
    },
    {
      id: "qingwen",
      hz: "请问", pinyin: "qǐngwèn", pos: "v.",
      en: "excuse me",
      key: false,
      note: "example constructed — the courseware lists the word without a sample sentence (textbook P1 will supply the natural context)",
      audio: { word: "words/w03-qingwen.mp3", sentence: "sentences/s03-qingwen.mp3" },
      example: { hz: "请问，您是王老师吗？", pinyin: "Qǐngwèn, nín shì Wáng lǎoshī ma?", en: "Excuse me, are you Ms. Wang?" }
    },
    {
      id: "dajia",
      hz: "大家", pinyin: "dàjiā", pos: "pron.",
      en: "everybody",
      key: false,
      note: "",
      audio: { word: "words/w04-dajia.mp3", sentence: "sentences/s04-dajia.mp3" },
      example: { hz: "大家好！", pinyin: "Dàjiā hǎo!", en: "Hello, everybody!" }
    },
    {
      id: "hao",
      hz: "好", pinyin: "hǎo", pos: "adj.",
      en: "good; fine",
      key: false,
      note: "很好 / 不好",
      audio: { word: "words/w05-hao.mp3", sentence: "sentences/s05-hao.mp3" },
      example: { hz: "他学习很好。", pinyin: "Tā xuéxí hěn hǎo.", en: "His studies are very good." }
    },
    {
      id: "xuesheng",
      hz: "学生", pinyin: "xuéshēng", pos: "n.",
      en: "student",
      key: false,
      note: "小学生 / 中学生 / 大学生",
      audio: { word: "words/w06-xuesheng.mp3", sentence: "sentences/s06-xuesheng.mp3" },
      example: { hz: "他是李老师的学生。", pinyin: "Tā shì Lǐ lǎoshī de xuéshēng.", en: "He is Mr. Li's student." }
    },
    {
      id: "men",
      hz: "们", pinyin: "men", pos: "suf.",
      en: "used after a personal pronoun or a noun to show plural number",
      key: false,
      note: "你们 / 我们 / 他们 / 同学们",
      audio: { word: "words/w07-men.mp3", sentence: "sentences/s07-men.mp3" },
      example: { hz: "你们好吗？", pinyin: "Nǐmen hǎo ma?", en: "Are you all well?" }
    },
    {
      id: "laoshi",
      hz: "老师", pinyin: "lǎoshī", pos: "n.",
      en: "teacher",
      key: true,
      note: "我的老师 / 中文老师 / 王老师",
      audio: { word: "words/w08-laoshi.mp3", sentence: "sentences/s08-laoshi.mp3" },
      example: { hz: "她是我的中文老师。", pinyin: "Tā shì wǒ de Zhōngwén lǎoshī.", en: "She is my Chinese teacher." }
    },
    {
      id: "nin",
      hz: "您", pinyin: "nín", pos: "pron.",
      en: "you (polite)",
      key: true,
      note: "polite form of 你 — used with teachers and elders",
      audio: { word: "words/w09-nin.mp3", sentence: "sentences/s09-nin.mp3" },
      example: { hz: "老师，您好！", pinyin: "Lǎoshī, nín hǎo!", en: "Hello, teacher!" }
    },
    {
      id: "nimen",
      hz: "你们", pinyin: "nǐmen", pos: "pron.",
      en: "(plural) you",
      key: false,
      note: "",
      audio: { word: "words/w10-nimen.mp3", sentence: "sentences/s10-nimen.mp3" },
      example: { hz: "谢谢你们。", pinyin: "Xièxie nǐmen.", en: "Thank you all." }
    },
    {
      id: "xiexie",
      hz: "谢谢", pinyin: "xièxie", pos: "v.",
      en: "thank you",
      key: true,
      note: "",
      audio: { word: "words/w11-xiexie.mp3", sentence: "sentences/s11-xiexie.mp3" },
      example: { hz: "谢谢你！", pinyin: "Xièxie nǐ!", en: "Thank you!" }
    },
    {
      id: "bu-keqi",
      hz: "不客气", pinyin: "bú kèqi", pos: "expr.",
      en: "you're welcome",
      key: true,
      note: "the set reply to 谢谢",
      audio: { word: "words/w12-bu-keqi.mp3", sentence: "sentences/s12-bu-keqi.mp3" },
      example: { hz: "A：谢谢！ B：不客气！", pinyin: "A: Xièxie!  B: Bú kèqi!", en: "A: Thank you!  B: You're welcome!" }
    },
    {
      id: "tongxue",
      hz: "同学", pinyin: "tóngxué", pos: "n.",
      en: "classmate",
      key: false,
      note: "",
      audio: { word: "words/w13-tongxue.mp3", sentence: "sentences/s13-tongxue.mp3" },
      example: { hz: "我和他是同学。", pinyin: "Wǒ hé tā shì tóngxué.", en: "He and I are classmates." }
    },
    {
      id: "zaijian",
      hz: "再见", pinyin: "zàijiàn", pos: "v.",
      en: "goodbye",
      key: true,
      note: "",
      audio: { word: "words/w14-zaijian.mp3", sentence: "sentences/s14-zaijian.mp3" },
      example: { hz: "再见，明天见！", pinyin: "Zàijiàn, míngtiān jiàn!", en: "Goodbye, see you tomorrow!" }
    }
  ],

  /* ---- Grammar & language points (from the courseware objectives + word slides) ---- */
  grammar: [
    {
      id: "g-nin",
      badge: "您",
      title: "您 — the polite “you” · 中文交际礼仪",
      patterns: ["<b>您</b> + greeting / question", "noun (address) + ，+ <b>您</b> / 你 + …"],
      explain: "Chinese greets by <b>addressing first, then greeting</b>: 王老师，你好！ " +
               "<b>您</b> is the respectful form of 你 — use it with teachers, elders and strangers; " +
               "你 is for friends and classmates.",
      examples: [
        { hz: "您好！", pinyin: "Nín hǎo!", en: "Hello! (polite)", hl: "您" },
        { hz: "您去哪儿？", pinyin: "Nín qù nǎr?", en: "Where are you going? (polite)", hl: "您" },
        { hz: "老师，您好！", pinyin: "Lǎoshī, nín hǎo!", en: "Hello, teacher!", hl: "您" }
      ],
      tip: "💡 In class, greet your teacher with 老师，您好！ — using 你 here sounds blunt."
    },
    {
      id: "g-men",
      badge: "们",
      title: "们 — making pronouns plural",
      patterns: ["pronoun / noun (people) + <b>们</b>"],
      explain: "<b>们</b> is a light, unstressed suffix that turns a person word into a group: " +
               "你 → 你们, 我 → 我们, 他 → 他们, 同学 → 同学们. It never takes a number in front.",
      examples: [
        { hz: "你们好吗？", pinyin: "Nǐmen hǎo ma?", en: "Are you all well?", hl: "们" },
        { hz: "他们正在上课。", pinyin: "Tāmen zhèngzài shàngkè.", en: "They are having class.", hl: "们" },
        { hz: "同学们好！", pinyin: "Tóngxuémen hǎo!", en: "Hello, classmates!", hl: "们" }
      ],
      tip: "💡 们 is always neutral-toned: nǐ·men, not nǐ-mén."
    }
  ],

  /* ---- Bonus cards (courseware p.34 tongue twister + p.3 etiquette) ---- */
  bonus: [
    {
      id: "b-tongue", badge: "音", badgeClass: "gold",
      title: "跟读绕口令 · Shadow the tongue twister (track 1-7)",
      items: [
        { char: "麻", name: "妈种麻，我放马。", nameEn: "Mā zhòng má, wǒ fàng mǎ.",
          meaning: "Mom plants flax. I tend the horse.",
          words: "mā · zhòng · má — tones 1, 4, 2", inLesson: "Shadow it slowly, then at speed (track 1-7)" },
        { char: "马", name: "马吃麻，妈骂马。", nameEn: "Mǎ chī má, mā mà mǎ.",
          meaning: "The horse eats the flax. Mom scolds the horse.",
          words: "mǎ · chī · má · mā · mà · mǎ — the four-tone drill", inLesson: "All four tones of “ma” in a single line" }
      ]
    },
    {
      id: "b-etiquette", badge: "礼", badgeClass: "gold",
      title: "中文交际礼仪 · Chinese communication etiquette",
      items: [
        { char: "您", name: "尊称", nameEn: "respectful address",
          meaning: "您 for teachers, elders, strangers · 你 for friends", words: "您 nín · 你 nǐ", inLesson: "您 in 老师，您好！" },
        { char: "请", name: "请问", nameEn: "may I ask…",
          meaning: "Opens a question politely to someone you don't know", words: "请问 qǐngwèn", inLesson: "Text 1, office scene" },
        { char: "谢", name: "致谢与回应", nameEn: "thanks and its reply",
          meaning: "谢谢！ → 不客气！ is the fixed pair", words: "谢谢 · 不客气", inLesson: "Text 3, farewell scene" }
      ]
    }
  ],

  /* ---- Dialogues — REAL lines from 课本 P1–P3 (user screenshots 2026-10-10) ----
       A = 王一飞 Wáng Yīfēi — the teacher (female)
       B = 小语 Xiǎoyǔ — the AI teaching assistant (female)
       C = 学生们 xuéshēngmen — the class chorus. Both named characters are
           female, so the chorus is read by the MALE voice for audible
           contrast (user may veto; one-line change in spVoices).        */
  dialogues: [
    {
      id: "d1",
      kind: "reading",
      title: "开学第一天 · 办公室", titleEn: "First day — the office",
      scene: "开学第一天，在办公室里，王一飞和AI助教小语打招呼。 On the first day of school, in the office, Wang Yifei greets the AI assistant Xiaoyu. (课本 P1)",
      tags: ["打招呼 greetings"],
      spVoices: { A: "f", B: "f", C: "m" },
      lines: [
        { sp: "A", hz: "AI小语，你好！", pinyin: "AI Xiǎoyǔ, nǐ hǎo!", en: "Hello, AI Xiaoyu!", audio: "dialogues/d1-l1.mp3" },
        { sp: "B", hz: "王老师，你好！", pinyin: "Wáng lǎoshī, nǐ hǎo!", en: "Hello, Ms. Wang!", audio: "dialogues/d1-l2.mp3" }
      ],
      questions: []
    },
    {
      id: "d2",
      kind: "reading",
      title: "课堂上 · 打招呼", titleEn: "In class — greetings",
      scene: "开学第一天，课堂上，学生们学习打招呼用语。 On the first day of school, in class, the students learn greeting expressions. (课本 P2)",
      tags: ["打招呼 greetings", "您 polite address"],
      spVoices: { A: "f", B: "f", C: "m" },
      lines: [
        { sp: "A", hz: "大家好！", pinyin: "Dàjiā hǎo!", en: "Hello, everybody!", audio: "dialogues/d2-l1.mp3" },
        { sp: "C", hz: "老师，您好！", pinyin: "Lǎoshī, nín hǎo!", en: "Hello, teacher! (polite)", audio: "dialogues/d2-l2.mp3" },
        { sp: "B", hz: "你们好！", pinyin: "Nǐmen hǎo!", en: "Hello, you all!", audio: "dialogues/d2-l3.mp3" },
        { sp: "C", hz: "你好，小语！", pinyin: "Nǐ hǎo, Xiǎoyǔ!", en: "Hello, Xiaoyu!", audio: "dialogues/d2-l4.mp3" }
      ],
      questions: []
    },
    {
      id: "d3",
      kind: "reading",
      title: "课堂上 · 致谢与告别", titleEn: "In class — thanks & farewells",
      scene: "开学第一天，课堂上，学生们学习致谢语、告别语。 On the first day of school, in class, the students learn expressions of gratitude and farewell. (课本 P3)",
      tags: ["致谢 thanks", "告别 farewells"],
      spVoices: { A: "f", B: "f", C: "m" },
      lines: [
        { sp: "C", hz: "谢谢！", pinyin: "Xièxie!", en: "Thank you!", audio: "dialogues/d3-l1.mp3" },
        { sp: "B", hz: "不客气！", pinyin: "Bú kèqi!", en: "You're welcome!", audio: "dialogues/d3-l2.mp3" },
        { sp: "A", hz: "同学们，再见！", pinyin: "Tóngxuémen, zàijiàn!", en: "Goodbye, classmates!", audio: "dialogues/d3-l3.mp3" },
        { sp: "C", hz: "老师，再见！", pinyin: "Lǎoshī, zàijiàn!", en: "Goodbye, teacher!", audio: "dialogues/d3-l4.mp3" }
      ],
      questions: []
    }
  ]
};
