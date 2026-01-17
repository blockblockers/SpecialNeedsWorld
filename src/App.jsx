// App.jsx - ATLASassist v2.0 with LAZY LOADING
// Uses React.lazy() for code splitting - only loads pages when needed
// This dramatically reduces initial bundle size and improves load time
// UPDATED: Added Music & Sounds, Photo Journal, Reward Chart
// FIXED: Game routes to match Games.jsx paths
// FIXED: HealthyChoices route to match Health.jsx path
// UPDATED: Added TherapyTypes, Definitions, FAQ routes
// UPDATED: Emotional Wellness now main hub (not under Health)

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, createContext, useContext, lazy, Suspense } from 'react';

// ============================================
// EAGER IMPORTS - Only what's needed immediately
// ============================================
import EntryAuthScreen from './pages/EntryAuthScreen';
import { ToastProvider } from './components/ThemedToast';
import { supabase, isSupabaseConfigured } from './services/supabase';
import { initNotifications } from './services/notifications';

// ============================================
// LAZY IMPORTS - Loaded on demand
// ============================================

// Main Hub (loaded after login)
const AppHub = lazy(() => import('./pages/AppHub'));
const Settings = lazy(() => import('./pages/Settings'));

// Core Features
const VisualSchedule = lazy(() => import('./pages/VisualSchedule'));
const PointToTalk = lazy(() => import('./pages/PointToTalk'));

// Tools Hub
const Tools = lazy(() => import('./pages/Tools'));
const VisualTimer = lazy(() => import('./pages/VisualTimer'));
const FirstThen = lazy(() => import('./pages/FirstThen'));
const Counter = lazy(() => import('./pages/Counter'));
const SoundBoard = lazy(() => import('./pages/SoundBoard'));
const DailyRoutines = lazy(() => import('./pages/DailyRoutines'));
const MilestoneGuide = lazy(() => import('./pages/MilestoneGuide'));

// Emotional Wellness Hub (now main hub, not under Health)
const EmotionalWellnessHub = lazy(() => import('./pages/EmotionalWellnessHub'));
const CalmDown = lazy(() => import('./pages/CalmDown'));
const SensoryBreaks = lazy(() => import('./pages/SensoryBreaks'));
const FeelingsTracker = lazy(() => import('./pages/FeelingsTracker'));
const EmotionChart = lazy(() => import('./pages/EmotionChart'));
const CopingSkillsChart = lazy(() => import('./pages/CopingSkillsChart'));
const CirclesOfControl = lazy(() => import('./pages/CirclesOfControl'));
const GrowthMindset = lazy(() => import('./pages/GrowthMindset'));

// Care Team / Services Hub
const Services = lazy(() => import('./pages/Services'));
const AppointmentTracker = lazy(() => import('./pages/AppointmentTracker'));
const GoalTracker = lazy(() => import('./pages/GoalTracker'));
const MyTeam = lazy(() => import('./pages/MyTeam'));
const QuickNotes = lazy(() => import('./pages/QuickNotes'));
const Reminders = lazy(() => import('./pages/Reminders'));

// Health Hub
const Health = lazy(() => import('./pages/Health'));
const Nutrition = lazy(() => import('./pages/Nutrition'));
const WaterTracker = lazy(() => import('./pages/WaterTracker'));
const SleepTracker = lazy(() => import('./pages/SleepTracker'));
const MoveExercise = lazy(() => import('./pages/MoveExercise'));
const OTExercises = lazy(() => import('./pages/OTExercises'));
const HealthyChoices = lazy(() => import('./pages/HealthyChoices'));

// Games Hub
const Games = lazy(() => import('./pages/Games'));
const MatchingGame = lazy(() => import('./pages/MatchingGame'));
const EmotionMatch = lazy(() => import('./pages/EmotionMatch'));
const BubblePop = lazy(() => import('./pages/BubblePop'));
const ColorSort = lazy(() => import('./pages/ColorSort'));
const ShapeMatch = lazy(() => import('./pages/ShapeMatch'));
const SimplePuzzles = lazy(() => import('./pages/SimplePuzzles'));
const PatternSequence = lazy(() => import('./pages/PatternSequence'));

