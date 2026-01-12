-- Fix Recipe Steps - PART 2: Dinner, Snacks, Desserts, Drinks
-- Includes action column (required)
-- Run this in Supabase SQL Editor AFTER running v4

-- =====================================================
-- MORE LUNCH RECIPES (ones not in v4)
-- =====================================================

-- Egg Salad Sandwich
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Peel eggs', 'Peel hard boiled eggs', '🥚' FROM recipes WHERE name = 'Egg Salad Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Add to bowl', 'Put eggs in bowl', '🥣' FROM recipes WHERE name = 'Egg Salad Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Mash', 'Mash eggs with fork', '🍴' FROM recipes WHERE name = 'Egg Salad Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add mayo', 'Add mayo', '🥄' FROM recipes WHERE name = 'Egg Salad Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Season', 'Add salt and pepper', '🧂' FROM recipes WHERE name = 'Egg Salad Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Mix', 'Mix together', '🥄' FROM recipes WHERE name = 'Egg Salad Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Add to bread', 'Put on bread', '🍞' FROM recipes WHERE name = 'Egg Salad Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Add lettuce', 'Add lettuce if you want', '🥬' FROM recipes WHERE name = 'Egg Salad Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Close it', 'Put top bread on', '🍞' FROM recipes WHERE name = 'Egg Salad Sandwich';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Egg Salad Sandwich';

-- Hummus with Veggies
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get hummus', 'Get hummus from fridge', '🥫' FROM recipes WHERE name = 'Hummus with Veggies';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Put in bowl', 'Put hummus in small bowl', '🥣' FROM recipes WHERE name = 'Hummus with Veggies';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Wash', 'Wash vegetables', '🚿' FROM recipes WHERE name = 'Hummus with Veggies';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Cut', 'Cut veggies into sticks', '🔪' FROM recipes WHERE name = 'Hummus with Veggies';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Plate', 'Put veggies on plate', '🥕' FROM recipes WHERE name = 'Hummus with Veggies';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Dip', 'Dip veggies in hummus', '👆' FROM recipes WHERE name = 'Hummus with Veggies';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Hummus with Veggies';

-- Cheese and Crackers
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get cheese', 'Get cheese from fridge', '🧀' FROM recipes WHERE name = 'Cheese and Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Cut', 'Cut cheese into small squares', '🔪' FROM recipes WHERE name = 'Cheese and Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Get crackers', 'Get crackers', '🍘' FROM recipes WHERE name = 'Cheese and Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Plate', 'Put crackers on plate', '🍽️' FROM recipes WHERE name = 'Cheese and Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add cheese', 'Put cheese on crackers', '🧀' FROM recipes WHERE name = 'Cheese and Crackers';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Cheese and Crackers';

-- Bean & Cheese Burrito
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Open can', 'Open can of refried beans', '🥫' FROM recipes WHERE name = 'Bean & Cheese Burrito';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Add to bowl', 'Put beans in microwave-safe bowl', '🥣' FROM recipes WHERE name = 'Bean & Cheese Burrito';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Heat', 'Heat beans for 1 minute', '⏰' FROM recipes WHERE name = 'Bean & Cheese Burrito';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Stir', 'Stir and heat 30 more seconds', '🥄' FROM recipes WHERE name = 'Bean & Cheese Burrito';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Warm tortilla', 'Warm tortilla in microwave 15 seconds', '🫓' FROM recipes WHERE name = 'Bean & Cheese Burrito';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Spread', 'Spread beans on tortilla', '🥄' FROM recipes WHERE name = 'Bean & Cheese Burrito';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Add cheese', 'Add shredded cheese', '🧀' FROM recipes WHERE name = 'Bean & Cheese Burrito';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Roll', 'Roll up burrito', '🌯' FROM recipes WHERE name = 'Bean & Cheese Burrito';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Bean & Cheese Burrito';

-- Cucumber Sandwiches
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get bread', 'Get bread slices', '🍞' FROM recipes WHERE name = 'Cucumber Sandwiches';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Spread', 'Spread cream cheese on bread', '🧀' FROM recipes WHERE name = 'Cucumber Sandwiches';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Wash', 'Wash cucumber', '🚿' FROM recipes WHERE name = 'Cucumber Sandwiches';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Slice', 'Cut cucumber into thin circles', '🔪' FROM recipes WHERE name = 'Cucumber Sandwiches';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add cucumber', 'Put cucumber slices on bread', '🥒' FROM recipes WHERE name = 'Cucumber Sandwiches';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Season', 'Add a little salt', '🧂' FROM recipes WHERE name = 'Cucumber Sandwiches';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Close it', 'Put top bread on', '🍞' FROM recipes WHERE name = 'Cucumber Sandwiches';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Cut', 'Cut in half', '🔪' FROM recipes WHERE name = 'Cucumber Sandwiches';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Cucumber Sandwiches';

-- Instant Ramen
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Boil water', 'Boil water in kettle or pot', '💧' FROM recipes WHERE name = 'Instant Ramen';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Open', 'Open ramen package', '📦' FROM recipes WHERE name = 'Instant Ramen';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add noodles', 'Put noodles in bowl', '🍜' FROM recipes WHERE name = 'Instant Ramen';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add flavor', 'Add flavor packet to bowl', '✨' FROM recipes WHERE name = 'Instant Ramen';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Pour water', 'Pour hot water over noodles', '💧' FROM recipes WHERE name = 'Instant Ramen';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Cover', 'Cover bowl with plate', '🍽️' FROM recipes WHERE name = 'Instant Ramen';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Wait', 'Wait 3 minutes', '⏰' FROM recipes WHERE name = 'Instant Ramen';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Stir', 'Stir noodles', '🥄' FROM recipes WHERE name = 'Instant Ramen';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Instant Ramen';

-- Corn Dogs
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Heat oven', 'Turn oven to 375°F', '🔥' FROM recipes WHERE name = 'Corn Dogs';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Get food', 'Get corn dogs from freezer', '❄️' FROM recipes WHERE name = 'Corn Dogs';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Prep', 'Put corn dogs on baking sheet', '🌭' FROM recipes WHERE name = 'Corn Dogs';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Bake', 'Put in oven', '👆' FROM recipes WHERE name = 'Corn Dogs';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Wait', 'Bake for 15-20 minutes', '⏰' FROM recipes WHERE name = 'Corn Dogs';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Remove', 'Take out with oven mitt', '🧤' FROM recipes WHERE name = 'Corn Dogs';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Cool', 'Let cool a little', '⏰' FROM recipes WHERE name = 'Corn Dogs';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Add sauce', 'Serve with ketchup or mustard', '🍅' FROM recipes WHERE name = 'Corn Dogs';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Corn Dogs';

