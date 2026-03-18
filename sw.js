/* Service Worker — injeta COOP + COEP headers para habilitar
   SharedArrayBuffer no GitHub Pages (necessário para FFmpeg.wasm) */

self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(clients.claim()); });

self.addEventListener('fetch', function(e){
  if(e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') return;

  e.respondWith(
    fetch(e.request).then(function(r){
      var headers = new Headers(r.headers);
      headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
      headers.set('Cross-Origin-Opener-Policy', 'same-origin');
      return new Response(r.body, {
        status: r.status,
        statusText: r.statusText,
        headers: headers
      });
    }).catch(function(){
      return fetch(e.request);
    })
  );
});
