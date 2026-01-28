// pronunciation.js - Pronunciation Practice service with AI generation
// FIXED: Added DEFAULT_CATEGORIES export that was missing
// FIXED: Proper session validation and token refresh before Edge Function calls

import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'snw_pronunciation_words';
const CUSTOM_WORDS_KEY = 'snw_custom_pronunciation_words';

// ============================================
// DEFAULT CATEGORIES - EXPORTED FOR USE IN COMPONENTS
// ============================================

export const DEFAULT_CATEGORIES = [
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🐶',
    color: '#F5A623',
    words: [
      { word: 'dog', arasaacId: 4624 },
      { word: 'cat', arasaacId: 4622 },
      { word: 'bird', arasaacId: 4608 },
      { word: 'fish', arasaacId: 4638 },
      { word: 'horse', arasaacId: 4650 },
      { word: 'cow', arasaacId: 4620 },
      { word: 'pig', arasaacId: 4671 },
      { word: 'sheep', arasaacId: 4679 },
      { word: 'duck', arasaacId: 4628 },
      { word: 'rabbit', arasaacId: 4675 },
    ],
  },
  {
    id: 'food',
    name: 'Food',
    emoji: '🍎',
    color: '#E63B2E',
    words: [
      { word: 'apple', arasaacId: 2309 },
      { word: 'banana', arasaacId: 2314 },
      { word: 'bread', arasaacId: 2332 },
      { word: 'milk', arasaacId: 2403 },
      { word: 'water', arasaacId: 2496 },
      { word: 'juice', arasaacId: 2384 },
      { word: 'cookie', arasaacId: 2348 },
      { word: 'pizza', arasaacId: 2430 },
      { word: 'cheese', arasaacId: 2341 },
      { word: 'egg', arasaacId: 2358 },
    ],
  },
  {
    id: 'body',
    name: 'Body Parts',
    emoji: '👋',
    color: '#E86B9A',
    words: [
      { word: 'hand', arasaacId: 2536 },
      { word: 'foot', arasaacId: 2526 },
      { word: 'head', arasaacId: 2540 },
      { word: 'eye', arasaacId: 2520 },
      { word: 'ear', arasaacId: 2516 },
      { word: 'nose', arasaacId: 2562 },
      { word: 'mouth', arasaacId: 2558 },
      { word: 'arm', arasaacId: 2502 },
      { word: 'leg', arasaacId: 2550 },
      { word: 'finger', arasaacId: 2524 },
    ],
  },
  {
    id: 'colors',
    name: 'Colors',
    emoji: '🎨',
    color: '#8E6BBF',
    words: [
      { word: 'red', arasaacId: 5460 },
      { word: 'blue', arasaacId: 5438 },
      { word: 'green', arasaacId: 5448 },
      { word: 'yellow', arasaacId: 5478 },
      { word: 'orange', arasaacId: 5456 },
      { word: 'purple', arasaacId: 5458 },
      { word: 'pink', arasaacId: 5457 },
      { word: 'black', arasaacId: 5436 },
      { word: 'white', arasaacId: 5476 },
      { word: 'brown', arasaacId: 5440 },
    ],
  },
  {
    id: 'family',
    name: 'Family',
    emoji: '👨‍👩‍👧',
    color: '#4A9FD4',
    words: [
      { word: 'mom', arasaacId: 6786 },
      { word: 'dad', arasaacId: 6778 },
      { word: 'sister', arasaacId: 6804 },
      { word: 'brother', arasaacId: 6770 },
      { word: 'grandma', arasaacId: 6782 },
      { word: 'grandpa', arasaacId: 6784 },
      { word: 'baby', arasaacId: 6766 },
      { word: 'family', arasaacId: 6780 },
      { word: 'friend', arasaacId: 31891 },
      { word: 'teacher', arasaacId: 3206 },
    ],
  },
  {
    id: 'actions',
    name: 'Actions',
    emoji: '🏃',
    color: '#5CB85C',
    words: [
      { word: 'run', arasaacId: 6142 },
      { word: 'jump', arasaacId: 6108 },
      { word: 'walk', arasaacId: 6186 },
      { word: 'sit', arasaacId: 6156 },
      { word: 'stand', arasaacId: 6166 },
      { word: 'eat', arasaacId: 6068 },
      { word: 'drink', arasaacId: 6060 },
      { word: 'sleep', arasaacId: 6158 },
      { word: 'play', arasaacId: 6130 },
      { word: 'read', arasaacId: 6138 },
    ],
  },
  {
    id: 'objects',
    name: 'Objects',
    emoji: '📦',
    color: '#0891B2',
    words: [
      { word: 'ball', arasaacId: 3468 },
      { word: 'book', arasaacId: 3476 },
      { word: 'chair', arasaacId: 3490 },
      { word: 'table', arasaacId: 3610 },
      { word: 'door', arasaacId: 3510 },
      { word: 'window', arasaacId: 3638 },
      { word: 'bed', arasaacId: 3470 },
      { word: 'car', arasaacId: 3486 },
      { word: 'phone', arasaacId: 3572 },
      { word: 'cup', arasaacId: 3500 },
    ],
  },
  {
    id: 'weather',
    name: 'Weather',
    emoji: '☀️',
    color: '#F5A623',
    words: [
      { word: 'sun', arasaacId: 7632 },
      { word: 'rain', arasaacId: 7618 },
      { word: 'cloud', arasaacId: 7596 },
      { word: 'snow', arasaacId: 7628 },
      { word: 'wind', arasaacId: 7642 },
      { word: 'hot', arasaacId: 7606 },
      { word: 'cold', arasaacId: 7598 },
      { word: 'storm', arasaacId: 7630 },
      { word: 'rainbow', arasaacId: 7620 },
      { word: 'sky', arasaacId: 7626 },
    ],
  },
];

