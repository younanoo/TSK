/* جدد وعتقاء — تثبيت التطبيق في كل الصفحات (يحمّله brand.js، والبناء يضيف رقم النسخة)
   - window.TSKInstall.open(): نافذة التثبيت الأصلية لو المتصفح يسمح، وإلا شرح الخطوات لهذا الجهاز والمتصفح.
   - أي زر عليه data-install يفتحها (الرئيسية، وإمكانيات الموقع، والقائمة الجانبية في كل الصفحات).
   - المتصفحات الداخلية (فيسبوك، ماسنجر، إنستجرام، تيك توك…) لا تسمح بالتثبيت: نطلب فتح الموقع في Chrome أو Safari أولًا.
   - شريط صغير أسفل الشاشة على الموبايل يقترح التثبيت (من الزيارة الثانية، أو من الأولى داخل متصفح داخلي)، ولا يظهر ٦٠ يومًا بعد قفله.
   الإعدادات: tsklib:instbar (وقت قفل الشريط)، tsklib:visits (عدد الزيارات). */
(function(){
"use strict";
if(window.TSKInstall)return;
var root=document.documentElement,ua=navigator.userAgent||"";
var me=document.currentScript,base=me&&me.src?me.src.replace(/install\.js(\?.*)?$/,""):"assets/";
var iOS=/iPad|iPhone|iPod/.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1),
  android=/Android/i.test(ua),ff=/Firefox|FxiOS/i.test(ua),edge=/Edg\//.test(ua),sam=/SamsungBrowser/i.test(ua),
  safariMac=/Macintosh/.test(ua)&&/Safari/.test(ua)&&!/Chrome|Chromium|Edg/.test(ua)&&!iOS;
var track=function(n,p){try{window.tskTrack&&window.tskTrack(n,p||{})}catch(e){}};
var standalone=function(){try{return matchMedia("(display-mode: standalone)").matches||matchMedia("(display-mode: window-controls-overlay)").matches||navigator.standalone===true}catch(e){return false}};

/* ---------- المتصفح الداخلي: null = متصفح عادي، "" = داخلي غير معروف الاسم ---------- */
var IAB=[["ماسنجر",/Messenger|MESSENGER|Orca-Android/],["فيسبوك",/FBAN|FBAV|FB_IAB|FBIOS|FB4A/],["إنستجرام",/Instagram/],
  ["تيك توك",/musical_ly|BytedanceWebview|TikTok|trill_/i],["سناب شات",/Snapchat/],["لينكدإن",/LinkedInApp/],["تليجرام",/Telegram/],["لاين",/\bLine\//],["إكس (تويتر)",/Twitter/]];
var inApp=function(){
  for(var i=0;i<IAB.length;i++)if(IAB[i][1].test(ua))return IAB[i][0];
  if(android&&/; wv\)/.test(ua))return "";
  if(iOS&&/AppleWebKit/.test(ua)&&!/Safari\//.test(ua))return "";
  return null;
};

/* ---------- نافذة التثبيت الأصلية (brand.js يلتقطها مبكرًا في window.__tskBip) ---------- */
var dp=window.__tskBip||null;
addEventListener("beforeinstallprompt",function(e){e.preventDefault();dp=e;window.__tskBip=e});
addEventListener("appinstalled",function(){dp=null;window.__tskBip=null;root.classList.add("is-app");hideBar();if(dlg&&dlg.open)dlg.close();track("install_done")});
if(standalone())root.classList.add("is-app");

/* ---------- الشكل ---------- */
/* شكل النافذة نفسه منسوخ من .h-dlg في index.html حتى تظهر صح في كل الصفحات */
var css=".inst-dlg{border:0;padding:0;border-radius:22px;background:var(--paper);color:var(--ink);box-shadow:0 20px 60px rgba(0,0,0,.35);width:min(460px,calc(100vw - 32px));max-height:calc(100vh - 32px)}.inst-dlg::backdrop{background:var(--scrim)}.inst-dlg .dh{display:flex;align-items:center;gap:12px;padding:20px 22px 0}.inst-dlg .dh img{width:44px;height:44px;border-radius:12px}.inst-dlg h3{margin:0;font:700 19px var(--display);color:var(--heading);flex:1}.inst-dlg .x{all:unset;cursor:pointer;width:36px;height:36px;display:grid;place-items:center;border-radius:10px;color:var(--muted)}.inst-dlg .x:hover{background:var(--chip)}.inst-dlg .db{padding:14px 22px 22px}.inst-dlg .db>p{margin:0 0 14px;color:var(--muted);font-size:14.5px}.inst-dlg ol{margin:0;padding:0;list-style:none;counter-reset:s;display:grid;gap:10px}.inst-dlg li{counter-increment:s;display:flex;gap:12px;align-items:flex-start;background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:12px 14px;font-size:15px}.inst-dlg li:before{content:counter(s,arabic-indic);flex:none;width:26px;height:26px;border-radius:50%;background:var(--accent);color:var(--on-accent);display:grid;place-items:center;font:700 13px var(--display)}.inst-dlg li b{color:var(--heading)}.inst-dlg .kbd{display:inline-flex;align-items:center;gap:4px;font:600 13px var(--ui);background:var(--chip);border:1px solid var(--line);border-radius:6px;padding:1px 7px;white-space:nowrap}.inst-dlg .note{margin:14px 0 0;font-size:13.5px;color:var(--muted)}.inst-dlg .why{margin:16px 0 0;padding-top:14px;border-top:1px solid var(--line);display:grid;gap:6px;font-size:13.5px;color:var(--muted)}.inst-dlg .why span{display:flex;gap:8px;align-items:center}.inst-dlg .why .ic{color:var(--done)}"+".is-app [data-install]{display:none!important}"
 +".inst-bar{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:85;max-width:520px;margin:0 auto;display:flex;align-items:center;gap:12px;padding:10px 10px 10px 12px;background:var(--paper);color:var(--ink);border:1px solid var(--line);border-radius:16px;box-shadow:0 10px 32px rgba(0,0,0,.28);font:14px var(--ui);transform:translateY(calc(100% + 40px));transition:transform .35s ease}"
 +".inst-bar.on{transform:none}.inst-bar img{width:42px;height:42px;border-radius:11px;flex:none}"
 +".inst-bar .t{flex:1;min-width:0;line-height:1.4}.inst-bar .t b{display:block;color:var(--heading);font-size:14.5px}.inst-bar .t small{display:block;color:var(--muted);font-size:12.5px}"
 +".inst-bar .go{all:unset;cursor:pointer;flex:none;background:var(--accent);color:var(--on-accent);font:700 14px var(--ui);padding:10px 16px;border-radius:11px}"
 +".inst-bar .x{all:unset;cursor:pointer;flex:none;width:34px;height:34px;display:grid;place-items:center;border-radius:9px;color:var(--muted)}.inst-bar .x:hover{background:var(--chip)}"
 +".inst-bar :focus-visible{outline:2px solid var(--gold);outline-offset:2px}"
 +"@media (prefers-reduced-motion:reduce){.inst-bar{transition:none}}"
 +"#instDlg .iab-acts{display:grid;gap:8px;margin:16px 0 0}"
 +"#instDlg .iab-acts a,#instDlg .iab-acts button{all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;min-height:46px;padding:0 14px;border-radius:12px;font:700 15px var(--ui);text-align:center}"
 +"#instDlg .iab-acts .main{background:var(--accent);color:var(--on-accent)}"
 +"#instDlg .iab-acts .sec{border:1px solid var(--line);background:var(--bg);color:var(--heading)}"
 +"#instDlg .iab-acts :focus-visible{outline:2px solid var(--gold);outline-offset:2px}";
var st=document.createElement("style");st.textContent=css;(document.head||root).appendChild(st);

var X='<svg class="ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6l-12 12"/><path d="M6 6l12 12"/></svg>';
var CHECK='<svg class="ic" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5l10 -10"/></svg>';
var SHARE='<svg class="ic" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 9h-1a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-8a2 2 0 0 0 -2 -2h-1"/><path d="M12 14v-11"/><path d="M9 6l3 -3l3 3"/></svg>';
var kb=function(t){return '<span class="kbd">'+t+'</span>'};
var ICON=base+"brand/app-icon-192.png";

/* ---------- النافذة: نستعمل #instDlg لو موجودة في الصفحة، وإلا ننشئها ---------- */
var dlg=null,body=null;
function getDlg(){
  if(dlg)return dlg;
  dlg=document.getElementById("instDlg");
  if(!dlg){
    dlg=document.createElement("dialog");dlg.className="h-dlg inst-dlg";dlg.id="instDlg";dlg.setAttribute("aria-labelledby","instTitle");
    dlg.innerHTML='<div class="dh"><img src="'+ICON+'" alt=""><h3 id="instTitle">ثبّت «جدد وعتقاء»</h3><button class="x" type="button" id="instClose" aria-label="إغلاق">'+X+'</button></div><div class="db" id="instBody"></div>';
    document.body.appendChild(dlg);
  }
  body=dlg.querySelector("#instBody");
  var c=dlg.querySelector("#instClose");if(c)c.addEventListener("click",function(){dlg.close()});
  dlg.addEventListener("click",function(e){if(e.target===dlg)dlg.close()});
  return dlg;
}

function guide(){
  var intro="",steps=[],note="",acts="",kind="",iab=inApp();
  if(location.protocol==="file:"){
    kind="file";
    intro="لا يعمل التثبيت والموقع مفتوح كملف من الجهاز. افتح الموقع من الإنترنت أولًا:";
    steps=['افتح الموقع من الإنترنت في المتصفح','اضغط على زر '+kb("تنزيل التطبيق")+' مرة أخرى'];
  }else if(iab!==null){
    kind="inapp";
    var nm=iab?"«"+iab+"»":"التطبيق الذي فتحت منه الرابط";
    intro="أنت تتصفح الموقع داخل "+nm+"، وهذا المتصفح الداخلي لا يسمح بتثبيت التطبيقات. افتح الموقع في "+(iOS?"<b>Safari</b>":"<b>Chrome</b>")+" أولًا:";
    if(android){
      steps=['اضغط على زر '+kb("افتح في Chrome")+' بالأسفل','وفي Chrome اضغط على زر '+kb("تنزيل التطبيق")+' أو '+kb("ثبّت")+' مرة أخرى'];
      var u=location.host+location.pathname+location.search; /* بدون #… لأن الـ intent نفسه يبدأ بـ #Intent */
      acts='<a class="main" href="intent://'+u+'#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url='+encodeURIComponent(location.href)+';end">افتح في Chrome</a>';
      note="إن لم يُفتح Chrome، فاضغط على القائمة "+kb("⋮")+" في أعلى الشاشة واختر "+kb("فتح في المتصفح")+"، أو انسخ الرابط والصقه في Chrome.";
    }else{
      steps=['اضغط على '+kb("⋯")+' أو على أيقونة البوصلة في أعلى الشاشة أو أسفلها','اختر '+kb("فتح في Safari")+' أو '+kb("فتح في المتصفح"),'وفي Safari اضغط على زر '+kb("تنزيل التطبيق")+' أو '+kb("ثبّت")+' مرة أخرى'];
      note="إن لم تجد هذا الخيار، فانسخ الرابط وافتح Safari والصقه في شريط العنوان.";
    }
    acts+='<button type="button" class="sec" data-copy>انسخ رابط الموقع</button>';
  }else if(iOS){
    kind="ios";
    var other=/CriOS|EdgiOS|FxiOS|OPiOS/.test(ua);
    intro="على الآيفون والآيباد يتم التثبيت من قائمة المشاركة:";
    steps=['اضغط على زر المشاركة '+kb(SHARE)+(other?" الموجود في شريط العنوان":" في Safari")+'، وإن لم تجده فاضغط '+kb("⋯")+' ثم '+kb("مشاركة"),
      'مرّر القائمة لأسفل واختر '+kb("إضافة إلى الشاشة الرئيسية")+' (قد تجده تحت '+kb("المزيد")+')','اضغط '+kb("إضافة")];
    note="إن لم تجد هذا الخيار، فافتح الموقع في Safari وجرّب مرة أخرى.";
  }else if(android){
    kind="android";
    intro="على أندرويد:";
    steps=sam?['اضغط على القائمة '+kb("☰")+' في الأسفل','اختر '+kb("إضافة صفحة إلى")+' ← '+kb("الشاشة الرئيسية")]
      :ff?['اضغط على القائمة '+kb("⋮"),'اختر '+kb("تثبيت")+' أو '+kb("إضافة إلى الشاشة الرئيسية")]
      :['اضغط على القائمة '+kb("⋮")+' في الأعلى بجانب شريط العنوان','اختر '+kb("تثبيت التطبيق")+' أو '+kb("إضافة إلى الشاشة الرئيسية"),'أكّد بالضغط على '+kb("تثبيت")];
  }else if(safariMac){
    kind="mac";
    intro="على Safari في الماك:";
    steps=['من القائمة العلوية اختر '+kb("ملف")+' ← '+kb("إضافة إلى Dock"),'اضغط '+kb("إضافة")];
  }else if(ff){
    kind="firefox";
    intro="لا يدعم متصفح Firefox على الحاسوب تثبيت المواقع كتطبيقات.";
    steps=['افتح الموقع في <b>Chrome</b> أو <b>Edge</b>','اضغط على زر '+kb("تنزيل التطبيق")+' مرة أخرى'];
  }else{
    kind="desktop";
    intro=edge?"على Microsoft Edge:":"على Chrome:";
    steps=['اضغط على أيقونة التثبيت '+kb("⊕")+' في طرف شريط العنوان','أو من القائمة '+kb("⋮")+' اختر '+(edge?kb("التطبيقات")+" ← "+kb("تثبيت هذا الموقع كتطبيق"):kb("إرسال وحفظ ومشاركة")+" ← "+kb("تثبيت الصفحة كتطبيق")),'أكّد بالضغط على '+kb("تثبيت")];
    note="إن لم تجد أيقونة التثبيت، فربما يكون الموقع مثبّتًا لديك بالفعل: ابحث عن «جدد وعتقاء» في قائمة البرامج.";
  }
  getDlg();
  body.innerHTML='<p>'+intro+'</p><ol>'+steps.map(function(x){return '<li><span>'+x+'</span></li>'}).join("")+'</ol>'
    +(acts?'<div class="iab-acts">'+acts+'</div>':"")+(note?'<p class="note">'+note+'</p>':"")
    +'<div class="why"><span>'+CHECK+' يُفتح من أيقونة على الشاشة مثل أي تطبيق</span><span>'+CHECK+' الصفحات التي فتحتها سابقًا تعمل دون إنترنت</span><span>'+CHECK+' مجاني وبلا تسجيل، وحجمه صغير</span></div>';
  var cp=body.querySelector("[data-copy]");
  if(cp)cp.addEventListener("click",function(){
    var done=function(){cp.textContent="تم النسخ ✓ — الصقه في "+(iOS?"Safari":"Chrome");track("install_copy_link")};
    try{navigator.clipboard.writeText(location.href).then(done,fallback)}catch(e){fallback()}
    function fallback(){try{var t=document.createElement("textarea");t.value=location.href;t.style.position="fixed";t.style.opacity="0";document.body.appendChild(t);t.select();document.execCommand("copy");t.remove();done()}catch(e){cp.textContent=location.href}}
  });
  var oc=body.querySelector(".iab-acts .main");if(oc)oc.addEventListener("click",function(){track("install_open_chrome")});
  track("install_guide",{kind:kind,app:iab||""});
  if(!dlg.open)dlg.showModal();
}

function open(){
  hideBar(true);
  if(dp&&inApp()===null){
    var p=dp;dp=null;window.__tskBip=null;
    try{p.prompt();p.userChoice.then(function(r){if(r&&r.outcome==="accepted")root.classList.add("is-app")},function(){})}catch(e){guide()}
    return;
  }
  guide();
}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-install]");if(!b)return;e.preventDefault();open()});

/* ---------- شريط الاقتراح على الموبايل ---------- */
var K="tsklib:";
var lsGet=function(k){try{return JSON.parse(localStorage.getItem(K+k))}catch(e){return null}};
var lsSet=function(k,v){try{localStorage.setItem(K+k,JSON.stringify(v))}catch(e){}};
var visits=+lsGet("visits")||0;
try{if(!sessionStorage.getItem("tsk_visit")){sessionStorage.setItem("tsk_visit","1");visits++;lsSet("visits",visits)}}catch(e){}
var bar=null;
function hideBar(remember){
  if(remember)lsSet("instbar",Date.now());
  if(!bar)return;var b=bar;bar=null;b.classList.remove("on");setTimeout(function(){b.remove()},400);
}
function showBar(){
  if(bar||standalone()||root.classList.contains("is-app"))return;
  if(document.querySelector("dialog[open], .sm-panel.on"))return void setTimeout(showBar,15000);
  bar=document.createElement("div");bar.className="inst-bar";bar.setAttribute("role","region");bar.setAttribute("aria-label","تثبيت التطبيق");
  bar.innerHTML='<img src="'+ICON+'" alt=""><div class="t"><b>ثبّت «جدد وعتقاء» على هاتفك</b><small>يُفتح بلمسة، ويعمل دون إنترنت فيما فتحته سابقًا</small></div><button type="button" class="go">ثبّت</button><button type="button" class="x" aria-label="إغلاق">'+X+'</button>';
  bar.querySelector(".go").addEventListener("click",function(){track("install_bar",{action:"open"});open()});
  bar.querySelector(".x").addEventListener("click",function(){track("install_bar",{action:"close"});hideBar(true)});
  document.body.appendChild(bar);
  requestAnimationFrame(function(){requestAnimationFrame(function(){bar&&bar.classList.add("on")})});
  track("install_bar",{action:"show",app:inApp()||""});
}
(function(){
  if(standalone()||location.protocol==="file:"||!(iOS||android))return;
  var off=+lsGet("instbar")||0;if(off&&Date.now()-off<60*864e5)return;
  var iab=inApp();
  if(iab===null&&visits<2)return;
  var go=function(){
    /* الصفحات اللي فيها زر «تنزيل التطبيق» ظاهر (الرئيسية، وإمكانيات الموقع) لا تحتاج الشريط */
    if(document.querySelector("[data-install]:not(.inst-m),[data-dl]"))return;
    setTimeout(showBar,iab!==null?15000:30000);
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go();
})();

window.TSKInstall={open:open,guide:guide,inApp:inApp};
})();
