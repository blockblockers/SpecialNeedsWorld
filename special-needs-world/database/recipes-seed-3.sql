-- =====================================================
-- RECIPES SEED DATA - PART 3
-- SNACKS (41-55), SIDES (56-70), DESSERTS (71-85), DRINKS (86-100)
-- =====================================================

-- =====================================================
-- SNACKS (41-55)
-- =====================================================

-- 41. Apple Slices with Peanut Butter
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_healthy, is_vegetarian)
VALUES ('apple-pb', 'Apple with Peanut Butter', 'Crunchy and creamy!', '🍎', 'snacks', 'easy', 5, 1, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'apple-pb'), 'Apple', '1', '🍎', 1),
((SELECT id FROM recipes WHERE slug = 'apple-pb'), 'Peanut Butter', '2 tablespoons', '🥜', 2);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'apple-pb'), 1, 'Wash the apple', 'Wash', '🚿'),
((SELECT id FROM recipes WHERE slug = 'apple-pb'), 2, 'Ask adult to slice apple', 'Cut', '🔪'),
((SELECT id FROM recipes WHERE slug = 'apple-pb'), 3, 'Put peanut butter in small bowl', 'Scoop', '🥜'),
((SELECT id FROM recipes WHERE slug = 'apple-pb'), 4, 'Dip apple in peanut butter', 'Dip', '🍎'),
((SELECT id FROM recipes WHERE slug = 'apple-pb'), 5, 'Enjoy!', 'Eat', '😋');

-- 42. Celery with Cream Cheese
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_no_knives, is_healthy, is_vegetarian)
VALUES ('celery-cream-cheese', 'Celery Boats', 'Crunchy veggie snack!', '🥬', 'snacks', 'easy', 3, 1, true, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'celery-cream-cheese'), 'Celery stalks', '3', '🥬', 1),
((SELECT id FROM recipes WHERE slug = 'celery-cream-cheese'), 'Cream Cheese', '3 tablespoons', '🧀', 2);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'celery-cream-cheese'), 1, 'Wash celery stalks', 'Wash', '🚿'),
((SELECT id FROM recipes WHERE slug = 'celery-cream-cheese'), 2, 'Fill groove with cream cheese', 'Spread', '🧀'),
((SELECT id FROM recipes WHERE slug = 'celery-cream-cheese'), 3, 'Enjoy!', 'Eat', '😋');

-- 43. Trail Mix
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_no_knives, is_vegetarian)
VALUES ('trail-mix', 'Trail Mix', 'Mix your own!', '🥜', 'snacks', 'easy', 3, 4, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'trail-mix'), 'Cereal', '1/2 cup', '🥣', 1),
((SELECT id FROM recipes WHERE slug = 'trail-mix'), 'Raisins', '1/4 cup', '🍇', 2),
((SELECT id FROM recipes WHERE slug = 'trail-mix'), 'Pretzels', '1/4 cup', '🥨', 3),
((SELECT id FROM recipes WHERE slug = 'trail-mix'), 'Chocolate Chips', '2 tablespoons', '🍫', 4),
((SELECT id FROM recipes WHERE slug = 'trail-mix'), 'Nuts (optional)', '1/4 cup', '🥜', 5);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'trail-mix'), 1, 'Get a big bowl', 'Get', '🥣'),
((SELECT id FROM recipes WHERE slug = 'trail-mix'), 2, 'Add all ingredients', 'Add', '➕'),
((SELECT id FROM recipes WHERE slug = 'trail-mix'), 3, 'Mix with hands', 'Mix', '👐'),
((SELECT id FROM recipes WHERE slug = 'trail-mix'), 4, 'Put in snack bags', 'Bag', '👜'),
((SELECT id FROM recipes WHERE slug = 'trail-mix'), 5, 'Enjoy anytime!', 'Eat', '😋');

-- 44. Cheese and Crackers
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_no_knives, is_vegetarian)
VALUES ('cheese-crackers', 'Cheese & Crackers', 'Classic snack!', '🧀', 'snacks', 'easy', 2, 1, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'cheese-crackers'), 'Crackers', '10', '🍪', 1),
((SELECT id FROM recipes WHERE slug = 'cheese-crackers'), 'Cheese slices', '2', '🧀', 2);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'cheese-crackers'), 1, 'Put crackers on plate', 'Arrange', '🍪'),
((SELECT id FROM recipes WHERE slug = 'cheese-crackers'), 2, 'Break cheese into cracker-sized pieces', 'Break', '🧀'),
((SELECT id FROM recipes WHERE slug = 'cheese-crackers'), 3, 'Put cheese on crackers', 'Stack', '🧀'),
((SELECT id FROM recipes WHERE slug = 'cheese-crackers'), 4, 'Enjoy!', 'Eat', '😋');

