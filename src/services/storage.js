/**
 * Storage Service Abstraction Layer
 * 
 * This module provides a unified interface for data storage.
 * - Uses Supabase when configured (cloud sync)
 * - Falls back to IndexedDB for local storage (offline mode)
 * 
 * The app automatically uses the best available storage method.
 */

import { supabase, isSupabaseConfigured } from './supabase';

// ============================================
// Storage Mode Detection
// ============================================

export const STORAGE_MODE = {
  SUPABASE: 'supabase',
  INDEXEDDB: 'indexeddb',
};

export const getStorageMode = () => {
  return isSupabaseConfigured() ? STORAGE_MODE.SUPABASE : STORAGE_MODE.INDEXEDDB;
};

// ============================================
// IndexedDB Implementation (Offline/Fallback)
// ============================================

const DB_NAME = 'ATLASassistDB';
const DB_VERSION = 1;

// Store names
export const STORES = {
  CUSTOM_IMAGES: 'customImages',
  SCHEDULES: 'schedules',
  AAC_BOARDS: 'aacBoards',
  USER_PREFERENCES: 'userPreferences',
};

let dbInstance = null;

/**
 * Initialize the IndexedDB database
 */
const initDB = () => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Failed to open database:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Custom Images Store - for Visual Schedule custom images
      if (!db.objectStoreNames.contains(STORES.CUSTOM_IMAGES)) {
        const imageStore = db.createObjectStore(STORES.CUSTOM_IMAGES, { keyPath: 'id' });
        imageStore.createIndex('userId', 'userId', { unique: false });
        imageStore.createIndex('activityId', 'activityId', { unique: false });
        imageStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Schedules Store - for saving complete schedules
      if (!db.objectStoreNames.contains(STORES.SCHEDULES)) {
        const scheduleStore = db.createObjectStore(STORES.SCHEDULES, { keyPath: 'id' });
        scheduleStore.createIndex('userId', 'userId', { unique: false });
        scheduleStore.createIndex('name', 'name', { unique: false });
      }

      // AAC Boards Store - for Point to Talk custom boards
      if (!db.objectStoreNames.contains(STORES.AAC_BOARDS)) {
        const aacStore = db.createObjectStore(STORES.AAC_BOARDS, { keyPath: 'id' });
        aacStore.createIndex('userId', 'userId', { unique: false });
        aacStore.createIndex('category', 'category', { unique: false });
      }

      // User Preferences Store
      if (!db.objectStoreNames.contains(STORES.USER_PREFERENCES)) {
        db.createObjectStore(STORES.USER_PREFERENCES, { keyPath: 'userId' });
      }
    };
  });
};

/**
 * Generic CRUD operations for IndexedDB
 */
const indexedDBStorage = {
  /**
   * Save an item to a store
   * @param {string} storeName - The store to save to
   * @param {object} item - The item to save (must have 'id' field)
   * @returns {Promise<object>} The saved item
   */
  async save(storeName, item) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const itemWithTimestamp = {
        ...item,
        updatedAt: new Date().toISOString(),
        createdAt: item.createdAt || new Date().toISOString(),
      };
      
      const request = store.put(itemWithTimestamp);
      
      request.onsuccess = () => resolve(itemWithTimestamp);
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Get an item by ID
   * @param {string} storeName - The store to query
   * @param {string} id - The item ID
   * @returns {Promise<object|null>} The item or null
   */
  async get(storeName, id) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Get all items from a store
   * @param {string} storeName - The store to query
   * @returns {Promise<array>} Array of items
   */
  async getAll(storeName) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Get items by index
   * @param {string} storeName - The store to query
   * @param {string} indexName - The index to use
   * @param {any} value - The value to match
   * @returns {Promise<array>} Array of matching items
   */
  async getByIndex(storeName, indexName, value) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Delete an item by ID
   * @param {string} storeName - The store to delete from
   * @param {string} id - The item ID
   * @returns {Promise<void>}
   */
  async delete(storeName, id) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Delete all items matching an index value
   * @param {string} storeName - The store to delete from
   * @param {string} indexName - The index to use
   * @param {any} value - The value to match
   * @returns {Promise<number>} Number of deleted items
   */
  async deleteByIndex(storeName, indexName, value) {
    const items = await this.getByIndex(storeName, indexName, value);
    for (const item of items) {
      await this.delete(storeName, item.id);
    }
    return items.length;
  },

  /**
   * Clear all items from a store
   * @param {string} storeName - The store to clear
   * @returns {Promise<void>}
   */
  async clear(storeName) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
};

// ============================================
// Image-specific utilities
// ============================================

/**
 * Convert a File/Blob to base64 string
 * @param {File|Blob} file - The file to convert
 * @returns {Promise<string>} Base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Compress an image file
 * @param {File} file - The image file
 * @param {number} maxWidth - Maximum width (default 400)
 * @param {number} quality - JPEG quality 0-1 (default 0.8)
 * @returns {Promise<string>} Compressed base64 string
 */
