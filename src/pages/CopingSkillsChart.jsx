// CopingSkillsChart.jsx - Personalized Coping Strategies Tool
// Part of the Emotional Wellness hub
// Helps users build their own toolkit of strategies for different emotions

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart,
  Plus,
  Star,
  Trash2,
  Printer,
  Share2,
  X,
  Check,
  ChevronRight,
  ChevronDown,
  Camera,
  Sparkles,
  Wind,
  Music,
  PersonStanding,
  MessageCircle,
  Pencil,
  Image,
  Volume2,
  HelpCircle,
  Download
} from 'lucide-react';
import { getPictogramUrl } from '../services/arasaac';

// ============================================
// STORAGE KEY
// ============================================
const STORAGE_KEY = 'snw_coping_skills';

// ============================================
// EMOTIONS DATA
// ============================================
const EMOTIONS = [
  { id: 'angry', name: 'Angry', color: '#E63B2E', bgColor: '#FDEDEC', arasaacId: 11318, emoji: '😠' },
  { id: 'sad', name: 'Sad', color: '#4A9FD4', bgColor: '#EBF5FB', arasaacId: 11321, emoji: '😢' },
  { id: 'scared', name: 'Scared', color: '#8E6BBF', bgColor: '#F4ECF7', arasaacId: 6459, emoji: '😨' },
  { id: 'worried', name: 'Worried', color: '#6B7280', bgColor: '#F3F4F6', arasaacId: 11332, emoji: '😟' },
  { id: 'frustrated', name: 'Frustrated', color: '#F5A623', bgColor: '#FEF5E7', arasaacId: 11323, emoji: '😤' },
  { id: 'overwhelmed', name: 'Overwhelmed', color: '#EC4899', bgColor: '#FDF2F8', arasaacId: 11325, emoji: '😵' },
  { id: 'lonely', name: 'Lonely', color: '#64748B', bgColor: '#F1F5F9', arasaacId: 11331, emoji: '😔' },
  { id: 'excited', name: 'Too Excited', color: '#E86B9A', bgColor: '#FDEBF0', arasaacId: 11319, emoji: '🤪' },
];

