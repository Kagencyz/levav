/**
 * ============================================================
 * LEVAV TALENT AFRIKA — SERVICE WORKER
 * ============================================================
 * Enables offline functionality for the Levav 28™ daily
 * crucible and core navigation. Caches static assets and
 * serves fallback for API calls when offline.
 *
 * Strategies:
 *   - Cache-first for static assets (JS, CSS, HTML)
 *   - Network-first for API calls (tRPC) with cache fallback
 *   - Background sync for crucible submissions
 * ============================================================
 */

const CACHE_NAME = "levav-v1";
const STATIC_ASSETS = ["/", "/index.html", "/404.html"];

/* ─── Install: Cache static shell ─── */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }),
  );
  // Activate immediately
  (self as unknown as ServiceWorkerGlobalScope).skipWaiting();
});

/* ─── Activate: Clean old caches ─── */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
    }),
  );
  (self as unknown as ServiceWorkerGlobalScope).clients.claim();
});

/* ─── Fetch: Cache-first for static, network-first for API ─── */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* Skip non-GET requests */
  if (request.method !== "GET") return;

  /* API calls: network-first with cache fallback */
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached ?? new Response(
          JSON.stringify({ error: "Offline — data unavailable" }),
          { status: 503, headers: { "Content-Type": "application/json" } },
        ))),
    );
    return;
  }

  /* Static assets: cache-first */
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      });
    }),
  );
});

/* ─── Background Sync: Queue crucible submissions ─── */
self.addEventListener("sync", (event) => {
  if (event.tag === "crucible-submit") {
    event.waitUntil(processCrucibleQueue());
  }
});

async function processCrucibleQueue() {
  const db = await openDB("levav-offline", 1);
  const submissions = await db.getAll("crucible-queue");
  for (const sub of submissions) {
    try {
      await fetch("/api/trpc/volunteer.logHours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
      await db.delete("crucible-queue", sub.id);
    } catch {
      /* Will retry on next sync */
    }
  }
}

/* ─── IndexedDB helper ─── */
function openDB(name: string, version: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(name, version);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      req.result.createObjectStore("crucible-queue", { keyPath: "id", autoIncrement: true });
    };
  });
}