-- =====================================================
-- DINNER RECIPES
-- =====================================================

-- Baked Potato
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Wash', 'Wash potato', '🚿' FROM recipes WHERE name = 'Baked Potato';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Poke holes', 'Poke holes in potato with fork', '🍴' FROM recipes WHERE name = 'Baked Potato';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Prep', 'Put potato on microwave-safe plate', '🥔' FROM recipes WHERE name = 'Baked Potato';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Microwave', 'Microwave for 5 minutes', '⏰' FROM recipes WHERE name = 'Baked Potato';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Flip', 'Flip potato over', '🔄' FROM recipes WHERE name = 'Baked Potato';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Cook more', 'Microwave for 5 more minutes', '⏰' FROM recipes WHERE name = 'Baked Potato';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Check', 'Check if soft (ask adult to help)', '👆' FROM recipes WHERE name = 'Baked Potato';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Cut open', 'Cut open on top', '🔪' FROM recipes WHERE name = 'Baked Potato';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Add butter', 'Add butter', '🧈' FROM recipes WHERE name = 'Baked Potato';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Add toppings', 'Add sour cream and cheese', '🧀' FROM recipes WHERE name = 'Baked Potato';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 11, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Baked Potato';

-- Fish Sticks
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Heat oven', 'Turn oven to 425°F', '🔥' FROM recipes WHERE name = 'Fish Sticks';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Get food', 'Get fish sticks from freezer', '❄️' FROM recipes WHERE name = 'Fish Sticks';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Prep', 'Put fish sticks on baking sheet', '🐟' FROM recipes WHERE name = 'Fish Sticks';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Bake', 'Put in oven', '👆' FROM recipes WHERE name = 'Fish Sticks';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Wait', 'Bake for 15-17 minutes', '⏰' FROM recipes WHERE name = 'Fish Sticks';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Remove', 'Take out with oven mitt', '🧤' FROM recipes WHERE name = 'Fish Sticks';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Cool', 'Let cool a little', '⏰' FROM recipes WHERE name = 'Fish Sticks';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Add sauce', 'Serve with tartar sauce or ketchup', '🥫' FROM recipes WHERE name = 'Fish Sticks';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Fish Sticks';

-- Chicken and Rice
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Cook rice', 'Cook instant rice following box directions', '🍚' FROM recipes WHERE name = 'Chicken and Rice';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Get chicken', 'Get cooked chicken (rotisserie or leftover)', '🍗' FROM recipes WHERE name = 'Chicken and Rice';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Cut', 'Cut chicken into small pieces', '🔪' FROM recipes WHERE name = 'Chicken and Rice';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add rice', 'Put rice in bowl', '🥣' FROM recipes WHERE name = 'Chicken and Rice';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add chicken', 'Add chicken on top', '🍗' FROM recipes WHERE name = 'Chicken and Rice';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Add butter', 'Add butter if you want', '🧈' FROM recipes WHERE name = 'Chicken and Rice';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Season', 'Season with salt and pepper', '🧂' FROM recipes WHERE name = 'Chicken and Rice';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Chicken and Rice';

-- Easy Tacos
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Cook meat', 'Cook ground beef in pan on medium', '🥩' FROM recipes WHERE name = 'Easy Tacos';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Break up', 'Break up meat with spatula while cooking', '🍳' FROM recipes WHERE name = 'Easy Tacos';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Drain', 'When brown, drain fat (ask adult)', '💧' FROM recipes WHERE name = 'Easy Tacos';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Season', 'Add taco seasoning', '✨' FROM recipes WHERE name = 'Easy Tacos';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add water', 'Add water as packet says', '💧' FROM recipes WHERE name = 'Easy Tacos';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Simmer', 'Simmer 5 minutes', '⏰' FROM recipes WHERE name = 'Easy Tacos';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Warm shells', 'Warm taco shells', '🌮' FROM recipes WHERE name = 'Easy Tacos';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Fill', 'Fill shells with meat', '🥄' FROM recipes WHERE name = 'Easy Tacos';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Add toppings', 'Add cheese, lettuce, tomato', '🧀' FROM recipes WHERE name = 'Easy Tacos';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Easy Tacos';

-- Spaghetti & Meatballs
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Fill pot', 'Fill large pot with water', '💧' FROM recipes WHERE name = 'Spaghetti & Meatballs';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Heat', 'Put pot on stove on high', '🔥' FROM recipes WHERE name = 'Spaghetti & Meatballs';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Wait', 'Wait for water to boil', '💨' FROM recipes WHERE name = 'Spaghetti & Meatballs';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add pasta', 'Add spaghetti to water', '🍝' FROM recipes WHERE name = 'Spaghetti & Meatballs';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Cook pasta', 'Cook for time on box', '⏰' FROM recipes WHERE name = 'Spaghetti & Meatballs';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Heat meatballs', 'Heat frozen meatballs (follow package)', '🍖' FROM recipes WHERE name = 'Spaghetti & Meatballs';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Heat sauce', 'Heat pasta sauce in pot', '🍅' FROM recipes WHERE name = 'Spaghetti & Meatballs';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Drain', 'Drain pasta (ask adult to help)', '💧' FROM recipes WHERE name = 'Spaghetti & Meatballs';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Plate', 'Put pasta in bowl', '🥣' FROM recipes WHERE name = 'Spaghetti & Meatballs';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Top it', 'Add sauce and meatballs', '🍅' FROM recipes WHERE name = 'Spaghetti & Meatballs';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 11, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Spaghetti & Meatballs';

-- English Muffin Pizzas
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Heat oven', 'Turn oven to 375°F', '🔥' FROM recipes WHERE name = 'English Muffin Pizzas';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Split', 'Split English muffins in half', '🍞' FROM recipes WHERE name = 'English Muffin Pizzas';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Prep', 'Put muffins on baking sheet', '🍽️' FROM recipes WHERE name = 'English Muffin Pizzas';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add sauce', 'Spread pizza sauce on each half', '🍅' FROM recipes WHERE name = 'English Muffin Pizzas';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add cheese', 'Add shredded cheese', '🧀' FROM recipes WHERE name = 'English Muffin Pizzas';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Toppings', 'Add toppings if you want', '🍕' FROM recipes WHERE name = 'English Muffin Pizzas';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Bake', 'Put in oven', '👆' FROM recipes WHERE name = 'English Muffin Pizzas';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Wait', 'Bake for 10 minutes', '⏰' FROM recipes WHERE name = 'English Muffin Pizzas';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Remove', 'Take out with oven mitt', '🧤' FROM recipes WHERE name = 'English Muffin Pizzas';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Cool', 'Let cool a little', '⏰' FROM recipes WHERE name = 'English Muffin Pizzas';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 11, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'English Muffin Pizzas';

