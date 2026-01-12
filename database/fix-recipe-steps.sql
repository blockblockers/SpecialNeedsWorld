-- Fix Recipe Steps - Replace "Follow the recipe" with actual instructions
-- Run this in Supabase SQL Editor

-- First, delete the placeholder steps
DELETE FROM recipe_steps WHERE instruction = 'Follow the recipe';

-- Now insert proper steps for each recipe
-- Using task analysis approach with discrete, clear steps

-- =====================================================
-- BREAKFAST RECIPES
-- =====================================================

-- Avocado Toast (id: 7)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('7', 1, 'Get bread and put in toaster', '🍞'),
('7', 2, 'Push toaster lever down', '👇'),
('7', 3, 'Wait for toast to pop up', '⏰'),
('7', 4, 'Cut avocado in half with knife', '🔪'),
('7', 5, 'Scoop avocado out with spoon', '🥄'),
('7', 6, 'Put avocado on toast', '🥑'),
('7', 7, 'Mash with fork', '🍴'),
('7', 8, 'Add salt if you want', '🧂'),
('7', 9, 'Enjoy your avocado toast!', '😋');

-- French Toast (id: 8)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('8', 1, 'Crack 2 eggs into bowl', '🥚'),
('8', 2, 'Add splash of milk', '🥛'),
('8', 3, 'Add cinnamon', '✨'),
('8', 4, 'Mix with fork', '🍴'),
('8', 5, 'Heat pan on medium', '🍳'),
('8', 6, 'Add butter to pan', '🧈'),
('8', 7, 'Dip bread in egg mix', '🍞'),
('8', 8, 'Put bread in pan', '🍳'),
('8', 9, 'Cook until golden brown', '⏰'),
('8', 10, 'Flip with spatula', '🔄'),
('8', 11, 'Cook other side', '⏰'),
('8', 12, 'Put on plate and add syrup', '🍯');

-- Simple Pancakes (id: 9)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('9', 1, 'Get pancake mix and bowl', '🥣'),
('9', 2, 'Add pancake mix to bowl', '📦'),
('9', 3, 'Add water or milk', '🥛'),
('9', 4, 'Stir until smooth', '🥄'),
('9', 5, 'Heat pan on medium', '🍳'),
('9', 6, 'Spray pan with cooking spray', '💨'),
('9', 7, 'Pour batter into pan', '🥞'),
('9', 8, 'Wait for bubbles on top', '⏰'),
('9', 9, 'Flip pancake with spatula', '🔄'),
('9', 10, 'Cook until golden', '⏰'),
('9', 11, 'Put on plate', '🍽️'),
('9', 12, 'Add butter and syrup', '🧈');

-- Smoothie Bowl (id: 10)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('10', 1, 'Get blender', '🫙'),
('10', 2, 'Add frozen fruit to blender', '🍓'),
('10', 3, 'Add yogurt', '🥛'),
('10', 4, 'Add a little milk', '🥛'),
('10', 5, 'Put lid on blender', '👆'),
('10', 6, 'Blend until smooth', '🔄'),
('10', 7, 'Pour into bowl', '🥣'),
('10', 8, 'Add toppings on top', '🫐'),
('10', 9, 'Enjoy!', '😋');

-- Bagel with Cream Cheese (id: 11)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('11', 1, 'Cut bagel in half', '🔪'),
('11', 2, 'Put bagel halves in toaster', '🍞'),
('11', 3, 'Push toaster lever down', '👇'),
('11', 4, 'Wait for bagel to pop up', '⏰'),
('11', 5, 'Get cream cheese and knife', '🧀'),
('11', 6, 'Spread cream cheese on bagel', '🔪'),
('11', 7, 'Put halves together or eat open', '🥯'),
('11', 8, 'Enjoy!', '😋');

-- Overnight Oats (id: 12)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('12', 1, 'Get a jar or container with lid', '🫙'),
('12', 2, 'Add oats to jar', '🥣'),
('12', 3, 'Add milk', '🥛'),
('12', 4, 'Add yogurt', '🥛'),
('12', 5, 'Add honey or maple syrup', '🍯'),
('12', 6, 'Stir everything together', '🥄'),
('12', 7, 'Put lid on jar', '👆'),
('12', 8, 'Put in refrigerator overnight', '❄️'),
('12', 9, 'In morning, add fruit on top', '🍓'),
('12', 10, 'Eat cold or warm up', '😋');

-- Egg on Toast (id: 13)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('13', 1, 'Put bread in toaster', '🍞'),
('13', 2, 'Push toaster lever down', '👇'),
('13', 3, 'Heat pan on medium', '🍳'),
('13', 4, 'Add butter to pan', '🧈'),
('13', 5, 'Crack egg into pan', '🥚'),
('13', 6, 'Cook until white is set', '⏰'),
('13', 7, 'Toast pops up - put on plate', '🍽️'),
('13', 8, 'Put egg on toast', '🍳'),
('13', 9, 'Add salt and pepper', '🧂'),
('13', 10, 'Enjoy!', '😋');

-- Toaster Waffles (id: 14)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('14', 1, 'Get waffles from freezer', '❄️'),
('14', 2, 'Put waffles in toaster', '🧇'),
('14', 3, 'Push toaster lever down', '👇'),
('14', 4, 'Wait for waffles to pop up', '⏰'),
('14', 5, 'Put waffles on plate', '🍽️'),
('14', 6, 'Add butter on top', '🧈'),
('14', 7, 'Add syrup', '🍯'),
('14', 8, 'Enjoy!', '😋');

-- Banana Bread Slice (id: 15)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('15', 1, 'Get banana bread', '🍌'),
('15', 2, 'Cut a slice with knife', '🔪'),
('15', 3, 'Put slice on plate', '🍽️'),
('15', 4, 'Add butter if you want', '🧈'),
('15', 5, 'Enjoy!', '😋');

