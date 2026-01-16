// CopingSkillsChart.jsx - Personalized Coping Strategies Tool
// Part of the Emotional Wellness hub
// UPDATED: Added Visual Schedule integration using EXISTING scheduleHelper

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart,
  Plus,
  Star,
  Trash2,
  Printer,
  X,
  Check,
  ChevronRight,
  Volume2,
  HelpCircle,
  CalendarPlus,
  Bell
} from 'lucide-react';
import { getPictogramUrl } from '../services/arasaac';
// Use EXISTING scheduleHelper exports only
import { 
  addActivityToSchedule,
  addMultipleActivities,
  getToday, 
  getTomorrow,
  formatDateDisplay,
  formatTimeDisplay,
  SCHEDULE_SOURCES,
  SOURCE_COLORS 
} from '../services/scheduleHelper';

// ============================================
// STORAGE KEY
// ============================================
const STORAGE_KEY = 'snw_coping_skills';

// ============================================
// EMOTIONS DATA
// ============================================
const EMOTIONS = [
  { id: 'angry', name: 'Angry', color: '#E63B2E', bgColor: '#FDEDEC', arasaacId: 11318, emoji: '😠' },
  { id: 'sad', name: 'Sad', color: '#4A9FD4', bgColor: '#EBF5FB', arasaacId: 11321, emoji: '😢' },
  { id: 'scared', name: 'Scared', color: '#8E6BBF', bgColor: '#F4ECF7', arasaacId: 6459, emoji: '😨' },
  { id: 'worried', name: 'Worried', color: '#6B7280', bgColor: '#F3F4F6', arasaacId: 11332, emoji: '😟' },
  { id: 'frustrated', name: 'Frustrated', color: '#F5A623', bgColor: '#FEF5E7', arasaacId: 11323, emoji: '😤' },
  { id: 'overwhelmed', name: 'Overwhelmed', color: '#EC4899', bgColor: '#FDF2F8', arasaacId: 11325, emoji: '😵' },
  { id: 'lonely', name: 'Lonely', color: '#64748B', bgColor: '#F1F5F9', arasaacId: 11331, emoji: '😔' },
  { id: 'excited', name: 'Too Excited', color: '#E86B9A', bgColor: '#FDEBF0', arasaacId: 11319, emoji: '🤪' },
];

// ============================================
// CATEGORIES
// ============================================
const CATEGORIES = [
  { id: 'breathing', name: 'Breathing', icon: '🌬️', color: '#87CEEB' },
  { id: 'movement', name: 'Movement', icon: '🏃', color: '#5CB85C' },
  { id: 'sensory', name: 'Sensory', icon: '✋', color: '#E86B9A' },
  { id: 'mental', name: 'Thinking', icon: '🧠', color: '#8E6BBF' },
  { id: 'social', name: 'Social', icon: '👥', color: '#F5A623' },
  { id: 'creative', name: 'Creative', icon: '🎨', color: '#4A9FD4' },
  { id: 'custom', name: 'My Own', icon: '⭐', color: '#20B2AA' },
];

