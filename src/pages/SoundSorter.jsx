// SoundSorter.jsx - Sort words by beginning sounds
// Speech therapy app for phonological awareness

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Volume2, Check, X, RotateCcw, Trophy,
  Star, Sparkles, HelpCircle
} from 'lucide-react';
import { getPictogramUrl } from '../services/arasaac';

// Sound categories with word lists
const SOUND_GROUPS = {
  b: {
    letter: 'B',
    color: '#4A9FD4',
    words: [
      { word: 'ball', arasaacId: 2483 },
      { word: 'banana', arasaacId: 2485 },
      { word: 'bird', arasaacId: 2505 },
      { word: 'book', arasaacId: 2506 },
      { word: 'bus', arasaacId: 2504 },
      { word: 'butterfly', arasaacId: 28417 },
    ],
  },
  c: {
    letter: 'C',
    color: '#E63B2E',
    words: [
      { word: 'cat', arasaacId: 2513 },
      { word: 'car', arasaacId: 2510 },
      { word: 'cookie', arasaacId: 2530 },
      { word: 'cup', arasaacId: 2534 },
      { word: 'cake', arasaacId: 2507 },
      { word: 'cow', arasaacId: 2532 },
    ],
  },
  d: {
    letter: 'D',
    color: '#5CB85C',
    words: [
      { word: 'dog', arasaacId: 2545 },
      { word: 'duck', arasaacId: 2549 },
      { word: 'door', arasaacId: 2547 },
      { word: 'drum', arasaacId: 2548 },
      { word: 'dress', arasaacId: 4606 },
      { word: 'doll', arasaacId: 2546 },
    ],
  },
  f: {
    letter: 'F',
    color: '#F5A623',
    words: [
      { word: 'fish', arasaacId: 2555 },
      { word: 'flower', arasaacId: 2557 },
      { word: 'fork', arasaacId: 2560 },
      { word: 'frog', arasaacId: 2561 },
      { word: 'fire', arasaacId: 2554 },
      { word: 'foot', arasaacId: 2559 },
    ],
  },
  m: {
    letter: 'M',
    color: '#8E6BBF',
    words: [
      { word: 'moon', arasaacId: 2619 },
      { word: 'milk', arasaacId: 2615 },
      { word: 'mouse', arasaacId: 2621 },
      { word: 'monkey', arasaacId: 2618 },
      { word: 'map', arasaacId: 2607 },
      { word: 'mitten', arasaacId: 2616 },
    ],
  },
  s: {
    letter: 'S',
    color: '#E86B9A',
    words: [
      { word: 'sun', arasaacId: 2802 },
      { word: 'star', arasaacId: 2805 },
      { word: 'sock', arasaacId: 2761 },
      { word: 'snake', arasaacId: 2768 },
      { word: 'spoon', arasaacId: 2800 },
      { word: 'strawberry', arasaacId: 2807 },
    ],
  },
};

// Get random words from different sounds
const getGameWords = (targetSound, count = 6) => {
  const targetWords = SOUND_GROUPS[targetSound].words
    .sort(() => Math.random() - 0.5)
    .slice(0, count / 2);

  // Get distractor words from other sounds
  const otherSounds = Object.keys(SOUND_GROUPS).filter(s => s !== targetSound);
  const distractors = [];
  
  while (distractors.length < count / 2) {
    const randomSound = otherSounds[Math.floor(Math.random() * otherSounds.length)];
    const randomWord = SOUND_GROUPS[randomSound].words[
      Math.floor(Math.random() * SOUND_GROUPS[randomSound].words.length)
    ];
    if (!distractors.find(d => d.word === randomWord.word)) {
      distractors.push({ ...randomWord, sound: randomSound });
    }
  }

  return [
    ...targetWords.map(w => ({ ...w, sound: targetSound, isTarget: true })),
    ...distractors.map(w => ({ ...w, isTarget: false })),
  ].sort(() => Math.random() - 0.5);
};

