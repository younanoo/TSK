/* العرض بملء الشاشة (مثل شرائح PowerPoint) من صفحة الأصحاح.
   آية واحدة في كل شريحة بخط كبير يتظبط على قد الشاشة، والآية الطويلة جدًا تتقسم على شريحتين أو ثلاث.
   التنقل: ← / ↓ / مسافة / Enter / PageDown = التالي، → / ↑ / Backspace / PageUp = السابق، Home = أول الأصحاح، Esc = خروج.
   أزرار ١ / ٣ / ٥: عدد الآيات في كل شريحة (من نفس الأصحاح)، وحجم الخط يتظبط على قدها.
   زر «٣ ترجمات»: الآية بفاندايك وكتاب الحياة وKJV مع بعض في نفس الشريحة (آية واحدة، بدون أرقام سترونج).
   زر «بين السطور»: الآية بخانات العرض بين السطور (نفس مصدر الصفحة: مكتبتنا أو Berean)، والضغط على خانة يفتح قاموس سترونج.
   يتفتح تلقائيًا لو العرض بدأ من صفحة في وضع بين السطور. لسفر الصفحة فقط.
   الانتقال المباشر: اكتب رقم العدد، أو أصحاح:عدد (3:16)، أو سفر وأصحاح وعدد (يو 3:16) ثم Enter — أو زر «انتقال» على الموبايل. Esc يلغي.
   السفر التاني بيتعرض من غير ما الصفحة تتحمّل (PRESFIT.foreign)، ولما تخرج من العرض بتروح لصفحته.
   ريموت العروض (Presenter) بيبعت PageDown/PageUp فيشتغل لوحده. اللمس: سحب لليمين أو ضغطة على يسار الشاشة = التالي.
   النص بالترجمة المختارة في الصفحة (نفس دوال app.js: trText / trCur)، ويكمل من أصحاح للي بعده حتى نهاية السفر.
   زر «سترونج»: يُظهر أرقام سترونج على الكلمات (نفس بيانات وضع الأرقام في الأصحاح: cstrSeg في app.js)، والضغط على كلمة
   يعرض مدخل قاموس سترونج وحده بملء الشاشة مع زر «رجوع للآية» (المداخل من assets/strong/e/ عبر chstrong.js).
   يُحمَّل هذا الملف عند أول ضغطة على «عرض» فقط (من app.js). */
