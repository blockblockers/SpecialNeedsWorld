-- Fix Recipe Steps - Replace "Follow the recipe" with actual instructions
-- Includes action column (required)
-- Run this in Supabase SQL Editor

-- First, delete the placeholder steps
DELETE FROM recipe_steps WHERE instruction = 'Follow the recipe';

-- =====================================================
-- BREAKFAST RECIPES
-- =====================================================

-- Avocado Toast
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get bread', 'Get bread and put in toaster', '🍞' FROM recipes WHERE name = 'Avocado Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Push lever', 'Push toaster lever down', '👇' FROM recipes WHERE name = 'Avocado Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Wait', 'Wait for toast to pop up', '⏰' FROM recipes WHERE name = 'Avocado Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Cut', 'Cut avocado in half with knife', '🔪' FROM recipes WHERE name = 'Avocado Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Scoop', 'Scoop avocado out with spoon', '🥄' FROM recipes WHERE name = 'Avocado Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Add', 'Put avocado on toast', '🥑' FROM recipes WHERE name = 'Avocado Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Mash', 'Mash with fork', '🍴' FROM recipes WHERE name = 'Avocado Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Season', 'Add salt if you want', '🧂' FROM recipes WHERE name = 'Avocado Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Enjoy!', 'Enjoy your avocado toast!', '😋' FROM recipes WHERE name = 'Avocado Toast';

-- French Toast
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Crack eggs', 'Crack 2 eggs into bowl', '🥚' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Add milk', 'Add splash of milk', '🥛' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add spice', 'Add cinnamon', '✨' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Mix', 'Mix with fork', '🍴' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Heat pan', 'Heat pan on medium', '🍳' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Add butter', 'Add butter to pan', '🧈' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Dip bread', 'Dip bread in egg mix', '🍞' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Cook', 'Put bread in pan', '🍳' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Wait', 'Cook until golden brown', '⏰' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Flip', 'Flip with spatula', '🔄' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 11, 'Cook', 'Cook other side', '⏰' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 12, 'Serve', 'Put on plate and add syrup', '🍯' FROM recipes WHERE name = 'French Toast';

-- Simple Pancakes
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get supplies', 'Get pancake mix and bowl', '🥣' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Add mix', 'Add pancake mix to bowl', '📦' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add liquid', 'Add water or milk', '🥛' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Stir', 'Stir until smooth', '🥄' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Heat pan', 'Heat pan on medium', '🍳' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Spray pan', 'Spray pan with cooking spray', '💨' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Pour', 'Pour batter into pan', '🥞' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Wait', 'Wait for bubbles on top', '⏰' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Flip', 'Flip pancake with spatula', '🔄' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Cook', 'Cook until golden', '⏰' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 11, 'Plate', 'Put on plate', '🍽️' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 12, 'Top it', 'Add butter and syrup', '🧈' FROM recipes WHERE name = 'Simple Pancakes';

-- Smoothie Bowl
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get blender', 'Get blender', '🫙' FROM recipes WHERE name = 'Smoothie Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Add fruit', 'Add frozen fruit to blender', '🍓' FROM recipes WHERE name = 'Smoothie Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add yogurt', 'Add yogurt', '🥛' FROM recipes WHERE name = 'Smoothie Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add milk', 'Add a little milk', '🥛' FROM recipes WHERE name = 'Smoothie Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Close lid', 'Put lid on blender', '👆' FROM recipes WHERE name = 'Smoothie Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Blend', 'Blend until smooth', '🔄' FROM recipes WHERE name = 'Smoothie Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Pour', 'Pour into bowl', '🥣' FROM recipes WHERE name = 'Smoothie Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Top it', 'Add toppings on top', '🫐' FROM recipes WHERE name = 'Smoothie Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Smoothie Bowl';

