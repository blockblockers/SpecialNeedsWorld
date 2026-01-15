// calendarSync.js - Syncs Visual Schedule with Supabase
// Provides offline-first storage with cloud sync

import { supabase, isSupabaseConfigured } from './supabase';
import { 
  formatDate, 
  parseDate, 
  getScheduleForDate as getLocalSchedule,
  saveScheduleToDate as saveLocalSchedule,
  getAllSchedules as getAllLocalSchedules,
  deleteScheduleForDate as deleteLocalSchedule
} from './calendar';

// ============================================
// SYNC STATUS TRACKING
// ============================================

const SYNC_STATUS_KEY = 'snw_calendar_sync_status';

export const getSyncStatus = () => {
  try {
    const data = localStorage.getItem(SYNC_STATUS_KEY);
    return data ? JSON.parse(data) : { lastSync: null, pendingChanges: [] };
  } catch {
    return { lastSync: null, pendingChanges: [] };
  }
};

const saveSyncStatus = (status) => {
  localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(status));
};

const addPendingChange = (dateStr, action) => {
  const status = getSyncStatus();
  // Remove existing entry for this date
  status.pendingChanges = status.pendingChanges.filter(c => c.dateStr !== dateStr);
  status.pendingChanges.push({ dateStr, action, timestamp: Date.now() });
  saveSyncStatus(status);
};

const removePendingChange = (dateStr) => {
  const status = getSyncStatus();
  status.pendingChanges = status.pendingChanges.filter(c => c.dateStr !== dateStr);
  saveSyncStatus(status);
};

// ============================================
// DATABASE OPERATIONS
// ============================================

/**
 * Save schedule to database
 */
export const saveScheduleToCloud = async (userId, dateStr, schedule) => {
  if (!isSupabaseConfigured() || !userId) return false;
  
  try {
    const { error } = await supabase
      .from('calendar_schedules')
      .upsert({
        user_id: userId,
        schedule_date: dateStr,
        name: schedule.name,
        activities: schedule.activities,
      }, {
        onConflict: 'user_id,schedule_date'
      });
    
    if (error) throw error;
    
    removePendingChange(dateStr);
    return true;
  } catch (error) {
    console.error('Error saving schedule to cloud:', error);
    addPendingChange(dateStr, 'save');
    return false;
  }
};

/**
 * Get schedule from database
 */
export const getScheduleFromCloud = async (userId, dateStr) => {
  if (!isSupabaseConfigured() || !userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('calendar_schedules')
      .select('*')
      .eq('user_id', userId)
      .eq('schedule_date', dateStr)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
  } catch (error) {
    console.error('Error getting schedule from cloud:', error);
    return null;
  }
};

/**
 * Get all schedules for a date range
 */
export const getSchedulesForRange = async (userId, startDate, endDate) => {
  if (!isSupabaseConfigured() || !userId) return [];
  
  try {
    const { data, error } = await supabase
      .from('calendar_schedules')
      .select('*')
      .eq('user_id', userId)
      .gte('schedule_date', startDate)
      .lte('schedule_date', endDate);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting schedules range:', error);
    return [];
  }
};

/**
 * Delete schedule from database
 */
export const deleteScheduleFromCloud = async (userId, dateStr) => {
  if (!isSupabaseConfigured() || !userId) return false;
  
  try {
    const { error } = await supabase
      .from('calendar_schedules')
      .delete()
      .eq('user_id', userId)
      .eq('schedule_date', dateStr);
    
    if (error) throw error;
    
    removePendingChange(dateStr);
    return true;
  } catch (error) {
    console.error('Error deleting schedule from cloud:', error);
    addPendingChange(dateStr, 'delete');
    return false;
  }
};

// ============================================
// UNIFIED API (Local + Cloud)
// ============================================

/**
 * Save schedule (local + cloud)
 */
export const saveSchedule = async (userId, dateStr, schedule) => {
  // Always save locally first
  saveLocalSchedule(dateStr, schedule);
  
  // Try to sync to cloud
  const cloudSaved = await saveScheduleToCloud(userId, dateStr, schedule);
  
  return { local: true, cloud: cloudSaved };
};

/**
 * Get schedule (prefer cloud, fallback to local)
 */
export const getSchedule = async (userId, dateStr) => {
  // Try cloud first if available
  if (isSupabaseConfigured() && userId) {
    const cloudSchedule = await getScheduleFromCloud(userId, dateStr);
    if (cloudSchedule) {
      // Update local cache
      saveLocalSchedule(dateStr, {
        name: cloudSchedule.name,
        activities: cloudSchedule.activities,
      });
      return {
        name: cloudSchedule.name,
        activities: cloudSchedule.activities,
        source: 'cloud'
      };
    }
  }
  
  // Fallback to local
  const localSchedule = getLocalSchedule(dateStr);
  return localSchedule ? { ...localSchedule, source: 'local' } : null;
};

/**
 * Delete schedule (local + cloud)
 */
export const deleteSchedule = async (userId, dateStr) => {
  deleteLocalSchedule(dateStr);
  await deleteScheduleFromCloud(userId, dateStr);
};

