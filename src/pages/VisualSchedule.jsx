// VisualSchedule.jsx - Redesigned Visual Schedule for ATLASassist
// Features:
// - Week view by default (expandable to month)
// - Time slots from 6am to 10pm
// - Activities placed in time slots
// - Cloud sync across devices

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Check, 
  X, 
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Utensils,
  Bath,
  BookOpen,
  Tv,
  Car,
  School,
  Bed,
  Shirt,
  Apple,
  Coffee,
  Music,
  Palette,
  Users,
  Home,
  ShoppingBag,
  Pill,
  Clock,
  Trash2,
  Edit3,
  Save,
  Calendar,
  CalendarDays,
  Bell,
  BellOff,
  LayoutTemplate,
  Star,
  Cloud,
  CloudOff,
  Loader2
} from 'lucide-react';
import { useAuth } from '../App';
import { 
  formatDate, 
  formatDisplayDate, 
  getToday,
  isToday,
  getMonthDays,
  saveScheduleToDate,
  getScheduleForDate,
  getAllSchedules,
} from '../services/calendar';
import { 
  getPermissionStatus,
  scheduleActivityNotifications,
  getNotificationSettings
} from '../services/notifications';
import {
  saveSchedule as saveScheduleWithSync,
  getSchedule as getScheduleWithSync,
  fullSync,
  getSyncStatus,
} from '../services/calendarSync';

// ============================================
// ACTIVITY ICONS & TEMPLATES
// ============================================

const activityIcons = [
  { id: 'wake-up', name: 'Wake Up', icon: Sun, color: '#FCE94F', emoji: '🌅' },
  { id: 'breakfast', name: 'Breakfast', icon: Coffee, color: '#F37736', emoji: '🥣' },
  { id: 'lunch', name: 'Lunch', icon: Utensils, color: '#7BC043', emoji: '🥗' },
  { id: 'dinner', name: 'Dinner', icon: Utensils, color: '#0392CF', emoji: '🍽️' },
  { id: 'snack', name: 'Snack', icon: Apple, color: '#EE4035', emoji: '🍎' },
  { id: 'get-dressed', name: 'Get Dressed', icon: Shirt, color: '#9B59B6', emoji: '👕' },
  { id: 'brush-teeth', name: 'Brush Teeth', icon: Star, color: '#0392CF', emoji: '🦷' },
  { id: 'bath', name: 'Bath/Shower', icon: Bath, color: '#0392CF', emoji: '🛁' },
  { id: 'medicine', name: 'Medicine', icon: Pill, color: '#E91E8C', emoji: '💊' },
  { id: 'school', name: 'School', icon: School, color: '#F37736', emoji: '🏫' },
  { id: 'homework', name: 'Homework', icon: BookOpen, color: '#9B59B6', emoji: '📚' },
  { id: 'reading', name: 'Reading', icon: BookOpen, color: '#7BC043', emoji: '📖' },
  { id: 'tv-time', name: 'TV Time', icon: Tv, color: '#0392CF', emoji: '📺' },
  { id: 'play-time', name: 'Play Time', icon: Star, color: '#FCE94F', emoji: '🎮' },
  { id: 'music', name: 'Music', icon: Music, color: '#E91E8C', emoji: '🎵' },
  { id: 'art', name: 'Art/Craft', icon: Palette, color: '#9B59B6', emoji: '🎨' },
  { id: 'car-ride', name: 'Car Ride', icon: Car, color: '#8B4513', emoji: '🚗' },
  { id: 'go-home', name: 'Go Home', icon: Home, color: '#7BC043', emoji: '🏠' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: '#E91E8C', emoji: '🛒' },
  { id: 'family-time', name: 'Family Time', icon: Users, color: '#EE4035', emoji: '👨‍👩‍👧' },
  { id: 'therapy', name: 'Therapy', icon: Users, color: '#4A9FD4', emoji: '🗣️' },
  { id: 'exercise', name: 'Exercise', icon: Star, color: '#5CB85C', emoji: '🏃' },
  { id: 'quiet-time', name: 'Quiet Time', icon: Moon, color: '#8E6BBF', emoji: '🧘' },
  { id: 'bedtime', name: 'Bedtime', icon: Moon, color: '#9B59B6', emoji: '🌙' },
  { id: 'sleep', name: 'Sleep', icon: Bed, color: '#0392CF', emoji: '😴' },
];

