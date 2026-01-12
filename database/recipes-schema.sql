-- =====================================================
-- RECIPES DATABASE SCHEMA FOR SPECIAL NEEDS WORLD
-- Inspired by Accessible Chef's visual recipe format
-- =====================================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS recipe_steps CASCADE;
DROP TABLE IF EXISTS recipe_ingredients CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS recipe_categories CASCADE;

-- =====================================================
-- RECIPE CATEGORIES
-- =====================================================
CREATE TABLE recipe_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert categories
INSERT INTO recipe_categories (id, name, emoji, color, description, sort_order) VALUES
  ('breakfast', 'Breakfast', '🌅', '#F5A623', 'Start your day right!', 1),
  ('main-dishes', 'Main Dishes', '🍽️', '#E63B2E', 'Lunch and dinner meals', 2),
  ('sides', 'Sides', '🥗', '#5CB85C', 'Side dishes and salads', 3),
  ('snacks', 'Snacks', '🍿', '#E86B9A', 'Quick bites and treats', 4),
  ('desserts', 'Desserts', '🍰', '#8E6BBF', 'Sweet treats', 5),
  ('drinks', 'Drinks', '🥤', '#4A9FD4', 'Beverages and smoothies', 6);

-- =====================================================
-- RECIPES TABLE
-- =====================================================
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT NOT NULL DEFAULT '🍽️',
  category_id TEXT REFERENCES recipe_categories(id),
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'easy',
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER DEFAULT 1,
  
  -- Tags for filtering
  is_no_bake BOOLEAN DEFAULT FALSE,
  is_microwave BOOLEAN DEFAULT FALSE,
  is_no_knives BOOLEAN DEFAULT FALSE,
  is_healthy BOOLEAN DEFAULT FALSE,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  
  -- Safety
  requires_adult_help BOOLEAN DEFAULT FALSE,
  safety_notes TEXT,
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RECIPE INGREDIENTS
-- =====================================================
CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount TEXT,
  emoji TEXT NOT NULL DEFAULT '🥄',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RECIPE STEPS
-- =====================================================
CREATE TABLE recipe_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  action_word TEXT,
  emoji TEXT NOT NULL DEFAULT '👆',
  requires_adult BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_recipes_category ON recipes(category_id);
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX idx_recipes_active ON recipes(is_active);
CREATE INDEX idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_steps_recipe ON recipe_steps(recipe_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE recipe_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_steps ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Categories viewable by all" ON recipe_categories FOR SELECT USING (true);
CREATE POLICY "Recipes viewable by all" ON recipes FOR SELECT USING (is_active = true);
CREATE POLICY "Ingredients viewable by all" ON recipe_ingredients FOR SELECT USING (true);
CREATE POLICY "Steps viewable by all" ON recipe_steps FOR SELECT USING (true);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_recipe_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_recipes_timestamp
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_recipe_timestamp();
