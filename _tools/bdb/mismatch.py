"""يحدد الكلمات التي لا مدخل مستقل لها في BDB وتُذكر ضمن مادة أخرى (الحقل u في البيانات)"""
import re,difflib,unicodedata as U,sys,json
sys.path.insert(0,sys.argv[1]); from bdblib import s2b,E,HW
fin={'ך':'כ','ם':'מ','ן':'נ','ף':'פ','ץ':'צ'}
def norm(s): return ''.join(fin.get(c,c) for c in U.normalize('NFD',s) if 'א'<=c<='ת')
def loose(x): return x.replace('ו','').replace('י','')
out={}
for n,ids in s2b.items():
  if not re.fullmatch(r'H\d+',n) or n not in HW: continue
  hw=loose(norm(HW[n])); ok=False
  for i in ids:
    for m in re.findall(r'<w[^>]*>(.*?)</w>',E[i])[:3]:      # الكلمة الرئيسة وصيغها البديلة في أول المدخل
      h=loose(norm(m))
      if h==hw or (abs(len(h)-len(hw))<=1 and difflib.SequenceMatcher(None,h,hw).ratio()>=0.75): ok=True
  if not ok: out[n]=HW[n]
json.dump(out,open(sys.argv[2],'w'),ensure_ascii=False); print(len(out))