-- Bagel with Cream Cheese
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Cut', 'Cut bagel in half', '🔪' FROM recipes WHERE name = 'Bagel with Cream Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Toast', 'Put bagel halves in toaster', '🍞' FROM recipes WHERE name = 'Bagel with Cream Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Push lever', 'Push toaster lever down', '👇' FROM recipes WHERE name = 'Bagel with Cream Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Wait', 'Wait for bagel to pop up', '⏰' FROM recipes WHERE name = 'Bagel with Cream Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Get spread', 'Get cream cheese and knife', '🧀' FROM recipes WHERE name = 'Bagel with Cream Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Spread', 'Spread cream cheese on bagel', '🔪' FROM recipes WHERE name = 'Bagel with Cream Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Serve', 'Put halves together or eat open', '🥯' FROM recipes WHERE name = 'Bagel with Cream Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Bagel with Cream Cheese';

-- Overnight Oats
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get jar', 'Get a jar or container with lid', '🫙' FROM recipes WHERE name = 'Overnight Oats';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Add oats', 'Add oats to jar', '🥣' FROM recipes WHERE name = 'Overnight Oats';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add milk', 'Add milk', '🥛' FROM recipes WHERE name = 'Overnight Oats';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add yogurt', 'Add yogurt', '🥛' FROM recipes WHERE name = 'Overnight Oats';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Sweeten', 'Add honey or maple syrup', '🍯' FROM recipes WHERE name = 'Overnight Oats';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Mix', 'Stir everything together', '🥄' FROM recipes WHERE name = 'Overnight Oats';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Close lid', 'Put lid on jar', '👆' FROM recipes WHERE name = 'Overnight Oats';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Chill', 'Put in refrigerator overnight', '❄️' FROM recipes WHERE name = 'Overnight Oats';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Top it', 'In morning, add fruit on top', '🍓' FROM recipes WHERE name = 'Overnight Oats';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Enjoy!', 'Eat cold or warm up', '😋' FROM recipes WHERE name = 'Overnight Oats';

-- Egg on Toast
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Toast bread', 'Put bread in toaster', '🍞' FROM recipes WHERE name = 'Egg on Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Push lever', 'Push toaster lever down', '👇' FROM recipes WHERE name = 'Egg on Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Heat pan', 'Heat pan on medium', '🍳' FROM recipes WHERE name = 'Egg on Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add butter', 'Add butter to pan', '🧈' FROM recipes WHERE name = 'Egg on Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Crack egg', 'Crack egg into pan', '🥚' FROM recipes WHERE name = 'Egg on Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Cook', 'Cook until white is set', '⏰' FROM recipes WHERE name = 'Egg on Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Plate toast', 'Toast pops up - put on plate', '🍽️' FROM recipes WHERE name = 'Egg on Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Add egg', 'Put egg on toast', '🍳' FROM recipes WHERE name = 'Egg on Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Season', 'Add salt and pepper', '🧂' FROM recipes WHERE name = 'Egg on Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Egg on Toast';

-- Toaster Waffles
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get waffles', 'Get waffles from freezer', '❄️' FROM recipes WHERE name = 'Toaster Waffles';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Toast', 'Put waffles in toaster', '🧇' FROM recipes WHERE name = 'Toaster Waffles';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Push lever', 'Push toaster lever down', '👇' FROM recipes WHERE name = 'Toaster Waffles';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Wait', 'Wait for waffles to pop up', '⏰' FROM recipes WHERE name = 'Toaster Waffles';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Plate', 'Put waffles on plate', '🍽️' FROM recipes WHERE name = 'Toaster Waffles';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Add butter', 'Add butter on top', '🧈' FROM recipes WHERE name = 'Toaster Waffles';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Add syrup', 'Add syrup', '🍯' FROM recipes WHERE name = 'Toaster Waffles';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Toaster Waffles';

-- Banana Bread Slice
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get bread', 'Get banana bread', '🍌' FROM recipes WHERE name = 'Banana Bread Slice';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Slice', 'Cut a slice with knife', '🔪' FROM recipes WHERE name = 'Banana Bread Slice';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Plate', 'Put slice on plate', '🍽️' FROM recipes WHERE name = 'Banana Bread Slice';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add butter', 'Add butter if you want', '🧈' FROM recipes WHERE name = 'Banana Bread Slice';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Banana Bread Slice';

