// scheduleHelper.js - Unified schedule integration service for ATLASassist
// FIXED: Now properly syncs to cloud and schedules push notifications
// FIXED: Auto-initializes cloud sync when user is available
// FIXED: Gets userId from Supabase session if not explicitly initialized

// ============================================
// CLOUD SYNC INTEGRATION
// ============================================

let calendarSyncModule = null;
let currentUserId = null;
let initPromise = null;

/**
 * Get current user ID from Supabase session
 * This allows us to work even if initCloudSync wasn't explicitly called
 */
const getCurrentUserIdFromSession = async () => {
  try {
    const supabaseModule = await import('./supabase.js');
    if (supabaseModule.supabase && supabaseModule.isSupabaseConfigured()) {
      const { data: { session } } = await supabaseModule.supabase.auth.getSession();
      return session?.user?.id || null;
    }
  } catch (error) {
    console.warn('Could not get user from session:', error.message);
  }
  return null;
};

/**
 * Initialize cloud sync module (lazy loaded)
 */
const ensureCalendarSyncModule = async () => {
  if (calendarSyncModule) return calendarSyncModule;
  
  try {
    calendarSyncModule = await import('./calendarSync.js');
    console.log('Calendar sync module loaded for scheduleHelper');
    return calendarSyncModule;
  } catch (error) {
    console.warn('Calendar sync module not available:', error.message);
    return null;
  }
};

/**
 * Initialize cloud sync with user ID
 * Call this when user logs in to enable cloud sync and notifications
 */
export const initCloudSync = async (userId) => {
  currentUserId = userId;
  if (!userId) {
    calendarSyncModule = null;
    return;
  }
  
  await ensureCalendarSyncModule();
  console.log('Cloud sync initialized for scheduleHelper with user:', userId);
};

/**
 * Ensure we have a valid user ID (either from init or from session)
 */
const ensureUserId = async () => {
  if (currentUserId) return currentUserId;
  
  // Try to get from session
  const sessionUserId = await getCurrentUserIdFromSession();
  if (sessionUserId) {
    currentUserId = sessionUserId;
    console.log('Got user ID from session:', sessionUserId);
    return sessionUserId;
  }
  
  return null;
};

/**
 * Sync schedule to cloud and schedule server-side push notifications
 * Called automatically after adding activities
 */
const syncAndNotify = async (dateStr, notify = true) => {
  // Ensure we have userId and module
  const userId = await ensureUserId();
  const syncModule = await ensureCalendarSyncModule();
  
  if (!syncModule || !userId) {
    console.log('Cloud sync not available - userId:', !!userId, 'module:', !!syncModule);
    return { synced: false, notified: false };
  }
  
  try {
    // Get the schedule for this date from localStorage
    const schedules = JSON.parse(localStorage.getItem('snw_visual_schedules') || '{}');
    const daySchedule = schedules[dateStr];
    
    if (!daySchedule) {
      console.log('No schedule found for date:', dateStr);
      return { synced: false, notified: false };
    }
    
    // Sync to cloud
    let synced = false;
    if (syncModule.saveSchedule) {
      try {
        await syncModule.saveSchedule(userId, dateStr, daySchedule);
        synced = true;
        console.log('✓ Schedule synced to cloud:', dateStr);
      } catch (syncError) {
        console.error('Cloud sync failed:', syncError.message);
      }
    }
    
    // Schedule server-side push notifications if requested
    let notified = false;
    if (notify && synced && syncModule.scheduleNotificationsForDay) {
      try {
        const count = await syncModule.scheduleNotificationsForDay(userId, dateStr);
        notified = count > 0;
        console.log('✓ Server-side notifications scheduled:', count);
      } catch (notifyError) {
        console.error('Notification scheduling failed:', notifyError.message);
      }
    }
    
    return { synced, notified };
  } catch (error) {
    console.warn('Cloud sync/notify failed:', error.message);
    return { synced: false, notified: false };
  }
};

// ============================================
// SELF-CONTAINED DATE HELPERS
// ============================================

