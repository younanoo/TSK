import glob,re,sys,os
os.chdir(sys.argv[1]); c=0
for p in glob.glob('*.html'):
    h=open(p,encoding='utf-8').read(); o=h
    if 'assets/app.js' in h and 'bookimg.js' not in h:
        h=re.sub(r'(<script src="assets/app\.js[^"]*"></script>)',r'<script src="assets/bookimg.js?v=1"></script>\n\1',h,count=1)
    h=h.replace('assets/app.js?v=2','assets/app.js?v=3').replace('assets/style.css?v=3','assets/style.css?v=4')
    if h!=o: open(p,'w',encoding='utf-8').write(h); c+=1
print(c,'pages updated')
