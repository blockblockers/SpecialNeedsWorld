// Settings.jsx - Global app settings
// FIXED: Now properly saves push subscription and notification settings to Supabase
// This enables server-side push notifications to work!

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  Bell, 
  BellOff,
  Clock,
  Calendar,
  MessageSquare,
  Heart,
  Utensils,
  Volume2,
  ChevronRight,
  Check,
  Info,
  User,
  Edit2,
  Save,
  Cloud,
  CloudOff,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  isNotificationSupported,
  getPermissionStatus,
  requestPermission,
  getNotificationSettings,
  saveNotificationSettings,
  setGlobalNotifications,
  updateAppNotificationSetting,
  sendTestNotification,
  syncSettingsToCloud,
  loadSettingsFromCloud,
} from '../services/notifications';
import { 
  subscribeToPush, 
  unsubscribeFromPush,
  isPushSupported,
  getCurrentSubscription,
} from '../services/pushSubscription';
import { useAuth } from '../App';

// Reminder time options
const REMINDER_OPTIONS = [
  { value: 0, label: 'At time' },
  { value: 5, label: '5 min before' },
  { value: 10, label: '10 min before' },
  { value: 15, label: '15 min before' },
  { value: 30, label: '30 min before' },
  { value: 60, label: '1 hour before' },
];

// Repeat interval options
const REPEAT_OPTIONS = [
  { value: 1, label: 'Every 1 min' },
  { value: 2, label: 'Every 2 min' },
  { value: 5, label: 'Every 5 min' },
  { value: 10, label: 'Every 10 min' },
  { value: 15, label: 'Every 15 min' },
];

// App notification configs
const APP_CONFIGS = [
  { 
    id: 'visualSchedule', 
    name: 'Visual Schedule', 
    icon: Calendar, 
    color: '#E63B2E',
    description: 'Reminders for scheduled activities',
    hasReminders: true,
    hasRepeat: true,
  },
  { 
    id: 'nutrition', 
    name: 'Nutrition & Recipes', 
    icon: Utensils, 
    color: '#5CB85C',
    description: 'Meal time reminders',
    hasReminders: true,
    hasRepeat: false,
  },
  { 
    id: 'health', 
    name: 'Health', 
    icon: Heart, 
    color: '#E86B9A',
    description: 'Health tracking reminders',
    hasReminders: true,
    hasRepeat: false,
  },
  { 
    id: 'pointToTalk', 
    name: 'Point to Talk', 
    icon: MessageSquare, 
    color: '#F5A623',
    description: 'No notifications needed',
    hasReminders: false,
    hasRepeat: false,
  },
];

