/* =========================================================
   HOME UX TEST — يُحمَّل بعد سكريبت الصفحة في index_test.html فقط
   ========================================================= */
(function(){
  "use strict";
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const el=(t,a={},h="")=>{const e=document.createElement(t);for(const k in a)e.setAttribute(k,a[k]);e.innerHTML=h;return e};
  const N=x=>Number(x).toLocaleString("ar-EG");

  /* شريط "صفحة تجريبية" */
  document.body.prepend(el("div",{class:"uxt-banner",role:"note"},`صفحة تجريبية للرئيسية <a href="index.html">قارن بالصفحة الأصلية ←</a>`));

  /* ---------- ١) قائمة الموبايل ---------- */
  const top=$(".h-top .h-wrap"), theme=$("#hTheme");
  const menuBtn=el("button",{class:"uxh-menu",type:"button","aria-label":"القائمة","aria-haspopup":"dialog","aria-expanded":"false"},
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`);
  top.append(menuBtn);
  const scrim=el("div",{class:"uxh-scrim"});
  /* ترتيب لينكات الأقسام زي الترتيب الجديد للصفحة */
  const nav=$(".h-nav"); ["#books","#votd","#firsts","#features","#how","#faq"].forEach(h=>{const a=nav&&nav.querySelector(`a[href="${h}"]`);if(a)nav.append(a)});
  const sections=$$(".h-nav a").map(a=>`<a href="${a.getAttribute("href")}">${a.textContent}</a>`).join("");
  const TOOLS=[["search.html","البحث في النص"],["strong.html","قاموس سترونج"],["arword.html","بحث بكلمة عربية"],["grammar.html","البحث النحوي"],
    ["topics.html","فهرس المواضيع"],["mindmap.html","الخريطة الذهنية"],["outline.html","مخطط الأسفار"],["sources.html","المصادر"]];
  const sheet=el("div",{class:"uxh-sheet",role:"dialog","aria-modal":"true","aria-label":"القائمة"},
    `<div class="grab"></div><div class="shd"><h3>القائمة</h3><button class="uxh-x" type="button" aria-label="إغلاق">✕</button></div>
     <h4>أقسام الصفحة</h4><div class="uxh-links">${sections}</div>
     <h4>أدوات الدراسة</h4><div class="uxh-links">${TOOLS.map(([h,t])=>`<a href="${h}">${t}</a>`).join("")}</div>`);
  document.body.append(scrim,sheet);
  const open=()=>{sheet.classList.add("on");scrim.classList.add("on");menuBtn.setAttribute("aria-expanded","true");setTimeout(()=>$(".uxh-x",sheet).focus(),50)};
  const close=()=>{sheet.classList.remove("on");scrim.classList.remove("on");menuBtn.setAttribute("aria-expanded","false")};
  menuBtn.addEventListener("click",open);
  scrim.addEventListener("click",close);
  sheet.addEventListener("click",e=>{if(e.target.closest(".uxh-x")||e.target.closest("a"))close()});
  addEventListener("keydown",e=>{if(e.key==="Escape")close()});

  /* ---------- ٢) «تابع من حيث توقفت» في الواجهة (لو فيه تقدّم محفوظ) ---------- */
  const res=$("#hResume"), heroCol=$(".h-hero .h-wrap > div");
  if(res&&res.classList.contains("on")&&heroCol){
    const hint=$(".h-hint",heroCol); (hint||$(".h-go",heroCol)).after(res); res.classList.add("uxh-in");
  }

  /* ---------- ٣) الأسفار بعد الأرقام مباشرة + الأسماء ظاهرة ---------- */
  const books=$("#books"), stats=$("#hStats");
  if(books&&stats){ stats.parentElement.after(books); books.classList.add("uxh-moved","uxh-books");
    $$(".h-bk details",books).forEach(d=>d.open=true);
    const lead=$(".h-lead",books); if(lead) lead.textContent="الأسفار مقسّمة حسب نوعها. اضغط على أي سفر لتبدأ.";
    /* لينك الأسفار في القائمة يروح للمكان الجديد تلقائيًا (نفس الـ id) */
  }

  /* ---------- ٤) الإمكانيات: إزالة الكارت المكرر مع «لأول مرة» ---------- */
  const firstTitles=new Set($$(".h-firsts h3").map(h=>h.textContent.trim()));
  $$(".h-feats > .h-feat").forEach(f=>{const t=$("h3",f);if(t&&firstTitles.has(t.textContent.trim()))f.remove()});

  /* ---------- ٥) طيّ الأقسام الطويلة على الموبايل ---------- */
  function fold(box,keep,label){
    if(!box||box.classList.contains("uxh-fold")) return;
    const kids=[...box.children]; if(kids.length<=keep) return;
    box.classList.add("uxh-fold"); kids.slice(keep).forEach(k=>k.classList.add("uxh-extra"));
    const btn=el("button",{class:"uxh-more",type:"button","aria-expanded":"false"},`${label} (${N(kids.length)})`);
    btn.addEventListener("click",()=>{const o=box.classList.toggle("uxh-open");btn.setAttribute("aria-expanded",o);
      btn.textContent=o?"عرض أقل":`${label} (${N(kids.length)})`; if(!o) box.scrollIntoView({block:"start"})});
    box.after(btn);
  }
  fold($(".h-firsts"),3,"عرض كل الأدوات الجديدة");
  fold($(".h-feats"),4,"عرض كل الإمكانيات");
  /* شواهد آية اليوم بتتحمّل بعد شوية */
  const vr=$("#vRefs");
  if(vr){const mo=new MutationObserver(()=>{if(vr.querySelector(".h-grp")){mo.disconnect();
      const more=vr.querySelector(".h-more"); if(more) vr.after(more);  /* «شاهدها كلها» يفضل ظاهر */
      fold(vr,2,"عرض شواهد أكثر");}});
    mo.observe(vr,{childList:true}); if(vr.querySelector(".h-grp")) mo.takeRecords(), fold(vr,2,"عرض شواهد أكثر");}
})();
