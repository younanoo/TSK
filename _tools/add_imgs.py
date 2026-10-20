import glob,os,sys
os.chdir(sys.argv[1]);c=0
for p in glob.glob('*.html'):
    h=open(p,encoding='utf-8').read();o=h
    if 'assets/bookimg.js' in h and 'assets/imgs.js' not in h:
        h=h.replace('<script src="assets/bookimg.js?v=1"></script>','<script src="assets/bookimg.js?v=1"></script>\n<script src="assets/imgs.js"></script>')
    h=h.replace('assets/app.js?v=3','assets/app.js?v=4').replace('assets/style.css?v=4','assets/style.css?v=5')
    if h!=o: open(p,'w',encoding='utf-8').write(h);c+=1
print(c,'pages updated')
