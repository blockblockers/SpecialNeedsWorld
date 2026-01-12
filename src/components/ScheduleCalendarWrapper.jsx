// ScheduleCalendarWrapper.jsx - Calendar wrapper for Visual Schedule
// Shows day/week/month views and integrates with schedule builder
// Now with cloud sync support!

import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Copy, Bell, BellOff, Clock, Settings, Cloud, CloudOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  formatDate, 
  formatDisplayDate,
  getToday,
  isToday,
  addDays,
  getScheduleForDate,
  saveScheduleToDate,
  getDatesWithSchedules
} from '../services/calendar';
import { 
  requestPermission, 
  getPermissionStatus,
  getNotificationSettings,
  scheduleActivityNotifications,
  initNotifications
} from '../services/notifications';
import { 
  saveSchedule as saveScheduleToCloud,
  getSchedule as getScheduleFromCloud,
  scheduleNotificationsForDay,
  fullSync
} from '../services/calendarSync';
import { useAuth } from '../App';
import MonthCalendar from './MonthCalendar';
import WeekCalendar from './WeekCalendar';
import CloneScheduleModal from './CloneScheduleModal';

const ScheduleCalendarWrapper = ({ 
  children, 
  scheduleItems,
  setScheduleItems,
  scheduleName,
  setScheduleName,
  onSave,
  onDateChange
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [showMonthView, setShowMonthView] = useState(false);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, synced, error
  
  // Initialize notifications
  useEffect(() => {
    initNotifications();
    const settings = getNotificationSettings();
    setNotificationsEnabled(getPermissionStatus() === 'granted' && settings.globalEnabled);
  }, []);
  
  // Notify parent of date changes
  useEffect(() => {
    if (onDateChange) {
      onDateChange(formatDate(selectedDate));
    }
  }, [selectedDate, onDateChange]);
  
  // Initial sync on mount
  useEffect(() => {
    if (user?.id) {
      handleInitialSync();
    }
  }, [user?.id]);
  
  // Handle initial sync
  const handleInitialSync = async () => {
    setIsSyncing(true);
    setSyncStatus('syncing');
    try {
      await fullSync(user.id);
      setSyncStatus('synced');
    } catch (error) {
      console.error('Initial sync failed:', error);
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Load schedule for selected date
  useEffect(() => {
    loadScheduleForDate();
  }, [selectedDate, user?.id]);
  
  const loadScheduleForDate = async () => {
    const dateStr = formatDate(selectedDate);
    
    // Try to load from cloud first, then local
    if (user?.id) {
      const cloudSchedule = await getScheduleFromCloud(user.id, dateStr);
      if (cloudSchedule) {
        setScheduleItems(cloudSchedule.activities || []);
        setScheduleName(cloudSchedule.name || `Schedule for ${formatDisplayDate(selectedDate)}`);
        setHasChanges(false);
        return;
      }
    }
    
    // Fallback to local
    const saved = getScheduleForDate(dateStr);
    if (saved) {
      setScheduleItems(saved.activities || []);
      setScheduleName(saved.name || `Schedule for ${formatDisplayDate(selectedDate)}`);
    } else if (!isToday(selectedDate)) {
      setScheduleItems([]);
      setScheduleName(`Schedule for ${formatDisplayDate(selectedDate)}`);
    }
    setHasChanges(false);
  };
  
  // Save schedule for current date
  const saveCurrentSchedule = async () => {
    const dateStr = formatDate(selectedDate);
    const schedule = {
      id: Date.now(),
      name: scheduleName,
      activities: scheduleItems,
      date: dateStr,
    };
    
    // Save locally first
    saveScheduleToDate(dateStr, schedule);
    
    // Sync to cloud
    if (user?.id) {
      setIsSyncing(true);
      setSyncStatus('syncing');
      try {
        const result = await saveScheduleToCloud(user.id, dateStr, schedule);
        setSyncStatus(result.cloud ? 'synced' : 'error');
        
        // Schedule server-side notifications
        if (notificationsEnabled) {
          await scheduleNotificationsForDay(user.id, dateStr);
        }
      } catch (error) {
        console.error('Cloud save failed:', error);
        setSyncStatus('error');
      } finally {
        setIsSyncing(false);
      }
    }
    
    // Also schedule local notifications as fallback
    const settings = getNotificationSettings();
    if (notificationsEnabled && settings.globalEnabled && settings.apps?.visualSchedule?.enabled) {
      scheduleActivityNotifications(dateStr, scheduleItems, { 
        repeatUntilComplete: true 
      });
    }
    
    setHasChanges(false);
    if (onSave) onSave();
  };
  
  // Mark as changed when items update
  useEffect(() => {
    setHasChanges(true);
  }, [scheduleItems, scheduleName]);
  
  // Enable notifications
  const handleEnableNotifications = async () => {
    const permission = await requestPermission();
    setNotificationsEnabled(permission === 'granted');
  };
  
  // Navigate dates
  const goToPrevDay = () => setSelectedDate(addDays(selectedDate, -1));
  const goToNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const goToToday = () => setSelectedDate(getToday());
  
  const currentSchedule = {
    name: scheduleName,
    activities: scheduleItems,
  };
  
  return (
    <div className="space-y-4">
      {/* Date Navigation */}
      <div className="bg-white rounded-2xl border-4 border-[#4A9FD4] shadow-crayon overflow-hidden">
        {/* Current Date Header */}
        <div className="bg-[#4A9FD4] text-white p-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={goToPrevDay}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="text-center flex-1">
              <button 
                onClick={() => setShowMonthView(true)}
                className="hover:bg-white/20 px-4 py-1 rounded-lg transition-colors"
              >
                <div className="font-display text-xl flex items-center justify-center gap-2">
                  <Calendar size={20} />
                  {formatDisplayDate(selectedDate)}
                </div>
                {isToday(selectedDate) && (
                  <span className="text-xs font-crayon bg-white/20 px-2 py-0.5 rounded-full">
                    Today
                  </span>
                )}
              </button>
            </div>
            
            <button 
              onClick={goToNextDay}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
        
        {/* Week Strip */}
        <WeekCalendar 
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onViewMonth={() => setShowMonthView(true)}
        />
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        {!isToday(selectedDate) && (
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-[#5CB85C] text-white rounded-xl font-crayon text-sm shadow-sm flex items-center gap-2"
          >
            📅 Go to Today
          </button>
        )}
        
        {scheduleItems.length > 0 && (
          <button
            onClick={() => setShowCloneModal(true)}
            className="px-4 py-2 bg-[#8E6BBF] text-white rounded-xl font-crayon text-sm shadow-sm flex items-center gap-2"
          >
            <Copy size={16} /> Clone Schedule
          </button>
        )}
        
        <button
          onClick={notificationsEnabled ? () => {} : handleEnableNotifications}
          className={`px-4 py-2 rounded-xl font-crayon text-sm shadow-sm flex items-center gap-2 ${
            notificationsEnabled 
              ? 'bg-gray-200 text-gray-600' 
              : 'bg-[#F5A623] text-white'
          }`}
        >
          {notificationsEnabled ? (
            <><Bell size={16} /> Notifications On</>
          ) : (
            <><BellOff size={16} /> Enable Reminders</>
          )}
        </button>
        
        {/* Sync Status Indicator */}
        {user?.id && (
          <div className={`px-3 py-2 rounded-xl font-crayon text-xs flex items-center gap-1 ${
            syncStatus === 'syncing' ? 'bg-[#4A9FD4]/20 text-[#4A9FD4]' :
            syncStatus === 'synced' ? 'bg-[#5CB85C]/20 text-[#5CB85C]' :
            syncStatus === 'error' ? 'bg-[#E63B2E]/20 text-[#E63B2E]' :
            'bg-gray-100 text-gray-500'
          }`}>
            {syncStatus === 'syncing' ? (
              <><Cloud size={14} className="animate-pulse" /> Syncing...</>
            ) : syncStatus === 'synced' ? (
              <><Cloud size={14} /> Synced</>
            ) : syncStatus === 'error' ? (
              <><CloudOff size={14} /> Offline</>
            ) : (
              <><Cloud size={14} /> Cloud</>
            )}
          </div>
        )}
        
        {hasChanges && scheduleItems.length > 0 && (
          <button
            onClick={saveCurrentSchedule}
            disabled={isSyncing}
            className={`px-4 py-2 bg-[#E63B2E] text-white rounded-xl font-crayon text-sm shadow-sm ${
              isSyncing ? 'opacity-50' : 'animate-pulse'
            }`}
          >
            {isSyncing ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
        )}
      </div>
      
      {/* Schedule Builder (children) */}
      {children}
      
      {/* Month Calendar Modal */}
      {showMonthView && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <MonthCalendar
              selectedDate={selectedDate}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setShowMonthView(false);
              }}
              onClose={() => setShowMonthView(false)}
            />
            <button
              onClick={() => setShowMonthView(false)}
              className="w-full mt-4 py-3 bg-white rounded-xl font-crayon text-gray-600 shadow-crayon"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Clone Modal */}
      {showCloneModal && (
        <CloneScheduleModal
          sourceDate={selectedDate}
          schedule={currentSchedule}
          onClose={() => setShowCloneModal(false)}
          onSuccess={(count) => {
            alert(`Schedule copied to ${count} dates!`);
          }}
        />
      )}
    </div>
  );
};

export default ScheduleCalendarWrapper;
