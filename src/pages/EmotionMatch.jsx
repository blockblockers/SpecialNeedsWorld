// EmotionMatch.jsx - Match faces to emotions game
// Uses ARASAAC pictograms for emotion representation
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trophy, Star, Volume2 } from 'lucide-react';
import { getPictogramUrl, ARASAAC_ATTRIBUTION } from '../services/arasaac';

// Emotions with ARASAAC pictogram IDs and colors
const EMOTIONS = [
  { id: 'happy', arasaacId: 26684, word: 'Happy', color: '#F8D14A', description: 'feeling good and joyful' },
  { id: 'sad', arasaacId: 11321, word: 'Sad', color: '#4A9FD4', description: 'feeling unhappy or down' },
  { id: 'angry', arasaacId: 11318, word: 'Angry', color: '#E63B2E', description: 'feeling mad or upset' },
  { id: 'scared', arasaacId: 6459, word: 'Scared', color: '#8E6BBF', description: 'feeling afraid or worried' },
  { id: 'surprised', arasaacId: 11326, word: 'Surprised', color: '#F5A623', description: 'feeling amazed or shocked' },
  { id: 'tired', arasaacId: 11950, word: 'Tired', color: '#6B7280', description: 'feeling sleepy or worn out' },
  { id: 'excited', arasaacId: 11319, word: 'Excited', color: '#E86B9A', description: 'feeling very happy and eager' },
  { id: 'calm', arasaacId: 28753, word: 'Calm', color: '#5CB85C', description: 'feeling peaceful and relaxed' },
  { id: 'confused', arasaacId: 11322, word: 'Confused', color: '#9CA3AF', description: 'not sure what is happening' },
  { id: 'silly', arasaacId: 11330, word: 'Silly', color: '#EC4899', description: 'feeling playful and funny' },
  { id: 'proud', arasaacId: 11327, word: 'Proud', color: '#10B981', description: 'feeling good about yourself' },
  { id: 'loved', arasaacId: 26790, word: 'Loved', color: '#F472B6', description: 'feeling cared for and special' },
];

// Preload emotion images
const preloadImages = () => {
  EMOTIONS.forEach(emotion => {
    const img = new Image();
    img.src = getPictogramUrl(emotion.arasaacId);
  });
};

// Game modes
const MODES = {
  faceToWord: { label: 'Face → Word', instruction: 'Tap the word that matches the face!' },
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
            <button
              onClick={() => navigate('/games')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F5A623] 
                         rounded-xl font-display font-bold text-[#F5A623] hover:bg-[#F5A623] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-display text-[#F5A623] crayon-text flex items-center gap-2">
                <img 
                  src={getPictogramUrl(26684)} 
                  alt="Happy" 
                  className="w-7 h-7 object-contain"
                />
                Emotion Match
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
                      ? 'border-[#F5A623] bg-orange-50 text-[#F5A623]' 
                      : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                    }`}
                >
                  <span className="flex items-center justify-center gap-1 mb-1">
                    <img src={getPictogramUrl(26684)} alt="face" className="w-8 h-8" />
                    <span className="text-xl">→ ?</span>
                  </span>
                  <span className="text-sm">See Face</span>
                  <span className="block text-xs">Find Word</span>
                </button>
                <button
                  onClick={() => setMode('wordToFace')}
                  className={`p-4 rounded-xl border-3 font-crayon transition-all
                    ${mode === 'wordToFace' 
                      ? 'border-[#F5A623] bg-orange-50 text-[#F5A623]' 
                      : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                    }`}
                >
                  <span className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-xl">? →</span>
                    <span className="font-display text-sm">Happy</span>
                  </span>
                  <span className="text-sm">See Word</span>
                  <span className="block text-xs">Find Face</span>
                </button>
              </div>
            </div>

            {/* Emotion Preview */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <p className="font-crayon text-gray-600 text-sm mb-3 text-center">
                You'll learn these emotions:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {EMOTIONS.slice(0, 8).map(emotion => (
                  <span 
                    key={emotion.id}
                    className="text-2xl"
                    title={emotion.word}
                  >
                    {emotion.face}
                  </span>
                ))}
                <span className="text-gray-400">+{EMOTIONS.length - 8}</span>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startGame}
              className="w-full py-4 bg-[#5CB85C] text-white rounded-2xl border-4 border-green-600
                         font-display text-xl hover:scale-105 transition-transform shadow-crayon"
            >
              Let's Start! 🌟
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
            Amazing! 🎉
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
                className="text-8xl mb-4 animate-bounce"
                style={{ animationDuration: '2s' }}
              >
                {currentEmotion?.face}
              </div>
            </>
          ) : (
            <>
              <p className="font-crayon text-gray-600 mb-4">
                Find the face that shows:
              </p>
              <div 
                className="text-4xl font-display mb-4"
                style={{ color: currentEmotion?.color }}
              >
                {currentEmotion?.word}
              </div>
              <p className="text-sm text-gray-500 font-crayon">
                ({currentEmotion?.description})
              </p>
            </>
          )}
          
          {/* Sound button */}
          <button
            onClick={speakCurrent}
            className="mt-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            title="Hear it"
          >
            <Volume2 size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-3">
          {options.map((emotion) => {
            const isSelected = selectedAnswer === emotion.id;
            const isCorrect = emotion.id === currentEmotion?.id;
            const showCorrect = feedback && isCorrect;
            const showWrong = feedback === 'wrong' && isSelected;

            return (
              <button
                key={emotion.id}
                onClick={() => handleAnswer(emotion)}
                disabled={!!feedback}
                className={`
                  p-4 rounded-2xl border-4 transition-all duration-300
                  ${showCorrect 
                    ? 'border-[#5CB85C] bg-green-100 scale-105' 
                    : showWrong 
                      ? 'border-[#E63B2E] bg-red-100 shake' 
                      : 'border-gray-300 bg-white hover:border-[#F5A623] hover:scale-105'
                  }
                  ${feedback && !showCorrect && !showWrong ? 'opacity-50' : ''}
                `}
              >
                {mode === 'faceToWord' ? (
                  <>
                    <span 
                      className="block text-xl font-display"
                      style={{ color: emotion.color }}
                    >
                      {emotion.word}
                    </span>
                  </>
                ) : (
                  <span className="text-5xl">{emotion.face}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className={`
            mt-6 p-4 rounded-2xl text-center font-crayon text-lg
            ${feedback === 'correct' 
              ? 'bg-green-100 text-green-700 border-3 border-green-400' 
              : 'bg-red-100 text-red-700 border-3 border-red-400'
            }
          `}>
            {feedback === 'correct' ? (
              <>🎉 Yes! That's {currentEmotion?.word}!</>
            ) : (
              <>Try again! Look for {currentEmotion?.word}</>
            )}
          </div>
        )}
      </main>

      {/* Add shake animation */}
      <style>{`
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