// ============================================
// PRE-BUILT COPING STRATEGIES
// ============================================
const DEFAULT_STRATEGIES = [
  // Breathing
  { id: 'deep-breaths', name: 'Take Deep Breaths', category: 'breathing', icon: '🌬️', arasaacId: 37285, 
    description: 'Breathe in slowly for 4 counts, hold for 4, breathe out for 4' },
  { id: 'belly-breathing', name: 'Belly Breathing', category: 'breathing', icon: '🫁', arasaacId: 37285,
    description: 'Put hand on tummy and feel it rise and fall as you breathe' },
  { id: 'smell-flower', name: 'Smell the Flower', category: 'breathing', icon: '🌸', arasaacId: 2270,
    description: 'Pretend to smell a flower (breathe in) then blow out a candle (breathe out)' },
  
  // Movement
  { id: 'walk', name: 'Go for a Walk', category: 'movement', icon: '🚶', arasaacId: 3019,
    description: 'Walk around to move your body and clear your mind' },
  { id: 'jump', name: 'Jump Up and Down', category: 'movement', icon: '🦘', arasaacId: 6456,
    description: 'Jump to let out energy - try 10 jumps!' },
  { id: 'stretch', name: 'Stretch Your Body', category: 'movement', icon: '🧘', arasaacId: 3024,
    description: 'Reach up high, touch your toes, roll your shoulders' },
  { id: 'dance', name: 'Dance It Out', category: 'movement', icon: '💃', arasaacId: 3208,
    description: 'Put on music and move your body however feels good' },
  { id: 'run', name: 'Run or Jog', category: 'movement', icon: '🏃', arasaacId: 2995,
    description: 'Run around to use up extra energy' },
  
  // Sensory
  { id: 'squeeze', name: 'Squeeze Something', category: 'sensory', icon: '🤜', arasaacId: 6458,
    description: 'Squeeze a stress ball, pillow, or playdough' },
  { id: 'cold-water', name: 'Cold Water on Face', category: 'sensory', icon: '💧', arasaacId: 2262,
    description: 'Splash cold water on your face or hold ice cubes' },
  { id: 'weighted', name: 'Use a Weighted Blanket', category: 'sensory', icon: '🛏️', arasaacId: 5003,
    description: 'Wrap up in a heavy blanket for a calming squeeze' },
  { id: 'fidget', name: 'Use a Fidget Toy', category: 'sensory', icon: '🔮', arasaacId: 2467,
    description: 'Play with a fidget spinner, cube, or squishy' },
  { id: 'hug', name: 'Get a Hug', category: 'sensory', icon: '🤗', arasaacId: 6458,
    description: 'Ask someone for a hug, or hug a stuffed animal' },
  
  // Mental
  { id: 'count', name: 'Count to 10', category: 'mental', icon: '🔢', arasaacId: 6080,
    description: 'Count slowly to 10 (or backwards from 10 to 1)' },
  { id: 'five-senses', name: '5-4-3-2-1 Senses', category: 'mental', icon: '👁️', arasaacId: 3387,
    description: '5 things you see, 4 hear, 3 touch, 2 smell, 1 taste' },
  { id: 'happy-place', name: 'Think of Happy Place', category: 'mental', icon: '🏖️', arasaacId: 7295,
    description: 'Close eyes and imagine your favorite calm place' },
  { id: 'positive-thought', name: 'Think a Positive Thought', category: 'mental', icon: '💭', arasaacId: 7132,
    description: '"I can do this" or "This feeling will pass"' },
  
  // Social
  { id: 'talk', name: 'Talk to Someone', category: 'social', icon: '💬', arasaacId: 6457,
    description: 'Tell a trusted person how you feel' },
  { id: 'ask-help', name: 'Ask for Help', category: 'social', icon: '🙋', arasaacId: 6521,
    description: 'It\'s okay to ask an adult for help' },
  { id: 'be-alone', name: 'Take Alone Time', category: 'social', icon: '🚪', arasaacId: 2554,
    description: 'Go to a quiet place by yourself for a few minutes' },
  
  // Creative
  { id: 'draw', name: 'Draw or Color', category: 'creative', icon: '🎨', arasaacId: 3262,
    description: 'Draw your feelings or color a picture' },
  { id: 'write', name: 'Write or Journal', category: 'creative', icon: '✏️', arasaacId: 6454,
    description: 'Write down how you feel or what happened' },
  { id: 'music', name: 'Listen to Music', category: 'creative', icon: '🎵', arasaacId: 3811,
    description: 'Put on calming music or your favorite songs' },
  { id: 'sing', name: 'Sing a Song', category: 'creative', icon: '🎤', arasaacId: 3811,
    description: 'Sing your favorite song out loud' },
  
  // Physical comfort
  { id: 'drink-water', name: 'Drink Water', category: 'comfort', icon: '🥤', arasaacId: 32355,
    description: 'Have a drink of cool water' },
  { id: 'snack', name: 'Have a Healthy Snack', category: 'comfort', icon: '🍎', arasaacId: 2360,
    description: 'Eat something healthy if you\'re hungry' },
  { id: 'rest', name: 'Rest or Nap', category: 'comfort', icon: '😴', arasaacId: 5006,
    description: 'Lie down and rest your body' },
  { id: 'cozy-spot', name: 'Go to a Cozy Spot', category: 'comfort', icon: '🛋️', arasaacId: 5001,
    description: 'Find your favorite comfortable place' },
];

// Category metadata
const CATEGORIES = [
  { id: 'breathing', name: 'Breathing', icon: Wind, color: '#87CEEB' },
  { id: 'movement', name: 'Movement', icon: PersonStanding, color: '#5CB85C' },
  { id: 'sensory', name: 'Sensory', icon: Sparkles, color: '#8E6BBF' },
  { id: 'mental', name: 'Mental', icon: Sparkles, color: '#F5A623' },
  { id: 'social', name: 'Social', icon: MessageCircle, color: '#4A9FD4' },
  { id: 'creative', name: 'Creative', icon: Pencil, color: '#E86B9A' },
  { id: 'comfort', name: 'Comfort', icon: Heart, color: '#E63B2E' },
  { id: 'custom', name: 'My Own', icon: Star, color: '#F8D14A' },
];

// ============================================
// SPEAK FUNCTION
// ============================================
const speak = (text) => {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85;
  speechSynthesis.speak(utterance);
};

