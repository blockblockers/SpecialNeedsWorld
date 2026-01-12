// VisualSchedule.jsx - Visual Schedule Builder for Special Needs World
// A visual scheduling tool using icons/pictures to help with daily routines
// Features:
// - Pre-built schedule templates
// - Drag-and-drop schedule builder
// - Icon library with common activities
// - Custom image upload support
// - Completed task tracking
// - Calendar integration with recurring schedules
// - Push notifications with repeat until complete

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Check, 
  X, 
  GripVertical,
  Sun,
  Moon,
  Utensils,
  Bath,
  BookOpen,
  Tv,
  Car,
  School,
  Bed,
  Shirt,
  Apple,
  Coffee,
  Music,
  Palette,
  Users,
  Home,
  ShoppingBag,
  Pill,
  Clock,
  Trash2,
  Edit3,
  Save,
  RotateCcw,
  Image,
  Sparkles,
  Star,
  Camera,
  Upload,
  Calendar,
  Bell
} from 'lucide-react';
import { useAuth } from '../App';
import { imageStorage, compressImage } from '../services/storage';
import ScheduleCalendarWrapper from '../components/ScheduleCalendarWrapper';
import ActivityIconEditor from '../components/ActivityIconEditor';
import { formatTime, formatDate, getToday } from '../services/calendar';
import { markActivityComplete } from '../services/notifications';

// Pre-defined activity icons with their metadata
const activityIcons = [
  { id: 'wake-up', name: 'Wake Up', icon: Sun, color: '#FCE94F', category: 'morning' },
  { id: 'breakfast', name: 'Breakfast', icon: Coffee, color: '#F37736', category: 'meals' },
  { id: 'lunch', name: 'Lunch', icon: Utensils, color: '#7BC043', category: 'meals' },
  { id: 'dinner', name: 'Dinner', icon: Utensils, color: '#0392CF', category: 'meals' },
  { id: 'snack', name: 'Snack', icon: Apple, color: '#EE4035', category: 'meals' },
  { id: 'get-dressed', name: 'Get Dressed', icon: Shirt, color: '#9B59B6', category: 'self-care' },
  { id: 'brush-teeth', name: 'Brush Teeth', icon: Sparkles, color: '#0392CF', category: 'self-care' },
  { id: 'bath', name: 'Bath/Shower', icon: Bath, color: '#0392CF', category: 'self-care' },
  { id: 'medicine', name: 'Medicine', icon: Pill, color: '#E91E8C', category: 'health' },
  { id: 'school', name: 'School', icon: School, color: '#F37736', category: 'activities' },
  { id: 'homework', name: 'Homework', icon: BookOpen, color: '#9B59B6', category: 'activities' },
  { id: 'reading', name: 'Reading', icon: BookOpen, color: '#7BC043', category: 'activities' },
  { id: 'tv-time', name: 'TV Time', icon: Tv, color: '#0392CF', category: 'leisure' },
  { id: 'play-time', name: 'Play Time', icon: Star, color: '#FCE94F', category: 'leisure' },
  { id: 'music', name: 'Music', icon: Music, color: '#E91E8C', category: 'leisure' },
  { id: 'art', name: 'Art/Craft', icon: Palette, color: '#9B59B6', category: 'leisure' },
  { id: 'car-ride', name: 'Car Ride', icon: Car, color: '#8B4513', category: 'travel' },
  { id: 'go-home', name: 'Go Home', icon: Home, color: '#7BC043', category: 'travel' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: '#E91E8C', category: 'activities' },
  { id: 'family-time', name: 'Family Time', icon: Users, color: '#EE4035', category: 'social' },
  { id: 'bedtime', name: 'Bedtime', icon: Moon, color: '#9B59B6', category: 'evening' },
  { id: 'sleep', name: 'Sleep', icon: Bed, color: '#0392CF', category: 'evening' },
];

