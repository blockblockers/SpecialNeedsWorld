-- =====================================================
-- RECIPES SEED DATA - PART 2
-- MAIN DISHES (21-40)
-- =====================================================

-- 21. Cheese Quesadilla
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_vegetarian, requires_adult_help)
VALUES ('cheese-quesadilla', 'Cheese Quesadilla', 'Melty cheese in a crispy tortilla!', '🧀', 'main-dishes', 'easy', 2, 5, 1, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'cheese-quesadilla'), 'Tortilla', '1 large', '🫓', 1),
((SELECT id FROM recipes WHERE slug = 'cheese-quesadilla'), 'Shredded Cheese', '1/2 cup', '🧀', 2),
((SELECT id FROM recipes WHERE slug = 'cheese-quesadilla'), 'Butter', '1 teaspoon', '🧈', 3);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji, requires_adult) VALUES
((SELECT id FROM recipes WHERE slug = 'cheese-quesadilla'), 1, 'Heat pan on medium', 'Heat', '🍳', true),
((SELECT id FROM recipes WHERE slug = 'cheese-quesadilla'), 2, 'Add butter to pan', 'Add', '🧈', true),
((SELECT id FROM recipes WHERE slug = 'cheese-quesadilla'), 3, 'Put tortilla in pan', 'Add', '🫓', true),
((SELECT id FROM recipes WHERE slug = 'cheese-quesadilla'), 4, 'Sprinkle cheese on half', 'Sprinkle', '🧀', false),
((SELECT id FROM recipes WHERE slug = 'cheese-quesadilla'), 5, 'Fold tortilla in half', 'Fold', '🌮', false),
((SELECT id FROM recipes WHERE slug = 'cheese-quesadilla'), 6, 'Cook until golden', 'Cook', '🔥', true),
((SELECT id FROM recipes WHERE slug = 'cheese-quesadilla'), 7, 'Flip and cook other side', 'Flip', '🔄', true),
((SELECT id FROM recipes WHERE slug = 'cheese-quesadilla'), 8, 'Cut into triangles', 'Cut', '🔪', false),
((SELECT id FROM recipes WHERE slug = 'cheese-quesadilla'), 9, 'Let cool and enjoy!', 'Eat', '😋', false);

-- 22. Grilled Cheese
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_vegetarian, requires_adult_help)
VALUES ('grilled-cheese', 'Grilled Cheese Sandwich', 'Classic melty sandwich!', '🧀', 'main-dishes', 'easy', 2, 5, 1, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'grilled-cheese'), 'Bread', '2 slices', '🍞', 1),
((SELECT id FROM recipes WHERE slug = 'grilled-cheese'), 'Cheese', '2 slices', '🧀', 2),
((SELECT id FROM recipes WHERE slug = 'grilled-cheese'), 'Butter', '2 tablespoons', '🧈', 3);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji, requires_adult) VALUES
((SELECT id FROM recipes WHERE slug = 'grilled-cheese'), 1, 'Butter one side of each bread slice', 'Spread', '🧈', false),
((SELECT id FROM recipes WHERE slug = 'grilled-cheese'), 2, 'Heat pan on medium-low', 'Heat', '🍳', true),
((SELECT id FROM recipes WHERE slug = 'grilled-cheese'), 3, 'Put one slice butter-side down', 'Place', '🍞', true),
((SELECT id FROM recipes WHERE slug = 'grilled-cheese'), 4, 'Add cheese on top', 'Add', '🧀', false),
((SELECT id FROM recipes WHERE slug = 'grilled-cheese'), 5, 'Put other slice on top, butter up', 'Top', '🍞', false),
((SELECT id FROM recipes WHERE slug = 'grilled-cheese'), 6, 'Cook until golden', 'Cook', '🔥', true),
((SELECT id FROM recipes WHERE slug = 'grilled-cheese'), 7, 'Flip carefully', 'Flip', '🔄', true),
((SELECT id FROM recipes WHERE slug = 'grilled-cheese'), 8, 'Cook until other side is golden', 'Cook', '🔥', true),
((SELECT id FROM recipes WHERE slug = 'grilled-cheese'), 9, 'Cut in half and enjoy!', 'Eat', '😋', false);

