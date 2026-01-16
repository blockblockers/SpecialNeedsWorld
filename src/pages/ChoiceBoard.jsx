// ChoiceBoard.jsx - FIXED version
// Fixed: celebration toast, unavailable watermark, removed confusing buttons
// Features:
// - Create boards with 2-6 options
// - Unavailable items show diagonal "UNAVAILABLE" watermark (not strikethrough)
// - Confetti celebration on selection + prompt to add to schedule
// - Edit availability through edit screen only (no corner buttons in view mode)

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  X,
  Camera,
  Upload,
  Trash2,
  Edit3,
  Check,
  Calendar,
  Home,
  Ban,
  Sparkles,
  Clock,
  CalendarPlus,
  Star,
  Grid3X3,
  Volume2,
} from 'lucide-react';
import { useAuth } from '../App';
import { compressImage } from '../services/storage';
import { useToast, ConfirmModal } from '../components/ThemedToast';
import { 
  addActivityToSchedule, 
  SCHEDULE_SOURCES, 
  SOURCE_COLORS,
  getToday,
  getTomorrow,
  formatDateDisplay,
  formatTimeDisplay 
} from '../services/scheduleHelper';

// Storage key
const STORAGE_KEY = 'snw_choice_boards';

// Default colors for options
const OPTION_COLORS = [
  '#4A9FD4', // Blue
  '#5CB85C', // Green
  '#F5A623', // Orange
  '#8E6BBF', // Purple
  '#E86B9A', // Pink
  '#20B2AA', // Teal
];

// =====================================================
// PRESET ICONS for typical activities
// =====================================================
const PRESET_ICONS = {
  activities: {
    name: 'Activities',
    icons: [
      { emoji: '🎮', name: 'Video Games' },
      { emoji: '📺', name: 'TV/Movie' },
      { emoji: '🎨', name: 'Art/Drawing' },
      { emoji: '📚', name: 'Reading' },
      { emoji: '🎵', name: 'Music' },
      { emoji: '🧩', name: 'Puzzles' },
      { emoji: '🏃', name: 'Exercise' },
      { emoji: '🚴', name: 'Bike Ride' },
      { emoji: '⚽', name: 'Sports' },
      { emoji: '🎪', name: 'Play Outside' },
      { emoji: '🏊', name: 'Swimming' },
      { emoji: '🎭', name: 'Pretend Play' },
    ]
  },
  places: {
    name: 'Places',
    icons: [
      { emoji: '🏠', name: 'Home' },
      { emoji: '🏫', name: 'School' },
      { emoji: '🏪', name: 'Store' },
      { emoji: '🏥', name: 'Doctor' },
      { emoji: '🌳', name: 'Park' },
      { emoji: '📚', name: 'Library' },
      { emoji: '🍔', name: 'Restaurant' },
      { emoji: '🎢', name: 'Theme Park' },
      { emoji: '🏖️', name: 'Beach' },
      { emoji: '🎬', name: 'Movies' },
      { emoji: '🛒', name: 'Grocery' },
      { emoji: '👨‍👩‍👧', name: 'Grandparents' },
    ]
  },
  food: {
    name: 'Food',
    icons: [
      { emoji: '🍕', name: 'Pizza' },
      { emoji: '🍔', name: 'Burger' },
      { emoji: '🌮', name: 'Tacos' },
      { emoji: '🍝', name: 'Pasta' },
      { emoji: '🍎', name: 'Apple' },
      { emoji: '🥪', name: 'Sandwich' },
      { emoji: '🍦', name: 'Ice Cream' },
      { emoji: '🍪', name: 'Cookies' },
      { emoji: '🥤', name: 'Drink' },
      { emoji: '🍿', name: 'Popcorn' },
      { emoji: '🥗', name: 'Salad' },
      { emoji: '🍩', name: 'Donut' },
    ]
  },
  feelings: {
    name: 'Feelings',
    icons: [
      { emoji: '😊', name: 'Happy' },
      { emoji: '😢', name: 'Sad' },
      { emoji: '😠', name: 'Angry' },
      { emoji: '😨', name: 'Scared' },
      { emoji: '😴', name: 'Tired' },
      { emoji: '🤒', name: 'Sick' },
      { emoji: '😋', name: 'Hungry' },
      { emoji: '🥵', name: 'Hot' },
      { emoji: '🥶', name: 'Cold' },
      { emoji: '🤗', name: 'Loved' },
      { emoji: '😎', name: 'Cool' },
      { emoji: '🤔', name: 'Thinking' },
    ]
  },
  objects: {
    name: 'Objects',
    icons: [
      { emoji: '🧸', name: 'Teddy Bear' },
      { emoji: '🎈', name: 'Balloon' },
      { emoji: '🚗', name: 'Car' },
      { emoji: '🚂', name: 'Train' },
      { emoji: '✈️', name: 'Airplane' },
      { emoji: '📱', name: 'Phone/Tablet' },
      { emoji: '🎁', name: 'Present' },
      { emoji: '⭐', name: 'Star' },
      { emoji: '❤️', name: 'Heart' },
      { emoji: '🌈', name: 'Rainbow' },
      { emoji: '🌸', name: 'Flower' },
      { emoji: '🐕', name: 'Dog' },
    ]
  },
};

