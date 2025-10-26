/* PWA Python Template — Service Worker (MIT 2025) */
const CACHE = 'pwa-python-v1';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './styles.css',
  './manifest.json',
  './main.py',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (e)=>{
  e.waitUntil((async ()=>{
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  })());
});

self.addEventListener('activate', (e)=>{
  e.waitUntil((async ()=>{
    const keys = await caches.keys();
    await Promise.all(keys.map(k=> k!==CACHE ? caches.delete(k) : null));
    self.clients.claim();
  })());
});

self.addEventListener('fetch', (e)=>{
  const url = new URL(e.request.url);
  // App shell: cache-first
  if (url.origin === location.origin) {
    e.respondWith((async ()=>{
      const cached = await caches.match(e.request);
      if (cached) return cached;
      try {
        const resp = await fetch(e.request);
        const cache = await caches.open(CACHE);
        cache.put(e.request, resp.clone());
        return resp;
      } catch (err) {
        return cached || new Response('Offline', {status: 503});
      }
    })());
    return;
  }
  // For CDN (pyodide), let the network handle, but it will likely be HTTP-cached by the browser.
});
