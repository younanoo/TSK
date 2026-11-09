/* نافذة سترونج الصغيرة في عرض الأصحاح (وضع «أرقام سترونج»).
   الضغط على كلمة يعرض مدخل قاموس سترونج فقط (الكلمة الأصلية والنطق والمعنى بالعربية والإنجليزية)،
   ورابط «عرض المزيد» يفتح صفحة العدد والقاموس مفتوح على الرقم نفسه (#/<السفر>/<أصحاح>:<عدد>/<الرقم>)
   حيث الشواهد وقاموس سترونج والقواميس الأخرى (BDB / أبوت-سميث).
   الشاشات الكبيرة: نافذة صغيرة بجوار الكلمة. الجوال (≤880px): لوحة من أسفل الشاشة.
   البيانات: assets/strong/e/<G|H><الرقم÷100>.js (المداخل فقط، يبنيها build_seo_pwa.js من strong.js)؛
   وإن كان strong.js الكامل محمّلًا بالفعل يُستخدم هو. يُحمَّل هذا الملف عند أول ضغطة فقط (من app.js). */
(function(){
  "use strict";
  if(window.CHS) return;
  const BASE="assets/strong/e/", D={}, got={};
  window.STRE=function(k,o){Object.assign(D,o);got[k]=true};
  const key=n=>n[0]+Math.floor(+n.slice(1)/100);
  const MQ=matchMedia("(max-width:880px)");
  const escH=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const isHe=n=>n[0]==="H";

  function need(nums,cb){
    if(window.STRONG&&Object.keys(window.STRONG).length){cb(window.STRONG,false);return}
    const ks=[...new Set(nums.map(key))].filter(k=>!got[k]);
    if(!ks.length){cb(D,false);return}
    let left=ks.length,bad=false;
    ks.forEach(k=>loadJS(BASE+k+".js",()=>{if(!got[k]){bad=true;retryJS(BASE+k+".js")}if(--left===0)cb(D,bad)}));
  }

  let pop=null,scrim=null,curW=null,lastFocus=null;
  function build(){
    scrim=document.createElement("div");scrim.className="chs-scrim";
    pop=document.createElement("div");pop.className="chs";pop.id="chsPop";
    pop.setAttribute("role","dialog");pop.tabIndex=-1;pop.setAttribute("aria-label","قاموس سترونج");
    document.body.append(scrim,pop);
    scrim.addEventListener("click",close);
    pop.addEventListener("click",e=>{if(e.target.closest(".chs-x"))close();else if(e.target.closest(".chs-retry")&&curW)open(curW)});
    /* السحب لأسفل يغلق اللوحة على الجوال */
    let y0=null;
    pop.addEventListener("touchstart",e=>{y0=(pop.scrollTop<=0&&e.target.closest(".chs-hd,.chs-grab"))?e.touches[0].clientY:null},{passive:true});
    pop.addEventListener("touchmove",e=>{if(y0==null)return;const dy=e.touches[0].clientY-y0;if(dy>0)pop.style.transform=`translateY(${dy}px)`},{passive:true});
    pop.addEventListener("touchend",e=>{if(y0==null)return;const dy=(e.changedTouches[0]||{}).clientY-y0;pop.style.transform="";y0=null;if(dy>70)close()});
  }

  function entryHTML(num,e){
    if(!e) return `<div class="chs-e"><div class="chs-top"><span class="chs-num">${num}</span></div><p class="chs-na">هذا المدخل غير متاح.</p></div>`;
    return `<div class="chs-e">
      <div class="chs-top"><span class="chs-num">${num}</span><span class="chs-orig ${isHe(num)?"he":"gr"}" lang="${isHe(num)?"he":"grc"}" dir="${isHe(num)?"rtl":"ltr"}">${escH(e.o)}</span><span class="chs-tr" dir="ltr"><b>${escH(e.tr)}</b>${e.pr?" · "+escH(e.pr):""}</span></div>
      ${e.ar?`<p class="chs-ar">${escH(e.ar)}</p>`:`<p class="chs-na">الترجمة العربية لهذا المدخل غير متاحة بعد.</p>`}
      ${e.d?`<details class="chs-en"><summary>Strong's Dictionary (English)</summary><p dir="ltr">${e.d}</p></details>`:""}
    </div>`;
  }

  function place(w){
    const sheet=MQ.matches;
    pop.classList.toggle("sheet",sheet);scrim.classList.toggle("on",sheet);
    if(sheet){pop.style.top=pop.style.left="";return}
    const r=w.getBoundingClientRect(),pw=pop.offsetWidth,ph=pop.offsetHeight,vw=document.documentElement.clientWidth;
    let left=r.right-pw; if(left<8) left=r.left; left=Math.max(8,Math.min(left,vw-pw-8)); /* تحت الكلمة: محاذاة يمين النافذة ليمين الكلمة، أو يسارها ليسارها */
    let top=r.bottom+8; if(top+ph>innerHeight-8&&r.top-ph-8>8) top=r.top-ph-8;
    pop.style.left=(left+scrollX)+"px";pop.style.top=(top+scrollY)+"px";
  }

  function open(w){
    if(!pop) build();
    const nums=(w.dataset.n||"").split(" ").filter(x=>/^[GH]\d+$/.test(x)); if(!nums.length) return;
    if(curW&&curW!==w) curW.classList.remove("on");
    curW=w; w.classList.add("on");
    if(!pop.classList.contains("on")) lastFocus=document.activeElement;
    const cv=w.closest("[data-go],[data-gk]"),m=cv&&(cv.dataset.go||cv.dataset.gk).match(/^(\d+)\.(\d+):(\d+)$/),b=book(),ab=b.abbr;
    const c=m?+m[2]:S.c,v=m?+m[3]:1;
    const word=w.cloneNode(true);word.querySelectorAll("sup").forEach(x=>x.remove());
    const head=`<div class="chs-grab"></div><div class="chs-hd"><b class="chs-w">${escH(word.textContent.trim())}</b><span class="chs-ref">${AR[ab]} ${n(c)}: ${n(v)}</span><button type="button" class="chs-x" aria-label="إغلاق">✕</button></div>`;
    const more=`<div class="chs-ft"><a class="chs-more" href="#/${ab}/${c}:${v}/${nums[0]}">عرض المزيد ←</a><span class="chs-hint">العدد كاملًا مع الشواهد والقواميس الأخرى</span></div>`;
    pop.innerHTML=head+`<div class="chs-body"><div class="chs-load">جارٍ التحميل…</div></div>`+more;
    pop.classList.add("on");place(w);
    need(nums,(DIC,bad)=>{
      if(curW!==w) return;
      const body=pop.querySelector(".chs-body");
      if(bad&&nums.every(x=>!DIC[x])) body.innerHTML=`<div class="chs-na">تعذّر تحميل القاموس — غالبًا الجهاز غير متصل بالإنترنت. <button type="button" class="trb chs-retry">إعادة المحاولة</button></div>`;
      else{body.innerHTML=nums.map(x=>entryHTML(x,DIC[x])).join("");
        /* للشاشة الخارجية (screenctl.js): نفس المدخل يظهر هناك بملء الشاشة */
        document.dispatchEvent(new CustomEvent("chs:show",{detail:{word:word.textContent.trim(),ab,c,v,entries:nums.map(x=>[x,DIC[x]||null])}}))}
      place(w);
      pop.focus({preventScroll:true});
    });
  }

  function close(){
    if(!pop||!pop.classList.contains("on")) return;
    document.dispatchEvent(new CustomEvent("chs:close"));
    pop.classList.remove("on","sheet");scrim.classList.remove("on");pop.style.transform="";
    if(curW){curW.classList.remove("on");if(document.contains(curW)&&lastFocus&&document.contains(lastFocus))lastFocus.focus({preventScroll:true})}
    curW=null;
  }

  document.addEventListener("click",e=>{if(!pop||!pop.classList.contains("on"))return;if(e.target.closest("#chsPop,.cvs .sw"))return;close()},true);
  document.addEventListener("click",e=>{if(e.target.closest(".chs-more"))close()});
  addEventListener("keydown",e=>{if(e.key==="Escape")close()});
  addEventListener("hashchange",close);
  addEventListener("resize",()=>{if(pop&&pop.classList.contains("on")&&curW&&document.contains(curW))place(curW);else close()});
  window.CHS={open,close,need}; /* need: يستخدمه العرض بملء الشاشة (present.js) لتحميل نفس مداخل القاموس */
})();
