// FirstThen.jsx - Visual First/Then board for task sequencing
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, RotateCcw, ChevronRight, Sparkles } from 'lucide-react';

// Activity options with emojis
const ACTIVITIES = [
  // Tasks/Work
  { id: 'homework', emoji: '📚', label: 'Homework', category: 'task' },
  { id: 'clean', emoji: '🧹', label: 'Clean Up', category: 'task' },
  { id: 'brush-teeth', emoji: '🪥', label: 'Brush Teeth', category: 'task' },
  { id: 'get-dressed', emoji: '👕', label: 'Get Dressed', category: 'task' },
  { id: 'eat', emoji: '🍽️', label: 'Eat Food', category: 'task' },
  { id: 'bath', emoji: '🛁', label: 'Take Bath', category: 'task' },
  { id: 'shoes', emoji: '👟', label: 'Put On Shoes', category: 'task' },
  { id: 'wash-hands', emoji: '🧼', label: 'Wash Hands', category: 'task' },
  
  // Rewards/Fun
  { id: 'play', emoji: '🎮', label: 'Play Game', category: 'reward' },
  { id: 'tv', emoji: '📺', label: 'Watch TV', category: 'reward' },
  { id: 'tablet', emoji: '📱', label: 'Tablet Time', category: 'reward' },
  { id: 'outside', emoji: '🌳', label: 'Go Outside', category: 'reward' },
  { id: 'snack', emoji: '🍪', label: 'Have Snack', category: 'reward' },
  { id: 'toy', emoji: '🧸', label: 'Play Toys', category: 'reward' },
  { id: 'music', emoji: '🎵', label: 'Listen Music', category: 'reward' },
  { id: 'draw', emoji: '🎨', label: 'Draw/Color', category: 'reward' },
  
  // Transitions
  { id: 'car', emoji: '🚗', label: 'Go in Car', category: 'transition' },
  { id: 'school', emoji: '🏫', label: 'Go to School', category: 'transition' },
  { id: 'store', emoji: '🛒', label: 'Go Shopping', category: 'transition' },
  { id: 'bed', emoji: '🛏️', label: 'Go to Bed', category: 'transition' },
  { id: 'therapy', emoji: '🗣️', label: 'Therapy', category: 'transition' },
  { id: 'doctor', emoji: '🏥', label: 'Doctor Visit', category: 'transition' },
];

const STORAGE_KEY = 'snw_firstthen';

