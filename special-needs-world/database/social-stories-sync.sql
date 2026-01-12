-- Social Stories Database Schema
-- Enables story generation, saving, and reuse
-- Stories are NOT PHI - they're educational content about social situations

-- ============================================
-- SOCIAL STORIES TABLE (Shared Library)
-- ============================================

-- Stores generated stories - can be reused by other users
CREATE TABLE IF NOT EXISTS social_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Story content
  topic TEXT NOT NULL,
  topic_normalized TEXT NOT NULL, -- lowercase for matching
  pages JSONB NOT NULL, -- Array of page objects
  character_name TEXT DEFAULT 'Sam',
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT TRUE, -- Allow others to use this story
  use_count INTEGER DEFAULT 1,
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE social_stories ENABLE ROW LEVEL SECURITY;

-- Anyone can view public stories
CREATE POLICY "Anyone can view public stories"
  ON social_stories FOR SELECT
  USING (is_public = true);

-- Users can view their own private stories
CREATE POLICY "Users can view own stories"
  ON social_stories FOR SELECT
  USING (auth.uid() = created_by);

-- Authenticated users can create stories
CREATE POLICY "Authenticated users can create stories"
  ON social_stories FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own stories
CREATE POLICY "Users can update own stories"
  ON social_stories FOR UPDATE
  USING (auth.uid() = created_by);

-- Users can delete their own stories
CREATE POLICY "Users can delete own stories"
  ON social_stories FOR DELETE
  USING (auth.uid() = created_by);

-- Indexes
CREATE INDEX idx_social_stories_topic ON social_stories(topic_normalized);
CREATE INDEX idx_social_stories_public ON social_stories(is_public) WHERE is_public = true;
CREATE INDEX idx_social_stories_use_count ON social_stories(use_count DESC);
CREATE INDEX idx_social_stories_created_by ON social_stories(created_by);

-- ============================================
-- USER SAVED STORIES (Personal Library)
-- ============================================

-- Junction table for users to save/favorite stories
CREATE TABLE IF NOT EXISTS user_saved_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  story_id UUID REFERENCES social_stories(id) ON DELETE CASCADE NOT NULL,
  
  -- Personalization
  custom_character_name TEXT, -- Override character name
  notes TEXT, -- User's notes about this story
  times_read INTEGER DEFAULT 0,
  
  -- Metadata
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ,
  
  UNIQUE(user_id, story_id)
);

-- Enable RLS
ALTER TABLE user_saved_stories ENABLE ROW LEVEL SECURITY;

-- Users can only access their own saved stories
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

-- Indexes
CREATE INDEX idx_user_saved_stories_user ON user_saved_stories(user_id);
CREATE INDEX idx_user_saved_stories_story ON user_saved_stories(story_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get popular stories
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

-- Search stories by topic
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
-- TRIGGERS
-- ============================================

-- Update timestamps
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