-- 23. PB&J Sandwich
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_vegetarian)
VALUES ('pbj-sandwich', 'Peanut Butter & Jelly', 'The classic sandwich!', '🥪', 'main-dishes', 'easy', 3, 1, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'pbj-sandwich'), 'Bread', '2 slices', '🍞', 1),
((SELECT id FROM recipes WHERE slug = 'pbj-sandwich'), 'Peanut Butter', '2 tablespoons', '🥜', 2),
((SELECT id FROM recipes WHERE slug = 'pbj-sandwich'), 'Jelly', '2 tablespoons', '🍇', 3);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'pbj-sandwich'), 1, 'Put bread slices on plate', 'Place', '🍞'),
((SELECT id FROM recipes WHERE slug = 'pbj-sandwich'), 2, 'Spread peanut butter on one slice', 'Spread', '🥜'),
((SELECT id FROM recipes WHERE slug = 'pbj-sandwich'), 3, 'Spread jelly on other slice', 'Spread', '🍇'),
((SELECT id FROM recipes WHERE slug = 'pbj-sandwich'), 4, 'Put slices together', 'Press', '🥪'),
((SELECT id FROM recipes WHERE slug = 'pbj-sandwich'), 5, 'Cut in half if you want', 'Cut', '🔪'),
((SELECT id FROM recipes WHERE slug = 'pbj-sandwich'), 6, 'Enjoy!', 'Eat', '😋');

-- 24. Pasta with Butter
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_vegetarian, requires_adult_help)
VALUES ('butter-pasta', 'Butter Pasta', 'Simple and delicious!', '🍝', 'main-dishes', 'easy', 2, 12, 2, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'butter-pasta'), 'Pasta', '2 cups dry', '🍝', 1),
((SELECT id FROM recipes WHERE slug = 'butter-pasta'), 'Water', 'pot full', '💧', 2),
((SELECT id FROM recipes WHERE slug = 'butter-pasta'), 'Butter', '2 tablespoons', '🧈', 3),
((SELECT id FROM recipes WHERE slug = 'butter-pasta'), 'Parmesan', '2 tablespoons', '🧀', 4),
((SELECT id FROM recipes WHERE slug = 'butter-pasta'), 'Salt', 'to taste', '🧂', 5);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji, requires_adult) VALUES
((SELECT id FROM recipes WHERE slug = 'butter-pasta'), 1, 'Fill pot with water', 'Fill', '💧', false),
((SELECT id FROM recipes WHERE slug = 'butter-pasta'), 2, 'Put pot on stove, high heat', 'Heat', '🔥', true),
((SELECT id FROM recipes WHERE slug = 'butter-pasta'), 3, 'Wait for water to boil (bubbles)', 'Wait', '💨', false),
((SELECT id FROM recipes WHERE slug = 'butter-pasta'), 4, 'Add pasta to water', 'Add', '🍝', true),
((SELECT id FROM recipes WHERE slug = 'butter-pasta'), 5, 'Cook 8-10 minutes, stir sometimes', 'Cook', '🥄', true),
((SELECT id FROM recipes WHERE slug = 'butter-pasta'), 6, 'Ask adult to drain water', 'Drain', '🚿', true),
((SELECT id FROM recipes WHERE slug = 'butter-pasta'), 7, 'Add butter and stir', 'Mix', '🧈', false),
((SELECT id FROM recipes WHERE slug = 'butter-pasta'), 8, 'Add parmesan and salt', 'Sprinkle', '🧀', false),
((SELECT id FROM recipes WHERE slug = 'butter-pasta'), 9, 'Enjoy!', 'Eat', '😋', false);

-- 25. Mac and Cheese Cup
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_microwave, is_vegetarian)
VALUES ('mac-cheese-cup', 'Mac & Cheese Cup', 'Quick microwave mac!', '🧀', 'main-dishes', 'easy', 1, 4, 1, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'mac-cheese-cup'), 'Mac & Cheese Cup', '1', '🧀', 1),
((SELECT id FROM recipes WHERE slug = 'mac-cheese-cup'), 'Water', 'to fill line', '💧', 2);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'mac-cheese-cup'), 1, 'Open cup and remove cheese packet', 'Open', '📦'),
((SELECT id FROM recipes WHERE slug = 'mac-cheese-cup'), 2, 'Add water to fill line', 'Fill', '💧'),
((SELECT id FROM recipes WHERE slug = 'mac-cheese-cup'), 3, 'Microwave 3-4 minutes', 'Microwave', '📻'),
((SELECT id FROM recipes WHERE slug = 'mac-cheese-cup'), 4, 'Careful! Very hot!', 'Careful', '🔥'),
((SELECT id FROM recipes WHERE slug = 'mac-cheese-cup'), 5, 'Add cheese powder', 'Add', '🧀'),
((SELECT id FROM recipes WHERE slug = 'mac-cheese-cup'), 6, 'Stir well', 'Stir', '🥄'),
((SELECT id FROM recipes WHERE slug = 'mac-cheese-cup'), 7, 'Let cool and enjoy!', 'Eat', '😋');

