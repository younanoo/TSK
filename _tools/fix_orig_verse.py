"""Verse view: the same «اللغة الأصلية» option as the chapter view (needs fix_orig.py applied first).
The choice is shared: picking it in the chapter keeps it on the verse page and vice-versa.
Usage: python3 fix_orig_verse.py path/to/app.js   (every replacement must match exactly once)"""
import sys
p = sys.argv[1]; s = open(p, encoding="utf-8").read()
R = [
("""function origOn(){return S.view==="chapter"&&store.get("corig",false)===true}""",
 """function origView(){return S.view==="chapter"||S.view==="verse"}
function origOn(){return origView()&&store.get("corig",false)===true}"""),
("""if(LOADED[src]===undefined)loadJS(src,()=>{if(S.view==="chapter")render()});return null}""",
 """if(LOADED[src]===undefined)loadJS(src,()=>{if(origView())render()});return null}"""),
# the chip: chapter (trBar(extra)) and verse (trBar())
("""const av=trAvail(),og=extra!==undefined&&origOn();""",
 """const av=trAvail(),og=origOn();"""),
("""const orig=extra!==undefined?`<button class="trb ${og?"on":""}" data-orig="1\"""",
 """const orig=origView()?`<button class="trb ${og?"on":""}" data-orig="1\""""),
# verse card text
("""      <div class="ar">${verseHTML(d)}</div>""",
 """      ${origOn()?`<div class="ar orig-v">${origSpan(d)}</div>`:`<div class="ar">${verseHTML(d)}</div>`}"""),
# «أرقام سترونج» toggle belongs to the Arabic text only
("""</span>${(d.arS&&(!trText(d)||trCur()==="alab"))||trSeg(d)?`<button class="tgl""",
 """</span>${!origOn()&&((d.arS&&(!trText(d)||trCur()==="alab"))||trSeg(d))?`<button class="tgl"""),
# UX layer: after the «Aa» sheet closes, put the controls back before .vwrap (direct child of #main) so the mobile CSS keeps hiding them
("""const anchor=$("#main .cvlist, #main .verse-card, #main .ilist");""",
 """const anchor=$("#main>.vwrap, #main>.cvlist, #main>.ilist");"""),
]
for o, n in R:
    c = s.count(o)
    if c != 1: sys.exit(f"ABORT {c}: {o[:90]}")
    s = s.replace(o, n)
open(p, "w", encoding="utf-8").write(s); print("patched", p)
