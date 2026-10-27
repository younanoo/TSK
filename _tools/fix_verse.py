"""Verse page fixes:
1) Interlinear: clicking a Strong number opens the dictionary panel (like normal view) instead of strong.html.
2) Heading above the TSK cross-references.
3) Berean interlinear on the verse page no longer stays on «جارٍ التحميل» after its data loads.
4) Interlinear on the verse page loads Strong's data so the original word + transliteration show.
Usage: python3 fix_verse.py path/to/app.js   (every replacement must match exactly once)"""
import sys
p = sys.argv[1]; s = open(p, encoding="utf-8").read()
R = [
("""    ${dictSection(d)}
    ${d.groups.length>0?`<nav class="kw-index">""",
"""    ${dictSection(d)}
    <div class="tskhead" id="tskSec"><h2>${ic("arrows-shuffle")} الشواهد المقابلة من TSK</h2><p>من «كنز معرفة الكتاب المقدس» (Treasury of Scripture Knowledge): الآيات المرتبطة بكلمات هذا العدد${refCount(d)?` — ${plural(refCount(d),"شاهد واحد","شاهدان","شواهد","شاهدًا")}`:""}.</p></div>
    ${d.groups.length>0?`<nav class="kw-index">"""),

("""function showEntry(num,{fromRef=false,scroll=true}={}){""",
"""/* Interlinear في صفحة العدد: الضغط على رقم سترونج يفتح القاموس في الصفحة (زي العرض العادي) بدل صفحة سترونج.
   capture على window علشان يسبق nav.js ويمنع فتح الرابط. في صفحة الأصحاح (مفيش #dict) الرابط يفضل زي ما هو. */
window.addEventListener("click",e=>{const a=e.target.closest&&e.target.closest(".ilist a.iln");if(!a||!$("#dict"))return;
  const num=(a.getAttribute("href")||"").split("#")[1]||a.textContent.trim();if(!/^[GH]\\d+$/.test(num))return;
  e.preventDefault();e.stopPropagation();showEntry(num)},true);
function showEntry(num,{fromRef=false,scroll=true}={}){"""),

("""function bsbLoad(abbr){const rr=()=>{if(S.view==="chapter")render()};""",
"""function bsbLoad(abbr){const rr=()=>{if(S.view==="chapter"||S.view==="verse")render()}; /* صفحة العدد كانت بتفضل على «جارٍ التحميل» */"""),

("""function viewVerse(){
  DICT={cur:null,hist:[],trail:[]};""",
"""function viewVerse(){
  DICT={cur:null,hist:[],trail:[]};
  if(store.get("inter",false)) needStrong(()=>{if(S.view==="verse")render()}); /* الكلمة الأصلية ونطقها في خانات Interlinear */"""),
]
for o, n in R:
    c = s.count(o)
    if c != 1: sys.exit(f"ABORT {c}: {o[:80]}")
    s = s.replace(o, n)
open(p, "w", encoding="utf-8").write(s); print("patched", p)