(function(){
  "use strict";
  if(window.PRES) return;
  const MQ=matchMedia("(max-width:880px)");
  let src=null,cur=null,jb="",jT=0,dictOn=null,wasFs=false,pendSync=null,box,stage,txt,ref,bar,hint,list=[],idx=0,part=0,parts=[],open_=false,wake=null,idleT=0,histPushed=false,waitT=0;
  const T=()=>store.get("pres_theme","dark");
  const STR=()=>store.get("pres_str",false)===true;
  const TRI=()=>store.get("pres_tri",false)===true;
  const IL=()=>store.get("pres_il",false)===true;
  const K=()=>TRI()||IL()?1:PRESFIT.N(store.get("pres_n",1));

  function build(){
    box=document.createElement("div");box.id="pres";box.className="pres";box.setAttribute("role","dialog");box.setAttribute("aria-label","عرض الآيات بملء الشاشة");box.tabIndex=-1;
    box.innerHTML=`<div class="pres-bar">
        <span class="pres-trs"></span>
        <span class="pres-ns" role="group" aria-label="عدد الآيات في الشريحة"><button type="button" class="pres-b" data-pn="1" title="آية واحدة في الشريحة">١</button><button type="button" class="pres-b" data-pn="3" title="٣ آيات في الشريحة">٣</button><button type="button" class="pres-b" data-pn="5" title="٥ آيات في الشريحة">٥</button></span>
        <button type="button" class="pres-b" data-pa="dia" title="إظهار التشكيل أو إخفاؤه (فاندايك وكتاب الحياة)">تشكيل</button>
        <button type="button" class="pres-b" data-pa="tri" title="الآية بالترجمات الثلاث مع بعض">٣ ترجمات</button>
        <button type="button" class="pres-b" data-pa="il" title="الآية بالعرض بين السطور (كلمة بكلمة)">بين السطور</button>
        <button type="button" class="pres-b" data-pa="jump" title="انتقال إلى عدد (أو اكتب الرقم ثم Enter)">انتقال</button>
        <button type="button" class="pres-b" data-pa="str" title="إظهار أرقام سترونج؛ اضغط على الكلمة لعرض معناها">سترونج</button>
        <button type="button" class="pres-b" data-pa="theme" title="خلفية سوداء / بيضاء" aria-label="خلفية سوداء / بيضاء"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18z"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg></button>
        <button type="button" class="pres-b" data-pa="fs" title="ملء الشاشة" aria-label="ملء الشاشة"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8v-2a2 2 0 0 1 2 -2h2"/><path d="M4 16v2a2 2 0 0 0 2 2h2"/><path d="M16 4h2a2 2 0 0 1 2 2v2"/><path d="M16 20h2a2 2 0 0 0 2 -2v-2"/></svg></button>
        <button type="button" class="pres-b pres-x" data-pa="close" title="خروج (Esc)" aria-label="خروج">✕</button></div>
      <div class="pres-stage"><div class="pres-txt" aria-live="polite"></div></div>
      <div class="pres-ref"></div>
      <span class="pres-logo" aria-hidden="true"><img class="pl-d" src="assets/brand/logo-horizontal-dark.svg" alt=""><img class="pl-l" src="assets/brand/logo-horizontal-light.svg" alt=""></span>
      <div class="pres-dict" hidden></div>
      <form class="pres-jump" hidden><label>انتقال إلى: <input type="text" inputmode="numeric" autocomplete="off" placeholder="١٢ أو ٣:١٦ أو يو ٣:١٦" aria-label="رقم العدد أو أصحاح:عدد"></label><button type="submit" class="pres-b">اذهب</button><span class="pres-jmsg"></span></form>
      <button type="button" class="pres-nav pres-prev" data-pa="prev" aria-label="الآية السابقة">‹</button>
      <button type="button" class="pres-nav pres-next" data-pa="next" aria-label="الآية التالية">›</button>
      <div class="pres-hint">← التالي · → السابق · Esc للخروج</div>`;
    document.body.append(box);
    stage=box.querySelector(".pres-stage");txt=box.querySelector(".pres-txt");ref=box.querySelector(".pres-ref");bar=box.querySelector(".pres-bar");hint=box.querySelector(".pres-hint");
    box.addEventListener("click",onClick);
    let x0=null,y0=null;
    box.addEventListener("touchstart",e=>{if(e.touches.length!==1)return;x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
    box.addEventListener("touchend",e=>{if(x0==null)return;const t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;x0=null;
      if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3){e.preventDefault();box.dataset.sw="1";setTimeout(()=>delete box.dataset.sw,350);dx>0?next():prev()}});
    box.addEventListener("mousemove",wakeUi);
    box.querySelector(".pres-jump").addEventListener("submit",e=>{e.preventDefault();jumpGo(e.target.querySelector("input").value)});
  }

  function onClick(e){
    if(box.dataset.sw) return;
    if(dictOn){if(e.target.closest("[data-pa='back']")||!e.target.closest(".pres-dict-in,.pres-bar"))closeDict();else if(e.target.closest(".pres-retry"))openDict(dictOn.nums,dictOn.word);
      if(!e.target.closest(".pres-bar"))return}
    {const c=e.target.closest(".pres-il .ilc");if(c){e.preventDefault();const a=c.querySelector(".iln"),num=a&&a.textContent.trim();
      if(/^[GH]\d+$/.test(num||"")){const w=c.querySelector(".ila")||c.querySelector(".ilk");openDict([num],(w&&w.textContent.trim())||num)}return}}
    {const w=e.target.closest(".pres-txt .sw");if(w&&STR()&&!TRI()){const sn=e.target.closest(".sn");openDict(sn?[sn.dataset.sn]:w.dataset.n.split(" "),wordOf(w));return}}
    {const pn=e.target.closest("[data-pn]");if(pn){store.set("pres_n",+pn.dataset.pn);store.set("pres_tri",false);store.set("pres_il",false);part=0;show();wakeUi();return}}
    const a=e.target.closest("[data-pa]"),tr=e.target.closest("[data-ptr]");
    if(tr){store.set("tr",tr.dataset.ptr);store.set("corig",false);store.set("pres_tri",false);try{render()}catch(_){}show();wakeUi();return}
    if(a){const k=a.dataset.pa;
      if(k==="next")next();else if(k==="prev")prev();else if(k==="close")close();
      else if(k==="theme"){store.set("pres_theme",T()==="dark"?"light":"dark");box.dataset.theme=T()}
      else if(k==="fs"){enterFs()}
      else if(k==="jump"){jumpOpen(true)}
      else if(k==="tri"){store.set("pres_tri",!TRI());store.set("pres_il",false);part=0;if(dictOn)closeDict();else show()}
      else if(k==="dia"){store.set("dia",store.get("dia",false)!==true);try{render()}catch(_){}part=0;show()}   /* نفس إعداد الصفحة */
      else if(k==="il"){store.set("pres_il",!IL());store.set("pres_tri",false);part=0;if(dictOn)closeDict();else show()}
      else if(k==="str"){store.set("pres_str",!STR());if(dictOn)closeDict();else show()}
      wakeUi();return}
    if(e.target.closest(".pres-bar,.pres-jump"))return;
    /* ضغطة على الشاشة: الثلث الأيسر = التالي، الأيمن = السابق، الوسط = إظهار الأزرار */
    const w=innerWidth,x=e.clientX;
    if(x<w/3) next(); else if(x>w*2/3) prev(); else box.classList.toggle("ui");
    wakeUi();
  }

  function onKey(e){
    if(!open_) return;
    if(e.altKey||e.ctrlKey||e.metaKey) return;
    const k=e.key;
    if(e.target&&e.target.closest&&e.target.closest(".pres-jump")){if(k==="Escape"){e.preventDefault();jumpClose()}return}  /* الكتابة في خانة الانتقال */
    if(!dictOn){const j=PRESFIT.jkey(k,jb);
      if(j){e.preventDefault();jb+=j;jumpShow();return}
      if(jb){if(k==="Enter"){e.preventDefault();jumpGo(jb);return}
        if(k==="Backspace"){e.preventDefault();jb=jb.slice(0,-1);jumpShow();return}
        if(k==="Escape"){e.preventDefault();jumpClose();return}}}
    if(dictOn){if(["Escape","Backspace","ArrowRight","ArrowLeft","ArrowUp","ArrowDown","PageUp","PageDown"," ","Enter"].includes(k)){e.preventDefault();closeDict()}return}
    if(["ArrowLeft","ArrowDown","PageDown"," ","Enter","Spacebar"].includes(k)){e.preventDefault();next()}
    else if(["ArrowRight","ArrowUp","PageUp","Backspace"].includes(k)){e.preventDefault();prev()}
    else if(k==="Home"){e.preventDefault();const c=list[idx].c;idx=list.findIndex(d=>d.c===c);part=0;show()}
    else if(k==="Escape"){e.preventDefault();close()}
    else if(k==="b"||k==="B"){box.classList.toggle("blank")}   /* شاشة سوداء مؤقتًا، زي PowerPoint */
  }

  /* ---- النص: قائمة مقاطع [نص، أرقام] (بدون أرقام = نص عادي مقسوم كلمات) ---- */
  function segsOf(d){
    if(STR()){const sg=cstrSeg(d);if(sg)return sg;}
    const t=trText(d)||(trCur()==="alab"&&!diaOn()?d.text:null);if(!t)return null;
    if(STR()&&trCur()!=="alab")return null;          /* الأرقام لسه بتتحمّل */
    return t.split(/(\s+)/).filter(Boolean).map(x=>[x,[]]);
  }
  const plain=a=>a.map(x=>x[0]).join("");
  const htmlOf=a=>PRESFIT.html(a,STR());
  /* التخطيط (حجم الخط وتقسيم الآية الطويلة) من assets/presfit.js المشترك مع الشاشة الخارجية */
  const fitSize=h=>PRESFIT.fit(stage,txt,h);
  const layout=a=>PRESFIT.layout(stage,txt,a,htmlOf,PRESFIT.minOk(MQ.matches));

  function showTri(){   /* الترجمات الثلاث */
    const d=list[idx],items=PRESFIT.tri(src.abbr,d,!src.foreign&&store.get("dia",false)===true?diaTextOf:null);
    box.querySelectorAll("[data-pn]").forEach(x=>x.classList.remove("on"));box.querySelector('[data-pa="tri"]').classList.add("on");
    box.dataset.theme=T();box.classList.remove("str");box.classList.add("tri");renderTrs();
    if(!items){txt.style.fontSize="";txt.textContent="جارٍ تحميل الترجمات…";txt.classList.add("wait");waitT=setTimeout(show,400);return}
    txt.classList.remove("wait");txt.removeAttribute("dir");txt.lang="ar";parts=[[]];part=0;
    const h=PRESFIT.triHtml(items);txt.style.fontSize=fitSize(h)+"px";
    ref.innerHTML=`<b>${esc(AR[src.abbr])} ${n(d.c)}: ${n(d.v)}</b> <span class="pres-trn">الترجمات الثلاث</span>`;
    box.classList.toggle("first",idx===0);box.classList.toggle("last",idx===list.length-1);
  }
  function showIL(){   /* بين السطور */
    const d=list[idx],sl=ilSlide(d);
    box.querySelectorAll("[data-pn]").forEach(x=>x.classList.remove("on"));box.querySelector('[data-pa="tri"]').classList.remove("on");box.querySelector('[data-pa="il"]').classList.add("on");
    box.dataset.theme=T();box.classList.remove("str","tri");box.classList.add("il");renderTrs();
    if(!sl){txt.style.fontSize="";txt.textContent="جارٍ تحميل العرض بين السطور…";txt.classList.add("wait");waitT=setTimeout(show,400);return}
    txt.classList.remove("wait");txt.removeAttribute("dir");txt.lang="ar";
    parts=PRESFIT.ilLayout(stage,txt,sl,MQ.matches?16:Math.max(26,innerHeight/30)).p;if(part<0)part=parts.length-1;if(part>=parts.length)part=parts.length-1;
    const h=PRESFIT.ilHtml(sl,parts[part]);txt.style.fontSize=fitSize(h)+"px";
    ref.innerHTML=`<b>${esc(AR[src.abbr])} ${n(d.c)}: ${n(d.v)}</b>${parts.length>1?` <span>(${n(part+1)}/${n(parts.length)})</span>`:""} <span class="pres-trn">بين السطور</span>`;
    box.classList.toggle("first",idx===0&&part===0);box.classList.toggle("last",idx===list.length-1&&part===parts.length-1);
  }
  function show(){
    clearTimeout(waitT);
    if(TRI()){box.classList.remove("il");box.querySelector('[data-pa="il"]').classList.remove("on");showTri();return}
    if(IL()&&!src.foreign){showIL();return}
    box.classList.remove("tri","il");box.querySelector('[data-pa="tri"]').classList.remove("on");box.querySelector('[data-pa="il"]').classList.toggle("on",IL());
    const d=list[idx],b={abbr:src.abbr},kj=trCur()==="kjv";
    const g=PRESFIT.group(list,idx,K()),ss=g.map(i=>src.segs(list[i],STR(),trCur())),e=list[g[g.length-1]];
    const a=ss.every(Boolean)?PRESFIT.join(ss.map((x,j)=>[x,n(list[g[j]].v)])):null;
    box.querySelectorAll("[data-pn]").forEach(x=>x.classList.toggle("on",+x.dataset.pn===K()));
    box.dataset.theme=T();box.classList.toggle("str",STR());
    renderTrs();
    if(!a){txt.style.fontSize="";txt.textContent="جارٍ تحميل النص…";txt.classList.add("wait");waitT=setTimeout(show,400);ref.textContent=AR[b.abbr]+" "+n(d.c)+": "+n(d.v);return}
    txt.classList.remove("wait");
    txt.setAttribute("dir",kj?"ltr":"rtl");txt.lang=kj?"en":"ar";
    const L=layout(a);parts=L.p;if(part<0)part=parts.length-1;if(part>=parts.length)part=parts.length-1;
    const h=htmlOf(parts[part]);txt.style.fontSize=fitSize(h)+"px";
    ref.innerHTML=`<b>${esc(AR[b.abbr])} ${n(d.c)}: ${n(d.v)}${e!==d?"–"+n(e.v):""}</b>${parts.length>1?` <span>(${n(part+1)}/${n(parts.length)})</span>`:""} <span class="pres-trn">${esc(TRN[trCur()])}</span>`;
    box.classList.toggle("first",idx===0&&part===0);box.classList.toggle("last",g[g.length-1]===list.length-1&&part===parts.length-1);
  }

  /* ---- قاموس سترونج بملء الشاشة ---- */
  function wordOf(w){const c=w.cloneNode(true);c.querySelectorAll("sup").forEach(x=>x.remove());return c.textContent.trim()}
  function openDict(nums,word){
    nums=nums.filter(x=>/^[GH]\d+$/.test(x));if(!nums.length)return;
    dictOn={nums,word};const el=box.querySelector(".pres-dict"),d=list[idx],b={abbr:src.abbr};
    box.classList.add("dict");el.hidden=false;
    const head=`<div class="pres-dict-hd"><b>${esc(word)}</b><span>${esc(AR[b.abbr])} ${n(d.c)}: ${n(d.v)}</span></div>`;
    const foot=`<button type="button" class="pres-back" data-pa="back">→ رجوع للآية</button>`;
    el.innerHTML=`<div class="pres-dict-in">${head}<div class="pres-dict-body"><p class="pres-dict-wait">جارٍ تحميل القاموس…</p></div>${foot}</div>`;
    loadJS("assets/chstrong.js",()=>{if(!window.CHS||!CHS.need){el.querySelector(".pres-dict-body").innerHTML=`<p class="pres-dict-wait">تعذّر تحميل القاموس.</p>`;return}
      CHS.need(nums,(DIC,bad)=>{if(!dictOn||dictOn.nums!==nums)return;const body=el.querySelector(".pres-dict-body");
        if(bad&&nums.every(x=>!DIC[x])){body.innerHTML=`<p class="pres-dict-wait">تعذّر تحميل القاموس — غالبًا الجهاز غير متصل بالإنترنت. <button type="button" class="pres-b pres-retry">إعادة المحاولة</button></p>`;return}
        body.innerHTML=nums.map(x=>{const e=DIC[x],he=x[0]==="H";if(!e)return `<div class="pres-de"><span class="pres-dnum">${x}</span><p>هذا المدخل غير متاح.</p></div>`;
          return `<div class="pres-de"><div class="pres-dtop"><span class="pres-dnum">${x}</span><span class="pres-dorig ${he?"he":"gr"}" lang="${he?"he":"grc"}" dir="${he?"rtl":"ltr"}">${esc(e.o)}</span></div>
            <div class="pres-dtr" dir="ltr"><b>${esc(e.tr)}</b>${e.pr?" · "+esc(e.pr):""}</div>
            ${e.ar?`<p class="pres-dar">${esc(e.ar)}</p>`:""}${e.d?`<p class="pres-den" dir="ltr">${e.d}</p>`:""}</div>`}).join("")})});
    wakeUi();
  }
  function closeDict(){dictOn=null;const el=box.querySelector(".pres-dict");el.hidden=true;el.innerHTML="";box.classList.remove("dict");show()}

  /* ---- الانتقال المباشر لعدد ---- */
  function jumpShow(){const f=box.querySelector(".pres-jump"),i=f.querySelector("input");f.hidden=false;f.classList.add("typed");i.value=PRESFIT.ar(jb);f.querySelector(".pres-jmsg").textContent="Enter للانتقال · Esc للإلغاء";
    clearTimeout(jT);jT=setTimeout(jumpClose,5000)}
  function jumpOpen(){const f=box.querySelector(".pres-jump"),i=f.querySelector("input");jb="";f.hidden=false;f.classList.remove("typed");i.value="";f.querySelector(".pres-jmsg").textContent="";clearTimeout(jT);setTimeout(()=>i.focus(),30)}
  function jumpClose(){jb="";clearTimeout(jT);const f=box.querySelector(".pres-jump");f.hidden=true;f.classList.remove("typed");const i=f.querySelector("input");if(document.activeElement===i)box.focus({preventScroll:true})}
  function jumpGo(str){
    const f=box.querySelector(".pres-jump");f.querySelector(".pres-jmsg").textContent="جارٍ الانتقال…";
    PRESFIT.resolve(str,src,idx,cur,(s2,j)=>{
      if(j<0){f.hidden=false;f.querySelector(".pres-jmsg").textContent=`«${PRESFIT.ar(String(str).trim())}» غير موجود — اكتب رقم العدد، أو أصحاح:عدد، أو سفر وأصحاح وعدد مثل «يو ٣:١٦»`;jb="";clearTimeout(jT);jT=setTimeout(jumpClose,3500);flash();return}
      jumpClose();src=s2;list=s2.list;idx=j;part=0;show()})}
  function renderTrs(){const sb=box.querySelector('[data-pa="str"]');sb.classList.toggle("on",STR());
    {const db=box.querySelector('[data-pa="dia"]');db.hidden=src.foreign||!(TRI()||diaAvail());db.classList.toggle("on",store.get("dia",false)===true)}const av=trAvail(),c=trCur();box.querySelector(".pres-trs").innerHTML=av.length>1?av.map(k=>`<button type="button" class="pres-b ${k===c&&!TRI()?"on":""}" data-ptr="${k}" title="${TRN[k]}">${MQ.matches&&k==="alab"?"الحياة":TRN[k]}</button>`).join(""):""}
  function next(){if(part<parts.length-1){part++;show();return}const g=PRESFIT.group(list,idx,K()),j=g[g.length-1]+1;if(j<list.length){idx=j;part=0;show()}else flash()}
  function prev(){if(part>0){part--;show();return}const s=PRESFIT.prevStart(list,idx,K());if(s>=0){idx=s;part=-1;show()}else flash()}
  function flash(){box.classList.remove("edge");void box.offsetWidth;box.classList.add("edge")}

  /* ---- ملء الشاشة / إبقاء الشاشة مضيئة / إخفاء الماوس ---- */
  const isFs=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
  function enterFs(){const r=box.requestFullscreen||box.webkitRequestFullscreen;if(r){try{const p=r.call(box);p&&p.catch&&p.catch(()=>{})}catch(_){}}}
  function exitFs(){const x=document.exitFullscreen||document.webkitExitFullscreen;if(x&&isFs()){try{const p=x.call(document);p&&p.catch&&p.catch(()=>{})}catch(_){}}}
  /* الخروج من ملء الشاشة (Esc أو زر المتصفح) = الخروج من العرض */
  function onFsChange(){const f=isFs();box&&box.classList.toggle("fs",f);if(open_&&wasFs&&!f){wasFs=false;close();return}wasFs=f;if(open_)setTimeout(show,60)}
  async function keepAwake(){try{if("wakeLock" in navigator)wake=await navigator.wakeLock.request("screen")}catch(_){wake=null}}
  function wakeUi(){box.classList.add("ui");clearTimeout(idleT);idleT=setTimeout(()=>box.classList.remove("ui"),2600)}

  function open(bid,c,v){
    if(!box) build();
    if(store.get("inter",false)){store.set("pres_il",true);store.set("pres_tri",false)}   /* الصفحة في وضع بين السطور */
    const b=book();cur={abbr:b.abbr,list:b.verses,segs:d=>segsOf(d)};src=cur;list=b.verses;idx=Math.max(0,list.findIndex(d=>d.c===c&&d.v===v));part=0;
    open_=true;box.classList.add("on");document.documentElement.classList.add("pres-on");
    if(!document.fullscreenEnabled&&!document.webkitFullscreenEnabled) box.querySelector('[data-pa="fs"]').hidden=true;
    enterFs();keepAwake();
    try{history.pushState({pres:1},"",location.href);histPushed=true}catch(_){}
    hint.classList.add("on");setTimeout(()=>hint.classList.remove("on"),3500);
    box.focus({preventScroll:true});wakeUi();
    requestAnimationFrame(show);
  }
  function close(fromPop){
    if(!open_) return;
    if(dictOn){dictOn=null;const el=box.querySelector(".pres-dict");el.hidden=true;box.classList.remove("dict")}
    open_=false;clearTimeout(waitT);exitFs();box.classList.remove("on","blank","ui");document.documentElement.classList.remove("pres-on");
    try{wake&&wake.release()}catch(_){}wake=null;
    const d=list[idx];
    if(src&&src.foreign&&d){location.href=pageOf(src.abbr,"/"+src.abbr+"/ch/"+d.c);return}   /* كنت بتعرض سفر تاني: افتح صفحته */
    if(histPushed&&!fromPop){histPushed=false;pendSync=d;try{history.back()}catch(_){pendSync=null;sync(d)}}else{histPushed=false;sync(d)}
  }
  /* ارجع للصفحة عند آخر آية اتعرضت (بعد ما يرجع التاريخ خطوة) */
  function sync(d){if(!d)return;setTimeout(()=>{if(S.view==="chapter"&&S.c!==d.c)goChapter(d.b,d.c);
      setTimeout(()=>{const el=document.querySelector(`.cv[data-go="${d.b}.${d.c}:${d.v}"]`);if(el){el.scrollIntoView({block:"center"});el.classList.add("pres-last");setTimeout(()=>el.classList.remove("pres-last"),1600)}},80)},30)}

  addEventListener("keydown",onKey,true);
  document.addEventListener("fullscreenchange",onFsChange);document.addEventListener("webkitfullscreenchange",onFsChange);
  addEventListener("popstate",()=>{if(pendSync){const d=pendSync;pendSync=null;sync(d);return}if(open_){histPushed=false;close(true)}});
  addEventListener("resize",()=>{if(open_&&!dictOn)show()});
  document.addEventListener("visibilitychange",()=>{if(open_&&document.visibilityState==="visible"&&!wake)keepAwake()});
  window.PRES={open,close};
})();
