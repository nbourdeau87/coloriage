// Service Worker — Coloriage App
// Version du cache — incrémente pour forcer la mise à jour
const CACHE_NAME = 'coloriage-v1';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
];

// Installation — mise en cache de tous les assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation — nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch — cache first, puis réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => {
        // Si hors ligne et pas en cache, retourner la page principale
        return caches.match('./index.html');
      });
    })
  );
});
