// scheduleHelper.js - Unified helper for adding activities to Visual Schedule
// This ensures ALL integrations use the same storage format
// Storage key: snw_calendar_schedules
// Updated: Complete version with ALL helper functions

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
  REMINDERS: 'reminders',
  OT_EXERCISE: 'ot-exercise',
  SENSORY_BREAK: 'sensory-break',
  EXERCISE: 'exercise',
  // Emotional Wellness sources
  EMOTION_CHECKIN: 'emotion-checkin',
  COPING_SKILL: 'coping-skill',
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
  [SCHEDULE_SOURCES.REMINDERS]: '#F5A623',
  [SCHEDULE_SOURCES.OT_EXERCISE]: '#E86B9A',
  [SCHEDULE_SOURCES.SENSORY_BREAK]: '#E86B9A',
  [SCHEDULE_SOURCES.EXERCISE]: '#5CB85C',
  // Emotional Wellness colors
  [SCHEDULE_SOURCES.EMOTION_CHECKIN]: '#F5A623',
  [SCHEDULE_SOURCES.COPING_SKILL]: '#20B2AA',
  [SCHEDULE_SOURCES.CALM_DOWN]: '#8E6BBF',
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
  [SCHEDULE_SOURCES.REMINDERS]: '🔔',
  [SCHEDULE_SOURCES.OT_EXERCISE]: '🏋️',
  [SCHEDULE_SOURCES.SENSORY_BREAK]: '🌈',
  [SCHEDULE_SOURCES.EXERCISE]: '🏃',
  // Emotional Wellness emojis
  [SCHEDULE_SOURCES.EMOTION_CHECKIN]: '💚',
  [SCHEDULE_SOURCES.COPING_SKILL]: '🧘',
  [SCHEDULE_SOURCES.CALM_DOWN]: '🕊️',
};

// ============================================
// BASIC SCHEDULE OPERATIONS
// ============================================

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
 * Get schedule for a specific date
 */
export const getScheduleForDate = (dateStr) => {
  const schedules = getAllSchedules();
  return schedules[dateStr] || { items: [] };
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
 * Add days to a date and return YYYY-MM-DD string
 */
export const addDays = (dateStr, days) => {
  const date = new Date(dateStr + 'T12:00:00');
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
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
    if (!date || !name) {
      return { success: false, activityId: null, error: 'Date and name are required' };
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return { success: false, activityId: null, error: 'Invalid date format. Use YYYY-MM-DD' };
    }

    const schedules = getAllSchedules();
    const dateSchedule = schedules[date] || { items: [] };
    
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

    dateSchedule.items.push(newActivity);
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

/**
 * Get activities by source for a specific date
 */
export const getActivitiesBySource = (date, source) => {
  const schedule = getScheduleForDate(date);
  return schedule.items.filter(item => item.source === source);
};

/**
 * Remove all activities from a specific source on a date
 */
export const removeActivitiesBySource = (date, source) => {
  try {
    const schedules = getAllSchedules();
    const dateSchedule = schedules[date];
    
    if (!dateSchedule || !dateSchedule.items) {
      return { success: true, count: 0 };
    }
    
    const originalCount = dateSchedule.items.length;
    dateSchedule.items = dateSchedule.items.filter(item => item.source !== source);
    const removedCount = originalCount - dateSchedule.items.length;
    
    schedules[date] = dateSchedule;
    const saved = saveAllSchedules(schedules);
    
    return { success: saved, count: removedCount };
  } catch (e) {
    return { success: false, count: 0, error: e.message };
  }
};

// ============================================
// SPECIFIC HELPER FUNCTIONS
// (Required by scheduleIntegration.js)
// ============================================

/**
 * Add exercise to schedule
 */
export const addExerciseToSchedule = (exerciseName, time, duration = 30, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: `Exercise: ${exerciseName}`,
    time,
    emoji: '🏃',
    color: SOURCE_COLORS[SCHEDULE_SOURCES.EXERCISE],
    source: SCHEDULE_SOURCES.EXERCISE,
    notify: true,
    metadata: { type: 'exercise', exerciseName, duration },
  });
};

/**
 * Add social story to schedule
 */
export const addSocialStoryToSchedule = (story, time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: `Read: ${story.title || story.name || 'Social Story'}`,
    time,
    emoji: '📖',
    color: SOURCE_COLORS[SCHEDULE_SOURCES.SOCIAL_STORIES],
    source: SCHEDULE_SOURCES.SOCIAL_STORIES,
    notify: true,
    metadata: {
      storyId: story.id,
      storyTitle: story.title || story.name,
      category: story.category,
    },
  });
};

/**
 * Add meal to schedule
 */