// Activities Hub
const Activities = lazy(() => import('./pages/Activities'));
const SocialStories = lazy(() => import('./pages/SocialStories'));
const ColoringBook = lazy(() => import('./pages/ColoringBook'));
const PronunciationPractice = lazy(() => import('./pages/PronunciationPractice'));
const ChoiceBoard = lazy(() => import('./pages/ChoiceBoard'));
const MusicSounds = lazy(() => import('./pages/MusicSounds'));
const PhotoJournal = lazy(() => import('./pages/PhotoJournal'));
const RewardChart = lazy(() => import('./pages/RewardChart'));

// Planning Hub
const PlanningHub = lazy(() => import('./pages/PlanningHub'));
const StudentProfile = lazy(() => import('./pages/StudentProfile'));
const FileOfLife = lazy(() => import('./pages/FileOfLife'));
const PersonCenteredPlan = lazy(() => import('./pages/PersonCenteredPlan'));
const MemorandumOfIntent = lazy(() => import('./pages/MemorandumOfIntent'));

// Resources Hub - UPDATED: Added TherapyTypes, Definitions, FAQ
const ResourcesHub = lazy(() => import('./pages/ResourcesHub'));
const PrintablesLibrary = lazy(() => import('./pages/PrintablesLibrary'));
const ResearchHub = lazy(() => import('./pages/ResearchHub'));
const RecommendedProducts = lazy(() => import('./pages/RecommendedProducts'));
const Knowledge = lazy(() => import('./pages/Knowledge'));
const TherapyTypes = lazy(() => import('./pages/TherapyTypes'));
const Definitions = lazy(() => import('./pages/Definitions'));
const FAQ = lazy(() => import('./pages/FAQ'));

// Community
const Community = lazy(() => import('./pages/Community'));
const CommunityProfileSetup = lazy(() => import('./pages/CommunityProfileSetup'));
const CommunityNewThread = lazy(() => import('./pages/CommunityNewThread'));
const CommunityThread = lazy(() => import('./pages/CommunityThread'));

// ============================================
// LOADING FALLBACK COMPONENT
// ============================================
const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#8E6BBF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="font-crayon text-gray-600">Loading...</p>
    </div>
  </div>
);

// ============================================
// AUTH CONTEXT
// ============================================
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================
// PROTECTED ROUTE COMPONENT
// ============================================
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
};

