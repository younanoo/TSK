/* جدد وعتقاء — نسخ مداخل القواميس (سترونج / BDB / أبوت-سميث) إلى صفحة dictcopy.html
   يضيف زرار «نسخ» في رأس كل مدخل (.dent .hd) أينما ظهر: صفحات الأسفار، strong.html، arword.html.
   يقرأ المدخل من الصفحة نفسها ويحفظه في localStorage (tsklib:dictlist). لا يغيّر app.js ولا ملفات القواميس. */
(function(){
  "use strict";
  var KEY="tsklib:dictlist";
  var IC='<svg class="tic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" /></svg>';
  var OK='<svg class="tic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5l10 -10" /></svg>';
  var XI='<svg class="tic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>';
  var DICTS={strong:"قاموس سترونج",bdb:"قاموس BDB العبري",abbott:"قاموس أبوت-سميث اليوناني"};
  function get(){try{var a=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(a)?a:[]}catch(e){return []}}
  function put(a){try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}try{document.dispatchEvent(new Event("tsk:dictlist"))}catch(e){}sbBtn()}
  var nAr=function(x){return String(x).replace(/\d/g,function(d){return "٠١٢٣٤٥٦٧٨٩"[d]})};
  var esc=function(x){return String(x==null?"":x).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
  function dictOf(dent){return dent.closest(".bdbox")?"bdb":dent.closest(".asbox")?"abbott":"strong"}
  function numOf(dent){var x=dent.querySelector(".hd .num");return x?x.textContent.trim():""}
  function has(d,num){return get().some(function(x){return x.dict===d&&x.num===num})}
  /* نص المدخل مع الحفاظ على الأسطر (كل معنى/فقرة في سطر) */
  function toText(el){
    if(!el) return "";
    var c=el.cloneNode(true);
    c.querySelectorAll(".na,button,script,style,.dcp").forEach(function(x){x.remove()});
    c.querySelectorAll("br").forEach(function(b){b.replaceWith("\n")});
    c.querySelectorAll("div,p,li,hr,h5,section").forEach(function(b){b.before("\n");b.after("\n")});
    return c.textContent.replace(/[ \t ]+/g," ").replace(/ *\n */g,"\n").replace(/\n{2,}/g,"\n").trim();
  }
  function read(dent){
    var d=dictOf(dent), q=function(s){return dent.querySelector(s)};
    var o={dict:d,num:numOf(dent),orig:"",tr:"",occ:"",ar:"",en:"",ref:"",words:"",at:Date.now()};
    var og=q(".hd .orig"); o.orig=og?og.textContent.trim():"";
    var tr=q(".hd .tr"), tt=tr?tr.textContent.replace(/\s+/g," ").trim():"";
    if(d==="strong") o.tr=tt; else o.occ=tt;                 /* BDB/أبوت-سميث: «ترد نحو … مرة» */
    if(d==="strong"){o.ar=toText(q(".col.arc .tx"));o.en=toText(q(".col.enc .tx"))}
    else if(d==="bdb"){o.ar=toText(q(".bd-body"));o.en=toText(q(".bd-en"))}
    else{o.ar=toText(q(".as-body"));o.en=toText(q(".as-en"))}
    /* الموضع (لو المدخل مفتوح من آية): من زرار Google AI في مدخل سترونج لنفس الرقم */
    var sec=dent.closest("section")||dent, scope=sec.parentElement||document;
    var ai=dent.querySelector(".stai[data-ref]")||scope.querySelector('.stai[data-ref][data-num="'+o.num+'"]');
    if(ai){o.ref=(ai.dataset.ref||"").trim();o.words=(ai.dataset.words||"").trim()}
    return o;
  }
  function btnInner(on){return (on?OK:IC)+"<span>"+(on?"منسوخ":"نسخ")+"</span>"}
  function paint(b,on){b.classList.toggle("on",on);b.setAttribute("aria-pressed",on);
    b.title=on?"المدخل في صفحة نسخ القاموس — اضغط للإزالة":"أضف هذا المدخل لصفحة نسخ القاموس";b.innerHTML=btnInner(on)}
  function inject(){
    document.querySelectorAll(".dent > .hd").forEach(function(hd){
      if(hd.querySelector(".dcp")) return;
      var dent=hd.parentElement, num=numOf(dent);
      if(!num||!hd.querySelector(".orig")) return;             /* مدخل غير متاح / جارٍ التحميل */
      var b=document.createElement("button"); b.type="button"; b.className="dcp";
      paint(b,has(dictOf(dent),num)); hd.appendChild(b);
    });
  }
  function sync(){document.querySelectorAll(".dent > .hd > .dcp").forEach(function(b){var dent=b.closest(".dent");paint(b,has(dictOf(dent),numOf(dent)))})}
  /* الرسالة (نفس شكل رسالة صفحة النسخ) */
  var T={h:null,undo:null};
  function hide(){var t=document.getElementById("dcpToast");if(t)t.classList.remove("on");T.undo=null}
  function toast(msg,opt){opt=opt||{};var t=document.getElementById("dcpToast");
    if(!t){t=document.createElement("div");t.id="dcpToast";t.className="cpy-toast";t.setAttribute("role","status");t.setAttribute("aria-live","polite");document.body.appendChild(t);
      var hold=function(){clearTimeout(T.h)},go=function(){clearTimeout(T.h);T.h=setTimeout(hide,2500)};
      t.addEventListener("mouseenter",hold);t.addEventListener("mouseleave",go);t.addEventListener("focusin",hold);t.addEventListener("focusout",go);
      t.addEventListener("click",function(e){var b=e.target.closest("[data-ct]");if(!b)return;
        if(b.dataset.ct==="undo"&&T.undo){var u=T.undo;T.undo=null;put(u.list);sync();toast(u.msg)}else hide()})}
    T.undo=opt.undo||null;
    t.innerHTML='<span class="ct-msg">'+msg+'</span>'+(opt.undo?'<button type="button" class="ct-btn" data-ct="undo">تراجع</button>':"")+
      (opt.open?'<a class="ct-btn ct-main" data-ct="open" href="dictcopy.html" target="tskdict">افتح صفحة نسخ القاموس'+(opt.k?" ("+nAr(opt.k)+")":"")+'</a>':"")+
      '<button type="button" class="ct-x" data-ct="x" aria-label="إغلاق">'+XI+'</button>';
    t.classList.add("on");clearTimeout(T.h);T.h=setTimeout(hide,opt.open||opt.undo?6000:3000)}
  function toggle(b){
    var dent=b.closest(".dent"), d=dictOf(dent), num=numOf(dent), before=get(), list=before.slice();
    var i=list.findIndex(function(x){return x.dict===d&&x.num===num});
    var lbl="<b>"+esc(num)+"</b> <span class=\"ct-tr\">("+DICTS[d]+")</span>";
    if(i>=0){list.splice(i,1);put(list);sync();toast("أُزيل "+lbl+" من صفحة نسخ القاموس",{undo:{list:before,msg:"رجع "+lbl},open:list.length>0,k:list.length});return}
    var o=read(dent);
    if(!o.ar&&!o.en){toast("المدخل لسه بيتحمّل… حاول تاني بعد لحظة");return}
    list.push(o);put(list);sync();
    toast(OK+" أُضيف "+lbl,{undo:{list:before,msg:"اتشال "+lbl},open:true,k:list.length});
  }
  document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".dcp");if(!b)return;e.preventDefault();e.stopPropagation();toggle(b)},true);
  addEventListener("storage",function(e){if(e.key===KEY||e.key===null)sync()});
  addEventListener("pageshow",sync);
  document.addEventListener("visibilitychange",function(){if(!document.hidden)sync()});
  /* زرار «قاموس» بالعدد في الشريط العلوي لصفحات سترونج والبحث بالكلمة العربية (صفحات الأسفار: app.js) */
  var LI='<svg class="tic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h7" /><path d="M9 3v2c0 4.418 -2.239 8 -5 8" /><path d="M5 9c0 2.144 2.952 3.908 6.7 4" /><path d="M12 20l4 -9l4 9" /><path d="M19.1 18h-6.2" /></svg>';
  var SBL=-1;
  function sbBtn(){var bar=document.querySelector(".sitebar");if(!bar)return;
    var w=bar.querySelector(".cpy-tops.sb");
    if(!w){w=document.createElement("span");w.className="cpy-tops sb";
      w.innerHTML='<a class="cpy-top dc" href="dictcopy.html" target="tskdict">'+LI+'<span class="ct-l">قاموس</span><b class="dict-count"></b></a>';
      var ref=bar.querySelector(".sb-link")||bar.querySelector(".sb-theme");if(ref)bar.insertBefore(w,ref);else bar.appendChild(w)}
    var m=get().length,a=w.firstChild,lbl=m?"صفحة نسخ القاموس — "+nAr(m)+(m===1?" مدخل":m===2?" مدخلين":" مداخل"):"صفحة نسخ القاموس";
    w.dataset.n=m?1:0;a.hidden=!m;a.title=lbl;a.setAttribute("aria-label",lbl);w.querySelector(".dict-count").textContent=m?nAr(m):"";
    if(SBL>=0&&m>SBL){a.classList.remove("bump");void a.offsetWidth;a.classList.add("bump")}SBL=m}
  addEventListener("storage",function(e){if(e.key===KEY||e.key===null)sbBtn()});
  function start(){sbBtn();inject();var q=false;new MutationObserver(function(){if(q)return;q=true;requestAnimationFrame(function(){q=false;inject()})}).observe(document.body,{childList:true,subtree:true})}
  if(document.body) start(); else document.addEventListener("DOMContentLoaded",start);
  window.TSKDictCopy={count:function(){return get().length}};
})();