-- 26. Hot Dog
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_microwave)
VALUES ('hot-dog', 'Hot Dog', 'Classic and quick!', '🌭', 'main-dishes', 'easy', 1, 2, 1, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'hot-dog'), 'Hot Dog', '1', '🌭', 1),
((SELECT id FROM recipes WHERE slug = 'hot-dog'), 'Bun', '1', '🥖', 2),
((SELECT id FROM recipes WHERE slug = 'hot-dog'), 'Ketchup', 'to taste', '🍅', 3),
((SELECT id FROM recipes WHERE slug = 'hot-dog'), 'Mustard', 'to taste', '🟡', 4);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'hot-dog'), 1, 'Put hot dog on microwave-safe plate', 'Place', '🌭'),
((SELECT id FROM recipes WHERE slug = 'hot-dog'), 2, 'Microwave 30-45 seconds', 'Microwave', '📻'),
((SELECT id FROM recipes WHERE slug = 'hot-dog'), 3, 'Put hot dog in bun', 'Add', '🥖'),
((SELECT id FROM recipes WHERE slug = 'hot-dog'), 4, 'Add ketchup and mustard', 'Squirt', '🍅'),
((SELECT id FROM recipes WHERE slug = 'hot-dog'), 5, 'Enjoy!', 'Eat', '😋');

-- 27. Turkey Sandwich
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake)
VALUES ('turkey-sandwich', 'Turkey Sandwich', 'Healthy lunch option!', '🥪', 'main-dishes', 'easy', 5, 1, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'turkey-sandwich'), 'Bread', '2 slices', '🍞', 1),
((SELECT id FROM recipes WHERE slug = 'turkey-sandwich'), 'Turkey slices', '3-4', '🦃', 2),
((SELECT id FROM recipes WHERE slug = 'turkey-sandwich'), 'Cheese', '1 slice', '🧀', 3),
((SELECT id FROM recipes WHERE slug = 'turkey-sandwich'), 'Lettuce', '1 leaf', '🥬', 4),
((SELECT id FROM recipes WHERE slug = 'turkey-sandwich'), 'Mayo', '1 tablespoon', '🥛', 5);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'turkey-sandwich'), 1, 'Lay out bread slices', 'Place', '🍞'),
((SELECT id FROM recipes WHERE slug = 'turkey-sandwich'), 2, 'Spread mayo on bread', 'Spread', '🥄'),
((SELECT id FROM recipes WHERE slug = 'turkey-sandwich'), 3, 'Add turkey slices', 'Layer', '🦃'),
((SELECT id FROM recipes WHERE slug = 'turkey-sandwich'), 4, 'Add cheese', 'Add', '🧀'),
((SELECT id FROM recipes WHERE slug = 'turkey-sandwich'), 5, 'Add lettuce', 'Add', '🥬'),
((SELECT id FROM recipes WHERE slug = 'turkey-sandwich'), 6, 'Put top bread on', 'Close', '🍞'),
((SELECT id FROM recipes WHERE slug = 'turkey-sandwich'), 7, 'Cut in half and enjoy!', 'Eat', '😋');

