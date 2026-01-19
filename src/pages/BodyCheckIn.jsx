// BodyCheckIn.jsx - Body awareness check-in for ATLASassist
// UPDATED: Added Visual Schedule integration
// Schedule regular body check-ins throughout the day

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Sparkles,
  X,
  Check,
  CalendarPlus,
  Bell,
  BellOff,
  Clock,
  Calendar,
  History,
  BarChart3,
  User,
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

const STORAGE_KEY = 'snw_body_checkin';

// Body parts to check
const BODY_PARTS = [
  { id: 'head', name: 'Head', emoji: '🧠', position: { top: '5%', left: '50%' } },
  { id: 'face', name: 'Face', emoji: '😊', position: { top: '12%', left: '50%' } },
  { id: 'shoulders', name: 'Shoulders', emoji: '💪', position: { top: '22%', left: '50%' } },
  { id: 'chest', name: 'Chest', emoji: '❤️', position: { top: '32%', left: '50%' } },
  { id: 'tummy', name: 'Tummy', emoji: '🦋', position: { top: '45%', left: '50%' } },
  { id: 'hands', name: 'Hands', emoji: '✋', position: { top: '50%', left: '25%' } },
  { id: 'legs', name: 'Legs', emoji: '🦵', position: { top: '70%', left: '50%' } },
  { id: 'feet', name: 'Feet', emoji: '🦶', position: { top: '90%', left: '50%' } },
];

// Feeling options
const FEELINGS = [
  { id: 'great', emoji: '😄', label: 'Great', color: '#5CB85C' },
  { id: 'good', emoji: '🙂', label: 'Good', color: '#4A9FD4' },
  { id: 'okay', emoji: '😐', label: 'Okay', color: '#F5A623' },
  { id: 'uncomfortable', emoji: '😕', label: 'Uncomfortable', color: '#E86B9A' },
  { id: 'hurting', emoji: '😣', label: 'Hurting', color: '#E63B2E' },
];

