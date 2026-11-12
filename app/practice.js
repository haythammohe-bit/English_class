/* Warehouse English — interactive practice (التمارين) + lesson quiz (الاختبار) */
(function (W) {
  'use strict';
  const D = document, G = W.Grade, Store = W.Store, V = W.V;
  const { esc, fmt } = W.BK;
  const I = V.icons, U = V.util;
  const P = (W.Practice = {});
  const T = {};                       // transient UI state (tile order, typed drafts) — never saved
  const $$ = (r, s) => Array.from(r.querySelectorAll(s));
  const toast = m => { if (W.WE && W.WE.toast) W.WE.toast(m); };
  const AR = G.hasAr;
  const NOAUTO = ' autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done"';
  const okMark = '<span class="rm ok">' + I.check + '</span>';
  const badMark = '<span class="rm bad">✕</span>';
  const BLANK = '<span class="blank"></span>';

  // right direction for each text: Arabic → RTL (Latin runs isolated), English → LTR
  const txt = t => AR(t) ? '<span class="ar">' + fmt(t) + '</span>' : '<span class="enl">' + esc(t) + '</span>';
  const qtxt = q => AR(q)
    ? '<span class="ar">' + fmt(q).replace(/_{2,}/, BLANK) + '</span>'
    : '<span class="enl">' + esc(q).replace(/_{2,}/, BLANK) + '</span>';
  const say = (t, o) => U.acts(t, Object.assign({ sm: true }, o || {}));
  const cur = () => { const m = /^#lesson-(\d{1,2})(?:-([a-z]+))?$/.exec(W.location.hash || ''); return m ? { n: +m[1], tab: m[2] || 'over' } : null; };

  function tilesHTML(tiles, order, tileAct, untileAct, extra) {
    const used = {}; order.forEach(k => { used[k] = 1; });
    extra = extra || '';
    let h = '<div class="slot' + (order.length ? '' : ' empty') + '" dir="ltr" data-ph="اضغط على الكلمات بالترتيب">' +
      order.map(k => '<button type="button" class="wt picked" data-px="' + untileAct + '"' + extra + ' data-k="' + k + '">' + esc(tiles[k]) + '</button>').join('') + '</div>';
    h += '<div class="bank" dir="ltr">' + tiles.map((w, k) => used[k] ? '' : '<button type="button" class="wt" data-px="' + tileAct + '"' + extra + ' data-k="' + k + '">' + esc(w) + '</button>').join('') + '</div>';
    return h;
  }

  /* =====================================================================
     PRACTICE TAB
     ===================================================================== */
  const KINDS = [['build', '١) رتّب الكلمات'], ['comp', '٢) كمّل الجملة'], ['write', '٣) اكتب بنفسك'], ['tr', '٤) ترجم للإنجليزي'], ['speak', '٥) قول بصوت عالي']];
  const st = (n, k, i) => Store.exGet(n, k, i);
  const tk = (n, k, i) => n + ':' + k + ':' + i;
  const tstate = (n, k, i) => (T[tk(n, k, i)] = T[tk(n, k, i)] || { order: [], text: '' });
  const qtop = (i, label) => '<div class="qtop"><span class="qn">' + (i + 1) + '</span><span class="qk">' + label + '</span></div>';

  // feedback block shared by build / write / tr
  function result(k, it, s) {
    const pm = G.parseModel(it.model), main = pm.main, isW = k === 'write';
    let title;
    if (s.ok) title = s.a ? 'صح!' : 'تمام — اعتبرتها صح';
    else title = s.c ? 'قريبة جداً من الصح' : (isW ? 'قارن إجابتك بالنموذج' : 'مش مظبوطة');
    let h = '<div class="res ' + (s.ok ? 'ok' : 'bad') + '"><div class="rt">' + (s.ok ? okMark : badMark) + '<b>' + title + '</b></div>';
    if (k !== 'build') h += '<div class="you"><span class="yl">إجابتك</span><span class="enl">' + esc(s.v) + '</span></div>';
    h += '<div class="mdl"><span class="ml">' + (isW ? 'إجابة نموذجية' : s.ok ? 'اسمعها' : 'الإجابة الصح') + '</span><span class="enl">' + esc(main) + '</span>' + say(main) + '</div>';
    if (pm.notes.length) h += '<div class="alt">' + fmt(pm.notes.join(' — ')) + '</div>';
    if (!s.ok && k === 'tr') {
      const d = G.wordDiff(s.v, it.model);
      if ((d.missing.length || d.extra.length) && d.missing.length <= 5 && d.extra.length <= 5) {
        h += '<div class="alt">' + (d.missing.length ? fmt('ناقص: ' + d.missing.join(', ')) : '') + (d.missing.length && d.extra.length ? ' · ' : '') + (d.extra.length ? fmt('زيادة: ' + d.extra.join(', ')) : '') + '</div>';
      }
    }
    h += '<div class="row wrap">';
    if (!s.ok) h += '<button type="button" class="btn sm" data-px="retry">حاول تاني</button><button type="button" class="btn sm" data-px="override">' + (k === 'build' ? 'ترتيبي صح كمان' : isW ? 'إجابتي قريبة من النموذج' : 'إجابتي صح كمان') + '</button>';
    else h += (s.a ? '' : '<button type="button" class="btn sm" data-px="unoverride">تراجع</button>') + '<button type="button" class="btn sm" data-px="retry">إعادة</button>';
    return h + '</div></div>';
  }

  function typed(n, k, i, it, s) {
    const isW = k === 'write', t = tstate(n, k, i);
    let h = qtop(i, isW ? 'اكتب بالإنجليزي' : 'ترجم للإنجليزي');
    h += '<div class="qq"><span class="ar">' + fmt(it.ar) + '</span>' + (isW && it.hint ? '<span class="hint en">' + esc(it.hint) + '</span>' : '') + '</div>';
    if (!s) {
      h += '<input class="inp" type="text" data-px-in="px" value="' + esc(t.text) + '" placeholder="اكتب بالإنجليزي هنا"' + NOAUTO + '>' +
        '<div class="row"><button type="button" class="btn pri sm" data-px="check">' + (isW ? 'قارن بالنموذج' : 'تحقق') + '</button></div>';
    } else h += result(k, it, s);
    return h;
  }

  const ITEM = {
    build(n, i, it, s) {
      const t = tstate(n, 'build', i);
      let h = qtop(i, 'رتّب الكلمات لتكوين جملة');
      if (s) {
        h += '<div class="slot ' + (s.ok ? 'ok' : 'bad') + '" dir="ltr"><span class="en" style="font-weight:700">' + esc(s.v) + '</span></div>' + result('build', it, s);
      } else {
        h += tilesHTML(it.tiles, t.order, 'tile', 'untile') +
          '<div class="row"><button type="button" class="btn pri sm" data-px="check"' + (t.order.length === it.tiles.length ? '' : ' disabled') + '>تحقق</button>' +
          '<button type="button" class="btn sm" data-px="clear"' + (t.order.length ? '' : ' disabled') + '>مسح</button></div>';
      }
      return h;
    },
    comp(n, i, it, s) {
      let h = qtop(i, 'اختار الكلمة الصح') + '<div class="qq">' + qtxt(it.q) + '</div>';
      h += '<div class="opts2 row3">' + it.opts.map((o, k) => {
        let c = 'opt';
        if (s) { if (k === it.ans) c += ' ok'; else if (o === s.v) c += ' bad'; }
        return '<button type="button" class="' + c + '" data-px="pick" data-k="' + k + '"' + (s ? ' disabled' : '') + '><span class="ot"><span class="enl">' + esc(o) + '</span></span></button>';
      }).join('') + '</div>';
      if (s) {
        const full = G.fillFull(it.q, it.model);
        h += '<div class="res ' + (s.ok ? 'ok' : 'bad') + '"><div class="rt">' + (s.ok ? okMark + '<b>صح!</b>' : badMark + '<b>الإجابة الصح: <span class="en">' + esc(it.model) + '</span></b>') + '</div>' +
          '<div class="mdl"><span class="enl">' + esc(full) + '</span>' + say(full) + '</div>' +
          '<div class="row"><button type="button" class="btn sm" data-px="retry">جرّب تاني</button></div></div>';
      }
      return h;
    },
    write(n, i, it, s) { return typed(n, 'write', i, it, s); },
    tr(n, i, it, s) { return typed(n, 'tr', i, it, s); },
    speak(n, i, it, s) {
      const done = !!(s && s.ok);
      return qtop(i, 'قولها بصوت عالي') +
        '<div class="row"><div class="grow"><span class="enl" style="font-weight:700">' + esc(it.en) + '</span><span class="muted">' + fmt(it.ar) + '</span></div>' + say(it.en) + '</div>' +
        '<details><summary>اعرض إجابة نموذجية</summary><div class="ans"><span class="enl">' + esc(it.model) + '</span>' + say(it.model) + (U.mic ? U.mic(G.mainOf(it.model), { sm: true }) : '') + '</div></details>' +
        '<button type="button" class="btn sm' + (done ? ' pri' : '') + '" data-px="speakdone">' + (done ? I.check + ' قلتها' : 'قلتها بصوت عالي') + '</button>';
    }
  };

  function itemHTML(n, k, i) {
    return '<div class="qit px" data-ex="' + k + '" data-n="' + n + '" data-i="' + i + '">' + ITEM[k](n, i, G.practice(n)[k][i], st(n, k, i)) + '</div>';
  }
  function refreshItem(box) {
    const tmp = D.createElement('div');
    tmp.innerHTML = itemHTML(+box.dataset.n, box.dataset.ex, +box.dataset.i);
    const nb = tmp.firstElementChild; box.replaceWith(nb);
    return nb;
  }

  function counts(n) {
    const pr = G.practice(n); let done = 0, tot = 0; const secs = {};
    KINDS.forEach(kk => {
      const k = kk[0]; let d = 0, ok = 0;
      pr[k].forEach((x, i) => { const s = st(n, k, i); if (s && (s.ok === 0 || s.ok === 1)) { d++; if (s.ok) ok++; } });
      secs[k] = { d: d, ok: ok, of: pr[k].length }; done += d; tot += pr[k].length;
    });
    return { done: done, tot: tot, secs: secs };
  }
  function refreshSummary(n) {
    const c = counts(n);
    $$(D, '[data-pcount]').forEach(e => { e.textContent = c.done + '/' + c.tot; });
    $$(D, '[data-pbar]').forEach(e => { e.style.width = (c.tot ? Math.round(c.done / c.tot * 100) : 0) + '%'; });
    KINDS.forEach(kk => $$(D, '[data-sc="' + kk[0] + '"]').forEach(e => { const s = c.secs[kk[0]]; e.textContent = s.ok + '/' + s.of; }));
  }

  P.prac = function (n) {
    const c = counts(n);
    let h = '<div class="card stack"><div class="row"><b class="grow">تقدمك في التمارين</b><span class="en pc" data-pcount>' + c.done + '/' + c.tot + '</span></div>' +
      '<div class="bar"><i data-pbar style="width:' + (c.tot ? Math.round(c.done / c.tot * 100) : 0) + '%"></i></div>' +
      '<div class="muted small">اختار أو رتّب أو اكتب، والتصحيح بيظهر فوراً. لو إجابتك صح بصياغة تانية اضغط «إجابتي صح كمان».</div></div>';
    KINDS.forEach(kk => {
      const k = kk[0], list = G.practice(n)[k];
      h += '<h2 class="sec">' + kk[1] + '<span class="sc en" data-sc="' + k + '">' + c.secs[k].ok + '/' + c.secs[k].of + '</span></h2>';
      h += list.map((x, i) => itemHTML(n, k, i)).join('');
    });
    h += '<div class="row wrap"><button type="button" class="btn sm" data-px="exreset" data-n="' + n + '" data-ask="اضغط تاني لمسح كل إجابات التمارين">إعادة كل التمارين</button></div>';
    h += '<a class="btn pri block" href="#lesson-' + n + '-quiz">جاهز؟ ادخل الاختبار ' + I.left + '</a>';
    return h;
  };

  function onPractice(t, act, box) {
    const n = +box.dataset.n, k = box.dataset.ex, i = +box.dataset.i, it = G.practice(n)[k][i], ts = tstate(n, k, i);
    if (act === 'tile') ts.order.push(+t.dataset.k);
    else if (act === 'untile') ts.order = ts.order.filter(x => x !== +t.dataset.k);
    else if (act === 'clear') ts.order = [];
    else if (act === 'check') {
      if (k === 'build') {
        if (ts.order.length !== it.tiles.length) return;
        const s = ts.order.map(x => it.tiles[x]).join(' '), c = G.check(s, it.model);
        Store.exSet(n, k, i, { v: s, ok: c.ok ? 1 : 0, a: c.ok ? 1 : 0 });
        ts.order = [];
      } else {
        const inp = box.querySelector('input[data-px-in]'), text = ((inp && inp.value) || '').trim();
        if (!text) { toast('اكتب إجابتك الأول'); return; }
        const c = G.check(text, it.model);
        Store.exSet(n, k, i, { v: text, ok: c.ok ? 1 : 0, a: c.ok ? 1 : 0, c: c.close ? 1 : 0 });
        ts.text = '';
      }
    } else if (act === 'pick') {
      const kk = +t.dataset.k, ok = kk === it.ans;
      Store.exSet(n, k, i, { v: it.opts[kk], ok: ok ? 1 : 0, a: ok ? 1 : 0 });
      G.weakWordsFor(n, { kind: 'fill', model: it.model }).forEach(w => Store.weakNote(w, n, ok));
    } else if (act === 'retry') { Store.exDel(n, k, i); ts.order = []; ts.text = ''; }
    else if (act === 'override') { const s = st(n, k, i); if (s) Store.exSet(n, k, i, Object.assign({}, s, { ok: 1, a: 0 })); }
    else if (act === 'unoverride') { const s = st(n, k, i); if (s) Store.exSet(n, k, i, Object.assign({}, s, { ok: 0 })); }
    else if (act === 'speakdone') { const s = st(n, k, i); if (s && s.ok) Store.exDel(n, k, i); else Store.exSet(n, k, i, { ok: 1, a: 1 }); }
    else return;
    const nb = refreshItem(box);
    refreshSummary(n);
    if (act === 'retry') { const inp = nb.querySelector('input'); if (inp) inp.focus(); }
  }

  function paneRefresh(keepScroll) {
    const c = cur(), pane = D.querySelector('.pane');
    if (!c || !pane) return;
    const y = W.scrollY;
    pane.innerHTML = V.pane(c.n, c.tab);
    if (keepScroll) W.scrollTo(0, y);
    else { const r = pane.getBoundingClientRect(); W.scrollTo(0, Math.max(0, W.scrollY + r.top - 130)); }
  }

  function onExReset(t) {
    if (!U.twice(t)) return;
    const n = +t.dataset.n;
    Store.exClear(n);
    Object.keys(T).forEach(k => { if (k.indexOf(n + ':') === 0) delete T[k]; });
    paneRefresh(false);
    toast('اتمسحت إجابات التمارين');
  }

  /* =====================================================================
     LESSON QUIZ
     ===================================================================== */
  const SEC_NAME = {}; G.SECS.forEach(s => { SEC_NAME[s[0]] = s[1]; });
  const QLABEL = { mcq: 'اختار الإجابة الصح', fill: 'اكتب الكلمة الناقصة', ar2en: 'ترجم للإنجليزي', en2ar: 'اختار المعنى الصح', order: 'رتّب الكلمات', write: 'اكتب بالإنجليزي', reply: 'اكتب الرد' };
  const fdate = U.fdate;
  const attemptFrom = r => ({
    s: r.score, tot: r.total,
    sec: G.SECS.map(s => r.sec[s[0]].ok), of: G.SECS.map(s => r.sec[s[0]].of),
    bad: r.per.map((x, i) => (x.ok ? -1 : i)).filter(i => i >= 0)
  });

  function qPrompt(it) {
    switch (it.kind) {
      case 'mcq': case 'fill': return qtxt(it.q);
      case 'ar2en': case 'write': return '<span class="ar">' + fmt(it.q) + '</span>';
      case 'en2ar': return '<div class="row"><span class="enl grow">' + esc(it.q) + '</span>' + say(it.q) + '</div>';
      case 'reply': return '<div class="row"><span class="enl grow">' + esc(it.q) + '</span>' + say(G.replyText(it.q)) + '</div>';
      case 'order': return '<span class="muted small">كوّن جملة صحيحة من الكلمات دي</span>';
    }
    return '';
  }
  function qCtl(it, a) {
    if (it.kind === 'mcq' || it.kind === 'en2ar') {
      return '<div class="opts2" role="radiogroup">' + it.opts.map((o, k) =>
        '<button type="button" class="opt' + (a === k ? ' picked' : '') + '" role="radio" aria-checked="' + (a === k) + '" data-px="qopt" data-id="' + it.id + '" data-k="' + k + '"><span class="ol">' + 'ABCD'.charAt(k) + '</span><span class="ot">' + txt(o) + '</span></button>').join('') + '</div>';
    }
    if (it.kind === 'order') {
      const order = Array.isArray(a) ? a : [];
      return tilesHTML(it.tiles, order, 'qtile', 'quntile', ' data-id="' + it.id + '"') +
        '<div class="row"><button type="button" class="btn sm" data-px="qclear" data-id="' + it.id + '"' + (order.length ? '' : ' disabled') + '>مسح</button></div>';
    }
    if (it.kind === 'write') return '<textarea class="inp ta" rows="2" data-px-in="q" data-id="' + it.id + '" placeholder="اكتب بالإنجليزي هنا"' + NOAUTO + '>' + esc(typeof a === 'string' ? a : '') + '</textarea>';
    return '<input class="inp" type="text" data-px-in="q" data-id="' + it.id + '" value="' + esc(typeof a === 'string' ? a : '') + '" placeholder="' + (it.kind === 'fill' ? 'الكلمة الناقصة' : 'اكتب بالإنجليزي هنا') + '"' + NOAUTO + '>';
  }
  function qCard(it, d) {
    return '<div class="qit qz" data-qid="' + it.id + '"><div class="qh"><span class="qno">' + (it.id + 1) + '</span><span class="qk">' + QLABEL[it.kind] + '</span></div>' +
      '<div class="qq">' + qPrompt(it) + '</div>' + qCtl(it, d.a[it.id]) + '</div>';
  }
  const qbarHTML = (total, cnt) => '<span>جاوبت <b class="en" data-qcount>' + cnt + '</b> من <b class="en">' + total + '</b></span><button type="button" class="btn pri" data-px="qsubmit" data-ask="">سلّم الاختبار</button>';

  function takeView(n, d) {
    const items = G.buildQuiz(n), r = G.scoreQuiz(items, d.a, d.m);
    let h = '<span class="qtake" hidden></span><div class="note">جاوب على الأسئلة وبعدين اضغط «سلّم الاختبار». مفيش تصحيح قبل التسليم، وإجاباتك بتتحفظ تلقائي.</div>';
    G.SECS.forEach(s => {
      h += '<h2 class="sec">' + s[1] + '</h2>' + items.filter(x => x.sec === s[0]).map(it => qCard(it, d)).join('');
    });
    h += '<div class="qbar" data-qbar>' + qbarHTML(items.length, r.answered) + '</div>';
    h += '<div class="row wrap"><button type="button" class="btn sm" data-px="qcancel" data-ask="اضغط تاني لإلغاء المحاولة">إلغاء المحاولة</button></div>';
    return h;
  }

  function introView(n) {
    const att = Store.attempts(n), la = att[att.length - 1];
    let h = '<div class="card stack"><h2 class="sec">اختبار الدرس</h2><p>20 سؤال: 5 اختيار من متعدد + 5 أكمل + 5 ترجمة + 5 تركيب جمل. النجاح من <b>16</b> فأكثر (80%).</p>' +
      '<p class="muted small">التصحيح تلقائي. في أسئلة الكتابة، لو إجابتك صح بصياغة مختلفة عن النموذج تقدر تقيّمها بنفسك في صفحة النتيجة.</p></div>';
    if (la) {
      const best = Math.max.apply(null, att.map(a => a.s));
      h += '<div class="card stack"><div class="row"><b class="grow">آخر نتيجة</b>' + V.pill(G.isPass(la) ? 'passed' : 'review') + '</div>' +
        '<div class="row"><span class="big sm en">' + la.s + '<small>/' + (la.tot || 20) + '</small></span><span class="muted small grow">أفضل نتيجة: <b class="en">' + best + '</b> · المحاولات: <b class="en">' + att.length + '</b></span></div>' +
        '<div class="wchips">' + att.slice(-6).map(a => '<span class="chip en">' + a.s + '/' + (a.tot || 20) + ' · ' + fdate(a.t) + '</span>').join('') + '</div></div>';
    }
    h += '<button type="button" class="btn pri block" data-px="qstart">' + (la ? 'ابدأ محاولة جديدة' : 'ابدأ الاختبار') + '</button>';
    if (!la) h += '<div class="muted small" style="text-align:center">قبل ما تبدأ: راجع الكلمات والقاعدة وجرّب التمارين.</div>';
    return h;
  }

  function yourHTML(it, r) {
    if (it.kind === 'mcq' || it.kind === 'en2ar') return txt(r.given);
    return '<span class="enl">' + esc(r.given) + '</span>';
  }
  function correctHTML(it) {
    if (it.kind === 'mcq') return txt(it.model) + (AR(it.model) ? '' : say(it.model));
    if (it.kind === 'en2ar') return '<span class="ar">' + fmt(it.model) + '</span>';
    if (it.kind === 'fill') { const full = G.fillFull(it.q, it.model); return '<span class="enl">' + esc(full) + '</span>' + say(full); }
    const pm = G.parseModel(it.model);
    return '<span class="enl">' + esc(pm.main) + '</span>' + say(pm.main) + (pm.notes.length ? '<div class="alt" style="flex-basis:100%">' + fmt(pm.notes.join(' — ')) + '</div>' : '');
  }
  function rv(it, r) {
    let h = '<div class="qit rv ' + (r.ok ? 'ok' : 'bad') + '" data-qid="' + it.id + '"><div class="qh"><span class="qno">' + (it.id + 1) + '</span><span class="qk">' + SEC_NAME[it.sec] + '</span><span class="grow"></span>' + (r.ok ? okMark : badMark) + '</div>';
    h += '<div class="qq">' + qPrompt(it) + '</div>';
    if (it.kind === 'order') h += '<div class="words-scr">' + it.tiles.map(w => '<span>' + esc(w) + '</span>').join('') + '</div>';
    h += '<div class="you"><span class="yl">إجابتك</span>' + (r.answered ? yourHTML(it, r) : '<span class="muted">— مفيش إجابة</span>') + '</div>';
    h += '<div class="mdl"><span class="ml">الإجابة الصح</span>' + correctHTML(it) + '</div>';
    if (it.self && r.answered && !r.auto) {
      h += '<div class="row wrap"><button type="button" class="btn sm' + (r.ok ? '' : ' pri') + '" data-px="qmark" data-id="' + it.id + '" data-v="' + (r.ok ? 0 : 1) + '">' + (r.ok ? 'تراجع — إجابتي غلط' : 'إجابتي صح كمان') + '</button>' +
        (r.close && !r.ok ? '<span class="muted small">قريبة جداً من الصح</span>' : '') + '</div>';
    }
    return h + '</div>';
  }

  function resultView(n, d) {
    const items = G.buildQuiz(n), r = G.scoreQuiz(items, d.a, d.m), pass = r.pass;
    let h = '<div class="card rcard ' + (pass ? 'ok' : 'bad') + '"><div class="big en">' + r.score + '<small>/' + r.total + '</small></div>' +
      '<div class="verdict">' + (pass ? I.check + 'اجتزت الاختبار' : 'محتاج مراجعة') + '</div>' +
      '<div class="muted small">النجاح من ' + G.passMark(r.total) + ' من ' + r.total + ' (80%)</div>' +
      '<div class="sbars">' + G.SECS.map(s => {
        const x = r.sec[s[0]], p = x.of ? Math.round(x.ok / x.of * 100) : 0;
        return '<div class="sbar' + (x.ok < x.of * 0.8 ? ' low' : '') + '"><span>' + s[1] + '</span><i style="--p:' + p + '%"></i><b class="en">' + x.ok + '/' + x.of + '</b></div>';
      }).join('') + '</div></div>';

    const low = G.SECS.filter(s => r.sec[s[0]].ok < r.sec[s[0]].of * 0.8);
    const wk = Store.weakList().filter(w => w.n === n).slice(0, 8);
    if (low.length || wk.length) {
      h += '<div class="card stack"><h2 class="sec">نقاط تحتاج تركيز</h2>';
      h += low.map(s => '<div class="rec"><b>' + s[1] + '</b> <span class="muted en">(' + r.sec[s[0]].ok + '/' + r.sec[s[0]].of + ')</span> — راجع <a href="#lesson-' + n + '-' + G.SEC_TAB[s[0]][0] + '">' + G.SEC_TAB[s[0]][1] + '</a></div>').join('');
      if (wk.length) h += '<div class="muted small">كلمات محتاجة تذاكرها:</div><div class="wchips">' + wk.map(w => '<span class="wchip en">' + esc(w.en) + U.spk(w.en, { sm: true }) + '</span>').join('') + '</div>';
      h += '</div>';
    }

    h += '<div class="row wrap"><button type="button" class="btn pri" data-px="qretake">' + (pass ? 'أعد الاختبار' : 'جرّب تاني') + '</button>' +
      (pass && n < 30 ? '<a class="btn" href="#lesson-' + (n + 1) + '">الدرس التالي ' + I.left + '</a>' : '') +
      (!pass ? '<a class="btn" href="#lesson-' + n + '-words">راجع الكلمات</a>' : '') +
      '<a class="btn" href="#progress">التقدم</a></div>';

    const wrong = [], right = [];
    r.per.forEach((x, i) => (x.ok ? right : wrong).push(i));
    h += '<h2 class="sec">مراجعة الإجابات<span class="sc en">' + wrong.length + ' غلط</span></h2>';
    h += wrong.length ? wrong.map(i => rv(items[i], r.per[i])).join('') : '<div class="okbox">كل إجاباتك صح. ممتاز!</div>';
    if (right.length) h += '<details class="tg"><summary>الإجابات الصح (' + right.length + ')</summary><div class="body pad stack">' + right.map(i => rv(items[i], r.per[i])).join('') + '</div></details>';

    const att = Store.attempts(n);
    if (att.length > 1) h += '<div class="card stack"><b>محاولاتك</b><div class="wchips">' + att.slice(-8).map(a => '<span class="chip en">' + a.s + '/' + (a.tot || 20) + ' · ' + fdate(a.t) + '</span>').join('') + '</div></div>';
    return h;
  }

  P.quiz = function (n) {
    const d = Store.quizDraft(n);
    if (d && d.ph === 'take') return takeView(n, d);
    if (d && d.ph === 'result') return resultView(n, d);
    return introView(n);
  };

  function refreshCard(n, id, d) {
    const old = D.querySelector('[data-qid="' + id + '"].qz'); if (!old) return;
    const tmp = D.createElement('div'); tmp.innerHTML = qCard(G.buildQuiz(n)[id], d);
    old.replaceWith(tmp.firstElementChild);
  }
  function updateBar(n, d) {
    const r = G.scoreQuiz(G.buildQuiz(n), d.a, d.m);
    $$(D, '[data-qcount]').forEach(e => { e.textContent = r.answered; });
  }

  function onQuiz(t, act) {
    const c = cur(); if (!c) return;
    const n = c.n; let d = Store.quizDraft(n);
    if (act === 'qstart' || act === 'qretake') { Store.setDraft(n, { ph: 'take', a: {}, m: {}, t0: Date.now() }); paneRefresh(false); return; }
    if (act === 'qcancel') { if (!U.twice(t)) return; Store.setDraft(n, null); paneRefresh(false); return; }
    if (!d) return;
    const id = +t.dataset.id, items = G.buildQuiz(n);
    if (act === 'qopt') {
      if (d.ph !== 'take') return;
      const k = +t.dataset.k; d.a[id] = k; Store.setDraft(n, d);
      const card = t.closest('[data-qid]');
      if (card) $$(card, '.opt').forEach(b => { const on = +b.dataset.k === k; b.classList.toggle('picked', on); b.setAttribute('aria-checked', String(on)); });
      updateBar(n, d);
    } else if (act === 'qtile' || act === 'quntile' || act === 'qclear') {
      if (d.ph !== 'take') return;
      let arr = Array.isArray(d.a[id]) ? d.a[id].slice() : [];
      if (act === 'qtile') arr.push(+t.dataset.k);
      else if (act === 'quntile') arr = arr.filter(x => x !== +t.dataset.k);
      else arr = [];
      d.a[id] = arr; Store.setDraft(n, d);
      refreshCard(n, id, d); updateBar(n, d);
    } else if (act === 'qsubmit') {
      if (d.ph !== 'take') return;
      const r = G.scoreQuiz(items, d.a, d.m), missing = r.total - r.answered;
      if (missing > 0) { t.dataset.ask = 'ناقص ' + missing + ' إجابة — اضغط تاني للتسليم'; if (!U.twice(t)) return; }
      Store.addAttempt(n, Object.assign({ t: Date.now() }, attemptFrom(r)));
      items.forEach((it, i) => { if (it.kind === 'mcq' || it.kind === 'fill') G.weakWordsFor(n, it).forEach(w => Store.weakNote(w, n, r.per[i].ok)); });
      d.ph = 'result'; Store.setDraft(n, d);
      paneRefresh(false); V.refreshHead(n);
    } else if (act === 'qmark') {
      if (d.ph !== 'result') return;
      const v = +t.dataset.v;
      d.m[id] = v; Store.setDraft(n, d);
      const r2 = G.scoreQuiz(items, d.a, d.m);
      Store.updateLastAttempt(n, attemptFrom(r2));
      paneRefresh(true); V.refreshHead(n);
      toast((v ? 'اتحسبت صح' : 'اتلغى التقييم') + ' — درجتك دلوقتي ' + r2.score + ' من ' + r2.total);
    }
  }

  /* =====================================================================
     EVENTS
     ===================================================================== */
  D.addEventListener('click', e => {
    const t = e.target.closest('[data-px]');
    if (!t || t.disabled) return;
    const act = t.dataset.px, box = t.closest('[data-ex]');
    if (box) onPractice(t, act, box);
    else if (act === 'exreset') onExReset(t);
    else if (act.charAt(0) === 'q') onQuiz(t, act);
  });

  // a good microphone attempt on a "say it aloud" item counts as done
  D.addEventListener('micresult', e => {
    const d = e.detail, box = d && d.ctx && d.ctx.closest ? d.ctx.closest('[data-ex="speak"]') : null;
    if (!box || d.verdict !== 'good') return;
    const n = +box.dataset.n, i = +box.dataset.i, s = st(n, 'speak', i);
    if (s && s.ok) return;
    Store.exSet(n, 'speak', i, { ok: 1, a: 1, m: 1 });
    refreshItem(box); refreshSummary(n);
    toast('اتسجّلت: قلتها صح');
  });

  let saveT = 0;
  D.addEventListener('input', e => {
    const t = e.target;
    if (!t.matches || !t.matches('[data-px-in]')) return;
    if (t.dataset.pxIn === 'q') {
      const c = cur(); if (!c) return;
      const d = Store.quizDraft(c.n); if (!d || d.ph !== 'take') return;
      d.a[+t.dataset.id] = t.value;
      clearTimeout(saveT); saveT = setTimeout(() => Store.setDraft(c.n, d), 250);
      updateBar(c.n, d);
    } else {
      const box = t.closest('[data-ex]');
      if (box) tstate(+box.dataset.n, box.dataset.ex, +box.dataset.i).text = t.value;
    }
  });
  D.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const t = e.target;
    if (!t.matches || !t.matches('input[data-px-in]')) return;
    e.preventDefault();
    if (t.dataset.pxIn === 'px') { const box = t.closest('[data-ex]'), b = box && box.querySelector('[data-px="check"]'); if (b) b.click(); }
    else t.blur();
  });
})(window);