-- 45. Banana Bites
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_healthy, is_vegetarian)
VALUES ('banana-bites', 'Banana Bites', 'Frozen treat!', '🍌', 'snacks', 'easy', 10, 2, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'banana-bites'), 'Banana', '1', '🍌', 1),
((SELECT id FROM recipes WHERE slug = 'banana-bites'), 'Chocolate chips', '1/4 cup', '🍫', 2),
((SELECT id FROM recipes WHERE slug = 'banana-bites'), 'Sprinkles', 'optional', '✨', 3);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'banana-bites'), 1, 'Peel banana', 'Peel', '🍌'),
((SELECT id FROM recipes WHERE slug = 'banana-bites'), 2, 'Cut into circles', 'Slice', '🔪'),
((SELECT id FROM recipes WHERE slug = 'banana-bites'), 3, 'Put on plate with parchment paper', 'Arrange', '🍽️'),
((SELECT id FROM recipes WHERE slug = 'banana-bites'), 4, 'Melt chocolate in microwave 30 sec', 'Melt', '🍫'),
((SELECT id FROM recipes WHERE slug = 'banana-bites'), 5, 'Dip banana in chocolate', 'Dip', '🍌'),
((SELECT id FROM recipes WHERE slug = 'banana-bites'), 6, 'Add sprinkles if you want', 'Decorate', '✨'),
((SELECT id FROM recipes WHERE slug = 'banana-bites'), 7, 'Freeze for 1 hour', 'Freeze', '❄️'),
((SELECT id FROM recipes WHERE slug = 'banana-bites'), 8, 'Enjoy frozen!', 'Eat', '😋');

-- 46. Popcorn
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_microwave, is_vegetarian)
VALUES ('popcorn', 'Microwave Popcorn', 'Buttery and salty!', '🍿', 'snacks', 'easy', 4, 2, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'popcorn'), 'Microwave Popcorn bag', '1', '🍿', 1);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'popcorn'), 1, 'Remove plastic wrap from bag', 'Unwrap', '📦'),
((SELECT id FROM recipes WHERE slug = 'popcorn'), 2, 'Put bag in microwave RIGHT SIDE UP', 'Place', '🍿'),
((SELECT id FROM recipes WHERE slug = 'popcorn'), 3, 'Press popcorn button or 2-3 minutes', 'Microwave', '📻'),
((SELECT id FROM recipes WHERE slug = 'popcorn'), 4, 'Listen - stop when popping slows', 'Listen', '👂'),
((SELECT id FROM recipes WHERE slug = 'popcorn'), 5, 'Careful! Bag is HOT!', 'Careful', '🔥'),
((SELECT id FROM recipes WHERE slug = 'popcorn'), 6, 'Open away from face', 'Open', '💨'),
((SELECT id FROM recipes WHERE slug = 'popcorn'), 7, 'Pour in bowl and enjoy!', 'Eat', '😋');

-- 47. Ants on a Log
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_healthy, is_vegetarian)
VALUES ('ants-on-log', 'Ants on a Log', 'Fun to make and eat!', '🐜', 'snacks', 'easy', 5, 1, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'ants-on-log'), 'Celery stalks', '3', '🥬', 1),
((SELECT id FROM recipes WHERE slug = 'ants-on-log'), 'Peanut Butter', '3 tablespoons', '🥜', 2),
((SELECT id FROM recipes WHERE slug = 'ants-on-log'), 'Raisins', '2 tablespoons', '🍇', 3);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'ants-on-log'), 1, 'Wash celery', 'Wash', '🚿'),
((SELECT id FROM recipes WHERE slug = 'ants-on-log'), 2, 'Fill celery with peanut butter', 'Spread', '🥜'),
((SELECT id FROM recipes WHERE slug = 'ants-on-log'), 3, 'Put raisins on top in a row', 'Add', '🍇'),
((SELECT id FROM recipes WHERE slug = 'ants-on-log'), 4, 'Those are the ants!', 'Look', '🐜'),
((SELECT id FROM recipes WHERE slug = 'ants-on-log'), 5, 'Enjoy!', 'Eat', '😋');

