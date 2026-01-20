// SleepTracker.jsx - Track sleep patterns
// FIXED: Back button navigates to /health (not /activities)
// FIXED: Updated back button styling to match other pages (border-4, rounded-xl)

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Clock, Trash2, ChevronLeft, ChevronRight, BarChart3, CalendarPlus } from 'lucide-react';
import LocalOnlyNotice from '../components/LocalOnlyNotice';
import TrackerHistory from '../components/TrackerHistory';
import AddToScheduleModal from '../components/AddToScheduleModal';
import { SCHEDULE_SOURCES, SOURCE_COLORS } from '../services/scheduleHelper';

const STORAGE_KEY = 'snw_sleep';

// Sleep quality emojis
const SLEEP_QUALITY = [
  { id: 'great', emoji: '😴', label: 'Great sleep!', color: 'bg-green-100 border-green-400', value: 5 },
  { id: 'good', emoji: '🙂', label: 'Good sleep', color: 'bg-blue-100 border-blue-400', value: 4 },
  { id: 'okay', emoji: '😐', label: 'Okay sleep', color: 'bg-yellow-100 border-yellow-400', value: 3 },
  { id: 'poor', emoji: '😟', label: 'Poor sleep', color: 'bg-orange-100 border-orange-400', value: 2 },
  { id: 'bad', emoji: '😫', label: 'Bad sleep', color: 'bg-red-100 border-red-400', value: 1 },
];

