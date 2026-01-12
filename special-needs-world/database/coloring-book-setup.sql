-- =====================================================
-- COLORING BOOK SCHEMA
-- =====================================================
-- Run this in Supabase SQL Editor
-- Stores coloring page designs and user colorings

-- =====================================================
-- 1. COLORING PAGES (Templates)
-- =====================================================

CREATE TABLE IF NOT EXISTS coloring_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Page identification
  title TEXT NOT NULL,
  title_normalized TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  
  -- The actual coloring page (SVG format)
  svg_content TEXT NOT NULL,
  thumbnail_url TEXT,
  
  -- Metadata
  difficulty TEXT DEFAULT 'easy', -- easy, medium, hard
  tags TEXT[] DEFAULT '{}',
  
  -- AI generation info
  is_ai_generated BOOLEAN DEFAULT FALSE,
  generation_prompt TEXT,
  
  -- Usage stats
  use_count INTEGER DEFAULT 0,
  
  -- Ownership
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_coloring_pages_category 
  ON coloring_pages(category);

CREATE INDEX IF NOT EXISTS idx_coloring_pages_public 
  ON coloring_pages(is_public) WHERE is_public = TRUE;

CREATE INDEX IF NOT EXISTS idx_coloring_pages_title 
  ON coloring_pages(title_normalized);

-- Full-text search
CREATE INDEX IF NOT EXISTS idx_coloring_pages_search 
  ON coloring_pages USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));


-- =====================================================
-- 2. USER COLORINGS (Saved work)
-- =====================================================

CREATE TABLE IF NOT EXISTS user_colorings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id UUID NOT NULL REFERENCES coloring_pages(id) ON DELETE CASCADE,
  
  -- The colored version (SVG with fills)
  colored_svg TEXT NOT NULL,
  
  -- Metadata
  is_complete BOOLEAN DEFAULT FALSE,
  time_spent_seconds INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- One coloring per page per user (can update)
  UNIQUE(user_id, page_id)
);

CREATE INDEX IF NOT EXISTS idx_user_colorings_user 
  ON user_colorings(user_id);


-- =====================================================
-- 3. COLORING CATEGORIES
-- =====================================================

CREATE TABLE IF NOT EXISTS coloring_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Insert default categories
INSERT INTO coloring_categories (id, name, emoji, color, sort_order) VALUES
  ('animals', 'Animals', '🐾', '#5CB85C', 1),
  ('nature', 'Nature', '🌸', '#E86B9A', 2),
  ('vehicles', 'Vehicles', '🚗', '#4A9FD4', 3),
  ('food', 'Food', '🍎', '#E63B2E', 4),
  ('fantasy', 'Fantasy', '🦄', '#8E6BBF', 5),
  ('shapes', 'Shapes', '⭐', '#F5A623', 6),
  ('holidays', 'Holidays', '🎄', '#5CB85C', 7),
  ('people', 'People', '👨‍👩‍👧', '#F5A623', 8)
ON CONFLICT (id) DO NOTHING;


-- =====================================================
-- 4. RLS POLICIES
-- =====================================================

ALTER TABLE coloring_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_colorings ENABLE ROW LEVEL SECURITY;
ALTER TABLE coloring_categories ENABLE ROW LEVEL SECURITY;

-- Coloring Pages: Anyone can read public pages
CREATE POLICY "Anyone can read public coloring pages"
  ON coloring_pages FOR SELECT
  USING (is_public = TRUE OR created_by = auth.uid());

-- Coloring Pages: Authenticated users can create
CREATE POLICY "Authenticated users can create coloring pages"
  ON coloring_pages FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Coloring Pages: Creators can update their own
CREATE POLICY "Creators can update own coloring pages"
  ON coloring_pages FOR UPDATE
  USING (created_by = auth.uid());

-- User Colorings: Users can manage their own
CREATE POLICY "Users can view own colorings"
  ON user_colorings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create colorings"
  ON user_colorings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own colorings"
  ON user_colorings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own colorings"
  ON user_colorings FOR DELETE
  USING (auth.uid() = user_id);

-- Categories: Public read
CREATE POLICY "Anyone can read categories"
  ON coloring_categories FOR SELECT
  USING (true);


-- =====================================================
-- 5. HELPER FUNCTIONS
-- =====================================================

