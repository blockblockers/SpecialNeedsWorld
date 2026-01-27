// WorryJar.jsx - A place to put worries away
// Visual metaphor for managing anxious thoughts

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, X, Sparkles, Heart } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

const STORAGE_KEY = 'snw_worry_jar';

// Jar colors
const JAR_COLORS = [
  { id: 'blue', color: '#4A9FD4', name: 'Calm Blue' },
  { id: 'purple', color: '#8E6BBF', name: 'Peaceful Purple' },
  { id: 'teal', color: '#20B2AA', name: 'Tranquil Teal' },
  { id: 'pink', color: '#E86B9A', name: 'Loving Pink' },
];

// Encouraging messages when adding worries
const ENCOURAGEMENT = [
  "It's okay to feel worried. You're putting it in a safe place! 💙",
  "You're so brave for sharing your worry! 🌟",
  "The jar will keep this worry safe. You don't have to carry it! 🫙",
  "Great job! Let the jar hold this for you. 💜",
  "Worries feel lighter when we put them somewhere safe! ✨",
];

// Messages when releasing worries
const RELEASE_MESSAGES = [
  "Goodbye worry! You're free now! 🦋",
  "Letting go feels good! 🌈",
  "You're so strong for releasing this worry! 💪",
  "Watch it float away... 🎈",
  "Making room for happy thoughts! ☀️",
];