-- Baked Chicken Tenders
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Heat oven', 'Turn oven to 400°F', '🔥' FROM recipes WHERE name = 'Baked Chicken Tenders';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Get food', 'Get chicken tenders from freezer', '❄️' FROM recipes WHERE name = 'Baked Chicken Tenders';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Prep', 'Put tenders on baking sheet', '🍗' FROM recipes WHERE name = 'Baked Chicken Tenders';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Bake', 'Put in oven', '👆' FROM recipes WHERE name = 'Baked Chicken Tenders';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Wait', 'Bake for 18-20 minutes', '⏰' FROM recipes WHERE name = 'Baked Chicken Tenders';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Check', 'Check if cooked through', '👀' FROM recipes WHERE name = 'Baked Chicken Tenders';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Remove', 'Take out with oven mitt', '🧤' FROM recipes WHERE name = 'Baked Chicken Tenders';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Cool', 'Let cool a little', '⏰' FROM recipes WHERE name = 'Baked Chicken Tenders';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Add sauce', 'Serve with dipping sauce', '🥫' FROM recipes WHERE name = 'Baked Chicken Tenders';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Baked Chicken Tenders';

-- Veggie Stir Fry
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get veggies', 'Get frozen stir fry vegetables', '❄️' FROM recipes WHERE name = 'Veggie Stir Fry';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Heat pan', 'Heat pan on medium-high', '🍳' FROM recipes WHERE name = 'Veggie Stir Fry';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add oil', 'Add oil to pan', '🫒' FROM recipes WHERE name = 'Veggie Stir Fry';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add veggies', 'Add frozen vegetables', '🥦' FROM recipes WHERE name = 'Veggie Stir Fry';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Stir', 'Stir frequently', '🥄' FROM recipes WHERE name = 'Veggie Stir Fry';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Cook', 'Cook for 7-10 minutes', '⏰' FROM recipes WHERE name = 'Veggie Stir Fry';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Add sauce', 'Add soy sauce', '🥫' FROM recipes WHERE name = 'Veggie Stir Fry';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Toss', 'Stir to coat', '🥄' FROM recipes WHERE name = 'Veggie Stir Fry';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Serve', 'Serve over rice if you want', '🍚' FROM recipes WHERE name = 'Veggie Stir Fry';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Veggie Stir Fry';

-- Rice and Beans
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Cook rice', 'Cook instant rice following box', '🍚' FROM recipes WHERE name = 'Rice and Beans';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Open can', 'Open can of black beans', '🥫' FROM recipes WHERE name = 'Rice and Beans';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add to pot', 'Put beans in pot', '🥣' FROM recipes WHERE name = 'Rice and Beans';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Heat', 'Heat beans on medium', '🔥' FROM recipes WHERE name = 'Rice and Beans';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Stir', 'Stir occasionally', '🥄' FROM recipes WHERE name = 'Rice and Beans';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Add rice', 'Put rice in bowl', '🍚' FROM recipes WHERE name = 'Rice and Beans';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Add beans', 'Add beans on top', '🫘' FROM recipes WHERE name = 'Rice and Beans';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Add cheese', 'Add cheese if you want', '🧀' FROM recipes WHERE name = 'Rice and Beans';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Rice and Beans';

-- Mashed Potatoes
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get mix', 'Get instant mashed potato flakes', '🥔' FROM recipes WHERE name = 'Mashed Potatoes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Boil water', 'Boil water as box says', '💧' FROM recipes WHERE name = 'Mashed Potatoes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add butter', 'Add butter to pot', '🧈' FROM recipes WHERE name = 'Mashed Potatoes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add milk', 'Add milk', '🥛' FROM recipes WHERE name = 'Mashed Potatoes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add flakes', 'Stir in potato flakes', '🥄' FROM recipes WHERE name = 'Mashed Potatoes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Mix', 'Mix until smooth', '🥄' FROM recipes WHERE name = 'Mashed Potatoes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Season', 'Add salt and pepper', '🧂' FROM recipes WHERE name = 'Mashed Potatoes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Mashed Potatoes';

-- Simple Hamburger
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get patty', 'Get frozen burger patty', '❄️' FROM recipes WHERE name = 'Simple Hamburger';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Heat pan', 'Heat pan on medium-high', '🍳' FROM recipes WHERE name = 'Simple Hamburger';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Cook', 'Put patty in pan', '🍔' FROM recipes WHERE name = 'Simple Hamburger';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Wait', 'Cook for 4 minutes', '⏰' FROM recipes WHERE name = 'Simple Hamburger';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Flip', 'Flip with spatula', '🔄' FROM recipes WHERE name = 'Simple Hamburger';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Cook more', 'Cook 4 more minutes', '⏰' FROM recipes WHERE name = 'Simple Hamburger';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Add cheese', 'Add cheese slice on top if you want', '🧀' FROM recipes WHERE name = 'Simple Hamburger';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Add bun', 'Put patty on bun', '🍞' FROM recipes WHERE name = 'Simple Hamburger';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Add toppings', 'Add ketchup, mustard, pickles', '🍅' FROM recipes WHERE name = 'Simple Hamburger';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Simple Hamburger';

-- Frozen Pizza
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Heat oven', 'Turn oven to temperature on box', '🔥' FROM recipes WHERE name = 'Frozen Pizza';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Get pizza', 'Take pizza out of freezer', '❄️' FROM recipes WHERE name = 'Frozen Pizza';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Unwrap', 'Remove plastic wrap', '📦' FROM recipes WHERE name = 'Frozen Pizza';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Prep', 'Put pizza on oven rack or pan', '🍕' FROM recipes WHERE name = 'Frozen Pizza';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Bake', 'Put in oven', '👆' FROM recipes WHERE name = 'Frozen Pizza';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Wait', 'Bake for time on box', '⏰' FROM recipes WHERE name = 'Frozen Pizza';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Remove', 'Take out with oven mitt', '🧤' FROM recipes WHERE name = 'Frozen Pizza';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Cool', 'Let cool for 2-3 minutes', '⏰' FROM recipes WHERE name = 'Frozen Pizza';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Cut', 'Cut into slices', '🔪' FROM recipes WHERE name = 'Frozen Pizza';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Frozen Pizza';

