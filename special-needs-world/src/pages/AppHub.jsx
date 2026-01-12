// AppHub.jsx - Main navigation hub for Special Needs World
// Kid-friendly crayon theme with colorful app buttons

import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MessageCircle, 
  Wrench, 
  Heart, 
  Gamepad2, 
  Palette, 
  BookOpen,
  ClipboardList,
  LogOut,
  Star,
  Sparkles,
  Cloud,
  Smartphone,
  Settings
} from 'lucide-react';
import { useIsAppInstalled } from '../components/PWAInstallPrompt';
import { useAuth } from '../App';

// App category data - colors matched to logo
const appCategories = [
  {
    id: 'visual-schedule',
    name: 'Visual Schedule',
    description: 'Plan your day with pictures!',
    icon: Calendar,
    color: 'bg-[#E63B2E]',  // Red like hand in logo
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
    color: 'bg-[#F5A623]',  // Orange like sun
    borderColor: 'border-orange-600',
    hoverRotate: 'hover:-rotate-2',
    path: '/point-to-talk',
    emoji: '💬',
  },
  {
    id: 'tools',
    name: 'Tools',
    description: 'Helpful everyday tools!',
    icon: Wrench,
    color: 'bg-[#F8D14A]',  // Yellow like sun center
    borderColor: 'border-yellow-500',
    textColor: 'text-gray-800',
    hoverRotate: 'hover:rotate-1',
    path: '/tools',
    emoji: '🔧',
  },
  {
    id: 'services',
    name: 'Services & Trackers',
    description: 'Track appointments & goals!',
    icon: ClipboardList,
    color: 'bg-[#20B2AA]',  // Teal
    borderColor: 'border-teal-600',
    hoverRotate: 'hover:-rotate-1',
    path: '/services',
    emoji: '📋',
  },
  {
    id: 'health',
    name: 'Health',
    description: 'Stay healthy & happy!',
    icon: Heart,
    color: 'bg-[#E86B9A]',  // Pink
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
    color: 'bg-[#5CB85C]',  // Green like land/grass
    borderColor: 'border-green-600',
    hoverRotate: 'hover:rotate-2',
    path: '/games',
    emoji: '🎮',
  },
  {
    id: 'activities',
    name: 'Activities',
    description: 'Things to do & make!',
    icon: Palette,
    color: 'bg-[#4A9FD4]',  // Blue like ocean
    borderColor: 'border-blue-600',
    hoverRotate: 'hover:-rotate-2',
    path: '/activities',
    emoji: '🎨',
  },
  {
    id: 'knowledge',
    name: 'US & State Resources',
    description: 'Laws, rights & services info!',
    icon: BookOpen,
    color: 'bg-[#8E6BBF]',  // Purple
    borderColor: 'border-purple-600',
    hoverRotate: 'hover:rotate-1',
    path: '/knowledge',
    emoji: '📚',
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
  const displayName = user?.displayName || 'Friend';
  const firstName = displayName.split(' ')[0];

  return (
    <div className="min-h-screen bg-[#FFFEF5] relative overflow-hidden">
      {/* Background Decorations - matching logo style */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Sun - top right like in logo */}
        <div className="absolute top-8 right-8 w-16 h-16 sm:w-20 sm:h-20">
          <div className="w-full h-full rounded-full bg-[#F8D14A] animate-pulse" style={{ boxShadow: '0 0 30px #F5A623' }}></div>
          {/* Sun rays */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-1 h-4 bg-[#F5A623] rounded-full"
                style={{ 
                  transform: `rotate(${i * 45}deg) translateY(-140%)`,
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Clouds - light blue like in logo */}
        <FloatingDecoration Icon={Cloud} className="top-12 left-8 text-[#87CEEB] w-12 h-12 opacity-80" delay="0s" fill={true} />
        <FloatingDecoration Icon={Cloud} className="top-24 right-32 text-[#87CEEB] w-10 h-10 opacity-70" delay="0.5s" fill={true} />
        <FloatingDecoration Icon={Cloud} className="top-16 left-1/3 text-[#87CEEB] w-8 h-8 opacity-60" delay="0.3s" fill={true} />
        
        {/* Small decorative elements */}
        <FloatingDecoration Icon={Star} className="bottom-32 right-8 text-[#F8D14A] w-6 h-6 opacity-70" delay="0.8s" fill={true} />
        <FloatingDecoration Icon={Sparkles} className="bottom-40 left-12 text-[#F5A623] w-6 h-6 opacity-60" delay="1s" />
      </div>

      {/* Header */}
      <header className="relative z-10 pt-6 pb-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Logo and Greeting */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="/logo.jpeg" 
                alt="Special Needs World" 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl shadow-crayon"
              />
              {/* Installed indicator */}
              {isAppInstalled && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#5CB85C] rounded-full 
                              flex items-center justify-center border-2 border-white shadow-sm"
                     title="App installed">
                  <Smartphone size={10} className="text-white" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display text-[#4A9FD4] crayon-text">
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
                         rounded-full font-crayon text-[#8E6BBF] hover:bg-[#8E6BBF] 
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
      <main className="relative z-10 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Tagline */}
          <p className="text-center text-gray-600 font-crayon text-sm sm:text-base mb-6 max-w-md mx-auto">
            An ecosystem of helpful applications, tools, and services for the special needs community.
          </p>
          
          {/* App Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {appCategories.map((app, index) => {
              const IconComponent = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={() => handleAppClick(app.path)}
                  className={`
                    ${app.color} ${app.textColor || 'text-white'}
                    p-6 sm:p-8 rounded-3xl
                    border-4 ${app.borderColor}
                    shadow-crayon-lg
                    transform transition-all duration-200
                    hover:-translate-y-2 ${app.hoverRotate}
                    hover:shadow-[8px_8px_0px_rgba(0,0,0,0.3)]
                    active:translate-y-1 active:shadow-crayon-pressed
                    focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-4
                    group
                  `}
                  style={{ 
                    borderRadius: index % 2 === 0 
                      ? '255px 15px 225px 15px/15px 225px 15px 255px'
                      : '15px 255px 15px 225px/225px 15px 255px 15px',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <IconComponent 
                        size={48} 
                        className="transform group-hover:scale-110 transition-transform"
                      />
                      <span className="absolute -top-2 -right-2 text-2xl">
                        {app.emoji}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl font-display mb-2 crayon-text">
                    {app.name}
                  </h2>

                  {/* Description */}
                  <p className={`text-sm sm:text-base font-crayon ${app.textColor ? 'text-gray-700' : 'text-white/90'}`}>
                    {app.description}
                  </p>
                </button>
              );
            })}
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

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 px-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img 
            src="/logo.jpeg" 
            alt="" 
            className="w-6 h-6 rounded-md opacity-70"
          />
          <p className="text-gray-500 font-crayon text-sm">
            Special Needs World
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
