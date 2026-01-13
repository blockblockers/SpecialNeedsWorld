-- ============================================
-- ADD RECIPES 99 & 100 TO REACH 100 TOTAL
-- Run this in your Supabase SQL Editor
-- ============================================

-- Recipe 99: Easy Cheesy Nachos
INSERT INTO recipes (id, slug, name, description, emoji, image_emoji, category_id, difficulty, prep_time, cook_time, total_time, servings, is_active)
VALUES (99, 'nachos', 'Easy Cheesy Nachos', 'Crunchy chips with melty cheese!', '🫔', '🧀', 'snack', 'easy', 3, 2, 5, 1, true);

INSERT INTO recipe_ingredients (recipe_id, name, emoji, amount, sort_order) VALUES
(99, 'Tortilla chips', '🫔', 'a handful', 1),
(99, 'Shredded cheese', '🧀', '1/4 cup', 2),
(99, 'Salsa (optional)', '🍅', '2 tbsp', 3);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action, emoji, requires_adult) VALUES
(99, 1, 'Get a microwave-safe plate', 'Get plate', '🍽️', false),
(99, 2, 'Spread chips on the plate', 'Add chips', '🫔', false),
(99, 3, 'Sprinkle cheese on top of chips', 'Add cheese', '🧀', false),
(99, 4, 'Microwave for 30-45 seconds', 'Microwave', '📻', false),
(99, 5, 'Check if cheese is melted', 'Check', '👀', false),
(99, 6, 'Add salsa if you want', 'Add salsa', '🍅', false),
(99, 7, 'Enjoy your nachos!', 'Eat!', '😋', false);


-- Recipe 100: Mac & Cheese Cup
INSERT INTO recipes (id, slug, name, description, emoji, image_emoji, category_id, difficulty, prep_time, cook_time, total_time, servings, is_active)
VALUES (100, 'mac-cheese-cup', 'Mac & Cheese Cup', 'Creamy pasta in minutes!', '🧀', '🍝', 'lunch', 'easy', 1, 4, 5, 1, true);

INSERT INTO recipe_ingredients (recipe_id, name, emoji, amount, sort_order) VALUES
(100, 'Mac & cheese cup', '🥤', '1 cup', 1),
(100, 'Water', '💧', 'to the line', 2);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action, emoji, requires_adult) VALUES
(100, 1, 'Remove the lid from the cup', 'Open', '📦', false),
(100, 2, 'Take out the cheese packet', 'Remove packet', '🧀', false),
(100, 3, 'Add water to the fill line', 'Add water', '💧', false),
(100, 4, 'Microwave for 3½ minutes', 'Microwave', '📻', false),
(100, 5, 'Careful! It will be hot!', 'Be careful', '⚠️', true),
(100, 6, 'Stir in the cheese powder', 'Add cheese', '🧀', false),
(100, 7, 'Mix until creamy', 'Stir', '🥄', false),
(100, 8, 'Let cool and enjoy!', 'Eat!', '😋', false);


-- Verify we now have 100 recipes
SELECT COUNT(*) as total_recipes FROM recipes WHERE is_active = true;
