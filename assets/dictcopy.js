/* جدد وعتقاء — «قوائمي» (lists.html) + زرار نسخ مداخل القواميس
   1) TSKLists: القوائم المحفوظة في المتصفح (localStorage: tsklib:lists) — قائمة رئيسية ثابتة + قوائم يضيفها المستخدم.
      كل قائمة فيها عناصر بترتيب الإضافة: آية (k:"v")، مدخل قاموس (k:"d")، شرح يكتبه المستخدم (k:"n").
      الزرار السريع يضيف لآخر قائمة اتستخدمت (last)، والسهم ▾ جنبه يفتح اختيار القوائم / قائمة جديدة.
      app.js (زرار الآيات) و lists.html بيستخدموا نفس الكود ده.
   2) زرار «أضف» + السهم في رأس كل مدخل قاموس (.dent .hd): صفحات الأسفار، وصفحة البحث search.html (تبويبا سترونج والجذر).
   3) زرار «قوائمي» بالعدد في الشريط العلوي لصفحات سترونج والبحث بالكلمة العربية (صفحات الأسفار: app.js). */
(function(){
  "use strict";
  var LK="tsklib:lists", MAIN="main", MAIN_NAME="القائمة الرئيسية", PAGE="lists.html", TGT="tsklists";
  var IC='<svg class="tic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" /></svg>';
  var OK='<svg class="tic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5l10 -10" /></svg>';
  var XI='<svg class="tic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>';
  var CHEV='<svg class="tic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6l6 -6" /></svg>';
  var LI='<svg class="tic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l11 0" /><path d="M9 12l11 0" /><path d="M9 18l11 0" /><path d="M5 6l0 .01" /><path d="M5 12l0 .01" /><path d="M5 18l0 .01" /></svg>';
  var DICTS={strong:"قاموس سترونج",bdb:"قاموس BDB العبري",abbott:"قاموس أبوت-سميث اليوناني"};
  var nAr=function(x){return String(x).replace(/\d/g,function(d){return "٠١٢٣٤٥٦٧٨٩"[d]})};
  var esc=function(x){return String(x==null?"":x).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};

  /* ---------- التخزين ---------- */
  function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
  function norm(s){
    if(!s||typeof s!=="object"||!Array.isArray(s.lists)) s={lists:[],last:MAIN};
    s.lists=s.lists.filter(function(l){return l&&typeof l==="object"&&l.id});
    var m=null;
    s.lists.forEach(function(l){if(!Array.isArray(l.items))l.items=[];if(l.id===MAIN&&!m)m=l});
    if(m) s.lists.splice(s.lists.indexOf(m),1); else m={id:MAIN,items:[]};
    m.name=MAIN_NAME; s.lists.unshift(m);
    if(!s.lists.some(function(l){return l.id===s.last})) s.last=MAIN;
    return s;
  }
  function state(){var s=null;try{s=JSON.parse(localStorage.getItem(LK)||"null")}catch(e){}return norm(s)}
  var subs=[];
  function fire(){subs.forEach(function(f){try{f()}catch(e){}});try{document.dispatchEvent(new Event("tsk:lists"))}catch(e){}}
  function save(s){try{localStorage.setItem(LK,JSON.stringify(norm(s)))}catch(e){toast("تعذّر الحفظ — مساحة المتصفح ممتلئة",{bad:true});return false}fire();return true}
  addEventListener("storage",function(e){if(e.key===LK||e.key===null)fire()});
  function keyOf(x){return x.k==="v"?"v|"+x.ref+"|"+x.tr:x.k==="d"?"d|"+x.dict+"|"+x.num:"n|"+x.id}
  function find(s,id){for(var i=0;i<s.lists.length;i++)if(s.lists[i].id===id)return s.lists[i];return null}
  function inList(l,key){return l.items.some(function(x){return keyOf(x)===key})}
  function where(key,s){s=s||state();return s.lists.filter(function(l){return inList(l,key)})}
  function count(l){return l.items.filter(function(x){return x.k!=="n"}).length}
  function total(s){s=s||state();return s.lists.reduce(function(a,l){return a+count(l)},0)}
  function clone(o){var c={};for(var k in o)c[k]=o[k];return c}
  /* يضيف نسخة من العنصر؛ يرجّع false لو العنصر (آية/مدخل) موجود بالفعل في القائمة */
  function add(s,id,item,at){var l=find(s,id);if(!l)return false;
    if(item.k!=="n"&&inList(l,keyOf(item)))return false;
    var o=clone(item);o.id=uid();o.at=o.at||Date.now();
    if(at==null||at>l.items.length)l.items.push(o);else l.items.splice(at,0,o);return o}
  function removeKey(s,id,key){var l=find(s,id);if(!l)return;l.items=l.items.filter(function(x){return keyOf(x)!==key})}
  function nameTaken(s,name,except){name=name.trim();return s.lists.some(function(l){return l.id!==except&&l.name.trim()===name})}
  /* قائمة جديدة: يرجّع الـ id أو رسالة خطأ {err} */
  function create(s,name){name=String(name||"").replace(/\s+/g," ").trim();
    if(!name)return {err:"اكتب اسم للقائمة"};
    if(name.length>60)return {err:"الاسم طويل — خليه أقل من ٦٠ حرف"};
    if(nameTaken(s,name))return {err:"فيه قائمة بنفس الاسم «"+esc(name)+"»"};
    var l={id:uid(),name:name,items:[]};s.lists.push(l);return {id:l.id}}

  /* ---------- الرسالة (Toast) ---------- */
  var T={h:null,undo:null};
  function hide(){var t=document.getElementById("lsToast");if(t)t.classList.remove("on");T.undo=null}
  function toast(msg,opt){opt=opt||{};var t=document.getElementById("lsToast");
    if(!t){t=document.createElement("div");t.id="lsToast";t.className="cpy-toast";t.setAttribute("role","status");t.setAttribute("aria-live","polite");document.body.appendChild(t);
      var hold=function(){clearTimeout(T.h)},go=function(){clearTimeout(T.h);T.h=setTimeout(hide,2500)};
      t.addEventListener("mouseenter",hold);t.addEventListener("mouseleave",go);t.addEventListener("focusin",hold);t.addEventListener("focusout",go);
      t.addEventListener("click",function(e){var b=e.target.closest("[data-ct]");if(!b)return;
        if(b.dataset.ct==="undo"&&T.undo){var u=T.undo;T.undo=null;try{localStorage.setItem(LK,u.prev)}catch(x){}fire();toast(u.msg||"تم التراجع")}
        else hide()})}
    T.undo=opt.undo||null;
    t.classList.toggle("bad",!!opt.bad);
    var onPage=document.body&&document.body.dataset.page==="lists";
    t.innerHTML='<span class="ct-msg">'+msg+'</span>'+(opt.undo?'<button type="button" class="ct-btn" data-ct="undo">تراجع</button>':"")+
      (opt.open&&!onPage?'<a class="ct-btn ct-main" data-ct="open" href="'+PAGE+'#'+esc(opt.open)+'" target="'+TGT+'">افتح القائمة</a>':"")+
      '<button type="button" class="ct-x" data-ct="x" aria-label="إغلاق">'+XI+'</button>';
    t.classList.add("on");clearTimeout(T.h);T.h=setTimeout(hide,opt.open||opt.undo?6000:3200)}

  /* ---------- الإضافة السريعة: لآخر قائمة اتستخدمت (ولو موجود فيها: يتشال منها) ----------
     o = {key, label (HTML), build: function(){ return item | {err} }} */
  function quick(o){var s=state(),l=find(s,s.last),prev=JSON.stringify(s),nm="«"+esc(l.name)+"»";
    if(inList(l,o.key)){removeKey(s,l.id,o.key);if(save(s))toast("اتشال من "+nm+": "+o.label,{undo:{prev:prev,msg:"رجع "+o.label+" لـ "+nm},open:l.id});return}
    var it=o.build();if(!it||it.err){toast(it&&it.err||"مش متاح دلوقتي",{bad:true});return}
    add(s,l.id,it);if(save(s))toast(OK+" اتضاف إلى "+nm+": "+o.label,{undo:{prev:prev,msg:"اتشال "+o.label},open:l.id})}

  /* ---------- قائمة الاختيار (السهم ▾) ---------- */
  var PK=null;
  function closePick(){if(!PK)return;PK.el.remove();try{PK.anchor.setAttribute("aria-expanded","false")}catch(e){}PK=null}
  function pickHTML(){var s=state(),o=PK.o;
    return '<div class="lsp-h">'+(o.title||"أضف إلى:")+'</div><div class="lsp-l" role="group">'+s.lists.map(function(l){var on=inList(l,o.key);
        return '<button type="button" class="lsp-i'+(on?" on":"")+(l.id===s.last?" last":"")+'" data-l="'+esc(l.id)+'" role="menuitemcheckbox" aria-checked="'+on+'" title="'+(on?"موجود — اضغط للإزالة":"اضغط للإضافة")+'"><span class="lsp-c">'+(on?OK:"")+'</span><span class="lsp-n">'+esc(l.name)+'</span>'+(l.id===s.last?'<span class="lsp-d" title="الزرار السريع بيضيف هنا">افتراضي</span>':"")+'<span class="lsp-k">'+nAr(count(l))+'</span></button>'}).join("")+'</div>'+
      '<form class="lsp-new" autocomplete="off"><input type="text" maxlength="60" placeholder="قائمة جديدة… (مثلًا: الإيمان)" aria-label="اسم القائمة الجديدة"><button type="submit">إنشاء وإضافة</button></form>'+
      (document.body.dataset.page==="lists"?"":'<a class="lsp-open" href="'+PAGE+'#'+esc(s.last)+'" target="'+TGT+'">'+LI+' افتح قوائمي</a>')}
  function place(){if(!PK)return;var r=PK.anchor.getBoundingClientRect(),el=PK.el,w=el.offsetWidth,h=el.offsetHeight,vw=innerWidth,vh=innerHeight;
    var top=r.bottom+6;if(top+h>vh-8&&r.top-h-6>8)top=r.top-h-6;top=Math.max(8,Math.min(top,vh-h-8));
    var left=r.right-w;left=Math.max(8,Math.min(left,vw-w-8));el.style.top=top+"px";el.style.left=left+"px"}
  function pick(anchor,o){
    if(PK&&PK.anchor===anchor){closePick();return}
    closePick();
    var el=document.createElement("div");el.className="lsp";el.setAttribute("role","dialog");el.setAttribute("aria-label","اختر القائمة");
    document.body.appendChild(el);PK={el:el,anchor:anchor,o:o};anchor.setAttribute("aria-expanded","true");
    el.innerHTML=pickHTML();place();
    var f=el.querySelector(".lsp-i.last")||el.querySelector(".lsp-i");if(f)f.focus({preventScroll:true});
    el.addEventListener("click",function(e){var b=e.target.closest(".lsp-i");if(!b)return;e.preventDefault();e.stopPropagation();toggleIn(b.dataset.l)});
    el.addEventListener("submit",function(e){e.preventDefault();var inp=el.querySelector(".lsp-new input"),s=state(),r=create(s,inp.value);
      if(r.err){toast(r.err,{bad:true});inp.focus();return}
      var it=o.build();if(!it||it.err){toast(it&&it.err||"مش متاح دلوقتي",{bad:true});return}
      var prev=JSON.stringify(state());add(s,r.id,it);s.last=r.id;
      if(save(s)){toast(OK+" اتعملت قائمة «"+esc(find(s,r.id).name)+"» واتضاف لها "+o.label,{undo:{prev:prev,msg:"تم التراجع"},open:r.id});closePick()}});
  }
  function toggleIn(id){if(!PK)return;var o=PK.o,s=state(),l=find(s,id);if(!l)return;var prev=JSON.stringify(s),nm="«"+esc(l.name)+"»";
    if(inList(l,o.key)){removeKey(s,id,o.key);s.last=id;if(save(s))toast("اتشال من "+nm+": "+o.label,{undo:{prev:prev},open:id})}
    else{var it=o.build();if(!it||it.err){toast(it&&it.err||"مش متاح دلوقتي",{bad:true});return}
      add(s,id,it);s.last=id;if(save(s))toast(OK+" اتضاف إلى "+nm+": "+o.label,{undo:{prev:prev},open:id})}
    if(PK){var fid=id;PK.el.innerHTML=pickHTML();place();var b=PK.el.querySelector('.lsp-i[data-l="'+fid+'"]');if(b)b.focus({preventScroll:true})}}
  document.addEventListener("mousedown",function(e){if(PK&&!PK.el.contains(e.target)&&!PK.anchor.contains(e.target))closePick()},true);
  document.addEventListener("touchstart",function(e){if(PK&&!PK.el.contains(e.target)&&!PK.anchor.contains(e.target))closePick()},{capture:true,passive:true});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&PK){var a=PK.anchor;closePick();try{a.focus()}catch(x){}}});
  /* على الموبايل: الكتابة في خانة «قائمة جديدة» بتفتح الكيبورد فتعمل resize وscroll — ساعتها نحرّك النافذة بدل ما نقفلها */
  function typing(){var a=document.activeElement;return !!(PK&&a&&a.tagName==="INPUT"&&PK.el.contains(a))}
  addEventListener("resize",function(){if(typing())place();else closePick()});
  addEventListener("scroll",function(e){if(!PK||(e.target&&e.target.nodeType===1&&PK.el.contains(e.target)))return;if(typing())place();else closePick()},true);

  /* حالة الزرار: on = موجود في القائمة الافتراضية (الضغطة هتشيله)، some = موجود في قوائم تانية بس */
  function btnState(key){var s=state(),w=where(key,s),l=find(s,s.last),on=w.indexOf(l)>=0;
    return {on:on,some:!on&&w.length>0,names:w.map(function(x){return x.name}),last:l.name}}
  function btnTitle(st,what){return st.on?"موجود في «"+st.last+"» — اضغط للإزالة منها"+(st.names.length>1?" (وكمان في: "+st.names.filter(function(n){return n!==st.last}).join("، ")+")":""):
    (st.some?"موجود في: "+st.names.join("، ")+" — اضغط لإضافته إلى «"+st.last+"»":"أضف "+what+" إلى «"+st.last+"»")}

  /* ---------- الشكل (مشترك لكل الصفحات) ---------- */
  function css(){if(document.getElementById("tsklists-css"))return;var st=document.createElement("style");st.id="tsklists-css";st.textContent=
    ".cpyg{display:inline-flex;align-items:center;gap:2px;vertical-align:middle;white-space:nowrap}"+
    ".cpyg>.cpy{margin-inline-end:0}"+
    ".lsvg{display:inline-flex;align-items:center;gap:3px;vertical-align:middle;white-space:nowrap}"+
    ".lsv{display:inline-flex;align-items:center;gap:5px;min-height:32px;padding:3px 12px;border-radius:999px;border:1px solid var(--gold);background:var(--paper);color:var(--gold);font:600 13px var(--ui);white-space:nowrap;cursor:pointer;direction:rtl}"+
    ".lsv .tic{width:15px;height:15px}.lsv:hover,.lsv:focus-visible{background:var(--gold-soft);outline:none}.lsv.on{background:var(--gold);color:var(--on-gold)}"+
    ".lsvg .lsv-dd{height:32px;width:26px;border-radius:999px;border-color:var(--gold);color:var(--gold)}"+
    ".lsvg.sm .lsv{min-height:28px;padding:2px 10px;font-size:12px}.lsvg.sm .lsv-dd{height:28px;width:24px}"+
    ".cpy-dd,.dcp-dd,.lsv-dd{display:inline-flex;align-items:center;justify-content:center;width:22px;height:28px;padding:0;border:1px solid var(--line);border-radius:8px;background:transparent;color:var(--muted);cursor:pointer;vertical-align:middle;flex-shrink:0}"+
    ".cpyg>.cpy:not(.pl):not(.big){margin-top:0}"+
    ".cpy-dd .tic,.dcp-dd .tic,.lsv-dd .tic{width:14px;height:14px}"+
    ".cpy-dd:hover,.cpy-dd:focus-visible,.dcp-dd:hover,.dcp-dd:focus-visible,.lsv-dd:hover,.lsv-dd:focus-visible,.cpy-dd[aria-expanded=true],.dcp-dd[aria-expanded=true],.lsv-dd[aria-expanded=true]{color:var(--gold);border-color:var(--gold);background:var(--gold-soft);outline:none}"+
    ".cvf .cpyg .cpy-dd,.dent .hd .dcp-dd{height:34px;width:28px;border-radius:999px;border-color:var(--gold);color:var(--gold)}"+
    ".cpyg .cpy.big+.cpy-dd{border-radius:999px;border-color:var(--gold);color:var(--gold);height:36px;width:32px}"+
    ".cpyg .cpy.big{min-height:36px;padding-inline:14px}"+
    ".dcpg{display:inline-flex;align-items:center;gap:3px;align-self:center}"+
    ".cpy.some,.dcp.some,.lsv.some{border-style:dashed;border-color:var(--gold);color:var(--gold)}"+
    ".lsp{position:fixed;z-index:10000;width:min(320px,calc(100vw - 16px));max-height:min(70vh,460px);overflow:auto;background:var(--paper);color:var(--ink);border:1px solid var(--line);border-radius:14px;box-shadow:0 14px 40px rgba(0,0,0,.22);padding:8px;font:500 14px var(--ui);direction:rtl;text-align:right}"+
    ".lsp-h{font:600 12.5px var(--ui);color:var(--muted);padding:4px 8px 8px}"+
    ".lsp-l{display:flex;flex-direction:column;gap:2px}"+
    ".lsp-i{display:flex;align-items:center;gap:8px;width:100%;min-height:42px;padding:6px 8px;border:0;border-radius:10px;background:transparent;color:inherit;font:inherit;text-align:right;cursor:pointer}"+
    ".lsp-i:hover,.lsp-i:focus-visible{background:var(--gold-soft);outline:none}"+
    ".lsp-c{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border:1.5px solid var(--line);border-radius:6px;flex-shrink:0;color:var(--on-gold)}"+
    ".lsp-i.on .lsp-c{background:var(--gold);border-color:var(--gold)}.lsp-c .tic{width:15px;height:15px}"+
    ".lsp-n{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}"+
    ".lsp-d{font:600 11px var(--ui);color:var(--accent);border:1px solid var(--accent);border-radius:999px;padding:1px 7px}"+
    ".lsp-k{font:600 12px var(--ui);color:var(--muted);min-width:18px;text-align:center}"+
    ".lsp-new{display:flex;gap:6px;margin:8px 0 2px;padding-top:8px;border-top:1px solid var(--line)}"+
    ".lsp-new input{flex:1;min-width:0;min-height:40px;padding:4px 10px;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink);font:inherit}"+
    ".lsp-new input:focus{outline:none;border-color:var(--gold)}"+
    ".lsp-new button{min-height:40px;padding:0 12px;border:1px solid var(--accent);border-radius:10px;background:var(--accent);color:var(--on-accent,#fff);font:600 13px var(--ui);cursor:pointer;white-space:nowrap}"+
    ".lsp-open{display:flex;align-items:center;gap:6px;margin-top:6px;padding:8px;border-radius:10px;color:var(--accent);text-decoration:none;font:600 13px var(--ui)}"+
    ".lsp-open:hover{background:var(--gold-soft)}.lsp-open .tic{width:16px;height:16px}"+
    "@media print{.cpy-dd,.dcp-dd,.lsp,.lsvg{display:none!important}}";
    (document.head||document.documentElement).appendChild(st)}
  css();

  window.TSKLists={MAIN:MAIN,MAIN_NAME:MAIN_NAME,PAGE:PAGE,TGT:TGT,DICTS:DICTS,ICONS:{copy:IC,ok:OK,x:XI,chev:CHEV,list:LI},
    state:state,save:save,keyOf:keyOf,find:find,inList:inList,where:where,count:count,total:total,add:add,removeKey:removeKey,
    create:create,nameTaken:nameTaken,uid:uid,toast:toast,quick:quick,pick:pick,closePick:closePick,btnState:btnState,btnTitle:btnTitle,
    verseBtn:function(o){return verseBtn(o)},
    on:function(f){subs.push(f)},esc:esc,nAr:nAr};

  /* ================= زرار مداخل القواميس ================= */
  function dictOf(dent){return dent.closest(".bdbox")?"bdb":dent.closest(".asbox")?"abbott":"strong"}
  function numOf(dent){var x=dent.querySelector(".hd .num");return x?x.textContent.trim():""}
  /* نص المدخل مع الحفاظ على الأسطر (كل معنى/فقرة في سطر) */
  function toText(el){
    if(!el) return "";
    var c=el.cloneNode(true);
    c.querySelectorAll(".na,button,script,style,.dcp,.dcpg").forEach(function(x){x.remove()});
    c.querySelectorAll("br").forEach(function(b){b.replaceWith("\n")});
    c.querySelectorAll("div,p,li,hr,h5,section").forEach(function(b){b.before("\n");b.after("\n")});
    return c.textContent.replace(/[ \t ]+/g," ").replace(/ *\n */g,"\n").replace(/\n{2,}/g,"\n").trim();
  }
  function read(dent){
    var d=dictOf(dent), q=function(s){return dent.querySelector(s)};
    var o={k:"d",dict:d,num:numOf(dent),orig:"",tr:"",occ:"",ar:"",en:"",ref:"",words:"",at:Date.now()};
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
  function dOpts(dent){var d=dictOf(dent),num=numOf(dent);
    return {key:"d|"+d+"|"+num,label:"<b>"+esc(num)+"</b> <span class=\"ct-tr\">("+DICTS[d]+")</span>",title:"أضف المدخل <b dir=\"ltr\">"+esc(num)+"</b> إلى:",
      build:function(){var o=read(dent);return (!o.ar&&!o.en)?{err:"المدخل لسه بيتحمّل… حاول تاني بعد لحظة"}:o}}}
  function paint(b){var dent=b.closest(".dent"),st=btnState("d|"+dictOf(dent)+"|"+numOf(dent));
    b.classList.toggle("on",st.on);b.classList.toggle("some",st.some);b.setAttribute("aria-pressed",st.on);
    b.title=btnTitle(st,"المدخل");b.innerHTML=(st.on?OK:IC)+"<span>"+(st.on?"مضاف":"أضف")+"</span>"}
  function inject(){
    document.querySelectorAll(".dent > .hd").forEach(function(hd){
      if(hd.querySelector(".dcp")) return;
      var dent=hd.parentElement, num=numOf(dent);
      if(!num||!hd.querySelector(".orig")) return;             /* مدخل غير متاح / جارٍ التحميل */
      var g=document.createElement("span");g.className="dcpg";
      var b=document.createElement("button"); b.type="button"; b.className="dcp";
      var a=document.createElement("button"); a.type="button"; a.className="dcp-dd"; a.innerHTML=CHEV;
      a.setAttribute("aria-haspopup","true");a.setAttribute("aria-expanded","false");a.setAttribute("aria-label","اختر القائمة أو أنشئ قائمة جديدة");a.title="اختر القائمة أو أنشئ قائمة جديدة";
      g.appendChild(b);g.appendChild(a);hd.appendChild(g);paint(b);
    });
  }
  function sync(){document.querySelectorAll(".dent > .hd .dcp").forEach(paint)}
  document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest(".dcp,.dcp-dd");if(!t)return;e.preventDefault();e.stopPropagation();
    var dent=t.closest(".dent");if(!dent)return;
    if(t.classList.contains("dcp-dd"))pick(t,dOpts(dent));else quick(dOpts(dent))},true);
  subs.push(sync);
  addEventListener("pageshow",sync);
  document.addEventListener("visibilitychange",function(){if(!document.hidden)sync()});

  /* ================= زرار «أضف» عام لأي آية (صفحة البحث، الخريطة الذهنية…) =================
     الصفحة تكتب TSKLists.verseBtn({ref, tr, t, sm}) → <span class="lsvg" data-ref data-tr data-t>؛ الضغط والتلوين من هنا.
     لو النص بيتحمّل بعدين، الصفحة تحدّث data-t على الـ span. */
  function verseBtn(o){return '<span class="lsvg'+(o.sm?" sm":"")+'" data-ref="'+esc(o.ref)+'" data-tr="'+esc(o.tr)+'" data-t="'+esc(o.t||"")+'">'+
    '<button type="button" class="lsv"></button><button type="button" class="lsv-dd" aria-haspopup="true" aria-expanded="false" aria-label="اختر القائمة أو أنشئ قائمة جديدة" title="اختر القائمة أو أنشئ قائمة جديدة">'+CHEV+'</button></span>'}
  function vOpts(g){var ref=g.dataset.ref,tr=g.dataset.tr;
    return {key:"v|"+ref+"|"+tr,label:"<b>"+esc(ref)+"</b> <span class=\"ct-tr\">("+esc(tr)+")</span>",title:"أضف <b>"+esc(ref)+"</b> إلى:",
      build:function(){var t=(g.dataset.t||"").trim();return t?{k:"v",t:t,ref:ref,tr:tr,at:Date.now()}:{err:"نص الآية لسه بيتحمّل… حاول تاني بعد لحظة"}}}}
  function vPaint(b){var g=b.closest(".lsvg");if(!g)return;var st=btnState("v|"+g.dataset.ref+"|"+g.dataset.tr);
    b.classList.toggle("on",st.on);b.classList.toggle("some",st.some);b.setAttribute("aria-pressed",st.on);
    b.title=btnTitle(st,"نص الآية");b.innerHTML=(st.on?OK:IC)+"<span>"+(st.on?"مضافة":"أضف")+"</span>"}
  function vSync(all){document.querySelectorAll(all?".lsvg .lsv":".lsvg .lsv:empty").forEach(vPaint)}
  document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest(".lsv,.lsv-dd");if(!t)return;e.preventDefault();e.stopPropagation();
    var g=t.closest(".lsvg");if(!g)return;if(t.classList.contains("lsv-dd"))pick(t,vOpts(g));else quick(vOpts(g))},true);
  subs.push(function(){vSync(true)});

  /* ================= زرار «قوائمي» في الشريط العلوي (صفحات سترونج والبحث) ================= */
  var SBL=-1;
  function sbBtn(){var bar=document.querySelector(".sitebar");if(!bar||document.body.dataset.page==="lists")return;
    if(document.querySelector(".stickbar .cpy-tops,.cpy-tops:not(.sb)"))return;   /* صفحات الأسفار: app.js بيعرضه */
    var w=bar.querySelector(".cpy-tops.sb");
    if(!w){w=document.createElement("span");w.className="cpy-tops sb";
      w.innerHTML='<a class="cpy-top vs" href="'+PAGE+'" target="'+TGT+'">'+LI+'<span class="ct-l">قوائمي</span><b class="cpy-count"></b></a>';
      var ref=bar.querySelector(".sb-link")||bar.querySelector(".sb-theme");if(ref)bar.insertBefore(w,ref);else bar.appendChild(w)}
    var m=total(),a=w.firstChild,lbl=m?"قوائمي — "+nAr(m)+(m===1?" عنصر":m===2?" عنصرين":" عناصر"):"قوائمي";
    w.dataset.n=m?1:0;a.hidden=!m;a.title=lbl;a.setAttribute("aria-label",lbl);w.querySelector(".cpy-count").textContent=m?nAr(m):"";
    if(SBL>=0&&m>SBL){a.classList.remove("bump");void a.offsetWidth;a.classList.add("bump")}SBL=m}
  subs.push(sbBtn);
  function start(){sbBtn();inject();vSync();var q=false;new MutationObserver(function(){if(q)return;q=true;requestAnimationFrame(function(){q=false;inject();vSync()})}).observe(document.body,{childList:true,subtree:true});fire()}
  if(document.body) start(); else document.addEventListener("DOMContentLoaded",start);
  window.TSKDictCopy={count:function(){return total()}};
})();
