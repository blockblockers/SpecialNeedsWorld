// scheduleHelper.js - Unified schedule integration service for ATLASassist
// FIXED: Proper array initialization to prevent "Cannot read properties of undefined (reading 'push')"
// UPDATED: Added addCopingStrategyToSchedule function
// This file combines all schedule-related functionality in one place

import {
  formatDate,
  formatDisplayDate,
  getToday,
  addDays,
  saveScheduleToDate,
  getScheduleForDate,
} from './calendar';

// Re-export calendar functions for backward compatibility
// (Some components import these from scheduleHelper instead of calendar)
export { 
  formatDate, 
  formatDisplayDate, 
  getToday, 
  addDays,
  getScheduleForDate,
} from './calendar';

// Create getTomorrow helper
export const getTomorrow = () => addDays(getToday(), 1);

// Alias for formatDisplayDate (some components use this name)
export const formatDateDisplay = formatDisplayDate;

import {
  scheduleActivityNotifications,
  getNotificationSettings,
  getPermissionStatus,
} from './notifications';
import {
  saveSchedule as saveScheduleWithSync,
} from './calendarSync';
import { supabase, isSupabaseConfigured } from './supabase';
import {
  scheduleActivityNotificationsOnServer,
} from './pushSubscription';

// ============================================
// ACTIVITY/SCHEDULE SOURCES
// ============================================
export const SCHEDULE_SOURCES = {
  MANUAL: 'manual',
  APPOINTMENT: 'appointment',
  ROUTINE: 'routine',
  FIRST_THEN: 'first_then',
  REMINDER: 'reminder',
  OT_EXERCISE: 'ot_exercise',
  SENSORY_BREAK: 'sensory_break',
  WATER: 'water',
  MEDICINE: 'medicine',
  EXERCISE: 'exercise',
  SLEEP: 'sleep',
  SOCIAL_STORY: 'social_story',
  CHOICE_BOARD: 'choice_board',
  HEALTHY_CHOICES: 'healthy_choices',
  DAILY_ROUTINE: 'daily_routine',
  COPING_STRATEGY: 'coping_strategy', // NEW: Added for coping skills
};

// Alias for backward compatibility
export const ACTIVITY_SOURCES = SCHEDULE_SOURCES;

// ============================================
// SOURCE COLORS FOR UI
// ============================================
export const SOURCE_COLORS = {
  [SCHEDULE_SOURCES.MANUAL]: '#4A9FD4',
  [SCHEDULE_SOURCES.APPOINTMENT]: '#E63B2E',
  [SCHEDULE_SOURCES.ROUTINE]: '#5CB85C',
  [SCHEDULE_SOURCES.FIRST_THEN]: '#F5A623',
  [SCHEDULE_SOURCES.REMINDER]: '#8E6BBF',
  [SCHEDULE_SOURCES.OT_EXERCISE]: '#E86B9A',
  [SCHEDULE_SOURCES.SENSORY_BREAK]: '#20B2AA',
  [SCHEDULE_SOURCES.WATER]: '#4A9FD4',
  [SCHEDULE_SOURCES.MEDICINE]: '#FF6B6B',
  [SCHEDULE_SOURCES.EXERCISE]: '#5CB85C',
  [SCHEDULE_SOURCES.SLEEP]: '#6B5B95',
  [SCHEDULE_SOURCES.SOCIAL_STORY]: '#8E6BBF',
  [SCHEDULE_SOURCES.CHOICE_BOARD]: '#F5A623',
  [SCHEDULE_SOURCES.HEALTHY_CHOICES]: '#5CB85C',
  [SCHEDULE_SOURCES.DAILY_ROUTINE]: '#5CB85C',
  [SCHEDULE_SOURCES.COPING_STRATEGY]: '#5CB85C', // NEW
};

