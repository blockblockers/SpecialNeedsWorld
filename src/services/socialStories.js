// socialStories.js - Social Stories generation and management
// UPDATED: Now supports AI-generated illustrations via DALL-E
// Uses Claude API to generate story text, DALL-E for children's book style images
// Stories are saved to Supabase and shared across all users

import { supabase, isSupabaseConfigured } from './supabase';

// ============================================
// CONFIGURATION
// ============================================

const STORY_PAGES = 6; // Number of pages per story
const GENERATE_IMAGES = true; // Enable image generation by default

// Status states for story generation
export const GENERATION_STATUS = {
  IDLE: 'idle',
  GENERATING_TEXT: 'generating_text',
  GENERATING_IMAGES: 'generating_images',
  SAVING: 'saving',
  COMPLETE: 'complete',
  ERROR: 'error',
};

// ============================================
// LOCAL STORAGE (Fallback)
// ============================================

const LOCAL_STORIES_KEY = 'snw_social_stories';
const LOCAL_SAVED_KEY = 'snw_saved_stories';

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

const getLocalSavedStories = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_SAVED_KEY) || '[]');
  } catch {
    return [];
  }
};

// ============================================
// FIND EXISTING STORY
// ============================================

/**
 * Search for an existing story matching the topic
 */
export const findExistingStory = async (topic) => {
  const normalizedTopic = topic.toLowerCase().trim();
  
  // Check cloud first
  if (isSupabaseConfigured()) {
    try {
      // Try exact match
      const { data: exactMatch } = await supabase
        .from('social_stories')
        .select('*')
        .eq('topic_normalized', normalizedTopic)
        .eq('is_public', true)
        .order('use_count', { ascending: false })
        .limit(1)
        .single();
      
      if (exactMatch) {
        // Increment use count
        await supabase
          .from('social_stories')
          .update({ 
            use_count: exactMatch.use_count + 1,
            last_used_at: new Date().toISOString()
          })
          .eq('id', exactMatch.id);
        
        return exactMatch;
      }
      
      // Try fuzzy search
      const { data: searchResults } = await supabase
        .rpc('search_stories', { p_query: topic, p_limit: 1 });
      
      if (searchResults && searchResults.length > 0) {
        return searchResults[0];
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
// GENERATE NEW STORY
// ============================================

/**
 * Generate a social story using Claude API + DALL-E for images
 * This calls the Supabase Edge Function which handles both APIs
 * Stories use generic "you" language to enable caching and reuse
 * @param {string} topic - The topic for the story
 * @param {Object} options - Generation options
 * @param {Function} options.onStatusChange - Callback for status updates
 * @param {boolean} options.generateImages - Whether to generate images (default: true)
 * @param {string} options.userId - User ID for attribution
 */
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
    try {
      onStatusChange(GENERATION_STATUS.GENERATING_TEXT, 'Writing your story...');
      
      // Call Edge Function to generate story with images
      const { data, error } = await supabase.functions.invoke('generate-social-story', {
        body: {
          topic,
          pageCount: STORY_PAGES,
          generateImages,
        },
      });
      
      if (error) throw error;
      
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
        onStatusChange(GENERATION_STATUS.COMPLETE, 'Story created!');
        return {
          story: {
            id: `temp_${Date.now()}`,
            topic,
            topic_normalized: topic.toLowerCase().trim(),
            pages: data.pages,
            is_public: false,
            has_images: data.imagesGenerated > 0,
            category: category,
            emoji: emoji,
            created_at: new Date().toISOString(),
          },
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
      onStatusChange(GENERATION_STATUS.ERROR, error.message || 'Failed to generate story');
      // Fall back to local generation
    }
  }
  
  // Local fallback - generate a simple template story (no images)
  onStatusChange(GENERATION_STATUS.GENERATING_TEXT, 'Creating local story...');
  const story = generateLocalStory(topic);
  saveLocalStory(story);
  
  onStatusChange(GENERATION_STATUS.COMPLETE, 'Story created locally!');
  
  return {
    story,
    fromCache: false,
    savedToCloud: false,
  };
};

/**
 * Generate a simple template story locally (fallback)
 * Uses ARASAAC pictogram keywords for images
 * Uses "you" language for universal applicability and caching
 */
const generateLocalStory = (topic) => {
  const id = `local_${Date.now()}`;
  const topicLower = topic.toLowerCase();
  
  // Find topic-specific keywords for ARASAAC
  const topicData = SUGGESTED_TOPICS.find(t => t.topic.toLowerCase() === topicLower);
  
  // Generate pages with ARASAAC keywords - using "you" for universal stories
  const pages = [
    {
      pageNumber: 1,
      text: `Sometimes you need to do ${topic}.`,
      imageDescription: `A child thinking`,
      arasaacKeyword: 'think',
      emoji: '💭',
    },
    {
      pageNumber: 2,
      text: `${topic} is something important.`,
      imageDescription: topic,
      arasaacKeyword: topicData?.arasaacKeyword || topic.split(' ').pop(),
      emoji: topicData?.emoji || '📖',
    },
    {
      pageNumber: 3,
      text: `First, you get ready. It's good to be prepared!`,
      imageDescription: `Getting ready`,
      arasaacKeyword: 'prepare',
      emoji: '✅',
    },
    {
      pageNumber: 4,
      text: `You can take it one step at a time. There's no rush.`,
      imageDescription: `Taking a step`,
      arasaacKeyword: 'walk',
      emoji: '👣',
    },
    {
      pageNumber: 5,
      text: `If you feel nervous, that's okay. Deep breaths help!`,
      imageDescription: `Taking a breath`,
      arasaacKeyword: 'breathe',
      emoji: '🌬️',
    },
    {
      pageNumber: 6,
      text: `You did it! ${topic} wasn't so bad after all.`,
      imageDescription: `Feeling happy`,
      arasaacKeyword: 'happy',
      emoji: '🎉',
    },
  ];
  
  return {
    id,
    topic,
    topic_normalized: topic.toLowerCase().trim(),
    pages,
    is_public: false,
    use_count: 1,
    created_at: new Date().toISOString(),
  };
};

// ============================================
// GET STORIES
// ============================================

/**
 * Get popular stories
 */
export const getPopularStories = async (limit = 10) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .rpc('get_popular_stories', { p_limit: limit });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting popular stories:', error);
    }
  }
  
  // Return local stories
  const localStories = Object.values(getLocalStories())
    .sort((a, b) => (b.use_count || 0) - (a.use_count || 0))
    .slice(0, limit);
  
  return localStories;
};