-- 28. Ramen Noodles
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_microwave)
VALUES ('ramen-noodles', 'Ramen Noodles', 'Quick and tasty!', '🍜', 'main-dishes', 'easy', 1, 4, 1, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'ramen-noodles'), 'Ramen packet', '1', '🍜', 1),
((SELECT id FROM recipes WHERE slug = 'ramen-noodles'), 'Water', '2 cups', '💧', 2);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'ramen-noodles'), 1, 'Put noodles in microwave-safe bowl', 'Add', '🍜'),
((SELECT id FROM recipes WHERE slug = 'ramen-noodles'), 2, 'Add water to cover noodles', 'Pour', '💧'),
((SELECT id FROM recipes WHERE slug = 'ramen-noodles'), 3, 'Microwave 3-4 minutes', 'Microwave', '📻'),
((SELECT id FROM recipes WHERE slug = 'ramen-noodles'), 4, 'Careful! Very hot!', 'Careful', '🔥'),
((SELECT id FROM recipes WHERE slug = 'ramen-noodles'), 5, 'Add seasoning packet', 'Add', '🧂'),
((SELECT id FROM recipes WHERE slug = 'ramen-noodles'), 6, 'Stir well', 'Stir', '🥄'),
((SELECT id FROM recipes WHERE slug = 'ramen-noodles'), 7, 'Let cool and enjoy!', 'Eat', '😋');

-- 29. Pizza Bagel
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_vegetarian, requires_adult_help)
VALUES ('pizza-bagel', 'Pizza Bagel', 'Mini pizza on a bagel!', '🍕', 'main-dishes', 'easy', 3, 5, 1, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'pizza-bagel'), 'Bagel', '1', '🥯', 1),
((SELECT id FROM recipes WHERE slug = 'pizza-bagel'), 'Pizza sauce', '2 tablespoons', '🍅', 2),
((SELECT id FROM recipes WHERE slug = 'pizza-bagel'), 'Mozzarella', '1/4 cup shredded', '🧀', 3),
((SELECT id FROM recipes WHERE slug = 'pizza-bagel'), 'Pepperoni', '6 slices (optional)', '🔴', 4);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji, requires_adult) VALUES
((SELECT id FROM recipes WHERE slug = 'pizza-bagel'), 1, 'Cut bagel in half', 'Cut', '🔪', false),
((SELECT id FROM recipes WHERE slug = 'pizza-bagel'), 2, 'Put bagel halves on baking sheet', 'Place', '🥯', false),
((SELECT id FROM recipes WHERE slug = 'pizza-bagel'), 3, 'Spread sauce on each half', 'Spread', '🍅', false),
((SELECT id FROM recipes WHERE slug = 'pizza-bagel'), 4, 'Add cheese', 'Sprinkle', '🧀', false),
((SELECT id FROM recipes WHERE slug = 'pizza-bagel'), 5, 'Add pepperoni if you want', 'Add', '🔴', false),
((SELECT id FROM recipes WHERE slug = 'pizza-bagel'), 6, 'Bake at 400°F for 5 minutes', 'Bake', '🔥', true),
((SELECT id FROM recipes WHERE slug = 'pizza-bagel'), 7, 'Let cool before eating!', 'Cool', '❄️', false),
((SELECT id FROM recipes WHERE slug = 'pizza-bagel'), 8, 'Enjoy!', 'Eat', '😋', false);

-- 30. Tuna Sandwich
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_healthy)
VALUES ('tuna-sandwich', 'Tuna Sandwich', 'Protein-packed lunch!', '🐟', 'main-dishes', 'easy', 5, 1, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'tuna-sandwich'), 'Canned Tuna', '1 can, drained', '🐟', 1),
((SELECT id FROM recipes WHERE slug = 'tuna-sandwich'), 'Mayo', '2 tablespoons', '🥛', 2),
((SELECT id FROM recipes WHERE slug = 'tuna-sandwich'), 'Bread', '2 slices', '🍞', 3);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'tuna-sandwich'), 1, 'Open can and drain water', 'Drain', '🥫'),
((SELECT id FROM recipes WHERE slug = 'tuna-sandwich'), 2, 'Put tuna in bowl', 'Add', '🐟'),
((SELECT id FROM recipes WHERE slug = 'tuna-sandwich'), 3, 'Add mayo', 'Add', '🥄'),
((SELECT id FROM recipes WHERE slug = 'tuna-sandwich'), 4, 'Mix together with fork', 'Mix', '🥄'),
((SELECT id FROM recipes WHERE slug = 'tuna-sandwich'), 5, 'Spread on bread', 'Spread', '🍞'),
((SELECT id FROM recipes WHERE slug = 'tuna-sandwich'), 6, 'Add top slice of bread', 'Close', '🥪'),
((SELECT id FROM recipes WHERE slug = 'tuna-sandwich'), 7, 'Enjoy!', 'Eat', '😋');

