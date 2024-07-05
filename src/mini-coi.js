/*! coi-serviceworker v0.1.7 - Guido Zuidhof and contributors, licensed under MIT */
/*! mini-coi - Andrea Giammarchi and contributors, licensed under MIT */

const staticAssets = [
    // './',
    './manifest.json',
    './index.html',
];


(({ document: d, navigator: { serviceWorker: s } }) => {
    if (d) {
      const { currentScript: c } = d;
      s.register(c.src, { scope: c.getAttribute('scope') || '.' }).then(r => {
        r.addEventListener('updatefound', () => location.reload());
        if (r.active && !s.controller) location.reload();
      });
    }
    else {
      addEventListener('install', async event => {
        const cache = await caches.open('static-cache');
        cache.addAll(staticAssets);
        skipWaiting();
        });
      addEventListener('activate', e => e.waitUntil(clients.claim()));
      addEventListener('fetch', async e => {
        const { request: r } = e;
        const url = new URL(r.url);
        let cached_req;
        if(url.origin === location.url){
          cached_req = caches.match(r) || fetch(r);
        }
        else {
          cached_req = newtorkFirst(r);
        }
        if (r.cache === 'only-if-cached' && r.mode !== 'same-origin') return;
        e.respondWith(cached_req.then(r => {
          const { body, status, statusText } = r;
          if (!status || status > 399) return r;
          const h = new Headers(r.headers);
          h.set('Cross-Origin-Opener-Policy', 'same-origin');
          h.set('Cross-Origin-Embedder-Policy', 'require-corp');
          h.set('Cross-Origin-Resource-Policy', 'cross-origin');
          return new Response(body, { status, statusText, headers: h });
        }));
      });
    }
  })(self);

async function newtorkFirst(r){
  const cache = await caches.open('dynamic-cache');
  const res = await fetch(r);
  cache.put(r, res.clone());
  return res;
}
  