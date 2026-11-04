import sys, json, re
from collections import Counter
en = json.load(open(sys.argv[1], encoding='utf-8'))
ar = json.load(open(sys.argv[2], encoding='utf-8'))
probs = []
for k in en:
    if k not in ar: probs.append((k, 'missing')); continue
    a, b = en[k], ar[k]
    ra, rb = re.findall(r'<r v="[^"]*"></r>', a), re.findall(r'<r v="[^"]*"></r>', b)
    if Counter(ra) != Counter(rb): probs.append((k, f'refs {len(ra)}->{len(rb)}'))
    for tag in ('g', 'o'):
        ga, gb = Counter(re.findall(rf'<{tag}>(.*?)</{tag}>', a)), Counter(re.findall(rf'<{tag}>(.*?)</{tag}>', b))
        extra = gb - ga
        if extra: probs.append((k, f'{tag} changed/new: {list(extra)[:3]}'))
    if re.findall(r'<o>', a) and not re.findall(r'<o>', b): probs.append((k, 'headword dropped'))
    if re.search(r'<(sy|et)\b', b): probs.append((k, 'sy/et present'))
    if Counter(re.findall(r'<s\b[^>]*>', a)) != Counter(re.findall(r'<s\b[^>]*>', b)): probs.append((k, 'senses changed'))
    plain = re.sub(r'<(g|l|i|o)>.*?</\1>', '', b); plain = re.sub(r'<[^>]+>', ' ', plain)
    if len(re.findall(r'\b(the|and|of|with|which|in|to)\b', plain)) > 1: probs.append((k, 'english left'))
    for t in ['b','i','g','h','o','f','x','r','e','l','s']:
        if len(re.findall(r'<'+t+r'(\s[^>]*)?>',b))!=len(re.findall('</'+t+'>',b)): probs.append((k,'unbalanced <'+t+'>'))
    if re.search(r'(?<!<)(?<!</)\b[a-z]{1,2}>', re.sub(r'<[^>]*>','',b)): probs.append((k,'broken tag text'))
for k in ar:
    if k not in en: probs.append((k, 'extra key'))
print(len(en), 'entries;', len(probs), 'problems')
for p in probs: print(*p)
