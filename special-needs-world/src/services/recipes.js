// recipes.js - Service for fetching recipes from Supabase
// Falls back to local data if Supabase is not configured

import { supabase, isSupabaseConfigured } from './supabase';

// ============================================
// LOCAL FALLBACK RECIPES (when DB not available)
// ============================================
const localRecipes = [
  {
    id: 1, slug: 'pb-banana-toast', name: 'Peanut Butter Banana Toast', description: 'A yummy and healthy breakfast!',
    emoji: '🍌', image_emoji: '🥪', category_id: 'breakfast', difficulty: 'easy', prep_time: 5, cook_time: 2, total_time: 7, servings: 1,
    ingredients: [
      { name: 'Bread', emoji: '🍞', amount: '1 slice' },
      { name: 'Peanut Butter', emoji: '🥜', amount: '2 tbsp' },
      { name: 'Banana', emoji: '🍌', amount: '1' },
    ],
    steps: [
      { step_number: 1, instruction: 'Put bread in the toaster', action: 'Toast bread', emoji: '🍞' },
      { step_number: 2, instruction: 'Wait for toast to pop up', action: 'Wait', emoji: '⏰' },
      { step_number: 3, instruction: 'Spread peanut butter on toast', action: 'Spread PB', emoji: '🥜' },
      { step_number: 4, instruction: 'Peel the banana', action: 'Peel', emoji: '🍌' },
      { step_number: 5, instruction: 'Cut banana into circles', action: 'Cut', emoji: '🔪' },
      { step_number: 6, instruction: 'Put banana slices on top', action: 'Add banana', emoji: '🍌' },
      { step_number: 7, instruction: 'Enjoy your toast!', action: 'Eat!', emoji: '😋' },
    ],
  },
  {
    id: 2, slug: 'fruit-yogurt-bowl', name: 'Fruit & Yogurt Bowl', description: 'Colorful and healthy!',
    emoji: '🍓', image_emoji: '🥣', category_id: 'breakfast', difficulty: 'easy', prep_time: 5, cook_time: 0, total_time: 5, servings: 1,
    ingredients: [
      { name: 'Yogurt', emoji: '🥛', amount: '1 cup' },
      { name: 'Strawberries', emoji: '🍓', amount: '5' },
      { name: 'Blueberries', emoji: '🫐', amount: 'handful' },
      { name: 'Granola', emoji: '🥣', amount: '2 tbsp' },
    ],
    steps: [
      { step_number: 1, instruction: 'Get a bowl', action: 'Get bowl', emoji: '🥣' },
      { step_number: 2, instruction: 'Scoop yogurt into the bowl', action: 'Add yogurt', emoji: '🥛' },
      { step_number: 3, instruction: 'Wash the strawberries', action: 'Wash', emoji: '🚿' },
      { step_number: 4, instruction: 'Add strawberries on top', action: 'Add', emoji: '🍓' },
      { step_number: 5, instruction: 'Add blueberries', action: 'Add', emoji: '🫐' },
      { step_number: 6, instruction: 'Sprinkle granola', action: 'Sprinkle', emoji: '🥣' },
      { step_number: 7, instruction: 'Enjoy!', action: 'Eat!', emoji: '😋' },
    ],
  },
  {
    id: 3, slug: 'grilled-cheese', name: 'Grilled Cheese Sandwich', description: 'Classic comfort food!',
    emoji: '🧀', image_emoji: '🥪', category_id: 'lunch', difficulty: 'easy', prep_time: 3, cook_time: 8, total_time: 11, servings: 1,
    ingredients: [
      { name: 'Bread', emoji: '🍞', amount: '2 slices' },
      { name: 'Cheese', emoji: '🧀', amount: '2 slices' },
      { name: 'Butter', emoji: '🧈', amount: '2 tbsp' },
    ],
    steps: [
      { step_number: 1, instruction: 'Get a frying pan', action: 'Get pan', emoji: '🍳' },
      { step_number: 2, instruction: 'Turn stove to medium', action: 'Heat', emoji: '🔥' },
      { step_number: 3, instruction: 'Butter one side of each bread', action: 'Butter', emoji: '🧈' },
      { step_number: 4, instruction: 'Put bread butter-side down', action: 'Add bread', emoji: '🍞' },
      { step_number: 5, instruction: 'Add cheese on top', action: 'Add cheese', emoji: '🧀' },
      { step_number: 6, instruction: 'Put second bread on top', action: 'Top it', emoji: '🍞' },
      { step_number: 7, instruction: 'Cook until golden', action: 'Cook', emoji: '⏰' },
      { step_number: 8, instruction: 'Flip carefully', action: 'Flip', emoji: '🔄' },
      { step_number: 9, instruction: 'Cook other side', action: 'Cook', emoji: '⏰' },
      { step_number: 10, instruction: 'Cut and enjoy!', action: 'Eat!', emoji: '😋' },
    ],
  },
  {
    id: 4, slug: 'cheese-quesadilla', name: 'Cheese Quesadilla', description: 'Melty cheese in a crispy tortilla!',
    emoji: '🧀', image_emoji: '🌮', category_id: 'lunch', difficulty: 'easy', prep_time: 2, cook_time: 8, total_time: 10, servings: 1,
    ingredients: [
      { name: 'Tortilla', emoji: '🫓', amount: '1' },
      { name: 'Shredded Cheese', emoji: '🧀', amount: '1/2 cup' },
      { name: 'Butter', emoji: '🧈', amount: '1 tsp' },
    ],
    steps: [
      { step_number: 1, instruction: 'Put pan on stove', action: 'Get pan', emoji: '🍳' },
      { step_number: 2, instruction: 'Turn stove to medium', action: 'Heat', emoji: '🔥' },
      { step_number: 3, instruction: 'Add butter to pan', action: 'Add butter', emoji: '🧈' },
      { step_number: 4, instruction: 'Put tortilla in pan', action: 'Add tortilla', emoji: '🫓' },
      { step_number: 5, instruction: 'Add cheese on half', action: 'Add cheese', emoji: '🧀' },
      { step_number: 6, instruction: 'Fold tortilla in half', action: 'Fold', emoji: '🌮' },
      { step_number: 7, instruction: 'Cook until golden', action: 'Cook', emoji: '⏰' },
      { step_number: 8, instruction: 'Flip to other side', action: 'Flip', emoji: '🔄' },
      { step_number: 9, instruction: 'Cut and enjoy!', action: 'Eat!', emoji: '😋' },
    ],
  },
  {
    id: 5, slug: 'simple-pasta', name: 'Simple Pasta', description: 'Classic pasta with sauce!',
    emoji: '🍝', image_emoji: '🍝', category_id: 'dinner', difficulty: 'medium', prep_time: 5, cook_time: 15, total_time: 20, servings: 2,
    ingredients: [
      { name: 'Pasta', emoji: '🍝', amount: '2 cups' },
      { name: 'Pasta Sauce', emoji: '🍅', amount: '1 cup' },
      { name: 'Parmesan', emoji: '🧀', amount: 'to taste' },
    ],
    steps: [
      { step_number: 1, instruction: 'Fill pot with water', action: 'Fill pot', emoji: '💧' },
      { step_number: 2, instruction: 'Put pot on stove', action: 'Heat', emoji: '🔥' },
      { step_number: 3, instruction: 'Wait for bubbles', action: 'Wait', emoji: '💨' },
      { step_number: 4, instruction: 'Add pasta to water', action: 'Add pasta', emoji: '🍝' },
      { step_number: 5, instruction: 'Set timer for 10 min', action: 'Timer', emoji: '⏰' },
      { step_number: 6, instruction: 'Stir sometimes', action: 'Stir', emoji: '🥄' },
      { step_number: 7, instruction: 'Drain water (adult help)', action: 'Drain', emoji: '💧' },
      { step_number: 8, instruction: 'Add sauce and mix', action: 'Add sauce', emoji: '🍅' },
      { step_number: 9, instruction: 'Add cheese on top', action: 'Add cheese', emoji: '🧀' },
      { step_number: 10, instruction: 'Enjoy!', action: 'Eat!', emoji: '😋' },
    ],
  },
  {
    id: 6, slug: 'berry-smoothie', name: 'Berry Smoothie', description: 'Cold and fruity!',
    emoji: '🥤', image_emoji: '🥤', category_id: 'snack', difficulty: 'easy', prep_time: 5, cook_time: 0, total_time: 5, servings: 1,
    ingredients: [
      { name: 'Frozen Berries', emoji: '🍓', amount: '1 cup' },
      { name: 'Banana', emoji: '🍌', amount: '1' },
      { name: 'Milk', emoji: '🥛', amount: '1 cup' },
      { name: 'Honey', emoji: '🍯', amount: '1 tsp' },
    ],
    steps: [
      { step_number: 1, instruction: 'Get the blender', action: 'Get blender', emoji: '🫙' },
      { step_number: 2, instruction: 'Add frozen berries', action: 'Add berries', emoji: '🍓' },
      { step_number: 3, instruction: 'Peel and add banana', action: 'Add banana', emoji: '🍌' },
      { step_number: 4, instruction: 'Pour in milk', action: 'Add milk', emoji: '🥛' },
      { step_number: 5, instruction: 'Add honey', action: 'Add honey', emoji: '🍯' },
      { step_number: 6, instruction: 'Put lid on tight', action: 'Close lid', emoji: '🔒' },
      { step_number: 7, instruction: 'Blend until smooth', action: 'Blend', emoji: '🌀' },
      { step_number: 8, instruction: 'Pour in glass', action: 'Pour', emoji: '🥤' },
      { step_number: 9, instruction: 'Enjoy!', action: 'Drink!', emoji: '😋' },
    ],
  },
  {
    id: 7, slug: 'trail-mix', name: 'DIY Trail Mix', description: 'Mix your favorites!',
    emoji: '🥜', image_emoji: '🥜', category_id: 'snack', difficulty: 'easy', prep_time: 3, cook_time: 0, total_time: 3, servings: 2,
    ingredients: [
      { name: 'Cereal', emoji: '🥣', amount: '1/2 cup' },
      { name: 'Raisins', emoji: '🍇', amount: '1/4 cup' },
      { name: 'Pretzels', emoji: '🥨', amount: '1/4 cup' },
      { name: 'Chocolate Chips', emoji: '🍫', amount: 'handful' },
    ],
    steps: [
      { step_number: 1, instruction: 'Get a big bowl', action: 'Get bowl', emoji: '🥣' },
      { step_number: 2, instruction: 'Add cereal', action: 'Add cereal', emoji: '🥣' },
      { step_number: 3, instruction: 'Add raisins', action: 'Add raisins', emoji: '🍇' },
      { step_number: 4, instruction: 'Add pretzels', action: 'Add pretzels', emoji: '🥨' },
      { step_number: 5, instruction: 'Add chocolate chips', action: 'Add chocolate', emoji: '🍫' },
      { step_number: 6, instruction: 'Mix with your hands', action: 'Mix', emoji: '👐' },
      { step_number: 7, instruction: 'Put in snack bag', action: 'Bag it', emoji: '👜' },
      { step_number: 8, instruction: 'Enjoy anytime!', action: 'Eat!', emoji: '😋' },
    ],
  },
  {
    id: 8, slug: 'ice-cream-sundae', name: 'Ice Cream Sundae', description: 'Build your own sundae!',
    emoji: '🍨', image_emoji: '🍨', category_id: 'dessert', difficulty: 'easy', prep_time: 5, cook_time: 0, total_time: 5, servings: 1,
    ingredients: [
      { name: 'Ice Cream', emoji: '🍨', amount: '2 scoops' },
      { name: 'Chocolate Sauce', emoji: '🍫', amount: '2 tbsp' },
      { name: 'Whipped Cream', emoji: '🥛', amount: 'to top' },
      { name: 'Sprinkles', emoji: '🌈', amount: 'to top' },
    ],
    steps: [
      { step_number: 1, instruction: 'Get a bowl', action: 'Get dish', emoji: '🥣' },
      { step_number: 2, instruction: 'Scoop ice cream', action: 'Add ice cream', emoji: '🍨' },
      { step_number: 3, instruction: 'Pour chocolate sauce', action: 'Add sauce', emoji: '🍫' },
      { step_number: 4, instruction: 'Add whipped cream', action: 'Add cream', emoji: '🥛' },
      { step_number: 5, instruction: 'Add sprinkles', action: 'Decorate', emoji: '🌈' },
      { step_number: 6, instruction: 'Enjoy your sundae!', action: 'Eat!', emoji: '😋' },
    ],
  },
];

