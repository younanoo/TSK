/* العرض على شاشة خارجية (وضع المقدّم): صفحة الأصحاح العادية على اللابتوب هي أداة التحكم،
   ونافذة screen.html على الشاشة الخارجية تعرض بملء الشاشة.
   - وقت التشغيل يظهر زر «اعرض» جنب كل آية في الأصحاح (app.js: SCRON) ويرسلها للشاشة الخارجية،
     وفي الشريط «السابق / التالي» وخانة «انتقال» (رقم عدد أو ٣:١٦ أو يو ٣:١٦)، والآية المعروضة متعلَّم عليها في الصفحة.
   - الأسهم / المسافة / Enter / PageUp-PageDown (والريموت) من اللابتوب تحرّك العرض؛ B = شاشة سوداء.
   - اكتب رقم العدد، أو أصحاح:عدد (3:16)، أو سفر وأصحاح وعدد (يو 3:16) ثم Enter للانتقال مباشرة؛ Esc يلغي.
     السفر التاني بيتعرض على الشاشة الخارجية والصفحة هنا تفضل زي ما هي.
   - زر «٣ ترجمات»: الآية بفاندايك وكتاب الحياة وKJV مع بعض على الشاشة الخارجية.
   - زر «بين السطور»: الآية بخانات العرض بين السطور (لسفر الصفحة)؛ والضغط على رقم سترونج في صفحة بين السطور هنا
     يعرض المدخل على الشاشة الخارجية ("رجوع للآية" من الشريط أو الأسهم).
   - في وضع «أرقام سترونج»: الأرقام تظهر على الشاشة الخارجية أيضًا، وفتح نافذة سترونج الصغيرة (chstrong.js)
     يعرض نفس المدخل هناك بملء الشاشة، وقفلها يرجّع الآية.
   كروم وإيدج: النافذة تفتح على الشاشة الثانية مباشرة (Window Management API، بإذن أول مرة). غير ذلك: تُسحب يدويًا.
   الاتصال بين النافذتين بـ postMessage على نفس الجهاز (بدون سيرفر وبدون إنترنت). يُحمَّل عند أول ضغطة فقط (من app.js). */
