// PointToTalk.jsx - AAC Communication Board
// UPDATED: 
// - Combined EMOJI/ARASAAC toggle button
// - Add custom words with image upload
// - Cloud library with popularity-based sorting
// - Layout descriptions explaining each mode
// - Visual indicators for words with sub-menus (▸ arrow)
// - Popularity tracking when words are used

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Volume2, 
  Home,
  Grid3X3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Image,
  Smile,
  X,
  Undo2,
  Plus,
  Cloud,
  User,
  Sparkles,
  Upload,
  Loader2,
  Check,
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
// CORE VOCABULARY
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
    { id: 'done', text: 'done', emoji: '✅', color: '#5CB85C' },
    { id: 'ready', text: 'ready', emoji: '👍', color: '#5CB85C' },
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
    { id: 'bathroom', text: 'Bathroom', emoji: '🚽', color: '#8E6BBF' },
    { id: 'break', text: 'Break', emoji: '⏸️', color: '#F5A623' },
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

// Noun categories
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

// Default nouns by category
const DEFAULT_NOUNS = {
  food: [
    { id: 'apple', text: 'apple', emoji: '🍎', color: '#E63B2E' },
    { id: 'banana', text: 'banana', emoji: '🍌', color: '#F8D14A' },
    { id: 'cookie', text: 'cookie', emoji: '🍪', color: '#8B5A2B' },
    { id: 'pizza', text: 'pizza', emoji: '🍕', color: '#F5A623' },
    { id: 'sandwich', text: 'sandwich', emoji: '🥪', color: '#5CB85C' },
    { id: 'chicken', text: 'chicken', emoji: '🍗', color: '#F5A623' },
    { id: 'snack', text: 'snack', emoji: '🍿', color: '#E86B9A' },
    { id: 'ice-cream', text: 'ice cream', emoji: '🍦', color: '#E86B9A' },
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
    { id: 'music', text: 'music', emoji: '🎵', color: '#F5A623' },
  ],
  places: [
    { id: 'home', text: 'home', emoji: '🏠', color: '#8B5A2B' },
    { id: 'school', text: 'school', emoji: '🏫', color: '#E63B2E' },
    { id: 'park', text: 'park', emoji: '🌳', color: '#5CB85C' },
    { id: 'store', text: 'store', emoji: '🏪', color: '#4A9FD4' },
    { id: 'bathroom', text: 'bathroom', emoji: '🚽', color: '#87CEEB' },
    { id: 'car', text: 'car', emoji: '🚗', color: '#E63B2E' },
  ],
  people: [
    { id: 'mom', text: 'mom', emoji: '👩', color: '#E86B9A' },
    { id: 'dad', text: 'dad', emoji: '👨', color: '#4A9FD4' },
    { id: 'brother', text: 'brother', emoji: '👦', color: '#5CB85C' },
    { id: 'sister', text: 'sister', emoji: '👧', color: '#F5A623' },
    { id: 'teacher', text: 'teacher', emoji: '👩‍🏫', color: '#E63B2E' },
    { id: 'friend', text: 'friend', emoji: '🧑‍🤝‍🧑', color: '#F8D14A' },
  ],
  things: [
    { id: 'toy', text: 'toy', emoji: '🧸', color: '#8B5A2B' },
    { id: 'ball', text: 'ball', emoji: '⚽', color: '#5CB85C' },
    { id: 'book', text: 'book', emoji: '📖', color: '#8E6BBF' },
    { id: 'phone', text: 'phone', emoji: '📱', color: '#4A9FD4' },
    { id: 'tablet', text: 'tablet', emoji: '📱', color: '#87CEEB' },
  ],
  body: [
    { id: 'head', text: 'head', emoji: '🗣️', color: '#F5A623' },
    { id: 'tummy', text: 'tummy', emoji: '😣', color: '#5CB85C' },
    { id: 'arm', text: 'arm', emoji: '💪', color: '#4A9FD4' },
    { id: 'leg', text: 'leg', emoji: '🦵', color: '#8E6BBF' },
  ],
  feelings: [
    { id: 'happy', text: 'happy', emoji: '😊', color: '#F8D14A' },
    { id: 'sad', text: 'sad', emoji: '😢', color: '#4A9FD4' },
    { id: 'angry', text: 'angry', emoji: '😠', color: '#E63B2E' },
    { id: 'scared', text: 'scared', emoji: '😨', color: '#8E6BBF' },
    { id: 'excited', text: 'excited', emoji: '🤩', color: '#F5A623' },
  ],
};

