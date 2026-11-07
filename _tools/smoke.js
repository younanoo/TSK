/* جدد وعتقاء — smoke test: opens every page type in a headless browser and checks it still works.
   Run after every build:   node _tools/smoke.js
   One-time setup (in the site folder):   npm i -D playwright   then   npx playwright install chromium

   For each page it checks: the main content appears, there are no JavaScript errors, no site file is missing (404),
   and the key buttons/links exist. It serves the site itself on a local port; external requests (Google Fonts…) are
   blocked so the result does not depend on the internet. Exit code 0 = all passed, 1 = something failed.
   Options:  --only=notes   run only checks whose name contains "notes"      --show   open a visible browser */
const http = require("http"), fs = require("fs"), path = require("path");
let chromium;
try { ({ chromium } = require("playwright")); }
catch (e) { console.error("Playwright is not installed. In the site folder run:\n  npm i -D playwright\n  npx playwright install chromium"); process.exit(2); }

const ROOT = path.resolve(__dirname, "..");
const ARGS = process.argv.slice(2), ONLY = (ARGS.find(a => a.startsWith("--only=")) || "").slice(7), SHOW = ARGS.includes("--show");
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".webmanifest": "application/manifest+json" };

/* ---------- the checks: each returns a list of problems (empty = passed). Runs inside the page. ---------- */
const has = (sel, min = 1) => `(document.querySelectorAll(${JSON.stringify(sel)}).length >= ${min} ? "" : "expected ≥${min} × ${sel.replace(/"/g, "'")}, found " + document.querySelectorAll(${JSON.stringify(sel)}).length)`;
const text = (sel, s) => `((document.querySelector(${JSON.stringify(sel)}) || {}).innerText || "").includes(${JSON.stringify(s)}) ? "" : "${sel} does not contain «${s}»"`;
const CHECKS = [
  { name: "home",            url: "index.html",                 expect: [has("#books a", 66), text("body", "آية اليوم")] },
  { name: "book intro",      url: "Phm.html",                   expect: [text("#main", "فليمون")] },
  { name: "chapter",         url: "Gen.html#/Gen/ch/1",         expect: [has(".cvt", 31), text(".cvt", "في البدء خلق الله"), has(".trbar .trb.on")] },
  { name: "chapter (alab)",  url: "Gen.html?tr=alab#/Gen/ch/1", expect: [text(".trbar .trb.on", "كتاب الحياة")] },
  { name: "verse",           url: "Gen.html#/Gen/1:1",          expect: [text("#main", "Genesis 1:1"), has("#strTgl")] },
  { name: "chapter strong",  url: "Isa.html#/Isa/ch/11",        act: async p => { await p.click("#cstrBtn"); await p.waitForSelector(".cvlist.cstr .sw sup"); await p.click(".cvlist.cstr .sw[data-n='H5342']"); await p.waitForSelector("#chsPop.on .chs-e"); },
    expect: [has(".cvlist.cstr .sw", 100), text("#chsPop", "H5342"), has("#chsPop a.chs-more[href='#/Isa/11:1/H5342']")] },
  { name: "verse + strong",  url: "Isa.html#/Isa/11:1/H5342",   expect: [text("#dict", "H5342"), has(".verse-card .sw.on")] },
  { name: "present",         url: "Eph.html#/Eph/ch/1",         act: async p => { await p.click(".cvp[data-pres='49.1:3']"); await p.waitForSelector("#pres.on .pres-txt:not(.wait)"); await p.keyboard.press("ArrowLeft"); await p.waitForTimeout(200); },
    expect: [text("#pres .pres-ref", "أفسس ١: ٤"), text("#pres .pres-txt", "اختارنا")] },
  { name: "present strong",  url: "Eph.html#/Eph/ch/1",         act: async p => { await p.click(".cvp[data-pres='49.1:4']"); await p.waitForSelector("#pres.on .pres-txt:not(.wait)"); await p.evaluate(() => document.querySelector("#pres [data-pa='str']").click()); await p.waitForSelector("#pres .pres-txt .sw sup"); await p.click("#pres .pres-txt .sw", { force: true });   /* ضغطة ماوس حقيقية (مش element.click) عشان تكشف أي طبقة مغطية الكلمة */ await p.waitForSelector("#pres .pres-de .pres-dnum"); },
    expect: [has("#pres.dict .pres-back"), has("#pres .pres-dorig")] },
  { name: "present 3 verses", url: "Eph.html#/Eph/ch/1",        act: async p => { await p.click(".cvp[data-pres='49.1:3']"); await p.waitForSelector("#pres.on .pres-txt:not(.wait)"); await p.evaluate(() => document.querySelector("#pres [data-pn='3']").click()); await p.waitForTimeout(200); await p.keyboard.press("ArrowLeft"); await p.waitForTimeout(200); },
    expect: [text("#pres .pres-ref", "أفسس ١: ٦–٨"), has("#pres .pres-txt .pres-vn", 3)] },
  { name: "present jump",    url: "Eph.html#/Eph/ch/1",         act: async p => { await p.click(".cvp[data-pres='49.1:3']"); await p.waitForSelector("#pres.on .pres-txt:not(.wait)"); await p.evaluate(() => store.set("pres_n", 1));
      for (const k of ["2", ":", "8", "Enter"]) await p.keyboard.press(k); await p.waitForTimeout(300); },
    expect: [text("#pres .pres-ref", "أفسس ٢: ٨")] },
  { name: "present jump book", url: "Eph.html#/Eph/ch/1",       act: async p => { await p.click(".cvp[data-pres='49.1:3']"); await p.waitForSelector("#pres.on .pres-txt:not(.wait)"); await p.evaluate(() => store.set("pres_n", 1));
      await p.evaluate(() => { for (const k of "يو 3:16") window.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true })); }); await p.keyboard.press("Enter");   /* حروف عربية كأنها من كيبورد عربي */ await p.waitForSelector("#pres .pres-txt:not(.wait)"); await p.waitForTimeout(400); },
    expect: [text("#pres .pres-ref", "يوحنا ٣: ١٦"), text("#pres .pres-txt", "هكذا أحب الله")] },
  { name: "present 3 translations", url: "Eph.html#/Eph/ch/1",  act: async p => { await p.click(".cvp[data-pres='49.1:3']"); await p.waitForSelector("#pres.on .pres-txt:not(.wait)"); await p.evaluate(() => document.querySelector("#pres [data-pa='tri']").click()); await p.waitForSelector("#pres .pres-tri .pt"); },
    expect: [has("#pres .pres-tri .pt", 3), text("#pres .pres-tri", "Blessed be the God")] },
  { name: "present interlinear", url: "Eph.html#/Eph/ch/1",     act: async p => { await p.evaluate(() => { store.set("inter", true); render(); }); await p.waitForSelector(".ilv .cvp"); await p.click(".ilv .cvp[data-pres='49.1:3']"); await p.waitForSelector("#pres .pres-il .ilc", { timeout: 20000 }); await p.click("#pres .pres-il .ilc .iln >> xpath=..", { force: true }); await p.waitForSelector("#pres .pres-dnum"); },
    expect: [has("#pres [data-pa='il'].on"), has("#pres.dict .pres-back")] },
  { name: "external hidden", url: "Eph.html#/Eph/ch/1",         expect: ["(document.querySelector('[data-scr]') && !document.querySelector('[data-scr]').hidden) ? 'external-screen button shows with no second screen' : ''"] },
  { name: "external screen", url: "Eph.html#/Eph/ch/1",         act: async p => { await p.evaluate(() => { Object.defineProperty(Screen.prototype, "isExtended", { get: () => true, configurable: true }); screen.dispatchEvent(new Event("change")); });   /* كأن فيه شاشة تانية على Extend */
      const pop = p.context().waitForEvent("page"); await p.click("[data-scr]"); const w = await pop; await w.waitForLoadState();
      await p.click(".cvp[data-pres='49.1:3']"); await w.waitForSelector(".pres-txt:not(.wait)"); await p.keyboard.press("ArrowLeft"); await p.waitForTimeout(400);
      const t = await w.innerText(".pres-ref"); if (!t.includes("أفسس ١: ٤")) throw new Error("screen shows «" + t + "» instead of أفسس ١: ٤"); },
    expect: [text(".scr-bar", "الشاشة الخارجية"), has(".cvw.scr-cur")] },   /* الشريط بيقول «مش بملء الشاشة» لحد ما حد يضغط على نافذة العرض */
  { name: "NT chapter",      url: "Joh.html#/Joh/ch/3",         expect: [has(".cvt", 36)] },
  { name: "search",          url: "search.html?q=محبة",         expect: [has(".hit", 10)] },
  { name: "strong",          url: "strong.html#G25",            expect: [text("#out", "agap"), text("#out", "G25")] },
  { name: "strong (Hebrew)", url: "strong.html#H430",           expect: [text("#out", "H430"), has(".item .txt mark", 10), has("#bk option", 20)] },
  { name: "arabic word",     url: "arword.html#ar=محبة",        expect: [has("a.open[href^='strong.html#']", 1)] },
  { name: "topics",          url: "topics.html",                expect: [text("body", "فهرس المواضيع")] },
  { name: "mind map",        url: "mindmap.html",               expect: [has(".mmn", 10)] },
  { name: "notes index",     url: "notes.html",                 expect: [text("#main", "ملاحظات على الترجمات")] },
  { name: "notes (book)",    url: "notes.html?b=Phm",           expect: [text("#main", "فليمون"), has("section.nb[data-b='Phm']")] },
  { name: "compare",         url: "compare.html?b=Gen&c=1",     expect: [text("body", "KJV"), text("body", "في البدء")] },
  { name: "grammar",         url: "grammar.html",               expect: [has("#bk")] },
  { name: "outline",         url: "outline.html",               expect: [text("body", "مخطط")] },
  { name: "chrono plan",     url: "chrono.html",                expect: [text("body", "٣٦٥ يومًا")] },
  { name: "timeline",        url: "timeline.html",              expect: [text("body", "الخط الزمني")] },
  { name: "sources",         url: "sources.html",               expect: [text("body", "المصادر")] },
  { name: "lists",           url: "lists.html",                 expect: [text("body", "قوائمي")] },
  { name: "offline page",    url: "offline.html",               expect: [text("body", "غير متصل")] },
];

