/* Warehouse English — role-play: you speak one part of the lesson dialogue, the app speaks the others */
(function (W) {
  'use strict';
  const D = document, Store = W.Store, V = W.V, TTS = W.TTS, META = W.BOOK_META, LESSONS = W.LESSONS;
  const { esc, fmt } = W.BK;
  const I = V.icons, U = V.util;
  const P = (W.Roleplay = {});
  const reduce = !!(W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const toast = m => { if (W.WE && W.WE.toast) W.WE.toast(m); };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const mic = () => (W.Mic && W.Mic.supported ? W.Mic : null);
  let R = null;                         // state of the open role-play (never saved; only "finished" counts are saved)
  let token = 0;                        // bumped to cancel whatever is still running

  const dlg = n => LESSONS[n].dialogue;
  const roleOf = name => { const c = (META.cast || []).find(x => x[0] === name); return c ? c[1] : ''; };
  const speakers = n => dlg(n).lines.map(l => l.who).filter((w, i, a) => a.indexOf(w) === i);
  const mine = () => dlg(R.n).lines.filter(l => l.who === R.me).length;
  const LABEL = { good: 'ممتاز', near: 'قريب', miss: 'حاولت', self: 'قلتها', skip: 'تخطّيت' };

  function fresh(n) {
    const sp = speakers(n);
    return { n: n, me: sp.indexOf('Ahmed') >= 0 ? 'Ahmed' : sp[0], mode: Store.settings().rpMode === 'hide' ? 'hide' : 'show', phase: 'idle', i: 0, turn: '', log: [], revealed: false, listening: false, res: null, err: null, warned: false };
  }

  /* ---------- screens ---------- */
  const chips = (act, cur, opts) => '<div class="chipset">' + opts.map(o => '<button type="button" class="cbtn" data-rp="' + act + '" data-v="' + esc(o[0]) + '" aria-pressed="' + (cur === o[0]) + '">' + o[1] + '</button>').join('') + '</div>';

  function setupHTML() {
    const n = R.n, d = dlg(n), done = Store.rpGet(n);
    const sp = speakers(n);
    let h = '<div class="card stack rp-setup"><h2 class="sec">اختار دورك</h2><div class="muted small">إنت هتقول جمل الشخصية اللي تختارها، والتطبيق هيقول باقي الشخصيات بصوتها.</div>' +
      '<div class="chipset">' + sp.map(w => '<button type="button" class="cbtn" data-rp="me" data-v="' + esc(w) + '" aria-pressed="' + (R.me === w) + '"><span class="en">' + esc(w) + '</span>' + (roleOf(w) ? '<small class="en">' + esc(roleOf(w)) + '</small>' : '') + '</button>').join('') + '</div>' +
      '<div class="muted small">طريقة التمثيل</div>' + chips('mode', R.mode, [['show', 'الجملة قدامي'], ['hide', 'من غير نص (المعنى بس)']]) +
      '<div class="muted small">' + (R.mode === 'hide' ? 'هتشوف معنى جملتك بالعربي وتقولها بالإنجليزي من دماغك. لو نسيت اضغط «ورّيني الجملة».' : 'جملتك بتظهر قدامك وإنت بتقولها بصوت عالي.') + '</div>' +
      '<div class="muted small">جملك: <b class="en">' + mine() + '</b> من <b class="en">' + d.lines.length + '</b>' + (done ? ' · مثّلتها <b class="en">' + done.n + '</b> مرة' + (done.t ? ' · آخر مرة ' + U.fdate(done.t) : '') : '') + '</div>' +
      '<button type="button" class="btn pri block" data-rp="start">' + I.play + 'ابدأ التمثيل</button></div>';
    if (!mic()) h += '<div class="note">الميكروفون مش متاح في المتصفح ده، فهتقول الجمل بصوت عالي وتضغط «قلتها». للتقييم التلقائي استخدم Chrome على أندرويد.</div>';
    return h;
  }

  function bubble(l, k) {
    const me = l.who === R.me, cur = k === R.i && R.phase === 'run', lg = R.log.find(x => x.i === k), r = roleOf(l.who);
    const hidden = me && cur && R.mode === 'hide' && !R.revealed;
    return '<div class="bub ' + (me ? 'me' : 'them') + (cur ? ' active' : '') + '"><div class="who"><span class="en">' + esc(l.who) + '</span>' + (r ? '<small class="en">' + esc(r) + '</small>' : '') +
      (lg ? '<span class="rp-mark ' + lg.r + '">' + LABEL[lg.r] + '</span>' : '') + '</div>' +
      (hidden ? '<span class="rp-hide">• • • ؟</span>' : '<span class="enl">' + esc(l.en) + '</span>') + '<span class="a' + (hidden ? ' keep' : '') + '">' + fmt(l.ar) + '</span>' +
      (!cur ? '<div class="bact">' + U.acts(l.en, { sm: true, who: l.who }) + '</div>' : '') + '</div>';
  }

  function turnHTML(l) {
    const M = mic();
    let h = '<div class="card stack rp-turn"><div class="row"><b class="grow">دورك دلوقتي</b><span class="en muted small">' + (R.log.length + 1) + '/' + mine() + '</span></div>';
    if (R.mode === 'hide' && !R.revealed) h += '<div class="row"><button type="button" class="btn sm" data-rp="reveal">ورّيني الجملة</button><span class="muted small">قولها من دماغك الأول</span></div>';
    if (R.listening) h += '<div class="ms-listen"><span class="ms-ic">' + I.mic + '</span><div><b>بسمعك…</b><div class="muted small">قول الجملة دلوقتي</div></div></div><div class="row"><button type="button" class="btn sm" data-rp="cancel">إلغاء</button></div>';
    else {
      if (R.res) h += '<div class="rp-res">' + M.resultHTML(R.res) + '</div>';
      else if (R.err) h += '<div class="warnbox">' + esc(M.errText(R.err)) + '</div>';
      h += '<div class="row wrap rp-acts">' + U.acts(l.en, { who: R.me }) +
        (M ? '<button type="button" class="btn pri" data-rp="mic">' + I.mic + (R.res || R.err ? 'جرّب تاني' : 'قولها') + '</button>' : '') +
        '<button type="button" class="btn" data-rp="said">' + (R.res && R.res.verdict !== 'good' ? 'كمّل' : 'قلتها ✓') + '</button>' +
        '<button type="button" class="btn sm" data-rp="skip">تخطّي</button></div>';
      if (!M) h += '<div class="muted small">قول الجملة بصوت عالي واضغط «قلتها».</div>';
    }
    return h + '</div>';
  }

  function endHTML() {
    const all = dlg(R.n).lines, lines = all.filter(l => l.who === R.me), said = R.log.filter(x => x.r !== 'skip').length, scores = R.log.filter(x => x.s != null);
    const helped = R.log.filter(x => x.h).length, weak = R.log.filter(x => x.r === 'near' || x.r === 'miss' || x.r === 'skip').map(x => all[x.i]);
    let h = '<div class="card rcard ok stack"><div class="verdict">' + I.check + 'خلّصت التمثيل</div><div class="big en">' + said + '<small>/' + lines.length + '</small></div><div class="muted small">جملة قلتها</div>' +
      (scores.length ? '<div class="small">متوسط وضوح النطق حسب تعرّف التطبيق على صوتك: <b class="en">' + Math.round(scores.reduce((a, b) => a + b.s, 0) / scores.length * 100) + '%</b></div>' : '') +
      (helped ? '<div class="small muted">ساعدت نفسك في ' + helped + ' جملة. جرّب المرة الجاية من غير ما تكشف الجملة.</div>' : '') + '</div>';
    if (weak.length) h += '<div class="card stack"><h2 class="sec">جمل محتاجة تكرار</h2>' + weak.map(l => '<div class="fl-item"><span class="enl">' + esc(l.en) + '</span>' + U.acts(l.en, { sm: true, who: R.me, mic: true }) + '</div>').join('') + '</div>';
    return h + '<div class="row wrap"><button type="button" class="btn pri" data-rp="start">مثّل تاني</button><button type="button" class="btn" data-rp="again">بدّل الدور</button><a class="btn" href="#lesson-' + R.n + '-prac">التمارين</a></div>';
  }

  function runHTML() {
    const lines = dlg(R.n).lines, end = R.turn === 'end', last = end ? lines.length - 1 : R.i;
    let h = '<div class="dlg">' + lines.slice(0, last + 1).map((l, k) => bubble(l, k)).join('') + '</div>';
    if (end) return h + endHTML();
    const l = lines[R.i];
    if (R.turn === 'me') h += turnHTML(l);
    else if (R.turn === 'paused') h += '<div class="card stack rp-turn"><div class="muted">الصوت اتوقف.</div><div class="row wrap"><button type="button" class="btn pri" data-rp="resume">كمّل</button></div></div>';
    else h += '<div class="rp-wait"><span class="ms-dot"></span><b class="en">' + esc(l.who) + '</b> بتتكلم…</div>';
    return h + '<div class="row"><button type="button" class="btn sm" data-rp="stop">إنهاء التمثيل</button></div>';
  }

  const body = () => (R.phase === 'idle' ? setupHTML() : runHTML());
  P.pane = function (n) {
    if (!R || R.n !== n) R = fresh(n);
    const d = dlg(n);
    return '<div class="scene"><b class="en">' + esc(d.titleEn) + '</b><br>' + fmt(d.sceneAr) + '</div><div id="rp" class="stack">' + body() + '</div>';
  };
  function paint(scroll) {
    const box = D.getElementById('rp'); if (!box || !R) return;
    box.innerHTML = body();
    const t = box.querySelector('.rp-turn') || box.querySelector('.bub.active') || box.querySelector('.rcard');
    if (scroll && t) t.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
  }

  /* ---------- the run ---------- */
  function start() {
    token++; TTS.stopAll(); if (mic()) mic().stop();
    Object.assign(R, { phase: 'run', i: 0, turn: '', log: [], revealed: false, listening: false, res: null, err: null });
    advance(true);
  }
  function stop() {
    token++; TTS.stopAll(); if (mic()) mic().stop();
    Object.assign(R, { phase: 'idle', turn: '', listening: false, res: null, err: null, revealed: false });
    paint(false);
  }
  async function advance(scroll) {
    const my = token, lines = dlg(R.n).lines;
    while (R.i < lines.length) {
      const l = lines[R.i];
      if (l.who === R.me) { R.turn = 'me'; R.revealed = false; R.res = null; R.err = null; paint(true); return; }
      R.turn = 'them'; paint(true);
      const r = await TTS.speak(l.en, { who: l.who });
      if (my !== token) return;
      if (r === 'stopped') { R.turn = 'paused'; paint(false); return; }
      if (r === 'error' || r === 'nosupport') { if (!R.warned) { R.warned = true; toast('الصوت مش شغال — افتح تبويب «الصوت»'); } await sleep(1400); }
      else await sleep(350);
      if (my !== token) return;
      R.i++;
    }
    R.turn = 'end';
    if (R.log.filter(x => x.r !== 'skip').length * 2 >= mine()) Store.rpDone(R.n);       // counts as "acted it out" only if at least half of your lines were said
    paint(true);
  }
  function next(r, s) {
    R.log.push({ i: R.i, r: r, s: s, h: R.mode === 'hide' && R.revealed });
    R.i++; R.res = null; R.err = null; R.revealed = false; R.listening = false;
    advance(true);
  }
  async function doMic() {
    const M = mic(); if (!M || R.listening) return;
    const my = token, l = dlg(R.n).lines[R.i];
    R.listening = true; R.res = null; R.err = null; paint(false);
    const r = await M.listen({});
    if (my !== token || !R.listening) return;
    R.listening = false;
    if (!r.ok) { if (r.err !== 'aborted') R.err = r.err; paint(false); return; }
    const sc = M.score(l.en, r.alts);
    R.res = sc; paint(false);
    if (sc.verdict === 'good') setTimeout(() => { if (my === token && R.res === sc) next('good', sc.score); }, 1100);
  }

  /* ---------- events ---------- */
  W.addEventListener('hashchange', () => { token++; if (mic()) mic().stop(); R = null; });   // registered before the router's listener
  D.addEventListener('click', e => {
    const t = e.target.closest('[data-rp]');
    if (!t || !R) return;
    const a = t.dataset.rp;
    if (a === 'me') { R.me = t.dataset.v; paint(false); }
    else if (a === 'mode') { R.mode = t.dataset.v; Store.setSetting('rpMode', R.mode); paint(false); }
    else if (a === 'start') start();
    else if (a === 'again') stop();
    else if (a === 'stop') stop();
    else if (a === 'resume') { R.turn = ''; advance(true); }
    else if (a === 'reveal') { R.revealed = true; paint(false); }
    else if (a === 'mic') doMic();
    else if (a === 'cancel') { if (mic()) mic().stop(); R.listening = false; paint(false); }
    else if (a === 'said') { const sc = R.res; next(sc ? sc.verdict : 'self', sc ? sc.score : undefined); }
    else if (a === 'skip') next('skip');
  });
})(window);
