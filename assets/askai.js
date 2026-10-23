/* جدد وعتقاء — «اسأل Google AI» عن كلمة عبرية أو يونانية
   الاستخدام: أي عنصر فيه data-askai data-num="G25" [data-ref="يوحنا ٣: ١٦"] [data-words="أحب"] [data-o="ἀγαπάω" data-tr="agapaō" لو قاموس سترونج مش متحمّل في الصفحة]
   بيفتح لوحة فيها سؤال جاهز (يقدر القارئ يعدّله)، وبعدين يبعته لوضع الذكاء الاصطناعي في Google في نافذة جانبية.
   Google ما بيسمحش بعرض صفحاته جوه إطار في موقع تاني، فالإجابة بتظهر في نافذة/تبويب منفصل. */
(function(){
"use strict";
if(window.AskAI)return;
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const get=(k,d)=>{try{const v=localStorage.getItem("tsklib:"+k);return v==null?d:JSON.parse(v)}catch(e){return d}};
const set=(k,v)=>{try{localStorage.setItem("tsklib:"+k,JSON.stringify(v))}catch(e){}};
const SPARK='<svg class="aic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"/></svg>';

const css=`
.askai{border:0;padding:0;border-radius:20px;background:var(--paper,#fff);color:var(--ink,#253342);box-shadow:0 20px 60px rgba(0,0,0,.35);width:min(520px,calc(100vw - 24px));max-height:calc(100vh - 24px);font:15px/1.7 var(--ui,"IBM Plex Sans Arabic",Tahoma,sans-serif)}
.askai::backdrop{background:var(--scrim,rgba(11,30,48,.5))}
.askai .aic{width:1.1em;height:1.1em;vertical-align:-.18em;flex:none}
.askai .ah{display:flex;align-items:flex-start;gap:12px;padding:18px 20px 12px;border-bottom:1px solid var(--line,#E6DFCF)}
.askai .aw{flex:1;min-width:0}
.askai .ao{font:600 30px/1.3 "Noto Serif","Noto Serif Hebrew",serif;color:var(--heading,#0F3554)}
.askai .ao.he{font-family:"Noto Serif Hebrew","Noto Serif",serif}
.askai .at{font-size:13.5px;color:var(--muted,#4E6684)}
.askai .at b{direction:ltr;unicode-bidi:isolate;background:var(--accent-soft,#E6EDF4);color:var(--accent,#0F3554);border-radius:6px;padding:1px 7px;font-size:12px}
.askai .ax{all:unset;cursor:pointer;width:34px;height:34px;display:grid;place-items:center;border-radius:10px;color:var(--muted,#4E6684)}
.askai .ax:hover{background:var(--chip,#F3EFE4)}
.askai .ab{padding:14px 20px 18px}
.askai .al{font:600 13px var(--ui,sans-serif);color:var(--heading,#0F3554);margin:0 0 8px}
.askai .aq{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 14px}
.askai .aq button{all:unset;cursor:pointer;font:500 13px var(--ui,sans-serif);padding:5px 12px;border-radius:999px;border:1px solid var(--line,#E6DFCF);color:var(--ink,#253342);background:var(--bg,#FAF8F2)}
.askai .aq button:hover{border-color:var(--accent,#0F3554)}
.askai .aq button[aria-pressed="true"]{background:var(--accent,#0F3554);border-color:var(--accent,#0F3554);color:var(--on-accent,#fff)}
.askai textarea{box-sizing:border-box;width:100%;min-height:118px;resize:vertical;border:1px solid var(--line,#E6DFCF);border-radius:12px;padding:10px 12px;font:15px/1.8 var(--ui,sans-serif);color:var(--ink,#253342);background:var(--bg,#FAF8F2)}
.askai textarea:focus{outline:2px solid var(--brand-gold,#D4A64A);outline-offset:1px}
.askai .af{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:14px}
.askai .go{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:8px;background:var(--accent,#0F3554);color:var(--on-accent,#fff);font:700 14.5px var(--ui,sans-serif);padding:10px 18px;border-radius:12px}
.askai .go:hover{filter:brightness(1.1)}
.askai .cp{all:unset;cursor:pointer;font:600 13.5px var(--ui,sans-serif);color:var(--accent,#0F3554);padding:9px 14px;border-radius:12px;border:1px solid var(--line,#E6DFCF)}
.askai .cp:hover{border-color:var(--accent,#0F3554)}
.askai .go:focus-visible,.askai .cp:focus-visible,.askai .aq button:focus-visible,.askai .ax:focus-visible{outline:2px solid var(--brand-gold,#D4A64A);outline-offset:2px}
.askai .an{margin:12px 0 0;font-size:12.5px;color:var(--muted,#4E6684)}
`;
const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);

const dlg=document.createElement("dialog");dlg.className="askai";dlg.setAttribute("aria-labelledby","askaiT");
document.body.appendChild(dlg);
dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()});