-- Chicken Nuggets Dinner
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Heat oven', 'Turn oven to 400°F', '🔥' FROM recipes WHERE name = 'Chicken Nuggets Dinner';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Prep', 'Put nuggets on baking sheet', '🍗' FROM recipes WHERE name = 'Chicken Nuggets Dinner';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Bake', 'Bake for 15-18 minutes', '⏰' FROM recipes WHERE name = 'Chicken Nuggets Dinner';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Make side', 'While nuggets bake, make a side', '🥕' FROM recipes WHERE name = 'Chicken Nuggets Dinner';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Remove', 'Take nuggets out when done', '🧤' FROM recipes WHERE name = 'Chicken Nuggets Dinner';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Cool', 'Let cool a little', '⏰' FROM recipes WHERE name = 'Chicken Nuggets Dinner';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Serve', 'Serve with veggies and dipping sauce', '🥫' FROM recipes WHERE name = 'Chicken Nuggets Dinner';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Chicken Nuggets Dinner';

-- Butter Noodles
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Fill pot', 'Fill pot with water', '💧' FROM recipes WHERE name = 'Butter Noodles';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Heat', 'Put pot on stove on high', '🔥' FROM recipes WHERE name = 'Butter Noodles';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Wait', 'Wait for water to boil', '💨' FROM recipes WHERE name = 'Butter Noodles';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add noodles', 'Add egg noodles', '🍝' FROM recipes WHERE name = 'Butter Noodles';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Cook', 'Cook for time on bag', '⏰' FROM recipes WHERE name = 'Butter Noodles';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Drain', 'Drain noodles (ask adult to help)', '💧' FROM recipes WHERE name = 'Butter Noodles';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Add butter', 'Add butter', '🧈' FROM recipes WHERE name = 'Butter Noodles';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Add cheese', 'Add parmesan cheese', '🧀' FROM recipes WHERE name = 'Butter Noodles';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Mix', 'Stir together', '🥄' FROM recipes WHERE name = 'Butter Noodles';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Butter Noodles';

-- Cheese Ravioli
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Fill pot', 'Fill pot with water', '💧' FROM recipes WHERE name = 'Cheese Ravioli';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Heat', 'Put pot on stove on high', '🔥' FROM recipes WHERE name = 'Cheese Ravioli';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Wait', 'Wait for water to boil', '💨' FROM recipes WHERE name = 'Cheese Ravioli';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add ravioli', 'Add ravioli to water', '🍝' FROM recipes WHERE name = 'Cheese Ravioli';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Cook', 'Cook for time on bag', '⏰' FROM recipes WHERE name = 'Cheese Ravioli';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Drain', 'Drain ravioli (ask adult to help)', '💧' FROM recipes WHERE name = 'Cheese Ravioli';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Plate', 'Put ravioli in bowl', '🥣' FROM recipes WHERE name = 'Cheese Ravioli';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Add sauce', 'Add pasta sauce', '🍅' FROM recipes WHERE name = 'Cheese Ravioli';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Add cheese', 'Sprinkle parmesan on top', '🧀' FROM recipes WHERE name = 'Cheese Ravioli';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Cheese Ravioli';

-- Chicken Quesadilla
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get chicken', 'Get cooked chicken (rotisserie or leftover)', '🍗' FROM recipes WHERE name = 'Chicken Quesadilla';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Shred', 'Cut or shred chicken', '🔪' FROM recipes WHERE name = 'Chicken Quesadilla';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Heat pan', 'Heat pan on medium', '🍳' FROM recipes WHERE name = 'Chicken Quesadilla';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add tortilla', 'Put tortilla in pan', '🫓' FROM recipes WHERE name = 'Chicken Quesadilla';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add cheese', 'Add cheese on half', '🧀' FROM recipes WHERE name = 'Chicken Quesadilla';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Add chicken', 'Add chicken on cheese', '🍗' FROM recipes WHERE name = 'Chicken Quesadilla';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Fold', 'Fold tortilla in half', '🌮' FROM recipes WHERE name = 'Chicken Quesadilla';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Cook', 'Cook until golden', '⏰' FROM recipes WHERE name = 'Chicken Quesadilla';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Flip', 'Flip and cook other side', '🔄' FROM recipes WHERE name = 'Chicken Quesadilla';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Cut', 'Cut into triangles', '🔪' FROM recipes WHERE name = 'Chicken Quesadilla';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 11, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Chicken Quesadilla';

-- Soup and Bread
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Open can', 'Open can of soup', '🥫' FROM recipes WHERE name = 'Soup and Bread';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Pour', 'Pour soup into pot', '🥣' FROM recipes WHERE name = 'Soup and Bread';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Heat', 'Heat on medium, stir often', '🥄' FROM recipes WHERE name = 'Soup and Bread';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Serve soup', 'When hot, pour into bowl', '🍜' FROM recipes WHERE name = 'Soup and Bread';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Slice bread', 'Slice bread', '🔪' FROM recipes WHERE name = 'Soup and Bread';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Add butter', 'Butter bread if you want', '🧈' FROM recipes WHERE name = 'Soup and Bread';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Enjoy!', 'Enjoy soup with bread!', '😋' FROM recipes WHERE name = 'Soup and Bread';

-- Veggie Burger
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get patty', 'Get veggie burger patty from freezer', '❄️' FROM recipes WHERE name = 'Veggie Burger';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Heat pan', 'Heat pan on medium', '🍳' FROM recipes WHERE name = 'Veggie Burger';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Cook', 'Cook patty following package directions', '🥬' FROM recipes WHERE name = 'Veggie Burger';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Flip', 'Flip halfway through', '🔄' FROM recipes WHERE name = 'Veggie Burger';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Toast bun', 'Toast bun if you want', '🍞' FROM recipes WHERE name = 'Veggie Burger';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Assemble', 'Put patty on bun', '🍔' FROM recipes WHERE name = 'Veggie Burger';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Add toppings', 'Add toppings you like', '🍅' FROM recipes WHERE name = 'Veggie Burger';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Veggie Burger';

-- Simple Rice Bowl
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Cook rice', 'Cook instant rice following box', '🍚' FROM recipes WHERE name = 'Simple Rice Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Add rice', 'Put rice in bowl', '🥣' FROM recipes WHERE name = 'Simple Rice Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add toppings', 'Add your favorite toppings', '🥕' FROM recipes WHERE name = 'Simple Rice Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Ideas', 'Try: egg, veggies, or meat', '🍳' FROM recipes WHERE name = 'Simple Rice Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add sauce', 'Add soy sauce or teriyaki sauce', '🥫' FROM recipes WHERE name = 'Simple Rice Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Mix', 'Mix together', '🥄' FROM recipes WHERE name = 'Simple Rice Bowl';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Simple Rice Bowl';

