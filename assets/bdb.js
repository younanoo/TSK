/* قاموس براون-درايفر-بريجز (BDB — A Hebrew and English Lexicon of the Old Testament, 1906 — ملكية عامة)
   النسخة الرقمية: Open Scriptures Hebrew Bible Project — HebrewLexicon (CC BY 4.0)
   يضيف قسمًا مستقلًا تحت قسم «قاموس سترونج» لكل كلمة عبرية (أرقام H).
   البيانات: assets/bdb/c<رقم÷100>.js ← window.BDB.D[H..]={o,en,ar} (يُبنى بـ _tools/bdb/build_site.py)
   لا يغيّر app.js: يراقب قسم سترونج ويعرض نفس الكلمة (مثل abbott.js). */
(function(){
  if(typeof window.dentHTML!=="function") return;
  const BASE = "assets/bdb/";
  const VER = window.BDB_VER || "4";              /* يتغيّر مع كل بناء للبيانات */
  const MODE = window.BDB_MODE || "short";      /* "short" = نسخة مختصرة */
  const KEY="bdb_open";
  const getOpen=()=>{try{return localStorage.getItem(KEY)!=="0"}catch(e){return true}};
  const setOpen=v=>{try{localStorage.setItem(KEY,v?"1":"0")}catch(e){}};

  const OS={Gen:"Gen",Exod:"Exo",Lev:"Lev",Num:"Num",Deut:"Deu",Josh:"Jos",Judg:"Jdg",Ruth:"Rut","1Sam":"1Sa","2Sam":"2Sa","1Kgs":"1Ki","2Kgs":"2Ki","1Chr":"1Ch","2Chr":"2Ch",Ezra:"Ezr",Neh:"Neh",Esth:"Est",Job:"Job",Ps:"Psa",Prov:"Pro",Eccl:"Ecc",Song:"Son",Isa:"Isa",Jer:"Jer",Lam:"Lam",Ezek:"Eze",Dan:"Dan",Hos:"Hos",Joel:"Joe",Amos:"Amo",Obad:"Oba",Jonah:"Jon",Mic:"Mic",Nah:"Nah",Hab:"Hab",Zeph:"Zep",Hag:"Hag",Zech:"Zec",Mal:"Mal",
    Matt:"Mat",Mark:"Mar",Luke:"Luk",John:"Joh",Acts:"Act",Rom:"Rom","1Cor":"1Co","2Cor":"2Co",Gal:"Gal",Eph:"Eph",Phil:"Phi",Col:"Col","1Thess":"1Th","2Thess":"2Th","1Tim":"1Ti","2Tim":"2Ti",Titus:"Tit",Phlm:"Phm",Heb:"Heb",Jas:"Jam","1Pet":"1Pe","2Pet":"2Pe","1John":"1Jo","2John":"2Jo","3John":"3Jo",Jude:"Jud",Rev:"Rev"};
  const ARD="٠١٢٣٤٥٦٧٨٩", nn=x=>String(x).replace(/\d/g,d=>ARD[d]);
  const ABJ={a:"أ",b:"ب",c:"ج",d:"د",e:"هـ",f:"و",g:"ز",h:"ح",i:"ط",k:"ي"};
  const ROM={I:"أولًا",II:"ثانيًا",III:"ثالثًا",IV:"رابعًا",V:"خامسًا",VI:"سادسًا"};
  const senseN=s=>ROM[s]||(ABJ[s]?"("+ABJ[s]+")":nn(s));
  const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");

  /* الأوزان العبرية */
  const STEM={"Qal":"قال","Qal pass":"قال المبني للمجهول","Niph":"نِفعال","Pi":"بيعيل","Piel":"بيعيل","Pu":"بوعال","Pual":"بوعال","Hiph":"هِفعيل","Hoph":"هُفعال",
    "Hithp":"هِتفعّيل","Hithpa":"هِتفعّيل","Hothp":"هُتفعّال","Pilp":"بِلبيل","Polp":"بُلبال","Hithpalp":"هِتبلبيل",
    "Po":"بوعيل","Pō‛el":"بوعيل","Pô‛el":"بوعيل","Pō‛l":"بوعيل","Po‛lel":"بوعليل","Pô‛lēl":"بوعليل",
    "Hithpo":"هِتبوعيل","Hithpol":"هِتبوعليل","Hithpō‛":"هِتبوعيل","Hithpō‛l":"هِتبوعيل","Hithpa‛lēl":"هِتفعليل"};
  /* صيغ الفعل */
  const ASP={"Pf":"الماضي","Impf":"المضارع","impf":"المضارع","Imv":"الأمر","Inf":"المصدر","Inf. abs":"المصدر المطلق","Inf. cstr":"المصدر المضاف","Pt":"اسم الفاعل","Pt. pass":"اسم المفعول","cstr":"المضاف","st. c":"حالة الإضافة","abs":"المطلق"};
  const aspAr=s=>ASP[s.replace(/\.$/,"").trim()]||null;
  const stemAr=s=>{const k=s.replace(/\.$/,"").trim();return STEM[k]||null};

  /* نوع الكلمة: عبارات كاملة أولًا، ثم ترجمة الأجزاء */
  const POSF={"n.pr.dei":"اسم علم إلهي","n.m.dei":"اسم إلهي مذكر","particle of negation":"أداة نفي","adv. of negation":"ظرف نفي","part. of relation":"أداة صلة","part. of entreaty":"أداة رجاء","hypoth. part":"أداة شرط",
    "verb substantive":"فعل الكون","as an exclam":"للتعجب","exhortation":"للحثّ","Interrog. part":"أداة استفهام","pron. of the 3rd ps. sing":"ضمير الغائب المفرد",
    "adv. of time":"ظرف زمان","vb. denom":"فعل مشتق من اسم","1s":"المتكلم المفرد","3 pl. masc":"الغائبون (جمع مذكر)","pron. 3 pl. fem":"ضمير الغائبات",
    "pron. 2 s. m":"ضمير المخاطب","pron. 2 s. f":"ضمير المخاطبة","pron. 2 m. pl":"ضمير المخاطبين","pron. 2 f. pl":"ضمير المخاطبات","pr.pl.m":"اسم علم (جمع مذكر)"};
  const POST={n:"اسم",noun:"اسم",m:"مذكر",f:"مؤنث",masc:"مذكر",fem:"مؤنث",comm:"مشترك",pr:"علم",loc:"مكان",gent:"نسبة (شعب)",terr:"إقليم",dei:"إله",
    vb:"فعل",adj:"صفة",adv:"ظرف",prep:"حرف جر",conj:"حرف عطف",subst:"اسم جوهر",pron:"ضمير",interrog:"استفهام",demonstr:"إشارة",part:"أداة",
    pl:"جمع",du:"مثنى",Dual:"مثنى",num:"عددي",ord:"ترتيبي",abstr:"مجرّد",emph:"توكيد",intens:"للتكثيف",exclam:"تعجّب",indef:"نكرة",pers:"شخص",acc:"منصوب",accus:"منصوب",nom:"اسم",denom:"مشتق من اسم"};
  function posAr(p){
    const k=p.trim().replace(/\.$/,""); if(POSF[k]) return POSF[k];
    const toks=k.replace(/[\[\]]/g,"").split(/[\s.]+/).filter(Boolean);
    const out=[]; for(const t of toks){ if(POST[t]) out.push(POST[t]); else return null; }
    /* «اسم علم مذكر» ← n.pr.m */
    let s=out.join(" ").replace("اسم علم مذكر","اسم علم لمذكر").replace("اسم علم مؤنث","اسم علم لمؤنث").replace(/^علم /,"اسم علم ");
    return s;
  }

  function refLabel(v,ar){
    const [a,b]=v.split("-"); const p=a.split("."), bk=p[0], c=p[1], vs=p[2];
    let q=b?b.split("."):null; if(q&&q[0]!==bk) q=null;
    const site=OS[bk];
    let name=bk, full=bk;
    if(ar&&site){ name=(typeof SH!=="undefined"&&SH[site])||site; full=(typeof AR!=="undefined"&&AR[site])||site; }
    const N=ar?nn:(x=>x);
    let cv=c?(vs?N(c)+(ar?": ":":")+N(vs):N(c)):"";
    if(q){ cv+=(q[1]!==c? "–"+N(q[1])+(ar?": ":":")+N(q[2]) : "–"+N(q[2])); }
    const lab=(name+" "+cv).trim();
    if(site && c){
      const h="/"+site+"/"+c+":"+(vs||1);
      const cur=(typeof book==="function"&&book())||null;
      if(cur && cur.abbr===site) return `<a class="bdr" data-go="${cur.id}.${c}:${vs||1}" title="${esc(full)}">${lab}</a>`;
      const href=(typeof pageOf==="function"?pageOf(site,h):site+".html#"+h);
      return `<a class="bdr" href="${href}" title="${esc(full)}">${lab}</a>`;
    }
    return `<span class="bdr nolink" title="${esc(full)}">${lab}</span>`;
  }

  function render(src,ar){
    if(ar){
      /* أرقام عربية واختصارات صيغ الفعل في النص (خارج الوسوم فقط) */
      src=src.replace(/<\/(p|st)>\s*\./g,"</$1>")
        .replace(/(<[^>]*>)|\b(Impf|Pf|Imv|Inf|Pt)\b\.?|\b(Qal|Niph|Pi|Pu|Hiph|Hoph|Hithp|Piel|Pual)\b\.?|\d/g,(m,tag,ab,stm)=>tag?tag:ab?(ASP[ab]||ab):stm?("وزن "+STEM[stm]):ARD[m]);
    }
    return src
      .replace(/<r v="([^"]*)"><\/r>/g,(m,v)=>refLabel(v,ar))
      .replace(/<h n="(H\d+[a-z]?)">/g,(m,n)=>STRONG_OK(n)?`<span class="sref bd-he" data-sn="${n}" lang="he" dir="rtl" title="سترونج ${n}">`:`<span class="bd-he" lang="he" dir="rtl">`)
      .replace(/<h>/g,'<span class="bd-he" lang="he" dir="rtl">').replace(/<\/h>/g,"</span>")
      .replace(/<l>/g,'<span class="bd-la" dir="ltr">').replace(/<\/l>/g,"</span>")
      .replace(/<p>(.*?)<\/p>/g,(m,p)=>{const a=ar?posAr(p):null;return a?`<span class="bd-pos" title="${esc(p)}">${a}</span>`:`<span class="bd-pos" dir="ltr">${p}</span>`})
      .replace(/<st>(.*?)<\/st>/g,(m,s)=>{const a=ar?stemAr(s):null;return a?`<span class="bd-st" title="${esc(s)}">وزن ${a}:</span>`:`<span class="bd-st" dir="ltr">${s}</span>`})
      .replace(/<s n="([^"]*)">/g,(m,k)=>`<div class="bd-s"><span class="bd-n">${ar?senseN(k):k}</span> `).replace(/<s>/g,'<div class="bd-s bd-s0">').replace(/<\/s>/g,"</div>")
      .replace(/<asp>(.*?)<\/asp>/g,(m,s)=>{const a=ar?aspAr(s):null;return a?`<span class="bd-asp" title="${esc(s)}">${a}</span>`:`<span class="bd-asp" dir="ltr">${s}</span>`})
      .replace(/<page[^>]*\/>|<sense[^>]*\/>/g,"")
      .replace(/<b>/g,'<b class="bd-gl">')
      .replace(/<hr>/g,'<hr class="bd-hr">');
  }
  const STRONG_OK=n=>typeof STRONG==="undefined"||!!STRONG[n];


  function boxInner(num){
    const e=B.D[num];
    if(!e) return `<div class="dent"><div class="hd"><span class="num">${num}</span></div><p class="na">لا يوجد مدخل لهذه الكلمة في قاموس BDB.</p></div>`;
    /* الكلمة الرئيسة تظهر في رأس المدخل، فتُحذف من أول النص */
    const m=(e.ar||"").match(/^\s*\[?<h[^>]*>(.*?)<\/h>\]?\s*[،,]?\s*/);
    const hw=m?m[1]:"";
    const arTxt=m?e.ar.slice(m[0].length):e.ar;
    const occ=e.o?`<span class="tr">ترد نحو ${nn(e.o)} مرة في العهد القديم</span>`:"";
    const body=arTxt?render(arTxt,true):`<span class="na">ترجمة هذا المدخل غير متاحة بعد.</span>`;
    return `<div class="dent"><div class="hd"><span class="num">${num}</span>${hw?`<span class="orig he" lang="he" dir="rtl">${hw}</span>`:""}${occ}
        <button type="button" class="bd-en-t" data-bden>النص الإنجليزي الأصلي</button></div>
      ${e.u?`<p class="bd-under">الكلمة <span class="bd-he" lang="he" dir="rtl">${e.u}</span> لا مدخل مستقلًا لها في BDB، بل تُذكر ضمن مادة <span class="bd-he" lang="he" dir="rtl">${hw}</span> التالية.</p>`:""}
      ${arTxt&&window.TSK_AINOTE||""}<div class="bd-body ar" dir="rtl">${body}</div>
      <div class="bd-en" dir="ltr" hidden>${render(e.en,false)}</div>
      <button type="button" class="bd-more" hidden>اقرأ المدخل كاملًا ↓</button>
      <p class="bd-src">${MODE==="short"?"نسخة مختصرة: المعاني وأوزان الفعل والشواهد الكتابية · ":""}† : ذُكرت كل مواضع الكلمة في العهد القديم.<br>المصدر: Brown, Driver &amp; Briggs, <i>A Hebrew and English Lexicon of the Old Testament</i> (1906) — ملكية عامة؛ النسخة الرقمية: Open Scriptures Hebrew Bible Project (CC BY 4.0). الترجمة العربية: جدد وعتقاء (ترجمة آلية بالذكاء الاصطناعي).</p></div>`;
  }
  function fit(root){
    (root||document).querySelectorAll(".bdbox .bd-body:not([data-fit])").forEach(b=>{
      if(!b.offsetParent) return;
      b.dataset.fit="1"; const more=b.closest(".dent").querySelector(".bd-more");
      if(b.scrollHeight>b.clientHeight+20){ b.classList.add("cut"); more.hidden=false; }
      else b.classList.remove("clip");
    });
  }
  /* البيانات مقسّمة: assets/bdb/c<رقم÷100>.js — كل ملف بيتحمّل بس لما القارئ يفتح كلمة منه */
  const B = window.BDB = window.BDB || {D:{}, got:{}};
  const chunkOf=num=>Math.floor(parseInt(num.slice(1),10)/100);
  const ready=num=>!!B.got[chunkOf(num)];
  function fill(){
    document.querySelectorAll("section.bdbox[data-bdn]").forEach(x=>{const num=x.dataset.bdn;if(!ready(num))return;x.removeAttribute("data-bdn");
      const box=x.querySelector(".bdin");box.innerHTML=boxInner(num);const b=box.querySelector(".bd-body");if(b)b.classList.add("clip"); });
    fit();
  }
  const LOADING={};
  function need(num){
    if(ready(num)){ setTimeout(fill); return; }
    const c=chunkOf(num), src=BASE+"c"+c+".js?v="+VER;
    if(LOADING[c]) return; LOADING[c]=1;
    const s=document.createElement("script"); s.src=src;
    const fail=()=>{delete LOADING[c];document.querySelectorAll("section.bdbox[data-bdn] .bdin").forEach(x=>{if(chunkOf(x.closest(".bdbox").dataset.bdn)===c)x.innerHTML=`<p class="na">تعذّر تحميل قاموس BDB — تحقّق من الاتصال بالإنترنت ثم أعد فتح الكلمة.</p>`})};
    s.onload=()=>{ if(B.got[c]) fill(); else { s.remove(); fail(); } };
    s.onerror=()=>{ s.remove(); fail(); };
    document.body.appendChild(s);
  }

  /* قسم مستقل تحت قسم «قاموس سترونج» مباشرة، بنفس شكله (مثل قاموس أبوت-سميث).
     بيراقب الصفحة: كل ما قسم سترونج يعرض كلمة عبرية، القسم ده يعرض نفس الكلمة. */
  const HEAD=`<div class="dhead"><h3><em>«</em>قاموس براون-درايفر-بريجز (BDB)<em>»</em></h3><small class="bd-sub">معجم عبري للعهد القديم (١٩٠٦) — المعاني والشواهد</small></div><div class="bdin"></div>`;
  const STRONG_SEC="section.dict:not(.asbox):not(.bdbox)";
  const isSheet=sec=>sec.classList.contains("uxt-dsheet");   /* على الموبايل قسم سترونج بيبقى bottom sheet */
  /* المكان: بعد قسم سترونج مباشرة، أو بعد قسم أبوت-سميث لو موجود بعده */
  function anchorAfter(sec){ let a=sec; const n=sec.nextElementSibling; if(n&&n.matches("section.asbox")) a=n; return a; }
  function okPlace(bd){
    const par=bd.parentElement; let prev=bd.previousElementSibling;
    if(par&&par.matches(STRONG_SEC)&&isSheet(par)) return true;
    if(prev&&prev.matches("section.asbox")) prev=prev.previousElementSibling;
    return !!(prev&&prev.matches(STRONG_SEC)&&!isSheet(prev));
  }
  function existing(sec){
    if(isSheet(sec)) return sec.querySelector(":scope > section.bdbox");
    const a=anchorAfter(sec), n=a.nextElementSibling;
    return n&&n.matches("section.bdbox")?n:null;
  }
  function slotFor(sec){
    const inSheet=isSheet(sec);
    let bd=existing(sec);
    if(!bd){ bd=document.createElement("section"); bd.className="bdbox"; bd.hidden=true; bd.innerHTML=HEAD; inSheet?sec.append(bd):anchorAfter(sec).after(bd); }
    bd.classList.toggle("dict",!inSheet); bd.classList.toggle("bd-insheet",inSheet);
    if(!inSheet&&sec.style.marginTop) bd.style.marginTop="18px";
    return bd;
  }
  function sync(){
    document.querySelectorAll("section.bdbox").forEach(x=>{if(!okPlace(x))x.remove()});
    document.querySelectorAll(STRONG_SEC).forEach(sec=>{
      const nEl=sec.querySelector(":scope > .dent > .hd > .num"), num=nEl?nEl.textContent.trim():"";
      if(!/^H\d/.test(num)){
        const ex=existing(sec);
        if(ex){ex.hidden=true;ex.dataset.cur=""}
        return;
      }
      const bd=slotFor(sec); bd.hidden=false;
      if(bd.dataset.cur===num) return;
      bd.dataset.cur=num; bd.dataset.bdn=num;
      bd.querySelector(".bdin").innerHTML=`<div class="empty loading">جارٍ تحميل قاموس BDB…</div>`;
      need(num);
    });
  }
  let queued=false;
  new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;sync()})}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:["class"]});
  sync();

  document.addEventListener("click",e=>{
    const t=e.target.closest&&e.target.closest("[data-bden]");
    if(t){const box=t.closest(".dent"),en=box.querySelector(".bd-en"),ar=box.querySelector(".bd-body"),more=box.querySelector(".bd-more");
      const showEn=en.hidden; en.hidden=!showEn; ar.hidden=showEn; if(more) more.hidden=showEn||!ar.classList.contains("cut");
      t.textContent=showEn?"الترجمة العربية":"النص الإنجليزي الأصلي"; return}
    const m=e.target.closest&&e.target.closest(".bd-more");
    if(m){const b=m.closest(".dent").querySelector(".bd-body");b.classList.remove("clip","cut");m.hidden=true}
  });

  const css=`
.bdbox [hidden]{display:none!important}
section.bdbox[hidden]{display:none!important}
.bdbox.bd-insheet{margin-top:18px;padding-top:16px;border-top:2px solid var(--line)}
.bdbox .bd-sub{font:12px var(--ui);color:var(--muted)}
.bdbox .dent .hd .bd-en-t{margin-inline-start:auto}
.bdbox .bd-en-t,.bdbox .bd-more{font:13px var(--ui);background:none;border:1px solid var(--line);border-radius:999px;padding:4px 12px;color:inherit;cursor:pointer}
.bdbox .bd-more{display:block;margin:8px auto 0}
.bdbox .bd-body{margin-top:12px;font:18px/1.95 var(--script)}
.bdbox .bd-body.clip{max-height:22em;overflow:hidden}
.bdbox .bd-body.cut{-webkit-mask-image:linear-gradient(#000 75%,transparent);mask-image:linear-gradient(#000 75%,transparent)}
.bdbox .bd-en{margin-top:12px;font:15px/1.8 "Noto Serif",Georgia,serif;text-align:left}
.bdbox .bd-he{unicode-bidi:isolate;font-family:"SBL Hebrew","Ezra SIL","Noto Serif Hebrew",serif;font-size:1.1em}
.bdbox .bd-he.sref{cursor:pointer;border-bottom:1px dotted var(--accent)}
.bdbox .bd-la{unicode-bidi:isolate;font-style:italic}
.bdbox .bd-pos{font:13px var(--ui);color:var(--muted);border:1px solid var(--line);border-radius:6px;padding:0 6px;margin:0 4px;white-space:nowrap}
.bdbox .bd-st{font-weight:700;color:var(--accent)}
.bdbox .bd-asp{font-weight:600;color:var(--muted)}
.bdbox .bd-s{margin:4px 0}
.bdbox .bd-s .bd-s{margin-inline-start:1.2em}
.bdbox .bd-n{font-weight:700;color:var(--accent)}
.bdbox .bd-gl{color:var(--accent)}
.bdbox a.bdr{white-space:nowrap;cursor:pointer;color:var(--accent);text-decoration:none;border-bottom:1px dotted}
.bdbox .bdr.nolink{white-space:nowrap;color:var(--muted)}
.bdbox .bd-hr{border:0;border-top:1px dashed var(--line);margin:12px 0}
.bdbox .bd-under{margin:10px 0 0;padding:6px 10px;border-inline-start:3px solid var(--accent);background:color-mix(in srgb,var(--accent) 7%,transparent);font:13px/1.8 var(--ui)}
.bdbox .bd-src{font:12px/1.7 var(--ui);color:var(--muted);margin-top:10px}
@media (max-width:880px){.bdbox .bd-body{font-size:17px}}`;
  const st=document.createElement("style"); st.textContent=css; document.head.appendChild(st);
})();
