// SoundSorter.jsx - Sort words by beginning sounds
// Speech therapy app for phonological awareness
// ENHANCED: Correct ARASAAC IDs, emoji fallbacks, difficulty levels, image error handling

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Volume2, Check, X, RotateCcw, Trophy,
  Star, Sparkles, HelpCircle, Loader2, ImageOff, 
  Zap, BookOpen, GraduationCap
} from 'lucide-react';

// ARASAAC API helper - returns pictogram URL with proper parameters
const getArasaacUrl = (id) => {
  return `https://static.arasaac.org/pictograms/${id}/${id}_500.png`;
};

// Sound categories with VERIFIED ARASAAC IDs and emoji fallbacks
const SOUND_GROUPS = {
  b: {
    letter: 'B',
    color: '#4A9FD4',
    words: [
      { word: 'ball', arasaacId: 6009, emoji: '⚽' },
      { word: 'banana', arasaacId: 2442, emoji: '🍌' },
      { word: 'bird', arasaacId: 6014, emoji: '🐦' },
      { word: 'book', arasaacId: 6017, emoji: '📖' },
      { word: 'bus', arasaacId: 6883, emoji: '🚌' },
      { word: 'butterfly', arasaacId: 2447, emoji: '🦋' },
      { word: 'bear', arasaacId: 2436, emoji: '🐻' },
      { word: 'bed', arasaacId: 2437, emoji: '🛏️' },
      { word: 'boat', arasaacId: 2444, emoji: '⛵' },
      { word: 'baby', arasaacId: 7067, emoji: '👶' },
    ],
  },
  c: {
    letter: 'C',
    color: '#E63B2E',
    words: [
      { word: 'cat', arasaacId: 2460, emoji: '🐱' },
      { word: 'car', arasaacId: 2456, emoji: '🚗' },
      { word: 'cookie', arasaacId: 4564, emoji: '🍪' },
      { word: 'cup', arasaacId: 2477, emoji: '☕' },
      { word: 'cake', arasaacId: 4548, emoji: '🎂' },
      { word: 'cow', arasaacId: 2475, emoji: '🐄' },
      { word: 'cloud', arasaacId: 2466, emoji: '☁️' },
      { word: 'corn', arasaacId: 2473, emoji: '🌽' },
      { word: 'candy', arasaacId: 4550, emoji: '🍬' },
      { word: 'carrot', arasaacId: 2458, emoji: '🥕' },
    ],
  },
  d: {
    letter: 'D',
    color: '#5CB85C',
    words: [
      { word: 'dog', arasaacId: 2488, emoji: '🐕' },
      { word: 'duck', arasaacId: 2492, emoji: '🦆' },
      { word: 'door', arasaacId: 2491, emoji: '🚪' },
      { word: 'drum', arasaacId: 31159, emoji: '🥁' },
      { word: 'dress', arasaacId: 4606, emoji: '👗' },
      { word: 'doll', arasaacId: 2489, emoji: '🎎' },
      { word: 'dinosaur', arasaacId: 2487, emoji: '🦕' },
      { word: 'dolphin', arasaacId: 2490, emoji: '🐬' },
      { word: 'donut', arasaacId: 4596, emoji: '🍩' },
      { word: 'desk', arasaacId: 2485, emoji: '🪑' },
    ],
  },
  f: {
    letter: 'F',
    color: '#F5A623',
    words: [
      { word: 'fish', arasaacId: 2505, emoji: '🐟' },
      { word: 'flower', arasaacId: 2509, emoji: '🌸' },
      { word: 'fork', arasaacId: 2511, emoji: '🍴' },
      { word: 'frog', arasaacId: 2513, emoji: '🐸' },
      { word: 'fire', arasaacId: 2504, emoji: '🔥' },
      { word: 'foot', arasaacId: 2510, emoji: '🦶' },
      { word: 'fox', arasaacId: 2512, emoji: '🦊' },
      { word: 'fan', arasaacId: 2501, emoji: '🪭' },
      { word: 'flag', arasaacId: 2507, emoji: '🚩' },
      { word: 'french fries', arasaacId: 4617, emoji: '🍟' },
    ],
  },
  g: {
    letter: 'G',
    color: '#8B5A2B',
    words: [
      { word: 'goat', arasaacId: 2522, emoji: '🐐' },
      { word: 'guitar', arasaacId: 2527, emoji: '🎸' },
      { word: 'grapes', arasaacId: 2525, emoji: '🍇' },
      { word: 'grass', arasaacId: 2526, emoji: '🌿' },
      { word: 'gift', arasaacId: 2520, emoji: '🎁' },
      { word: 'girl', arasaacId: 2521, emoji: '👧' },
      { word: 'glass', arasaacId: 6067, emoji: '🥛' },
      { word: 'gloves', arasaacId: 9680, emoji: '🧤' },
      { word: 'gum', arasaacId: 4625, emoji: '🫧' },
      { word: 'gorilla', arasaacId: 2524, emoji: '🦍' },
    ],
  },
  h: {
    letter: 'H',
    color: '#E86B9A',
    words: [
      { word: 'hat', arasaacId: 2533, emoji: '🎩' },
      { word: 'horse', arasaacId: 2540, emoji: '🐴' },
      { word: 'house', arasaacId: 2541, emoji: '🏠' },
      { word: 'heart', arasaacId: 2535, emoji: '❤️' },
      { word: 'hand', arasaacId: 2531, emoji: '✋' },
      { word: 'hammer', arasaacId: 2530, emoji: '🔨' },
      { word: 'honey', arasaacId: 4637, emoji: '🍯' },
      { word: 'helicopter', arasaacId: 2536, emoji: '🚁' },
      { word: 'hippo', arasaacId: 2538, emoji: '🦛' },
      { word: 'hot dog', arasaacId: 4639, emoji: '🌭' },
    ],
  },
  m: {
    letter: 'M',
    color: '#8E6BBF',
    words: [
      { word: 'moon', arasaacId: 2577, emoji: '🌙' },
      { word: 'milk', arasaacId: 2575, emoji: '🥛' },
      { word: 'mouse', arasaacId: 2582, emoji: '🐭' },
      { word: 'monkey', arasaacId: 2578, emoji: '🐵' },
      { word: 'map', arasaacId: 2562, emoji: '🗺️' },
      { word: 'mittens', arasaacId: 9680, emoji: '🧤' },
      { word: 'mushroom', arasaacId: 2583, emoji: '🍄' },
      { word: 'muffin', arasaacId: 4671, emoji: '🧁' },
      { word: 'motorcycle', arasaacId: 2580, emoji: '🏍️' },
      { word: 'mountain', arasaacId: 2581, emoji: '⛰️' },
    ],
  },
  p: {
    letter: 'P',
    color: '#FF6B6B',
    words: [
      { word: 'pig', arasaacId: 2616, emoji: '🐷' },
      { word: 'pizza', arasaacId: 4700, emoji: '🍕' },
      { word: 'pencil', arasaacId: 2612, emoji: '✏️' },
      { word: 'penguin', arasaacId: 2613, emoji: '🐧' },
      { word: 'pear', arasaacId: 2611, emoji: '🍐' },
      { word: 'pumpkin', arasaacId: 2629, emoji: '🎃' },
      { word: 'piano', arasaacId: 2615, emoji: '🎹' },
      { word: 'parrot', arasaacId: 2608, emoji: '🦜' },
      { word: 'pants', arasaacId: 4695, emoji: '👖' },
      { word: 'popcorn', arasaacId: 4706, emoji: '🍿' },
    ],
  },
  s: {
    letter: 'S',
    color: '#17A2B8',
    words: [
      { word: 'sun', arasaacId: 2804, emoji: '☀️' },
      { word: 'star', arasaacId: 2803, emoji: '⭐' },
      { word: 'sock', arasaacId: 2791, emoji: '🧦' },
      { word: 'snake', arasaacId: 2786, emoji: '🐍' },
      { word: 'spoon', arasaacId: 2800, emoji: '🥄' },
      { word: 'strawberry', arasaacId: 2805, emoji: '🍓' },
      { word: 'sandwich', arasaacId: 4762, emoji: '🥪' },
      { word: 'snowman', arasaacId: 2788, emoji: '⛄' },
      { word: 'spider', arasaacId: 2796, emoji: '🕷️' },
      { word: 'school', arasaacId: 2770, emoji: '🏫' },
    ],
  },
  t: {
    letter: 'T',
    color: '#20C997',
    words: [
      { word: 'tree', arasaacId: 2820, emoji: '🌳' },
      { word: 'train', arasaacId: 2818, emoji: '🚂' },
      { word: 'turtle', arasaacId: 2824, emoji: '🐢' },
      { word: 'table', arasaacId: 2807, emoji: '🪑' },
      { word: 'tiger', arasaacId: 2814, emoji: '🐯' },
      { word: 'tooth', arasaacId: 2817, emoji: '🦷' },
      { word: 'tomato', arasaacId: 2816, emoji: '🍅' },
      { word: 'truck', arasaacId: 2821, emoji: '🚚' },
      { word: 'taco', arasaacId: 4790, emoji: '🌮' },
      { word: 'telephone', arasaacId: 2811, emoji: '📞' },
    ],
  },
};