// ============================================
// SESSION VALIDATION HELPER
// ============================================

/**
 * Get a valid session, refreshing if needed
 * This fixes 401 errors by ensuring the token is fresh
 */
const getValidSession = async () => {
  if (!isSupabaseConfigured()) {
    return { session: null, error: 'Supabase not configured' };
  }

  try {
    // First, get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return { session: null, error: sessionError.message };
    }

    if (!session) {
      return { session: null, error: 'No active session. Please sign in.' };
    }

    // Check if token is about to expire (within 60 seconds)
    const expiresAt = session.expires_at;
    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = expiresAt - now;

    if (timeUntilExpiry < 60) {
      console.log('Token expiring soon, refreshing...');
      const { data: { session: newSession }, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('Token refresh error:', refreshError);
        return { session: null, error: 'Session expired. Please sign in again.' };
      }
      
      return { session: newSession, error: null };
    }

    return { session, error: null };
  } catch (error) {
    console.error('getValidSession error:', error);
    return { session: null, error: error.message };
  }
};

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

const getLocalProgress = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Error reading local progress:', error);
    return {};
  }
};

const saveLocalProgress = (progress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving local progress:', error);
  }
};

const getCustomWords = () => {
  try {
    const saved = localStorage.getItem(CUSTOM_WORDS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error reading custom words:', error);
    return [];
  }
};

const saveCustomWords = (words) => {
  try {
    localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(words));
  } catch (error) {
    console.error('Error saving custom words:', error);
  }
};

// ============================================
// CATEGORY OPERATIONS
// ============================================

/**
 * Get all categories including custom ones
 */
export const getCategories = () => {
  return [...DEFAULT_CATEGORIES];
};

/**
 * Get words for a specific category
 */
export const getCategoryWords = (categoryId) => {
  const category = DEFAULT_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return [];
  
  const customWords = getCustomWords().filter(w => w.categoryId === categoryId);
  return [...category.words, ...customWords];
};

/**
 * Add a custom word to a category
 */
export const addCustomWord = (categoryId, word) => {
  const customWords = getCustomWords();
  const newWord = {
    id: `custom_${Date.now()}`,
    word: word.word,
    categoryId,
    arasaacId: word.arasaacId || null,
    imageUrl: word.imageUrl || null,
    createdAt: new Date().toISOString(),
  };
  saveCustomWords([...customWords, newWord]);
  return newWord;
};

/**
 * Remove a custom word
 */
export const removeCustomWord = (wordId) => {
  const customWords = getCustomWords();
  saveCustomWords(customWords.filter(w => w.id !== wordId));
};

// ============================================
// PROGRESS TRACKING
// ============================================

/**
 * Record a practice attempt
 */
