document.documentElement.classList.add('ux-a'); /* التصميم «أ»: شريط مختصر + أوضاع قراءة/دراسة/خدمة (الأنماط في style.css تحت .ux-a) */
const TI={"copy":"<path d=\"M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z\" /> <path d=\"M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1\" />","share":"<path d=\"M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0\" /> <path d=\"M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0\" /> <path d=\"M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0\" /> <path d=\"M8.7 10.7l6.6 -3.4\" /> <path d=\"M8.7 13.3l6.6 3.4\" />","flag":"<path d=\"M5 5a5 5 0 0 1 7 0a5 5 0 0 0 7 0v9a5 5 0 0 1 -7 0a5 5 0 0 0 -7 0v-9z\" /> <path d=\"M5 21v-7\" />","download":"<path d=\"M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2\"/><path d=\"M7 11l5 5l5 -5\"/><path d=\"M12 4l0 12\"/>","menu-2":"<path d=\"M4 6l16 0\" /> <path d=\"M4 12l16 0\" /> <path d=\"M4 18l16 0\" />","x":"<path d=\"M18 6l-12 12\" /> <path d=\"M6 6l12 12\" />","sun-moon":"<path d=\"M9.173 14.83a4 4 0 1 1 5.657 -5.657\" /> <path d=\"M11.294 12.707l.174 .247a7.5 7.5 0 0 0 8.845 2.492a9 9 0 0 1 -14.671 2.914\" /> <path d=\"M3 12h1\" /> <path d=\"M12 3v1\" /> <path d=\"M5.6 5.6l.7 .7\" /> <path d=\"M3 21l18 -18\" />","printer":"<path d=\"M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2\" /> <path d=\"M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4\" /> <path d=\"M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z\" />","search":"<path d=\"M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0\" /> <path d=\"M21 21l-6 -6\" />","calendar":"<path d=\"M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z\" /> <path d=\"M16 3v4\" /> <path d=\"M8 3v4\" /> <path d=\"M4 11h16\" />","timeline":"<path d=\"M4 16l6 -7l5 5l5 -6\" /> <circle cx=\"15\" cy=\"14\" r=\"1.5\" /> <circle cx=\"10\" cy=\"9\" r=\"1.5\" /> <circle cx=\"4\" cy=\"16\" r=\"1.5\" /> <circle cx=\"20\" cy=\"8\" r=\"1.5\" />","tags":"<path d=\"M3 8v4.172a2 2 0 0 0 .586 1.414l5.71 5.71a2.41 2.41 0 0 0 3.408 0l3.592 -3.592a2.41 2.41 0 0 0 0 -3.408l-5.71 -5.71a2 2 0 0 0 -1.414 -.586h-4.172a2 2 0 0 0 -2 2z\" /> <path d=\"M18 19l1.592 -1.592a4.82 4.82 0 0 0 0 -6.816l-4.592 -4.592\" /> <path d=\"M7 10h-.01\" />","books":"<path d=\"M5 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z\" /> <path d=\"M9 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z\" /> <path d=\"M5 8h4\" /> <path d=\"M9 16h4\" /> <path d=\"M13.803 4.56l2.184 -.53c.562 -.135 1.133 .19 1.282 .732l3.695 13.418a1.02 1.02 0 0 1 -.634 1.219l-.133 .041l-2.184 .53c-.562 .135 -1.133 -.19 -1.282 -.732l-3.695 -13.418a1.02 1.02 0 0 1 .634 -1.219l.133 -.041z\" /> <path d=\"M14 9l4 -1\" /> <path d=\"M16 16l3.923 -.98\" />","microscope":"<path d=\"M5 21h14\" /> <path d=\"M6 18h2\" /> <path d=\"M7 18v3\" /> <path d=\"M9 11l3 3l6 -6l-3 -3z\" /> <path d=\"M10.5 12.5l-1.5 1.5\" /> <path d=\"M17 3l3 3\" /> <path d=\"M12 21a6 6 0 0 0 3.715 -10.712\" />","topology-star-3":"<path d=\"M10 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z\" /> <path d=\"M18 5a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z\" /> <path d=\"M10 5a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z\" /> <path d=\"M6 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z\" /> <path d=\"M18 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z\" /> <path d=\"M14 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z\" /> <path d=\"M22 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z\" /> <path d=\"M6 12h4\" /> <path d=\"M14 12h4\" /> <path d=\"M15 7l-2 3\" /> <path d=\"M9 7l2 3\" /> <path d=\"M11 14l-2 3\" /> <path d=\"M13 14l2 3\" />","bookmarks":"<path d=\"M15 10v11l-5 -3l-5 3v-11a3 3 0 0 1 3 -3h4a3 3 0 0 1 3 3z\" /> <path d=\"M11 3h5a3 3 0 0 1 3 3v11\" />","note":"<path d=\"M13 20l7 -7\" /> <path d=\"M13 20v-6a1 1 0 0 1 1 -1h6v-7a2 2 0 0 0 -2 -2h-12a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7\" />","arrows-left-right":"<path d=\"M21 17l-18 0\" /> <path d=\"M6 10l-3 -3l3 -3\" /> <path d=\"M3 7l18 0\" /> <path d=\"M18 20l3 -3l-3 -3\" />","language":"<path d=\"M4 5h7\" /> <path d=\"M9 3v2c0 4.418 -2.239 8 -5 8\" /> <path d=\"M5 9c0 2.144 2.952 3.908 6.7 4\" /> <path d=\"M12 20l4 -9l4 9\" /> <path d=\"M19.1 18h-6.2\" />","chevron-down":"<path d=\"M6 9l6 6l6 -6\" />","chevron-left":"<path d=\"M15 6l-6 6l6 6\" />","external-link":"<path d=\"M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6\" /> <path d=\"M11 13l9 -9\" /> <path d=\"M15 4h5v5\" />","arrow-back-up":"<path d=\"M9 14l-4 -4l4 -4\" /> <path d=\"M5 10h11a4 4 0 1 1 0 8h-1\" />","home":"<path d=\"M5 12l-2 0l9 -9l9 9l-2 0\" /> <path d=\"M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7\" /> <path d=\"M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6\" />","layout-grid":"<path d=\"M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z\" /> <path d=\"M14 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z\" /> <path d=\"M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z\" /> <path d=\"M14 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z\" />","arrows-shuffle":"<path d=\"M18 4l3 3l-3 3\" /> <path d=\"M18 20l3 -3l-3 -3\" /> <path d=\"M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5\" /> <path d=\"M21 7h-5a4.978 4.978 0 0 0 -3 1m-4 8a4.984 4.984 0 0 1 -3 1h-3\" />","zoom-in":"<path d=\"M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0\" /> <path d=\"M7 10l6 0\" /> <path d=\"M10 7l0 6\" /> <path d=\"M21 21l-6 -6\" />","zoom-out":"<path d=\"M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0\" /> <path d=\"M7 10l6 0\" /> <path d=\"M21 21l-6 -6\" />","align-left":"<path d=\"M4 6l16 0\" /> <path d=\"M4 12l10 0\" /> <path d=\"M4 18l14 0\" />","align-right":"<path d=\"M4 6l16 0\" /> <path d=\"M10 12l10 0\" /> <path d=\"M6 18l14 0\" />"};
const ic=(n,x)=>`<svg class="tic${x?" "+x:""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${TI[n]}</svg>`;

const LIB = window.LIB;
/* تحميل الملفات الكبيرة عند الحاجة فقط */
const LOADED={};
const JSFAIL={}; /* الملفات اللي فشل تحميلها (مثلًا offline قبل التنزيل) */
function retryJS(src){if(JSFAIL[src]){delete LOADED[src];delete JSFAIL[src]}}
/* الشواهد مقسّمة بالأصحاح: الصفحة تحمّل هيكل السفر (assets/lib/<abbr>/index.js — الأصحاحات والأعداد فقط)،
   ثم ملف الأصحاح المفتوح assets/lib/<abbr>/<c>.js (نص كتاب الحياة + الشواهد + أرقام سترونج) وقت الحاجة.
   الصفحات اللي لسه بتحمّل lib_<abbr>.js كامل (من غير LIBSPLIT) بتشتغل زي الأول بالظبط. */
const SPLIT=!!window.LIBSPLIT;
let CHWAIT=null;
const chSrc=c=>`assets/lib/${LIB[0].abbr}/${c}.js`;
function chHas(c){if(!SPLIT)return true;const b=LIB[0],a=window.LIBCH&&window.LIBCH[b.abbr+"/"+c];if(!a)return false;
  if(!a.merged){a.forEach(x=>{const i=b.idx[x.c+":"+x.v];if(i!=null)Object.assign(b.verses[i],x)});a.merged=true}return true}
const chFailed=c=>!!JSFAIL[chSrc(c)]||(LOADED[chSrc(c)]===true&&!chHas(c));
/* يرجّع true لو الأصحاح جاهز؛ وإلا يبدأ تحميله (مرة واحدة) ويستدعي cb بعد ما يخلص */
function chEnsure(c,cb){if(chHas(c))return true;if(chFailed(c))return false;loadJS(chSrc(c),()=>{chHas(c);cb&&cb()});return false}
window.chEnsure=chEnsure;
function loadJS(src,cb){if(LOADED[src]===true){cb&&cb();return}if(LOADED[src]){LOADED[src].push(cb);return}
  LOADED[src]=[cb];const s=document.createElement("script");s.src=src;s.onload=s.onerror=ev=>{if(ev&&ev.type==="error")JSFAIL[src]=true;const q=LOADED[src];LOADED[src]=true;q.forEach(f=>f&&f())};document.body.appendChild(s)}
/* نصوص الشواهد: ملف صغير لكل سفر ولكل ترجمة (assets/tx/alab_Mat.js …) يُحمَّل فقط حين يُعرض شاهد من ذلك السفر */
window.TXB=window.TXB||{};
function txGet(k,bk,c,v){const t=window.TXB[k+"/"+bk];return t?(t[c+":"+v]||""):undefined}
/* إن تعذّر تحميل ملف السفر (غالبًا دون اتصال ولم يُحفظ بعد) تظهر هذه الملاحظة بدل سطر فارغ */
const TX_NA=`<span class="txna">نص هذا الشاهد غير محفوظ على جهازك بعد — يظهر عند الاتصال بالإنترنت.</span>`;
function txNeed(k,bk){const src=`assets/tx/${k}_${bk}.js`;if(LOADED[src]!==undefined)return;loadJS(src,()=>{
  const T=window.TXB[k+"/"+bk],t=T||{},q=S.view==="search"?S.q:"";
  document.querySelectorAll(`[data-tx^="${k}|${bk}|"]`).forEach(el=>{const cv=el.dataset.tx.split("|")[2];
    el.innerHTML=(t[cv]||el.dataset.fb)?hl(t[cv]||el.dataset.fb,q):(T?"":TX_NA);el.removeAttribute("data-tx");el.classList.remove("txp")})})}
/* الترجمات (فاندايك / KJV) تُحمَّل عند اختيارها فقط */
function trData(){const ab=book().abbr,t=window.TR&&window.TR[ab];if(t)return t;
  const src=`assets/tr_${ab}.js`;if(LOADED[src]===undefined)loadJS(src,()=>render());return null}
let STRONG = window.STRONG || {};
/* يعيد true إن كان قاموس سترونج محمّلًا، وإلا يبدأ تحميله ثم يستدعي cb */
function needStrong(cb,fail){if(window.STRONG&&Object.keys(window.STRONG).length){STRONG=window.STRONG;return true}
  loadJS("assets/strong.js",()=>setTimeout(()=>{STRONG=window.STRONG||{};if(Object.keys(STRONG).length)cb&&cb();else fail&&fail()}));return false}
function needSidx(cb,fail){if(window.SIDX)return true;loadJS("assets/sidx.js",()=>setTimeout(()=>{if(window.SIDX)cb&&cb();else fail&&fail()}));return false}
const loadFail=(what,attr)=>`<div class="empty loadfail">تعذّر تحميل ${what} — غالبًا الجهاز غير متصل بالإنترنت، وهذا الجزء لم يُنزَّل للاستخدام دون إنترنت بعد. <button type="button" class="trb" ${attr}>إعادة المحاولة</button></div>`;
const CAT = window.CATALOG;
const CAT_ABBR = {}; CAT.forEach((c,i)=>{c.i=i;CAT_ABBR[c.abbr]=c});
const pageOf = (abbr,hash)=>`${abbr}.html${hash?"#"+hash:""}`;
const doneIn = id => Object.keys(S.done).filter(k=>k.startsWith(id+".")).length;
const mine = obj => Object.keys(obj).filter(k=>k.startsWith(S.b+"."));
const ABBR="Gen Exo Lev Num Deu Jos Jdg Rut 1Sa 2Sa 1Ki 2Ki 1Ch 2Ch Ezr Neh Est Job Psa Pro Ecc Son Isa Jer Lam Eze Dan Hos Joe Amo Oba Jon Mic Nah Hab Zep Hag Zec Mal Mat Mar Luk Joh Act Rom 1Co 2Co Gal Eph Phi Col 1Th 2Th 1Ti 2Ti Tit Phm Heb Jam 1Pe 2Pe 1Jo 2Jo 3Jo Jud Rev".split(" ");
const AR = {Gen:"التكوين",Exo:"الخروج",Lev:"اللاويين",Num:"العدد",Deu:"التثنية",Jos:"يشوع",Jdg:"القضاة",Rut:"راعوث","1Sa":"صموئيل الأول","2Sa":"صموئيل الثاني","1Ki":"الملوك الأول","2Ki":"الملوك الثاني","1Ch":"أخبار الأيام الأول","2Ch":"أخبار الأيام الثاني",Ezr:"عزرا",Neh:"نحميا",Est:"أستير",Job:"أيوب",Psa:"المزامير",Pro:"الأمثال",Ecc:"الجامعة",Son:"نشيد الأنشاد",Isa:"إشعياء",Jer:"إرميا",Lam:"مراثي إرميا",Eze:"حزقيال",Dan:"دانيال",Hos:"هوشع",Joe:"يوئيل",Amo:"عاموس",Oba:"عوبديا",Jon:"يونان",Mic:"ميخا",Nah:"ناحوم",Hab:"حبقوق",Zep:"صفنيا",Hag:"حجي",Zec:"زكريا",Mal:"ملاخي",Mat:"متى",Mar:"مرقس",Luk:"لوقا",Joh:"يوحنا",Act:"أعمال الرسل",Rom:"رومية","1Co":"كورنثوس الأولى","2Co":"كورنثوس الثانية",Gal:"غلاطية",Eph:"أفسس",Phi:"فيلبي",Col:"كولوسي","1Th":"تسالونيكي الأولى","2Th":"تسالونيكي الثانية","1Ti":"تيموثاوس الأولى","2Ti":"تيموثاوس الثانية",Tit:"تيطس",Phm:"فليمون",Heb:"العبرانيين",Jam:"يعقوب","1Pe":"بطرس الأولى","2Pe":"بطرس الثانية","1Jo":"يوحنا الأولى","2Jo":"يوحنا الثانية","3Jo":"يوحنا الثالثة",Jud:"يهوذا",Rev:"الرؤيا"};
const SH = {Gen:"تك",Exo:"خر",Lev:"لا",Num:"عد",Deu:"تث",Jos:"يش",Jdg:"قض",Rut:"را","1Sa":"١صم","2Sa":"٢صم","1Ki":"١مل","2Ki":"٢مل","1Ch":"١أخ","2Ch":"٢أخ",Ezr:"عز",Neh:"نح",Est:"أس",Job:"أي",Psa:"مز",Pro:"أم",Ecc:"جا",Son:"نش",Isa:"إش",Jer:"إر",Lam:"مرا",Eze:"حز",Dan:"دا",Hos:"هو",Joe:"يؤ",Amo:"عا",Oba:"عو",Jon:"يون",Mic:"مي",Nah:"نا",Hab:"حب",Zep:"صف",Hag:"حج",Zec:"زك",Mal:"ملا",Mat:"مت",Mar:"مر",Luk:"لو",Joh:"يو",Act:"أع",Rom:"رو","1Co":"١كو","2Co":"٢كو",Gal:"غل",Eph:"أف",Phi:"في",Col:"كو","1Th":"١تس","2Th":"٢تس","1Ti":"١تي","2Ti":"٢تي",Tit:"تي",Phm:"فل",Heb:"عب",Jam:"يع","1Pe":"١بط","2Pe":"٢بط","1Jo":"١يو","2Jo":"٢يو","3Jo":"٣يو",Jud:"يه",Rev:"رؤ"};
const MARK = {"*marg.":"(الهامش)","*Gr.":"(باليونانية)","*Gr:":"(باليونانية)","*Heb:":"(بالعبرية)","*Heb.":"(بالعبرية)"};

/* Arabic-Indic digits */
const n = x => String(x).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
const chs = k => plural(k,"أصحاح واحد","أصحاحان","أصحاحات","أصحاحًا");
const plural = (k,one,two,few,many) => k===1?one:k===2?two:(k%100>=3&&k%100<=10)?`${n(k)} ${few}`:`${n(k)} ${many}`;
/* "Mat 21:15-17" -> "متى ٢١: ١٥-١٧" */
function refAr(l){
  const i=l.indexOf(" "), bk=l.slice(0,i), rest=l.slice(i+1);
  return {bk, name:AR[bk]||bk, num:n(rest.replace(/:/g,": ").replace(/-/g,"–"))};
}

/* ---------- indexes ---------- */
const BY = {}; LIB.forEach(b=>{ b.idx={}; b.verses.forEach((d,i)=>{d.b=b.id;b.idx[d.c+":"+d.v]=i}); b.chapters=[...new Set(b.verses.map(d=>d.c))]; BY[b.id]=b; });
const BY_ABBR = {}; LIB.forEach(b=>BY_ABBR[b.abbr]=b);
const ALL = LIB.flatMap(b=>b.verses);
const GIDX = {}; ALL.forEach((d,i)=>GIDX[d.b+"."+d.c+":"+d.v]=i);
const refCount = d => (d.groups||[]).reduce((a,g)=>a+g.refs.length,0);
const verseCount = d => (d.groups||[]).reduce((a,g)=>a+g.refs.reduce((x,r)=>x+r.vs.length,0),0);
const K = (b,c,v)=>b+"."+c+":"+v;
const bname = b => AR[b.abbr];
const vref = d => `${AR[BY[d.b].abbr]} ${n(d.c)}: ${n(d.v)}`;

/* ---------- storage ---------- */
const store = {
  get(k,d){try{const v=localStorage.getItem("tsklib:"+k);return v==null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem("tsklib:"+k,JSON.stringify(v))}catch(e){}}
};
try{const _t=new URLSearchParams(location.search).get("tr");if(["alab","svd","kjv"].includes(_t))store.set("tr",_t)}catch(e){}
(function migrate(){
  try{
    if(store.get("migrated",false)) return;
    const old=k=>{const v=localStorage.getItem("tsk1pe:"+k);return v?JSON.parse(v):null};
    const pre=s=>"60."+s;
    const done=store.get("done",{}),stars=store.get("stars",{}),notes=store.get("notes",{});
    const od=old("done"); if(od) for(const k in od) if(od[k]) done[pre(k)]=true;
    const os=old("stars"); if(os) for(const k in os) stars[pre(k)]=1;
    const on=old("notes"); if(on) for(const k in on) if(on[k]) notes[pre(k)]=on[k];
    store.set("done",done);store.set("stars",stars);store.set("notes",notes);store.set("migrated",true);
  }catch(e){}
})();