-- 48. Yogurt Dip with Fruit
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_no_knives, is_healthy, is_vegetarian)
VALUES ('yogurt-fruit-dip', 'Yogurt Fruit Dip', 'Dip fruit in yogurt!', '🍓', 'snacks', 'easy', 3, 2, true, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'yogurt-fruit-dip'), 'Yogurt', '1/2 cup', '🥛', 1),
((SELECT id FROM recipes WHERE slug = 'yogurt-fruit-dip'), 'Honey', '1 teaspoon', '🍯', 2),
((SELECT id FROM recipes WHERE slug = 'yogurt-fruit-dip'), 'Strawberries', '5', '🍓', 3),
((SELECT id FROM recipes WHERE slug = 'yogurt-fruit-dip'), 'Grapes', '10', '🍇', 4);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'yogurt-fruit-dip'), 1, 'Put yogurt in bowl', 'Scoop', '🥛'),
((SELECT id FROM recipes WHERE slug = 'yogurt-fruit-dip'), 2, 'Add honey and mix', 'Mix', '🍯'),
((SELECT id FROM recipes WHERE slug = 'yogurt-fruit-dip'), 3, 'Wash fruit', 'Wash', '🚿'),
((SELECT id FROM recipes WHERE slug = 'yogurt-fruit-dip'), 4, 'Dip fruit in yogurt', 'Dip', '🍓'),
((SELECT id FROM recipes WHERE slug = 'yogurt-fruit-dip'), 5, 'Enjoy!', 'Eat', '😋');

-- 49. String Cheese
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_no_knives, is_healthy, is_vegetarian)
VALUES ('string-cheese', 'String Cheese Fun', 'Peel and eat!', '🧀', 'snacks', 'easy', 1, 1, true, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'string-cheese'), 'String Cheese', '1', '🧀', 1);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'string-cheese'), 1, 'Open the wrapper', 'Unwrap', '📦'),
((SELECT id FROM recipes WHERE slug = 'string-cheese'), 2, 'Pull strings off the cheese', 'Peel', '🧀'),
((SELECT id FROM recipes WHERE slug = 'string-cheese'), 3, 'Eat the strings!', 'Eat', '😋');

-- 50. Carrots and Ranch
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_no_knives, is_healthy, is_vegetarian)
VALUES ('carrots-ranch', 'Carrots & Ranch', 'Crunchy veggie dip!', '🥕', 'snacks', 'easy', 2, 1, true, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'carrots-ranch'), 'Baby Carrots', '10', '🥕', 1),
((SELECT id FROM recipes WHERE slug = 'carrots-ranch'), 'Ranch Dressing', '2 tablespoons', '🥛', 2);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'carrots-ranch'), 1, 'Put carrots on plate', 'Arrange', '🥕'),
((SELECT id FROM recipes WHERE slug = 'carrots-ranch'), 2, 'Put ranch in small bowl', 'Pour', '🥛'),
((SELECT id FROM recipes WHERE slug = 'carrots-ranch'), 3, 'Dip carrots in ranch', 'Dip', '🥕'),
((SELECT id FROM recipes WHERE slug = 'carrots-ranch'), 4, 'Enjoy!', 'Eat', '😋');

-- 51. Goldfish Crackers
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_no_knives, is_vegetarian)
VALUES ('goldfish', 'Goldfish Snack', 'Simple snack time!', '🐟', 'snacks', 'easy', 1, 1, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'goldfish'), 'Goldfish Crackers', '1 cup', '🐟', 1);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'goldfish'), 1, 'Pour crackers in bowl', 'Pour', '🐟'),
((SELECT id FROM recipes WHERE slug = 'goldfish'), 2, 'Enjoy your snack!', 'Eat', '😋');

-- 52. Apple Sauce Cup
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_no_knives, is_healthy, is_vegetarian)
VALUES ('applesauce', 'Applesauce Cup', 'Sweet fruit snack!', '🍎', 'snacks', 'easy', 1, 1, true, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'applesauce'), 'Applesauce cup', '1', '🍎', 1);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'applesauce'), 1, 'Peel back the lid', 'Open', '🍎'),
((SELECT id FROM recipes WHERE slug = 'applesauce'), 2, 'Get a spoon', 'Get', '🥄'),
((SELECT id FROM recipes WHERE slug = 'applesauce'), 3, 'Enjoy!', 'Eat', '😋');

-- 53. Pretzel Sticks
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_no_knives, is_vegetarian)
VALUES ('pretzels', 'Pretzel Sticks', 'Salty and crunchy!', '🥨', 'snacks', 'easy', 1, 1, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'pretzels'), 'Pretzel Sticks', '1 handful', '🥨', 1);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'pretzels'), 1, 'Pour pretzels in bowl', 'Pour', '🥨'),
((SELECT id FROM recipes WHERE slug = 'pretzels'), 2, 'Munch away!', 'Eat', '😋');

