// ChoiceBoard.jsx - Fixed version with themed toasts, red unavailable options, and PRESET ICONS
// Choice Board app for Special Needs World
// Features:
// - Create boards with 2-6 options (photos + text)
// - PRESET ICONS for common activities (NEW!)
// - Mark options as unavailable (shown in RED, not gray)
// - Confetti celebration on selection
// - Add choices to Visual Schedule

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
} from 'lucide-react';
import { useAuth } from '../App';
import { compressImage } from '../services/storage';
import { useToast, ConfirmModal } from '../components/ThemedToast';
import { 
  addActivityToSchedule, 
  SCHEDULE_SOURCES, 
  SOURCE_COLORS,
  formatDateDisplay,
  formatTimeDisplay 
} from '../services/scheduleHelper';

// Storage key
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
      { emoji: '🏛️', name: 'Library' },
      { emoji: '🎢', name: 'Park' },
      { emoji: '🍕', name: 'Restaurant' },
      { emoji: '🛒', name: 'Grocery Store' },
      { emoji: '⛪', name: 'Church' },
      { emoji: '🏖️', name: 'Beach' },
      { emoji: '🎬', name: 'Movies' },
      { emoji: '🍦', name: 'Ice Cream' },
    ]
  },
  food: {
    name: 'Food & Drinks',
    icons: [
      { emoji: '🍎', name: 'Apple' },
      { emoji: '🍌', name: 'Banana' },
      { emoji: '🥕', name: 'Carrot' },
      { emoji: '🥪', name: 'Sandwich' },
      { emoji: '🍕', name: 'Pizza' },
      { emoji: '🍔', name: 'Burger' },
      { emoji: '🌮', name: 'Taco' },
      { emoji: '🍝', name: 'Pasta' },
      { emoji: '🥣', name: 'Cereal' },
      { emoji: '🧃', name: 'Juice Box' },
      { emoji: '💧', name: 'Water' },
      { emoji: '🥛', name: 'Milk' },
    ]
  },
  routines: {
    name: 'Daily Routines',
    icons: [
      { emoji: '🌅', name: 'Wake Up' },
      { emoji: '🦷', name: 'Brush Teeth' },
      { emoji: '👕', name: 'Get Dressed' },
      { emoji: '🍳', name: 'Breakfast' },
      { emoji: '🚌', name: 'Bus/School' },
      { emoji: '✏️', name: 'Homework' },
      { emoji: '🛁', name: 'Bath Time' },
      { emoji: '📖', name: 'Story Time' },
      { emoji: '🌙', name: 'Bedtime' },
      { emoji: '💤', name: 'Sleep' },
      { emoji: '🧼', name: 'Wash Hands' },
      { emoji: '💊', name: 'Medicine' },
    ]
  },
  feelings: {
    name: 'Feelings',
    icons: [
      { emoji: '😊', name: 'Happy' },
      { emoji: '😢', name: 'Sad' },
      { emoji: '😠', name: 'Angry' },
      { emoji: '😰', name: 'Worried' },
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

// Confetti component
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
// Icon Picker Modal - NEW COMPONENT
// =====================================================
const IconPickerModal = ({ isOpen, onClose, onSelectIcon, onSelectImage, currentEmoji }) => {
  const [activeCategory, setActiveCategory] = useState('activities');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onSelectImage(file);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div 
        className="bg-[#FFFEF5] w-full max-w-md max-h-[85vh] rounded-2xl border-4 border-[#F5A623] shadow-crayon-lg flex flex-col"
        style={{ borderRadius: '30px 70px 30px 70px / 70px 30px 70px 30px' }}
      >
        {/* Header */}
        <div className="bg-[#F5A623] text-white p-4 flex items-center gap-3">
          <Grid3X3 size={24} />
          <h3 className="font-display text-xl flex-1">Choose Icon</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-1 p-2 bg-orange-50 border-b-2 border-orange-200">
          {Object.entries(PRESET_ICONS).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-3 py-1.5 rounded-full font-crayon text-xs whitespace-nowrap transition-all
                ${activeCategory === key 
                  ? 'bg-[#F5A623] text-white' 
                  : 'bg-white text-gray-600 hover:bg-orange-100'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Icon Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-4 gap-2">
            {PRESET_ICONS[activeCategory].icons.map((icon, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectIcon(icon.emoji, icon.name);
                  onClose();
                }}
                className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all
                  ${currentEmoji === icon.emoji 
                    ? 'border-[#F5A623] bg-orange-100' 
                    : 'border-gray-200 hover:border-[#F5A623] hover:bg-orange-50'
                  }`}
              >
                <span className="text-3xl mb-1">{icon.emoji}</span>
                <span className="font-crayon text-[10px] text-gray-500 text-center leading-tight">
                  {icon.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Image Option */}
        <div className="p-4 border-t-3 border-gray-200 bg-gray-50">
          <p className="font-crayon text-sm text-gray-500 mb-2 text-center">Or use your own image:</p>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-3 bg-white border-3 border-[#4A9FD4] rounded-xl font-crayon text-[#4A9FD4]
                       hover:bg-[#4A9FD4] hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Camera size={18} />
              Take Photo
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-3 bg-white border-3 border-[#8E6BBF] rounded-xl font-crayon text-[#8E6BBF]
                       hover:bg-[#8E6BBF] hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              Upload
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>
    </div>
  );
};

// Add to Schedule Modal
const AddToScheduleModal = ({ selectedOption, onClose, onAdd, toast }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [enableReminder, setEnableReminder] = useState(true);

  const handleAdd = () => {
    if (!selectedDate) {
      toast.warning('Missing Date', 'Please select a date');
      return;
    }

    onAdd({
      option: selectedOption,
      date: selectedDate,
      time: selectedTime,
      reminder: enableReminder,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-[#FFFEF5] w-full max-w-sm rounded-2xl border-4 border-[#5CB85C] shadow-crayon-lg overflow-hidden"
        style={{ borderRadius: '30px 70px 30px 70px / 70px 30px 70px 30px' }}
      >
        {/* Header */}
        <div className="bg-[#5CB85C] text-white p-4 flex items-center gap-3">
          <CalendarPlus size={24} />
          <h3 className="font-display text-xl flex-1">Add to Schedule</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Selected Option Preview */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: selectedOption.color }}
            >
              {selectedOption.image ? (
                <img
                  src={selectedOption.image}
                  alt={selectedOption.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">{selectedOption.emoji || '⭐'}</span>
              )}
            </div>
            <span className="font-crayon text-lg text-gray-700">
              {selectedOption.name}
            </span>
          </div>

          {/* Date Picker */}
          <div>
            <label className="font-crayon text-gray-600 text-sm mb-1 block">
              📅 Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl font-crayon
                       focus:border-[#5CB85C] focus:outline-none"
            />
          </div>

          {/* Time Picker */}
          <div>
            <label className="font-crayon text-gray-600 text-sm mb-1 block">
              🕐 Time
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl font-crayon
                       focus:border-[#5CB85C] focus:outline-none"
            />
          </div>

          {/* Reminder Toggle */}
          <button
            onClick={() => setEnableReminder(!enableReminder)}
            className={`w-full p-3 rounded-xl border-3 flex items-center gap-3 transition-all
                       ${
                         enableReminder
                           ? 'bg-purple-50 border-purple-400'
                           : 'bg-gray-50 border-gray-200'
                       }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center
                         ${enableReminder ? 'bg-purple-500' : 'bg-gray-300'}`}
            >
              {enableReminder && <Check size={14} className="text-white" />}
            </div>
            <span className="font-crayon text-gray-700">
              🔔 Send me a reminder
            </span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 pt-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-3 border-gray-300 rounded-xl font-crayon text-gray-600
                       hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 py-3 bg-[#5CB85C] border-3 border-green-600 rounded-xl font-crayon text-white
                       hover:bg-green-600 transition-all flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Board Modal - UPDATED with Icon Picker
const EditBoardModal = ({ board, onSave, onClose, toast }) => {
  const [name, setName] = useState(board?.name || '');
  const [options, setOptions] = useState(board?.options || []);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [editingOptionIndex, setEditingOptionIndex] = useState(null);

  const handleImageUpload = async (file, index) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid File', 'Please select an image file');
      return;
    }

    try {
      const compressed = await compressImage(file, 300, 0.8);
      setOptions((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], image: compressed, emoji: null };
        return updated;
      });
      toast.success('Image Added', 'Photo uploaded successfully!');
    } catch (err) {
      toast.error('Upload Failed', 'Could not process image');
    }
  };

  const handleSelectIcon = (emoji, name, index) => {
    setOptions((prev) => {
      const updated = [...prev];
      updated[index] = { 
        ...updated[index], 
        emoji: emoji, 
        image: null,
        // Optionally pre-fill name if empty
        name: updated[index].name || name
      };
      return updated;
    });
  };

  const addOption = () => {
    if (options.length >= 6) {
      toast.warning('Maximum Options', 'You can have up to 6 options');
      return;
    }
    setOptions((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: '',
        image: null,
        emoji: '⭐',
        color: OPTION_COLORS[prev.length % OPTION_COLORS.length],
        isAvailable: true,
      },
    ]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) {
      toast.warning('Minimum Options', 'Keep at least 2 options');
      return;
    }
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.warning('Missing Name', 'Please enter a name for this choice board');
      return;
    }
    if (options.length < 2) {
      toast.warning('Need More Options', 'Please add at least 2 options');
      return;
    }
    if (options.some((opt) => !opt.name.trim())) {
      toast.warning('Missing Names', 'Please name all your options');
      return;
    }
    onSave({
      ...board,
      id: board?.id || Date.now(),
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
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Board Name */}
          <div>
            <label className="font-crayon text-gray-600 text-sm mb-2 block">
              Board Name *
            </label>
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
              Options ({options.length}/6) - Tap icon to change
            </label>

            <div className="space-y-2">
              {options.map((option, index) => (
                <div
                  key={option.id || index}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border-3"
                  style={{ borderColor: option.color }}
                >
                  {/* Image/Emoji Preview - Click to open picker */}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingOptionIndex(index);
                      setShowIconPicker(true);
                    }}
                    className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 
                               overflow-hidden relative group cursor-pointer transition-all
                               hover:ring-2 hover:ring-[#F5A623] hover:ring-offset-2"
                    style={{ backgroundColor: `${option.color}20` }}
                  >
                    {option.image ? (
                      <img
                        src={option.image}
                        alt={option.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">{option.emoji}</span>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 
                                    flex items-center justify-center transition-colors">
                      <Grid3X3 size={16} className="text-white opacity-0 group-hover:opacity-100" />
                    </div>
                  </button>

                  {/* Name Input */}
                  <input
                    type="text"
                    value={option.name}
                    onChange={(e) => {
                      setOptions((prev) => {
                        const updated = [...prev];
                        updated[index] = { ...updated[index], name: e.target.value };
                        return updated;
                      });
                    }}
                    placeholder="Option name"
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg font-crayon
                             focus:border-[#F5A623] focus:outline-none"
                  />

                  {/* Remove Button */}
                  <button
                    onClick={() => removeOption(index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Option Button */}
            {options.length < 6 && (
              <button
                onClick={addOption}
                className="w-full mt-3 py-3 border-3 border-dashed border-gray-300 rounded-xl
                         font-crayon text-gray-500 hover:border-[#F5A623] hover:text-[#F5A623]
                         transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add Option
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t-3 border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-3 border-gray-300 rounded-xl font-crayon text-gray-600
                       hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-[#5CB85C] border-3 border-green-600 rounded-xl font-crayon text-white
                       hover:bg-green-600 transition-all flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Save
          </button>
        </div>
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

// Main ChoiceBoard Component
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
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + i * 0.15);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + i * 0.15 + 0.3
        );

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

  // Toggle option availability
  const toggleAvailability = (boardId, optionId) => {
    const newBoards = boards.map((board) => {
      if (board.id === boardId) {
        const newOptions = board.options.map((opt) => {
          if (opt.id === optionId) {
            const newAvailable = !opt.isAvailable;
            toast.info(
              newAvailable ? 'Option Available' : 'Option Unavailable',
              `"${opt.name}" is now ${newAvailable ? 'available' : 'unavailable'}`
            );
            return { ...opt, isAvailable: newAvailable };
          }
          return opt;
        });
        return { ...board, options: newOptions };
      }
      return board;
    });
    saveBoards(newBoards);
    setSelectedBoard(newBoards.find((b) => b.id === boardId));
  };

  // Handle option selection
  const handleSelectOption = (option) => {
    if (!option.isAvailable) {
      toast.error(
        'Not Available',
        `"${option.name}" is not available right now`
      );
      return;
    }

    // Show celebration
    setShowConfetti(true);
    playSound();

    toast.celebration(
      `Great Choice! 🎉`,
      `You picked "${option.name}"!`
    );

    setTimeout(() => setShowConfetti(false), 2000);

    // Ask to add to schedule
    setSelectedOption(option);
    setShowAddToSchedule(true);
  };

  // Add to Visual Schedule - Using unified helper
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

      // Close modal
      setShowAddToSchedule(false);
      setSelectedOption(null);
      
      if (result.success) {
        toast.schedule(
          'Added to Schedule! 📅',
          `${option.name} scheduled for ${formatDateDisplay(date)} at ${formatTimeDisplay(time)}`
        );
      } else {
        toast.error('Save Failed', result.error || 'Could not add to schedule. Please try again.');
      }
    } catch (e) {
      console.error('Failed to add to schedule:', e);
      toast.error('Save Failed', 'Could not add to schedule. Please try again.');
    }
  };

  // Render board list
  const renderBoardList = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-display text-[#F5A623] crayon-text">
          Your Choice Boards
        </h2>
        <p className="font-crayon text-gray-500">
          Tap a board to use it, or create a new one!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {boards.map((board) => (
          <div key={board.id} className="relative group">
            <button
              onClick={() => setSelectedBoard(board)}
              className="w-full bg-white rounded-2xl border-4 border-[#F5A623] p-4
                       hover:shadow-crayon-lg transition-all"
              style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}
            >
              {/* Preview icons */}
              <div className="flex justify-center gap-1 mb-2">
                {board.options.slice(0, 3).map((opt, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: opt.color }}
                  >
                    {opt.image ? (
                      <img
                        src={opt.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm">{opt.emoji}</span>
                    )}
                  </div>
                ))}
                {board.options.length > 3 && (
                  <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-crayon">+{board.options.length - 3}</span>
                  </div>
                )}
              </div>
              <span className="font-display text-gray-800 block truncate">
                {board.name}
              </span>
              <span className="font-crayon text-xs text-gray-400">
                {board.options.length} options
              </span>
            </button>

            {/* Edit/Delete buttons */}
            <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingBoard(board);
                }}
                className="w-8 h-8 bg-[#4A9FD4] rounded-full flex items-center justify-center shadow-lg
                         hover:bg-blue-600 transition-colors"
              >
                <Edit3 size={14} className="text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(board.id);
                }}
                className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg
                         hover:bg-red-600 transition-colors"
              >
                <Trash2 size={14} className="text-white" />
              </button>
            </div>
          </div>
        ))}

        {/* Create New Board Button */}
        <button
          onClick={() => setEditingBoard({})}
          className="bg-white rounded-2xl border-4 border-dashed border-gray-300 p-6
                     flex flex-col items-center justify-center gap-2
                     hover:border-[#F5A623] hover:bg-orange-50 transition-all"
          style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}
        >
          <Plus size={32} className="text-gray-400" />
          <span className="font-crayon text-gray-500">New Board</span>
        </button>
      </div>
    </div>
  );

  // Render selected board view with options
  const renderSelectedBoard = () => {
    if (!selectedBoard) return null;

    return (
      <div className="space-y-4">
        {/* Board Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedBoard(null)}
            className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#F5A623]
                       rounded-full font-crayon text-[#F5A623] hover:bg-[#F5A623] hover:text-white transition-all"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <h2 className="font-display text-xl text-[#F5A623]">
            {selectedBoard.name}
          </h2>
          <button
            onClick={() => setEditingBoard(selectedBoard)}
            className="p-2 bg-white border-3 border-gray-300 rounded-full hover:border-[#F5A623] transition-all"
          >
            <Edit3 size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Options Grid */}
        <div
          className={`grid gap-4 ${
            selectedBoard.options.length <= 2
              ? 'grid-cols-2'
              : selectedBoard.options.length <= 4
              ? 'grid-cols-2'
              : 'grid-cols-3'
          }`}
        >
          {selectedBoard.options.map((option) => (
            <div key={option.id} className="relative group">
              {/* Main Option Button */}
              <button
                onClick={() => handleSelectOption(option)}
                className={`
                  w-full aspect-square rounded-2xl border-4 p-3
                  flex flex-col items-center justify-center gap-2
                  transition-all transform
                  ${
                    option.isAvailable
                      ? 'bg-white hover:scale-105 hover:shadow-crayon-lg active:scale-95'
                      : 'choice-unavailable'
                  }
                `}
                style={{
                  borderColor: option.isAvailable ? option.color : '#E63B2E',
                  borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                }}
              >
                {/* Option Image/Emoji */}
                <div
                  className={`w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden ${
                    option.isAvailable ? '' : 'opacity-70'
                  }`}
                  style={{ backgroundColor: option.isAvailable ? option.color : 'rgba(230, 59, 46, 0.2)' }}
                >
                  {option.image ? (
                    <img
                      src={option.image}
                      alt={option.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl choice-emoji">{option.emoji || '⭐'}</span>
                  )}
                </div>

                {/* Option Name */}
                <span
                  className={`font-display text-lg text-center choice-text ${
                    option.isAvailable ? 'text-gray-800' : 'text-[#E63B2E] line-through'
                  }`}
                >
                  {option.name}
                </span>
              </button>

              {/* Availability Toggle Button */}
              <button
                onClick={() => toggleAvailability(selectedBoard.id, option.id)}
                className={`
                  absolute -top-2 -right-2 w-8 h-8 rounded-full
                  flex items-center justify-center shadow-lg transition-all
                  ${option.isAvailable 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-green-500 hover:bg-green-600'}
                `}
                title={option.isAvailable ? 'Mark unavailable' : 'Mark available'}
              >
                {option.isAvailable ? (
                  <Ban size={16} className="text-white" />
                ) : (
                  <Check size={16} className="text-white" />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Help Text */}
        <p className="text-center font-crayon text-gray-500 text-sm">
          Tap an option to choose! Use the corner buttons to mark items unavailable.
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

          <img
            src="/logo.jpeg"
            alt="Special Needs World"
            className="w-10 h-10 rounded-xl shadow-sm"
          />

          <h1 className="flex-1 text-xl font-display text-[#F5A623]">
            🎯 Choice Board
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {selectedBoard ? renderSelectedBoard() : renderBoardList()}
      </main>

      {/* Bottom Nav */}
      <nav className="sticky bottom-0 bg-white border-t-4 border-gray-200 safe-area-bottom">
        <div className="max-w-2xl mx-auto flex justify-around py-2">
          <button
            onClick={() => {
              setSelectedBoard(null);
            }}
            className="flex flex-col items-center p-2 text-gray-500 hover:text-[#F5A623]"
          >
            <ArrowLeft size={24} />
            <span className="text-xs font-crayon mt-0.5">Boards</span>
          </button>

          <button
            onClick={() => setEditingBoard({})}
            className="flex flex-col items-center p-2 text-[#F5A623]"
          >
            <Plus size={24} />
            <span className="text-xs font-crayon mt-0.5">New</span>
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
          toast={toast}
        />
      )}

      {/* Add to Schedule Modal */}
      {showAddToSchedule && selectedOption && (
        <AddToScheduleModal
          selectedOption={selectedOption}
          onClose={() => {
            setShowAddToSchedule(false);
            setSelectedOption(null);
          }}
          onAdd={handleAddToSchedule}
          toast={toast}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => handleDeleteBoard(showDeleteConfirm)}
        title="Delete Board?"
        message="This will permanently remove this choice board and all its options."
        confirmText="Delete"
        cancelText="Keep"
        type="error"
        icon={Trash2}
      />
    </div>
  );
};

export default ChoiceBoard;