// Source defaults for emojis
export const SOURCE_DEFAULTS = {
  [SCHEDULE_SOURCES.MANUAL]: { emoji: '⭐', color: '#4A9FD4' },
  [SCHEDULE_SOURCES.APPOINTMENT]: { emoji: '📅', color: '#E63B2E' },
  [SCHEDULE_SOURCES.ROUTINE]: { emoji: '📋', color: '#5CB85C' },
  [SCHEDULE_SOURCES.FIRST_THEN]: { emoji: '1️⃣', color: '#F5A623' },
  [SCHEDULE_SOURCES.REMINDER]: { emoji: '🔔', color: '#8E6BBF' },
  [SCHEDULE_SOURCES.OT_EXERCISE]: { emoji: '🏋️', color: '#E86B9A' },
  [SCHEDULE_SOURCES.SENSORY_BREAK]: { emoji: '🧘', color: '#20B2AA' },
  [SCHEDULE_SOURCES.WATER]: { emoji: '💧', color: '#4A9FD4' },
  [SCHEDULE_SOURCES.MEDICINE]: { emoji: '💊', color: '#FF6B6B' },
  [SCHEDULE_SOURCES.EXERCISE]: { emoji: '🏃', color: '#5CB85C' },
  [SCHEDULE_SOURCES.SLEEP]: { emoji: '😴', color: '#6B5B95' },
  [SCHEDULE_SOURCES.SOCIAL_STORY]: { emoji: '📖', color: '#8E6BBF' },
  [SCHEDULE_SOURCES.CHOICE_BOARD]: { emoji: '⭐', color: '#F5A623' },
  [SCHEDULE_SOURCES.HEALTHY_CHOICES]: { emoji: '✅', color: '#5CB85C' },
  [SCHEDULE_SOURCES.DAILY_ROUTINE]: { emoji: '📋', color: '#5CB85C' },
  [SCHEDULE_SOURCES.COPING_STRATEGY]: { emoji: '🛠️', color: '#5CB85C' }, // NEW
};

// ============================================
// HELPER: Get current user ID
// ============================================
const getCurrentUserId = () => {
  try {
    if (isSupabaseConfigured() && supabase.auth) {
      const session = supabase.auth.session?.();
      return session?.user?.id || null;
    }
    return null;
  } catch {
    return null;
  }
};

// ============================================
// CORE: ADD ACTIVITY TO SCHEDULE
// FIXED: Proper array initialization
// ============================================
/**
 * Add a single activity to the schedule
 * @param {Object} options - Activity options
 * @returns {Object} { success: boolean, activity: Object, error?: string }
 */
