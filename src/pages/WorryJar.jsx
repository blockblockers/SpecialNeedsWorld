// WorryJar.jsx - A calming worry management tool
// Store worries in a virtual jar to help process emotions

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Trash2, X, Sparkles, 
  CloudRain, Sun, Heart, Volume2 
} from 'lucide-react';

// Storage key
const STORAGE_KEY = 'snw_worry_jar';

// Worry colors
const WORRY_COLORS = [
  '#E63B2E', // Red
  '#F5A623', // Orange
  '#4A9FD4', // Blue
  '#8E6BBF', // Purple
  '#E86B9A', // Pink
  '#5CB85C', // Green
];

// Calming affirmations
const AFFIRMATIONS = [
  "This feeling will pass 💜",
  "You are safe and loved 💕",
  "It's okay to feel worried 🌈",
  "Take a deep breath 🌸",
  "You are brave and strong ⭐",
  "Tomorrow is a new day 🌅",
  "You've got this! 💪",
  "Worries are just thoughts 🍃",
];

const WorryJar = () => {
  const navigate = useNavigate();
  const [worries, setWorries] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWorry, setNewWorry] = useState('');
  const [selectedColor, setSelectedColor] = useState(WORRY_COLORS[0]);
  const [releasingWorry, setReleasingWorry] = useState(null);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState('');

  // Load worries from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setWorries(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading worries:', error);
    }
  }, []);

  // Save worries to localStorage
  const saveWorries = (newWorries) => {
    setWorries(newWorries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newWorries));
  };

  // Add a new worry
  const addWorry = () => {
    if (!newWorry.trim()) return;

    const worry = {
      id: Date.now(),
      text: newWorry.trim(),
      color: selectedColor,
      createdAt: new Date().toISOString(),
    };

    saveWorries([...worries, worry]);
    setNewWorry('');
    setShowAddModal(false);
  };

  // Release a worry (with animation)
  const releaseWorry = (worry) => {
    setReleasingWorry(worry.id);
    
    // Show affirmation
    const randomAffirmation = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
    setCurrentAffirmation(randomAffirmation);
    setShowAffirmation(true);
    
    // Speak the affirmation
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(randomAffirmation.replace(/[^\w\s]/g, ''));
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }

    // Remove worry after animation
    setTimeout(() => {
      saveWorries(worries.filter(w => w.id !== worry.id));
      setReleasingWorry(null);
    }, 1000);

    // Hide affirmation
    setTimeout(() => {
      setShowAffirmation(false);
    }, 3000);
  };

  // Clear all worries
  const clearAll = () => {
    if (window.confirm('Release all worries? They will float away!')) {
      saveWorries([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F4FC] to-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#E8F4FC]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/wellness')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                       rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-display text-[#8E6BBF] flex items-center gap-2">
              🫙 Worry Jar
            </h1>
            <p className="text-sm text-gray-500 font-crayon">Release your worries</p>
          </div>
          {worries.length > 0 && (
            <button
              onClick={clearAll}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Clear all worries"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Instructions */}
        <div className="bg-white rounded-2xl border-4 border-[#8E6BBF] p-4 mb-6 shadow-lg">
          <h2 className="font-display text-[#8E6BBF] mb-2 flex items-center gap-2">
            <Sparkles size={20} />
            How It Works
          </h2>
          <ol className="text-sm text-gray-600 font-crayon space-y-1">
            <li>1. Tap the + button to add a worry</li>
            <li>2. Write what's bothering you</li>
            <li>3. Tap a worry bubble to release it</li>
            <li>4. Watch it float away! 🎈</li>
          </ol>
        </div>

        {/* Worry Jar Visual */}
        <div className="relative bg-white/50 rounded-3xl border-4 border-[#8E6BBF]/30 
                        min-h-[400px] p-4 mb-6 overflow-hidden">
          {/* Jar neck */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 
                          bg-[#8E6BBF]/20 rounded-t-xl border-x-4 border-t-4 border-[#8E6BBF]/30" />
          
          {/* Empty state */}
          {worries.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full min-h-[350px] text-center">
              <CloudRain size={64} className="text-[#8E6BBF]/30 mb-4" />
              <p className="font-crayon text-gray-500 mb-2">Your jar is empty!</p>
              <p className="text-sm text-gray-400 font-crayon">
                Add worries and release them to feel better
              </p>
            </div>
          )}

          {/* Worry bubbles */}
          <div className="flex flex-wrap gap-3 justify-center pt-10">
            {worries.map((worry) => (
              <button
                key={worry.id}
                onClick={() => releaseWorry(worry)}
                className={`
                  px-4 py-2 rounded-full text-white font-crayon text-sm
                  shadow-lg hover:scale-110 transition-all duration-300
                  max-w-[200px] truncate
                  ${releasingWorry === worry.id ? 'animate-float-away' : 'animate-gentle-float'}
                `}
                style={{ backgroundColor: worry.color }}
                title="Tap to release this worry"
              >
                {worry.text}
              </button>
            ))}
          </div>

          {/* Affirmation popup */}
          {showAffirmation && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 
                            animate-fade-in">
              <div className="text-center p-6">
                <Sun size={48} className="text-[#F5A623] mx-auto mb-3 animate-pulse" />
                <p className="text-2xl font-display text-[#8E6BBF]">{currentAffirmation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Add Worry Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-4 bg-[#8E6BBF] text-white text-lg font-display rounded-2xl
                     hover:bg-purple-600 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <Plus size={24} />
          Add a Worry
        </button>

        {/* Worry count */}
        {worries.length > 0 && (
          <p className="text-center text-gray-500 font-crayon mt-4">
            {worries.length} {worries.length === 1 ? 'worry' : 'worries'} in your jar
          </p>
        )}
      </main>

      {/* Add Worry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-[#8E6BBF] p-6 w-full max-w-md 
                          shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display text-[#8E6BBF]">Add a Worry</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <p className="text-sm text-gray-500 font-crayon mb-4">
              What's on your mind? Write it down and put it in the jar.
            </p>

            <textarea
              value={newWorry}
              onChange={(e) => setNewWorry(e.target.value)}
              placeholder="I'm worried about..."
              className="w-full p-4 border-3 border-gray-200 rounded-xl font-crayon 
                         focus:border-[#8E6BBF] focus:outline-none resize-none"
              rows={3}
              autoFocus
            />

            {/* Color picker */}
            <div className="mt-4">
              <p className="text-sm text-gray-500 font-crayon mb-2">Pick a color:</p>
              <div className="flex gap-2">
                {WORRY_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      selectedColor === color ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 border-3 border-gray-300 text-gray-600 font-display 
                           rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addWorry}
                disabled={!newWorry.trim()}
                className="flex-1 py-3 bg-[#8E6BBF] text-white font-display rounded-xl
                           hover:bg-purple-600 transition-colors disabled:opacity-50 
                           disabled:cursor-not-allowed"
              >
                Add to Jar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-gentle-float {
          animation: gentle-float 3s ease-in-out infinite;
        }
        
        @keyframes float-away {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-200px) scale(0.5); opacity: 0; }
        }
        .animate-float-away {
          animation: float-away 1s ease-out forwards;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WorryJar;
