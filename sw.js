/* Warehouse English — service worker: keeps every file on the phone so the app opens without internet.
   To publish an update: change VERSION (any new text) and upload the changed files together with this one. */
const VERSION = 'we-v3.0';
const CORE = [
  './', 'index.html', 'manifest.json', 'icons/icon.svg', 'icons/icon-maskable.svg',
  'app/app.css', 'app/tts.js', 'app/grade.js', 'app/store.js', 'app/srs.js', 'app/views.js', 'app/mic.js', 'app/practice.js',
  'app/cards.js', 'app/roleplay.js', 'app/progress.js', 'app/selftest.js', 'app/pwa.js', 'app/app.js',
  'js/core.js', 'data/meta.js',
  'data/lesson_01.js', 'data/lesson_02.js', 'data/lesson_03.js', 'data/lesson_04.js', 'data/lesson_05.js',
  'data/lesson_06.js', 'data/lesson_07.js', 'data/lesson_08.js', 'data/lesson_09.js', 'data/lesson_10.js',
  'data/lesson_11.js', 'data/lesson_12.js', 'data/lesson_13.js', 'data/lesson_14.js', 'data/lesson_15.js',
  'data/lesson_16.js', 'data/lesson_17.js', 'data/lesson_18.js', 'data/lesson_19.js', 'data/lesson_20.js',
  'data/lesson_21.js', 'data/lesson_22.js', 'data/lesson_23.js', 'data/lesson_24.js', 'data/lesson_25.js',
  'data/lesson_26.js', 'data/lesson_27.js', 'data/lesson_28.js', 'data/lesson_29.js', 'data/lesson_30.js',
  'data/videos_01_15.js', 'data/videos_16_30.js',
  'book.html', 'css/book.css', 'js/blocks.js', 'js/build.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => Promise.all(CORE.map(u => c.add(new Request(u, { cache: 'reload' })))))   // 'reload' = never reuse an old copy from the browser cache
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.indexOf('we-') === 0 && k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;          // fonts, videos, other sites: straight to the network
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    })).catch(() => (req.mode === 'navigate' ? caches.match('index.html') : Response.error()))
  );
});