const STORAGE_KEY = 'snw_aac_settings';
const CUSTOM_WORDS_KEY = 'snw_aac_custom_words';

// ============================================
// Speech Synthesis
// ============================================

const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak, isSpeaking };
};

// ============================================
// Word Button Component with Sub-menu Indicator
// ============================================

const WordButton = ({ word, onClick, size = 'normal', useArasaac = false, showSubmenuIndicator = true }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const hasCustomImage = word.imageUrl || word.image_url;
  const pictogramUrl = !hasCustomImage && useArasaac && ARASAAC_PICTOGRAM_IDS[word.id] 
    ? getButtonPictogramUrl(word.id) 
    : null;
  
  const showImage = hasCustomImage || (useArasaac && pictogramUrl && !imageError);
  const imageSource = hasCustomImage || pictogramUrl;
  
  // Check if word has sub-menu
  const hasSubmenu = word.hasSubmenu || word.has_submenu || word.needsNoun || word.needsAdjective || word.needsPlace || word.submenu_category;
  
  const sizeConfig = {
    small: { padding: 'p-2', minHeight: 'min-h-[70px]', text: 'text-xs', emoji: 'text-2xl', imgSize: 36 },
    normal: { padding: 'p-3', minHeight: 'min-h-[85px]', text: 'text-sm', emoji: 'text-3xl', imgSize: 44 },
    large: { padding: 'p-4', minHeight: 'min-h-[100px]', text: 'text-base', emoji: 'text-4xl', imgSize: 56 },
  };
  
  const config = sizeConfig[size];
  
  return (
    <button
      onClick={() => onClick(word)}
      className={`${config.padding} ${config.minHeight} rounded-xl border-3 transition-all relative
        hover:scale-105 active:scale-95 shadow-md flex flex-col items-center justify-center gap-1`}
      style={{ backgroundColor: word.color, borderColor: word.color, color: word.textColor || 'white' }}
    >
      {/* Sub-menu indicator */}
      {showSubmenuIndicator && hasSubmenu && (
        <div className="absolute top-1 right-1 bg-white/30 rounded-full p-0.5" title="Opens more options">
          <ChevronRight size={12} />
        </div>
      )}
      
      {/* Popularity indicator for cloud words */}
      {word.use_count > 0 && (
        <div className="absolute bottom-1 left-1 bg-white/30 rounded-full px-1 flex items-center gap-0.5" title={`Used ${word.use_count} times`}>
          <TrendingUp size={8} />
          <span className="text-[8px] font-bold">{word.use_count}</span>
        </div>
      )}
      
      <div className="flex items-center justify-center relative" style={{ width: config.imgSize, height: config.imgSize }}>
        {showImage ? (
          <>
            <img
              src={imageSource}
              alt={word.text}
              className="absolute inset-0 w-full h-full object-contain rounded bg-white/95 p-0.5"
              style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.2s' }}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {!imageLoaded && <div className="absolute inset-0 bg-white/30 rounded animate-pulse" />}
          </>
        ) : (
          <span className={`${config.emoji} leading-none`}>{word.emoji}</span>
        )}
      </div>
      <span className={`font-crayon ${config.text} leading-tight text-center w-full`}>{word.text}</span>
    </button>
  );
};

// ============================================
// Layout Info Panel
// ============================================

