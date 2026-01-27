// socialStories.js - Social Stories service with FIXED auth for Edge Functions
// FIXED: Explicit session check and token refresh before Edge Function calls

import { supabase, isSupabaseConfigured } from './supabase';

// ============================================
// CONSTANTS
// ============================================
export const STORY_PAGES = 6;
export const GENERATE_IMAGES = true;

export const GENERATION_STATUS = {
  IDLE: 'idle',
  GENERATING_TEXT: 'generating_text',
  GENERATING_IMAGES: 'generating_images',
  SAVING: 'saving',
  COMPLETE: 'complete',
  ERROR: 'error',
};

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
// LOCAL STORAGE HELPERS
// ============================================
const LOCAL_STORIES_KEY = 'snw_local_stories';
const LOCAL_FAVORITES_KEY = 'snw_story_favorites';

const getLocalStories = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORIES_KEY) || '{}');
  } catch {
    return {};
  }
};

const saveLocalStory = (story) => {
  const stories = getLocalStories();
  stories[story.id] = story;
  localStorage.setItem(LOCAL_STORIES_KEY, JSON.stringify(stories));
};

// ============================================
// FIND EXISTING STORY
// ============================================
export const findExistingStory = async (topic) => {
  const normalizedTopic = topic.toLowerCase().trim();
  
  // Check database first
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('social_stories')
        .select('*')
        .eq('topic_normalized', normalizedTopic)
        .eq('is_public', true)
        .limit(1)
        .single();
      
      if (!error && data) {
        return data;
      }
    } catch (error) {
      console.error('Error searching stories:', error);
    }
  }
  
  // Check local storage
  const localStories = getLocalStories();
  for (const story of Object.values(localStories)) {
    if (story.topic_normalized === normalizedTopic) {
      return story;
    }
  }
  
  return null;
};

