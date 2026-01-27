// pronunciation.js - Pronunciation Practice service with FIXED auth for Edge Functions
// FIXED: Explicit session check and token refresh before Edge Function calls

import { supabase, isSupabaseConfigured } from './supabase';

// ============================================
// HELPER: Get valid session for Edge Function calls
// ============================================
const getValidSession = async () => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    // First try to get existing session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }

    if (!session) {
      console.warn('No active session found - user may be logged out or in guest mode');
      return null;
    }

    // Check if token is close to expiring (within 60 seconds)
    const expiresAt = session.expires_at;
    const now = Math.floor(Date.now() / 1000);
    
    if (expiresAt && (expiresAt - now) < 60) {
      console.log('Session token expiring soon, refreshing...');
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('Error refreshing session:', refreshError);
        return session; // Return old session anyway, might still work
      }
      
      return refreshData.session;
    }

    return session;
  } catch (error) {
    console.error('Error in getValidSession:', error);
    return null;
  }
};

// ============================================
// DEFAULT CATEGORIES (Offline fallback)
// ============================================
export const DEFAULT_CATEGORIES = [
  {
    id: 'default-animals',
    name: 'Animals',
    emoji: '🐾',
    color: '#F5A623',
    description: 'Common animal names',
    is_default: true,
    words: [
      { word: 'cat', hint: 'Says meow', difficulty: 1 },
      { word: 'dog', hint: 'Says woof', difficulty: 1 },
      { word: 'bird', hint: 'Has wings', difficulty: 1 },
      { word: 'fish', hint: 'Swims in water', difficulty: 1 },
      { word: 'cow', hint: 'Says moo', difficulty: 1 },
      { word: 'pig', hint: 'Says oink', difficulty: 1 },
      { word: 'horse', hint: 'You can ride it', difficulty: 2 },
      { word: 'duck', hint: 'Says quack', difficulty: 1 },
      { word: 'sheep', hint: 'Has wool', difficulty: 2 },
      { word: 'frog', hint: 'Hops and says ribbit', difficulty: 2 },
    ]
  },
  {
    id: 'default-food',
    name: 'Food',
    emoji: '🍎',
    color: '#E63B2E',
    description: 'Everyday food words',
    is_default: true,
    words: [
      { word: 'apple', hint: 'Red or green fruit', difficulty: 1 },
      { word: 'banana', hint: 'Yellow curved fruit', difficulty: 2 },
      { word: 'bread', hint: 'You make sandwiches with it', difficulty: 1 },
      { word: 'milk', hint: 'White drink from cows', difficulty: 1 },
      { word: 'egg', hint: 'Comes from chickens', difficulty: 1 },
      { word: 'rice', hint: 'Small white grains', difficulty: 1 },
      { word: 'pizza', hint: 'Round with cheese and toppings', difficulty: 2 },
      { word: 'soup', hint: 'Hot liquid food in a bowl', difficulty: 1 },
      { word: 'cookie', hint: 'Sweet baked treat', difficulty: 2 },
      { word: 'juice', hint: 'Made from fruit', difficulty: 1 },
    ]
  },
  {
    id: 'default-colors',
    name: 'Colors',
    emoji: '🎨',
    color: '#8E6BBF',
    description: 'Basic color words',
    is_default: true,
    words: [
      { word: 'red', hint: 'Color of apples', difficulty: 1 },
      { word: 'blue', hint: 'Color of the sky', difficulty: 1 },
      { word: 'green', hint: 'Color of grass', difficulty: 1 },
      { word: 'yellow', hint: 'Color of the sun', difficulty: 2 },
      { word: 'orange', hint: 'Color of carrots', difficulty: 2 },
      { word: 'purple', hint: 'Color of grapes', difficulty: 2 },
      { word: 'pink', hint: 'Light red color', difficulty: 1 },
      { word: 'black', hint: 'Color of night', difficulty: 1 },
      { word: 'white', hint: 'Color of snow', difficulty: 1 },
      { word: 'brown', hint: 'Color of chocolate', difficulty: 1 },
    ]
  },
  {
    id: 'default-family',
    name: 'Family',
    emoji: '👨‍👩‍👧‍👦',
    color: '#E86B9A',
    description: 'Family member words',
    is_default: true,
    words: [
      { word: 'mom', hint: 'Your mother', difficulty: 1 },
      { word: 'dad', hint: 'Your father', difficulty: 1 },
      { word: 'sister', hint: 'A girl sibling', difficulty: 2 },
      { word: 'brother', hint: 'A boy sibling', difficulty: 2 },
      { word: 'grandma', hint: 'Your parent\'s mom', difficulty: 2 },
      { word: 'grandpa', hint: 'Your parent\'s dad', difficulty: 2 },
      { word: 'baby', hint: 'A very young child', difficulty: 1 },
      { word: 'aunt', hint: 'Your parent\'s sister', difficulty: 2 },
      { word: 'uncle', hint: 'Your parent\'s brother', difficulty: 2 },
      { word: 'cousin', hint: 'Your aunt or uncle\'s child', difficulty: 3 },
    ]
  },
  {
    id: 'default-home',
    name: 'Home',
    emoji: '🏠',
    color: '#4A9FD4',
    description: 'Things around the house',
    is_default: true,
    words: [
      { word: 'chair', hint: 'You sit on it', difficulty: 1 },
      { word: 'table', hint: 'You eat at it', difficulty: 1 },
      { word: 'door', hint: 'Opens a room', difficulty: 1 },
      { word: 'car', hint: 'You drive it', difficulty: 1 },
      { word: 'bed', hint: 'You sleep on it', difficulty: 1 },
      { word: 'phone', hint: 'You call people', difficulty: 1 },
      { word: 'cup', hint: 'You drink from it', difficulty: 1 },
      { word: 'shoe', hint: 'Goes on your foot', difficulty: 1 },
    ]
  },
];

