// AddToScheduleModal.jsx - Reusable modal for adding items to Visual Schedule
// Used by Sleep Tracker, Healthy Choices, Move/Exercise, Nutrition, Social Stories, etc.

import { useState } from 'react';
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
  // Quick date options
  quickDates = ['today', 'tomorrow'],
}) => {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [selectedTime, setSelectedTime] = useState(defaultTime);
  const [enableNotify, setEnableNotify] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      // Check if activity already exists
      if (activityExists(selectedDate, itemName, selectedTime)) {
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

      if (result.success) {
        onSuccess?.({
          date: selectedDate,
          time: selectedTime,
          activityId: result.activityId,
        });
        onClose();
      } else {
        setError(result.error || 'Failed to add to schedule');
      }
    } catch (e) {
      setError(e.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDate = (option) => {
    if (option === 'today') {
      setSelectedDate(getToday());
    } else if (option === 'tomorrow') {
      setSelectedDate(getTomorrow());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-[#FFFEF5] w-full max-w-sm rounded-2xl border-4 border-[#5CB85C] shadow-crayon-lg overflow-hidden animate-bounce-in"
        style={{ borderRadius: '30px 70px 30px 70px / 70px 30px 70px 30px' }}
      >
        {/* Header */}
        <div className="bg-[#5CB85C] text-white p-4 flex items-center gap-3">
          <Calendar size={24} />
          <h3 className="font-display text-xl flex-1">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Item Preview */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${itemColor}20` }}
            >
              {itemImage ? (
                <img src={itemImage} alt="" className="w-full h-full object-cover rounded-lg" />
              ) : (
                itemEmoji
              )}
            </div>
            <span className="font-crayon text-lg text-gray-700 flex-1">{itemName}</span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-300 rounded-xl">
              <p className="font-crayon text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Quick Date Buttons */}
          {quickDates.length > 0 && (
            <div className="flex gap-2">
              {quickDates.includes('today') && (
                <button
                  onClick={() => handleQuickDate('today')}
                  className={`flex-1 py-2 px-3 rounded-xl font-crayon text-sm transition-all
                    ${selectedDate === getToday() 
                      ? 'bg-[#5CB85C] text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  Today
                </button>
              )}
              {quickDates.includes('tomorrow') && (
                <button
                  onClick={() => handleQuickDate('tomorrow')}
                  className={`flex-1 py-2 px-3 rounded-xl font-crayon text-sm transition-all
                    ${selectedDate === getTomorrow() 
                      ? 'bg-[#5CB85C] text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  Tomorrow
                </button>
              )}
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label className="font-crayon text-gray-600 text-sm mb-1 block flex items-center gap-1">
              <Calendar size={14} />
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getToday()}
              className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl font-crayon
                       focus:border-[#5CB85C] focus:outline-none"
            />
            <p className="font-crayon text-xs text-gray-400 mt-1">
              {formatDateDisplay(selectedDate)}
            </p>
          </div>

          {/* Time Picker */}
          {showTimeSelection && (
            <div>
              <label className="font-crayon text-gray-600 text-sm mb-1 block flex items-center gap-1">
                <Clock size={14} />
                Time
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl font-crayon
                         focus:border-[#5CB85C] focus:outline-none"
              />
              <p className="font-crayon text-xs text-gray-400 mt-1">
                {formatTimeDisplay(selectedTime)}
              </p>
            </div>
          )}

          {/* Notification Toggle */}
          {showNotifyOption && (
            <button
              onClick={() => setEnableNotify(!enableNotify)}
              className={`w-full p-3 rounded-xl border-3 flex items-center gap-3 transition-all
                ${enableNotify 
                  ? 'bg-purple-50 border-purple-400' 
                  : 'bg-gray-50 border-gray-200'
                }`}
            >
              <div className={`p-2 rounded-full ${enableNotify ? 'bg-purple-500' : 'bg-gray-300'}`}>
                {enableNotify ? (
                  <Bell size={16} className="text-white" />
                ) : (
                  <BellOff size={16} className="text-white" />
                )}
              </div>
              <span className="font-crayon text-gray-700 flex-1 text-left">
                {enableNotify ? 'Reminder enabled' : 'No reminder'}
              </span>
              {enableNotify && (
                <span className="font-crayon text-xs text-purple-500">
                  5 min before
                </span>
              )}
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 pt-0">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 border-3 border-gray-300 rounded-xl font-crayon text-gray-600
                       hover:bg-gray-100 transition-all disabled:opacity-50"
            style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-[#5CB85C] border-3 border-green-600 rounded-xl font-crayon text-white
                       hover:bg-green-600 transition-all disabled:opacity-50
                       flex items-center justify-center gap-2"
            style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
