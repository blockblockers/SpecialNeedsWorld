// coloringBook.js - Coloring Book service
// Manages coloring pages and user colorings

import { supabase, isSupabaseConfigured } from './supabase';

// ============================================
// LOCAL STORAGE
// ============================================

const LOCAL_COLORINGS_KEY = 'snw_colorings';

const getLocalColorings = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_COLORINGS_KEY) || '{}');
  } catch {
    return {};
  }
};

const saveLocalColoring = (pageId, coloredSvg) => {
  const colorings = getLocalColorings();
  colorings[pageId] = {
    colored_svg: coloredSvg,
    updated_at: new Date().toISOString(),
  };
  localStorage.setItem(LOCAL_COLORINGS_KEY, JSON.stringify(colorings));
};

// ============================================
// CATEGORIES
// ============================================

export const CATEGORIES = [
  { id: 'all', name: 'All', emoji: '🎨', color: '#8E6BBF' },
  { id: 'animals', name: 'Animals', emoji: '🐾', color: '#5CB85C' },
  { id: 'nature', name: 'Nature', emoji: '🌸', color: '#E86B9A' },
  { id: 'vehicles', name: 'Vehicles', emoji: '🚗', color: '#4A9FD4' },
  { id: 'food', name: 'Food', emoji: '🍎', color: '#E63B2E' },
  { id: 'fantasy', name: 'Fantasy', emoji: '🦄', color: '#8E6BBF' },
  { id: 'shapes', name: 'Shapes', emoji: '⭐', color: '#F5A623' },
  { id: 'holidays', name: 'Holidays', emoji: '🎄', color: '#5CB85C' },
  { id: 'people', name: 'People', emoji: '👨‍👩‍👧', color: '#F5A623' },
];

// ============================================
// COLOR PALETTE
// ============================================

export const COLOR_PALETTE = [
  // Row 1: Basics
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
  { name: 'Gray', hex: '#9E9E9E' },
  
  // Row 2: Reds & Pinks
  { name: 'Red', hex: '#F44336' },
  { name: 'Pink', hex: '#E91E63' },
  { name: 'Light Pink', hex: '#FCE4EC' },
  
  // Row 3: Oranges & Yellows
  { name: 'Orange', hex: '#FF9800' },
  { name: 'Yellow', hex: '#FFEB3B' },
  { name: 'Light Yellow', hex: '#FFFDE7' },
  
  // Row 4: Greens
  { name: 'Green', hex: '#4CAF50' },
  { name: 'Light Green', hex: '#8BC34A' },
  { name: 'Mint', hex: '#E8F5E9' },
  
  // Row 5: Blues
  { name: 'Blue', hex: '#2196F3' },
  { name: 'Light Blue', hex: '#03A9F4' },
  { name: 'Sky Blue', hex: '#E3F2FD' },
  
  // Row 6: Purples
  { name: 'Purple', hex: '#9C27B0' },
  { name: 'Lavender', hex: '#E1BEE7' },
  { name: 'Indigo', hex: '#3F51B5' },
  
  // Row 7: Browns & Skin tones
  { name: 'Brown', hex: '#795548' },
  { name: 'Tan', hex: '#D7CCC8' },
  { name: 'Peach', hex: '#FFCCBC' },
];

// ============================================
// GET COLORING PAGES
// ============================================

/**
 * Get all coloring pages, optionally filtered by category
 */
export const getColoringPages = async (category = 'all', limit = 20) => {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from('coloring_pages')
        .select('*')
        .eq('is_public', true)
        .order('use_count', { ascending: false })
        .limit(limit);
      
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching coloring pages:', error);
    }
  }
  
  // Return empty array if no Supabase
  return [];
};

/**
 * Get a single coloring page by ID
 */
export const getColoringPageById = async (pageId) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('coloring_pages')
        .select('*')
        .eq('id', pageId)
        .single();
      
      if (error) throw error;
      
      // Increment use count
      await supabase.rpc('increment_coloring_page_use', { p_page_id: pageId });
      
      return data;
    } catch (error) {
      console.error('Error fetching coloring page:', error);
    }
  }
  return null;
};

/**
 * Search coloring pages
 */
export const searchColoringPages = async (query, limit = 20) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .rpc('search_coloring_pages', { p_query: query, p_limit: limit });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching coloring pages:', error);
    }
  }
  return [];
};

// ============================================
// USER COLORINGS
// ============================================

/**
 * Save user's coloring progress
 */
export const saveUserColoring = async (userId, pageId, coloredSvg, isComplete = false) => {
  // Save locally first
  saveLocalColoring(pageId, coloredSvg);
  
  if (isSupabaseConfigured() && userId) {
    try {
      const { error } = await supabase
        .from('user_colorings')
        .upsert({
          user_id: userId,
          page_id: pageId,
          colored_svg: coloredSvg,
          is_complete: isComplete,
        }, {
          onConflict: 'user_id,page_id'
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving coloring:', error);
    }
  }
  return true; // Local save succeeded
};

/**
 * Get user's coloring for a page
 */
export const getUserColoring = async (userId, pageId) => {
  // Check cloud first
  if (isSupabaseConfigured() && userId) {
    try {
      const { data, error } = await supabase
        .from('user_colorings')
        .select('*')
        .eq('user_id', userId)
        .eq('page_id', pageId)
        .single();
      
      if (data) return data;
    } catch (error) {
      // Not found or error, check local
    }
  }
  
  // Check local
  const localColorings = getLocalColorings();
  return localColorings[pageId] || null;
};

/**
 * Get all user's colorings
 */
export const getUserColorings = async (userId) => {
  if (isSupabaseConfigured() && userId) {
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
    }
  }
  return [];
};

// ============================================
// AI GENERATION
// ============================================

/**
 * Generate a new coloring page using AI
 */
export const generateColoringPage = async (prompt, options = {}) => {
  const { userId = null, category = 'general' } = options;
  
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.functions.invoke('generate-coloring-page', {
        body: {
          prompt,
          category,
        },
      });
      
      if (error) throw error;
      
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
            created_by: userId,
            is_public: true,
          })
          .select()
          .single();
        
        if (saveError) throw saveError;
        return savedPage;
      }
      
      return data;
    } catch (error) {
      console.error('Error generating coloring page:', error);
      throw error;
    }
  }
  
  throw new Error('Supabase not configured');
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
};
