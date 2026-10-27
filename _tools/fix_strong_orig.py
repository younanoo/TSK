"""strong.html: under the Arabic text of every verse, show the original-language text (Berean: WLC / Nestle,
original word order, from assets/orig_<Book>.js) and highlight the word(s) carrying the page's Strong number
(matched through assets/bsb_<Book>.js, which has the Strong number of every original word).
Usage: python3 fix_strong_orig.py path/to/strong.html   (every replacement must match exactly once)"""
import sys
p = sys.argv[1]; s = open(p, encoding="utf-8").read()
R = [
# CSS
("""</style>""",
 """/* النص الأصلي تحت النص العربي */
.otx{margin-top:10px;padding-top:10px;border-top:1px dashed var(--line);color:var(--ink)}
.otx.he{font:400 24px/2 "Noto Serif Hebrew","SBL Hebrew",serif;direction:rtl;text-align:right}
.otx.gr{font:400 20px/1.8 "Noto Serif","Gentium Plus",serif;direction:ltr;text-align:left}
.otx mark{background:var(--gold-soft);color:var(--gold);border-radius:6px;padding:0 3px;font-weight:600}
.otx.wait,.otx.na{font:13px/1.7 var(--ui);color:var(--muted);direction:rtl;text-align:right}
@media (max-width:600px){.otx.he{font-size:21px}.otx.gr{font-size:18px}}
</style>"""),
# helpers (before render)
("""function render(){
  const num=S.num,e=STRONG[num];""",
 """/* ---- النص الأصلي (orig_<Book>.js) + تمييز الكلمة (bsb_<Book>.js) — بيتحمّلوا لكل سفر عند الحاجة ---- */
const OQ={};
function needOrig(ab){if(OQ[ab])return;OQ[ab]="wait";let left=2;
  const done=()=>{if(--left)return;OQ[ab]=(window.ORIG&&window.ORIG[ab])?"ok":"fail";if(S.num)render()};
  ["orig_","bsb_"].forEach(f=>{const x=document.createElement("script");x.src="assets/"+f+ab+".js";x.onload=x.onerror=done;document.body.appendChild(x)})}
function origHTML(x,num){
  const ab=x[0],k=x[1]+":"+x[2],O=window.ORIG&&window.ORIG[ab];
  if(!O){needOrig(ab);return OQ[ab]==="fail"?"":`<div class="otx wait">جارٍ تحميل النص الأصلي…</div>`}
  const t=O[k];if(!t)return "";
  const B=window.BSBI&&window.BSBI[ab],forms=new Set(((B&&B[k])||[]).filter(w=>w[2]===num).map(w=>w[0]));
  const nt=CAT_NT.has(ab);
  const h=t.replace(/[^\\s\\u05BE]+\\u05BE?/g,w=>forms.has(w)||forms.has(w.replace(/\\u05BE$/,""))?`<mark>${esc(w)}</mark>`:esc(w));
  return `<div class="otx ${nt?"gr":"he"}" dir="${nt?"ltr":"rtl"}" lang="${nt?"grc":"he"}">${h}</div>`}
const CAT_NT=new Set(Object.keys(AR).slice(39));
function render(){
  const num=S.num,e=STRONG[num];"""),
# verse row: Arabic text + original text
("""<div class="txt ar">${hl(x[3],o.ws)}</div></div></div></div>`}).join("")""",
 """<div class="txt ar">${hl(x[3],o.ws)}</div>${origHTML(x,num)}</div></div></div>`}).join("")"""),
]
for o, n in R:
    c = s.count(o)
    if c != 1: sys.exit(f"ABORT {c}: {o[:90]}")
    s = s.replace(o, n)
open(p, "w", encoding="utf-8").write(s); print("patched", p)