-- Cheese Toast (id: 16)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('16', 1, 'Turn on oven to broil', '🔥'),
('16', 2, 'Put bread on baking sheet', '🍞'),
('16', 3, 'Put cheese on bread', '🧀'),
('16', 4, 'Put in oven', '👆'),
('16', 5, 'Watch until cheese melts', '👀'),
('16', 6, 'Take out with oven mitt', '🧤'),
('16', 7, 'Let cool a little', '⏰'),
('16', 8, 'Enjoy!', '😋');

-- Granola Parfait (id: 17)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('17', 1, 'Get a glass or bowl', '🥛'),
('17', 2, 'Add yogurt to bottom', '🥄'),
('17', 3, 'Add layer of granola', '🥣'),
('17', 4, 'Add layer of fruit', '🍓'),
('17', 5, 'Add more yogurt', '🥄'),
('17', 6, 'Add more granola', '🥣'),
('17', 7, 'Top with fruit', '🫐'),
('17', 8, 'Enjoy!', '😋');

-- English Muffin Breakfast (id: 18)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('18', 1, 'Split English muffin in half', '🍞'),
('18', 2, 'Put in toaster', '👇'),
('18', 3, 'Wait for it to pop up', '⏰'),
('18', 4, 'Put on plate', '🍽️'),
('18', 5, 'Spread butter', '🧈'),
('18', 6, 'Add jam or jelly', '🍓'),
('18', 7, 'Enjoy!', '😋');

-- Breakfast Fruit Salad (id: 19)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('19', 1, 'Get a bowl', '🥣'),
('19', 2, 'Wash all fruit', '🚿'),
('19', 3, 'Cut fruit into small pieces', '🔪'),
('19', 4, 'Put all fruit in bowl', '🍓'),
('19', 5, 'Mix gently with spoon', '🥄'),
('19', 6, 'Add yogurt on top if you want', '🥛'),
('19', 7, 'Enjoy!', '😋');

-- Frozen Hash Browns (id: 20)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('20', 1, 'Get hash browns from freezer', '❄️'),
('20', 2, 'Heat pan on medium-high', '🍳'),
('20', 3, 'Add oil to pan', '🫒'),
('20', 4, 'Add hash browns to pan', '🥔'),
('20', 5, 'Cook until golden on bottom', '⏰'),
('20', 6, 'Flip with spatula', '🔄'),
('20', 7, 'Cook other side until crispy', '⏰'),
('20', 8, 'Put on plate', '🍽️'),
('20', 9, 'Add salt', '🧂'),
('20', 10, 'Enjoy!', '😋');

-- =====================================================
-- LUNCH RECIPES
-- =====================================================

-- Veggie Wrap (id: 22)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('22', 1, 'Get a tortilla', '🫓'),
('22', 2, 'Spread hummus on tortilla', '🥄'),
('22', 3, 'Add lettuce', '🥬'),
('22', 4, 'Add tomato slices', '🍅'),
('22', 5, 'Add cucumber slices', '🥒'),
('22', 6, 'Add cheese if you want', '🧀'),
('22', 7, 'Roll up tight', '🌯'),
('22', 8, 'Cut in half', '🔪'),
('22', 9, 'Enjoy!', '😋');

-- Grilled Cheese Sandwich (id: 23)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('23', 1, 'Get 2 slices of bread', '🍞'),
('23', 2, 'Butter one side of each slice', '🧈'),
('23', 3, 'Heat pan on medium', '🍳'),
('23', 4, 'Put one bread butter-side down in pan', '🍞'),
('23', 5, 'Put cheese on top', '🧀'),
('23', 6, 'Put second bread on top butter-side up', '🍞'),
('23', 7, 'Cook until golden on bottom', '⏰'),
('23', 8, 'Flip with spatula', '🔄'),
('23', 9, 'Cook other side until golden', '⏰'),
('23', 10, 'Put on plate and cut in half', '🔪'),
('23', 11, 'Enjoy!', '😋');

-- PB&J Sandwich (id: 24)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('24', 1, 'Get 2 slices of bread', '🍞'),
('24', 2, 'Get peanut butter and jelly', '🥜'),
('24', 3, 'Spread peanut butter on one slice', '🔪'),
('24', 4, 'Spread jelly on other slice', '🍇'),
('24', 5, 'Put slices together', '🥪'),
('24', 6, 'Cut in half if you want', '🔪'),
('24', 7, 'Enjoy!', '😋');

-- Turkey Sandwich (id: 25)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('25', 1, 'Get 2 slices of bread', '🍞'),
('25', 2, 'Spread mayo or mustard on bread', '🥄'),
('25', 3, 'Add turkey slices', '🦃'),
('25', 4, 'Add cheese slice', '🧀'),
('25', 5, 'Add lettuce', '🥬'),
('25', 6, 'Add tomato slice', '🍅'),
('25', 7, 'Put top bread on', '🍞'),
('25', 8, 'Cut in half', '🔪'),
('25', 9, 'Enjoy!', '😋');

-- Ham & Cheese Sandwich (id: 26)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('26', 1, 'Get 2 slices of bread', '🍞'),
('26', 2, 'Spread mayo or mustard on bread', '🥄'),
('26', 3, 'Add ham slices', '🥓'),
('26', 4, 'Add cheese slice', '🧀'),
('26', 5, 'Add lettuce if you want', '🥬'),
('26', 6, 'Put top bread on', '🍞'),
('26', 7, 'Cut in half', '🔪'),
('26', 8, 'Enjoy!', '😋');

-- Tuna Salad (id: 27)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('27', 1, 'Open can of tuna', '🥫'),
('27', 2, 'Drain water from tuna', '💧'),
('27', 3, 'Put tuna in bowl', '🥣'),
('27', 4, 'Add mayo', '🥄'),
('27', 5, 'Add a little salt and pepper', '🧂'),
('27', 6, 'Mix together with fork', '🍴'),
('27', 7, 'Put on bread or crackers', '🍞'),
('27', 8, 'Enjoy!', '😋');

