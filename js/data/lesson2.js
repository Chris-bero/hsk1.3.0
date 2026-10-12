/* ============================================================
   New HSK Course 1 — Lesson 2 · 我叫李文 (My name is Li Wen)
   ------------------------------------------------------------
   SOURCE: 《新HSK教程1》第2课 courseware (FLTRP), pages cited per entry.
   words / grammar / bonus / meta  → REAL, quoted from the courseware.
   dialogues d2 & d3 lines          → REAL, transcribed 2026-10-10 from the user's
     textbook screenshots (课本 P7–P8).
   dialogue d1 lines                → REAL (课本 P6, user-confirmed complete: two lines).
   ============================================================ */
window.LESSON = {

  meta: {
    course: "New HSK Course 1",
    lesson: 2,
    title: "我叫李文",
    titlePinyin: "Wǒ jiào Lǐ Wén",
    titleEn: "My name is Li Wen",
    audioBase: "audio/l02/",
    objectives: {                                   /* courseware p.3 */
      keyWords: ["叫", "名字", "对不起", "认识", "也"],
      grammar: ["汉语的基本语序 S+V+O", "致歉语: 对不起 → 没关系 / 没事"],
      sound: "自我介绍与致歉 — self-introductions and apologies",
      characters: "中文姓名构成 — surname first, given name after"
    }
  },

  audioReady: [
    /* batch L2-A (2026-10-10) — words w01-w07, single-read style */
    "words/w01-qingwen.mp3",
    "words/w02-ni.mp3",
    "words/w03-jiao.mp3",
    "words/w04-shenme.mp3",
    "words/w05-mingzi.mp3",
    "words/w06-wo.mp3",
    "words/w07-bu.mp3",
    /* batch L2-B (2026-10-10) — words w08-w15 + sentences s01, s02 */
    "words/w08-shi.mp3",
    "words/w09-duibuqi.mp3",
    "words/w10-mei-guanxi.mp3",
    "words/w11-meishi.mp3",
    "words/w12-hen.mp3",
    "words/w13-gaoxing.mp3",
    "words/w14-renshi.mp3",
    "words/w15-ye.mp3",
    "sentences/s01-qingwen.mp3",
    "sentences/s02-ni.mp3",
    /* batch L2-C (2026-10-10) — sentences s03-s09, s11, s12 + smart copy s10<-s09 */
    "sentences/s03-jiao.mp3",
    "sentences/s04-shenme.mp3",
    "sentences/s05-mingzi.mp3",
    "sentences/s06-wo.mp3",
    "sentences/s07-bu.mp3",
    "sentences/s08-shi.mp3",
    "sentences/s09-duibuqi.mp3",
    "sentences/s10-mei-guanxi.mp3",
    "sentences/s11-meishi.mp3",
    "sentences/s12-hen.mp3",
    /* batch L2-D (2026-10-10) — dialogue lines d2 & d3 from 课本 P7-P8
       (d2-l4 = smart copy of words/w10; A=陈天中/李文 M · B=白家月 F) */
    "dialogues/d2-l1.mp3",
    "dialogues/d2-l2.mp3",
    "dialogues/d2-l3.mp3",
    "dialogues/d2-l4.mp3",
    "dialogues/d3-l1.mp3",
    "dialogues/d3-l2.mp3",
    "dialogues/d3-l3.mp3",
    "dialogues/d3-l4.mp3",
    /* batch L2-E (2026-10-10) — sentences s13-s15 */
    "sentences/s13-gaoxing.mp3",
    "sentences/s14-renshi.mp3",
    "sentences/s15-ye.mp3",
    /* batch L2-G (2026-10-10) — dialogue d1 lines from 课本 P6 (user-confirmed complete) */
    "dialogues/d1-l1.mp3",
    "dialogues/d1-l2.mp3",
    /* batch L2-F (2026-10-10) — grammar examples: g1-e1/e2 generated,
       g1-e3<-s06 · g2-e1<-s09 · g2-e2<-s11 smart copies  =>  L2 AUDIO COMPLETE */
    "grammar/g1-e1.mp3",
    "grammar/g1-e2.mp3",
    "grammar/g1-e3.mp3",
    "grammar/g2-e1.mp3",
    "grammar/g2-e2.mp3"
  ],

  /* ---- New words — courseware pp.5–11 (text 1), 18–21 (text 2), 28–32 (text 3) ---- */
  words: [
    {
      id: "qingwen", hz: "请问", pinyin: "qǐngwèn", pos: "v.", en: "excuse me", key: true, note: "",
      audio: { word: "words/w01-qingwen.mp3", sentence: "sentences/s01-qingwen.mp3" },
      example: { hz: "请问超市在哪儿？", pinyin: "Qǐngwèn, chāoshì zài nǎr?", en: "Excuse me, where is the supermarket?" }
    },
    {
      id: "ni", hz: "你", pinyin: "nǐ", pos: "pron.", en: "(singular) you", key: false, note: "",
      audio: { word: "words/w02-ni.mp3", sentence: "sentences/s02-ni.mp3" },
      example: { hz: "你好!", pinyin: "Nǐ hǎo!", en: "Hello!" }
    },
    {
      id: "jiao", hz: "叫", pinyin: "jiào", pos: "v.", en: "be called as", key: true, note: "",
      audio: { word: "words/w03-jiao.mp3", sentence: "sentences/s03-jiao.mp3" },
      example: { hz: "她的名字叫什么？", pinyin: "Tā de míngzi jiào shénme?", en: "What is her name?" }
    },
    {
      id: "shenme", hz: "什么", pinyin: "shénme", pos: "pron.", en: "what", key: true, note: "",
      audio: { word: "words/w04-shenme.mp3", sentence: "sentences/s04-shenme.mp3" },
      example: { hz: "这是什么？", pinyin: "Zhè shì shénme?", en: "What is this?" }
    },
    {
      id: "mingzi", hz: "名字", pinyin: "míngzi", pos: "n.", en: "name", key: true, note: "",
      audio: { word: "words/w05-mingzi.mp3", sentence: "sentences/s05-mingzi.mp3" },
      example: { hz: "这个名字真好。", pinyin: "Zhè ge míngzi zhēn hǎo.", en: "This name is really nice." }
    },
    {
      id: "wo", hz: "我", pinyin: "wǒ", pos: "pron.", en: "I; me", key: true, note: "",
      audio: { word: "words/w06-wo.mp3", sentence: "sentences/s06-wo.mp3" },
      example: { hz: "我是学生。", pinyin: "Wǒ shì xuéshēng.", en: "I am a student." }
    },
    {
      id: "bu", hz: "不", pinyin: "bù", pos: "adv.", en: "not; no", key: true,
      note: "不能 / 不好 / 不对 · sandhi: bú before a 4th tone (不是 bú shì)",
      audio: { word: "words/w07-bu.mp3", sentence: "sentences/s07-bu.mp3" },
      example: { hz: "我不是白家月。", pinyin: "Wǒ bú shì Bái Jiāyuè.", en: "I am not Bai Jiayue." }
    },
    {
      id: "shi", hz: "是", pinyin: "shì", pos: "v.", en: "be", key: true, note: "",
      audio: { word: "words/w08-shi.mp3", sentence: "sentences/s08-shi.mp3" },
      example: { hz: "她是谁？", pinyin: "Tā shì shéi?", en: "Who is she?" }
    },
    {
      id: "duibuqi", hz: "对不起", pinyin: "duìbuqǐ", pos: "v.", en: "sorry", key: true, note: "",
      audio: { word: "words/w09-duibuqi.mp3", sentence: "sentences/s09-duibuqi.mp3" },
      example: { hz: "A：对不起！ B：没关系！", pinyin: "A: Duìbuqǐ!  B: Méi guānxi!", en: "A: Sorry!  B: That's all right!" }
    },
    {
      id: "mei-guanxi", hz: "没关系", pinyin: "méi guānxi", pos: "expr.", en: "that's all right; never mind", key: true, note: "",
      audio: { word: "words/w10-mei-guanxi.mp3", sentence: "sentences/s10-mei-guanxi.mp3" },
      example: { hz: "A：对不起！ B：没关系！", pinyin: "A: Duìbuqǐ!  B: Méi guānxi!", en: "A: Sorry!  B: That's all right!" }
    },
    {
      id: "meishi", hz: "没事", pinyin: "méishì", pos: "v.", en: "it doesn't matter", key: false, note: "",
      audio: { word: "words/w11-meishi.mp3", sentence: "sentences/s11-meishi.mp3" },
      example: { hz: "A：对不起！ B：没事！", pinyin: "A: Duìbuqǐ!  B: Méishì!", en: "A: Sorry!  B: It doesn't matter!" }
    },
    {
      id: "hen", hz: "很", pinyin: "hěn", pos: "adv.", en: "very", key: true, note: "很好 / 很高兴",
      audio: { word: "words/w12-hen.mp3", sentence: "sentences/s12-hen.mp3" },
      example: { hz: "我很好。", pinyin: "Wǒ hěn hǎo.", en: "I am very well." }
    },
    {
      id: "gaoxing", hz: "高兴", pinyin: "gāoxìng", pos: "adj.", en: "glad; happy", key: true, note: "很高兴 / 不高兴",
      audio: { word: "words/w13-gaoxing.mp3", sentence: "sentences/s13-gaoxing.mp3" },
      example: { hz: "很高兴认识你。", pinyin: "Hěn gāoxìng rènshi nǐ.", en: "Nice to meet you." }
    },
    {
      id: "renshi", hz: "认识", pinyin: "rènshi", pos: "v.", en: "know; become acquainted with", key: true, note: "认识他 / 不认识",
      audio: { word: "words/w14-renshi.mp3", sentence: "sentences/s14-renshi.mp3" },
      example: { hz: "A：你认识他吗？ B：我不认识他。", pinyin: "A: Nǐ rènshi tā ma?  B: Wǒ bú rènshi tā.", en: "A: Do you know him?  B: I don't know him." }
    },
    {
      id: "ye", hz: "也", pinyin: "yě", pos: "adv.", en: "also; too", key: true, note: "",
      audio: { word: "words/w15-ye.mp3", sentence: "sentences/s15-ye.mp3" },
      example: { hz: "我也很高兴。", pinyin: "Wǒ yě hěn gāoxìng.", en: "I am glad too." }
    }
  ],

  /* ---- Grammar — 小语讲堂 p.26 + the apology pair (pp.18/21) ---- */
  grammar: [
    {
      id: "g-svo",
      badge: "语",
      title: "汉语的基本语序 — Subject + Verb + Object",
      patterns: ["主语 + 谓语 + 宾语", "<b>S</b> + <b>V</b> + <b>O</b>"],
      explain: "Chinese keeps the same order as English here: <b>who</b> does <b>what</b> to <b>whom</b>. " +
               "我 (subject) 叫 (verb) 陈天中 (object). No extra words needed.",
      examples: [
        { hz: "你叫什么名字？", pinyin: "Nǐ jiào shénme míngzi?", en: "What is your name?", hl: "叫" },
        { hz: "我叫白家月。", pinyin: "Wǒ jiào Bái Jiāyuè.", en: "My name is Bai Jiayue.", hl: "叫" },
        { hz: "我是学生。", pinyin: "Wǒ shì xuéshēng.", en: "I am a student.", hl: "是" }
      ],
      tip: "💡 Read the three patterns aloud (p.26): the verb sits between the doer and the thing done."
    },
    {
      id: "g-apology",
      badge: "歉",
      title: "致歉语 — sorry and its two replies",
      patterns: ["对不起！ → <b>没关系！</b> / <b>没事！</b>"],
      explain: "One apology, two comfortable answers: <b>没关系</b> “no hard feelings” and " +
               "<b>没事</b> “it's nothing”. Both close the moment politely.",
      examples: [
        { hz: "A：对不起！ B：没关系！", pinyin: "A: Duìbuqǐ!  B: Méi guānxi!", en: "A: Sorry!  B: That's all right!", hl: "没关系" },
        { hz: "A：对不起！ B：没事！", pinyin: "A: Duìbuqǐ!  B: Méishì!", en: "A: Sorry!  B: It doesn't matter!", hl: "没事" }
      ],
      tip: "💡 Text 2 ends with this exact exchange — Chen Tianzhong mistook Bai Jiayue for someone else."
    }
  ],

  /* ---- Bonus — tongue twister 2-7 (p.37) + name structure (objective p.3) ---- */
  bonus: [
    {
      id: "b-tongue2", badge: "音", badgeClass: "gold",
      title: "跟读绕口令 · Shadow the tongue twister (track 2-7)",
      items: [
        { char: "加", name: "七加一，再减一，加完减完等于几？", nameEn: "Qī jiā yī, zài jiǎn yī, jiā wán jiǎn wán děngyú jǐ?",
          meaning: "Seven plus one, minus one again — add it up, take it down, what's the gain?",
          words: "jiā / jiǎn — the near-minimal pair of this drill", inLesson: "Shadow it slowly, then at speed (track 2-7)" },
        { char: "还", name: "加完减完还是七。", nameEn: "Jiā wán jiǎn wán hái shì qī.",
          meaning: "Add it up, take it down — still just seven!",
          words: "hái shì — “still”", inLesson: "The punchline: the number never changed" }
      ]
    },
    {
      id: "b-names", badge: "名", badgeClass: "gold",
      title: "中文姓名构成 · The structure of Chinese names",
      items: [
        { char: "李", name: "李文", nameEn: "Lǐ Wén", meaning: "surname 李 + given name 文 — family name FIRST",
          words: "李文 · 李白", inLesson: "The lesson title: 我叫李文" },
        { char: "白", name: "白家月", nameEn: "Bái Jiāyuè", meaning: "surname 白 + two-syllable given name 家月",
          words: "白家月", inLesson: "Text 2 & 3 — the student Chen Tianzhong mistakes" },
        { char: "陈", name: "陈天中", nameEn: "Chén Tiānzhōng", meaning: "surname 陈 + given name 天中",
          words: "陈天中", inLesson: "Text 2 — greets Bai Jiayue by mistake" },
        { char: "王", name: "王老师", nameEn: "Wáng lǎoshī", meaning: "surname + title = respectful address (Lesson 1)",
          words: "王老师 · 李老师", inLesson: "Calling a teacher by name alone sounds blunt" }
      ]
    }
  ],

  /* ---- Dialogues — scenes REAL (courseware pp.4/17/27); lines pending 课本 P6–P8 ---- */
  dialogues: [
    {
      id: "d1", kind: "reading",
      title: "教室里 · 认识学生", titleEn: "In class — meeting the students",
      scene: "在教室里，王一飞在认识学生。 Wang Yifei was getting to know the students in the classroom. (课本 P6)",
      tags: ["自我介绍 self-introduction", "⚠ lines pending 课本 P6"],
      spVoices: { A: "f", B: "m" },          /* A = 王一飞 Wáng Yīfēi (teacher) · B = 陈天中 Chén Tiānzhōng */
      lines: [
        { sp: "A", hz: "请问，你叫什么名字？", pinyin: "Qǐngwèn, nǐ jiào shénme míngzi?", en: "Excuse me, what is your name?", audio: "dialogues/d1-l1.mp3" },
        { sp: "B", hz: "我叫陈天中。", pinyin: "Wǒ jiào Chén Tiānzhōng.", en: "My name is Chen Tianzhong.", audio: "dialogues/d1-l2.mp3" }
      ],
      questions: []
    },
    {
      id: "d2", kind: "reading",
      title: "校园里 · 认错人", titleEn: "On campus — mistaken identity",
      scene: "在校园里，陈天中和白家月打招呼时认错了人。 On campus, Chen Tianzhong greeted Bai Jiayue but mistook her for someone else. (课本 P7)",
      tags: ["打招呼 greetings", "致歉 apology"],
      spVoices: { A: "m", B: "f" },          /* A = 陈天中 Chen Tianzhong · B = 白家月 Bai Jiayue */
      lines: [
        { sp: "A", hz: "你好，安妮！", pinyin: "Nǐ hǎo, Ānnī!", en: "Hello, Annie!", audio: "dialogues/d2-l1.mp3" },
        { sp: "B", hz: "你好，陈天中！我不是安妮，我是白家月。", pinyin: "Nǐ hǎo, Chén Tiānzhōng! Wǒ bú shì Ānnī, wǒ shì Bái Jiāyuè.", en: "Hello, Chen Tianzhong! I'm not Annie — I'm Bai Jiayue.", audio: "dialogues/d2-l2.mp3" },
        { sp: "A", hz: "对不起！", pinyin: "Duìbuqǐ!", en: "Sorry!", audio: "dialogues/d2-l3.mp3" },
        { sp: "B", hz: "没关系！", pinyin: "Méi guānxi!", en: "That's all right!", audio: "dialogues/d2-l4.mp3" }
      ],
      questions: []
    },
    {
      id: "d3", kind: "reading",
      title: "校园里 · 初遇", titleEn: "On campus — first meeting",
      scene: "在校园里，李文和白家月第一次相遇。 Li Wen and Bai Jiayue met for the first time on campus. (课本 P8)",
      tags: ["自我介绍 self-introduction", "很高兴认识你"],
      spVoices: { A: "m", B: "f" },          /* A = 李文 Li Wen · B = 白家月 Bai Jiayue */
      lines: [
        { sp: "A", hz: "你好！我叫李文。", pinyin: "Nǐ hǎo! Wǒ jiào Lǐ Wén.", en: "Hello! My name is Li Wen.", audio: "dialogues/d3-l1.mp3" },
        { sp: "B", hz: "你好！我叫白家月。", pinyin: "Nǐ hǎo! Wǒ jiào Bái Jiāyuè.", en: "Hello! My name is Bai Jiayue.", audio: "dialogues/d3-l2.mp3" },
        { sp: "A", hz: "很高兴认识你。", pinyin: "Hěn gāoxìng rènshi nǐ.", en: "Nice to meet you.", audio: "dialogues/d3-l3.mp3" },
        { sp: "B", hz: "认识你我也很高兴。", pinyin: "Rènshi nǐ wǒ yě hěn gāoxìng.", en: "Nice to meet you too.", audio: "dialogues/d3-l4.mp3" }
      ],
      questions: []
    }
  ]
};
