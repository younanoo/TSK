/* محرك تخطيط الشرائح المشترك بين العرض بملء الشاشة (present.js) والشاشة الخارجية (screen.html):
   أكبر حجم خط يدخل في المساحة، وتقسيم الآية الطويلة جدًا على ٢–٣ شرائح عند علامة ترقيم أو مسافة.
   المقاطع: [نص، [أرقام سترونج]]. لا يعتمد على app.js. */
(function(){
  "use strict";
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  function split(a,n){
    const cand=[];let pos=0;
    const V=x=>x&&x[1][0]==="@v";   /* رقم آية داخل شريحة فيها أكتر من آية */
    a.forEach((x,i)=>{pos+=x[0].length;if(!x[1].length&&/\s/.test(x[0])&&i>0&&i<a.length-1&&!V(a[i-1]))cand.push({i,pos,p:V(a[i+1])||/[،؛:.,;!?؟»]\s*$/.test(a[i-1][0])||/^[،؛:.,;!?؟»]/.test(x[0])})});
    const L=pos,cuts=[];
    for(let k=1;k<n;k++){const tg=L*k/n;let best=null,bd=1e9;
      for(const c of cand){if(cuts.length&&c.i<=cuts[cuts.length-1])continue;const dd=Math.abs(c.pos-tg)-(c.p?L*.12:0);if(dd<bd){bd=dd;best=c}}
      if(best)cuts.push(best.i)}
    const out=[];let s0=0;cuts.forEach(i=>{out.push(a.slice(s0,i));s0=i+1});out.push(a.slice(s0));return out.filter(x=>x.length)}
  function fit(stage,txt,html){
    txt.innerHTML=html;const cs=getComputedStyle(stage),W=stage.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),H=stage.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
    let lo=14,hi=Math.min(160,Math.max(28,W/6)),best=lo;
    for(let i=0;i<14;i++){const m=(lo+hi)/2;txt.style.fontSize=m+"px";if(txt.scrollHeight<=H+1&&txt.scrollWidth<=Math.ceil(W)+1){best=m;lo=m}else hi=m}
    return best}
  function layout(stage,txt,a,htmlOf,minOk){let p=[a];
    for(const n of [1,2,3]){p=n===1?[a]:split(a,n);const sz=Math.min(...p.map(x=>fit(stage,txt,htmlOf(x))));if(sz>=minOk||n===3)return {p,sz}}}
  const minOk=small=>small?22:Math.max(34,innerHeight/22);
  /* HTML المقاطع: نص عادي، أو كلمات بأرقام سترونج (نفس شكل segHTML في app.js) */
  const html=(a,str)=>a.map(([t,ns])=>ns[0]==="@v"?`<sup class="pres-vn">${esc(t)}</sup>`:str&&ns.length?`<span class="sw" data-n="${ns.join(" ")}">${esc(t)}<sup>${ns.map(x=>`<span class="sn" data-sn="${x}">${x}</span>`).join(" ")}</sup></span>`:esc(t)).join("");
  /* شريحة من ١ أو ٣ أو ٥ آيات (من نفس الأصحاح): group = أرقام الآيات في الشريحة، prevStart = بداية الشريحة السابقة،
     join = دمج مقاطع الآيات مع رقم صغير قبل كل آية (لو أكتر من آية) */
  const N=k=>[1,3,5].includes(+k)?+k:1;
  function group(list,idx,k){k=N(k);const c=list[idx].c,out=[];for(let i=idx;i<list.length&&out.length<k&&list[i].c===c;i++)out.push(i);return out}
  function prevStart(list,idx,k){k=N(k);if(idx<=0)return -1;const c=list[idx-1].c;let s=idx-1,m=1;while(m<k&&s>0&&list[s-1].c===c){s--;m++}return s}
  function join(gs){if(gs.length===1)return gs[0][0];const out=[];gs.forEach(([a,v],i)=>{if(i)out.push([" ",[]]);out.push([v,["@v"]],["\u00a0",[]]);a.forEach(x=>out.push(x))});return out}
  /* الانتقال بالكتابة: «12» = العدد ١٢ في نفس الأصحاح، «3:16» = أصحاح ٣ عدد ١٦. key = الحرف المكتوب (يقبل الأرقام العربية) أو "" */
  /* buf = المكتوب لحد دلوقتي: الحروف (لاسم السفر) والمسافة تتقبل؛ B/b في الأول = شاشة سوداء، والمسافة في الأول = التالي */
  const jkey=(k,buf)=>{buf=buf||"";if(k.length!==1)return "";const i="٠١٢٣٤٥٦٧٨٩".indexOf(k);if(i>=0)return String(i);if(/[0-9]/.test(k))return k;if(k===":"||k==="/"||k==="؛")return ":";
    if(k===" ")return buf&&!/\s$/.test(buf)?" ":"";if(/[\u0621-\u064Aa-zA-Z]/.test(k))return !buf&&(k==="b"||k==="B")?"":k;return ""};
  function find(list,idx,str){const m=String(str).match(/^(?:(\d+):)?(\d+)$/);if(!m)return -1;const c=m[1]?+m[1]:list[idx].c,v=+m[2];return list.findIndex(d=>d.c===c&&d.v===v)}
  /* ---- سفر تاني غير سفر الصفحة (للانتقال بـ «يو ٣:١٦» أثناء العرض): النص من assets/tx/<ترجمة>_<سفر>.js
     وأرقام سترونج لفاندايك من assets/sg/svd_<سفر>.js — بدون تحميل الصفحة. (يحتاج app.js: loadJS / CAT / LOADED) ---- */
  const FB={};
  function foreign(abbr,cb){
    if(FB[abbr]){cb(FB[abbr]);return}
    const cat=CAT.find(x=>x.abbr===abbr);if(!cat){cb(null);return}
    const unpack=a=>a.map(x=>typeof x==="string"?[x,[]]:[x[0],x[1].split(" ")]);
    const need=src=>{if(LOADED[src]===undefined)loadJS(src,()=>{});return LOADED[src]===true};
    loadJS(`assets/tx/svd_${abbr}.js`,()=>{const T=window.TXB["svd/"+abbr];if(!T){cb(null);return}
      const list=Object.keys(T).map(k=>{const p=k.split(":");return {b:cat.id,c:+p[0],v:+p[1]}}).sort((a,b)=>a.c-b.c||a.v-b.v);
      FB[abbr]={abbr,list,foreign:true,segs(d,str,tr){
        if(str&&tr==="svd"){const f=`assets/sg/svd_${abbr}.js`,S=window.SG&&window.SG["svd/"+abbr];
          if(S){const a=S[d.c+":"+d.v];if(a)return unpack(a)}else if(!need(f))return null}
        const f=`assets/tx/${tr}_${abbr}.js`,t=window.TXB[tr+"/"+abbr];if(!t){if(!need(f))return null;return [["—",[]]]}
        return String(t[d.c+":"+d.v]||"—").split(/(\s+)/).filter(Boolean).map(x=>[x,[]])}};
      cb(FB[abbr])})}
  /* المكتوب في خانة الانتقال → cb(src, index) ؛ index = -1 لو مش موجود. src = المصدر الحالي، cur = سفر الصفحة */
  function resolve(str,src,idx,cur,cb){
    const s=String(str).trim().replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[/؛]/g,":");
    const local=s.replace(/\s+/g,"");
    if(/^(\d+:)?\d+$/.test(local)){cb(src,find(src.list,idx,local));return}
    const r=typeof parseRef==="function"?parseRef(s):null;if(!r){cb(src,-1);return}
    const at=x=>x.list.findIndex(d=>d.c===r.c&&d.v===r.v);
    if(r.abbr===src.abbr){cb(src,at(src));return}
    if(r.abbr===cur.abbr){cb(cur,at(cur));return}
    foreign(r.abbr,x=>x?cb(x,at(x)):cb(src,-1))}
  /* ---- الترجمات الثلاث مع بعض (شريحة آية واحدة): النص من assets/tx/<ترجمة>_<سفر>.js لأي سفر ---- */
  const TRI=[["svd","فاندايك","rtl"],["alab","كتاب الحياة","rtl"],["kjv","KJV","ltr"]];
  function tri(abbr,d,dia){   /* null = لسه بيتحمّل. dia(d,ترجمة) = النص المشكّل (من app.js: diaTextOf) لو التشكيل شغال */
    let wait=false;const out=TRI.map(([k,l,dir])=>{
      if(dia&&k!=="kjv"){const x=dia(d,k);if(x===null){wait=true;return null}if(x)return {l,dir,t:x}}
      const t=window.TXB[k+"/"+abbr],f=`assets/tx/${k}_${abbr}.js`;
      if(!t){if(LOADED[f]===undefined){loadJS(f,()=>{});wait=true}else if(LOADED[f]!==true)wait=true;return null}
      const s=t[d.c+":"+d.v];return s?{l,dir,t:s}:null});
    return wait?null:out.filter(Boolean)}
  const triHtml=items=>`<div class="pres-tri">${items.map(x=>`<div class="pt" dir="${x.dir}" lang="${x.dir==="ltr"?"en":"ar"}"><span class="pt-l">${esc(x.l)}</span>${esc(x.t)}</div>`).join("")}</div>`;
  /* ---- بين السطور: الشريحة = سطر النص العربي + خانات الكلمات (من ilSlide في app.js). الآية الطويلة تتقسم على شرائح بعدد الخانات ---- */
  const ilHtml=(sl,cells)=>`<div class="pres-il"><div class="pil-ar">${esc(sl.ar||"")}</div><div class="ilrow pil-row" dir="${sl.dir}">${cells.join("")}</div></div>`;
  function ilLayout(stage,txt,sl,minOk){const c=sl.cells;let p=[c];
    for(let n=1;n<=6;n++){if(n>c.length)break;const k=Math.ceil(c.length/n);p=[];for(let i=0;i<c.length;i+=k)p.push(c.slice(i,i+k));
      const sz=Math.min(...p.map(x=>fit(stage,txt,ilHtml(sl,x))));if(sz>=minOk||n===6)return {p,sz}}
    return {p,sz:fit(stage,txt,ilHtml(sl,p[0]))}}
  const ar=s=>String(s).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
  /* هل الجهاز متوصل بشاشة تانية على وضع Extend (توسيع)؟ كروم وإيدج بيقولوا (screen.isExtended، من غير إذن)؛
     فايرفوكس وسفاري مش بيقولوا ← false، فزرار «العرض على شاشة خارجية» مش بيظهر فيهم. watch: يتنادى لما شاشة تتوصل أو تتفصل.
     (app.js فيه نفس الشرط في extOK لأنه بيرسم الزرار قبل ما الملف ده يتحمّل) */
  const ext={ok:()=>!!(window.screen&&screen.isExtended===true)&&matchMedia("(pointer:fine)").matches,
    watch(fn){try{window.screen&&screen.addEventListener&&screen.addEventListener("change",fn)}catch(_){}}};
  window.PRESFIT={ext,split,fit,layout,minOk,html,esc,N,group,prevStart,join,jkey,find,ar,foreign,resolve,tri,triHtml,ilHtml,ilLayout};
})();
