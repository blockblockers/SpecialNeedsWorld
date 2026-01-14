// scheduleIntegration.js - Shared service for adding items to Visual Schedule
// Used by: Appointments, Reminders, Daily Routines, First-Then, OT Exercises,
//          Sensory Breaks, Health Trackers, Social Stories
// Now with cloud sync support!

import {
  formatDate,
  formatDisplayDate,
  getToday,
  addDays,
  saveScheduleToDate,
  getScheduleForDate,
} from './calendar';
import {
  scheduleActivityNotifications,
  getNotificationSettings,
  getPermissionStatus,
} from './notifications';
import {
  saveSchedule as saveScheduleWithSync,
} from './calendarSync';

// Get current user ID if available (for cloud sync)
const getCurrentUserId = () => {
  try {
    const authData = localStorage.getItem('sb-auth-token');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed?.user?.id || null;
    }
  } catch {
    // Ignore errors
  }
  return null;
};

// ============================================
// ACTIVITY SOURCES - identifies where activity came from
// ============================================
export const ACTIVITY_SOURCES = {
  MANUAL: 'manual',
  CHOICE_BOARD: 'choiceBoard',
  APPOINTMENT: 'appointment',
  REMINDER: 'reminder',
  DAILY_ROUTINE: 'dailyRoutine',
  FIRST_THEN: 'firstThen',
  OT_EXERCISE: 'otExercise',
  SENSORY_BREAK: 'sensoryBreak',
  WATER_TRACKER: 'waterTracker',
  MEDICINE: 'medicine',
  EXERCISE: 'exercise',
  SOCIAL_STORY: 'socialStory',
};

// ============================================
// DEFAULT ICONS/EMOJIS BY SOURCE
// ============================================
const SOURCE_DEFAULTS = {
  [ACTIVITY_SOURCES.APPOINTMENT]: { emoji: '📅', color: '#8E6BBF' },
  [ACTIVITY_SOURCES.REMINDER]: { emoji: '🔔', color: '#F5A623' },
  [ACTIVITY_SOURCES.DAILY_ROUTINE]: { emoji: '📋', color: '#5CB85C' },
  [ACTIVITY_SOURCES.FIRST_THEN]: { emoji: '➡️', color: '#4A9FD4' },
  [ACTIVITY_SOURCES.OT_EXERCISE]: { emoji: '🏋️', color: '#E86B9A' },
  [ACTIVITY_SOURCES.SENSORY_BREAK]: { emoji: '🧘', color: '#20B2AA' },
  [ACTIVITY_SOURCES.WATER_TRACKER]: { emoji: '💧', color: '#4A9FD4' },
  [ACTIVITY_SOURCES.MEDICINE]: { emoji: '💊', color: '#E63B2E' },
  [ACTIVITY_SOURCES.EXERCISE]: { emoji: '🏃', color: '#5CB85C' },
  [ACTIVITY_SOURCES.SOCIAL_STORY]: { emoji: '📖', color: '#8E6BBF' },
};

// ============================================
// ADD SINGLE ACTIVITY TO SCHEDULE
// ============================================
/**
 * Add a single activity to Visual Schedule
 * @param {Object} options
 * @param {Date|string} options.date - Date to add activity to
 * @param {string} options.name - Activity name
 * @param {string} options.time - Time in HH:MM format (optional)
 * @param {string} options.emoji - Emoji for the activity
 * @param {string} options.color - Color for the activity
 * @param {string} options.source - ACTIVITY_SOURCES constant
 * @param {boolean} options.notify - Whether to send notifications
 * @param {Object} options.metadata - Additional data (appointmentId, reminderId, etc.)
 * @param {string} options.customImage - Base64 image (optional)
 * @returns {Object} { success: boolean, activity: Object, error?: string }
 */
