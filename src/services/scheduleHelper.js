// scheduleHelper.js - Unified helper for adding activities to Visual Schedule
// This ensures ALL integrations use the same storage format
// Storage key: snw_calendar_schedules
// Format: { "2025-01-15": { items: [...] }, "2025-01-16": { items: [...] } }

const SCHEDULE_STORAGE_KEY = 'snw_calendar_schedules';

/**
 * Get all schedules from localStorage
 * @returns {Object} All schedules keyed by date string (YYYY-MM-DD)
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
 * Get schedule for a specific date
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @returns {Object} Schedule object with items array
 */
export const getScheduleForDate = (dateStr) => {
  const schedules = getAllSchedules();
  return schedules[dateStr] || { items: [] };
};

/**
 * Save all schedules to localStorage
 * @param {Object} schedules - All schedules keyed by date
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
 * This is the main function all integrations should use!
 * 
 * @param {Object} options - Activity options
 * @param {string} options.date - Date in YYYY-MM-DD format
 * @param {string} options.name - Activity name (e.g., "Drink Water", "Bedtime")
 * @param {string} options.time - Time in HH:MM format (e.g., "09:00")
 * @param {string} options.emoji - Emoji for display (e.g., "💧", "😴")
 * @param {string} options.color - Color hex (e.g., "#4A9FD4")
 * @param {string} options.source - Source app (e.g., "sleep-tracker", "healthy-choices")
 * @param {boolean} options.notify - Whether to enable notifications (default: true)
 * @param {string|null} options.customImage - Base64 image data (optional)
 * @param {Object} options.metadata - Additional metadata (optional)
 * @returns {Object} { success: boolean, activityId: string|null, error: string|null }
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
    
    // Get or create schedule for this date
    const dateSchedule = schedules[date] || { items: [] };
    
    // Create new activity item
    const activityId = `${source}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newActivity = {
      id: activityId,
      activityId: activityId,
      name: name,
      time: time,
      emoji: emoji,
      icon: null, // Using emoji instead
      color: color,
      completed: false,
      customImage: customImage,
      source: source,
      notifications: notify ? [0, 5] : [], // 0 and 5 minutes before
      metadata: metadata,
      createdAt: new Date().toISOString(),
    };

    // Add to schedule
    dateSchedule.items.push(newActivity);
    schedules[date] = dateSchedule;

    // Save back to localStorage
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
 * Add multiple activities to the schedule at once
 * @param {Array} activities - Array of activity objects (same format as addActivityToSchedule)
 * @returns {Object} { success: boolean, count: number, errors: Array }
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
 * Remove an activity from the schedule by ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} activityId - The activity ID to remove
 * @returns {boolean} Whether removal was successful
 */
export const removeActivityFromSchedule = (date, activityId) => {
  try {
    const schedules = getAllSchedules();
    const dateSchedule = schedules[date];
    
    if (!dateSchedule || !dateSchedule.items) {
      return false;
    }
    
    const originalLength = dateSchedule.items.length;
    dateSchedule.items = dateSchedule.items.filter(item => item.id !== activityId);
    
    if (dateSchedule.items.length < originalLength) {
      schedules[date] = dateSchedule;
      saveAllSchedules(schedules);
      return true;
    }
    
    return false;
  } catch (e) {
    console.error('[ScheduleHelper] Error removing activity:', e);
    return false;
  }
};

/**
 * Check if an activity already exists for a given date (by name and time)
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} name - Activity name
 * @param {string} time - Time in HH:MM format
 * @returns {boolean} Whether activity exists
 */
export const activityExists = (date, name, time) => {
  const schedule = getScheduleForDate(date);
  return schedule.items.some(
    item => item.name === name && item.time === time
  );
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
export const getToday = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get tomorrow's date in YYYY-MM-DD format
 * @returns {string} Tomorrow's date
 */
export const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

/**
 * Format a date for display
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @returns {string} Formatted date (e.g., "Monday, Jan 15")
 */
export const formatDateDisplay = (dateStr) => {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Format time for display (12-hour format)
 * @param {string} time - Time in HH:MM format
 * @returns {string} Formatted time (e.g., "9:00 AM")
 */
export const formatTimeDisplay = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

// Pre-defined sources for consistency
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

// Pre-defined colors for each source
export const SOURCE_COLORS = {
  [SCHEDULE_SOURCES.SLEEP_TRACKER]: '#8E6BBF',    // Purple
  [SCHEDULE_SOURCES.HEALTHY_CHOICES]: '#5CB85C',  // Green
  [SCHEDULE_SOURCES.WATER_TRACKER]: '#4A9FD4',    // Blue
  [SCHEDULE_SOURCES.MOVE_EXERCISE]: '#F5A623',    // Orange
  [SCHEDULE_SOURCES.NUTRITION]: '#7BC043',        // Light green
  [SCHEDULE_SOURCES.SOCIAL_STORIES]: '#E86B9A',   // Pink
  [SCHEDULE_SOURCES.CHOICE_BOARD]: '#F5A623',     // Orange
  [SCHEDULE_SOURCES.OT_EXERCISES]: '#4A9FD4',     // Blue
  [SCHEDULE_SOURCES.SENSORY_BREAKS]: '#87CEEB',   // Light blue
  [SCHEDULE_SOURCES.APPOINTMENTS]: '#E63B2E',     // Red
  [SCHEDULE_SOURCES.REMINDERS]: '#F8D14A',        // Yellow
  [SCHEDULE_SOURCES.DAILY_ROUTINES]: '#4A9FD4',   // Blue
  [SCHEDULE_SOURCES.FIRST_THEN]: '#8E6BBF',       // Purple
  [SCHEDULE_SOURCES.CUSTOM]: '#87CEEB',           // Light blue
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
