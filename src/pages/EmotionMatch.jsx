// EmotionMatch.jsx - Match faces to emotions game
// UPDATED: Supports AI-generated realistic human faces from shared library
// Phase 1: ARASAAC pictograms (default/fallback)
// Phase 2: AI-generated faces (shared across all users)
// Game uses 12 faces per session, prompts to generate more when exhausted

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, RotateCcw, Trophy, Star, Volume2, 
  Sparkles, Loader2, Users, Camera, Image as ImageIcon,
  RefreshCw, Zap
} from 'lucide-react';
import { useAuth } from '../App';
import { useToast } from '../components/Toast';
import { getPictogramUrl, ARASAAC_ATTRIBUTION } from '../services/arasaac';
import {
  EMOTIONS,
  getArasaacFaces,
  getGameFaces,
  getMoreFaces,
  generateNewFaces,
  getTotalFaceCount,
  incrementFaceUseCount,
  preloadFaceImages,
} from '../services/emotionFaces';

// Game modes
const GAME_MODES = {
  faceToWord: { label: 'Face → Word', instruction: 'Tap the word that matches the face!' },
  wordToFace: { label: 'Word → Face', instruction: 'Tap the face that matches the word!' },
};

// Face types
const FACE_TYPES = {
  pictograms: { label: 'Pictograms', description: 'ARASAAC symbols', icon: ImageIcon },
  realistic: { label: 'Real Faces', description: 'AI-generated photos', icon: Camera },
};