export const addActivityToSchedule = ({
  date,
  name,
  time = null,
  emoji = null,
  color = null,
  source = ACTIVITY_SOURCES.MANUAL,
  notify = true,
  metadata = {},
  customImage = null,
}) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const dateStr = formatDate(dateObj);
    
    // Get defaults from source
    const defaults = SOURCE_DEFAULTS[source] || { emoji: '⭐', color: '#4A9FD4' };
    
    // Get existing schedule
    const existingSchedule = getScheduleForDate(dateStr);
    const activities = existingSchedule?.activities || [];
    
    // Create new activity
    const newActivity = {
      id: Date.now() + Math.random(),
      activityId: `${source}-${Date.now()}`,
      name,
      time,
      emoji: emoji || defaults.emoji,
      color: color || defaults.color,
      notify,
      completed: false,
      source,
      metadata,
      customImage,
      createdAt: new Date().toISOString(),
    };
    
    // Add to activities and sort by time
    const newActivities = [...activities, newActivity].sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
    
    // Build schedule object
    const schedule = {
      id: existingSchedule?.id || Date.now(),
      name: existingSchedule?.name || `Schedule for ${formatDisplayDate(dateObj)}`,
      activities: newActivities,
      date: dateStr,
      updatedAt: new Date().toISOString(),
    };
    
    // Save locally first (always)
    saveScheduleToDate(dateStr, schedule);
    
    // Try cloud sync if user is authenticated
    const userId = getCurrentUserId();
    if (userId) {
      saveScheduleWithSync(userId, dateStr, schedule).catch(err => {
        console.log('Cloud sync deferred, will sync on next visit');
      });
    }
    
    // Schedule notifications if enabled
    if (notify && time) {
      const settings = getNotificationSettings();
      if (settings.globalEnabled && getPermissionStatus() === 'granted') {
        scheduleActivityNotifications(dateStr, newActivities, { repeatUntilComplete: true });
      }
    }
    
    return { success: true, activity: newActivity };
  } catch (error) {
    console.error('Error adding activity to schedule:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// ADD MULTIPLE ACTIVITIES TO SCHEDULE
// ============================================
/**
 * Add multiple activities to Visual Schedule (e.g., daily routine)
 * @param {Object} options
 * @param {Date|string} options.date - Date to add activities to
 * @param {Array} options.activities - Array of activity objects
 * @param {string} options.source - ACTIVITY_SOURCES constant
 * @param {boolean} options.notify - Whether to send notifications
 * @returns {Object} { success: boolean, count: number, error?: string }
 */
export const addMultipleActivitiesToSchedule = ({
  date,
  activities,
  source = ACTIVITY_SOURCES.MANUAL,
  notify = true,
}) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const dateStr = formatDate(dateObj);
    
    // Get defaults from source
    const defaults = SOURCE_DEFAULTS[source] || { emoji: '⭐', color: '#4A9FD4' };
    
    // Get existing schedule
    const existingSchedule = getScheduleForDate(dateStr);
    const existingActivities = existingSchedule?.activities || [];
    
    // Create new activities
    const newActivities = activities.map((activity, index) => ({
      id: Date.now() + index + Math.random(),
      activityId: `${source}-${Date.now()}-${index}`,
      name: activity.name,
      time: activity.time || null,
      emoji: activity.emoji || defaults.emoji,
      color: activity.color || defaults.color,
      notify: activity.notify !== undefined ? activity.notify : notify,
      completed: false,
      source,
      metadata: activity.metadata || {},
      customImage: activity.customImage || null,
      createdAt: new Date().toISOString(),
    }));
    
    // Merge and sort by time
    const allActivities = [...existingActivities, ...newActivities].sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
    
    // Build schedule object
    const schedule = {
      id: existingSchedule?.id || Date.now(),
      name: existingSchedule?.name || `Schedule for ${formatDisplayDate(dateObj)}`,
      activities: allActivities,
      date: dateStr,
      updatedAt: new Date().toISOString(),
    };
    
    // Save locally first (always)
    saveScheduleToDate(dateStr, schedule);
    
    // Try cloud sync if user is authenticated
    const userId = getCurrentUserId();
    if (userId) {
      saveScheduleWithSync(userId, dateStr, schedule).catch(err => {
        console.log('Cloud sync deferred, will sync on next visit');
      });
    }
    
    // Schedule notifications if enabled
    if (notify) {
      const settings = getNotificationSettings();
      if (settings.globalEnabled && getPermissionStatus() === 'granted') {
        scheduleActivityNotifications(dateStr, allActivities, { repeatUntilComplete: true });
      }
    }
    
    return { success: true, count: newActivities.length };
  } catch (error) {
    console.error('Error adding multiple activities to schedule:', error);
    return { success: false, count: 0, error: error.message };
  }
};

