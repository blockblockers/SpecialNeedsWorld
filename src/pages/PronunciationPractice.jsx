// PronunciationPractice.jsx - Practice pronouncing words with visual feedback
// Uses native Web Speech APIs for text-to-speech and speech recognition
// Categories and words are stored in database for community sharing

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Volume2, 
  Mic, 
  MicOff, 
  SkipForward, 
  RotateCcw,
  Check,
  X,
  Star,
  Trophy,
  Play,
  Pause,
  Settings,
  Sparkles,
  HelpCircle,
  Plus,
  Loader2,
  Users,
  Search,
  Lightbulb
} from 'lucide-react';
import { searchPictograms, getPictogramUrl } from '../services/arasaac';
import { useAuth } from '../App';
import {
  getCategories,
  getCategoryWords,
  requestNewCategory,
  requestMoreWords,
  incrementCategoryUseCount,
  DEFAULT_CATEGORIES,
} from '../services/pronunciation';

// ============================================
// SPEECH SYNTHESIS (Text-to-Speech)
// ============================================

const speak = (text, rate = 0.8) => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.log('Speech synthesis not supported');
      resolve();
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate; // Slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to use a clear English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female')) ||
                         voices.find(v => v.lang.startsWith('en-US')) ||
                         voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    
    window.speechSynthesis.speak(utterance);
  });
};

// ============================================
// SPEECH RECOGNITION
// ============================================

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// ============================================
// MAIN COMPONENT
// ============================================

