/* Warehouse English — view builders (each returns an HTML string) */
(function (W) {
  'use strict';
  const { esc, fmt, pr } = W.BK;
  const META = W.BOOK_META, LESSONS = W.LESSONS, VIDEOS = W.VIDEOS || {};
  const TTS = W.TTS, Store = W.Store;
  const V = (W.V = {});
  const N = 30;
  const pad = n => String(n).padStart(2, '0');

  /* icons (24×24, stroke style; .fl = filled parts) */
  const I = {
    home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>',
    list: '<svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13"/><circle class="fl" cx="4" cy="6" r="1.2"/><circle class="fl" cx="4" cy="12" r="1.2"/><circle class="fl" cx="4" cy="18" r="1.2"/></svg>',
    vol: '<svg viewBox="0 0 24 24"><path class="fl" d="M11 5L6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a9 9 0 0 1 0 14"/></svg>',
    turtle: '<svg viewBox="0 0 24 24"><path class="fl" d="M3 15a8 7 0 0 1 16 0z"/><circle class="fl" cx="20.5" cy="12.5" r="2.2"/><rect class="fl" x="5" y="15" width="3" height="3.5" rx="1"/><rect class="fl" x="13" y="15" width="3" height="3.5" rx="1"/></svg>',
    flag: '<svg viewBox="0 0 24 24"><path d="M5 22V4"/><path d="M5 4h13l-2.5 4.5L18 13H5"/></svg>',
    right: '<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>',
    left: '<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path class="fl" d="M7 4l13 8-13 8z"/></svg>',
    stop: '<svg viewBox="0 0 24 24"><rect class="fl" x="6" y="6" width="12" height="12" rx="2"/></svg>',
    copy: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
    ext: '<svg viewBox="0 0 24 24"><path d="M14 3h7v7M21 3l-9 9"/><path d="M19 14v6H4V5h6"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
    mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
    chart: '<svg viewBox="0 0 24 24"><path d="M5 21V11M12 21V4M19 21v-7"/></svg>',
    cards: '<svg viewBox="0 0 24 24"><rect x="3" y="8" width="14" height="12" rx="2"/><path d="M7 8V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/></svg>',
    roleic: '<svg viewBox="0 0 24 24"><path d="M4 5h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><path d="M20 9a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2v2l-3-2"/></svg>'
  };
  V.icons = I;

  /* ---------- small builders ---------- */
  const dataAttrs = (text, o) => ' data-say="' + esc(text) + '"' + (o && o.who ? ' data-who="' + esc(o.who) + '"' : '') + (o && o.as ? ' data-as="' + esc(o.as) + '"' : '');
  const spk = (text, o) => '<button type="button" class="spk' + (o && o.sm ? ' sm' : '') + '"' + dataAttrs(text, o) + ' aria-label="استمع">' + I.vol + '</button>';
  const slow = (text, o) => '<button type="button" class="spk slow' + (o && o.sm ? ' sm' : '') + '"' + dataAttrs(text, o) + ' data-slow="1" aria-label="استمع ببطء">' + I.turtle + '</button>';
  const flag = text => '<button type="button" class="flg' + (Store.isFlagged(text) ? ' on' : '') + '" data-flag="' + esc(text) + '" aria-label="النطق غلط؟ علّم">' + I.flag + '</button>';
  // microphone button ("say it yourself"): drawn only where the browser can recognise speech
  const mic = (text, o) => (W.Mic && W.Mic.supported
    ? '<button type="button" class="spk mic' + (o && o.sm ? ' sm' : '') + '" data-mic="' + esc(text) + '"' + (o && o.who ? ' data-who="' + esc(o.who) + '"' : '') + ' aria-label="قولها بصوتك">' + I.mic + '</button>' : '');
  const acts = (text, o) => '<span class="acts">' + spk(text, o) + slow(text, o) + (o && o.mic ? mic(text, o) : '') + (o && o.flag ? flag(text) : '') + '</span>';
  const role = name => { const c = (META.cast || []).find(x => x[0] === name); return c ? c[1] : ''; };
  const week = n => (META.weeks.find(w => w.lessons.indexOf(n) >= 0) || META.weeks[0]).n;
  V.week = week;

  // two-step button: first tap arms it (red, "tap again"), second tap within 7 s confirms
  const twice = btn => {
    if (btn.dataset.armed === '1') { delete btn.dataset.armed; return true; }
    const html = btn.innerHTML, cls = btn.className;
    btn.dataset.armed = '1';
    btn.innerHTML = esc(btn.dataset.ask || 'اضغط تاني للتأكيد');
    btn.classList.add('danger');
    setTimeout(() => { if (btn.isConnected && btn.dataset.armed === '1') { delete btn.dataset.armed; btn.innerHTML = html; btn.className = cls; } }, 7000);
    return false;
  };
  const AR_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const fdate = t => { const d = new Date(t); return isNaN(d) ? '' : d.getDate() + ' ' + AR_MONTHS[d.getMonth()]; };
  V.util = { spk, slow, acts, flag, twice, fdate, mic };
  V.pill = st => '<span class="pill st-' + st + '">' + esc(W.Grade.STATUS[st]) + '</span>';

  /* ---------- voice status (home + voice screens) ---------- */
  V.voiceStatus = function () {
    if (!TTS.supported) return '<a class="vstat bad" href="#voice"><span class="dot"></span><span class="grow"><b>المتصفح ده مش بيدعم النطق</b><br><span class="small">جرّب Chrome على أندرويد — اضغط للتفاصيل</span></span></a>';
    const cur = TTS.current();
    if (!cur) return '<a class="vstat bad" href="#voice"><span class="dot"></span><span class="grow"><b>مفيش صوت إنجليزي على جهازك</b><br><span class="small">اضغط هنا علشان تعرف تحلّها</span></span></a>';
    return '<a class="vstat" href="#voice"><span class="dot"></span><span class="grow"><b>الصوت جاهز</b> <span class="muted small en">' + esc(cur.name) + '</span><br><span class="small">اضغط لتجربة الصوت وضبط السرعة</span></span></a>';
  };

  /* ---------- home ---------- */
  const badge = st => st === 'passed' ? '<span class="tdone" title="اجتاز">' + I.check + '</span>'
    : st === 'review' ? '<span class="tdone review" title="يحتاج مراجعة">!</span>'
    : st === 'studying' ? '<span class="tdone studying" title="قيد الدراسة"></span>' : '';
  V.home = function () {
    const last = Store.last();
    const next = last ? last.lesson : 1;
    const nl = LESSONS[next];
    const S = Store.stats();
    let h = '<section class="hero"><div class="k">NILE LOGISTICS · 30 DAYS · A1 → B1</div><h1>' + esc(META.titleAr) + '</h1><p>' + esc(META.subAr) + '</p><div class="barcode" aria-hidden="true"></div></section>';
    h += '<a class="cont" href="#lesson-' + next + (last ? '-' + last.tab : '') + '">' + I.play +
      '<span class="t"><b>' + (last ? 'كمّل من حيث وقفت' : 'ابدأ من الدرس الأول') + '</b><small>الدرس ' + next + ' · ' + esc(nl.titleAr) + '</small></span>' + I.left + '</a>';
    h += '<a class="pstrip" href="#progress"><span class="pi">' + I.chart + '</span><span class="grow"><b>اجتزت ' + S.c.passed + ' من ' + N + ' درس</b>' +
      '<small>' + (S.avg != null ? 'متوسط درجاتك ' + S.avg.toFixed(1) + ' من 20' : 'ادخل أول اختبار علشان يتسجّل تقدمك') + (S.c.review ? ' · ' + S.c.review + ' محتاج مراجعة' : '') + '</small>' +
      '<span class="bar"><i style="width:' + Math.round(S.c.passed / N * 100) + '%"></i></span></span>' + I.left + '</a>';
    if (V.cardsStrip) h += V.cardsStrip();
    h += '<div data-install>' + (W.PWA ? W.PWA.slotHTML() : '') + '</div>';
    h += '<div data-voice-status>' + V.voiceStatus() + '</div>';
    META.weeks.forEach(w => {
      h += '<section class="stack" style="--wk:var(--wk' + w.n + ')"><div class="wkh"><span class="wn">' + w.n + '</span><div><b>الأسبوع ' + w.n + ': ' + esc(w.titleAr) + '</b><small class="en">' + esc(w.titleEn) + '</small></div></div><div class="tiles">';
      w.lessons.forEach(n => {
        const L = LESSONS[n];
        h += '<a class="tile" href="#lesson-' + n + '"><span class="tn"><small>DAY</small>' + pad(n) + '</span><span class="tt"><span class="enr">' + esc(L.titleEn) + '</span><small>' + esc(L.titleAr) + '</small></span>' +
          badge(Store.status(n)) + '</a>';
      });
      h += '</div></section>';
    });
    return h;
  };

  /* ---------- lesson ---------- */
  const TABS = [['over', 'نظرة'], ['words', 'الكلمات'], ['grammar', 'القاعدة'], ['sent', 'الجمل'], ['talk', 'المحادثة'], ['role', 'تمثيل'], ['prac', 'التمارين'], ['video', 'الفيديو'], ['quiz', 'الاختبار']];
  V.TABS = TABS;

  const exRow = e => '<div class="exr"><div class="t"><span class="enl">' + esc(e.en) + '</span><span class="a">' + fmt(e.ar) + '</span></div>' + acts(e.en, { sm: true }) + '</div>';

  const PANES = {
    over(n, L) {
      let h = '<div class="card stack"><h2 class="sec">هدف الدرس</h2><p>' + fmt(L.goalAr) + '</p><p class="muted">' + fmt(L.whyAr) + '</p></div>';
      h += '<div class="card stack"><h2 class="sec">بعد الدرس ده هتقدر…</h2><ul class="cando">' + L.canDo.map(c => '<li>' + fmt(c) + '</li>').join('') + '</ul></div>';
      h += '<div class="card stack"><h2 class="sec">خطة اليوم (40 دقيقة تقريباً)</h2><div class="chips">' + (META.plan || []).map(p => '<span class="chip">' + esc(p.ar) + ' · ' + p.min + ' د</span>').join('') + '</div></div>';
      h += '<a class="btn pri block" href="#lesson-' + n + '-words">ابدأ بالكلمات ' + I.left + '</a>';
      return h;
    },
    words(n, L) {
      let h = '<div class="toolbar"><button type="button" class="btn pri" data-playall>' + I.play + '<span>شغّل كل الكلمات</span></button>' +
        '<a class="btn" href="#cards-lesson-' + n + '">' + I.cards + '<span>بطاقات الدرس</span></a></div>';
      h += L.vocab.map(v =>
        '<article class="vcard" data-seq data-st="' + esc(v.en) + '"><div class="vtop"><div class="vword"><span class="enr w">' + esc(v.en) + '</span><span class="pos">' + esc(v.pos) + '</span></div>' + acts(v.en, { flag: true, mic: true }) + '</div>' +
        '<div class="vpron">' + pr(v.pron) + '</div><div class="vmean">' + fmt(v.ar) + '</div>' +
        '<div class="vex"><span class="enl">' + esc(v.ex) + '</span>' + spk(v.ex, { sm: true }) + slow(v.ex, { sm: true }) + '</div></article>').join('');
      return h;
    },
    grammar(n, L) {
      const g = L.grammar;
      let h = '<div class="card stack"><div><h2 class="sec">' + esc(g.titleAr) + '</h2><span class="enr muted small">' + esc(g.titleEn) + '</span></div><p class="gint">' + fmt(g.introAr) + '</p></div>';
      g.points.forEach(p => {
        h += '<div class="card gpt"><h3>' + fmt(p.headAr) + '</h3><p>' + fmt(p.textAr) + '</p><div class="exl">' + p.examples.map(exRow).join('') + '</div></div>';
      });
      if (g.table && g.table.rows) {
        h += '<div class="stack"><h2 class="sec">جدول سريع</h2><div class="tw"><table class="gtab"><thead><tr>' + g.table.headers.map(x => '<th>' + esc(x) + '</th>').join('') + '</tr></thead><tbody>' +
          g.table.rows.map(r => '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div></div>';
      }
      if (g.mistakes && g.mistakes.length) {
        h += '<div class="card stack"><h2 class="sec">أخطاء شائعة</h2>' + g.mistakes.map(m =>
          '<div class="mis"><div class="w"><span class="tag">✕</span><span class="enl">' + esc(m.wrong) + '</span></div><div class="r"><span class="tag">✓</span><span class="enl">' + esc(m.right) + '</span>' + acts(m.right, { sm: true }) + '</div><div class="nt">' + fmt(m.noteAr) + '</div></div>').join('') + '</div>';
      }
      if (g.tipAr) h += '<div class="note"><b>نصيحة للكلام:</b> ' + fmt(g.tipAr) + '</div>';
      return h;
    },
    sent(n, L) {
      let h = '<div class="toolbar"><button type="button" class="btn pri" data-playall>' + I.play + '<span>شغّل كل الجمل</span></button>' +
        '<label class="sw"><input type="checkbox" data-toggle-ar' + (Store.settings().showAr ? ' checked' : '') + '> إظهار الترجمة</label></div>';
      h += L.sentences.map((s, i) =>
        '<div class="srow" data-seq data-st="' + esc(s.en) + '"><div class="t"><span class="enl">' + esc(s.en) + '</span><span class="a">' + fmt(s.ar) + '</span></div>' + acts(s.en, { sm: true, flag: true, mic: true }) + '</div>').join('');
      return h;
    },
    talk(n, L) {
      const d = L.dialogue;
      let h = '<div class="scene"><b class="en">' + esc(d.titleEn) + '</b><br>' + fmt(d.sceneAr) + '</div>';
      h += '<div class="toolbar"><button type="button" class="btn pri" data-playall>' + I.play + '<span>شغّل المحادثة</span></button>' +
        '<label class="sw"><input type="checkbox" data-seq-slow> بطيء</label>' +
        '<label class="sw"><input type="checkbox" data-toggle-ar' + (Store.settings().showAr ? ' checked' : '') + '> الترجمة</label></div>';
      h += '<div class="dlg">' + d.lines.map(l => {
        const me = l.who === 'Ahmed', r = role(l.who);
        return '<div class="bub ' + (me ? 'me' : 'them') + '" data-seq data-st="' + esc(l.en) + '" data-sw="' + esc(l.who) + '"><div class="who"><span class="en">' + esc(l.who) + '</span>' + (r ? '<small class="en">' + esc(r) + '</small>' : '') + '</div>' +
          '<span class="enl">' + esc(l.en) + '</span><span class="a">' + fmt(l.ar) + '</span><div class="bact">' + acts(l.en, { sm: true, who: l.who }) + '</div></div>';
      }).join('') + '</div>';
      return h;
    },
    role(n, L) { return W.Roleplay.pane(n); },
    prac(n, L) { return W.Practice.prac(n); },
    video(n, L) {
      const v = VIDEOS[n];
      if (!v) return '<div class="soon">مفيش فيديو للدرس ده.</div>';
      let h = '<div class="card stack vid"><div class="muted small en">' + esc(v.platform) + ' · ' + esc(v.channel) + ' · ' + esc(v.level) + '</div><div class="tl">' + esc(v.title) + '</div><p>' + fmt(v.whyAr) + '</p>' +
        '<a class="btn pri block" href="' + esc(v.url) + '" target="_blank" rel="noopener noreferrer">' + I.ext + ' افتح الفيديو</a></div>';
      if (L.listenAr) h += '<div class="note"><b>أثناء المشاهدة:</b> ' + fmt(L.listenAr) + '</div>';
      if (v.backup && v.backup.url) h += '<div class="card stack"><div class="muted small">فيديو بديل</div><a class="en" style="font-weight:700" href="' + esc(v.backup.url) + '" target="_blank" rel="noopener noreferrer">' + esc(v.backup.title) + '</a><span class="muted small en">' + esc(v.backup.channel || '') + '</span></div>';
      return h;
    },
    quiz(n, L) { return W.Practice.quiz(n); }
  };
  V.pane = (n, tab) => (PANES[tab] && LESSONS[n] ? PANES[tab](n, LESSONS[n]) : '');

  // status pill + last score in the lesson header (refreshed in place after a quiz is submitted / re-marked)
  const lstHTML = n => { const att = Store.attempts(n), la = att[att.length - 1]; return V.pill(Store.status(n)) + (la ? '<span class="en lsc">' + la.s + '/' + (la.tot || 20) + '</span>' : ''); };
  V.refreshHead = n => { const el = document.querySelector('.lhead .lst'); if (el) el.innerHTML = lstHTML(n); };

  V.lesson = function (n, tab) {
    const L = LESSONS[n];
    if (!L) return null;
    if (!PANES[tab]) tab = 'over';
    const wk = week(n);
    let h = '<div class="stack lesson" style="--wk:var(--wk' + wk + ')">';
    h += '<div class="lhead"><div class="k">WEEK ' + wk + ' · DAY ' + pad(n) + '</div><h1>' + esc(L.titleEn) + '</h1><div class="a">' + esc(L.titleAr) + '</div>' +
      '<div class="lst">' + lstHTML(n) + '</div></div>';
    h += '<nav class="tabs" aria-label="أقسام الدرس">' + TABS.map(t => '<a class="tab" href="#lesson-' + n + '-' + t[0] + '"' + (t[0] === tab ? ' aria-current="page"' : '') + '>' + t[1] + '</a>').join('') + '</nav>';
    h += '<div class="stack pane" data-tab="' + tab + '">' + PANES[tab](n, L) + '</div>';
    h += '<div class="pgr">' + (n > 1 ? '<a class="btn" href="#lesson-' + (n - 1) + '-' + tab + '">' + I.right + ' الدرس السابق</a>' : '') + (n < N ? '<a class="btn" href="#lesson-' + (n + 1) + '-' + tab + '">الدرس التالي ' + I.left + '</a>' : '') + '</div></div>';
    return { html: h, tab, title: 'الدرس ' + n, sub: L.titleEn };
  };

  /* ---------- glossary ---------- */
  V.glossary = function () {
    const all = [];
    for (let n = 1; n <= N; n++) if (LESSONS[n]) LESSONS[n].vocab.forEach(v => all.push(Object.assign({ n }, v)));
    all.sort((a, b) => a.en.toLowerCase().localeCompare(b.en.toLowerCase()));
    let h = '<div class="search">' + I.search + '<input id="q" type="search" placeholder="ابحث بالإنجليزي أو العربي…" autocomplete="off" aria-label="بحث"></div>';
    h += '<div class="muted small" id="gcount">' + all.length + ' كلمة</div>';
    h += all.map(v => '<article class="vcard" data-q="' + esc((v.en + ' ' + v.ar).toLowerCase()) + '"><div class="vtop"><div class="vword"><span class="enr w">' + esc(v.en) + '</span><span class="pos">' + esc(v.pos) + '</span><span class="vlsn">L' + v.n + '</span></div>' + acts(v.en, { flag: true }) + '</div>' +
      '<div class="vpron">' + pr(v.pron) + '</div><div class="vmean">' + fmt(v.ar) + '</div></article>').join('');
    return h;
  };

  /* ---------- voice screen ---------- */
  const tr = (text, o) => {
    o = o || {};
    const sp = o.as || TTS.spoken(text);
    return '<div class="ti"><div class="t"><span class="enl">' + esc(text) + '</span>' + (sp && sp !== text ? '<span class="sp">→ ' + esc(sp) + '</span>' : '') + '</div>' + acts(text, { sm: true, flag: true, who: o.who, as: o.as }) + '</div>';
  };
  const LS = (n, i) => (LESSONS[n] && LESSONS[n].sentences[i] ? LESSONS[n].sentences[i].en : 'Hello, welcome to the warehouse.');
  const ALPHA = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z';
  const groups = () => [
    { t: 'أصوات مش موجودة في العربي: P, V, TH, CH, J', open: true, items: ['pallet', 'van', 'very', 'vehicle', 'think', 'this', 'three', 'ship', 'chip', 'job', 'manager', 'shipping', 'decision', 'check'].map(x => [x]) },
    { t: 'كلمات متشابهة (اسمع الفرق)', items: ['bat, pat', 'van, fan', 'ship, chip', 'think, sink', 'live, leave', 'full, fool', 'cut, cat'].map(x => [x]) },
    { t: 'اختصارات الشغل', items: ['PO', 'SKU', 'WMS', 'KPI', 'ETA', 'FIFO', 'ASAP', 'ERP', 'FYI', 'cc', 'B/L', '3PL', 'ID', 'OK'].map(x => [x]) },
    { t: 'أرقام وأكواد', items: ['365', 'Dynamics 365', '1,500 cartons', '95%', '20 kg', '9:30 AM', 'Location A-03-02-B', 'PO 4500123', 'SKU-1042', '16-20'].map(x => [x]) },
    { t: 'أسماء الشخصيات', items: ['Ahmed', 'Mona', 'Omar', 'Sara', 'Khaled', 'Hassan', 'Laura', 'Youssef', 'Mr. Brown', 'Peter', 'Nile Logistics'].map(x => [x]) },
    { t: 'أصوات الشخصيات (رجال وستات)', items: [['Good morning. The truck is at the dock.', { who: 'Omar' }], ['Please check the delivery note.', { who: 'Mona' }], ['Yes, I will check it now.', { who: 'Ahmed' }], ['We have a stock mismatch in zone B.', { who: 'Sara' }]] },
    { t: 'جمل كاملة من الكتاب', items: [[LS(1, 3)], [LS(7, 2)], [LS(14, 4)], [LS(20, 1)]] },
    { t: 'حروف الأبجدية', items: [[ALPHA, { as: Object.keys(TTS.LETTERS).map(k => TTS.LETTERS[k]).join(', ') }]] }
  ];

  V.voice = function () {
    const st = TTS.state, cur = TTS.current(), list = TTS.enVoices();
    let h = '';
    if (!TTS.supported) {
      h += '<div class="warnbox"><b>المتصفح ده مش بيدعم النطق.</b><br>افتح الصفحة من Chrome على أندرويد (أو Edge على الكمبيوتر).</div>';
    } else if (!list.length) {
      h += '<div class="warnbox"><b>مفيش صوت إنجليزي ظاهر على الجهاز.</b><br>من إعدادات الموبايل دوّر على «تحويل النص إلى كلام» (Text-to-speech)، وتأكد إن محرك <span class="en">Google</span> متثبّت وحمّل صوت <span class="en">English (US)</span>. بعدها ارجع واضغط تحديث.<br><br><button type="button" class="btn sm" data-act="reload">تحديث قائمة الأصوات</button></div>';
    } else {
      h += '<div class="okbox"><b>الصوت شغّال.</b> الصوت الحالي: <span class="en">' + esc(cur.name) + ' (' + esc(cur.lang) + ')</span>' + (cur.localService ? '' : ' — <span class="small">أونلاين</span>') + '</div>';
    }
    h += '<div class="card stack"><h2 class="sec">جرّب الآن</h2><div class="row"><div class="grow enl" style="font-weight:700;font-size:1.05rem">Hello, welcome to the Nile Logistics warehouse.</div>' + acts('Hello, welcome to the Nile Logistics warehouse.', {}) + '</div></div>';

    h += '<div class="card stack"><h2 class="sec">الصوت والسرعة</h2><label class="small muted" for="voiceSel">اختار الصوت</label><select class="sel" id="voiceSel">';
    h += '<option value="auto"' + (st.voiceURI === 'auto' ? ' selected' : '') + '>تلقائي — الأفضل' + (TTS.best() ? ' (' + esc(TTS.best().name) + ')' : '') + '</option>';
    list.forEach(v => { h += '<option value="' + esc(v.voiceURI) + '"' + (st.voiceURI === v.voiceURI ? ' selected' : '') + '>' + esc(v.name) + ' · ' + esc(v.lang) + (v.localService ? '' : ' · أونلاين') + '</option>'; });
    h += '</select>';
    h += '<label class="small muted" for="rateNormal">السرعة العادية</label><div class="rng"><input id="rateNormal" type="range" min="0.5" max="1.3" step="0.05" value="' + st.rate + '" data-rate="rate"><output>' + (+st.rate).toFixed(2) + '×</output></div>';
    h += '<label class="small muted" for="rateSlow">سرعة الزر البطيء</label><div class="rng"><input id="rateSlow" type="range" min="0.3" max="0.9" step="0.05" value="' + st.slow + '" data-rate="slow"><output>' + (+st.slow).toFixed(2) + '×</output></div></div>';

    h += '<h2 class="sec">اسمع وقيّم</h2><p class="muted small" style="margin-top:-6px">اضغط السماعة، ولو النطق غلط اضغط العلم. السطر الرمادي تحت الكلمة هو الشكل اللي بيتقرا بيه.</p>';
    groups().forEach(g => {
      h += '<details class="tg"' + (g.open ? ' open' : '') + '><summary>' + fmt(g.t) + '</summary><div class="body">' + g.items.map(it => tr(it[0], it[1])).join('') + '</div></details>';
    });

    const words = Store.words(), wk = Object.keys(words);
    h += '<div class="card stack"><h2 class="sec">صحّح نطق كلمة بنفسك</h2><p class="muted small">اكتب الكلمة، واكتب جنبها الشكل اللي يتنطق صح بحروف إنجليزي (مثال: <span class="en">Khaled → Kah-led</span>).</p>' +
      '<input class="inp" id="fixWord" placeholder="Word" autocapitalize="off" autocomplete="off" spellcheck="false"><input class="inp" id="fixSay" placeholder="How to say it (e.g. Kah-led)" autocapitalize="off" autocomplete="off" spellcheck="false">' +
      '<div class="row"><button type="button" class="btn pri sm" data-act="fixsave">حفظ وتجربة</button></div>' +
      (wk.length ? '<div>' + wk.map(k => '<div class="fl-item"><span class="enl">' + esc(k) + ' → ' + esc(words[k]) + '</span><button type="button" class="flg on" data-act="fixdel" data-word="' + esc(k) + '" aria-label="حذف">✕</button></div>').join('') + '</div>' : '') + '</div>';

    const fl = Store.flags();
    h += '<div class="card stack"><h2 class="sec">ملاحظاتك (' + fl.length + ')</h2>' +
      (fl.length ? '<div>' + fl.map(f => '<div class="fl-item"><span class="enl">' + esc(f.text) + '</span>' + spk(f.text, { sm: true }) + flag(f.text) + '</div>').join('') + '</div>' +
        '<div class="row"><button type="button" class="btn pri sm" data-act="copyflags">' + I.copy + ' نسخ القائمة</button><button type="button" class="btn sm" data-act="clearflags">مسح الكل</button></div>' +
        '<p class="muted small">انسخ القائمة وابعتها لي وأنا أظبط نطق الكلمات دي.</p>' : '<p class="muted small">لسه ما علّمتش أي كلمة. لما تسمع نطق غلط اضغط علم الكلمة.</p>') + '</div>';

    h += '<a class="btn block" href="#audit">كل الاختصارات والأرقام اللي في الكتاب</a>';
    if (W.PWA) h += W.PWA.helpHTML();
    h += '<details class="tg"><summary>تشخيص الصوت</summary><div class="body" style="padding:12px 16px"><div class="diag" id="diag">' + esc(V.diagText()) + '</div><div class="row" style="margin-top:8px"><button type="button" class="btn sm" data-act="reload">تحديث</button><button type="button" class="btn sm" data-act="resetall">مسح بيانات التطبيق</button><a class="btn sm" href="#selftest">فحص التمارين</a></div></div></details>';
    return h;
  };

  V.diagText = function () {
    const cur = TTS.current(), all = TTS.allVoices();
    const L = [
      'speechSynthesis: ' + (TTS.supported ? 'yes' : 'NO'),
      'voices: ' + all.length + ' total, ' + TTS.enVoices().length + ' English',
      'selected: ' + (cur ? cur.name + ' [' + cur.lang + '] ' + (cur.localService ? 'local' : 'network') + ' ' + (TTS.gender(cur) || '') : 'none'),
      'rate: ' + TTS.state.rate + '   slow: ' + TTS.state.slow,
      'online: ' + (W.navigator.onLine ? 'yes' : 'no') + '   storage: ' + (Store.persistent() ? 'ok' : 'memory only'),
      'mic: ' + (W.Mic && W.Mic.supported ? 'speech recognition available' : 'NO speech recognition') + '   app: ' + (W.PWA ? W.PWA.statusText() : 'n/a'),
      'agent: ' + String(W.navigator.userAgent).slice(0, 110),
      '— last events —'
    ].concat(TTS.log().slice(-12));
    return L.join('\n');
  };

  /* ---------- audit: every acronym / number / symbol that is spoken ---------- */
  function lessonTexts(n) {
    const L = LESSONS[n], out = [];
    const add = t => { if (t && /[A-Za-z0-9]/.test(t)) out.push(String(t)); };
    L.vocab.forEach(v => { add(v.en); add(v.ex); });
    L.grammar.points.forEach(p => p.examples.forEach(e => add(e.en)));
    (L.grammar.mistakes || []).forEach(m => add(m.right));
    L.sentences.forEach(s => add(s.en));
    L.dialogue.lines.forEach(l => add(l.en));
    L.exBuild.forEach(x => add(x.answer));
    L.exWrite.forEach(x => add(x.model));
    L.exTranslate.forEach(x => add(x.en));
    L.speak.forEach(x => { add(x.promptEn); add(x.model); });
    (L.models || []).forEach(m => { add(m.subject); (m.bodyEn || []).forEach(add); });
    return out;
  }
  const TOK = /\d{1,3}(?:,\d{3})+(?:\.\d+)?|[A-Za-z0-9][A-Za-z0-9.'’\-\/%&+:#@$]*[A-Za-z0-9%]|[A-Za-z0-9]/g;
  // a short slice of the sentence around the token (so the audit row stays small)
  function around(t, tok) {
    const i = t.indexOf(tok);
    if (t.length <= 110 || i < 0) return t.length <= 140 ? t : t.slice(0, 140);
    let a = Math.max(0, i - 50), b = Math.min(t.length, i + tok.length + 50);
    if (a > 0) { const s = t.indexOf(' ', a); if (s >= 0 && s < i) a = s + 1; }
    if (b < t.length) { const s = t.lastIndexOf(' ', b); if (s > i + tok.length) b = s; }
    return (a > 0 ? '... ' : '') + t.slice(a, b) + (b < t.length ? ' ...' : '');
  }
  V.auditScan = function () {
    const map = new Map();
    for (let n = 1; n <= N; n++) {
      if (!LESSONS[n]) continue;
      lessonTexts(n).forEach(t => {
        (t.match(TOK) || []).forEach(raw => {
          const tok = raw.replace(/[.:]+$/, '');
          let kind = '';
          if (/^[A-Z]{2,}s?$/.test(tok)) kind = 'caps';
          else if (/\d/.test(tok)) kind = 'num';
          else if (/[%&\/+#@$]/.test(tok) || /[A-Za-z]\.[A-Za-z]/.test(tok)) kind = 'sym';
          if (!kind) return;
          const e = map.get(tok) || { tok, kind, n: 0, ctx: t, lesson: n };
          e.n++; map.set(tok, e);
        });
      });
    }
    return Array.from(map.values());
  };
  V.audit = function () {
    const items = V.auditScan();
    const sections = [['caps', 'اختصارات بحروف كبيرة'], ['num', 'أرقام وأكواد'], ['sym', 'رموز وصيغ خاصة']];
    let h = '<div class="note">دي كل العناصر اللي بتحتاج قاعدة نطق خاصة في دروس الكتاب. اضغط السماعة تسمع الجملة اللي فيها العنصر. لو غلط، علّمه بالعلم.</div>';
    sections.forEach(s => {
      const list = items.filter(x => x.kind === s[0]).sort((a, b) => b.n - a.n || a.tok.localeCompare(b.tok));
      h += '<details class="tg"' + (s[0] === 'caps' ? ' open' : '') + '><summary>' + s[1] + ' (' + list.length + ')</summary><div class="body">' + list.map(x => {
        const win = around(x.ctx, x.tok), sp = TTS.spoken(win);
        return '<div class="aud-t"><span class="tok">' + esc(x.tok) + '</span><div class="t"><span class="cx">' + esc(win) + '  (L' + x.lesson + ')</span><span class="sp">→ ' + esc(sp) + '</span></div><span class="n">×' + x.n + '</span>' +
          '<span class="acts"><button type="button" class="spk sm" data-say="' + esc(win) + '" aria-label="استمع">' + I.vol + '</button>' + flag(x.tok) + '</span></div>';
      }).join('') + '</div></details>';
    });
    return h;
  };
})(window);
