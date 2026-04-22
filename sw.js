const CACHE_NAME = 'diet-v40';
const ASSETS = [
  './', 
  './index.html', 
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Firebase API hívások kihagyása a cache-ből a friss adatok miatt
  if (e.request.url.includes('firebaseio.com') || e.request.method !== 'GET') {
    return fetch(e.request);
  }
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