const scheduleTemplates = [
  {
    id: 'school-day',
    name: 'School Day',
    emoji: '🏫',
    items: [
      { activityId: 'wake-up', time: '07:00' },
      { activityId: 'get-dressed', time: '07:15' },
      { activityId: 'breakfast', time: '07:30' },
      { activityId: 'brush-teeth', time: '07:50' },
      { activityId: 'school', time: '08:00' },
      { activityId: 'lunch', time: '12:00' },
      { activityId: 'go-home', time: '15:00' },
      { activityId: 'snack', time: '15:30' },
      { activityId: 'homework', time: '16:00' },
      { activityId: 'play-time', time: '17:00' },
      { activityId: 'dinner', time: '18:00' },
      { activityId: 'bath', time: '19:00' },
      { activityId: 'bedtime', time: '20:00' },
    ],
  },
  {
    id: 'weekend',
    name: 'Weekend',
    emoji: '🎉',
    items: [
      { activityId: 'wake-up', time: '08:00' },
      { activityId: 'breakfast', time: '08:30' },
      { activityId: 'get-dressed', time: '09:00' },
      { activityId: 'play-time', time: '09:30' },
      { activityId: 'lunch', time: '12:30' },
      { activityId: 'quiet-time', time: '13:30' },
      { activityId: 'snack', time: '16:00' },
      { activityId: 'dinner', time: '18:00' },
      { activityId: 'bath', time: '19:30' },
      { activityId: 'bedtime', time: '20:30' },
    ],
  },
  {
    id: 'morning',
    name: 'Morning Only',
    emoji: '🌅',
    items: [
      { activityId: 'wake-up', time: '07:00' },
      { activityId: 'get-dressed', time: '07:15' },
      { activityId: 'brush-teeth', time: '07:30' },
      { activityId: 'breakfast', time: '07:45' },
    ],
  },
  {
    id: 'evening',
    name: 'Evening Only',
    emoji: '🌙',
    items: [
      { activityId: 'dinner', time: '18:00' },
      { activityId: 'bath', time: '19:00' },
      { activityId: 'brush-teeth', time: '19:30' },
      { activityId: 'bedtime', time: '20:00' },
    ],
  },
];

// Time slots configuration
const TIME_SLOTS = [];
// Before 6am slot
TIME_SLOTS.push({ start: '00:00', end: '06:00', label: 'Before 6am', isBoundary: true });
// Regular slots from 6am to 10pm (every 30 min)
for (let hour = 6; hour < 22; hour++) {
  TIME_SLOTS.push({ 
    start: `${hour.toString().padStart(2, '0')}:00`, 
    end: `${hour.toString().padStart(2, '0')}:30`,
    label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
    isHour: true
  });
  TIME_SLOTS.push({ 
    start: `${hour.toString().padStart(2, '0')}:30`, 
    end: `${(hour + 1).toString().padStart(2, '0')}:00`,
    label: `${hour > 12 ? hour - 12 : hour}:30`,
    isHour: false
  });
}
// After 10pm slot
TIME_SLOTS.push({ start: '22:00', end: '23:59', label: 'After 10pm', isBoundary: true });

// Helper to find which slot an activity belongs to
const getTimeSlotIndex = (time) => {
  if (!time) return -1;
  const [hours, minutes] = time.split(':').map(Number);
  const timeMinutes = hours * 60 + minutes;
  
  // Before 6am
  if (timeMinutes < 360) return 0;
  // After 10pm
  if (timeMinutes >= 1320) return TIME_SLOTS.length - 1;
  
  // Calculate slot (6am = slot 1, each slot is 30 min)
  const slotIndex = 1 + Math.floor((timeMinutes - 360) / 30);
  return Math.min(slotIndex, TIME_SLOTS.length - 2);
};