/* ---------- tiny static server ---------- */
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname); if (p.endsWith("/")) p += "index.html";
  const f = path.join(ROOT, p); if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (e, b) => { if (e) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "content-type": TYPES[path.extname(f).toLowerCase()] || "application/octet-stream" }); res.end(b); });
}).listen(0, "127.0.0.1");

(async () => {
  if (!server.listening) await new Promise(r => server.once("listening", r));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ headless: !SHOW });
  const list = CHECKS.filter(c => !ONLY || c.name.includes(ONLY));
  let failed = 0; const t0 = Date.now();
  for (const c of list) {
    const ctx = await browser.newContext({ serviceWorkers: "block" }), page = await ctx.newPage(), problems = [];
    await page.route(u => u.hostname !== "127.0.0.1", r => r.abort());           // no internet needed
    page.on("pageerror", e => problems.push("JS error: " + e.message.split("\n")[0]));
    page.on("response", r => { const u = new URL(r.url());
      if (r.status() >= 400 && u.hostname === "127.0.0.1" && !u.pathname.startsWith("/img/")) problems.push(`missing file (${r.status()}): ${decodeURIComponent(u.pathname)}`); });
    const s = Date.now();
    try {
      await page.goto(base + c.url, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(700);                                            // late renders (data loaded after first paint)
      if (c.act) { await c.act(page); await page.waitForTimeout(300); }            // optional clicks before the checks
      for (const e of c.expect) { const msg = await page.evaluate(e); if (msg) problems.push(msg); }
    } catch (e) { problems.push("did not load: " + e.message.split("\n")[0]); }
    const ms = Date.now() - s;
    if (problems.length) { failed++; console.log(`✗ ${c.name.padEnd(15)} ${c.url}`); [...new Set(problems)].forEach(p => console.log("    " + p)); }
    else console.log(`✓ ${c.name.padEnd(15)} ${String(ms).padStart(5)} ms`);
    await ctx.close();
  }
  await browser.close(); server.close();
  console.log(`\n${list.length - failed}/${list.length} passed in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  process.exit(failed ? 1 : 0);
})();
