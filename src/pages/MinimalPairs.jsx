// MinimalPairs-v2.jsx - Enhanced phonological therapy with SCIP-inspired features
// Multiple approaches: Minimal Pairs, Multiple Oppositions, Maximal Oppositions

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Volume2, Check, X, RotateCcw, Trophy, Star, 
  Settings, BarChart2, Printer, ChevronLeft, ChevronRight,
  Users, Target, Zap, Layers, HelpCircle, Shuffle, Eye, Camera
} from 'lucide-react';
import { getPictogramUrl } from '../services/arasaac';

// Phonological approaches (inspired by SCIP)
const APPROACHES = {
  minimalPairs: {
    name: 'Minimal Pairs',
    description: 'Contrast two sounds that differ by one feature',
    icon: '🔄',
    color: '#4A9FD4',
    example: 'pat vs bat (voicing)',
  },
  multipleOppositions: {
    name: 'Multiple Oppositions',
    description: 'Contrast one error sound with multiple targets',
    icon: '🎯',
    color: '#E63B2E',
    example: '/d/ for /k/, /g/, /f/, /s/ → target all at once',
  },
  maximalOppositions: {
    name: 'Maximal Oppositions',
    description: 'Contrast sounds that differ by many features',
    icon: '⚡',
    color: '#8E6BBF',
    example: '/m/ vs /s/ (voice, place, manner)',
  },
  emptySet: {
    name: 'Empty Set',
    description: 'Use two unknown sounds to maximize change',
    icon: '🆕',
    color: '#F5A623',
    example: 'Both sounds are new to the child',
  },
};