const PronunciationPractice = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Categories from database
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  // Game state
  const [view, setView] = useState('menu'); // menu, practice, results, request
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryWords, setCategoryWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState([]);
  
  // Speech state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect', null
  const [showHint, setShowHint] = useState(false);
  
  // ARASAAC image
  const [pictogramId, setPictogramId] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  
  // Settings
  const [speechRate, setSpeechRate] = useState(0.8);
  const [autoPlayWord, setAutoPlayWord] = useState(true);
  
  // New category request state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [showAddWordsModal, setShowAddWordsModal] = useState(false);
  const [isAddingWords, setIsAddingWords] = useState(false);
  
  // Recognition ref
  const recognitionRef = useRef(null);
  
  // Current word
  const currentWord = categoryWords[currentWordIndex];
  
  // Load categories on mount
  useEffect(() => {
    const loadCats = async () => {
      setLoadingCategories(true);
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories(DEFAULT_CATEGORIES);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCats();
  }, []);
  
  // Load voices on mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Chrome requires this to load voices
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);
  
  // Load pictogram when word changes
  useEffect(() => {
    if (!currentWord) return;
    
    const loadPictogram = async () => {
      setLoadingImage(true);
      setPictogramId(null);
      
      try {
        const results = await searchPictograms(currentWord.word, 'en');
        if (results && results.length > 0) {
          setPictogramId(results[0]._id);
        }
      } catch (error) {
        console.error('Error loading pictogram:', error);
      } finally {
        setLoadingImage(false);
      }
    };
    
    loadPictogram();
  }, [currentWord]);
  
  // Auto-play word when it appears
  useEffect(() => {
    if (currentWord && autoPlayWord && view === 'practice') {
      const timer = setTimeout(() => {
        playWord();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentWord, autoPlayWord, view]);
  
  // Initialize speech recognition
  useEffect(() => {
    if (!SpeechRecognition) return;
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 3;
    
    recognition.onresult = (event) => {
      const results = event.results[0];
      const transcript = results[0].transcript.toLowerCase().trim();
      setSpokenText(transcript);
      
      // Check all alternatives for a match
      let matched = false;
      for (let i = 0; i < results.length; i++) {
        const alt = results[i].transcript.toLowerCase().trim();
        if (checkMatch(alt, currentWord?.word)) {
          matched = true;
          break;
        }
      }
      
      if (matched) {
        setFeedback('correct');
        setScore(prev => prev + 1);
        // Play success sound
        playSuccessSound();
      } else {
        setFeedback('incorrect');
      }
      
      setAttempts(prev => prev + 1);
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      console.log('Recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'no-speech') {
        setFeedback('no-speech');
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [currentWord]);
  
  // Check if spoken word matches target
  const checkMatch = (spoken, target) => {
    if (!spoken || !target) return false;
    
    const spokenClean = spoken.toLowerCase().replace(/[^a-z]/g, '');
    const targetClean = target.toLowerCase().replace(/[^a-z]/g, '');
    
    // Exact match
    if (spokenClean === targetClean) return true;
    
    // Check if target is contained in spoken (e.g., "the cat" contains "cat")
    if (spokenClean.includes(targetClean)) return true;
    
    // Check for common speech recognition alternatives
    // Allow small differences (1 character for short words, 2 for longer)
    const maxDiff = targetClean.length <= 4 ? 1 : 2;
    if (levenshteinDistance(spokenClean, targetClean) <= maxDiff) return true;
    
    return false;
  };
  
  // Levenshtein distance for fuzzy matching
  const levenshteinDistance = (a, b) => {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  };
  
  // Play success sound
  const playSuccessSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Play a happy ascending tone
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
      
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    } catch (e) {
      console.log('Could not play success sound');
    }
  };
  
  // Play the current word
  const playWord = async () => {
    if (!currentWord || isSpeaking) return;
    
    setIsSpeaking(true);
    await speak(currentWord.word, speechRate);
    setIsSpeaking(false);
  };
  
  // Start listening
  const startListening = () => {
    if (!recognitionRef.current || isListening) return;
    
    setFeedback(null);
    setSpokenText('');
    setIsListening(true);
    
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.log('Recognition already started');
      setIsListening(false);
    }
  };
  
  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };
  
  // Go to next word
  const nextWord = () => {
    if (!selectedCategory) return;
    
    // Mark current word as completed
    if (feedback === 'correct' && currentWord) {
      setWordsCompleted(prev => [...prev, currentWord.word]);
    }
    
    setFeedback(null);
    setSpokenText('');
    setShowHint(false);
    
    if (currentWordIndex < categoryWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      // End of category
      setView('results');
    }
  };
  
  // Try again (replay word)
  const tryAgain = () => {
    setFeedback(null);
    setSpokenText('');
    playWord();
  };
  
  // Start practice with a category
  const startPractice = async (category) => {
    setSelectedCategory(category);
    setCurrentWordIndex(0);
    setScore(0);
    setAttempts(0);
    setWordsCompleted([]);
    setFeedback(null);
    setSpokenText('');
    setShowHint(false);
    
    // Load words from database or use default
    let words = [];
    if (category.words) {
      // Category already has words (from defaults)
      words = category.words;
    } else {
      // Load words from database
      words = await getCategoryWords(category.id);
    }
    
    setCategoryWords(words);
    
    // Increment use count
    incrementCategoryUseCount(category.id);
    
    setView('practice');
  };
  
  // Request a new category
  const handleRequestCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    setIsRequesting(true);
    setRequestError(null);
    
    try {
      const result = await requestNewCategory(newCategoryName, newCategoryDesc);
      
      if (result.category) {
        // Add to categories list
        setCategories(prev => {
          // Check if already exists
          if (prev.find(c => c.id === result.category.id)) {
            return prev;
          }
          return [...prev, { ...result.category, words: result.words }];
        });
        
        // Reset form
        setNewCategoryName('');
        setNewCategoryDesc('');
        setView('menu');
        
        // Optionally start practicing immediately
        if (result.words && result.words.length > 0) {
          setCategoryWords(result.words);
          setSelectedCategory(result.category);
          setCurrentWordIndex(0);
          setScore(0);
          setAttempts(0);
          setView('practice');
        }
      }
    } catch (error) {
      console.error('Error requesting category:', error);
      setRequestError(error.message || 'Failed to create category. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };
  
  // Add more words to current category
  const handleAddMoreWords = async () => {
    if (!selectedCategory || isAddingWords) return;
    
    setIsAddingWords(true);
    
    try {
      const existingWords = categoryWords.map(w => w.word);
      const result = await requestMoreWords(
        selectedCategory.id,
        selectedCategory.name,
        existingWords,
        10
      );
      
      if (result.words && result.words.length > 0) {
        setCategoryWords(prev => [...prev, ...result.words]);
        
        // Update category in list
        setCategories(prev => prev.map(c => {
          if (c.id === selectedCategory.id) {
            return { ...c, words: [...(c.words || []), ...result.words] };
          }
          return c;
        }));
      }
      
      setShowAddWordsModal(false);
    } catch (error) {
      console.error('Error adding words:', error);
      alert('Failed to add more words. Please try again.');
    } finally {
      setIsAddingWords(false);
    }
  };
  
  // Reset and go to menu
  const goToMenu = () => {
    setView('menu');
    setSelectedCategory(null);
    setCategoryWords([]);
    setCurrentWordIndex(0);
    setScore(0);
    setAttempts(0);
    setWordsCompleted([]);
    setFeedback(null);
    setSpokenText('');
  };
  
  // Check if speech recognition is supported
  const isSupported = !!SpeechRecognition && 'speechSynthesis' in window;
  
  // ============================================
  // RENDER: Menu
  // ============================================
  
  if (view === 'menu') {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/activities')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#5CB85C] 
                         rounded-xl font-display font-bold text-[#5CB85C] hover:bg-[#5CB85C] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <img 
              src="/logo.jpeg" 
              alt="Special Needs World" 
              className="w-10 h-10 rounded-lg shadow-sm"
            />
            <h1 className="text-lg sm:text-xl font-display text-[#5CB85C] crayon-text">
              🗣️ Say It Right
            </h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Browser Support Check */}
          {!isSupported && (
            <div className="mb-6 p-4 bg-red-100 border-4 border-red-300 rounded-2xl">
              <p className="font-crayon text-red-700 text-center">
                ⚠️ Your browser doesn't support speech features. 
                Please try Chrome, Edge, or Safari.
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-white rounded-3xl border-4 border-[#5CB85C] p-6 shadow-crayon mb-6">
            <h2 className="font-display text-xl text-[#5CB85C] mb-4 flex items-center gap-2">
              <Sparkles size={24} />
              How to Play
            </h2>
            <div className="space-y-3 font-crayon text-gray-600">
              <p className="flex items-start gap-3">
                <span className="w-8 h-8 bg-[#4A9FD4] text-white rounded-full flex items-center justify-center flex-shrink-0 font-display">1</span>
                <span>Choose a category of words to practice</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="w-8 h-8 bg-[#F5A623] text-white rounded-full flex items-center justify-center flex-shrink-0 font-display">2</span>
                <span>Listen to the word (tap 🔊 to hear it again)</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="w-8 h-8 bg-[#E86B9A] text-white rounded-full flex items-center justify-center flex-shrink-0 font-display">3</span>
                <span>Tap the microphone and say the word</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="w-8 h-8 bg-[#5CB85C] text-white rounded-full flex items-center justify-center flex-shrink-0 font-display">4</span>
                <span>Get instant feedback! Keep practicing!</span>
              </p>
            </div>
          </div>

          {/* Category Selection */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-gray-700">Choose a Category:</h2>
            {!user?.isGuest && (
              <button
                onClick={() => setView('request')}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#8E6BBF] text-white rounded-lg font-crayon text-sm hover:bg-purple-600 transition-all"
              >
                <Plus size={16} />
                Request New
              </button>
            )}
          </div>
          
          {loadingCategories ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#5CB85C] animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => startPractice(category)}
                  disabled={!isSupported}
                  className={`p-4 rounded-2xl border-4 text-white transition-all relative
                             hover:scale-105 hover:-rotate-1 disabled:opacity-50 disabled:cursor-not-allowed
                             shadow-crayon`}
                  style={{ 
                    backgroundColor: category.color || '#4A9FD4',
                    borderColor: category.color || '#4A9FD4',
                  }}
                >
                  {/* Community badge */}
                  {!category.is_default && (
                    <div className="absolute -top-2 -right-2 bg-white text-[#8E6BBF] px-2 py-0.5 rounded-full text-xs font-crayon flex items-center gap-1 shadow">
                      <Users size={10} />
                      Community
                    </div>
                  )}
                  <div className="text-4xl mb-2">{category.emoji}</div>
                  <h3 className="font-display text-lg">{category.name}</h3>
                  <p className="font-crayon text-sm opacity-90">
                    {category.words?.length || '10+'} words
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Settings */}
          <div className="mt-8 p-4 bg-gray-100 rounded-2xl">
            <h3 className="font-display text-gray-700 mb-3 flex items-center gap-2">
              <Settings size={18} />
              Settings
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-crayon text-gray-600">Speech Speed</span>
                <div className="flex gap-2">
                  {[
                    { value: 0.6, label: 'Slow' },
                    { value: 0.8, label: 'Normal' },
                    { value: 1.0, label: 'Fast' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSpeechRate(option.value)}
                      className={`px-3 py-1 rounded-lg font-crayon text-sm transition-all
                        ${speechRate === option.value 
                          ? 'bg-[#5CB85C] text-white' 
                          : 'bg-white text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-crayon text-gray-600">Auto-play word</span>
                <button
                  onClick={() => setAutoPlayWord(!autoPlayWord)}
                  className={`w-12 h-7 rounded-full p-1 transition-all ${autoPlayWord ? 'bg-[#5CB85C]' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${autoPlayWord ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  // ============================================
  // RENDER: Request New Category
  // ============================================
  
  if (view === 'request') {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={goToMenu}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                         rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <h1 className="text-lg sm:text-xl font-display text-[#8E6BBF] crayon-text">
              ✨ Request Category
            </h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-6">
          {/* Info box */}
          <div className="bg-[#8E6BBF]/10 rounded-2xl border-3 border-[#8E6BBF]/30 p-4 mb-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="text-[#8E6BBF] flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-display text-[#8E6BBF]">Community Categories</h3>
                <p className="font-crayon text-sm text-gray-600 mt-1">
                  Request a new category and it will be created using AI. 
                  Once created, everyone can use it!
                </p>
              </div>
            </div>
          </div>

          {/* Request form */}
          <div className="bg-white rounded-3xl border-4 border-[#8E6BBF] p-6 shadow-crayon">
            <h2 className="font-display text-xl text-[#8E6BBF] mb-4 flex items-center gap-2">
              <Plus size={24} />
              New Category
            </h2>

            {requestError && (
              <div className="mb-4 p-3 bg-red-100 border-2 border-red-400 rounded-xl">
                <p className="font-crayon text-red-600 text-sm">{requestError}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="font-crayon text-gray-600 block mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Weather, Emotions, Vehicles..."
                  className="w-full px-4 py-3 border-3 border-gray-300 rounded-xl font-crayon
                            focus:border-[#8E6BBF] focus:outline-none transition-colors"
                  disabled={isRequesting}
                />
              </div>

              <div>
                <label className="font-crayon text-gray-600 block mb-1">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="e.g., Words about the weather"
                  className="w-full px-4 py-3 border-3 border-gray-300 rounded-xl font-crayon
                            focus:border-[#8E6BBF] focus:outline-none transition-colors"
                  disabled={isRequesting}
                />
              </div>

              <button
                onClick={handleRequestCategory}
                disabled={!newCategoryName.trim() || isRequesting}
                className="w-full py-3 bg-[#8E6BBF] text-white rounded-xl font-display text-lg
                          hover:bg-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                          flex items-center justify-center gap-2"
              >
                {isRequesting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Create Category
                  </>
                )}
              </button>
            </div>

            {/* Suggestions */}
            <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-200">
              <p className="font-crayon text-sm text-gray-500 mb-3">💡 Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {['Weather', 'Emotions', 'Vehicles', 'Clothing', 'Sports', 'School', 'Nature', 'Music'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setNewCategoryName(suggestion)}
                    disabled={isRequesting}
                    className="px-3 py-1 bg-gray-100 rounded-full font-crayon text-sm text-gray-600
                              hover:bg-[#8E6BBF]/20 hover:text-[#8E6BBF] transition-all disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  // ============================================
  // RENDER: Results
  // ============================================
  
  if (view === 'results') {
    const percentage = attempts > 0 ? Math.round((score / attempts) * 100) : 0;
    const stars = percentage >= 80 ? 3 : percentage >= 50 ? 2 : 1;
    
    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border-4 border-[#F8D14A] p-8 shadow-crayon text-center max-w-sm w-full">
          <Trophy className="w-20 h-20 text-[#F8D14A] mx-auto mb-4 animate-bounce" />
          
          <h2 className="text-2xl font-display text-[#5CB85C] mb-2">
            Great Practice! 🎉
          </h2>
          
          <p className="font-display text-3xl text-[#4A9FD4] mb-2">
            {selectedCategory?.emoji} {selectedCategory?.name}
          </p>
          
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                size={40}
                className={star <= stars ? 'text-[#F8D14A] fill-[#F8D14A]' : 'text-gray-300'}
              />
            ))}
          </div>

          <div className="space-y-2 mb-6 p-4 bg-gray-100 rounded-xl">
            <p className="font-crayon text-gray-600">
              Words correct: <span className="font-display text-[#5CB85C]">{score}</span> / {attempts}
            </p>
            <p className="font-crayon text-gray-600">
              Accuracy: <span className="font-display text-[#4A9FD4]">{percentage}%</span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => startPractice(selectedCategory)}
              className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl border-3 border-green-600
                         font-display hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Again
            </button>
            <button
              onClick={goToMenu}
              className="flex-1 py-3 bg-[#4A9FD4] text-white rounded-xl border-3 border-blue-600
                         font-display hover:scale-105 transition-transform"
            >
              New Category
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // ============================================
  // RENDER: Practice
  // ============================================
  
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4" style={{ borderColor: selectedCategory?.color }}>
        <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">
          <button
            onClick={goToMenu}
            className="flex items-center gap-2 px-3 py-2 bg-white border-3 rounded-xl font-crayon transition-all"
            style={{ borderColor: selectedCategory?.color, color: selectedCategory?.color }}
          >
            <ArrowLeft size={16} />
            Menu
          </button>
          
          <div className="text-center">
            <p className="font-crayon text-xs text-gray-500">
              {selectedCategory?.emoji} {selectedCategory?.name}
            </p>
            <p className="font-display" style={{ color: selectedCategory?.color }}>
              {currentWordIndex + 1} / {categoryWords.length}
            </p>
          </div>
          
          <div className="text-center">
            <p className="font-crayon text-xs text-gray-500">Score</p>
            <p className="font-display text-[#5CB85C]">{score}</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Word Card */}
        <div className="bg-white rounded-3xl border-4 p-6 shadow-crayon mb-6" style={{ borderColor: selectedCategory?.color }}>
          {/* Pictogram */}
          <div className="flex justify-center mb-4">
            <div className="w-40 h-40 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden">
              {loadingImage ? (
                <div className="w-8 h-8 border-4 border-gray-300 border-t-[#4A9FD4] rounded-full animate-spin" />
              ) : pictogramId ? (
                <img 
                  src={getPictogramUrl(pictogramId)}
                  alt={currentWord?.word}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <span className="text-6xl">{selectedCategory?.emoji}</span>
              )}
            </div>
          </div>
          
          {/* Word Display */}
          <h2 className="text-4xl font-display text-center mb-4" style={{ color: selectedCategory?.color }}>
            {currentWord?.word}
          </h2>
          
          {/* Play Word Button */}
          <button
            onClick={playWord}
            disabled={isSpeaking}
            className="w-full py-4 bg-[#4A9FD4] text-white rounded-xl font-display text-lg
                       flex items-center justify-center gap-3 hover:bg-blue-600 transition-all
                       disabled:opacity-50 shadow-md"
          >
            {isSpeaking ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Playing...
              </>
            ) : (
              <>
                <Volume2 size={24} />
                Hear the Word
              </>
            )}
          </button>
          
          {/* Hint */}
          <div className="mt-4 text-center">
            {showHint ? (
              <p className="font-crayon text-gray-600 italic">
                💡 {currentWord?.hint}
              </p>
            ) : (
              <button
                onClick={() => setShowHint(true)}
                className="font-crayon text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto"
              >
                <HelpCircle size={16} />
                Show hint
              </button>
            )}
          </div>
        </div>

        {/* Microphone / Recording Section */}
        <div className="bg-white rounded-3xl border-4 border-[#E86B9A] p-6 shadow-crayon mb-6">
          <h3 className="font-display text-lg text-[#E86B9A] text-center mb-4">
            Your Turn!
          </h3>
          
          {/* Record Button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all
                         shadow-lg hover:scale-105 active:scale-95
                         ${isListening 
                           ? 'bg-[#E63B2E] animate-pulse' 
                           : 'bg-[#E86B9A] hover:bg-pink-600'
                         }`}
            >
              {isListening ? (
                <MicOff size={40} className="text-white" />
              ) : (
                <Mic size={40} className="text-white" />
              )}
            </button>
          </div>
          
          <p className="text-center font-crayon text-gray-500 mb-4">
            {isListening ? '🎤 Listening... Say the word!' : 'Tap to record'}
          </p>
          
          {/* Spoken Text Display */}
          {spokenText && (
            <div className="p-3 bg-gray-100 rounded-xl mb-4">
              <p className="font-crayon text-sm text-gray-500 text-center">You said:</p>
              <p className="font-display text-xl text-center text-gray-700">"{spokenText}"</p>
            </div>
          )}
          
          {/* Feedback */}
          {feedback === 'correct' && (
            <div className="p-4 bg-[#5CB85C]/20 border-3 border-[#5CB85C] rounded-xl flex items-center justify-center gap-3 animate-bounce-soft">
              <Check size={32} className="text-[#5CB85C]" />
              <span className="font-display text-xl text-[#5CB85C]">Great job! ⭐</span>
            </div>
          )}
          
          {feedback === 'incorrect' && (
            <div className="p-4 bg-[#F5A623]/20 border-3 border-[#F5A623] rounded-xl text-center">
              <p className="font-display text-lg text-[#F5A623] mb-2">Almost! Try again 💪</p>
              <button
                onClick={tryAgain}
                className="px-4 py-2 bg-[#F5A623] text-white rounded-lg font-crayon hover:bg-orange-600 transition-all"
              >
                <RotateCcw size={16} className="inline mr-2" />
                Listen Again
              </button>
            </div>
          )}
          
          {feedback === 'no-speech' && (
            <div className="p-4 bg-gray-100 border-3 border-gray-300 rounded-xl text-center">
              <p className="font-crayon text-gray-600">I didn't hear anything. Try again!</p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <button
            onClick={tryAgain}
            className="flex-1 py-3 bg-white border-3 border-[#F5A623] text-[#F5A623] rounded-xl
                       font-crayon hover:bg-[#F5A623] hover:text-white transition-all
                       flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            Replay
          </button>
          <button
            onClick={nextWord}
            className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl font-display
                       hover:bg-green-600 transition-all flex items-center justify-center gap-2
                       shadow-md"
          >
            {currentWordIndex < categoryWords.length - 1 ? (
              <>
                Next Word
                <SkipForward size={18} />
              </>
            ) : (
              <>
                Finish
                <Trophy size={18} />
              </>
            )}
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6 flex-wrap">
          {categoryWords.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentWordIndex 
                  ? 'scale-125' 
                  : ''
              }`}
              style={{ 
                backgroundColor: index < currentWordIndex 
                  ? '#5CB85C' 
                  : index === currentWordIndex 
                    ? selectedCategory?.color 
                    : '#E5E5E5'
              }}
            />
          ))}
        </div>

        {/* Add More Words Button (only for database categories) */}
        {!selectedCategory?.is_default && !selectedCategory?.id?.startsWith('default-') && !user?.isGuest && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAddWordsModal(true)}
              disabled={isAddingWords}
              className="px-4 py-2 bg-[#8E6BBF]/10 text-[#8E6BBF] rounded-xl font-crayon text-sm
                        hover:bg-[#8E6BBF]/20 transition-all disabled:opacity-50
                        flex items-center gap-2 mx-auto"
            >
              {isAddingWords ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              Add More Words
            </button>
          </div>
        )}
      </main>

      {/* Add More Words Modal */}
      {showAddWordsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#FFFEF5] w-full max-w-sm rounded-3xl border-4 border-[#8E6BBF] p-6 shadow-crayon">
            <h3 className="font-display text-xl text-[#8E6BBF] mb-4 flex items-center gap-2">
              <Plus size={24} />
              Add More Words
            </h3>
            <p className="font-crayon text-gray-600 mb-4">
              Want to add 10 more words to this category? 
              They'll be generated by AI and available for everyone!
            </p>
            <p className="font-crayon text-sm text-gray-500 mb-4">
              Current words: {categoryWords.length}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddWordsModal(false)}
                className="flex-1 py-2 bg-gray-200 rounded-xl font-crayon text-gray-600 hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMoreWords}
                disabled={isAddingWords}
                className="flex-1 py-2 bg-[#8E6BBF] text-white rounded-xl font-display
                          hover:bg-purple-600 transition-all disabled:opacity-50
                          flex items-center justify-center gap-2"
              >
                {isAddingWords ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Add Words
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PronunciationPractice;