-- Cheese Toast
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Heat oven', 'Turn on oven to broil', '🔥' FROM recipes WHERE name = 'Cheese Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Prep bread', 'Put bread on baking sheet', '🍞' FROM recipes WHERE name = 'Cheese Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add cheese', 'Put cheese on bread', '🧀' FROM recipes WHERE name = 'Cheese Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Bake', 'Put in oven', '👆' FROM recipes WHERE name = 'Cheese Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Watch', 'Watch until cheese melts', '👀' FROM recipes WHERE name = 'Cheese Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Remove', 'Take out with oven mitt', '🧤' FROM recipes WHERE name = 'Cheese Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Cool', 'Let cool a little', '⏰' FROM recipes WHERE name = 'Cheese Toast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Cheese Toast';

-- Granola Parfait
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get glass', 'Get a glass or bowl', '🥛' FROM recipes WHERE name = 'Granola Parfait';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Add yogurt', 'Add yogurt to bottom', '🥄' FROM recipes WHERE name = 'Granola Parfait';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add granola', 'Add layer of granola', '🥣' FROM recipes WHERE name = 'Granola Parfait';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add fruit', 'Add layer of fruit', '🍓' FROM recipes WHERE name = 'Granola Parfait';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'More yogurt', 'Add more yogurt', '🥄' FROM recipes WHERE name = 'Granola Parfait';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'More granola', 'Add more granola', '🥣' FROM recipes WHERE name = 'Granola Parfait';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Top it', 'Top with fruit', '🫐' FROM recipes WHERE name = 'Granola Parfait';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Granola Parfait';

-- English Muffin Breakfast
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Split', 'Split English muffin in half', '🍞' FROM recipes WHERE name = 'English Muffin Breakfast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Toast', 'Put in toaster', '👇' FROM recipes WHERE name = 'English Muffin Breakfast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Wait', 'Wait for it to pop up', '⏰' FROM recipes WHERE name = 'English Muffin Breakfast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Plate', 'Put on plate', '🍽️' FROM recipes WHERE name = 'English Muffin Breakfast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Butter', 'Spread butter', '🧈' FROM recipes WHERE name = 'English Muffin Breakfast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Add jam', 'Add jam or jelly', '🍓' FROM recipes WHERE name = 'English Muffin Breakfast';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'English Muffin Breakfast';

-- Breakfast Fruit Salad
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get bowl', 'Get a bowl', '🥣' FROM recipes WHERE name = 'Breakfast Fruit Salad';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Wash', 'Wash all fruit', '🚿' FROM recipes WHERE name = 'Breakfast Fruit Salad';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Cut', 'Cut fruit into small pieces', '🔪' FROM recipes WHERE name = 'Breakfast Fruit Salad';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add fruit', 'Put all fruit in bowl', '🍓' FROM recipes WHERE name = 'Breakfast Fruit Salad';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Mix', 'Mix gently with spoon', '🥄' FROM recipes WHERE name = 'Breakfast Fruit Salad';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Top it', 'Add yogurt on top if you want', '🥛' FROM recipes WHERE name = 'Breakfast Fruit Salad';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Breakfast Fruit Salad';

-- Frozen Hash Browns
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get food', 'Get hash browns from freezer', '❄️' FROM recipes WHERE name = 'Frozen Hash Browns';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Heat pan', 'Heat pan on medium-high', '🍳' FROM recipes WHERE name = 'Frozen Hash Browns';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add oil', 'Add oil to pan', '🫒' FROM recipes WHERE name = 'Frozen Hash Browns';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Cook', 'Add hash browns to pan', '🥔' FROM recipes WHERE name = 'Frozen Hash Browns';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Wait', 'Cook until golden on bottom', '⏰' FROM recipes WHERE name = 'Frozen Hash Browns';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Flip', 'Flip with spatula', '🔄' FROM recipes WHERE name = 'Frozen Hash Browns';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Cook more', 'Cook other side until crispy', '⏰' FROM recipes WHERE name = 'Frozen Hash Browns';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Plate', 'Put on plate', '🍽️' FROM recipes WHERE name = 'Frozen Hash Browns';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Season', 'Add salt', '🧂' FROM recipes WHERE name = 'Frozen Hash Browns';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Frozen Hash Browns';

