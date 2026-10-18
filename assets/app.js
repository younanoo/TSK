
const LIB = window.LIB;
const STRONG = window.STRONG || {};
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
const refCount = d => d.groups.reduce((a,g)=>a+g.refs.length,0);
const verseCount = d => d.groups.reduce((a,g)=>a+g.refs.reduce((x,r)=>x+r.vs.length,0),0);
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

/* ---------- sidebar ---------- */
function sidebar(){
  const totalDone=doneOf(ALL);
  const allV=CAT.reduce((a,c)=>a+c.nv,0);
  $("#libProg").textContent=`درست ${n(Object.keys(S.done).length)} من ${n(allV)}`;
  $("#booksel").innerHTML = (()=>{const f=c=>`<a href="${pageOf(c.abbr,"/"+c.abbr)}" ${c.id===S.b?'data-book="'+c.id+'"':""} class="${c.id===S.b?"active":""}"><span class="ab">${SH[c.abbr]}</span><span class="nm"><b>${AR[c.abbr]}</b><span>${chs(c.nc)} · ${n(c.nv)} عددًا</span></span><span class="pc">${pct(doneIn(c.id),c.nv)}</span></a>`;let o="",lt=null;CAT.forEach(c=>{const t=c.id<=39?"ot":"nt";if(t!==lt){o+=`<div class="bkhd">${t==="ot"?"العهد القديم":"العهد الجديد"}</div>`;lt=t}o+=f(c)});return o})()
  const b=book();
  const sn=mine(S.stars).length, nn=mine(S.notes).filter(k=>(S.notes[k]||"").trim()).length;
  $("#starN").textContent=sn?n(sn):""; $("#noteN").textContent=nn?n(nn):"";
  $("#toggleRaw").textContent=(S.raw?"☰ إخفاء":"☰ إظهار")+" سطر الشواهد الأصلي (TSK)";
}

/* ---------- pieces ---------- */
let TXL={};
function txText(bk,c,v){const k=trCur();if(k==="alab")return null;
  if(window.TX&&window.TX[k]){const x=window.TX[k][bk];return x&&x[c+":"+v]||null}
  if(!TXL[k]){TXL[k]=1;const sc=document.createElement("script");sc.src="assets/tx_"+k+".js";sc.onload=()=>render();document.body.appendChild(sc)}
  return null}
function refRow(r,k,q){
  const on=!!S.stars[k], R=refAr(r.l);
  let self="";
  const tb=BY_ABBR[R.bk];
  const m=r.l.match(/ (\d+):(\d+)/);
  if(tb){ if(m && tb.idx[m[1]+":"+m[2]]!=null) self=`<button class="self" data-go="${tb.id}.${m[1]}:${m[2]}">افتحه في الدراسة</button>`;}
  else if(m && CAT_ABBR[R.bk]) self=`<a class="self" href="${pageOf(R.bk,"/"+R.bk+"/"+m[1]+":"+m[2])}">افتحه في الدراسة</a>`;
  const mc=r.l.match(/ (\d+):/), kjv=trCur()==="kjv";
  const vt=(vn,t)=>{const x=mc&&txText(R.bk,mc[1],vn);return x||t};
  const body=r.vs.length===1?`<p>${hl(vt(r.vs[0][0],r.vs[0][1]),q)}</p>`:r.vs.map(([vn,t])=>`<p><span class="vn">${n(vn)}</span>${hl(vt(vn,t),q)}</p>`).join("");
  return `<div class="r ${on?"starred":""}" data-key="${esc(k)}">
    <div class="lbl"><span class="nmr">${hl(R.name+" "+R.num,q)}${r.n?` <small>${MARK[r.n]||esc(r.n)}</small>`:""}</span><span class="en ltr">${esc(r.l)}</span>${self}</div>
    <div class="txt ar" ${kjv?'dir="ltr" style="text-align:left"':""}>${body}</div>
    <button class="star ${on?"on":""}" title="ميّز هذا الشاهد بنجمة" aria-label="نجمة">★</button></div>`;
}
const crumbs=(title,sub,nav)=>`<div class="crumbs"><button class="menu-btn" id="menu">☰ القائمة</button><div class="ref">${sub?`<small>${sub}</small>`:""}${title}</div>${nav||"<span></span>"}</div>`;
const fromLink=(d,label)=>`<a data-go="${d.b}.${d.c}:${d.v}">${label||"من"} ${vref(d)} ←</a>`;
const kwTitle=g=>{const c=trCur();if(c==="kjv"&&g.kw)return g.kw;
  if(c==="svd"&&g.kwAr&&g.kw){const t=trText(cur())||"";const nz=x=>x.replace(/[\u064B-\u065F]/g,"").replace(/[أإآ]/g,"ا");if(!nz(t).includes(nz(g.kwAr)))return g.kw}
  return g.kwAr||g.kw||"الشواهد"};


