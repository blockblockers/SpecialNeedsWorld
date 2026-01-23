// EmotionMatch.jsx - Emotion Recognition Game
// FIXED: Back button navigates to /activities (parent hub), not /games or main hub
// Game modes: Face → Word, Word → Face

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Volume2, 
  RotateCcw, 
  Star,
  Trophy,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { getPictogramUrl } from '../services/arasaac';

// Preload images function
const preloadImages = () => {
  EMOTIONS.forEach(emotion => {
    if (emotion.pictogramId) {
      const img = new Image();
      img.src = getPictogramUrl(emotion.pictogramId);
    }
  });
};

// Emotions with ARASAAC pictogram IDs
const EMOTIONS = [
  { 
    id: 'happy', 
    word: 'Happy', 
    emoji: '😊', 
    color: '#F8D14A', 
    bgColor: '#FEF9E7',
    pictogramId: 26684,
    examples: ['Smiling', 'Laughing', 'Excited']
  },
  { 
    id: 'sad', 
    word: 'Sad', 
    emoji: '😢', 
    color: '#4A9FD4', 
    bgColor: '#EBF5FB',
    pictogramId: 11321,
    examples: ['Crying', 'Frowning', 'Down']
  },
  { 
    id: 'angry', 
    word: 'Angry', 
    emoji: '😠', 
    color: '#E63B2E', 
    bgColor: '#FDEDEC',
    pictogramId: 26682,
    examples: ['Mad', 'Frustrated', 'Upset']
  },
  { 
    id: 'scared', 
    word: 'Scared', 
    emoji: '😨', 
    color: '#8E6BBF', 
    bgColor: '#F4ECF7',
    pictogramId: 26747,
    examples: ['Afraid', 'Worried', 'Nervous']
  },
  { 
    id: 'surprised', 
    word: 'Surprised', 
    emoji: '😲', 
    color: '#E86B9A', 
    bgColor: '#FDEBF0',
    pictogramId: 26688,
    examples: ['Shocked', 'Amazed', 'Startled']
  },
  { 
    id: 'disgusted', 
    word: 'Disgusted', 
    emoji: '🤢', 
    color: '#5CB85C', 
    bgColor: '#EAFAF1',
    pictogramId: 26686,
    examples: ['Grossed out', 'Yucky', 'Icky']
  },
  { 
    id: 'tired', 
    word: 'Tired', 
    emoji: '😴', 
    color: '#87CEEB', 
    bgColor: '#EBF5FB',
    pictogramId: 11950,
    examples: ['Sleepy', 'Exhausted', 'Worn out']
  },
  { 
    id: 'excited', 
    word: 'Excited', 
    emoji: '🤩', 
    color: '#F5A623', 
    bgColor: '#FEF5E7',
    pictogramId: 26684,
    examples: ['Thrilled', 'Eager', 'Pumped']
  },
];

// Game modes
const GAME_MODES = {
  faceToWord: { label: 'Face → Word', instruction: 'What is this face feeling? Tap the correct word!' },
  wordToFace: { label: 'Word → Face', instruction: 'Tap the face that matches the word!' },
};