-- =====================================================
-- SNACK RECIPES
-- =====================================================

-- Apple Slices with PB
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Wash', 'Wash apple', '🚿' FROM recipes WHERE name = 'Apple Slices with PB';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Cut', 'Cut apple into slices (ask adult for help)', '🔪' FROM recipes WHERE name = 'Apple Slices with PB';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Remove seeds', 'Remove seeds', '👆' FROM recipes WHERE name = 'Apple Slices with PB';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Get PB', 'Put peanut butter in small bowl', '🥜' FROM recipes WHERE name = 'Apple Slices with PB';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Dip', 'Dip apple slices in peanut butter', '🍎' FROM recipes WHERE name = 'Apple Slices with PB';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Apple Slices with PB';

-- DIY Trail Mix
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get bowl', 'Get a bowl', '🥣' FROM recipes WHERE name = 'DIY Trail Mix';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Add nuts', 'Add handful of nuts', '🥜' FROM recipes WHERE name = 'DIY Trail Mix';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add raisins', 'Add handful of raisins', '🍇' FROM recipes WHERE name = 'DIY Trail Mix';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add chocolate', 'Add handful of chocolate chips', '🍫' FROM recipes WHERE name = 'DIY Trail Mix';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add cereal', 'Add handful of cereal', '🥣' FROM recipes WHERE name = 'DIY Trail Mix';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Mix', 'Mix everything together', '🥄' FROM recipes WHERE name = 'DIY Trail Mix';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Store', 'Put in bag or container', '📦' FROM recipes WHERE name = 'DIY Trail Mix';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'DIY Trail Mix';

-- Ants on a Log
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Wash', 'Wash celery sticks', '🚿' FROM recipes WHERE name = 'Ants on a Log';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Cut', 'Cut celery into pieces', '🔪' FROM recipes WHERE name = 'Ants on a Log';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Fill', 'Fill celery with peanut butter', '🥜' FROM recipes WHERE name = 'Ants on a Log';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add ants', 'Put raisins on top (the ants!)', '🐜' FROM recipes WHERE name = 'Ants on a Log';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Plate', 'Put on plate', '🍽️' FROM recipes WHERE name = 'Ants on a Log';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Ants on a Log';

-- String Cheese
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get cheese', 'Get string cheese from fridge', '🧀' FROM recipes WHERE name = 'String Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Open', 'Open the wrapper', '📦' FROM recipes WHERE name = 'String Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Enjoy!', 'Peel strings off and eat!', '😋' FROM recipes WHERE name = 'String Cheese';

-- Microwave Popcorn
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get bag', 'Get popcorn bag from box', '📦' FROM recipes WHERE name = 'Microwave Popcorn';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Unwrap', 'Take off plastic wrap', '👆' FROM recipes WHERE name = 'Microwave Popcorn';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Place', 'Put bag in microwave (check which side up)', '📦' FROM recipes WHERE name = 'Microwave Popcorn';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Start', 'Press popcorn button OR set 2-3 minutes', '👆' FROM recipes WHERE name = 'Microwave Popcorn';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Listen', 'Listen for popping to slow down', '👂' FROM recipes WHERE name = 'Microwave Popcorn';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Stop', 'Stop when pops are 2 seconds apart', '⏰' FROM recipes WHERE name = 'Microwave Popcorn';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Open', 'Carefully open bag (hot steam!)', '🔥' FROM recipes WHERE name = 'Microwave Popcorn';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Pour', 'Pour into bowl', '🥣' FROM recipes WHERE name = 'Microwave Popcorn';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Microwave Popcorn';

-- Fruit Cup
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get cup', 'Get fruit cup from pantry or fridge', '🍑' FROM recipes WHERE name = 'Fruit Cup';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Open', 'Peel off lid', '👆' FROM recipes WHERE name = 'Fruit Cup';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Get spoon', 'Get a spoon', '🥄' FROM recipes WHERE name = 'Fruit Cup';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Enjoy!', 'Eat and enjoy!', '😋' FROM recipes WHERE name = 'Fruit Cup';

-- Crackers & Cheese
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get crackers', 'Get crackers from pantry', '🍘' FROM recipes WHERE name = 'Crackers & Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Get cheese', 'Get cheese from fridge', '🧀' FROM recipes WHERE name = 'Crackers & Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Cut', 'Cut cheese into small pieces', '🔪' FROM recipes WHERE name = 'Crackers & Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Plate', 'Put crackers on plate', '🍽️' FROM recipes WHERE name = 'Crackers & Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add cheese', 'Put cheese on each cracker', '🧀' FROM recipes WHERE name = 'Crackers & Cheese';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Crackers & Cheese';

-- Banana with Honey
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Peel', 'Peel banana', '🍌' FROM recipes WHERE name = 'Banana with Honey';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Plate', 'Put banana on plate', '🍽️' FROM recipes WHERE name = 'Banana with Honey';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Drizzle', 'Drizzle honey on top', '🍯' FROM recipes WHERE name = 'Banana with Honey';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Banana with Honey';

-- Veggie Sticks
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get veggies', 'Get carrots and celery', '🥕' FROM recipes WHERE name = 'Veggie Sticks';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Wash', 'Wash vegetables', '🚿' FROM recipes WHERE name = 'Veggie Sticks';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Cut', 'Cut into sticks', '🔪' FROM recipes WHERE name = 'Veggie Sticks';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Plate', 'Put on plate', '🍽️' FROM recipes WHERE name = 'Veggie Sticks';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add dip', 'Add ranch or hummus for dipping', '🥫' FROM recipes WHERE name = 'Veggie Sticks';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Veggie Sticks';

-- Pretzels with Dip
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get pretzels', 'Get pretzels from pantry', '🥨' FROM recipes WHERE name = 'Pretzels with Dip';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Pour', 'Put pretzels in bowl', '🥣' FROM recipes WHERE name = 'Pretzels with Dip';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Get dip', 'Get dip (mustard, cheese, or peanut butter)', '🥫' FROM recipes WHERE name = 'Pretzels with Dip';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Prep dip', 'Put dip in small bowl', '🥣' FROM recipes WHERE name = 'Pretzels with Dip';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Enjoy!', 'Dip pretzels and enjoy!', '😋' FROM recipes WHERE name = 'Pretzels with Dip';

-- Yogurt Cup
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get yogurt', 'Get yogurt cup from fridge', '🥛' FROM recipes WHERE name = 'Yogurt Cup';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Open', 'Peel off lid', '👆' FROM recipes WHERE name = 'Yogurt Cup';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Mix', 'Mix if there is fruit on bottom', '🥄' FROM recipes WHERE name = 'Yogurt Cup';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Yogurt Cup';

