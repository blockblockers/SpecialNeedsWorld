// WeekCalendar.jsx - Week view for Visual Schedule
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getWeekDays, formatDate, addDays, getDatesWithSchedules, getScheduleForDate } from '../services/calendar';

const WeekCalendar = ({ 
  selectedDate, 
  onSelectDate,
  onViewMonth 
}) => {
  const weekDays = getWeekDays(selectedDate);
  const weekStart = weekDays[0].date;
  
  const goToPrevWeek = () => onSelectDate(addDays(selectedDate, -7));
  const goToNextWeek = () => onSelectDate(addDays(selectedDate, 7));
  
  // Get schedules for the week
  const getActivityCount = (date) => {
    const schedule = getScheduleForDate(formatDate(date));
    return schedule?.activities?.length || 0;
  };
  
  return (
    <div className="bg-white rounded-2xl border-4 border-[#F5A623] shadow-crayon overflow-hidden">
      {/* Header */}
      <div className="bg-[#F5A623] text-white p-2 flex items-center justify-between">
        <button 
          onClick={goToPrevWeek}
          className="p-1.5 hover:bg-white/20 rounded-full"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button 
          onClick={onViewMonth}
          className="font-display text-sm hover:bg-white/20 px-3 py-1 rounded-full"
        >
          📅 View Month
        </button>
        
        <button 
          onClick={goToNextWeek}
          className="p-1.5 hover:bg-white/20 rounded-full"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Week Days */}
      <div className="grid grid-cols-7 divide-x divide-gray-100">
        {weekDays.map((day, index) => {
          const isSelected = formatDate(day.date) === formatDate(selectedDate);
          const activityCount = getActivityCount(day.date);
          
          return (
            <button
              key={index}
              onClick={() => onSelectDate(day.date)}
              className={`
                p-2 text-center transition-all
                ${isSelected ? 'bg-[#4A9FD4] text-white' : 'hover:bg-[#F8D14A]/30'}
                ${day.isToday && !isSelected ? 'bg-[#5CB85C]/20' : ''}
              `}
            >
              <div className="font-crayon text-xs opacity-70">
                {day.dayName}
              </div>
              <div className={`font-display text-lg ${day.isToday ? 'text-[#5CB85C]' : ''} ${isSelected ? 'text-white' : ''}`}>
                {day.date.getDate()}
              </div>
              {activityCount > 0 && (
                <div className={`text-xs font-crayon mt-1 ${isSelected ? 'text-white/80' : 'text-[#E63B2E]'}`}>
                  {activityCount} item{activityCount > 1 ? 's' : ''}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WeekCalendar;