const EmotionMatch = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('faceToWord');
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct', 'wrong', or null
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState([]);

  // Speak text (if supported)
  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Generate new question
  const generateQuestion = useCallback(() => {
    // Get emotions not yet answered
    const remaining = EMOTIONS.filter(e => !questionsAnswered.includes(e.id));
    
    if (remaining.length === 0) {
      setGameComplete(true);
      return;
    }

    // Pick random emotion from remaining
    const correct = remaining[Math.floor(Math.random() * remaining.length)];
    
    // Pick 3 random wrong answers
    const others = EMOTIONS.filter(e => e.id !== correct.id);
    const wrongAnswers = others.sort(() => Math.random() - 0.5).slice(0, 3);
    
    // Combine and shuffle
    const allOptions = [correct, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    setCurrentEmotion(correct);
    setOptions(allOptions);
    setFeedback(null);
    setSelectedAnswer(null);
  }, [questionsAnswered]);

  // Start game
  const startGame = useCallback(() => {
    setScore(0);
    setTotalQuestions(0);
    setQuestionsAnswered([]);
    setGameComplete(false);
    setGameStarted(true);
  }, []);

  // Preload images on mount
  useEffect(() => {
    preloadImages();
  }, []);

  // Initialize first question when game starts
  useEffect(() => {
    if (gameStarted && !gameComplete && !currentEmotion) {
      generateQuestion();
    }
  }, [gameStarted, gameComplete, currentEmotion, generateQuestion]);

  // Handle answer selection
  const handleAnswer = (emotion) => {
    if (feedback) return; // Already answered
    
    setSelectedAnswer(emotion.id);
    setTotalQuestions(prev => prev + 1);
    
    if (emotion.id === currentEmotion.id) {
      // Correct!
      setFeedback('correct');
      setScore(prev => prev + 1);
      speak('Great job!');
      
      setTimeout(() => {
        setQuestionsAnswered(prev => [...prev, currentEmotion.id]);
        setCurrentEmotion(null);
      }, 1500);
    } else {
      // Wrong
      setFeedback('wrong');
      speak(`That's ${emotion.word}. Try to find ${currentEmotion.word}.`);
      
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
      }, 2000);
    }
  };

  // Speak current emotion
  const speakCurrent = () => {
    if (currentEmotion) {
      if (mode === 'faceToWord') {
        speak(`This face is feeling... can you find the word?`);
      } else {
        speak(`Find the face that shows ${currentEmotion.word}`);
      }
    }
  };

  // Start screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            {/* FIXED: Navigate to /activities (parent hub) */}
            <button
              onClick={() => navigate('/activities')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F5A623] 
                         rounded-xl font-display font-bold text-[#F5A623] hover:bg-[#F5A623] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-display text-[#F5A623] crayon-text flex items-center gap-2">
                😊 Emotion Match
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl border-4 border-[#F5A623] p-6 shadow-crayon">
            <h2 className="text-2xl font-display text-center text-[#F5A623] mb-2">
              Learn Emotions!
            </h2>
            <p className="text-center text-gray-600 font-crayon mb-6">
              Match faces with feeling words
            </p>

            {/* Mode Selection */}
            <div className="mb-6">
              <label className="block font-crayon text-gray-700 mb-2">Game Type:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode('faceToWord')}
                  className={`p-4 rounded-xl border-3 font-crayon transition-all
                    ${mode === 'faceToWord' 
                      ? 'bg-[#F5A623] text-white border-[#F5A623]' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#F5A623]'
                    }`}
                >
                  <span className="text-2xl block mb-1">😊→📝</span>
                  Face → Word
                </button>
                <button
                  onClick={() => setMode('wordToFace')}
                  className={`p-4 rounded-xl border-3 font-crayon transition-all
                    ${mode === 'wordToFace' 
                      ? 'bg-[#F5A623] text-white border-[#F5A623]' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#F5A623]'
                    }`}
                >
                  <span className="text-2xl block mb-1">📝→😊</span>
                  Word → Face
                </button>
              </div>
            </div>

            {/* Preview of Emotions */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <p className="font-crayon text-sm text-gray-500 mb-2">You'll learn {EMOTIONS.length} emotions:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {EMOTIONS.map(e => (
                  <span key={e.id} className="text-2xl" title={e.word}>{e.emoji}</span>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startGame}
              className="w-full py-4 bg-[#5CB85C] text-white rounded-xl border-3 border-green-600
                         font-display text-lg hover:scale-105 transition-transform
                         flex items-center justify-center gap-2 shadow-md"
            >
              <Sparkles size={24} />
              Start Game!
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Game complete screen
  if (gameComplete) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;
    
    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border-4 border-[#F5A623] p-8 max-w-md w-full text-center shadow-crayon">
          <Trophy className="w-16 h-16 text-[#F8D14A] mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-display text-[#F5A623] mb-2">Amazing Job!</h2>
          
          {/* Stars */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map(n => (
              <Star 
                key={n}
                size={36} 
                className={n <= stars ? 'text-[#F8D14A] fill-[#F8D14A]' : 'text-gray-300'}
              />
            ))}
          </div>

          <p className="font-crayon text-gray-600 mb-2">
            You got <strong className="text-[#5CB85C]">{score}</strong> out of <strong>{totalQuestions}</strong>!
          </p>
          <p className="font-crayon text-gray-500 text-sm mb-6">
            You learned {EMOTIONS.length} different emotions!
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
            {/* FIXED: Navigate to /activities */}
            <button
              onClick={() => navigate('/activities')}
              className="flex-1 py-3 bg-[#4A9FD4] text-white rounded-xl border-3 border-blue-600
                         font-crayon hover:scale-105 transition-transform"
            >
              More Activities
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game screen
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setGameStarted(false)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F5A623] 
                       rounded-xl font-display font-bold text-[#F5A623] hover:bg-[#F5A623] 
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
              {questionsAnswered.length + 1}/{EMOTIONS.length}
            </span>
          </div>
        </div>
      </header>

      {/* Game Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Question Display */}
        <div className="bg-white rounded-3xl border-4 border-[#F5A623] p-6 mb-6 shadow-crayon text-center">
          {mode === 'faceToWord' ? (
            <>
              <p className="font-crayon text-gray-600 mb-4">
                What is this face feeling?
              </p>
              <div 
                className="w-32 h-32 mx-auto rounded-2xl flex items-center justify-center mb-4 border-4"
                style={{ 
                  backgroundColor: currentEmotion?.bgColor,
                  borderColor: currentEmotion?.color 
                }}
              >
                <span className="text-7xl">{currentEmotion?.emoji}</span>
              </div>
            </>
          ) : (
            <>
              <p className="font-crayon text-gray-600 mb-2">
                Find the face that shows:
              </p>
              <p 
                className="text-3xl font-display mb-4"
                style={{ color: currentEmotion?.color }}
              >
                {currentEmotion?.word}
              </p>
            </>
          )}
          
          {/* Speak button */}
          <button
            onClick={speakCurrent}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            title="Hear the question"
          >
            <Volume2 size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-3">
          {options.map(emotion => {
            const isSelected = selectedAnswer === emotion.id;
            const isCorrect = feedback && emotion.id === currentEmotion?.id;
            const isWrong = feedback === 'wrong' && isSelected;
            
            return (
              <button
                key={emotion.id}
                onClick={() => handleAnswer(emotion)}
                disabled={feedback !== null}
                className={`
                  p-4 rounded-2xl border-4 transition-all
                  ${isCorrect 
                    ? 'bg-green-100 border-green-500 scale-105 ring-4 ring-green-300' 
                    : isWrong
                      ? 'bg-red-100 border-red-500 shake'
                      : isSelected
                        ? 'border-gray-400 bg-gray-50'
                        : 'bg-white border-gray-200 hover:border-[#F5A623] hover:scale-105'
                  }
                  disabled:cursor-not-allowed
                `}
              >
                {mode === 'faceToWord' ? (
                  // Show words
                  <span 
                    className="font-display text-lg block"
                    style={{ color: isCorrect ? '#5CB85C' : isWrong ? '#E63B2E' : emotion.color }}
                  >
                    {emotion.word}
                  </span>
                ) : (
                  // Show faces
                  <span className="text-5xl block">{emotion.emoji}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className={`
            mt-6 p-4 rounded-xl text-center font-display
            ${feedback === 'correct' 
              ? 'bg-green-100 text-green-700 border-3 border-green-300' 
              : 'bg-red-100 text-red-700 border-3 border-red-300'
            }
          `}>
            {feedback === 'correct' ? (
              <span className="flex items-center justify-center gap-2">
                <Sparkles size={20} /> Great job! That's {currentEmotion?.word}!
              </span>
            ) : (
              <span>Try again! Look for {currentEmotion?.word}.</span>
            )}
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#F5A623] transition-all duration-500 rounded-full"
              style={{ width: `${(questionsAnswered.length / EMOTIONS.length) * 100}%` }}
            />
          </div>
          <p className="text-center font-crayon text-sm text-gray-500 mt-2">
            {questionsAnswered.length} of {EMOTIONS.length} emotions learned
          </p>
        </div>
      </main>

      {/* CSS for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default EmotionMatch;
