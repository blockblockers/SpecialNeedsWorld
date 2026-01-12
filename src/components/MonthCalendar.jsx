// MonthCalendar.jsx - Month view for Visual Schedule
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Copy } from 'lucide-react';
import { getMonthDays, formatDate, isToday, getDatesWithSchedules, addMonths } from '../services/calendar';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MonthCalendar = ({ 
  selectedDate, 
  onSelectDate, 
  onClose,
  scheduledDates = [] 
}) => {
  const [viewDate, setViewDate] = useState(selectedDate || new Date());
  
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = getMonthDays(year, month);
  
  // Get dates with schedules for this month
  const datesWithSchedules = getDatesWithSchedules(year, month);
  
  const goToPrevMonth = () => setViewDate(addMonths(viewDate, -1));
  const goToNextMonth = () => setViewDate(addMonths(viewDate, 1));
  const goToToday = () => {
    const today = new Date();
    setViewDate(today);
    onSelectDate(today);
  };
  
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return (
    <div className="bg-white rounded-2xl border-4 border-[#4A9FD4] shadow-crayon-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[#4A9FD4] text-white p-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={goToPrevMonth}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="text-center">
            <h3 className="font-display text-xl">{monthName}</h3>
            <button 
              onClick={goToToday}
              className="text-xs font-crayon bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 mt-1"
            >
              Today
            </button>
          </div>
          
          <button 
            onClick={goToNextMonth}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 bg-[#87CEEB]/30">
        {WEEKDAYS.map(day => (
          <div key={day} className="p-2 text-center font-crayon text-sm text-gray-600">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dateStr = formatDate(day.date);
          const hasSchedule = datesWithSchedules.includes(dateStr);
          const isSelected = selectedDate && formatDate(selectedDate) === dateStr;
          
          return (
            <button
              key={index}
              onClick={() => onSelectDate(day.date)}
              className={`
                relative p-2 h-12 sm:h-14 border-t border-l border-gray-100
                transition-all hover:bg-[#F8D14A]/30
                ${!day.isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                ${day.isToday ? 'bg-[#5CB85C]/20 font-bold' : ''}
                ${isSelected ? 'bg-[#4A9FD4] text-white' : ''}
                ${day.isPast && !day.isToday ? 'opacity-50' : ''}
              `}
            >
              <span className="font-crayon text-sm sm:text-base">
                {day.date.getDate()}
              </span>
              
              {/* Schedule indicator */}
              {hasSchedule && !isSelected && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E63B2E]" />
                </div>
              )}
              
              {/* Today indicator */}
              {day.isToday && !isSelected && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 rounded-full bg-[#5CB85C]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="p-3 bg-gray-50 border-t flex items-center justify-center gap-4 text-xs font-crayon">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#5CB85C]" /> Today
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#E63B2E]" /> Has Schedule
        </span>
      </div>
    </div>
  );
};

export default MonthCalendar;
