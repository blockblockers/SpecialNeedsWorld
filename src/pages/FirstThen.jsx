// FirstThen.jsx - First/Then visual tool for ATLASassist
// UPDATED: Added Visual Schedule integration
// Schedule First/Then sequences to help with transitions

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Check,
  CalendarPlus,
  Bell,
  BellOff,
  Clock,
  Calendar,
  Sparkles,
  Star,
  History,
} from 'lucide-react';
import { 
  addActivityToSchedule, 
  SCHEDULE_SOURCES, 
  SOURCE_COLORS,
  getToday,
  getTomorrow,
  formatDateDisplay,
  formatTimeDisplay 
} from '../services/scheduleHelper';
import { useToast } from '../components/ThemedToast';

const STORAGE_KEY = 'snw_first_then';
const PRESETS_KEY = 'snw_first_then_presets';

// Preset First/Then templates
const DEFAULT_PRESETS = [
  { id: 'homework-play', first: { text: 'Homework', emoji: '📚' }, then: { text: 'Play Time', emoji: '🎮' } },
  { id: 'dinner-dessert', first: { text: 'Eat Dinner', emoji: '🍽️' }, then: { text: 'Dessert', emoji: '🍪' } },
  { id: 'teeth-story', first: { text: 'Brush Teeth', emoji: '🦷' }, then: { text: 'Story Time', emoji: '📖' } },
  { id: 'clean-screen', first: { text: 'Clean Up', emoji: '🧹' }, then: { text: 'Screen Time', emoji: '📺' } },
  { id: 'bath-pajamas', first: { text: 'Bath Time', emoji: '🛁' }, then: { text: 'Cozy Pajamas', emoji: '👕' } },
  { id: 'work-break', first: { text: 'Finish Work', emoji: '✏️' }, then: { text: 'Break Time', emoji: '☕' } },
];

// Common activity icons
const ACTIVITY_ICONS = [
  { emoji: '📚', label: 'Reading/Study' },
  { emoji: '✏️', label: 'Writing/Work' },
  { emoji: '🧹', label: 'Cleaning' },
  { emoji: '🦷', label: 'Brush Teeth' },
  { emoji: '🛁', label: 'Bath/Shower' },
  { emoji: '🍽️', label: 'Eating' },
  { emoji: '👕', label: 'Getting Dressed' },
  { emoji: '🎮', label: 'Video Games' },
  { emoji: '📺', label: 'TV/Movies' },
  { emoji: '🎨', label: 'Art/Crafts' },
  { emoji: '🎵', label: 'Music' },
  { emoji: '⚽', label: 'Sports/Exercise' },
  { emoji: '🏃', label: 'Running/Movement' },
  { emoji: '🧘', label: 'Calm Time' },
  { emoji: '🛒', label: 'Shopping' },
  { emoji: '🚗', label: 'Car Ride' },
  { emoji: '🍪', label: 'Snack/Treat' },
  { emoji: '🌳', label: 'Outside Time' },
  { emoji: '🧸', label: 'Play Time' },
  { emoji: '📖', label: 'Story Time' },
];

