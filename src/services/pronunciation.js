// pronunciation.js - Pronunciation Practice service with AI generation
// FIXED: Proper session validation and token refresh before Edge Function calls

import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'snw_pronunciation_progress';

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

// ============================================
// WORD LISTS BY CATEGORY
// ============================================

export const WORD_CATEGORIES = {
  animals: {
    name: 'Animals',
    icon: '🐾',
    color: '#F5A623',
    words: [
      { word: 'cat', phonetic: '/kæt/', difficulty: 'easy' },
      { word: 'dog', phonetic: '/dɔːɡ/', difficulty: 'easy' },
      { word: 'bird', phonetic: '/bɜːrd/', difficulty: 'easy' },
      { word: 'fish', phonetic: '/fɪʃ/', difficulty: 'easy' },
      { word: 'elephant', phonetic: '/ˈelɪfənt/', difficulty: 'medium' },
      { word: 'giraffe', phonetic: '/dʒɪˈræf/', difficulty: 'medium' },
      { word: 'butterfly', phonetic: '/ˈbʌtərflaɪ/', difficulty: 'medium' },
      { word: 'hippopotamus', phonetic: '/ˌhɪpəˈpɒtəməs/', difficulty: 'hard' },
    ],
  },
  food: {
    name: 'Food',
    icon: '🍎',
    color: '#E63B2E',
    words: [
      { word: 'apple', phonetic: '/ˈæpəl/', difficulty: 'easy' },
      { word: 'banana', phonetic: '/bəˈnænə/', difficulty: 'easy' },
      { word: 'bread', phonetic: '/bred/', difficulty: 'easy' },
      { word: 'water', phonetic: '/ˈwɔːtər/', difficulty: 'easy' },
      { word: 'spaghetti', phonetic: '/spəˈɡeti/', difficulty: 'medium' },
      { word: 'broccoli', phonetic: '/ˈbrɒkəli/', difficulty: 'medium' },
      { word: 'strawberry', phonetic: '/ˈstrɔːberi/', difficulty: 'medium' },
    ],
  },
  colors: {
    name: 'Colors',
    icon: '🎨',
    color: '#8E6BBF',
    words: [
      { word: 'red', phonetic: '/red/', difficulty: 'easy' },
      { word: 'blue', phonetic: '/bluː/', difficulty: 'easy' },
      { word: 'green', phonetic: '/ɡriːn/', difficulty: 'easy' },
      { word: 'yellow', phonetic: '/ˈjeloʊ/', difficulty: 'easy' },
      { word: 'purple', phonetic: '/ˈpɜːrpəl/', difficulty: 'medium' },
      { word: 'orange', phonetic: '/ˈɒrɪndʒ/', difficulty: 'medium' },
    ],
  },
  actions: {
    name: 'Actions',
    icon: '🏃',
    color: '#4A9FD4',
    words: [
      { word: 'run', phonetic: '/rʌn/', difficulty: 'easy' },
      { word: 'jump', phonetic: '/dʒʌmp/', difficulty: 'easy' },
      { word: 'walk', phonetic: '/wɔːk/', difficulty: 'easy' },
      { word: 'swim', phonetic: '/swɪm/', difficulty: 'easy' },
      { word: 'climbing', phonetic: '/ˈklaɪmɪŋ/', difficulty: 'medium' },
      { word: 'throwing', phonetic: '/ˈθroʊɪŋ/', difficulty: 'medium' },
    ],
  },
  feelings: {
    name: 'Feelings',
    icon: '😊',
    color: '#E86B9A',
    words: [
      { word: 'happy', phonetic: '/ˈhæpi/', difficulty: 'easy' },
      { word: 'sad', phonetic: '/sæd/', difficulty: 'easy' },
      { word: 'angry', phonetic: '/ˈæŋɡri/', difficulty: 'easy' },
      { word: 'excited', phonetic: '/ɪkˈsaɪtɪd/', difficulty: 'medium' },
      { word: 'surprised', phonetic: '/sərˈpraɪzd/', difficulty: 'medium' },
      { word: 'frustrated', phonetic: '/ˈfrʌstreɪtɪd/', difficulty: 'hard' },
    ],
  },
};

// ============================================
// PROGRESS TRACKING
// ============================================