// ============================================
// FETCH CATEGORIES FROM DATABASE
// ============================================

export const getCategories = async () => {
  if (!isSupabaseConfigured()) {
    return DEFAULT_CATEGORIES;
  }

  try {
    const { data: categories, error } = await supabase
      .from('pronunciation_categories')
      .select('*')
      .eq('is_approved', true)
      .order('is_default', { ascending: false })
      .order('use_count', { ascending: false });

    if (error) throw error;

    // If no categories in DB, return defaults
    if (!categories || categories.length === 0) {
      return DEFAULT_CATEGORIES;
    }

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return DEFAULT_CATEGORIES;
  }
};

// ============================================
// FETCH WORDS FOR A CATEGORY
// ============================================

export const getCategoryWords = async (categoryId) => {
  // Check if it's a default category (offline fallback)
  if (categoryId.startsWith('default-')) {
    const defaultCat = DEFAULT_CATEGORIES.find(c => c.id === categoryId);
    return defaultCat?.words || [];
  }

  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data: words, error } = await supabase
      .from('pronunciation_words')
      .select('*')
      .eq('category_id', categoryId)
      .order('difficulty', { ascending: true });

    if (error) throw error;
    return words || [];
  } catch (error) {
    console.error('Error fetching words:', error);
    return [];
  }
};

// ============================================
// REQUEST NEW CATEGORY - FIXED WITH AUTH CHECK
// ============================================

export const requestNewCategory = async (categoryName, description = '') => {
  if (!isSupabaseConfigured()) {
    throw new Error('Database not configured. Cannot create new categories offline.');
  }

  // FIXED: Ensure we have a valid session before calling Edge Function
  const session = await getValidSession();
  
  if (!session) {
    throw new Error('Authentication required. Please sign in to create new categories.');
  }

  try {
    const { data, error } = await supabase.functions.invoke('generate-pronunciation-content', {
      body: {
        type: 'category',
        categoryName: categoryName.trim(),
        description: description.trim(),
      },
    });

    if (error) {
      console.error('Edge Function error:', error);
      
      // Check for specific auth errors
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        throw new Error('Session expired. Please refresh the page and try again.');
      }
      
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error requesting new category:', error);
    throw error;
  }
};