// ============================================
// REMOVE ACTIVITIES BY SOURCE
// ============================================
/**
 * Remove all activities from a specific source on a given date
 * @param {Date|string} date - Date to remove activities from
 * @param {string} source - ACTIVITY_SOURCES constant
 * @returns {Object} { success: boolean, removed: number }
 */
export const removeActivitiesBySource = (date, source) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const dateStr = formatDate(dateObj);
    
    const existingSchedule = getScheduleForDate(dateStr);
    if (!existingSchedule) return { success: true, removed: 0 };
    
    const originalCount = existingSchedule.activities?.length || 0;
    const filteredActivities = (existingSchedule.activities || []).filter(
      a => a.source !== source
    );
    const removedCount = originalCount - filteredActivities.length;
    
    if (removedCount > 0) {
      saveScheduleToDate(dateStr, {
        ...existingSchedule,
        activities: filteredActivities,
        updatedAt: new Date().toISOString(),
      });
    }
    
    return { success: true, removed: removedCount };
  } catch (error) {
    console.error('Error removing activities by source:', error);
    return { success: false, removed: 0, error: error.message };
  }
};

// ============================================
// CHECK IF ACTIVITY EXISTS
// ============================================
/**
 * Check if an activity from a specific source already exists on a date
 * @param {Date|string} date - Date to check
 * @param {string} source - ACTIVITY_SOURCES constant
 * @param {string} metadataKey - Key in metadata to match
 * @param {any} metadataValue - Value to match
 * @returns {boolean}
 */
export const activityExists = (date, source, metadataKey, metadataValue) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const dateStr = formatDate(dateObj);
    
    const schedule = getScheduleForDate(dateStr);
    if (!schedule?.activities) return false;
    
    return schedule.activities.some(
      a => a.source === source && a.metadata?.[metadataKey] === metadataValue
    );
  } catch (error) {
    return false;
  }
};

// ============================================
// GET ACTIVITIES BY SOURCE
// ============================================
/**
 * Get all activities from a specific source on a given date
 * @param {Date|string} date - Date to get activities from
 * @param {string} source - ACTIVITY_SOURCES constant
 * @returns {Array} Activities from that source
 */
export const getActivitiesBySource = (date, source) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const dateStr = formatDate(dateObj);
    
    const schedule = getScheduleForDate(dateStr);
    if (!schedule?.activities) return [];
    
    return schedule.activities.filter(a => a.source === source);
  } catch (error) {
    return [];
  }
};

// ============================================
// ADD TO SCHEDULE MODAL COMPONENT HELPER
// ============================================
/**
 * Generate common modal state and handlers for "Add to Schedule" functionality
 * @param {Function} setShowModal - State setter for showing modal
 * @param {Function} setScheduleDate - State setter for date
 * @param {Function} setScheduleTime - State setter for time
 * @returns {Object} Common handlers
 */
export const createScheduleModalHandlers = (setShowModal, setScheduleDate, setScheduleTime) => {
  const today = getToday();
  
  return {
    openModal: () => {
      setScheduleDate(formatDate(today));
      setScheduleTime('09:00');
      setShowModal(true);
    },
    closeModal: () => {
      setShowModal(false);
    },
    dateOptions: [
      { label: 'Today', value: formatDate(today) },
      { label: 'Tomorrow', value: formatDate(addDays(today, 1)) },
      { label: 'In 2 days', value: formatDate(addDays(today, 2)) },
      { label: 'In 3 days', value: formatDate(addDays(today, 3)) },
      { label: 'Next week', value: formatDate(addDays(today, 7)) },
    ],
  };
};

// ============================================
// FORMAT TIME FOR DISPLAY
// ============================================
export const formatTimeDisplay = (time24) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

