const CACHE_NAME = 'dk-radio-cache-v1';
const assetsToCache = [
  '/',
  '/index.html',
  'https://raw.githubusercontent.com/devdass/devdass.github.io/refs/heads/main/favicon.ico',
  'https://raw.githubusercontent.com/devdass/devdass.github.io/refs/heads/main/Backgrouds/bg%20(1).jpg',
  'https://fonts.googleapis.com/css2?family=Frijole&display=swap',
  'https://a6.asurahosting.com:7530/radio.mp3'
];

// Install service worker and cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

// Intercept fetch requests to serve cached files when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