// Comprehensive minimal pair sets organized by phonological process
const MINIMAL_PAIR_SETS = {
  // Voicing contrasts
  voicing: {
    name: 'Voicing',
    description: 'Voiced vs voiceless sounds',
    color: '#4A9FD4',
    pairs: [
      { 
        sound1: 'p', sound2: 'b',
        pairs: [
          { word1: 'pat', word2: 'bat', arasaacId1: null, arasaacId2: 2488 },
          { word1: 'pea', word2: 'bee', arasaacId1: 2724, arasaacId2: 2494 },
          { word1: 'pig', word2: 'big', arasaacId1: 2728, arasaacId2: null },
          { word1: 'cup', word2: 'cub', arasaacId1: 2532, arasaacId2: null },
          { word1: 'rope', word2: 'robe', arasaacId1: 2759, arasaacId2: null },
        ],
      },
      {
        sound1: 't', sound2: 'd',
        pairs: [
          { word1: 'two', word2: 'do', arasaacId1: 36594, arasaacId2: null },
          { word1: 'tie', word2: 'dye', arasaacId1: null, arasaacId2: null },
          { word1: 'time', word2: 'dime', arasaacId1: 2858, arasaacId2: null },
          { word1: 'train', word2: 'drain', arasaacId1: 2871, arasaacId2: null },
          { word1: 'coat', word2: 'code', arasaacId1: 2525, arasaacId2: null },
        ],
      },
      {
        sound1: 'k', sound2: 'g',
        pairs: [
          { word1: 'coat', word2: 'goat', arasaacId1: 2525, arasaacId2: 2562 },
          { word1: 'cap', word2: 'gap', arasaacId1: 2520, arasaacId2: null },
          { word1: 'came', word2: 'game', arasaacId1: null, arasaacId2: 6994 },
          { word1: 'class', word2: 'glass', arasaacId1: null, arasaacId2: 2561 },
          { word1: 'curl', word2: 'girl', arasaacId1: null, arasaacId2: 2564 },
        ],
      },
      {
        sound1: 'f', sound2: 'v',
        pairs: [
          { word1: 'fan', word2: 'van', arasaacId1: 2552, arasaacId2: 2878 },
          { word1: 'fast', word2: 'vast', arasaacId1: null, arasaacId2: null },
          { word1: 'fine', word2: 'vine', arasaacId1: null, arasaacId2: null },
          { word1: 'leaf', word2: 'leave', arasaacId1: 2588, arasaacId2: null },
          { word1: 'safe', word2: 'save', arasaacId1: null, arasaacId2: null },
        ],
      },
      {
        sound1: 's', sound2: 'z',
        pairs: [
          { word1: 'sip', word2: 'zip', arasaacId1: null, arasaacId2: null },
          { word1: 'Sue', word2: 'zoo', arasaacId1: null, arasaacId2: 2894 },
          { word1: 'seal', word2: 'zeal', arasaacId1: 2744, arasaacId2: null },
          { word1: 'price', word2: 'prize', arasaacId1: null, arasaacId2: null },
          { word1: 'ice', word2: 'eyes', arasaacId1: null, arasaacId2: 2550 },
        ],
      },
    ],
  },
  // Fronting (velar → alveolar)
  fronting: {
    name: 'Fronting',
    description: 'Back sounds replaced with front sounds',
    color: '#5CB85C',
    pairs: [
      {
        sound1: 't', sound2: 'k',
        pairs: [
          { word1: 'tea', word2: 'key', arasaacId1: 2810, arasaacId2: 2577 },
          { word1: 'two', word2: 'coo', arasaacId1: 36594, arasaacId2: null },
          { word1: 'tie', word2: 'kite', arasaacId1: null, arasaacId2: 2579 },
          { word1: 'tap', word2: 'cap', arasaacId1: null, arasaacId2: 2520 },
          { word1: 'top', word2: 'cop', arasaacId1: 2871, arasaacId2: null },
          { word1: 'tub', word2: 'cub', arasaacId1: 2491, arasaacId2: null },
        ],
      },
      {
        sound1: 'd', sound2: 'g',
        pairs: [
          { word1: 'dot', word2: 'got', arasaacId1: null, arasaacId2: null },
          { word1: 'date', word2: 'gate', arasaacId1: null, arasaacId2: 2558 },
          { word1: 'dumb', word2: 'gum', arasaacId1: null, arasaacId2: null },
          { word1: 'dame', word2: 'game', arasaacId1: null, arasaacId2: 6994 },
          { word1: 'dense', word2: 'geese', arasaacId1: null, arasaacId2: 2560 },
        ],
      },
    ],
  },
  // Stopping (fricative → stop)
  stopping: {
    name: 'Stopping',
    description: 'Fricatives replaced with stops',
    color: '#E86B9A',
    pairs: [
      {
        sound1: 't', sound2: 's',
        pairs: [
          { word1: 'tea', word2: 'sea', arasaacId1: 2810, arasaacId2: 2743 },
          { word1: 'top', word2: 'sop', arasaacId1: 2871, arasaacId2: null },
          { word1: 'tow', word2: 'sow', arasaacId1: null, arasaacId2: null },
          { word1: 'tip', word2: 'sip', arasaacId1: null, arasaacId2: null },
          { word1: 'toe', word2: 'so', arasaacId1: 2869, arasaacId2: null },
        ],
      },
      {
        sound1: 'd', sound2: 'th',
        pairs: [
          { word1: 'dough', word2: 'though', arasaacId1: null, arasaacId2: null },
          { word1: 'den', word2: 'then', arasaacId1: null, arasaacId2: null },
          { word1: 'dare', word2: 'there', arasaacId1: null, arasaacId2: null },
          { word1: 'day', word2: 'they', arasaacId1: null, arasaacId2: null },
        ],
      },
      {
        sound1: 'p', sound2: 'f',
        pairs: [
          { word1: 'pan', word2: 'fan', arasaacId1: 2719, arasaacId2: 2552 },
          { word1: 'peel', word2: 'feel', arasaacId1: null, arasaacId2: null },
          { word1: 'pool', word2: 'fool', arasaacId1: null, arasaacId2: null },
          { word1: 'pat', word2: 'fat', arasaacId1: null, arasaacId2: null },
          { word1: 'pine', word2: 'fine', arasaacId1: 2730, arasaacId2: null },
        ],
      },
    ],
  },
  // Gliding (liquids → glides)
  gliding: {
    name: 'Gliding',
    description: 'L and R replaced with W or Y',
    color: '#F5A623',
    pairs: [
      {
        sound1: 'w', sound2: 'r',
        pairs: [
          { word1: 'wed', word2: 'red', arasaacId1: null, arasaacId2: 2743 },
          { word1: 'wing', word2: 'ring', arasaacId1: null, arasaacId2: 2755 },
          { word1: 'wake', word2: 'rake', arasaacId1: null, arasaacId2: null },
          { word1: 'wag', word2: 'rag', arasaacId1: null, arasaacId2: null },
          { word1: 'west', word2: 'rest', arasaacId1: null, arasaacId2: null },
          { word1: 'weed', word2: 'read', arasaacId1: null, arasaacId2: 2786 },
        ],
      },
      {
        sound1: 'w', sound2: 'l',
        pairs: [
          { word1: 'wet', word2: 'let', arasaacId1: null, arasaacId2: null },
          { word1: 'wing', word2: 'ling', arasaacId1: null, arasaacId2: null },
          { word1: 'wake', word2: 'lake', arasaacId1: null, arasaacId2: 2584 },
          { word1: 'wag', word2: 'lag', arasaacId1: null, arasaacId2: null },
          { word1: 'wight', word2: 'light', arasaacId1: null, arasaacId2: 2592 },
          { word1: 'way', word2: 'lay', arasaacId1: null, arasaacId2: null },
        ],
      },
    ],
  },
  // Final consonant deletion
  finalConsonant: {
    name: 'Final Consonants',
    description: 'Words with and without final sounds',
    color: '#8E6BBF',
    pairs: [
      {
        sound1: 'CV', sound2: 'CVC',
        pairs: [
          { word1: 'bee', word2: 'beet', arasaacId1: 2494, arasaacId2: null },
          { word1: 'bow', word2: 'boat', arasaacId1: null, arasaacId2: 2504 },
          { word1: 'bow', word2: 'bowl', arasaacId1: null, arasaacId2: 2508 },
          { word1: 'tea', word2: 'team', arasaacId1: 2810, arasaacId2: null },
          { word1: 'pea', word2: 'peek', arasaacId1: 2724, arasaacId2: null },
          { word1: 'ray', word2: 'rain', arasaacId1: null, arasaacId2: 2738 },
        ],
      },
    ],
  },
};

