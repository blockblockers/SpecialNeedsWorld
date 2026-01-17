// AppHub.jsx - Updated Main navigation hub for ATLASassist v2.0
// Reorganized with new hubs: Emotional Wellness, Planning & Documents, expanded Resources
// v3: Removed "NEW" badges, restored Finn footer
// v4: FIXED - My Care Team now correctly points to /services

import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MessageCircle, 
  Wrench, 
  Heart, 
  Gamepad2, 
  Palette, 
  BookOpen,
  Users,
  LogOut,
  Star,
  Sparkles,
  Cloud,
  Smartphone,
  Settings,
  HeartHandshake,
  FileText,
  FolderOpen,
  Library
} from 'lucide-react';
import { useIsAppInstalled } from '../components/PWAInstallPrompt';
import PushNotificationPrompt from '../components/PushNotificationPrompt';
import { useAuth } from '../App';

// ============================================
// REORGANIZED APP CATEGORIES - v2.0
// ============================================
const appCategories = [
  {
    id: 'visual-schedule',
    name: 'Visual Schedule',
    description: 'Plan your day with pictures!',
    icon: Calendar,
    color: 'bg-[#E63B2E]',
    borderColor: 'border-red-700',
    hoverRotate: 'hover:rotate-2',
    path: '/visual-schedule',
    emoji: '📅',
  },
  {
    id: 'point-to-talk',
    name: 'Point to Talk',
    description: 'Say what you need!',
    icon: MessageCircle,
    color: 'bg-[#F5A623]',
    borderColor: 'border-orange-600',
    hoverRotate: 'hover:-rotate-2',
    path: '/point-to-talk',
    emoji: '💬',
  },
  {
    id: 'tools',
    name: 'Daily Tools',
    description: 'Helpful everyday tools!',
    icon: Wrench,
    color: 'bg-[#F8D14A]',
    borderColor: 'border-yellow-600',
    hoverRotate: 'hover:rotate-1',
    path: '/tools',
    emoji: '🔧',
  },
  {
    id: 'wellness',
    name: 'Emotional Wellness',
    description: 'Tools to understand feelings',
    icon: HeartHandshake,
    color: 'bg-[#20B2AA]',
    borderColor: 'border-teal-600',
    hoverRotate: 'hover:-rotate-1',
    path: '/wellness',
    emoji: '💚',
  },
  {
    id: 'care-team',
    name: 'My Care Team',
    description: 'Your support network!',
    icon: Users,
    color: 'bg-[#008B8B]',
    borderColor: 'border-teal-700',
    hoverRotate: 'hover:rotate-1',
    path: '/services', // FIXED: Was /care-team, now correctly points to /services
    emoji: '👥',
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    description: 'Track your body & health!',
    icon: Heart,
    color: 'bg-[#E86B9A]',
    borderColor: 'border-pink-600',
    hoverRotate: 'hover:-rotate-1',
    path: '/health',
    emoji: '❤️',
  },
  {
    id: 'games',
    name: 'Games',
    description: 'Fun games to play!',
    icon: Gamepad2,
    color: 'bg-[#5CB85C]',
    borderColor: 'border-green-600',
    hoverRotate: 'hover:rotate-2',
    path: '/games',
    emoji: '🎮',
  },
  {
    id: 'activities',
    name: 'Activities & Learning',
    description: 'Create, learn & explore!',
    icon: Palette,
    color: 'bg-[#4A9FD4]',
    borderColor: 'border-blue-600',
    hoverRotate: 'hover:-rotate-2',
    path: '/activities',
    emoji: '🎨',
  },
  {
    id: 'planning',
    name: 'Planning & Documents',
    description: 'Important info & documents',
    icon: FileText,
    color: 'bg-[#8E6BBF]',
    borderColor: 'border-purple-600',
    hoverRotate: 'hover:rotate-1',
    path: '/planning',
    emoji: '📋',
  },
  {
    id: 'resources',
    name: 'Resources & Research',
    description: 'Helpful information & tools',
    icon: Library,
    color: 'bg-[#9370DB]',
    borderColor: 'border-purple-500',
    hoverRotate: 'hover:-rotate-1',
    path: '/resources',
    emoji: '📚',
  },
];

