// SoundMatch.jsx - Match sounds to pictures game
// UPDATED: Uses REAL audio files from Pixabay (royalty-free)
// Listen to a sound and tap the matching picture!

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trophy, Star, Volume2, VolumeX, Loader2 } from 'lucide-react';

// =====================================================
// REAL SOUND URLS - Free, royalty-free from Pixabay
// =====================================================
const SOUND_ITEMS = [
  { 
    id: 'dog', 
    emoji: '🐕', 
    name: 'Dog', 
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_942694ff27.mp3'
  },
  { 
    id: 'cat', 
    emoji: '🐱', 
    name: 'Cat', 
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_bfdca5a23a.mp3'
  },
  { 
    id: 'bird', 
    emoji: '🐦', 
    name: 'Bird', 
    url: 'https://cdn.pixabay.com/audio/2022/03/09/audio_6c143d19c6.mp3'
  },
  { 
    id: 'cow', 
    emoji: '🐄', 
    name: 'Cow', 
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_0689f2fc53.mp3'
  },
  { 
    id: 'rooster', 
    emoji: '🐓', 
    name: 'Rooster', 
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_215bb8f1e3.mp3'
  },
  { 
    id: 'horse', 
    emoji: '🐴', 
    name: 'Horse', 
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c518ad3d40.mp3'
  },
  { 
    id: 'sheep', 
    emoji: '🐑', 
    name: 'Sheep', 
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_80c7aa8b7e.mp3'
  },
  { 
    id: 'duck', 
    emoji: '🦆', 
    name: 'Duck', 
    url: 'https://cdn.pixabay.com/audio/2022/03/24/audio_18c169a30d.mp3'
  },
  { 
    id: 'bell', 
    emoji: '🔔', 
    name: 'Bell', 
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_85d4f65b72.mp3'
  },
  { 
    id: 'train', 
    emoji: '🚂', 
    name: 'Train', 
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_f5e1db0c64.mp3'
  },
  { 
    id: 'car', 
    emoji: '🚗', 
    name: 'Car Horn', 
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c7a0dd7f73.mp3'
  },
  { 
    id: 'applause', 
    emoji: '👏', 
    name: 'Applause', 
    url: 'https://cdn.pixabay.com/audio/2021/08/04/audio_c6ccbb5b5e.mp3'
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
  const [isLoading, setIsLoading] = useState(false);
  const [difficulty, setDifficulty] = useState('medium'); // easy (4), medium (8), hard (12)
  
  const audioRef = useRef(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Get items based on difficulty
  const getGameItems = useCallback(() => {
    const counts = { easy: 4, medium: 8, hard: 12 };
    const count = counts[difficulty] || 8;
    return SOUND_ITEMS.slice(0, count);
  }, [difficulty]);

  // Play a sound from URL
  const playSound = useCallback(async (item) => {
    if (!soundEnabled || !item?.url) return;
    
    // Stop any currently playing sound
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsLoading(true);

    try {
      const audio = new Audio(item.url);
      audio.volume = 0.7;
      
      audio.addEventListener('canplaythrough', () => {
        setIsLoading(false);
      }, { once: true });

      audio.addEventListener('error', () => {
        setIsLoading(false);
        console.error('Failed to load sound');
      });

      await audio.play();
      audioRef.current = audio;
    } catch (err) {
      console.error('Play error:', err);
      setIsLoading(false);
    }
  }, [soundEnabled]);

  // Play success sound
  const playSuccessSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/10/audio_06b9c3b9b3.mp3');
      audio.volume = 0.5;
      audio.play();
    } catch (e) {}
  }, [soundEnabled]);

  // Play error sound
  const playErrorSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/10/audio_a56c5e0b22.mp3');
      audio.volume = 0.5;
      audio.play();
    } catch (e) {}
  }, [soundEnabled]);

  // Generate new question
  const generateQuestion = useCallback(() => {
    const gameItems = getGameItems();
    const remaining = gameItems.filter(item => !questionsAnswered.includes(item.id));
    
    if (remaining.length === 0) {
      setGameComplete(true);
      return;
    }

    const correct = remaining[Math.floor(Math.random() * remaining.length)];
    const others = gameItems.filter(item => item.id !== correct.id);
    const wrongAnswers = others.sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [correct, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    setCurrentItem(correct);
    setOptions(allOptions);
    setFeedback(null);
    setSelectedAnswer(null);
    
    // Auto-play sound after a short delay
    setTimeout(() => playSound(correct), 500);
  }, [questionsAnswered, playSound, getGameItems]);

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
      playSuccessSound();
      
      setTimeout(() => {
        setQuestionsAnswered(prev => [...prev, currentItem.id]);
        setCurrentItem(null);
      }, 1500);
    } else {
      setFeedback('wrong');
      playErrorSound();
      // Replay correct sound
      setTimeout(() => playSound(currentItem), 500);
      
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
      }, 2500);
    }
  };

  // Replay current sound
  const replaySound = () => {
    if (currentItem) {
      playSound(currentItem);
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
            <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
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
              {SOUND_ITEMS.slice(0, 6).map(item => (
                <div key={item.id} className="text-3xl">
                  {item.emoji}
                </div>
              ))}
            </div>

            {/* Difficulty Selection */}
            <div className="mb-6">
              <p className="font-crayon text-gray-600 text-center mb-3">Choose difficulty:</p>
              <div className="flex gap-2 justify-center">
                {[
                  { id: 'easy', label: 'Easy', count: 4 },
                  { id: 'medium', label: 'Medium', count: 8 },
                  { id: 'hard', label: 'Hard', count: 12 },
                ].map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    className={`px-4 py-2 rounded-xl font-crayon transition-all
                      ${difficulty === d.id 
                        ? 'bg-[#8E6BBF] text-white scale-105' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
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
    const gameItems = getGameItems();
    const percentage = Math.round((score / gameItems.length) * 100);
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
            You got <strong className="text-[#5CB85C]">{score}</strong> out of <strong>{gameItems.length}</strong>!
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
  const gameItems = getGameItems();
  
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
              {questionsAnswered.length + 1}/{gameItems.length}
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
            disabled={isLoading}
            className="w-24 h-24 mx-auto rounded-full bg-[#8E6BBF] text-white 
                       flex items-center justify-center shadow-lg
                       hover:scale-110 active:scale-95 transition-transform
                       disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={40} className="animate-spin" />
            ) : (
              <Volume2 size={48} />
            )}
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
                      ? 'border-[#E63B2E] bg-red-100 animate-shake' 
                      : 'border-gray-300 bg-white hover:border-[#8E6BBF] hover:scale-105'
                  }
                  ${feedback && !showCorrect && !showWrong ? 'opacity-50' : ''}
                `}
              >
                <span className="text-5xl sm:text-6xl block mb-2">{item.emoji}</span>
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
              <>🔊 Listen again for the {currentItem?.name}!</>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SoundMatch;
