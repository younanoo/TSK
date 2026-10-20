/* جدد وعتقاء — shared: apply saved theme early, wire the top-bar theme button */
(function(){
  try{var t=JSON.parse(localStorage.getItem("tsklib:theme"));if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}
  document.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("#brandTheme");if(!b)return;
    var r=document.documentElement,c=r.dataset.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),nx=c==="dark"?"light":"dark";
    r.dataset.theme=nx;try{localStorage.setItem("tsklib:theme",JSON.stringify(nx))}catch(e){}
  });
})();

/* sw:start — حفظ الموقع للعمل دون إنترنت (assets/../sw.js) */
(function(){
  if(!("serviceWorker" in navigator)||!/^https?:$/.test(location.protocol))return;
  var had=!!navigator.serviceWorker.controller,done=false;
  navigator.serviceWorker.addEventListener("controllerchange",function(){if(had&&!done){done=true;location.reload()}});
  addEventListener("load",function(){navigator.serviceWorker.register("sw.js",{updateViaCache:"none"}).catch(function(){})});
})();
/* sw:end */
