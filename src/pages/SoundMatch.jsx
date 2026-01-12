// SoundMatch.jsx - Match sounds to pictures game
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trophy, Star, Volume2, VolumeX } from 'lucide-react';

// Sound categories with Web Audio synthesis
const SOUND_ITEMS = [
  { 
    id: 'dog', 
    emoji: '🐕', 
    name: 'Dog', 
    sound: { type: 'bark', freq: 400, duration: 0.3 }
  },
  { 
    id: 'cat', 
    emoji: '🐱', 
    name: 'Cat', 
    sound: { type: 'meow', freq: 600, duration: 0.4 }
  },
  { 
    id: 'bird', 
    emoji: '🐦', 
    name: 'Bird', 
    sound: { type: 'chirp', freq: 1200, duration: 0.2 }
  },
  { 
    id: 'cow', 
    emoji: '🐄', 
    name: 'Cow', 
    sound: { type: 'moo', freq: 150, duration: 0.6 }
  },
  { 
    id: 'bell', 
    emoji: '🔔', 
    name: 'Bell', 
    sound: { type: 'bell', freq: 800, duration: 0.5 }
  },
  { 
    id: 'drum', 
    emoji: '🥁', 
    name: 'Drum', 
    sound: { type: 'drum', freq: 100, duration: 0.2 }
  },
  { 
    id: 'whistle', 
    emoji: '📯', 
    name: 'Whistle', 
    sound: { type: 'whistle', freq: 1000, duration: 0.4 }
  },
  { 
    id: 'horn', 
    emoji: '📢', 
    name: 'Horn', 
    sound: { type: 'horn', freq: 300, duration: 0.5 }
  },
];

