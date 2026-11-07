#!/usr/bin/env node
'use strict';
// Splits assets/lib_<Abbr>.js into assets/lib/<Abbr>/index.js (skeleton) + <chapter>.js files.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function writeIfDiff(file, content, written, root) {
  let cur = null;
  try { cur = fs.readFileSync(file, 'utf8'); } catch (e) {}
  if (cur === content) return;
  fs.writeFileSync(file, content);
  written.push(path.relative(root, file));
}

function splitBook(root, abbr, opts) {
  opts = opts || {};
  const src = path.join(root, 'assets', 'lib_' + abbr + '.js');
  const dir = path.join(root, 'assets', 'lib', abbr);
  const st = fs.statSync(src);
  const stamp = st.size + ':' + Math.round(st.mtimeMs);
  const stampFile = path.join(dir, '.src');
  if (!opts.force) {
    try {
      if (fs.readFileSync(stampFile, 'utf8').trim() === stamp && fs.existsSync(path.join(dir, 'index.js')))
        return { changed: false, skipped: true, files: [], chapters: 0, skeletonBytes: 0, maxChapterBytes: 0 };
    } catch (e) {}
  }
  const code = fs.readFileSync(src, 'utf8');
  const sb = { window: {} };
  vm.runInNewContext(code, sb);
  const LIB = sb.window.LIB;
  if (!Array.isArray(LIB) || LIB.length !== 1) throw new Error(abbr + ': expected LIB to be a 1-element array');
  const book = LIB[0];
  const order = [];
  const byCh = new Map();
  for (const v of book.verses) {
    if (!byCh.has(v.c)) { byCh.set(v.c, []); order.push(v.c); }
    byCh.get(v.c).push(v);
  }
  const skelBook = {};
  for (const k of Object.keys(book)) {
    skelBook[k] = k === 'verses' ? book.verses.map(v => ({ c: v.c, v: v.v })) : book[k];
  }
  fs.mkdirSync(dir, { recursive: true });
  const written = [];
  const indexJs = 'window.LIB=' + JSON.stringify([skelBook]) + ';window.LIBSPLIT=1;\n';
  writeIfDiff(path.join(dir, 'index.js'), indexJs, written, root);
  let maxB = 0;
  for (const c of order) {
    const body = '(window.LIBCH=window.LIBCH||{})["' + abbr + '/' + c + '"]=' + JSON.stringify(byCh.get(c)) + ';\n';
    maxB = Math.max(maxB, Buffer.byteLength(body));
    writeIfDiff(path.join(dir, c + '.js'), body, written, root);
  }
  fs.writeFileSync(stampFile, stamp);
  return { changed: written.length > 0, skipped: false, files: written, chapters: order.length,
    skeletonBytes: Buffer.byteLength(indexJs), maxChapterBytes: maxB };
}

function listBooks(root) {
  return fs.readdirSync(path.join(root, 'assets')).map(f => (f.match(/^lib_(.+)\.js$/) || [])[1]).filter(Boolean).sort();
}

module.exports = { splitBook, listBooks };

if (require.main === module) {
  let root = path.resolve(__dirname, '..');
  let force = false, all = false;
  const names = [];
  for (const a of process.argv.slice(2)) {
    if (a.startsWith('--root=')) root = path.resolve(a.slice(7));
    else if (a === '--force') force = true;
    else if (a === '--all') all = true;
    else names.push(a);
  }
  const books = all ? listBooks(root) : names;
  if (!books.length) { console.error('usage: split_lib.js [--root=dir] [--force] (--all | Abbr...)'); process.exit(2); }
  for (const b of books) {
    const r = splitBook(root, b, { force });
    console.log(`${b}  chapters=${r.chapters}  skeleton=${r.skeletonBytes}B  maxChapter=${r.maxChapterBytes}B  ` +
      (r.skipped ? 'skipped' : r.changed ? `changed (${r.files.length} files written)` : 'unchanged (content identical)'));
  }
}
