/* ============================================================
   LESSON LOADER — used by lesson.html
   Reads the lesson id from ?id=N (or #N), then injects:
   course.js → data/lessonN.js → app.js
   Works from file:// (plain script tags, no fetch/CORS).
   ============================================================ */
(function () {
  'use strict';

  var params = new URLSearchParams(location.search);
  var raw = params.get('id') || params.get('l') || (location.hash || '').replace('#', '') || '';
  var n = parseInt((String(raw).match(/\d+/) || ['1'])[0], 10);
  if (!(n >= 1 && n <= 15)) n = 1;
  window.__LESSON_ID__ = n;

  function load(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = function () { res(); };
      s.onerror = function () { rej(new Error('Failed to load ' + src)); };
      document.head.appendChild(s);
    });
  }

  load('js/course.js')
    .then(function () { return load('js/data/lesson' + n + '.js'); })
    .then(function () { return load('js/app.js'); })
    .catch(function () {
      var box = document.getElementById('loadError');
      var msg = document.getElementById('loadErrorMsg');
      if (msg) msg.textContent = 'Lesson ' + n + ' is not built yet.';
      if (box) box.style.display = 'block';
    });
})();