const Settings = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const [settings, setSettings] = useState(getNotificationSettings());
  const [permissionStatus, setPermissionStatus] = useState(getPermissionStatus());
  const [expandedApp, setExpandedApp] = useState(null);
  const notificationsSupported = isNotificationSupported();
  
  // Profile state
  const [displayName, setDisplayName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  
  // Push subscription state
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [syncingSettings, setSyncingSettings] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null); // 'success', 'error', null
  const [enablingPush, setEnablingPush] = useState(false);

  // Load profile settings
  useEffect(() => {
    const savedName = localStorage.getItem('snw_display_name');
    if (savedName) {
      setDisplayName(savedName);
    } else if (user?.user_metadata?.full_name) {
      setDisplayName(user.user_metadata.full_name);
    } else if (user?.email) {
      setDisplayName(user.email.split('@')[0]);
    }
  }, [user]);

  // Check permission and push subscription on mount
  useEffect(() => {
    setPermissionStatus(getPermissionStatus());
    checkPushSubscription();
    
    // Load settings from cloud if logged in
    if (user?.id && !isGuest) {
      loadSettingsFromCloud(user.id).then(cloudSettings => {
        if (cloudSettings) {
          setSettings(cloudSettings);
        }
      });
    }
  }, [user?.id, isGuest]);
  
  // Check if user is subscribed to push notifications
  const checkPushSubscription = async () => {
    if (!isPushSupported()) return;
    
    try {
      const subscription = await getCurrentSubscription();
      setPushSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking push subscription:', error);
    }
  };

  // Save display name
  const handleSaveName = () => {
    if (tempName.trim()) {
      setDisplayName(tempName.trim());
      localStorage.setItem('snw_display_name', tempName.trim());
    }
    setIsEditingName(false);
  };

  // Start editing name
  const startEditingName = () => {
    setTempName(displayName || '');
    setIsEditingName(true);
  };

  // Initialize tempName when displayName loads
  useEffect(() => {
    if (isEditingName && !tempName && displayName) {
      setTempName(displayName);
    }
  }, [displayName, isEditingName, tempName]);

  // Handle global toggle - THIS IS THE KEY FIX
  const handleGlobalToggle = async () => {
    // If turning ON notifications
    if (!settings.globalEnabled) {
      setEnablingPush(true);
      
      try {
        // First, request browser permission
        if (permissionStatus !== 'granted') {
          const result = await requestPermission();
          setPermissionStatus(result);
          if (result !== 'granted') {
            setEnablingPush(false);
            return;
          }
        }
        
        // Subscribe to push notifications (saves to Supabase)
        if (user?.id && !isGuest && isPushSupported()) {
          try {
            await subscribeToPush(user.id);
            setPushSubscribed(true);
            console.log('✓ Push subscription saved to Supabase');
          } catch (pushError) {
            console.error('Push subscription error:', pushError);
            // Continue anyway - local notifications will still work
          }
        }
        
        // Update settings
        const newSettings = setGlobalNotifications(true);
        setSettings(newSettings);
        
        // Sync settings to Supabase
        if (user?.id && !isGuest) {
          setSyncingSettings(true);
          const synced = await syncSettingsToCloud(user.id);
          setSyncStatus(synced ? 'success' : 'error');
          setSyncingSettings(false);
          
          // Clear status after 3 seconds
          setTimeout(() => setSyncStatus(null), 3000);
        }
      } catch (error) {
        console.error('Error enabling notifications:', error);
        setSyncStatus('error');
      } finally {
        setEnablingPush(false);
      }
    } else {
      // Turning OFF notifications
      const newSettings = setGlobalNotifications(false);
      setSettings(newSettings);
      
      // Unsubscribe from push
      if (user?.id && !isGuest) {
        try {
          await unsubscribeFromPush(user.id);
          setPushSubscribed(false);
        } catch (error) {
          console.error('Unsubscribe error:', error);
        }
        
        // Sync settings to Supabase
        const synced = await syncSettingsToCloud(user.id);
        setSyncStatus(synced ? 'success' : 'error');
        setTimeout(() => setSyncStatus(null), 3000);
      }
    }
  };

  // Handle app toggle
  const handleAppToggle = async (appId) => {
    const currentEnabled = settings.apps[appId]?.enabled ?? true;
    const newSettings = updateAppNotificationSetting(appId, { enabled: !currentEnabled });
    setSettings(newSettings);
    
    // Sync to cloud
    if (user?.id && !isGuest) {
      await syncSettingsToCloud(user.id);
    }
  };

  // Handle reminder change
  const handleReminderChange = async (appId, minutes) => {
    const current = settings.apps[appId]?.reminderMinutes || [0, 5];
    const newMinutes = current.includes(minutes)
      ? current.filter(m => m !== minutes)
      : [...current, minutes].sort((a, b) => a - b);
    
    const newSettings = updateAppNotificationSetting(appId, { reminderMinutes: newMinutes });
    setSettings(newSettings);
    
    // Sync to cloud
    if (user?.id && !isGuest) {
      await syncSettingsToCloud(user.id);
    }
  };

  // Handle repeat interval change
  const handleRepeatChange = async (appId, interval) => {
    const newSettings = updateAppNotificationSetting(appId, { repeatInterval: interval });
    setSettings(newSettings);
    
    // Sync to cloud
    if (user?.id && !isGuest) {
      await syncSettingsToCloud(user.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                       rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <SettingsIcon size={24} className="text-[#8E6BBF]" />
          <h1 className="text-xl font-display text-[#8E6BBF] crayon-text">
            Settings
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* Profile Section */}
        <section className="bg-white rounded-2xl border-4 border-[#8E6BBF] shadow-crayon overflow-hidden">
          <div className="bg-[#8E6BBF] text-white p-4">
            <h2 className="font-display text-xl flex items-center gap-2">
              <User size={24} />
              Profile
            </h2>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#8E6BBF]/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="px-3 py-1.5 border-2 border-[#8E6BBF] rounded-lg font-crayon focus:outline-none focus:ring-2 focus:ring-[#8E6BBF]/50"
                        placeholder="Your name"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                      />
                      <button
                        onClick={handleSaveName}
                        className="p-2 bg-[#5CB85C] text-white rounded-lg hover:bg-green-600"
                      >
                        <Save size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="font-display text-lg">{displayName || 'Friend'}</p>
                      <button
                        onClick={startEditingName}
                        className="p-1.5 text-gray-400 hover:text-[#8E6BBF] hover:bg-[#8E6BBF]/10 rounded-lg transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                  <p className="font-crayon text-sm text-gray-500">
                    {isGuest ? 'Guest Mode' : user?.app_metadata?.provider === 'google' ? 'Signed in with Google' : ' Signed in with Email'}
                  </p>
                </div>
              </div>
            </div>
            
            {user && !isGuest && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="font-crayon text-xs text-gray-500">
                  Email: {user.email}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-white rounded-2xl border-4 border-[#4A9FD4] shadow-crayon overflow-hidden">
          <div className="bg-[#4A9FD4] text-white p-4">
            <h2 className="font-display text-xl flex items-center gap-2">
              <Bell size={24} />
              Notifications
            </h2>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Browser Support Warning */}
            {!notificationsSupported && (
              <div className="p-3 bg-[#F5A623]/20 rounded-xl border-2 border-[#F5A623]">
                <p className="font-crayon text-sm text-[#F5A623] flex items-center gap-2">
                  <Info size={16} />
                  Notifications are not supported in this browser.
                </p>
              </div>
            )}
            
            {/* Permission Status */}
            {notificationsSupported && permissionStatus === 'denied' && (
              <div className="p-3 bg-[#E63B2E]/20 rounded-xl border-2 border-[#E63B2E]">
                <p className="font-crayon text-sm text-[#E63B2E]">
                  ⚠️ Notifications are blocked. Please enable them in your browser settings.
                </p>
              </div>
            )}
            
            {/* Push Subscription Status */}
            {user && !isGuest && settings.globalEnabled && permissionStatus === 'granted' && (
              <div className={`p-3 rounded-xl border-2 flex items-center gap-2 ${
                pushSubscribed 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-orange-50 border-orange-300'
              }`}>
                {pushSubscribed ? (
                  <>
                    <CheckCircle size={16} className="text-green-600" />
                    <p className="font-crayon text-sm text-green-700">
                      Push notifications enabled - works even when app is closed!
                    </p>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} className="text-orange-600" />
                    <p className="font-crayon text-sm text-orange-700">
                      Push subscription not active. Toggle off and on to fix.
                    </p>
                  </>
                )}
              </div>
            )}
            
            {/* Cloud Sync Status */}
            {syncStatus && (
              <div className={`p-3 rounded-xl border-2 flex items-center gap-2 ${
                syncStatus === 'success' 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-red-50 border-red-300'
              }`}>
                {syncStatus === 'success' ? (
                  <>
                    <Cloud size={16} className="text-green-600" />
                    <p className="font-crayon text-sm text-green-700">
                      Settings synced to cloud ✓
                    </p>
                  </>
                ) : (
                  <>
                    <CloudOff size={16} className="text-red-600" />
                    <p className="font-crayon text-sm text-red-700">
                      Failed to sync settings
                    </p>
                  </>
                )}
              </div>
            )}
            
            {/* Global Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                {settings.globalEnabled ? (
                  <Bell size={24} className="text-[#5CB85C]" />
                ) : (
                  <BellOff size={24} className="text-gray-400" />
                )}
                <div>
                  <p className="font-display text-lg">All Notifications</p>
                  <p className="font-crayon text-sm text-gray-500">
                    {settings.globalEnabled ? 'Notifications are enabled' : 'All notifications are off'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleGlobalToggle}
                disabled={!notificationsSupported || enablingPush}
                className={`w-14 h-8 rounded-full transition-all relative ${
                  settings.globalEnabled ? 'bg-[#5CB85C]' : 'bg-gray-300'
                } ${(!notificationsSupported || enablingPush) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {enablingPush ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 size={16} className="animate-spin text-white" />
                  </div>
                ) : (
                  <div className={`w-6 h-6 bg-white rounded-full shadow absolute top-1 transition-all ${
                    settings.globalEnabled ? 'right-1' : 'left-1'
                  }`} />
                )}
              </button>
            </div>
            
            {/* Test Notification Button */}
            {settings.globalEnabled && permissionStatus === 'granted' && (
              <button
                onClick={async () => {
                  const success = await sendTestNotification();
                  if (!success) {
                    alert('Notification test failed. Please make sure:\n\n1. The app is installed as a PWA (Add to Home Screen)\n2. Notifications are enabled in your device settings\n3. You\'re not in Do Not Disturb mode');
                  }
                }}
                className="w-full py-3 bg-[#F5A623] text-white rounded-xl font-crayon flex items-center justify-center gap-2 hover:bg-[#E09612] transition-colors"
              >
                <Bell size={18} />
                Send Test Notification
              </button>
            )}
            
            {/* Request Permission Button */}
            {notificationsSupported && permissionStatus === 'default' && (
              <button
                onClick={handleGlobalToggle}
                disabled={enablingPush}
                className="w-full py-3 bg-[#4A9FD4] text-white rounded-xl font-crayon flex items-center justify-center gap-2 hover:bg-[#3A8FC4] transition-colors disabled:opacity-50"
              >
                {enablingPush ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Enabling...
                  </>
                ) : (
                  <>
                    <Bell size={18} />
                    Enable Notifications
                  </>
                )}
              </button>
            )}
            
            {/* iOS Safari Warning */}
            {/iPhone|iPad|iPod/.test(navigator.userAgent) && !window.matchMedia('(display-mode: standalone)').matches && (
              <div className="p-3 bg-[#4A9FD4]/20 rounded-xl border-2 border-[#4A9FD4]">
                <p className="font-crayon text-sm text-[#4A9FD4]">
                  📱 <strong>iPhone/iPad Users:</strong> To receive notifications, please install this app by tapping the Share button and selecting "Add to Home Screen".
                </p>
              </div>
            )}
            
            {/* Guest Mode Warning */}
            {isGuest && (
              <div className="p-3 bg-[#F5A623]/20 rounded-xl border-2 border-[#F5A623]">
                <p className="font-crayon text-sm text-[#F5A623]">
                  ⚠️ <strong>Guest Mode:</strong> Notifications work locally but won't sync across devices. Sign in for full notification support.
                </p>
              </div>
            )}
            
            {/* Per-App Settings */}
            {settings.globalEnabled && permissionStatus === 'granted' && (
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <h3 className="font-display text-sm text-gray-600">App Notifications</h3>
                
                {APP_CONFIGS.map(app => {
                  const AppIcon = app.icon;
                  const appSettings = settings.apps[app.id] || {};
                  const isExpanded = expandedApp === app.id;
                  
                  return (
                    <div 
                      key={app.id}
                      className="border-2 border-gray-200 rounded-xl overflow-hidden"
                    >
                      {/* App Header */}
                      <div 
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                        onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${app.color}20` }}
                          >
                            <AppIcon size={20} style={{ color: app.color }} />
                          </div>
                          <div>
                            <p className="font-display text-sm">{app.name}</p>
                            <p className="font-crayon text-xs text-gray-500">{app.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAppToggle(app.id);
                            }}
                            className={`w-12 h-6 rounded-full transition-all relative ${
                              appSettings.enabled !== false ? 'bg-[#5CB85C]' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${
                              appSettings.enabled !== false ? 'right-0.5' : 'left-0.5'
                            }`} />
                          </button>
                          {app.hasReminders && (
                            <ChevronRight 
                              size={20} 
                              className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                            />
                          )}
                        </div>
                      </div>
                      
                      {/* Expanded Settings */}
                      {isExpanded && app.hasReminders && appSettings.enabled !== false && (
                        <div className="p-3 pt-0 space-y-3 border-t border-gray-100">
                          {/* Reminder Times */}
                          <div>
                            <p className="font-crayon text-xs text-gray-600 mb-2">Remind me:</p>
                            <div className="flex flex-wrap gap-2">
                              {REMINDER_OPTIONS.map(option => {
                                const isSelected = (appSettings.reminderMinutes || [0, 5]).includes(option.value);
                                return (
                                  <button
                                    key={option.value}
                                    onClick={() => handleReminderChange(app.id, option.value)}
                                    className={`px-3 py-1.5 rounded-lg font-crayon text-xs transition-all ${
                                      isSelected
                                        ? 'bg-[#4A9FD4] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                  >
                                    {isSelected && <Check size={12} className="inline mr-1" />}
                                    {option.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          
                          {/* Repeat Interval */}
                          {app.hasRepeat && (
                            <div>
                              <p className="font-crayon text-xs text-gray-600 mb-2">Repeat until done:</p>
                              <div className="flex flex-wrap gap-2">
                                {REPEAT_OPTIONS.map(option => {
                                  const isSelected = (appSettings.repeatInterval || 5) === option.value;
                                  return (
                                    <button
                                      key={option.value}
                                      onClick={() => handleRepeatChange(app.id, option.value)}
                                      className={`px-3 py-1.5 rounded-lg font-crayon text-xs transition-all ${
                                        isSelected
                                          ? 'bg-[#8E6BBF] text-white'
                                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      }`}
                                    >
                                      {isSelected && <Check size={12} className="inline mr-1" />}
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* App Info */}
        <section className="bg-white rounded-2xl border-4 border-gray-200 shadow-crayon p-4">
          <div className="text-center space-y-2">
            <img src="/logo.jpeg" alt="ATLASassist" className="w-16 h-16 rounded-xl mx-auto shadow-md" />
            <h3 className="font-display text-lg text-gray-700">ATLASassist</h3>
            <p className="font-crayon text-sm text-gray-500">
              Assistive Tools for Learning, Access & Support
            </p>
            <p className="font-crayon text-xs text-gray-400">
              Made with 💜 for Finn and people like him
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;
