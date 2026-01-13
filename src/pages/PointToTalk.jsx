import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Volume2, 
  Home,
  Settings,
  Grid3X3,
  Trash2,
  ChevronLeft,
  Image,
  Smile,
  X,
  Undo2,
  MessageSquare
} from 'lucide-react';
import { 
  getButtonPictogramUrl, 
  ARASAAC_PICTOGRAM_IDS 
} from '../services/arasaac';

// ============================================
// PHRASE BUILDING VOCABULARY
// ============================================

// Core vocabulary organized by function
const CORE_WORDS = {
  starters: [
    { id: 'i', text: 'I', emoji: '👤', color: '#4A9FD4' },
    { id: 'you', text: 'You', emoji: '👉', color: '#5CB85C' },
    { id: 'we', text: 'We', emoji: '👥', color: '#8E6BBF' },
    { id: 'he', text: 'He', emoji: '👦', color: '#4A9FD4' },
    { id: 'she', text: 'She', emoji: '👧', color: '#E86B9A' },
    { id: 'it', text: 'It', emoji: '👆', color: '#F5A623' },
  ],
  verbs: [
    { id: 'want', text: 'want', emoji: '🙏', color: '#E63B2E', needsNoun: true },
    { id: 'need', text: 'need', emoji: '❗', color: '#E63B2E', needsNoun: true },
    { id: 'like', text: 'like', emoji: '👍', color: '#5CB85C', needsNoun: true },
    { id: 'dont-like', text: "don't like", emoji: '👎', color: '#E63B2E', needsNoun: true },
    { id: 'feel', text: 'feel', emoji: '💭', color: '#8E6BBF', needsAdjective: true },
    { id: 'am', text: 'am', emoji: '✨', color: '#F5A623', needsAdjective: true },
    { id: 'see', text: 'see', emoji: '👀', color: '#4A9FD4', needsNoun: true },
    { id: 'hear', text: 'hear', emoji: '👂', color: '#4A9FD4', needsNoun: true },
    { id: 'have', text: 'have', emoji: '🤲', color: '#5CB85C', needsNoun: true },
    { id: 'go', text: 'go', emoji: '🚶', color: '#4A9FD4', needsPlace: true },
    { id: 'can', text: 'can', emoji: '💪', color: '#5CB85C' },
    { id: 'cant', text: "can't", emoji: '🚫', color: '#E63B2E' },
  ],
  adjectives: [
    { id: 'happy', text: 'happy', emoji: '😊', color: '#F8D14A' },
    { id: 'sad', text: 'sad', emoji: '😢', color: '#4A9FD4' },
    { id: 'angry', text: 'angry', emoji: '😠', color: '#E63B2E' },
    { id: 'scared', text: 'scared', emoji: '😨', color: '#8E6BBF' },
    { id: 'tired', text: 'tired', emoji: '😴', color: '#87CEEB' },
    { id: 'hungry', text: 'hungry', emoji: '🍽️', color: '#F5A623' },
    { id: 'thirsty', text: 'thirsty', emoji: '💧', color: '#4A9FD4' },
    { id: 'sick', text: 'sick', emoji: '🤒', color: '#8E6BBF' },
    { id: 'hurt', text: 'hurt', emoji: '🤕', color: '#E86B9A' },
    { id: 'excited', text: 'excited', emoji: '🤩', color: '#F5A623' },
    { id: 'bored', text: 'bored', emoji: '😑', color: '#87CEEB' },
    { id: 'hot', text: 'hot', emoji: '🥵', color: '#E63B2E' },
    { id: 'cold', text: 'cold', emoji: '🥶', color: '#4A9FD4' },
    { id: 'done', text: 'done', emoji: '✅', color: '#5CB85C' },
    { id: 'ready', text: 'ready', emoji: '👍', color: '#5CB85C' },
    { id: 'sorry', text: 'sorry', emoji: '😔', color: '#8E6BBF' },
  ],
  quickWords: [
    { id: 'yes', text: 'Yes', emoji: '✅', color: '#5CB85C' },
    { id: 'no', text: 'No', emoji: '❌', color: '#E63B2E' },
    { id: 'help', text: 'Help', emoji: '🙋', color: '#F5A623' },
    { id: 'stop', text: 'Stop', emoji: '🛑', color: '#E63B2E' },
    { id: 'more', text: 'More', emoji: '➕', color: '#4A9FD4' },
    { id: 'wait', text: 'Wait', emoji: '✋', color: '#F5A623' },
    { id: 'please', text: 'Please', emoji: '🙏', color: '#E86B9A' },
    { id: 'thank-you', text: 'Thank you', emoji: '💕', color: '#E86B9A' },
  ],
  questions: [
    { id: 'what', text: 'What?', emoji: '❓', color: '#4A9FD4' },
    { id: 'where', text: 'Where?', emoji: '📍', color: '#E63B2E' },
    { id: 'when', text: 'When?', emoji: '🕐', color: '#F5A623' },
    { id: 'who', text: 'Who?', emoji: '👤', color: '#8E6BBF' },
    { id: 'why', text: 'Why?', emoji: '🤔', color: '#5CB85C' },
    { id: 'how', text: 'How?', emoji: '💭', color: '#87CEEB' },
  ],
};

