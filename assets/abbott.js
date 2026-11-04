/* قاموس أبوت-سميث (Abbott-Smith, A Manual Greek Lexicon of the NT, 1922 — ملكية عامة)
   يضيف قسمًا ثالثًا داخل لوحة «قاموس سترونج» لكل كلمة يونانية.
   البيانات: assets/abbott/lemmas.js (الكلمة ← الرقم، للإحالات) + assets/abbott/c<رقم÷100>.js (المداخل نفسها)
   كل ملف بيتحمّل بس لما القارئ يفتح كلمة منه. يُبنى بـ _tools/abbott/build_site.py
   لا يغيّر app.js: يلفّ الدالة dentHTML فقط. */
(function(){
  if(typeof window.dentHTML!=="function") return;
  const BASE = "assets/abbott/";
  const A = window.ABBOTT = window.ABBOTT || {D:{}, got:{}};

  /* أسماء الأسفار: OSIS → اختصار الموقع */
  const OS={Gen:"Gen",Exod:"Exo",Lev:"Lev",Num:"Num",Deut:"Deu",Josh:"Jos",Judg:"Jdg",Ruth:"Rut","1Sam":"1Sa","2Sam":"2Sa","1Kgs":"1Ki","1Ki":"1Ki","2Kgs":"2Ki","1Chr":"1Ch","2Chr":"2Ch",Ezra:"Ezr",Neh:"Neh",Esth:"Est",Job:"Job",Ps:"Psa",Prov:"Pro",Eccl:"Ecc",Song:"Son",Isa:"Isa",Jer:"Jer",Lam:"Lam",Ezek:"Eze",Dan:"Dan",Hos:"Hos",Joel:"Joe",Amos:"Amo",Obad:"Oba",Jonah:"Jon",Mic:"Mic",Nah:"Nah",Hab:"Hab",Zeph:"Zep",Hag:"Hag",Zech:"Zec",Mal:"Mal",
    Matt:"Mat",Mark:"Mar",Luke:"Luk",John:"Joh",Acts:"Act",Rom:"Rom","1Cor":"1Co","2Cor":"2Co",Gal:"Gal",Eph:"Eph",Phil:"Phi",Col:"Col","1Thess":"1Th","2Thess":"2Th","1Tim":"1Ti","2Tim":"2Ti",Titus:"Tit",Phlm:"Phm",Heb:"Heb",Jas:"Jam","1Pet":"1Pe","2Pet":"2Pe","1John":"1Jo","2John":"2Jo","3John":"3Jo",Jude:"Jud",Rev:"Rev"};
  /* الأسفار القانونية الثانية (بدون رابط في الموقع) */
  const APO={Sir:["سي","يشوع بن سيراخ"],SirP:["مقدمة سي","مقدمة يشوع بن سيراخ"],Wis:["حك","الحكمة"],Tob:["طو","طوبيا"],Jdt:["يهو","يهوديت"],Bar:["با","باروخ"],"1Macc":["١مك","المكابيين الأول"],"2Macc":["٢مك","المكابيين الثاني"],"3Macc":["٣مك","المكابيين الثالث"],"4Macc":["٤مك","المكابيين الرابع"],"1Esd":["١إس","عزرا الأول (إسدراس)"],"2Esd":["٢إس","عزرا الثاني (إسدراس)"],Man:["صل منسى","صلاة منسى"],AddEsth:["تتمة أس","تتمة أستير"],Sus:["سوسنة","سوسنة"],Bel:["بال","بال والتنين"]};
  const ARD="٠١٢٣٤٥٦٧٨٩", nn=x=>String(x).replace(/\d/g,d=>ARD[d]);
  const ABJ={a:"أ",b:"ب",c:"ج",d:"د",e:"هـ",f:"و",g:"ز",h:"ح"};
  const senseN=s=>s.replace(/^\(([a-h])\)$/,(m,l)=>"("+ABJ[l]+")").replace(/\d/g,d=>ARD[d]);
  const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");

  function refLabel(v,ar){
    let lxx=false; if(v.startsWith("LXX:")){lxx=true;v=v.slice(4)}
    const [a,b]=v.split("-"); const p=a.split("."), bk=p[0], c=p[1], vs=p[2];
    let q=b?b.split("."):null; if(q&&q[0]!==bk) q=null;
    const site=OS[bk], apo=APO[bk];
    let name, full;
    if(ar){ name=site?(typeof SH!=="undefined"?SH[site]:site):apo?apo[0]:bk; full=site?(typeof AR!=="undefined"?AR[site]:site):apo?apo[1]:bk; }
    else { name=bk; full=bk; }
    const N=ar?nn:(x=>x);
    let cv=c?(vs?N(c)+(ar?": ":":")+N(vs):N(c)):"";
    if(q){ cv+= (q[1]!==c? "–"+N(q[1])+(ar?": ":":")+N(q[2]) : "–"+N(q[2])); }
    const lab=(name+" "+cv).trim()+(lxx?(ar?" (السبعينية)":" (LXX)"):"");
    let href="";
    if(site && c && !lxx){
      const h="/"+site+"/"+c+":"+(vs||1);
      const cur=(typeof book==="function"&&book())||null;
      if(cur && cur.abbr===site) return `<a class="asr" data-go="${cur.id}.${c}:${vs||1}" title="${esc(full)}">${lab}</a>`;
      href=(typeof pageOf==="function"?pageOf(site,h):site+".html#"+h);
      return `<a class="asr" href="${href}" title="${esc(full)}">${lab}</a>`;
    }
    return `<span class="asr nolink" title="${esc(full)}">${lab}</span>`;
  }

  function render(src,ar){
    const L=(window.ABBOTT&&window.ABBOTT.L)||{}, D=(window.ABBOTT&&window.ABBOTT.D)||{};
    return src
      .replace(/<r v="([^"]*)"><\/r>/g,(m,v)=>refLabel(v,ar))
      .replace(/<x>(.*?)<\/x>/g,(m,inner)=>{const lem=inner.replace(/<[^>]+>/g,"").trim(),g=L[lem];
        return g&&D[g]?`<span class="sref asx" data-sn="${g}" title="افتح ${g}">${inner}</span>`:`<span class="asx">${inner}</span>`})
      .replace(/<g>/g,'<span class="as-gk" lang="grc" dir="ltr">').replace(/<\/g>/g,"</span>")
      .replace(/<h n="(H\d+[a-z]?)">/g,'<span class="sref as-he" data-sn="$1" lang="he" dir="rtl" title="سترونج $1">').replace(/<h( n="[^"]*")?>/g,'<span class="as-he" lang="he" dir="rtl">').replace(/<\/h>/g,"</span>")
      .replace(/<l>/g,'<span class="as-la" dir="ltr">').replace(/<\/l>/g,"</span>")
      .replace(/<o>/g,'<span class="as-hw" lang="grc" dir="ltr">').replace(/<\/o>/g,"</span>")
      .replace(/<s n="([^"]*)">/g,(m,k)=>`<div class="as-s"><span class="as-n">${ar?senseN(k):k}</span> `).replace(/<s>/g,'<div class="as-s0">').replace(/<\/s>/g,"</div>")
      .replace(/<b>/g,'<b class="as-gl">')
      .replace(/<f>/g,'<div class="as-f">').replace(/<\/f>/g,"</div>")
      .replace(/<et>/g,'<div class="as-et">').replace(/<\/et>/g,"</div>")
      .replace(/<e t="([^"]*)">/g,'<span class="as-e as-$1">').replace(/<\/e>/g,"</span>")
      .replace(/<sy>/g,'<div class="as-sy">').replace(/<\/sy>/g,"</div>")
      .replace(/<hr>/g,'<hr class="as-hr">');
  }

  function boxInner(num){
    const e=window.ABBOTT.D[num];
    if(!e) return `<div class="dent"><div class="hd"><span class="num">${num}</span></div><p class="na">لا يوجد مدخل لهذه الكلمة في قاموس أبوت-سميث بعد.</p></div>`;
    const occ=e.o?`<span class="tr">ترد ${nn(e.o)} مرة في العهد الجديد</span>`:"";
    const body=e.ar?render(e.ar,true):`<span class="na">ترجمة هذا المدخل غير متاحة بعد.</span>`;
    return `<div class="dent"><div class="hd"><span class="num">${num}</span><span class="orig" lang="grc" dir="ltr">${esc(e.l||"")}</span>${occ}
        <button type="button" class="as-en-t" data-asen>النص الإنجليزي الأصلي</button></div>
      <div class="as-body ar" dir="rtl">${body}</div>
      <div class="as-en" dir="ltr" hidden>${render(e.en,false)}</div>
      <button type="button" class="as-more" hidden>اقرأ المدخل كاملًا ↓</button>
      <p class="as-src">† في أول المدخل: الكلمة لا ترد عند كتّاب اليونانية الكلاسيكية · † في آخره: ذُكرت كل مواضعها في العهد الجديد · * : الكلمة لا ترد في السبعينية.<br>المصدر: G. Abbott-Smith, <i>A Manual Greek Lexicon of the New Testament</i> (1922) — ملكية عامة. الترجمة العربية: جدد وعتقاء.</p></div>`;
  }
  function fit(root){
    (root||document).querySelectorAll(".asbox .as-body:not([data-fit])").forEach(b=>{
      b.dataset.fit="1"; const more=b.closest(".dent").querySelector(".as-more");
      if(b.scrollHeight>b.clientHeight+20){ b.classList.add("cut"); more.hidden=false; }
      else b.classList.remove("clip");
    });
  }
  const chunkOf=num=>Math.floor(parseInt(num.slice(1),10)/100);
  const ready=num=>A.L && A.got[chunkOf(num)];
  function fill(){
    document.querySelectorAll("section.asbox[data-asn]").forEach(x=>{const num=x.dataset.asn;if(!ready(num))return;x.removeAttribute("data-asn");
      const box=x.querySelector(".asin");box.innerHTML=boxInner(num);const b=box.querySelector(".as-body");if(b)b.classList.add("clip"); });
    fit();
  }
  const LOADING={};
  function load(src,done){
    if(LOADING[src]) return; LOADING[src]=1;
    const s=document.createElement("script"); s.src=src;
    s.onload=()=>{done&&done();fill()};
    s.onerror=()=>{delete LOADING[src];document.querySelectorAll("section.asbox[data-asn] .asin").forEach(x=>x.innerHTML=`<p class="na">تعذّر تحميل قاموس أبوت-سميث — غالبًا الجهاز غير متصل بالإنترنت.</p>`)};
    document.body.appendChild(s);
  }
  function need(num){
    if(ready(num)) { setTimeout(fill); return; }
    if(!A.L) load(BASE+"lemmas.js");
    const c=chunkOf(num); if(!A.got[c]) load(BASE+"c"+c+".js");
  }

  /* قسم مستقل تحت قسم «قاموس سترونج» مباشرة، بنفس شكله.
     بيراقب الصفحة: كل ما قسم سترونج يعرض كلمة يونانية، القسم ده يعرض نفس الكلمة. */
  const HEAD=`<div class="dhead"><h3><em>«</em>قاموس أبوت-سميث<em>»</em></h3><small class="as-sub">معجم يوناني للعهد الجديد (١٩٢٢) — المعاني والشواهد</small></div><div class="asin"></div>`;
  const isSheet=sec=>sec.classList.contains("uxt-dsheet");   /* على الموبايل قسم سترونج بيبقى bottom sheet */
  function okPlace(as){
    const par=as.parentElement, prev=as.previousElementSibling;
    if(par&&par.matches("section.dict:not(.asbox)")&&isSheet(par)) return true;
    return !!(prev&&prev.matches("section.dict:not(.asbox)")&&!isSheet(prev));
  }
  function slotFor(sec){
    const inSheet=isSheet(sec);
    let as=inSheet?sec.querySelector(":scope > section.asbox"):(sec.nextElementSibling&&sec.nextElementSibling.matches("section.asbox")?sec.nextElementSibling:null);
    if(!as){ as=document.createElement("section"); as.className="asbox"; as.hidden=true; as.innerHTML=HEAD; inSheet?sec.append(as):sec.after(as); }
    as.classList.toggle("dict",!inSheet); as.classList.toggle("as-insheet",inSheet);
    if(!inSheet&&sec.style.marginTop) as.style.marginTop="18px";
    return as;
  }
  function sync(){
    document.querySelectorAll("section.asbox").forEach(x=>{if(!okPlace(x))x.remove()});
    document.querySelectorAll("section.dict:not(.asbox)").forEach(sec=>{
      const nEl=sec.querySelector(":scope > .dent > .hd > .num"), num=nEl?nEl.textContent.trim():"";
      if(!/^G\d/.test(num)){
        const ex=isSheet(sec)?sec.querySelector(":scope > section.asbox"):sec.nextElementSibling;
        if(ex&&ex.matches("section.asbox")){ex.hidden=true;ex.dataset.cur=""}
        return;
      }
      const as=slotFor(sec); as.hidden=false;
      if(as.dataset.cur===num) return;
      as.dataset.cur=num; as.dataset.asn=num;
      as.querySelector(".asin").innerHTML=`<div class="empty loading">جارٍ تحميل قاموس أبوت-سميث…</div>`;
      need(num);
    });
  }
  let queued=false;
  new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;sync()})}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:["class"]});
  sync();

  document.addEventListener("click",e=>{
    const t=e.target.closest&&e.target.closest("[data-asen]");
    if(t){const box=t.closest(".dent"),en=box.querySelector(".as-en"),ar=box.querySelector(".as-body"),more=box.querySelector(".as-more");
      const showEn=en.hidden; en.hidden=!showEn; ar.hidden=showEn; if(more) more.hidden=showEn||!ar.classList.contains("cut");
      t.textContent=showEn?"الترجمة العربية":"النص الإنجليزي الأصلي"; return}
    const m=e.target.closest&&e.target.closest(".as-more");
    if(m){const b=m.closest(".dent").querySelector(".as-body");b.classList.remove("clip","cut");m.hidden=true}
  });

  const css=`
.asbox [hidden]{display:none!important}
section.asbox[hidden]{display:none!important}
.asbox.as-insheet{margin-top:18px;padding-top:16px;border-top:2px solid var(--line)}
.asbox .as-sub{font:12px var(--ui);color:var(--muted)}
.asbox .dent .hd .as-en-t{margin-inline-start:auto}
.asbox .as-body{margin-top:12px}
.asbox .as-en-t,.asbox .as-more{font:13px var(--ui);background:none;border:1px solid var(--line);border-radius:999px;padding:4px 12px;color:inherit;cursor:pointer}
.asbox .as-more{display:block;margin:8px auto 0}
.asbox .as-body{font:18px/1.95 var(--script)}
.asbox .as-body.clip{max-height:22em;overflow:hidden}
.asbox .as-body.cut{-webkit-mask-image:linear-gradient(#000 75%,transparent);mask-image:linear-gradient(#000 75%,transparent)}
.asbox .as-en{font:15px/1.8 "Noto Serif",Georgia,serif;text-align:left}
.asbox .as-f{margin-bottom:6px}
.asbox .as-hw{font-size:1.25em;font-weight:600}
.asbox .as-gk{unicode-bidi:isolate;font-family:"Gentium Plus","Noto Serif",serif}
.asbox .as-he{unicode-bidi:isolate;font-family:"SBL Hebrew","Ezra SIL","Noto Serif Hebrew",serif}
.asbox .as-he.sref{cursor:pointer;border-bottom:1px dotted var(--accent)}
.asbox .as-la{unicode-bidi:isolate;font-style:italic}
.asbox .as-et{color:var(--muted);font-size:.92em;margin-bottom:6px}
.asbox .as-s,.asbox .as-s0{margin:4px 0}
.asbox .as-s .as-s{margin-inline-start:1.2em}
.asbox .as-n{font-weight:700;color:var(--accent)}
.asbox .as-gl{color:var(--accent)}
.asbox .as-sy{margin-top:10px;padding:8px 12px;border-inline-start:3px solid var(--line);font-size:.95em}
.asbox .asx.sref{cursor:pointer;border-bottom:1px dotted var(--accent)}
.asbox a.asr{white-space:nowrap;cursor:pointer;color:var(--accent);text-decoration:none;border-bottom:1px dotted}
.asbox .asr.nolink{white-space:nowrap;color:var(--muted)}
.asbox .as-hr{border:0;border-top:1px dashed var(--line);margin:12px 0}
@media (max-width:880px){.asbox .as-body{font-size:17px}}`;
  const st=document.createElement("style"); st.textContent=css; document.head.appendChild(st);
})();