const LayoutInfoPanel = ({ layout, isExpanded, onToggle }) => {
  const info = LAYOUT_INFO[layout];
  const Icon = info.icon;
  
  return (
    <div className="bg-white rounded-xl border-3 overflow-hidden" style={{ borderColor: info.color }}>
      <button
        onClick={onToggle}
        className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50"
      >
        <Icon size={20} style={{ color: info.color }} />
        <div className="flex-1 text-left">
          <p className="font-display text-sm" style={{ color: info.color }}>{info.title} Layout</p>
          <p className="text-xs text-gray-500 font-crayon">{info.description}</p>
        </div>
        <Info size={16} className="text-gray-400" />
      </button>
      
      {isExpanded && (
        <div className="px-4 py-3 bg-gray-50 border-t-2 border-gray-100">
          <p className="text-sm text-gray-600 font-crayon">{info.details}</p>
          {layout === 'cloud' && (
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <TrendingUp size={12} /> = times used
              </span>
              <span className="flex items-center gap-1">
                <ChevronRight size={12} /> = has more options
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// Add Word Modal
// ============================================

const AddWordModal = ({ isOpen, onClose, onSave, categories, selectedCategory }) => {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [word, setWord] = useState('');
  const [emoji, setEmoji] = useState('📦');
  const [color, setColor] = useState('#4A9FD4');
  const [category, setCategory] = useState(selectedCategory || 'things');
  const [imageUrl, setImageUrl] = useState('');
  const [hasSubmenu, setHasSubmenu] = useState(false);
  const [submenuCategory, setSubmenuCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (selectedCategory) setCategory(selectedCategory);
  }, [selectedCategory]);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 500 * 1024) {
      toast.warning('Image Too Large', 'Please use an image under 500KB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => setImageUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleAiSuggest = async () => {
    if (!word.trim()) return;
    
    setAiLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.functions.invoke('suggest-aac-word', {
          body: { word: word.trim() },
        });
        
        if (!error && data) {
          setEmoji(data.emoji || emoji);
          setColor(data.color || color);
          setCategory(data.category || category);
          toast.success('AI Suggestion', `Category: ${data.category}, Emoji: ${data.emoji}`);
        }
      } else {
        toast.info('Cloud Required', 'Sign in to use AI suggestions');
      }
    } catch (err) {
      console.error('AI suggestion error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async () => {
    if (!word.trim()) return;
    
    setLoading(true);
    const newWord = {
      id: `custom_${Date.now()}`,
      text: word.trim(),
      emoji,
      color,
      category,
      imageUrl: imageUrl || null,
      hasSubmenu,
      submenuCategory: hasSubmenu ? submenuCategory : null,
      isCustom: true,
    };
    
    await onSave(newWord);
    setWord('');
    setEmoji('📦');
    setColor('#4A9FD4');
    setCategory(selectedCategory || 'things');
    setImageUrl('');
    setHasSubmenu(false);
    setSubmenuCategory('');
    setLoading(false);
    onClose();
  };

  const colors = ['#E63B2E', '#F5A623', '#F8D14A', '#5CB85C', '#4A9FD4', '#8E6BBF', '#E86B9A', '#87CEEB', '#8B5A2B'];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-[#4A9FD4] text-white p-4 flex items-center justify-between sticky top-0">
          <h3 className="font-display text-xl flex items-center gap-2">
            <Plus size={24} />
            Add New Word
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Word Input */}
          <div>
            <label className="block font-crayon text-gray-600 mb-1">Word or Phrase</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="e.g., grandma, chocolate, swimming"
                className="flex-1 p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#4A9FD4] outline-none"
              />
              <button
                onClick={handleAiSuggest}
                disabled={!word.trim() || aiLoading}
                className="px-3 bg-purple-100 border-2 border-purple-300 rounded-xl hover:bg-purple-200 
                         disabled:opacity-50 flex items-center gap-1"
                title="AI Suggest"
              >
                {aiLoading ? <Loader2 size={18} className="animate-spin text-purple-600" /> : <Sparkles size={18} className="text-purple-600" />}
              </button>
            </div>
          </div>

          {/* Emoji & Color Row */}
          <div className="flex gap-4">
            <div>
              <label className="block font-crayon text-gray-600 mb-1">Emoji</label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value.slice(-2))}
                className="w-16 p-3 text-2xl text-center border-3 border-gray-300 rounded-xl focus:border-[#4A9FD4] outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block font-crayon text-gray-600 mb-1">Color</label>
              <div className="flex gap-1.5 flex-wrap">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-3 transition-all ${color === c ? 'scale-110 border-gray-800' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block font-crayon text-gray-600 mb-1">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-2 rounded-lg border-2 text-center transition-all ${
                    category === cat.id ? 'border-[#4A9FD4] bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <p className="text-xs font-crayon">{cat.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Sub-menu Option */}
          <div className="bg-gray-50 rounded-xl p-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasSubmenu}
                onChange={(e) => setHasSubmenu(e.target.checked)}
                className="w-5 h-5 rounded"
              />
              <div>
                <p className="font-crayon text-gray-700">This word opens more options</p>
                <p className="text-xs text-gray-500">When tapped, show a sub-menu of related words</p>
              </div>
            </label>
            
            {hasSubmenu && (
              <div className="mt-3 pl-8">
                <label className="block font-crayon text-gray-600 mb-1 text-sm">Link to category:</label>
                <select
                  value={submenuCategory}
                  onChange={(e) => setSubmenuCategory(e.target.value)}
                  className="w-full p-2 border-2 border-gray-300 rounded-lg font-crayon text-sm"
                >
                  <option value="">-- Select category --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-crayon text-gray-600 mb-1">Custom Image (Optional)</label>
            <div className="flex gap-3 items-center">
              {imageUrl ? (
                <div className="relative">
                  <img src={imageUrl} alt="Preview" className="w-14 h-14 object-cover rounded-lg border-2" />
                  <button onClick={() => setImageUrl('')} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full">
                    <X size={10} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-14 h-14 border-3 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-[#4A9FD4]"
                >
                  <Upload size={20} className="text-gray-400" />
                </button>
              )}
              <p className="text-xs text-gray-500 font-crayon flex-1">Upload a photo (max 500KB)</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>

          {/* Preview */}
          <div>
            <label className="block font-crayon text-gray-600 mb-1">Preview</label>
            <div className="flex justify-center">
              <WordButton
                word={{ id: 'preview', text: word || 'Word', emoji, color, imageUrl, hasSubmenu }}
                onClick={() => {}}
                size="large"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 border-3 border-gray-300 rounded-xl font-crayon hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!word.trim() || loading}
              className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl font-display hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
              Save Word
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Sentence Strip Component
// ============================================

const SentenceStrip = ({ words, onSpeak, onClear, onUndo, isSpeaking }) => {
  if (words.length === 0) {
    return (
      <div className="bg-white/70 rounded-2xl border-3 border-dashed border-gray-300 p-4 text-center">
        <p className="text-gray-400 font-crayon">Tap words to build a sentence</p>
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
          <button onClick={onUndo} className="p-2.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200" title="Undo">
            <Undo2 size={18} />
          </button>
          <button onClick={onSpeak} disabled={isSpeaking} className="p-2.5 bg-[#5CB85C] text-white rounded-full hover:bg-green-600 shadow-md" title="Speak">
            <Volume2 size={18} />
          </button>
          <button onClick={onClear} className="p-2.5 bg-[#E63B2E] text-white rounded-full hover:bg-red-600" title="Clear">
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
  const toast = useToast();
  const { user } = useAuth();
  const { speak, isSpeaking } = useSpeech();
  
  // State
  const [sentence, setSentence] = useState([]);
  const [view, setView] = useState('main');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [useArasaac, setUseArasaac] = useState(() => localStorage.getItem('snw_aac_symbols') === 'arasaac');
  const [layout, setLayout] = useState(() => localStorage.getItem('snw_aac_layout') || 'basic');
  const [customWords, setCustomWords] = useState({});
  const [cloudWords, setCloudWords] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLayoutInfo, setShowLayoutInfo] = useState(false);
  const [loadingCloud, setLoadingCloud] = useState(false);

  // Load custom words from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(CUSTOM_WORDS_KEY);
    if (saved) {
      try {
        setCustomWords(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading custom words:', e);
      }
    }
  }, []);

  // Load cloud words when layout changes to cloud
  useEffect(() => {
    if (layout === 'cloud' && isSupabaseConfigured()) {
      loadCloudWords();
    }
  }, [layout]);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('snw_aac_symbols', useArasaac ? 'arasaac' : 'emoji');
    localStorage.setItem('snw_aac_layout', layout);
  }, [useArasaac, layout]);

  // Load popular words from cloud
  const loadCloudWords = async () => {
    setLoadingCloud(true);
    try {
      const wordsByCategory = {};
      
      for (const cat of NOUN_CATEGORIES) {
        const { data, error } = await supabase.rpc('get_popular_aac_words', {
          p_category: cat.id,
          p_limit: 15,
          p_min_uses: 2
        });
        
        if (!error && data) {
          wordsByCategory[cat.id] = data.map(w => ({
            id: w.id,
            text: w.text,
            emoji: w.emoji,
            color: w.color,
            imageUrl: w.image_url,
            hasSubmenu: w.has_submenu,
            submenuCategory: w.submenu_category,
            use_count: w.use_count,
            unique_users: w.unique_users,
            isCloud: true,
          }));
        }
      }
      
      setCloudWords(wordsByCategory);
    } catch (err) {
      console.error('Error loading cloud words:', err);
      toast.error('Cloud Error', 'Could not load community words');
    } finally {
      setLoadingCloud(false);
    }
  };

  // Record word usage for popularity tracking
  const recordWordUse = async (word) => {
    if (!isSupabaseConfigured() || !user || !word.isCloud) return;
    
    try {
      await supabase.rpc('record_word_use', {
        p_word_id: word.id,
        p_user_id: user.id
      });
    } catch (err) {
      console.error('Error recording word use:', err);
    }
  };

  // Get nouns for current category based on layout
  const getNounsForCategory = (catId) => {
    const defaultNouns = DEFAULT_NOUNS[catId] || [];
    const custom = customWords[catId] || [];
    const cloud = cloudWords[catId] || [];
    
    switch (layout) {
      case 'cloud':
        // Cloud words first, then defaults for categories with few cloud words
        return cloud.length >= 5 ? cloud : [...cloud, ...defaultNouns.slice(0, 15 - cloud.length)];
      case 'personal':
        // Custom words first, then defaults
        return [...custom, ...defaultNouns];
      case 'basic':
      default:
        // Defaults with custom words mixed in
        return [...custom, ...defaultNouns];
    }
  };

  // Save custom word
  const saveCustomWord = async (word) => {
    const category = word.category || 'things';
    const updated = {
      ...customWords,
      [category]: [...(customWords[category] || []), word],
    };
    setCustomWords(updated);
    localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(updated));
    
    // Also save to cloud if signed in
    if (isSupabaseConfigured() && user) {
      try {
        await supabase.from('aac_words').insert({
          text: word.text,
          text_normalized: word.text.toLowerCase(),
          emoji: word.emoji,
          color: word.color,
          category: category,
          image_url: word.imageUrl,
          has_submenu: word.hasSubmenu || false,
          submenu_category: word.submenuCategory,
          is_public: true,
          use_count: 1,
          unique_users: 1,
          created_by: user.id,
        });
        toast.success('Word Saved!', 'Added to your library and shared with the community');
      } catch (err) {
        console.error('Cloud save error:', err);
        toast.success('Word Saved', 'Saved to your local library');
      }
    } else {
      toast.success('Word Saved', 'Added to your personal library');
    }
  };

  // Add word to sentence
  const addWord = (word) => {
    setSentence(prev => [...prev, word]);
    speak(word.text);
    recordWordUse(word);
    
    // Handle navigation based on word properties
    if (word.needsNoun || (word.hasSubmenu && !word.submenuCategory)) {
      setView('categories');
    } else if (word.needsPlace) {
      setSelectedCategory('places');
      setView('nouns');
    } else if (word.needsAdjective) {
      setSelectedCategory('feelings');
      setView('nouns');
    } else if (word.submenuCategory || word.submenu_category) {
      setSelectedCategory(word.submenuCategory || word.submenu_category);
      setView('nouns');
    }
  };

  // Add noun and return to main
  const addNoun = (noun) => {
    setSentence(prev => [...prev, noun]);
    speak(noun.text);
    recordWordUse(noun);
    
    // Check if this noun has its own submenu
    if (noun.hasSubmenu && noun.submenuCategory) {
      setSelectedCategory(noun.submenuCategory);
      // Stay in nouns view but change category
    } else {
      setView('main');
      setSelectedCategory(null);
    }
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

  const currentCategory = NOUN_CATEGORIES.find(c => c.id === selectedCategory);

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
                ARASAAC
              </>
            ) : (
              <>
                <Smile size={16} />
                EMOJI
              </>
            )}
          </button>
          
          {/* Add Word Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 bg-[#5CB85C] text-white rounded-full hover:bg-green-600 shadow-md"
            title="Add new word"
          >
            <Plus size={20} />
          </button>
        </div>
      </header>

      {/* Layout Toggle & Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-gray-200">
        <div className="max-w-4xl mx-auto px-3 py-2">
          {/* Layout buttons */}
          <div className="flex items-center justify-center gap-2 mb-2">
            {Object.entries(LAYOUT_INFO).map(([id, info]) => {
              const Icon = info.icon;
              return (
                <button
                  key={id}
                  onClick={() => setLayout(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-crayon transition-all
                    ${layout === id 
                      ? 'text-white shadow-md' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                    }`}
                  style={layout === id ? { backgroundColor: info.color } : {}}
                >
                  <Icon size={14} />
                  {info.title}
                </button>
              );
            })}
            {loadingCloud && <Loader2 size={16} className="animate-spin text-[#4A9FD4]" />}
          </div>
          
          {/* Layout info panel */}
          <LayoutInfoPanel 
            layout={layout} 
            isExpanded={showLayoutInfo} 
            onToggle={() => setShowLayoutInfo(!showLayoutInfo)} 
          />
        </div>
      </div>

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
            {/* Quick Words */}
            <div>
              <h3 className="font-display text-sm text-gray-600 mb-2">⚡ Quick Words</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {CORE_WORDS.quickWords.slice(0, 12).map(word => (
                  <WordButton key={word.id} word={word} onClick={addWord} size="small" useArasaac={useArasaac} showSubmenuIndicator={false} />
                ))}
              </div>
            </div>

            {/* Starters */}
            <div>
              <h3 className="font-display text-sm text-gray-600 mb-2">👤 Who</h3>
              <div className="grid grid-cols-6 gap-2">
                {CORE_WORDS.starters.map(word => (
                  <WordButton key={word.id} word={word} onClick={addWord} size="small" useArasaac={useArasaac} showSubmenuIndicator={false} />
                ))}
              </div>
            </div>

            {/* Verbs - show submenu indicators */}
            <div>
              <h3 className="font-display text-sm text-gray-600 mb-2 flex items-center gap-2">
                🎬 Action
                <span className="text-xs text-gray-400 font-crayon">(▸ = more options)</span>
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {CORE_WORDS.verbs.map(word => (
                  <WordButton key={word.id} word={word} onClick={addWord} size="small" useArasaac={useArasaac} />
                ))}
              </div>
            </div>

            {/* Adjectives */}
            <div>
              <h3 className="font-display text-sm text-gray-600 mb-2">🎨 Feelings</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {CORE_WORDS.adjectives.map(word => (
                  <WordButton key={word.id} word={word} onClick={addWord} size="small" useArasaac={useArasaac} showSubmenuIndicator={false} />
                ))}
              </div>
            </div>

            {/* Questions */}
            <div>
              <h3 className="font-display text-sm text-gray-600 mb-2">❓ Questions</h3>
              <div className="grid grid-cols-6 gap-2">
                {CORE_WORDS.questions.map(word => (
                  <WordButton key={word.id} word={word} onClick={addWord} size="small" useArasaac={useArasaac} showSubmenuIndicator={false} />
                ))}
              </div>
            </div>

            {/* Categories Button */}
            <button
              onClick={() => setView('categories')}
              className="w-full py-4 bg-gradient-to-r from-[#4A9FD4] to-[#8E6BBF] text-white rounded-xl 
                       font-display text-lg flex items-center justify-center gap-2 hover:opacity-90 shadow-lg"
            >
              <FolderOpen size={24} />
              More Words (Categories)
            </button>
          </div>
        )}

        {view === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button onClick={goBack} className="p-2 bg-white border-2 border-gray-300 rounded-full hover:border-[#4A9FD4]">
                <ChevronLeft size={20} />
              </button>
              <h2 className="font-display text-lg text-gray-800">Choose a Category</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {NOUN_CATEGORIES.map(cat => {
                const wordCount = getNounsForCategory(cat.id).length;
                const customCount = customWords[cat.id]?.length || 0;
                const cloudCount = cloudWords[cat.id]?.length || 0;
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => selectCategory(cat)}
                    className="p-4 rounded-xl border-4 transition-all hover:scale-105 text-center relative"
                    style={{ backgroundColor: `${cat.color}20`, borderColor: cat.color }}
                  >
                    <span className="text-4xl">{cat.emoji}</span>
                    <p className="font-display text-sm mt-2" style={{ color: cat.color }}>{cat.name}</p>
                    <p className="text-xs text-gray-500 font-crayon">{wordCount} words</p>
                    
                    {/* Show custom/cloud indicators */}
                    <div className="flex justify-center gap-1 mt-1">
                      {layout === 'personal' && customCount > 0 && (
                        <span className="text-xs bg-[#F5A623]/20 text-[#F5A623] px-1.5 rounded-full">+{customCount}</span>
                      )}
                      {layout === 'cloud' && cloudCount > 0 && (
                        <span className="text-xs bg-[#4A9FD4]/20 text-[#4A9FD4] px-1.5 rounded-full flex items-center gap-0.5">
                          <Cloud size={10} />{cloudCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {view === 'nouns' && selectedCategory && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button onClick={goBack} className="p-2 bg-white border-2 border-gray-300 rounded-full hover:border-[#4A9FD4]">
                <ChevronLeft size={20} />
              </button>
              <h2 className="font-display text-lg text-gray-800 flex-1">
                {currentCategory?.emoji} {currentCategory?.name}
              </h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 bg-[#5CB85C] text-white rounded-full text-sm font-crayon flex items-center gap-1 shadow-md"
              >
                <Plus size={14} />
                Add Word
              </button>
            </div>
            
            {/* Legend for cloud layout */}
            {layout === 'cloud' && (
              <div className="flex items-center gap-4 text-xs text-gray-500 font-crayon bg-blue-50 rounded-lg px-3 py-2">
                <span className="flex items-center gap-1"><TrendingUp size={12} /> = popularity</span>
                <span className="flex items-center gap-1"><ChevronRight size={12} /> = has sub-menu</span>
              </div>
            )}
            
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {getNounsForCategory(selectedCategory).map(noun => (
                <WordButton key={noun.id} word={noun} onClick={addNoun} size="normal" useArasaac={useArasaac} />
              ))}
            </div>
            
            {/* Empty state */}
            {getNounsForCategory(selectedCategory).length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 font-crayon mb-4">No words in this category yet</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-[#5CB85C] text-white rounded-xl font-crayon"
                >
                  Add the first word!
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 bg-white border-t-4 border-gray-200 py-2 px-4">
        <div className="max-w-4xl mx-auto flex justify-around items-center">
          <button onClick={() => addWord({ id: 'yes-quick', text: 'Yes', emoji: '✅', color: '#5CB85C' })} className="flex flex-col items-center p-2 text-[#5CB85C] hover:scale-110">
            <span className="text-2xl">✅</span>
            <span className="text-xs font-crayon mt-0.5">Yes</span>
          </button>
          <button onClick={() => addWord({ id: 'no-quick', text: 'No', emoji: '❌', color: '#E63B2E' })} className="flex flex-col items-center p-2 text-[#E63B2E] hover:scale-110">
            <span className="text-2xl">❌</span>
            <span className="text-xs font-crayon mt-0.5">No</span>
          </button>
          <button onClick={() => navigate('/')} className="flex flex-col items-center p-2 text-gray-500 hover:text-[#4A9FD4]">
            <Home size={24} />
            <span className="text-xs font-crayon mt-0.5">Home</span>
          </button>
        </div>
      </nav>

      {/* Add Word Modal */}
      <AddWordModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={saveCustomWord}
        categories={NOUN_CATEGORIES}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};

export default PointToTalk;
