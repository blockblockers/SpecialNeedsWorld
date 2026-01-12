// knowledgeResources.js - Knowledge Resources service
// Manages federal and state special needs information

import { supabase, isSupabaseConfigured } from './supabase';

// ============================================
// STATIC DATA (Fallback)
// ============================================

export const REGIONS = [
  { id: 'federal', name: 'Federal (U.S.)', abbreviation: 'US', type: 'federal', emoji: '🇺🇸', is_active: true },
  { id: 'california', name: 'California', abbreviation: 'CA', type: 'state', emoji: '🌴', is_active: true },
  { id: 'texas', name: 'Texas', abbreviation: 'TX', type: 'state', emoji: '⭐', is_active: false },
  { id: 'florida', name: 'Florida', abbreviation: 'FL', type: 'state', emoji: '🌴', is_active: false },
  { id: 'new-york', name: 'New York', abbreviation: 'NY', type: 'state', emoji: '🗽', is_active: false },
];

export const CATEGORIES = [
  { id: 'laws', name: 'Laws & Regulations', emoji: '⚖️', color: '#8E6BBF' },
  { id: 'services', name: 'Services & Programs', emoji: '🏥', color: '#5CB85C' },
  { id: 'education', name: 'Education & IEP', emoji: '🎓', color: '#4A9FD4' },
  { id: 'rights', name: 'Parent & Child Rights', emoji: '✊', color: '#E63B2E' },
  { id: 'resources', name: 'Resources & Contacts', emoji: '📞', color: '#F5A623' },
  { id: 'funding', name: 'Funding & Financial', emoji: '💰', color: '#5CB85C' },
  { id: 'transition', name: 'Transition Planning', emoji: '🎯', color: '#4A9FD4' },
];

// ============================================
// GET REGIONS
// ============================================

/**
 * Get all available regions
 */
export const getRegions = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('knowledge_regions')
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      return data || REGIONS;
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  }
  return REGIONS;
};

/**
 * Get active regions (states with content)
 */
export const getActiveRegions = async () => {
  const regions = await getRegions();
  return regions.filter(r => r.is_active);
};

/**
 * Get a single region by ID
 */
export const getRegionById = async (regionId) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('knowledge_regions')
        .select('*')
        .eq('id', regionId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching region:', error);
    }
  }
  return REGIONS.find(r => r.id === regionId);
};

// ============================================
// GET CATEGORIES
// ============================================

/**
 * Get all categories
 */
export const getCategories = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('knowledge_categories')
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      return data || CATEGORIES;
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
  return CATEGORIES;
};

// ============================================
// GET ARTICLES
// ============================================

/**
 * Get articles by region
 */
export const getArticlesByRegion = async (regionId, categoryId = null) => {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from('knowledge_articles')
        .select('id, region_id, category_id, title, slug, summary, has_state_differences, tags')
        .eq('region_id', regionId)
        .eq('is_published', true)
        .order('title');
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  }
  return [];
};

/**
 * Get a single article by slug
 */
export const getArticleBySlug = async (regionId, slug) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('knowledge_articles')
        .select('*')
        .eq('region_id', regionId)
        .eq('slug', slug)
        .eq('is_published', true)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching article:', error);
    }
  }
  return null;
};

/**
 * Get article by ID
 */
export const getArticleById = async (articleId) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('knowledge_articles')
        .select('*')
        .eq('id', articleId)
        .eq('is_published', true)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching article:', error);
    }
  }
  return null;
};

// ============================================
// SEARCH
// ============================================

/**
 * Search knowledge base
 */
export const searchKnowledge = async (query, regionId = null) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .rpc('search_knowledge', { 
          p_query: query, 
          p_region_id: regionId,
          p_limit: 20 
        });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching knowledge:', error);
    }
  }
  return [];
};

// ============================================
// GLOSSARY
// ============================================

/**
 * Get glossary terms
 */
export const getGlossaryTerms = async (regionId = null) => {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from('knowledge_glossary')
        .select('*')
        .order('term');
      
      if (regionId) {
        query = query.or(`region_id.is.null,region_id.eq.${regionId}`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching glossary:', error);
    }
  }
  return [];
};

/**
 * Get a single glossary term
 */
export const getGlossaryTerm = async (term) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('knowledge_glossary')
        .select('*')
        .ilike('term', term)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching glossary term:', error);
    }
  }
  return null;
};

export default {
  REGIONS,
  CATEGORIES,
  getRegions,
  getActiveRegions,
  getRegionById,
  getCategories,
  getArticlesByRegion,
  getArticleBySlug,
  getArticleById,
  searchKnowledge,
  getGlossaryTerms,
  getGlossaryTerm,
};