-- Chicken Nuggets (id: 28)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('28', 1, 'Get chicken nuggets from freezer', '❄️'),
('28', 2, 'Turn on oven to 400°F', '🔥'),
('28', 3, 'Put nuggets on baking sheet', '🍗'),
('28', 4, 'Put in oven', '👆'),
('28', 5, 'Set timer for 15 minutes', '⏰'),
('28', 6, 'When timer beeps, check if done', '👀'),
('28', 7, 'Take out with oven mitt', '🧤'),
('28', 8, 'Let cool a little', '⏰'),
('28', 9, 'Serve with dipping sauce', '🥫'),
('28', 10, 'Enjoy!', '😋');

-- Mac and Cheese (id: 29)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('29', 1, 'Fill pot with water', '💧'),
('29', 2, 'Put pot on stove on high', '🔥'),
('29', 3, 'Wait for water to boil (bubbles)', '💨'),
('29', 4, 'Add macaroni to water', '🍝'),
('29', 5, 'Cook for time on box (about 8 min)', '⏰'),
('29', 6, 'Ask adult to drain water', '💧'),
('29', 7, 'Add butter', '🧈'),
('29', 8, 'Add milk', '🥛'),
('29', 9, 'Add cheese packet', '🧀'),
('29', 10, 'Stir until mixed', '🥄'),
('29', 11, 'Enjoy!', '😋');

-- Pizza Bagels (id: 30)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('30', 1, 'Turn oven to 375°F', '🔥'),
('30', 2, 'Cut bagels in half', '🔪'),
('30', 3, 'Put bagels on baking sheet', '🥯'),
('30', 4, 'Spread pizza sauce on each half', '🍅'),
('30', 5, 'Add shredded cheese on top', '🧀'),
('30', 6, 'Add toppings if you want', '🍕'),
('30', 7, 'Put in oven', '👆'),
('30', 8, 'Bake for 10 minutes', '⏰'),
('30', 9, 'Take out with oven mitt', '🧤'),
('30', 10, 'Let cool a little', '⏰'),
('30', 11, 'Enjoy!', '😋');

-- Soup with Crackers (id: 31)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('31', 1, 'Open can of soup', '🥫'),
('31', 2, 'Pour soup into microwave-safe bowl', '🥣'),
('31', 3, 'Put bowl in microwave', '📦'),
('31', 4, 'Heat for 2 minutes', '⏰'),
('31', 5, 'Stir soup', '🥄'),
('31', 6, 'Heat 1 more minute', '⏰'),
('31', 7, 'Carefully take out (hot!)', '🔥'),
('31', 8, 'Get crackers', '🍘'),
('31', 9, 'Enjoy soup with crackers!', '😋');

-- Hot Dog (id: 32)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('32', 1, 'Fill pot with water', '💧'),
('32', 2, 'Put pot on stove on high', '🔥'),
('32', 3, 'Wait for water to boil', '💨'),
('32', 4, 'Add hot dog to water', '🌭'),
('32', 5, 'Cook for 5 minutes', '⏰'),
('32', 6, 'Take hot dog out with tongs', '🥢'),
('32', 7, 'Put hot dog in bun', '🍞'),
('32', 8, 'Add ketchup and mustard', '🍅'),
('32', 9, 'Enjoy!', '😋');

-- Cheesy Nachos (id: 33)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('33', 1, 'Put chips on microwave-safe plate', '🍟'),
('33', 2, 'Sprinkle shredded cheese on chips', '🧀'),
('33', 3, 'Put in microwave', '📦'),
('33', 4, 'Heat for 30-45 seconds', '⏰'),
('33', 5, 'Check if cheese is melted', '👀'),
('33', 6, 'Take out carefully', '🔥'),
('33', 7, 'Add salsa if you want', '🍅'),
('33', 8, 'Enjoy!', '😋');

-- Egg Salad Sandwich (id: 34)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('34', 1, 'Peel hard boiled eggs', '🥚'),
('34', 2, 'Put eggs in bowl', '🥣'),
('34', 3, 'Mash eggs with fork', '🍴'),
('34', 4, 'Add mayo', '🥄'),
('34', 5, 'Add salt and pepper', '🧂'),
('34', 6, 'Mix together', '🥄'),
('34', 7, 'Put on bread', '🍞'),
('34', 8, 'Add lettuce if you want', '🥬'),
('34', 9, 'Put top bread on', '🍞'),
('34', 10, 'Enjoy!', '😋');

-- Hummus with Veggies (id: 35)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('35', 1, 'Get hummus from fridge', '🥫'),
('35', 2, 'Put hummus in small bowl', '🥣'),
('35', 3, 'Wash vegetables', '🚿'),
('35', 4, 'Cut veggies into sticks', '🔪'),
('35', 5, 'Put veggies on plate', '🥕'),
('35', 6, 'Dip veggies in hummus', '👆'),
('35', 7, 'Enjoy!', '😋');

-- Cheese and Crackers (id: 36)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('36', 1, 'Get cheese from fridge', '🧀'),
('36', 2, 'Cut cheese into small squares', '🔪'),
('36', 3, 'Get crackers', '🍘'),
('36', 4, 'Put crackers on plate', '🍽️'),
('36', 5, 'Put cheese on crackers', '🧀'),
('36', 6, 'Enjoy!', '😋');

-- Bean & Cheese Burrito (id: 37)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('37', 1, 'Open can of refried beans', '🥫'),
('37', 2, 'Put beans in microwave-safe bowl', '🥣'),
('37', 3, 'Heat beans for 1 minute', '⏰'),
('37', 4, 'Stir and heat 30 more seconds', '🥄'),
('37', 5, 'Warm tortilla in microwave 15 seconds', '🫓'),
('37', 6, 'Spread beans on tortilla', '🥄'),
('37', 7, 'Add shredded cheese', '🧀'),
('37', 8, 'Roll up burrito', '🌯'),
('37', 9, 'Enjoy!', '😋');

