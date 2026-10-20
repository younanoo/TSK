/* Link-preview images (1200x630) for WhatsApp / Facebook / X.
   Needs Playwright + Chromium and the two fonts below (npm i @fontsource/el-messiri @fontsource/ibm-plex-sans-arabic).
   Usage: node _tools/make_og_images.js [path/to/node_modules/@fontsource]
   Output: assets/og/site.jpg and assets/og/<abbr>.jpg */
const fs = require("fs"), path = require("path");
const M = require("./site_meta.js");
const FONTS = process.argv[2] || path.join(M.ROOT, "node_modules/@fontsource");
let chromium; try { ({ chromium } = require("playwright")); } catch (e) { ({ chromium } = require("/opt/npm-tools/node_modules/playwright")); }

const f64 = p => fs.readFileSync(path.join(FONTS, p)).toString("base64");
const FACE = `
@font-face{font-family:Messiri;font-weight:700;src:url(data:font/woff2;base64,${f64("el-messiri/files/el-messiri-arabic-700-normal.woff2")}) format("woff2")}
@font-face{font-family:Plex;font-weight:400;src:url(data:font/woff2;base64,${f64("ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-400-normal.woff2")}) format("woff2")}
@font-face{font-family:Plex;font-weight:500;src:url(data:font/woff2;base64,${f64("ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-500-normal.woff2")}) format("woff2")}`;
const svg = p => "data:image/svg+xml;base64," + fs.readFileSync(path.join(M.ROOT, p)).toString("base64");
const MARK = svg("assets/brand/mark-on-navy.svg"), STACK = svg("assets/brand/logo-stacked-dark.svg"), HORIZ = svg("assets/brand/logo-horizontal-dark.svg");

const CSS = `${FACE}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#0B1E30;color:#F5F1E6;font-family:Plex,sans-serif;direction:rtl}
.bg{position:absolute;inset:0;background:radial-gradient(900px 520px at 18% 50%,#163A5C 0%,#0B1E30 70%)}
.photo{position:absolute;inset:0;background-size:cover;background-position:center}
.shade{position:absolute;inset:0;background:linear-gradient(270deg,rgba(11,30,48,.97) 0%,rgba(11,30,48,.88) 48%,rgba(11,30,48,.45) 100%)}
.frame{position:absolute;inset:26px;border:1.5px solid rgba(212,166,74,.45);border-radius:6px}
.txt{position:absolute;right:86px;top:0;bottom:0;width:640px;display:flex;flex-direction:column;justify-content:center}
.eyebrow{font:500 30px Plex;color:#D4A64A;letter-spacing:0}
h1{font:700 104px/1.25 Messiri;color:#F5F1E6;margin:8px 0 18px}
h1.long{font-size:84px}
.stats{font:400 32px/1.5 Plex;color:#C9D3DE}
.rule{width:120px;height:3px;background:#D4A64A;margin:30px 0 22px;border-radius:2px}
.brand{height:70px}
.mark{position:absolute;left:96px;top:50%;transform:translateY(-50%);width:330px;height:330px}
.stack{position:absolute;inset:0;margin:auto;width:640px}
.site-sub{position:absolute;bottom:70px;width:100%;text-align:center;font:400 30px Plex;color:#C9D3DE}`;

function bookHTML(c, img) {
  const long = M.fullName(c).length > 16;
  return `<div class="${img ? "photo" : "bg"}" ${img ? `style="background-image:url(${img})"` : ""}></div>${img ? '<div class="shade"></div>' : ""}<div class="frame"></div>
  ${img ? "" : `<img class="mark" src="${MARK}">`}
  <div class="txt"><div class="eyebrow">دراسة بالشواهد · TSK</div>
  <h1 class="${long ? "long" : ""}">${M.fullName(c)}</h1>
  <div class="stats">${M.plural(c.nc, "أصحاح واحد", "أصحاحان", "أصحاحات", "أصحاحًا")} · ${M.plural(c.refs, "شاهد واحد", "شاهدان", "شواهد", "شاهدًا")}</div>
  <div class="rule"></div><img class="brand" src="${HORIZ}"></div>`;
}
const siteHTML = () => `<div class="bg"></div><div class="frame"></div><img class="stack" style="top:-60px;height:440px;width:auto" src="${STACK}">
  <div class="site-sub">مكتبة دراسة الشواهد · أكثر من ٣٨٠ ألف شاهد · كتاب الحياة · فاندايك · سترونج</div>`;

(async () => {
  const out = path.join(M.ROOT, "assets/og"); fs.mkdirSync(out, { recursive: true });
  let BOOKIMG = {}; try { BOOKIMG = M.runJS("assets/bookimg.js").BOOKIMG || {}; } catch (e) {}
  const br = await chromium.launch(fs.existsSync("/opt/pw-browsers/chromium-1194/chrome-linux/chrome") ? { executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" } : {});
  const p = await br.newPage({ viewport: { width: 1200, height: 630 } });
  const shot = async (body, file) => {
    await p.setContent(`<!doctype html><html lang="ar"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${body}</body></html>`);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(50);
    await p.screenshot({ path: path.join(out, file), type: "jpeg", quality: 84 });
  };
  await shot(siteHTML(), "site.jpg");
  for (const c of M.catalog()) {
    const bi = BOOKIMG[c.abbr]; let img = null;
    if (bi) { const f = path.join(M.ROOT, bi.src + "-1600.jpg"); if (fs.existsSync(f)) img = "data:image/jpeg;base64," + fs.readFileSync(f).toString("base64"); }
    await shot(bookHTML(c, img), c.abbr + ".jpg");
  }
  /* home-screen icons that Android may crop to a circle/squircle ("maskable"): full-bleed navy, mark inside the safe zone */
  const sq = svg("assets/brand/app-icon-square.svg");
  for (const s of [192, 512]) {
    const q = await br.newPage({ viewport: { width: s, height: s } });
    await q.setContent(`<html><body style="margin:0;background:#0F3554"><img src="${sq}" style="display:block;width:${s}px;height:${s}px"></body></html>`);
    await q.screenshot({ path: path.join(M.ROOT, `assets/brand/maskable-${s}.png`) }); await q.close();
  }
  await br.close();
  console.log("og images:", fs.readdirSync(out).length, "+ maskable icons");
})();
