// AppHub.jsx - Updated Main navigation hub for ATLASassist v2.0
// Reorganized with new hubs: Emotional Wellness, Planning & Documents, expanded Resources
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
    path: '/care-team',
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
  {
    id: 'community',
    name: 'Community',
    description: 'Connect with others!',
    icon: Users,
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

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const handleAppClick = (path) => {
    navigate(path);
  };

  // Get display name or default
  const displayName = user?.displayName || user?.user_metadata?.display_name || 'Friend';
  const firstName = displayName.split(' ')[0];

  return (
    <div className="min-h-screen bg-[#FFFEF5] relative overflow-hidden flex flex-col">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Sun - top right */}
        <div className="absolute top-8 right-8 w-16 h-16 sm:w-20 sm:h-20">
          <div className="w-full h-full rounded-full bg-[#F8D14A] animate-pulse" style={{ boxShadow: '0 0 30px #F5A623' }}></div>
          {/* Sun rays */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-6 bg-[#F5A623] origin-center"
                style={{
                  transform: `rotate(${i * 45}deg) translateY(-30px)`,
                  borderRadius: '10px',
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        </div>

        {/* Floating decorations */}
        <FloatingDecoration Icon={Star} className="top-32 left-8 text-[#F8D14A] w-6 h-6" delay="0.5s" fill />
        <FloatingDecoration Icon={Sparkles} className="bottom-40 right-12 text-[#E86B9A] w-8 h-8" delay="1s" />
        <FloatingDecoration Icon={Star} className="top-48 right-1/4 text-[#4A9FD4] w-5 h-5" delay="1.5s" fill />
        <FloatingDecoration Icon={Cloud} className="top-20 left-1/3 text-white w-12 h-12" delay="2s" fill />
        <FloatingDecoration Icon={Star} className="bottom-32 left-16 text-[#5CB85C] w-4 h-4" delay="0.8s" fill />
      </div>

      {/* PWA Install Prompt */}
      {!isAppInstalled && (
        <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
          <PushNotificationPrompt />
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#4A9FD4]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo and Greeting */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpeg" 
              alt="ATLASassist" 
              className="w-12 h-12 rounded-xl shadow-crayon"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-display text-[#4A9FD4] crayon-text">
                Hi, {firstName}! 👋
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
                  borderRadius: '20px 40px 20px 40px / 40px 20px 40px 20px',
                }}
              >
                {/* Icon */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center
                               group-hover:bg-white/30 transition-colors">
                  <span className="text-2xl sm:text-3xl">{app.emoji}</span>
                </div>
                
                {/* Text */}
                <div className="text-center">
                  <h3 className="font-display text-sm sm:text-base leading-tight">
                    {app.name}
                  </h3>
                  <p className="font-crayon text-xs text-white/80 mt-1 hidden sm:block">
                    {app.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Guest Mode Notice */}
          {user?.isGuest && (
            <div 
              className="mt-8 p-4 bg-white border-4 border-dashed border-crayon-orange rounded-2xl text-center"
              style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}
            >
              <p className="font-crayon text-gray-600">
                🌟 <strong>You're exploring as a guest!</strong> Your progress won't be saved.
              </p>
              <button 
                onClick={() => navigate('/')}
                className="mt-2 text-crayon-blue hover:text-crayon-purple font-crayon underline"
              >
                Create an account to save your work
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Push Notification Prompt */}
      <PushNotificationPrompt user={user} />

      {/* Footer - For Finn */}
      <footer className="relative z-10 text-center py-6 px-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img 
            src="/logo.jpeg" 
            alt="" 
            className="w-8 h-8 rounded-md"
          />
          <p className="text-gray-700 font-display text-lg crayon-text">
            ATLASassist
          </p>
        </div>
        <p className="text-crayon-purple font-display text-sm italic">
          For Finn, and for people like him. 💜
        </p>
      </footer>
    </div>
  );
};

export default AppHub;
