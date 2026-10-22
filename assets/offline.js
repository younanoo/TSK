/* جدد وعتقاء — نافذة التنزيل للاستخدام دون إنترنت.
   تحمّل الحزم التي يختارها المستخدم؛ الـservice worker يخزّن كل ملف يُطلب منه فتصبح الحزمة متاحة دون اتصال. */
(function () {
  if (window.OFFLINE_UI) return;
  var CACHE = "jw-files";
  var DL = '<svg class="tic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/><path d="M7 11l5 5l5 -5"/><path d="M12 4l0 12"/></svg>';
  var CSS = "#offDlg{border:1px solid var(--gold);border-radius:16px;padding:0;max-width:560px;width:calc(100% - 24px);background:var(--paper,var(--bg));color:var(--ink);box-shadow:0 12px 40px rgba(0,0,0,.35)}" +
    "#offDlg::backdrop{background:rgba(0,0,0,.45)}#offDlg .oh{display:flex;align-items:center;gap:8px;padding:14px 18px;border-bottom:1px solid var(--line)}#offDlg .oh h3{margin:0;font:700 17px var(--ui);flex:1}" +
    "#offDlg .ox{border:0;background:transparent;color:var(--muted);font-size:22px;cursor:pointer;line-height:1}#offDlg .ob{padding:14px 18px;max-height:62vh;overflow:auto}" +
    "#offDlg p.oi{margin:0 0 10px;font:13px/1.8 var(--ui);color:var(--muted)}#offDlg .opre{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 12px}" +
    "#offDlg .opre button{font:12.5px var(--ui);border:1px solid var(--gold);color:var(--gold);background:transparent;border-radius:999px;padding:4px 12px;cursor:pointer}#offDlg .opre button:hover{background:var(--gold);color:var(--on-gold)}" +
    "#offDlg label.og{display:flex;gap:10px;align-items:flex-start;padding:9px 10px;border:1px solid var(--line);border-radius:12px;margin-bottom:8px;cursor:pointer}#offDlg label.og.on{border-color:var(--gold);background:var(--gold-soft)}" +
    "#offDlg label.og input{margin-top:3px;accent-color:var(--gold);width:17px;height:17px;flex:none}#offDlg .ot{flex:1}#offDlg .ot b{display:block;font:600 14px var(--ui)}#offDlg .ot small{display:block;font:12px/1.7 var(--ui);color:var(--muted)}" +
    "#offDlg .os{font:600 13px var(--ui);white-space:nowrap;color:var(--gold);text-align:end}#offDlg .os em{display:block;font:11px var(--ui);color:var(--muted);font-style:normal}#offDlg .os .ok{color:#2e7d32}" +
    "#offDlg .of{padding:12px 18px;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:8px}#offDlg .osum{font:600 14px var(--ui)}#offDlg .osum small{font:12px var(--ui);color:var(--muted);font-weight:400}" +
    "#offDlg .obar{height:10px;border-radius:999px;background:var(--line);overflow:hidden;display:none}#offDlg .obar i{display:block;height:100%;width:0;background:var(--gold);transition:width .2s}" +
    "#offDlg .oact{display:flex;gap:8px;flex-wrap:wrap}#offDlg .oact button{font:600 14px var(--ui);border-radius:10px;padding:8px 16px;cursor:pointer;border:1px solid var(--gold);background:var(--gold);color:var(--on-gold)}" +
    "#offDlg .oact button.sec{background:transparent;color:var(--gold)}#offDlg .oact button:disabled{opacity:.5;cursor:default}#offDlg .omsg{font:13px/1.8 var(--ui)}";
  var n = function (x) { return String(x).replace(/\d/g, function (d) { return "٠١٢٣٤٥٦٧٨٩"[d]; }); };
  var mb = function (b) { return b >= 1e9 ? n((b / 1e9).toFixed(1)) + " جيجا" : b >= 1e6 ? n(Math.round(b / 1e5) / 10) + " ميغا" : n(Math.max(1, Math.round(b / 1e3))) + " كيلو"; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var G = [], have = {}, busy = false, stop = false, dlg;

  function cachedSet() {
    return (window.caches ? caches.open(CACHE).then(function (c) { return c.keys(); }) : Promise.resolve([])).then(function (ks) {
      var base = new URL(".", document.baseURI).pathname, set = {};
      ks.forEach(function (r) { var u = new URL(r.url); set[decodeURIComponent(u.pathname.slice(base.length))] = 1; });
      return set;
    }).catch(function () { return {}; });
  }
  function missing(g) { return g.files.filter(function (p) { return !have[p]; }); }
  function remBytes(g) { var m = missing(g).length; return g.files.length ? Math.round(g.bytes * m / g.files.length) : 0; }

  function build() {
    var el = document.createElement("dialog"); el.id = "offDlg";
    el.innerHTML = '<div class="oh">' + DL + '<h3>التنزيل للاستخدام دون إنترنت</h3><button class="ox" id="offX" aria-label="إغلاق">×</button></div>' +
      '<div class="ob"><p class="oi">اختر نوع الحزمة التي تريد حفظها على جهازك. الأحجام المذكورة هي حجم التنزيل الفعلي تقريبًا، وما تم تنزيله سابقًا لا يُحمَّل مرة أخرى. يُفضَّل استخدام شبكة Wi‑Fi للحزم الكبيرة.</p>' +
      '<div id="offList"></div></div>' +
      '<div class="of"><div class="osum" id="offSum"></div><div class="obar" id="offBar"><i></i></div><div class="omsg" id="offMsg"></div>' +
      '<div class="oact"><button id="offGo">' + "تنزيل المحدد" + '</button><button class="sec" id="offStop" style="display:none">إيقاف</button><button class="sec" id="offClr">مسح النسخة المخزَّنة</button></div></div>';
    document.body.appendChild(el); return el;
  }
  var MODE = "app";
  function isImg(g) { return /^img_/.test(g.id); }
  function chosen() { return G.filter(function (g) { return g.req || !isImg(g) || MODE === "img"; }); }
  function total() { return chosen().reduce(function (a, g) { return a + remBytes(g); }, 0); }
  function sum() {
    var t = total();
    $("#offSum").innerHTML = t ? "حجم التنزيل: " + mb(t) : "كل المحدد منزَّل بالفعل ✓";
    ["app", "img"].forEach(function (k) { var l = $("#ol_" + k); l && l.classList.toggle("on", MODE === k); });
    $("#offGo").disabled = busy || !t;
    if (navigator.storage && navigator.storage.estimate) navigator.storage.estimate().then(function (e) {
      if (e.quota) $("#offSum").innerHTML += ' <small>· المساحة المتاحة نحو ' + mb(e.quota - e.usage) + "</small>";
    }).catch(function () {});
  }
  function list() {
    var opts = [
      ["app", "التطبيق بدون الصور", "كل الأسفار والترجمات والبحث والخرائط الذهنية — بدون صور الأصحاحات. أخف وأسرع.", function (g) { return !isImg(g); }],
      ["img", "التطبيق مع الصور", "كل ما سبق مع صور الأسفار والأصحاحات، فتعمل كلها دون إنترنت.", function () { return true; }]
    ];
    $("#offList").innerHTML = opts.map(function (o) {
      var gs = G.filter(o[3]), by = gs.reduce(function (a, g) { return a + g.bytes; }, 0), rem = gs.reduce(function (a, g) { return a + remBytes(g); }, 0);
      return '<label class="og" id="ol_' + o[0] + '"><input type="radio" name="offmode" id="og_' + o[0] + '"' + (MODE === o[0] ? " checked" : "") + '><span class="ot"><b>' + o[1] + '</b><small>' + o[2] + '</small></span>' +
        '<span class="os">' + mb(by) + (rem === 0 ? '<em class="ok">✓ منزَّل</em>' : (rem < by ? '<em>باقٍ ' + mb(rem) + '</em>' : "")) + '</span></label>';
    }).join("");
    opts.forEach(function (o) { $("#og_" + o[0]).addEventListener("change", function () { MODE = o[0]; sum(); }); });
    sum();
  }
  function run() {
    var sel = chosen(), q = [], need = 0, done = 0;
    sel.forEach(function (g) { missing(g).forEach(function (p) { q.push({ p: p, g: g }); }); });
    if (!q.length) return;
    var bytesAll = total(), got = 0;
    busy = true; stop = false; $("#offGo").disabled = true; $("#offStop").style.display = ""; $("#offBar").style.display = "block"; $("#offMsg").textContent = "";
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function () {});
    var avgBytes = {}; sel.forEach(function (g) { avgBytes[g.id] = g.files.length ? g.bytes / g.files.length : 0; });
    var fails = 0, i = 0;
    function tick() { $("#offBar").firstChild.style.width = Math.min(100, Math.round(got / bytesAll * 100)) + "%"; $("#offMsg").textContent = "جارٍ التنزيل… " + n(Math.min(100, Math.round(got / bytesAll * 100))) + "٪ (" + n(done) + " من " + n(q.length) + " ملف)"; }
    function worker() {
      if (stop || i >= q.length) return Promise.resolve();
      var it = q[i++];
      return fetch(it.p).then(function (r) { if (!r.ok) throw 0; return r.blob(); }).then(function () { have[it.p] = 1; }).catch(function () { fails++; })
        .then(function () { done++; got += avgBytes[it.g.id]; tick(); return worker(); });
    }
    var ws = []; for (var k = 0; k < 6; k++) ws.push(worker());
    Promise.all(ws).then(cachedSet).then(function (s) {
      have = s; busy = false; $("#offStop").style.display = "none"; list();
      $("#offBar").firstChild.style.width = stop ? $("#offBar").firstChild.style.width : "100%";
      $("#offMsg").textContent = stop ? "تم الإيقاف. يمكنك المتابعة لاحقًا، وما تم تنزيله محفوظ." : fails ? "اكتمل التنزيل مع تعذّر " + n(fails) + " ملف؛ أعد المحاولة." : "اكتمل التنزيل ✓ — يمكنك الآن استخدام المحدد دون إنترنت.";
    });
  }
  function open(m) {
    if (m === "app" || m === "img") MODE = m;
    if (!("serviceWorker" in navigator) || !window.caches) { alert("المتصفح لا يدعم التخزين للاستخدام دون إنترنت."); return; }
    if (!document.getElementById("offCss")) { var st = document.createElement("style"); st.id = "offCss"; st.textContent = CSS; document.head.appendChild(st); }
    dlg = dlg || build();
    $("#offX").onclick = function () { if (!busy || confirm("التنزيل جارٍ. هل تريد الإغلاق؟ سيستمر في الخلفية.")) dlg.close(); };
    $("#offStop").onclick = function () { stop = true; };
    $("#offGo").onclick = run;
    $("#offClr").onclick = function () { if (busy || !confirm("سيُحذف كل ما حُفظ للاستخدام دون إنترنت. متابعة؟")) return; caches.delete(CACHE).then(function () { have = {}; list(); $("#offMsg").textContent = "تم المسح. ستُحفظ الملفات من جديد عند فتحها."; }); };
    navigator.serviceWorker.ready.then(function () { return Promise.all([fetch("assets/offline.json").then(function (r) { return r.json(); }), cachedSet()]); }).then(function (r) {
      G = r[0]; have = r[1]; list(); $("#offMsg").textContent = ""; if (!dlg.open) dlg.showModal();
    }).catch(function () { alert("تعذّر تحميل قائمة الحزم. تحقّق من الاتصال."); });
  }
  window.OFFLINE_UI = { open: open };
  open(window.OFFLINE_MODE);
})();
