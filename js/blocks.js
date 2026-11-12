/* Business English Book — lesson / quiz / answer-key blocks + diagrams */
(function (W) {
  'use strict';
  const B = W.BK, esc = B.esc, fmt = B.fmt, pr = B.pr, h = B.h;
  const L4 = ['A', 'B', 'C', 'D'];
  const blank = '<span class="blank"></span>';
  const qline = s => esc(s).replace(/_{2,}/g, blank);
  const cb3 = '<span class="cb"></span><span class="cb"></span><span class="cb"></span>';

  B.sec = (no, en, ar) => h('div', 'sec', '<span class="sec-no">' + no + '</span><span class="sec-en" dir="ltr">' + esc(en) + '</span><span class="sec-ar">' + esc(ar) + '</span>');

  B.lessonHead = (L, wk, day) => h('div', 'lhead',
    '<div class="lday"><small>DAY</small><b>' + day + '</b><small>OF 30</small></div>' +
    '<div class="ltit"><div class="lwk" dir="ltr">Week ' + wk.n + ' · ' + esc(wk.titleEn) + '</div><div class="lten" dir="ltr">' + esc(L.titleEn) + '</div><div class="ltar">' + fmt(L.titleAr) + '</div></div>');

  B.goalBox = L => h('div', 'goal',
    '<div class="goal-t">الهدف من الدرس · <span class="en">Lesson goal</span></div><p>' + fmt(L.goalAr) + '</p>' +
    (L.whyAr ? '<p class="why"><b>ليه الدرس ده مهم؟</b> ' + fmt(L.whyAr) + '</p>' : ''));

  B.canDo = L => h('div', 'cando', '<div class="cando-t">بعد الدرس ده هتقدر:</div><ul>' + L.canDo.map(c => '<li><span class="cb"></span>' + fmt(c) + '</li>').join('') + '</ul>');

  B.timeline = plan => h('div', 'tline', '<div class="tl-t">خطة المذاكرة · 30 إلى 40 دقيقة</div><div class="tl-r">' + plan.map(p => '<span class="tl-c"><b>' + p.min + '</b> د · ' + esc(p.ar) + '</span>').join('') + '</div>');

  B.vocabSpec = L => ({
    cls: 'vocab',
    head: ['#', 'English', 'النطق', 'المعنى', 'Example'],
    colCls: ['c-n', 'c-en', 'c-pr', 'c-ar', 'c-ex'],
    dirs: [null, 'ltr', null, null, 'ltr'],
    rows: L.vocab.map((v, i) => ({ cells: [i + 1, '<b>' + esc(v.en) + '</b> <i class="pos">' + esc(v.pos) + '</i>', '<span class="pron">' + pr(v.pron) + '</span>', fmt(v.ar), esc(v.ex)] }))
  });

  B.grammarBlocks = G => {
    const out = [];
    out.push([
      h('div', 'gtitle', '<span class="gt-en" dir="ltr">' + esc(G.titleEn) + '</span><span class="gt-ar">' + fmt(G.titleAr) + '</span>'),
      h('div', 'explain', '<p>' + fmt(G.introAr) + '</p>')
    ]);
    G.points.forEach((p, i) => out.push(h('div', 'gpoint',
      '<div class="gp-h"><span class="gp-n">' + (i + 1) + '</span>' + fmt(p.headAr) + '</div><p>' + fmt(p.textAr) + '</p><div class="gp-ex">' +
      p.examples.map(e => '<div class="ex-row"><span class="e-en" dir="ltr">' + esc(e.en) + '</span><span class="e-ar">' + fmt(e.ar) + '</span></div>').join('') + '</div>')));
    if (G.table) out.push(h('div', 'gtable',
      '<table class="tbl pat" dir="ltr"><thead><tr>' + G.table.headers.map(x => '<th>' + esc(x) + '</th>').join('') + '</tr></thead><tbody>' +
      G.table.rows.map(r => '<tr>' + r.map((c, k) => '<td' + (k === 0 ? ' class="k"' : '') + '>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table>'));
    if (G.mistakes && G.mistakes.length) out.push(h('div', 'mist',
      '<div class="mist-t">غلطات شائعة — خلّي بالك · <span class="en">Common mistakes</span></div>' +
      G.mistakes.map(m => '<div class="mrow"><div class="mw" dir="ltr"><span class="x">✗</span> ' + esc(m.wrong) + '</div><div class="mr" dir="ltr"><span class="ok">✓</span> ' + esc(m.right) + '</div><div class="mn">' + fmt(m.noteAr) + '</div></div>').join('')));
    if (G.tipAr) out.push(h('div', 'tip', '<b>نصيحة للتحدث:</b> ' + fmt(G.tipAr)));
    return out;
  };

  B.sentSpec = L => ({
    cls: 'sent',
    head: ['#', 'English', 'الترجمة', 'قلتها؟'],
    colCls: ['c-n', 'c-en', 'c-ar', 'c-chk'],
    dirs: [null, 'ltr', null, null],
    rows: L.sentences.map((s, i) => ({ cells: [i + 1, esc(s.en), fmt(s.ar), cb3] }))
  });

  B.dialogueBlocks = D => {
    const out = [h('div', 'scene', '<b dir="ltr">' + esc(D.titleEn) + '</b><br>' + fmt(D.sceneAr))];
    D.lines.forEach((l, i) => out.push(h('div', 'dl' + (i % 2 ? ' alt' : ''),
      '<div class="who"><span class="av">' + esc(l.who.charAt(0)) + '</span><span class="nm" dir="ltr">' + esc(l.who) + '</span></div><div class="say"><div class="den" dir="ltr">' + esc(l.en) + '</div><div class="dar">' + fmt(l.ar) + '</div></div>')));
    return out;
  };

  const exHead = (k, en, ar) => h('div', 'exh', '<span class="exk">' + k + '</span><b dir="ltr">' + esc(en) + '</b><span class="exa">' + esc(ar) + '</span>');
  const xi = (n, inner) => h('div', 'xi', '<span class="xn">' + n + '</span><div class="xbody">' + inner + '</div>');
  B.exGroups = L => [
    { head: exHead('A', 'Put the words in order', 'رتّب الكلمات عشان تكوّن جملة صحيحة'), items: L.exBuild.map((x, i) => xi(i + 1, '<div class="chips" dir="ltr">' + x.words.map(w => '<span class="chip">' + esc(w) + '</span>').join('') + '</div><div class="wline"></div>')) },
    { head: exHead('B', 'Complete the sentence', 'كمّل الجملة بالكلمة المناسبة'), items: L.exComplete.map((x, i) => xi(i + 1, '<div class="qq" dir="ltr">' + qline(x.q) + '</div><div class="opts" dir="ltr">' + x.options.map(o => '<span class="chip o">' + esc(o) + '</span>').join('') + '</div>')) },
    { head: exHead('C', 'Write your own sentence', 'اكتب جملتك بنفسك'), items: L.exWrite.map((x, i) => xi(i + 1, '<div class="pa">' + fmt(x.promptAr) + '</div><div class="hint" dir="ltr">Hint: ' + esc(x.hint) + '</div><div class="wline"></div>')) },
    { head: exHead('D', 'Translate into English', 'ترجم من العربي للإنجليزي'), items: L.exTranslate.map((x, i) => xi(i + 1, '<div class="pa big">' + fmt(x.ar) + '</div><div class="wline"></div>')) },
    { head: exHead('E', 'Speaking practice', 'اتكلم بصوت عالي'), items: L.speak.map((x, i) => xi(i + 1, '<div class="qq" dir="ltr">' + esc(x.promptEn) + '</div><div class="pa">' + fmt(x.promptAr) + '</div><div class="sp-chk">قلتها بصوت عالي: ' + cb3 + '</div>')) }
  ];

  B.videoBox = (v, L) => {
    if (!v || !v.url) return h('div', 'video none', '<b>فيديو الدرس:</b> ابحث في YouTube عن <span class="en">' + esc(L.titleEn) + ' English lesson</span>');
    const short = u => esc(String(u).replace(/^https?:\/\/(www\.)?/, ''));
    return h('div', 'video',
      '<div class="v-h"><span class="play"></span><b>شاهد واسمع · Watch &amp; Listen</b></div>' +
      '<div class="v-t" dir="ltr">' + esc(v.title) + ' <small>— ' + esc(v.channel) + '</small></div>' +
      '<a class="v-u" dir="ltr" href="' + esc(v.url) + '">' + short(v.url) + '</a>' +
      (v.whyAr ? '<p>' + fmt(v.whyAr) + '</p>' : '') +
      (L.listenAr ? '<p class="listen"><b>ركّز على:</b> ' + fmt(L.listenAr) + '</p>' : '') +
      (v.backup && v.backup.url ? '<div class="v-b" dir="ltr">Backup: <a href="' + esc(v.backup.url) + '">' + short(v.backup.url) + '</a></div>' : ''));
  };

  B.modelBlocks = M => {
    const out = [];
    M.forEach(m => {
      out.push([
        h('div', 'm-t', '<span dir="ltr">' + esc(m.titleEn) + '</span> · ' + fmt(m.titleAr)),
        h('div', 'model ' + (m.kind || ''), (m.kind === 'email' ? '<div class="m-hd" dir="ltr"><div><b>To:</b> ' + esc(m.to || '') + '</div><div><b>Subject:</b> ' + esc(m.subject || '') + '</div></div>' : '') +
          '<div class="m-en" dir="ltr">' + (m.bodyEn || []).map(p => '<p>' + esc(p) + '</p>').join('') + '</div>')
      ]);
      out.push(h('div', 'm-ar', (m.bodyAr || []).map(p => '<p>' + fmt(p) + '</p>').join('') + (m.noteAr ? '<p class="m-n"><b>ملاحظة:</b> ' + fmt(m.noteAr) + '</p>' : '')));
    });
    return out;
  };

  // ---- diagrams (simple HTML/CSS, English left-to-right) ----
  const flow = (items, hl, cap) => '<div class="flow" dir="ltr">' + items.map((it, i) =>
    '<div class="fn' + (i === hl ? ' hl' : '') + '"><b>' + esc(it[0]) + '</b><small>' + esc(it[1] || '') + '</small></div>' + (i < items.length - 1 ? '<div class="fa"></div>' : '')).join('') + '</div>' +
    (cap ? '<div class="dg-cap">' + fmt(cap) + '</div>' : '');
  const DG = {
    warehouseFlow: o => flow([['Receiving', 'الاستلام'], ['Putaway', 'التخزين'], ['Storage', 'المخزون'], ['Picking', 'التجهيز'], ['Packing', 'التعبئة'], ['Shipping', 'الشحن']], o.hl, 'رحلة الطلبية جوه المخزن. المرحلة الملوّنة هي موضوع درس النهارده.'),
    supplyChain: o => flow([['Supplier', 'المورّد'], ['Manufacturer', 'المصنع'], ['Distributor', 'الموزّع'], ['Warehouse', 'المخزن'], ['Retailer', 'تاجر التجزئة'], ['Customer', 'العميل']], o.hl, 'سلسلة الإمداد: البضاعة بتمشي من المورّد لحد العميل، والمعلومات بتمشي في الاتجاهين.'),
    d365Inbound: o => flow([['Purchase order', 'أمر شراء'], ['Inbound load', 'شحنة واردة'], ['Receive', 'استلام'], ['Put work', 'عمل التخزين'], ['On-hand', 'متاح في المخزون']], o.hl, 'مسار الاستلام في Dynamics 365.'),
    d365Outbound: o => flow([['Sales order', 'أمر بيع'], ['Wave', 'موجة'], ['Pick work', 'عمل التجهيز'], ['Pack', 'تعبئة'], ['Load', 'تحميل'], ['Ship', 'شحن']], o.hl, 'مسار الصادر في Dynamics 365.'),
    presentation: o => flow([['Opening', 'المقدمة'], ['Main points', 'النقاط الرئيسية'], ['Summary', 'الخلاصة'], ['Questions', 'الأسئلة']], o.hl, 'هيكل أي عرض تقديمي ناجح: افتتح، اشرح، لخّص، واسأل.'),
    locationCode: () => '<div class="loc" dir="ltr">' + [['A', 'Zone', 'المنطقة'], ['03', 'Aisle', 'الممر'], ['02', 'Level', 'الدور'], ['B', 'Bin', 'الخانة']].map((x, i) =>
      '<div class="lc"><b>' + x[0] + '</b><span>' + x[1] + '</span><small>' + x[2] + '</small></div>' + (i < 3 ? '<div class="dash">–</div>' : '')).join('') + '</div><div class="dg-cap">مثال: <span class="en">A-03-02-B</span> = Zone A · Aisle 03 · Level 02 · Bin B</div>',
    orgChart: () => '<div class="org" dir="ltr"><div class="on top">Operations Manager<small>مدير العمليات</small></div><div class="oline"></div><div class="on mid">Warehouse Supervisor<small>مشرف المخزن</small></div><div class="oline"></div><div class="orow">' +
      [['Receiving', 'الاستلام'], ['Picking', 'التجهيز'], ['Packing', 'التعبئة'], ['Shipping', 'الشحن']].map(x => '<div class="on sm">' + x[0] + '<small>' + x[1] + '</small></div>').join('') + '</div></div>',
    emailAnatomy: () => '<div class="eml" dir="ltr">' + [['Subject', 'Short and clear', 'عنوان قصير وواضح'], ['Greeting', 'Dear Mr. Brown,', 'التحية'], ['Opening', 'I am writing to ...', 'سبب الإيميل'], ['Body', 'What? When? How many?', 'التفاصيل'], ['Closing line', 'Please let me know.', 'الطلب أو الختام'], ['Sign-off', 'Best regards, Ahmed', 'التوقيع']].map(x =>
      '<div class="er"><b>' + x[0] + '</b><span>' + esc(x[1]) + '</span><small>' + x[2] + '</small></div>').join('') + '</div>',
    kpiCards: () => '<div class="kpis" dir="ltr">' + [['Order accuracy', 'correct orders ÷ total orders × 100', 'دقة الطلبات'], ['On-time delivery', 'on-time orders ÷ total orders × 100', 'التسليم في الميعاد'], ['Inventory accuracy', 'correct counts ÷ total counts × 100', 'دقة المخزون'], ['Throughput', 'orders shipped ÷ hours worked', 'معدل الإنجاز']].map(x =>
      '<div class="kc"><b>' + x[0] + '</b><span>' + x[1] + '</span><small>' + x[2] + '</small></div>').join('') + '</div>'
  };
  B.diagram = spec => (spec && DG[spec.name]) ? h('div', 'diagram', DG[spec.name](spec)) : null;

  // ---- quiz ----
  B.quizBlocks = L => {
    const Q = L.quiz, out = []; let n = 0;
    const part = (en, ar, pts) => h('div', 'qpart', '<b dir="ltr">' + en + '</b><span>' + ar + '</span><em>' + pts + '</em>');
    const sec = (head, items) => { out.push([head, items[0]]); items.slice(1).forEach(i => out.push(i)); };
    const qi = inner => h('div', 'qi', '<span class="xn">' + (++n) + '</span><div class="qb">' + inner + '</div>');
    out.push(h('div', 'qhead',
      '<div class="qh-t"><span class="qh-badge">QUIZ</span><b dir="ltr">Lesson ' + L.id + ' — ' + esc(L.titleEn) + '</b></div>' +
      '<div class="qh-f"><span>الاسم: <i class="fl"></i></span><span>التاريخ: <i class="fl s"></i></span><span>الدرجة: <i class="fl xs"></i> / 20</span></div>' +
      '<div class="qh-n">درجة النجاح <span class="en">80%</span> (يعني <span class="en">16</span> من <span class="en">20</span>). اكتب إجاباتك في الأماكن الفاضية من غير ما تبص على الدرس. الإجابات النموذجية في آخر الكتاب.</div>'));
    sec(part('Part 1 · Multiple choice', 'اختار الإجابة الصح', '5 × 1'), Q.mcq.map(q => qi('<div class="qq" dir="auto">' + esc(q.q) + '</div><div class="qopts" dir="ltr">' + q.options.map((o, k) => '<span class="qo" dir="auto"><b>' + L4[k] + '</b>' + esc(o) + '</span>').join('') + '</div>')));
    sec(part('Part 2 · Complete the sentences', 'كمّل الجمل', '5 × 1'), Q.fill.map(q => qi('<div class="qq" dir="ltr">' + qline(q.q) + '</div>')));
    sec(part('Part 3 · Translation', 'ترجمة', '5 × 1'), Q.trans.map(q => qi('<div class="tag">' + (q.dir === 'en2ar' ? 'English → عربي' : 'عربي → English') + '</div><div class="qq" dir="auto">' + esc(q.q) + '</div><div class="wline"></div>')));
    sec(part('Part 4 · Make sentences / Conversation', 'كوّن جمل وردود', '5 × 1'), Q.build.map(q => {
      if (q.type === 'order') return qi('<div class="tag">Put in order</div><div class="chips" dir="ltr">' + q.q.split(/\s*\/\s*/).map(w => '<span class="chip">' + esc(w) + '</span>').join('') + '</div><div class="wline"></div>');
      if (q.type === 'write') return qi('<div class="tag">اكتب بالإنجليزي</div><div class="qq" dir="auto">' + fmt(q.q) + '</div><div class="wline"></div><div class="wline"></div>');
      return qi('<div class="tag">Reply</div><div class="qq" dir="auto">' + esc(q.q) + '</div><div class="wline"></div>');
    }));
    out.push(h('div', 'qscore', '<span>الدرجة النهائية: <i class="fl xs"></i> / 20 = <i class="fl xs"></i> %</span><span><span class="cb"></span> اجتاز (16+)</span><span><span class="cb"></span> محتاج مراجعة وإعادة</span>'));
    return out;
  };

  // ---- answer key (one block per lesson) ----
  B.answerBlock = L => {
    const Q = L.quiz;
    const it = (i, t) => '<div class="ai" dir="auto"><b>' + i + '</b>' + t + '</div>';
    const sect = (title, items) => '<div class="as"><div class="as-t">' + title + '</div>' + items.join('') + '</div>';
    const parts = [
      sect('Ex. A · Order', L.exBuild.map((x, i) => it(i + 1, fmt(x.answer)))),
      sect('Ex. B · Complete', L.exComplete.map((x, i) => it(i + 1, fmt(x.answer)))),
      sect('Ex. C · Write (model)', L.exWrite.map((x, i) => it(i + 1, fmt(x.model)))),
      sect('Ex. D · Translate', L.exTranslate.map((x, i) => it(i + 1, fmt(x.en)))),
      sect('Ex. E · Speak (model)', L.speak.map((x, i) => it(i + 1, fmt(x.model)))),
      sect('Quiz · Part 1 (MCQ)', Q.mcq.map((x, i) => it(i + 1, '<u>' + L4[x.answer] + '</u> ' + fmt(x.options[x.answer])))),
      sect('Quiz · Part 2 (Fill)', Q.fill.map((x, i) => it(i + 6, fmt(x.answer) + (x.alt && x.alt.length ? ' <i>(' + fmt(x.alt.join(' / ')) + ')</i>' : '')))),
      sect('Quiz · Part 3 (Translation)', Q.trans.map((x, i) => it(i + 11, fmt(x.answer)))),
      sect('Quiz · Part 4 (Sentences)', Q.build.map((x, i) => it(i + 16, fmt(x.answer))))
    ];
    return h('div', 'ans', '<div class="ans-h"><span class="ans-no">' + L.id + '</span><b dir="ltr">' + esc(L.titleEn) + '</b></div><div class="ans-g">' + parts.join('') + '</div>');
  };
})(window);