-- 54. Cucumber Slices
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_healthy, is_vegetarian)
VALUES ('cucumber-slices', 'Cucumber Slices', 'Cool and refreshing!', '🥒', 'snacks', 'easy', 3, 1, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'cucumber-slices'), 'Cucumber', '1/2', '🥒', 1),
((SELECT id FROM recipes WHERE slug = 'cucumber-slices'), 'Salt', 'pinch', '🧂', 2);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'cucumber-slices'), 1, 'Wash cucumber', 'Wash', '🚿'),
((SELECT id FROM recipes WHERE slug = 'cucumber-slices'), 2, 'Slice into circles', 'Slice', '🔪'),
((SELECT id FROM recipes WHERE slug = 'cucumber-slices'), 3, 'Sprinkle with salt', 'Season', '🧂'),
((SELECT id FROM recipes WHERE slug = 'cucumber-slices'), 4, 'Enjoy!', 'Eat', '😋');

-- 55. Graham Crackers with Frosting
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_no_knives, is_vegetarian)
VALUES ('graham-frosting', 'Graham Cracker Treat', 'Sweet snack!', '🍪', 'snacks', 'easy', 2, 1, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'graham-frosting'), 'Graham Crackers', '2 sheets', '🍪', 1),
((SELECT id FROM recipes WHERE slug = 'graham-frosting'), 'Frosting', '2 tablespoons', '🧁', 2);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'graham-frosting'), 1, 'Break graham crackers into squares', 'Break', '🍪'),
((SELECT id FROM recipes WHERE slug = 'graham-frosting'), 2, 'Spread frosting on top', 'Spread', '🧁'),
((SELECT id FROM recipes WHERE slug = 'graham-frosting'), 3, 'Enjoy!', 'Eat', '😋');

-- =====================================================
-- SIDES (56-70)
-- =====================================================

-- 56. Mashed Potatoes (Instant)
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_microwave, is_vegetarian)
VALUES ('instant-mashed-potatoes', 'Mashed Potatoes', 'Creamy and quick!', '🥔', 'sides', 'easy', 2, 3, 2, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'instant-mashed-potatoes'), 'Instant Potato Flakes', '1 cup', '🥔', 1),
((SELECT id FROM recipes WHERE slug = 'instant-mashed-potatoes'), 'Water', '1 cup', '💧', 2),
((SELECT id FROM recipes WHERE slug = 'instant-mashed-potatoes'), 'Butter', '2 tablespoons', '🧈', 3),
((SELECT id FROM recipes WHERE slug = 'instant-mashed-potatoes'), 'Milk', '1/4 cup', '🥛', 4);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'instant-mashed-potatoes'), 1, 'Heat water in microwave 2 min', 'Heat', '💧'),
((SELECT id FROM recipes WHERE slug = 'instant-mashed-potatoes'), 2, 'Add butter to hot water', 'Add', '🧈'),
((SELECT id FROM recipes WHERE slug = 'instant-mashed-potatoes'), 3, 'Add milk', 'Pour', '🥛'),
((SELECT id FROM recipes WHERE slug = 'instant-mashed-potatoes'), 4, 'Add potato flakes', 'Add', '🥔'),
((SELECT id FROM recipes WHERE slug = 'instant-mashed-potatoes'), 5, 'Stir until fluffy', 'Stir', '🥄'),
((SELECT id FROM recipes WHERE slug = 'instant-mashed-potatoes'), 6, 'Enjoy!', 'Eat', '😋');

-- 57. Green Beans
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_microwave, is_healthy, is_vegetarian)
VALUES ('green-beans', 'Green Beans', 'Healthy veggie side!', '🥬', 'sides', 'easy', 2, 3, 2, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'green-beans'), 'Canned Green Beans', '1 can', '🥬', 1),
((SELECT id FROM recipes WHERE slug = 'green-beans'), 'Butter', '1 teaspoon', '🧈', 2),
((SELECT id FROM recipes WHERE slug = 'green-beans'), 'Salt', 'pinch', '🧂', 3);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'green-beans'), 1, 'Open can and drain water', 'Drain', '🥫'),
((SELECT id FROM recipes WHERE slug = 'green-beans'), 2, 'Put beans in microwave bowl', 'Add', '🥬'),
((SELECT id FROM recipes WHERE slug = 'green-beans'), 3, 'Microwave 2-3 minutes', 'Heat', '📻'),
((SELECT id FROM recipes WHERE slug = 'green-beans'), 4, 'Add butter and salt', 'Season', '🧈'),
((SELECT id FROM recipes WHERE slug = 'green-beans'), 5, 'Stir and enjoy!', 'Eat', '😋');

