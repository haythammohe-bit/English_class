/* Warehouse English — word flashcards: home screen, study session, summary (schedule logic lives in srs.js) */
(function (W) {
  'use strict';
  const D = document, Store = W.Store, V = W.V, SRS = W.SRS, TTS = W.TTS, META = W.BOOK_META, LESSONS = W.LESSONS;
  const { esc, fmt, pr } = W.BK;
  const I = V.icons, U = V.util;
  const N = 30, pad = n => String(n).padStart(2, '0');
  const toast = m => { if (W.WE && W.WE.toast) W.WE.toast(m); };
  const rer = () => { if (W.WE) W.WE.rerender(); };
  const today = () => SRS.today();
  const daysAr = d => (d <= 0 ? 'النهارده' : d === 1 ? 'بكرة' : d === 2 ? 'بعد يومين' : d <= 10 ? 'بعد ' + d + ' أيام' : 'بعد ' + d + ' يوم');
  const kw = n => (n === 1 ? 'كلمة واحدة' : n === 2 ? 'كلمتين' : n >= 3 && n <= 10 ? n + ' كلمات' : n + ' كلمة');
  const uniq = list => { const seen = {}; return list.filter(c => !seen[c.id] && (seen[c.id] = 1)); };
  const hash = s => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };
  let sess = null;               // the running session. Never saved as a whole: every rating is saved at once.

  const weakIds = () => { const o = {}; Store.weakList().forEach(w => { o[SRS.key(w.en)] = 1; }); return o; };
  const nextDue = (state, td) => { let m = null; Object.keys(state).forEach(k => { if (state[k].d > td && (m === null || state[k].d < m)) m = state[k].d; }); return m; };

  /* ---------- today's numbers (shared by the cards screen, the home strip and the progress screen) ---------- */
  function counts() {
    const td = today(), state = Store.srs(), st = SRS.stats(state, td), meta = Store.srsMeta(td), set = Store.settings();
    const newAvail = Math.min(Math.max(0, set.newPerDay - meta.nw), st.fresh);
    return { td: td, state: state, st: st, newAvail: newAvail, todayCnt: st.due + newAvail, set: set };
  }

  /* ---------- building a session ---------- */
  function build(mode, n, ids) {
    const td = today(), state = Store.srs(), weak = weakIds(), set = Store.settings();
    let queue;
    if (mode === 'custom') queue = uniq((ids || []).map(id => SRS.byId(id)).filter(Boolean));
    else if (mode === 'weak') queue = uniq(Store.weakList().map(w => SRS.byId(SRS.key(w.en))).filter(Boolean));
    else if (mode === 'free') queue = uniq(SRS.ofLesson(n));
    else {
      const q = SRS.queue(mode === 'lesson' ? SRS.ofLesson(n) : SRS.all(), state, { today: td, weak: weak });
      const left = mode === 'review' ? Math.max(0, set.newPerDay - Store.srsMeta(td).nw) : mode === 'more' ? 10 : q.fresh.length;
      queue = (mode === 'more' ? [] : q.due).concat(q.fresh.slice(0, left));
    }
    return { mode: mode, n: n, key: mode + ':' + (n || 0), queue: queue, i: 0, flip: false, done: 0, stats: { again: 0, good: 0, easy: 0 }, again: {}, hard: {}, weak: weak, keep: mode === 'free' };
  }

  function dirFor(card, st) {
    const d = Store.settings().cardDir;
    if (d === 'ar' || d === 'en') return d;
    return (hash(card.id) + (st ? st.r || 0 : 0)) % 2 ? 'ar' : 'en';
  }
  const keepIt = (st) => !!(sess && sess.keep && st && st.d > today());   // free drill: the schedule stays as it is unless the word is forgotten

  function curInfo() {
    const card = sess.queue[sess.i], st = Store.srs()[card.id] || null;
    return { card: card, st: st, dir: dirFor(card, st) };
  }
  function autoSay() {
    if (!sess || sess.i >= sess.queue.length || !TTS.supported || !Store.settings().autoSpeak) return;
    const c = curInfo();
    if ((c.dir === 'en' && !sess.flip) || (c.dir === 'ar' && sess.flip)) TTS.speak(c.card.v.en, {});
  }

  /* ---------- session screens ---------- */
  function rateButtons(c) {
    const td = today(), pv = SRS.preview(c.st, td), keep = keepIt(c.st);
    const b = (g, label, sub) => '<button type="button" class="rate ' + g + '" data-cx="rate" data-g="' + g + '">' + label + '<small>' + sub + '</small></button>';
    return '<div class="rates">' + b('again', 'نسيتها', SRS.when(pv.again)) + b('good', 'عارفها', keep ? 'من غير تغيير' : SRS.when(pv.good)) + b('easy', 'سهلة', keep ? 'من غير تغيير' : SRS.when(pv.easy)) + '</div>';
  }

  function cardHTML(c) {
    const v = c.card.v, st = c.st, flip = sess.flip, mic = U.mic ? U.mic(v.en, {}) : '';
    const tag = !st ? '<span class="fc-tag new">جديدة</span>' : sess.weak[c.card.id] ? '<span class="fc-tag weak">ضعيفة</span>' : st.b === 0 ? '<span class="fc-tag">بتتعلم</span>' : '<span class="fc-tag due">مراجعة</span>';
    const word = '<div class="fc-word">' + esc(v.en) + '</div>';
    const mean = '<div class="fc-mean">' + fmt(v.ar) + '</div>';
    const ex = v.ex ? '<div class="vex"><span class="enl">' + esc(v.ex) + '</span>' + U.spk(v.ex, { sm: true }) + U.slow(v.ex, { sm: true }) + '</div>' : '';
    let q, a;
    if (c.dir === 'en') {
      q = word + '<div class="fc-sound">' + U.acts(v.en, {}) + '</div>' + (flip ? '' : '<div class="fc-hint">تفتكر معناها؟</div>');
      a = mean + '<div class="vpron">' + pr(v.pron) + '</div>' + (mic ? '<div class="fc-sound"><span class="muted small">قولها أنت:</span>' + mic + '</div>' : '') + ex;
    } else {
      q = mean + (flip ? '' : '<div class="fc-hint">قولها بالإنجليزي، وبعدين اعرض الإجابة</div>' + (mic ? '<div class="fc-sound">' + mic + '</div>' : ''));
      a = word + '<div class="fc-sound">' + U.acts(v.en, {}) + (mic || '') + '</div><div class="vpron">' + pr(v.pron) + '</div>' + ex;
    }
    return '<article class="fcard" style="--wk:var(--wk' + V.week(c.card.n) + ')"><div class="fc-meta">' + tag + '<span class="vlsn">L' + c.card.n + '</span><span class="pos">' + esc(v.pos) + '</span></div>' +
      '<div class="fc-q">' + q + '</div>' + (flip ? '<div class="fc-a">' + a + '</div>' : '') + '</article>';
  }

  function emptyHTML() {
    const s = sess, c = counts(), nd = nextDue(c.state, c.td);
    let h = '<div class="card stack rcard"><div class="verdict">' + I.check + (s.mode === 'weak' ? 'مفيش كلمات ضعيفة' : 'مفيش بطاقات مستحقة دلوقتي') + '</div>';
    if (s.mode === 'weak') h += '<p class="muted small">الكلمات اللي بتغلط فيها في الاختبارات أو بتنساها في البطاقات بتظهر هنا.</p>';
    else if (s.mode === 'lesson' || s.mode === 'free') h += '<p class="muted small">كلمات الدرس ده معادها لسه ما جاش' + (nd ? ' (أقرب مراجعة ' + daysAr(nd - c.td) + ')' : '') + '.</p>';
    else h += '<p class="muted small">' + (nd ? 'أقرب مراجعة ' + daysAr(nd - c.td) + '.' : 'ابدأ بكلمات جديدة.') + '</p>';
    h += '</div><div class="row wrap">';
    if (s.mode === 'lesson') h += '<a class="btn pri" href="#cards-free-' + s.n + '">ذاكرها تاني من غير ما المواعيد تتغيّر</a>';
    if (s.mode === 'review' && c.st.fresh) h += '<a class="btn pri" href="#cards-more">كلمات جديدة زيادة (10)</a>';
    return h + '<a class="btn" href="#cards">رجوع للبطاقات</a></div>';
  }

  function summaryHTML() {
    const s = sess, st = s.stats, tot = st.again + st.good + st.easy, td = today(), state = Store.srs();
    const tomorrow = Object.keys(state).filter(k => state[k].d <= td + 1).length;
    const hard = Object.keys(s.hard).map(id => SRS.byId(id)).filter(Boolean);
    let h;
    if (!tot) h = '<div class="card stack rcard"><div class="verdict">لسه ما راجعتش أي كلمة</div></div>';
    else {
      h = '<div class="card rcard ok stack"><div class="verdict">' + I.check + 'خلّصت الجلسة</div><div class="big en">' + s.done + '<small> كلمة</small></div>' +
        '<div class="muted small">عارفها <b class="en">' + st.good + '</b> · سهلة <b class="en">' + st.easy + '</b> · نسيتها <b class="en">' + st.again + '</b> مرة</div></div>';
      if (tomorrow) h += '<div class="note">بكرة هتلاقي ' + kw(tomorrow) + ' مستحقة للمراجعة.</div>';
    }
    if (hard.length) {
      h += '<div class="card stack"><h2 class="sec">كلمات نسيتها النهارده</h2>' + hard.map(c =>
        '<div class="fl-item"><span class="enl">' + esc(c.v.en) + '</span><span class="muted small">' + fmt(c.v.ar) + '</span>' + U.spk(c.v.en, { sm: true }) + '</div>').join('') + '</div>';
    }
    h += '<div class="row wrap"><a class="btn pri" href="#cards">رجوع للبطاقات</a>' + (hard.length ? '<button type="button" class="btn" data-cx="hard">راجع الصعبة تاني</button>' : '') + '</div>';
    return h;
  }

  function sessHTML() {
    const s = sess;
    if (!s.queue.length) return emptyHTML();
    if (s.i >= s.queue.length) return summaryHTML();
    const c = curInfo(), left = s.queue.length - s.i, total = s.done + left;
    return '<div class="csbar"><small class="en">' + left + '</small><span class="bar"><i style="width:' + (total ? Math.round(s.done / total * 100) : 0) + '%"></i></span>' +
      '<button type="button" class="btn sm" data-cx="end">إنهاء</button></div>' + cardHTML(c) +
      '<div class="csact">' + (s.flip ? rateButtons(c) : '<button type="button" class="btn pri block" data-cx="flip">اعرض الإجابة</button>') + '</div>' +
      (s.keep ? '<div class="muted small" style="text-align:center">مذاكرة حرة: مواعيد المراجعة بتفضل زي ما هي إلا لو نسيت الكلمة.</div>' : '');
  }

  function renderSess() {
    const box = D.getElementById('cs'); if (!box || !sess) return;
    box.innerHTML = sessHTML();
    if (W.scrollY > 120) W.scrollTo(0, 0);
    autoSay();
  }

  function rate(g) {
    if (!sess || sess.i >= sess.queue.length) return;
    const card = sess.queue[sess.i], td = today(), st = Store.srs()[card.id] || null;
    let ns;
    if (keepIt(st) && g !== 'again') ns = Object.assign({}, st, { r: (st.r || 0) + 1, t: td });
    else ns = SRS.next(st, g, td);
    Store.srsSet(card.id, ns);
    if (!st) Store.srsAddNew(td);
    const en = card.v.en;
    if (g === 'again') { if (st && st.b >= 1) Store.weakNote(en, card.n, false); }
    else if (Store.weakHas(en)) Store.weakNote(en, card.n, true);
    sess.stats[g]++;
    if (g === 'again') {
      sess.hard[card.id] = 1; sess.again[card.id] = (sess.again[card.id] || 0) + 1;
      if (sess.again[card.id] < 3) sess.queue.splice(Math.min(sess.queue.length, sess.i + 4), 0, card);   // comes back after three other cards
    } else sess.done++;
    sess.i++; sess.flip = false;
    renderSess();
  }

  /* ---------- the cards screen ---------- */
  function lessonRow(n, state, td) {
    const L = LESSONS[n], s = SRS.lessonStats(n, state, td);
    const sub = s.learned >= s.total ? 'كل الكلمات اتعلمتها' : s.learned + ' من ' + s.total + ' كلمة' + (s.due ? ' · ' + s.due + ' مستحقة' : '');
    return '<a class="prow" href="#cards-lesson-' + n + '"><span class="tn"><small>DAY</small>' + pad(n) + '</span><span class="tt"><span class="enr">' + esc(L.titleEn) + '</span><small>' + sub + '</small></span>' +
      '<span class="rside">' + (s.due ? '<span class="pill st-review en">' + s.due + '</span>' : s.learned >= s.total ? '<span class="tdone">' + I.check + '</span>' : '') + '</span></a>';
  }
  const chipset = (act, cur, opts) => '<div class="chipset">' + opts.map(o => '<button type="button" class="cbtn" data-cx="' + act + '" data-v="' + o[0] + '" aria-pressed="' + (String(cur) === String(o[0])) + '">' + o[1] + '</button>').join('') + '</div>';

  function home() {
    const c = counts(), st = c.st, set = c.set, weak = Store.weakList().length, pct = st.total ? Math.round(st.learned / st.total * 100) : 0, nd = nextDue(c.state, c.td);
    let h = '<div class="card stack psum"><div class="row"><div class="grow"><div class="k en">WORD CARDS</div><b class="bigl">' + (c.todayCnt ? 'عندك ' + kw(c.todayCnt) + ' النهارده' : 'خلّصت مراجعة النهارده') + '</b></div>' +
      '<div class="pcirc en" style="--pp:' + pct + '%"><span>' + pct + '%</span></div></div>' +
      '<div class="cstats"><div class="cst due"><b class="en">' + st.due + '</b>مستحقة للمراجعة</div><div class="cst new"><b class="en">' + c.newAvail + '</b>كلمات جديدة</div><div class="cst ok"><b class="en">' + st.learned + '/' + st.total + '</b>اتعلمتها</div></div>';
    if (c.todayCnt) h += '<a class="btn pri block" href="#cards-review">ابدأ مراجعة النهارده ' + I.left + '</a>';
    else h += '<div class="okbox">' + (st.learned ? 'مفيش حاجة مستحقة دلوقتي' + (nd ? '، وأقرب مراجعة ' + daysAr(nd - c.td) : '') + '.' : 'ابدأ بكلمات جديدة.') + '</div>';
    if (st.fresh && !(c.newAvail && !st.due)) h += '<a class="btn block" href="#cards-more">كلمات جديدة زيادة (10)</a>';
    if (weak) h += '<a class="btn block" href="#cards-weak">الكلمات الضعيفة (' + weak + ')</a>';
    h += '<div class="muted small">الكلمة اللي بتنساها بترجع لك بسرعة، واللي بتعرفها بتتباعد: بكرة، بعد يومين، أسبوع، شهر…</div></div>';

    h += '<div class="card stack"><h2 class="sec">الإعدادات</h2>' +
      '<div class="muted small">كلمات جديدة في اليوم</div>' + chipset('newpd', set.newPerDay, [[5, '5'], [10, '10'], [15, '15'], [20, '20']]) +
      '<div class="muted small">شكل البطاقة</div>' + chipset('dir', set.cardDir, [['en', 'إنجليزي ← عربي'], ['ar', 'عربي ← إنجليزي'], ['mix', 'مخلوط']]) +
      '<label class="sw"><input type="checkbox" data-cx-auto' + (set.autoSpeak ? ' checked' : '') + '> نطق الكلمة تلقائي</label></div>';

    META.weeks.forEach(w => {
      h += '<section class="stack" style="--wk:var(--wk' + w.n + ')"><div class="wkh"><span class="wn">' + w.n + '</span><div><b>الأسبوع ' + w.n + ': ' + esc(w.titleAr) + '</b></div></div>' + w.lessons.map(n => lessonRow(n, c.state, c.td)).join('') + '</section>';
    });
    h += '<button type="button" class="btn block" data-cx="srsreset" data-ask="هيمسح مواعيد المراجعة — اضغط تاني للتأكيد">مسح تقدم البطاقات</button>';
    return h;
  }

  /* ---------- hooks for the router, home and progress screens ---------- */
  const TITLES = { review: 'مراجعة النهارده', weak: 'الكلمات الضعيفة', more: 'كلمات جديدة', lesson: 'بطاقات الدرس ', free: 'مذاكرة حرة · الدرس ' };
  V.cards = function (h) {
    const m = /^cards(?:-(review|weak|more|lesson|free)(?:-(\d{1,2}))?)?$/.exec(h || '');
    if (!m) return null;
    const mode = m[1], n = m[2] ? +m[2] : 0;
    if (!mode || ((mode === 'lesson' || mode === 'free') && !LESSONS[n])) return { html: home(), title: 'بطاقات الكلمات', sub: 'Flashcards', back: null };
    const key = mode + ':' + n;
    if (!sess || sess.key !== key) { sess = build(mode, n); setTimeout(autoSay, 160); }
    return { html: '<div id="cs" class="stack">' + sessHTML() + '</div>', title: TITLES[mode] + (n || ''), sub: 'Flashcards', back: '#cards' };
  };
  V.cardsStrip = function () {
    const c = counts(), st = c.st;
    return '<a class="pstrip" href="#cards"><span class="pi">' + I.cards + '</span><span class="grow"><b>' + (c.todayCnt ? 'بطاقات الكلمات: ' + kw(c.todayCnt) + ' النهارده' : 'بطاقات الكلمات') + '</b>' +
      '<small>' + (st.learned ? 'اتعلمت ' + st.learned + ' من ' + st.total + ' كلمة' : 'راجع الكلمات بالتكرار المتباعد') + '</small>' +
      '<span class="bar"><i style="width:' + (st.total ? Math.round(st.learned / st.total * 100) : 0) + '%"></i></span></span>' + I.left + '</a>';
  };
  V.cardsSummary = V.cardsStrip;

  /* ---------- events ---------- */
  W.addEventListener('hashchange', () => { sess = null; });   // registered before the router's own listener, so a new visit always starts a fresh session
  D.addEventListener('click', e => {
    const t = e.target.closest('[data-cx]');
    if (!t) return;
    const a = t.dataset.cx;
    if (a === 'newpd') { Store.setSetting('newPerDay', +t.dataset.v); rer(); }
    else if (a === 'dir') { Store.setSetting('cardDir', t.dataset.v); rer(); }
    else if (a === 'srsreset') { if (!U.twice(t)) return; Store.set('srs', {}); Store.set('srsm', {}); toast('اتمسح تقدم البطاقات'); rer(); }
    else if (!sess) return;
    else if (a === 'flip') { sess.flip = true; renderSess(); }
    else if (a === 'rate') rate(t.dataset.g);
    else if (a === 'end') { sess.i = sess.queue.length; renderSess(); }
    else if (a === 'hard') { const ids = Object.keys(sess.hard); sess = build('custom', 0, ids); renderSess(); }
  });
  D.addEventListener('change', e => {
    const t = e.target;
    if (t.hasAttribute && t.hasAttribute('data-cx-auto')) Store.setSetting('autoSpeak', t.checked);
  });

  W.Cards = { build: build, counts: counts, daysAr: daysAr };
})(window);