-- 31. Chicken Nuggets
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, requires_adult_help)
VALUES ('chicken-nuggets', 'Chicken Nuggets', 'Crispy and yummy!', '🍗', 'main-dishes', 'easy', 2, 15, 1, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'chicken-nuggets'), 'Frozen Chicken Nuggets', '6-8', '🍗', 1),
((SELECT id FROM recipes WHERE slug = 'chicken-nuggets'), 'Ketchup', 'for dipping', '🍅', 2);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji, requires_adult) VALUES
((SELECT id FROM recipes WHERE slug = 'chicken-nuggets'), 1, 'Preheat oven to 400°F', 'Preheat', '🔥', true),
((SELECT id FROM recipes WHERE slug = 'chicken-nuggets'), 2, 'Put nuggets on baking sheet', 'Arrange', '🍗', false),
((SELECT id FROM recipes WHERE slug = 'chicken-nuggets'), 3, 'Bake 12-15 minutes', 'Bake', '🔥', true),
((SELECT id FROM recipes WHERE slug = 'chicken-nuggets'), 4, 'Let cool 2 minutes', 'Cool', '❄️', false),
((SELECT id FROM recipes WHERE slug = 'chicken-nuggets'), 5, 'Put ketchup in small bowl', 'Pour', '🍅', false),
((SELECT id FROM recipes WHERE slug = 'chicken-nuggets'), 6, 'Dip and enjoy!', 'Eat', '😋', false);

-- 32. Bean and Cheese Burrito
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_microwave, is_vegetarian)
VALUES ('bean-cheese-burrito', 'Bean & Cheese Burrito', 'Filling and tasty!', '🌯', 'main-dishes', 'easy', 3, 2, 1, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'bean-cheese-burrito'), 'Tortilla', '1 large', '🫓', 1),
((SELECT id FROM recipes WHERE slug = 'bean-cheese-burrito'), 'Refried Beans', '1/2 cup', '🫘', 2),
((SELECT id FROM recipes WHERE slug = 'bean-cheese-burrito'), 'Shredded Cheese', '1/4 cup', '🧀', 3);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'bean-cheese-burrito'), 1, 'Put beans on plate', 'Scoop', '🫘'),
((SELECT id FROM recipes WHERE slug = 'bean-cheese-burrito'), 2, 'Microwave beans 30 seconds', 'Heat', '📻'),
((SELECT id FROM recipes WHERE slug = 'bean-cheese-burrito'), 3, 'Warm tortilla 15 seconds', 'Warm', '🫓'),
((SELECT id FROM recipes WHERE slug = 'bean-cheese-burrito'), 4, 'Spread beans down center of tortilla', 'Spread', '🥄'),
((SELECT id FROM recipes WHERE slug = 'bean-cheese-burrito'), 5, 'Add cheese on top', 'Sprinkle', '🧀'),
((SELECT id FROM recipes WHERE slug = 'bean-cheese-burrito'), 6, 'Fold sides in, then roll up', 'Roll', '🌯'),
((SELECT id FROM recipes WHERE slug = 'bean-cheese-burrito'), 7, 'Enjoy!', 'Eat', '😋');

-- 33. Ham Sandwich
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake)
VALUES ('ham-sandwich', 'Ham Sandwich', 'Simple and satisfying!', '🥪', 'main-dishes', 'easy', 3, 1, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'ham-sandwich'), 'Bread', '2 slices', '🍞', 1),
((SELECT id FROM recipes WHERE slug = 'ham-sandwich'), 'Ham', '3 slices', '🥓', 2),
((SELECT id FROM recipes WHERE slug = 'ham-sandwich'), 'Cheese', '1 slice', '🧀', 3),
((SELECT id FROM recipes WHERE slug = 'ham-sandwich'), 'Mustard', '1 teaspoon', '🟡', 4);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'ham-sandwich'), 1, 'Lay bread on plate', 'Place', '🍞'),
((SELECT id FROM recipes WHERE slug = 'ham-sandwich'), 2, 'Spread mustard on one slice', 'Spread', '🟡'),
((SELECT id FROM recipes WHERE slug = 'ham-sandwich'), 3, 'Add ham slices', 'Layer', '🥓'),
((SELECT id FROM recipes WHERE slug = 'ham-sandwich'), 4, 'Add cheese', 'Add', '🧀'),
((SELECT id FROM recipes WHERE slug = 'ham-sandwich'), 5, 'Put other bread on top', 'Close', '🍞'),
((SELECT id FROM recipes WHERE slug = 'ham-sandwich'), 6, 'Cut and enjoy!', 'Eat', '😋');

