// AppHub.jsx - Main application dashboard
// FIXED: Correct localStorage key for Visual Schedule integration
// Uses 'visual_schedule_items' to fetch upcoming activities

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Heart, Gamepad2, BookOpen, Wrench, 
  Users, Clock, ChevronRight, Sparkles, Sun, Moon, Cloud,
  MessageSquare, Mic
} from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

// Hub categories with consistent colors
const hubs = [
  {
    id: 'schedule',
    name: 'Visual Schedule',
    description: 'Daily routines & tasks',
    icon: Calendar,
    color: '#E63B2E',
    path: '/schedule',
  },
  {
    id: 'wellness',
    name: 'Emotional Wellness',
    description: 'Feelings & coping tools',
    icon: Heart,
    color: '#E86B9A',
    path: '/wellness',
  },
  {
    id: 'activities',
    name: 'Activities',
    description: 'Games & learning fun',
    icon: Gamepad2,
    color: '#F5A623',
    path: '/activities',
  },
  {
    id: 'communication',
    name: 'Communication',
    description: 'AAC & expression tools',
    icon: MessageSquare,
    color: '#4A9FD4',
    path: '/communication',
  },
  {
    id: 'speech',
    name: 'Speech Therapy',
    description: 'Articulation & language',
    icon: Mic,
    color: '#10B981',
    path: '/speech-therapy',
  },
  {
    id: 'health',
    name: 'Health',
    description: 'Track wellness habits',
    icon: Heart,
    color: '#5CB85C',
    path: '/health',
  },
  {
    id: 'tools',
    name: 'Tools',
    description: 'Helpful utilities',
    icon: Wrench,
    color: '#8E6BBF',
    path: '/tools',
  },
  {
    id: 'community',
    name: 'Community',
    description: 'Connect & share',
    icon: Users,
    color: '#6366F1',
    path: '/community',
  },
  {
    id: 'resources',
    name: 'Resources',
    description: 'Guides & information',
    icon: BookOpen,
    color: '#0891B2',
    path: '/resources',
  },
];

// Get greeting based on time of day
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good Morning', icon: Sun, color: '#F5A623' };
  if (hour < 17) return { text: 'Good Afternoon', icon: Cloud, color: '#4A9FD4' };
  return { text: 'Good Evening', icon: Moon, color: '#8E6BBF' };
};

// Get upcoming activities from Visual Schedule
// FIXED: Uses correct localStorage key 'visual_schedule_items'
const getUpcomingActivities = () => {
  try {
    // Try the correct key first
    let items = JSON.parse(localStorage.getItem('visual_schedule_items') || '[]');
    
    // Fallback to alternate keys if empty
    if (items.length === 0) {
      items = JSON.parse(localStorage.getItem('snw_schedule_items') || '[]');
    }
    if (items.length === 0) {
      items = JSON.parse(localStorage.getItem('schedule_items') || '[]');
    }
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // Filter to items that have a time and are upcoming today
    const upcoming = items
      .filter(item => {
        if (!item.time) return false;
        const [hours, minutes] = item.time.split(':').map(Number);
        const itemTime = hours * 60 + minutes;
        return itemTime > currentTime && !item.completed;
      })
      .sort((a, b) => {
        const [aH, aM] = a.time.split(':').map(Number);
        const [bH, bM] = b.time.split(':').map(Number);
        return (aH * 60 + aM) - (bH * 60 + bM);
      })
      .slice(0, 3);
    
    return upcoming;
  } catch (error) {
    console.error('Error loading schedule:', error);
    return [];
  }
};

const AppHub = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState(getGreeting());
  const [upcomingActivities, setUpcomingActivities] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Update greeting
    setGreeting(getGreeting());
    
    // Load upcoming activities
    setUpcomingActivities(getUpcomingActivities());
    
    // Load user name if saved
    const savedName = localStorage.getItem('snw_user_name') || localStorage.getItem('atlas_user_name');
    if (savedName) setUserName(savedName);
    
    // Refresh activities periodically
    const interval = setInterval(() => {
      setUpcomingActivities(getUpcomingActivities());
      setGreeting(getGreeting());
    }, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);

  const GreetingIcon = greeting.icon;

  return (
    <div className="min-h-screen bg-[#FFFEF5] relative overflow-hidden">
      <AnimatedBackground variant="home" />
      
      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-[#4A9FD4] to-[#6366F1] text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <GreetingIcon className="w-8 h-8" style={{ color: greeting.color }} />
            <h1 className="text-2xl font-display">
              {greeting.text}{userName ? `, ${userName}` : ''}!
            </h1>
          </div>
          <p className="text-white/80 font-crayon">
            Welcome to ATLASassist
          </p>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        {/* Upcoming Activities Widget */}
        {upcomingActivities.length > 0 && (
          <div className="mb-6 bg-white rounded-2xl border-4 border-[#E63B2E] p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-[#E63B2E] flex items-center gap-2">
                <Clock size={20} />
                Coming Up Today
              </h2>
              <button
                onClick={() => navigate('/schedule')}
                className="text-sm text-[#E63B2E] font-crayon flex items-center gap-1 hover:underline"
              >
                View All <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {upcomingActivities.map((activity, index) => (
                <div 
                  key={activity.id || index}
                  className="flex items-center gap-3 p-2 bg-red-50 rounded-xl"
                >
                  <span className="text-2xl">{activity.icon || activity.emoji || '📌'}</span>
                  <div className="flex-1">
                    <p className="font-crayon text-gray-800">{activity.title || activity.name}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hub Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {hubs.map((hub) => {
            const Icon = hub.icon;
            return (
              <button
                key={hub.id}
                onClick={() => navigate(hub.path)}
                className="bg-white rounded-2xl border-4 p-4 shadow-lg hover:scale-105 
                           transition-all duration-200 text-left group"
                style={{ borderColor: hub.color }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 
                             group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${hub.color}20` }}
                >
                  <Icon size={24} style={{ color: hub.color }} />
                </div>
                <h3 
                  className="font-display text-lg mb-1"
                  style={{ color: hub.color }}
                >
                  {hub.name}
                </h3>
                <p className="text-sm text-gray-500 font-crayon">
                  {hub.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate('/schedule')}
            className="flex items-center gap-2 px-4 py-2 bg-[#E63B2E] text-white 
                       rounded-xl font-crayon hover:bg-red-600 transition-colors"
          >
            <Calendar size={18} />
            Today's Schedule
          </button>
          <button
            onClick={() => navigate('/wellness/check-in')}
            className="flex items-center gap-2 px-4 py-2 bg-[#E86B9A] text-white 
                       rounded-xl font-crayon hover:bg-pink-600 transition-colors"
          >
            <Sparkles size={18} />
            How Am I Feeling?
          </button>
        </div>
      </main>
    </div>
  );
};

export default AppHub;
