// socialStories.js - Social Stories service for ATLASassist
// FIXED: Better error handling for Edge Function calls
// ADDED: getCommunityStories() to fetch all user-generated stories

import { supabase, isSupabaseConfigured } from './supabase';

// ============================================
// CONSTANTS
// ============================================

export const STORY_PAGES = 6;
export const GENERATE_IMAGES = true;

export const GENERATION_STATUS = {
  IDLE: 'idle',
  CHECKING_CACHE: 'checking_cache',
  GENERATING_TEXT: 'generating_text',
  GENERATING_IMAGES: 'generating_images',
  SAVING: 'saving',
  COMPLETE: 'complete',
  ERROR: 'error',
};

// Local storage key
const LOCAL_STORIES_KEY = 'snw_local_stories';

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

const getLocalStories = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORIES_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveLocalStory = (story) => {
  const stories = getLocalStories();
  stories[story.topic_normalized] = story;
  localStorage.setItem(LOCAL_STORIES_KEY, JSON.stringify(stories));
};

// ============================================
// STORY CATEGORIES
// ============================================

export const STORY_CATEGORIES = [
  { id: 'daily', name: 'Daily Routines', emoji: '🌅', color: '#F5A623' },
  { id: 'social', name: 'Social Skills', emoji: '👋', color: '#E86B9A' },
  { id: 'emotions', name: 'Feelings', emoji: '💜', color: '#8E6BBF' },
  { id: 'safety', name: 'Safety', emoji: '🛡️', color: '#5CB85C' },
  { id: 'school', name: 'School', emoji: '🎒', color: '#4A9FD4' },
  { id: 'health', name: 'Health', emoji: '🏥', color: '#E63B2E' },
  { id: 'community', name: 'Community', emoji: '🌍', color: '#20B2AA' }, // NEW!
  { id: 'general', name: 'General', emoji: '📖', color: '#9B9B9B' },
];

// ============================================
// SUGGESTED TOPICS
// ============================================

export const SUGGESTED_TOPICS = [
  { topic: 'Taking a bath', emoji: '🛁', arasaacKeyword: 'bath' },
  { topic: 'Going to the dentist', emoji: '🦷', arasaacKeyword: 'dentist' },
  { topic: 'Making a new friend', emoji: '👋', arasaacKeyword: 'friend' },
  { topic: 'Going to school', emoji: '🏫', arasaacKeyword: 'school' },
  { topic: 'Visiting the doctor', emoji: '👨‍⚕️', arasaacKeyword: 'doctor' },
  { topic: 'Getting a haircut', emoji: '💇', arasaacKeyword: 'haircut' },
  { topic: 'Going to the grocery store', emoji: '🛒', arasaacKeyword: 'supermarket' },
  { topic: 'Taking turns', emoji: '🔄', arasaacKeyword: 'turn' },
  { topic: 'Waiting patiently', emoji: '⏰', arasaacKeyword: 'wait' },
  { topic: 'Trying new food', emoji: '🍽️', arasaacKeyword: 'food' },
  { topic: 'Wearing different clothes', emoji: '👕', arasaacKeyword: 'clothes' },
  { topic: 'Sleeping in my own bed', emoji: '🛏️', arasaacKeyword: 'sleep' },
  { topic: 'Using the bathroom', emoji: '🚽', arasaacKeyword: 'bathroom' },
  { topic: 'Riding in the car', emoji: '🚗', arasaacKeyword: 'car' },
  { topic: 'Going to a birthday party', emoji: '🎂', arasaacKeyword: 'birthday' },
  { topic: 'Fire drill at school', emoji: '🔔', arasaacKeyword: 'alarm' },
];

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
        .maybeSingle();
      
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
// GET COMMUNITY STORIES (NEW!)
// ============================================

/**
 * Fetch all user-generated stories from all users
 * These are stories created via the AI generator and marked as public
 */
