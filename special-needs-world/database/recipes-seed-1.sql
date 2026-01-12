-- =====================================================
-- 100 VISUAL RECIPES FOR SPECIAL NEEDS WORLD
-- Inspired by Accessible Chef's task analysis approach
-- Run this AFTER recipes-schema.sql
-- =====================================================

-- =====================================================
-- BREAKFAST RECIPES (1-20)
-- =====================================================

-- 1. Peanut Butter Banana Toast
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_healthy, is_vegetarian)
VALUES ('pb-banana-toast', 'Peanut Butter Banana Toast', 'A yummy and healthy breakfast!', '🍌', 'breakfast', 'easy', 5, 1, false, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'pb-banana-toast'), 'Bread', '1 slice', '🍞', 1),
((SELECT id FROM recipes WHERE slug = 'pb-banana-toast'), 'Peanut Butter', '2 tablespoons', '🥜', 2),
((SELECT id FROM recipes WHERE slug = 'pb-banana-toast'), 'Banana', '1', '🍌', 3);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'pb-banana-toast'), 1, 'Put bread in toaster', 'Toast', '🍞'),
((SELECT id FROM recipes WHERE slug = 'pb-banana-toast'), 2, 'Wait for toast to pop up', 'Wait', '⏰'),
((SELECT id FROM recipes WHERE slug = 'pb-banana-toast'), 3, 'Spread peanut butter on toast', 'Spread', '🥜'),
((SELECT id FROM recipes WHERE slug = 'pb-banana-toast'), 4, 'Peel the banana', 'Peel', '🍌'),
((SELECT id FROM recipes WHERE slug = 'pb-banana-toast'), 5, 'Cut banana into circles', 'Cut', '🔪'),
((SELECT id FROM recipes WHERE slug = 'pb-banana-toast'), 6, 'Put banana slices on top', 'Add', '👆'),
((SELECT id FROM recipes WHERE slug = 'pb-banana-toast'), 7, 'Enjoy your toast!', 'Eat', '😋');

-- 2. Yogurt Parfait
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_no_knives, is_healthy, is_vegetarian)
VALUES ('yogurt-parfait', 'Yogurt Parfait', 'Layers of yummy goodness!', '🍓', 'breakfast', 'easy', 5, 1, true, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'yogurt-parfait'), 'Yogurt', '1 cup', '🥛', 1),
((SELECT id FROM recipes WHERE slug = 'yogurt-parfait'), 'Granola', '1/2 cup', '🥣', 2),
((SELECT id FROM recipes WHERE slug = 'yogurt-parfait'), 'Strawberries', '5', '🍓', 3),
((SELECT id FROM recipes WHERE slug = 'yogurt-parfait'), 'Blueberries', '1/4 cup', '🫐', 4);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'yogurt-parfait'), 1, 'Get a tall glass or bowl', 'Get', '🥛'),
((SELECT id FROM recipes WHERE slug = 'yogurt-parfait'), 2, 'Put some yogurt on bottom', 'Add', '🥄'),
((SELECT id FROM recipes WHERE slug = 'yogurt-parfait'), 3, 'Add a layer of granola', 'Sprinkle', '🥣'),
((SELECT id FROM recipes WHERE slug = 'yogurt-parfait'), 4, 'Add some berries', 'Add', '🍓'),
((SELECT id FROM recipes WHERE slug = 'yogurt-parfait'), 5, 'Add more yogurt', 'Layer', '🥛'),
((SELECT id FROM recipes WHERE slug = 'yogurt-parfait'), 6, 'Add more granola and berries on top', 'Top', '🫐'),
((SELECT id FROM recipes WHERE slug = 'yogurt-parfait'), 7, 'Enjoy your parfait!', 'Eat', '😋');

