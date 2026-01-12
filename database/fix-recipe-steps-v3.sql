-- Fix Recipe Steps - Replace "Follow the recipe" with actual instructions
-- Works with integer recipe IDs
-- Run this in Supabase SQL Editor

-- First, delete the placeholder steps
DELETE FROM recipe_steps WHERE instruction = 'Follow the recipe';

-- =====================================================
-- BREAKFAST RECIPES
-- =====================================================

-- Avocado Toast (id: 7)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Get bread and put in toaster', '🍞' FROM recipes WHERE name = 'Avocado Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Push toaster lever down', '👇' FROM recipes WHERE name = 'Avocado Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Wait for toast to pop up', '⏰' FROM recipes WHERE name = 'Avocado Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Cut avocado in half with knife', '🔪' FROM recipes WHERE name = 'Avocado Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Scoop avocado out with spoon', '🥄' FROM recipes WHERE name = 'Avocado Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Put avocado on toast', '🥑' FROM recipes WHERE name = 'Avocado Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Mash with fork', '🍴' FROM recipes WHERE name = 'Avocado Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Add salt if you want', '🧂' FROM recipes WHERE name = 'Avocado Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 9, 'Enjoy your avocado toast!', '😋' FROM recipes WHERE name = 'Avocado Toast';

-- French Toast (id: 8)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Crack 2 eggs into bowl', '🥚' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Add splash of milk', '🥛' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Add cinnamon', '✨' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Mix with fork', '🍴' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Heat pan on medium', '🍳' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Add butter to pan', '🧈' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Dip bread in egg mix', '🍞' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Put bread in pan', '🍳' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 9, 'Cook until golden brown', '⏰' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 10, 'Flip with spatula', '🔄' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 11, 'Cook other side', '⏰' FROM recipes WHERE name = 'French Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 12, 'Put on plate and add syrup', '🍯' FROM recipes WHERE name = 'French Toast';

-- Simple Pancakes (id: 9)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Get pancake mix and bowl', '🥣' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Add pancake mix to bowl', '📦' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Add water or milk', '🥛' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Stir until smooth', '🥄' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Heat pan on medium', '🍳' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Spray pan with cooking spray', '💨' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Pour batter into pan', '🥞' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Wait for bubbles on top', '⏰' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 9, 'Flip pancake with spatula', '🔄' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 10, 'Cook until golden', '⏰' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 11, 'Put on plate', '🍽️' FROM recipes WHERE name = 'Simple Pancakes';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 12, 'Add butter and syrup', '🧈' FROM recipes WHERE name = 'Simple Pancakes';

-- Smoothie Bowl (id: 10)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Get blender', '🫙' FROM recipes WHERE name = 'Smoothie Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Add frozen fruit to blender', '🍓' FROM recipes WHERE name = 'Smoothie Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Add yogurt', '🥛' FROM recipes WHERE name = 'Smoothie Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Add a little milk', '🥛' FROM recipes WHERE name = 'Smoothie Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Put lid on blender', '👆' FROM recipes WHERE name = 'Smoothie Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Blend until smooth', '🔄' FROM recipes WHERE name = 'Smoothie Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Pour into bowl', '🥣' FROM recipes WHERE name = 'Smoothie Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Add toppings on top', '🫐' FROM recipes WHERE name = 'Smoothie Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 9, 'Enjoy!', '😋' FROM recipes WHERE name = 'Smoothie Bowl';

-- Bagel with Cream Cheese (id: 11)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Cut bagel in half', '🔪' FROM recipes WHERE name = 'Bagel with Cream Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Put bagel halves in toaster', '🍞' FROM recipes WHERE name = 'Bagel with Cream Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Push toaster lever down', '👇' FROM recipes WHERE name = 'Bagel with Cream Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Wait for bagel to pop up', '⏰' FROM recipes WHERE name = 'Bagel with Cream Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Get cream cheese and knife', '🧀' FROM recipes WHERE name = 'Bagel with Cream Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Spread cream cheese on bagel', '🔪' FROM recipes WHERE name = 'Bagel with Cream Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Put halves together or eat open', '🥯' FROM recipes WHERE name = 'Bagel with Cream Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Enjoy!', '😋' FROM recipes WHERE name = 'Bagel with Cream Cheese';