// ============================================
// RESET PASSWORD PAGE
// ============================================
const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();

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
      await updatePassword(password);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-crayon max-w-md w-full text-center">
          <h2 className="text-2xl font-display text-[#5CB85C] mb-4">Password Updated!</h2>
          <p className="font-crayon text-gray-600 mb-4">Your password has been changed successfully.</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-[#8E6BBF] text-white rounded-xl font-crayon"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-crayon max-w-md w-full">
        <h2 className="text-2xl font-display text-[#8E6BBF] mb-6 text-center">Set New Password</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 font-crayon text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 font-crayon focus:border-[#8E6BBF] focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 font-crayon focus:border-[#8E6BBF] focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#8E6BBF] text-white rounded-xl font-display hover:bg-[#7d5aa8] transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
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
            {/* AUTH ROUTES (not lazy - needed immediately) */}
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
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            
            {/* ============================================ */}
            {/* CORE FEATURES */}
            {/* ============================================ */}
            <Route 
              path="/visual-schedule" 
              element={
                <ProtectedRoute>
                  <VisualSchedule />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/schedule" 
              element={
                <ProtectedRoute>
                  <VisualSchedule />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/point-to-talk" 
              element={
                <ProtectedRoute>
                  <PointToTalk />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/talk" 
              element={
                <ProtectedRoute>
                  <PointToTalk />
                </ProtectedRoute>
              } 
            />
            
            {/* ============================================ */}
            {/* TOOLS HUB */}
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
            
            {/* ============================================ */}
            {/* EMOTIONAL WELLNESS HUB (Main Hub - not under Health) */}
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
            <Route 
              path="/wellness/social-stories" 
              element={
                <ProtectedRoute>
                  <SocialStories />
                </ProtectedRoute>
              } 
            />
            
            {/* Legacy routes for backward compatibility */}
            <Route 
              path="/emotional-wellness" 
              element={<Navigate to="/wellness" replace />}
            />
            <Route 
              path="/emotional-wellness/*" 
              element={<Navigate to="/wellness" replace />}
            />
            
            {/* ============================================ */}
            {/* CARE TEAM / SERVICES HUB */}
            {/* ============================================ */}
            <Route 
              path="/services" 
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/care-team" 
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
            <Route 
              path="/services/routines" 
              element={
                <ProtectedRoute>
                  <DailyRoutines />
                </ProtectedRoute>
              } 
            />
            
            {/* ============================================ */}
            {/* HEALTH HUB (Physical health only) */}
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
              path="/health/healthy-choices" 
              element={
                <ProtectedRoute>
                  <HealthyChoices />
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
            {/* ACTIVITIES HUB */}
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
              path="/activities/choice-board" 
              element={
                <ProtectedRoute>
                  <ChoiceBoard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/activities/music" 
              element={
                <ProtectedRoute>
                  <MusicSounds />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/activities/photo-journal" 
              element={
                <ProtectedRoute>
                  <PhotoJournal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/activities/rewards" 
              element={
                <ProtectedRoute>
                  <RewardChart />
                </ProtectedRoute>
              } 
            />
            
            {/* ============================================ */}
            {/* PLANNING HUB */}
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
            <Route 
              path="/planning/person-centered-plan" 
              element={
                <ProtectedRoute>
                  <PersonCenteredPlan />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/planning/memorandum-of-intent" 
              element={
                <ProtectedRoute>
                  <MemorandumOfIntent />
                </ProtectedRoute>
              } 
            />
            
            {/* ============================================ */}
            {/* RESOURCES HUB - UPDATED with new apps */}
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
              path="/resources/printables" 
              element={
                <ProtectedRoute>
                  <PrintablesLibrary />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resources/research" 
              element={
                <ProtectedRoute>
                  <ResearchHub />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resources/products" 
              element={
                <ProtectedRoute>
                  <RecommendedProducts />
                </ProtectedRoute>
              } 
            />
            {/* NEW: Therapy Types */}
            <Route 
              path="/resources/therapy-types" 
              element={
                <ProtectedRoute>
                  <TherapyTypes />
                </ProtectedRoute>
              } 
            />
            {/* NEW: Definitions */}
            <Route 
              path="/resources/definitions" 
              element={
                <ProtectedRoute>
                  <Definitions />
                </ProtectedRoute>
              } 
            />
            {/* NEW: FAQ */}
            <Route 
              path="/resources/faq" 
              element={
                <ProtectedRoute>
                  <FAQ />
                </ProtectedRoute>
              } 
            />
            
            {/* ============================================ */}
            {/* KNOWLEDGE / STATE RESOURCES */}
            {/* ============================================ */}
            <Route 
              path="/knowledge" 
              element={
                <ProtectedRoute>
                  <Knowledge />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/knowledge/:region" 
              element={
                <ProtectedRoute>
                  <Knowledge />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/knowledge/:region/:slug" 
              element={
                <ProtectedRoute>
                  <Knowledge />
                </ProtectedRoute>
              } 
            />
            
            {/* ============================================ */}
            {/* COMMUNITY */}
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
              path="/community/setup" 
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
            {/* CATCH-ALL REDIRECT */}
            {/* ============================================ */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