-- 3. Scrambled Eggs
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_healthy, is_vegetarian, requires_adult_help)
VALUES ('scrambled-eggs', 'Scrambled Eggs', 'Fluffy eggs for breakfast!', '🥚', 'breakfast', 'easy', 2, 5, 1, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'scrambled-eggs'), 'Eggs', '2', '🥚', 1),
((SELECT id FROM recipes WHERE slug = 'scrambled-eggs'), 'Butter', '1 tablespoon', '🧈', 2),
((SELECT id FROM recipes WHERE slug = 'scrambled-eggs'), 'Salt', 'a pinch', '🧂', 3),
((SELECT id FROM recipes WHERE slug = 'scrambled-eggs'), 'Milk', '1 tablespoon', '🥛', 4);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji, requires_adult) VALUES
((SELECT id FROM recipes WHERE slug = 'scrambled-eggs'), 1, 'Crack eggs into a bowl', 'Crack', '🥚', false),
((SELECT id FROM recipes WHERE slug = 'scrambled-eggs'), 2, 'Add milk and salt', 'Add', '🥛', false),
((SELECT id FROM recipes WHERE slug = 'scrambled-eggs'), 3, 'Mix with a fork until yellow', 'Mix', '🥄', false),
((SELECT id FROM recipes WHERE slug = 'scrambled-eggs'), 4, 'Put butter in pan on medium heat', 'Melt', '🧈', true),
((SELECT id FROM recipes WHERE slug = 'scrambled-eggs'), 5, 'Pour eggs into pan', 'Pour', '🍳', true),
((SELECT id FROM recipes WHERE slug = 'scrambled-eggs'), 6, 'Stir slowly with spatula', 'Stir', '🥄', true),
((SELECT id FROM recipes WHERE slug = 'scrambled-eggs'), 7, 'Cook until not runny', 'Cook', '🔥', true),
((SELECT id FROM recipes WHERE slug = 'scrambled-eggs'), 8, 'Put on plate and enjoy!', 'Serve', '😋', false);

-- 4. Overnight Oats
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_no_knives, is_healthy, is_vegetarian)
VALUES ('overnight-oats', 'Overnight Oats', 'Make tonight, eat tomorrow!', '🥣', 'breakfast', 'easy', 5, 1, true, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'overnight-oats'), 'Oats', '1/2 cup', '🥣', 1),
((SELECT id FROM recipes WHERE slug = 'overnight-oats'), 'Milk', '1/2 cup', '🥛', 2),
((SELECT id FROM recipes WHERE slug = 'overnight-oats'), 'Yogurt', '1/4 cup', '🥛', 3),
((SELECT id FROM recipes WHERE slug = 'overnight-oats'), 'Honey', '1 tablespoon', '🍯', 4),
((SELECT id FROM recipes WHERE slug = 'overnight-oats'), 'Berries', '1/4 cup', '🍓', 5);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'overnight-oats'), 1, 'Get a jar or container with lid', 'Get', '🫙'),
((SELECT id FROM recipes WHERE slug = 'overnight-oats'), 2, 'Add oats to jar', 'Add', '🥣'),
((SELECT id FROM recipes WHERE slug = 'overnight-oats'), 3, 'Pour in milk', 'Pour', '🥛'),
((SELECT id FROM recipes WHERE slug = 'overnight-oats'), 4, 'Add yogurt', 'Add', '🥄'),
((SELECT id FROM recipes WHERE slug = 'overnight-oats'), 5, 'Add honey', 'Drizzle', '🍯'),
((SELECT id FROM recipes WHERE slug = 'overnight-oats'), 6, 'Mix everything together', 'Mix', '🥄'),
((SELECT id FROM recipes WHERE slug = 'overnight-oats'), 7, 'Put lid on and put in fridge overnight', 'Refrigerate', '❄️'),
((SELECT id FROM recipes WHERE slug = 'overnight-oats'), 8, 'In morning, add berries and eat!', 'Enjoy', '😋');

-- 5. Cereal Bowl
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_no_knives, is_vegetarian)
VALUES ('cereal-bowl', 'Cereal Bowl', 'Quick and easy breakfast!', '🥣', 'breakfast', 'easy', 2, 1, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'cereal-bowl'), 'Cereal', '1 cup', '🥣', 1),
((SELECT id FROM recipes WHERE slug = 'cereal-bowl'), 'Milk', '1/2 cup', '🥛', 2);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'cereal-bowl'), 1, 'Get a bowl', 'Get', '🥣'),
((SELECT id FROM recipes WHERE slug = 'cereal-bowl'), 2, 'Pour cereal in bowl', 'Pour', '🥣'),
((SELECT id FROM recipes WHERE slug = 'cereal-bowl'), 3, 'Pour milk on cereal', 'Pour', '🥛'),
((SELECT id FROM recipes WHERE slug = 'cereal-bowl'), 4, 'Get a spoon', 'Get', '🥄'),
((SELECT id FROM recipes WHERE slug = 'cereal-bowl'), 5, 'Enjoy your cereal!', 'Eat', '😋');

