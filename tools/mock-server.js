/* ============================================================
   HSK 1 — mock Google Apps Script environment (node)
   Lets us run the REAL Code.gs offline: in-memory spreadsheet,
   LockService / ContentService / Utilities stubs, injectable
   clock (for the 2h share window & 24h kick window tests).
   Usage:
     const { makeEnv, loadCode } = require('./mock-server.js');
     const env = makeEnv();            // { SS, now }
     const api = loadCode(env);        // { setup, doGet, doPost, ensure }
     api.doPost({ postData: { contents: JSON.stringify(body) } });
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

function makeSheet(name) {
  return {
    name,
    rows: [],
    frozen: 0,
    getLastRow() { return this.rows.length; },
    setFrozenRows(n) { this.frozen = n; return this; },
    getRange(r, c, nr, nc) {
      const sh = this;
      return {
        getValues() {
          const out = [];
          for (let i = 0; i < nr; i++) {
            const src = sh.rows[r - 1 + i] || [];
            const line = [];
            for (let j = 0; j < nc; j++) {
              const v = src[c - 1 + j];
              line.push(v === undefined ? '' : v);
            }
            out.push(line);
          }
          return out;
        },
        setValues(vals) {
          for (let i = 0; i < vals.length; i++) {
            const ri = r - 1 + i;
            if (!sh.rows[ri]) sh.rows[ri] = [];
            for (let j = 0; j < vals[i].length; j++) sh.rows[ri][c - 1 + j] = vals[i][j];
          }
          return this;
        }
      };
    }
  };
}

function makeEnv(startMs) {
  const SS = {
    sheets: {},
    getSheetByName(n) { return this.sheets[n] || null; },
    insertSheet(n) { this.sheets[n] = makeSheet(n); return this.sheets[n]; },
    getSpreadsheetTimeZone() { return 'UTC'; }
  };
  return { SS, now: { t: startMs || Date.now() } };
}

function loadCode(env) {
  const src = fs.readFileSync(path.join(__dirname, '..', 'google-sheets', 'Code.gs'), 'utf8');

  const SpreadsheetApp = {
    getActiveSpreadsheet: () => env.SS,
    getActiveSheet: () => null
  };
  const LockService = { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) };
  const ContentService = {
    MimeType: { JSON: 'application/json' },
    createTextOutput(t) { return { text: t, setMimeType() { return this; } }; }
  };
  const Utilities = {
    formatDate(d, tz, fmt) {
      const p = n => String(n).padStart(2, '0');
      return d.getUTCFullYear() + '-' + p(d.getUTCMonth() + 1) + '-' + p(d.getUTCDate()) +
        ' ' + p(d.getUTCHours()) + ':' + p(d.getUTCMinutes()) + ':' + p(d.getUTCSeconds());
    }
  };
  // injectable clock: `new Date()` === fake now, `new Date(ms)` === real ms
  function FakeDate(ms) {
    return ms === undefined ? new Date(env.now.t) : new Date(ms);
  }

  const factory = new Function(
    'SpreadsheetApp', 'LockService', 'ContentService', 'Utilities', 'Date',
    src + '\n;return { setup: setup, doGet: doGet, doPost: doPost, ensure: ensureStructure_ };'
  );
  const api = factory(SpreadsheetApp, LockService, ContentService, Utilities, FakeDate);

  api.getSS = () => env.SS;
  api.json = res => JSON.parse(res.text);           // unwrap ContentService output
  api.get = (action, params) =>
    api.json(api.doGet({ parameter: Object.assign({ action }, params || {}) }));
  api.post = body =>
    api.json(api.doPost({ postData: { contents: JSON.stringify(body) } }));
  return api;
}

module.exports = { makeEnv, loadCode, makeSheet };
