// pushSubscription.js - Web Push subscription management
// Handles subscribing to push notifications and storing in Supabase

import { supabase, isSupabaseConfigured } from './supabase';

// VAPID public key from environment
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

// Convert URL-safe base64 to Uint8Array
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

/**
 * Check if push notifications are supported
 */
export const isPushSupported = () => {
  return 'serviceWorker' in navigator && 
         'PushManager' in window && 
         'Notification' in window;
};

/**
 * Get current push subscription
 */
export const getCurrentSubscription = async () => {
  if (!isPushSupported()) return null;
  
  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error('Error getting subscription:', error);
    return null;
  }
};

/**
 * Subscribe to push notifications
 */
export const subscribeToPush = async (userId) => {
  if (!isPushSupported()) {
    throw new Error('Push notifications not supported');
  }
  
  if (!VAPID_PUBLIC_KEY) {
    throw new Error('VAPID public key not configured');
  }
  
  try {
    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }
    
    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;
    
    // Check for existing subscription
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Create new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }
    
    // Save to Supabase if configured and user is logged in
    if (isSupabaseConfigured() && userId) {
      await saveSubscriptionToDatabase(userId, subscription);
    }
    
    // Also save locally for offline access
    localStorage.setItem('snw_push_subscription', JSON.stringify(subscription.toJSON()));
    
    console.log('Push subscription successful:', subscription.endpoint);
    return subscription;
  } catch (error) {
    console.error('Push subscription error:', error);
    throw error;
  }
};

/**
 * Unsubscribe from push notifications
 */
export const unsubscribeFromPush = async (userId) => {
  try {
    const subscription = await getCurrentSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      
      // Remove from database
      if (isSupabaseConfigured() && userId) {
        await removeSubscriptionFromDatabase(userId, subscription.endpoint);
      }
      
      // Remove local storage
      localStorage.removeItem('snw_push_subscription');
    }
    
    return true;
  } catch (error) {
    console.error('Unsubscribe error:', error);
    throw error;
  }
};

/**
 * Save subscription to Supabase
 */
const saveSubscriptionToDatabase = async (userId, subscription) => {
  const subscriptionJSON = subscription.toJSON();
  
  const { error } = await supabase
    .from('push_subscriptions')
    .upsert({
      user_id: userId,
      endpoint: subscriptionJSON.endpoint,
      p256dh: subscriptionJSON.keys?.p256dh || '',
      auth: subscriptionJSON.keys?.auth || '',
      device_name: getDeviceName(),
      last_used_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,endpoint'
    });
  
  if (error) {
    console.error('Error saving subscription to database:', error);
    throw error;
  }
};

/**
 * Remove subscription from Supabase
 */
const removeSubscriptionFromDatabase = async (userId, endpoint) => {
  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('user_id', userId)
    .eq('endpoint', endpoint);
  
  if (error) {
    console.error('Error removing subscription from database:', error);
  }
};

/**
 * Get device name for identifying subscriptions
 */
const getDeviceName = () => {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS Device';
  if (/Android/.test(ua)) return 'Android Device';
  if (/Windows/.test(ua)) return 'Windows PC';
  if (/Mac/.test(ua)) return 'Mac';
  if (/Linux/.test(ua)) return 'Linux';
  return 'Unknown Device';
};

/**
 * Schedule a notification in the database (for server-side delivery)
 */
export const scheduleServerNotification = async (userId, {
  title,
  body,
  scheduledFor,
  scheduleId = null,
  activityIndex = null,
  repeatUntilComplete = false,
  repeatIntervalMinutes = 5,
}) => {
  if (!isSupabaseConfigured() || !userId) {
    console.log('Cannot schedule server notification - not configured or no user');
    return false;
  }
  
  try {
    const { error } = await supabase
      .from('scheduled_notifications')
      .insert({
        user_id: userId,
        schedule_id: scheduleId,
        activity_index: activityIndex,
        title,
        body,
        scheduled_for: scheduledFor,
        repeat_until_complete: repeatUntilComplete,
        repeat_interval_minutes: repeatIntervalMinutes,
        status: 'pending',
      });
    
    if (error) throw error;
    
    console.log('Server notification scheduled for:', scheduledFor);
    return true;
  } catch (error) {
    console.error('Error scheduling server notification:', error);
    return false;
  }
};

/**
 * Cancel scheduled notifications for a schedule
 */
export const cancelScheduledNotifications = async (userId, scheduleId) => {
  if (!isSupabaseConfigured() || !userId) return false;
  
  try {
    const { error } = await supabase
      .from('scheduled_notifications')
      .update({ status: 'cancelled' })
      .eq('user_id', userId)
      .eq('schedule_id', scheduleId)
      .eq('status', 'pending');
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error cancelling notifications:', error);
    return false;
  }
};

/**
 * Schedule notifications for a day's activities
 */
export const scheduleActivityNotificationsOnServer = async (userId, dateStr, activities, options = {}) => {
  if (!isSupabaseConfigured() || !userId) {
    console.log('Cannot schedule server notifications - not configured or no user');
    return 0;
  }
  
  const {
    reminderMinutesBefore = [0, 5],
    repeatUntilComplete = true,
    repeatIntervalMinutes = 5,
  } = options;
  
  // First, cancel any existing pending notifications for this date
  try {
    await supabase
      .from('scheduled_notifications')
      .update({ status: 'cancelled' })
      .eq('user_id', userId)
      .like('title', `%${dateStr}%`)
      .eq('status', 'pending');
  } catch (err) {
    console.log('Could not cancel existing notifications');
  }
  
  let scheduledCount = 0;
  const now = new Date();
  
  for (let i = 0; i < activities.length; i++) {
    const activity = activities[i];
    
    // Skip if no time, notifications disabled, or already completed
    if (!activity.time || activity.notify === false || activity.completed) {
      continue;
    }
    
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = activity.time.split(':').map(Number);
    const activityTime = new Date(year, month - 1, day, hours, minutes);
    
    // Schedule for each reminder interval
    for (const minsBefore of reminderMinutesBefore) {
      const scheduledFor = new Date(activityTime.getTime() - minsBefore * 60 * 1000);
      
      // Only schedule future notifications
      if (scheduledFor > now) {
        const title = minsBefore === 0 
          ? `⏰ Time for ${activity.name}!`
          : `🔔 ${activity.name} in ${minsBefore} minutes`;
        
        const body = minsBefore === 0
          ? "It's time! You've got this! 💪"
          : `Getting ready for ${activity.name}`;
        
        const success = await scheduleServerNotification(userId, {
          title,
          body,
          scheduledFor: scheduledFor.toISOString(),
          activityIndex: i,
          repeatUntilComplete: repeatUntilComplete && minsBefore === 0,
          repeatIntervalMinutes,
        });
        
        if (success) scheduledCount++;
      }
    }
  }
  
  console.log(`Scheduled ${scheduledCount} server notifications for ${dateStr}`);
  return scheduledCount;
};

export default {
  isPushSupported,
  getCurrentSubscription,
  subscribeToPush,
  unsubscribeFromPush,
  scheduleServerNotification,
  cancelScheduledNotifications,
  scheduleActivityNotificationsOnServer,
};
