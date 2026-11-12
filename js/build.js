/* Business English Book — assembly, TOC, toolbar, QA */
(function (W) {
  'use strict';
  const B = W.BK, M = W.BOOK_META, esc = B.esc, fmt = B.fmt, pr = B.pr, h = B.h;
  const $ = id => document.getElementById(id);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const cb = '<i class="cb"></i>';

  const coverSvg = () => `<svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
    <rect x="0" y="224" width="640" height="5" rx="2.5" fill="#fff" opacity=".35"/>
    <g stroke="#f59e0b" stroke-width="5" stroke-linecap="round" fill="none">
      <path d="M30 60V224M190 60V224M210 60V224M370 60V224"/>
      <path d="M30 105H190M30 150H190M30 195H190M210 105H370M210 150H370M210 195H370"/>
    </g>
    <rect x="42" y="73" width="38" height="32" rx="3" fill="#fbbf24"/><rect x="88" y="81" width="30" height="24" rx="3" fill="#34d399"/><rect x="126" y="70" width="48" height="35" rx="3" fill="#fff"/>
    <rect x="40" y="118" width="46" height="32" rx="3" fill="#60a5fa"/><rect x="96" y="124" width="36" height="26" rx="3" fill="#fbbf24"/><rect x="140" y="115" width="38" height="35" rx="3" fill="#f87171"/>
    <rect x="44" y="165" width="34" height="30" rx="3" fill="#fff"/><rect x="86" y="160" width="52" height="35" rx="3" fill="#34d399"/><rect x="146" y="168" width="32" height="27" rx="3" fill="#fbbf24"/>
    <rect x="222" y="76" width="44" height="29" rx="3" fill="#60a5fa"/><rect x="274" y="70" width="40" height="35" rx="3" fill="#fff"/><rect x="322" y="80" width="36" height="25" rx="3" fill="#f87171"/>
    <rect x="222" y="120" width="34" height="30" rx="3" fill="#fbbf24"/><rect x="264" y="116" width="50" height="34" rx="3" fill="#34d399"/><rect x="322" y="124" width="38" height="26" rx="3" fill="#fff"/>
    <rect x="226" y="163" width="48" height="32" rx="3" fill="#f87171"/><rect x="284" y="168" width="34" height="27" rx="3" fill="#60a5fa"/><rect x="326" y="160" width="34" height="35" rx="3" fill="#fbbf24"/>
    <rect x="392" y="196" width="26" height="28" rx="3" fill="#fbbf24"/>
    <rect x="426" y="108" width="132" height="104" rx="6" fill="#fff"/>
    <path d="M558 140H600L624 172V212H558Z" fill="#fbbf24"/><path d="M568 150H594L608 172H568Z" fill="#bfdbfe"/>
    <text x="492" y="164" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="17" fill="#0b2545">NILE</text>
    <text x="492" y="184" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="700" font-size="11" fill="#0d9488">LOGISTICS</text>
    <circle cx="466" cy="216" r="17" fill="#0b2545" stroke="#fff" stroke-width="4"/><circle cx="592" cy="216" r="17" fill="#0b2545" stroke="#fff" stroke-width="4"/>
  </svg>`;

  const cover = () => `<div class="cv">
    <div class="cv-top"><span class="cv-tag" dir="ltr">30-DAY PRACTICAL COURSE</span><span class="cv-tag">كورس عملي · 30 يوم</span></div>
    <div class="cv-mid" dir="ltr"><div class="cv-t1">Business English</div><div class="cv-t2">for Warehouse &amp; Supply Chain</div><div class="cv-sub">${esc(M.subEn)}</div></div>
    <div class="cv-ar">${fmt(M.titleAr)}</div><div class="cv-ar2">${fmt(M.subAr)}</div>
    <div class="cv-art">${coverSvg()}</div>
    <div class="cv-weeks">${M.weeks.map(w => `<div class="cv-w" style="--c:${w.color}"><b dir="ltr">Week ${w.n}</b><span dir="ltr">${esc(w.titleEn)}</span><small>${fmt(w.titleAr)}</small></div>`).join('')}</div>
    <div class="cv-foot" dir="ltr"><span>Speaking · Listening · Writing</span><span>30 Lessons · 30 Quizzes · Answer Key · Progress Tracker</span></div>
  </div>`;

  const ptitle = (en, ar) => h('div', 'ptitle', `<span class="pt-en" dir="ltr">${esc(en)}</span><span class="pt-ar">${fmt(ar)}</span>`);

  const weekDiv = (w, LS) => `<div class="wd"><div class="wd-n"><small>WEEK</small><b>${w.n}</b></div>
    <div class="wd-t" dir="ltr">${esc(w.titleEn)}</div><div class="wd-a">${fmt(w.titleAr)}</div>
    <div class="wd-d" dir="ltr">Days ${w.lessons[0]}–${w.lessons[w.lessons.length - 1]} · ${w.lessons.length} lessons</div>
    <p class="wd-i">${fmt(w.introAr)}</p>
    <div class="wd-l">${w.lessons.map(id => { const L = LS[id]; return `<div class="wd-li"><b>${id}</b><span dir="ltr">${L ? esc(L.titleEn) : 'Lesson ' + id}</span><em>${L ? fmt(L.titleAr) : ''}</em></div>`; }).join('')}</div>
    <div class="wd-o"><b>بنهاية الأسبوع هتقدر:</b><ul>${w.outcomes.map(o => `<li>${fmt(o)}</li>`).join('')}</ul></div></div>`;

  function validateLesson(L) {
    const e = [], c = (ok, m) => { if (!ok) e.push(m); }, arr = (a, f) => Array.isArray(a) && f(a.length);
    c(L && L.titleEn && L.titleAr && L.goalAr, 'title/goal');
    c(arr(L.vocab, n => n >= 10 && n <= 15), 'vocab count ' + (L.vocab && L.vocab.length));
    (L.vocab || []).forEach((v, i) => c(v.en && v.ar && v.pron && v.pos && v.ex, 'vocab#' + (i + 1) + ' incomplete'));
    c(L.grammar && L.grammar.introAr && arr(L.grammar.points, n => n >= 2) && L.grammar.table && arr(L.grammar.table.rows, n => n >= 3), 'grammar incomplete');
    c(arr(L.sentences, n => n === 10), 'sentences ' + (L.sentences && L.sentences.length));
    c(L.dialogue && arr(L.dialogue.lines, n => n >= 8 && n <= 14), 'dialogue lines');
    c(arr(L.exBuild, n => n === 5), 'exBuild'); c(arr(L.exComplete, n => n === 5), 'exComplete'); c(arr(L.exWrite, n => n === 5), 'exWrite');
    c(arr(L.exTranslate, n => n >= 5), 'exTranslate'); c(arr(L.speak, n => n === 3), 'speak');
    const Q = L.quiz || {};
    c(arr(Q.mcq, n => n === 5), 'mcq count');
    (Q.mcq || []).forEach((q, i) => c(Array.isArray(q.options) && q.options.length === 4 && q.answer >= 0 && q.answer <= 3, 'mcq#' + (i + 1)));
    c(arr(Q.fill, n => n === 5), 'fill'); c(arr(Q.trans, n => n === 5), 'trans'); c(arr(Q.build, n => n === 5), 'build');
    return e;
  }

  async function renderLesson(P, L, w, V) {
    const run = { runL: 'Day ' + L.id + ' · ' + L.titleEn, runR: 'الدرس ' + L.id + ' · ' + L.titleAr, wk: w.n };
    const O = x => Object.assign({ cls: 'lesson' }, run, x || {});
    const fresh = () => { if (P.body.children.length) P.newPage(); };
    let sn = 0;
    P.begin(O()); P.mark('L' + L.id);
    P.add(B.lessonHead(L, w, L.id)); P.add(B.goalBox(L)); P.add(B.canDo(L)); P.add(B.timeline(M.plan));
    const dg = B.diagram(M.diagrams[L.id]); if (dg) P.add(dg);
    const vs = B.vocabSpec(L);
    vs.pre = [B.sec(++sn, 'Vocabulary', 'الكلمات الجديدة'), h('div', 'note', 'اقرأ الكلمة، بصّ على النطق، وقولها بصوت عالي 3 مرات. المقطع العريض الملوّن هو اللي بنضغط عليه في النطق.')];
    await tick('L' + L.id + ' head ok'); P.table(vs);
    await tick('L' + L.id + ' vocab ok');
    const gb = B.grammarBlocks(L.grammar);
    gb[0] = [B.sec(++sn, 'Grammar', 'القاعدة بشكل مبسّط')].concat(gb[0]);
    P.addAll(gb);
    await tick('L' + L.id + ' grammar ok');
    const ss = B.sentSpec(L);
    ss.pre = [B.sec(++sn, 'Practical sentences', 'عشر جمل من الشغل — اقرأها بصوت عالي')];
    P.table(ss);
    await tick('L' + L.id + ' sentences ok');
    fresh();
    const dl = B.dialogueBlocks(L.dialogue);
    P.section(B.sec(++sn, 'Dialogue', 'محادثة واقعية'), dl);
    await tick('L' + L.id + ' dialogue ok');
    if (L.models && L.models.length) {
      fresh();
      const mb = B.modelBlocks(L.models);
      mb[0] = [B.sec(++sn, 'Model texts', 'نماذج جاهزة تقدر تقلّدها')].concat(mb[0]);
      P.addAll(mb);
    }
    fresh();
    const gs = B.exGroups(L);
    gs.forEach((g, i) => {
      let head = g.head;
      if (i === 0) { head = h('div', 'grp'); head.appendChild(B.sec(++sn, 'Exercises', 'التمارين — حلها بالقلم')); head.appendChild(g.head); }
      P.section(head, g.items);
    });
    await tick('L' + L.id + ' exercises ok');
    P.group([B.sec(++sn, 'Watch & listen', 'فيديو الدرس'), B.videoBox(V[L.id], L)]);
    await tick('L' + L.id + ' video ok');
    // quiz
    P.begin(O({ cls: 'quiz', runL: 'Quiz · Lesson ' + L.id, runR: 'اختبار الدرس ' + L.id }));
    P.mark('Q' + L.id);
    P.addAll(B.quizBlocks(L));
    // notes
    P.begin(O({ cls: 'notes', runL: 'Notes · Lesson ' + L.id, runR: 'ملاحظاتي · الدرس ' + L.id }));
    P.add(h('div', 'notesbox', `<div class="nt-h"><b dir="ltr">My Notes</b><span>مساحة لملاحظاتك — الدرس ${L.id}: <span class="en">${esc(L.titleEn)}</span></span></div>
      <div class="nt-g"><div>كلمات عايز أفتكرها</div><div>أخطائي</div><div>أسئلة للدرس الجاي</div></div><div class="lined"></div>`));
  }

  function checkNodes(w, LS) {
    return [
      ptitle('Week ' + w.n + ' Checkpoint', 'محطة المراجعة · الأسبوع ' + w.n),
      h('div', 'note', fmt('قبل ما تبدأ الأسبوع اللي بعده، علّم على كل جملة: أقدر أعملها بثقة، أو لسه محتاج أراجع.')),
      h('div', 'ckl', '<div class="ckh"><span>أقدر</span><span>أراجع</span></div>' + w.outcomes.map(o => `<div class="ckr">${cb}${cb}<div>${fmt(o)}</div></div>`).join('')),
      h('div', 'chal', `<div class="chal-t">تحدّي التحدث · <span class="en">Speaking challenge</span></div><p>${fmt(w.challengeAr)}</p><div class="chal-s">سجّلت صوتي: ${cb} عملت التحدي: ${cb}</div>`),
      h('div', 'wkscore', '<div class="ln-t">نتايج اختبارات الأسبوع</div><table class="tbl"><thead><tr><th>#</th><th>الدرس</th><th>الدرجة / 20</th><th>اجتاز؟</th></tr></thead><tbody>' +
        w.lessons.map(id => { const L = LS[id]; return `<tr><td class="c-n">${id}</td><td dir="ltr" class="c-en">${L ? esc(L.titleEn) : ''}</td><td></td><td>${cb}</td></tr>`; }).join('') + '</tbody></table>'),
      h('div', 'lines3', '<div class="ln-t">كلمات لسه بنساها</div><div class="wline"></div><div class="wline"></div>'),
      h('div', 'lines3', '<div class="ln-t">هدفي للأسبوع الجاي</div><div class="wline"></div><div class="wline"></div>')
    ];
  }

  const yieldNow = () => new Promise(r => { const c = new MessageChannel(); c.port1.onmessage = () => { c.port1.close(); r(); }; c.port2.postMessage(0); });
  const tick = async m => {
    $('status').textContent = m;
    if (!DBG.on && /built|done/.test(m)) { try { history.replaceState(null, '', '#' + String(m).replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48)); } catch (e) { /* ignore */ } }
    await yieldNow();
  };
  const parseQA = () => {
    const m = /^#qa-([A-Za-z0-9-]+)/.exec(location.hash || '');
    if (!m) return { on: false };
    const o = { on: true, only: [], front: false, back: false, wd: false, zoom: 0.75 };
    m[1].split('-').forEach(t => {
      if (/^\d+$/.test(t)) o.only.push(+t); else if (t === 'front') o.front = true; else if (t === 'back') o.back = true;
      else if (t === 'wd') o.wd = true; else if (t === 'sheet') o.sheet = true; else if (t === 'toc') o.toc = true; else if (t === 'nol') o.nol = true; else if (t === 'p1') o.p1 = true; else if (t === 'all') o.all = true; else if (/^k\d+$/.test(t)) { (o.keep = o.keep || []).push(+t.slice(1)); } else if (/^z\d+$/.test(t)) { o.zoom = +t.slice(1) / 100; o.zset = true; }
    });
    if (o.sheet && !o.zset) o.zoom = 0.44;
    if (o.all) { o.front = o.back = o.wd = o.toc = true; o.only = Array.from({ length: 30 }, (_, i) => i + 1); }
    return o;
  };
  let DBG = { on: false };
  async function build() {
    const root = $('book'); root.innerHTML = ''; root.style.zoom = '';
    const P = new B.Pager(root), LS = W.LESSONS || {}, V = W.VIDEOS || {};
    const qa = { missing: [], bad: [], render: [] };
    const A = P.anchors, pg = () => P.pages.length;

    let tocPages = [];
    if (!DBG.on || DBG.front) {
    // cover
    P.begin({ cls: 'cover', bare: true }); P.body.innerHTML = cover();
    // TOC (reserved right after the cover, filled at the end)
    tocPages = [P.begin({ cls: 'toc', runL: 'Contents', runR: 'فهرس المحتويات' })]; A.toc = pg();
    tocPages.push(P.newPage());
    // welcome
    P.begin({ cls: 'front', runL: 'Welcome', runR: 'أهلاً بيك' }); A.welcome = pg();
    P.add(ptitle('Welcome', 'أهلاً بيك في الكورس'));
    P.add(h('p', 'lead', fmt('الكتاب ده معمول مخصوص لموظف شغال في المخازن وسلاسل الإمداد وعايز يتكلم إنجليزي بثقة في الشغل — في الاجتماعات، والإيميلات، ومع المديرين والموردين. مش لازم تكون شاطر في الإنجليزي من الأول: هنبدأ من الصفر، خطوة بخطوة، في 30 يوم.')));
    P.add(h('div', 'boxh', 'إزاي تذاكر من الكتاب ده؟ · <span class="en">How to use this book</span>'));
    P.add(h('ol', 'howto', M.howTo.map(t => `<li>${fmt(t)}</li>`).join('')));
    P.add(h('div', 'boxh', 'تعرّف على فريق Nile Logistics · <span class="en">Meet the team</span>'));
    P.add(h('div', 'cast', M.cast.map(c => `<div class="cs"><span class="av">${esc(c[0].charAt(0))}</span><b dir="ltr">${esc(c[0])}</b><small dir="ltr">${esc(c[1])}</small><em>${fmt(c[2])}</em></div>`).join('')));
    P.add(h('div', 'note', fmt('الأسابيع: الأول 6 أيام، التاني 10 أيام، التالت 8 أيام، الرابع 6 أيام — المجموع 30 يوم بالظبط. لو فاتك يوم متقلقش، كمّل من حيث وقفت.')));
    // study plan
    P.begin({ cls: 'front', runL: 'Study plan', runR: 'خطة المذاكرة' }); A.plan = pg();
    P.add(ptitle('Daily Study Plan', 'خطة المذاكرة اليومية · 30 إلى 40 دقيقة'));
    const planTxt = ['اقرأ، بصّ على النطق، وكرّر كل كلمة 3 مرات بصوت عالي.', 'اقرأ الشرح والجدول والأخطاء الشائعة. مش مطلوب تحفظ.', 'اقرأ الجمل بصوت عالي وعلّم ✓ كل مرة.', 'اقرأها مرتين: مرة بدور أحمد ومرة بالدور التاني.', 'حلها بالقلم من غير ما تبص على الإجابات.', 'اتفرج وردد وراهم. شوفه مرتين لو تقدر.', 'من غير مساعدة. النجاح من 16 من 20.'];
    P.add(h('table', 'tbl planT', '<thead><tr><th>الوقت</th><th>النشاط</th><th>اعمل إيه؟</th></tr></thead><tbody>' + M.plan.map((p, i) => `<tr><td class="c-n"><b class="en">${p.min}</b> د</td><td><b>${esc(p.ar)}</b></td><td>${fmt(planTxt[i])}</td></tr>`).join('') + '</tbody>'));
    P.add(h('div', 'boxh', 'قاعدة النجاح: 80% · <span class="en">Pass mark</span>'));
    P.add(h('table', 'tbl planT', '<thead><tr><th>الدرجة</th><th>الحالة</th><th>اعمل إيه؟</th></tr></thead><tbody>' + M.rules.map(r => `<tr><td class="c-n"><b class="en">${esc(r[0])}</b></td><td><b>${esc(r[1])}</b></td><td>${fmt(r[2])}</td></tr>`).join('') + '</tbody>'));
    P.add(h('div', 'tip', '<b>نصايح الذاكرة:</b> ذاكر في نفس الميعاد كل يوم · سجّل صوتك وقارنه بالفيديو · اكتب 3 جمل عن شغل النهارده · راجع كلمات امبارح 3 دقايق قبل ما تبدأ · الإجابات النموذجية في آخر الكتاب — متفتحهاش قبل ما تحل.'));
    // pronunciation key
    P.begin({ cls: 'front', runL: 'Pronunciation key', runR: 'دليل النطق' }); A.pron = pg();
    P.add(ptitle('Pronunciation Key', 'دليل النطق بالحروف العربي'));
    P.add(h('p', 'lead', fmt('كل كلمة جديدة في الكتاب مكتوب جنبها نطقها بالحروف العربي. عشان تقرأها صح، استخدم الجدول ده:')));
    P.add(h('table', 'tbl pronT', '<thead><tr><th>الصوت</th><th>الحرف</th><th>مثال</th><th>النطق</th></tr></thead><tbody>' + M.pron.map(r => `<tr><td dir="ltr" class="c-en">${esc(r[0])}</td><td class="c-l">${esc(r[1])}</td><td dir="ltr" class="c-en"><b>${esc(r[2])}</b></td><td>${pr(r[3])}</td></tr>`).join('') + '</tbody>'));
    P.add(h('div', 'boxh', 'ملاحظات مهمة · <span class="en">Important notes</span>'));
    P.add(h('ul', 'howto', M.pronNotes.map(t => `<li>${fmt(t)}</li>`).join('')));
    // tracker
    P.begin({ cls: 'tracker', runL: 'Progress tracker', runR: 'جدول المتابعة' }); A.tracker = pg();
    const st = '<div class="stg"><span>' + cb + 'لم يبدأ</span><span>' + cb + 'قيد الدراسة</span><span>' + cb + 'اجتاز</span><span>' + cb + 'يحتاج مراجعة</span></div>';
    P.table({
      cls: 'trk', head: ['#', 'الدرس', 'تاريخ الدراسة', 'النتيجة / 20', 'نقاط الضعف', 'حالة الدرس'], colCls: ['c-n', 'c-en', 'c-d', 'c-s', 'c-w', 'c-st'], dirs: [null, 'ltr', null, null, null, null],
      pre: [ptitle('Progress Tracker', 'جدول متابعة التقدّم'), h('div', 'note', fmt('سجّل بعد كل اختبار: التاريخ، النتيجة، ونقاط الضعف. النجاح من 16 من 20 (80%).'))],
      rows: Array.from({ length: 30 }, (_, i) => i + 1).map(id => ({ cls: 'tk', cells: [id, LS[id] ? esc(LS[id].titleEn) : 'Lesson ' + id, '', '', '', st] }))
    });
    }

    // weeks
    const t0 = performance.now();
    await tick('Front matter done (' + P.pages.length + ' pages)');
    for (const w of M.weeks) {
      if (DBG.on && DBG.nol) continue;
      if (DBG.on && !DBG.wd && !w.lessons.some(id => DBG.only.indexOf(id) >= 0)) continue;
      if (!DBG.on || DBG.wd) { P.begin({ cls: 'weekdiv', wk: w.n, bare: true }); A['W' + w.n] = pg(); P.body.innerHTML = weekDiv(w, LS); }
      for (const id of w.lessons) {
        if (DBG.on && DBG.only.indexOf(id) < 0) continue;
        const L = LS[id];
        if (!L) { qa.missing.push(id); P.begin({ cls: 'lesson', wk: w.n, runL: 'Lesson ' + id, runR: 'الدرس ' + id }); A['L' + id] = pg(); P.add(h('div', 'note', 'Lesson ' + id + ' data file is missing or has a syntax error.')); continue; }
        const errs = validateLesson(L); if (errs.length) qa.bad.push([id, errs]);
        try { await renderLesson(P, L, w, V); } catch (e) { qa.render.push([id, String(e && e.message || e)]); }
        await tick('Lesson ' + id + ' built · ' + P.pages.length + ' pages · ' + Math.round((performance.now() - t0) / 100) / 10 + 's');
      }
      if (!DBG.on || DBG.wd) {
        P.begin({ cls: 'check', wk: w.n, runL: 'Week ' + w.n + ' checkpoint', runR: 'محطة المراجعة · الأسبوع ' + w.n });
        P.addAll(checkNodes(w, LS));
      }
    }
    await tick('Answer key, glossary, contents…');

    let gl = [];
    if (!DBG.on || DBG.back) {
    // answer key
    P.begin({ cls: 'answers', runL: 'Answer key', runR: 'الإجابات النموذجية' }); P.mark('ANS');
    P.add(ptitle('Answer Key', 'الإجابات النموذجية للتمارين والاختبارات'));
    P.add(h('div', 'note', fmt('متفتحش الصفحات دي إلا بعد ما تحل التمارين والاختبار بنفسك. في الأسئلة المفتوحة (جمل وترجمة) أي إجابة صحيحة بمعناها وقواعدها مقبولة، حتى لو اختلفت شوية عن النموذج.')));
    await tick('ans-start');
    for (const id of Object.keys(LS).map(Number).sort((a, b) => a - b)) {
      if (DBG.on && DBG.only.length && DBG.only.indexOf(id) < 0) continue;
      try { P.add(B.answerBlock(LS[id])); } catch (e) { qa.render.push(['ans' + id, String(e.message || e)]); }
      if (id % 5 === 0) await tick('ans-' + id);
    }
    await tick('ans-done');

    // glossary
    const seen = new Map();
    Object.keys(LS).map(Number).sort((a, b) => a - b).forEach(id => (LS[id].vocab || []).forEach(v => { const k = String(v.en).toLowerCase(); if (!seen.has(k)) seen.set(k, { en: v.en, pos: v.pos, pron: v.pron, ar: v.ar, l: id }); }));
    gl = Array.from(seen.values()).sort((a, b) => a.en.localeCompare(b.en, 'en', { sensitivity: 'base' }));
    const cellEn = x => `<b>${esc(x.en)}</b> <i class="pos">${esc(x.pos)}</i><br><span class="pron sm">${pr(x.pron)}</span>`;
    const grows = [];
    for (let i = 0; i < gl.length; i += 2) { const a = gl[i], b = gl[i + 1]; grows.push({ cells: [cellEn(a), fmt(a.ar), a.l, b ? cellEn(b) : '', b ? fmt(b.ar) : '', b ? b.l : ''] }); }
    await tick('gl-rows-' + grows.length);
    P.begin({ cls: 'gloss', runL: 'Glossary A–Z', runR: 'القاموس الصغير' }); P.mark('GLO');
    P.table({
      cls: 'gl', head: ['English', 'المعنى', 'Day', 'English', 'المعنى', 'Day'], colCls: ['c-en', 'c-ar', 'c-n', 'c-en', 'c-ar', 'c-n'], dirs: ['ltr', null, null, 'ltr', null, null],
      pre: [ptitle('Glossary A–Z', 'القاموس الصغير · ' + gl.length + ' كلمة'), h('div', 'note', fmt('كل كلمات الكورس مرتبة أبجدياً (من اليسار لليمين، سطر بسطر). الرقم هو اليوم اللي اتعلمت فيه الكلمة.'))],
      rows: grows
    });
    await tick('gl-table');
    // certificate
    P.begin({ cls: 'cert', bare: true }); P.mark('CERT'); A.CERT = pg();
    P.body.innerHTML = `<div class="ct"><div class="ct-b"><div class="ct-k" dir="ltr">CERTIFICATE OF COMPLETION</div><div class="ct-a">شهادة إتمام الكورس</div>
      <p class="ct-p" dir="ltr">This certifies that</p><div class="ct-line"></div>
      <p class="ct-p" dir="ltr">has successfully completed the 30-day course<br><b>Business English for Warehouse &amp; Supply Chain</b><br>with a score of at least 80% in every lesson quiz.</p>
      <div class="ct-s"><div><div class="ct-line s"></div><small>التاريخ · Date</small></div><div class="ct-seal">30<small>DAYS</small></div><div><div class="ct-line s"></div><small>التوقيع · Signature</small></div></div></div></div>`;

    }
    await tick('cert-done');
    // fill TOC
    if (!DBG.on || (DBG.toc && DBG.front)) {
    let tk = 0;
    const tadd = node => {
      let body = tocPages[tk].querySelector('.pbody'); body.appendChild(node);
      if (body.scrollHeight > body.clientHeight + 1 && body.children.length > 1) {
        body.removeChild(node); tk++;
        if (!tocPages[tk]) { P.warns.push('TOC overflow'); return; }
        tocPages[tk].querySelector('.pbody').appendChild(node);
      }
    };
    const row = (cls, no, en, ar, page, extra) => h('a', 'tr ' + cls, `<span class="t-no">${no}</span><span class="t-en" dir="ltr">${esc(en)}</span><span class="t-ar">${fmt(ar)}</span><span class="t-dots"></span>${extra || ''}<span class="t-pg">${page || ''}</span>`);
    const set = (el, p) => { el.setAttribute('href', '#p' + p); return el; };
    tadd(ptitle('Contents', 'فهرس المحتويات'));
    [['', 'Welcome & how to use', 'أهلاً بيك وإزاي تذاكر', A.welcome], ['', 'Daily study plan & pass mark', 'خطة المذاكرة وقاعدة النجاح', A.plan], ['', 'Pronunciation key', 'دليل النطق', A.pron], ['', 'Progress tracker', 'جدول المتابعة', A.tracker]]
      .forEach(r => tadd(set(row('front', r[0], r[1], r[2], r[3]), r[3])));
    M.weeks.forEach(w => {
      const wrow = set(row('wk wk' + w.n, 'W' + w.n, w.titleEn, w.titleAr, A['W' + w.n]), A['W' + w.n]);
      let first = true;
      w.lessons.forEach(id => {
        const L = LS[id]; if (!L) return;
        const lrow = set(row('ls', id, L.titleEn, L.titleAr, A['L' + id], `<span class="t-q">Quiz ${A['Q' + id] || ''}</span>`), A['L' + id]);
        if (first) { const g = h('div', 'tg'); g.appendChild(wrow); g.appendChild(lrow); tadd(g); first = false; } else tadd(lrow);
      });
    });
    [['', 'Answer key', 'الإجابات النموذجية', A.ANS], ['', 'Glossary A–Z', 'القاموس الصغير', A.GLO], ['', 'Certificate', 'شهادة إتمام الكورس', A.CERT]].forEach(r => tadd(set(row('front', r[0], r[1], r[2], r[3]), r[3])));

    }
    await tick('toc-done');
    pages = P.pages.length;
    return { P, qa, glossary: gl.length, pages: P.pages.length };
  }
  let pages = 0;

  function showQA(r, loaded) {
    const q = r.qa, items = [];
    if (q.missing.length) items.push('<b>Missing lessons:</b> ' + q.missing.join(', '));
    q.bad.forEach(b => items.push('<b>Lesson ' + b[0] + ':</b> ' + b[1].map(esc).join('; ')));
    q.render.forEach(b => items.push('<b>Render error ' + esc(b[0]) + ':</b> ' + esc(b[1])));
    r.P.warns.forEach(w => items.push('<b>Layout:</b> ' + esc(w)));
    const ok = !items.length;
    $('qa').innerHTML = (ok ? '<div class="qa-ok">All checks passed.</div>' : '<ul>' + items.map(i => '<li>' + i + '</li>').join('') + '</ul>');
    $('status').textContent = loaded + '/30 lessons · ' + r.pages + ' pages · ' + r.glossary + ' glossary words · ' + (ok ? 'no warnings' : items.length + ' warnings');
    $('status').className = ok ? 'ok' : 'warn';
  }

  async function waitFonts() {
    try {
      const probes = ['400 16px Cairo', '600 16px Cairo', '700 16px Cairo', '800 16px Cairo', '400 16px Inter', '600 16px Inter', '700 16px Inter'];
      await Promise.race([Promise.all(probes.map(p => document.fonts.load(p, 'مرحبا Hello'))), sleep(7000)]);
      await document.fonts.ready;
    } catch (e) { /* offline: fallback fonts */ }
  }

  async function main() {
    DBG = parseQA();
    if (DBG.on) { $('help').hidden = true; document.documentElement.classList.add('qa'); }
    if (DBG.sheet) $('book').classList.add('qasheet');
    $('btnPrint').disabled = true;
    $('status').textContent = 'Loading fonts…';
    await waitFonts();
    $('status').textContent = 'Building pages…';
    await sleep(40);
    const loaded = Object.keys(W.LESSONS || {}).length;
    let r;
    try { r = await build(); } catch (e) { $('status').textContent = 'Build error: ' + (e && e.message || e); $('status').className = 'warn'; console.error(e); return; }
    showQA(r, loaded);
    $('btnPrint').disabled = false;
    W.__book = r;
    if (DBG.on && DBG.keep) r.P.pages.forEach((pg, k) => { if (DBG.keep.indexOf(k + 1) < 0) pg.remove(); });
    if (DBG.on && DBG.p1) { const keep = new Set(DBG.only.map(id => r.P.anchors['L' + id])); r.P.pages.forEach((pg, k) => { if (!keep.has(k + 1)) pg.remove(); }); }
    fitZoom();
    if (!DBG.on) { try { history.replaceState(null, '', '#done-' + r.pages + 'p-' + $('status').className); } catch (e) { /* ignore */ } }
  }
  function fitZoom() {
    const b = $('book'); b.style.zoom = '';
    const pw = 210 / 25.4 * 96, avail = document.documentElement.clientWidth - 16;
    if (DBG.on && DBG.zoom) b.style.zoom = String(DBG.zoom);
    else if (avail < pw) b.style.zoom = String(Math.max(0.3, avail / pw));
  }
  W.addEventListener('resize', () => { if (W.__book) fitZoom(); });
  W.addEventListener('DOMContentLoaded', () => {
    if (W.IN_ARTIFACT) { $('btnPrint').hidden = true; $('help').innerHTML = 'On-screen preview. To get the PDF, open <b>index.html</b> from the <b>Business_English_Book</b> folder in Chrome or Edge and click <b>Save as PDF</b>.'; }
    $('btnPrint').onclick = () => W.print();
    $('btnRebuild').onclick = async () => { $('status').textContent = 'Rebuilding…'; await sleep(30); const r = await build(); showQA(r, Object.keys(W.LESSONS || {}).length); W.__book = r; fitZoom(); };
    $('btnQA').onclick = () => { $('qa').classList.toggle('show'); };
    main();
  });
})(window);
