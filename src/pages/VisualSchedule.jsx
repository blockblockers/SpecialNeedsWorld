// VisualSchedule.jsx - Redesigned Visual Schedule for ATLASassist
// Features:
// - Calendar at top, always visible
// - Day's activities shown below
// - Add activities with times
// - Templates as a separate modal
// - Save to date, with recurrence options
// - Copy days/weeks to other periods
// - Proper notifications
// - Cloud sync across devices!

import { useState, useEffect, useCallback } from 'react';
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
  Copy,
  Calendar,
  Bell,
  BellOff,
  LayoutTemplate,
  Star,
  GripVertical,
  Cloud,
  CloudOff,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useAuth } from '../App';
import { 
  formatDate, 
  formatDisplayDate, 
  formatTime,
  getToday,
  isToday,
  addDays,
  getMonthDays,
  saveScheduleToDate,
  getScheduleForDate,
  getAllSchedules,
} from '../services/calendar';
import { 
  requestPermission, 
  getPermissionStatus,
  scheduleActivityNotifications,
  sendTestNotification,
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
      { activityId: 'snack', time: '10:30' },
      { activityId: 'family-time', time: '11:00' },
      { activityId: 'lunch', time: '12:30' },
      { activityId: 'quiet-time', time: '13:30' },
      { activityId: 'art', time: '14:30' },
      { activityId: 'snack', time: '16:00' },
      { activityId: 'tv-time', time: '16:30' },
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
      { activityId: 'medicine', time: '08:00' },
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
      { activityId: 'reading', time: '19:45' },
      { activityId: 'bedtime', time: '20:00' },
    ],
  },
];

// ============================================
// MINI MONTH CALENDAR COMPONENT
// ============================================

