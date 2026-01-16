// scheduleHelper.js - Unified helper for adding activities to Visual Schedule
// This ensures ALL integrations use the same storage format
// Storage key: snw_calendar_schedules
// Updated: Added sources for Emotional Wellness features

const SCHEDULE_STORAGE_KEY = 'snw_calendar_schedules';

// ============================================
// SCHEDULE SOURCES - All features that can add to schedule
// ============================================
export const SCHEDULE_SOURCES = {
  MANUAL: 'manual',
  CHOICE_BOARD: 'choice-board',
  SLEEP_TRACKER: 'sleep-tracker',
  HEALTHY_CHOICES: 'healthy-choices',
  MOVE_EXERCISE: 'move-exercise',
  NUTRITION: 'nutrition',
  WATER_TRACKER: 'water-tracker',
  SOCIAL_STORIES: 'social-stories',
  DAILY_ROUTINE: 'daily-routine',
  APPOINTMENT: 'appointment',
  FIRST_THEN: 'first-then',
  // NEW: Emotional Wellness sources
  EMOTION_CHECKIN: 'emotion-checkin',
  COPING_SKILL: 'coping-skill',
  SENSORY_BREAK: 'sensory-break',
  CALM_DOWN: 'calm-down',
};

// ============================================
// SOURCE COLORS - Consistent colors per source
// ============================================
export const SOURCE_COLORS = {
  [SCHEDULE_SOURCES.MANUAL]: '#4A9FD4',
  [SCHEDULE_SOURCES.CHOICE_BOARD]: '#8E6BBF',
  [SCHEDULE_SOURCES.SLEEP_TRACKER]: '#6B5B95',
  [SCHEDULE_SOURCES.HEALTHY_CHOICES]: '#5CB85C',
  [SCHEDULE_SOURCES.MOVE_EXERCISE]: '#E63B2E',
  [SCHEDULE_SOURCES.NUTRITION]: '#F5A623',
  [SCHEDULE_SOURCES.WATER_TRACKER]: '#4A9FD4',
  [SCHEDULE_SOURCES.SOCIAL_STORIES]: '#E86B9A',
  [SCHEDULE_SOURCES.DAILY_ROUTINE]: '#20B2AA',
  [SCHEDULE_SOURCES.APPOINTMENT]: '#8E6BBF',
  [SCHEDULE_SOURCES.FIRST_THEN]: '#CD853F',
  // NEW: Emotional Wellness colors
  [SCHEDULE_SOURCES.EMOTION_CHECKIN]: '#F5A623',  // Orange for emotions
  [SCHEDULE_SOURCES.COPING_SKILL]: '#20B2AA',     // Teal for coping
  [SCHEDULE_SOURCES.SENSORY_BREAK]: '#E86B9A',    // Pink for sensory
  [SCHEDULE_SOURCES.CALM_DOWN]: '#8E6BBF',        // Purple for calm
};

// ============================================
// SOURCE EMOJIS - Default emojis per source
// ============================================
export const SOURCE_EMOJIS = {
  [SCHEDULE_SOURCES.MANUAL]: '⭐',
  [SCHEDULE_SOURCES.CHOICE_BOARD]: '🎯',
  [SCHEDULE_SOURCES.SLEEP_TRACKER]: '🌙',
  [SCHEDULE_SOURCES.HEALTHY_CHOICES]: '✨',
  [SCHEDULE_SOURCES.MOVE_EXERCISE]: '🏃',
  [SCHEDULE_SOURCES.NUTRITION]: '🍎',
  [SCHEDULE_SOURCES.WATER_TRACKER]: '💧',
  [SCHEDULE_SOURCES.SOCIAL_STORIES]: '📖',
  [SCHEDULE_SOURCES.DAILY_ROUTINE]: '📋',
  [SCHEDULE_SOURCES.APPOINTMENT]: '📅',
  [SCHEDULE_SOURCES.FIRST_THEN]: '1️⃣',
  // NEW: Emotional Wellness emojis
  [SCHEDULE_SOURCES.EMOTION_CHECKIN]: '💚',
  [SCHEDULE_SOURCES.COPING_SKILL]: '🧘',
  [SCHEDULE_SOURCES.SENSORY_BREAK]: '🌈',
  [SCHEDULE_SOURCES.CALM_DOWN]: '🕊️',
};

// ============================================
// BASIC SCHEDULE OPERATIONS
// ============================================

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

// ============================================
// DATE HELPERS
// ============================================

/**
 * Get today's date as YYYY-MM-DD string
 */
export const getToday = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get tomorrow's date as YYYY-MM-DD string
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
  const date = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (dateStr === today.toISOString().split('T')[0]) {
    return 'Today';
  }
  if (dateStr === tomorrow.toISOString().split('T')[0]) {
    return 'Tomorrow';
  }
  
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Format time for display (24h to 12h)
 */
export const formatTimeDisplay = (time24) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

// ============================================
// MAIN ACTIVITY FUNCTION
// ============================================

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
 * @param {string} options.source - Source app (e.g., "sleep-tracker", "emotion-checkin")
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
      icon: null,
      color: color,
      completed: false,
      customImage: customImage,
      source: source,
      notifications: notify ? [0, 5] : [],
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
 * Check if an activity already exists at a specific time
 */
export const activityExists = (date, name, time) => {
  const schedule = getScheduleForDate(date);
  return schedule.items.some(
    item => item.name === name && item.time === time
  );
};

/**
 * Remove an activity from the schedule
 */
