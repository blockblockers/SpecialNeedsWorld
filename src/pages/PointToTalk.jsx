// PointToTalk.jsx - AAC Communication Board for ATLASassist
// UPDATED: Combined board layouts (Basic/MyWords/Cloud) with customizable footer
// UPDATED: AI-powered word suggestions with Claude API
// UPDATED: Fixed ARASAAC pictogram alignment
// NAVIGATION: Back button goes to /hub

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Volume2, 
  Settings,
  Grid3X3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Image,
  Smile,
  X,
  Undo2,
  MessageSquare,
  Edit2,
  Check,
  RotateCcw,
  Plus,
  Cloud,
  User,
  Sparkles,
  Upload,
  Loader2,
  FolderOpen,
  Info,
  TrendingUp,
  Users
} from 'lucide-react';
import { 
  getButtonPictogramUrl, 
  ARASAAC_PICTOGRAM_IDS 
} from '../services/arasaac';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { useToast } from '../components/ThemedToast';
import { useAuth } from '../App';

// ============================================
// LAYOUT DESCRIPTIONS
// ============================================

const LAYOUT_INFO = {
  basic: {
    title: 'Basic',
    icon: Grid3X3,
    color: '#5CB85C',
    description: 'Standard vocabulary with essential words. Great for getting started.',
    details: 'Includes common words organized by category. Your custom words appear alongside defaults.'
  },
  personal: {
    title: 'My Words',
    icon: User,
    color: '#F5A623',
    description: 'Your personal collection of custom words.',
    details: 'Words you create are saved here. Only you can see your personal words. Perfect for customizing vocabulary to your needs.'
  },
  cloud: {
    title: 'Community',
    icon: Cloud,
    color: '#4A9FD4',
    description: 'Most popular words from all users.',
    details: 'Shows the top 15 most-used words per category across all ATLASassist users. Words need at least 2 uses to appear. The community decides which words rise to the top!'
  }
};

// ============================================
// PHRASE BUILDING VOCABULARY
// ============================================

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
    { id: 'want', text: 'want', emoji: '🙏', color: '#E63B2E', needsNoun: true, hasSubmenu: true },
    { id: 'need', text: 'need', emoji: '❗', color: '#E63B2E', needsNoun: true, hasSubmenu: true },
    { id: 'like', text: 'like', emoji: '👍', color: '#5CB85C', needsNoun: true, hasSubmenu: true },
    { id: 'dont-like', text: "don't like", emoji: '👎', color: '#E63B2E', needsNoun: true, hasSubmenu: true },
    { id: 'feel', text: 'feel', emoji: '💭', color: '#8E6BBF', needsAdjective: true, hasSubmenu: true },
    { id: 'am', text: 'am', emoji: '✨', color: '#F5A623', needsAdjective: true, hasSubmenu: true },
    { id: 'see', text: 'see', emoji: '👀', color: '#4A9FD4', needsNoun: true, hasSubmenu: true },
    { id: 'hear', text: 'hear', emoji: '👂', color: '#4A9FD4', needsNoun: true, hasSubmenu: true },
    { id: 'have', text: 'have', emoji: '🤲', color: '#5CB85C', needsNoun: true, hasSubmenu: true },
    { id: 'go', text: 'go', emoji: '🚶', color: '#4A9FD4', needsPlace: true, hasSubmenu: true },
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
    { id: 'all-done', text: 'All done', emoji: '🏁', color: '#5CB85C' },
    { id: 'wait', text: 'Wait', emoji: '✋', color: '#F5A623' },
    { id: 'hello', text: 'Hello', emoji: '👋', color: '#4A9FD4' },
    { id: 'goodbye', text: 'Goodbye', emoji: '👋', color: '#8E6BBF' },
    { id: 'please', text: 'Please', emoji: '🙏', color: '#E86B9A' },
    { id: 'thank-you', text: 'Thank you', emoji: '💕', color: '#E86B9A' },
    { id: 'sorry', text: 'Sorry', emoji: '😔', color: '#87CEEB' },
    { id: 'bathroom', text: 'Bathroom', emoji: '🚽', color: '#8E6BBF' },
    { id: 'break', text: 'Break', emoji: '⏸️', color: '#F5A623' },
    { id: 'again', text: 'Again', emoji: '🔄', color: '#4A9FD4' },
    { id: 'my-turn', text: 'My turn', emoji: '👆', color: '#5CB85C' },
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

