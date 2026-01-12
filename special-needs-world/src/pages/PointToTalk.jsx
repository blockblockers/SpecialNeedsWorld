import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX,
  Home,
  Settings,
  Grid3X3,
  Trash2,
  ChevronLeft,
  Image,
  Smile,
  X,
  Check,
  Edit3,
  Cloud,
  CloudOff
} from 'lucide-react';
import { 
  getButtonPictogramUrl, 
  preloadPictograms,
  ARASAAC_PICTOGRAM_IDS 
} from '../services/arasaac';
import { 
  getCustomizations,
  saveCustomization,
  removeCustomization,
  fullSync as syncAACCustomizations
} from '../services/aacSync';
import { useAuth } from '../App';
import CustomButtonEditor from '../components/CustomButtonEditor';

// ============================================
// AAC Communication Boards Data
// ============================================

const categories = [
  { id: 'basic', name: 'Basic Needs', emoji: '🙋', color: '#E63B2E' },
  { id: 'feelings', name: 'Feelings', emoji: '😊', color: '#F5A623' },
  { id: 'food', name: 'Food & Drink', emoji: '🍎', color: '#5CB85C' },
  { id: 'actions', name: 'Actions', emoji: '🏃', color: '#4A9FD4' },
  { id: 'places', name: 'Places', emoji: '🏠', color: '#8E6BBF' },
  { id: 'people', name: 'People', emoji: '👨‍👩‍👧', color: '#E86B9A' },
  { id: 'things', name: 'Things', emoji: '🎾', color: '#F8D14A' },
  { id: 'questions', name: 'Questions', emoji: '❓', color: '#87CEEB' },
];

