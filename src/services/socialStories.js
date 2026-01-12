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
  const topicLower = topic.toLowerCase();
  
  // Check for pre-built stories first
  const prebuilt = PREBUILT_STORIES[topicLower];
  if (prebuilt) {
    return {
      id,
      topic,
      topic_normalized: topicLower,
      pages: prebuilt.map((page, idx) => ({
        ...page,
        pageNumber: idx + 1,
        text: page.text.replace(/\{name\}/g, characterName),
      })),
      character_name: characterName,
      is_public: false,
      use_count: 1,
      created_at: new Date().toISOString(),
    };
  }
  
  // Find topic emoji
  const topicData = SUGGESTED_TOPICS.find(t => t.topic.toLowerCase() === topicLower);
  const topicEmoji = topicData?.emoji || '📖';
  
  // Generic template pages with appropriate emojis
  const pages = [
    {
      pageNumber: 1,
      text: `Sometimes ${characterName} needs to do ${topic}.`,
      imageDescription: `A friendly child thinking about ${topic}`,
      emoji: '💭',
    },
    {
      pageNumber: 2,
      text: `${characterName} knows that ${topic} is something important.`,
      imageDescription: `A child preparing for ${topic}`,
      emoji: topicEmoji,
    },
    {
      pageNumber: 3,
      text: `First, ${characterName} gets ready. It's good to be prepared!`,
      imageDescription: `A child getting ready, looking confident`,
      emoji: '✅',
    },
    {
      pageNumber: 4,
      text: `${characterName} takes it one step at a time. There's no rush.`,
      imageDescription: `A child taking a first step, calm and focused`,
      emoji: '👣',
    },
    {
      pageNumber: 5,
      text: `If ${characterName} feels nervous, that's okay. Deep breaths help!`,
      imageDescription: `A child taking a deep breath, feeling calm`,
      emoji: '🌬️',
    },
    {
      pageNumber: 6,
      text: `${characterName} did it! ${topic} wasn't so bad after all.`,
      imageDescription: `A proud, happy child celebrating`,
      emoji: '🎉',
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
// PRE-BUILT STORIES (High Quality)
// ============================================

const PREBUILT_STORIES = {
  'going to the dentist': [
    {
      text: '{name} has a dentist appointment today.',
      imageDescription: 'A calendar with a dentist appointment circled',
      emoji: '📅',
    },
    {
      text: 'The dentist office has a waiting room with chairs and toys.',
      imageDescription: 'A friendly waiting room with colorful chairs',
      emoji: '🏥',
    },
    {
      text: 'A nice dentist will look at {name}\'s teeth with a tiny mirror.',
      imageDescription: 'A smiling dentist holding a small dental mirror',
      emoji: '🦷',
    },
    {
      text: '{name} opens wide and says "Ahh!" This helps the dentist see.',
      imageDescription: 'A child sitting in a dentist chair with mouth open',
      emoji: '😮',
    },
    {
      text: 'The dentist counts {name}\'s teeth. It doesn\'t hurt!',
      imageDescription: 'Dentist counting teeth, child looking calm',
      emoji: '🔢',
    },
    {
      text: '{name} did great! Healthy teeth make {name} smile.',
      imageDescription: 'A happy child showing off a big smile',
      emoji: '😁',
    },
  ],
  
  'getting a haircut': [
    {
      text: '{name}\'s hair is getting long. Time for a haircut!',
      imageDescription: 'A child looking at their long hair in a mirror',
      emoji: '👀',
    },
    {
      text: 'The hair salon has special chairs that go up and down.',
      imageDescription: 'A barber chair in a friendly salon',
      emoji: '💈',
    },
    {
      text: 'A cape goes around {name} to keep the hair off clothes.',
      imageDescription: 'Child wearing a colorful cape in salon chair',
      emoji: '🧥',
    },
    {
      text: 'The scissors go "snip snip." It doesn\'t hurt at all!',
      imageDescription: 'Hairdresser carefully cutting hair with scissors',
      emoji: '✂️',
    },
    {
      text: '{name} can look in the mirror and watch.',
      imageDescription: 'Child watching their reflection during haircut',
      emoji: '🪞',
    },
    {
      text: 'All done! {name} looks great with a fresh haircut.',
      imageDescription: 'Happy child with a new haircut',
      emoji: '💇',
    },
  ],
  
  'visiting the doctor': [
    {
      text: '{name} is going to visit the doctor today.',
      imageDescription: 'A child getting ready to leave for the doctor',
      emoji: '🏥',
    },
    {
      text: 'The doctor\'s office has a waiting room with books and toys.',
      imageDescription: 'A colorful waiting room with books',
      emoji: '📚',
    },
    {
      text: 'A nurse will check {name}\'s height and weight.',
      imageDescription: 'A nurse measuring a child on a scale',
      emoji: '📏',
    },
    {
      text: 'The doctor uses a stethoscope to hear {name}\'s heart. Thump thump!',
      imageDescription: 'Doctor with stethoscope, child sitting calmly',
      emoji: '💓',
    },
    {
      text: 'The doctor looks in {name}\'s ears, eyes, and mouth. "Say Ahh!"',
      imageDescription: 'Doctor examining child with otoscope',
      emoji: '👨‍⚕️',
    },
    {
      text: '{name} was brave! The doctor helps keep {name} healthy.',
      imageDescription: 'Doctor and child giving high-five',
      emoji: '🌟',
    },
  ],
  
  'taking a bath': [
    {
      text: 'It\'s bath time for {name}!',
      imageDescription: 'A bathtub filling up with warm water',
      emoji: '🛁',
    },
    {
      text: '{name} can test the water to make sure it\'s just right.',
      imageDescription: 'A hand testing the water temperature',
      emoji: '🌡️',
    },
    {
      text: 'Bubbles and toys make bath time fun!',
      imageDescription: 'Bubbles and rubber duck in bathtub',
      emoji: '🫧',
    },
    {
      text: '{name} washes with soap. It smells nice!',
      imageDescription: 'Child washing with colorful soap',
      emoji: '🧼',
    },
    {
      text: 'Rinse off all the soap and bubbles. Splash splash!',
      imageDescription: 'Water splashing gently',
      emoji: '💦',
    },
    {
      text: 'All clean! {name} dries off with a fluffy towel.',
      imageDescription: 'Child wrapped in a cozy towel, smiling',
      emoji: '✨',
    },
  ],
  
  'going to school': [
    {
      text: 'Today {name} is going to school!',
      imageDescription: 'Backpack and school supplies ready',
      emoji: '🎒',
    },
    {
      text: '{name} says goodbye to family. "See you later!"',
      imageDescription: 'Child waving goodbye at the door',
      emoji: '👋',
    },
    {
      text: 'School has a classroom with tables and chairs.',
      imageDescription: 'A bright, colorful classroom',
      emoji: '🏫',
    },
    {
      text: '{name}\'s teacher is kind and helps everyone learn.',
      imageDescription: 'A smiling teacher at the front of class',
      emoji: '👩‍🏫',
    },
    {
      text: '{name} can play and make friends at recess!',
      imageDescription: 'Children playing together on playground',
      emoji: '🤝',
    },
    {
      text: 'School is over! {name} learned new things today.',
      imageDescription: 'Happy child walking home with backpack',
      emoji: '🌟',
    },
  ],
  
  'making a new friend': [
    {
      text: '{name} sees someone new at the playground.',
      imageDescription: 'Two children at a playground, one waving',
      emoji: '👀',
    },
    {
      text: '{name} walks over and says "Hi! My name is {name}."',
      imageDescription: 'Child smiling and waving hello',
      emoji: '👋',
    },
    {
      text: '"What\'s your name? Do you want to play?"',
      imageDescription: 'Two children talking to each other',
      emoji: '💬',
    },
    {
      text: 'Friends take turns and share toys.',
      imageDescription: 'Two children sharing a toy together',
      emoji: '🔄',
    },
    {
      text: 'Friends are kind to each other and have fun together.',
      imageDescription: 'Two children laughing and playing',
      emoji: '😊',
    },
    {
      text: '{name} made a new friend today! Friends make life better.',
      imageDescription: 'Two children holding hands, smiling',
      emoji: '💝',
    },
  ],
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
