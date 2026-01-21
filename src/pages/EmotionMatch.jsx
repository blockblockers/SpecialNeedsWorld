// EmotionMatch.jsx - Match faces to emotions game with realistic AI-generated expressions
// UPDATED: Uses Replicate-generated realistic faces stored in shared Supabase library
// Users can click "More Expressions" to generate new faces for everyone

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  RotateCcw, 
  Trophy, 
  Star, 
  Volume2, 
  RefreshCw,
  Loader2,
  AlertCircle,
  ImagePlus,
  Library,
  Sparkles
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { useToast } from '../components/ThemedToast';

// Emotions with colors and descriptions
const EMOTIONS = [
  { id: 'happy', word: 'Happy', color: '#F8D14A', description: 'feeling good and joyful', emoji: '😊' },
  { id: 'sad', word: 'Sad', color: '#4A9FD4', description: 'feeling unhappy or down', emoji: '😢' },
  { id: 'angry', word: 'Angry', color: '#E63B2E', description: 'feeling mad or upset', emoji: '😠' },
  { id: 'scared', word: 'Scared', color: '#8E6BBF', description: 'feeling afraid or worried', emoji: '😨' },
  { id: 'surprised', word: 'Surprised', color: '#F5A623', description: 'feeling amazed or shocked', emoji: '😲' },
  { id: 'tired', word: 'Tired', color: '#6B7280', description: 'feeling sleepy or worn out', emoji: '😴' },
  { id: 'excited', word: 'Excited', color: '#E86B9A', description: 'feeling very happy and eager', emoji: '🤩' },
  { id: 'calm', word: 'Calm', color: '#5CB85C', description: 'feeling peaceful and relaxed', emoji: '😌' },
  { id: 'confused', word: 'Confused', color: '#9CA3AF', description: 'not sure what is happening', emoji: '😕' },
  { id: 'proud', word: 'Proud', color: '#10B981', description: 'feeling good about yourself', emoji: '😤' },
  { id: 'shy', word: 'Shy', color: '#EC4899', description: 'feeling bashful or modest', emoji: '🙈' },
  { id: 'disgusted', word: 'Disgusted', color: '#78716C', description: 'feeling grossed out', emoji: '🤢' },
];

// Fallback emoji faces if no images available
const FALLBACK_FACES = EMOTIONS.reduce((acc, e) => {
  acc[e.id] = e.emoji;
  return acc;
}, {});

// Game modes
const MODES = {
  faceToWord: { label: 'Face → Word', instruction: 'Tap the word that matches the face!' },
  wordToFace: { label: 'Word → Face', instruction: 'Tap the face that matches the word!' },
};

