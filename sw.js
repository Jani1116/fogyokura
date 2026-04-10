const CACHE_NAME = 'diet-v13';
const ASSETS = ['./', './index.html', './manifest.json', 'https://cdn.jsdelivr.net/npm/chart.js'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('firebaseio.com')) return fetch(e.request);
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
