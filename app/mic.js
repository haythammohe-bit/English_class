/* Warehouse English — "repeat after me": speech recognition + a word-by-word comparison with the target text.
   Needs: Chrome (Android), HTTPS, internet and the microphone permission. The score is an estimate, not a judge. */
(function (W) {
  'use strict';
  const D = document, G = W.Grade, TTS = W.TTS, V = W.V;
  const I = V.icons;
  const esc = W.BK.esc;
  const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
  const M = (W.Mic = {});
  M.supported = !!SR;

  /* ---------- scoring (pure) ---------- */
  const pre = s => String(s == null ? '' : s).replace(/(\d),(?=\d{3}\b)/g, '$1');                       // 4,500 → 4500
  const toks = s => {                                                                                    // normalised words, digits spelled out
    const o = [];
    G.norm(pre(s)).split(' ').filter(Boolean).forEach(t => (/^\d{1,9}$/.test(t) ? TTS.numWords(+t).split(' ') : [t]).forEach(x => o.push(x)));
    return o;
  };
  const merge = a => {                                                                                   // "p o" → "po" (spelled-out acronyms)
    const o = []; let run = [];
    const flush = () => { if (run.length > 1) o.push(run.join('')); else run.forEach(x => o.push(x)); run = []; };
    a.forEach(t => { if (t.length === 1 && /[a-z]/.test(t)) run.push(t); else { flush(); o.push(t); } });
    flush();
    return o;
  };
  // 2 = same word, 1 = very close (one letter off in a longer word), 0 = different
  const same = (a, b) => (a === b ? 2 : (a.length >= 4 && b.length >= 4 && G.lev(a, b) <= (a.length >= 8 ? 2 : 1) ? 1 : 0));
  function align(T, H) {                                                                                 // best in-order matching → status per target word
    const n = T.length, m = H.length, dp = [];
    for (let i = 0; i <= n; i++) dp.push(new Array(m + 1).fill(0));
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        const s = same(T[i - 1], H[j - 1]);
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1], s ? dp[i - 1][j - 1] + s : 0);
      }
    }
    const st = new Array(n).fill(0);
    let i = n, j = m;
    while (i > 0 && j > 0) {
      const s = same(T[i - 1], H[j - 1]);
      if (s && dp[i][j] === dp[i - 1][j - 1] + s) { st[i - 1] = s; i--; j--; }
      else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
      else j--;
    }
    return st;
  }
  // heard: array of {t, c} or strings (the recogniser's alternatives). Returns the best one.
  M.score = function (target, heard) {
    const words = String(target == null ? '' : target).split(/\s+/).filter(w => G.norm(pre(w)));
    const groups = words.map(w => merge(toks(w)));
    const T = [], gid = [];
    groups.forEach((g, k) => g.forEach(t => { T.push(t); gid.push(k); }));
    let best = null;
    (heard || []).forEach(h => {
      const text = h && h.t != null ? h.t : String(h == null ? '' : h), st = align(T, merge(toks(text)));
      const score = T.length ? st.reduce((a, b) => a + b, 0) / (2 * T.length) : 0;
      if (!best || score > best.score) best = { score: score, st: st, heard: text };
    });
    const gs = groups.map(() => 2);
    if (!best) best = { score: 0, st: T.map(() => 0), heard: '' };
    best.st.forEach((s, i) => { gs[gid[i]] = Math.min(gs[gid[i]], s); });
    return { score: best.score, verdict: best.score >= 0.85 ? 'good' : best.score >= 0.5 ? 'near' : 'miss', heard: best.heard, words: words, gs: gs };
  };
  M.VERDICT = { good: 'ممتاز', near: 'قريب', miss: 'حاول تاني' };
  M.ERR = {
    'not-allowed': 'الميكروفون مش مسموح. اضغط على أيقونة القفل جنب عنوان الصفحة واسمح بالميكروفون وجرّب تاني. (جوه المعاينة المايك بيتمنع، وبيشتغل لما التطبيق يتفتح من رابطه المباشر على الإنترنت.)',
    'service-not-allowed': 'الصفحة دي مش مسموح لها بالميكروفون. افتح التطبيق من رابطه المباشر على الإنترنت (https) وجرّب.',
    'no-speech': 'ما سمعتش صوت. قرّب من الميكروفون وجرّب تاني.',
    'audio-capture': 'مفيش ميكروفون شغّال على الجهاز.',
    network: 'التعرّف على الصوت محتاج إنترنت. اتأكد من الاتصال وجرّب تاني.',
    'language-not-supported': 'اللغة الإنجليزية مش مدعومة في خدمة الصوت على جهازك.',
    unsupported: 'المتصفح ده مش بيدعم الميكروفون. استخدم Chrome على أندرويد.',
    busy: 'الميكروفون مشغول. استنى ثانية وجرّب تاني.'
  };
  M.errText = e => M.ERR[e] || 'حصلت مشكلة في الميكروفون (' + e + '). جرّب تاني.';

  /* ---------- listening ---------- */
  let rec = null;
  M.stop = () => { if (rec) { const r = rec; rec = null; try { r.abort(); } catch (e) { /* ignore */ } } };
  // one utterance → Promise<{ok:true, alts:[{t,c}]} | {ok:false, err}>
  M.listen = function (o) {
    o = o || {};
    return new Promise(resolve => {
      if (!SR) { resolve({ ok: false, err: 'unsupported' }); return; }
      M.stop(); TTS.stopAll();
      let r, done = false, timer = 0, got = null;
      const fin = res => { if (done) return; done = true; clearTimeout(timer); if (rec === r) rec = null; resolve(res); };
      try { r = new SR(); } catch (e) { fin({ ok: false, err: 'unsupported' }); return; }
      rec = r;
      r.lang = o.lang || 'en-US'; r.interimResults = false; r.maxAlternatives = 5; r.continuous = false;
      r.onresult = ev => {
        const res = ev.results[ev.results.length - 1], alts = [];
        for (let i = 0; i < res.length; i++) alts.push({ t: res[i].transcript, c: res[i].confidence });
        got = alts;
      };
      r.onerror = ev => fin({ ok: false, err: (ev && ev.error) || 'error' });
      r.onend = () => fin(got ? { ok: true, alts: got } : { ok: false, err: 'no-speech' });
      timer = setTimeout(() => { try { r.stop(); } catch (e) { /* ignore */ } }, o.ms || 9000);
      try { r.start(); } catch (e) { fin({ ok: false, err: 'busy' }); }
    });
  };

  /* ---------- result block (also used by the role-play screen) ---------- */
  M.resultHTML = function (sc) {
    const cls = sc.verdict === 'good' ? 'ok' : sc.verdict === 'near' ? 'near' : 'miss';
    return '<div class="ms-verdict ' + cls + '"><span class="ms-dot"></span>' + M.VERDICT[sc.verdict] + '<small class="en">' + Math.round(sc.score * 100) + '%</small></div>' +
      '<div class="ms-words">' + sc.words.map((w, k) => '<span class="mw ' + (sc.gs[k] === 2 ? 'ok' : sc.gs[k] === 1 ? 'near' : 'miss') + '">' + esc(w) + '</span>').join('') + '</div>' +
      '<div class="ms-heard">اللي سمعه التطبيق: <span class="enl">' + (sc.heard ? esc(sc.heard) : '—') + '</span></div>';
  };

  /* ---------- the bottom sheet ---------- */
  let sheet = null, token = 0, cur = null;
  function ensure() {
    if (sheet) return sheet;
    sheet = D.createElement('div'); sheet.id = 'micsheet'; sheet.className = 'micsheet'; sheet.hidden = true;
    sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-label', 'كرّر ورايا');
    sheet.innerHTML = '<div class="ms-top"><b>قول الجملة بصوتك</b><button type="button" class="ibtn sm" data-mic-x aria-label="إغلاق">✕</button></div>' +
      '<div class="ms-target enl"></div><div class="ms-body" aria-live="polite"></div><div class="ms-acts"></div>';
    D.body.appendChild(sheet);
    return sheet;
  }
  const q = s => sheet.querySelector(s);
  const btn = (act, label, cls) => '<button type="button" class="btn sm' + (cls ? ' ' + cls : '') + '" data-mic-' + act + '>' + label + '</button>';

  function setState(kind, data) {
    q('.ms-target').textContent = cur.target;
    if (kind === 'listen') {
      q('.ms-body').innerHTML = '<div class="ms-listen"><span class="ms-ic">' + I.mic + '</span><div><b>بسمعك…</b><div class="muted small">قول الجملة دلوقتي بصوت واضح</div></div></div>';
      q('.ms-acts').innerHTML = btn('x', 'إلغاء');
    } else if (kind === 'res') {
      q('.ms-body').innerHTML = M.resultHTML(data);
      q('.ms-acts').innerHTML = btn('again', I.mic + ' جرّب تاني', 'pri') + btn('hear', I.vol + ' اسمعها') + btn('x', 'تمام');
    } else {
      q('.ms-body').innerHTML = '<div class="warnbox">' + esc(M.errText(data)) + '</div>';
      q('.ms-acts').innerHTML = btn('again', 'جرّب تاني', 'pri') + btn('x', 'إغلاق');
    }
  }
  async function run() {
    const my = ++token;
    setState('listen');
    const r = await M.listen({});
    if (my !== token || !cur) return;
    if (!r.ok) { if (r.err !== 'aborted') setState('err', r.err); return; }
    const sc = M.score(cur.target, r.alts);
    setState('res', sc);
    D.dispatchEvent(new CustomEvent('micresult', { detail: { target: cur.target, score: sc.score, verdict: sc.verdict, ctx: cur.ctx } }));
  }
  M.open = function (target, ctx) { ensure(); cur = { target: String(target), ctx: ctx || null, who: ctx && ctx.dataset ? ctx.dataset.who : '' }; sheet.hidden = false; return run(); };
  M.close = function () { token++; M.stop(); if (sheet) sheet.hidden = true; cur = null; };

  D.addEventListener('click', e => {
    const t = e.target.closest('[data-mic],[data-mic-x],[data-mic-again],[data-mic-hear]');
    if (!t) return;
    if (t.hasAttribute('data-mic')) M.open(t.dataset.mic, t);
    else if (t.hasAttribute('data-mic-x')) M.close();
    else if (!cur) return;
    else if (t.hasAttribute('data-mic-again')) run();
    else TTS.speak(cur.target, { who: cur.who });
  });
  W.addEventListener('hashchange', () => M.close());
})(window);