-- Overnight Oats (id: 12)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Get a jar or container with lid', '🫙' FROM recipes WHERE name = 'Overnight Oats';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Add oats to jar', '🥣' FROM recipes WHERE name = 'Overnight Oats';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Add milk', '🥛' FROM recipes WHERE name = 'Overnight Oats';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Add yogurt', '🥛' FROM recipes WHERE name = 'Overnight Oats';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Add honey or maple syrup', '🍯' FROM recipes WHERE name = 'Overnight Oats';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Stir everything together', '🥄' FROM recipes WHERE name = 'Overnight Oats';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Put lid on jar', '👆' FROM recipes WHERE name = 'Overnight Oats';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Put in refrigerator overnight', '❄️' FROM recipes WHERE name = 'Overnight Oats';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 9, 'In morning, add fruit on top', '🍓' FROM recipes WHERE name = 'Overnight Oats';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 10, 'Eat cold or warm up', '😋' FROM recipes WHERE name = 'Overnight Oats';

-- Egg on Toast (id: 13)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Put bread in toaster', '🍞' FROM recipes WHERE name = 'Egg on Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Push toaster lever down', '👇' FROM recipes WHERE name = 'Egg on Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Heat pan on medium', '🍳' FROM recipes WHERE name = 'Egg on Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Add butter to pan', '🧈' FROM recipes WHERE name = 'Egg on Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Crack egg into pan', '🥚' FROM recipes WHERE name = 'Egg on Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Cook until white is set', '⏰' FROM recipes WHERE name = 'Egg on Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Toast pops up - put on plate', '🍽️' FROM recipes WHERE name = 'Egg on Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Put egg on toast', '🍳' FROM recipes WHERE name = 'Egg on Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 9, 'Add salt and pepper', '🧂' FROM recipes WHERE name = 'Egg on Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 10, 'Enjoy!', '😋' FROM recipes WHERE name = 'Egg on Toast';

-- Toaster Waffles (id: 14)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Get waffles from freezer', '❄️' FROM recipes WHERE name = 'Toaster Waffles';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Put waffles in toaster', '🧇' FROM recipes WHERE name = 'Toaster Waffles';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Push toaster lever down', '👇' FROM recipes WHERE name = 'Toaster Waffles';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Wait for waffles to pop up', '⏰' FROM recipes WHERE name = 'Toaster Waffles';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Put waffles on plate', '🍽️' FROM recipes WHERE name = 'Toaster Waffles';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Add butter on top', '🧈' FROM recipes WHERE name = 'Toaster Waffles';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Add syrup', '🍯' FROM recipes WHERE name = 'Toaster Waffles';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Enjoy!', '😋' FROM recipes WHERE name = 'Toaster Waffles';

-- Banana Bread Slice (id: 15)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Get banana bread', '🍌' FROM recipes WHERE name = 'Banana Bread Slice';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Cut a slice with knife', '🔪' FROM recipes WHERE name = 'Banana Bread Slice';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Put slice on plate', '🍽️' FROM recipes WHERE name = 'Banana Bread Slice';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Add butter if you want', '🧈' FROM recipes WHERE name = 'Banana Bread Slice';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Enjoy!', '😋' FROM recipes WHERE name = 'Banana Bread Slice';

-- Cheese Toast (id: 16)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Turn on oven to broil', '🔥' FROM recipes WHERE name = 'Cheese Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Put bread on baking sheet', '🍞' FROM recipes WHERE name = 'Cheese Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Put cheese on bread', '🧀' FROM recipes WHERE name = 'Cheese Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Put in oven', '👆' FROM recipes WHERE name = 'Cheese Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Watch until cheese melts', '👀' FROM recipes WHERE name = 'Cheese Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Take out with oven mitt', '🧤' FROM recipes WHERE name = 'Cheese Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Let cool a little', '⏰' FROM recipes WHERE name = 'Cheese Toast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Enjoy!', '😋' FROM recipes WHERE name = 'Cheese Toast';

-- Granola Parfait (id: 17)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Get a glass or bowl', '🥛' FROM recipes WHERE name = 'Granola Parfait';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Add yogurt to bottom', '🥄' FROM recipes WHERE name = 'Granola Parfait';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Add layer of granola', '🥣' FROM recipes WHERE name = 'Granola Parfait';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Add layer of fruit', '🍓' FROM recipes WHERE name = 'Granola Parfait';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Add more yogurt', '🥄' FROM recipes WHERE name = 'Granola Parfait';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Add more granola', '🥣' FROM recipes WHERE name = 'Granola Parfait';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Top with fruit', '🫐' FROM recipes WHERE name = 'Granola Parfait';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Enjoy!', '😋' FROM recipes WHERE name = 'Granola Parfait';

