import sys, json, re
en = json.load(open(sys.argv[1], encoding='utf-8'))
ar = json.load(open(sys.argv[2], encoding='utf-8'))
probs = []
def keep(s):  # protected content that must be identical
    return {
      'r': re.findall(r'<r v="[^"]*"></r>', s),
      'g': sorted(re.findall(r'<g>(.*?)</g>', s)),
      'h': sorted(re.findall(r'<h[^>]*>(.*?)</h>', s)),
      'o': re.findall(r'<o>(.*?)</o>', s),
      'tags': sorted(re.findall(r'<(s|sy|et|e|f|x|hr)\b', s)),
    }
for k in en:
    if k not in ar: probs.append((k, 'missing')); continue
    a, b = keep(en[k]), keep(ar[k])
    for f in a:
        if f == 'r':
            if sorted(a[f]) != sorted(b[f]): probs.append((k, f'refs {len(a[f])}->{len(b[f])}'))
        elif a[f] != b[f]: probs.append((k, f))
    if re.search(r'[A-Za-z]{4,}', re.sub(r'<[^>]+>|<(g|l|i)>.*?</\1>', '', ar[k])) and len(re.findall(r'\b(the|and|of|with|which|in)\b', re.sub(r'<[^>]+>', ' ', ar[k]))) > 2:
        probs.append((k, 'english left'))
for k in ar:
    if k not in en: probs.append((k, 'extra key'))
print(len(en), 'entries;', len(probs), 'problems')
for p in probs: print(*p)
