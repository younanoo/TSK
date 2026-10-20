#!/usr/bin/env python3
"""Rebrand the TSK site HTML pages for جدد وعتقاء. Usage: python3 rebrand_html.py <site_dir>
Idempotent: pages already carrying assets/brand.js are skipped."""
import os, re, sys, glob

SITE = sys.argv[1]
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400'
         '&family=El+Messiri:wght@500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700'
         '&family=Noto+Serif:ital,wght@0,400;0,600;1,400&family=Noto+Serif+Hebrew:wght@400;600&display=swap" rel="stylesheet">\n')
HEADX = ('<link rel="icon" href="assets/brand/favicon.ico" sizes="any">\n'
         '<link rel="icon" href="assets/brand/mark-micro.svg" type="image/svg+xml">\n'
         '<link rel="apple-touch-icon" href="assets/brand/app-icon-square-180.png">\n'
         '<meta name="theme-color" content="#FAF8F2" media="(prefers-color-scheme: light)">\n'
         '<meta name="theme-color" content="#0B1E30" media="(prefers-color-scheme: dark)">\n'
         '<script src="assets/brand.js"></script>\n')
LOGOS = ('<img class="logo logo-l" src="assets/brand/logo-horizontal-light.svg" alt="جدد وعتقاء — كنوز الكتاب المقدس" width="252" height="76">'
         '<img class="logo logo-d" src="assets/brand/logo-horizontal-dark.svg" alt="جدد وعتقاء — كنوز الكتاب المقدس" width="252" height="76">')
BRAND_SUB = '<small>مكتبة دراسة الشواهد · TSK · كتاب الحياة</small>'
SITEBAR = ('<header class="sitebar"><a class="sb-logo" href="index.html" title="الصفحة الرئيسية">'
           '<img class="logo-l" src="assets/brand/logo-horizontal-light.svg" alt="جدد وعتقاء" width="146" height="44">'
           '<img class="logo-d" src="assets/brand/logo-horizontal-dark.svg" alt="جدد وعتقاء" width="146" height="44"></a>'
           '<span class="sp"></span><a class="sb-link" href="index.html">⌂ المكتبة</a>'
           '<button class="sb-theme" id="brandTheme" type="button" aria-label="الوضع الفاتح / الداكن">◐</button></header>\n')
TOOL_PAGES = {"search.html", "topics.html", "outline.html", "compare.html", "grammar.html", "strong.html"}
HERO = ('<section class="bhero"><div class="eyebrow">متى ١٣: ٥٢</div>'
        '<blockquote>«كُلُّ كَاتِبٍ مُتَعَلِّمٍ فِي مَلَكُوتِ السَّمَاوَاتِ يُشْبِهُ رَجُلاً رَبَّ بَيْتٍ يُخْرِجُ مِنْ كَنْزِهِ <b>جُدُدًا وَعُتَقَاءَ</b>»</blockquote>'
        '<div class="stats"><div class="stat"><b>${n(CAT.length)}</b><span>سفرًا</span></div>'
        '<div class="stat"><b>${allV.toLocaleString("ar-EG")}</b><span>عددًا</span></div>'
        '<div class="stat"><b>${allR.toLocaleString("ar-EG")}</b><span>شاهدًا</span></div>'
        '${dn?`<div class="stat"><b>${dn.toLocaleString("ar-EG")}</b><span>عددًا درستَه</span></div>`:""}</div></section>')

changed = []
for path in sorted(glob.glob(os.path.join(SITE, "*.html"))):
    name = os.path.basename(path)
    h = open(path, encoding="utf-8").read()
    if "assets/brand.js" in h:
        continue
    o = h
    # fonts: drop old Google Fonts links/preconnects, add the unified one
    h = re.sub(r'<link rel="preconnect" href="https://fonts\.(googleapis|gstatic)\.com"[^>]*>\s*', "", h)
    h = re.sub(r'<link href="https://fonts\.googleapis\.com/css2[^"]*" rel="stylesheet">\s*', "", h)
    h = h.replace('<link rel="stylesheet" href="assets/style.css">',
                  FONTS + '<link rel="stylesheet" href="assets/style.css?v=3">\n' + HEADX.rstrip("\n"), 1)
    # titles
    h = re.sub(r"(<title>[^<]*)مكتبة دراسة الشواهد", r"\1جدد وعتقاء", h)
    h = h.replace("<title>خريطة الشواهد الذهنية</title>", "<title>خريطة الشواهد الذهنية — جدد وعتقاء</title>")
    h = h.replace("<title>مكتبة جدد وعتقاء</title>", "<title>جدد وعتقاء — كنوز الكتاب المقدس</title>")
    if name == "index.html":
        h = re.sub(r"<title>جدد وعتقاء</title>", "<title>جدد وعتقاء — كنوز الكتاب المقدس</title>", h)
    # sidebar brand
    h = re.sub(r'(<(a|button) class="brand" id="home"[^>]*>).*?(</\2>)',
               lambda m: m.group(1) + LOGOS + BRAND_SUB + m.group(3), h, count=1, flags=re.S)
    # tool pages get the top bar
    if name in TOOL_PAGES:
        h = re.sub(r"<body>", "<body>\n" + SITEBAR, h, count=1)
    if name == "mindmap.html":
        h = h.replace("<h1>خريطة الشواهد</h1>",
                      '<a class="mmlogo" href="index.html" title="جدد وعتقاء"><img src="assets/brand/mark.svg" alt="جدد وعتقاء" width="40" height="34"></a><h1>خريطة الشواهد</h1>', 1)
    if name == "index.html":
        h = h.replace('<div class="crumbs"><button class="menu-btn" id="menu">☰</button><div class="ref">مكتبة دراسة الشواهد</div><span></span></div>',
                      '<div class="crumbs"><button class="menu-btn" id="menu">☰</button><div class="ref home-title"><span class="hl-text">مكتبة دراسة الشواهد</span>'
                      '<span class="hl-logo"><img class="logo-l" src="assets/brand/logo-horizontal-light.svg" alt="جدد وعتقاء"><img class="logo-d" src="assets/brand/logo-horizontal-dark.svg" alt=""></span></div><span></span></div>'
                      + HERO, 1)
    # cache-bust app.js so browsers pick up nothing stale alongside the new CSS
    if h != o:
        open(path, "w", encoding="utf-8").write(h)
        changed.append(name)
print(len(changed), "pages updated")
missing = [p for p in changed if p not in ("mindmap.html",)]