-- Rice Cakes
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get cakes', 'Get rice cakes from pantry', '🍘' FROM recipes WHERE name = 'Rice Cakes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Plate', 'Put on plate', '🍽️' FROM recipes WHERE name = 'Rice Cakes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add topping', 'Add topping if you want', '👆' FROM recipes WHERE name = 'Rice Cakes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Ideas', 'Try: peanut butter, cream cheese, or jam', '🥜' FROM recipes WHERE name = 'Rice Cakes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Rice Cakes';

-- Granola Bar
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get bar', 'Get granola bar from pantry', '📦' FROM recipes WHERE name = 'Granola Bar';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Open', 'Open the wrapper', '👆' FROM recipes WHERE name = 'Granola Bar';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Enjoy!', 'Eat and enjoy!', '😋' FROM recipes WHERE name = 'Granola Bar';

-- Orange Slices
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Wash', 'Wash orange', '🚿' FROM recipes WHERE name = 'Orange Slices';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Cut half', 'Cut orange in half', '🔪' FROM recipes WHERE name = 'Orange Slices';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Slice', 'Cut each half into slices', '🔪' FROM recipes WHERE name = 'Orange Slices';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Plate', 'Put on plate', '🍽️' FROM recipes WHERE name = 'Orange Slices';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Orange Slices';

-- Applesauce
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get cup', 'Get applesauce cup or jar', '🍎' FROM recipes WHERE name = 'Applesauce';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Open', 'Open lid or peel off top', '👆' FROM recipes WHERE name = 'Applesauce';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Get spoon', 'Get a spoon', '🥄' FROM recipes WHERE name = 'Applesauce';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Applesauce';

-- Cucumber Bites
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Wash', 'Wash cucumber', '🚿' FROM recipes WHERE name = 'Cucumber Bites';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Slice', 'Cut cucumber into circles', '🔪' FROM recipes WHERE name = 'Cucumber Bites';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Plate', 'Put on plate', '🍽️' FROM recipes WHERE name = 'Cucumber Bites';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Season', 'Add a little salt if you want', '🧂' FROM recipes WHERE name = 'Cucumber Bites';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Cucumber Bites';

-- Fresh Grapes
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Pick', 'Pull grapes off stem', '🍇' FROM recipes WHERE name = 'Fresh Grapes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Wash', 'Wash grapes in colander', '🚿' FROM recipes WHERE name = 'Fresh Grapes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Put in bowl', 'Put in bowl', '🥣' FROM recipes WHERE name = 'Fresh Grapes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Fresh Grapes';

-- Mini Muffins
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get muffins', 'Get mini muffins from package', '🧁' FROM recipes WHERE name = 'Mini Muffins';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Plate', 'Put on plate', '🍽️' FROM recipes WHERE name = 'Mini Muffins';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Mini Muffins';

-- Mini Quesadilla
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get tortilla', 'Get small tortilla', '🫓' FROM recipes WHERE name = 'Mini Quesadilla';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Add cheese', 'Put shredded cheese on half', '🧀' FROM recipes WHERE name = 'Mini Quesadilla';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Fold', 'Fold in half', '🌮' FROM recipes WHERE name = 'Mini Quesadilla';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Plate', 'Put on microwave-safe plate', '🍽️' FROM recipes WHERE name = 'Mini Quesadilla';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Heat', 'Microwave for 30 seconds', '⏰' FROM recipes WHERE name = 'Mini Quesadilla';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Check', 'Check if cheese is melted', '👀' FROM recipes WHERE name = 'Mini Quesadilla';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Cool', 'Let cool a little', '⏰' FROM recipes WHERE name = 'Mini Quesadilla';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Mini Quesadilla';

-- =====================================================
-- DESSERT RECIPES
-- =====================================================

-- Slice and Bake Cookies
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Heat oven', 'Turn oven to temperature on package', '🔥' FROM recipes WHERE name = 'Slice and Bake Cookies';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Get dough', 'Get cookie dough from fridge', '🍪' FROM recipes WHERE name = 'Slice and Bake Cookies';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Slice', 'Cut dough into circles', '🔪' FROM recipes WHERE name = 'Slice and Bake Cookies';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Prep', 'Put cookies on baking sheet', '🍽️' FROM recipes WHERE name = 'Slice and Bake Cookies';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Bake', 'Put in oven', '👆' FROM recipes WHERE name = 'Slice and Bake Cookies';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Wait', 'Bake for time on package', '⏰' FROM recipes WHERE name = 'Slice and Bake Cookies';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Remove', 'Take out with oven mitt', '🧤' FROM recipes WHERE name = 'Slice and Bake Cookies';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Cool', 'Let cool before eating', '⏰' FROM recipes WHERE name = 'Slice and Bake Cookies';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Slice and Bake Cookies';

-- Mug Brownie
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get mug', 'Get a microwave-safe mug', '☕' FROM recipes WHERE name = 'Mug Brownie';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Add flour', 'Add 2 tbsp flour', '🥄' FROM recipes WHERE name = 'Mug Brownie';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add sugar', 'Add 2 tbsp sugar', '🥄' FROM recipes WHERE name = 'Mug Brownie';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add cocoa', 'Add 1 tbsp cocoa powder', '🍫' FROM recipes WHERE name = 'Mug Brownie';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add oil', 'Add 2 tbsp oil', '🫒' FROM recipes WHERE name = 'Mug Brownie';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Add water', 'Add 2 tbsp water', '💧' FROM recipes WHERE name = 'Mug Brownie';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Mix', 'Mix everything together', '🥄' FROM recipes WHERE name = 'Mug Brownie';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Cook', 'Microwave for 1 minute', '⏰' FROM recipes WHERE name = 'Mug Brownie';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Cool', 'Let cool a little (hot!)', '🔥' FROM recipes WHERE name = 'Mug Brownie';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Mug Brownie';

-- Fruit Popsicles
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get popsicle', 'Get popsicle from freezer', '❄️' FROM recipes WHERE name = 'Fruit Popsicles';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Run water', 'Run warm water on outside of mold', '💧' FROM recipes WHERE name = 'Fruit Popsicles';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Remove', 'Pull popsicle out', '👆' FROM recipes WHERE name = 'Fruit Popsicles';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Fruit Popsicles';