-- 58. Corn
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_microwave, is_healthy, is_vegetarian)
VALUES ('corn', 'Buttered Corn', 'Sweet and buttery!', '🌽', 'sides', 'easy', 2, 3, 2, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'corn'), 'Canned Corn', '1 can', '🌽', 1),
((SELECT id FROM recipes WHERE slug = 'corn'), 'Butter', '1 tablespoon', '🧈', 2),
((SELECT id FROM recipes WHERE slug = 'corn'), 'Salt', 'pinch', '🧂', 3);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'corn'), 1, 'Open can and drain', 'Drain', '🥫'),
((SELECT id FROM recipes WHERE slug = 'corn'), 2, 'Put corn in microwave bowl', 'Add', '🌽'),
((SELECT id FROM recipes WHERE slug = 'corn'), 3, 'Microwave 2 minutes', 'Heat', '📻'),
((SELECT id FROM recipes WHERE slug = 'corn'), 4, 'Add butter and salt', 'Season', '🧈'),
((SELECT id FROM recipes WHERE slug = 'corn'), 5, 'Mix and enjoy!', 'Eat', '😋');

-- 59. Garden Salad
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_healthy, is_vegetarian)
VALUES ('garden-salad', 'Garden Salad', 'Fresh and crunchy!', '🥗', 'sides', 'easy', 5, 2, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'garden-salad'), 'Lettuce', '2 cups', '🥬', 1),
((SELECT id FROM recipes WHERE slug = 'garden-salad'), 'Tomato', '1 small', '🍅', 2),
((SELECT id FROM recipes WHERE slug = 'garden-salad'), 'Cucumber', '1/4', '🥒', 3),
((SELECT id FROM recipes WHERE slug = 'garden-salad'), 'Dressing', '2 tablespoons', '🥛', 4);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'garden-salad'), 1, 'Wash all vegetables', 'Wash', '🚿'),
((SELECT id FROM recipes WHERE slug = 'garden-salad'), 2, 'Tear lettuce into pieces', 'Tear', '🥬'),
((SELECT id FROM recipes WHERE slug = 'garden-salad'), 3, 'Cut tomato and cucumber', 'Chop', '🔪'),
((SELECT id FROM recipes WHERE slug = 'garden-salad'), 4, 'Put everything in bowl', 'Combine', '🥗'),
((SELECT id FROM recipes WHERE slug = 'garden-salad'), 5, 'Add dressing', 'Drizzle', '🥄'),
((SELECT id FROM recipes WHERE slug = 'garden-salad'), 6, 'Toss and enjoy!', 'Eat', '😋');

-- 60. Applesauce
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_no_knives, is_healthy, is_vegetarian)
VALUES ('applesauce-side', 'Applesauce Side', 'Sweet fruit side!', '🍎', 'sides', 'easy', 1, 1, true, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'applesauce-side'), 'Applesauce', '1/2 cup', '🍎', 1);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'applesauce-side'), 1, 'Scoop applesauce in bowl', 'Scoop', '🍎'),
((SELECT id FROM recipes WHERE slug = 'applesauce-side'), 2, 'Enjoy with your meal!', 'Eat', '😋');

-- 61. Rice
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_microwave, is_healthy, is_vegetarian)
VALUES ('microwave-rice', 'Minute Rice', 'Quick and easy!', '🍚', 'sides', 'easy', 2, 5, 2, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'microwave-rice'), 'Instant Rice', '1 cup', '🍚', 1),
((SELECT id FROM recipes WHERE slug = 'microwave-rice'), 'Water', '1 cup', '💧', 2),
((SELECT id FROM recipes WHERE slug = 'microwave-rice'), 'Salt', 'pinch', '🧂', 3);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'microwave-rice'), 1, 'Put rice in microwave bowl', 'Add', '🍚'),
((SELECT id FROM recipes WHERE slug = 'microwave-rice'), 2, 'Add water and salt', 'Pour', '💧'),
((SELECT id FROM recipes WHERE slug = 'microwave-rice'), 3, 'Cover loosely', 'Cover', '🍽️'),
((SELECT id FROM recipes WHERE slug = 'microwave-rice'), 4, 'Microwave 5 minutes', 'Microwave', '📻'),
((SELECT id FROM recipes WHERE slug = 'microwave-rice'), 5, 'Let sit 2 minutes', 'Wait', '⏰'),
((SELECT id FROM recipes WHERE slug = 'microwave-rice'), 6, 'Fluff with fork and enjoy!', 'Eat', '😋');