-- 6. Avocado Toast
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_healthy, is_vegetarian)
VALUES ('avocado-toast', 'Avocado Toast', 'Creamy and delicious!', '🥑', 'breakfast', 'easy', 5, 1, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'avocado-toast'), 'Bread', '1 slice', '🍞', 1),
((SELECT id FROM recipes WHERE slug = 'avocado-toast'), 'Avocado', '1/2', '🥑', 2),
((SELECT id FROM recipes WHERE slug = 'avocado-toast'), 'Salt', 'a pinch', '🧂', 3),
((SELECT id FROM recipes WHERE slug = 'avocado-toast'), 'Lemon juice', 'a squeeze', '🍋', 4);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'avocado-toast'), 1, 'Toast the bread', 'Toast', '🍞'),
((SELECT id FROM recipes WHERE slug = 'avocado-toast'), 2, 'Cut avocado in half', 'Cut', '🔪'),
((SELECT id FROM recipes WHERE slug = 'avocado-toast'), 3, 'Scoop out avocado into bowl', 'Scoop', '🥄'),
((SELECT id FROM recipes WHERE slug = 'avocado-toast'), 4, 'Mash with fork', 'Mash', '🥄'),
((SELECT id FROM recipes WHERE slug = 'avocado-toast'), 5, 'Add salt and lemon juice', 'Season', '🧂'),
((SELECT id FROM recipes WHERE slug = 'avocado-toast'), 6, 'Spread on toast', 'Spread', '🥑'),
((SELECT id FROM recipes WHERE slug = 'avocado-toast'), 7, 'Enjoy!', 'Eat', '😋');

-- 7. French Toast
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_vegetarian, requires_adult_help)
VALUES ('french-toast', 'French Toast', 'Sweet and golden!', '🍞', 'breakfast', 'medium', 5, 10, 2, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'french-toast'), 'Bread', '2 slices', '🍞', 1),
((SELECT id FROM recipes WHERE slug = 'french-toast'), 'Egg', '1', '🥚', 2),
((SELECT id FROM recipes WHERE slug = 'french-toast'), 'Milk', '2 tablespoons', '🥛', 3),
((SELECT id FROM recipes WHERE slug = 'french-toast'), 'Cinnamon', 'a sprinkle', '🫙', 4),
((SELECT id FROM recipes WHERE slug = 'french-toast'), 'Butter', '1 tablespoon', '🧈', 5),
((SELECT id FROM recipes WHERE slug = 'french-toast'), 'Maple Syrup', 'to taste', '🍁', 6);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji, requires_adult) VALUES
((SELECT id FROM recipes WHERE slug = 'french-toast'), 1, 'Crack egg into shallow bowl', 'Crack', '🥚', false),
((SELECT id FROM recipes WHERE slug = 'french-toast'), 2, 'Add milk and cinnamon', 'Add', '🥛', false),
((SELECT id FROM recipes WHERE slug = 'french-toast'), 3, 'Mix with fork', 'Mix', '🥄', false),
((SELECT id FROM recipes WHERE slug = 'french-toast'), 4, 'Melt butter in pan on medium', 'Melt', '🧈', true),
((SELECT id FROM recipes WHERE slug = 'french-toast'), 5, 'Dip bread in egg mixture', 'Dip', '🍞', false),
((SELECT id FROM recipes WHERE slug = 'french-toast'), 6, 'Put bread in pan', 'Cook', '🍳', true),
((SELECT id FROM recipes WHERE slug = 'french-toast'), 7, 'Cook until golden, flip', 'Flip', '🔄', true),
((SELECT id FROM recipes WHERE slug = 'french-toast'), 8, 'Cook other side until golden', 'Cook', '🍳', true),
((SELECT id FROM recipes WHERE slug = 'french-toast'), 9, 'Put on plate, add syrup', 'Serve', '🍁', false);