// Noun categories
const NOUN_CATEGORIES = [
  { id: 'food', name: 'Food', emoji: '🍎', color: '#5CB85C' },
  { id: 'drinks', name: 'Drinks', emoji: '🥤', color: '#4A9FD4' },
  { id: 'activities', name: 'Activities', emoji: '🎮', color: '#8E6BBF' },
  { id: 'places', name: 'Places', emoji: '🏠', color: '#F5A623' },
  { id: 'people', name: 'People', emoji: '👨‍👩‍👧', color: '#E86B9A' },
  { id: 'things', name: 'Things', emoji: '🎾', color: '#F8D14A' },
  { id: 'body', name: 'Body', emoji: '🦵', color: '#E63B2E' },
];

// Nouns organized by category
const NOUNS = {
  food: [
    { id: 'apple', text: 'apple', emoji: '🍎', color: '#E63B2E' },
    { id: 'banana', text: 'banana', emoji: '🍌', color: '#F8D14A' },
    { id: 'cookie', text: 'cookie', emoji: '🍪', color: '#8B5A2B' },
    { id: 'pizza', text: 'pizza', emoji: '🍕', color: '#F5A623' },
    { id: 'sandwich', text: 'sandwich', emoji: '🥪', color: '#5CB85C' },
    { id: 'chicken', text: 'chicken', emoji: '🍗', color: '#F5A623' },
    { id: 'snack', text: 'snack', emoji: '🍿', color: '#E86B9A' },
    { id: 'breakfast', text: 'breakfast', emoji: '🥣', color: '#87CEEB' },
    { id: 'lunch', text: 'lunch', emoji: '🥗', color: '#5CB85C' },
    { id: 'dinner', text: 'dinner', emoji: '🍽️', color: '#8E6BBF' },
    { id: 'ice-cream', text: 'ice cream', emoji: '🍦', color: '#E86B9A' },
    { id: 'fruit', text: 'fruit', emoji: '🍇', color: '#8E6BBF' },
  ],
  drinks: [
    { id: 'water', text: 'water', emoji: '💧', color: '#4A9FD4' },
    { id: 'juice', text: 'juice', emoji: '🧃', color: '#F5A623' },
    { id: 'milk', text: 'milk', emoji: '🥛', color: '#FFFEF5', textColor: '#333' },
    { id: 'drink', text: 'drink', emoji: '🥤', color: '#4A9FD4' },
  ],
  activities: [
    { id: 'play', text: 'play', emoji: '🎮', color: '#5CB85C' },
    { id: 'read', text: 'read', emoji: '📚', color: '#8E6BBF' },
    { id: 'watch-tv', text: 'watch TV', emoji: '📺', color: '#87CEEB' },
    { id: 'outside', text: 'go outside', emoji: '🌳', color: '#5CB85C' },
    { id: 'sleep', text: 'sleep', emoji: '🛏️', color: '#8E6BBF' },
    { id: 'hug', text: 'a hug', emoji: '🤗', color: '#E86B9A' },
    { id: 'walk', text: 'walk', emoji: '🚶‍♂️', color: '#5CB85C' },
    { id: 'draw', text: 'draw', emoji: '✏️', color: '#F8D14A' },
    { id: 'music', text: 'music', emoji: '🎵', color: '#F5A623' },
    { id: 'swim', text: 'swim', emoji: '🏊', color: '#4A9FD4' },
    { id: 'game', text: 'game', emoji: '🎲', color: '#E63B2E' },
    { id: 'break', text: 'a break', emoji: '⏸️', color: '#87CEEB' },
  ],
  places: [
    { id: 'home', text: 'home', emoji: '🏠', color: '#8B5A2B' },
    { id: 'school', text: 'school', emoji: '🏫', color: '#E63B2E' },
    { id: 'park', text: 'park', emoji: '🌳', color: '#5CB85C' },
    { id: 'store', text: 'store', emoji: '🏪', color: '#4A9FD4' },
    { id: 'bathroom', text: 'bathroom', emoji: '🚽', color: '#87CEEB' },
    { id: 'bedroom', text: 'bedroom', emoji: '🛏️', color: '#8E6BBF' },
    { id: 'kitchen', text: 'kitchen', emoji: '🍳', color: '#F5A623' },
    { id: 'car', text: 'car', emoji: '🚗', color: '#E63B2E' },
    { id: 'doctor', text: 'doctor', emoji: '🏥', color: '#E86B9A' },
    { id: 'restaurant', text: 'restaurant', emoji: '🍽️', color: '#F5A623' },
    { id: 'playground', text: 'playground', emoji: '🛝', color: '#5CB85C' },
  ],
  people: [
    { id: 'mom', text: 'mom', emoji: '👩', color: '#E86B9A' },
    { id: 'dad', text: 'dad', emoji: '👨', color: '#4A9FD4' },
    { id: 'brother', text: 'brother', emoji: '👦', color: '#5CB85C' },
    { id: 'sister', text: 'sister', emoji: '👧', color: '#F5A623' },
    { id: 'grandma', text: 'grandma', emoji: '👵', color: '#8E6BBF' },
    { id: 'grandpa', text: 'grandpa', emoji: '👴', color: '#8B5A2B' },
    { id: 'teacher', text: 'teacher', emoji: '👩‍🏫', color: '#E63B2E' },
    { id: 'friend', text: 'friend', emoji: '🧑‍🤝‍🧑', color: '#F8D14A' },
  ],
  things: [
    { id: 'toy', text: 'toy', emoji: '🧸', color: '#8B5A2B' },
    { id: 'ball', text: 'ball', emoji: '⚽', color: '#5CB85C' },
    { id: 'book', text: 'book', emoji: '📖', color: '#8E6BBF' },
    { id: 'phone', text: 'phone', emoji: '📱', color: '#4A9FD4' },
    { id: 'tablet', text: 'tablet', emoji: '📱', color: '#87CEEB' },
    { id: 'blanket', text: 'blanket', emoji: '🛏️', color: '#E86B9A' },
    { id: 'clothes', text: 'clothes', emoji: '👕', color: '#F5A623' },
    { id: 'shoes', text: 'shoes', emoji: '👟', color: '#E63B2E' },
  ],
  body: [
    { id: 'head', text: 'head', emoji: '🗣️', color: '#F5A623' },
    { id: 'tummy', text: 'tummy', emoji: '😣', color: '#5CB85C' },
    { id: 'arm', text: 'arm', emoji: '💪', color: '#4A9FD4' },
    { id: 'leg', text: 'leg', emoji: '🦵', color: '#8E6BBF' },
    { id: 'hand', text: 'hand', emoji: '✋', color: '#F8D14A' },
    { id: 'foot', text: 'foot', emoji: '🦶', color: '#E63B2E' },
  ],
};

