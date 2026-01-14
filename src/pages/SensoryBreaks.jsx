import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Home,
  Calendar,
  BarChart3,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../App';

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
      { id: 'crash-pad', name: 'Crash into Pad', emoji: '🛋️', duration: 60, description: 'Safely crash into pillows or bean bag' },
      { id: 'wall-push', name: 'Wall Push-Ups', emoji: '🧱', duration: 45, description: 'Push against the wall hard' },
      { id: 'bear-hug', name: 'Bear Hug Squeeze', emoji: '🐻', duration: 30, description: 'Give yourself a tight squeeze' },
      { id: 'carry-heavy', name: 'Carry Something Heavy', emoji: '📦', duration: 60, description: 'Carry books or a weighted item' },
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
      { id: 'balance', name: 'Balance on One Foot', emoji: '🦩', duration: 30, description: 'Stand on one foot, then switch' },
    ]
  },
  calming: {
    name: 'Calm Down',
    emoji: '😌',
    color: '#5CB85C',
    description: 'Quiet activities to self-regulate',
    activities: [
      { id: 'deep-breathing', name: 'Deep Breaths', emoji: '🌬️', duration: 60, description: 'Breathe in slowly, breathe out slowly' },
      { id: 'squeeze-ball', name: 'Squeeze Stress Ball', emoji: '🟡', duration: 60, description: 'Squeeze and release a stress ball' },
      { id: 'quiet-space', name: 'Quiet Corner', emoji: '🏕️', duration: 180, description: 'Sit in a quiet, cozy spot' },
      { id: 'weighted-blanket', name: 'Weighted Blanket', emoji: '🛏️', duration: 180, description: 'Rest under weighted blanket' },
      { id: 'fidget', name: 'Fidget Tool', emoji: '🔵', duration: 120, description: 'Use a fidget spinner or cube' },
    ]
  },
  tactile: {
    name: 'Touch & Feel',
    emoji: '✋',
    color: '#F5A623',
    description: 'Exploring different textures',
    activities: [
      { id: 'playdough', name: 'Playdough Squeeze', emoji: '🎨', duration: 180, description: 'Squeeze and shape playdough' },
      { id: 'sand-rice', name: 'Sensory Bin', emoji: '🏖️', duration: 180, description: 'Play in sand, rice, or beans' },
      { id: 'water-play', name: 'Water Play', emoji: '💧', duration: 180, description: 'Play with water and cups' },
      { id: 'lotion', name: 'Hand Massage', emoji: '🧴', duration: 60, description: 'Rub lotion on hands and arms' },
      { id: 'texture-walk', name: 'Texture Walk', emoji: '🦶', duration: 90, description: 'Walk on different textures barefoot' },
    ]
  }
};

// Format seconds to MM:SS
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Get today's date as string
const getToday = () => new Date().toISOString().split('T')[0];

// ============================================
// Timer Component
// ============================================

