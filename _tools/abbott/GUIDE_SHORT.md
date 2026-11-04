# SHORT version: additions to GUIDE.md (Philemon pilot)

Follow GUIDE.md for everything (tags, terminology, style), with these changes. The reader wants the MEANINGS and the BIBLE REFERENCES only.

The synonym paragraphs (`<sy>`) and the etymology/LXX block (`<et>`) were already removed from the input.

Translate:
- the form line `<f>` (headword, endings, gender);
- every sense `<s>` with its number, the gloss `<b>` and the explanation of the meaning or usage. That includes short grammar notes that change the meaning, e.g. "c. gen." → «مع المضاف إليه», "pass." → «المبني للمجهول»;
- every Bible reference `<r v="..."></r>`. ALL of them must stay, unchanged, in order.

Drop (leave out completely, without a placeholder):
- references to modern scholarly works and authors and their page numbers (MM, VGT, Deiss., LAE, Cremer, Thayer, Bl., M, Pr., Lft., Westc., DB, AR, LS, Dalman, Trench, Burton, WH App., etc.), and "v." / "cf." / "s.v." when they point only to such works;
- references to classical or extra-biblical authors (Hom., Plat., Xen., FlJ, Philo, papyri, inscriptions) and remarks about classical usage;
- textual-criticism notes about manuscripts and editions (WH, Tr., T., Rec., R mg., "א", "B", …), unless they change the meaning;
- empty brackets or stray punctuation left after these removals.

Keep Greek words `<g>` / `<x>` where they are part of the meaning or usage (e.g. a set phrase); you may drop one that only sits inside a dropped scholarly remark. Never change the text inside a tag you keep.

Output: the same JSON shape, `{"G26": "<short Arabic markup>"}`.
Checker: python3 -I SCRIPTS/check_short.py EN.json AR.json. It checks that all refs are kept, no new Greek or Hebrew appears, and no English is left.

## Additional rules (from the Ephesians/Philemon pilots)
1. Classical-only meanings: keep the label. Some senses or glosses describe a meaning found ONLY in classical/extra-biblical Greek ("in cl.", "Hom.", "Att." with only classical authors and no NT reference). Drop the author names, but START that sense with «في اليونانية الكلاسيكية:» so it does not read as a New Testament meaning. Use «عند الكتّاب المتأخرين:» for later writers and «في السبعينية:» for LXX-only usage. If the English contrasts "in cl. X; in NT Y", keep both halves briefly: «(في الكلاسيكية: X)؛ وفي العهد الجديد Y». Most classical remarks are incidental and are simply dropped.
2. Hebrew verb stems, if they appear: قال (qal) · نِفْعَل (ni.) · بِعِّيل (pi.) · بُعَّل (pu.) · هِفْعِيل (hi.) · هُفْعَل (ho.) · هِتْفَعِّيل (hith.). Always write the Arabic name followed by the Latin abbreviation in brackets, e.g. «بِعِّيل (pi.)».
3. "Tr." is Tregelles (a text edition, a textual note, so drop it). "Tr., Syn." / "Trench, Syn." is Trench's Synonyms, a scholarly work, so drop it too.
4. "π." in Greek letters is the abbreviation for papyri, so drop it with the remark.
5. Refs that sat inside a dropped remark stay, with «قارن» before them.
6. Copy Greek/Hebrew/Latin strings from the source PROGRAMMATICALLY (Unicode must be byte-identical). Never retype them.
7. Name every helper/temp file with your batch prefix (e.g. "s1b07_"). Other agents work in the same folder.