// Multiple Oppositions sets (one error → multiple targets)
const MULTIPLE_OPPOSITIONS = {
  dCollapse: {
    name: '/d/ Phoneme Collapse',
    description: 'Child uses /d/ for multiple sounds',
    errorSound: 'd',
    targetSounds: ['k', 'g', 'f', 's'],
    color: '#E63B2E',
    words: [
      { error: 'do', targets: ['coo', 'goo', 'foo', 'sue'] },
      { error: 'dip', targets: ['kip', 'give', 'fit', 'sip'] },
      { error: 'date', targets: ['Kate', 'gate', 'fate', 'sate'] },
    ],
  },
  tCollapse: {
    name: '/t/ Phoneme Collapse',
    description: 'Child uses /t/ for multiple sounds',
    errorSound: 't',
    targetSounds: ['k', 'ch', 's', 'sh'],
    color: '#4A9FD4',
    words: [
      { error: 'tea', targets: ['key', 'chi', 'sea', 'she'] },
      { error: 'tip', targets: ['kip', 'chip', 'sip', 'ship'] },
      { error: 'tore', targets: ['core', 'chore', 'sore', 'shore'] },
    ],
  },
};

// Nonsense words for additional practice
const NONSENSE_PAIRS = {
  voicing: [
    { word1: 'pim', word2: 'bim' },
    { word1: 'taf', word2: 'daf' },
    { word1: 'kog', word2: 'gog' },
    { word1: 'fub', word2: 'vub' },
    { word1: 'sil', word2: 'zil' },
  ],
  fronting: [
    { word1: 'tee', word2: 'kee' },
    { word1: 'dop', word2: 'gop' },
    { word1: 'tat', word2: 'kat' },
  ],
};

