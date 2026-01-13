// TrackerHistory.jsx - Reusable month view and graph component for trackers
// Used by Water, Sleep, Healthy Choices, and Exercise trackers

import { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BarChart3, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  X
} from 'lucide-react';

// ============================================
// MONTH CALENDAR VIEW
// ============================================
const MonthView = ({ 
  data, 
  selectedDate, 
  onSelectDate, 
  goal = null,
  valueKey = 'value',
  color = '#4A9FD4',
  formatValue = (v) => v,
}) => {
  const [viewMonth, setViewMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startWeekday; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        day,
        date: dateStr,
        value: data[dateStr]?.[valueKey] ?? data[dateStr] ?? null,
      });
    }
    
    return days;
  };

  const days = getDaysInMonth(viewMonth);
  const today = new Date().toISOString().split('T')[0];
  
  const changeMonth = (delta) => {
    const newDate = new Date(viewMonth);
    newDate.setMonth(newDate.getMonth() + delta);
    setViewMonth(newDate);
  };

  const monthName = viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-2xl border-3 border-gray-200 p-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="font-display text-lg text-gray-800">{monthName}</h3>
        <button
          onClick={() => changeMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs font-crayon text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((dayData, index) => {
          if (!dayData) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const isToday = dayData.date === today;
          const isSelected = dayData.date === selectedDate;
          const hasData = dayData.value !== null && dayData.value !== undefined;
          const metGoal = goal && hasData && dayData.value >= goal;
          
          // Calculate fill percentage for visual indicator
          const fillPercent = goal && hasData 
            ? Math.min(100, (dayData.value / goal) * 100) 
            : hasData ? 100 : 0;

          return (
            <button
              key={dayData.date}
              onClick={() => onSelectDate?.(dayData.date)}
              className={`
                aspect-square rounded-lg flex flex-col items-center justify-center relative overflow-hidden
                transition-all text-xs font-crayon
                ${isSelected ? 'ring-2 ring-offset-1' : ''}
                ${isToday ? 'font-bold' : ''}
                ${hasData ? 'hover:scale-105' : 'hover:bg-gray-50'}
              `}
              style={{
                ringColor: color,
                backgroundColor: hasData 
                  ? metGoal 
                    ? `${color}30`
                    : `${color}15`
                  : 'transparent',
              }}
            >
              {/* Fill indicator */}
              {hasData && goal && (
                <div 
                  className="absolute bottom-0 left-0 right-0 transition-all"
                  style={{ 
                    height: `${fillPercent}%`,
                    backgroundColor: `${color}40`,
                  }}
                />
              )}
              
              <span className={`relative z-10 ${hasData ? 'text-gray-800' : 'text-gray-400'}`}>
                {dayData.day}
              </span>
              
              {hasData && (
                <span 
                  className="relative z-10 text-[10px] leading-none"
                  style={{ color }}
                >
                  {formatValue(dayData.value)}
                </span>
              )}
              
              {/* Goal achieved indicator */}
              {metGoal && (
                <div 
                  className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      {goal && (
        <div className="mt-3 flex items-center justify-center gap-4 text-xs font-crayon text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: `${color}15` }} />
            Tracked
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: `${color}40` }} />
            Goal Met
          </span>
        </div>
      )}
    </div>
  );
};

// ============================================
// TREND GRAPH VIEW
// ============================================
const GraphView = ({
  data,
  days = 30,
  goal = null,
  valueKey = 'value',
  color = '#4A9FD4',
  label = 'Value',
  formatValue = (v) => v,
}) => {
  const chartData = useMemo(() => {
    const result = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const value = data[dateStr]?.[valueKey] ?? data[dateStr] ?? null;
      
      result.push({
        date: dateStr,
        value,
        dayLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      });
    }
    
    return result;
  }, [data, days, valueKey]);

  // Calculate stats
  const validValues = chartData.filter(d => d.value !== null).map(d => d.value);
  const average = validValues.length > 0 
    ? validValues.reduce((a, b) => a + b, 0) / validValues.length 
    : 0;
  const max = validValues.length > 0 ? Math.max(...validValues) : 0;
  const min = validValues.length > 0 ? Math.min(...validValues) : 0;
  const daysTracked = validValues.length;
  const goalDays = goal ? validValues.filter(v => v >= goal).length : 0;

  // Trend calculation
  const recentAvg = validValues.slice(-7).reduce((a, b) => a + b, 0) / Math.max(1, validValues.slice(-7).length);
  const olderAvg = validValues.slice(0, -7).reduce((a, b) => a + b, 0) / Math.max(1, validValues.slice(0, -7).length);
  const trend = recentAvg - olderAvg;

  // Graph dimensions
  const graphHeight = 120;
  const graphMax = Math.max(max, goal || 0) * 1.1 || 10;

  return (
    <div className="bg-white rounded-2xl border-3 border-gray-200 p-4">
      <h3 className="font-display text-lg text-gray-800 mb-4 flex items-center gap-2">
        <BarChart3 size={20} style={{ color }} />
        {days}-Day Trends
      </h3>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-gray-50 rounded-xl p-2 text-center">
          <p className="font-crayon text-xs text-gray-500">Average</p>
          <p className="font-display text-lg" style={{ color }}>
            {formatValue(Math.round(average * 10) / 10)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-2 text-center">
          <p className="font-crayon text-xs text-gray-500">Days Tracked</p>
          <p className="font-display text-lg text-gray-800">{daysTracked}</p>
        </div>
        {goal ? (
          <div className="bg-gray-50 rounded-xl p-2 text-center">
            <p className="font-crayon text-xs text-gray-500">Goals Met</p>
            <p className="font-display text-lg text-green-600">{goalDays}</p>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-2 text-center">
            <p className="font-crayon text-xs text-gray-500">Best</p>
            <p className="font-display text-lg text-green-600">{formatValue(max)}</p>
          </div>
        )}
      </div>

      {/* Trend Indicator */}
      <div className="flex items-center justify-center gap-2 mb-4 py-2 bg-gray-50 rounded-xl">
        {trend > 0.5 ? (
          <>
            <TrendingUp className="text-green-500" size={20} />
            <span className="font-crayon text-green-600">Trending up! Keep it up!</span>
          </>
        ) : trend < -0.5 ? (
          <>
            <TrendingDown className="text-orange-500" size={20} />
            <span className="font-crayon text-orange-600">Trending down - you can do it!</span>
          </>
        ) : (
          <>
            <Minus className="text-gray-500" size={20} />
            <span className="font-crayon text-gray-600">Staying steady</span>
          </>
        )}
      </div>

      {/* Bar Chart */}
      <div className="relative" style={{ height: graphHeight + 30 }}>
        {/* Goal line */}
        {goal && (
          <div 
            className="absolute left-0 right-0 border-t-2 border-dashed z-10"
            style={{ 
              top: `${graphHeight - (goal / graphMax) * graphHeight}px`,
              borderColor: `${color}60`,
            }}
          >
            <span 
              className="absolute -top-3 right-0 text-xs font-crayon px-1 bg-white"
              style={{ color }}
            >
              Goal: {formatValue(goal)}
            </span>
          </div>
        )}

        {/* Bars */}
        <div className="flex items-end justify-between h-full gap-0.5">
          {chartData.map((item, index) => {
            const barHeight = item.value !== null 
              ? (item.value / graphMax) * graphHeight 
              : 0;
            const metGoal = goal && item.value >= goal;
            
            return (
              <div 
                key={item.date}
                className="flex-1 flex flex-col items-center"
                title={`${item.dayLabel}: ${item.value !== null ? formatValue(item.value) : 'No data'}`}
              >
                <div 
                  className="w-full rounded-t transition-all hover:opacity-80"
                  style={{ 
                    height: `${barHeight}px`,
                    backgroundColor: item.value !== null 
                      ? metGoal ? color : `${color}80`
                      : '#e5e7eb',
                    minHeight: item.value !== null ? '4px' : '2px',
                  }}
                />
                {/* Show label every 5 days */}
                {index % 5 === 0 && (
                  <span className="text-[8px] font-crayon text-gray-400 mt-1 whitespace-nowrap">
                    {item.weekday.charAt(0)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Date range */}
      <div className="flex justify-between mt-2 text-xs font-crayon text-gray-400">
        <span>{chartData[0]?.dayLabel}</span>
        <span>{chartData[chartData.length - 1]?.dayLabel}</span>
      </div>
    </div>
  );
};

// ============================================
// MAIN TRACKER HISTORY COMPONENT
// ============================================
const TrackerHistory = ({
  data,
  goal = null,
  valueKey = 'value',
  color = '#4A9FD4',
  label = 'Value',
  formatValue = (v) => v,
  onClose,
}) => {
  const [view, setView] = useState('month'); // 'month' or 'graph'
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-[#FFFEF5] w-full max-w-md max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden">
        {/* Header */}
        <div 
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: color }}
        >
          <h2 className="font-display text-xl text-white flex items-center gap-2">
            {view === 'month' ? <Calendar size={24} /> : <BarChart3 size={24} />}
            History
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* View Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setView('month')}
            className={`flex-1 py-3 font-crayon flex items-center justify-center gap-2 transition-colors
              ${view === 'month' ? 'bg-white border-b-2' : 'bg-gray-50 text-gray-500'}`}
            style={{ borderColor: view === 'month' ? color : 'transparent', color: view === 'month' ? color : undefined }}
          >
            <Calendar size={18} />
            Month View
          </button>
          <button
            onClick={() => setView('graph')}
            className={`flex-1 py-3 font-crayon flex items-center justify-center gap-2 transition-colors
              ${view === 'graph' ? 'bg-white border-b-2' : 'bg-gray-50 text-gray-500'}`}
            style={{ borderColor: view === 'graph' ? color : 'transparent', color: view === 'graph' ? color : undefined }}
          >
            <BarChart3 size={18} />
            Trends
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {view === 'month' ? (
            <MonthView
              data={data}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              goal={goal}
              valueKey={valueKey}
              color={color}
              formatValue={formatValue}
            />
          ) : (
            <GraphView
              data={data}
              days={30}
              goal={goal}
              valueKey={valueKey}
              color={color}
              label={label}
              formatValue={formatValue}
            />
          )}

          {/* Selected Date Detail */}
          {view === 'month' && selectedDate && data[selectedDate] && (
            <div className="mt-4 p-4 bg-white rounded-xl border-2 border-gray-200">
              <p className="font-crayon text-sm text-gray-500">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="font-display text-2xl" style={{ color }}>
                {formatValue(data[selectedDate]?.[valueKey] ?? data[selectedDate])}
              </p>
              {goal && (
                <p className="font-crayon text-sm text-gray-500">
                  Goal: {formatValue(goal)} 
                  {(data[selectedDate]?.[valueKey] ?? data[selectedDate]) >= goal 
                    ? ' ✅ Met!' 
                    : ' ❌ Not met'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackerHistory;