// =====================================================
// ADD TO SCHEDULE MODAL - Fixed to match ChoiceBoard pattern
// =====================================================
const AddToScheduleModal = ({ isOpen, onClose, firstThen, onAdd }) => {
  // Get today's date in local timezone (not UTC) - fixes date pre-population
  const getLocalToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getLocalToday());
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [enableReminder, setEnableReminder] = useState(true);

  // Reset form when modal opens - always start with today's date
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(getLocalToday());
      setSelectedTime('09:00');
      setEnableReminder(true);
    }
  }, [isOpen]);

  if (!isOpen || !firstThen) return null;

  const handleAdd = () => {
    onAdd({
      firstThen,
      date: selectedDate,
      time: selectedTime,
      reminder: enableReminder,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#F5A623] text-white p-4 flex items-center gap-3">
          <CalendarPlus size={24} />
          <h3 className="font-display text-xl flex-1">Schedule First/Then</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Use Case Description */}
          <div className="p-3 bg-orange-50 rounded-xl border-2 border-orange-200">
            <p className="font-crayon text-sm text-orange-700">
              1️⃣ <strong>Why schedule First/Then?</strong> Adding this to your Visual Schedule 
              helps prepare for transitions and sets clear expectations. Get a reminder 
              when it's time to start the First/Then sequence!
            </p>
          </div>

          {/* First/Then Preview */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-center gap-4">
              {/* First */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-xl bg-[#E63B2E] flex items-center justify-center mb-1">
                  <span className="text-3xl">{firstThen.first.emoji}</span>
                </div>
                <p className="font-crayon text-xs text-gray-600">FIRST</p>
                <p className="font-display text-sm text-gray-800">{firstThen.first.text}</p>
              </div>
              
              {/* Arrow */}
              <ArrowRight size={24} className="text-[#F5A623]" />
              
              {/* Then */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-xl bg-[#5CB85C] flex items-center justify-center mb-1">
                  <span className="text-3xl">{firstThen.then.emoji}</span>
                </div>
                <p className="font-crayon text-xs text-gray-600">THEN</p>
                <p className="font-display text-sm text-gray-800">{firstThen.then.text}</p>
              </div>
            </div>
          </div>

          {/* Date Selection - No Today/Tomorrow buttons, just date picker */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">
              <Calendar size={16} className="inline mr-1" />
              When?
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getLocalToday()}
              className="w-full p-3 border-2 border-gray-200 rounded-xl font-crayon"
            />
            <p className="font-crayon text-xs text-gray-400 mt-1">
              {formatDateDisplay(selectedDate)}
            </p>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">
              <Clock size={16} className="inline mr-1" />
              What time to start?
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl font-crayon text-lg"
            />
            <p className="font-crayon text-xs text-gray-400 mt-1">
              {formatTimeDisplay(selectedTime)} - You'll get a reminder to start
            </p>
          </div>

          {/* Reminder Toggle */}
          <button
            type="button"
            onClick={() => setEnableReminder(!enableReminder)}
            className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all
              ${enableReminder 
                ? 'bg-orange-50 border-[#F5A623]' 
                : 'bg-gray-50 border-gray-200'}`}
          >
            <div className={`p-2 rounded-full ${enableReminder ? 'bg-[#F5A623]' : 'bg-gray-300'}`}>
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

// Icon Picker Component
const IconPicker = ({ selected, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden">
        <div className="bg-[#F5A623] text-white p-3 flex items-center justify-between">
          <h3 className="font-display">Choose an Icon</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 grid grid-cols-5 gap-2 max-h-60 overflow-y-auto">
          {ACTIVITY_ICONS.map(icon => (
            <button
              key={icon.emoji}
              onClick={() => onSelect(icon.emoji)}
              className={`p-3 rounded-xl text-2xl hover:bg-gray-100 transition-colors
                ${selected === icon.emoji ? 'bg-orange-100 border-2 border-[#F5A623]' : ''}`}
              title={icon.label}
            >
              {icon.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Component
const FirstThen = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // Current First/Then state
  const [firstTask, setFirstTask] = useState({ text: '', emoji: '📚' });
  const [thenTask, setThenTask] = useState({ text: '', emoji: '🎮' });
  const [isFirstComplete, setIsFirstComplete] = useState(false);
  
  // UI state
  const [showIconPicker, setShowIconPicker] = useState(null); // 'first' or 'then'
  const [presets, setPresets] = useState(DEFAULT_PRESETS);
  const [showPresets, setShowPresets] = useState(true);
  const [history, setHistory] = useState([]);
  
  // Schedule modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [firstThenToSchedule, setFirstThenToSchedule] = useState(null);

  // Load data
  useEffect(() => {
    // Load saved presets
    const savedPresets = localStorage.getItem(PRESETS_KEY);
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (e) {}
    }
    
    // Load history
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {}
    }
  }, []);

  // Use preset
  const usePreset = (preset) => {
    setFirstTask(preset.first);
    setThenTask(preset.then);
    setIsFirstComplete(false);
    setShowPresets(false);
  };

  // Save current as preset
  const saveAsPreset = () => {
    if (!firstTask.text || !thenTask.text) {
      toast.error('Missing Info', 'Please fill in both First and Then activities');
      return;
    }
    
    const newPreset = {
      id: Date.now().toString(),
      first: { ...firstTask },
      then: { ...thenTask },
    };
    
    const newPresets = [...presets, newPreset];
    setPresets(newPresets);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(newPresets));
    toast.success('Saved!', 'Your First/Then has been saved as a preset');
  };

  // Delete preset
  const deletePreset = (presetId) => {
    const newPresets = presets.filter(p => p.id !== presetId);
    setPresets(newPresets);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(newPresets));
  };

  // Mark first as complete
  const completeFirst = () => {
    setIsFirstComplete(true);
    // Save to history
    const entry = {
      id: Date.now(),
      first: firstTask,
      then: thenTask,
      completedAt: new Date().toISOString(),
    };
    const newHistory = [entry, ...history].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  // Reset
  const reset = () => {
    setIsFirstComplete(false);
    setShowPresets(true);
  };

  // Handle schedule button click
  const handleScheduleClick = () => {
    if (!firstTask.text || !thenTask.text) {
      toast.error('Missing Info', 'Please fill in both First and Then activities first');
      return;
    }
    setFirstThenToSchedule({ first: firstTask, then: thenTask });
    setShowScheduleModal(true);
  };

  // Handle add to schedule - FIXED: Added try/catch error handling
  const handleAddToSchedule = ({ firstThen, date, time, reminder }) => {
    try {
      const result = addActivityToSchedule({
        date: date,
        name: `First ${firstThen.first.text}, Then ${firstThen.then.text}`,
        time: time,
        emoji: '1️⃣',
        color: SOURCE_COLORS?.[SCHEDULE_SOURCES?.FIRST_THEN] || '#F5A623',
        source: SCHEDULE_SOURCES?.FIRST_THEN || 'first_then',
        notify: reminder,
        metadata: {
          firstTask: firstThen.first.text,
          firstEmoji: firstThen.first.emoji,
          thenTask: firstThen.then.text,
          thenEmoji: firstThen.then.emoji,
        },
      });

      setShowScheduleModal(false);
      setFirstThenToSchedule(null);

      if (result && result.success) {
        toast.schedule(
          'First/Then Scheduled!',
          `Added to your Visual Schedule for ${formatDateDisplay(date)} at ${formatTimeDisplay(time)}`
        );
      } else {
        toast.error('Oops!', result?.error || 'Could not add to schedule. Please try again.');
      }
    } catch (error) {
      console.error('Error adding First/Then to schedule:', error);
      toast.error('Oops!', 'Something went wrong. Please try again.');
      setShowScheduleModal(false);
      setFirstThenToSchedule(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/tools')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F5A623] 
                       rounded-xl font-display font-bold text-[#F5A623] hover:bg-[#F5A623] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#F5A623] crayon-text">
              1️⃣ First / Then
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Presets */}
        {showPresets && (
          <div className="mb-6">
            <h2 className="font-display text-gray-700 mb-3 flex items-center gap-2">
              <Star size={18} className="text-[#F5A623]" />
              Quick Start Templates
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {presets.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => usePreset(preset)}
                  className="p-3 bg-white rounded-xl border-3 border-gray-200 hover:border-[#F5A623] 
                           transition-all text-left relative group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{preset.first.emoji}</span>
                    <ArrowRight size={14} className="text-gray-400" />
                    <span className="text-xl">{preset.then.emoji}</span>
                  </div>
                  <p className="font-crayon text-sm text-gray-600 truncate">
                    {preset.first.text} → {preset.then.text}
                  </p>
                  {!DEFAULT_PRESETS.find(d => d.id === preset.id) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePreset(preset.id);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-100 text-red-500 rounded-full 
                               opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  )}
                </button>
              ))}
            </div>
            <p className="font-crayon text-sm text-gray-400 text-center mt-3">
              Or create your own below ↓
            </p>
          </div>
        )}

        {/* First/Then Board */}
        <div className="bg-white rounded-3xl border-4 border-[#F5A623] shadow-crayon overflow-hidden">
          {/* Header */}
          <div className="bg-[#F5A623] text-white p-4 text-center">
            <h2 className="font-display text-2xl">First / Then</h2>
          </div>

          {/* Cards */}
          <div className="p-6">
            <div className="flex items-stretch gap-4">
              {/* FIRST Card */}
              <div className={`flex-1 rounded-2xl border-4 p-4 text-center transition-all
                ${isFirstComplete 
                  ? 'border-green-400 bg-green-50 opacity-60' 
                  : 'border-[#E63B2E] bg-red-50'}`}
              >
                <div className="bg-[#E63B2E] text-white px-4 py-1 rounded-full font-display text-sm inline-block mb-3">
                  FIRST
                </div>
                
                {/* Icon */}
                <button
                  onClick={() => setShowIconPicker('first')}
                  className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-white border-3 border-gray-200 
                           flex items-center justify-center text-5xl hover:border-[#F5A623] transition-colors"
                  disabled={isFirstComplete}
                >
                  {firstTask.emoji}
                </button>
                
                {/* Text Input */}
                <input
                  type="text"
                  value={firstTask.text}
                  onChange={(e) => setFirstTask({ ...firstTask, text: e.target.value })}
                  placeholder="What to do first?"
                  className="w-full p-2 text-center font-crayon text-lg border-2 border-gray-200 rounded-xl
                           focus:border-[#F5A623] focus:outline-none"
                  disabled={isFirstComplete}
                />

                {/* Complete Button */}
                {!isFirstComplete && firstTask.text && (
                  <button
                    onClick={completeFirst}
                    className="mt-4 px-6 py-2 bg-[#5CB85C] text-white rounded-xl font-crayon
                             hover:bg-green-600 transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                    <Check size={18} />
                    Done!
                  </button>
                )}
                
                {isFirstComplete && (
                  <div className="mt-4 text-green-600 font-display flex items-center justify-center gap-2">
                    <Check size={24} />
                    Complete!
                  </div>
                )}
              </div>

              {/* Arrow */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-[#F5A623] flex items-center justify-center">
                  <ArrowRight size={28} className="text-white" />
                </div>
              </div>

              {/* THEN Card */}
              <div className={`flex-1 rounded-2xl border-4 p-4 text-center transition-all
                ${isFirstComplete 
                  ? 'border-[#5CB85C] bg-green-50 animate-pulse' 
                  : 'border-gray-300 bg-gray-50 opacity-60'}`}
              >
                <div className="bg-[#5CB85C] text-white px-4 py-1 rounded-full font-display text-sm inline-block mb-3">
                  THEN
                </div>
                
                {/* Icon */}
                <button
                  onClick={() => setShowIconPicker('then')}
                  className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-white border-3 border-gray-200 
                           flex items-center justify-center text-5xl hover:border-[#F5A623] transition-colors"
                  disabled={isFirstComplete}
                >
                  {thenTask.emoji}
                </button>
                
                {/* Text Input */}
                <input
                  type="text"
                  value={thenTask.text}
                  onChange={(e) => setThenTask({ ...thenTask, text: e.target.value })}
                  placeholder="Then I can..."
                  className="w-full p-2 text-center font-crayon text-lg border-2 border-gray-200 rounded-xl
                           focus:border-[#F5A623] focus:outline-none"
                  disabled={isFirstComplete}
                />

                {isFirstComplete && (
                  <div className="mt-4">
                    <Sparkles className="w-8 h-8 text-[#F5A623] mx-auto animate-bounce" />
                    <p className="font-display text-[#5CB85C] mt-2">Time for your reward! 🎉</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 bg-gray-50 flex gap-3 justify-center flex-wrap">
            <button
              onClick={reset}
              className="px-4 py-2 bg-white border-2 border-gray-300 rounded-xl font-crayon text-gray-600
                       hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              <History size={18} />
              Reset
            </button>
            
            {!isFirstComplete && (
              <button
                onClick={saveAsPreset}
                className="px-4 py-2 bg-white border-2 border-[#F5A623] rounded-xl font-crayon text-[#F5A623]
                         hover:bg-orange-50 transition-all flex items-center gap-2"
              >
                <Save size={18} />
                Save Template
              </button>
            )}
            
            <button
              onClick={handleScheduleClick}
              className="px-4 py-2 bg-[#8E6BBF] border-2 border-purple-600 rounded-xl font-crayon text-white
                       hover:bg-purple-700 transition-all flex items-center gap-2"
            >
              <CalendarPlus size={18} />
              Add to Schedule
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-orange-50 rounded-2xl border-3 border-orange-200">
          <h3 className="font-display text-[#F5A623] mb-2 flex items-center gap-2">
            <Sparkles size={18} />
            First/Then Tips
          </h3>
          <ul className="font-crayon text-sm text-orange-700 space-y-1">
            <li>• Put the less preferred activity FIRST</li>
            <li>• Put the motivating activity in THEN</li>
            <li>• Keep the First task short and achievable</li>
            <li>• Schedule First/Then before challenging times</li>
            <li>• Celebrate completing the sequence! 🎉</li>
          </ul>
        </div>
      </main>

      {/* Icon Picker */}
      {showIconPicker && (
        <IconPicker
          selected={showIconPicker === 'first' ? firstTask.emoji : thenTask.emoji}
          onSelect={(emoji) => {
            if (showIconPicker === 'first') {
              setFirstTask({ ...firstTask, emoji });
            } else {
              setThenTask({ ...thenTask, emoji });
            }
            setShowIconPicker(null);
          }}
          onClose={() => setShowIconPicker(null)}
        />
      )}

      {/* Schedule Modal */}
      <AddToScheduleModal
        isOpen={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false);
          setFirstThenToSchedule(null);
        }}
        firstThen={firstThenToSchedule}
        onAdd={handleAddToSchedule}
      />
    </div>
  );
};

export default FirstThen;