const AppHub = () => {
  const navigate = useNavigate();
  const isInstalled = useIsAppInstalled();
  const { user, signOut } = useAuth();

  const handleAppClick = (path) => {
    navigate(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5] flex flex-col">
      {/* Hand-drawn style background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-4 left-4 text-6xl transform -rotate-12">✨</div>
        <div className="absolute top-20 right-8 text-4xl transform rotate-12">🌟</div>
        <div className="absolute bottom-40 left-8 text-5xl transform rotate-6">🎨</div>
        <div className="absolute bottom-20 right-4 text-4xl transform -rotate-6">⭐</div>
      </div>
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF] shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo and greeting */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpeg" 
              alt="ATLASassist" 
              className="w-12 h-12 rounded-xl shadow-crayon border-2 border-[#8E6BBF]"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-display text-[#8E6BBF]">
                Hello{user?.email ? `, ${user.email.split('@')[0]}` : ''}! 
                👋
              </h1>
              <p className="text-gray-600 font-crayon text-sm">
                What would you like to do today?
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Settings Button */}
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 px-4 py-2 bg-white border-3 border-[#8E6BBF] 
                         rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                         hover:text-white transition-all shadow-sm hover:shadow-crayon"
            >
              <Settings size={18} />
              <span className="hidden sm:inline">Settings</span>
            </button>
            
            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-white border-3 border-gray-300 
                         rounded-full font-crayon text-gray-600 hover:border-crayon-red 
                         hover:text-crayon-red transition-all shadow-sm hover:shadow-crayon"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - App Grid */}
      <main className="relative z-10 px-4 pb-8 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Title and Tagline */}
          <div className="text-center mb-6 mt-4">
            <h2 className="font-display mb-1">
              <span className="text-2xl sm:text-3xl rainbow-text crayon-text">ATLAS</span>
              <span className="text-xl sm:text-2xl text-[#4A9FD4] crayon-text">assist</span>
            </h2>
            <p className="text-gray-600 font-crayon text-sm sm:text-base max-w-md mx-auto">
              Assistive Tools for Learning, Access &amp; Support
            </p>
            <p className="text-[#8E6BBF] font-crayon text-xs sm:text-sm mt-1">
              Tools for individuals with neurodiverse abilities
            </p>
          </div>
          
          {/* App Grid - Responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {appCategories.map((app) => (
              <button
                key={app.id}
                onClick={() => handleAppClick(app.path)}
                className={`relative group ${app.color} ${app.borderColor} border-4 rounded-2xl p-4 sm:p-5
                           shadow-crayon hover:shadow-crayon-lg transition-all duration-200 
                           ${app.hoverRotate} hover:scale-105 active:scale-95
                           flex flex-col items-center gap-2 text-white`}
                style={{
                  borderRadius: app.id === 'visual-schedule' ? '1.5rem 1rem 1rem 1rem' :
                               app.id === 'point-to-talk' ? '1rem 1.5rem 1rem 1rem' :
                               app.id === 'tools' ? '1rem 1rem 1.5rem 1rem' :
                               '1rem 1rem 1rem 1.5rem',
                }}
              >
                {/* Emoji */}
                <span className="text-3xl sm:text-4xl">{app.emoji}</span>
                
                {/* Icon */}
                <app.icon size={24} className="opacity-90" />
                
                {/* Name */}
                <h3 className="font-display text-center text-sm sm:text-base leading-tight">
                  {app.name}
                </h3>
                
                {/* Description - Hidden on mobile */}
                <p className="hidden sm:block font-crayon text-xs text-white/80 text-center">
                  {app.description}
                </p>
              </button>
            ))}
          </div>
          
          {/* Cloud Sync Status */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border-2 border-[#5CB85C] shadow-sm">
              <Cloud size={16} className="text-[#5CB85C]" />
              <span className="font-crayon text-sm text-[#5CB85C]">
                {user ? 'Cloud sync enabled' : 'Sign in for cloud sync'}
              </span>
            </div>
          </div>
          
          {/* Push Notification Prompt */}
          <PushNotificationPrompt />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t-4 border-[#8E6BBF] bg-white/50 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
            <p className="font-crayon text-gray-600 text-sm flex items-center gap-2">
              Made with <Heart size={16} className="text-crayon-red fill-crayon-red" /> for Finn
            </p>
            <span className="hidden sm:inline text-gray-400">•</span>
            <p className="font-crayon text-[#8E6BBF] text-sm flex items-center gap-1">
              <Star size={14} className="text-[#F8D14A] fill-[#F8D14A]" />
              You are amazing just the way you are!
              <Star size={14} className="text-[#F8D14A] fill-[#F8D14A]" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppHub;
