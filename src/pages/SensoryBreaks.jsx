// SensoryBreaks.jsx - Sensory break activities for self-regulation
// NAVIGATION: Back button goes to /wellness (parent hub)
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Home,
  BarChart3,
  Clock,
  Star,
  Check,
  X
} from 'lucide-react';

const STORAGE_KEY = 'snw_sensory_breaks';

// Sensory break activities organized by type
const SENSORY_ACTIVITIES = {
  movement: {
    name: 'Movement',
    emoji: '🏃',
    color: '#E63B2E',
    description: 'Big body movements to release energy',
    activities: [
      { id: 'trampoline', name: 'Trampoline Jumps', emoji: '🦘', duration: 120, description: 'Jump on trampoline or bed' },
      { id: 'jumping-jacks', name: 'Jumping Jacks', emoji: '⭐', duration: 60, description: 'Do jumping jacks' },
      { id: 'running', name: 'Run in Place', emoji: '🏃', duration: 60, description: 'Run as fast as you can!' },
      { id: 'dance', name: 'Dance Break', emoji: '💃', duration: 120, description: 'Dance to your favorite song' },
      { id: 'animal-walks', name: 'Animal Walks', emoji: '🐻', duration: 90, description: 'Walk like different animals' },
    ]
  },
  proprioceptive: {
    name: 'Heavy Work',
    emoji: '💪',
    color: '#8E6BBF',
    description: 'Deep pressure and pushing/pulling',
    activities: [
      { id: 'crash-pad', name: 'Crash into Pad', emoji: '🛋️', duration: 60, description: 'Safely crash into pillows' },
      { id: 'wall-push', name: 'Wall Push-Ups', emoji: '🧱', duration: 45, description: 'Push against the wall hard' },
      { id: 'bear-hug', name: 'Bear Hug Squeeze', emoji: '🐻', duration: 30, description: 'Give yourself a tight squeeze' },
      { id: 'carry-heavy', name: 'Carry Something Heavy', emoji: '📦', duration: 60, description: 'Carry books or weighted item' },
      { id: 'push-ups', name: 'Chair Push-Ups', emoji: '🪑', duration: 45, description: 'Push up from a chair' },
    ]
  },
  vestibular: {
    name: 'Balance & Spin',
    emoji: '🎡',
    color: '#4A9FD4',
    description: 'Spinning, swinging, and balance',
    activities: [
      { id: 'exercise-ball', name: 'Bounce on Ball', emoji: '🏐', duration: 120, description: 'Bounce on exercise ball' },
      { id: 'spin', name: 'Spin Around', emoji: '🌀', duration: 30, description: 'Spin slowly 5 times each way' },
      { id: 'swing', name: 'Swing Time', emoji: '🎢', duration: 180, description: 'Swing on a swing' },
      { id: 'rocking', name: 'Rock Back & Forth', emoji: '🪑', duration: 60, description: 'Rock in a chair or on floor' },
      { id: 'balance', name: 'Balance on One Foot', emoji: '🦩', duration: 30, description: 'Stand on one foot' },
    ]
  },
  calming: {
    name: 'Calm Down',
    emoji: '😌',
    color: '#5CB85C',
    description: 'Quiet activities to self-regulate',
    activities: [
      { id: 'deep-breathing', name: 'Deep Breaths', emoji: '🌬️', duration: 60, description: 'Take 5 deep breaths' },
      { id: 'squeeze-ball', name: 'Squeeze Ball', emoji: '🎾', duration: 60, description: 'Squeeze a stress ball' },
      { id: 'quiet-corner', name: 'Quiet Corner', emoji: '🏠', duration: 180, description: 'Sit in a cozy spot' },
      { id: 'fidget', name: 'Fidget Time', emoji: '🧩', duration: 120, description: 'Play with a fidget toy' },
      { id: 'weighted-lap', name: 'Weighted Blanket', emoji: '🛏️', duration: 180, description: 'Use a weighted blanket' },
    ]
  },
};

