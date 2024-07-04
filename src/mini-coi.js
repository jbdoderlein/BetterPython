/*! coi-serviceworker v0.1.7 - Guido Zuidhof and contributors, licensed under MIT */
/*! mini-coi - Andrea Giammarchi and contributors, licensed under MIT */

const staticAssets = [
    // './',
    './manifest.json',
    './index.html',
    './favicon.ico'
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
        skipWaiting();
        const cache = await caches.open('static-cache');
        cache.addAll(staticAssets);
        });
      addEventListener('activate', e => e.waitUntil(clients.claim()));
      addEventListener('fetch', e => {
        const req = e.request;
        const url = new URL(req.url);
        const { request: r } = e;
        let cached_req;
        /*
        if(url.origin === location.url){
            cached_req = cacheFirst(req);
        } else {
            cached_req = newtorkFirst(req);
        }
        */
        if (r.cache === 'only-if-cached' && r.mode !== 'same-origin') return;
        e.respondWith(fetch(r).then(r => {
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

async function cacheFirst(req){
    const cachedResponse = caches.match(req);
    return cachedResponse || fetch(req);
}

async function newtorkFirst(req){
    const cache = await caches.open('dynamic-cache');

    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (error) {
        return await cache.match(req);
    }
}
  