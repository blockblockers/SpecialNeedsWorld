// HealthyChoices.jsx - Track healthy decisions throughout the day
// FIXED: Navigation to /health and updated back button styling

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star,
  Trophy,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BarChart3,
  CalendarPlus
} from 'lucide-react';
import LocalOnlyNotice from '../components/LocalOnlyNotice';
import TrackerHistory from '../components/TrackerHistory';
import AddToScheduleModal from '../components/AddToScheduleModal';
import { SCHEDULE_SOURCES, SOURCE_COLORS } from '../services/scheduleHelper';

const STORAGE_KEY = 'snw_healthy_choices';

// Healthy choice categories
const CHOICE_CATEGORIES = [
  {
    id: 'eating',
    name: 'Eating Well',
    emoji: '🍎',
    color: 'bg-red-100 border-red-400',
    choices: [
      { id: 'fruit', name: 'Ate fruit', emoji: '🍎', points: 1 },
      { id: 'veggies', name: 'Ate vegetables', emoji: '🥦', points: 1 },
      { id: 'water', name: 'Drank water', emoji: '💧', points: 1 },
      { id: 'new-food', name: 'Tried new food', emoji: '🌟', points: 2 },
      { id: 'no-junk', name: 'Chose healthy snack', emoji: '🥕', points: 1 },
      { id: 'breakfast', name: 'Ate breakfast', emoji: '🥣', points: 1 },
    ]
  },
  {
    id: 'body',
    name: 'Body Care',
    emoji: '🧼',
    color: 'bg-blue-100 border-blue-400',
    choices: [
      { id: 'brush-am', name: 'Brushed teeth (morning)', emoji: '🦷', points: 1 },
      { id: 'brush-pm', name: 'Brushed teeth (night)', emoji: '🦷', points: 1 },
      { id: 'wash-hands', name: 'Washed hands', emoji: '🧼', points: 1 },
      { id: 'bath', name: 'Took bath/shower', emoji: '🛁', points: 1 },
      { id: 'exercise', name: 'Got exercise', emoji: '🏃', points: 2 },
      { id: 'outside', name: 'Played outside', emoji: '🌳', points: 1 },
    ]
  },
  {
    id: 'kindness',
    name: 'Kindness',
    emoji: '💝',
    color: 'bg-pink-100 border-pink-400',
    choices: [
      { id: 'helped', name: 'Helped someone', emoji: '🤝', points: 2 },
      { id: 'shared', name: 'Shared with others', emoji: '🎁', points: 1 },
      { id: 'kind-words', name: 'Used kind words', emoji: '💬', points: 1 },
      { id: 'listened', name: 'Listened well', emoji: '👂', points: 1 },
      { id: 'patient', name: 'Was patient', emoji: '⏰', points: 2 },
      { id: 'thankful', name: 'Said thank you', emoji: '🙏', points: 1 },
    ]
  },
  {
    id: 'learning',
    name: 'Learning',
    emoji: '📚',
    color: 'bg-purple-100 border-purple-400',
    choices: [
      { id: 'reading', name: 'Read a book', emoji: '📖', points: 2 },
      { id: 'homework', name: 'Did homework', emoji: '✏️', points: 2 },
      { id: 'tried-hard', name: 'Tried my best', emoji: '💪', points: 1 },
      { id: 'asked', name: 'Asked for help', emoji: '🙋', points: 1 },
      { id: 'learned', name: 'Learned something new', emoji: '🧠', points: 2 },
      { id: 'practiced', name: 'Practiced a skill', emoji: '🎯', points: 1 },
    ]
  },
];

// Achievement levels
const ACHIEVEMENT_LEVELS = [
  { minPoints: 0, name: 'Getting Started', emoji: '🌱', color: 'text-gray-500' },
  { minPoints: 5, name: 'Good Start', emoji: '⭐', color: 'text-yellow-500' },
  { minPoints: 10, name: 'Making Progress', emoji: '🌟', color: 'text-yellow-600' },
  { minPoints: 15, name: 'Superstar', emoji: '✨', color: 'text-orange-500' },
  { minPoints: 20, name: 'Champion', emoji: '🏆', color: 'text-amber-500' },
  { minPoints: 30, name: 'Health Hero', emoji: '🦸', color: 'text-purple-500' },
];