-- 34. Spaghetti with Sauce
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, requires_adult_help)
VALUES ('spaghetti-sauce', 'Spaghetti with Sauce', 'Classic pasta dinner!', '🍝', 'main-dishes', 'medium', 5, 15, 2, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'spaghetti-sauce'), 'Spaghetti', '8 oz', '🍝', 1),
((SELECT id FROM recipes WHERE slug = 'spaghetti-sauce'), 'Water', 'pot full', '💧', 2),
((SELECT id FROM recipes WHERE slug = 'spaghetti-sauce'), 'Pasta Sauce', '1 cup', '🍅', 3),
((SELECT id FROM recipes WHERE slug = 'spaghetti-sauce'), 'Parmesan', 'for topping', '🧀', 4);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji, requires_adult) VALUES
((SELECT id FROM recipes WHERE slug = 'spaghetti-sauce'), 1, 'Fill big pot with water', 'Fill', '💧', false),
((SELECT id FROM recipes WHERE slug = 'spaghetti-sauce'), 2, 'Boil water on high heat', 'Boil', '🔥', true),
((SELECT id FROM recipes WHERE slug = 'spaghetti-sauce'), 3, 'Add spaghetti to water', 'Add', '🍝', true),
((SELECT id FROM recipes WHERE slug = 'spaghetti-sauce'), 4, 'Cook 8-10 minutes', 'Cook', '⏰', true),
((SELECT id FROM recipes WHERE slug = 'spaghetti-sauce'), 5, 'Ask adult to drain pasta', 'Drain', '🚿', true),
((SELECT id FROM recipes WHERE slug = 'spaghetti-sauce'), 6, 'Heat sauce in microwave', 'Heat', '📻', false),
((SELECT id FROM recipes WHERE slug = 'spaghetti-sauce'), 7, 'Put pasta in bowl', 'Serve', '🍽️', false),
((SELECT id FROM recipes WHERE slug = 'spaghetti-sauce'), 8, 'Add sauce on top', 'Pour', '🍅', false),
((SELECT id FROM recipes WHERE slug = 'spaghetti-sauce'), 9, 'Sprinkle cheese and enjoy!', 'Eat', '😋', false);

-- 35. Veggie Wrap
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_healthy, is_vegetarian)
VALUES ('veggie-wrap', 'Veggie Wrap', 'Fresh and crunchy!', '🌯', 'main-dishes', 'easy', 5, 1, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'veggie-wrap'), 'Tortilla', '1 large', '🫓', 1),
((SELECT id FROM recipes WHERE slug = 'veggie-wrap'), 'Hummus', '2 tablespoons', '🥜', 2),
((SELECT id FROM recipes WHERE slug = 'veggie-wrap'), 'Lettuce', '2 leaves', '🥬', 3),
((SELECT id FROM recipes WHERE slug = 'veggie-wrap'), 'Cucumber', '5 slices', '🥒', 4),
((SELECT id FROM recipes WHERE slug = 'veggie-wrap'), 'Shredded Carrot', '2 tablespoons', '🥕', 5);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'veggie-wrap'), 1, 'Lay tortilla flat', 'Place', '🫓'),
((SELECT id FROM recipes WHERE slug = 'veggie-wrap'), 2, 'Spread hummus in center', 'Spread', '🥜'),
((SELECT id FROM recipes WHERE slug = 'veggie-wrap'), 3, 'Add lettuce', 'Layer', '🥬'),
((SELECT id FROM recipes WHERE slug = 'veggie-wrap'), 4, 'Add cucumber slices', 'Add', '🥒'),
((SELECT id FROM recipes WHERE slug = 'veggie-wrap'), 5, 'Add shredded carrot', 'Sprinkle', '🥕'),
((SELECT id FROM recipes WHERE slug = 'veggie-wrap'), 6, 'Roll up tightly', 'Roll', '🌯'),
((SELECT id FROM recipes WHERE slug = 'veggie-wrap'), 7, 'Cut in half', 'Cut', '🔪'),
((SELECT id FROM recipes WHERE slug = 'veggie-wrap'), 8, 'Enjoy!', 'Eat', '😋');

