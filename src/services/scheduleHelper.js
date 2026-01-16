// scheduleHelper.js - Unified helper for adding activities to Visual Schedule
// =============================================================================
// IMPORTANT: This is the ONLY service that should be used for schedule integration!
// All modules should import from this file, NOT from scheduleIntegration.js
// =============================================================================
// Storage key: snw_calendar_schedules
// Format: { "2025-01-15": { items: [...] }, "2025-01-16": { items: [...] } }

const SCHEDULE_STORAGE_KEY = 'snw_calendar_schedules';

// =============================================================================
// DATE HELPERS
// =============================================================================

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getToday = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get tomorrow's date in YYYY-MM-DD format
 */
export const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

/**
 * Add days to a date
 * @param {Date|string} date - Starting date
 * @param {number} days - Number of days to add
 * @returns {string} Date in YYYY-MM-DD format
 */
export const addDays = (date, days) => {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

/**
 * Format date for display (e.g., "Jan 15, 2025")
 */
export const formatDateDisplay = (dateStr) => {
  const date = new Date(dateStr + 'T12:00:00'); // Noon to avoid timezone issues
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Format time for display (e.g., "9:00 AM")
 */
export const formatTimeDisplay = (time24) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

// =============================================================================
// SCHEDULE SOURCES - Identifies where activities came from
// =============================================================================

export const SCHEDULE_SOURCES = {
  // Trackers
  SLEEP_TRACKER: 'sleep-tracker',
  HEALTHY_CHOICES: 'healthy-choices',
  WATER_TRACKER: 'water-tracker',
  MOVE_EXERCISE: 'move-exercise',
  NUTRITION: 'nutrition',
  
  // Activities
  SOCIAL_STORIES: 'social-stories',
  CHOICE_BOARD: 'choice-board',
  SENSORY_BREAKS: 'sensory-breaks',
  
  // Tools & Services
  OT_EXERCISES: 'ot-exercises',
  APPOINTMENTS: 'appointments',
  REMINDERS: 'reminders',
  DAILY_ROUTINES: 'daily-routines',
  FIRST_THEN: 'first-then',
  
  // Generic
  CUSTOM: 'custom',
  MANUAL: 'manual',
};

// Pre-defined colors for each source (for visual consistency)
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
  [SCHEDULE_SOURCES.MANUAL]: '#4A9FD4',           // Blue
};

// =============================================================================
// CORE STORAGE FUNCTIONS
// =============================================================================

/**
 * Get all schedules from localStorage
 * @returns {Object} All schedules keyed by date string (YYYY-MM-DD)
 */
export const getAllSchedules = () => {
  try {
    const data = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('[ScheduleHelper] Failed to load schedules:', e);
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
 * @returns {boolean} Success status
 */
export const saveAllSchedules = (schedules) => {
  try {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedules));
    return true;
  } catch (e) {
    console.error('[ScheduleHelper] Failed to save schedules:', e);
    return false;
  }
};

// =============================================================================
// MAIN ACTIVITY FUNCTION - Used by all integrations
// =============================================================================

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
 * @param {string} options.source - Source app (use SCHEDULE_SOURCES constant)
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
    
    // Create unique activity ID
    const activityId = `${source}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create new activity item
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
      notifications: notify ? [0, 5] : [], // 0 and 5 minutes before
      metadata: metadata,
      createdAt: new Date().toISOString(),
    };

    // Add to schedule and sort by time
    dateSchedule.items.push(newActivity);
    dateSchedule.items.sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
    
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
 * Check if an activity already exists at a specific date/time
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} name - Activity name
 * @param {string} time - Time in HH:MM format
 * @returns {boolean}
 */
export const activityExists = (date, name, time) => {
  try {
    const schedule = getScheduleForDate(date);
    return schedule.items.some(
      item => item.name === name && item.time === time
    );
  } catch (e) {
    return false;
  }
};

/**
 * Remove an activity from the schedule
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} activityId - Activity ID to remove
 * @returns {Object} { success: boolean, error: string|null }
 */
export const removeActivityFromSchedule = (date, activityId) => {
  try {
    const schedules = getAllSchedules();
    const dateSchedule = schedules[date];
    
    if (!dateSchedule || !dateSchedule.items) {
      return { success: false, error: 'No schedule found for this date' };
    }
    
    const originalLength = dateSchedule.items.length;
    dateSchedule.items = dateSchedule.items.filter(item => item.id !== activityId && item.activityId !== activityId);
    
    if (dateSchedule.items.length === originalLength) {
      return { success: false, error: 'Activity not found' };
    }
    
    schedules[date] = dateSchedule;
    saveAllSchedules(schedules);
    
    return { success: true, error: null };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

/**
 * Get activities by source for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} source - Source identifier
 * @returns {Array} Activities from that source
 */
export const getActivitiesBySource = (date, source) => {
  const schedule = getScheduleForDate(date);
  return schedule.items.filter(item => item.source === source);
};

/**
 * Remove all activities from a specific source on a date
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} source - Source identifier
 * @returns {Object} { success: boolean, removed: number }
 */
export const removeActivitiesBySource = (date, source) => {
  try {
    const schedules = getAllSchedules();
    const dateSchedule = schedules[date];
    
    if (!dateSchedule || !dateSchedule.items) {
      return { success: true, removed: 0 };
    }
    
    const originalLength = dateSchedule.items.length;
    dateSchedule.items = dateSchedule.items.filter(item => item.source !== source);
    const removed = originalLength - dateSchedule.items.length;
    
    schedules[date] = dateSchedule;
    saveAllSchedules(schedules);
    
    return { success: true, removed };
  } catch (e) {
    return { success: false, removed: 0, error: e.message };
  }
};

// =============================================================================
// SPECIFIC HELPER FUNCTIONS - For individual modules
// =============================================================================

/**
 * Add exercise activity to schedule (for MoveExercise.jsx)
 * @param {string} exerciseName - Name of the exercise
 * @param {string} time - Time in HH:MM format
 * @param {number} duration - Duration in minutes (default: 30)
 * @param {string|null} date - Date in YYYY-MM-DD format (default: today)
 * @returns {Object} Result object
 */
export const addExerciseToSchedule = (exerciseName, time, duration = 30, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: `Exercise: ${exerciseName}`,
    time: time,
    emoji: '🏃',
    color: SOURCE_COLORS[SCHEDULE_SOURCES.MOVE_EXERCISE],
    source: SCHEDULE_SOURCES.MOVE_EXERCISE,
    notify: true,
    metadata: { 
      type: 'exercise', 
      exerciseName: exerciseName, 
      duration: duration 
    },
  });
};

/**
 * Add social story reading to schedule (for SocialStories.jsx)
 * @param {Object} story - Story object { id, title, category }
 * @param {string} time - Time in HH:MM format
 * @param {string|null} date - Date in YYYY-MM-DD format (default: today)
 * @returns {Object} Result object
 */
export const addSocialStoryToSchedule = (story, time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: `Read: ${story.title}`,
    time: time,
    emoji: '📖',
    color: SOURCE_COLORS[SCHEDULE_SOURCES.SOCIAL_STORIES],
    source: SCHEDULE_SOURCES.SOCIAL_STORIES,
    notify: true,
    metadata: {
      storyId: story.id,
      storyTitle: story.title,
      category: story.category,
    },
  });
};

/**
 * Add meal to schedule (for Nutrition.jsx)
 * @param {string} mealType - 'breakfast', 'lunch', 'dinner', or 'snack'
 * @param {string|null} recipeName - Name of recipe (optional)
 * @param {string|null} time - Time in HH:MM format (optional, uses default)
 * @param {string|null} date - Date in YYYY-MM-DD format (default: today)
 * @returns {Object} Result object
 */
export const addMealToSchedule = (mealType, recipeName = null, time = null, date = null) => {
  const mealDefaults = {
    breakfast: { time: '08:00', emoji: '🥣' },
    lunch: { time: '12:00', emoji: '🥗' },
    dinner: { time: '18:00', emoji: '🍽️' },
    snack: { time: '15:00', emoji: '🍎' },
  };
  
  const defaults = mealDefaults[mealType.toLowerCase()] || mealDefaults.lunch;
  const displayName = recipeName 
    ? `${mealType.charAt(0).toUpperCase() + mealType.slice(1)}: ${recipeName}`
    : mealType.charAt(0).toUpperCase() + mealType.slice(1);
  
  return addActivityToSchedule({
    date: date || getToday(),
    name: displayName,
    time: time || defaults.time,
    emoji: defaults.emoji,
    color: SOURCE_COLORS[SCHEDULE_SOURCES.NUTRITION],
    source: SCHEDULE_SOURCES.NUTRITION,
    notify: true,
    metadata: { 
      type: 'meal', 
      mealType: mealType, 
      recipeName: recipeName 
    },
  });
};

/**
 * Add OT exercise to schedule (for OTExercises.jsx)
 * @param {Object} exercise - Exercise object { id, name, emoji, muscleGroup, duration, category }
 * @param {string} time - Time in HH:MM format
 * @param {string|null} date - Date in YYYY-MM-DD format (default: today)
 * @returns {Object} Result object
 */
export const addOTExerciseToSchedule = (exercise, time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: `OT: ${exercise.name}`,
    time: time,
    emoji: exercise.emoji || '🏋️',
    color: SOURCE_COLORS[SCHEDULE_SOURCES.OT_EXERCISES],
    source: SCHEDULE_SOURCES.OT_EXERCISES,
    notify: true,
    metadata: {
      exerciseId: exercise.id,
      muscleGroup: exercise.muscleGroup,
      duration: exercise.duration,
      category: exercise.category,
    },
  });
};

/**
 * Add sensory break to schedule (for SensoryBreaks.jsx)
 * @param {Object} breakActivity - Break object { id, name, emoji, duration, category }
 * @param {string} time - Time in HH:MM format
 * @param {string|null} date - Date in YYYY-MM-DD format (default: today)
 * @returns {Object} Result object
 */
export const addSensoryBreakToSchedule = (breakActivity, time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: `Break: ${breakActivity.name}`,
    time: time,
    emoji: breakActivity.emoji || '🧘',
    color: SOURCE_COLORS[SCHEDULE_SOURCES.SENSORY_BREAKS],
    source: SCHEDULE_SOURCES.SENSORY_BREAKS,
    notify: true,
    metadata: {
      breakId: breakActivity.id,
      duration: breakActivity.duration,
      category: breakActivity.category,
    },
  });
};

/**
 * Add water reminder to schedule (for WaterTracker.jsx)
 * @param {string} time - Time in HH:MM format
 * @param {string|null} date - Date in YYYY-MM-DD format (default: today)
 * @returns {Object} Result object
 */
export const addWaterReminderToSchedule = (time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: 'Drink Water',
    time: time,
    emoji: '💧',
    color: SOURCE_COLORS[SCHEDULE_SOURCES.WATER_TRACKER],
    source: SCHEDULE_SOURCES.WATER_TRACKER,
    notify: true,
    metadata: { type: 'water-reminder' },
  });
};

/**
 * Add appointment to schedule (for AppointmentTracker.jsx)
 * @param {Object} appointment - Appointment object
 * @returns {Object} Result object
 */
export const addAppointmentToSchedule = (appointment) => {
  const typeEmojis = {
    therapy: '🗣️',
    doctor: '👨‍⚕️',
    school: '🏫',
    evaluation: '📋',
    specialist: '🔬',
    other: '📅',
  };
  
  const displayName = appointment.providerName 
    ? `${appointment.providerName}${appointment.location ? ` @ ${appointment.location}` : ''}`
    : `${appointment.type || 'Appointment'}${appointment.location ? ` @ ${appointment.location}` : ''}`;
  
  return addActivityToSchedule({
    date: appointment.date,
    name: displayName,
    time: appointment.time,
    emoji: typeEmojis[appointment.type] || '📅',
    color: SOURCE_COLORS[SCHEDULE_SOURCES.APPOINTMENTS],
    source: SCHEDULE_SOURCES.APPOINTMENTS,
    notify: true,
    metadata: {
      appointmentId: appointment.id,
      type: appointment.type,
      providerName: appointment.providerName,
      location: appointment.location,
      notes: appointment.notes,
    },
  });
};

/**
 * Add reminder to schedule (for Reminders.jsx)
 * @param {Object} reminder - Reminder object { id, title, category, time, date }
 * @returns {Object} Result object
 */
export const addReminderToSchedule = (reminder) => {
  const categoryEmojis = {
    activity: '⭐',
    medicine: '💊',
    appointment: '📅',
    meal: '🍽️',
    hygiene: '🧼',
    other: '🔔',
  };
  
  return addActivityToSchedule({
    date: reminder.date || getToday(),
    name: reminder.title,
    time: reminder.time,
    emoji: categoryEmojis[reminder.category] || '🔔',
    color: SOURCE_COLORS[SCHEDULE_SOURCES.REMINDERS],
    source: SCHEDULE_SOURCES.REMINDERS,
    notify: true,
    metadata: {
      reminderId: reminder.id,
      category: reminder.category,
      repeat: reminder.repeat,
    },
  });
};

/**
 * Add First-Then pair to schedule (for FirstThen.jsx)
 * @param {Object} firstActivity - First activity { name, emoji }
 * @param {Object} thenActivity - Then activity { name, emoji }
 * @param {string} time - Time for the "first" activity
 * @param {string|null} date - Date in YYYY-MM-DD format (default: today)
 * @param {number} gapMinutes - Minutes between first and then (default: 15)
 * @returns {Object} Result object
 */
export const addFirstThenToSchedule = (firstActivity, thenActivity, time, date = null, gapMinutes = 15) => {
  const targetDate = date || getToday();
  
  // Calculate "then" time
  const [hours, minutes] = time.split(':').map(Number);
  const thenMinutes = hours * 60 + minutes + gapMinutes;
  const thenHours = Math.floor(thenMinutes / 60);
  const thenMins = thenMinutes % 60;
  const thenTime = `${String(thenHours).padStart(2, '0')}:${String(thenMins).padStart(2, '0')}`;
  
  // Add both activities
  const firstResult = addActivityToSchedule({
    date: targetDate,
    name: `First: ${firstActivity.name}`,
    time: time,
    emoji: firstActivity.emoji || '1️⃣',
    color: SOURCE_COLORS[SCHEDULE_SOURCES.FIRST_THEN],
    source: SCHEDULE_SOURCES.FIRST_THEN,
    notify: true,
    metadata: { type: 'first', linkedTo: thenActivity.name },
  });
  
  const thenResult = addActivityToSchedule({
    date: targetDate,
    name: `Then: ${thenActivity.name}`,
    time: thenTime,
    emoji: thenActivity.emoji || '2️⃣',
    color: SOURCE_COLORS[SCHEDULE_SOURCES.FIRST_THEN],
    source: SCHEDULE_SOURCES.FIRST_THEN,
    notify: true,
    metadata: { type: 'then', linkedTo: firstActivity.name },
  });
  
  return {
    success: firstResult.success && thenResult.success,
    firstActivityId: firstResult.activityId,
    thenActivityId: thenResult.activityId,
  };
};

/**
 * Add daily routine items to schedule (for DailyRoutines.jsx)
 * @param {Array} routineItems - Array of { name, emoji } objects
 * @param {string} period - 'morning', 'afternoon', or 'evening'
 * @param {string|null} date - Date in YYYY-MM-DD format (default: today)
 * @returns {Object} Result object
 */
export const addRoutineToSchedule = (routineItems, period, date = null) => {
  const periodConfig = {
    morning: { startHour: 7, startMin: 0, interval: 15 },
    afternoon: { startHour: 12, startMin: 0, interval: 20 },
    evening: { startHour: 18, startMin: 0, interval: 20 },
  };
  
  const config = periodConfig[period] || periodConfig.morning;
  const targetDate = date || getToday();
  
  const activities = routineItems.map((item, index) => ({
    date: targetDate,
    name: item.name,
    time: (() => {
      const totalMinutes = (config.startHour * 60) + config.startMin + (index * config.interval);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    })(),
    emoji: item.emoji || '✨',
    color: SOURCE_COLORS[SCHEDULE_SOURCES.DAILY_ROUTINES],
    source: SCHEDULE_SOURCES.DAILY_ROUTINES,
    notify: true,
    metadata: { routineItemId: item.id, period },
  }));
  
  return addMultipleActivities(activities);
};

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default {
  // Date helpers
  getToday,
  getTomorrow,
  addDays,
  formatDateDisplay,
  formatTimeDisplay,
  
  // Constants
  SCHEDULE_SOURCES,
  SOURCE_COLORS,
  
  // Core functions
  getAllSchedules,
  getScheduleForDate,
  saveAllSchedules,
  addActivityToSchedule,
  addMultipleActivities,
  activityExists,
  removeActivityFromSchedule,
  getActivitiesBySource,
  removeActivitiesBySource,
  
  // Specific helpers
  addExerciseToSchedule,
  addSocialStoryToSchedule,
  addMealToSchedule,
  addOTExerciseToSchedule,
  addSensoryBreakToSchedule,
  addWaterReminderToSchedule,
  addAppointmentToSchedule,
  addReminderToSchedule,
  addFirstThenToSchedule,
  addRoutineToSchedule,
};
