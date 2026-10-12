/* ============================================================
   New HSK Course 1 — Lesson 3 · 我是中国人 (I'm Chinese)
   ------------------------------------------------------------
   SOURCE: 《新HSK教程1》第3课 courseware (FLTRP), pages cited per entry.
   words / grammar / bonus / meta → REAL, quoted from the courseware.
   dialogues[].lines              → REAL, transcribed 2026-10-10 from the user's
     textbook screenshots (课本 P10 / P12 / P14).
   ============================================================ */
window.LESSON = {

  meta: {
    course: "New HSK Course 1",
    lesson: 3,
    title: "我是中国人",
    titlePinyin: "Wǒ shì Zhōngguó rén",
    titleEn: "I'm Chinese",
    audioBase: "audio/l03/",
    objectives: {                                   /* courseware p.3 */
      keyWords: ["的", "吗", "中国", "中文", "谁", "哪", "想", "工作"],
      grammar: ["“是”字句 the “是” sentence", "结构助词“的” the structural particle 的", "用“吗”的是非问句 yes-no questions with 吗"],
      sound: "sì / shí contrast · rising clarity of 吗 questions",
      characters: "国 · 中 · 文 · 们"
    }
  },

  audioReady: [
    /* batch L3-A (2026-10-10) — dialogue lines from 课本 P10/P12/P14
       (d2-l1 will join as a smart copy of sentences/s07 once s07 exists) */
    "dialogues/d1-l1.mp3",
    "dialogues/d1-l2.mp3",
    "dialogues/d2-l2.mp3",
    "dialogues/d2-l3.mp3",
    "dialogues/d2-l4.mp3",
    "dialogues/d3-l1.mp3",
    "dialogues/d3-l2.mp3",
    "dialogues/d3-l3.mp3",
    "dialogues/d3-l4.mp3",
    "dialogues/d3-l5.mp3",
    /* batch L3-B (2026-10-10) — d3-l6 + words w01-w09 (的 heard in three hosts: 我的/你的/他的) */
    "dialogues/d3-l6.mp3",
    "words/w01-ren.mp3",
    "words/w02-de.mp3",
    "words/w03-zhongguo.mp3",
    "words/w04-faguo.mp3",
    "words/w05-zhongwen.mp3",
    "words/w06-ta.mp3",
    "words/w07-zhe.mp3",
    "words/w08-shei.mp3",
    "words/w09-nvpengyou.mp3",
    /* batch L3-C (2026-10-10) — words w10-w19 (还/吗 heard in natural hosts) */
    "words/w10-na.mp3",
    "words/w11-guo.mp3",
    "words/w12-taiguo.mp3",
    "words/w13-wei.mp3",
    "words/w14-jiejie.mp3",
    "words/w15-gongzuo.mp3",
    "words/w16-hai.mp3",
    "words/w17-mang.mp3",
    "words/w18-ma.mp3",
    "words/w19-dui.mp3",
    /* batch L3-D (2026-10-10) — words w20-w22 · sentences s01-s07
       + smart copy dialogues/d2-l1 <- sentences/s07 (这是谁؟ · 安妮 F) */
    "words/w20-tai.mp3",
    "words/w21-women.mp3",
    "words/w22-xiang.mp3",
    "sentences/s01-ren.mp3",
    "sentences/s02-de.mp3",
    "sentences/s03-zhongguo.mp3",
    "sentences/s04-faguo.mp3",
    "sentences/s05-zhongwen.mp3",
    "sentences/s06-ta.mp3",
    "sentences/s07-zhe.mp3",
    "dialogues/d2-l1.mp3",
    /* batch L3-E (2026-10-10) — sentences s08-s17 */
    "sentences/s08-shei.mp3",
    "sentences/s09-nvpengyou.mp3",
    "sentences/s10-na.mp3",
    "sentences/s11-guo.mp3",
    "sentences/s12-taiguo.mp3",
    "sentences/s13-wei.mp3",
    "sentences/s14-jiejie.mp3",
    "sentences/s15-gongzuo.mp3",
    "sentences/s16-hai.mp3",
    "sentences/s17-mang.mp3",
    /* batch L3-F (2026-10-10) — sentences s18-s22 + grammar g1-e1..e3, g2-e1/e2 */
    "sentences/s18-ma.mp3",
    "sentences/s19-dui.mp3",
    "sentences/s20-tai.mp3",
    "sentences/s21-women.mp3",
    "sentences/s22-xiang.mp3",
    "grammar/g1-e1.mp3",
    "grammar/g1-e2.mp3",
    "grammar/g1-e3.mp3",
    "grammar/g2-e1.mp3",
    "grammar/g2-e2.mp3",
    /* batch L3-G (2026-10-10) — grammar g3-e1..e4, g4-e1..e3 + copy g2-e3<-s02
       => L3 AUDIO COMPLETE 69/69 */
    "grammar/g3-e1.mp3",
    "grammar/g3-e2.mp3",
    "grammar/g3-e3.mp3",
    "grammar/g3-e4.mp3",
    "grammar/g4-e1.mp3",
    "grammar/g4-e2.mp3",
    "grammar/g4-e3.mp3",
    "grammar/g2-e3.mp3"
  ],

  /* ---- New words — courseware pp.5–10 (text 1), 19–26 (text 2), 33–44 (text 3) ---- */
  words: [
    { id: "ren", hz: "人", pinyin: "rén", pos: "n.", en: "human; person", key: false, note: "人们 / 一个人",
      audio: { word: "words/w01-ren.mp3", sentence: "sentences/s01-ren.mp3" },
      example: { hz: "他是一个好人。", pinyin: "Tā shì yí ge hǎorén.", en: "He is a good person." } },
    { id: "de", hz: "的", pinyin: "de", pos: "part.", en: "used after an attributive", key: true, note: "我的老师 / 你的名字",
      audio: { word: "words/w02-de.mp3", sentence: "sentences/s02-de.mp3" },
      example: { hz: "王老师是他的老师。", pinyin: "Wáng lǎoshī shì tā de lǎoshī.", en: "Ms. Wang is his teacher." } },
    { id: "zhongguo", hz: "中国", pinyin: "Zhōngguó", pos: "proper n.", en: "China", key: true, note: "中国人 / 中国学生",
      audio: { word: "words/w03-zhongguo.mp3", sentence: "sentences/s03-zhongguo.mp3" },
      example: { hz: "我是中国人。", pinyin: "Wǒ shì Zhōngguó rén.", en: "I am Chinese." } },
    { id: "faguo", hz: "法国", pinyin: "Fǎguó", pos: "proper n.", en: "France", key: false, note: "法国人 / 法国学生",
      audio: { word: "words/w04-faguo.mp3", sentence: "sentences/s04-faguo.mp3" },
      example: { hz: "我认识一个法国人。", pinyin: "Wǒ rènshi yí ge Fǎguó rén.", en: "I know a French person." } },
    { id: "zhongwen", hz: "中文", pinyin: "Zhōngwén", pos: "n.", en: "Chinese language", key: true, note: "中文老师 / 学中文 / 说中文",
      audio: { word: "words/w05-zhongwen.mp3", sentence: "sentences/s05-zhongwen.mp3" },
      example: { hz: "他中文很好。", pinyin: "Tā Zhōngwén hěn hǎo.", en: "His Chinese is very good." } },
    { id: "ta", hz: "她", pinyin: "tā", pos: "pron.", en: "she; her", key: true, note: "她们 / 她的",
      audio: { word: "words/w06-ta.mp3", sentence: "sentences/s06-ta.mp3" },
      example: { hz: "你认识她吗？", pinyin: "Nǐ rènshi tā ma?", en: "Do you know her?" } },
    { id: "zhe", hz: "这", pinyin: "zhè", pos: "pron.", en: "this", key: false, note: "这个 / 这里",
      audio: { word: "words/w07-zhe.mp3", sentence: "sentences/s07-zhe.mp3" },
      example: { hz: "这是谁？", pinyin: "Zhè shì shéi?", en: "Who is this?" } },
    { id: "shei", hz: "谁", pinyin: "shéi", pos: "pron.", en: "who", key: true, note: "shéi / shuí · 谁的 / 是谁",
      audio: { word: "words/w08-shei.mp3", sentence: "sentences/s08-shei.mp3" },
      example: { hz: "谁认识法国人？", pinyin: "Shéi rènshi Fǎguó rén?", en: "Who knows a French person?" } },
    { id: "nvpengyou", hz: "女朋友", pinyin: "nǚpéngyou", pos: "n.", en: "girlfriend", key: false, note: "",
      audio: { word: "words/w09-nvpengyou.mp3", sentence: "sentences/s09-nvpengyou.mp3" },
      example: { hz: "她是谁的女朋友？", pinyin: "Tā shì shéi de nǚpéngyou?", en: "Whose girlfriend is she?" } },
    { id: "na", hz: "哪", pinyin: "nǎ", pos: "pron.", en: "which", key: true, note: "哪国 / 哪个",
      audio: { word: "words/w10-na.mp3", sentence: "sentences/s10-na.mp3" },
      example: { hz: "他是哪国人？", pinyin: "Tā shì nǎ guó rén?", en: "Which country is he from?" } },
    { id: "guo", hz: "国", pinyin: "guó", pos: "n.", en: "country", key: false, note: "哪国 / 我国 / 两国",
      audio: { word: "words/w11-guo.mp3", sentence: "sentences/s11-guo.mp3" },
      example: { hz: "你是哪国人？", pinyin: "Nǐ shì nǎ guó rén?", en: "Which country are you from?" } },
    { id: "taiguo", hz: "泰国", pinyin: "Tàiguó", pos: "proper n.", en: "Thailand", key: false, note: "泰国人 / 泰国学生",
      audio: { word: "words/w12-taiguo.mp3", sentence: "sentences/s12-taiguo.mp3" },
      example: { hz: "我想去泰国。", pinyin: "Wǒ xiǎng qù Tàiguó.", en: "I want to go to Thailand." } },
    { id: "wei", hz: "喂", pinyin: "wèi", pos: "int.", en: "hello; hey", key: false, note: "喂！/ 你好！",
      audio: { word: "words/w13-wei.mp3", sentence: "sentences/s13-wei.mp3" },
      example: { hz: "喂，请问是王老师吗？", pinyin: "Wèi, qǐngwèn shì Wáng lǎoshī ma?", en: "Hello — is this Ms. Wang, please?" } },
    { id: "jiejie", hz: "姐姐", pinyin: "jiějie", pos: "n.", en: "elder sister", key: false, note: "我姐姐 / 我的姐姐 / 一个姐姐",
      audio: { word: "words/w14-jiejie.mp3", sentence: "sentences/s14-jiejie.mp3" },
      example: { hz: "她姐姐是我同学。", pinyin: "Tā jiějie shì wǒ tóngxué.", en: "Her elder sister is my classmate." } },
    { id: "gongzuo", hz: "工作", pinyin: "gōngzuò", pos: "n.", en: "job", key: true, note: "我的工作 / 有工作 / 没有工作",
      audio: { word: "words/w15-gongzuo.mp3", sentence: "sentences/s15-gongzuo.mp3" },
      example: { hz: "你喜欢什么工作？", pinyin: "Nǐ xǐhuan shénme gōngzuò?", en: "What job do you like?" } },
    { id: "hai", hz: "还", pinyin: "hái", pos: "adv.", en: "still", key: false, note: "",
      audio: { word: "words/w16-hai.mp3", sentence: "sentences/s16-hai.mp3" },
      example: { hz: "你还忙吗？", pinyin: "Nǐ hái máng ma?", en: "Are you still busy?" } },
    { id: "mang", hz: "忙", pinyin: "máng", pos: "adj.", en: "busy", key: false, note: "很忙 / 不忙 / 忙不忙",
      audio: { word: "words/w17-mang.mp3", sentence: "sentences/s17-mang.mp3" },
      example: { hz: "他的工作很忙。", pinyin: "Tā de gōngzuò hěn máng.", en: "His job is very busy." } },
    { id: "ma", hz: "吗", pinyin: "ma", pos: "part.", en: "used at the end of a question", key: true, note: "",
      audio: { word: "words/w18-ma.mp3", sentence: "sentences/s18-ma.mp3" },
      example: { hz: "你有工作吗？", pinyin: "Nǐ yǒu gōngzuò ma?", en: "Do you have a job?" } },
    { id: "dui", hz: "对", pinyin: "duì", pos: "adj.", en: "right", key: false, note: "很对 / 不对 / 对不对",
      audio: { word: "words/w19-dui.mp3", sentence: "sentences/s19-dui.mp3" },
      example: { hz: "A：他是中国人吗？ B：对，他是中国人。", pinyin: "A: Tā shì Zhōngguó rén ma?  B: Duì, tā shì Zhōngguó rén.", en: "A: Is he Chinese?  B: Right, he is Chinese." } },
    { id: "tai", hz: "太", pinyin: "tài", pos: "adv.", en: "too; excessively", key: false, note: "太好了！",
      audio: { word: "words/w20-tai.mp3", sentence: "sentences/s20-tai.mp3" },
      example: { hz: "他太忙了。", pinyin: "Tā tài máng le.", en: "He is too busy." } },
    { id: "women", hz: "我们", pinyin: "wǒmen", pos: "pron.", en: "we; us", key: false, note: "",
      audio: { word: "words/w21-women.mp3", sentence: "sentences/s21-women.mp3" },
      example: { hz: "我们是同学。", pinyin: "Wǒmen shì tóngxué.", en: "We are classmates." } },
    { id: "xiang", hz: "想", pinyin: "xiǎng", pos: "v.", en: "miss", key: true, note: "",
      audio: { word: "words/w22-xiang.mp3", sentence: "sentences/s22-xiang.mp3" },
      example: { hz: "我想你了。", pinyin: "Wǒ xiǎng nǐ le.", en: "I miss you." } }
  ],

  /* ---- Grammar — 小语讲堂 pp.15/16/17/53 ---- */
  grammar: [
    {
      id: "g-shi", badge: "是",
      title: "“是”字句 — the “是” sentence",
      patterns: ["A + <b>是</b> + B", "A + <b>不是</b> + B  (negative)"],
      explain: "“是” says what somebody or something <b>equals</b> or <b>belongs to</b>. " +
               "It never changes form; the negative is the two-character block 不是.",
      examples: [
        { hz: "我是法国人。", pinyin: "Wǒ shì Fǎguó rén.", en: "I am French.", hl: "是" },
        { hz: "她是中文老师。", pinyin: "Tā shì Zhōngwén lǎoshī.", en: "She is a Chinese teacher.", hl: "是" },
        { hz: "我老师不是法国人。", pinyin: "Wǒ lǎoshī bú shì Fǎguó rén.", en: "My teacher is not French.", hl: "不是" }
      ],
      tip: "💡 Read the three aloud (p.15): the third drops 的 — see the next card for why."
    },
    {
      id: "g-de", badge: "的",
      title: "结构助词“的” — the structural particle",
      patterns: ["attributive + <b>的</b> + head noun  (possession)"],
      explain: "的 glues a modifier to what it owns or describes: 白家月<b>的</b>中文老师 " +
               "“Bai Jiayue's Chinese teacher”. It is light and never stressed.",
      examples: [
        { hz: "白家月的中文老师", pinyin: "Bái Jiāyuè de Zhōngwén lǎoshī", en: "Bai Jiayue's Chinese teacher", hl: "的" },
        { hz: "你的名字", pinyin: "nǐ de míngzi", en: "your name", hl: "的" },
        { hz: "王老师是他的老师。", pinyin: "Wáng lǎoshī shì tā de lǎoshī.", en: "Ms. Wang is his teacher.", hl: "的" }
      ],
      tip: "💡 的 is the most frequent character in Chinese — hear it, don't stress it."
    },
    {
      id: "g-de-omit", badge: "的",
      title: "“的” can be omitted — pronoun + kin / person nouns",
      patterns: ["pronoun + (的) + kinship term / person noun"],
      explain: "Before a <b>kinship word</b> or a <b>person noun</b>, a personal pronoun may drop 的: " +
               "我老师 = 我的老师. With other nouns the 的 must stay (我的名字, not 我名字).",
      examples: [
        { hz: "我老师", pinyin: "wǒ lǎoshī", en: "my teacher (的 omitted)", hl: "我" },
        { hz: "我学生", pinyin: "wǒ xuéshēng", en: "my student", hl: "我" },
        { hz: "你同学", pinyin: "nǐ tóngxué", en: "your classmate", hl: "你" },
        { hz: "我妈妈", pinyin: "wǒ māma", en: "my mother", hl: "我" }
      ],
      tip: "💡 p.17: with 妈妈-style kin words both forms are correct — the short one is warmer."
    },
    {
      id: "g-ma", badge: "吗",
      title: "用“吗”的是非问句 — yes-no questions",
      patterns: ["statement + <b>吗</b>？"],
      explain: "Take any statement and hang <b>吗</b> on the end to ask it: 你很忙 → 你很忙吗？ " +
               "Answer with 对 / 不对 or by repeating the verb.",
      examples: [
        { hz: "你也很忙吗？", pinyin: "Nǐ yě hěn máng ma?", en: "Are you also very busy?", hl: "吗" },
        { hz: "你是他的中文老师吗？", pinyin: "Nǐ shì tā de Zhōngwén lǎoshī ma?", en: "Are you his Chinese teacher?", hl: "吗" },
        { hz: "你有姐姐吗？", pinyin: "Nǐ yǒu jiějie ma?", en: "Do you have an elder sister?", hl: "吗" }
      ],
      tip: "💡 Keep your voice level — 吗 carries the question, so no English-style rise is needed."
    }
  ],

  /* ---- Bonus — tongue twister 3-7 (p.56) + country names ---- */
  bonus: [
    {
      id: "b-tongue3", badge: "音", badgeClass: "gold",
      title: "跟读绕口令 · Shadow the tongue twister (track 3-7)",
      items: [
        { char: "四", name: "四是四，十是十。", nameEn: "Sì shì sì, shí shì shí.",
          meaning: "Four is four. Ten is ten.", words: "sì (flat) vs shí (rising) + the retroflex sh", inLesson: "The classic flat-vs-retroflex drill" },
        { char: "十", name: "十四是十四，四十是四十。", nameEn: "Shísì shì shísì, sìshí shì sìshí.",
          meaning: "Fourteen is fourteen. Forty is forty.", words: "shísì / sìshí — order swaps the meaning", inLesson: "Shadow slowly, then at speed (track 3-7)" }
      ]
    },
    {
      id: "b-countries", badge: "国", badgeClass: "gold",
      title: "国名与「国人」 · Countries and their people",
      items: [
        { char: "中", name: "中国 → 中国人", nameEn: "Zhōngguó → Zhōngguó rén", meaning: "China → Chinese person",
          words: "中文 · 中国学生", inLesson: "Lesson title: 我是中国人" },
        { char: "法", name: "法国 → 法国人", nameEn: "Fǎguó → Fǎguó rén", meaning: "France → French person",
          words: "法国学生", inLesson: "Text 1: 我认识一个法国人" },
        { char: "泰", name: "泰国 → 泰国人", nameEn: "Tàiguó → Tàiguó rén", meaning: "Thailand → Thai person",
          words: "泰国学生", inLesson: "Text 2: 我的女朋友是泰国人" },
        { char: "英", name: "英国 → 英国人", nameEn: "Yīngguó → Yīngguó rén", meaning: "Britain → British person",
          words: "英国 · 英语", inLesson: "Text 2 example: 她是英国人" }
      ]
    }
  ],

  /* ---- Dialogues — REAL lines from 课本 P10/P12/P14 (user screenshots 2026-10-10) ----
       d1: A = 李文 (m) · B = 白家月 (f)
       d2: A = 安妮 Annie (f) · B = 陈天中 (m)
       d3: A = 王一雪 Wáng Yīxuě (f) · B = 王一飞 Wáng Yīfēi (f) — both female,
           exactly as the book's photos; the player labels each bubble.      */
  dialogues: [
    {
      id: "d1", kind: "reading",
      title: "校园里 · 继续聊天儿", titleEn: "On campus — the chat continues",
      scene: "在校园里，李文和白家月第一次相遇，两人继续聊天儿。 On campus, Li Wen and Bai Jiayue met for the first time and continued chatting. (课本 P10)",
      tags: ["国籍 nationality"],
      spVoices: { A: "m", B: "f" },
      lines: [
        { sp: "A", hz: "我是中国人。", pinyin: "Wǒ shì Zhōngguó rén.", en: "I am Chinese.", audio: "dialogues/d1-l1.mp3" },
        { sp: "B", hz: "我是法国人。我的中文老师也是中国人。", pinyin: "Wǒ shì Fǎguó rén. Wǒ de Zhōngwén lǎoshī yě shì Zhōngguó rén.", en: "I am French. My Chinese teacher is Chinese too.", audio: "dialogues/d1-l2.mp3" }
      ],
      questions: []
    },
    {
      id: "d2", kind: "reading",
      title: "教室里 · 手机里的照片", titleEn: "In class — photos on the phone",
      scene: "在教室里，下课后，安妮在看陈天中手机里的照片。 After class, Annie was looking at the photos on Chen Tianzhong's cell phone in the classroom. (课本 P12)",
      tags: ["谁 whose", "女朋友 girlfriend", "哪国 which country"],
      spVoices: { A: "f", B: "m" },
      lines: [
        { sp: "A", hz: "这是谁？", pinyin: "Zhè shì shéi?", en: "Who is this?", audio: "dialogues/d2-l1.mp3" },
        { sp: "B", hz: "这是我女朋友。", pinyin: "Zhè shì wǒ nǚpéngyou.", en: "This is my girlfriend.", audio: "dialogues/d2-l2.mp3" },
        { sp: "A", hz: "你女朋友是哪国人？", pinyin: "Nǐ nǚpéngyou shì nǎ guó rén?", en: "Which country is your girlfriend from?", audio: "dialogues/d2-l3.mp3" },
        { sp: "B", hz: "她也是泰国人。", pinyin: "Tā yě shì Tàiguó rén.", en: "She is Thai too.", audio: "dialogues/d2-l4.mp3" }
      ],
      questions: []
    },
    {
      id: "d3", kind: "reading",
      title: "家里 · 视频电话", titleEn: "At home — the video call",
      scene: "在家里，王一雪给王一飞打视频电话。 At home, Wang Yixue was making a video call to Wang Yifei. (课本 P14)",
      tags: ["吗 yes-no questions", "想 miss"],
      spVoices: { A: "f", B: "f" },
      lines: [
        { sp: "A", hz: "喂，一飞！", pinyin: "Wèi, Yīfēi!", en: "Hello? Yifei!", audio: "dialogues/d3-l1.mp3" },
        { sp: "B", hz: "姐姐！", pinyin: "Jiějie!", en: "Sister!", audio: "dialogues/d3-l2.mp3" },
        { sp: "A", hz: "你工作还忙吗？", pinyin: "Nǐ gōngzuò hái máng ma?", en: "Is your job still busy?", audio: "dialogues/d3-l3.mp3" },
        { sp: "B", hz: "对，还很忙。你也很忙吗？", pinyin: "Duì, hái hěn máng. Nǐ yě hěn máng ma?", en: "Yes, still very busy. Are you very busy too?", audio: "dialogues/d3-l4.mp3" },
        { sp: "A", hz: "我不太忙。我们很想你。", pinyin: "Wǒ bú tài máng. Wǒmen hěn xiǎng nǐ.", en: "I'm not too busy. We miss you a lot.", audio: "dialogues/d3-l5.mp3" },
        { sp: "B", hz: "我也想你们。", pinyin: "Wǒ yě xiǎng nǐmen.", en: "I miss you all too.", audio: "dialogues/d3-l6.mp3" }
      ],
      questions: []
    }
  ]
};