const HealthyChoices = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [choices, setChoices] = useState([]);
  const [allData, setAllData] = useState({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationLevel, setCelebrationLevel] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);

  // Convert data to points for history graph
  const historyData = useMemo(() => {
    const data = {};
    Object.entries(allData).forEach(([date, dayChoices]) => {
      let total = 0;
      dayChoices.forEach(choiceId => {
        for (const cat of CHOICE_CATEGORIES) {
          const choice = cat.choices.find(c => c.id === choiceId);
          if (choice) total += choice.points;
        }
      });
      data[date] = total;
    });
    return data;
  }, [allData]);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAllData(parsed);
        if (parsed[selectedDate]) {
          setChoices(parsed[selectedDate]);
        }
      } catch (e) {
        console.error('Error loading healthy choices:', e);
      }
    }
  }, []);

  // Load choices for selected date
  useEffect(() => {
    setChoices(allData[selectedDate] || []);
  }, [selectedDate, allData]);

  // Save data
  const saveData = (newChoices) => {
    const newData = { ...allData, [selectedDate]: newChoices };
    setAllData(newData);
    setChoices(newChoices);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  // Toggle choice
  const toggleChoice = (choiceId, points) => {
    const prevPoints = getTotalPoints();
    const prevLevel = getAchievement(prevPoints);
    
    let newChoices;
    if (choices.includes(choiceId)) {
      newChoices = choices.filter(c => c !== choiceId);
    } else {
      newChoices = [...choices, choiceId];
    }
    
    saveData(newChoices);
    
    // Check for level up
    const newPoints = newChoices.reduce((sum, cId) => {
      for (const cat of CHOICE_CATEGORIES) {
        const choice = cat.choices.find(c => c.id === cId);
        if (choice) return sum + choice.points;
      }
      return sum;
    }, 0);
    
    const newLevel = getAchievement(newPoints);
    if (newLevel && prevLevel && newLevel.minPoints > prevLevel.minPoints) {
      setCelebrationLevel(newLevel);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  // Get total points
  const getTotalPoints = () => {
    return choices.reduce((sum, choiceId) => {
      for (const cat of CHOICE_CATEGORIES) {
        const choice = cat.choices.find(c => c.id === choiceId);
        if (choice) return sum + choice.points;
      }
      return sum;
    }, 0);
  };

  // Get achievement level
  const getAchievement = (points = getTotalPoints()) => {
    let achievement = ACHIEVEMENT_LEVELS[0];
    for (const level of ACHIEVEMENT_LEVELS) {
      if (points >= level.minPoints) {
        achievement = level;
      }
    }
    return achievement;
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  // Navigate dates
  const changeDate = (delta) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + delta);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date.getTime() === today.getTime()) return 'Today';
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.getTime() === yesterday.getTime()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Reset day
  const resetDay = () => {
    if (confirm('Reset all choices for today?')) {
      saveData([]);
    }
  };

  // Schedule habit reminder
  const openScheduleModal = (choice) => {
    setSelectedHabit(choice);
    setShowScheduleModal(true);
  };

  const handleScheduleSuccess = () => {
    setShowScheduleModal(false);
    setSelectedHabit(null);
  };

  const totalPoints = getTotalPoints();
  const achievement = getAchievement();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50">
      {/* Level Up Celebration */}
      {showCelebration && celebrationLevel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-3xl p-8 text-center animate-bounce-in shadow-crayon-lg">
            <span className="text-6xl block mb-4">{celebrationLevel.emoji}</span>
            <h2 className="text-2xl font-display text-[#5CB85C] mb-2">Level Up!</h2>
            <p className="font-crayon text-gray-600">You reached {celebrationLevel.name}!</p>
          </div>
        </div>
      )}
      
      {/* Header - FIXED: Navigate to /health with updated styling */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* FIXED: Navigate to /health, not /activities */}
          {/* FIXED: Updated styling - border-4, rounded-xl, font-display font-bold */}
          <button
            onClick={() => navigate('/health')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#5CB85C] 
                       rounded-xl font-display font-bold text-[#5CB85C] hover:bg-[#5CB85C] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img 
            src="/logo.jpeg" 
            alt="ATLASassist" 
            className="w-10 h-10 rounded-lg shadow-sm"
          />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#5CB85C] crayon-text">
              ✨ Healthy Choices
            </h1>
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="p-2 bg-white border-3 border-green-400 rounded-full hover:bg-green-50"
            title="View history"
          >
            <BarChart3 size={18} className="text-green-500" />
          </button>
          {isToday && choices.length > 0 && (
            <button
              onClick={resetDay}
              className="p-2 text-gray-400 hover:text-orange-500 rounded-lg hover:bg-white"
              title="Reset"
            >
              <RotateCcw size={18} />
            </button>
          )}
        </div>
      </header>

      {/* History Modal */}
      {showHistory && (
        <TrackerHistory
          data={historyData}
          goal={15}
          color="#5CB85C"
          label="Points"
          formatValue={(v) => `${v}pts`}
          onClose={() => setShowHistory(false)}
        />
      )}

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Privacy Notice */}
        <div className="mb-4">
          <LocalOnlyNotice compact />
        </div>

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
                       ${isToday ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Achievement Display */}
        <div className="bg-white rounded-2xl border-3 border-yellow-300 p-4 mb-6 text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl">{achievement.emoji}</span>
            <div>
              <p className={`font-display text-lg ${achievement.color}`}>{achievement.name}</p>
              <div className="flex items-center gap-2">
                <Star className="text-yellow-500 fill-yellow-500" size={16} />
                <span className="font-crayon text-gray-600">{totalPoints} points today</span>
              </div>
            </div>
          </div>
          
          {/* Progress to next level */}
          {achievement.minPoints < 30 && (
            <div className="mt-3">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-green-400 transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, (totalPoints / (achievement.minPoints + 5)) * 100)}%` 
                  }}
                />
              </div>
              <p className="font-crayon text-xs text-gray-500 mt-1">
                {ACHIEVEMENT_LEVELS.find(l => l.minPoints > totalPoints)?.minPoints - totalPoints || 0} more points to next level!
              </p>
            </div>
          )}
        </div>

        {/* Choice Categories */}
        {CHOICE_CATEGORIES.map(category => (
          <div key={category.id} className="mb-6">
            <h3 className="font-display text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-xl">{category.emoji}</span>
              {category.name}
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {category.choices.map(choice => {
                const isChecked = choices.includes(choice.id);
                return (
                  <div key={choice.id} className="relative">
                    <button
                      onClick={() => toggleChoice(choice.id, choice.points)}
                      disabled={!isToday}
                      className={`
                        w-full p-3 rounded-xl border-3 flex flex-col items-center gap-1 transition-all
                        ${isChecked 
                          ? 'bg-green-100 border-green-400 scale-105' 
                          : `${category.color} hover:scale-102`
                        }
                        ${!isToday ? 'opacity-70' : ''}
                      `}
                    >
                      <span className="text-2xl">{choice.emoji}</span>
                      <span className="font-crayon text-xs text-gray-700 text-center leading-tight">
                        {choice.name}
                      </span>
                      <span className="font-crayon text-xs text-gray-500">
                        +{choice.points} {choice.points === 1 ? 'pt' : 'pts'}
                      </span>
                      {isChecked && (
                        <span className="absolute top-1 right-1 text-green-600">✓</span>
                      )}
                    </button>
                    
                    {/* Schedule button */}
                    {isToday && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openScheduleModal(choice);
                        }}
                        className="absolute -top-1 -right-1 p-1 bg-blue-100 border-2 border-blue-300 
                                 rounded-full text-blue-600 hover:bg-blue-200 transition-colors"
                        title="Add reminder to schedule"
                      >
                        <CalendarPlus size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Tips */}
        <div className="p-4 bg-green-50 rounded-2xl border-3 border-green-200">
          <p className="text-center text-gray-600 font-crayon text-sm">
            💡 <strong>Tip:</strong> Tap choices as you complete them throughout the day. 
            Build healthy habits one step at a time!
          </p>
        </div>
      </main>

      {/* Add to Schedule Modal */}
      {selectedHabit && (
        <AddToScheduleModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedHabit(null);
          }}
          onSuccess={handleScheduleSuccess}
          title={`Schedule: ${selectedHabit.name}`}
          itemName={selectedHabit.name}
          itemEmoji={selectedHabit.emoji}
          itemColor={SOURCE_COLORS[SCHEDULE_SOURCES.HEALTHY_CHOICES]}
          itemSource={SCHEDULE_SOURCES.HEALTHY_CHOICES}
          defaultTime="09:00"
          showTimeSelection={true}
          showNotifyOption={true}
          confirmText="Add Reminder"
        />
      )}
    </div>
  );
};

export default HealthyChoices;
