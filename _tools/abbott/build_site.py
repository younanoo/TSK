"""Build the site data for قاموس أبوت-سميث.
usage: python3 -I build_site.py ABBOTT_ALL.json OUT_DIR AR1.json [AR2.json ...]
  ABBOTT_ALL.json : output of convert.py (English entries + lemma map)
  AR*.json        : {"G26": "<short Arabic markup>", ...} — later files win
  OUT_DIR         : site/assets/abbott  → lemmas.js + c<N>.js (N = Strong number // 100)
"""
import sys, json, re, os
src, out, ars = sys.argv[1], sys.argv[2], sys.argv[3:]
A = json.load(open(src, encoding='utf-8'))
ar = {}
for f in ars: ar.update(json.load(open(f, encoding='utf-8')))
os.makedirs(out, exist_ok=True)
for f in os.listdir(out):
    if re.match(r'c\d+\.js$', f): os.remove(os.path.join(out, f))
chunks = {}
for k, t in ar.items():
    e = A['D'][k]
    en = re.sub(r'<r v="([^"]*)">.*?</r>', r'<r v="\1"></r>', e['en'])
    c = int(re.sub(r'\D', '', k)) // 100
    chunks.setdefault(c, {})[k] = {'l': e['l'], 'o': e['o'], 'ar': t, 'en': en}
J = lambda o: json.dumps(o, ensure_ascii=False, separators=(',', ':'))
for c, d in chunks.items():
    open(os.path.join(out, f'c{c}.js'), 'w', encoding='utf-8').write(
        f'(function(A){{Object.assign(A.D,{J(d)});A.got[{c}]=1}})(window.ABBOTT=window.ABBOTT||{{D:{{}},got:{{}}}});')
L = {l: g for l, g in A['L'].items() if g in ar}
open(os.path.join(out, 'lemmas.js'), 'w', encoding='utf-8').write(
    f'(window.ABBOTT=window.ABBOTT||{{D:{{}},got:{{}}}}).L={J(L)};')
print('entries', len(ar), 'chunks', len(chunks), 'lemmas', len(L))
