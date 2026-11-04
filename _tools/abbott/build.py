import sys,json,glob
S=sys.argv[1]
en=json.load(open(S+'/eph_en.json',encoding='utf-8'))
L=json.load(open(S+'/abbott_all.json',encoding='utf-8'))['L']
ar={}
for f in sorted(glob.glob(S+'/tr/batch*_ar.json')): ar.update(json.load(open(f,encoding='utf-8')))
D={k:{'l':v['l'],'o':v['o'],'en':v['en'],'ar':ar.get(k,'')} for k,v in en.items()}
LL={l:g for l,g in L.items() if g in D}
open(S+'/site/assets/abbott_test_Eph.js','w',encoding='utf-8').write('window.ABBOTT='+json.dumps({'L':LL,'D':D},ensure_ascii=False,separators=(',',':'))+';')
print('entries',len(D),'translated',sum(1 for k in D if D[k]['ar']))
