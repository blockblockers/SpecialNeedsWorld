// AppHub.jsx - Main navigation hub for ATLASassist v2.1
// FIXED: Community is included
// FIXED: Care Team path is /services
// v3: Removed "NEW" badges, restored Finn footer

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
  Library,
  MessageSquare
} from 'lucide-react';
import { useIsAppInstalled } from '../components/PWAInstallPrompt';
import PushNotificationPrompt from '../components/PushNotificationPrompt';
import { useAuth } from '../App';

// ============================================
// APP CATEGORIES - All apps with correct paths
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
    path: '/services', // FIXED: was /care-team
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
    description: 'Important documents & planning',
    icon: FileText,
    color: 'bg-[#CD853F]',
    borderColor: 'border-amber-700',
    hoverRotate: 'hover:rotate-1',
    path: '/planning',
    emoji: '📋',
  },
  {
    id: 'resources',
    name: 'Resources & Research',
    description: 'Laws, research & printables!',
    icon: Library,
    color: 'bg-[#8E6BBF]',
    borderColor: 'border-purple-600',
    hoverRotate: 'hover:-rotate-1',
    path: '/resources',
    emoji: '📚',
  },
  // COMMUNITY IS INCLUDED
  {
    id: 'community',
    name: 'Community',
    description: 'Connect with others!',
    icon: MessageSquare,
    color: 'bg-[#FF7F7F]',
    borderColor: 'border-red-400',
    hoverRotate: 'hover:rotate-1',
    path: '/community',
    emoji: '💬',
  },
];

// Floating decoration component
const FloatingDecoration = ({ Icon, className, delay = '0s', fill = false }) => (
  <Icon 
    className={`absolute animate-bounce-soft ${className}`}
    style={{ animationDelay: delay }}
    fill={fill ? 'currentColor' : 'none'}
  />
);

const AppHub = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isAppInstalled = useIsAppInstalled();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleAppClick = (path) => {
    navigate(path);
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Friend';

  return (
    <div className="min-h-screen bg-[#FFFEF5] flex flex-col">
      {/* Floating decorations */}
      <FloatingDecoration Icon={Star} className="text-crayon-yellow w-5 h-5 top-20 left-4 opacity-60" delay="0s" fill />
      <FloatingDecoration Icon={Sparkles} className="text-crayon-purple w-4 h-4 top-32 right-6 opacity-50" delay="0.5s" />
      <FloatingDecoration Icon={Cloud} className="text-crayon-blue w-6 h-6 top-48 left-8 opacity-40" delay="1s" />
      <FloatingDecoration Icon={Star} className="text-crayon-green w-4 h-4 bottom-32 right-4 opacity-50" delay="1.5s" fill />

      {/* PWA Install Prompt */}
      {!isAppInstalled && (
        <div className="bg-gradient-to-r from-[#8E6BBF] to-[#4A9FD4] text-white px-4 py-2">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
            <Smartphone size={16} />
            <span className="font-crayon text-sm">
              Install ATLASassist for the best experience!
            </span>
          </div>
        </div>
      )}

      {/* Push Notification Prompt */}
      <PushNotificationPrompt />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#87CEEB] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Logo and Greeting */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpeg" 
              alt="ATLASassist" 
              className="w-12 h-12 rounded-xl shadow-crayon border-2 border-white"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-display text-gray-800">
                Hi, {displayName}! 👋
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
              >
                {/* Emoji */}
                <span className="text-3xl sm:text-4xl">{app.emoji}</span>
                
                {/* Icon */}
                <app.icon size={28} strokeWidth={2.5} />
                
                {/* Name */}
                <h3 className="font-display text-base sm:text-lg text-center crayon-text leading-tight">
                  {app.name}
                </h3>
                
                {/* Description - hidden on small screens */}
                <p className="hidden sm:block font-crayon text-xs text-center opacity-90">
                  {app.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-[#FFFEF5] border-t-4 border-dashed border-[#F5A623] px-4 py-4 mt-auto">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#8E6BBF] font-crayon text-sm italic">
            For Finn, and for people like him. 💜
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppHub;
