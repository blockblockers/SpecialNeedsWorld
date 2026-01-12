// PatternSequence.jsx - Memory pattern game (Simon Says style)
// Players watch a sequence of colors/sounds and repeat it
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trophy, Star, Play, Volume2, VolumeX } from 'lucide-react';

// Game colors with sounds
const GAME_BUTTONS = [
  { id: 0, color: 'bg-red-500', activeColor: 'bg-red-300', borderColor: 'border-red-700', name: 'Red', emoji: '🔴', frequency: 261.63 }, // C4
  { id: 1, color: 'bg-blue-500', activeColor: 'bg-blue-300', borderColor: 'border-blue-700', name: 'Blue', emoji: '🔵', frequency: 329.63 }, // E4
  { id: 2, color: 'bg-yellow-400', activeColor: 'bg-yellow-200', borderColor: 'border-yellow-600', name: 'Yellow', emoji: '🟡', frequency: 392.00 }, // G4
  { id: 3, color: 'bg-green-500', activeColor: 'bg-green-300', borderColor: 'border-green-700', name: 'Green', emoji: '🟢', frequency: 523.25 }, // C5
];

// Audio context for sounds
let audioContext = null;

const playTone = (frequency, duration = 300) => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (e) {
    console.log('Audio not available');
  }
};

