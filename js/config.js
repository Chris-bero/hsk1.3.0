/* ============================================================
   HSK 1 — site config for the Google Sheets bridge
   ------------------------------------------------------------
   sheetsUrl: paste your Apps Script Web App URL (ends with /exec)
              between the quotes. Leave '' for a fully offline
              copy (gate & tracking disable themselves gracefully).

   ✔ PHASE B DONE (2026-10-10): HSK 1 uses its OWN Google Sheet — never the
     HSK 2 one. Verified live: ping -> {"service":"hsk1-sheets","v":2} · health -> 11 log cols.
     Re-deploy steps if Code.gs ever changes: new Sheet → Extensions → Apps Script → paste
     google-sheets/Code.gs → run setup() → fill Students/Settings →
     Deploy (Web app · Anyone) → paste the /exec URL below →
     flip enabled to true.
   ============================================================ */
window.HSK1_CONFIG = {
  sheetsUrl: 'https://script.google.com/macros/s/AKfycbzE2KmKYtTg0K9JPMaJR25tVu5C4vCbwFweQ-qUnw9klWmuYMtDRnris4kpflYfMWZ-SA/exec',
  enabled: true,               // master switch (offline bundle sets false)
  gatePage: 'gate.html',
  teacherPage: 'teacher.html',
  sessionKey: 'hsk1:session',
  deviceKey: 'hsk1:deviceId',
  checkEveryMs: 12 * 60 * 60 * 1000,   // daily check cadence (12h)
  flushMs: 20000                       // event batch interval
};
