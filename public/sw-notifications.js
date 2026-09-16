// Manejo de Notificaciones y Push para PWA Rumbo
// Este archivo se importa dentro del Service Worker generado por VitePWA

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const rawUrl = event.notification.data?.url || '/';
  const targetUrl = new URL(rawUrl, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 1. Si ya hay una ventana con la misma URL, enfocarla
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          client.postMessage({ type: 'NOTIFICATION_NAVIGATE', url: targetUrl });
          return client.focus();
        }
      }
      // 2. Si hay cualquier ventana abierta de la app, enfocarla y navegar
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          if ('navigate' in client) {
            return client.navigate(targetUrl);
          } else {
            client.postMessage({ type: 'NOTIFICATION_NAVIGATE', url: targetUrl });
            return;
          }
        }
      }
      // 3. Si no había ventana abierta, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Manejo de evento Push en segundo plano (Web Push)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  try {
    const payload = event.data.json();
    const title = payload.title || 'Rumbo';
    const options = {
      body: payload.body || 'Tienes una nueva actualización',
      icon: payload.icon || '/assets/LOGOR.png',
      badge: payload.badge || '/assets/LOGOR.png',
      vibrate: [200, 100, 200],
      tag: payload.tag || `rumbo-push-${Date.now()}`,
      renotify: true,
      data: payload.data || { url: '/' }
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch {
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('Rumbo', {
        body: text || 'Tienes una nueva notificación',
        icon: '/assets/LOGOR.png',
        badge: '/assets/LOGOR.png',
        data: { url: '/' }
      })
    );
  }
});
