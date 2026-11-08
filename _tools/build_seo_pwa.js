/* Phase 2 + 3 build — search engines, link previews, installable app, offline.
   Run from anywhere:  node _tools/build_seo_pwa.js
   Re-run after ANY change to the site (data, app.js, style.css, images): it refreshes sw.js
   so visitors' browsers pick up exactly the files that changed.
   Safe to re-run: everything it writes into pages sits between <!--seo-->…<!--/seo--> / <!--pre-->…<!--/pre--> markers.
   Needs assets/og/*.jpg and assets/brand/maskable-*.png from make_og_images.js (run that when the brand or book list changes).
   سريع افتراضيًا: لا يعيد كتابة ملف لم يتغير محتواه، ولا يعيد بناء جزء لم تتغير مصادره (_tools/.stamps.json)،
   ولا يفحص الصور (img/web) ولا الملفات التي يولّدها بنفسه إلا الجديد منها (الأسماء تُقرأ دائمًا، فالصور المضافة أو المحذوفة تُكتشف).
   استخدم  node _tools/build_seo_pwa.js --full  بعد تعديل صورة موجودة بنفس اسمها، أو إن شككت في أي نتيجة (يعيد كل شيء من الصفر). */
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const M = require("./site_meta.js");
const { ROOT, BASE, SITE, TAGLINE, esc, n, nk } = M;
const A = p => path.join(ROOT, p);
const FULL = process.argv.includes("--full");
const TOUCHED = new Set();                               // files this run actually rewrote
const read = p => fs.readFileSync(A(p), "utf8"), write = (p, s) => { try { if (fs.readFileSync(A(p), "utf8") === s) return; } catch (e) {} TOUCHED.add(p); const f = A(p), t = f + ".~tmp"; for (let i = 0; ; i++) { try { fs.writeFileSync(t, s); fs.renameSync(t, f); return; } catch (e) { if (!["EINVAL","EBUSY","EPERM","EACCES"].includes(e.code) || i > 20) throw e; Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 700); } } };
/* stamps: a step is skipped when its source files have the same size+mtime as last time (saved right away, so a cut-off run keeps its progress) */
const ST_FILE = path.join(__dirname, ".stamps.json"); let STAMPS = {}; try { if (!FULL) STAMPS = JSON.parse(fs.readFileSync(ST_FILE, "utf8")); } catch (e) {}
const STATC = {};                                       // assets/lib_*.js مش بيتغيّروا أثناء البناء: نسألهم عن حجمهم وتاريخهم مرة واحدة بس
const statOf = f => /^assets\/lib_/.test(f) ? (STATC[f] || (STATC[f] = fs.statSync(A(f)))) : fs.statSync(A(f));
const sig = files => files.map(f => { try { const st = statOf(f); return st.size + ":" + Math.round(st.mtimeMs); } catch (e) { return "-"; } }).join("|");
const fresh = (key, files) => STAMPS[key] === sig(files);
const stampSave = (key, files) => { STAMPS[key] = sig(files); try { fs.writeFileSync(ST_FILE, JSON.stringify(STAMPS)); } catch (e) {} };
const SELF = ["_tools/build_seo_pwa.js", "_tools/site_meta.js", "assets/catalog.js"];
const hashOf = p => crypto.createHash("sha1").update(fs.readFileSync(A(p))).digest("hex").slice(0, 8);
/* app.js and style.css versions follow their content, so browsers never reuse a stale copy after a change */
const CSS_VER = hashOf("assets/style.css"), BRAND_VER = "3", APP_VER = hashOf("assets/app.js");
const CAT = M.catalog();
const today = new Date().toISOString().slice(0, 10);
const BASE_PATH = new URL(BASE).pathname;               // "/TSK/"

/* ---------- الشواهد مقسّمة بالأصحاح ----------
   assets/lib_<سفر>.js يفضل هو المصدر (أدوات البناء بتقراه زي ما هو). للأسفار اللي هنا، صفحة السفر تحمّل
   assets/lib/<سفر>/index.js (هيكل صغير) وملف لكل أصحاح وقت الحاجة. التقسيم بيتعاد بس للسفر اللي ملفه اتغيّر.
   للتأكد إن الملفات المقسّمة تطابق الأصل حرف بحرف:  node _tools/verify_split.js --all */
const SPLIT_BOOKS = new Set(CAT.map(c => c.abbr));      // كل الأسفار الـ٦٦ (التجربة كانت على أفسس والمزامير)
const { splitBook } = require("./split_lib.js");
const splitOn = c => SPLIT_BOOKS.has(c.abbr);
/* على قرص بطيء كل سؤال عن ملف بياخد وقت، فالتقسيم بيتعاد بس لما حجم/تاريخ lib_<سفر>.js يتغيّر (مسجّل في .stamps.json) */
for (const c of CAT.filter(splitOn)) {
  const key = "split:" + c.abbr, src = [`assets/lib_${c.abbr}.js`];
  if (fresh(key, src)) continue;
  const r = splitBook(ROOT, c.abbr, { force: true });
  if (r.chapters !== c.nc) throw new Error(`split ${c.abbr}: ${r.chapters} أصحاح في lib_ لكن الفهرس فيه ${c.nc}`);
  r.files.forEach(f => TOUCHED.add(f.split(path.sep).join("/")));
  if (r.files.length) console.log(`split: ${c.abbr} → assets/lib/${c.abbr}/ (${r.files.length} ملف اتكتب)`);
  STAMPS["splitv:" + c.abbr] = hashOf(`assets/lib/${c.abbr}/index.js`);   // رقم إصدار الهيكل = بصمة محتواه (بيتحسب مرة وقت التقسيم بس)
  stampSave(key, src);
}
const libVer = c => { const k = "splitv:" + c.abbr; if (!STAMPS[k]) { STAMPS[k] = hashOf(`assets/lib/${c.abbr}/index.js`); try { fs.writeFileSync(ST_FILE, JSON.stringify(STAMPS)); } catch (e) {} } return STAMPS[k]; };
const LIBTAG = c => splitOn(c) ? `<script src="assets/lib/${c.abbr}/index.js?v=${libVer(c)}"></script>` : null;

