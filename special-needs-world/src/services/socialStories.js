// socialStories.js - Social Stories generation and management
// Uses Claude API to generate stories, Supabase to store them

import { supabase, isSupabaseConfigured } from './supabase';

// ============================================
// CONFIGURATION
// ============================================

const STORY_PAGES = 6; // Number of pages per story
const CHARACTER_STYLES = {
  child: 'friendly cartoon child with big eyes',
  teen: 'friendly cartoon teenager',
  adult: 'friendly cartoon adult',
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
 * Generate a social story using Claude API
 * This calls the Supabase Edge Function which calls Claude
 */
export const generateStory = async (topic, options = {}) => {
  const {
    characterName = 'Sam',
    ageGroup = 'child',
    userId = null,
  } = options;
  
  // First check if a similar story exists
  const existing = await findExistingStory(topic);
  if (existing) {
    return {
      story: existing,
      fromCache: true,
    };
  }
  
  // Generate new story
  if (isSupabaseConfigured()) {
    try {
      // Call Edge Function to generate story
      const { data, error } = await supabase.functions.invoke('generate-social-story', {
        body: {
          topic,
          characterName,
          ageGroup,
          pageCount: STORY_PAGES,
        },
      });
      
      if (error) throw error;
      
      // Save to database
      const { data: savedStory, error: saveError } = await supabase
        .from('social_stories')
        .insert({
          topic,
          topic_normalized: topic.toLowerCase().trim(),
          pages: data.pages,
          character_name: characterName,
          created_by: userId,
          is_public: true,
        })
        .select()
        .single();
      
      if (saveError) throw saveError;
      
      return {
        story: savedStory,
        fromCache: false,
      };
    } catch (error) {
      console.error('Error generating story:', error);
      // Fall back to local generation
    }
  }
  
  // Local fallback - generate a simple template story
  const story = generateLocalStory(topic, characterName);
  saveLocalStory(story);
  
  return {
    story,
    fromCache: false,
  };
};

/**
 * Generate a simple template story locally (fallback)
 */
const generateLocalStory = (topic, characterName = 'Sam') => {
  const id = `local_${Date.now()}`;
  
  // Generic template pages
  const pages = [
    {
      pageNumber: 1,
      text: `Sometimes ${characterName} needs to do ${topic}.`,
      imageDescription: `A friendly child thinking about ${topic}`,
    },
    {
      pageNumber: 2,
      text: `${characterName} knows that ${topic} is something important.`,
      imageDescription: `A child preparing for ${topic}`,
    },
    {
      pageNumber: 3,
      text: `First, ${characterName} gets ready. It's good to be prepared!`,
      imageDescription: `A child getting ready, looking confident`,
    },
    {
      pageNumber: 4,
      text: `${characterName} takes it one step at a time. There's no rush.`,
      imageDescription: `A child taking a first step, calm and focused`,
    },
    {
      pageNumber: 5,
      text: `If ${characterName} feels nervous, that's okay. Deep breaths help!`,
      imageDescription: `A child taking a deep breath, feeling calm`,
    },
    {
      pageNumber: 6,
      text: `${characterName} did it! ${topic} wasn't so bad after all.`,
      imageDescription: `A proud, happy child celebrating`,
    },
  ];
  
  return {
    id,
    topic,
    topic_normalized: topic.toLowerCase().trim(),
    pages,
    character_name: characterName,
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
  { topic: 'Taking a bath', emoji: '🛁' },
  { topic: 'Going to the dentist', emoji: '🦷' },
  { topic: 'Making a new friend', emoji: '👋' },
  { topic: 'Going to school', emoji: '🏫' },
  { topic: 'Visiting the doctor', emoji: '👨‍⚕️' },
  { topic: 'Getting a haircut', emoji: '💇' },
  { topic: 'Going to the grocery store', emoji: '🛒' },
  { topic: 'Taking turns', emoji: '🔄' },
  { topic: 'Waiting patiently', emoji: '⏰' },
  { topic: 'Trying new food', emoji: '🍽️' },
  { topic: 'Wearing different clothes', emoji: '👕' },
  { topic: 'Sleeping in my own bed', emoji: '🛏️' },
  { topic: 'Using the bathroom', emoji: '🚽' },
  { topic: 'Riding in the car', emoji: '🚗' },
  { topic: 'Going to a birthday party', emoji: '🎂' },
  { topic: 'Fire drill at school', emoji: '🔔' },
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
};
