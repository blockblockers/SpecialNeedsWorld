import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import EntryAuthScreen from './pages/EntryAuthScreen';
import AppHub from './pages/AppHub';
import VisualSchedule from './pages/VisualSchedule';
import Tools from './pages/Tools';
import PointToTalk from './pages/PointToTalk';
import Health from './pages/Health';
import Nutrition from './pages/Nutrition';
import Settings from './pages/Settings';
import Activities from './pages/Activities';
import SocialStories from './pages/SocialStories';
import ColoringBook from './pages/ColoringBook';
import PronunciationPractice from './pages/PronunciationPractice';
import Knowledge from './pages/Knowledge';
import Games from './pages/Games';
import MatchingGame from './pages/MatchingGame';
import EmotionMatch from './pages/EmotionMatch';
import BubblePop from './pages/BubblePop';
import ColorSort from './pages/ColorSort';
import ShapeMatch from './pages/ShapeMatch';
import SimplePuzzles from './pages/SimplePuzzles';
import PatternSequence from './pages/PatternSequence';
import Services from './pages/Services';
import AppointmentTracker from './pages/AppointmentTracker';
import GoalTracker from './pages/GoalTracker';
import MyTeam from './pages/MyTeam';
import QuickNotes from './pages/QuickNotes';
import MilestoneGuide from './pages/MilestoneGuide';
import VisualTimer from './pages/VisualTimer';
import FirstThen from './pages/FirstThen';
import CalmDown from './pages/CalmDown';
import Reminders from './pages/Reminders';
import FeelingsTracker from './pages/FeelingsTracker';
import WaterTracker from './pages/WaterTracker';
import SleepTracker from './pages/SleepTracker';
import SoundBoard from './pages/SoundBoard';
import Counter from './pages/Counter';
import DailyRoutines from './pages/DailyRoutines';
import MoveExercise from './pages/MoveExercise';
import OTExercises from './pages/OTExercises';
import HealthyChoices from './pages/HealthyChoices';
import Community from './pages/Community';
import CommunityProfileSetup from './pages/CommunityProfileSetup';
import CommunityNewThread from './pages/CommunityNewThread';
import CommunityThread from './pages/CommunityThread';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { supabase, isSupabaseConfigured } from './services/supabase';