-- Cucumber Sandwiches (id: 38)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('38', 1, 'Get bread slices', '🍞'),
('38', 2, 'Spread cream cheese on bread', '🧀'),
('38', 3, 'Wash cucumber', '🚿'),
('38', 4, 'Cut cucumber into thin circles', '🔪'),
('38', 5, 'Put cucumber slices on bread', '🥒'),
('38', 6, 'Add a little salt', '🧂'),
('38', 7, 'Put top bread on', '🍞'),
('38', 8, 'Cut in half', '🔪'),
('38', 9, 'Enjoy!', '😋');

-- Instant Ramen (id: 39)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('39', 1, 'Boil water in kettle or pot', '💧'),
('39', 2, 'Open ramen package', '📦'),
('39', 3, 'Put noodles in bowl', '🍜'),
('39', 4, 'Add flavor packet to bowl', '✨'),
('39', 5, 'Pour hot water over noodles', '💧'),
('39', 6, 'Cover bowl with plate', '🍽️'),
('39', 7, 'Wait 3 minutes', '⏰'),
('39', 8, 'Stir noodles', '🥄'),
('39', 9, 'Enjoy!', '😋');

-- Corn Dogs (id: 40)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('40', 1, 'Turn oven to 375°F', '🔥'),
('40', 2, 'Get corn dogs from freezer', '❄️'),
('40', 3, 'Put corn dogs on baking sheet', '🌭'),
('40', 4, 'Put in oven', '👆'),
('40', 5, 'Bake for 15-20 minutes', '⏰'),
('40', 6, 'Take out with oven mitt', '🧤'),
('40', 7, 'Let cool a little', '⏰'),
('40', 8, 'Serve with ketchup or mustard', '🍅'),
('40', 9, 'Enjoy!', '😋');

-- =====================================================
-- DINNER RECIPES
-- =====================================================

-- Baked Potato (id: 42)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('42', 1, 'Wash potato', '🚿'),
('42', 2, 'Poke holes in potato with fork', '🍴'),
('42', 3, 'Put potato on microwave-safe plate', '🥔'),
('42', 4, 'Microwave for 5 minutes', '⏰'),
('42', 5, 'Flip potato over', '🔄'),
('42', 6, 'Microwave for 5 more minutes', '⏰'),
('42', 7, 'Check if soft (ask adult to help)', '👆'),
('42', 8, 'Cut open on top', '🔪'),
('42', 9, 'Add butter', '🧈'),
('42', 10, 'Add sour cream and cheese', '🧀'),
('42', 11, 'Enjoy!', '😋');

-- Fish Sticks (id: 43)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('43', 1, 'Turn oven to 425°F', '🔥'),
('43', 2, 'Get fish sticks from freezer', '❄️'),
('43', 3, 'Put fish sticks on baking sheet', '🐟'),
('43', 4, 'Put in oven', '👆'),
('43', 5, 'Bake for 15-17 minutes', '⏰'),
('43', 6, 'Take out with oven mitt', '🧤'),
('43', 7, 'Let cool a little', '⏰'),
('43', 8, 'Serve with tartar sauce or ketchup', '🥫'),
('43', 9, 'Enjoy!', '😋');

-- Chicken and Rice (id: 44)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('44', 1, 'Cook instant rice following box directions', '🍚'),
('44', 2, 'Get cooked chicken (rotisserie or leftover)', '🍗'),
('44', 3, 'Cut chicken into small pieces', '🔪'),
('44', 4, 'Put rice in bowl', '🥣'),
('44', 5, 'Add chicken on top', '🍗'),
('44', 6, 'Add butter if you want', '🧈'),
('44', 7, 'Season with salt and pepper', '🧂'),
('44', 8, 'Enjoy!', '😋');

-- Easy Tacos (id: 45)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('45', 1, 'Cook ground beef in pan on medium', '🥩'),
('45', 2, 'Break up meat with spatula while cooking', '🍳'),
('45', 3, 'When brown, drain fat (ask adult)', '💧'),
('45', 4, 'Add taco seasoning', '✨'),
('45', 5, 'Add water as packet says', '💧'),
('45', 6, 'Simmer 5 minutes', '⏰'),
('45', 7, 'Warm taco shells', '🌮'),
('45', 8, 'Fill shells with meat', '🥄'),
('45', 9, 'Add cheese, lettuce, tomato', '🧀'),
('45', 10, 'Enjoy!', '😋');

-- Spaghetti & Meatballs (id: 46)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('46', 1, 'Fill large pot with water', '💧'),
('46', 2, 'Put pot on stove on high', '🔥'),
('46', 3, 'Wait for water to boil', '💨'),
('46', 4, 'Add spaghetti to water', '🍝'),
('46', 5, 'Cook for time on box', '⏰'),
('46', 6, 'Heat frozen meatballs (follow package)', '🍖'),
('46', 7, 'Heat pasta sauce in pot', '🍅'),
('46', 8, 'Drain pasta (ask adult to help)', '💧'),
('46', 9, 'Put pasta in bowl', '🥣'),
('46', 10, 'Add sauce and meatballs', '🍅'),
('46', 11, 'Enjoy!', '😋');

-- English Muffin Pizzas (id: 47)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('47', 1, 'Turn oven to 375°F', '🔥'),
('47', 2, 'Split English muffins in half', '🍞'),
('47', 3, 'Put muffins on baking sheet', '🍽️'),
('47', 4, 'Spread pizza sauce on each half', '🍅'),
('47', 5, 'Add shredded cheese', '🧀'),
('47', 6, 'Add toppings if you want', '🍕'),
('47', 7, 'Put in oven', '👆'),
('47', 8, 'Bake for 10 minutes', '⏰'),
('47', 9, 'Take out with oven mitt', '🧤'),
('47', 10, 'Let cool a little', '⏰'),
('47', 11, 'Enjoy!', '😋');

