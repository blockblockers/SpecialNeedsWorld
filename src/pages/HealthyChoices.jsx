// HealthyChoices.jsx - Track healthy decisions throughout the day
// Positive reinforcement for making good choices
// Now with schedule integration for habit reminders!

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
      { id: 'sunscreen', name: 'Used sunscreen', emoji: '☀️', points: 1 },
      { id: 'rest', name: 'Got enough rest', emoji: '😴', points: 2 },
    ]
  },
  {
    id: 'kindness',
    name: 'Being Kind',
    emoji: '💝',
    color: 'bg-pink-100 border-pink-400',
    choices: [
      { id: 'share', name: 'Shared with others', emoji: '🤝', points: 2 },
      { id: 'help', name: 'Helped someone', emoji: '🙋', points: 2 },
      { id: 'kind-words', name: 'Used kind words', emoji: '💬', points: 1 },
      { id: 'patience', name: 'Was patient', emoji: '⏰', points: 2 },
      { id: 'listen', name: 'Listened carefully', emoji: '👂', points: 1 },
      { id: 'apologize', name: 'Said sorry when needed', emoji: '🙏', points: 2 },
    ]
  },
  {
    id: 'safety',
    name: 'Staying Safe',
    emoji: '🛡️',
    color: 'bg-green-100 border-green-400',
    choices: [
      { id: 'seatbelt', name: 'Wore seatbelt', emoji: '🚗', points: 1 },
      { id: 'helmet', name: 'Wore helmet', emoji: '⛑️', points: 1 },
      { id: 'look-both', name: 'Looked both ways', emoji: '👀', points: 1 },
      { id: 'stranger', name: 'Stayed with trusted adult', emoji: '👨‍👩‍👧', points: 1 },
      { id: 'ask-help', name: 'Asked for help when needed', emoji: '🆘', points: 2 },
      { id: 'follow-rules', name: 'Followed safety rules', emoji: '✅', points: 1 },
    ]
  },
  {
    id: 'feelings',
    name: 'Managing Feelings',
    emoji: '😊',
    color: 'bg-purple-100 border-purple-400',
    choices: [
      { id: 'deep-breath', name: 'Took deep breaths', emoji: '🌬️', points: 1 },
      { id: 'talk-feelings', name: 'Talked about feelings', emoji: '💭', points: 2 },
      { id: 'calm-down', name: 'Used calm-down strategy', emoji: '😌', points: 2 },
      { id: 'positive', name: 'Thought positive thoughts', emoji: '☀️', points: 1 },
      { id: 'brave', name: 'Was brave', emoji: '🦁', points: 2 },
      { id: 'try-again', name: 'Tried again after mistake', emoji: '💪', points: 2 },
    ]
  },
  {
    id: 'learning',
    name: 'Learning & Growing',
    emoji: '📚',
    color: 'bg-yellow-100 border-yellow-400',
    choices: [
      { id: 'read', name: 'Read or looked at books', emoji: '📖', points: 1 },
      { id: 'question', name: 'Asked a question', emoji: '❓', points: 1 },
      { id: 'try-hard', name: 'Tried my best', emoji: '⭐', points: 2 },
      { id: 'focus', name: 'Stayed focused', emoji: '🎯', points: 2 },
      { id: 'practice', name: 'Practiced something', emoji: '🔄', points: 1 },
      { id: 'learn-new', name: 'Learned something new', emoji: '💡', points: 2 },
    ]
  },
];

// Achievement levels
const LEVELS = [
  { points: 0, name: 'Getting Started', emoji: '🌱', color: 'bg-gray-100' },
  { points: 5, name: 'Good Choices', emoji: '⭐', color: 'bg-yellow-100' },
  { points: 10, name: 'Healthy Helper', emoji: '🌟', color: 'bg-yellow-200' },
  { points: 15, name: 'Super Star', emoji: '💫', color: 'bg-orange-100' },
  { points: 20, name: 'Amazing!', emoji: '🏆', color: 'bg-orange-200' },
  { points: 30, name: 'Champion!', emoji: '👑', color: 'bg-purple-100' },
];