const SleepTracker = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    bedtime: '',
    waketime: '',
    quality: '',
  });
  const [showHistory, setShowHistory] = useState(false);
  
  // Schedule integration state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [reminderType, setReminderType] = useState('bedtime');

  // Sleep reminder presets
  const SLEEP_REMINDERS = {
    bedtime: { emoji: '🌙', name: 'Bedtime Routine', defaultTime: '20:00', color: SOURCE_COLORS[SCHEDULE_SOURCES.SLEEP] || '#6B5B95' },
    waketime: { emoji: '🌅', name: 'Wake Up Time', defaultTime: '07:00', color: '#F5A623' },
  };

  // Convert entries to hours for graph display
  const historyData = useMemo(() => {
    const data = {};
    Object.entries(entries).forEach(([date, entry]) => {
      if (entry.bedtime && entry.waketime) {
        const [bedHour, bedMin] = entry.bedtime.split(':').map(Number);
        const [wakeHour, wakeMin] = entry.waketime.split(':').map(Number);
        let bedMinutes = bedHour * 60 + bedMin;
        let wakeMinutes = wakeHour * 60 + wakeMin;
        if (wakeMinutes < bedMinutes) wakeMinutes += 24 * 60;
        const hours = (wakeMinutes - bedMinutes) / 60;
        data[date] = Math.round(hours * 10) / 10;
      }
    });
    return data;
  }, [entries]);

  // Load entries
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading sleep data:', e);
      }
    }
  }, []);

  // Save entries
  const saveEntries = (newEntries) => {
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  // Load form data for selected date
  useEffect(() => {
    const entry = entries[selectedDate];
    if (entry) {
      setFormData({
        bedtime: entry.bedtime || '',
        waketime: entry.waketime || '',
        quality: entry.quality || '',
      });
    } else {
      setFormData({ bedtime: '', waketime: '', quality: '' });
    }
  }, [selectedDate, entries]);

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
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === yesterday.getTime()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Get week summary
  const getWeekSummary = () => {
    const summary = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const entry = entries[dateStr];
      const quality = entry?.quality ? SLEEP_QUALITY.find(q => q.id === entry.quality) : null;
      summary.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        quality,
        hasData: !!entry,
      });
    }
    return summary;
  };

  const weekSummary = getWeekSummary();

  // Get quality info
  const getQualityInfo = (qualityId) => {
    return SLEEP_QUALITY.find(q => q.id === qualityId);
  };

  // Handle field change and auto-save
  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      setTimeout(() => {
        if (!updated.bedtime && !updated.waketime && !updated.quality) return;
        const newEntries = {
          ...entries,
          [selectedDate]: {
            ...updated,
            updatedAt: new Date().toISOString(),
          },
        };
        saveEntries(newEntries);
      }, 500);
      return updated;
    });
  };

  // Delete entry
  const handleDelete = () => {
    if (!entries[selectedDate]) return;
    if (!confirm('Delete this sleep entry?')) return;
    
    const newEntries = { ...entries };
    delete newEntries[selectedDate];
    saveEntries(newEntries);
    setFormData({ bedtime: '', waketime: '', quality: '' });
  };

  // Calculate sleep duration
  const getSleepDuration = () => {
    if (!formData.bedtime || !formData.waketime) return null;
    
    const [bedHour, bedMin] = formData.bedtime.split(':').map(Number);
    const [wakeHour, wakeMin] = formData.waketime.split(':').map(Number);
    
    let bedMinutes = bedHour * 60 + bedMin;
    let wakeMinutes = wakeHour * 60 + wakeMin;
    
    if (wakeMinutes < bedMinutes) {
      wakeMinutes += 24 * 60;
    }
    
    const totalMinutes = wakeMinutes - bedMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    
    return { hours, mins, total: totalMinutes };
  };

  // Schedule reminder handlers
  const openScheduleModal = (type) => {
    setReminderType(type);
    setShowScheduleModal(true);
  };

  const handleScheduleSuccess = () => {
    setShowScheduleModal(false);
  };

  const duration = getSleepDuration();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      {/* Header - FIXED: Navigation and styling */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          {/* FIXED: Navigate to /health, not /activities */}
          {/* FIXED: Updated styling - border-4, rounded-xl (not border-3, rounded-full) */}
          <button
            onClick={() => navigate('/health')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                       rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
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
            <h1 className="text-lg sm:text-xl font-display text-[#8E6BBF] crayon-text">
              😴 Sleep Tracker
            </h1>
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="p-2 bg-white border-3 border-purple-400 rounded-full hover:bg-purple-50"
            title="View history"
          >
            <BarChart3 size={18} className="text-purple-500" />
          </button>
        </div>
      </header>

      {/* History Modal */}
      {showHistory && (
        <TrackerHistory
          data={historyData}
          goal={8}
          color="#8E6BBF"
          label="Hours"
          formatValue={(v) => `${v}h`}
          onClose={() => setShowHistory(false)}
        />
      )}

      <main className="max-w-md mx-auto px-4 py-6">
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

        {/* Sleep Entry Form */}
        <div className="bg-white rounded-2xl border-3 border-purple-200 p-6 mb-6">
          {/* Bedtime */}
          <div className="mb-6">
            <label className="flex items-center gap-2 font-display text-gray-700 mb-2">
              <Moon size={20} className="text-indigo-500" />
              Bedtime
            </label>
            <div className="flex gap-2">
              <input
                type="time"
                value={formData.bedtime}
                onChange={(e) => handleChange('bedtime', e.target.value)}
                className="flex-1 px-4 py-3 border-3 border-gray-200 rounded-xl font-crayon text-lg
                         focus:border-purple-400 focus:outline-none"
              />
              <button
                onClick={() => openScheduleModal('bedtime')}
                className="px-3 py-2 bg-purple-100 border-2 border-purple-300 rounded-xl
                         text-purple-600 hover:bg-purple-200 transition-colors"
                title="Add bedtime reminder to schedule"
              >
                <CalendarPlus size={20} />
              </button>
            </div>
          </div>

          {/* Wake Time */}
          <div className="mb-6">
            <label className="flex items-center gap-2 font-display text-gray-700 mb-2">
              <Sun size={20} className="text-yellow-500" />
              Wake Time
            </label>
            <div className="flex gap-2">
              <input
                type="time"
                value={formData.waketime}
                onChange={(e) => handleChange('waketime', e.target.value)}
                className="flex-1 px-4 py-3 border-3 border-gray-200 rounded-xl font-crayon text-lg
                         focus:border-purple-400 focus:outline-none"
              />
              <button
                onClick={() => openScheduleModal('waketime')}
                className="px-3 py-2 bg-yellow-100 border-2 border-yellow-300 rounded-xl
                         text-yellow-600 hover:bg-yellow-200 transition-colors"
                title="Add wake time reminder to schedule"
              >
                <CalendarPlus size={20} />
              </button>
            </div>
          </div>

          {/* Duration Display */}
          {duration && (
            <div className="mb-6 p-4 bg-indigo-50 rounded-xl text-center">
              <span className="font-crayon text-gray-600">Sleep Duration</span>
              <div className="font-display text-3xl text-indigo-600 mt-1">
                {duration.hours}h {duration.mins}m
              </div>
              <div className="mt-2">
                {duration.total >= 480 ? (
                  <span className="text-green-600 font-crayon">✓ Great! 8+ hours</span>
                ) : duration.total >= 420 ? (
                  <span className="text-yellow-600 font-crayon">Good - 7+ hours</span>
                ) : (
                  <span className="text-orange-600 font-crayon">Try for more sleep</span>
                )}
              </div>
            </div>
          )}

          {/* Sleep Quality */}
          <div>
            <label className="font-display text-gray-700 mb-3 block">
              How did you sleep?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {SLEEP_QUALITY.map((quality) => (
                <button
                  key={quality.id}
                  onClick={() => handleChange('quality', quality.id)}
                  className={`p-3 rounded-xl border-3 flex flex-col items-center gap-1
                    ${formData.quality === quality.id 
                      ? quality.color 
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <span className="text-2xl">{quality.emoji}</span>
                  <span className="font-crayon text-xs text-gray-600 hidden sm:block">
                    {quality.label.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Delete Button */}
          {entries[selectedDate] && (
            <button
              onClick={handleDelete}
              className="mt-6 w-full py-2 text-red-500 font-crayon flex items-center justify-center gap-2
                       hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 size={16} />
              Delete Entry
            </button>
          )}
        </div>

        {/* Week Overview */}
        <div className="bg-white rounded-2xl border-3 border-purple-200 p-4 mb-6">
          <h3 className="font-display text-gray-700 mb-3 text-center">This Week</h3>
          <div className="grid grid-cols-7 gap-1">
            {weekSummary.map((day) => {
              const isSelected = day.date === selectedDate;
              return (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className={`p-2 rounded-lg text-center transition-all
                    ${isSelected ? 'bg-purple-100 border-2 border-purple-400' : 'hover:bg-gray-50'}
                  `}
                >
                  <span className="block font-crayon text-xs text-gray-500">{day.day}</span>
                  <span className="block text-lg mt-1">
                    {day.quality ? day.quality.emoji : day.hasData ? '📝' : '○'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="p-4 bg-indigo-50 rounded-2xl border-3 border-indigo-200">
          <p className="text-center text-gray-600 font-crayon text-sm">
            💡 <strong>Tip:</strong> Regular sleep schedules help us feel our best! 
            Try to go to bed and wake up at the same time each day.
          </p>
        </div>
      </main>

      {/* Add to Schedule Modal */}
      <AddToScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSuccess={handleScheduleSuccess}
        title={`Schedule ${SLEEP_REMINDERS[reminderType]?.name}`}
        itemName={SLEEP_REMINDERS[reminderType]?.name}
        itemEmoji={SLEEP_REMINDERS[reminderType]?.emoji}
        itemColor={SLEEP_REMINDERS[reminderType]?.color}
        itemSource={SCHEDULE_SOURCES.SLEEP}
        defaultTime={formData[reminderType] || SLEEP_REMINDERS[reminderType]?.defaultTime}
        showTimeSelection={true}
        showNotifyOption={true}
        confirmText="Add Reminder"
      />
    </div>
  );
};

export default SleepTracker;
