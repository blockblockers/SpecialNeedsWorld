// CalmDown.jsx - Breathing exercises and calming activities
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Heart } from 'lucide-react';

// Breathing patterns
const BREATHING_PATTERNS = [
  {
    id: 'balloon',
    name: 'Balloon Breath',
    emoji: '🎈',
    description: 'Blow up a balloon!',
    inhale: 4,
    hold: 0,
    exhale: 4,
    color: 'bg-red-400',
  },
  {
    id: 'square',
    name: 'Square Breath',
    emoji: '⬜',
    description: 'Breathe around a square',
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfter: 4,
    color: 'bg-blue-400',
  },
  {
    id: 'flower',
    name: 'Smell the Flower',
    emoji: '🌸',
    description: 'Smell the flower, blow the candle',
    inhale: 3,
    hold: 1,
    exhale: 5,
    color: 'bg-pink-400',
  },
  {
    id: 'bunny',
    name: 'Bunny Breath',
    emoji: '🐰',
    description: '3 quick sniffs, one long blow',
    inhale: 1,
    sniffs: 3,
    exhale: 4,
    color: 'bg-purple-400',
  },
];

// Calming activities
const CALMING_ACTIVITIES = [
  { emoji: '🤗', label: 'Give yourself a hug' },
  { emoji: '✋', label: 'Push your hands together' },
  { emoji: '👀', label: 'Find 5 blue things' },
  { emoji: '👂', label: 'Listen for 3 sounds' },
  { emoji: '🦶', label: 'Feel your feet on the floor' },
  { emoji: '💪', label: 'Squeeze and relax your muscles' },
  { emoji: '🌊', label: 'Imagine ocean waves' },
  { emoji: '⭐', label: 'Think of something happy' },
];

