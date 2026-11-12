/* Warehouse English — installable app (PWA): service worker, install button, offline notices.
   Works only when the page is opened from its own https address (not inside a preview frame). */
(function (W) {
  'use strict';
  const D = document, V = W.V, nav = W.navigator;
  const P = (W.PWA = {});
  const toast = m => { if (W.WE && W.WE.toast) W.WE.toast(m); };
  const inFrame = (() => { try { return W.top !== W.self; } catch (e) { return true; } })();
  const canSW = !inFrame && !!W.isSecureContext && /^https?:$/.test(W.location.protocol) && 'serviceWorker' in nav;
  const standalone = () => !!((W.matchMedia && W.matchMedia('(display-mode: standalone)').matches) || nav.standalone === true);
  let deferred = null, sw = canSW ? 'starting' : inFrame ? 'off (preview frame)' : 'off (needs https)';

  P.canSW = canSW;
  P.statusText = () => 'sw ' + sw + ' / ' + (standalone() ? 'installed' : 'browser tab') + (deferred ? ' / install ready' : '');

  /* ---------- service worker ---------- */
  function register() {
    if (!canSW) return;
    const had = !!nav.serviceWorker.controller;
    nav.serviceWorker.register('sw.js').then(r => {
      sw = r.active ? 'active' : 'installing';
      r.addEventListener('updatefound', () => {
        const w = r.installing; if (!w) return;
        w.addEventListener('statechange', () => {
          if (w.state === 'activated') {
            sw = 'active';
            toast(had ? 'اتحدّث التطبيق — اقفله وافتحه تاني علشان تشوف التحديث' : 'التطبيق جاهز يشتغل من غير إنترنت');
          }
        });
      });
      if (r.update) r.update().catch(() => {});
    }).catch(e => { sw = 'error: ' + (e && e.message ? e.message : e); });
  }
  if (D.readyState === 'complete') register(); else W.addEventListener('load', register);

  /* ---------- install button ---------- */
  const fillSlots = () => D.querySelectorAll('[data-install]').forEach(el => { el.innerHTML = P.slotHTML(); });
  W.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; fillSlots(); });
  W.addEventListener('appinstalled', () => { deferred = null; fillSlots(); toast('اتثبّت التطبيق على جهازك'); });
  P.install = async () => {
    if (!deferred) return false;
    deferred.prompt();
    let ok = false;
    try { const r = await deferred.userChoice; ok = !!r && r.outcome === 'accepted'; } catch (e) { /* ignore */ }
    deferred = null; fillSlots();
    return ok;
  };
  // small strip on the home screen (only when the browser says the app can be installed)
  P.slotHTML = () => (inFrame || standalone() || !deferred ? '' :
    '<div class="install"><span class="grow"><b>ثبّت التطبيق على موبايلك</b><small>بيفتح زي أي تطبيق وبيشتغل من غير إنترنت</small></span><button type="button" class="btn pri sm" data-pwa="install">تثبيت</button></div>');

  // card on the voice screen: install, status, force-update
  P.helpHTML = () => {
    let h = '<div class="card stack"><h2 class="sec">تثبيت التطبيق وتحديثه</h2>';
    if (inFrame) h += '<p class="muted small">التطبيق مفتوح جوه معاينة. التثبيت بيشتغل لما تفتحه من رابطه الأساسي على الإنترنت (الخطوات في ملف النشر).</p>';
    else if (standalone()) h += '<div class="okbox">التطبيق متثبّت وشغّال كتطبيق.</div>';
    else if (deferred) h += '<button type="button" class="btn pri block" data-pwa="install">ثبّت التطبيق على الموبايل</button>';
    else h += '<p class="muted small">لو زر التثبيت ما ظهرش: من قائمة Chrome (النقط التلاتة ⋮) اختار «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».</p>';
    if (canSW) h += '<button type="button" class="btn sm" data-pwa="update" data-ask="هيمسح النسخة المخزّنة ويحمّل التطبيق من جديد — اضغط تاني">تحديث التطبيق (مسح النسخة المخزّنة)</button><p class="muted small">تقدمك محفوظ ومش بيتمسح بالتحديث.</p>';
    return h + '</div>';
  };

  P.forceUpdate = async () => {
    try { const regs = await nav.serviceWorker.getRegistrations(); await Promise.all(regs.map(r => r.unregister())); } catch (e) { /* ignore */ }
    try { const keys = await W.caches.keys(); await Promise.all(keys.map(k => W.caches.delete(k))); } catch (e) { /* ignore */ }
    W.location.reload();
  };

  /* ---------- offline notices + clicks ---------- */
  W.addEventListener('offline', () => toast('مفيش إنترنت — الدروس والبطاقات شغالة، والميكروفون محتاج إنترنت'));
  W.addEventListener('online', () => toast('الإنترنت رجع'));
  D.addEventListener('click', e => {
    const t = e.target.closest('[data-pwa]');
    if (!t) return;
    if (t.dataset.pwa === 'install') P.install();
    else if (t.dataset.pwa === 'update' && V.util.twice(t)) P.forceUpdate();
  });
})(window);
