/* Warehouse English — progress tracker screen + backup / restore */
(function (W) {
  'use strict';
  const D = document, G = W.Grade, Store = W.Store, V = W.V, LESSONS = W.LESSONS, META = W.BOOK_META;
  const { esc } = W.BK;
  const U = V.util;
  const N = 30, pad = n => String(n).padStart(2, '0');
  const $$ = (r, s) => Array.from(r.querySelectorAll(s));
  const toast = m => { if (W.WE && W.WE.toast) W.WE.toast(m); };
  const fdate = U.fdate;

  // sections under 80% in a lesson's latest attempt
  const weakSections = l => (!l || !l.sec) ? [] : G.SECS.filter((s, i) => l.sec[i] < (l.of ? l.of[i] : 5) * 0.8).map(s => s[1]);

  function row(n) {
    const L = LESSONS[n], st = Store.status(n), att = Store.attempts(n), last = att[att.length - 1];
    let sub = L.titleAr;
    if (last) { const w = weakSections(last); sub = w.length ? 'ضعف في: ' + w.join('، ') : 'كل الأقسام كويسة'; }
    else if (st === 'studying') sub = 'لسه ما دخلتش الاختبار';
    const to = '#lesson-' + n + (st === 'review' || st === 'passed' ? '-quiz' : '');
    return '<a class="prow" data-st="' + st + '" href="' + to + '"><span class="tn"><small>DAY</small>' + pad(n) + '</span>' +
      '<span class="tt"><span class="enr">' + esc(L.titleEn) + '</span><small>' + esc(sub) + '</small></span>' +
      '<span class="rside">' + V.pill(st) + (last ? '<b class="en sc2">' + last.s + '/' + (last.tot || 20) + '</b><small class="en muted">' + fdate(last.t) + '</small>' : '') + '</span></a>';
  }

  // average of every section over the latest attempt of each lesson taken
  function secAverages() {
    const ok = [0, 0, 0, 0], of = [0, 0, 0, 0]; let lessons = 0;
    for (let n = 1; n <= N; n++) {
      const a = Store.attempts(n), l = a[a.length - 1];
      if (!l || !l.sec) continue;
      lessons++;
      l.sec.forEach((v, i) => { ok[i] += v; of[i] += (l.of ? l.of[i] : 5); });
    }
    return { lessons: lessons, rows: G.SECS.map((s, i) => ({ name: s[1], p: of[i] ? Math.round(ok[i] / of[i] * 100) : 0 })) };
  }

  V.progress = function () {
    const S = Store.stats(), pct = Math.round(S.c.passed / N * 100);
    let h = Store.persistent() ? '' : '<div class="warnbox"><b>الحفظ مش شغال في المتصفح ده</b> (غالباً وضع التصفح الخاص). تقدمك هيضيع لما تقفل الصفحة. انسخ كود النسخة الاحتياطية من أسفل الصفحة بعد كل مرة تذاكر فيها.</div>';
    h += '<div class="card stack psum"><div class="row"><div class="grow"><div class="k en">YOUR PROGRESS</div><b class="bigl">اجتزت ' + S.c.passed + ' من ' + N + ' درس</b></div>' +
      '<div class="pcirc en" style="--pp:' + pct + '%"><span>' + pct + '%</span></div></div>' +
      '<div class="bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="stats">' + G.STATUS_ORDER.map(k => '<button type="button" class="stat st-' + k + '" data-px="pfilter" data-f="' + k + '" aria-pressed="false"><b class="en">' + S.c[k] + '</b><span>' + G.STATUS[k] + '</span></button>').join('') + '</div>' +
      '<div class="muted small">' + (S.avg != null
        ? 'متوسط آخر درجاتك: <b class="en">' + S.avg.toFixed(1) + '/20</b> في ' + S.taken + ' اختبار. اضغط على أي حالة علشان تفلتر القائمة.'
        : 'لسه ما دخلتش أي اختبار. التقدم بيتسجّل تلقائي لما تخلّص اختبار أي درس.') + '</div></div>';

    if (V.cardsSummary) h += V.cardsSummary();

    // weak points
    const sa = secAverages(), wk = Store.weakList().slice(0, 15);
    h += '<div class="card stack"><h2 class="sec">نقاط الضعف</h2>';
    if (!sa.lessons) h += '<p class="muted">لسه مفيش بيانات. بعد أول اختبار هتظهر هنا الأقسام اللي محتاجة تركيز، والكلمات اللي بتغلط فيها.</p>';
    else {
      h += '<div class="sbars">' + sa.rows.map(x => '<div class="sbar' + (x.p < 80 ? ' low' : '') + '"><span>' + x.name + '</span><i style="--p:' + x.p + '%"></i><b class="en">' + x.p + '%</b></div>').join('') + '</div>';
      const low = sa.rows.filter(x => x.p < 80).sort((a, b) => a.p - b.p)[0];
      h += low ? '<div class="note">أضعف قسم عندك: <b>' + low.name + '</b>. ركّز عليه في الدروس الجاية.</div>' : '<div class="okbox">كل الأقسام فوق 80%. استمر!</div>';
    }
    if (wk.length) {
      h += '<div class="muted small">كلمات بتغلط فيها:</div>' + wk.map(w =>
        '<div class="fl-item"><span class="enl">' + esc(w.en) + '</span><a class="vlsn" href="#lesson-' + w.n + '-words">L' + w.n + '</a>' + U.spk(w.en, { sm: true }) + '</div>').join('');
    }
    h += '</div>';

    // tracker
    h += '<div class="plist" data-filter="all">';
    META.weeks.forEach(w => {
      const done = w.lessons.filter(n => Store.status(n) === 'passed').length;
      h += '<section class="stack" data-wk style="--wk:var(--wk' + w.n + ')"><div class="wkh"><span class="wn">' + w.n + '</span><div><b>الأسبوع ' + w.n + ': ' + esc(w.titleAr) + '</b><small>اجتزت <span class="en">' + done + '</span> من <span class="en">' + w.lessons.length + '</span></small></div></div>' +
        w.lessons.map(row).join('') + '</section>';
    });
    h += '</div>';

    // backup + reset
    h += '<div class="card stack"><h2 class="sec">نسخة احتياطية</h2>' +
      '<p class="muted small">تقدمك محفوظ تلقائي على الجهاز ده في المتصفح. لو هتمسح بيانات المتصفح أو هتغيّر الموبايل، انسخ الكود واحتفظ بيه، وبعدين الصقه هنا للاسترجاع.</p>' +
      '<div class="row wrap"><button type="button" class="btn pri sm" data-px="bkcopy">نسخ كود النسخة الاحتياطية</button></div>' +
      '<textarea id="bkIn" class="inp ta" rows="3" placeholder="الصق الكود هنا للاسترجاع" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></textarea>' +
      '<div class="row wrap"><button type="button" class="btn sm" data-px="bkrestore" data-ask="هيستبدل تقدمك الحالي — اضغط تاني">استرجاع من الكود</button></div>' +
      '<div class="muted small" id="bkMsg" aria-live="polite"></div></div>';
    h += '<button type="button" class="btn block" data-px="resetprog" data-ask="هيمسح كل تقدمك — اضغط تاني للتأكيد">مسح كل التقدم</button>';
    return h;
  };

  function showBox(code) {
    let ta = D.getElementById('bkOut');
    if (!ta) {
      const host = D.getElementById('bkIn'); if (!host) return;
      ta = D.createElement('textarea'); ta.id = 'bkOut'; ta.className = 'inp ta'; ta.readOnly = true; ta.rows = 4;
      host.parentNode.insertBefore(ta, host);
    }
    ta.value = code; ta.focus(); ta.select();
  }

  D.addEventListener('click', async e => {
    const t = e.target.closest('[data-px]');
    if (!t) return;
    const a = t.dataset.px, msg = D.getElementById('bkMsg');
    if (a === 'pfilter') {
      const list = D.querySelector('.plist'); if (!list) return;
      const f = t.dataset.f, now = list.dataset.filter === f ? 'all' : f;
      list.dataset.filter = now;
      $$(D, '[data-px="pfilter"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.f === now)));
      $$(list, 'section[data-wk]').forEach(s => { s.hidden = !$$(s, '.prow').some(r => now === 'all' || r.dataset.st === now); });
    } else if (a === 'bkcopy') {
      const code = Store.exportCode();
      const ok = W.WE && W.WE.copyText ? await W.WE.copyText(code) : false;
      if (ok) { toast('تم نسخ كود النسخة الاحتياطية'); if (msg) msg.textContent = 'اتنسخ (' + code.length + ' حرف). الصقه في مكان آمن، زي ملاحظات الموبايل أو رسالة لنفسك.'; }
      else { toast('انسخ الكود من المربع'); showBox(code); }
    } else if (a === 'bkrestore') {
      const ta = D.getElementById('bkIn'), code = ((ta && ta.value) || '').trim();
      if (!code) { toast('الصق الكود الأول'); return; }
      if (!U.twice(t)) return;
      if (Store.importCode(code) === 'ok') {
        toast('تم استرجاع التقدم');
        if (W.WE) { W.WE.applySettings(); W.WE.route(); }
      } else if (msg) msg.textContent = 'الكود مش صحيح. اتأكد إنك نسخته كامل من أوله لآخره.';
    } else if (a === 'resetprog') {
      if (!U.twice(t)) return;
      Store.resetProgress(); toast('اتمسح كل التقدم');
      if (W.WE) W.WE.route();
    }
  });
})(window);
