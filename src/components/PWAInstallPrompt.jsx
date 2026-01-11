// PWAInstallPrompt.jsx
// Handles PWA installation prompts across all platforms
// - Chrome/Edge/Android: Uses beforeinstallprompt event
// - iOS Safari: Shows manual instructions
// - Desktop: Shows install button when available
// - Detects if already installed

import { useState, useEffect } from 'react';
import { X, Download, Share, Plus, Smartphone, Monitor, CheckCircle } from 'lucide-react';

// Detect the platform/browser
const getPlatformInfo = () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isAndroid = /android/i.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isChrome = /chrome/i.test(ua) && !/edge/i.test(ua);
  const isEdge = /edg/i.test(ua);
  const isFirefox = /firefox/i.test(ua);
  const isSamsung = /samsungbrowser/i.test(ua);
  
  const isMobile = isIOS || isAndroid;
  const isDesktop = !isMobile;
  
  return {
    isIOS,
    isAndroid,
    isSafari,
    isChrome,
    isEdge,
    isFirefox,
    isSamsung,
    isMobile,
    isDesktop,
    isIOSSafari: isIOS && isSafari,
    supportsInstallPrompt: isChrome || isEdge || isSamsung,
  };
};

// Check if the app is already installed / running as PWA
const checkIfInstalled = () => {
  // Check display-mode
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  
  // Check iOS standalone mode
  if (navigator.standalone === true) {
    return true;
  }
  
  // Check if running in TWA (Trusted Web Activity)
  if (document.referrer.includes('android-app://')) {
    return true;
  }
  
  return false;
};

