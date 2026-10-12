# 📘 playbook المشروع الكامل — من كتاب HSK إلى منظومة منشورة محمية
> الخلاصة الكاملة لتجربة HSK Standard Course 2، مكتوبة بحيث تُطبَّق كما هي على أي مستوى آخر
> (HSK 1 / 3 / 4 …) وتحفظ الطريقة نفسها التي نجحت. آخر تحديث: 2026-10-04.

---

## 0) القصة في فقرة (لماذا توجد هذه الوثيقة)

بدأ المشروع برقمنة كتاب HSK 2 إلى موقع تفاعلي (15 درساً)، ثم أُضيفت له «طبقة نزاهة صفّية»
(بوابة أكواد + بصمة أجهزة + لوحة معلم + تتبع تقدم لكل درس)، ثم نُشر على GitHub خاص + Vercel
مع خلفية Google Sheets. في منتصف الطريق ماتت جلسة عمل كاملة وفُقدت ورشتها، فأُعيد بناء كل شيء
من مواصفات ملتقطة + نسخ سحابية، ووُضع بروتوكول حماية دائم. هذه الوثيقة تحفظ **الطريقة** لا النتيجة فقط.

---

## 1) الصورة النهائية: مكونات المنظومة

| الطبقة | الملف | الدور |
|---|---|---|
| المحور | `index.html` + `js/hub.js` | شبكة الدروس + الحالة + Continue |
| قالب الدرس | `lesson.html` + `js/loader.js` + `js/app.js` | مشغّل عام data-driven لأي درس |
| نظام التصميم | `css/style.css` | light/dark + أنيميشن + مكونات |
| بيانات الدرس | `js/data/lessonN.js` | المصدر الوحيد للحقيقة لكل درس |
| السجل | `js/course.js` | حالة الدروس (ready/soon) + الأعداد |
| الصوت | `audio/lNN/{words,sentences,dialogues,grammar}` | 900 مقطع حقيقي بلا TTS زمن تشغيل |
| البوابة | `gate.html` | دخول باسم + كود صفّ |
| جسر الشيتة | `js/config.js` + `js/sheets.js` | بصمة جهاز + جلسة + دفعات أحداث + فحص يومي |
| الخلفية | `google-sheets/Code.gs` | Apps Script: login/log/check/progress/tail/roster/health/ping |
| لوحة المعلم | `teacher.html` | تقدم + أجهزة + أعلام مشاركة + سجل خام + تقدم لكل درس |
| الجودة | `tools/validate-lesson.js` + `tools/test-v2.js` + `tools/mock-server.js` | فحص بيانات + 36 اختباراً بخادم محاكٍ |
| النشر | `tools/build-packages.ps1` + `tools/push-github.ps1` | حزمتان + دفع واحد |
| الذاكرة | `RESUME_AR.md` + `PROTECTION_AR.md` + هذا الملف | استئناف فوري بعد أي موت جلسة |

---

## 2) عقد البيانات والتسمية (القلب — احفظه حرفياً)

### 2.1 بنية `js/data/lessonN.js`
```js
window.LESSON = {
  meta: { course, lesson, title, titlePinyin, titleEn,
          audioBase: "audio/l07/",
          objectives: { keyWords[], grammar[], sound, characters } },
  audioReady: [ "words/w01-li.mp3", ... ],        // مانيفست الموجود فعلياً على القرص
  words: [ { id, hz, pinyin, pos, en, key?,
             audio: { word, sentence },
             example: { hz, pinyin, en } } ],
  grammar: [ { id, badge, title, patterns[], explain, examples[{hz,pinyin,en,hl}], tip } ],
  bonus: [ ... ],                                  // اختياري: radicals/intonation
  dialogues: [ { id, kind, title, titleEn, scene, tags[],
                 spVoices: { A: "f", B: "m" },
                 lines: [ { sp, hz, pinyin, en, audio } ],
                 questions: [ ... ] } ]
};
```
- أي صوت غير موجود في `audioReady`/القرص → سقوط تلقائي لـ TTS المتصفح (الدرس لا ينكسر أبداً).
- الفاحص `node tools/validate-lesson.js N|all` = 0 أخطاء شرط النشر؛ التحذيرات = صوت ناقص بعدُ.

### 2.2 تسمية الملفات الصوتية
`words/wNN-<id>.mp3` · `sentences/sNN-<id>.mp3` · `dialogues/dN-lM.mp3` ·
`dialogues/dN-qM.mp3` (أسئلة الاستماع) · `grammar/gN-eM.mp3` — تحت `audio/lNN/`.

