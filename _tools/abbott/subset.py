import sys,json,re
A=json.load(open(sys.argv[1]))['D']; ids=open(sys.argv[2]).read().split()
out={};miss=[]
for i in ids:
    if i in A:
        d=dict(A[i]); d['en']=re.sub(r'<r v="([^"]*)">.*?</r>',r'<r v="\1"></r>',d['en']); out[i]=d
    else: miss.append(i)
json.dump(out,open(sys.argv[3],'w',encoding='utf-8'),ensure_ascii=False,indent=0)
L=sorted(((len(v['en']),k) for k,v in out.items()),reverse=True)
print('have',len(out),'miss',len(miss),miss)
print('total chars',sum(l for l,_ in L)); print(L[:15])
