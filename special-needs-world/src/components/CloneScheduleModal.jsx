// CloneScheduleModal.jsx - Clone/repeat schedules to other dates
import { useState } from 'react';
import { X, Copy, Calendar, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  formatDate, 
  formatDisplayDate, 
  getMonthDays, 
  addMonths,
  cloneScheduleToMultipleDates,
  RECURRENCE_TYPES,
  generateRecurringDates
} from '../services/calendar';

const CloneScheduleModal = ({ 
  sourceDate, 
  schedule,
  onClose, 
  onSuccess 
}) => {
  const [mode, setMode] = useState('select'); // 'select', 'pick', 'recurring'
  const [selectedDates, setSelectedDates] = useState([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [recurrenceType, setRecurrenceType] = useState(RECURRENCE_TYPES.WEEKLY);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return formatDate(d);
  });
  
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = getMonthDays(year, month);
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const toggleDate = (date) => {
    const dateStr = formatDate(date);
    if (selectedDates.includes(dateStr)) {
      setSelectedDates(prev => prev.filter(d => d !== dateStr));
    } else {
      setSelectedDates(prev => [...prev, dateStr]);
    }
  };
  
  const handleRecurringGenerate = () => {
    const dates = generateRecurringDates(
      sourceDate,
      recurrenceType,
      new Date(endDate)
    );
    // Remove source date and past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const filtered = dates
      .filter(d => formatDate(d) !== formatDate(sourceDate))
      .filter(d => d >= today)
      .map(d => formatDate(d));
    setSelectedDates(filtered);
    setMode('pick');
  };
  
  const handleClone = () => {
    if (selectedDates.length === 0) return;
    
    const success = cloneScheduleToMultipleDates(formatDate(sourceDate), selectedDates);
    if (success) {
      onSuccess(selectedDates.length);
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border-4 border-[#8E6BBF] shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#8E6BBF] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Copy size={24} />
            <h2 className="font-display text-xl">Clone Schedule</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        {/* Source Info */}
        <div className="p-4 bg-[#8E6BBF]/10 border-b">
          <p className="font-crayon text-sm text-gray-600">Copying from:</p>
          <p className="font-display text-lg text-[#8E6BBF]">{formatDisplayDate(sourceDate)}</p>
          <p className="font-crayon text-sm text-gray-500">{schedule?.activities?.length || 0} activities</p>
        </div>
        
        {/* Mode Selection */}
        {mode === 'select' && (
          <div className="p-4 space-y-3">
            <button
              onClick={() => setMode('pick')}
              className="w-full p-4 bg-white rounded-xl border-3 border-[#4A9FD4] hover:bg-[#4A9FD4]/10 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <Calendar size={24} className="text-[#4A9FD4]" />
                <div>
                  <p className="font-display text-lg text-[#4A9FD4]">Pick Dates</p>
                  <p className="font-crayon text-sm text-gray-500">Select specific dates to copy to</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => setMode('recurring')}
              className="w-full p-4 bg-white rounded-xl border-3 border-[#5CB85C] hover:bg-[#5CB85C]/10 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔁</span>
                <div>
                  <p className="font-display text-lg text-[#5CB85C]">Recurring</p>
                  <p className="font-crayon text-sm text-gray-500">Repeat weekly, daily, etc.</p>
                </div>
              </div>
            </button>
          </div>
        )}
        
        {/* Recurring Options */}
        {mode === 'recurring' && (
          <div className="p-4 space-y-4">
            <button onClick={() => setMode('select')} className="text-[#8E6BBF] font-crayon text-sm flex items-center gap-1">
              <ChevronLeft size={16} /> Back
            </button>
            
            <div>
              <label className="font-crayon text-sm text-gray-600 block mb-2">Repeat:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: RECURRENCE_TYPES.DAILY, label: 'Daily', emoji: '📅' },
                  { type: RECURRENCE_TYPES.WEEKDAYS, label: 'Weekdays', emoji: '💼' },
                  { type: RECURRENCE_TYPES.WEEKLY, label: 'Weekly', emoji: '📆' },
                  { type: RECURRENCE_TYPES.BIWEEKLY, label: 'Bi-weekly', emoji: '🗓️' },
                  { type: RECURRENCE_TYPES.MONTHLY, label: 'Monthly', emoji: '🌙' },
                ].map(opt => (
                  <button
                    key={opt.type}
                    onClick={() => setRecurrenceType(opt.type)}
                    className={`p-3 rounded-xl border-2 font-crayon text-sm transition-all ${
                      recurrenceType === opt.type 
                        ? 'border-[#5CB85C] bg-[#5CB85C]/10 text-[#5CB85C]' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="font-crayon text-sm text-gray-600 block mb-2">Until:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={formatDate(new Date())}
                className="w-full p-3 rounded-xl border-2 border-gray-200 font-crayon focus:border-[#5CB85C] focus:outline-none"
              />
            </div>
            
            <button
              onClick={handleRecurringGenerate}
              className="w-full py-3 bg-[#5CB85C] text-white rounded-xl font-crayon text-lg shadow-crayon"
            >
              Generate Dates
            </button>
          </div>
        )}
        
        {/* Date Picker */}
        {mode === 'pick' && (
          <div className="overflow-y-auto max-h-[50vh]">
            <div className="sticky top-0 bg-white border-b p-2 flex items-center justify-between">
              <button onClick={() => setViewDate(addMonths(viewDate, -1))} className="p-1">
                <ChevronLeft size={20} />
              </button>
              <span className="font-display">{monthName}</span>
              <button onClick={() => setViewDate(addMonths(viewDate, 1))} className="p-1">
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-7 text-center text-xs font-crayon text-gray-500 py-1 border-b">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
            </div>
            
            <div className="grid grid-cols-7 p-2 gap-1">
              {days.map((day, index) => {
                const dateStr = formatDate(day.date);
                const isSelected = selectedDates.includes(dateStr);
                const isSource = dateStr === formatDate(sourceDate);
                const isPast = day.date < new Date() && !day.isToday;
                
                return (
                  <button
                    key={index}
                    onClick={() => !isSource && !isPast && toggleDate(day.date)}
                    disabled={isSource || isPast}
                    className={`
                      p-2 rounded-lg text-sm font-crayon transition-all
                      ${!day.isCurrentMonth ? 'text-gray-300' : ''}
                      ${isSource ? 'bg-[#8E6BBF] text-white cursor-not-allowed' : ''}
                      ${isSelected ? 'bg-[#5CB85C] text-white' : ''}
                      ${isPast && !isSource ? 'opacity-30 cursor-not-allowed' : ''}
                      ${!isSelected && !isSource && !isPast && day.isCurrentMonth ? 'hover:bg-gray-100' : ''}
                    `}
                  >
                    {day.date.getDate()}
                    {isSelected && <Check size={10} className="inline ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Footer */}
        {mode === 'pick' && (
          <div className="p-4 bg-gray-50 border-t">
            <div className="flex items-center justify-between mb-3">
              <span className="font-crayon text-sm text-gray-600">
                {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''} selected
              </span>
              {selectedDates.length > 0 && (
                <button 
                  onClick={() => setSelectedDates([])}
                  className="text-[#E63B2E] font-crayon text-sm"
                >
                  Clear
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setMode('select')}
                className="flex-1 py-2 border-2 border-gray-300 rounded-xl font-crayon"
              >
                Back
              </button>
              <button
                onClick={handleClone}
                disabled={selectedDates.length === 0}
                className="flex-1 py-2 bg-[#8E6BBF] text-white rounded-xl font-crayon disabled:opacity-50"
              >
                Clone to {selectedDates.length} dates
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CloneScheduleModal;
