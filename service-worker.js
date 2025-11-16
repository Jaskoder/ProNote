self.addEventListener("activate", event => {
  clients.claim();
});

const ROOT = "/pronote";

const CACHE = "v1";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll([
        `/`,
        `/index.html`,
        `/list.html`,
        `/editor.html`,
        `/manifest.json`,

        `/scripts/app.js`,

        `/assets/android-chrome-192x192.png`,
        `/assets/android-chrome-512x512.png`,
        `/assets/favicon-16x16.png`,
        `/assets/favicon-32x32.png`,
        `/assets/apple-touch-icon.png`,
        `/assets/dev.jpg`,
        `/assets/favicon.ico`,

        `/bootstrap-icons/bootstrap-icons.css`,
        `/bootstrap-icons/bootstrap-icons.min.css`,
        `/bootstrap-icons/bootstrap-icons.json`,
        `/bootstrap-icons/bootstrap-icons.scss`,
        `/bootstrap-icons/fonts/bootstrap-icons.woff`,
        `/bootstrap-icons/fonts/bootstrap-icons.woff2`,

        `/styles/style.css`,
        `/styles/app.css`,

        `/scripts/core/Component.js`,
        `/scripts/core/Element.js`,
        `/scripts/core/Errors.js`,
        `/scripts/core/Factory.js`,
        `/scripts/core/helpers.js`,
        `/scripts/core/Root.js`,

        `/scripts/helpers/helpers.js`,
        `/scripts/helpers/note.js`,
      ]);
    })
  );
});
