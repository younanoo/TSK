/* جدد وعتقاء — shared: apply saved theme early, wire the top-bar theme button */
(function(){
  try{var t=JSON.parse(localStorage.getItem("tsklib:theme"));if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}
  document.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("#brandTheme");if(!b)return;
    var r=document.documentElement,c=r.dataset.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),nx=c==="dark"?"light":"dark";
    r.dataset.theme=nx;try{localStorage.setItem("tsklib:theme",JSON.stringify(nx))}catch(e){}
  });
})();

/* foot:start — سطر حقوق النشر والتواصل أسفل كل صفحة (الصفحة الرئيسية لها تذييلها الخاص) */
(function(){
  function add(){
    if(document.querySelector(".h-foot,.site-foot,.mmbar")||/mindmap\.html$/.test(location.pathname))return;
    var css=document.createElement("style");
    css.textContent=".site-foot{clear:both;border-top:1px solid var(--line,#E6DFCF);margin-top:28px;padding:18px 16px 26px;text-align:center;color:var(--muted,#4E6684);font:13px/1.9 var(--ui,'IBM Plex Sans Arabic',Tahoma,sans-serif)}.site-foot p{margin:0 auto;max-width:900px}.site-foot a{color:var(--accent,#0F3554);font-weight:600;text-decoration:none;margin:0 6px}.site-foot a:hover{text-decoration:underline}.site-foot small{display:block;font-size:12px;opacity:.9}@media print{.site-foot{display:none}}";
    document.head.appendChild(css);
    var f=document.createElement("footer");f.className="site-foot";
    f.innerHTML='<p>© ٢٠٢٦ سامح يونان انطون (Sameh Younan Anton) — تصميم الموقع وتطويره.<a href="contact.html">تواصل معنا</a>·<a href="sources.html#license">المصادر والتراخيص</a></p>'+
      '<p><small>التصميم والبرمجة: جميع الحقوق محفوظة. الترجمات العربية للقواميس والملاحظات: <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ar" target="_blank" rel="noopener license" style="margin:0">CC BY-NC-SA 4.0</a>. وتخضع النصوص والبيانات المأخوذة من مصادر أخرى لتراخيصها.</small></p>';
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
