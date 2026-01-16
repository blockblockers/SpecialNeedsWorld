// App.jsx - ATLASassist v2.0
// Complete routing with reorganized hub structure
// Updated: January 2025 - All Phase 1 & 2 features enabled

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';

// ============================================
// PAGE IMPORTS - Existing
// ============================================
import EntryAuthScreen from './pages/EntryAuthScreen';
import AppHub from './pages/AppHub';
import VisualSchedule from './pages/VisualSchedule';
import Tools from './pages/Tools';
import PointToTalk from './pages/PointToTalk';
import Health from './pages/Health';
import Nutrition from './pages/Nutrition';
import Settings from './pages/Settings';
import Activities from './pages/Activities';
import SensoryBreaks from './pages/SensoryBreaks';
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
import ChoiceBoard from './pages/ChoiceBoard';
import Community from './pages/Community';
import CommunityProfileSetup from './pages/CommunityProfileSetup';
import CommunityNewThread from './pages/CommunityNewThread';
import CommunityThread from './pages/CommunityThread';

// ============================================
// PAGE IMPORTS - New v2.0 Hubs
// ============================================
import EmotionalWellnessHub from './pages/EmotionalWellnessHub';
import PlanningHub from './pages/PlanningHub';
import ResourcesHub from './pages/ResourcesHub';

// ============================================
// PAGE IMPORTS - New v2.0 Features (Phase 1 & 2)
// ============================================
// Emotional Wellness Features
import EmotionChart from './pages/EmotionChart';
import CopingSkillsChart from './pages/CopingSkillsChart';
import CirclesOfControl from './pages/CirclesOfControl';
import GrowthMindset from './pages/GrowthMindset';

// Planning & Documents Features
import StudentProfile from './pages/StudentProfile';
import FileOfLife from './pages/FileOfLife';
import PersonCenteredPlan from './pages/PersonCenteredPlan';
import MemorandumOfIntent from './pages/MemorandumOfIntent';

// Resources & Research Features
import PrintablesLibrary from './pages/PrintablesLibrary';
import ResearchHub from './pages/ResearchHub';
import RecommendedProducts from './pages/RecommendedProducts';

// ============================================
// COMPONENT IMPORTS
// ============================================
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { ToastProvider } from './components/ThemedToast';
import { supabase, isSupabaseConfigured } from './services/supabase';
import { initNotifications } from './services/notifications';

// ============================================
// AUTH CONTEXT
// ============================================
export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Format Supabase user to app user format
const formatSupabaseUser = (supabaseUser) => {
  if (!supabaseUser) return null;
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    displayName: supabaseUser.user_metadata?.full_name || 
                 supabaseUser.user_metadata?.name || 
                 supabaseUser.email?.split('@')[0] || 
                 'Friend',
    photoURL: supabaseUser.user_metadata?.avatar_url || null,
    provider: supabaseUser.app_metadata?.provider || 'email',
  };
};