-- Baked Chicken Tenders (id: 48)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('48', 1, 'Turn oven to 400°F', '🔥'),
('48', 2, 'Get chicken tenders from freezer', '❄️'),
('48', 3, 'Put tenders on baking sheet', '🍗'),
('48', 4, 'Put in oven', '👆'),
('48', 5, 'Bake for 18-20 minutes', '⏰'),
('48', 6, 'Check if cooked through', '👀'),
('48', 7, 'Take out with oven mitt', '🧤'),
('48', 8, 'Let cool a little', '⏰'),
('48', 9, 'Serve with dipping sauce', '🥫'),
('48', 10, 'Enjoy!', '😋');

-- Veggie Stir Fry (id: 49)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('49', 1, 'Get frozen stir fry vegetables', '❄️'),
('49', 2, 'Heat pan on medium-high', '🍳'),
('49', 3, 'Add oil to pan', '🫒'),
('49', 4, 'Add frozen vegetables', '🥦'),
('49', 5, 'Stir frequently', '🥄'),
('49', 6, 'Cook for 7-10 minutes', '⏰'),
('49', 7, 'Add soy sauce', '🥫'),
('49', 8, 'Stir to coat', '🥄'),
('49', 9, 'Serve over rice if you want', '🍚'),
('49', 10, 'Enjoy!', '😋');

-- Rice and Beans (id: 50)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('50', 1, 'Cook instant rice following box', '🍚'),
('50', 2, 'Open can of black beans', '🥫'),
('50', 3, 'Put beans in pot', '🥣'),
('50', 4, 'Heat beans on medium', '🔥'),
('50', 5, 'Stir occasionally', '🥄'),
('50', 6, 'Put rice in bowl', '🍚'),
('50', 7, 'Add beans on top', '🫘'),
('50', 8, 'Add cheese if you want', '🧀'),
('50', 9, 'Enjoy!', '😋');

-- Mashed Potatoes (id: 51)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('51', 1, 'Get instant mashed potato flakes', '🥔'),
('51', 2, 'Boil water as box says', '💧'),
('51', 3, 'Add butter to pot', '🧈'),
('51', 4, 'Add milk', '🥛'),
('51', 5, 'Stir in potato flakes', '🥄'),
('51', 6, 'Mix until smooth', '🥄'),
('51', 7, 'Add salt and pepper', '🧂'),
('51', 8, 'Enjoy!', '😋');

-- Simple Hamburger (id: 52)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('52', 1, 'Get frozen burger patty', '❄️'),
('52', 2, 'Heat pan on medium-high', '🍳'),
('52', 3, 'Put patty in pan', '🍔'),
('52', 4, 'Cook for 4 minutes', '⏰'),
('52', 5, 'Flip with spatula', '🔄'),
('52', 6, 'Cook 4 more minutes', '⏰'),
('52', 7, 'Add cheese slice on top if you want', '🧀'),
('52', 8, 'Put patty on bun', '🍞'),
('52', 9, 'Add ketchup, mustard, pickles', '🍅'),
('52', 10, 'Enjoy!', '😋');

-- Frozen Pizza (id: 53)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('53', 1, 'Turn oven to temperature on box', '🔥'),
('53', 2, 'Take pizza out of freezer', '❄️'),
('53', 3, 'Remove plastic wrap', '📦'),
('53', 4, 'Put pizza on oven rack or pan', '🍕'),
('53', 5, 'Put in oven', '👆'),
('53', 6, 'Bake for time on box', '⏰'),
('53', 7, 'Take out with oven mitt', '🧤'),
('53', 8, 'Let cool for 2-3 minutes', '⏰'),
('53', 9, 'Cut into slices', '🔪'),
('53', 10, 'Enjoy!', '😋');

-- Chicken Nuggets Dinner (id: 54)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('54', 1, 'Turn oven to 400°F', '🔥'),
('54', 2, 'Put nuggets on baking sheet', '🍗'),
('54', 3, 'Bake for 15-18 minutes', '⏰'),
('54', 4, 'While nuggets bake, make a side', '🥕'),
('54', 5, 'Take nuggets out when done', '🧤'),
('54', 6, 'Let cool a little', '⏰'),
('54', 7, 'Serve with veggies and dipping sauce', '🥫'),
('54', 8, 'Enjoy!', '😋');

-- Butter Noodles (id: 55)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('55', 1, 'Fill pot with water', '💧'),
('55', 2, 'Put pot on stove on high', '🔥'),
('55', 3, 'Wait for water to boil', '💨'),
('55', 4, 'Add egg noodles', '🍝'),
('55', 5, 'Cook for time on bag', '⏰'),
('55', 6, 'Drain noodles (ask adult to help)', '💧'),
('55', 7, 'Add butter', '🧈'),
('55', 8, 'Add parmesan cheese', '🧀'),
('55', 9, 'Stir together', '🥄'),
('55', 10, 'Enjoy!', '😋');

-- Cheese Ravioli (id: 56)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('56', 1, 'Fill pot with water', '💧'),
('56', 2, 'Put pot on stove on high', '🔥'),
('56', 3, 'Wait for water to boil', '💨'),
('56', 4, 'Add ravioli to water', '🍝'),
('56', 5, 'Cook for time on bag', '⏰'),
('56', 6, 'Drain ravioli (ask adult to help)', '💧'),
('56', 7, 'Put ravioli in bowl', '🥣'),
('56', 8, 'Add pasta sauce', '🍅'),
('56', 9, 'Sprinkle parmesan on top', '🧀'),
('56', 10, 'Enjoy!', '😋');

-- Chicken Quesadilla (id: 57)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('57', 1, 'Get cooked chicken (rotisserie or leftover)', '🍗'),
('57', 2, 'Cut or shred chicken', '🔪'),
('57', 3, 'Heat pan on medium', '🍳'),
('57', 4, 'Put tortilla in pan', '🫓'),
('57', 5, 'Add cheese on half', '🧀'),
('57', 6, 'Add chicken on cheese', '🍗'),
('57', 7, 'Fold tortilla in half', '🌮'),
('57', 8, 'Cook until golden', '⏰'),
('57', 9, 'Flip and cook other side', '🔄'),
('57', 10, 'Cut into triangles', '🔪'),
('57', 11, 'Enjoy!', '😋');

