// scheduleHelper.js - FIXED: Properly initializes arrays to prevent "Cannot read properties of undefined (reading 'push')"
// Storage key: snw_calendar_schedules
// Format: { "2025-01-15": { items: [...], activities: [...] }, ... }

const SCHEDULE_STORAGE_KEY = 'snw_calendar_schedules';

/**
 * Get all schedules from localStorage
 */
export const getAllSchedules = () => {
  try {
    const data = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Failed to load schedules:', e);
    return {};
  }
};

/**
 * Get schedule for a specific date - handles both 'items' and 'activities' array names
 */
export const getScheduleForDate = (dateStr) => {
  const schedules = getAllSchedules();
  const schedule = schedules[dateStr];
  
  if (!schedule) {
    return { items: [], activities: [] };
  }
  
  // Normalize: ensure both arrays exist and are in sync
  const items = Array.isArray(schedule.items) ? schedule.items : 
                Array.isArray(schedule.activities) ? [...schedule.activities] : [];
  
  return {
    ...schedule,
    items: items,
    activities: items,
  };
};

/**
 * Save all schedules to localStorage
 */
export const saveAllSchedules = (schedules) => {
  try {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedules));
    return true;
  } catch (e) {
    console.error('Failed to save schedules:', e);
    return false;
  }
};

/**
 * Add an activity to the Visual Schedule
 * FIXED: Properly initializes arrays before pushing to prevent undefined errors
 */
