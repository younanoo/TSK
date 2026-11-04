import sys,json,glob
S=sys.argv[1]
full=json.load(open(S+'/phm_full.json',encoding='utf-8'))
L=json.load(open(S+'/abbott_all.json',encoding='utf-8'))['L']
ar={}
for f in sorted(glob.glob(S+'/tr/phm[123]_ar.json')): ar.update(json.load(open(f,encoding='utf-8')))
D={k:{'l':v['l'],'o':v['o'],'en':v['en'],'ar':ar.get(k,'')} for k,v in full.items()}
LL={l:g for l,g in L.items() if g in D}
open(S+'/site/assets/abbott_test_Phm.js','w',encoding='utf-8').write('window.ABBOTT='+json.dumps({'short':1,'L':LL,'D':D},ensure_ascii=False,separators=(',',':'))+';')
print('entries',len(D),'translated',sum(1 for k in D if D[k]['ar']))