// Create Auth Context for managing authentication state
export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('checking'); // checking, supabase, local

  useEffect(() => {
    // Determine auth mode and initialize
    const initAuth = async () => {
      if (isSupabaseConfigured()) {
        // Supabase mode - use real authentication
        setAuthMode('supabase');
        
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(formatSupabaseUser(session.user));
        }
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth event:', event);
            
            if (session?.user) {
              setUser(formatSupabaseUser(session.user));
            } else {
              setUser(null);
            }
            
            // Handle specific events
            if (event === 'SIGNED_OUT') {
              setUser(null);
              localStorage.removeItem('snw_user');
            }
          }
        );
        
        setLoading(false);
        
        // Cleanup subscription on unmount
        return () => {
          subscription?.unsubscribe();
        };
      } else {
        // Local mode - use localStorage (guest mode only)
        setAuthMode('local');
        
        const storedUser = localStorage.getItem('snw_user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            localStorage.removeItem('snw_user');
          }
        }
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Format Supabase user to our app's user format
  const formatSupabaseUser = (supabaseUser) => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      displayName: supabaseUser.user_metadata?.full_name || 
                   supabaseUser.user_metadata?.name ||
                   supabaseUser.email?.split('@')[0] || 
                   'User',
      avatarUrl: supabaseUser.user_metadata?.avatar_url || 
                 supabaseUser.user_metadata?.picture,
      isGuest: false,
      provider: supabaseUser.app_metadata?.provider || 'email',
    };
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured()) {
      return { error: { message: 'Supabase not configured. Please set up environment variables.' } };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/hub`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { error: { message: error.message || 'Failed to sign in with Google' } };
    }
  };

  // Sign in with email/password
  const signIn = async (email, password) => {
    if (!isSupabaseConfigured()) {
      return { error: { message: 'Supabase not configured. Use guest mode for now.' } };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sign-in error:', error);
      
      // Provide user-friendly error messages
      let message = error.message;
      if (message.includes('Invalid login credentials')) {
        message = 'Incorrect email or password. Please try again.';
      } else if (message.includes('Email not confirmed')) {
        message = 'Please check your email and click the confirmation link.';
      }
      
      return { error: { message } };
    }
  };

  // Sign up with email/password
  const signUp = async (email, password, displayName) => {
    if (!isSupabaseConfigured()) {
      return { error: { message: 'Supabase not configured. Use guest mode for now.' } };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
          },
          emailRedirectTo: `${window.location.origin}/hub`,
        },
      });

      if (error) throw error;

      // Check if email confirmation is required
      if (data?.user && !data?.session) {
        return { 
          data, 
          error: null,
          message: 'Please check your email to confirm your account!',
          requiresConfirmation: true,
        };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Sign-up error:', error);
      
      let message = error.message;
      if (message.includes('already registered')) {
        message = 'This email is already registered. Try signing in instead.';
      }
      
      return { error: { message } };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    if (!isSupabaseConfigured()) {
      return { error: { message: 'Supabase not configured.' } };
    }

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      return { error: { message: error.message } };
    }
  };

  // Guest mode login (works without Supabase)
  const signInAsGuest = () => {
    const guestUser = {
      id: 'guest-' + Date.now(),
      displayName: 'Guest User',
      email: null,
      isGuest: true,
    };
    setUser(guestUser);
    localStorage.setItem('snw_user', JSON.stringify(guestUser));
    return { data: guestUser, error: null };
  };

  // Sign out
  const signOut = async () => {
    if (isSupabaseConfigured() && !user?.isGuest) {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error('Sign-out error:', error);
      }
    }
    
    setUser(null);
    localStorage.removeItem('snw_user');
  };

  const value = {
    user,
    loading,
    authMode,
    signIn,
    signUp,
    signInWithGoogle,
    signInAsGuest,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
    isSupabaseConfigured: isSupabaseConfigured(),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center">
        <div className="text-center">
          <img 
            src="/logo.jpeg" 
            alt="Special Needs World" 
            className="w-20 h-20 rounded-2xl shadow-crayon mx-auto mb-4 animate-bounce-soft"
          />
          <div className="text-2xl font-display text-[#4A9FD4]">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Entry/Auth Screen */}
          <Route path="/" element={<EntryAuthScreen />} />
          
          {/* Main App Hub - Protected */}
          <Route 
            path="/hub" 
            element={
              <ProtectedRoute>
                <AppHub />
              </ProtectedRoute>
            } 
          />
          
          {/* Visual Schedule - Protected */}
          <Route 
            path="/visual-schedule" 
            element={
              <ProtectedRoute>
                <VisualSchedule />
              </ProtectedRoute>
            } 
          />
          
          {/* Tools and Point to Talk */}
          <Route 
            path="/point-to-talk" 
            element={
              <ProtectedRoute>
                <PointToTalk />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tools" 
            element={
              <ProtectedRoute>
                <Tools />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tools/point-to-talk" 
            element={
              <ProtectedRoute>
                <PointToTalk />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tools/milestones" 
            element={
              <ProtectedRoute>
                <MilestoneGuide />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tools/timer" 
            element={
              <ProtectedRoute>
                <VisualTimer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tools/first-then" 
            element={
              <ProtectedRoute>
                <FirstThen />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tools/calm-down" 
            element={
              <ProtectedRoute>
                <CalmDown />
              </ProtectedRoute>
            } 
          />
          
          {/* Services & Trackers */}
          <Route 
            path="/services" 
            element={
              <ProtectedRoute>
                <Services />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/services/appointments" 
            element={
              <ProtectedRoute>
                <AppointmentTracker />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/services/goals" 
            element={
              <ProtectedRoute>
                <GoalTracker />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/services/team" 
            element={
              <ProtectedRoute>
                <MyTeam />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/services/notes" 
            element={
              <ProtectedRoute>
                <QuickNotes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/services/reminders" 
            element={
              <ProtectedRoute>
                <Reminders />
              </ProtectedRoute>
            } 
          />
          
          {/* Health & Nutrition */}
          <Route 
            path="/health" 
            element={
              <ProtectedRoute>
                <Health />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/health/nutrition" 
            element={
              <ProtectedRoute>
                <Nutrition />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/health/feelings" 
            element={
              <ProtectedRoute>
                <FeelingsTracker />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/health/water" 
            element={
              <ProtectedRoute>
                <WaterTracker />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/health/sleep" 
            element={
              <ProtectedRoute>
                <SleepTracker />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/health/exercise" 
            element={
              <ProtectedRoute>
                <MoveExercise />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/health/ot" 
            element={
              <ProtectedRoute>
                <OTExercises />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/health/choices" 
            element={
              <ProtectedRoute>
                <HealthyChoices />
              </ProtectedRoute>
            } 
          />
          
          {/* New Tool Routes */}
          <Route 
            path="/tools/soundboard" 
            element={
              <ProtectedRoute>
                <SoundBoard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tools/counter" 
            element={
              <ProtectedRoute>
                <Counter />
              </ProtectedRoute>
            } 
          />
          
          {/* New Service Routes */}
          <Route 
            path="/services/routines" 
            element={
              <ProtectedRoute>
                <DailyRoutines />
              </ProtectedRoute>
            } 
          />
          
          {/* Community Routes */}
          <Route 
            path="/community" 
            element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/community/profile/setup" 
            element={
              <ProtectedRoute>
                <CommunityProfileSetup />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/community/new" 
            element={
              <ProtectedRoute>
                <CommunityNewThread />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/community/thread/:threadId" 
            element={
              <ProtectedRoute>
                <CommunityThread />
              </ProtectedRoute>
            } 
          />
          
          {/* Settings */}
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          
          {/* Games Routes */}
          <Route 
            path="/games" 
            element={
              <ProtectedRoute>
                <Games />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/games/matching" 
            element={
              <ProtectedRoute>
                <MatchingGame />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/games/emotions" 
            element={
              <ProtectedRoute>
                <EmotionMatch />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/games/bubbles" 
            element={
              <ProtectedRoute>
                <BubblePop />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/games/sorting" 
            element={
              <ProtectedRoute>
                <ColorSort />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/games/shapes" 
            element={
              <ProtectedRoute>
                <ShapeMatch />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/games/puzzles" 
            element={
              <ProtectedRoute>
                <SimplePuzzles />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/games/pattern" 
            element={
              <ProtectedRoute>
                <PatternSequence />
              </ProtectedRoute>
            } 
          />
          
          {/* Activities Routes */}
          <Route 
            path="/activities" 
            element={
              <ProtectedRoute>
                <Activities />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/activities/social-stories" 
            element={
              <ProtectedRoute>
                <SocialStories />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/activities/coloring" 
            element={
              <ProtectedRoute>
                <ColoringBook />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/activities/pronunciation" 
            element={
              <ProtectedRoute>
                <PronunciationPractice />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/knowledge" 
            element={
              <ProtectedRoute>
                <Knowledge />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/knowledge/:regionId" 
            element={
              <ProtectedRoute>
                <Knowledge />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/knowledge/:regionId/:slug" 
            element={
              <ProtectedRoute>
                <Knowledge />
              </ProtectedRoute>
            } 
          />
          
          {/* Password Reset Route */}
          <Route 
            path="/reset-password" 
            element={<ResetPassword />} 
          />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* PWA Install Prompt - Shows on all pages */}
        <PWAInstallPrompt />
      </Router>
    </AuthProvider>
  );
}

// Coming Soon placeholder component
const ComingSoon = ({ title }) => {
  return (
    <div className="min-h-screen bg-[#FFFEF5] flex flex-col items-center justify-center p-6">
      <img 
        src="/logo.jpeg" 
        alt="Special Needs World" 
        className="w-24 h-24 rounded-2xl shadow-crayon mb-6"
      />
      <h1 className="text-4xl font-display text-crayon-purple mb-4 crayon-text">
        {title}
      </h1>
      <p className="text-xl font-crayon text-gray-600 mb-8">
        Coming Soon! 🎨
      </p>
      <a 
        href="/hub" 
        className="crayon-button bg-crayon-blue text-white"
      >
        ← Back to Hub
      </a>
    </div>
  );
};

// Password Reset component
const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      setMessage('Password updated successfully! Redirecting...');
      setTimeout(() => {
        window.location.href = '/hub';
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5] flex flex-col items-center justify-center p-6">
      <img 
        src="/logo.jpeg" 
        alt="Special Needs World" 
        className="w-24 h-24 rounded-2xl shadow-crayon mb-6"
      />
      <h1 className="text-3xl font-display text-[#4A9FD4] mb-6 crayon-text">
        Reset Password
      </h1>
      
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-crayon border-4 border-[#4A9FD4]">
        {message && (
          <div className="mb-4 p-3 bg-green-100 border-2 border-green-500 rounded-xl text-green-700 font-crayon">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 rounded-xl text-red-700 font-crayon">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className="w-full px-4 py-3 border-3 border-gray-300 rounded-xl font-crayon
                     focus:border-[#4A9FD4] focus:outline-none"
            required
            minLength={6}
          />
          
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full px-4 py-3 border-3 border-gray-300 rounded-xl font-crayon
                     focus:border-[#4A9FD4] focus:outline-none"
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#5CB85C] text-white rounded-xl font-crayon text-lg
                     hover:bg-green-600 transition-all disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
