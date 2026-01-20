// FIXED: Back button is context-aware - goes to /services or /tools based on entry point
// DailyRoutines.jsx - Track daily routine completion
// UPDATED: Added Visual Schedule integration
// Helps establish consistent daily habits with visual checklists
// Schedule entire routines or individual activities

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Check, 
  X, 
  Sun,
  Moon,
  Sunset,
  Edit2,
  Trash2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Star,
  CalendarPlus,
  Calendar,
  Clock,
  Bell,
  BellOff,
} from 'lucide-react';
import LocalOnlyNotice from '../components/LocalOnlyNotice';
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

const STORAGE_KEY = 'snw_daily_routines';
const HISTORY_KEY = 'snw_routine_history';

// Time periods
const TIME_PERIODS = [
  { id: 'morning', name: 'Morning', emoji: '🌅', icon: Sun, color: 'yellow', startTime: '07:00' },
  { id: 'afternoon', name: 'Afternoon', emoji: '☀️', icon: Sunset, color: 'orange', startTime: '12:00' },
  { id: 'evening', name: 'Evening', emoji: '🌙', icon: Moon, color: 'purple', startTime: '18:00' },
];

// Preset routine items
const PRESETS = {
  morning: [
    { name: 'Wake up', emoji: '⏰' },
    { name: 'Use bathroom', emoji: '🚽' },
    { name: 'Brush teeth', emoji: '🦷' },
    { name: 'Wash face', emoji: '🧼' },
    { name: 'Get dressed', emoji: '👕' },
    { name: 'Eat breakfast', emoji: '🥣' },
    { name: 'Take medicine', emoji: '💊' },
    { name: 'Pack bag', emoji: '🎒' },
  ],
  afternoon: [
    { name: 'Eat lunch', emoji: '🥪' },
    { name: 'Homework', emoji: '📚' },
    { name: 'Quiet time', emoji: '😌' },
    { name: 'Snack', emoji: '🍎' },
    { name: 'Play time', emoji: '🎮' },
    { name: 'Outdoor time', emoji: '🌳' },
    { name: 'Reading', emoji: '📖' },
    { name: 'Chores', emoji: '🧹' },
  ],
  evening: [
    { name: 'Eat dinner', emoji: '🍽️' },
    { name: 'Bath/shower', emoji: '🛁' },
    { name: 'Brush teeth', emoji: '🦷' },
    { name: 'Put on pajamas', emoji: '👔' },
    { name: 'Story time', emoji: '📚' },
    { name: 'Calm down time', emoji: '😴' },
    { name: 'Goodnight hugs', emoji: '🤗' },
    { name: 'Lights out', emoji: '💤' },
  ],
};

const COLORS = {
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-700', button: 'bg-yellow-400', hex: '#F5A623' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-700', button: 'bg-orange-400', hex: '#F37736' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-700', button: 'bg-purple-400', hex: '#8E6BBF' },
};

