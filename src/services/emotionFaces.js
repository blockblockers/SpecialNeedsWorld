// emotionFaces.js - Service for managing AI-generated emotion faces
// Faces are shared across all users to build a community library
// Falls back to ARASAAC pictograms if no AI faces available

import { supabase, isSupabaseConfigured } from './supabase';
import { getPictogramUrl } from './arasaac';

// ============================================
// CONSTANTS
// ============================================

// The 12 emotions used in the game
export const EMOTIONS = [
  { id: 'happy', word: 'Happy', color: '#F8D14A', description: 'feeling good and joyful', arasaacId: 26684 },
  { id: 'sad', word: 'Sad', color: '#4A9FD4', description: 'feeling unhappy or down', arasaacId: 11321 },
  { id: 'angry', word: 'Angry', color: '#E63B2E', description: 'feeling mad or upset', arasaacId: 11318 },
  { id: 'scared', word: 'Scared', color: '#8E6BBF', description: 'feeling afraid or worried', arasaacId: 6459 },
  { id: 'surprised', word: 'Surprised', color: '#F5A623', description: 'feeling amazed or shocked', arasaacId: 11326 },
  { id: 'tired', word: 'Tired', color: '#6B7280', description: 'feeling sleepy or worn out', arasaacId: 11950 },
  { id: 'excited', word: 'Excited', color: '#E86B9A', description: 'feeling very happy and eager', arasaacId: 11319 },
  { id: 'calm', word: 'Calm', color: '#5CB85C', description: 'feeling peaceful and relaxed', arasaacId: 28753 },
  { id: 'confused', word: 'Confused', color: '#9CA3AF', description: 'not sure what is happening', arasaacId: 11322 },
  { id: 'silly', word: 'Silly', color: '#EC4899', description: 'feeling playful and funny', arasaacId: 11330 },
  { id: 'proud', word: 'Proud', color: '#10B981', description: 'feeling good about yourself', arasaacId: 11327 },
  { id: 'loved', word: 'Loved', color: '#F472B6', description: 'feeling cared for and special', arasaacId: 26790 },
];

// ============================================
// HELPER: Get valid session for Edge Function calls
// ============================================
const getValidSession = async () => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return null;
    }

    // Check if token is close to expiring (within 60 seconds)
    const expiresAt = session.expires_at;
    const now = Math.floor(Date.now() / 1000);
    
    if (expiresAt && (expiresAt - now) < 60) {
      const { data: refreshData } = await supabase.auth.refreshSession();
      return refreshData?.session || session;
    }

    return session;
  } catch (error) {
    console.error('Error in getValidSession:', error);
    return null;
  }
};

// ============================================
// GET ARASAAC FALLBACK FACES
// ============================================

/**
 * Get ARASAAC pictogram-based faces (fallback when no AI faces available)
 */
export const getArasaacFaces = () => {
  return EMOTIONS.map(emotion => ({
    id: `arasaac_${emotion.id}`,
    emotion: emotion.id,
    word: emotion.word,
    color: emotion.color,
    description: emotion.description,
    image_url: getPictogramUrl(emotion.arasaacId),
    isArasaac: true,
  }));
};

// ============================================
// GET AI-GENERATED FACES FROM DATABASE
// ============================================

/**
 * Get all available AI-generated faces from the shared library
 * @param {number} limit - Maximum number of faces to fetch
 */
export const getAIFaces = async (limit = 100) => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('emotion_faces')
      .select('id, emotion, image_url, age_group, use_count')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching AI faces:', error);
      return [];
    }

    // Add emotion metadata to each face
    return (data || []).map(face => {
      const emotionData = EMOTIONS.find(e => e.id === face.emotion);
      return {
        ...face,
        word: emotionData?.word || face.emotion,
        color: emotionData?.color || '#666666',
        description: emotionData?.description || '',
        isArasaac: false,
      };
    });
  } catch (error) {
    console.error('Error in getAIFaces:', error);
    return [];
  }
};

/**
 * Get face counts by emotion
 */
export const getFaceCounts = async () => {
  if (!isSupabaseConfigured()) {
    return {};
  }

  try {
    const { data, error } = await supabase.rpc('get_emotion_face_counts');
    
    if (error) {
      console.error('Error getting face counts:', error);
      return {};
    }

    // Convert to object
    const counts = {};
    (data || []).forEach(row => {
      counts[row.emotion] = row.count;
    });
    return counts;
  } catch (error) {
    console.error('Error in getFaceCounts:', error);
    return {};
  }
};

/**
 * Get total number of AI faces in the library
 */