-- 8. Banana Pancakes
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_healthy, is_vegetarian, requires_adult_help)
VALUES ('banana-pancakes', 'Banana Pancakes', 'Made with just 2 ingredients!', '🥞', 'breakfast', 'easy', 5, 10, 1, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'banana-pancakes'), 'Banana', '1 ripe', '🍌', 1),
((SELECT id FROM recipes WHERE slug = 'banana-pancakes'), 'Eggs', '2', '🥚', 2),
((SELECT id FROM recipes WHERE slug = 'banana-pancakes'), 'Butter', 'for cooking', '🧈', 3);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji, requires_adult) VALUES
((SELECT id FROM recipes WHERE slug = 'banana-pancakes'), 1, 'Peel banana and put in bowl', 'Peel', '🍌', false),
((SELECT id FROM recipes WHERE slug = 'banana-pancakes'), 2, 'Mash banana with fork', 'Mash', '🥄', false),
((SELECT id FROM recipes WHERE slug = 'banana-pancakes'), 3, 'Crack eggs into bowl', 'Crack', '🥚', false),
((SELECT id FROM recipes WHERE slug = 'banana-pancakes'), 4, 'Mix until smooth', 'Mix', '🥄', false),
((SELECT id FROM recipes WHERE slug = 'banana-pancakes'), 5, 'Heat pan with butter', 'Heat', '🍳', true),
((SELECT id FROM recipes WHERE slug = 'banana-pancakes'), 6, 'Pour small circles of batter', 'Pour', '🥞', true),
((SELECT id FROM recipes WHERE slug = 'banana-pancakes'), 7, 'Wait for bubbles, then flip', 'Flip', '🔄', true),
((SELECT id FROM recipes WHERE slug = 'banana-pancakes'), 8, 'Cook until golden', 'Cook', '🍳', true),
((SELECT id FROM recipes WHERE slug = 'banana-pancakes'), 9, 'Serve and enjoy!', 'Eat', '😋', false);

-- 9. Oatmeal
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_microwave, is_healthy, is_vegetarian)
VALUES ('oatmeal', 'Instant Oatmeal', 'Warm and filling!', '🥣', 'breakfast', 'easy', 2, 2, 1, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'oatmeal'), 'Instant Oatmeal', '1 packet', '🥣', 1),
((SELECT id FROM recipes WHERE slug = 'oatmeal'), 'Water', '1/2 cup', '💧', 2),
((SELECT id FROM recipes WHERE slug = 'oatmeal'), 'Brown Sugar', '1 teaspoon', '🍬', 3);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'oatmeal'), 1, 'Pour oatmeal in microwave-safe bowl', 'Pour', '🥣'),
((SELECT id FROM recipes WHERE slug = 'oatmeal'), 2, 'Add water', 'Add', '💧'),
((SELECT id FROM recipes WHERE slug = 'oatmeal'), 3, 'Microwave for 1-2 minutes', 'Microwave', '📻'),
((SELECT id FROM recipes WHERE slug = 'oatmeal'), 4, 'Careful! Bowl is hot!', 'Careful', '🔥'),
((SELECT id FROM recipes WHERE slug = 'oatmeal'), 5, 'Stir oatmeal', 'Stir', '🥄'),
((SELECT id FROM recipes WHERE slug = 'oatmeal'), 6, 'Add brown sugar', 'Sprinkle', '🍬'),
((SELECT id FROM recipes WHERE slug = 'oatmeal'), 7, 'Let cool a little and enjoy!', 'Eat', '😋');

