/* Warehouse English app — tiny persistent store (localStorage with in-memory fallback) */
(function (W) {
  'use strict';
  const S = (W.Store = {});
  const KEY = 'we.app.v1';
  let mem = {}, raw = null;
  const parse = r => { try { const o = r ? JSON.parse(r) : {}; return o && typeof o === 'object' && !Array.isArray(o) ? o : {}; } catch (e) { return {}; } };
  // Another open copy of the app (second tab, installed app, old tab) may have saved since we last looked.
  // Re-read before every get/set so a stale copy can never overwrite newer progress with old memory.
  // If storage is blocked we simply keep working from memory.
  const sync = () => {
    let r;
    try { r = W.localStorage.getItem(KEY); } catch (e) { return; }
    if (r !== raw) { raw = r; mem = parse(r); }
  };
  const save = () => { try { const s = JSON.stringify(mem); W.localStorage.setItem(KEY, s); raw = s; } catch (e) { /* blocked or full: stay in memory, try again next save */ } };
  sync();

  // real write test (private mode / blocked storage throw here)
  S.persistent = () => { try { const k = KEY + '.t'; W.localStorage.setItem(k, '1'); W.localStorage.removeItem(k); return true; } catch (e) { return false; } };
  S.reset = () => { mem = {}; save(); };
  S.get = (k, d) => { sync(); return mem[k] === undefined ? d : mem[k]; };
  S.set = (k, v) => { sync(); mem[k] = v; save(); };

  const DEF = { voiceURI: 'auto', rate: 0.9, slow: 0.6, showAr: true, newPerDay: 10, cardDir: 'en', autoSpeak: true, rpMode: 'show' };
  S.settings = () => Object.assign({}, DEF, S.get('settings', {}));
  S.setSetting = (k, v) => { const s = S.get('settings', {}); s[k] = v; S.set('settings', s); };

  // last position (continue card) + visited lessons
  S.last = () => S.get('last', null);
  S.setLast = (lesson, tab) => S.set('last', { lesson, tab });
  S.visited = () => S.get('visited', []);
  S.markVisited = n => { const v = S.visited(); if (v.indexOf(n) < 0) { v.push(n); S.set('visited', v); } };

  // "pronunciation sounds wrong" flags
  S.flags = () => S.get('flags', []);
  S.isFlagged = t => S.flags().some(f => f.text === t);
  S.toggleFlag = (t, extra) => {
    let f = S.flags();
    if (f.some(x => x.text === t)) f = f.filter(x => x.text !== t);
    else f.push(Object.assign({ text: t, ts: Date.now() }, extra || {}));
    S.set('flags', f);
    return f.some(x => x.text === t);
  };
  S.clearFlags = () => S.set('flags', []);

  // user pronunciation fixes: {"Khaled": "Kah-led"}
  S.words = () => S.get('words', {});
  S.setWord = (w, r) => { const m = S.words(); if (r) m[w] = r; else delete m[w]; S.set('words', m); };

  /* ---------- practice answers: ex[lesson][kind][i] = {v, ok:1|0, a:1|0, c:1|0} ---------- */
  const EX = () => S.get('ex', {});
  S.exGet = (n, k, i) => { const e = EX()[n]; return (e && e[k] && e[k][i]) || null; };
  S.exSet = (n, k, i, o) => { const e = EX(); const a = (e[n] = e[n] || {}); (a[k] = a[k] || {})[i] = o; S.set('ex', e); };
  S.exDel = (n, k, i) => { const e = EX(); if (e[n] && e[n][k]) { delete e[n][k][i]; S.set('ex', e); } };
  S.exClear = n => { const e = EX(); delete e[n]; S.set('ex', e); };
  S.exAnswered = n => {
    const e = EX()[n]; let c = 0;
    if (e) Object.keys(e).forEach(k => Object.keys(e[k]).forEach(i => { const v = e[k][i]; if (v && (v.ok === 0 || v.ok === 1)) c++; }));
    return c;
  };

  /* ---------- lesson quiz: quiz[lesson] = {att:[{t,s,tot,sec,of,bad}], draft:{ph,a,m}} ---------- */
  S.attempts = n => { const o = S.get('quiz', {})[n]; return (o && o.att) || []; };
  S.quizDraft = n => { const o = S.get('quiz', {})[n]; return (o && o.draft) || null; };
  S.setDraft = (n, d) => {
    const q = S.get('quiz', {}); const o = q[n] || { att: [] };
    if (d) o.draft = d; else delete o.draft;
    q[n] = o; S.set('quiz', q);
  };
  S.addAttempt = (n, a) => {
    const q = S.get('quiz', {}); const o = q[n] || { att: [] };
    o.att = (o.att || []).concat([a]).slice(-12);
    q[n] = o; S.set('quiz', q);
  };
  S.updateLastAttempt = (n, patch) => {
    const q = S.get('quiz', {}); const o = q[n];
    if (!o || !o.att || !o.att.length) return;
    Object.assign(o.att[o.att.length - 1], patch); S.set('quiz', q);
  };

  /* ---------- weak vocabulary: weak[word] = {n, c: misses, ok: hits} ---------- */
  S.weakNote = (en, n, good) => {
    const w = S.get('weak', {}); const e = w[en] || { n: n, c: 0, ok: 0 };
    if (good) e.ok++; else e.c++;
    e.t = Date.now(); w[en] = e; S.set('weak', w);
  };
  S.weakList = () => {
    const w = S.get('weak', {});
    return Object.keys(w).map(k => ({ en: k, n: w[k].n, c: w[k].c, ok: w[k].ok, t: w[k].t })).filter(e => e.c > e.ok)
      .sort((a, b) => (b.c - b.ok) - (a.c - a.ok) || (b.t || 0) - (a.t || 0));
  };

  S.weakHas = en => !!S.get('weak', {})[en];

  /* ---------- flashcards: srs[wordKey] = {b,d,r,l,t}; srsm = {day, nw} (new words started today) ---------- */
  S.srs = () => S.get('srs', {});
  S.srsSet = (id, st) => { const m = S.srs(); m[id] = st; S.set('srs', m); };
  S.srsMeta = today => { const m = S.get('srsm', {}); return m.day === today ? m : { day: today, nw: 0 }; };
  S.srsAddNew = today => { const m = S.srsMeta(today); m.nw++; S.set('srsm', m); };

  /* ---------- role-play: rp[lesson] = {n: times finished, t: last time} ---------- */
  S.rpGet = n => S.get('rp', {})[n] || null;
  S.rpDone = n => { const r = S.get('rp', {}); const e = r[n] || { n: 0 }; e.n++; e.t = Date.now(); r[n] = e; S.set('rp', r); };

  /* ---------- derived: status of a lesson, overall stats ---------- */
  S.status = n => W.Grade.statusOf(S.visited().indexOf(n) >= 0, S.exAnswered(n), S.attempts(n));
  S.stats = () => {
    const c = { new: 0, studying: 0, passed: 0, review: 0 }; let sum = 0, taken = 0;
    for (let n = 1; n <= 30; n++) {
      c[S.status(n)]++;
      const a = S.attempts(n);
      if (a.length) { sum += a[a.length - 1].s; taken++; }
    }
    return { c: c, avg: taken ? sum / taken : null, taken: taken };
  };
  S.resetProgress = () => { sync(); ['visited', 'last', 'ex', 'quiz', 'weak', 'srs', 'srsm', 'rp'].forEach(k => { delete mem[k]; }); save(); };

  /* ---------- backup code (copy / paste) ---------- */
  const b64 = s => { const bytes = new TextEncoder().encode(s); let bin = ''; bytes.forEach(b => { bin += String.fromCharCode(b); }); return W.btoa(bin); };
  const unb64 = t => { const bin = W.atob(t); const bytes = Uint8Array.from(bin, c => c.charCodeAt(0)); return new TextDecoder().decode(bytes); };
  S._b64 = b64; S._unb64 = unb64;
  S.exportCode = () => { sync(); return 'WEB1.' + b64(JSON.stringify(mem)); };
  S.importCode = code => {
    try {
      const m = /^WEB1\.([A-Za-z0-9+\/=]+)$/.exec(String(code || '').replace(/\s+/g, ''));
      if (!m) return 'format';
      const o = JSON.parse(unb64(m[1]));
      if (!o || typeof o !== 'object' || Array.isArray(o)) return 'format';
      mem = o; save(); return 'ok';
    } catch (e) { return 'format'; }
  };
})(window);