export const recordAttempt = (word, correct, categoryId) => {
  const progress = getLocalProgress();
  const key = `${categoryId}_${word}`;
  
  if (!progress[key]) {
    progress[key] = {
      word,
      categoryId,
      attempts: 0,
      correct: 0,
      lastPracticed: null,
    };
  }
  
  progress[key].attempts += 1;
  if (correct) {
    progress[key].correct += 1;
  }
  progress[key].lastPracticed = new Date().toISOString();
  
  saveLocalProgress(progress);
  return progress[key];
};

/**
 * Get progress for a word
 */
export const getWordProgress = (word, categoryId) => {
  const progress = getLocalProgress();
  const key = `${categoryId}_${word}`;
  return progress[key] || null;
};

/**
 * Get overall progress for a category
 */
export const getCategoryProgress = (categoryId) => {
  const progress = getLocalProgress();
  const categoryWords = getCategoryWords(categoryId);
  
  let totalAttempts = 0;
  let totalCorrect = 0;
  let wordsPracticed = 0;
  
  categoryWords.forEach(w => {
    const key = `${categoryId}_${w.word}`;
    if (progress[key]) {
      totalAttempts += progress[key].attempts;
      totalCorrect += progress[key].correct;
      wordsPracticed += 1;
    }
  });
  
  return {
    totalAttempts,
    totalCorrect,
    wordsPracticed,
    totalWords: categoryWords.length,
    accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
  };
};

// ============================================
// AI WORD GENERATION
// ============================================

/**
 * Request more words for a category using AI
 * FIXED: Proper session validation before Edge Function call
 */
export const requestMoreWords = async (categoryId, existingWords = []) => {
  // Validate session first
  const { session, error: sessionError } = await getValidSession();
  
  if (sessionError || !session) {
    return { 
      data: null, 
      error: sessionError || 'Please sign in to generate more words. AI features require authentication.' 
    };
  }

  const category = DEFAULT_CATEGORIES.find(c => c.id === categoryId);
  if (!category) {
    return { data: null, error: 'Category not found' };
  }

  try {
    const { data, error } = await supabase.functions.invoke('generate-pronunciation-words', {
      body: {
        category: category.name,
        existingWords: existingWords.map(w => w.word),
        count: 5,
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      return { 
        data: null, 
        error: error.message || 'Failed to generate words. Please try again.' 
      };
    }

    // Save the new words as custom words
    if (data?.words) {
      data.words.forEach(word => {
        addCustomWord(categoryId, word);
      });
    }

    return { data, error: null };
  } catch (error) {
    console.error('requestMoreWords error:', error);
    return { 
      data: null, 
      error: error.message || 'Failed to generate words. Please check your connection.' 
    };
  }
};

// ============================================
// CATEGORY USE TRACKING
// ============================================

const CATEGORY_USE_KEY = 'snw_category_use_count';

/**
 * Increment category use count
 */
export const incrementCategoryUseCount = (categoryId) => {
  try {
    const counts = JSON.parse(localStorage.getItem(CATEGORY_USE_KEY) || '{}');
    counts[categoryId] = (counts[categoryId] || 0) + 1;
    localStorage.setItem(CATEGORY_USE_KEY, JSON.stringify(counts));
    return counts[categoryId];
  } catch (error) {
    console.error('Error incrementing category use count:', error);
    return 0;
  }
};

/**
 * Get category use count
 */
export const getCategoryUseCount = (categoryId) => {
  try {
    const counts = JSON.parse(localStorage.getItem(CATEGORY_USE_KEY) || '{}');
    return counts[categoryId] || 0;
  } catch (error) {
    return 0;
  }
};

/**
 * Get most used categories
 */
export const getMostUsedCategories = (limit = 3) => {
  try {
    const counts = JSON.parse(localStorage.getItem(CATEGORY_USE_KEY) || '{}');
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => DEFAULT_CATEGORIES.find(c => c.id === id))
      .filter(Boolean);
  } catch (error) {
    return [];
  }
};

// ============================================
// EXPORTS
// ============================================

export default {
  DEFAULT_CATEGORIES,
  getCategories,
  getCategoryWords,
  addCustomWord,
  removeCustomWord,
  recordAttempt,
  getWordProgress,
  getCategoryProgress,
  requestMoreWords,
  incrementCategoryUseCount,
  getCategoryUseCount,
  getMostUsedCategories,
};
