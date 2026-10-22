/* جدد وعتقاء — التنقل داخل التطبيق المثبّت: الروابط الداخلية تفتح في نفس النافذة مع زر «رجوع». في المتصفح العادي لا يتغير شيء. */
(function () {
  var app = false;
  try { app = matchMedia("(display-mode: standalone)").matches || matchMedia("(display-mode: window-controls-overlay)").matches || navigator.standalone === true; } catch (e) {}
  if (!app) return;
  var K = "tsk:from", page = location.pathname.split("/").pop() || "index.html";
  function put(v) { try { v ? sessionStorage.setItem(K, JSON.stringify(v)) : sessionStorage.removeItem(K); } catch (e) {} }
  function get() { try { return JSON.parse(sessionStorage.getItem(K) || "null"); } catch (e) { return null; } }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[target]");
    if (!a || e.defaultPrevented) return;
    var u; try { u = new URL(a.href, location.href); } catch (x) { return; }
    if (u.origin !== location.origin) { a.rel = "noopener"; return; }
    a.removeAttribute("target");
    put({ d: Date.now(), u: location.href, t: (document.title || "").split("|")[0].split("—")[0].trim().slice(0, 28), p: page });
  }, true);
  var f = get();
  if (!f || f.u === location.href || Date.now() - (f.d || 0) > 1800000) return;
  function show() {
    var b = document.createElement("button");
    b.type = "button"; b.setAttribute("aria-label", "رجوع");
    b.style.cssText = "position:fixed;right:14px;bottom:14px;z-index:70;display:inline-flex;align-items:center;gap:6px;max-width:70vw;padding:0 16px;height:44px;border-radius:999px;border:1px solid var(--gold,#b8892f);background:var(--bg,#fff);color:var(--gold,#b8892f);font:600 14px var(--ui,system-ui);cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.15)";
    b.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/></svg><span></span>';
    b.lastChild.textContent = "رجوع" + (f.t ? " إلى " + f.t : "");
    b.lastChild.style.cssText = "overflow:hidden;text-overflow:ellipsis;white-space:nowrap";
    b.onclick = function () { put(null); if (history.length > 1) history.back(); else location.href = f.u; };
    document.body.appendChild(b);
  }
  if (document.body) show(); else document.addEventListener("DOMContentLoaded", show);
})();
