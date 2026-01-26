// AppHub.jsx - Main navigation hub for ATLASassist
// UPDATED: Visual Schedule & Point to Talk featured at top
// UPDATED: Other apps alphabetized
// UPDATED: Upcoming activities widget from Visual Schedule

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut,
  Sparkles,
  Settings,
  Clock,
  ChevronRight,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { useIsAppInstalled } from '../components/PWAInstallPrompt';
import PushNotificationPrompt from '../components/PushNotificationPrompt';
import { useAuth } from '../App';

// ============================================
// FEATURED APPS (Visual Schedule & Point to Talk)
// ============================================
const featuredApps = [
  {
    id: 'visual-schedule',
    name: 'Visual Schedule',
    description: 'Plan your day with pictures!',
    color: '#E63B2E',
    path: '/visual-schedule',
    emoji: '📅',
    icon: Calendar,
  },
  {
    id: 'point-to-talk',
    name: 'Point to Talk',
    description: 'Say what you need!',
    color: '#F5A623',
    path: '/point-to-talk',
    emoji: '💬',
    icon: MessageSquare,
  },
];

// ============================================
// OTHER APP CATEGORIES (Alphabetized by name)
// ============================================
const appCategories = [
  {
    id: 'activities',
    name: 'Activities & Learning',
    description: 'Create, learn & explore!',
    color: '#4A9FD4',
    path: '/activities',
    emoji: '🎨',
  },
  {
    id: 'tools',
    name: 'Daily Tools',
    description: 'Helpful everyday tools!',
    color: '#B8860B',
    path: '/tools',
    emoji: '🔧',
  },
  {
    id: 'wellness',
    name: 'Emotional Wellness',
    description: 'Tools to understand feelings',
    color: '#20B2AA',
    path: '/wellness',
    emoji: '💚',
  },
  {
    id: 'games',
    name: 'Games',
    description: 'Fun games to play!',
    color: '#5CB85C',
    path: '/games',
    emoji: '🎮',
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    description: 'Track your body & health!',
    color: '#E86B9A',
    path: '/health',
    emoji: '❤️',
  },
  {
    id: 'care-team',
    name: 'My Care Team',
    description: 'Your support network!',
    color: '#008B8B',
    path: '/care-team',
    emoji: '👥',
  },
  {
    id: 'planning',
    name: 'Planning & Documents',
    description: 'Important documents & planning',
    color: '#CD853F',
    path: '/planning',
    emoji: '📋',
  },
  {
    id: 'resources',
    name: 'Resources & Research',
    description: 'Laws, research & printables!',
    color: '#8E6BBF',
    path: '/resources',
    emoji: '📚',
  },
].sort((a, b) => a.name.localeCompare(b.name));