// =====================================================
// ADD ROUTINE TO SCHEDULE MODAL
// =====================================================
const AddRoutineToScheduleModal = ({ isOpen, onClose, period, items, onAdd }) => {
  const getLocalToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getLocalToday());
  const [startTime, setStartTime] = useState(period?.startTime || '07:00');
  const [intervalMinutes, setIntervalMinutes] = useState(15);
  const [enableReminder, setEnableReminder] = useState(true);
  const [scheduleType, setScheduleType] = useState('routine'); // 'routine' or 'single'
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (isOpen && period) {
      setSelectedDate(getLocalToday());
      setStartTime(period.startTime || '07:00');
      setIntervalMinutes(15);
      setEnableReminder(true);
      setScheduleType('routine');
      setSelectedItem(null);
    }
  }, [isOpen, period]);

  if (!isOpen || !period) return null;

  const handleAdd = () => {
    onAdd({
      period,
      items: scheduleType === 'routine' ? items : [selectedItem],
      date: selectedDate,
      startTime,
      intervalMinutes,
      reminder: enableReminder,
      scheduleType,
    });
  };

  const colors = COLORS[period.color];

  // Helper to calculate end time
  const calculateEndTime = (startTime, itemCount, intervalMinutes) => {
    const [hours, mins] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + (itemCount - 1) * intervalMinutes;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMins = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-white p-4 flex items-center gap-3" style={{ backgroundColor: colors.hex }}>
          <CalendarPlus size={24} />
          <h3 className="font-display text-xl flex-1">Schedule {period.name} Routine</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Schedule Type Selection */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">What to schedule?</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setScheduleType('routine')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-crayon transition-all
                  ${scheduleType === 'routine' 
                    ? 'border-current text-white' 
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                style={{ backgroundColor: scheduleType === 'routine' ? colors.hex : 'white' }}
              >
                📋 Entire Routine
              </button>
              <button
                type="button"
                onClick={() => setScheduleType('single')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-crayon transition-all
                  ${scheduleType === 'single' 
                    ? 'border-current text-white' 
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                style={{ backgroundColor: scheduleType === 'single' ? colors.hex : 'white' }}
              >
                ✨ Single Item
              </button>
            </div>
          </div>

          {/* Single Item Selection */}
          {scheduleType === 'single' && (
            <div>
              <label className="block font-crayon text-gray-600 mb-2">Choose activity:</label>
              <div className="max-h-40 overflow-y-auto space-y-2 border-2 border-gray-200 rounded-xl p-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all
                      ${selectedItem?.id === item.id 
                        ? 'bg-green-100 border-2 border-green-400' 
                        : 'hover:bg-gray-50'}`}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className="font-crayon text-gray-700">{item.name}</span>
                    {selectedItem?.id === item.id && <Check size={16} className="ml-auto text-green-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Routine Preview */}
          {scheduleType === 'routine' && (
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="font-crayon text-sm text-gray-600 mb-2">
                {items.length} activities will be scheduled:
              </p>
              <div className="flex flex-wrap gap-1">
                {items.slice(0, 6).map((item, i) => (
                  <span key={i} className="text-lg" title={item.name}>{item.emoji}</span>
                ))}
                {items.length > 6 && (
                  <span className="font-crayon text-sm text-gray-400">+{items.length - 6} more</span>
                )}
              </div>
            </div>
          )}

          {/* Date Selection */}
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
              {scheduleType === 'routine' ? 'Start time?' : 'What time?'}
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl font-crayon text-lg"
            />
            <p className="font-crayon text-xs text-gray-400 mt-1">
              {formatTimeDisplay(startTime)}
            </p>
          </div>

          {/* Interval (only for routine) */}
          {scheduleType === 'routine' && items.length > 1 && (
            <div>
              <label className="block font-crayon text-gray-600 mb-2">
                Time between activities?
              </label>
              <div className="flex gap-2">
                {[10, 15, 20, 30].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setIntervalMinutes(mins)}
                    className={`flex-1 py-2 rounded-xl font-crayon text-sm transition-all
                      ${intervalMinutes === mins 
                        ? 'text-white' 
                        : 'bg-gray-100 text-gray-600'}`}
                    style={{ backgroundColor: intervalMinutes === mins ? colors.hex : undefined }}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
              <p className="font-crayon text-xs text-gray-400 mt-2">
                Routine ends around {formatTimeDisplay(calculateEndTime(startTime, items.length, intervalMinutes))}
              </p>
            </div>
          )}

          {/* Reminder Toggle */}
          <button
            type="button"
            onClick={() => setEnableReminder(!enableReminder)}
            className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all
              ${enableReminder 
                ? 'border-current' 
                : 'bg-gray-50 border-gray-200'}`}
            style={{ 
              backgroundColor: enableReminder ? `${colors.hex}20` : undefined,
              borderColor: enableReminder ? colors.hex : undefined 
            }}
          >
            <div className={`p-2 rounded-full ${enableReminder ? '' : 'bg-gray-300'}`}
              style={{ backgroundColor: enableReminder ? colors.hex : undefined }}>
              {enableReminder ? (
                <Bell size={16} className="text-white" />
              ) : (
                <BellOff size={16} className="text-white" />
              )}
            </div>
            <span className="font-crayon text-gray-700 flex-1 text-left">
              {enableReminder ? 'Reminders enabled' : 'No reminders'}
            </span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-crayon hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={scheduleType === 'single' && !selectedItem}
            className="flex-1 py-3 text-white rounded-xl font-crayon flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: colors.hex }}
          >
            <Check size={20} />
            Add to Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

const DailyRoutines = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [routines, setRoutines] = useState({
    morning: [],
    afternoon: [],
    evening: [],
  });
  const [completedToday, setCompletedToday] = useState({});
  const [expandedPeriod, setExpandedPeriod] = useState('morning');
  const [showAddForm, setShowAddForm] = useState(null); // period id or null
  const [newItem, setNewItem] = useState({ name: '', emoji: '✨' });
  const [editMode, setEditMode] = useState(false);
  const [streak, setStreak] = useState(0);
  
  // Schedule modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [periodToSchedule, setPeriodToSchedule] = useState(null);

  // Determine parent hub based on current path
  const getParentHub = () => {
    if (location.pathname.startsWith('/services')) {
      return '/services';
    }
    return '/tools';
  };

  // Get today's date string
  const getTodayKey = () => new Date().toISOString().split('T')[0];

  // Load routines and today's progress
  useEffect(() => {
    const savedRoutines = localStorage.getItem(STORAGE_KEY);
    if (savedRoutines) {
      try {
        setRoutines(JSON.parse(savedRoutines));
      } catch (e) {
        console.error('Error loading routines:', e);
      }
    }

    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        const todayKey = getTodayKey();
        setCompletedToday(history[todayKey] || {});
        
        // Calculate streak
        calculateStreak(history);
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
  }, []);

  // Save routines
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
  }, [routines]);

  // Save completion status
  const saveCompletion = (newCompleted) => {
    const todayKey = getTodayKey();
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    let history = {};
    
    try {
      history = savedHistory ? JSON.parse(savedHistory) : {};
    } catch (e) {
      history = {};
    }
    
    history[todayKey] = newCompleted;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    setCompletedToday(newCompleted);
    calculateStreak(history);
  };

  // Calculate streak
  const calculateStreak = (history) => {
    let count = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      
      if (history[key] && Object.keys(history[key]).length > 0) {
        count++;
      } else if (i > 0) { // Don't break on today if nothing done yet
        break;
      }
    }
    
    setStreak(count);
  };

  // Toggle item completion
  const toggleItem = (periodId, itemId) => {
    const key = `${periodId}_${itemId}`;
    const newCompleted = { ...completedToday };
    
    if (newCompleted[key]) {
      delete newCompleted[key];
    } else {
      newCompleted[key] = true;
    }
    
    saveCompletion(newCompleted);
  };

  // Add routine item
  const addItem = (periodId) => {
    if (!newItem.name.trim()) return;
    
    const item = {
      id: Date.now().toString(),
      name: newItem.name.trim(),
      emoji: newItem.emoji,
    };
    
    setRoutines({
      ...routines,
      [periodId]: [...routines[periodId], item],
    });
    
    setNewItem({ name: '', emoji: '✨' });
    setShowAddForm(null);
  };

  // Add from preset
  const addPreset = (periodId, preset) => {
    const item = {
      id: Date.now().toString(),
      name: preset.name,
      emoji: preset.emoji,
    };
    
    setRoutines({
      ...routines,
      [periodId]: [...routines[periodId], item],
    });
  };

  // Delete item
  const deleteItem = (periodId, itemId) => {
    setRoutines({
      ...routines,
      [periodId]: routines[periodId].filter(item => item.id !== itemId),
    });
  };

  // Reset today's progress
  const resetToday = () => {
    saveCompletion({});
  };

  // Get completion percentage for a period
  const getCompletionPercent = (periodId) => {
    const items = routines[periodId];
    if (items.length === 0) return 0;
    
    const completed = items.filter(item => completedToday[`${periodId}_${item.id}`]).length;
    return Math.round((completed / items.length) * 100);
  };

  // Get total completion across all periods
  const getTotalCompletion = () => {
    let total = 0;
    let completed = 0;
    
    Object.entries(routines).forEach(([periodId, items]) => {
      total += items.length;
      completed += items.filter(item => completedToday[`${periodId}_${item.id}`]).length;
    });
    
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  // Handle schedule button click
  const handleScheduleClick = (period) => {
    if (routines[period.id].length === 0) {
      toast.error('No Activities', `Add some ${period.name.toLowerCase()} activities first!`);
      return;
    }
    setPeriodToSchedule(period);
    setShowScheduleModal(true);
  };

  // Handle add to schedule - with try/catch error handling
  const handleAddToSchedule = ({ period, items, date, startTime, intervalMinutes, reminder, scheduleType }) => {
    try {
      const colors = COLORS[period.color];
      
      if (scheduleType === 'single' && items.length === 1) {
        // Single item
        const item = items[0];
        const result = addActivityToSchedule({
          date,
          name: `${period.emoji} ${item.name}`,
          time: startTime,
          emoji: item.emoji,
          color: colors.hex,
          source: SCHEDULE_SOURCES?.DAILY_ROUTINE || 'daily_routine',
          notify: reminder,
          metadata: {
            routineItem: true,
            period: period.id,
            itemId: item.id,
          },
        });

        setShowScheduleModal(false);
        setPeriodToSchedule(null);

        if (result && result.success) {
          toast.schedule(
            'Activity Scheduled!',
            `"${item.name}" added to ${formatDateDisplay(date)} at ${formatTimeDisplay(startTime)}`
          );
        } else {
          toast.error('Oops!', result?.error || 'Could not add to schedule. Please try again.');
        }
      } else {
        // Multiple items (full routine)
        const activities = items.map((item, index) => {
          const [startH, startM] = startTime.split(':').map(Number);
          const totalMinutes = startH * 60 + startM + index * intervalMinutes;
          const time = `${String(Math.floor(totalMinutes / 60) % 24).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
          
          return {
            name: `${period.emoji} ${item.name}`,
            time,
            emoji: item.emoji,
            color: colors.hex,
            metadata: {
              routineItem: true,
              period: period.id,
              itemId: item.id,
            },
          };
        });

        const result = addMultipleActivitiesToSchedule({
          date,
          activities,
          source: SCHEDULE_SOURCES?.DAILY_ROUTINE || 'daily_routine',
          notify: reminder,
        });

        setShowScheduleModal(false);
        setPeriodToSchedule(null);

        if (result && result.success) {
          toast.schedule(
            'Routine Scheduled!',
            `${items.length} ${period.name.toLowerCase()} activities added to ${formatDateDisplay(date)}`
          );
        } else {
          toast.error('Oops!', result?.error || 'Could not add routine to schedule. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error adding routine to schedule:', error);
      toast.error('Oops!', 'Something went wrong. Please try again.');
      setShowScheduleModal(false);
      setPeriodToSchedule(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(getParentHub())}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                       rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#8E6BBF] crayon-text">
              📋 Daily Routines
            </h1>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`p-2 rounded-lg transition-colors ${
              editMode ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Edit2 size={20} />
          </button>
        </div>
      </header>

      <LocalOnlyNotice />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Streak & Progress */}
        <div className="bg-gradient-to-r from-[#8E6BBF]/10 to-[#5CB85C]/10 rounded-2xl border-3 border-[#8E6BBF]/30 p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star className="text-[#F5A623]" size={24} />
              <span className="font-display text-2xl text-[#F5A623]">{streak}</span>
              <span className="font-crayon text-gray-600">day streak!</span>
            </div>
            <button
              onClick={resetToday}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg
                       font-crayon text-xs text-gray-600 hover:bg-gray-200"
            >
              <RotateCcw size={14} />
              Reset Today
            </button>
          </div>
          <div className="h-4 bg-white/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#8E6BBF] to-[#5CB85C] transition-all duration-500"
              style={{ width: `${getTotalCompletion()}%` }}
            />
          </div>
          <p className="font-crayon text-center text-gray-600 mt-2">
            {getTotalCompletion()}% Complete Today
          </p>
        </div>

        {/* Time Periods */}
        <div className="space-y-4">
          {TIME_PERIODS.map(period => {
            const colors = COLORS[period.color];
            const isExpanded = expandedPeriod === period.id;
            const completion = getCompletionPercent(period.id);
            const items = routines[period.id];
            const Icon = period.icon;

            return (
              <div
                key={period.id}
                className={`rounded-2xl border-4 ${colors.border} overflow-hidden shadow-sm`}
              >
                {/* Period Header */}
                <div className={`w-full ${colors.bg} p-4 flex items-center gap-3`}>
                  <button
                    onClick={() => setExpandedPeriod(isExpanded ? null : period.id)}
                    className="flex items-center gap-3 flex-1"
                  >
                    <div className={`p-2 rounded-full ${colors.button} text-white`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className={`font-display text-lg ${colors.text}`}>
                        {period.emoji} {period.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-white/50 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colors.button} transition-all duration-300`}
                            style={{ width: `${completion}%` }}
                          />
                        </div>
                        <span className="font-crayon text-xs text-gray-600">
                          {items.filter(i => completedToday[`${period.id}_${i.id}`]).length}/{items.length}
                        </span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  
                  {/* Schedule Button */}
                  {items.length > 0 && (
                    <button
                      onClick={() => handleScheduleClick(period)}
                      className={`p-2 rounded-lg ${colors.bg} hover:bg-white/50 transition-colors`}
                      title={`Schedule ${period.name} routine`}
                    >
                      <CalendarPlus size={20} className={colors.text} />
                    </button>
                  )}
                </div>

                {/* Period Items */}
                {isExpanded && (
                  <div className="bg-white p-4">
                    {items.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="font-crayon text-gray-400 mb-3">No items yet</p>
                        <p className="font-crayon text-sm text-gray-400 mb-2">Quick add:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {PRESETS[period.id].slice(0, 4).map(preset => (
                            <button
                              key={preset.name}
                              onClick={() => addPreset(period.id, preset)}
                              className={`px-3 py-1.5 rounded-full border-2 ${colors.border} 
                                         font-crayon text-sm hover:${colors.bg} transition-colors`}
                            >
                              {preset.emoji} {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {items.map(item => {
                          const isCompleted = completedToday[`${period.id}_${item.id}`];
                          
                          return (
                            <div
                              key={item.id}
                              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all
                                ${isCompleted 
                                  ? 'bg-green-50 border-green-300' 
                                  : 'bg-gray-50 border-gray-200'
                                }`}
                            >
                              <button
                                onClick={() => toggleItem(period.id, item.id)}
                                className={`w-8 h-8 rounded-full border-3 flex items-center justify-center
                                           transition-all ${isCompleted 
                                             ? 'bg-green-500 border-green-600 text-white' 
                                             : 'bg-white border-gray-300 hover:border-green-400'
                                           }`}
                              >
                                {isCompleted && <Check size={18} strokeWidth={3} />}
                              </button>
                              <span className="text-2xl">{item.emoji}</span>
                              <span className={`flex-1 font-crayon ${
                                isCompleted ? 'text-green-700 line-through' : 'text-gray-700'
                              }`}>
                                {item.name}
                              </span>
                              {editMode && (
                                <button
                                  onClick={() => deleteItem(period.id, item.id)}
                                  className="p-1 text-gray-400 hover:text-red-500"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Add Item */}
                    {showAddForm === period.id ? (
                      <div className="mt-4 p-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <div className="flex gap-2 mb-2">
                          <select
                            value={newItem.emoji}
                            onChange={(e) => setNewItem({ ...newItem, emoji: e.target.value })}
                            className="w-16 p-2 border-2 border-gray-300 rounded-lg font-crayon text-center"
                          >
                            {['✨', '⏰', '🦷', '🧼', '👕', '🥣', '📚', '🎮', '🛁', '💊', '🎒', '😴'].map(e => (
                              <option key={e} value={e}>{e}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            placeholder="Activity name..."
                            className="flex-1 p-2 border-2 border-gray-300 rounded-lg font-crayon
                                     focus:border-[#8E6BBF] focus:outline-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => addItem(period.id)}
                            disabled={!newItem.name.trim()}
                            className="flex-1 py-2 bg-green-500 text-white rounded-lg font-crayon
                                     hover:bg-green-600 disabled:opacity-50"
                          >
                            <Check size={16} className="inline mr-1" />
                            Add
                          </button>
                          <button
                            onClick={() => setShowAddForm(null)}
                            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg font-crayon
                                     hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                        
                        {/* Preset suggestions */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="font-crayon text-xs text-gray-500 mb-2">Quick add:</p>
                          <div className="flex flex-wrap gap-1">
                            {PRESETS[period.id].map(preset => (
                              <button
                                key={preset.name}
                                onClick={() => addPreset(period.id, preset)}
                                className="px-2 py-1 bg-white border border-gray-200 rounded-full
                                         font-crayon text-xs hover:border-gray-400"
                              >
                                {preset.emoji} {preset.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAddForm(period.id)}
                        className={`mt-4 w-full py-3 border-2 border-dashed ${colors.border} 
                                   rounded-xl font-crayon ${colors.text} hover:${colors.bg} 
                                   transition-colors flex items-center justify-center gap-2`}
                      >
                        <Plus size={18} />
                        Add {period.name} Activity
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Schedule All Button */}
        <div className="mt-6 p-4 bg-[#5CB85C]/10 rounded-2xl border-3 border-[#5CB85C]/30">
          <div className="flex items-center gap-3 mb-3">
            <CalendarPlus size={24} className="text-[#5CB85C]" />
            <div>
              <h3 className="font-display text-[#5CB85C]">Visual Schedule Integration</h3>
              <p className="font-crayon text-sm text-gray-600">
                Tap the calendar icon on each routine to add it to your Visual Schedule
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border-3 border-blue-200">
          <h3 className="font-display text-blue-700 mb-2">💡 Tips for Success</h3>
          <ul className="font-crayon text-sm text-blue-600 space-y-1">
            <li>• Keep routines consistent every day</li>
            <li>• Use visual cues alongside this checklist</li>
            <li>• Schedule routines in your Visual Schedule for reminders</li>
            <li>• Celebrate completed routines!</li>
            <li>• Build a streak for motivation</li>
          </ul>
        </div>
      </main>

      {/* Schedule Modal */}
      <AddRoutineToScheduleModal
        isOpen={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false);
          setPeriodToSchedule(null);
        }}
        period={periodToSchedule}
        items={periodToSchedule ? routines[periodToSchedule.id] : []}
        onAdd={handleAddToSchedule}
      />
    </div>
  );
};

export default DailyRoutines;