/* ---------- Strong's ---------- */
const isHeb = n => n[0]==="H";
const linkRefs = h => h.replace(/\b([GH]\d+)\b/g,(m)=>STRONG[m]?`<span class="sref" data-sn="${m}">${m}</span>`:m);
let DICT={cur:null, hist:[], trail:[]};   // per-verse state
const TRN={alab:"كتاب الحياة",svd:"فاندايك",kjv:"KJV"};
function trAvail(){const t=window.TR&&window.TR[book().abbr];return t?Object.keys(TRN).filter(k=>k==="alab"||t[k]):[]}
function trCur(){const c=store.get("tr","alab");return trAvail().includes(c)?c:"alab"}
function trText(d){const c=trCur();if(c==="alab")return null;return window.TR[book().abbr][c][d.c+":"+d.v]||null}
function trBar(){const av=trAvail();return av.length>1?`<div class="trbar">${av.map(k=>`<button class="trb ${k===trCur()?"on":""}" data-tr="${k}">${TRN[k]}</button>`).join("")}</div>`:""}
function segHTML(a){return a.map(([t,ns])=>ns.length?`<span class="sw" data-n="${ns.join(" ")}">${esc(t)}<sup>${ns.map(x=>`<span class="sn" data-sn="${x}" title="اعرض معنى ${x}">${x}</span>`).join(" ")}</sup></span>`:esc(t)).join("")}
function trSeg(d){const c=trCur();if(c==="alab")return null;const t=window.TR[book().abbr];const a=t[c+"S"]&&t[c+"S"][d.c+":"+d.v];return a||null}
function verseHTML(d){
  const sg=trSeg(d); if(sg){const h=segHTML(sg);return trCur()==="kjv"?`<span class="ltr" dir="ltr" style="display:block;text-align:left">${h}</span>`:h}
  const tt=trText(d); if(tt) return trCur()==="kjv"?`<span class="ltr" dir="ltr" style="display:block;text-align:left">${esc(tt)}</span>`:esc(tt);
  if(!d.arS) return esc(d.text);
  return d.arS.map(([t,ns])=>ns.length?`<span class="sw" data-n="${ns.join(" ")}">${esc(t)}<sup>${ns.map(x=>`<span class="sn" data-sn="${x}" title="اعرض معنى ${x}">${x}</span>`).join(" ")}</sup></span>`:esc(t)).join("");
}
function wordsFor(d,num){ return d&&d.arS ? d.arS.filter(([t,ns])=>ns.includes(num)).map(([t])=>t) : []; }
function dentHTML(num,d=cur()){
  const e=STRONG[num];
  if(!e) return `<div class="dent"><div class="hd"><span class="num">${num}</span></div><p class="na">هذا المدخل غير متاح.</p></div>`;
  const ws=wordsFor(d,num);
  return `<div class="dent">
    <div class="hd"><span class="num">${num}</span><span class="orig ${isHeb(num)?"he":""}">${e.o}</span><span class="tr"><b>${e.tr}</b> · ${e.pr}</span>
      <a class="stopen" href="strong.html#${num}" target="_blank" rel="noopener">فتح في صفحة سترونج ↗</a>
      ${ws.length?`<span class="inv"><small>في النص:</small>${ws.map(esc).join("، ")}</span>`:""}</div>
    <div class="cols">
      <div class="col arc"><h5>المعنى بالعربية</h5><div class="tx">${e.ar?linkRefs(esc(e.ar)):`<span class="na">الترجمة العربية لهذا المدخل غير متاحة بعد (تُترجم حاليًا كلمات أعداد السفر فقط).</span>`}</div></div>
      <div class="col enc"><h5>Strong's Dictionary (English)</h5><div class="tx">${linkRefs(e.d)}</div></div>
    </div>
    ${DICT.trail.length?`<div class="back"><a id="dback">→ رجوع إلى ${DICT.trail[DICT.trail.length-1]}</a></div>`:""}
  </div>`;
}
function dictInner(){
  const d=cur();
  const hist=DICT.hist.map(x=>`<button data-dn="${x}" class="${x===DICT.cur?"on":""}">${x}</button>`).join("");
  return `<div class="dhead"><h3><em>«</em>قاموس سترونج<em>»</em></h3><div class="hist">${hist}</div></div>
    ${DICT.cur?dentHTML(DICT.cur):`<div class="empty">اضغط على أي رقم سترونج في نص العدد بالأعلى لعرض معناه هنا.</div>`}`;
}
function dictSection(d){ return d.arS?`<section class="dict" id="dict">${dictInner()}</section>`:""; }
function showEntry(num,{fromRef=false,scroll=true}={}){
  if(fromRef && DICT.cur) DICT.trail.push(DICT.cur); else if(!fromRef) DICT.trail=[];
  DICT.cur=num; if(!DICT.hist.includes(num)) DICT.hist.push(num);
  const box=$("#dict"); if(!box) return;
  box.innerHTML=dictInner();
  document.querySelectorAll(".verse-card .sw").forEach(x=>x.classList.toggle("on",x.dataset.n.split(" ").includes(num)));
  if(scroll) box.scrollIntoView({behavior:"smooth",block:"start"});
}

