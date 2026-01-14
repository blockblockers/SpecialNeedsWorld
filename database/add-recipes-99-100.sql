-- ============================================
-- CHECK YOUR RECIPE COUNT FIRST
-- ============================================

SELECT COUNT(*) as total_recipes FROM recipes WHERE is_active = true;

-- If you already have 100, you're done!
-- If you need more, run the block below with DIFFERENT recipes:

-- ============================================
-- ADD 2 NEW UNIQUE RECIPES (if needed)
-- ============================================

DO $$
DECLARE
  recipe1_id INTEGER;
  recipe2_id INTEGER;
BEGIN
  -- Insert Banana Bites and get ID
  INSERT INTO recipes (slug, name, description, emoji, image_emoji, category_id, difficulty, prep_time, cook_time, servings, is_active)
  VALUES ('frozen-banana-bites', 'Frozen Banana Bites', 'Sweet frozen treat with chocolate!', '🍌', '🍫', 'snack', 'easy', 10, 0, 4, true)
  RETURNING id INTO recipe1_id;
  
  -- Banana Bites ingredients
  INSERT INTO recipe_ingredients (recipe_id, name, emoji, amount, sort_order) VALUES
  (recipe1_id, 'Banana', '🍌', '2', 1),
  (recipe1_id, 'Chocolate chips', '🍫', '1/2 cup', 2),
  (recipe1_id, 'Popsicle sticks', '🪵', '4', 3);
  
  -- Banana Bites steps
  INSERT INTO recipe_steps (recipe_id, step_number, instruction, action, emoji, requires_adult) VALUES
  (recipe1_id, 1, 'Peel the bananas', 'Peel', '🍌', false),
  (recipe1_id, 2, 'Cut each banana in half', 'Cut', '🔪', true),
  (recipe1_id, 3, 'Put a stick in each half', 'Add stick', '🪵', false),
  (recipe1_id, 4, 'Melt chocolate in microwave', 'Melt', '🍫', true),
  (recipe1_id, 5, 'Dip banana in chocolate', 'Dip', '🍌', false),
  (recipe1_id, 6, 'Put on wax paper', 'Place', '📄', false),
  (recipe1_id, 7, 'Freeze for 1 hour', 'Freeze', '🧊', false),
  (recipe1_id, 8, 'Enjoy your frozen treat!', 'Eat!', '😋', false);

  -- Insert Cucumber Boats and get ID
  INSERT INTO recipes (slug, name, description, emoji, image_emoji, category_id, difficulty, prep_time, cook_time, servings, is_active)
  VALUES ('cucumber-boats', 'Cucumber Boats', 'Crunchy veggie boats with cream cheese!', '🥒', '🚤', 'snack', 'easy', 5, 0, 2, true)
  RETURNING id INTO recipe2_id;
  
  -- Cucumber Boats ingredients
  INSERT INTO recipe_ingredients (recipe_id, name, emoji, amount, sort_order) VALUES
  (recipe2_id, 'Cucumber', '🥒', '1 large', 1),
  (recipe2_id, 'Cream cheese', '🧀', '2 tbsp', 2),
  (recipe2_id, 'Cherry tomatoes', '🍅', '4', 3);
  
  -- Cucumber Boats steps
  INSERT INTO recipe_steps (recipe_id, step_number, instruction, action, emoji, requires_adult) VALUES
  (recipe2_id, 1, 'Wash the cucumber', 'Wash', '🚿', false),
  (recipe2_id, 2, 'Cut cucumber in half lengthwise', 'Cut', '🔪', true),
  (recipe2_id, 3, 'Scoop out seeds with spoon', 'Scoop', '🥄', false),
  (recipe2_id, 4, 'Spread cream cheese inside', 'Spread', '🧀', false),
  (recipe2_id, 5, 'Cut tomatoes in half', 'Cut', '🍅', true),
  (recipe2_id, 6, 'Place tomatoes on top', 'Add', '🍅', false),
  (recipe2_id, 7, 'Enjoy your veggie boats!', 'Eat!', '😋', false);
  
  RAISE NOTICE 'Created Frozen Banana Bites with ID % and Cucumber Boats with ID %', recipe1_id, recipe2_id;
END $$;

-- Verify final count
SELECT COUNT(*) as total_recipes FROM recipes WHERE is_active = true;