export const getCommunityStories = async (options = {}) => {
  const { 
    limit = 50, 
    offset = 0,
    category = null,
    searchQuery = null,
  } = options;
  
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured, returning empty community stories');
    return [];
  }
  
  try {
    let query = supabase
      .from('social_stories')
      .select('*')
      .eq('is_public', true)
      .not('created_by', 'is', null) // Only user-generated stories
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Filter by category if specified
    if (category && category !== 'community') {
      query = query.eq('category', category);
    }
    
    // Search by topic if specified
    if (searchQuery) {
      query = query.ilike('topic', `%${searchQuery}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching community stories:', error);
      return [];
    }
    
    // Transform to match expected format
    return (data || []).map(story => ({
      ...story,
      title: story.topic,
      description: `Community story about ${story.topic}`,
      isCommunityStory: true,
    }));
  } catch (error) {
    console.error('Failed to fetch community stories:', error);
    return [];
  }
};

// ============================================
// GET POPULAR STORIES
// ============================================

export const getPopularStories = async (limit = 10) => {
  if (!isSupabaseConfigured()) return [];
  
  try {
    const { data, error } = await supabase
      .from('social_stories')
      .select('*')
      .eq('is_public', true)
      .order('view_count', { ascending: false })
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

export const searchStories = async (query, limit = 20) => {
  if (!isSupabaseConfigured() || !query) return [];
  
  try {
    const { data, error } = await supabase
      .from('social_stories')
      .select('*')
      .eq('is_public', true)
      .ilike('topic', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching stories:', error);
    return [];
  }
};

// ============================================
// GET STORY BY ID
// ============================================

export const getStoryById = async (id) => {
  if (!isSupabaseConfigured()) {
    const localStories = getLocalStories();
    return Object.values(localStories).find(s => s.id === id) || null;
  }
  
  try {
    const { data, error } = await supabase
      .from('social_stories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Increment view count
    await supabase
      .from('social_stories')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', id);
    
    return data;
  } catch (error) {
    console.error('Error fetching story:', error);
    return null;
  }
};

// ============================================
// GENERATE NEW STORY
// ============================================

/**
 * Generate a social story using Claude API
 * FIXED: Better error handling and auth token passing
 */
export const generateStory = async (topic, options = {}) => {
  const {
    onStatusChange = () => {},
    generateImages = GENERATE_IMAGES,
    userId = null,
  } = options;
  
  onStatusChange(GENERATION_STATUS.CHECKING_CACHE, 'Checking for existing stories...');
  
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
    try {
      onStatusChange(GENERATION_STATUS.GENERATING_TEXT, 'Writing your story...');
      
      // Get auth session for the request
      const { data: { session } } = await supabase.auth.getSession();
      
      // Call Edge Function to generate story
      // FIXED: Include authorization header explicitly
      const { data, error } = await supabase.functions.invoke('generate-social-story', {
        body: {
          topic,
          pageCount: STORY_PAGES,
          generateImages,
        },
        headers: session?.access_token ? {
          Authorization: `Bearer ${session.access_token}`,
        } : undefined,
      });
      
      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to generate story');
      }
      
      if (!data || !data.pages) {
        throw new Error('Invalid response from story generator');
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
          created_by: userId,
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
        
        onStatusChange(GENERATION_STATUS.COMPLETE, 'Story created!');
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
      onStatusChange(GENERATION_STATUS.ERROR, error.message);
      throw error;
    }
  } else {
    // Generate local fallback story
    onStatusChange(GENERATION_STATUS.GENERATING_TEXT, 'Creating story locally...');
    
    const localStory = generateLocalStory(topic);
    saveLocalStory(localStory);
    
    onStatusChange(GENERATION_STATUS.COMPLETE, 'Story created locally!');
    return {
      story: localStory,
      fromCache: false,
      savedToCloud: false,
      isLocalFallback: true,
    };
  }
};

// ============================================
// LOCAL FALLBACK STORY GENERATOR
// ============================================

const generateLocalStory = (topic) => {
  const pages = [
    {
      pageNumber: 1,
      text: `Today I will learn about ${topic}.`,
      imageDescription: `A friendly child thinking about ${topic}`,
    },
    {
      pageNumber: 2,
      text: `${topic} is something many people do.`,
      imageDescription: `People doing ${topic}`,
    },
    {
      pageNumber: 3,
      text: `When it's time, I can get ready step by step.`,
      imageDescription: `A child getting ready, step by step`,
    },
    {
      pageNumber: 4,
      text: `I might feel a little nervous, and that's okay.`,
      imageDescription: `A child with a gentle expression`,
    },
    {
      pageNumber: 5,
      text: `I can take deep breaths to feel calm.`,
      imageDescription: `A child taking a deep breath, calm`,
    },
    {
      pageNumber: 6,
      text: `I did it! I can be proud of myself.`,
      imageDescription: `A happy child feeling accomplished`,
    },
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
    isLocalFallback: true,
  };
};

// ============================================
// USER SAVED STORIES (FAVORITES)
// ============================================

export const saveStoryToFavorites = async (userId, storyId) => {
  if (!isSupabaseConfigured() || !userId) {
    // Save locally
    const favorites = JSON.parse(localStorage.getItem('snw_story_favorites') || '[]');
    if (!favorites.includes(storyId)) {
      favorites.push(storyId);
      localStorage.setItem('snw_story_favorites', JSON.stringify(favorites));
    }
    return true;
  }
  
  try {
    const { error } = await supabase
      .from('user_saved_stories')
      .upsert({
        user_id: userId,
        story_id: storyId,
      }, {
        onConflict: 'user_id,story_id'
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving story to favorites:', error);
    return false;
  }
};

export const removeStoryFromFavorites = async (userId, storyId) => {
  if (!isSupabaseConfigured() || !userId) {
    // Remove locally
    const favorites = JSON.parse(localStorage.getItem('snw_story_favorites') || '[]');
    const updated = favorites.filter(id => id !== storyId);
    localStorage.setItem('snw_story_favorites', JSON.stringify(updated));
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
    console.error('Error removing story from favorites:', error);
    return false;
  }
};

export const getUserSavedStories = async (userId) => {
  if (!isSupabaseConfigured() || !userId) {
    const favorites = JSON.parse(localStorage.getItem('snw_story_favorites') || '[]');
    return favorites;
  }
  
  try {
    const { data, error } = await supabase
      .from('user_saved_stories')
      .select('story_id')
      .eq('user_id', userId);
    
    if (error) throw error;
    return (data || []).map(row => row.story_id);
  } catch (error) {
    console.error('Error fetching saved stories:', error);
    return [];
  }
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
  findExistingStory,
  generateStory,
  getPopularStories,
  getCommunityStories,
  searchStories,
  getStoryById,
  saveStoryToFavorites,
  removeStoryFromFavorites,
  getUserSavedStories,
  SUGGESTED_TOPICS,
  STORY_CATEGORIES,
  GENERATION_STATUS,
};