/**
 * Search stories by topic
 */
export const searchStories = async (query, limit = 10) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .rpc('search_stories', { p_query: query, p_limit: limit });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching stories:', error);
    }
  }
  
  // Search local stories
  const normalizedQuery = query.toLowerCase();
  const localStories = Object.values(getLocalStories())
    .filter(s => s.topic.toLowerCase().includes(normalizedQuery))
    .slice(0, limit);
  
  return localStories;
};

/**
 * Get story by ID
 */
export const getStoryById = async (storyId) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('social_stories')
        .select('*')
        .eq('id', storyId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting story:', error);
    }
  }
  
  // Check local
  const localStories = getLocalStories();
  return localStories[storyId] || null;
};

// ============================================
// USER SAVED STORIES
// ============================================

/**
 * Save story to user's favorites
 */
export const saveStoryToFavorites = async (userId, storyId) => {
  if (isSupabaseConfigured() && userId) {
    try {
      const { error } = await supabase
        .from('user_saved_stories')
        .upsert({
          user_id: userId,
          story_id: storyId,
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving story:', error);
    }
  }
  
  // Save locally
  const saved = getLocalSavedStories();
  if (!saved.includes(storyId)) {
    saved.push(storyId);
    localStorage.setItem(LOCAL_SAVED_KEY, JSON.stringify(saved));
  }
  return true;
};

/**
 * Remove story from favorites
 */
export const removeStoryFromFavorites = async (userId, storyId) => {
  if (isSupabaseConfigured() && userId) {
    try {
      const { error } = await supabase
        .from('user_saved_stories')
        .delete()
        .eq('user_id', userId)
        .eq('story_id', storyId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing story:', error);
    }
  }
  
  // Remove locally
  const saved = getLocalSavedStories();
  const index = saved.indexOf(storyId);
  if (index > -1) {
    saved.splice(index, 1);
    localStorage.setItem(LOCAL_SAVED_KEY, JSON.stringify(saved));
  }
  return true;
};

/**
 * Get user's saved stories
 */
export const getUserSavedStories = async (userId) => {
  if (isSupabaseConfigured() && userId) {
    try {
      const { data, error } = await supabase
        .from('user_saved_stories')
        .select(`
          story_id,
          saved_at,
          custom_character_name,
          social_stories (*)
        `)
        .eq('user_id', userId)
        .order('saved_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(d => ({ ...d.social_stories, savedAt: d.saved_at })) || [];
    } catch (error) {
      console.error('Error getting saved stories:', error);
    }
  }
  
  // Get local saved
  const savedIds = getLocalSavedStories();
  const localStories = getLocalStories();
  return savedIds.map(id => localStories[id]).filter(Boolean);
};

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

export default {
  findExistingStory,
  generateStory,
  getPopularStories,
  searchStories,
  getStoryById,
  saveStoryToFavorites,
  removeStoryFromFavorites,
  getUserSavedStories,
  SUGGESTED_TOPICS,
  GENERATION_STATUS,
};
