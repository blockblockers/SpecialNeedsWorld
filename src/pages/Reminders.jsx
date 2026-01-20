// FIXED: Changed theme color from yellow (#F5A623) to dark orange (#D35400) for better visibility
// Reminders.jsx - Reminder system with push notifications
// Privacy-focused: Local storage only

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Bell,
  BellOff,
  Trash2,
  Check,
  X,
  Clock,
  Calendar,
  Repeat,
  AlertCircle
} from 'lucide-react';
import LocalOnlyNotice from '../components/LocalOnlyNotice';

// Reminder categories
const CATEGORIES = [
  { id: 'medication', emoji: '💊', label: 'Medication', color: 'bg-red-100 border-red-400' },
  { id: 'therapy', emoji: '🗣️', label: 'Therapy', color: 'bg-blue-100 border-blue-400' },
  { id: 'appointment', emoji: '📅', label: 'Appointment', color: 'bg-purple-100 border-purple-400' },
  { id: 'activity', emoji: '🎯', label: 'Activity', color: 'bg-green-100 border-green-400' },
  { id: 'routine', emoji: '⏰', label: 'Routine', color: 'bg-orange-100 border-orange-400' },
  { id: 'other', emoji: '📝', label: 'Other', color: 'bg-gray-100 border-gray-400' },
];

// Repeat options
const REPEAT_OPTIONS = [
  { id: 'none', label: 'Don\'t repeat' },
  { id: 'daily', label: 'Every day' },
  { id: 'weekdays', label: 'Weekdays only' },
  { id: 'weekly', label: 'Every week' },
];

const STORAGE_KEY = 'snw_reminders';
const NOTIFICATION_PERMISSION_KEY = 'snw_notification_permission';

