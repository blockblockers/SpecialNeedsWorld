// dataBackup.js - Data backup and restore service for ATLASassist
// Helps users backup their data to prevent loss from cache clearing

// All localStorage keys used by ATLASassist
const STORAGE_KEYS = [
  // Visual Schedule
  'snw_visual_schedules',
  'snw_schedule_sync_status',
  
  // Daily Routines
  'snw_daily_routines',
  'snw_routines_history',
  
  // First-Then
  'snw_first_then',
  'snw_first_then_presets',
  
  // Choice Board
  'snw_choice_boards',
  'snw_choice_history',
  
  // Feelings & Emotions
  'snw_feelings',            // Feelings tracker entries
  'snw_feelings_photos',     // Custom photos for emotions (base64)
  'snw_feelings_tracker',    // Legacy key
  'snw_emotion_logs',
  'snw_coping_used',
  
  // Health Tracking
  'snw_water_tracker',
  'snw_sleep_tracker',
  'snw_healthy_choices',
  'snw_body_check_ins',
  
  // Appointments & Goals
  'snw_appointments',
  'snw_goals',
  'snw_team_members',
  'snw_quick_notes',
  'snw_reminders',
  
  // File of Life
  'snw_file_of_life',
  
  // Settings & Preferences
  'snw_settings',
  'snw_notification_settings',
  'snw_counter_data',
  'snw_circles_of_control',
  
  // Social Stories
  'snw_generated_stories',
  
  // Guest user
  'snw_guest_user',
];

/**
 * Export all ATLASassist data to a JSON file
 * @returns {Object} All data that was exported
 */
export const exportAllData = () => {
  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    appName: 'ATLASassist',
    data: {}
  };
  
  let hasData = false;
  
  STORAGE_KEYS.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        exportData.data[key] = JSON.parse(value);
        hasData = true;
      }
    } catch (e) {
      // If it's not valid JSON, store as string
      const value = localStorage.getItem(key);
      if (value) {
        exportData.data[key] = value;
        hasData = true;
      }
    }
  });
  
  // Also check for user-specific keys (e.g., snw_choice_boards_userId)
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('snw_') && !STORAGE_KEYS.includes(key)) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          exportData.data[key] = JSON.parse(value);
          hasData = true;
        }
      } catch (e) {
        const value = localStorage.getItem(key);
        if (value) {
          exportData.data[key] = value;
          hasData = true;
        }
      }
    }
  }
  
  return { data: exportData, hasData };
};

/**
 * Download data as a JSON file
 */
export const downloadBackup = () => {
  const { data, hasData } = exportAllData();
  
  if (!hasData) {
    return { success: false, error: 'No data to backup' };
  }
  
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlasassist-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return { success: true, keysExported: Object.keys(data.data).length };
  } catch (error) {
    console.error('Error downloading backup:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Import data from a backup file
 * @param {File} file - The backup JSON file
 * @returns {Promise<Object>} Result of the import
 */
export const importBackup = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        
        // Validate the backup file
        if (!importData.appName || importData.appName !== 'ATLASassist') {
          reject(new Error('Invalid backup file: Not an ATLASassist backup'));
          return;
        }
        
        if (!importData.data || typeof importData.data !== 'object') {
          reject(new Error('Invalid backup file: No data found'));
          return;
        }
        
        let keysImported = 0;
        let errors = [];
        
        Object.entries(importData.data).forEach(([key, value]) => {
          try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            localStorage.setItem(key, stringValue);
            keysImported++;
          } catch (err) {
            errors.push(`Failed to import ${key}: ${err.message}`);
          }
        });
        
        resolve({
          success: true,
          keysImported,
          errors: errors.length > 0 ? errors : null,
          backupDate: importData.exportDate
        });
      } catch (error) {
        reject(new Error('Invalid backup file: Could not parse JSON'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Get a summary of stored data
 * @returns {Object} Summary of what's in localStorage
 */
export const getDataSummary = () => {
  const summary = {
    totalKeys: 0,
    totalSize: 0,
    categories: {
      schedule: [],
      routines: [],
      feelings: [],
      health: [],
      tracking: [],
      settings: [],
      other: []
    }
  };
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('snw_')) {
      summary.totalKeys++;
      const value = localStorage.getItem(key);
      summary.totalSize += value ? value.length : 0;
      
      // Categorize
      if (key.includes('schedule')) {
        summary.categories.schedule.push(key);
      } else if (key.includes('routine')) {
        summary.categories.routines.push(key);
      } else if (key.includes('feeling') || key.includes('emotion') || key.includes('coping')) {
        summary.categories.feelings.push(key);
      } else if (key.includes('water') || key.includes('sleep') || key.includes('health') || key.includes('body')) {
        summary.categories.health.push(key);
      } else if (key.includes('appointment') || key.includes('goal') || key.includes('reminder')) {
        summary.categories.tracking.push(key);
      } else if (key.includes('setting') || key.includes('notification')) {
        summary.categories.settings.push(key);
      } else {
        summary.categories.other.push(key);
      }
    }
  }
  
  // Convert size to human-readable
  summary.totalSizeFormatted = summary.totalSize > 1024 
    ? `${(summary.totalSize / 1024).toFixed(1)} KB`
    : `${summary.totalSize} bytes`;
  
  return summary;
};

/**
 * Clear all ATLASassist data (with confirmation)
 * @param {boolean} confirm - Must be true to actually clear
 * @returns {Object} Result
 */
export const clearAllData = (confirm = false) => {
  if (!confirm) {
    return { success: false, error: 'Must pass confirm=true to clear data' };
  }
  
  let keysCleared = 0;
  
  // Get all keys first (can't modify while iterating)
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('snw_')) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    keysCleared++;
  });
  
  return { success: true, keysCleared };
};

export default {
  exportAllData,
  downloadBackup,
  importBackup,
  getDataSummary,
  clearAllData,
  STORAGE_KEYS
};
