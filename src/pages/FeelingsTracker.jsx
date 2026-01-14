// FeelingsTracker.jsx - Track daily emotions and moods
// Simple, visual tracking for neurodiverse individuals

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import LocalOnlyNotice from '../components/LocalOnlyNotice';

// Feelings with faces
const FEELINGS = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: 'bg-yellow-100 border-yellow-400' },
  { id: 'calm', emoji: '😌', label: 'Calm', color: 'bg-green-100 border-green-400' },
  { id: 'excited', emoji: '🤩', label: 'Excited', color: 'bg-pink-100 border-pink-400' },
  { id: 'tired', emoji: '😴', label: 'Tired', color: 'bg-blue-100 border-blue-400' },
  { id: 'sad', emoji: '😢', label: 'Sad', color: 'bg-blue-200 border-blue-500' },
  { id: 'worried', emoji: '😟', label: 'Worried', color: 'bg-purple-100 border-purple-400' },
  { id: 'angry', emoji: '😠', label: 'Angry', color: 'bg-red-100 border-red-400' },
  { id: 'frustrated', emoji: '😤', label: 'Frustrated', color: 'bg-orange-100 border-orange-400' },
  { id: 'silly', emoji: '🤪', label: 'Silly', color: 'bg-pink-200 border-pink-500' },
  { id: 'scared', emoji: '😨', label: 'Scared', color: 'bg-gray-100 border-gray-400' },
  { id: 'confused', emoji: '😕', label: 'Confused', color: 'bg-gray-200 border-gray-500' },
  { id: 'proud', emoji: '🥳', label: 'Proud', color: 'bg-green-200 border-green-500' },
];

// Time of day options
const TIME_OF_DAY = [
  { id: 'morning', label: 'Morning', emoji: '🌅' },
  { id: 'afternoon', label: 'Afternoon', emoji: '☀️' },
  { id: 'evening', label: 'Evening', emoji: '🌙' },
];

const STORAGE_KEY = 'snw_feelings';