// Auth Provider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('checking');

  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured()) {
        setAuthMode('supabase');
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(formatSupabaseUser(session.user));
        }
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session?.user) {
              setUser(formatSupabaseUser(session.user));
              
              if (event === 'SIGNED_IN') {
                setTimeout(() => {
                  initNotifications().catch(console.error);
                }, 2000);
              }
            } else {
              setUser(null);
            }
          }
        );
        
        setLoading(false);
        return () => subscription.unsubscribe();
      } else {
        setAuthMode('guest');
        const savedGuest = localStorage.getItem('snw_guest_user');
        if (savedGuest) {
          try {
            setUser(JSON.parse(savedGuest));
          } catch (e) {
            console.error('Error parsing guest user:', e);
          }
        }
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signInAsGuest = (name = 'Friend') => {
    const guestUser = {
      id: `guest_${Date.now()}`,
      email: null,
      displayName: name,
      photoURL: null,
      provider: 'guest',
    };
    localStorage.setItem('snw_guest_user', JSON.stringify(guestUser));
    setUser(guestUser);
  };

  const signOut = async () => {
    if (authMode === 'supabase') {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('snw_guest_user');
    }
    setUser(null);
  };

  const value = {
    user,
    loading,
    authMode,
    signInAsGuest,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// PROTECTED ROUTE COMPONENT
// ============================================
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A9FD4] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-crayon text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ============================================
// RESET PASSWORD COMPONENT
// ============================================
const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="font-display text-2xl text-[#5CB85C] mb-4">Password Updated!</h1>
          <p className="font-crayon text-gray-600 mb-6">
            Your password has been successfully reset.
          </p>
          <a
            href="/"
            className="block w-full py-3 bg-[#4A9FD4] text-white rounded-xl font-display hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full">
        <h1 className="font-display text-2xl text-[#4A9FD4] mb-6 text-center">Reset Password</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-crayon text-gray-600 mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4A9FD4] outline-none font-crayon"
              placeholder="Enter new password"
              required
            />
          </div>
          
          <div>
            <label className="block font-crayon text-gray-600 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4A9FD4] outline-none font-crayon"
              placeholder="Confirm new password"
              required
            />
          </div>
          
          {error && (
            <p className="text-red-500 font-crayon text-sm text-center">{error}</p>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#4A9FD4] text-white rounded-xl font-display hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================
// COMING SOON PLACEHOLDER
// ============================================
const ComingSoon = ({ title }) => {
  return (
    <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="font-display text-2xl text-[#F5A623] mb-4">{title}</h1>
        <p className="font-crayon text-gray-600 mb-6">
          This feature is coming soon! We're working hard to bring you something amazing.
        </p>
        <a
          href="/hub"
          className="inline-block px-6 py-3 bg-[#4A9FD4] text-white rounded-xl font-display hover:bg-blue-600 transition-colors"
        >
          Back to Hub
        </a>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* ============================================ */}
            {/* AUTH & ENTRY */}
            {/* ============================================ */}
            <Route path="/" element={<EntryAuthScreen />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* ============================================ */}
            {/* MAIN HUB */}
            {/* ============================================ */}
            <Route 
              path="/hub" 
              element={
                <ProtectedRoute>
                  <AppHub />
                </ProtectedRoute>
              } 
            />
            
            {/* ============================================ */}
            {/* VISUAL SCHEDULE (Top-level) */}
            {/* ============================================ */}
            <Route 
              path="/visual-schedule" 
              element={
                <ProtectedRoute>
                  <VisualSchedule />
                </ProtectedRoute>
              } 
            />
            
            {/* ============================================ */}
            {/* POINT TO TALK (Top-level) */}
            {/* ============================================ */}
            <Route 
              path="/point-to-talk" 
              element={
                <ProtectedRoute>
                  <PointToTalk />
                </ProtectedRoute>
              } 
            />
            
            {/* ============================================ */}
            {/* DAILY TOOLS HUB */}
            {/* ============================================ */}
            <Route 
              path="/tools" 
              element={
                <ProtectedRoute>
                  <Tools />
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
              path="/tools/counter" 
              element={
                <ProtectedRoute>
                  <Counter />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tools/soundboard" 
              element={
                <ProtectedRoute>
                  <SoundBoard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tools/routines" 
              element={
                <ProtectedRoute>
                  <DailyRoutines />
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
              path="/tools/point-to-talk" 
              element={
                <ProtectedRoute>
                  <PointToTalk />
                </ProtectedRoute>
              } 
            />
            {/* Legacy: Calm Down moved to Wellness */}
            <Route 
              path="/tools/calm-down" 
              element={<Navigate to="/wellness/calm-down" replace />}
            />
            
            {/* ============================================ */}
            {/* EMOTIONAL WELLNESS HUB */}
            {/* ============================================ */}
            <Route 
              path="/wellness" 
              element={
                <ProtectedRoute>
                  <EmotionalWellnessHub />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wellness/calm-down" 
              element={
                <ProtectedRoute>
                  <CalmDown />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wellness/sensory-breaks" 
              element={
                <ProtectedRoute>
                  <SensoryBreaks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wellness/feelings" 
              element={
                <ProtectedRoute>
                  <FeelingsTracker />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wellness/emotion-chart" 
              element={
                <ProtectedRoute>
                  <EmotionChart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wellness/coping-skills" 
              element={
                <ProtectedRoute>
                  <CopingSkillsChart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wellness/circles-control" 
              element={
                <ProtectedRoute>
                  <CirclesOfControl />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wellness/growth-mindset" 
              element={
                <ProtectedRoute>
                  <GrowthMindset />
                </ProtectedRoute>
              } 
            />
            {/* Legacy redirects */}
            <Route 
              path="/coping/*" 
              element={<Navigate to="/wellness" replace />}
            />
            
            {/* ============================================ */}
            {/* MY CARE TEAM HUB (Renamed from Services) */}
            {/* ============================================ */}
            <Route 
              path="/care-team" 
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/care-team/appointments" 
              element={
                <ProtectedRoute>
                  <AppointmentTracker />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/care-team/goals" 
              element={
                <ProtectedRoute>
                  <GoalTracker />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/care-team/team" 
              element={
                <ProtectedRoute>
                  <MyTeam />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/care-team/notes" 
              element={
                <ProtectedRoute>
                  <QuickNotes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/care-team/reminders" 
              element={
                <ProtectedRoute>
                  <Reminders />
                </ProtectedRoute>
              } 
            />
            {/* Legacy: Services redirects to Care Team */}
            <Route 
              path="/services" 
              element={<Navigate to="/care-team" replace />}
            />
            <Route 
              path="/services/appointments" 
              element={<Navigate to="/care-team/appointments" replace />}
            />
            <Route 
              path="/services/goals" 
              element={<Navigate to="/care-team/goals" replace />}
            />
            <Route 
              path="/services/team" 
              element={<Navigate to="/care-team/team" replace />}
            />
            <Route 
              path="/services/notes" 
              element={<Navigate to="/care-team/notes" replace />}
            />
            <Route 
              path="/services/reminders" 
              element={<Navigate to="/care-team/reminders" replace />}
            />
            <Route 
              path="/services/routines" 
              element={<Navigate to="/tools/routines" replace />}
            />
            
            {/* ============================================ */}
            {/* HEALTH & WELLNESS HUB */}
            {/* ============================================ */}
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
            {/* Legacy: Feelings moved to Wellness */}
            <Route 
              path="/health/feelings" 
              element={<Navigate to="/wellness/feelings" replace />}
            />
            
            {/* ============================================ */}
            {/* GAMES HUB */}
            {/* ============================================ */}
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
            
            {/* ============================================ */}
            {/* ACTIVITIES & LEARNING HUB */}
            {/* ============================================ */}
            <Route 
              path="/activities" 
              element={
                <ProtectedRoute>
                  <Activities />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/activities/choice-board" 
              element={
                <ProtectedRoute>
                  <ChoiceBoard />
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
              path="/activities/pronunciation" 
              element={
                <ProtectedRoute>
                  <PronunciationPractice />
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
            {/* Legacy: Sensory Breaks moved to Wellness */}
            <Route 
              path="/activities/sensory-breaks" 
              element={<Navigate to="/wellness/sensory-breaks" replace />}
            />
            
            {/* ============================================ */}
            {/* PLANNING & DOCUMENTS HUB */}
            {/* ============================================ */}
            <Route 
              path="/planning" 
              element={
                <ProtectedRoute>
                  <PlanningHub />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/planning/student-profile" 
              element={
                <ProtectedRoute>
                  <StudentProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/planning/file-of-life" 
              element={
                <ProtectedRoute>
                  <FileOfLife />
                </ProtectedRoute>
              } 
            />
            {/* Person-Centered Plan */}
            <Route 
              path="/planning/person-centered" 
              element={
                <ProtectedRoute>
                  <PersonCenteredPlan />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/planning/memo-intent" 
              element={
                <ProtectedRoute>
                  <MemorandumOfIntent />
                </ProtectedRoute>
              } 
            />
            
            {/* ============================================ */}
            {/* RESOURCES & RESEARCH HUB */}
            {/* ============================================ */}
            <Route 
              path="/resources" 
              element={
                <ProtectedRoute>
                  <ResourcesHub />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resources/laws" 
              element={
                <ProtectedRoute>
                  <Knowledge />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resources/laws/:regionId" 
              element={
                <ProtectedRoute>
                  <Knowledge />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resources/laws/:regionId/:slug" 
              element={
                <ProtectedRoute>
                  <Knowledge />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resources/printables" 
              element={
                <ProtectedRoute>
                  <PrintablesLibrary />
                </ProtectedRoute>
              } 
            />
            {/* Research Hub */}
            <Route 
              path="/resources/research" 
              element={
                <ProtectedRoute>
                  <ResearchHub />
                </ProtectedRoute>
              } 
            />
            {/* Recommended Products */}
            <Route 
              path="/resources/products" 
              element={
                <ProtectedRoute>
                  <RecommendedProducts />
                </ProtectedRoute>
              } 
            />
            {/* Legacy: Knowledge redirects to Resources */}
            <Route 
              path="/knowledge" 
              element={<Navigate to="/resources/laws" replace />}
            />
            <Route 
              path="/knowledge/:regionId" 
              element={<Navigate to="/resources/laws" replace />}
            />
            <Route 
              path="/knowledge/:regionId/:slug" 
              element={<Navigate to="/resources/laws" replace />}
            />
            
            {/* ============================================ */}
            {/* COMMUNITY HUB */}
            {/* ============================================ */}
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
            
            {/* ============================================ */}
            {/* SETTINGS */}
            {/* ============================================ */}
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            
            {/* ============================================ */}
            {/* CATCH-ALL REDIRECT */}
            {/* ============================================ */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* PWA Install Prompt */}
          <PWAInstallPrompt />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