// ============================================
// SYNC OPERATIONS
// ============================================

/**
 * Sync all pending changes to cloud
 */
export const syncPendingChanges = async (userId) => {
  if (!isSupabaseConfigured() || !userId) return { synced: 0, failed: 0 };
  
  const status = getSyncStatus();
  let synced = 0;
  let failed = 0;
  
  for (const change of status.pendingChanges) {
    if (change.action === 'save') {
      const schedule = getLocalSchedule(change.dateStr);
      if (schedule) {
        const success = await saveScheduleToCloud(userId, change.dateStr, schedule);
        if (success) synced++;
        else failed++;
      }
    } else if (change.action === 'delete') {
      const success = await deleteScheduleFromCloud(userId, change.dateStr);
      if (success) synced++;
      else failed++;
    }
  }
  
  // Update last sync time
  const newStatus = getSyncStatus();
  newStatus.lastSync = Date.now();
  saveSyncStatus(newStatus);
  
  return { synced, failed };
};

/**
 * Pull all schedules from cloud to local
 */
export const pullAllFromCloud = async (userId) => {
  if (!isSupabaseConfigured() || !userId) return 0;
  
  try {
    const { data, error } = await supabase
      .from('calendar_schedules')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    let count = 0;
    for (const schedule of data || []) {
      saveLocalSchedule(schedule.schedule_date, {
        name: schedule.name,
        activities: schedule.activities,
      });
      count++;
    }
    
    const status = getSyncStatus();
    status.lastSync = Date.now();
    saveSyncStatus(status);
    
    return count;
  } catch (error) {
    console.error('Error pulling from cloud:', error);
    return 0;
  }
};

/**
 * Push all local schedules to cloud
 */
export const pushAllToCloud = async (userId) => {
  if (!isSupabaseConfigured() || !userId) return 0;
  
  const allLocal = getAllLocalSchedules();
  let count = 0;
  
  for (const [dateStr, schedule] of Object.entries(allLocal)) {
    const success = await saveScheduleToCloud(userId, dateStr, schedule);
    if (success) count++;
  }
  
  return count;
};

/**
 * Full bidirectional sync (merge cloud and local)
 */
export const fullSync = async (userId) => {
  if (!isSupabaseConfigured() || !userId) return { pulled: 0, pushed: 0 };
  
  // First push pending changes
  await syncPendingChanges(userId);
  
  // Get all cloud schedules
  const { data: cloudSchedules, error } = await supabase
    .from('calendar_schedules')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error during full sync:', error);
    return { pulled: 0, pushed: 0 };
  }
  
  const cloudByDate = {};
  for (const s of cloudSchedules || []) {
    cloudByDate[s.schedule_date] = s;
  }
  
  const allLocal = getAllLocalSchedules();
  let pulled = 0;
  let pushed = 0;
  
  // Pull cloud schedules that are newer or don't exist locally
  for (const schedule of cloudSchedules || []) {
    const local = allLocal[schedule.schedule_date];
    if (!local || new Date(schedule.updated_at) > new Date(local.updatedAt || 0)) {
      saveLocalSchedule(schedule.schedule_date, {
        name: schedule.name,
        activities: schedule.activities,
        updatedAt: schedule.updated_at,
      });
      pulled++;
    }
  }
  
  // Push local schedules that don't exist in cloud
  for (const [dateStr, schedule] of Object.entries(allLocal)) {
    if (!cloudByDate[dateStr]) {
      const success = await saveScheduleToCloud(userId, dateStr, schedule);
      if (success) pushed++;
    }
  }
  
  const status = getSyncStatus();
  status.lastSync = Date.now();
  status.pendingChanges = [];
  saveSyncStatus(status);
  
  return { pulled, pushed };
};

// ============================================
// SCHEDULE NOTIFICATIONS
// ============================================

/**
 * Schedule notifications for a day (server-side)
 */
export const scheduleNotificationsForDay = async (userId, dateStr) => {
  if (!isSupabaseConfigured() || !userId) return false;
  
  try {
    const { data, error } = await supabase
      .rpc('schedule_day_notifications', {
        p_user_id: userId,
        p_schedule_date: dateStr
      });
    
    if (error) throw error;
    return data || 0;
  } catch (error) {
    console.error('Error scheduling notifications:', error);
    return 0;
  }
};

/**
 * Mark activity complete (server-side)
 */
export const markActivityCompleteOnServer = async (userId, dateStr, activityIndex) => {
  if (!isSupabaseConfigured() || !userId) return false;
  
  try {
    const { error } = await supabase
      .rpc('mark_activity_complete', {
        p_user_id: userId,
        p_schedule_date: dateStr,
        p_activity_index: activityIndex
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking activity complete:', error);
    return false;
  }
};

export default {
  saveSchedule,
  getSchedule,
  deleteSchedule,
  syncPendingChanges,
  pullAllFromCloud,
  pushAllToCloud,
  fullSync,
  scheduleNotificationsForDay,
  markActivityCompleteOnServer,
  getSyncStatus,
};
