/* جدد وعتقاء — مشاركة قائمة أو نقلها لجهاز آخر (lists.html)
   زر «مشاركة / نقل» يعمل لينكًا فيه القائمة نفسها (مضغوطة) وكود QR له، فيُفتح على أي جهاز وتُضاف القائمة هناك.
   - من غير سيرفر: القائمة كلها جوه اللينك بعد # (مش بتتبعت لأي سيرفر).
   - الصيغة: lists.html#imp=<حرف الإصدار><base64url>  — "1" = JSON مضغوط deflate-raw، "0" = JSON من غير ضغط (متصفح قديم).
   - البيانات: {v:1,n:اسم القائمة,i:[العناصر من غير id/at]} — نفس شكل عناصر TSKLists (آية k:"v"، مدخل k:"d"، شرح k:"n").
   - الاستيراد ينشئ قائمة جديدة دائمًا (ولو الاسم موجود يضيف «(٢)»…)، ومش بيلمس القوائم الموجودة.
   - QR من assets/qrcode.min.js (qrcode-generator، MIT) ويتحمّل عند أول مشاركة بس. */
(function(){
  "use strict";
  var L=window.TSKLists; if(!L) return;
  var esc=L.esc, nAr=L.nAr;
  var IMP=(location.hash||"").indexOf("#imp=")===0?location.hash.slice(5):null;   /* لازم يتقرا قبل ما الصفحة تغيّر الـ hash لاسم القائمة */
  var QR_MAX=2600, QR_DENSE=1100;

  /* ---------- الترميز ---------- */
  function b64u(u8){var s="",i;for(i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
  function unb64u(t){t=t.replace(/-/g,"+").replace(/_/g,"/");while(t.length%4)t+="=";var s=atob(t),u=new Uint8Array(s.length);for(var i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u}
  function pipe(u8,stream){return new Response(new Blob([u8]).stream().pipeThrough(stream)).arrayBuffer().then(function(b){return new Uint8Array(b)})}
  var CAN=typeof CompressionStream!=="undefined"&&typeof DecompressionStream!=="undefined";
  function encode(l){
    var data={v:1,n:l.name,i:l.items.map(function(x){var y={},k;for(k in x)if(k!=="id"&&k!=="at")y[k]=x[k];return y})};
    var u8=new TextEncoder().encode(JSON.stringify(data));
    var p=CAN?pipe(u8,new CompressionStream("deflate-raw")).then(function(z){return "1"+b64u(z)}).catch(function(){return "0"+b64u(u8)}):Promise.resolve("0"+b64u(u8));
    return p.then(function(code){return location.origin+location.pathname+"#imp="+code});
  }
  function decode(code){
    try{
      var ver=code.charAt(0),u8=unb64u(decodeURIComponent(code.slice(1)));
      var p=ver==="1"?(CAN?pipe(u8,new DecompressionStream("deflate-raw")):Promise.reject(new Error("old"))):ver==="0"?Promise.resolve(u8):Promise.reject(new Error("ver"));
      return p.then(function(b){var d=JSON.parse(new TextDecoder().decode(b));
        if(!d||!Array.isArray(d.i))throw new Error("bad");
        d.i=d.i.filter(function(x){return x&&(x.k==="v"||x.k==="d"||x.k==="n")});return d});
    }catch(e){return Promise.reject(e)}
  }

  /* ---------- نافذة عامة ---------- */
  var box=null;
  function sheet(html){
    close();
    box=document.createElement("div");box.className="lsh";box.setAttribute("role","dialog");box.setAttribute("aria-modal","true");
    box.innerHTML='<div class="lsh-in">'+html+'</div>';
    document.body.appendChild(box);
    box.addEventListener("click",function(e){if(e.target===box||e.target.closest("[data-sh=x]"))close()});
    return box;
  }
  function close(){if(box){box.remove();box=null}}
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&box)close()});

  /* ---------- المشاركة ---------- */
  function curList(){var s=L.state(),h=decodeURIComponent((location.hash||"").slice(1));return L.find(s,h)||L.find(s,s.last)||L.find(s,L.MAIN)}
  function loadQR(cb){if(window.qrcode)return cb();var x=document.createElement("script");x.src="assets/qrcode.min.js";x.onload=cb;x.onerror=function(){cb()};document.head.appendChild(x)}
  function qrSvg(url){try{var q=window.qrcode(0,"L");q.addData(url,"Byte");q.make();return q.createSvgTag({cellSize:4,margin:3,scalable:true})}catch(e){return ""}}
  function share(){
    var l=curList();if(!l)return;
    if(!l.items.length){L.toast("القائمة دي فاضية — أضف لها آيات الأول",{bad:true});return}
    var b=sheet('<div class="lsh-hd"><b>انقل أو شارك «'+esc(l.name)+'»</b><button type="button" class="lsh-x" data-sh="x" aria-label="إغلاق">✕</button></div><div class="lsh-body"><p class="lsh-wait">جارٍ تجهيز اللينك…</p></div>');
    encode(l).then(function(url){loadQR(function(){
      if(!box||box!==b)return;
      var big=url.length>QR_MAX, svg=big||!window.qrcode?"":qrSvg(url);
      var n=l.items.length;
      b.querySelector(".lsh-body").innerHTML=
        (svg?'<div class="lsh-qr" aria-label="كود QR للقائمة">'+svg+'</div><p class="lsh-tip">افتح كاميرا الموبايل ووجّهها على الكود، وافتح اللينك اللي يظهر.'+(url.length>QR_DENSE?' الكود كثيف لأن القائمة كبيرة — لو الكاميرا ماقرأتهوش، ابعت اللينك.':'')+'</p>'
            :'<p class="lsh-tip warn">القائمة كبيرة على كود QR — ابعت اللينك بدلًا منه (واتساب أو إيميل).</p>')+
        '<p class="lsh-n">'+nAr(n)+' '+(n===1?"عنصر":n===2?"عنصران":n<=10?"عناصر":"عنصرًا")+' · اللي يفتح اللينك تتضاف القائمة عنده كقائمة جديدة</p>'+
        '<div class="lsh-link"><input type="text" readonly dir="ltr" aria-label="لينك القائمة"><button type="button" class="lsh-b main" data-sh="copy">نسخ اللينك</button></div>'+
        (navigator.share?'<button type="button" class="lsh-b wide" data-sh="send">إرسال (واتساب، إيميل…)</button>':'')+
        '<p class="lsh-note">القائمة كلها جوه اللينك نفسه ومش بتتحفظ على أي سيرفر. ده نقل لمرة واحدة: التعديلات بعد كده مش بتتزامن.</p>';
      var inp=b.querySelector(".lsh-link input");inp.value=url;
      inp.addEventListener("focus",function(){inp.select()});
      b.querySelector("[data-sh=copy]").addEventListener("click",function(){copyText(url).then(function(ok){L.toast(ok?L.ICONS.ok+" اتنسخ اللينك":"تعذّر النسخ — حدّد اللينك وانسخه",{bad:!ok})})});
      var sd=b.querySelector("[data-sh=send]");
      if(sd)sd.addEventListener("click",function(){navigator.share({title:"قائمة «"+l.name+"» — جدد وعتقاء",text:"قائمة آيات «"+l.name+"» من جدد وعتقاء:",url:url}).catch(function(){})});
    })}).catch(function(){if(box===b)b.querySelector(".lsh-body").innerHTML='<p class="lsh-tip warn">تعذّر تجهيز اللينك.</p>'});
  }
  function copyText(t){
    if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(t).then(function(){return true},function(){return fb()});
    return Promise.resolve(fb());
    function fb(){var a=document.createElement("textarea");a.value=t;a.style.position="fixed";a.style.opacity="0";document.body.appendChild(a);a.select();var ok=false;try{ok=document.execCommand("copy")}catch(e){}a.remove();return ok}
  }

  /* ---------- الاستيراد ---------- */
  function freeName(s,name){name=String(name||"قائمة").replace(/\s+/g," ").trim().slice(0,50)||"قائمة";if(!L.nameTaken(s,name))return name;
    for(var i=2;i<100;i++){var t=name+" ("+nAr(i)+")";if(!L.nameTaken(s,t))return t}return name+" "+Date.now()}
  function label(x){return x.k==="v"?x.ref:x.k==="d"?x.num:"شرح"}
  function offer(code){
    if((location.hash||"").indexOf("#imp=")===0){try{history.replaceState(null,"",location.pathname+location.search)}catch(e){}}
    decode(code).then(function(d){
      if(!d.i.length){L.toast("القائمة اللي في اللينك فاضية",{bad:true});return}
      var n=d.i.length,vs=d.i.filter(function(x){return x.k!=="n"}).slice(0,4).map(function(x){return esc(label(x))}).join("، ");
      var b=sheet('<div class="lsh-hd"><b>وصلتك قائمة</b><button type="button" class="lsh-x" data-sh="x" aria-label="إغلاق">✕</button></div><div class="lsh-body">'+
        '<p class="lsh-name">«'+esc(d.n||"قائمة")+'»</p><p class="lsh-n">'+nAr(n)+' '+(n===1?"عنصر":n===2?"عنصران":n<=10?"عناصر":"عنصرًا")+(vs?': '+vs+(n>4?'…':''):'')+'</p>'+
        '<div class="lsh-acts"><button type="button" class="lsh-b main" data-sh="add">أضفها إلى قوائمي</button><button type="button" class="lsh-b" data-sh="x">لا، شكرًا</button></div>'+
        '<p class="lsh-note">هتتضاف كقائمة جديدة، وقوائمك الحالية مش هتتغير.</p></div>');
      b.querySelector("[data-sh=add]").addEventListener("click",function(){
        var s=L.state(),r=L.create(s,freeName(s,d.n));if(r.err){L.toast(r.err,{bad:true});return}
        var l=L.find(s,r.id),now=Date.now();
        d.i.forEach(function(x,j){var y={},k;for(k in x)y[k]=x[k];y.id=L.uid();y.at=now+j;l.items.push(y)});
        s.last=r.id;
        if(L.save(s)){close();L.toast(L.ICONS.ok+" اتضافت قائمة «"+esc(l.name)+"»");location.hash=encodeURIComponent(r.id)}});
    }).catch(function(){L.toast("اللينك ده ناقص أو تالف — اطلب من صاحبه يبعته تاني",{bad:true})});
  }
  addEventListener("hashchange",function(){var h=location.hash||"";if(h.indexOf("#imp=")===0)offer(h.slice(5))});

  window.LISTSHARE={encode:encode,decode:decode,share:share};
  function init(){
    var bt=document.getElementById("share");if(bt)bt.addEventListener("click",share);
    if(IMP)setTimeout(function(){offer(IMP)},60);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
