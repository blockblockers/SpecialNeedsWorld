// GoalTracker.jsx - Track IEP and therapy goals
// Privacy-focused: No PHI, just goal titles and progress
// Simple tracking without medical details

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Target,
  Check,
  X,
  Trash2,
  Edit2,
  Star,
  TrendingUp,
  Calendar
} from 'lucide-react';
import LocalOnlyNotice from '../components/LocalOnlyNotice';

// Goal categories (generic)
const GOAL_CATEGORIES = [
  { id: 'communication', label: 'Communication', emoji: '🗣️', color: 'bg-blue-100 border-blue-400' },
  { id: 'social', label: 'Social Skills', emoji: '👥', color: 'bg-purple-100 border-purple-400' },
  { id: 'academic', label: 'Academic', emoji: '📚', color: 'bg-green-100 border-green-400' },
  { id: 'motor', label: 'Motor Skills', emoji: '🏃', color: 'bg-orange-100 border-orange-400' },
  { id: 'daily', label: 'Daily Living', emoji: '🏠', color: 'bg-pink-100 border-pink-400' },
  { id: 'behavior', label: 'Behavior', emoji: '⭐', color: 'bg-yellow-100 border-yellow-400' },
  { id: 'other', label: 'Other', emoji: '🎯', color: 'bg-gray-100 border-gray-400' },
];

// Progress levels
const PROGRESS_LEVELS = [
  { value: 0, label: 'Not Started', color: 'bg-gray-200', emoji: '⬜' },
  { value: 25, label: 'Just Starting', color: 'bg-red-200', emoji: '🔴' },
  { value: 50, label: 'Working On It', color: 'bg-yellow-200', emoji: '🟡' },
  { value: 75, label: 'Almost There', color: 'bg-blue-200', emoji: '🔵' },
  { value: 100, label: 'Achieved!', color: 'bg-green-200', emoji: '🟢' },
];

const STORAGE_KEY = 'snw_goals';

