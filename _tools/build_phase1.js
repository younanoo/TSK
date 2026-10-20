/* Phase 1 build: split heavy data out of the book pages.
   Run from the site folder:  node _tools/build_phase1.js
   - assets/catalog.js           shared book list (was copied into 67 pages)
   - assets/lib_XXX.js           each book's TSK data (was inline in XXX.html)
   - assets/tx/{alab,svd,kjv}_XXX.js  Bible text split per book (was one 4-5 MB file)
   - XXX.html / index.html       now just reference those files
   Safe to re-run: it reads the data back from lib_XXX.js once pages are converted. */
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const A = p => path.join(ROOT, p);
const VER = "2"; // bump to force browsers to fetch new app.js / data

function runJS(file) { const ctx = {}; ctx.window = ctx; vm.runInNewContext(fs.readFileSync(A(file), "utf8"), ctx); return ctx; }
const J = v => JSON.stringify(v);

/* ---- catalog ---- */
let idx = fs.readFileSync(A("index.html"), "utf8");
let CAT;
const catRe = /<script>window\.CATALOG=(\[.*?\]);<\/script>/s;
if (catRe.test(idx)) CAT = JSON.parse(idx.match(catRe)[1]);
else CAT = runJS("assets/catalog.js").CATALOG;
fs.writeFileSync(A("assets/catalog.js"), "window.CATALOG=" + J(CAT) + ";\n");
idx = idx.replace(catRe, `<script src="assets/catalog.js?v=${VER}"></script>`);
fs.writeFileSync(A("index.html"), idx);

/* ---- Bible text per book ---- */
fs.mkdirSync(A("assets/tx"), { recursive: true });
for (const k of ["alab", "svd", "kjv"]) {
  const T = runJS(`assets/tx_${k}.js`).TX[k];
  for (const bk of Object.keys(T))
    fs.writeFileSync(A(`assets/tx/${k}_${bk}.js`),
      `window.TXB=window.TXB||{};TXB["${k}/${bk}"]=${J(T[bk])};\n`);
}

/* ---- book pages ---- */
const libRe = /<script>window\.LIB=(\[.*?\]);<\/script>/s;
for (const c of CAT) {
  const ab = c.abbr, file = `${ab}.html`;
  let h = fs.readFileSync(A(file), "utf8");
  let LIB;
  if (libRe.test(h)) LIB = JSON.parse(h.match(libRe)[1]);
  else LIB = runJS(`assets/lib_${ab}.js`).LIB;

  const TR = runJS(`assets/tr_${ab}.js`).TR[ab] || {};
  for (const b of LIB) {
    b.trs = ["svd", "kjv"].filter(k => TR[k]);       // which translations exist (no need to load tr_ to know)
    b.dia = !!TR.svdD;                                // Van Dyck with diacritics available
    const K = TR.svdK || {};                          // Van Dyck keyword titles, small: bake them in
    for (const d of b.verses) { const a = K[d.c + ":" + d.v]; if (a) d.groups.forEach((g, i) => { if (a[i]) g.s = a[i]; }); }
  }
  fs.writeFileSync(A(`assets/lib_${ab}.js`), "window.LIB=" + J(LIB) + ";\n");

  h = h.replace(catRe, "")
       .replace(libRe, "")
       .replace(/<script src="assets\/tx_alab\.js"><\/script>\s*/g, "")
       .replace(/<script src="assets\/tr_[^"]+\.js"><\/script>\s*/g, "")
       .replace(/<script src="assets\/(catalog|lib_[^"]+)\.js[^"]*"><\/script>\s*/g, "")
       .replace(/<script src="assets\/app\.js[^"]*"><\/script>/,
         `<script src="assets/catalog.js?v=${VER}"></script>\n<script src="assets/lib_${ab}.js?v=${VER}"></script>\n<script src="assets/app.js?v=${VER}"></script>`)
       .replace(/\n{3,}/g, "\n\n");
  fs.writeFileSync(A(file), h);
}
console.log("done:", CAT.length, "books");
