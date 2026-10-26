/* =========================================================
   UX TEST LAYER — يُحمَّل بعد app.js في صفحات *_test.html فقط.
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

  /* ---------- شريط "صفحة تجريبية" ---------- */
  const orig = location.pathname.split("/").pop().replace("_test","");
  const banner = el("div",{class:"uxt-banner",role:"note"},
    `صفحة تجريبية لتحسينات تجربة الاستخدام <a id="uxtOrig" href="${orig}${location.hash}">قارن بالصفحة الأصلية ←</a>`);
  document.body.prepend(banner);
  addEventListener("hashchange",()=>{const a=$("#uxtOrig");if(a)a.href=orig+location.hash});

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
      const tr=$("#main>.trbar"), seg=$("#main>.trgrp.seg"), cl=$("#main>.chlink:not(.uxt-keep)");
      sec("الترجمة وحجم الخط",[tr].filter(Boolean));
      sec("طريقة العرض",[seg,cl].filter(Boolean));
      movedForSheet=[tr,seg,cl].filter(Boolean);
      const dark = (document.documentElement.dataset.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"))==="dark";
      const th=el("div",{class:"uxt-sec"},`<h4>المظهر</h4><div class="uxt-row"><span>الوضع الداكن</span><button class="uxt-sw" id="uxtDark">${dark?"إيقاف":"تشغيل"}</button></div>`);
      body.append(th);
      $("#uxtDark",th).addEventListener("click",ev=>{$("#themeBtn").click();const d=document.documentElement.dataset.theme==="dark";ev.target.textContent=d?"إيقاف":"تشغيل"});
    });
  }
  /* لما الـ sheet يتقفل، الأدوات اللي اتنقلت ترجع مكانها (لو الصفحة لسه نفس الـ render) */
  const _close = closeSheet;
  closeSheet = function(){
    if(sheetKind==="aa"){ const anchor=$("#main .cvlist, #main .verse-card, #main .ilist"); movedForSheet.forEach(x=>{if(anchor&&!main.contains(x)) anchor.before(x)}); movedForSheet=[] }
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
    const filled=!d.querySelector(":scope > .empty");
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
      if($("#main>.trbar, #main>.trgrp.seg")){
        const on=$("#main>.trbar .trb.on");
        const aa=el("button",{class:"uxt-aa",type:"button","aria-haspopup":"dialog","aria-label":"إعدادات العرض"},`Aa${on?` <small>${on.textContent.trim()}</small>`:""}`);
        aa.addEventListener("click",openAa); sb.insertBefore(aa,sp.nextSibling);
      }
      const th=el("button",{class:"uxt-theme",type:"button",title:"الوضع الفاتح / الداكن","aria-label":"الوضع الفاتح / الداكن"},SVG_THEME);
      th.addEventListener("click",()=>$("#themeBtn").click()); sb.append(th);
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
      if(sm&&cnt&&!$(".uxt-olhint",sm)) sm.append(el("span",{class:"uxt-olhint"},`${n(cnt)} أقسام · اضغط للعرض`));
    });
    /* في صفحة العدد زرار "عرض الأصحاح كاملًا" يفضل ظاهر */
    if(S.view==="verse"){const cl=$("#main>.chlink");cl&&cl.classList.add("uxt-keep")}

    /* #1 صورة الأصحاح بعد النص على الموبايل */
    const hero=$("#main>figure.chhero");
    if(hero&&isMobile()){const foot=$("#main>.chfoot")||null;const list=$("#main>.cvlist");
      (foot?foot.before(hero):list&&list.after(hero)); hero.classList.add("uxt-moved");}

    /* #4 صفوف الشواهد */
    $$("#main .r").forEach(r=>{if(r.querySelector(".self"))r.classList.add("uxt-tap")});

    syncDict(); syncOffline();
  }

  /* observer: app.js بيعمل innerHTML لـ #main في كل render */
  let busy=false;
  new MutationObserver(()=>{
    if(busy) return; busy=true;
    requestAnimationFrame(()=>{
      if(!$(".uxt-mark",main)){ if(sheetKind==="aa"){ /* translation change → أعد بناء الـ sheet */ const k=sheetKind; sheetKind=null; process(); if(k)openAa(); } else process(); }
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