-- 10. Breakfast Burrito
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, requires_adult_help)
VALUES ('breakfast-burrito', 'Breakfast Burrito', 'Eggs and cheese wrapped up!', '🌯', 'breakfast', 'medium', 5, 10, 1, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'breakfast-burrito'), 'Tortilla', '1 large', '🫓', 1),
((SELECT id FROM recipes WHERE slug = 'breakfast-burrito'), 'Eggs', '2', '🥚', 2),
((SELECT id FROM recipes WHERE slug = 'breakfast-burrito'), 'Cheese', '1/4 cup shredded', '🧀', 3),
((SELECT id FROM recipes WHERE slug = 'breakfast-burrito'), 'Butter', '1 teaspoon', '🧈', 4);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji, requires_adult) VALUES
((SELECT id FROM recipes WHERE slug = 'breakfast-burrito'), 1, 'Crack eggs in bowl', 'Crack', '🥚', false),
((SELECT id FROM recipes WHERE slug = 'breakfast-burrito'), 2, 'Beat eggs with fork', 'Beat', '🥄', false),
((SELECT id FROM recipes WHERE slug = 'breakfast-burrito'), 3, 'Melt butter in pan', 'Melt', '🧈', true),
((SELECT id FROM recipes WHERE slug = 'breakfast-burrito'), 4, 'Pour eggs in pan, scramble', 'Scramble', '🍳', true),
((SELECT id FROM recipes WHERE slug = 'breakfast-burrito'), 5, 'Warm tortilla in microwave 15 seconds', 'Warm', '🫓', false),
((SELECT id FROM recipes WHERE slug = 'breakfast-burrito'), 6, 'Put eggs on tortilla', 'Add', '🥚', false),
((SELECT id FROM recipes WHERE slug = 'breakfast-burrito'), 7, 'Add cheese', 'Sprinkle', '🧀', false),
((SELECT id FROM recipes WHERE slug = 'breakfast-burrito'), 8, 'Fold sides in, then roll up', 'Roll', '🌯', false),
((SELECT id FROM recipes WHERE slug = 'breakfast-burrito'), 9, 'Enjoy your burrito!', 'Eat', '😋', false);

-- 11. Smoothie Bowl
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_healthy, is_vegetarian)
VALUES ('smoothie-bowl', 'Smoothie Bowl', 'Thick smoothie you eat with a spoon!', '🥣', 'breakfast', 'easy', 5, 1, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'smoothie-bowl'), 'Frozen Berries', '1 cup', '🍓', 1),
((SELECT id FROM recipes WHERE slug = 'smoothie-bowl'), 'Banana', '1 frozen', '🍌', 2),
((SELECT id FROM recipes WHERE slug = 'smoothie-bowl'), 'Milk', '1/4 cup', '🥛', 3),
((SELECT id FROM recipes WHERE slug = 'smoothie-bowl'), 'Granola', 'for topping', '🥣', 4),
((SELECT id FROM recipes WHERE slug = 'smoothie-bowl'), 'Sliced fruit', 'for topping', '🍓', 5);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'smoothie-bowl'), 1, 'Put frozen berries in blender', 'Add', '🍓'),
((SELECT id FROM recipes WHERE slug = 'smoothie-bowl'), 2, 'Add frozen banana', 'Add', '🍌'),
((SELECT id FROM recipes WHERE slug = 'smoothie-bowl'), 3, 'Add just a little milk', 'Pour', '🥛'),
((SELECT id FROM recipes WHERE slug = 'smoothie-bowl'), 4, 'Blend until thick and smooth', 'Blend', '🌀'),
((SELECT id FROM recipes WHERE slug = 'smoothie-bowl'), 5, 'Pour into a bowl', 'Pour', '🥣'),
((SELECT id FROM recipes WHERE slug = 'smoothie-bowl'), 6, 'Add toppings in rows', 'Decorate', '🎨'),
((SELECT id FROM recipes WHERE slug = 'smoothie-bowl'), 7, 'Eat with a spoon!', 'Eat', '😋');

-- 12. Cheese Toast
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_microwave, is_no_knives, is_vegetarian)
VALUES ('cheese-toast', 'Cheese Toast', 'Melty cheese on toast!', '🧀', 'breakfast', 'easy', 3, 1, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'cheese-toast'), 'Bread', '1 slice', '🍞', 1),
((SELECT id FROM recipes WHERE slug = 'cheese-toast'), 'Cheese slice', '1', '🧀', 2);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'cheese-toast'), 1, 'Toast the bread', 'Toast', '🍞'),
((SELECT id FROM recipes WHERE slug = 'cheese-toast'), 2, 'Put cheese on hot toast', 'Add', '🧀'),
((SELECT id FROM recipes WHERE slug = 'cheese-toast'), 3, 'Microwave 15 seconds to melt', 'Melt', '📻'),
((SELECT id FROM recipes WHERE slug = 'cheese-toast'), 4, 'Let cool a little', 'Cool', '❄️'),
((SELECT id FROM recipes WHERE slug = 'cheese-toast'), 5, 'Enjoy!', 'Eat', '😋');

