// SensoryBreaks.jsx - Sensory Break activities for ATLASassist
// UPDATED: Added Visual Schedule integration
// Schedule regular sensory breaks throughout the day

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sparkles,
  X,
  Check,
  CalendarPlus,
  Bell,
  BellOff,
  Calendar,
  History,
  Zap,
} from 'lucide-react';
import { 
  addActivityToSchedule, 
  addMultipleActivitiesToSchedule,
  SCHEDULE_SOURCES, 
  SOURCE_COLORS,
  getToday,
  getTomorrow,
  formatDateDisplay,
  formatTimeDisplay 
} from '../services/scheduleHelper';
import { useToast } from '../components/ThemedToast';

const STORAGE_KEY = 'snw_sensory_breaks';

// Sensory break categories
const BREAK_CATEGORIES = [
  {
    id: 'movement',
    name: 'Movement',
    emoji: '🏃',
    color: '#5CB85C',
    description: 'Get your body moving!',
    activities: [
      { id: 'jumping-jacks', name: 'Jumping Jacks', emoji: '⭐', duration: 60, description: 'Jump and spread arms and legs' },
      { id: 'march', name: 'March in Place', emoji: '🚶', duration: 60, description: 'Lift your knees high' },
      { id: 'stretch', name: 'Big Stretches', emoji: '🧘', duration: 45, description: 'Reach up high, then touch your toes' },
      { id: 'animal-walk', name: 'Animal Walks', emoji: '🐻', duration: 60, description: 'Walk like a bear, crab, or frog' },
      { id: 'shake', name: 'Shake It Out', emoji: '🎵', duration: 30, description: 'Shake your hands, feet, and whole body' },
    ],
  },
  {
    id: 'calming',
    name: 'Calming',
    emoji: '🧘',
    color: '#8E6BBF',
    description: 'Slow down and relax',
    activities: [
      { id: 'deep-breathing', name: 'Deep Breathing', emoji: '🌬️', duration: 60, description: 'Breathe in slowly, hold, breathe out' },
      { id: 'wall-push', name: 'Wall Push-Ups', emoji: '🧱', duration: 45, description: 'Push against the wall 10 times' },
      { id: 'self-hug', name: 'Self Hug', emoji: '🤗', duration: 30, description: 'Give yourself a big squeeze' },
      { id: 'quiet-sit', name: 'Quiet Sitting', emoji: '🪑', duration: 60, description: 'Sit still and listen to the quiet' },
      { id: 'progressive', name: 'Tense and Release', emoji: '💪', duration: 90, description: 'Squeeze muscles tight, then let go' },
    ],
  },
  {
    id: 'tactile',
    name: 'Touch',
    emoji: '✋',
    color: '#F5A623',
    description: 'Explore different textures',
    activities: [
      { id: 'fidget', name: 'Fidget Time', emoji: '🎯', duration: 120, description: 'Play with a fidget toy' },
      { id: 'playdough', name: 'Play-Dough', emoji: '🎨', duration: 180, description: 'Squish and shape play-dough' },
      { id: 'lotion', name: 'Lotion Rub', emoji: '🧴', duration: 60, description: 'Rub lotion on hands and arms' },
      { id: 'texture-box', name: 'Texture Hunt', emoji: '📦', duration: 120, description: 'Find different textures to touch' },
    ],
  },
  {
    id: 'visual',
    name: 'Visual',
    emoji: '👀',
    color: '#4A9FD4',
    description: 'Rest and refocus your eyes',
    activities: [
      { id: 'eye-rest', name: 'Eye Rest', emoji: '😌', duration: 60, description: 'Close eyes and rest in darkness' },
      { id: 'lava-lamp', name: 'Watch Something Flow', emoji: '🌊', duration: 120, description: 'Watch a lava lamp or timer' },
      { id: 'window-gaze', name: 'Window Gazing', emoji: '🪟', duration: 60, description: 'Look outside at far away things' },
      { id: 'dim-lights', name: 'Dim the Lights', emoji: '💡', duration: 120, description: 'Turn lights low and relax' },
    ],
  },
  {
    id: 'auditory',
    name: 'Sound',
    emoji: '🎵',
    color: '#E86B9A',
    description: 'Listen and make sounds',
    activities: [
      { id: 'quiet-time', name: 'Quiet Time', emoji: '🤫', duration: 120, description: 'Find a quiet spot to rest' },
      { id: 'music', name: 'Calming Music', emoji: '🎶', duration: 180, description: 'Listen to soft, calm music' },
      { id: 'humming', name: 'Humming', emoji: '🐝', duration: 60, description: 'Hum your favorite tune' },
      { id: 'headphones', name: 'Headphone Break', emoji: '🎧', duration: 120, description: 'Use headphones for quiet' },
    ],
  },
];