// Timer display component
const Timer = ({ seconds, isRunning, onToggle, onReset, color }) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="text-5xl font-display text-white py-6 px-10 rounded-2xl shadow-lg"
        style={{ backgroundColor: color }}
      >
        {mins}:{secs.toString().padStart(2, '0')}
      </div>
      <div className="flex gap-3">
        <button
          onClick={onToggle}
          className={`px-6 py-3 rounded-xl font-display text-white flex items-center gap-2 ${
            isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={onReset}
          className="px-4 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
};

// Activity Card
const ActivityCard = ({ activity, categoryColor, onSelect, isSelected }) => (
  <button
    onClick={() => onSelect(activity)}
    className={`w-full p-3 rounded-xl text-left transition-all flex items-center gap-3 ${
      isSelected 
        ? 'bg-white shadow-lg scale-[1.02]' 
        : 'bg-white/50 hover:bg-white hover:shadow-md'
    }`}
    style={{ 
      border: isSelected ? `3px solid ${categoryColor}` : '2px solid transparent' 
    }}
  >
    <span className="text-2xl">{activity.emoji}</span>
    <div className="flex-1">
      <h4 className="font-display text-gray-800">{activity.name}</h4>
      <p className="text-xs text-gray-500 font-crayon">{activity.description}</p>
    </div>
    <div className="flex items-center gap-1 text-xs text-gray-400">
      <Clock size={12} />
      {Math.floor(activity.duration / 60)}:{(activity.duration % 60).toString().padStart(2, '0')}
    </div>
  </button>
);

const SensoryBreaks = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [breakHistory, setBreakHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBreakHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Save completed break
      if (selectedActivity) {
        const newHistory = [...breakHistory, {
          activity: selectedActivity.name,
          category: selectedCategory,
          duration: selectedActivity.duration,
          timestamp: new Date().toISOString(),
        }].slice(-50);
        setBreakHistory(newHistory);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, selectedActivity, selectedCategory, breakHistory]);

  const startActivity = (activity) => {
    setSelectedActivity(activity);
    setTimerSeconds(activity.duration);
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    if (selectedActivity) {
      setTimerSeconds(selectedActivity.duration);
      setIsTimerRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* IMPORTANT: Back button goes to /wellness (parent hub) */}
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
            <h1 className="text-lg sm:text-xl font-display text-[#8E6BBF] crayon-text">
              🧘 Sensory Breaks
            </h1>
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="p-2 bg-white border-3 border-purple-400 rounded-full hover:bg-purple-50"
          >
            <BarChart3 size={18} className="text-purple-500" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Category Selection */}
        {!selectedCategory ? (
          <>
            <p className="text-center font-crayon text-gray-600 mb-4">
              What kind of break do you need?
            </p>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(SENSORY_ACTIVITIES).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className="p-6 rounded-2xl text-white text-center transition-all hover:scale-105 shadow-lg"
                  style={{ backgroundColor: category.color }}
                >
                  <span className="text-4xl block mb-2">{category.emoji}</span>
                  <h3 className="font-display text-lg">{category.name}</h3>
                  <p className="text-xs opacity-90 font-crayon mt-1">{category.description}</p>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {/* Back to categories */}
            <button
              onClick={() => { setSelectedCategory(null); setSelectedActivity(null); }}
              className="text-sm font-crayon text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              ← Choose different type
            </button>

            {/* Selected Activity Timer */}
            {selectedActivity && (
              <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: `${SENSORY_ACTIVITIES[selectedCategory].color}20` }}>
                <h3 className="font-display text-xl mb-2" style={{ color: SENSORY_ACTIVITIES[selectedCategory].color }}>
                  {selectedActivity.emoji} {selectedActivity.name}
                </h3>
                <Timer
                  seconds={timerSeconds}
                  isRunning={isTimerRunning}
                  onToggle={() => setIsTimerRunning(!isTimerRunning)}
                  onReset={resetTimer}
                  color={SENSORY_ACTIVITIES[selectedCategory].color}
                />
              </div>
            )}

            {/* Activity list */}
            <div 
              className="p-4 rounded-2xl space-y-3"
              style={{ backgroundColor: `${SENSORY_ACTIVITIES[selectedCategory].color}10` }}
            >
              <div className="flex items-center gap-2">
                <span className="text-3xl">{SENSORY_ACTIVITIES[selectedCategory].emoji}</span>
                <div>
                  <h2 className="font-display text-xl" style={{ color: SENSORY_ACTIVITIES[selectedCategory].color }}>
                    {SENSORY_ACTIVITIES[selectedCategory].name}
                  </h2>
                  <p className="text-sm text-gray-600 font-crayon">
                    {SENSORY_ACTIVITIES[selectedCategory].description}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-600 font-crayon text-sm">
                Pick an activity to start your break:
              </p>
              
              <div className="grid grid-cols-1 gap-2">
                {SENSORY_ACTIVITIES[selectedCategory].activities.map(activity => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    categoryColor={SENSORY_ACTIVITIES[selectedCategory].color}
                    onSelect={startActivity}
                    isSelected={selectedActivity?.id === activity.id}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-display text-xl text-[#8E6BBF]">Break History</h2>
              <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {breakHistory.length === 0 ? (
                <p className="text-center text-gray-500 font-crayon">No breaks recorded yet!</p>
              ) : (
                <div className="space-y-2">
                  {breakHistory.slice().reverse().map((entry, i) => (
                    <div key={i} className="p-3 bg-purple-50 rounded-xl">
                      <div className="font-crayon text-gray-800">{entry.activity}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SensoryBreaks;