// ============================================
// Speech Synthesis Hook
// ============================================

const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  const speak = useCallback((text) => {
    if (!isSupported || !text) return;
    
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesis.speak(utterance);
  }, [isSupported]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking, isSupported };
};

// ============================================
// Word Button Component - Fixed alignment
// ============================================

const WordButton = ({ word, onClick, size = 'normal', useArasaac = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const pictogramUrl = useArasaac && ARASAAC_PICTOGRAM_IDS[word.id] 
    ? getButtonPictogramUrl(word.id) 
    : null;
  
  const showPictogram = useArasaac && pictogramUrl && !imageError;
  
  const sizeConfig = {
    small: { 
      padding: 'p-2', 
      minHeight: 'min-h-[70px]', 
      text: 'text-xs',
      emoji: 'text-2xl',
      imgSize: 36 // pixels
    },
    normal: { 
      padding: 'p-3', 
      minHeight: 'min-h-[85px]', 
      text: 'text-sm',
      emoji: 'text-3xl',
      imgSize: 44 // pixels
    },
    large: { 
      padding: 'p-4', 
      minHeight: 'min-h-[100px]', 
      text: 'text-base',
      emoji: 'text-4xl',
      imgSize: 56 // pixels
    },
  };
  
  const config = sizeConfig[size];
  
  return (
    <button
      onClick={() => onClick(word)}
      className={`
        ${config.padding} ${config.minHeight} rounded-xl border-3 transition-all
        hover:scale-105 active:scale-95 shadow-md
        flex flex-col items-center justify-center gap-1
      `}
      style={{ 
        backgroundColor: word.color,
        borderColor: word.color,
        color: word.textColor || 'white',
      }}
    >
      {/* Image/Emoji container - fixed size box for alignment */}
      <div 
        className="flex items-center justify-center relative"
        style={{ width: config.imgSize, height: config.imgSize }}
      >
        {showPictogram ? (
          <>
            <img
              src={pictogramUrl}
              alt={word.text}
              className="absolute inset-0 w-full h-full object-contain rounded bg-white/95 p-0.5"
              style={{ 
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.2s'
              }}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-white/30 rounded animate-pulse" />
            )}
          </>
        ) : (
          <span className={`${config.emoji} leading-none`}>{word.emoji}</span>
        )}
      </div>
      
      {/* Text - always centered below image */}
      <span className={`font-crayon ${config.text} leading-tight text-center w-full`}>
        {word.text}
      </span>
    </button>
  );
};

