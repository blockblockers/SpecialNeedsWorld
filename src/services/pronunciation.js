// services/pronunciation.js
// Service for pronunciation practice - database interaction and content generation

import { supabase, isSupabaseConfigured } from './supabase';

// ============================================
// DEFAULT CATEGORIES (Fallback when offline)
// ============================================

export const DEFAULT_CATEGORIES = [
  {
    id: 'default-animals',
    name: 'Animals',
    emoji: '🐾',
    color: '#F5A623',
    description: 'Learn animal names',
    is_default: true,
    words: [
      { word: 'cat', hint: 'A furry pet that meows', difficulty: 1 },
      { word: 'dog', hint: 'A pet that barks', difficulty: 1 },
      { word: 'bird', hint: 'It can fly', difficulty: 1 },
      { word: 'fish', hint: 'It swims in water', difficulty: 1 },
      { word: 'horse', hint: 'You can ride it', difficulty: 1 },
      { word: 'cow', hint: 'It says moo', difficulty: 1 },
      { word: 'pig', hint: 'It says oink', difficulty: 1 },
      { word: 'duck', hint: 'It says quack', difficulty: 1 },
      { word: 'frog', hint: 'It hops and ribbits', difficulty: 1 },
      { word: 'bear', hint: 'A big furry animal', difficulty: 2 },
    ]
  },
  {
    id: 'default-food',
    name: 'Food',
    emoji: '🍎',
    color: '#E63B2E',
    description: 'Common food words',
    is_default: true,
    words: [
      { word: 'apple', hint: 'A red or green fruit', difficulty: 1 },
      { word: 'banana', hint: 'A yellow fruit', difficulty: 1 },
      { word: 'bread', hint: 'Used for sandwiches', difficulty: 1 },
      { word: 'milk', hint: 'A white drink', difficulty: 1 },
      { word: 'egg', hint: 'Comes from a chicken', difficulty: 1 },
      { word: 'cheese', hint: 'Yellow and dairy', difficulty: 1 },
      { word: 'water', hint: 'You drink it', difficulty: 1 },
      { word: 'cookie', hint: 'A sweet treat', difficulty: 1 },
      { word: 'pizza', hint: 'Has cheese and toppings', difficulty: 1 },
      { word: 'juice', hint: 'A fruity drink', difficulty: 1 },
    ]
  },
  {
    id: 'default-body',
    name: 'Body Parts',
    emoji: '👋',
    color: '#E86B9A',
    description: 'Parts of the body',
    is_default: true,
    words: [
      { word: 'hand', hint: 'You wave with it', difficulty: 1 },
      { word: 'foot', hint: 'You walk on it', difficulty: 1 },
      { word: 'head', hint: 'On top of your body', difficulty: 1 },
      { word: 'eye', hint: 'You see with it', difficulty: 1 },
      { word: 'ear', hint: 'You hear with it', difficulty: 1 },
      { word: 'nose', hint: 'You smell with it', difficulty: 1 },
      { word: 'mouth', hint: 'You eat with it', difficulty: 1 },
      { word: 'arm', hint: 'Between shoulder and hand', difficulty: 1 },
      { word: 'leg', hint: 'You walk with them', difficulty: 1 },
      { word: 'finger', hint: 'You have ten of them', difficulty: 1 },
    ]
  },
  {
    id: 'default-colors',
    name: 'Colors',
    emoji: '🌈',
    color: '#8E6BBF',
    description: 'Color names',
    is_default: true,
    words: [
      { word: 'red', hint: 'Color of an apple', difficulty: 1 },
      { word: 'blue', hint: 'Color of the sky', difficulty: 1 },
      { word: 'green', hint: 'Color of grass', difficulty: 1 },
      { word: 'yellow', hint: 'Color of the sun', difficulty: 1 },
      { word: 'orange', hint: 'Color of a carrot', difficulty: 1 },
      { word: 'purple', hint: 'Color of grapes', difficulty: 1 },
      { word: 'pink', hint: 'A light red color', difficulty: 1 },
      { word: 'black', hint: 'Color of night', difficulty: 1 },
      { word: 'white', hint: 'Color of snow', difficulty: 1 },
      { word: 'brown', hint: 'Color of chocolate', difficulty: 1 },
    ]
  },
  {
    id: 'default-actions',
    name: 'Actions',
    emoji: '🏃',
    color: '#5CB85C',
    description: 'Action verbs',
    is_default: true,
    words: [
      { word: 'run', hint: 'Move fast with your legs', difficulty: 1 },
      { word: 'jump', hint: 'Go up in the air', difficulty: 1 },
      { word: 'eat', hint: 'Put food in your mouth', difficulty: 1 },
      { word: 'drink', hint: 'Have some water', difficulty: 1 },
      { word: 'sleep', hint: 'Close your eyes at night', difficulty: 1 },
      { word: 'walk', hint: 'Move with your feet', difficulty: 1 },
      { word: 'sit', hint: 'Use a chair', difficulty: 1 },
      { word: 'stand', hint: 'Be on your feet', difficulty: 1 },
      { word: 'read', hint: 'Look at a book', difficulty: 1 },
      { word: 'play', hint: 'Have fun!', difficulty: 1 },
    ]
  },
  {
    id: 'default-family',
    name: 'Family',
    emoji: '👨‍👩‍👧',
    color: '#4A9FD4',
    description: 'Family members',
    is_default: true,
    words: [
      { word: 'mom', hint: 'Your mother', difficulty: 1 },
      { word: 'dad', hint: 'Your father', difficulty: 1 },
      { word: 'baby', hint: 'A very young child', difficulty: 1 },
      { word: 'sister', hint: 'A girl sibling', difficulty: 1 },
      { word: 'brother', hint: 'A boy sibling', difficulty: 1 },
      { word: 'grandma', hint: 'Mom or dad\'s mother', difficulty: 1 },
      { word: 'grandpa', hint: 'Mom or dad\'s father', difficulty: 1 },
      { word: 'family', hint: 'All your relatives', difficulty: 2 },
      { word: 'friend', hint: 'Someone you like', difficulty: 1 },
      { word: 'teacher', hint: 'Helps you learn', difficulty: 2 },
    ]
  },
  {
    id: 'default-objects',
    name: 'Objects',
    emoji: '🎒',
    color: '#20B2AA',
    description: 'Everyday objects',
    is_default: true,
    words: [
      { word: 'ball', hint: 'Round and bouncy', difficulty: 1 },
      { word: 'book', hint: 'You read it', difficulty: 1 },
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
// REQUEST NEW CATEGORY (Calls Edge Function)
// ============================================

export const requestNewCategory = async (categoryName, description = '') => {
  if (!isSupabaseConfigured()) {
    throw new Error('Database not configured. Cannot create new categories offline.');
  }

  try {
    const { data, error } = await supabase.functions.invoke('generate-pronunciation-content', {
      body: {
        type: 'category',
        categoryName: categoryName.trim(),
        description: description.trim(),
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error requesting new category:', error);
    throw error;
  }
};

// ============================================
// REQUEST MORE WORDS FOR CATEGORY
// ============================================

export const requestMoreWords = async (categoryId, categoryName, existingWords, count = 10) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Database not configured. Cannot add words offline.');
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

    if (error) throw error;
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
