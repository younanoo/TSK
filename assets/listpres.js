/* جدد وعتقاء — العرض بملء الشاشة لقائمة من «قوائمي» (lists.html).
   نفس شكل عرض الأصحاح (present.js / كلاسات .pres في style.css) ونفس محرك التخطيط (presfit.js):
   عنصر في كل شريحة بأكبر خط يدخل في الشاشة — آية، أو مدخل قاموس، أو شرح. الآية الطويلة جدًا تتقسم على ٢–٣ شرائح،
   ومدخل القاموس أو الشرح الطويل يتقسم على شرائح بالأسطر. حقول القاموس المعروضة = الحقول المختارة في الصفحة.
   التنقل: ← / ↓ / مسافة / Enter / PageDown = التالي، → / ↑ / Backspace / PageUp = السابق، Home / End = الأول / الآخر،
   B = شاشة سوداء، Esc = خروج. اللمس: سحب، أو ضغطة على يسار الشاشة = التالي ويمينها = السابق. ريموت العروض بيشتغل لوحده.
   window.LISTPRES.open(items, startIndex, {title, fields, onClose(index)}) */
(function(){
  "use strict";
  if(window.LISTPRES) return;
  const F=window.PRESFIT, DICTS={strong:"قاموس سترونج",bdb:"قاموس BDB العبري",abbott:"قاموس أبوت-سميث اليوناني"};
  const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const ar=s=>String(s).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
  const MQ=matchMedia("(max-width:880px)");
  const isGr=t=>/[Ͱ-Ͽἀ-῿]/.test(t), isHe=t=>/[֐-׿]/.test(t);
  const isLtr=t=>isGr(t)||/^[\s("'\d]*[A-Za-z]/.test(t);
  /* ---------- تنسيق الشرح (Bold / نقاط / ترقيم) — HTML مسموح: b, ul, ol, li, div, br فقط ---------- */
  function cleanNode(node){let out="";node.childNodes.forEach(n=>{
    if(n.nodeType===3){out+=esc(n.nodeValue);return}
    if(n.nodeType!==1)return;const tg=n.tagName;
    if(/^(SCRIPT|STYLE|TEMPLATE|META|LINK)$/.test(tg))return;
    if(tg==="BR"){out+="<br>";return}
    if(tg==="B"||tg==="STRONG"||(n.style&&/bold|[6-9]00/.test(n.style.fontWeight||""))){const c=cleanNode(n);out+=c.replace(/<br>/g,"")?`<b>${c}</b>`:c;return}
    if(tg==="UL"||tg==="OL"){const t=tg.toLowerCase(),li=[...n.children].filter(c=>c.tagName==="LI").map(c=>`<li>${cleanNode(c)||"<br>"}</li>`).join("");if(li)out+=`<${t}>${li}</${t}>`;return}
    if(/^(DIV|P|LI|H[1-6]|BLOCKQUOTE|PRE|SECTION|ARTICLE)$/.test(tg)){out+=`<div>${cleanNode(n)||"<br>"}</div>`;return}
    out+=cleanNode(n)});return out}
  /* المحرر بيحط القوايم جوه div أحيانًا (div > ul …): نخلّي كل الكتل في مستوى واحد (أول سطر + div لكل سطر + ul/ol) */
  function flatten(html){const t=document.createElement("template");t.innerHTML=html;const out=[];let run="";
    const flush=()=>{if(run!==""){out.push({k:"r",h:run});run=""}};
    const walk=(parent)=>{parent.childNodes.forEach(n=>{const tg=n.nodeType===1?n.tagName:"";
      if(tg==="UL"||tg==="OL"){flush();out.push({k:"b",h:n.outerHTML});return}
      if(tg==="DIV"){flush();if(n.querySelector("div,ul,ol")){walk(n);flush()}else out.push({k:"b",h:n.outerHTML});return}
      run+=n.nodeType===3?esc(n.nodeValue):n.outerHTML})};
    walk(t.content);flush();
    return out.map((o,i)=>o.k==="r"?(i===0?o.h:`<div>${o.h}</div>`):o.h).join("")}
  function clean(html){const t=document.createElement("template");t.innerHTML=String(html||"");return flatten(cleanNode(t.content)).replace(/(<div><br><\/div>)+$/,"").replace(/^(<div><br><\/div>)+/,"")}
  /* HTML الشرح: المحفوظ (بعد التنضيف) أو النص القديم */
  function noteHTML(x){return x.html?clean(x.html):esc(x.text||"").replace(/\n/g,"<br>")}
  /* HTML → نص عادي (للـ txt والنسخ العادي): النقاط «• » والترقيم «١. » */
  function noteText(html){const t=document.createElement("template");t.innerHTML=clean(html);
    const walk=(node)=>{let o="";node.childNodes.forEach(n=>{
      if(n.nodeType===3){o+=n.nodeValue;return}if(n.nodeType!==1)return;const tg=n.tagName;
      if(tg==="BR")o+="\n";
      else if(tg==="DIV")o+="\n"+walk(n)+"\n";
      else if(tg==="UL"||tg==="OL"){o+="\n";[...n.children].forEach((li,i)=>{o+=(tg==="UL"?"• ":ar(i+1)+". ")+walk(li).trim()+"\n"})}
      else o+=walk(n)});return o};
    return walk(t.content).replace(/[ \t]+\n/g,"\n").replace(/\n{3,}/g,"\n\n").replace(/^\n+|\n+$/g,"")}
  const getS=(k,d)=>{try{const v=localStorage.getItem("tsklib:"+k);return v==null?d:JSON.parse(v)}catch(e){return d}};
  const setS=(k,v)=>{try{localStorage.setItem("tsklib:"+k,JSON.stringify(v))}catch(e){}};
  const T=()=>getS("pres_theme","dark");
  let box,stage,txt,ref,hint,items=[],idx=0,part=0,pages=null,opt={},open_=false,wasFs=false,wake=null,idleT=0,histPushed=false,cache={};

  function css(){if(!document.head)return;if(document.getElementById("listpres-css"))return;const s=document.createElement("style");s.id="listpres-css";s.textContent=
    ".pres-txt.lp-note{white-space:pre-line}"+
    ".pres-txt.lp-noteh b{font-weight:800}"+
    ".pres-txt.lp-noteh ul,.pres-txt.lp-noteh ol{display:table;margin:0 auto;text-align:start;padding-inline-start:1.3em}"+
    ".pres-txt.lp-noteh ul{list-style:disc}.pres-txt.lp-noteh ol{list-style:arabic-indic}.pres-txt.lp-noteh ol[dir=ltr],.pres-txt[dir=ltr].lp-noteh ol{list-style:decimal}"+
    ".pres-txt.lp-list{line-height:1.6}"+
    ".pres-txt.lp-noteh ul+div,.pres-txt.lp-noteh ol+div,.pres-txt.lp-noteh div+ul,.pres-txt.lp-noteh div+ol{margin-top:.15em}"+
    ".pres-txt.lp-d{text-align:start;width:100%;line-height:1.55}"+
    ".lpd-hd{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:center;gap:.25em .6em;margin-bottom:.35em;text-align:center}"+
    ".lpd-num{font:700 .55em var(--ui);color:#C9A24A;direction:ltr;unicode-bidi:isolate}"+
    ".lpd-og{font-family:'Noto Serif','Noto Serif Hebrew','SBL Greek',serif;font-size:1.25em;line-height:1.2}"+
    ".lpd-og.he{font-family:'Noto Serif Hebrew','SBL Hebrew',serif}"+
    ".lpd-tr{font:italic .6em 'Noto Serif',Georgia,serif;opacity:.75;direction:ltr;unicode-bidi:isolate}"+
    ".lpd-occ{font:500 .5em var(--ui);opacity:.7}"+
    ".lpd-ref{font:500 .55em var(--ui);opacity:.8;text-align:center;margin-bottom:.4em}"+
    ".lpd-h{font:700 .5em var(--ui);color:#C9A24A;margin:.5em 0 .1em}"+
    ".lpd-l{margin:0}"+
    ".lpd-en{direction:ltr;text-align:left;font-family:Georgia,'Noto Serif',serif}"+
    ".lpd-cont{font:500 .45em var(--ui);opacity:.6;text-align:center;margin-bottom:.3em}"+
    ".pres[data-theme=light] .lpd-num,.pres[data-theme=light] .lpd-h{color:#7A5A1C}"+
    ".lp-kind{display:inline-block;font:600 .85em var(--ui);padding:0 .6em;border:1px solid currentColor;border-radius:999px;margin-inline-end:.5em;opacity:.8}";
    document.head.appendChild(s)}

  function build(){
    css();
    box=document.createElement("div");box.id="pres";box.className="pres";box.setAttribute("role","dialog");box.setAttribute("aria-label","عرض القائمة بملء الشاشة");box.tabIndex=-1;
    box.innerHTML=`<div class="pres-bar">
        <span class="pres-trs"><span class="pres-b lp-title" style="cursor:default"></span></span>
        <button type="button" class="pres-b" data-pa="theme" title="خلفية سوداء / بيضاء" aria-label="خلفية سوداء / بيضاء"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18z"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg></button>
        <button type="button" class="pres-b" data-pa="fs" title="ملء الشاشة" aria-label="ملء الشاشة"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8v-2a2 2 0 0 1 2 -2h2"/><path d="M4 16v2a2 2 0 0 0 2 2h2"/><path d="M16 4h2a2 2 0 0 1 2 2v2"/><path d="M16 20h2a2 2 0 0 0 2 -2v-2"/></svg></button>
        <button type="button" class="pres-b pres-x" data-pa="close" title="خروج (Esc)" aria-label="خروج">✕</button></div>
      <div class="pres-stage"><div class="pres-txt" aria-live="polite"></div></div>
      <div class="pres-ref"></div>
      <span class="pres-logo" aria-hidden="true"><img class="pl-d" src="assets/brand/logo-horizontal-dark.svg" alt=""><img class="pl-l" src="assets/brand/logo-horizontal-light.svg" alt=""></span>
      <button type="button" class="pres-nav pres-prev" data-pa="prev" aria-label="السابق">‹</button>
      <button type="button" class="pres-nav pres-next" data-pa="next" aria-label="التالي">›</button>
      <div class="pres-hint">← التالي · → السابق · Esc للخروج</div>`;
    document.body.append(box);
    stage=box.querySelector(".pres-stage");txt=box.querySelector(".pres-txt");ref=box.querySelector(".pres-ref");hint=box.querySelector(".pres-hint");
    box.addEventListener("click",onClick);
    let x0=null,y0=null;
    box.addEventListener("touchstart",e=>{if(e.touches.length!==1)return;x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
    box.addEventListener("touchend",e=>{if(x0==null)return;const t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;x0=null;
      if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3){e.preventDefault();box.dataset.sw="1";setTimeout(()=>delete box.dataset.sw,350);dx>0?next():prev()}});
    box.addEventListener("mousemove",wakeUi);
  }
  function onClick(e){
    if(box.dataset.sw) return;
    const a=e.target.closest("[data-pa]");
    if(a){const k=a.dataset.pa;
      if(k==="next")next();else if(k==="prev")prev();else if(k==="close")close();
      else if(k==="theme"){setS("pres_theme",T()==="dark"?"light":"dark");box.dataset.theme=T()}
      else if(k==="fs")enterFs();
      wakeUi();return}
    if(e.target.closest(".pres-bar"))return;
    const w=innerWidth,x=e.clientX;
    if(x<w/3) next(); else if(x>w*2/3) prev(); else box.classList.toggle("ui");
    wakeUi();
  }
  function onKey(e){
    if(!open_||e.altKey||e.ctrlKey||e.metaKey) return;
    const k=e.key;
    if(["ArrowLeft","ArrowDown","PageDown"," ","Enter","Spacebar"].includes(k)){e.preventDefault();e.stopPropagation();next()}
    else if(["ArrowRight","ArrowUp","PageUp","Backspace"].includes(k)){e.preventDefault();e.stopPropagation();prev()}
    else if(k==="Home"){e.preventDefault();idx=0;part=0;show()}
    else if(k==="End"){e.preventDefault();idx=items.length-1;part=0;show()}
    else if(k==="Escape"){e.preventDefault();e.stopPropagation();close()}
    else if(k==="b"||k==="B"){box.classList.toggle("blank")}
  }

  /* ---------- الشرائح ---------- */
  const words=t=>String(t).split(/(\s+)/).filter(Boolean).map(x=>[x,[]]);
  const minOk=()=>F.minOk(MQ.matches);
  /* فتّت قائمة «وحدات» HTML على صفحات: أكبر عدد وحدات يدخل في الصفحة بخط ≥ الحد الأدنى */
  function paginate(st,tx,mn,units,wrap){const out=[];let curU=[];
    units.forEach(u=>{const tryU=curU.concat([u]);
      if(curU.length&&F.fit(st,tx,wrap(tryU,out.length>0))<mn){out.push(curU);curU=[u]}else curU=tryU});
    if(curU.length)out.push(curU);
    return out.map((u,i)=>wrap(u,i>0))}
  function dictHead(x,f){const he=isHe(x.orig||"");
    return `<div class="lpd-hd"><span class="lpd-num">${esc(x.num)}</span><span class="lpd-og${he?" he":""}" lang="${he?"he":"grc"}" dir="${he?"rtl":"ltr"}">${esc(x.orig)}</span>`+
      (f.tr&&x.tr?`<span class="lpd-tr">${esc(x.tr)}</span>`:"")+(f.occ&&x.occ?`<span class="lpd-occ">${esc(x.occ)}</span>`:"")+`</div>`}
  /* صفحات (شرائح) عنصر واحد على مساحة st/tx — مشتركة مع الشاشة الخارجية (screen.html) */
  function pagesFor(st,tx,x,f,small){
    css();f=f||{};const mn=F.minOk(!!small);let p;
    tx.className="pres-txt";tx.removeAttribute("dir");
    if(x.k==="v"){const l=isLtr(x.t||"");tx.setAttribute("dir",l?"ltr":"rtl");
      const L=F.layout(st,tx,words(x.t||""),a=>F.html(a,false),mn);
      p=L.p.map(a=>({html:F.html(a,false),dir:l?"ltr":"rtl",cls:""}))}
    else if(x.k==="n"&&x.html){const l=isLtr(x.text||"");tx.classList.add("lp-noteh");tx.setAttribute("dir",l?"ltr":"rtl");
      const t=document.createElement("template");t.innerHTML=clean(x.html);const units=[];let run="";
      const flush=()=>{if(run.replace(/<br>/g,"").trim())units.push(`<div>${run}</div>`);run=""};
      t.content.childNodes.forEach(n=>{const tg=n.nodeType===1?n.tagName:"";
        if(tg==="BR"){flush();return}
        if(tg==="DIV"){flush();if(n.innerHTML.replace(/<br>/g,"").trim())units.push(n.outerHTML);return}
        if(tg==="UL"||tg==="OL"){flush();[...n.children].forEach((li,i)=>units.push(tg==="UL"?`<ul><li>${li.innerHTML}</li></ul>`:`<ol start="${i+1}"><li>${li.innerHTML}</li></ol>`));return}
        run+=n.nodeType===3?esc(n.nodeValue):n.outerHTML});flush();
      const wrap=u=>u.join("").replace(/<\/ul><ul>/g,"").replace(/<\/ol><ol start="\d+">/g,"");
      const cls="lp-noteh"+(/<[uo]l/.test(t.innerHTML)?" lp-list":"");
      p=(units.length?paginate(st,tx,mn,units,wrap):[""]).map(h=>({html:h,dir:l?"ltr":"rtl",cls}))}
    else if(x.k==="n"){const l=isLtr(x.text||"");tx.classList.add("lp-note");tx.setAttribute("dir",l?"ltr":"rtl");
      p=paginate(st,tx,mn,String(x.text||"").split("\n").map(esc),u=>u.join("\n")).map(h=>({html:h,dir:l?"ltr":"rtl",cls:"lp-note"}))}
    else{tx.classList.add("lp-d");tx.setAttribute("dir","rtl");
      const head=dictHead(x,f),units=[];
      if(f.ref&&x.ref)units.push(`<div class="lpd-ref">الموضع: ${esc(x.ref)}${x.words?" — «"+esc(x.words)+"»":""}</div>`);
      if(f.ar&&x.ar){x.ar.split("\n").filter(s=>s.trim()).forEach((s,i)=>units.push((i?"":`<div class="lpd-h">المعنى بالعربية</div>`)+`<p class="lpd-l">${esc(s)}</p>`))}
      if(f.en&&x.en){x.en.split("\n").filter(s=>s.trim()).forEach((s,i)=>units.push(`<div class="lpd-en">${i?"":`<div class="lpd-h">English</div>`}<p class="lpd-l">${esc(s)}</p></div>`))}
      p=units.length?paginate(st,tx,mn,units,(u,more)=>head+(more?`<div class="lpd-cont">(تابع)</div>`:"")+u.join("")).map(h=>({html:h,dir:"rtl",cls:"lp-d"})):[{html:head,dir:"rtl",cls:"lp-d"}]}
    return p}
  function pagesOf(x){
    const key=x.id+"|"+innerWidth+"x"+innerHeight+"|"+JSON.stringify(opt.fields||{});
    return cache[key]||(cache[key]=pagesFor(stage,txt,x,opt.fields,MQ.matches))}
  /* عرض صفحة على st/tx/rf */
  function paint(st,tx,pg){tx.className="pres-txt"+(pg.cls?" "+pg.cls:"");tx.setAttribute("dir",pg.dir);tx.lang=pg.dir==="ltr"?"en":"ar";tx.style.fontSize=F.fit(st,tx,pg.html)+"px"}
  function refOf(x){
    if(x.k==="v")return `<b>${esc(x.ref)}</b> <span class="pres-trn">${esc(x.tr)}</span>`;
    if(x.k==="n")return `<span class="lp-kind">شرح</span>`;
    return `<b dir="ltr">${esc(x.num)}</b> <span class="pres-trn">${esc(DICTS[x.dict]||"")}</span>`}
  function show(){
    if(!items.length){close();return}
    idx=Math.max(0,Math.min(idx,items.length-1));
    const x=items[idx];box.dataset.theme=T();
    pages=pagesOf(x);if(part<0)part=pages.length-1;if(part>=pages.length)part=pages.length-1;
    const pg=pages[part];
    paint(stage,txt,pg);
    ref.innerHTML=refOf(x)+(pages.length>1?` <span>(${ar(part+1)}/${ar(pages.length)})</span>`:"")+` <span class="pres-trn" dir="rtl" style="unicode-bidi:isolate;margin-inline-start:.8em">${ar(idx+1)} من ${ar(items.length)}</span>`;
    box.classList.toggle("first",idx===0&&part===0);box.classList.toggle("last",idx===items.length-1&&part===pages.length-1);
  }
  function next(){if(pages&&part<pages.length-1){part++;show();return}if(idx<items.length-1){idx++;part=0;show()}else flash()}
  function prev(){if(part>0){part--;show();return}if(idx>0){idx--;part=-1;show()}else flash()}
  function flash(){box.classList.remove("edge");void box.offsetWidth;box.classList.add("edge")}

  /* ---------- ملء الشاشة / إبقاء الشاشة مضيئة ---------- */
  const isFs=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
  function enterFs(){const r=box.requestFullscreen||box.webkitRequestFullscreen;if(r){try{const p=r.call(box);p&&p.catch&&p.catch(()=>{})}catch(_){}}}
  function exitFs(){const x=document.exitFullscreen||document.webkitExitFullscreen;if(x&&isFs()){try{const p=x.call(document);p&&p.catch&&p.catch(()=>{})}catch(_){}}}
  function onFsChange(){const f=isFs();box&&box.classList.toggle("fs",f);if(open_&&wasFs&&!f){wasFs=false;close();return}wasFs=f;if(open_){cache={};setTimeout(show,60)}}
  async function keepAwake(){try{if("wakeLock" in navigator)wake=await navigator.wakeLock.request("screen")}catch(_){wake=null}}
  function wakeUi(){box.classList.add("ui");clearTimeout(idleT);idleT=setTimeout(()=>box.classList.remove("ui"),2600)}

  function open(list,start,o){
    if(!F){alert("تعذّر تحميل العرض — حدّث الصفحة");return}
    if(!list||!list.length)return;
    if(!box) build();
    items=list.slice();idx=Math.max(0,Math.min(start||0,items.length-1));part=0;opt=o||{};cache={};
    box.querySelector(".lp-title").textContent=opt.title||"";
    open_=true;box.classList.add("on");document.documentElement.classList.add("pres-on");
    if(!document.fullscreenEnabled&&!document.webkitFullscreenEnabled) box.querySelector('[data-pa="fs"]').hidden=true;
    enterFs();keepAwake();
    try{history.pushState({lpres:1},"",location.href);histPushed=true}catch(_){}
    hint.classList.add("on");setTimeout(()=>hint.classList.remove("on"),3500);
    box.focus({preventScroll:true});wakeUi();
    requestAnimationFrame(show);
  }
  function close(fromPop){
    if(!open_) return;
    open_=false;exitFs();box.classList.remove("on","blank","ui");document.documentElement.classList.remove("pres-on");
    try{wake&&wake.release()}catch(_){}wake=null;
    if(histPushed&&!fromPop){histPushed=false;try{history.back()}catch(_){}}else histPushed=false;
    const i=idx;setTimeout(()=>{try{opt.onClose&&opt.onClose(i)}catch(_){}},60);
  }
  addEventListener("keydown",onKey,true);
  document.addEventListener("fullscreenchange",onFsChange);document.addEventListener("webkitfullscreenchange",onFsChange);
  addEventListener("popstate",()=>{if(open_){histPushed=false;close(true)}});
  addEventListener("resize",()=>{if(open_){cache={};show()}});
  document.addEventListener("visibilitychange",()=>{if(open_&&document.visibilityState==="visible"&&!wake)keepAwake()});
  window.LISTPRES={open,close,isOpen:()=>open_,pagesFor,paint,refOf,css,ar,clean,noteHTML,noteText};

  /* ================= العرض على شاشة خارجية (وضع المقدّم) =================
     صفحة القائمة على اللابتوب = أداة التحكم، ونافذة screen.html على الشاشة الخارجية تعرض بملء الشاشة (نفس نافذة الأصحاح).
     زرار العرض جنب أي عنصر يبعته للشاشة، والعنصر المعروض متعلَّم عليه في الصفحة.
     الأسهم / المسافة / Enter / PageUp-PageDown (والريموت) من اللابتوب تحرّك العرض؛ B = شاشة سوداء.
     الشاشة بتقسم العنصر الطويل على شرائح على قد مقاسها، وترد بـ edge لما توصل لآخره فننتقل للعنصر اللي بعده.
     o = {items:()=>[], title:()=>"", fields:()=>{}, onMark:(id|null)=>{}, onState:()=>{}} */
  const SC={on:false,win:null,id:null,blank:false,part:[0,1],poll:0,bar:null,o:null,sent:""};
  const scSend=m=>{try{if(SC.win&&!SC.win.closed)SC.win.postMessage(m,"*")}catch(_){}};
  const scItems=()=>SC.o?SC.o.items()||[]:[];
  const scIdx=()=>scItems().findIndex(x=>x.id===SC.id);
  async function scOpenWin(){
    let feat="popup,width=1000,height=620";
    try{if("getScreenDetails" in window){const sd=await window.getScreenDetails();const ext=sd.screens.find(x=>x!==sd.currentScreen);
      if(ext)feat=`popup,left=${ext.availLeft},top=${ext.availTop},width=${ext.availWidth},height=${ext.availHeight}`}}catch(_){}
    try{SC.win=window.open("screen.html","tsk_screen",feat)}catch(_){SC.win=null}
    scUi()}
  function scUi(){if(!SC.on)return;
    if(!SC.bar){SC.bar=document.createElement("div");SC.bar.className="scr-bar";SC.bar.setAttribute("role","toolbar");SC.bar.setAttribute("aria-label","التحكم في الشاشة الخارجية");document.body.append(SC.bar);
      SC.bar.addEventListener("click",e=>{const b=e.target.closest("[data-sa]");if(!b)return;const k=b.dataset.sa;
        if(k==="next")scStep(1);else if(k==="prev")scStep(-1);else if(k==="blank")scBlank(!SC.blank);else if(k==="stop")scStop();else if(k==="open")scOpenWin();
        else if(k==="theme"){setS("pres_theme",T()==="dark"?"light":"dark");scSend({t:"theme",theme:T()})}})}
    const it=scItems(),i=scIdx(),x=it[i];
    const lab=SC.lost&&SC.win&&!SC.win.closed?`<span class="scr-st warn">الشاشة الخارجية اتفصلت — وصّلها تاني (Win+P ← Extend) أو أوقف العرض</span>`:!SC.win||SC.win.closed?`<span class="scr-st warn">نافذة العرض غير مفتوحة</span><button type="button" class="scr-b strong" data-sa="open">افتح نافذة العرض</button>`
      :`<span class="scr-st"><i class="scr-dot"></i>على الشاشة الخارجية: <b>${x?(x.k==="v"?esc(x.ref):x.k==="d"?esc(x.num):"شرح")+(SC.part[1]>1?` (${ar(SC.part[0]+1)}/${ar(SC.part[1])})`:"")+` — ${ar(i+1)} من ${ar(it.length)}`:"لم يُختر عنصر بعد — اضغط ← أو زرار العرض جنب أي عنصر"}</b>${SC.blank?" · شاشة سوداء":""}</span>`;
    SC.bar.innerHTML=`${lab}<span class="scr-gap"></span>
      <button type="button" class="scr-b" data-sa="prev" title="السابق (→)" aria-label="السابق">→</button>
      <button type="button" class="scr-b" data-sa="next" title="التالي (←)" aria-label="التالي">←</button>
      <button type="button" class="scr-b ${SC.blank?"on":""}" data-sa="blank" title="شاشة سوداء (B)">■</button>
      <button type="button" class="scr-b" data-sa="theme" title="خلفية سوداء / بيضاء" aria-label="خلفية سوداء / بيضاء"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18z"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg></button>
      <button type="button" class="scr-b" data-sa="stop" title="إيقاف العرض على الشاشة الخارجية">إيقاف</button>`;
    SC.bar.classList.add("on")}
  function scMark(){try{SC.o&&SC.o.onMark(SC.on&&scIdx()>=0?SC.id:null)}catch(_){}}
  function scSendItem(at){const it=scItems(),i=scIdx();if(i<0)return;const x=it[i];
    SC.sent=JSON.stringify(x)+JSON.stringify(SC.o.fields());
    scSend({t:"item",item:x,fields:SC.o.fields(),ref:refOf(x),count:`${ar(i+1)} من ${ar(it.length)}`,theme:T(),at:at||"first"})}
  function scShow(i){if(!SC.on)scStart(SC.o);const it=scItems();if(!it[i])return;SC.id=it[i].id;SC.part=[0,1];scBlank(false,true);scSendItem("first");scMark();scUi()}
  function scStep(dir){const it=scItems();if(!it.length)return;
    if(scIdx()<0){scShow(dir>0?0:it.length-1);return}
    scSend({t:"step",dir})}
  function scEdge(dir){const it=scItems(),j=scIdx()+dir;if(j<0||j>=it.length)return;SC.id=it[j].id;SC.part=[0,1];scSendItem(dir>0?"first":"last");scMark();scUi()}
  function scBlank(v,quiet){SC.blank=v;scSend({t:"blank",on:v});if(!quiet)scUi()}
  function scStart(o){if(o)SC.o=o;if(SC.on)return;SC.on=true;SC.id=null;SC.blank=false;document.documentElement.classList.add("scr-on");
    scOpenWin();clearInterval(SC.poll);SC.poll=setInterval(()=>{if(SC.on&&SC.win&&SC.win.closed){SC.win=null;scUi()}},1000);
    scUi();try{SC.o.onState()}catch(_){}}
  function scStop(){if(!SC.on)return;SC.on=false;scSend({t:"bye"});try{SC.win&&!SC.win.closed&&SC.win.close()}catch(_){}SC.win=null;clearInterval(SC.poll);
    document.documentElement.classList.remove("scr-on");if(SC.bar)SC.bar.classList.remove("on");try{SC.o.onMark(null);SC.o.onState()}catch(_){}}
  /* القائمة اتغيرت (تعديل شرح، حذف، تبديل القائمة…): ابعت العنصر تاني لو اتغير، وحدّث العلامة والشريط */
  function scRefresh(){if(!SC.on)return;const i=scIdx();
    if(i>=0){const x=scItems()[i];if(JSON.stringify(x)+JSON.stringify(SC.o.fields())!==SC.sent)scSendItem("first")}
    else if(SC.id!=null){SC.id=null;scSend({t:"title",text:SC.o.title()})}
    scMark();scUi()}
  function scKey(k){
    if(["ArrowLeft","ArrowDown","PageDown"," ","Spacebar","Enter"].includes(k)){scStep(1);return true}
    if(["ArrowRight","ArrowUp","PageUp","Backspace"].includes(k)){scStep(-1);return true}
    if(k==="Home"){scShow(0);return true}
    if(k==="End"){scShow(scItems().length-1);return true}
    if(k==="b"||k==="B"){scBlank(!SC.blank);return true}
    return false}
  addEventListener("message",e=>{if(!SC.win||e.source!==SC.win)return;const m=e.data||{};
    if(m.t==="ready"){scSend({t:"theme",theme:T()});if(scIdx()>=0)scSendItem("first");else scSend({t:"title",text:SC.o?SC.o.title():""});scUi()}
    else if(m.t==="edge")scEdge(m.dir);
    else if(m.t==="pos"){SC.part=[m.part,m.parts];scUi()}
    else if(m.t==="key")scKey(m.key)});
  addEventListener("keydown",e=>{
    if(!SC.on||open_||e.altKey||e.ctrlKey||e.metaKey)return;
    const t=e.target;if(t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))return;
    if(t&&t.tagName==="BUTTON"&&(e.key===" "||e.key==="Enter"))return;   /* المسافة/Enter على زرار = تضغطه */
    if(scKey(e.key))e.preventDefault()});
  addEventListener("pagehide",()=>{if(SC.on)scSend({t:"bye"})});
  /* الشاشة الخارجية اتفصلت أو اتحوّلت Duplicate وإحنا بنعرض: تنبيه في الشريط (presfit.js: PRESFIT.ext) */
  window.PRESFIT&&PRESFIT.ext.watch(()=>{if(!SC.on)return;SC.lost=!(window.screen&&screen.isExtended);scUi()});
  window.LISTSCR={start:scStart,stop:scStop,show:scShow,refresh:scRefresh,get on(){return SC.on},get id(){return SC.on?SC.id:null},toggle(o){SC.on?scStop():scStart(o)}};
})();
