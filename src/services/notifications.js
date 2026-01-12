// notifications.js - Push notification support for schedules
// Uses the Notification API and Service Worker
// Supports global/individual settings and recurring reminders

// ============================================
// ENCOURAGING REMINDER MESSAGES
// ============================================

const ENCOURAGING_MESSAGES = [
  {
    title: "🌟 You've got this!",
    body: "Time for {activity}. I believe in you!",
  },
  {
    title: "⭐ Almost time!",
    body: "{activity} is coming up. You're doing amazing today!",
  },
  {
    title: "🎈 Friendly reminder!",
    body: "It's nearly time for {activity}. You're a superstar!",
  },
  {
    title: "🌈 Hey there, friend!",
    body: "{activity} is next. Take your time, you're wonderful!",
  },
  {
    title: "💪 You can do it!",
    body: "Getting ready for {activity}. One step at a time!",
  },
  {
    title: "🎉 Great job today!",
    body: "{activity} is coming up soon. Keep being awesome!",
  },
  {
    title: "🦋 Gentle reminder",
    body: "Time to get ready for {activity}. You're doing so well!",
  },
  {
    title: "🌻 Hello sunshine!",
    body: "{activity} is almost here. I'm proud of you!",
  },
  {
    title: "🐢 No rush!",
    body: "{activity} is next when you're ready. Take a deep breath!",
  },
  {
    title: "💖 You matter!",
    body: "Time for {activity}. Remember, you're loved and capable!",
  },
];

// Get a random encouraging message
const getRandomEncouragingMessage = (activityName) => {
  const message = ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)];
  return {
    title: message.title,
    body: message.body.replace('{activity}', activityName),
  };
};

// Gentle reminder messages for repeat notifications
const REPEAT_REMINDER_MESSAGES = [
  "Still on your list - take your time! 💙",
  "Gentle nudge! Whenever you're ready. 🌸",
  "No rush at all - just a friendly reminder! 🐌",
  "Checking in with love! You've got this! 💝",
  "Still here for you! One step at a time. 🌿",
  "Remember this one? I know you can do it! ⭐",
  "Just a soft reminder - you're doing great! 🦋",
  "Hey friend! This is still waiting for you. 🌼",
  "Sending encouragement your way! 🌈",
  "You haven't forgotten - and neither have I! 🤗",
];

// Get a random repeat reminder message
const getRandomRepeatMessage = () => {
  return REPEAT_REMINDER_MESSAGES[Math.floor(Math.random() * REPEAT_REMINDER_MESSAGES.length)];
};

// ============================================
// SETTINGS STORAGE
// ============================================

const SETTINGS_KEY = 'snw_notification_settings';

const defaultSettings = {
  globalEnabled: true,
  apps: {
    visualSchedule: { enabled: true, reminderMinutes: [5], repeatInterval: 5 },
    nutrition: { enabled: true, reminderMinutes: [5] },
    health: { enabled: true, reminderMinutes: [5] },
    pointToTalk: { enabled: false },
  },
};

export const getNotificationSettings = () => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