// Schedule templates
const scheduleTemplates = [
  {
    id: 'school-day',
    name: 'School Day',
    emoji: '🏫',
    description: 'A typical school day schedule',
    items: ['wake-up', 'get-dressed', 'breakfast', 'brush-teeth', 'school', 'lunch', 'school', 'go-home', 'snack', 'homework', 'play-time', 'dinner', 'bath', 'bedtime'],
  },
  {
    id: 'weekend',
    name: 'Weekend',
    emoji: '🎉',
    description: 'A relaxed weekend schedule',
    items: ['wake-up', 'breakfast', 'get-dressed', 'play-time', 'snack', 'lunch', 'art', 'tv-time', 'snack', 'family-time', 'dinner', 'bath', 'bedtime'],
  },
  {
    id: 'morning-routine',
    name: 'Morning Routine',
    emoji: '🌅',
    description: 'Focus on morning activities',
    items: ['wake-up', 'get-dressed', 'brush-teeth', 'breakfast', 'medicine'],
  },
  {
    id: 'bedtime-routine',
    name: 'Bedtime Routine',
    emoji: '🌙',
    description: 'Wind down for sleep',
    items: ['bath', 'get-dressed', 'brush-teeth', 'reading', 'bedtime', 'sleep'],
  },
  {
    id: 'blank',
    name: 'Start Fresh',
    emoji: '✨',
    description: 'Create your own schedule',
    items: [],
  },
];