-- English Muffin Breakfast (id: 18)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Split English muffin in half', '🍞' FROM recipes WHERE name = 'English Muffin Breakfast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Put in toaster', '👇' FROM recipes WHERE name = 'English Muffin Breakfast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Wait for it to pop up', '⏰' FROM recipes WHERE name = 'English Muffin Breakfast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Put on plate', '🍽️' FROM recipes WHERE name = 'English Muffin Breakfast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Spread butter', '🧈' FROM recipes WHERE name = 'English Muffin Breakfast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Add jam or jelly', '🍓' FROM recipes WHERE name = 'English Muffin Breakfast';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Enjoy!', '😋' FROM recipes WHERE name = 'English Muffin Breakfast';

-- Breakfast Fruit Salad (id: 19)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Get a bowl', '🥣' FROM recipes WHERE name = 'Breakfast Fruit Salad';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Wash all fruit', '🚿' FROM recipes WHERE name = 'Breakfast Fruit Salad';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Cut fruit into small pieces', '🔪' FROM recipes WHERE name = 'Breakfast Fruit Salad';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Put all fruit in bowl', '🍓' FROM recipes WHERE name = 'Breakfast Fruit Salad';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Mix gently with spoon', '🥄' FROM recipes WHERE name = 'Breakfast Fruit Salad';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Add yogurt on top if you want', '🥛' FROM recipes WHERE name = 'Breakfast Fruit Salad';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Enjoy!', '😋' FROM recipes WHERE name = 'Breakfast Fruit Salad';

-- Frozen Hash Browns (id: 20)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Get hash browns from freezer', '❄️' FROM recipes WHERE name = 'Frozen Hash Browns';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Heat pan on medium-high', '🍳' FROM recipes WHERE name = 'Frozen Hash Browns';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Add oil to pan', '🫒' FROM recipes WHERE name = 'Frozen Hash Browns';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Add hash browns to pan', '🥔' FROM recipes WHERE name = 'Frozen Hash Browns';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Cook until golden on bottom', '⏰' FROM recipes WHERE name = 'Frozen Hash Browns';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Flip with spatula', '🔄' FROM recipes WHERE name = 'Frozen Hash Browns';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Cook other side until crispy', '⏰' FROM recipes WHERE name = 'Frozen Hash Browns';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Put on plate', '🍽️' FROM recipes WHERE name = 'Frozen Hash Browns';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 9, 'Add salt', '🧂' FROM recipes WHERE name = 'Frozen Hash Browns';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 10, 'Enjoy!', '😋' FROM recipes WHERE name = 'Frozen Hash Browns';

-- =====================================================
-- LUNCH RECIPES
-- =====================================================

-- Veggie Wrap (id: 22)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Get a tortilla', '🫓' FROM recipes WHERE name = 'Veggie Wrap';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Spread hummus on tortilla', '🥄' FROM recipes WHERE name = 'Veggie Wrap';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Add lettuce', '🥬' FROM recipes WHERE name = 'Veggie Wrap';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Add tomato slices', '🍅' FROM recipes WHERE name = 'Veggie Wrap';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Add cucumber slices', '🥒' FROM recipes WHERE name = 'Veggie Wrap';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Add cheese if you want', '🧀' FROM recipes WHERE name = 'Veggie Wrap';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Roll up tight', '🌯' FROM recipes WHERE name = 'Veggie Wrap';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Cut in half', '🔪' FROM recipes WHERE name = 'Veggie Wrap';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 9, 'Enjoy!', '😋' FROM recipes WHERE name = 'Veggie Wrap';

-- Grilled Cheese Sandwich (id: 23)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Get 2 slices of bread', '🍞' FROM recipes WHERE name = 'Grilled Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Butter one side of each slice', '🧈' FROM recipes WHERE name = 'Grilled Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Heat pan on medium', '🍳' FROM recipes WHERE name = 'Grilled Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Put one bread butter-side down in pan', '🍞' FROM recipes WHERE name = 'Grilled Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Put cheese on top', '🧀' FROM recipes WHERE name = 'Grilled Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Put second bread on top butter-side up', '🍞' FROM recipes WHERE name = 'Grilled Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Cook until golden on bottom', '⏰' FROM recipes WHERE name = 'Grilled Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Flip with spatula', '🔄' FROM recipes WHERE name = 'Grilled Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 9, 'Cook other side until golden', '⏰' FROM recipes WHERE name = 'Grilled Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 10, 'Put on plate and cut in half', '🔪' FROM recipes WHERE name = 'Grilled Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 11, 'Enjoy!', '😋' FROM recipes WHERE name = 'Grilled Cheese Sandwich';

