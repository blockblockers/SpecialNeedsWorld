// ChoiceBoard.jsx - Choice Selection App for ATLASassist
// Features:
// - Create choice boards with multiple options
// - Upload/take pictures for each option
// - Mark options as unavailable
// - Fun animations and sounds on selection
// - Integration with Visual Schedule

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Check, 
  Camera,
  Upload,
  Trash2,
  Edit3,
  Play,
  Calendar,
  Clock,
  Ban,
  Sparkles,
  Image,
  Save,
  ChevronRight,
  Star,
  Home,
  Volume2
} from 'lucide-react';
import { useAuth } from '../App';
import { compressImage } from '../services/storage';
import { 
  formatDate, 
  formatDisplayDate,
  getToday,
  addDays,
  saveScheduleToDate,
  getScheduleForDate
} from '../services/calendar';
import { scheduleActivityNotifications, getNotificationSettings, getPermissionStatus } from '../services/notifications';

const STORAGE_KEY = 'snw_choice_boards';

// Default colors for options
const OPTION_COLORS = [
  '#E63B2E', // Red
  '#4A9FD4', // Blue
  '#5CB85C', // Green
  '#F5A623', // Orange
  '#8E6BBF', // Purple
  '#E86B9A', // Pink
];

// Sound frequencies for selection
const playSelectionSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Play a happy ascending melody
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + i * 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.15 + 0.3);
      oscillator.start(audioContext.currentTime + i * 0.15);
      oscillator.stop(audioContext.currentTime + i * 0.15 + 0.3);
    });
  } catch (e) {
    console.log('Audio not available');
  }
};

// ============================================
// CONFETTI ANIMATION COMPONENT
// ============================================