const first = LIB[0];
if(store.get("b",null)!==first.id){store.set("b",first.id);store.set("c",first.verses[0].c);store.set("v",first.verses[0].v);}
const S = {
  b: store.get("b",first.id), c: store.get("c",first.verses[0].c), v: store.get("v",first.verses[0].v),
  view:"home", done: store.get("done",{}), stars: store.get("stars",{}), notes: store.get("notes",{}),
  closed: store.get("closed",{}), raw: store.get("raw",false), q:"", scope:"all", limit:60
};
if(!BY[S.b]) {S.b=first.id;S.c=first.verses[0].c;S.v=first.verses[0].v;}
const book = ()=>BY[S.b];
const cur = ()=>{const b=book(); return b.verses[b.idx[S.c+":"+S.v]] || b.verses[0];};

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const norm = s => String(s).replace(/[ً-ْـ]/g,"").replace(/[إأآ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه")
  .replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[–_]/g," ").replace(/:\s*/g,":").replace(/\s+/g," ").toLowerCase();
function hl(text,q){
  const t=esc(text); if(!q) return t;
  const nt=norm(t), nq=norm(q); if(nt.length!==t.length||!nq) return t;
  let out="",i=0,idx; while((idx=nt.indexOf(nq,i))>-1){out+=t.slice(i,idx)+"<mark>"+t.slice(idx,idx+nq.length)+"</mark>";i=idx+nq.length}
  return out+t.slice(i);
}
const doneOf = vs => vs.filter(d=>S.done[K(d.b,d.c,d.v)]).length;
const inCh = (b,c) => b.verses.filter(d=>d.c===c);
const pct = (a,b)=>n(Math.round(a/b*100))+"٪";

const BKGRP=[["التوراة (الخمسة)",1,5],["الأسفار التاريخية",6,17],["أسفار الشعر والحكمة",18,22],["الأنبياء الكبار",23,27],["الأنبياء الصغار",28,39],["الأناجيل وأعمال الرسل",40,44],["رسائل بولس",45,57],["الرسائل العامة",58,65],["الرؤيا",66,66]];
function groupedBooks(cats,mk,activeId,old){let o="";BKGRP.forEach(([t,a,z])=>{const bs=cats.filter(c=>c.id>=a&&c.id<=z);if(!bs.length)return;const key=a+"";const op=bs.some(c=>c.id===activeId)||(old&&old.has(key));o+=`<details class="bkg" data-g="${key}" ${op?"open":""}><summary>${t}<b>${bs.length}</b></summary><div class="bkl">${bs.map(mk).join("")}</div></details>`});return o}
/* ---------- sidebar ---------- */
function fsGrp(){return `<span class="fsgrp" role="group" aria-label="حجم الخط"><button class="fsb" data-fs="-1" title="تصغير الخط" aria-label="تصغير الخط">${ic("zoom-out")}</button><button class="fsb" data-fs="1" title="تكبير الخط" aria-label="تكبير الخط">${ic("zoom-in")}</button></span>`}
function setFs(d){const v=Math.min(1.6,Math.max(.8,Math.round(((store.get("fs",1))+d*.1)*10)/10));store.set("fs",v);document.documentElement.style.setProperty("--fs",v)}
document.documentElement.style.setProperty("--fs",store.get("fs",1));
const nz=x=>String(x).replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/[\u064B-\u0652\s.]/g,"").toLowerCase();
/* «يو ٣:١٦» / «إش 53:5» / «Rom 8» → {abbr,c,v} — يستخدمه «اذهب إلى عدد» وخانة «انتقال» في العرض بملء الشاشة والشاشة الخارجية */
function parseRef(q){
  const m=String(q).trim().replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d)).match(/^(.*?)\s*(\d+)?\s*[:\s٫.]\s*(\d+)$|^(.*?)\s*(\d+)?$/);
  if(!m)return null;
  const name=nz(m[1]!=null?m[1]:m[4]),c=m[2]||m[5]||"1",v=m[3]||"1"; if(!name)return null;
  const c1=CAT.find(x=>[AR[x.abbr],SH[x.abbr],x.abbr,x.en].some(t=>nz(t)===name))||CAT.find(x=>[AR[x.abbr],x.en].some(t=>nz(t).startsWith(name)));
  if(!c1)return null;
  return {abbr:c1.abbr,c:+c,v:+v}}
function gotoRef(q){const r=parseRef(q);if(!r)return false;location.href=pageOf(r.abbr,"/"+r.abbr+"/"+r.c+":"+r.v);return true}
function sideTools(){
  /* القائمة الجانبية: ابحث أو اذهب لآية، ثم اقرأ (الأسفار في الصفحة) · الكتاب المقدس عبر الزمن · ادرس · اخدم */
  if($("#findSec"))return;
  const L=(h,i,t,x="")=>`<a class="tool" href="${h}"${x} style="text-decoration:none;display:block;margin-top:8px">${i.startsWith("<svg")?i:ic(i)} ${t}</a>`;
  const sec=(id,k,t,body)=>`<div class="side-sec" id="${id}" data-sec="${k}"><h4 class="sh">${t}</h4><div class="sbody">${body}</div></div>`;
  const h=$("#home");
  h&&h.insertAdjacentHTML("afterend",sec("findSec","goto","ابحث أو اذهب لآية",`<form id="gotoBox" class="gotobox" role="search"><input id="gotoIn" placeholder="مثل: يو ٣: ١٦ أو محبة" aria-label="ابحث أو اذهب لآية" autocomplete="off" enterkeyhint="go"></form>`)+`<div class="ucap">اقرأ</div>`);
  const after=sec("timeSec","time","الكتاب المقدس عبر الزمن",L("chrono.html","calendar","اقرأ الكتاب المقدس بالترتيب الزمني")+L("timeline.html","timeline","أحداث الكتاب على الخط الزمني"))
    +sec("toolSec","study","ادرس",L("search.html","search","ابحث بكلمة أو جذر أو رقم سترونج",' id="srchLink" target="tsksearch"')+L("topics.html","tags","ابحث عن موضوع في الكتاب المقدس",' target="tsktopics"')+L("mindmap.html","topology-star-3","تتبّع شواهد آية كشبكة",' id="mmLink" target="tskmindmap"')+L("outline.html?b="+book().abbr,"layout-grid","مخطط السفر",' id="uOlSide"'))
    +sec("serveSec","serve","اخدم",L("lists.html","bookmarks","قوائمي: اجمع آيات وانسخها <b class=\"cpy-count\" hidden></b>",' target="tsklists"')+`<button type="button" class="tool" id="uPresSide" style="display:block;width:100%;margin-top:8px;text-align:start">${PRES_IC} اعرض الآيات على شاشة أو بروجكتور</button>`)
    +`<div class="ufoot"><a href="sources.html" target="_blank">المصادر</a><a href="contact.html" target="_blank">تواصل معنا</a><button type="button" id="offBtn">${ic("download")} التنزيل دون إنترنت</button></div>`;
  const bk=document.querySelector('#side [data-sec="books"]')||$("#findSec");
  bk&&bk.insertAdjacentHTML("afterend",after);
}
function mmFix(){if(!$("#mmLink")){const g=document.getElementById("srchLink");g&&g.insertAdjacentHTML("afterend",`<a id="mmLink" class="tool" target="tskmindmap" href="mindmap.html" style="text-decoration:none;display:block;margin-top:8px">${ic("topology-star-3")} الخريطة الذهنية للشواهد</a>`)}}
function sidebar(){
  sideTools();mmFix();
  const old=new Set([...document.querySelectorAll("#booksel details[open]")].map(x=>x.dataset.g));
  const f=c=>`<a href="${pageOf(c.abbr,"/"+c.abbr)}" ${c.id===S.b?'data-book="'+c.id+'"':""} class="${c.id===S.b?"active":""}"><span class="ab">${SH[c.abbr]}</span><span class="nm"><b>${AR[c.abbr]}</b><span>${chs(c.nc)}</span></span></a>`;
  $("#booksel").innerHTML=groupedBooks(CAT,f,S.b,old);
  if(sidebar.last!==S.b){sidebar.last=S.b;requestAnimationFrame(()=>{const side=$("#side"),el=$("#booksel a.active");if(!side||!el)return;const r=el.getBoundingClientRect(),sr=side.getBoundingClientRect();side.scrollTop+=r.top-sr.top-side.clientHeight/2+r.height/2})}
}

/* ---------- pieces ---------- */
function refRow(r,k,q){
  const R=refAr(r.l);
  let self="";
  const tb=BY_ABBR[R.bk];
  const m=r.l.match(/ (\d+):(\d+)/);
  if(tb){ if(m && tb.idx[m[1]+":"+m[2]]!=null) self=`<button class="self" data-go="${tb.id}.${m[1]}:${m[2]}">افتحه في الدراسة</button>`;}
  else if(m && CAT_ABBR[R.bk]) self=`<a class="self" href="${pageOf(R.bk,"/"+R.bk+"/"+m[1]+":"+m[2])}">افتحه في الدراسة</a>`;
  const mc=r.l.match(/ (\d+):/), tk=trCur(), kjv=tk==="kjv";
  /* t موجود مسبقًا في البيانات لبعض الشواهد الممتدة عبر أصحاحات؛ وإلا يُقرأ من ملف السفر */
  /* الشاهد قد يمتد عبر أصحاحات (2Sa 15:1-18:33): يزيد رقم الأصحاح كلما رجع رقم العدد إلى الوراء */
  let cc=mc?+mc[1]:0,pv=0;const chOf=r.vs.map(([vn])=>{if(vn<pv)cc++;pv=vn;return cc});
  const vt=(vn,t,i)=>{
    if(tk==="alab"&&t!=null) return hl(t,q);
    if(!mc) return hl(t||"",q);
    const x=txGet(tk,R.bk,chOf[i],vn);
    if(x!==undefined) return hl(x||t||"",q);
    if(LOADED[`assets/tx/${tk}_${R.bk}.js`]===true) return t?hl(t,q):TX_NA; /* الملف غير متاح */
    txNeed(tk,R.bk);
    return `<span class="txp" data-tx="${tk}|${R.bk}|${chOf[i]}:${vn}"${t?` data-fb="${esc(t)}"`:""}>…</span>`};
  const body=r.vs.length===1?`<p>${vt(r.vs[0][0],r.vs[0][1],0)}</p>`:r.vs.map(([vn,t],i)=>`<p><span class="vn">${n(vn)}</span>${vt(vn,t,i)}</p>`).join("");
  return `<div class="r" data-key="${esc(k)}">
    <div class="lbl"><span class="nmr">${hl(R.name+" "+R.num,q)}${r.n?` <small>${MARK[r.n]||esc(r.n)}</small>`:""}</span>${kjv?`<span class="en ltr">${esc(r.l)}</span>`:""}${self}${cpyBtn("r",r.l,R.name+" "+R.num)}</div>
    <div class="txt ar" ${kjv?'dir="ltr" style="text-align:left"':""}>${body}</div></div>`;
}
const crumbs=(title,sub,nav,bar)=>(bar||"")+`<div class="crumbs${bar?" nomenu":""}"><button class="menu-btn" id="menu">${ic("menu-2")}</button><div class="ref">${sub?`<small>${sub}</small>`:""}${title}</div>${bar?"<span></span>":(nav||"<span></span>")}</div>`;
function stickBar(b,c,v,nav){
  const bo=CAT.map(x=>`<option value="${x.abbr}" ${x.abbr===b.abbr?"selected":""}>${AR[x.abbr]}</option>`).join("");
  const co=b.chapters.map(x=>`<option value="${x}" ${x===c?"selected":""}>${n(x)}</option>`).join("");
  const vo=v?`<select class="sbV" aria-label="العدد">${inCh(b,c).map(d=>`<option value="${d.v}" ${d.v===v?"selected":""}>${n(d.v)}</option>`).join("")}</select>`:"";
  return `<div class="stickbar"><button class="menu-btn" id="menu">${ic("menu-2")}</button><select class="sbBook" aria-label="السفر">${bo}</select><select class="sbCh" aria-label="الأصحاح">${co}</select>${vo}<span class="sp"></span>${cpyTop()}${nav}</div>`}

const fromLink=(d,label)=>`<a data-go="${d.b}.${d.c}:${d.v}">${label||"من"} ${vref(d)} ←</a>`;
const kwTitle=g=>{const c=trCur();if(c==="kjv"&&g.kw)return g.kw;
  if(c==="svd")return g.s||g.kwAr||g.kw||"الشواهد";
  return g.kwAr||g.s||g.kw||"الشواهد"};
/* عناوين كلمات فاندايك (g.s) مضمّنة الآن في ملف السفر lib_XXX.js */


/* ---------- Strong's ---------- */
const isHeb = n => n[0]==="H";
const linkRefs = h => h.replace(/\b([GH]\d+)\b/g,(m)=>STRONG[m]?`<span class="sref" data-sn="${m}">${m}</span>`:m);
let DICT={cur:null, hist:[], trail:[]};   // per-verse state
const TRN={alab:"كتاب الحياة",svd:"فاندايك",kjv:"KJV"};
/* «أبلغ عن خطأ»: يفتح contact.html والنموذج مملوء بالموضع والترجمة */
const REP_IC='<svg class="tic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 5a5 5 0 0 1 7 0a5 5 0 0 0 7 0v9a5 5 0 0 1 -7 0a5 5 0 0 0 -7 0v-9z"/><path d="M5 21v-7"/></svg>';
const repHref=(place,tr)=>"contact.html?t=c&p="+encodeURIComponent(place)+"&tr="+encodeURIComponent(tr);
function trAvail(){const b=book();if(b.trs)return ["alab",...b.trs];const t=window.TR&&window.TR[b.abbr];return t?Object.keys(TRN).filter(k=>k==="alab"||t[k]):[]}
function trCur(){const c=store.get("tr","svd"),av=trAvail();return av.includes(c)?c:(av.includes("svd")?"svd":"alab")}
function hasDia(){const b=book();if(b.dia!=null)return b.dia;const t=window.TR&&window.TR[b.abbr];return !!(t&&t.svdD)}
function hasKD(){return trCur()==="alab"}
function kdGet(d){const ab=book().abbr,src="assets/kd_"+ab+".js";if(LOADED[src]===undefined){loadJS(src,()=>render());return null}const m=window.KD&&window.KD[ab];return (m&&m[d.c+":"+d.v])||null}
function kdArS(d){const t=kdGet(d);if(!t)return null;const ab=book().abbr,m=window.KDS&&window.KDS[ab],ns=m&&m[d.c+":"+d.v];if(!ns)return null;const out=[];t.split(" ").forEach((w,i)=>{if(i)out.push([" ",[]]);const mm=w.match(/^([^\u0621-\u064A]*)(.*?)([^\u0621-\u064A\u064B-\u065F\u0670]*)$/s);const a=mm[1],c=mm[2],e=mm[3];if(a)out.push([a,[]]);if(c)out.push([c,ns[i]||[]]);if(e)out.push([e,[]])});return out}
/* التشكيل في العرض بملء الشاشة والشاشة الخارجية: diaAvail = الترجمة الحالية ليها نص مشكّل؛
   diaTextOf = النص المشكّل لترجمة معيّنة (للترجمات الثلاث): undefined = مفيش، null = لسه بيتحمّل. سفر الصفحة فقط. */
function diaAvail(){return (trCur()==="svd"&&hasDia())||trCur()==="alab"}
function diaTextOf(d,k){const ab=book().abbr,key=d.c+":"+d.v;
  if(k==="svd"){if(!hasDia())return undefined;const t=trData();if(!t)return null;return (t.svdD&&t.svdD[key])||undefined}
  if(k==="alab"){const src="assets/kd_"+ab+".js";if(LOADED[src]===undefined){loadJS(src,()=>{});return null}if(LOADED[src]!==true)return null;const m=window.KD&&window.KD[ab];return (m&&m[key])||undefined}
  return undefined}
function diaOn(){return store.get("dia",false)===true&&((trCur()==="svd"&&hasDia())||hasKD())}
/* نص فاندايك الخفيف (assets/tx/svd_<السفر>.js) يكفي لعرض النص؛ الملف الكامل tr_<السفر>.js (أرقام سترونج والتشكيل وKJV) يُحمَّل عند الحاجة فقط */
function trLite(){const ab=book().abbr,L=window.TXB["svd/"+ab];if(L)return L;const src=`assets/tx/svd_${ab}.js`;if(JSFAIL[src])return false;if(LOADED[src]===undefined)loadJS(src,()=>render());return null}
function trText(d){const c=trCur();if(c==="alab")return diaOn()?kdGet(d):null;
  if(c==="svd"&&!(window.TR&&window.TR[book().abbr])&&!diaOn()){const L=trLite();if(L)return L[d.c+":"+d.v]||null;if(L===null)return null}
  const t=trData();if(!t)return null;const k=d.c+":"+d.v;if(diaOn()&&t.svdD&&t.svdD[k])return t.svdD[k];return (t[c]&&t[c][k])||null}
/* ---- اللغة الأصلية (عرض الأصحاح): نص Berean (WLC / Nestle) بترتيب الكلمات الأصلي ---- */
function origView(){return S.view==="chapter"||S.view==="verse"}
function origOn(){return origView()&&(MODE()==="study"||S.view==="verse")&&store.get("corig",false)===true}
function origLoad(ab){if(window.ORIG&&window.ORIG[ab])return window.ORIG[ab];const src="assets/orig_"+ab+".js";
  if(LOADED[src]===undefined)loadJS(src,()=>{if(origView())render()});return null}
function origSpan(d){const b=book(),O=origLoad(b.abbr),gr=b.id>39;
  if(!O)return `<span class="cvt orig-na">${LOADED["assets/orig_"+b.abbr+".js"]===true?"تعذّر تحميل النص الأصلي.":"جارٍ تحميل النص الأصلي…"}</span>`;
  const t=O[d.c+":"+d.v];
  if(!t)return `<span class="cvt orig-na">هذا العدد غير موجود في النص ${gr?"اليوناني (Nestle)":"العبري (WLC)"} الذي يعتمد عليه Berean.</span>`;
  return `<span class="cvt orig ${gr?"gr":"he"}" dir="${gr?"ltr":"rtl"}" lang="${gr?"grc":"he"}">${esc(t)}</span>`}
function trBar(extra){const av=trAvail(),og=origOn();const dia=!og&&((trCur()==="svd"&&hasDia())||hasKD())?`<button class="trb ${diaOn()?"on":""}" id="diaBtn" title="إظهار التشكيل أو إخفاؤه">تشكيل</button>`:"";
  const cst=S.view==="chapter"&&!og?`<button class="trb ${cstrOn()?"on":""}" id="cstrBtn" title="إظهار أرقام سترونج على كلمات النص؛ اضغط على الكلمة لعرض معناها">أرقام سترونج</button>`:"";
  const orig=origView()?`<button class="trb ${og?"on":""}" data-orig="1" title="النص العبري/اليوناني من Berean بدون الإنجليزي والنطق">اللغة الأصلية</button>`:"";
  return `<div class="trbar">${av.length>1?av.map(k=>`<button class="trb ${!og&&k===trCur()?"on":""}" data-tr="${k}">${TRN[k]}</button>`).join("")+orig+dia+cst:orig+cst}${extra||""}${fsGrp()}</div>`}
function segHTML(a){return a.map(([t,ns])=>ns.length?`<span class="sw" data-n="${ns.join(" ")}">${esc(t)}<sup>${ns.map(x=>`<span class="sn" data-sn="${x}" title="اعرض معنى ${x}">${x}</span>`).join(" ")}</sup></span>`:esc(t)).join("")}
/* ---- أرقام سترونج في عرض الأصحاح: الكلمة تفتح نافذة صغيرة بمعناها (assets/chstrong.js، يُحمَّل عند أول ضغطة) ----
   كتاب الحياة: أرقامه موجودة أصلًا في lib_<السفر>.js. فاندايك: assets/sg/svd_<السفر>.js (الأرقام فقط، يبنيه build_seo_pwa.js من tr_<السفر>.js)
   بدل الملف الكامل؛ ومع التشكيل أو KJV يُستخدم tr_<السفر>.js كما في صفحة العدد. */
