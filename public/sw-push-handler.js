// sw-push-handler.js
// Add this to your existing service worker (sw-custom.js) or merge with it
// Handles push notifications for Special Needs World with themed UI

// Handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  let data = {
    title: 'Special Needs World',
    body: 'You have a notification',
    icon: '/logo.jpeg',
    badge: '/badge-icon.png',
    tag: 'snw-notification',
    requireInteraction: true,
    vibrate: [100, 50, 200],
    actions: [
      { action: 'complete', title: '✓ Done' },
      { action: 'snooze', title: '⏰ Later' }
    ],
    data: { url: '/visual-schedule' }
  };

  // Parse push payload if available
  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch (e) {
      console.error('[SW] Error parsing push data:', e);
      // Try as text
      const text = event.data.text();
      if (text) {
        data.body = text;
      }
    }
  }

  // Show the notification
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      tag: data.tag,
      requireInteraction: data.requireInteraction,
      vibrate: data.vibrate,
      actions: data.actions,
      data: data.data,
      // Themed colors (where supported)
      image: data.image,
      silent: false
    })
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  const notification = event.notification;
  const action = event.action;
  const data = notification.data || {};

  // Close the notification
  notification.close();

  if (action === 'complete') {
    // User clicked "Done" - mark activity as complete
    event.waitUntil(
      handleCompleteAction(data)
    );
  } else if (action === 'snooze') {
    // User clicked "Later" - snooze for 5 minutes
    event.waitUntil(
      handleSnoozeAction(data)
    );
  } else {
    // Default click - open the app
    event.waitUntil(
      openApp(data.url || '/visual-schedule')
    );
  }
});

// Handle notification close (dismissed without action)
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification dismissed');
  // Could track dismissed notifications for analytics
});

// Open the app or focus existing window
async function openApp(url) {
  const urlToOpen = new URL(url, self.location.origin).href;
  
  // Check if app is already open
  const windowClients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  });
  
  // Focus existing window if found
  for (const client of windowClients) {
    if (client.url === urlToOpen && 'focus' in client) {
      return client.focus();
    }
  }
  
  // Open new window
  if (self.clients.openWindow) {
    return self.clients.openWindow(urlToOpen);
  }
}

// Handle "Done" action - mark activity complete
async function handleCompleteAction(data) {
  console.log('[SW] Marking complete:', data.notificationId);
  
  // Try to communicate with the app
  const clients = await self.clients.matchAll({ type: 'window' });
  
  for (const client of clients) {
    client.postMessage({
      type: 'NOTIFICATION_ACTION',
      action: 'complete',
      notificationId: data.notificationId,
      timestamp: new Date().toISOString()
    });
  }
  
  // Also open the app if no clients are open
  if (clients.length === 0) {
    await openApp(data.url || '/visual-schedule');
  }
}

// Handle "Later" action - snooze notification
async function handleSnoozeAction(data) {
  console.log('[SW] Snoozing notification:', data.notificationId);
  
  // Show snooze confirmation
  await self.registration.showNotification('⏰ Snoozed', {
    body: 'Reminder will repeat in 5 minutes',
    icon: '/logo.jpeg',
    badge: '/badge-icon.png',
    tag: 'snw-snooze-confirm',
    requireInteraction: false,
    silent: true
  });
  
  // Clear the confirmation after 3 seconds
  setTimeout(async () => {
    const notifications = await self.registration.getNotifications({ tag: 'snw-snooze-confirm' });
    notifications.forEach(n => n.close());
  }, 3000);
  
  // Communicate with app to handle snooze
  const clients = await self.clients.matchAll({ type: 'window' });
  
  for (const client of clients) {
    client.postMessage({
      type: 'NOTIFICATION_ACTION',
      action: 'snooze',
      notificationId: data.notificationId,
      snoozeMinutes: 5
    });
  }
}

// Handle messages from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Handle cancel notification request
  if (event.data && event.data.type === 'CANCEL_NOTIFICATION') {
    self.registration.getNotifications({ tag: event.data.tag })
      .then(notifications => {
        notifications.forEach(n => n.close());
      });
  }
});
