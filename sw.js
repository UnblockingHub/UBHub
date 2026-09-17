// sw.js (Service Worker file)
const CACHE_NAME = 'v1_cache';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js'
];

// 1. Install Event: Triggered when the browser first sees the script.
// Perfect for pre-caching static assets.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching core assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activate Event: Triggered after installation when old versions are gone.
// Used for cleaning up old, outdated caches.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Fetch Event: Intercepts all network requests made by your website.
// Allows you to serve cached content if the user is offline.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Return cached file if found, otherwise perform a normal network request
      return cachedResponse || fetch(event.request);
    })
  );
});