-- 13. Fruit Salad
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_healthy, is_vegetarian)
VALUES ('fruit-salad', 'Rainbow Fruit Salad', 'Colorful and healthy!', '🍇', 'breakfast', 'easy', 10, 2, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'fruit-salad'), 'Strawberries', '5', '🍓', 1),
((SELECT id FROM recipes WHERE slug = 'fruit-salad'), 'Orange', '1', '🍊', 2),
((SELECT id FROM recipes WHERE slug = 'fruit-salad'), 'Banana', '1', '🍌', 3),
((SELECT id FROM recipes WHERE slug = 'fruit-salad'), 'Grapes', '1/2 cup', '🍇', 4),
((SELECT id FROM recipes WHERE slug = 'fruit-salad'), 'Blueberries', '1/4 cup', '🫐', 5);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'fruit-salad'), 1, 'Wash all the fruit', 'Wash', '🚿'),
((SELECT id FROM recipes WHERE slug = 'fruit-salad'), 2, 'Cut strawberries in half', 'Cut', '🔪'),
((SELECT id FROM recipes WHERE slug = 'fruit-salad'), 3, 'Peel and separate orange', 'Peel', '🍊'),
((SELECT id FROM recipes WHERE slug = 'fruit-salad'), 4, 'Peel and slice banana', 'Slice', '🍌'),
((SELECT id FROM recipes WHERE slug = 'fruit-salad'), 5, 'Put all fruit in a big bowl', 'Combine', '🥣'),
((SELECT id FROM recipes WHERE slug = 'fruit-salad'), 6, 'Mix gently', 'Toss', '🥄'),
((SELECT id FROM recipes WHERE slug = 'fruit-salad'), 7, 'Enjoy your rainbow!', 'Eat', '🌈');

-- 14. Cinnamon Toast
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_knives, is_vegetarian)
VALUES ('cinnamon-toast', 'Cinnamon Toast', 'Sweet and crunchy!', '🍞', 'breakfast', 'easy', 3, 1, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'cinnamon-toast'), 'Bread', '1 slice', '🍞', 1),
((SELECT id FROM recipes WHERE slug = 'cinnamon-toast'), 'Butter', '1 tablespoon', '🧈', 2),
((SELECT id FROM recipes WHERE slug = 'cinnamon-toast'), 'Sugar', '1 teaspoon', '🍬', 3),
((SELECT id FROM recipes WHERE slug = 'cinnamon-toast'), 'Cinnamon', '1/4 teaspoon', '🫙', 4);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'cinnamon-toast'), 1, 'Toast the bread', 'Toast', '🍞'),
((SELECT id FROM recipes WHERE slug = 'cinnamon-toast'), 2, 'Spread butter on hot toast', 'Spread', '🧈'),
((SELECT id FROM recipes WHERE slug = 'cinnamon-toast'), 3, 'Mix sugar and cinnamon in small bowl', 'Mix', '🥄'),
((SELECT id FROM recipes WHERE slug = 'cinnamon-toast'), 4, 'Sprinkle mixture on buttered toast', 'Sprinkle', '✨'),
((SELECT id FROM recipes WHERE slug = 'cinnamon-toast'), 5, 'Enjoy while warm!', 'Eat', '😋');

-- 15. Bagel with Cream Cheese
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_knives, is_vegetarian)
VALUES ('bagel-cream-cheese', 'Bagel with Cream Cheese', 'Simple and tasty!', '🥯', 'breakfast', 'easy', 3, 1, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'bagel-cream-cheese'), 'Bagel', '1', '🥯', 1),
((SELECT id FROM recipes WHERE slug = 'bagel-cream-cheese'), 'Cream Cheese', '2 tablespoons', '🧀', 2);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'bagel-cream-cheese'), 1, 'Cut bagel in half (or buy pre-cut)', 'Cut', '🔪'),
((SELECT id FROM recipes WHERE slug = 'bagel-cream-cheese'), 2, 'Toast bagel halves', 'Toast', '🥯'),
((SELECT id FROM recipes WHERE slug = 'bagel-cream-cheese'), 3, 'Spread cream cheese on each half', 'Spread', '🧀'),
((SELECT id FROM recipes WHERE slug = 'bagel-cream-cheese'), 4, 'Enjoy!', 'Eat', '😋');