/* ---------- views ---------- */
function viewHome(){
  const refs=ALL.reduce((a,d)=>a+refCount(d),0), vs=ALL.reduce((a,d)=>a+verseCount(d),0), dn=doneOf(ALL);
  const last=cur();
  const ot=ABBR.slice(0,39), nt=ABBR.slice(39);
  const chip=a=>{const b=BY_ABBR[a];return `<button class="bk ${b?"on":""}" ${b?`data-book="${b.id}"`:""} title="${AR[a]}${b?"":" — لم يُضف بعد"}">${SH[a]}</button>`};
  $("#main").innerHTML = crumbs("","") + `
  <section class="hero" data-wm="${AR[book().abbr]}">
    <h2>مكتبة دراسة الشواهد</h2>
    <p>دراسة الكتاب المقدس عددًا بعدد، مع كل شواهد «كنز معرفة الكتاب المقدس» (TSK) ونصها الكامل بالعربية. اختر سفرًا، واقرأ العدد، وافتح كلماته الرئيسية، ثم تتبّع الشواهد.</p>
    <div class="stats">
      <div class="stat"><b>${n(LIB.length)}</b><span>أسفار</span></div>
      <div class="stat"><b>${n(ALL.length)}</b><span>عددًا</span></div>
      <div class="stat"><b>${n(refs)}</b><span>شاهدًا من TSK</span></div>
      <div class="stat"><b>${n(vs)}</b><span>آية للقراءة</span></div>
      <div class="stat"><b>${n(dn)}</b><span>درستها</span></div>
    </div>
    <button class="cta" data-go="${last.b}.${last.c}:${last.v}">${dn?"تابع من":"ابدأ من"} ${vref(last)} ←</button>
  </section>
  <h3 class="sec-title">أسفارك</h3>
  <div class="chgrid">${LIB.map(b=>{const d=doneOf(b.verses),r=b.verses.reduce((a,x)=>a+refCount(x),0);
    return `<button class="chcard bookcard" data-book="${b.id}"><span class="ab">${SH[b.abbr]}</span><div class="n">${bname(b)}<small class="ltr">${b.en}</small></div>
      <div class="meta">${chs(b.chapters.length)} · ${n(b.verses.length)} عددًا · ${n(r)} شاهدًا</div>
      <div class="open ar">${esc(b.verses[0].text)}</div>
      <div class="bar"><i style="width:${d/b.verses.length*100}%"></i></div><div class="pct">درست ${n(d)} من ${n(b.verses.length)}</div></button>`}).join("")}</div>
  <h3 class="sec-title">الكتاب المقدس كله</h3>
  <div class="canon"><h5>العهد القديم</h5><div class="row">${ot.map(chip).join("")}</div>
    <h5>العهد الجديد</h5><div class="row">${nt.map(chip).join("")}</div>
    <div class="legend">الأسفار الملوّنة موجودة في هذه المكتبة، وسيضيء الباقي كلما أضفت سفرًا جديدًا.</div></div>`;
}