-- 36. Mini Pizzas (on bread)
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_vegetarian, requires_adult_help)
VALUES ('mini-bread-pizza', 'Mini Bread Pizza', 'Pizza on bread!', '🍕', 'main-dishes', 'easy', 5, 5, 2, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'mini-bread-pizza'), 'Bread', '2 slices', '🍞', 1),
((SELECT id FROM recipes WHERE slug = 'mini-bread-pizza'), 'Pizza Sauce', '2 tablespoons', '🍅', 2),
((SELECT id FROM recipes WHERE slug = 'mini-bread-pizza'), 'Mozzarella', '1/4 cup', '🧀', 3);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji, requires_adult) VALUES
((SELECT id FROM recipes WHERE slug = 'mini-bread-pizza'), 1, 'Put bread on baking sheet', 'Place', '🍞', false),
((SELECT id FROM recipes WHERE slug = 'mini-bread-pizza'), 2, 'Spread sauce on bread', 'Spread', '🍅', false),
((SELECT id FROM recipes WHERE slug = 'mini-bread-pizza'), 3, 'Add cheese on top', 'Sprinkle', '🧀', false),
((SELECT id FROM recipes WHERE slug = 'mini-bread-pizza'), 4, 'Toast in oven 5 minutes at 400°F', 'Toast', '🔥', true),
((SELECT id FROM recipes WHERE slug = 'mini-bread-pizza'), 5, 'Let cool', 'Cool', '❄️', false),
((SELECT id FROM recipes WHERE slug = 'mini-bread-pizza'), 6, 'Enjoy!', 'Eat', '😋', false);

-- 37. Nachos
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_microwave, is_vegetarian)
VALUES ('nachos', 'Cheesy Nachos', 'Crunchy and cheesy!', '🌮', 'main-dishes', 'easy', 3, 2, 2, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'nachos'), 'Tortilla Chips', '2 cups', '🌮', 1),
((SELECT id FROM recipes WHERE slug = 'nachos'), 'Shredded Cheese', '1/2 cup', '🧀', 2),
((SELECT id FROM recipes WHERE slug = 'nachos'), 'Salsa', 'for dipping', '🍅', 3);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'nachos'), 1, 'Spread chips on microwave-safe plate', 'Arrange', '🌮'),
((SELECT id FROM recipes WHERE slug = 'nachos'), 2, 'Sprinkle cheese all over', 'Sprinkle', '🧀'),
((SELECT id FROM recipes WHERE slug = 'nachos'), 3, 'Microwave 30-45 seconds', 'Microwave', '📻'),
((SELECT id FROM recipes WHERE slug = 'nachos'), 4, 'Watch for cheese to melt', 'Watch', '👀'),
((SELECT id FROM recipes WHERE slug = 'nachos'), 5, 'Serve with salsa', 'Dip', '🍅'),
((SELECT id FROM recipes WHERE slug = 'nachos'), 6, 'Enjoy!', 'Eat', '😋');