const VisualSchedule = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  
  // State
  const [currentView, setCurrentView] = useState('templates'); // templates, builder
  const [scheduleItems, setScheduleItems] = useState([]);
  const [scheduleName, setScheduleName] = useState('My Schedule');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [customImages, setCustomImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showCustomImageModal, setShowCustomImageModal] = useState(false);
  const [newImageName, setNewImageName] = useState('');
  const [newImageData, setNewImageData] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null); // For custom icon editor
  const [currentDateStr, setCurrentDateStr] = useState(formatDate(getToday())); // Track current date for notifications

  // Load saved schedule and custom images from storage
  useEffect(() => {
    const loadData = async () => {
      // Load schedule from localStorage
      const savedSchedule = localStorage.getItem(`snw_schedule_${user?.id}`);
      if (savedSchedule) {
        try {
          const { name, items } = JSON.parse(savedSchedule);
          setScheduleName(name);
          setScheduleItems(items);
          setCurrentView('builder');
        } catch (e) {
          console.error('Failed to load saved schedule');
        }
      }
      
      // Load custom images from IndexedDB
      if (user?.id) {
        try {
          const images = await imageStorage.getUserImages(user.id);
          setCustomImages(images);
        } catch (e) {
          console.error('Failed to load custom images:', e);
        }
      }
    };
    
    loadData();
  }, [user?.id]);

  // Save schedule to localStorage
  const saveSchedule = () => {
    localStorage.setItem(`snw_schedule_${user?.id}`, JSON.stringify({
      name: scheduleName,
      items: scheduleItems,
    }));
  };

  // Select a template
  const selectTemplate = (template) => {
    const items = template.items.map((iconId, index) => {
      const iconData = activityIcons.find(i => i.id === iconId);
      return {
        id: `${iconId}-${Date.now()}-${index}`,
        activityId: iconId,
        name: iconData?.name || 'Activity',
        icon: iconData?.icon || Star,
        color: iconData?.color || '#9B59B6',
        completed: false,
        customImage: null,
      };
    });
    setScheduleItems(items);
    setScheduleName(template.name === 'Start Fresh' ? 'My Schedule' : template.name);
    setCurrentView('builder');
  };

  // Add activity to schedule
  const addActivity = (activity, time = null) => {
    const newItem = {
      id: `${activity.id}-${Date.now()}`,
      activityId: activity.id,
      name: activity.name,
      icon: activity.icon,
      color: activity.color,
      completed: false,
      customImage: null,
      time: time, // HH:MM format
      notify: true, // Enable notifications by default
    };
    
    if (editingIndex !== null) {
      const newItems = [...scheduleItems];
      newItems.splice(editingIndex + 1, 0, newItem);
      setScheduleItems(newItems);
      setEditingIndex(null);
    } else {
      setScheduleItems([...scheduleItems, newItem]);
    }
    setShowIconPicker(false);
  };

  // Update activity time
  const updateActivityTime = (index, time) => {
    const newItems = [...scheduleItems];
    newItems[index] = { ...newItems[index], time };
    setScheduleItems(newItems);
  };

  // Toggle activity notification
  const toggleActivityNotify = (index) => {
    const newItems = [...scheduleItems];
    newItems[index] = { ...newItems[index], notify: !newItems[index].notify };
    setScheduleItems(newItems);
  };

  // Remove activity from schedule
  const removeActivity = (index) => {
    setScheduleItems(scheduleItems.filter((_, i) => i !== index));
  };

  // Toggle activity completion
  const toggleComplete = (index) => {
    const newItems = [...scheduleItems];
    newItems[index].completed = !newItems[index].completed;
    setScheduleItems(newItems);
    
    // If marking complete, stop any recurring reminders
    if (newItems[index].completed) {
      markActivityComplete(currentDateStr, index);
    }
  };

  // Save custom icon for an activity
  const saveActivityCustomIcon = (index, { customImage, customName }) => {
    const newItems = [...scheduleItems];
    if (customImage !== undefined) {
      newItems[index].customImage = customImage;
    }
    if (customName) {
      newItems[index].name = customName;
    }
    setScheduleItems(newItems);
  };

  // Long press handler for editing activity
  const handleActivityLongPress = (index) => {
    setEditingActivity({ ...scheduleItems[index], index });
  };

  // Reset all completions
  const resetCompletions = () => {
    setScheduleItems(scheduleItems.map(item => ({ ...item, completed: false })));
  };

  // Handle file selection for custom image
  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }
    
    try {
      setIsUploading(true);
      // Compress and convert to base64
      const compressed = await compressImage(file, 300, 0.8);
      setNewImageData(compressed);
      setNewImageName(file.name.replace(/\.[^/.]+$/, '') || 'Custom Activity');
      setShowCustomImageModal(true);
    } catch (e) {
      console.error('Failed to process image:', e);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Save custom image and add to schedule
  const saveCustomImage = async () => {
    if (!newImageData || !newImageName.trim()) return;
    
    try {
      setIsUploading(true);
      const activityId = `custom-${Date.now()}`;
      
      // Save to IndexedDB
      const savedImage = await imageStorage.saveCustomImage(
        user.id,
        activityId,
        newImageData,
        newImageName.trim()
      );
      
      // Add to local state
      setCustomImages(prev => [...prev, savedImage]);
      
      // Add to schedule
      const newItem = {
        id: `${activityId}-${Date.now()}`,
        activityId: activityId,
        name: newImageName.trim(),
        icon: null,
        color: '#87CEEB',
        completed: false,
        customImage: newImageData,
      };
      
      if (editingIndex !== null) {
        const newItems = [...scheduleItems];
        newItems.splice(editingIndex + 1, 0, newItem);
        setScheduleItems(newItems);
        setEditingIndex(null);
      } else {
        setScheduleItems([...scheduleItems, newItem]);
      }
      
      // Reset modal state
      setShowCustomImageModal(false);
      setShowIconPicker(false);
      setNewImageData(null);
      setNewImageName('');
      
    } catch (e) {
      console.error('Failed to save custom image:', e);
      alert('Failed to save image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Add existing custom image to schedule
  const addCustomImageToSchedule = (customImage) => {
    const newItem = {
      id: `${customImage.activityId}-${Date.now()}`,
      activityId: customImage.activityId,
      name: customImage.name,
      icon: null,
      color: '#87CEEB',
      completed: false,
      customImage: customImage.imageData,
    };
    
    if (editingIndex !== null) {
      const newItems = [...scheduleItems];
      newItems.splice(editingIndex + 1, 0, newItem);
      setScheduleItems(newItems);
      setEditingIndex(null);
    } else {
      setScheduleItems([...scheduleItems, newItem]);
    }
    setShowIconPicker(false);
  };

  // Delete a custom image
  const deleteCustomImage = async (imageId) => {
    if (!confirm('Delete this custom image?')) return;
    
    try {
      await imageStorage.deleteImage(imageId);
      setCustomImages(prev => prev.filter(img => img.id !== imageId));
    } catch (e) {
      console.error('Failed to delete image:', e);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newItems = [...scheduleItems];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    setScheduleItems(newItems);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Render template selection view
  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-display text-crayon-blue crayon-text mb-2">
          Choose a Template
        </h2>
        <p className="font-crayon text-gray-600">
          Pick a schedule to start with, or create your own!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {scheduleTemplates.map((template, index) => (
          <button
            key={template.id}
            onClick={() => selectTemplate(template)}
            className={`
              p-6 bg-white border-4 rounded-2xl text-left
              shadow-crayon hover:shadow-crayon-lg
              transform transition-all hover:-translate-y-1
              ${index % 4 === 0 ? 'border-crayon-red hover:rotate-1' : ''}
              ${index % 4 === 1 ? 'border-crayon-green hover:-rotate-1' : ''}
              ${index % 4 === 2 ? 'border-crayon-blue hover:rotate-1' : ''}
              ${index % 4 === 3 ? 'border-crayon-purple hover:-rotate-1' : ''}
            `}
            style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}
          >
            <div className="text-4xl mb-3">{template.emoji}</div>
            <h3 className="text-xl font-display text-gray-800 mb-1">{template.name}</h3>
            <p className="font-crayon text-gray-500 text-sm">{template.description}</p>
            <div className="mt-3 text-xs font-crayon text-gray-400">
              {template.items.length} activities
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Render schedule builder view
  const renderBuilder = () => (
    <div className="space-y-6">
      {/* Schedule Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            className="text-xl sm:text-2xl font-display text-crayon-blue bg-transparent 
                       border-b-4 border-dashed border-crayon-blue focus:outline-none
                       focus:border-crayon-purple transition-colors px-2"
            placeholder="Schedule Name"
          />
          <span className="text-2xl">📋</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={resetCompletions}
            className="flex items-center gap-1 px-3 py-2 bg-white border-3 border-crayon-orange 
                       rounded-full font-crayon text-sm text-gray-600 hover:bg-crayon-orange 
                       hover:text-white transition-all shadow-sm"
            title="Reset all"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={() => { saveSchedule(); }}
            className="flex items-center gap-1 px-3 py-2 bg-crayon-green text-white
                       rounded-full font-crayon text-sm hover:bg-green-600 
                       transition-all shadow-crayon"
          >
            <Save size={16} />
            <span className="hidden sm:inline">Save</span>
          </button>
          <button
            onClick={() => setCurrentView('templates')}
            className="flex items-center gap-1 px-3 py-2 bg-white border-3 border-gray-300 
                       rounded-full font-crayon text-sm text-gray-600 hover:border-crayon-blue 
                       transition-all shadow-sm"
          >
            <Edit3 size={16} />
            <span className="hidden sm:inline">Templates</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {scheduleItems.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border-4 border-crayon-yellow shadow-crayon">
          <div className="flex items-center justify-between mb-2">
            <span className="font-crayon text-gray-600">Today's Progress</span>
            <span className="font-display text-crayon-green">
              {scheduleItems.filter(i => i.completed).length} / {scheduleItems.length}
            </span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-crayon-green to-crayon-blue transition-all duration-500"
              style={{ 
                width: `${(scheduleItems.filter(i => i.completed).length / scheduleItems.length) * 100}%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Schedule Items */}
      <div className="space-y-3">
        {scheduleItems.length === 0 ? (
          <div 
            className="text-center py-12 bg-white border-4 border-dashed border-gray-300 rounded-2xl"
            style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}
          >
            <Sparkles size={48} className="mx-auto text-crayon-purple mb-4" />
            <p className="font-crayon text-gray-500 text-lg mb-4">
              Your schedule is empty!
            </p>
            <button
              onClick={() => setShowIconPicker(true)}
              className="px-6 py-3 bg-crayon-green text-white rounded-full font-crayon
                         shadow-crayon hover:shadow-crayon-lg hover:-translate-y-1 transition-all"
            >
              <Plus size={20} className="inline mr-2" />
              Add First Activity
            </button>
          </div>
        ) : (
          scheduleItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  flex items-center gap-3 p-4 bg-white rounded-2xl border-4 
                  shadow-crayon transition-all cursor-grab active:cursor-grabbing
                  ${item.completed ? 'opacity-60 border-gray-300' : 'border-gray-200'}
                  ${draggedIndex === index ? 'scale-105 shadow-crayon-lg' : ''}
                  hover:border-crayon-blue
                `}
                style={{ borderRadius: '15px 225px 15px 255px/255px 15px 225px 15px' }}
              >
                {/* Drag Handle */}
                <div className="text-gray-300 hover:text-gray-500 cursor-grab">
                  <GripVertical size={20} />
                </div>

                {/* Activity Icon */}
                <div className="relative">
                  <button
                    onClick={() => toggleComplete(index)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleActivityLongPress(index);
                    }}
                    className={`
                      w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center
                      transition-all transform hover:scale-105
                      ${item.completed ? 'bg-gray-200' : ''}
                    `}
                    style={{ 
                      backgroundColor: item.completed ? undefined : item.color,
                      borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px'
                    }}
                  >
                    {item.completed ? (
                      <Check size={32} className="text-crayon-green" strokeWidth={4} />
                    ) : item.customImage ? (
                      <img 
                        src={item.customImage} 
                        alt={item.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : IconComponent ? (
                      <IconComponent size={32} className="text-white" />
                    ) : (
                      <Star size={32} className="text-white" />
                    )}
                  </button>
                  {/* Edit button overlay */}
                  <button
                    onClick={() => handleActivityLongPress(index)}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border-2 border-[#4A9FD4] rounded-full flex items-center justify-center shadow-sm hover:bg-[#4A9FD4] hover:text-white transition-colors"
                    title="Customize icon"
                  >
                    <Camera size={12} />
                  </button>
                </div>

                {/* Activity Name & Time */}
                <div className="flex-1 min-w-0">
                  <h3 className={`
                    font-display text-lg sm:text-xl
                    ${item.completed ? 'line-through text-gray-400' : 'text-gray-800'}
                  `}>
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="time"
                      value={item.time || ''}
                      onChange={(e) => updateActivityTime(index, e.target.value)}
                      className="font-crayon text-sm text-gray-500 bg-transparent border-b border-dashed border-gray-300 focus:border-[#4A9FD4] focus:outline-none w-20"
                      placeholder="Time"
                    />
                    {item.time && (
                      <button
                        onClick={() => toggleActivityNotify(index)}
                        className={`p-1 rounded ${item.notify ? 'text-[#F5A623]' : 'text-gray-300'}`}
                        title={item.notify ? 'Notifications on' : 'Notifications off'}
                      >
                        <Bell size={14} />
                      </button>
                    )}
                    {!item.time && (
                      <span className="font-crayon text-xs text-gray-400">
                        Tap icon to {item.completed ? 'undo' : 'complete'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingIndex(index);
                      setShowIconPicker(true);
                    }}
                    className="p-2 text-gray-400 hover:text-crayon-blue transition-colors"
                    title="Add activity after this"
                  >
                    <Plus size={20} />
                  </button>
                  <button
                    onClick={() => removeActivity(index)}
                    className="p-2 text-gray-400 hover:text-crayon-red transition-colors"
                    title="Remove activity"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Activity Button */}
      {scheduleItems.length > 0 && (
        <button
          onClick={() => {
            setEditingIndex(null);
            setShowIconPicker(true);
          }}
          className="w-full py-4 border-4 border-dashed border-crayon-green text-crayon-green
                     rounded-2xl font-crayon text-lg hover:bg-crayon-green hover:text-white
                     transition-all flex items-center justify-center gap-2"
          style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}
        >
          <Plus size={24} />
          Add Activity
        </button>
      )}

      {/* Icon Picker Modal */}
      {showIconPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-crayon-paper w-full max-w-lg max-h-[80vh] rounded-3xl p-6 overflow-y-auto
                       border-4 border-crayon-purple shadow-crayon-lg"
            style={{ borderRadius: '30px 70px 30px 70px / 70px 30px 70px 30px' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-display text-crayon-purple">Pick an Activity</h3>
              <button
                onClick={() => {
                  setShowIconPicker(false);
                  setEditingIndex(null);
                }}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {activityIcons.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <button
                    key={activity.id}
                    onClick={() => addActivity(activity)}
                    className="flex flex-col items-center p-3 bg-white rounded-xl border-3 
                               border-gray-200 hover:border-crayon-purple hover:-translate-y-1
                               transition-all shadow-sm hover:shadow-crayon"
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
                      style={{ backgroundColor: activity.color }}
                    >
                      <IconComponent size={24} className="text-white" />
                    </div>
                    <span className="font-crayon text-xs text-gray-600 text-center leading-tight">
                      {activity.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Images Section */}
            <div className="mt-6 pt-6 border-t-4 border-dashed border-gray-300">
              <h4 className="font-display text-lg text-gray-700 mb-4 flex items-center gap-2">
                <Camera size={20} />
                Custom Pictures
              </h4>
              
              {/* Existing Custom Images */}
              {customImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                  {customImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <button
                        onClick={() => addCustomImageToSchedule(img)}
                        className="w-full flex flex-col items-center p-2 bg-white rounded-xl border-3 
                                   border-gray-200 hover:border-[#87CEEB] hover:-translate-y-1
                                   transition-all shadow-sm hover:shadow-crayon"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden mb-2 bg-[#87CEEB]">
                          <img 
                            src={img.imageData} 
                            alt={img.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-crayon text-xs text-gray-600 text-center leading-tight truncate w-full">
                          {img.name}
                        </span>
                      </button>
                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCustomImage(img.id);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-[#E63B2E] text-white rounded-full
                                   opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Upload New Image Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full py-4 border-3 border-[#87CEEB] rounded-xl font-crayon text-[#4A9FD4]
                           hover:bg-[#87CEEB] hover:text-white transition-all
                           flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload size={24} />
                    Upload Picture from Device
                  </>
                )}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-2 font-crayon">
                Take a photo or choose from your gallery
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Custom Image Name Modal */}
      {showCustomImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-[#FFFEF5] w-full max-w-sm rounded-3xl p-6 border-4 border-[#87CEEB] shadow-crayon-lg"
            style={{ borderRadius: '30px 70px 30px 70px / 70px 30px 70px 30px' }}
          >
            <h3 className="text-xl font-display text-[#4A9FD4] mb-4 text-center">Name This Activity</h3>
            
            {/* Preview Image */}
            {newImageData && (
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden border-3 border-[#87CEEB] shadow-sm">
                  <img 
                    src={newImageData} 
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            
            {/* Name Input */}
            <input
              type="text"
              value={newImageName}
              onChange={(e) => setNewImageName(e.target.value)}
              placeholder="e.g., Go to therapy"
              className="w-full px-4 py-3 border-3 border-gray-300 rounded-xl font-crayon text-lg
                        focus:border-[#87CEEB] focus:outline-none transition-colors mb-4"
              autoFocus
            />
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCustomImageModal(false);
                  setNewImageData(null);
                  setNewImageName('');
                }}
                className="flex-1 py-3 border-3 border-gray-300 rounded-xl font-crayon text-gray-600
                          hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveCustomImage}
                disabled={!newImageName.trim() || isUploading}
                className="flex-1 py-3 bg-[#5CB85C] border-3 border-green-600 rounded-xl font-crayon text-white
                          hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                          flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check size={20} />
                    Add
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E63B2E]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#E63B2E] 
                       rounded-full font-crayon text-[#E63B2E] hover:bg-[#E63B2E] 
                       hover:text-white transition-all shadow-sm text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img 
            src="/logo.jpeg" 
            alt="Special Needs World" 
            className="w-10 h-10 rounded-lg shadow-sm"
          />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#E63B2E] crayon-text flex items-center gap-2">
              <Calendar size={20} />
              Visual Schedule
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {currentView === 'templates' && renderTemplates()}
        {currentView === 'builder' && (
          <ScheduleCalendarWrapper
            scheduleItems={scheduleItems}
            setScheduleItems={setScheduleItems}
            scheduleName={scheduleName}
            setScheduleName={setScheduleName}
            onSave={saveSchedule}
          >
            {renderBuilder()}
          </ScheduleCalendarWrapper>
        )}
      </main>
      
      {/* Activity Icon Editor Modal */}
      {editingActivity && (
        <ActivityIconEditor
          activity={editingActivity}
          onSave={(updates) => saveActivityCustomIcon(editingActivity.index, updates)}
          onClose={() => setEditingActivity(null)}
        />
      )}
    </div>
  );
};

export default VisualSchedule;
