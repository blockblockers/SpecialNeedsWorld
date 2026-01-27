// coloringBook.js - Coloring Book service with FIXED auth for Edge Functions
// FIXED: Explicit session check and token refresh before Edge Function calls

import { supabase, isSupabaseConfigured } from './supabase';

// ============================================
// CONSTANTS
// ============================================

export const CATEGORIES = [
  { id: 'animals', name: 'Animals', emoji: '🐾', color: '#F5A623' },
  { id: 'nature', name: 'Nature', emoji: '🌸', color: '#5CB85C' },
  { id: 'vehicles', name: 'Vehicles', emoji: '🚗', color: '#4A9FD4' },
  { id: 'food', name: 'Food', emoji: '🍎', color: '#E63B2E' },
  { id: 'shapes', name: 'Shapes', emoji: '⭐', color: '#8E6BBF' },
  { id: 'characters', name: 'Characters', emoji: '🤖', color: '#E86B9A' },
  { id: 'seasons', name: 'Seasons', emoji: '🌈', color: '#20B2AA' },
  { id: 'general', name: 'General', emoji: '🎨', color: '#F8D14A' },
];

export const COLOR_PALETTE = [
  '#E63B2E', // Red
  '#F5A623', // Orange
  '#F8D14A', // Yellow
  '#5CB85C', // Green
  '#4A9FD4', // Blue
  '#8E6BBF', // Purple
  '#E86B9A', // Pink
  '#20B2AA', // Teal
  '#6B4423', // Brown
  '#2C3E50', // Dark Blue
  '#FFFFFF', // White
  '#000000', // Black
];

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
// FETCH COLORING PAGES
// ============================================

export const getColoringPages = async (category = null, limit = 20) => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    let query = supabase
      .from('coloring_pages')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching coloring pages:', error);
    return [];
  }
};

export const getColoringPageById = async (pageId) => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('coloring_pages')
      .select('*')
      .eq('id', pageId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching coloring page:', error);
    return null;
  }
};

export const searchColoringPages = async (query, limit = 10) => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('coloring_pages')
      .select('*')
      .eq('is_public', true)
      .ilike('title', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching coloring pages:', error);
    return [];
  }
};

// ============================================
// SAVE/LOAD USER COLORING
// ============================================

export const saveUserColoring = async (pageId, userId, colorData) => {
  if (!isSupabaseConfigured()) {
    // Save locally
    const key = `coloring_${userId}_${pageId}`;
    localStorage.setItem(key, JSON.stringify({
      pageId,
      colorData,
      updatedAt: new Date().toISOString(),
    }));
    return { success: true };
  }

  try {
    const { data, error } = await supabase
      .from('user_colorings')
      .upsert({
        user_id: userId,
        page_id: pageId,
        color_data: colorData,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,page_id',
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving coloring:', error);
    return { success: false, error };
  }
};

export const getUserColoring = async (pageId, userId) => {
  if (!isSupabaseConfigured()) {
    const key = `coloring_${userId}_${pageId}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  }

  try {
    const { data, error } = await supabase
      .from('user_colorings')
      .select('*')
      .eq('user_id', userId)
      .eq('page_id', pageId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user coloring:', error);
    return null;
  }
};

export const getUserColorings = async (userId) => {
  if (!isSupabaseConfigured()) {
    // Get all local colorings for this user
    const colorings = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`coloring_${userId}_`)) {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        colorings.push(data);
      }
    }
    return colorings;
  }

  try {
    const { data, error } = await supabase
      .from('user_colorings')
      .select(`
        *,
        coloring_pages (*)
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user colorings:', error);
    return [];
  }
};

// ============================================
// AI GENERATION - FIXED WITH AUTH CHECK
// ============================================

/**
 * Generate a new coloring page using AI
 */
export const generateColoringPage = async (prompt, options = {}) => {
  const { userId = null, category = 'general' } = options;
  
  if (!isSupabaseConfigured()) {
    throw new Error('Database not configured. Cannot generate coloring pages offline.');
  }

  // FIXED: Ensure we have a valid session before calling Edge Function
  const session = await getValidSession();
  
  if (!session) {
    throw new Error('Authentication required. Please sign in to generate coloring pages.');
  }

  try {
    const { data, error } = await supabase.functions.invoke('generate-coloring-page', {
      body: {
        prompt,
        category,
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
    
    // Save to database
    if (data?.svg_content) {
      const { data: savedPage, error: saveError } = await supabase
        .from('coloring_pages')
        .insert({
          title: prompt,
          title_normalized: prompt.toLowerCase().trim(),
          description: `AI generated: ${prompt}`,
          category,
          svg_content: data.svg_content,
          is_ai_generated: true,
          generation_prompt: prompt,
          created_by: userId || session.user.id,
          is_public: true,
        })
        .select()
        .single();
      
      if (saveError) {
        console.error('Error saving coloring page:', saveError);
        // Return the generated page even if save fails
        return {
          id: `temp_${Date.now()}`,
          title: prompt,
          svg_content: data.svg_content,
          category,
          is_ai_generated: true,
          created_at: new Date().toISOString(),
        };
      }
      
      return savedPage;
    }
    
    return data;
  } catch (error) {
    console.error('Error generating coloring page:', error);
    throw error;
  }
};

// ============================================
// INCREMENT VIEW/USE COUNT
// ============================================

export const incrementPageViewCount = async (pageId) => {
  if (!isSupabaseConfigured()) return;

  try {
    await supabase.rpc('increment_coloring_page_view', { page_id: pageId });
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
};

export default {
  CATEGORIES,
  COLOR_PALETTE,
  getColoringPages,
  getColoringPageById,
  searchColoringPages,
  saveUserColoring,
  getUserColoring,
  getUserColorings,
  generateColoringPage,
  incrementPageViewCount,
};