let W=null; /* الكلمة الحالية */
function qs(w){
  const lang=w.num[0]==="H"?"العبرية":"اليونانية";
  const word=`الكلمة ${lang} «${w.o}»${w.tr?` (${w.tr})`:""} رقم سترونج ${w.num}`;
  const inText=w.words?`، المترجمة «${w.words}»`:"";
  const tail=" أجب باللغة العربية، واذكر الشواهد الكتابية.";
  const L=[];
  if(w.ref)L.push(["ctx","في سياق الآية",`ما معنى ${word}${inText} كما وردت في ${w.ref}؟ ولماذا استُخدمت هذه الكلمة تحديدًا هنا، وكيف تساعد على فهم الآية؟`+tail]);
  L.push(["root","المعنى والجذر",`اشرح ${word}: معناها الأصلي وجذرها واشتقاقاتها، وتطور معناها.`+tail]);
  L.push(["use","استخدامها في الكتاب",`أين وردت ${word} في الكتاب المقدس؟ وكيف يختلف معناها من موضع لآخر؟ أعطني أمثلة مهمة.`+tail]);
  L.push(["syn","الفرق عن المرادفات",`ما الفرق بين ${word} والكلمات ${lang} القريبة منها في المعنى؟ وكيف يظهر هذا الفرق في الترجمات العربية؟`+tail]);
  L.push(["all","دراسة شاملة",`قدّم دراسة كتابية عن ${word}${inText}${w.ref?` (كما في ${w.ref})`:""}: المعنى الأصلي والجذر، الاستخدام في العهدين، أهم المواضع، الفرق عن المرادفات، والتطبيق الروحي.`+tail]);
  return L;
}
function open(w){
  const S=(window.STRONG||{})[w.num]||{};
  W=Object.assign({},w,{o:S.o||w.o||"",tr:S.tr||w.tr||""});
  const L=qs(W);let pick=get("aiq",W.ref?"ctx":"root");if(!L.some(x=>x[0]===pick))pick=L[0][0];
  dlg.innerHTML=`<div class="ah"><div class="aw"><div class="ao ${W.num[0]==="H"?"he":""}" dir="${W.num[0]==="H"?"rtl":"ltr"}" id="askaiT">${esc(W.o||W.num)}</div>
     <div class="at">${W.tr?esc(W.tr)+" · ":""}<b>${esc(W.num)}</b>${W.ref?` · ${esc(W.ref)}`:""}${W.words?` · «${esc(W.words)}»`:""}</div></div>
     <button class="ax" type="button" aria-label="إغلاق"><svg class="aic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6l-12 12"/><path d="M6 6l12 12"/></svg></button></div>
   <div class="ab"><p class="al">ماذا تريد أن تعرف؟</p>
     <div class="aq" role="group" aria-label="نوع السؤال">${L.map(([k,t])=>`<button type="button" data-k="${k}" aria-pressed="${k===pick}">${t}</button>`).join("")}</div>
     <p class="al">السؤال (يمكنك تعديله أو الإضافة إليه):</p>
     <textarea id="askaiQ" dir="rtl"></textarea>
     <div class="af"><button class="go" type="button">${SPARK} اسأل Google AI</button><button class="cp" type="button">نسخ السؤال</button></div>
     <p class="an">سيُفتح وضع الذكاء الاصطناعي من Google في نافذة جانبية. الإجابة من Google وليست من الموقع، فراجعها على الكتاب المقدس نفسه.</p></div>`;
  const ta=dlg.querySelector("#askaiQ");
  const fill=k=>{ta.value=(L.find(x=>x[0]===k)||L[0])[2]};fill(pick);
  dlg.querySelector(".ax").onclick=()=>dlg.close();
  dlg.querySelectorAll(".aq button").forEach(b=>b.onclick=()=>{dlg.querySelectorAll(".aq button").forEach(x=>x.setAttribute("aria-pressed",x===b));fill(b.dataset.k);set("aiq",b.dataset.k)});
  dlg.querySelector(".go").onclick=()=>{send(ta.value.trim());};
  const cp=dlg.querySelector(".cp");
  cp.onclick=async()=>{try{await navigator.clipboard.writeText(ta.value);cp.textContent="تم النسخ ✓"}catch(e){ta.select();document.execCommand&&document.execCommand("copy");cp.textContent="تم النسخ ✓"}setTimeout(()=>cp.textContent="نسخ السؤال",1600)};
  dlg.open||dlg.showModal();
  dlg.querySelector(".go").focus();
}
function send(q){
  if(!q)return;
  const url="https://www.google.com/search?udm=50&hl=ar&q="+encodeURIComponent(q);
  const small=innerWidth<760||matchMedia("(pointer:coarse)").matches;
  let w=null;
  if(!small){
    const ww=520,hh=Math.min((screen.availHeight||900)-60,860),left=(screen.availLeft||0)+(screen.availWidth||1280)-ww-20,top=(screen.availTop||0)+30;
    w=window.open(url,"tskai",`popup=yes,width=${ww},height=${hh},left=${left},top=${top}`);
  }else w=window.open(url,"_blank");
  if(!w){const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener";document.body.appendChild(a);a.click();a.remove()}
  else{try{w.focus()}catch(e){}}
  dlg.close();
}
function fromEl(el){const d=el.dataset;open({num:(d.num||"").toUpperCase(),ref:d.ref||"",words:d.words||"",o:d.o||"",tr:d.tr||""})}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-askai]");if(!b)return;e.preventDefault();fromEl(b)});
window.AskAI={open,fromEl,send};
})();