-- Soup and Bread (id: 58)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('58', 1, 'Open can of soup', '🥫'),
('58', 2, 'Pour soup into pot', '🥣'),
('58', 3, 'Heat on medium, stir often', '🥄'),
('58', 4, 'When hot, pour into bowl', '🍜'),
('58', 5, 'Slice bread', '🔪'),
('58', 6, 'Butter bread if you want', '🧈'),
('58', 7, 'Enjoy soup with bread!', '😋');

-- Veggie Burger (id: 59)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('59', 1, 'Get veggie burger patty from freezer', '❄️'),
('59', 2, 'Heat pan on medium', '🍳'),
('59', 3, 'Cook patty following package directions', '🥬'),
('59', 4, 'Flip halfway through', '🔄'),
('59', 5, 'Toast bun if you want', '🍞'),
('59', 6, 'Put patty on bun', '🍔'),
('59', 7, 'Add toppings you like', '🍅'),
('59', 8, 'Enjoy!', '😋');

-- Simple Rice Bowl (id: 60)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('60', 1, 'Cook instant rice following box', '🍚'),
('60', 2, 'Put rice in bowl', '🥣'),
('60', 3, 'Add your favorite toppings', '🥕'),
('60', 4, 'Try: egg, veggies, or meat', '🍳'),
('60', 5, 'Add soy sauce or teriyaki sauce', '🥫'),
('60', 6, 'Mix together', '🥄'),
('60', 7, 'Enjoy!', '😋');

-- =====================================================
-- SNACK RECIPES
-- =====================================================

-- Apple Slices with PB (id: 61)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('61', 1, 'Wash apple', '🚿'),
('61', 2, 'Cut apple into slices (ask adult for help)', '🔪'),
('61', 3, 'Remove seeds', '👆'),
('61', 4, 'Put peanut butter in small bowl', '🥜'),
('61', 5, 'Dip apple slices in peanut butter', '🍎'),
('61', 6, 'Enjoy!', '😋');

-- DIY Trail Mix (id: 63)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('63', 1, 'Get a bowl', '🥣'),
('63', 2, 'Add handful of nuts', '🥜'),
('63', 3, 'Add handful of raisins', '🍇'),
('63', 4, 'Add handful of chocolate chips', '🍫'),
('63', 5, 'Add handful of cereal', '🥣'),
('63', 6, 'Mix everything together', '🥄'),
('63', 7, 'Put in bag or container', '📦'),
('63', 8, 'Enjoy!', '😋');

-- Ants on a Log (id: 64)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('64', 1, 'Wash celery sticks', '🚿'),
('64', 2, 'Cut celery into pieces', '🔪'),
('64', 3, 'Fill celery with peanut butter', '🥜'),
('64', 4, 'Put raisins on top (the ants!)', '🐜'),
('64', 5, 'Put on plate', '🍽️'),
('64', 6, 'Enjoy!', '😋');

-- String Cheese (id: 65)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('65', 1, 'Get string cheese from fridge', '🧀'),
('65', 2, 'Open the wrapper', '📦'),
('65', 3, 'Peel strings off and eat!', '😋');

-- Microwave Popcorn (id: 66)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('66', 1, 'Get popcorn bag from box', '📦'),
('66', 2, 'Take off plastic wrap', '👆'),
('66', 3, 'Put bag in microwave (check which side up)', '📦'),
('66', 4, 'Press popcorn button OR set 2-3 minutes', '👆'),
('66', 5, 'Listen for popping to slow down', '👂'),
('66', 6, 'Stop when pops are 2 seconds apart', '⏰'),
('66', 7, 'Carefully open bag (hot steam!)', '🔥'),
('66', 8, 'Pour into bowl', '🥣'),
('66', 9, 'Enjoy!', '😋');

-- Fruit Cup (id: 67)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('67', 1, 'Get fruit cup from pantry or fridge', '🍑'),
('67', 2, 'Peel off lid', '👆'),
('67', 3, 'Get a spoon', '🥄'),
('67', 4, 'Eat and enjoy!', '😋');

-- Crackers & Cheese (id: 68)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('68', 1, 'Get crackers from pantry', '🍘'),
('68', 2, 'Get cheese from fridge', '🧀'),
('68', 3, 'Cut cheese into small pieces', '🔪'),
('68', 4, 'Put crackers on plate', '🍽️'),
('68', 5, 'Put cheese on each cracker', '🧀'),
('68', 6, 'Enjoy!', '😋');

-- Banana with Honey (id: 69)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('69', 1, 'Peel banana', '🍌'),
('69', 2, 'Put banana on plate', '🍽️'),
('69', 3, 'Drizzle honey on top', '🍯'),
('69', 4, 'Enjoy!', '😋');

-- Veggie Sticks (id: 70)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('70', 1, 'Get carrots and celery', '🥕'),
('70', 2, 'Wash vegetables', '🚿'),
('70', 3, 'Cut into sticks', '🔪'),
('70', 4, 'Put on plate', '🍽️'),
('70', 5, 'Add ranch or hummus for dipping', '🥫'),
('70', 6, 'Enjoy!', '😋');

-- Pretzels with Dip (id: 71)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('71', 1, 'Get pretzels from pantry', '🥨'),
('71', 2, 'Put pretzels in bowl', '🥣'),
('71', 3, 'Get dip (mustard, cheese, or peanut butter)', '🥫'),
('71', 4, 'Put dip in small bowl', '🥣'),
('71', 5, 'Dip pretzels and enjoy!', '😋');

-- Yogurt Cup (id: 72)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('72', 1, 'Get yogurt cup from fridge', '🥛'),
('72', 2, 'Peel off lid', '👆'),
('72', 3, 'Mix if there is fruit on bottom', '🥄'),
('72', 4, 'Enjoy!', '😋');

