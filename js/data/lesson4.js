/* ============================================================
   New HSK Course 1 — Lesson 4 · 我有两个孩子 (I have two children)
   ------------------------------------------------------------
   SOURCE: 《新HSK教程1》第4课 courseware (FLTRP), pages cited per entry.
   words / grammar / bonus / meta / listening MCQs → REAL (pp.6-9, 13, 16,
     17-28, 37, 38, 40-51).
   dialogues[].lines → REAL, transcribed 2026-10-10 from the user's textbook
     screenshots (课本 P19 / P22 / P24).
   NOTE: d2 & d3 are kind:"listening" — first lesson with real listening
     questions (courseware pp.16 & 40, answers printed in the book).
   ============================================================ */
window.LESSON = {

  meta: {
    course: "New HSK Course 1",
    lesson: 4,
    title: "我有两个孩子",
    titlePinyin: "Wǒ yǒu liǎng gè háizi",
    titleEn: "I have two children",
    audioBase: "audio/l04/",
    objectives: {                                   /* courseware p.3 */
      keyWords: ["有", "个", "家", "口", "几", "岁", "多少", "没有"],
      grammar: ["“有”字句（1）possession & 没/没有", "A……،B呢؟", "数词·量词 [Num+M+(N)]", "年龄问答"],
      sound: "numbers 0–99 · 口/个 measure words",
      characters: "口 · 个 · 家 · 岁"
    }
  },

  audioReady: [
    /* batch L4-A (2026-10-10) — words w01-w10, bare-word style */
    "words/w01-you.mp3",
    "words/w02-duoshao.mp3",
    "words/w03-ge.mp3",
    "words/w04-gege.mp3",
    "words/w05-ne.mp3",
    "words/w06-meiyou.mp3",
    "words/w07-jia.mp3",
    "words/w08-ji.mp3",
    "words/w09-kou.mp3",
    "words/w10-baba.mp3",
    /* batch L4-B (2026-10-10) — words w11-w20 */
    "words/w11-mama.mp3",
    "words/w12-meimei.mp3",
    "words/w13-he.mp3",
    "words/w14-erzi.mp3",
    "words/w15-haizi.mp3",
    "words/w16-nver.mp3",
    "words/w17-sui.mp3",
    "words/w18-ta-he.mp3",
    "words/w19-jinnian.mp3",
    "words/w20-duo.mp3",
    /* batch L4-C (2026-10-10) — word w21 + sentences s01-s09 */
    "words/w21-da.mp3",
    "sentences/s01-you.mp3",
    "sentences/s02-duoshao.mp3",
    "sentences/s03-ge.mp3",
    "sentences/s04-gege.mp3",
    "sentences/s05-ne.mp3",
    "sentences/s06-meiyou.mp3",
    "sentences/s07-jia.mp3",
    "sentences/s08-ji.mp3",
    "sentences/s09-kou.mp3",
    /* batch L4-D (2026-10-10) — sentences s10-s19 */
    "sentences/s10-baba.mp3",
    "sentences/s11-mama.mp3",
    "sentences/s12-meimei.mp3",
    "sentences/s13-he.mp3",
    "sentences/s14-erzi.mp3",
    "sentences/s15-haizi.mp3",
    "sentences/s16-nver.mp3",
    "sentences/s17-sui.mp3",
    "sentences/s18-ta-he.mp3",
    "sentences/s19-jinnian.mp3",
    /* batch L4-E (2026-10-10) — s20, s21 · g-mw e1-e4 · g-you e2/e3 · g-ne e2/e3 */
    "sentences/s20-duo.mp3",
    "sentences/s21-da.mp3",
    "grammar/g3-e1.mp3",
    "grammar/g3-e2.mp3",
    "grammar/g3-e3.mp3",
    "grammar/g3-e4.mp3",
    "grammar/g1-e2.mp3",
    "grammar/g1-e3.mp3",
    "grammar/g2-e2.mp3",
    "grammar/g2-e3.mp3",
    /* batch L4-F (2026-10-10) — g-age e2/e3 · listening-question audio d2-q1/q2, d3-q1/q2
       · dialogue d1 lines (刘明 M / 王一雪 F) */
    "grammar/g4-e2.mp3",
    "grammar/g4-e3.mp3",
    "dialogues/d2-q1.mp3",
    "dialogues/d2-q2.mp3",
    "dialogues/d3-q1.mp3",
    "dialogues/d3-q2.mp3",
    "dialogues/d1-l1.mp3",
    "dialogues/d1-l2.mp3",
    "dialogues/d1-l3.mp3",
    "dialogues/d1-l4.mp3",
    /* batch L4-G (2026-10-10) — dialogue lines d2-l1..l4 · d3-l1..l6 */
    "dialogues/d2-l1.mp3",
    "dialogues/d2-l2.mp3",
    "dialogues/d2-l3.mp3",
    "dialogues/d2-l4.mp3",
    "dialogues/d3-l1.mp3",
    "dialogues/d3-l2.mp3",
    "dialogues/d3-l3.mp3",
    "dialogues/d3-l4.mp3",
    "dialogues/d3-l5.mp3",
    "dialogues/d3-l6.mp3",
    /* batch L4-H (2026-10-10) — smart copies: g1-e1<-d1-l4 · g2-e1<-d2-l1 · g4-e1<-s17
       => L4 AUDIO COMPLETE 73/73 */
    "grammar/g1-e1.mp3",
    "grammar/g2-e1.mp3",
    "grammar/g4-e1.mp3"
  ],

  /* ---- New words — courseware pp.6–9 (text 1), 17–28 (text 2), 42–51 (text 3) ---- */
  words: [
    { id: "you", hz: "有", pinyin: "yǒu", pos: "v.", en: "have", key: true, note: "negative: 没 / 没有",
      audio: { word: "words/w01-you.mp3", sentence: "sentences/s01-you.mp3" },
      example: { hz: "他有女朋友。", pinyin: "Tā yǒu nǚpéngyou.", en: "He has a girlfriend." } },
    { id: "duoshao", hz: "多少", pinyin: "duōshao", pos: "pron.", en: "how many/much", key: true, note: "",
      audio: { word: "words/w02-duoshao.mp3", sentence: "sentences/s02-duoshao.mp3" },
      example: { hz: "你们学校有多少学生？", pinyin: "Nǐmen xuéxiào yǒu duōshao xuéshēng?", en: "How many students does your school have?" } },
    { id: "ge", hz: "个", pinyin: "gè", pos: "m.", en: "a general measure word", key: true, note: "一个 / 几个 / 多少个",
      audio: { word: "words/w03-ge.mp3", sentence: "sentences/s03-ge.mp3" },
      example: { hz: "我有一个姐姐。", pinyin: "Wǒ yǒu yí ge jiějie.", en: "I have an elder sister." } },
    { id: "gege", hz: "哥哥", pinyin: "gēge", pos: "n.", en: "elder brother", key: false, note: "一个哥哥 / 我的哥哥 / 我哥哥",
      audio: { word: "words/w04-gege.mp3", sentence: "sentences/s04-gege.mp3" },
      example: { hz: "他是王老师的哥哥。", pinyin: "Tā shì Wáng lǎoshī de gēge.", en: "He is Ms. Wang's elder brother." } },
    { id: "ne", hz: "呢", pinyin: "ne", pos: "part.", en: "used at the end of a question", key: true, note: "",
      audio: { word: "words/w05-ne.mp3", sentence: "sentences/s05-ne.mp3" },
      example: { hz: "我叫陈天中，你呢？", pinyin: "Wǒ jiào Chén Tiānzhōng, nǐ ne?", en: "I'm Chen Tianzhong — and you?" } },
    { id: "meiyou", hz: "没有", pinyin: "méiyǒu", pos: "v.", en: "not have", key: true, note: "",
      audio: { word: "words/w06-meiyou.mp3", sentence: "sentences/s06-meiyou.mp3" },
      example: { hz: "我没有哥哥。", pinyin: "Wǒ méiyǒu gēge.", en: "I don't have an elder brother." } },
    { id: "jia", hz: "家", pinyin: "jiā", pos: "n.", en: "family", key: true, note: "你家 / 我家 / 他家 / 她家",
      audio: { word: "words/w07-jia.mp3", sentence: "sentences/s07-jia.mp3" },
      example: { hz: "我家有三口人。", pinyin: "Wǒ jiā yǒu sān kǒu rén.", en: "My family has three people." } },
    { id: "ji", hz: "几", pinyin: "jǐ", pos: "pron.", en: "how many", key: true, note: "几个 / 几只",
      audio: { word: "words/w08-ji.mp3", sentence: "sentences/s08-ji.mp3" },
      example: { hz: "他有几个哥哥？", pinyin: "Tā yǒu jǐ ge gēge?", en: "How many elder brothers does he have?" } },
    { id: "kou", hz: "口", pinyin: "kǒu", pos: "m.", en: "for family members, knives, etc.", key: true, note: "三口人 / 几口人",
      audio: { word: "words/w09-kou.mp3", sentence: "sentences/s09-kou.mp3" },
      example: { hz: "我家有五口人。", pinyin: "Wǒ jiā yǒu wǔ kǒu rén.", en: "My family has five people." } },
    { id: "baba", hz: "爸爸", pinyin: "bàba", pos: "n.", en: "father", key: false, note: "我爸爸 / 好爸爸 / 想爸爸",
      audio: { word: "words/w10-baba.mp3", sentence: "sentences/s10-baba.mp3" },
      example: { hz: "我爸爸的工作很忙。", pinyin: "Wǒ bàba de gōngzuò hěn máng.", en: "My father's job is very busy." } },
    { id: "mama", hz: "妈妈", pinyin: "māma", pos: "n.", en: "mother", key: false, note: "我妈妈 / 好妈妈 / 想妈妈",
      audio: { word: "words/w11-mama.mp3", sentence: "sentences/s11-mama.mp3" },
      example: { hz: "他妈妈在法国。", pinyin: "Tā māma zài Fǎguó.", en: "His mother is in France." } },
    { id: "meimei", hz: "妹妹", pinyin: "mèimei", pos: "n.", en: "younger sister", key: false, note: "我妹妹 / 一个妹妹 / 几个妹妹",
      audio: { word: "words/w12-meimei.mp3", sentence: "sentences/s12-meimei.mp3" },
      example: { hz: "她是我的妹妹。", pinyin: "Tā shì wǒ de mèimei.", en: "She is my younger sister." } },
    { id: "he", hz: "和", pinyin: "hé", pos: "conj.", en: "and", key: true, note: "",
      audio: { word: "words/w13-he.mp3", sentence: "sentences/s13-he.mp3" },
      example: { hz: "我和她是同学。", pinyin: "Wǒ hé tā shì tóngxué.", en: "She and I are classmates." } },
    { id: "erzi", hz: "儿子", pinyin: "érzi", pos: "n.", en: "son", key: false, note: "我儿子 / 一个儿子 / 几个儿子",
      audio: { word: "words/w14-erzi.mp3", sentence: "sentences/s14-erzi.mp3" },
      example: { hz: "他是李老师的儿子。", pinyin: "Tā shì Lǐ lǎoshī de érzi.", en: "He is Mr. Li's son." } },
    { id: "haizi", hz: "孩子", pinyin: "háizi", pos: "n.", en: "children", key: true, note: "",
      audio: { word: "words/w15-haizi.mp3", sentence: "sentences/s15-haizi.mp3" },
      example: { hz: "我们都是她的孩子。", pinyin: "Wǒmen dōu shì tā de háizi.", en: "We are all her children." } },
    { id: "nver", hz: "女儿", pinyin: "nǚ'ér", pos: "n.", en: "daughter", key: false, note: "儿子和女儿 / 大女儿",
      audio: { word: "words/w16-nver.mp3", sentence: "sentences/s16-nver.mp3" },
      example: { hz: "她喜欢女儿。", pinyin: "Tā xǐhuan nǚ'ér.", en: "She likes daughters." } },
    { id: "sui", hz: "岁", pinyin: "suì", pos: "m.", en: "year (of age)", key: true, note: "一岁 / 几岁",
      audio: { word: "words/w17-sui.mp3", sentence: "sentences/s17-sui.mp3" },
      example: { hz: "你几岁了？", pinyin: "Nǐ jǐ suì le?", en: "How old are you?" } },
    { id: "ta-he", hz: "他", pinyin: "tā", pos: "pron.", en: "he; him", key: false, note: "",
      audio: { word: "words/w18-ta-he.mp3", sentence: "sentences/s18-ta-he.mp3" },
      example: { hz: "他是你哥哥吗？", pinyin: "Tā shì nǐ gēge ma?", en: "Is he your elder brother?" } },
    { id: "jinnian", hz: "今年", pinyin: "jīnnián", pos: "n.", en: "this year", key: false, note: "",
      audio: { word: "words/w19-jinnian.mp3", sentence: "sentences/s19-jinnian.mp3" },
      example: { hz: "今年是2026年。", pinyin: "Jīnnián shì èr-líng-èr-liù nián.", en: "This year is 2026." } },
    { id: "duo", hz: "多", pinyin: "duō", pos: "pron.", en: "how; to what extent", key: false, note: "多大؟ / 多贵؟",
      audio: { word: "words/w20-duo.mp3", sentence: "sentences/s20-duo.mp3" },
      example: { hz: "你儿子多大？", pinyin: "Nǐ érzi duō dà?", en: "How old is your son?" } },
    { id: "da", hz: "大", pinyin: "dà", pos: "adj.", en: "(of age) old", key: false, note: "她多大了؟",
      audio: { word: "words/w21-da.mp3", sentence: "sentences/s21-da.mp3" },
      example: { hz: "她才两岁大。", pinyin: "Tā cái liǎng suì dà.", en: "She is only two years old." } }
  ],

  /* ---- Grammar — 小语讲堂 pp.13/37/38 + age Q&A (objective p.3) ---- */
  grammar: [
    {
      id: "g-you", badge: "有",
      title: "“有”字句（1） — possession",
      patterns: ["A + <b>有</b> + B", "A + <b>没 / 没有</b> + B  (negative)"],
      explain: "有 says someone <b>has</b> someone/something. Its negative is the block " +
               "没 / 没有 — never 不有.",
      examples: [
        { hz: "她有二十个学生。", pinyin: "Tā yǒu èrshí ge xuéshēng.", en: "She has twenty students.", hl: "有" },
        { hz: "她有一个姐姐。", pinyin: "Tā yǒu yí ge jiějie.", en: "She has an elder sister.", hl: "有" },
        { hz: "我没姐姐。", pinyin: "Wǒ méi jiějie.", en: "I don't have an elder sister.", hl: "没" }
      ],
      tip: "💡 p.13: 没有 and 没 mean the same here; 没 is the spoken short form."
    },
    {
      id: "g-ne", badge: "呢",
      title: "语气助词“呢”（1） — A……، B呢؟",
      patterns: ["A …… ، B + <b>呢</b>؟"],
      explain: "呢 bounces the same question back: state your case, add 呢, and the " +
               "other person answers the same question about themselves.",
      examples: [
        { hz: "我有两个哥哥，你呢？", pinyin: "Wǒ yǒu liǎng ge gēge, nǐ ne?", en: "I have two elder brothers — and you?", hl: "呢" },
        { hz: "我叫白家月，你呢？", pinyin: "Wǒ jiào Bái Jiāyuè, nǐ ne?", en: "My name is Bai Jiayue — and you?", hl: "呢" },
        { hz: "我是中国人，你呢？", pinyin: "Wǒ shì Zhōngguó rén, nǐ ne?", en: "I'm Chinese — and you?", hl: "呢" }
      ],
      tip: "💡 p.37: 呢 asks about the situation already mentioned — no need to repeat the verb."
    },
    {
      id: "g-mw", badge: "量",
      title: "数词·量词 — [Num + M + (N)]",
      patterns: ["number + <b>measure word</b> + (noun)", "口 for family · 个 general"],
      explain: "A Chinese number rarely touches a noun directly: a <b>measure word</b> stands " +
               "between them — 四口人, 两个哥哥. The noun may even be dropped when clear: 四口.",
      examples: [
        { hz: "四口", pinyin: "sì kǒu", en: "four (people) — noun dropped", hl: "口" },
        { hz: "四口人", pinyin: "sì kǒu rén", en: "four people", hl: "口" },
        { hz: "两个", pinyin: "liǎng ge", en: "two (of them)", hl: "个" },
        { hz: "两个学生", pinyin: "liǎng ge xuéshēng", en: "two students", hl: "个" }
      ],
      tip: "💡 p.38 + 课本 P23: before a measure word use 两, not 二 — 两个, not 二个."
    },
    {
      id: "g-age", badge: "岁",
      title: "年龄问答 — asking and answering age",
      patterns: ["你 + <b>几</b> 岁了？", "subject + <b>多大</b>؟"],
      explain: "For children's age use 几岁; for adults 多大 sounds more natural. " +
               "The answer is simply the number (+ 岁).",
      examples: [
        { hz: "你几岁了？", pinyin: "Nǐ jǐ suì le?", en: "How old are you?", hl: "几" },
        { hz: "我十岁了。", pinyin: "Wǒ shí suì le.", en: "I am ten years old.", hl: "岁" },
        { hz: "他姐姐今年多大？", pinyin: "Tā jiějie jīnnián duō dà?", en: "How old is his elder sister this year?", hl: "多大" }
      ],
      tip: "💡 岁 never takes a measure word after the number: 十岁, not 十个岁."
    }
  ],

  /* ---- Bonus — numbers (小语讲堂 p.14 → 课本 P20–21) ---- */
  bonus: [
    {
      id: "b-numbers", badge: "数", badgeClass: "gold",
      title: "数字的表达 · How Chinese reads its numbers (课本 P20–21)",
      items: [
        { char: "两", name: "两 vs 二", nameEn: "liǎng vs èr",
          meaning: "Before a measure word use 两: 两个 · 两口人 · 两点. In numbers/sequence: 二",
          words: "两个哥哥 · 十二 · 第二", inLesson: "Title: 我有两个孩子" },
        { char: "百", name: "0–99 ثم 百/万", nameEn: "0–99, then 百 and 万",
          meaning: "100 = 一百 · 2026 = 二千零二十六 (see 课本 P20–21 for the full tables)",
          words: "一百 · 一千 · 一万", inLesson: "p.49: 今年是2026年" },
        { char: "零", name: "零 in numbers", nameEn: "líng — the zero link",
          meaning: "Bridges an empty place: 105 = 一百零五",
          words: "零 · 一", inLesson: "Numbers reference, 课本 P21" }
      ]
    }
  ],

  /* ---- Dialogues — REAL lines from 课本 P19/P22/P24 (user screenshots 2026-10-10) ----
       d1: A = 刘明 Liú Míng (m) · B = 王一雪 Wáng Yīxuě (f)
       d2: A = 王一雪 (f) · B = 杨同乐 Yáng Tónglè (m)
       d3: A = 杨同乐 (m) · B = 王一雪 (f) — note the polite 您 returns from Lesson 1 */
  dialogues: [
    {
      id: "d1", kind: "reading",
      title: "家里 · 聊天儿", titleEn: "At home — chatting",
      scene: "在家里，刘明和王一雪在聊天儿。 At home, Liu Ming and Wang Yixue were chatting. (课本 P19)",
      tags: ["有 have", "多少 how many"],
      spVoices: { A: "m", B: "f" },
      lines: [
        { sp: "A", hz: "一飞忙吗？", pinyin: "Yīfēi máng ma?", en: "Is Yifei busy?", audio: "dialogues/d1-l1.mp3" },
        { sp: "B", hz: "她很忙。", pinyin: "Tā hěn máng.", en: "She is very busy.", audio: "dialogues/d1-l2.mp3" },
        { sp: "A", hz: "她有多少个学生？", pinyin: "Tā yǒu duōshao ge xuéshēng?", en: "How many students does she have?", audio: "dialogues/d1-l3.mp3" },
        { sp: "B", hz: "她有二十个学生。", pinyin: "Tā yǒu èrshí ge xuéshēng.", en: "She has twenty students.", audio: "dialogues/d1-l4.mp3" }
      ],
      questions: []
    },
    {
      id: "d2", kind: "listening",
      title: "公司里 · 休息时", titleEn: "At the company — break time",
      scene: "在公司里，王一雪和杨同乐休息时聊天儿。 At the company, Wang Yixue and Yang Tongle were chatting during a break. (课本 P22)",
      tags: ["家庭 family", "呢 and-you?", "🎧 listening MCQ (courseware p.16)"],
      spVoices: { A: "f", B: "m" },
      lines: [
        { sp: "A", hz: "我有两个哥哥，你呢？", pinyin: "Wǒ yǒu liǎng ge gēge, nǐ ne?", en: "I have two elder brothers — and you?", audio: "dialogues/d2-l1.mp3" },
        { sp: "B", hz: "我没有哥哥。", pinyin: "Wǒ méiyu gēge.", en: "I don't have an elder brother.", audio: "dialogues/d2-l2.mp3" },
        { sp: "A", hz: "你家有几口人？", pinyin: "Nǐ jiā yǐ jǐ kǒu rén?".replace("yǐ","yǒu"), en: "How many people are there in your family?", audio: "dialogues/d2-l3.mp3" },
        { sp: "B", hz: "我家有四口人，爸爸、妈妈、妹妹和我。", pinyin: "Wǒ jiā yǒu sì kǒu rén: bàba, māma, mèimei hé wǒ.", en: "My family has four people: Dad, Mum, my younger sister and me.", audio: "dialogues/d2-l4.mp3" }
      ],
      questions: [
        { q: { hz: "杨同乐有一个（ ）。 A. 妹妹  B. 姐姐  C. 哥哥", pinyin: "Yáng Tónglè yǒu yí ge ( ).  A. mèimei  B. jiějie  C. gēge",
               en: "Yang Tongle has a ( ).  A. younger sister  B. elder sister  C. elder brother" },
          a: { hz: "A. 妹妹", pinyin: "A. mèimei", en: "A. younger sister (book answer: A)" } },
        { q: { hz: "杨同乐家有（ ）。 A. 两口人  B. 四口人  C. 五口人", pinyin: "Yáng Tónglè jiā yǒu ( ).  A. liǎng kǒu rén  B. sì kǒu rén  C. wǔ kǒu rén",
               en: "Yang Tongle's family has ( ).  A. two people  B. four people  C. five people" },
          a: { hz: "B. 四口人", pinyin: "B. sì kǒu rén", en: "B. four people (book answer: B)" } }
      ]
    },
    {
      id: "d3", kind: "listening",
      title: "街上 · 偶遇", titleEn: "On the street — running into each other",
      scene: "在街上，王一雪带着儿子偶遇杨同乐。 On the street, Wang Yixue ran into Yang Tongle while she was out with her son. (课本 P24)",
      tags: ["年龄 age", "您 polite you", "🎧 listening MCQ (courseware p.40)"],
      spVoices: { A: "m", B: "f" },
      lines: [
        { sp: "A", hz: "这是您儿子吗？", pinyin: "Zhè shì nín érzi ma?", en: "Is this your son?", audio: "dialogues/d3-l1.mp3" },
        { sp: "B", hz: "是的。我有两个孩子，一个儿子，一个女儿。", pinyin: "Shì de. Wǒ yǒu liǎng ge háizi, yí ge érzi, yí ge nǚ'ér.", en: "Yes. I have two children — a son and a daughter.", audio: "dialogues/d3-l2.mp3" },
        { sp: "A", hz: "您儿子几岁？", pinyin: "Nín érzi jǐ suì?", en: "How old is your son?", audio: "dialogues/d3-l3.mp3" },
        { sp: "B", hz: "他今年五岁。", pinyin: "Tā jīnnián wǔ suì.", en: "He is five this year.", audio: "dialogues/d3-l4.mp3" },
        { sp: "A", hz: "您女儿多大？", pinyin: "Nín nǚ'ér duō dà?", en: "How old is your daughter?", audio: "dialogues/d3-l5.mp3" },
        { sp: "B", hz: "她今年十二。", pinyin: "Tā jīnnián shí'èr.", en: "She is twelve this year.", audio: "dialogues/d3-l6.mp3" }
      ],
      questions: [
        { q: { hz: "王一雪有（ ）孩子。 A. 一个  B. 两个  C. 三个", pinyin: "Wáng Yīxuě yǒu ( ) háizi.  A. yí ge  B. liǎng ge  C. sān ge",
               en: "Wang Yixue has ( ) children.  A. one  B. two  C. three" },
          a: { hz: "B. 两个", pinyin: "B. liǎng ge", en: "B. two (book answer: B)" } },
        { q: { hz: "王一雪女儿今年（ ）岁。 A. 五  B. 十二  C. 二十", pinyin: "Wáng Yīxuě nǚ'ér jīnnián ( ) suì.  A. wǔ  B. shí'èr  C. èrshí",
               en: "Wang Yixue's daughter is ( ) years old this year.  A. five  B. twelve  C. twenty" },
          a: { hz: "B. 十二", pinyin: "B. shí'èr", en: "B. twelve (book answer: B)" } }
      ]
    }
  ]
};
