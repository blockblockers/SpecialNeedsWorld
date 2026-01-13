// WaterTracker.jsx - Track daily water intake
// Visual, fun tracking with cup graphics

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, RotateCcw, Droplets, Trophy, BarChart3 } from 'lucide-react';
import LocalOnlyNotice from '../components/LocalOnlyNotice';
import TrackerHistory from '../components/TrackerHistory';

const STORAGE_KEY = 'snw_water';

// Daily goal in cups (8oz each)
const DEFAULT_GOAL = 8;

// Cup sizes
const CUP_SIZES = [
  { id: 'small', label: 'Small', cups: 0.5, emoji: '🥤', oz: '4oz' },
  { id: 'medium', label: 'Medium', cups: 1, emoji: '🥛', oz: '8oz' },
  { id: 'large', label: 'Large', cups: 1.5, emoji: '🧃', oz: '12oz' },
  { id: 'bottle', label: 'Bottle', cups: 2, emoji: '🍶', oz: '16oz' },
];

const WaterTracker = () => {
  const navigate = useNavigate();
  const [todayCups, setTodayCups] = useState(0);
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [history, setHistory] = useState({});
  const [showGoalEdit, setShowGoalEdit] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setHistory(data.history || {});
        setGoal(data.goal || DEFAULT_GOAL);
        setTodayCups(data.history?.[today] || 0);
      } catch (e) {
        console.error('Error loading water data:', e);
      }
    }
  }, [today]);

  // Save data
  const saveData = (cups, newHistory, newGoal) => {
    const data = {
      history: { ...newHistory, [today]: cups },
      goal: newGoal,
    };
    setHistory(data.history);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  // Add water
  const addWater = (cups) => {
    const newTotal = Math.max(0, todayCups + cups);
    setTodayCups(newTotal);
    saveData(newTotal, history, goal);
  };

  // Reset today
  const resetToday = () => {
    setTodayCups(0);
    saveData(0, history, goal);
  };

  // Update goal
  const updateGoal = (newGoal) => {
    const validGoal = Math.max(1, Math.min(20, newGoal));
    setGoal(validGoal);
    saveData(todayCups, history, validGoal);
    setShowGoalEdit(false);
  };

  // Calculate progress
  const progress = Math.min(100, (todayCups / goal) * 100);
  const isGoalReached = todayCups >= goal;

  // Get week stats
  const getWeekStats = () => {
    const stats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      stats.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        cups: history[dateStr] || 0,
      });
    }
    return stats;
  };

  const weekStats = getWeekStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b-4 border-[#4A9FD4]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/health')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#4A9FD4] 
                       rounded-xl font-display font-bold text-[#4A9FD4] hover:bg-[#4A9FD4] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#4A9FD4] crayon-text">
              💧 Water Tracker
            </h1>
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="p-2 bg-white border-3 border-blue-400 rounded-full hover:bg-blue-50"
            title="View history"
          >
            <BarChart3 size={18} className="text-blue-500" />
          </button>
          <button
            onClick={resetToday}
            className="p-2 bg-white border-3 border-gray-300 rounded-full hover:border-gray-400"
            title="Reset today"
          >
            <RotateCcw size={18} className="text-gray-500" />
          </button>
        </div>
      </header>

      {/* History Modal */}
      {showHistory && (
        <TrackerHistory
          data={history}
          goal={goal}
          color="#4A9FD4"
          label="Cups"
          formatValue={(v) => `${v}`}
          onClose={() => setShowHistory(false)}
        />
      )}

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Privacy Notice */}
        <div className="mb-4">
          <LocalOnlyNotice compact />
        </div>

        {/* Progress Display */}
        <div className="bg-white rounded-3xl border-4 border-[#4A9FD4] p-6 mb-6 shadow-crayon text-center">
          {/* Water glass visualization */}
          <div className="relative w-32 h-48 mx-auto mb-4">
            {/* Glass outline */}
            <div className="absolute inset-0 border-4 border-blue-300 rounded-b-3xl bg-white overflow-hidden">
              {/* Water fill */}
              <div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-400 to-blue-300 transition-all duration-500"
                style={{ height: `${progress}%` }}
              >
                {/* Bubbles animation */}
                <div className="absolute inset-0 overflow-hidden">
                  {progress > 10 && (
                    <>
                      <div className="absolute w-3 h-3 bg-blue-200 rounded-full animate-bounce" style={{ left: '20%', bottom: '30%', animationDelay: '0.2s' }} />
                      <div className="absolute w-2 h-2 bg-blue-200 rounded-full animate-bounce" style={{ left: '60%', bottom: '50%', animationDelay: '0.5s' }} />
                      <div className="absolute w-2 h-2 bg-blue-200 rounded-full animate-bounce" style={{ left: '40%', bottom: '70%', animationDelay: '0.8s' }} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Count display */}
          <div className="mb-2">
            <span className="text-5xl font-display text-[#4A9FD4]">{todayCups}</span>
            <span className="text-2xl text-gray-400 font-crayon"> / {goal}</span>
          </div>
          <p className="font-crayon text-gray-600">cups today</p>

          {/* Goal reached celebration */}
          {isGoalReached && (
            <div className="mt-4 p-3 bg-green-100 rounded-xl border-3 border-green-400 flex items-center justify-center gap-2">
              <Trophy className="text-yellow-500" size={24} />
              <span className="font-display text-green-700">Goal reached! 🎉</span>
            </div>
          )}

          {/* Edit goal */}
          <button
            onClick={() => setShowGoalEdit(true)}
            className="mt-4 text-sm text-gray-400 font-crayon hover:text-gray-600"
          >
            Change daily goal →
          </button>
        </div>

        {/* Goal Edit Modal */}
        {showGoalEdit && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="font-display text-xl text-center mb-4">Daily Goal</h3>
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={() => updateGoal(goal - 1)}
                  className="p-3 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  <Minus size={24} />
                </button>
                <span className="text-4xl font-display text-[#4A9FD4] w-16 text-center">
                  {goal}
                </span>
                <button
                  onClick={() => updateGoal(goal + 1)}
                  className="p-3 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  <Plus size={24} />
                </button>
              </div>
              <p className="text-center text-gray-500 font-crayon mb-4">cups per day</p>
              <button
                onClick={() => setShowGoalEdit(false)}
                className="w-full py-3 bg-[#4A9FD4] text-white rounded-xl font-crayon"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Quick Add Buttons */}
        <div className="mb-6">
          <p className="text-center font-crayon text-gray-600 mb-3">Add water:</p>
          <div className="grid grid-cols-4 gap-2">
            {CUP_SIZES.map(size => (
              <button
                key={size.id}
                onClick={() => addWater(size.cups)}
                className="p-3 bg-white rounded-xl border-3 border-blue-300 
                         hover:border-blue-500 hover:scale-105 transition-all"
              >
                <span className="text-3xl block">{size.emoji}</span>
                <span className="text-xs font-crayon text-gray-600">{size.oz}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual adjust */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => addWater(-0.5)}
            disabled={todayCups <= 0}
            className="px-6 py-3 bg-red-100 text-red-600 rounded-xl border-3 border-red-300
                     font-crayon hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center gap-2"
          >
            <Minus size={20} />
            Remove
          </button>
          <button
            onClick={() => addWater(1)}
            className="px-6 py-3 bg-blue-100 text-blue-600 rounded-xl border-3 border-blue-300
                     font-crayon hover:bg-blue-200 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Cup
          </button>
        </div>

        {/* Week Summary */}
        <div className="bg-white rounded-2xl border-3 border-gray-300 p-4">
          <h3 className="font-display text-gray-700 mb-3 flex items-center gap-2">
            <Droplets size={18} className="text-blue-400" />
            This Week
          </h3>
          <div className="flex justify-between">
            {weekStats.map(stat => {
              const percent = Math.min(100, (stat.cups / goal) * 100);
              const isToday = stat.date === today;
              
              return (
                <div key={stat.date} className="flex flex-col items-center">
                  <span className="text-xs font-crayon text-gray-500">{stat.day.charAt(0)}</span>
                  <div className={`w-8 h-20 bg-gray-200 rounded-full overflow-hidden mt-1 relative
                    ${isToday ? 'ring-2 ring-blue-400' : ''}`}>
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-blue-400 transition-all"
                      style={{ height: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs font-crayon text-gray-600 mt-1">
                    {stat.cups > 0 ? stat.cups : '-'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border-3 border-blue-200">
          <p className="text-center text-gray-600 font-crayon text-sm">
            💡 <strong>Tip:</strong> Drink water throughout the day to stay healthy and focused!
          </p>
        </div>
      </main>
    </div>
  );
};

export default WaterTracker;