// =====================================================
// ADD TO SCHEDULE MODAL - Single Break
// =====================================================
const AddToScheduleModal = ({ isOpen, onClose, activity, category, onAdd }) => {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [enableReminder, setEnableReminder] = useState(true);

  if (!isOpen || !activity) return null;

  const handleAdd = () => {
    onAdd({
      activity,
      category,
      date: selectedDate,
      time: selectedTime,
      reminder: enableReminder,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="text-white p-4 flex items-center gap-3" style={{ backgroundColor: category?.color || '#8E6BBF' }}>
          <CalendarPlus size={24} />
          <h3 className="font-display text-xl flex-1">Schedule Break</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Use Case Description */}
          <div className="p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
            <p className="font-crayon text-sm text-gray-700">
              🧘 <strong>Why schedule sensory breaks?</strong> Regular breaks help with 
              self-regulation, focus, and preventing overwhelm. Set a reminder to take 
              this break at the same time daily for consistent support.
            </p>
          </div>

          {/* Activity Preview */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: category?.color || '#8E6BBF' }}
            >
              <span className="text-2xl">{activity.emoji}</span>
            </div>
            <div>
              <p className="font-display text-gray-800">Sensory Break: {activity.name}</p>
              <p className="font-crayon text-sm text-gray-500">
                {Math.floor(activity.duration / 60)}:{(activity.duration % 60).toString().padStart(2, '0')} min
              </p>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">
              <Calendar size={16} className="inline mr-1" />
              When?
            </label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setSelectedDate(getToday())}
                className={`flex-1 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                          ${selectedDate === getToday() 
                            ? 'bg-gray-100' 
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                style={selectedDate === getToday() ? { borderColor: category?.color, color: category?.color } : {}}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate(getTomorrow())}
                className={`flex-1 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                          ${selectedDate === getTomorrow() 
                            ? 'bg-gray-100' 
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                style={selectedDate === getTomorrow() ? { borderColor: category?.color, color: category?.color } : {}}
              >
                Tomorrow
              </button>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border-2 border-gray-200 rounded-xl font-crayon"
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">
              <Clock size={16} className="inline mr-1" />
              What time?
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl font-crayon text-lg"
            />
            <p className="font-crayon text-xs text-gray-400 mt-1">
              Tip: Schedule breaks before activities that are challenging
            </p>
          </div>

          {/* Reminder Toggle */}
          <button
            type="button"
            onClick={() => setEnableReminder(!enableReminder)}
            className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all
              ${enableReminder ? 'bg-gray-50' : 'bg-gray-50 border-gray-200'}`}
            style={enableReminder ? { borderColor: category?.color } : {}}
          >
            <div 
              className="p-2 rounded-full"
              style={{ backgroundColor: enableReminder ? category?.color : '#9CA3AF' }}
            >
              {enableReminder ? (
                <Bell size={16} className="text-white" />
              ) : (
                <BellOff size={16} className="text-white" />
              )}
            </div>
            <span className="font-crayon text-gray-700 flex-1 text-left">
              {enableReminder ? 'Reminder on' : 'No reminder'}
            </span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 pt-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-3 border-gray-300 rounded-xl font-crayon text-gray-600
                       hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 py-3 bg-[#5CB85C] border-3 border-green-600 rounded-xl font-crayon text-white
                       hover:bg-green-600 transition-all flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Add to Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// SCHEDULE REGULAR BREAKS MODAL
// =====================================================
const ScheduleRegularBreaksModal = ({ isOpen, onClose, onAdd }) => {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('15:00');
  const [interval, setInterval] = useState(60); // minutes
  const [breakType, setBreakType] = useState('movement');
  const [enableReminder, setEnableReminder] = useState(true);

  if (!isOpen) return null;

  const handleAdd = () => {
    onAdd({
      date: selectedDate,
      startTime,
      endTime,
      interval,
      breakType,
      reminder: enableReminder,
    });
  };

  // Calculate number of breaks
  const calculateBreaks = () => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    return Math.floor((endMinutes - startMinutes) / interval) + 1;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#20B2AA] text-white p-4 flex items-center gap-3 sticky top-0">
          <Zap size={24} />
          <h3 className="font-display text-xl flex-1">Schedule Regular Breaks</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Use Case Description */}
          <div className="p-3 bg-teal-50 rounded-xl border-2 border-teal-200">
            <p className="font-crayon text-sm text-teal-700">
              ⚡ <strong>Why schedule regular breaks?</strong> Taking breaks at set intervals 
              throughout the day prevents sensory overload and helps maintain focus. 
              This will add multiple break reminders to your schedule automatically!
            </p>
          </div>

          {/* Break Type Selection */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">🧘 Break Type</label>
            <div className="grid grid-cols-2 gap-2">
              {BREAK_CATEGORIES.slice(0, 4).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setBreakType(cat.id)}
                  className={`p-2 rounded-xl font-crayon text-sm border-2 transition-all
                    ${breakType === cat.id 
                      ? 'text-white' 
                      : 'bg-white border-gray-200 text-gray-600'}`}
                  style={breakType === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">📅 Which day?</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border-2 border-gray-200 rounded-xl font-crayon"
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-crayon text-gray-600 mb-2">⏰ Start</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 border-2 border-gray-200 rounded-xl font-crayon"
              />
            </div>
            <div>
              <label className="block font-crayon text-gray-600 mb-2">⏰ End</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2 border-2 border-gray-200 rounded-xl font-crayon"
              />
            </div>
          </div>

          {/* Interval */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">🔄 How often?</label>
            <div className="flex gap-2">
              {[30, 45, 60, 90, 120].map(mins => (
                <button
                  key={mins}
                  onClick={() => setInterval(mins)}
                  className={`flex-1 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                    ${interval === mins 
                      ? 'bg-[#20B2AA] text-white border-[#20B2AA]' 
                      : 'bg-white border-gray-200 text-gray-600'}`}
                >
                  {mins < 60 ? `${mins}m` : `${mins / 60}h`}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
            <p className="font-crayon text-sm text-gray-700">
              This will add <strong className="text-[#20B2AA]">{calculateBreaks()} breaks</strong> to your schedule, 
              every {interval < 60 ? `${interval} minutes` : `${interval / 60} hour${interval > 60 ? 's' : ''}`} from {startTime} to {endTime}.
            </p>
          </div>

          {/* Reminder Toggle */}
          <button
            type="button"
            onClick={() => setEnableReminder(!enableReminder)}
            className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all
              ${enableReminder ? 'bg-teal-50 border-[#20B2AA]' : 'bg-gray-50 border-gray-200'}`}
          >
            <div className={`p-2 rounded-full ${enableReminder ? 'bg-[#20B2AA]' : 'bg-gray-300'}`}>
              {enableReminder ? (
                <Bell size={16} className="text-white" />
              ) : (
                <BellOff size={16} className="text-white" />
              )}
            </div>
            <span className="font-crayon text-gray-700 flex-1 text-left">
              {enableReminder ? 'Reminders on for all breaks' : 'No reminders'}
            </span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 pt-0 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-3 border-gray-300 rounded-xl font-crayon text-gray-600
                       hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 py-3 bg-[#5CB85C] border-3 border-green-600 rounded-xl font-crayon text-white
                       hover:bg-green-600 transition-all flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Add {calculateBreaks()} Breaks
          </button>
        </div>
      </div>
    </div>
  );
};

// Timer Component
const BreakTimer = ({ activity, onComplete, categoryColor }) => {
  const [timeLeft, setTimeLeft] = useState(activity.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsComplete(true);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((activity.duration - timeLeft) / activity.duration) * 100;

  return (
    <div className="bg-white rounded-2xl border-4 shadow-crayon p-6 text-center" style={{ borderColor: categoryColor }}>
      <span className="text-6xl block mb-4">{activity.emoji}</span>
      <h3 className="font-display text-xl text-gray-800 mb-2">{activity.name}</h3>
      <p className="font-crayon text-gray-500 mb-4">{activity.description}</p>
      
      {/* Progress Ring */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="#E5E7EB"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke={categoryColor}
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-display" style={{ color: categoryColor }}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Controls */}
      {!isComplete ? (
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-4 rounded-full text-white"
            style={{ backgroundColor: categoryColor }}
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button
            onClick={() => {
              setTimeLeft(activity.duration);
              setIsRunning(false);
            }}
            className="p-4 rounded-full bg-gray-200 text-gray-600"
          >
            <RotateCcw size={24} />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-4 bg-green-50 rounded-xl border-2 border-green-300">
            <Sparkles className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="font-display text-green-700">Break Complete! 🎉</p>
          </div>
          <button
            onClick={onComplete}
            className="px-6 py-2 bg-[#5CB85C] text-white rounded-xl font-crayon"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

// Main Component
const SensoryBreaks = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeBreak, setActiveBreak] = useState(null);
  const [breakHistory, setBreakHistory] = useState([]);
  
  // Schedule modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [activityToSchedule, setActivityToSchedule] = useState(null);
  const [categoryForSchedule, setCategoryForSchedule] = useState(null);
  const [showRegularBreaksModal, setShowRegularBreaksModal] = useState(false);

  // Load break history
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBreakHistory(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Save break to history
  const saveBreakToHistory = (activity, category) => {
    const entry = {
      id: Date.now(),
      activity: activity.name,
      category: category.name,
      emoji: activity.emoji,
      timestamp: new Date().toISOString(),
    };
    const newHistory = [entry, ...breakHistory].slice(0, 50);
    setBreakHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  // Handle schedule button click
  const handleScheduleClick = (activity, category) => {
    setActivityToSchedule(activity);
    setCategoryForSchedule(category);
    setShowScheduleModal(true);
  };

  // Handle add single break to schedule
  const handleAddToSchedule = ({ activity, category, date, time, reminder }) => {
    const result = addActivityToSchedule({
      date: date,
      name: `Sensory Break: ${activity.name}`,
      time: time,
      emoji: activity.emoji,
      color: category?.color || SOURCE_COLORS[SCHEDULE_SOURCES.SENSORY_BREAK],
      source: SCHEDULE_SOURCES.SENSORY_BREAK,
      notify: reminder,
      metadata: {
        activityId: activity.id,
        category: category.id,
        duration: activity.duration,
      },
    });

    setShowScheduleModal(false);
    setActivityToSchedule(null);
    setCategoryForSchedule(null);

    if (result && result.success) {
      toast.schedule(
        'Break Scheduled!',
        `"${activity.name}" is on your Visual Schedule for ${formatDateDisplay(date)} at ${formatTimeDisplay(time)}`
      );
    } else {
      toast.error('Oops!', 'Could not add to schedule. Please try again.');
    }
  };

  // Handle add regular breaks to schedule
  const handleAddRegularBreaks = ({ date, startTime, endTime, interval, breakType, reminder }) => {
    const category = BREAK_CATEGORIES.find(c => c.id === breakType);
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    
    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    
    const breaks = [];
    while (currentMinutes <= endMinutes) {
      const time = `${String(Math.floor(currentMinutes / 60)).padStart(2, '0')}:${String(currentMinutes % 60).padStart(2, '0')}`;
      breaks.push({
        name: `Sensory Break: ${category.name}`,
        time,
        emoji: category.emoji,
        color: category.color,
        metadata: { breakType, interval },
      });
      currentMinutes += interval;
    }

    const result = addMultipleActivitiesToSchedule({
      date,
      activities: breaks,
      source: SCHEDULE_SOURCES.SENSORY_BREAK,
      notify: reminder,
    });

    setShowRegularBreaksModal(false);

    if (result && result.success) {
      toast.schedule(
        'Breaks Scheduled!',
        `${breaks.length} sensory breaks added to your schedule for ${formatDateDisplay(date)}`
      );
    } else {
      toast.error('Oops!', 'Could not add breaks to schedule. Please try again.');
    }
  };

  // Complete break
  const handleBreakComplete = () => {
    if (activeBreak) {
      saveBreakToHistory(activeBreak.activity, activeBreak.category);
    }
    setActiveBreak(null);
    setSelectedCategory(null);
  };

  // If active break
  if (activeBreak) {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4" style={{ borderColor: activeBreak.category.color }}>
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setActiveBreak(null)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 rounded-xl font-display font-bold transition-all shadow-md"
              style={{ borderColor: activeBreak.category.color, color: activeBreak.category.color }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-display" style={{ color: activeBreak.category.color }}>
                {activeBreak.category.emoji} {activeBreak.category.name} Break
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          <BreakTimer 
            activity={activeBreak.activity} 
            categoryColor={activeBreak.category.color}
            onComplete={handleBreakComplete}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#20B2AA]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => {
              if (selectedCategory) {
                setSelectedCategory(null);
              } else {
                navigate('/wellness');
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#20B2AA] 
                       rounded-xl font-display font-bold text-[#20B2AA] hover:bg-[#20B2AA] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#20B2AA] crayon-text">
              🧘 Sensory Breaks
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Quick Schedule Button */}
        <button
          onClick={() => setShowRegularBreaksModal(true)}
          className="w-full mb-6 p-4 bg-gradient-to-r from-[#20B2AA] to-[#5CB85C] text-white 
                     rounded-2xl font-display flex items-center justify-center gap-3 shadow-lg
                     hover:opacity-90 transition-all"
        >
          <Zap size={24} />
          Schedule Regular Breaks
        </button>

        {/* Categories or Activities */}
        {!selectedCategory ? (
          <>
            <p className="text-center font-crayon text-gray-600 mb-4">
              Choose a type of sensory break
            </p>
            <div className="grid grid-cols-2 gap-4">
              {BREAK_CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category)}
                  className="p-6 bg-white rounded-2xl border-4 shadow-sm hover:shadow-md transition-all text-center"
                  style={{ borderColor: category.color }}
                >
                  <span className="text-5xl block mb-2">{category.emoji}</span>
                  <h3 className="font-display text-gray-800">{category.name}</h3>
                  <p className="font-crayon text-sm text-gray-500">{category.description}</p>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Back to Categories */}
            <button
              onClick={() => setSelectedCategory(null)}
              className="mb-4 font-crayon text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <ArrowLeft size={16} /> All categories
            </button>

            {/* Category Header */}
            <div 
              className="p-4 rounded-2xl mb-4 flex items-center gap-3"
              style={{ backgroundColor: `${selectedCategory.color}20` }}
            >
              <span className="text-4xl">{selectedCategory.emoji}</span>
              <div>
                <h2 className="font-display text-xl" style={{ color: selectedCategory.color }}>
                  {selectedCategory.name}
                </h2>
                <p className="font-crayon text-gray-600">{selectedCategory.description}</p>
              </div>
            </div>

            {/* Activities */}
            <div className="space-y-3">
              {selectedCategory.activities.map(activity => (
                <div
                  key={activity.id}
                  className="bg-white rounded-xl border-3 p-4 shadow-sm"
                  style={{ borderColor: selectedCategory.color }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{activity.emoji}</span>
                    <div className="flex-1">
                      <h4 className="font-display text-gray-800">{activity.name}</h4>
                      <p className="font-crayon text-sm text-gray-500">{activity.description}</p>
                      <p className="font-crayon text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Clock size={12} />
                        {Math.floor(activity.duration / 60)}:{(activity.duration % 60).toString().padStart(2, '0')}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setActiveBreak({ activity, category: selectedCategory })}
                        className="px-4 py-2 rounded-xl text-white font-crayon text-sm"
                        style={{ backgroundColor: selectedCategory.color }}
                      >
                        Start
                      </button>
                      <button
                        onClick={() => handleScheduleClick(activity, selectedCategory)}
                        className="px-4 py-2 rounded-xl font-crayon text-sm border-2 text-gray-600"
                      >
                        <CalendarPlus size={16} className="inline mr-1" />
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-teal-50 rounded-2xl border-3 border-teal-200">
          <h3 className="font-display text-[#20B2AA] mb-2 flex items-center gap-2">
            <Sparkles size={18} />
            Sensory Break Tips
          </h3>
          <ul className="font-crayon text-sm text-teal-700 space-y-1">
            <li>• Take breaks before you feel overwhelmed</li>
            <li>• Try different types to find what works best</li>
            <li>• Schedule regular breaks throughout the day</li>
            <li>• Even 1 minute can help reset your body</li>
          </ul>
        </div>
      </main>

      {/* Single Break Modal */}
      <AddToScheduleModal
        isOpen={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false);
          setActivityToSchedule(null);
          setCategoryForSchedule(null);
        }}
        activity={activityToSchedule}
        category={categoryForSchedule}
        onAdd={handleAddToSchedule}
      />

      {/* Regular Breaks Modal */}
      <ScheduleRegularBreaksModal
        isOpen={showRegularBreaksModal}
        onClose={() => setShowRegularBreaksModal(false)}
        onAdd={handleAddRegularBreaks}
      />
    </div>
  );
};

export default SensoryBreaks;