export const formatDate = (date) => {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatTimeDisplay = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatDateDisplay = (date) => {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : new Date(date);
  return d.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

// ============================================
// SCHEDULE SOURCES & COLORS
// ============================================

export const SCHEDULE_SOURCES = {
  MANUAL: 'manual',
  SOCIAL_STORY: 'social_story',
  CHOICE_BOARD: 'choice_board',
  AAC: 'aac',
  EMOTION_MATCH: 'emotion_match',
  WELLNESS: 'wellness',
  HEALTHY_CHOICES: 'healthy_choices',
  SLEEP_TRACKER: 'sleep_tracker',
  THERAPY: 'therapy',
  REMINDER: 'reminder',
};

export const SOURCE_COLORS = {
  [SCHEDULE_SOURCES.MANUAL]: '#4A9FD4',
  [SCHEDULE_SOURCES.SOCIAL_STORY]: '#8E6BBF',
  [SCHEDULE_SOURCES.CHOICE_BOARD]: '#F5A623',
  [SCHEDULE_SOURCES.AAC]: '#5CB85C',
  [SCHEDULE_SOURCES.EMOTION_MATCH]: '#E86B9A',
  [SCHEDULE_SOURCES.WELLNESS]: '#20B2AA',
  [SCHEDULE_SOURCES.HEALTHY_CHOICES]: '#5CB85C',
  [SCHEDULE_SOURCES.SLEEP_TRACKER]: '#6B5B95',
  [SCHEDULE_SOURCES.THERAPY]: '#E63B2E',
  [SCHEDULE_SOURCES.REMINDER]: '#F5A623',
};

export const SOURCE_LABELS = {
  [SCHEDULE_SOURCES.MANUAL]: 'Added manually',
  [SCHEDULE_SOURCES.SOCIAL_STORY]: 'From Social Stories',
  [SCHEDULE_SOURCES.CHOICE_BOARD]: 'From Choice Board',
  [SCHEDULE_SOURCES.AAC]: 'From Point to Talk',
  [SCHEDULE_SOURCES.EMOTION_MATCH]: 'From Emotion Match',
  [SCHEDULE_SOURCES.WELLNESS]: 'From Wellness Hub',
  [SCHEDULE_SOURCES.HEALTHY_CHOICES]: 'From Healthy Choices',
  [SCHEDULE_SOURCES.SLEEP_TRACKER]: 'From Sleep Tracker',
  [SCHEDULE_SOURCES.THERAPY]: 'Therapy/Appointment',
  [SCHEDULE_SOURCES.REMINDER]: 'Reminder',
};

// ============================================
// STORAGE KEY
// ============================================

const STORAGE_KEY = 'snw_visual_schedules';

// ============================================
// GET ALL SCHEDULES
// ============================================

export const getAllSchedules = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading schedules:', error);
    return {};
  }
};

// ============================================
// GET SCHEDULE FOR DATE
// ============================================

export const getScheduleForDate = (date) => {
  const dateStr = typeof date === 'string' ? date : formatDate(date);
  const schedules = getAllSchedules();
  return schedules[dateStr] || null;
};

// ============================================
// ADD ACTIVITY TO SCHEDULE
// ============================================

export const addActivityToSchedule = ({
  date,
  name,
  time,
  emoji = '📋',
  color,
  source = SCHEDULE_SOURCES.MANUAL,
  notify = true,
  metadata = {},
}) => {
  try {
    if (!date || !name) {
      return { success: false, error: 'Date and name are required' };
    }

    const dateStr = typeof date === 'string' ? date : formatDate(date);
    const schedules = getAllSchedules();
    
    // Create the new activity
    const newActivity = {
      id: Date.now(),
      name,
      time: time || null,
      emoji,
      color: color || SOURCE_COLORS[source] || '#4A9FD4',
      source,
      notify: notify && !!time,
      completed: false,
      createdAt: new Date().toISOString(),
      ...metadata,
    };
    
    // Get or create schedule for this date
    let dateSchedule = schedules[dateStr] || {
      id: Date.now(),
      date: dateStr,
      name: `Schedule for ${formatDateDisplay(dateStr)}`,
      items: [],
      activities: [],
      createdAt: new Date().toISOString(),
    };
    
    // Handle legacy format
    if (!Array.isArray(dateSchedule.items)) {
      dateSchedule.items = Array.isArray(dateSchedule.activities) 
        ? [...dateSchedule.activities] 
        : [];
    }
    
    if (!Array.isArray(dateSchedule.activities)) {
      dateSchedule.activities = Array.isArray(dateSchedule.items) 
        ? [...dateSchedule.items] 
        : [];
    }
    
    // Add to both arrays for compatibility
    dateSchedule.items.push(newActivity);
    dateSchedule.activities.push(newActivity);
    
    // Sort by time
    const sortByTime = (a, b) => {
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    };
    
    dateSchedule.items.sort(sortByTime);
    dateSchedule.activities.sort(sortByTime);
    dateSchedule.updatedAt = new Date().toISOString();
    
    // Save back to schedules
    schedules[dateStr] = dateSchedule;
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
    } catch (storageError) {
      console.error('Error saving to localStorage:', storageError);
      return { success: false, error: 'Failed to save schedule' };
    }
    
    // Sync to cloud and schedule push notifications
    // This runs asynchronously and won't block the response
    if (notify && time) {
      syncAndNotify(dateStr, true)
        .then(result => {
          if (result.synced) {
            console.log('✓ Activity synced to cloud:', newActivity.name);
          }
          if (result.notified) {
            console.log('✓ Push notification scheduled for:', newActivity.name);
          }
          if (!result.synced && !result.notified) {
            console.log('⚠ Cloud sync not available, notification scheduled locally only');
          }
        })
        .catch(err => {
          console.warn('Cloud sync/notification failed (non-blocking):', err.message);
        });
    }
    
    console.log('Activity added successfully:', newActivity.name, 'to', dateStr);
    
    return {
      success: true,
      activity: newActivity,
      message: `Added "${name}" to schedule`,
    };
  } catch (error) {
    console.error('Failed to add activity to schedule:', error);
    return {
      success: false,
      error: error.message || 'Failed to add activity',
    };
  }
};

