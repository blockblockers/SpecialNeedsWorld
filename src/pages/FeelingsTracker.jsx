// FIXED: Changed theme color from yellow (#F5A623) to coral (#FF6B6B) for better visibility
// FIXED: Back button always navigates to /wellness
// FeelingsTracker.jsx - Track daily emotions and moods
// NAVIGATION: Back button goes to /wellness (parent hub)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, BarChart3, X } from 'lucide-react';
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
  const [selectedTime, setSelectedTime] = useState('morning');
  const [showHistory, setShowHistory] = useState(false);

  // Load saved data
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

  // Save data
  const saveEntries = (newEntries) => {
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  // Get entry key
  const getEntryKey = () => `${selectedDate}_${selectedTime}`;

  // Get current entry
  const currentEntry = entries[getEntryKey()] || [];

  // Toggle feeling
  const toggleFeeling = (feelingId) => {
    const key = getEntryKey();
    const current = entries[key] || [];
    
    let updated;
    if (current.includes(feelingId)) {
      updated = current.filter(id => id !== feelingId);
    } else {
      updated = [...current, feelingId];
    }
    
    const newEntries = { ...entries, [key]: updated };
    saveEntries(newEntries);
  };

  // Change date
  const changeDate = (days) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return 'Today';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#FF6B6B]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* IMPORTANT: Back button goes to /wellness (parent hub) */}
          <button
            onClick={() => navigate('/wellness')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#FF6B6B] 
                       rounded-xl font-display font-bold text-[#FF6B6B] hover:bg-[#FF6B6B] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#FF6B6B] crayon-text">
              😊 How Do I Feel?
            </h1>
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="p-2 bg-white border-3 border-orange-400 rounded-full hover:bg-orange-50"
          >
            <BarChart3 size={18} className="text-orange-500" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Privacy Notice */}
        <LocalOnlyNotice compact />

        {/* Date Navigation */}
        <div className="flex items-center justify-between">
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
                       ${isToday ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Time of Day */}
        <div className="flex justify-center gap-2">
          {TIME_OF_DAY.map(time => (
            <button
              key={time.id}
              onClick={() => setSelectedTime(time.id)}
              className={`px-4 py-2 rounded-xl font-crayon transition-all ${
                selectedTime === time.id
                  ? 'bg-[#FF6B6B] text-white'
                  : 'bg-white border-2 border-gray-200 hover:border-[#FF6B6B]'
              }`}
            >
              {time.emoji} {time.label}
            </button>
          ))}
        </div>

        {/* Instructions */}
        <p className="text-center font-crayon text-gray-600">
          How are you feeling this {selectedTime}? Tap all that apply!
        </p>

        {/* Feelings Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {FEELINGS.map(feeling => {
            const isSelected = currentEntry.includes(feeling.id);
            return (
              <button
                key={feeling.id}
                onClick={() => toggleFeeling(feeling.id)}
                className={`p-4 rounded-2xl border-4 transition-all ${feeling.color} ${
                  isSelected 
                    ? 'scale-110 shadow-lg ring-4 ring-offset-2 ring-[#FF6B6B]' 
                    : 'hover:scale-105'
                }`}
              >
                <span className="text-4xl block">{feeling.emoji}</span>
                <span className="text-sm font-crayon text-gray-700 mt-1 block">{feeling.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected feelings summary */}
        {currentEntry.length > 0 && (
          <div className="p-4 bg-[#FF6B6B]/20 rounded-2xl border-3 border-[#FF6B6B]/30">
            <p className="font-crayon text-gray-700 text-center">
              You're feeling: {currentEntry.map(id => {
                const feeling = FEELINGS.find(f => f.id === id);
                return feeling ? `${feeling.emoji} ${feeling.label}` : '';
              }).join(', ')}
            </p>
          </div>
        )}
      </main>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-display text-xl text-[#FF6B6B]">Feelings History</h2>
              <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {Object.keys(entries).length === 0 ? (
                <p className="text-center text-gray-500 font-crayon">No feelings recorded yet!</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(entries)
                    .sort((a, b) => b[0].localeCompare(a[0]))
                    .slice(0, 20)
                    .map(([key, feelings]) => {
                      const [date, time] = key.split('_');
                      return (
                        <div key={key} className="p-3 bg-orange-50 rounded-xl">
                          <div className="text-sm text-gray-500 font-crayon mb-1">
                            {formatDate(date)} - {TIME_OF_DAY.find(t => t.id === time)?.label}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {feelings.map(id => {
                              const feeling = FEELINGS.find(f => f.id === id);
                              return feeling ? (
                                <span key={id} className="text-xl" title={feeling.label}>
                                  {feeling.emoji}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeelingsTracker;
