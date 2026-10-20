/* Phase 2 + 3 build — search engines, link previews, installable app, offline.
   Run from anywhere:  node _tools/build_seo_pwa.js
   Re-run after ANY change to the site (data, app.js, style.css, images): it refreshes sw.js
   so visitors' browsers pick up exactly the files that changed.
   Safe to re-run: everything it writes into pages sits between <!--seo-->…<!--/seo--> / <!--pre-->…<!--/pre--> markers.
   Needs assets/og/*.jpg and assets/brand/maskable-*.png from make_og_images.js (run that when the brand or book list changes). */
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const M = require("./site_meta.js");
const { ROOT, BASE, SITE, TAGLINE, esc, n, nk } = M;
const A = p => path.join(ROOT, p);
const read = p => fs.readFileSync(A(p), "utf8"), write = (p, s) => fs.writeFileSync(A(p), s);
const CSS_VER = "7", BRAND_VER = "2", APP_VER = "4";
const CAT = M.catalog();
const today = new Date().toISOString().slice(0, 10);
const BASE_PATH = new URL(BASE).pathname;               // "/TSK/"

/* ---------- per-page meta ---------- */
const TOOLS = {
  "index.html":   { title: `${SITE} — ${TAGLINE}`, desc: M.SITE_DESC, sitemap: 1 },
  "search.html":  { desc: "ابحث في نص الكتاب المقدس بالعربية (ترجمة فاندايك) بكلمة أو عبارة أو برقم سترونج، مع تجاهل التشكيل والهمزات، في كل الأسفار أو في سفر واحد.", sitemap: 1 },
  "topics.html":  { desc: "فهرس مواضيع الكتاب المقدس بالعربية: أكثر من ٤٦ ألف موضوع من فهارس Nave وTorrey، لكل موضوع مواضعه في الأسفار ونصوصها.", sitemap: 1 },
  "strong.html":  { desc: "قاموس سترونج للكلمات العبرية واليونانية في الكتاب المقدس، بشرح عربي وإنجليزي ونطق كل كلمة، مع الأعداد التي ترد فيها.", sitemap: 1 },
  "compare.html": { desc: "قارن نص أي أصحاح في ثلاث ترجمات جنبًا إلى جنب: كتاب الحياة وفاندايك وKJV." },
  "outline.html": { desc: "مخطط تفصيلي لكل سفر من أسفار الكتاب المقدس بالعربية والإنجليزية مع الأعداد." },
  "mindmap.html": { desc: "خريطة ذهنية تفاعلية لشواهد كل كلمة في الكتاب المقدس من «كنز معرفة الكتاب المقدس» (TSK)." },
  "grammar.html": { desc: "بحث نحوي في كلمات الكتاب المقدس بلغتيه الأصليتين حسب نوع الكلمة وتصريفها." },
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
  h = h.replace(/assets\/style\.css(\?v=\d+)?"/g, `assets/style.css?v=${CSS_VER}"`)
       .replace(/assets\/brand\.js(\?v=\d+)?"/g, `assets/brand.js?v=${BRAND_VER}"`)
       .replace(/assets\/app\.js(\?v=\d+)?"/g, `assets/app.js?v=${APP_VER}"`);
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
  const vs = LIB[0].verses, chs = [...new Set(vs.map(d => d.c))];
  const body = chs.map(ch => `<section><h2>${M.AR[c.abbr]} ${n(ch)}</h2><p>${vs.filter(d => d.c === ch)
    .map(d => `<sup>${n(d.v)}</sup>${esc(d.text)}`).join(" ")}</p></section>`).join("");
  return `<article class="pre"><p class="pre-bc"><a href="index.html">${SITE}</a> ‹ ${g ? g[0] : ""}</p>` +
    `<h1>${M.fullName(c)}</h1><p class="pre-desc">${esc(M.bookDesc(c))}</p>` +
    `<nav class="pre-ch" aria-label="الأصحاحات">${chs.map(ch => `<a href="#/${c.abbr}/ch/${ch}">${n(ch)}</a>`).join("")}</nav>${body}` +
    `<p class="pre-src">نص الآيات من «كتاب الحياة» (ALAB)، والشواهد من «كنز معرفة الكتاب المقدس» (TSK).</p></article>`;
}
const indexPre = () => `<article class="pre"><h1>${SITE} — ${TAGLINE}</h1><p class="pre-desc">${esc(M.SITE_DESC)}</p>` +
  `<nav class="pre-books">${groupedLinks()}</nav>` +
  `<p><a href="search.html">البحث في الكتاب المقدس</a> · <a href="topics.html">فهرس المواضيع</a> · <a href="strong.html">قاموس سترونج</a></p></article>`;

/* ---------- pages ---------- */
const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith(".html") && !["404.html", "offline.html"].includes(f));
const sitemap = [];
for (const f of htmlFiles) {
  let h = read(f);
  const c = CAT.find(x => x.abbr + ".html" === f);
  if (c) {
    const LIB = M.runJS(`assets/lib_${c.abbr}.js`).LIB;
    const g = M.BKGRP.find(x => c.id >= x[1] && c.id <= x[2]);
    h = applyHead(h, {
      title: M.bookTitle(c), ogTitle: `${M.fullName(c)} — ${SITE}`, desc: M.bookDesc(c),
      url: BASE + f, og: `assets/og/${c.abbr}.jpg`, type: "article",
      ld: { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE, item: BASE },
        { "@type": "ListItem", position: 2, name: g ? g[0] : "", item: BASE + "index.html" },
        { "@type": "ListItem", position: 3, name: M.fullName(c), item: BASE + f }] } });
    h = setInner(h, '<main id="main">', bookPre(c, LIB));
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
    { name: "قاموس سترونج", short_name: "سترونج", url: "strong.html" }]
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

/* ---------- sw.js: fingerprint every published file ---------- */
const SKIP_DIR = new Set(["_tools", ".git", "node_modules", ".vscode"]);
const OK_EXT = /\.(html|js|css|svg|png|jpe?g|webp|ico|webmanifest|woff2?)$/i;
const REV = {};
(function walk(dir) {
  for (const e of fs.readdirSync(A(dir), { withFileTypes: true })) {
    const p = dir ? dir + "/" + e.name : e.name;
    if (e.isDirectory()) { if (!SKIP_DIR.has(e.name) && !(dir === "img" && e.name !== "web")) walk(p); continue; }
    if (p === "sw.js" || !OK_EXT.test(p) || dir === "img") continue;      // img/*.jpg originals are not published (only img/web)
    REV[p] = crypto.createHash("sha1").update(fs.readFileSync(A(p))).digest("hex").slice(0, 10);
  }
})("");
const SHELL = ["index.html", "offline.html", "manifest.webmanifest", "assets/style.css", "assets/app.js", "assets/catalog.js",
  "assets/brand.js", "assets/bookimg.js", "assets/imgs.js", "assets/brand/favicon.ico", "assets/brand/mark-micro.svg",
  "assets/brand/logo-horizontal-light.svg", "assets/brand/logo-horizontal-dark.svg",
  "assets/brand/logo-stacked-light.svg", "assets/brand/logo-stacked-dark.svg"].filter(p => REV[p]);
write("sw.js", read("_tools/sw.template.js").replace("/*REV*/{}", JSON.stringify(REV)).replace("/*SHELL*/[]", JSON.stringify(SHELL)));

console.log(`pages: ${htmlFiles.length} · sitemap: ${sitemap.length} urls · sw: ${Object.keys(REV).length} files fingerprinted`);