// ============================================
// FOOTER QUICK WORDS - Customizable
// ============================================
const FOOTER_STORAGE_KEY = 'snw_ptt_footer_words';

const AVAILABLE_FOOTER_WORDS = [
  { id: 'yes', text: 'Yes', emoji: '✅', color: '#5CB85C' },
  { id: 'no', text: 'No', emoji: '❌', color: '#E63B2E' },
  { id: 'please', text: 'Please', emoji: '🙏', color: '#E86B9A' },
  { id: 'thank-you', text: 'Thank you', emoji: '💕', color: '#8E6BBF' },
  { id: 'help', text: 'Help', emoji: '🙋', color: '#F5A623' },
  { id: 'stop', text: 'Stop', emoji: '🛑', color: '#E63B2E' },
  { id: 'more', text: 'More', emoji: '➕', color: '#4A9FD4' },
  { id: 'all-done', text: 'All done', emoji: '🏁', color: '#5CB85C' },
  { id: 'wait', text: 'Wait', emoji: '✋', color: '#F5A623' },
  { id: 'bathroom', text: 'Bathroom', emoji: '🚽', color: '#8E6BBF' },
  { id: 'hungry', text: 'Hungry', emoji: '🍽️', color: '#F5A623' },
  { id: 'thirsty', text: 'Thirsty', emoji: '💧', color: '#4A9FD4' },
  { id: 'tired', text: 'Tired', emoji: '😴', color: '#87CEEB' },
  { id: 'hurt', text: 'Hurt', emoji: '🤕', color: '#E86B9A' },
  { id: 'happy', text: 'Happy', emoji: '😊', color: '#F8D14A' },
  { id: 'sad', text: 'Sad', emoji: '😢', color: '#4A9FD4' },
  { id: 'hello', text: 'Hello', emoji: '👋', color: '#4A9FD4' },
  { id: 'goodbye', text: 'Goodbye', emoji: '👋', color: '#8E6BBF' },
  { id: 'sorry', text: 'Sorry', emoji: '😔', color: '#87CEEB' },
  { id: 'my-turn', text: 'My turn', emoji: '👆', color: '#5CB85C' },
];

const DEFAULT_FOOTER_WORDS = ['yes', 'no', 'please', 'thank-you'];

const loadFooterWords = () => {
  try {
    const saved = localStorage.getItem(FOOTER_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const valid = parsed.filter(id => AVAILABLE_FOOTER_WORDS.some(w => w.id === id));
      return valid.length === 4 ? valid : DEFAULT_FOOTER_WORDS;
    }
  } catch (e) {}
  return DEFAULT_FOOTER_WORDS;
};

const saveFooterWords = (words) => {
  localStorage.setItem(FOOTER_STORAGE_KEY, JSON.stringify(words));
};

// ============================================
// Noun categories
// ============================================
const NOUN_CATEGORIES = [
  { id: 'food', name: 'Food', emoji: '🍎', color: '#5CB85C' },
  { id: 'drinks', name: 'Drinks', emoji: '🥤', color: '#4A9FD4' },
  { id: 'activities', name: 'Activities', emoji: '🎮', color: '#8E6BBF' },
  { id: 'places', name: 'Places', emoji: '🏠', color: '#F5A623' },
  { id: 'people', name: 'People', emoji: '👨‍👩‍👧', color: '#E86B9A' },
  { id: 'things', name: 'Things', emoji: '🎾', color: '#F8D14A' },
  { id: 'body', name: 'Body', emoji: '🦵', color: '#E63B2E' },
  { id: 'feelings', name: 'Feelings', emoji: '💜', color: '#8E6BBF' },
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
  feelings: [
    { id: 'happy', text: 'happy', emoji: '😊', color: '#F8D14A' },
    { id: 'sad', text: 'sad', emoji: '😢', color: '#4A9FD4' },
    { id: 'angry', text: 'angry', emoji: '😠', color: '#E63B2E' },
    { id: 'scared', text: 'scared', emoji: '😨', color: '#8E6BBF' },
    { id: 'excited', text: 'excited', emoji: '🤩', color: '#F5A623' },
    { id: 'calm', text: 'calm', emoji: '😌', color: '#87CEEB' },
  ],
};