-- Rice Cakes (id: 73)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('73', 1, 'Get rice cakes from pantry', '🍘'),
('73', 2, 'Put on plate', '🍽️'),
('73', 3, 'Add topping if you want', '👆'),
('73', 4, 'Try: peanut butter, cream cheese, or jam', '🥜'),
('73', 5, 'Enjoy!', '😋');

-- Granola Bar (id: 74)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('74', 1, 'Get granola bar from pantry', '📦'),
('74', 2, 'Open the wrapper', '👆'),
('74', 3, 'Eat and enjoy!', '😋');

-- Orange Slices (id: 75)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('75', 1, 'Wash orange', '🚿'),
('75', 2, 'Cut orange in half', '🔪'),
('75', 3, 'Cut each half into slices', '🔪'),
('75', 4, 'Put on plate', '🍽️'),
('75', 5, 'Enjoy!', '😋');

-- Applesauce (id: 76)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('76', 1, 'Get applesauce cup or jar', '🍎'),
('76', 2, 'Open lid or peel off top', '👆'),
('76', 3, 'Get a spoon', '🥄'),
('76', 4, 'Enjoy!', '😋');

-- Cucumber Bites (id: 77)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('77', 1, 'Wash cucumber', '🚿'),
('77', 2, 'Cut cucumber into circles', '🔪'),
('77', 3, 'Put on plate', '🍽️'),
('77', 4, 'Add a little salt if you want', '🧂'),
('77', 5, 'Enjoy!', '😋');

-- Fresh Grapes (id: 78)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('78', 1, 'Pull grapes off stem', '🍇'),
('78', 2, 'Wash grapes in colander', '🚿'),
('78', 3, 'Put in bowl', '🥣'),
('78', 4, 'Enjoy!', '😋');

-- Mini Muffins (id: 79)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('79', 1, 'Get mini muffins from package', '🧁'),
('79', 2, 'Put on plate', '🍽️'),
('79', 3, 'Enjoy!', '😋');

-- Mini Quesadilla (id: 80)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('80', 1, 'Get small tortilla', '🫓'),
('80', 2, 'Put shredded cheese on half', '🧀'),
('80', 3, 'Fold in half', '🌮'),
('80', 4, 'Put on microwave-safe plate', '🍽️'),
('80', 5, 'Microwave for 30 seconds', '⏰'),
('80', 6, 'Check if cheese is melted', '👀'),
('80', 7, 'Let cool a little', '⏰'),
('80', 8, 'Enjoy!', '😋');

-- =====================================================
-- DESSERT RECIPES
-- =====================================================

-- Slice and Bake Cookies (id: 82)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('82', 1, 'Turn oven to temperature on package', '🔥'),
('82', 2, 'Get cookie dough from fridge', '🍪'),
('82', 3, 'Cut dough into circles', '🔪'),
('82', 4, 'Put cookies on baking sheet', '🍽️'),
('82', 5, 'Put in oven', '👆'),
('82', 6, 'Bake for time on package', '⏰'),
('82', 7, 'Take out with oven mitt', '🧤'),
('82', 8, 'Let cool before eating', '⏰'),
('82', 9, 'Enjoy!', '😋');

-- Mug Brownie (id: 83)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('83', 1, 'Get a microwave-safe mug', '☕'),
('83', 2, 'Add 2 tbsp flour', '🥄'),
('83', 3, 'Add 2 tbsp sugar', '🥄'),
('83', 4, 'Add 1 tbsp cocoa powder', '🍫'),
('83', 5, 'Add 2 tbsp oil', '🫒'),
('83', 6, 'Add 2 tbsp water', '💧'),
('83', 7, 'Mix everything together', '🥄'),
('83', 8, 'Microwave for 1 minute', '⏰'),
('83', 9, 'Let cool a little (hot!)', '🔥'),
('83', 10, 'Enjoy!', '😋');

-- Fruit Popsicles (id: 84)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('84', 1, 'Get popsicle from freezer', '❄️'),
('84', 2, 'Run warm water on outside of mold', '💧'),
('84', 3, 'Pull popsicle out', '👆'),
('84', 4, 'Enjoy!', '😋');

-- Banana Nice Cream (id: 85)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('85', 1, 'Get frozen banana pieces from freezer', '❄️'),
('85', 2, 'Put in blender', '🫙'),
('85', 3, 'Add splash of milk', '🥛'),
('85', 4, 'Blend until smooth and creamy', '🔄'),
('85', 5, 'Scoop into bowl', '🥣'),
('85', 6, 'Add toppings if you want', '🍫'),
('85', 7, 'Enjoy!', '😋');

-- Pudding Cup (id: 86)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('86', 1, 'Get pudding cup from fridge', '🍮'),
('86', 2, 'Peel off lid', '👆'),
('86', 3, 'Get a spoon', '🥄'),
('86', 4, 'Enjoy!', '😋');

-- Jello Cup (id: 87)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('87', 1, 'Get jello cup from fridge', '🍮'),
('87', 2, 'Peel off lid', '👆'),
('87', 3, 'Get a spoon', '🥄'),
('87', 4, 'Enjoy!', '😋');

-- Fruit with Yogurt Dip (id: 88)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('88', 1, 'Get yogurt', '🥛'),
('88', 2, 'Put yogurt in small bowl', '🥣'),
('88', 3, 'Add a little honey and stir', '🍯'),
('88', 4, 'Cut up fruit', '🔪'),
('88', 5, 'Put fruit on plate', '🍓'),
('88', 6, 'Dip fruit in yogurt', '👆'),
('88', 7, 'Enjoy!', '😋');

-- Chocolate Dipped Banana (id: 89)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('89', 1, 'Peel banana', '🍌'),
('89', 2, 'Cut banana in half', '🔪'),
('89', 3, 'Put popsicle stick in each half', '👆'),
('89', 4, 'Melt chocolate chips in microwave', '🍫'),
('89', 5, 'Stir every 20 seconds', '🥄'),
('89', 6, 'Dip banana in chocolate', '🍌'),
('89', 7, 'Put on wax paper', '📄'),
('89', 8, 'Freeze until chocolate is hard', '❄️'),
('89', 9, 'Enjoy!', '😋');

