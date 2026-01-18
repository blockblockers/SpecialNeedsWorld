// scheduleHelper.js - Unified schedule integration service for ATLASassist
// FIXED: Self-contained with graceful fallbacks for missing dependencies
// FIXED: Won't break if calendar.js, notifications.js, etc. are missing

// ============================================
// SELF-CONTAINED DATE HELPERS
// (No external dependencies - these work standalone)
// ============================================

export const formatDate = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
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
// STORAGE KEY
// ============================================
const STORAGE_KEY = 'snw_calendar_schedules';

// ============================================
// SCHEDULE STORAGE FUNCTIONS
// ============================================

export const getScheduleForDate = (dateStr) => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const schedules = data ? JSON.parse(data) : {};
    return schedules[dateStr] || null;
  } catch (e) {
    console.error('Error loading schedule:', e);
    return null;
  }
};

export const getAllSchedules = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const saveScheduleToDate = (dateStr, schedule) => {
  try {
    const all = getAllSchedules();
    all[dateStr] = schedule;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return true;
  } catch (e) {
    console.error('Error saving schedule:', e);
    return false;
  }
};

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
};

// ============================================
// CORE: ADD ACTIVITY TO SCHEDULE
// FIXED: Completely self-contained, no external dependencies
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
    // Validate required fields
    if (!date) {
      return { success: false, error: 'Date is required' };
    }
    if (!name) {
      return { success: false, error: 'Name is required' };
    }

    // Parse date - handle both string and Date objects
    let dateStr;
    try {
      if (typeof date === 'string') {
        // If it's already in YYYY-MM-DD format, use it directly
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          dateStr = date;
        } else {
          const dateObj = new Date(date);
          dateStr = formatDate(dateObj);
        }
      } else {
        dateStr = formatDate(date);
      }
    } catch (dateError) {
      console.error('Date parsing error:', dateError);
      return { success: false, error: 'Invalid date format' };
    }
    
    // Get defaults from source
    const defaults = SOURCE_DEFAULTS[source] || { emoji: '⭐', color: '#4A9FD4' };
    
    // Create activity object
    const newActivity = {
      id: Date.now() + Math.random(),
      activityId: `${source}-${Date.now()}`,
      name,
      time: time || null,
      emoji: emoji || defaults.emoji,
      color: color || defaults.color,
      source,
      notify,
      metadata,
      customImage: customImage || null,
      createdAt: new Date().toISOString(),
    };
    
    // Get existing schedules from localStorage
    let schedules = {};
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        schedules = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading schedules:', e);
      schedules = {};
    }
    
    // Ensure schedule exists with proper structure
    let dateSchedule = schedules[dateStr];
    
    // If no schedule exists for this date, create one
    if (!dateSchedule) {
      dateSchedule = { items: [], activities: [] };
    }
    
    // Ensure items array exists
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
    } catch (storageError) {
      console.error('Error saving to localStorage:', storageError);
      return { success: false, error: 'Failed to save schedule' };
    }
    
    // Try notifications (optional - don't fail if not available)
    if (notify && time) {
      try {
        // Optional: Schedule notifications if the module is available
        // This is wrapped in try-catch so it doesn't break if notifications aren't set up
        if (typeof window !== 'undefined' && 'Notification' in window) {
          // Notification support exists but we don't require it
          console.log('Activity added with notification flag:', newActivity.name);
        }
      } catch (notifyError) {
        console.warn('Notifications not available:', notifyError);
        // Don't fail - notifications are optional
      }
    }
    
    console.log('Activity added successfully:', newActivity);
    
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
    if (!date || !activities || !Array.isArray(activities)) {
      return { success: false, error: 'Date and activities array are required' };
    }

    const dateStr = typeof date === 'string' ? date : formatDate(date);
    const defaults = SOURCE_DEFAULTS[source] || { emoji: '⭐', color: '#4A9FD4' };
    
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

// Alias for backward compatibility
export const addMultipleActivities = addMultipleActivitiesToSchedule;

