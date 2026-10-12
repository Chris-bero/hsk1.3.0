/* ============================================================
   New HSK Course 1 — Lesson 5 · 今天我休息 (I'm off today)
   ------------------------------------------------------------
   SOURCE: 《新HSK教程1》第5课 courseware (FLTRP), pages cited per entry.
   words / grammar / bonus / meta / listening MCQs → REAL (pp.6-14, 22, 23,
     25, 26-33, 39, 41, 43-50).
   dialogues[].lines → REAL, transcribed 2026-10-11 from the user's textbook
     screenshots (课本 P28 / P30 / P32); p.42 open questions joined d3.
   ============================================================ */
window.LESSON = {

  meta: {
    course: "New HSK Course 1",
    lesson: 5,
    title: "今天我休息",
    titlePinyin: "Jīntiān wǒ xiūxi",
    titleEn: "I'm off today",
    audioBase: "audio/l05/",
    objectives: {                                   /* courseware p.3 */
      keyWords: ["今天", "星期", "休息", "会", "做饭", "电脑", "喜欢", "新"],
      grammar: ["时间的表达（1）dates & weekdays", "名词谓语句 nominal-predicate sentences", "能愿动词“会” the modal verb 会"],
      sound: "date strings: 年 → 月 → 日/号 → 星期",
      characters: "休 · 星 · 期 · 脑"
    }
  },

  audioReady: [
    /* batch L5-A (2026-10-11) — words w01-w10, bare-word style */
    "words/w01-jintian.mp3",
    "words/w02-hao.mp3",
    "words/w03-yue.mp3",
    "words/w04-ri.mp3",
    "words/w05-xingqi.mp3",
    "words/w06-xingqiri.mp3",
    "words/w07-xingqitian.mp3",
    "words/w08-xiuxi.mp3",
    "words/w09-hui.mp3",
    "words/w10-zuofan.mp3",
    /* batch L5-B (2026-10-11) — words w11-w20 (真 heard in two hosts: 真好/真好看) */
    "words/w11-zuo.mp3",
    "words/w12-miantiaor.mp3",
    "words/w13-jiaozi.mp3",
    "words/w14-yixie.mp3",
    "words/w15-cai.mp3",
    "words/w16-xiaban.mp3",
    "words/w17-xin.mp3",
    "words/w18-diannao.mp3",
    "words/w19-zhen.mp3",
    "words/w20-haokan.mp3",
    /* batch L5-C (2026-10-11) — words w21-w22 + sentences s01-s08 */
    "words/w21-xihuan.mp3",
    "words/w22-ta-it.mp3",
    "sentences/s01-jintian.mp3",
    "sentences/s02-hao.mp3",
    "sentences/s03-yue.mp3",
    "sentences/s04-ri.mp3",
    "sentences/s05-xingqi.mp3",
    "sentences/s06-xingqiri.mp3",
    "sentences/s07-xingqitian.mp3",
    "sentences/s08-xiuxi.mp3",
    /* batch L5-D (2026-10-11) — sentences s09-s18 */
    "sentences/s09-hui.mp3",
    "sentences/s10-zuofan.mp3",
    "sentences/s11-zuo.mp3",
    "sentences/s12-miantiaor.mp3",
    "sentences/s13-jiaozi.mp3",
    "sentences/s14-yixie.mp3",
    "sentences/s15-cai.mp3",
    "sentences/s16-xiaban.mp3",
    "sentences/s17-xin.mp3",
    "sentences/s18-diannao.mp3",
    /* batch L5-E (2026-10-11) — s19-s22 · nominal-predicate e1/e2 · 会 e1-e3 · d2-q1 */
    "sentences/s19-zhen.mp3",
    "sentences/s20-haokan.mp3",
    "sentences/s21-xihuan.mp3",
    "sentences/s22-ta-it.mp3",
    "grammar/g2-e1.mp3",
    "grammar/g2-e2.mp3",
    "grammar/g3-e1.mp3",
    "grammar/g3-e2.mp3",
    "grammar/g3-e3.mp3",
    "dialogues/d2-q1.mp3",
    /* batch L5-F (2026-10-11) — dialogue lines d1-l1..l4 · d2-l2..l4 · d3-l1..l3
       (d2-l1 joins next as a smart copy of grammar/g3-e1) */
    "dialogues/d1-l1.mp3",
    "dialogues/d1-l2.mp3",
    "dialogues/d1-l3.mp3",
    "dialogues/d1-l4.mp3",
    "dialogues/d2-l2.mp3",
    "dialogues/d2-l3.mp3",
    "dialogues/d2-l4.mp3",
    "dialogues/d3-l1.mp3",
    "dialogues/d3-l2.mp3",
    "dialogues/d3-l3.mp3",
    /* batch L5-G (2026-10-11) — d3-l4..l6 · d2-q2 · d3-q1..q4
       + smart copies: d2-l1<-g3-e1 · g1-e1<-s03 · g1-e2<-s02 · g1-e3<-s05
       => L5 AUDIO COMPLETE 72/72 */
    "dialogues/d3-l4.mp3",
    "dialogues/d3-l5.mp3",
    "dialogues/d3-l6.mp3",
    "dialogues/d2-q2.mp3",
    "dialogues/d3-q1.mp3",
    "dialogues/d3-q2.mp3",
    "dialogues/d3-q3.mp3",
    "dialogues/d3-q4.mp3",
    "dialogues/d2-l1.mp3",
    "grammar/g1-e1.mp3",
    "grammar/g1-e2.mp3",
    "grammar/g1-e3.mp3"
  ],

  /* ---- New words — courseware pp.6–14 (text 1), 26–33 (text 2), 43–50 (text 3) ---- */
  words: [
    { id: "jintian", hz: "今天", pinyin: "jīntiān", pos: "n.", en: "today", key: true, note: "",
      audio: { word: "words/w01-jintian.mp3", sentence: "sentences/s01-jintian.mp3" },
      example: { hz: "我今天很高兴。", pinyin: "Wǒ jīntiān hěn gāoxìng.", en: "I am very happy today." } },
    { id: "hao", hz: "号", pinyin: "hào", pos: "m.", en: "date", key: true, note: "……月……号 · spoken style",
      audio: { word: "words/w02-hao.mp3", sentence: "sentences/s02-hao.mp3" },
      example: { hz: "我们3月1号上课。", pinyin: "Wǒmen sān yuè yī hào shàngkè.", en: "We have class on March 1st." } },
    { id: "yue", hz: "月", pinyin: "yuè", pos: "n.", en: "month", key: true, note: "……月……日/号 · ……个月",
      audio: { word: "words/w03-yue.mp3", sentence: "sentences/s03-yue.mp3" },
      example: { hz: "今天是2026年3月6日。", pinyin: "Jīntiān shì èr-líng-èr-liù nián sān yuè liù rì.", en: "Today is March 6, 2026." } },
    { id: "ri", hz: "日", pinyin: "rì", pos: "m.", en: "day", key: true, note: "……月……日 · written style",
      audio: { word: "words/w04-ri.mp3", sentence: "sentences/s04-ri.mp3" },
      example: { hz: "明天是9月7日。", pinyin: "Míngtiān shì jiǔ yuè qī rì.", en: "Tomorrow is September 7th." } },
    { id: "xingqi", hz: "星期", pinyin: "xīngqī", pos: "n.", en: "week", key: true, note: "",
      audio: { word: "words/w05-xingqi.mp3", sentence: "sentences/s05-xingqi.mp3" },
      example: { hz: "今天星期几？", pinyin: "Jīntiān xīngqī jǐ?", en: "What day of the week is it today?" } },
    { id: "xingqiri", hz: "星期日", pinyin: "Xīngqīrì", pos: "n.", en: "Sunday", key: false, note: "= 星期天",
      audio: { word: "words/w06-xingqiri.mp3", sentence: "sentences/s06-xingqiri.mp3" },
      example: { hz: "星期日我不上学。", pinyin: "Xīngqīrì wǒ bú shàngxué.", en: "On Sundays I don't go to school." } },
    { id: "xingqitian", hz: "星期天", pinyin: "Xīngqītiān", pos: "n.", en: "Sunday", key: false, note: "= 星期日",
      audio: { word: "words/w07-xingqitian.mp3", sentence: "sentences/s07-xingqitian.mp3" },
      example: { hz: "星期天我和妹妹在家里玩。", pinyin: "Xīngqītiān wǒ hé mèimei zài jiā li wán.", en: "On Sundays my younger sister and I play at home." } },
    { id: "xiuxi", hz: "休息", pinyin: "xiūxi", pos: "v.", en: "have a rest", key: true, note: "",
      audio: { word: "words/w08-xiuxi.mp3", sentence: "sentences/s08-xiuxi.mp3" },
      example: { hz: "星期天我休息。", pinyin: "Xīngqītiān wǒ xiūxi.", en: "On Sundays I rest." } },
    { id: "hui", hz: "会", pinyin: "huì", pos: "mod.", en: "can; be able to", key: true, note: "learned ability · negative 不会",
      audio: { word: "words/w09-hui.mp3", sentence: "sentences/s09-hui.mp3" },
      example: { hz: "我会说中文。", pinyin: "Wǒ huì shuō Zhōngwén.", en: "I can speak Chinese." } },
    { id: "zuofan", hz: "做饭", pinyin: "zuò fàn", pos: "v.", en: "cook", key: true, note: "",
      audio: { word: "words/w10-zuofan.mp3", sentence: "sentences/s10-zuofan.mp3" },
      example: { hz: "我们都会做饭。", pinyin: "Wǒmen dōu huì zuò fàn.", en: "We can all cook." } },
    { id: "zuo", hz: "做", pinyin: "zuò", pos: "v.", en: "make; produce", key: true, note: "做饭 / 做菜 / 会做 / 不会做",
      audio: { word: "words/w11-zuo.mp3", sentence: "sentences/s11-zuo.mp3" },
      example: { hz: "我做了三个菜。", pinyin: "Wǒ zuò le sān ge cài.", en: "I made three dishes." } },
    { id: "miantiaor", hz: "面条儿", pinyin: "miàntiáor", pos: "n.", en: "noodles", key: false, note: "儿化 r-colouring",
      audio: { word: "words/w12-miantiaor.mp3", sentence: "sentences/s12-miantiaor.mp3" },
      example: { hz: "我喜欢吃面条儿。", pinyin: "Wǒ xǐhuan chī miàntiáor.", en: "I like eating noodles." } },
    { id: "jiaozi", hz: "饺子", pinyin: "jiǎozi", pos: "n.", en: "jiaozi", key: false, note: "",
      audio: { word: "words/w13-jiaozi.mp3", sentence: "sentences/s13-jiaozi.mp3" },
      example: { hz: "饺子很好吃。", pinyin: "Jiǎozi hěn hǎochī.", en: "Jiaozi are very tasty." } },
    { id: "yixie", hz: "一些", pinyin: "yìxiē", pos: "num.-m.", en: "some", key: false, note: "一些菜 / 一些面条儿 / 一些苹果",
      audio: { word: "words/w14-yixie.mp3", sentence: "sentences/s14-yixie.mp3" },
      example: { hz: "今天做的一些菜我很喜欢吃。", pinyin: "Jīntiān zuò de yìxiē cài wǒ hěn xǐhuan chī.", en: "I really like some of the dishes made today." } },
    { id: "cai", hz: "菜", pinyin: "cài", pos: "n.", en: "dish; course", key: false, note: "做菜 / 一些菜",
      audio: { word: "words/w15-cai.mp3", sentence: "sentences/s15-cai.mp3" },
      example: { hz: "她想学做菜。", pinyin: "Tā xiǎng xué zuò cài.", en: "She wants to learn to cook." } },
    { id: "xiaban", hz: "下班", pinyin: "xiàbān", pos: "v.", en: "get off work", key: false, note: "",
      audio: { word: "words/w16-xiaban.mp3", sentence: "sentences/s16-xiaban.mp3" },
      example: { hz: "下班了我可以休息。", pinyin: "Xiàbān le wǒ kěyǐ xiūxi.", en: "After work I can rest." } },
    { id: "xin", hz: "新", pinyin: "xīn", pos: "adj.", en: "new", key: true, note: "新衣服",
      audio: { word: "words/w17-xin.mp3", sentence: "sentences/s17-xin.mp3" },
      example: { hz: "我买了一件新衣服。", pinyin: "Wǒ mǎi le yí jiàn xīn yīfu.", en: "I bought a new piece of clothing." } },
    { id: "diannao", hz: "电脑", pinyin: "diànnǎo", pos: "n.", en: "computer", key: true, note: "",
      audio: { word: "words/w18-diannao.mp3", sentence: "sentences/s18-diannao.mp3" },
      example: { hz: "我想要一个新电脑。", pinyin: "Wǒ xiǎng yào yí ge xīn diànnǎo.", en: "I want a new computer." } },
    { id: "zhen", hz: "真", pinyin: "zhēn", pos: "adv.", en: "really; truly", key: false, note: "真好 / 真贵 / 真好吃 / 真好看",
      audio: { word: "words/w19-zhen.mp3", sentence: "sentences/s19-zhen.mp3" },
      example: { hz: "这个菜真好吃！", pinyin: "Zhè ge cài zhēn hǎochī!", en: "This dish is really tasty!" } },
    { id: "haokan", hz: "好看", pinyin: "hǎokàn", pos: "adj.", en: "good-looking; nice", key: false, note: "",
      audio: { word: "words/w20-haokan.mp3", sentence: "sentences/s20-haokan.mp3" },
      example: { hz: "这件新衣服真好看！", pinyin: "Zhè jiàn xīn yīfu zhēn hǎokàn!", en: "This new outfit is really nice!" } },
    { id: "xihuan", hz: "喜欢", pinyin: "xǐhuan", pos: "v.", en: "like", key: true, note: "喜欢 / 不喜欢",
      audio: { word: "words/w21-xihuan.mp3", sentence: "sentences/s21-xihuan.mp3" },
      example: { hz: "他很喜欢李老师。", pinyin: "Tā hěn xǐhuan Lǐ lǎoshī.", en: "He really likes Mr. Li." } },
    { id: "ta-it", hz: "它", pinyin: "tā", pos: "pron.", en: "it", key: false, note: "",
      audio: { word: "words/w22-ta-it.mp3", sentence: "sentences/s22-ta-it.mp3" },
      example: { hz: "A：你的猫喜欢吃什么？ B：它喜欢吃鱼。", pinyin: "A: Nǐ de māo xǐhuan chī shénme?  B: Tā xǐhuan chī yú.", en: "A: What does your cat like eating?  B: It likes eating fish." } }
  ],

  /* ---- Grammar — 小语讲堂 pp.22/23/39 ---- */
  grammar: [
    {
      id: "g-dates", badge: "日",
      title: "时间的表达（1） — dates & weekdays",
      patterns: ["年 → 月 → <b>日/号</b> → 星期", "今天 + 星期几？"],
      explain: "Chinese runs from big to small: year, month, day, then weekday. " +
               "In writing use 日, in speech 号. The weekday needs no preposition: 今天星期一.",
      examples: [
        { hz: "今天是2026年3月6日。", pinyin: "Jīntiān shì 2026 nián 3 yuè 6 rì.", en: "Today is March 6, 2026.", hl: "日" },
        { hz: "我们3月1号上课。", pinyin: "Wǒmen 3 yuè 1 hào shàngkè.", en: "We have class on March 1st.", hl: "号" },
        { hz: "今天星期几？", pinyin: "Jīntiān xīngqī jǐ?", en: "What day of the week is it today?", hl: "星期" }
      ],
      tip: "💡 p.22 + 课本 P29: the order never flips — 2026年3月6日, never 6日3月2026年."
    },
    {
      id: "g-nompred", badge: "名",
      title: "名词谓语句 — nominal-predicate sentences",
      patterns: ["subject + <b>date / age noun</b> (no 是)"],
      explain: "When the predicate is a <b>date, weekday or age</b>, Chinese drops 是: " +
               "今天5月1号 · 我妹妹12岁. Adding 是 here sounds foreign.",
      examples: [
        { hz: "A：今天几号？ B：今天5月1号。", pinyin: "A: Jīntiān jǐ hào?  B: Jīntiān wǔ yuè yī hào.", en: "A: What's the date today?  B: It's May 1st.", hl: "5月1号" },
        { hz: "我妹妹12岁。", pinyin: "Wǒ mèimei shí'suì.", en: "My younger sister is twelve.", hl: "12岁" }
      ],
      tip: "💡 p.23: but with 是-sentences of identity (我是学生) the 是 stays — two different patterns."
    },
    {
      id: "g-hui", badge: "会",
      title: "能愿动词“会” — ability acquired by learning",
      patterns: ["会 + <b>verb</b>", "不会 + verb  (negative)"],
      explain: "会 says you <b>know how</b> to do something because you learned it: " +
               "会说中文 · 会做饭. Its negative is 不会.",
      examples: [
        { hz: "你会做饭吗？", pinyin: "Nǐ huì zuò fàn ma?", en: "Can you cook?", hl: "会" },
        { hz: "我会做面条儿。", pinyin: "Wǒ huì zuò miàntiáor.", en: "I can make noodles.", hl: "会" },
        { hz: "我不会做菜。", pinyin: "Wǒ bú huì zuò cài.", en: "I can't cook dishes.", hl: "不会" }
      ],
      tip: "💡 p.39: 会 = learned skill. (A later lesson adds 能 = circumstance allows.)"
    }
  ],

  /* ---- Bonus — the seven weekday names (warm-up p.4 + p.13) ---- */
  bonus: [
    {
      id: "b-weekdays", badge: "星", badgeClass: "gold",
      title: "星期一到星期日 · the seven day-names",
      items: [
        { char: "一", name: "星期一", nameEn: "Xīngqīyī", meaning: "Monday",
          words: "周一 (short form)", inLesson: "Warm-up B (p.4)" },
        { char: "三", name: "星期三", nameEn: "Xīngqīsān", meaning: "Wednesday",
          words: "周三", inLesson: "Listening MCQ option (p.25)" },
        { char: "六", name: "星期六", nameEn: "Xīngqīliù", meaning: "Saturday",
          words: "周六", inLesson: "Listening MCQ option (p.25)" },
        { char: "天", name: "星期天 / 星期日", nameEn: "Xīngqītiān / Xīngqīrì", meaning: "Sunday — two equal names",
          words: "周日", inLesson: "New words 5-2 (p.7)" }
      ]
    }
  ],

  /* ---- Dialogues — REAL lines from 课本 P28/P30/P32 (user screenshots 2026-10-11) ----
       d1: A = 王一雪 (f) · B = 刘明 (m)   [book order: 王一雪 speaks first]
       d2: A = 王一雪 (f) · B = 杨同乐 (m)
       d3: A = 王一雪 (f) · B = 杨同乐 (m)                                    */
  dialogues: [
    {
      id: "d1", kind: "reading",
      title: "家里 · 聊天儿", titleEn: "At home — chatting",
      scene: "在家里，刘明和王一雪在聊天儿。 At home, Liu Ming and Wang Yixue were chatting. (课本 P28)",
      tags: ["日期 dates", "星期 weekday"],
      spVoices: { A: "f", B: "m" },
      lines: [
        { sp: "A", hz: "今天几号？", pinyin: "Jīntiān jǐ hào?", en: "What's the date today?", audio: "dialogues/d1-l1.mp3" },
        { sp: "B", hz: "今天9月8号。", pinyin: "Jīntiān jiǔ yuè bā hào.", en: "Today is September 8th.", audio: "dialogues/d1-l2.mp3" },
        { sp: "A", hz: "星期几？", pinyin: "Xīngqī jǐ?", en: "What day of the week?", audio: "dialogues/d1-l3.mp3" },
        { sp: "B", hz: "星期日。今天我休息。", pinyin: "Xīngqīrì. Jīntiān wǒ xiūxi.", en: "Sunday. I'm off today.", audio: "dialogues/d1-l4.mp3" }
      ],
      questions: []
    },
    {
      id: "d2", kind: "listening",
      title: "公司里 · 休息时", titleEn: "At the company — break time",
      scene: "在公司里，王一雪和杨同乐休息时聊天儿。 At the company, Wang Yixue and Yang Tongle were chatting during a break. (课本 P30)",
      tags: ["会 can", "做饭 cooking", "🎧 listening MCQ (courseware p.25)"],
      spVoices: { A: "f", B: "m" },
      lines: [
        { sp: "A", hz: "你会做饭吗？", pinyin: "Nǐ huì zuò fàn ma?", en: "Can you cook?", audio: "dialogues/d2-l1.mp3" },
        { sp: "B", hz: "我会做。", pinyin: "Wǒ huì zuò.", en: "I can.", audio: "dialogues/d2-l2.mp3" },
        { sp: "A", hz: "你会做什么？", pinyin: "Nǐ huì zuò shénme?", en: "What can you make?", audio: "dialogues/d2-l3.mp3" },
        { sp: "B", hz: "我会做面条儿、饺子，也会做一些菜。星期天我也做饭。", pinyin: "Wǒ huì zuò miàntiáor, jiǎozi, yě huì zuò yìxiē cài. Xīngqītiān wǒ yě zuò fàn.", en: "I can make noodles and jiaozi, and some dishes too. On Sundays I also cook.", audio: "dialogues/d2-l4.mp3" }
      ],
      questions: [
        { q: { hz: "杨同乐（ ）做饭。 A. 会  B. 不  C. 不会", pinyin: "Yáng Tónglè ( ) zuò fàn.  A. huì  B. bù  C. bú huì",
               en: "Yang Tongle ( ) cook.  A. can  B. not  C. cannot" },
          a: { hz: "A. 会", pinyin: "A. huì", en: "A. can (book answer: A)" } },
        { q: { hz: "杨同乐（ ）也做饭。 A. 星期三  B. 星期六  C. 星期日", pinyin: "Yáng Tónglè ( ) yě zuò fàn.  A. Xīngqīsān  B. Xīngqīliù  C. Xīngqīrì",
               en: "On ( ) Yang Tongle also cooks.  A. Wednesday  B. Saturday  C. Sunday" },
          a: { hz: "C. 星期日", pinyin: "C. Xīngqīrì", en: "C. Sunday (book answer: C)" } }
      ]
    },
    {
      id: "d3", kind: "listening",
      title: "公司里 · 下班时", titleEn: "At the company — after work",
      scene: "在公司里，王一雪和杨同乐下班时聊天儿。 At the company, Wang Yixue and Yang Tongle were chatting after work. (课本 P32)",
      tags: ["电脑 computer", "🎧 listening MCQ (courseware p.41)", "سؤالَا ص42 المفتوحان"],
      spVoices: { A: "f", B: "m" },
      lines: [
        { sp: "A", hz: "同乐，下班吗？", pinyin: "Tónglè, xiàbān ma?", en: "Tongle, are you getting off work?", audio: "dialogues/d3-l1.mp3" },
        { sp: "B", hz: "下班。", pinyin: "Xiàbān.", en: "Off work.", audio: "dialogues/d3-l2.mp3" },
        { sp: "A", hz: "这是你的新电脑吗？", pinyin: "Zhè shì nǐ de xīn diànnǎo ma?", en: "Is this your new computer?", audio: "dialogues/d3-l3.mp3" },
        { sp: "B", hz: "是的，是我的新电脑。", pinyin: "Shì de, shì wǒ de xīn diànnǎo.", en: "Yes, it's my new computer.", audio: "dialogues/d3-l4.mp3" },
        { sp: "A", hz: "真好看！", pinyin: "Zhēn hǎokàn!", en: "Really nice!", audio: "dialogues/d3-l5.mp3" },
        { sp: "B", hz: "我也很喜欢它。", pinyin: "Wǒ yě hěn xǐhuan tā.", en: "I like it very much too.", audio: "dialogues/d3-l6.mp3" }
      ],
      questions: [
        { q: { hz: "杨同乐也（ ）。 A. 上班  B. 下班  C. 休息", pinyin: "Yáng Tónglè yě ( ).  A. shàngbān  B. xiàbān  C. xiūxi",
               en: "Yang Tongle also ( ).  A. goes to work  B. gets off work  C. rests" },
          a: { hz: "B. 下班", pinyin: "B. xiàbān", en: "B. gets off work (book answer: B)" } },
        { q: { hz: "杨同乐有一个新（ ）。 A. 名字  B. 工作  C. 电脑", pinyin: "Yáng Tónglè yǒu yí ge xīn ( ).  A. míngzi  B. gōngzuò  C. diànnǎo",
               en: "Yang Tongle has a new ( ).  A. name  B. job  C. computer" },
          a: { hz: "C. 电脑", pinyin: "C. diànnǎo", en: "C. computer (book answer: C)" } },
        { q: { hz: "杨同乐的新电脑怎么样？", pinyin: "Yáng Tónglè de xīn diànnǎo zěnmeyàng?",
               en: "How is Yang Tongle's new computer? (open Q, courseware p.42)" },
          a: { hz: "真好看！", pinyin: "Zhēn hǎokàn!", en: "Really good-looking! (from the dialogue)" } },
        { q: { hz: "杨同乐喜欢他的新电脑吗？", pinyin: "Yáng Tónglè xǐhuan tā de xīn diànnǎo ma?",
               en: "Does Yang Tongle like his new computer? (open Q, courseware p.42)" },
          a: { hz: "喜欢。他说：我也很喜欢它。", pinyin: "Xǐhuan. Tā shuō: wǒ yě hěn xǐhuan tā.", en: "Yes — he says: I like it very much too." } }
      ]
    }
  ]
};
