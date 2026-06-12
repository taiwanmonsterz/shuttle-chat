// Taiwan Monster Shuttle Chat — Service Worker
// 백그라운드 알림 표시 안정화 + 알림 클릭 시 앱 포커스

const CACHE = 'twm-shuttle-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// 페이지에서 보내는 알림 요청 처리 (new Notification 폴백)
self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'show-notification') {
    const { title, body, tag, icon } = data;
    self.registration.showNotification(title, {
      body: body,
      icon: icon || 'icon.png',
      badge: 'icon.png',
      tag: tag,
      renotify: true,
      vibrate: [100, 50, 100]
    });
  }
});

// 알림 클릭 시 이미 열린 앱으로 포커스, 없으면 새로 열기
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./index.html');
    })
  );
});
