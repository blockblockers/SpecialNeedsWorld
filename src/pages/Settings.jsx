// Settings.jsx - Global app settings
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
  Save
} from 'lucide-react';
import {
  isNotificationSupported,
  getPermissionStatus,
  requestPermission,
  getNotificationSettings,
  saveNotificationSettings,
  setGlobalNotifications,
  updateAppNotificationSetting,
} from '../services/notifications';
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

  // Handle global toggle
  const handleGlobalToggle = async () => {
    if (!settings.globalEnabled && permissionStatus !== 'granted') {
      const result = await requestPermission();
      setPermissionStatus(result);
      if (result !== 'granted') return;
    }
    
    const newSettings = setGlobalNotifications(!settings.globalEnabled);
    setSettings(newSettings);
  };

  // Handle app toggle
  const handleAppToggle = (appId) => {
    const currentEnabled = settings.apps[appId]?.enabled ?? true;
    const newSettings = updateAppNotificationSetting(appId, { enabled: !currentEnabled });
    setSettings(newSettings);
  };

  // Handle reminder time selection
  const handleReminderChange = (appId, minutes) => {
    const current = settings.apps[appId]?.reminderMinutes || [5];
    let newMinutes;
    
    if (current.includes(minutes)) {
      newMinutes = current.filter(m => m !== minutes);
      if (newMinutes.length === 0) newMinutes = [5]; // Keep at least one
    } else {
      newMinutes = [...current, minutes].sort((a, b) => b - a);
    }
    
    const newSettings = updateAppNotificationSetting(appId, { reminderMinutes: newMinutes });
    setSettings(newSettings);
  };

  // Handle repeat interval change
  const handleRepeatChange = (appId, interval) => {
    const newSettings = updateAppNotificationSetting(appId, { repeatInterval: interval });
    setSettings(newSettings);
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
          <img 
            src="/logo.jpeg" 
            alt="Special Needs World" 
            className="w-10 h-10 rounded-lg shadow-sm"
          />
          <h1 className="text-lg sm:text-xl font-display text-[#8E6BBF] crayon-text flex items-center gap-2">
            <SettingsIcon size={20} />
            Settings
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Section */}
        <section className="bg-white rounded-2xl border-4 border-[#5CB85C] shadow-crayon overflow-hidden">
          <div className="bg-[#5CB85C] text-white p-4">
            <h2 className="font-display text-xl flex items-center gap-2">
              <User size={24} />
              Your Profile
            </h2>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Display Name */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="block font-crayon text-sm text-gray-600 mb-2">
                Display Name
              </label>
              {isEditingName ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={30}
                    className="flex-1 p-3 border-3 border-gray-300 rounded-xl font-crayon
                             focus:border-[#5CB85C] focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-4 py-2 bg-[#5CB85C] text-white rounded-xl font-crayon
                             hover:bg-green-600 transition-colors flex items-center gap-1"
                  >
                    <Save size={16} />
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg text-gray-800">
                    {displayName || 'Not set'}
                  </span>
                  <button
                    onClick={startEditingName}
                    className="px-3 py-1.5 bg-white border-2 border-gray-300 rounded-lg font-crayon text-sm
                             hover:border-[#5CB85C] transition-colors flex items-center gap-1"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                </div>
              )}
              <p className="font-crayon text-xs text-gray-400 mt-2">
                This name is shown in the app.
              </p>
            </div>

            {/* Community Profile Link */}
            {!isGuest && user && (
              <button
                onClick={() => navigate('/community/profile/setup')}
                className="w-full p-4 bg-purple-50 rounded-xl border-2 border-purple-200
                         hover:border-purple-400 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-purple-700">Community Profile</p>
                    <p className="font-crayon text-sm text-purple-500">
                      Set up your avatar and community name
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-purple-400" />
                </div>
              </button>
            )}

            {/* Account Info */}
            {user && !isGuest && (
              <div className="p-3 bg-blue-50 rounded-xl border-2 border-blue-200">
                <p className="font-crayon text-sm text-blue-600">
                  ✓ Signed in{user.app_metadata?.provider === 'google' ? ' with Google' : ' with Email'}
                </p>
                <p className="font-crayon text-xs text-blue-400 mt-1">
                  {user.email}
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
                disabled={!notificationsSupported}
                className={`w-14 h-8 rounded-full transition-all relative ${
                  settings.globalEnabled ? 'bg-[#5CB85C]' : 'bg-gray-300'
                } ${!notificationsSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow absolute top-1 transition-all ${
                  settings.globalEnabled ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>
            
            {/* Per-App Settings */}
            {settings.globalEnabled && (
              <div className="space-y-2">
                <h3 className="font-crayon text-sm text-gray-600 px-2">App Notifications</h3>
                
                {APP_CONFIGS.map((app) => {
                  const appSettings = settings.apps[app.id] || { enabled: true };
                  const isExpanded = expandedApp === app.id;
                  const IconComponent = app.icon;
                  
                  return (
                    <div key={app.id} className="border-2 border-gray-200 rounded-xl overflow-hidden">
                      {/* App Header */}
                      <button
                        onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: app.color }}
                          >
                            <IconComponent size={20} className="text-white" />
                          </div>
                          <div className="text-left">
                            <p className="font-display">{app.name}</p>
                            <p className="font-crayon text-xs text-gray-500">{app.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {appSettings.enabled ? (
                            <span className="text-xs font-crayon text-[#5CB85C] bg-[#5CB85C]/20 px-2 py-1 rounded-full">
                              ON
                            </span>
                          ) : (
                            <span className="text-xs font-crayon text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                              OFF
                            </span>
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
                                          : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#4A9FD4]'
                                      }`}
                                    >
                                      {isSelected && <Check size={12} className="inline mr-1" />}
                                      {opt.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          
                          {/* Repeat Until Complete */}
                          {app.hasRepeat && appSettings.enabled && (
                            <div>
                              <p className="font-crayon text-sm text-gray-600 mb-2">
                                🔁 Repeat until marked complete:
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
                                          ? 'bg-[#8E6BBF] text-white' 
                                          : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#8E6BBF]'
                                      }`}
                                    >
                                      {isSelected && <Check size={12} className="inline mr-1" />}
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
        <section className="bg-white rounded-2xl border-4 border-[#87CEEB] shadow-crayon p-6">
          <h2 className="font-display text-xl text-[#4A9FD4] mb-4">About</h2>
          <div className="space-y-3 font-crayon text-sm text-gray-600">
            <p>🌍 <strong>Special Needs World</strong></p>
            <p>For Finn, and for people like him.</p>
            <p className="text-xs text-gray-400">Version 1.0.0</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;