export const compressImage = (file, maxWidth = 400, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// ============================================
// Supabase Implementation (Cloud)
// ============================================

const supabaseStorage = {
  /**
   * Map store names to Supabase table names
   */
  tableMap: {
    [STORES.CUSTOM_IMAGES]: 'custom_images',
    [STORES.SCHEDULES]: 'schedules',
    [STORES.AAC_BOARDS]: 'aac_boards',
    [STORES.USER_PREFERENCES]: 'user_preferences',
  },

  /**
   * Save an item to Supabase
   */
  async save(storeName, item) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const tableName = this.tableMap[storeName];
    const { id, userId, ...rest } = item;
    
    const { data, error } = await supabase
      .from(tableName)
      .upsert({
        id,
        user_id: userId,
        ...rest,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return { ...data, userId: data.user_id };
  },

  /**
   * Get an item by ID from Supabase
   */
  async get(storeName, id) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const tableName = this.tableMap[storeName];
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data ? { ...data, userId: data.user_id } : null;
  },

  /**
   * Get all items from a Supabase table
   */
  async getAll(storeName) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const tableName = this.tableMap[storeName];
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(item => ({ ...item, userId: item.user_id }));
  },

  /**
   * Get items by a field value from Supabase
   */
  async getByIndex(storeName, indexName, value) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const tableName = this.tableMap[storeName];
    // Map index names to Supabase column names
    const columnName = indexName === 'userId' ? 'user_id' : indexName;
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq(columnName, value)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(item => ({ ...item, userId: item.user_id }));
  },

  /**
   * Delete an item from Supabase
   */
  async delete(storeName, id) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const tableName = this.tableMap[storeName];
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  /**
   * Clear all items from a Supabase table (for current user)
   */
  async clear(storeName, userId) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const tableName = this.tableMap[storeName];
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
  },
};

// ============================================
// High-level API for specific features
// (Automatically uses Supabase or IndexedDB)
// ============================================

const getStorageBackend = () => {
  return isSupabaseConfigured() ? supabaseStorage : indexedDBStorage;
};

export const imageStorage = {
  /**
   * Save a custom image for an activity
   */
  async saveCustomImage(userId, activityId, imageData, name = '') {
    const storage = getStorageBackend();
    const id = `img_${userId}_${activityId}_${Date.now()}`;
    
    // If using Supabase, we could upload to Storage bucket instead of base64
    // For now, we store base64 in both to keep it simple
    return storage.save(STORES.CUSTOM_IMAGES, {
      id,
      userId,
      activityId,
      imageData, // base64 string (or image_url if using Supabase Storage)
      name,
    });
  },

  /**
   * Get all custom images for a user
   */
  async getUserImages(userId) {
    const storage = getStorageBackend();
    return storage.getByIndex(STORES.CUSTOM_IMAGES, 'userId', userId);
  },

  /**
   * Get custom image for a specific activity
   */
  async getActivityImage(userId, activityId) {
    const storage = getStorageBackend();
    const images = await storage.getByIndex(STORES.CUSTOM_IMAGES, 'activityId', activityId);
    return images.find(img => img.userId === userId) || null;
  },

  /**
   * Delete a custom image
   */
  async deleteImage(imageId) {
    const storage = getStorageBackend();
    return storage.delete(STORES.CUSTOM_IMAGES, imageId);
  },
};

export const scheduleStorage = {
  /**
   * Save a schedule
   */
  async saveSchedule(userId, scheduleData) {
    const storage = getStorageBackend();
    const id = scheduleData.id || `schedule_${userId}_${Date.now()}`;
    return storage.save(STORES.SCHEDULES, {
      ...scheduleData,
      id,
      userId,
    });
  },

  /**
   * Get all schedules for a user
   */
  async getUserSchedules(userId) {
    const storage = getStorageBackend();
    return storage.getByIndex(STORES.SCHEDULES, 'userId', userId);
  },

  /**
   * Delete a schedule
   */
  async deleteSchedule(scheduleId) {
    const storage = getStorageBackend();
    return storage.delete(STORES.SCHEDULES, scheduleId);
  },
};

export const aacStorage = {
  /**
   * Save a custom AAC board
   */
  async saveBoard(userId, boardData) {
    const storage = getStorageBackend();
    const id = boardData.id || `board_${userId}_${Date.now()}`;
    return storage.save(STORES.AAC_BOARDS, {
      ...boardData,
      id,
      userId,
    });
  },

  /**
   * Get all boards for a user
   */
  async getUserBoards(userId) {
    const storage = getStorageBackend();
    return storage.getByIndex(STORES.AAC_BOARDS, 'userId', userId);
  },

  /**
   * Get boards by category
   */
  async getBoardsByCategory(category) {
    const storage = getStorageBackend();
    return storage.getByIndex(STORES.AAC_BOARDS, 'category', category);
  },

  /**
   * Delete a board
   */
  async deleteBoard(boardId) {
    const storage = getStorageBackend();
    return storage.delete(STORES.AAC_BOARDS, boardId);
  },
};

// Export the base storage for direct access if needed
export const storage = {
  ...indexedDBStorage,
  // Override with unified methods that auto-select backend
  save: (storeName, item) => getStorageBackend().save(storeName, item),
  get: (storeName, id) => getStorageBackend().get(storeName, id),
  getAll: (storeName) => getStorageBackend().getAll(storeName),
  getByIndex: (storeName, indexName, value) => getStorageBackend().getByIndex(storeName, indexName, value),
  delete: (storeName, id) => getStorageBackend().delete(storeName, id),
};