-- =====================================================
-- LUNCH RECIPES
-- =====================================================

-- Veggie Wrap
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get tortilla', 'Get a tortilla', '🫓' FROM recipes WHERE name = 'Veggie Wrap';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Spread', 'Spread hummus on tortilla', '🥄' FROM recipes WHERE name = 'Veggie Wrap';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add lettuce', 'Add lettuce', '🥬' FROM recipes WHERE name = 'Veggie Wrap';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add tomato', 'Add tomato slices', '🍅' FROM recipes WHERE name = 'Veggie Wrap';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add cucumber', 'Add cucumber slices', '🥒' FROM recipes WHERE name = 'Veggie Wrap';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Add cheese', 'Add cheese if you want', '🧀' FROM recipes WHERE name = 'Veggie Wrap';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Roll', 'Roll up tight', '🌯' FROM recipes WHERE name = 'Veggie Wrap';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Cut', 'Cut in half', '🔪' FROM recipes WHERE name = 'Veggie Wrap';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Veggie Wrap';

-- Grilled Cheese Sandwich
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get bread', 'Get 2 slices of bread', '🍞' FROM recipes WHERE name = 'Grilled Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Butter', 'Butter one side of each slice', '🧈' FROM recipes WHERE name = 'Grilled Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Heat pan', 'Heat pan on medium', '🍳' FROM recipes WHERE name = 'Grilled Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add bread', 'Put one bread butter-side down in pan', '🍞' FROM recipes WHERE name = 'Grilled Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add cheese', 'Put cheese on top', '🧀' FROM recipes WHERE name = 'Grilled Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Top it', 'Put second bread on top butter-side up', '🍞' FROM recipes WHERE name = 'Grilled Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Cook', 'Cook until golden on bottom', '⏰' FROM recipes WHERE name = 'Grilled Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Flip', 'Flip with spatula', '🔄' FROM recipes WHERE name = 'Grilled Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Cook more', 'Cook other side until golden', '⏰' FROM recipes WHERE name = 'Grilled Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Serve', 'Put on plate and cut in half', '🔪' FROM recipes WHERE name = 'Grilled Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 11, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Grilled Cheese Sandwich';

-- PB&J Sandwich
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get bread', 'Get 2 slices of bread', '🍞' FROM recipes WHERE name = 'PB&J Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Get spreads', 'Get peanut butter and jelly', '🥜' FROM recipes WHERE name = 'PB&J Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Spread PB', 'Spread peanut butter on one slice', '🔪' FROM recipes WHERE name = 'PB&J Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Spread jelly', 'Spread jelly on other slice', '🍇' FROM recipes WHERE name = 'PB&J Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Combine', 'Put slices together', '🥪' FROM recipes WHERE name = 'PB&J Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Cut', 'Cut in half if you want', '🔪' FROM recipes WHERE name = 'PB&J Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'PB&J Sandwich';

-- Turkey Sandwich
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get bread', 'Get 2 slices of bread', '🍞' FROM recipes WHERE name = 'Turkey Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Spread', 'Spread mayo or mustard on bread', '🥄' FROM recipes WHERE name = 'Turkey Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add turkey', 'Add turkey slices', '🦃' FROM recipes WHERE name = 'Turkey Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add cheese', 'Add cheese slice', '🧀' FROM recipes WHERE name = 'Turkey Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add lettuce', 'Add lettuce', '🥬' FROM recipes WHERE name = 'Turkey Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Add tomato', 'Add tomato slice', '🍅' FROM recipes WHERE name = 'Turkey Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Close it', 'Put top bread on', '🍞' FROM recipes WHERE name = 'Turkey Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Cut', 'Cut in half', '🔪' FROM recipes WHERE name = 'Turkey Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Turkey Sandwich';