// ============================================
// UPCOMING ACTIVITIES WIDGET
// ============================================
const UpcomingActivities = ({ activities, onViewAll }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-4 border-[#E63B2E] p-4 mb-6 shadow-crayon">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-[#E63B2E] flex items-center gap-2">
            <Clock size={20} />
            Upcoming Activities
          </h2>
          <button 
            onClick={onViewAll}
            className="text-sm font-crayon text-[#E63B2E] hover:underline flex items-center gap-1"
          >
            View Schedule <ChevronRight size={16} />
          </button>
        </div>
        <p className="text-gray-500 font-crayon text-sm text-center py-4">
          No activities scheduled. Tap to add some! 📅
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-4 border-[#E63B2E] p-4 mb-6 shadow-crayon">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-[#E63B2E] flex items-center gap-2">
          <Clock size={20} />
          Coming Up
        </h2>
        <button 
          onClick={onViewAll}
          className="text-sm font-crayon text-[#E63B2E] hover:underline flex items-center gap-1"
        >
          View All <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="space-y-2">
        {activities.map((activity, index) => {
          const isNext = index === 0;
          return (
            <div 
              key={activity.id || index}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isNext 
                  ? 'bg-[#E63B2E]/10 border-2 border-[#E63B2E]/30' 
                  : 'bg-gray-50'
              }`}
            >
              <div 
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                  isNext ? 'bg-[#E63B2E] text-white' : 'bg-white border-2'
                }`}
                style={{ borderColor: isNext ? undefined : activity.color }}
              >
                {activity.emoji || '📌'}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-crayon truncate ${isNext ? 'text-[#E63B2E] font-bold' : 'text-gray-700'}`}>
                  {activity.name}
                </p>
                <p className={`text-xs font-crayon ${isNext ? 'text-[#E63B2E]/70' : 'text-gray-500'}`}>
                  {formatTime(activity.time)}
                  {isNext && ' — Up Next!'}
                </p>
              </div>
              {activity.completed && (
                <span className="text-green-500 text-lg">✓</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Format time from 24h to 12h
const formatTime = (time24) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

// ============================================
// MAIN COMPONENT
// ============================================
const AppHub = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const isInstalled = useIsAppInstalled();
  const [upcomingActivities, setUpcomingActivities] = useState([]);

  // Load upcoming activities from localStorage
  useEffect(() => {
    loadUpcomingActivities();
    
    // Refresh every minute
    const interval = setInterval(loadUpcomingActivities, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadUpcomingActivities = () => {
    try {
      // Get today's date
      const today = new Date();
      const dateKey = today.toISOString().split('T')[0];
      
      // Try to load from various storage keys
      const storageKeys = [
        `snw_schedule_${dateKey}`,
        'snw_visual_schedule',
        'snw_schedule_today',
      ];
      
      let activities = [];
      
      for (const key of storageKeys) {
        const saved = localStorage.getItem(key);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              activities = parsed;
              break;
            } else if (parsed.activities) {
              activities = parsed.activities;
              break;
            } else if (parsed.items) {
              activities = parsed.items;
              break;
            }
          } catch (e) {
            continue;
          }
        }
      }

      // Filter to upcoming activities (next 3 hours)
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);
      const maxTime = `${threeHoursLater.getHours().toString().padStart(2, '0')}:${threeHoursLater.getMinutes().toString().padStart(2, '0')}`;

      const upcoming = activities
        .filter(a => a.time && a.time >= currentTime && a.time <= maxTime && !a.completed)
        .sort((a, b) => a.time.localeCompare(b.time))
        .slice(0, 4);

      setUpcomingActivities(upcoming);
    } catch (error) {
      console.error('Error loading upcoming activities:', error);
      setUpcomingActivities([]);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#4A9FD4]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <img 
            src="/logo.jpeg" 
            alt="ATLASassist" 
            className="w-12 h-12 rounded-xl shadow-md border-2 border-[#4A9FD4]"
          />
          <div className="flex-1">
            <h1 className="text-xl font-display text-[#4A9FD4] crayon-text">
              ATLASassist
            </h1>
            <p className="text-xs font-crayon text-gray-500">
              {user?.email ? `Hi there! 👋` : 'Welcome!'}
            </p>
          </div>
          <Sparkles className="text-[#F8D14A] w-6 h-6 animate-pulse" />
          
          {/* Settings */}
          <button
            onClick={() => navigate('/settings')}
            className="p-2 bg-white border-3 border-gray-300 rounded-xl hover:border-[#4A9FD4] transition-all"
          >
            <Settings size={20} className="text-gray-600" />
          </button>
          
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 bg-white border-3 border-gray-300 rounded-xl hover:border-red-400 transition-all"
          >
            <LogOut size={20} className="text-gray-600" />
          </button>
        </div>
      </header>

      {/* Push Notification Prompt */}
      <PushNotificationPrompt />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        
        {/* Upcoming Activities Widget */}
        <UpcomingActivities 
          activities={upcomingActivities} 
          onViewAll={() => navigate('/visual-schedule')}
        />

        {/* Featured Apps - Visual Schedule & Point to Talk */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {featuredApps.map((app) => {
            const IconComponent = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => navigate(app.path)}
                className="relative p-5 rounded-2xl border-4 text-center transition-all duration-200 
                         shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: app.color,
                  borderColor: app.color,
                }}
              >
                {/* Decorative star */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#F8D14A] rounded-full 
                              flex items-center justify-center border-2 border-white shadow-md">
                  <span className="text-sm">⭐</span>
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-white/30 flex items-center justify-center mb-3 mx-auto">
                  <span className="text-4xl">{app.emoji}</span>
                </div>
                
                {/* Name */}
                <h3 className="font-display text-white text-lg leading-tight drop-shadow-md">
                  {app.name}
                </h3>
                
                {/* Description */}
                <p className="font-crayon text-xs text-white/90 mt-1">
                  {app.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Section Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 flex-1 bg-gradient-to-r from-transparent to-gray-200 rounded"></div>
          <span className="font-crayon text-gray-400 text-sm">More Apps</span>
          <div className="h-1 flex-1 bg-gradient-to-l from-transparent to-gray-200 rounded"></div>
        </div>

        {/* Other Apps Grid (Alphabetized) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {appCategories.map((app, index) => (
            <button
              key={app.id}
              onClick={() => navigate(app.path)}
              className="relative p-4 rounded-2xl border-4 text-center transition-all duration-200 
                       shadow-crayon hover:scale-105 hover:-rotate-1 active:scale-95"
              style={{
                backgroundColor: app.color + '20',
                borderColor: app.color,
                borderRadius: index % 2 === 0 ? '20px 8px 20px 8px' : '8px 20px 8px 20px',
              }}
            >
              {/* Icon container */}
              <div 
                className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center mb-2 mx-auto"
                style={{ border: `2px solid ${app.color}` }}
              >
                <span className="text-3xl">{app.emoji}</span>
              </div>
              
              {/* Name */}
              <h3 className="font-display text-gray-800 text-sm leading-tight">
                {app.name}
              </h3>
              
              {/* Description */}
              <p className="font-crayon text-xs text-gray-500 mt-1">
                {app.description}
              </p>
            </button>
          ))}
        </div>

        {/* App Version */}
        <div className="mt-8 text-center">
          <p className="text-xs font-crayon text-gray-400">
            ATLASassist v2.1 {isInstalled ? '📱' : '🌐'}
          </p>
        </div>
      </main>
    </div>
  );
};

export default AppHub;