const localCategories = [
  { id: 'breakfast', name: 'Breakfast', emoji: '🌅', color: '#F5A623' },
  { id: 'lunch', name: 'Lunch', emoji: '☀️', color: '#5CB85C' },
  { id: 'dinner', name: 'Dinner', emoji: '🌙', color: '#8E6BBF' },
  { id: 'snack', name: 'Snacks', emoji: '🍿', color: '#E86B9A' },
  { id: 'dessert', name: 'Desserts', emoji: '🍰', color: '#E63B2E' },
  { id: 'drink', name: 'Drinks', emoji: '🥤', color: '#4A9FD4' },
];

// ============================================
// DATABASE FUNCTIONS
// ============================================

export async function getCategories() {
  if (!isSupabaseConfigured()) return localCategories;
  try {
    const { data, error } = await supabase.from('recipe_categories').select('*').order('sort_order');
    if (error) throw error;
    return data || localCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return localCategories;
  }
}

export async function getRecipes({ category = null, difficulty = null, search = '' } = {}) {
  if (!isSupabaseConfigured()) {
    let filtered = [...localRecipes];
    if (category && category !== 'all') filtered = filtered.filter(r => r.category_id === category);
    if (difficulty) filtered = filtered.filter(r => r.difficulty === difficulty);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(r => r.name.toLowerCase().includes(s) || r.description.toLowerCase().includes(s));
    }
    return filtered;
  }

  try {
    let query = supabase.from('recipes').select('*').eq('is_active', true).order('name');
    if (category && category !== 'all') query = query.eq('category_id', category);
    if (difficulty) query = query.eq('difficulty', difficulty);
    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return localRecipes;
  }
}

