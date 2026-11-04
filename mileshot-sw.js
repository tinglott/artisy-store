/* MileShot service worker.
 * Cache-first ONLY for the app shell (the page, its manifest and icons)
 * so MileShot opens offline after the first visit. Everything else —
 * the Tesseract OCR library CDN, Groq / Anthropic API calls, any other
 * origin or path — is never intercepted: the fetch handler simply does
 * not call respondWith, so the browser handles it as if no worker
 * existed. */
'use strict';

var CACHE = 'mileshot-shell-v2-20261104';
var SHELL = [
  '/mileshot.html',
  '/mileshot.webmanifest',
  '/mileshot-icon-192.png',
  '/mileshot-icon-512.png',
  '/mileshot-icon.svg'
];
var SHELL_SET = {};
SHELL.forEach(function (p) { SHELL_SET[p] = true; });

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      // Cache each shell file on its own: one missing file must never
      // keep the worker (and offline mode) from installing.
      return Promise.all(SHELL.map(function (p) {
        return cache.add(p).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;               // never touch POST etc.
  var url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return; // OCR CDN / AI APIs: passthrough
  if (!SHELL_SET[url.pathname]) return;            // any other page: passthrough
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (cache) { cache.put(req, copy); });
        return res;
      });
    })
  );
});
