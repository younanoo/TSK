/* جدد وعتقاء — shared: apply saved theme early, wire the top-bar theme button */
(function(){
  try{var t=JSON.parse(localStorage.getItem("tsklib:theme"));if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}
  document.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("#brandTheme");if(!b)return;
    var r=document.documentElement,c=r.dataset.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),nx=c==="dark"?"light":"dark";
    r.dataset.theme=nx;try{localStorage.setItem("tsklib:theme",JSON.stringify(nx))}catch(e){}
  });
})();

/* ai-note:start — إفصاح الترجمة الآلية للقواميس: نص واحد تستعمله كل لوحات القواميس (سترونج وBDB وأبوت-سميث والبحث والنافذة الصغيرة) */
window.TSK_AINOTE='<p class="aino" role="note"><span class="aino-t">ترجمة آلية بالذكاء الاصطناعي</span> لم تُراجَع مراجعة كاملة، والنص الإنجليزي الأصلي متاح للمقارنة. <a href="sources.html#ai" target="_blank" rel="noopener">التفاصيل</a></p>';
window.TSK_AINOTE_S='<p class="aino s" role="note"><span class="aino-t">ترجمة آلية بالذكاء الاصطناعي</span> · <a href="sources.html#ai" target="_blank" rel="noopener">التفاصيل</a></p>';
/* ai-note:end */