(function(){
  "use strict";
  if(window.SCR) return;
  /* ---- سجل الشواهد + متابعة الصفحة ----
     كل «انتقال» أو «اعرض» يضيف مكانًا للسجل (آخر ١٥)، و«التالي/السابق» يحدّثوا المكان الحالي بس.
     «↩ رجوع» خطوة لورا، و▾ قائمة السجل. الصفحة تتنقل مع الشاشة: نفس السفر بدون تحميل، وسفر تاني بتحميل صفحته
     ثم resume() يرجع يتصل بنفس نافذة العرض (window.open("", "tsk_screen")) من غير ما تتقفل.
     السجل والحالة في sessionStorage (tsk_scr_hist / tsk_scr_live) عشان يعدّوا تحميل الصفحة، ويتمسحوا مع «إيقاف». */
  const HK="tsk_scr_hist",LK="tsk_scr_live",HMAX=15;
  const ss={get(k){try{return JSON.parse(sessionStorage.getItem(k)||"null")}catch(_){return null}},set(k,v){try{v==null?sessionStorage.removeItem(k):sessionStorage.setItem(k,JSON.stringify(v))}catch(_){}}};
  let H=ss.get(HK)||{l:[],i:-1},histOpen=false,leaving=false,pending=null;
  let fsOn=true,lost=false,src=null,cur=null,jb="",jT=0,scr=null,on=false,list=null,idx=-1,part=[0,1],dictUp=false,blank=false,poll=0,sig="",bar=null,retryT=0;
  const send=m=>{try{if(scr&&!scr.closed)scr.postMessage(m,"*")}catch(_){}};
  const theme=()=>store.get("pres_theme","dark");

  function ui(){
    if(!bar){bar=document.createElement("div");bar.className="scr-bar";bar.setAttribute("role","toolbar");bar.setAttribute("aria-label","التحكم في الشاشة الخارجية");document.body.append(bar);
      bar.innerHTML=`<div class="scr-hl" hidden role="menu" aria-label="الشواهد اللي اتعرضت"></div><div class="scr-main"></div><form class="scr-jf" role="search"><input type="text" autocomplete="off" enterkeyhint="go" placeholder="انتقال: ١٢ أو ٣:١٦ أو يو ٣:١٦" aria-label="انتقال إلى عدد"><button type="submit" class="scr-b">اذهب</button></form>`;
      bar.querySelector(".scr-jf").addEventListener("submit",e=>{e.preventDefault();const i=e.target.querySelector("input"),v=i.value.trim();if(!v)return;
        if(!cur){cur={abbr:book().abbr,list:book().verses};src=cur;list=cur.list}jb=v;i.value="";i.blur();jumpGo()});
      bar.addEventListener("click",e=>{const tb=e.target.closest("[data-str]");if(tb){store.set("tr",tb.dataset.str);store.set("corig",false);try{render()}catch(_){}if(idx>=0){part=[0,1];sendVerse("first")}ui();return}const hi=e.target.closest("[data-hi]");if(hi){histOpen=false;goTo(+hi.dataset.hi);return}const sn=e.target.closest("[data-sn]");if(sn){setN(+sn.dataset.sn);return}const b=e.target.closest("[data-sa]");if(!b)return;const k=b.dataset.sa;
        if(k==="back"){histOpen=false;if(H.i>0)goTo(H.i-1);return}if(k==="hist"){histOpen=!histOpen;ui();return}if(k==="resume"){attach(true);return}if(k==="undict"){undict();return}if(k==="str"){store.set("pres_str",!STR());if(idx>=0){part=[0,1];sendVerse("first")}ui();return}if(k==="dia"){store.set("dia",store.get("dia",false)!==true);try{render()}catch(_){}if(idx>=0){part=[0,1];sendVerse("first")}ui();return}if(k==="il"){store.set("pres_il",!IL());store.set("pres_tri",false);if(idx>=0){part=[0,1];sendVerse("first");mark(false)}ui();return}if(k==="tri"){store.set("pres_il",false);store.set("pres_tri",!TRI());if(idx>=0){part=[0,1];sendVerse("first");mark(false)}ui();return}if(k==="next")step(1);else if(k==="prev")step(-1);else if(k==="blank")setBlank(!blank);else if(k==="stop")stop();else if(k==="open")openWin(null);else if(k==="theme"){store.set("pres_theme",theme()==="dark"?"light":"dark");send({t:"theme",theme:theme()})}})}
    const d=list&&list[idx],b={abbr:src?src.abbr:book().abbr};
    const lab=!fsOn&&scr&&!scr.closed&&!jb&&!lost?`<span class="scr-st warn">الشاشة الخارجية مش بملء الشاشة — اضغط عليها مرة، أو أي زرار في الكيبورد/الريموت وهي في المقدمة</span>`:lost&&scr&&!scr.closed&&!jb?`<span class="scr-st warn">الشاشة الخارجية اتفصلت — وصّلها تاني (Win+P ← Extend) أو أوقف العرض</span>`:jb?`<span class="scr-st"><b class="scr-jump">انتقال إلى: ${esc(PRESFIT.ar(jb))}</b> — Enter للانتقال · Esc للإلغاء</span>`:!scr||scr.closed?pending?`<span class="scr-st warn">الصفحة اتنقلت — اضغط «كمّل العرض» عشان التحكم يرجع</span><button type="button" class="scr-b strong" data-sa="resume">كمّل العرض</button>`:`<span class="scr-st warn">نافذة العرض غير مفتوحة</span><button type="button" class="scr-b strong" data-sa="open">افتح نافذة العرض</button>`
      :`<span class="scr-st"><i class="scr-dot"></i>على الشاشة الخارجية: <b>${d?`${esc(AR[b.abbr])} ${n(d.c)}: ${n(d.v)}${part[1]>1?` (${n(part[0]+1)}/${n(part[1])})`:""}`:"لم تُختر آية بعد — اضغط «اعرض» جنب أي آية، أو «التالي»"}</b>${dictUp?" · قاموس سترونج":""}${blank?" · شاشة سوداء":""}</span>`;
    const av=trAvail(),tc=trCur();   /* الترجمة: نفس إعداد الصفحة (مش في ٣ ترجمات / بين السطور) */
    const trs=TRI()||IL()||av.length<2?"":`<span class="scr-ns scr-trs" role="group" aria-label="الترجمة">${av.map(k=>`<button type="button" class="scr-b ${k===tc?"on":""}" data-str="${k}" aria-pressed="${k===tc}" title="اعرض بترجمة ${TRN[k]}">${TRN[k]}</button>`).join("")}</span>`;
    bar.querySelector(".scr-main").innerHTML=`${lab}<span class="scr-gap"></span>${trs}
      <span class="scr-ns">${[1,3,5].map(k=>`<button type="button" class="scr-b ${!TRI()&&K()===k?"on":""}" data-sn="${k}" title="${k===1?"آية واحدة":n(k)+" آيات"} في الشريحة">${n(k)}</button>`).join("")}</span>
      ${src&&src!==cur||!(TRI()||diaAvail())?"":`<button type="button" class="scr-b ${store.get("dia",false)===true?"on":""}" data-sa="dia" title="إظهار التشكيل أو إخفاؤه">تشكيل</button>`}
      <button type="button" class="scr-b ${TRI()?"on":""}" data-sa="tri" title="الآية بالترجمات الثلاث مع بعض">٣ ترجمات</button>
      <button type="button" class="scr-b ${IL()?"on":""}" data-sa="il" title="الآية بالعرض بين السطور">بين السطور</button>
      ${TRI()||IL()?"":`<button type="button" class="scr-b ${STR()?"on":""}" data-sa="str" title="إظهار أرقام سترونج على الشاشة الخارجية؛ والضغط على كلمة يعرض معناها هناك">سترونج</button>`}
      ${dictUp?`<button type="button" class="scr-b strong" data-sa="undict" title="رجوع للآية على الشاشة الخارجية">رجوع للآية</button>`:""}
      <span class="scr-hist"><button type="button" class="scr-b" data-sa="back" ${H.i>0?"":"disabled"} title="رجوع للشاهد اللي كان معروض قبل كده">↩ رجوع</button><button type="button" class="scr-b scr-hdd" data-sa="hist" ${H.l.length>1?"":"disabled"} aria-haspopup="menu" aria-expanded="${histOpen}" title="الشواهد اللي اتعرضت" aria-label="الشواهد اللي اتعرضت">▾</button></span>
      <button type="button" class="scr-b" data-sa="prev" title="الآية السابقة (→)">→ السابق</button>
      <button type="button" class="scr-b" data-sa="next" title="الآية التالية (←)">التالي ←</button>
      <button type="button" class="scr-b ${blank?"on":""}" data-sa="blank" title="شاشة سوداء (B)">■</button>
      <button type="button" class="scr-b" data-sa="theme" title="خلفية سوداء / بيضاء" aria-label="خلفية سوداء / بيضاء"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18z"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg></button>
      <button type="button" class="scr-b" data-sa="stop" title="إيقاف العرض على الشاشة الخارجية">إيقاف</button>`;
    bar.classList.add("on");
    const hl=bar.querySelector(".scr-hl");hl.hidden=!histOpen||H.l.length<2;
    if(!hl.hidden)hl.innerHTML=`<div class="scr-hh">الشواهد اللي اتعرضت</div>`+H.l.map((p,k)=>({p,k})).reverse().map(({p,k})=>`<button type="button" role="menuitem" class="scr-hi ${k===H.i?"on":""}" data-hi="${k}">${esc(AR[p.a]||p.a)} ${n(p.c)}: ${n(p.v)}${k===H.i?' <small>المعروض الآن</small>':""}</button>`).join("");
  }
  document.addEventListener("click",e=>{if(histOpen&&bar&&!e.target.closest(".scr-hl,[data-sa=hist]")){histOpen=false;ui()}});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&histOpen){histOpen=false;ui()}});
  const here=()=>{const d=list&&list[idx];return d&&src?{a:src.abbr,c:d.c,v:d.v}:null};
  const same=(x,y)=>!!(x&&y&&x.a===y.a&&x.c===y.c&&x.v===y.v);
  function histPush(){const p=here();if(!p||same(H.l[H.i],p))return;H.l.push(p);if(H.l.length>HMAX)H.l.shift();H.i=H.l.length-1;ss.set(HK,H)}
  function histUpd(){const p=here();if(!p||H.i<0||!H.l[H.i])return;H.l[H.i]=p;ss.set(HK,H)}
  /* روح لمكان من السجل: الشاشة + الصفحة */
  function goTo(k){const p=H.l[k];if(!p)return;H.i=k;ss.set(HK,H);
    const b=book();if(!cur)cur={abbr:b.abbr,list:b.verses};
    const fin=s2=>{if(!s2)return;const j=s2.list.findIndex(d=>d.c===p.c&&d.v===p.v);if(j<0)return;src=s2;list=s2.list;idx=j;part=[0,1];if(dictUp)undict();setBlank(false,true);sendVerse("first");mark(true);ui();follow()};
    if(p.a===cur.abbr)fin(cur);else if(src&&p.a===src.abbr)fin(src);else PRESFIT.foreign(p.a,fin)}
  /* الآية من سفر تاني: افتح صفحة السفر ده، والعرض يكمل بعد التحميل (resume) */
  function follow(){const d=list&&list[idx];if(!on||!src||!src.foreign||!d)return;
    leaving=true;ss.set(LK,{a:src.abbr,c:d.c,v:d.v,blank});ss.set(HK,H);
    setTimeout(()=>{location.href=pageOf(src.abbr,"/"+src.abbr+"/ch/"+d.c)},120)}
  /* بعد تحميل صفحة السفر الجديد */
  function resume(){const Lv=ss.get(LK);ss.set(LK,null);if(!Lv)return;
    const go=()=>{const b=book();if(!b||S.view!=="chapter"){return void setTimeout(go,150)}
      on=true;document.documentElement.classList.add("scr-on");
      cur={abbr:b.abbr,list:b.verses};src=cur;list=cur.list;idx=Math.max(0,list.findIndex(d=>d.c===Lv.c&&d.v===Lv.v));part=[0,1];blank=!!Lv.blank;
      clearInterval(poll);poll=setInterval(()=>{if(on&&scr&&scr.closed){scr=null;ui()}},1000);
      pending=Lv;attach(false);ui();try{render()}catch(_){}};
    go()}
  /* إعادة الاتصال بنفس نافذة العرض. user=true لما الضغطة من «كمّل العرض» */
  function attach(user){let w=null;try{w=window.open("","tsk_screen")}catch(_){w=null}
    let ok=false;try{ok=!!(w&&!w.closed&&/screen\.html/.test(w.location.pathname))}catch(_){ok=false}
    if(!ok){try{if(w&&!w.closed&&w.location.href==="about:blank")w.close()}catch(_){}
      if(user){pending=null;openWin(null);sync();ui()}else ui();return}
    scr=w;pending=null;sig="";sendVerse("first");mark(true);ui();syncBtn()}

  async function openWin(ev){
    let feat="popup,width=1000,height=620";
    /* كروم وإيدج: افتح النافذة على الشاشة الثانية بمقاسها */
    try{if("getScreenDetails" in window){const sd=await window.getScreenDetails();const ext=sd.screens.find(s=>s!==sd.currentScreen);
      if(ext)feat=`popup,left=${ext.availLeft},top=${ext.availTop},width=${ext.availWidth},height=${ext.availHeight}`}}catch(_){}
    try{scr=window.open("screen.html","tsk_screen",feat)}catch(_){scr=null}
    ui();
  }
  function start(){
    if(on) return;
    on=true;document.documentElement.classList.add("scr-on");
    openWin();
    clearInterval(poll);poll=setInterval(()=>{if(on&&scr&&scr.closed){scr=null;ui()}},1000);
    sync();ui();try{render()}catch(_){}   /* تظهر أزرار «اعرض» جنب الآيات */
  }
  function stop(){
    if(!on) return;
    on=false;send({t:"bye"});H={l:[],i:-1};histOpen=false;pending=null;ss.set(HK,null);ss.set(LK,null);try{scr&&!scr.closed&&scr.close()}catch(_){}scr=null;clearInterval(poll);
    document.documentElement.classList.remove("scr-on");document.querySelectorAll(".scr-cur").forEach(x=>x.classList.remove("scr-cur"));
    if(bar)bar.classList.remove("on");syncBtn();try{render()}catch(_){}   /* تختفي أزرار «اعرض» */
  }

  /* ---- الآية ---- */
  function segsOf(d){
    if(src&&src.foreign){const a=src.segs(d,STR(),trCur());return a?{a,str:STR()&&trCur()==="svd"}:null}
    if(window.chEnsure&&!chEnsure(d.c))return null;   /* الأصحاح لسه بيتحمّل — sendVerse بيعيد المحاولة */
    if(STR()&&cstrOn()){const sg=cstrSeg(d);if(sg)return {a:sg,str:true};return null}   /* أرقام سترونج: زر «سترونج» في الشريط (نفس إعداد العرض بملء الشاشة) */
    const t=trText(d)||(trCur()==="alab"&&!diaOn()?d.text:null);if(!t)return null;
    return {a:t.split(/(\s+)/).filter(Boolean).map(x=>[x,[]]),str:false};
  }
  const STR=()=>store.get("pres_str",false)===true;
  const TRI=()=>store.get("pres_tri",false)===true;   /* الترجمات الثلاث — نفس إعداد العرض بملء الشاشة */
  const IL=()=>store.get("pres_il",false)===true;     /* بين السطور */
  const K=()=>TRI()||IL()?1:PRESFIT.N(store.get("pres_n",1));   /* آية أو ٣ أو ٥ في الشريحة */
  const grp=()=>PRESFIT.group(list,idx,K());
  function sendVerse(at){
    clearTimeout(retryT);
    const d=list&&list[idx];if(!d)return;
    if(IL()&&src===cur){const sl=ilSlide(d);if(!sl){retryT=setTimeout(()=>sendVerse(at),350);return}
      send({t:"il",sl,ref:`${AR[src.abbr]} ${n(d.c)}: ${n(d.v)}`,theme:theme(),at:at||"first"});sig=sigNow();return}
    if(TRI()){const items=PRESFIT.tri(src.abbr,d,src===cur&&store.get("dia",false)===true?diaTextOf:null);if(!items){retryT=setTimeout(()=>sendVerse(at),350);return}
      send({t:"tri",items,ref:`${AR[src.abbr]} ${n(d.c)}: ${n(d.v)}`,theme:theme()});sig=sigNow();return}
    const g=grp(),ss=g.map(i=>segsOf(list[i]));if(!ss.every(Boolean)){retryT=setTimeout(()=>sendVerse(at),350);return}
    const b={abbr:src.abbr},e=list[g[g.length-1]];
    send({t:"verse",segs:PRESFIT.join(ss.map((x,j)=>[x.a,n(list[g[j]].v)])),str:ss[0].str,kj:trCur()==="kjv",ref:`${AR[b.abbr]} ${n(d.c)}: ${n(d.v)}${e!==d?"–"+n(e.v):""}`,trn:TRN[trCur()],theme:theme(),at:at||"first"});
    sig=sigNow();
  }
  const sigNow=()=>[trCur(),diaOn(),store.get("dia",false),STR(),TRI(),IL(),store.get("isrc","ours")].join("|");
  function show(bid,c,v){
    if(!on) start();
    cur={abbr:book().abbr,list:book().verses};src=cur;list=cur.list;idx=Math.max(0,list.findIndex(d=>d.c===c&&d.v===v));part=[0,1];
    if(dictUp)undict();
    setBlank(false,true);sendVerse("first");mark(true);histPush();ui();
  }
  function step(dir){
    if(idx<0){if(dir>0){const b=book(),d=b.verses.find(x=>x.c===S.c);if(d)show(b.id,d.c,d.v)}return}   /* لسه مفيش آية: «التالي» يبدأ من أول الأصحاح */
    if(dictUp){undict();return}
    send({t:"step",dir});   /* الشاشة تتنقل بين أجزاء الآية الطويلة، وترد بـ edge لما توصل للآخر */
  }
  function edge(dir){
    const g=grp(),j=dir>0?g[g.length-1]+1:PRESFIT.prevStart(list,idx,K());if(j<0||j>=list.length)return;
    idx=j;part=[0,1];sendVerse(dir>0?"first":"last");mark(true);histUpd();ui();
  }
  function setN(k){store.set("pres_n",k);store.set("pres_tri",false);store.set("pres_il",false);if(idx>=0){part=[0,1];sendVerse("first");mark(false)}ui()}
  function setBlank(v,quiet){blank=v;send({t:"blank",on:v});if(!quiet)ui()}
  function undict(){dictUp=false;send({t:"undict"});try{window.CHS&&CHS.close()}catch(_){}ui()}

  /* ---- علامة الآية المعروضة في الصفحة (تتعاد بعد كل render) ---- */
  function mark(scroll){
    document.querySelectorAll(".scr-cur").forEach(x=>x.classList.remove("scr-cur"));
    const d=list&&list[idx];if(!d||!on||src!==cur)return;   /* سفر تاني: الصفحة هنا مفيهاش آياته */
    if(scroll&&S.view==="chapter"&&S.c!==d.c){goChapter(d.b,d.c);return}
    const row=x=>{const k=`${x.b}.${x.c}:${x.v}`,q=`[data-go="${k}"]`,a=document.querySelector(`.cvlist:not([hidden]) .cv[data-go="${k}"], .cvlist:not([hidden]) .cv[data-gk="${k}"]`),c=document.querySelector(`.ilist .ilvn${q}`);return (a&&a.closest(".cvw"))||(c&&c.closest(".ilv"))};
    grp().forEach(i=>{const ww=row(list[i]);if(ww)ww.classList.add("scr-cur")});
    const w=row(d);
    if(w){if(scroll){const r=w.getBoundingClientRect();if(r.top<80||r.bottom>innerHeight-90)w.scrollIntoView({block:"center",behavior:"smooth"})}}
  }
  function syncBtn(){document.querySelectorAll("[data-scr]").forEach(b=>{b.classList.toggle("on",on);const s=b.querySelector("span");if(s)s.textContent=on?"إيقاف الشاشة الخارجية":"العرض على شاشة خارجية"})}
  function sync(){syncBtn();mark(false);if(on&&idx>=0&&sigNow()!==sig)sendVerse("first")}
  const main=document.getElementById("main");
  if(main)new MutationObserver(()=>{if(on)sync();else syncBtn()}).observe(main,{childList:true});

  /* ---- رسائل نافذة العرض ---- */
  addEventListener("message",e=>{if(!scr||e.source!==scr)return;const m=e.data||{};
    if(m.t==="fs"){fsOn=!!m.on;ui();return}
    if(m.t==="ready"){send({t:"theme",theme:theme()});if(idx>=0)sendVerse("first");else{const b=book();send({t:"title",text:`${AR[b.abbr]} ${n(S.c)}`})}ui()}
    else if(m.t==="edge")edge(m.dir);
    else if(m.t==="word")wordDict(m.nums,m.word);
    else if(m.t==="pos"){part=[m.part,m.parts];ui()}
    else if(m.t==="key"){if(idx>=0||PRESFIT.jkey(m.key,jb))key(m.key)}
  });
  /* ---- صفحة بين السطور: الضغط على رقم سترونج يعرض المدخل على الشاشة الخارجية بدل فتح صفحة سترونج ---- */
  addEventListener("click",e=>{if(!on||!scr)return;const a=e.target.closest(".ilist a.iln");if(!a)return;const num=a.textContent.trim();if(!/^[GH]\d+$/.test(num))return;
    e.preventDefault();e.stopPropagation();const c=a.closest(".ilc"),w=c&&(c.querySelector(".ila")||c.querySelector(".ilk")),v=a.closest(".ilv"),g=v&&v.querySelector(".ilvn[data-go]"),m=g&&g.dataset.go.match(/\.(\d+):(\d+)$/);
    loadJS("assets/chstrong.js",()=>{if(!window.CHS||!CHS.need)return;CHS.need([num],DIC=>{dictUp=true;
      send({t:"dict",word:(w&&w.textContent.trim())||num,ref:`${AR[book().abbr]}${m?` ${n(+m[1])}: ${n(+m[2])}`:""}`,entries:[[num,DIC[num]||null]],theme:theme()});ui()})})},true);
  /* ضغطة على كلمة أو رقم سترونج في نافذة العرض نفسها: المدخل يظهر هناك */
  function wordDict(nums,word){nums=(nums||[]).filter(x=>/^[GH]\d+$/.test(x));if(!nums.length||!on||!scr)return;const d=list&&list[idx];
    loadJS("assets/chstrong.js",()=>{if(!window.CHS||!CHS.need)return;CHS.need(nums,DIC=>{dictUp=true;
      send({t:"dict",word:word||nums[0],ref:d?`${AR[src.abbr]} ${n(d.c)}: ${n(d.v)}`:"",entries:nums.map(x=>[x,DIC[x]||null]),theme:theme()});ui()})})}
  /* ---- قاموس سترونج: نفس المدخل على الشاشة الخارجية ---- */
  document.addEventListener("chs:show",e=>{if(!on||!scr)return;const x=e.detail;dictUp=true;
    send({t:"dict",word:x.word,ref:`${AR[x.ab]} ${n(x.c)}: ${n(x.v)}`,entries:x.entries,theme:theme()});ui()});
  document.addEventListener("chs:close",()=>{if(on&&dictUp){dictUp=false;send({t:"undict"});ui()}});

  /* ---- الكيبورد والريموت على اللابتوب (ومن نافذة العرض لو التركيز عليها) ---- */
  function jumpGo(){const s=jb;jb="";clearTimeout(jT);
    PRESFIT.resolve(s,src,idx,cur,(s2,j)=>{
      if(j<0){ui();if(bar){const st=bar.querySelector(".scr-st");if(st)st.innerHTML=`<b class="scr-jump">«${esc(PRESFIT.ar(s.trim()))}» غير موجود — مثال: ١٢ أو ٣:١٦ أو يو ٣:١٦</b>`}return}
      src=s2;list=s2.list;idx=j;part=[0,1];if(dictUp)undict();sendVerse("first");mark(true);histPush();ui();follow()})}
  function key(k){   /* true = اتعامل معاه */
    const j=PRESFIT.jkey(k,jb);
    if(j){jb+=j;clearTimeout(jT);jT=setTimeout(()=>{jb="";ui()},5000);ui();return true}
    if(jb){if(k==="Enter"){jumpGo();return true}if(k==="Backspace"){jb=jb.slice(0,-1);ui();return true}if(k==="Escape"){jb="";ui();return true}}
    if(["ArrowLeft","ArrowDown","PageDown"," ","Spacebar","Enter"].includes(k)){step(1);return true}
    if(["ArrowRight","ArrowUp","PageUp"].includes(k)){step(-1);return true}
    if(k==="b"||k==="B"){setBlank(!blank);return true}
    return false}
  addEventListener("keydown",e=>{
    if(!on||idx<0||e.altKey||e.ctrlKey||e.metaKey)return;
    if(document.getElementById("pres")&&document.getElementById("pres").classList.contains("on"))return;
    const t=e.target;if(t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))return;
    if(e.key==="Escape"&&!jb)return;   /* Esc العادي يفضل لقفل نافذة سترونج */
    if(key(e.key))e.preventDefault();
  });
  addEventListener("pagehide",()=>{if(on&&!leaving&&!pending)send({t:"bye"})});   /* الانتقال لصفحة سفر تاني: النافذة تفضل مفتوحة */
  /* الشاشة الخارجية اتفصلت أو اتحوّلت Duplicate وإحنا بنعرض: تنبيه في الشريط (العرض نفسه ما بيتقفلش) */
  PRESFIT.ext.watch(()=>{if(!on)return;lost=!(window.screen&&screen.isExtended);ui()});

  window.SCR={start,stop,show,resume,get on(){return on},toggle(){on?stop():start()}};
})();
