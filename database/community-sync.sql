-- Community Forum Database Schema
-- Forum for parents and individuals with special needs to connect
-- Text and links only - no images for safety

-- ============================================
-- CREATE TABLES FIRST (IF NOT EXISTS)
-- ============================================

-- Community Profiles (Avatars & Display Names)
CREATE TABLE IF NOT EXISTS community_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Display info
  display_name TEXT NOT NULL,
  avatar_id TEXT NOT NULL DEFAULT 'star',
  bio TEXT,
  
  -- Stats
  thread_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadata
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Threads
CREATE TABLE IF NOT EXISTS community_threads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Thread content
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  
  -- Stats
  reply_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  -- Status
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Replies
CREATE TABLE IF NOT EXISTS community_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID REFERENCES community_threads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Reply content
  content TEXT NOT NULL,
  
  -- Status
  is_hidden BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Reports
CREATE TABLE IF NOT EXISTS community_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- What is being reported
  thread_id UUID REFERENCES community_threads(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES community_replies(id) ON DELETE CASCADE,
  
  -- Report details
  reason TEXT NOT NULL,
  description TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending',
  reviewed_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CHECK (thread_id IS NOT NULL OR reply_id IS NOT NULL)
);

-- ============================================
-- NOW DROP AND RECREATE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Anyone can view public profiles" ON community_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON community_profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON community_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON community_profiles;

DROP POLICY IF EXISTS "Anyone can view threads" ON community_threads;
DROP POLICY IF EXISTS "Authenticated users can create threads" ON community_threads;
DROP POLICY IF EXISTS "Users can update own threads" ON community_threads;
DROP POLICY IF EXISTS "Users can delete own threads" ON community_threads;

DROP POLICY IF EXISTS "Anyone can view replies" ON community_replies;
DROP POLICY IF EXISTS "Authenticated users can create replies" ON community_replies;
DROP POLICY IF EXISTS "Users can update own replies" ON community_replies;
DROP POLICY IF EXISTS "Users can delete own replies" ON community_replies;

DROP POLICY IF EXISTS "Authenticated users can report" ON community_reports;
DROP POLICY IF EXISTS "Users can view own reports" ON community_reports;

-- ============================================
-- DROP AND RECREATE FUNCTIONS/TRIGGERS
-- ============================================

DROP FUNCTION IF EXISTS increment_thread_reply_count() CASCADE;
DROP FUNCTION IF EXISTS decrement_thread_reply_count() CASCADE;
DROP FUNCTION IF EXISTS update_thread_activity() CASCADE;

-- ============================================
-- ENABLE RLS
-- ============================================

ALTER TABLE community_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_reports ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES - Profiles
-- ============================================

CREATE POLICY "Anyone can view public profiles"
  ON community_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can create own profile"
  ON community_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON community_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- POLICIES - Threads
-- ============================================

CREATE POLICY "Anyone can view threads"
  ON community_threads FOR SELECT
  USING (is_hidden = false);

CREATE POLICY "Authenticated users can create threads"
  ON community_threads FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own threads"
  ON community_threads FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own threads"
  ON community_threads FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLICIES - Replies
-- ============================================

CREATE POLICY "Anyone can view replies"
  ON community_replies FOR SELECT
  USING (is_hidden = false);

CREATE POLICY "Authenticated users can create replies"
  ON community_replies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own replies"
  ON community_replies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own replies"
  ON community_replies FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLICIES - Reports
-- ============================================

CREATE POLICY "Authenticated users can report"
  ON community_reports FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view own reports"
  ON community_reports FOR SELECT
  USING (auth.uid() = reporter_id);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_community_profiles_user ON community_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_community_threads_user ON community_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_community_threads_category ON community_threads(category);
CREATE INDEX IF NOT EXISTS idx_community_threads_activity ON community_threads(last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_threads_created ON community_threads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_replies_thread ON community_replies(thread_id);
CREATE INDEX IF NOT EXISTS idx_community_replies_user ON community_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_community_reports_status ON community_reports(status);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update reply count on thread when reply is added
CREATE OR REPLACE FUNCTION increment_thread_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_threads 
  SET reply_count = reply_count + 1,
      last_activity_at = NOW()
  WHERE id = NEW.thread_id;
  
  -- Update user's reply count
  UPDATE community_profiles 
  SET reply_count = reply_count + 1
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_reply_created
  AFTER INSERT ON community_replies
  FOR EACH ROW
  EXECUTE FUNCTION increment_thread_reply_count();

-- Decrement reply count when reply is deleted
CREATE OR REPLACE FUNCTION decrement_thread_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_threads 
  SET reply_count = GREATEST(0, reply_count - 1)
  WHERE id = OLD.thread_id;
  
  -- Update user's reply count
  UPDATE community_profiles 
  SET reply_count = GREATEST(0, reply_count - 1)
  WHERE user_id = OLD.user_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_reply_deleted
  BEFORE DELETE ON community_replies
  FOR EACH ROW
  EXECUTE FUNCTION decrement_thread_reply_count();

-- ============================================
-- GRANTS
-- ============================================

GRANT ALL ON community_profiles TO authenticated;
GRANT ALL ON community_threads TO authenticated;
GRANT ALL ON community_replies TO authenticated;
GRANT ALL ON community_reports TO authenticated;

-- ============================================
-- DONE!
-- ============================================
-- Tables: community_profiles, community_threads, community_replies, community_reports
-- Key features:
--   - Display names and avatars (no real names required)
--   - Threads with categories
--   - Replies
--   - Report system for inappropriate content
--   - Reply counts auto-updated via triggers