export const addActivityToSchedule = ({
  date,
  name,
  time = null,
  emoji = null,
  color = null,
  source = SCHEDULE_SOURCES.MANUAL,
  notify = true,
  metadata = {},
  customImage = null,
}) => {
  try {
    // Parse date
    const dateObj = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
    const dateStr = formatDate(dateObj);
    
    // Get defaults for source
    const defaults = SOURCE_DEFAULTS[source] || { emoji: '⭐', color: '#4A9FD4' };
    
    // Create activity object
    const newActivity = {
      id: Date.now() + Math.random(),
      activityId: `${source}-${Date.now()}`,
      name,
      time,
      emoji: emoji || defaults.emoji,
      color: color || defaults.color,
      source,
      notify,
      metadata,
      customImage,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    // Get existing schedules
    const STORAGE_KEY = 'snw_calendar_schedules';
    let schedules = {};
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        schedules = JSON.parse(saved);
      }
    } catch (e) {
      schedules = {};
    }
    
    // Initialize schedule for date if needed - FIXED: Proper initialization
    let dateSchedule = schedules[dateStr];
    if (!dateSchedule) {
      dateSchedule = { 
        items: [], 
        activities: [],
        name: 'My Schedule'
      };
    }
    
    // Ensure items array exists - FIXED: Create new array if needed
    if (!Array.isArray(dateSchedule.items)) {
      dateSchedule.items = Array.isArray(dateSchedule.activities) 
        ? [...dateSchedule.activities] 
        : [];
    }
    
    // Ensure activities array exists
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
    
    // Save back to schedules
    schedules[dateStr] = dateSchedule;
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
    
    // Try cloud sync
    const userId = getCurrentUserId();
    if (userId && isSupabaseConfigured()) {
      saveScheduleWithSync(userId, dateStr, dateSchedule).catch(err => {
        console.warn('Cloud sync failed:', err);
      });
    }
    
    // Schedule notifications if enabled and time is set
    if (notify && time && newActivity.id) {
      try {
        const notificationSettings = getNotificationSettings();
        if (notificationSettings?.enabled && getPermissionStatus() === 'granted') {
          scheduleActivityNotifications([newActivity], dateStr);
          
          // Also schedule on server for reliability
          if (userId && isSupabaseConfigured()) {
            scheduleActivityNotificationsOnServer(newActivity, dateStr).catch(console.warn);
          }
        }
      } catch (notifyError) {
        console.warn('Failed to schedule notifications:', notifyError);
      }
    }
    
    return {
      success: true,
      activity: newActivity,
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
    const dateObj = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
    const dateStr = formatDate(dateObj);
    
    const defaults = SOURCE_DEFAULTS[source] || { emoji: '⭐', color: '#4A9FD4' };
    
    const STORAGE_KEY = 'snw_calendar_schedules';
    let schedules = {};
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        schedules = JSON.parse(saved);
      }
    } catch (e) {
      schedules = {};
    }
    
    // Ensure schedule structure
    let dateSchedule = schedules[dateStr];
    if (!dateSchedule) {
      dateSchedule = { items: [], activities: [] };
    }
    if (!Array.isArray(dateSchedule.items)) {
      dateSchedule.items = Array.isArray(dateSchedule.activities) ? [...dateSchedule.activities] : [];
    }
    if (!Array.isArray(dateSchedule.activities)) {
      dateSchedule.activities = Array.isArray(dateSchedule.items) ? [...dateSchedule.items] : [];
    }
    
    // Create and add new activities
    const newActivities = activities.map((activity, index) => ({
      id: Date.now() + index + Math.random(),
      activityId: `${source}-${Date.now()}-${index}`,
      name: activity.name,
      time: activity.time || null,
      emoji: activity.emoji || defaults.emoji,
      color: activity.color || defaults.color,
      source,
      notify: activity.notify !== undefined ? activity.notify : notify,
      metadata: activity.metadata || {},
      customImage: activity.customImage || null,
      createdAt: new Date().toISOString(),
    }));
    
    dateSchedule.items.push(...newActivities);
    dateSchedule.activities.push(...newActivities);
    
    // Sort by time
    const sortByTime = (a, b) => {
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    };
    
    dateSchedule.items.sort(sortByTime);
    dateSchedule.activities.sort(sortByTime);
    
    schedules[dateStr] = dateSchedule;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
    
    // Cloud sync
    const userId = getCurrentUserId();
    if (userId && isSupabaseConfigured()) {
      saveScheduleWithSync(userId, dateStr, dateSchedule).catch(console.warn);
    }
    
    return {
      success: true,
      activities: newActivities,
      count: newActivities.length,
    };
  } catch (error) {
    console.error('Failed to add multiple activities:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Alias for backward compatibility (some components use this shorter name)
export const addMultipleActivities = addMultipleActivitiesToSchedule;

// ============================================
// REMOVE ACTIVITIES BY SOURCE
// ============================================
export const removeActivitiesBySource = (date, source, metadataKey = null, metadataValue = null) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
    const dateStr = formatDate(dateObj);
    
    const STORAGE_KEY = 'snw_calendar_schedules';
    let schedules = {};
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        schedules = JSON.parse(saved);
      }
    } catch (e) {
      return { success: false, error: 'Failed to load schedules' };
    }
    
    const dateSchedule = schedules[dateStr];
    if (!dateSchedule) {
      return { success: true, removed: 0 };
    }
    
    const filterFn = (activity) => {
      if (activity.source !== source) return true;
      if (metadataKey && metadataValue) {
        return activity.metadata?.[metadataKey] !== metadataValue;
      }
      return false;
    };
    
    const originalCount = (dateSchedule.items || []).length;
    dateSchedule.items = (dateSchedule.items || []).filter(filterFn);
    dateSchedule.activities = (dateSchedule.activities || []).filter(filterFn);
    const removed = originalCount - dateSchedule.items.length;
    
    schedules[dateStr] = dateSchedule;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
    
    // Cloud sync
    const userId = getCurrentUserId();
    if (userId && isSupabaseConfigured()) {
      saveScheduleWithSync(userId, dateStr, dateSchedule).catch(console.warn);
    }
    
    return { success: true, removed };
  } catch (error) {
    console.error('Failed to remove activities:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// CHECK IF ACTIVITY EXISTS
// ============================================
export const activityExists = (date, source, metadataKey = null, metadataValue = null) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
    const dateStr = formatDate(dateObj);
    
    const schedule = getScheduleForDate(dateStr);
    const activities = schedule?.activities || schedule?.items || [];
    
    return activities.some(a => 
      a.source === source && 
      (!metadataKey || !metadataValue || a.metadata?.[metadataKey] === metadataValue)
    );
  } catch {
    return false;
  }
};

