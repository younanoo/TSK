/* جدد وعتقاء — القائمة الجانبية الموحّدة (☰) لكل الصفحات غير صفحات الأسفار
   الترتيب (نفس ترتيب القائمة الجانبية في صفحات الأسفار — app.js ‏sideTools):
   ١) اذهب إلى عدد  ٢) الأسفار  ٣) الكتاب عبر الزمن  ٤) أدوات البحث  ٥) صفحات أخرى
   لو غيّرت روابط هنا، غيّرها كمان في app.js (sideTools).
   الصفحة الرئيسية تفتح نفس القائمة بـ window.TSKMenu.open()، وتقدر تضيف قسمًا خاصًا بها عبر window.TSK_MENU_EXTRA = {title, html}. */
(function(){
  "use strict";
  var TI={"menu-2": "<path d=\"M4 6l16 0\" /> <path d=\"M4 12l16 0\" /> <path d=\"M4 18l16 0\" />", "x": "<path d=\"M18 6l-12 12\" /> <path d=\"M6 6l12 12\" />", "search": "<path d=\"M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0\" /> <path d=\"M21 21l-6 -6\" />", "language": "<path d=\"M4 5h7\" /> <path d=\"M9 3v2c0 4.418 -2.239 8 -5 8\" /> <path d=\"M5 9c0 2.144 2.952 3.908 6.7 4\" /> <path d=\"M12 20l4 -9l4 9\" /> <path d=\"M19.1 18h-6.2\" />", "microscope": "<path d=\"M5 21h14\" /> <path d=\"M6 18h2\" /> <path d=\"M7 18v3\" /> <path d=\"M9 11l3 3l6 -6l-3 -3z\" /> <path d=\"M10.5 12.5l-1.5 1.5\" /> <path d=\"M17 3l3 3\" /> <path d=\"M12 21a6 6 0 0 0 3.715 -10.712\" />", "topology-star-3": "<path d=\"M10 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z\" /> <path d=\"M18 5a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z\" /> <path d=\"M10 5a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z\" /> <path d=\"M6 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z\" /> <path d=\"M18 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z\" /> <path d=\"M14 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z\" /> <path d=\"M22 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z\" /> <path d=\"M6 12h4\" /> <path d=\"M14 12h4\" /> <path d=\"M15 7l-2 3\" /> <path d=\"M9 7l2 3\" /> <path d=\"M11 14l-2 3\" /> <path d=\"M13 14l2 3\" />", "tags": "<path d=\"M3 8v4.172a2 2 0 0 0 .586 1.414l5.71 5.71a2.41 2.41 0 0 0 3.408 0l3.592 -3.592a2.41 2.41 0 0 0 0 -3.408l-5.71 -5.71a2 2 0 0 0 -1.414 -.586h-4.172a2 2 0 0 0 -2 2z\" /> <path d=\"M18 19l1.592 -1.592a4.82 4.82 0 0 0 0 -6.816l-4.592 -4.592\" /> <path d=\"M7 10h-.01\" />", "books": "<path d=\"M5 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z\" /> <path d=\"M9 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z\" /> <path d=\"M5 8h4\" /> <path d=\"M9 16h4\" /> <path d=\"M13.803 4.56l2.184 -.53c.562 -.135 1.133 .19 1.282 .732l3.695 13.418a1.02 1.02 0 0 1 -.634 1.219l-.133 .041l-2.184 .53c-.562 .135 -1.133 -.19 -1.282 -.732l-3.695 -13.418a1.02 1.02 0 0 1 .634 -1.219l.133 -.041z\" /> <path d=\"M14 9l4 -1\" /> <path d=\"M16 16l3.923 -.98\" />", "download": "<path d=\"M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2\"/><path d=\"M7 11l5 5l5 -5\"/><path d=\"M12 4l0 12\"/>", "calendar": "<path d=\"M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z\" /> <path d=\"M16 3v4\" /> <path d=\"M8 3v4\" /> <path d=\"M4 11h16\" />", "timeline": "<path d=\"M4 16l6 -7l5 5l5 -6\" /> <circle cx=\"15\" cy=\"14\" r=\"1.5\" /> <circle cx=\"10\" cy=\"9\" r=\"1.5\" /> <circle cx=\"4\" cy=\"16\" r=\"1.5\" /> <circle cx=\"20\" cy=\"8\" r=\"1.5\" />", "home": "<path d=\"M5 12l-2 0l9 -9l9 9l-2 0\" /> <path d=\"M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7\" /> <path d=\"M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6\" />"}, AR={"Gen": "التكوين", "Exo": "الخروج", "Lev": "اللاويين", "Num": "العدد", "Deu": "التثنية", "Jos": "يشوع", "Jdg": "القضاة", "Rut": "راعوث", "1Sa": "صموئيل الأول", "2Sa": "صموئيل الثاني", "1Ki": "الملوك الأول", "2Ki": "الملوك الثاني", "1Ch": "أخبار الأيام الأول", "2Ch": "أخبار الأيام الثاني", "Ezr": "عزرا", "Neh": "نحميا", "Est": "أستير", "Job": "أيوب", "Psa": "المزامير", "Pro": "الأمثال", "Ecc": "الجامعة", "Son": "نشيد الأنشاد", "Isa": "إشعياء", "Jer": "إرميا", "Lam": "مراثي إرميا", "Eze": "حزقيال", "Dan": "دانيال", "Hos": "هوشع", "Joe": "يوئيل", "Amo": "عاموس", "Oba": "عوبديا", "Jon": "يونان", "Mic": "ميخا", "Nah": "ناحوم", "Hab": "حبقوق", "Zep": "صفنيا", "Hag": "حجي", "Zec": "زكريا", "Mal": "ملاخي", "Mat": "متى", "Mar": "مرقس", "Luk": "لوقا", "Joh": "يوحنا", "Act": "أعمال الرسل", "Rom": "رومية", "1Co": "كورنثوس الأولى", "2Co": "كورنثوس الثانية", "Gal": "غلاطية", "Eph": "أفسس", "Phi": "فيلبي", "Col": "كولوسي", "1Th": "تسالونيكي الأولى", "2Th": "تسالونيكي الثانية", "1Ti": "تيموثاوس الأولى", "2Ti": "تيموثاوس الثانية", "Tit": "تيطس", "Phm": "فليمون", "Heb": "العبرانيين", "Jam": "يعقوب", "1Pe": "بطرس الأولى", "2Pe": "بطرس الثانية", "1Jo": "يوحنا الأولى", "2Jo": "يوحنا الثانية", "3Jo": "يوحنا الثالثة", "Jud": "يهوذا", "Rev": "الرؤيا"}, SH={"Gen": "تك", "Exo": "خر", "Lev": "لا", "Num": "عد", "Deu": "تث", "Jos": "يش", "Jdg": "قض", "Rut": "را", "1Sa": "١صم", "2Sa": "٢صم", "1Ki": "١مل", "2Ki": "٢مل", "1Ch": "١أخ", "2Ch": "٢أخ", "Ezr": "عز", "Neh": "نح", "Est": "أس", "Job": "أي", "Psa": "مز", "Pro": "أم", "Ecc": "جا", "Son": "نش", "Isa": "إش", "Jer": "إر", "Lam": "مرا", "Eze": "حز", "Dan": "دا", "Hos": "هو", "Joe": "يؤ", "Amo": "عا", "Oba": "عو", "Jon": "يون", "Mic": "مي", "Nah": "نا", "Hab": "حب", "Zep": "صف", "Hag": "حج", "Zec": "زك", "Mal": "ملا", "Mat": "مت", "Mar": "مر", "Luk": "لو", "Joh": "يو", "Act": "أع", "Rom": "رو", "1Co": "١كو", "2Co": "٢كو", "Gal": "غل", "Eph": "أف", "Phi": "في", "Col": "كو", "1Th": "١تس", "2Th": "٢تس", "1Ti": "١تي", "2Ti": "٢تي", "Tit": "تي", "Phm": "فل", "Heb": "عب", "Jam": "يع", "1Pe": "١بط", "2Pe": "٢بط", "1Jo": "١يو", "2Jo": "٢يو", "3Jo": "٣يو", "Jud": "يه", "Rev": "رؤ"};
  var ABBR=Object.keys(AR);
  var BKGRP=[["التوراة (الخمسة)",1,5],["الأسفار التاريخية",6,17],["أسفار الشعر والحكمة",18,22],["الأنبياء الكبار",23,27],["الأنبياء الصغار",28,39],["الأناجيل وأعمال الرسل",40,44],["رسائل بولس",45,57],["الرسائل العامة",58,65],["الرؤيا",66,66]];
  var ic=function(n){return '<svg class="tic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(TI[n]||"")+'</svg>'};
  var page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  var TIME=[["chrono.html","calendar","القراءة الزمنية (٣٦٥ يومًا)"],["timeline.html","timeline","الخط الزمني للأحداث"]];
  var TOOLS=[["search.html","search","بحث في الكتاب المقدس (فاندايك)"],["strong.html","language","بحث في قاموس سترونج (برقم الكلمة)"],
    ["arword.html","language","بحث بكلمة عربية (الجذر والأصل)"],["grammar.html","microscope","بحث نحوي باللغات الأصلية"],
    ["mindmap.html","topology-star-3","الخريطة الذهنية للشواهد"],["topics.html","tags","فهرس المواضيع (٤٦ ألف موضوع)"]];
  var OTHER=[["sources.html","books","المصادر والمراجع"]];

  /* ---------- اذهب إلى عدد: «يو ٣: ١٦» أو «مز ٢٣» أو كلمة → البحث ---------- */
  var nz=function(x){return String(x).replace(/[٠-٩]/g,function(d){return "٠١٢٣٤٥٦٧٨٩".indexOf(d)}).replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/[ً-ْ\s.]/g,"").toLowerCase()};
  function parseRef(q){
    var m=q.trim().replace(/[٠-٩]/g,function(d){return "٠١٢٣٤٥٦٧٨٩".indexOf(d)}).match(/^(.*?)\s*(\d+)?\s*[:\s٫.]\s*(\d+)$|^(.*?)\s*(\d+)?$/);
    if(!m) return null;
    var name=nz(m[1]!=null?m[1]:m[4]), c=m[2]||m[5], v=m[3]; if(!name) return null;
    var ab=ABBR.find(function(a){return [AR[a],SH[a],a].some(function(t){return nz(t)===name})})||((c||v)&&ABBR.find(function(a){return nz(AR[a]).indexOf(name)===0}));
    if(!ab) return null;
    return ab+".html#/"+ab+(c?(v?"/"+c+":"+v:"/ch/"+c):"");
  }

  /* ---------- اللوحة ---------- */
  var link=function(t){var on=t[0]===page;return '<a class="tool'+(on?' sm-on':'')+'" href="'+t[0]+'"'+(on?' aria-current="page"':'')+'>'+ic(t[1])+' '+t[2]+'</a>'};
  var sec=function(title,body){return '<div class="side-sec"><h4>'+title+'</h4>'+body+'</div>'};
  var books=BKGRP.map(function(g){var bs=ABBR.slice(g[1]-1,g[2]);
    return '<details class="bkg"><summary>'+g[0]+'<b>'+bs.length+'</b></summary><div class="booksel sm-books">'+bs.map(function(a){
      return '<a href="'+a+'.html#/'+a+'"><span class="ab">'+SH[a]+'</span><span class="nm"><b>'+AR[a]+'</b></span></a>'}).join("")+'</div></details>'}).join("");
  var panel=null, scrim=null, btn=null, last=null;
  function build(){
    if(panel) return;
    scrim=document.createElement("div"); scrim.className="sm-scrim";
    panel=document.createElement("aside"); panel.className="sm-panel"; panel.setAttribute("role","dialog"); panel.setAttribute("aria-modal","true"); panel.setAttribute("aria-label","القائمة");
    var extra=window.TSK_MENU_EXTRA;
    panel.innerHTML='<div class="sm-head"><a class="sm-home" href="index.html">'+ic("home")+' الصفحة الرئيسية</a><button type="button" class="sm-x" aria-label="إغلاق">'+ic("x")+'</button></div>'+
      sec("اذهب إلى عدد",'<form class="gotobox sm-go"><input placeholder="مثال: يو ٣:١٦ أو إش ٥٣" aria-label="اذهب إلى عدد أو ابحث عن كلمة" autocomplete="off" enterkeyhint="go"></form>')+
      sec("الأسفار",books)+
      sec("الكتاب عبر الزمن",TIME.map(link).join(""))+
      sec("أدوات البحث",TOOLS.map(link).join(""))+
      sec("صفحات أخرى",OTHER.map(link).join("")+'<button type="button" class="tool sm-off">'+ic("download")+' التنزيل للاستخدام دون إنترنت</button>')+
      (extra&&extra.title?'<div class="side-sec sm-extra"><h4>'+extra.title+'</h4>'+extra.html+'</div>':"");
    document.body.appendChild(scrim); document.body.appendChild(panel);
    scrim.addEventListener("click",close);
    panel.querySelector(".sm-x").addEventListener("click",close);
    panel.addEventListener("click",function(e){var a=e.target.closest("a[href^='#']");if(a)close()});
    panel.querySelector(".sm-go").addEventListener("submit",function(e){
      e.preventDefault(); var i=this.querySelector("input"), q=i.value.trim();
      if(!q){i.focus();return}
      location.href=parseRef(q)||("search.html?q="+encodeURIComponent(q));
    });
    panel.querySelector(".sm-off").addEventListener("click",function(){
      close(); if(window.OFFLINE_UI) return window.OFFLINE_UI.open();
      var x=document.createElement("script"); x.src="assets/offline.js"; document.head.appendChild(x);
    });
  }
  function open(){build();last=document.activeElement;panel.classList.add("on");scrim.classList.add("on");if(btn)btn.setAttribute("aria-expanded","true");document.documentElement.style.overflow="hidden";setTimeout(function(){panel.querySelector(".sm-x").focus()},60)}
  function close(){if(!panel||!panel.classList.contains("on"))return;panel.classList.remove("on");scrim.classList.remove("on");if(btn)btn.setAttribute("aria-expanded","false");document.documentElement.style.overflow="";if(last&&last.focus)last.focus()}
  document.addEventListener("keydown",function(e){if(e.key==="Escape")close()});
  window.TSKMenu={open:open,close:close};

  /* ---------- الزرار (للصفحات اللي فيها الشريط العلوي) ---------- */
  var bar=document.querySelector(".sitebar, .mmbar");  /* .mmbar = شريط الخريطة الذهنية */
  if(bar && !bar.querySelector(".sb-menu")){
    btn=document.createElement("button");
    btn.type="button"; btn.className="sb-menu"; btn.setAttribute("aria-label","القائمة"); btn.setAttribute("aria-haspopup","dialog"); btn.setAttribute("aria-expanded","false");
    btn.innerHTML=ic("menu-2");
    bar.insertBefore(btn,bar.firstChild);
    btn.addEventListener("click",open);
  }
})();