// =====================================================
// ADD TO SCHEDULE MODAL
// =====================================================
const AddToScheduleModal = ({ isOpen, onClose, onAdd }) => {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [enableReminder, setEnableReminder] = useState(true);
  const [scheduleMultiple, setScheduleMultiple] = useState(false);
  const [times, setTimes] = useState(['09:00', '12:00', '15:00']);

  if (!isOpen) return null;

  const handleAdd = () => {
    onAdd({
      date: selectedDate,
      time: selectedTime,
      times: scheduleMultiple ? times : [selectedTime],
      reminder: enableReminder,
      multiple: scheduleMultiple,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#E86B9A] text-white p-4 flex items-center gap-3 sticky top-0">
          <CalendarPlus size={24} />
          <h3 className="font-display text-xl flex-1">Schedule Body Check-In</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Use Case Description */}
          <div className="p-3 bg-pink-50 rounded-xl border-2 border-pink-200">
            <p className="font-crayon text-sm text-pink-700">
              🧘 <strong>Why schedule body check-ins?</strong> Regular check-ins help build 
              body awareness and recognize how your body feels. This is important for 
              self-regulation and identifying needs before they become overwhelming.
            </p>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#E86B9A]">
              <User size={24} className="text-white" />
            </div>
            <div>
              <p className="font-display text-gray-800">Body Check-In</p>
              <p className="font-crayon text-sm text-gray-500">How does your body feel?</p>
            </div>
          </div>

          {/* Single vs Multiple */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">📋 How many check-ins?</label>
            <div className="flex gap-2">
              <button
                onClick={() => setScheduleMultiple(false)}
                className={`flex-1 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                  ${!scheduleMultiple 
                    ? 'border-[#E86B9A] bg-pink-50 text-[#E86B9A]' 
                    : 'border-gray-200 text-gray-600'}`}
              >
                One Check-In
              </button>
              <button
                onClick={() => setScheduleMultiple(true)}
                className={`flex-1 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                  ${scheduleMultiple 
                    ? 'border-[#E86B9A] bg-pink-50 text-[#E86B9A]' 
                    : 'border-gray-200 text-gray-600'}`}
              >
                Multiple Times
              </button>
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
                            ? 'border-[#E86B9A] bg-pink-50 text-[#E86B9A]' 
                            : 'border-gray-200 text-gray-600'}`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate(getTomorrow())}
                className={`flex-1 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                          ${selectedDate === getTomorrow() 
                            ? 'border-[#E86B9A] bg-pink-50 text-[#E86B9A]' 
                            : 'border-gray-200 text-gray-600'}`}
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
          {!scheduleMultiple ? (
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
            </div>
          ) : (
            <div>
              <label className="block font-crayon text-gray-600 mb-2">
                <Clock size={16} className="inline mr-1" />
                Check-in times (add 3 reminders throughout the day)
              </label>
              <div className="space-y-2">
                {times.map((time, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-crayon text-gray-500 w-20">
                      {idx === 0 ? 'Morning' : idx === 1 ? 'Midday' : 'Afternoon'}
                    </span>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => {
                        const newTimes = [...times];
                        newTimes[idx] = e.target.value;
                        setTimes(newTimes);
                      }}
                      className="flex-1 p-2 border-2 border-gray-200 rounded-xl font-crayon"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reminder Toggle */}
          <button
            type="button"
            onClick={() => setEnableReminder(!enableReminder)}
            className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all
              ${enableReminder 
                ? 'bg-pink-50 border-[#E86B9A]' 
                : 'bg-gray-50 border-gray-200'}`}
          >
            <div className={`p-2 rounded-full ${enableReminder ? 'bg-[#E86B9A]' : 'bg-gray-300'}`}>
              {enableReminder ? (
                <Bell size={16} className="text-white" />
              ) : (
                <BellOff size={16} className="text-white" />
              )}
            </div>
            <span className="font-crayon text-gray-700 flex-1 text-left">
              {enableReminder ? 'Reminders on' : 'No reminders'}
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
            {scheduleMultiple ? `Add ${times.length} Check-Ins` : 'Add to Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const BodyCheckIn = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedPart, setSelectedPart] = useState(null);
  const [bodyStatus, setBodyStatus] = useState({});
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Schedule modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setHistory(data.history || []);
        // Load today's check-in if exists
        const today = new Date().toISOString().split('T')[0];
        const todayEntry = (data.history || []).find(e => e.date === today);
        if (todayEntry) {
          setBodyStatus(todayEntry.status || {});
          setNotes(todayEntry.notes || '');
        }
      } catch (e) {}
    }
  }, []);

  // Save check-in
  const saveCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const entry = {
      id: Date.now(),
      date: today,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: bodyStatus,
      notes,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [entry, ...history.filter(h => h.date !== today)].slice(0, 30);
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ history: newHistory }));
    
    toast.success('Check-In Saved!', 'Your body check-in has been recorded');
  };

  // Set body part feeling
  const setFeeling = (partId, feelingId) => {
    setBodyStatus(prev => ({
      ...prev,
      [partId]: feelingId
    }));
    setSelectedPart(null);
  };

  // Handle schedule
  const handleAddToSchedule = ({ date, times, reminder, multiple }) => {
    if (multiple && times.length > 1) {
      const activities = times.map(time => ({
        name: 'Body Check-In',
        time,
        emoji: '🧘',
        color: '#E86B9A',
      }));

      const result = addMultipleActivitiesToSchedule({
        date,
        activities,
        source: SCHEDULE_SOURCES.SENSORY_BREAK,
        notify: reminder,
      });

      setShowScheduleModal(false);

      if (result && result.success) {
        toast.schedule(
          'Check-Ins Scheduled!',
          `${times.length} body check-ins added to your schedule for ${formatDateDisplay(date)}`
        );
      } else {
        toast.error('Oops!', 'Could not add to schedule. Please try again.');
      }
    } else {
      const result = addActivityToSchedule({
        date,
        name: 'Body Check-In',
        time: times[0],
        emoji: '🧘',
        color: '#E86B9A',
        source: SCHEDULE_SOURCES.SENSORY_BREAK,
        notify: reminder,
        metadata: {
          type: 'body-checkin',
        },
      });

      setShowScheduleModal(false);

      if (result && result.success) {
        toast.schedule(
          'Check-In Scheduled!',
          `Body check-in added for ${formatDateDisplay(date)} at ${formatTimeDisplay(times[0])}`
        );
      } else {
        toast.error('Oops!', 'Could not add to schedule. Please try again.');
      }
    }
  };

  // Get overall status
  const getOverallStatus = () => {
    const statuses = Object.values(bodyStatus);
    if (statuses.length === 0) return null;
    const hasHurting = statuses.includes('hurting');
    const hasUncomfortable = statuses.includes('uncomfortable');
    if (hasHurting) return FEELINGS.find(f => f.id === 'hurting');
    if (hasUncomfortable) return FEELINGS.find(f => f.id === 'uncomfortable');
    return FEELINGS.find(f => f.id === 'good');
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E86B9A]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/emotional-wellness')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E86B9A] 
                       rounded-xl font-display font-bold text-[#E86B9A] hover:bg-[#E86B9A] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#E86B9A] crayon-text">
              🧘 Body Check-In
            </h1>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 bg-white border-2 border-gray-200 rounded-xl"
          >
            <History size={20} className="text-gray-500" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Schedule Button */}
        <button
          onClick={() => setShowScheduleModal(true)}
          className="w-full mb-6 p-4 bg-gradient-to-r from-[#E86B9A] to-[#8E6BBF] text-white 
                     rounded-2xl font-display flex items-center justify-center gap-3 shadow-lg
                     hover:opacity-90 transition-all"
        >
          <CalendarPlus size={24} />
          Schedule Regular Check-Ins
        </button>

        {/* Instructions */}
        <div className="text-center mb-6">
          <p className="font-crayon text-gray-600">
            Tap a body part to check how it feels
          </p>
        </div>

        {/* Body Map */}
        <div className="bg-white rounded-3xl border-4 border-[#E86B9A] shadow-crayon p-6 mb-6">
          <div className="relative w-48 mx-auto" style={{ height: '400px' }}>
            {/* Body outline */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-9xl opacity-20">🧍</div>
            </div>
            
            {/* Body part buttons */}
            {BODY_PARTS.map(part => {
              const status = bodyStatus[part.id];
              const feeling = FEELINGS.find(f => f.id === status);
              
              return (
                <button
                  key={part.id}
                  onClick={() => setSelectedPart(part)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 
                           w-12 h-12 rounded-full border-3 flex items-center justify-center
                           transition-all hover:scale-110 shadow-md"
                  style={{ 
                    ...part.position,
                    backgroundColor: feeling ? `${feeling.color}30` : 'white',
                    borderColor: feeling ? feeling.color : '#E5E7EB',
                  }}
                >
                  <span className="text-xl">{feeling ? feeling.emoji : part.emoji}</span>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            {FEELINGS.map(feeling => (
              <div key={feeling.id} className="flex items-center gap-1 text-xs font-crayon">
                <span className="text-lg">{feeling.emoji}</span>
                <span style={{ color: feeling.color }}>{feeling.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl border-3 border-gray-200 p-4 mb-6">
          <label className="block font-crayon text-gray-600 mb-2">
            📝 Any notes about how you feel?
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional: Describe how you're feeling..."
            className="w-full p-3 border-2 border-gray-200 rounded-xl font-crayon resize-none
                     focus:border-[#E86B9A] focus:outline-none"
            rows={3}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={saveCheckIn}
          disabled={Object.keys(bodyStatus).length === 0}
          className="w-full py-4 bg-[#5CB85C] text-white rounded-2xl font-display text-lg
                   flex items-center justify-center gap-2 shadow-lg
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-green-600 transition-all"
        >
          <Save size={24} />
          Save Check-In
        </button>

        {/* Tips */}
        <div className="mt-6 p-4 bg-pink-50 rounded-2xl border-3 border-pink-200">
          <h3 className="font-display text-[#E86B9A] mb-2 flex items-center gap-2">
            <Sparkles size={18} />
            Body Awareness Tips
          </h3>
          <ul className="font-crayon text-sm text-pink-700 space-y-1">
            <li>• Check in with your body several times a day</li>
            <li>• Notice without judging - all feelings are okay</li>
            <li>• If something hurts, tell a grown-up</li>
            <li>• Deep breathing can help tense areas relax</li>
          </ul>
        </div>
      </main>

      {/* Body Part Selector Modal */}
      {selectedPart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden">
            <div className="bg-[#E86B9A] text-white p-4 flex items-center justify-between">
              <h3 className="font-display text-xl">
                {selectedPart.emoji} How does your {selectedPart.name} feel?
              </h3>
              <button onClick={() => setSelectedPart(null)} className="p-1 hover:bg-white/20 rounded-full">
                <X size={24} />
              </button>
            </div>
            <div className="p-4 grid grid-cols-5 gap-2">
              {FEELINGS.map(feeling => (
                <button
                  key={feeling.id}
                  onClick={() => setFeeling(selectedPart.id, feeling.id)}
                  className={`p-3 rounded-xl border-3 transition-all hover:scale-105
                    ${bodyStatus[selectedPart.id] === feeling.id 
                      ? 'border-[#E86B9A]' 
                      : 'border-gray-200'}`}
                  style={{ backgroundColor: `${feeling.color}20` }}
                >
                  <span className="text-3xl block text-center">{feeling.emoji}</span>
                  <span className="font-crayon text-xs text-gray-600 block text-center mt-1">{feeling.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="bg-[#E86B9A] text-white p-4 flex items-center justify-between">
              <h3 className="font-display text-xl flex items-center gap-2">
                <BarChart3 size={20} />
                Check-In History
              </h3>
              <button onClick={() => setShowHistory(false)} className="p-1 hover:bg-white/20 rounded-full">
                <X size={24} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {history.length === 0 ? (
                <p className="text-center font-crayon text-gray-500 py-8">
                  No check-ins yet. Start by checking in above!
                </p>
              ) : (
                <div className="space-y-3">
                  {history.slice(0, 10).map(entry => (
                    <div key={entry.id} className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-crayon text-gray-600">{entry.date}</span>
                        <span className="font-crayon text-sm text-gray-400">{entry.time}</span>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {Object.entries(entry.status || {}).map(([partId, feelingId]) => {
                          const part = BODY_PARTS.find(p => p.id === partId);
                          const feeling = FEELINGS.find(f => f.id === feelingId);
                          return (
                            <span 
                              key={partId} 
                              className="text-sm px-2 py-1 rounded-lg"
                              style={{ backgroundColor: `${feeling?.color}20` }}
                            >
                              {part?.name}: {feeling?.emoji}
                            </span>
                          );
                        })}
                      </div>
                      {entry.notes && (
                        <p className="font-crayon text-sm text-gray-500 mt-2 italic">
                          "{entry.notes}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      <AddToScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onAdd={handleAddToSchedule}
      />
    </div>
  );
};

export default BodyCheckIn;
