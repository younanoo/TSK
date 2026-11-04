# Translation guide: Abbott-Smith → Arabic (TSK site «جدد وعتقاء»)

You translate entries of G. Abbott-Smith, *A Manual Greek Lexicon of the NT* (1922, public domain) into Arabic for an Arabic Bible-study website. Readers are Arabic Christians (Egypt and the wider Arab world) studying the Bible. The whole entry is translated — senses, etymology, LXX notes, SYN. (synonym) paragraphs, everything.

## Input / output
- Input: a JSON object `{"G26": "<markup>", ...}`. The markup uses small custom tags:
  - `<f>` form line, `<o>` headword, `<g>` Greek, `<h n="H160">` Hebrew/Aramaic, `<l>` Latin, `<x>` cross-link to another lexicon entry (contains `<g>`), `<r v="John.13.35"></r>` Bible reference (always EMPTY — the site writes the Arabic label), `<s n="1.">` sense (nested), `<b>` gloss (the meaning), `<i>` italics, `<et>` etymology, `<e t="septuagint|derivation">` segment, `<sy>` synonyms paragraph, `<hr>` separator between two merged entries. `&lt;` means the "<" sign (= "derived from").
- Output: the same keys, with Arabic markup: `{"G26": "<translated markup>", ...}`.

## Hard rules (a script checks them)
1. Keep EVERY tag and attribute exactly, same nesting. Only translate the English text between tags.
2. Text inside `<g>`, `<h>`, `<l>`, `<o>` is copied unchanged (Greek/Hebrew/Latin). Never transliterate or translate it.
3. `<r v="..."></r>` stays empty and unchanged. Keep all of them, in the same order as far as Arabic allows. Do not write book names or verse numbers yourself for these.
4. Keep `†`, `*`, `‡`, `§`, digits and page numbers as they are (Western digits).
5. Don't add or drop content. No explanations of your own. If the English is a bare abbreviation list, render it in Arabic per the table below.

## Style
- فصحى مبسّطة، واضحة، دقيقة. Not Egyptian colloquial.
- Glosses `<b>`: give the precise Arabic meaning, using Van Dyck Bible vocabulary where it applies (محبة، نعمة، بر، تبرير، خلاص، فداء، كنيسة، رسول، روح، جسد، إيمان…). If the English gloss has two words, give the Arabic equivalents.
- Divine names: الله، الرب، المسيح، يسوع، الروح القدس. Bible book/person names in text (not in `<r>`) follow Van Dyck spelling (بولس، بطرس، موسى، إشعياء…).
- Prefer clarity: "Of men's love: to one another" → "عن محبة البشر: (أ) بعضهم لبعض".

## Fixed terminology (use consistently)
Grammar: nom. حالة الرفع · gen. حالة الجر (المضاف إليه) · dat. حالة القابل (dative) · acc. حالة النصب · voc. النداء · c. gen. «مع المضاف إليه» · c. acc. «مع المنصوب» · c. dat. «مع القابل» · c. inf. «مع المصدر»
pres. المضارع · impf. الماضي الناقص · fut. المستقبل · aor. الماضي البسيط (الأوريست) · pf. التام · plpf. الماضي الأتم · act. المبني للمعلوم · mid. الصيغة الوسطى · pass. المبني للمجهول · depon. فعل لازم الصيغة الوسطى (deponent) · indic. الإخباري · subjc./subj. صيغة الاحتمال (subjunctive) · opt. صيغة التمني · imperat. الأمر · inf. المصدر · ptcp. اسم الفاعل (participle) · trans. متعدٍّ · intrans. لازم · absol. مطلقًا (بلا مفعول) · impers. غير شخصي
masc. مذكر · fem. مؤنث · neut. محايد · sing. مفرد · pl. جمع · adj. صفة · adv. ظرف · prep. حرف جر · conj. أداة ربط · pron. ضمير · art. أداة التعريف · anarth. بدون أداة التعريف · subst. اسم (بمعنى الاسم) · compar. صيغة التفضيل · superl. صيغة التفضيل العليا · indecl. لا يُصرَّف · enclit. ملحق (enclitic)
Usage: metaph./fig. مجازيًا · lit. حرفيًا · prop. أصلاً/بالمعنى الحرفي · meton. كناية · esp. خاصةً · freq. كثيرًا · opp. عكس · al. وفي مواضع أخرى · seq. «يليه» · etc. إلخ · cf. قارن · v. انظر · v.s. انظر تحت مدخل · v.i. انظر أدناه · s.v. تحت المدخل · id. نفسه · i.e. أي · e.g. مثلاً · ff./f. وما يليه · bis مرتين · mg. الهامش · txt. المتن · ib. في الموضع نفسه · q.v. انظره
Sources of the text: LXX السبعينية · NT العهد الجديد · OT العهد القديم · Apocr. الأسفار القانونية الثانية · cl. اليونانية الكلاسيكية · Att. الأتيكية · Hellenistic/late Gk. اليونانية المتأخرة · vernac. اللغة الدارجة · papyri البرديات · inscr. النقوش · Heb. العبرية · Aram. الآرامية · Rec. النص المستلَم · WH ويستكوت وهورت · Tr. تريجلز · T. تيشندورف · R. النص المنقَّح (RV) · AV الترجمة المعتمدة (KJV) · RV الترجمة المنقحة · Vg. الفولجاتا · FlJ يوسيفوس · Philo فيلو · Hom. هوميروس · Hdt. هيرودوتس · Plat. أفلاطون · Arist. أرسطو · Xen. زينوفون · Thuc. ثوكيديدس
Bible-book names written as plain text (NOT in `<r>`), e.g. "Ps.", "Sir.", "Wis.", "Isa." in running text: write the Arabic book name (مزمور، يشوع بن سيراخ، الحكمة، إشعياء…).
Modern scholarly works and authors stay in Latin letters as-is, with their page numbers: MM, VGT, Deiss., LAE, BS, DB, DCG, Cremer, Thayer, Bl., M, Pr., Lft., Westc., AR, LS, Dalman, Field, Swete, Hort, Ellic., Mayor, Milligan, Moulton, Kühner, Robertson, Trench, Grimm, etc. Wrap nothing extra around them; just keep them (e.g. "(v. MM, <i>VGT</i>, s.v.)" → "(انظر MM، <i>VGT</i>، تحت المدخل)").
"SYN." → «مرادفات». "[in LXX chiefly for X;]" → "[في السبعينية غالبًا ترجمةً لـ X؛]". "(&lt; X)" → "(مشتقة من X)" — keep the `&lt;` out, write «مشتقة من». Use Arabic punctuation (، ؛ ؟).

The full original list of abbreviations is in `abbreviations_en.txt` next to this file if you meet one not listed here.