const PatternSequence = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('menu'); // menu, watching, playing, success, gameover
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [activeButton, setActiveButton] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showingSequence, setShowingSequence] = useState(false);
  const [difficulty, setDifficulty] = useState('normal'); // easy, normal, hard
  const timeoutRef = useRef(null);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('snw_pattern_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Save high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snw_pattern_highscore', score.toString());
    }
  }, [score, highScore]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Get speed based on difficulty
  const getSpeed = useCallback(() => {
    switch (difficulty) {
      case 'easy': return 800;
      case 'hard': return 400;
      default: return 600;
    }
  }, [difficulty]);

  // Start new game
  const startGame = useCallback(() => {
    setScore(0);
    setLevel(1);
    setSequence([]);
    setPlayerSequence([]);
    setGameState('watching');
    
    // Start with first random button
    const firstButton = Math.floor(Math.random() * 4);
    setSequence([firstButton]);
    
    // Play the sequence after a short delay
    setTimeout(() => {
      playSequence([firstButton]);
    }, 500);
  }, []);

  // Play the sequence
  const playSequence = useCallback((seq) => {
    setShowingSequence(true);
    setPlayerSequence([]);
    
    let i = 0;
    const speed = getSpeed();
    
    const playNext = () => {
      if (i < seq.length) {
        const buttonId = seq[i];
        setActiveButton(buttonId);
        
        if (soundEnabled) {
          playTone(GAME_BUTTONS[buttonId].frequency, speed * 0.8);
        }
        
        timeoutRef.current = setTimeout(() => {
          setActiveButton(null);
          i++;
          
          timeoutRef.current = setTimeout(playNext, speed * 0.3);
        }, speed * 0.7);
      } else {
        setShowingSequence(false);
        setGameState('playing');
      }
    };
    
    playNext();
  }, [getSpeed, soundEnabled]);

  // Handle player button press
  const handleButtonPress = useCallback((buttonId) => {
    if (gameState !== 'playing' || showingSequence) return;
    
    // Visual feedback
    setActiveButton(buttonId);
    if (soundEnabled) {
      playTone(GAME_BUTTONS[buttonId].frequency);
    }
    
    setTimeout(() => setActiveButton(null), 200);
    
    // Check if correct
    const newPlayerSequence = [...playerSequence, buttonId];
    setPlayerSequence(newPlayerSequence);
    
    const currentIndex = newPlayerSequence.length - 1;
    
    if (sequence[currentIndex] !== buttonId) {
      // Wrong! Game over
      if (soundEnabled) {
        // Play error sound
        playTone(150, 500);
      }
      setGameState('gameover');
      return;
    }
    
    // Check if completed sequence
    if (newPlayerSequence.length === sequence.length) {
      // Success! Add to score and advance
      const pointsEarned = level * 10;
      setScore(prev => prev + pointsEarned);
      setLevel(prev => prev + 1);
      setGameState('success');
      
      // Show success briefly, then add new button and play
      setTimeout(() => {
        const newButton = Math.floor(Math.random() * 4);
        const newSequence = [...sequence, newButton];
        setSequence(newSequence);
        setGameState('watching');
        
        setTimeout(() => {
          playSequence(newSequence);
        }, 500);
      }, 1000);
    }
  }, [gameState, showingSequence, playerSequence, sequence, level, soundEnabled, playSequence]);

  // Menu screen
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/games')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                         rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-display text-[#8E6BBF] crayon-text">
                🎵 Pattern Sequence
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          {/* Game preview */}
          <div className="bg-white rounded-3xl border-4 border-[#8E6BBF] p-6 shadow-crayon mb-6">
            <div className="grid grid-cols-2 gap-3 mb-6">
              {GAME_BUTTONS.map((btn) => (
                <div
                  key={btn.id}
                  className={`${btn.color} ${btn.borderColor} aspect-square rounded-2xl border-4 
                             flex items-center justify-center text-4xl opacity-70`}
                >
                  {btn.emoji}
                </div>
              ))}
            </div>
            
            <p className="text-center text-gray-600 font-crayon">
              Watch the pattern, then repeat it!
            </p>
          </div>

          {/* High Score */}
          {highScore > 0 && (
            <div className="text-center mb-6">
              <p className="font-crayon text-gray-600">
                🏆 High Score: <span className="text-[#F5A623] font-display">{highScore}</span>
              </p>
            </div>
          )}

          {/* Difficulty Selection */}
          <div className="mb-6">
            <p className="font-crayon text-gray-600 text-center mb-3">Choose Difficulty:</p>
            <div className="flex gap-2 justify-center">
              {[
                { id: 'easy', label: '🐢 Easy', desc: 'Slow' },
                { id: 'normal', label: '🐇 Normal', desc: 'Medium' },
                { id: 'hard', label: '🚀 Hard', desc: 'Fast' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`px-4 py-2 rounded-xl font-crayon transition-all
                    ${difficulty === d.id 
                      ? 'bg-[#8E6BBF] text-white border-4 border-purple-700' 
                      : 'bg-white border-3 border-gray-300 hover:border-[#8E6BBF]'
                    }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-crayon transition-all
                ${soundEnabled 
                  ? 'bg-[#5CB85C] text-white' 
                  : 'bg-gray-200 text-gray-600'
                }`}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              Sound {soundEnabled ? 'On' : 'Off'}
            </button>
          </div>

          {/* Play Button */}
          <button
            onClick={startGame}
            className="w-full py-4 bg-[#5CB85C] text-white rounded-2xl font-display text-xl
                     border-4 border-green-600 shadow-crayon hover:bg-green-600 
                     hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            <Play size={28} fill="white" />
            Start Game
          </button>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-purple-50 rounded-2xl border-3 border-purple-200">
            <h3 className="font-display text-[#8E6BBF] mb-2">How to Play:</h3>
            <ul className="font-crayon text-sm text-gray-600 space-y-1">
              <li>👀 Watch the colors light up</li>
              <li>👆 Tap them in the same order</li>
              <li>📈 Each round adds one more!</li>
              <li>🎯 How far can you go?</li>
            </ul>
          </div>
        </main>
      </div>
    );
  }

  // Game Over screen
  if (gameState === 'gameover') {
    const stars = score >= 100 ? 3 : score >= 50 ? 2 : 1;
    const isNewHighScore = score === highScore && score > 0;

    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border-4 border-[#E86B9A] p-8 shadow-crayon text-center max-w-sm w-full">
          <div className="text-6xl mb-4">😅</div>
          <h2 className="text-2xl font-display text-[#E86B9A] mb-2">
            Game Over!
          </h2>
          
          {isNewHighScore && (
            <div className="bg-[#F5A623] text-white px-4 py-2 rounded-full font-display mb-4 inline-block animate-bounce">
              🎉 New High Score!
            </div>
          )}
          
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                size={36}
                className={star <= stars ? 'text-[#F8D14A] fill-[#F8D14A]' : 'text-gray-300'}
              />
            ))}
          </div>

          <div className="space-y-2 mb-6">
            <p className="font-display text-3xl text-[#5CB85C]">{score} points</p>
            <p className="font-crayon text-gray-600">Level reached: {level}</p>
            <p className="font-crayon text-gray-600">Sequence length: {sequence.length}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startGame}
              className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl border-3 border-green-600
                         font-display hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Try Again
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="flex-1 py-3 bg-[#8E6BBF] text-white rounded-xl border-3 border-purple-600
                         font-display hover:scale-105 transition-transform"
            >
              Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main game screen
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">
          <button
            onClick={() => setGameState('menu')}
            className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#8E6BBF] 
                       rounded-xl font-crayon text-[#8E6BBF] hover:bg-[#8E6BBF] 
                       hover:text-white transition-all"
          >
            <ArrowLeft size={16} />
            Menu
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="font-crayon text-xs text-gray-500">Level</p>
              <p className="font-display text-xl text-[#8E6BBF]">{level}</p>
            </div>
            <div className="text-center">
              <p className="font-crayon text-xs text-gray-500">Score</p>
              <p className="font-display text-xl text-[#5CB85C]">{score}</p>
            </div>
          </div>
          
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-full transition-all ${
              soundEnabled ? 'bg-[#5CB85C] text-white' : 'bg-gray-200 text-gray-500'
            }`}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Status message */}
        <div className="text-center mb-6">
          {gameState === 'watching' && (
            <div className="bg-[#F5A623] text-white px-6 py-3 rounded-full font-display text-lg inline-flex items-center gap-2 animate-pulse">
              👀 Watch carefully!
            </div>
          )}
          {gameState === 'playing' && (
            <div className="bg-[#4A9FD4] text-white px-6 py-3 rounded-full font-display text-lg inline-flex items-center gap-2">
              👆 Your turn! ({playerSequence.length}/{sequence.length})
            </div>
          )}
          {gameState === 'success' && (
            <div className="bg-[#5CB85C] text-white px-6 py-3 rounded-full font-display text-lg inline-flex items-center gap-2 animate-bounce">
              ✨ Great job! +{level * 10} points!
            </div>
          )}
        </div>

        {/* Game buttons */}
        <div className="bg-white rounded-3xl border-4 border-[#8E6BBF] p-4 sm:p-6 shadow-crayon">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {GAME_BUTTONS.map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleButtonPress(btn.id)}
                disabled={gameState !== 'playing' || showingSequence}
                className={`
                  aspect-square rounded-2xl sm:rounded-3xl border-4 ${btn.borderColor}
                  flex items-center justify-center text-4xl sm:text-5xl
                  transition-all duration-150 transform
                  ${activeButton === btn.id 
                    ? `${btn.activeColor} scale-95 shadow-inner` 
                    : `${btn.color} shadow-lg hover:scale-[1.02]`
                  }
                  ${gameState !== 'playing' ? 'cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                `}
              >
                {btn.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-6 flex justify-center gap-2 flex-wrap">
          {sequence.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index < playerSequence.length
                  ? 'bg-[#5CB85C] scale-110'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Hint */}
        <p className="text-center text-gray-400 font-crayon text-xs mt-6">
          {difficulty === 'easy' ? '🐢 Easy Mode' : difficulty === 'hard' ? '🚀 Hard Mode' : '🐇 Normal Mode'}
        </p>
      </main>
    </div>
  );
};

export default PatternSequence;
