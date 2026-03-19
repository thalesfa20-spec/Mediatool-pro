/* Service Worker — injeta COOP + COEP headers para habilitar
   SharedArrayBuffer no GitHub Pages (necessário para FFmpeg.wasm) */

self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(clients.claim()); });

self.addEventListener('fetch', function(e){
  var req = e.request;

  // Só intercepta GET — nunca intercepta POST (Cobalt, APIs) ou outros métodos
  if(req.method !== 'GET') return;

  // Só adiciona headers em requests da mesma origem
  if(!req.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(req).then(function(r){
      var headers = new Headers(r.headers);
      // credentialless é mais compatível que require-corp para recursos externos
      headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
      headers.set('Cross-Origin-Opener-Policy', 'same-origin');
      return new Response(r.body, {
        status: r.status,
        statusText: r.statusText,
        headers: headers
      });
    }).catch(function(){
      return fetch(req);
    })
  );
});
