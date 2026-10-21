# -*- coding: utf-8 -*-
"""
make_votd.py — يجهّز بيانات «آية اليوم» للصفحة الرئيسية (index.html)

الاستخدام (من فولدر الموقع):
    python _tools/make_votd.py

بيقرأ: _tools/votd_list.txt   (القائمة اللي بتعدّلها بنفسك)
وبيكتب: assets/home_votd.js + assets/votd/*.js   (البيانات اللي الصفحة بتقراها — ماتعدلهاش بإيدك)
"""
import json, re, os, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIST = os.path.join(ROOT, "_tools", "votd_list.txt")
OUT  = os.path.join(ROOT, "assets", "home_votd.js")

AR = {"Gen": "التكوين", "Exo": "الخروج", "Lev": "اللاويين", "Num": "العدد", "Deu": "التثنية", "Jos": "يشوع", "Jdg": "القضاة", "Rut": "راعوث", "1Sa": "صموئيل الأول", "2Sa": "صموئيل الثاني", "1Ki": "الملوك الأول", "2Ki": "الملوك الثاني", "1Ch": "أخبار الأيام الأول", "2Ch": "أخبار الأيام الثاني", "Ezr": "عزرا", "Neh": "نحميا", "Est": "أستير", "Job": "أيوب", "Psa": "المزامير", "Pro": "الأمثال", "Ecc": "الجامعة", "Son": "نشيد الأنشاد", "Isa": "إشعياء", "Jer": "إرميا", "Lam": "مراثي إرميا", "Eze": "حزقيال", "Dan": "دانيال", "Hos": "هوشع", "Joe": "يوئيل", "Amo": "عاموس", "Oba": "عوبديا", "Jon": "يونان", "Mic": "ميخا", "Nah": "ناحوم", "Hab": "حبقوق", "Zep": "صفنيا", "Hag": "حجي", "Zec": "زكريا", "Mal": "ملاخي", "Mat": "متى", "Mar": "مرقس", "Luk": "لوقا", "Joh": "يوحنا", "Act": "أعمال الرسل", "Rom": "رومية", "1Co": "كورنثوس الأولى", "2Co": "كورنثوس الثانية", "Gal": "غلاطية", "Eph": "أفسس", "Phi": "فيلبي", "Col": "كولوسي", "1Th": "تسالونيكي الأولى", "2Th": "تسالونيكي الثانية", "1Ti": "تيموثاوس الأولى", "2Ti": "تيموثاوس الثانية", "Tit": "تيطس", "Phm": "فليمون", "Heb": "العبرانيين", "Jam": "يعقوب", "1Pe": "بطرس الأولى", "2Pe": "بطرس الثانية", "1Jo": "يوحنا الأولى", "2Jo": "يوحنا الثانية", "3Jo": "يوحنا الثالثة", "Jud": "يهوذا", "Rev": "الرؤيا"}
SH = {"Gen": "تك", "Exo": "خر", "Lev": "لا", "Num": "عد", "Deu": "تث", "Jos": "يش", "Jdg": "قض", "Rut": "را", "1Sa": "١صم", "2Sa": "٢صم", "1Ki": "١مل", "2Ki": "٢مل", "1Ch": "١أخ", "2Ch": "٢أخ", "Ezr": "عز", "Neh": "نح", "Est": "أس", "Job": "أي", "Psa": "مز", "Pro": "أم", "Ecc": "جا", "Son": "نش", "Isa": "إش", "Jer": "إر", "Lam": "مرا", "Eze": "حز", "Dan": "دا", "Hos": "هو", "Joe": "يؤ", "Amo": "عا", "Oba": "عو", "Jon": "يون", "Mic": "مي", "Nah": "نا", "Hab": "حب", "Zep": "صف", "Hag": "حج", "Zec": "زك", "Mal": "ملا", "Mat": "مت", "Mar": "مر", "Luk": "لو", "Joh": "يو", "Act": "أع", "Rom": "رو", "1Co": "١كو", "2Co": "٢كو", "Gal": "غل", "Eph": "أف", "Phi": "في", "Col": "كو", "1Th": "١تس", "2Th": "٢تس", "1Ti": "١تي", "2Ti": "٢تي", "Tit": "تي", "Phm": "فل", "Heb": "عب", "Jam": "يع", "1Pe": "١بط", "2Pe": "٢بط", "1Jo": "١يو", "2Jo": "٢يو", "3Jo": "٣يو", "Jud": "يه", "Rev": "رؤ"}