// Difficulty settings
const DIFFICULTY_LEVELS = {
  easy: {
    name: 'Easy',
    icon: Zap,
    color: '#5CB85C',
    wordCount: 6,
    description: '6 words to sort',
  },
  medium: {
    name: 'Medium',
    icon: BookOpen,
    color: '#F5A623',
    wordCount: 8,
    description: '8 words to sort',
  },
  hard: {
    name: 'Hard',
    icon: GraduationCap,
    color: '#E63B2E',
    wordCount: 10,
    description: '10 words to sort',
  },
};

// Get random words from different sounds
const getGameWords = (targetSound, count = 6) => {
  const targetWordCount = Math.ceil(count / 2);
  const distractorCount = count - targetWordCount;
  
  const targetWords = [...SOUND_GROUPS[targetSound].words]
    .sort(() => Math.random() - 0.5)
    .slice(0, targetWordCount);

  // Get distractor words from other sounds
  const otherSounds = Object.keys(SOUND_GROUPS).filter(s => s !== targetSound);
  const distractors = [];
  const usedWords = new Set(targetWords.map(w => w.word));
  
  while (distractors.length < distractorCount) {
    const randomSound = otherSounds[Math.floor(Math.random() * otherSounds.length)];
    const availableWords = SOUND_GROUPS[randomSound].words.filter(w => !usedWords.has(w.word));
    
    if (availableWords.length > 0) {
      const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
      distractors.push({ ...randomWord, sound: randomSound });
      usedWords.add(randomWord.word);
    }
  }

  return [
    ...targetWords.map(w => ({ ...w, sound: targetSound, isTarget: true })),
    ...distractors.map(w => ({ ...w, isTarget: false })),
  ].sort(() => Math.random() - 0.5);
};