export const addMealToSchedule = (mealType, recipeName = null, time = null, date = null) => {
  const mealDefaults = {
    breakfast: { time: '08:00', emoji: '🥣' },
    lunch: { time: '12:00', emoji: '🥗' },
    dinner: { time: '18:00', emoji: '🍽️' },
    snack: { time: '15:00', emoji: '🍎' },
  };
  
  const defaults = mealDefaults[mealType?.toLowerCase()] || mealDefaults.lunch;
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
    metadata: { type: 'meal', mealType, recipeName },
  });
};

/**
 * Add OT exercise to schedule
 */
export const addOTExerciseToSchedule = (exercise, time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: `OT: ${exercise.name || exercise}`,
    time,
    emoji: exercise.emoji || '🏋️',
    color: SOURCE_COLORS[SCHEDULE_SOURCES.OT_EXERCISE],
    source: SCHEDULE_SOURCES.OT_EXERCISE,
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
 * Add sensory break to schedule
 */
export const addSensoryBreakToSchedule = (breakActivity, time, date = null) => {
  const activityName = typeof breakActivity === 'string' 
    ? breakActivity 
    : breakActivity.name || 'Sensory Break';
  const activityEmoji = typeof breakActivity === 'object' 
    ? breakActivity.emoji || '🌈' 
    : '🌈';
    
  return addActivityToSchedule({
    date: date || getToday(),
    name: activityName,
    time,
    emoji: activityEmoji,
    color: SOURCE_COLORS[SCHEDULE_SOURCES.SENSORY_BREAK],
    source: SCHEDULE_SOURCES.SENSORY_BREAK,
    notify: true,
    metadata: { 
      type: 'sensory-break', 
      activity: activityName,
    },
  });
};

/**
 * Add water reminder to schedule
 */
export const addWaterReminderToSchedule = (time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: 'Drink Water',
    time,
    emoji: '💧',
    color: SOURCE_COLORS[SCHEDULE_SOURCES.WATER_TRACKER],
    source: SCHEDULE_SOURCES.WATER_TRACKER,
    notify: true,
    metadata: { type: 'water-reminder' },
  });
};

/**
 * Add appointment to schedule
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
    color: SOURCE_COLORS[SCHEDULE_SOURCES.APPOINTMENT],
    source: SCHEDULE_SOURCES.APPOINTMENT,
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
 * Add reminder to schedule
 */
export const addReminderToSchedule = (reminder) => {
  const categoryEmojis = {
    medication: '💊',
    therapy: '🗣️',
    exercise: '🏃',
    water: '💧',
    meal: '🍽️',
    sleep: '🌙',
    other: '🔔',
  };
  
  return addActivityToSchedule({
    date: reminder.date || getToday(),
    name: reminder.title || reminder.name || 'Reminder',
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
 * Add First-Then pair to schedule
 */
export const addFirstThenToSchedule = (firstTask, thenTask, time, date = null) => {
  const activities = [
    {
      date: date || getToday(),
      name: `First: ${firstTask.name || firstTask}`,
      time,
      emoji: '1️⃣',
      color: SOURCE_COLORS[SCHEDULE_SOURCES.FIRST_THEN],
      source: SCHEDULE_SOURCES.FIRST_THEN,
      notify: true,
      metadata: { type: 'first', task: firstTask.name || firstTask },
    },
  ];
  
  // Add "Then" task 15 minutes later
  const [hours, minutes] = time.split(':').map(Number);
  const thenMinutes = hours * 60 + minutes + 15;
  const thenTime = `${String(Math.floor(thenMinutes / 60)).padStart(2, '0')}:${String(thenMinutes % 60).padStart(2, '0')}`;
  
  activities.push({
    date: date || getToday(),
    name: `Then: ${thenTask.name || thenTask}`,
    time: thenTime,
    emoji: '2️⃣',
    color: SOURCE_COLORS[SCHEDULE_SOURCES.FIRST_THEN],
    source: SCHEDULE_SOURCES.FIRST_THEN,
    notify: true,
    metadata: { type: 'then', task: thenTask.name || thenTask },
  });
  
  return addMultipleActivities(activities);
};

/**
 * Add routine items to schedule
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
      date: targetDate,
      name: item.name || item,
      time,
      emoji: item.emoji || '✨',
      color: SOURCE_COLORS[SCHEDULE_SOURCES.DAILY_ROUTINE],
      source: SCHEDULE_SOURCES.DAILY_ROUTINE,
      notify: true,
      metadata: { routineItemId: item.id, period },
    };
  });
  
  return addMultipleActivities(activities);
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
 * Add sensory break to schedule (emotional wellness version)
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
  // Basic operations
  getAllSchedules,
  getScheduleForDate,
  saveAllSchedules,
  // Date helpers
  getToday,
  getTomorrow,
  addDays,
  formatDateDisplay,
  formatTimeDisplay,
  // Core activity functions
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
  // Emotional wellness
  addEmotionCheckin,
  addCopingBreak,
  addSensoryBreak,
  addDailyEmotionCheckins,
  addCopingRoutine,
  // Sleep
  addSleepReminders,
};
