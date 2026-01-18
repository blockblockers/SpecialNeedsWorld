// scheduleIntegration.js - DEPRECATED - Re-exports from scheduleHelper.js
// This file exists for backward compatibility only.
// All functionality has been moved to scheduleHelper.js
// Please import from scheduleHelper.js directly in new code.

// Re-export everything from scheduleHelper for backward compatibility
export {
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
  
  // Calendar re-exports (for components that import from here)
  formatDate,
  formatDisplayDate,
  formatDateDisplay,
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
  addCopingStrategyToSchedule,
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
  addCopingStrategyToSchedule, // NEW: Added for CopingSkillsChart
} from './scheduleHelper';

// Default export for backward compatibility
export { default } from './scheduleHelper';