export const addActivityToSchedule = ({
  date,
  name,
  time = '09:00',
  emoji = '⭐',
  color = '#4A9FD4',
  source = 'custom',
  notify = true,
  customImage = null,
  metadata = {},
}) => {
  try {
    // Validate required fields
    if (!date || !name) {
      return { success: false, activityId: null, error: 'Date and name are required' };
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return { success: false, activityId: null, error: 'Invalid date format. Use YYYY-MM-DD' };
    }

    // Get existing schedules
    const schedules = getAllSchedules();
    
    // CRITICAL FIX: Properly get or create schedule with guaranteed arrays
    let dateSchedule = schedules[date];
    
    if (!dateSchedule) {
      // Create new schedule with both array types
      dateSchedule = { 
        items: [], 
        activities: [],
        name: `Schedule for ${date}`,
        createdAt: new Date().toISOString()
      };
    } else {
      // CRITICAL FIX: Ensure items array exists even if schedule was created with activities only
      if (!Array.isArray(dateSchedule.items)) {
        // Try to use activities array if it exists, otherwise create empty
        dateSchedule.items = Array.isArray(dateSchedule.activities) 
          ? [...dateSchedule.activities] 
          : [];
      }
      // Also ensure activities array exists
      if (!Array.isArray(dateSchedule.activities)) {
        dateSchedule.activities = Array.isArray(dateSchedule.items)
          ? [...dateSchedule.items]
          : [];
      }
    }
    
    // Create new activity
    const activityId = `${source}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newActivity = {
      id: activityId,
      activityId: activityId,
      name: name,
      time: time,
      emoji: emoji,
      icon: null,
      color: color,
      completed: false,
      customImage: customImage,
      source: source,
      notify: notify,
      notifications: notify ? [0, 5] : [],
      metadata: metadata,
      createdAt: new Date().toISOString(),
    };

    // Now safe to push - arrays are guaranteed to exist
    dateSchedule.items.push(newActivity);
    dateSchedule.activities.push(newActivity);
    
    // Sort both arrays by time
    const sortByTime = (a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    };
    dateSchedule.items.sort(sortByTime);
    dateSchedule.activities.sort(sortByTime);
    
    // Update timestamp
    dateSchedule.updatedAt = new Date().toISOString();
    
    // Save back
    schedules[date] = dateSchedule;
    const saved = saveAllSchedules(schedules);
    
    if (saved) {
      console.log(`[ScheduleHelper] Added "${name}" to schedule for ${date}`);
      return { success: true, activityId: activityId, error: null };
    } else {
      return { success: false, activityId: null, error: 'Failed to save to localStorage' };
    }
  } catch (e) {
    console.error('[ScheduleHelper] Error adding activity:', e);
    return { success: false, activityId: null, error: e.message };
  }
};

/**
 * Add multiple activities at once
 */
export const addMultipleActivities = (activities) => {
  const results = { success: true, count: 0, errors: [] };
  
  for (const activity of activities) {
    const result = addActivityToSchedule(activity);
    if (result.success) {
      results.count++;
    } else {
      results.errors.push({ activity: activity.name, error: result.error });
      results.success = false;
    }
  }
  
  return results;
};

/**
 * Remove an activity from schedule
 */
export const removeActivityFromSchedule = (dateStr, activityId) => {
  try {
    const schedules = getAllSchedules();
    const dateSchedule = schedules[dateStr];
    
    if (!dateSchedule) return false;
    
    // Remove from both arrays if they exist
    if (Array.isArray(dateSchedule.items)) {
      dateSchedule.items = dateSchedule.items.filter(item => 
        item.id !== activityId && item.activityId !== activityId
      );
    }
    if (Array.isArray(dateSchedule.activities)) {
      dateSchedule.activities = dateSchedule.activities.filter(item => 
        item.id !== activityId && item.activityId !== activityId
      );
    }
    
    dateSchedule.updatedAt = new Date().toISOString();
    schedules[dateStr] = dateSchedule;
    return saveAllSchedules(schedules);
  } catch (e) {
    console.error('[ScheduleHelper] Error removing activity:', e);
    return false;
  }
};

/**
 * Check if activity exists
 */
export const activityExists = (dateStr, name, time) => {
  const schedule = getScheduleForDate(dateStr);
  const items = schedule.items || schedule.activities || [];
  return items.some(item => item.name === name && item.time === time);
};

/**
 * Get today's date string
 */
export const getToday = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get tomorrow's date string
 */
export const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

/**
 * Format date for display
 */
export const formatDateDisplay = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.getTime() === today.getTime()) return 'Today';
  if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
  
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

/**
 * Format time for display (24h to 12h)
 */
export const formatTimeDisplay = (time24) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

// Pre-defined sources
export const SCHEDULE_SOURCES = {
  SLEEP_TRACKER: 'sleep-tracker',
  HEALTHY_CHOICES: 'healthy-choices',
  WATER_TRACKER: 'water-tracker',
  MOVE_EXERCISE: 'move-exercise',
  NUTRITION: 'nutrition',
  SOCIAL_STORIES: 'social-stories',
  CHOICE_BOARD: 'choice-board',
  OT_EXERCISES: 'ot-exercises',
  SENSORY_BREAKS: 'sensory-breaks',
  APPOINTMENTS: 'appointments',
  REMINDERS: 'reminders',
  DAILY_ROUTINES: 'daily-routines',
  FIRST_THEN: 'first-then',
  CUSTOM: 'custom',
};

// Pre-defined colors
export const SOURCE_COLORS = {
  [SCHEDULE_SOURCES.SLEEP_TRACKER]: '#8E6BBF',
  [SCHEDULE_SOURCES.HEALTHY_CHOICES]: '#5CB85C',
  [SCHEDULE_SOURCES.WATER_TRACKER]: '#4A9FD4',
  [SCHEDULE_SOURCES.MOVE_EXERCISE]: '#F5A623',
  [SCHEDULE_SOURCES.NUTRITION]: '#7BC043',
  [SCHEDULE_SOURCES.SOCIAL_STORIES]: '#E86B9A',
  [SCHEDULE_SOURCES.CHOICE_BOARD]: '#F5A623',
  [SCHEDULE_SOURCES.OT_EXERCISES]: '#4A9FD4',
  [SCHEDULE_SOURCES.SENSORY_BREAKS]: '#87CEEB',
  [SCHEDULE_SOURCES.APPOINTMENTS]: '#E63B2E',
  [SCHEDULE_SOURCES.REMINDERS]: '#F8D14A',
  [SCHEDULE_SOURCES.DAILY_ROUTINES]: '#4A9FD4',
  [SCHEDULE_SOURCES.FIRST_THEN]: '#8E6BBF',
  [SCHEDULE_SOURCES.CUSTOM]: '#87CEEB',
};

export default {
  getAllSchedules,
  getScheduleForDate,
  saveAllSchedules,
  addActivityToSchedule,
  addMultipleActivities,
  removeActivityFromSchedule,
  activityExists,
  getToday,
  getTomorrow,
  formatDateDisplay,
  formatTimeDisplay,
  SCHEDULE_SOURCES,
  SOURCE_COLORS,
};