// =====================================================
// Confetti Component
// =====================================================
const Confetti = ({ isActive }) => {
  if (!isActive) return null;

  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.5}s`,
    duration: `${1 + Math.random() * 1}s`,
    color: OPTION_COLORS[Math.floor(Math.random() * OPTION_COLORS.length)],
    size: 8 + Math.random() * 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: piece.left,
            top: '-20px',
            animationDelay: piece.delay,
            animationDuration: piece.duration,
          }}
        >
          <div
            style={{
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

// =====================================================
// Add to Schedule Modal
// =====================================================
const AddToScheduleModal = ({ isOpen, onClose, option, onAdd }) => {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [enableReminder, setEnableReminder] = useState(true);

  if (!isOpen || !option) return null;

  const timeOptions = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const handleAdd = () => {
    onAdd({
      option,
      date: selectedDate,
      time: selectedTime,
      reminder: enableReminder,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#8E6BBF] text-white p-4 flex items-center gap-3">
          <CalendarPlus size={24} />
          <h3 className="font-display text-xl flex-1">Add to Schedule?</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Selected Option Preview */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: option.color }}
            >
              {option.image ? (
                <img src={option.image} alt={option.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="text-2xl">{option.emoji || '⭐'}</span>
              )}
            </div>
            <div>
              <p className="font-display text-gray-800">{option.name}</p>
              <p className="font-crayon text-sm text-gray-500">Your choice!</p>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">When?</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedDate(getToday())}
                className={`flex-1 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                          ${selectedDate === getToday() 
                            ? 'bg-[#8E6BBF]/20 border-[#8E6BBF] text-[#8E6BBF]' 
                            : 'bg-white border-gray-200 text-gray-600'}`}
              >
                Today
              </button>
              <button
                onClick={() => setSelectedDate(getTomorrow())}
                className={`flex-1 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                          ${selectedDate === getTomorrow() 
                            ? 'bg-[#8E6BBF]/20 border-[#8E6BBF] text-[#8E6BBF]' 
                            : 'bg-white border-gray-200 text-gray-600'}`}
              >
                Tomorrow
              </button>
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">What time?</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl font-crayon focus:border-[#8E6BBF] outline-none"
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>{formatTimeDisplay(time)}</option>
              ))}
            </select>
          </div>

          {/* Reminder Toggle */}
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={enableReminder}
              onChange={(e) => setEnableReminder(e.target.checked)}
              className="w-5 h-5 rounded text-[#8E6BBF]"
            />
            <span className="font-crayon text-gray-700">Remind me when it's time</span>
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-crayon text-gray-600
                       hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 py-3 bg-[#8E6BBF] text-white rounded-xl font-display
                       hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <CalendarPlus size={18} />
              Add to Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// Icon Picker Modal
// =====================================================
const IconPickerModal = ({ isOpen, onClose, onSelectIcon, onSelectImage, currentEmoji }) => {
  const [activeCategory, setActiveCategory] = useState('activities');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 200, 200);
        onSelectImage(compressed);
        onClose();
      } catch (error) {
        console.error('Failed to compress image:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#F5A623] text-white p-4 flex items-center justify-between">
          <h3 className="font-display text-lg">Choose an Icon</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto border-b">
          {Object.entries(PRESET_ICONS).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-2 font-crayon text-sm whitespace-nowrap border-b-2 transition-colors
                        ${activeCategory === key 
                          ? 'border-[#F5A623] text-[#F5A623]' 
                          : 'border-transparent text-gray-500'}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Icons Grid */}
        <div className="p-4 overflow-y-auto max-h-[300px]">
          <div className="grid grid-cols-4 gap-3">
            {PRESET_ICONS[activeCategory].icons.map((icon, index) => (
              <button
                key={index}
                onClick={() => {
                  onSelectIcon(icon.emoji, icon.name);
                  onClose();
                }}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 hover:scale-105 transition-all
                          ${currentEmoji === icon.emoji 
                            ? 'border-[#F5A623] bg-orange-50' 
                            : 'border-gray-200 hover:border-gray-300'}`}
              >
                <span className="text-2xl">{icon.emoji}</span>
                <span className="font-crayon text-xs text-gray-600 text-center leading-tight">{icon.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Custom Image */}
        <div className="p-4 border-t">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl
                     font-crayon text-gray-600 hover:border-[#F5A623] hover:text-[#F5A623] 
                     transition-colors flex items-center justify-center gap-2"
          >
            <Camera size={20} />
            Upload Custom Image
          </button>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// Board Editor Component
// =====================================================
const BoardEditor = ({ board, onSave, onCancel }) => {
  const [name, setName] = useState(board?.name || '');
  const [options, setOptions] = useState(
    board?.options || [
      { id: 1, name: '', emoji: '⭐', image: null, color: OPTION_COLORS[0], isAvailable: true },
      { id: 2, name: '', emoji: '⭐', image: null, color: OPTION_COLORS[1], isAvailable: true },
    ]
  );
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [editingOptionIndex, setEditingOptionIndex] = useState(null);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([
        ...options,
        {
          id: Date.now(),
          name: '',
          emoji: '⭐',
          image: null,
          color: OPTION_COLORS[options.length % OPTION_COLORS.length],
          isAvailable: true,
        },
      ]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const handleSelectIcon = (emoji, emojiName, index) => {
    const newOptions = [...options];
    newOptions[index] = { 
      ...newOptions[index], 
      emoji, 
      image: null,
      name: newOptions[index].name || emojiName 
    };
    setOptions(newOptions);
  };

  const handleImageUpload = (imageData, index) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], image: imageData, emoji: null };
    setOptions(newOptions);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (options.some(opt => !opt.name.trim())) return;

    onSave({
      id: board?.id || Date.now(),
      name: name.trim(),
      options,
      createdAt: board?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-4">
      {/* Board Name */}
      <div>
        <label className="block font-crayon text-gray-600 mb-2">Board Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., After School Activities"
          className="w-full px-4 py-3 rounded-xl border-3 border-gray-200 font-crayon
                   focus:border-[#F5A623] focus:outline-none transition-colors"
        />
      </div>

      {/* Options */}
      <div>
        <label className="block font-crayon text-gray-600 mb-2">
          Choices ({options.length}/6)
        </label>
        <div className="space-y-3">
          {options.map((option, index) => (
            <div 
              key={option.id} 
              className="flex items-center gap-3 p-3 bg-white rounded-xl border-3"
              style={{ borderColor: option.color }}
            >
              {/* Icon/Image Button */}
              <button
                onClick={() => {
                  setEditingOptionIndex(index);
                  setShowIconPicker(true);
                }}
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0
                         hover:opacity-80 transition-opacity"
                style={{ backgroundColor: option.color }}
              >
                {option.image ? (
                  <img src={option.image} alt="" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span className="text-2xl">{option.emoji}</span>
                )}
              </button>

              {/* Name Input */}
              <input
                type="text"
                value={option.name}
                onChange={(e) => updateOption(index, 'name', e.target.value)}
                placeholder={`Choice ${index + 1}`}
                className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 font-crayon
                         focus:border-[#F5A623] focus:outline-none"
              />

              {/* Availability Toggle */}
              <button
                onClick={() => updateOption(index, 'isAvailable', !option.isAvailable)}
                className={`p-2 rounded-lg transition-colors ${
                  option.isAvailable 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}
                title={option.isAvailable ? 'Available' : 'Unavailable'}
              >
                {option.isAvailable ? <Check size={20} /> : <Ban size={20} />}
              </button>

              {/* Remove Button */}
              {options.length > 2 && (
                <button
                  onClick={() => removeOption(index)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Option Button */}
        {options.length < 6 && (
          <button
            onClick={addOption}
            className="w-full mt-3 py-3 border-3 border-dashed border-gray-300 rounded-xl
                     font-crayon text-gray-500 hover:border-[#F5A623] hover:text-[#F5A623] transition-colors"
          >
            <Plus size={20} className="inline mr-2" />
            Add Choice
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 py-3 border-3 border-gray-300 rounded-xl font-crayon text-gray-600
                   hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!name.trim() || options.some(opt => !opt.name.trim())}
          className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl font-display
                   hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2"
        >
          <Check size={20} />
          Save Board
        </button>
      </div>

      {/* Icon Picker Modal */}
      <IconPickerModal
        isOpen={showIconPicker}
        onClose={() => {
          setShowIconPicker(false);
          setEditingOptionIndex(null);
        }}
        currentEmoji={editingOptionIndex !== null ? options[editingOptionIndex]?.emoji : null}
        onSelectIcon={(emoji, name) => {
          if (editingOptionIndex !== null) {
            handleSelectIcon(emoji, name, editingOptionIndex);
          }
        }}
        onSelectImage={(file) => {
          if (editingOptionIndex !== null) {
            handleImageUpload(file, editingOptionIndex);
          }
        }}
      />
    </div>
  );
};

// =====================================================
// Main ChoiceBoard Component
// =====================================================
const ChoiceBoard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  // State
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [editingBoard, setEditingBoard] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAddToSchedule, setShowAddToSchedule] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Load boards from storage
  useEffect(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_${user?.id}`);
    if (saved) {
      try {
        setBoards(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load choice boards:', e);
      }
    }
  }, [user?.id]);

  // Save boards to storage
  const saveBoards = useCallback(
    (newBoards) => {
      setBoards(newBoards);
      localStorage.setItem(`${STORAGE_KEY}_${user?.id}`, JSON.stringify(newBoards));
    },
    [user?.id]
  );

  // Play celebration sound
  const playSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.5];

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
      // Audio not supported
    }
  };

  // Handle save board
  const handleSaveBoard = (boardData) => {
    const existingIndex = boards.findIndex((b) => b.id === boardData.id);
    let newBoards;

    if (existingIndex >= 0) {
      newBoards = [...boards];
      newBoards[existingIndex] = boardData;
      toast.success('Board Updated', `"${boardData.name}" has been updated`);
    } else {
      newBoards = [...boards, boardData];
      toast.success('Board Created', `"${boardData.name}" is ready to use!`);
    }

    saveBoards(newBoards);
    setEditingBoard(null);
    setSelectedBoard(boardData);
  };

  // Handle delete board
  const handleDeleteBoard = (boardId) => {
    const board = boards.find((b) => b.id === boardId);
    const newBoards = boards.filter((b) => b.id !== boardId);
    saveBoards(newBoards);
    setShowDeleteConfirm(null);
    if (selectedBoard?.id === boardId) {
      setSelectedBoard(null);
    }
    toast.success('Board Deleted', `"${board?.name}" has been removed`);
  };

  // Handle option selection - WITH CELEBRATION
  const handleSelectOption = (option) => {
    if (!option.isAvailable) {
      toast.error('Not Available', `"${option.name}" is not available right now`);
      return;
    }

    // Show confetti celebration
    setShowConfetti(true);
    playSound();

    // Use celebration toast
    toast.celebration('Great Choice! 🎉', `You picked "${option.name}"!`);

    setTimeout(() => setShowConfetti(false), 2500);

    // Show add to schedule modal after a short delay
    setTimeout(() => {
      setSelectedOption(option);
      setShowAddToSchedule(true);
    }, 500);
  };

  // Add to Visual Schedule
  const handleAddToSchedule = ({ option, date, time, reminder }) => {
    try {
      const result = addActivityToSchedule({
        date: date,
        name: option.name,
        time: time,
        emoji: option.emoji || '⭐',
        color: option.color || SOURCE_COLORS[SCHEDULE_SOURCES.CHOICE_BOARD],
        source: SCHEDULE_SOURCES.CHOICE_BOARD,
        notify: reminder,
        customImage: option.image || null,
        metadata: { 
          fromChoiceBoard: true,
          optionId: option.id,
        },
      });

      setShowAddToSchedule(false);
      setSelectedOption(null);
      
      if (result.success) {
        toast.schedule('Added to Schedule!', `"${option.name}" is on your schedule for ${formatDateDisplay(date)}`);
      } else {
        toast.error('Could Not Add', result.error || 'Please try again');
      }
    } catch (error) {
      console.error('Error adding to schedule:', error);
      toast.error('Something Went Wrong', 'Please try again');
    }
  };

  // Render board view
  const renderBoardView = () => {
    if (!selectedBoard) return null;

    return (
      <div className="space-y-4">
        {/* Board Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedBoard(null)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h2 className="flex-1 text-xl font-display text-gray-800">{selectedBoard.name}</h2>
          <button
            onClick={() => setEditingBoard(selectedBoard)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Edit Board"
          >
            <Edit3 size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Options Grid - NO corner buttons in view mode */}
        <div className={`grid gap-4 ${
          selectedBoard.options.length <= 2
            ? 'grid-cols-2'
            : selectedBoard.options.length <= 4
            ? 'grid-cols-2'
            : 'grid-cols-3'
        }`}>
          {selectedBoard.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelectOption(option)}
              className={`
                relative w-full aspect-square rounded-2xl border-4 p-3
                flex flex-col items-center justify-center gap-2
                transition-all transform overflow-hidden
                ${option.isAvailable
                  ? 'bg-white hover:scale-105 hover:shadow-lg active:scale-95'
                  : 'bg-red-50'
                }
              `}
              style={{
                borderColor: option.isAvailable ? option.color : '#E63B2E',
              }}
            >
              {/* Diagonal UNAVAILABLE watermark */}
              {!option.isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                  <div 
                    className="absolute bg-red-500/20 text-red-600 font-display text-lg tracking-wider py-2 w-[200%]
                             transform -rotate-45 text-center"
                    style={{ letterSpacing: '0.2em' }}
                  >
                    UNAVAILABLE
                  </div>
                </div>
              )}

              {/* Option Image/Emoji */}
              <div
                className={`w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden ${
                  option.isAvailable ? '' : 'opacity-50'
                }`}
                style={{ backgroundColor: option.isAvailable ? option.color : '#FEE2E2' }}
              >
                {option.image ? (
                  <img src={option.image} alt={option.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">{option.emoji || '⭐'}</span>
                )}
              </div>

              {/* Option Name */}
              <span className={`font-display text-lg text-center ${
                option.isAvailable ? 'text-gray-800' : 'text-red-400'
              }`}>
                {option.name}
              </span>
            </button>
          ))}
        </div>

        {/* Help Text */}
        <p className="text-center font-crayon text-gray-500 text-sm">
          Tap an option to choose! Edit the board to change availability.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5] flex flex-col">
      {/* Confetti */}
      <Confetti isActive={showConfetti} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/activities')}
            className="flex items-center gap-1 px-3 py-2 bg-white border-3 border-[#F5A623]
                       rounded-full font-crayon text-[#F5A623] hover:bg-[#F5A623] hover:text-white transition-all"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-xl shadow-sm" />

          <h1 className="flex-1 text-xl font-display text-[#F5A623]">🎯 Choice Board</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {selectedBoard ? (
          editingBoard ? (
            <BoardEditor
              board={editingBoard}
              onSave={handleSaveBoard}
              onCancel={() => setEditingBoard(null)}
            />
          ) : (
            renderBoardView()
          )
        ) : editingBoard ? (
          <BoardEditor
            board={editingBoard}
            onSave={handleSaveBoard}
            onCancel={() => setEditingBoard(null)}
          />
        ) : (
          // Board List
          <div className="space-y-4">
            <p className="text-center font-crayon text-gray-600">
              Create choice boards to help make decisions easier!
            </p>

            {/* Create New Board Button */}
            <button
              onClick={() => setEditingBoard({})}
              className="w-full py-4 bg-gradient-to-r from-[#F5A623] to-[#E86B9A] text-white
                       rounded-2xl font-display text-lg hover:opacity-90 transition-opacity
                       flex items-center justify-center gap-2 shadow-lg"
            >
              <Plus size={24} />
              Create New Board
            </button>

            {/* Existing Boards */}
            {boards.length > 0 ? (
              <div className="grid gap-4">
                {boards.map((board) => (
                  <div
                    key={board.id}
                    className="bg-white rounded-2xl border-3 border-gray-200 overflow-hidden
                             hover:border-[#F5A623] transition-colors"
                  >
                    <button
                      onClick={() => setSelectedBoard(board)}
                      className="w-full p-4 flex items-center gap-4 text-left"
                    >
                      {/* Preview Icons */}
                      <div className="flex -space-x-2">
                        {board.options.slice(0, 3).map((opt, i) => (
                          <div
                            key={i}
                            className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white"
                            style={{ backgroundColor: opt.color }}
                          >
                            {opt.image ? (
                              <img src={opt.image} alt="" className="w-full h-full object-cover rounded-full" />
                            ) : (
                              <span className="text-lg">{opt.emoji}</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Board Info */}
                      <div className="flex-1">
                        <h3 className="font-display text-lg text-gray-800">{board.name}</h3>
                        <p className="font-crayon text-sm text-gray-500">
                          {board.options.length} choices
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingBoard(board);
                          }}
                          className="p-2 text-gray-400 hover:text-[#F5A623] hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(board.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Grid3X3 size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="font-crayon text-gray-500">
                  No boards yet. Create your first one!
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add to Schedule Modal */}
      <AddToScheduleModal
        isOpen={showAddToSchedule}
        onClose={() => {
          setShowAddToSchedule(false);
          setSelectedOption(null);
        }}
        option={selectedOption}
        onAdd={handleAddToSchedule}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => handleDeleteBoard(showDeleteConfirm)}
        title="Delete Board?"
        message="Are you sure you want to delete this board? This cannot be undone."
        confirmText="Delete"
        cancelText="Keep"
        type="error"
      />
    </div>
  );
};

export default ChoiceBoard;
