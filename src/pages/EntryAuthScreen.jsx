// EntryAuthScreen.jsx - Clean authentication screen for ATLASassist

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../App';

const EntryAuthScreen = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, signInAsGuest, isAuthenticated, resetPassword } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/hub');
    }
  }, [isAuthenticated, navigate]);
  
  const [mode, setMode] = useState('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const clearMessages = () => { setError(''); setSuccess(''); };
  const switchMode = (m) => { setMode(m); clearMessages(); };

  const handleSignIn = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    const result = await signIn(email, password);
    if (result.error) setError(result.error.message);
    else navigate('/hub');
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!displayName || displayName.length < 2) {
      setError('Please enter your name');
      return;
    }
    setLoading(true);
    const result = await signUp(email, password, displayName);
    if (result.error) setError(result.error.message);
    else if (result.requiresConfirmation) {
      setSuccess('Check your email to confirm!');
      setMode('login');
    } else navigate('/hub');
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    clearMessages();
    setLoading(true);
    const result = await signInWithGoogle();
    if (result.error) { setError(result.error.message); setLoading(false); }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email) { setError('Enter your email'); return; }
    setLoading(true);
    const result = await resetPassword(email);
    if (result.error) setError(result.error.message);
    else setSuccess('Reset link sent! Check your email.');
    setLoading(false);
  };

  const handleGuestMode = () => { signInAsGuest(); navigate('/hub'); };

  // Main selection screen with app-style buttons
  const renderSelect = () => (
    <div className="space-y-3">
      {error && <div className="p-3 bg-red-100 border-3 border-[#E63B2E] rounded-xl text-red-700 text-sm font-crayon">{error}</div>}
      {success && <div className="p-3 bg-green-100 border-3 border-[#5CB85C] rounded-xl text-green-700 text-sm font-crayon">{success}</div>}

      {/* Google - styled like app buttons */}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full p-4 bg-white border-4 border-[#E63B2E] rounded-2xl font-crayon text-gray-700 
                   shadow-crayon hover:shadow-crayon-lg hover:-translate-y-1 transition-all
                   flex items-center justify-center gap-3 disabled:opacity-50"
        style={{ borderRadius: '20px 8px 20px 8px' }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Sign in with Google
      </button>

      {/* Email Sign In */}
      <button
        onClick={() => switchMode('login')}
        className="w-full p-4 bg-[#4A9FD4] text-white border-4 border-blue-600 rounded-2xl font-crayon
                   shadow-crayon hover:shadow-crayon-lg hover:-translate-y-1 transition-all
                   flex items-center justify-center gap-3"
        style={{ borderRadius: '8px 20px 8px 20px' }}
      >
        <Mail size={20} />
        Sign in with Email
      </button>

      {/* Create Account */}
      <button
        onClick={() => switchMode('signup')}
        className="w-full p-4 bg-[#5CB85C] text-white border-4 border-green-600 rounded-2xl font-crayon
                   shadow-crayon hover:shadow-crayon-lg hover:-translate-y-1 transition-all
                   flex items-center justify-center gap-3"
        style={{ borderRadius: '20px 8px 20px 8px' }}
      >
        <UserPlus size={20} />
        Create Account
      </button>

      {/* Guest Mode */}
      <button
        onClick={handleGuestMode}
        className="w-full p-3 bg-gray-100 text-gray-600 rounded-xl font-crayon text-sm
                   hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
      >
        Continue as Guest
        <span className="text-xs bg-gray-300 px-2 py-0.5 rounded-full">No save</span>
      </button>
    </div>
  );

  // Login form
  const renderLogin = () => (
    <div className="space-y-3">
      <button onClick={() => switchMode('select')} className="flex items-center gap-1 text-[#4A9FD4] font-crayon text-sm hover:underline">
        <ArrowLeft size={16} /> Back
      </button>
      
      <div className="text-center py-2">
        <LogIn size={32} className="mx-auto text-[#4A9FD4] mb-2" />
        <h3 className="font-display text-xl text-[#4A9FD4]">Welcome Back!</h3>
      </div>
      
      {error && <div className="p-2 bg-red-100 border-2 border-[#E63B2E] rounded-lg text-red-700 text-sm font-crayon">{error}</div>}
      {success && <div className="p-2 bg-green-100 border-2 border-[#5CB85C] rounded-lg text-green-700 text-sm font-crayon">{success}</div>}

      <form onSubmit={handleSignIn} className="space-y-3">
        <div className="relative">
          <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A9FD4]" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border-3 border-[#4A9FD4] font-crayon focus:border-[#8E6BBF] focus:outline-none"
            placeholder="your@email.com" required autoComplete="email" />
        </div>
        
        <div className="relative">
          <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A9FD4]" />
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white rounded-xl border-3 border-[#4A9FD4] font-crayon focus:border-[#8E6BBF] focus:outline-none"
            placeholder="Password" required autoComplete="current-password" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button type="button" onClick={() => switchMode('forgot')} className="text-sm font-crayon text-[#8E6BBF] hover:underline">
          Forgot password?
        </button>
        
        <button type="submit" disabled={loading}
          className="w-full py-3 bg-[#5CB85C] text-white rounded-xl font-crayon text-lg shadow-crayon hover:shadow-crayon-lg disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" /> : <><LogIn size={20} /> Sign In</>}
        </button>
      </form>
    </div>
  );

  // Signup form
  const renderSignup = () => (
    <div className="space-y-3">
      <button onClick={() => switchMode('select')} className="flex items-center gap-1 text-[#5CB85C] font-crayon text-sm hover:underline">
        <ArrowLeft size={16} /> Back
      </button>
      
      <div className="text-center py-2">
        <UserPlus size={32} className="mx-auto text-[#5CB85C] mb-2" />
        <h3 className="font-display text-xl text-[#5CB85C]">Join Us!</h3>
      </div>
      
      {error && <div className="p-2 bg-red-100 border-2 border-[#E63B2E] rounded-lg text-red-700 text-sm font-crayon">{error}</div>}

      <form onSubmit={handleSignUp} className="space-y-3">
        <div className="relative">
          <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5CB85C]" />
          <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border-3 border-[#5CB85C] font-crayon focus:border-[#8E6BBF] focus:outline-none"
            placeholder="Your Name" required autoComplete="name" />
        </div>

        <div className="relative">
          <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5CB85C]" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border-3 border-[#5CB85C] font-crayon focus:border-[#8E6BBF] focus:outline-none"
            placeholder="your@email.com" required autoComplete="email" />
        </div>
        
        <div className="relative">
          <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5CB85C]" />
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white rounded-xl border-3 border-[#5CB85C] font-crayon focus:border-[#8E6BBF] focus:outline-none"
            placeholder="Password (6+ chars)" required autoComplete="new-password" minLength={6} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        
        <button type="submit" disabled={loading}
          className="w-full py-3 bg-[#4A9FD4] text-white rounded-xl font-crayon text-lg shadow-crayon hover:shadow-crayon-lg disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" /> : <><UserPlus size={20} /> Create Account</>}
        </button>
      </form>
    </div>
  );

  // Forgot password
  const renderForgot = () => (
    <div className="space-y-3">
      <button onClick={() => switchMode('login')} className="flex items-center gap-1 text-[#8E6BBF] font-crayon text-sm hover:underline">
        <ArrowLeft size={16} /> Back
      </button>
      
      <div className="text-center py-2">
        <Mail size={32} className="mx-auto text-[#8E6BBF] mb-2" />
        <h3 className="font-display text-xl text-[#8E6BBF]">Reset Password</h3>
        <p className="font-crayon text-gray-600 text-sm">We'll send you a reset link</p>
      </div>
      
      {error && <div className="p-2 bg-red-100 border-2 border-[#E63B2E] rounded-lg text-red-700 text-sm font-crayon">{error}</div>}
      {success && <div className="p-2 bg-green-100 border-2 border-[#5CB85C] rounded-lg text-green-700 text-sm font-crayon">{success}</div>}

      <form onSubmit={handleForgotPassword} className="space-y-3">
        <div className="relative">
          <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E6BBF]" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border-3 border-[#8E6BBF] font-crayon focus:border-[#4A9FD4] focus:outline-none"
            placeholder="your@email.com" required autoComplete="email" />
        </div>
        
        <button type="submit" disabled={loading}
          className="w-full py-3 bg-[#8E6BBF] text-white rounded-xl font-crayon text-lg shadow-crayon hover:shadow-crayon-lg disabled:opacity-50">
          {loading ? <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFEF5] flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Logo */}
        <img src="/logo.jpeg" alt="ATLASassist" 
          className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl shadow-crayon-lg mb-4" />
        
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-display rainbow-text crayon-text mb-1">ATLAS</h1>
        <h2 className="text-2xl sm:text-3xl font-display text-[#4A9FD4] crayon-text mb-2">assist</h2>
        <p className="text-xs sm:text-sm font-crayon text-gray-600 max-w-xs text-center mb-4 leading-relaxed">
          Assistive Tools for Learning, Access &amp; Support
        </p>
        <p className="text-xs font-crayon text-[#8E6BBF] max-w-xs text-center mb-4">
          Tools for individuals with neurodiverse abilities
        </p>
        
        {/* Auth Card */}
        <div className="w-full max-w-sm bg-white p-5 shadow-crayon-lg border-4 border-[#F5A623] rounded-2xl"
             style={{ borderRadius: '24px' }}>
          {mode === 'select' && renderSelect()}
          {mode === 'login' && renderLogin()}
          {mode === 'signup' && renderSignup()}
          {mode === 'forgot' && renderForgot()}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 px-4">
        <p className="text-gray-500 font-crayon text-xs">© 2025 ATLASassist</p>
        <p className="text-[#8E6BBF] font-display text-sm italic">For Finn, and for people like him. 💜</p>
      </footer>
    </div>
  );
};

export default EntryAuthScreen;