// ============================================
// ADD MULTIPLE ACTIVITIES
// ============================================

export const addMultipleActivitiesToSchedule = ({
  date,
  activities,
  source = SCHEDULE_SOURCES.MANUAL,
  notify = true,
}) => {
  try {
    if (!date || !activities || !Array.isArray(activities)) {
      return { success: false, error: 'Date and activities array are required' };
    }

    const dateStr = typeof date === 'string' ? date : formatDate(date);
    const results = [];
    let hasTime = false;
    
    for (const activity of activities) {
      const result = addActivityToSchedule({
        date: dateStr,
        name: activity.name,
        time: activity.time,
        emoji: activity.emoji,
        color: activity.color,
        source: activity.source || source,
        notify: false, // We'll sync once at the end
        metadata: activity.metadata,
      });
      results.push(result);
      if (activity.time) hasTime = true;
    }
    
    // Sync to cloud once after all activities added
    if (notify && hasTime) {
      syncAndNotify(dateStr, true)
        .then(result => {
          console.log('Bulk sync result:', result);
        })
        .catch(err => {
          console.warn('Bulk sync failed:', err.message);
        });
    }
    
    const successCount = results.filter(r => r.success).length;
    
    return {
      success: successCount > 0,
      added: successCount,
      total: activities.length,
      results,
    };
  } catch (error) {
    console.error('Failed to add multiple activities:', error);
    return {
      success: false,
      error: error.message || 'Failed to add activities',
    };
  }
};

// ============================================
// REMOVE ACTIVITY FROM SCHEDULE
// ============================================

export const removeActivityFromSchedule = (date, activityId) => {
  try {
    const dateStr = typeof date === 'string' ? date : formatDate(date);
    const schedules = getAllSchedules();
    const dateSchedule = schedules[dateStr];
    
    if (!dateSchedule) {
      return { success: false, error: 'No schedule found for this date' };
    }
    
    // Remove from both arrays
    dateSchedule.items = (dateSchedule.items || []).filter(a => a.id !== activityId);
    dateSchedule.activities = (dateSchedule.activities || []).filter(a => a.id !== activityId);
    dateSchedule.updatedAt = new Date().toISOString();
    
    schedules[dateStr] = dateSchedule;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
    
    // Sync to cloud
    syncAndNotify(dateStr, true).catch(err => {
      console.warn('Sync after remove failed:', err.message);
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to remove activity:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// MARK ACTIVITY COMPLETE
// ============================================

export const markActivityComplete = async (date, activityId, completed = true) => {
  try {
    const dateStr = typeof date === 'string' ? date : formatDate(date);
    const schedules = getAllSchedules();
    const dateSchedule = schedules[dateStr];
    
    if (!dateSchedule) {
      return { success: false, error: 'No schedule found for this date' };
    }
    
    // Update in both arrays
    const updateActivity = (arr) => {
      return arr.map(a => a.id === activityId ? { ...a, completed } : a);
    };
    
    dateSchedule.items = updateActivity(dateSchedule.items || []);
    dateSchedule.activities = updateActivity(dateSchedule.activities || []);
    dateSchedule.updatedAt = new Date().toISOString();
    
    schedules[dateStr] = dateSchedule;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
    
    // Also mark complete on server to cancel pending notifications
    const userId = await ensureUserId();
    const syncModule = await ensureCalendarSyncModule();
    
    if (userId && syncModule?.markActivityCompleteOnServer) {
      const activityIndex = (dateSchedule.activities || []).findIndex(a => a.id === activityId);
      if (activityIndex >= 0) {
        await syncModule.markActivityCompleteOnServer(userId, dateStr, activityIndex);
        console.log('✓ Marked complete on server, notifications cancelled');
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Failed to mark activity complete:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// CHECK IF DATE HAS SCHEDULE
// ============================================

export const hasScheduleForDate = (date) => {
  const schedule = getScheduleForDate(date);
  return schedule && (
    (schedule.items && schedule.items.length > 0) ||
    (schedule.activities && schedule.activities.length > 0)
  );
};

// ============================================
// EXPORTS
// ============================================

export default {
  addActivityToSchedule,
  addMultipleActivitiesToSchedule,
  removeActivityFromSchedule,
  markActivityComplete,
  getScheduleForDate,
  getAllSchedules,
  hasScheduleForDate,
  formatDate,
  formatTimeDisplay,
  formatDateDisplay,
  initCloudSync,
  SCHEDULE_SOURCES,
  SOURCE_COLORS,
  SOURCE_LABELS,
};