-- Ham & Cheese Sandwich
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get bread', 'Get 2 slices of bread', '🍞' FROM recipes WHERE name = 'Ham & Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Spread', 'Spread mayo or mustard on bread', '🥄' FROM recipes WHERE name = 'Ham & Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add ham', 'Add ham slices', '🥓' FROM recipes WHERE name = 'Ham & Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add cheese', 'Add cheese slice', '🧀' FROM recipes WHERE name = 'Ham & Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add lettuce', 'Add lettuce if you want', '🥬' FROM recipes WHERE name = 'Ham & Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Close it', 'Put top bread on', '🍞' FROM recipes WHERE name = 'Ham & Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Cut', 'Cut in half', '🔪' FROM recipes WHERE name = 'Ham & Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Ham & Cheese Sandwich';

-- Tuna Salad
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Open can', 'Open can of tuna', '🥫' FROM recipes WHERE name = 'Tuna Salad';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Drain', 'Drain water from tuna', '💧' FROM recipes WHERE name = 'Tuna Salad';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add to bowl', 'Put tuna in bowl', '🥣' FROM recipes WHERE name = 'Tuna Salad';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add mayo', 'Add mayo', '🥄' FROM recipes WHERE name = 'Tuna Salad';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Season', 'Add a little salt and pepper', '🧂' FROM recipes WHERE name = 'Tuna Salad';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Mix', 'Mix together with fork', '🍴' FROM recipes WHERE name = 'Tuna Salad';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Serve', 'Put on bread or crackers', '🍞' FROM recipes WHERE name = 'Tuna Salad';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Tuna Salad';

-- Chicken Nuggets
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get food', 'Get chicken nuggets from freezer', '❄️' FROM recipes WHERE name = 'Chicken Nuggets';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Heat oven', 'Turn on oven to 400°F', '🔥' FROM recipes WHERE name = 'Chicken Nuggets';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Prep', 'Put nuggets on baking sheet', '🍗' FROM recipes WHERE name = 'Chicken Nuggets';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Bake', 'Put in oven', '👆' FROM recipes WHERE name = 'Chicken Nuggets';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Set timer', 'Set timer for 15 minutes', '⏰' FROM recipes WHERE name = 'Chicken Nuggets';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Check', 'When timer beeps, check if done', '👀' FROM recipes WHERE name = 'Chicken Nuggets';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Remove', 'Take out with oven mitt', '🧤' FROM recipes WHERE name = 'Chicken Nuggets';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Cool', 'Let cool a little', '⏰' FROM recipes WHERE name = 'Chicken Nuggets';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Add sauce', 'Serve with dipping sauce', '🥫' FROM recipes WHERE name = 'Chicken Nuggets';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Chicken Nuggets';

-- Mac and Cheese
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Fill pot', 'Fill pot with water', '💧' FROM recipes WHERE name = 'Mac and Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Heat', 'Put pot on stove on high', '🔥' FROM recipes WHERE name = 'Mac and Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Wait', 'Wait for water to boil (bubbles)', '💨' FROM recipes WHERE name = 'Mac and Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add pasta', 'Add macaroni to water', '🍝' FROM recipes WHERE name = 'Mac and Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Cook', 'Cook for time on box (about 8 min)', '⏰' FROM recipes WHERE name = 'Mac and Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Drain', 'Ask adult to drain water', '💧' FROM recipes WHERE name = 'Mac and Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Add butter', 'Add butter', '🧈' FROM recipes WHERE name = 'Mac and Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Add milk', 'Add milk', '🥛' FROM recipes WHERE name = 'Mac and Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Add cheese', 'Add cheese packet', '🧀' FROM recipes WHERE name = 'Mac and Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Mix', 'Stir until mixed', '🥄' FROM recipes WHERE name = 'Mac and Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 11, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Mac and Cheese';