const HealthyChoices = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [choices, setChoices] = useState([]);
  const [allData, setAllData] = useState({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationLevel, setCelebrationLevel] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  
  // Schedule integration state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [choiceToSchedule, setChoiceToSchedule] = useState(null);

  // Convert allData to points for graph display
  const historyData = useMemo(() => {
    const data = {};
    Object.entries(allData).forEach(([date, choicesArray]) => {
      if (Array.isArray(choicesArray)) {
        data[date] = choicesArray.reduce((sum, c) => sum + (c.points || 1), 0);
      }
    });
    return data;
  }, [allData]);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setAllData(data);
        setChoices(data[selectedDate] || []);
      } catch (e) {
        console.error('Error loading choices:', e);
      }
    }
  }, [selectedDate]);

  // Save data
  const saveData = (newChoices) => {
    const newAllData = { ...allData, [selectedDate]: newChoices };
    setAllData(newAllData);
    setChoices(newChoices);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAllData));
  };

  // Schedule reminder handler - Updated to work with new AddToScheduleModal
  const handleScheduleSuccess = ({ date, time, activityId }) => {
    if (!choiceToSchedule) return;
    setShowScheduleModal(false);
    setChoiceToSchedule(null);
    alert(`"${choiceToSchedule.name}" reminder added to your Visual Schedule for ${date}!`);
  };

  // Open schedule modal for a choice
  const openScheduleModal = (choice, e) => {
    e.stopPropagation(); // Don't toggle the choice
    setChoiceToSchedule(choice);
    setShowScheduleModal(true);
  };

  // Toggle choice
  const toggleChoice = (choice) => {
    const existingIndex = choices.findIndex(c => c.id === choice.id);
    let newChoices;
    
    if (existingIndex >= 0) {
      newChoices = choices.filter(c => c.id !== choice.id);
    } else {
      newChoices = [...choices, { id: choice.id, points: choice.points, loggedAt: new Date().toISOString() }];
      
      // Check for level up
      const oldPoints = choices.reduce((sum, c) => sum + (c.points || 1), 0);
      const newPoints = newChoices.reduce((sum, c) => sum + (c.points || 1), 0);
      
      const oldLevel = LEVELS.filter(l => l.points <= oldPoints).pop();
      const newLevel = LEVELS.filter(l => l.points <= newPoints).pop();
      
      if (newLevel && oldLevel && newLevel.points > oldLevel.points) {
        setCelebrationLevel(newLevel);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }
    
    saveData(newChoices);
  };

  // Check if choice is logged
  const isLogged = (choiceId) => choices.some(c => c.id === choiceId);

  // Calculate total points
  const totalPoints = choices.reduce((sum, c) => sum + (c.points || 1), 0);

  // Get current level
  const currentLevel = LEVELS.filter(l => l.points <= totalPoints).pop() || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.points > totalPoints);

  // Is today?
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
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/activities')}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border-3 border-[#5CB85C]
                       rounded-full font-crayon text-sm text-[#5CB85C] hover:bg-[#5CB85C]
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
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
                       ${isToday ? 'opacity-30' : 'hover:border-gray-400'}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Progress Card */}
        <div className={`rounded-2xl border-4 border-[#5CB85C] p-4 mb-6 shadow-crayon ${currentLevel.color}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{currentLevel.emoji}</span>
              <div>
                <p className="font-display text-lg text-gray-800">{currentLevel.name}</p>
                <p className="font-crayon text-sm text-gray-600">
                  <Star size={14} className="inline text-yellow-500" fill="currentColor" /> 
                  {totalPoints} points
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="font-crayon text-2xl text-[#5CB85C]">{choices.length}</p>
              <p className="font-crayon text-xs text-gray-500">choices</p>
            </div>
          </div>

          {/* Progress to next level */}
          {nextLevel && (
            <div>
              <div className="flex justify-between text-xs font-crayon text-gray-600 mb-1">
                <span>Next: {nextLevel.emoji} {nextLevel.name}</span>
                <span>{nextLevel.points - totalPoints} more</span>
              </div>
              <div className="h-3 bg-white/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#5CB85C] transition-all duration-300"
                  style={{ 
                    width: `${((totalPoints - currentLevel.points) / (nextLevel.points - currentLevel.points)) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}

          {!nextLevel && (
            <div className="text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto" />
              <p className="font-crayon text-sm text-gray-600">Maximum level reached!</p>
            </div>
          )}
        </div>

        {/* Choice Categories */}
        <div className="space-y-4">
          {CHOICE_CATEGORIES.map(category => (
            <div key={category.id} className={`rounded-2xl border-3 ${category.color} overflow-hidden`}>
              <div className="p-3 flex items-center gap-2">
                <span className="text-2xl">{category.emoji}</span>
                <h3 className="font-display text-gray-700">{category.name}</h3>
                <span className="ml-auto font-crayon text-sm text-gray-500">
                  {category.choices.filter(c => isLogged(c.id)).length}/{category.choices.length}
                </span>
              </div>
              <div className="bg-white p-3 grid grid-cols-2 gap-2">
                {category.choices.map(choice => {
                  const logged = isLogged(choice.id);
                  return (
                    <div key={choice.id} className="relative group">
                      <button
                        onClick={() => isToday && toggleChoice(choice)}
                        disabled={!isToday}
                        className={`w-full p-3 rounded-xl border-2 flex items-center gap-2 transition-all
                                   ${logged 
                                     ? 'bg-green-100 border-green-400' 
                                     : 'bg-gray-50 border-gray-200 hover:border-green-300'
                                   }
                                   ${!isToday ? 'opacity-60' : 'active:scale-95'}`}
                      >
                        <span className="text-2xl">{choice.emoji}</span>
                        <div className="flex-1 text-left">
                          <span className={`font-crayon text-sm block ${logged ? 'text-green-700' : 'text-gray-600'}`}>
                            {choice.name}
                          </span>
                          <span className="font-crayon text-xs text-gray-400">
                            +{choice.points} {choice.points === 1 ? 'pt' : 'pts'}
                          </span>
                        </div>
                        {logged && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Star size={14} className="text-white" fill="currentColor" />
                          </div>
                        )}
                      </button>
                      {/* Schedule button - appears on hover */}
                      <button
                        onClick={(e) => openScheduleModal(choice, e)}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-[#5CB85C] rounded-full 
                                   flex items-center justify-center shadow-md
                                   opacity-0 group-hover:opacity-100 transition-opacity
                                   hover:bg-green-600"
                        title="Schedule reminder"
                      >
                        <CalendarPlus size={12} className="text-white" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-purple-50 rounded-2xl border-3 border-purple-200">
          <h3 className="font-display text-purple-700 mb-2 flex items-center gap-2">
            <Sparkles size={18} />
            Tips
          </h3>
          <ul className="font-crayon text-sm text-purple-600 space-y-1">
            <li>• Every healthy choice earns points!</li>
            <li>• Harder choices are worth more points</li>
            <li>• Level up by making lots of good choices</li>
            <li>• Hover/tap the 📅 to schedule reminders</li>
          </ul>
        </div>
      </main>

      {/* Add to Schedule Modal - Using new API */}
      {choiceToSchedule && (
        <AddToScheduleModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setChoiceToSchedule(null);
          }}
          onSuccess={handleScheduleSuccess}
          title="Schedule Reminder"
          itemName={choiceToSchedule.name}
          itemEmoji={choiceToSchedule.emoji}
          itemColor={SOURCE_COLORS[SCHEDULE_SOURCES.HEALTHY_CHOICES]}
          itemSource={SCHEDULE_SOURCES.HEALTHY_CHOICES}
          defaultTime="09:00"
          showTimeSelection={true}
          showNotifyOption={true}
          confirmText="Add Reminder"
          itemMetadata={{ 
            choiceId: choiceToSchedule.id,
            points: choiceToSchedule.points 
          }}
        />
      )}
    </div>
  );
};

export default HealthyChoices;