// Word Card Component with image loading states
const WordCard = ({ word, soundData, speak, feedback }) => {
  const [imageStatus, setImageStatus] = useState('loading'); // 'loading', 'loaded', 'error'
  
  useEffect(() => {
    setImageStatus('loading');
  }, [word.arasaacId]);
  
  return (
    <div 
      className={`bg-white rounded-3xl border-4 p-6 shadow-lg text-center mb-6 transition-all
                  ${feedback ? (feedback.correct ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50') : ''}`}
      style={{ borderColor: feedback ? undefined : soundData.color }}
    >
      {/* Image Container */}
      <div className="w-44 h-44 mx-auto mb-4 rounded-2xl overflow-hidden bg-gray-100 relative flex items-center justify-center">
        {imageStatus === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}
        
        {imageStatus === 'error' ? (
          <div className="flex flex-col items-center justify-center text-gray-400 p-4">
            <span className="text-6xl mb-2">{word.emoji}</span>
          </div>
        ) : (
          <img
            src={getArasaacUrl(word.arasaacId)}
            alt={word.word}
            className={`w-full h-full object-contain transition-opacity duration-300 ${
              imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageStatus('loaded')}
            onError={() => setImageStatus('error')}
          />
        )}
      </div>
      
      {/* Word with first letter highlighted */}
      <h2 className="text-3xl font-display text-gray-800 mb-3">
        <span 
          className="font-bold" 
          style={{ color: SOUND_GROUPS[word.sound]?.color || soundData.color }}
        >
          {word.word[0].toUpperCase()}
        </span>
        {word.word.slice(1)}
      </h2>
      
      {/* Speak button */}
      <button
        onClick={() => speak(word.word)}
        className="p-3 rounded-full hover:scale-110 transition-transform shadow-md"
        style={{ backgroundColor: `${soundData.color}20` }}
      >
        <Volume2 size={28} style={{ color: soundData.color }} />
      </button>

      {/* Feedback */}
      {feedback && (
        <div className={`mt-4 p-4 rounded-xl font-display text-lg ${
          feedback.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {feedback.correct ? (
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Great job!
            </div>
          ) : (
            <div>
              <span className="font-bold" style={{ color: SOUND_GROUPS[word.sound]?.color }}>
                {word.word[0].toUpperCase()}
              </span>
              {word.word.slice(1)} starts with "{word.word[0].toUpperCase()}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SoundSorter = () => {
  const navigate = useNavigate();
  
  // Game state
  const [selectedSound, setSelectedSound] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false);
  const [streak, setStreak] = useState(0);

  // Text to speech
  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Start game
  const startGame = (sound) => {
    const difficultySettings = DIFFICULTY_LEVELS[difficulty];
    setSelectedSound(sound);
    setWords(getGameWords(sound, difficultySettings.wordCount));
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setStreak(0);
    setShowResult(false);
    setFeedback(null);
    setGameStarted(true);
    
    // Announce the sound
    setTimeout(() => {
      speak(`Sort words that start with the ${sound} sound`);
    }, 500);
  };

  // Handle answer
  const handleAnswer = (isYes) => {
    const currentWord = words[currentIndex];
    const correct = (isYes && currentWord.isTarget) || (!isYes && !currentWord.isTarget);
    
    // Show feedback
    setFeedback({
      correct,
      word: currentWord.word,
    });

    // Update score and streak
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
    
    if (correct) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    // Speak feedback
    if (correct) {
      speak('Great!');
    } else {
      speak(`${currentWord.word} starts with ${currentWord.word[0]}`);
    }

    // Move to next word after delay
    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < words.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 2000);
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
              <ArrowLeft size={18} />
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
              className="p-2 text-gray-400 hover:text-[#8E6BBF] transition-colors"
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

          {/* Difficulty Selector */}
          <div className="bg-white rounded-2xl border-4 border-gray-200 p-4 mb-6">
            <h3 className="font-display text-lg text-gray-700 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#F8D14A]" />
              Difficulty
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => {
                const Icon = level.icon;
                const isSelected = difficulty === key;
                return (
                  <button
                    key={key}
                    onClick={() => setDifficulty(key)}
                    className={`p-3 rounded-xl border-3 flex flex-col items-center gap-1 transition-all
                              ${isSelected 
                                ? 'border-current bg-current/10' 
                                : 'border-gray-200 hover:border-gray-300'
                              }`}
                    style={{ 
                      borderColor: isSelected ? level.color : undefined,
                      color: isSelected ? level.color : '#666'
                    }}
                  >
                    <Icon size={24} />
                    <span className="font-display text-sm">{level.name}</span>
                    <span className="text-xs font-crayon opacity-70">{level.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound Grid */}
          <h3 className="font-display text-lg text-gray-700 mb-3">Choose a Sound:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(SOUND_GROUPS).map(([sound, data]) => (
              <button
                key={sound}
                onClick={() => startGame(sound)}
                className="p-5 rounded-2xl border-4 text-white font-display text-2xl
                           hover:scale-105 active:scale-95 transition-all shadow-lg
                           flex flex-col items-center gap-2"
                style={{ 
                  backgroundColor: data.color,
                  borderColor: data.color,
                }}
              >
                <span className="text-4xl">{data.letter}</span>
                <span className="text-sm opacity-80 font-crayon">
                  /{sound}/ sound
                </span>
              </button>
            ))}
          </div>
        </main>

        {/* Help Modal */}
        {showHelp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 border-4 border-[#8E6BBF]">
              <h3 className="font-display text-xl text-[#8E6BBF] mb-4 flex items-center gap-2">
                <HelpCircle size={24} />
                How to Play
              </h3>
              <ol className="space-y-4 font-crayon text-gray-600">
                <li className="flex gap-3">
                  <span className="bg-[#8E6BBF] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0">1</span>
                  <span>Pick a letter sound to practice</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#8E6BBF] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0">2</span>
                  <span>Look at each picture and say the word out loud</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#8E6BBF] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0">3</span>
                  <span>Tap <Check className="inline w-4 h-4 text-green-500" /> if the word starts with your sound</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#8E6BBF] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0">4</span>
                  <span>Tap <X className="inline w-4 h-4 text-red-500" /> if it starts with a different sound</span>
                </li>
              </ol>
              
              <div className="mt-6 p-3 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                <p className="font-crayon text-yellow-700 text-sm">
                  💡 <strong>Tip:</strong> Tap the speaker icon to hear the word spoken aloud!
                </p>
              </div>
              
              <button
                onClick={() => setShowHelp(false)}
                className="w-full mt-6 py-3 bg-[#8E6BBF] text-white font-display rounded-xl
                         hover:bg-purple-600 transition-colors"
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
    const perfectScore = score.correct === score.total;

    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4"
                style={{ borderColor: soundData.color }}>
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setGameStarted(false)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 
                         rounded-xl font-display font-bold transition-all hover:scale-105"
              style={{ borderColor: soundData.color, color: soundData.color }}
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <h1 className="text-xl font-display" style={{ color: soundData.color }}>
              {perfectScore ? '🎉 Perfect!' : 'Great Work!'}
            </h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          <div className={`bg-white rounded-3xl border-4 p-6 shadow-lg text-center
                          ${perfectScore ? 'border-[#F8D14A] animate-pulse-slow' : 'border-[#F8D14A]'}`}>
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center
                            ${perfectScore ? 'bg-gradient-to-br from-yellow-400 to-orange-400' : 'bg-[#F8D14A]'}`}>
              <Trophy size={48} className="text-white" />
            </div>
            
            <h2 className="text-2xl font-display text-[#F8D14A] mb-2">
              {perfectScore ? 'Perfect Score!' : 'Sound Sorting Complete!'}
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
                  size={36}
                  className={`transition-all ${
                    i < stars 
                      ? 'text-[#F8D14A] fill-[#F8D14A] drop-shadow-md' 
                      : 'text-gray-200'
                  }`}
                  style={{
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>

            {perfectScore && (
              <div className="mb-6 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                <p className="font-display text-purple-600">
                  ⭐ Amazing! You got them all right!
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => startGame(selectedSound)}
                className="flex-1 py-3 bg-[#5CB85C] text-white font-display rounded-xl
                           flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
              >
                <RotateCcw size={20} />
                Play Again
              </button>
              <button
                onClick={() => setGameStarted(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 font-display rounded-xl
                         hover:bg-gray-300 transition-colors"
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
            className="p-2.5 bg-white border-3 rounded-xl hover:bg-gray-50 transition-colors"
            style={{ borderColor: soundData.color }}
          >
            <X size={22} style={{ color: soundData.color }} />
          </button>
          
          <div className="flex-1 text-center">
            <span className="font-display text-lg" style={{ color: soundData.color }}>
              Does it start with "{soundData.letter}"?
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {streak >= 3 && (
              <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full animate-bounce">
                <Zap className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span className="font-display text-orange-600 text-sm">{streak}</span>
              </div>
            )}
            <div className="flex items-center gap-1 bg-green-100 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 text-green-600 fill-green-600" />
              <span className="font-display text-green-700">{score.correct}</span>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-gray-200">
          <div 
            className="h-full transition-all duration-500 ease-out"
            style={{ 
              width: `${((currentIndex + 1) / words.length) * 100}%`,
              backgroundColor: soundData.color 
            }}
          />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Target Sound Badge */}
        <div className="flex justify-center mb-5">
          <button
            onClick={() => speak(`${selectedSound} sound, like ${soundData.letter}`)}
            className="px-8 py-4 rounded-2xl text-white font-display text-3xl shadow-lg
                     hover:scale-105 active:scale-95 transition-transform flex items-center gap-3"
            style={{ backgroundColor: soundData.color }}
          >
            <span className="text-4xl">{soundData.letter}</span>
            <span className="text-xl opacity-80">/{selectedSound}/</span>
            <Volume2 size={24} className="opacity-70" />
          </button>
        </div>

        {/* Word Card */}
        {currentWord && (
          <WordCard 
            word={currentWord}
            soundData={soundData}
            speak={speak}
            feedback={feedback}
          />
        )}

        {/* Answer buttons */}
        {!feedback && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(false)}
              className="py-7 bg-red-50 border-4 border-red-400 text-red-600 font-display text-xl
                         rounded-2xl flex flex-col items-center gap-2 hover:bg-red-100 
                         active:scale-95 transition-all shadow-md"
            >
              <X size={44} strokeWidth={3} />
              No
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="py-7 bg-green-50 border-4 border-green-400 text-green-600 font-display text-xl
                         rounded-2xl flex flex-col items-center gap-2 hover:bg-green-100 
                         active:scale-95 transition-all shadow-md"
            >
              <Check size={44} strokeWidth={3} />
              Yes
            </button>
          </div>
        )}

        {/* Progress indicator */}
        <div className="mt-6 flex justify-center gap-1.5">
          {words.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all ${
                idx < currentIndex 
                  ? 'bg-green-400' 
                  : idx === currentIndex 
                    ? 'bg-current scale-125' 
                    : 'bg-gray-300'
              }`}
              style={{ 
                backgroundColor: idx === currentIndex ? soundData.color : undefined 
              }}
            />
          ))}
        </div>
        
        <p className="text-center text-gray-500 font-crayon mt-3">
          {currentIndex + 1} of {words.length}
        </p>
      </main>
    </div>
  );
};

export default SoundSorter;
