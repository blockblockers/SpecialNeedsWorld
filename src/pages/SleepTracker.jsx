// SleepTracker.jsx - Track sleep patterns
// Simple logging of bedtime and wake time

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Clock, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import LocalOnlyNotice from '../components/LocalOnlyNotice';

const STORAGE_KEY = 'snw_sleep';

// Sleep quality emojis
const SLEEP_QUALITY = [
  { id: 'great', emoji: '😴', label: 'Great sleep!', color: 'bg-green-100 border-green-400' },
  { id: 'good', emoji: '🙂', label: 'Good sleep', color: 'bg-blue-100 border-blue-400' },
  { id: 'okay', emoji: '😐', label: 'Okay sleep', color: 'bg-yellow-100 border-yellow-400' },
  { id: 'poor', emoji: '😟', label: 'Poor sleep', color: 'bg-orange-100 border-orange-400' },
  { id: 'bad', emoji: '😫', label: 'Bad sleep', color: 'bg-red-100 border-red-400' },
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

  // Load selected date's data into form
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

  // Save entries
  const saveEntries = (newEntries) => {
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  // Save current entry
  const saveEntry = () => {
    if (!formData.bedtime && !formData.waketime && !formData.quality) return;
    
    const newEntries = {
      ...entries,
      [selectedDate]: {
        ...formData,
        updatedAt: new Date().toISOString(),
      },
    };
    saveEntries(newEntries);
  };

  // Delete entry
  const deleteEntry = () => {
    if (confirm('Delete this sleep entry?')) {
      const newEntries = { ...entries };
      delete newEntries[selectedDate];
      saveEntries(newEntries);
      setFormData({ bedtime: '', waketime: '', quality: '' });
    }
  };

  // Calculate sleep duration
  const calculateDuration = () => {
    if (!formData.bedtime || !formData.waketime) return null;
    
    const [bedHour, bedMin] = formData.bedtime.split(':').map(Number);
    const [wakeHour, wakeMin] = formData.waketime.split(':').map(Number);
    
    let bedMinutes = bedHour * 60 + bedMin;
    let wakeMinutes = wakeHour * 60 + wakeMin;
    
    // If wake time is before bed time, assume it's the next day
    if (wakeMinutes < bedMinutes) {
      wakeMinutes += 24 * 60;
    }
    
    const durationMinutes = wakeMinutes - bedMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return { hours, minutes, total: durationMinutes };
  };

  const duration = calculateDuration();

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
    
    if (date.getTime() === today.getTime()) return 'Last Night';
    if (date.getTime() === yesterday.getTime()) return '2 Nights Ago';
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
      
      summary.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        quality: entry?.quality,
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
      // Auto-save after a short delay
      setTimeout(() => {
        if (updated.bedtime || updated.waketime || updated.quality) {
          const newEntries = {
            ...entries,
            [selectedDate]: {
              ...updated,
              updatedAt: new Date().toISOString(),
            },
          };
          saveEntries(newEntries);
        }
      }, 500);
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/health')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                       rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#8E6BBF] crayon-text">
              😴 Sleep Tracker
            </h1>
          </div>
        </div>
      </header>

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
        <div className="bg-white rounded-3xl border-4 border-[#8E6BBF] p-6 mb-6 shadow-crayon">
          {/* Bedtime */}
          <div className="mb-6">
            <label className="flex items-center gap-2 font-crayon text-gray-700 mb-2">
              <Moon className="text-indigo-500" size={20} />
              Bedtime
            </label>
            <input
              type="time"
              value={formData.bedtime}
              onChange={(e) => handleChange('bedtime', e.target.value)}
              className="w-full p-4 border-3 border-indigo-200 rounded-xl font-crayon text-2xl text-center
                       focus:border-indigo-400 focus:outline-none bg-indigo-50"
            />
          </div>

          {/* Wake time */}
          <div className="mb-6">
            <label className="flex items-center gap-2 font-crayon text-gray-700 mb-2">
              <Sun className="text-yellow-500" size={20} />
              Wake Time
            </label>
            <input
              type="time"
              value={formData.waketime}
              onChange={(e) => handleChange('waketime', e.target.value)}
              className="w-full p-4 border-3 border-yellow-200 rounded-xl font-crayon text-2xl text-center
                       focus:border-yellow-400 focus:outline-none bg-yellow-50"
            />
          </div>

          {/* Duration display */}
          {duration && (
            <div className="mb-6 p-4 bg-purple-50 rounded-xl border-3 border-purple-200 text-center">
              <Clock className="inline-block text-purple-500 mb-1" size={20} />
              <p className="font-display text-purple-700 text-2xl">
                {duration.hours}h {duration.minutes}m
              </p>
              <p className="font-crayon text-purple-500 text-sm">total sleep</p>
            </div>
          )}

          {/* Sleep Quality */}
          <div>
            <label className="block font-crayon text-gray-700 mb-2">How did you sleep?</label>
            <div className="flex justify-between gap-2">
              {SLEEP_QUALITY.map(quality => (
                <button
                  key={quality.id}
                  onClick={() => handleChange('quality', quality.id)}
                  className={`flex-1 p-3 rounded-xl border-3 transition-all
                    ${formData.quality === quality.id 
                      ? `${quality.color} scale-105` 
                      : 'bg-gray-50 border-gray-200 hover:border-gray-400'
                    }`}
                >
                  <span className="text-3xl block">{quality.emoji}</span>
                </button>
              ))}
            </div>
            {formData.quality && (
              <p className="text-center font-crayon text-gray-600 mt-2">
                {getQualityInfo(formData.quality)?.label}
              </p>
            )}
          </div>

          {/* Delete button */}
          {entries[selectedDate] && (
            <button
              onClick={deleteEntry}
              className="mt-4 w-full py-2 bg-red-50 text-red-500 rounded-xl border-2 border-red-200
                       font-crayon text-sm hover:bg-red-100 flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Delete Entry
            </button>
          )}
        </div>

        {/* Week Summary */}
        <div className="bg-white rounded-2xl border-3 border-gray-300 p-4">
          <h3 className="font-display text-gray-700 mb-3 flex items-center gap-2">
            <Moon size={18} className="text-indigo-400" />
            This Week
          </h3>
          <div className="flex justify-between">
            {weekSummary.map(day => {
              const quality = day.quality ? getQualityInfo(day.quality) : null;
              const isSelected = day.date === selectedDate;
              
              return (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className={`flex flex-col items-center p-2 rounded-xl transition-all
                    ${isSelected ? 'bg-purple-100 border-2 border-purple-400' : ''}
                  `}
                >
                  <span className="text-xs font-crayon text-gray-500">{day.day.charAt(0)}</span>
                  <span className="text-2xl mt-1">
                    {quality ? quality.emoji : day.hasData ? '📝' : '○'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border-3 border-indigo-200">
          <p className="text-center text-gray-600 font-crayon text-sm">
            💡 <strong>Tip:</strong> Regular sleep schedules help us feel our best! Try to go to bed and wake up at the same time each day.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SleepTracker;
