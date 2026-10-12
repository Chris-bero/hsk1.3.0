/* ============================================================
   HSK 1 — sheets.js  (client bridge · v2 rebuild 2026-10-04)
   ------------------------------------------------------------
   · device fingerprint: permanent id (localStorage) + readable
     label  e.g. "Chrome/Windows · ar · Asia/Riyadh"
   · session: {student, at, checkedAt} in localStorage
   · event queue: batched POST every flushMs + sendBeacon on hide
   · daily check: POST {action:'check'} → teacher deactivation
     kicks logged-in devices (Active=no)
   · graceful offline: no sheetsUrl ⇒ every call is a safe no-op
   Pages load: js/config.js → js/sheets.js (before app/hub).
   ============================================================ */
(function () {
  'use strict';

  var cfg = window.HSK1_CONFIG || { enabled: false };
  var LS = window.localStorage;

  function lsGet(k) { try { return LS.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { LS.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { LS.removeItem(k); } catch (e) {} }

  /* ---------- device fingerprint ---------- */
  var deviceId = lsGet(cfg.deviceKey || 'hsk1:deviceId');
  if (!deviceId) {
    deviceId = (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 16)
      : (Math.random().toString(36).slice(2, 10) + Date.now().toString(36));
    lsSet(cfg.deviceKey || 'hsk1:deviceId', deviceId);
  }

  function browserName() {
    var ua = navigator.userAgent;
    if (ua.indexOf('OPR') > -1) return 'Opera';
    if (ua.indexOf('Edg') > -1) return 'Edge';
    if (ua.indexOf('Firefox') > -1) return 'Firefox';
    if (ua.indexOf('Chrome') > -1) return 'Chrome';
    if (ua.indexOf('Safari') > -1) return 'Safari';
    return 'Browser';
  }
  function osName() {
    var ua = navigator.userAgent;
    if (/Windows/.test(ua)) return 'Windows';
    if (/Android/.test(ua)) return 'Android';
    if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
    if (/Mac OS X/.test(ua)) return 'macOS';
    if (/CrOS/.test(ua)) return 'ChromeOS';
    if (/Linux/.test(ua)) return 'Linux';
    return 'OS';
  }
  var devLabel = browserName() + '/' + osName() +
    ' · ' + (navigator.language || '??') +
    ' · ' + ((Intl && Intl.DateTimeFormat) ? Intl.DateTimeFormat().resolvedOptions().timeZone : '??');

  function device() { return { id: deviceId, label: devLabel }; }

  /* ---------- session ---------- */
  function session() {
    var raw = lsGet(cfg.sessionKey || 'hsk1:session');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }
  function setSession(s) { lsSet(cfg.sessionKey || 'hsk1:session', JSON.stringify(s)); }
  function clearSession() { lsDel(cfg.sessionKey || 'hsk1:session'); }

  function enabled() { return !!(cfg.enabled && cfg.sheetsUrl); }

  /* ---------- transport ---------- */
  function post(body) {
    // text/plain avoids CORS preflight against Apps Script
    return fetch(cfg.sheetsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json(); });
  }
  function get(params) {
    var u = cfg.sheetsUrl + '?' + new URLSearchParams(params).toString();
    return fetch(u).then(function (r) { return r.json(); });
  }

  /* ---------- login / logout ---------- */
  function login(name, code) {
    if (!enabled()) return Promise.resolve({ ok: false, error: 'offline' });
    return post({ action: 'login', name: name, code: code, device: device() })
      .then(function (res) {
        if (res && res.ok) {
          setSession({ student: res.student, at: Date.now(), checkedAt: Date.now(), deviceId: deviceId });
        }
        return res;
      });
  }
  function logout() { clearSession(); }

  /* ---------- event queue ---------- */
  var queue = [];
  var timer = null;

  function log(event, detail, extra) {
    if (!enabled()) return;
    var s = session();
    var ev = {
      event: event,
      student: s ? s.student : '(anon)',
      lesson: window.__LESSON_ID__ || '',
      detail: detail || ''
    };
    if (extra) for (var k in extra) ev[k] = extra[k];
    queue.push(ev);
    if (queue.length >= 60) { flush(); return; }
    if (!timer) timer = setTimeout(flush, cfg.flushMs || 20000);
  }

  function flush() {
    if (timer) { clearTimeout(timer); timer = null; }
    if (!enabled() || !queue.length) return;
    var events = queue.splice(0, 60);
    post({ action: 'log', device: device(), events: events }).catch(function () {
      // network blip: put events back at the front (bounded)
      queue = events.concat(queue).slice(0, 240);
    });
  }

  /* ---------- daily check & kick ---------- */
  function check() {
    if (!enabled()) return Promise.resolve({ ok: true, offline: true });
    var s = session();
    if (!s) return Promise.resolve({ ok: false, error: 'no_session' });
    return post({ action: 'check', student: s.student, device: device() })
      .then(function (res) {
        if (res && res.ok) {
          s.checkedAt = Date.now();
          setSession(s);
        } else if (res && res.error === 'inactive') {
          kick(res.recent
            ? 'أوقف المعلم متابعتك — راجعه شخصياً للحصول على كود جديد'
            : 'هذا الحساب موقوف حالياً');
        }
        return res;
      })
      .catch(function () { return { ok: true, net: false }; });
  }

  function kick(msg) {
    clearSession();
    queue = [];
    var g = cfg.gatePage || 'gate.html';
    location.replace(g + '?kick=1&msg=' + encodeURIComponent(msg || ''));
  }

  /* ---------- page guard ---------- */
  function requireSession() {
    if (!enabled()) return true;
    var s = session();
    if (!s) {
      location.replace((cfg.gatePage || 'gate.html') +
        '?next=' + encodeURIComponent(location.pathname + location.search));
      return false;
    }
    if (Date.now() - (s.checkedAt || 0) > (cfg.checkEveryMs || 43200000)) check();
    return true;
  }

  /* ---------- flush on hide ---------- */
  window.addEventListener('pagehide', function () {
    if (!enabled() || !queue.length) return;
    var events = queue.splice(0, 60);
    var blob = new Blob([JSON.stringify({ action: 'log', device: device(), events: events })],
      { type: 'text/plain' });
    navigator.sendBeacon(cfg.sheetsUrl, blob);
  });

  window.HSK1 = {
    cfg: cfg,
    enabled: enabled,
    deviceId: deviceId,
    devLabel: devLabel,
    device: device,
    session: session,
    setSession: setSession,
    clearSession: clearSession,
    login: login,
    logout: logout,
    log: log,
    flush: flush,
    check: check,
    kick: kick,
    requireSession: requireSession,
    get: get,
    post: post
  };
})();
