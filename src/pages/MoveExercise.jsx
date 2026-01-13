// MoveExercise.jsx - Track physical activity and exercise
// Encourages movement with fun activities and progress tracking

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Trophy,
  Flame,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import LocalOnlyNotice from '../components/LocalOnlyNotice';
import TrackerHistory from '../components/TrackerHistory';

const STORAGE_KEY = 'snw_exercise';

// Exercise categories
const EXERCISE_CATEGORIES = [
  {
    id: 'fun',
    name: 'Fun Moves',
    emoji: '🎉',
    color: 'bg-pink-100 border-pink-400',
    activities: [
      { id: 'dance', name: 'Dancing', emoji: '💃', minutes: 5, intensity: 'medium' },
      { id: 'jump', name: 'Jumping', emoji: '🦘', minutes: 3, intensity: 'high' },
      { id: 'wiggle', name: 'Wiggling', emoji: '🐛', minutes: 2, intensity: 'low' },
      { id: 'spin', name: 'Spinning', emoji: '🌀', minutes: 1, intensity: 'medium' },
      { id: 'hop', name: 'Hopping', emoji: '🐰', minutes: 3, intensity: 'medium' },
      { id: 'skip', name: 'Skipping', emoji: '🎵', minutes: 5, intensity: 'medium' },
    ]
  },
  {
    id: 'stretch',
    name: 'Stretches',
    emoji: '🧘',
    color: 'bg-green-100 border-green-400',
    activities: [
      { id: 'arms', name: 'Arm Stretches', emoji: '💪', minutes: 2, intensity: 'low' },
      { id: 'legs', name: 'Leg Stretches', emoji: '🦵', minutes: 2, intensity: 'low' },
      { id: 'neck', name: 'Neck Rolls', emoji: '🙆', minutes: 1, intensity: 'low' },
      { id: 'bend', name: 'Toe Touches', emoji: '🤸', minutes: 2, intensity: 'low' },
      { id: 'twist', name: 'Body Twists', emoji: '🔄', minutes: 2, intensity: 'low' },
      { id: 'yoga', name: 'Simple Yoga', emoji: '🧘', minutes: 5, intensity: 'low' },
    ]
  },
  {
    id: 'active',
    name: 'Active Play',
    emoji: '⚽',
    color: 'bg-blue-100 border-blue-400',
    activities: [
      { id: 'walk', name: 'Walking', emoji: '🚶', minutes: 10, intensity: 'low' },
      { id: 'run', name: 'Running', emoji: '🏃', minutes: 5, intensity: 'high' },
      { id: 'bike', name: 'Biking', emoji: '🚴', minutes: 10, intensity: 'medium' },
      { id: 'swim', name: 'Swimming', emoji: '🏊', minutes: 10, intensity: 'high' },
      { id: 'ball', name: 'Ball Play', emoji: '⚽', minutes: 10, intensity: 'medium' },
      { id: 'playground', name: 'Playground', emoji: '🛝', minutes: 15, intensity: 'medium' },
    ]
  },
  {
    id: 'calm',
    name: 'Calm Movement',
    emoji: '😌',
    color: 'bg-purple-100 border-purple-400',
    activities: [
      { id: 'breathe', name: 'Deep Breathing', emoji: '🌬️', minutes: 3, intensity: 'low' },
      { id: 'slow-walk', name: 'Slow Walking', emoji: '🐢', minutes: 5, intensity: 'low' },
      { id: 'balance', name: 'Balance Practice', emoji: '⚖️', minutes: 3, intensity: 'low' },
      { id: 'gentle', name: 'Gentle Movement', emoji: '🌊', minutes: 5, intensity: 'low' },
      { id: 'squeeze', name: 'Squeeze & Release', emoji: '✊', minutes: 2, intensity: 'low' },
      { id: 'rock', name: 'Rocking', emoji: '🪑', minutes: 3, intensity: 'low' },
    ]
  },
];

// Achievement thresholds
const ACHIEVEMENTS = [
  { minutes: 10, emoji: '🌟', name: 'Getting Started' },
  { minutes: 30, emoji: '⭐', name: 'Active Day' },
  { minutes: 60, emoji: '🏅', name: 'Super Mover' },
  { minutes: 90, emoji: '🏆', name: 'Exercise Champion' },
];

