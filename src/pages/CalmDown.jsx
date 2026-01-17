// CalmDown.jsx - Breathing exercises and calming activities
// NAVIGATION: Back button goes to /wellness (parent hub)
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, Heart } from 'lucide-react';

// Breathing patterns
const BREATHING_PATTERNS = [
  {
    id: 'balloon',
    name: 'Balloon Breathing',
    emoji: '🎈',
    color: '#E63B2E',
    inhale: 4,
    hold: 0,
    exhale: 4,
    description: 'Imagine blowing up a balloon',
  },
  {
    id: 'square',
    name: 'Square Breathing',
    emoji: '⬛',
    color: '#4A9FD4',
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfter: 4,
    description: 'Breathe in a square pattern',
  },
  {
    id: 'flower',
    name: 'Flower Breathing',
    emoji: '🌸',
    color: '#E86B9A',
    inhale: 4,
    hold: 1,
    exhale: 4,
    description: 'Smell the flower, blow the petals',
  },
  {
    id: 'bunny',
    name: 'Bunny Breathing',
    emoji: '🐰',
    color: '#F5A623',
    inhale: 1.5,
    inhale2: 1.5,
    inhale3: 1.5,
    exhale: 4,
    description: 'Three quick sniffs, long breath out',
  },
  {
    id: 'ocean',
    name: 'Ocean Breathing',
    emoji: '🌊',
    color: '#20B2AA',
    inhale: 5,
    hold: 2,
    exhale: 7,
    description: 'Waves in, waves out slowly',
  },
];

// Calming activities
const CALMING_ACTIVITIES = [
  { id: 'squeeze', name: 'Squeeze & Release', emoji: '✊', description: 'Make tight fists, then let go' },
  { id: 'stretch', name: 'Big Stretch', emoji: '🙆', description: 'Reach up high, then relax' },
  { id: 'wiggle', name: 'Shake It Out', emoji: '🤸', description: 'Wiggle your whole body' },
  { id: 'hug', name: 'Self Hug', emoji: '🤗', description: 'Give yourself a big squeeze' },
  { id: 'cold', name: 'Cold Water', emoji: '💧', description: 'Splash cold water on your face' },
  { id: 'ground', name: 'Feel the Ground', emoji: '🦶', description: 'Press feet firmly on floor' },
  { id: 'count', name: 'Count to 10', emoji: '🔢', description: 'Count slowly, breathe between' },
  { id: 'quiet', name: 'Quiet Spot', emoji: '🏠', description: 'Find a cozy, quiet place' },
  { id: 'music', name: 'Calm Music', emoji: '🎵', description: 'Listen to peaceful sounds' },
  { id: 'pet', name: 'Pet Something Soft', emoji: '🧸', description: 'Hug a stuffed animal' },
];

// Breathing Circle Component
const BreathingCircle = ({ phase, progress, pattern, isActive }) => {
  const getInstructions = () => {
    if (!isActive) return 'Press Start';
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'holdAfter': return 'Hold';
      default: return 'Ready';
    }
  };

  const getScale = () => {
    if (!isActive) return 1;
    if (phase === 'inhale') return 1 + (progress * 0.5);
    if (phase === 'exhale') return 1.5 - (progress * 0.5);
    return phase === 'hold' || phase === 'holdAfter' ? 1.5 : 1;
  };

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Outer ring */}
      <div 
        className="absolute inset-0 rounded-full border-8 transition-all duration-300"
        style={{ borderColor: pattern.color + '40' }}
      />
      
      {/* Animated circle */}
      <div 
        className="absolute inset-4 rounded-full flex items-center justify-center transition-transform"
        style={{ 
          backgroundColor: pattern.color + '30',
          transform: `scale(${getScale()})`,
          transitionDuration: isActive ? '100ms' : '300ms',
        }}
      >
        <div className="text-center">
          <span className="text-6xl block mb-2">{pattern.emoji}</span>
          <span 
            className="text-xl font-display"
            style={{ color: pattern.color }}
          >
            {getInstructions()}
          </span>
        </div>
      </div>
    </div>
  );
};

