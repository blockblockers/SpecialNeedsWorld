// AppHub.jsx - Main navigation hub for ATLASassist
// UPDATED: Added Info button and AppGuide for new user onboarding
// FIXED: Single icon (emoji only, no duplicate Lucide icon)
// FIXED: Daily Tools uses darker color (#B8860B instead of #F8D14A)

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut,
  Star,
  Sparkles,
  Cloud,
  Settings,
  Info,
  HelpCircle,
} from 'lucide-react';
import { useIsAppInstalled } from '../components/PWAInstallPrompt';
import PushNotificationPrompt from '../components/PushNotificationPrompt';
import AppGuide from './AppGuide';
import { useAuth } from '../App';
import { supabase, isSupabaseConfigured } from '../services/supabase';

// App categories - FIXED: Removed icon property, only emoji is rendered
const appCategories = [
  {
    id: 'visual-schedule',
    name: 'Visual Schedule',
    description: 'Plan your day with pictures!',
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
    color: 'bg-[#F5A623]',
    borderColor: 'border-orange-600',
    hoverRotate: 'hover:-rotate-2',
    path: '/point-to-talk',
    emoji: '💬',
  },
  {
    // FIXED: Using darker gold instead of light yellow
    id: 'tools',
    name: 'Daily Tools',
    description: 'Helpful everyday tools!',
    color: 'bg-[#B8860B]',
    borderColor: 'border-yellow-700',
    hoverRotate: 'hover:rotate-1',
    path: '/tools',
    emoji: '🔧',
  },
  {
    id: 'wellness',
    name: 'Emotional Wellness',
    description: 'Tools to understand feelings',
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
    color: 'bg-[#8E6BBF]',
    borderColor: 'border-purple-700',
    hoverRotate: 'hover:-rotate-1',
    path: '/resources',
    emoji: '📚',
  },
  {
    id: 'community',
    name: 'Community',
    description: 'Connect with others!',
    color: 'bg-[#4A9FD4]',
    borderColor: 'border-blue-700',
    hoverRotate: 'hover:rotate-1',
    path: '/community',
    emoji: '🤝',
  },
];