// ============================================
// Custom Words Storage
// ============================================
const CUSTOM_WORDS_KEY = 'snw_aac_custom_words';
const LAYOUT_KEY = 'snw_aac_layout';

const loadCustomWords = () => {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_WORDS_KEY) || '[]');
  } catch { return []; }
};

const saveCustomWords = (words) => {
  localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(words));
};

const loadLayout = () => {
  return localStorage.getItem(LAYOUT_KEY) || 'basic';
};

const saveLayout = (layout) => {
  localStorage.setItem(LAYOUT_KEY, layout);
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

const WordButton = ({ word, onClick, size = 'normal', useArasaac = false, showSubmenuIndicator = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Get the correct pictogram ID from the word's ID
  const pictogramId = useArasaac && ARASAAC_PICTOGRAM_IDS[word.id];
  const pictogramUrl = pictogramId ? getButtonPictogramUrl(word.id) : null;
  
  const showPictogram = useArasaac && pictogramUrl && !imageError;
  
  const sizeConfig = {
    small: { 
      padding: 'p-2', 
      minHeight: 'min-h-[70px]', 
      text: 'text-xs',
      emoji: 'text-2xl',
      imgSize: 36
    },
    normal: { 
      padding: 'p-3', 
      minHeight: 'min-h-[85px]', 
      text: 'text-sm',
      emoji: 'text-3xl',
      imgSize: 44
    },
    large: { 
      padding: 'p-4', 
      minHeight: 'min-h-[100px]', 
      text: 'text-base',
      emoji: 'text-4xl',
      imgSize: 56
    },
  };
  
  const config = sizeConfig[size];
  
  return (
    <button
      onClick={() => onClick(word)}
      className={`
        ${config.padding} ${config.minHeight} rounded-xl border-3 transition-all
        hover:scale-105 active:scale-95 shadow-md relative
        flex flex-col items-center justify-center gap-1
      `}
      style={{ 
        backgroundColor: word.color,
        borderColor: word.color,
        color: word.textColor || 'white',
      }}
    >
      {/* Submenu indicator */}
      {showSubmenuIndicator && word.hasSubmenu && (
        <div className="absolute top-1 right-1 bg-white/30 rounded-full p-0.5">
          <ChevronRight size={10} />
        </div>
      )}
      
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
// Add Word Modal Component
// ============================================

const AddWordModal = ({ isOpen, onClose, onSave, isLoading }) => {
  const [word, setWord] = useState('');
  const [emoji, setEmoji] = useState('💬');
  const [color, setColor] = useState('#4A9FD4');
  const [category, setCategory] = useState('things');
  const [isSuggesting, setIsSuggesting] = useState(false);

  const colors = [
    '#5CB85C', '#4A9FD4', '#E63B2E', '#F5A623', 
    '#8E6BBF', '#E86B9A', '#87CEEB', '#F8D14A', '#20B2AA'
  ];

  const handleAiSuggest = async () => {
    if (!word.trim() || !isSupabaseConfigured()) return;
    
    setIsSuggesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('suggest-aac-word', {
        body: { word: word.trim() }
      });
      
      if (!error && data) {
        if (data.emoji) setEmoji(data.emoji);
        if (data.color) setColor(data.color);
        if (data.category) setCategory(data.category);
      }
    } catch (err) {
      console.error('AI suggestion error:', err);
    }
    setIsSuggesting(false);
  };

  const handleSubmit = () => {
    if (!word.trim()) return;
    
    onSave({
      id: `custom_${Date.now()}`,
      text: word.trim(),
      emoji,
      color,
      category,
      isCustom: true,
    });
    
    setWord('');
    setEmoji('💬');
    setColor('#4A9FD4');
    setCategory('things');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFEF5] w-full max-w-md rounded-3xl overflow-hidden border-4 border-[#5CB85C]">
        <div className="bg-[#5CB85C] text-white p-4 flex items-center justify-between">
          <h3 className="font-display text-xl flex items-center gap-2">
            <Plus size={24} />
            Add Custom Word
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Word Input */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">Word or Phrase</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="Enter word..."
                className="flex-1 px-4 py-2 border-3 border-gray-200 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none"
              />
              {isSupabaseConfigured() && (
                <button
                  onClick={handleAiSuggest}
                  disabled={!word.trim() || isSuggesting}
                  className="p-2 bg-[#8E6BBF] text-white rounded-xl hover:bg-purple-600 disabled:opacity-50 transition-all"
                  title="AI Suggest"
                >
                  {isSuggesting ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                </button>
              )}
            </div>
          </div>
          
          {/* Emoji Input */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">Emoji</label>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="w-20 px-4 py-2 border-3 border-gray-200 rounded-xl text-2xl text-center focus:border-[#5CB85C] focus:outline-none"
            />
          </div>
          
          {/* Color Selection */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-full border-3 transition-all ${
                    color === c ? 'ring-2 ring-offset-2 ring-gray-800 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c, borderColor: c }}
                />
              ))}
            </div>
          </div>
          
          {/* Category Selection */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border-3 border-gray-200 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none"
            >
              {NOUN_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
              ))}
            </select>
          </div>
          
          {/* Preview */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="font-crayon text-sm text-gray-500 mb-2">Preview:</p>
            <div
              className="inline-flex flex-col items-center p-3 rounded-xl border-3"
              style={{ backgroundColor: color, borderColor: color }}
            >
              <span className="text-3xl">{emoji}</span>
              <span className="font-crayon text-white text-sm">{word || 'Word'}</span>
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-display border-3 border-gray-200 text-gray-600
                       hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!word.trim() || isLoading}
              className="flex-1 py-3 rounded-xl font-display bg-[#5CB85C] text-white
                       hover:bg-green-600 transition-all disabled:opacity-50
                       flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
              Save Word
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Layout Info Modal
// ============================================

const LayoutInfoModal = ({ isOpen, onClose, layout }) => {
  if (!isOpen || !layout) return null;
  
  const info = LAYOUT_INFO[layout];
  const Icon = info.icon;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFEF5] w-full max-w-sm rounded-3xl overflow-hidden border-4" style={{ borderColor: info.color }}>
        <div className="p-4 text-white flex items-center gap-3" style={{ backgroundColor: info.color }}>
          <Icon size={28} />
          <h3 className="font-display text-xl">{info.title} Layout</h3>
          <button onClick={onClose} className="ml-auto p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <p className="font-crayon text-gray-700 mb-4">{info.description}</p>
          <p className="font-crayon text-gray-500 text-sm">{info.details}</p>
          <button
            onClick={onClose}
            className="w-full mt-6 py-3 rounded-xl font-display text-white transition-all"
            style={{ backgroundColor: info.color }}
          >
            Got it!
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
  const toast = useToast();
  const { user } = useAuth();
  const { speak, isSpeaking } = useSpeech();
  
  // State
  const [sentence, setSentence] = useState([]);
  const [view, setView] = useState('main'); // main, categories, nouns
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [useArasaac, setUseArasaac] = useState(() => {
    return localStorage.getItem('snw_aac_symbols') === 'arasaac';
  });
  const [showSettings, setShowSettings] = useState(false);
  const [footerWords, setFooterWords] = useState(() => loadFooterWords());
  const [editingFooter, setEditingFooter] = useState(false);
  const [tempFooterWords, setTempFooterWords] = useState([]);
  
  // Layout state
  const [layout, setLayout] = useState(() => loadLayout());
  const [customWords, setCustomWords] = useState(() => loadCustomWords());
  const [cloudWords, setCloudWords] = useState([]);
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLayoutInfo, setShowLayoutInfo] = useState(false);
  const [selectedLayoutInfo, setSelectedLayoutInfo] = useState(null);
  
  // Determine what to show based on sentence context
  const lastWord = sentence[sentence.length - 1];
  const needsNoun = lastWord?.needsNoun;
  const needsAdjective = lastWord?.needsAdjective;
  const needsPlace = lastWord?.needsPlace;
  
  // Save preferences
  useEffect(() => {
    localStorage.setItem('snw_aac_symbols', useArasaac ? 'arasaac' : 'emoji');
  }, [useArasaac]);
  
  useEffect(() => {
    saveLayout(layout);
  }, [layout]);
  
  // Load cloud words when layout is 'cloud'
  useEffect(() => {
    if (layout === 'cloud' && isSupabaseConfigured()) {
      loadCloudWords();
    }
  }, [layout]);
  
  const loadCloudWords = async () => {
    setLoadingCloud(true);
    try {
      // Get popular words from database
      const { data, error } = await supabase
        .from('aac_words')
        .select('*')
        .eq('is_public', true)
        .gte('use_count', 2)
        .order('use_count', { ascending: false })
        .limit(100);
      
      if (!error && data) {
        setCloudWords(data);
      }
    } catch (err) {
      console.error('Error loading cloud words:', err);
    }
    setLoadingCloud(false);
  };
  
  // Add custom word
  const handleAddCustomWord = async (word) => {
    const newWords = [...customWords, word];
    setCustomWords(newWords);
    saveCustomWords(newWords);
    
    // Also save to cloud if signed in
    if (user && !user.isGuest && isSupabaseConfigured()) {
      try {
        await supabase.from('aac_words').insert({
          text: word.text,
          text_normalized: word.text.toLowerCase().trim(),
          emoji: word.emoji,
          color: word.color,
          category: word.category,
          is_public: true,
          use_count: 0,
          created_by: user.id,
        });
        toast.success('Word Added', 'Saved locally and to cloud');
      } catch (err) {
        console.error('Cloud save error:', err);
        toast.success('Word Added', 'Saved locally');
      }
    } else {
      toast.success('Word Added', 'Saved to your local library');
    }
  };
  
  // Add word to sentence
  const addWord = (word) => {
    setSentence(prev => [...prev, word]);
    speak(word.text);
    
    if (word.needsNoun) setView('categories');
    else if (word.needsPlace) {
      setSelectedCategory('places');
      setView('nouns');
    }
  };

  // Add noun and return to main
  const addNoun = (noun) => {
    setSentence(prev => [...prev, noun]);
    speak(noun.text);
    setView('main');
    setSelectedCategory(null);
  };

  // Actions
  const speakSentence = () => {
    if (sentence.length > 0) {
      speak(sentence.map(w => w.text).join(' '));
    }
  };
  const clearSentence = () => setSentence([]);
  const undoLastWord = () => setSentence(prev => prev.slice(0, -1));
  const selectCategory = (cat) => {
    setSelectedCategory(cat.id);
    setView('nouns');
  };
  const goBack = () => {
    if (view === 'nouns') {
      setView('categories');
      setSelectedCategory(null);
    } else if (view === 'categories') {
      setView('main');
    }
  };

  // Footer editing
  const startEditingFooter = () => {
    setTempFooterWords([...footerWords]);
    setEditingFooter(true);
  };
  
  const toggleFooterWord = (wordId) => {
    if (tempFooterWords.includes(wordId)) {
      setTempFooterWords(prev => prev.filter(id => id !== wordId));
    } else if (tempFooterWords.length < 4) {
      setTempFooterWords(prev => [...prev, wordId]);
    }
  };
  
  const saveFooterConfig = () => {
    if (tempFooterWords.length === 4) {
      setFooterWords(tempFooterWords);
      saveFooterWords(tempFooterWords);
      setEditingFooter(false);
    }
  };
  
  const cancelFooterEdit = () => {
    setTempFooterWords([]);
    setEditingFooter(false);
  };
  
  const resetFooterDefaults = () => {
    setTempFooterWords([...DEFAULT_FOOTER_WORDS]);
  };
  
  const getFooterWord = (wordId) => {
    return AVAILABLE_FOOTER_WORDS.find(w => w.id === wordId) || AVAILABLE_FOOTER_WORDS[0];
  };

  // Get words based on layout
  const getWordsForCategory = (categoryId) => {
    const baseWords = NOUNS[categoryId] || [];
    
    if (layout === 'personal') {
      const myWords = customWords.filter(w => w.category === categoryId);
      return [...myWords, ...baseWords];
    }
    
    if (layout === 'cloud') {
      const cloudCatWords = cloudWords.filter(w => w.category === categoryId);
      return [...cloudCatWords.map(w => ({
        id: w.id,
        text: w.text,
        emoji: w.emoji,
        color: w.color,
        useCount: w.use_count,
      })), ...baseWords];
    }
    
    // Basic layout - default + custom
    const myWords = customWords.filter(w => w.category === categoryId);
    return [...baseWords, ...myWords];
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5] flex flex-col pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#4A9FD4]">
        <div className="max-w-4xl mx-auto px-3 py-2 flex items-center gap-2">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-1 px-3 py-2 bg-white border-3 border-[#4A9FD4] 
                     rounded-xl font-display font-bold text-[#4A9FD4] hover:bg-[#4A9FD4] 
                     hover:text-white transition-all text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-display text-[#4A9FD4]">💬 Point to Talk</h1>
          </div>
          
          {/* Combined EMOJI/ARASAAC Toggle */}
          <button
            onClick={() => setUseArasaac(!useArasaac)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-3 font-display text-sm font-bold transition-all
              ${useArasaac 
                ? 'bg-[#4A9FD4] border-[#4A9FD4] text-white' 
                : 'bg-[#F5A623] border-[#F5A623] text-white'
              }`}
          >
            {useArasaac ? (
              <>
                <Image size={16} />
                <span className="hidden sm:inline">ARASAAC</span>
              </>
            ) : (
              <>
                <Smile size={16} />
                <span className="hidden sm:inline">Emoji</span>
              </>
            )}
          </button>
          
          {/* Add Word Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 bg-[#5CB85C] text-white rounded-full hover:bg-green-600 transition-colors"
            title="Add custom word"
          >
            <Plus size={18} />
          </button>
          
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 bg-white border-2 border-gray-200 rounded-full hover:border-[#4A9FD4] transition-colors"
          >
            <Settings size={18} className="text-gray-600" />
          </button>
        </div>
        
        {/* Layout Selector */}
        <div className="max-w-4xl mx-auto px-3 pb-2 flex gap-2">
          {Object.entries(LAYOUT_INFO).map(([key, info]) => {
            const Icon = info.icon;
            return (
              <button
                key={key}
                onClick={() => setLayout(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl font-crayon text-xs transition-all
                  ${layout === key 
                    ? 'text-white shadow-md' 
                    : 'bg-white border-2 text-gray-600 hover:border-gray-400'
                  }`}
                style={layout === key ? { backgroundColor: info.color, borderColor: info.color } : { borderColor: '#e5e7eb' }}
              >
                <Icon size={14} />
                {info.title}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLayoutInfo(key);
                    setShowLayoutInfo(true);
                  }}
                  className="ml-1 opacity-60 hover:opacity-100"
                >
                  <Info size={12} />
                </button>
              </button>
            );
          })}
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
            
            {/* Starters */}
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
            
            {/* Verbs */}
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
                      showSubmenuIndicator={true}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Questions */}
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
              <h3 className="font-display text-gray-700">Choose a category</h3>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {NOUN_CATEGORIES.map(cat => (
                <CategoryButton
                  key={cat.id}
                  category={cat}
                  onClick={selectCategory}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Noun Selection View */}
        {view === 'nouns' && selectedCategory && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={goBack}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h3 className="font-display text-gray-700 flex items-center gap-2">
                {NOUN_CATEGORIES.find(c => c.id === selectedCategory)?.emoji}
                {NOUN_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                {layout === 'cloud' && loadingCloud && (
                  <Loader2 size={16} className="animate-spin text-gray-400" />
                )}
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {getWordsForCategory(selectedCategory).map(word => (
                <WordButton
                  key={word.id}
                  word={word}
                  onClick={addNoun}
                  size="small"
                  useArasaac={useArasaac}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer - Customizable Quick Words */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t-4 border-[#4A9FD4] z-40">
        <div className="max-w-4xl mx-auto px-3 py-2 flex items-center justify-around gap-2">
          {footerWords.map((wordId) => {
            const word = getFooterWord(wordId);
            return (
              <button
                key={wordId}
                onClick={() => addWord(word)}
                className="flex flex-col items-center p-2 rounded-xl transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: `${word.color}20` }}
              >
                <span className="text-2xl">{word.emoji}</span>
                <span className="font-crayon text-xs" style={{ color: word.color }}>
                  {word.text}
                </span>
              </button>
            );
          })}
          
          {/* Edit Footer Button */}
          <button
            onClick={startEditingFooter}
            className="flex flex-col items-center p-2 text-gray-400 hover:text-[#4A9FD4] transition-colors"
            title="Customize quick words"
          >
            <Edit2 size={20} />
            <span className="text-xs font-crayon mt-0.5">Edit</span>
          </button>
        </div>
      </nav>

      {/* Footer Edit Modal */}
      {editingFooter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#FFFEF5] w-full max-w-md rounded-3xl overflow-hidden border-4 border-[#F5A623]">
            <div className="bg-[#F5A623] text-white p-4 flex items-center justify-between">
              <h3 className="font-display text-xl flex items-center gap-2">
                <Edit2 size={24} />
                Customize Quick Words
              </h3>
              <button onClick={cancelFooterEdit} className="p-1 hover:bg-white/20 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4">
              <p className="font-crayon text-gray-600 text-center mb-4">
                Choose 4 words for your quick access bar
              </p>
              
              {/* Selected Words Preview */}
              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                <p className="font-crayon text-xs text-gray-500 mb-2">Selected ({tempFooterWords.length}/4):</p>
                <div className="flex justify-around min-h-[50px] items-center">
                  {tempFooterWords.map((wordId, idx) => {
                    const word = getFooterWord(wordId);
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <span className="text-2xl">{word.emoji}</span>
                        <span className="text-xs font-crayon" style={{ color: word.color }}>{word.text}</span>
                      </div>
                    );
                  })}
                  {[...Array(4 - tempFooterWords.length)].map((_, idx) => (
                    <div key={`empty-${idx}`} className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg" />
                  ))}
                </div>
              </div>
              
              {/* Available Words Grid */}
              <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
                {AVAILABLE_FOOTER_WORDS.map(word => {
                  const isSelected = tempFooterWords.includes(word.id);
                  return (
                    <button
                      key={word.id}
                      onClick={() => toggleFooterWord(word.id)}
                      disabled={!isSelected && tempFooterWords.length >= 4}
                      className={`p-2 rounded-xl border-3 flex flex-col items-center transition-all relative
                        ${isSelected 
                          ? 'border-green-500 bg-green-50 ring-2 ring-green-300' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                        }
                        ${!isSelected && tempFooterWords.length >= 4 ? 'opacity-40 cursor-not-allowed' : ''}
                      `}
                    >
                      <span className="text-xl">{word.emoji}</span>
                      <span className="text-xs font-crayon mt-1 truncate w-full text-center" style={{ color: word.color }}>
                        {word.text}
                      </span>
                      {isSelected && (
                        <Check size={14} className="text-green-500 absolute top-1 right-1" />
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={resetFooterDefaults}
                  className="flex-1 py-2 px-3 border-3 border-gray-200 rounded-xl font-crayon text-gray-600
                           hover:bg-gray-50 transition-all flex items-center justify-center gap-1"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
                <button
                  onClick={cancelFooterEdit}
                  className="flex-1 py-2 px-3 border-3 border-gray-200 rounded-xl font-crayon text-gray-600
                           hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveFooterConfig}
                  disabled={tempFooterWords.length !== 4}
                  className="flex-1 py-2 px-3 bg-[#5CB85C] text-white rounded-xl font-crayon
                           hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-1"
                >
                  <Check size={16} />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
      
      {/* Add Word Modal */}
      <AddWordModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddCustomWord}
        isLoading={false}
      />
      
      {/* Layout Info Modal */}
      <LayoutInfoModal
        isOpen={showLayoutInfo}
        onClose={() => setShowLayoutInfo(false)}
        layout={selectedLayoutInfo}
      />
    </div>
  );
};

export default PointToTalk;
