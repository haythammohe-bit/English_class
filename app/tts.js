/* Warehouse English app — text-to-speech engine + "spoken form" normaliser.
   Uses the device's own voices (Web Speech API). No server, no keys. */
(function (W) {
  'use strict';
  const T = (W.TTS = W.TTS || {});
  const synth = W.speechSynthesis;
  T.supported = !!(synth && W.SpeechSynthesisUtterance);

  /* ------------------------------------------------------------------ *
   * 1. Spoken-form normaliser
   * ------------------------------------------------------------------ */
  // letter names written as plain words so every engine reads them the same way
  const LET = { A: 'ay', B: 'bee', C: 'see', D: 'dee', E: 'ee', F: 'eff', G: 'jee', H: 'aitch', I: 'eye', J: 'jay', K: 'kay', L: 'el', M: 'em', N: 'en', O: 'oh', P: 'pee', Q: 'cue', R: 'ar', S: 'ess', T: 'tee', U: 'you', V: 'vee', W: 'double you', X: 'ex', Y: 'why', Z: 'zee' };
  const DIG = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  T.LETTERS = LET;
  const spell = s => s.toUpperCase().split('').map(c => LET[c] || c).join(' ');
  const digits = s => s.split('').map(c => (DIG[+c] != null ? DIG[+c] : c)).join(' ');
  const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function numWords(n) {          // 22000 → "twenty two thousand"
    if (n < 20) return ONES[n];
    if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '');
    if (n < 1000) return ONES[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + numWords(n % 100) : '');
    if (n < 1e6) return numWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + numWords(n % 1000) : '');
    if (n < 1e9) return numWords(Math.floor(n / 1e6)) + ' million' + (n % 1e6 ? ' ' + numWords(n % 1e6) : '');
    return String(n);
  }
  T.numWords = numWords;
  const YEAR_CTX = /(?:\b(?:in|since|year|during|until|by|from|of)\s+|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+)$/i;

  // exact words / acronyms that need a decision (case-sensitive keys, matched as whole words)
  const WORDS = {
    FIFO: 'fy foe', FEFO: 'fee foe', LIFO: 'ly foe', ASAP: 'ay ess ay pee', OK: 'okay', ID: 'eye dee', IDs: 'eye dees',
    PO: 'pee oh', POs: "pee oh's", SKU: 'ess kay you', SKUs: "ess kay you's", KPI: 'kay pee eye', KPIs: "kay pee eye's",
    WMS: 'double you em ess', ERP: 'ee ar pee', ETA: 'ee tee ay', ETD: 'ee tee dee', FYI: 'eff why eye', CEO: 'see ee oh',
    PDF: 'pee dee eff', HR: 'aitch ar', IT: 'eye tee', QR: 'cue ar', GPS: 'jee pee ess', USD: 'U S dollars', EGP: 'Egyptian pounds',
    AM: 'ay em', PM: 'pee em', 'a.m.': 'ay em', 'p.m.': 'pee em', 'a.m': 'ay em', 'p.m': 'pee em', EOD: 'ee oh dee', cc: 'see see', bcc: 'bee see see', 'B/L': 'bee el', '3PL': 'three pee el', '24/7': 'twenty four seven',
    D365: 'D three sixty five', '365': 'three sixty five',
    'Mr.': 'Mister', 'Mrs.': 'Missus', 'Ms.': 'Miz', 'Dr.': 'Doctor', 'vs.': 'versus', 'vs': 'versus', 'e.g.': 'for example', 'i.e.': 'that is', 'etc.': 'et cetera',
    putaway: 'put away', Putaway: 'Put away', backorder: 'back order', Backorder: 'Back order', pickup: 'pick up', Pickup: 'Pick up',
    Khaled: 'Kahled', Youssef: 'Yousef', Hassan: 'Hassan', Nile: 'Nile', apologise: 'apologize'
  };
  // user-editable overrides (kept in localStorage by the app): {word: 'respelling'}
  T.userWords = {};

  // ordinary English words that may appear in CAPITALS (read as words, not spelled)
  const CAPS_WORDS = new Set(['NOT', 'STOP', 'OPEN', 'EXIT', 'NEW', 'OLD', 'FREE', 'HOT', 'TOP', 'BIG', 'YES', 'NO', 'DO', 'GO', 'UP', 'ON', 'OFF', 'IN', 'OUT', 'IF', 'SO', 'OR', 'AND', 'THE', 'TO', 'OF', 'AT', 'BY', 'MY', 'IS', 'WE', 'ALL', 'ONE', 'TWO', 'NOW', 'BOX', 'CARE', 'THIS', 'SIDE', 'KEEP', 'DRY', 'WAIT', 'SLOW', 'LOAD', 'FULL', 'EMPTY', 'WORK', 'EACH', 'ONLY', 'MUST', 'HOLD', 'PUSH', 'PULL', 'EAST', 'WEST', 'NORTH', 'SOUTH']);
  const UNITS = { kg: ['kilogram', 'kilograms'], g: ['gram', 'grams'], cm: ['centimeter', 'centimeters'], mm: ['millimeter', 'millimeters'], km: ['kilometer', 'kilometers'], pcs: ['piece', 'pieces'], hrs: ['hour', 'hours'], hr: ['hour', 'hours'], mins: ['minute', 'minutes'], min: ['minute', 'minutes'], sec: ['second', 'seconds'], pc: ['piece', 'pieces'], L: ['liter', 'liters'] };

  function tokenDecision(tok) {
    const u = T.userWords || {};
    if (Object.prototype.hasOwnProperty.call(u, tok)) return u[tok];
    if (Object.prototype.hasOwnProperty.call(WORDS, tok)) return WORDS[tok];
    return null;
  }

  // "A-03-02-B", "PO-12345", "SKU-1042" … → spoken part by part
  function codeToken(tok) {
    return tok.split('-').map(p => {
      if (/^\d+$/.test(p)) return digits(p);
      if (/^[A-Za-z]{1,3}$/.test(p) && p === p.toUpperCase()) return spell(p);
      const m = p.match(/^([A-Za-z]+)(\d+)$/);
      if (m) return (m[1] === m[1].toUpperCase() && m[1].length <= 4 ? spell(m[1]) : m[1]) + ' ' + digits(m[2]);
      return p;
    }).join(', ');
  }

  T.spoken = function (raw) {
    let s = String(raw == null ? '' : raw);
    // drop Arabic text (an English voice can't read it) and Arabic punctuation
    s = s.replace(/\p{Script=Arabic}+/gu, ' ').replace(/[،؟؛]/g, ' ');
    s = s.replace(/[‘’]/g, "'").replace(/[“”«»]/g, '"').replace(/…/g, '...').replace(/\*\*/g, '');
    s = s.replace(/\b24\/7\b/g, 'twenty four seven');
    // times: 9:30 AM · 14:00
    s = s.replace(/\b(\d{1,2}):(\d{2})\s*(AM|PM|am|pm|a\.m\.|p\.m\.)?/g, (m, h, mm, ap) => {
      const mer = ap ? ' ' + spell(ap.replace(/\./g, '')) : '';
      if (mm === '00') return (+h) + (ap ? mer : " o'clock");
      return (+h) + ' ' + (mm[0] === '0' ? 'oh ' + (+mm) : +mm) + mer;
    });
    // numbers with thousands separators: 22,000 → twenty two thousand (never read the "000" as digits)
    s = s.replace(/\b\d{1,3}(?:,\d{3})+(?:\.\d+)?\b/g, m => {
      const p = m.split('.'), w = numWords(parseInt(p[0].replace(/,/g, ''), 10));
      return p[1] ? w + ' point ' + digits(p[1]) : w;
    });
    // percentages, money
    s = s.replace(/(\d+(?:\.\d+)?)\s*%/g, '$1 percent');
    s = s.replace(/\$\s?(\d[\d,]*(?:\.\d+)?)/g, '$1 dollars');
    // alphanumeric codes with hyphens (must contain a digit)
    s = s.replace(/\b[A-Za-z0-9]+(?:-[A-Za-z0-9]+)+\b/g, m => (/\d/.test(m) && /[A-Za-z]/.test(m) ? codeToken(m) : m));
    // numeric ranges 16-20 / 16–20
    s = s.replace(/(\d)\s*[–—-]\s*(\d)/g, '$1 to $2');
    // unit abbreviations after a number
    s = s.replace(/(\d[\d,.]*)\s?(kg|g|cm|mm|km|pcs|pc|hrs|hr|mins|min|sec|L)\b/g, (m, n, u) => n + ' ' + UNITS[u][+n.replace(/,/g, '') === 1 ? 0 : 1]);
    // phrases with a "/" that are not alternatives
    s = s.replace(/\b([A-Za-z]{1,2})\/([A-Za-z]{1,2})\b/g, (m) => tokenDecision(m) || (/^[A-Z]{1,2}\/[A-Z]{1,2}$/.test(m) ? spell(m.replace('/', '')) : m.replace('/', ' ')));
    // whole-word decisions & acronyms
    s = s.replace(/[A-Za-z0-9][A-Za-z0-9.'’]*[A-Za-z0-9.]|[A-Za-z0-9]/g, (tok, off, whole) => {
      let d = tokenDecision(tok);
      if (d != null) return d;
      // a sentence-final period sticks to the token ("4521.", "WMS.") — judge the word without it
      const core = tok.replace(/\.+$/, ''), tail = tok.slice(core.length);
      if (tail) { d = tokenDecision(core); if (d != null) return d + tail; }
      // generic: ALL-CAPS 2-5 letters -> letter by letter (plural s allowed), unless it is a shouted ordinary word
      let m = core.match(/^([A-Z]{2,5})(s?)$/);
      if (m) return (CAPS_WORDS.has(m[1]) && !m[2] ? core.toLowerCase() : spell(m[1]) + (m[2] ? "'s" : '')) + tail;
      // letters+digits (D365, B2B) -> letters then digits
      m = core.match(/^([A-Z]{1,4})(\d{1,4})$/);
      if (m) return spell(m[1]) + ' ' + (m[2].length >= 3 ? digits(m[2]) : m[2]) + tail;
      // identifiers -> digit by digit: leading zero, 5+ digits, and 4 digits unless it is clearly a year
      if (/^\d{5,}$/.test(core) || /^0\d+$/.test(core)) return digits(core) + tail;
      if (/^\d{4}$/.test(core)) {
        const n = +core;
        if (n >= 1900 && n <= 2100 && YEAR_CTX.test(whole.slice(Math.max(0, off - 14), off))) return tok;
        return digits(core) + tail;
      }
      return tok;
    });
    // symbols
    s = s.replace(/&/g, ' and ').replace(/\+/g, ' plus ').replace(/#\s?(\d)/g, 'number $1').replace(/@/g, ' at ');
    s = s.replace(/\s\/\s|\//g, ', ');
    s = s.replace(/_{2,}/g, ' blank ').replace(/\.{2,}/g, ', ');
    s = s.replace(/[()[\]{}"]/g, ' ').replace(/\s[-–—]\s/g, ', ');
    s = s.replace(/\s+([,.;:!?])/g, '$1').replace(/,\s*,/g, ',').replace(/\s{2,}/g, ' ').trim();
    return s;
  };

  /* ------------------------------------------------------------------ *
   * 2. Voices
   * ------------------------------------------------------------------ */
  let voices = [], listeners = [];
  const st = { voiceURI: 'auto', rate: 0.9, slow: 0.6, pitch: 1 };
  T.state = st;
  T.onChange = fn => listeners.push(fn);
  const emit = () => listeners.forEach(f => { try { f(); } catch (e) { /* ignore */ } });
  const normLang = l => String(l || '').replace('_', '-');
  const isEn = v => /^en(-|$)/i.test(normLang(v.lang));

  const FEMALE = /\b(aria|jenny|zira|hazel|susan|samantha|karen|moira|tessa|fiona|victoria|allison|ava|joanna|kendra|kimberly|salli|emma|amy|olivia|libby|sonia|natasha|clara|female)\b/i;
  const MALE = /\b(guy|david|mark|daniel|george|ryan|james|richard|alex|tom|fred|ralph|brian|matthew|joey|justin|liam|thomas|male)\b/i;
  T.gender = v => {
    const u = (v.voiceURI || '') + ' ' + (v.name || '');     // Android voice ids look like en-us-x-sfg#female_1-local
    if (/female/i.test(u) || FEMALE.test(v.name || '')) return 'f';
    if (/(^|[^a-z])male/i.test(u) || MALE.test(v.name || '')) return 'm';
    return '';
  };

  function score(v) {
    const lang = normLang(v.lang).toLowerCase(), n = v.name || '';
    let sc = 0;
    if (lang === 'en-us') sc += 30; else if (lang === 'en-gb') sc += 26; else if (lang === 'en-au' || lang === 'en-ca') sc += 12; else if (lang === 'en-in') sc += 8; else sc += 2;
    if (/natural|neural|online/i.test(n)) sc += 60;
    if (/google/i.test(n)) sc += 22;
    if (/enhanced|premium/i.test(n)) sc += 18;
    if (/compact|espeak|robot|novelty|whisper|bubbles|bad news|good news|bells|boing|cellos|organ|zarvox|trinoids|wobble|albert|jester/i.test(n)) sc -= 60;
    if (v.default) sc += 4;
    if (v.localService) sc += 3;
    return sc;
  }

  function load() {
    if (!T.supported) return;
    let list = [];
    try { list = synth.getVoices() || []; } catch (e) { list = []; }
    if (list.length === voices.length && list.every((v, i) => v === voices[i])) return;
    voices = list.slice();
    emit();
  }
  T.allVoices = () => voices.slice();
  T.enVoices = () => voices.filter(isEn).sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name));
  T.best = () => T.enVoices()[0] || null;
  T.current = () => {
    const list = T.enVoices();
    if (st.voiceURI && st.voiceURI !== 'auto') {
      const f = list.find(v => v.voiceURI === st.voiceURI);
      if (f) return f;
    }
    return list[0] || null;
  };
  T.score = score;

  // second voice with the opposite gender (when the engine has several English voices)
  function altVoice(base, wantGender) {
    if (!base) return null;
    const list = T.enVoices().filter(v => normLang(v.lang).slice(0, 5).toLowerCase() === normLang(base.lang).slice(0, 5).toLowerCase());
    const g = list.filter(v => T.gender(v) === wantGender).sort((a, b) => score(b) - score(a))[0];
    return g || null;
  }

  // character → voice character (pitch/rate tweaks; gendered voice when available)
  const CAST = {
    Ahmed: { g: 'm', pitch: 0.95 }, Omar: { g: 'm', pitch: 0.82 }, Khaled: { g: 'm', pitch: 1.0 }, Hassan: { g: 'm', pitch: 0.88 },
    Youssef: { g: 'm', pitch: 1.05 }, 'Mr. Brown': { g: 'm', pitch: 0.78 }, Peter: { g: 'm', pitch: 0.84 },
    Mona: { g: 'f', pitch: 1.12 }, Sara: { g: 'f', pitch: 1.2 }, Laura: { g: 'f', pitch: 1.3 }
  };
  T.CAST = CAST;

  T.configure = o => {
    if (!o) return;
    ['voiceURI', 'rate', 'slow', 'pitch'].forEach(k => { if (o[k] != null) st[k] = o[k]; });
  };

  /* ------------------------------------------------------------------ *
   * 3. Speaking (single utterance + sequences)
   * ------------------------------------------------------------------ */
  const keep = [];          // keep references (Chrome/Android GC bug: onend never fires otherwise)
  let token = 0, curDone = null, curTimer = null, log = [];
  T.log = () => log.slice();
  const note = m => { log.push(new Date().toLocaleTimeString('en-GB') + '  ' + m); if (log.length > 40) log.shift(); };
  T.speaking = false;

  T.stop = () => {
    token++;
    if (curTimer) { clearTimeout(curTimer); curTimer = null; }
    if (T.supported) { try { synth.cancel(); } catch (e) { /* ignore */ } }
    T.speaking = false;
    if (curDone) { const d = curDone; curDone = null; d('stopped'); }
  };

  // speak(text, {slow, who, rate}) → Promise<'end'|'stopped'|'error'|'nosupport'>
  T.speak = (text, o) => {
    o = o || {};
    return new Promise(resolve => {
      if (!T.supported) { resolve('nosupport'); return; }
      const say = o.raw ? String(text) : T.spoken(text);
      if (!say) { resolve('end'); return; }
      T.stop();
      const my = ++token;
      const v0 = T.current();
      let v = v0, pitch = st.pitch;
      const c = o.who && CAST[o.who];
      if (c) {
        const alt = altVoice(v0, c.g);
        if (alt) { v = alt; pitch = 1 + (c.pitch - 1) * 0.35; } else pitch = c.pitch;
      }
      const rate = o.rate || (o.slow ? st.slow : st.rate);
      let finished = false;
      const done = r => {
        if (finished) return;
        finished = true;
        if (curTimer) { clearTimeout(curTimer); curTimer = null; }
        if (token === my) T.speaking = false;
        if (curDone === done) curDone = null;
        const i = keep.indexOf(u); if (i >= 0) keep.splice(i, 1);
        resolve(r);
      };
      const u = new W.SpeechSynthesisUtterance(say);
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-US';
      u.rate = rate; u.pitch = Math.max(0.5, Math.min(2, pitch)); u.volume = 1;
      u.onstart = () => { note('start  ' + (v ? v.name : 'default') + '  ×' + rate + '  "' + say.slice(0, 60) + '"'); if (o.onstart) o.onstart(); };
      u.onend = () => { note('end'); done('end'); };
      u.onerror = e => { note('error ' + (e && e.error)); done(e && (e.error === 'interrupted' || e.error === 'canceled') ? 'stopped' : 'error'); };
      keep.push(u);
      curDone = done;
      T.speaking = true;
      // cancel() followed immediately by speak() is dropped by some engines → wait a beat
      setTimeout(() => {
        if (token !== my) return;
        try { synth.resume(); } catch (e) { /* ignore */ }
        try { synth.speak(u); } catch (e) { done('error'); return; }
        // watchdog: some engines never fire onend
        const est = Math.max(3000, say.length * 130 / Math.max(0.3, rate) + 3000);
        curTimer = setTimeout(() => { note('watchdog'); done('end'); }, est);
      }, 70);
    });
  };

  // play a list of {text, who, slow} one after another; onItem(i) is called before each (and -1 at the end)
  T._run = 0;
  T.sequence = async (items, o) => {
    o = o || {};
    const run = ++T._run;       // a newer sequence (or stopAll) invalidates this one
    for (let i = 0; i < items.length; i++) {
      if (T._run !== run) return 'stopped';
      if (o.onItem) o.onItem(i);
      const r = await T.speak(items[i].text, { who: items[i].who, slow: items[i].slow || o.slow });
      if (T._run !== run || r === 'stopped') return 'stopped';
      if (r === 'error' || r === 'nosupport') { if (o.onItem) o.onItem(-1); return r; }
      await new Promise(res => setTimeout(res, o.gap == null ? 350 : o.gap));
    }
    if (T._run === run && o.onItem) o.onItem(-1);
    return 'end';
  };
  // stop whatever is playing, including a running sequence
  const stopOne = T.stop;
  T.stopAll = () => { T._run++; stopOne(); };

  /* ------------------------------------------------------------------ *
   * 4. Boot
   * ------------------------------------------------------------------ */
  if (T.supported) {
    load();
    try { synth.addEventListener('voiceschanged', load); } catch (e) { synth.onvoiceschanged = load; }
    // some browsers (Android Chrome) fill the list late without firing the event
    let tries = 0;
    const iv = setInterval(() => { load(); if (++tries > 24 || (voices.length && tries > 6)) clearInterval(iv); }, 250);
  }
  T.reload = load;
})(window);