### 2.3 الأصوات
- 👩 راوية أنثى: كلمات، جمل أمثلة، قواعد، أسئلة، والمتحدث A افتراضاً.
- 👨 ذكر: المتحدث المعيَّن في `spVoices` لكل حوار.
- **دفعات 10 مقاطع لكل رسالة** + تأشير كل مسار في `audioReady` + تحديث `audio/PRODUCTION_PLAN.md`.

### 2.4 مفاتيح التخزين المحلية (لكل مستوى بادئة خاصة)
`hsk2:settings` (دورة كاملة: pinyin/dark) · `hsk2-l7:mastered` · `hsk2-l7:quizBest` · `hsk2-l7:drillBest`
+ طبقة v2: `hsk2:session` · `hsk2:deviceId`.
> عند نسخة مستوى جديد: استبدال شامل `hsk2` → `hsk3` في app.js/hub.js/config.js/التوثيق.

### 2.5 الأحداث المرسلة للشيتة
`login · lesson_open · lesson_time(60s) · quiz_done(score,total) · drill_done(score=streak) ·
flashcards_done · mastery(score=متقن,total=كلمات)` — تُدفن دفعات كل 20 ثانية + sendBeacon عند الإغلاق.

---

## 3) عقد Google Sheet / Apps Script (عام لأي مستوى)

- تبويبات: `Students(Name,Code,Active,Note)` · `Log(11 عموداً)` · `Settings(teacher_code,class_code)`.
- أعمدة Log: `Timestamp, Event, Student, Lesson, Detail, Score, Total, Seconds, EpochMs, Device, DevLabel`.
- نقاط النهاية: GET `ping/roster/health/progress(?code&days)/tail(?code&rows)` · POST `login/log/check`.
- سلوكيات v2: هجرة تلقائية لسجل 9 أعمدة قديم · نافذة ساعتين → `shareFlag` + `same-time use!` ·
  `Active=no` يطرد خلال 24 ساعة عند الفحص اليومي · تدوير كود = تغيير خلية · الأكواد لا تغادر الشيتة.
- `Code.gs` **خالٍ من أي اسم مستوى** — نفس الملف يُستخدم لأي HSK آخر كما هو.

---

## 4) حلقة إنتاج درس جديد (تُكرر لكل درس)

