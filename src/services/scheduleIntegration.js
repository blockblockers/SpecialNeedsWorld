// =============================================================================
// ⚠️  DEPRECATED - DO NOT USE THIS FILE FOR NEW DEVELOPMENT  ⚠️
// =============================================================================
// 
// This file has been DEPRECATED as of January 2025.
// 
// REASON: This service uses an inconsistent storage key format that causes
// activities to not appear in the Visual Schedule.
// 
// MIGRATION: All modules should import from '../services/scheduleHelper' instead.
// 
// OLD STORAGE: snw_schedule_${userId} (user-specific, different format)
// NEW STORAGE: snw_calendar_schedules (unified, date-keyed format)
// 
// AFFECTED MODULES TO UPDATE:
// - SocialStories.jsx → Change import to scheduleHelper
// - MoveExercise.jsx → Change import to scheduleHelper  
// - Nutrition.jsx → Change import to scheduleHelper
// 
// EXAMPLE MIGRATION:
// 
// BEFORE:
//   import { addExerciseToSchedule } from '../services/scheduleIntegration';
// 
// AFTER:
//   import { addExerciseToSchedule } from '../services/scheduleHelper';
// 
// The function signatures are identical, only the import path changes.
// 
// =============================================================================

// Re-export everything from scheduleHelper for backwards compatibility
// This allows existing code to work while we migrate
import {
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
} from './scheduleHelper';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  console.warn(
    '⚠️ DEPRECATION WARNING: scheduleIntegration.js is deprecated.\n' +
    'Please update your imports to use scheduleHelper.js instead.\n' +
    'See the file header for migration instructions.'
  );
}

// =============================================================================
// LEGACY EXPORTS - For backwards compatibility only
// =============================================================================

// Legacy constant name mapping
export const ACTIVITY_SOURCES = SCHEDULE_SOURCES;

// Legacy function - wraps addMultipleActivities
export const addMultipleActivitiesToSchedule = ({ date, activities, source, notify = true }) => {
  const formattedActivities = activities.map(activity => ({
    date,
    name: activity.name,
    time: activity.time,
    emoji: activity.emoji,
    color: activity.color || SOURCE_COLORS[source],
    source,
    notify: activity.notify !== undefined ? activity.notify : notify,
    metadata: activity.metadata || {},
  }));
  
  return addMultipleActivities(formattedActivities);
};

// Legacy function - wraps addOTExerciseToSchedule for sessions
export const addOTSessionToSchedule = (exercises, startTime, date = null) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  let currentMinutes = hours * 60 + minutes;
  
  const results = [];
  for (const exercise of exercises) {
    const time = `${String(Math.floor(currentMinutes / 60)).padStart(2, '0')}:${String(currentMinutes % 60).padStart(2, '0')}`;
    const result = addOTExerciseToSchedule(exercise, time, date);
    results.push(result);
    currentMinutes += Math.ceil((exercise.duration || 60) / 60) * 5;
  }
  
  return {
    success: results.every(r => r.success),
    count: results.filter(r => r.success).length,
  };
};

// Legacy function - schedule multiple water reminders
export const scheduleWaterReminders = (times, date = null) => {
  const results = times.map(time => addWaterReminderToSchedule(time, date));
  return {
    success: results.every(r => r.success),
    count: results.filter(r => r.success).length,
  };
};

// Legacy function - schedule regular sensory breaks
export const scheduleRegularBreaks = (breakActivity, startTime, endTime, intervalMinutes, date = null) => {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  
  let currentMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  
  const results = [];
  while (currentMinutes < endMinutes) {
    const time = `${String(Math.floor(currentMinutes / 60)).padStart(2, '0')}:${String(currentMinutes % 60).padStart(2, '0')}`;
    const result = addSensoryBreakToSchedule(breakActivity, time, date);
    results.push(result);
    currentMinutes += intervalMinutes;
  }
  
  return {
    success: results.every(r => r.success),
    count: results.filter(r => r.success).length,
  };
};

// Legacy function - add medicine reminder
export const addMedicineReminderToSchedule = (medicineName, time, date = null) => {
  return addActivityToSchedule({
    date: date || getToday(),
    name: `Medicine: ${medicineName}`,
    time,
    emoji: '💊',
    color: '#E63B2E',
    source: SCHEDULE_SOURCES.REMINDERS,
    notify: true,
    metadata: { type: 'medicine', medicineName },
  });
};

// Legacy modal helpers
export const createScheduleModalHandlers = (setShowModal, setScheduleDate, setScheduleTime) => {
  const today = getToday();
  
  return {
    openModal: () => {
      setScheduleDate(today);
      setScheduleTime('09:00');
      setShowModal(true);
    },
    closeModal: () => {
      setShowModal(false);
    },
    dateOptions: [
      { label: 'Today', value: today },
      { label: 'Tomorrow', value: getTomorrow() },
      { label: 'In 2 days', value: addDays(today, 2) },
      { label: 'In 3 days', value: addDays(today, 3) },
      { label: 'Next week', value: addDays(today, 7) },
    ],
  };
};

// =============================================================================
// RE-EXPORTS FROM scheduleHelper.js
// =============================================================================

export {
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

// Default export for backwards compatibility
export default {
  ACTIVITY_SOURCES: SCHEDULE_SOURCES,
  SCHEDULE_SOURCES,
  SOURCE_COLORS,
  addActivityToSchedule,
  addMultipleActivitiesToSchedule,
  removeActivitiesBySource,
  activityExists,
  getActivitiesBySource,
  createScheduleModalHandlers,
  formatTimeDisplay,
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
