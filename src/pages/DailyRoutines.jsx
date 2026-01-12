// DailyRoutines.jsx - Track daily routine completion
// Helps establish consistent daily habits with visual checklists

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Check, 
  X, 
  Sun,
  Moon,
  Sunset,
  Edit2,
  Trash2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Star
} from 'lucide-react';
import LocalOnlyNotice from '../components/LocalOnlyNotice';

const STORAGE_KEY = 'snw_daily_routines';
const HISTORY_KEY = 'snw_routine_history';

// Time periods
const TIME_PERIODS = [
  { id: 'morning', name: 'Morning', emoji: '🌅', icon: Sun, color: 'yellow' },
  { id: 'afternoon', name: 'Afternoon', emoji: '☀️', icon: Sunset, color: 'orange' },
  { id: 'evening', name: 'Evening', emoji: '🌙', icon: Moon, color: 'purple' },
];

// Preset routine items
const PRESETS = {
  morning: [
    { name: 'Wake up', emoji: '⏰' },
    { name: 'Use bathroom', emoji: '🚽' },
    { name: 'Brush teeth', emoji: '🦷' },
    { name: 'Wash face', emoji: '🧼' },
    { name: 'Get dressed', emoji: '👕' },
    { name: 'Eat breakfast', emoji: '🥣' },
    { name: 'Take medicine', emoji: '💊' },
    { name: 'Pack bag', emoji: '🎒' },
  ],
  afternoon: [
    { name: 'Eat lunch', emoji: '🥪' },
    { name: 'Homework', emoji: '📚' },
    { name: 'Quiet time', emoji: '😌' },
    { name: 'Snack', emoji: '🍎' },
    { name: 'Play time', emoji: '🎮' },
    { name: 'Outdoor time', emoji: '🌳' },
    { name: 'Reading', emoji: '📖' },
    { name: 'Chores', emoji: '🧹' },
  ],
  evening: [
    { name: 'Eat dinner', emoji: '🍽️' },
    { name: 'Bath/shower', emoji: '🛁' },
    { name: 'Brush teeth', emoji: '🦷' },
    { name: 'Put on pajamas', emoji: '👔' },
    { name: 'Story time', emoji: '📚' },
    { name: 'Calm down time', emoji: '😴' },
    { name: 'Goodnight hugs', emoji: '🤗' },
    { name: 'Lights out', emoji: '💤' },
  ],
};

const COLORS = {
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-700', button: 'bg-yellow-400' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-700', button: 'bg-orange-400' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-700', button: 'bg-purple-400' },
};