const MiniMonthCalendar = ({ selectedDate, onSelectDate, datesWithSchedules }) => {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  
  const days = getMonthDays(viewDate.getFullYear(), viewDate.getMonth());
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const goToToday = () => {
    const today = getToday();
    setViewDate(today);
    onSelectDate(today);
  };
  
  return (
    <div className="bg-white rounded-2xl border-4 border-[#4A9FD4] shadow-crayon overflow-hidden">
      {/* Month Header */}
      <div className="bg-[#4A9FD4] text-white p-3 flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 hover:bg-white/20 rounded-full">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <h3 className="font-display text-lg">{monthName}</h3>
        </div>
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
      <div className="grid grid-cols-7 p-1">
        {days.map((day, i) => {
          const dateStr = formatDate(day.date);
          const hasSchedule = datesWithSchedules.includes(dateStr);
          const isSelected = formatDate(selectedDate) === dateStr;
          
          return (
            <button
              key={i}
              onClick={() => onSelectDate(day.date)}
              className={`
                aspect-square p-1 m-0.5 rounded-lg text-sm font-crayon relative
                transition-all hover:scale-105
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
      
      {/* Today Button */}
      {!isToday(selectedDate) && (
        <div className="p-2 border-t">
          <button
            onClick={goToToday}
            className="w-full py-2 bg-[#F5A623] text-white rounded-lg font-crayon text-sm"
          >
            Go to Today
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// ACTIVITY ITEM COMPONENT
// ============================================

const ActivityItem = ({ activity, onToggleComplete, onEdit, onDelete, onDragStart, onDragOver, onDragEnd, isDragging }) => {
  const iconData = activityIcons.find(i => i.id === activity.activityId) || {};
  
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={`
        flex items-center gap-3 p-3 bg-white rounded-xl border-3 
        transition-all ${isDragging ? 'opacity-50 scale-95' : ''}
        ${activity.completed ? 'border-[#5CB85C] bg-green-50' : 'border-gray-200'}
      `}
    >
      {/* Drag Handle */}
      <div className="cursor-grab text-gray-300 hover:text-gray-500">
        <GripVertical size={18} />
      </div>
      
      {/* Complete Checkbox */}
      <button
        onClick={onToggleComplete}
        className={`
          w-8 h-8 rounded-full border-3 flex items-center justify-center flex-shrink-0
          transition-all
          ${activity.completed 
            ? 'bg-[#5CB85C] border-[#5CB85C] text-white' 
            : 'border-gray-300 hover:border-[#5CB85C]'}
        `}
      >
        {activity.completed && <Check size={16} />}
      </button>
      
      {/* Icon */}
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
        style={{ backgroundColor: `${iconData.color}30` }}
      >
        {iconData.emoji || '⭐'}
      </div>
      
      {/* Activity Info */}
      <div className="flex-1 min-w-0">
        <p className={`font-display truncate ${activity.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {activity.name || iconData.name}
        </p>
        {activity.time && (
          <p className="text-xs font-crayon text-gray-500 flex items-center gap-1">
            <Clock size={12} />
            {formatTime(activity.time)}
            {activity.notify && <Bell size={10} className="text-[#F5A623]" />}
          </p>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex gap-1">
        <button
          onClick={onEdit}
          className="p-2 text-gray-400 hover:text-[#4A9FD4] hover:bg-gray-100 rounded-lg"
        >
          <Edit3 size={16} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-gray-400 hover:text-[#E63B2E] hover:bg-gray-100 rounded-lg"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

// ============================================
// ADD/EDIT ACTIVITY MODAL
// ============================================

const ActivityModal = ({ activity, onSave, onClose }) => {
  const [selectedActivity, setSelectedActivity] = useState(activity?.activityId || null);
  const [time, setTime] = useState(activity?.time || '');
  const [notify, setNotify] = useState(activity?.notify !== false);
  const [customName, setCustomName] = useState(activity?.customName || '');
  
  const handleSave = () => {
    if (!selectedActivity) return;
    const iconData = activityIcons.find(i => i.id === selectedActivity);
    onSave({
      ...activity,
      activityId: selectedActivity,
      name: customName || iconData?.name || 'Activity',
      time,
      notify,
      customName,
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFEF5] w-full max-w-md rounded-2xl border-4 border-[#8E6BBF] shadow-crayon-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#8E6BBF] text-white p-4 flex items-center justify-between">
          <h3 className="font-display text-xl">
            {activity ? 'Edit Activity' : 'Add Activity'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Activity Selection */}
          <div>
            <label className="font-crayon text-gray-600 text-sm mb-2 block">Choose Activity</label>
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
              {activityIcons.map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => setSelectedActivity(icon.id)}
                  className={`
                    p-2 rounded-xl border-2 flex flex-col items-center gap-1 transition-all
                    ${selectedActivity === icon.id 
                      ? 'border-[#8E6BBF] bg-purple-50' 
                      : 'border-transparent hover:border-gray-200'}
                  `}
                >
                  <span className="text-2xl">{icon.emoji}</span>
                  <span className="text-xs font-crayon text-gray-600 truncate w-full text-center">
                    {icon.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Custom Name */}
          <div>
            <label className="font-crayon text-gray-600 text-sm mb-2 block">Custom Name (optional)</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder={activityIcons.find(i => i.id === selectedActivity)?.name || 'Activity name'}
              className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl font-crayon
                       focus:border-[#8E6BBF] focus:outline-none"
            />
          </div>
          
          {/* Time */}
          <div>
            <label className="font-crayon text-gray-600 text-sm mb-2 block">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl font-crayon text-lg
                       focus:border-[#8E6BBF] focus:outline-none"
            />
          </div>
          
          {/* Notification Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              {notify ? <Bell className="text-[#F5A623]" size={20} /> : <BellOff className="text-gray-400" size={20} />}
              <span className="font-crayon">Send reminder</span>
            </div>
            <button
              onClick={() => setNotify(!notify)}
              className={`w-12 h-7 rounded-full transition-all relative ${
                notify ? 'bg-[#F5A623]' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-1 transition-all ${
                notify ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-3 border-gray-300 rounded-xl font-crayon text-gray-600"
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
          Choose a template to pre-fill today's schedule
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
// COPY SCHEDULE MODAL
// ============================================

const CopyModal = ({ sourceDate, activities, onClose, onCopy }) => {
  const [copyType, setCopyType] = useState('days');
  const [selectedDays, setSelectedDays] = useState([]);
  const [weeksAhead, setWeeksAhead] = useState(1);
  
  const toggleDay = (dayOffset) => {
    setSelectedDays(prev => 
      prev.includes(dayOffset) 
        ? prev.filter(d => d !== dayOffset)
        : [...prev, dayOffset]
    );
  };
  
  const handleCopy = () => {
    let targetDates = [];
    
    if (copyType === 'days') {
      targetDates = selectedDays.map(offset => formatDate(addDays(sourceDate, offset)));
    } else if (copyType === 'week') {
      for (let w = 1; w <= weeksAhead; w++) {
        targetDates.push(formatDate(addDays(sourceDate, w * 7)));
      }
    }
    
    onCopy(targetDates);
  };
  
  const nextWeekDays = [];
  for (let i = 1; i <= 14; i++) {
    const date = addDays(sourceDate, i);
    nextWeekDays.push({
      offset: i,
      date,
      label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    });
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFEF5] w-full max-w-md rounded-2xl border-4 border-[#8E6BBF] shadow-crayon-lg">
        <div className="bg-[#8E6BBF] text-white p-4 flex items-center justify-between">
          <h3 className="font-display text-xl flex items-center gap-2">
            <Copy size={24} />
            Copy Schedule
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <p className="font-crayon text-gray-600 text-sm">
            Copy {activities.length} activities to other days
          </p>
          
          {/* Copy Type Selection */}
          <div className="flex gap-2">
            <button
              onClick={() => setCopyType('days')}
              className={`flex-1 py-2 rounded-lg font-crayon text-sm border-2 ${
                copyType === 'days' ? 'bg-[#8E6BBF] text-white border-[#8E6BBF]' : 'border-gray-200'
              }`}
            >
              Pick Days
            </button>
            <button
              onClick={() => setCopyType('week')}
              className={`flex-1 py-2 rounded-lg font-crayon text-sm border-2 ${
                copyType === 'week' ? 'bg-[#8E6BBF] text-white border-[#8E6BBF]' : 'border-gray-200'
              }`}
            >
              Weekly Repeat
            </button>
          </div>
          
          {copyType === 'days' && (
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {nextWeekDays.map((day) => (
                <button
                  key={day.offset}
                  onClick={() => toggleDay(day.offset)}
                  className={`p-2 rounded-lg text-sm font-crayon border-2 ${
                    selectedDays.includes(day.offset)
                      ? 'bg-[#5CB85C] text-white border-[#5CB85C]'
                      : 'border-gray-200 hover:border-[#8E6BBF]'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          )}
          
          {copyType === 'week' && (
            <div className="space-y-2">
              <label className="font-crayon text-gray-600 text-sm">Repeat for how many weeks?</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((w) => (
                  <button
                    key={w}
                    onClick={() => setWeeksAhead(w)}
                    className={`flex-1 py-3 rounded-lg font-display text-lg border-2 ${
                      weeksAhead === w ? 'bg-[#8E6BBF] text-white border-[#8E6BBF]' : 'border-gray-200'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 font-crayon text-center">
                Will copy to the same day for {weeksAhead} week{weeksAhead > 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border-3 border-gray-300 rounded-xl font-crayon text-gray-600">
            Cancel
          </button>
          <button
            onClick={handleCopy}
            disabled={(copyType === 'days' && selectedDays.length === 0)}
            className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl font-crayon
                     disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Copy size={18} />
            Copy ({copyType === 'days' ? selectedDays.length : weeksAhead} {copyType === 'days' ? 'days' : 'weeks'})
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  
  // Sync state
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [dataSource, setDataSource] = useState('local'); // 'local' or 'cloud'
  
  const dateStr = formatDate(selectedDate);
  const canSync = user && !isGuest;
  
  // Initial sync on mount for authenticated users
  useEffect(() => {
    if (canSync) {
      handleSync();
    }
    // Load last sync time
    const status = getSyncStatus();
    if (status.lastSync) {
      setLastSync(new Date(status.lastSync));
    }
  }, [user?.id]);
  
  // Load schedule for selected date (with cloud support)
  useEffect(() => {
    const loadSchedule = async () => {
      if (canSync) {
        // Try to load from cloud first
        const schedule = await getScheduleWithSync(user.id, dateStr);
        if (schedule && schedule.activities) {
          setActivities(schedule.activities);
          setDataSource(schedule.source || 'cloud');
        } else {
          setActivities([]);
          setDataSource('local');
        }
      } else {
        // Guest mode - local only
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
  
  // Manual sync handler
  const handleSync = async () => {
    if (!canSync || syncing) return;
    
    setSyncing(true);
    try {
      const result = await fullSync(user.id);
      setLastSync(new Date());
      console.log('Sync complete:', result);
      
      // Reload current date's schedule after sync
      const schedule = await getScheduleWithSync(user.id, dateStr);
      if (schedule && schedule.activities) {
        setActivities(schedule.activities);
        setDataSource(schedule.source || 'cloud');
      }
      
      // Update dates with schedules
      const all = getAllSchedules();
      setDatesWithSchedules(Object.keys(all));
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
    }
  };
  
  // Save schedule (with cloud sync for authenticated users)
  const saveSchedule = useCallback(async () => {
    const schedule = {
      id: Date.now(),
      name: `Schedule for ${formatDisplayDate(selectedDate)}`,
      activities: activities,
      date: dateStr,
      updatedAt: new Date().toISOString(),
    };
    
    if (canSync) {
      // Save to both local and cloud
      const result = await saveScheduleWithSync(user.id, dateStr, schedule);
      if (result.cloud) {
        setDataSource('cloud');
      }
    } else {
      // Guest mode - local only
      saveScheduleToDate(dateStr, schedule);
    }
    
    setHasUnsavedChanges(false);
    
    // Schedule notifications
    if (notificationsEnabled) {
      scheduleActivityNotifications(dateStr, activities, { repeatUntilComplete: true });
      console.log('Scheduled notifications for', dateStr, 'with', activities.length, 'activities');
    }
    
    // Update dates with schedules
    setDatesWithSchedules(prev => 
      prev.includes(dateStr) ? prev : [...prev, dateStr]
    );
  }, [activities, dateStr, selectedDate, notificationsEnabled, canSync, user?.id]);
  
  // Auto-save when activities change
  useEffect(() => {
    if (hasUnsavedChanges && activities.length > 0) {
      const timer = setTimeout(saveSchedule, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasUnsavedChanges, activities, saveSchedule]);
  
  // Add activity
  const handleAddActivity = (activityData) => {
    const newActivity = {
      id: Date.now(),
      ...activityData,
      completed: false,
    };
    
    // Insert in time order
    const newActivities = [...activities, newActivity].sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
    
    setActivities(newActivities);
    setHasUnsavedChanges(true);
    setShowActivityModal(false);
    setEditingActivity(null);
  };
  
  // Edit activity
  const handleEditActivity = (activityData) => {
    const newActivities = activities.map(a => 
      a.id === activityData.id ? { ...a, ...activityData } : a
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
  
  // Delete activity
  const handleDeleteActivity = (id) => {
    if (!confirm('Delete this activity?')) return;
    setActivities(prev => prev.filter(a => a.id !== id));
    setHasUnsavedChanges(true);
  };
  
  // Toggle complete
  const handleToggleComplete = (id) => {
    setActivities(prev => prev.map(a => 
      a.id === id ? { ...a, completed: !a.completed } : a
    ));
    setHasUnsavedChanges(true);
  };
  
  // Apply template
  const handleApplyTemplate = (template) => {
    const newActivities = template.items.map((item, i) => {
      const iconData = activityIcons.find(icon => icon.id === item.activityId);
      return {
        id: Date.now() + i,
        activityId: item.activityId,
        name: iconData?.name || 'Activity',
        time: item.time,
        notify: true,
        completed: false,
      };
    });
    
    setActivities(newActivities);
    setHasUnsavedChanges(true);
    setShowTemplates(false);
  };
  
  // Copy schedule
  const handleCopySchedule = (targetDates) => {
    const sourceSchedule = {
      activities: activities.map(a => ({ ...a, id: Date.now() + Math.random(), completed: false })),
    };
    
    targetDates.forEach(targetDate => {
      saveScheduleToDate(targetDate, {
        ...sourceSchedule,
        id: Date.now(),
        name: `Schedule for ${targetDate}`,
        date: targetDate,
        updatedAt: new Date().toISOString(),
      });
      
      // Schedule notifications for copied dates too
      if (notificationsEnabled) {
        scheduleActivityNotifications(targetDate, sourceSchedule.activities, { repeatUntilComplete: true });
      }
    });
    
    setDatesWithSchedules(prev => [...new Set([...prev, ...targetDates])]);
    setShowCopyModal(false);
    alert(`Copied to ${targetDates.length} date(s)!`);
  };
  
  // Clear day
  const handleClearDay = () => {
    if (!confirm('Clear all activities for this day?')) return;
    setActivities([]);
    setHasUnsavedChanges(true);
  };
  
  // Enable notifications
  const handleEnableNotifications = async () => {
    const permission = await requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      await sendTestNotification('📅 Notifications Enabled!', 'You\'ll now receive reminders for your scheduled activities.');
    }
  };
  
  // Drag handlers
  const handleDragStart = (index) => setDraggedIndex(index);
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newActivities = [...activities];
    const draggedItem = newActivities[draggedIndex];
    newActivities.splice(draggedIndex, 1);
    newActivities.splice(index, 0, draggedItem);
    setActivities(newActivities);
    setDraggedIndex(index);
    setHasUnsavedChanges(true);
  };
  const handleDragEnd = () => setDraggedIndex(null);
  
  // Completion stats
  const completedCount = activities.filter(a => a.completed).length;
  const totalCount = activities.length;
  
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
        {/* Calendar */}
        <MiniMonthCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          datesWithSchedules={datesWithSchedules}
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
              {!notificationsEnabled && (
                <button
                  onClick={handleEnableNotifications}
                  className="p-2 bg-[#F5A623] text-white rounded-lg"
                  title="Enable notifications"
                >
                  <BellOff size={18} />
                </button>
              )}
              
              <button
                onClick={() => setShowTemplates(true)}
                className="p-2 bg-[#4A9FD4] text-white rounded-lg"
                title="Use template"
              >
                <LayoutTemplate size={18} />
              </button>
              
              {activities.length > 0 && (
                <button
                  onClick={() => setShowCopyModal(true)}
                  className="p-2 bg-[#8E6BBF] text-white rounded-lg"
                  title="Copy to other days"
                >
                  <Copy size={18} />
                </button>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          {totalCount > 0 && (
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#5CB85C] transition-all"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          )}
        </div>
        
        {/* Activities List */}
        <div className="space-y-2">
          {activities.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border-3 border-dashed border-gray-200">
              <div className="text-5xl mb-4">📅</div>
              <p className="font-display text-gray-600 mb-2">No activities scheduled</p>
              <p className="font-crayon text-gray-400 text-sm mb-4">
                Add activities or use a template to get started
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowActivityModal(true)}
                  className="px-4 py-2 bg-[#5CB85C] text-white rounded-xl font-crayon flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Activity
                </button>
                <button
                  onClick={() => setShowTemplates(true)}
                  className="px-4 py-2 bg-[#F5A623] text-white rounded-xl font-crayon flex items-center gap-2"
                >
                  <LayoutTemplate size={18} />
                  Use Template
                </button>
              </div>
            </div>
          ) : (
            <>
              {activities.map((activity, index) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  onToggleComplete={() => handleToggleComplete(activity.id)}
                  onEdit={() => {
                    setEditingActivity(activity);
                    setShowActivityModal(true);
                  }}
                  onDelete={() => handleDeleteActivity(activity.id)}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedIndex === index}
                />
              ))}
              
              {/* Add More Button */}
              <button
                onClick={() => setShowActivityModal(true)}
                className="w-full py-4 border-3 border-dashed border-gray-300 rounded-xl
                         font-crayon text-gray-500 hover:border-[#5CB85C] hover:text-[#5CB85C]
                         transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add Activity
              </button>
              
              {/* Clear Day */}
              <button
                onClick={handleClearDay}
                className="w-full py-2 text-sm font-crayon text-gray-400 hover:text-[#E63B2E]"
              >
                Clear all activities
              </button>
            </>
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
          onSelectTemplate={handleApplyTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}
      
      {showCopyModal && (
        <CopyModal
          sourceDate={selectedDate}
          activities={activities}
          onClose={() => setShowCopyModal(false)}
          onCopy={handleCopySchedule}
        />
      )}
    </div>
  );
};

export default VisualSchedule;
