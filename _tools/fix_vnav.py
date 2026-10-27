"""Verse page: replace the «previous / next verse» row under the verse with two arrows on the sides of the verse.
Right arrow = previous verse, left arrow = next verse (RTL). Works in normal and interlinear view.
Usage: python3 fix_vnav.py path/to/app.js   (every replacement must match exactly once)"""
import sys
p = sys.argv[1]; s = open(p, encoding="utf-8").read()
R = [
# wrap the verse (normal card or interlinear) in .vwrap so the arrows can sit on its sides
("""${store.get("inter",false)?ilOpts(b)+`<div class="ilist ${store.get("idir","rtl")==="ltr"?"ltr":""}">${ilItem(d,b,false)}</div>`:trBar()}<div class="verse-card """,
 """${store.get("inter",false)?ilOpts(b):trBar()}<div class="vwrap">${store.get("inter",false)?`<div class="ilist ${store.get("idir","rtl")==="ltr"?"ltr":""}">${ilItem(d,b,false)}</div>`:""}<div class="verse-card """),
# close .vwrap after the card, add the arrows, drop the old .context row
("""      </div>
    </div>
    ${tpChips(d)}${fnBox(d,true)}
    <div class="context">
      ${sameCh(prev)?`<button class="ctx" data-go="${prev.b}.${prev.c}:${prev.v}"><em>${n(prev.v)}</em>${esc(prev.text)}</button>`:""}
      ${sameCh(next)?`<button class="ctx" data-go="${next.b}.${next.c}:${next.v}"><em>${n(next.v)}</em>${esc(next.text)}</button>`:""}
    </div>
""",
"""      </div>
    </div>${vArrow(prev,"vprev","العدد السابق",'<path d="M9 6l6 6l-6 6"/>')}${vArrow(next,"vnext","العدد التالي",'<path d="M15 6l-6 6l6 6"/>')}</div>
    ${tpChips(d)}${fnBox(d,true)}
"""),
# UX layer: the interlinear now sits inside .vwrap, not directly under #main
("""const inter=!!$("#main>.ilist");""",
 """const inter=!!$("#main .ilist");"""),
# Aa label: "Interlinear" was cut from the wrong side in RTL
("""Aa${lab?` <small>${lab}</small>`:""}""",
 """Aa${lab?` <small dir="auto">${lab}</small>`:""}"""),
# helper
("""function viewVerse(){""",
"""/* سهم العدد السابق/التالي على جانبي الآية (بديل سطر «العدد السابق والتالي») */
function vArrow(x,cls,label,path){if(!x)return "";const t=vref(x)+" — "+x.text;
  return `<button type="button" class="vnav ${cls}" data-go="${x.b}.${x.c}:${x.v}" aria-label="${label}: ${esc(vref(x))}" title="${esc(t.length>90?t.slice(0,90)+"…":t)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg></button>`}
function viewVerse(){"""),
]
for o, n in R:
    c = s.count(o)
    if c != 1: sys.exit(f"ABORT {c}: {o[:90]}")
    s = s.replace(o, n)
open(p, "w", encoding="utf-8").write(s); print("patched", p)
