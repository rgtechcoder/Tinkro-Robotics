const CACHE_NAME = "tinkro-v2";
const STATIC_CACHE = "tinkro-static-v2";

const PRE_CACHE_URLS = [
  "/",
  "/products",
  "/labs",
  "/blog",
  "/about",
  "/contact",
  "/manifest.json",
];

const JS_EXTENSIONS = [".js"];
const STATIC_EXTENSIONS = [
  ".css",
  ".woff",
  ".woff2",
  ".ttf",
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".ico",
];

function isJavascriptAsset(url) {
  return JS_EXTENSIONS.some((ext) => url.pathname.endsWith(ext));
}

function isStaticAsset(url) {
  return STATIC_EXTENSIONS.some((ext) => url.pathname.endsWith(ext));
}

function isApiCall(url) {
  return url.pathname.startsWith("/api/");
}

function isNavigationRequest(request) {
  return request.mode === "navigate";
}

// Install: pre-cache key URLs
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRE_CACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

// Activate: delete old caches and notify clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (name) => name !== CACHE_NAME && name !== STATIC_CACHE,
            )
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim())
      .then(() =>
        self.clients.matchAll({ type: "window", includeUncontrolled: true })
          .then((clients) =>
            clients.forEach((client) =>
              client.postMessage({ type: "SW_UPDATED" }),
            ),
          ),
      ),
  );
});

// Open the admin orders screen when an order notification is tapped.
self.addEventListener("push", (event) => {
  if (!event.data) return;

  event.waitUntil(
    (async () => {
      let payload;
      try {
        payload = event.data.json();
      } catch {
        payload = { notification: { body: event.data.text() } };
      }

      const notification = payload.notification || {};
      const data = payload.data || {};
      const title = notification.title || data.title || "New Tinkro order";
      const body =
        notification.body || data.body || "A new order has been placed.";
      const url = data.url || payload.fcmOptions?.link || "/admin/orders";

      await self.registration.showNotification(title, {
        body,
        icon: notification.icon || "/tinkro-favicon.png",
        badge: notification.badge || "/tinkro-favicon.png",
        tag: data.orderId ? `tinkro-order-${data.orderId}` : "tinkro-order",
        data: { url },
      });
    })(),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(
    event.notification.data?.url || "/admin/orders",
    self.location.origin,
  ).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existingClient = clients.find((client) =>
        client.url.startsWith(self.location.origin),
      );
      if (existingClient) {
        if ("navigate" in existingClient) existingClient.navigate(targetUrl);
        return existingClient.focus();
      }
      return self.clients.openWindow(targetUrl);
    }),
  );
});

// Fetch: cache strategies
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip non-http(s) requests
  if (!event.request.url.startsWith("http")) return;

  // Network-first for API calls
  if (isApiCall(url)) {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(event.request),
      ),
    );
    return;
  }

  // Network-first for JavaScript assets to avoid stale bundle/chunk caching.
  if (isJavascriptAsset(url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            caches.open(STATIC_CACHE).then((cache) => {
              try {
                cache.put(event.request, response.clone());
              } catch (err) {
                console.warn('SW: failed to clone response for JS asset', event.request.url, err);
              }
            });
          }
          return response;
        })
        .catch(() => caches.match(event.request)),
    );
    return;
  }

  // Cache-first for static non-JS assets
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            if (response.ok) {
              try {
                cache.put(event.request, response.clone());
              } catch (err) {
                console.warn('SW: failed to clone response for static asset', event.request.url, err);
              }
            }
            return response;
          });
        }),
      ),
    );
    return;
  }

  // Network-first with cache fallback for navigation (offline support)
  if (isNavigationRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            try {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            } catch (err) {
              console.warn('SW: failed to clone response for navigation', event.request.url, err);
            }
          }
          return response;
        })
        .catch(() =>
          caches
            .match(event.request)
            .then((cached) => cached || caches.match("/"))
            .then((res) => res || new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } })),
        ),
    );
    return;
  }

  // Default: network with cache fallback
  event.respondWith(
    fetch(event.request).catch(() =>
      caches
        .match(event.request)
        .then((cached) => cached || caches.match("/"))
        .then((res) => res || new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } })),
    ),
  );
});