// ============================================
// REMOVE ACTIVITIES BY SOURCE
// ============================================
export const removeActivitiesBySource = (date, source, metadataKey = null, metadataValue = null) => {
  try {
    const dateStr = typeof date === 'string' ? date : formatDate(date);
    
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
    
    const originalCount = (dateSchedule.items?.length || 0) + (dateSchedule.activities?.length || 0);
    
    if (dateSchedule.items) {
      dateSchedule.items = dateSchedule.items.filter(filterFn);
    }
    if (dateSchedule.activities) {
      dateSchedule.activities = dateSchedule.activities.filter(filterFn);
    }
    
    const newCount = (dateSchedule.items?.length || 0) + (dateSchedule.activities?.length || 0);
    
    schedules[dateStr] = dateSchedule;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
    
    return {
      success: true,
      removed: Math.floor((originalCount - newCount) / 2),
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ============================================
// CHECK IF ACTIVITY EXISTS
// ============================================
export const activityExists = (date, source, metadataKey, metadataValue) => {
  try {
    const dateStr = typeof date === 'string' ? date : formatDate(date);
    const schedule = getScheduleForDate(dateStr);
    if (!schedule?.activities && !schedule?.items) return false;
    
    const activities = schedule.activities || schedule.items || [];
    return activities.some(
      a => a.source === source && a.metadata?.[metadataKey] === metadataValue
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
    const dateStr = typeof date === 'string' ? date : formatDate(date);
    const schedule = getScheduleForDate(dateStr);
    if (!schedule) return [];
    
    const activities = schedule.activities || schedule.items || [];
    return activities.filter(a => a.source === source);
  } catch {
    return [];
  }
};

// ============================================
// MODAL HANDLERS HELPER
// ============================================
export const createScheduleModalHandlers = (setState) => ({
  openModal: (activity = null) => setState({ show: true, activity }),
  closeModal: () => setState({ show: false, activity: null }),
});

// ============================================
// SPECIFIC HELPERS
// ============================================

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

// Sensory Break helper
export const addSensoryBreakToSchedule = (breakActivity, time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: `Break: ${breakActivity.name}`,
    time,
    emoji: breakActivity.emoji || '🧘',
    color: '#20B2AA',
    source: SCHEDULE_SOURCES.SENSORY_BREAK,
    notify: true,
    metadata: {
      breakId: breakActivity.id,
      category: breakActivity.category,
      duration: breakActivity.duration,
    },
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

// OT Session helper (alias)
export const addOTSessionToSchedule = addOTExerciseToSchedule;

// Schedule regular breaks
export const scheduleRegularBreaks = (startTime, endTime, intervalMinutes = 60, breakActivity = null, date = null) => {
  const [startHours, startMins] = startTime.split(':').map(Number);
  const [endHours, endMins] = endTime.split(':').map(Number);
  
  let currentMinutes = startHours * 60 + startMins;
  const endMinutes = endHours * 60 + endMins;
  
  const breaks = [];
  while (currentMinutes <= endMinutes) {
    const time = `${String(Math.floor(currentMinutes / 60)).padStart(2, '0')}:${String(currentMinutes % 60).padStart(2, '0')}`;
    breaks.push({
      name: breakActivity?.name || 'Sensory Break',
      time,
      emoji: breakActivity?.emoji || '🧘',
    });
    currentMinutes += intervalMinutes;
  }
  
  return addMultipleActivitiesToSchedule({
    date: date || getToday(),
    activities: breaks,
    source: SCHEDULE_SOURCES.SENSORY_BREAK,
    notify: true,
  });
};

// Schedule water reminders
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
  addMultipleActivities,
  removeActivitiesBySource,
  activityExists,
  getActivitiesBySource,
  
  // Date/Calendar helpers
  formatDate,
  formatDisplayDate,
  formatDateDisplay,
  getToday,
  getTomorrow,
  addDays,
  getScheduleForDate,
  getAllSchedules,
  saveScheduleToDate,
  
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
};
