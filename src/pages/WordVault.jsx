// WordVault.jsx - Comprehensive word database with Word Vault-inspired features
// Organized by sound, position, syllable count with games and homework features

import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Volume2, Search, Filter, Mail, Shuffle, Star,
  ChevronRight, Grid, List, Play, Trophy, Settings, X,
  BookOpen, Mic, Check, RotateCcw, Zap, Target, Award
} from 'lucide-react';
import { getPictogramUrl } from '../services/arasaac';

// Comprehensive word database organized by sound
const WORD_DATABASE = {
  s: {
    name: 'S Sound',
    color: '#4A9FD4',
    words: {
      initial: {
        1: ['sun', 'sand', 'sock', 'soap', 'sit', 'sad', 'set', 'sip', 'six', 'sum'],
        2: ['sofa', 'sunny', 'super', 'salad', 'soccer', 'silly', 'summer', 'supper', 'sister', 'signal'],
        3: ['Saturday', 'submarine', 'suddenly', 'celebrate', 'sunflower', 'safari', 'saxophone', 'syllable', 'cinema', 'cereal'],
        4: ['supermarket', 'celebration', 'certificate', 'satisfaction', 'centimeter'],
      },
      medial: {
        1: [],
        2: ['icy', 'messy', 'bossy', 'fussy', 'grassy', 'dresser', 'lesson', 'missing', 'tossing', 'passing'],
        3: ['dinosaur', 'eraser', 'discover', 'December', 'newspaper', 'episode', 'classify', 'messenger', 'processor'],
        4: ['impossible', 'understanding', 'electricity', 'fascinating'],
      },
      final: {
        1: ['bus', 'yes', 'ice', 'gas', 'miss', 'kiss', 'boss', 'fuss', 'pass', 'less'],
        2: ['mouse', 'house', 'horse', 'dress', 'grass', 'goose', 'juice', 'peace', 'rice', 'voice'],
        3: ['octopus', 'compass', 'practice', 'lettuce', 'office', 'surface', 'promise', 'palace', 'necklace'],
        4: ['rhinoceros', 'hippopotamus', 'metropolis'],
      },
    },
    // Sample words with images for flashcard mode
    flashcards: [
      { word: 'sun', arasaacId: 2802, position: 'initial', syllables: 1 },
      { word: 'sock', arasaacId: 2795, position: 'initial', syllables: 1 },
      { word: 'soap', arasaacId: 2794, position: 'initial', syllables: 1 },
      { word: 'sand', arasaacId: 2736, position: 'initial', syllables: 1 },
      { word: 'soup', arasaacId: 2799, position: 'initial', syllables: 1 },
      { word: 'seal', arasaacId: 2744, position: 'initial', syllables: 1 },
      { word: 'dinosaur', arasaacId: 2538, position: 'medial', syllables: 3 },
      { word: 'bus', arasaacId: 2510, position: 'final', syllables: 1 },
      { word: 'house', arasaacId: 2563, position: 'final', syllables: 1 },
      { word: 'mouse', arasaacId: 2673, position: 'final', syllables: 1 },
      { word: 'dress', arasaacId: 2544, position: 'final', syllables: 1 },
      { word: 'horse', arasaacId: 2566, position: 'final', syllables: 1 },
    ],
  },
  r: {
    name: 'R Sound',
    color: '#E63B2E',
    words: {
      initial: {
        1: ['run', 'red', 'rat', 'rug', 'rip', 'rob', 'rock', 'rain', 'ring', 'road'],
        2: ['rabbit', 'rainbow', 'robot', 'rocket', 'river', 'really', 'reading', 'racing', 'rolling', 'running'],
        3: ['rectangle', 'remember', 'wonderful', 'dinosaur', 'radio', 'relative', 'referee', 'restaurant'],
        4: ['refrigerator', 'responsible', 'relationship', 'rehabilitation'],
      },
      medial: {
        1: [],
        2: ['carrot', 'parrot', 'arrow', 'berry', 'sorry', 'cherry', 'carry', 'marry', 'mirror', 'pirate'],
        3: ['umbrella', 'tomorrow', 'library', 'kangaroo', 'gorilla', 'aspirin', 'different', 'butterfly'],
        4: ['alligator', 'accelerate', 'watermelon', 'temperature'],
      },
      final: {
        1: ['car', 'star', 'door', 'four', 'bear', 'chair', 'hair', 'pear', 'air', 'ear'],
        2: ['feather', 'weather', 'mother', 'father', 'brother', 'finger', 'sister', 'water', 'butter', 'doctor'],
        3: ['computer', 'cucumber', 'remember', 'calendar', 'hamster', 'monster', 'semester'],
        4: ['thermometer', 'refrigerator', 'calculator', 'administrator'],
      },
    },
    flashcards: [
      { word: 'rain', arasaacId: 2738, position: 'initial', syllables: 1 },
      { word: 'rabbit', arasaacId: 2735, position: 'initial', syllables: 2 },
      { word: 'rainbow', arasaacId: 2739, position: 'initial', syllables: 2 },
      { word: 'rocket', arasaacId: 2757, position: 'initial', syllables: 2 },
      { word: 'robot', arasaacId: 2758, position: 'initial', syllables: 2 },
      { word: 'ring', arasaacId: 2755, position: 'initial', syllables: 1 },
      { word: 'carrot', arasaacId: 2512, position: 'medial', syllables: 2 },
      { word: 'parrot', arasaacId: 2722, position: 'medial', syllables: 2 },
      { word: 'car', arasaacId: 2511, position: 'final', syllables: 1 },
      { word: 'star', arasaacId: 2800, position: 'final', syllables: 1 },
      { word: 'door', arasaacId: 2541, position: 'final', syllables: 1 },
      { word: 'dinosaur', arasaacId: 2538, position: 'final', syllables: 3 },
    ],
  },
  l: {
    name: 'L Sound',
    color: '#5CB85C',
    words: {
      initial: {
        1: ['lip', 'leg', 'lid', 'lake', 'lamp', 'leaf', 'lion', 'lock', 'log', 'love'],
        2: ['ladder', 'lemon', 'letter', 'lily', 'lizard', 'lobby', 'lollipop', 'lucky', 'lunchbox'],
        3: ['ladybug', 'library', 'lemonade', 'limousine', 'Labrador', 'librarian'],
        4: ['laboratory', 'legislature'],
      },
      medial: {
        1: [],
        2: ['balloon', 'yellow', 'jelly', 'pillow', 'follow', 'valley', 'silly', 'hello', 'jolly', 'belly'],
        3: ['elephant', 'celebrate', 'umbrella', 'volcano', 'chili', 'broccoli', 'catalog'],
        4: ['caterpillar', 'chocolate', 'watermelon', 'calculator'],
      },
      final: {
        1: ['ball', 'bell', 'bowl', 'doll', 'fall', 'full', 'hill', 'owl', 'pool', 'wheel'],
        2: ['apple', 'bottle', 'camel', 'castle', 'eagle', 'little', 'middle', 'noodle', 'pencil', 'puzzle'],
        3: ['animal', 'bicycle', 'broccoli', 'hospital', 'principal', 'triangle', 'vegetable'],
        4: ['automobile', 'basketball', 'caterpillar', 'comfortable'],
      },
    },
    flashcards: [
      { word: 'lion', arasaacId: 2596, position: 'initial', syllables: 1 },
      { word: 'lamp', arasaacId: 2585, position: 'initial', syllables: 1 },
      { word: 'leaf', arasaacId: 2588, position: 'initial', syllables: 1 },
      { word: 'lemon', arasaacId: 2589, position: 'initial', syllables: 2 },
      { word: 'ladder', arasaacId: 2583, position: 'initial', syllables: 2 },
      { word: 'lollipop', arasaacId: 2602, position: 'initial', syllables: 3 },
      { word: 'balloon', arasaacId: 2484, position: 'medial', syllables: 2 },
      { word: 'elephant', arasaacId: 2548, position: 'medial', syllables: 3 },
      { word: 'ball', arasaacId: 2483, position: 'final', syllables: 1 },
      { word: 'bell', arasaacId: 2497, position: 'final', syllables: 1 },
      { word: 'owl', arasaacId: 2717, position: 'final', syllables: 1 },
      { word: 'apple', arasaacId: 2479, position: 'final', syllables: 2 },
    ],
  },
  th: {
    name: 'TH Sound',
    color: '#8E6BBF',
    words: {
      initial: {
        1: ['the', 'this', 'that', 'them', 'think', 'thing', 'thank', 'thick', 'thin', 'three'],
        2: ['thinker', 'thankful', 'thunder', 'thermos', 'thirty', 'thirsty', 'Thursday', 'thriller'],
        3: ['therapy', 'thousand', 'thoughtful', 'theater', 'thermometer', 'thanksgiving'],
        4: [],
      },
      medial: {
        1: [],
        2: ['bathtub', 'toothbrush', 'birthday', 'nothing', 'something', 'anything', 'everything', 'within'],
        3: ['athletic', 'arithmetic', 'marathon', 'enthusiasm', 'pathetic'],
        4: [],
      },
      final: {
        1: ['bath', 'math', 'path', 'with', 'both', 'moth', 'tooth', 'mouth', 'earth', 'worth'],
        2: ['beneath', 'mammoth', 'Plymouth', 'seventh', 'growth'],
        3: ['tablecloth', 'underneath'],
        4: [],
      },
    },
    flashcards: [
      { word: 'thumb', arasaacId: 36472, position: 'initial', syllables: 1 },
      { word: 'three', arasaacId: 36590, position: 'initial', syllables: 1 },
      { word: 'bathtub', arasaacId: 2491, position: 'medial', syllables: 2 },
      { word: 'toothbrush', arasaacId: 6056, position: 'medial', syllables: 2 },
      { word: 'birthday', arasaacId: 2503, position: 'medial', syllables: 2 },
      { word: 'mouth', arasaacId: 2671, position: 'final', syllables: 1 },
      { word: 'tooth', arasaacId: 2869, position: 'final', syllables: 1 },
      { word: 'bath', arasaacId: 2490, position: 'final', syllables: 1 },
    ],
  },
};