const SoundMatch = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioContext, setAudioContext] = useState(null);

  // Initialize audio context
  useEffect(() => {
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioContext]);

  // Play a synthesized sound
  const playSound = useCallback((soundConfig) => {
    if (!soundEnabled) return;
    
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(ctx);
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      const { type, freq, duration } = soundConfig;
      
      // Different sound types
      switch (type) {
        case 'bark':
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + duration);
          break;
        case 'meow':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + duration);
          break;
        case 'chirp':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
          oscillator.frequency.setValueAtTime(freq * 1.5, ctx.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(freq, ctx.currentTime + 0.2);
          break;
        case 'moo':
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
          oscillator.frequency.linearRampToValueAtTime(freq * 1.2, ctx.currentTime + duration / 2);
          oscillator.frequency.linearRampToValueAtTime(freq, ctx.currentTime + duration);
          break;
        case 'bell':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
          gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
          break;
        case 'drum':
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + duration);
          break;
        case 'whistle':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
          oscillator.frequency.linearRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);
          break;
        case 'horn':
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
          break;
        default:
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
      }
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      if (type !== 'bell') {
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      }
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.error('Audio error:', e);
    }
  }, [soundEnabled]);

  // Generate new question
  const generateQuestion = useCallback(() => {
    const remaining = SOUND_ITEMS.filter(item => !questionsAnswered.includes(item.id));
    
    if (remaining.length === 0) {
      setGameComplete(true);
      return;
    }

    const correct = remaining[Math.floor(Math.random() * remaining.length)];
    const others = SOUND_ITEMS.filter(item => item.id !== correct.id);
    const wrongAnswers = others.sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [correct, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    setCurrentItem(correct);
    setOptions(allOptions);
    setFeedback(null);
    setSelectedAnswer(null);
    
    // Auto-play sound after a short delay
    setTimeout(() => playSound(correct.sound), 500);
  }, [questionsAnswered, playSound]);

  // Start game
  const startGame = useCallback(() => {
    setScore(0);
    setTotalQuestions(0);
    setQuestionsAnswered([]);
    setGameComplete(false);
    setGameStarted(true);
    setCurrentItem(null);
  }, []);

  // Initialize first question
  useEffect(() => {
    if (gameStarted && !gameComplete && !currentItem) {
      generateQuestion();
    }
  }, [gameStarted, gameComplete, currentItem, generateQuestion]);

  // Handle answer
  const handleAnswer = (item) => {
    if (feedback) return;
    
    setSelectedAnswer(item.id);
    setTotalQuestions(prev => prev + 1);
    
    if (item.id === currentItem.id) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      
      setTimeout(() => {
        setQuestionsAnswered(prev => [...prev, currentItem.id]);
        setCurrentItem(null);
      }, 1500);
    } else {
      setFeedback('wrong');
      playSound(currentItem.sound); // Replay correct sound
      
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
      }, 2000);
    }
  };

  // Replay current sound
  const replaySound = () => {
    if (currentItem) {
      playSound(currentItem.sound);
    }
  };

  // Start screen
  if (!gameStarted) {
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
                🎵 Sound Match
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl border-4 border-[#8E6BBF] p-6 shadow-crayon">
            <h2 className="text-2xl font-display text-center text-[#8E6BBF] mb-2">
              Match the Sound! 🔊
            </h2>
            <p className="text-center text-gray-600 font-crayon mb-6">
              Listen to the sound and tap the matching picture!
            </p>

            {/* Preview */}
            <div className="mb-6 flex justify-center gap-3 flex-wrap">
              {SOUND_ITEMS.slice(0, 4).map(item => (
                <div
                  key={item.id}
                  className="text-4xl"
                >
                  {item.emoji}
                </div>
              ))}
            </div>

            {/* Sound Toggle */}
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="font-crayon text-gray-600">Sound:</span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-3 rounded-xl border-3 transition-all
                  ${soundEnabled 
                    ? 'border-[#5CB85C] bg-green-50 text-[#5CB85C]' 
                    : 'border-gray-300 bg-gray-50 text-gray-400'
                  }`}
              >
                {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </button>
            </div>

            <button
              onClick={startGame}
              className="w-full py-4 bg-[#5CB85C] text-white rounded-2xl border-4 border-green-600
                         font-display text-xl hover:scale-105 transition-transform shadow-crayon"
            >
              Start Listening! 🎧
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Game complete screen
  if (gameComplete) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : 1;

    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border-4 border-[#F8D14A] p-8 shadow-crayon text-center max-w-sm">
          <Trophy className="w-20 h-20 text-[#F8D14A] mx-auto mb-4 animate-bounce" />
          <h2 className="text-3xl font-display text-[#5CB85C] mb-4">
            Great Listening! 🎉
          </h2>
          
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
            You got <strong className="text-[#5CB85C]">{score}</strong> out of <strong>{totalQuestions}</strong>!
          </p>

          <div className="flex gap-3">
            <button
              onClick={startGame}
              className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl border-3 border-green-600
                         font-crayon hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Play Again
            </button>
            <button
              onClick={() => navigate('/games')}
              className="flex-1 py-3 bg-[#4A9FD4] text-white rounded-xl border-3 border-blue-600
                         font-crayon hover:scale-105 transition-transform"
            >
              More Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game screen
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-2xl mx-auto px-4 py-2 flex items-center gap-3">
          <button
            onClick={() => setGameStarted(false)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                       rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Menu
          </button>
          <div className="flex-1 text-center">
            <span className="font-crayon text-gray-600">
              Score: <strong className="text-[#5CB85C]">{score}</strong>
            </span>
            <span className="mx-3">|</span>
            <span className="font-crayon text-gray-600">
              {questionsAnswered.length + 1}/{SOUND_ITEMS.length}
            </span>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-white border-3 border-gray-300 rounded-full"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Sound Player */}
        <div className="bg-white rounded-3xl border-4 border-[#8E6BBF] p-6 mb-6 shadow-crayon text-center">
          <p className="font-crayon text-gray-600 mb-4">
            What makes this sound?
          </p>
          
          <button
            onClick={replaySound}
            className="w-24 h-24 mx-auto rounded-full bg-[#8E6BBF] text-white 
                       flex items-center justify-center shadow-lg
                       hover:scale-110 active:scale-95 transition-transform"
          >
            <Volume2 size={48} />
          </button>
          
          <p className="font-crayon text-gray-400 text-sm mt-4">
            Tap to hear again 🔊
          </p>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-4">
          {options.map((item) => {
            const isSelected = selectedAnswer === item.id;
            const isCorrect = item.id === currentItem?.id;
            const showCorrect = feedback && isCorrect;
            const showWrong = feedback === 'wrong' && isSelected;

            return (
              <button
                key={item.id}
                onClick={() => handleAnswer(item)}
                disabled={!!feedback}
                className={`
                  p-6 rounded-2xl border-4 transition-all duration-300
                  ${showCorrect 
                    ? 'border-[#5CB85C] bg-green-100 scale-105' 
                    : showWrong 
                      ? 'border-[#E63B2E] bg-red-100' 
                      : 'border-gray-300 bg-white hover:border-[#8E6BBF] hover:scale-105'
                  }
                  ${feedback && !showCorrect && !showWrong ? 'opacity-50' : ''}
                `}
              >
                <span className="text-6xl block mb-2">{item.emoji}</span>
                <span className="font-crayon text-gray-700">{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`
            mt-6 p-4 rounded-2xl text-center font-crayon text-lg
            ${feedback === 'correct' 
              ? 'bg-green-100 text-green-700 border-3 border-green-400' 
              : 'bg-red-100 text-red-700 border-3 border-red-400'
            }
          `}>
            {feedback === 'correct' ? (
              <>🎉 Yes! That's a {currentItem?.name}!</>
            ) : (
              <>Listen again for the {currentItem?.name}!</>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SoundMatch;