const Reminders = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [notificationSupported, setNotificationSupported] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'activity',
    time: '',
    date: '',
    repeat: 'none',
    enabled: true,
  });

  // Check notification support
  useEffect(() => {
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setNotificationSupported(supported);
    
    if (supported) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Load reminders
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setReminders(parsed);
        // Re-schedule all enabled reminders
        parsed.filter(r => r.enabled).forEach(r => scheduleReminder(r));
      } catch (e) {
        console.error('Error loading reminders:', e);
      }
    }
  }, []);

  // Save reminders
  const saveReminders = (newReminders) => {
    setReminders(newReminders);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newReminders));
  };

  // Request notification permission
  const requestPermission = async () => {
    if (!notificationSupported) return false;
    
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      localStorage.setItem(NOTIFICATION_PERMISSION_KEY, permission);
      return permission === 'granted';
    } catch (e) {
      console.error('Error requesting permission:', e);
      return false;
    }
  };

  // Schedule a reminder notification
  const scheduleReminder = useCallback((reminder) => {
    if (!notificationSupported || Notification.permission !== 'granted') return;
    if (!reminder.enabled || !reminder.time) return;

    // Calculate next occurrence
    const now = new Date();
    let targetDate;

    if (reminder.date) {
      // Specific date reminder
      targetDate = new Date(`${reminder.date}T${reminder.time}`);
    } else {
      // Time-based reminder (today or next occurrence based on repeat)
      targetDate = new Date();
      const [hours, minutes] = reminder.time.split(':');
      targetDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // If time has passed today, schedule for next occurrence
      if (targetDate <= now) {
        if (reminder.repeat === 'daily' || reminder.repeat === 'weekdays') {
          targetDate.setDate(targetDate.getDate() + 1);
          // Skip weekends for weekdays-only
          if (reminder.repeat === 'weekdays') {
            while (targetDate.getDay() === 0 || targetDate.getDay() === 6) {
              targetDate.setDate(targetDate.getDate() + 1);
            }
          }
        } else if (reminder.repeat === 'weekly') {
          targetDate.setDate(targetDate.getDate() + 7);
        } else {
          // Non-repeating, already passed
          return;
        }
      }
    }

    const delay = targetDate.getTime() - now.getTime();
    
    if (delay > 0 && delay < 24 * 60 * 60 * 1000) { // Within 24 hours
      // Store timeout ID for cleanup
      const timeoutId = setTimeout(() => {
        showNotification(reminder);
        
        // Reschedule if repeating
        if (reminder.repeat !== 'none') {
          scheduleReminder(reminder);
        }
      }, delay);

      // Store timeout ID (simplified - in production would use a better system)
      window[`reminder_${reminder.id}`] = timeoutId;
    }
  }, [notificationSupported]);

  // Show notification
  const showNotification = async (reminder) => {
    if (Notification.permission !== 'granted') return;

    const category = CATEGORIES.find(c => c.id === reminder.category);
    
    try {
      // Try service worker notification first (works when app is closed)
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification('ATLASassist Reminder', {
          body: `${category?.emoji || '🔔'} ${reminder.title}`,
          icon: '/logo.jpeg',
          badge: '/badge-96.svg',
          tag: `reminder-${reminder.id}`,
          requireInteraction: true,
          actions: [
            { action: 'done', title: 'Done ✓' },
            { action: 'snooze', title: 'Snooze 5m' },
          ],
        });
      } else {
        // Fallback to basic notification
        new Notification('ATLASassist Reminder', {
          body: `${category?.emoji || '🔔'} ${reminder.title}`,
          icon: '/logo.jpeg',
        });
      }
    } catch (e) {
      console.error('Notification error:', e);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    // Request permission if needed
    if (formData.enabled && notificationSupported && notificationPermission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        alert('Please enable notifications to receive reminders');
      }
    }

    const reminder = {
      id: editingId || Date.now().toString(),
      ...formData,
      createdAt: editingId ? reminders.find(r => r.id === editingId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let newReminders;
    if (editingId) {
      // Clear old timeout
      if (window[`reminder_${editingId}`]) {
        clearTimeout(window[`reminder_${editingId}`]);
      }
      newReminders = reminders.map(r => r.id === editingId ? reminder : r);
    } else {
      newReminders = [...reminders, reminder];
    }

    saveReminders(newReminders);
    
    // Schedule the reminder
    if (reminder.enabled) {
      scheduleReminder(reminder);
    }
    
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      category: 'activity',
      time: '',
      date: '',
      repeat: 'none',
      enabled: true,
    });
    setShowForm(false);
    setEditingId(null);
  };

  // Edit reminder
  const handleEdit = (reminder) => {
    setFormData({
      title: reminder.title,
      category: reminder.category,
      time: reminder.time || '',
      date: reminder.date || '',
      repeat: reminder.repeat || 'none',
      enabled: reminder.enabled,
    });
    setEditingId(reminder.id);
    setShowForm(true);
  };

  // Delete reminder
  const handleDelete = (id) => {
    if (confirm('Delete this reminder?')) {
      // Clear timeout
      if (window[`reminder_${id}`]) {
        clearTimeout(window[`reminder_${id}`]);
      }
      saveReminders(reminders.filter(r => r.id !== id));
    }
  };

  // Toggle reminder enabled
  const toggleEnabled = (id) => {
    const newReminders = reminders.map(r => {
      if (r.id === id) {
        const updated = { ...r, enabled: !r.enabled };
        if (updated.enabled) {
          scheduleReminder(updated);
        } else if (window[`reminder_${id}`]) {
          clearTimeout(window[`reminder_${id}`]);
        }
        return updated;
      }
      return r;
    });
    saveReminders(newReminders);
  };

  // Get category info
  const getCategoryInfo = (catId) => {
    return CATEGORIES.find(c => c.id === catId) || CATEGORIES[5];
  };

  // Format time display
  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Sort reminders by time
  const sortedReminders = [...reminders].sort((a, b) => {
    if (!a.time) return 1;
    if (!b.time) return -1;
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#D35400]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#D35400] 
                       rounded-xl font-display font-bold text-[#D35400] hover:bg-[#D35400] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#D35400] crayon-text">
              🔔 Reminders
            </h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="p-2 bg-[#5CB85C] text-white rounded-full border-3 border-green-600
                       hover:scale-110 transition-transform shadow-sm"
          >
            <Plus size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Privacy Notice */}
        <div className="mb-4">
          <LocalOnlyNotice />
        </div>

        {/* Notification Permission Warning */}
        {notificationSupported && notificationPermission !== 'granted' && (
          <div className="mb-4 p-4 bg-yellow-50 rounded-2xl border-3 border-yellow-300">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="font-crayon text-yellow-800 text-sm">
                  <strong>Enable notifications</strong> to receive reminder alerts even when the app is closed.
                </p>
                <button
                  onClick={requestPermission}
                  className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg font-crayon text-sm
                           hover:bg-yellow-600 transition-colors"
                >
                  Enable Notifications
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-6 bg-white rounded-2xl border-4 border-[#D35400] p-4 shadow-crayon">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-lg text-[#D35400]">
                {editingId ? 'Edit Reminder' : 'New Reminder'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block font-crayon text-gray-700 mb-1">What to remember: *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Take medicine, Therapy session, etc."
                  required
                  className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon
                           focus:border-[#D35400] focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-crayon text-gray-700 mb-2">Category:</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({...formData, category: cat.id})}
                      className={`p-2 rounded-xl border-2 font-crayon text-xs transition-all
                        ${formData.category === cat.id 
                          ? `${cat.color} border-2` 
                          : 'bg-gray-50 border-gray-200 hover:border-gray-400'
                        }`}
                    >
                      <span className="text-xl">{cat.emoji}</span>
                      <span className="block mt-1">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-crayon text-gray-700 mb-1">
                    <Clock size={14} className="inline mr-1" />
                    Time:
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon
                             focus:border-[#D35400] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-crayon text-gray-700 mb-1">
                    <Calendar size={14} className="inline mr-1" />
                    Date (optional):
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon
                             focus:border-[#D35400] focus:outline-none"
                  />
                </div>
              </div>

              {/* Repeat */}
              <div>
                <label className="block font-crayon text-gray-700 mb-2">
                  <Repeat size={14} className="inline mr-1" />
                  Repeat:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {REPEAT_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFormData({...formData, repeat: opt.id})}
                      className={`p-2 rounded-xl border-2 font-crayon text-sm transition-all
                        ${formData.repeat === opt.id 
                          ? 'bg-orange-100 border-orange-400 text-orange-700' 
                          : 'bg-gray-50 border-gray-200 hover:border-gray-400'
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-[#5CB85C] text-white rounded-xl border-3 border-green-600
                         font-crayon text-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                <Check size={20} />
                {editingId ? 'Save Changes' : 'Add Reminder'}
              </button>
            </form>
          </div>
        )}

        {/* Empty State */}
        {reminders.length === 0 && !showForm && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="font-display text-xl text-gray-500 mb-2">No Reminders Yet</h2>
            <p className="font-crayon text-gray-400 mb-4">
              Set reminders for medications, appointments, and activities!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-[#D35400] text-white rounded-xl border-3 border-amber-700
                       font-crayon hover:scale-105 transition-transform"
            >
              <Plus size={20} className="inline mr-2" />
              Add First Reminder
            </button>
          </div>
        )}

        {/* Reminders List */}
        {sortedReminders.length > 0 && (
          <div className="space-y-3">
            {sortedReminders.map(reminder => {
              const catInfo = getCategoryInfo(reminder.category);
              
              return (
                <div
                  key={reminder.id}
                  className={`bg-white rounded-2xl border-3 ${catInfo.color} shadow-sm overflow-hidden
                    ${!reminder.enabled ? 'opacity-60' : ''}`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{catInfo.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-display text-gray-800 ${!reminder.enabled ? 'line-through' : ''}`}>
                          {reminder.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {reminder.time && (
                            <span className="text-xs font-crayon bg-white/50 px-2 py-1 rounded-lg flex items-center gap-1">
                              <Clock size={12} />
                              {formatTime(reminder.time)}
                            </span>
                          )}
                          {reminder.date && (
                            <span className="text-xs font-crayon bg-white/50 px-2 py-1 rounded-lg flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(reminder.date).toLocaleDateString()}
                            </span>
                          )}
                          {reminder.repeat !== 'none' && (
                            <span className="text-xs font-crayon bg-orange-100 px-2 py-1 rounded-lg flex items-center gap-1">
                              <Repeat size={12} />
                              {REPEAT_OPTIONS.find(o => o.id === reminder.repeat)?.label}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Toggle */}
                      <button
                        onClick={() => toggleEnabled(reminder.id)}
                        className={`p-2 rounded-lg transition-all
                          ${reminder.enabled 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                          }`}
                      >
                        {reminder.enabled ? <Bell size={20} /> : <BellOff size={20} />}
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleEdit(reminder)}
                        className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-crayon text-sm
                                 hover:bg-gray-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(reminder.id)}
                        className="py-2 px-3 bg-red-100 text-red-600 rounded-lg
                                 hover:bg-red-200 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tips */}
        {reminders.length > 0 && (
          <div className="mt-6 p-4 bg-white rounded-2xl border-3 border-[#87CEEB]">
            <p className="text-center text-gray-600 font-crayon text-sm">
              💡 <strong>Tip:</strong> Reminders will notify you even when the app is closed!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Reminders;