export const saveNotificationSettings = (settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const updateAppNotificationSetting = (appId, settings) => {
  const current = getNotificationSettings();
  current.apps[appId] = { ...current.apps[appId], ...settings };
  saveNotificationSettings(current);
  return current;
};

export const setGlobalNotifications = (enabled) => {
  const current = getNotificationSettings();
  current.globalEnabled = enabled;
  saveNotificationSettings(current);
  return current;
};

// ============================================
// PERMISSION & SUPPORT CHECK
// ============================================

export const isNotificationSupported = () => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

export const getPermissionStatus = () => {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
};

export const requestPermission = async () => {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
};

// ============================================
// SCHEDULED NOTIFICATIONS STORAGE
// ============================================

const NOTIFICATIONS_KEY = 'snw_scheduled_notifications';
const ACTIVE_REMINDERS_KEY = 'snw_active_reminders';

const getStoredNotifications = () => {
  try {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveNotifications = (notifications) => {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
};

// Active reminders (recurring until complete)
export const getActiveReminders = () => {
  try {
    const data = localStorage.getItem(ACTIVE_REMINDERS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const saveActiveReminders = (reminders) => {
  localStorage.setItem(ACTIVE_REMINDERS_KEY, JSON.stringify(reminders));
};

// ============================================
// SCHEDULE A NOTIFICATION
// ============================================

export const scheduleNotification = (id, title, body, scheduledTime, options = {}) => {
  const settings = getNotificationSettings();
  if (!settings.globalEnabled) return;
  
  const notifications = getStoredNotifications();
  const filtered = notifications.filter(n => n.id !== id);
  
  filtered.push({
    id,
    title,
    body,
    scheduledTime: scheduledTime.getTime(),
    icon: options.icon || '/logo.jpeg',
    appId: options.appId || 'general',
    activityId: options.activityId,
    shown: false,
    recurring: options.recurring || false,
    repeatInterval: options.repeatInterval || 5, // minutes
  });
  
  saveNotifications(filtered);
  
  const now = Date.now();
  const delay = scheduledTime.getTime() - now;
  
  if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
    setTimeout(() => {
      showNotification(id);
    }, delay);
  }
};

export const cancelNotification = (id) => {
  const notifications = getStoredNotifications();
  const filtered = notifications.filter(n => n.id !== id);
  saveNotifications(filtered);
};

export const cancelAllNotifications = () => {
  saveNotifications([]);
  saveActiveReminders({});
};

export const cancelNotificationsForActivity = (activityId) => {
  const notifications = getStoredNotifications();
  const filtered = notifications.filter(n => n.activityId !== activityId);
  saveNotifications(filtered);
  
  // Also remove from active reminders
  const reminders = getActiveReminders();
  delete reminders[activityId];
  saveActiveReminders(reminders);
};

// ============================================
// SHOW NOTIFICATION
// ============================================

export const showNotification = async (id) => {
  const settings = getNotificationSettings();
  if (!settings.globalEnabled) return;
  
  const notifications = getStoredNotifications();
  const notification = notifications.find(n => n.id === id);
  
  if (!notification || notification.shown) return;
  
  // Check app-specific setting
  const appSettings = settings.apps[notification.appId];
  if (appSettings && !appSettings.enabled) return;
  
  if (getPermissionStatus() !== 'granted') return;
  
  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(notification.title, {
        body: notification.body,
        icon: notification.icon,
        badge: '/favicon-32.png',
        tag: notification.id,
        requireInteraction: true,
        vibrate: [200, 100, 200],
        actions: [
          { action: 'complete', title: '✓ Done' },
          { action: 'snooze', title: '⏰ Snooze' },
        ],
      });
    } else {
      new Notification(notification.title, {
        body: notification.body,
        icon: notification.icon,
      });
    }
    
    notification.shown = true;
    saveNotifications(notifications);
    
    // If recurring, schedule next reminder
    if (notification.recurring && notification.activityId) {
      scheduleRecurringReminder(notification);
    }
    
  } catch (error) {
    console.error('Error showing notification:', error);
  }
};

// ============================================
// RECURRING REMINDERS (until activity complete)
// ============================================

const scheduleRecurringReminder = (notification) => {
  const reminders = getActiveReminders();
  
  // Check if activity is still incomplete
  if (!reminders[notification.activityId]?.active) return;
  
  const settings = getNotificationSettings();
  const appSettings = settings.apps[notification.appId];
  const repeatInterval = appSettings?.repeatInterval || 5;
  
  const nextTime = new Date(Date.now() + repeatInterval * 60 * 1000);
  
  // Get activity name from reminders or notification
  const activityName = reminders[notification.activityId]?.title || notification.activityName || 'Activity';
  
  // Get a fresh encouraging message for the repeat
  const encouragingMsg = getRandomEncouragingMessage(activityName);
  const repeatBody = getRandomRepeatMessage();
  
  scheduleNotification(
    `${notification.id}_repeat_${Date.now()}`,
    `🔔 ${activityName}`,
    repeatBody,
    nextTime,
    {
      appId: notification.appId,
      activityId: notification.activityId,
      activityName: activityName,
      recurring: true,
      repeatInterval,
    }
  );
};

export const startRecurringReminder = (activityId, title, body, appId = 'visualSchedule') => {
  const reminders = getActiveReminders();
  reminders[activityId] = { active: true, title, body, appId, startedAt: Date.now() };
  saveActiveReminders(reminders);
};

export const stopRecurringReminder = (activityId) => {
  const reminders = getActiveReminders();
  if (reminders[activityId]) {
    reminders[activityId].active = false;
  }
  saveActiveReminders(reminders);
  cancelNotificationsForActivity(activityId);
};

// ============================================
// SCHEDULE NOTIFICATIONS FOR A DAY'S ACTIVITIES
// ============================================

export const scheduleActivityNotifications = (dateStr, activities, options = {}) => {
  const settings = getNotificationSettings();
  if (!settings.globalEnabled) return;
  
  const appSettings = settings.apps.visualSchedule;
  if (!appSettings?.enabled) return;
  
  // Cancel existing notifications for this date
  const notifications = getStoredNotifications();
  const filtered = notifications.filter(n => !n.id.startsWith(`activity_${dateStr}`));
  saveNotifications(filtered);
  
  const reminderMinutes = appSettings.reminderMinutes || [5];
  const repeatInterval = appSettings.repeatInterval || 5;
  const repeatUntilComplete = options.repeatUntilComplete !== false;
  
  activities.forEach((activity, index) => {
    if (activity.time && activity.notify !== false && !activity.completed) {
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hours, minutes] = activity.time.split(':').map(Number);
      
      const activityTime = new Date(year, month - 1, day, hours, minutes);
      
      // Schedule reminders at each interval
      reminderMinutes.forEach((minsBefore) => {
        const reminderTime = new Date(activityTime.getTime() - minsBefore * 60 * 1000);
        
        if (reminderTime > new Date()) {
          const activityId = `${dateStr}_${index}`;
          
          // Get encouraging message
          const encouragingMsg = getRandomEncouragingMessage(activity.name);
          
          scheduleNotification(
            `activity_${activityId}_${minsBefore}`,
            encouragingMsg.title,
            minsBefore > 0 
              ? `${activity.name} in ${minsBefore} minutes! ${encouragingMsg.body}`
              : encouragingMsg.body,
            reminderTime,
            {
              appId: 'visualSchedule',
              activityId,
              activityName: activity.name, // Store for repeat messages
              recurring: repeatUntilComplete && minsBefore === 0,
              repeatInterval,
            }
          );
          
          // Start recurring reminder tracking
          if (repeatUntilComplete && minsBefore === 0) {
            startRecurringReminder(activityId, activity.name, 'Not yet completed');
          }
        }
      });
    }
  });
};

// Mark activity complete and stop reminders
export const markActivityComplete = (dateStr, activityIndex) => {
  const activityId = `${dateStr}_${activityIndex}`;
  stopRecurringReminder(activityId);
};

// ============================================
// CHECK & SHOW DUE NOTIFICATIONS ON LOAD
// ============================================

export const checkPendingNotifications = () => {
  const settings = getNotificationSettings();
  if (!settings.globalEnabled) return;
  
  const notifications = getStoredNotifications();
  const now = Date.now();
  
  notifications.forEach(notification => {
    if (!notification.shown && notification.scheduledTime <= now) {
      showNotification(notification.id);
    }
  });
  
  // Clean up old notifications (older than 24 hours)
  const cutoff = now - 24 * 60 * 60 * 1000;
  const recent = notifications.filter(n => n.scheduledTime > cutoff);
  saveNotifications(recent);
};

// ============================================
// INITIALIZE ON APP LOAD
// ============================================

export const initNotifications = () => {
  if (!isNotificationSupported()) return;
  checkPendingNotifications();
  setInterval(checkPendingNotifications, 60 * 1000);
};

export default {
  isNotificationSupported,
  getPermissionStatus,
  requestPermission,
  getNotificationSettings,
  saveNotificationSettings,
  updateAppNotificationSetting,
  setGlobalNotifications,
  scheduleNotification,
  cancelNotification,
  cancelAllNotifications,
  cancelNotificationsForActivity,
  showNotification,
  startRecurringReminder,
  stopRecurringReminder,
  scheduleActivityNotifications,
  markActivityComplete,
  checkPendingNotifications,
  initNotifications,
};