/* العرض بملء الشاشة (assets/present.js، يُحمَّل عند أول ضغطة) — متاح في كل الأسفار (جُرّب أولًا على أفسس) */
function presOK(){return true}
/* العرض على شاشة خارجية (assets/screenctl.js + screen.html): الزرار يظهر بس لما الجهاز متوصل بشاشة تانية على وضع Extend
   (screen.isExtended في كروم وإيدج؛ فايرفوكس وسفاري مش بيقولوا فالزرار مش بيظهر) وعلى كمبيوتر (ماوس). نفس الشرط في PRESFIT.ext.
   بيظهر/يختفي لوحده لما شاشة تتوصل أو تتفصل، ويفضل ظاهر وقت العرض عشان «إيقاف». */
function extOK(){return !!(window.screen&&screen.isExtended===true)&&matchMedia("(pointer:fine)").matches}
function extSync(){document.querySelectorAll("[data-scr]").forEach(b=>{b.hidden=!extOK()&&!(window.SCR&&SCR.on)})}
try{window.screen&&screen.addEventListener&&screen.addEventListener("change",extSync)}catch(e){}
const SCR_IC='<svg class="tic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 5h12v9h-12z"/><path d="M15 9h6v10h-12v-5"/><path d="M7 18h4"/></svg>';
const PRES_IC='<svg class="tic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h18"/><path d="M4 4v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-10"/><path d="M12 16v4"/><path d="M9 20h6"/></svg>';
function MODE(){const m=store.get("umode","read");return ["read","study"].includes(m)?m:"read"}  /* وضع «خدمة» أُلغي؛ القيمة القديمة serve ترجع قراءة */
function interOn(){return (MODE()==="study"||S.view==="verse")&&store.get("inter",!1)===true}
/* الكلمات قابلة للضغط في كل الأوضاع؛ أرقام سترونج فوقها تظهر في وضع «دراسة» فقط (ويُطفئها القارئ من ⚙) */
function cstrOn(){return S.view==="chapter"&&!origOn()&&!interOn()}
function cstrSup(){return MODE()==="study"&&store.get("ucstr",true)===true}
const UDOTS='<svg class="tic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="19" cy="12" r="1.9"/></svg>';
const UGEAR='<svg class="tic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/></svg>';
function sgLite(){const ab=book().abbr,k="svd/"+ab;if(window.SG&&window.SG[k])return window.SG[k];const src=`assets/sg/svd_${ab}.js`;if(JSFAIL[src])return false;if(LOADED[src]===undefined)loadJS(src,()=>{if(S.view==="chapter")render()});return null}
function cstrSeg(d){const c=trCur();
  if(c==="alab")return diaOn()?kdArS(d):(d.arS||null);
  if(c==="svd"&&!diaOn()&&!(window.TR&&window.TR[book().abbr])){const L=sgLite();if(L){const a=L[d.c+":"+d.v];return a?a.map(x=>typeof x==="string"?[x,[]]:[x[0],x[1].split(" ")]):null}if(L===null)return null}
  return trSeg(d)}