-- Banana Nice Cream
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get banana', 'Get frozen banana pieces from freezer', '❄️' FROM recipes WHERE name = 'Banana Nice Cream';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Add to blender', 'Put in blender', '🫙' FROM recipes WHERE name = 'Banana Nice Cream';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add milk', 'Add splash of milk', '🥛' FROM recipes WHERE name = 'Banana Nice Cream';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Blend', 'Blend until smooth and creamy', '🔄' FROM recipes WHERE name = 'Banana Nice Cream';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Serve', 'Scoop into bowl', '🥣' FROM recipes WHERE name = 'Banana Nice Cream';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Top it', 'Add toppings if you want', '🍫' FROM recipes WHERE name = 'Banana Nice Cream';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Banana Nice Cream';

-- Pudding Cup
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get pudding', 'Get pudding cup from fridge', '🍮' FROM recipes WHERE name = 'Pudding Cup';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Open', 'Peel off lid', '👆' FROM recipes WHERE name = 'Pudding Cup';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Get spoon', 'Get a spoon', '🥄' FROM recipes WHERE name = 'Pudding Cup';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Pudding Cup';

-- Jello Cup
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get jello', 'Get jello cup from fridge', '🍮' FROM recipes WHERE name = 'Jello Cup';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Open', 'Peel off lid', '👆' FROM recipes WHERE name = 'Jello Cup';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Get spoon', 'Get a spoon', '🥄' FROM recipes WHERE name = 'Jello Cup';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Jello Cup';

-- Fruit with Yogurt Dip
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get yogurt', 'Get yogurt', '🥛' FROM recipes WHERE name = 'Fruit with Yogurt Dip';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Put in bowl', 'Put yogurt in small bowl', '🥣' FROM recipes WHERE name = 'Fruit with Yogurt Dip';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Sweeten', 'Add a little honey and stir', '🍯' FROM recipes WHERE name = 'Fruit with Yogurt Dip';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Cut fruit', 'Cut up fruit', '🔪' FROM recipes WHERE name = 'Fruit with Yogurt Dip';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Plate', 'Put fruit on plate', '🍓' FROM recipes WHERE name = 'Fruit with Yogurt Dip';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Dip', 'Dip fruit in yogurt', '👆' FROM recipes WHERE name = 'Fruit with Yogurt Dip';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Fruit with Yogurt Dip';

-- Chocolate Dipped Banana
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Peel', 'Peel banana', '🍌' FROM recipes WHERE name = 'Chocolate Dipped Banana';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Cut', 'Cut banana in half', '🔪' FROM recipes WHERE name = 'Chocolate Dipped Banana';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add stick', 'Put popsicle stick in each half', '👆' FROM recipes WHERE name = 'Chocolate Dipped Banana';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Melt chocolate', 'Melt chocolate chips in microwave', '🍫' FROM recipes WHERE name = 'Chocolate Dipped Banana';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Stir', 'Stir every 20 seconds', '🥄' FROM recipes WHERE name = 'Chocolate Dipped Banana';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Dip', 'Dip banana in chocolate', '🍌' FROM recipes WHERE name = 'Chocolate Dipped Banana';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Place', 'Put on wax paper', '📄' FROM recipes WHERE name = 'Chocolate Dipped Banana';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Freeze', 'Freeze until chocolate is hard', '❄️' FROM recipes WHERE name = 'Chocolate Dipped Banana';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Chocolate Dipped Banana';

-- Rice Krispie Treats
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Melt butter', 'Melt butter in big pot on low heat', '🧈' FROM recipes WHERE name = 'Rice Krispie Treats';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Add marshmallows', 'Add marshmallows', '☁️' FROM recipes WHERE name = 'Rice Krispie Treats';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Stir', 'Stir until melted', '🥄' FROM recipes WHERE name = 'Rice Krispie Treats';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Turn off', 'Turn off heat', '🔥' FROM recipes WHERE name = 'Rice Krispie Treats';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add cereal', 'Add Rice Krispies cereal', '🥣' FROM recipes WHERE name = 'Rice Krispie Treats';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Mix', 'Stir until coated', '🥄' FROM recipes WHERE name = 'Rice Krispie Treats';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Press', 'Press into greased pan', '👆' FROM recipes WHERE name = 'Rice Krispie Treats';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Cool', 'Let cool completely', '⏰' FROM recipes WHERE name = 'Rice Krispie Treats';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Cut', 'Cut into squares', '🔪' FROM recipes WHERE name = 'Rice Krispie Treats';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Rice Krispie Treats';

-- Mug Apple Crisp
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get mug', 'Get a microwave-safe mug', '☕' FROM recipes WHERE name = 'Mug Apple Crisp';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Cut apple', 'Cut apple into small pieces', '🔪' FROM recipes WHERE name = 'Mug Apple Crisp';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add apple', 'Put apple pieces in mug', '🍎' FROM recipes WHERE name = 'Mug Apple Crisp';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add butter', 'Add 1 tbsp butter', '🧈' FROM recipes WHERE name = 'Mug Apple Crisp';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add oats', 'Add 1 tbsp oats', '🥣' FROM recipes WHERE name = 'Mug Apple Crisp';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Add sugar', 'Add 1 tbsp brown sugar', '🥄' FROM recipes WHERE name = 'Mug Apple Crisp';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Add spice', 'Add pinch of cinnamon', '✨' FROM recipes WHERE name = 'Mug Apple Crisp';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Mix', 'Mix together', '🥄' FROM recipes WHERE name = 'Mug Apple Crisp';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Cook', 'Microwave for 2 minutes', '⏰' FROM recipes WHERE name = 'Mug Apple Crisp';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Cool', 'Let cool a little', '🔥' FROM recipes WHERE name = 'Mug Apple Crisp';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 11, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Mug Apple Crisp';

-- Frozen Grapes
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Wash', 'Wash grapes', '🚿' FROM recipes WHERE name = 'Frozen Grapes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Pick', 'Pull grapes off stem', '🍇' FROM recipes WHERE name = 'Frozen Grapes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Spread', 'Put on baking sheet or plate', '🍽️' FROM recipes WHERE name = 'Frozen Grapes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Freeze', 'Put in freezer', '❄️' FROM recipes WHERE name = 'Frozen Grapes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Wait', 'Wait 2-3 hours until frozen', '⏰' FROM recipes WHERE name = 'Frozen Grapes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Store', 'Put in bag or bowl', '🥣' FROM recipes WHERE name = 'Frozen Grapes';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Enjoy!', 'Enjoy frozen grapes!', '😋' FROM recipes WHERE name = 'Frozen Grapes';

-- =====================================================
-- DRINK RECIPES
-- =====================================================