const MoveExercise = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activities, setActivities] = useState([]);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [weekData, setWeekData] = useState({});
  const [showHistory, setShowHistory] = useState(false);

  // Convert weekData to minutes for graph display
  const historyData = useMemo(() => {
    const data = {};
    Object.entries(weekData).forEach(([date, activitiesArray]) => {
      if (Array.isArray(activitiesArray)) {
        data[date] = activitiesArray.reduce((sum, a) => sum + (a.minutes || 0), 0);
      }
    });
    return data;
  }, [weekData]);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setWeekData(data);
        setActivities(data[selectedDate] || []);
      } catch (e) {
        console.error('Error loading exercise data:', e);
      }
    }
  }, [selectedDate]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (activeTimer) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  // Save data
  const saveData = (newActivities) => {
    const newWeekData = { ...weekData, [selectedDate]: newActivities };
    setWeekData(newWeekData);
    setActivities(newActivities);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newWeekData));
  };

  // Log activity
  const logActivity = (activity) => {
    const entry = {
      id: Date.now().toString(),
      ...activity,
      loggedAt: new Date().toISOString(),
    };
    saveData([...activities, entry]);
  };

  // Start timed activity
  const startTimer = (activity) => {
    setActiveTimer(activity);
    setTimerSeconds(0);
  };

  // Stop timer and log
  const stopTimer = () => {
    if (activeTimer && timerSeconds >= 30) {
      const minutes = Math.ceil(timerSeconds / 60);
      const entry = {
        id: Date.now().toString(),
        ...activeTimer,
        minutes,
        loggedAt: new Date().toISOString(),
        timed: true,
      };
      saveData([...activities, entry]);
    }
    setActiveTimer(null);
    setTimerSeconds(0);
  };

  // Delete activity
  const deleteActivity = (id) => {
    saveData(activities.filter(a => a.id !== id));
  };

  // Calculate total minutes
  const getTotalMinutes = () => {
    return activities.reduce((sum, a) => sum + (a.minutes || 0), 0);
  };

  // Get achievement
  const getAchievement = () => {
    const minutes = getTotalMinutes();
    for (let i = ACHIEVEMENTS.length - 1; i >= 0; i--) {
      if (minutes >= ACHIEVEMENTS[i].minutes) {
        return ACHIEVEMENTS[i];
      }
    }
    return null;
  };

  // Format timer
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Change date
  const changeDate = (delta) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + delta);
    const newDate = date.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    if (newDate <= today) {
      setSelectedDate(newDate);
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === yesterday.getTime()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const achievement = getAchievement();
  const totalMinutes = getTotalMinutes();

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/health')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#5CB85C] 
                       rounded-xl font-display font-bold text-[#5CB85C] hover:bg-[#5CB85C] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-display text-[#5CB85C] crayon-text">
              🏃 Move & Exercise
            </h1>
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="p-2 bg-white border-3 border-green-400 rounded-full hover:bg-green-50"
            title="View history"
          >
            <BarChart3 size={18} className="text-green-500" />
          </button>
        </div>
      </header>

      {/* History Modal */}
      {showHistory && (
        <TrackerHistory
          data={historyData}
          goal={30}
          color="#E63B2E"
          label="Minutes"
          formatValue={(v) => `${v}min`}
          onClose={() => setShowHistory(false)}
        />
      )}

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Privacy Notice */}
        <div className="mb-4">
          <LocalOnlyNotice compact />
        </div>

        {/* Active Timer Overlay */}
        {activeTimer && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full">
              <span className="text-6xl block mb-4">{activeTimer.emoji}</span>
              <h2 className="font-display text-2xl text-gray-800 mb-2">{activeTimer.name}</h2>
              <div className="text-6xl font-display text-[#5CB85C] mb-6">
                {formatTimer(timerSeconds)}
              </div>
              <p className="font-crayon text-gray-500 mb-6">Keep moving!</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setActiveTimer(null);
                    setTimerSeconds(0);
                  }}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-crayon"
                >
                  Cancel
                </button>
                <button
                  onClick={stopTimer}
                  className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl font-crayon
                           flex items-center justify-center gap-2"
                >
                  <Pause size={20} />
                  Done!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 bg-white border-3 border-gray-300 rounded-full hover:border-gray-400"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="text-center">
            <span className="font-display text-xl text-gray-800">{formatDate(selectedDate)}</span>
          </div>
          
          <button
            onClick={() => changeDate(1)}
            disabled={isToday}
            className={`p-2 bg-white border-3 border-gray-300 rounded-full 
                       ${isToday ? 'opacity-30' : 'hover:border-gray-400'}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-2xl border-4 border-[#5CB85C] p-4 mb-6 shadow-crayon">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Flame size={24} className="text-orange-500" />
              </div>
              <div>
                <p className="font-crayon text-sm text-gray-500">Active Minutes</p>
                <p className="font-display text-3xl text-[#5CB85C]">{totalMinutes}</p>
              </div>
            </div>
            {achievement && (
              <div className="text-center">
                <span className="text-4xl">{achievement.emoji}</span>
                <p className="font-crayon text-xs text-gray-500">{achievement.name}</p>
              </div>
            )}
          </div>

          {/* Progress to next achievement */}
          {totalMinutes < 90 && (
            <div>
              <div className="flex justify-between text-xs font-crayon text-gray-500 mb-1">
                <span>Progress to next badge</span>
                <span>
                  {ACHIEVEMENTS.find(a => a.minutes > totalMinutes)?.minutes || 90} min
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all"
                  style={{ 
                    width: `${Math.min(100, (totalMinutes / (ACHIEVEMENTS.find(a => a.minutes > totalMinutes)?.minutes || 90)) * 100)}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Activity Categories */}
        <div className="space-y-4 mb-6">
          {EXERCISE_CATEGORIES.map(category => (
            <div key={category.id} className={`rounded-2xl border-3 ${category.color} overflow-hidden`}>
              <div className="p-3 flex items-center gap-2">
                <span className="text-2xl">{category.emoji}</span>
                <h3 className="font-display text-gray-700">{category.name}</h3>
              </div>
              <div className="bg-white p-3 grid grid-cols-3 gap-2">
                {category.activities.map(activity => (
                  <button
                    key={activity.id}
                    onClick={() => isToday && logActivity(activity)}
                    disabled={!isToday}
                    className={`p-3 rounded-xl border-2 border-gray-200 flex flex-col items-center
                               transition-all hover:border-green-400 hover:bg-green-50
                               active:scale-95 disabled:opacity-50 disabled:hover:border-gray-200`}
                  >
                    <span className="text-3xl mb-1">{activity.emoji}</span>
                    <span className="font-crayon text-xs text-gray-600 text-center">{activity.name}</span>
                    <span className="font-crayon text-xs text-gray-400">{activity.minutes} min</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Timed Activity */}
        {isToday && (
          <div className="bg-orange-50 rounded-2xl border-3 border-orange-300 p-4 mb-6">
            <h3 className="font-display text-orange-700 mb-3 flex items-center gap-2">
              <Play size={18} />
              Start Timed Activity
            </h3>
            <p className="font-crayon text-sm text-orange-600 mb-3">
              Pick an activity and we'll time it for you!
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'free-dance', name: 'Dance', emoji: '💃' },
                { id: 'free-run', name: 'Run', emoji: '🏃' },
                { id: 'free-play', name: 'Play', emoji: '🎉' },
                { id: 'free-move', name: 'Move', emoji: '⭐' },
              ].map(activity => (
                <button
                  key={activity.id}
                  onClick={() => startTimer(activity)}
                  className="p-3 bg-white rounded-xl border-2 border-orange-200 
                           flex flex-col items-center hover:border-orange-400 transition-all"
                >
                  <span className="text-2xl">{activity.emoji}</span>
                  <span className="font-crayon text-xs text-gray-600">{activity.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Today's Activities */}
        {activities.length > 0 && (
          <div className="bg-white rounded-2xl border-3 border-gray-200 p-4">
            <h3 className="font-display text-gray-700 mb-3">
              {isToday ? "Today's" : formatDate(selectedDate)} Activities
            </h3>
            <div className="space-y-2">
              {activities.map(activity => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-2 bg-green-50 rounded-xl"
                >
                  <span className="text-2xl">{activity.emoji}</span>
                  <div className="flex-1">
                    <p className="font-crayon text-gray-700">{activity.name}</p>
                    <p className="font-crayon text-xs text-gray-500">
                      {activity.minutes} min {activity.timed && '(timed)'}
                    </p>
                  </div>
                  {isToday && (
                    <button
                      onClick={() => deleteActivity(activity.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <RotateCcw size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {activities.length === 0 && (
          <div className="text-center py-8">
            <span className="text-5xl">🏃</span>
            <h3 className="font-display text-gray-500 mt-2">No activities yet</h3>
            <p className="font-crayon text-gray-400">
              {isToday ? 'Tap an activity above to log it!' : 'No activities logged this day'}
            </p>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border-3 border-blue-200">
          <h3 className="font-display text-blue-700 mb-2 flex items-center gap-2">
            <Heart size={18} />
            Movement Tips
          </h3>
          <ul className="font-crayon text-sm text-blue-600 space-y-1">
            <li>• Any movement counts - even small ones!</li>
            <li>• Take breaks throughout the day to move</li>
            <li>• Movement can help with focus and calm</li>
            <li>• Celebrate every activity logged! 🎉</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default MoveExercise;