/* vid:start — شروحات الفيديو (يوتيوب): زر «شاهد الشرح» ونافذة تشغيل داخل الصفحة. الفيديو لا يُحمَّل إلا عند الضغط */
window.TSK_LINKS={fb:"https://www.facebook.com/gododapp",yt:"https://www.youtube.com/@gododapp",pl:"https://www.youtube.com/playlist?list=PLXQIsyACqP-c"};
window.TSK_VIDS={intro:{id:"NInJua8_VnU",t:"جدد وعتقاء: مكتبة عربية مجانية لدراسة الكتاب المقدس بالشواهد",d:"2:05",s:125,ds:"تعرّف على الموقع في دقيقتين: شواهد TSK، فاندايك وكتاب الحياة بأرقام سترونج، القواميس، البحث، الخرائط، والعمل دون إنترنت."},
list:[
{id:"5rqwZKZQrqI",t:"كيف تفتح أي أصحاح في الكتاب المقدس",d:"1:06",s:66},
{id:"oqqt-kFvn1E",t:"إعدادات العرض والخرائط",d:"1:14",s:74},
{id:"E_1yJdJ3LKU",t:"استخدم الموقع بدون إنترنت",d:"1:30",s:90},
{id:"ds4oZtAJ8SA",t:"الشواهد المتقاطعة لأي آية",d:"1:16",s:76},
{id:"kBXMNuW7Kws",t:"معنى الكلمة في العبري واليوناني (قاموس سترونج)",d:"1:31",s:91},
{id:"9VbHlZ8F07A",t:"البحث في الكتاب المقدس بالكلمة والجذر ورقم سترونج",d:"1:39",s:99},
{id:"jBaejjxNe0c",t:"وضع الدراسة ومقارنة الترجمات ومخطط السفر",d:"1:25",s:85},
{id:"bsdb9s_tQNQ",t:"فهرس المواضيع والخريطة الذهنية والقراءة الزمنية",d:"1:28",s:88},
{id:"un2YNLgtfl0",t:"قوائمي والعرض في الخدمة وتواصل معنا",d:"1:25",s:85}]};
(function(){
  var V=window.TSK_VIDS,L=window.TSK_LINKS,AD=function(x){return String(x).replace(/\d/g,function(d){return"٠١٢٣٤٥٦٧٨٩"[d]})};
  var IC='<svg class="vic" viewBox="0 0 28 20" aria-hidden="true"><rect width="28" height="20" rx="5.5" fill="#E62117"/><path d="M11 5.8v8.4L18.4 10z" fill="#fff"/></svg>';
  window.TSK_VIC=IC;
  /* الصفحة ← رقم الفيديو في list (من صفر) */
  var MAP={"search.html":5,"offline.html":2,"lists.html":8,"contact.html":8,"topics.html":7,"chrono.html":7,"timeline.html":7};
  var css=".vbtn{display:inline-flex;align-items:center;gap:9px;margin:10px 0 4px;padding:7px 15px 7px 13px;border:1px solid var(--line,#E6DFCF);border-radius:999px;background:var(--paper,#fff);color:var(--ink,#253342);font:600 13.5px/1.4 var(--ui,'IBM Plex Sans Arabic',Tahoma,sans-serif);text-decoration:none;cursor:pointer;box-shadow:0 1px 2px rgba(15,53,84,.08);transition:box-shadow .15s,transform .15s,border-color .15s}.vbtn:hover{border-color:#E62117;box-shadow:0 3px 10px rgba(230,33,23,.18);transform:translateY(-1px)}.vbtn .vic{width:28px;height:20px;flex:none}.vbtn small{font:500 12px var(--ui,inherit);color:var(--muted,#4E6684)}.vwrap{margin:2px 0 6px}"+
  ".vmod{position:fixed;inset:0;z-index:2147483000;background:rgba(8,20,32,.78);display:flex;align-items:center;justify-content:center;padding:14px}.vmod[hidden]{display:none}.vbox{width:min(920px,100%);background:var(--paper,#fff);color:var(--ink,#253342);border-radius:16px;overflow:hidden;box-shadow:0 18px 60px rgba(0,0,0,.45);font-family:var(--ui,'IBM Plex Sans Arabic',Tahoma,sans-serif)}.vbar{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid var(--line,#E6DFCF)}.vbar b{flex:1;font-size:14px;line-height:1.6}.vbar button{border:0;background:none;color:inherit;font-size:24px;line-height:1;cursor:pointer;padding:2px 8px;border-radius:8px}.vbar button:hover{background:var(--accent-soft,#E6EDF4)}.vfr{position:relative;aspect-ratio:16/9;background:#000}.vfr iframe{position:absolute;inset:0;width:100%;height:100%;border:0}.voff{padding:26px 18px;text-align:center;line-height:2;font-size:14px}.vfoot{padding:9px 14px;font-size:12.5px;display:flex;gap:14px;flex-wrap:wrap;border-top:1px solid var(--line,#E6DFCF);color:var(--muted,#4E6684)}.vfoot a{color:var(--accent,#0F3554);font-weight:600}@media(max-width:560px){.vmod{padding:0;align-items:flex-end}.vbox{border-radius:16px 16px 0 0}}@media print{.vbtn,.vmod{display:none}}";
  var st=document.createElement("style");st.textContent=css;(document.head||document.documentElement).appendChild(st);
  function find(id){if(V.intro.id===id)return V.intro;for(var i=0;i<V.list.length;i++)if(V.list[i].id===id)return V.list[i]}
  function url(id){return"https://www.youtube.com/watch?v="+id}
  var mod,last;
  function close(){if(!mod)return;mod.hidden=true;mod.querySelector(".vfr").innerHTML="";document.documentElement.style.overflow="";if(last&&last.focus)try{last.focus()}catch(e){}}
  function open(id){
    var v=find(id);if(!v)return;
    if(!mod){
      mod=document.createElement("div");mod.className="vmod";mod.hidden=true;mod.setAttribute("role","dialog");mod.setAttribute("aria-modal","true");mod.setAttribute("aria-label","شرح بالفيديو");
      mod.innerHTML='<div class="vbox"><div class="vbar"><b></b><button type="button" aria-label="إغلاق">×</button></div><div class="vfr"></div><div class="vfoot"><a class="vyt" target="_blank" rel="noopener">افتح على يوتيوب</a><a target="_blank" rel="noopener" href="'+L.pl+'">كل الشروحات</a><a target="_blank" rel="noopener" href="'+L.yt+'">القناة</a></div></div>';
      document.body.appendChild(mod);
      mod.addEventListener("click",function(e){if(e.target===mod||e.target.closest(".vbar button"))close()});
      document.addEventListener("keydown",function(e){if(e.key==="Escape"&&mod&&!mod.hidden)close()});
    }
    mod.querySelector(".vbar b").textContent=v.t;mod.querySelector(".vyt").href=url(id);
    var fr=mod.querySelector(".vfr");
    if(navigator.onLine===false){fr.removeAttribute("class");fr.className="vfr";fr.style.aspectRatio="auto";fr.innerHTML='<div class="voff">هذا الفيديو يحتاج إلى اتصال بالإنترنت.<br>يمكنك مشاهدته لاحقًا من قناتنا على يوتيوب.</div>'}
    else{fr.style.aspectRatio="";fr.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&hl=ar" title="'+v.t.replace(/"/g,"&quot;")+'" allow="accelerometer;autoplay;clipboard-write;encrypted-media;picture-in-picture;fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>'}
    mod.hidden=false;document.documentElement.style.overflow="hidden";mod.querySelector(".vbar button").focus();
  }
  window.TSK_VOPEN=open;
  document.addEventListener("click",function(e){
    var a=e.target.closest&&e.target.closest("[data-vid]");if(!a)return;
    if(e.ctrlKey||e.metaKey||e.shiftKey||e.button===1)return;
    e.preventDefault();last=a;open(a.getAttribute("data-vid"));
  });
  window.TSK_VBTN=function(id,label){var v=find(id);return'<a class="vbtn" data-vid="'+id+'" href="'+url(id)+'" target="_blank" rel="noopener">'+IC+'<span>'+(label||"شاهد الشرح")+' <small>'+AD(v.d)+'</small></span></a>'};
  function add(){
    var f=(location.pathname.split("/").pop()||"index.html"),i=MAP[f];
    if(i==null)return;
    var h=document.querySelector("main h1,h1");if(!h||document.querySelector(".vwrap"))return;
    var w=document.createElement("div");w.className="vwrap";w.innerHTML=window.TSK_VBTN(V.list[i].id,"شاهد الشرح بالفيديو");
    h.insertAdjacentElement("afterend",w);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",add);else add();
})();
/* vid:end */

/* foot:start — سطر حقوق النشر والتواصل أسفل كل صفحة (الصفحة الرئيسية لها تذييلها الخاص) */
(function(){
  function add(){
    if(document.querySelector(".h-foot,.site-foot,.mmbar")||/mindmap\.html$/.test(location.pathname))return;
    var css=document.createElement("style");
    css.textContent=".site-foot{clear:both;border-top:1px solid var(--line,#E6DFCF);margin-top:28px;padding:18px 16px 26px;text-align:center;color:var(--muted,#4E6684);font:13px/1.9 var(--ui,'IBM Plex Sans Arabic',Tahoma,sans-serif)}.site-foot p{margin:0 auto;max-width:900px}.site-foot a{color:var(--accent,#0F3554);font-weight:600;text-decoration:none;margin:0 6px}.site-foot a:hover{text-decoration:underline}.site-foot small{display:block;font-size:12px;opacity:.9}@media print{.site-foot{display:none}}";
    document.head.appendChild(css);
    var f=document.createElement("footer");f.className="site-foot";
    f.innerHTML='<p>© ٢٠٢٦ سامح يونان انطون (Sameh Younan Anton) — تصميم الموقع وتطويره.<a href="contact.html">تواصل معنا</a>·<a href="sources.html#license">المصادر والتراخيص</a></p>'+
      '<p class="sf-soc"><a href="'+window.TSK_LINKS.fb+'" target="_blank" rel="noopener">صفحتنا على فيسبوك</a>·<a href="'+window.TSK_LINKS.yt+'" target="_blank" rel="noopener">قناتنا على يوتيوب</a>·<a href="'+window.TSK_LINKS.pl+'" target="_blank" rel="noopener">شروحات الفيديو</a></p>'+
      '<p><small>التصميم والبرمجة: جميع الحقوق محفوظة.</small></p><p><small>الترجمات العربية للقواميس والملاحظات: ترجمة آلية بالذكاء الاصطناعي لم تُراجَع مراجعة كاملة (<a href="sources.html#ai" style="margin:0">التفاصيل</a>)، وهي منشورة بترخيص <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ar" target="_blank" rel="noopener license" style="margin:0">CC BY-NC-SA 4.0</a>. وتخضع النصوص والبيانات المأخوذة من مصادر أخرى لتراخيصها.</small></p>';
    document.body.appendChild(f);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",add);else add();
})();
/* foot:end */

/* sw:start — حفظ الموقع للعمل دون إنترنت (assets/../sw.js) */
(function(){
  if(!("serviceWorker" in navigator)||!/^https?:$/.test(location.protocol))return;
  var had=!!navigator.serviceWorker.controller,done=false;
  navigator.serviceWorker.addEventListener("controllerchange",function(){if(had&&!done){done=true;location.reload()}});
  addEventListener("load",function(){navigator.serviceWorker.register("sw.js",{updateViaCache:"none"}).catch(function(){})});
})();
/* sw:end */