const GoalTracker = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'achieved'
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'communication',
    progress: 0,
    targetDate: '',
    notes: '',
  });

  // Load goals from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setGoals(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading goals:', e);
      }
    }
  }, []);

  // Save goals to localStorage
  const saveGoals = (newGoals) => {
    setGoals(newGoals);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newGoals));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    const goal = {
      id: editingId || Date.now().toString(),
      ...formData,
      createdAt: editingId ? goals.find(g => g.id === editingId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let newGoals;
    if (editingId) {
      newGoals = goals.map(g => g.id === editingId ? goal : g);
    } else {
      newGoals = [...goals, goal];
    }

    saveGoals(newGoals);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      category: 'communication',
      progress: 0,
      targetDate: '',
      notes: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  // Edit goal
  const handleEdit = (goal) => {
    setFormData({
      title: goal.title,
      category: goal.category,
      progress: goal.progress,
      targetDate: goal.targetDate || '',
      notes: goal.notes || '',
    });
    setEditingId(goal.id);
    setShowForm(true);
  };

  // Delete goal
  const handleDelete = (id) => {
    if (confirm('Delete this goal?')) {
      saveGoals(goals.filter(g => g.id !== id));
    }
  };

  // Update progress quickly
  const updateProgress = (id, newProgress) => {
    const newGoals = goals.map(g => 
      g.id === id 
        ? { ...g, progress: newProgress, updatedAt: new Date().toISOString() }
        : g
    );
    saveGoals(newGoals);
  };

  // Get category info
  const getCategoryInfo = (catId) => {
    return GOAL_CATEGORIES.find(c => c.id === catId) || GOAL_CATEGORIES[6];
  };

  // Get progress info
  const getProgressInfo = (progress) => {
    return PROGRESS_LEVELS.reduce((prev, curr) => 
      Math.abs(curr.value - progress) < Math.abs(prev.value - progress) ? curr : prev
    );
  };

  // Filter goals
  const filteredGoals = goals.filter(goal => {
    if (filter === 'active') return goal.progress < 100;
    if (filter === 'achieved') return goal.progress === 100;
    return true;
  });

  // Stats
  const activeCount = goals.filter(g => g.progress < 100).length;
  const achievedCount = goals.filter(g => g.progress === 100).length;

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#5CB85C] 
                       rounded-full font-crayon text-[#5CB85C] hover:bg-[#5CB85C] 
                       hover:text-white transition-all shadow-sm text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#5CB85C] crayon-text flex items-center gap-2">
              🎯 Goal Tracker
            </h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="p-2 bg-[#5CB85C] text-white rounded-full border-3 border-green-600
                       hover:scale-110 transition-transform shadow-sm"
          >
            <Plus size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Privacy Notice */}
        <div className="mb-4">
          <LocalOnlyNotice />
        </div>
        {/* Stats Bar */}
        {goals.length > 0 && (
          <div className="mb-4 flex gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-2 rounded-xl font-crayon text-sm transition-all
                ${filter === 'all' 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              All ({goals.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`flex-1 py-2 rounded-xl font-crayon text-sm transition-all
                ${filter === 'active' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setFilter('achieved')}
              className={`flex-1 py-2 rounded-xl font-crayon text-sm transition-all
                ${filter === 'achieved' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
            >
              Done ({achievedCount}) ⭐
            </button>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-6 bg-white rounded-2xl border-4 border-[#5CB85C] p-4 shadow-crayon">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-lg text-[#5CB85C]">
                {editingId ? 'Edit Goal' : 'Add Goal'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Goal Title */}
              <div>
                <label className="block font-crayon text-gray-700 mb-1">Goal: *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="What are we working on?"
                  required
                  className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon
                           focus:border-[#5CB85C] focus:outline-none"
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block font-crayon text-gray-700 mb-2">Category:</label>
                <div className="grid grid-cols-4 gap-2">
                  {GOAL_CATEGORIES.slice(0, 4).map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({...formData, category: cat.id})}
                      className={`p-2 rounded-xl border-2 font-crayon text-xs transition-all
                        ${formData.category === cat.id 
                          ? `${cat.color} border-2` 
                          : 'bg-gray-50 border-gray-200 hover:border-gray-400'
                        }`}
                    >
                      <span className="text-lg">{cat.emoji}</span>
                      <span className="block mt-1">{cat.label}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {GOAL_CATEGORIES.slice(4).map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({...formData, category: cat.id})}
                      className={`p-2 rounded-xl border-2 font-crayon text-xs transition-all
                        ${formData.category === cat.id 
                          ? `${cat.color} border-2` 
                          : 'bg-gray-50 border-gray-200 hover:border-gray-400'
                        }`}
                    >
                      <span className="text-lg">{cat.emoji}</span>
                      <span className="block mt-1">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div>
                <label className="block font-crayon text-gray-700 mb-2">Current Progress:</label>
                <div className="flex gap-2">
                  {PROGRESS_LEVELS.map(level => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setFormData({...formData, progress: level.value})}
                      className={`flex-1 p-2 rounded-xl border-2 font-crayon text-xs transition-all
                        ${formData.progress === level.value 
                          ? `${level.color} border-gray-400` 
                          : 'bg-gray-50 border-gray-200 hover:border-gray-400'
                        }`}
                    >
                      <span className="text-lg">{level.emoji}</span>
                      <span className="block mt-1 leading-tight">{level.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Date */}
              <div>
                <label className="block font-crayon text-gray-700 mb-1">
                  Target Date (optional):
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
                  className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon
                           focus:border-[#5CB85C] focus:outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-crayon text-gray-700 mb-1">Notes (optional):</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="How we're working on this..."
                  rows={2}
                  className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon
                           focus:border-[#5CB85C] focus:outline-none resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-[#5CB85C] text-white rounded-xl border-3 border-green-600
                         font-crayon text-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                <Check size={20} />
                {editingId ? 'Save Changes' : 'Add Goal'}
              </button>
            </form>
          </div>
        )}

        {/* Empty State */}
        {goals.length === 0 && !showForm && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="font-display text-xl text-gray-500 mb-2">No Goals Yet</h2>
            <p className="font-crayon text-gray-400 mb-4">
              Track IEP goals, therapy goals, and personal goals!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-[#5CB85C] text-white rounded-xl border-3 border-green-600
                       font-crayon hover:scale-105 transition-transform"
            >
              <Plus size={20} className="inline mr-2" />
              Add First Goal
            </button>
          </div>
        )}

        {/* Goals List */}
        {filteredGoals.length > 0 && (
          <div className="space-y-4">
            {filteredGoals.map(goal => {
              const catInfo = getCategoryInfo(goal.category);
              const progressInfo = getProgressInfo(goal.progress);
              const isAchieved = goal.progress === 100;
              
              return (
                <div
                  key={goal.id}
                  className={`bg-white rounded-2xl border-3 shadow-sm overflow-hidden
                    ${isAchieved ? 'border-green-400' : catInfo.color}`}
                >
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">{catInfo.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-display text-gray-800 ${isAchieved ? 'line-through opacity-60' : ''}`}>
                          {goal.title}
                        </h3>
                        <span className="text-xs font-crayon text-gray-500">
                          {catInfo.label}
                          {goal.targetDate && (
                            <span className="ml-2">
                              <Calendar size={12} className="inline" /> {goal.targetDate}
                            </span>
                          )}
                        </span>
                      </div>
                      {isAchieved && (
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs font-crayon text-gray-500 mb-1">
                        <span>{progressInfo.emoji} {progressInfo.label}</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            goal.progress === 100 ? 'bg-green-500' :
                            goal.progress >= 75 ? 'bg-blue-500' :
                            goal.progress >= 50 ? 'bg-yellow-500' :
                            goal.progress >= 25 ? 'bg-orange-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Progress Update */}
                    {!isAchieved && (
                      <div className="flex gap-1 mb-3">
                        {PROGRESS_LEVELS.map(level => (
                          <button
                            key={level.value}
                            onClick={() => updateProgress(goal.id, level.value)}
                            className={`flex-1 py-1 rounded text-lg transition-all
                              ${goal.progress === level.value 
                                ? 'bg-gray-800 scale-110' 
                                : 'bg-gray-100 hover:bg-gray-200'
                              }`}
                            title={level.label}
                          >
                            {level.emoji}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Notes */}
                    {goal.notes && (
                      <p className="text-sm font-crayon text-gray-500 bg-gray-50 p-2 rounded-lg mb-3">
                        {goal.notes}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-crayon text-sm
                                 hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="py-2 px-3 bg-red-100 text-red-600 rounded-lg
                                 hover:bg-red-200 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tip */}
        {goals.length > 0 && (
          <div className="mt-8 p-4 bg-white rounded-2xl border-3 border-[#F8D14A] shadow-sm">
            <p className="text-center text-gray-600 font-crayon text-sm">
              💡 <strong>Tip:</strong> Update progress regularly to celebrate small wins!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default GoalTracker;
