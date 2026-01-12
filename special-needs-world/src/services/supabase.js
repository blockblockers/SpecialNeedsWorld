/**
 * Supabase Client Configuration
 * 
 * This file initializes the Supabase client for use throughout the app.
 * 
 * Setup:
 * 1. Create a .env file in the project root
 * 2. Add your Supabase credentials:
 *    VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
 *    VITE_SUPABASE_ANON_KEY=your-anon-key-here
 * 
 * Find these values in:
 * Supabase Dashboard > Settings > API
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not found. Running in offline/local mode.\n' +
    'To enable cloud sync, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

// Create Supabase client (will be null if credentials missing)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: localStorage,
        storageKey: 'snw-auth-token',
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabase !== null;
};

// Auth helper functions
export const auth = {
  /**
   * Sign up with email and password
   */
  async signUp(email, password, displayName) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName,
        },
      },
    });
    
    return { data, error };
  },

  /**
   * Sign in with email and password
   */
  async signIn(email, password) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  },

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle() {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/hub`,
      },
    });
    
    return { data, error };
  },

  /**
   * Sign in with Apple (for iOS)
   */
  async signInWithApple() {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/hub`,
      },
    });
    
    return { data, error };
  },

  /**
   * Sign out
   */
  async signOut() {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  /**
   * Get current session
   */
  async getSession() {
    if (!supabase) return { data: { session: null }, error: null };
    
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  /**
   * Get current user
   */
  async getUser() {
    if (!supabase) return { data: { user: null }, error: null };
    
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },

  /**
   * Listen for auth state changes
   */
  onAuthStateChange(callback) {
    if (!supabase) return { data: { subscription: null } };
    
    return supabase.auth.onAuthStateChange(callback);
  },

  /**
   * Reset password
   */
  async resetPassword(email) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    return { data, error };
  },

  /**
   * Update password
   */
  async updatePassword(newPassword) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    return { data, error };
  },
};

// Storage helper for file uploads
export const storage = {
  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(bucket, path, file, options = {}) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        ...options,
      });
    
    return { data, error };
  },

  /**
   * Get public URL for a file
   */
  getPublicUrl(bucket, path) {
    if (!supabase) return null;
    
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data?.publicUrl;
  },

  /**
   * Delete a file from storage
   */
  async deleteFile(bucket, path) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    return { data, error };
  },

  /**
   * List files in a bucket/folder
   */
  async listFiles(bucket, folder = '') {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder);
    
    return { data, error };
  },
};

export default supabase;