1. **مصدر:** PDF الكتاب (`2-8.pdf` مثال) أو المنهج.
2. **بيانات:** نسخ `_TEMPLATE.js` → `lessonN.js` وتعبئة الأقسام أعلاه.
3. **فحص:** `node tools/validate-lesson.js N` → 0 أخطاء (تحذيرات الصوت مقبولة الآن).
4. **صوت:** دفعات 10 مقاطع → وضع المسارات في `audioReady` + tick في PRODUCTION_PLAN.
5. **نشر الدرس:** في `course.js`: `status:"ready"` + الأعداد → بطاقة المحور تُفتح تلقائياً.
6. **دفع فوري:** `build-packages.ps1` ثم push (قاعدة الحماية #1).

---

## 5) ولادة مستوى جديد (HSK X) — الخطوات المرتبة

**طور أ — الاستنساخ الذكي**
1. نسخ مجلد المشروع → `hskX-course`.
2. استبدال شامل `hsk2` → `hskX` (مفاتيح تخزين + نصوص) في: app.js, hub.js, config.js, الصفحات, التوثيق.
3. `course.js`: سجل دروس المستوى الجديد (عناوين/أعداد) بحالة `soon`.
4. العناوين والأختام في الصفحات (汉 + رقم المستوى) + ألوان إن رغبت.

**طور ب — الخلفية الجديدة**
5. Google Sheet جديدة باسم المستوى → Extensions → Apps Script → لصق **نفس Code.gs** → Run `setup` → Deploy Web app (Anyone) → نسخ `/exec`.
6. لصق الرابط في `js/config.js` الجديد.

**طور ج — الدرس التجريبي**
7. إنتاج درس واحد كامل بالحلبة (§4) واختباره طرفياً (بوابة → درس → لوحة).

**طور د — الجودة**
8. `validate-lesson all` + `node tools/test-v2.js` (المحاكي لا يعتمد على مستوى معين).

**طور هـ — النشر**
9. مستودع خاص جديد + `push-github.ps1 -Repo hskX` + Vercel/Pages + تحديث About.

**طور و — الحماية**
10. تطبيق §8 كما هو + وسم `git tag v1.0`.

---

## 6) فلسفة الجودة: ثلاث طبقات لا تُختصر

1. **فحص بيانات** لكل درس قبل أي صوت (أرخص خطأ يُكتشف مبكراً).
2. **اختبارات محاكية** تشغّل Code.gs الحقيقي وسheets.js الحقيقي في node بساعة قابلة للحقن
   (سيناريوهات: تسريب كود، إيقاف طالب، هجرة سجل قديم، حدود النوافذ، سقف الدفعات) — الهدف 32→36/36.
3. **جولة خارجية بعد النشر**: فتح الموقع من خارج جهاز المطور تماماً (بوابة/درس/صوت/لوحة).

---

## 7) خط النشر والتحديث

```powershell
powershell -ExecutionPolicy Bypass -File tools\build-packages.ps1   # dist-online + dist-offline + zipان
powershell -ExecutionPolicy Bypass -File tools\push-github.ps1      # يبني+يحتاط+يدفع (يسأل اسمك والمستودع)
```
- `dist-offline` = نفس الموقع ببوابة معطلة (`enabled:false`) للمشاركة بلا إنترنت.
- المستودع الخاص يحمل أيضاً: tools/ + google-sheets/ + التوثيق + الذاكرة (نسخة احتياطية مؤرخة بكل push).
- تقدم الطلاب في أجهزتهم لا يتأثر بأي تحديث (localStorage).

---

## 8) بروتوكول الحماية من موت الجلسة (الدرس الأغلى)

- **المبدأ:** لا ملف يعيش في مكان واحد أبداً.
- **الطبقات:** جهاز+OneDrive · مستودع خاص · سحابة جوجل (Versions + Sheet history) ·
  حقيبة الاستئناف (RESUME_AR.md + آخر ZIP) · دفعات صغيرة تُدفع فوراً.
- **القواعد الثلاث:** push بعد كل دفعة · لا يوم ينتهي وملف جديد خارج مجلدك ·
  إن فرغ رد: Regenerate مرة ثم محادثة جديدة ترفع RESUME_AR.md + آخر ZIP كأول رسالة.
- **أسبوعياً:** Make a copy للشيتة + `git tag` قبل تغيير كبير.

---

## 9) سجل الفخاخ المؤلمة (لا تكرر أخطاءنا)

| الفخ | الدرس |
|---|---|
| ورشة المحادثة زائلة بموت الجلسة | كل ناتج يُنسخ خارج المحادثة فوراً (push/تنزيل) |
| PowerShell 5.1 يقرأ ps1 بلا UTF-8 BOM | سكربتات ويندوز **ASCII فقط** (— و✔ تكسر المحلل) |
| `$ErrorActionPreference='Stop'` + `2>&1` مع git | أسطر stderr العادية تصبح خطأ قاتلاً → الأسر عبر `cmd /c` |
| تحذيرات LF→CRLF | ضجيج بلا أثر — تُتجاهل |
| `[OK]` تُطبع رغم فشل push | افحص `$LASTEXITCODE` دائماً لا مظهر الخرج |
| اسم مستودع مختلف عن المتوقع (hsk2 vs HSK-2-2.0) | اقرأ تبويب المتصفح/اللقطة قبل افتراض الاسم |
| «The current content is empty» | Regenerate مرة؛ إن تكرر فحقيبة الاستئناف |
| رفع 900 ملف يدوياً للمستودع | لا — git push واحد أو حزمة zip بجذر صحيح |

---

## 10) مرجع الأوامر السريع

```bash
node tools/validate-lesson.js all        # سلامة بيانات الدروس
node tools/test-v2.js                    # 36/36 منظومة النزاهة
```
```powershell
powershell -ExecutionPolicy Bypass -File tools\build-packages.ps1
powershell -ExecutionPolicy Bypass -File tools\push-github.ps1
cd dist-online ; git add -A ; git commit -m "..." ; git push      # بديل يدوي
```

---

## 11) Checklist إطلاق مستوى جديد (اطبعها وعَلِّم عليها)

- [ ] مجلد منسوخ + استبدال بادئة المستوى everywhere
- [ ] course.js بسجل الدروس (soon)
- [ ] Sheet جديدة + Code.gs منشور + `/exec` في config.js
- [ ] درس تجريبي كامل (بيانات → فحص → صوت → ready)
- [ ] validate all = 0 errors · test-v2 = 36/36
- [ ] مستودع خاص + push ناجح + About/website
- [ ] Vercel/Pages حي + جولة فحص خارجية (بوابة/درس/صوت/لوحة)
- [ ] teacher_code سري + صفوف طلاب حقيقية
- [ ] PROTECTION مطبق + tag v1.0 + نسخة شيتة احتياطية

---

*هذه الوثيقة تعيش في ثلاثة أماكن دائماً: ورشة المساعد · مجلدك على OneDrive · المستودع الخاص —
أي محادثة جديدة تبدأ برفعها مع RESUME_AR.md فتكمل من السطر التالي مباشرة. 学汉语،每天进步 📕*
