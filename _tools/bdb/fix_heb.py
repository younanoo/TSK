"""يعيد كل كلمة عبرية في الترجمة إلى نصها الأصلي من الإنجليزي (ترتيب علامات التشكيل قد يتغيّر)"""
import json,re,sys,glob,unicodedata as U
def skel(s): return ''.join(c for c in U.normalize('NFD',s) if not U.combining(c)).replace('־','').strip()
def nfc(s): return U.normalize('NFC',s).strip()
en=json.load(open(sys.argv[1])); stats=[0,0,0]
for f in sorted(glob.glob(sys.argv[2])):
  ar=json.load(open(f)); ch=False
  for k,a in ar.items():
    if k not in en: continue
    E=re.findall(r'<h[^>]*>(.*?)</h>',en[k]['en'] if isinstance(en[k],dict) else en[k])
    byn={nfc(x):x for x in E}; bys={}
    for x in E: bys.setdefault(skel(x),set()).add(x)
    def rep(m):
      t=m.group(2)
      if t in E: return m.group(0)
      if nfc(t) in byn: stats[0]+=1; return m.group(1)+byn[nfc(t)]+'</h>'
      c=bys.get(skel(t))
      if c and len(c)==1: stats[1]+=1; return m.group(1)+next(iter(c))+'</h>'
      stats[2]+=1; return m.group(0)
    n=re.sub(r'(<h[^>]*>)(.*?)</h>',rep,a)
    if n!=a: ar[k]=n; ch=True
  if ch: json.dump(ar,open(f,'w'),ensure_ascii=False,indent=0)
print('nfc-fixed',stats[0],'skeleton-fixed',stats[1],'unresolved',stats[2])
