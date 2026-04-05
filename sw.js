const CACHE_NAME = 'diet-elite-v7'; // Ha nagyot változtatsz, írd át v8-re
const ASSETS = [
  './index.html',
  './manifest.json',
  './1774606671886.png',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Telepítés és fájlok elmentése offline módhoz
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Nem vár, azonnal aktiválja az új verziót
});

// Régi szemét (korábbi verziók) takarítása
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // Azonnal átveszi az irányítást
});

// Kiszolgálás a gyorsítótárból (ettől lesz villámgyors)
self.addEventListener('fetch', (e) => {
  // A Firebase adatbázist NEM mentjük el, ott mindig friss adat kell
  if (e.request.url.includes('firebaseio.com')) {
    return fetch(e.request);
  }

  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
// Service Worker