-- Pizza Bagels
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Heat oven', 'Turn oven to 375°F', '🔥' FROM recipes WHERE name = 'Pizza Bagels';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Cut', 'Cut bagels in half', '🔪' FROM recipes WHERE name = 'Pizza Bagels';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Prep', 'Put bagels on baking sheet', '🥯' FROM recipes WHERE name = 'Pizza Bagels';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add sauce', 'Spread pizza sauce on each half', '🍅' FROM recipes WHERE name = 'Pizza Bagels';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add cheese', 'Add shredded cheese on top', '🧀' FROM recipes WHERE name = 'Pizza Bagels';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Toppings', 'Add toppings if you want', '🍕' FROM recipes WHERE name = 'Pizza Bagels';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Bake', 'Put in oven', '👆' FROM recipes WHERE name = 'Pizza Bagels';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Wait', 'Bake for 10 minutes', '⏰' FROM recipes WHERE name = 'Pizza Bagels';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Remove', 'Take out with oven mitt', '🧤' FROM recipes WHERE name = 'Pizza Bagels';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Cool', 'Let cool a little', '⏰' FROM recipes WHERE name = 'Pizza Bagels';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 11, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Pizza Bagels';

-- Hot Dog
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Fill pot', 'Fill pot with water', '💧' FROM recipes WHERE name = 'Hot Dog';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Heat', 'Put pot on stove on high', '🔥' FROM recipes WHERE name = 'Hot Dog';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Wait', 'Wait for water to boil', '💨' FROM recipes WHERE name = 'Hot Dog';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add food', 'Add hot dog to water', '🌭' FROM recipes WHERE name = 'Hot Dog';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Cook', 'Cook for 5 minutes', '⏰' FROM recipes WHERE name = 'Hot Dog';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Remove', 'Take hot dog out with tongs', '🥢' FROM recipes WHERE name = 'Hot Dog';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Add bun', 'Put hot dog in bun', '🍞' FROM recipes WHERE name = 'Hot Dog';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Add toppings', 'Add ketchup and mustard', '🍅' FROM recipes WHERE name = 'Hot Dog';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Hot Dog';

-- Cheesy Nachos
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Prep', 'Put chips on microwave-safe plate', '🍟' FROM recipes WHERE name = 'Cheesy Nachos';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Add cheese', 'Sprinkle shredded cheese on chips', '🧀' FROM recipes WHERE name = 'Cheesy Nachos';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Microwave', 'Put in microwave', '📦' FROM recipes WHERE name = 'Cheesy Nachos';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Heat', 'Heat for 30-45 seconds', '⏰' FROM recipes WHERE name = 'Cheesy Nachos';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Check', 'Check if cheese is melted', '👀' FROM recipes WHERE name = 'Cheesy Nachos';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Remove', 'Take out carefully', '🔥' FROM recipes WHERE name = 'Cheesy Nachos';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Add salsa', 'Add salsa if you want', '🍅' FROM recipes WHERE name = 'Cheesy Nachos';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Cheesy Nachos';

-- Soup with Crackers
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Open can', 'Open can of soup', '🥫' FROM recipes WHERE name = 'Soup with Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Pour', 'Pour soup into microwave-safe bowl', '🥣' FROM recipes WHERE name = 'Soup with Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Microwave', 'Put bowl in microwave', '📦' FROM recipes WHERE name = 'Soup with Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Heat', 'Heat for 2 minutes', '⏰' FROM recipes WHERE name = 'Soup with Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Stir', 'Stir soup', '🥄' FROM recipes WHERE name = 'Soup with Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Heat more', 'Heat 1 more minute', '⏰' FROM recipes WHERE name = 'Soup with Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Remove', 'Carefully take out (hot!)', '🔥' FROM recipes WHERE name = 'Soup with Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Get crackers', 'Get crackers', '🍘' FROM recipes WHERE name = 'Soup with Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Enjoy!', 'Enjoy soup with crackers!', '😋' FROM recipes WHERE name = 'Soup with Crackers';

-- Verify the update
SELECT 'Recipe steps added!' as status;
SELECT r.name, COUNT(rs.id) as steps 
FROM recipes r 
LEFT JOIN recipe_steps rs ON rs.recipe_id = r.id 
GROUP BY r.name 
ORDER BY r.name 
LIMIT 30;