-- Increment use count
CREATE OR REPLACE FUNCTION increment_coloring_page_use(p_page_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE coloring_pages 
  SET use_count = use_count + 1
  WHERE id = p_page_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get pages by category
CREATE OR REPLACE FUNCTION get_coloring_pages_by_category(p_category TEXT, p_limit INTEGER DEFAULT 20)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  svg_content TEXT,
  difficulty TEXT,
  use_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cp.id,
    cp.title,
    cp.description,
    cp.category,
    cp.svg_content,
    cp.difficulty,
    cp.use_count
  FROM coloring_pages cp
  WHERE cp.is_public = TRUE
    AND (p_category = 'all' OR cp.category = p_category)
  ORDER BY cp.use_count DESC, cp.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Search coloring pages
CREATE OR REPLACE FUNCTION search_coloring_pages(p_query TEXT, p_limit INTEGER DEFAULT 20)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  svg_content TEXT,
  difficulty TEXT,
  use_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cp.id,
    cp.title,
    cp.description,
    cp.category,
    cp.svg_content,
    cp.difficulty,
    cp.use_count
  FROM coloring_pages cp
  WHERE cp.is_public = TRUE
    AND to_tsvector('english', cp.title || ' ' || COALESCE(cp.description, '')) 
        @@ plainto_tsquery('english', p_query)
  ORDER BY cp.use_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =====================================================
-- 6. TRIGGER FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_coloring_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER coloring_pages_updated
  BEFORE UPDATE ON coloring_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_coloring_timestamp();

CREATE TRIGGER user_colorings_updated
  BEFORE UPDATE ON user_colorings
  FOR EACH ROW
  EXECUTE FUNCTION update_coloring_timestamp();


-- =====================================================
-- 7. SEED DATA - Pre-designed Coloring Pages
-- =====================================================

INSERT INTO coloring_pages (title, title_normalized, description, category, difficulty, svg_content, is_public, use_count)
VALUES 
-- Simple Star
(
  'Happy Star',
  'happy star',
  'A simple smiling star',
  'shapes',
  'easy',
  '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <path id="star" d="M200 50 L230 150 L340 150 L250 210 L280 320 L200 250 L120 320 L150 210 L60 150 L170 150 Z" 
          fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <circle id="eye-left" cx="170" cy="160" r="10" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="eye-right" cx="230" cy="160" r="10" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <path id="smile" d="M170 200 Q200 240 230 200" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/>
  </svg>',
  TRUE,
  15
),

-- Simple Flower
(
  'Pretty Flower',
  'pretty flower',
  'A simple flower with petals',
  'nature',
  'easy',
  '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <ellipse id="petal-1" cx="200" cy="100" rx="40" ry="60" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="petal-2" cx="280" cy="160" rx="40" ry="60" transform="rotate(72 200 200)" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="petal-3" cx="250" cy="260" rx="40" ry="60" transform="rotate(144 200 200)" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="petal-4" cx="150" cy="260" rx="40" ry="60" transform="rotate(216 200 200)" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="petal-5" cx="120" cy="160" rx="40" ry="60" transform="rotate(288 200 200)" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <circle id="center" cx="200" cy="200" r="35" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <rect id="stem" x="195" y="235" width="10" height="120" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <ellipse id="leaf-left" cx="160" cy="320" rx="30" ry="15" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <ellipse id="leaf-right" cx="240" cy="300" rx="30" ry="15" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
  </svg>',
  TRUE,
  12
),

-- Simple Cat Face
(
  'Cute Cat',
  'cute cat',
  'A friendly cat face',
  'animals',
  'easy',
  '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <ellipse id="face" cx="200" cy="220" rx="120" ry="100" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <polygon id="ear-left" points="100,180 80,80 160,140" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <polygon id="ear-right" points="300,180 320,80 240,140" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="eye-left" cx="150" cy="200" rx="20" ry="25" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <ellipse id="eye-right" cx="250" cy="200" rx="20" ry="25" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <ellipse id="nose" cx="200" cy="250" rx="15" ry="10" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <path id="mouth" d="M200 260 L200 280 M180 275 Q200 295 220 275" fill="none" stroke="black" stroke-width="2"/>
    <line x1="100" y1="240" x2="60" y2="230" stroke="black" stroke-width="2"/>
    <line x1="100" y1="255" x2="60" y2="255" stroke="black" stroke-width="2"/>
    <line x1="100" y1="270" x2="60" y2="280" stroke="black" stroke-width="2"/>
    <line x1="300" y1="240" x2="340" y2="230" stroke="black" stroke-width="2"/>
    <line x1="300" y1="255" x2="340" y2="255" stroke="black" stroke-width="2"/>
    <line x1="300" y1="270" x2="340" y2="280" stroke="black" stroke-width="2"/>
  </svg>',
  TRUE,
  20
),

-- Simple Car
(
  'Fun Car',
  'fun car',
  'A simple cartoon car',
  'vehicles',
  'easy',
  '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    <rect id="body" x="50" y="120" width="300" height="80" rx="20" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <path id="top" d="M120 120 L150 60 L280 60 L310 120" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <rect id="window-front" x="160" y="70" width="50" height="40" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <rect id="window-back" x="220" y="70" width="50" height="40" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="wheel-front" cx="120" cy="200" r="35" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <circle id="wheel-front-hub" cx="120" cy="200" r="15" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="wheel-back" cx="280" cy="200" r="35" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <circle id="wheel-back-hub" cx="280" cy="200" r="15" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="headlight" cx="340" cy="150" r="12" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
  </svg>',
  TRUE,
  18
),

-- Simple Butterfly
(
  'Beautiful Butterfly',
  'beautiful butterfly',
  'A butterfly with big wings',
  'animals',
  'medium',
  '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <ellipse id="wing-tl" cx="120" cy="140" rx="80" ry="60" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="wing-tr" cx="280" cy="140" rx="80" ry="60" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="wing-bl" cx="130" cy="260" rx="70" ry="50" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="wing-br" cx="270" cy="260" rx="70" ry="50" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="body" cx="200" cy="200" rx="20" ry="80" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <circle id="head" cx="200" cy="100" r="25" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <path id="antenna-l" d="M185 80 Q160 40 140 50" fill="none" stroke="black" stroke-width="2"/>
    <path id="antenna-r" d="M215 80 Q240 40 260 50" fill="none" stroke="black" stroke-width="2"/>
    <circle cx="140" cy="50" r="5" fill="black"/>
    <circle cx="260" cy="50" r="5" fill="black"/>
    <circle id="wing-dot-1" cx="100" cy="140" r="15" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="wing-dot-2" cx="300" cy="140" r="15" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
  </svg>',
  TRUE,
  14
),

-- Simple House
(
  'Cozy House',
  'cozy house',
  'A house with a chimney',
  'shapes',
  'easy',
  '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <rect id="house-body" x="80" y="180" width="240" height="170" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <polygon id="roof" points="60,180 200,60 340,180" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <rect id="door" x="170" y="260" width="60" height="90" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <circle id="doorknob" cx="215" cy="310" r="5" fill="black"/>
    <rect id="window-left" x="100" y="220" width="50" height="50" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <rect id="window-right" x="250" y="220" width="50" height="50" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <line x1="125" y1="220" x2="125" y2="270" stroke="black" stroke-width="2"/>
    <line x1="100" y1="245" x2="150" y2="245" stroke="black" stroke-width="2"/>
    <line x1="275" y1="220" x2="275" y2="270" stroke="black" stroke-width="2"/>
    <line x1="250" y1="245" x2="300" y2="245" stroke="black" stroke-width="2"/>
    <rect id="chimney" x="260" y="80" width="40" height="60" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
  </svg>',
  TRUE,
  16
),

-- Rainbow
(
  'Rainbow',
  'rainbow',
  'A beautiful rainbow to color',
  'nature',
  'easy',
  '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    <path id="arc-1" d="M50 250 A150 150 0 0 1 350 250" fill="none" stroke="black" stroke-width="25" data-colorable="true" data-stroke-colorable="true"/>
    <path id="arc-2" d="M75 250 A125 125 0 0 1 325 250" fill="none" stroke="black" stroke-width="25" data-colorable="true" data-stroke-colorable="true"/>
    <path id="arc-3" d="M100 250 A100 100 0 0 1 300 250" fill="none" stroke="black" stroke-width="25" data-colorable="true" data-stroke-colorable="true"/>
    <path id="arc-4" d="M125 250 A75 75 0 0 1 275 250" fill="none" stroke="black" stroke-width="25" data-colorable="true" data-stroke-colorable="true"/>
    <path id="arc-5" d="M150 250 A50 50 0 0 1 250 250" fill="none" stroke="black" stroke-width="25" data-colorable="true" data-stroke-colorable="true"/>
    <ellipse id="cloud-left" cx="80" cy="250" rx="50" ry="30" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <ellipse id="cloud-right" cx="320" cy="250" rx="50" ry="30" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
  </svg>',
  TRUE,
  22
),

-- Ice Cream
(
  'Ice Cream Cone',
  'ice cream cone',
  'A yummy ice cream cone',
  'food',
  'easy',
  '<svg viewBox="0 0 400 450" xmlns="http://www.w3.org/2000/svg">
    <polygon id="cone" points="200,420 120,180 280,180" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <line x1="140" y1="220" x2="240" y2="320" stroke="black" stroke-width="2"/>
    <line x1="160" y1="260" x2="220" y2="200" stroke="black" stroke-width="2"/>
    <line x1="180" y1="300" x2="260" y2="220" stroke="black" stroke-width="2"/>
    <circle id="scoop-1" cx="200" cy="140" r="70" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <circle id="scoop-2" cx="160" cy="90" r="50" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <circle id="scoop-3" cx="240" cy="90" r="50" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <circle id="cherry" cx="200" cy="40" r="20" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <path id="cherry-stem" d="M200 20 Q220 10 210 0" fill="none" stroke="black" stroke-width="2"/>
  </svg>',
  TRUE,
  19
)
ON CONFLICT DO NOTHING;
