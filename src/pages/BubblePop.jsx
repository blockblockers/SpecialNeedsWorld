// BubblePop.jsx - Pop the bubbles game
// UPDATED: Added back button during gameplay to return to menu
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Star, Volume2, VolumeX, Home } from 'lucide-react';

// Bubble colors
const COLORS = [
  { bg: 'bg-red-400', border: 'border-red-500', glow: 'shadow-red-300' },
  { bg: 'bg-orange-400', border: 'border-orange-500', glow: 'shadow-orange-300' },
  { bg: 'bg-yellow-400', border: 'border-yellow-500', glow: 'shadow-yellow-300' },
  { bg: 'bg-green-400', border: 'border-green-500', glow: 'shadow-green-300' },
  { bg: 'bg-blue-400', border: 'border-blue-500', glow: 'shadow-blue-300' },
  { bg: 'bg-purple-400', border: 'border-purple-500', glow: 'shadow-purple-300' },
  { bg: 'bg-pink-400', border: 'border-pink-500', glow: 'shadow-pink-300' },
];

// Game durations
const DURATIONS = {
  short: { seconds: 30, label: '30 seconds' },
  medium: { seconds: 60, label: '1 minute' },
  long: { seconds: 90, label: '90 seconds' },
};

const BubblePop = () => {
  const navigate = useNavigate();
  const gameAreaRef = useRef(null);
  
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState('medium');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [poppedBubble, setPoppedBubble] = useState(null);

  // Play pop sound
  const playPopSound = useCallback(() => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // Audio not supported
    }
  }, [soundEnabled]);

  // Create a new bubble
  const createBubble = useCallback(() => {
    if (!gameAreaRef.current) return null;
    
    const area = gameAreaRef.current.getBoundingClientRect();
    const size = Math.random() * 50 + 50; // 50-100px (bigger bubbles)
    const x = Math.random() * (area.width - size);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const speed = Math.random() * 4 + 4; // 4-8 seconds to rise (much slower)
    
    return {
      id: Date.now() + Math.random(),
      x,
      y: area.height,
      size,
      color,
      speed,
      created: Date.now(),
    };
  }, []);

  // Start game
  const startGame = useCallback(() => {
    setScore(0);
    setBubbles([]);
    setTimeLeft(DURATIONS[duration].seconds);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
  }, [duration]);

  // Go back to menu
  const goToMenu = useCallback(() => {
    setGameStarted(false);
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    setBubbles([]);
    setTimeLeft(DURATIONS[duration].seconds);
  }, [duration]);

  // Pop a bubble
  const popBubble = useCallback((bubbleId) => {
    setBubbles(prev => prev.filter(b => b.id !== bubbleId));
    setScore(prev => prev + 1);
    setPoppedBubble(bubbleId);
    playPopSound();
    setTimeout(() => setPoppedBubble(null), 100);
  }, [playPopSound]);

  // Game timer
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, isPaused]);

  // Bubble spawner
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    const spawnInterval = setInterval(() => {
      const newBubble = createBubble();
      if (newBubble) {
        setBubbles(prev => [...prev, newBubble]);
      }
    }, 600); // Spawn a bubble every 600ms

    return () => clearInterval(spawnInterval);
  }, [gameStarted, gameOver, isPaused, createBubble]);

  // Remove old bubbles
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    const cleanupInterval = setInterval(() => {
      setBubbles(prev => prev.filter(b => 
        Date.now() - b.created < b.speed * 1000
      ));
    }, 500);

    return () => clearInterval(cleanupInterval);
  }, [gameStarted, gameOver, isPaused]);

  // Calculate bubble position
  const getBubblePosition = (bubble) => {
    const elapsed = (Date.now() - bubble.created) / 1000;
    const progress = elapsed / bubble.speed;
    const area = gameAreaRef.current?.getBoundingClientRect();
    const maxHeight = area?.height || 500;
    const bottom = progress * (maxHeight + bubble.size);
    const opacity = 1 - (progress * 0.5);
    return { bottom, opacity };
  };

  // Menu screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/games')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#5CB85C] 
                         rounded-xl font-display font-bold text-[#5CB85C] hover:bg-[#5CB85C] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <img 
              src="/logo.jpeg" 
              alt="ATLASassist" 
              className="w-10 h-10 rounded-lg shadow-sm"
            />
            <h1 className="text-lg sm:text-xl font-display text-[#5CB85C] crayon-text">
              🫧 Pop the Bubbles
            </h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl border-4 border-[#5CB85C] p-6 shadow-crayon">
            <h2 className="text-2xl font-display text-center text-[#5CB85C] mb-6">
              Pop the Bubbles! 🫧
            </h2>

            {/* Duration Selection */}
            <div className="mb-6">
              <p className="font-crayon text-gray-600 mb-3 text-center">How long do you want to play?</p>
              <div className="flex gap-2 justify-center">
                {Object.entries(DURATIONS).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setDuration(key)}
                    className={`px-4 py-2 rounded-xl font-crayon transition-all
                      ${duration === key 
                        ? 'bg-[#5CB85C] text-white border-4 border-green-600' 
                        : 'bg-gray-100 text-gray-600 border-4 border-gray-200 hover:border-[#5CB85C]'
                      }`}
                  >
                    {value.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Toggle */}
            <div className="mb-6 flex justify-center">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-4 rounded-xl border-4 transition-all
                  ${soundEnabled 
                    ? 'border-[#5CB85C] bg-green-50 text-[#5CB85C]' 
                    : 'border-gray-300 bg-gray-50 text-gray-400'
                  }`}
              >
                {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </button>
            </div>

            {/* Bubble Preview */}
            <div className="mb-6 flex justify-center gap-2">
              {COLORS.map((color, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full ${color.bg} ${color.border} border-2 animate-bounce`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>

            {/* Start Button */}
            <button
              onClick={startGame}
              className="w-full py-4 bg-[#5CB85C] text-white rounded-2xl border-4 border-green-600
                         font-display text-xl hover:scale-105 transition-transform shadow-crayon
                         flex items-center justify-center gap-2"
            >
              <Play size={24} />
              Start Popping!
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Game over screen
  if (gameOver) {
    const stars = score >= 50 ? 3 : score >= 30 ? 2 : 1;

    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border-4 border-[#F8D14A] p-8 shadow-crayon text-center max-w-sm">
          <Trophy className="w-20 h-20 text-[#F8D14A] mx-auto mb-4 animate-bounce" />
          <h2 className="text-3xl font-display text-[#5CB85C] mb-4">
            Time's Up! 🎉
          </h2>
          
          {/* Stars */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                size={40}
                className={star <= stars ? 'text-[#F8D14A] fill-[#F8D14A]' : 'text-gray-300'}
              />
            ))}
          </div>

          <p className="font-crayon text-gray-600 mb-6">
            You popped <strong className="text-[#4A9FD4] text-3xl">{score}</strong> bubbles!
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-3 bg-[#5CB85C] text-white rounded-xl 
                         font-crayon hover:scale-105 transition-transform"
            >
              <RotateCcw size={20} />
              Play Again
            </button>
            <button
              onClick={goToMenu}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl 
                         font-crayon hover:scale-105 transition-transform"
            >
              <Home size={20} />
              Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active gameplay
  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-sky-100 to-sky-200 overflow-hidden">
      {/* Game Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b-4 border-[#5CB85C] px-4 py-2 flex items-center justify-between z-20">
        {/* Back Button - NEW */}
        <button
          onClick={goToMenu}
          className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-gray-300 
                     rounded-xl font-display text-gray-600 hover:border-[#5CB85C] 
                     hover:text-[#5CB85C] transition-all shadow-sm"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Menu</span>
        </button>

        {/* Timer and Score */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <span className="block text-xs text-gray-500 font-crayon">TIME</span>
            <span className={`text-2xl font-display ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-800'}`}>
              {timeLeft}
            </span>
          </div>
          <div className="text-center">
            <span className="block text-xs text-gray-500 font-crayon">SCORE</span>
            <span className="text-2xl font-display text-[#5CB85C]">{score}</span>
          </div>
        </div>

        {/* Pause and Sound */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 bg-white border-3 border-[#5CB85C] rounded-full"
          >
            {isPaused ? <Play size={20} className="text-[#5CB85C]" /> : <Pause size={20} className="text-[#5CB85C]" />}
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-white border-3 border-gray-300 rounded-full"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </header>

      {/* Game Area */}
      <div 
        ref={gameAreaRef}
        className="flex-1 relative overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
            <div className="bg-white rounded-3xl p-8 text-center">
              <h2 className="text-2xl font-display text-gray-800 mb-4">Paused</h2>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-8 py-3 bg-[#5CB85C] text-white rounded-xl font-crayon
                             hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                >
                  <Play size={20} />
                  Resume
                </button>
                <button
                  onClick={goToMenu}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-crayon
                             hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                >
                  <Home size={20} />
                  Exit to Menu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bubbles */}
        {bubbles.map(bubble => {
          const { bottom, opacity } = getBubblePosition(bubble);
          
          return (
            <button
              key={bubble.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                popBubble(bubble.id);
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                popBubble(bubble.id);
              }}
              className={`
                absolute rounded-full border-4 
                ${bubble.color.bg} ${bubble.color.border}
                transition-transform duration-100
                hover:scale-110 active:scale-90
                shadow-lg ${bubble.color.glow}
                cursor-pointer
              `}
              style={{
                width: bubble.size,
                height: bubble.size,
                left: bubble.x,
                bottom: bottom,
                opacity: isPaused ? 0.5 : opacity,
                transform: poppedBubble === bubble.id ? 'scale(0)' : 'scale(1)',
              }}
            >
              {/* Bubble shine */}
              <div className="absolute top-2 left-2 w-3 h-3 bg-white/50 rounded-full" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BubblePop;
