"""Build assets/orig_<Book>.js — the original-language text (Hebrew / Aramaic / Greek) of every verse,
in ORIGINAL word order, from the Berean interlinear tables (Bibles/bsb_tables.xlsx).

Why: assets/bsb_<Book>.js keeps the words in English (BSB) order, which is right for the interlinear
but wrong for reading the original text. bsb_tables.xlsx has "Heb Sort" / "Greek Sort" columns with the
original order, so we sort by those.

Text column: "WLC / Nestle Base TR RP WH NE NA SBL" (WLC for the OT, Nestle base for the NT).
Hebrew words ending with maqqef (־) are joined to the next word without a space.

Usage (from the site folder):  python3 _tools/build_orig.py Bibles/bsb_tables.xlsx
Output: assets/orig_Gen.js … assets/orig_Rev.js   →   window.ORIG["Gen"] = {"1:1": "…", …}
Then run node _tools/build_seo_pwa.js as usual.
"""
import json, os, sys, time

ABBR = ("Gen Exo Lev Num Deu Jos Jdg Rut 1Sa 2Sa 1Ki 2Ki 1Ch 2Ch Ezr Neh Est Job Psa Pro Ecc Son Isa Jer Lam Eze "
        "Dan Hos Joe Amo Oba Jon Mic Nah Hab Zep Hag Zec Mal Mat Mar Luk Joh Act Rom 1Co 2Co Gal Eph Phi Col 1Th "
        "2Th 1Ti 2Ti Tit Phm Heb Jam 1Pe 2Pe 1Jo 2Jo 3Jo Jud Rev").split()

def rows(path):
    """Yield rows as lists of strings. Accepts the original .xlsx or a .tsv export of the same sheet."""
    if path.lower().endswith(".tsv"):
        import csv
        with open(path, encoding="utf-8") as f:
            r = csv.reader(f, delimiter="\t"); next(r)
            for x in r: yield x
        return
    import openpyxl
    ws = openpyxl.load_workbook(path, read_only=True)["biblosinterlinear96"]
    it = ws.iter_rows(values_only=True); next(it)
    for x in it: yield ["" if c is None else str(c) for c in x[:13]]

def main(src, out_dir):
    t = time.time()
    books, verse_ref, words = [], {}, {}          # verse index -> "Book c:v";  verse index -> [(sort, text)]
    for r in rows(src):
        vix, lang, text, ref = r[3], r[4], r[5].strip(), r[12].strip()
        if ref:
            verse_ref[vix] = ref
            b = ref.rsplit(" ", 1)[0]
            if not books or books[-1] != b:
                if b not in books: books.append(b)
        if not text or lang not in ("Hebrew", "Aramaic", "Greek"):
            continue                                   # English-only rows (words added by the translation)
        srt = r[1] if lang == "Greek" else r[0]
        try: srt = float(srt)
        except ValueError: continue
        words.setdefault(vix, []).append((srt, text))
    if len(books) != 66: sys.exit(f"ABORT: expected 66 books, found {len(books)}")
    name2ab = dict(zip(books, ABBR))
    out = {ab: {} for ab in ABBR}
    for vix, ws in words.items():
        ref = verse_ref.get(vix)
        if not ref: continue
        b, cv = ref.rsplit(" ", 1)
        ws.sort()
        s = ""
        for _, w in ws:
            s += w if (not s or s.endswith("־")) else " " + w
        out[name2ab[b]][cv] = s
    os.makedirs(out_dir, exist_ok=True)
    total = 0
    for ab in ABBR:
        js = f'window.ORIG=window.ORIG||{{}};window.ORIG["{ab}"]=' + json.dumps(out[ab], ensure_ascii=False, separators=(",", ":")) + ";\n"
        p = os.path.join(out_dir, f"orig_{ab}.js")
        with open(p, "w", encoding="utf-8") as f: f.write(js)
        total += len(js.encode("utf-8"))
    print(f"orig: {sum(len(v) for v in out.values())} verses in 66 books, {total/1e6:.1f} MB, {time.time()-t:.0f}s")

if __name__ == "__main__":
    if len(sys.argv) < 2: sys.exit(__doc__)
    here = os.path.dirname(os.path.abspath(__file__))
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else os.path.join(here, "..", "assets"))
