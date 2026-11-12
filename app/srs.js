/* Warehouse English — spaced repetition for the word cards (pure logic, no DOM)
   A card is a vocabulary word. Its state: {b: box 0..7, d: day it is due, r: reviews, l: lapses, t: last day}.
   Words you forget come back soon; words you know are pushed further away (1, 2, 4, 7, 14, 30, 60 days). */
(function (W) {
  'use strict';
  const S = (W.SRS = {});
  const NL = 30;
  const INT = [0, 1, 2, 4, 7, 14, 30, 60];       // days until the next review, by box (0 = still being learned)
  S.INT = INT;
  S.MAXBOX = INT.length - 1;

  const key = en => String(en == null ? '' : en).toLowerCase().replace(/\s+/g, ' ').trim();
  S.key = key;

  // local calendar day number, so "tomorrow" starts at the learner's own midnight
  S.today = t => { const d = t == null ? new Date() : new Date(t); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000); };

  // state after answering. st = null for a card never seen before. g: 'again' | 'good' | 'easy'
  S.next = (st, g, today) => {
    const isNew = !st, b0 = st ? st.b : 0;
    let b, l = st ? (st.l || 0) : 0;
    if (g === 'again') { b = 0; if (!isNew && b0 > 0) l++; }
    else if (g === 'easy') b = Math.min(S.MAXBOX, isNew ? 3 : b0 + 2);
    else b = Math.min(S.MAXBOX, b0 + 1);
    return { b: b, d: today + INT[b], r: (st ? (st.r || 0) : 0) + 1, l: l, t: today };
  };

  const WHEN = { 0: 'كمان شوية', 1: 'بكرة', 2: 'بعد يومين', 4: 'بعد 4 أيام', 7: 'بعد أسبوع', 14: 'بعد أسبوعين', 30: 'بعد شهر', 60: 'بعد شهرين' };
  S.when = d => (WHEN[d] != null ? WHEN[d] : d <= 0 ? WHEN[0] : 'بعد ' + d + ' يوم');
  // what the three answer buttons will do for this card
  S.preview = (st, today) => ({ again: S.next(st, 'again', today).d - today, good: S.next(st, 'good', today).d - today, easy: S.next(st, 'easy', today).d - today });

  /* ---------- the deck: every vocabulary word once (first lesson that teaches it) ---------- */
  let all = null, byId = null;
  S.all = () => {
    if (all) return all;
    all = []; byId = {};
    for (let n = 1; n <= NL; n++) {
      const L = W.LESSONS[n]; if (!L || !L.vocab) continue;
      L.vocab.forEach((v, i) => { const k = key(v.en); if (k && !byId[k]) { byId[k] = { id: k, n: n, i: i, v: v }; all.push(byId[k]); } });
    }
    return all;
  };
  S.byId = id => { S.all(); return byId[id] || null; };
  // the words of one lesson (a word taught in two lessons shares one schedule)
  S.ofLesson = n => { const L = W.LESSONS[n]; return L && L.vocab ? L.vocab.map((v, i) => ({ id: key(v.en), n: n, i: i, v: v })) : []; };

  // split a pool into cards due today and never-seen cards. weak = {id: 1}: words missed in quizzes come first
  S.queue = (pool, state, o) => {
    o = o || {};
    const today = o.today, weak = o.weak || {}, due = [], fresh = [], seen = {};
    pool.forEach(c => {
      if (seen[c.id]) return; seen[c.id] = 1;
      const st = state[c.id];
      if (!st) fresh.push(c); else if (st.d <= today) due.push(c);
    });
    const w = c => (weak[c.id] ? 0 : 1);
    due.sort((a, b) => w(a) - w(b) || state[a.id].d - state[b.id].d || state[a.id].b - state[b.id].b || a.n - b.n || a.i - b.i);
    fresh.sort((a, b) => w(a) - w(b) || a.n - b.n || a.i - b.i);
    return { due: due, fresh: fresh };
  };

  S.stats = (state, today) => {
    const cards = S.all(); let learned = 0, mature = 0, due = 0, fresh = 0;
    cards.forEach(c => {
      const st = state[c.id];
      if (!st) { fresh++; return; }
      if (st.b >= 1) learned++;
      if (st.b >= 4) mature++;
      if (st.d <= today) due++;
    });
    return { total: cards.length, learned: learned, mature: mature, due: due, fresh: fresh };
  };

  S.lessonStats = (n, state, today) => {
    const cards = S.ofLesson(n); let learned = 0, due = 0, fresh = 0;
    cards.forEach(c => {
      const st = state[c.id];
      if (!st) { fresh++; return; }
      if (st.b >= 1) learned++;
      if (st.d <= today) due++;
    });
    return { total: cards.length, learned: learned, due: due, fresh: fresh };
  };
})(window);
