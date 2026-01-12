// Nutrition.jsx - Visual recipes for cooking
// Fetches recipes from Supabase database with local fallback

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Utensils, Apple, Clock, Users, ChevronRight, Check, Home, Search, Loader, AlertCircle } from 'lucide-react';
import { getRecipes, getCategories, getRecipeById } from '../services/recipes';

// Recipe Card
const RecipeCard = ({ recipe, onClick }) => (
  <button onClick={onClick} className="w-full p-4 bg-white rounded-2xl border-3 border-gray-200 shadow-sm hover:shadow-crayon hover:border-[#5CB85C] hover:-translate-y-1 transition-all text-left">
    <div className="flex items-start gap-3">
      <div className="text-4xl">{recipe.image_emoji || recipe.emoji}</div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-lg text-gray-800 truncate">{recipe.name}</h3>
        <p className="font-crayon text-sm text-gray-600 line-clamp-1">{recipe.description}</p>
        <div className="flex items-center gap-3 mt-2 text-xs font-crayon text-gray-500">
          <span className="flex items-center gap-1"><Clock size={12} />{recipe.total_time || recipe.prep_time + recipe.cook_time} min</span>
          <span className={`px-2 py-0.5 rounded-full ${recipe.difficulty === 'easy' ? 'bg-green-100 text-green-700' : recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{recipe.difficulty}</span>
        </div>
      </div>
      <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
    </div>
  </button>
);

// Recipe Detail View
const RecipeDetail = ({ recipe, onBack }) => {
  const [completedSteps, setCompletedSteps] = useState([]);
  const toggleStep = (index) => setCompletedSteps(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  const steps = recipe.steps || [];
  const ingredients = recipe.ingredients || [];
  const isAllComplete = completedSteps.length === steps.length && steps.length > 0;

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#5CB85C] rounded-full font-crayon text-[#5CB85C] hover:bg-[#5CB85C] hover:text-white transition-all shadow-sm text-sm">
            <ArrowLeft size={16} />Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-display text-gray-800 truncate flex items-center gap-2">{recipe.emoji} {recipe.name}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Recipe Info */}
        <div className="bg-white rounded-2xl border-3 border-[#5CB85C] p-4 mb-6">
          <div className="flex items-center justify-center gap-6 text-center">
            <div><Clock size={24} className="mx-auto text-[#F5A623] mb-1" /><p className="font-crayon text-sm text-gray-600">{recipe.total_time || (recipe.prep_time + recipe.cook_time)} min</p></div>
            <div className="text-5xl">{recipe.image_emoji || recipe.emoji}</div>
            <div><Users size={24} className="mx-auto text-[#4A9FD4] mb-1" /><p className="font-crayon text-sm text-gray-600">{recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</p></div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-2xl border-3 border-[#F5A623] p-4 mb-6">
          <h2 className="font-display text-xl text-[#F5A623] mb-3 flex items-center gap-2"><Apple size={24} />What You Need</h2>
          <div className="grid grid-cols-2 gap-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-[#FFFEF5] rounded-xl">
                <span className="text-2xl">{ing.emoji}</span>
                <div><p className="font-crayon text-sm text-gray-800">{ing.name}</p><p className="font-crayon text-xs text-gray-500">{ing.amount}</p></div>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl border-3 border-[#4A9FD4] p-4">
          <h2 className="font-display text-xl text-[#4A9FD4] mb-3 flex items-center gap-2"><Utensils size={24} />Steps ({completedSteps.length}/{steps.length})</h2>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <button key={index} onClick={() => toggleStep(index)} className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left ${completedSteps.includes(index) ? 'bg-[#5CB85C]/10 border-2 border-[#5CB85C]' : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-display ${completedSteps.includes(index) ? 'bg-[#5CB85C]' : 'bg-[#4A9FD4]'}`}>
                  {completedSteps.includes(index) ? <Check size={16} /> : step.step_number || index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{step.emoji}</span>
                    <span className="font-crayon text-sm font-medium text-gray-800">{step.action}</span>
                    {step.requires_adult && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">👨‍👩‍👧 Adult</span>}
                  </div>
                  <p className={`font-crayon text-sm mt-1 ${completedSteps.includes(index) ? 'text-gray-500 line-through' : 'text-gray-600'}`}>{step.instruction}</p>
                </div>
              </button>
            ))}
          </div>
          {isAllComplete && (
            <div className="mt-6 p-4 bg-[#5CB85C]/20 rounded-xl text-center border-2 border-[#5CB85C]">
              <p className="text-4xl mb-2">🎉</p><p className="font-display text-xl text-[#5CB85C]">Great Job!</p><p className="font-crayon text-sm text-gray-600">You made {recipe.name}!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Main Nutrition Component
const Nutrition = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({});

  useEffect(() => { loadData(); }, []);
  useEffect(() => { loadRecipes(); }, [selectedCategory, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, recs] = await Promise.all([getCategories(), getRecipes()]);
      setCategories(cats);
      setRecipes(recs);
      const c = { all: recs.length };
      cats.forEach(cat => { c[cat.id] = recs.filter(r => r.category_id === cat.id).length; });
      setCounts(c);
    } catch (err) {
      setError('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const loadRecipes = async () => {
    try {
      const recs = await getRecipes({ category: selectedCategory, search: searchQuery });
      setRecipes(recs);
    } catch (err) { console.error(err); }
  };

  const handleSelectRecipe = async (recipe) => {
    setLoading(true);
    try {
      const full = await getRecipeById(recipe.id);
      setSelectedRecipe(full || recipe);
    } catch (err) {
      setSelectedRecipe(recipe);
    } finally {
      setLoading(false);
    }
  };

  if (selectedRecipe) return <RecipeDetail recipe={selectedRecipe} onBack={() => setSelectedRecipe(null)} />;

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/health')} className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#5CB85C] rounded-full font-crayon text-[#5CB85C] hover:bg-[#5CB85C] hover:text-white transition-all shadow-sm text-sm">
            <ArrowLeft size={16} />Back
          </button>
          <img src="/logo.jpeg" alt="Special Needs World" className="w-10 h-10 rounded-lg shadow-sm" />
          <h1 className="text-lg sm:text-xl font-display text-[#5CB85C] crayon-text">🍳 Recipes</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search recipes..." className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border-3 border-gray-200 font-crayon focus:border-[#5CB85C] focus:outline-none" />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <button onClick={() => setSelectedCategory('all')} className={`flex items-center gap-2 px-4 py-2 rounded-full font-crayon text-sm whitespace-nowrap transition-all ${selectedCategory === 'all' ? 'bg-[#4A9FD4] text-white shadow-crayon' : 'bg-white border-2 border-gray-200 text-gray-600'}`}>
            📖 All ({counts.all || 0})
          </button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full font-crayon text-sm whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'text-white shadow-crayon' : 'bg-white border-2 border-gray-200 text-gray-600'}`} style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}>
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && <div className="flex items-center justify-center py-12"><Loader size={32} className="text-[#5CB85C] animate-spin" /></div>}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-8 bg-red-50 rounded-xl border-2 border-red-200">
            <AlertCircle size={32} className="mx-auto text-red-500 mb-2" /><p className="font-crayon text-red-700">{error}</p>
            <button onClick={loadData} className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg font-crayon text-sm">Try Again</button>
          </div>
        )}

        {/* Recipes */}
        {!loading && !error && (
          <div className="space-y-3">
            {recipes.length > 0 ? recipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} onClick={() => handleSelectRecipe(recipe)} />) : (
              <div className="text-center py-8"><p className="text-4xl mb-2">🔍</p><p className="font-crayon text-gray-600">No recipes found</p>
                <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="mt-3 text-[#4A9FD4] font-crayon hover:underline">Clear filters</button>
              </div>
            )}
          </div>
        )}

        {/* Attribution */}
        <div className="mt-8 p-4 bg-white rounded-2xl border-3 border-[#87CEEB] text-center">
          <p className="font-crayon text-sm text-gray-600">🍳 Visual recipes inspired by <a href="https://www.accessiblechef.com" target="_blank" rel="noopener noreferrer" className="text-[#4A9FD4] hover:underline">Accessible Chef</a></p>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="sticky bottom-0 bg-white border-t-4 border-[#87CEEB] px-3 py-2">
        <div className="max-w-2xl mx-auto flex justify-around">
          <button onClick={() => setSelectedCategory('all')} className="flex flex-col items-center p-2 text-gray-600 hover:text-[#5CB85C]"><Utensils size={24} /><span className="text-xs font-crayon">All</span></button>
          <button onClick={() => setSelectedCategory('breakfast')} className="flex flex-col items-center p-2"><span className="text-2xl">🌅</span><span className="text-xs font-crayon">Breakfast</span></button>
          <button onClick={() => setSelectedCategory('snack')} className="flex flex-col items-center p-2"><span className="text-2xl">🍿</span><span className="text-xs font-crayon">Snacks</span></button>
          <button onClick={() => navigate('/health')} className="flex flex-col items-center p-2 text-gray-600 hover:text-[#E86B9A]"><Home size={24} /><span className="text-xs font-crayon">Health</span></button>
        </div>
      </nav>
    </div>
  );
};

export default Nutrition;