-- 62. Coleslaw
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_healthy, is_vegetarian)
VALUES ('coleslaw', 'Coleslaw', 'Crunchy cabbage salad!', '🥬', 'sides', 'easy', 5, 4, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'coleslaw'), 'Coleslaw Mix (bag)', '1 bag', '🥬', 1),
((SELECT id FROM recipes WHERE slug = 'coleslaw'), 'Mayo', '1/4 cup', '🥛', 2),
((SELECT id FROM recipes WHERE slug = 'coleslaw'), 'Sugar', '1 tablespoon', '🍬', 3),
((SELECT id FROM recipes WHERE slug = 'coleslaw'), 'Vinegar', '1 tablespoon', '🫙', 4);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'coleslaw'), 1, 'Put coleslaw mix in big bowl', 'Add', '🥬'),
((SELECT id FROM recipes WHERE slug = 'coleslaw'), 2, 'Mix mayo, sugar, vinegar in small bowl', 'Mix', '🥄'),
((SELECT id FROM recipes WHERE slug = 'coleslaw'), 3, 'Pour dressing on slaw', 'Pour', '🥛'),
((SELECT id FROM recipes WHERE slug = 'coleslaw'), 4, 'Toss to coat', 'Toss', '🥗'),
((SELECT id FROM recipes WHERE slug = 'coleslaw'), 5, 'Enjoy!', 'Eat', '😋');

-- 63. Baked Beans
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_microwave)
VALUES ('baked-beans', 'Baked Beans', 'Sweet and savory!', '🫘', 'sides', 'easy', 2, 3, 3, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'baked-beans'), 'Canned Baked Beans', '1 can', '🫘', 1);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'baked-beans'), 1, 'Open can', 'Open', '🥫'),
((SELECT id FROM recipes WHERE slug = 'baked-beans'), 2, 'Pour beans in microwave bowl', 'Pour', '🫘'),
((SELECT id FROM recipes WHERE slug = 'baked-beans'), 3, 'Microwave 2-3 minutes', 'Heat', '📻'),
((SELECT id FROM recipes WHERE slug = 'baked-beans'), 4, 'Stir and enjoy!', 'Eat', '😋');

-- 64. French Fries (Frozen)
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, requires_adult_help)
VALUES ('french-fries', 'French Fries', 'Crispy and golden!', '🍟', 'sides', 'easy', 2, 20, 2, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'french-fries'), 'Frozen French Fries', '2 cups', '🍟', 1),
((SELECT id FROM recipes WHERE slug = 'french-fries'), 'Ketchup', 'for dipping', '🍅', 2);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji, requires_adult) VALUES
((SELECT id FROM recipes WHERE slug = 'french-fries'), 1, 'Preheat oven to 425°F', 'Preheat', '🔥', true),
((SELECT id FROM recipes WHERE slug = 'french-fries'), 2, 'Spread fries on baking sheet', 'Arrange', '🍟', false),
((SELECT id FROM recipes WHERE slug = 'french-fries'), 3, 'Bake 18-22 minutes', 'Bake', '🔥', true),
((SELECT id FROM recipes WHERE slug = 'french-fries'), 4, 'Let cool 2 minutes', 'Cool', '❄️', false),
((SELECT id FROM recipes WHERE slug = 'french-fries'), 5, 'Serve with ketchup!', 'Eat', '😋', false);

-- 65-70: More quick sides
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_no_knives, is_healthy, is_vegetarian) VALUES
('fruit-cup', 'Fruit Cup', 'Pre-made fruit!', '🍑', 'sides', 'easy', 1, 1, true, true, true, true),
('cottage-cheese', 'Cottage Cheese', 'Protein-rich side!', '🥛', 'sides', 'easy', 1, 1, true, true, true, true),
('peas', 'Peas', 'Little green veggies!', '🟢', 'sides', 'easy', 3, 2, false, true, true, true),
('dinner-roll', 'Dinner Roll', 'Warm bread!', '🥖', 'sides', 'easy', 1, 1, true, true, false, true),
('sliced-tomatoes', 'Sliced Tomatoes', 'Fresh and juicy!', '🍅', 'sides', 'easy', 3, 1, true, false, true, true),
('mixed-vegetables', 'Mixed Vegetables', 'Colorful veggies!', '🥦', 'sides', 'easy', 3, 2, false, true, true, true);

-- Quick insert for simple sides steps
INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) 
SELECT id, 'Fruit Cup', '1', '🍑', 1 FROM recipes WHERE slug = 'fruit-cup';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) 
SELECT id, 1, 'Open fruit cup', 'Open', '🍑' FROM recipes WHERE slug = 'fruit-cup';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) 
SELECT id, 2, 'Enjoy!', 'Eat', '😋' FROM recipes WHERE slug = 'fruit-cup';

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) 
SELECT id, 'Cottage Cheese', '1/2 cup', '🥛', 1 FROM recipes WHERE slug = 'cottage-cheese';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) 
SELECT id, 1, 'Scoop into bowl', 'Scoop', '🥛' FROM recipes WHERE slug = 'cottage-cheese';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) 
SELECT id, 2, 'Enjoy!', 'Eat', '😋' FROM recipes WHERE slug = 'cottage-cheese';