// iOS Share icon component (the box with arrow)
const IOSShareIcon = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [platform, setPlatform] = useState(null);
  const [justInstalled, setJustInstalled] = useState(false);

  useEffect(() => {
    // Get platform info
    const platformInfo = getPlatformInfo();
    setPlatform(platformInfo);
    
    // Check if already installed
    if (checkIfInstalled()) {
      setIsInstalled(true);
      return;
    }
    
    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('snw_pwa_prompt_dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
    
    // Show again after 7 days
    if (dismissed && daysSinceDismissed < 7) {
      return;
    }
    
    // Listen for the beforeinstallprompt event (Chrome, Edge, Samsung)
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Small delay to not interrupt user immediately
      setTimeout(() => setShowPrompt(true), 2000);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    
    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setJustInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('snw_pwa_prompt_dismissed');
    });
    
    // For iOS Safari, show prompt after a delay
    if (platformInfo.isIOSSafari) {
      setTimeout(() => setShowPrompt(true), 3000);
    }
    
    // Check display mode changes (user might install from browser menu)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e) => {
      if (e.matches) {
        setIsInstalled(true);
        setShowPrompt(false);
      }
    };
    mediaQuery.addEventListener('change', handleDisplayModeChange);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  // Handle install button click (for Chrome/Edge/Android)
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // If no deferred prompt, might be iOS
      if (platform?.isIOSSafari) {
        setShowIOSInstructions(true);
      }
      return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setJustInstalled(true);
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  // Handle dismiss
  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSInstructions(false);
    localStorage.setItem('snw_pwa_prompt_dismissed', Date.now().toString());
  };

  // Don't render if installed or not ready
  if (isInstalled && !justInstalled) {
    return null;
  }

  // Show "Successfully installed" message briefly
  if (justInstalled) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-bounce-soft">
        <div className="max-w-md mx-auto bg-[#5CB85C] text-white rounded-2xl p-4 shadow-lg border-4 border-green-600 flex items-center gap-3">
          <CheckCircle size={32} />
          <div>
            <p className="font-display text-lg">App Installed! 🎉</p>
            <p className="font-crayon text-sm opacity-90">Find it on your home screen</p>
          </div>
        </div>
      </div>
    );
  }

  if (!showPrompt) {
    return null;
  }

  // iOS Instructions Modal
  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
        <div 
          className="bg-[#FFFEF5] w-full max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl
                     border-4 border-[#4A9FD4] animate-slide-up"
        >
          {/* Header */}
          <div className="bg-[#4A9FD4] text-white p-4 flex items-center justify-between">
            <h3 className="font-display text-xl flex items-center gap-2">
              <Smartphone size={24} />
              Install App
            </h3>
            <button 
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Instructions */}
          <div className="p-6">
            <p className="font-crayon text-gray-600 mb-6 text-center">
              Install Special Needs World on your {platform?.isIOS ? 'iPhone/iPad' : 'device'} for the best experience!
            </p>
            
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-4 p-3 bg-[#87CEEB]/20 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-[#4A9FD4] text-white flex items-center justify-center font-display text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-crayon text-gray-800">
                    Tap the <span className="inline-flex items-center mx-1 px-2 py-1 bg-[#4A9FD4] text-white rounded-lg">
                      <IOSShareIcon className="w-4 h-4" />
                    </span> Share button
                  </p>
                  <p className="font-crayon text-sm text-gray-500 mt-1">
                    At the bottom of your Safari browser
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex items-start gap-4 p-3 bg-[#87CEEB]/20 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-[#4A9FD4] text-white flex items-center justify-center font-display text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-crayon text-gray-800">
                    Scroll down and tap
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border-2 border-gray-200">
                    <Plus size={18} className="text-[#4A9FD4]" />
                    <span className="font-crayon text-gray-800">Add to Home Screen</span>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex items-start gap-4 p-3 bg-[#87CEEB]/20 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-[#4A9FD4] text-white flex items-center justify-center font-display text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-crayon text-gray-800">
                    Tap <span className="font-display text-[#4A9FD4]">Add</span> to confirm
                  </p>
                  <p className="font-crayon text-sm text-gray-500 mt-1">
                    The app will appear on your home screen!
                  </p>
                </div>
              </div>
            </div>
            
            {/* Benefits */}
            <div className="mt-6 p-3 bg-[#5CB85C]/10 rounded-xl border-2 border-[#5CB85C]/30">
              <p className="font-crayon text-sm text-gray-600 text-center">
                ✨ Works offline • 🚀 Faster loading • 📱 Full screen experience
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 pb-6">
            <button
              onClick={handleDismiss}
              className="w-full py-3 bg-gray-200 rounded-xl font-crayon text-gray-600 hover:bg-gray-300 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main install prompt banner
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div 
        className="max-w-md mx-auto bg-[#FFFEF5] rounded-2xl shadow-2xl overflow-hidden
                   border-4 border-[#4A9FD4]"
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="p-4 flex items-center gap-4">
          {/* App Icon */}
          <img 
            src="/logo.jpeg" 
            alt="Special Needs World"
            className="w-16 h-16 rounded-2xl shadow-md flex-shrink-0"
          />
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg text-[#4A9FD4] leading-tight">
              Install App
            </h3>
            <p className="font-crayon text-sm text-gray-600 mt-1">
              Add to your {platform?.isMobile ? 'home screen' : 'desktop'} for quick access!
            </p>
            
            {/* Install Button */}
            <button
              onClick={platform?.isIOSSafari ? () => setShowIOSInstructions(true) : handleInstallClick}
              className="mt-3 px-4 py-2 bg-[#5CB85C] text-white rounded-xl font-crayon text-sm
                       hover:bg-green-600 transition-all flex items-center gap-2 shadow-sm
                       active:scale-95"
            >
              {platform?.isIOSSafari ? (
                <>
                  <IOSShareIcon className="w-4 h-4" />
                  How to Install
                </>
              ) : (
                <>
                  <Download size={16} />
                  Install Now
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Benefits bar */}
        <div className="px-4 py-2 bg-[#87CEEB]/20 border-t border-[#87CEEB]/30">
          <p className="font-crayon text-xs text-gray-500 text-center">
            ✨ Works offline • 🚀 Faster • 📱 Full screen
          </p>
        </div>
      </div>
    </div>
  );
};

// Export utility function to check if installed (can be used elsewhere)
export const useIsAppInstalled = () => {
  const [isInstalled, setIsInstalled] = useState(checkIfInstalled());
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e) => setIsInstalled(e.matches || navigator.standalone === true);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return isInstalled;
};

export default PWAInstallPrompt;