// ============================================
// PRE-BUILT COPING STRATEGIES
// ============================================
const DEFAULT_STRATEGIES = [
  // Breathing
  { id: 'deep-breaths', name: 'Take Deep Breaths', category: 'breathing', icon: '🌬️', arasaacId: 37285, 
    description: 'Breathe in slowly for 4 counts, hold for 4, breathe out for 4' },
  { id: 'belly-breathing', name: 'Belly Breathing', category: 'breathing', icon: '🫁', arasaacId: 37285,
    description: 'Put hand on tummy and feel it rise and fall as you breathe' },
  { id: 'smell-flower', name: 'Smell the Flower', category: 'breathing', icon: '🌸', arasaacId: 2270,
    description: 'Pretend to smell a flower (breathe in) then blow out a candle (breathe out)' },
  
  // Movement
  { id: 'walk', name: 'Go for a Walk', category: 'movement', icon: '🚶', arasaacId: 3019,
    description: 'Walk around to move your body and clear your mind' },
  { id: 'jump', name: 'Jump Up and Down', category: 'movement', icon: '🦘', arasaacId: 6456,
    description: 'Jump to let out energy - try 10 jumps!' },
  { id: 'stretch', name: 'Stretch Your Body', category: 'movement', icon: '🧘', arasaacId: 3024,
    description: 'Reach up high, touch your toes, roll your shoulders' },
  { id: 'dance', name: 'Dance It Out', category: 'movement', icon: '💃', arasaacId: 3208,
    description: 'Put on music and move your body however feels good' },
  { id: 'run', name: 'Run or Jog', category: 'movement', icon: '🏃', arasaacId: 2995,
    description: 'Run around to use up extra energy' },
  
  // Sensory
  { id: 'squeeze', name: 'Squeeze Something', category: 'sensory', icon: '🤜', arasaacId: 6458,
    description: 'Squeeze a stress ball, pillow, or playdough' },
  { id: 'cold-water', name: 'Cold Water on Face', category: 'sensory', icon: '💧', arasaacId: 2262,
    description: 'Splash cold water on your face or hold ice cubes' },
  { id: 'weighted', name: 'Use a Weighted Blanket', category: 'sensory', icon: '🛏️', arasaacId: 5003,
    description: 'Wrap up in a heavy blanket for a calming squeeze' },
  { id: 'fidget', name: 'Use a Fidget Toy', category: 'sensory', icon: '🔮', arasaacId: 2467,
    description: 'Play with a fidget spinner, cube, or squishy' },
  { id: 'hug', name: 'Get a Hug', category: 'sensory', icon: '🤗', arasaacId: 6458,
    description: 'Ask someone for a hug, or hug a stuffed animal' },
  
  // Mental
  { id: 'count', name: 'Count to 10', category: 'mental', icon: '🔢', arasaacId: 6080,
    description: 'Count slowly to 10 (or backwards from 10 to 1)' },
  { id: 'five-senses', name: '5-4-3-2-1 Senses', category: 'mental', icon: '👁️', arasaacId: 3387,
    description: '5 things you see, 4 hear, 3 touch, 2 smell, 1 taste' },
  { id: 'happy-place', name: 'Think of Happy Place', category: 'mental', icon: '🏖️', arasaacId: 7295,
    description: 'Close eyes and imagine your favorite calm place' },
  { id: 'positive-thought', name: 'Think a Positive Thought', category: 'mental', icon: '💭', arasaacId: 7132,
    description: '"I can do this" or "This feeling will pass"' },
  
  // Social
  { id: 'talk', name: 'Talk to Someone', category: 'social', icon: '💬', arasaacId: 6457,
    description: 'Tell a trusted person how you feel' },
  { id: 'ask-help', name: 'Ask for Help', category: 'social', icon: '🙋', arasaacId: 6462,
    description: 'It\'s okay to need help - ask someone you trust' },
  { id: 'alone-time', name: 'Take Alone Time', category: 'social', icon: '🚪', arasaacId: 4871,
    description: 'Go to a quiet place by yourself for a few minutes' },
  
  // Creative
  { id: 'draw', name: 'Draw or Color', category: 'creative', icon: '🎨', arasaacId: 5547,
    description: 'Express yourself through art - draw how you feel' },
  { id: 'music', name: 'Listen to Music', category: 'creative', icon: '🎵', arasaacId: 3098,
    description: 'Put on calming music or your favorite song' },
  { id: 'write', name: 'Write It Down', category: 'creative', icon: '✏️', arasaacId: 5548,
    description: 'Write about how you feel in a journal' },
  { id: 'sing', name: 'Sing a Song', category: 'creative', icon: '🎤', arasaacId: 3090,
    description: 'Sing your favorite song - loud or soft!' },
];

// ============================================
// SPEAK FUNCTION
// ============================================
const speak = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }
};

