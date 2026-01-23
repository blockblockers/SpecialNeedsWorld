// scheduleHelper.js - Unified schedule integration service for ATLASassist
// FIXED: All date helpers exported (getToday, getTomorrow, addDays, etc.)
// FIXED: Cloud sync and push notifications
// FIXED: Gets userId from Supabase session if not explicitly initialized

// ============================================
// CLOUD SYNC INTEGRATION
// ============================================

let calendarSyncModule = null;
let currentUserId = null;

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

const ensureCalendarSyncModule = async () => {
  if (calendarSyncModule) return calendarSyncModule;
  
  try {
    calendarSyncModule = await import('./calendarSync.js');
    return calendarSyncModule;
  } catch (error) {
    console.warn('Calendar sync module not available:', error.message);
    return null;
  }
};

export const initCloudSync = async (userId) => {
  currentUserId = userId;
  if (!userId) {
    calendarSyncModule = null;
    return;
  }
  await ensureCalendarSyncModule();
  console.log('Cloud sync initialized for scheduleHelper');
};

const ensureUserId = async () => {
  if (currentUserId) return currentUserId;
  const sessionUserId = await getCurrentUserIdFromSession();
  if (sessionUserId) {
    currentUserId = sessionUserId;
    return sessionUserId;
  }
  return null;
};

