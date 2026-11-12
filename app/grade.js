/* Warehouse English — grading engine (pure logic, no DOM) */
(function (W) {
  'use strict';
  const G = (W.Grade = {});
  const NL = 30;

  G.SECS = [['mcq', 'اختيار من متعدد'], ['fill', 'أكمل الجملة'], ['trans', 'ترجمة'], ['build', 'تركيب جمل']];
  G.SEC_TAB = { mcq: ['words', 'الكلمات'], fill: ['grammar', 'القاعدة'], trans: ['sent', 'الجمل'], build: ['grammar', 'القاعدة'] };
  G.STATUS = { new: 'لم يبدأ', studying: 'قيد الدراسة', passed: 'اجتاز', review: 'يحتاج مراجعة' };
  G.STATUS_ORDER = ['new', 'studying', 'passed', 'review'];
  G.passMark = total => Math.ceil((total || 20) * 0.8);
  G.isPass = a => !!a && a.s >= G.passMark(a.tot || 20);
  // pure status rule: latest quiz attempt decides; otherwise "studying" once the lesson was opened / practised
  G.statusOf = (visited, exCount, att) => {
    if (att && att.length) return G.isPass(att[att.length - 1]) ? 'passed' : 'review';
    return visited || exCount > 0 ? 'studying' : 'new';
  };

  const AR = /\p{Script=Arabic}/u;
  G.hasAr = s => AR.test(String(s == null ? '' : s));

  /* ---------- text normalisation (case, punctuation, contractions) ---------- */
  const CONTR = [
    [/\bwon't\b/g, 'will not'], [/\bcan't\b/g, 'can not'], [/\bcannot\b/g, 'can not'], [/\bshan't\b/g, 'shall not'], [/\bain't\b/g, 'is not'],
    [/\b([a-z]+)n't\b/g, '$1 not'],
    [/\bi'm\b/g, 'i am'],
    [/\b(you|we|they)'re\b/g, '$1 are'],
    [/\b(i|you|we|they|would|could|should|must)'ve\b/g, '$1 have'],
    [/\b(i|you|he|she|it|we|they|that|there)'ll\b/g, '$1 will'],
    [/\b(i|you|he|she|we|they)'d\b/g, '$1 would'],
    [/\b(he|she|it|that|there|here|what|who|how|where|when|why)'s\b/g, '$1 is'],
    [/\blet's\b/g, 'let us']
  ];
  G.norm = function (s) {
    s = String(s == null ? '' : s).toLowerCase().replace(/[‘’ʼ`´]/g, "'");
    for (let i = 0; i < CONTR.length; i++) s = s.replace(CONTR[i][0], CONTR[i][1]);
    return s.replace(/[^a-z0-9\p{Script=Arabic}]+/gu, ' ').trim();
  };

  const lev = (a, b) => {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    let prev = new Array(b.length + 1), cur = new Array(b.length + 1), i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur[0] = i;
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1));
      }
      const t = prev; prev = cur; cur = t;
    }
    return prev[b.length];
  };
  G.lev = lev;

  /* ---------- model answers: "Main text. (أو: Alternative.) (أي إجابة قريبة تمام)" ---------- */
  G.parseModel = function (raw) {
    let s = String(raw == null ? '' : raw).trim();
    s = s.replace(/^\s*مثال\s*[:：]\s*/, '');
    const alts = [], notes = [];
    s = s.replace(/\s*\(([^)]*)\)\s*/g, (m, inner) => {
      if (!AR.test(inner)) return m;                      // Latin-only brackets stay, e.g. "(short pick)"
      notes.push(inner.trim());
      const mm = inner.match(/^\s*أو\s*[:：]?\s*(.+?)\s*$/);
      // only complete sentences count as accepted alternatives ("I'm going to send ..." and "by EOD" are fragments)
      if (mm && !/\.\.\.|…/.test(mm[1]) && /^[A-Z]/.test(mm[1]) && /[A-Za-z]/.test(mm[1])) alts.push(mm[1]);
      return ' ';
    });
    return { main: s.replace(/\s+([.,?!؟،])/g, '$1').replace(/\s+/g, ' ').trim(), alts, notes };
  };
  G.mainOf = raw => G.parseModel(raw).main;
  G.accepted = raw => { const p = G.parseModel(raw); return [p.main].concat(p.alts).filter(Boolean); };
  G.replyText = q => String(q || '').replace(/^\s*Reply to:\s*/i, '').replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
  G.fillFull = (q, ans) => String(q || '').replace(/_{2,}/, ans);

  // typed answer vs. model → {ok, close}
  G.check = function (answer, rawModel) {
    const a = G.norm(answer);
    if (!a) return { ok: false, empty: true };
    const acc = G.accepted(rawModel);
    let best = 1e9, len = 1;
    for (let i = 0; i < acc.length; i++) {
      const n = G.norm(acc[i]);
      if (n === a) return { ok: true };
      const d = lev(a, n);
      if (d < best) { best = d; len = Math.max(a.length, n.length); }
    }
    return { ok: false, close: best <= Math.max(1, Math.min(3, Math.floor(len * 0.1))), dist: best };
  };

  G.wordDiff = function (given, model) {
    const g = G.norm(given).split(' ').filter(Boolean), e = G.norm(G.mainOf(model)).split(' ').filter(Boolean);
    const cnt = a => { const m = {}; a.forEach(w => { m[w] = (m[w] || 0) + 1; }); return m; };
    const gm = cnt(g), em = cnt(e), missing = [], extra = [];
    Object.keys(em).forEach(w => { for (let i = (gm[w] || 0); i < em[w]; i++) missing.push(w); });
    Object.keys(gm).forEach(w => { for (let i = (em[w] || 0); i < gm[w]; i++) extra.push(w); });
    return { missing, extra };
  };

  /* ---------- deterministic randomness (options stay the same between visits) ---------- */
  const mulberry = a => () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const shuffle = (arr, r) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };

  /* ---------- Arabic multiple-choice options for "English → Arabic" questions ---------- */
  G.cleanAr = s => String(s == null ? '' : s).replace(/\s*\([^)]*\p{Script=Arabic}[^)]*\)\s*/gu, ' ').replace(/\s+([.,?!؟،])/g, '$1').replace(/\s+/g, ' ').trim();
  const bigrams = s => {
    s = String(s).replace(/[^\p{L}\p{N}]+/gu, '');
    const o = new Set();
    for (let i = 0; i < s.length - 1; i++) o.add(s.substr(i, 2));
    return o;
  };
  const jacc = (a, b) => {
    if (!a.size || !b.size) return 0;
    let i = 0; a.forEach(x => { if (b.has(x)) i++; });
    return i / (a.size + b.size - i);
  };
  let poolAll = null;
  const arPool = () => {
    if (poolAll) return poolAll;
    const out = [];
    for (let n = 1; n <= NL; n++) {
      const L = W.LESSONS[n]; if (!L) continue;
      L.sentences.forEach(s => { const ar = G.cleanAr(s.ar); if (ar && AR.test(ar)) out.push({ n, ar, en: s.en }); });
    }
    return (poolAll = out);
  };
  G.arOptions = function (n, item, idx) {
    const correct = G.cleanAr(item.answer);
    const qEn = G.norm(item.q), cb = bigrams(correct), r = mulberry(n * 1009 + idx * 97 + 7);
    const seen = new Set([correct]), picked = [];
    const fits = (c, strict) => {
      if (seen.has(c.ar)) return false;
      const ce = G.norm(c.en);
      if (ce && qEn && (ce.indexOf(qEn) >= 0 || qEn.indexOf(ce) >= 0)) return false;   // same sentence in disguise
      if (jacc(bigrams(c.ar), cb) >= (strict ? 0.34 : 0.5)) return false;                // near-synonym risk
      const ratio = c.ar.length / Math.max(1, correct.length);
      return strict ? ratio >= 0.5 && ratio <= 2 : true;
    };
    const all = arPool();
    const same = shuffle(all.filter(c => c.n === n), r), other = shuffle(all.filter(c => c.n !== n), r);
    const take = (list, max, strict) => {
      for (let i = 0; i < list.length && picked.length < max; i++) {
        if (fits(list[i], strict)) { picked.push(list[i].ar); seen.add(list[i].ar); }
      }
    };
    take(same, 1, true); take(other, 3, true);
    if (picked.length < 3) take(same, 3, false);
    if (picked.length < 3) take(other, 3, false);
    const opts = shuffle(picked.concat([correct]), r);
    return { opts, ans: opts.indexOf(correct) };
  };

  /* ---------- lesson quiz: 5 + 5 + 5 + 5 ---------- */
  const qcache = {};
  G.buildQuiz = function (n) {
    if (qcache[n]) return qcache[n];
    const L = W.LESSONS[n], q = L.quiz, items = []; let id = 0;
    q.mcq.forEach(x => items.push({ id: id++, sec: 'mcq', kind: 'mcq', q: x.q, opts: x.options.slice(), ans: x.answer, model: x.options[x.answer] }));
    q.fill.forEach(x => items.push({ id: id++, sec: 'fill', kind: 'fill', q: x.q, model: x.answer }));
    q.trans.forEach((x, i) => {
      if (x.dir === 'en2ar') {
        const o = G.arOptions(n, x, i);
        items.push({ id: id++, sec: 'trans', kind: 'en2ar', q: x.q, opts: o.opts, ans: o.ans, model: x.answer });
      } else items.push({ id: id++, sec: 'trans', kind: 'ar2en', q: x.q, model: x.answer, self: true });
    });
    q.build.forEach(x => {
      if (x.type === 'order') items.push({ id: id++, sec: 'build', kind: 'order', q: x.q, tiles: x.q.split(/\s*\/\s*/), model: x.answer, self: true });
      else items.push({ id: id++, sec: 'build', kind: x.type === 'write' ? 'write' : 'reply', q: x.q, model: x.answer, self: true });
    });
    return (qcache[n] = items);
  };

  // ans: number (choice) | string (typed) | array of tile indexes (order); mark: 1 = learner accepted own answer
  G.gradeItem = function (it, ans, mark) {
    const r = { ok: false, auto: false, answered: false, close: false, given: '', marked: false };
    if (it.kind === 'mcq' || it.kind === 'en2ar') {
      r.answered = typeof ans === 'number';
      r.ok = r.auto = r.answered && ans === it.ans;
      r.given = r.answered ? it.opts[ans] : '';
      return r;
    }
    let s = '';
    if (it.kind === 'order') {
      const idx = Array.isArray(ans) ? ans : [];
      s = idx.map(k => it.tiles[k]).join(' ');
      r.answered = idx.length > 0 && idx.length === it.tiles.length;
    } else {
      s = typeof ans === 'string' ? ans.trim() : '';
      r.answered = !!s;
    }
    r.given = s;
    if (r.answered) { const c = G.check(s, it.model); r.auto = r.ok = !!c.ok; r.close = !!c.close; }
    if (it.self && r.answered && !r.auto && mark === 1) { r.ok = true; r.marked = true; }
    return r;
  };

  G.scoreQuiz = function (items, a, m) {
    a = a || {}; m = m || {};
    const per = items.map(it => G.gradeItem(it, a[it.id], m[it.id]));
    const sec = {};
    G.SECS.forEach(s => { sec[s[0]] = { ok: 0, of: 0 }; });
    let score = 0, answered = 0;
    per.forEach((r, i) => {
      const s = sec[items[i].sec]; s.of++;
      if (r.ok) { s.ok++; score++; }
      if (r.answered) answered++;
    });
    return { per, sec, score, answered, total: items.length, pass: score >= G.passMark(items.length) };
  };

  /* ---------- practice sections (the "التمارين" tab) ---------- */
  const pcache = {};
  G.practice = function (n) {
    if (pcache[n]) return pcache[n];
    const L = W.LESSONS[n];
    return (pcache[n] = {
      build: L.exBuild.map(x => ({ kind: 'build', tiles: x.words.slice(), model: x.answer })),
      comp: L.exComplete.map(x => ({ kind: 'comp', q: x.q, opts: x.options.slice(), ans: x.options.indexOf(x.answer), model: x.answer })),
      write: L.exWrite.map(x => ({ kind: 'write', ar: x.promptAr, hint: x.hint, model: x.model })),
      tr: L.exTranslate.map(x => ({ kind: 'tr', ar: x.ar, model: x.en })),
      speak: L.speak.map(x => ({ kind: 'speak', en: x.promptEn, ar: x.promptAr, model: x.model }))
    });
  };

  /* ---------- vocabulary tied to a missed item (clear signals only) ---------- */
  G.weakWordsFor = function (n, it) {
    const L = W.LESSONS[n]; if (!L) return [];
    const map = {}; L.vocab.forEach(v => { map[G.norm(v.en)] = v.en; });
    const out = [];
    if (it.kind === 'mcq') {
      const m = String(it.q).match(/['‘’“”]([^'‘’“”]+)['‘’“”]/);
      if (m && map[G.norm(m[1])]) out.push(map[G.norm(m[1])]);
    } else if (it.kind === 'fill') {
      const k = G.norm(it.model);
      if (map[k]) out.push(map[k]);
    }
    return out;
  };
})(window);
