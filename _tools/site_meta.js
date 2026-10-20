/* Shared names / descriptions for the build scripts (Phase 2-3). */
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..");

/* ← غيّر هذا السطر إذا انتقل الموقع إلى نطاق خاص (مثل https://example.org/) */
const BASE = "https://younanoo.github.io/TSK/";
const SITE = "جدد وعتقاء";
const TAGLINE = "كنوز الكتاب المقدس";

const AR = {Gen:"التكوين",Exo:"الخروج",Lev:"اللاويين",Num:"العدد",Deu:"التثنية",Jos:"يشوع",Jdg:"القضاة",Rut:"راعوث","1Sa":"صموئيل الأول","2Sa":"صموئيل الثاني","1Ki":"الملوك الأول","2Ki":"الملوك الثاني","1Ch":"أخبار الأيام الأول","2Ch":"أخبار الأيام الثاني",Ezr:"عزرا",Neh:"نحميا",Est:"أستير",Job:"أيوب",Psa:"المزامير",Pro:"الأمثال",Ecc:"الجامعة",Son:"نشيد الأنشاد",Isa:"إشعياء",Jer:"إرميا",Lam:"مراثي إرميا",Eze:"حزقيال",Dan:"دانيال",Hos:"هوشع",Joe:"يوئيل",Amo:"عاموس",Oba:"عوبديا",Jon:"يونان",Mic:"ميخا",Nah:"ناحوم",Hab:"حبقوق",Zep:"صفنيا",Hag:"حجي",Zec:"زكريا",Mal:"ملاخي",Mat:"متى",Mar:"مرقس",Luk:"لوقا",Joh:"يوحنا",Act:"أعمال الرسل",Rom:"رومية","1Co":"كورنثوس الأولى","2Co":"كورنثوس الثانية",Gal:"غلاطية",Eph:"أفسس",Phi:"فيلبي",Col:"كولوسي","1Th":"تسالونيكي الأولى","2Th":"تسالونيكي الثانية","1Ti":"تيموثاوس الأولى","2Ti":"تيموثاوس الثانية",Tit:"تيطس",Phm:"فليمون",Heb:"العبرانيين",Jam:"يعقوب","1Pe":"بطرس الأولى","2Pe":"بطرس الثانية","1Jo":"يوحنا الأولى","2Jo":"يوحنا الثانية","3Jo":"يوحنا الثالثة",Jud:"يهوذا",Rev:"الرؤيا"};
const BKGRP = [["التوراة (الخمسة)",1,5],["الأسفار التاريخية",6,17],["أسفار الشعر والحكمة",18,22],["الأنبياء الكبار",23,27],["الأنبياء الصغار",28,39],["الأناجيل وأعمال الرسل",40,44],["رسائل بولس",45,57],["الرسائل العامة",58,65],["الرؤيا",66,66]];

const n = x => String(x).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
const nk = x => n(Number(x).toLocaleString("en-US").replace(/,/g, "٬")); // ١٤٬٨٥٣
const plural = (k, one, two, few, many) => k === 1 ? one : k === 2 ? two : (k % 100 >= 3 && k % 100 <= 10) ? `${nk(k)} ${few}` : `${nk(k)} ${many}`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* «سفر التكوين» / «إنجيل متى» / «رسالة رومية» */
function fullName(c) {
  if (c.id >= 40 && c.id <= 43) return "إنجيل " + AR[c.abbr];
  if (c.id >= 45 && c.id <= 65) return "رسالة " + AR[c.abbr];
  return "سفر " + AR[c.abbr];
}
function bookTitle(c) { return `${fullName(c)} — دراسة بالشواهد | ${SITE}`; }
function bookDesc(c) {
  return `ادرس ${fullName(c)} عددًا بعدد مع ${plural(c.refs, "شاهد واحد", "شاهدين", "شواهد", "شاهدًا")} من «كنز معرفة الكتاب المقدس» (TSK)، ` +
         `ونص كتاب الحياة وفاندايك وKJV، وقاموس سترونج ومخطط السفر — ${plural(c.nc, "أصحاح واحد", "أصحاحان", "أصحاحات", "أصحاحًا")} و${plural(c.nv, "عدد واحد", "عددان", "أعداد", "عددًا")}.`;
}
const SITE_DESC = "مكتبة عربية مجانية لدراسة الكتاب المقدس بالشواهد: أكثر من ٣٨٠ ألف شاهد من «كنز معرفة الكتاب المقدس» (TSK) لكل أسفار الكتاب، مع نص كتاب الحياة وفاندايك وKJV، وقاموس سترونج، وفهرس المواضيع، والبحث، والخرائط الذهنية.";

function runJS(file) { const ctx = {}; ctx.window = ctx; vm.runInNewContext(fs.readFileSync(path.join(ROOT, file), "utf8"), ctx); return ctx; }
const catalog = () => runJS("assets/catalog.js").CATALOG;

module.exports = { ROOT, BASE, SITE, TAGLINE, AR, BKGRP, n, nk, plural, esc, fullName, bookTitle, bookDesc, SITE_DESC, runJS, catalog };