const syncAndNotify = async (dateStr, notify = true) => {
  const userId = await ensureUserId();
  const syncModule = await ensureCalendarSyncModule();
  
  if (!syncModule || !userId) {
    return { synced: false, notified: false };
  }
  
  try {
    const schedules = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const daySchedule = schedules[dateStr];
    
    if (!daySchedule) {
      return { synced: false, notified: false };
    }
    
    let synced = false;
    if (syncModule.saveSchedule) {
      try {
        await syncModule.saveSchedule(userId, dateStr, daySchedule);
        synced = true;
      } catch (syncError) {
        console.error('Cloud sync failed:', syncError.message);
      }
    }
    
    let notified = false;
    if (notify && synced && syncModule.scheduleNotificationsForDay) {
      try {
        const count = await syncModule.scheduleNotificationsForDay(userId, dateStr);
        notified = count > 0;
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
// DATE HELPERS - ALL EXPORTED
// ============================================

export const formatDate = (date) => {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getToday = () => formatDate(new Date());

export const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDate(tomorrow);
};

export const addDays = (dateStr, days) => {
  const date = typeof dateStr === 'string' ? new Date(dateStr + 'T00:00:00') : new Date(dateStr);
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

export const formatDisplayDate = (dateStr) => {
  const date = typeof dateStr === 'string' ? new Date(dateStr + 'T00:00:00') : dateStr;
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Alias for backward compatibility
export const formatDateDisplay = formatDisplayDate;

export const formatTimeDisplay = (time24) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
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
  FIRST_THEN: 'first_then',
  BODY_CHECK: 'body_check',
  CALM_DOWN: 'calm_down',
  COPING_SKILL: 'coping_skill',
};

// Alias for backward compatibility
export const ACTIVITY_SOURCES = SCHEDULE_SOURCES;

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
  [SCHEDULE_SOURCES.FIRST_THEN]: '#5CB85C',
  [SCHEDULE_SOURCES.BODY_CHECK]: '#20B2AA',
  [SCHEDULE_SOURCES.CALM_DOWN]: '#8E6BBF',
  [SCHEDULE_SOURCES.COPING_SKILL]: '#20B2AA',
};

export const SOURCE_DEFAULTS = {
  [SCHEDULE_SOURCES.MANUAL]: { emoji: '📋', color: '#4A9FD4' },
  [SCHEDULE_SOURCES.SOCIAL_STORY]: { emoji: '📖', color: '#8E6BBF' },
  [SCHEDULE_SOURCES.CHOICE_BOARD]: { emoji: '🎯', color: '#F5A623' },
  [SCHEDULE_SOURCES.AAC]: { emoji: '💬', color: '#5CB85C' },
  [SCHEDULE_SOURCES.EMOTION_MATCH]: { emoji: '😊', color: '#E86B9A' },
  [SCHEDULE_SOURCES.WELLNESS]: { emoji: '🧘', color: '#20B2AA' },
  [SCHEDULE_SOURCES.HEALTHY_CHOICES]: { emoji: '🥗', color: '#5CB85C' },
  [SCHEDULE_SOURCES.SLEEP_TRACKER]: { emoji: '😴', color: '#6B5B95' },
  [SCHEDULE_SOURCES.THERAPY]: { emoji: '🏥', color: '#E63B2E' },
  [SCHEDULE_SOURCES.REMINDER]: { emoji: '⏰', color: '#F5A623' },
  [SCHEDULE_SOURCES.FIRST_THEN]: { emoji: '➡️', color: '#5CB85C' },
  [SCHEDULE_SOURCES.BODY_CHECK]: { emoji: '🧍', color: '#20B2AA' },
  [SCHEDULE_SOURCES.CALM_DOWN]: { emoji: '🌈', color: '#8E6BBF' },
  [SCHEDULE_SOURCES.COPING_SKILL]: { emoji: '💪', color: '#20B2AA' },
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
  [SCHEDULE_SOURCES.FIRST_THEN]: 'From First/Then',
  [SCHEDULE_SOURCES.BODY_CHECK]: 'Body Check-In',
  [SCHEDULE_SOURCES.CALM_DOWN]: 'Calm Down Activity',
  [SCHEDULE_SOURCES.COPING_SKILL]: 'Coping Strategy',
};

// ============================================
// STORAGE KEY
// ============================================

const STORAGE_KEY = 'snw_visual_schedules';

// ============================================
// SCHEDULE STORAGE FUNCTIONS
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

export const getScheduleForDate = (date) => {
  const dateStr = typeof date === 'string' ? date : formatDate(date);
  const schedules = getAllSchedules();
  return schedules[dateStr] || null;
};

export const hasScheduleForDate = (date) => {
  const schedule = getScheduleForDate(date);
  return schedule && (
    (schedule.items && schedule.items.length > 0) ||
    (schedule.activities && schedule.activities.length > 0)
  );
};

// ============================================
// CHECK IF ACTIVITY EXISTS
// ============================================

export const activityExists = (date, name, time) => {
  const schedule = getScheduleForDate(date);
  if (!schedule) return false;
  
  const activities = schedule.activities || schedule.items || [];
  return activities.some(a => 
    a.name === name && 
    (!time || a.time === time)
  );
};

// ============================================
// GET ACTIVITIES BY SOURCE
// ============================================

export const getActivitiesBySource = (date, source) => {
  const schedule = getScheduleForDate(date);
  if (!schedule) return [];
  
  const activities = schedule.activities || schedule.items || [];
  return activities.filter(a => a.source === source);
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
  customImage = null,
}) => {
  try {
    if (!date || !name) {
      return { success: false, error: 'Date and name are required' };
    }

    const dateStr = typeof date === 'string' ? date : formatDate(date);
    const schedules = getAllSchedules();
    
    // Get defaults from source
    const defaults = SOURCE_DEFAULTS[source] || { emoji: '⭐', color: '#4A9FD4' };
    
    // Create the new activity
    const newActivity = {
      id: Date.now(),
      activityId: `${source}-${Date.now()}`,
      name,
      time: time || null,
      emoji: emoji || defaults.emoji,
      color: color || defaults.color || SOURCE_COLORS[source] || '#4A9FD4',
      source,
      notify: notify && !!time,
      completed: false,
      createdAt: new Date().toISOString(),
      customImage: customImage || null,
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
    if (notify && time) {
      syncAndNotify(dateStr, true)
        .then(result => {
          if (result.synced) console.log('✓ Activity synced to cloud:', newActivity.name);
          if (result.notified) console.log('✓ Push notification scheduled:', newActivity.name);
        })
        .catch(err => console.warn('Cloud sync failed:', err.message));
    }
    
    return {
      success: true,
      activity: newActivity,
      activityId: newActivity.activityId,
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
      syncAndNotify(dateStr, true).catch(err => console.warn('Bulk sync failed:', err.message));
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

// Alias for backward compatibility
export const addMultipleActivities = addMultipleActivitiesToSchedule;

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
    dateSchedule.items = (dateSchedule.items || []).filter(a => a.id !== activityId && a.activityId !== activityId);
    dateSchedule.activities = (dateSchedule.activities || []).filter(a => a.id !== activityId && a.activityId !== activityId);
    dateSchedule.updatedAt = new Date().toISOString();
    
    schedules[dateStr] = dateSchedule;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
    
    syncAndNotify(dateStr, true).catch(err => console.warn('Sync after remove failed:', err.message));
    
    return { success: true };
  } catch (error) {
    console.error('Failed to remove activity:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// REMOVE ACTIVITIES BY SOURCE
// ============================================

export const removeActivitiesBySource = (date, source) => {
  try {
    const dateStr = typeof date === 'string' ? date : formatDate(date);
    const schedules = getAllSchedules();
    const dateSchedule = schedules[dateStr];
    
    if (!dateSchedule) {
      return { success: true, removed: 0 };
    }
    
    const beforeCount = (dateSchedule.activities || []).length;
    
    dateSchedule.items = (dateSchedule.items || []).filter(a => a.source !== source);
    dateSchedule.activities = (dateSchedule.activities || []).filter(a => a.source !== source);
    dateSchedule.updatedAt = new Date().toISOString();
    
    const removed = beforeCount - (dateSchedule.activities || []).length;
    
    schedules[dateStr] = dateSchedule;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
    
    return { success: true, removed };
  } catch (error) {
    console.error('Failed to remove activities by source:', error);
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
    
    const updateActivity = (arr) => {
      return arr.map(a => (a.id === activityId || a.activityId === activityId) ? { ...a, completed } : a);
    };
    
    dateSchedule.items = updateActivity(dateSchedule.items || []);
    dateSchedule.activities = updateActivity(dateSchedule.activities || []);
    dateSchedule.updatedAt = new Date().toISOString();
    
    schedules[dateStr] = dateSchedule;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
    
    // Mark complete on server to cancel pending notifications
    const userId = await ensureUserId();
    const syncModule = await ensureCalendarSyncModule();
    
    if (userId && syncModule?.markActivityCompleteOnServer) {
      const activityIndex = (dateSchedule.activities || []).findIndex(a => a.id === activityId || a.activityId === activityId);
      if (activityIndex >= 0) {
        await syncModule.markActivityCompleteOnServer(userId, dateStr, activityIndex);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Failed to mark activity complete:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// HELPER FUNCTIONS FOR SPECIFIC SOURCES
// ============================================

export const addCopingStrategyToSchedule = (options) => {
  return addActivityToSchedule({
    ...options,
    source: SCHEDULE_SOURCES.COPING_SKILL,
    emoji: options.emoji || '💪',
  });
};

export const addSocialStoryToSchedule = (options) => {
  return addActivityToSchedule({
    ...options,
    source: SCHEDULE_SOURCES.SOCIAL_STORY,
    emoji: options.emoji || '📖',
  });
};

export const addFirstThenToSchedule = (options) => {
  return addActivityToSchedule({
    ...options,
    source: SCHEDULE_SOURCES.FIRST_THEN,
    emoji: options.emoji || '➡️',
  });
};

export const addReminderToSchedule = (options) => {
  return addActivityToSchedule({
    ...options,
    source: SCHEDULE_SOURCES.REMINDER,
    emoji: options.emoji || '⏰',
  });
};

export const addMealToSchedule = (options) => {
  return addActivityToSchedule({
    ...options,
    source: SCHEDULE_SOURCES.HEALTHY_CHOICES,
    emoji: options.emoji || '🍽️',
  });
};

export const addBedtimeToSchedule = (options) => {
  return addActivityToSchedule({
    ...options,
    source: SCHEDULE_SOURCES.SLEEP_TRACKER,
    emoji: options.emoji || '🛏️',
  });
};

export const addWaketimeToSchedule = (options) => {
  return addActivityToSchedule({
    ...options,
    source: SCHEDULE_SOURCES.SLEEP_TRACKER,
    emoji: options.emoji || '☀️',
  });
};

export const addExerciseToSchedule = (options) => {
  return addActivityToSchedule({
    ...options,
    source: SCHEDULE_SOURCES.WELLNESS,
    emoji: options.emoji || '🏃',
  });
};

export const addChoiceToSchedule = (options) => {
  return addActivityToSchedule({
    ...options,
    source: SCHEDULE_SOURCES.CHOICE_BOARD,
    emoji: options.emoji || '🎯',
  });
};

export const addHealthyChoiceReminderToSchedule = (options) => {
  return addActivityToSchedule({
    ...options,
    source: SCHEDULE_SOURCES.HEALTHY_CHOICES,
    emoji: options.emoji || '🥗',
  });
};

export const addOTExerciseToSchedule = (options) => {
  return addActivityToSchedule({
    ...options,
    source: SCHEDULE_SOURCES.THERAPY,
    emoji: options.emoji || '🤲',
  });
};

export const addOTSessionToSchedule = (options) => {
  return addActivityToSchedule({
    ...options,
    source: SCHEDULE_SOURCES.THERAPY,
    emoji: options.emoji || '🏥',
  });
};

export const addSensoryBreakToSchedule = (options) => {
  return addActivityToSchedule({
    ...options,
    source: SCHEDULE_SOURCES.WELLNESS,
    emoji: options.emoji || '🧘',
  });
};

export const scheduleRegularBreaks = ({ date, startTime = '09:00', endTime = '17:00', intervalMinutes = 60, breakName = 'Sensory Break', emoji = '🧘', notify = true }) => {
  const activities = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMin = startMin;
  
  while (currentHour < endHour || (currentHour === endHour && currentMin <= endMin)) {
    const time = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
    activities.push({ name: breakName, time, emoji });
    
    currentMin += intervalMinutes;
    while (currentMin >= 60) {
      currentMin -= 60;
      currentHour += 1;
    }
  }
  
  return addMultipleActivitiesToSchedule({
    date,
    activities,
    source: SCHEDULE_SOURCES.WELLNESS,
    notify,
  });
};

export const addWaterReminderToSchedule = (options) => {
  return addActivityToSchedule({
    ...options,
    source: SCHEDULE_SOURCES.HEALTHY_CHOICES,
    emoji: options.emoji || '💧',
  });
};

export const scheduleWaterReminders = ({ date, startTime = '08:00', endTime = '20:00', intervalMinutes = 90, notify = true }) => {
  const activities = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMin = startMin;
  
  while (currentHour < endHour || (currentHour === endHour && currentMin <= endMin)) {
    const time = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
    activities.push({ name: 'Drink Water', time, emoji: '💧' });
    
    currentMin += intervalMinutes;
    while (currentMin >= 60) {
      currentMin -= 60;
      currentHour += 1;
    }
  }
  
  return addMultipleActivitiesToSchedule({
    date,
    activities,
    source: SCHEDULE_SOURCES.HEALTHY_CHOICES,
    notify,
  });
};

export const addMedicineReminderToSchedule = (options) => {
  return addActivityToSchedule({
    ...options,
    source: SCHEDULE_SOURCES.REMINDER,
    emoji: options.emoji || '💊',
  });
};

export const addAppointmentToSchedule = (options) => {
  return addActivityToSchedule({
    ...options,
    source: SCHEDULE_SOURCES.THERAPY,
    emoji: options.emoji || '📅',
  });
};

export const addRoutineToSchedule = (options) => {
  return addActivityToSchedule({
    ...options,
    source: SCHEDULE_SOURCES.MANUAL,
    emoji: options.emoji || '📋',
  });
};

// ============================================
// MODAL HELPERS
// ============================================

export const createScheduleModalHandlers = (setShowModal, showToast) => {
  return {
    open: () => setShowModal(true),
    close: () => setShowModal(false),
    onSuccess: (result) => {
      setShowModal(false);
      if (showToast) {
        showToast('Added to schedule!', 'success');
      }
    },
  };
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
  // Date helpers
  formatDate,
  getToday,
  getTomorrow,
  addDays,
  formatDisplayDate,
  formatDateDisplay,
  formatTimeDisplay,
  
  // Schedule operations
  addActivityToSchedule,
  addMultipleActivitiesToSchedule,
  addMultipleActivities,
  removeActivityFromSchedule,
  removeActivitiesBySource,
  markActivityComplete,
  getScheduleForDate,
  getAllSchedules,
  hasScheduleForDate,
  activityExists,
  getActivitiesBySource,
  
  // Source-specific helpers
  addCopingStrategyToSchedule,
  addSocialStoryToSchedule,
  addFirstThenToSchedule,
  addReminderToSchedule,
  addMealToSchedule,
  addBedtimeToSchedule,
  addWaketimeToSchedule,
  addExerciseToSchedule,
  addChoiceToSchedule,
  addHealthyChoiceReminderToSchedule,
  addOTExerciseToSchedule,
  addOTSessionToSchedule,
  addSensoryBreakToSchedule,
  scheduleRegularBreaks,
  addWaterReminderToSchedule,
  scheduleWaterReminders,
  addMedicineReminderToSchedule,
  addAppointmentToSchedule,
  addRoutineToSchedule,
  
  // Modal helpers
  createScheduleModalHandlers,
  
  // Cloud sync
  initCloudSync,
  
  // Constants
  SCHEDULE_SOURCES,
  ACTIVITY_SOURCES,
  SOURCE_COLORS,
  SOURCE_DEFAULTS,
  SOURCE_LABELS,
};