const EmotionMatch = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const toast = useToast();
  
  // Game settings
  const [mode, setMode] = useState('faceToWord');
  const [faceType, setFaceType] = useState('pictograms'); // 'pictograms' or 'realistic'
  
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentFace, setCurrentFace] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  // Face management
  const [gameFaces, setGameFaces] = useState([]); // 12 faces for current game
  const [usedFaceIds, setUsedFaceIds] = useState([]); // Track used faces across rounds
  const [questionsAnswered, setQuestionsAnswered] = useState([]);
  const [totalAvailableFaces, setTotalAvailableFaces] = useState(0);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');

  // ============================================
  // LOAD FACE COUNT ON MOUNT
  // ============================================
  useEffect(() => {
    const loadFaceCount = async () => {
      const count = await getTotalFaceCount();
      setTotalAvailableFaces(count);
    };
    loadFaceCount();
  }, []);

  // ============================================
  // SPEECH SYNTHESIS
  // ============================================
  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const speakCurrent = () => {
    if (currentFace) {
      if (mode === 'faceToWord') {
        speak(`This face is feeling... can you find the word?`);
      } else {
        speak(`Find the face that shows ${currentFace.word}`);
      }
    }
  };

  // ============================================
  // LOAD GAME FACES
  // ============================================
  const loadGameFaces = useCallback(async () => {
    setLoading(true);
    
    try {
      let faces;
      
      if (faceType === 'pictograms') {
        // Use ARASAAC pictograms
        faces = getArasaacFaces();
      } else {
        // Use AI faces from database (falls back to ARASAAC if needed)
        faces = await getGameFaces();
      }
      
      setGameFaces(faces);
      preloadFaceImages(faces);
      
      // Update total count
      const count = await getTotalFaceCount();
      setTotalAvailableFaces(count);
      
    } catch (error) {
      console.error('Error loading faces:', error);
      // Fall back to ARASAAC
      const faces = getArasaacFaces();
      setGameFaces(faces);
    } finally {
      setLoading(false);
    }
  }, [faceType]);

  // ============================================
  // START GAME
  // ============================================
  const startGame = useCallback(async () => {
    setLoading(true);
    setScore(0);
    setTotalQuestions(0);
    setQuestionsAnswered([]);
    setGameComplete(false);
    setCurrentFace(null);
    
    await loadGameFaces();
    
    setGameStarted(true);
    setLoading(false);
  }, [loadGameFaces]);

  // ============================================
  // GENERATE QUESTION
  // ============================================
  const generateQuestion = useCallback(() => {
    // Get faces not yet answered in this round
    const remaining = gameFaces.filter(f => !questionsAnswered.includes(f.id));
    
    if (remaining.length === 0) {
      setGameComplete(true);
      return;
    }

    // Pick random face from remaining
    const correct = remaining[Math.floor(Math.random() * remaining.length)];
    
    // For options, we need emotions not the correct one
    const otherEmotions = EMOTIONS.filter(e => e.id !== correct.emotion);
    const wrongOptions = otherEmotions
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(e => ({
        ...e,
        id: `option_${e.id}`,
        emotion: e.id,
        word: e.word,
        color: e.color,
        // For wordToFace mode, find a face with this emotion
        image_url: faceType === 'pictograms' 
          ? getPictogramUrl(e.arasaacId)
          : (gameFaces.find(f => f.emotion === e.id)?.image_url || getPictogramUrl(e.arasaacId)),
      }));
    
    // Combine correct answer with wrong options
    const correctOption = {
      ...correct,
      emotion: correct.emotion,
    };
    
    const allOptions = [correctOption, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setCurrentFace(correct);
    setOptions(allOptions);
    setFeedback(null);
    setSelectedAnswer(null);
    
    // Track face use
    incrementFaceUseCount(correct.id);
  }, [gameFaces, questionsAnswered, faceType]);

  // Initialize question when game starts
  useEffect(() => {
    if (gameStarted && !gameComplete && !currentFace && gameFaces.length > 0) {
      generateQuestion();
    }
  }, [gameStarted, gameComplete, currentFace, gameFaces, generateQuestion]);

  // ============================================
  // HANDLE ANSWER
  // ============================================
  const handleAnswer = (option) => {
    if (feedback) return;
    
    setSelectedAnswer(option.id);
    setTotalQuestions(prev => prev + 1);
    
    if (option.emotion === currentFace.emotion) {
      // Correct!
      setFeedback('correct');
      setScore(prev => prev + 1);
      speak('Great job!');
      
      setTimeout(() => {
        setQuestionsAnswered(prev => [...prev, currentFace.id]);
        setUsedFaceIds(prev => [...prev, currentFace.id]);
        setCurrentFace(null);
      }, 1500);
    } else {
      // Wrong
      setFeedback('wrong');
      const correctWord = EMOTIONS.find(e => e.id === currentFace.emotion)?.word || currentFace.word;
      speak(`That's ${option.word}. Try to find ${correctWord}.`);
      
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
      }, 2000);
    }
  };

  // ============================================
  // GENERATE MORE FACES
  // ============================================
  const handleGenerateMoreFaces = async () => {
    if (isGuest) {
      toast.warning('Sign In Required', 'Please sign in to generate AI faces.');
      return;
    }

    setGenerating(true);
    setGenerationProgress('Starting generation...');

    try {
      const result = await generateNewFaces(12, null, (progress) => {
        setGenerationProgress(progress.message);
      });

      if (result.generated > 0) {
        toast.success('Faces Generated!', `Added ${result.generated} new faces to the library!`);
        
        // Refresh face count
        const count = await getTotalFaceCount();
        setTotalAvailableFaces(count);
      } else {
        toast.error('Generation Failed', result.error || 'Could not generate faces.');
      }
    } catch (error) {
      console.error('Error generating faces:', error);
      toast.error('Error', error.message || 'Failed to generate faces.');
    } finally {
      setGenerating(false);
      setGenerationProgress('');
    }
  };

  // ============================================
  // PLAY AGAIN (with more faces)
  // ============================================
  const playAgain = async () => {
    setLoading(true);
    
    try {
      // Try to get more faces that haven't been used
      const moreFaces = await getMoreFaces(12, usedFaceIds);
      
      if (moreFaces.length >= 12) {
        setGameFaces(moreFaces);
        preloadFaceImages(moreFaces);
      } else {
        // Not enough new faces, reload all faces
        await loadGameFaces();
        setUsedFaceIds([]); // Reset used faces
      }
      
      setScore(0);
      setTotalQuestions(0);
      setQuestionsAnswered([]);
      setGameComplete(false);
      setCurrentFace(null);
    } catch (error) {
      console.error('Error loading more faces:', error);
      await loadGameFaces();
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RENDER: START SCREEN
  // ============================================
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E86B9A]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E86B9A] 
                         rounded-xl font-display font-bold text-[#E86B9A] hover:bg-[#E86B9A] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-display text-[#E86B9A] crayon-text flex items-center gap-2">
                😊 Emotion Match
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-6">
          <div className="bg-white rounded-3xl border-4 border-[#E86B9A] p-6 shadow-crayon">
            <h2 className="text-2xl font-display text-center text-[#E86B9A] mb-2">
              Learn Emotions!
            </h2>
            <p className="text-center text-gray-600 font-crayon mb-6">
              Match faces with feeling words
            </p>

            {/* Face Type Selection */}
            <div className="mb-6">
              <label className="block font-crayon text-gray-700 mb-2">Choose Face Style:</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(FACE_TYPES).map(([key, type]) => (
                  <button
                    key={key}
                    onClick={() => setFaceType(key)}
                    className={`p-4 rounded-xl border-3 font-crayon transition-all text-center
                      ${faceType === key 
                        ? 'border-[#E86B9A] bg-pink-50 text-[#E86B9A]' 
                        : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                      }`}
                  >
                    <type.icon className="w-8 h-8 mx-auto mb-2" />
                    <span className="block font-semibold">{type.label}</span>
                    <span className="text-xs opacity-75">{type.description}</span>
                  </button>
                ))}
              </div>
              
              {/* AI faces info */}
              {faceType === 'realistic' && (
                <div className="mt-3 p-3 bg-purple-50 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center gap-2 text-purple-700 font-crayon">
                    <Users size={16} />
                    <span>{totalAvailableFaces} AI faces in shared library</span>
                  </div>
                  {totalAvailableFaces < 12 && (
                    <p className="text-sm text-purple-600 mt-1">
                      Will use pictograms for missing emotions
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Game Mode Selection */}
            <div className="mb-6">
              <label className="block font-crayon text-gray-700 mb-2">Game Type:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode('faceToWord')}
                  className={`p-4 rounded-xl border-3 font-crayon transition-all
                    ${mode === 'faceToWord' 
                      ? 'border-[#E86B9A] bg-pink-50 text-[#E86B9A]' 
                      : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                    }`}
                >
                  <span className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-2xl">😊</span>
                    <span className="text-xl">→ ?</span>
                  </span>
                  <span className="text-sm">See Face</span>
                  <span className="block text-xs">Find Word</span>
                </button>
                <button
                  onClick={() => setMode('wordToFace')}
                  className={`p-4 rounded-xl border-3 font-crayon transition-all
                    ${mode === 'wordToFace' 
                      ? 'border-[#E86B9A] bg-pink-50 text-[#E86B9A]' 
                      : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                    }`}
                >
                  <span className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-xl">? →</span>
                    <span className="text-2xl">😊</span>
                  </span>
                  <span className="text-sm">See Word</span>
                  <span className="block text-xs">Find Face</span>
                </button>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startGame}
              disabled={loading}
              className="w-full py-4 bg-[#E86B9A] text-white text-xl font-display rounded-2xl
                         hover:bg-pink-600 transition-all shadow-lg flex items-center justify-center gap-2
                         disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Loading...
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  Start Game!
                </>
              )}
            </button>

            {/* Generate More Faces Button */}
            {faceType === 'realistic' && (
              <button
                onClick={handleGenerateMoreFaces}
                disabled={generating || isGuest}
                className="w-full mt-4 py-3 bg-purple-100 text-purple-700 font-crayon rounded-xl
                           border-2 border-purple-300 hover:bg-purple-200 transition-all
                           flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    {generationProgress || 'Generating...'}
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    Generate 12 New AI Faces
                  </>
                )}
              </button>
            )}
          </div>

          {/* ARASAAC Attribution */}
          {faceType === 'pictograms' && (
            <p className="text-center text-xs text-gray-500 mt-4 font-crayon">
              {ARASAAC_ATTRIBUTION}
            </p>
          )}
        </main>
      </div>
    );
  }

  // ============================================
  // RENDER: GAME COMPLETE SCREEN
  // ============================================
  if (gameComplete) {
    const percentage = Math.round((score / 12) * 100);
    const allFacesUsed = usedFaceIds.length >= totalAvailableFaces && totalAvailableFaces > 0;
    
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E86B9A]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => {
                setGameStarted(false);
                setGameComplete(false);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E86B9A] 
                         rounded-xl font-display font-bold text-[#E86B9A] hover:bg-[#E86B9A] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-display text-[#E86B9A] crayon-text">
                Game Complete!
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl border-4 border-[#F8D14A] p-6 shadow-crayon text-center">
            <Trophy className="w-20 h-20 mx-auto text-[#F8D14A] mb-4" />
            
            <h2 className="text-3xl font-display text-[#F8D14A] mb-2">
              Great Job! 🎉
            </h2>
            
            <div className="text-5xl font-display my-4" style={{ color: '#5CB85C' }}>
              {score} / 12
            </div>
            
            <p className="text-gray-600 font-crayon mb-2">
              You got {percentage}% correct!
            </p>
            
            {/* Stars based on score */}
            <div className="flex justify-center gap-2 my-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={32}
                  className={i < Math.ceil(score / 2.4) ? 'text-[#F8D14A] fill-[#F8D14A]' : 'text-gray-300'}
                />
              ))}
            </div>

            {/* Faces used info */}
            {faceType === 'realistic' && (
              <div className="mt-4 p-3 bg-purple-50 rounded-xl text-sm font-crayon text-purple-700">
                <Users size={16} className="inline mr-1" />
                Used {usedFaceIds.length} / {totalAvailableFaces} faces from shared library
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={playAgain}
                disabled={loading}
                className="w-full py-3 bg-[#5CB85C] text-white font-display rounded-xl
                           hover:bg-green-600 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <RefreshCw size={20} />
                )}
                Play Again with New Faces
              </button>

              {faceType === 'realistic' && (allFacesUsed || totalAvailableFaces < 24) && (
                <button
                  onClick={handleGenerateMoreFaces}
                  disabled={generating || isGuest}
                  className="w-full py-3 bg-purple-500 text-white font-display rounded-xl
                             hover:bg-purple-600 transition-all flex items-center justify-center gap-2
                             disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {generationProgress || 'Generating...'}
                    </>
                  ) : (
                    <>
                      <Zap size={20} />
                      Add 12 More AI Faces to Library
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => {
                  setGameStarted(false);
                  setGameComplete(false);
                  setUsedFaceIds([]);
                }}
                className="w-full py-3 bg-gray-200 text-gray-700 font-display rounded-xl
                           hover:bg-gray-300 transition-all"
              >
                Change Settings
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ============================================
  // RENDER: GAMEPLAY
  // ============================================
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E86B9A]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => {
              setGameStarted(false);
              setGameComplete(false);
            }}
            className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#E86B9A] 
                       rounded-xl font-display text-[#E86B9A] hover:bg-[#E86B9A] 
                       hover:text-white transition-all text-sm"
          >
            <ArrowLeft size={14} />
            Exit
          </button>
          
          {/* Score */}
          <div className="flex-1 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-green-600 fill-green-600" />
              <span className="font-display text-green-700">{score}</span>
            </div>
            <span className="font-crayon text-gray-500">
              {questionsAnswered.length + 1} / 12
            </span>
          </div>
          
          <button
            onClick={() => {
              setScore(0);
              setTotalQuestions(0);
              setQuestionsAnswered([]);
              setCurrentFace(null);
            }}
            className="p-2 bg-white border-3 border-gray-300 rounded-xl hover:bg-gray-100"
            title="Restart"
          >
            <RotateCcw size={18} className="text-gray-600" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Instruction */}
        <p className="text-center font-crayon text-gray-600 mb-4">
          {GAME_MODES[mode].instruction}
        </p>

        {/* Question Display */}
        <div className="bg-white rounded-3xl border-4 border-[#E86B9A] p-6 shadow-crayon mb-6 text-center">
          {mode === 'faceToWord' ? (
            <>
              <p className="font-crayon text-gray-600 mb-4">
                What is this face feeling?
              </p>
              {currentFace && (
                <img
                  src={currentFace.image_url}
                  alt="Emotion face"
                  className="w-32 h-32 mx-auto rounded-2xl object-cover border-4 border-gray-200 mb-2"
                />
              )}
            </>
          ) : (
            <>
              <p className="font-crayon text-gray-600 mb-4">
                Find the face that shows:
              </p>
              <div 
                className="text-4xl font-display mb-2"
                style={{ color: currentFace?.color }}
              >
                {currentFace?.word}
              </div>
              <p className="text-sm text-gray-500 font-crayon">
                ({currentFace?.description})
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
          {options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrect = option.emotion === currentFace?.emotion;
            const showCorrect = feedback && isCorrect;
            const showWrong = feedback === 'wrong' && isSelected;

            return (
              <button
                key={option.id}
                onClick={() => handleAnswer(option)}
                disabled={!!feedback}
                className={`
                  p-4 rounded-2xl border-4 transition-all duration-300
                  ${showCorrect 
                    ? 'border-[#5CB85C] bg-green-100 scale-105' 
                    : showWrong 
                      ? 'border-[#E63B2E] bg-red-100 shake' 
                      : 'border-gray-300 bg-white hover:border-[#E86B9A] hover:scale-105'
                  }
                  ${feedback && !showCorrect && !showWrong ? 'opacity-50' : ''}
                `}
              >
                {mode === 'faceToWord' ? (
                  <span 
                    className="block text-xl font-display"
                    style={{ color: option.color }}
                  >
                    {option.word}
                  </span>
                ) : (
                  <img
                    src={option.image_url}
                    alt={option.word}
                    className="w-16 h-16 mx-auto rounded-xl object-cover"
                  />
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
              <>🎉 Yes! That's {currentFace?.word}!</>
            ) : (
              <>Try again! Look for {currentFace?.word}</>
            )}
          </div>
        )}
      </main>

      {/* Shake animation */}
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