const DailyRoutines = () => {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState({
    morning: [],
    afternoon: [],
    evening: [],
  });
  const [completedToday, setCompletedToday] = useState({});
  const [expandedPeriod, setExpandedPeriod] = useState('morning');
  const [showAddForm, setShowAddForm] = useState(null); // period id or null
  const [newItem, setNewItem] = useState({ name: '', emoji: '✨' });
  const [editMode, setEditMode] = useState(false);
  const [streak, setStreak] = useState(0);

  // Get today's date string
  const getTodayKey = () => new Date().toISOString().split('T')[0];

  // Load routines and today's progress
  useEffect(() => {
    const savedRoutines = localStorage.getItem(STORAGE_KEY);
    if (savedRoutines) {
      try {
        setRoutines(JSON.parse(savedRoutines));
      } catch (e) {
        console.error('Error loading routines:', e);
      }
    }

    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        const todayKey = getTodayKey();
        setCompletedToday(history[todayKey] || {});
        
        // Calculate streak
        calculateStreak(history);
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
  }, []);

  // Save routines
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
  }, [routines]);

  // Save completion status
  const saveCompletion = (newCompleted) => {
    const todayKey = getTodayKey();
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    let history = {};
    
    try {
      history = savedHistory ? JSON.parse(savedHistory) : {};
    } catch (e) {
      history = {};
    }
    
    history[todayKey] = newCompleted;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    setCompletedToday(newCompleted);
    calculateStreak(history);
  };

  // Calculate streak
  const calculateStreak = (history) => {
    let count = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      
      if (history[key] && Object.keys(history[key]).length > 0) {
        count++;
      } else if (i > 0) { // Don't break on today if nothing done yet
        break;
      }
    }
    
    setStreak(count);
  };

  // Toggle item completion
  const toggleItem = (periodId, itemId) => {
    const key = `${periodId}_${itemId}`;
    const newCompleted = { ...completedToday };
    
    if (newCompleted[key]) {
      delete newCompleted[key];
    } else {
      newCompleted[key] = true;
    }
    
    saveCompletion(newCompleted);
  };

  // Add routine item
  const addItem = (periodId) => {
    if (!newItem.name.trim()) return;
    
    const item = {
      id: Date.now().toString(),
      name: newItem.name.trim(),
      emoji: newItem.emoji,
    };
    
    setRoutines({
      ...routines,
      [periodId]: [...routines[periodId], item],
    });
    
    setNewItem({ name: '', emoji: '✨' });
    setShowAddForm(null);
  };

  // Add from preset
  const addPreset = (periodId, preset) => {
    const item = {
      id: Date.now().toString(),
      name: preset.name,
      emoji: preset.emoji,
    };
    
    setRoutines({
      ...routines,
      [periodId]: [...routines[periodId], item],
    });
  };

  // Delete item
  const deleteItem = (periodId, itemId) => {
    setRoutines({
      ...routines,
      [periodId]: routines[periodId].filter(i => i.id !== itemId),
    });
  };

  // Reset today's progress
  const resetToday = () => {
    if (!confirm('Reset all progress for today?')) return;
    saveCompletion({});
  };

  // Calculate completion percentage for a period
  const getCompletionPercent = (periodId) => {
    const items = routines[periodId];
    if (items.length === 0) return 0;
    
    const completed = items.filter(i => completedToday[`${periodId}_${i.id}`]).length;
    return Math.round((completed / items.length) * 100);
  };

  // Get overall completion
  const getTotalCompletion = () => {
    const allItems = [...routines.morning, ...routines.afternoon, ...routines.evening];
    if (allItems.length === 0) return 0;
    
    let completed = 0;
    TIME_PERIODS.forEach(period => {
      routines[period.id].forEach(item => {
        if (completedToday[`${period.id}_${item.id}`]) completed++;
      });
    });
    
    return Math.round((completed / allItems.length) * 100);
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                       rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-display text-[#8E6BBF] crayon-text">
              📋 Daily Routines
            </h1>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-3 py-1.5 rounded-full font-crayon text-sm border-2 transition-all
              ${editMode 
                ? 'bg-purple-100 border-purple-400 text-purple-700' 
                : 'bg-white border-gray-300 text-gray-600'
              }`}
          >
            <Edit2 size={14} className="inline mr-1" />
            {editMode ? 'Done' : 'Edit'}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Privacy Notice */}
        <div className="mb-4">
          <LocalOnlyNotice compact />
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl border-4 border-[#8E6BBF] p-4 mb-6 shadow-crayon">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-display text-lg text-[#8E6BBF]">Today's Progress</h2>
              <p className="font-crayon text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {streak > 0 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 rounded-full">
                  <Star size={16} className="text-yellow-500" fill="currentColor" />
                  <span className="font-crayon text-sm text-yellow-700">{streak} day{streak > 1 ? 's' : ''}</span>
                </div>
              )}
              <button
                onClick={resetToday}
                className="p-2 text-gray-400 hover:text-orange-500 rounded-lg hover:bg-gray-100"
                title="Reset today"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-[#8E6BBF] to-[#5CB85C] transition-all duration-500"
              style={{ width: `${getTotalCompletion()}%` }}
            />
          </div>
          <p className="font-crayon text-center text-gray-600">
            {getTotalCompletion()}% Complete
          </p>
        </div>

        {/* Time Periods */}
        <div className="space-y-4">
          {TIME_PERIODS.map(period => {
            const colors = COLORS[period.color];
            const isExpanded = expandedPeriod === period.id;
            const completion = getCompletionPercent(period.id);
            const items = routines[period.id];
            const Icon = period.icon;

            return (
              <div
                key={period.id}
                className={`rounded-2xl border-4 ${colors.border} overflow-hidden shadow-sm`}
              >
                {/* Period Header */}
                <button
                  onClick={() => setExpandedPeriod(isExpanded ? null : period.id)}
                  className={`w-full ${colors.bg} p-4 flex items-center gap-3`}
                >
                  <div className={`p-2 rounded-full ${colors.button} text-white`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className={`font-display text-lg ${colors.text}`}>
                      {period.emoji} {period.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-white/50 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${colors.button} transition-all duration-300`}
                          style={{ width: `${completion}%` }}
                        />
                      </div>
                      <span className="font-crayon text-xs text-gray-600">
                        {items.filter(i => completedToday[`${period.id}_${i.id}`]).length}/{items.length}
                      </span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {/* Period Items */}
                {isExpanded && (
                  <div className="bg-white p-4">
                    {items.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="font-crayon text-gray-400 mb-3">No items yet</p>
                        <p className="font-crayon text-sm text-gray-400 mb-2">Quick add:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {PRESETS[period.id].slice(0, 4).map(preset => (
                            <button
                              key={preset.name}
                              onClick={() => addPreset(period.id, preset)}
                              className={`px-3 py-1.5 rounded-full border-2 ${colors.border} 
                                         font-crayon text-sm hover:${colors.bg} transition-colors`}
                            >
                              {preset.emoji} {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {items.map(item => {
                          const isCompleted = completedToday[`${period.id}_${item.id}`];
                          
                          return (
                            <div
                              key={item.id}
                              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all
                                ${isCompleted 
                                  ? 'bg-green-50 border-green-300' 
                                  : 'bg-gray-50 border-gray-200'
                                }`}
                            >
                              <button
                                onClick={() => toggleItem(period.id, item.id)}
                                className={`w-8 h-8 rounded-full border-3 flex items-center justify-center
                                           transition-all ${isCompleted 
                                             ? 'bg-green-500 border-green-600 text-white' 
                                             : 'bg-white border-gray-300 hover:border-green-400'
                                           }`}
                              >
                                {isCompleted && <Check size={18} strokeWidth={3} />}
                              </button>
                              <span className="text-2xl">{item.emoji}</span>
                              <span className={`flex-1 font-crayon ${
                                isCompleted ? 'text-green-700 line-through' : 'text-gray-700'
                              }`}>
                                {item.name}
                              </span>
                              {editMode && (
                                <button
                                  onClick={() => deleteItem(period.id, item.id)}
                                  className="p-1 text-gray-400 hover:text-red-500"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Add Item */}
                    {showAddForm === period.id ? (
                      <div className="mt-4 p-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <div className="flex gap-2 mb-2">
                          <select
                            value={newItem.emoji}
                            onChange={(e) => setNewItem({ ...newItem, emoji: e.target.value })}
                            className="w-16 p-2 border-2 border-gray-300 rounded-lg font-crayon text-center"
                          >
                            {['✨', '⏰', '🦷', '🧼', '👕', '🥣', '📚', '🎮', '🛁', '💊', '🎒', '😴'].map(e => (
                              <option key={e} value={e}>{e}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            placeholder="Activity name..."
                            className="flex-1 p-2 border-2 border-gray-300 rounded-lg font-crayon
                                     focus:border-[#8E6BBF] focus:outline-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => addItem(period.id)}
                            disabled={!newItem.name.trim()}
                            className="flex-1 py-2 bg-green-500 text-white rounded-lg font-crayon
                                     hover:bg-green-600 disabled:opacity-50"
                          >
                            <Check size={16} className="inline mr-1" />
                            Add
                          </button>
                          <button
                            onClick={() => setShowAddForm(null)}
                            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg font-crayon
                                     hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                        
                        {/* Preset suggestions */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="font-crayon text-xs text-gray-500 mb-2">Quick add:</p>
                          <div className="flex flex-wrap gap-1">
                            {PRESETS[period.id].map(preset => (
                              <button
                                key={preset.name}
                                onClick={() => addPreset(period.id, preset)}
                                className="px-2 py-1 bg-white border border-gray-200 rounded-full
                                         font-crayon text-xs hover:border-gray-400"
                              >
                                {preset.emoji} {preset.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAddForm(period.id)}
                        className={`mt-4 w-full py-3 border-2 border-dashed ${colors.border} 
                                   rounded-xl font-crayon ${colors.text} hover:${colors.bg} 
                                   transition-colors flex items-center justify-center gap-2`}
                      >
                        <Plus size={18} />
                        Add {period.name} Activity
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border-3 border-blue-200">
          <h3 className="font-display text-blue-700 mb-2">💡 Tips for Success</h3>
          <ul className="font-crayon text-sm text-blue-600 space-y-1">
            <li>• Keep routines consistent every day</li>
            <li>• Use visual cues alongside this checklist</li>
            <li>• Celebrate completed routines!</li>
            <li>• Build a streak for motivation</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default DailyRoutines;