// ============================================
// GET ACTIVITIES BY SOURCE
// ============================================
export const getActivitiesBySource = (date, source) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
    const dateStr = formatDate(dateObj);
    
    const schedule = getScheduleForDate(dateStr);
    const activities = schedule?.activities || schedule?.items || [];
    
    return activities.filter(a => a.source === source);
  } catch {
    return [];
  }
};

// ============================================
// MODAL HELPERS
// ============================================
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
// SPECIFIC HELPERS
// ============================================

// Appointment helper
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
    : appointment.title || 'Appointment';
  
  return addActivityToSchedule({
    date: appointment.date || getToday(),
    name: displayName,
    time: appointment.time,
    emoji: typeEmojis[appointment.type] || '📅',
    color: '#E63B2E',
    source: SCHEDULE_SOURCES.APPOINTMENT,
    notify: true,
    metadata: {
      appointmentId: appointment.id,
      type: appointment.type,
      provider: appointment.providerName,
      location: appointment.location,
      notes: appointment.notes,
    },
  });
};

// Routine helper
export const addRoutineToSchedule = (routine) => {
  return addActivityToSchedule({
    date: routine.date || getToday(),
    name: routine.name,
    time: routine.time,
    emoji: routine.emoji || '📋',
    color: '#5CB85C',
    source: SCHEDULE_SOURCES.ROUTINE,
    notify: true,
    metadata: {
      routineId: routine.id,
      steps: routine.steps,
    },
  });
};

// First-Then helper
export const addFirstThenToSchedule = (firstTask, thenTask, time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: `First ${firstTask}, Then ${thenTask}`,
    time,
    emoji: '1️⃣',
    color: '#F5A623',
    source: SCHEDULE_SOURCES.FIRST_THEN,
    notify: true,
    metadata: { firstTask, thenTask },
  });
};

// Reminder helper
export const addReminderToSchedule = (reminder) => {
  const categoryEmojis = {
    medication: '💊',
    appointment: '📅',
    task: '✅',
    self_care: '🧘',
    meal: '🍽️',
    water: '💧',
    exercise: '🏃',
    other: '🔔',
  };
  
  return addActivityToSchedule({
    date: reminder.date || getToday(),
    name: reminder.title || reminder.name,
    time: reminder.time,
    emoji: categoryEmojis[reminder.category] || '🔔',
    color: '#8E6BBF',
    source: SCHEDULE_SOURCES.REMINDER,
    notify: true,
    metadata: {
      reminderId: reminder.id,
      category: reminder.category,
      repeat: reminder.repeat,
    },
  });
};

