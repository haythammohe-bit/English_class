/* Warehouse English — router, events, glue */
(function (W) {
  'use strict';
  const D = document, TTS = W.TTS, Store = W.Store, V = W.V;
  const esc = W.BK.esc;
  const $ = s => D.querySelector(s);
  const view = $('#view'), topEl = $('#top'), navEl = $('#nav'), toastEl = $('#toast');
  const reduce = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SAMPLE = 'Hello, welcome to the Nile Logistics warehouse.';

  /* ---------- errors visible on screen (helps remote debugging) ---------- */
  function showErr(msg) {
    let e = $('#err');
    if (!e) { e = D.createElement('div'); e.id = 'err'; e.addEventListener('click', () => e.remove()); D.body.appendChild(e); }
    e.textContent = 'Error: ' + msg;
  }
  W.addEventListener('error', ev => showErr((ev.message || 'error') + ' @' + String(ev.filename || '').split('/').pop() + ':' + ev.lineno));
  W.addEventListener('unhandledrejection', ev => showErr(String(ev.reason && ev.reason.message || ev.reason)));

  /* ---------- toast ---------- */
  let tt = 0;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('on');
    clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove('on'), 3200);
  }

  /* ---------- settings ---------- */
  function applySettings() {
    const s = Store.settings();
    TTS.configure({ voiceURI: s.voiceURI, rate: s.rate, slow: s.slow });
    TTS.userWords = Store.words();
    view.classList.toggle('hide-ar', !s.showAr);
  }

  /* ---------- chrome (top bar, bottom nav) ---------- */
  const NAV = [['home', 'الدروس', V.icons.home], ['progress', 'التقدم', V.icons.chart], ['cards', 'بطاقات', V.icons.cards], ['glossary', 'القاموس', V.icons.list], ['voice', 'الصوت', V.icons.vol]];
  function setNav(active) {
    navEl.innerHTML = '<div class="in">' + NAV.map(n => '<a href="#' + n[0] + '"' + (n[0] === active ? ' aria-current="page"' : '') + '>' + n[2] + '<span>' + n[1] + '</span></a>').join('') + '</div>';
  }
  function setTop(o) {
    topEl.innerHTML = (o.back ? '<a class="ibtn" href="' + o.back + '" aria-label="رجوع">' + V.icons.right + '</a>' : '') +
      '<div class="ttl">' + esc(o.title) + (o.sub ? '<small class="' + (/^[\x00-\x7F]+$/.test(o.sub) ? 'enr' : '') + '">' + esc(o.sub) + '</small>' : '') + '</div>';
  }

  /* ---------- router ---------- */
  function render() {
    const h = (location.hash || '').replace(/^#/, '') || 'home';
    let m, out = '', r;
    D.title = 'إنجليزي المخازن';
    if ((m = h.match(/^lesson-(\d{1,2})(?:-([a-z]+))?$/)) && (r = V.lesson(+m[1], m[2] || 'over'))) {
      out = r.html; setTop({ title: r.title, sub: r.sub, back: '#home' }); setNav('home');
      Store.markVisited(+m[1]); Store.setLast(+m[1], r.tab);
      D.title = 'الدرس ' + m[1] + ' · إنجليزي المخازن';
    } else if ((r = V.cards && V.cards(h))) {
      out = r.html; setTop({ title: r.title, sub: r.sub, back: r.back }); setNav('cards');
      D.title = r.title + ' · إنجليزي المخازن';
    } else if (h === 'glossary') {
      out = V.glossary(); setTop({ title: 'القاموس', sub: 'كل كلمات الكورس مع النطق' }); setNav('glossary');
    } else if (h === 'voice') {
      out = V.voice(); setTop({ title: 'الصوت', sub: 'جرّب النطق واضبطه' }); setNav('voice');
    } else if (h === 'progress') {
      out = V.progress(); setTop({ title: 'تقدمك', sub: 'Progress' }); setNav('progress');
    } else if (h === 'audit') {
      out = V.audit(); setTop({ title: 'اختصارات وأرقام', sub: 'ازاي بتتقرا', back: '#voice' }); setNav('voice');
    } else if (h === 'selftest') {
      out = V.selftest(); setTop({ title: 'فحص التمارين', sub: 'Self test', back: '#voice' }); setNav('voice');
    } else {
      out = V.home(); setTop({ title: 'إنجليزي المخازن', sub: 'Warehouse English' }); setNav('home');
    }
    view.innerHTML = out;
    applySettings();
    // the lesson tab bar scrolls sideways: keep the open tab in sight
    const at = view.querySelector('.tab[aria-current="page"]');
    if (at && at.scrollIntoView) { try { at.scrollIntoView({ inline: 'center', block: 'nearest' }); } catch (e) { /* ignore */ } }
  }
  function route() {
    stopAudio();
    render();
    W.scrollTo(0, 0);
  }
  // re-render in place, keeping scroll position and open sections
  function rerender() {
    const y = W.scrollY, open = Array.from(view.querySelectorAll('details')).map(d => d.open);
    render();
    view.querySelectorAll('details').forEach((d, i) => { if (open[i] != null) d.open = open[i]; });
    W.scrollTo(0, y);
  }

  /* ---------- speaking ---------- */
  let seqBtn = null;
  function clearPlaying() { D.querySelectorAll('.spk.playing').forEach(b => b.classList.remove('playing')); }
  function setPlayLabel(btn, on) {
    if (!btn.dataset.html) btn.dataset.html = btn.innerHTML;
    btn.innerHTML = on ? V.icons.stop + '<span>إيقاف</span>' : btn.dataset.html;
  }
  function stopAudio() {
    if (seqBtn) { const b = seqBtn; seqBtn = null; setPlayLabel(b, false); }
    TTS.stopAll(); clearPlaying();
    D.querySelectorAll('[data-seq].active').forEach(e => e.classList.remove('active'));
  }
  function refreshDiag() { const d = $('#diag'); if (d) d.textContent = V.diagText(); }

  async function speakBtn(btn) {
    if (!TTS.supported) { toast('المتصفح ده مش بيدعم النطق. جرّب Chrome.'); return; }
    if (btn.classList.contains('playing')) { stopAudio(); return; }
    stopAudio();
    if (!TTS.current()) toast('مفيش صوت إنجليزي ظاهر — افتح تبويب «الصوت»');
    btn.classList.add('playing');
    const as = btn.dataset.as;
    const r = await TTS.speak(as || btn.dataset.say, { raw: !!as, slow: btn.dataset.slow === '1', who: btn.dataset.who });
    btn.classList.remove('playing');
    if (r === 'error') toast('الصوت وقف — افتح تبويب «الصوت» وشوف التشخيص');
    refreshDiag();
  }

  async function playAll(btn) {
    if (seqBtn === btn) { stopAudio(); return; }
    stopAudio();
    if (!TTS.supported) { toast('المتصفح ده مش بيدعم النطق. جرّب Chrome.'); return; }
    const pane = btn.closest('.pane') || view;
    const els = Array.from(pane.querySelectorAll('[data-seq]'));
    if (!els.length) return;
    const slow = !!pane.querySelector('[data-seq-slow]:checked');
    const words = pane.dataset.tab === 'words';
    seqBtn = btn; setPlayLabel(btn, true);
    const mine = btn;
    await TTS.sequence(els.map(e => ({ text: e.dataset.st, who: e.dataset.sw })), {
      slow, gap: words ? 700 : 450,
      onItem: i => {
        els.forEach(e => e.classList.remove('active'));
        if (i >= 0) { els[i].classList.add('active'); els[i].scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }); }
      }
    });
    if (seqBtn === mine) { seqBtn = null; setPlayLabel(mine, false); }
    els.forEach(e => e.classList.remove('active'));
    refreshDiag();
  }

  /* ---------- flags + helpers ---------- */
  function doFlag(btn) {
    const text = btn.dataset.flag, cur = TTS.current();
    const on = Store.toggleFlag(text, { voice: cur ? cur.name : '', spoken: TTS.spoken(text), where: (location.hash || '').slice(1) });
    D.querySelectorAll('.flg').forEach(b => { if (b.dataset.flag === text) b.classList.toggle('on', on); });
    toast(on ? 'تم تعليم الكلمة' : 'تم إلغاء العلامة');
    if (((location.hash || '').slice(1)) === 'voice') rerender();
  }
  function flagsText() {
    return Store.flags().map(f => f.text + '   →   ' + (f.spoken || '') + '   [' + (f.voice || '') + ']').join('\n');
  }
  async function copyText(text) {
    try { if (W.navigator.clipboard && W.navigator.clipboard.writeText) { await W.navigator.clipboard.writeText(text); return true; } } catch (e) { /* fall through */ }
    try {
      const ta = D.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      D.body.appendChild(ta); ta.select(); const ok = D.execCommand('copy'); ta.remove(); return !!ok;
    } catch (e) { return false; }
  }
  function showCopyBox(text) {
    const old = $('#copybox'); if (old) old.remove();
    const ta = D.createElement('textarea');
    ta.id = 'copybox'; ta.className = 'inp'; ta.readOnly = true; ta.rows = 6; ta.value = text; ta.style.minHeight = '120px'; ta.style.padding = '10px';
    const card = $('[data-act="copyflags"]').closest('.card'); card.appendChild(ta); ta.focus(); ta.select();
  }

  async function doAct(btn) {
    const a = btn.dataset.act;
    if (a === 'reload') { TTS.reload(); toast('تم تحديث قائمة الأصوات'); setTimeout(rerender, 150); }
    else if (a === 'copyflags') {
      const t = flagsText();
      if (await copyText(t)) toast('تم نسخ القائمة'); else { toast('انسخ النص من المربع'); showCopyBox(t); }
    } else if (a === 'clearflags') { Store.clearFlags(); rerender(); }
    else if (a === 'fixsave') {
      const w = ($('#fixWord').value || '').trim(), r = ($('#fixSay').value || '').trim();
      if (!w || !r) { toast('اكتب الكلمة والنطق الصح'); return; }
      Store.setWord(w, r); TTS.userWords = Store.words(); rerender();
      TTS.speak(w, {});
    } else if (a === 'fixdel') { Store.setWord(btn.dataset.word, ''); TTS.userWords = Store.words(); rerender(); }
    else if (a === 'resetall') {
      Store.reset(); applySettings(); toast('تم مسح بيانات التطبيق');
      if (!location.hash || location.hash === '#home') route(); else location.hash = 'home';
    }
  }

  /* ---------- events ---------- */
  D.addEventListener('click', e => {
    const t = e.target.closest('[data-flag],[data-playall],[data-act],[data-say]');
    if (!t) return;
    if (t.hasAttribute('data-flag')) doFlag(t);
    else if (t.hasAttribute('data-playall')) playAll(t);
    else if (t.hasAttribute('data-act')) doAct(t);
    else speakBtn(t);
  });

  D.addEventListener('change', e => {
    const t = e.target;
    if (t.id === 'voiceSel') {
      Store.setSetting('voiceURI', t.value); applySettings(); rerender();
      TTS.speak(SAMPLE, {}); toast('تم تغيير الصوت');
    } else if (t.hasAttribute && t.hasAttribute('data-rate')) {
      const k = t.dataset.rate, v = parseFloat(t.value);
      Store.setSetting(k, v); applySettings();
      TTS.speak(SAMPLE, { slow: k === 'slow' }); refreshDiag();
    } else if (t.hasAttribute && t.hasAttribute('data-toggle-ar')) {
      Store.setSetting('showAr', t.checked); applySettings();
      D.querySelectorAll('[data-toggle-ar]').forEach(c => { c.checked = t.checked; });
    }
  });
  D.addEventListener('input', e => {
    const t = e.target;
    if (t.id === 'q') {
      const q = t.value.trim().toLowerCase();
      let n = 0;
      view.querySelectorAll('.vcard[data-q]').forEach(c => { const hit = !q || c.dataset.q.indexOf(q) >= 0; c.hidden = !hit; if (hit) n++; });
      const c = $('#gcount'); if (c) c.textContent = n + ' كلمة';
    } else if (t.hasAttribute && t.hasAttribute('data-rate')) {
      const o = t.parentNode.querySelector('output'); if (o) o.textContent = parseFloat(t.value).toFixed(2) + '×';
    }
  });

  /* ---------- voices arriving late ---------- */
  TTS.onChange(() => {
    applySettings();
    const h = (location.hash || '').slice(1) || 'home';
    if (h === 'voice') { if (!D.activeElement || D.activeElement === D.body) rerender(); else refreshDiag(); }
    else if (h === 'home') { const s = $('[data-voice-status]'); if (s) s.innerHTML = V.voiceStatus(); }
  });

  D.addEventListener('visibilitychange', () => { if (D.hidden) stopAudio(); });
  W.addEventListener('pagehide', () => TTS.stopAll());
  W.addEventListener('hashchange', route);

  /* ---------- go ---------- */
  applySettings();
  route();
  W.WE = { route, rerender, toast, stopAudio, applySettings, copyText };
})(window);
