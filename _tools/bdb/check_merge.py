"""يفحص ترجمات مرحلة ويدمجها في master.json
   python3 check_merge.py <en.json> <ar glob> <master.json> [--write]"""
import json,re,sys,glob
en=json.load(open(sys.argv[1])); ar={}
for f in sorted(glob.glob(sys.argv[2])): ar.update(json.load(open(f)))
M=json.load(open(sys.argv[3]))
def fix(a):
  a=a.replace('زوجة أخي زوج','سِلفة'); a=re.sub(r'Impf\.? consec\.?','المضارع مع واو القلب',a); a=re.sub(r'Pf\.? consec\.?','الماضي مع واو القلب',a)
  return a
probs=[];ok=0
for k,v in en.items():
  a=ar.get(k)
  if not a: probs.append((k,'missing')); continue
  a=fix(a); e=v['en']
  er=set(re.findall(r'<r v="[^"]*"></r>',e)); arr=set(re.findall(r'<r v="[^"]*"></r>',a))
  p=[]
  if arr-er: p.append('extra ref')
  if er-arr: p.append('ref dropped %d'%len(er-arr))
  for t in ['b','h','l','p','st','i','asp','s']:
    if len(re.findall(r'<%s[ >]'%t,a))!=a.count('</%s>'%t) and t!='s': p.append('unbalanced '+t)
  if len(re.findall(r'<s[ >]',a))-a.count('</s>')!=len(re.findall(r'<s[ >]',e))-e.count('</s>'): p.append('s-balance differs')
  heb_e=set(re.findall(r'<h[^>]*>(.*?)</h>',e)); heb_a=set(re.findall(r'<h[^>]*>(.*?)</h>',a))
  if heb_a-heb_e: p.append('hebrew changed: '+' '.join(list(heb_a-heb_e))[:40])
  lat=re.findall(r'[A-Za-z]{4,}',re.sub(r'<(l|p|st|asp|h)\b[^>]*>.*?</\1>|<[^>]+>','',a))
  if lat: p.append('latin '+' '.join(lat[:4]))
  if not re.search(r'[؀-ۿ]',a): p.append('no arabic')
  if p: probs.append((k,'; '.join(p)))
  else: ok+=1
  M[k]={'en':e,'ar':a}; 
  if v.get('o'): M[k]['o']=v['o']
print('total',len(en),'clean',ok,'flagged',len(probs))
for x in probs: print(' ',x)
if '--write' in sys.argv: json.dump(M,open(sys.argv[3],'w'),ensure_ascii=False); print('master now',len(M))