function viewBook(){
  const b=book();
  $("#main").innerHTML = crumbs(bname(b),`<span class="ltr">${b.en}</span> · ${chs(b.chapters.length)} · ${n(b.verses.length)} عددًا`) + `
  <div class="chgrid">${b.chapters.map(c=>{const vs=inCh(b,c),d=doneOf(vs),refs=vs.reduce((a,x)=>a+refCount(x),0);
    return `<button class="chcard" data-gc="${b.id}.${c}"><div class="n">الأصحاح <span>${n(c)}</span></div>
      <div class="meta">${n(vs.length)} عددًا · ${n(refs)} شاهدًا</div>
      <div class="open ar">${esc(vs[0].text)}</div>
      <div class="bar"><i style="width:${d/vs.length*100}%"></i></div><div class="pct">درست ${n(d)} من ${n(vs.length)}</div></button>`}).join("")}</div>`;
}

function interBlock(d){
  const t=window.TR&&window.TR[book().abbr], kj=t&&t.kjvS&&t.kjvS[d.c+":"+d.v];
  if(!kj) return `<div class="ilv-none">لا يتوفر تفسير كلمة بكلمة لهذا العدد</div>`;
  const FN=new Set("G3588 G2532 G1161 G3767 G846 G848 G3450 G3165 G1473 G4675 G4571 G4771 G5216 G5209 G5210 G2257 G2254 G2248 G2249 G1438".split(" ")); const q={}; ((t.svdS&&t.svdS[d.c+":"+d.v])||[]).forEach(([w,ns])=>{let m=ns.findIndex(x=>!FN.has(x)); if(m<0)m=0; ns.forEach((x,i)=>{(q[x]=q[x]||[]).push(i===m?w.trim():"〃")})});
  const ST=window.STRONG||{};
  return kj.map(([w,ns])=>{
    const word=w.trim(); if(!word) return "";
    if(!ns.length) return `<div class="ilc ilc-x"><span class="ilk">${esc(word)}</span></div>`;
    return ns.map((x,i)=>{const e=ST[x]||{}, a=(q[x]&&q[x].shift())||"";
      return `<div class="ilc"><a class="iln" href="strong.html#${x}" target="_blank">${x}</a><span class="ilo">${esc(e.o||"")}</span><span class="ilt">${esc(e.tr||"")}</span><span class="ilk">${i?"〃":esc(word)}</span><span class="ila">${esc(a)}</span></div>`}).join("")}).join("");
}
function viewChapter(){
  const INTER=store.get("inter",false);
  const b=book(), c=S.c, vs=inCh(b,c), ci=b.chapters.indexOf(c);
  const pc=b.chapters[ci-1], nc=b.chapters[ci+1], me=CAT_ABBR[b.abbr];
  const pb=pc==null&&CAT[me.i-1], nb=nc==null&&CAT[me.i+1];
  const prevBtn=pc!=null?`<button data-gc="${b.id}.${pc}" title="الأصحاح السابق">→ <span class="lb">${n(pc)}</span></button>`
    :pb?`<a class="xnav" href="${pageOf(pb.abbr,"/"+pb.abbr+"/ch/"+parseInt(pb.last))}" title="السفر السابق">→ <span class="lb">${SH[pb.abbr]} ${n(parseInt(pb.last))}</span></a>`
    :`<button disabled>→</button>`;
  const nextBtn=nc!=null?`<button data-gc="${b.id}.${nc}" title="الأصحاح التالي"><span class="lb">${n(nc)}</span> ←</button>`
    :nb?`<a class="xnav" href="${pageOf(nb.abbr,"/"+nb.abbr+"/ch/1")}" title="السفر التالي"><span class="lb">${SH[nb.abbr]} ${n(1)}</span> ←</a>`
    :`<button disabled>←</button>`;
  const dn=doneOf(vs), refs=vs.reduce((a,x)=>a+refCount(x),0);
  $("#main").innerHTML = crumbs(`${bname(b)} <span>${n(c)}</span>`,`<span class="ltr">${b.en} ${c}</span> · ${n(vs.length)} عددًا · ${n(refs)} شاهدًا · درست ${n(dn)}`,`<div class="nav">${prevBtn}${nextBtn}</div>`) + `
  <div class="chpick">${b.chapters.map(x=>`<button data-gc="${b.id}.${x}" class="chp ${x===c?"active":""}" title="الأصحاح ${n(x)}">${n(x)}</button>`).join("")}</div>
  ${INTER?"":trBar()}<div class="chlink"><button class="trb" id="interBtn">${INTER?"☰ العرض العادي":"≋ عرض كلمة بكلمة (Interlinear)"}</button> <a class="trb" style="text-decoration:none;display:inline-block" href="compare.html?b=${b.abbr}&c=${c}">⇄ مقارنة الترجمات الثلاث لهذا الأصحاح</a></div>${INTER?`<div class="ilist">${vs.map(d=>`<div class="ilv"><button class="ilvn" data-go="${d.b}.${d.c}:${d.v}">${n(d.v)}</button><div class="ilrow" dir="rtl">${interBlock(d)}</div></div>`).join("")}</div>`:""}<div class="cvlist" ${INTER?"hidden":""}>${vs.map(d=>{const k=K(d.b,d.c,d.v),rc=refCount(d);
    return `<button class="cv ${S.done[k]?"done":""} ${S.notes[k]?"has-note":""}" data-go="${d.b}.${d.c}:${d.v}" title="${vref(d)} — افتح تفاصيل العدد">
      <span class="cvn">${n(d.v)}</span><span class="cvt ar" ${trCur()==="kjv"?'dir="ltr" style="text-align:left"':""}>${esc(trText(d)||d.text)}</span><span class="cvm">${rc?n(rc)+" شاهدًا":"—"}${S.done[k]?" ✓":""}</span></button>`}).join("")}</div>
  <div class="chfoot"><div class="nav">${prevBtn}${nextBtn}</div></div>`;
}
function viewVerse(){
  DICT={cur:null,hist:[],trail:[]};
  const b=book(), d=cur(), k=K(d.b,d.c,d.v), gi0=GIDX[k];
  const prev=ALL[gi0-1], next=ALL[gi0+1];
  const lab=x=>x?(x.b!==d.b?SH[BY[x.b].abbr]+" ":"")+n(x.c)+": "+n(x.v):"";
  const me=CAT_ABBR[b.abbr], pb=!prev&&CAT[me.i-1], nb=!next&&CAT[me.i+1];
  const xbtn=(c,cv,arrow,title)=>`<a class="xnav" href="${pageOf(c.abbr,"/"+c.abbr+"/"+cv)}" title="${title}">${arrow==="→"?"→ ":""}<span class="lb">${SH[c.abbr]} ${n(cv.replace(":",": "))}</span>${arrow==="←"?" ←":""}</a>`;
  const groups=d.groups.map((g,gi)=>{
    const ck=k+"|"+gi, closed=!!S.closed[ck];
    return `<section class="group ${closed?"closed":""}" id="g${gi}" data-ck="${ck}">
      <div class="ghead"><h3><em>«</em>${esc(kwTitle(g))}<em>»</em></h3>
        ${g.kw&&trCur()!=="kjv"?`<span class="en ltr" title="الكلمة في TSK">${esc(g.kw)}</span>`:""}
        ${g.refs.length?`<span class="count">${plural(g.refs.length,"شاهد واحد","شاهدان","شواهد","شاهدًا")}</span>`:""}<span class="chev">▾</span></div>
      <div class="gbody">
        ${S.raw?`<div class="raw ltr">${esc(g.raw)}</div>`:""}
        ${(trCur()==="kjv"&&g.note)?`<div class="gnote"><b>TSK note</b><span class="ltr">${esc(g.note)}</span></div>`:g.noteAr?`<div class="gnote"><b>ملاحظة TSK</b>${esc(g.noteAr)}</div>`:(g.note?`<div class="gnote"><b>ملاحظة TSK</b><span class="ltr">${esc(g.note)}</span></div>`:"")}
        <div class="refs">${g.refs.map(r=>refRow(r,`${k}|${gi}|${r.l}`)).join("")}</div>
      </div></section>`}).join("");
  const sameCh=x=>x&&x.b===d.b&&x.c===d.c;
  $("#main").innerHTML = crumbs(`${bname(b)} ${n(d.c)}: <span>${n(d.v)}</span>`,`<span class="ltr">${b.en} ${d.c}:${d.v}</span> · الأصحاح ${n(d.c)} · العدد ${n(d.v)} من ${n(inCh(b,d.c).length)}`,
    `<div class="nav">${pb?xbtn(pb,pb.last,"→","السفر السابق"):`<button data-go="${prev?prev.b+"."+prev.c+":"+prev.v:""}" ${prev?"":"disabled"} title="السابق">→ <span class="lb">${lab(prev)}</span></button>`}${nb?xbtn(nb,"1:1","←","السفر التالي"):`<button data-go="${next?next.b+"."+next.c+":"+next.v:""}" ${next?"":"disabled"} title="التالي"><span class="lb">${lab(next)}</span> ←</button>`}</div>`) + `
    <div class="chlink"><button data-gc="${d.b}.${d.c}">☰ عرض الأصحاح ${n(d.c)} كاملًا</button></div>
    ${trBar()}<div class="verse-card ${store.get("nostr",false)?"nostr":""}">
      <div class="ar">${verseHTML(d)}</div>
      <div class="verse-meta">
        <span class="pill">${plural(d.groups.length,"كلمة واحدة","كلمتان","كلمات","كلمة")}</span>
        <span class="pill">${plural(refCount(d),"شاهد واحد","شاهدان","شواهد","شاهدًا")}</span>
        <span class="pill">${n(verseCount(d))} آية للقراءة</span>${(d.arS&&!trText(d))||trSeg(d)?`<button class="tgl ${store.get("nostr",false)?"":"on"}" id="strTgl">أرقام سترونج</button>`:""}
        <button class="check ${S.done[k]?"on":""}" id="doneBtn">${S.done[k]?"✓ تمت دراسته":"○ علّم كمدروس"}</button>
      </div>
    </div>
    <div class="context">
      ${sameCh(prev)?`<button class="ctx" data-go="${prev.b}.${prev.c}:${prev.v}"><em>${n(prev.v)}</em>${esc(prev.text)}</button>`:""}
      ${sameCh(next)?`<button class="ctx" data-go="${next.b}.${next.c}:${next.v}"><em>${n(next.v)}</em>${esc(next.text)}</button>`:""}
    </div>
    ${dictSection(d)}
    ${d.groups.length>1?`<nav class="kw-index">${d.groups.map((g,gi)=>`<a href="#g${gi}" data-jump="g${gi}">${esc(kwTitle(g))}${g.refs.length?`<b>${n(g.refs.length)}</b>`:""}</a>`).join("")}</nav>`:""}
    ${groups || `<div class="empty">لا توجد شواهد في TSK لهذا العدد (أحيانًا يضم TSK شواهد العدد إلى العدد الذي قبله).</div>`}
    <div class="notes"><h3>ملاحظاتي على ${vref(d)}</h3>
      <textarea id="note" dir="auto" placeholder="اكتب تأملاتك هنا…">${esc(S.notes[k]||"")}</textarea>
      <div class="hint">تُحفظ تلقائيًا في هذا المتصفح.</div></div>`;
}