// Game modes
const GAME_MODES = {
  flashcards: { name: 'Flashcards', icon: BookOpen, description: 'Practice with picture cards' },
  treasureHunt: { name: 'Treasure Hunt', icon: Trophy, description: 'Find words to collect jewels' },
  wordMatch: { name: 'Word Match', icon: Target, description: 'Match words to pictures' },
};

const WordVault = () => {
  const navigate = useNavigate();
  
  // State
  const [selectedSound, setSelectedSound] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // list, flashcards, game
  const [gameMode, setGameMode] = useState(null);
  
  // Filters
  const [positionFilter, setPositionFilter] = useState('all'); // all, initial, medial, final
  const [syllableFilter, setSyllableFilter] = useState('all'); // all, 1, 2, 3, 4
  const [searchTerm, setSearchTerm] = useState('');
  
  // Flashcard state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showWord, setShowWord] = useState(true);
  
  // Game state
  const [gameScore, setGameScore] = useState(0);
  const [gameWords, setGameWords] = useState([]);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [gameAnswer, setGameAnswer] = useState(null);
  const [showGameResult, setShowGameResult] = useState(false);
  
  // Homework state
  const [selectedWords, setSelectedWords] = useState([]);
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);

  // Text to speech
  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Get filtered word list
  const getFilteredWords = useMemo(() => {
    if (!selectedSound) return [];
    
    const soundData = WORD_DATABASE[selectedSound];
    let allWords = [];
    
    const positions = positionFilter === 'all' 
      ? ['initial', 'medial', 'final'] 
      : [positionFilter];
    
    const syllables = syllableFilter === 'all'
      ? ['1', '2', '3', '4']
      : [syllableFilter];
    
    positions.forEach(pos => {
      syllables.forEach(syl => {
        const words = soundData.words[pos]?.[syl] || [];
        words.forEach(word => {
          allWords.push({
            word,
            position: pos,
            syllables: parseInt(syl),
          });
        });
      });
    });
    
    if (searchTerm) {
      allWords = allWords.filter(w => 
        w.word.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return allWords;
  }, [selectedSound, positionFilter, syllableFilter, searchTerm]);

  // Get filtered flashcards
  const getFilteredFlashcards = useMemo(() => {
    if (!selectedSound) return [];
    
    let cards = WORD_DATABASE[selectedSound].flashcards;
    
    if (positionFilter !== 'all') {
      cards = cards.filter(c => c.position === positionFilter);
    }
    
    if (syllableFilter !== 'all') {
      cards = cards.filter(c => c.syllables === parseInt(syllableFilter));
    }
    
    return cards;
  }, [selectedSound, positionFilter, syllableFilter]);

  // Toggle word selection for homework
  const toggleWordSelection = (word) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  // Start game
  const startGame = (mode) => {
    const cards = getFilteredFlashcards;
    if (cards.length < 4) {
      alert('Need at least 4 cards to play. Adjust your filters.');
      return;
    }
    
    setGameMode(mode);
    setViewMode('game');
    setGameScore(0);
    setCurrentGameIndex(0);
    setGameWords([...cards].sort(() => Math.random() - 0.5));
    setGameAnswer(null);
    setShowGameResult(false);
  };

  // Handle game answer
  const handleGameAnswer = (isCorrect) => {
    setGameAnswer(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setGameScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentGameIndex < gameWords.length - 1) {
        setCurrentGameIndex(prev => prev + 1);
        setGameAnswer(null);
      } else {
        setShowGameResult(true);
      }
    }, 1000);
  };

  const soundData = selectedSound ? WORD_DATABASE[selectedSound] : null;

  // Sound selection screen
  if (!selectedSound) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/speech-therapy')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F5A623] 
                         rounded-xl font-display font-bold text-[#F5A623] hover:bg-[#F5A623] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-display text-[#F5A623] flex items-center gap-2">
                📚 Word Vault
              </h1>
              <p className="text-sm text-gray-500 font-crayon">Comprehensive word lists & games</p>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Introduction */}
          <div className="bg-white rounded-2xl border-4 border-[#F5A623] p-5 mb-6 shadow-lg">
            <h2 className="font-display text-xl text-[#F5A623] mb-2 flex items-center gap-2">
              <BookOpen size={24} />
              Your Speech Word Library
            </h2>
            <p className="font-crayon text-gray-600">
              Access thousands of words organized by sound, position, and syllable count. 
              Use flashcards, play games, and create homework lists!
            </p>
          </div>

          {/* Sound Selection */}
          <h3 className="font-display text-gray-700 mb-3">Choose a Sound</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(WORD_DATABASE).map(([key, sound]) => {
              const totalWords = ['initial', 'medial', 'final'].reduce((sum, pos) => {
                return sum + Object.values(sound.words[pos]).flat().length;
              }, 0);
              
              return (
                <button
                  key={key}
                  onClick={() => setSelectedSound(key)}
                  className="bg-white rounded-2xl border-4 p-5 shadow-lg hover:scale-105 
                             transition-all text-left"
                  style={{ borderColor: sound.color }}
                >
                  <div className="text-3xl font-display mb-2" style={{ color: sound.color }}>
                    /{key}/
                  </div>
                  <h3 className="font-display" style={{ color: sound.color }}>
                    {sound.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-crayon">
                    {totalWords}+ words • {sound.flashcards.length} flashcards
                  </p>
                </button>
              );
            })}
          </div>

          {/* Features Preview */}
          <div className="mt-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4">
            <h3 className="font-display text-gray-700 mb-3">Features</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-white shadow flex items-center justify-center mb-2">
                  <List size={24} className="text-[#F5A623]" />
                </div>
                <span className="text-xs font-crayon text-gray-600">Word Lists</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-white shadow flex items-center justify-center mb-2">
                  <BookOpen size={24} className="text-[#F5A623]" />
                </div>
                <span className="text-xs font-crayon text-gray-600">Flashcards</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-white shadow flex items-center justify-center mb-2">
                  <Trophy size={24} className="text-[#F5A623]" />
                </div>
                <span className="text-xs font-crayon text-gray-600">Games</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Game result screen
  if (viewMode === 'game' && showGameResult) {
    const percentage = Math.round((gameScore / gameWords.length) * 100);
    const stars = Math.ceil(percentage / 20);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4 border-[#F8D14A]">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <h1 className="text-xl font-display text-center text-[#F8D14A]">
              Game Complete!
            </h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl border-4 border-[#F8D14A] p-6 shadow-lg text-center">
            <Trophy size={64} className="mx-auto text-[#F8D14A] mb-4" />
            <h2 className="text-2xl font-display text-[#F8D14A] mb-2">Great Job!</h2>
            
            <div className="my-6">
              <div className="text-5xl font-display" style={{ color: soundData.color }}>
                {gameScore} / {gameWords.length}
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
                onClick={() => startGame(gameMode)}
                className="flex-1 py-3 bg-[#5CB85C] text-white font-display rounded-xl
                           flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Play Again
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="flex-1 py-3 bg-gray-200 text-gray-700 font-display rounded-xl"
              >
                Back to Words
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Game mode - Word Match
  if (viewMode === 'game' && gameMode === 'wordMatch') {
    const currentWord = gameWords[currentGameIndex];
    const options = useMemo(() => {
      const others = gameWords
        .filter((_, i) => i !== currentGameIndex)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      return [...others, currentWord].sort(() => Math.random() - 0.5);
    }, [currentGameIndex, gameWords, currentWord]);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4"
                style={{ borderColor: soundData.color }}>
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setViewMode('list')}
              className="p-2 bg-white border-3 rounded-xl"
              style={{ borderColor: soundData.color }}
            >
              <X size={20} style={{ color: soundData.color }} />
            </button>
            <div className="flex-1 text-center">
              <span className="font-display" style={{ color: soundData.color }}>
                🎯 Word Match
              </span>
            </div>
            <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
              <span className="font-display text-yellow-700">{gameScore}</span>
            </div>
          </div>
          <div className="h-2 bg-gray-200">
            <div 
              className="h-full transition-all"
              style={{ 
                width: `${((currentGameIndex + 1) / gameWords.length) * 100}%`,
                backgroundColor: soundData.color,
              }}
            />
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-6">
          <p className="text-center font-crayon text-gray-500 mb-4">
            Tap the picture that matches the word:
          </p>
          
          {/* Target word */}
          <div className="bg-white rounded-2xl border-4 shadow-xl p-6 mb-6 text-center"
               style={{ borderColor: soundData.color }}>
            <span className="text-4xl font-display" style={{ color: soundData.color }}>
              {currentWord.word}
            </span>
            <button
              onClick={() => speak(currentWord.word)}
              className="block mx-auto mt-3 px-4 py-2 rounded-xl text-white font-crayon"
              style={{ backgroundColor: soundData.color }}
            >
              <Volume2 size={18} className="inline mr-2" /> Listen
            </button>
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-2 gap-4">
            {options.map((option, idx) => {
              const isSelected = gameAnswer !== null;
              const isCorrect = option.word === currentWord.word;
              
              return (
                <button
                  key={idx}
                  onClick={() => !isSelected && handleGameAnswer(isCorrect)}
                  disabled={isSelected}
                  className={`bg-white rounded-xl border-4 p-4 shadow-lg transition-all
                             ${!isSelected ? 'hover:scale-105' : ''}
                             ${isSelected && isCorrect ? 'border-green-500 bg-green-50' : ''}
                             ${isSelected && !isCorrect && option.word !== currentWord.word ? 'opacity-50' : ''}`}
                  style={{ borderColor: !isSelected ? soundData.color : undefined }}
                >
                  {option.arasaacId && (
                    <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={getPictogramUrl(option.arasaacId)}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  {isSelected && isCorrect && (
                    <Check size={24} className="mx-auto mt-2 text-green-500" />
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-center text-gray-400 font-crayon mt-6">
            {currentGameIndex + 1} / {gameWords.length}
          </p>
        </main>
      </div>
    );
  }

  // Main vault view (list/flashcards)
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4"
              style={{ borderColor: soundData.color }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSelectedSound(null)}
            className="p-2 bg-white border-3 rounded-xl"
            style={{ borderColor: soundData.color }}
          >
            <ArrowLeft size={20} style={{ color: soundData.color }} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-display" style={{ color: soundData.color }}>
              /{selectedSound}/ {soundData.name}
            </h1>
          </div>
          
          {/* View mode toggle */}
          <div className="flex border-2 rounded-lg overflow-hidden"
               style={{ borderColor: soundData.color }}>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'text-white' : ''}`}
              style={{ backgroundColor: viewMode === 'list' ? soundData.color : 'white' }}
            >
              <List size={18} style={{ color: viewMode === 'list' ? 'white' : soundData.color }} />
            </button>
            <button
              onClick={() => setViewMode('flashcards')}
              className={`p-2 ${viewMode === 'flashcards' ? 'text-white' : ''}`}
              style={{ backgroundColor: viewMode === 'flashcards' ? soundData.color : 'white' }}
            >
              <Grid size={18} style={{ color: viewMode === 'flashcards' ? 'white' : soundData.color }} />
            </button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          {/* Position filter */}
          <div className="flex gap-2 mb-3">
            {['all', 'initial', 'medial', 'final'].map((pos) => (
              <button
                key={pos}
                onClick={() => setPositionFilter(pos)}
                className={`px-3 py-1.5 rounded-lg text-sm font-crayon transition-all
                           ${positionFilter === pos ? 'text-white' : 'bg-gray-100 text-gray-600'}`}
                style={{ backgroundColor: positionFilter === pos ? soundData.color : undefined }}
              >
                {pos === 'all' ? 'All Positions' : pos.charAt(0).toUpperCase() + pos.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Syllable filter */}
          <div className="flex gap-2 mb-3">
            <span className="text-sm font-crayon text-gray-500 self-center">Syllables:</span>
            {['all', '1', '2', '3', '4'].map((syl) => (
              <button
                key={syl}
                onClick={() => setSyllableFilter(syl)}
                className={`w-8 h-8 rounded-lg text-sm font-display transition-all
                           ${syllableFilter === syl ? 'text-white' : 'bg-gray-100 text-gray-600'}`}
                style={{ backgroundColor: syllableFilter === syl ? soundData.color : undefined }}
              >
                {syl === 'all' ? '∞' : syl}
              </button>
            ))}
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl 
                         font-crayon focus:outline-none focus:border-opacity-50"
              style={{ focusBorderColor: soundData.color }}
            />
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Stats bar */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-crayon text-gray-500">
            {viewMode === 'list' ? getFilteredWords.length : getFilteredFlashcards.length} words
          </span>
          
          <div className="flex gap-2">
            {/* Game buttons */}
            <button
              onClick={() => startGame('wordMatch')}
              className="px-3 py-1.5 rounded-lg text-sm font-crayon flex items-center gap-1"
              style={{ backgroundColor: `${soundData.color}20`, color: soundData.color }}
            >
              <Target size={14} /> Play Game
            </button>
            
            {/* Homework button */}
            {selectedWords.length > 0 && (
              <button
                onClick={() => setShowHomeworkModal(true)}
                className="px-3 py-1.5 rounded-lg text-sm font-crayon flex items-center gap-1
                           bg-green-100 text-green-700"
              >
                <Mail size={14} /> Homework ({selectedWords.length})
              </button>
            )}
          </div>
        </div>

        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <div className="space-y-2">
            {getFilteredWords.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-crayon text-gray-500">No words match your filters.</p>
                <button
                  onClick={() => {
                    setPositionFilter('all');
                    setSyllableFilter('all');
                    setSearchTerm('');
                  }}
                  className="mt-2 text-sm font-crayon"
                  style={{ color: soundData.color }}
                >
                  Reset filters
                </button>
              </div>
            ) : (
              getFilteredWords.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border-2 border-gray-200 p-3 flex items-center gap-3
                             hover:border-gray-300 transition-colors"
                >
                  <button
                    onClick={() => toggleWordSelection(item.word)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center
                               ${selectedWords.includes(item.word) 
                                 ? 'border-green-500 bg-green-500' 
                                 : 'border-gray-300'}`}
                  >
                    {selectedWords.includes(item.word) && (
                      <Check size={14} className="text-white" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => speak(item.word)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Volume2 size={18} style={{ color: soundData.color }} />
                  </button>
                  
                  <span className="flex-1 font-crayon text-gray-800">{item.word}</span>
                  
                  <span className="text-xs font-crayon px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                    {item.position}
                  </span>
                  <span className="text-xs font-crayon px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                    {item.syllables} syl
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* FLASHCARD VIEW */}
        {viewMode === 'flashcards' && (
          <>
            {getFilteredFlashcards.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-crayon text-gray-500">No flashcards match your filters.</p>
              </div>
            ) : (
              <>
                {/* Flashcard */}
                <div className="bg-white rounded-3xl border-4 shadow-xl p-6 mb-6"
                     style={{ borderColor: soundData.color }}>
                  {getFilteredFlashcards[currentCardIndex]?.arasaacId && (
                    <div className="w-40 h-40 mx-auto rounded-xl overflow-hidden bg-gray-100 mb-4">
                      <img 
                        src={getPictogramUrl(getFilteredFlashcards[currentCardIndex].arasaacId)}
                        alt={getFilteredFlashcards[currentCardIndex].word}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  
                  {showWord && (
                    <p className="text-center text-3xl font-display mb-4"
                       style={{ color: soundData.color }}>
                      {getFilteredFlashcards[currentCardIndex].word}
                    </p>
                  )}
                  
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => speak(getFilteredFlashcards[currentCardIndex].word)}
                      className="px-4 py-2 rounded-xl text-white font-crayon"
                      style={{ backgroundColor: soundData.color }}
                    >
                      <Volume2 size={18} className="inline mr-2" /> Listen
                    </button>
                    <button
                      onClick={() => setShowWord(!showWord)}
                      className="px-4 py-2 rounded-xl border-2 font-crayon"
                      style={{ borderColor: soundData.color, color: soundData.color }}
                    >
                      {showWord ? 'Hide Word' : 'Show Word'}
                    </button>
                  </div>
                  
                  <div className="mt-4 text-center text-sm font-crayon text-gray-500">
                    {getFilteredFlashcards[currentCardIndex].position} • 
                    {getFilteredFlashcards[currentCardIndex].syllables} syllable(s)
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setCurrentCardIndex(prev => 
                      (prev - 1 + getFilteredFlashcards.length) % getFilteredFlashcards.length
                    )}
                    className="p-3 bg-white border-3 rounded-xl shadow"
                    style={{ borderColor: soundData.color }}
                  >
                    <ArrowLeft size={24} style={{ color: soundData.color }} />
                  </button>
                  
                  <span className="font-crayon text-gray-500">
                    {currentCardIndex + 1} / {getFilteredFlashcards.length}
                  </span>
                  
                  <button
                    onClick={() => setCurrentCardIndex(prev => 
                      (prev + 1) % getFilteredFlashcards.length
                    )}
                    className="p-3 bg-white border-3 rounded-xl shadow"
                    style={{ borderColor: soundData.color }}
                  >
                    <ChevronRight size={24} style={{ color: soundData.color }} />
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Homework Modal */}
      {showHomeworkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 p-6 max-w-md w-full shadow-2xl"
               style={{ borderColor: soundData.color }}>
            <h2 className="text-xl font-display mb-4" style={{ color: soundData.color }}>
              📋 Homework Word List
            </h2>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-4 max-h-48 overflow-y-auto">
              <p className="font-crayon text-gray-700 mb-2">
                <strong>Sound:</strong> /{selectedSound}/ - {soundData.name}
              </p>
              <p className="font-crayon text-gray-700 mb-2">
                <strong>Words ({selectedWords.length}):</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedWords.map((word, idx) => (
                  <span key={idx} className="px-2 py-1 bg-white rounded border text-sm font-crayon">
                    {word}
                  </span>
                ))}
              </div>
            </div>
            
            <p className="text-sm text-gray-500 font-crayon mb-4">
              Practice each word 5-10 times per day. Say the word clearly and 
              listen to yourself!
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  // Copy to clipboard
                  const text = `Speech Homework - ${soundData.name}\n\nWords to practice:\n${selectedWords.join('\n')}\n\nPractice each word 5-10 times per day!`;
                  navigator.clipboard.writeText(text);
                  alert('Word list copied to clipboard!');
                }}
                className="flex-1 py-3 text-white font-display rounded-xl flex items-center 
                           justify-center gap-2"
                style={{ backgroundColor: soundData.color }}
              >
                <Mail size={18} /> Copy List
              </button>
              <button
                onClick={() => {
                  setSelectedWords([]);
                  setShowHomeworkModal(false);
                }}
                className="px-4 py-3 bg-gray-200 text-gray-700 font-display rounded-xl"
              >
                Clear
              </button>
              <button
                onClick={() => setShowHomeworkModal(false)}
                className="px-4 py-3 bg-gray-100 text-gray-500 font-display rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordVault;