// ============================================
// Category Button Component
// ============================================

const CategoryButton = ({ category, onClick, isActive }) => (
  <button
    onClick={() => onClick(category)}
    className={`
      p-3 rounded-xl border-3 transition-all
      hover:scale-105 active:scale-95
      flex flex-col items-center justify-center gap-1
      ${isActive ? 'ring-2 ring-offset-2 ring-gray-800' : ''}
    `}
    style={{ 
      backgroundColor: category.color,
      borderColor: category.color,
    }}
  >
    <span className="text-2xl">{category.emoji}</span>
    <span className="font-crayon text-xs text-white leading-tight text-center">
      {category.name}
    </span>
  </button>
);

// ============================================
// Sentence Strip Component
// ============================================

const SentenceStrip = ({ words, onSpeak, onClear, onUndo, isSpeaking }) => {
  if (words.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-4 border-dashed border-gray-300 p-4 text-center">
        <p className="font-crayon text-gray-400 flex items-center justify-center gap-2">
          <MessageSquare size={18} />
          Tap words below to build a sentence
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-2xl border-4 border-[#4A9FD4] p-3 shadow-lg">
      <div className="flex items-center gap-2">
        {/* Words */}
        <div className="flex-1 flex flex-wrap gap-1.5 min-h-[44px] items-center">
          {words.map((word, index) => (
            <span 
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-crayon"
              style={{ backgroundColor: `${word.color}25`, color: word.color }}
            >
              <span>{word.emoji}</span>
              <span className="font-semibold">{word.text}</span>
            </span>
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex gap-1.5">
          <button
            onClick={onUndo}
            className="p-2.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
            title="Undo last word"
          >
            <Undo2 size={18} />
          </button>
          <button
            onClick={onSpeak}
            disabled={isSpeaking}
            className="p-2.5 bg-[#5CB85C] text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
            title="Speak sentence"
          >
            <Volume2 size={18} />
          </button>
          <button
            onClick={onClear}
            className="p-2.5 bg-[#E63B2E] text-white rounded-full hover:bg-red-600 transition-colors"
            title="Clear all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Main Component
// ============================================

const PointToTalk = () => {
  const navigate = useNavigate();
  const { speak, isSpeaking } = useSpeech();
  
  // State
  const [sentence, setSentence] = useState([]);
  const [view, setView] = useState('main'); // main, categories, nouns
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [useArasaac, setUseArasaac] = useState(() => {
    return localStorage.getItem('snw_aac_symbols') === 'arasaac';
  });
  const [showSettings, setShowSettings] = useState(false);
  
  // Determine what to show based on sentence context
  const lastWord = sentence[sentence.length - 1];
  const needsNoun = lastWord?.needsNoun;
  const needsAdjective = lastWord?.needsAdjective;
  const needsPlace = lastWord?.needsPlace;
  
  // Save preference
  useEffect(() => {
    localStorage.setItem('snw_aac_symbols', useArasaac ? 'arasaac' : 'emoji');
  }, [useArasaac]);
  
  // Add word to sentence
  const addWord = (word) => {
    setSentence(prev => [...prev, word]);
    speak(word.text);
    
    // Auto-navigate based on what's needed next
    if (word.needsNoun) {
      setView('categories');
    } else if (word.needsPlace) {
      setSelectedCategory('places');
      setView('nouns');
    }
  };
  
  // Add category noun
  const addNoun = (noun) => {
    setSentence(prev => [...prev, noun]);
    speak(noun.text);
    setView('main');
    setSelectedCategory(null);
  };
  
  // Speak full sentence
  const speakSentence = () => {
    const text = sentence.map(w => w.text).join(' ');
    speak(text);
  };
  
  // Clear sentence
  const clearSentence = () => {
    setSentence([]);
    setView('main');
    setSelectedCategory(null);
  };
  
  // Undo last word
  const undoLastWord = () => {
    setSentence(prev => prev.slice(0, -1));
    if (view === 'nouns' || view === 'categories') {
      setView('main');
      setSelectedCategory(null);
    }
  };
  
  // Select category
  const selectCategory = (category) => {
    setSelectedCategory(category.id);
    setView('nouns');
  };
  
  // Go back
  const goBack = () => {
    if (view === 'nouns') {
      setView('categories');
      setSelectedCategory(null);
    } else if (view === 'categories') {
      setView('main');
    }
  };
  
  return (
    <div className="min-h-screen bg-[#FFFEF5] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#4A9FD4]">
        <div className="max-w-4xl mx-auto px-3 py-2 flex items-center gap-2">
          <button
            onClick={() => navigate('/tools')}
            className="flex items-center gap-1 px-3 py-2 bg-white border-3 border-[#4A9FD4] 
                     rounded-xl font-display font-bold text-[#4A9FD4] hover:bg-[#4A9FD4] 
                     hover:text-white transition-all text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-display text-[#4A9FD4]">
              💬 Point to Talk
            </h1>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 bg-white border-2 border-gray-200 rounded-full hover:border-[#4A9FD4] transition-colors"
          >
            <Settings size={18} className="text-gray-600" />
          </button>
        </div>
      </header>

      {/* Sentence Strip */}
      <div className="px-3 py-2 bg-gradient-to-b from-[#87CEEB]/20 to-transparent">
        <div className="max-w-4xl mx-auto">
          <SentenceStrip 
            words={sentence}
            onSpeak={speakSentence}
            onClear={clearSentence}
            onUndo={undoLastWord}
            isSpeaking={isSpeaking}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-3 py-3 overflow-y-auto">
        {view === 'main' && (
          <div className="space-y-4">
            {/* Quick Words - Always visible at top */}
            <div>
              <h3 className="font-display text-sm text-gray-600 mb-2 flex items-center gap-1">
                ⚡ Quick Words
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {CORE_WORDS.quickWords.map(word => (
                  <WordButton 
                    key={word.id} 
                    word={word} 
                    onClick={addWord}
                    size="small"
                    useArasaac={useArasaac}
                  />
                ))}
              </div>
            </div>
            
            {/* Show adjectives if the last word needs one */}
            {needsAdjective && (
              <div className="bg-purple-50 rounded-xl p-3 border-3 border-purple-200 animate-pulse-once">
                <h3 className="font-display text-sm text-purple-700 mb-2">💭 How do you feel?</h3>
                <div className="grid grid-cols-4 gap-2">
                  {CORE_WORDS.adjectives.map(word => (
                    <WordButton 
                      key={word.id} 
                      word={word} 
                      onClick={addWord}
                      size="small"
                      useArasaac={useArasaac}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Starters (I, You, We...) - hide when selecting adjective */}
            {!needsAdjective && (
              <div>
                <h3 className="font-display text-sm text-gray-600 mb-2">👤 Start with...</h3>
                <div className="grid grid-cols-6 gap-2">
                  {CORE_WORDS.starters.map(word => (
                    <WordButton 
                      key={word.id} 
                      word={word} 
                      onClick={addWord}
                      size="small"
                      useArasaac={useArasaac}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Verbs (want, need, like...) - hide when selecting adjective */}
            {!needsAdjective && (
              <div>
                <h3 className="font-display text-sm text-gray-600 mb-2">🎬 Action Words</h3>
                <div className="grid grid-cols-4 gap-2">
                  {CORE_WORDS.verbs.map(word => (
                    <WordButton 
                      key={word.id} 
                      word={word} 
                      onClick={addWord}
                      size="small"
                      useArasaac={useArasaac}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Questions - hide when selecting adjective */}
            {!needsAdjective && (
              <div>
                <h3 className="font-display text-sm text-gray-600 mb-2">❓ Questions</h3>
                <div className="grid grid-cols-6 gap-2">
                  {CORE_WORDS.questions.map(word => (
                    <WordButton 
                      key={word.id} 
                      word={word} 
                      onClick={addWord}
                      size="small"
                      useArasaac={useArasaac}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Category Selection View */}
        {view === 'categories' && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={goBack}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h3 className="font-display text-lg text-gray-800">📁 Choose what you want</h3>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {NOUN_CATEGORIES.map(category => (
                <CategoryButton 
                  key={category.id}
                  category={category}
                  onClick={selectCategory}
                  isActive={selectedCategory === category.id}
                />
              ))}
            </div>
            
            {/* Hint */}
            <p className="text-center text-sm text-gray-500 font-crayon mt-4">
              Pick a category to see more options
            </p>
          </div>
        )}
        
        {/* Nouns View */}
        {view === 'nouns' && selectedCategory && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={goBack}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h3 className="font-display text-lg text-gray-800">
                {NOUN_CATEGORIES.find(c => c.id === selectedCategory)?.emoji}{' '}
                {NOUN_CATEGORIES.find(c => c.id === selectedCategory)?.name}
              </h3>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {NOUNS[selectedCategory]?.map(noun => (
                <WordButton 
                  key={noun.id}
                  word={noun}
                  onClick={addNoun}
                  size="normal"
                  useArasaac={useArasaac}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Attribution */}
        {useArasaac && (
          <div className="mt-4 text-center">
            <a 
              href="https://arasaac.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-[#4A9FD4]"
            >
              Pictograms by ARASAAC (CC BY-NC-SA)
            </a>
          </div>
        )}
      </main>

      {/* Bottom Quick Access */}
      <nav className="sticky bottom-0 bg-white border-t-4 border-[#87CEEB] px-3 py-2 safe-area-bottom">
        <div className="max-w-4xl mx-auto flex justify-around">
          <button
            onClick={() => { setView('main'); setSelectedCategory(null); }}
            className={`flex flex-col items-center p-2 transition-colors
              ${view === 'main' ? 'text-[#4A9FD4]' : 'text-gray-500'}`}
          >
            <Grid3X3 size={24} />
            <span className="text-xs font-crayon mt-0.5">Words</span>
          </button>
          
          <button
            onClick={() => setView('categories')}
            className={`flex flex-col items-center p-2 transition-colors
              ${view === 'categories' || view === 'nouns' ? 'text-[#F5A623]' : 'text-gray-500'}`}
          >
            <span className="text-2xl">📁</span>
            <span className="text-xs font-crayon mt-0.5">Things</span>
          </button>
          
          <button
            onClick={() => addWord({ id: 'yes-quick', text: 'Yes', emoji: '✅', color: '#5CB85C' })}
            className="flex flex-col items-center p-2 text-[#5CB85C] hover:scale-110 transition-transform"
          >
            <span className="text-2xl">✅</span>
            <span className="text-xs font-crayon mt-0.5">Yes</span>
          </button>
          
          <button
            onClick={() => addWord({ id: 'no-quick', text: 'No', emoji: '❌', color: '#E63B2E' })}
            className="flex flex-col items-center p-2 text-[#E63B2E] hover:scale-110 transition-transform"
          >
            <span className="text-2xl">❌</span>
            <span className="text-xs font-crayon mt-0.5">No</span>
          </button>
          
          <button
            onClick={() => navigate('/hub')}
            className="flex flex-col items-center p-2 text-gray-500 hover:text-[#4A9FD4] transition-colors"
          >
            <Home size={24} />
            <span className="text-xs font-crayon mt-0.5">Home</span>
          </button>
        </div>
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#FFFEF5] w-full max-w-sm rounded-3xl overflow-hidden border-4 border-[#4A9FD4]">
            <div className="bg-[#4A9FD4] text-white p-4 flex items-center justify-between">
              <h3 className="font-display text-xl flex items-center gap-2">
                <Settings size={24} />
                Settings
              </h3>
              <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-white/20 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-display text-lg text-gray-800 mb-3">Symbol Style</h4>
                <div className="flex gap-3">
                  <button
                    onClick={() => setUseArasaac(false)}
                    className={`flex-1 p-4 rounded-xl border-3 transition-all ${
                      !useArasaac ? 'border-[#5CB85C] bg-[#5CB85C]/10' : 'border-gray-300'
                    }`}
                  >
                    <Smile size={32} className="mx-auto mb-2 text-[#F5A623]" />
                    <p className="font-crayon text-sm text-center">Emoji</p>
                  </button>
                  <button
                    onClick={() => setUseArasaac(true)}
                    className={`flex-1 p-4 rounded-xl border-3 transition-all ${
                      useArasaac ? 'border-[#5CB85C] bg-[#5CB85C]/10' : 'border-gray-300'
                    }`}
                  >
                    <Image size={32} className="mx-auto mb-2 text-[#4A9FD4]" />
                    <p className="font-crayon text-sm text-center">ARASAAC</p>
                  </button>
                </div>
              </div>
              
              {useArasaac && (
                <p className="text-xs text-gray-500 text-center">
                  Pictograms by ARASAAC (arasaac.org) - CC BY-NC-SA
                </p>
              )}
              
              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-3 bg-[#4A9FD4] text-white rounded-xl font-display hover:bg-blue-600 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointToTalk;