const FirstThen = () => {
  const navigate = useNavigate();
  const [firstActivity, setFirstActivity] = useState(null);
  const [thenActivity, setThenActivity] = useState(null);
  const [firstComplete, setFirstComplete] = useState(false);
  const [thenComplete, setThenComplete] = useState(false);
  const [selectingFor, setSelectingFor] = useState(null); // 'first' or 'then'
  const [showCelebration, setShowCelebration] = useState(false);

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.firstId) {
          setFirstActivity(ACTIVITIES.find(a => a.id === data.firstId));
        }
        if (data.thenId) {
          setThenActivity(ACTIVITIES.find(a => a.id === data.thenId));
        }
        setFirstComplete(data.firstComplete || false);
        setThenComplete(data.thenComplete || false);
      } catch (e) {
        console.error('Error loading state:', e);
      }
    }
  }, []);

  // Save state
  useEffect(() => {
    const data = {
      firstId: firstActivity?.id,
      thenId: thenActivity?.id,
      firstComplete,
      thenComplete,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [firstActivity, thenActivity, firstComplete, thenComplete]);

  // Select activity
  const selectActivity = (activity) => {
    if (selectingFor === 'first') {
      setFirstActivity(activity);
      setFirstComplete(false);
    } else if (selectingFor === 'then') {
      setThenActivity(activity);
      setThenComplete(false);
    }
    setSelectingFor(null);
  };

  // Complete first activity
  const completeFirst = () => {
    setFirstComplete(true);
  };

  // Complete then activity (celebration!)
  const completeThen = () => {
    setThenComplete(true);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  // Reset board
  const resetBoard = () => {
    setFirstComplete(false);
    setThenComplete(false);
  };

  // Clear board completely
  const clearBoard = () => {
    setFirstActivity(null);
    setThenActivity(null);
    setFirstComplete(false);
    setThenComplete(false);
  };

  // Activity picker view
  if (selectingFor) {
    const tasks = ACTIVITIES.filter(a => a.category === 'task');
    const rewards = ACTIVITIES.filter(a => a.category === 'reward');
    const transitions = ACTIVITIES.filter(a => a.category === 'transition');

    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSelectingFor(null)}
              className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#5CB85C] 
                         rounded-full font-crayon text-[#5CB85C] hover:bg-[#5CB85C] 
                         hover:text-white transition-all shadow-sm text-sm"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-display text-[#5CB85C] crayon-text">
                Pick {selectingFor === 'first' ? 'FIRST' : 'THEN'} Activity
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Tasks */}
          <div className="mb-6">
            <h2 className="font-display text-gray-700 mb-3 flex items-center gap-2">
              📋 Tasks
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {tasks.map(activity => (
                <button
                  key={activity.id}
                  onClick={() => selectActivity(activity)}
                  className="p-3 bg-blue-50 rounded-xl border-3 border-blue-300 
                           hover:border-blue-500 hover:scale-105 transition-all"
                >
                  <span className="text-3xl block">{activity.emoji}</span>
                  <span className="text-xs font-crayon text-gray-600 mt-1 block">
                    {activity.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Rewards */}
          <div className="mb-6">
            <h2 className="font-display text-gray-700 mb-3 flex items-center gap-2">
              ⭐ Rewards
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {rewards.map(activity => (
                <button
                  key={activity.id}
                  onClick={() => selectActivity(activity)}
                  className="p-3 bg-green-50 rounded-xl border-3 border-green-300 
                           hover:border-green-500 hover:scale-105 transition-all"
                >
                  <span className="text-3xl block">{activity.emoji}</span>
                  <span className="text-xs font-crayon text-gray-600 mt-1 block">
                    {activity.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Transitions */}
          <div>
            <h2 className="font-display text-gray-700 mb-3 flex items-center gap-2">
              🚗 Transitions
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {transitions.map(activity => (
                <button
                  key={activity.id}
                  onClick={() => selectActivity(activity)}
                  className="p-3 bg-purple-50 rounded-xl border-3 border-purple-300 
                           hover:border-purple-500 hover:scale-105 transition-all"
                >
                  <span className="text-3xl block">{activity.emoji}</span>
                  <span className="text-xs font-crayon text-gray-600 mt-1 block">
                    {activity.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Main First/Then board view
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 text-center animate-bounce">
            <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-display text-green-600 mb-2">
              ALL DONE! 🎉
            </h2>
            <p className="font-crayon text-gray-600">Great job!</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/tools')}
            className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#5CB85C] 
                       rounded-full font-crayon text-[#5CB85C] hover:bg-[#5CB85C] 
                       hover:text-white transition-all shadow-sm text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#5CB85C] crayon-text">
              1️⃣ First / Then
            </h1>
          </div>
          <button
            onClick={resetBoard}
            className="p-2 bg-white border-3 border-gray-300 rounded-full hover:border-gray-400"
            title="Reset progress"
          >
            <RotateCcw size={18} className="text-gray-600" />
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* First/Then Board */}
        <div className="flex items-center gap-4">
          {/* FIRST Card */}
          <div className="flex-1">
            <div className={`
              rounded-3xl border-4 p-4 text-center transition-all
              ${firstComplete 
                ? 'bg-green-100 border-green-500' 
                : 'bg-blue-50 border-blue-400'
              }
            `}>
              {/* Header */}
              <div className={`
                py-2 px-4 rounded-xl mb-4 inline-block
                ${firstComplete ? 'bg-green-500' : 'bg-blue-500'}
              `}>
                <span className="font-display text-white text-lg">FIRST</span>
              </div>

              {/* Activity */}
              {firstActivity ? (
                <button
                  onClick={() => !firstComplete && setSelectingFor('first')}
                  className="w-full"
                >
                  <span className={`text-7xl block mb-2 ${firstComplete ? 'opacity-50' : ''}`}>
                    {firstActivity.emoji}
                  </span>
                  <span className={`font-crayon text-gray-700 ${firstComplete ? 'line-through opacity-50' : ''}`}>
                    {firstActivity.label}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setSelectingFor('first')}
                  className="w-full py-8 border-3 border-dashed border-blue-300 rounded-xl
                           hover:border-blue-500 hover:bg-blue-100/50 transition-all"
                >
                  <span className="text-4xl block mb-2">➕</span>
                  <span className="font-crayon text-blue-600">Tap to add</span>
                </button>
              )}

              {/* Complete button */}
              {firstActivity && !firstComplete && (
                <button
                  onClick={completeFirst}
                  className="mt-4 w-full py-3 bg-green-500 text-white rounded-xl border-3 border-green-600
                           font-crayon hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Done!
                </button>
              )}

              {/* Completed indicator */}
              {firstComplete && (
                <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
                  <Check size={24} className="bg-green-500 text-white rounded-full p-1" />
                  <span className="font-crayon">Complete!</span>
                </div>
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0">
            <ChevronRight 
              size={48} 
              className={`${firstComplete ? 'text-green-500 animate-pulse' : 'text-gray-300'}`}
            />
          </div>

          {/* THEN Card */}
          <div className="flex-1">
            <div className={`
              rounded-3xl border-4 p-4 text-center transition-all
              ${thenComplete 
                ? 'bg-green-100 border-green-500' 
                : firstComplete 
                  ? 'bg-yellow-50 border-yellow-400 animate-pulse' 
                  : 'bg-gray-100 border-gray-300'
              }
            `}>
              {/* Header */}
              <div className={`
                py-2 px-4 rounded-xl mb-4 inline-block
                ${thenComplete 
                  ? 'bg-green-500' 
                  : firstComplete 
                    ? 'bg-yellow-500' 
                    : 'bg-gray-400'
                }
              `}>
                <span className="font-display text-white text-lg">THEN</span>
              </div>

              {/* Activity */}
              {thenActivity ? (
                <button
                  onClick={() => !thenComplete && setSelectingFor('then')}
                  className="w-full"
                >
                  <span className={`text-7xl block mb-2 ${!firstComplete ? 'grayscale opacity-50' : ''} ${thenComplete ? 'opacity-50' : ''}`}>
                    {thenActivity.emoji}
                  </span>
                  <span className={`font-crayon text-gray-700 ${thenComplete ? 'line-through opacity-50' : ''}`}>
                    {thenActivity.label}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setSelectingFor('then')}
                  className="w-full py-8 border-3 border-dashed border-gray-300 rounded-xl
                           hover:border-gray-400 hover:bg-gray-100/50 transition-all"
                >
                  <span className="text-4xl block mb-2">➕</span>
                  <span className="font-crayon text-gray-500">Tap to add</span>
                </button>
              )}

              {/* Complete button - only when first is done */}
              {thenActivity && firstComplete && !thenComplete && (
                <button
                  onClick={completeThen}
                  className="mt-4 w-full py-3 bg-yellow-500 text-white rounded-xl border-3 border-yellow-600
                           font-crayon hover:scale-105 transition-transform flex items-center justify-center gap-2
                           animate-pulse"
                >
                  <Check size={20} />
                  Done!
                </button>
              )}

              {/* Completed indicator */}
              {thenComplete && (
                <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
                  <Check size={24} className="bg-green-500 text-white rounded-full p-1" />
                  <span className="font-crayon">Complete!</span>
                </div>
              )}

              {/* Locked indicator */}
              {!firstComplete && thenActivity && (
                <p className="mt-4 text-gray-400 font-crayon text-sm">
                  🔒 Finish FIRST first!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Clear button */}
        <div className="mt-8 text-center">
          <button
            onClick={clearBoard}
            className="px-6 py-2 bg-gray-200 text-gray-600 rounded-xl border-3 border-gray-300
                     font-crayon hover:bg-gray-300 transition-colors text-sm"
          >
            Clear & Start New
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-white rounded-2xl border-3 border-[#87CEEB]">
          <p className="text-gray-600 font-crayon text-sm text-center">
            💡 <strong>FIRST</strong> we do the task, <strong>THEN</strong> we get the reward!
          </p>
        </div>
      </main>
    </div>
  );
};

export default FirstThen;
