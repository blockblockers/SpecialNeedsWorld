// VisualTimer.jsx - Visual countdown timer with color feedback
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

// Preset times
const PRESETS = [
  { label: '1 min', seconds: 60, emoji: '⚡' },
  { label: '2 min', seconds: 120, emoji: '🎯' },
  { label: '5 min', seconds: 300, emoji: '⏰' },
  { label: '10 min', seconds: 600, emoji: '📚' },
  { label: '15 min', seconds: 900, emoji: '🎨' },
  { label: '20 min', seconds: 1200, emoji: '🧩' },
];

const VisualTimer = () => {
  const navigate = useNavigate();
  const [totalSeconds, setTotalSeconds] = useState(300); // 5 min default
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef(null);

  // Calculate progress percentage
  const progress = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0;

  // Get color based on remaining time
  const getColor = () => {
    if (progress > 66) return { bg: 'bg-green-500', ring: 'ring-green-400', text: 'text-green-600' };
    if (progress > 33) return { bg: 'bg-yellow-500', ring: 'ring-yellow-400', text: 'text-yellow-600' };
    if (progress > 10) return { bg: 'bg-orange-500', ring: 'ring-orange-400', text: 'text-orange-600' };
    return { bg: 'bg-red-500', ring: 'ring-red-400', text: 'text-red-600' };
  };

  const colors = getColor();

  // Play sound
  const playSound = useCallback((type) => {
    if (!soundEnabled) return;
    
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      if (type === 'tick') {
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
      } else if (type === 'complete') {
        // Play a happy completion sound
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523, ctx.currentTime); // C5
        oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.15); // E5
        oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.3); // G5
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      console.error('Audio error:', e);
    }
  }, [soundEnabled]);

  // Timer logic
  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            playSound('complete');
            return 0;
          }
          // Tick sound in last 10 seconds
          if (prev <= 11) {
            playSound('tick');
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, playSound]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start/Pause
  const toggleTimer = () => {
    if (isComplete) {
      resetTimer();
      return;
    }
    setIsRunning(!isRunning);
  };

  // Reset
  const resetTimer = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
    setIsComplete(false);
  };

  // Set preset time
  const setPreset = (seconds) => {
    setTotalSeconds(seconds);
    setRemainingSeconds(seconds);
    setIsRunning(false);
    setIsComplete(false);
  };

  // Custom time adjustment
  const adjustTime = (delta) => {
    if (isRunning) return;
    const newTotal = Math.max(60, Math.min(3600, totalSeconds + delta));
    setTotalSeconds(newTotal);
    setRemainingSeconds(newTotal);
    setIsComplete(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E63B2E]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/tools')}
            className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#E63B2E] 
                       rounded-full font-crayon text-[#E63B2E] hover:bg-[#E63B2E] 
                       hover:text-white transition-all shadow-sm text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#E63B2E] crayon-text">
              ⏱️ Visual Timer
            </h1>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-full border-3 transition-all
              ${soundEnabled 
                ? 'bg-green-100 border-green-400 text-green-600' 
                : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Timer Display */}
        <div className="relative flex justify-center mb-8">
          {/* Background circle */}
          <div className="w-64 h-64 rounded-full bg-gray-200 relative overflow-hidden">
            {/* Progress fill - pie chart style */}
            <div 
              className={`absolute inset-0 ${colors.bg} transition-all duration-1000`}
              style={{
                clipPath: `polygon(50% 50%, 50% 0%, ${
                  progress > 87.5 ? '100% 0%, 100% 100%, 0% 100%, 0% 0%' :
                  progress > 62.5 ? '100% 0%, 100% 100%, 0% 100%, 0% ' + (100 - (progress - 62.5) * 4) + '%' :
                  progress > 37.5 ? '100% 0%, 100% 100%, ' + (100 - (progress - 37.5) * 4) + '% 100%' :
                  progress > 12.5 ? '100% 0%, 100% ' + (100 - (progress - 12.5) * 4) + '%' :
                  (50 + progress * 4) + '% 0%'
                })`,
              }}
            />
            
            {/* Center circle with time */}
            <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center shadow-inner">
              <div className="text-center">
                <span className={`text-5xl font-display ${colors.text}`}>
                  {formatTime(remainingSeconds)}
                </span>
                {isComplete && (
                  <p className="text-2xl mt-2 animate-bounce">🎉</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Complete message */}
        {isComplete && (
          <div className="mb-6 p-4 bg-green-100 rounded-2xl border-3 border-green-400 text-center">
            <p className="font-display text-green-700 text-xl">Time's Up! Great job! 🌟</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={resetTimer}
            className="p-4 bg-gray-200 text-gray-700 rounded-full border-3 border-gray-400
                     hover:bg-gray-300 transition-all"
          >
            <RotateCcw size={28} />
          </button>
          
          <button
            onClick={toggleTimer}
            className={`p-6 rounded-full border-4 text-white
                       hover:scale-110 transition-all shadow-lg
                       ${isRunning 
                         ? 'bg-orange-500 border-orange-600' 
                         : 'bg-green-500 border-green-600'
                       }`}
          >
            {isRunning ? <Pause size={36} /> : <Play size={36} className="ml-1" />}
          </button>
          
          {/* Time adjust buttons */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => adjustTime(60)}
              disabled={isRunning}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg border-2 border-blue-300
                       hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed
                       font-crayon text-sm"
            >
              +1m
            </button>
            <button
              onClick={() => adjustTime(-60)}
              disabled={isRunning || totalSeconds <= 60}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg border-2 border-blue-300
                       hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed
                       font-crayon text-sm"
            >
              -1m
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="bg-white rounded-2xl border-3 border-gray-300 p-4">
          <p className="font-crayon text-gray-600 text-sm mb-3 text-center">Quick Times:</p>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.seconds}
                onClick={() => setPreset(preset.seconds)}
                disabled={isRunning}
                className={`p-3 rounded-xl border-2 font-crayon transition-all
                  ${totalSeconds === preset.seconds && !isRunning
                    ? 'bg-blue-100 border-blue-400 text-blue-700' 
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:border-gray-400'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <span className="text-xl block">{preset.emoji}</span>
                <span className="text-sm">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-2xl border-3 border-yellow-300">
          <p className="text-center text-gray-600 font-crayon text-sm">
            💡 The timer changes color as time runs out - green → yellow → orange → red
          </p>
        </div>
      </main>
    </div>
  );
};

export default VisualTimer;