const SoundSorter = () => {
  const navigate = useNavigate();
  
  // Game state
  const [selectedSound, setSelectedSound] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  // Text to speech
  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Start game
  const startGame = (sound) => {
    setSelectedSound(sound);
    setWords(getGameWords(sound, 8));
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setShowResult(false);
    setFeedback(null);
    setGameStarted(true);
  };

  // Handle answer
  const handleAnswer = (isYes) => {
    const currentWord = words[currentIndex];
    const correct = (isYes && currentWord.isTarget) || (!isYes && !currentWord.isTarget);
    
    // Show feedback
    setFeedback({
      correct,
      word: currentWord.word,
      message: correct 
        ? '✨ Great job!' 
        : `${currentWord.word} starts with "${currentWord.word[0].toUpperCase()}"`,
    });

    // Update score
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    // Move to next word after delay
    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < words.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  // Current word
  const currentWord = words[currentIndex];
  const soundData = selectedSound ? SOUND_GROUPS[selectedSound] : null;

  // Sound selection screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/speech-therapy')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                         rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-display text-[#8E6BBF] flex items-center gap-2">
                🎯 Sound Sorter
              </h1>
              <p className="text-sm text-gray-500 font-crayon">Sort words by beginning sounds</p>
            </div>
            <button
              onClick={() => setShowHelp(true)}
              className="p-2 text-gray-400 hover:text-[#8E6BBF]"
            >
              <HelpCircle size={24} />
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Instructions */}
          <div className="bg-white rounded-2xl border-4 border-[#8E6BBF] p-5 mb-6 shadow-lg">
            <h2 className="font-display text-xl text-[#8E6BBF] mb-2 flex items-center gap-2">
              <Sparkles size={24} />
              How to Play
            </h2>
            <p className="font-crayon text-gray-600">
              Choose a letter sound. You'll see pictures of different words.
              Decide if each word starts with your chosen sound!
            </p>
          </div>

          {/* Sound Selection Grid */}
          <h3 className="font-display text-gray-700 mb-3">Choose a Sound</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {Object.entries(SOUND_GROUPS).map(([key, sound]) => (
              <button
                key={key}
                onClick={() => startGame(key)}
                className="aspect-square bg-white rounded-2xl border-4 p-3 shadow-lg 
                           hover:scale-105 transition-all flex flex-col items-center justify-center"
                style={{ borderColor: sound.color }}
              >
                <span 
                  className="text-4xl font-display"
                  style={{ color: sound.color }}
                >
                  {sound.letter}
                </span>
                <span className="text-xs text-gray-500 font-crayon mt-1">
                  /{key}/
                </span>
              </button>
            ))}
          </div>
        </main>

        {/* Help Modal */}
        {showHelp && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border-4 border-[#8E6BBF] p-6 max-w-md shadow-2xl">
              <h2 className="text-xl font-display text-[#8E6BBF] mb-4">How to Play</h2>
              <ol className="space-y-3 font-crayon text-gray-600">
                <li className="flex gap-3">
                  <span className="bg-[#8E6BBF] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">1</span>
                  <span>Choose a letter sound to practice</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#8E6BBF] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">2</span>
                  <span>Look at each picture and say the word</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#8E6BBF] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">3</span>
                  <span>Tap ✓ if the word starts with your sound</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#8E6BBF] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">4</span>
                  <span>Tap ✗ if it starts with a different sound</span>
                </li>
              </ol>
              <button
                onClick={() => setShowHelp(false)}
                className="w-full mt-6 py-3 bg-[#8E6BBF] text-white font-display rounded-xl"
              >
                Got It!
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Results screen
  if (showResult) {
    const percentage = Math.round((score.correct / score.total) * 100);
    const stars = Math.ceil(percentage / 20);

    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4"
                style={{ borderColor: soundData.color }}>
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setGameStarted(false)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 
                         rounded-xl font-display font-bold transition-all"
              style={{ borderColor: soundData.color, color: soundData.color }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <h1 className="text-xl font-display" style={{ color: soundData.color }}>
              Great Work!
            </h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl border-4 border-[#F8D14A] p-6 shadow-lg text-center">
            <Trophy size={64} className="mx-auto text-[#F8D14A] mb-4" />
            <h2 className="text-2xl font-display text-[#F8D14A] mb-2">
              Sound Sorting Complete!
            </h2>
            
            <div className="my-6">
              <p className="text-gray-500 font-crayon mb-2">
                You practiced the "{soundData.letter}" sound
              </p>
              <div className="text-5xl font-display" style={{ color: soundData.color }}>
                {score.correct} / {score.total}
              </div>
              <p className="text-gray-500 font-crayon mt-2">{percentage}% correct</p>
            </div>

            <div className="flex justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={32}
                  className={i < stars ? 'text-[#F8D14A] fill-[#F8D14A]' : 'text-gray-300'}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => startGame(selectedSound)}
                className="flex-1 py-3 bg-[#5CB85C] text-white font-display rounded-xl
                           flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Play Again
              </button>
              <button
                onClick={() => setGameStarted(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 font-display rounded-xl"
              >
                New Sound
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Game screen
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4"
              style={{ borderColor: soundData.color }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setGameStarted(false)}
            className="p-2 bg-white border-3 rounded-xl"
            style={{ borderColor: soundData.color }}
          >
            <X size={20} style={{ color: soundData.color }} />
          </button>
          
          <div className="flex-1 text-center">
            <span className="font-display text-lg" style={{ color: soundData.color }}>
              Does it start with "{soundData.letter}"?
            </span>
          </div>
          
          <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-green-600 fill-green-600" />
            <span className="font-display text-green-700">{score.correct}</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-gray-200">
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              width: `${((currentIndex + 1) / words.length) * 100}%`,
              backgroundColor: soundData.color 
            }}
          />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        {/* Target Sound Badge */}
        <div className="flex justify-center mb-6">
          <div 
            className="px-6 py-3 rounded-full text-white font-display text-2xl shadow-lg"
            style={{ backgroundColor: soundData.color }}
          >
            /{selectedSound}/ - {soundData.letter}
          </div>
        </div>

        {/* Word Card */}
        <div className={`bg-white rounded-3xl border-4 p-6 shadow-lg text-center mb-6 transition-all
                        ${feedback ? (feedback.correct ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50') : ''}`}
             style={{ borderColor: feedback ? undefined : soundData.color }}>
          {/* Image */}
          <div className="w-40 h-40 mx-auto mb-4 rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={getPictogramUrl(currentWord.arasaacId)}
              alt={currentWord.word}
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Word */}
          <h2 className="text-3xl font-display text-gray-800 mb-2">
            {currentWord.word}
          </h2>
          
          {/* Speak button */}
          <button
            onClick={() => speak(currentWord.word)}
            className="p-3 rounded-full hover:scale-110 transition-transform"
            style={{ backgroundColor: `${soundData.color}20` }}
          >
            <Volume2 size={28} style={{ color: soundData.color }} />
          </button>

          {/* Feedback */}
          {feedback && (
            <div className={`mt-4 p-3 rounded-xl font-crayon ${
              feedback.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {feedback.message}
            </div>
          )}
        </div>

        {/* Answer buttons */}
        {!feedback && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(false)}
              className="py-6 bg-red-100 border-4 border-red-400 text-red-600 font-display text-xl
                         rounded-2xl flex flex-col items-center gap-2 hover:bg-red-200 transition-colors"
            >
              <X size={40} />
              No
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="py-6 bg-green-100 border-4 border-green-400 text-green-600 font-display text-xl
                         rounded-2xl flex flex-col items-center gap-2 hover:bg-green-200 transition-colors"
            >
              <Check size={40} />
              Yes
            </button>
          </div>
        )}

        {/* Progress */}
        <p className="text-center text-gray-500 font-crayon mt-6">
          {currentIndex + 1} of {words.length}
        </p>
      </main>
    </div>
  );
};

export default SoundSorter;
