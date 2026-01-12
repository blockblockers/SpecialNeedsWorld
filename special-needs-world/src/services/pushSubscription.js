// pushSubscription.js - Web Push subscription management
// Handles push subscription registration and storage

import { supabase, isSupabaseConfigured } from './supabase';

// ============================================
// VAPID PUBLIC KEY
// ============================================
// This should be set in your environment variables
// Generate with: npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

// ============================================
// HELPERS
// ============================================

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

// Convert ArrayBuffer to base64
const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// ============================================
// SERVICE WORKER REGISTRATION
// ============================================

/**
 * Get or register service worker
 */
export const getServiceWorkerRegistration = async () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers not supported');
  }
  
  // Wait for existing registration
  let registration = await navigator.serviceWorker.getRegistration();
  
  if (!registration) {
    // Register if not already registered
    registration = await navigator.serviceWorker.register('/sw.js');
  }
  
  // Wait for it to be ready
  await navigator.serviceWorker.ready;
  
  return registration;
};

// ============================================
// PUSH SUBSCRIPTION
// ============================================

/**
 * Check if push is supported
 */
export const isPushSupported = () => {
  return 'PushManager' in window && 'serviceWorker' in navigator;
};

/**
 * Get current push subscription
 */
export const getCurrentSubscription = async () => {
  if (!isPushSupported()) return null;
  
  try {
    const registration = await getServiceWorkerRegistration();
    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error('Error getting subscription:', error);
    return null;
  }
};

/**
 * Subscribe to push notifications
 */
export const subscribeToPush = async () => {
  if (!isPushSupported()) {
    throw new Error('Push notifications not supported');
  }
  
  if (!VAPID_PUBLIC_KEY) {
    throw new Error('VAPID public key not configured');
  }
  
  try {
    const registration = await getServiceWorkerRegistration();
    
    // Check existing subscription
    let subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      return subscription;
    }
    
    // Create new subscription
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push:', error);
    throw error;
  }
};

/**
 * Unsubscribe from push notifications
 */
export const unsubscribeFromPush = async () => {
  try {
    const subscription = await getCurrentSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return false;
  }
};

// ============================================
// DATABASE OPERATIONS
// ============================================

/**
 * Save push subscription to database
 */
export const savePushSubscriptionToCloud = async (userId, subscription) => {
  if (!isSupabaseConfigured() || !userId || !subscription) return false;
  
  try {
    const subscriptionJson = subscription.toJSON();
    
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: userId,
        endpoint: subscriptionJson.endpoint,
        p256dh: subscriptionJson.keys.p256dh,
        auth: subscriptionJson.keys.auth,
        device_name: getDeviceName(),
      }, {
        onConflict: 'user_id,endpoint'
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving push subscription:', error);
    return false;
  }
};

/**
 * Remove push subscription from database
 */
export const removePushSubscriptionFromCloud = async (userId, endpoint) => {
  if (!isSupabaseConfigured() || !userId) return false;
  
  try {
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', userId)
      .eq('endpoint', endpoint);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing push subscription:', error);
    return false;
  }
};

/**
 * Get user's push subscriptions from database
 */
export const getUserSubscriptions = async (userId) => {
  if (!isSupabaseConfigured() || !userId) return [];
  
  try {
    const { data, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting push subscriptions:', error);
    return [];
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get a friendly device name
 */
const getDeviceName = () => {
  const ua = navigator.userAgent;
  
  if (/iPad/.test(ua)) return 'iPad';
  if (/iPhone/.test(ua)) return 'iPhone';
  if (/Android/.test(ua)) return 'Android';
  if (/Windows/.test(ua)) return 'Windows';
  if (/Mac/.test(ua)) return 'Mac';
  if (/Linux/.test(ua)) return 'Linux';
  
  return 'Unknown Device';
};

// ============================================
// UNIFIED API
// ============================================

/**
 * Enable push notifications for user
 */
export const enablePushNotifications = async (userId) => {
  try {
    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { success: false, error: 'Permission denied' };
    }
    
    // Subscribe to push
    const subscription = await subscribeToPush();
    
    // Save to database
    const saved = await savePushSubscriptionToCloud(userId, subscription);
    
    return { 
      success: true, 
      subscription,
      savedToCloud: saved 
    };
  } catch (error) {
    console.error('Error enabling push:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Disable push notifications for user
 */
export const disablePushNotifications = async (userId) => {
  try {
    const subscription = await getCurrentSubscription();
    
    if (subscription) {
      // Remove from database
      await removePushSubscriptionFromCloud(userId, subscription.endpoint);
      
      // Unsubscribe locally
      await subscription.unsubscribe();
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error disabling push:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if push is enabled for current device
 */
export const isPushEnabled = async () => {
  if (!isPushSupported()) return false;
  
  const subscription = await getCurrentSubscription();
  return subscription !== null;
};

/**
 * Sync current subscription with database
 */
export const syncPushSubscription = async (userId) => {
  if (!isSupabaseConfigured() || !userId) return false;
  
  try {
    const subscription = await getCurrentSubscription();
    
    if (subscription) {
      return await savePushSubscriptionToCloud(userId, subscription);
    }
    
    return false;
  } catch (error) {
    console.error('Error syncing push subscription:', error);
    return false;
  }
};

export default {
  isPushSupported,
  getCurrentSubscription,
  subscribeToPush,
  unsubscribeFromPush,
  savePushSubscriptionToCloud,
  removePushSubscriptionFromCloud,
  getUserSubscriptions,
  enablePushNotifications,
  disablePushNotifications,
  isPushEnabled,
  syncPushSubscription,
};