-- PB&J Sandwich (id: 24)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Get 2 slices of bread', '🍞' FROM recipes WHERE name = 'PB&J Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Get peanut butter and jelly', '🥜' FROM recipes WHERE name = 'PB&J Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Spread peanut butter on one slice', '🔪' FROM recipes WHERE name = 'PB&J Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Spread jelly on other slice', '🍇' FROM recipes WHERE name = 'PB&J Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Put slices together', '🥪' FROM recipes WHERE name = 'PB&J Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Cut in half if you want', '🔪' FROM recipes WHERE name = 'PB&J Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Enjoy!', '😋' FROM recipes WHERE name = 'PB&J Sandwich';

-- Turkey Sandwich (id: 25)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Get 2 slices of bread', '🍞' FROM recipes WHERE name = 'Turkey Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Spread mayo or mustard on bread', '🥄' FROM recipes WHERE name = 'Turkey Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Add turkey slices', '🦃' FROM recipes WHERE name = 'Turkey Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Add cheese slice', '🧀' FROM recipes WHERE name = 'Turkey Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Add lettuce', '🥬' FROM recipes WHERE name = 'Turkey Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Add tomato slice', '🍅' FROM recipes WHERE name = 'Turkey Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Put top bread on', '🍞' FROM recipes WHERE name = 'Turkey Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Cut in half', '🔪' FROM recipes WHERE name = 'Turkey Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 9, 'Enjoy!', '😋' FROM recipes WHERE name = 'Turkey Sandwich';

-- Ham & Cheese Sandwich (id: 26)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Get 2 slices of bread', '🍞' FROM recipes WHERE name = 'Ham & Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Spread mayo or mustard on bread', '🥄' FROM recipes WHERE name = 'Ham & Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Add ham slices', '🥓' FROM recipes WHERE name = 'Ham & Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Add cheese slice', '🧀' FROM recipes WHERE name = 'Ham & Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Add lettuce if you want', '🥬' FROM recipes WHERE name = 'Ham & Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Put top bread on', '🍞' FROM recipes WHERE name = 'Ham & Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Cut in half', '🔪' FROM recipes WHERE name = 'Ham & Cheese Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Enjoy!', '😋' FROM recipes WHERE name = 'Ham & Cheese Sandwich';

-- Tuna Salad (id: 27)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Open can of tuna', '🥫' FROM recipes WHERE name = 'Tuna Salad';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Drain water from tuna', '💧' FROM recipes WHERE name = 'Tuna Salad';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Put tuna in bowl', '🥣' FROM recipes WHERE name = 'Tuna Salad';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Add mayo', '🥄' FROM recipes WHERE name = 'Tuna Salad';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Add a little salt and pepper', '🧂' FROM recipes WHERE name = 'Tuna Salad';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Mix together with fork', '🍴' FROM recipes WHERE name = 'Tuna Salad';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Put on bread or crackers', '🍞' FROM recipes WHERE name = 'Tuna Salad';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Enjoy!', '😋' FROM recipes WHERE name = 'Tuna Salad';

-- Chicken Nuggets (id: 28)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Get chicken nuggets from freezer', '❄️' FROM recipes WHERE name = 'Chicken Nuggets';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Turn on oven to 400°F', '🔥' FROM recipes WHERE name = 'Chicken Nuggets';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Put nuggets on baking sheet', '🍗' FROM recipes WHERE name = 'Chicken Nuggets';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Put in oven', '👆' FROM recipes WHERE name = 'Chicken Nuggets';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Set timer for 15 minutes', '⏰' FROM recipes WHERE name = 'Chicken Nuggets';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'When timer beeps, check if done', '👀' FROM recipes WHERE name = 'Chicken Nuggets';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Take out with oven mitt', '🧤' FROM recipes WHERE name = 'Chicken Nuggets';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Let cool a little', '⏰' FROM recipes WHERE name = 'Chicken Nuggets';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 9, 'Serve with dipping sauce', '🥫' FROM recipes WHERE name = 'Chicken Nuggets';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 10, 'Enjoy!', '😋' FROM recipes WHERE name = 'Chicken Nuggets';

-- Mac and Cheese (id: 29)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Fill pot with water', '💧' FROM recipes WHERE name = 'Mac and Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Put pot on stove on high', '🔥' FROM recipes WHERE name = 'Mac and Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Wait for water to boil (bubbles)', '💨' FROM recipes WHERE name = 'Mac and Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Add macaroni to water', '🍝' FROM recipes WHERE name = 'Mac and Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Cook for time on box (about 8 min)', '⏰' FROM recipes WHERE name = 'Mac and Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Ask adult to drain water', '💧' FROM recipes WHERE name = 'Mac and Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Add butter', '🧈' FROM recipes WHERE name = 'Mac and Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Add milk', '🥛' FROM recipes WHERE name = 'Mac and Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 9, 'Add cheese packet', '🧀' FROM recipes WHERE name = 'Mac and Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 10, 'Stir until mixed', '🥄' FROM recipes WHERE name = 'Mac and Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 11, 'Enjoy!', '😋' FROM recipes WHERE name = 'Mac and Cheese';