-- 16. Waffle with Toppings
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_vegetarian)
VALUES ('waffle-toppings', 'Waffle with Toppings', 'Frozen waffle made special!', '🧇', 'breakfast', 'easy', 5, 1, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'waffle-toppings'), 'Frozen Waffle', '1', '🧇', 1),
((SELECT id FROM recipes WHERE slug = 'waffle-toppings'), 'Butter', '1 teaspoon', '🧈', 2),
((SELECT id FROM recipes WHERE slug = 'waffle-toppings'), 'Maple Syrup', '2 tablespoons', '🍁', 3),
((SELECT id FROM recipes WHERE slug = 'waffle-toppings'), 'Berries', '1/4 cup', '🍓', 4);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'waffle-toppings'), 1, 'Toast frozen waffle', 'Toast', '🧇'),
((SELECT id FROM recipes WHERE slug = 'waffle-toppings'), 2, 'Put on plate', 'Plate', '🍽️'),
((SELECT id FROM recipes WHERE slug = 'waffle-toppings'), 3, 'Add butter on top', 'Add', '🧈'),
((SELECT id FROM recipes WHERE slug = 'waffle-toppings'), 4, 'Pour syrup', 'Drizzle', '🍁'),
((SELECT id FROM recipes WHERE slug = 'waffle-toppings'), 5, 'Add berries', 'Top', '🍓'),
((SELECT id FROM recipes WHERE slug = 'waffle-toppings'), 6, 'Enjoy!', 'Eat', '😋');

-- 17. Apple Cinnamon Oatmeal
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_microwave, is_healthy, is_vegetarian)
VALUES ('apple-cinnamon-oatmeal', 'Apple Cinnamon Oatmeal', 'Like apple pie for breakfast!', '🍎', 'breakfast', 'easy', 5, 3, 1, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'apple-cinnamon-oatmeal'), 'Oats', '1/2 cup', '🥣', 1),
((SELECT id FROM recipes WHERE slug = 'apple-cinnamon-oatmeal'), 'Water', '1 cup', '💧', 2),
((SELECT id FROM recipes WHERE slug = 'apple-cinnamon-oatmeal'), 'Apple', '1/2 diced', '🍎', 3),
((SELECT id FROM recipes WHERE slug = 'apple-cinnamon-oatmeal'), 'Cinnamon', '1/4 teaspoon', '🫙', 4),
((SELECT id FROM recipes WHERE slug = 'apple-cinnamon-oatmeal'), 'Honey', '1 tablespoon', '🍯', 5);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'apple-cinnamon-oatmeal'), 1, 'Put oats in microwave-safe bowl', 'Add', '🥣'),
((SELECT id FROM recipes WHERE slug = 'apple-cinnamon-oatmeal'), 2, 'Add water', 'Pour', '💧'),
((SELECT id FROM recipes WHERE slug = 'apple-cinnamon-oatmeal'), 3, 'Add diced apple', 'Add', '🍎'),
((SELECT id FROM recipes WHERE slug = 'apple-cinnamon-oatmeal'), 4, 'Microwave 2-3 minutes', 'Microwave', '📻'),
((SELECT id FROM recipes WHERE slug = 'apple-cinnamon-oatmeal'), 5, 'Careful! Hot!', 'Careful', '🔥'),
((SELECT id FROM recipes WHERE slug = 'apple-cinnamon-oatmeal'), 6, 'Stir in cinnamon', 'Stir', '🥄'),
((SELECT id FROM recipes WHERE slug = 'apple-cinnamon-oatmeal'), 7, 'Drizzle honey on top', 'Drizzle', '🍯'),
((SELECT id FROM recipes WHERE slug = 'apple-cinnamon-oatmeal'), 8, 'Enjoy!', 'Eat', '😋');

