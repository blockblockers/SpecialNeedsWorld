// AddToScheduleModal.jsx - Universal modal for adding items to Visual Schedule
// FIXED: Time input now allows any time (not just 7am-8pm in hour increments)
// Used by: Choice Board, Healthy Choices, Move/Exercise, Nutrition, Social Stories, etc.

import { useState, useEffect } from 'react';
import { X, Check, Calendar, Clock, Bell, BellOff } from 'lucide-react';
import { 
  addActivityToSchedule, 
  getToday, 
  getTomorrow, 
  formatDateDisplay,
  formatTimeDisplay,
  activityExists 
} from '../services/scheduleHelper';

const AddToScheduleModal = ({
  isOpen,
  onClose,
  onSuccess,
  // Item details
  itemName,
  itemEmoji = '⭐',
  itemColor = '#4A9FD4',
  itemSource = 'custom',
  itemImage = null,
  itemMetadata = {},
  // Configuration
  defaultTime = '09:00',
  showTimeSelection = true,
  showNotifyOption = true,
  title = 'Add to Schedule',
  confirmText = 'Add to Schedule',
}) => {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [selectedTime, setSelectedTime] = useState(defaultTime);
  const [enableNotify, setEnableNotify] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(getToday());
      setSelectedTime(defaultTime);
      setEnableNotify(true);
      setIsSubmitting(false);
      setError(null);
    }
  }, [isOpen, defaultTime]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      // Check if activity already exists
      if (activityExists && activityExists(selectedDate, itemName, selectedTime)) {
        setError('This activity is already scheduled for this time.');
        setIsSubmitting(false);
        return;
      }

      const result = addActivityToSchedule({
        date: selectedDate,
        name: itemName,
        time: selectedTime,
        emoji: itemEmoji,
        color: itemColor,
        source: itemSource,
        notify: enableNotify,
        customImage: itemImage,
        metadata: itemMetadata,
      });

      if (result && result.success) {
        onSuccess?.({
          date: selectedDate,
          time: selectedTime,
          notify: enableNotify,
          activityId: result.activityId,
        });
        onClose();
      } else {
        setError(result?.error || 'Failed to add to schedule. Please try again.');
      }
    } catch (err) {
      console.error('Error adding to schedule:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div 
        className="bg-[#FFFEF5] w-full max-w-md max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
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

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="font-crayon text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Date Selection */}
          <div>
            <label className="font-crayon text-gray-600 text-sm mb-2 flex items-center gap-2">
              <Calendar size={16} />
              Select Date
            </label>
            
            {/* Quick Date Buttons */}
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setSelectedDate(getToday())}
                className={`flex-1 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                          ${selectedDate === getToday() 
                            ? 'border-current bg-opacity-20' 
                            : 'border-gray-200 hover:border-gray-300'}`}
                style={{ 
                  borderColor: selectedDate === getToday() ? itemColor : undefined,
                  backgroundColor: selectedDate === getToday() ? `${itemColor}15` : undefined,
                  color: selectedDate === getToday() ? itemColor : undefined,
                }}
              >
                Today
              </button>
              <button
                onClick={() => setSelectedDate(getTomorrow())}
                className={`flex-1 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                          ${selectedDate === getTomorrow() 
                            ? 'border-current bg-opacity-20' 
                            : 'border-gray-200 hover:border-gray-300'}`}
                style={{ 
                  borderColor: selectedDate === getTomorrow() ? itemColor : undefined,
                  backgroundColor: selectedDate === getTomorrow() ? `${itemColor}15` : undefined,
                  color: selectedDate === getTomorrow() ? itemColor : undefined,
                }}
              >
                Tomorrow
              </button>
            </div>
            
            {/* Custom date picker */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getToday()}
              className="w-full p-3 rounded-xl border-2 border-gray-200 font-crayon text-sm
                       focus:outline-none focus:border-current"
              style={{ 
                borderColor: selectedDate !== getToday() && selectedDate !== getTomorrow() ? itemColor : undefined 
              }}
            />
          </div>

          {/* Time Selection - NOW USES INPUT TYPE="TIME" */}
          {showTimeSelection && (
            <div>
              <label className="font-crayon text-gray-600 text-sm mb-2 flex items-center gap-2">
                <Clock size={16} />
                Select Time
              </label>
              
              {/* Time input - allows any time */}
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-gray-200 font-crayon text-lg
                         focus:outline-none focus:border-current"
                style={{ borderColor: itemColor }}
              />
              <p className="text-xs font-crayon text-gray-400 mt-1">
                Tap to pick any time or type it in
              </p>
            </div>
          )}

          {/* Notification Toggle */}
          {showNotifyOption && (
            <button
              onClick={() => setEnableNotify(!enableNotify)}
              className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all
                ${enableNotify 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
                }`}
            >
              {enableNotify ? (
                <Bell size={20} className="text-green-600" />
              ) : (
                <BellOff size={20} className="text-gray-400" />
              )}
              <span className={`font-crayon flex-1 text-left ${enableNotify ? 'text-green-700' : 'text-gray-500'}`}>
                {enableNotify ? '🔔 Notify me at this time' : '🔕 No notification'}
              </span>
              <div 
                className={`w-10 h-6 rounded-full transition-all flex items-center px-0.5
                  ${enableNotify ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div 
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform
                    ${enableNotify ? 'translate-x-4' : 'translate-x-0'}`}
                />
              </div>
            </button>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-white border-2 border-gray-300 rounded-xl font-crayon 
                     text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-xl font-crayon text-white transition-colors
                     flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: itemColor }}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⏳</span>
                Adding...
              </>
            ) : (
              <>
                <Check size={20} />
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToScheduleModal;