// ============================================
// REQUEST MORE WORDS FOR CATEGORY - FIXED WITH AUTH CHECK
// ============================================

export const requestMoreWords = async (categoryId, categoryName, existingWords, count = 10) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Database not configured. Cannot add words offline.');
  }

  // FIXED: Ensure we have a valid session before calling Edge Function
  const session = await getValidSession();
  
  if (!session) {
    throw new Error('Authentication required. Please sign in to add new words.');
  }

  try {
    const { data, error } = await supabase.functions.invoke('generate-pronunciation-content', {
      body: {
        type: 'words',
        categoryId,
        categoryName,
        existingWords,
        count,
      },
    });

    if (error) {
      console.error('Edge Function error:', error);
      
      // Check for specific auth errors
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        throw new Error('Session expired. Please refresh the page and try again.');
      }
      
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error requesting more words:', error);
    throw error;
  }
};

// ============================================
// INCREMENT USE COUNT
// ============================================

export const incrementCategoryUseCount = async (categoryId) => {
  if (!isSupabaseConfigured() || categoryId.startsWith('default-')) return;

  try {
    await supabase.rpc('increment_category_use_count', { category_id: categoryId });
  } catch (error) {
    console.error('Error incrementing use count:', error);
  }
};

export const incrementWordUseCount = async (wordId) => {
  if (!isSupabaseConfigured()) return;

  try {
    await supabase.rpc('increment_word_use_count', { word_id: wordId });
  } catch (error) {
    console.error('Error incrementing word use count:', error);
  }
};

// ============================================
// SEARCH EXISTING CATEGORIES
// ============================================

export const searchCategories = async (query) => {
  if (!isSupabaseConfigured()) {
    return DEFAULT_CATEGORIES.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  try {
    const { data, error } = await supabase
      .from('pronunciation_categories')
      .select('*')
      .eq('is_approved', true)
      .ilike('name', `%${query}%`)
      .order('use_count', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching categories:', error);
    return [];
  }
};

// ============================================
// SAVE PRACTICE HISTORY
// ============================================

export const savePracticeResult = async (userId, wordId, isCorrect, attempts) => {
  if (!isSupabaseConfigured()) {
    // Save locally
    const key = `pronunciation_history_${userId}`;
    const history = JSON.parse(localStorage.getItem(key) || '[]');
    history.push({
      wordId,
      isCorrect,
      attempts,
      timestamp: new Date().toISOString(),
    });
    // Keep last 100 entries
    if (history.length > 100) {
      history.shift();
    }
    localStorage.setItem(key, JSON.stringify(history));
    return;
  }

  try {
    await supabase
      .from('pronunciation_history')
      .insert({
        user_id: userId,
        word_id: wordId,
        is_correct: isCorrect,
        attempts: attempts,
      });
  } catch (error) {
    console.error('Error saving practice result:', error);
  }
};

// ============================================
// GET USER STATISTICS
// ============================================

export const getUserStats = async (userId) => {
  if (!isSupabaseConfigured()) {
    const key = `pronunciation_history_${userId}`;
    const history = JSON.parse(localStorage.getItem(key) || '[]');
    
    const totalWords = history.length;
    const correctWords = history.filter(h => h.isCorrect).length;
    
    return {
      totalPracticed: totalWords,
      totalCorrect: correctWords,
      accuracy: totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0,
    };
  }

  try {
    const { data, error } = await supabase
      .from('pronunciation_history')
      .select('is_correct')
      .eq('user_id', userId);

    if (error) throw error;

    const totalWords = data?.length || 0;
    const correctWords = data?.filter(h => h.is_correct).length || 0;
    
    return {
      totalPracticed: totalWords,
      totalCorrect: correctWords,
      accuracy: totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0,
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      totalPracticed: 0,
      totalCorrect: 0,
      accuracy: 0,
    };
  }
};

export default {
  DEFAULT_CATEGORIES,
  getCategories,
  getCategoryWords,
  requestNewCategory,
  requestMoreWords,
  incrementCategoryUseCount,
  incrementWordUseCount,
  searchCategories,
  savePracticeResult,
  getUserStats,
};