const FeelingsTracker = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(getCurrentTimeOfDay());

  // Get current time of day
  function getCurrentTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  // Load entries
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading feelings:', e);
      }
    }
  }, []);

  // Save entries
  const saveEntries = (newEntries) => {
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  // Record feeling
  const recordFeeling = (feelingId) => {
    const key = `${selectedDate}_${selectedTime}`;
    const newEntries = {
      ...entries,
      [key]: {
        feeling: feelingId,
        timestamp: new Date().toISOString(),
      },
    };
    saveEntries(newEntries);
  };

  // Get feeling for a specific date and time
  const getFeeling = (date, time) => {
    const key = `${date}_${time}`;
    return entries[key]?.feeling;
  };

  // Get feeling info
  const getFeelingInfo = (feelingId) => {
    return FEELINGS.find(f => f.id === feelingId);
  };

  // Navigate dates
  const changeDate = (delta) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + delta);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  // Format date for display
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

  // Get week summary
  const getWeekSummary = () => {
    const summary = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayFeelings = TIME_OF_DAY
        .map(t => getFeeling(dateStr, t.id))
        .filter(Boolean);
      
      if (dayFeelings.length > 0) {
        // Get most common feeling for the day
        const counts = {};
        dayFeelings.forEach(f => counts[f] = (counts[f] || 0) + 1);
        const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
        summary[dateStr] = mostCommon;
      }
    }
    return summary;
  };

  const weekSummary = getWeekSummary();
  const currentFeeling = getFeeling(selectedDate, selectedTime);

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E86B9A]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/health')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E86B9A] 
                       rounded-xl font-display font-bold text-[#E86B9A] hover:bg-[#E86B9A] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#E86B9A] crayon-text">
              😊 How Do I Feel?
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Privacy Notice */}
        <div className="mb-4">
          <LocalOnlyNotice compact />
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 bg-white border-3 border-gray-300 rounded-full hover:border-gray-400"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="text-center">
            <span className="font-display text-xl text-gray-800">
              {formatDate(selectedDate)}
            </span>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Calendar size={14} className="text-gray-400" />
              <span className="text-sm text-gray-500 font-crayon">{selectedDate}</span>
            </div>
          </div>
          
          <button
            onClick={() => changeDate(1)}
            disabled={selectedDate === new Date().toISOString().split('T')[0]}
            className="p-2 bg-white border-3 border-gray-300 rounded-full hover:border-gray-400
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Time of Day Selection */}
        <div className="mb-6">
          <p className="text-center font-crayon text-gray-600 mb-3">When?</p>
          <div className="flex gap-2 justify-center">
            {TIME_OF_DAY.map(time => {
              const hasEntry = getFeeling(selectedDate, time.id);
              return (
                <button
                  key={time.id}
                  onClick={() => setSelectedTime(time.id)}
                  className={`flex-1 max-w-[120px] p-3 rounded-xl border-3 font-crayon transition-all
                    ${selectedTime === time.id 
                      ? 'bg-pink-100 border-pink-400 text-pink-700' 
                      : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                    }
                    ${hasEntry ? 'ring-2 ring-green-400 ring-offset-2' : ''}
                  `}
                >
                  <span className="text-2xl block">{time.emoji}</span>
                  <span className="text-xs">{time.label}</span>
                  {hasEntry && (
                    <span className="block text-lg mt-1">
                      {getFeelingInfo(hasEntry)?.emoji}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Selection Display */}
        {currentFeeling && (
          <div className="mb-6 p-4 bg-white rounded-2xl border-3 border-green-400 text-center">
            <span className="text-5xl block mb-2">
              {getFeelingInfo(currentFeeling)?.emoji}
            </span>
            <span className="font-display text-gray-700">
              Feeling {getFeelingInfo(currentFeeling)?.label}
            </span>
            <p className="text-xs text-gray-400 font-crayon mt-1">
              Tap a feeling below to change
            </p>
          </div>
        )}

        {/* Feeling Selection */}
        <div className="mb-6">
          <p className="text-center font-crayon text-gray-600 mb-3">
            How are you feeling?
          </p>
          <div className="grid grid-cols-4 gap-3">
            {FEELINGS.map(feeling => (
              <button
                key={feeling.id}
                onClick={() => recordFeeling(feeling.id)}
                className={`p-3 rounded-2xl border-3 transition-all hover:scale-105
                  ${currentFeeling === feeling.id 
                    ? `${feeling.color} scale-110 shadow-lg` 
                    : 'bg-white border-gray-300 hover:border-gray-400'
                  }`}
              >
                <span className="text-4xl block">{feeling.emoji}</span>
                <span className="text-xs font-crayon text-gray-600 block mt-1">
                  {feeling.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Week Summary */}
        <div className="bg-white rounded-2xl border-3 border-gray-300 p-4">
          <h3 className="font-display text-gray-700 mb-3 text-center">This Week</h3>
          <div className="flex justify-between">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              const dateStr = date.toISOString().split('T')[0];
              const feeling = weekSummary[dateStr];
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              const isSelected = dateStr === selectedDate;
              
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`flex flex-col items-center p-2 rounded-xl transition-all
                    ${isSelected ? 'bg-pink-100 border-2 border-pink-400' : ''}
                    ${isToday && !isSelected ? 'bg-gray-100' : ''}
                  `}
                >
                  <span className="text-xs font-crayon text-gray-500">
                    {date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                  </span>
                  <span className="text-xl mt-1">
                    {feeling ? getFeelingInfo(feeling)?.emoji : '○'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-pink-50 rounded-2xl border-3 border-pink-200">
          <p className="text-center text-gray-600 font-crayon text-sm">
            💡 <strong>Tip:</strong> Track your feelings each morning, afternoon, and evening to see patterns!
          </p>
        </div>
      </main>
    </div>
  );
};

export default FeelingsTracker;