// ============================================
// APPOINTMENT HELPER
// ============================================
/**
 * Add an appointment to the schedule
 * @param {Object} appointment - Appointment object
 * @returns {Object} Result
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
    color: '#8E6BBF',
    source: ACTIVITY_SOURCES.APPOINTMENT,
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

// ============================================
// DAILY ROUTINE HELPER
// ============================================
/**
 * Add routine items to schedule with auto-calculated times
 * @param {Array} routineItems - Array of { name, emoji } objects
 * @param {string} period - 'morning', 'afternoon', or 'evening'
 * @param {Date|string} date - Date to add to (defaults to today)
 * @returns {Object} Result
 */
export const addRoutineToSchedule = (routineItems, period, date = null) => {
  const periodConfig = {
    morning: { startHour: 7, startMin: 0, interval: 15 },
    afternoon: { startHour: 12, startMin: 0, interval: 20 },
    evening: { startHour: 18, startMin: 0, interval: 20 },
  };
  
  const config = periodConfig[period] || periodConfig.morning;
  const targetDate = date || getToday();
  
  const activities = routineItems.map((item, index) => {
    const totalMinutes = (config.startHour * 60) + config.startMin + (index * config.interval);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
    return {
      name: item.name,
      time,
      emoji: item.emoji || '✨',
      metadata: { routineItemId: item.id, period },
    };
  });
  
  return addMultipleActivitiesToSchedule({
    date: targetDate,
    activities,
    source: ACTIVITY_SOURCES.DAILY_ROUTINE,
    notify: true,
  });
};

// ============================================
// FIRST-THEN HELPER
// ============================================
/**
 * Add First-Then pair to schedule
 * @param {Object} firstActivity - { id, emoji, label }
 * @param {Object} thenActivity - { id, emoji, label }
 * @param {string} startTime - Start time in HH:MM format
 * @param {Date|string} date - Date (defaults to today)
 * @returns {Object} Results for both activities
 */
export const addFirstThenToSchedule = (firstActivity, thenActivity, startTime, date = null) => {
  const targetDate = date || getToday();
  const [hours, minutes] = startTime.split(':').map(Number);
  
  // Calculate "Then" time (15 minutes after "First")
  const thenTotalMinutes = (hours * 60) + minutes + 15;
  const thenHours = Math.floor(thenTotalMinutes / 60);
  const thenMins = thenTotalMinutes % 60;
  const thenTime = `${String(thenHours).padStart(2, '0')}:${String(thenMins).padStart(2, '0')}`;
  
  const results = [];
  
  // Add "First" activity
  results.push(addActivityToSchedule({
    date: targetDate,
    name: `First: ${firstActivity.label}`,
    time: startTime,
    emoji: firstActivity.emoji,
    color: '#F5A623', // Orange
    source: ACTIVITY_SOURCES.FIRST_THEN,
    notify: true,
    metadata: { type: 'first', activityId: firstActivity.id },
  }));
  
  // Add "Then" activity
  results.push(addActivityToSchedule({
    date: targetDate,
    name: `Then: ${thenActivity.label}`,
    time: thenTime,
    emoji: thenActivity.emoji,
    color: '#5CB85C', // Green
    source: ACTIVITY_SOURCES.FIRST_THEN,
    notify: true,
    metadata: { type: 'then', activityId: thenActivity.id },
  }));
  
  return {
    success: results.every(r => r.success),
    results,
  };
};

// ============================================
// REMINDER HELPER
// ============================================
/**
 * Add a reminder to the schedule
 * @param {Object} reminder - Reminder object
 * @returns {Object} Result
 */
export const addReminderToSchedule = (reminder) => {
  const categoryEmojis = {
    medication: '💊',
    therapy: '🗣️',
    appointment: '📅',
    activity: '🎯',
    routine: '⏰',
    other: '📝',
  };
  
  return addActivityToSchedule({
    date: reminder.date,
    name: reminder.title,
    time: reminder.time,
    emoji: categoryEmojis[reminder.category] || '🔔',
    color: '#F5A623',
    source: ACTIVITY_SOURCES.REMINDER,
    notify: true,
    metadata: {
      reminderId: reminder.id,
      category: reminder.category,
      repeat: reminder.repeat,
    },
  });
};