/* ---------- per-page meta ---------- */
const TOOLS = {
  "index.html":   { title: `${SITE} — ${TAGLINE}`, desc: M.SITE_DESC, sitemap: 1 },
  "search.html":  { title: "البحث في الكتاب المقدس — جدد وعتقاء", desc: "ابحث في الكتاب المقدس من خانة واحدة: بكلمة أو عبارة في فاندايك وكتاب الحياة وKJV، أو بالجذر العربي وأصله العبري واليوناني، أو برقم سترونج، أو بحسب القواعد النحوية في اللغات الأصلية.", sitemap: 1 },
  "features.html":{ title: "إمكانيات الموقع — جدد وعتقاء", desc: "كل أدوات «جدد وعتقاء» لدراسة الكتاب المقدس بالعربية: الشواهد المتقاطعة، وقاموس سترونج وBDB وأبوت-سميث بالعربية، والبحث، والخرائط، والعرض في الخدمة، والقراءة الزمنية، والأسئلة الشائعة.", sitemap: 1 },
  "topics.html":  { desc: "فهرس مواضيع الكتاب المقدس بالعربية: أكثر من ٤٦ ألف موضوع من فهارس Nave وTorrey، لكل موضوع مواضعه في الأسفار ونصوصها.", sitemap: 1 },
  "lists.html":   { desc: "قوائمي: اجمع الآيات ومداخل قواميس سترونج وBDB وأبوت-سميث في قوائم حسب الموضوع، وأضف شرحك بين العناصر، ثم انسخ القائمة إلى Word أو ملف نصي." },
  "dictcopy.html":{ desc: "انتقلت إلى قوائمي." },
  "copy.html":    { desc: "انتقلت إلى قوائمي." },
  "compare.html": { desc: "قارن نص أي أصحاح في ثلاث ترجمات جنبًا إلى جنب: كتاب الحياة وفاندايك وKJV.", sitemap: 1 },
  "outline.html": { desc: "مخطط تفصيلي لكل سفر من أسفار الكتاب المقدس بالعربية والإنجليزية مع الأعداد.", sitemap: 1 },
  "mindmap.html": { desc: "خريطة ذهنية تفاعلية لشواهد كل كلمة في الكتاب المقدس من «كنز معرفة الكتاب المقدس» (TSK).", sitemap: 1 },
  "chrono.html":  { desc: "خطة لقراءة الكتاب المقدس كله في ٣٦٥ يومًا بترتيب حدوث الأحداث، مع عنوان وعصر وسنة تقريبية لكل يوم، ويُحفظ التقدم على جهازك.", sitemap: 1 },
  "timeline.html":{ desc: "خط زمني لأحداث الكتاب المقدس من الخليقة إلى عصر الرسل في عشرة عصور، مع أحداث العالم في نفس الوقت والشواهد والأشخاص والأماكن، بالتأريخ الشائع وتأريخ Jones.", sitemap: 1 },
  "sources.html": { desc: "مصادر المكتبة ومراجعها: النصوص والترجمات والشواهد وقواميس سترونج وBDB وأبوت-سميث، وبيانات الخرائط والخط الزمني، ومصادر التدقيق، مع ترخيص كل مصدر وحقوق Biblica لكتاب الحياة.", sitemap: 1 },
  "screen.html":  { desc: "شاشة العرض الخارجية للمكتبة: تُفتح من صفحة الأصحاح لعرض الآيات بملء الشاشة على بروجكتور أو تلفزيون." },
  "contact.html": { desc: "تواصل مع «جدد وعتقاء»: أبلغ عن خطأ في آية أو في مدخل قاموس، أو أرسل اقتراحًا أو سؤالًا، من خلال نموذج بسيط لا يحتاج إلى تسجيل.", sitemap: 1 },
  "notes.html":   { desc: "ملاحظات على الفروق بين الترجمات العربية والإنجليزية في المكتبة، خصوصًا ما سببه اختلاف النص اليوناني الذي بُنيت عليه كل ترجمة، سفرًا سفرًا.", sitemap: 1 },
};

