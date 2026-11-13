/* جدد وعتقاء — Google Analytics 4 (G-VWFXV1LGMT)
   يتحمّل من brand.js في كل الصفحات (ما عدا 404 وoffline وscreen وcopy وdictcopy).
   - لا يرسل شيئًا إلا على godod.app (أو أي رابط فيه ?ga_debug=1 للتجربة في DebugView).
   - مكتبة جوجل تتحمّل بعد تحميل الصفحة، فلا تؤثر على سرعة ظهور النص؛ الأحداث قبلها تنتظر في الطابور.
   الأحداث:
   pwa_install · install_prompt (available/accepted/dismissed) · app_open
   read_book · read_chapter · read_verse (book, chapter, verse)
   mode_switch (mode) · strong_open · presentation_open · external_screen · ask_ai
   offline_open · report_error · ga_click (لأي عنصر عليه data-ga="اسم") */
(function () {
  var ID = "G-VWFXV1LGMT";
  var dbg = /[?&]ga_debug=1/.test(location.search);
  if (!dbg && !/(^|\.)godod\.app$/.test(location.hostname)) return;
  if (window.__tskGA) return; window.__tskGA = 1;

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  var app = false;
  try { app = matchMedia("(display-mode: standalone)").matches || matchMedia("(display-mode: window-controls-overlay)").matches || navigator.standalone === true; } catch (e) {}

  gtag("js", new Date());
  gtag("set", { display_mode: app ? "app" : "browser" });
  gtag("config", ID, dbg ? { debug_mode: true } : {});

  function ev(name, p) { try { gtag("event", name, p || {}); } catch (e) {} }
  window.tskTrack = ev;

  /* ---------- التطبيق ---------- */
  if (app) { try { if (!sessionStorage.getItem("tsk:gaopen")) { sessionStorage.setItem("tsk:gaopen", "1"); ev("app_open"); } } catch (e) { ev("app_open"); } }
  addEventListener("appinstalled", function () { ev("pwa_install", { method: "browser" }); });
  addEventListener("beforeinstallprompt", function (e) {
    ev("install_prompt", { result: "available" });
    try { e.userChoice.then(function (r) { ev("install_prompt", { result: r && r.outcome === "accepted" ? "accepted" : "dismissed" }); }); } catch (x) {}
  });

  /* ---------- القراءة: #/Eph · #/Eph/ch/3 · #/Eph/3:4 ---------- */
  var page = (location.pathname.split("/").pop() || "index.html").replace(/\.html$/, ""), last = "";
  function route() {
    var h = decodeURIComponent(location.hash || ""), m, key;
    if ((m = h.match(/^#\/([1-3]?[A-Za-z]{2,3})\/ch\/(\d+)/))) { key = "c" + m[1] + m[2]; if (key !== last) ev("read_chapter", { book: m[1], chapter: +m[2] }); }
    else if ((m = h.match(/^#\/([1-3]?[A-Za-z]{2,3})\/(\d+):(\d+)/))) { key = "v" + m[1] + m[2] + ":" + m[3]; if (key !== last) ev("read_verse", { book: m[1], chapter: +m[2], verse: +m[3] }); }
    else if ((m = h.match(/^#\/([1-3]?[A-Za-z]{2,3})\/?$/))) { key = "b" + m[1]; if (key !== last) ev("read_book", { book: m[1] }); }
    else return;
    last = key;
  }
  function bookOf() { var m = (location.hash || "").match(/^#\/([1-3]?[A-Za-z]{2,3})/); return m ? m[1] : page; }
  addEventListener("hashchange", route);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", route); else route();

  /* ---------- المميزات: نلفّ دوال الفتح لما ملفاتها تتحمّل (حتى لو اتحمّلت متأخر) ---------- */
  function wrap(obj, fn, name, extra) {
    if (!obj || typeof obj[fn] !== "function" || obj[fn].__ga) return;
    var orig = obj[fn];
    obj[fn] = function () { ev(name, Object.assign({ book: bookOf() }, extra || {})); return orig.apply(this, arguments); };
    obj[fn].__ga = 1;
  }
  var HOOKS = {
    PRES: function (o) { wrap(o, "open", "presentation_open"); },
    SCR: function (o) { wrap(o, "start", "external_screen"); },
    CHS: function (o) { wrap(o, "open", "strong_open", { where: "chapter" }); },
    AskAI: function (o) { wrap(o, "open", "ask_ai"); wrap(o, "fromEl", "ask_ai"); },
    LISTPRES: function (o) { wrap(o, "open", "presentation_open", { where: "list" }); }
  };
  Object.keys(HOOKS).forEach(function (k) {
    if (window[k]) { HOOKS[k](window[k]); return; }
    try {
      var v;
      Object.defineProperty(window, k, { configurable: true, enumerable: true,
        get: function () { return v; },
        set: function (x) { v = x; try { HOOKS[k](x); } catch (e) {} } });
    } catch (e) {}
  });

  /* ---------- نقرات ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target; if (!t || !t.closest) return;
    var a;
    if ((a = t.closest("[data-umode]"))) return ev("mode_switch", { mode: a.getAttribute("data-umode") });
    if ((a = t.closest('a[target="tskcontact"]'))) return ev("report_error", { book: bookOf() });
    if ((a = t.closest("#offBtn"))) return ev("offline_open");
    if ((a = t.closest("[data-ga]"))) return ev("ga_click", { name: a.getAttribute("data-ga") });
    /* قاموس سترونج في صفحة العدد: أي رقم سترونج داخل نص الآية */
    if (/:\d+/.test(location.hash) && (a = t.closest(".sn")) && !t.closest("#dict")) return ev("strong_open", { where: "verse", book: bookOf() });
  }, true);

  /* ---------- مكتبة جوجل بعد تحميل الصفحة ---------- */
  function load() {
    var s = document.createElement("script"); s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
    document.head.appendChild(s);
  }
  if (document.readyState === "complete") setTimeout(load, 0); else addEventListener("load", function () { setTimeout(load, 0); });
})();
