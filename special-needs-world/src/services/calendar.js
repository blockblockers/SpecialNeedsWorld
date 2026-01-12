// calendar.js - Calendar utilities for Visual Schedule
// Handles dates, times, recurring events, and notifications

// ============================================
// DATE UTILITIES
// ============================================

export const getToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const formatDate = (date) => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const parseDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatDisplayDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const formatShortDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatTime = (time24) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

export const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

export const isToday = (date) => isSameDay(date, getToday());

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addWeeks = (date, weeks) => addDays(date, weeks * 7);

export const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

// ============================================
// CALENDAR GRID UTILITIES
// ============================================

export const getMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
  
  const days = [];
  
  // Previous month padding
  const prevMonth = new Date(year, month, 0);
  const prevMonthDays = prevMonth.getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isCurrentMonth: false,
      isPast: true,
    });
  }
  
  // Current month
  const today = getToday();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({
      date,
      isCurrentMonth: true,
      isToday: isSameDay(date, today),
      isPast: date < today,
    });
  }
  
  // Next month padding (fill to 42 = 6 weeks)
  const remaining = 42 - days.length;
  for (let day = 1; day <= remaining; day++) {
    days.push({
      date: new Date(year, month + 1, day),
      isCurrentMonth: false,
      isPast: false,
    });
  }
  
  return days;
};

export const getWeekDays = (startDate) => {
  const days = [];
  const start = new Date(startDate);
  start.setDate(start.getDate() - start.getDay()); // Start from Sunday
  
  for (let i = 0; i < 7; i++) {
    const date = addDays(start, i);
    days.push({
      date,
      isToday: isToday(date),
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
    });
  }
  
  return days;
};

export const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// ============================================
// RECURRING SCHEDULE UTILITIES
// ============================================

export const RECURRENCE_TYPES = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKDAYS: 'weekdays',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
};

export const generateRecurringDates = (startDate, recurrence, endDate) => {
  const dates = [];
  let current = new Date(startDate);
  const end = endDate ? new Date(endDate) : addMonths(startDate, 3); // Default 3 months
  
  while (current <= end) {
    dates.push(new Date(current));
    
    switch (recurrence) {
      case RECURRENCE_TYPES.DAILY:
        current = addDays(current, 1);
        break;
      case RECURRENCE_TYPES.WEEKDAYS:
        current = addDays(current, 1);
        while (current.getDay() === 0 || current.getDay() === 6) {
          current = addDays(current, 1);
        }
        break;
      case RECURRENCE_TYPES.WEEKLY:
        current = addWeeks(current, 1);
        break;
      case RECURRENCE_TYPES.BIWEEKLY:
        current = addWeeks(current, 2);
        break;
      case RECURRENCE_TYPES.MONTHLY:
        current = addMonths(current, 1);
        break;
      default:
        return dates; // No recurrence
    }
  }
  
  return dates;
};

// ============================================
// LOCAL STORAGE FOR CALENDAR DATA
// ============================================

const STORAGE_KEY = 'snw_calendar_schedules';

export const saveScheduleToDate = (dateStr, schedule) => {
  const all = getAllSchedules();
  all[dateStr] = schedule;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
};

export const getScheduleForDate = (dateStr) => {
  const all = getAllSchedules();
  return all[dateStr] || null;
};

export const getAllSchedules = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const deleteScheduleForDate = (dateStr) => {
  const all = getAllSchedules();
  delete all[dateStr];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
};

export const cloneScheduleToDate = (sourceDateStr, targetDateStr) => {
  const source = getScheduleForDate(sourceDateStr);
  if (source) {
    saveScheduleToDate(targetDateStr, { ...source, id: Date.now() });
    return true;
  }
  return false;
};

export const cloneScheduleToMultipleDates = (sourceDateStr, targetDates) => {
  const source = getScheduleForDate(sourceDateStr);
  if (!source) return false;
  
  targetDates.forEach(dateStr => {
    saveScheduleToDate(dateStr, { 
      ...source, 
      id: Date.now() + Math.random(),
      activities: source.activities.map(a => ({ ...a, id: Date.now() + Math.random() }))
    });
  });
  return true;
};

// Get dates that have schedules
export const getDatesWithSchedules = (year, month) => {
  const all = getAllSchedules();
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  return Object.keys(all).filter(date => date.startsWith(prefix));
};

export default {
  getToday,
  formatDate,
  parseDate,
  formatDisplayDate,
  formatShortDate,
  formatTime,
  isSameDay,
  isToday,
  addDays,
  addWeeks,
  addMonths,
  getMonthDays,
  getWeekDays,
  getWeekNumber,
  RECURRENCE_TYPES,
  generateRecurringDates,
  saveScheduleToDate,
  getScheduleForDate,
  getAllSchedules,
  deleteScheduleForDate,
  cloneScheduleToDate,
  cloneScheduleToMultipleDates,
  getDatesWithSchedules,
};
