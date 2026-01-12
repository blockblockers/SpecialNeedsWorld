// Counter.jsx - Simple counter for tracking behaviors, tasks, or anything
// Multiple counters with customizable names and colors

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  RotateCcw, 
  Trash2, 
  Edit2,
  X,
  Check,
  Sparkles
} from 'lucide-react';

const STORAGE_KEY = 'snw_counters';

// Preset counter templates
const PRESETS = [
  { name: 'Good Choices', emoji: '⭐', color: 'yellow' },
  { name: 'Stickers Earned', emoji: '🌟', color: 'purple' },
  { name: 'Tasks Done', emoji: '✅', color: 'green' },
  { name: 'Points', emoji: '🎯', color: 'blue' },
  { name: 'Steps', emoji: '👣', color: 'orange' },
  { name: 'Drinks', emoji: '💧', color: 'cyan' },
  { name: 'Snacks', emoji: '🍎', color: 'red' },
  { name: 'Hugs', emoji: '🤗', color: 'pink' },
];

const COLORS = {
  yellow: { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-700', button: 'bg-yellow-400' },
  purple: { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-700', button: 'bg-purple-400' },
  green: { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-700', button: 'bg-green-400' },
  blue: { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-700', button: 'bg-blue-400' },
  orange: { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-700', button: 'bg-orange-400' },
  cyan: { bg: 'bg-cyan-100', border: 'border-cyan-400', text: 'text-cyan-700', button: 'bg-cyan-400' },
  red: { bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-700', button: 'bg-red-400' },
  pink: { bg: 'bg-pink-100', border: 'border-pink-400', text: 'text-pink-700', button: 'bg-pink-400' },
};

const Counter = () => {
  const navigate = useNavigate();
  const [counters, setCounters] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newCounter, setNewCounter] = useState({ name: '', emoji: '⭐', color: 'yellow' });
  const [celebration, setCelebration] = useState(null);

  // Load counters
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCounters(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading counters:', e);
      }
    }
  }, []);

  // Save counters
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counters));
  }, [counters]);

  // Add counter
  const addCounter = () => {
    if (!newCounter.name.trim()) return;
    
    const counter = {
      id: Date.now().toString(),
      name: newCounter.name.trim(),
      emoji: newCounter.emoji,
      color: newCounter.color,
      count: 0,
      goal: null,
      createdAt: new Date().toISOString(),
    };
    
    setCounters([...counters, counter]);
    setNewCounter({ name: '', emoji: '⭐', color: 'yellow' });
    setShowAddForm(false);
  };

  // Add from preset
  const addFromPreset = (preset) => {
    const counter = {
      id: Date.now().toString(),
      name: preset.name,
      emoji: preset.emoji,
      color: preset.color,
      count: 0,
      goal: null,
      createdAt: new Date().toISOString(),
    };
    
    setCounters([...counters, counter]);
  };

  // Update count
  const updateCount = (id, delta) => {
    setCounters(counters.map(c => {
      if (c.id === id) {
        const newCount = Math.max(0, c.count + delta);
        
        // Celebration for milestones
        if (delta > 0 && (newCount === 10 || newCount === 25 || newCount === 50 || newCount === 100)) {
          setCelebration({ id, count: newCount });
          setTimeout(() => setCelebration(null), 2000);
        }
        
        return { ...c, count: newCount };
      }
      return c;
    }));
  };

  // Reset counter
  const resetCounter = (id) => {
    if (!confirm('Reset this counter to 0?')) return;
    setCounters(counters.map(c => 
      c.id === id ? { ...c, count: 0 } : c
    ));
  };

  // Delete counter
  const deleteCounter = (id) => {
    if (!confirm('Delete this counter?')) return;
    setCounters(counters.filter(c => c.id !== id));
  };

  // Get color classes
  const getColors = (colorName) => COLORS[colorName] || COLORS.yellow;

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/tools')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F5A623] 
                       rounded-xl font-display font-bold text-[#F5A623] hover:bg-[#F5A623] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-display text-[#F5A623] crayon-text">
              🔢 Counter
            </h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="p-2 bg-[#5CB85C] text-white rounded-full border-3 border-green-600
                       hover:scale-110 transition-transform shadow-sm"
          >
            <Plus size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Add Form */}
        {showAddForm && (
          <div className="mb-6 bg-white rounded-2xl border-4 border-[#F5A623] p-4 shadow-crayon">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-lg text-[#F5A623]">New Counter</h2>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="mb-4">
              <label className="block font-crayon text-sm text-gray-600 mb-2">Quick Add:</label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      addFromPreset(preset);
                      setShowAddForm(false);
                    }}
                    className={`px-3 py-1.5 rounded-full border-2 font-crayon text-sm
                              ${COLORS[preset.color].bg} ${COLORS[preset.color].border}
                              hover:scale-105 transition-transform`}
                  >
                    {preset.emoji} {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <label className="block font-crayon text-sm text-gray-600 mb-2">Or create custom:</label>
              
              <input
                type="text"
                value={newCounter.name}
                onChange={(e) => setNewCounter({ ...newCounter, name: e.target.value })}
                placeholder="Counter name..."
                className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon mb-3
                         focus:border-[#F5A623] focus:outline-none"
              />

              {/* Emoji Selection */}
              <div className="mb-3">
                <label className="block font-crayon text-sm text-gray-600 mb-1">Emoji:</label>
                <div className="flex flex-wrap gap-2">
                  {['⭐', '🌟', '✅', '🎯', '💎', '🏆', '🎉', '❤️', '👍', '🔥'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setNewCounter({ ...newCounter, emoji })}
                      className={`w-10 h-10 text-xl rounded-lg border-2 transition-all
                        ${newCounter.emoji === emoji 
                          ? 'border-[#F5A623] bg-yellow-50 scale-110' 
                          : 'border-gray-200 hover:border-gray-400'
                        }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-4">
                <label className="block font-crayon text-sm text-gray-600 mb-1">Color:</label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(COLORS).map(color => (
                    <button
                      key={color}
                      onClick={() => setNewCounter({ ...newCounter, color })}
                      className={`w-8 h-8 rounded-full border-3 transition-all
                        ${COLORS[color].button}
                        ${newCounter.color === color 
                          ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' 
                          : 'opacity-70 hover:opacity-100'
                        }`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={addCounter}
                disabled={!newCounter.name.trim()}
                className="w-full py-3 bg-[#5CB85C] text-white rounded-xl border-3 border-green-600
                         font-crayon text-lg hover:scale-[1.02] transition-transform 
                         flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Check size={20} />
                Create Counter
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {counters.length === 0 && !showAddForm && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔢</div>
            <h2 className="font-display text-xl text-gray-500 mb-2">No Counters Yet</h2>
            <p className="font-crayon text-gray-400 mb-4">
              Create counters to track behaviors, rewards, or anything!
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-[#F5A623] text-white rounded-xl border-3 border-orange-600
                       font-crayon hover:scale-105 transition-transform"
            >
              <Plus size={20} className="inline mr-2" />
              Add First Counter
            </button>
          </div>
        )}

        {/* Counter Grid */}
        <div className="grid gap-4">
          {counters.map(counter => {
            const colors = getColors(counter.color);
            const isCelebrating = celebration?.id === counter.id;
            
            return (
              <div
                key={counter.id}
                className={`relative rounded-2xl border-4 ${colors.border} ${colors.bg} p-4 
                           shadow-crayon transition-all ${isCelebrating ? 'animate-bounce' : ''}`}
              >
                {/* Celebration Overlay */}
                {isCelebrating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl z-10">
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 text-yellow-500 mx-auto animate-spin" />
                      <p className="font-display text-2xl text-yellow-600 mt-2">
                        🎉 {celebration.count}! 🎉
                      </p>
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{counter.emoji}</span>
                    <h3 className={`font-display text-lg ${colors.text}`}>{counter.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => resetCounter(counter.id)}
                      className="p-1.5 text-gray-400 hover:text-orange-500 rounded-lg hover:bg-white/50"
                      title="Reset"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button
                      onClick={() => deleteCounter(counter.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white/50"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Count Display and Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => updateCount(counter.id, -1)}
                    disabled={counter.count === 0}
                    className={`w-14 h-14 rounded-full ${colors.button} text-white 
                               flex items-center justify-center text-2xl font-bold
                               hover:scale-110 active:scale-95 transition-transform
                               disabled:opacity-30 disabled:hover:scale-100
                               border-3 border-white/50 shadow-lg`}
                  >
                    <Minus size={28} />
                  </button>

                  <div className="w-28 text-center">
                    <span className={`text-5xl font-display ${colors.text}`}>
                      {counter.count}
                    </span>
                  </div>

                  <button
                    onClick={() => updateCount(counter.id, 1)}
                    className={`w-14 h-14 rounded-full ${colors.button} text-white 
                               flex items-center justify-center text-2xl font-bold
                               hover:scale-110 active:scale-95 transition-transform
                               border-3 border-white/50 shadow-lg`}
                  >
                    <Plus size={28} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips */}
        {counters.length > 0 && (
          <div className="mt-6 p-4 bg-purple-50 rounded-2xl border-3 border-purple-200">
            <h3 className="font-display text-purple-700 mb-2">💡 Tips</h3>
            <ul className="font-crayon text-sm text-purple-600 space-y-1">
              <li>• Use counters for reward systems</li>
              <li>• Track daily tasks or behaviors</li>
              <li>• Celebrate milestones at 10, 25, 50, 100!</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default Counter;