const EmotionMatch = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // Game state
  const [mode, setMode] = useState('faceToWord');
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState([]);
  
  // Expression library state
  const [expressionLibrary, setExpressionLibrary] = useState({});
  const [loadingExpressions, setLoadingExpressions] = useState(false);
  const [generatingNew, setGeneratingNew] = useState(false);
  const [libraryStats, setLibraryStats] = useState({ total: 0, byEmotion: {} });
  const [showLibrary, setShowLibrary] = useState(false);
  const [creditError, setCreditError] = useState(null);

  // Load expressions from database
  const loadExpressions = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using fallback emojis');
      return;
    }

    setLoadingExpressions(true);
    try {
      const { data, error } = await supabase
        .from('emotion_expressions')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by emotion
      const grouped = {};
      const stats = { total: data?.length || 0, byEmotion: {} };
      
      data?.forEach(expr => {
        if (!grouped[expr.emotion]) {
          grouped[expr.emotion] = [];
        }
        grouped[expr.emotion].push(expr);
        stats.byEmotion[expr.emotion] = (stats.byEmotion[expr.emotion] || 0) + 1;
      });

      setExpressionLibrary(grouped);
      setLibraryStats(stats);
      console.log(`Loaded ${stats.total} expressions from library`);
    } catch (error) {
      console.error('Error loading expressions:', error);
    } finally {
      setLoadingExpressions(false);
    }
  }, []);

  // Load expressions on mount
  useEffect(() => {
    loadExpressions();
  }, [loadExpressions]);

  // Generate new expression
  const generateNewExpression = async (emotion) => {
    if (!isSupabaseConfigured()) {
      toast.error('Not Available', 'Cloud features require login');
      return null;
    }

    setCreditError(null);
    setGeneratingNew(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-emotion-face', {
        body: { emotion, saveToLibrary: true },
      });

      if (error) throw error;

      if (data.error === 'INSUFFICIENT_CREDITS') {
        setCreditError(data.message);
        toast.error('No Credits Available', 'Unable to generate new expressions. Please contact administrator.');
        return null;
      }

      if (data.imageUrl) {
        // Add to local library
        setExpressionLibrary(prev => ({
          ...prev,
          [emotion]: [
            { id: data.expressionId, emotion, image_url: data.imageUrl, use_count: 0 },
            ...(prev[emotion] || []),
          ],
        }));
        
        setLibraryStats(prev => ({
          total: prev.total + 1,
          byEmotion: {
            ...prev.byEmotion,
            [emotion]: (prev.byEmotion[emotion] || 0) + 1,
          },
        }));

        toast.success('New Expression Added!', `Generated a new ${emotion} face for everyone to use.`);
        return data.imageUrl;
      }
    } catch (error) {
      console.error('Error generating expression:', error);
      
      if (error.message?.includes('credit') || error.message?.includes('402')) {
        setCreditError('API credits exhausted. Please contact administrator.');
        toast.error('No Credits Available', 'Unable to generate new expressions.');
      } else {
        toast.error('Generation Failed', 'Could not generate new expression. Please try again.');
      }
    } finally {
      setGeneratingNew(false);
    }

    return null;
  };

  // Get random image for emotion
  const getRandomImage = useCallback((emotion) => {
    const images = expressionLibrary[emotion];
    if (images && images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length);
      return images[randomIndex];
    }
    return null;
  }, [expressionLibrary]);

  // Speak text
  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Generate new question
  const generateQuestion = useCallback(() => {
    const remaining = EMOTIONS.filter(e => !questionsAnswered.includes(e.id));
    
    if (remaining.length === 0) {
      setGameComplete(true);
      return;
    }

    // Pick random emotion
    const correct = remaining[Math.floor(Math.random() * remaining.length)];
    
    // Get image for this emotion
    const imageData = getRandomImage(correct.id);
    
    // Pick 3 random wrong answers
    const others = EMOTIONS.filter(e => e.id !== correct.id);
    const wrongAnswers = others.sort(() => Math.random() - 0.5).slice(0, 3);
    
    // For wordToFace mode, get images for wrong answers too
    const optionsWithImages = [correct, ...wrongAnswers].map(e => ({
      ...e,
      imageData: e.id === correct.id ? imageData : getRandomImage(e.id),
    })).sort(() => Math.random() - 0.5);
    
    setCurrentEmotion(correct);
    setCurrentImage(imageData);
    setOptions(optionsWithImages);
    setFeedback(null);
    setSelectedAnswer(null);
  }, [questionsAnswered, getRandomImage]);

  // Start game
  const startGame = useCallback(() => {
    setScore(0);
    setTotalQuestions(0);
    setQuestionsAnswered([]);
    setGameComplete(false);
    setGameStarted(true);
  }, []);

  // Initialize question when game starts
  useEffect(() => {
    if (gameStarted && !gameComplete && !currentEmotion) {
      generateQuestion();
    }
  }, [gameStarted, gameComplete, currentEmotion, generateQuestion]);

  // Handle answer
  const handleAnswer = (emotion) => {
    if (feedback) return;
    
    setSelectedAnswer(emotion.id);
    setTotalQuestions(prev => prev + 1);
    
    if (emotion.id === currentEmotion.id) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      speak('Great job!');
      
      // Increment use count if we have an image
      if (currentImage?.id) {
        supabase.rpc('increment_expression_use', { p_expression_id: currentImage.id }).catch(() => {});
      }
      
      setTimeout(() => {
        setQuestionsAnswered(prev => [...prev, currentEmotion.id]);
        setCurrentEmotion(null);
        setCurrentImage(null);
      }, 1500);
    } else {
      setFeedback('wrong');
      speak(`That's ${emotion.word}. Try to find ${currentEmotion.word}.`);
      
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
      }, 2000);
    }
  };

  // Render face image or fallback
  const renderFace = (emotion, imageData, size = 'large') => {
    const sizeClasses = size === 'large' 
      ? 'w-48 h-48 text-8xl' 
      : 'w-20 h-20 text-4xl';
    
    if (imageData?.image_url) {
      return (
        <img 
          src={imageData.image_url} 
          alt={`${emotion} face`}
          className={`${sizeClasses} object-cover rounded-2xl shadow-lg`}
        />
      );
    }
    
    // Fallback to emoji
    const emotionData = EMOTIONS.find(e => e.id === emotion);
    return (
      <div className={`${sizeClasses} flex items-center justify-center bg-gray-100 rounded-2xl`}>
        {emotionData?.emoji || '😐'}
      </div>
    );
  };

  // Library view
  if (showLibrary) {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setShowLibrary(false)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F5A623] 
                         rounded-xl font-display font-bold text-[#F5A623] hover:bg-[#F5A623] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-display text-[#F5A623]">
                📚 Expression Library ({libraryStats.total})
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {creditError && (
            <div className="mb-4 p-4 bg-red-50 rounded-xl border-2 border-red-200 flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <div>
                <p className="font-display text-red-700">Credits Exhausted</p>
                <p className="font-crayon text-sm text-red-600">{creditError}</p>
              </div>
            </div>
          )}

          {EMOTIONS.map(emotion => (
            <div key={emotion.id} className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">{emotion.emoji}</span>
                  {emotion.word}
                  <span className="text-sm text-gray-400">
                    ({libraryStats.byEmotion[emotion.id] || 0})
                  </span>
                </h2>
                <button
                  onClick={() => generateNewExpression(emotion.id)}
                  disabled={generatingNew || creditError}
                  className="px-3 py-1.5 bg-[#F5A623] text-white rounded-lg font-crayon text-sm
                           hover:bg-orange-500 transition-all disabled:opacity-50 flex items-center gap-1"
                >
                  {generatingNew ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <ImagePlus size={14} />
                  )}
                  Generate New
                </button>
              </div>
              
              <div className="flex gap-3 overflow-x-auto pb-2">
                {(expressionLibrary[emotion.id] || []).map(expr => (
                  <img
                    key={expr.id}
                    src={expr.image_url}
                    alt={emotion.word}
                    className="w-24 h-24 object-cover rounded-xl shadow-md flex-shrink-0"
                  />
                ))}
                {(!expressionLibrary[emotion.id] || expressionLibrary[emotion.id].length === 0) && (
                  <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-4xl">
                    {emotion.emoji}
                  </div>
                )}
              </div>
            </div>
          ))}
        </main>
      </div>
    );
  }

  // Start screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
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
              <h1 className="text-lg sm:text-xl font-display text-[#F5A623] flex items-center gap-2">
                😊 Emotion Match
              </h1>
            </div>
            <button
              onClick={() => setShowLibrary(true)}
              className="p-2 bg-white border-2 border-[#F5A623] rounded-lg hover:bg-orange-50"
            >
              <Library size={20} className="text-[#F5A623]" />
            </button>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl border-4 border-[#F5A623] p-6 shadow-crayon">
            <h2 className="text-2xl font-display text-center text-[#F5A623] mb-2">
              Learn Emotions!
            </h2>
            <p className="text-center text-gray-600 font-crayon mb-4">
              Match real faces with feeling words
            </p>

            {/* Library Status */}
            <div className="mb-4 p-3 bg-orange-50 rounded-xl border-2 border-orange-200">
              <div className="flex items-center gap-2 text-orange-700">
                <Sparkles size={16} />
                <span className="font-crayon text-sm">
                  {loadingExpressions ? 'Loading expressions...' : 
                   `${libraryStats.total} AI-generated faces in library`}
                </span>
              </div>
            </div>

            {/* Mode Selection */}
            <div className="mb-6">
              <label className="block font-crayon text-gray-700 mb-2">Game Type:</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(MODES).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => setMode(key)}
                    className={`p-4 rounded-xl border-3 font-crayon transition-all
                      ${mode === key 
                        ? 'border-[#F5A623] bg-orange-50 text-[#F5A623]' 
                        : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startGame}
              disabled={loadingExpressions}
              className="w-full py-4 bg-[#F5A623] text-white rounded-xl font-display text-xl
                       hover:bg-orange-500 transition-all shadow-md disabled:opacity-50
                       flex items-center justify-center gap-2"
            >
              {loadingExpressions ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Star size={24} />
                  Start Game!
                </>
              )}
            </button>

            {/* More Expressions Button */}
            <button
              onClick={() => setShowLibrary(true)}
              className="w-full mt-3 py-3 border-3 border-[#F5A623] text-[#F5A623] rounded-xl 
                       font-crayon hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
            >
              <ImagePlus size={18} />
              More Expressions
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-white rounded-2xl border-3 border-orange-200">
            <h3 className="font-display text-[#F5A623] mb-2">How to Play</h3>
            <ul className="font-crayon text-sm text-gray-600 space-y-1">
              <li>• Look at the face and identify the emotion</li>
              <li>• Tap the matching word (or face)</li>
              <li>• Learn to recognize feelings in others!</li>
              <li>• Click "More Expressions" to add new faces</li>
            </ul>
          </div>
        </main>
      </div>
    );
  }

  // Game complete screen
  if (gameComplete) {
    const percentage = Math.round((score / EMOTIONS.length) * 100);
    
    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border-4 border-[#F5A623] p-8 max-w-md w-full shadow-crayon text-center">
          <Trophy className="w-20 h-20 text-[#F5A623] mx-auto mb-4" />
          <h2 className="text-3xl font-display text-[#F5A623] mb-2">Great Job!</h2>
          
          <div className="my-6 p-4 bg-orange-50 rounded-xl">
            <p className="text-4xl font-display text-[#F5A623]">
              {score} / {EMOTIONS.length}
            </p>
            <p className="font-crayon text-gray-600">{percentage}% correct</p>
          </div>

          <div className="flex gap-4 flex-wrap justify-center mb-4">
            {[...Array(Math.min(score, 5))].map((_, i) => (
              <Star key={i} className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={startGame}
              className="flex-1 py-3 bg-[#F5A623] text-white rounded-xl font-display
                       hover:bg-orange-500 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Play Again
            </button>
            <button
              onClick={() => {
                setGameStarted(false);
                setGameComplete(false);
              }}
              className="flex-1 py-3 border-3 border-gray-300 rounded-xl font-crayon text-gray-600
                       hover:bg-gray-50 transition-all"
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
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => {
              setGameStarted(false);
              setCurrentEmotion(null);
            }}
            className="p-2 bg-white border-3 border-[#F5A623] rounded-xl text-[#F5A623]"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <p className="font-crayon text-gray-600 text-sm">
              Question {questionsAnswered.length + 1} of {EMOTIONS.length}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full">
            <Star className="w-5 h-5 text-[#F5A623] fill-[#F5A623]" />
            <span className="font-display text-[#F5A623]">{score}</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Instruction */}
        <p className="text-center font-crayon text-gray-600 mb-4">
          {MODES[mode].instruction}
        </p>

        {/* Question Area */}
        <div className="bg-white rounded-3xl border-4 border-[#F5A623] p-6 mb-6 text-center">
          {mode === 'faceToWord' ? (
            // Show face, pick word
            <div className="flex flex-col items-center">
              {renderFace(currentEmotion?.id, currentImage, 'large')}
              <button
                onClick={() => speak(`What emotion is this face showing?`)}
                className="mt-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <Volume2 size={24} className="text-gray-600" />
              </button>
            </div>
          ) : (
            // Show word, pick face
            <div className="flex flex-col items-center">
              <p className="text-4xl font-display mb-2" style={{ color: currentEmotion?.color }}>
                {currentEmotion?.word}
              </p>
              <p className="font-crayon text-gray-500">{currentEmotion?.description}</p>
              <button
                onClick={() => speak(`Find the face that shows ${currentEmotion?.word}`)}
                className="mt-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <Volume2 size={24} className="text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* Answer Options */}
        <div className={`grid ${mode === 'faceToWord' ? 'grid-cols-2' : 'grid-cols-2'} gap-3`}>
          {options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrect = option.id === currentEmotion?.id;
            
            let borderColor = option.color;
            let bgColor = 'bg-white';
            
            if (feedback) {
              if (isSelected && isCorrect) {
                bgColor = 'bg-green-100';
                borderColor = '#22C55E';
              } else if (isSelected && !isCorrect) {
                bgColor = 'bg-red-100';
                borderColor = '#EF4444';
              } else if (isCorrect) {
                bgColor = 'bg-green-50';
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleAnswer(option)}
                disabled={!!feedback}
                className={`p-4 rounded-xl border-4 transition-all ${bgColor}
                  ${feedback ? 'cursor-default' : 'hover:scale-105 active:scale-95'}`}
                style={{ borderColor }}
              >
                {mode === 'faceToWord' ? (
                  <span className="font-display text-lg" style={{ color: option.color }}>
                    {option.word}
                  </span>
                ) : (
                  <div className="flex justify-center">
                    {renderFace(option.id, option.imageData, 'small')}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`mt-4 p-4 rounded-xl text-center ${
            feedback === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <p className="font-display text-xl">
              {feedback === 'correct' ? '🎉 Correct!' : `Try again! That's ${options.find(o => o.id === selectedAnswer)?.word}`}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmotionMatch;
