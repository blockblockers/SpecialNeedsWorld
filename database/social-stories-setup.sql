-- =====================================================
-- SOCIAL STORIES SCHEMA
-- =====================================================
-- Run this in Supabase SQL Editor
-- Stores generated social stories for reuse

-- =====================================================
-- 1. SOCIAL STORIES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS social_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Story identification
  topic TEXT NOT NULL,                    -- Original user prompt (e.g., "taking a bath")
  topic_normalized TEXT NOT NULL,         -- Lowercase, trimmed for matching
  
  -- Story content (JSON array of pages)
  pages JSONB NOT NULL DEFAULT '[]',
  -- Each page: { "text": "...", "imagePrompt": "...", "imageUrl": "..." }
  
  -- Metadata
  character_name TEXT DEFAULT 'Sam',      -- Main character name
  character_style TEXT DEFAULT 'friendly cartoon child',
  age_group TEXT DEFAULT 'child',         -- child, teen, adult
  
  -- Usage stats
  use_count INTEGER DEFAULT 1,
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ownership
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT TRUE,         -- Can other users see this story?
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for finding similar stories
CREATE INDEX IF NOT EXISTS idx_social_stories_topic 
  ON social_stories(topic_normalized);

CREATE INDEX IF NOT EXISTS idx_social_stories_public 
  ON social_stories(is_public) WHERE is_public = TRUE;

-- Full-text search on topic
CREATE INDEX IF NOT EXISTS idx_social_stories_topic_search 
  ON social_stories USING gin(to_tsvector('english', topic));


-- =====================================================
-- 2. USER'S SAVED STORIES (Favorites)
-- =====================================================

CREATE TABLE IF NOT EXISTS user_saved_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES social_stories(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Custom user settings for this story
  custom_character_name TEXT,
  notes TEXT,
  
  UNIQUE(user_id, story_id)
);

CREATE INDEX IF NOT EXISTS idx_user_saved_stories_user 
  ON user_saved_stories(user_id);


-- =====================================================
-- 3. STORY GENERATION QUEUE (for async generation)
-- =====================================================

CREATE TABLE IF NOT EXISTS story_generation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  status TEXT DEFAULT 'pending',  -- pending, processing, completed, failed
  result_story_id UUID REFERENCES social_stories(id),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_story_queue_status 
  ON story_generation_queue(status) WHERE status = 'pending';


-- =====================================================
-- 4. RLS POLICIES
-- =====================================================

ALTER TABLE social_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_generation_queue ENABLE ROW LEVEL SECURITY;

-- Social Stories: Anyone can read public stories
CREATE POLICY "Anyone can read public stories"
  ON social_stories FOR SELECT
  USING (is_public = TRUE OR created_by = auth.uid());

-- Social Stories: Authenticated users can create
CREATE POLICY "Authenticated users can create stories"
  ON social_stories FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Social Stories: Creators can update their own
CREATE POLICY "Creators can update own stories"
  ON social_stories FOR UPDATE
  USING (created_by = auth.uid());

-- User Saved Stories: Users can manage their own
CREATE POLICY "Users can view own saved stories"
  ON user_saved_stories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save stories"
  ON user_saved_stories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave stories"
  ON user_saved_stories FOR DELETE
  USING (auth.uid() = user_id);

-- Story Queue: Users can view/create their own
CREATE POLICY "Users can view own queue items"
  ON story_generation_queue FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create queue items"
  ON story_generation_queue FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- =====================================================
-- 5. HELPER FUNCTIONS
-- =====================================================