// ============================================
// WEEK CALENDAR COMPONENT
// ============================================

const WeekCalendar = ({ selectedDate, onSelectDate, datesWithSchedules, onExpandMonth }) => {
  const [weekStart, setWeekStart] = useState(() => {
    const today = selectedDate || getToday();
    const dayOfWeek = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - dayOfWeek);
    return start;
  });

  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      days.push(date);
    }
    return days;
  }, [weekStart]);

  const prevWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(weekStart.getDate() - 7);
    setWeekStart(newStart);
  };

  const nextWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(weekStart.getDate() + 7);
    setWeekStart(newStart);
  };

  const goToToday = () => {
    const today = getToday();
    const dayOfWeek = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - dayOfWeek);
    setWeekStart(start);
    onSelectDate(today);
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthYear = weekDays[3].toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-2xl border-4 border-[#4A9FD4] shadow-crayon overflow-hidden">
      {/* Header */}
      <div className="bg-[#4A9FD4] text-white p-3 flex items-center justify-between">
        <button onClick={prevWeek} className="p-2 hover:bg-white/20 rounded-full">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center flex-1">
          <h3 className="font-display text-lg">{monthYear}</h3>
        </div>
        <button onClick={nextWeek} className="p-2 hover:bg-white/20 rounded-full">
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 p-2">
        {weekDays.map((day, i) => {
          const dateStr = formatDate(day);
          const hasSchedule = datesWithSchedules.includes(dateStr);
          const isSelected = formatDate(selectedDate) === dateStr;
          const isTodayDate = isToday(day);
          
          return (
            <button
              key={i}
              onClick={() => onSelectDate(day)}
              className={`
                flex flex-col items-center p-2 rounded-xl transition-all
                ${isSelected ? 'bg-[#4A9FD4] text-white' : 'hover:bg-gray-100'}
                ${isTodayDate && !isSelected ? 'ring-2 ring-[#F5A623]' : ''}
              `}
            >
              <span className="text-xs font-crayon opacity-70">{dayNames[i]}</span>
              <span className="text-lg font-display">{day.getDate()}</span>
              {hasSchedule && !isSelected && (
                <div className="w-2 h-2 bg-[#5CB85C] rounded-full mt-1" />
              )}
              {hasSchedule && isSelected && (
                <div className="w-2 h-2 bg-white rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Footer with Today and Expand */}
      <div className="p-2 border-t flex gap-2">
        {!isToday(selectedDate) && (
          <button
            onClick={goToToday}
            className="flex-1 py-2 bg-[#F5A623] text-white rounded-lg font-crayon text-sm"
          >
            Go to Today
          </button>
        )}
        <button
          onClick={onExpandMonth}
          className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-crayon text-sm flex items-center justify-center gap-1"
        >
          <CalendarDays size={16} />
          Month View
        </button>
      </div>
    </div>
  );
};

// ============================================
// MONTH CALENDAR MODAL
// ============================================

const MonthCalendarModal = ({ selectedDate, onSelectDate, datesWithSchedules, onClose }) => {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  
  const days = getMonthDays(viewDate.getFullYear(), viewDate.getMonth());
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFEF5] w-full max-w-md rounded-2xl border-4 border-[#4A9FD4] shadow-crayon-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#4A9FD4] text-white p-4 flex items-center justify-between">
          <button onClick={prevMonth} className="p-2 hover:bg-white/20 rounded-full">
            <ChevronLeft size={20} />
          </button>
          <h3 className="font-display text-xl">{monthName}</h3>
          <button onClick={nextMonth} className="p-2 hover:bg-white/20 rounded-full">
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="p-2 text-center text-xs font-bold text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 p-2 gap-1">
          {days.map((day, i) => {
            const dateStr = formatDate(day.date);
            const hasSchedule = datesWithSchedules.includes(dateStr);
            const isSelected = formatDate(selectedDate) === dateStr;
            
            return (
              <button
                key={i}
                onClick={() => {
                  onSelectDate(day.date);
                  onClose();
                }}
                className={`
                  aspect-square p-1 rounded-lg text-sm font-crayon relative transition-all
                  ${!day.isCurrentMonth ? 'text-gray-300' : ''}
                  ${day.isToday ? 'ring-2 ring-[#F5A623]' : ''}
                  ${isSelected ? 'bg-[#4A9FD4] text-white' : day.isCurrentMonth ? 'hover:bg-gray-100' : ''}
                `}
              >
                {day.date.getDate()}
                {hasSchedule && !isSelected && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#5CB85C] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
        
        {/* Close Button */}
        <div className="p-3 border-t">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-display"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TIME SLOT ROW COMPONENT
// ============================================

const TimeSlotRow = ({ slot, activities, onToggleComplete, onEditActivity, onDeleteActivity }) => {
  const slotActivities = activities.filter(a => {
    const slotIndex = getTimeSlotIndex(a.time);
    const currentIndex = TIME_SLOTS.indexOf(slot);
    return slotIndex === currentIndex;
  });

  const isEvenHour = slot.isHour;
  const isBoundary = slot.isBoundary;

  // Don't render boundary slots if empty
  if (isBoundary && slotActivities.length === 0) {
    return null;
  }

  return (
    <div className={`
      flex border-b min-h-[52px]
      ${isBoundary ? 'bg-amber-50' : isEvenHour ? 'bg-white' : 'bg-gray-50'}
    `}>
      {/* Time Label */}
      <div className={`
        w-20 flex-shrink-0 p-2 text-xs font-crayon border-r flex items-center
        ${isEvenHour || isBoundary ? 'text-gray-700 font-bold' : 'text-gray-400'}
        ${isBoundary ? 'bg-amber-100 text-amber-700' : ''}
      `}>
        {slot.label}
      </div>
      
      {/* Activities */}
      <div className="flex-1 p-1.5 flex flex-wrap gap-1.5 items-center">
        {slotActivities.map(activity => {
          const iconData = activityIcons.find(i => i.id === activity.activityId) || {};
          const activityColor = activity.color || iconData.color || '#4A9FD4';
          
          return (
            <div
              key={activity.id}
              className={`
                flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm cursor-pointer
                transition-all hover:scale-105 shadow-sm
                ${activity.completed 
                  ? 'bg-green-100 border-2 border-green-500' 
                  : 'border-2'
                }
              `}
              style={{ 
                borderColor: activity.completed ? '#22c55e' : activityColor,
                backgroundColor: activity.completed ? '#dcfce7' : `${activityColor}20`
              }}
              onClick={() => onToggleComplete(activity.id)}
            >
              <span className="text-lg">{activity.emoji || iconData.emoji || '⭐'}</span>
              <span className={`font-crayon ${activity.completed ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                {activity.customName || activity.name || iconData.name}
              </span>
              {activity.completed && <Check size={14} className="text-green-600" />}
              <button
                onClick={(e) => { e.stopPropagation(); onEditActivity(activity); }}
                className="ml-1 p-1 hover:bg-white/50 rounded"
              >
                <Edit3 size={12} className="text-gray-400" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteActivity(activity.id); }}
                className="p-1 hover:bg-red-100 rounded"
              >
                <Trash2 size={12} className="text-red-400" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// ACTIVITY MODAL
// ============================================

const ActivityModal = ({ activity, onSave, onClose }) => {
  const [selectedActivity, setSelectedActivity] = useState(activity?.activityId || null);
  const [time, setTime] = useState(activity?.time || '');
  const [notify, setNotify] = useState(activity?.notify !== false);
  const [customName, setCustomName] = useState(activity?.customName || '');
  
  const handleSave = () => {
    if (!selectedActivity) return;
    
    const iconData = activityIcons.find(i => i.id === selectedActivity) || {};
    onSave({
      id: activity?.id || Date.now(),
      activityId: selectedActivity,
      name: iconData.name,
      customName: customName.trim() || null,
      time,
      notify,
      color: iconData.color,
      emoji: iconData.emoji,
      completed: activity?.completed || false,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFEF5] w-full max-w-md rounded-2xl border-4 border-[#5CB85C] shadow-crayon-lg max-h-[90vh] overflow-y-auto">
        <div className="bg-[#5CB85C] text-white p-4 flex items-center justify-between sticky top-0">
          <h3 className="font-display text-xl">
            {activity ? 'Edit Activity' : 'Add Activity'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Activity Selection */}
          <div>
            <label className="block font-crayon text-gray-700 mb-2">Choose Activity</label>
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {activityIcons.map(icon => (
                <button
                  key={icon.id}
                  onClick={() => setSelectedActivity(icon.id)}
                  className={`
                    flex flex-col items-center p-2 rounded-xl border-2 transition-all
                    ${selectedActivity === icon.id 
                      ? 'border-[#5CB85C] bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <span className="text-2xl">{icon.emoji}</span>
                  <span className="text-xs font-crayon text-gray-600 text-center leading-tight mt-1">
                    {icon.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Custom Name */}
          <div>
            <label className="block font-crayon text-gray-700 mb-2">Custom Name (optional)</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g., Dr. Smith appointment"
              className="w-full p-3 border-3 border-gray-200 rounded-xl font-crayon"
            />
          </div>
          
          {/* Time */}
          <div>
            <label className="block font-crayon text-gray-700 mb-2">
              <Clock size={16} className="inline mr-1" />
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 border-3 border-gray-200 rounded-xl font-crayon text-lg"
            />
          </div>
          
          {/* Notifications */}
          <div>
            <button
              onClick={() => setNotify(!notify)}
              className={`
                w-full p-3 rounded-xl border-3 flex items-center justify-between
                ${notify ? 'border-[#5CB85C] bg-green-50' : 'border-gray-200'}
              `}
            >
              <span className="font-crayon text-gray-700">Reminder</span>
              {notify ? (
                <Bell className="text-[#5CB85C]" size={20} />
              ) : (
                <BellOff className="text-gray-400" size={20} />
              )}
            </button>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="p-4 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-crayon"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedActivity}
            className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl font-crayon
                     disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TEMPLATES MODAL
// ============================================

const TemplatesModal = ({ onSelectTemplate, onClose }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-[#FFFEF5] w-full max-w-md rounded-2xl border-4 border-[#F5A623] shadow-crayon-lg">
      <div className="bg-[#F5A623] text-white p-4 flex items-center justify-between">
        <h3 className="font-display text-xl flex items-center gap-2">
          <LayoutTemplate size={24} />
          Schedule Templates
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
          <X size={24} />
        </button>
      </div>
      
      <div className="p-4 space-y-3">
        <p className="font-crayon text-gray-600 text-sm text-center mb-4">
          Choose a template to pre-fill the schedule
        </p>
        
        {scheduleTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="w-full p-4 bg-white border-3 border-gray-200 rounded-xl text-left
                     hover:border-[#F5A623] transition-all flex items-center gap-4"
          >
            <span className="text-3xl">{template.emoji}</span>
            <div>
              <h4 className="font-display text-gray-800">{template.name}</h4>
              <p className="text-xs font-crayon text-gray-500">
                {template.items.length} activities
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

const VisualSchedule = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  
  // State
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [activities, setActivities] = useState([]);
  const [datesWithSchedules, setDatesWithSchedules] = useState([]);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  // Sync state
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [dataSource, setDataSource] = useState('local');
  
  const dateStr = formatDate(selectedDate);
  const canSync = user && !isGuest;
  
  // Initial sync on mount
  useEffect(() => {
    if (canSync) {
      handleSync();
    }
    const status = getSyncStatus();
    if (status.lastSync) {
      setLastSync(new Date(status.lastSync));
    }
  }, [user?.id]);
  
  // Load schedule for selected date
  useEffect(() => {
    const loadSchedule = async () => {
      if (canSync) {
        const schedule = await getScheduleWithSync(user.id, dateStr);
        if (schedule && schedule.activities) {
          setActivities(schedule.activities);
          setDataSource(schedule.source || 'cloud');
        } else {
          setActivities([]);
          setDataSource('local');
        }
      } else {
        const schedule = getScheduleForDate(dateStr);
        if (schedule && schedule.activities) {
          setActivities(schedule.activities);
        } else {
          setActivities([]);
        }
        setDataSource('local');
      }
      setHasUnsavedChanges(false);
    };
    
    loadSchedule();
  }, [dateStr, canSync, user?.id]);
  
  // Load dates with schedules
  useEffect(() => {
    const all = getAllSchedules();
    setDatesWithSchedules(Object.keys(all));
  }, [activities]);
  
  // Check notification permission
  useEffect(() => {
    const settings = getNotificationSettings();
    setNotificationsEnabled(getPermissionStatus() === 'granted' && settings.globalEnabled);
  }, []);
  
  // Sync handler
  const handleSync = async () => {
    if (!canSync || syncing) return;
    
    setSyncing(true);
    try {
      const result = await fullSync(user.id);
      setLastSync(new Date());
      console.log('Sync complete:', result);
      
      const schedule = await getScheduleWithSync(user.id, dateStr);
      if (schedule && schedule.activities) {
        setActivities(schedule.activities);
        setDataSource(schedule.source || 'cloud');
      }
      
      const all = getAllSchedules();
      setDatesWithSchedules(Object.keys(all));
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
    }
  };
  
  // Save schedule
  const saveSchedule = useCallback(async () => {
    const schedule = {
      id: Date.now(),
      name: `Schedule for ${formatDisplayDate(selectedDate)}`,
      activities: activities,
      date: dateStr,
      updatedAt: new Date().toISOString(),
    };
    
    if (canSync) {
      const result = await saveScheduleWithSync(user.id, dateStr, schedule);
      if (result.cloud) {
        setDataSource('cloud');
      }
    } else {
      saveScheduleToDate(dateStr, schedule);
    }
    
    setHasUnsavedChanges(false);
    
    if (notificationsEnabled) {
      scheduleActivityNotifications(dateStr, activities, { repeatUntilComplete: true });
    }
    
    setDatesWithSchedules(prev => 
      prev.includes(dateStr) ? prev : [...prev, dateStr]
    );
  }, [activities, dateStr, selectedDate, notificationsEnabled, canSync, user?.id]);
  
  // Auto-save
  useEffect(() => {
    if (hasUnsavedChanges && activities.length > 0) {
      const timer = setTimeout(saveSchedule, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasUnsavedChanges, activities, saveSchedule]);
  
  // Activity handlers
  const handleAddActivity = (activityData) => {
    const newActivities = [...activities, activityData].sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
    
    setActivities(newActivities);
    setHasUnsavedChanges(true);
    setShowActivityModal(false);
    setEditingActivity(null);
  };
  
  const handleEditActivity = (activityData) => {
    const newActivities = activities.map(a => 
      a.id === activityData.id ? activityData : a
    ).sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
    
    setActivities(newActivities);
    setHasUnsavedChanges(true);
    setShowActivityModal(false);
    setEditingActivity(null);
  };
  
  const handleDeleteActivity = (id) => {
    if (confirm('Delete this activity?')) {
      setActivities(activities.filter(a => a.id !== id));
      setHasUnsavedChanges(true);
    }
  };
  
  const handleToggleComplete = (id) => {
    setActivities(activities.map(a => 
      a.id === id ? { ...a, completed: !a.completed } : a
    ));
    setHasUnsavedChanges(true);
  };
  
  const handleSelectTemplate = (template) => {
    const newActivities = template.items.map((item, index) => {
      const iconData = activityIcons.find(i => i.id === item.activityId) || {};
      return {
        id: Date.now() + index,
        activityId: item.activityId,
        name: iconData.name,
        time: item.time,
        notify: true,
        completed: false,
        color: iconData.color,
        emoji: iconData.emoji,
      };
    });
    
    setActivities(newActivities);
    setHasUnsavedChanges(true);
    setShowTemplates(false);
  };
  
  // Stats
  const totalCount = activities.length;
  const completedCount = activities.filter(a => a.completed).length;

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E63B2E]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#E63B2E] 
                     rounded-xl font-display text-[#E63B2E] hover:bg-[#E63B2E] 
                     hover:text-white transition-all text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-display text-[#E63B2E] flex items-center gap-2">
              <Calendar size={20} />
              Visual Schedule
            </h1>
          </div>
          
          {/* Sync Status */}
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <span className="text-xs font-crayon text-[#F5A623] animate-pulse">Saving...</span>
            )}
            
            {canSync ? (
              <button
                onClick={handleSync}
                disabled={syncing}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-crayon transition-all
                  ${syncing ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                title={lastSync ? `Last synced: ${lastSync.toLocaleTimeString()}` : 'Tap to sync'}
              >
                {syncing ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Cloud size={14} />
                )}
                <span className="hidden sm:inline">
                  {syncing ? 'Syncing...' : dataSource === 'cloud' ? 'Synced' : 'Sync'}
                </span>
              </button>
            ) : (
              <div 
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs font-crayon text-gray-500"
                title="Sign in to sync across devices"
              >
                <CloudOff size={14} />
                <span className="hidden sm:inline">Local</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Week Calendar */}
        <WeekCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          datesWithSchedules={datesWithSchedules}
          onExpandMonth={() => setShowMonthModal(true)}
        />
        
        {/* Selected Date Header */}
        <div className="bg-white rounded-xl border-3 border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl text-gray-800">
                {formatDisplayDate(selectedDate)}
              </h2>
              {totalCount > 0 && (
                <p className="font-crayon text-sm text-gray-500">
                  {completedCount} of {totalCount} completed
                </p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowTemplates(true)}
                className="p-2 bg-[#F5A623] text-white rounded-xl hover:bg-orange-500 transition-colors"
                title="Use Template"
              >
                <LayoutTemplate size={20} />
              </button>
              <button
                onClick={() => {
                  setEditingActivity(null);
                  setShowActivityModal(true);
                }}
                className="p-2 bg-[#5CB85C] text-white rounded-xl hover:bg-green-600 transition-colors"
                title="Add Activity"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Time Slots Grid */}
        <div className="bg-white rounded-xl border-3 border-gray-200 overflow-hidden">
          <div className="max-h-[55vh] overflow-y-auto">
            {TIME_SLOTS.map((slot, index) => (
              <TimeSlotRow
                key={index}
                slot={slot}
                activities={activities}
                onToggleComplete={handleToggleComplete}
                onEditActivity={(activity) => {
                  setEditingActivity(activity);
                  setShowActivityModal(true);
                }}
                onDeleteActivity={handleDeleteActivity}
              />
            ))}
          </div>
          
          {activities.length === 0 && (
            <div className="p-8 text-center">
              <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="font-crayon text-gray-500">No activities scheduled</p>
              <p className="font-crayon text-gray-400 text-sm">Tap + to add activities or use a template</p>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showActivityModal && (
        <ActivityModal
          activity={editingActivity}
          onSave={editingActivity ? handleEditActivity : handleAddActivity}
          onClose={() => {
            setShowActivityModal(false);
            setEditingActivity(null);
          }}
        />
      )}
      
      {showTemplates && (
        <TemplatesModal
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}
      
      {showMonthModal && (
        <MonthCalendarModal
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          datesWithSchedules={datesWithSchedules}
          onClose={() => setShowMonthModal(false)}
        />
      )}
    </div>
  );
};

export default VisualSchedule;