// ============================================
// GENERATE NEW STORY - FIXED WITH AUTH CHECK
// ============================================
export const generateStory = async (topic, options = {}) => {
  const {
    onStatusChange = () => {},
    generateImages = GENERATE_IMAGES,
    userId = null,
  } = options;
  
  onStatusChange(GENERATION_STATUS.GENERATING_TEXT, 'Checking for existing stories...');
  
  // First check if a similar story exists
  const existing = await findExistingStory(topic);
  if (existing) {
    onStatusChange(GENERATION_STATUS.COMPLETE, 'Found existing story!');
    return {
      story: existing,
      fromCache: true,
    };
  }
  
  // Generate new story
  if (isSupabaseConfigured()) {
    // FIXED: Ensure we have a valid session before calling Edge Function
    const session = await getValidSession();
    
    if (!session) {
      onStatusChange(GENERATION_STATUS.ERROR, 'Please sign in to create stories');
      throw new Error('Authentication required. Please sign in to create AI-generated stories.');
    }

    try {
      onStatusChange(GENERATION_STATUS.GENERATING_TEXT, 'Writing your story...');
      
      // Call Edge Function to generate story with images
      // The supabase client will automatically include the Authorization header
      const { data, error } = await supabase.functions.invoke('generate-social-story', {
        body: {
          topic,
          pageCount: STORY_PAGES,
          generateImages,
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
      
      // Check for insufficient credits warning
      if (data.insufficientCredits) {
        console.warn('Insufficient credits for image generation');
      }
      
      if (generateImages && data.imagesGenerated > 0) {
        onStatusChange(GENERATION_STATUS.GENERATING_IMAGES, `Generated ${data.imagesGenerated} illustrations!`);
      }
      
      onStatusChange(GENERATION_STATUS.SAVING, 'Saving to library...');
      
      // Determine emoji based on category
      const categoryEmojis = {
        daily: '🌅',
        social: '👋',
        emotions: '💜',
        safety: '🛡️',
        school: '🎒',
        health: '🏥',
        general: '📖',
      };
      const category = data.category || 'general';
      const emoji = categoryEmojis[category] || '📖';
      
      // Save to database so other users can find it
      const { data: savedStory, error: saveError } = await supabase
        .from('social_stories')
        .insert({
          topic,
          topic_normalized: topic.toLowerCase().trim(),
          pages: data.pages,
          created_by: userId || session.user.id,
          is_public: true,
          has_images: data.imagesGenerated > 0,
          category: category,
          emoji: emoji,
        })
        .select()
        .single();
      
      if (saveError) {
        console.error('Error saving story:', saveError);
        // Return the generated story even if save fails
        onStatusChange(GENERATION_STATUS.COMPLETE, 'Story created!');
        
        const tempStory = {
          id: `temp_${Date.now()}`,
          topic,
          topic_normalized: topic.toLowerCase().trim(),
          pages: data.pages,
          is_public: false,
          has_images: data.imagesGenerated > 0,
          category: category,
          emoji: emoji,
          created_at: new Date().toISOString(),
        };
        
        // Save locally as fallback
        saveLocalStory(tempStory);
        
        return {
          story: tempStory,
          fromCache: false,
          savedToCloud: false,
          insufficientCredits: data.insufficientCredits,
          creditMessage: data.message,
        };
      }
      
      onStatusChange(GENERATION_STATUS.COMPLETE, data.insufficientCredits 
        ? 'Story created (some images missing - credits exhausted)' 
        : 'Story added to library!');
      
      return {
        story: savedStory,
        fromCache: false,
        savedToCloud: true,
        insufficientCredits: data.insufficientCredits,
        creditMessage: data.message,
      };
      
    } catch (error) {
      console.error('Error generating story:', error);
      onStatusChange(GENERATION_STATUS.ERROR, error.message || 'Failed to create story');
      throw error;
    }
  }
  
  // Fallback: Generate simple local story without AI
  onStatusChange(GENERATION_STATUS.GENERATING_TEXT, 'Creating story locally...');
  
  const localStory = generateLocalStory(topic);
  saveLocalStory(localStory);
  
  onStatusChange(GENERATION_STATUS.COMPLETE, 'Story created locally!');
  
  return {
    story: localStory,
    fromCache: false,
    savedToCloud: false,
    isLocal: true,
  };
};

// ============================================
// LOCAL STORY GENERATION (Offline fallback)
// ============================================
const generateLocalStory = (topic) => {
  const pages = [
    { pageNumber: 1, text: `Sometimes I need to learn about ${topic}.`, imageDescription: 'Child looking curious' },
    { pageNumber: 2, text: `${topic} is something that happens in my life.`, imageDescription: 'Scene related to topic' },
    { pageNumber: 3, text: 'I can take my time to understand new things.', imageDescription: 'Child thinking' },
    { pageNumber: 4, text: 'It\'s okay to feel different emotions about this.', imageDescription: 'Child with various emotions' },
    { pageNumber: 5, text: 'I can ask for help if I need it.', imageDescription: 'Child asking adult for help' },
    { pageNumber: 6, text: 'I am doing a great job learning!', imageDescription: 'Happy child with thumbs up' },
  ];
  
  return {
    id: `local_${Date.now()}`,
    topic,
    topic_normalized: topic.toLowerCase().trim(),
    pages,
    is_public: false,
    has_images: false,
    category: 'general',
    emoji: '📖',
    created_at: new Date().toISOString(),
  };
};

// ============================================
// GET POPULAR STORIES
// ============================================
export const getPopularStories = async (limit = 10) => {
  if (!isSupabaseConfigured()) {
    return Object.values(getLocalStories()).slice(0, limit);
  }

  try {
    const { data, error } = await supabase
      .from('social_stories')
      .select('*')
      .eq('is_public', true)
      .order('use_count', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching popular stories:', error);
    return [];
  }
};

// ============================================
// SEARCH STORIES
// ============================================
export const searchStories = async (query, limit = 10) => {
  if (!isSupabaseConfigured()) {
    const local = Object.values(getLocalStories());
    return local.filter(s => 
      s.topic.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit);
  }

  try {
    const { data, error } = await supabase
      .from('social_stories')
      .select('*')
      .eq('is_public', true)
      .ilike('topic', `%${query}%`)
      .order('use_count', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching stories:', error);
    return [];
  }
};

// ============================================
// INCREMENT USE COUNT
// ============================================
export const incrementUseCount = async (storyId) => {
  if (!isSupabaseConfigured() || storyId.startsWith('local_') || storyId.startsWith('temp_')) {
    return;
  }

  try {
    await supabase.rpc('increment_story_use_count', { story_id: storyId });
  } catch (error) {
    console.error('Error incrementing use count:', error);
  }
};

// ============================================
// SAVE/UNSAVE STORY (Favorites)
// ============================================
export const saveStoryToFavorites = async (storyId, userId) => {
  if (!isSupabaseConfigured()) {
    const favorites = JSON.parse(localStorage.getItem(LOCAL_FAVORITES_KEY) || '[]');
    if (!favorites.includes(storyId)) {
      favorites.push(storyId);
      localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(favorites));
    }
    return true;
  }

  try {
    const { error } = await supabase
      .from('user_saved_stories')
      .insert({ user_id: userId, story_id: storyId });
    
    if (error && error.code !== '23505') throw error; // Ignore duplicate
    return true;
  } catch (error) {
    console.error('Error saving to favorites:', error);
    return false;
  }
};

export const removeStoryFromFavorites = async (storyId, userId) => {
  if (!isSupabaseConfigured()) {
    const favorites = JSON.parse(localStorage.getItem(LOCAL_FAVORITES_KEY) || '[]');
    const updated = favorites.filter(id => id !== storyId);
    localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(updated));
    return true;
  }

  try {
    const { error } = await supabase
      .from('user_saved_stories')
      .delete()
      .eq('user_id', userId)
      .eq('story_id', storyId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

export const isStoryFavorited = async (storyId, userId) => {
  if (!isSupabaseConfigured()) {
    const favorites = JSON.parse(localStorage.getItem(LOCAL_FAVORITES_KEY) || '[]');
    return favorites.includes(storyId);
  }

  try {
    const { data, error } = await supabase
      .from('user_saved_stories')
      .select('id')
      .eq('user_id', userId)
      .eq('story_id', storyId)
      .single();
    
    return !error && !!data;
  } catch {
    return false;
  }
};

export const getUserFavorites = async (userId) => {
  if (!isSupabaseConfigured()) {
    const favoriteIds = JSON.parse(localStorage.getItem(LOCAL_FAVORITES_KEY) || '[]');
    const localStories = getLocalStories();
    return favoriteIds
      .map(id => localStories[id])
      .filter(Boolean);
  }

  try {
    const { data, error } = await supabase
      .from('user_saved_stories')
      .select('story_id, social_stories(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data?.map(d => d.social_stories).filter(Boolean) || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

export default {
  GENERATION_STATUS,
  STORY_PAGES,
  findExistingStory,
  generateStory,
  getPopularStories,
  searchStories,
  incrementUseCount,
  saveStoryToFavorites,
  removeStoryFromFavorites,
  isStoryFavorited,
  getUserFavorites,
};