// ============================================
// STRATEGY CARD COMPONENT
// ============================================
const StrategyCard = ({ strategy, isSelected, isFavorite, onToggle, onFavorite, onSpeak, compact = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div
      className={`relative rounded-xl border-3 transition-all ${
        compact ? 'p-2' : 'p-3'
      } ${
        isSelected 
          ? 'border-green-500 bg-green-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-start gap-2">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(strategy.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
                     transition-colors ${
                       isSelected 
                         ? 'bg-green-500 border-green-500 text-white' 
                         : 'border-gray-300 hover:border-green-400'
                     }`}
        >
          {isSelected && <Check size={14} />}
        </button>
        
        {/* Icon/Image */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
          {strategy.arasaacId ? (
            <img
              src={getPictogramUrl(strategy.arasaacId)}
              alt={strategy.name}
              className={`w-full h-full object-contain p-0.5 transition-opacity ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          ) : strategy.customImage ? (
            <img
              src={strategy.customImage}
              alt={strategy.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl">{strategy.icon}</span>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-display text-sm text-gray-800 leading-tight">
            {strategy.name}
          </h4>
          {!compact && strategy.description && (
            <p className="font-crayon text-xs text-gray-500 mt-0.5 line-clamp-2">
              {strategy.description}
            </p>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onFavorite(strategy.id)}
            className={`p-1 rounded-full transition-colors ${
              isFavorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
            }`}
          >
            <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => onSpeak(strategy.name + '. ' + (strategy.description || ''))}
            className="p-1 rounded-full text-gray-300 hover:text-blue-500 transition-colors"
          >
            <Volume2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// ADD CUSTOM STRATEGY MODAL
// ============================================
const AddStrategyModal = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('⭐');
  const [customImage, setCustomImage] = useState(null);
  const fileInputRef = useRef(null);
  
  const commonIcons = ['⭐', '💪', '🧘', '🎯', '✨', '🌈', '🦋', '🌟', '💚', '🔥', '🎵', '📚', '🏃', '🤝'];
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = () => {
    if (!name.trim()) return;
    
    onSave({
      id: `custom_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      icon,
      customImage,
      category: 'custom',
      isCustom: true,
    });
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-[#5CB85C]">Add Your Own Strategy</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block font-crayon text-sm text-gray-600 mb-1">
              What's your strategy? *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Hug my teddy bear"
              className="w-full px-4 py-3 rounded-xl border-3 border-gray-200 focus:border-[#5CB85C] outline-none font-crayon"
              maxLength={50}
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block font-crayon text-sm text-gray-600 mb-1">
              How does it help? (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Makes me feel safe and calm"
              className="w-full px-4 py-3 rounded-xl border-3 border-gray-200 focus:border-[#5CB85C] outline-none font-crayon resize-none"
              rows={2}
              maxLength={100}
            />
          </div>
          
          {/* Icon Selection */}
          <div>
            <label className="block font-crayon text-sm text-gray-600 mb-1">
              Pick an icon
            </label>
            <div className="flex flex-wrap gap-2">
              {commonIcons.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setIcon(emoji)}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all
                            ${icon === emoji 
                              ? 'bg-[#5CB85C] scale-110 shadow-md' 
                              : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          {/* Custom Image */}
          <div>
            <label className="block font-crayon text-sm text-gray-600 mb-1">
              Or add a photo (optional)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-gray-300 
                         hover:border-[#5CB85C] transition-colors font-crayon text-sm text-gray-500"
              >
                <Camera size={18} />
                {customImage ? 'Change Photo' : 'Add Photo'}
              </button>
              {customImage && (
                <div className="relative">
                  <img src={customImage} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                  <button
                    onClick={() => setCustomImage(null)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full 
                             flex items-center justify-center"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full mt-6 py-3 bg-[#5CB85C] text-white font-display rounded-xl
                   hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Strategy
        </button>
      </div>
    </div>
  );
};

// ============================================
// EMOTION SECTION COMPONENT
// ============================================
const EmotionSection = ({ 
  emotion, 
  selectedStrategies, 
  favorites,
  onToggleStrategy, 
  onToggleFavorite,
  isExpanded,
  onToggleExpand 
}) => {
  const emotionStrategies = selectedStrategies.filter(s => 
    s.emotions?.includes(emotion.id)
  );
  
  return (
    <div 
      className="rounded-2xl border-3 overflow-hidden"
      style={{ borderColor: emotion.color }}
    >
      {/* Header */}
      <button
        onClick={onToggleExpand}
        className="w-full p-4 flex items-center gap-3 transition-colors"
        style={{ backgroundColor: emotion.bgColor }}
      >
        <img
          src={getPictogramUrl(emotion.arasaacId)}
          alt={emotion.name}
          className="w-10 h-10 object-contain bg-white rounded-lg p-1"
        />
        <div className="flex-1 text-left">
          <h3 className="font-display" style={{ color: emotion.color }}>
            When I feel {emotion.name}...
          </h3>
          <p className="font-crayon text-xs text-gray-500">
            {emotionStrategies.length} strategies selected
          </p>
        </div>
        {isExpanded ? (
          <ChevronDown size={24} style={{ color: emotion.color }} />
        ) : (
          <ChevronRight size={24} style={{ color: emotion.color }} />
        )}
      </button>
      
      {/* Content */}
      {isExpanded && (
        <div className="p-4 bg-white space-y-2">
          {emotionStrategies.length > 0 ? (
            emotionStrategies.map(strategy => (
              <div 
                key={strategy.id}
                className="flex items-center gap-2 p-2 rounded-xl bg-gray-50"
              >
                <span className="text-xl">{strategy.icon}</span>
                <span className="flex-1 font-crayon text-sm">{strategy.name}</span>
                <button
                  onClick={() => onToggleFavorite(strategy.id)}
                  className={`p-1 ${favorites.includes(strategy.id) ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  <Star size={16} fill={favorites.includes(strategy.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center font-crayon text-gray-400 py-4">
              No strategies selected yet. Tap "Edit My Chart" to add some!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const CopingSkillsChart = () => {
  const navigate = useNavigate();
  
  // State
  const [view, setView] = useState('chart'); // chart, edit, browse
  const [userStrategies, setUserStrategies] = useState([]); // User's selected strategies with emotion mappings
  const [customStrategies, setCustomStrategies] = useState([]); // User-created strategies
  const [favorites, setFavorites] = useState([]);
  const [expandedEmotions, setExpandedEmotions] = useState(['angry']); // Default expanded
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmotion, setEditingEmotion] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  
  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setUserStrategies(data.userStrategies || []);
        setCustomStrategies(data.customStrategies || []);
        setFavorites(data.favorites || []);
      } catch (e) {
        console.error('Error loading coping skills:', e);
      }
    }
  }, []);
  
  // Save data
  useEffect(() => {
    const data = { userStrategies, customStrategies, favorites };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [userStrategies, customStrategies, favorites]);
  
  // All available strategies (default + custom)
  const allStrategies = [...DEFAULT_STRATEGIES, ...customStrategies];
  
  // Get strategies for current category filter
  const filteredStrategies = selectedCategory === 'all' 
    ? allStrategies 
    : allStrategies.filter(s => s.category === selectedCategory);
  
  // Toggle strategy for an emotion
  const toggleStrategyForEmotion = (strategyId, emotionId) => {
    setUserStrategies(prev => {
      const existing = prev.find(s => s.id === strategyId);
      if (existing) {
        const newEmotions = existing.emotions.includes(emotionId)
          ? existing.emotions.filter(e => e !== emotionId)
          : [...existing.emotions, emotionId];
        
        if (newEmotions.length === 0) {
          return prev.filter(s => s.id !== strategyId);
        }
        return prev.map(s => s.id === strategyId ? { ...s, emotions: newEmotions } : s);
      } else {
        const strategy = allStrategies.find(s => s.id === strategyId);
        if (strategy) {
          return [...prev, { ...strategy, emotions: [emotionId] }];
        }
      }
      return prev;
    });
  };
  
  // Toggle favorite
  const toggleFavorite = (strategyId) => {
    setFavorites(prev => 
      prev.includes(strategyId) 
        ? prev.filter(id => id !== strategyId)
        : [...prev, strategyId]
    );
  };
  
  // Add custom strategy
  const addCustomStrategy = (strategy) => {
    setCustomStrategies(prev => [...prev, strategy]);
  };
  
  // Delete custom strategy
  const deleteCustomStrategy = (strategyId) => {
    setCustomStrategies(prev => prev.filter(s => s.id !== strategyId));
    setUserStrategies(prev => prev.filter(s => s.id !== strategyId));
    setFavorites(prev => prev.filter(id => id !== strategyId));
  };
  
  // Toggle emotion expansion
  const toggleEmotionExpand = (emotionId) => {
    setExpandedEmotions(prev => 
      prev.includes(emotionId)
        ? prev.filter(id => id !== emotionId)
        : [...prev, emotionId]
    );
  };
  
  // Handle print
  const handlePrint = () => {
    window.print();
  };
  
  // Check if strategy is selected for current editing emotion
  const isStrategySelectedForEmotion = (strategyId) => {
    if (!editingEmotion) return false;
    const userStrategy = userStrategies.find(s => s.id === strategyId);
    return userStrategy?.emotions?.includes(editingEmotion) || false;
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/wellness')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#5CB85C] 
                       rounded-xl font-display font-bold text-[#5CB85C] hover:bg-[#5CB85C] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img 
            src="/logo.jpeg" 
            alt="ATLASassist" 
            className="w-10 h-10 rounded-lg shadow-sm"
          />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#5CB85C] crayon-text flex items-center gap-2">
              📋 Coping Skills
            </h1>
          </div>
          
          {/* Actions */}
          <button
            onClick={() => setShowInfo(true)}
            className="p-2 rounded-full hover:bg-gray-100 print:hidden"
          >
            <HelpCircle size={22} className="text-gray-400" />
          </button>
          <button
            onClick={handlePrint}
            className="p-2 rounded-full hover:bg-gray-100 print:hidden"
          >
            <Printer size={22} className="text-gray-400" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* View Toggle */}
        <div className="flex gap-2 mb-6 print:hidden">
          <button
            onClick={() => { setView('chart'); setEditingEmotion(null); }}
            className={`flex-1 py-3 rounded-xl font-display transition-all ${
              view === 'chart' 
                ? 'bg-[#5CB85C] text-white shadow-md' 
                : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#5CB85C]'
            }`}
          >
            My Chart
          </button>
          <button
            onClick={() => setView('edit')}
            className={`flex-1 py-3 rounded-xl font-display transition-all ${
              view === 'edit' 
                ? 'bg-[#5CB85C] text-white shadow-md' 
                : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#5CB85C]'
            }`}
          >
            Edit My Chart
          </button>
        </div>

        {/* ============================================ */}
        {/* CHART VIEW */}
        {/* ============================================ */}
        {view === 'chart' && (
          <div className="space-y-4">
            <p className="text-center font-crayon text-gray-600 mb-4">
              Your personalized coping strategies for different feelings
            </p>
            
            {/* Favorite Strategies Quick Access */}
            {favorites.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-2xl border-3 border-yellow-300 mb-4">
                <h3 className="font-display text-yellow-700 mb-3 flex items-center gap-2">
                  <Star size={18} fill="currentColor" />
                  My Favorite Strategies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {favorites.map(favId => {
                    const strategy = allStrategies.find(s => s.id === favId);
                    if (!strategy) return null;
                    return (
                      <button
                        key={favId}
                        onClick={() => speak(strategy.name + '. ' + (strategy.description || ''))}
                        className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border-2 border-yellow-300
                                 hover:bg-yellow-100 transition-colors"
                      >
                        <span>{strategy.icon}</span>
                        <span className="font-crayon text-sm">{strategy.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Emotion Sections */}
            {EMOTIONS.map(emotion => (
              <EmotionSection
                key={emotion.id}
                emotion={emotion}
                selectedStrategies={userStrategies}
                favorites={favorites}
                onToggleStrategy={toggleStrategyForEmotion}
                onToggleFavorite={toggleFavorite}
                isExpanded={expandedEmotions.includes(emotion.id)}
                onToggleExpand={() => toggleEmotionExpand(emotion.id)}
              />
            ))}
            
            {/* Empty State */}
            {userStrategies.length === 0 && (
              <div className="text-center py-8">
                <p className="font-crayon text-gray-500 mb-4">
                  You haven't added any strategies yet!
                </p>
                <button
                  onClick={() => setView('edit')}
                  className="px-6 py-3 bg-[#5CB85C] text-white rounded-xl font-display
                           hover:bg-green-600 transition-colors"
                >
                  Build My Chart
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/* EDIT VIEW */}
        {/* ============================================ */}
        {view === 'edit' && (
          <div className="space-y-4">
            {/* Step 1: Select Emotion */}
            {!editingEmotion ? (
              <>
                <p className="text-center font-crayon text-gray-600 mb-4">
                  First, pick a feeling to add strategies for:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {EMOTIONS.map(emotion => {
                    const count = userStrategies.filter(s => s.emotions?.includes(emotion.id)).length;
                    return (
                      <button
                        key={emotion.id}
                        onClick={() => setEditingEmotion(emotion.id)}
                        className="p-4 rounded-2xl border-3 transition-all hover:scale-105"
                        style={{ 
                          borderColor: emotion.color, 
                          backgroundColor: emotion.bgColor 
                        }}
                      >
                        <img
                          src={getPictogramUrl(emotion.arasaacId)}
                          alt={emotion.name}
                          className="w-12 h-12 mx-auto mb-2 object-contain"
                        />
                        <p className="font-display text-sm" style={{ color: emotion.color }}>
                          {emotion.name}
                        </p>
                        <p className="font-crayon text-xs text-gray-500">
                          {count} strategies
                        </p>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                {/* Step 2: Select Strategies for Emotion */}
                {(() => {
                  const emotion = EMOTIONS.find(e => e.id === editingEmotion);
                  return (
                    <>
                      <div 
                        className="p-4 rounded-2xl flex items-center gap-3"
                        style={{ backgroundColor: emotion.bgColor }}
                      >
                        <button
                          onClick={() => setEditingEmotion(null)}
                          className="p-2 rounded-full bg-white/50 hover:bg-white transition-colors"
                        >
                          <ArrowLeft size={18} style={{ color: emotion.color }} />
                        </button>
                        <img
                          src={getPictogramUrl(emotion.arasaacId)}
                          alt={emotion.name}
                          className="w-10 h-10 object-contain"
                        />
                        <div>
                          <h3 className="font-display" style={{ color: emotion.color }}>
                            When I feel {emotion.name}...
                          </h3>
                          <p className="font-crayon text-xs text-gray-500">
                            Select strategies that help you
                          </p>
                        </div>
                      </div>
                      
                      {/* Category Filter */}
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        <button
                          onClick={() => setSelectedCategory('all')}
                          className={`px-3 py-1.5 rounded-full text-sm font-crayon whitespace-nowrap
                                    ${selectedCategory === 'all' 
                                      ? 'bg-[#5CB85C] text-white' 
                                      : 'bg-gray-100 text-gray-600'
                                    }`}
                        >
                          All
                        </button>
                        {CATEGORIES.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-full text-sm font-crayon whitespace-nowrap
                                      ${selectedCategory === cat.id 
                                        ? 'text-white' 
                                        : 'bg-gray-100 text-gray-600'
                                      }`}
                            style={{
                              backgroundColor: selectedCategory === cat.id ? cat.color : undefined
                            }}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                      
                      {/* Strategy List */}
                      <div className="space-y-2">
                        {filteredStrategies.map(strategy => (
                          <StrategyCard
                            key={strategy.id}
                            strategy={strategy}
                            isSelected={isStrategySelectedForEmotion(strategy.id)}
                            isFavorite={favorites.includes(strategy.id)}
                            onToggle={() => toggleStrategyForEmotion(strategy.id, editingEmotion)}
                            onFavorite={toggleFavorite}
                            onSpeak={speak}
                          />
                        ))}
                      </div>
                      
                      {/* Add Custom Button */}
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="w-full py-4 border-3 border-dashed border-gray-300 rounded-xl
                                 font-display text-gray-500 hover:border-[#5CB85C] hover:text-[#5CB85C]
                                 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={20} />
                        Add My Own Strategy
                      </button>
                    </>
                  );
                })()}
              </>
            )}
          </div>
        )}

        {/* Attribution */}
        <div className="mt-6 text-center print:hidden">
          <a 
            href="https://arasaac.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Pictograms by ARASAAC (CC BY-NC-SA)
          </a>
        </div>
      </main>

      {/* Add Strategy Modal */}
      {showAddModal && (
        <AddStrategyModal
          onClose={() => setShowAddModal(false)}
          onSave={addCustomStrategy}
        />
      )}

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-[#5CB85C]">How to Use</h2>
              <button onClick={() => setShowInfo(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-3 font-crayon text-gray-600">
              <p>
                <strong>1. Build your chart:</strong> Tap "Edit My Chart" and pick a feeling.
              </p>
              <p>
                <strong>2. Choose strategies:</strong> Check the boxes next to strategies that help you when you feel that way.
              </p>
              <p>
                <strong>3. Add favorites:</strong> Tap the star ⭐ on your most helpful strategies.
              </p>
              <p>
                <strong>4. Make it yours:</strong> Add your own custom strategies with the "+" button.
              </p>
              <p>
                <strong>5. Print it:</strong> Print your chart to hang up at home or school!
              </p>
              <p className="text-sm text-gray-400 italic">
                Tip: You can assign the same strategy to multiple feelings!
              </p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full mt-4 py-3 bg-[#5CB85C] text-white rounded-xl font-display"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          header, button, .print\\:hidden {
            display: none !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CopingSkillsChart;