const MinimalPairsV2 = () => {
  const navigate = useNavigate();
  
  // State
  const [approach, setApproach] = useState(null);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [selectedPairSet, setSelectedPairSet] = useState(null);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [gameMode, setGameMode] = useState('learn'); // learn, listen-choose, produce
  const [useNonsense, setUseNonsense] = useState(false);
  const [usePhotos, setUsePhotos] = useState(true); // Toggle illustrations vs photos
  const [showSettings, setShowSettings] = useState(false);
  
  // Data tracking
  const [sessionData, setSessionData] = useState({
    correct: 0,
    incorrect: 0,
    trials: [],
  });
  const [showDataPanel, setShowDataPanel] = useState(false);
  
  // Listen & Choose mode state
  const [targetWord, setTargetWord] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Text to speech
  const speak = useCallback((text, rate = 0.85) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Get current pair data
  const getCurrentPairs = () => {
    if (!selectedProcess || !selectedPairSet) return [];
    return MINIMAL_PAIR_SETS[selectedProcess].pairs[selectedPairSet].pairs;
  };

  const currentPairs = getCurrentPairs();
  const currentPair = currentPairs[currentPairIndex];

  // Setup Listen & Choose round
  const setupListenChoose = useCallback(() => {
    if (!currentPair) return;
    const isWord1 = Math.random() > 0.5;
    setTargetWord(isWord1 ? 'word1' : 'word2');
    setSelectedAnswer(null);
    setShowFeedback(false);
    
    // Speak the target after a delay
    setTimeout(() => {
      speak(isWord1 ? currentPair.word1 : currentPair.word2);
    }, 500);
  }, [currentPair, speak]);

  useEffect(() => {
    if (gameMode === 'listen-choose' && currentPair) {
      setupListenChoose();
    }
  }, [gameMode, currentPairIndex, currentPair]);

  // Handle answer selection
  const handleAnswer = (choice) => {
    setSelectedAnswer(choice);
    setShowFeedback(true);
    
    const correct = choice === targetWord;
    setSessionData(prev => ({
      ...prev,
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
      trials: [...prev.trials, {
        pair: `${currentPair.word1} / ${currentPair.word2}`,
        target: targetWord,
        response: choice,
        correct,
        timestamp: Date.now(),
      }],
    }));
  };

  // Navigation
  const nextPair = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setCurrentPairIndex(prev => (prev + 1) % currentPairs.length);
  };

  const prevPair = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setCurrentPairIndex(prev => (prev - 1 + currentPairs.length) % currentPairs.length);
  };

  // Calculate stats
  const totalTrials = sessionData.correct + sessionData.incorrect;
  const accuracy = totalTrials > 0 ? Math.round((sessionData.correct / totalTrials) * 100) : 0;

  // Approach selection screen
  if (!approach) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
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
                🔄 Sound Contrasts
              </h1>
              <p className="text-sm text-gray-500 font-crayon">Phonological therapy approaches</p>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Introduction */}
          <div className="bg-white rounded-2xl border-4 border-[#8E6BBF] p-5 mb-6 shadow-lg">
            <h2 className="font-display text-xl text-[#8E6BBF] mb-2 flex items-center gap-2">
              <Layers size={24} />
              Choose Your Approach
            </h2>
            <p className="font-crayon text-gray-600">
              Select a phonological therapy approach based on the child's needs.
              Each approach uses different contrasts to help reorganize the sound system.
            </p>
          </div>

          {/* Approach Selection */}
          <div className="space-y-4">
            {Object.entries(APPROACHES).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setApproach(key)}
                className="w-full bg-white rounded-2xl border-4 p-5 shadow-lg hover:scale-102 
                           transition-all text-left flex items-start gap-4"
                style={{ borderColor: data.color }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                     style={{ backgroundColor: `${data.color}20` }}>
                  {data.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg" style={{ color: data.color }}>
                    {data.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-crayon mb-2">{data.description}</p>
                  <p className="text-xs text-gray-400 font-crayon italic">
                    Example: {data.example}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Process selection (for minimal pairs approach)
  if (approach === 'minimalPairs' && !selectedProcess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4 border-[#4A9FD4]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setApproach(null)}
              className="p-2 bg-white border-3 border-[#4A9FD4] rounded-xl"
            >
              <ArrowLeft size={20} className="text-[#4A9FD4]" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-display text-[#4A9FD4]">
                🔄 Minimal Pairs
              </h1>
              <p className="text-sm text-gray-500 font-crayon">Select phonological process</p>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-white border-3 border-gray-300 rounded-xl"
            >
              <Settings size={20} className="text-gray-500" />
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border-2 border-gray-200">
              <h3 className="font-display text-gray-700 mb-3">Settings</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={useNonsense}
                    onChange={(e) => setUseNonsense(e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <span className="font-crayon text-gray-600">Include nonsense words</span>
                </label>
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={usePhotos}
                    onChange={(e) => setUsePhotos(e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <span className="font-crayon text-gray-600">Use pictograms (uncheck for text only)</span>
                </label>
              </div>
            </div>
          )}

          {/* Process Selection */}
          <h3 className="font-display text-gray-700 mb-3">Choose Phonological Process</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(MINIMAL_PAIR_SETS).map(([key, process]) => (
              <button
                key={key}
                onClick={() => setSelectedProcess(key)}
                className="bg-white rounded-2xl border-4 p-4 shadow-lg hover:scale-105 
                           transition-all text-left"
                style={{ borderColor: process.color }}
              >
                <h3 className="font-display text-lg" style={{ color: process.color }}>
                  {process.name}
                </h3>
                <p className="text-sm text-gray-500 font-crayon">{process.description}</p>
                <p className="text-xs text-gray-400 font-crayon mt-2">
                  {process.pairs.length} contrast sets
                </p>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Pair set selection
  if (approach === 'minimalPairs' && selectedProcess && selectedPairSet === null) {
    const processData = MINIMAL_PAIR_SETS[selectedProcess];
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4"
                style={{ borderColor: processData.color }}>
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSelectedProcess(null)}
              className="p-2 bg-white border-3 rounded-xl"
              style={{ borderColor: processData.color }}
            >
              <ArrowLeft size={20} style={{ color: processData.color }} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-display" style={{ color: processData.color }}>
                {processData.name}
              </h1>
              <p className="text-sm text-gray-500 font-crayon">Select sound contrast</p>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          <h3 className="font-display text-gray-700 mb-3">Choose Sound Pair</h3>
          <div className="space-y-3">
            {processData.pairs.map((pairSet, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedPairSet(idx);
                  setCurrentPairIndex(0);
                  setSessionData({ correct: 0, incorrect: 0, trials: [] });
                }}
                className="w-full bg-white rounded-xl border-4 p-4 shadow-lg hover:scale-102 
                           transition-all flex items-center gap-4"
                style={{ borderColor: processData.color }}
              >
                <div className="flex gap-2">
                  <span className="w-12 h-12 rounded-xl flex items-center justify-center 
                                 text-xl font-display text-white"
                        style={{ backgroundColor: processData.color }}>
                    /{pairSet.sound1}/
                  </span>
                  <span className="text-2xl self-center">↔</span>
                  <span className="w-12 h-12 rounded-xl flex items-center justify-center 
                                 text-xl font-display border-3"
                        style={{ borderColor: processData.color, color: processData.color }}>
                    /{pairSet.sound2}/
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-crayon text-gray-600">
                    {pairSet.pairs.length} word pairs
                  </p>
                  <p className="text-xs text-gray-400 font-crayon">
                    e.g., {pairSet.pairs[0].word1} vs {pairSet.pairs[0].word2}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Game Mode Selection */}
          <h3 className="font-display text-gray-700 mb-3 mt-6">Practice Mode</h3>
          <div className="flex gap-3">
            {[
              { key: 'learn', name: 'Learn', icon: Eye },
              { key: 'listen-choose', name: 'Listen & Choose', icon: Target },
              { key: 'produce', name: 'Produce', icon: Volume2 },
            ].map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.key}
                  onClick={() => setGameMode(mode.key)}
                  className={`flex-1 p-3 rounded-xl border-3 font-crayon text-sm
                             flex flex-col items-center gap-1 transition-all
                             ${gameMode === mode.key 
                               ? 'text-white' 
                               : ''}`}
                  style={{ 
                    backgroundColor: gameMode === mode.key ? processData.color : 'white',
                    borderColor: processData.color,
                    color: gameMode !== mode.key ? processData.color : undefined,
                  }}
                >
                  <Icon size={20} />
                  {mode.name}
                </button>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // Main practice screen
  if (approach === 'minimalPairs' && selectedProcess && selectedPairSet !== null) {
    const processData = MINIMAL_PAIR_SETS[selectedProcess];
    const pairSetData = processData.pairs[selectedPairSet];

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4"
                style={{ borderColor: processData.color }}>
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSelectedPairSet(null)}
              className="p-2 bg-white border-3 rounded-xl"
              style={{ borderColor: processData.color }}
            >
              <ArrowLeft size={20} style={{ color: processData.color }} />
            </button>
            
            <div className="flex-1 text-center">
              <span className="font-display" style={{ color: processData.color }}>
                /{pairSetData.sound1}/ vs /{pairSetData.sound2}/
              </span>
            </div>
            
            <button
              onClick={() => setShowDataPanel(!showDataPanel)}
              className="p-2 bg-white border-3 rounded-xl relative"
              style={{ borderColor: processData.color }}
            >
              <BarChart2 size={20} style={{ color: processData.color }} />
              {totalTrials > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs 
                               rounded-full flex items-center justify-center font-display">
                  {totalTrials}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Data Panel */}
        {showDataPanel && (
          <div className="bg-white border-b-2 border-gray-200 px-4 py-3">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-gray-700">Session Data</span>
                <span className="font-display text-lg" style={{ color: processData.color }}>
                  {accuracy}% Accuracy
                </span>
              </div>
              <div className="flex gap-4 text-sm font-crayon">
                <span className="text-green-600">✓ Correct: {sessionData.correct}</span>
                <span className="text-red-600">✗ Incorrect: {sessionData.incorrect}</span>
              </div>
              <div className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${accuracy}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <main className="max-w-md mx-auto px-4 py-6">
          {/* Mode indicator */}
          <div className="text-center mb-4">
            <span className="px-3 py-1 rounded-full text-sm font-crayon text-white"
                  style={{ backgroundColor: processData.color }}>
              {gameMode === 'learn' && '👀 Learn Mode'}
              {gameMode === 'listen-choose' && '🎧 Listen & Choose'}
              {gameMode === 'produce' && '🗣️ Produce Mode'}
            </span>
          </div>

          {/* LEARN MODE - Show both cards */}
          {gameMode === 'learn' && currentPair && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {['word1', 'word2'].map((wordKey) => (
                <button
                  key={wordKey}
                  onClick={() => speak(currentPair[wordKey])}
                  className="bg-white rounded-2xl border-4 p-4 shadow-lg hover:scale-105 
                             transition-all flex flex-col items-center"
                  style={{ borderColor: processData.color }}
                >
                  {usePhotos && currentPair[`arasaacId${wordKey === 'word1' ? '1' : '2'}`] && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 mb-3">
                      <img 
                        src={getPictogramUrl(currentPair[`arasaacId${wordKey === 'word1' ? '1' : '2'}`])}
                        alt={currentPair[wordKey]}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <span className="font-display text-xl" style={{ color: processData.color }}>
                    {currentPair[wordKey]}
                  </span>
                  <Volume2 size={16} className="mt-2 text-gray-400" />
                </button>
              ))}
            </div>
          )}

          {/* LISTEN & CHOOSE MODE */}
          {gameMode === 'listen-choose' && currentPair && (
            <>
              {/* Play target button */}
              <div className="text-center mb-6">
                <p className="font-crayon text-gray-500 mb-3">Listen and tap the matching picture:</p>
                <button
                  onClick={() => speak(currentPair[targetWord])}
                  className="px-8 py-4 rounded-full text-white font-display shadow-lg 
                             hover:shadow-xl transition-all"
                  style={{ backgroundColor: processData.color }}
                >
                  <Volume2 size={32} className="mx-auto" />
                  <span className="text-sm mt-1 block">Play Again</span>
                </button>
              </div>

              {/* Choice cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {['word1', 'word2'].map((wordKey) => {
                  const isSelected = selectedAnswer === wordKey;
                  const isCorrect = targetWord === wordKey;
                  const showResult = showFeedback && isSelected;
                  
                  return (
                    <button
                      key={wordKey}
                      onClick={() => !showFeedback && handleAnswer(wordKey)}
                      disabled={showFeedback}
                      className={`bg-white rounded-2xl border-4 p-4 shadow-lg transition-all 
                                 flex flex-col items-center
                                 ${!showFeedback ? 'hover:scale-105' : ''}
                                 ${showResult && isCorrect ? 'border-green-500 bg-green-50' : ''}
                                 ${showResult && !isCorrect ? 'border-red-500 bg-red-50' : ''}`}
                      style={{ 
                        borderColor: showResult 
                          ? (isCorrect ? '#22c55e' : '#ef4444') 
                          : processData.color 
                      }}
                    >
                      {usePhotos && currentPair[`arasaacId${wordKey === 'word1' ? '1' : '2'}`] && (
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 mb-3">
                          <img 
                            src={getPictogramUrl(currentPair[`arasaacId${wordKey === 'word1' ? '1' : '2'}`])}
                            alt={currentPair[wordKey]}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <span className="font-display text-xl" style={{ color: processData.color }}>
                        {currentPair[wordKey]}
                      </span>
                      {showResult && (
                        <div className="mt-2">
                          {isCorrect ? (
                            <Check size={24} className="text-green-500" />
                          ) : (
                            <X size={24} className="text-red-500" />
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {showFeedback && (
                <div className={`p-4 rounded-xl text-center font-display mb-4
                               ${selectedAnswer === targetWord 
                                 ? 'bg-green-100 text-green-700' 
                                 : 'bg-red-100 text-red-700'}`}>
                  {selectedAnswer === targetWord ? '🎉 Correct!' : `The word was "${currentPair[targetWord]}"`}
                </div>
              )}
            </>
          )}

          {/* PRODUCE MODE */}
          {gameMode === 'produce' && currentPair && (
            <div className="text-center">
              <p className="font-crayon text-gray-500 mb-4">Say each word clearly:</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {['word1', 'word2'].map((wordKey) => (
                  <div
                    key={wordKey}
                    className="bg-white rounded-2xl border-4 p-4 shadow-lg"
                    style={{ borderColor: processData.color }}
                  >
                    {usePhotos && currentPair[`arasaacId${wordKey === 'word1' ? '1' : '2'}`] && (
                      <div className="w-20 h-20 mx-auto rounded-xl overflow-hidden bg-gray-100 mb-3">
                        <img 
                          src={getPictogramUrl(currentPair[`arasaacId${wordKey === 'word1' ? '1' : '2'}`])}
                          alt={currentPair[wordKey]}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <span className="font-display text-xl block mb-2" 
                          style={{ color: processData.color }}>
                      {currentPair[wordKey]}
                    </span>
                    <button
                      onClick={() => speak(currentPair[wordKey])}
                      className="px-3 py-1 rounded-lg text-white text-sm font-crayon"
                      style={{ backgroundColor: processData.color }}
                    >
                      <Volume2 size={14} className="inline mr-1" /> Model
                    </button>
                  </div>
                ))}
              </div>

              {/* Scoring buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setSessionData(prev => ({ ...prev, correct: prev.correct + 1 }));
                    nextPair();
                  }}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl font-display 
                             flex items-center gap-2"
                >
                  <Check size={20} /> Correct
                </button>
                <button
                  onClick={() => {
                    setSessionData(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
                    nextPair();
                  }}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl font-display 
                             flex items-center gap-2"
                >
                  <X size={20} /> Try Again
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={prevPair}
              className="p-3 bg-white border-3 rounded-xl shadow"
              style={{ borderColor: processData.color }}
            >
              <ChevronLeft size={24} style={{ color: processData.color }} />
            </button>
            
            <div className="text-center">
              <span className="font-crayon text-gray-500">
                {currentPairIndex + 1} / {currentPairs.length}
              </span>
            </div>
            
            <button
              onClick={nextPair}
              className="p-3 bg-white border-3 rounded-xl shadow"
              style={{ borderColor: processData.color }}
            >
              <ChevronRight size={24} style={{ color: processData.color }} />
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1 mt-4">
            {currentPairs.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentPairIndex ? 'w-4' : ''
                }`}
                style={{ 
                  backgroundColor: idx === currentPairIndex ? processData.color : '#E5E7EB' 
                }}
              />
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Fallback for other approaches (placeholder)
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setApproach(null)}
            className="p-2 bg-white border-3 border-[#8E6BBF] rounded-xl"
          >
            <ArrowLeft size={20} className="text-[#8E6BBF]" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-display text-[#8E6BBF]">
              {APPROACHES[approach]?.name}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border-4 border-[#8E6BBF] p-8 text-center">
          <span className="text-6xl mb-4 block">{APPROACHES[approach]?.icon}</span>
          <h2 className="font-display text-xl text-[#8E6BBF] mb-2">
            {APPROACHES[approach]?.name}
          </h2>
          <p className="font-crayon text-gray-600 mb-4">
            {APPROACHES[approach]?.description}
          </p>
          <p className="text-sm text-gray-400 font-crayon">
            This approach is coming soon! For now, try Minimal Pairs.
          </p>
        </div>
      </main>
    </div>
  );
};

export default MinimalPairsV2;
