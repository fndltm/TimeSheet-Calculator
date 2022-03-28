var cacheName = 'timesheet-calculator-v1.0';

self.addEventListener('install', function (event) {
    caches.open(cacheName).then((cache) => {
        cache.addAll([
            '/',
            '/index.html',
            '/manifest.json',
            '/style.css',
            '/index.js',
            '/assets/fonts/Poppins-Regular.ttf',
            '/assets/icons/android-icon-36x36.png',
            '/assets/icons/android-icon-48x48.png',
            '/assets/icons/android-icon-72x72.png',
            '/assets/icons/android-icon-96x96.png',
            '/assets/icons/android-icon-144x144.png',
            '/assets/icons/android-icon-192x192.png',
            '/assets/icons/apple-icon-57x57.png',
            '/assets/icons/apple-icon-60x60.png',
            '/assets/icons/apple-icon-72x72.png',
            '/assets/icons/apple-icon-76x76.png',
            '/assets/icons/apple-icon-114x114.png',
            '/assets/icons/apple-icon-120x120.png',
            '/assets/icons/apple-icon-144x144.png',
            '/assets/icons/apple-icon-152x152.png',
            '/assets/icons/apple-icon-180x180.png',
            '/assets/icons/apple-icon-precomposed.png',
            '/assets/icons/apple-icon.png',
            '/assets/images/timesheet_calculator.svg'
        ]);
    });
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== cacheName) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    let resposta = caches.open(cacheName).then((cache) => {
        return cache.match(event.request).then((recurso) => {
            if (recurso) return recurso;
            return fetch(event.request).then((recurso) => {
                cache.put(event.request, recurso.clone());
                return recurso;
            });
        });
    });
    event.respondWith(resposta);
});