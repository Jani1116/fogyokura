const CACHE_NAME = 'diet-elite-v9'; // Verziószám növelve
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './1774606671886.png',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Firebase API hívásokat soha ne cache-eljünk
  if (e.request.url.includes('firebaseio.com')) {
    return fetch(e.request);
  }

  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request).then((response) => {
        // Opcionális: menet közbeni cache-elés az új asseteknek
        return response;
      });
    })
  );
});
