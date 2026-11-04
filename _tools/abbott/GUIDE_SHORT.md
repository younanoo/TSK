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