export const getProgress = async () => {
  if (!isSupabaseConfigured()) {
    return { data: getLocalProgress(), error: null };
  }

  try {
    const { session, error: sessionError } = await getValidSession();
    
    if (sessionError || !session) {
      return { data: getLocalProgress(), error: null };
    }

    const { data, error } = await supabase
      .from('pronunciation_progress')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching progress:', error);
      return { data: getLocalProgress(), error: error.message };
    }

    return { data: data?.progress || getLocalProgress(), error: null };
  } catch (error) {
    console.error('getProgress error:', error);
    return { data: getLocalProgress(), error: error.message };
  }
};

export const saveProgress = async (progress) => {
  saveLocalProgress(progress);

  if (!isSupabaseConfigured()) {
    return { error: null };
  }

  try {
    const { session, error: sessionError } = await getValidSession();
    
    if (sessionError || !session) {
      return { error: null };
    }

    const { error } = await supabase
      .from('pronunciation_progress')
      .upsert({
        user_id: session.user.id,
        progress,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving progress:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('saveProgress error:', error);
    return { error: error.message };
  }
};

export const recordAttempt = async (word, category, success, audioUrl = null) => {
  const currentProgress = await getProgress();
  const progress = currentProgress.data || {};

  if (!progress[category]) {
    progress[category] = {};
  }

  if (!progress[category][word]) {
    progress[category][word] = {
      attempts: 0,
      successes: 0,
      lastAttempt: null,
      recordings: [],
    };
  }

  progress[category][word].attempts += 1;
  if (success) {
    progress[category][word].successes += 1;
  }
  progress[category][word].lastAttempt = new Date().toISOString();

  if (audioUrl) {
    progress[category][word].recordings.push({
      url: audioUrl,
      date: new Date().toISOString(),
      success,
    });
  }

  return saveProgress(progress);
};

// ============================================
// AI GENERATION - WITH SESSION VALIDATION
// ============================================

export const generatePronunciationAudio = async (word, options = {}) => {
  const { session, error: sessionError } = await getValidSession();
  
  if (sessionError || !session) {
    return { 
      data: null, 
      error: sessionError || 'Please sign in to use AI features.' 
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke('generate-pronunciation', {
      body: {
        word,
        speed: options.speed || 'normal',
        voice: options.voice || 'neutral',
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      return { data: null, error: error.message || 'Failed to generate audio.' };
    }

    return { data, error: null };
  } catch (error) {
    console.error('generatePronunciationAudio error:', error);
    return { data: null, error: error.message };
  }
};

export const analyzeUserPronunciation = async (audioBlob, targetWord) => {
  const { session, error: sessionError } = await getValidSession();
  
  if (sessionError || !session) {
    return { 
      data: null, 
      error: sessionError || 'Please sign in to use AI analysis.' 
    };
  }

  try {
    // Convert blob to base64
    const reader = new FileReader();
    const base64Promise = new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
    });
    reader.readAsDataURL(audioBlob);
    const audioBase64 = await base64Promise;

    const { data, error } = await supabase.functions.invoke('analyze-pronunciation', {
      body: {
        audio: audioBase64,
        targetWord,
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      return { data: null, error: error.message || 'Failed to analyze pronunciation.' };
    }

    return { data, error: null };
  } catch (error) {
    console.error('analyzeUserPronunciation error:', error);
    return { data: null, error: error.message };
  }
};

export const generateWordImage = async (word) => {
  const { session, error: sessionError } = await getValidSession();
  
  if (sessionError || !session) {
    return { 
      data: null, 
      error: sessionError || 'Please sign in to generate images.' 
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke('generate-word-image', {
      body: { word },
    });

    if (error) {
      console.error('Edge function error:', error);
      return { data: null, error: error.message || 'Failed to generate image.' };
    }

    return { data, error: null };
  } catch (error) {
    console.error('generateWordImage error:', error);
    return { data: null, error: error.message };
  }
};

// ============================================
// TEXT TO SPEECH (Browser API)
// ============================================

export const speakWord = (word, rate = 0.8) => {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = rate;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
    return true;
  }
  return false;
};

export default {
  WORD_CATEGORIES,
  getProgress,
  saveProgress,
  recordAttempt,
  generatePronunciationAudio,
  analyzeUserPronunciation,
  generateWordImage,
  speakWord,
};