// ============================================
// SCHEDULE COPING BREAKS MODAL
// ============================================
const ScheduleBreaksModal = ({ isOpen, onClose, allStrategies }) => {
  const [scheduleType, setScheduleType] = useState('single');
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [routineBreaks, setRoutineBreaks] = useState([
    { time: '10:00', strategyId: null },
    { time: '14:00', strategyId: null },
    { time: '16:00', strategyId: null },
  ]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  if (!isOpen) return null;
  
  // Use existing addActivityToSchedule for single break
  const handleAddSingleBreak = () => {
    if (!selectedStrategy) {
      setError('Please select a coping strategy');
      return;
    }
    
    const strategy = allStrategies.find(s => s.id === selectedStrategy);
    if (!strategy) {
      setError('Strategy not found');
      return;
    }
    
    const result = addActivityToSchedule({
      date: selectedDate,
      time: selectedTime,
      name: strategy.name,
      emoji: strategy.icon,
      color: '#20B2AA',
      source: SCHEDULE_SOURCES?.MANUAL || 'manual',
      notify: true,
      metadata: { type: 'coping-skill', skill: strategy.name },
    });
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setSelectedStrategy(null);
      }, 1500);
    } else {
      setError(result.error);
    }
  };
  
  // Use existing addMultipleActivities for routine
  const handleAddRoutine = () => {
    const validBreaks = routineBreaks.filter(b => b.strategyId);
    if (validBreaks.length === 0) {
      setError('Please select at least one strategy');
      return;
    }
    
    const activities = validBreaks.map(b => {
      const strategy = allStrategies.find(s => s.id === b.strategyId);
      return {
        date: selectedDate,
        time: b.time,
        name: strategy?.name || 'Coping Break',
        emoji: strategy?.icon || '🧘',
        color: '#20B2AA',
        source: SCHEDULE_SOURCES?.MANUAL || 'manual',
        notify: true,
        metadata: { type: 'coping-skill', skill: strategy?.name },
      };
    });
    
    const result = addMultipleActivities(activities);
    
    if (result.success || result.count > 0) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } else {
      setError('Failed to add routine');
    }
  };
  
  const updateRoutineBreak = (index, field, value) => {
    setRoutineBreaks(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  
  const addRoutineBreak = () => {
    setRoutineBreaks(prev => [...prev, { time: '12:00', strategyId: null }]);
  };
  
  const removeRoutineBreak = (index) => {
    setRoutineBreaks(prev => prev.filter((_, i) => i !== index));
  };
  
  const timeOptions = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];
  
  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h3 className="font-display text-xl text-green-600">Added to Schedule!</h3>
          <p className="font-crayon text-gray-500 mt-2">
            Check your Visual Schedule for coping break reminders
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#20B2AA] text-white p-4 flex items-center gap-3 rounded-t-2xl">
          <CalendarPlus size={24} />
          <h3 className="font-display text-xl flex-1">Schedule Coping Breaks</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Type Selection */}
          <div className="flex gap-2">
            <button
              onClick={() => setScheduleType('single')}
              className={`flex-1 py-3 rounded-xl font-display text-sm border-2 transition-all
                        ${scheduleType === 'single' 
                          ? 'bg-[#20B2AA] text-white border-[#20B2AA]' 
                          : 'bg-white text-gray-600 border-gray-200'}`}
            >
              One Break
            </button>
            <button
              onClick={() => setScheduleType('routine')}
              className={`flex-1 py-3 rounded-xl font-display text-sm border-2 transition-all
                        ${scheduleType === 'routine' 
                          ? 'bg-[#20B2AA] text-white border-[#20B2AA]' 
                          : 'bg-white text-gray-600 border-gray-200'}`}
            >
              Daily Routine
            </button>
          </div>
          
          {/* Date Selection */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">Which day?</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedDate(getToday())}
                className={`flex-1 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                          ${selectedDate === getToday() 
                            ? 'bg-[#20B2AA]/20 border-[#20B2AA] text-[#20B2AA]' 
                            : 'bg-white border-gray-200 text-gray-600'}`}
              >
                Today
              </button>
              <button
                onClick={() => setSelectedDate(getTomorrow())}
                className={`flex-1 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                          ${selectedDate === getTomorrow() 
                            ? 'bg-[#20B2AA]/20 border-[#20B2AA] text-[#20B2AA]' 
                            : 'bg-white border-gray-200 text-gray-600'}`}
              >
                Tomorrow
              </button>
            </div>
          </div>
          
          {/* Single Break Mode */}
          {scheduleType === 'single' && (
            <>
              {/* Time Selection */}
              <div>
                <label className="block font-crayon text-gray-600 mb-2">What time?</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl font-crayon focus:border-[#20B2AA] outline-none"
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{formatTimeDisplay(time)}</option>
                  ))}
                </select>
              </div>
              
              {/* Strategy Selection */}
              <div>
                <label className="block font-crayon text-gray-600 mb-2">Which coping strategy?</label>
                <div className="max-h-48 overflow-y-auto space-y-2 border-2 border-gray-100 rounded-xl p-2">
                  {allStrategies.slice(0, 20).map(strategy => (
                    <button
                      key={strategy.id}
                      onClick={() => setSelectedStrategy(strategy.id)}
                      className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 text-left transition-all
                                ${selectedStrategy === strategy.id 
                                  ? 'bg-[#20B2AA]/20 border-[#20B2AA]' 
                                  : 'bg-white border-gray-100 hover:border-gray-200'}`}
                    >
                      <span className="text-2xl">{strategy.icon}</span>
                      <div>
                        <p className="font-display text-sm">{strategy.name}</p>
                        <p className="font-crayon text-xs text-gray-400">
                          {CATEGORIES.find(c => c.id === strategy.category)?.name}
                        </p>
                      </div>
                      {selectedStrategy === strategy.id && (
                        <Check size={18} className="text-[#20B2AA] ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {/* Routine Mode */}
          {scheduleType === 'routine' && (
            <div>
              <label className="block font-crayon text-gray-600 mb-2">
                Plan your coping breaks for the day:
              </label>
              <div className="space-y-3">
                {routineBreaks.map((brk, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <select
                      value={brk.time}
                      onChange={(e) => updateRoutineBreak(index, 'time', e.target.value)}
                      className="w-24 p-2 border-2 border-gray-200 rounded-lg font-crayon text-sm focus:border-[#20B2AA] outline-none"
                    >
                      {timeOptions.map(time => (
                        <option key={time} value={time}>{formatTimeDisplay(time)}</option>
                      ))}
                    </select>
                    <select
                      value={brk.strategyId || ''}
                      onChange={(e) => updateRoutineBreak(index, 'strategyId', e.target.value || null)}
                      className="flex-1 p-2 border-2 border-gray-200 rounded-lg font-crayon text-sm focus:border-[#20B2AA] outline-none"
                    >
                      <option value="">Select strategy...</option>
                      {allStrategies.slice(0, 20).map(strategy => (
                        <option key={strategy.id} value={strategy.id}>
                          {strategy.icon} {strategy.name}
                        </option>
                      ))}
                    </select>
                    {routineBreaks.length > 1 && (
                      <button
                        onClick={() => removeRoutineBreak(index)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addRoutineBreak}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-crayon
                           hover:border-[#20B2AA] hover:text-[#20B2AA] transition-colors"
                >
                  <Plus size={16} className="inline mr-1" />
                  Add another break
                </button>
              </div>
            </div>
          )}
          
          {/* Preview */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="font-crayon text-sm text-gray-600">
              <Bell size={14} className="inline mr-1 text-[#20B2AA]" />
              {scheduleType === 'single' 
                ? `You'll get a reminder at ${formatTimeDisplay(selectedTime)} on ${formatDateDisplay(selectedDate)} to use your coping skill.`
                : `You'll get ${routineBreaks.filter(b => b.strategyId).length} coping break reminders on ${formatDateDisplay(selectedDate)}.`
              }
            </p>
          </div>
          
          {error && (
            <p className="text-red-500 font-crayon text-sm text-center">{error}</p>
          )}
          
          {/* Add Button */}
          <button
            onClick={scheduleType === 'single' ? handleAddSingleBreak : handleAddRoutine}
            className="w-full py-3 bg-[#20B2AA] text-white rounded-xl font-display
                     hover:bg-[#1A9590] transition-colors"
          >
            <CalendarPlus size={18} className="inline mr-2" />
            Add to Visual Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// STRATEGY CARD COMPONENT
// ============================================
const StrategyCard = ({ strategy, isSelected, isFavorite, onToggle, onToggleFavorite, onSpeak }) => {
  return (
    <div
      className={`relative p-3 rounded-xl border-3 transition-all ${
        isSelected 
          ? 'bg-green-50 border-green-400' 
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-1
                    ${isSelected 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300'}`}
        >
          {isSelected && <Check size={14} />}
        </button>
        
        {/* Icon */}
        {strategy.arasaacId ? (
          <img
            src={getPictogramUrl(strategy.arasaacId)}
            alt={strategy.name}
            className="w-12 h-12 object-contain flex-shrink-0"
          />
        ) : (
          <span className="text-3xl">{strategy.icon}</span>
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-display text-gray-800">{strategy.name}</h4>
            <button
              onClick={onToggleFavorite}
              className={`p-1 rounded transition-colors ${
                isFavorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
              }`}
            >
              <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
          {strategy.description && (
            <p className="font-crayon text-sm text-gray-500 mt-1">{strategy.description}</p>
          )}
        </div>
        
        {/* Speak Button */}
        <button
          onClick={() => onSpeak(strategy.name + '. ' + (strategy.description || ''))}
          className="p-2 text-gray-400 hover:text-[#4A9FD4] hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
        >
          <Volume2 size={18} />
        </button>
      </div>
    </div>
  );
};

// ============================================
// INFO MODAL
// ============================================
const InfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-[#5CB85C]">How to Use</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={24} className="text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-4 font-crayon text-gray-600">
          <div className="flex items-start gap-3">
            <span className="text-2xl">1️⃣</span>
            <p>Click "Edit My Chart" to build your personal coping toolkit</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">2️⃣</span>
            <p>Pick a feeling, then choose strategies that help YOU</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">3️⃣</span>
            <p>Star ⭐ your favorites for quick access</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">4️⃣</span>
            <p>When you feel that emotion, find your strategies in "My Chart"</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📅</span>
            <p><strong>NEW!</strong> Schedule coping breaks throughout your day!</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-[#5CB85C] text-white rounded-xl font-display"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const CopingSkillsChart = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('chart');
  const [userStrategies, setUserStrategies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingEmotion, setEditingEmotion] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  const allStrategies = [...DEFAULT_STRATEGIES, ...userStrategies.filter(s => s.isCustom)];
  
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setUserStrategies(data.strategies || []);
        setFavorites(data.favorites || []);
      } catch (e) {
        console.error('Error loading coping skills:', e);
      }
    }
  }, []);
  
  const saveData = (strategies, favs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      strategies,
      favorites: favs,
    }));
  };
  
  const toggleStrategy = (strategyId, emotionId) => {
    const existing = userStrategies.find(s => s.id === strategyId);
    let updated;
    
    if (existing) {
      const emotions = existing.emotions || [];
      if (emotions.includes(emotionId)) {
        const newEmotions = emotions.filter(e => e !== emotionId);
        if (newEmotions.length === 0) {
          updated = userStrategies.filter(s => s.id !== strategyId);
        } else {
          updated = userStrategies.map(s => 
            s.id === strategyId ? { ...s, emotions: newEmotions } : s
          );
        }
      } else {
        updated = userStrategies.map(s => 
          s.id === strategyId ? { ...s, emotions: [...emotions, emotionId] } : s
        );
      }
    } else {
      const strategy = DEFAULT_STRATEGIES.find(s => s.id === strategyId);
      if (strategy) {
        updated = [...userStrategies, { ...strategy, emotions: [emotionId] }];
      } else {
        return;
      }
    }
    
    setUserStrategies(updated);
    saveData(updated, favorites);
  };
  
  const toggleFavorite = (strategyId) => {
    const updated = favorites.includes(strategyId)
      ? favorites.filter(id => id !== strategyId)
      : [...favorites, strategyId];
    setFavorites(updated);
    saveData(userStrategies, updated);
  };
  
  const getStrategiesForEmotion = (emotionId) => {
    return userStrategies.filter(s => s.emotions?.includes(emotionId));
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/wellness')}
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
            <h1 className="text-lg sm:text-xl font-display text-[#5CB85C] crayon-text flex items-center gap-2">
              📋 Coping Skills
            </h1>
          </div>
          
          {/* Actions */}
          <button
            onClick={() => setShowScheduleModal(true)}
            className="p-2 rounded-full hover:bg-[#20B2AA]/10 print:hidden"
            title="Schedule coping breaks"
          >
            <CalendarPlus size={22} className="text-[#20B2AA]" />
          </button>
          <button
            onClick={() => setShowInfo(true)}
            className="p-2 rounded-full hover:bg-gray-100 print:hidden"
          >
            <HelpCircle size={22} className="text-gray-400" />
          </button>
          <button
            onClick={handlePrint}
            className="p-2 rounded-full hover:bg-gray-100 print:hidden"
          >
            <Printer size={22} className="text-gray-400" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* View Toggle */}
        <div className="flex gap-2 mb-6 print:hidden">
          <button
            onClick={() => { setView('chart'); setEditingEmotion(null); }}
            className={`flex-1 py-3 rounded-xl font-display transition-all ${
              view === 'chart' 
                ? 'bg-[#5CB85C] text-white shadow-md' 
                : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#5CB85C]'
            }`}
          >
            My Chart
          </button>
          <button
            onClick={() => setView('edit')}
            className={`flex-1 py-3 rounded-xl font-display transition-all ${
              view === 'edit' 
                ? 'bg-[#5CB85C] text-white shadow-md' 
                : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#5CB85C]'
            }`}
          >
            Edit My Chart
          </button>
        </div>
        
        {/* Schedule Card */}
        <div className="p-4 bg-gradient-to-r from-[#20B2AA]/20 to-[#5CB85C]/20 rounded-2xl border-3 border-[#20B2AA]/30 mb-6 print:hidden">
          <h3 className="font-display text-gray-700 mb-2 flex items-center gap-2">
            <CalendarPlus size={18} className="text-[#20B2AA]" />
            Schedule Coping Breaks
          </h3>
          <p className="font-crayon text-sm text-gray-600 mb-3">
            Add reminders to your Visual Schedule to practice coping skills throughout the day!
          </p>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2 bg-[#20B2AA] text-white rounded-xl font-display text-sm
                     hover:bg-[#1A9590] transition-colors"
          >
            <CalendarPlus size={16} className="inline mr-2" />
            Schedule Breaks
          </button>
        </div>

        {/* Chart View */}
        {view === 'chart' && (
          <div className="space-y-4">
            <p className="text-center font-crayon text-gray-600 mb-4">
              Your personalized coping strategies for different feelings
            </p>
            
            {/* Favorites */}
            {favorites.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-2xl border-3 border-yellow-300 mb-4">
                <h3 className="font-display text-yellow-700 mb-3 flex items-center gap-2">
                  <Star size={18} fill="currentColor" />
                  My Favorite Strategies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {favorites.map(favId => {
                    const strategy = allStrategies.find(s => s.id === favId);
                    if (!strategy) return null;
                    return (
                      <button
                        key={favId}
                        onClick={() => speak(strategy.name + '. ' + (strategy.description || ''))}
                        className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border-2 border-yellow-300
                                 hover:bg-yellow-100 transition-colors"
                      >
                        <span>{strategy.icon}</span>
                        <span className="font-crayon text-sm">{strategy.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Emotion Sections */}
            {EMOTIONS.map(emotion => {
              const strategies = getStrategiesForEmotion(emotion.id);
              if (strategies.length === 0) return null;
              
              return (
                <div 
                  key={emotion.id}
                  className="p-4 rounded-2xl border-3"
                  style={{ backgroundColor: emotion.bgColor, borderColor: emotion.color }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={getPictogramUrl(emotion.arasaacId)}
                      alt={emotion.name}
                      className="w-10 h-10 object-contain"
                    />
                    <h3 className="font-display" style={{ color: emotion.color }}>
                      When I feel {emotion.name}...
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {strategies.map(strategy => (
                      <button
                        key={strategy.id}
                        onClick={() => speak(strategy.name + '. ' + (strategy.description || ''))}
                        className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border-2 
                                 hover:scale-105 transition-transform"
                        style={{ borderColor: emotion.color }}
                      >
                        <span className="text-lg">{strategy.icon}</span>
                        <span className="font-crayon text-sm">{strategy.name}</span>
                        <Volume2 size={14} className="text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {/* Empty State */}
            {userStrategies.length === 0 && (
              <div className="text-center py-8">
                <p className="font-crayon text-gray-500 mb-4">
                  You haven't added any strategies yet!
                </p>
                <button
                  onClick={() => setView('edit')}
                  className="px-6 py-3 bg-[#5CB85C] text-white rounded-xl font-display
                           hover:bg-green-600 transition-colors"
                >
                  Build My Chart
                </button>
              </div>
            )}
          </div>
        )}

        {/* Edit View */}
        {view === 'edit' && (
          <div className="space-y-4">
            {!editingEmotion ? (
              <>
                <p className="text-center font-crayon text-gray-600 mb-4">
                  First, pick a feeling to add strategies for:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {EMOTIONS.map(emotion => {
                    const count = userStrategies.filter(s => s.emotions?.includes(emotion.id)).length;
                    return (
                      <button
                        key={emotion.id}
                        onClick={() => setEditingEmotion(emotion.id)}
                        className="p-4 rounded-2xl border-3 transition-all hover:scale-105"
                        style={{ 
                          borderColor: emotion.color, 
                          backgroundColor: emotion.bgColor 
                        }}
                      >
                        <img
                          src={getPictogramUrl(emotion.arasaacId)}
                          alt={emotion.name}
                          className="w-12 h-12 mx-auto mb-2 object-contain"
                        />
                        <p className="font-display text-sm" style={{ color: emotion.color }}>
                          {emotion.name}
                        </p>
                        <p className="font-crayon text-xs text-gray-500">
                          {count} strategies
                        </p>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                {(() => {
                  const emotion = EMOTIONS.find(e => e.id === editingEmotion);
                  const filteredStrategies = selectedCategory === 'all' 
                    ? DEFAULT_STRATEGIES 
                    : DEFAULT_STRATEGIES.filter(s => s.category === selectedCategory);
                  
                  return (
                    <>
                      <div 
                        className="p-4 rounded-2xl flex items-center gap-3"
                        style={{ backgroundColor: emotion.bgColor }}
                      >
                        <button
                          onClick={() => setEditingEmotion(null)}
                          className="p-2 rounded-full bg-white/50 hover:bg-white transition-colors"
                        >
                          <ArrowLeft size={18} style={{ color: emotion.color }} />
                        </button>
                        <img
                          src={getPictogramUrl(emotion.arasaacId)}
                          alt={emotion.name}
                          className="w-10 h-10 object-contain"
                        />
                        <div>
                          <h3 className="font-display" style={{ color: emotion.color }}>
                            When I feel {emotion.name}...
                          </h3>
                          <p className="font-crayon text-xs text-gray-500">
                            Select strategies that help you
                          </p>
                        </div>
                      </div>
                      
                      {/* Category Filter */}
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        <button
                          onClick={() => setSelectedCategory('all')}
                          className={`px-3 py-1.5 rounded-full text-sm font-crayon whitespace-nowrap
                                    ${selectedCategory === 'all' 
                                      ? 'bg-[#5CB85C] text-white' 
                                      : 'bg-gray-100 text-gray-600'
                                    }`}
                        >
                          All
                        </button>
                        {CATEGORIES.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-full text-sm font-crayon whitespace-nowrap
                                      ${selectedCategory === cat.id 
                                        ? 'bg-[#5CB85C] text-white' 
                                        : 'bg-gray-100 text-gray-600'
                                      }`}
                          >
                            {cat.icon} {cat.name}
                          </button>
                        ))}
                      </div>
                      
                      {/* Strategies List */}
                      <div className="space-y-3">
                        {filteredStrategies.map(strategy => {
                          const userStrategy = userStrategies.find(s => s.id === strategy.id);
                          const isSelected = userStrategy?.emotions?.includes(editingEmotion);
                          
                          return (
                            <StrategyCard
                              key={strategy.id}
                              strategy={strategy}
                              isSelected={isSelected}
                              isFavorite={favorites.includes(strategy.id)}
                              onToggle={() => toggleStrategy(strategy.id, editingEmotion)}
                              onToggleFavorite={() => toggleFavorite(strategy.id)}
                              onSpeak={speak}
                            />
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
      
      <ScheduleBreaksModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        allStrategies={allStrategies}
      />
    </div>
  );
};

export default CopingSkillsChart;
