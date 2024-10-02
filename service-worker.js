// Unique identifier for this version of the service worker
const VERSION = 'v1.0.0';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== VERSION) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Don't attempt to handle the streaming URL
  if (event.request.url.includes('a6.asurahosting.com:7530/radio.mp3')) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
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