OCC = {  # الاسم في الملف -> المفتاح في البيانات
    "رأس السنة": "newyear", "عيد الميلاد": "christmas", "عيد الغطاس": "epiphany",
    "بداية الصوم الكبير": "lent", "أحد الشعانين": "palm", "خميس العهد": "thursday",
    "الجمعة العظيمة": "friday", "عيد القيامة": "easter", "عيد الصعود": "ascension",
    "عيد العنصرة": "pentecost",
}

D = json.JSONDecoder()
def nz(x):
    x = re.sub(r"[٠-٩]", lambda m: str("٠١٢٣٤٥٦٧٨٩".index(m.group(0))), str(x))
    x = re.sub(r"[أإآ]", "ا", x).replace("ى", "ي").replace("ة", "ه")
    return re.sub(r"[ً-ْ\s.]", "", x).lower()
NAMES = {}
for ab in AR:
    for t in (ab, AR[ab], SH[ab]):
        NAMES[nz(t)] = ab

def parse_ref(t):
    t = re.sub(r"[٠-٩]", lambda m: str("٠١٢٣٤٥٦٧٨٩".index(m.group(0))), t.strip())
    m = re.match(r"^(.*?)\s*(\d+)\s*[:：٫.\s]\s*(\d+)$", t)
    if not m: return None
    ab = NAMES.get(nz(m.group(1)))
    return ab and (ab, int(m.group(2)), int(m.group(3)))

def load_obj(path, start_pat):
    s = open(path, encoding="utf-8").read()
    i = s.index("{", s.index(start_pat))
    return s, D.raw_decode(s, i)

TR, LIB = {}, {}
def tr(b):
    if b not in TR:
        s, (d, e) = load_obj(os.path.join(ROOT, "assets", f"tr_{b}.js"), f'TR["{b}"]')
        m = re.search(r"svdK=(\{)", s[e:])
        d["svdK"] = D.raw_decode(s, e + m.start(1))[0] if m else {}
        TR[b] = d
    return TR[b]
def lib(b):
    if b not in LIB:
        s = open(os.path.join(ROOT, "assets", f"lib_{b}.js"), encoding="utf-8").read()
        j = D.raw_decode(s, s.index("["))[0]
        LIB[b] = {(v["c"], v["v"]): v for v in j[0]["verses"]}
    return LIB[b]
def vd(b, c, v): return tr(b)["svd"].get(f"{c}:{v}")

def refl(l):
    m = re.match(r"(\d?[A-Z][a-z]{1,2})\s+(\d+):(\d+)(?:-(\d+))?", l)
    return m and (m.group(1), int(m.group(2)), int(m.group(3)), int(m.group(4)) if m.group(4) else 0)

def build(b, c, v):
    """[سفر, أصحاح, عدد, نص فاندايك, مجموعات الشواهد, إجمالي الشواهد] أو رسالة خطأ"""
    t = vd(b, c, v)
    if not t: return f"العدد مش موجود في فاندايك"
    x = lib(b).get((c, v))
    if not x: return "العدد مش موجود في بيانات الشواهد"
    K = tr(b)["svdK"].get(f"{c}:{v}", [])
    groups = []
    for gi, g in enumerate(x["groups"]):
        if len(groups) >= 3: break
        kw = K[gi] if gi < len(K) else ""
        rs = []
        for r in g["refs"]:
            p = refl(r["l"])
            if not p: continue
            rt = vd(p[0], p[1], p[2])
            if rt: rs.append([p[0], p[1], p[2], p[3], rt])
            if len(rs) >= 3: break
        if kw and rs: groups.append([kw, rs, len(g["refs"])])
    if not groups: return "الآية مالهاش شواهد كفاية في فاندايك — اختار آية تانية"
    return [b, c, v, t, groups, sum(len(g["refs"]) for g in x["groups"])]