// OT Exercise helper
export const addOTExerciseToSchedule = (exercise, time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: `OT: ${exercise.name}`,
    time,
    emoji: exercise.emoji || '🏋️',
    color: '#E86B9A',
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

// OT Session helper (multiple exercises)
export const addOTSessionToSchedule = (exercises, startTime, date = null) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  let currentMinutes = hours * 60 + minutes;
  
  const activities = exercises.map((exercise) => {
    const time = `${String(Math.floor(currentMinutes / 60)).padStart(2, '0')}:${String(currentMinutes % 60).padStart(2, '0')}`;
    currentMinutes += Math.ceil((exercise.duration || 60) / 60) * 5;
    
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
    source: SCHEDULE_SOURCES.OT_EXERCISE,
    notify: true,
  });
};

// Sensory Break helper
export const addSensoryBreakToSchedule = (breakType, time, duration = 5, date = null) => {
  const breakEmojis = {
    movement: '🏃',
    calming: '🧘',
    fidget: '🎯',
    visual: '👀',
    auditory: '🎵',
    tactile: '✋',
    proprioceptive: '💪',
    vestibular: '🔄',
  };
  
  return addActivityToSchedule({
    date: date || getToday(),
    name: `Sensory Break: ${breakType}`,
    time,
    emoji: breakEmojis[breakType.toLowerCase()] || '🧘',
    color: '#20B2AA',
    source: SCHEDULE_SOURCES.SENSORY_BREAK,
    notify: true,
    metadata: { breakType, duration },
  });
};

// Schedule regular breaks
export const scheduleRegularBreaks = (startTime, endTime, intervalMinutes = 60, breakType = 'movement', date = null) => {
  const [startHours, startMins] = startTime.split(':').map(Number);
  const [endHours, endMins] = endTime.split(':').map(Number);
  
  let currentMinutes = startHours * 60 + startMins;
  const endMinutes = endHours * 60 + endMins;
  
  const breaks = [];
  while (currentMinutes < endMinutes) {
    const time = `${String(Math.floor(currentMinutes / 60)).padStart(2, '0')}:${String(currentMinutes % 60).padStart(2, '0')}`;
    breaks.push({ name: `Sensory Break: ${breakType}`, time });
    currentMinutes += intervalMinutes;
  }
  
  return addMultipleActivitiesToSchedule({
    date: date || getToday(),
    activities: breaks,
    source: SCHEDULE_SOURCES.SENSORY_BREAK,
    notify: true,
  });
};

// Water reminder helper
export const addWaterReminderToSchedule = (time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: 'Drink Water 💧',
    time,
    emoji: '💧',
    color: '#4A9FD4',
    source: SCHEDULE_SOURCES.WATER,
    notify: true,
    metadata: { type: 'water' },
  });
};

// Schedule water reminders throughout day
export const scheduleWaterReminders = (startTime = '08:00', endTime = '20:00', intervalMinutes = 120, date = null) => {
  const [startHours, startMins] = startTime.split(':').map(Number);
  const [endHours, endMins] = endTime.split(':').map(Number);
  
  let currentMinutes = startHours * 60 + startMins;
  const endMinutes = endHours * 60 + endMins;
  
  const reminders = [];
  while (currentMinutes <= endMinutes) {
    const time = `${String(Math.floor(currentMinutes / 60)).padStart(2, '0')}:${String(currentMinutes % 60).padStart(2, '0')}`;
    reminders.push({ name: 'Drink Water 💧', time, emoji: '💧' });
    currentMinutes += intervalMinutes;
  }
  
  return addMultipleActivitiesToSchedule({
    date: date || getToday(),
    activities: reminders,
    source: SCHEDULE_SOURCES.WATER,
    notify: true,
  });
};