// Main Component
const CalmDown = () => {
  const navigate = useNavigate();
  const [selectedPattern, setSelectedPattern] = useState(BREATHING_PATTERNS[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('ready');
  const [progress, setProgress] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const timerRef = useRef(null);
  const phaseTimerRef = useRef(null);

  // Audio context for breathing sounds
  const playSound = (freq, duration) => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
      // Audio not supported
    }
  };

  // Breathing cycle logic
  useEffect(() => {
    if (!isActive) {
      clearInterval(timerRef.current);
      clearTimeout(phaseTimerRef.current);
      return;
    }

    const runPhase = (phaseName, duration) => {
      setPhase(phaseName);
      setProgress(0);
      
      if (phaseName === 'inhale') playSound(440, 200);
      else if (phaseName === 'exhale') playSound(330, 200);
      
      const steps = 20;
      const interval = (duration * 1000) / steps;
      let step = 0;
      
      timerRef.current = setInterval(() => {
        step++;
        setProgress(step / steps);
        if (step >= steps) {
          clearInterval(timerRef.current);
        }
      }, interval);

      return duration * 1000;
    };

    const cycle = async () => {
      // Inhale
      await new Promise(r => phaseTimerRef.current = setTimeout(r, runPhase('inhale', selectedPattern.inhale)));
      
      // Hold (if exists)
      if (selectedPattern.hold > 0) {
        await new Promise(r => phaseTimerRef.current = setTimeout(r, runPhase('hold', selectedPattern.hold)));
      }
      
      // Exhale
      await new Promise(r => phaseTimerRef.current = setTimeout(r, runPhase('exhale', selectedPattern.exhale)));
      
      // Hold after (if exists)
      if (selectedPattern.holdAfter) {
        await new Promise(r => phaseTimerRef.current = setTimeout(r, runPhase('holdAfter', selectedPattern.holdAfter)));
      }
      
      setCycles(c => c + 1);
      
      if (isActive) {
        cycle();
      }
    };

    cycle();

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(phaseTimerRef.current);
    };
  }, [isActive, selectedPattern]);

  const toggleBreathing = () => {
    if (isActive) {
      setIsActive(false);
      setPhase('ready');
      setProgress(0);
    } else {
      setIsActive(true);
    }
  };

  const reset = () => {
    setIsActive(false);
    setPhase('ready');
    setProgress(0);
    setCycles(0);
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#87CEEB]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* IMPORTANT: Back button goes to /wellness (parent hub) */}
          <button
            onClick={() => navigate('/wellness')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#87CEEB] 
                       rounded-xl font-display font-bold text-[#87CEEB] hover:bg-[#87CEEB] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#87CEEB] crayon-text">
              😌 Calm Down
            </h1>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            {soundEnabled ? <Volume2 size={22} className="text-gray-400" /> : <VolumeX size={22} className="text-gray-400" />}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Pattern Selection */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {BREATHING_PATTERNS.map(pattern => (
            <button
              key={pattern.id}
              onClick={() => { setSelectedPattern(pattern); reset(); }}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-crayon transition-all ${
                selectedPattern.id === pattern.id
                  ? 'text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              style={{ 
                backgroundColor: selectedPattern.id === pattern.id ? pattern.color : undefined,
                border: `2px solid ${pattern.color}`
              }}
            >
              {pattern.emoji} {pattern.name}
            </button>
          ))}
        </div>

        {/* Breathing Circle */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <BreathingCircle
            phase={phase}
            progress={progress}
            pattern={selectedPattern}
            isActive={isActive}
          />
          
          <p className="text-center font-crayon text-gray-500 mt-4">
            {selectedPattern.description}
          </p>

          {/* Controls */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={toggleBreathing}
              className={`px-8 py-4 rounded-xl font-display text-lg text-white flex items-center gap-2 shadow-lg ${
                isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isActive ? <Pause size={24} /> : <Play size={24} />}
              {isActive ? 'Stop' : 'Start'}
            </button>
            <button
              onClick={reset}
              className="px-4 py-4 rounded-xl bg-gray-200 hover:bg-gray-300"
            >
              <RotateCcw size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Cycles Counter */}
          {cycles > 0 && (
            <div className="text-center mt-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full text-pink-600 font-crayon">
                <Heart size={16} className="fill-pink-500" />
                {cycles} breath{cycles !== 1 ? 's' : ''} completed
              </span>
            </div>
          )}
        </div>

        {/* Calming Activities */}
        <div>
          <h2 className="font-display text-gray-700 mb-3">More Calming Ideas</h2>
          <div className="grid grid-cols-2 gap-3">
            {CALMING_ACTIVITIES.map(activity => (
              <div
                key={activity.id}
                className="p-3 bg-white rounded-xl border-2 border-gray-200 hover:border-[#87CEEB] transition-colors"
              >
                <span className="text-2xl block mb-1">{activity.emoji}</span>
                <h3 className="font-display text-sm text-gray-800">{activity.name}</h3>
                <p className="text-xs text-gray-500 font-crayon">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalmDown;