def main():
    cal, occ, days, spare, errors, seen = "east", {}, {}, [], [], {}
    for n, raw in enumerate(open(LIST, encoding="utf-8-sig"), 1):
        line = raw.split("#")[0].strip()
        if not line: continue
        if ":" not in line:
            errors.append(f"سطر {n}: مفيش «:» — {raw.strip()}"); continue
        key, ref = [x.strip() for x in line.split(":", 1)]
        if key == "التقويم":
            cal = {"شرقي": "east", "غربي": "west"}.get(ref)
            if not cal: errors.append(f"سطر {n}: التقويم لازم يكون «شرقي» أو «غربي»"); cal = "east"
            continue
        p = parse_ref(ref)
        if not p:
            errors.append(f"سطر {n}: الشاهد «{ref}» مش مفهوم (اكتبه كده: يو ٣: ١٦)"); continue
        r = build(*p)
        if isinstance(r, str):
            errors.append(f"سطر {n}: {ref} — {r}"); continue
        kd = re.sub(r"[٠-٩]", lambda m: str("٠١٢٣٤٥٦٧٨٩".index(m.group(0))), key)
        if kd in ("احتياطي", "احتياطى"):
            spare.append(r)
        elif kd in OCC:
            occ[OCC[kd]] = r
        elif re.fullmatch(r"\d{1,2}/\d{1,2}", kd):
            d, m = map(int, kd.split("/"))
            if not (1 <= m <= 12 and 1 <= d <= 31):
                errors.append(f"سطر {n}: التاريخ «{key}» غلط (يوم/شهر)"); continue
            k = f"{m:02d}-{d:02d}"
            if k in days: errors.append(f"سطر {n}: التاريخ {key} متكرر — هيتاخد آخر واحد")
            days[k] = r
        else:
            errors.append(f"سطر {n}: «{key}» مش تاريخ (يوم/شهر) ولا اسم مناسبة معروف"); continue
        seen.setdefault(f"{p[0]} {p[1]}:{p[2]}", []).append(n)
    missing = []
    import datetime
    d0 = datetime.date(2024, 1, 1)
    for i in range(366):
        dd = d0 + datetime.timedelta(i)
        if f"{dd.month:02d}-{dd.day:02d}" not in days: missing.append(f"{dd.day}/{dd.month}")
    def write(path, obj):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            f.write("/* آية اليوم — اتعمل تلقائيًا بـ _tools/make_votd.py من _tools/votd_list.txt — ماتعدلش هنا */\n")
            f.write(obj + ";\n")
    J = lambda o: json.dumps(o, ensure_ascii=False, separators=(",", ":"))
    # ملف صغير فيه التقويم والمناسبات، وملف لكل شهر، وملف للاحتياطي — الصفحة بتحمّل اللي محتاجاه بس
    write(OUT, "window.VOTD=Object.assign(window.VOTD||{}," + J({"cal": cal, "occ": occ}) + ")")
    for m in range(1, 13):
        part = {k: v for k, v in days.items() if k.startswith(f"{m:02d}-")}
        write(os.path.join(ROOT, "assets", "votd", f"{m:02d}.js"), f'(window.VOTD=window.VOTD||{{}})["m{m:02d}"]=' + J(part))
    write(os.path.join(ROOT, "assets", "votd", "spare.js"), '(window.VOTD=window.VOTD||{})["spare"]=' + J(spare))
    print(f"تم: {len(days)} يوم + {len(occ)} مناسبة + {len(spare)} احتياطي  ←  assets/home_votd.js + assets/votd/")
    dup = {k: v for k, v in seen.items() if len(v) > 1}
    if dup: print("تنبيه — آيات متكررة:", "; ".join(f"{k} (سطور {', '.join(map(str, v))})" for k, v in dup.items()))
    if missing: print(f"تنبيه — أيام من غير آية ({len(missing)}): " + "، ".join(missing[:40]) + (" …" if len(missing) > 40 else "") + "\n  (الأيام دي هتاخد آية من الاحتياطي)")
    if errors:
        print(f"\n{len(errors)} مشكلة (السطور دي اتجاهلت):"); [print("  - " + e) for e in errors]
        sys.exit(1)

if __name__ == "__main__":
    main()