-- 18. English Muffin Pizza
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_vegetarian, requires_adult_help)
VALUES ('english-muffin-pizza', 'English Muffin Pizza', 'Pizza for breakfast!', '🍕', 'breakfast', 'easy', 5, 5, 1, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'english-muffin-pizza'), 'English Muffin', '1', '🥯', 1),
((SELECT id FROM recipes WHERE slug = 'english-muffin-pizza'), 'Pizza Sauce', '2 tablespoons', '🍅', 2),
((SELECT id FROM recipes WHERE slug = 'english-muffin-pizza'), 'Shredded Cheese', '1/4 cup', '🧀', 3);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji, requires_adult) VALUES
((SELECT id FROM recipes WHERE slug = 'english-muffin-pizza'), 1, 'Split English muffin in half', 'Split', '🥯', false),
((SELECT id FROM recipes WHERE slug = 'english-muffin-pizza'), 2, 'Put on baking sheet', 'Place', '🍽️', false),
((SELECT id FROM recipes WHERE slug = 'english-muffin-pizza'), 3, 'Spread sauce on each half', 'Spread', '🍅', false),
((SELECT id FROM recipes WHERE slug = 'english-muffin-pizza'), 4, 'Sprinkle cheese on top', 'Sprinkle', '🧀', false),
((SELECT id FROM recipes WHERE slug = 'english-muffin-pizza'), 5, 'Bake at 400°F for 5 minutes', 'Bake', '🔥', true),
((SELECT id FROM recipes WHERE slug = 'english-muffin-pizza'), 6, 'Let cool before eating', 'Cool', '❄️', false),
((SELECT id FROM recipes WHERE slug = 'english-muffin-pizza'), 7, 'Enjoy!', 'Eat', '😋', false);

-- 19. Cottage Cheese and Fruit
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_no_knives, is_healthy, is_vegetarian)
VALUES ('cottage-cheese-fruit', 'Cottage Cheese and Fruit', 'Protein-packed breakfast!', '🥛', 'breakfast', 'easy', 3, 1, true, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'cottage-cheese-fruit'), 'Cottage Cheese', '1 cup', '🥛', 1),
((SELECT id FROM recipes WHERE slug = 'cottage-cheese-fruit'), 'Peaches', '1/2 cup canned', '🍑', 2),
((SELECT id FROM recipes WHERE slug = 'cottage-cheese-fruit'), 'Honey', '1 teaspoon', '🍯', 3);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'cottage-cheese-fruit'), 1, 'Put cottage cheese in bowl', 'Scoop', '🥛'),
((SELECT id FROM recipes WHERE slug = 'cottage-cheese-fruit'), 2, 'Add peaches on top', 'Add', '🍑'),
((SELECT id FROM recipes WHERE slug = 'cottage-cheese-fruit'), 3, 'Drizzle honey', 'Drizzle', '🍯'),
((SELECT id FROM recipes WHERE slug = 'cottage-cheese-fruit'), 4, 'Enjoy!', 'Eat', '😋');

-- 20. Peanut Butter Toast with Honey
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_knives, is_healthy, is_vegetarian)
VALUES ('pb-honey-toast', 'Peanut Butter Honey Toast', 'Sweet and nutty!', '🍯', 'breakfast', 'easy', 3, 1, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'pb-honey-toast'), 'Bread', '1 slice', '🍞', 1),
((SELECT id FROM recipes WHERE slug = 'pb-honey-toast'), 'Peanut Butter', '2 tablespoons', '🥜', 2),
((SELECT id FROM recipes WHERE slug = 'pb-honey-toast'), 'Honey', '1 teaspoon', '🍯', 3);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'pb-honey-toast'), 1, 'Toast the bread', 'Toast', '🍞'),
((SELECT id FROM recipes WHERE slug = 'pb-honey-toast'), 2, 'Spread peanut butter', 'Spread', '🥜'),
((SELECT id FROM recipes WHERE slug = 'pb-honey-toast'), 3, 'Drizzle honey on top', 'Drizzle', '🍯'),
((SELECT id FROM recipes WHERE slug = 'pb-honey-toast'), 4, 'Enjoy!', 'Eat', '😋');