-- Pizza Bagels (id: 30)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Turn oven to 375°F', '🔥' FROM recipes WHERE name = 'Pizza Bagels';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Cut bagels in half', '🔪' FROM recipes WHERE name = 'Pizza Bagels';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Put bagels on baking sheet', '🥯' FROM recipes WHERE name = 'Pizza Bagels';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Spread pizza sauce on each half', '🍅' FROM recipes WHERE name = 'Pizza Bagels';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Add shredded cheese on top', '🧀' FROM recipes WHERE name = 'Pizza Bagels';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Add toppings if you want', '🍕' FROM recipes WHERE name = 'Pizza Bagels';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Put in oven', '👆' FROM recipes WHERE name = 'Pizza Bagels';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Bake for 10 minutes', '⏰' FROM recipes WHERE name = 'Pizza Bagels';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 9, 'Take out with oven mitt', '🧤' FROM recipes WHERE name = 'Pizza Bagels';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 10, 'Let cool a little', '⏰' FROM recipes WHERE name = 'Pizza Bagels';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 11, 'Enjoy!', '😋' FROM recipes WHERE name = 'Pizza Bagels';

-- Hot Dog (id: 32)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Fill pot with water', '💧' FROM recipes WHERE name = 'Hot Dog';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Put pot on stove on high', '🔥' FROM recipes WHERE name = 'Hot Dog';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Wait for water to boil', '💨' FROM recipes WHERE name = 'Hot Dog';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Add hot dog to water', '🌭' FROM recipes WHERE name = 'Hot Dog';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Cook for 5 minutes', '⏰' FROM recipes WHERE name = 'Hot Dog';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Take hot dog out with tongs', '🥢' FROM recipes WHERE name = 'Hot Dog';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Put hot dog in bun', '🍞' FROM recipes WHERE name = 'Hot Dog';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Add ketchup and mustard', '🍅' FROM recipes WHERE name = 'Hot Dog';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 9, 'Enjoy!', '😋' FROM recipes WHERE name = 'Hot Dog';

-- Soup with Crackers (id: 31)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Open can of soup', '🥫' FROM recipes WHERE name = 'Soup with Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Pour soup into microwave-safe bowl', '🥣' FROM recipes WHERE name = 'Soup with Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Put bowl in microwave', '📦' FROM recipes WHERE name = 'Soup with Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Heat for 2 minutes', '⏰' FROM recipes WHERE name = 'Soup with Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Stir soup', '🥄' FROM recipes WHERE name = 'Soup with Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Heat 1 more minute', '⏰' FROM recipes WHERE name = 'Soup with Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Carefully take out (hot!)', '🔥' FROM recipes WHERE name = 'Soup with Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Get crackers', '🍘' FROM recipes WHERE name = 'Soup with Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 9, 'Enjoy soup with crackers!', '😋' FROM recipes WHERE name = 'Soup with Crackers';

-- Cheesy Nachos (id: 33)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 1, 'Put chips on microwave-safe plate', '🍟' FROM recipes WHERE name = 'Cheesy Nachos';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 2, 'Sprinkle shredded cheese on chips', '🧀' FROM recipes WHERE name = 'Cheesy Nachos';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 3, 'Put in microwave', '📦' FROM recipes WHERE name = 'Cheesy Nachos';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 4, 'Heat for 30-45 seconds', '⏰' FROM recipes WHERE name = 'Cheesy Nachos';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 5, 'Check if cheese is melted', '👀' FROM recipes WHERE name = 'Cheesy Nachos';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 6, 'Take out carefully', '🔥' FROM recipes WHERE name = 'Cheesy Nachos';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 7, 'Add salsa if you want', '🍅' FROM recipes WHERE name = 'Cheesy Nachos';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) 
SELECT id, 8, 'Enjoy!', '😋' FROM recipes WHERE name = 'Cheesy Nachos';

-- Verify the update
SELECT 'Recipe steps added!' as status;
SELECT r.name, COUNT(rs.id) as steps FROM recipes r LEFT JOIN recipe_steps rs ON rs.recipe_id = r.id GROUP BY r.name ORDER BY r.name LIMIT 20;