// Communication buttons for each category
const boardData = {
  basic: [
    { id: 'yes', text: 'Yes', emoji: '✅', color: '#5CB85C' },
    { id: 'no', text: 'No', emoji: '❌', color: '#E63B2E' },
    { id: 'help', text: 'Help me', emoji: '🙋', color: '#F5A623' },
    { id: 'more', text: 'More please', emoji: '➕', color: '#4A9FD4' },
    { id: 'stop', text: 'Stop', emoji: '🛑', color: '#E63B2E' },
    { id: 'wait', text: 'Wait', emoji: '✋', color: '#F5A623' },
    { id: 'bathroom', text: 'Bathroom', emoji: '🚽', color: '#8E6BBF' },
    { id: 'tired', text: "I'm tired", emoji: '😴', color: '#87CEEB' },
    { id: 'hurt', text: 'It hurts', emoji: '🤕', color: '#E86B9A' },
    { id: 'all-done', text: 'All done', emoji: '🏁', color: '#5CB85C' },
    { id: 'drink', text: 'I want drink', emoji: '🥤', color: '#4A9FD4' },
    { id: 'hungry', text: "I'm hungry", emoji: '🍽️', color: '#F5A623' },
  ],
  feelings: [
    { id: 'happy', text: "I'm happy", emoji: '😊', color: '#F8D14A' },
    { id: 'sad', text: "I'm sad", emoji: '😢', color: '#4A9FD4' },
    { id: 'angry', text: "I'm angry", emoji: '😠', color: '#E63B2E' },
    { id: 'scared', text: "I'm scared", emoji: '😨', color: '#8E6BBF' },
    { id: 'excited', text: "I'm excited", emoji: '🤩', color: '#F5A623' },
    { id: 'calm', text: "I'm calm", emoji: '😌', color: '#5CB85C' },
    { id: 'frustrated', text: "I'm frustrated", emoji: '😤', color: '#E63B2E' },
    { id: 'bored', text: "I'm bored", emoji: '😑', color: '#87CEEB' },
    { id: 'sick', text: "I feel sick", emoji: '🤒', color: '#8E6BBF' },
    { id: 'love', text: 'I love you', emoji: '❤️', color: '#E86B9A' },
    { id: 'proud', text: "I'm proud", emoji: '🥹', color: '#F8D14A' },
    { id: 'silly', text: "I'm being silly", emoji: '🤪', color: '#F5A623' },
  ],
  food: [
    { id: 'water', text: 'Water', emoji: '💧', color: '#4A9FD4' },
    { id: 'juice', text: 'Juice', emoji: '🧃', color: '#F5A623' },
    { id: 'milk', text: 'Milk', emoji: '🥛', color: '#FFFEF5', textColor: '#333' },
    { id: 'apple', text: 'Apple', emoji: '🍎', color: '#E63B2E' },
    { id: 'banana', text: 'Banana', emoji: '🍌', color: '#F8D14A' },
    { id: 'cookie', text: 'Cookie', emoji: '🍪', color: '#8B5A2B' },
    { id: 'pizza', text: 'Pizza', emoji: '🍕', color: '#F5A623' },
    { id: 'chicken', text: 'Chicken', emoji: '🍗', color: '#F5A623' },
    { id: 'sandwich', text: 'Sandwich', emoji: '🥪', color: '#5CB85C' },
    { id: 'snack', text: 'Snack', emoji: '🍿', color: '#E86B9A' },
    { id: 'breakfast', text: 'Breakfast', emoji: '🥣', color: '#87CEEB' },
    { id: 'ice-cream', text: 'Ice cream', emoji: '🍦', color: '#E86B9A' },
  ],
  actions: [
    { id: 'play', text: 'I want to play', emoji: '🎮', color: '#5CB85C' },
    { id: 'go', text: "Let's go", emoji: '🚶', color: '#4A9FD4' },
    { id: 'read', text: 'Read to me', emoji: '📚', color: '#8E6BBF' },
    { id: 'watch', text: 'Watch TV', emoji: '📺', color: '#87CEEB' },
    { id: 'outside', text: 'Go outside', emoji: '🌳', color: '#5CB85C' },
    { id: 'sleep', text: 'Time for bed', emoji: '🛏️', color: '#8E6BBF' },
    { id: 'hug', text: 'I need a hug', emoji: '🤗', color: '#E86B9A' },
    { id: 'sit', text: 'Sit down', emoji: '🪑', color: '#8B5A2B' },
    { id: 'walk', text: 'Go for walk', emoji: '🚶‍♂️', color: '#5CB85C' },
    { id: 'listen', text: 'Listen to music', emoji: '🎵', color: '#F5A623' },
    { id: 'draw', text: 'I want to draw', emoji: '✏️', color: '#F8D14A' },
    { id: 'swim', text: 'Go swimming', emoji: '🏊', color: '#4A9FD4' },
  ],
  places: [
    { id: 'home', text: 'Home', emoji: '🏠', color: '#8B5A2B' },
    { id: 'school', text: 'School', emoji: '🏫', color: '#E63B2E' },
    { id: 'park', text: 'Park', emoji: '🌳', color: '#5CB85C' },
    { id: 'store', text: 'Store', emoji: '🏪', color: '#4A9FD4' },
    { id: 'car', text: 'Car', emoji: '🚗', color: '#E63B2E' },
    { id: 'bedroom', text: 'Bedroom', emoji: '🛏️', color: '#8E6BBF' },
    { id: 'kitchen', text: 'Kitchen', emoji: '🍳', color: '#F5A623' },
    { id: 'bathroom-place', text: 'Bathroom', emoji: '🛁', color: '#87CEEB' },
    { id: 'doctor', text: 'Doctor', emoji: '🏥', color: '#E86B9A' },
    { id: 'restaurant', text: 'Restaurant', emoji: '🍽️', color: '#F5A623' },
    { id: 'playground', text: 'Playground', emoji: '🛝', color: '#5CB85C' },
    { id: 'grandma', text: "Grandma's house", emoji: '👵', color: '#E86B9A' },
  ],
  people: [
    { id: 'mom', text: 'Mom', emoji: '👩', color: '#E86B9A' },
    { id: 'dad', text: 'Dad', emoji: '👨', color: '#4A9FD4' },
    { id: 'brother', text: 'Brother', emoji: '👦', color: '#5CB85C' },
    { id: 'sister', text: 'Sister', emoji: '👧', color: '#F5A623' },
    { id: 'grandma-person', text: 'Grandma', emoji: '👵', color: '#8E6BBF' },
    { id: 'grandpa', text: 'Grandpa', emoji: '👴', color: '#8B5A2B' },
    { id: 'teacher', text: 'Teacher', emoji: '👩‍🏫', color: '#E63B2E' },
    { id: 'friend', text: 'Friend', emoji: '🧑‍🤝‍🧑', color: '#F8D14A' },
    { id: 'baby', text: 'Baby', emoji: '👶', color: '#E86B9A' },
    { id: 'doctor-person', text: 'Doctor', emoji: '👨‍⚕️', color: '#87CEEB' },
    { id: 'pet', text: 'Pet', emoji: '🐕', color: '#8B5A2B' },
    { id: 'me', text: 'Me', emoji: '🙋', color: '#F5A623' },
  ],
  things: [
    { id: 'toy', text: 'Toy', emoji: '🧸', color: '#8B5A2B' },
    { id: 'ball', text: 'Ball', emoji: '⚽', color: '#5CB85C' },
    { id: 'book', text: 'Book', emoji: '📖', color: '#8E6BBF' },
    { id: 'phone', text: 'Phone', emoji: '📱', color: '#4A9FD4' },
    { id: 'tablet', text: 'Tablet', emoji: '📱', color: '#87CEEB' },
    { id: 'blanket', text: 'Blanket', emoji: '🛏️', color: '#E86B9A' },
    { id: 'clothes', text: 'Clothes', emoji: '👕', color: '#F5A623' },
    { id: 'shoes', text: 'Shoes', emoji: '👟', color: '#E63B2E' },
    { id: 'backpack', text: 'Backpack', emoji: '🎒', color: '#4A9FD4' },
    { id: 'crayons', text: 'Crayons', emoji: '🖍️', color: '#F8D14A' },
    { id: 'blocks', text: 'Blocks', emoji: '🧱', color: '#E63B2E' },
    { id: 'puzzle', text: 'Puzzle', emoji: '🧩', color: '#5CB85C' },
  ],
  questions: [
    { id: 'what', text: 'What?', emoji: '❓', color: '#4A9FD4' },
    { id: 'where', text: 'Where?', emoji: '📍', color: '#E63B2E' },
    { id: 'when', text: 'When?', emoji: '🕐', color: '#F5A623' },
    { id: 'who', text: 'Who?', emoji: '👤', color: '#8E6BBF' },
    { id: 'why', text: 'Why?', emoji: '🤔', color: '#5CB85C' },
    { id: 'how', text: 'How?', emoji: '💭', color: '#87CEEB' },
    { id: 'can-i', text: 'Can I?', emoji: '🙏', color: '#E86B9A' },
    { id: 'whats-next', text: "What's next?", emoji: '➡️', color: '#F8D14A' },
    { id: 'how-long', text: 'How long?', emoji: '⏰', color: '#F5A623' },
    { id: 'again', text: 'Say it again', emoji: '🔄', color: '#4A9FD4' },
    { id: 'dont-understand', text: "I don't understand", emoji: '😕', color: '#8E6BBF' },
    { id: 'whats-that', text: "What's that?", emoji: '👀', color: '#5CB85C' },
  ],
};