-- 38. Egg Salad Sandwich
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, is_healthy, is_vegetarian, requires_adult_help)
VALUES ('egg-salad-sandwich', 'Egg Salad Sandwich', 'Creamy egg filling!', '🥚', 'main-dishes', 'medium', 10, 12, 2, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'egg-salad-sandwich'), 'Eggs', '2', '🥚', 1),
((SELECT id FROM recipes WHERE slug = 'egg-salad-sandwich'), 'Mayo', '2 tablespoons', '🥛', 2),
((SELECT id FROM recipes WHERE slug = 'egg-salad-sandwich'), 'Salt', 'pinch', '🧂', 3),
((SELECT id FROM recipes WHERE slug = 'egg-salad-sandwich'), 'Bread', '2 slices', '🍞', 4);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji, requires_adult) VALUES
((SELECT id FROM recipes WHERE slug = 'egg-salad-sandwich'), 1, 'Put eggs in pot, cover with water', 'Add', '🥚', false),
((SELECT id FROM recipes WHERE slug = 'egg-salad-sandwich'), 2, 'Boil for 12 minutes', 'Boil', '🔥', true),
((SELECT id FROM recipes WHERE slug = 'egg-salad-sandwich'), 3, 'Put eggs in cold water', 'Cool', '❄️', true),
((SELECT id FROM recipes WHERE slug = 'egg-salad-sandwich'), 4, 'Peel shells off eggs', 'Peel', '🥚', false),
((SELECT id FROM recipes WHERE slug = 'egg-salad-sandwich'), 5, 'Mash eggs with fork', 'Mash', '🥄', false),
((SELECT id FROM recipes WHERE slug = 'egg-salad-sandwich'), 6, 'Add mayo and salt, mix', 'Mix', '🥄', false),
((SELECT id FROM recipes WHERE slug = 'egg-salad-sandwich'), 7, 'Spread on bread', 'Spread', '🍞', false),
((SELECT id FROM recipes WHERE slug = 'egg-salad-sandwich'), 8, 'Add top bread and enjoy!', 'Eat', '😋', false);

-- 39. Fish Sticks
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, cook_time_minutes, servings, requires_adult_help)
VALUES ('fish-sticks', 'Fish Sticks', 'Crispy fish fingers!', '🐟', 'main-dishes', 'easy', 2, 15, 1, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'fish-sticks'), 'Frozen Fish Sticks', '4-6', '🐟', 1),
((SELECT id FROM recipes WHERE slug = 'fish-sticks'), 'Tartar Sauce', 'for dipping', '🥛', 2),
((SELECT id FROM recipes WHERE slug = 'fish-sticks'), 'Lemon wedge', '1 (optional)', '🍋', 3);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji, requires_adult) VALUES
((SELECT id FROM recipes WHERE slug = 'fish-sticks'), 1, 'Preheat oven to 425°F', 'Preheat', '🔥', true),
((SELECT id FROM recipes WHERE slug = 'fish-sticks'), 2, 'Put fish sticks on baking sheet', 'Arrange', '🐟', false),
((SELECT id FROM recipes WHERE slug = 'fish-sticks'), 3, 'Bake 12-15 minutes', 'Bake', '🔥', true),
((SELECT id FROM recipes WHERE slug = 'fish-sticks'), 4, 'Let cool 2 minutes', 'Cool', '❄️', false),
((SELECT id FROM recipes WHERE slug = 'fish-sticks'), 5, 'Squeeze lemon if you want', 'Squeeze', '🍋', false),
((SELECT id FROM recipes WHERE slug = 'fish-sticks'), 6, 'Dip in tartar sauce and enjoy!', 'Eat', '😋', false);

-- 40. Cheese Roll-Ups
INSERT INTO recipes (slug, name, description, emoji, category_id, difficulty, prep_time_minutes, servings, is_no_bake, is_no_knives, is_vegetarian)
VALUES ('cheese-roll-ups', 'Cheese Roll-Ups', 'Simple and fun!', '🧀', 'main-dishes', 'easy', 2, 1, true, true, true);

INSERT INTO recipe_ingredients (recipe_id, name, amount, emoji, sort_order) VALUES
((SELECT id FROM recipes WHERE slug = 'cheese-roll-ups'), 'Tortilla', '1', '🫓', 1),
((SELECT id FROM recipes WHERE slug = 'cheese-roll-ups'), 'Cheese slices', '2', '🧀', 2);

INSERT INTO recipe_steps (recipe_id, step_number, instruction, action_word, emoji) VALUES
((SELECT id FROM recipes WHERE slug = 'cheese-roll-ups'), 1, 'Lay tortilla flat', 'Place', '🫓'),
((SELECT id FROM recipes WHERE slug = 'cheese-roll-ups'), 2, 'Lay cheese slices on tortilla', 'Add', '🧀'),
((SELECT id FROM recipes WHERE slug = 'cheese-roll-ups'), 3, 'Roll up tightly', 'Roll', '🌯'),
((SELECT id FROM recipes WHERE slug = 'cheese-roll-ups'), 4, 'Cut into pinwheels', 'Cut', '🔪'),
((SELECT id FROM recipes WHERE slug = 'cheese-roll-ups'), 5, 'Enjoy!', 'Eat', '😋');
