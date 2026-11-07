#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

function firstDiff(a, b) {
  const n = Math.min(a.length, b.length);
  let i = 0;
  while (i < n && a.charCodeAt(i) === b.charCodeAt(i)) i++;
  return i;
}

function verifyBook(root, abbr) {
  const dir = path.join(root, 'assets', 'lib', abbr);
  const errs = [];
  const orig = fs.readFileSync(path.join(root, 'assets', 'lib_' + abbr + '.js'), 'utf8');
  const sb = { window: {} };
  vm.createContext(sb);
  vm.runInContext(fs.readFileSync(path.join(dir, 'index.js'), 'utf8'), sb);
  if (sb.window.LIBSPLIT !== 1) errs.push('LIBSPLIT flag missing');
  const skel = sb.window.LIB;
  const files = fs.readdirSync(dir).filter(f => /^\d+\.js$/.test(f));
  const skelChs = [];
  for (const v of skel[0].verses) if (!skelChs.includes(v.c)) skelChs.push(v.c);
  const fileChs = files.map(f => +f.slice(0, -3));
  for (const c of skelChs) if (!fileChs.includes(c)) errs.push('missing chapter file ' + c);
  for (const c of fileChs) if (!skelChs.includes(c)) errs.push('extra chapter file ' + c);
  let chBytes = 0;
  for (const f of files) {
    const s = fs.readFileSync(path.join(dir, f), 'utf8');
    chBytes += Buffer.byteLength(s);
    vm.runInContext(s, sb);
  }
  const LIBCH = sb.window.LIBCH || {};
  const used = {}; // chapter -> next index
  const seen = new Set();
  const full = [];
  for (const sv of skel[0].verses) {
    const arr = LIBCH[abbr + '/' + sv.c];
    if (!arr) { errs.push('no LIBCH for chapter ' + sv.c); break; }
    const i = used[sv.c] || 0;
    used[sv.c] = i + 1;
    const fv = arr[i];
    if (!fv) { errs.push(`chapter ${sv.c}: skeleton has more verses than chapter file`); break; }
    if (fv.c !== sv.c || fv.v !== sv.v) { errs.push(`c/v mismatch at ${sv.c}:${sv.v} vs ${fv.c}:${fv.v}`); break; }
    const key = sv.c + ':' + i;
    if (seen.has(key)) errs.push('verse used twice ' + key);
    seen.add(key);
    full.push(fv);
  }
  for (const c of skelChs) {
    const arr = LIBCH[abbr + '/' + c] || [];
    if ((used[c] || 0) !== arr.length) errs.push(`chapter ${c}: skeleton uses ${used[c] || 0} verses, file has ${arr.length}`);
  }
  const rb = Object.assign({}, skel[0], { verses: full });
  // keep key order: same keys as skeleton (verses stays in place)
  const rebuilt = 'window.LIB=' + JSON.stringify([rb]) + ';';
  let mode;
  if (rebuilt === orig) mode = 'byte-identical';
  else if (rebuilt + '\n' === orig) mode = 'byte-identical (original has trailing newline)';
  else {
    // canonical check on original
    const o = { window: {} };
    vm.runInNewContext(orig, o);
    const canon = 'window.LIB=' + JSON.stringify(o.window.LIB) + ';';
    const origCanon = orig === canon || orig === canon + '\n';
    let deep = true;
    try { assert.deepStrictEqual(JSON.parse(JSON.stringify([rb])), JSON.parse(JSON.stringify(o.window.LIB))); } catch (e) { deep = false; }
    if (!origCanon) mode = 'ORIGINAL NOT CANONICAL; deep-equal=' + deep;
    else mode = 'MISMATCH at char ' + firstDiff(rebuilt, orig);
    if (!(deep && !origCanon)) errs.push(mode);
  }
  return { errs, mode, origBytes: Buffer.byteLength(orig), skelBytes: fs.statSync(path.join(dir, 'index.js')).size, chBytes, chapters: files.length, verses: full.length };
}

if (require.main === module) {
  let root = path.resolve(__dirname, '..');
  let all = false;
  const names = [];
  for (const a of process.argv.slice(2)) {
    if (a.startsWith('--root=')) root = path.resolve(a.slice(7));
    else if (a === '--all') all = true;
    else names.push(a);
  }
  let books = names;
  if (all) {
    const base = path.join(root, 'assets', 'lib');
    books = fs.existsSync(base) ? fs.readdirSync(base).filter(d => fs.existsSync(path.join(base, d, 'index.js'))).sort() : [];
  }
  if (!books.length) { console.error('usage: verify_split.js [--root=dir] (--all | Abbr...)'); process.exit(2); }
  let bad = 0;
  for (const b of books) {
    let r;
    try { r = verifyBook(root, b); } catch (e) { r = { errs: ['exception: ' + e.message], mode: 'error', origBytes: 0, skelBytes: 0, chBytes: 0, chapters: 0, verses: 0 }; }
    if (r.errs.length) bad++;
    console.log(`${r.errs.length ? '✗' : '✓'} ${b}  ${r.mode}  orig=${r.origBytes}B skeleton=${r.skelBytes}B chapters=${r.chapters} (${r.chBytes}B) verses=${r.verses}` + (r.errs.length ? '\n    ' + r.errs.join('\n    ') : ''));
  }
  console.log(bad ? `FAILED: ${bad}/${books.length}` : `OK: ${books.length} book(s)`);
  process.exit(bad ? 1 : 0);
}
module.exports = { verifyBook };