-- =====================================================
-- DESSERTS (71-85)
-- =====================================================

INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_no_knives, is_vegetarian) VALUES
('chocolate-pudding', 'Chocolate Pudding', 'Creamy chocolate!', '🍫', 'desserts', 'easy', 2, 1, true, true, true),
('vanilla-pudding', 'Vanilla Pudding', 'Smooth and sweet!', '🍮', 'desserts', 'easy', 2, 1, true, true, true),
('jello', 'Jello Cup', 'Jiggly treat!', '🟢', 'desserts', 'easy', 1, 1, true, true, true),
('ice-cream-bowl', 'Ice Cream Bowl', 'Cold and creamy!', '🍨', 'desserts', 'easy', 2, 1, true, true, true),
('brownie', 'Brownie', 'Fudgy chocolate!', '🍫', 'desserts', 'easy', 1, 1, true, true, true),
('cookie', 'Cookie', 'Sweet treat!', '🍪', 'desserts', 'easy', 1, 1, true, true, true),
('banana-split', 'Banana Split', 'Classic sundae!', '🍌', 'desserts', 'easy', 5, 1, true, false, true),
('smores', 'Indoor S''mores', 'Gooey treat!', '🔥', 'desserts', 'easy', 3, 2, false, true, true),
('fruit-popsicle', 'Fruit Popsicle', 'Frozen fruit!', '🍧', 'desserts', 'easy', 1, 1, true, true, true),
('rice-krispie-treat', 'Rice Krispie Treat', 'Crispy and sweet!', '🍚', 'desserts', 'easy', 1, 1, true, true, true),
('whipped-cream-fruit', 'Fruit with Whipped Cream', 'Light dessert!', '🍓', 'desserts', 'easy', 3, 1, true, true, true),
('chocolate-milk', 'Chocolate Milk', 'Sweet drink treat!', '🥛', 'desserts', 'easy', 2, 1, true, true, true),
('frozen-banana', 'Frozen Banana', 'Healthy frozen treat!', '🍌', 'desserts', 'easy', 5, 1, true, false, true),
('applesauce-dessert', 'Cinnamon Applesauce', 'Warm apple treat!', '🍎', 'desserts', 'easy', 2, 1, false, true, true),
('graham-smores', 'Graham S''mores Dip', 'Dip and enjoy!', '🍫', 'desserts', 'easy', 3, 2, false, true, true);

-- Sample dessert steps for chocolate pudding
INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order)
SELECT id, 'Pudding Cup', '1', '🍫', 1 FROM recipes WHERE slug = 'chocolate-pudding';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji)
SELECT id, 1, 'Peel back lid', 'Open', '🍫' FROM recipes WHERE slug = 'chocolate-pudding';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji)
SELECT id, 2, 'Get a spoon', 'Get', '🥄' FROM recipes WHERE slug = 'chocolate-pudding';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji)
SELECT id, 3, 'Enjoy!', 'Eat', '😋' FROM recipes WHERE slug = 'chocolate-pudding';

-- Ice cream bowl
INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order)
SELECT id, 'Ice Cream', '2 scoops', '🍨', 1 FROM recipes WHERE slug = 'ice-cream-bowl';
INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order)
SELECT id, 'Chocolate Syrup', 'to taste', '🍫', 2 FROM recipes WHERE slug = 'ice-cream-bowl';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji)
SELECT id, 1, 'Scoop ice cream into bowl', 'Scoop', '🍨' FROM recipes WHERE slug = 'ice-cream-bowl';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji)
SELECT id, 2, 'Add chocolate syrup', 'Drizzle', '🍫' FROM recipes WHERE slug = 'ice-cream-bowl';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji)
SELECT id, 3, 'Enjoy before it melts!', 'Eat', '😋' FROM recipes WHERE slug = 'ice-cream-bowl';

-- =====================================================
-- DRINKS (86-100)
-- =====================================================

INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_no_knives, is_healthy, is_vegetarian) VALUES
('strawberry-smoothie', 'Strawberry Smoothie', 'Fruity and cold!', '🍓', 'drinks', 'easy', 5, 1, true, true, true, true),
('banana-smoothie', 'Banana Smoothie', 'Creamy and sweet!', '🍌', 'drinks', 'easy', 5, 1, true, true, true, true),
('chocolate-shake', 'Chocolate Milkshake', 'Thick and chocolatey!', '🍫', 'drinks', 'easy', 5, 1, true, true, false, true),
('orange-juice', 'Orange Juice', 'Fresh and tangy!', '🍊', 'drinks', 'easy', 1, 1, true, true, true, true),
('apple-juice', 'Apple Juice', 'Sweet apple drink!', '🍎', 'drinks', 'easy', 1, 1, true, true, true, true),
('lemonade', 'Lemonade', 'Sweet and sour!', '🍋', 'drinks', 'easy', 5, 1, true, true, true, true),
('hot-chocolate', 'Hot Chocolate', 'Warm and cozy!', '☕', 'drinks', 'easy', 3, 1, true, true, false, true),
('berry-smoothie', 'Berry Smoothie', 'Mixed berry blast!', '🫐', 'drinks', 'easy', 5, 1, true, true, true, true),
('vanilla-shake', 'Vanilla Milkshake', 'Classic shake!', '🍦', 'drinks', 'easy', 5, 1, true, true, false, true),
('fruit-punch', 'Fruit Punch', 'Party drink!', '🧃', 'drinks', 'easy', 2, 4, true, true, true, true),
('iced-tea', 'Iced Tea', 'Cool refreshment!', '🧊', 'drinks', 'easy', 2, 1, true, true, true, true),
('milk', 'Glass of Milk', 'Simple and healthy!', '🥛', 'drinks', 'easy', 1, 1, true, true, true, true),
('water-lemon', 'Lemon Water', 'Refreshing water!', '💧', 'drinks', 'easy', 2, 1, true, true, true, true),
('mango-smoothie', 'Mango Smoothie', 'Tropical treat!', '🥭', 'drinks', 'easy', 5, 1, true, true, true, true),
('green-smoothie', 'Green Smoothie', 'Healthy green drink!', '🥬', 'drinks', 'easy', 5, 1, true, true, true, true);

-- Strawberry smoothie details
INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order)
SELECT id, 'Frozen Strawberries', '1 cup', '🍓', 1 FROM recipes WHERE slug = 'strawberry-smoothie';
INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order)
SELECT id, 'Banana', '1/2', '🍌', 2 FROM recipes WHERE slug = 'strawberry-smoothie';
INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order)
SELECT id, 'Milk', '1 cup', '🥛', 3 FROM recipes WHERE slug = 'strawberry-smoothie';
INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order)
SELECT id, 'Honey', '1 tablespoon', '🍯', 4 FROM recipes WHERE slug = 'strawberry-smoothie';

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji)
SELECT id, 1, 'Add strawberries to blender', 'Add', '🍓' FROM recipes WHERE slug = 'strawberry-smoothie';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji)
SELECT id, 2, 'Add banana', 'Add', '🍌' FROM recipes WHERE slug = 'strawberry-smoothie';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji)
SELECT id, 3, 'Pour in milk', 'Pour', '🥛' FROM recipes WHERE slug = 'strawberry-smoothie';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji)
SELECT id, 4, 'Add honey', 'Drizzle', '🍯' FROM recipes WHERE slug = 'strawberry-smoothie';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji)
SELECT id, 5, 'Put lid on blender', 'Close', '🔒' FROM recipes WHERE slug = 'strawberry-smoothie';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji)
SELECT id, 6, 'Blend until smooth', 'Blend', '🌀' FROM recipes WHERE slug = 'strawberry-smoothie';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji)
SELECT id, 7, 'Pour in glass and enjoy!', 'Drink', '😋' FROM recipes WHERE slug = 'strawberry-smoothie';

-- Hot chocolate
INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order)
SELECT id, 'Hot Cocoa Mix', '1 packet', '🍫', 1 FROM recipes WHERE slug = 'hot-chocolate';
INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order)
SELECT id, 'Milk or Water', '1 cup', '🥛', 2 FROM recipes WHERE slug = 'hot-chocolate';
INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order)
SELECT id, 'Marshmallows', 'a few', '☁️', 3 FROM recipes WHERE slug = 'hot-chocolate';

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji)
SELECT id, 1, 'Heat milk/water in microwave 1-2 min', 'Heat', '📻' FROM recipes WHERE slug = 'hot-chocolate';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji)
SELECT id, 2, 'Careful! Mug is hot!', 'Careful', '🔥' FROM recipes WHERE slug = 'hot-chocolate';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji)
SELECT id, 3, 'Add cocoa mix', 'Add', '🍫' FROM recipes WHERE slug = 'hot-chocolate';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji)
SELECT id, 4, 'Stir well', 'Stir', '🥄' FROM recipes WHERE slug = 'hot-chocolate';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji)
SELECT id, 5, 'Add marshmallows', 'Top', '☁️' FROM recipes WHERE slug = 'hot-chocolate';
INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji)
SELECT id, 6, 'Let cool and enjoy!', 'Drink', '😋' FROM recipes WHERE slug = 'hot-chocolate';
