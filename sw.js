const CACHE_NAME = 'kawthar-pwa-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/base.css',
  './css/variables.css',
  './css/layout.css'
];

// تثبيت ملفات الكاش الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// تشغيل الموقع من الكاش لتسريع الأداء
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});