function trSeg(d){const c=trCur();if(c==="alab")return null;const t=trData();if(!t)return null;const k=d.c+":"+d.v;if(diaOn()&&t.svdSD&&t.svdSD[k])return t.svdSD[k];const a=t[c+"S"]&&t[c+"S"][k];return a||null}
function viewSeg(){const INTER=interOn();return `<span class="trgrp seg"><button class="trb ${INTER?"":"on"}" data-inter="0">${ic("menu-2")} العرض العادي</button><button class="trb ${INTER?"on":""}" data-inter="1">${ic("language")} العرض بين السطور (Interlinear)</button></span>`}
function ilOpts(b){return `<div class="ilopts">${BSBB.includes(b.abbr)?`<div class="rg" role="radiogroup"><span class="rgt">المصدر</span><label class="rd ${store.get("isrc","ours")==="bsb"?"":"on"}"><input type="radio" name="isrc" data-isrc="ours" ${store.get("isrc","ours")==="bsb"?"":"checked"}><i></i>مكتبتنا (KJV + فاندايك)</label><label class="rd ${store.get("isrc","ours")==="bsb"?"on":""}"><input type="radio" name="isrc" data-isrc="bsb" ${store.get("isrc","ours")==="bsb"?"checked":""}><i></i>Berean (أصل عبري/يوناني)</label></div>`:""}<div class="rg"><span class="rgt">اتجاه النص</span><span class="dirgrp"><button class="dirb ${store.get("idir","rtl")==="rtl"?"on":""}" data-idir="rtl" title="محاذاة إلى اليمين (من اليمين إلى اليسار)" aria-label="محاذاة إلى اليمين (من اليمين إلى اليسار)" aria-pressed="${store.get("idir","rtl")==="rtl"}">${ic("align-right")}</button><button class="dirb ${store.get("idir","rtl")==="ltr"?"on":""}" data-idir="ltr" title="محاذاة إلى اليسار (من اليسار إلى اليمين)" aria-label="محاذاة إلى اليسار (من اليسار إلى اليمين)" aria-pressed="${store.get("idir","rtl")==="ltr"}">${ic("align-left")}</button></span>${fsGrp()}</div></div>`}
function ilItem(d,b,lnk){return `<div class="ilv">${lnk===false?`<span class="ilvn">${n(d.v)}</span>`:`<button class="ilvn" data-go="${d.b}.${d.c}:${d.v}">${n(d.v)}</button>${presOK()?`<button type="button" class="cvp" data-pres="${d.b}.${d.c}:${d.v}" title="اعرض من هذه الآية بملء الشاشة" aria-label="${vref(d)} — عرض بملء الشاشة">${PRES_IC}<span class="cvp-l">اعرض على الشاشة</span><span class="cvp-n">معروضة الآن</span></button>`:""}`}<div class="ilcol"><div class="ilar ar">${esc(ilText(d))}</div><div class="ilrow" dir="${BSBB.includes(b.abbr)&&store.get("isrc","ours")==="bsb"&&b.id>39?"ltr":"rtl"}">${BSBB.includes(b.abbr)&&store.get("isrc","ours")==="bsb"?interBlockB(d):interBlock(d)}</div>${fnBox(d,true)}</div></div>`}
function verseHTML(d){
  if(trCur()==="alab"&&diaOn()){const ks=kdArS(d);if(ks)return ks.map(([t,ns])=>ns.length?`<span class="sw" data-n="${ns.join(" ")}">${esc(t)}<sup>${ns.map(x=>`<span class="sn" data-sn="${x}" title="اعرض معنى ${x}">${x}</span>`).join(" ")}</sup></span>`:esc(t)).join("")}
  const sg=trSeg(d); if(sg){const h=segHTML(sg);return trCur()==="kjv"?`<span class="ltr" dir="ltr" style="display:block;text-align:left">${h}</span>`:h}
  const tt=trText(d); if(tt) return trCur()==="kjv"?`<span class="ltr" dir="ltr" style="display:block;text-align:left">${esc(tt)}</span>`:esc(tt);
  if(!d.arS) return esc(d.text);
  return d.arS.map(([t,ns])=>ns.length?`<span class="sw" data-n="${ns.join(" ")}">${esc(t)}<sup>${ns.map(x=>`<span class="sn" data-sn="${x}" title="اعرض معنى ${x}">${x}</span>`).join(" ")}</sup></span>`:esc(t)).join("");
}
const AI_IC='<svg class="tic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"/></svg>';
/* «اسأل Google AI»: assets/askai.js بيتحمّل أول مرة بس لما حد يدوس على الزرار */
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-askai]");if(!b||window.AskAI)return;e.preventDefault();loadJS("assets/askai.js?v=3",()=>window.AskAI&&window.AskAI.fromEl(b))});
function wordsFor(d,num){ return d&&d.arS ? d.arS.filter(([t,ns])=>ns.includes(num)).map(([t])=>t) : []; }
function dentHTML(num,d=cur()){
  const e=STRONG[num];
  if(!e) return `<div class="dent"><div class="hd"><span class="num">${num}</span></div><p class="na">هذا المدخل غير متاح.</p></div>`;
  const ws=wordsFor(d,num);
  return `<div class="dent">
    <div class="hd"><span class="num">${num}</span><span class="orig ${isHeb(num)?"he":""}">${e.o}</span><span class="tr"><b>${e.tr}</b> · ${e.pr}</span>
      <a class="stopen" href="search.html#tab=strong&q=${num}" target="_blank" rel="noopener">فتح في صفحة سترونج ${ic("external-link")}</a>
      <button type="button" class="stai" data-askai data-num="${num}" data-ref="${d&&d.c?esc(AR[book().abbr]+" "+n(d.c)+": "+n(d.v)):""}" data-words="${esc(ws.join("، "))}" title="اسأل وضع الذكاء الاصطناعي في Google عن هذه الكلمة">${AI_IC} اسأل Google AI</button>
      <a class="rep" href="${repHref(num+(d&&d.c?" — "+AR[book().abbr]+" "+n(d.c)+": "+n(d.v):""),"قاموس سترونج")}" target="tskcontact" title="أبلغ عن خطأ في هذا المدخل أو في رقم سترونج لهذه الكلمة">${REP_IC}<span>أبلغ عن خطأ</span></a>
      ${ws.length?`<span class="inv"><small>في النص:</small>${ws.map(esc).join("، ")}</span>`:""}</div>
    <div class="cols">
      <div class="col arc"><h5>المعنى بالعربية</h5>${e.ar?(p=>`${p.g?`<p class="sgl">${linkRefs(esc(p.g))}</p>`:""}<div class="tx">${linkRefs(esc(p.rest))}</div>`)(strongParts(e.ar)):`<div class="tx"><span class="na">الترجمة العربية لهذا المدخل غير متاحة بعد (تُترجم حاليًا كلمات أعداد السفر فقط).</span></div>`}</div>
      <div class="col enc"><h5>النص الإنجليزي الأصلي</h5><div class="tx">${linkRefs(e.d)}</div></div>
    </div>
    ${DICT.trail.length?`<div class="back"><a id="dback">→ رجوع إلى ${DICT.trail[DICT.trail.length-1]}</a></div>`:""}
  </div>`;
}
/* كلمات العدد كأزرار في تبويب «معنى الكلمات»: تشتغل باللمس والماوس والكيبورد وقارئ الشاشة */
function dictWords(d){
  const sg=(trCur()==="alab"&&diaOn()&&kdArS(d))||trSeg(d)||d.arS; if(!sg)return "";
  const seen=new Set(), ws=sg.filter(([t,ns])=>ns&&ns.length&&!seen.has(ns[0])&&seen.add(ns[0]));
  if(!ws.length)return "";
  return `<div class="dwords" role="group" aria-label="كلمات العدد">${ws.map(([t,ns])=>{const on=ns.includes(DICT.cur);
    return `<button type="button" class="dword ${on?"on":""}" data-dn="${ns[0]}" aria-pressed="${on}" dir="auto"><span>${esc(String(t).replace(/[^\p{L}\p{M}\s'’-]/gu,"").trim()||t)}</span><small>${ns[0]}</small></button>`}).join("")}</div>`;
}
/* مدخل سترونج بالعربية = الأصل؛ المعنى. «ترجمتها في KJV: …» هي أقصر وأوضح إجابة، فتظهر أولًا بخط كبير والباقي تحتها */
function strongParts(ar){
  const M="ترجمتها في KJV:", i=String(ar||"").indexOf(M); if(i<0) return {g:"",rest:ar||""};
  const after=ar.slice(i+M.length), m=after.match(/^\s*([\s\S]*?)\.(\s*(?:قارن|انظر)[\s\S]*)?\s*$/);
  const g=(m?m[1]:after).trim(), tail=m&&m[2]?m[2].trim():"";
  return {g, rest:(ar.slice(0,i).trim()+(tail?" "+tail:"")).trim()};
}
window.strongParts=strongParts;
function dictInner(){
  const d=cur(), dw=dictWords(d);
  const hist=DICT.hist.map(x=>`<button data-dn="${x}" class="${x===DICT.cur?"on":""}">${x}</button>`).join("");
  return `<div class="dhead"><h3><em>«</em>قاموس سترونج<em>»</em></h3><div class="hist">${hist}</div></div>
    ${dw}${DICT.cur?dentHTML(DICT.cur):`<div class="empty">${dw?"اختر كلمة لتعرف أصلها ومعناها.":"اضغط على أي كلمة في نص العدد بالأعلى لعرض معناها هنا."}</div>`}`;
}
function dictSection(d){ return d.arS?`<section class="dict" id="dict">${dictInner()}</section>`:""; }
/* Interlinear في صفحة العدد: الضغط على رقم سترونج يفتح القاموس في الصفحة (زي العرض العادي) بدل صفحة سترونج.
   capture على window علشان يسبق nav.js ويمنع فتح الرابط. في صفحة الأصحاح (مفيش #dict) الرابط يفضل زي ما هو. */
window.addEventListener("click",e=>{const a=e.target.closest&&e.target.closest(".ilist a.iln");if(!a||!$("#dict"))return;
  const num=(a.getAttribute("href")||"").split("#")[1]||a.textContent.trim();if(!/^[GH]\d+$/.test(num))return;
  e.preventDefault();e.stopPropagation();showEntry(num)},true);
function showEntry(num,{fromRef=false,scroll=true}={}){
  {const b0=$("#dict"),a=document.activeElement;if(b0&&a&&b0.contains(a)&&a.dataset.dn)showEntry.fd=a.dataset.dn} /* نرجّع التركيز لنفس الزر بعد تحميل القاموس */
  if(!needStrong(()=>showEntry(num,{fromRef,scroll}),()=>{const bx=$("#dict");if(bx)bx.innerHTML=loadFail("قاموس سترونج",`data-jsretry="assets/strong.js" data-dn="${num}"`)})){const bx=$("#dict");if(bx)bx.innerHTML=`<div class="empty loading">جارٍ تحميل قاموس سترونج…</div>`;return}
  if(fromRef && DICT.cur) DICT.trail.push(DICT.cur); else if(!fromRef) DICT.trail=[];
  DICT.cur=num; if(!DICT.hist.includes(num)) DICT.hist.push(num);
  const box=$("#dict"); if(!box) return;
  const fd=showEntry.fd; showEntry.fd=null;
  box.innerHTML=dictInner();
  if(fd){const f=box.querySelector(`.dwords [data-dn="${fd}"]`)||box.querySelector(`[data-dn="${fd}"]`);if(f)f.focus({preventScroll:true})}
  document.querySelectorAll(".verse-card .sw").forEach(x=>x.classList.toggle("on",x.dataset.n.split(" ").includes(num)));
  if(scroll) box.scrollIntoView({behavior:"smooth",block:"start"});
}

/* ---------- views ---------- */
function viewHome(){
  const last=cur();
  $("#main").innerHTML = crumbs("مكتبة دراسة الشواهد","") + `
  <a class="resume" href="#" data-go="${last.b}.${last.c}:${last.v}"><small>تابع القراءة</small><b>${vref(last)}</b><span class="ar">${esc(last.text)}</span></a>
  <div class="grp-home">${groupedBooks(LIB.map(b=>({id:b.id,abbr:b.abbr,nc:b.chapters.length,nv:b.verses.length})),c=>`<button class="mini" data-book="${c.id}"><span class="ab">${SH[c.abbr]}</span><b>${AR[c.abbr]}</b></button>`,0,new Set(BKGRP.map(g=>g[1]+"")))}</div>`;
}

/* غلاف السفر: img/books/<abbr>All — النسخ المصغّرة في img/web (من assets/imgs.js)، ثم الأصل، ثم غلاف بشعار الموقع */
function viewBook(){
  const b=book(), key=b.abbr+"All", M=window.IMGS||{}, meta=(window.BOOKIMG||{})[b.abbr]||{};
  const sub=`${trCur()==="kjv"?`<span class="ltr">${b.en}</span> · `:""}${chs(b.chapters.length)} · ${n(b.verses.length)} عددًا`;
  const chips=`<div class="chpick big">${b.chapters.map(x=>`<button data-gc="${b.id}.${x}" class="chp" title="الأصحاح ${n(x)}">${n(x)}</button>`).join("")}</div>`;
  const g=BKGRP.find(x=>b.id>=x[1]&&b.id<=x[2]);
  const alt=esc(meta.alt||`${bname(b)} — صورة غلاف السفر`), sz=`(max-width:1020px) 100vw, 960px`;
  const raw=["jpg","png","jpeg","webp"].map(e=>`img/books/${key}.${e}`);
  const art=M[key]
    ? `<picture><source type="image/webp" srcset="img/web/${key}-800.webp 800w, img/web/${key}-1600.webp 1600w" sizes="${sz}"><img src="img/web/${key}-1600.jpg" srcset="img/web/${key}-800.jpg 800w, img/web/${key}-1600.jpg 1600w" sizes="${sz}" alt="${alt}" width="${M[key][0]}" height="${M[key][1]}" decoding="async" fetchpriority="high" data-try="${raw.join("|")}" onerror="bkImgFail(this)"></picture>`
    : `<img src="${raw[0]}" alt="${alt}" decoding="async" fetchpriority="high" data-try="${raw.slice(1).join("|")}" onerror="bkImgFail(this)">`;
  $("#main").innerHTML = `<div class="stickbar ubar ubk"><button class="menu-btn" id="menu" aria-label="القائمة">${ic("menu-2")}</button><span class="sp"></span></div>` + `
  <figure class="bkhero" style="--pos:${meta.pos||"50% 50%"}">
    ${art}
    <figcaption class="bkcap">
      <span class="eyebrow">${g?g[0]+" · ":""}السفر ${n(b.id)} من ٦٦</span>
      <h1>${bname(b)}</h1>
      <span class="bksub">${sub}</span>
      <button class="cta" data-gc="${b.id}.${b.chapters[0]}">ابدأ القراءة ←</button>
    </figcaption>
  </figure>
  ${meta.note?`<p class="bknote">${esc(meta.note)}</p>`:""}
  <h2 class="bksec">الأصحاحات</h2>
  ${chips}`+notesLink(b)+olBook(b);
}
window.bkImgFail=function(img){
  const f=img.closest("figure"); if(!f) return;
  f.querySelectorAll("source").forEach(x=>x.remove()); img.removeAttribute("srcset");
  const rest=(img.dataset.try||"").split("|").filter(Boolean);
  if(rest.length){img.dataset.try=rest.slice(1).join("|"); img.src=rest[0]; return}
  const pic=img.closest("picture")||img;
  pic.outerHTML=`<div class="bkart" aria-hidden="true"><img src="assets/brand/mark-on-navy.svg" alt=""></div>`;
  f.classList.add("noimg");
};

function ilText(d){if(trCur()==="alab"&&diaOn()){const x=kdGet(d);if(x)return x}const t=trData(),k=d.c+":"+d.v;if(t&&t.svd){if(diaOn()&&t.svdD&&t.svdD[k])return t.svdD[k];if(t.svd[k])return t.svd[k]}return d.text}
function interBlock(d){
  const t=trData(), key=d.c+":"+d.v, kj=t&&t.kjvS&&t.kjvS[key];
  if(!t) return `<div class="ilv-none">جارٍ التحميل…</div>`;
  if(!kj) return `<div class="ilv-none">لا يتوفر تفسير كلمة بكلمة لهذا العدد</div>`;
  const FN=new Set("G3588 G2532 G1161 G3767 G846 G848 G3450 G3165 G1473 G4675 G4571 G4771 G5216 G5209 G5210 G2257 G2254 G2248 G2249 G1438".split(" "));
  const ST=window.STRONG||{};
  /* نص فاندايك الموسوم: لكل رقم سترونج قائمة بالكلمات العربية بالترتيب */
  const q={}; ((t.svdS&&t.svdS[key])||[]).forEach(([w,ns],si)=>{let m=ns.findIndex(x=>!FN.has(x)); if(m<0)m=0; ns.forEach((x,i)=>{(q[x]=q[x]||[]).push({w:i===m?w.trim():"〃",si,used:false})})});
  const cell=(x,eng,ara,cls)=>{const e=ST[x]||{}; return `<div class="ilc${cls||""}"><a class="iln" href="search.html#tab=strong&q=${x}" target="_blank">${x}</a><span class="ilo">${esc(e.o||"")}</span><span class="ilt">${esc(e.tr||"")}</span><span class="ilk">${esc(eng)}</span><span class="ila">${esc(ara)}</span></div>`};
  const out=[];
  kj.forEach(([w,ns])=>{
    const word=w.trim(); if(!word) return;
    if(!ns.length){out.push({si:-1,h:`<div class="ilc ilc-x"><span class="ilk">${esc(word)}</span></div>`});return}
    ns.forEach((x,i)=>{const it=q[x]&&q[x].find(z=>!z.used); if(it)it.used=true;
      out.push({si:it?it.si:-1,h:cell(x,i?"〃":word,it?it.w:"")})})});
  /* أرقام سترونج الموجودة في فاندايك ولم ترد في KJV: تُضاف بعد أقرب كلمة سابقة لها */
  const left=[]; Object.keys(q).forEach(x=>q[x].forEach(it=>{if(!it.used)left.push({x,it})}));
  left.sort((a,b)=>a.it.si-b.it.si).forEach(({x,it})=>{
    let at=-1; for(let j=out.length-1;j>=0;j--){if(out[j].si>=0&&out[j].si<=it.si){at=j;break}}
    out.splice(at+1,0,{si:it.si,h:cell(x,"—",it.w," ilc-s")})});
  return out.map(o=>o.h).join("");
}
/* بين السطور في العرض بملء الشاشة والشاشة الخارجية (present.js / screenctl.js): نفس خانات صفحة الأصحاح وبنفس المصدر المختار
   (مكتبتنا KJV+فاندايك أو Berean). يرجّع {ar, cells:[HTML لكل كلمة], dir} أو null لو لسه بيتحمّل. سفر الصفحة فقط. */
function ilSlide(d){const b=book(),bsb=BSBB.includes(b.abbr)&&store.get("isrc","ours")==="bsb";
  if(!bsb&&!needStrong(()=>{}))return null;   /* الكلمة الأصلية ونطقها من قاموس سترونج */
  const h=bsb?interBlockB(d):interBlock(d);if(/ilv-none[^>]*>جارٍ التحميل/.test(h))return null;
  return {ar:ilText(d),cells:h.split(/(?=<div class="ilc)/).filter(Boolean),dir:bsb&&b.id>39?"ltr":"rtl"}}
/* ---- Interlinear بديل: النص العبري/اليوناني من BSB (تجربة) ---- */
const BSBB=["Gen", "Exo", "Lev", "Num", "Deu", "Jos", "Jdg", "Rut", "1Sa", "2Sa", "1Ki", "2Ki", "1Ch", "2Ch", "Ezr", "Neh", "Est", "Job", "Psa", "Pro", "Ecc", "Son", "Isa", "Jer", "Lam", "Eze", "Dan", "Hos", "Joe", "Amo", "Oba", "Jon", "Mic", "Nah", "Hab", "Zep", "Hag", "Zec", "Mal", "Mat", "Mar", "Luk", "Joh", "Act", "Rom", "1Co", "2Co", "Gal", "Eph", "Phi", "Col", "1Th", "2Th", "1Ti", "2Ti", "Tit", "Phm", "Heb", "Jam", "1Pe", "2Pe", "1Jo", "2Jo", "3Jo", "Jud", "Rev"];
function bsbLoad(abbr){const rr=()=>{if(S.view==="chapter"||S.view==="verse")render()}; /* صفحة العدد كانت بتفضل على «جارٍ التحميل» */
  if(!window.BSBP&&LOADED["assets/bsb_parse.js"]===undefined)loadJS("assets/bsb_parse.js",rr);
  if(window.BSBI&&window.BSBI[abbr])return window.BSBI[abbr];const src="assets/bsb_"+abbr+".js";
  if(LOADED[src]===undefined)loadJS(src,rr);return null}
function interBlockB(d){const ab=book().abbr,B=bsbLoad(ab);if(!B)return `<div class="ilv-none">جارٍ التحميل…</div>`;
  const w=B[d.c+":"+d.v];if(!w)return `<div class="ilv-none">لا يتوفر هذا العدد في هذا المصدر</div>`;
  const ST=window.STRONG||{};
  const fl=fnHas(d)||[];return w.map(([o,tr,sid,pc,en,pn],wi)=>{const fm=fl.map((x,i)=>x[0]===wi?i+1:0).filter(Boolean);const e=ST[sid]||{};const tip=((window.BSBP&&window.BSBP[pc])||pc)+(e.ar?" — "+e.ar:"");
    return `<div class="ilc" title="${esc(tip)}"><a class="iln" href="search.html#tab=strong&q=${sid}" target="_blank">${sid||"&nbsp;"}</a><span class="ilo">${esc(o)}</span><span class="ilt">${esc(tr)}</span><span class="ilk">${esc(en||"—")}${esc(pn)}${fm.length?`<sup class="fnm" title="حاشية">${fm.map(n).join("،")}</sup>`:""}</span><span class="ilp ltr">${esc(pc)}</span></div>`}).join("")}
/* ---- حواشي Berean (Footnotes) مع الترجمة العربية ---- */
function fnLoad(abbr){if(window.FN&&window.FN[abbr])return window.FN[abbr];const src="assets/fn_"+abbr+".js";
  if(LOADED[src]===undefined)loadJS(src,()=>{if(["chapter","verse"].includes(S.view))render()});return null}
function fnHas(d){const F=fnLoad(book().abbr);return F&&F[d.c+":"+d.v]||null}
const fnItem=(x,i)=>`<div class="fni"><b class="fnn">${n(i+1)}</b><div><div class="fnar">${x[2]||""}</div><div class="fnen ltr" dir="ltr">${x[1]}</div></div></div>`;
function fnBox(d,open){const L=fnHas(d);if(!L)return "";return `<details class="fnbox" ${open?"open":""}><summary>${ic("note")} حواشي Berean (${n(L.length)})</summary>${L.map(fnItem).join("")}</details>`}
function fnChapter(b,vs){const F=fnLoad(b.abbr);if(!F)return "";const rows=[];vs.forEach(d=>{const L=F[d.c+":"+d.v];if(L)L.forEach(x=>rows.push([d,x]))});if(!rows.length)return "";
  return `<details class="fnbox"><summary>${ic("note")} حواشي Berean لهذا الأصحاح (${n(rows.length)})</summary>${rows.map(([d,x])=>`<div class="fni"><a class="fnv" href="#/${b.abbr}/${d.c}:${d.v}" data-go="${d.b}.${d.c}:${d.v}">${n(d.v)}</a><div><div class="fnar">${x[2]||""}</div><div class="fnen ltr" dir="ltr">${x[1]}</div></div></div>`).join("")}</details>`}
/* ---- فهرس المواضيع (Nave / Torrey / BibleHub) ---- */
const TPB=["Gen","Exo","Lev","Num","Deu","Jos","Jdg","Rut","1Sa","2Sa","1Ki","2Ki","1Ch","2Ch","Ezr","Neh","Est","Job","Psa","Pro","Ecc","Son","Isa","Jer","Lam","Eze","Dan","Hos","Joe","Amo","Oba","Jon","Mic","Nah","Hab","Zep","Hag","Zec","Mal","Mat","Mar","Luk","Joh","Act","Rom","1Co","2Co","Gal","Eph","Phi","Col","1Th","2Th","1Ti","2Ti","Tit","Phm","Heb","Jam","1Pe","2Pe","1Jo","2Jo","3Jo","Jud","Rev"];
function tpLoad(abbr){if(!TPB.includes(abbr))return null;if(window.TPBK&&window.TPBK[abbr])return window.TPBK[abbr];const src="assets/tp_"+abbr+".js";
  if(LOADED[src]===undefined)loadJS(src,()=>{if(S.view==="verse")render()});return null}
function tpChips(d){const P=tpLoad(book().abbr);if(!P)return "";
  const ts=P.filter(t=>t[4].some(r=>(d.c>r[0]||(d.c===r[0]&&d.v>=r[1]))&&(d.c<r[2]||(d.c===r[2]&&d.v<=r[3]))));
  if(!ts.length)return "";
  const chip=t=>`<a class="tpc" target="_blank" href="topics.html#t=${t[0]}" title="${esc(t[2])}">${esc(t[3]||t[2])}</a>`;
  const MAX=30;
  return `<details class="tpbox"><summary>${ic("tags")} مواضيع هذا العدد (${n(ts.length)})</summary><div class="tpchips">${ts.slice(0,MAX).map(chip).join("")}${ts.length>MAX?`<details class="tpmore"><summary>عرض ${n(ts.length-MAX)} موضوعًا آخر</summary>${ts.slice(MAX).map(chip).join("")}</details>`:""}</div></details>`}
/* ---- مخطط السفر (Berean Study Bible Outlines) ---- */
const OLB=["Gen", "Exo", "Lev", "Num", "Deu", "Jos", "Jdg", "Rut", "1Sa", "2Sa", "1Ki", "2Ki", "1Ch", "2Ch", "Ezr", "Neh", "Est", "Job", "Psa", "Pro", "Ecc", "Son", "Isa", "Jer", "Lam", "Eze", "Dan", "Hos", "Joe", "Amo", "Oba", "Jon", "Mic", "Nah", "Hab", "Zep", "Hag", "Zec", "Mal", "Mat", "Mar", "Luk", "Joh", "Act", "Rom", "1Co", "2Co", "Gal", "Eph", "Phi", "Col", "1Th", "2Th", "1Ti", "2Ti", "Tit", "Phm", "Heb", "Jam", "1Pe", "2Pe", "1Jo", "2Jo", "3Jo", "Jud", "Rev"];
function olLoad(abbr){if(!OLB.includes(abbr))return null;if(window.OL&&window.OL[abbr])return window.OL[abbr];
  const src="assets/ol_"+abbr+".js";if(LOADED[src]===undefined)loadJS(src,()=>{if(S.view==="chapter"||S.view==="verse"||S.view==="book")render()});return null}
const olIn=(r,c,v)=>(c>r[3]||(c===r[3]&&v>=r[4]))&&(c<r[5]||(c===r[5]&&v<=r[6]));
const olFmt=r=>r[3]===r[5]?`${n(r[3])}: ${n(r[4])}–${n(r[6])}`:`${n(r[3])}: ${n(r[4])} – ${n(r[5])}: ${n(r[6])}`;
function olRow(b,r,c){const v=r[3]<c?1:r[4];return `<a class="olr l${r[0]}" href="#/${b.abbr}/${c}:${v}" data-go="${b.id}.${c}:${v}"><span class="ort">${esc(r[2]||r[1])}</span><span class="ore ltr">${esc(r[1])}</span><span class="orn">${olFmt(r)}</span></a>`}
const NOTES=["Gen","Exo","Lev","Num","Deu","Jos","Jdg","Rut","1Sa","2Sa","1Ki","2Ki","1Ch","2Ch","Ezr","Neh","Est","Job","Psa","Pro","Ecc","Son","Isa","Jer","Lam","Eze","Dan","Hos","Joe","Amo","Oba","Jon","Mic","Nah","Hab","Zep","Hag","Zec","Mal","Mat","Mar","Luk","Joh","Act","Rom","1Co","2Co","Gal","Eph","Phi","Col","1Th","2Th","1Ti","2Ti","Tit","Phm","Heb","Jam","1Pe","2Pe","1Jo","2Jo","3Jo","Jud","Rev"];
function notesLink(b){return NOTES.includes(b.abbr)?`<a class="notelink" href="notes.html?b=${b.abbr}" target="tsknotes">${ic("note")} ملاحظات على الترجمات في هذا السفر ${ic("external-link")}</a>`:""}
function olBook(b){const O=olLoad(b.abbr);if(!O)return "";
  return `<details class="olbox" open><summary>${ic("bookmarks")} مخطط السفر</summary>${O.map(r=>olRow(b,r,r[3])).join("")}<a class="olall" href="outline.html?b=${b.abbr}" target="tskoutline">صفحة المخطط كاملة ${ic("external-link")}</a></details>`}
function olChapter(b,c){const O=olLoad(b.abbr);if(!O)return "";
  const rows=O.filter(r=>r[3]<=c&&r[5]>=c);if(!rows.length)return "";
  return `<details class="olbox" open><summary>${ic("bookmarks")} مخطط السفر — الأصحاح ${n(c)}</summary>${rows.map(r=>olRow(b,r,c)).join("")}<a class="olall" href="outline.html?b=${b.abbr}" target="tskoutline">مخطط السفر كاملًا ${ic("external-link")}</a></details>`}
function olVerse(b,d){const O=olLoad(b.abbr);if(!O)return "";
  const rows=O.filter(r=>olIn(r,d.c,d.v));if(!rows.length)return "";
  return `<div class="olpath">${ic("bookmarks")} ${rows.map(r=>`<span>${esc(r[2]||r[1])} <small>(${olFmt(r)})</small></span>`).join(" ‹ ")} <a href="outline.html?b=${b.abbr}" target="tskoutline">المخطط كاملًا ${ic("external-link")}</a></div>`}
/* صورة الأصحاح: img/web/<abbr><c> (من assets/imgs.js) ← img/<abbr><c>.jpg|png|jpeg|webp ← شعار الموقع */
function chImage(b,c){
  const key=b.abbr+c, M=window.IMGS||{}, alt=`${bname(b)} — الأصحاح ${n(c)}`;
  const raw=["jpg","png","jpeg","webp"].map(e=>`img/${key}.${e}`);
  const cap=`<figcaption class="chcap"><span>${bname(b)}</span><b>الأصحاح ${n(c)}</b></figcaption>`;
  if(M[key]){const s=w=>`img/web/${key}-${w}`, sz=`(max-width:1020px) 100vw, 960px`;
    return `<figure class="chhero"><picture><source type="image/webp" srcset="${s(800)}.webp 800w, ${s(1600)}.webp 1600w" sizes="${sz}"><img src="${s(1600)}.jpg" srcset="${s(800)}.jpg 800w, ${s(1600)}.jpg 1600w" sizes="${sz}" alt="${esc(alt)}" width="${M[key][0]}" height="${M[key][1]}" decoding="async" data-try="${raw.join("|")}" onerror="chImgFail(this)"></picture>${cap}</figure>`}
  return `<figure class="chhero"><img src="${raw[0]}" alt="${esc(alt)}" decoding="async" data-try="${raw.slice(1).join("|")}" onerror="chImgFail(this)">${cap}</figure>`;
}
window.chImgFail=function(img){
  const f=img.closest("figure"); if(!f) return;
  f.querySelectorAll("source").forEach(x=>x.remove()); img.removeAttribute("srcset");
  const rest=(img.dataset.try||"").split("|").filter(Boolean);
  if(rest.length){img.dataset.try=rest.slice(1).join("|"); img.src=rest[0]; return}
  f.className="chhero chlogo";
  f.innerHTML=`<img class="logo-l" src="assets/brand/logo-stacked-light.svg" alt="جدد وعتقاء — كنوز الكتاب المقدس" width="320" height="230"><img class="logo-d" src="assets/brand/logo-stacked-dark.svg" alt="" width="320" height="230">`;
};
function viewChapter(){
  const M=MODE(), ST=M==="study", RD=M==="read", INTER=interOn(), SCRON=!!(window.SCR&&SCR.on);   /* الشاشة الخارجية شغالة: زر «اعرض» جنب كل آية */
  if(INTER) needStrong(()=>{if(S.view==="chapter")render()});
  const b=book(), c=S.c, vs=inCh(b,c), ci=b.chapters.indexOf(c);
  const pc=b.chapters[ci-1], nc=b.chapters[ci+1], me=CAT_ABBR[b.abbr];
  const pb=pc==null&&CAT[me.i-1], nb=nc==null&&CAT[me.i+1];
  const prevBtn=pc!=null?`<button data-gc="${b.id}.${pc}" title="الأصحاح السابق">→ <span class="lb">الأصحاح ${n(pc)}</span></button>`
    :pb?`<a class="xnav" href="${pageOf(pb.abbr,"/"+pb.abbr+"/ch/"+parseInt(pb.last))}" title="السفر السابق">→ <span class="lb">${SH[pb.abbr]} ${n(parseInt(pb.last))}</span></a>`
    :`<button disabled>→</button>`;
  const nextBtn=nc!=null?`<button data-gc="${b.id}.${nc}" title="الأصحاح التالي"><span class="lb">الأصحاح ${n(nc)}</span> ←</button>`
    :nb?`<a class="xnav" href="${pageOf(nb.abbr,"/"+nb.abbr+"/ch/1")}" title="السفر التالي"><span class="lb">${SH[nb.abbr]} ${n(1)}</span> ←</a>`
    :`<button disabled>←</button>`;
  const refs=vs.reduce((a,x)=>a+refCount(x),0), CS=cstrOn(), PEND=SPLIT&&!chHas(c), PFAIL=PEND&&chFailed(c);
  const og=origOn(), av=trAvail(), SUP=cstrSup();
  const trSel=`<select class="utr" aria-label="الترجمة">${av.map(k=>`<option value="${k}" ${!og&&k===trCur()?"selected":""}>${TRN[k]}</option>`).join("")}${ST&&origView()?`<option value="orig" ${og?"selected":""}>اللغة الأصلية</option>`:""}</select>`;
  const bar=`<div class="stickbar ubar"><button class="menu-btn" id="menu" aria-label="القائمة">${ic("menu-2")}</button><span class="sp"></span>${trSel}<button type="button" class="ubtn" id="uMore" aria-label="المزيد" aria-haspopup="menu" aria-expanded="false">${UDOTS}</button><button type="button" class="ubtn" id="uGear" aria-label="إعدادات العرض" aria-haspopup="dialog">${UGEAR}</button></div>`;
  const modes=`<div class="umodes" role="tablist" aria-label="وضع الصفحة">${[["read","قراءة"],["study","دراسة"]].map(([k,x])=>`<button type="button" role="tab" aria-selected="${M===k}" data-umode="${k}">${x}</button>`).join("")}</div>`;
  const head=`<div class="uhead"><h1>${bname(b)} <span>${n(c)}</span></h1><small>${trCur()==="kjv"?`<span class="ltr">${b.en} ${c}</span> · `:""}${n(vs.length)} عددًا · ${PEND?"…":n(refs)} شاهدًا</small></div>`;
  const CMP=`<a class="trb" href="compare.html?b=${b.abbr}&c=${c}">${ic("arrows-left-right")} مقارنة الترجمات</a>`;
  const tools=ST?`<div class="utools"><button type="button" class="trb ${INTER?"on":""}" data-inter="${INTER?0:1}" aria-pressed="${INTER}">${ic("language")} كلمة بكلمة</button>${origView()?(og?`<button type="button" class="trb on" data-tr="${trCur()}" aria-pressed="true">اللغة الأصلية</button>`:`<button type="button" class="trb" data-orig="1" aria-pressed="false">اللغة الأصلية</button>`):""}${!og&&!INTER?`<button type="button" class="trb ${SUP?"on":""}" id="cstrBtn" aria-pressed="${SUP}">أرقام سترونج</button>`:""}${CMP}</div>${INTER?ilOpts(b):""}`:"";
  const serveBar=RD?`<div class="userve">${presOK()?`<button type="button" class="trb" data-pres="${b.id}.${c}:${vs[0].v}">${PRES_IC} عرض بملء الشاشة</button>`:""}${matchMedia("(pointer:fine)").matches?`<button type="button" class="trb ${window.SCR&&SCR.on?"on":""}" data-scr="1" ${extOK()||(window.SCR&&SCR.on)?"":"hidden"}>${SCR_IC} <span>${window.SCR&&SCR.on?"إيقاف الشاشة الخارجية":"العرض على شاشة خارجية"}</span></button>`:""}</div>`:"";
  const rows=vs.map(d=>{const rc=refCount(d), g=`${d.b}.${d.c}:${d.v}`, kj=trCur()==="kjv"&&!og?'dir="ltr" style="text-align:left"':"";
    const txt=og?origSpan(d):`<span class="cvt ar" ${kj}>${CS?(sg=>sg?segHTML(sg):esc(trText(d)||d.text||""))(cstrSeg(d)):esc(trText(d)||d.text||"")}</span>`;
    const foot=ST?`<div class="cvf">${SCRON?`<button type="button" class="cvp" data-pres="${g}" title="اعرض هذه الآية على الشاشة الخارجية" aria-label="${vref(d)} — اعرض على الشاشة الخارجية">${PRES_IC}<span class="cvp-l">اعرض</span><span class="cvp-n">معروضة الآن</span></button>`:""}<button type="button" class="cvm" data-go="${g}" title="${vref(d)} — كل تفاصيل العدد والقاموس">${PEND?"…":rc?n(rc)+" شاهدًا":"—"}</button>${cpyBtn("v",g,vref(d),"pl")}</div>`
      :SCRON?`<div class="cvf">${SCRON?`<button type="button" class="cvp" data-pres="${g}" title="اعرض هذه الآية على الشاشة الخارجية" aria-label="${vref(d)} — اعرض على الشاشة الخارجية">${PRES_IC}<span class="cvp-l">اعرض</span><span class="cvp-n">معروضة الآن</span></button>`:""}</div>`:"";
    return `<div class="cvw"><div class="cv cvs" data-gk="${g}"><button type="button" class="cvn" data-uref="${g}" aria-label="${vref(d)} — اعرض الشواهد" title="اعرض شواهد ${vref(d)}">${n(d.v)}</button>${txt}</div>${foot}</div>`}).join("");
  $("#main").innerHTML = bar+modes+head+(store.get("uimg",false)?chImage(b,c):"")+tools+serveBar+(ST?olChapter(b,c):"")
    +(INTER?`<div class="ilist ${store.get("idir","rtl")==="ltr"?"ltr":""}">${vs.map(d=>ilItem(d,b)).join("")}</div>`:"")
    +(PEND?(PFAIL?`<div class="chload fail">تعذّر تحميل شواهد هذا الأصحاح — غالبًا الجهاز غير متصل بالإنترنت. <button type="button" class="trb" data-chretry="${c}">إعادة المحاولة</button></div>`:`<div class="chload" role="status">جارٍ تحميل الشواهد…</div>`):"")
    +`<div class="cvlist umode-${SCRON&&!ST?"serve":M} ${CS?"cstr":""} ${SUP?"":"nosup"} ${trCur()==="kjv"&&!og?"ultr":""}" ${INTER?"hidden":""}>${rows}</div>`
    +(ST?fnChapter(b,vs):"")
    +`<div class="chfoot"><div class="nav">${prevBtn}${nextBtn}</div></div>`;
}
/* سهم العدد السابق/التالي على جانبي الآية (بديل سطر «العدد السابق والتالي») */
function vArrow(x,cls,label,path){if(!x)return "";const t=vref(x)+" — "+x.text;
  return `<button type="button" class="vnav ${cls}" data-go="${x.b}.${x.c}:${x.v}" aria-label="${label}: ${esc(vref(x))}" title="${esc(t.length>90?t.slice(0,90)+"…":t)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg></button>`}
function viewVerse(){
  /* صفحة العدد: الشريط الموحّد، ثم الآية، ثم تبويبات: الشواهد · معنى الكلمات · ملاحظات */
  DICT={cur:null,hist:[],trail:[]};
  const INTER=interOn();
  if(INTER) needStrong(()=>{if(S.view==="verse")render()}); /* الكلمة الأصلية ونطقها في خانات Interlinear */
  const b=book(), d=cur(), k=K(d.b,d.c,d.v), gi0=GIDX[k];
  const prev=ALL[gi0-1], next=ALL[gi0+1];
  const g=`${d.b}.${d.c}:${d.v}`, og=origOn(), av=trAvail(), kj=trCur()==="kjv"&&!og;
  if(S.sn&&S.sn.k===b.abbr+"/"+d.c+":"+d.v) S.vtab="dict";
  const isNoteG=x=>!!x&&!x.refs.length&&!!x.note;
  /* ملاحظات TSK (بدون شواهد) → تبويب «ملاحظات» */
  const notes=[];
  d.groups.forEach((x,gi)=>{
    if(!isNoteG(x)) return;
    if(!x.kw&&isNoteG(d.groups[gi-1])) return; /* بقية ملاحظة سابقة: تُعرض ضمن بطاقتها */
    const parts=[x]; for(let j=gi+1;j<d.groups.length;j++){const y=d.groups[j];if(isNoteG(y)&&!y.kw)parts.push(y);else break}
    const head=x.noteAr;
    const body=parts.map(y=>kj?`<p class="ltr">${esc(y.note)}</p>`:y.noteAr?`<p>${esc(y.noteAr)}</p>`:(head&&y!==x?"":`<p class="ltr">${esc(y.note)}</p>`)).join("");
    notes.push(`<section class="group notecard"><div class="ghead" role="button" tabindex="0" aria-expanded="true"><h3><span class="nic">${ic("note")}</span>${x.kw?`${kj?"TSK note":"ملاحظة TSK"} <em>«</em>${esc(kwTitle(x))}<em>»</em>`:(kj?"TSK note":"ملاحظة TSK")}</h3><span class="chev">${ic("chevron-down")}</span></div><div class="gbody"><div class="nbody">${body}</div></div></section>`);
  });
  /* الشواهد: كل كلمة مفتاحية سطر يتفتح ويتقفل، الأولى بس مفتوحة */
  const firstRef=d.groups.findIndex(x=>x.refs.length);
  const groups=d.groups.map((x,gi)=>{
    if(!x.refs.length) return "";
    const ck=k+"|"+gi, closed=S.closed[ck]!==undefined?!!S.closed[ck]:gi!==firstRef;
    return `<section class="group ugrp ${closed?"closed":""}" id="g${gi}" data-ck="${ck}">
      <div class="ghead" role="button" tabindex="0" aria-expanded="${!closed}"><h3><em>«</em>${esc(kwTitle(x))}<em>»</em></h3>
        <span class="count">${plural(x.refs.length,"شاهد واحد","شاهدان","شواهد","شاهدًا")}</span><a class="mm" target="tskmindmap" href="mindmap.html#${b.abbr}/${d.c}:${d.v}/g${gi}" title="خريطة ذهنية لشواهد هذه الكلمة" aria-label="خريطة ذهنية لشواهد هذه الكلمة">${ic("topology-star-3")}</a><span class="chev">${ic("chevron-down")}</span></div>
      <div class="gbody">
        ${(kj&&x.note)?`<div class="gnote"><b>TSK note</b><span class="ltr">${esc(x.note)}</span></div>`:x.noteAr?`<div class="gnote"><b>ملاحظة TSK</b>${esc(x.noteAr)}</div>`:(x.note?`<div class="gnote"><b>ملاحظة TSK</b><span class="ltr">${esc(x.note)}</span></div>`:"")}
        <div class="refs">${x.refs.slice(0,5).map(r=>refRow(r,`${k}|${gi}|${r.l}`)).join("")}${x.refs.length>5?`<div class="morerefs" hidden>${x.refs.slice(5).map(r=>refRow(r,`${k}|${gi}|${r.l}`)).join("")}</div><button class="showall" data-n="${x.refs.length}">عرض الكل (${n(x.refs.length)})</button>`:""}</div>
      </div></section>`}).join("");
  const rc=refCount(d), dict=dictSection(d), fn=fnBox(d,true);
  const tabs=[["refs","الشواهد",rc?n(rc):""],dict?["dict","معنى الكلمات",""]:null,(notes.length||fn)?["notes","ملاحظات",""]:null].filter(Boolean);
  if(!tabs.some(x=>x[0]===S.vtab)) S.vtab="refs";
  const P=(id,html)=>`<div class="vpanel ${kj?"kjv":""}" id="vp-${id}" data-vp="${id}" role="tabpanel" aria-labelledby="vt-${id}" ${S.vtab===id?"":"hidden"}>${html}</div>`;
  /* مكان العدد في مخطط السفر: أقرب قسم بس، في سطر واحد */
  const OL=olLoad(b.abbr), olr=OL?OL.filter(r=>olIn(r,d.c,d.v)).pop():null;
  const olH=olr?`<p class="uol">${ic("bookmarks")} من قسم: <b>${esc(olr[2]||olr[1])}</b> <small>(${olFmt(olr)})</small> · <a href="outline.html?b=${b.abbr}" target="tskoutline">مخطط السفر</a></p>`:"";
  const trSel=`<select class="utr" aria-label="الترجمة">${av.map(x=>`<option value="${x}" ${!og&&x===trCur()?"selected":""}>${TRN[x]}</option>`).join("")}${origView()?`<option value="orig" ${og?"selected":""}>اللغة الأصلية</option>`:""}</select>`;
  $("#main").innerHTML = `<div class="stickbar ubar"><button class="menu-btn" id="menu" aria-label="القائمة">${ic("menu-2")}</button><span class="sp"></span>${trSel}<button type="button" class="ubtn" id="uMore" aria-label="المزيد" aria-haspopup="menu" aria-expanded="false">${UDOTS}</button><button type="button" class="ubtn" id="uGear" aria-label="إعدادات العرض" aria-haspopup="dialog">${UGEAR}</button></div>
    <a class="uback" href="#/${b.abbr}/ch/${d.c}" data-gc="${d.b}.${d.c}">→ ${bname(b)} ${n(d.c)} <small>· الأصحاح كاملًا</small></a>
    <div class="uhead uvhead"><h1>${bname(b)} ${n(d.c)}: <span>${n(d.v)}</span></h1>${olH}</div>
    ${INTER?ilOpts(b):""}
    <div class="vwrap">${INTER?`<div class="ilist ${store.get("idir","rtl")==="ltr"?"ltr":""}">${ilItem(d,b,false)}</div>`:""}<div class="verse-card ${store.get("nostr2",true)?"nostr":""}" ${INTER?"hidden":""}>
      ${og?`<div class="ar orig-v">${origSpan(d)}</div>`:`<div class="ar" ${kj?'dir="ltr" style="text-align:left"':""}>${verseHTML(d)}</div>`}
      <div class="uvacts">${cpyBtn("v",g,vref(d),true)}${presOK()?`<button type="button" class="trb" data-pres="${g}">${PRES_IC} اعرض</button>`:""}</div>
    </div>${vArrow(prev,"vprev","العدد السابق",'<path d="M9 6l6 6l-6 6"/>')}${vArrow(next,"vnext","العدد التالي",'<path d="M15 6l-6 6l6 6"/>')}</div>
    <div class="vtabs" role="tablist" aria-label="أقسام العدد">${tabs.map(([id,l,c])=>`<button type="button" role="tab" id="vt-${id}" data-vtab="${id}" aria-selected="${S.vtab===id}" aria-controls="vp-${id}" tabindex="${S.vtab===id?0:-1}">${l}${c?` <b>${c}</b>`:""}</button>`).join("")}</div>
    ${P("refs",`<p class="utsk">${ic("arrows-shuffle")} الآيات المرتبطة بكل كلمة في هذا العدد، من «كنز معرفة الكتاب المقدس» (TSK).</p>${groups||`<div class="empty">لا توجد شواهد في TSK لهذا العدد (أحيانًا يضم TSK شواهد العدد إلى العدد الذي قبله).</div>`}`)}
    ${dict?P("dict",dict):""}${(notes.length||fn)?P("notes",notes.join("")+fn):""}`;
  /* يُعاد مع كل render حتى يكتمل تحميل نص الترجمة بأرقامه (tr_<السفر>.js)، ثم يُمسح */
  if(S.sn&&S.sn.k===b.abbr+"/"+d.c+":"+d.v&&$("#dict")){showEntry(S.sn.num,{scroll:!S.sn.done});S.sn.done=true;if(document.querySelector(".verse-card .sw"))S.sn=null}
}

function refMatch(r,nq){
  const R=refAr(r.l);
  return norm(r.l).includes(nq)||norm(R.name+" "+R.num).includes(nq)||r.vs.some(([vn,t])=>t!=null&&norm(t).includes(nq));
}
function viewSearch(){
  if(!needSidx(()=>{if(S.view==="search")render()},()=>{if(S.view==="search")$("#main").innerHTML=crumbs("تعذّر التحميل","")+loadFail("فهرس البحث",`data-jsretry="assets/sidx.js"`)})){$("#main").innerHTML=crumbs("جارٍ التحميل…","");return}
  const sm=S.q.trim().toUpperCase().match(/^([GH])\s*(\d+)$/);
  if(sm) return viewStrongSearch(sm[1]+sm[2]);
  const q=S.q, nq=norm(q), res=[];
  const pool = book().verses, xres=[];
  if(S.scope==="all")(window.SIDX||[]).forEach(x=>{if(x[0]===book().abbr)return;const t=x[3];if(norm(t).includes(nq))xres.push({type:"xverse",x,t})});
  pool.forEach(d=>{
    if(norm(d.text).includes(nq)) res.push({type:"verse",d});
    d.groups.forEach((g,gi)=>{
      const kwHit = norm(kwTitle(g)).includes(nq);
      g.refs.forEach(r=>{ if(kwHit||refMatch(r,nq)) res.push({type:"ref",d,g,gi,r}); });
    });
  });
  res.push(...xres);
  const shown=res.slice(0,S.limit);
  $("#main").innerHTML = crumbs(`بحث: <span>«${esc(q)}»</span>`,`${plural(res.length,"نتيجة واحدة","نتيجتان","نتائج","نتيجة")} في ${S.scope==="book"?bname(book()):"كل الأسفار"}`) +
    (true?`<div class="scope"><button data-scope="all" class="${S.scope==="all"?"on":""}">كل الأسفار</button><button data-scope="book" class="${S.scope==="book"?"on":""}">${bname(book())} فقط</button></div>`:"") +
    (res.length?shown.map(x=>x.type==="xverse"?xverseItem(x,q):x.type==="verse"
      ? `<div class="item"><div class="from"><span>نص العدد</span>${fromLink(x.d,"افتح")}</div><div class="refs"><div class="r" style="grid-template-columns:1fr"><div class="txt ar">${hl(x.d.text,q)}</div></div></div></div>`
      : `<div class="item"><div class="from"><span>«${esc(kwTitle(x.g))}»</span>${fromLink(x.d)}</div><div class="refs">${refRow(x.r,`${K(x.d.b,x.d.c,x.d.v)}|${x.gi}|${x.r.l}`,q)}</div></div>`).join("")
      + (res.length>S.limit?`<button class="more" id="more">عرض المزيد (متبقٍ ${n(res.length-S.limit)})</button>`:"")
    : `<div class="empty">لا توجد نتائج لـ «${esc(q)}».</div>`);
}

function scopeBar(){return `<div class="scope"><button data-scope="all" class="${S.scope==="all"?"on":""}">كل الأسفار</button><button data-scope="book" class="${S.scope==="book"?"on":""}">${bname(book())} فقط</button></div>`}
function xverseItem(o,q){const x=o.x;return `<div class="item"><div class="from"><span>نص العدد · ${AR[x[0]]}</span><a href="${pageOf(x[0],"/"+x[0]+"/"+x[1]+":"+x[2])}">افتح ${AR[x[0]]} ${n(x[1])}: ${n(x[2])} ←</a></div><div class="refs"><div class="r" style="grid-template-columns:1fr"><div class="txt ar">${hl(o.t,q)}</div></div></div></div>`}
function viewStrongSearch(num){
  if(!needStrong(()=>render(),()=>{$("#main").innerHTML=crumbs("تعذّر التحميل","")+loadFail("قاموس سترونج",`data-jsretry="assets/strong.js"`)})){$("#main").innerHTML=crumbs("جارٍ تحميل قاموس سترونج…","");return}
  const all=(window.SIDX||[]).filter(x=>x[4]&&(S.scope==="all"||x[0]===book().abbr)).map(x=>({x,ws:x[4].filter(a=>a[1].includes(num)).map(a=>a[0])})).filter(o=>o.ws.length);
  const has=Object.keys(STRONG).length>0, shown=all.slice(0,S.limit);
  const per={}; all.forEach(o=>{per[o.x[0]]=(per[o.x[0]]||0)+1});
  const sum=Object.keys(per).map(a=>`<span class="pill">${AR[a]} ${n(per[a])}</span>`).join(" ");
  const link=x=>x[0]===book().abbr?`<a data-go="${book().id}.${x[1]}:${x[2]}">افتح ${AR[x[0]]} ${n(x[1])}: ${n(x[2])} ←</a>`:`<a href="${pageOf(x[0],"/"+x[0]+"/"+x[1]+":"+x[2])}">افتح ${AR[x[0]]} ${n(x[1])}: ${n(x[2])} ←</a>`;
  $("#main").innerHTML = crumbs(`سترونج <span>${num}</span>`,`${plural(all.length,"عدد واحد","عددان","أعداد","عددًا")} تَرِد فيها هذه الكلمة في ${S.scope==="all"?"كل الأسفار":bname(book())}`) + scopeBar() +
    (STRONG[num]?`<section class="dict" style="margin-top:0"><div class="dhead"><h3><em>«</em>قاموس سترونج<em>»</em></h3></div>${dentHTML(num,null)}</section>`:"") +
    (sum?`<div class="verse-meta" style="margin:14px 0">${sum}</div>`:"") +
    (all.length?shown.map(o=>`<div class="item"><div class="from"><span>«${esc(o.ws.join("، "))}»</span>${link(o.x)}</div><div class="refs"><div class="r" style="grid-template-columns:1fr"><div class="txt ar">${hl(o.x[3],o.ws[0]||"")}</div></div></div></div>`).join("")
      +(all.length>S.limit?`<button class="more" id="more">عرض المزيد (متبقٍ ${n(all.length-S.limit)})</button>`:"")
    :`<div class="empty">${has?"لا توجد أعداد تحتوي هذا الرقم في الأسفار المزودة بقاموس سترونج.":"لم يُضف قاموس سترونج إلى أي سفر بعد."}</div>`);
}

/* الأصحاحات اللي العرض الحالي محتاجها من ملفات الشواهد */
function chNeed(){const b=book();if(S.view==="search")return b.chapters;if(S.view==="chapter")return [S.c];
  if(S.view==="home")return [cur().c];
  if(S.view==="verse"){const d=cur(),gi=GIDX[K(d.b,d.c,d.v)],o=[d.c];[ALL[gi-1],ALL[gi+1]].forEach(x=>{if(x&&x.b===d.b&&!o.includes(x.c))o.push(x.c)});return o}
  return []}
/* نص الأصحاح يظهر فورًا من ملف الترجمة لو مش محتاج نص كتاب الحياة من ملف الشواهد */
const chTextFirst=()=>S.view==="chapter"&&(trCur()!=="alab"||diaOn()||origOn());
function chGate(){
  const miss=chNeed().filter(c=>!chHas(c));if(!miss.length){CHWAIT=null;return true}
  const bad=miss.filter(chFailed);
  if(bad.length){CHWAIT=null;if(chTextFirst()&&miss.length===1)return true;
    $("#main").innerHTML=crumbs("تعذّر التحميل","")+loadFail("الشواهد",`data-chretry="${bad.join(" ")}"`);return false}
  const key=S.view+"|"+S.c+"|"+S.v+"|"+S.q;CHWAIT=key;let left=miss.length;
  miss.forEach(c=>chEnsure(c,()=>{if(--left===0&&CHWAIT===key){CHWAIT=null;render()}}));
  if(chTextFirst())return true;
  $("#main").innerHTML=crumbs(S.view==="search"?"جارٍ تحميل الشواهد للبحث…":"جارٍ تحميل الشواهد…","");return false}
/* بعد ما الأصحاح يظهر: تحميل الأصحاح التالي في الخلفية (إلا لو المستخدم مفعّل توفير البيانات) */
function chPrefetch(){if(!SPLIT||S.view!=="chapter"||!chHas(S.c))return;const b=book(),nc=b.chapters[b.chapters.indexOf(S.c)+1];if(nc==null||chHas(nc))return;
  const cn=navigator.connection;if(cn&&(cn.saveData||/(^|-)2g$/.test(cn.effectiveType||"")))return;
  const go_=()=>chEnsure(nc);("requestIdleCallback" in window)?requestIdleCallback(go_,{timeout:4000}):setTimeout(go_,1500)}
function focusKey(el){ /* مفتاح نلاقي بيه نفس العنصر بعد ما الصفحة تتبني من جديد */
  if(!el||el===document.body||!$("#main")||!$("#main").contains(el))return null;
  if(el.id)return "#"+CSS.escape(el.id);
  const a=[...el.attributes].find(x=>x.name.startsWith("data-")&&x.value);
  return a?`${el.tagName.toLowerCase()}[${a.name}="${CSS.escape(a.value)}"]`:"h1";
}
function render(){
  const fk=focusKey(document.activeElement);
  _render();
  if(fk&&!$("#main").contains(document.activeElement)){
    const t=$("#main").querySelector(fk)||$("#main h1");
    if(t){if(t.matches("h1,h2"))t.tabIndex=-1;t.focus({preventScroll:true})}
  }
}
function _render(){
  sidebar();
  if(SPLIT&&!chGate()){try{CPY_LAST=-1;cpyCount()}catch(e){}return}
  ({home:viewHome,book:viewBook,chapter:viewChapter,verse:viewVerse,search:viewSearch})[S.view]();
  try{CPY_LAST=-1;cpyCount()}catch(e){}
  chPrefetch();
}

/* ---------- navigation ---------- */
function save(){store.set("b",S.b);store.set("c",S.c);store.set("v",S.v)}
function go(b,c,v,push=true){
  S.b=b;S.c=c;S.v=v;S.view="verse";save();
  if(push) history.pushState(null,"",`#/${BY[b].abbr}/${c}:${v}`);
  render(); window.scrollTo({top:0}); $("#side").classList.remove("open");
}
function goChapter(b,c,push=true){
  S.b=b;S.c=c;S.view="chapter";save();
  if(push) history.pushState(null,"",`#/${BY[b].abbr}/ch/${c}`);
  render(); window.scrollTo({top:0}); $("#side").classList.remove("open");
}
function openBook(id){const b=BY[id];S.b=id;S.c=b.verses[0].c;S.v=b.verses[0].v;save();S.view="book";history.pushState(null,"",`#/${b.abbr}`);render();window.scrollTo({top:0});$("#side").classList.remove("open")}
function show(view){S.view=view;if(view!=="search"){S.q="";} history.pushState(null,"","#"+view);render();window.scrollTo({top:0});$("#side").classList.remove("open")}
function parseGo(s){const m=s.match(/^(\d+)\.(\d+):(\d+)$/);return m?[+m[1],+m[2],+m[3]]:null}
function fromHash(){
  const h=decodeURIComponent(location.hash.slice(1));
  let m=h.match(/^\/([1-3]?[A-Za-z]{2,3})\/(\d+):(\d+)(?:\/([GH]\d+))?$/); S.sn=m&&m[4]?{num:m[4],k:m[1]+"/"+m[2]+":"+m[3]}:null; /* #/Isa/11:1/H5342 = العدد مع فتح الرقم في القاموس (رابط «عرض المزيد» في نافذة سترونج) */
  if(m&&BY_ABBR[m[1]]&&BY_ABBR[m[1]].idx[m[2]+":"+m[3]]!=null){const b=BY_ABBR[m[1]];S.b=b.id;S.c=+m[2];S.v=+m[3];S.view="verse";}
  else if((m=h.match(/^\/([1-3]?[A-Za-z]{2,3})\/ch\/(\d+)$/))&&BY_ABBR[m[1]]&&BY_ABBR[m[1]].chapters.includes(+m[2])){S.b=BY_ABBR[m[1]].id;S.c=+m[2];S.view="chapter";}
  else if((m=h.match(/^\/([1-3]?[A-Za-z]{2,3})$/))&&BY_ABBR[m[1]]){S.b=BY_ABBR[m[1]].id;S.view="book";}
  else S.view="book";
  render();
}
window.addEventListener("popstate",fromHash);

document.addEventListener("click",e=>{
  {const w=e.target.closest(".cvlist .cvs .sw");if(w&&!e.target.closest(".geo-nm")){loadJS("assets/chstrong.js",()=>window.CHS&&window.CHS.open(w));return}
   if(e.target.closest(".cvlist .cvs")&&!e.target.closest(".cvn"))return} /* في وضع الأرقام: الضغط على النص لا يفتح العدد، رقم العدد فقط */
  {const pr=e.target.closest("[data-pres]");if(pr){const p=parseGo(pr.dataset.pres);if(!p)return;
    if(window.SCR&&SCR.on){SCR.show(...p);return}   /* وضع الشاشة الخارجية: الآية تروح للشاشة الخارجية */
    loadJS("assets/presfit.js",()=>loadJS("assets/present.js",()=>window.PRES&&window.PRES.open(...p)));return}}
  if(e.target.closest("[data-scr]")){loadJS("assets/presfit.js",()=>loadJS("assets/screenctl.js",()=>window.SCR&&SCR.toggle()));return}
  if(e.target.closest("#cstrBtn")){store.set("ucstr",!cstrSup());render();return}
  const cr=e.target.closest("[data-chretry]"); if(cr){cr.dataset.chretry.split(" ").forEach(c=>retryJS(chSrc(+c)));render();return}
  const jr=e.target.closest("[data-jsretry]"); if(jr){retryJS(jr.dataset.jsretry); if(!jr.dataset.dn){render();return}}
  const sr=e.target.closest(".sref"); if(sr){ if($("#dict")) showEntry(sr.dataset.sn,{fromRef:true}); return }
  if(e.target.closest("#dback")){const p=DICT.trail.pop(); DICT.cur=p; $("#dict").innerHTML=dictInner(); return}
  const dn=e.target.closest("[data-dn]"); if(dn){showEntry(dn.dataset.dn,{scroll:false});return}
  {const sn=e.target.closest(".verse-card span.sn");if(sn){showEntry(sn.dataset.sn);return}}
  const sw=e.target.closest(".verse-card .sw"); if(sw){showEntry(sw.dataset.n.split(" ")[0]);return}
  if(e.target.closest("#strTgl")){const vc=document.querySelector(".verse-card");const off=!vc.classList.contains("nostr");vc.classList.toggle("nostr",off);e.target.closest("#strTgl").classList.toggle("on",!off);store.set("nostr2",off);return}
  if(e.target.closest("#diaBtn")){store.set("dia",!diaOn());render();return}
  const tb=e.target.closest("[data-tr]"); if(tb){store.set("tr",tb.dataset.tr);store.set("corig",false);render();return}
  if(e.target.closest("[data-orig]")){store.set("corig",true);store.set("inter",false);render();return}  /* اللغة الأصلية وكلمة بكلمة لا يعملان معًا */
  const sb=e.target.closest("[data-isrc]"); if(sb){store.set("isrc",sb.dataset.isrc);render();return}
  const db=e.target.closest("[data-idir]"); if(db){store.set("idir",db.dataset.idir);render();return}
  const ib=e.target.closest("[data-inter]"); if(ib){const on=ib.dataset.inter==="1";store.set("inter",on);if(on)store.set("corig",false);render();return}
  const gc=e.target.closest("[data-gc]"); if(gc){const p=gc.dataset.gc.split("."); goChapter(+p[0],+p[1]); return}
  const g=e.target.closest("[data-go]");
  if(g&&g.dataset.go){const p=parseGo(g.dataset.go); if(p) go(...p); return}
  const bk=e.target.closest("[data-book]"); if(bk){openBook(+bk.dataset.book);return}
  if(e.target.closest("#menu")||e.target.closest("#sideClose")){
    if(innerWidth>880){const a=document.querySelector(".app");a.classList.toggle("collapsed");store.set("sideOff",a.classList.contains("collapsed"));}
    else $("#side").classList.toggle("open");
    return}
  const sa=e.target.closest(".showall"); if(sa){const m=sa.previousElementSibling,h=m.hidden;m.hidden=!h;sa.textContent=h?"عرض أقل":`عرض الكل (${n(sa.dataset.n)})`;return}
  const fz=e.target.closest("[data-fs]"); if(fz){setFs(+fz.dataset.fs);return}
  const sh=e.target.closest("#side .sh"); if(sh){const sec=sh.closest("[data-sec]");sec.classList.toggle("shut");const o=store.get("shut",{});if(sec.classList.contains("shut"))o[sec.dataset.sec]=1;else delete o[sec.dataset.sec];store.set("shut",o);return}
  const j=e.target.closest("[data-jump]"); if(j){e.preventDefault();document.getElementById(j.dataset.jump).scrollIntoView({behavior:"smooth"});return}
  const ch=e.target.closest("#chgrid button"); if(ch){S.c=+ch.dataset.ch;sidebar();return}
  const vb=e.target.closest("#vlist button"); if(vb){go(S.b,S.c,+vb.dataset.v);return}
  const sc=e.target.closest("[data-scope]"); if(sc){S.scope=sc.dataset.scope;S.limit=60;viewSearch();return}
  if(e.target.closest("a.mm"))return;
  const h=e.target.closest(".ghead"); if(h){const s=h.parentElement;s.classList.toggle("closed");S.closed[s.dataset.ck]=s.classList.contains("closed");store.set("closed",S.closed);return}
  if(e.target.closest("#more")){S.limit+=60;viewSearch();return}
});
document.addEventListener("change",e=>{const t=e.target;
  if(t.classList.contains("sbBook")){location.href=pageOf(t.value,"/"+t.value+"/ch/1");return}
  const b=book();
  if(t.classList.contains("sbCh")){goChapter(b.id,+t.value);return}
  if(t.classList.contains("sbV")){go(b.id,S.c,+t.value)}
});
document.addEventListener("submit",e=>{if(e.target.id==="gotoBox"){e.preventDefault();const i=$("#gotoIn");const q=i.value.trim();if(q&&!gotoRef(q))location.href="search.html?q="+encodeURIComponent(q);}});
$("#home").addEventListener("click",()=>{location.href="index.html"});
function setAll(closed){ if(S.view!=="verse")return; const d=cur(),k=K(d.b,d.c,d.v); d.groups.forEach((g,gi)=>{S.closed[k+"|"+gi]=!!closed}); store.set("closed",S.closed); render(); }
function offOpen(){if(window.OFFLINE_UI)return window.OFFLINE_UI.open();const x=document.createElement("script");x.src="assets/offline.js";document.head.appendChild(x)}
document.addEventListener("click",e=>{if(e.target.closest("#offBtn")){offOpen();return}if(e.target.closest("#expandAll"))setAll(false);else if(e.target.closest("#collapseAll"))setAll(true)});
$("#themeBtn").addEventListener("click",()=>{
  const c=document.documentElement.dataset.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
  const nx=c==="dark"?"light":"dark";document.documentElement.dataset.theme=nx;store.set("theme",nx);
});
const th=store.get("theme",null); if(th) document.documentElement.dataset.theme=th;
/* RTL: the left arrow moves forward, the right arrow moves back */
document.addEventListener("keydown",e=>{
  if(e.target.matches("input,textarea,select,[contenteditable],[role=tab],.sw")||e.altKey||e.ctrlKey||e.metaKey||S.view!=="verse")return; /* الأسهم على التبويبات أو الكلمات ليها شغلها الخاص */
  const d=cur(), i=GIDX[K(d.b,d.c,d.v)];
  if(e.key==="ArrowLeft"&&ALL[i+1]){const x=ALL[i+1];go(x.b,x.c,x.v)}
  if(e.key==="ArrowRight"&&ALL[i-1]){const x=ALL[i-1];go(x.b,x.c,x.v)}
  const me=CAT_ABBR[book().abbr];
  if(e.key==="ArrowLeft"&&!ALL[i+1]&&CAT[me.i+1]){const c=CAT[me.i+1];location.href=pageOf(c.abbr,"/"+c.abbr+"/1:1")}
  if(e.key==="ArrowRight"&&!ALL[i-1]&&CAT[me.i-1]){const c=CAT[me.i-1];location.href=pageOf(c.abbr,"/"+c.abbr+"/"+c.last)}
});
(function(){const o=store.get("shut",{});document.querySelectorAll("#side [data-sec]").forEach(s=>{if(o[s.dataset.sec])s.classList.add("shut")});
  if(store.get("sideOff",false)&&innerWidth>880)document.querySelector(".app").classList.add("collapsed");})();
/* الكلمات بالكيبورد: كل آية محطة واحدة لزرار Tab، والأسهم تنقل بين كلماتها، وEnter أو المسافة يفتح معناها */
(function(){
  const SEL="#main .cvlist .cvt, #main .verse-card .ar";
  const wordsOf=c=>[...c.querySelectorAll(".sw")];
  const lab=w=>[...w.childNodes].filter(x=>x.nodeName!=="SUP").map(x=>x.textContent).join("").trim();
  function prep(){document.querySelectorAll(SEL).forEach(c=>{const ws=wordsOf(c);if(!ws.length||ws[0].hasAttribute("role"))return;
    ws.forEach((w,i)=>{w.setAttribute("role","button");w.tabIndex=i?-1:0;w.setAttribute("aria-label",lab(w)+" — معنى الكلمة")})})}
  let q=0;const sch=()=>{if(!q)q=requestAnimationFrame(()=>{q=0;prep()})};
  const m=$("#main"); if(m){new MutationObserver(sch).observe(m,{childList:true,subtree:true});sch()}
  document.addEventListener("keydown",e=>{
    const w=e.target.closest&&e.target.closest(".sw[role=button]"); if(!w||e.altKey||e.ctrlKey||e.metaKey)return;
    const c=w.closest(SEL); if(!c)return;
    if(e.key==="Enter"||e.key===" "){e.preventDefault();e.stopPropagation();w.click();
      if(w.closest(".verse-card")){let k=0;const num=w.dataset.n.split(" ")[0];const t=setInterval(()=>{const b=document.querySelector(`#dict .dwords [data-dn="${num}"]`);if(b||++k>20){clearInterval(t);b&&b.focus({preventScroll:true})}},100)}
      return}
    const ws=wordsOf(c), i=ws.indexOf(w), rtl=getComputedStyle(c).direction!=="ltr"; let j;
    if(e.key==="ArrowLeft")j=rtl?i+1:i-1; else if(e.key==="ArrowRight")j=rtl?i-1:i+1;
    else if(e.key==="Home")j=0; else if(e.key==="End")j=ws.length-1; else return;
    e.preventDefault();e.stopPropagation(); j=Math.max(0,Math.min(ws.length-1,j));
    ws[i].tabIndex=-1; ws[j].tabIndex=0; ws[j].focus();
  },true);
})();
fromHash();

/* ==== UX LAYER START (reading pages) ==== */
/* =========================================================
   UX LAYER — طبقة تحسينات تجربة الاستخدام لصفحات القراءة.
   بيشتغل فوق الـ render الحالي من غير ما يغيّر app.js:
   بعد كل render بيعدّل الـ DOM حسب توصيات المراجعة.
   ========================================================= */
(function(){
  "use strict";
  const MQ = matchMedia("(max-width:880px)");
  const isMobile = () => MQ.matches;
  const main = document.getElementById("main");
  if(!main) return;
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
  const el = (tag,attrs={},html="")=>{const e=document.createElement(tag);for(const k in attrs)e.setAttribute(k,attrs[k]);e.innerHTML=html;return e};
  const SVG_THEME = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"/></svg>`;

  document.documentElement.classList.add("ux-on");

  /* ---------- Sheet عامة (bottom sheet على الموبايل / نافذة على الديسكتوب) ---------- */
  const scrim = el("div",{class:"uxt-scrim"});
  const sheet = el("div",{class:"uxt-sheet",role:"dialog","aria-modal":"true","aria-labelledby":"uxtSheetT"});
  document.body.append(scrim,sheet);
  let sheetKind = null, lastFocus = null;
  function openSheet(kind,title,build){
    lastFocus = document.activeElement;
    sheetKind = kind;
    sheet.innerHTML = `<div class="grab"></div><div class="shd"><h3 id="uxtSheetT">${title}</h3><button class="uxt-x" aria-label="إغلاق">✕</button></div><div class="sbd"></div>`;
    build($(".sbd",sheet));
    scrim.classList.add("on"); sheet.classList.add("on");
    document.documentElement.style.overflow="hidden";
    setTimeout(()=>{const f=$(".uxt-find",sheet)||$(".uxt-x",sheet);f&&f.focus()},60);
  }
  function closeSheet(){
    if(!sheetKind) return;
    sheetKind=null; scrim.classList.remove("on"); sheet.classList.remove("on");
    document.documentElement.style.overflow="";
    closeDict();
    if(lastFocus&&document.contains(lastFocus)) lastFocus.focus();
  }
  scrim.addEventListener("click",()=>{closeSheet();closeDict()});
  sheet.addEventListener("click",e=>{if(e.target.closest(".uxt-x"))closeSheet()});
  addEventListener("keydown",e=>{if(e.key==="Escape"){closeSheet();closeDict()}});

  /* ---------- #2 الـ picker: سفر ← أصحاح ← عدد ---------- */
  function curLabel(){
    const b=book(); if(!b) return "اختر";
    if(S.view==="verse") return `${AR[b.abbr]} ${n(S.c)}: ${n(S.v)}`;
    if(S.view==="chapter") return `${AR[b.abbr]} ${n(S.c)}`;
    return AR[b.abbr];
  }
  function openPicker(tab){
    const b=book();
    let pickAbbr=b.abbr;
    openSheet("pick","اختر المكان",body=>{
      body.innerHTML=`<div class="uxt-tabs" role="tablist">
        <button data-t="b" role="tab">السفر</button><button data-t="c" role="tab">الأصحاح</button><button data-t="v" role="tab">العدد</button></div><div class="uxt-pbody"></div>`;
      const pb=$(".uxt-pbody",body);
      const setTab=t=>{
        $$(".uxt-tabs button",body).forEach(x=>{x.classList.toggle("on",x.dataset.t===t);x.setAttribute("aria-selected",x.dataset.t===t)});
        const vBtn=$('.uxt-tabs [data-t="v"]',body); vBtn.disabled = pickAbbr!==b.abbr; vBtn.style.opacity = vBtn.disabled?.4:1;
        if(t==="b"){
          pb.innerHTML=`<input class="uxt-find" type="search" placeholder="اكتب اسم السفر…" aria-label="بحث عن سفر">`+
            BKGRP.map(g=>`<div class="uxt-grp">${g[0]}</div><div class="uxt-grid">${CAT.slice(g[1]-1,g[2]).map(x=>
              `<button data-ab="${x.abbr}" class="${x.abbr===pickAbbr?"on":""}" data-nm="${norm(AR[x.abbr])}">${AR[x.abbr]}</button>`).join("")}</div>`).join("");
          const inp=$(".uxt-find",pb);
          inp.addEventListener("input",()=>{const q=norm(inp.value.trim());
            $$(".uxt-grid button",pb).forEach(x=>x.hidden=q&&!x.dataset.nm.includes(q));
            $$(".uxt-grp",pb).forEach(h=>{h.hidden=!$$("button",h.nextElementSibling).some(x=>!x.hidden);h.nextElementSibling.hidden=h.hidden})});
          setTimeout(()=>inp.focus(),30);
        }else if(t==="c"){
          const cat=CAT.find(x=>x.abbr===pickAbbr);
          const list = pickAbbr===b.abbr ? b.chapters : Array.from({length:parseInt(cat.last)},(_,i)=>i+1);
          pb.innerHTML=`<div class="uxt-grp">${AR[pickAbbr]} — الأصحاحات</div><div class="uxt-grid num">${list.map(c=>
            `<button data-c="${c}" class="${pickAbbr===b.abbr&&c===S.c?"on":""}">${n(c)}</button>`).join("")}</div>`;
        }else{
          pb.innerHTML=`<div class="uxt-grp">${AR[b.abbr]} ${n(S.c)} — الأعداد</div><div class="uxt-grid num">${inCh(b,S.c).map(d=>
            `<button data-v="${d.v}" class="${S.view==="verse"&&d.v===S.v?"on":""}">${n(d.v)}</button>`).join("")}</div>`;
        }
      };
      body.addEventListener("click",e=>{
        const t=e.target.closest(".uxt-tabs button"); if(t&&!t.disabled){setTab(t.dataset.t);return}
        const ab=e.target.closest("[data-ab]"); if(ab){pickAbbr=ab.dataset.ab;setTab("c");return}
        const c=e.target.closest("[data-c]");
        if(c){const cn=+c.dataset.c;closeSheet();
          if(pickAbbr===b.abbr) goChapter(b.id,cn); else location.href=pageOf(pickAbbr,"/"+pickAbbr+"/ch/"+cn);return}
        const v=e.target.closest("[data-v]"); if(v){closeSheet();go(b.id,S.c,+v.dataset.v)}
      });
      setTab(tab||"c");
    });
  }

  /* ---------- #1 زرار Aa: إعدادات العرض ---------- */
  let movedForSheet = [];
  function openAa(){
    openSheet("aa","إعدادات العرض",body=>{
      const sec=(title,nodes)=>{if(!nodes.length)return;const s=el("div",{class:"uxt-sec"},`<h4>${title}</h4>`);nodes.forEach(x=>s.append(x));body.append(s)};
      const tr=$("#main>.trbar"), seg=$("#main>.trgrp.seg"), cl=$("#main>.chlink:not(.uxt-keep)"), io=$("#main>.ilopts");
      sec("الترجمة وحجم الخط",[tr].filter(Boolean));
      sec("طريقة العرض",[seg,cl,io].filter(Boolean));
      movedForSheet=[tr,seg,cl,io].filter(Boolean);
      const dark = (document.documentElement.dataset.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"))==="dark";
      const th=el("div",{class:"uxt-sec"},`<h4>المظهر</h4><div class="uxt-row"><span>الوضع الداكن</span><button class="uxt-sw" id="uxtDark">${dark?"إيقاف":"تشغيل"}</button></div>`);
      body.append(th);
      $("#uxtDark",th).addEventListener("click",ev=>{$("#themeBtn").click();const d=document.documentElement.dataset.theme==="dark";ev.target.textContent=d?"إيقاف":"تشغيل"});
    });
  }
  /* لما الـ sheet يتقفل، الأدوات اللي اتنقلت ترجع مكانها (لو الصفحة لسه نفس الـ render) */
  const _close = closeSheet;
  closeSheet = function(){
    if(sheetKind==="aa"){ const anchor=$("#main>.vwrap, #main>.cvlist, #main>.ilist"); movedForSheet.forEach(x=>{if(anchor&&!main.contains(x)) anchor.before(x)}); movedForSheet=[] }
    _close();
  };

  /* ---------- #4 قاموس سترونج كـ bottom sheet ---------- */
  function closeDict(){
    const d=$("#dict"); if(!d||!d.classList.contains("uxt-dsheet")) return;
    try{ DICT.cur=null; DICT.trail=[]; d.innerHTML=dictInner(); }catch(e){}
    d.classList.remove("uxt-dsheet"); if(!sheetKind) scrim.classList.remove("on");
  }
  function syncDict(){
    const d=$("#dict"); if(!d) return;
    if($("#main .vtabs")){if(d.classList.contains("uxt-dsheet")){d.classList.remove("uxt-dsheet");if(!sheetKind)scrim.classList.remove("on")}return}
    const filled=!d.querySelector(":scope > .empty:not(.loading):not(.loadfail)");
    if(isMobile()&&filled){
      if(!d.classList.contains("uxt-dsheet")){d.classList.add("uxt-dsheet");scrim.classList.add("on")}
      if(!d.querySelector(".uxt-dclose")) d.prepend(el("button",{class:"uxt-dclose","aria-label":"إغلاق القاموس"},"✕"));
    }else if(d.classList.contains("uxt-dsheet")&&!filled){d.classList.remove("uxt-dsheet");if(!sheetKind)scrim.classList.remove("on")}
  }
  document.addEventListener("click",e=>{if(e.target.closest(".uxt-dclose")){e.stopPropagation();closeDict()}},true);

  /* ---------- #4 الشاهد كله قابل للضغط ---------- */
  document.addEventListener("click",e=>{
    const r=e.target.closest(".r.uxt-tap"); if(!r) return;
    if(e.target.closest("a,button,.sref,.sn,.sw,input,select,summary")) return;
    if(String(getSelection()).trim()) return;
    const s=r.querySelector(".self"); if(s) s.click();
  });

  /* ---------- #6 رسالة offline واحدة ---------- */
  function syncOffline(){
    const has=!!main.querySelector(".txna");
    main.classList.toggle("uxt-hasoff",has);
    const ex=$(".uxt-off",main);
    if(has&&!ex){
      const anchor=$("#main section.group, #main .refs");
      if(!anchor) return;
      const b=el("div",{class:"uxt-off",role:"status"},`<span>بعض نصوص الشواهد مش محفوظة على جهازك — هتظهر أول ما تتصل بالإنترنت.</span><button type="button">تنزيل للاستخدام دون إنترنت</button>`);
      $("button",b).addEventListener("click",()=>{try{offOpen()}catch(e){}});
      (anchor.closest("section.group")||anchor).before(b);
    }else if(!has&&ex) ex.remove();
  }

  /* ---------- المعالجة بعد كل render ---------- */
  function process(){
    main.append(el("i",{class:"uxt-mark",hidden:""}));
    const sb=$("#main .stickbar");

    /* #2 picker + Aa + theme داخل الـ sticky bar */
    if(sb){
      const pick=el("button",{class:"uxt-pick",type:"button","aria-haspopup":"dialog","aria-label":"اختر السفر والأصحاح والعدد"},`<span>${curLabel()}</span><span class="chev">▾</span>`);
      pick.addEventListener("click",()=>openPicker(S.view==="verse"?"v":"c"));
      const sp=$(".sp",sb); sb.insertBefore(pick,sp);
      /* في وضع Interlinear مفيش .trbar — الأدوات كلها جوه .chlink، فلازم Aa يظهر برضه */
      const inter=!!$("#main .ilist");
      if(!sb.classList.contains("ubar")&&($("#main>.trbar, #main>.trgrp.seg, #main>.ilopts")||(S.view!=="verse"&&$("#main>.chlink")))){
        const on=$("#main>.trbar .trb.on");
        const lab=inter?"Interlinear":(on?on.textContent.trim():"");
        const aa=el("button",{class:"uxt-aa",type:"button","aria-haspopup":"dialog","aria-label":"إعدادات العرض"},`Aa${lab?` <small dir="auto">${lab}</small>`:""}`);
        aa.addEventListener("click",openAa); sb.insertBefore(aa,sp.nextSibling);
      }
      const th=el("button",{class:"uxt-theme",type:"button",title:"الوضع الفاتح / الداكن","aria-label":"الوضع الفاتح / الداكن"},SVG_THEME);
      th.addEventListener("click",()=>$("#themeBtn").click()); if(!sb.classList.contains("ubar"))sb.append(th); else if(sb.classList.contains("ubk")){th.className="ubtn";sb.append(th)}  /* صفحة السفر: نفس شريط الأصحاح + زرار الثيم */
      /* أزرار السابق/التالي: aria-label من الـ title لأن النص بيختفي على الموبايل */
      $$(".nav button, .nav a",sb).forEach(x=>{if(x.title&&!x.getAttribute("aria-label"))x.setAttribute("aria-label",x.title+" "+(x.textContent.replace(/[←→]/g,"").trim()))});
    }else{
      /* صفحة السفر: زرار الثيم في الـ crumbs */
      const cr=$("#main .crumbs");
      if(cr&&!$(".uxt-theme",cr)){const th=el("button",{class:"uxt-theme",type:"button","aria-label":"الوضع الفاتح / الداكن"},SVG_THEME);th.addEventListener("click",()=>$("#themeBtn").click());cr.append(th)}
    }

    /* #1 المخطط مقفول + ملخص */
    $$("#main details.olbox").forEach(d=>{
      d.open=false;
      const cnt=$$(".olr",d).length, sm=$("summary",d);
      if(sm&&cnt&&!$(".uxt-olhint",sm)) sm.append(el("span",{class:"uxt-olhint"},`${plural(cnt,"قسم واحد","قسمان","أقسام","قسمًا")} · اضغط للعرض`));
    });
    /* في صفحة العدد زرار "عرض الأصحاح كاملًا" يفضل ظاهر */
    if(S.view==="verse"){const cl=$("#main>.chlink");cl&&cl.classList.add("uxt-keep")}

    /* #1 صورة الأصحاح بعد النص على الموبايل */
    const hero=$("#main>figure.chhero");
    /* في الشكل الجديد الصورة اختيارية من ⚙، فتفضل مكانها فوق النص */
    if(hero&&isMobile()&&!$("#main .ubar")){const foot=$("#main>.chfoot")||null;const list=$("#main>.cvlist");
      (foot?foot.before(hero):list&&list.after(hero)); hero.classList.add("uxt-moved");}

    /* Interlinear: زرار واضح تحت كل عدد يفتحه في صفحة العدد (الشواهد + سترونج) */
    $$("#main .ilist .ilv").forEach(v=>{
      const nb=$("button.ilvn[data-go]",v), col=$(".ilcol",v);
      if(!nb||!col||$(".uxt-ilgo",v)) return;
      nb.setAttribute("aria-label",`افتح العدد ${nb.textContent.trim()} بالشواهد`);
      col.append(el("button",{class:"uxt-ilgo",type:"button","data-go":nb.dataset.go},`افتح العدد ${nb.textContent.trim()} بالشواهد ←`));
    });

    /* #4 صفوف الشواهد */
    $$("#main .r").forEach(r=>{if(r.querySelector(".self"))r.classList.add("uxt-tap")});

    syncDict(); syncOffline(); uxAfter();
  }

  /* ==========================================================
     التصميم «أ»: لوحة الشواهد، ⚙، ⋯، الأوضاع، التلميحات
     ========================================================== */
  /* لوحة الشواهد: رقم العدد يفتحها بدل الانتقال لصفحة العدد */
  function openRefs(gs){
    const p=parseGo(gs); if(!p) return;
    const k=K(p[0],p[1],p[2]), d=ALL[GIDX[k]]; if(!d) return;
    const rc=refCount(d);
    openSheet("refs",`${vref(d)}<small class="usub">${rc?plural(rc,"شاهد واحد","شاهدان","شواهد","شاهدًا")+" من «كنز معرفة الكتاب المقدس»":"لا توجد شواهد لهذا العدد"}</small>`,body=>{
      const txt=origOn()?origSpan(d):esc(trText(d)||d.text||"");
      const kj=trCur()==="kjv";
      const groups=d.groups.map((g,gi)=>{
        if(!g.refs.length){const nt=!kj&&g.noteAr?g.noteAr:g.note;return nt?`<div class="unote"><b>ملاحظة TSK</b> <span ${!kj&&g.noteAr?"":'class="ltr"'}>${esc(nt)}</span></div>`:""}
        const ck=k+"|"+gi, closed=!!S.closed[ck];
        return `<section class="group ${closed?"closed":""}" data-ck="${ck}"><div class="ghead" role="button" tabindex="0" aria-expanded="${!closed}"><h3><em>«</em>${esc(kwTitle(g))}<em>»</em></h3><span class="count">${plural(g.refs.length,"شاهد واحد","شاهدان","شواهد","شاهدًا")}</span><span class="chev">${ic("chevron-down")}</span></div><div class="gbody"><div class="refs">${g.refs.slice(0,5).map(r=>refRow(r,`${k}|${gi}|${r.l}`)).join("")}${g.refs.length>5?`<div class="morerefs" hidden>${g.refs.slice(5).map(r=>refRow(r,`${k}|${gi}|${r.l}`)).join("")}</div><button class="showall" data-n="${g.refs.length}">عرض الكل (${n(g.refs.length)})</button>`:""}</div></div></section>`}).join("");
      body.innerHTML=`<div class="uvtext ar" ${kj&&!origOn()?'dir="ltr" style="text-align:left"':""}>${txt}</div>${groups||`<p class="uempty">لا توجد شواهد في TSK لهذا العدد (أحيانًا يضم TSK شواهد العدد إلى العدد الذي قبله).</p>`}
        <div class="uacts">${cpyBtn("v",gs,vref(d),true)}${presOK()?`<button type="button" class="trb" data-pres="${gs}">${PRES_IC} اعرض الآية</button>`:""}<button type="button" class="trb uprim" data-go="${gs}">كل تفاصيل العدد والقاموس ←</button></div>`;
      $$(".r",body).forEach(r=>{if(r.querySelector(".self"))r.classList.add("uxt-tap")});
    });
    try{cpyCount()}catch(e){}
  }
  /* ⚙ إعدادات العرض */
  const usw=(id,label,on)=>`<button type="button" class="usw" id="${id}" role="switch" aria-checked="${on}"><span>${label}</span><i aria-hidden="true"></i></button>`;
  const isDark=()=>(document.documentElement.dataset.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"))==="dark";
  function openGear(){
    const ST=MODE()==="study", VV=S.view==="verse";
    openSheet("gear","إعدادات العرض",body=>{
      let h=`<div class="uxt-sec"><div class="uxt-row"><span>حجم الخط</span>${fsGrp()}</div></div><div class="uxt-sec"><h4>النص</h4>`;
      if(diaAvail()&&!origOn()) h+=usw("diaBtn","التشكيل",diaOn());
      if(VV&&!origOn()&&!interOn()&&document.querySelector(".verse-card .sw")) h+=usw("strTgl","أرقام سترونج فوق الكلمات",!store.get("nostr2",true));
      if(!VV) h+=usw("uImg","صورة الأصحاح",store.get("uimg",false));
      /* «كلمة بكلمة» ظاهر كزرار في وضع دراسة، فهنا في صفحة العدد بس */
      if(VV) h+=`<button type="button" class="usw" role="switch" aria-checked="${interOn()}" data-inter="${interOn()?0:1}"><span>كلمة بكلمة</span><i aria-hidden="true"></i></button>`;
      h+=`</div>`;
      h+=`<div class="uxt-sec"><h4>المظهر</h4>${usw("uDark","الوضع الداكن",isDark())}</div>`;
      if(!VV) h+=`<div class="uxt-sec"><button type="button" class="ulink" id="uTips">اعرض التلميحات مرة أخرى</button></div>`;
      body.innerHTML=h;
    });
  }
  /* ⋯ الأفعال */
  let moreEl=null;
  function closeMore(){if(!moreEl)return;moreEl.remove();moreEl=null;const b=$("#uMore");b&&b.setAttribute("aria-expanded","false")}
  function toggleMore(btn){
    if(moreEl){closeMore();return}
    const b=book(), VV=S.view==="verse", r=btn.getBoundingClientRect();
    const d=VV?cur():null, vs=inCh(b,S.c), start=VV?`${d.b}.${d.c}:${d.v}`:`${b.id}.${S.c}:${vs[0].v}`;
    /* ⋯ = أفعال مالهاش زرار ظاهر في الصفحة (القاعدة في DESIGN.md): ما يتكررش فيها حاجة ظاهرة */
    const ST=!VV&&MODE()==="study", RD=!VV&&!ST, fine=matchMedia("(pointer:fine)").matches;
    moreEl=el("div",{class:"umore",role:"menu","aria-label":"المزيد"},
      (presOK()&&ST?`<button type="button" role="menuitem" data-pres="${start}">${PRES_IC} عرض بملء الشاشة</button>`:"")+
      ((extOK()||(window.SCR&&SCR.on))&&!(RD&&fine)?`<button type="button" role="menuitem" data-scr="1">${SCR_IC} ${window.SCR&&SCR.on?"إيقاف الشاشة الخارجية":"العرض على شاشة خارجية"}</button>`:"")+
      `<button type="button" role="menuitem" data-ucopy="1">${ic("copy")} ${VV?"انسخ الآية مع المرجع":"انسخ نص الأصحاح"}</button>`+
      `<button type="button" role="menuitem" data-ushare="1">${ic("share")} ${VV?"شارك الآية":"شارك رابط الأصحاح"}</button>`+
      (VV?`<a role="menuitem" href="mindmap.html#${b.abbr}/${d.c}:${d.v}" target="tskmindmap">${ic("topology-star-3")} شبكة شواهد الآية</a>`:"")+
      (RD?`<a role="menuitem" href="outline.html?b=${b.abbr}" target="tskoutline">${ic("bookmarks")} مخطط السفر</a>`:"")+
      (ST?"":`<a role="menuitem" href="compare.html?b=${b.abbr}&c=${S.c}">${ic("arrows-left-right")} مقارنة الترجمات الثلاث</a>`)+
      (VV?`<a role="menuitem" href="${repHref(vref(d),origOn()?"النص العبري أو اليوناني":TRN[trCur()])}" target="tskcontact">${REP_IC} أبلغ عن خطأ في نص هذه الآية</a>`:""));
    document.body.append(moreEl);
    const w=moreEl.offsetWidth; moreEl.style.top=(r.bottom+6)+"px"; moreEl.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left))+"px";
    btn.setAttribute("aria-expanded","true");
    const f=moreEl.querySelector("button,a"); f&&f.focus();
  }
  /* ⋯ «انسخ» و«شارك»: النص بالترجمة الظاهرة + المرجع واسم الترجمة */
  function shareData(){
    const b=book(), VV=S.view==="verse", tn=origOn()?"":` (${TRN[trCur()]})`, vt=x=>trText(x)||x.text||"";
    if(VV){const d=cur();return {title:vref(d),text:`«${vt(d)}» ${vref(d)}${tn}`,url:location.href}}
    const vs=inCh(b,S.c);
    return {title:`${bname(b)} ${n(S.c)}`,text:vs.map(x=>`${n(x.v)} ${vt(x)}`).join(" ")+`\n— ${bname(b)} ${n(S.c)}${tn}`,url:location.href};
  }
  const say=m=>{if(window.TSKLists&&TSKLists.toast)TSKLists.toast(m)};
  function copyText(t,ok){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>say(ok),()=>say("تعذّر النسخ — انسخ يدويًا"))}
  document.addEventListener("click",e=>{
    const t=e.target.closest&&e.target.closest(".umore [data-ucopy], .umore [data-ushare]"); if(!t)return;
    const sd=shareData(); closeMore();
    if(t.dataset.ucopy){copyText(sd.text,S.view==="verse"?"نُسخت الآية":"نُسخ نص الأصحاح");return}
    if(navigator.share){navigator.share(S.view==="verse"?sd:{title:sd.title,url:sd.url}).catch(()=>{});return}
    copyText(S.view==="verse"?sd.text+"\n"+sd.url:sd.url,"نُسخ الرابط");
  });
  /* صفحة العدد: التبويبات (من غير إعادة رسم)، الكلمة تفتح تبويب «معنى الكلمات»، والسحب يمين/شمال للعدد التالي/السابق */
  function applyVtab(focus){
    $$("#main .vtabs [data-vtab]").forEach(b=>{const on=b.dataset.vtab===S.vtab;b.setAttribute("aria-selected",on);b.tabIndex=on?0:-1;if(on&&focus)b.focus()});
    $$("#main .vpanel").forEach(p=>p.hidden=p.dataset.vp!==S.vtab);
  }
  document.addEventListener("click",e=>{
    if(S.view!=="verse"||!$("#dict")) return;
    if(e.target.closest(".verse-card .sw, .verse-card span.sn, .ilist a.iln")&&S.vtab!=="dict"){S.vtab="dict";applyVtab()}
  },true);
  document.addEventListener("click",e=>{
    const b=e.target.closest&&e.target.closest("#main .vtabs [data-vtab]"); if(b){S.vtab=b.dataset.vtab;applyVtab();return}
    const s=e.target.closest&&e.target.closest("#strTgl.usw"); if(s){s.setAttribute("aria-checked",!store.get("nostr2",true))}
  });
  document.addEventListener("keydown",e=>{
    const t=e.target;
    if(t.matches&&t.matches("#main .vtabs [data-vtab]")&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){
      const bs=$$("#main .vtabs [data-vtab]"), i=bs.indexOf(t), j=(i+(e.key==="ArrowLeft"?1:-1)+bs.length)%bs.length; /* RTL: اليسار = التالي */
      S.vtab=bs[j].dataset.vtab; applyVtab(true); e.preventDefault(); return}
    if(t.matches&&t.matches(".ghead[role=button]")&&(e.key==="Enter"||e.key===" ")){e.preventDefault();t.click()}
  });
  /* aria-expanded لسطر الكلمة بعد ما app.js يفتحه/يقفله */
  document.addEventListener("click",e=>{const h=e.target.closest&&e.target.closest(".ghead[role=button]");if(h&&!e.target.closest("a.mm"))setTimeout(()=>h.setAttribute("aria-expanded",!h.parentElement.classList.contains("closed")),0)});
  let tx0=null;
  main.addEventListener("touchstart",e=>{tx0=S.view==="verse"&&e.target.closest(".vwrap")&&!e.target.closest(".sw,button,a")?[e.touches[0].clientX,e.touches[0].clientY]:null},{passive:true});
  main.addEventListener("touchend",e=>{if(!tx0)return;const p=e.changedTouches[0],dx=p.clientX-tx0[0],dy=p.clientY-tx0[1];tx0=null;
    if(Math.abs(dx)>70&&Math.abs(dy)<50){const b=$(dx>0?"#main .vnav.vnext":"#main .vnav.vprev");b&&b.click()}},{passive:true});

  /* التلميحات: لكل وضع مجموعة. تظهر كل مرة تُفتح فيها الصفحة أو يدخل القارئ الوضع،
     إلا لو اختار «لا تُظهر هذه التلميحات مرة أخرى» (يُحفظ لكل وضع في tsklib:utipsOff). التلميح اللي عنصره مش موجود بيتنطّ. */
  const TIPSETS={
    read:[[()=>$("#main .cvlist .cvn"),"اضغط على أي رقم عدد لترى شواهده."],
      [()=>$("#main .cvlist .cvt .sw")||$("#main .cvlist .cvt"),"اضغط على أي كلمة لتعرف أصلها العبري أو اليوناني ومعناها."],
      [()=>$("#main .userve [data-pres]"),"اعرض الأصحاح بملء الشاشة، آية في كل شريحة — مناسب للخدمة والاجتماعات."],
      [()=>$("#uGear"),"من هنا تغيّر حجم الخط والتشكيل وطريقة العرض."]],
    study:[[()=>$("#main .utools [data-inter]"),"«كلمة بكلمة» يعرض تحت الآية كل كلمة عبرية أو يونانية بنطقها ومعناها والكلمة العربية المقابلة لها."],
      [()=>$("#main .utools [data-orig], #main .utools [data-tr]"),"اقرأ الأصحاح بالعبرية أو اليونانية كما كُتب أول مرة."],
      [()=>$("#cstrBtn"),"يُظهر أرقام سترونج فوق الكلمات أو يخفيها."],
      [()=>$('#main .utools a[href^="compare.html"]'),"ينقلك إلى صفحة مقارنة الترجمات لتقرأ هذا الأصحاح في أكثر من ترجمة جنبًا إلى جنب."],
      [()=>$("#main details.olbox"),"مخطط السفر: أقسامه وعناوينها، لتعرف مكان هذا الأصحاح في الصورة الكاملة."],
      [()=>$("#main .cvlist:not(.nosup) .cvt .sw"),"الرقم فوق كل كلمة هو رقمها في قاموس سترونج. اضغط على الكلمة لتعرف أصلها ومعناها."],
      [()=>$("#main .cvlist .cvm"),"يمكنك الاطلاع على الشواهد المقابلة لهذه الآية، مع معنى كلماتها والملاحظات."],
      [()=>$("#main .cvlist .cvf .cpy"),"يمكنك إضافة الآية إلى إحدى قوائمك."],
      [()=>$("#main .cvlist .cvf .cpy-dd"),"يمكنك التحكم في قوائمك: اختيار القائمة التي تُضاف إليها الآيات، أو إنشاء قائمة جديدة."]]};
  const tipsOff=m=>(store.get("utipsOff",{})||{})[m]===true;
  function tipsSetOff(m,off){const o=store.get("utipsOff",{})||{};if(off)o[m]=true;else delete o[m];store.set("utipsOff",o)}
  let tipStep=0, tipEl=null, tipAnchor=null, tipMode="read";
  function tipClear(){if(tipEl)tipEl.remove();tipEl=null;if(tipAnchor)tipAnchor.classList.remove("utip-ring");tipAnchor=null}
  const tipEnd=tipClear;
  function tipPlace(){
    if(!tipEl||!tipAnchor)return;
    const r=tipAnchor.getBoundingClientRect(), w=tipEl.offsetWidth;
    let left=r.left+r.width/2-w/2; left=Math.max(12,Math.min(innerWidth-w-12,left));
    tipEl.style.left=left+"px"; tipEl.style.top=(r.bottom+12)+"px";
    tipEl.style.setProperty("--ax",Math.max(14,Math.min(w-14,r.left+r.width/2-left))+"px");
  }
  function tipShow(){
    tipClear();
    const L=TIPSETS[tipMode]||[];
    if(S.view!=="chapter"||MODE()!==tipMode||tipStep>=L.length) return tipEnd();
    const [get,txt]=L[tipStep], a=get(); if(!a){tipStep++;return tipShow()}
    const shown=L.filter(x=>x[0]()).length, idx=L.slice(0,tipStep).filter(x=>x[0]()).length, last=!L.slice(tipStep+1).some(x=>x[0]());
    tipAnchor=a; a.classList.add("utip-ring");
    if(a.closest(".stickbar")){const sb=$("#main .stickbar");sb&&sb.classList.remove("uxt-hide")} else a.scrollIntoView({block:"center"});
    tipEl=el("div",{class:"utip",role:"dialog","aria-label":"تلميح"},`<div class="ut-n">تلميح ${n(idx+1)} من ${n(shown)}</div><div class="ut-t">${txt}</div><label class="ut-off"><input type="checkbox" ${tipsOff(tipMode)?"checked":""}> لا تُظهر هذه التلميحات مرة أخرى</label><div class="ut-b"><button type="button" class="ut-skip">${last?"إغلاق":"تخطي"}</button><button type="button" class="ut-next">${last?"تمام":"التالي"}</button></div>`);
    document.body.append(tipEl); tipPlace();
    $(".ut-off input",tipEl).addEventListener("change",e=>tipsSetOff(tipMode,e.target.checked));
    $(".ut-next",tipEl).addEventListener("click",()=>{tipStep++;tipShow()});
    $(".ut-skip",tipEl).addEventListener("click",tipEnd);
    $(".ut-next",tipEl).focus();
  }
  function tipsStart(m){tipMode=m||MODE();tipStep=0;tipShow()}
  addEventListener("scroll",tipPlace,{passive:true}); addEventListener("resize",tipPlace);
  /* بعد كل render */
  const tipsShownIn=new Set();  /* مرة لكل وضع في كل فتحة للصفحة (التنقل بين الأصحاحات مش بيعيدها) */
  function uxAfter(){
    closeMore();
    document.documentElement.dataset.uxmode=MODE();
    const ps=$("#uPresSide"); if(ps){const b=book(),c=S.view==="book"?b.chapters[0]:S.c,v=(inCh(b,c)[0]||{}).v||1;ps.dataset.pres=`${b.id}.${c}:${v}`}
    if(tipEl&&(S.view!=="chapter"||MODE()!==tipMode)) tipClear();
    if(tipAnchor&&!document.contains(tipAnchor)){const s=tipStep;tipClear();tipStep=s;if(S.view==="chapter")setTimeout(tipShow,50)}
    if(S.view==="chapter"){const m=MODE();if(!tipsShownIn.has(m)&&!tipsOff(m)){tipsShownIn.add(m);setTimeout(()=>{if(!tipEl&&!sheetKind&&S.view==="chapter"&&MODE()===m)tipsStart(m)},800)}}
  }
  document.addEventListener("click",e=>{if(e.target.closest(".uxt-sheet [data-go]"))closeSheet()},true);
  document.addEventListener("click",e=>{
    const t=e.target;
    if(moreEl&&!t.closest(".umore")&&!t.closest("#uMore")) closeMore();
    let x;
    if((x=t.closest("[data-uref]"))){openRefs(x.dataset.uref);return}
    if((x=t.closest("button[data-umode]"))){if(x.dataset.umode!==MODE()){store.set("umode",x.dataset.umode);render()}return}
    if((x=t.closest("#uMore"))){toggleMore(x);return}
    if(t.closest("#uGear")){tipClear();openGear();return}
    if(t.closest(".umore [data-pres], .umore [data-scr]")){closeMore();return}
    if(t.closest("[data-uprint]")){closeMore();setTimeout(()=>window.print(),50);return}
    if(t.closest("#uImg")){store.set("uimg",!store.get("uimg",false));render();return}
    if((x=t.closest("#uDark"))){$("#themeBtn").click();x.setAttribute("aria-checked",isDark());return}
    if(t.closest("#uTips")){closeSheet();setTimeout(()=>tipsStart(MODE()),250);return}
  });
  document.addEventListener("change",e=>{
    const s=e.target.closest(".utr"); if(!s) return;
    if(s.value==="orig"){store.set("corig",true);store.set("inter",false)} else {store.set("tr",s.value);store.set("corig",false)}
    render();
  });
  addEventListener("keydown",e=>{if(e.key==="Escape"){closeMore();if(tipEl)tipEnd()}});

  /* observer: app.js بيعمل innerHTML لـ #main في كل render */
  let busy=false;
  new MutationObserver(()=>{
    if(busy) return; busy=true;
    requestAnimationFrame(()=>{
      if(!$(".uxt-mark",main)){ if(sheetKind==="aa"||sheetKind==="gear"){ /* translation change → أعد بناء الـ sheet */ const k=sheetKind; sheetKind=null; process(); if(k==="aa")openAa(); else openGear(); } else process(); }
      syncDict(); syncOffline();
      busy=false;
    });
  }).observe(main,{childList:true,subtree:true});
  process();

  /* #2 hide on scroll down / show on scroll up */
  let lastY=scrollY;
  addEventListener("scroll",()=>{
    const y=scrollY, sb=$("#main .stickbar"); if(!sb) return;
    if(sheetKind) return;
    if(y>lastY+8&&y>220) sb.classList.add("uxt-hide");
    else if(y<lastY-8||y<120) sb.classList.remove("uxt-hide");
    lastY=y;
  },{passive:true});

  /* لو المقاس اتغير بين موبايل وديسكتوب نعيد الـ render */
  MQ.addEventListener("change",()=>{closeSheet();try{render()}catch(e){}});
})();
/* ==== UX LAYER END ==== */

/* ==== COPY LIST (قوائمي lists.html) ====
   زرار «أضف» جنب كل آية (الأصحاح، العدد، الشواهد): يضيف «نص الآية — الشاهد (الترجمة)» لآخر قائمة اتستخدمت،
   والسهم ▾ جنبه يفتح اختيار القوائم / قائمة جديدة. التخزين والقائمة المنبثقة والرسالة في dictcopy.js (window.TSKLists).
   زرار «قوائمي» + العدد في الشريط العلوي (stickBar)، ويتحدّث فورًا في كل التابات. */
var CPY_IC='<svg class="tic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" /></svg>';
var CPY_OK='<svg class="tic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5l10 -10" /></svg>';
var CPY_CHEV='<svg class="tic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6l6 -6" /></svg>';
var CPY_LIST='<svg class="tic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l11 0" /><path d="M9 12l11 0" /><path d="M9 18l11 0" /><path d="M5 6l0 .01" /><path d="M5 12l0 .01" /><path d="M5 18l0 .01" /></svg>';
function cpyKey(kind,ref){return "v|"+ref+"|"+cpyTrOf(kind)}
function cpySt(kind,ref){const L=window.TSKLists;return L?L.btnState(cpyKey(kind,ref)):{on:false,some:false,names:[],last:"القائمة الرئيسية"}}
function cpyTitle(st){return window.TSKLists?TSKLists.btnTitle(st,"نص الآية"):"أضف نص الآية لقوائمي"}
function cpyTotal(){const L=window.TSKLists;return L?L.total():0}
function cpyLbl(k){return k?`قوائمي — ${plural(k,"عنصر واحد","عنصران","عناصر","عنصرًا")}`:"قوائمي"}
function cpyBtnInner(on,big){return (on?CPY_OK:CPY_IC)+(big==="pl"?`<span>${on?"مضافة":"أضف"}</span>`:big?`<span>${on?"في قوائمي":"أضف لقوائمي"}</span>`:"")}
/* اسم «الترجمة» اللي هيتكتب بين القوسين: لو «اللغة الأصلية» شغالة، نص العدد نفسه بيتاخد من العبري/اليوناني (الشواهد بتفضل بالترجمة) */
function cpyTrOf(kind){if(kind==="v"&&origOn())return book().id>39?"النص اليوناني":"النص العبري";return TRN[trCur()]}
function cpyBtn(kind,id,ref,big){
  const st=cpySt(kind,ref);
  return `<span class="cpyg"><span class="cpy${big==="pl"?" pl":big?" big":""}${st.on?" on":""}${st.some?" some":""}" role="button" tabindex="0" aria-pressed="${st.on}" data-cpy="${kind}" data-cid="${esc(id)}" data-cref="${esc(ref)}" title="${esc(cpyTitle(st))}">${cpyBtnInner(st.on,big)}</span>`+
    `<span class="cpy-dd" role="button" tabindex="0" aria-haspopup="true" aria-expanded="false" aria-label="اختر القائمة أو أنشئ قائمة جديدة" title="اختر القائمة أو أنشئ قائمة جديدة">${CPY_CHEV}</span></span>`}
/* زرار الشريط العلوي «قوائمي»: يظهر بعد أول عنصر */
function cpyTop(){const k=cpyTotal();
  return `<span class="cpy-tops" data-n="${k?1:0}"><a class="cpy-top vs" href="lists.html" target="tsklists" ${k?"":"hidden"} aria-label="${cpyLbl(k)}" title="${cpyLbl(k)}">${CPY_LIST}<span class="ct-l">قوائمي</span><b class="cpy-count">${k?n(k):""}</b></a></span>`}
function cpyText(el){
  const kind=el.dataset.cpy;
  if(kind==="v"){const p=parseGo(el.dataset.cid);if(!p)return "";const b=BY[p[0]],d=b&&b.verses[b.idx[p[1]+":"+p[2]]];if(!d)return "";
    if(origOn()){const O=window.ORIG&&window.ORIG[b.abbr];if(!O)return null;return (O[d.c+":"+d.v]||"").trim()}
    return (trText(d)||d.text||"").trim()}
  const row=el.closest(".r"); if(!row) return "";
  const ps=[...row.querySelectorAll(".txt p")];
  if(ps.some(p=>p.querySelector(".txp"))) return null; /* لسه بيتحمّل */
  if(row.querySelector(".txna")) return "";
  return ps.map(p=>{const vn=p.querySelector(".vn");const t=[...p.childNodes].filter(x=>x!==vn).map(x=>x.textContent).join("").trim();return vn?`(${vn.textContent.trim()}) ${t}`:t}).join(" ").trim();
}
/* تحديث كل الأزرار والعدادات من القوائم المحفوظة (نفس التاب أو تاب تاني) */
var CPY_LAST=-1;
function cpyBump(el){if(!el)return;el.classList.remove("bump");void el.offsetWidth;el.classList.add("bump")}
function cpyCount(){const k=cpyTotal(), g=CPY_LAST>=0&&k>CPY_LAST; CPY_LAST=k;
  document.querySelectorAll(".cpy-count").forEach(c=>{c.textContent=k?n(k):"";c.hidden=!k});
  document.querySelectorAll(".cpy-tops:not(.sb)").forEach(w=>{w.dataset.n=k?1:0;
    const v=w.querySelector(".cpy-top");if(v){v.hidden=!k;v.setAttribute("aria-label",cpyLbl(k));v.title=cpyLbl(k);const c=v.querySelector(".cpy-count");if(c)c.textContent=k?n(k):"";if(g)cpyBump(v)}})}
function cpySync(){
  document.querySelectorAll(".cpy").forEach(b=>{const st=cpySt(b.dataset.cpy,b.dataset.cref),big=b.classList.contains("pl")?"pl":b.classList.contains("big");
    const t=cpyTitle(st);
    if(b.classList.contains("on")===st.on&&b.classList.contains("some")===st.some&&b.title===t&&b.firstChild)return;
    b.classList.toggle("on",st.on);b.classList.toggle("some",st.some);b.setAttribute("aria-pressed",st.on);
    b.title=t;b.innerHTML=cpyBtnInner(st.on,big)});
  cpyCount()}
function cpyOpts(el){
  const kind=el.dataset.cpy, tr=cpyTrOf(kind), ref=el.dataset.cref;
  return {key:"v|"+ref+"|"+tr, label:`<b>${esc(ref)}</b> <span class="ct-tr">(${esc(tr)})</span>`, title:`أضف <b>${esc(ref)}</b> إلى:`,
    build:()=>{const t=cpyText(el);
      if(t===null)return {err:"النص لسه بيتحمّل… حاول تاني بعد لحظة"};
      if(!t)return {err:kind==="v"&&origOn()?"العدد ده مش موجود في النص الأصلي":"نص الشاهد ده مش متاح دلوقتي (محتاج إنترنت)"};
      return {k:"v",t,ref,tr,at:Date.now()}}}}
function cpyToggle(el){if(window.TSKLists)TSKLists.quick(cpyOpts(el))}
function cpyPick(dd){const el=dd.parentElement&&dd.parentElement.querySelector(".cpy");if(el&&window.TSKLists)TSKLists.pick(dd,cpyOpts(el))}
/* capture: قبل ما مستمع data-go / صف الشاهد يفتح العدد */
document.addEventListener("click",e=>{const d=e.target.closest(".cpy-dd");if(d){e.preventDefault();e.stopPropagation();cpyPick(d);return}
  const c=e.target.closest(".cpy");if(!c)return;e.preventDefault();e.stopPropagation();cpyToggle(c)},true);
document.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!==" ")return;const t=e.target.closest&&e.target.closest(".cpy,.cpy-dd");if(!t)return;e.preventDefault();e.stopPropagation();
  if(t.classList.contains("cpy-dd"))cpyPick(t);else cpyToggle(t)},true);
document.addEventListener("tsk:lists",()=>{try{cpySync()}catch(x){}});
addEventListener("pageshow",()=>{try{cpySync()}catch(x){}});
document.addEventListener("visibilitychange",()=>{if(!document.hidden)try{cpySync()}catch(x){}});
/* ==== COPY LIST END ==== */