-- Rice Krispie Treats (id: 90)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('90', 1, 'Melt butter in big pot on low heat', '🧈'),
('90', 2, 'Add marshmallows', '☁️'),
('90', 3, 'Stir until melted', '🥄'),
('90', 4, 'Turn off heat', '🔥'),
('90', 5, 'Add Rice Krispies cereal', '🥣'),
('90', 6, 'Stir until coated', '🥄'),
('90', 7, 'Press into greased pan', '👆'),
('90', 8, 'Let cool completely', '⏰'),
('90', 9, 'Cut into squares', '🔪'),
('90', 10, 'Enjoy!', '😋');

-- Mug Apple Crisp (id: 91)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('91', 1, 'Get a microwave-safe mug', '☕'),
('91', 2, 'Cut apple into small pieces', '🔪'),
('91', 3, 'Put apple pieces in mug', '🍎'),
('91', 4, 'Add 1 tbsp butter', '🧈'),
('91', 5, 'Add 1 tbsp oats', '🥣'),
('91', 6, 'Add 1 tbsp brown sugar', '🥄'),
('91', 7, 'Add pinch of cinnamon', '✨'),
('91', 8, 'Mix together', '🥄'),
('91', 9, 'Microwave for 2 minutes', '⏰'),
('91', 10, 'Let cool a little', '🔥'),
('91', 11, 'Enjoy!', '😋');

-- Frozen Grapes (id: 92)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('92', 1, 'Wash grapes', '🚿'),
('92', 2, 'Pull grapes off stem', '🍇'),
('92', 3, 'Put on baking sheet or plate', '🍽️'),
('92', 4, 'Put in freezer', '❄️'),
('92', 5, 'Wait 2-3 hours until frozen', '⏰'),
('92', 6, 'Put in bag or bowl', '🥣'),
('92', 7, 'Enjoy frozen grapes!', '😋');

-- =====================================================
-- DRINK RECIPES
-- =====================================================

-- Fresh Lemonade (id: 94)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('94', 1, 'Cut lemons in half', '🔪'),
('94', 2, 'Squeeze juice into pitcher', '🍋'),
('94', 3, 'Remove seeds', '👆'),
('94', 4, 'Add water', '💧'),
('94', 5, 'Add sugar', '🥄'),
('94', 6, 'Stir until sugar dissolves', '🥄'),
('94', 7, 'Taste and add more sugar if needed', '👅'),
('94', 8, 'Add ice', '🧊'),
('94', 9, 'Pour into glass and enjoy!', '😋');

-- Hot Chocolate (id: 95)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('95', 1, 'Pour milk into microwave-safe mug', '🥛'),
('95', 2, 'Microwave for 1 minute 30 seconds', '⏰'),
('95', 3, 'Carefully take out (hot!)', '🔥'),
('95', 4, 'Add hot chocolate mix', '🍫'),
('95', 5, 'Stir until dissolved', '🥄'),
('95', 6, 'Add marshmallows on top', '☁️'),
('95', 7, 'Let cool a little', '⏰'),
('95', 8, 'Enjoy!', '😋');

-- Strawberry Milk (id: 96)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('96', 1, 'Pour milk into glass', '🥛'),
('96', 2, 'Add strawberry syrup', '🍓'),
('96', 3, 'Stir with spoon', '🥄'),
('96', 4, 'Add more syrup if you want it sweeter', '🍓'),
('96', 5, 'Enjoy!', '😋');

-- Fresh Orange Juice (id: 97)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('97', 1, 'Cut oranges in half', '🔪'),
('97', 2, 'Squeeze juice using juicer', '🍊'),
('97', 3, 'Strain out pulp if you want', '🥄'),
('97', 4, 'Pour into glass', '🥛'),
('97', 5, 'Add ice if you want', '🧊'),
('97', 6, 'Enjoy!', '😋');

-- Fruit Punch (id: 98)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('98', 1, 'Get pitcher', '🫙'),
('98', 2, 'Pour in fruit juice', '🧃'),
('98', 3, 'Add ginger ale or lemon-lime soda', '🥤'),
('98', 4, 'Stir gently', '🥄'),
('98', 5, 'Add ice', '🧊'),
('98', 6, 'Pour into glass', '🥛'),
('98', 7, 'Enjoy!', '😋');

-- Vanilla Milkshake (id: 99)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('99', 1, 'Put 2 scoops vanilla ice cream in blender', '🍨'),
('99', 2, 'Add milk', '🥛'),
('99', 3, 'Put lid on blender', '👆'),
('99', 4, 'Blend until smooth', '🔄'),
('99', 5, 'Pour into glass', '🥛'),
('99', 6, 'Add whipped cream on top if you want', '☁️'),
('99', 7, 'Add a straw', '🥤'),
('99', 8, 'Enjoy!', '😋');

-- Iced Tea (id: 100)
INSERT INTO recipe_steps (recipe_id, step_number, instruction, emoji) VALUES
('100', 1, 'Boil water', '💧'),
('100', 2, 'Put tea bags in pitcher', '🫖'),
('100', 3, 'Pour hot water over tea bags', '💧'),
('100', 4, 'Let steep for 5 minutes', '⏰'),
('100', 5, 'Remove tea bags', '👆'),
('100', 6, 'Add sugar and stir', '🥄'),
('100', 7, 'Let cool', '⏰'),
('100', 8, 'Add ice', '🧊'),
('100', 9, 'Pour into glass', '🥛'),
('100', 10, 'Enjoy!', '😋');

-- Verify the update
SELECT 
  r.name,
  COUNT(rs.id) as step_count
FROM recipes r
LEFT JOIN recipe_steps rs ON rs.recipe_id = r.id
GROUP BY r.id, r.name
ORDER BY r.name
LIMIT 20;