const Confetti = ({ show }) => {
  if (!show) return null;
  
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random(),
    color: OPTION_COLORS[Math.floor(Math.random() * OPTION_COLORS.length)],
    size: 8 + Math.random() * 8,
    rotation: Math.random() * 360,
  }));
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${piece.rotation}deg)`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
};

// ============================================
// OPTION CARD COMPONENT (for selection view)
// ============================================

const OptionCard = ({ option, index, onSelect, isUnavailable, totalOptions }) => {
  const [isPressed, setIsPressed] = useState(false);
  
  // Calculate grid size based on total options
  const getSize = () => {
    if (totalOptions <= 2) return 'w-40 h-40 sm:w-48 sm:h-48';
    if (totalOptions <= 4) return 'w-32 h-32 sm:w-40 sm:h-40';
    return 'w-28 h-28 sm:w-32 sm:h-32';
  };
  
  return (
    <button
      onClick={() => !isUnavailable && onSelect(option)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={isUnavailable}
      className={`
        ${getSize()} rounded-2xl border-4 flex flex-col items-center justify-center
        transition-all duration-200 relative overflow-hidden
        ${isUnavailable 
          ? 'opacity-50 grayscale border-gray-300 cursor-not-allowed' 
          : `border-[${option.color}] hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl`}
        ${isPressed && !isUnavailable ? 'scale-95' : ''}
      `}
      style={{ 
        borderColor: isUnavailable ? '#ccc' : option.color,
        backgroundColor: isUnavailable ? '#f0f0f0' : `${option.color}15`
      }}
    >
      {/* Image or Emoji */}
      <div className="flex-1 flex items-center justify-center w-full p-2">
        {option.image ? (
          <img 
            src={option.image} 
            alt={option.name}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        ) : (
          <span className="text-4xl sm:text-5xl">{option.emoji || '⭐'}</span>
        )}
      </div>
      
      {/* Name */}
      <div 
        className="w-full py-2 px-2 text-center"
        style={{ backgroundColor: isUnavailable ? '#ccc' : option.color }}
      >
        <span className="font-display text-white text-sm sm:text-base truncate block">
          {option.name}
        </span>
      </div>
      
      {/* Unavailable overlay */}
      {isUnavailable && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-gray-800/70 rounded-full p-3">
            <Ban size={32} className="text-white" />
          </div>
          <div className="absolute bottom-12 left-0 right-0 text-center">
            <span className="bg-gray-800/70 text-white text-xs px-2 py-1 rounded font-crayon">
              Not available
            </span>
          </div>
        </div>
      )}
    </button>
  );
};

// ============================================
// CREATE/EDIT OPTION MODAL
// ============================================

const EditOptionModal = ({ option, onSave, onClose, colorIndex }) => {
  const [name, setName] = useState(option?.name || '');
  const [emoji, setEmoji] = useState(option?.emoji || '⭐');
  const [image, setImage] = useState(option?.image || null);
  const [isUnavailable, setIsUnavailable] = useState(option?.isUnavailable || false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const color = option?.color || OPTION_COLORS[colorIndex % OPTION_COLORS.length];
  
  const commonEmojis = ['⭐', '🎮', '📺', '🏖️', '🎢', '🛝', '🍕', '🍦', '🎬', '🎨', '📚', '🎵', '⚽', '🏀', '🚗', '✈️', '🏠', '🛒', '🎁', '🎈'];
  
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const compressed = await compressImage(file, 400, 400, 0.8);
      setImage(compressed);
    } catch (err) {
      console.error('Failed to process image:', err);
      alert('Failed to process image. Please try a different one.');
    }
    setIsUploading(false);
  };
  
  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a name for this option');
      return;
    }
    onSave({
      ...option,
      name: name.trim(),
      emoji,
      image,
      color,
      isUnavailable,
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFEF5] w-full max-w-md rounded-2xl border-4 shadow-crayon-lg max-h-[90vh] flex flex-col"
           style={{ borderColor: color }}>
        {/* Header */}
        <div className="text-white p-4 flex items-center justify-between" style={{ backgroundColor: color }}>
          <h3 className="font-display text-xl">
            {option?.id ? 'Edit Option' : 'Add Option'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Name Input */}
          <div>
            <label className="font-crayon text-gray-600 text-sm mb-2 block">Option Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Go to the park"
              className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl font-crayon text-lg
                       focus:outline-none transition-colors"
              style={{ borderColor: name ? color : undefined }}
              autoFocus
            />
          </div>
          
          {/* Image Upload */}
          <div>
            <label className="font-crayon text-gray-600 text-sm mb-2 block">Picture (optional)</label>
            
            {image ? (
              <div className="relative">
                <img 
                  src={image} 
                  alt="Option"
                  className="w-full h-40 object-contain bg-gray-100 rounded-xl border-3 border-gray-200"
                />
                <button
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex-1 py-4 border-3 border-dashed border-gray-300 rounded-xl
                           font-crayon text-gray-500 hover:border-gray-400 transition-colors
                           flex flex-col items-center gap-2"
                >
                  {isUploading ? (
                    <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Camera size={24} />
                      <span className="text-sm">Take or Upload Photo</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          
          {/* Emoji Selection (if no image) */}
          {!image && (
            <div>
              <label className="font-crayon text-gray-600 text-sm mb-2 block">Or choose an emoji</label>
              <div className="flex flex-wrap gap-2">
                {commonEmojis.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEmoji(e)}
                    className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center
                              transition-all ${emoji === e ? 'ring-2 ring-offset-2 scale-110' : 'hover:bg-gray-100'}`}
                    style={{ ringColor: color }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Unavailable Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Ban size={20} className={isUnavailable ? 'text-red-500' : 'text-gray-400'} />
              <div>
                <span className="font-crayon">Mark as unavailable</span>
                <p className="text-xs text-gray-500">Shows option as crossed out</p>
              </div>
            </div>
            <button
              onClick={() => setIsUnavailable(!isUnavailable)}
              className={`w-12 h-7 rounded-full transition-all relative ${
                isUnavailable ? 'bg-red-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-1 transition-all ${
                isUnavailable ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-3 border-gray-300 rounded-xl font-crayon text-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 text-white rounded-xl font-crayon flex items-center justify-center gap-2"
            style={{ backgroundColor: color }}
          >
            <Save size={18} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// CREATE/EDIT CHOICE BOARD MODAL
// ============================================

const EditBoardModal = ({ board, onSave, onClose }) => {
  const [name, setName] = useState(board?.name || '');
  const [options, setOptions] = useState(board?.options || []);
  const [editingOption, setEditingOption] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  
  const handleAddOption = () => {
    setEditingOption({});
    setEditingIndex(options.length);
  };
  
  const handleSaveOption = (optionData) => {
    const newOptions = [...options];
    if (editingIndex !== null && editingIndex < options.length) {
      newOptions[editingIndex] = { ...optionData, id: options[editingIndex].id };
    } else {
      newOptions.push({ ...optionData, id: Date.now() });
    }
    setOptions(newOptions);
    setEditingOption(null);
    setEditingIndex(null);
  };
  
  const handleDeleteOption = (index) => {
    if (!confirm('Delete this option?')) return;
    setOptions(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a name for this choice board');
      return;
    }
    if (options.length < 2) {
      alert('Please add at least 2 options');
      return;
    }
    onSave({
      ...board,
      name: name.trim(),
      options,
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFEF5] w-full max-w-lg rounded-2xl border-4 border-[#F5A623] shadow-crayon-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#F5A623] text-white p-4 flex items-center justify-between">
          <h3 className="font-display text-xl">
            {board?.id ? 'Edit Choice Board' : 'Create Choice Board'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Board Name */}
          <div>
            <label className="font-crayon text-gray-600 text-sm mb-2 block">Board Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Where to go today?"
              className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl font-crayon text-lg
                       focus:border-[#F5A623] focus:outline-none"
            />
          </div>
          
          {/* Options List */}
          <div>
            <label className="font-crayon text-gray-600 text-sm mb-2 block">
              Options ({options.length})
            </label>
            
            <div className="space-y-2">
              {options.map((option, index) => (
                <div 
                  key={option.id || index}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border-3"
                  style={{ borderColor: option.color }}
                >
                  {/* Preview */}
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${option.color}20` }}
                  >
                    {option.image ? (
                      <img src={option.image} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-2xl">{option.emoji || '⭐'}</span>
                    )}
                  </div>
                  
                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="font-display truncate">{option.name}</p>
                    {option.isUnavailable && (
                      <span className="text-xs text-red-500 font-crayon flex items-center gap-1">
                        <Ban size={10} /> Unavailable
                      </span>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <button
                    onClick={() => {
                      setEditingOption(option);
                      setEditingIndex(index);
                    }}
                    className="p-2 text-gray-400 hover:text-[#4A9FD4]"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteOption(index)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              
              {/* Add Option Button */}
              {options.length < 6 && (
                <button
                  onClick={handleAddOption}
                  className="w-full py-4 border-3 border-dashed border-gray-300 rounded-xl
                           font-crayon text-gray-500 hover:border-[#F5A623] hover:text-[#F5A623]
                           transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add Option ({6 - options.length} remaining)
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-3 border-gray-300 rounded-xl font-crayon text-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || options.length < 2}
            className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl font-crayon
                     disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Save Board
          </button>
        </div>
      </div>
      
      {/* Edit Option Sub-Modal */}
      {editingOption !== null && (
        <EditOptionModal
          option={editingOption}
          colorIndex={editingIndex}
          onSave={handleSaveOption}
          onClose={() => {
            setEditingOption(null);
            setEditingIndex(null);
          }}
        />
      )}
    </div>
  );
};

// ============================================
// ADD TO SCHEDULE MODAL
// ============================================

const AddToScheduleModal = ({ selectedOption, onClose, onAdd }) => {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [time, setTime] = useState('');
  const [notify, setNotify] = useState(true);
  const [customName, setCustomName] = useState(selectedOption.name);
  
  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(getToday(), i);
    return {
      date,
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };
  });
  
  const handleAdd = () => {
    if (!time) {
      alert('Please select a time');
      return;
    }
    onAdd({
      name: customName,
      emoji: selectedOption.emoji,
      image: selectedOption.image,
      color: selectedOption.color,
      date: selectedDate,
      time,
      notify,
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFEF5] w-full max-w-md rounded-2xl border-4 border-[#4A9FD4] shadow-crayon-lg">
        {/* Header */}
        <div className="bg-[#4A9FD4] text-white p-4 flex items-center justify-between">
          <h3 className="font-display text-xl flex items-center gap-2">
            <Calendar size={24} />
            Add to Schedule
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Selected Choice Preview */}
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: `${selectedOption.color}20` }}>
            <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-white">
              {selectedOption.image ? (
                <img src={selectedOption.image} alt="" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-3xl">{selectedOption.emoji || '⭐'}</span>
              )}
            </div>
            <div>
              <p className="font-display text-lg">{selectedOption.name}</p>
              <p className="font-crayon text-sm text-gray-500">Selected choice</p>
            </div>
          </div>
          
          {/* Custom Name */}
          <div>
            <label className="font-crayon text-gray-600 text-sm mb-2 block">Activity Name</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl font-crayon
                       focus:border-[#4A9FD4] focus:outline-none"
            />
          </div>
          
          {/* Date Selection */}
          <div>
            <label className="font-crayon text-gray-600 text-sm mb-2 block">Date</label>
            <div className="grid grid-cols-4 gap-2">
              {dates.slice(0, 4).map(({ date, label }) => (
                <button
                  key={label}
                  onClick={() => setSelectedDate(date)}
                  className={`py-2 px-1 rounded-lg font-crayon text-xs border-2 ${
                    formatDate(selectedDate) === formatDate(date)
                      ? 'bg-[#4A9FD4] text-white border-[#4A9FD4]'
                      : 'border-gray-200 hover:border-[#4A9FD4]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Time Selection */}
          <div>
            <label className="font-crayon text-gray-600 text-sm mb-2 block">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl font-crayon text-lg
                       focus:border-[#4A9FD4] focus:outline-none"
            />
          </div>
          
          {/* Notification Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Clock size={20} className={notify ? 'text-[#F5A623]' : 'text-gray-400'} />
              <span className="font-crayon">Send reminder notification</span>
            </div>
            <button
              onClick={() => setNotify(!notify)}
              className={`w-12 h-7 rounded-full transition-all relative ${
                notify ? 'bg-[#F5A623]' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-1 transition-all ${
                notify ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-3 border-gray-300 rounded-xl font-crayon text-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!time}
            className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl font-crayon
                     disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Calendar size={18} />
            Add to Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// CHOICE SELECTION VIEW
// ============================================

const ChoiceSelectionView = ({ board, onSelect, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFEF5] to-[#FFF8E1] flex flex-col">
      {/* Header */}
      <div className="p-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white border-3 border-gray-300 
                   rounded-xl font-crayon text-gray-600 hover:border-gray-400 transition-all"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>
      
      {/* Title */}
      <div className="text-center px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-display text-[#4A9FD4] crayon-text">
          {board.name}
        </h1>
        <p className="font-crayon text-gray-500 mt-2">Tap to choose!</p>
      </div>
      
      {/* Options Grid */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className={`
          grid gap-4 sm:gap-6
          ${board.options.length <= 2 ? 'grid-cols-2' : ''}
          ${board.options.length === 3 ? 'grid-cols-3' : ''}
          ${board.options.length === 4 ? 'grid-cols-2' : ''}
          ${board.options.length >= 5 ? 'grid-cols-3' : ''}
        `}>
          {board.options.map((option, index) => (
            <OptionCard
              key={option.id}
              option={option}
              index={index}
              totalOptions={board.options.length}
              isUnavailable={option.isUnavailable}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SELECTION RESULT VIEW
// ============================================

const SelectionResultView = ({ selectedOption, onAddToSchedule, onChooseAgain, onDone }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  
  useEffect(() => {
    playSelectionSound();
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFEF5] to-[#FFF8E1] flex flex-col items-center justify-center p-4">
      <Confetti show={showConfetti} />
      
      {/* Celebration */}
      <div className="text-center mb-8">
        <Sparkles className="w-16 h-16 text-[#F5A623] mx-auto animate-bounce" />
        <h1 className="text-3xl sm:text-4xl font-display text-[#5CB85C] mt-4">
          Great Choice!
        </h1>
      </div>
      
      {/* Selected Option */}
      <div 
        className="w-48 h-48 sm:w-64 sm:h-64 rounded-3xl border-6 flex flex-col items-center justify-center
                  shadow-2xl animate-pulse-slow"
        style={{ 
          borderColor: selectedOption.color,
          backgroundColor: `${selectedOption.color}20`
        }}
      >
        <div className="flex-1 flex items-center justify-center w-full p-4">
          {selectedOption.image ? (
            <img 
              src={selectedOption.image} 
              alt={selectedOption.name}
              className="max-w-full max-h-full object-contain rounded-xl"
            />
          ) : (
            <span className="text-6xl sm:text-8xl">{selectedOption.emoji || '⭐'}</span>
          )}
        </div>
        <div 
          className="w-full py-3 text-center rounded-b-2xl"
          style={{ backgroundColor: selectedOption.color }}
        >
          <span className="font-display text-white text-xl sm:text-2xl">
            {selectedOption.name}
          </span>
        </div>
      </div>
      
      {/* Actions */}
      <div className="mt-8 space-y-3 w-full max-w-xs">
        <button
          onClick={onAddToSchedule}
          className="w-full py-4 bg-[#4A9FD4] text-white rounded-xl font-display text-lg
                   flex items-center justify-center gap-2 shadow-lg hover:bg-[#3A8FC4] transition-all"
        >
          <Calendar size={24} />
          Add to Schedule
        </button>
        
        <button
          onClick={onChooseAgain}
          className="w-full py-3 bg-white border-3 border-gray-300 rounded-xl font-crayon
                   text-gray-600 hover:border-gray-400 transition-all"
        >
          Choose Again
        </button>
        
        <button
          onClick={onDone}
          className="w-full py-3 text-gray-500 font-crayon hover:text-gray-700"
        >
          Done
        </button>
      </div>
      
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const ChoiceBoard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State
  const [boards, setBoards] = useState([]);
  const [editingBoard, setEditingBoard] = useState(null);
  const [activeBoard, setActiveBoard] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAddToSchedule, setShowAddToSchedule] = useState(false);
  
  // Load boards
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBoards(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load choice boards:', e);
      }
    }
  }, []);
  
  // Save boards
  const saveBoards = (newBoards) => {
    setBoards(newBoards);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBoards));
  };
  
  // Save board
  const handleSaveBoard = (boardData) => {
    if (boardData.id) {
      // Update existing
      saveBoards(boards.map(b => b.id === boardData.id ? boardData : b));
    } else {
      // Create new
      saveBoards([...boards, { ...boardData, id: Date.now() }]);
    }
    setEditingBoard(null);
  };
  
  // Delete board
  const handleDeleteBoard = (boardId) => {
    if (!confirm('Delete this choice board?')) return;
    saveBoards(boards.filter(b => b.id !== boardId));
  };
  
  // Handle option selection
  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };
  
  // Add to schedule
  const handleAddToSchedule = async (scheduleData) => {
    const dateStr = formatDate(scheduleData.date);
    
    // Get existing schedule for that date
    const existingSchedule = getScheduleForDate(dateStr);
    const activities = existingSchedule?.activities || [];
    
    // Create new activity from choice
    const newActivity = {
      id: Date.now(),
      activityId: 'custom-choice',
      name: scheduleData.name,
      customImage: scheduleData.image,
      emoji: scheduleData.emoji,
      color: scheduleData.color,
      time: scheduleData.time,
      notify: scheduleData.notify,
      completed: false,
      fromChoiceBoard: true,
    };
    
    // Add and sort by time
    const newActivities = [...activities, newActivity].sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
    
    // Save to calendar
    saveScheduleToDate(dateStr, {
      id: existingSchedule?.id || Date.now(),
      name: existingSchedule?.name || `Schedule for ${formatDisplayDate(scheduleData.date)}`,
      activities: newActivities,
      date: dateStr,
      updatedAt: new Date().toISOString(),
    });
    
    // Schedule notification if enabled
    if (scheduleData.notify) {
      const settings = getNotificationSettings();
      if (settings.globalEnabled && getPermissionStatus() === 'granted') {
        scheduleActivityNotifications(dateStr, newActivities, { repeatUntilComplete: true });
      }
    }
    
    setShowAddToSchedule(false);
    setSelectedOption(null);
    setActiveBoard(null);
    
    alert(`Added "${scheduleData.name}" to ${formatDisplayDate(scheduleData.date)} at ${scheduleData.time}!`);
  };
  
  // Render selection result view
  if (selectedOption && !showAddToSchedule) {
    return (
      <SelectionResultView
        selectedOption={selectedOption}
        onAddToSchedule={() => setShowAddToSchedule(true)}
        onChooseAgain={() => setSelectedOption(null)}
        onDone={() => {
          setSelectedOption(null);
          setActiveBoard(null);
        }}
      />
    );
  }
  
  // Render active board selection view
  if (activeBoard && !selectedOption) {
    return (
      <ChoiceSelectionView
        board={activeBoard}
        onSelect={handleSelectOption}
        onBack={() => setActiveBoard(null)}
      />
    );
  }
  
  // Render main board list
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/activities')}
            className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#F5A623] 
                     rounded-xl font-display text-[#F5A623] hover:bg-[#F5A623] 
                     hover:text-white transition-all text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-display text-[#F5A623] flex items-center gap-2">
              <Star size={20} />
              Choice Board
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Description */}
        <div className="text-center mb-6">
          <p className="font-crayon text-gray-600">
            Create choice boards to help make decisions!
          </p>
        </div>
        
        {/* Boards List */}
        {boards.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border-3 border-dashed border-gray-200">
            <Star className="w-16 h-16 text-[#F5A623] mx-auto mb-4" />
            <p className="font-display text-gray-600 mb-2">No choice boards yet</p>
            <p className="font-crayon text-gray-400 text-sm mb-4">
              Create your first choice board!
            </p>
            <button
              onClick={() => setEditingBoard({})}
              className="px-6 py-3 bg-[#F5A623] text-white rounded-xl font-display
                       flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Create Choice Board
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {boards.map((board) => (
              <div 
                key={board.id}
                className="bg-white rounded-xl border-3 border-gray-200 overflow-hidden"
              >
                <div className="p-4 flex items-center gap-4">
                  {/* Preview of options */}
                  <div className="flex -space-x-2">
                    {board.options.slice(0, 3).map((opt, i) => (
                      <div 
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center"
                        style={{ backgroundColor: opt.color }}
                      >
                        {opt.image ? (
                          <img src={opt.image} alt="" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <span className="text-lg">{opt.emoji || '⭐'}</span>
                        )}
                      </div>
                    ))}
                    {board.options.length > 3 && (
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">+{board.options.length - 3}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Board Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-gray-800 truncate">{board.name}</h3>
                    <p className="font-crayon text-sm text-gray-500">
                      {board.options.length} options
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <button
                    onClick={() => setEditingBoard(board)}
                    className="p-2 text-gray-400 hover:text-[#4A9FD4]"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteBoard(board.id)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                {/* Play Button */}
                <button
                  onClick={() => setActiveBoard(board)}
                  className="w-full py-3 bg-[#5CB85C] text-white font-display flex items-center justify-center gap-2
                           hover:bg-[#4CAF50] transition-all"
                >
                  <Play size={20} />
                  Start Choosing
                </button>
              </div>
            ))}
            
            {/* Add New Board Button */}
            <button
              onClick={() => setEditingBoard({})}
              className="w-full py-4 border-3 border-dashed border-gray-300 rounded-xl
                       font-crayon text-gray-500 hover:border-[#F5A623] hover:text-[#F5A623]
                       transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Create New Choice Board
            </button>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 bg-white border-t-4 border-[#F5A623] px-4 py-2 safe-area-bottom">
        <div className="max-w-2xl mx-auto flex justify-around">
          <button
            onClick={() => navigate('/activities')}
            className="flex flex-col items-center p-2 text-gray-500 hover:text-[#F5A623]"
          >
            <ArrowLeft size={24} />
            <span className="text-xs font-crayon mt-0.5">Activities</span>
          </button>
          
          <button
            onClick={() => setEditingBoard({})}
            className="flex flex-col items-center p-2 text-[#F5A623]"
          >
            <Plus size={24} />
            <span className="text-xs font-crayon mt-0.5">New Board</span>
          </button>
          
          <button
            onClick={() => navigate('/hub')}
            className="flex flex-col items-center p-2 text-gray-500 hover:text-[#4A9FD4]"
          >
            <Home size={24} />
            <span className="text-xs font-crayon mt-0.5">Home</span>
          </button>
        </div>
      </nav>

      {/* Edit Board Modal */}
      {editingBoard !== null && (
        <EditBoardModal
          board={editingBoard}
          onSave={handleSaveBoard}
          onClose={() => setEditingBoard(null)}
        />
      )}
      
      {/* Add to Schedule Modal */}
      {showAddToSchedule && selectedOption && (
        <AddToScheduleModal
          selectedOption={selectedOption}
          onClose={() => setShowAddToSchedule(false)}
          onAdd={handleAddToSchedule}
        />
      )}
    </div>
  );
};

export default ChoiceBoard;