function headBlock(o) {
  const img = BASE + o.og, t = esc(o.ogTitle || o.title), d = esc(o.desc);
  return `<!--seo-->
<meta name="description" content="${d}">
<link rel="canonical" href="${o.url}">
<link rel="manifest" href="manifest.webmanifest">
<meta property="og:site_name" content="${SITE}">
<meta property="og:locale" content="ar_AR">
<meta property="og:type" content="${o.type || "website"}">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:url" content="${o.url}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${t}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${img}">
${o.ld ? `<script type="application/ld+json">${JSON.stringify(o.ld)}</script>\n` : ""}<!--/seo-->
`;
}
function applyHead(h, o) {
  h = h.replace(/<!--seo-->[\s\S]*?<!--\/seo-->\n?/, "");
  if (o.title) h = h.replace(/<title>[^<]*<\/title>/, `<title>${esc(o.title)}</title>`);
  h = h.replace(/assets\/style\.css(\?v=[0-9a-z]+)?"/g, `assets/style.css?v=${CSS_VER}"`)
       .replace(/assets\/brand\.js(\?v=[0-9a-z]+)?"/g, `assets/brand.js?v=${BRAND_VER}"`)
       .replace(/assets\/app\.js(\?v=[0-9a-z]+)?"/g, `assets/app.js?v=${APP_VER}"`);
  const i = h.indexOf("</head>");
  return h.slice(0, i) + headBlock(o) + h.slice(i);
}
const setInner = (h, open, html) => {          // fill <main id="main"> / #booksel with crawlable HTML (JS replaces it on load)
  const re = new RegExp("(" + open.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")(?:<!--pre-->[\\s\\S]*?<!--/pre-->)?");
  return h.replace(re, `$1<!--pre-->${html}<!--/pre-->`);
};

/* ---------- static (pre-rendered) HTML ---------- */
const bookLink = c => `<a href="${c.abbr}.html#/${c.abbr}">${M.AR[c.abbr]}</a>`;
const groupedLinks = () => M.BKGRP.map(([t, a, z]) =>
  `<details class="bkg" open><summary>${t}</summary><div class="bkl">${CAT.filter(c => c.id >= a && c.id <= z).map(bookLink).join(" ")}</div></details>`).join("");
const SIDEBAR = groupedLinks();

function bookPre(c, LIB) {
  const g = M.BKGRP.find(x => c.id >= x[1] && c.id <= x[2]);
  let SVD = {}; try { SVD = M.runJS(`assets/tx/svd_${c.abbr}.js`).TXB["svd/" + c.abbr] || {}; } catch (e) {}
  const vs = LIB[0].verses.map(d => Object.assign({}, d, { text: SVD[d.c + ":" + d.v] || d.text })), chs = [...new Set(vs.map(d => d.c))];
  const body = chs.map(ch => `<section><h2>${M.AR[c.abbr]} ${n(ch)}</h2><p>${vs.filter(d => d.c === ch)
    .map(d => `<sup>${n(d.v)}</sup>${esc(d.text)}`).join(" ")}</p></section>`).join("");
  return `<article class="pre"><p class="pre-bc"><a href="index.html">${SITE}</a> ‹ ${g ? g[0] : ""}</p>` +
    `<h1>${M.fullName(c)}</h1><p class="pre-desc">${esc(M.bookDesc(c))}</p>` +
    `<nav class="pre-ch" aria-label="الأصحاحات">${chs.map(ch => `<a href="#/${c.abbr}/ch/${ch}">${n(ch)}</a>`).join("")}</nav>${body}` +
    `<p class="pre-src">نص الآيات من ترجمة فاندايك، والشواهد من «كنز معرفة الكتاب المقدس» (TSK).</p></article>`;
}
const indexPre = () => `<article class="pre"><h1>${SITE} — ${TAGLINE}</h1><p class="pre-desc">${esc(M.SITE_DESC)}</p>` +
  `<nav class="pre-books">${groupedLinks()}</nav>` +
  `<p><a href="search.html">البحث في الكتاب المقدس</a> · <a href="topics.html">فهرس المواضيع</a></p></article>`;

/* ---------- pages ---------- */
const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith(".html") && !["404.html", "offline.html"].includes(f) && !/(_test\.html|^test_)/i.test(f));
const sitemap = [];
for (const f of htmlFiles) {
  let h = read(f);
  const c = CAT.find(x => x.abbr + ".html" === f);
  if (c) {
    const PS = [...SELF, `assets/lib_${c.abbr}.js`, `assets/tx/svd_${c.abbr}.js`], keep = fresh("pre:" + c.abbr, PS) && h.includes('<article class="pre">');
    const g = M.BKGRP.find(x => c.id >= x[1] && c.id <= x[2]);
    h = applyHead(h, {
      title: M.bookTitle(c), ogTitle: `${M.fullName(c)} — ${SITE}`, desc: M.bookDesc(c),
      url: BASE + f, og: `assets/og/${c.abbr}.jpg`, type: "article",
      ld: { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE, item: BASE },
        { "@type": "ListItem", position: 2, name: g ? g[0] : "", item: BASE + "index.html" },
        { "@type": "ListItem", position: 3, name: M.fullName(c), item: BASE + f }] } });
    if (!keep) { h = setInner(h, '<main id="main">', bookPre(c, M.runJS(`assets/lib_${c.abbr}.js`).LIB)); stampSave("pre:" + c.abbr, PS); }
    if (!h.includes(`assets/tx/svd_${c.abbr}.js`)) h = h.replace(new RegExp(`(<script src="assets/lib_${c.abbr}\\.js[^"]*"></script>)`), `$1\n<script src="assets/tx/svd_${c.abbr}.js"></script>`);
    if (splitOn(c)) {                                      // هيكل السفر بدل الملف الكامل + الشعار (فاتح/داكن) يتحمّل للوضع الظاهر بس
      h = h.replace(new RegExp(`<script src="assets/lib(?:_${c.abbr}|/${c.abbr}/index)\\.js[^"]*"></script>`), LIBTAG(c));
      h = h.replace(/(<img class="logo logo-[ld]" src="assets\/brand\/logo-horizontal-(?:light|dark)\.svg")(?! loading=)/g, '$1 loading="lazy"');
    }
    h = setInner(h, '<div class="booksel" id="booksel">', SIDEBAR);
    sitemap.push([BASE + f, "0.8"]);
  } else {
    const t = TOOLS[f] || { desc: M.SITE_DESC };
    const title = t.title || (h.match(/<title>([^<]*)<\/title>/) || [, SITE])[1];
    const o = { title: t.title, ogTitle: title, desc: t.desc, url: f === "index.html" ? BASE : BASE + f, og: "assets/og/site.jpg" };
    if (f === "index.html") {
      o.ld = { "@context": "https://schema.org", "@type": "WebSite", name: SITE, alternateName: `${SITE} — ${TAGLINE}`, url: BASE, inLanguage: "ar",
        description: M.SITE_DESC, potentialAction: { "@type": "SearchAction", target: BASE + "search.html?q={search_term_string}", "query-input": "required name=search_term_string" } };
      h = setInner(h, '<main id="main">', indexPre());
      h = setInner(h, '<div class="booksel" id="booksel">', SIDEBAR);
    }
    h = applyHead(h, o);
    if (t.sitemap) sitemap.push([o.url, f === "index.html" ? "1.0" : "0.6"]);
  }
  write(f, h);
}

/* ---------- styles for the pre-rendered text (shown until the app takes over, or without JavaScript) ---------- */
let css = read("assets/style.css").replace(/\n?\/\* pre:start[\s\S]*?\/\* pre:end \*\/\n?/, "");
css += `
/* pre:start — نص مكتوب مسبقًا في الصفحة لمحركات البحث (يستبدله التطبيق فور تحميله) */
.pre{max-width:820px;margin:0 auto;padding:28px 20px 60px;line-height:2.1;color:var(--ink)}
.pre h1{font-family:"El Messiri",serif;color:var(--heading);font-size:2rem;margin:.2em 0 .3em}
.pre h2{font-family:"El Messiri",serif;color:var(--heading);font-size:1.25rem;margin:1.6em 0 .3em}
.pre .pre-bc,.pre .pre-src{color:var(--muted);font-size:.9rem}
.pre .pre-desc{color:var(--muted)}
.pre sup{color:var(--gold);font-size:.7em;margin-inline:3px 2px}
.pre .pre-ch{display:flex;flex-wrap:wrap;gap:6px;margin:14px 0}
.pre .pre-ch a,.pre .pre-books a{display:inline-block;padding:2px 10px;border:1px solid var(--line);border-radius:8px;color:var(--accent);text-decoration:none}
.pre .pre-books summary{font-weight:600;margin-top:10px}
.txna{color:var(--muted);font-size:.85em;font-style:italic}
/* pre:end */
`;
write("assets/style.css", css);

/* ---------- mind map: assets/mm_data.js (the source the review tools edit) → one small file per chapter ----------
   mindmap.html loads assets/mm/idx.js (which verses exist + verse-range ends) and then only the chapters a map needs
   (assets/mm/<Book>_<chapter>.js: cross-references R, Ketab El Hayat text T, Van Dyck text S). Files are rewritten only when they change. */
(function () {
  if (!fs.existsSync(A("assets/mm_data.js"))) return;
  const SRC = [...SELF, "assets/mm_data.js", ...CAT.map(c => `assets/tx/svd_${c.abbr}.js`)];
  if (fresh("mm", SRC)) { console.log("mind map: unchanged"); return; }
  const MM = M.runJS("assets/mm_data.js").MM, AB = {}; CAT.forEach(c => AB[c.id] = c.abbr);
  const writeIf = (p, s) => { try { if (fs.readFileSync(A(p), "utf8") === s) return 0; } catch (e) {} write(p, s); return 1; };
  const SVD = {}, svdOf = ab => { if (!(ab in SVD)) { try { SVD[ab] = M.runJS(`assets/tx/svd_${ab}.js`).TXB["svd/" + ab] || {}; } catch (e) { SVD[ab] = {}; } } return SVD[ab]; };
  const dec = id => [Math.floor(id / 1e6), Math.floor(id % 1e6 / 1e3), id % 1e3];
  const CH = {}, I = {};
  const ch = id => { const [b, c] = dec(+id), k = AB[b] + "_" + c; return CH[k] = CH[k] || { R: {}, T: {}, S: {} }; };
  for (const id in MM.R) { ch(id).R[id] = MM.R[id]; const [b, c, v] = dec(+id); ((I[b] = I[b] || {})[c] = I[b][c] || []).push(v); }
  for (const id in MM.T) ch(id).T[id] = MM.T[id];
  for (const k in CH) { const ab = k.split("_")[0], s = svdOf(ab), d = CH[k];
    for (const id of new Set([...Object.keys(d.R), ...Object.keys(d.T)])) { const [, c, v] = dec(+id), t = s[c + ":" + v]; if (t) d.S[id] = t; } }
  Object.values(I).forEach(o => Object.values(o).forEach(a => a.sort((x, y) => x - y)));
  fs.mkdirSync(A("assets/mm"), { recursive: true });
  let changed = writeIf("assets/mm/idx.js", "window.MMI=" + JSON.stringify({ I, E: MM.E, C: Object.keys(CH) }) + ";\n");
  for (const k in CH) changed += writeIf(`assets/mm/${k}.js`, `MMC(${JSON.stringify(k)},${JSON.stringify(CH[k])});\n`);
  console.log(`mind map: ${Object.keys(CH).length} chapter files (${changed} updated)`);
  stampSave("mm", SRC);
})();

/* ---------- Strong's page: assets/strong.js + assets/sidx.js (the sources other pages and the review tools use) → small chunks ----------
   assets/strong/<G|H><n÷100>.js holds, for 100 numbers, the dictionary entry (e) and where the word occurs (o: [book, chapter, verse, "word|word"],
   in Bible order). search.html (tab=strong) loads only the chunk it needs and shows the verse text from assets/tx/alab_<Book>.js. Rewritten only on change. */
(function () {
  if (!fs.existsSync(A("assets/strong.js")) || !fs.existsSync(A("assets/sidx.js"))) return;
  const SRC = [...SELF, "assets/strong.js", "assets/sidx.js"];
  if (fresh("strong", SRC)) { console.log("strong: unchanged"); return; }
  const STRONG = M.runJS("assets/strong.js").STRONG, SIDX = M.runJS("assets/sidx.js").SIDX;
  const writeIf = (p, s) => { try { if (fs.readFileSync(A(p), "utf8") === s) return 0; } catch (e) {} write(p, s); return 1; };
  const ORD = {}; CAT.forEach(c => ORD[c.abbr] = c.id);
  const rows = SIDX.filter(r => r[4]).sort((a, b) => (ORD[a[0]] - ORD[b[0]]) || (a[1] - b[1]) || (a[2] - b[2]));
  const OCC = {};
  for (const r of rows) { const by = {};
    for (const [w, ns] of r[4]) for (const x of ns) (by[x] = by[x] || []).push(w);
    for (const x in by) (OCC[x] = OCC[x] || []).push([r[0], r[1], r[2], by[x].join("|")]); }
  const CH = {}, key = num => num[0] + Math.floor(+num.slice(1) / 100);
  for (const num of new Set([...Object.keys(STRONG), ...Object.keys(OCC)])) { if (!/^[GH]\d+$/.test(num)) continue;
    (CH[key(num)] = CH[key(num)] || {})[num] = { e: STRONG[num] || null, o: OCC[num] || [] }; }
  fs.mkdirSync(A("assets/strong"), { recursive: true });
  let changed = 0;
  for (const k in CH) changed += writeIf(`assets/strong/${k}.js`, `STRC(${JSON.stringify(k)},${JSON.stringify(CH[k])});\n`);
  /* assets/strong/e/<k>.js: نفس التقسيم لكن المداخل فقط (بدون مواضع الورود) — لنافذة سترونج الصغيرة في عرض الأصحاح (assets/chstrong.js) */
  fs.mkdirSync(A("assets/strong/e"), { recursive: true });
  let changedE = 0;
  for (const k in CH) { const E = {}; for (const num in CH[k]) if (CH[k][num].e) E[num] = CH[k][num].e;
    changedE += writeIf(`assets/strong/e/${k}.js`, `STRE(${JSON.stringify(k)},${JSON.stringify(E)});\n`); }
  console.log(`strong: ${Object.keys(CH).length} chunk files (${changed} updated) + entries-only chunks (${changedE} updated)`);
  stampSave("strong", SRC);
})();

/* ---------- أرقام سترونج في عرض الأصحاح: assets/tr_<Book>.js (الملف الكامل: فاندايك + KJV + الأرقام + التشكيل) → assets/sg/svd_<Book>.js ----------
   أرقام سترونج على كلمات فاندايك فقط (svdS)، مضغوطة: لكل عدد قائمة، النص بلا رقم "نص" والكلمة برقمها ["كلمة","H1 H2"].
   صفحة الأصحاح تحمّله فقط لما القارئ يشغّل «أرقام سترونج» (بدل tr_<Book>.js الكامل). يُعاد كتابته عند التغيير فقط. */
(function () {
  const writeIf = (p, s) => { try { if (fs.readFileSync(A(p), "utf8") === s) return 0; } catch (e) {} write(p, s); return 1; };
  fs.mkdirSync(A("assets/sg"), { recursive: true });
  let books = 0, changed = 0;
  for (const c of CAT) {
    const f = `assets/tr_${c.abbr}.js`; if (!fs.existsSync(A(f))) continue;
    const SRC = [...SELF, f]; if (fresh("sg:" + c.abbr, SRC) && fs.existsSync(A(`assets/sg/svd_${c.abbr}.js`))) { books++; continue; }
    const T = M.runJS(f).TR, S = T && T[c.abbr] && T[c.abbr].svdS; if (!S) continue;
    const out = {};
    for (const k in S) { const a = [];
      for (const [t, ns] of S[k]) { if (ns && ns.length) a.push([t, ns.join(" ")]); else if (typeof a[a.length - 1] === "string") a[a.length - 1] += t; else a.push(t); }
      out[k] = a; }
    books++; changed += writeIf(`assets/sg/svd_${c.abbr}.js`, `window.SG=window.SG||{};SG[${JSON.stringify("svd/" + c.abbr)}]=${JSON.stringify(out)};\n`);
    stampSave("sg:" + c.abbr, SRC);
  }
  console.log(`chapter Strong (Van Dyck): ${books} book files (${changed} updated)`);
})();

/* ---------- robots / sitemap ---------- */
write("robots.txt", `User-agent: *\nAllow: /\nDisallow: ${BASE_PATH}_tools/\n\nSitemap: ${BASE}sitemap.xml\n`);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  sitemap.map(([u, p]) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod><priority>${p}</priority></url>`).join("\n") + "\n</urlset>\n");

/* ---------- 404 + offline pages (self-contained styles) ---------- */
const miniPage = (title, body, base) => `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} — ${SITE}</title>
${base ? `<base href="${base}">\n` : ""}<link rel="icon" href="assets/brand/favicon.ico" sizes="any">
<link rel="icon" href="assets/brand/mark-micro.svg" type="image/svg+xml">
<meta name="theme-color" content="#FAF8F2" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0B1E30" media="(prefers-color-scheme: dark)">
<style>
:root{--bg:#FAF8F2;--paper:#fff;--ink:#253342;--muted:#4E6684;--line:#E6DFCF;--accent:#0F3554;--gold:#8A6420}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#0B1E30;--paper:#12293F;--ink:#E8E4D8;--muted:#A9B4C2;--line:#24425F;--accent:#8DB9E0;--gold:#D4A64A}}
:root[data-theme=dark]{--bg:#0B1E30;--paper:#12293F;--ink:#E8E4D8;--muted:#A9B4C2;--line:#24425F;--accent:#8DB9E0;--gold:#D4A64A}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.9 "IBM Plex Sans Arabic",Tahoma,sans-serif}
main{max-width:620px;margin:0 auto;padding:48px 16px;text-align:center}
.logo{height:150px;width:auto}.logo-d{display:none}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .logo-l{display:none}:root:not([data-theme=light]) .logo-d{display:inline}}
:root[data-theme=dark] .logo-l{display:none}:root[data-theme=dark] .logo-d{display:inline}
h1{font-family:"El Messiri",serif;color:var(--accent);font-size:1.7rem;margin:18px 0 6px}
p{color:var(--muted);margin:6px 0}
.btns{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:26px 0}
.btns a{padding:9px 18px;border-radius:10px;border:1px solid var(--line);background:var(--paper);color:var(--accent);text-decoration:none;font-weight:600}
.btns a.main{background:var(--accent);color:var(--bg);border-color:var(--accent)}
#saved{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:10px}
#saved a{padding:3px 12px;border:1px solid var(--line);border-radius:8px;color:var(--accent);text-decoration:none;background:var(--paper)}
</style>
<script>try{var t=JSON.parse(localStorage.getItem("tsklib:theme"));if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}</script>
</head>
<body><main>
<img class="logo logo-l" src="assets/brand/logo-stacked-light.svg" alt="${SITE} — ${TAGLINE}" width="209" height="150"><img class="logo logo-d" src="assets/brand/logo-stacked-dark.svg" alt="" width="209" height="150">
${body}
</main></body></html>
`;
write("404.html", miniPage("الصفحة غير موجودة", `<h1>الصفحة غير موجودة</h1>
<p>ربما تغيّر عنوان الصفحة أو كُتب الرابط بشكل غير صحيح.</p>
<div class="btns"><a class="main" href="index.html">المكتبة</a><a href="search.html">البحث في الكتاب المقدس</a><a href="topics.html">فهرس المواضيع</a></div>`, BASE_PATH));

const AR_JSON = JSON.stringify(Object.fromEntries(CAT.map(c => [c.abbr, M.AR[c.abbr]])));
write("offline.html", miniPage("غير متصل", `<h1>أنت غير متصل بالإنترنت</h1>
<p>هذه الصفحة لم تُحفظ على جهازك بعد. كل سفر تفتحه وأنت متصل يُحفظ تلقائيًا للقراءة لاحقًا دون إنترنت.</p>
<div class="btns"><a class="main" href="index.html">المكتبة</a><a href="javascript:location.reload()">إعادة المحاولة</a></div>
<p id="savedT" hidden>الأسفار المحفوظة على هذا الجهاز:</p><div id="saved"></div>
<script>(async()=>{try{const AR=${AR_JSON};const c=await caches.open("jw-files");const ks=await c.keys();
const got=Object.keys(AR).filter(a=>ks.some(k=>new URL(k.url).pathname.endsWith("/"+a+".html")));
if(got.length){document.getElementById("savedT").hidden=false;document.getElementById("saved").innerHTML=got.map(a=>'<a href="'+a+'.html#/'+a+'">'+AR[a]+'</a>').join("")}}catch(e){}})()</script>`));

/* ---------- web app manifest ---------- */
write("manifest.webmanifest", JSON.stringify({
  name: `${SITE} — ${TAGLINE}`, short_name: SITE, description: M.SITE_DESC,
  lang: "ar", dir: "rtl", start_url: "./index.html", scope: "./", display: "standalone",
  background_color: "#FAF8F2", theme_color: "#0B1E30",
  icons: [
    { src: "assets/brand/app-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "assets/brand/app-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "assets/brand/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
    { src: "assets/brand/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }],
  shortcuts: [
    { name: "البحث في الكتاب المقدس", short_name: "البحث", url: "search.html" },
    { name: "فهرس المواضيع", short_name: "المواضيع", url: "topics.html" },
    { name: "قاموس سترونج", short_name: "سترونج", url: "search.html#tab=strong" }]
}, null, 1) + "\n");

/* ---------- service worker registration (in brand.js, loaded by every page) ---------- */
let bj = read("assets/brand.js").replace(/\n?\/\* sw:start[\s\S]*?\/\* sw:end \*\/\n?/, "");
bj += `
/* sw:start — حفظ الموقع للعمل دون إنترنت (assets/../sw.js) */
(function(){
  if(!("serviceWorker" in navigator)||!/^https?:$/.test(location.protocol))return;
  var had=!!navigator.serviceWorker.controller,done=false;
  navigator.serviceWorker.addEventListener("controllerchange",function(){if(had&&!done){done=true;location.reload()}});
  addEventListener("load",function(){navigator.serviceWorker.register("sw.js",{updateViaCache:"none"}).catch(function(){})});
})();
/* sw:end */
`;
write("assets/brand.js", bj);

/* backups, raw sources, tests and the 11 legacy per-book folders (pre-flattening) are not part of the published site */
const SKIP_DIR = new Set(["_tools", ".git", "node_modules", ".vscode", "backup", "Bibles", "geo_test",
  "1Jo", "1Pe", "1Th", "2Jo", "2Pe", "3Jo", "Col", "Heb", "Jam", "Jud", "Rev"]);
const SKIP_FILE = p => /(^|\/)([^/]*_test\.html|test_[^/]*)$|\.bak$/i.test(p) || p === "assets/mm_data.js";
const OK_EXT = /\.(html|js|css|svg|png|jpe?g|webp|ico|webmanifest|woff2?)$/i;
/* the published files, listed once (names only — reading a folder is fast; asking each file for its size/date is what is slow) */
const PUB = [];
(function walk(dir) {
  for (const e of fs.readdirSync(A(dir), { withFileTypes: true })) {
    const p = dir ? dir + "/" + e.name : e.name;
    if (e.isDirectory() && p === "assets/lib") {           // ملفات الأصحاحات معروفة من الفهرس (عدد الأصحاحات)؛ مفيش داعي نقرا ٦٦ مجلد
      for (const c of CAT) { const d = "assets/lib/" + c.abbr;
        if (splitOn(c)) { PUB.push(d + "/index.js"); for (let i = 1; i <= c.nc; i++) PUB.push(`${d}/${i}.js`); } }
      continue; }
    if (e.isDirectory()) { if (!SKIP_DIR.has(e.name) && !e.name.startsWith("_") && !(dir === "img" && e.name !== "web")) walk(p); continue; }
    if (p === "sw.js" || !OK_EXT.test(p) || dir === "img" || SKIP_FILE(p)) continue;
    { const m = p.match(/^assets\/lib_([1-3]?[A-Za-z]+)\.js$/); if (m && SPLIT_BOOKS.has(m[1])) continue; }   // مصدر التقسيم؛ الصفحة بتستخدم assets/lib/<سفر>/      // img/*.jpg originals are not published (only img/web)
    PUB.push(p);
  }
})("");
/* size+date of a file. Images and the folders this script generates itself are trusted from last run's cache unless this run rewrote them
   (or --full): those are thousands of files, and checking each one is what made the build take minutes. */
const FAST = /^(img\/web|assets\/(mm|strong|strong\/e|sg|lib\/[^/]+))\/[^/]+$/;
let PREV = {}; try { if (!FULL) PREV = JSON.parse(fs.readFileSync(path.join(__dirname, ".hashcache.json"), "utf8")); } catch (e) {}
const CK = {};
const ckOf = p => { if (CK[p]) return CK[p];
  if (!FULL && FAST.test(p) && !TOUCHED.has(p) && PREV[p]) return CK[p] = PREV[p][0];
  const st = fs.statSync(A(p)); return CK[p] = st.size + ":" + Math.round(st.mtimeMs); };
/* ---------- assets/offline.json: packages the user can download for offline use (sizes = what is sent over the wire) ---------- */
(function () {
  const zlib = require("zlib");
  const GROUPS = [
    { id: "core", title: "الأساس: الصفحات والآيات والشواهد", desc: "كل الأسفار بترجمة فاندايك وكتاب الحياة (مع التشكيل) وشواهد TSK ونصوص الشواهد. لا تعمل المكتبة دون اتصال بدونها.", req: 1,
      test: p => /\.html$/.test(p) || /^assets\/(lib|kd|fn|ol)_/.test(p) || /^assets\/lib\//.test(p) || /^assets\/tx\//.test(p) || /^assets\/(brand|votd)\//.test(p) || /^assets\/(app|style|catalog|brand|bookimg|imgs|home_votd|askai|offline|nav|sitemenu|dictcopy|chstrong|present|presfit|listpres|screenctl)\.(js|css)$/.test(p) || /^assets\/geo\/(geo|leaflet)\.(js|css)$/.test(p) || /^assets\/chrono\//.test(p) || p === "manifest.webmanifest" },
    { id: "tr", title: "فاندايك بأرقام سترونج والتشكيل، وKJV", desc: "أرقام سترونج وتشكيل فاندايك، وترجمة KJV الإنجليزية، لكل الأسفار.", test: p => /^assets\/tr_/.test(p) || /^assets\/sg\//.test(p) },
    { id: "strong", title: "قاموس سترونج", desc: "معاني الأرقام والجذور والبحث بالرقم أو بالكلمة العربية.", test: p => /^assets\/(strong|sidx|roots|arstrong)\.js$/.test(p) || /^assets\/strong\//.test(p) },
    { id: "bdb", title: "قاموس BDB العبري", desc: "معاني الكلمات العبرية من قاموس براون-درايفر-بريجز بالعربية (نسخة مختصرة).", test: p => p === "assets/bdb.js" || /^assets\/bdb\//.test(p) },
    { id: "abbott", title: "قاموس أبوت-سميث اليوناني", desc: "معاني الكلمات اليونانية في العهد الجديد من قاموس أبوت-سميث.", test: p => p === "assets/abbott.js" || /^assets\/abbott\//.test(p) },
    { id: "geo", title: "الأماكن والخرائط", desc: "أماكن الكتاب المقدس وخرائطها لكل سفر.", test: p => /^assets\/geo\/geo_/.test(p) },
    { id: "il", title: "كلمة بكلمة والبحث النحوي", desc: "بيانات Berean بالعبرية واليونانية مع التحليل النحوي.", test: p => /^assets\/(bsb|orig)_/.test(p) },
    { id: "search", title: "البحث في نص الكتاب", desc: "نصوص كاملة للبحث (كتاب الحياة وفاندايك وKJV).", test: p => /^assets\/tx_[a-z]+\.js$/.test(p) },
    { id: "topics", title: "فهرس المواضيع", desc: "٤٦ ألف موضوع مع آياتها.", test: p => /^assets\/tp_/.test(p) },
    { id: "mm", title: "الخريطة الذهنية للشواهد", desc: "بيانات الخريطة الذهنية.", test: p => /^assets\/mm\//.test(p) },
    { id: "img_m", title: "الصور — جودة متوسطة (٨٠٠ بكسل)", desc: "صور الأصحاحات المناسبة للجوال.", test: p => /^img\/web\/.*-800\.webp$/.test(p) },
    { id: "img_h", title: "الصور — جودة عالية (١٦٠٠ بكسل)", desc: "للشاشات الكبيرة؛ تُحمَّل مع المتوسطة للحصول على كل الأحجام.", test: p => /^img\/web\/.*-1600\.webp$/.test(p) }
  ];
  const files = PUB.filter(p => p !== "assets/offline.json");
  const orphans = [];
  const SZ_FILE = path.join(__dirname, ".sizecache.json"); let SZ = {}; try { SZ = JSON.parse(fs.readFileSync(SZ_FILE, "utf8")); } catch (e) {} const SZ2 = {};
  const out = GROUPS.map(g => ({ id: g.id, title: g.title, desc: g.desc, req: g.req ? 1 : 0, files: [], bytes: 0 }));
  for (const p of files) {
    const gi = GROUPS.findIndex(g => g.test(p)); if (gi < 0) { if (!/^assets\/(og)\//.test(p) && !/^img\/web\/.*\.jpe?g$/.test(p) && !/^(offline|sitemap)/.test(p)) orphans.push(p); continue; }
    const txt = /\.(html|js|css|svg|webmanifest)$/i.test(p);
    const ck = ckOf(p);
    let b;
    if (!txt) b = +ck.split(":")[0];
    else if (SZ[p] && SZ[p][0] === ck) b = SZ[p][1];
    else b = zlib.gzipSync(fs.readFileSync(A(p)), { level: 6 }).length;
    SZ2[p] = [ck, b];
    out[gi].files.push(p); out[gi].bytes += b;
  }
  try { fs.writeFileSync(SZ_FILE, JSON.stringify(SZ2)); } catch (e) {}
  write("assets/offline.json", JSON.stringify(out));
  if (orphans.length) {
    const by = {}; orphans.forEach(p => { const k = p.replace(/[0-9]+/g, "#").replace(/(_)[A-Za-z]+(\.)/, "$1*$2"); (by[k] = by[k] || []).push(p); });
    console.log("\n⚠ ملفات ليست ضمن أي حزمة تنزيل (لن تُحمَّل مع «التنزيل للاستخدام دون إنترنت»؛ تُحفظ فقط عند أول زيارة):");
    Object.keys(by).forEach(k => console.log("   " + k + "  ×" + by[k].length + (by[k].length > 1 ? "   مثال: " + by[k][0] : "")));
    console.log("   ← أضف نمطًا مناسبًا في GROUPS داخل _tools/build_seo_pwa.js إن كانت ضرورية للعمل دون إنترنت.\n");
  } else console.log("✓ كل الملفات المنشورة ضمن حزم التنزيل");
})();

/* ---------- sw.js: fingerprint every published file ---------- */
const REV = {};
const HC_FILE = path.join(__dirname, ".hashcache.json");
let HC = {}; try { HC = JSON.parse(fs.readFileSync(HC_FILE, "utf8")); } catch (e) {}
const HC2 = {}; let HASHED = 0;
for (const p of PUB) {
    const ck = ckOf(p), hit = HC[p];       // hash cache: re-hash only files that changed
    if (hit && hit[0] === ck) REV[p] = hit[1];
    else { REV[p] = crypto.createHash("sha1").update(fs.readFileSync(A(p))).digest("hex").slice(0, 10); }
    HC2[p] = [ck, REV[p]];
    if (!hit || hit[0] !== ck) { if (++HASHED % 150 === 0) try { fs.writeFileSync(HC_FILE, JSON.stringify(Object.assign({}, HC, HC2))); } catch (e) {} }
}
try { fs.writeFileSync(HC_FILE, JSON.stringify(HC2)); } catch (e) {}
const SHELL = ["index.html", "offline.html", "manifest.webmanifest", "assets/style.css", "assets/app.js", "assets/catalog.js",
  "assets/brand.js", "assets/bookimg.js", "assets/imgs.js", "assets/brand/favicon.ico", "assets/brand/mark-micro.svg",
  "assets/brand/logo-horizontal-light.svg", "assets/brand/logo-horizontal-dark.svg",
  "assets/brand/logo-stacked-light.svg", "assets/brand/logo-stacked-dark.svg"].filter(p => REV[p]);
write("sw.js", read("_tools/sw.template.js").replace("/*REV*/{}", JSON.stringify(REV)).replace("/*SHELL*/[]", JSON.stringify(SHELL)));

console.log(`pages: ${htmlFiles.length} · sitemap: ${sitemap.length} urls · sw: ${Object.keys(REV).length} files fingerprinted`);
