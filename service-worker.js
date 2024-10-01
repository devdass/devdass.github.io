const CACHE_NAME = 'dk-radio-cache-v2';
const assetsToCache = [
  '/',
  '/index.html',
  'https://raw.githubusercontent.com/devdass/devdass.github.io/refs/heads/main/favicon.ico',
  'https://raw.githubusercontent.com/devdass/devdass.github.io/refs/heads/main/Backgrouds/bg%20(1).jpg',
  'https://fonts.googleapis.com/css2?family=Frijole&display=swap',
  'https://raw.githubusercontent.com/devdass/devdass.github.io/refs/heads/main/icon-180.png',
  'https://raw.githubusercontent.com/devdass/devdass.github.io/refs/heads/main/icon-192.png',
  'https://raw.githubusercontent.com/devdass/devdass.github.io/refs/heads/main/icon-512.png'
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

// Intercept fetch requests
self.addEventListener('fetch', event => {
  // Don't attempt to cache or serve from cache for the streaming URL
  if (event.request.url.includes('a6.asurahosting.com:7530/radio.mp3')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        // Cache other successfully fetched resources that aren't already cached
        if (!response && fetchResponse.status === 200) {
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return fetchResponse;
      });
    }).catch(() => {
      // If both cache and network fail, show an offline message
      return new Response('Offline. This app requires an internet connection to stream music.', {
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});

// Optional: Handle push notifications (if you plan to use them in the future)
self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'https://raw.githubusercontent.com/devdass/devdass.github.io/refs/heads/main/icon-192.png'
  });
});