export const getTotalFaceCount = async () => {
  if (!isSupabaseConfigured()) {
    return 0;
  }

  try {
    // Try using the RPC function first (more efficient)
    const { data, error } = await supabase.rpc('get_total_face_count');
    
    if (!error && data !== null) {
      return data;
    }

    // Fallback to direct count query
    const { count, error: countError } = await supabase
      .from('emotion_faces')
      .select('*', { count: 'exact', head: true })
      .eq('is_approved', true);

    if (countError) {
      console.error('Error getting total face count:', countError);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getTotalFaceCount:', error);
    return 0;
  }
};

// ============================================
// GET GAME FACES (12 shuffled faces)
// ============================================

/**
 * Get 12 faces for a game session
 * Prioritizes AI faces, falls back to ARASAAC if needed
 * Returns one face per emotion, shuffled
 */
export const getGameFaces = async () => {
  // First, try to get AI faces from database
  const aiFaces = await getAIFaces(200);
  
  // Group AI faces by emotion
  const facesByEmotion = {};
  aiFaces.forEach(face => {
    if (!facesByEmotion[face.emotion]) {
      facesByEmotion[face.emotion] = [];
    }
    facesByEmotion[face.emotion].push(face);
  });

  // Build game faces array - one per emotion
  const gameFaces = [];
  const arasaacFaces = getArasaacFaces();

  for (const emotion of EMOTIONS) {
    const availableFaces = facesByEmotion[emotion.id] || [];
    
    if (availableFaces.length > 0) {
      // Pick a random AI face for this emotion
      const randomIndex = Math.floor(Math.random() * availableFaces.length);
      gameFaces.push(availableFaces[randomIndex]);
    } else {
      // Fall back to ARASAAC
      const arasaacFace = arasaacFaces.find(f => f.emotion === emotion.id);
      if (arasaacFace) {
        gameFaces.push(arasaacFace);
      }
    }
  }

  // Shuffle the array
  return shuffleArray(gameFaces);
};

/**
 * Get a specific number of random faces (for extended play)
 * @param {number} count - Number of faces to get
 * @param {string[]} usedFaceIds - IDs of faces already used (to avoid repeats)
 */
export const getMoreFaces = async (count = 12, usedFaceIds = []) => {
  const aiFaces = await getAIFaces(200);
  
  // Filter out already used faces
  const availableFaces = aiFaces.filter(f => !usedFaceIds.includes(f.id));
  
  if (availableFaces.length < count) {
    // Not enough unused AI faces, include ARASAAC as backup
    const arasaacFaces = getArasaacFaces().filter(f => !usedFaceIds.includes(f.id));
    availableFaces.push(...arasaacFaces);
  }

  // Shuffle and take requested count
  return shuffleArray(availableFaces).slice(0, count);
};

// ============================================
// GENERATE NEW FACES
// ============================================

/**
 * Generate new AI faces by calling the Edge Function
 * @param {number} count - Number of faces to generate (default: 12)
 * @param {string[]} emotions - Specific emotions to generate (default: all 12)
 * @param {Function} onProgress - Progress callback
 */
export const generateNewFaces = async (count = 12, emotions = null, onProgress = () => {}) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Database not configured. Cannot generate faces offline.');
  }

  // Ensure we have a valid session
  const session = await getValidSession();
  
  if (!session) {
    throw new Error('Please sign in to generate new faces.');
  }

  onProgress({ status: 'starting', message: 'Starting face generation...' });

  try {
    const { data, error } = await supabase.functions.invoke('generate-emotion-faces', {
      body: {
        count,
        emotions,
      },
    });

    if (error) {
      console.error('Edge Function error:', error);
      
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        throw new Error('Session expired. Please refresh the page and try again.');
      }
      
      throw error;
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to generate faces');
    }

    onProgress({ 
      status: 'complete', 
      message: data.message,
      generated: data.generated,
      faces: data.faces,
    });

    return data;
  } catch (error) {
    console.error('Error generating faces:', error);
    onProgress({ status: 'error', message: error.message });
    throw error;
  }
};

// ============================================
// INCREMENT USE COUNT
// ============================================

/**
 * Track that a face was used in a game
 */
export const incrementFaceUseCount = async (faceId) => {
  if (!isSupabaseConfigured() || !faceId || faceId.startsWith('arasaac_')) {
    return;
  }

  try {
    await supabase.rpc('increment_face_use_count', { p_face_id: faceId });
  } catch (error) {
    console.error('Error incrementing face use count:', error);
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Preload images for faster display
 */
export const preloadFaceImages = (faces) => {
  faces.forEach(face => {
    if (face.image_url) {
      const img = new Image();
      img.src = face.image_url;
    }
  });
};

// ============================================
// EXPORTS
// ============================================

export default {
  EMOTIONS,
  getArasaacFaces,
  getAIFaces,
  getFaceCounts,
  getTotalFaceCount,
  getGameFaces,
  getMoreFaces,
  generateNewFaces,
  incrementFaceUseCount,
  preloadFaceImages,
};