const WorryJar = () => {
  const navigate = useNavigate();
  const [worries, setWorries] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWorry, setNewWorry] = useState('');
  const [jarColor, setJarColor] = useState(JAR_COLORS[0]);
  const [message, setMessage] = useState(null);
  const [releasingWorry, setReleasingWorry] = useState(null);

  // Load worries from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setWorries(data.worries || []);
        if (data.jarColor) {
          const savedColor = JAR_COLORS.find(c => c.id === data.jarColor);
          if (savedColor) setJarColor(savedColor);
        }
      }
    } catch (e) {
      console.error('Error loading worries:', e);
    }
  }, []);

  // Save worries to localStorage
  const saveWorries = (newWorries) => {
    setWorries(newWorries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      worries: newWorries,
      jarColor: jarColor.id,
    }));
  };

  // Add a new worry
  const addWorry = () => {
    if (!newWorry.trim()) return;

    const worry = {
      id: Date.now().toString(),
      text: newWorry.trim(),
      createdAt: new Date().toISOString(),
    };

    saveWorries([...worries, worry]);
    setNewWorry('');
    setShowAddModal(false);
    
    // Show encouragement
    const randomMessage = ENCOURAGEMENT[Math.floor(Math.random() * ENCOURAGEMENT.length)];
    setMessage(randomMessage);
    setTimeout(() => setMessage(null), 3000);
  };

  // Release a worry (delete with animation)
  const releaseWorry = (worryId) => {
    setReleasingWorry(worryId);
    
    // Show release message
    const randomMessage = RELEASE_MESSAGES[Math.floor(Math.random() * RELEASE_MESSAGES.length)];
    setMessage(randomMessage);
    
    // Remove after animation
    setTimeout(() => {
      saveWorries(worries.filter(w => w.id !== worryId));
      setReleasingWorry(null);
      setTimeout(() => setMessage(null), 2000);
    }, 1000);
  };

  // Change jar color
  const changeJarColor = (color) => {
    setJarColor(color);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      worries,
      jarColor: color.id,
    }));
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5] relative">
      <AnimatedBackground intensity="light" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E63B2E]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/wellness')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E63B2E] 
                       rounded-xl font-display font-bold text-[#E63B2E] hover:bg-[#E63B2E] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#E63B2E] crayon-text">
              🫙 Worry Jar
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        
        {/* Message Toast */}
        {message && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white px-6 py-4 rounded-2xl 
                         shadow-lg border-4 border-[#20B2AA] animate-bounce-soft max-w-xs text-center">
            <p className="font-crayon text-gray-700">{message}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center mb-6">
          <p className="font-crayon text-gray-600 mb-2">
            Put your worries in the jar. They'll be safe here! 💙
          </p>
          <p className="font-crayon text-sm text-gray-500">
            Tap a worry to let it go when you're ready.
          </p>
        </div>

        {/* Jar Color Picker */}
        <div className="flex justify-center gap-3 mb-6">
          {JAR_COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => changeJarColor(color)}
              className={`w-10 h-10 rounded-full border-4 transition-all ${
                jarColor.id === color.id ? 'scale-125 border-white shadow-lg' : 'border-transparent'
              }`}
              style={{ backgroundColor: color.color }}
              title={color.name}
            />
          ))}
        </div>

        {/* The Jar */}
        <div className="relative mx-auto w-64 mb-6">
          {/* Jar Body */}
          <div 
            className="relative rounded-b-[40%] rounded-t-lg overflow-hidden min-h-[300px] border-4"
            style={{ 
              backgroundColor: `${jarColor.color}15`,
              borderColor: jarColor.color,
            }}
          >
            {/* Jar Neck */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 -mt-2 rounded-t-lg border-4 border-b-0"
              style={{ 
                backgroundColor: `${jarColor.color}30`,
                borderColor: jarColor.color,
              }}
            />

            {/* Worries inside jar */}
            <div className="p-4 pt-8 space-y-2">
              {worries.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-crayon text-gray-400">
                    Your jar is empty!<br />
                    Add a worry to get started.
                  </p>
                </div>
              ) : (
                worries.map((worry) => (
                  <button
                    key={worry.id}
                    onClick={() => releaseWorry(worry.id)}
                    className={`w-full p-3 rounded-xl text-left font-crayon text-sm transition-all
                             hover:scale-105 active:scale-95 ${
                      releasingWorry === worry.id 
                        ? 'animate-ping opacity-0' 
                        : ''
                    }`}
                    style={{ 
                      backgroundColor: `${jarColor.color}40`,
                      border: `2px solid ${jarColor.color}`,
                    }}
                  >
                    <span className="text-gray-700">{worry.text}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Jar Shine Effect */}
          <div 
            className="absolute top-8 left-4 w-4 h-20 rounded-full opacity-30"
            style={{ backgroundColor: 'white' }}
          />
        </div>

        {/* Add Worry Button */}
        <div className="text-center">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-8 py-4 rounded-2xl font-display text-white text-lg
                     shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: jarColor.color }}
          >
            <Plus size={20} className="inline mr-2" />
            Add a Worry
          </button>
        </div>

        {/* Stats */}
        {worries.length > 0 && (
          <div className="mt-8 text-center">
            <p className="font-crayon text-gray-500 text-sm">
              {worries.length} {worries.length === 1 ? 'worry' : 'worries'} in your jar
            </p>
            <p className="font-crayon text-gray-400 text-xs mt-1">
              Tap any worry to let it go 🦋
            </p>
          </div>
        )}

        {/* Helpful Tips */}
        <div className="mt-8 bg-white rounded-2xl border-4 border-gray-200 p-4">
          <h3 className="font-display text-gray-700 mb-2 flex items-center gap-2">
            <Heart size={18} className="text-pink-400" />
            Tips for Worries
          </h3>
          <ul className="space-y-2 font-crayon text-sm text-gray-600">
            <li>• It's okay to feel worried - everyone does sometimes!</li>
            <li>• Writing worries down can help them feel smaller</li>
            <li>• You can come back and release them when you're ready</li>
            <li>• Take a deep breath - you're doing great! 💙</li>
          </ul>
        </div>
      </main>

      {/* Add Worry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl border-4 max-w-md w-full p-6" style={{ borderColor: jarColor.color }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl" style={{ color: jarColor.color }}>
                🫙 Add a Worry
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewWorry('');
                }}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <p className="font-crayon text-gray-600 mb-4">
              What's worrying you? Write it here and put it in the jar.
            </p>

            <textarea
              value={newWorry}
              onChange={(e) => setNewWorry(e.target.value)}
              placeholder="Type your worry here..."
              className="w-full p-4 rounded-xl border-3 font-crayon resize-none focus:outline-none"
              style={{ borderColor: jarColor.color }}
              rows={4}
              autoFocus
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewWorry('');
                }}
                className="flex-1 py-3 rounded-xl font-display border-3 border-gray-300 
                         text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={addWorry}
                disabled={!newWorry.trim()}
                className="flex-1 py-3 rounded-xl font-display text-white
                         transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: jarColor.color }}
              >
                Put in Jar 🫙
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorryJar;
