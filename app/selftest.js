/* Warehouse English — in-app self test (route #selftest): checks the grading rules and every lesson's exercise data */
(function (W) {
  'use strict';
  const V = W.V, G = W.Grade, Store = W.Store, LESSONS = W.LESSONS;
  const { esc, fmt } = W.BK;

  // checks the files that make the app installable / offline (fetched from the same place the page was loaded from)
  async function pwaFiles(el) {
    const rows = [], ok = (name, good, detail) => rows.push({ name: name, ok: !!good, detail: detail || '' });
    const get = async u => { const r = await fetch(u, { cache: 'no-store' }); if (!r.ok) throw new Error(u + ' → ' + r.status); return r; };
    const refsOf = html => (html.match(/(?:src|href)="([^"]+)"/g) || []).map(s => s.replace(/^(?:src|href)="/, '').slice(0, -1)).filter(u => !/^(?:https?:|#)/.test(u));
    try {
      const sw = await (await get('sw.js')).text();
      const block = /const CORE = \[([\s\S]*?)\];/.exec(sw), files = block ? (block[1].match(/'([^']+)'/g) || []).map(s => s.slice(1, -1)) : [];
      ok('sw.js: precache list found (' + files.length + ' files)', files.length > 40);
      // run the script once inside a plain worker: a typo in it would silently switch offline mode off
      const werr = await new Promise(res => {
        let w, url = '';
        try { url = URL.createObjectURL(new Blob([sw], { type: 'text/javascript' })); w = new Worker(url); } catch (e) { res('worker not allowed here: ' + String((e && e.message) || e)); return; }
        w.onerror = ev => { if (ev && ev.preventDefault) ev.preventDefault(); w.terminate(); res(String((ev && ev.message) || 'script error')); };
        setTimeout(() => { w.terminate(); res(''); }, 500);
      });
      ok('sw.js: the script parses and starts without errors', !werr, werr);
      const miss = [];
      await Promise.all(files.filter(f => f !== './').map(f => get(f).catch(() => { miss.push(f); })));
      ok('sw.js: every precached file exists', !miss.length, miss.join(', '));
      for (const page of ['index.html', 'book.html']) {
        const refs = refsOf(await (await get(page)).text()), notCached = refs.filter(u => files.indexOf(u) < 0);
        ok(page + ': every local file it loads is precached (works offline)', refs.length > 20 && !notCached.length, notCached.join(', '));
      }
      const man = JSON.parse(await (await get('manifest.json')).text());
      ok('manifest.json: name, start_url, scope, standalone, icons', !!(man.name && man.start_url && man.scope && man.display === 'standalone' && man.icons && man.icons.length >= 2));
      ok('manifest.json: start page is precached', files.indexOf(man.start_url.replace(/^\.\//, '')) >= 0, man.start_url);
      const im = [];
      await Promise.all(man.icons.map(i => get(i.src).catch(() => { im.push(i.src); })));
      ok('manifest.json: icon files exist', !im.length, im.join(', '));
    } catch (e) { ok('file check could not finish', false, String((e && e.message) || e)); }
    if (!el.isConnected) return;
    const bad = rows.filter(x => !x.ok);
    el.innerHTML = '<h2 class="sec">فحص ملفات التثبيت<span class="sc en">' + (rows.length - bad.length) + '/' + rows.length + '</span></h2>' +
      rows.map(x => '<div class="aud-t"><span class="tok">' + (x.ok ? '✓' : '✕') + '</span><div class="t"><span class="cx">' + esc(x.name) + '</span>' + (x.ok ? '' : '<span class="sp">' + esc(x.detail) + '</span>') + '</div></div>').join('');
  }

  V.selftest = function () {
    const out = []; let pass = 0;
    const t = (name, ok, detail) => { out.push({ name: name, ok: !!ok, detail: detail || '' }); if (ok) pass++; };
    const same = (a, b) => G.norm(a) === G.norm(b);
    const sortedWords = s => G.norm(s).split(' ').filter(Boolean).sort().join(' ');

    /* --- text rules --- */
    [["I'm a clerk.", 'I am a clerk'], ["He doesn't work.", 'He does not work.'], ["We can't ship.", 'We cannot ship'], ["They won't come", 'They will not come.'],
      ["She's late", 'She is late'], ["It's OK", 'it is ok'], ['full-time', 'Full time'], ["Let's go", 'Let us go'], ["I’m here", 'I am here']
    ].forEach(p => t('norm: ' + p[0] + ' = ' + p[1], same(p[0], p[1])));
    t('norm: different sentences differ', !same('I am a clerk', 'I am the clerk'));
    t('check: exact', G.check('my name is ahmed', 'My name is Ahmed.').ok);
    t('check: close but wrong', !G.check('My name is Ahmd.', 'My name is Ahmed.').ok && G.check('My name is Ahmd.', 'My name is Ahmed.').close);

    const p1 = G.parseModel("Yes, it is. (أو: No, it isn't.)");
    t('parse: full alternative accepted', p1.main === 'Yes, it is.' && p1.alts.length === 1 && p1.alts[0] === "No, it isn't.", JSON.stringify(p1));
    t('check: alternative accepted', G.check("No it isn't", "Yes, it is. (أو: No, it isn't.)").ok);
    const p2 = G.parseModel('We will finish by the end of the day. (أو: by EOD)');
    t('parse: fragment alternative ignored', p2.main === 'We will finish by the end of the day.' && p2.alts.length === 0, JSON.stringify(p2));
    const p3 = G.parseModel("I will send you the bill of lading today. (أو: I'm going to send ...)");
    t('parse: "..." alternative ignored', p3.alts.length === 0 && p3.main === 'I will send you the bill of lading today.', JSON.stringify(p3));
    t('parse: مثال prefix', G.parseModel('مثال: My name is Ahmed.').main === 'My name is Ahmed.');
    t('parse: Latin brackets kept', G.parseModel('بلّغ عن النقص (short pick) دلوقتي.').main.indexOf('(short pick)') > 0);
    t('parse: note-only brackets', G.parseModel('I am from Cairo. (أي مدينة تمام)').main === 'I am from Cairo.');
    t('cleanAr: brackets removed', G.cleanAr('فيه فرق (أو: عدم تطابق).') === 'فيه فرق.', G.cleanAr('فيه فرق (أو: عدم تطابق).'));
    t('replyText: prefix + note removed', G.replyText('Reply to: The truck will arrive on Thursday. (You want to check.)') === 'The truck will arrive on Thursday.', G.replyText('Reply to: The truck will arrive on Thursday. (You want to check.)'));

    /* --- status rule --- */
    t('status: new', G.statusOf(false, 0, []) === 'new');
    t('status: studying (opened)', G.statusOf(true, 0, []) === 'studying');
    t('status: studying (practised)', G.statusOf(false, 3, []) === 'studying');
    t('status: passed at 16', G.statusOf(true, 0, [{ s: 16, tot: 20 }]) === 'passed');
    t('status: review at 15', G.statusOf(true, 0, [{ s: 15, tot: 20 }]) === 'review');
    t('status: latest attempt decides (pass then fail)', G.statusOf(true, 0, [{ s: 18, tot: 20 }, { s: 12, tot: 20 }]) === 'review');
    t('status: latest attempt decides (fail then pass)', G.statusOf(true, 0, [{ s: 12, tot: 20 }, { s: 17, tot: 20 }]) === 'passed');

    /* --- backup codec --- */
    const sample = JSON.stringify({ a: 'أهلاً', b: [1, 2, 3], c: 'Nile Logistics' });
    t('backup: base64 round trip (Arabic)', Store._unb64(Store._b64(sample)) === sample);

    /* --- store: runs on a clean slate, then puts the learner's own data back --- */
    (function () {
      const KEY = 'we.app.v1', ls = W.localStorage; let snap = null;
      try { snap = ls.getItem(KEY); } catch (e) { t('store: browser storage available', false, 'blocked — progress would be memory-only'); return; }
      const att = s => ({ t: Date.now(), s: s, tot: 20, sec: [1, 1, 1, 1], of: [5, 5, 5, 5], bad: [] });
      try {
        Store.reset();
        Store.set('visited', [3]); Store.markVisited(1);
        t('store: visited + status new/studying', Store.get('visited', []).join() === '3,1' && Store.status(1) === 'studying' && Store.status(2) === 'new');
        Store.addAttempt(1, att(18));
        t('store: attempt 18/20 -> passed', Store.status(1) === 'passed' && Store.stats().c.passed === 1);
        Store.updateLastAttempt(1, { s: 12 });
        t('store: re-marked 12/20 -> review, average 12', Store.status(1) === 'review' && Store.stats().c.review === 1 && Store.stats().avg === 12);
        for (let i = 0; i < 14; i++) Store.addAttempt(2, att(10 + i % 3));
        t('store: keeps only the last 12 attempts', Store.attempts(2).length === 12);
        const o = JSON.parse(ls.getItem(KEY)); o.__other = 7; ls.setItem(KEY, JSON.stringify(o));   // a second open copy saves behind our back
        Store.set('__mine', 1);
        const o2 = JSON.parse(ls.getItem(KEY));
        t('store: a stale copy never overwrites newer saved data', o2.__other === 7 && o2.__mine === 1 && o2.visited.length === 2);
        const code = Store.exportCode();
        Store.set('__after', 1);
        t('backup: import restores the exported state (even with line breaks)', Store.importCode(code.replace(/(.{24})/g, '$1\n ')) === 'ok' && Store.get('__after') === undefined && Store.status(1) === 'review');
        t('backup: bad code rejected, data untouched', Store.importCode('WEB1.%%%') === 'format' && Store.importCode('hello') === 'format' && Store.status(1) === 'review');
        Store.setSetting('rate', 0.8);
        Store.resetProgress();
        t('store: reset progress keeps settings', Store.status(1) === 'new' && Store.attempts(2).length === 0 && Store.settings().rate === 0.8);
      } finally {
        try { if (snap === null) ls.removeItem(KEY); else ls.setItem(KEY, snap); } catch (e) { /* ignore */ }
      }
      t('store: browser write test', Store.persistent());
    })();

    /* --- all 30 lessons --- */
    const bad = []; let nQuiz = 0, nSelf = 0;
    const orderIdx = it => {
      const used = {}, idx = [];
      G.mainOf(it.model).split(' ').forEach(w => {
        const k = it.tiles.findIndex((x, i) => !used[i] && G.norm(x) === G.norm(w));
        if (k >= 0) { used[k] = 1; idx.push(k); }
      });
      return idx;
    };
    for (let n = 1; n <= 30; n++) {
      const L = LESSONS[n];
      if (!L) { bad.push('L' + n + ' missing'); continue; }
      const q = G.buildQuiz(n), cnt = { mcq: 0, fill: 0, trans: 0, build: 0 };
      q.forEach(i => { cnt[i.sec]++; });
      if (q.length !== 20 || cnt.mcq !== 5 || cnt.fill !== 5 || cnt.trans !== 5 || cnt.build !== 5) bad.push('L' + n + ' quiz shape ' + JSON.stringify(cnt));
      q.forEach(it => {
        nQuiz++;
        if (it.kind === 'mcq' && !(it.opts.length >= 3 && it.ans >= 0 && it.ans < it.opts.length)) bad.push('L' + n + ' mcq#' + it.id);
        if (it.kind === 'en2ar' && !(it.opts.length === 4 && new Set(it.opts).size === 4 && it.ans >= 0 && it.opts[it.ans] === G.cleanAr(it.model))) bad.push('L' + n + ' en2ar#' + it.id + ' opts=' + it.opts.length);
        if (it.kind === 'fill' && (!G.norm(it.model) || !/_{2,}/.test(it.q))) bad.push('L' + n + ' fill#' + it.id);
        if (it.kind === 'order') {
          if (it.tiles.map(G.norm).join(' ').split(' ').filter(Boolean).sort().join(' ') !== sortedWords(it.model)) bad.push('L' + n + ' order tiles#' + it.id);
          const idx = orderIdx(it);
          if (!G.gradeItem(it, idx, 0).ok) bad.push('L' + n + ' order perfect#' + it.id);
        }
        if (it.self) {
          nSelf++;
          if (it.kind !== 'order') {
            if (!/[A-Za-z]/.test(G.mainOf(it.model)) || !G.check(G.mainOf(it.model), it.model).ok) bad.push('L' + n + ' typed model#' + it.id);
          }
        }
      });
      const pr = G.practice(n);
      pr.build.forEach((b, i) => { if (b.tiles.map(G.norm).join(' ').split(' ').filter(Boolean).sort().join(' ') !== sortedWords(b.model)) bad.push('L' + n + ' build#' + i); });
      pr.comp.forEach((c, i) => { if (c.ans < 0) bad.push('L' + n + ' comp#' + i); });
      pr.tr.forEach((x, i) => { if (!G.check(G.mainOf(x.model), x.model).ok) bad.push('L' + n + ' tr#' + i); });
      if (!pr.write.length || !pr.speak.length) bad.push('L' + n + ' write/speak empty');
    }
    t('data: 30 lessons × (20 quiz items, options, tiles, models) — ' + nQuiz + ' items, ' + nSelf + ' self-graded', !bad.length, bad.slice(0, 14).join(' | '));

    /* --- scoring --- */
    const items = G.buildQuiz(1), perfect = {};
    items.forEach(it => { perfect[it.id] = (it.kind === 'mcq' || it.kind === 'en2ar') ? it.ans : it.kind === 'order' ? orderIdx(it) : G.mainOf(it.model); });
    const r1 = G.scoreQuiz(items, perfect, {});
    t('score: perfect answers = 20/20 and pass', r1.score === 20 && r1.pass && r1.answered === 20, r1.score + '/' + r1.total);
    const r0 = G.scoreQuiz(items, {}, {});
    t('score: no answers = 0, fail', r0.score === 0 && !r0.pass && r0.answered === 0);
    const wrongOne = Object.assign({}, perfect, { 0: (items[0].ans + 1) % items[0].opts.length });
    t('score: one wrong choice = 19', G.scoreQuiz(items, wrongOne, {}).score === 19);
    const arIdx = items.findIndex(x => x.kind === 'ar2en');
    const typedWrong = Object.assign({}, perfect); typedWrong[arIdx] = 'zzz qqq';
    t('score: wrong typed answer = 19', G.scoreQuiz(items, typedWrong, {}).score === 19);
    const m = {}; m[arIdx] = 1;
    t('score: learner accepts own typed answer = 20', G.scoreQuiz(items, typedWrong, m).score === 20);
    const m2 = {}; m2[0] = 1;
    t('score: accept ignored for multiple choice', G.scoreQuiz(items, wrongOne, m2).score === 19);
    const h15 = Object.assign({}, perfect); for (let i = 0; i < 5; i++) h15[i] = (items[i].ans + 1) % items[i].opts.length;
    t('score: 15/20 fails, 16/20 passes', !G.scoreQuiz(items, h15, {}).pass && G.scoreQuiz(items, Object.assign({}, h15, { 0: items[0].ans }), {}).pass);

    /* --- the saved-draft screens (take / pass / review) render correctly; the learner's data is put back afterwards --- */
    const SAMPLE = {};
    (function () {
      const KEY = 'we.app.v1'; let ls, snap = null;
      try { ls = W.localStorage; snap = ls.getItem(KEY); } catch (e) { return; }
      try {
        Store.reset();
        const P = W.Practice, cards = h => (h.match(/class="qit qz"/g) || []).length;
        Store.setDraft(1, { ph: 'result', a: perfect, m: {} });
        const hp = P.quiz(1); SAMPLE.pass = hp;
        t('screen: perfect run -> pass card + retake button', hp.indexOf('rcard ok') > 0 && hp.indexOf('اجتزت الاختبار') > 0 && hp.indexOf('qretake') > 0 && hp.indexOf('أعد الاختبار') > 0);
        Store.setDraft(1, { ph: 'result', a: {}, m: {} });
        const hf = P.quiz(1); SAMPLE.fail = hf;
        t('screen: empty run -> review card, 20 wrong listed', hf.indexOf('rcard bad') > 0 && hf.indexOf('20 غلط') > 0 && hf.indexOf('جرّب تاني') > 0);
        Store.setDraft(1, { ph: 'take', a: {}, m: {} });
        const ht = P.quiz(1);
        t('screen: take view -> 20 cards + sticky submit bar + tabs marker', cards(ht) === 20 && ht.indexOf('data-qbar') > 0 && ht.indexOf('qtake') > 0);
        Store.setDraft(1, null);
        t('screen: no draft -> intro with start button', P.quiz(1).indexOf('qstart') > 0);
        Store.addAttempt(1, { t: Date.now(), s: 18, tot: 20, sec: [5, 5, 4, 4], of: [5, 5, 5, 5], bad: [] });
        const lh = V.lesson(1, 'over').html;
        t('screen: lesson header shows pass status + last score', lh.indexOf('st-passed') > 0 && lh.indexOf('18/20') > 0);
        Store.addAttempt(2, { t: Date.now(), s: 16, tot: 20, sec: [4, 4, 4, 4], of: [5, 5, 5, 5], bad: [0, 1, 2, 3] });
        Store.addAttempt(3, { t: Date.now(), s: 11, tot: 20, sec: [2, 3, 3, 3], of: [5, 5, 5, 5], bad: [] });
        Store.markVisited(4); Store.weakNote('colleague', 3, false);
        const sc = Store.stats().c, sp = V.progress(), sh = V.home();
        SAMPLE.progress = sp; SAMPLE.home = sh;
        t('screen: stats 2 passed / 1 review / 1 studying / 26 new', sc.passed === 2 && sc.review === 1 && sc.studying === 1 && sc.new === 26, JSON.stringify(sc));
        t('screen: progress + home show the counts, weak word and badges', sp.indexOf('اجتزت 2 من 30') > 0 && sp.indexOf('colleague') > 0 && sp.indexOf('data-st="passed"') > 0 && sh.indexOf('اجتزت 2 من 30') > 0 && sh.indexOf('class="tdone"') > 0 && sh.indexOf('tdone review') > 0);
      } finally { try { if (snap === null) ls.removeItem(KEY); else ls.setItem(KEY, snap); } catch (e) { /* ignore */ } }
    })();

    /* --- phase 3: word cards (spaced repetition) --- */
    const guard = (name, fn) => { try { fn(); } catch (e) { t(name + ' — threw an error', false, String((e && e.message) || e)); } };
    guard('srs', () => {
      const S = W.SRS, td = 20000;
      const a = S.next(null, 'good', td), b = S.next(null, 'easy', td), c = S.next(null, 'again', td);
      t('srs: new word, good = box 1, due tomorrow', a.b === 1 && a.d === td + 1 && a.r === 1 && a.l === 0, JSON.stringify(a));
      t('srs: new word, easy = box 3, due in 4 days', b.b === 3 && b.d === td + 4, JSON.stringify(b));
      t('srs: new word, again = box 0, due today, not a lapse', c.b === 0 && c.d === td && c.l === 0, JSON.stringify(c));
      const lap = S.next({ b: 3, d: td, r: 4, l: 0, t: td - 4 }, 'again', td);
      t('srs: forgetting a learned word = box 0 + one lapse', lap.b === 0 && lap.l === 1 && lap.r === 5 && lap.d === td, JSON.stringify(lap));
      let st = null; const days = [];
      for (let i = 0; i < 9; i++) { st = S.next(st, 'good', td); days.push(st.d - td); }
      t('srs: ladder of good answers = 1,2,4,7,14,30,60,60,60 days', days.join() === '1,2,4,7,14,30,60,60,60', days.join());
      t('srs: easy skips ahead, top box is capped', S.next({ b: 6, d: td, r: 1, l: 0, t: td }, 'easy', td).b === 7 && S.next({ b: 7, d: td, r: 1, l: 0, t: td }, 'good', td).b === 7);
      const d1 = new Date(2026, 10, 12, 23, 59).getTime(), d2 = new Date(2026, 10, 13, 0, 1).getTime();
      t("srs: a new day starts at the learner's midnight", S.today(d2) === S.today(d1) + 1);
      t('srs: key ignores case and extra spaces', S.key('  Pallet   Jack ') === 'pallet jack');
      const all = S.all(), ids = new Set(all.map(x => x.id)), missing = [];
      for (let n = 1; n <= 30; n++) LESSONS[n].vocab.forEach(v => { if (!S.byId(S.key(v.en))) missing.push(n + ':' + v.en); });
      t('srs: the deck holds every vocabulary word once (' + all.length + ' cards)', all.length > 100 && ids.size === all.length && !missing.length, missing.slice(0, 5).join(' | '));
      const pool = all.slice(0, 6), state = {}, weak = {};
      state[pool[0].id] = { b: 2, d: td - 1, r: 2, l: 0, t: td - 3 };
      state[pool[1].id] = { b: 2, d: td + 3, r: 2, l: 0, t: td - 1 };
      state[pool[2].id] = { b: 0, d: td, r: 1, l: 0, t: td };
      weak[pool[2].id] = 1;
      const q = S.queue(pool, state, { today: td, weak: weak });
      t('srs: queue = due words (weak first) + never-seen words, future words left out',
        q.due.length === 2 && q.due[0].id === pool[2].id && q.due[1].id === pool[0].id && q.fresh.length === 3 && !q.due.concat(q.fresh).some(x => x.id === pool[1].id), q.due.length + ' due / ' + q.fresh.length + ' new');
      const ss = S.stats(state, td);
      t('srs: stats count due / learned / new', ss.due === 2 && ss.learned === 2 && ss.fresh === all.length - 3 && ss.total === all.length, JSON.stringify(ss));
    });

    guard('cards', () => {
      const KEY = 'we.app.v1'; let ls, snap = null;
      try { ls = W.localStorage; snap = ls.getItem(KEY); } catch (e) { return; }
      try {
        Store.reset();
        const C = W.Cards, S = W.SRS, td = S.today(), deck = S.all();
        const s1 = C.build('review', 0);
        t('cards: first session = 10 new words (daily limit), starting from lesson 1', s1.queue.length === 10 && s1.queue[0].n === 1 && s1.queue.every(x => !Store.srs()[x.id]), s1.queue.length + ' cards');
        Store.srsSet(s1.queue[0].id, S.next(null, 'good', td)); Store.srsAddNew(td);
        const s2 = C.build('review', 0);
        t('cards: an answered word is not offered again today', s2.queue.length === 9 && !s2.queue.some(x => x.id === s1.queue[0].id), s2.queue.length + ' cards');
        for (let i = 0; i < 9; i++) Store.srsAddNew(td);
        t('cards: the daily new-word limit is respected', C.build('review', 0).queue.length === 0 && C.counts().newAvail === 0);
        const l1 = new Set(S.ofLesson(1).map(x => x.id)).size;
        t('cards: lesson mode = that lesson only, no daily limit', C.build('lesson', 1).queue.length === l1 - 1 && C.build('lesson', 1).queue.every(x => x.n === 1));
        const fr = C.build('free', 1);
        t('cards: free practice lists the whole lesson and keeps the schedule', fr.keep === true && fr.queue.length === l1, fr.queue.length + ' of ' + l1);
        const wv = deck[5];
        Store.weakNote(wv.v.en, wv.n, false);
        const wq = C.build('weak', 0);
        t('cards: weak mode = words missed in quizzes', wq.queue.length === 1 && wq.queue[0].id === wv.id);
        Store.srsSet(deck[3].id, { b: 2, d: td - 1, r: 2, l: 0, t: td - 3 });
        const hc = V.cards('cards').html, hh = V.home();
        t('screen: cards home shows the review button, settings and lesson list', hc.indexOf('href="#cards-review"') > 0 && hc.indexOf('data-cx="newpd"') > 0 && hc.indexOf('href="#cards-lesson-30"') > 0, 'len ' + hc.length);
        t('screen: home has the cards strip + weak words button on cards screen', hh.indexOf('href="#cards"') > 0 && hc.indexOf('href="#cards-weak"') > 0);
        Store.set('rp', { 1: { n: 2, t: Date.now() } });
        t('role-play: finished count is stored', Store.rpGet(1).n === 2);
        Store.resetProgress();
        t('store: reset progress also clears cards + role-play, keeps settings', !Object.keys(Store.srs()).length && Store.rpGet(1) === null && Store.settings().newPerDay === 10);
        Store.srsSet('pallet', S.next(null, 'good', td));
        const code = Store.exportCode(); Store.set('srs', {});
        t('backup: the card schedule is part of the backup code', Store.importCode(code) === 'ok' && !!Store.srs().pallet);
      } finally { try { if (snap === null) ls.removeItem(KEY); else ls.setItem(KEY, snap); } catch (e) { /* ignore */ } }
    });

    /* --- phase 3: microphone scoring (pure text comparison; the recognition itself needs a real phone) --- */
    guard('mic', () => {
      const M = W.Mic, sc = (target, heard) => M.score(target, [{ t: heard }]);
      t('mic: exact sentence (case + punctuation ignored) = good', sc('Hello, welcome to the Nile Logistics warehouse.', 'hello welcome to the nile logistics warehouse').verdict === 'good');
      t('mic: one missing word out of six = near', sc('The truck is at the dock', 'the truck is at dock').verdict === 'near');
      t('mic: one wrong word is marked on that word only', (() => { const r = sc('We have a stock mismatch', 'we have a stock match'); return r.gs.join() === '2,2,2,2,0' && r.verdict === 'near'; })());
      t('mic: one letter off in a single word = near', sc('pallet', 'pallets').verdict === 'near');
      t('mic: a different word = miss', sc('pallet', 'banana').verdict === 'miss');
      t('mic: nothing heard = miss', M.score('hello', []).verdict === 'miss');
      t('mic: digits and words match (25 = twenty five)', sc('Twenty five cartons', '25 cartons').verdict === 'good' && sc('20 kg', 'twenty kg').verdict === 'good');
      t('mic: thousands separator ignored', sc('1,500 cartons', '1500 cartons').verdict === 'good');
      t('mic: spelled-out acronyms are joined (P O = PO)', sc('PO', 'p o').verdict === 'good' && sc('Check the PO number', 'check the P O number').verdict === 'good');
      t('mic: contractions match their long form', sc("I'm Ahmed", 'I am Ahmed').verdict === 'good');
      t('mic: the best of the recogniser alternatives is used', M.score('pallet', [{ t: 'ballad' }, { t: 'pallet' }]).verdict === 'good');
    });

    /* --- phase 3: role-play data + install module --- */
    guard('roleplay', () => {
      const bad = [];
      for (let n = 1; n <= 30; n++) {
        const lines = LESSONS[n].dialogue.lines, who = lines.map(l => l.who).filter((w, i, a) => a.indexOf(w) === i);
        if (who.length < 2) bad.push('L' + n + ': one speaker');
        if (!lines.every(l => l.en && l.ar && l.who)) bad.push('L' + n + ': empty line');
      }
      t('role-play: every dialogue has 2+ speakers and no empty line', !bad.length, bad.slice(0, 8).join(' | '));
      const pane = W.Roleplay.pane(1);
      t('role-play: setup screen has role chips, mode chips and a start button', pane.indexOf('data-rp="me"') > 0 && pane.indexOf('data-rp="mode"') > 0 && pane.indexOf('data-rp="start"') > 0);
      t('role-play: lesson tab bar has the new tab', V.lesson(1, 'role').html.indexOf('lesson-1-role') > 0);
    });
    t('pwa: install module loaded', !!W.PWA && typeof W.PWA.statusText() === 'string', W.PWA ? W.PWA.statusText() : 'missing');

    /* --- render --- */
    const fails = out.filter(x => !x.ok);
    let h = '<div class="card stack rcard ' + (fails.length ? 'bad' : 'ok') + '"><h2 class="sec">فحص داخلي للتمارين</h2><div class="big en">' + pass + '<small>/' + out.length + '</small></div><div class="verdict">' + (fails.length ? fails.length + ' فحص فشل' : 'كل الفحوصات نجحت') + '</div></div>';
    if (fails.length) h += '<div class="card">' + fails.map(x => '<div class="aud-t"><span class="tok">✕</span><div class="t"><span class="cx">' + esc(x.name) + '</span><span class="sp">' + esc(x.detail) + '</span></div></div>').join('') + '</div>';
    h += '<div class="card stack" id="pwaCheck"><h2 class="sec">فحص ملفات التثبيت</h2><div class="muted small">بيفحص الملفات…</div></div>';
    setTimeout(() => { const el = W.document.getElementById('pwaCheck'); if (el) pwaFiles(el); }, 60);

    // eyeball check of the two result screens (rendered from saved drafts; nothing is kept)
    if (SAMPLE.pass) h += '<details class="tg"><summary>عيّنة: شاشة النجاح (20/20)</summary><div class="body pad stack">' + SAMPLE.pass + '</div></details>';
    if (SAMPLE.fail) h += '<details class="tg"><summary>عيّنة: شاشة المراجعة (0/20)</summary><div class="body pad stack">' + SAMPLE.fail + '</div></details>';
    if (SAMPLE.progress) h += '<details class="tg"><summary>عيّنة: شاشة التقدم (درسين اجتازوا)</summary><div class="body pad stack">' + SAMPLE.progress + '</div></details>';
    if (SAMPLE.home) h += '<details class="tg"><summary>عيّنة: الرئيسية بعد التقدم</summary><div class="body pad stack">' + SAMPLE.home + '</div></details>';

    // eyeball check of the generated Arabic options (lessons 1–6)
    h += '<details class="tg"><summary>عيّنة: اختيار المعنى (دروس 1–6)</summary><div class="body pad stack">';
    for (let n = 1; n <= 6; n++) {
      G.buildQuiz(n).filter(x => x.kind === 'en2ar').forEach(it => {
        h += '<div class="qit"><span class="enl" style="font-weight:700">L' + n + ' · ' + esc(it.q) + '</span>' + it.opts.map((o, k) => '<div class="' + (k === it.ans ? 'okbox' : 'muted') + '" style="padding:4px 10px">' + fmt(o) + '</div>').join('') + '</div>';
      });
    }
    h += '</div></details>';
    return h;
  };
})(window);