-- Fresh Lemonade
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Cut', 'Cut lemons in half', '🔪' FROM recipes WHERE name = 'Fresh Lemonade';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Squeeze', 'Squeeze juice into pitcher', '🍋' FROM recipes WHERE name = 'Fresh Lemonade';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Remove seeds', 'Remove seeds', '👆' FROM recipes WHERE name = 'Fresh Lemonade';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add water', 'Add water', '💧' FROM recipes WHERE name = 'Fresh Lemonade';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add sugar', 'Add sugar', '🥄' FROM recipes WHERE name = 'Fresh Lemonade';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Stir', 'Stir until sugar dissolves', '🥄' FROM recipes WHERE name = 'Fresh Lemonade';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Taste', 'Taste and add more sugar if needed', '👅' FROM recipes WHERE name = 'Fresh Lemonade';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Add ice', 'Add ice', '🧊' FROM recipes WHERE name = 'Fresh Lemonade';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Enjoy!', 'Pour into glass and enjoy!', '😋' FROM recipes WHERE name = 'Fresh Lemonade';

-- Hot Chocolate
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Pour milk', 'Pour milk into microwave-safe mug', '🥛' FROM recipes WHERE name = 'Hot Chocolate';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Heat', 'Microwave for 1 minute 30 seconds', '⏰' FROM recipes WHERE name = 'Hot Chocolate';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Remove', 'Carefully take out (hot!)', '🔥' FROM recipes WHERE name = 'Hot Chocolate';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Add mix', 'Add hot chocolate mix', '🍫' FROM recipes WHERE name = 'Hot Chocolate';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Stir', 'Stir until dissolved', '🥄' FROM recipes WHERE name = 'Hot Chocolate';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Top it', 'Add marshmallows on top', '☁️' FROM recipes WHERE name = 'Hot Chocolate';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Cool', 'Let cool a little', '⏰' FROM recipes WHERE name = 'Hot Chocolate';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Hot Chocolate';

-- Strawberry Milk
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Pour milk', 'Pour milk into glass', '🥛' FROM recipes WHERE name = 'Strawberry Milk';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Add syrup', 'Add strawberry syrup', '🍓' FROM recipes WHERE name = 'Strawberry Milk';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Stir', 'Stir with spoon', '🥄' FROM recipes WHERE name = 'Strawberry Milk';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Adjust', 'Add more syrup if you want it sweeter', '🍓' FROM recipes WHERE name = 'Strawberry Milk';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Strawberry Milk';

-- Fresh Orange Juice
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Cut', 'Cut oranges in half', '🔪' FROM recipes WHERE name = 'Fresh Orange Juice';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Squeeze', 'Squeeze juice using juicer', '🍊' FROM recipes WHERE name = 'Fresh Orange Juice';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Strain', 'Strain out pulp if you want', '🥄' FROM recipes WHERE name = 'Fresh Orange Juice';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Pour', 'Pour into glass', '🥛' FROM recipes WHERE name = 'Fresh Orange Juice';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add ice', 'Add ice if you want', '🧊' FROM recipes WHERE name = 'Fresh Orange Juice';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Fresh Orange Juice';

-- Fruit Punch
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Get pitcher', 'Get pitcher', '🫙' FROM recipes WHERE name = 'Fruit Punch';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Add juice', 'Pour in fruit juice', '🧃' FROM recipes WHERE name = 'Fruit Punch';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Add soda', 'Add ginger ale or lemon-lime soda', '🥤' FROM recipes WHERE name = 'Fruit Punch';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Stir', 'Stir gently', '🥄' FROM recipes WHERE name = 'Fruit Punch';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Add ice', 'Add ice', '🧊' FROM recipes WHERE name = 'Fruit Punch';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Pour', 'Pour into glass', '🥛' FROM recipes WHERE name = 'Fruit Punch';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Fruit Punch';

-- Vanilla Milkshake
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Add ice cream', 'Put 2 scoops vanilla ice cream in blender', '🍨' FROM recipes WHERE name = 'Vanilla Milkshake';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Add milk', 'Add milk', '🥛' FROM recipes WHERE name = 'Vanilla Milkshake';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Close lid', 'Put lid on blender', '👆' FROM recipes WHERE name = 'Vanilla Milkshake';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Blend', 'Blend until smooth', '🔄' FROM recipes WHERE name = 'Vanilla Milkshake';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Pour', 'Pour into glass', '🥛' FROM recipes WHERE name = 'Vanilla Milkshake';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Top it', 'Add whipped cream on top if you want', '☁️' FROM recipes WHERE name = 'Vanilla Milkshake';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Add straw', 'Add a straw', '🥤' FROM recipes WHERE name = 'Vanilla Milkshake';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Vanilla Milkshake';

-- Iced Tea
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 1, 'Boil water', 'Boil water', '💧' FROM recipes WHERE name = 'Iced Tea';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 2, 'Add tea bags', 'Put tea bags in pitcher', '🫖' FROM recipes WHERE name = 'Iced Tea';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 3, 'Pour water', 'Pour hot water over tea bags', '💧' FROM recipes WHERE name = 'Iced Tea';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 4, 'Steep', 'Let steep for 5 minutes', '⏰' FROM recipes WHERE name = 'Iced Tea';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 5, 'Remove bags', 'Remove tea bags', '👆' FROM recipes WHERE name = 'Iced Tea';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 6, 'Sweeten', 'Add sugar and stir', '🥄' FROM recipes WHERE name = 'Iced Tea';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 7, 'Cool', 'Let cool', '⏰' FROM recipes WHERE name = 'Iced Tea';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 8, 'Add ice', 'Add ice', '🧊' FROM recipes WHERE name = 'Iced Tea';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 9, 'Pour', 'Pour into glass', '🥛' FROM recipes WHERE name = 'Iced Tea';
INSERT INTO recipe_steps (recipe_id, step_number, action, instruction, emoji) 
SELECT id, 10, 'Enjoy!', 'Enjoy!', '😋' FROM recipes WHERE name = 'Iced Tea';

-- Verify all recipes have steps now
SELECT 'Part 2 recipe steps added!' as status;
SELECT r.name, COUNT(rs.id) as steps 
FROM recipes r 
LEFT JOIN recipe_steps rs ON rs.recipe_id = r.id 
WHERE r.name IN (
  'Baked Potato', 'Fish Sticks', 'Easy Tacos', 'Frozen Pizza', 
  'Butter Noodles', 'Apple Slices with PB', 'String Cheese',
  'Mug Brownie', 'Hot Chocolate', 'Vanilla Milkshake'
)
GROUP BY r.name 
ORDER BY r.name;
