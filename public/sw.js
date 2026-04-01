self.addEventListener("install", () => {
  console.log("Service Worker installiert");
});

self.addEventListener("activate", () => {
  console.log("Service Worker aktiviert");
});

self.addEventListener("fetch", () => {
  // fürs Erste leer reicht
});