-- Normalize topic for matching
CREATE OR REPLACE FUNCTION normalize_topic(topic TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(TRIM(REGEXP_REPLACE(topic, '\s+', ' ', 'g')));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Find similar existing story
CREATE OR REPLACE FUNCTION find_similar_story(p_topic TEXT)
RETURNS UUID AS $$
DECLARE
  v_normalized TEXT;
  v_story_id UUID;
BEGIN
  v_normalized := normalize_topic(p_topic);
  
  -- Exact match first
  SELECT id INTO v_story_id
  FROM social_stories
  WHERE topic_normalized = v_normalized
    AND is_public = TRUE
  ORDER BY use_count DESC
  LIMIT 1;
  
  IF v_story_id IS NOT NULL THEN
    -- Increment use count
    UPDATE social_stories 
    SET use_count = use_count + 1, last_used_at = NOW()
    WHERE id = v_story_id;
    RETURN v_story_id;
  END IF;
  
  -- Fuzzy match using similarity (requires pg_trgm extension)
  -- SELECT id INTO v_story_id
  -- FROM social_stories
  -- WHERE similarity(topic_normalized, v_normalized) > 0.6
  --   AND is_public = TRUE
  -- ORDER BY similarity(topic_normalized, v_normalized) DESC, use_count DESC
  -- LIMIT 1;
  
  RETURN v_story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert new story
CREATE OR REPLACE FUNCTION create_social_story(
  p_topic TEXT,
  p_pages JSONB,
  p_character_name TEXT DEFAULT 'Sam',
  p_created_by UUID DEFAULT NULL,
  p_is_public BOOLEAN DEFAULT TRUE
)
RETURNS UUID AS $$
DECLARE
  v_story_id UUID;
BEGIN
  INSERT INTO social_stories (
    topic, 
    topic_normalized, 
    pages, 
    character_name,
    created_by, 
    is_public
  ) VALUES (
    p_topic,
    normalize_topic(p_topic),
    p_pages,
    p_character_name,
    p_created_by,
    p_is_public
  )
  RETURNING id INTO v_story_id;
  
  RETURN v_story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get popular stories
CREATE OR REPLACE FUNCTION get_popular_stories(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  topic TEXT,
  pages JSONB,
  character_name TEXT,
  use_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.topic,
    s.pages,
    s.character_name,
    s.use_count
  FROM social_stories s
  WHERE s.is_public = TRUE
  ORDER BY s.use_count DESC, s.last_used_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Search stories
CREATE OR REPLACE FUNCTION search_stories(p_query TEXT, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  topic TEXT,
  pages JSONB,
  character_name TEXT,
  use_count INTEGER,
  relevance REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.topic,
    s.pages,
    s.character_name,
    s.use_count,
    ts_rank(to_tsvector('english', s.topic), plainto_tsquery('english', p_query)) as relevance
  FROM social_stories s
  WHERE s.is_public = TRUE
    AND to_tsvector('english', s.topic) @@ plainto_tsquery('english', p_query)
  ORDER BY relevance DESC, s.use_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =====================================================
-- 6. TRIGGER FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_social_story_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER social_stories_updated
  BEFORE UPDATE ON social_stories
  FOR EACH ROW
  EXECUTE FUNCTION update_social_story_timestamp();


-- =====================================================
-- 7. SEED SOME EXAMPLE STORIES
-- =====================================================

INSERT INTO social_stories (topic, topic_normalized, pages, character_name, is_public, use_count)
VALUES 
(
  'Taking a bath',
  'taking a bath',
  '[
    {"pageNumber": 1, "text": "Sometimes I need to take a bath to stay clean and healthy.", "imageDescription": "A friendly child looking at a bathtub with warm water and bubbles"},
    {"pageNumber": 2, "text": "First, I help get the water ready. The water should feel warm, not too hot.", "imageDescription": "A child touching the bath water gently with their hand, testing the temperature"},
    {"pageNumber": 3, "text": "I take off my clothes and step into the tub carefully.", "imageDescription": "A child stepping into a bathtub with a rubber duck floating nearby"},
    {"pageNumber": 4, "text": "I use soap to wash my body. The bubbles feel nice!", "imageDescription": "A happy child playing with soap bubbles in the bath"},
    {"pageNumber": 5, "text": "I wash my hair with shampoo. I close my eyes so soap doesn''t get in them.", "imageDescription": "A child washing their hair with eyes closed, looking calm"},
    {"pageNumber": 6, "text": "When I''m all clean, I pull the plug and the water goes down the drain.", "imageDescription": "Water swirling down a bathtub drain"},
    {"pageNumber": 7, "text": "I dry off with a soft towel. Bath time is done!", "imageDescription": "A happy child wrapped in a fluffy towel, smiling"},
    {"pageNumber": 8, "text": "Taking a bath helps me feel fresh and clean. I did a great job!", "imageDescription": "A proud child in clean clothes giving a thumbs up"}
  ]'::jsonb,
  'Sam',
  TRUE,
  10
),
(
  'Going to the dentist',
  'going to the dentist',
  '[
    {"pageNumber": 1, "text": "Sometimes I need to visit the dentist to keep my teeth healthy.", "imageDescription": "A friendly dental office waiting room with colorful chairs"},
    {"pageNumber": 2, "text": "The dentist is a helper who takes care of teeth. They wear special clothes.", "imageDescription": "A friendly dentist in a white coat waving hello"},
    {"pageNumber": 3, "text": "I sit in a special chair that moves up and down. It''s like a ride!", "imageDescription": "A child sitting in a dental chair, looking curious"},
    {"pageNumber": 4, "text": "The dentist uses a small mirror to look at my teeth. It doesn''t hurt.", "imageDescription": "A dentist holding a small mirror, showing it to a child"},
    {"pageNumber": 5, "text": "They might clean my teeth with a special toothbrush. It tickles a little!", "imageDescription": "A dental hygienist cleaning a child''s teeth gently"},
    {"pageNumber": 6, "text": "I try to keep my mouth open wide and stay very still.", "imageDescription": "A child with mouth open wide, being brave"},
    {"pageNumber": 7, "text": "When it''s done, I might get to pick a prize or sticker!", "imageDescription": "A child choosing a sticker from a prize box, looking happy"},
    {"pageNumber": 8, "text": "Going to the dentist keeps my smile bright and healthy. I was brave!", "imageDescription": "A proud child showing off a big, healthy smile"}
  ]'::jsonb,
  'Sam',
  TRUE,
  8
),
(
  'Making a new friend',
  'making a new friend',
  '[
    {"pageNumber": 1, "text": "Sometimes I see someone new and want to be their friend.", "imageDescription": "A child noticing another child playing alone in a playground"},
    {"pageNumber": 2, "text": "I can walk up to them and say ''Hi! My name is Sam.''", "imageDescription": "A friendly child waving and introducing themselves"},
    {"pageNumber": 3, "text": "I can ask ''Would you like to play with me?''", "imageDescription": "Two children talking, one gesturing toward playground equipment"},
    {"pageNumber": 4, "text": "If they say yes, we can play together! If they say no, that''s okay too.", "imageDescription": "Two children playing together on a swing set, looking happy"},
    {"pageNumber": 5, "text": "Good friends share toys and take turns.", "imageDescription": "Two children taking turns on a slide"},
    {"pageNumber": 6, "text": "Good friends use kind words and listen to each other.", "imageDescription": "Two children sitting together, one listening while the other talks"},
    {"pageNumber": 7, "text": "Sometimes friends have different ideas. We can find a way to play that makes everyone happy.", "imageDescription": "Two children compromising, choosing a game together"},
    {"pageNumber": 8, "text": "Making new friends can feel scary at first, but it can also be wonderful!", "imageDescription": "Two children walking together as friends, both smiling"}
  ]'::jsonb,
  'Sam',
  TRUE,
  12
)
ON CONFLICT DO NOTHING;