// ============================================
// Speech Synthesis Hook
// ============================================

const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      const englishVoice = availableVoices.find(v => 
        v.lang.startsWith('en') && v.name.includes('Google')
      ) || availableVoices.find(v => v.lang.startsWith('en'));
      
      if (englishVoice) {
        setSelectedVoice(englishVoice);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text) => {
    if (!isSupported || !text) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [isSupported, selectedVoice]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking, isSupported, voices, selectedVoice, setSelectedVoice };
};

// ============================================
// AAC Button Component with ARASAAC and custom image support
// ============================================

const AACButton = ({ button, onClick, onLongPress, useArasaac, isSpeaking, customImage }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const longPressTimer = useRef(null);
  const isLongPress = useRef(false);
  
  const pictogramUrl = useArasaac && ARASAAC_PICTOGRAM_IDS[button.id] 
    ? getButtonPictogramUrl(button.id) 
    : null;
  
  // Priority: customImage > ARASAAC > emoji
  const showCustomImage = customImage && !imageError;
  const showPictogram = !showCustomImage && useArasaac && pictogramUrl && !imageError;
  
  const handleTouchStart = () => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      if (onLongPress) onLongPress(button);
    }, 800);
  };
  
  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (!isLongPress.current) {
      onClick(button);
    }
  };
  
  const handleClick = (e) => {
    // For non-touch devices
    if (e.detail === 1) { // Single click
      onClick(button);
    }
  };
  
  const handleContextMenu = (e) => {
    e.preventDefault();
    if (onLongPress) onLongPress(button);
  };
  
  return (
    <button
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onContextMenu={handleContextMenu}
      className={`
        p-3 sm:p-4 rounded-xl border-4 transition-all relative
        hover:scale-105 active:scale-95 shadow-crayon
        ${isSpeaking ? 'opacity-80' : ''}
        flex flex-col items-center justify-center
      `}
      style={{ 
        backgroundColor: button.color,
        borderColor: button.color,
        color: button.textColor || 'white',
        borderRadius: '16px 6px 16px 6px',
        minHeight: useArasaac || customImage ? '100px' : '80px',
      }}
    >
      {/* Edit indicator */}
      {customImage && (
        <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
          <Edit3 size={10} className="text-gray-600" />
        </div>
      )}
      
      {showCustomImage ? (
        <div className="w-12 h-12 sm:w-14 sm:h-14 mb-1 flex items-center justify-center">
          <img
            src={customImage}
            alt={button.text}
            className="w-full h-full object-cover rounded-lg"
            onError={() => setImageError(true)}
          />
        </div>
      ) : showPictogram ? (
        <div className="w-12 h-12 sm:w-14 sm:h-14 mb-1 flex items-center justify-center relative">
          <img
            src={pictogramUrl}
            alt={button.text}
            className={`max-w-full max-h-full object-contain rounded-lg bg-white p-1
                       transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          {!imageLoaded && (
            <div className="absolute w-10 h-10 bg-white/50 rounded-lg animate-pulse" />
          )}
        </div>
      ) : (
        <div className="text-3xl sm:text-4xl mb-1">{button.emoji}</div>
      )}
      <div className="font-crayon text-xs sm:text-sm leading-tight text-center">
        {button.text}
      </div>
    </button>
  );
};

// ============================================
// Settings Modal
// ============================================

const SettingsModal = ({ isOpen, onClose, useArasaac, setUseArasaac }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-[#FFFEF5] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl
                   border-4 border-[#4A9FD4]"
      >
        <div className="bg-[#4A9FD4] text-white p-4 flex items-center justify-between">
          <h3 className="font-display text-xl flex items-center gap-2">
            <Settings size={24} />
            Settings
          </h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Symbol Style Toggle */}
          <div>
            <h4 className="font-display text-lg text-gray-800 mb-3">Symbol Style</h4>
            <div className="flex gap-3">
              <button
                onClick={() => setUseArasaac(false)}
                className={`flex-1 p-4 rounded-xl border-3 transition-all ${
                  !useArasaac 
                    ? 'border-[#5CB85C] bg-[#5CB85C]/10' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Smile size={32} className="mx-auto mb-2 text-[#F5A623]" />
                <div className="font-crayon text-sm">Emoji</div>
                <div className="text-xs text-gray-500 mt-1">Simple & colorful</div>
                {!useArasaac && <Check size={16} className="mx-auto mt-2 text-[#5CB85C]" />}
              </button>
              
              <button
                onClick={() => setUseArasaac(true)}
                className={`flex-1 p-4 rounded-xl border-3 transition-all ${
                  useArasaac 
                    ? 'border-[#5CB85C] bg-[#5CB85C]/10' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Image size={32} className="mx-auto mb-2 text-[#4A9FD4]" />
                <div className="font-crayon text-sm">ARASAAC</div>
                <div className="text-xs text-gray-500 mt-1">Real pictograms</div>
                {useArasaac && <Check size={16} className="mx-auto mt-2 text-[#5CB85C]" />}
              </button>
            </div>
          </div>
          
          {/* ARASAAC Attribution */}
          {useArasaac && (
            <div className="p-3 bg-[#87CEEB]/20 rounded-xl">
              <p className="text-xs text-gray-600 text-center">
                Pictograms by{' '}
                <a 
                  href="https://arasaac.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#4A9FD4] hover:underline"
                >
                  ARASAAC
                </a>
                {' '}(CC BY-NC-SA)
              </p>
            </div>
          )}
        </div>
        
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#5CB85C] text-white rounded-xl font-crayon
                     hover:bg-green-600 transition-all"
          >
            Done
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
  const { user } = useAuth();
  const { speak, stop, isSpeaking, isSupported } = useSpeech();
  const [currentCategory, setCurrentCategory] = useState(null);
  const [sentence, setSentence] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [useArasaac, setUseArasaac] = useState(() => {
    // Load preference from localStorage
    const saved = localStorage.getItem('snw_aac_use_arasaac');
    return saved === 'true';
  });
  
  // Custom button state
  const [customButtons, setCustomButtons] = useState({});
  const [editingButton, setEditingButton] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle');
  const longPressTimer = useRef(null);

  // Load custom buttons (from cloud or local)
  useEffect(() => {
    const loadCustomizations = async () => {
      setSyncStatus('syncing');
      try {
        const result = await getCustomizations(user?.id);
        setCustomButtons(result.data);
        setSyncStatus(result.source === 'cloud' ? 'synced' : 'local');
      } catch (error) {
        console.error('Error loading customizations:', error);
        setSyncStatus('error');
      }
    };
    
    loadCustomizations();
  }, [user?.id]);

  // Initial sync on mount
  useEffect(() => {
    if (user?.id) {
      syncAACCustomizations(user.id).catch(console.error);
    }
  }, [user?.id]);

  // Save ARASAAC preference
  useEffect(() => {
    localStorage.setItem('snw_aac_use_arasaac', useArasaac.toString());
  }, [useArasaac]);

  // Preload ARASAAC images when enabled
  useEffect(() => {
    if (useArasaac && currentCategory) {
      const buttonIds = boardData[currentCategory.id]?.map(b => b.id) || [];
      preloadPictograms(buttonIds);
    }
  }, [useArasaac, currentCategory]);

  // Long press handlers for editing
  const handleButtonTouchStart = (button) => {
    longPressTimer.current = setTimeout(() => {
      setEditingButton(button);
    }, 800); // 800ms long press
  };

  const handleButtonTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Save custom button (local + cloud)
  const saveCustomButton = async ({ buttonId, customImage, customText }) => {
    const customization = { customImage, customText };
    
    // Update local state immediately
    setCustomButtons(prev => ({
      ...prev,
      [buttonId]: customization
    }));
    
    // Sync to cloud
    if (user?.id) {
      setSyncStatus('syncing');
      try {
        await saveCustomization(user.id, buttonId, customization);
        setSyncStatus('synced');
      } catch (error) {
        console.error('Error saving customization:', error);
        setSyncStatus('error');
      }
    }
  };

  // Remove custom button (local + cloud)
  const removeCustomButton = async (buttonId) => {
    // Update local state immediately
    setCustomButtons(prev => {
      const next = { ...prev };
      delete next[buttonId];
      return next;
    });
    
    // Sync to cloud
    if (user?.id) {
      setSyncStatus('syncing');
      try {
        await removeCustomization(user.id, buttonId);
        setSyncStatus('synced');
      } catch (error) {
        console.error('Error removing customization:', error);
        setSyncStatus('error');
      }
    }
  };

  // Get button display (with custom overrides)
  const getButtonDisplay = (button) => {
    const custom = customButtons[button.id];
    return {
      ...button,
      text: custom?.customText || button.text,
      customImage: custom?.customImage || null,
    };
  };

  const handleButtonPress = (button) => {
    speak(button.text);
    setSentence(prev => [...prev, button]);
  };

  const speakSentence = () => {
    if (sentence.length === 0) return;
    const fullText = sentence.map(b => b.text).join('. ');
    speak(fullText);
  };

  const clearSentence = () => {
    stop();
    setSentence([]);
  };

  const goToCategories = () => {
    setCurrentCategory(null);
  };

  const currentButtons = currentCategory ? boardData[currentCategory.id] : [];

  return (
    <div className="min-h-screen bg-[#FFFEF5] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
        <div className="max-w-4xl mx-auto px-3 py-2 flex items-center gap-2">
          <button
            onClick={() => currentCategory ? goToCategories() : navigate('/tools')}
            className="flex items-center gap-1 px-3 py-2 bg-white border-3 border-[#F5A623] 
                       rounded-full font-crayon text-[#F5A623] hover:bg-[#F5A623] 
                       hover:text-white transition-all shadow-sm text-sm"
          >
            {currentCategory ? <ChevronLeft size={16} /> : <ArrowLeft size={16} />}
            {currentCategory ? 'Categories' : 'Back'}
          </button>
          
          <img 
            src="/logo.jpeg" 
            alt="Special Needs World" 
            className="w-8 h-8 rounded-lg shadow-sm"
          />
          
          <div className="flex-1">
            <h1 className="text-base sm:text-lg font-display text-[#F5A623] crayon-text flex items-center gap-2">
              💬 {currentCategory ? currentCategory.name : 'Point to Talk'}
            </h1>
          </div>

          {/* Sync Status */}
          {user?.id && Object.keys(customButtons).length > 0 && (
            <div className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
              syncStatus === 'syncing' ? 'bg-[#4A9FD4]/20 text-[#4A9FD4]' :
              syncStatus === 'synced' ? 'bg-[#5CB85C]/20 text-[#5CB85C]' :
              syncStatus === 'error' ? 'bg-[#E63B2E]/20 text-[#E63B2E]' :
              'bg-gray-100 text-gray-500'
            }`}>
              {syncStatus === 'syncing' ? (
                <Cloud size={12} className="animate-pulse" />
              ) : syncStatus === 'synced' ? (
                <Cloud size={12} />
              ) : syncStatus === 'error' ? (
                <CloudOff size={12} />
              ) : null}
            </div>
          )}

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-500 hover:text-[#4A9FD4] hover:bg-[#87CEEB]/20 
                       rounded-full transition-colors"
            title="Settings"
          >
            <Settings size={20} />
          </button>

          {!isSupported && (
            <div className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
              <VolumeX size={14} className="inline mr-1" />
              No Speech
            </div>
          )}
        </div>
      </header>

      {/* Sentence Bar */}
      {sentence.length > 0 && (
        <div className="bg-white border-b-4 border-[#87CEEB] px-3 py-2">
          <div className="max-w-4xl mx-auto flex items-center gap-2">
            <div className="flex-1 flex flex-wrap gap-1.5 items-center min-h-[40px]">
              {sentence.map((item, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[#87CEEB]/30 
                           rounded-lg text-sm font-crayon"
                >
                  <span>{item.emoji}</span>
                  <span>{item.text}</span>
                </span>
              ))}
            </div>
            
            <button
              onClick={speakSentence}
              className="p-2 bg-[#5CB85C] text-white rounded-full hover:bg-green-600 
                       transition-all shadow-sm"
              title="Speak sentence"
            >
              <Volume2 size={20} />
            </button>
            
            <button
              onClick={clearSentence}
              className="p-2 bg-[#E63B2E] text-white rounded-full hover:bg-red-600 
                       transition-all shadow-sm"
              title="Clear"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-3 py-4">
        {!currentCategory ? (
          // Category Selection View
          <div>
            <p className="text-center text-gray-600 font-crayon mb-4 text-sm">
              Tap a category to see communication buttons
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setCurrentCategory(category)}
                  className="p-4 rounded-2xl border-4 text-white transition-all 
                           hover:scale-105 hover:-rotate-1 active:scale-95 shadow-crayon"
                  style={{ 
                    backgroundColor: category.color,
                    borderColor: category.color,
                    borderRadius: '20px 8px 20px 8px',
                  }}
                >
                  <div className="text-4xl mb-2">{category.emoji}</div>
                  <div className="font-display text-base sm:text-lg crayon-text">
                    {category.name}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Symbol Style Indicator */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowSettings(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 
                         rounded-full font-crayon text-sm text-gray-600 hover:border-[#4A9FD4] 
                         hover:text-[#4A9FD4] transition-all"
              >
                {useArasaac ? <Image size={16} /> : <Smile size={16} />}
                Using: {useArasaac ? 'ARASAAC Pictograms' : 'Emoji'}
              </button>
            </div>
          </div>
        ) : (
          // Communication Board View
          <div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
              {currentButtons.map((button) => {
                const displayButton = getButtonDisplay(button);
                return (
                  <AACButton
                    key={button.id}
                    button={displayButton}
                    onClick={handleButtonPress}
                    onLongPress={(b) => setEditingButton(b)}
                    useArasaac={useArasaac}
                    isSpeaking={isSpeaking}
                    customImage={displayButton.customImage}
                  />
                );
              })}
            </div>
            <p className="text-center text-xs font-crayon text-gray-400 mt-3">
              💡 Long-press any button to customize it
            </p>
          </div>
        )}
        
        {/* ARASAAC Attribution */}
        {useArasaac && currentCategory && (
          <div className="mt-4 text-center">
            <a 
              href="https://arasaac.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-[#4A9FD4] hover:underline"
            >
              Pictograms by ARASAAC (CC BY-NC-SA)
            </a>
          </div>
        )}
      </main>

      {/* Quick Access Bar */}
      <nav className="sticky bottom-0 bg-white border-t-4 border-[#87CEEB] px-3 py-2 safe-area-bottom">
        <div className="max-w-4xl mx-auto flex justify-around">
          <button
            onClick={goToCategories}
            className="flex flex-col items-center p-2 text-gray-600 hover:text-[#F5A623] transition-colors"
          >
            <Grid3X3 size={24} />
            <span className="text-xs font-crayon mt-1">Categories</span>
          </button>
          
          <button
            onClick={() => handleButtonPress({ text: 'Yes', emoji: '✅', id: 'yes' })}
            className="flex flex-col items-center p-2 text-[#5CB85C] hover:scale-110 transition-transform"
          >
            <span className="text-2xl">✅</span>
            <span className="text-xs font-crayon mt-1">Yes</span>
          </button>
          
          <button
            onClick={() => handleButtonPress({ text: 'No', emoji: '❌', id: 'no' })}
            className="flex flex-col items-center p-2 text-[#E63B2E] hover:scale-110 transition-transform"
          >
            <span className="text-2xl">❌</span>
            <span className="text-xs font-crayon mt-1">No</span>
          </button>
          
          <button
            onClick={() => handleButtonPress({ text: 'Help me', emoji: '🙋', id: 'help' })}
            className="flex flex-col items-center p-2 text-[#F5A623] hover:scale-110 transition-transform"
          >
            <span className="text-2xl">🙋</span>
            <span className="text-xs font-crayon mt-1">Help</span>
          </button>
          
          <button
            onClick={() => navigate('/hub')}
            className="flex flex-col items-center p-2 text-gray-600 hover:text-[#4A9FD4] transition-colors"
          >
            <Home size={24} />
            <span className="text-xs font-crayon mt-1">Home</span>
          </button>
        </div>
      </nav>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        useArasaac={useArasaac}
        setUseArasaac={setUseArasaac}
      />
      
      {/* Custom Button Editor Modal */}
      {editingButton && (
        <CustomButtonEditor
          button={editingButton}
          customImage={customButtons[editingButton.id]?.customImage}
          onSave={saveCustomButton}
          onRemove={removeCustomButton}
          onClose={() => setEditingButton(null)}
        />
      )}
    </div>
  );
};

export default PointToTalk;
