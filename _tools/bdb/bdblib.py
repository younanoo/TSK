import re,json
R='/tmp/claude-0/-home-claude/c3c69cb5-6199-5cab-abdb-79098f31fbc6/scratchpad/hl/repo'
bdb=open(R+'/BrownDriverBriggs.xml',encoding='utf-8-sig').read()
li=open(R+'/LexicalIndex.xml',encoding='utf-8-sig').read()
E={}
for m in re.finditer(r'<entry\b([^>]*)>(.*?)</entry>',bdb,re.S):
  a=dict(re.findall(r'([\w:]+)="([^"]*)"',m.group(1))); E[a['id']]=m.group(2)
s2b={};b2s={}
for m in re.finditer(r'<xref ([^>]*)/>',li):
  a=dict(re.findall(r'(\w+)="([^"]*)"',m.group(1)))
  if 'strong' in a and 'bdb' in a:
    s='H'+a['strong']; s2b.setdefault(s,[])
    if a['bdb'] not in s2b[s]: s2b[s].append(a['bdb'])
    b2s.setdefault(a['bdb'],s)
hs=open(R+'/HebrewStrong.xml',encoding='utf-8-sig').read()
HW={m.group(1):m.group(2) for m in re.finditer(r'<entry id="(H\d+)">\s*<w[^>]*>([^<]+)</w>',hs)}
def conv(body):
  t=re.sub(r'<status[^>]*>.*?</status>','',body,flags=re.S)
  t=re.sub(r'(?:\bAr\.\s*)?<foreign xml:lang="ara">Arabic</foreign>','',t)
  t=re.sub(r'<foreign[^>]*>(.*?)</foreign>',r'<l>\1</l>',t,flags=re.S)
  t=re.sub(r'<page[^>]*/>|<sense[^>]*/>','',t)
  def w(m):
    at=m.group(1); src=re.search(r'src="([^"]+)"',at); mod=re.search(r'mod="([^"]+)"',at)
    pre=(mod.group(1)+'. ') if mod else ''; txt=m.group(2)
    n=b2s.get(src.group(1)) if src else None
    if re.fullmatch(r'[a-z]\.[a-z]{2}\.[a-z]{2}',txt.strip()): txt=HW.get(n,'') if n else ''
    if not txt: return ''
    return pre+('<h n="%s">'%n if n else '<h>')+txt+'</h>'
  t=re.sub(r'<w\b([^>]*)>(.*?)</w>',w,t,flags=re.S)
  t=re.sub(r'<ref r="([^"]+)"[^>]*>.*?</ref>',r'<r v="\1"></r>',t,flags=re.S)
  t=t.replace('<def>','<b>').replace('</def>','</b>')
  t=re.sub(r'<sense n="([^"]+)">',r'<s n="\1">',t).replace('<sense>','<s>').replace('</sense>','</s>')
  t=t.replace('<stem>','<st>').replace('</stem>','</st>').replace('<pos>','<p>').replace('</pos>','</p>')
  t=t.replace('<em>','<i>').replace('</em>','</i>')
  t=re.sub(r'\s+',' ',t).strip()
  t=re.sub(r'\(\s*[,;]?\s*\)','',t); t=re.sub(r'\s+([,;.])',r'\1',t); t=re.sub(r'([,;])\s*([,;])',r'\1',t)
  return t
def entry(n):
  ids=s2b.get(n)
  if not ids: return None
  parts=[];occ=None
  for i in ids:
    t=conv(E[i])
    mm=re.match(r'(\[?<h[^>]*>.*?</h>\]?)\s+(\d+)\s+',t)
    if mm:
      occ=occ or int(mm.group(2)); t=mm.group(1)+' '+t[mm.end():]
    else:
      m2=re.search(r'</p>\.? (\d+) ',t)
      if m2: occ=occ or int(m2.group(1)); t=t.replace(m2.group(0),m2.group(0).replace(' '+m2.group(1)+' ',' ',1),1)
    parts.append(t)
  return {'o':occ,'en':' <hr> '.join(parts)}
def plain(s): return len(re.sub(r'<[^>]+>','',s))
