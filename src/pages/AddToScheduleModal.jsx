// AddToScheduleModal.jsx - Reusable modal for adding items to Visual Schedule
// Used by: Appointments, Reminders, Daily Routines, First-Then, OT Exercises,
//          Sensory Breaks, Health Trackers, Social Stories

import { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Bell, 
  BellOff,
  Check,
  ChevronRight
} from 'lucide-react';
import { formatDate, getToday, addDays, formatDisplayDate } from '../services/calendar';

// Quick date options
const getDateOptions = () => {
  const today = getToday();
  return [
    { label: 'Today', value: formatDate(today), isToday: true },
    { label: 'Tomorrow', value: formatDate(addDays(today, 1)) },
    { label: 'In 2 days', value: formatDate(addDays(today, 2)) },
    { label: 'In 3 days', value: formatDate(addDays(today, 3)) },
    { label: 'Next week', value: formatDate(addDays(today, 7)) },
  ];
};

// Common time presets
const TIME_PRESETS = [
  { label: 'Morning', times: ['07:00', '08:00', '09:00', '10:00', '11:00'] },
  { label: 'Afternoon', times: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'] },
  { label: 'Evening', times: ['18:00', '19:00', '20:00', '21:00'] },
];

const AddToScheduleModal = ({
  isOpen,
  onClose,
  onAdd,
  title = 'Add to Schedule',
  itemName,
  itemEmoji,
  itemColor = '#4A9FD4',
  itemImage = null,
  defaultTime = '09:00',
  showTimeSelection = true,
  showNotifyOption = true,
  customContent = null,
  confirmButtonText = 'Add to Schedule',
}) => {
  const [selectedDate, setSelectedDate] = useState(formatDate(getToday()));
  const [selectedTime, setSelectedTime] = useState(defaultTime);
  const [customTime, setCustomTime] = useState(false);
  const [notify, setNotify] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(formatDate(getToday()));
      setSelectedTime(defaultTime);
      setCustomTime(false);
      setNotify(true);
      setIsAdding(false);
    }
  }, [isOpen, defaultTime]);

  if (!isOpen) return null;

  const dateOptions = getDateOptions();

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      await onAdd({
        date: selectedDate,
        time: showTimeSelection ? selectedTime : null,
        notify,
      });
      onClose();
    } catch (error) {
      console.error('Error adding to schedule:', error);
    } finally {
      setIsAdding(false);
    }
  };

  // Format time for display
  const formatTimeDisplay = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-[#FFFEF5] w-full max-w-md max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col">
        {/* Header */}
        <div 
          className="p-4 flex items-center justify-between flex-shrink-0"
          style={{ backgroundColor: itemColor }}
        >
          <h3 className="font-display text-xl text-white flex items-center gap-2">
            <Calendar size={24} />
            {title}
          </h3>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-white/20 rounded-full text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Item Preview */}
          <div 
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ backgroundColor: `${itemColor}15` }}
          >
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${itemColor}30` }}
            >
              {itemImage ? (
                <img 
                  src={itemImage} 
                  alt="" 
                  className="w-full h-full object-cover rounded-xl" 
                />
              ) : (
                <span className="text-3xl">{itemEmoji || '📅'}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-lg text-gray-800 truncate">{itemName}</p>
              <p className="font-crayon text-sm text-gray-500">Add to Visual Schedule</p>
            </div>
          </div>

          {/* Custom Content (if any) */}
          {customContent}

          {/* Date Selection */}
          <div>
            <label className="font-crayon text-gray-600 text-sm mb-2 flex items-center gap-2">
              <Calendar size={16} />
              Select Date
            </label>
            <div className="grid grid-cols-2 gap-2">
              {dateOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedDate(option.value)}
                  className={`p-3 rounded-xl border-2 font-crayon text-sm transition-all
                    ${selectedDate === option.value 
                      ? 'border-current bg-opacity-20' 
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  style={{ 
                    borderColor: selectedDate === option.value ? itemColor : undefined,
                    backgroundColor: selectedDate === option.value ? `${itemColor}15` : undefined,
                    color: selectedDate === option.value ? itemColor : undefined,
                  }}
                >
                  {option.label}
                  {option.isToday && (
                    <span className="block text-xs text-gray-400 mt-0.5">
                      {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </button>
              ))}
              
              {/* Custom date picker */}
              <div className="col-span-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={formatDate(getToday())}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 font-crayon text-sm
                           focus:outline-none focus:border-current"
                  style={{ 
                    borderColor: !dateOptions.some(o => o.value === selectedDate) ? itemColor : undefined 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Time Selection */}
          {showTimeSelection && (
            <div>
              <label className="font-crayon text-gray-600 text-sm mb-2 flex items-center gap-2">
                <Clock size={16} />
                Select Time
              </label>
              
              {!customTime ? (
                <div className="space-y-3">
                  {TIME_PRESETS.map((preset) => (
                    <div key={preset.label}>
                      <p className="font-crayon text-xs text-gray-400 mb-1">{preset.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {preset.times.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`px-3 py-1.5 rounded-lg border-2 font-crayon text-sm transition-all
                              ${selectedTime === time 
                                ? 'border-current' 
                                : 'border-gray-200 hover:border-gray-300'
                              }`}
                            style={{ 
                              borderColor: selectedTime === time ? itemColor : undefined,
                              backgroundColor: selectedTime === time ? `${itemColor}15` : undefined,
                              color: selectedTime === time ? itemColor : undefined,
                            }}
                          >
                            {formatTimeDisplay(time)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={() => setCustomTime(true)}
                    className="w-full p-2 rounded-lg border-2 border-dashed border-gray-300 
                             font-crayon text-sm text-gray-500 hover:border-gray-400"
                  >
                    Choose different time...
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 font-crayon text-lg
                             focus:outline-none"
                    style={{ borderColor: itemColor }}
                  />
                  <button
                    onClick={() => setCustomTime(false)}
                    className="text-sm font-crayon text-gray-500 hover:text-gray-700"
                  >
                    ← Back to presets
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Notification Toggle */}
          {showNotifyOption && (
            <button
              onClick={() => setNotify(!notify)}
              className={`w-full p-3 rounded-xl border-2 flex items-center justify-between
                transition-all ${notify ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}
            >
              <span className="flex items-center gap-2 font-crayon">
                {notify ? (
                  <>
                    <Bell size={20} className="text-green-600" />
                    <span className="text-green-700">Notifications ON</span>
                  </>
                ) : (
                  <>
                    <BellOff size={20} className="text-gray-400" />
                    <span className="text-gray-500">Notifications OFF</span>
                  </>
                )}
              </span>
              <div 
                className={`w-12 h-6 rounded-full transition-all flex items-center px-1
                  ${notify ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transition-transform
                    ${notify ? 'translate-x-6' : 'translate-x-0'}`}
                />
              </div>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleAdd}
            disabled={isAdding}
            className="w-full py-3 rounded-xl font-display text-white text-lg
                     transition-all hover:opacity-90 disabled:opacity-50
                     flex items-center justify-center gap-2"
            style={{ backgroundColor: itemColor }}
          >
            {isAdding ? (
              'Adding...'
            ) : (
              <>
                <Check size={20} />
                {confirmButtonText}
              </>
            )}
          </button>
          
          {/* Preview what will be added */}
          <p className="text-center font-crayon text-xs text-gray-400 mt-2">
            Will add to {formatDisplayDate(new Date(selectedDate + 'T00:00:00'))}
            {showTimeSelection && ` at ${formatTimeDisplay(selectedTime)}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddToScheduleModal;
