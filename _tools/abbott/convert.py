import sys, json, re, html
import xml.etree.ElementTree as ET
src, out = sys.argv[1], sys.argv[2]
NS='{http://www.crosswire.org/2013/TEIOSIS/namespace}'
XL='{http://www.w3.org/XML/1998/namespace}lang'
root=ET.parse(src).getroot()
def norm(s):
    m=re.match(r'G0*(\d+)([a-z]?)$',s or '')
    return 'G'+m.group(1)+m.group(2) if m else None
def esc(t): return html.escape(t or '',quote=False)
def conv(el):
    tag=el.tag.replace(NS,'')
    inner=esc(el.text)+''.join(conv(c)+esc(c.tail) for c in el)
    a=el.attrib
    if tag=='foreign':
        lg=a.get(XL,'')
        if lg=='heb' or lg=='arc':
            n=a.get('n'); return f'<h{(" n=\""+n+"\"") if n else ""}>{inner}</h>'
        if lg=='grc': return f'<g>{inner}</g>'
        return f'<l>{inner}</l>'
    if tag=='ref':
        r=a.get('osisRef')
        if r: return f'<r v="{r}">{inner}</r>'
        return f'<x>{inner}</x>'
    if tag=='sense':
        n=a.get('n'); return f'<s{(" n=\""+n+"\"") if n else ""}>{inner}</s>'
    if tag=='gloss': return f'<b>{inner}</b>'
    if tag in('emph','hi'): return f'<i>{inner}</i>'
    if tag=='orth': return f'<o>{inner}</o>'
    if tag=='pb': return ''
    if tag=='lb': return ' '
    if tag=='note':
        return '' if a.get('type')=='occurrencesNT' else f'<i>{inner}</i>'
    if tag=='seg':
        return f'<e t="{a.get("type","")}">{inner}</e>'
    if tag=='etym': return f'<et>{inner}</et>'
    if tag=='re': return f'<sy>{inner}</sy>'
    if tag=='form': return f'<f>{inner}</f>'
    return inner
D={}; L={}
EXTRA={'ἐνκακέω':['G1573'],'ἐλάχιστος':['G1647']}
for e in root.iter(NS+'entry'):
    raw=(e.get('lemma') or '').split('|'); lem=raw[0]
    ids=[x for x in (norm(t) for t in raw[1:]+(e.get('strong') or '').split('|')) if x]
    occ=e.find(NS+'note[@type="occurrencesNT"]')
    body=''.join(conv(c)+esc(c.tail) for c in e).strip()
    body=re.sub(r'\s+',' ',body)
    ids+=EXTRA.get(lem,[])
    if lem and ids: L.setdefault(lem,ids[0])
    for s in ids:
        d=D.setdefault(s,{'l':lem,'o':int(occ.text) if occ is not None and occ.text and occ.text.isdigit() else None,'en':''})
        if d['l']!=lem and d['en'] and lem in d.get('ls',[d['l']]): continue
        if d['en']: d['en']+='<hr>'; d.setdefault('ls',[d['l']]).append(lem)
        d['en']+=body
json.dump({'D':D,'L':L},open(out,'w',encoding='utf-8'),ensure_ascii=False)
print(len(D),len(L))
