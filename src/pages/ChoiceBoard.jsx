// FIXED: Changed header/button color from yellow (#F5A623) to dark goldenrod (#B8860B) for better visibility
// ChoiceBoard.jsx - COMPREHENSIVE FIX v3
// FIXED: Today/Tomorrow buttons now work properly
// FIXED: Schedule integration error handling
// FIXED: Added type="button" to prevent form submission issues

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
  History,
  AlertCircle,
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

// Storage keys
const STORAGE_KEY = 'snw_choice_boards';
const HISTORY_KEY = 'snw_choice_history';

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
      { emoji: '🎭', name: 'Pretend Play' },
      { emoji: '🤸', name: 'Gymnastics' },
    ],
  },
  food: {
    name: 'Food & Drinks',
    icons: [
      { emoji: '🍎', name: 'Apple' },
      { emoji: '🍌', name: 'Banana' },
      { emoji: '🥕', name: 'Carrots' },
      { emoji: '🍪', name: 'Cookie' },
      { emoji: '🥪', name: 'Sandwich' },
      { emoji: '🍕', name: 'Pizza' },
      { emoji: '🍿', name: 'Popcorn' },
      { emoji: '🥤', name: 'Juice' },
      { emoji: '💧', name: 'Water' },
      { emoji: '🥛', name: 'Milk' },
      { emoji: '🍦', name: 'Ice Cream' },
      { emoji: '🧁', name: 'Cupcake' },
    ],
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
      { emoji: '🎢', name: 'Playground' },
      { emoji: '🏊', name: 'Pool' },
      { emoji: '🎬', name: 'Movies' },
      { emoji: '🍽️', name: 'Restaurant' },
      { emoji: '🐕', name: 'Pet Store' },
      { emoji: '🎨', name: 'Art Class' },
    ],
  },
  feelings: {
    name: 'Feelings',
    icons: [
      { emoji: '😊', name: 'Happy' },
      { emoji: '😢', name: 'Sad' },
      { emoji: '😠', name: 'Angry' },
      { emoji: '😰', name: 'Worried' },
      { emoji: '🤗', name: 'Calm' },
      { emoji: '🤩', name: 'Excited' },
      { emoji: '😴', name: 'Tired' },
      { emoji: '🤔', name: 'Thinking' },
      { emoji: '😕', name: 'Confused' },
      { emoji: '🥰', name: 'Loved' },
      { emoji: '😤', name: 'Frustrated' },
      { emoji: '🥺', name: 'Worried' },
    ],
  },
};

