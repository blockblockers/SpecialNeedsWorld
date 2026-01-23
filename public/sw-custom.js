// sw-custom.js - Custom service worker for ATLASassist
// UPDATED: Uses monochrome heart badge icon for Android notifications
// The badge icon MUST be monochrome (white on transparent) for Android

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
            badge: '/badge-icon.png', // Monochrome heart icon
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

// Listen for push events
self.addEventListener('push', (event) => {
  console.log('Push received:', event);
  
  // Default notification options with monochrome badge
  let notificationOptions = {
    title: 'ATLASassist',
    body: 'You have a new notification',
    icon: '/logo.jpeg',
    badge: '/badge-icon.png', // Monochrome heart icon for Android tray
    tag: 'atlas-notification',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: { url: '/' },
    actions: [
      { action: 'complete', title: '✓ Done' },
      { action: 'snooze', title: '⏰ Snooze' },
    ],
  };
  
  if (event.data) {
    try {
      const payload = event.data.json();
      notificationOptions = {
        ...notificationOptions,
        title: payload.title || notificationOptions.title,
        body: payload.body || notificationOptions.body,
        icon: payload.icon || notificationOptions.icon,
        badge: '/badge-icon.png', // Always use monochrome badge
        tag: payload.tag || notificationOptions.tag,
        requireInteraction: payload.requireInteraction ?? notificationOptions.requireInteraction,
        vibrate: payload.vibrate || notificationOptions.vibrate,
        data: payload.data || notificationOptions.data,
        actions: payload.actions || notificationOptions.actions,
      };
    } catch (e) {
      console.error('[SW] Error parsing push data:', e);
      // Try as text
      const text = event.data.text();
      if (text) {
        notificationOptions.body = text;
      }
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationOptions.title, notificationOptions)
  );
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
        badge: '/badge-icon.png', // Monochrome heart icon
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
