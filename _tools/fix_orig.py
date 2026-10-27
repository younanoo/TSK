"""Chapter view: add «اللغة الأصلية» next to the translations — shows the Hebrew/Aramaic/Greek text
(Berean tables: WLC / Nestle base) in original word order, without English or transliteration.
Data: assets/orig_<Book>.js built by _tools/build_orig.py.
Usage: python3 fix_orig.py path/to/app.js   (every replacement must match exactly once)"""
import sys
p = sys.argv[1]; s = open(p, encoding="utf-8").read()
R = [
# helpers + chip in the chapter's translation bar (trBar(extra) is called with `extra` only in the chapter view)
("""function trBar(extra){const av=trAvail();const dia=(trCur()==="svd"&&hasDia())||hasKD()?`<button class="trb ${diaOn()?"on":""}" id="diaBtn" title="إظهار التشكيل أو إخفاؤه">تشكيل</button>`:"";return `<div class="trbar">${av.length>1?av.map(k=>`<button class="trb ${k===trCur()?"on":""}" data-tr="${k}">${TRN[k]}</button>`).join("")+dia:""}${extra||""}${fsGrp()}</div>`}""",
 """/* ---- اللغة الأصلية (عرض الأصحاح): نص Berean (WLC / Nestle) بترتيب الكلمات الأصلي ---- */
function origOn(){return S.view==="chapter"&&store.get("corig",false)===true}
function origLoad(ab){if(window.ORIG&&window.ORIG[ab])return window.ORIG[ab];const src="assets/orig_"+ab+".js";
  if(LOADED[src]===undefined)loadJS(src,()=>{if(S.view==="chapter")render()});return null}
function origSpan(d){const b=book(),O=origLoad(b.abbr),gr=b.id>39;
  if(!O)return `<span class="cvt orig-na">${LOADED["assets/orig_"+b.abbr+".js"]===true?"تعذّر تحميل النص الأصلي.":"جارٍ تحميل النص الأصلي…"}</span>`;
  const t=O[d.c+":"+d.v];
  if(!t)return `<span class="cvt orig-na">هذا العدد غير موجود في النص ${gr?"اليوناني (Nestle)":"العبري (WLC)"} الذي يعتمد عليه Berean.</span>`;
  return `<span class="cvt orig ${gr?"gr":"he"}" dir="${gr?"ltr":"rtl"}" lang="${gr?"grc":"he"}">${esc(t)}</span>`}
function trBar(extra){const av=trAvail(),og=extra!==undefined&&origOn();const dia=!og&&((trCur()==="svd"&&hasDia())||hasKD())?`<button class="trb ${diaOn()?"on":""}" id="diaBtn" title="إظهار التشكيل أو إخفاؤه">تشكيل</button>`:"";
  const orig=extra!==undefined?`<button class="trb ${og?"on":""}" data-orig="1" title="النص العبري/اليوناني من Berean بدون الإنجليزي والنطق">اللغة الأصلية</button>`:"";
  return `<div class="trbar">${av.length>1?av.map(k=>`<button class="trb ${!og&&k===trCur()?"on":""}" data-tr="${k}">${TRN[k]}</button>`).join("")+orig+dia:orig}${extra||""}${fsGrp()}</div>`}"""),
# chapter verse text
("""<span class="cvt ar" ${trCur()==="kjv"?'dir="ltr" style="text-align:left"':""}>${esc(trText(d)||d.text)}</span>""",
 """${origOn()?origSpan(d):`<span class="cvt ar" ${trCur()==="kjv"?'dir="ltr" style="text-align:left"':""}>${esc(trText(d)||d.text)}</span>`}"""),
# clicks: a translation turns «اللغة الأصلية» off; the new chip turns it on
("""  const tb=e.target.closest("[data-tr]"); if(tb){store.set("tr",tb.dataset.tr);render();return}""",
 """  const tb=e.target.closest("[data-tr]"); if(tb){store.set("tr",tb.dataset.tr);store.set("corig",false);render();return}
  if(e.target.closest("[data-orig]")){store.set("corig",true);render();return}"""),
]
for o, n in R:
    c = s.count(o)
    if c != 1: sys.exit(f"ABORT {c}: {o[:90]}")
    s = s.replace(o, n)
open(p, "w", encoding="utf-8").write(s); print("patched", p)