// =====================================================
// ADD TO SCHEDULE MODAL - SIMPLIFIED
// Removed Today/Tomorrow buttons, pre-populates with today's date
// =====================================================
const AddToScheduleModal = ({ isOpen, onClose, option, onAdd }) => {
  // Get today's date in local timezone (not UTC)
  const getLocalToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getLocalToday());
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [enableReminder, setEnableReminder] = useState(true);

  // Reset form when modal opens - always start with today's date
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(getLocalToday());
      setSelectedTime('10:00');
      setEnableReminder(true);
    }
  }, [isOpen]);

  if (!isOpen || !option) return null;

  const handleAdd = () => {
    onAdd({
      option,
      date: selectedDate,
      time: selectedTime,
      reminder: enableReminder,
    });
  };

  const todayStr = getLocalToday();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#8E6BBF] text-white p-4 flex items-center gap-3">
          <CalendarPlus size={24} />
          <h3 className="font-display text-xl flex-1">Add to Schedule?</h3>
          <button 
            type="button"
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
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: option.color || '#F5A623' }}
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

          {/* Date Selection - Simplified with just date picker */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">📅 When?</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={todayStr}
              className="w-full p-3 border-2 border-gray-200 rounded-xl font-crayon text-lg focus:border-[#8E6BBF] outline-none"
            />
            <p className="text-xs text-gray-400 font-crayon mt-1">
              Pre-filled with today's date. Tap to change.
            </p>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">🕐 What time?</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl font-crayon text-lg focus:border-[#8E6BBF] outline-none"
            />
          </div>

          {/* Reminder Toggle */}
          <button
            type="button"
            onClick={() => setEnableReminder(!enableReminder)}
            className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all
                       ${enableReminder 
                         ? 'bg-[#5CB85C]/20 border-[#5CB85C]' 
                         : 'bg-gray-50 border-gray-200'}`}
          >
            <Clock size={20} className={enableReminder ? 'text-[#5CB85C]' : 'text-gray-400'} />
            <span className={`font-crayon ${enableReminder ? 'text-[#5CB85C]' : 'text-gray-500'}`}>
              {enableReminder ? '🔔 Remind me' : '🔕 No reminder'}
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-crayon text-gray-600 hover:bg-gray-100"
          >
            Not Now
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-3 bg-[#5CB85C] border-2 border-green-600 rounded-xl font-crayon text-white 
                     flex items-center justify-center gap-2 hover:bg-green-600"
          >
            <Check size={20} />
            Add!
          </button>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// CHOICE HISTORY MODAL
// =====================================================
const ChoiceHistoryModal = ({ isOpen, onClose, history, onClearHistory }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#B8860B] text-white p-4 flex items-center gap-3">
          <History size={24} />
          <h3 className="font-display text-xl flex-1">Choice History</h3>
          <button type="button" onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          {history.length === 0 ? (
            <div className="text-center py-8">
              <History size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="font-crayon text-gray-500">No choices made yet</p>
              <p className="font-crayon text-sm text-gray-400 mt-1">
                Your past choices will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: item.color || '#4A9FD4' }}
                  >
                    <span className="text-xl">{item.emoji || '⭐'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-crayon text-gray-800 truncate">{item.name}</p>
                    <p className="font-crayon text-xs text-gray-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {item.addedToSchedule && (
                    <Calendar size={16} className="text-[#8E6BBF]" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t">
          {history.length > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              className="w-full py-2 text-red-500 font-crayon text-sm hover:bg-red-50 rounded-lg"
            >
              Clear History
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 mt-2 bg-gray-200 rounded-xl font-crayon text-gray-600 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// ICON PICKER MODAL
// =====================================================
const IconPickerModal = ({ isOpen, onClose, currentEmoji, onSelectIcon, onSelectImage }) => {
  const [selectedCategory, setSelectedCategory] = useState('activities');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 200, 200, 0.8);
        onSelectImage(compressed);
      } catch (error) {
        console.error('Error compressing image:', error);
        // Fallback to original
        const reader = new FileReader();
        reader.onloadend = () => onSelectImage(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#B8860B] text-white p-4 flex items-center gap-3">
          <Star size={24} />
          <h3 className="font-display text-xl flex-1">Choose an Icon</h3>
          <button type="button" onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Photo Upload Option */}
        <div className="p-4 border-b">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 border-2 border-dashed border-[#B8860B] rounded-xl
                     font-crayon text-[#B8860B] hover:bg-[#B8860B]/10 flex items-center justify-center gap-2"
          >
            <Camera size={20} />
            Upload Photo
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b overflow-x-auto">
          {Object.entries(PRESET_ICONS).map(([key, cat]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 font-crayon text-sm whitespace-nowrap border-b-2 transition-all
                        ${selectedCategory === key 
                          ? 'border-[#B8860B] text-[#B8860B]' 
                          : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Icons Grid */}
        <div className="p-4 overflow-y-auto max-h-[40vh]">
          <div className="grid grid-cols-4 gap-2">
            {PRESET_ICONS[selectedCategory]?.icons.map((icon) => (
              <button
                key={icon.emoji}
                type="button"
                onClick={() => onSelectIcon(icon.emoji, icon.name)}
                className={`p-3 rounded-xl border-2 transition-all text-center
                          ${currentEmoji === icon.emoji 
                            ? 'border-[#B8860B] bg-[#B8860B]/10' 
                            : 'border-gray-200 hover:border-gray-300'}`}
              >
                <span className="text-2xl block">{icon.emoji}</span>
                <span className="text-xs font-crayon text-gray-500 mt-1 block truncate">
                  {icon.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// DELETE BOARD CONFIRMATION MODAL
// =====================================================
const DeleteBoardModal = ({ isOpen, onClose, boardName, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden">
        <div className="p-6 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="font-display text-xl text-gray-800 mb-2">Delete Board?</h3>
          <p className="font-crayon text-gray-600 mb-4">
            Are you sure you want to delete "{boardName}"? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-crayon text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 py-3 bg-red-500 border-2 border-red-600 rounded-xl font-crayon text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// BOARD EDITOR
// =====================================================
const BoardEditor = ({ board, onSave, onCancel }) => {
  const [name, setName] = useState(board?.name || '');
  const [options, setOptions] = useState(
    board?.options || [
      { id: Date.now(), name: '', emoji: '⭐', color: OPTION_COLORS[0], isAvailable: true },
      { id: Date.now() + 1, name: '', emoji: '⭐', color: OPTION_COLORS[1], isAvailable: true },
    ]
  );
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [editingOptionIndex, setEditingOptionIndex] = useState(null);

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([
        ...options,
        {
          id: Date.now(),
          name: '',
          emoji: '⭐',
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

  const handleSelectIcon = (emoji, iconName, index) => {
    const newOptions = [...options];
    newOptions[index] = { 
      ...newOptions[index], 
      emoji, 
      image: null,
      name: newOptions[index].name || iconName 
    };
    setOptions(newOptions);
    setIconPickerOpen(false);
    setEditingOptionIndex(null);
  };

  const handleImageUpload = (imageData, index) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], image: imageData, emoji: null };
    setOptions(newOptions);
    setIconPickerOpen(false);
    setEditingOptionIndex(null);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (options.some(o => !o.name.trim())) return;

    onSave({
      id: board?.id || Date.now(),
      name: name.trim(),
      options,
      createdAt: board?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#B8860B]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#B8860B] 
                       rounded-xl font-display font-bold text-[#B8860B] hover:bg-[#B8860B] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Cancel
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-display text-[#B8860B] crayon-text">
              {board ? 'Edit Board' : 'Create Board'}
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Board Name */}
        <div className="mb-6">
          <label className="block font-crayon text-gray-600 mb-2">Board Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Snack Choices, Weekend Activities"
            className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl font-crayon
                     focus:border-[#B8860B] focus:outline-none"
          />
        </div>

        {/* Options */}
        <div className="mb-6">
          <label className="block font-crayon text-gray-600 mb-2">
            Choices ({options.length}/6)
          </label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div
                key={option.id}
                className="bg-white rounded-xl border-3 p-4"
                style={{ borderColor: option.color }}
              >
                <div className="flex items-start gap-3">
                  {/* Icon/Image */}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingOptionIndex(index);
                      setIconPickerOpen(true);
                    }}
                    className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 
                             flex items-center justify-center hover:border-gray-400 transition-colors
                             overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: `${option.color}20` }}
                  >
                    {option.image ? (
                      <img src={option.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">{option.emoji || '⭐'}</span>
                    )}
                  </button>

                  {/* Option Details */}
                  <div className="flex-1 space-y-2">
                    {/* Name Input */}
                    <input
                      type="text"
                      value={option.name}
                      onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                      placeholder="Choice name..."
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg font-crayon
                               focus:border-[#B8860B] focus:outline-none"
                    />

                    {/* Availability Toggle */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOptionChange(index, 'isAvailable', !option.isAvailable)}
                        className={`px-3 py-1 rounded-full text-xs font-crayon flex items-center gap-1
                                  ${option.isAvailable 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'}`}
                      >
                        {option.isAvailable ? (
                          <>
                            <Check size={14} />
                            <span>Available</span>
                          </>
                        ) : (
                          <>
                            <Ban size={14} />
                            <span>Unavailable</span>
                          </>
                        )}
                      </button>
                      <span className="text-xs text-gray-400 font-crayon">
                        {option.isAvailable ? 'Can be chosen' : 'Cannot be chosen'}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      title="Remove this choice"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Option Button */}
          {options.length < 6 && (
            <button
              type="button"
              onClick={addOption}
              className="w-full mt-3 py-3 border-3 border-dashed border-gray-300 rounded-xl
                       font-crayon text-gray-500 hover:border-[#B8860B] hover:text-[#B8860B]
                       flex items-center justify-center gap-2 transition-all"
            >
              <Plus size={20} />
              Add Choice
            </button>
          )}
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!name.trim() || options.some(o => !o.name.trim())}
          className="w-full py-4 bg-[#5CB85C] border-4 border-green-600 rounded-xl
                   font-display text-xl text-white shadow-crayon
                   hover:scale-105 transition-transform
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Save Board
        </button>
      </main>

      {/* Icon Picker Modal */}
      <IconPickerModal
        isOpen={iconPickerOpen}
        onClose={() => {
          setIconPickerOpen(false);
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
// MAIN CHOICE BOARD COMPONENT
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
  const [choiceHistory, setChoiceHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

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
    
    // Load history
    const savedHistory = localStorage.getItem(`${HISTORY_KEY}_${user?.id}`);
    if (savedHistory) {
      try {
        setChoiceHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load choice history:', e);
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

  // Save history
  const saveHistory = useCallback(
    (newHistory) => {
      setChoiceHistory(newHistory);
      localStorage.setItem(`${HISTORY_KEY}_${user?.id}`, JSON.stringify(newHistory));
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

    // Add to history
    const historyItem = {
      name: option.name,
      emoji: option.emoji,
      color: option.color,
      timestamp: new Date().toISOString(),
      addedToSchedule: false,
    };
    saveHistory([historyItem, ...choiceHistory.slice(0, 49)]); // Keep last 50

    setTimeout(() => setShowConfetti(false), 2000);

    // Ask to add to schedule
    setSelectedOption(option);
    setShowAddToSchedule(true);
  };

  // FIXED: Add to Visual Schedule with proper error handling
  const handleAddToSchedule = ({ option, date, time, reminder }) => {
    try {
      const result = addActivityToSchedule({
        date: date,
        name: option.name,
        time: time,
        emoji: option.emoji || '⭐',
        color: option.color || SOURCE_COLORS?.[SCHEDULE_SOURCES?.CHOICE_BOARD] || '#F5A623',
        source: SCHEDULE_SOURCES?.CHOICE_BOARD || 'choice-board',
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
      
      if (result && result.success) {
        // Update history to show it was added to schedule
        const updatedHistory = choiceHistory.map((item, index) => 
          index === 0 ? { ...item, addedToSchedule: true } : item
        );
        saveHistory(updatedHistory);
        
        // Format the date for display
        const displayDate = new Date(date).toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        });
        
        toast.schedule(
          'Added to Schedule!',
          `"${option.name}" scheduled for ${displayDate} at ${time}`
        );
      } else {
        toast.error('Oops!', result?.error || 'Could not add to schedule. Please try again.');
      }
    } catch (error) {
      console.error('Error adding to schedule:', error);
      toast.error('Oops!', 'Something went wrong. Please try again.');
      setShowAddToSchedule(false);
      setSelectedOption(null);
    }
  };

  // Clear history
  const handleClearHistory = () => {
    saveHistory([]);
    toast.success('History Cleared', 'Your choice history has been cleared');
  };

  // If editing, show editor
  if (editingBoard !== null) {
    return (
      <BoardEditor
        board={editingBoard === 'new' ? null : editingBoard}
        onSave={handleSaveBoard}
        onCancel={() => setEditingBoard(null)}
      />
    );
  }

  // Board View Mode
  if (selectedBoard) {
    return (
      <div className="min-h-screen bg-[#FFFEF5] relative">
        {/* Confetti */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#E63B2E', '#F5A623', '#5CB85C', '#4A9FD4', '#8E6BBF', '#E86B9A'][i % 6],
                  animationDelay: `${Math.random() * 0.5}s`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '0',
                }}
              />
            ))}
          </div>
        )}

        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#B8860B]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedBoard(null)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#B8860B] 
                         rounded-xl font-display font-bold text-[#B8860B] hover:bg-[#B8860B] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-display text-[#B8860B] crayon-text">
                {selectedBoard.name}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setEditingBoard(selectedBoard)}
              className="p-2 text-gray-500 hover:text-[#B8860B] hover:bg-[#B8860B]/10 rounded-lg"
              title="Edit board"
            >
              <Edit3 size={20} />
            </button>
          </div>
        </header>

        {/* Options Grid */}
        <main className="max-w-2xl mx-auto px-4 py-6">
          <p className="text-center font-crayon text-gray-600 mb-6">
            Tap to make your choice! 🌟
          </p>

          <div className={`grid gap-4 ${selectedBoard.options.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {selectedBoard.options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectOption(option)}
                className={`relative aspect-square rounded-2xl border-4 shadow-crayon
                          transition-all duration-200 overflow-hidden
                          ${option.isAvailable 
                            ? 'hover:scale-105 hover:shadow-crayon-lg active:scale-95' 
                            : 'border-[#E63B2E]'}`}
                style={{ 
                  borderColor: option.isAvailable ? option.color : '#E63B2E',
                  backgroundColor: option.isAvailable ? `${option.color}20` : '#fee2e2'
                }}
              >
                {/* Option Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                  {option.image ? (
                    <img 
                      src={option.image} 
                      alt={option.name} 
                      className={`w-20 h-20 object-cover rounded-xl ${!option.isAvailable ? 'opacity-50' : ''}`}
                    />
                  ) : (
                    <span className={`text-5xl ${!option.isAvailable ? 'opacity-50' : ''}`}>
                      {option.emoji || '⭐'}
                    </span>
                  )}
                  <span className={`mt-2 font-crayon text-center text-sm ${!option.isAvailable ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {option.name}
                  </span>
                </div>

                {/* Unavailable Overlay */}
                {!option.isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                    <Ban size={32} className="text-[#E63B2E]" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Tip */}
          <div className="mt-8 p-4 bg-[#B8860B]/10 rounded-2xl border-3 border-[#B8860B]/30">
            <p className="font-crayon text-gray-600 text-center text-sm">
              💡 After choosing, you can add it to your Visual Schedule!
            </p>
          </div>
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
      </div>
    );
  }

  // Board List View
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#B8860B]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/activities')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#B8860B] 
                       rounded-xl font-display font-bold text-[#B8860B] hover:bg-[#B8860B] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#B8860B] crayon-text">
              ⭐ Choice Board
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setShowHistory(true)}
            className="p-2 text-gray-500 hover:text-[#B8860B] hover:bg-[#B8860B]/10 rounded-lg"
            title="View choice history"
          >
            <History size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-6">
          Create choice boards with pictures to help make decisions! 🌟
        </p>

        {/* Boards List */}
        {boards.length > 0 ? (
          <div className="space-y-3 mb-6">
            {boards.map((board) => (
              <div
                key={board.id}
                className="bg-white rounded-2xl border-3 border-gray-200 p-4 shadow-sm
                         hover:border-[#B8860B] hover:shadow-crayon transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Board Preview */}
                  <div className="flex -space-x-2">
                    {board.options.slice(0, 3).map((opt, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-lg border-2 border-white flex items-center justify-center"
                        style={{ backgroundColor: opt.color }}
                      >
                        {opt.image ? (
                          <img src={opt.image} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span className="text-lg">{opt.emoji || '⭐'}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Board Info */}
                  <div className="flex-1">
                    <h3 className="font-display text-gray-800">{board.name}</h3>
                    <p className="font-crayon text-xs text-gray-500">
                      {board.options.length} choices
                    </p>
                  </div>

                  {/* Actions */}
                  <button
                    type="button"
                    onClick={() => setSelectedBoard(board)}
                    className="px-4 py-2 bg-[#B8860B] text-white rounded-xl font-crayon text-sm
                             hover:bg-orange-500 transition-colors"
                  >
                    Use
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingBoard(board)}
                    className="p-2 text-gray-400 hover:text-[#B8860B]"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(board)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-6">
            <Grid3X3 size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-display text-xl text-gray-600 mb-2">No Boards Yet</h3>
            <p className="font-crayon text-gray-500">
              Create your first choice board to get started!
            </p>
          </div>
        )}

        {/* Create Board Button */}
        <button
          type="button"
          onClick={() => setEditingBoard('new')}
          className="w-full py-4 bg-[#B8860B] border-4 border-amber-700 rounded-xl
                   font-display text-xl text-white shadow-crayon
                   hover:scale-105 transition-transform flex items-center justify-center gap-2"
        >
          <Plus size={24} />
          Create New Board
        </button>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-[#8E6BBF]/10 rounded-2xl border-3 border-[#8E6BBF]/30">
          <div className="flex items-start gap-3">
            <Sparkles size={24} className="text-[#8E6BBF] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-display text-[#8E6BBF]">About Choice Boards</h3>
              <p className="font-crayon text-sm text-gray-600 mt-1">
                Choice boards help make decisions easier by showing options visually.
                Use photos or emojis, and mark items as unavailable when needed.
                After choosing, add it to your Visual Schedule!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteBoardModal
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        boardName={showDeleteConfirm?.name}
        onConfirm={() => handleDeleteBoard(showDeleteConfirm?.id)}
      />

      {/* Choice History Modal */}
      <ChoiceHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={choiceHistory}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
};

export default ChoiceBoard;
