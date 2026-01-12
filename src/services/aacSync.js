// aacSync.js - Syncs Point to Talk customizations with Supabase
// Provides offline-first storage with cloud sync

import { supabase, isSupabaseConfigured } from './supabase';

// ============================================
// LOCAL STORAGE
// ============================================

const LOCAL_KEY = 'snw_aac_custom_buttons';
const SYNC_STATUS_KEY = 'snw_aac_sync_status';

const getLocalCustomizations = () => {
  try {
    const data = localStorage.getItem(LOCAL_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveLocalCustomizations = (customizations) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(customizations));
};

const getSyncStatus = () => {
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

const addPendingChange = (buttonId, action) => {
  const status = getSyncStatus();
  status.pendingChanges = status.pendingChanges.filter(c => c.buttonId !== buttonId);
  status.pendingChanges.push({ buttonId, action, timestamp: Date.now() });
  saveSyncStatus(status);
};

const removePendingChange = (buttonId) => {
  const status = getSyncStatus();
  status.pendingChanges = status.pendingChanges.filter(c => c.buttonId !== buttonId);
  saveSyncStatus(status);
};

// ============================================
// DATABASE OPERATIONS
// ============================================

/**
 * Save customization to database
 */
const saveToCloud = async (userId, buttonId, customization) => {
  if (!isSupabaseConfigured() || !userId) return false;
  
  try {
    const { error } = await supabase
      .from('aac_customizations')
      .upsert({
        user_id: userId,
        button_id: buttonId,
        custom_image: customization.customImage,
        custom_text: customization.customText,
      }, {
        onConflict: 'user_id,button_id'
      });
    
    if (error) throw error;
    
    removePendingChange(buttonId);
    return true;
  } catch (error) {
    console.error('Error saving AAC customization to cloud:', error);
    addPendingChange(buttonId, 'save');
    return false;
  }
};

/**
 * Delete customization from database
 */
const deleteFromCloud = async (userId, buttonId) => {
  if (!isSupabaseConfigured() || !userId) return false;
  
  try {
    const { error } = await supabase
      .from('aac_customizations')
      .delete()
      .eq('user_id', userId)
      .eq('button_id', buttonId);
    
    if (error) throw error;
    
    removePendingChange(buttonId);
    return true;
  } catch (error) {
    console.error('Error deleting AAC customization from cloud:', error);
    addPendingChange(buttonId, 'delete');
    return false;
  }
};

/**
 * Get all customizations from database
 */
const getAllFromCloud = async (userId) => {
  if (!isSupabaseConfigured() || !userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('aac_customizations')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Convert to object format
    const result = {};
    for (const item of data || []) {
      result[item.button_id] = {
        customImage: item.custom_image,
        customText: item.custom_text,
      };
    }
    return result;
  } catch (error) {
    console.error('Error getting AAC customizations from cloud:', error);
    return null;
  }
};

// ============================================
// UNIFIED API
// ============================================

/**
 * Get all customizations (prefer cloud, fallback to local)
 */
export const getCustomizations = async (userId) => {
  // Try cloud first
  if (isSupabaseConfigured() && userId) {
    const cloudData = await getAllFromCloud(userId);
    if (cloudData) {
      // Update local cache
      saveLocalCustomizations(cloudData);
      return { data: cloudData, source: 'cloud' };
    }
  }
  
  // Fallback to local
  return { data: getLocalCustomizations(), source: 'local' };
};

/**
 * Save a customization (local + cloud)
 */
export const saveCustomization = async (userId, buttonId, customization) => {
  // Save locally first
  const all = getLocalCustomizations();
  all[buttonId] = customization;
  saveLocalCustomizations(all);
  
  // Try to sync to cloud
  const cloudSaved = await saveToCloud(userId, buttonId, customization);
  
  return { local: true, cloud: cloudSaved };
};

/**
 * Remove a customization (local + cloud)
 */
export const removeCustomization = async (userId, buttonId) => {
  // Remove locally
  const all = getLocalCustomizations();
  delete all[buttonId];
  saveLocalCustomizations(all);
  
  // Remove from cloud
  const cloudDeleted = await deleteFromCloud(userId, buttonId);
  
  return { local: true, cloud: cloudDeleted };
};

/**
 * Sync pending changes to cloud
 */
export const syncPendingChanges = async (userId) => {
  if (!isSupabaseConfigured() || !userId) return { synced: 0, failed: 0 };
  
  const status = getSyncStatus();
  const all = getLocalCustomizations();
  let synced = 0;
  let failed = 0;
  
  for (const change of status.pendingChanges) {
    if (change.action === 'save') {
      const customization = all[change.buttonId];
      if (customization) {
        const success = await saveToCloud(userId, change.buttonId, customization);
        if (success) synced++;
        else failed++;
      }
    } else if (change.action === 'delete') {
      const success = await deleteFromCloud(userId, change.buttonId);
      if (success) synced++;
      else failed++;
    }
  }
  
  const newStatus = getSyncStatus();
  newStatus.lastSync = Date.now();
  saveSyncStatus(newStatus);
  
  return { synced, failed };
};

/**
 * Pull all from cloud to local
 */
export const pullFromCloud = async (userId) => {
  if (!isSupabaseConfigured() || !userId) return 0;
  
  const cloudData = await getAllFromCloud(userId);
  if (cloudData) {
    saveLocalCustomizations(cloudData);
    
    const status = getSyncStatus();
    status.lastSync = Date.now();
    saveSyncStatus(status);
    
    return Object.keys(cloudData).length;
  }
  return 0;
};

/**
 * Push all local to cloud
 */
export const pushToCloud = async (userId) => {
  if (!isSupabaseConfigured() || !userId) return 0;
  
  const all = getLocalCustomizations();
  let count = 0;
  
  for (const [buttonId, customization] of Object.entries(all)) {
    const success = await saveToCloud(userId, buttonId, customization);
    if (success) count++;
  }
  
  return count;
};

/**
 * Full bidirectional sync
 */
export const fullSync = async (userId) => {
  if (!isSupabaseConfigured() || !userId) return { pulled: 0, pushed: 0 };
  
  // First sync pending changes
  await syncPendingChanges(userId);
  
  // Get cloud data
  const cloudData = await getAllFromCloud(userId);
  if (!cloudData) return { pulled: 0, pushed: 0 };
  
  const localData = getLocalCustomizations();
  let pulled = 0;
  let pushed = 0;
  
  // Merge: cloud wins for existing, push local-only
  const merged = { ...localData };
  
  for (const [buttonId, customization] of Object.entries(cloudData)) {
    merged[buttonId] = customization;
    if (!localData[buttonId]) pulled++;
  }
  
  // Push local-only items to cloud
  for (const [buttonId, customization] of Object.entries(localData)) {
    if (!cloudData[buttonId]) {
      const success = await saveToCloud(userId, buttonId, customization);
      if (success) pushed++;
    }
  }
  
  saveLocalCustomizations(merged);
  
  const status = getSyncStatus();
  status.lastSync = Date.now();
  status.pendingChanges = [];
  saveSyncStatus(status);
  
  return { pulled, pushed };
};

export default {
  getCustomizations,
  saveCustomization,
  removeCustomization,
  syncPendingChanges,
  pullFromCloud,
  pushToCloud,
  fullSync,
  getSyncStatus,
};
