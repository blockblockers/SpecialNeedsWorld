// PushNotificationPrompt.jsx
// Prompts users to enable push notifications for reminders
// FIXED: Now properly subscribes to push notifications when enabled
// Only shows for logged-in users who haven't enabled notifications yet

import { useState, useEffect } from 'react';
import { X, Bell, BellRing, CheckCircle, Clock, Calendar, Sparkles, Loader2 } from 'lucide-react';
// ✅ FIX: Import push subscription function
import { subscribeToPush } from '../services/pushSubscription';

// Check if notifications are supported
const isNotificationSupported = () => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

// Check current notification permission status
const getNotificationStatus = () => {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission; // 'default', 'granted', 'denied'
};

const PushNotificationPrompt = ({ user }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [status, setStatus] = useState(getNotificationStatus());
  const [justEnabled, setJustEnabled] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  // ✅ FIX: Add loading state
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    // Don't show for guests or if not logged in
    if (!user || user.isGuest) {
      return;
    }

    // Don't show if not supported
    if (!isNotificationSupported()) {
      return;
    }

    // Don't show if already granted or denied
    if (Notification.permission !== 'default') {
      return;
    }

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('snw_notification_prompt_dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    // Show again after 14 days
    if (dismissed && daysSinceDismissed < 14) {
      return;
    }

    // Show prompt after a short delay (after PWA install prompt)
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [user]);

  // ✅ FIX: Handle enable notifications - now properly subscribes to push
  const handleEnableNotifications = async () => {
    setIsSubscribing(true);
    
    try {
      const permission = await Notification.requestPermission();
      setStatus(permission);

      if (permission === 'granted') {
        // ✅ FIX: Actually subscribe to push notifications!
        try {
          if (user?.id) {
            console.log('Subscribing to push with user ID:', user.id);
            await subscribeToPush(user.id);
            console.log('✅ Push subscription saved to database!');
          } else {
            // No user ID yet - save locally, will sync when user logs in
            console.warn('No user ID - saving subscription locally only');
            await subscribeToPush(null);
          }
        } catch (subError) {
          console.error('Failed to subscribe to push:', subError);
          // Don't block success - permission was granted, subscription may have failed
        }

        setJustEnabled(true);
        setShowPrompt(false);
        localStorage.removeItem('snw_notification_prompt_dismissed');

        // Show success message briefly
        setTimeout(() => {
          setJustEnabled(false);
        }, 4000);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    } finally {
      setIsSubscribing(false);
    }
  };

  // Handle dismiss
  const handleDismiss = () => {
    setShowPrompt(false);
    setShowDetails(false);
    localStorage.setItem('snw_notification_prompt_dismissed', Date.now().toString());
  };

  // Don't render for guests or unsupported browsers
  if (!user || user.isGuest || !isNotificationSupported()) {
    return null;
  }

  // Show success message
  if (justEnabled) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-bounce-soft">
        <div className="max-w-md mx-auto bg-[#5CB85C] text-white rounded-2xl p-4 shadow-lg border-4 border-green-600 flex items-center gap-3">
          <CheckCircle size={32} />
          <div>
            <p className="font-display text-lg">Notifications Enabled! 🔔</p>
            <p className="font-crayon text-sm opacity-90">You'll receive helpful reminders</p>
          </div>
        </div>
      </div>
    );
  }

  if (!showPrompt) {
    return null;
  }

  // Detailed information modal
  if (showDetails) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
        <div 
          className="bg-[#FFFEF5] w-full max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl
                     border-4 border-[#F5A623] animate-slide-up"
        >
          {/* Header */}
          <div className="bg-[#F5A623] text-white p-4 flex items-center justify-between">
            <h3 className="font-display text-xl flex items-center gap-2">
              <BellRing size={24} />
              Stay on Track!
            </h3>
            <button 
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="font-crayon text-gray-700">
              Get gentle reminders throughout the day to help with:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[#E63B2E]/10 rounded-xl">
                <Calendar className="text-[#E63B2E] flex-shrink-0" size={24} />
                <div>
                  <p className="font-display text-sm text-[#E63B2E]">Visual Schedule</p>
                  <p className="font-crayon text-xs text-gray-600">Activity reminders</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-[#5CB85C]/10 rounded-xl">
                <Clock className="text-[#5CB85C] flex-shrink-0" size={24} />
                <div>
                  <p className="font-display text-sm text-[#5CB85C]">Medication & Meals</p>
                  <p className="font-crayon text-xs text-gray-600">Health reminders</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-[#8E6BBF]/10 rounded-xl">
                <Sparkles className="text-[#8E6BBF] flex-shrink-0" size={24} />
                <div>
                  <p className="font-display text-sm text-[#8E6BBF]">Celebrations</p>
                  <p className="font-crayon text-xs text-gray-600">Task completion alerts</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-gray-100 rounded-xl">
              <p className="font-crayon text-xs text-gray-500 flex items-start gap-2">
                <span className="text-lg">🔒</span>
                <span>Your notifications are private and only appear on this device. 
                We never share your schedule.</span>
              </p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="px-6 pb-6 space-y-3">
            <button
              onClick={handleEnableNotifications}
              disabled={isSubscribing}
              className="w-full py-3 bg-[#5CB85C] text-white rounded-xl font-display text-lg
                       hover:bg-green-600 transition-all flex items-center justify-center gap-2 shadow-md
                       disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubscribing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <Bell size={20} />
                  Enable Notifications
                </>
              )}
            </button>
            <button
              onClick={handleDismiss}
              disabled={isSubscribing}
              className="w-full py-3 bg-gray-200 rounded-xl font-crayon text-gray-600 hover:bg-gray-300 transition-colors
                       disabled:opacity-50"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main compact prompt banner
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div 
        className="max-w-md mx-auto bg-[#FFFEF5] rounded-2xl shadow-2xl overflow-hidden
                   border-4 border-[#F5A623]"
      >
        <div className="p-4 flex items-center gap-3">
          {/* Icon */}
          <div className="w-14 h-14 rounded-xl bg-[#F5A623] flex items-center justify-center flex-shrink-0 shadow-md">
            <BellRing size={28} className="text-white" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-base text-[#F5A623] leading-tight">
              Enable Notifications
            </h3>
            <p className="font-crayon text-xs text-gray-600 mt-0.5">
              Get reminders for appointments & medication
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button
              onClick={() => setShowDetails(true)}
              className="px-3 py-1.5 bg-[#5CB85C] text-white rounded-lg font-crayon text-sm
                       hover:bg-green-600 transition-all flex items-center gap-1.5 shadow-sm
                       active:scale-95"
            >
              <Bell size={14} />
              Enable
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded-lg font-crayon text-sm
                       hover:bg-gray-300 transition-all active:scale-95"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export utility hook to check notification status
export const useNotificationStatus = () => {
  const [status, setStatus] = useState(getNotificationStatus());
  
  useEffect(() => {
    // Listen for permission changes (if browser supports it)
    const checkPermission = () => {
      setStatus(getNotificationStatus());
    };
    
    // Check periodically since there's no direct event for permission changes
    const interval = setInterval(checkPermission, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return {
    status,
    isEnabled: status === 'granted',
    isDenied: status === 'denied',
    isDefault: status === 'default',
    isSupported: isNotificationSupported(),
  };
};

export default PushNotificationPrompt;