function refMatch(r,nq){
  const R=refAr(r.l);
  return norm(r.l).includes(nq)||norm(R.name+" "+R.num).includes(nq)||r.vs.some(([vn,t])=>norm(t).includes(nq));
}
function viewSearch(){
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

function viewStarred(){
  const items=[];
  ALL.forEach(d=>d.groups.forEach((g,gi)=>g.refs.forEach(r=>{const k=`${K(d.b,d.c,d.v)}|${gi}|${r.l}`;if(S.stars[k])items.push({d,g,r,k})})));
  $("#main").innerHTML = crumbs(`الشواهد المميزة في <span>${bname(book())}</span>`,plural(items.length,"شاهد واحد محفوظ","شاهدان محفوظان","شواهد محفوظة","شاهدًا محفوظًا")) +
    (items.length?items.map(({d,g,r,k})=>`<div class="item"><div class="from"><span>«${esc(kwTitle(g))}»</span>${fromLink(d)}</div><div class="refs">${refRow(r,k)}</div></div>`).join("")
    :`<div class="empty">لا توجد شواهد مميزة بعد. اضغط ★ بجانب أي شاهد لتجمعه هنا.</div>`);
}

function viewNotes(){
  const items=ALL.filter(d=>(S.notes[K(d.b,d.c,d.v)]||"").trim());
  $("#main").innerHTML = crumbs(`ملاحظاتي في <span>${bname(book())}</span>`,plural(items.length,"عدد واحد عليه ملاحظات","عددان عليهما ملاحظات","أعداد عليها ملاحظات","عددًا عليها ملاحظات")) +
    (items.length?items.map(d=>`<div class="item nitem"><div class="from" style="padding:0"><span class="ar" style="font-size:16px">${esc(d.text)}</span></div><a data-go="${d.b}.${d.c}:${d.v}" style="color:var(--accent);font-weight:600;cursor:pointer;text-decoration:none">${vref(d)} ←</a><div class="body" dir="auto">${esc(S.notes[K(d.b,d.c,d.v)])}</div></div>`).join("")
    :`<div class="empty">لا توجد ملاحظات بعد. اكتب تأملاتك في أسفل أي عدد.</div>`);
}

function render(){
  sidebar();
  ({home:viewHome,book:viewBook,chapter:viewChapter,verse:viewVerse,search:viewSearch,starred:viewStarred,notes:viewNotes})[S.view]();
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
  let m=h.match(/^\/([1-3]?[A-Za-z]{2,3})\/(\d+):(\d+)$/);
  if(m&&BY_ABBR[m[1]]&&BY_ABBR[m[1]].idx[m[2]+":"+m[3]]!=null){const b=BY_ABBR[m[1]];S.b=b.id;S.c=+m[2];S.v=+m[3];S.view="verse";}
  else if((m=h.match(/^\/([1-3]?[A-Za-z]{2,3})\/ch\/(\d+)$/))&&BY_ABBR[m[1]]&&BY_ABBR[m[1]].chapters.includes(+m[2])){S.b=BY_ABBR[m[1]].id;S.c=+m[2];S.view="chapter";}
  else if((m=h.match(/^\/([1-3]?[A-Za-z]{2,3})$/))&&BY_ABBR[m[1]]){S.b=BY_ABBR[m[1]].id;S.view="book";}
  else if(["starred","notes"].includes(h)) S.view=h;
  else S.view="book";
  render();
}
window.addEventListener("popstate",fromHash);

document.addEventListener("click",e=>{
  const sr=e.target.closest(".sref"); if(sr){ if($("#dict")) showEntry(sr.dataset.sn,{fromRef:true}); return }
  if(e.target.closest("#dback")){const p=DICT.trail.pop(); DICT.cur=p; $("#dict").innerHTML=dictInner(); return}
  const dn=e.target.closest("[data-dn]"); if(dn){showEntry(dn.dataset.dn,{scroll:false});return}
  {const sn=e.target.closest(".verse-card span.sn");if(sn&&!e.target.closest(".verse-card.nostr")){showEntry(sn.dataset.sn);return}}
  const sw=e.target.closest(".verse-card .sw"); if(sw&&!e.target.closest(".verse-card.nostr")){showEntry(sw.dataset.n.split(" ")[0]);return}
  if(e.target.closest("#strTgl")){const vc=document.querySelector(".verse-card");const off=!vc.classList.contains("nostr");vc.classList.toggle("nostr",off);e.target.closest("#strTgl").classList.toggle("on",!off);store.set("nostr",off);return}
  const tb=e.target.closest("[data-tr]"); if(tb){store.set("tr",tb.dataset.tr);render();return}
  if(e.target.closest("#interBtn")){store.set("inter",!store.get("inter",false));render();return}
  const gc=e.target.closest("[data-gc]"); if(gc){const p=gc.dataset.gc.split("."); goChapter(+p[0],+p[1]); return}
  const g=e.target.closest("[data-go]");
  if(g&&g.dataset.go){const p=parseGo(g.dataset.go); if(p) go(...p); return}
  const bk=e.target.closest("[data-book]"); if(bk){openBook(+bk.dataset.book);return}
  if(e.target.closest("#menu")||e.target.closest("#sideClose")){
    if(innerWidth>880){const a=document.querySelector(".app");a.classList.toggle("collapsed");store.set("sideOff",a.classList.contains("collapsed"));}
    else $("#side").classList.toggle("open");
    return}
  const sh=e.target.closest("#side .sh"); if(sh){const sec=sh.closest("[data-sec]");sec.classList.toggle("shut");const o=store.get("shut",{});if(sec.classList.contains("shut"))o[sec.dataset.sec]=1;else delete o[sec.dataset.sec];store.set("shut",o);return}
  const j=e.target.closest("[data-jump]"); if(j){e.preventDefault();document.getElementById(j.dataset.jump).scrollIntoView({behavior:"smooth"});return}
  const ch=e.target.closest("#chgrid button"); if(ch){S.c=+ch.dataset.ch;sidebar();return}
  const vb=e.target.closest("#vlist button"); if(vb){go(S.b,S.c,+vb.dataset.v);return}
  const sc=e.target.closest("[data-scope]"); if(sc){S.scope=sc.dataset.scope;S.limit=60;viewSearch();return}
  const h=e.target.closest(".ghead"); if(h){const s=h.parentElement;s.classList.toggle("closed");if(s.classList.contains("closed"))S.closed[s.dataset.ck]=true;else delete S.closed[s.dataset.ck];store.set("closed",S.closed);return}
  const st=e.target.closest(".star"); if(st){const row=st.closest(".r"),k=row.dataset.key;if(S.stars[k])delete S.stars[k];else S.stars[k]=1;store.set("stars",S.stars);st.classList.toggle("on");row.classList.toggle("starred");sidebar();if(S.view==="starred")viewStarred();return}
  if(e.target.closest("#doneBtn")){const d=cur(),k=K(d.b,d.c,d.v);if(S.done[k])delete S.done[k];else S.done[k]=true;store.set("done",S.done);render();return}
  if(e.target.closest("#more")){S.limit+=60;viewSearch();return}
});
document.addEventListener("input",e=>{
  if(e.target.id==="note"){const d=cur(),k=K(d.b,d.c,d.v);if(e.target.value.trim())S.notes[k]=e.target.value;else delete S.notes[k];store.set("notes",S.notes);sidebar()}
});
$("#home").addEventListener("click",()=>{location.href="index.html"});
$("#starredView").addEventListener("click",()=>show("starred"));
$("#notesView").addEventListener("click",()=>show("notes"));
function setAll(closed){ if(S.view!=="verse")return; const d=cur(),k=K(d.b,d.c,d.v); d.groups.forEach((g,gi)=>{if(closed)S.closed[k+"|"+gi]=true;else delete S.closed[k+"|"+gi]}); store.set("closed",S.closed); render(); }
$("#expandAll").addEventListener("click",()=>setAll(false));
$("#collapseAll").addEventListener("click",()=>setAll(true));
$("#toggleRaw").addEventListener("click",()=>{S.raw=!S.raw;store.set("raw",S.raw);render()});
$("#themeBtn").addEventListener("click",()=>{
  const c=document.documentElement.dataset.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
  const nx=c==="dark"?"light":"dark";document.documentElement.dataset.theme=nx;store.set("theme",nx);
});
const th=store.get("theme",null); if(th) document.documentElement.dataset.theme=th;
/* RTL: the left arrow moves forward, the right arrow moves back */
document.addEventListener("keydown",e=>{
  if(e.target.matches("input,textarea")||S.view!=="verse")return;
  const d=cur(), i=GIDX[K(d.b,d.c,d.v)];
  if(e.key==="ArrowLeft"&&ALL[i+1]){const x=ALL[i+1];go(x.b,x.c,x.v)}
  if(e.key==="ArrowRight"&&ALL[i-1]){const x=ALL[i-1];go(x.b,x.c,x.v)}
  const me=CAT_ABBR[book().abbr];
  if(e.key==="ArrowLeft"&&!ALL[i+1]&&CAT[me.i+1]){const c=CAT[me.i+1];location.href=pageOf(c.abbr,"/"+c.abbr+"/1:1")}
  if(e.key==="ArrowRight"&&!ALL[i-1]&&CAT[me.i-1]){const c=CAT[me.i-1];location.href=pageOf(c.abbr,"/"+c.abbr+"/"+c.last)}
});
(function(){const o=store.get("shut",{});document.querySelectorAll("#side [data-sec]").forEach(s=>{if(o[s.dataset.sec])s.classList.add("shut")});
  if(store.get("sideOff",false)&&innerWidth>880)document.querySelector(".app").classList.add("collapsed");})();
fromHash();