const AppHub = () => {
  const navigate = useNavigate();
  const { user, signOut, isGuest } = useAuth();
  const isInstalled = useIsAppInstalled();
  
  // Guide state
  const [showGuide, setShowGuide] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  
  // Check if user is new (first time seeing the guide)
  useEffect(() => {
    const checkFirstTimeUser = async () => {
      // Check localStorage first for quick response
      const guideSeen = localStorage.getItem('snw_guide_seen');
      
      if (guideSeen === 'true') {
        // User has seen the guide before
        return;
      }
      
      // For logged-in users, also check Supabase for cross-device sync
      if (user && !isGuest && isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('preferences')
            .eq('id', user.id)
            .maybeSingle();
          
          if (!error && data?.preferences?.guide_seen) {
            // User has seen guide on another device
            localStorage.setItem('snw_guide_seen', 'true');
            return;
          }
        } catch (e) {
          console.error('Error checking guide status:', e);
        }
      }
      
      // User is new - show the guide!
      setIsFirstTimeUser(true);
      setShowGuide(true);
    };
    
    // Small delay to let the page render first
    const timer = setTimeout(checkFirstTimeUser, 500);
    return () => clearTimeout(timer);
  }, [user, isGuest]);
  
  // Save guide seen status
  const handleGuideClose = async () => {
    setShowGuide(false);
    localStorage.setItem('snw_guide_seen', 'true');
    
    // Also save to Supabase for cross-device sync
    if (user && !isGuest && isSupabaseConfigured()) {
      try {
        // Get current preferences
        const { data } = await supabase
          .from('profiles')
          .select('preferences')
          .eq('id', user.id)
          .maybeSingle();
        
        const currentPrefs = data?.preferences || {};
        
        // Update with guide_seen
        await supabase
          .from('profiles')
          .update({
            preferences: {
              ...currentPrefs,
              guide_seen: true,
              guide_seen_at: new Date().toISOString(),
            }
          })
          .eq('id', user.id);
      } catch (e) {
        console.error('Error saving guide status:', e);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleAppClick = (path) => {
    navigate(path);
  };

  // Get display name
  const displayName = user?.displayName || 
                     localStorage.getItem('snw_display_name') || 
                     'Friend';

  return (
    <div className="min-h-screen bg-[#FFFEF5] flex flex-col">
      {/* Fun background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF] shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo and Welcome */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpeg" 
              alt="ATLASassist" 
              className="w-12 h-12 rounded-xl shadow-crayon border-2 border-[#8E6BBF]"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-display text-[#8E6BBF] crayon-text">
                Hi, {displayName}! 👋
              </h1>
              <p className="text-gray-600 font-crayon text-sm">
                What would you like to do today?
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Info/Help Button - NEW */}
            <button
              onClick={() => setShowGuide(true)}
              className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#4A9FD4] 
                         rounded-xl font-display font-bold text-[#4A9FD4] hover:bg-[#4A9FD4] 
                         hover:text-white transition-all shadow-sm hover:shadow-crayon"
              title="App Guide & Help"
            >
              <HelpCircle size={18} />
              <span className="hidden sm:inline">Guide</span>
            </button>
            
            {/* Settings Button */}
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#8E6BBF] 
                         rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                         hover:text-white transition-all shadow-sm hover:shadow-crayon"
            >
              <Settings size={18} />
              <span className="hidden sm:inline">Settings</span>
            </button>
            
            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-gray-300 
                         rounded-full font-crayon text-gray-600 hover:border-crayon-red 
                         hover:text-crayon-red transition-all shadow-sm hover:shadow-crayon"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Push Notification Prompt */}
      <PushNotificationPrompt />

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
          
          {/* First-time user hint */}
          {!localStorage.getItem('snw_guide_seen') && (
            <div className="max-w-md mx-auto mb-4">
              <button
                onClick={() => setShowGuide(true)}
                className="w-full p-3 bg-gradient-to-r from-[#8E6BBF] to-[#4A9FD4] rounded-xl 
                           text-white font-crayon text-sm flex items-center justify-center gap-2
                           hover:opacity-90 transition-opacity shadow-lg animate-pulse"
              >
                <Sparkles size={18} />
                New here? Tap to learn about all our features!
                <Sparkles size={18} />
              </button>
            </div>
          )}
          
          {/* App Grid - FIXED: Only emoji shown, no duplicate Icon */}
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
                  borderRadius: '20px 8px 20px 8px',
                }}
              >
                {/* Emoji Icon - larger and centered */}
                <span className="text-4xl sm:text-5xl drop-shadow-md">
                  {app.emoji}
                </span>
                
                {/* App Name */}
                <span className="font-display text-sm sm:text-base text-center leading-tight">
                  {app.name}
                </span>
                
                {/* Description - hidden on small screens */}
                <span className="hidden sm:block text-xs font-crayon text-white/80 text-center">
                  {app.description}
                </span>
                
                {/* Sparkle decoration */}
                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Star size={16} className="text-white fill-white" />
                </div>
              </button>
            ))}
          </div>
          
          {/* Footer info */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 font-crayon text-xs">
              Made with 💜 for Finn and people like him
            </p>
            {isInstalled && (
              <p className="text-green-600 font-crayon text-xs mt-1 flex items-center justify-center gap-1">
                <Cloud size={12} />
                App installed - works offline!
              </p>
            )}
            {isGuest && (
              <p className="text-orange-500 font-crayon text-xs mt-1">
                Guest mode - data saved locally only
              </p>
            )}
          </div>
        </div>
      </main>
      
      {/* App Guide Modal */}
      <AppGuide 
        isOpen={showGuide} 
        onClose={handleGuideClose}
        isFirstTime={isFirstTimeUser}
      />
    </div>
  );
};

export default AppHub;