const BreakTimer = ({ duration, onComplete, activity }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    setTimeLeft(duration);
    setIsRunning(false);
    setIsComplete(false);
  }, [duration, activity]);
  
  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            // Play completion sound
            try {
              const audioContext = new (window.AudioContext || window.webkitAudioContext)();
              const oscillator = audioContext.createOscillator();
              const gainNode = audioContext.createGain();
              oscillator.connect(gainNode);
              gainNode.connect(audioContext.destination);
              oscillator.frequency.value = 523.25; // C5
              gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
              oscillator.start(audioContext.currentTime);
              oscillator.stop(audioContext.currentTime + 0.5);
            } catch (e) {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);
  
  const progress = ((duration - timeLeft) / duration) * 100;
  
  const handleComplete = () => {
    onComplete();
    setTimeLeft(duration);
    setIsComplete(false);
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Circular Progress */}
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke={isComplete ? '#5CB85C' : '#4A9FD4'}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={553}
            strokeDashoffset={553 - (553 * progress) / 100}
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isComplete ? (
            <>
              <Check size={48} className="text-green-500 mb-1" />
              <span className="font-display text-lg text-green-600">Done!</span>
            </>
          ) : (
            <>
              <span className="text-4xl font-bold text-gray-800">{formatTime(timeLeft)}</span>
              <span className="text-sm text-gray-500 font-crayon">remaining</span>
            </>
          )}
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex gap-3">
        {isComplete ? (
          <button
            onClick={handleComplete}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-display
                     hover:bg-green-600 transition-colors shadow-lg"
          >
            <Check size={20} />
            Log Break
          </button>
        ) : (
          <>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`p-4 rounded-full text-white shadow-lg transition-colors ${
                isRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isRunning ? <Pause size={28} /> : <Play size={28} />}
            </button>
            <button
              onClick={() => { setTimeLeft(duration); setIsRunning(false); }}
              className="p-4 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 transition-colors"
            >
              <RotateCcw size={28} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================
// Activity Card Component
// ============================================

const ActivityCard = ({ activity, categoryColor, onSelect, isSelected }) => (
  <button
    onClick={() => onSelect(activity)}
    className={`p-4 rounded-xl border-3 transition-all text-left
               hover:scale-102 active:scale-98 ${
                 isSelected 
                   ? 'ring-3 ring-offset-2 border-gray-800' 
                   : 'border-transparent'
               }`}
    style={{ backgroundColor: `${categoryColor}15`, borderColor: categoryColor }}
  >
    <div className="flex items-start gap-3">
      <span className="text-3xl">{activity.emoji}</span>
      <div className="flex-1 min-w-0">
        <h4 className="font-display text-gray-800 truncate">{activity.name}</h4>
        <p className="text-xs text-gray-600 font-crayon line-clamp-2">{activity.description}</p>
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
          <Clock size={12} />
          <span>{formatTime(activity.duration)}</span>
        </div>
      </div>
    </div>
  </button>
);

// ============================================
// History View Component
// ============================================

const HistoryView = ({ breakHistory, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        day: d,
        date: dateStr,
        breaks: breakHistory[dateStr] || []
      });
    }
    return days;
  }, [currentMonth, breakHistory]);
  
  // Statistics
  const stats = useMemo(() => {
    const allBreaks = Object.values(breakHistory).flat();
    const last30Days = Object.entries(breakHistory)
      .filter(([date]) => {
        const d = new Date(date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return d >= thirtyDaysAgo;
      })
      .map(([, breaks]) => breaks)
      .flat();
    
    const totalBreaks = last30Days.length;
    const totalMinutes = Math.round(last30Days.reduce((sum, b) => sum + b.duration, 0) / 60);
    const daysWithBreaks = new Set(Object.keys(breakHistory).filter(d => {
      const date = new Date(d);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date >= thirtyDaysAgo && breakHistory[d].length > 0;
    })).size;
    
    // Most used activity
    const activityCounts = {};
    last30Days.forEach(b => {
      activityCounts[b.activityId] = (activityCounts[b.activityId] || 0) + 1;
    });
    const topActivity = Object.entries(activityCounts).sort((a, b) => b[1] - a[1])[0];
    
    return { totalBreaks, totalMinutes, daysWithBreaks, topActivity };
  }, [breakHistory]);
  
  const prevMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-[#4A9FD4] text-white p-4 flex items-center justify-between">
          <h3 className="font-display text-xl flex items-center gap-2">
            <Calendar size={24} />
            Break History
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-3 rounded-xl text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalBreaks}</div>
              <div className="text-xs text-blue-700 font-crayon">Breaks (30d)</div>
            </div>
            <div className="bg-green-50 p-3 rounded-xl text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalMinutes}</div>
              <div className="text-xs text-green-700 font-crayon">Minutes (30d)</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.daysWithBreaks}</div>
              <div className="text-xs text-purple-700 font-crayon">Days Active</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-xl text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.topActivity ? stats.topActivity[1] : 0}
              </div>
              <div className="text-xs text-orange-700 font-crayon">Top Activity Uses</div>
            </div>
          </div>
          
          {/* Calendar */}
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-3">
              <button onClick={prevMonth} className="p-1 hover:bg-gray-200 rounded">
                <ChevronLeft size={20} />
              </button>
              <span className="font-display">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={nextMonth} className="p-1 hover:bg-gray-200 rounded">
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="font-bold text-gray-500 py-1">{d}</div>
              ))}
              {monthData.map((day, i) => (
                <div 
                  key={i}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm
                             ${day === null ? '' : day.breaks.length > 0 
                               ? 'bg-green-400 text-white font-bold' 
                               : 'bg-white text-gray-600'}`}
                >
                  {day?.day}
                  {day?.breaks.length > 1 && (
                    <span className="absolute text-[8px] -mt-4 ml-4 bg-blue-500 text-white rounded-full w-3 h-3 flex items-center justify-center">
                      {day.breaks.length}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span>Had breaks</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-white border rounded"></div>
              <span>No breaks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Main Component
// ============================================

const SensoryBreaks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [breakHistory, setBreakHistory] = useState({});
  
  // Load history from storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBreakHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load break history:', e);
      }
    }
  }, []);
  
  // Save history to storage
  const saveHistory = useCallback((newHistory) => {
    setBreakHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  }, []);
  
  // Log completed break
  const logBreak = useCallback(() => {
    if (!selectedActivity || !selectedCategory) return;
    
    const today = getToday();
    const newEntry = {
      activityId: selectedActivity.id,
      activityName: selectedActivity.name,
      categoryId: selectedCategory,
      duration: selectedActivity.duration,
      timestamp: new Date().toISOString()
    };
    
    const newHistory = {
      ...breakHistory,
      [today]: [...(breakHistory[today] || []), newEntry]
    };
    
    saveHistory(newHistory);
    setSelectedActivity(null);
  }, [selectedActivity, selectedCategory, breakHistory, saveHistory]);
  
  // Today's breaks
  const todayBreaks = breakHistory[getToday()] || [];
  const todayMinutes = Math.round(todayBreaks.reduce((sum, b) => sum + b.duration, 0) / 60);
  
  return (
    <div className="min-h-screen bg-[#FFFEF5] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-4xl mx-auto px-3 py-2 flex items-center gap-2">
          <button
            onClick={() => selectedCategory ? setSelectedCategory(null) : navigate('/activities')}
            className="flex items-center gap-1 px-3 py-2 bg-white border-3 border-[#8E6BBF] 
                     rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                     hover:text-white transition-all text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-display text-[#8E6BBF]">
              🧘 Sensory Breaks
            </h1>
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="p-2 bg-white border-2 border-gray-200 rounded-full hover:border-[#8E6BBF] transition-colors"
          >
            <BarChart3 size={18} className="text-gray-600" />
          </button>
        </div>
      </header>

      {/* Today's Summary */}
      <div className="px-3 py-2 bg-gradient-to-b from-purple-100/50 to-transparent">
        <div className="max-w-4xl mx-auto flex items-center justify-between bg-white rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📊</div>
            <div>
              <p className="font-display text-gray-800">Today's Breaks</p>
              <p className="text-sm text-gray-500 font-crayon">
                {todayBreaks.length} breaks • {todayMinutes} minutes
              </p>
            </div>
          </div>
          {todayBreaks.length > 0 && (
            <div className="flex -space-x-2">
              {todayBreaks.slice(0, 4).map((b, i) => {
                const cat = Object.values(SENSORY_ACTIVITIES).find(c => 
                  c.activities.some(a => a.id === b.activityId)
                );
                return (
                  <div 
                    key={i}
                    className="w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center text-sm"
                    style={{ borderColor: cat?.color || '#ccc' }}
                  >
                    {cat?.activities.find(a => a.id === b.activityId)?.emoji || '❓'}
                  </div>
                );
              })}
              {todayBreaks.length > 4 && (
                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center text-xs font-bold">
                  +{todayBreaks.length - 4}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-3 py-4">
        {!selectedCategory ? (
          // Category Selection
          <div className="space-y-4">
            <p className="text-center text-gray-600 font-crayon">
              Choose a type of sensory break
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(SENSORY_ACTIVITIES).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className="p-4 rounded-2xl border-4 text-left transition-all
                           hover:scale-102 hover:-rotate-0.5 active:scale-98 shadow-md"
                  style={{ 
                    backgroundColor: `${category.color}15`,
                    borderColor: category.color 
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{category.emoji}</span>
                    <div>
                      <h3 className="font-display text-lg" style={{ color: category.color }}>
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 font-crayon">
                        {category.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {category.activities.length} activities
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : selectedActivity ? (
          // Activity Timer View
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-5xl">{selectedActivity.emoji}</span>
              <h2 className="font-display text-2xl text-gray-800 mt-2">
                {selectedActivity.name}
              </h2>
              <p className="text-gray-600 font-crayon mt-1">
                {selectedActivity.description}
              </p>
            </div>
            
            <BreakTimer 
              duration={selectedActivity.duration}
              activity={selectedActivity}
              onComplete={logBreak}
            />
            
            <button
              onClick={() => setSelectedActivity(null)}
              className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-display
                       hover:bg-gray-200 transition-colors"
            >
              Choose Different Activity
            </button>
          </div>
        ) : (
          // Activity Selection
          <div className="space-y-4">
            <div 
              className="p-4 rounded-xl border-3 flex items-center gap-3"
              style={{ 
                backgroundColor: `${SENSORY_ACTIVITIES[selectedCategory].color}15`,
                borderColor: SENSORY_ACTIVITIES[selectedCategory].color
              }}
            >
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
                  onSelect={setSelectedActivity}
                  isSelected={selectedActivity?.id === activity.id}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 bg-white border-t-4 border-[#87CEEB] px-3 py-2 safe-area-bottom">
        <div className="max-w-4xl mx-auto flex justify-around">
          <button
            onClick={() => { setSelectedCategory(null); setSelectedActivity(null); }}
            className="flex flex-col items-center p-2 text-gray-500 hover:text-[#8E6BBF]"
          >
            <span className="text-2xl">🧘</span>
            <span className="text-xs font-crayon mt-0.5">Breaks</span>
          </button>
          
          <button
            onClick={() => setShowHistory(true)}
            className="flex flex-col items-center p-2 text-gray-500 hover:text-[#8E6BBF]"
          >
            <BarChart3 size={24} />
            <span className="text-xs font-crayon mt-0.5">History</span>
          </button>
          
          <button
            onClick={() => navigate('/hub')}
            className="flex flex-col items-center p-2 text-gray-500 hover:text-[#4A9FD4]"
          >
            <Home size={24} />
            <span className="text-xs font-crayon mt-0.5">Home</span>
          </button>
        </div>
      </nav>

      {/* History Modal */}
      {showHistory && (
        <HistoryView 
          breakHistory={breakHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
};

export default SensoryBreaks;
