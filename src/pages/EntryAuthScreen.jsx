// EntryAuthScreen.jsx - Authentication screen for Special Needs World
// Features:
// - Google OAuth
// - Email/Password sign in and sign up
// - Forgot password flow
// - Guest mode for testing
// - Dedicated to Finn

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  ArrowLeft,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../App';

const EntryAuthScreen = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, signInAsGuest, isAuthenticated, resetPassword, isSupabaseConfigured } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/hub');
    }
  }, [isAuthenticated, navigate]);
  
  // Modes: select, login, signup, forgot-password
  const [mode, setMode] = useState('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    clearMessages();
  };

  // Handle email/password sign in
  const handleSignIn = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    const result = await signIn(email, password);
    
    if (result.error) {
      setError(result.error.message);
    } else {
      navigate('/hub');
    }
    
    setLoading(false);
  };

  // Handle sign up
  const handleSignUp = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    if (!displayName || displayName.length < 2) {
      setError('Please enter your name (at least 2 characters)');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = await signUp(email, password, displayName);
    
    if (result.error) {
      setError(result.error.message);
    } else if (result.requiresConfirmation) {
      setSuccessMessage('Please check your email to confirm your account! Then come back and sign in.');
      setMode('login');
      setPassword('');
    } else {
      navigate('/hub');
    }
    
    setLoading(false);
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    clearMessages();
    setLoading(true);
    
    const result = await signInWithGoogle();
    
    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    }
    // If successful, will redirect automatically via OAuth flow
  };

  // Handle forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    clearMessages();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    
    const result = await resetPassword(email);
    
    if (result.error) {
      setError(result.error.message);
    } else {
      setSuccessMessage('Password reset email sent! Check your inbox.');
    }
    
    setLoading(false);
  };

  // Handle guest mode
  const handleGuestMode = () => {
    signInAsGuest();
    navigate('/hub');
  };

  // Floating decorative elements - matching logo style
  const FloatingDecorations = () => (
    <>
      {/* Sun in top right */}
      <div className="absolute top-16 right-8 w-14 h-14">
        <div className="w-full h-full rounded-full bg-[#F8D14A]" style={{ boxShadow: '0 0 20px #F5A623' }}></div>
      </div>
      
      {/* Clouds */}
      <div className="absolute top-20 left-6">
        <div className="flex gap-1">
          <div className="w-8 h-6 rounded-full bg-[#87CEEB] opacity-80"></div>
          <div className="w-6 h-5 rounded-full bg-[#87CEEB] opacity-80 -ml-3 mt-1"></div>
          <div className="w-7 h-5 rounded-full bg-[#87CEEB] opacity-80 -ml-3"></div>
        </div>
      </div>
      
      <div className="absolute top-32 right-20">
        <div className="flex gap-1">
          <div className="w-6 h-4 rounded-full bg-[#87CEEB] opacity-60"></div>
          <div className="w-5 h-4 rounded-full bg-[#87CEEB] opacity-60 -ml-2"></div>
        </div>
      </div>
      
      {/* Colorful hands like in logo */}
      <div className="absolute bottom-32 left-6 text-[#E63B2E] opacity-70">
        <svg width="32" height="36" viewBox="0 0 24 28" fill="currentColor">
          <path d="M12 2c-0.5 0-1 0.5-1 1v7c0 0.5-0.5 1-1 1s-1-0.5-1-1V4c0-0.5-0.5-1-1-1s-1 0.5-1 1v8c0 0.5-0.5 1-1 1s-1-0.5-1-1V6c0-0.5-0.5-1-1-1s-1 0.5-1 1v10c0 5 4 9 9 9s9-4 9-9V8c0-0.5-0.5-1-1-1s-1 0.5-1 1v4c0 0.5-0.5 1-1 1s-1-0.5-1-1V4c0-0.5-0.5-1-1-1s-1 0.5-1 1v6c0 0.5-0.5 1-1 1s-1-0.5-1-1V3c0-0.5-0.5-1-1-1z"/>
        </svg>
      </div>
      
      <div className="absolute bottom-28 right-8 text-[#5CB85C] opacity-70">
        <svg width="28" height="32" viewBox="0 0 24 28" fill="currentColor">
          <path d="M12 2c-0.5 0-1 0.5-1 1v7c0 0.5-0.5 1-1 1s-1-0.5-1-1V4c0-0.5-0.5-1-1-1s-1 0.5-1 1v8c0 0.5-0.5 1-1 1s-1-0.5-1-1V6c0-0.5-0.5-1-1-1s-1 0.5-1 1v10c0 5 4 9 9 9s9-4 9-9V8c0-0.5-0.5-1-1-1s-1 0.5-1 1v4c0 0.5-0.5 1-1 1s-1-0.5-1-1V4c0-0.5-0.5-1-1-1s-1 0.5-1 1v6c0 0.5-0.5 1-1 1s-1-0.5-1-1V3c0-0.5-0.5-1-1-1z"/>
        </svg>
      </div>
      
      <div className="absolute top-40 left-10 text-[#4A9FD4] opacity-60 transform -rotate-12">
        <svg width="24" height="28" viewBox="0 0 24 28" fill="currentColor">
          <path d="M12 2c-0.5 0-1 0.5-1 1v7c0 0.5-0.5 1-1 1s-1-0.5-1-1V4c0-0.5-0.5-1-1-1s-1 0.5-1 1v8c0 0.5-0.5 1-1 1s-1-0.5-1-1V6c0-0.5-0.5-1-1-1s-1 0.5-1 1v10c0 5 4 9 9 9s9-4 9-9V8c0-0.5-0.5-1-1-1s-1 0.5-1 1v4c0 0.5-0.5 1-1 1s-1-0.5-1-1V4c0-0.5-0.5-1-1-1s-1 0.5-1 1v6c0 0.5-0.5 1-1 1s-1-0.5-1-1V3c0-0.5-0.5-1-1-1z"/>
        </svg>
      </div>
    </>
  );

  // Success message component
  const SuccessMessage = ({ message }) => (
    <div className="p-3 bg-green-100 border-4 border-[#5CB85C] rounded-xl text-green-700 text-sm font-crayon flex items-start gap-2"
         style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}>
      <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );

  // Error message component
  const ErrorMessage = ({ message }) => (
    <div className="p-3 bg-red-100 border-4 border-[#E63B2E] rounded-xl text-red-700 text-sm font-crayon flex items-start gap-2"
         style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}>
      <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );

  // Main selection screen
  const renderSelectMode = () => (
    <div className="space-y-4">
      {/* Success/Error Messages */}
      {successMessage && <SuccessMessage message={successMessage} />}
      {error && <ErrorMessage message={error} />}

      {/* Google Sign In */}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full py-4 px-6 bg-white border-4 border-[#E63B2E] rounded-2xl
                   font-crayon text-lg text-gray-700 
                   shadow-crayon hover:shadow-crayon-lg
                   hover:-translate-y-1 hover:rotate-1
                   transition-all duration-200
                   flex items-center justify-center gap-3
                   disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {loading ? 'Connecting...' : 'Sign in with Google'}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-1 bg-[#F5A623] rounded-full opacity-50"></div>
        <span className="text-gray-500 font-crayon">or</span>
        <div className="flex-1 h-1 bg-[#F5A623] rounded-full opacity-50"></div>
      </div>

      {/* Email Sign In */}
      <button
        onClick={() => switchMode('login')}
        className="w-full py-4 px-6 bg-[#4A9FD4] text-white
                   font-crayon text-lg rounded-2xl
                   shadow-crayon hover:shadow-crayon-lg
                   hover:-translate-y-1 hover:-rotate-1
                   transition-all duration-200
                   flex items-center justify-center gap-3"
        style={{ borderRadius: '15px 225px 15px 255px/255px 15px 225px 15px' }}
      >
        <Mail size={24} />
        Sign in with Email
      </button>

      {/* Create Account */}
      <button
        onClick={() => switchMode('signup')}
        className="w-full py-4 px-6 bg-[#5CB85C] text-white
                   font-crayon text-lg rounded-2xl
                   shadow-crayon hover:shadow-crayon-lg
                   hover:-translate-y-1 hover:rotate-1
                   transition-all duration-200
                   flex items-center justify-center gap-3"
        style={{ borderRadius: '225px 15px 255px 15px/15px 255px 15px 225px' }}
      >
        <UserPlus size={24} />
        Create Account
      </button>

      {/* Guest Mode */}
      <div className="pt-4 border-t-2 border-dashed border-gray-300">
        <button
          onClick={handleGuestMode}
          className="w-full py-3 px-6 bg-gray-100 text-gray-600
                     font-crayon text-base rounded-xl
                     hover:bg-gray-200 transition-all
                     flex items-center justify-center gap-2"
        >
          Continue as Guest
          <span className="text-xs bg-gray-300 px-2 py-0.5 rounded-full">No account needed</span>
        </button>
      </div>

      {/* Supabase status indicator (for debugging) */}
      {!isSupabaseConfigured && (
        <p className="text-xs text-center text-gray-400 mt-4">
          ⚠️ Cloud sync not configured - using local storage
        </p>
      )}
    </div>
  );

  // Login form
  const renderLoginMode = () => (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => switchMode('select')}
        className="flex items-center gap-2 text-[#4A9FD4] hover:text-[#8E6BBF] 
                   font-crayon transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>
      
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-[#4A9FD4] rounded-full flex items-center justify-center mx-auto mb-3 shadow-crayon">
          <LogIn size={32} className="text-white" />
        </div>
        <h3 className="text-2xl font-display text-[#4A9FD4] crayon-text">Welcome Back!</h3>
      </div>
      
      {successMessage && <SuccessMessage message={successMessage} />}
      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="relative">
          <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A9FD4]" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-700 
                       border-4 border-[#4A9FD4] font-crayon text-lg
                       focus:border-[#8E6BBF] focus:outline-none transition-all"
            style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}
            placeholder="your@email.com"
            required
            autoComplete="email"
          />
        </div>
        
        <div className="relative">
          <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A9FD4]" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-white rounded-xl text-gray-700 
                       border-4 border-[#4A9FD4] font-crayon text-lg
                       focus:border-[#8E6BBF] focus:outline-none transition-all"
            style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}
            placeholder="Password"
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4A9FD4]"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <button
            type="button"
            onClick={() => switchMode('forgot-password')}
            className="text-sm font-crayon text-[#8E6BBF] hover:text-[#4A9FD4] hover:underline"
          >
            Forgot password?
          </button>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#5CB85C] text-white font-crayon text-xl rounded-xl
                     shadow-crayon hover:shadow-crayon-lg hover:-translate-y-1
                     transition-all flex items-center justify-center gap-2
                     disabled:opacity-50"
          style={{ borderRadius: '15px 255px 15px 225px/225px 15px 255px 15px' }}
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <LogIn size={24} />
              Let's Go!
            </>
          )}
        </button>
      </form>
    </div>
  );

  // Signup form
  const renderSignupMode = () => (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => switchMode('select')}
        className="flex items-center gap-2 text-[#5CB85C] hover:text-[#8E6BBF] 
                   font-crayon transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>
      
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-[#5CB85C] rounded-full flex items-center justify-center mx-auto mb-3 shadow-crayon">
          <UserPlus size={32} className="text-white" />
        </div>
        <h3 className="text-2xl font-display text-[#5CB85C] crayon-text">Join the Fun!</h3>
      </div>
      
      {successMessage && <SuccessMessage message={successMessage} />}
      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="relative">
          <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5CB85C]" />
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-700 
                       border-4 border-[#5CB85C] font-crayon text-lg
                       focus:border-[#8E6BBF] focus:outline-none transition-all"
            style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}
            placeholder="Your Name"
            required
            autoComplete="name"
          />
        </div>

        <div className="relative">
          <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5CB85C]" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-700 
                       border-4 border-[#5CB85C] font-crayon text-lg
                       focus:border-[#8E6BBF] focus:outline-none transition-all"
            style={{ borderRadius: '15px 225px 15px 255px/255px 15px 225px 15px' }}
            placeholder="your@email.com"
            required
            autoComplete="email"
          />
        </div>
        
        <div className="relative">
          <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5CB85C]" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-white rounded-xl text-gray-700 
                       border-4 border-[#5CB85C] font-crayon text-lg
                       focus:border-[#8E6BBF] focus:outline-none transition-all"
            style={{ borderRadius: '225px 15px 255px 15px/15px 255px 15px 225px' }}
            placeholder="Create Password (6+ characters)"
            required
            autoComplete="new-password"
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5CB85C]"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#4A9FD4] text-white font-crayon text-xl rounded-xl
                     shadow-crayon hover:shadow-crayon-lg hover:-translate-y-1
                     transition-all flex items-center justify-center gap-2
                     disabled:opacity-50"
          style={{ borderRadius: '15px 255px 15px 225px/225px 15px 255px 15px' }}
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Star size={24} fill="currentColor" />
              Create My Account!
            </>
          )}
        </button>
      </form>
    </div>
  );

  // Forgot password form
  const renderForgotPasswordMode = () => (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => switchMode('login')}
        className="flex items-center gap-2 text-[#8E6BBF] hover:text-[#4A9FD4] 
                   font-crayon transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Sign In
      </button>
      
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-[#8E6BBF] rounded-full flex items-center justify-center mx-auto mb-3 shadow-crayon">
          <Mail size={32} className="text-white" />
        </div>
        <h3 className="text-2xl font-display text-[#8E6BBF] crayon-text">Reset Password</h3>
        <p className="font-crayon text-gray-600 text-sm mt-2">
          Enter your email and we'll send you a reset link
        </p>
      </div>
      
      {successMessage && <SuccessMessage message={successMessage} />}
      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleForgotPassword} className="space-y-4">
        <div className="relative">
          <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E6BBF]" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-700 
                       border-4 border-[#8E6BBF] font-crayon text-lg
                       focus:border-[#4A9FD4] focus:outline-none transition-all"
            style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}
            placeholder="your@email.com"
            required
            autoComplete="email"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#8E6BBF] text-white font-crayon text-xl rounded-xl
                     shadow-crayon hover:shadow-crayon-lg hover:-translate-y-1
                     transition-all flex items-center justify-center gap-2
                     disabled:opacity-50"
          style={{ borderRadius: '15px 255px 15px 225px/225px 15px 255px 15px' }}
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFEF5] flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <FloatingDecorations />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        {/* Logo */}
        <div className="mb-6">
          <img 
            src="/logo.jpeg" 
            alt="Special Needs World Logo" 
            className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl shadow-crayon-lg"
            style={{ borderRadius: '30px' }}
          />
        </div>
        
        {/* Title Section */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-display rainbow-text mb-1 crayon-text">
            Special Needs
          </h1>
          <h2 className="text-4xl sm:text-5xl font-display text-[#4A9FD4] crayon-text">
            World
          </h2>
          <p className="text-sm sm:text-base font-crayon text-gray-600 max-w-xs mx-auto mt-4 leading-relaxed">
            An ecosystem of helpful applications, tools, and services for the special needs community.
          </p>
        </div>
        
        {/* Auth Card */}
        <div 
          className="w-full max-w-md bg-white p-6 sm:p-8 shadow-crayon-lg border-4 border-[#F5A623]"
          style={{ borderRadius: '30px 70px 30px 70px / 70px 30px 70px 30px' }}
        >
          {mode === 'select' && renderSelectMode()}
          {mode === 'login' && renderLoginMode()}
          {mode === 'signup' && renderSignupMode()}
          {mode === 'forgot-password' && renderForgotPasswordMode()}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 px-4">
        <p className="text-gray-500 font-crayon text-sm mb-2">
          © 2025 Special Needs World
        </p>
        <p className="text-[#8E6BBF] font-display text-lg italic">
          For Finn, and for people like him. 💜
        </p>
      </footer>
    </div>
  );
};

export default EntryAuthScreen;