// ============================================
// OT EXERCISE HELPER
// ============================================
/**
 * Add OT exercise session to schedule
 * @param {Object} exercise - Exercise object
 * @param {string} time - Time in HH:MM format
 * @param {Date|string} date - Date (defaults to today)
 * @returns {Object} Result
 */
export const addOTExerciseToSchedule = (exercise, time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: `OT: ${exercise.name}`,
    time,
    emoji: exercise.emoji || '🏋️',
    color: '#E86B9A',
    source: ACTIVITY_SOURCES.OT_EXERCISE,
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
 * Add multiple OT exercises as a session
 * @param {Array} exercises - Array of exercise objects
 * @param {string} startTime - Start time in HH:MM format
 * @param {Date|string} date - Date (defaults to today)
 * @returns {Object} Result
 */
export const addOTSessionToSchedule = (exercises, startTime, date = null) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  let currentMinutes = hours * 60 + minutes;
  
  const activities = exercises.map((exercise) => {
    const time = `${String(Math.floor(currentMinutes / 60)).padStart(2, '0')}:${String(currentMinutes % 60).padStart(2, '0')}`;
    currentMinutes += Math.ceil((exercise.duration || 60) / 60) * 5; // 5 min per exercise minimum
    
    return {
      name: `OT: ${exercise.name}`,
      time,
      emoji: exercise.emoji || '🏋️',
      metadata: {
        exerciseId: exercise.id,
        muscleGroup: exercise.muscleGroup,
        duration: exercise.duration,
      },
    };
  });
  
  return addMultipleActivitiesToSchedule({
    date: date || getToday(),
    activities,
    source: ACTIVITY_SOURCES.OT_EXERCISE,
    notify: true,
  });
};

// ============================================
// SENSORY BREAK HELPER
// ============================================
/**
 * Add sensory break to schedule
 * @param {Object} activity - Sensory activity object
 * @param {string} time - Time in HH:MM format
 * @param {Date|string} date - Date (defaults to today)
 * @returns {Object} Result
 */
export const addSensoryBreakToSchedule = (activity, time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: `Break: ${activity.name}`,
    time,
    emoji: activity.emoji || '🧘',
    color: '#20B2AA',
    source: ACTIVITY_SOURCES.SENSORY_BREAK,
    notify: true,
    metadata: {
      activityId: activity.id,
      category: activity.category,
      duration: activity.duration,
      description: activity.description,
    },
  });
};

/**
 * Schedule regular sensory breaks throughout the day
 * @param {Object} activity - Sensory activity to schedule
 * @param {Array} times - Array of times in HH:MM format
 * @param {Date|string} date - Date (defaults to today)
 * @returns {Object} Result
 */
export const scheduleRegularBreaks = (activity, times, date = null) => {
  const activities = times.map(time => ({
    name: `Break: ${activity.name}`,
    time,
    emoji: activity.emoji || '🧘',
    metadata: {
      activityId: activity.id,
      category: activity.category,
      duration: activity.duration,
    },
  }));
  
  return addMultipleActivitiesToSchedule({
    date: date || getToday(),
    activities,
    source: ACTIVITY_SOURCES.SENSORY_BREAK,
    notify: true,
  });
};

// ============================================
// HEALTH TRACKER HELPERS
// ============================================
/**
 * Add water reminder to schedule
 * @param {string} time - Time in HH:MM format
 * @param {Date|string} date - Date (defaults to today)
 * @returns {Object} Result
 */
export const addWaterReminderToSchedule = (time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: 'Drink Water 💧',
    time,
    emoji: '💧',
    color: '#4A9FD4',
    source: ACTIVITY_SOURCES.WATER_TRACKER,
    notify: true,
    metadata: { type: 'water' },
  });
};