export async function getRecipeById(id) {
  if (!isSupabaseConfigured()) {
    return localRecipes.find(r => r.id === id) || null;
  }

  try {
    const { data: recipe, error: recipeError } = await supabase.from('recipes').select('*').eq('id', id).eq('is_active', true).single();
    if (recipeError) throw recipeError;
    if (!recipe) return null;

    const { data: ingredients } = await supabase.from('recipe_ingredients').select('*').eq('recipe_id', id).order('sort_order');
    const { data: steps } = await supabase.from('recipe_steps').select('*').eq('recipe_id', id).order('step_number');

    return { ...recipe, ingredients: ingredients || [], steps: steps || [] };
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return localRecipes.find(r => r.id === id) || null;
  }
}

export async function getRecipeBySlug(slug) {
  if (!isSupabaseConfigured()) {
    return localRecipes.find(r => r.slug === slug) || null;
  }

  try {
    const { data: recipe, error: recipeError } = await supabase.from('recipes').select('*').eq('slug', slug).eq('is_active', true).single();
    if (recipeError) throw recipeError;
    if (!recipe) return null;

    const { data: ingredients } = await supabase.from('recipe_ingredients').select('*').eq('recipe_id', recipe.id).order('sort_order');
    const { data: steps } = await supabase.from('recipe_steps').select('*').eq('recipe_id', recipe.id).order('step_number');

    return { ...recipe, ingredients: ingredients || [], steps: steps || [] };
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return localRecipes.find(r => r.slug === slug) || null;
  }
}

export async function getRecipeCounts() {
  if (!isSupabaseConfigured()) {
    const counts = { all: localRecipes.length };
    localCategories.forEach(cat => { counts[cat.id] = localRecipes.filter(r => r.category_id === cat.id).length; });
    return counts;
  }

  try {
    const { data, error } = await supabase.from('recipes').select('category_id').eq('is_active', true);
    if (error) throw error;
    const counts = { all: data?.length || 0 };
    data?.forEach(r => { counts[r.category_id] = (counts[r.category_id] || 0) + 1; });
    return counts;
  } catch (error) {
    console.error('Error fetching counts:', error);
    return { all: localRecipes.length };
  }
}

export default { getCategories, getRecipes, getRecipeById, getRecipeBySlug, getRecipeCounts };