const CalmDown = () => {
  const navigate = useNavigate();
  const [selectedPattern, setSelectedPattern] = useState(BREATHING_PATTERNS[0]);
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale, holdAfter
  const [countdown, setCountdown] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showActivities, setShowActivities] = useState(false);
  const intervalRef = useRef(null);

  // Animation scale based on phase
  const getScale = () => {
    if (phase === 'inhale') return 1 + (1 - countdown / selectedPattern.inhale) * 0.5;
    if (phase === 'exhale') return 1.5 - (1 - countdown / selectedPattern.exhale) * 0.5;
    if (phase === 'hold' || phase === 'holdAfter') return phase === 'hold' ? 1.5 : 1;
    return 1;
  };

  // Play gentle sound
  const playSound = (frequency, duration) => {
    if (!soundEnabled) return;
    
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.error('Audio error:', e);
    }
  };

  // Breathing cycle logic
  useEffect(() => {
    if (!isBreathing) return;

    const runCycle = () => {
      let currentPhase = 'inhale';
      let currentCount = selectedPattern.inhale;
      
      setPhase('inhale');
      setCountdown(currentCount);
      playSound(440, 0.3);

      intervalRef.current = setInterval(() => {
        currentCount--;
        
        if (currentCount <= 0) {
          // Move to next phase
          if (currentPhase === 'inhale') {
            if (selectedPattern.hold > 0) {
              currentPhase = 'hold';
              currentCount = selectedPattern.hold;
              playSound(550, 0.2);
            } else {
              currentPhase = 'exhale';
              currentCount = selectedPattern.exhale;
              playSound(330, 0.3);
            }
          } else if (currentPhase === 'hold') {
            currentPhase = 'exhale';
            currentCount = selectedPattern.exhale;
            playSound(330, 0.3);
          } else if (currentPhase === 'exhale') {
            if (selectedPattern.holdAfter > 0) {
              currentPhase = 'holdAfter';
              currentCount = selectedPattern.holdAfter;
              playSound(550, 0.2);
            } else {
              // Cycle complete
              setCycles(c => c + 1);
              currentPhase = 'inhale';
              currentCount = selectedPattern.inhale;
              playSound(440, 0.3);
            }
          } else if (currentPhase === 'holdAfter') {
            // Cycle complete
            setCycles(c => c + 1);
            currentPhase = 'inhale';
            currentCount = selectedPattern.inhale;
            playSound(440, 0.3);
          }
          setPhase(currentPhase);
        }
        
        setCountdown(currentCount);
      }, 1000);
    };

    runCycle();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isBreathing, selectedPattern, soundEnabled]);

  // Start/Stop breathing
  const toggleBreathing = () => {
    if (isBreathing) {
      clearInterval(intervalRef.current);
      setPhase('ready');
      setCountdown(0);
    } else {
      setCycles(0);
    }
    setIsBreathing(!isBreathing);
  };

  // Get instruction text
  const getInstruction = () => {
    switch (phase) {
      case 'inhale': return 'Breathe IN... 🌬️';
      case 'hold': return 'Hold... ⏸️';
      case 'exhale': return 'Breathe OUT... 💨';
      case 'holdAfter': return 'Hold... ⏸️';
      default: return 'Tap to start';
    }
  };

  // Get background color based on phase
  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-blue-200 to-blue-300';
      case 'hold': return 'from-purple-200 to-purple-300';
      case 'exhale': return 'from-green-200 to-green-300';
      case 'holdAfter': return 'from-purple-200 to-purple-300';
      default: return 'from-gray-100 to-gray-200';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${getPhaseColor()} transition-all duration-1000`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b-4 border-[#4A9FD4]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/tools')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#4A9FD4] 
                       rounded-xl font-display font-bold text-[#4A9FD4] hover:bg-[#4A9FD4] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#4A9FD4] crayon-text">
              😌 Calm Down
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
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Pattern Selection */}
        {!isBreathing && (
          <div className="mb-6">
            <p className="text-center text-gray-600 font-crayon mb-3">Choose a breathing exercise:</p>
            <div className="grid grid-cols-2 gap-3">
              {BREATHING_PATTERNS.map(pattern => (
                <button
                  key={pattern.id}
                  onClick={() => setSelectedPattern(pattern)}
                  className={`p-4 rounded-2xl border-3 transition-all
                    ${selectedPattern.id === pattern.id 
                      ? `${pattern.color} border-gray-600 text-white scale-105` 
                      : 'bg-white border-gray-300 hover:border-gray-400'
                    }`}
                >
                  <span className="text-3xl block mb-1">{pattern.emoji}</span>
                  <span className="font-display text-sm">{pattern.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Breathing Circle */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Outer ring */}
            <div className={`
              w-64 h-64 rounded-full border-8 
              ${isBreathing ? selectedPattern.color : 'bg-gray-200'}
              flex items-center justify-center
              transition-all duration-500
            `}>
              {/* Animated breathing circle */}
              <div 
                className={`
                  rounded-full bg-white shadow-lg
                  flex items-center justify-center flex-col
                  transition-all duration-1000 ease-in-out
                `}
                style={{
                  width: `${getScale() * 120}px`,
                  height: `${getScale() * 120}px`,
                }}
              >
                <span className="text-5xl">{selectedPattern.emoji}</span>
                {isBreathing && (
                  <span className="text-2xl font-display text-gray-700 mt-1">
                    {countdown}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Instruction */}
        <div className="text-center mb-6">
          <p className={`
            font-display text-2xl transition-all
            ${phase === 'inhale' ? 'text-blue-600' : 
              phase === 'exhale' ? 'text-green-600' : 
              phase.includes('hold') ? 'text-purple-600' : 'text-gray-500'
            }
          `}>
            {getInstruction()}
          </p>
          {isBreathing && (
            <p className="font-crayon text-gray-500 mt-2">
              Cycles: {cycles} 🌟
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={toggleBreathing}
            className={`
              p-5 rounded-full border-4 text-white
              hover:scale-110 transition-all shadow-lg
              ${isBreathing 
                ? 'bg-orange-500 border-orange-600' 
                : 'bg-green-500 border-green-600'
              }
            `}
          >
            {isBreathing ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>
        </div>

        {/* Pattern info */}
        <div className="bg-white/80 rounded-2xl border-3 border-gray-300 p-4 mb-6">
          <h3 className="font-display text-gray-700 mb-2 flex items-center gap-2">
            {selectedPattern.emoji} {selectedPattern.name}
          </h3>
          <p className="font-crayon text-gray-600 text-sm mb-2">{selectedPattern.description}</p>
          <div className="flex gap-2 text-xs font-crayon">
            <span className="px-2 py-1 bg-blue-100 rounded-lg">In: {selectedPattern.inhale}s</span>
            {selectedPattern.hold > 0 && (
              <span className="px-2 py-1 bg-purple-100 rounded-lg">Hold: {selectedPattern.hold}s</span>
            )}
            <span className="px-2 py-1 bg-green-100 rounded-lg">Out: {selectedPattern.exhale}s</span>
          </div>
        </div>

        {/* Other Calming Activities */}
        <button
          onClick={() => setShowActivities(!showActivities)}
          className="w-full p-4 bg-white/80 rounded-2xl border-3 border-pink-300 mb-4
                   hover:border-pink-400 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-pink-600 flex items-center gap-2">
              <Heart size={20} />
              More Calming Ideas
            </span>
            <span className="text-pink-400">{showActivities ? '▲' : '▼'}</span>
          </div>
        </button>

        {showActivities && (
          <div className="bg-white/80 rounded-2xl border-3 border-pink-200 p-4">
            <div className="grid grid-cols-2 gap-3">
              {CALMING_ACTIVITIES.map((activity, index) => (
                <div 
                  key={index}
                  className="p-3 bg-pink-50 rounded-xl text-center"
                >
                  <span className="text-2xl block mb-1">{activity.emoji}</span>
                  <span className="font-crayon text-gray-600 text-xs">{activity.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CalmDown;
