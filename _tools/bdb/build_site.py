"""يبني ملفات قاموس BDB للموقع من master.json
   master.json = {"H123": {"o": عدد المرات, "en": "...", "ar": "..."}}
   الناتج: assets/bdb/c0.js … c86.js (ملف لكل ١٠٠ رقم، حتى الفارغ منها)
   الاستخدام: python3 build_site.py <master.json> <مجلد assets/bdb>"""
import json,sys,os,re
master,out=sys.argv[1],sys.argv[2]
D=json.load(open(master,encoding='utf-8'))
os.makedirs(out,exist_ok=True)
ch={}
for k,v in D.items():
  if not v.get('ar'): continue
  e={'en':v['en'],'ar':v['ar']}
  if v.get('o'): e['o']=v['o']
  if v.get('u'): e['u']=v['u']
  ch.setdefault(int(k[1:])//100,{})[k]=e
n=0
for c in range(0,87):
  d=ch.get(c,{})
  js='(function(B){B.got[%d]=1;Object.assign(B.D,%s)})(window.BDB=window.BDB||{D:{},got:{}});'%(c,json.dumps(d,ensure_ascii=False,separators=(',',':')))
  open(os.path.join(out,'c%d.js'%c),'w',encoding='utf-8').write(js); n+=len(d)
print('entries',n,'files',87)