export const removeActivityFromSchedule = (date, activityId) => {
  try {
    const schedules = getAllSchedules();
    const dateSchedule = schedules[date];
    
    if (!dateSchedule || !dateSchedule.items) {
      return { success: false, error: 'Schedule not found' };
    }
    
    const index = dateSchedule.items.findIndex(item => item.id === activityId);
    if (index === -1) {
      return { success: false, error: 'Activity not found' };
    }
    
    dateSchedule.items.splice(index, 1);
    schedules[date] = dateSchedule;
    
    const saved = saveAllSchedules(schedules);
    return { success: saved, error: saved ? null : 'Failed to save' };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

// ============================================
// EMOTIONAL WELLNESS HELPERS
// ============================================

/**
 * Add emotion check-in reminder to schedule
 */
export const addEmotionCheckin = ({ date, time = '10:00', notify = true }) => {
  return addActivityToSchedule({
    date,
    time,
    name: 'How am I feeling?',
    emoji: SOURCE_EMOJIS[SCHEDULE_SOURCES.EMOTION_CHECKIN],
    color: SOURCE_COLORS[SCHEDULE_SOURCES.EMOTION_CHECKIN],
    source: SCHEDULE_SOURCES.EMOTION_CHECKIN,
    notify,
    metadata: { type: 'emotion-checkin' },
  });
};

/**
 * Add coping skill break to schedule
 */
export const addCopingBreak = ({ date, time = '14:00', skillName = 'Take a break', emoji = '🧘', notify = true }) => {
  return addActivityToSchedule({
    date,
    time,
    name: skillName,
    emoji: emoji,
    color: SOURCE_COLORS[SCHEDULE_SOURCES.COPING_SKILL],
    source: SCHEDULE_SOURCES.COPING_SKILL,
    notify,
    metadata: { type: 'coping-skill', skill: skillName },
  });
};

/**
 * Add sensory break to schedule
 */
export const addSensoryBreak = ({ date, time = '15:00', breakName = 'Sensory Break', emoji = '🌈', notify = true }) => {
  return addActivityToSchedule({
    date,
    time,
    name: breakName,
    emoji: emoji,
    color: SOURCE_COLORS[SCHEDULE_SOURCES.SENSORY_BREAK],
    source: SCHEDULE_SOURCES.SENSORY_BREAK,
    notify,
    metadata: { type: 'sensory-break', activity: breakName },
  });
};

/**
 * Add multiple emotion check-ins throughout the day
 */
export const addDailyEmotionCheckins = (date, times = ['09:00', '12:00', '15:00', '18:00']) => {
  const activities = times.map(time => ({
    date,
    time,
    name: 'How am I feeling?',
    emoji: SOURCE_EMOJIS[SCHEDULE_SOURCES.EMOTION_CHECKIN],
    color: SOURCE_COLORS[SCHEDULE_SOURCES.EMOTION_CHECKIN],
    source: SCHEDULE_SOURCES.EMOTION_CHECKIN,
    notify: true,
    metadata: { type: 'emotion-checkin' },
  }));
  
  return addMultipleActivities(activities);
};

/**
 * Add coping skill routine (multiple breaks)
 */
export const addCopingRoutine = (date, skills) => {
  // skills = [{ time: '10:00', name: 'Deep breathing', emoji: '🌬️' }, ...]
  const activities = skills.map(skill => ({
    date,
    time: skill.time,
    name: skill.name,
    emoji: skill.emoji || '🧘',
    color: SOURCE_COLORS[SCHEDULE_SOURCES.COPING_SKILL],
    source: SCHEDULE_SOURCES.COPING_SKILL,
    notify: true,
    metadata: { type: 'coping-skill', skill: skill.name },
  }));
  
  return addMultipleActivities(activities);
};

// ============================================
// SLEEP HELPERS
// ============================================

/**
 * Add bedtime and wake-up reminders
 */
export const addSleepReminders = ({ date, bedtime = '20:00', waketime = '07:00' }) => {
  const activities = [
    {
      date,
      time: bedtime,
      name: 'Bedtime Routine',
      emoji: '🌙',
      color: SOURCE_COLORS[SCHEDULE_SOURCES.SLEEP_TRACKER],
      source: SCHEDULE_SOURCES.SLEEP_TRACKER,
      notify: true,
      metadata: { type: 'bedtime' },
    },
  ];
  
  // Add wake-up time (might be next day)
  const wakeDate = waketime < bedtime ? getTomorrow() : date;
  activities.push({
    date: wakeDate,
    time: waketime,
    name: 'Wake Up Time',
    emoji: '🌅',
    color: '#F5A623',
    source: SCHEDULE_SOURCES.SLEEP_TRACKER,
    notify: true,
    metadata: { type: 'waketime' },
  });
  
  return addMultipleActivities(activities);
};

// ============================================
// EXPORT DEFAULT
// ============================================
export default {
  SCHEDULE_SOURCES,
  SOURCE_COLORS,
  SOURCE_EMOJIS,
  getAllSchedules,
  getScheduleForDate,
  saveAllSchedules,
  getToday,
  getTomorrow,
  formatDateDisplay,
  formatTimeDisplay,
  addActivityToSchedule,
  addMultipleActivities,
  activityExists,
  removeActivityFromSchedule,
  addEmotionCheckin,
  addCopingBreak,
  addSensoryBreak,
  addDailyEmotionCheckins,
  addCopingRoutine,
  addSleepReminders,
};
