/* يبني assets/arstrong.js: كل صيغة عربية (بعد التطبيع) ← أرقام سترونج التي تُرجمت إليها وعدد المرات.
   المصدر: svdS (فاندايك) في assets/tr_*.js، ويُضاف كتاب الحياة (arS في lib_*.js) للصيغ الموجودة في roots.js.
   التشغيل: node _tools/make_arstrong.js */
const fs=require("fs"),path=require("path");
const A=p=>path.join(__dirname,"..","assets",p);
const nz=x=>String(x).replace(/[ً-ْٰـ]/g,"").replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/[^ء-ي]/g,"");
global.window={};
new Function("window",fs.readFileSync(A("roots.js"),"utf8"))(window);
const RT=window.RT;
const STOP=new Set("G3588 G2532 G1161 G1722 G1519 G1537 G2443 G3754 G846 G3739 G1063 G3303 G235 G3767 G1487 G5037 G2228 G3361 G3756 G4771 G1473 G2257 G5216 G5213 G5209 G2248 G1510 G1526 G2258 G846 G3778 G3739 H853 H834 H3588 H1931 H2088 H1992 H2063".split(" "));
const IDX={},DSP={};let seg=0,single=0,multi=0;
function add(form,nums,src){
  const w=nz(form);if(!w)return;
  const d=String(form).replace(/[ً-ْٰـ]/g,"").replace(/[^\u0621-\u064A]/g,"");const dd=DSP[w]||(DSP[w]={});dd[d]=(dd[d]||0)+1;
  let ns=nums;
  if(ns.length>1){const k=ns.filter(n=>!STOP.has(n));if(k.length)ns=k}
  const e=IDX[w]||(IDX[w]={});
  for(const n of ns){const c=e[n]||(e[n]=[0,0]);c[src]++}
}
const files=fs.readdirSync(path.join(__dirname,"..","assets")).filter(f=>/^tr_.+\.js$/.test(f));
for(const f of files){
  window.TR={};new Function("window",fs.readFileSync(A(f),"utf8"))(window);
  const T=Object.values(window.TR)[0];
  for(const k of Object.keys(T.svdS||{}))for(const [t,ns] of T.svdS[k]){
    if(!ns.length)continue;seg++;
    if(/\s/.test(t.trim())){multi++;continue}
    single++;add(t,ns,0)}
}
let life=0;
for(const f of fs.readdirSync(path.join(__dirname,"..","assets")).filter(f=>/^lib_.+\.js$/.test(f))){
  window.LIB=null;new Function("window",fs.readFileSync(A(f),"utf8"))(window);
  for(const v of window.LIB[0].verses)for(const [t,ns] of (v.arS||[])){
    if(!ns.length||/\s/.test(t.trim()))continue;
    const w=nz(t);if(!w||!RT[w])continue;add(t,ns,1);life++}
}
const out={};
for(const w of Object.keys(IDX)){
  const e=IDX[w],dd=DSP[w],disp=Object.keys(dd).sort((a,b)=>dd[b]-dd[a])[0];
  out[w]=[disp,Object.keys(e).map(n=>[n,e[n][0],e[n][1]]).sort((a,b)=>(b[1]+b[2])-(a[1]+a[2]))];
}
{const _f=A("arstrong.js"),_t=_f+".~tmp",_s="window.ARS="+JSON.stringify(out)+";";for(let i=0;;i++){try{fs.writeFileSync(_t,_s);fs.renameSync(_t,_f);break;}catch(e){if(!["EINVAL","EBUSY","EPERM","EACCES"].includes(e.code)||i>20)throw e;Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,700);}}}
console.log("segments",seg,"single",single,"multi(skipped)",multi,"life",life,"forms",Object.keys(out).length,"bytes",fs.statSync(A("arstrong.js")).size);