// Medicine reminder helper
export const addMedicineReminderToSchedule = (medicineName, time, dosage = null, date = null) => {
  const name = dosage ? `${medicineName} (${dosage})` : medicineName;
  
  return addActivityToSchedule({
    date: date || getToday(),
    name: `Medicine: ${name}`,
    time,
    emoji: '💊',
    color: '#FF6B6B',
    source: SCHEDULE_SOURCES.MEDICINE,
    notify: true,
    metadata: { medicineName, dosage },
  });
};

// Exercise helper
export const addExerciseToSchedule = (exerciseName, time, duration = 30, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: `Exercise: ${exerciseName}`,
    time,
    emoji: '🏃',
    color: '#5CB85C',
    source: SCHEDULE_SOURCES.EXERCISE,
    notify: true,
    metadata: { type: 'exercise', exerciseName, duration },
  });
};

// Social Story helper
export const addSocialStoryToSchedule = (story, time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: `Read: ${story.title}`,
    time,
    emoji: '📖',
    color: '#8E6BBF',
    source: SCHEDULE_SOURCES.SOCIAL_STORY,
    notify: true,
    metadata: {
      storyId: story.id,
      storyTitle: story.title,
      category: story.category,
    },
  });
};

// Meal helper
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
    source: SCHEDULE_SOURCES.DAILY_ROUTINE,
    notify: true,
    metadata: { type: 'meal', mealType, recipeName },
  });
};

// Sleep reminder helpers
export const addBedtimeToSchedule = (time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: 'Bedtime 🌙',
    time,
    emoji: '🌙',
    color: '#6B5B95',
    source: SCHEDULE_SOURCES.SLEEP,
    notify: true,
    metadata: { type: 'bedtime' },
  });
};

export const addWaketimeToSchedule = (time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: 'Wake Up ☀️',
    time,
    emoji: '☀️',
    color: '#F5A623',
    source: SCHEDULE_SOURCES.SLEEP,
    notify: true,
    metadata: { type: 'waketime' },
  });
};

// Choice Board helper
export const addChoiceToSchedule = (choice, time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: choice.name || choice.label,
    time,
    emoji: choice.emoji || '⭐',
    color: '#F5A623',
    source: SCHEDULE_SOURCES.CHOICE_BOARD,
    notify: true,
    customImage: choice.image || null,
    metadata: {
      choiceId: choice.id,
      category: choice.category,
    },
  });
};

// Healthy Choice reminder helper
export const addHealthyChoiceReminderToSchedule = (choice, time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: choice.name,
    time,
    emoji: choice.emoji || '✅',
    color: '#5CB85C',
    source: SCHEDULE_SOURCES.HEALTHY_CHOICES,
    notify: true,
    metadata: {
      choiceId: choice.id,
      points: choice.points,
    },
  });
};

// ============================================
// NEW: Coping Strategy helper
// ============================================
export const addCopingStrategyToSchedule = (strategyName, time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: `Coping: ${strategyName}`,
    time,
    emoji: '🛠️',
    color: '#5CB85C',
    source: SCHEDULE_SOURCES.COPING_STRATEGY,
    notify: true,
    metadata: { 
      type: 'coping_strategy',
      strategyName,
    },
  });
};

// ============================================
// DEFAULT EXPORT
// ============================================
export default {
  // Constants
  SCHEDULE_SOURCES,
  ACTIVITY_SOURCES,
  SOURCE_COLORS,
  SOURCE_DEFAULTS,
  
  // Core functions
  addActivityToSchedule,
  addMultipleActivitiesToSchedule,
  addMultipleActivities, // Alias
  removeActivitiesBySource,
  activityExists,
  getActivitiesBySource,
  
  // Calendar re-exports
  formatDate,
  formatDisplayDate,
  formatDateDisplay, // Alias
  getToday,
  getTomorrow,
  addDays,
  getScheduleForDate,
  
  // Helpers
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
  addBedtimeToSchedule,
  addWaketimeToSchedule,
  addChoiceToSchedule,
  addHealthyChoiceReminderToSchedule,
  addCopingStrategyToSchedule, // NEW
};