/**
 * Schedule water reminders throughout the day
 * @param {number} count - Number of reminders
 * @param {string} startTime - Start time (default '08:00')
 * @param {string} endTime - End time (default '20:00')
 * @param {Date|string} date - Date (defaults to today)
 * @returns {Object} Result
 */
export const scheduleWaterReminders = (count = 8, startTime = '08:00', endTime = '20:00', date = null) => {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  const interval = Math.floor((endMinutes - startMinutes) / (count - 1));
  
  const activities = [];
  for (let i = 0; i < count; i++) {
    const totalMinutes = startMinutes + (i * interval);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
    activities.push({
      name: `Drink Water 💧`,
      time,
      emoji: '💧',
      metadata: { type: 'water', reminderNumber: i + 1 },
    });
  }
  
  return addMultipleActivitiesToSchedule({
    date: date || getToday(),
    activities,
    source: ACTIVITY_SOURCES.WATER_TRACKER,
    notify: true,
  });
};

/**
 * Add medicine reminder to schedule
 * @param {string} medicineName - Name of medicine
 * @param {string} time - Time in HH:MM format
 * @param {Date|string} date - Date (defaults to today)
 * @returns {Object} Result
 */
export const addMedicineReminderToSchedule = (medicineName, time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: `Medicine: ${medicineName}`,
    time,
    emoji: '💊',
    color: '#E63B2E',
    source: ACTIVITY_SOURCES.MEDICINE,
    notify: true,
    metadata: { type: 'medicine', medicineName },
  });
};

/**
 * Add exercise reminder to schedule
 * @param {string} exerciseName - Type of exercise
 * @param {string} time - Time in HH:MM format
 * @param {number} duration - Duration in minutes
 * @param {Date|string} date - Date (defaults to today)
 * @returns {Object} Result
 */
export const addExerciseToSchedule = (exerciseName, time, duration = 30, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: `Exercise: ${exerciseName}`,
    time,
    emoji: '🏃',
    color: '#5CB85C',
    source: ACTIVITY_SOURCES.EXERCISE,
    notify: true,
    metadata: { type: 'exercise', exerciseName, duration },
  });
};

// ============================================
// SOCIAL STORY HELPER
// ============================================
/**
 * Add social story reading to schedule
 * @param {Object} story - Story object { id, title }
 * @param {string} time - Time in HH:MM format
 * @param {Date|string} date - Date (defaults to today)
 * @returns {Object} Result
 */
export const addSocialStoryToSchedule = (story, time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: `Read: ${story.title}`,
    time,
    emoji: '📖',
    color: '#8E6BBF',
    source: ACTIVITY_SOURCES.SOCIAL_STORY,
    notify: true,
    metadata: {
      storyId: story.id,
      storyTitle: story.title,
      category: story.category,
    },
  });
};

// ============================================
// MEAL / RECIPE HELPER
// ============================================
/**
 * Add meal to schedule
 * @param {string} mealType - 'breakfast', 'lunch', 'dinner', 'snack'
 * @param {string} recipeName - Name of recipe (optional)
 * @param {string} time - Time in HH:MM format (optional, uses default)
 * @param {Date|string} date - Date (defaults to today)
 * @returns {Object} Result
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
    color: '#7BC043',
    source: ACTIVITY_SOURCES.DAILY_ROUTINE, // Using routine source for meals
    notify: true,
    metadata: { type: 'meal', mealType, recipeName },
  });
};

export default {
  ACTIVITY_SOURCES,
  addActivityToSchedule,
  addMultipleActivitiesToSchedule,
  removeActivitiesBySource,
  activityExists,
  getActivitiesBySource,
  createScheduleModalHandlers,
  formatTimeDisplay,
  // Specific helpers
  addAppointmentToSchedule,
  addRoutineToSchedule,
  addFirstThenToSchedule,
  addReminderToSchedule,
  addOTExerciseToSchedule,
  addOTSessionToSchedule,
  addSensoryBreakToSchedule,
  scheduleRegularBreaks,
  addWaterReminderToSchedule,
  scheduleWaterReminders,
  addMedicineReminderToSchedule,
  addExerciseToSchedule,
  addSocialStoryToSchedule,
  addMealToSchedule,
};
