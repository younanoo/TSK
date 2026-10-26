"""Fix: infinite loop when strong.js / sidx.js fail to load (offline, not downloaded).
Usage: python3 fix_loadjs.py path/to/app.js
Each replacement must match exactly once, otherwise nothing is written."""
import sys
p = sys.argv[1]
s = open(p, encoding="utf-8").read()

R = [
# 1) loadJS remembers failures (JSFAIL) + retryJS lets a retry button load the file again
("""function loadJS(src,cb){if(LOADED[src]===true){cb&&cb();return}if(LOADED[src]){LOADED[src].push(cb);return}
  LOADED[src]=[cb];const s=document.createElement("script");s.src=src;s.onload=s.onerror=()=>{const q=LOADED[src];LOADED[src]=true;q.forEach(f=>f&&f())};document.body.appendChild(s)}""",
"""const JSFAIL={}; /* الملفات اللي فشل تحميلها (مثلًا offline قبل التنزيل) */
function retryJS(src){if(JSFAIL[src]){delete LOADED[src];delete JSFAIL[src]}}
function loadJS(src,cb){if(LOADED[src]===true){cb&&cb();return}if(LOADED[src]){LOADED[src].push(cb);return}
  LOADED[src]=[cb];const s=document.createElement("script");s.src=src;s.onload=s.onerror=ev=>{if(ev&&ev.type==="error")JSFAIL[src]=true;const q=LOADED[src];LOADED[src]=true;q.forEach(f=>f&&f())};document.body.appendChild(s)}"""),

# 2) needStrong / needSidx: call cb only when the data really arrived, otherwise fail (async, so the caller's "loading" text never overwrites the error)
("""function needStrong(cb){if(window.STRONG&&Object.keys(window.STRONG).length){STRONG=window.STRONG;return true}
  loadJS("assets/strong.js",()=>{STRONG=window.STRONG||{};cb&&cb()});return false}
function needSidx(cb){if(window.SIDX)return true;loadJS("assets/sidx.js",cb);return false}""",
"""function needStrong(cb,fail){if(window.STRONG&&Object.keys(window.STRONG).length){STRONG=window.STRONG;return true}
  loadJS("assets/strong.js",()=>setTimeout(()=>{STRONG=window.STRONG||{};if(Object.keys(STRONG).length)cb&&cb();else fail&&fail()}));return false}
function needSidx(cb,fail){if(window.SIDX)return true;loadJS("assets/sidx.js",()=>setTimeout(()=>{if(window.SIDX)cb&&cb();else fail&&fail()}));return false}
const loadFail=(what,attr)=>`<div class="empty loadfail">تعذّر تحميل ${what} — غالبًا الجهاز غير متصل بالإنترنت، وهذا الجزء لم يُنزَّل للاستخدام دون إنترنت بعد. <button type="button" class="trb" ${attr}>إعادة المحاولة</button></div>`;"""),

# 3) showEntry: error message + retry instead of endless "loading"
("""  if(!needStrong(()=>showEntry(num,{fromRef,scroll}))){const bx=$("#dict");if(bx)bx.innerHTML=`<div class="empty">جارٍ تحميل قاموس سترونج…</div>`;return}""",
"""  if(!needStrong(()=>showEntry(num,{fromRef,scroll}),()=>{const bx=$("#dict");if(bx)bx.innerHTML=loadFail("قاموس سترونج",`data-jsretry="assets/strong.js" data-dn="${num}"`)})){const bx=$("#dict");if(bx)bx.innerHTML=`<div class="empty loading">جارٍ تحميل قاموس سترونج…</div>`;return}"""),

# 4) search view (sidx.js)
("""  if(!needSidx(()=>{if(S.view==="search")render()})){$("#main").innerHTML=crumbs("جارٍ التحميل…","");return}""",
"""  if(!needSidx(()=>{if(S.view==="search")render()},()=>{if(S.view==="search")$("#main").innerHTML=crumbs("تعذّر التحميل","")+loadFail("فهرس البحث",`data-jsretry="assets/sidx.js"`)})){$("#main").innerHTML=crumbs("جارٍ التحميل…","");return}"""),

# 5) Strong number view
("""  if(!needStrong(()=>render())){$("#main").innerHTML=crumbs("جارٍ تحميل قاموس سترونج…","");return}""",
"""  if(!needStrong(()=>render(),()=>{$("#main").innerHTML=crumbs("تعذّر التحميل","")+loadFail("قاموس سترونج",`data-jsretry="assets/strong.js"`)})){$("#main").innerHTML=crumbs("جارٍ تحميل قاموس سترونج…","");return}"""),

# 6) retry button handler (top of the main click handler)
("""document.addEventListener("click",e=>{
  const sr=e.target.closest(".sref");""",
"""document.addEventListener("click",e=>{
  const jr=e.target.closest("[data-jsretry]"); if(jr){retryJS(jr.dataset.jsretry); if(!jr.dataset.dn){render();return}}
  const sr=e.target.closest(".sref");"""),
]

for old, new in R:
    c = s.count(old)
    if c != 1:
        sys.exit(f"ABORT: expected 1 match, found {c} for:\n{old[:120]}")
    s = s.replace(old, new)
open(p, "w", encoding="utf-8").write(s)
print("patched OK:", p)
