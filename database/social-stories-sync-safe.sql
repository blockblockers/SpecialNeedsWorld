-- Social Stories Database Schema (SAFE VERSION)
-- Drops existing policies/functions before recreating
-- Run this if you get "already exists" errors

-- ============================================
-- DROP EXISTING POLICIES (if any)
-- ============================================

DROP POLICY IF EXISTS "Anyone can view public stories" ON social_stories;
DROP POLICY IF EXISTS "Users can view own stories" ON social_stories;
DROP POLICY IF EXISTS "Authenticated users can create stories" ON social_stories;
DROP POLICY IF EXISTS "Users can update own stories" ON social_stories;
DROP POLICY IF EXISTS "Users can delete own stories" ON social_stories;

DROP POLICY IF EXISTS "Users can view own saved stories" ON user_saved_stories;
DROP POLICY IF EXISTS "Users can save stories" ON user_saved_stories;
DROP POLICY IF EXISTS "Users can update own saved stories" ON user_saved_stories;
DROP POLICY IF EXISTS "Users can unsave stories" ON user_saved_stories;

-- ============================================
-- DROP EXISTING FUNCTIONS (if any)
-- ============================================

DROP FUNCTION IF EXISTS get_popular_stories(INTEGER);
DROP FUNCTION IF EXISTS search_stories(TEXT, INTEGER);
DROP FUNCTION IF EXISTS update_social_stories_timestamp();

-- ============================================
-- DROP EXISTING TRIGGERS (if any)
-- ============================================

DROP TRIGGER IF EXISTS social_stories_updated ON social_stories;

-- ============================================
-- CREATE TABLES (IF NOT EXISTS)
-- ============================================

-- Stores generated stories - can be reused by other users
CREATE TABLE IF NOT EXISTS social_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Story content
  topic TEXT NOT NULL,
  topic_normalized TEXT NOT NULL,
  pages JSONB NOT NULL,
  character_name TEXT DEFAULT 'Sam',
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT TRUE,
  use_count INTEGER DEFAULT 1,
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for users to save/favorite stories
CREATE TABLE IF NOT EXISTS user_saved_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  story_id UUID REFERENCES social_stories(id) ON DELETE CASCADE NOT NULL,
  
  -- Personalization
  custom_character_name TEXT,
  notes TEXT,
  times_read INTEGER DEFAULT 0,
  
  -- Metadata
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ,
  
  UNIQUE(user_id, story_id)
);

-- ============================================
-- ENABLE RLS
-- ============================================

ALTER TABLE social_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_stories ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE POLICIES - social_stories
-- ============================================

CREATE POLICY "Anyone can view public stories"
  ON social_stories FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view own stories"
  ON social_stories FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can create stories"
  ON social_stories FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own stories"
  ON social_stories FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own stories"
  ON social_stories FOR DELETE
  USING (auth.uid() = created_by);

-- ============================================
-- CREATE POLICIES - user_saved_stories
-- ============================================

CREATE POLICY "Users can view own saved stories"
  ON user_saved_stories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save stories"
  ON user_saved_stories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved stories"
  ON user_saved_stories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unsave stories"
  ON user_saved_stories FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CREATE INDEXES (IF NOT EXISTS)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_social_stories_topic ON social_stories(topic_normalized);
CREATE INDEX IF NOT EXISTS idx_social_stories_public ON social_stories(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_social_stories_use_count ON social_stories(use_count DESC);
CREATE INDEX IF NOT EXISTS idx_social_stories_created_by ON social_stories(created_by);

CREATE INDEX IF NOT EXISTS idx_user_saved_stories_user ON user_saved_stories(user_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_stories_story ON user_saved_stories(story_id);

-- ============================================
-- CREATE FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION get_popular_stories(p_limit INTEGER DEFAULT 10)
RETURNS SETOF social_stories
LANGUAGE sql
STABLE
AS $$
  SELECT *
  FROM social_stories
  WHERE is_public = true
  ORDER BY use_count DESC, created_at DESC
  LIMIT p_limit;
$$;

CREATE OR REPLACE FUNCTION search_stories(p_query TEXT, p_limit INTEGER DEFAULT 10)
RETURNS SETOF social_stories
LANGUAGE sql
STABLE
AS $$
  SELECT *
  FROM social_stories
  WHERE is_public = true
    AND (
      topic_normalized ILIKE '%' || lower(p_query) || '%'
      OR topic ILIKE '%' || p_query || '%'
    )
  ORDER BY 
    CASE WHEN topic_normalized = lower(p_query) THEN 0 ELSE 1 END,
    use_count DESC
  LIMIT p_limit;
$$;

-- ============================================
-- CREATE TRIGGER FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION update_social_stories_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER social_stories_updated
  BEFORE UPDATE ON social_stories
  FOR EACH ROW
  EXECUTE FUNCTION update_social_stories_timestamp();

-- ============================================
-- GRANTS
-- ============================================

GRANT ALL ON social_stories TO authenticated;
GRANT ALL ON user_saved_stories TO authenticated;
GRANT EXECUTE ON FUNCTION get_popular_stories TO authenticated;
GRANT EXECUTE ON FUNCTION search_stories TO authenticated;

-- ============================================
-- DONE!
-- ============================================
-- Tables: social_stories, user_saved_stories
-- Policies: 9 total (5 + 4)
-- Functions: get_popular_stories, search_stories
-- Indexes: 6 total
