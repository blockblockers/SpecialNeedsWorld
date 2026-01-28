// socialStories.js - Social Stories service with AI generation
// FIXED: Proper session validation and token refresh before Edge Function calls

import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'snw_social_stories';

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

const getLocalStories = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error reading local stories:', error);
    return [];
  }
};

const saveLocalStories = (stories) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  } catch (error) {
    console.error('Error saving local stories:', error);
  }
};

// ============================================
// DATABASE OPERATIONS
// ============================================

export const fetchStories = async () => {
  if (!isSupabaseConfigured()) {
    return { data: getLocalStories(), error: null };
  }

  try {
    const { session, error: sessionError } = await getValidSession();
    
    if (sessionError || !session) {
      return { data: getLocalStories(), error: null };
    }

    const { data, error } = await supabase
      .from('social_stories')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching stories:', error);
      return { data: getLocalStories(), error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('fetchStories error:', error);
    return { data: getLocalStories(), error: error.message };
  }
};

export const createStory = async (story) => {
  if (!isSupabaseConfigured()) {
    const stories = getLocalStories();
    const newStory = {
      id: `local_${Date.now()}`,
      ...story,
      created_at: new Date().toISOString(),
    };
    saveLocalStories([newStory, ...stories]);
    return { data: newStory, error: null };
  }

  try {
    const { session, error: sessionError } = await getValidSession();
    
    if (sessionError || !session) {
      const stories = getLocalStories();
      const newStory = {
        id: `local_${Date.now()}`,
        ...story,
        created_at: new Date().toISOString(),
      };
      saveLocalStories([newStory, ...stories]);
      return { data: newStory, error: null };
    }

    const { data, error } = await supabase
      .from('social_stories')
      .insert({ ...story, user_id: session.user.id })
      .select()
      .single();

    if (error) {
      console.error('Error creating story:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('createStory error:', error);
    return { data: null, error: error.message };
  }
};

export const updateStory = async (id, updates) => {
  if (!isSupabaseConfigured() || id.startsWith('local_')) {
    const stories = getLocalStories();
    const index = stories.findIndex(s => s.id === id);
    if (index !== -1) {
      stories[index] = { ...stories[index], ...updates };
      saveLocalStories(stories);
      return { data: stories[index], error: null };
    }
    return { data: null, error: 'Story not found' };
  }

  try {
    const { session, error: sessionError } = await getValidSession();
    
    if (sessionError || !session) {
      return { data: null, error: 'Please sign in to update stories' };
    }

    const { data, error } = await supabase
      .from('social_stories')
      .update(updates)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const deleteStory = async (id) => {
  if (!isSupabaseConfigured() || id.startsWith('local_')) {
    const stories = getLocalStories();
    saveLocalStories(stories.filter(s => s.id !== id));
    return { error: null };
  }

  try {
    const { session, error: sessionError } = await getValidSession();
    
    if (sessionError || !session) {
      return { error: 'Please sign in to delete stories' };
    }

    const { error } = await supabase
      .from('social_stories')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// ============================================
// AI GENERATION - WITH SESSION VALIDATION
// ============================================

export const generateStoryImages = async (storyData) => {
  const { session, error: sessionError } = await getValidSession();
  
  if (sessionError || !session) {
    return { 
      data: null, 
      error: sessionError || 'Please sign in to generate images. AI features require authentication.' 
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke('generate-social-story-images', {
      body: {
        title: storyData.title,
        steps: storyData.steps,
        style: storyData.style || 'cartoon',
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      return { data: null, error: error.message || 'Failed to generate images.' };
    }

    return { data, error: null };
  } catch (error) {
    console.error('generateStoryImages error:', error);
    return { data: null, error: error.message };
  }
};

export const generateCompleteStory = async (prompt, options = {}) => {
  const { session, error: sessionError } = await getValidSession();
  
  if (sessionError || !session) {
    return { 
      data: null, 
      error: sessionError || 'Please sign in to generate stories. AI features require authentication.' 
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke('generate-social-story', {
      body: {
        prompt,
        childName: options.childName || 'the child',
        style: options.style || 'supportive',
        includeImages: options.includeImages !== false,
      },
    });

    if (error) {
      return { data: null, error: error.message || 'Failed to generate story.' };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// ============================================
// TEMPLATE STORIES
// ============================================

export const STORY_TEMPLATES = [
  {
    id: 'going-to-doctor',
    title: 'Going to the Doctor',
    category: 'health',
    steps: [
      { text: 'Sometimes I need to visit the doctor to stay healthy.', image: null },
      { text: 'The waiting room might have toys or books.', image: null },
      { text: 'A nurse might check my height and weight.', image: null },
      { text: 'The doctor will look at my ears, eyes, and throat.', image: null },
      { text: 'I might get a sticker when I\'m done!', image: null },
    ],
  },
  {
    id: 'first-day-school',
    title: 'First Day of School',
    category: 'school',
    steps: [
      { text: 'Today is my first day at a new school.', image: null },
      { text: 'I will meet my new teacher.', image: null },
      { text: 'I will see my new classroom.', image: null },
      { text: 'I might make new friends.', image: null },
      { text: 'I can do this!', image: null },
    ],
  },
  {
    id: 'waiting-my-turn',
    title: 'Waiting My Turn',
    category: 'social',
    steps: [
      { text: 'Sometimes I have to wait for my turn.', image: null },
      { text: 'Waiting can be hard, but I can do it.', image: null },
      { text: 'I can take deep breaths while I wait.', image: null },
      { text: 'When it\'s my turn, I will be ready!', image: null },
    ],
  },
];

export default {
  fetchStories,
  createStory,
  updateStory,
  deleteStory,
  generateStoryImages,
  generateCompleteStory,
  STORY_TEMPLATES,
};
