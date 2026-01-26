// Settings.jsx - Global app settings
// FIXED: Now properly subscribes to push notifications when enabled
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
  Loader2
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
} from '../services/notifications';
// ✅ FIX: Import push subscription functions
import { 
  subscribeToPush, 
  unsubscribeFromPush,
  isPushSupported 
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
  
  // ✅ FIX: Add loading state for push subscription
  const [isSubscribing, setIsSubscribing] = useState(false);

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

  // Check permission on mount
  useEffect(() => {
    setPermissionStatus(getPermissionStatus());
  }, []);

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

  // ✅ FIX: Handle global toggle - now properly subscribes to push
  const handleGlobalToggle = async () => {
    // If turning ON notifications
    if (!settings.globalEnabled) {
      // First, request permission if not granted
      if (permissionStatus !== 'granted') {
        const result = await requestPermission();
        setPermissionStatus(result);
        if (result !== 'granted') {
          console.log('Notification permission denied');
          return;
        }
      }
      
      // ✅ FIX: Actually subscribe to push notifications!
      setIsSubscribing(true);
      try {
        if (user?.id) {
          console.log('Subscribing to push with user ID:', user.id);
          await subscribeToPush(user.id);
          console.log('✅ Push subscription saved to database!');
        } else {
          console.warn('No user ID available - push subscription saved locally only');
          // Still create local subscription for when user logs in
          await subscribeToPush(null);
        }
      } catch (error) {
        console.error('Failed to subscribe to push:', error);
        // Don't block the toggle, just log the error
      } finally {
        setIsSubscribing(false);
      }
    } else {
      // Turning OFF notifications
      setIsSubscribing(true);
      try {
        if (user?.id) {
          await unsubscribeFromPush(user.id);
          console.log('Push subscription removed from database');
        }
      } catch (error) {
        console.error('Failed to unsubscribe from push:', error);
      } finally {
        setIsSubscribing(false);
      }
    }
    
    // Update local settings
    const newSettings = setGlobalNotifications(!settings.globalEnabled);
    setSettings(newSettings);
  };

  // Handle app toggle
  const handleAppToggle = (appId) => {
    const currentEnabled = settings.apps[appId]?.enabled ?? true;
    const newSettings = updateAppNotificationSetting(appId, { enabled: !currentEnabled });
    setSettings(newSettings);
  };

  // Handle reminder change
  const handleReminderChange = (appId, value) => {
    const current = settings.apps[appId]?.reminderMinutes || [5];
    let newReminders;
    
    if (current.includes(value)) {
      newReminders = current.filter(v => v !== value);
      if (newReminders.length === 0) newReminders = [5]; // Keep at least one
    } else {
      newReminders = [...current, value].sort((a, b) => a - b);
    }
    
    const newSettings = updateAppNotificationSetting(appId, { reminderMinutes: newReminders });
    setSettings(newSettings);
  };

  // Handle repeat interval change
  const handleRepeatChange = (appId, value) => {
    const newSettings = updateAppNotificationSetting(appId, { repeatInterval: value });
    setSettings(newSettings);
  };

  // Test notification
  const handleTestNotification = async () => {
    const success = await sendTestNotification();
    if (!success) {
      alert('Could not send test notification. Make sure notifications are enabled.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#8E6BBF] 
                       rounded-xl font-display text-[#8E6BBF] hover:bg-[#8E6BBF] 
                       hover:text-white transition-all text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-lg font-display text-[#8E6BBF] flex items-center gap-2">
            <SettingsIcon size={24} />
            Settings
          </h1>
        </div>
      </header>

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
            {/* Display Name */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#8E6BBF]/20 flex items-center justify-center">
                  <User size={24} className="text-[#8E6BBF]" />
                </div>
                <div>
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="px-3 py-1 border-2 border-[#8E6BBF] rounded-lg font-crayon 
                                 focus:outline-none focus:ring-2 focus:ring-[#8E6BBF]/50"
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
                      <p className="font-display text-lg">{displayName || 'Set your name'}</p>
                      <button
                        onClick={startEditingName}
                        className="p-1 text-gray-400 hover:text-[#8E6BBF]"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  )}
                  <p className="font-crayon text-sm text-gray-500">
                    {isGuest ? 'Guest Mode' : user?.app_metadata?.provider === 'google' ? 'Signed in with Google' : 'Signed in with Email'}
                  </p>
                  <p className="font-crayon text-xs text-blue-400 mt-1">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
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
                    {isSubscribing 
                      ? 'Setting up...' 
                      : settings.globalEnabled 
                        ? 'Notifications are enabled' 
                        : 'All notifications are off'
                    }
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleGlobalToggle}
                disabled={!notificationsSupported || isSubscribing}
                className={`w-14 h-8 rounded-full transition-all relative ${
                  settings.globalEnabled ? 'bg-[#5CB85C]' : 'bg-gray-300'
                } ${(!notificationsSupported || isSubscribing) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubscribing ? (
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
                onClick={handleTestNotification}
                className="w-full py-3 bg-[#4A9FD4]/20 text-[#4A9FD4] rounded-xl font-crayon
                         hover:bg-[#4A9FD4]/30 transition-all flex items-center justify-center gap-2"
              >
                <Volume2 size={18} />
                Send Test Notification
              </button>
            )}

            {/* App-specific settings */}
            {settings.globalEnabled && (
              <div className="space-y-2 pt-4 border-t-2 border-gray-100">
                <p className="font-display text-sm text-gray-600 mb-3">App Notifications</p>
                
                {APP_CONFIGS.map((app) => {
                  const AppIcon = app.icon;
                  const appSettings = settings.apps[app.id] || { enabled: true, reminderMinutes: [5], repeatInterval: 5 };
                  const isExpanded = expandedApp === app.id;
                  
                  return (
                    <div 
                      key={app.id}
                      className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden"
                    >
                      {/* App header */}
                      <button
                        onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                        className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${app.color}20` }}
                          >
                            <AppIcon size={20} style={{ color: app.color }} />
                          </div>
                          <div className="text-left">
                            <p className="font-display text-sm">{app.name}</p>
                            <p className="font-crayon text-xs text-gray-500">{app.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {appSettings.enabled ? (
                            <span className="w-2 h-2 rounded-full bg-[#5CB85C]" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-gray-300" />
                          )}
                          <ChevronRight 
                            size={20} 
                            className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                          />
                        </div>
                      </button>
                      
                      {/* Expanded Settings */}
                      {isExpanded && (
                        <div className="border-t-2 border-gray-100 p-4 bg-gray-50 space-y-4">
                          {/* Enable Toggle */}
                          <div className="flex items-center justify-between">
                            <span className="font-crayon text-sm">Enable notifications</span>
                            <button
                              onClick={() => handleAppToggle(app.id)}
                              className={`w-12 h-6 rounded-full transition-all relative ${
                                appSettings.enabled ? 'bg-[#5CB85C]' : 'bg-gray-300'
                              }`}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${
                                appSettings.enabled ? 'right-0.5' : 'left-0.5'
                              }`} />
                            </button>
                          </div>
                          
                          {/* Reminder Times */}
                          {app.hasReminders && appSettings.enabled && (
                            <div>
                              <p className="font-crayon text-sm text-gray-600 mb-2 flex items-center gap-1">
                                <Clock size={14} /> Remind me:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {REMINDER_OPTIONS.map((opt) => {
                                  const isSelected = (appSettings.reminderMinutes || [5]).includes(opt.value);
                                  return (
                                    <button
                                      key={opt.value}
                                      onClick={() => handleReminderChange(app.id, opt.value)}
                                      className={`px-3 py-1.5 rounded-full text-xs font-crayon transition-all ${
                                        isSelected 
                                          ? 'bg-[#4A9FD4] text-white' 
                                          : 'bg-white border border-gray-300 text-gray-600 hover:border-[#4A9FD4]'
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          
                          {/* Repeat Interval */}
                          {app.hasRepeat && appSettings.enabled && (
                            <div>
                              <p className="font-crayon text-sm text-gray-600 mb-2">
                                🔁 Repeat until done:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {REPEAT_OPTIONS.map((opt) => {
                                  const isSelected = (appSettings.repeatInterval || 5) === opt.value;
                                  return (
                                    <button
                                      key={opt.value}
                                      onClick={() => handleRepeatChange(app.id, opt.value)}
                                      className={`px-3 py-1.5 rounded-full text-xs font-crayon transition-all ${
                                        isSelected 
                                          ? 'bg-[#E63B2E] text-white' 
                                          : 'bg-white border border-gray-300 text-gray-600 hover:border-[#E63B2E]'
                                      }`}
                                    >
                                      {opt.label}
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

        {/* About Section */}
        <section className="bg-white rounded-2xl border-4 border-gray-200 shadow-crayon p-4">
          <p className="font-crayon text-sm text-gray-500 text-center">
            ATLASassist v2.1
          </p>
          <p className="font-crayon text-xs text-gray-400 text-center mt-1">
            Assistive Tools for Learning, Access & Support
          </p>
        </section>
      </main>
    </div>
  );
};

export default Settings;
