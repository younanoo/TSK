/* تجربة الخرائط داخل صفحة السفر — أعمال ١٣ فقط (مرحلة تجريبية).
   ملف مستقل: لا يغيّر app.js. يراقب #main بعد كل render ويضيف:
   - في صفحة الأصحاح: بطاقة «خريطة الأصحاح» + تمييز أسماء الأماكن في نص الأعداد.
   - في صفحة العدد: دبوس بجانب كل اسم مكان.
   الضغط على الاسم أو الدبوس يفتح لوحة سفلية فيها خريطة صغيرة ومعلومات المكان. */
(function(){
  const BOOK = "Act", CH = 13, KEY = "Act.13", BASE = "assets/geo_test/";
  if (!/\/Act\.html$/i.test(location.pathname) && !/Act\.html/i.test(location.href)) return;

  const AN = s => String(s).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"/></svg>';
  const MAPIC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13"/><path d="M9 4v13"/><path d="M15 7v13"/></svg>';

  const loaded = {};
  function load(src, cb){
    if (loaded[src] === true) return cb();
    if (loaded[src]) return loaded[src].push(cb);
    loaded[src] = [cb];
    const el = src.endsWith(".css") ? Object.assign(document.createElement("link"), {rel: "stylesheet", href: src})
                                    : Object.assign(document.createElement("script"), {src});
    el.onload = () => { const q = loaded[src]; loaded[src] = true; q.forEach(f => f()); };
    document.head.appendChild(el);
  }
  const ready = cb => load(BASE + "leaflet.css", () => load(BASE + "leaflet.js", () => load(BASE + "geo_Act13_site.js?v=1", cb)));

  /* ---------- CSS ---------- */
  const css = `
  .geo-card{background:var(--paper);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow);overflow:hidden;margin:14px 0}
  .geo-hd{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;border-bottom:1px solid var(--line)}
  .geo-hd b{font:700 16px var(--display);color:var(--heading);display:flex;align-items:center;gap:6px}
  .geo-hd b svg{width:18px;height:18px;color:var(--gold)}
  .geo-hd .t{font:600 11px var(--ui);color:var(--gold);background:var(--gold-soft);border-radius:999px;padding:1px 8px}
  .geo-btns{display:flex;gap:6px}
  .geo-btn{border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:10px;padding:5px 10px;font:500 13px var(--ui);cursor:pointer}
  .geo-btn.on{background:var(--accent);border-color:var(--accent);color:var(--on-accent)}
  .geo-map{height:320px;background:#cfe0e8}
  .geo-leg{display:flex;flex-wrap:wrap;gap:6px 14px;padding:9px 12px;font-size:12.5px;color:var(--muted);border-top:1px solid var(--line)}
  .geo-leg i{display:inline-block;width:11px;height:11px;border-radius:50%;vertical-align:-1px;margin-inline-end:5px}
  .lg-st{background:#8A2E1E;border:2px solid #fff;box-shadow:0 0 0 1px #8A2E1E}
  .lg-mn{background:#fff;border:2px solid #0F3554}
  .lg-rg{border-radius:3px!important;background:rgba(138,100,32,.25);border:1px dashed #8A6420}
  .lg-rt{width:18px!important;height:0!important;border-radius:0!important;border-top:2px dashed #8A2E1E}
  .geo-nm{color:var(--accent);font-weight:700;border-bottom:2px dotted var(--gold);cursor:pointer;border-radius:3px}
  .geo-nm:hover{background:var(--gold-soft)}
  .sw.geo-w{color:var(--accent);font-weight:700;border-bottom:2px dotted var(--gold)}
  .geo-pin{all:unset;cursor:pointer;color:var(--gold);display:inline-block;padding:0 2px;line-height:1;vertical-align:.05em}
  .geo-pin svg{width:.8em;height:.8em}
  .geo-pin:hover,.geo-pin:focus-visible{color:var(--accent)}
  .geo-map .leaflet-container,.geo-map{font-family:var(--ui)}
  .gl{background:rgba(255,253,247,.92);border:1px solid #c9b88f;border-radius:6px;padding:0 6px;font:700 12.5px/1.6 var(--ui);color:#2a2a2a;box-shadow:none;white-space:nowrap}
  .gl:before{display:none}
  .gl.rg{background:transparent;border:0;font:italic 600 13px var(--script);color:#6b4d16;text-shadow:0 0 3px #fff,0 0 3px #fff}
  .gl.mn{font-weight:500;color:#0F3554}
  .zlo .gl.st{display:none}
  .leaflet-control-attribution{font-size:10px;direction:ltr}
  :root[data-theme="dark"] .leaflet-tile-pane{filter:brightness(.72) saturate(.85)}
  @media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .leaflet-tile-pane{filter:brightness(.72) saturate(.85)}}
  .geo-scrim{position:fixed;inset:0;background:var(--scrim);opacity:0;pointer-events:none;transition:opacity .2s;z-index:3000}
  .geo-scrim.on{opacity:1;pointer-events:auto}
  .geo-gs{position:fixed;inset-inline:0;bottom:0;margin:0 auto;max-width:620px;background:var(--paper);color:var(--ink);border-radius:18px 18px 0 0;box-shadow:0 -8px 30px rgba(0,0,0,.2);transform:translateY(105%);transition:transform .25s ease;z-index:3001;max-height:88vh;overflow:auto}
  .geo-gs.on{transform:none}
  .geo-gs .grab{width:42px;height:5px;border-radius:5px;background:var(--line);margin:8px auto 2px}
  .geo-gs .hd{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding:6px 16px 8px}
  .geo-gs h3{margin:0;font:700 24px/1.3 var(--display);color:var(--heading)}
  .geo-gs .en{font:500 13px var(--ui);color:var(--muted);direction:ltr;display:inline-block}
  .geo-gs .x{all:unset;cursor:pointer;font-size:18px;color:var(--muted);padding:4px 8px}
  .geo-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 16px 10px}
  .geo-chip{font:600 12px var(--ui);border-radius:999px;padding:2px 10px;background:var(--chip);color:var(--ink);border:1px solid var(--line)}
  .geo-chip.ok{background:#E5F4E4;color:#2E6B43;border-color:#B9DDBE}
  .geo-chip.mid{background:#F9EEDA;color:#7A5410;border-color:#E9D2A2}
  .geo-chip.low{background:#FBEBEB;color:#8E2E22;border-color:#EDC4BE}
  .geo-pmap{height:210px;margin:0 16px;border-radius:12px;border:1px solid var(--line);background:#cfe0e8}
  .geo-body{padding:12px 16px 22px;font-size:15px}
  .geo-body dl{display:grid;grid-template-columns:auto 1fr;gap:6px 12px;margin:0 0 10px}
  .geo-body dt{color:var(--muted);font-size:13px;padding-top:2px}
  .geo-body dd{margin:0}
  .geo-body p{margin:0 0 10px;font:18px/1.8 var(--script)}
  .geo-body .vl a{color:var(--accent);font-weight:600;margin-inline-end:10px;text-decoration:none;border-bottom:1px solid var(--accent-soft)}
  .geo-soon{display:block;margin-top:12px;text-align:center;border:1px dashed var(--line);border-radius:10px;padding:8px;color:var(--muted);font-size:13px}
  .geo-src{font-size:11.5px;color:var(--muted);margin-top:10px;line-height:1.7}`;
  document.head.appendChild(Object.assign(document.createElement("style"), {textContent: css}));

  /* ---------- مساعدات البيانات ---------- */
  const P = () => window.GEO[KEY];
  const byId = id => P().find(p => p.id === id);
  const conf = sc => sc>=700 ? ["ok","موقعه مؤكد"] : sc>=300 ? ["mid","موقعه مرجّح"] : sc>0 ? ["low","موقعه محتمل"] : ["low","موقعه غير معروف"];
  const ROUTE = ["أنطاكية","سلوكية","سلاميس","بافوس","برجة","أنطاكية بيسيدية","إيقونية"]; // مرسوم يدويًا لهذا الأصحاح
  const isStation = p => ROUTE.includes(p.ar);
  const TRIP_RG = ["قبرس","بمفيلية","بيسيدية"];
  const LBL = {"بمفيلية": [36.62, 31.55], "بيسيدية": [37.72, 30.35]};
  const LDIR = {"سلوكية":"left","أنطاكية":"right","أنطاكية بيسيدية":"top","برجة":"bottom","بافوس":"left","سلاميس":"right","إيقونية":"right","أورشليم":"left","الجليل":"right"};
  const TILE = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}";
  const tiles = () => L.tileLayer(TILE, {maxNativeZoom: 8, maxZoom: 11, attribution: "Tiles &copy; Esri &mdash; US National Park Service | Places: OpenBible.info"});

  function where(){
    const h = decodeURIComponent(location.hash.slice(1));
    let m = h.match(/^\/Act\/ch\/(\d+)$/); if (m) return {view: "chapter", c: +m[1]};
    m = h.match(/^\/Act\/(\d+):(\d+)$/); if (m) return {view: "verse", c: +m[1], v: +m[2]};
    return {view: "other"};
  }

  /* ---------- بطاقة خريطة الأصحاح ---------- */
  function chapterCard(main){
    if (main.querySelector(".geo-card")) return;
    const anchor = main.querySelector(".cvlist") || main.querySelector(".ilist"); if (!anchor) return;
    const card = document.createElement("section");
    card.className = "geo-card";
    card.innerHTML = `<div class="geo-hd"><b>${MAPIC} خريطة الأصحاح <span class="t">تجريبي</span></b>
        <div class="geo-btns"><button class="geo-btn on" data-fit="trip">الرحلة</button><button class="geo-btn" data-fit="all">كل الأماكن</button></div></div>
      <div class="geo-map" dir="ltr" aria-label="خريطة أماكن الأصحاح"></div>
      <div class="geo-leg"><span><i class="lg-st"></i>محطة في الرحلة</span><span><i class="lg-mn"></i>مكان مذكور في الأصحاح</span><span><i class="lg-rg"></i>إقليم</span><span><i class="lg-rt"></i>مسار الرحلة</span></div>`;
    anchor.parentNode.insertBefore(card, anchor);
    const el = card.querySelector(".geo-map");
    const map = L.map(el, {zoomControl: false, scrollWheelZoom: false});
    L.control.zoom({position: "topright"}).addTo(map);
    map.attributionControl.setPrefix(false);
    tiles().addTo(map);
    const all = P(), by = Object.fromEntries(all.map(p => [p.ar, p]));
    all.filter(p => p.poly).forEach(p => {
      L.polygon(p.poly, {color: "#8A6420", weight: 1.2, dashArray: "4 3", fillColor: "#8A6420", fillOpacity: .12}).addTo(map).on("click", () => openPlace(p));
      L.marker(LBL[p.ar] || p.ll, {icon: L.divIcon({className: "", html: "", iconSize: [0,0]}), interactive: false}).addTo(map)
        .bindTooltip(p.ar, {permanent: true, direction: "center", className: "gl rg" + (TRIP_RG.includes(p.ar) ? " st" : "")});
    });
    const route = ROUTE.map(n => by[n].ll);
    L.polyline(route, {color: "#8A2E1E", weight: 2.4, dashArray: "6 6", opacity: .9}).addTo(map);
    all.filter(p => !p.poly).forEach(p => {
      const st = isStation(p);
      L.circleMarker(p.ll, st ? {radius: 6.5, color: "#fff", weight: 2, fillColor: "#8A2E1E", fillOpacity: 1}
                              : {radius: 5.5, color: "#0F3554", weight: 2, fillColor: "#fff", fillOpacity: 1}).addTo(map)
        .bindTooltip(p.ar, {permanent: true, direction: LDIR[p.ar] || "top", className: "gl" + (st ? " st" : " mn")})
        .on("click", () => openPlace(p));
    });
    const tb = L.latLngBounds(route).pad(.12), ab = L.latLngBounds(all.map(p => p.ll)).pad(.06);
    map.fitBounds(tb);
    const lz = () => el.classList.toggle("zlo", map.getZoom() < 6); map.on("zoomend", lz); lz();
    card.querySelectorAll("[data-fit]").forEach(b => b.onclick = () => {
      map.flyToBounds(b.dataset.fit === "all" ? ab : tb, {duration: .6});
      card.querySelectorAll("[data-fit]").forEach(x => x.classList.toggle("on", x === b));
    });
  }

  /* ---------- تمييز الأسماء في نص الأصحاح (صفحة الأصحاح) ---------- */
  const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const B = "(^|[\\s،؛.,:!?«»\"()\\u200f])";
  function markChapter(main){
    const F = window.GEO[KEY + ".forms"] || {};
    main.querySelectorAll(".cv[data-go]").forEach(btn => {
      const m = btn.dataset.go.match(/\.(\d+):(\d+)$/); if (!m || +m[1] !== CH) return;
      const fv = F[m[2]]; if (!fv) return;
      const t = btn.querySelector(".cvt"); if (!t || t.dataset.geo) return;
      t.dataset.geo = "1";
      const forms = Object.keys(fv).sort((a, b) => b.length - a.length);
      const re = new RegExp(B + "(" + forms.map(reEsc).join("|") + ")(?=$|[\\s،؛.,:!?«»\"()])", "g");
      t.innerHTML = t.innerHTML.replace(re, (all, pre, w) => `${pre}<span class="geo-nm" data-geo="${fv[w]}" title="اعرض على الخريطة">${w}</span>`);
    });
  }

  /* ---------- دبابيس في صفحة العدد ---------- */
  function markVerse(main, v){
    const ps = P().filter(p => p.v.includes(v)); if (!ps.length) return;
    main.querySelectorAll(".sw[data-n]").forEach(sw => {
      if (sw.dataset.geo) return;
      const ns = sw.dataset.n.split(" ");
      const p = ps.find(p => ns.some(x => p.g.includes(x))); if (!p) return;
      sw.dataset.geo = "1"; sw.classList.add("geo-w");
      const b = document.createElement("button");
      b.type = "button"; b.className = "geo-pin"; b.dataset.geo = p.id;
      b.title = p.ar + " — اعرض على الخريطة"; b.setAttribute("aria-label", b.title);
      b.innerHTML = PIN;
      sw.insertAdjacentElement("afterend", b);
    });
  }

  /* ---------- اللوحة السفلية ---------- */
  let gs, scrim, pmap = null, last = null;
  function sheet(){
    if (gs) return;
    scrim = Object.assign(document.createElement("div"), {className: "geo-scrim"});
    gs = Object.assign(document.createElement("div"), {className: "geo-gs"});
    gs.setAttribute("role", "dialog"); gs.setAttribute("aria-modal", "true");
    document.body.append(scrim, gs);
    scrim.onclick = closePlace;
    gs.addEventListener("click", e => {
      if (e.target.closest(".x")) return closePlace();
      if (e.target.closest(".vl a")) closePlace();
    });
    addEventListener("keydown", e => { if (e.key === "Escape" && gs.classList.contains("on")) closePlace(); });
  }
  function openPlace(p){
    sheet(); last = document.activeElement;
    const [cc, ct] = conf(p.sc);
    gs.innerHTML = `<div class="grab"></div>
      <div class="hd"><div><h3>${esc(p.ar)}</h3><span class="en">${esc(p.en)} · ${p.g.map(esc).join(" / ")}</span></div><button class="x" aria-label="إغلاق">✕</button></div>
      <div class="geo-chips"><span class="geo-chip">${esc(p.t)}</span><span class="geo-chip ${cc}">${ct}</span>${isStation(p) ? '<span class="geo-chip">محطة في رحلة بولس الأولى</span>' : ""}</div>
      <div class="geo-pmap" dir="ltr"></div>
      <div class="geo-body">
        <p>${esc(p.b)}</p>
        <dl><dt>المكان اليوم</dt><dd>${esc(p.mod)}</dd>
            <dt>في هذا الأصحاح</dt><dd class="vl">${p.v.map(v => `<a href="#/${BOOK}/${CH}:${v}">عدد ${AN(v)}</a>`).join("")}</dd></dl>
        ${aiBlock(p)}
        <span class="geo-soon">صفحة المكان (كل الشواهد في الكتاب المقدس) — في المرحلة التالية</span>
        <div class="geo-src">المواقع ودرجة الثقة: OpenBible.info · ربط الأسماء بسترونج: STEP Bible · الخريطة: Esri</div>
      </div>`;
    scrim.classList.add("on"); gs.classList.add("on"); document.documentElement.style.overflow = "hidden";
    setTimeout(() => {
      if (pmap) pmap.remove();
      pmap = L.map(gs.querySelector(".geo-pmap"), {zoomControl: false, attributionControl: false, scrollWheelZoom: false});
      tiles().addTo(pmap);
      if (p.poly) { const g = L.polygon(p.poly, {color: "#8A6420", weight: 1.5, fillColor: "#8A6420", fillOpacity: .18}).addTo(pmap); pmap.fitBounds(g.getBounds().pad(.25)); }
      else { L.circleMarker(p.ll, {radius: 8, color: "#fff", weight: 2.5, fillColor: "#8A2E1E", fillOpacity: 1}).addTo(pmap).bindTooltip(p.ar, {permanent: true, direction: "top", className: "gl"}); pmap.setView(p.ll, p.t === "مدينة" ? 7 : 6); }
      gs.querySelector(".x").focus();
    }, 260);
  }
  /* ---------- اسأل Google AI عن المكان (نفس فكرة askai.js لأرقام سترونج، داخل اللوحة) ---------- */
  const SPARK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"/></svg>';
  const sget = (k, d) => { try { const v = localStorage.getItem("tsklib:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
  const sset = (k, v) => { try { localStorage.setItem("tsklib:" + k, JSON.stringify(v)); } catch (e) {} };
  let AIQ = [];
  function aiQuestions(p){
    const w = where();
    const v = w.view === "verse" && p.v.includes(w.v) ? w.v : p.v[0];
    const ref = `أعمال الرسل ${AN(CH)}: ${AN(v)}`;
    const kind = {"مدينة": "مدينة", "إقليم": "إقليم", "جزيرة": "جزيرة"}[p.t] || "مكان";
    const name = `${kind} «${p.ar}» (${p.en})`;
    const tail = " أجب باللغة العربية، واذكر الشواهد الكتابية.";
    return [
      ["ctx", "في سياق الآية", `ما أهمية ${name} كما وردت في ${ref}؟ ولماذا ذُكرت في هذا الموضع، وكيف يساعد موقعها على فهم الأحداث؟` + tail],
      ["bible", "في الكتاب المقدس", `أين ورد ذكر ${name} في الكتاب المقدس؟ وما أهم الأحداث التي جرت فيها أو ارتبطت بها؟` + tail],
      ["hist", "التاريخ والآثار", `حدّثني عن تاريخ ${name} في زمن الكتاب المقدس: من سكنها، وأهميتها السياسية والدينية، وما الذي كشفه علم الآثار عنها.` + tail],
      ["today", "أين هي اليوم", `أين تقع ${name} اليوم (${p.mod})؟ وماذا بقي منها من آثار يمكن زيارتها؟` + tail],
      ["all", "دراسة شاملة", `قدّم دراسة كتابية عن ${name} (كما وردت في ${ref}): موقعها الجغرافي، وتاريخها، وأهم ما ورد عنها في الكتاب المقدس، ودلالتها الروحية.` + tail]
    ];
  }
  function aiBlock(p){
    AIQ = aiQuestions(p);
    const pick = AIQ.some(q => q[0] === sget("geoaiq", "ctx")) ? sget("geoaiq", "ctx") : "ctx";
    return `<button type="button" class="geo-ai" aria-expanded="false">${SPARK} اسأل Google AI عن هذا المكان</button>
      <div class="geo-aip" hidden>
        <p class="al">ماذا تريد أن تعرف؟</p>
        <div class="aq" role="group" aria-label="نوع السؤال">${AIQ.map(([k, t]) => `<button type="button" data-k="${k}" aria-pressed="${k === pick}">${t}</button>`).join("")}</div>
        <p class="al">السؤال (يمكنك تعديله أو الإضافة إليه):</p>
        <textarea dir="rtl">${esc((AIQ.find(q => q[0] === pick) || AIQ[0])[2])}</textarea>
        <div class="af"><button type="button" class="go">${SPARK} اسأل Google AI</button><button type="button" class="cp">نسخ السؤال</button></div>
        <p class="an">سيُفتح وضع الذكاء الاصطناعي من Google في نافذة جديدة. الإجابة من Google وليست من الموقع، فراجعها على الكتاب المقدس نفسه.</p>
      </div>`;
  }
  function aiSend(q){
    if (!q) return;
    const url = "https://www.google.com/search?udm=50&hl=ar&q=" + encodeURIComponent(q);
    const small = innerWidth < 760 || matchMedia("(pointer:coarse)").matches;
    let w = null;
    if (!small) {
      const ww = 520, hh = Math.min((screen.availHeight || 900) - 60, 860), left = (screen.availLeft || 0) + (screen.availWidth || 1280) - ww - 20, top = (screen.availTop || 0) + 30;
      w = window.open(url, "tskai", `popup=yes,width=${ww},height=${hh},left=${left},top=${top}`);
    } else w = window.open(url, "_blank");
    if (!w) { const a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener"; document.body.appendChild(a); a.click(); a.remove(); }
  }
  document.head.appendChild(Object.assign(document.createElement("style"), {textContent: `
  .geo-ai{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:6px;font:600 13px var(--ui);border:1px solid var(--accent);color:var(--accent);border-radius:999px;padding:5px 14px;margin:4px 0 2px}
  .geo-ai:hover,.geo-ai[aria-expanded="true"]{background:var(--accent);color:var(--on-accent)}
  .geo-ai svg,.geo-aip .go svg{width:15px;height:15px}
  .geo-ai:focus-visible,.geo-aip button:focus-visible{outline:2px solid var(--brand-gold);outline-offset:2px}
  .geo-aip{margin-top:10px;padding:12px;border:1px solid var(--line);border-radius:14px;background:var(--bg)}
  .geo-aip .al{font:600 13px var(--ui);color:var(--heading);margin:0 0 8px}
  .geo-aip .aq{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px}
  .geo-aip .aq button{all:unset;cursor:pointer;font:500 13px var(--ui);padding:5px 12px;border-radius:999px;border:1px solid var(--line);color:var(--ink);background:var(--paper)}
  .geo-aip .aq button[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:var(--on-accent)}
  .geo-aip textarea{box-sizing:border-box;width:100%;min-height:110px;resize:vertical;border:1px solid var(--line);border-radius:12px;padding:10px 12px;font:15px/1.8 var(--ui);color:var(--ink);background:var(--paper)}
  .geo-aip .af{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
  .geo-aip .go{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:8px;background:var(--accent);color:var(--on-accent);font:700 14px var(--ui);padding:9px 16px;border-radius:12px}
  .geo-aip .cp{all:unset;cursor:pointer;font:600 13px var(--ui);color:var(--accent);padding:8px 14px;border-radius:12px;border:1px solid var(--line)}
  .geo-aip .an{margin:10px 0 0;font-size:12px;color:var(--muted);font-family:var(--ui)}`}));
  document.addEventListener("click", e => {
    if (!gs || !gs.contains(e.target)) return;
    const tg = e.target.closest(".geo-ai");
    if (tg) { const pn = gs.querySelector(".geo-aip"); pn.hidden = !pn.hidden; tg.setAttribute("aria-expanded", !pn.hidden); if (!pn.hidden) pn.scrollIntoView({behavior: "smooth", block: "nearest"}); return; }
    const qb = e.target.closest(".geo-aip .aq button");
    if (qb) { gs.querySelectorAll(".geo-aip .aq button").forEach(x => x.setAttribute("aria-pressed", x === qb)); gs.querySelector(".geo-aip textarea").value = (AIQ.find(q => q[0] === qb.dataset.k) || AIQ[0])[2]; sset("geoaiq", qb.dataset.k); return; }
    if (e.target.closest(".geo-aip .go")) return aiSend(gs.querySelector(".geo-aip textarea").value.trim());
    const cp = e.target.closest(".geo-aip .cp");
    if (cp) { const ta = gs.querySelector(".geo-aip textarea"); (navigator.clipboard ? navigator.clipboard.writeText(ta.value) : Promise.reject()).catch(() => { ta.select(); document.execCommand && document.execCommand("copy"); }).finally(() => { cp.textContent = "تم النسخ ✓"; setTimeout(() => cp.textContent = "نسخ السؤال", 1600); }); }
  });

  function closePlace(){
    if (!gs) return;
    gs.classList.remove("on"); scrim.classList.remove("on"); document.documentElement.style.overflow = "";
    if (last && document.contains(last)) last.focus();
  }

  /* الضغط على اسم/دبوس: يسبق app.js (capture) حتى لا يفتح العدد أو القاموس */
  window.addEventListener("click", e => {
    const t = e.target.closest && e.target.closest("[data-geo]:not(.sw):not(.cvt)");
    if (!t || !window.GEO || !window.GEO[KEY]) return;
    e.preventDefault(); e.stopPropagation();
    const p = byId(t.dataset.geo); if (p) openPlace(p);
  }, true);

  /* ---------- التشغيل بعد كل render ---------- */
  let busy = false;
  function apply(){
    busy = false;
    const w = where(); if (w.c !== CH) return;
    const main = document.getElementById("main"); if (!main) return;
    ready(() => {
      if (w.view === "chapter") { chapterCard(main); markChapter(main); }
      else if (w.view === "verse") markVerse(main, w.v);
    });
  }
  const schedule = () => { if (!busy) { busy = true; requestAnimationFrame(apply); } };
  function start(){
    const main = document.getElementById("main"); if (!main) return setTimeout(start, 200);
    new MutationObserver(ms => {
      /* نتجاهل تغييرات داخل الخريطة نفسها أو تمييزاتنا */
      if (ms.every(m => m.target.closest && m.target.closest(".geo-card,.cvt[data-geo]"))) return;
      schedule();
    }).observe(main, {childList: true, subtree: true});
    addEventListener("hashchange", schedule);
    schedule();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
