// Custom service worker additions for ATLASassist
// This file extends the Workbox-generated service worker

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  const action = event.action;
  const notificationData = event.notification.data || {};
  
  if (action === 'complete') {
    // Mark activity as complete
    // This will be handled by broadcasting to all clients
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'ACTIVITY_COMPLETE',
            activityId: notificationData.activityId,
          });
        });
      })
    );
  } else if (action === 'snooze') {
    // Snooze for 5 minutes
    const snoozeTime = 5 * 60 * 1000;
    event.waitUntil(
      new Promise((resolve) => {
        setTimeout(() => {
          self.registration.showNotification(event.notification.title, {
            body: '⏰ Snoozed reminder - time to check on this!',
            icon: '/logo.jpeg',
            badge: '/favicon-32.png',
            tag: event.notification.tag + '_snooze',
            requireInteraction: true,
            vibrate: [200, 100, 200],
            data: notificationData,
            actions: [
              { action: 'complete', title: '✓ Done' },
              { action: 'snooze', title: '⏰ Snooze' },
            ],
          });
          resolve();
        }, snoozeTime);
      })
    );
  } else {
    // Default: open the app
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clients) => {
        // Check if there's already a window open
        for (const client of clients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open one
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
});

// Listen for push events (for future push notification support)
self.addEventListener('push', (event) => {
  console.log('Push received:', event);
  
  if (event.data) {
    const data = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'ATLASassist', {
        body: data.body || 'You have a new notification',
        icon: data.icon || '/logo.jpeg',
        badge: '/favicon-32.png',
        tag: data.tag || 'atlas-notification',
        requireInteraction: data.requireInteraction || false,
        vibrate: data.vibrate || [200, 100, 200],
        data: data.data || {},
        actions: data.actions || [],
      })
    );
  }
});

// Handle messages from the main app
self.addEventListener('message', (event) => {
  console.log('Service worker received message:', event.data);
  
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon, tag, requireInteraction, vibrate, data, actions } = event.data;
    
    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: icon || '/logo.jpeg',
        badge: '/favicon-32.png',
        tag: tag || 'atlas-notification-' + Date.now(),
        requireInteraction: requireInteraction || false,
        vibrate: vibrate || [200, 100, 200],
        data: data || {},
        actions: actions || [],
      })
    );
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('ATLASassist custom service worker loaded');
