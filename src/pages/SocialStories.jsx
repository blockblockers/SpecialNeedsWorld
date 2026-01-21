// SocialStories.jsx - Social Stories for ATLASassist
// UPDATED: Added AI-powered custom story creation with Replicate images
// UPDATED: Added Visual Schedule integration

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Search,
  Star,
  Clock,
  X,
  CalendarPlus,
  Check,
  Bell,
  BellOff,
  Calendar,
  Plus,
  Loader2,
  Wand2,
  Image as ImageIcon,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { 
  addActivityToSchedule, 
  SCHEDULE_SOURCES, 
  SOURCE_COLORS,
  getToday,
  getTomorrow,
  formatDateDisplay,
  formatTimeDisplay 
} from '../services/scheduleHelper';
import { useToast } from '../components/ThemedToast';
import { supabase, isSupabaseConfigured } from '../services/supabase';

// Social story categories
const STORY_CATEGORIES = [
  { id: 'daily', name: 'Daily Routines', emoji: '🌅', color: '#5CB85C' },
  { id: 'social', name: 'Social Situations', emoji: '👋', color: '#4A9FD4' },
  { id: 'emotions', name: 'Managing Emotions', emoji: '💭', color: '#8E6BBF' },
  { id: 'safety', name: 'Safety', emoji: '🛡️', color: '#E63B2E' },
  { id: 'school', name: 'School', emoji: '🏫', color: '#F5A623' },
  { id: 'health', name: 'Health & Body', emoji: '🏥', color: '#20B2AA' },
];

// Sample social stories (pre-built)
const SOCIAL_STORIES = [
  {
    id: 'brushing-teeth',
    title: 'Brushing My Teeth',
    category: 'daily',
    emoji: '🦷',
    description: 'Learn about keeping teeth clean and healthy',
    pages: [
      { text: 'Every morning and night, I brush my teeth.', image: '🦷' },
      { text: 'I put toothpaste on my toothbrush.', image: '🪥' },
      { text: 'I brush all my teeth - front, back, and top.', image: '😁' },
      { text: 'I brush for about 2 minutes.', image: '⏱️' },
      { text: 'Then I spit and rinse with water.', image: '💧' },
      { text: 'Clean teeth make me feel good!', image: '✨' },
    ],
  },
  {
    id: 'waiting-turn',
    title: 'Waiting My Turn',
    category: 'social',
    emoji: '🙋',
    description: 'Learning to wait patiently',
    pages: [
      { text: 'Sometimes I need to wait my turn.', image: '⏳' },
      { text: 'Other people want a turn too.', image: '👥' },
      { text: 'While waiting, I can take deep breaths.', image: '🧘' },
      { text: 'I can think about something fun.', image: '💭' },
      { text: 'When it\'s my turn, I feel proud for waiting!', image: '🌟' },
    ],
  },
  {
    id: 'feeling-angry',
    title: 'When I Feel Angry',
    category: 'emotions',
    emoji: '😤',
    description: 'Managing angry feelings',
    pages: [
      { text: 'Sometimes I feel angry. That\'s okay.', image: '😤' },
      { text: 'My body might feel hot or tight.', image: '🔥' },
      { text: 'I can take 5 deep breaths.', image: '🌬️' },
      { text: 'I can squeeze a stress ball or pillow.', image: '🧸' },
      { text: 'I can tell someone how I feel.', image: '🗣️' },
      { text: 'The angry feeling will pass.', image: '🌈' },
    ],
  },
  {
    id: 'fire-drill',
    title: 'Fire Drill at School',
    category: 'safety',
    emoji: '🚨',
    description: 'What happens during a fire drill',
    pages: [
      { text: 'Sometimes we have fire drills at school.', image: '🏫' },
      { text: 'The alarm is loud, but I am safe.', image: '🔔' },
      { text: 'I stop what I\'m doing and stand up.', image: '🧍' },
      { text: 'I walk quietly in a line with my class.', image: '👣' },
      { text: 'We go outside to our meeting spot.', image: '🌳' },
      { text: 'I stay calm and wait for the all-clear.', image: '✅' },
    ],
  },
  {
    id: 'new-classroom',
    title: 'Going to a New Classroom',
    category: 'school',
    emoji: '🚪',
    description: 'Starting in a new classroom',
    pages: [
      { text: 'Sometimes I go to a new classroom.', image: '🚪' },
      { text: 'It might look different, and that\'s okay.', image: '👀' },
      { text: 'I can look for my seat and my things.', image: '🎒' },
      { text: 'The teacher will help me if I need it.', image: '👩‍🏫' },
      { text: 'Soon the new room will feel normal.', image: '😊' },
    ],
  },
  {
    id: 'doctor-visit',
    title: 'Visiting the Doctor',
    category: 'health',
    emoji: '👨‍⚕️',
    description: 'What to expect at a checkup',
    pages: [
      { text: 'Sometimes I visit the doctor.', image: '🏥' },
      { text: 'The doctor helps keep me healthy.', image: '👨‍⚕️' },
      { text: 'They might check my ears and eyes.', image: '👂' },
      { text: 'They might listen to my heart.', image: '💓' },
      { text: 'I can ask questions if I\'m worried.', image: '❓' },
      { text: 'Going to the doctor keeps me strong!', image: '💪' },
    ],
  },
  {
    id: 'getting-dressed',
    title: 'Getting Dressed',
    category: 'daily',
    emoji: '👕',
    description: 'Putting on my clothes',
    pages: [
      { text: 'Every day I put on my clothes.', image: '👕' },
      { text: 'First I put on my underwear.', image: '👖' },
      { text: 'Then I put on my shirt.', image: '👔' },
      { text: 'I put on my pants or shorts.', image: '👖' },
      { text: 'Last, I put on my socks and shoes.', image: '👟' },
      { text: 'Now I am ready for my day!', image: '🌟' },
    ],
  },
  {
    id: 'making-friends',
    title: 'Making New Friends',
    category: 'social',
    emoji: '👋',
    description: 'How to meet new people',
    pages: [
      { text: 'I can make new friends!', image: '😊' },
      { text: 'I can say "Hi" and smile.', image: '👋' },
      { text: 'I can ask them to play.', image: '🎮' },
      { text: 'Friends share and take turns.', image: '🤝' },
      { text: 'Making friends makes me happy!', image: '💕' },
    ],
  },
  {
    id: 'feeling-worried',
    title: 'When I Feel Worried',
    category: 'emotions',
    emoji: '😟',
    description: 'Coping with worry and anxiety',
    pages: [
      { text: 'Sometimes I feel worried.', image: '😟' },
      { text: 'My tummy might feel funny.', image: '🤢' },
      { text: 'I can take slow, deep breaths.', image: '🌬️' },
      { text: 'I can tell a grown-up how I feel.', image: '💬' },
      { text: 'Worries usually go away.', image: '☀️' },
      { text: 'I am brave!', image: '🦁' },
    ],
  },
  {
    id: 'washing-hands',
    title: 'Washing My Hands',
    category: 'health',
    emoji: '🧼',
    description: 'Keeping hands clean',
    pages: [
      { text: 'I wash my hands to stay healthy.', image: '🧼' },
      { text: 'I use soap and warm water.', image: '💧' },
      { text: 'I scrub for 20 seconds - like singing a song!', image: '🎵' },
      { text: 'I wash the front, back, and between fingers.', image: '🖐️' },
      { text: 'Then I dry my hands with a towel.', image: '🧻' },
      { text: 'Clean hands help me stay well!', image: '✨' },
    ],
  },
];

// Local storage keys
const CUSTOM_STORIES_KEY = 'snw_custom_stories';
const FAVORITES_KEY = 'snw_social_stories_favorites';

// Load custom stories from localStorage
const loadCustomStories = () => {
  try {
    const saved = localStorage.getItem(CUSTOM_STORIES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

// Save custom stories to localStorage
const saveCustomStories = (stories) => {
  localStorage.setItem(CUSTOM_STORIES_KEY, JSON.stringify(stories));
};

// ============================================
// SCHEDULE MODAL COMPONENT
// ============================================
const AddToScheduleModal = ({ isOpen, onClose, story, onAdd }) => {
  const [selectedDate, setSelectedDate] = useState('today');
  const [customDate, setCustomDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [reminder, setReminder] = useState(true);

  if (!isOpen || !story) return null;

  const handleSubmit = () => {
    let date;
    if (selectedDate === 'today') {
      date = getToday();
    } else if (selectedDate === 'tomorrow') {
      date = getTomorrow();
    } else {
      date = customDate;
    }

    if (!date) {
      alert('Please select a date');
      return;
    }

    onAdd({ story, date, time, reminder });
  };

  const category = STORY_CATEGORIES.find(c => c.id === story.category);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFEF5] w-full max-w-md rounded-3xl overflow-hidden border-4 border-[#8E6BBF]">
        <div className="bg-[#8E6BBF] text-white p-4 flex items-center justify-between">
          <h3 className="font-display text-xl flex items-center gap-2">
            <CalendarPlus size={24} />
            Schedule Story Time
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 p-3 rounded-xl flex items-center gap-3"
               style={{ backgroundColor: `${category?.color}20` }}>
            <span className="text-3xl">{story.emoji}</span>
            <div>
              <p className="font-display text-gray-800">{story.title}</p>
              <p className="font-crayon text-sm text-gray-500">{story.pages?.length || 0} pages</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-crayon text-gray-600 mb-2">When?</label>
              <div className="flex gap-2 flex-wrap">
                {['today', 'tomorrow', 'custom'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSelectedDate(opt)}
                    className={`px-4 py-2 rounded-xl font-crayon capitalize transition-all
                      ${selectedDate === opt 
                        ? 'bg-[#8E6BBF] text-white' 
                        : 'bg-white border-2 border-gray-200'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {selectedDate === 'custom' && (
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  min={getToday()}
                  className="mt-2 w-full p-3 border-3 border-gray-200 rounded-xl font-crayon"
                />
              )}
            </div>

            <div>
              <label className="block font-crayon text-gray-600 mb-2">What time?</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 border-3 border-gray-200 rounded-xl font-crayon"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                {reminder ? <Bell size={20} className="text-[#8E6BBF]" /> : <BellOff size={20} className="text-gray-400" />}
                <span className="font-crayon">Reminder notification</span>
              </div>
              <button
                onClick={() => setReminder(!reminder)}
                className={`w-12 h-6 rounded-full transition-colors relative
                  ${reminder ? 'bg-[#8E6BBF]' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                  ${reminder ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-display border-3 border-gray-200 text-gray-600
                         hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 rounded-xl font-display bg-[#8E6BBF] text-white
                         hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Add to Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// CREATE CUSTOM STORY MODAL
// ============================================
const CreateStoryModal = ({ isOpen, onClose, onStoryCreated }) => {
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();

  const suggestedTopics = [
    'washing dishes',
    'going to the dentist',
    'riding the school bus',
    'eating at a restaurant',
    'getting a haircut',
    'going to the grocery store',
    'taking medicine',
    'sharing toys',
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for your story');
      return;
    }

    if (!isSupabaseConfigured()) {
      setError('Cloud features not configured. Please check your settings.');
      return;
    }

    setGenerating(true);
    setProgress('Creating your story...');
    setError('');

    try {
      setProgress('Writing story text...');
      
      const { data, error: fnError } = await supabase.functions.invoke('generate-social-story', {
        body: {
          topic: topic.trim(),
          pageCount: 6,
          generateImages: true,
        },
      });

      if (fnError) throw fnError;

      if (data.error === 'INSUFFICIENT_CREDITS') {
        // Story was created but images failed
        toast.warning('Story Created', data.message || 'Images could not be generated.');
      }

      // Create the story object
      const newStory = {
        id: `custom_${Date.now()}`,
        title: data.title || `Story: ${topic}`,
        topic: topic,
        category: data.category || 'general',
        emoji: STORY_CATEGORIES.find(c => c.id === data.category)?.emoji || '📖',
        description: `Custom story about ${topic}`,
        isCustom: true,
        createdAt: new Date().toISOString(),
        pages: data.pages.map((page, idx) => ({
          text: page.text,
          image: page.imageUrl || page.emoji || '📖',
          imageUrl: page.imageUrl || null,
          imageGenerated: page.imageGenerated || false,
        })),
        imagesGenerated: data.imagesGenerated || 0,
      };

      // Save to localStorage
      const customStories = loadCustomStories();
      customStories.unshift(newStory);
      saveCustomStories(customStories);

      setProgress('');
      setGenerating(false);
      setTopic('');
      
      toast.success('Story Created!', `Your story about "${topic}" is ready to read.`);
      onStoryCreated(newStory);
      onClose();

    } catch (err) {
      console.error('Error generating story:', err);
      setError(err.message || 'Failed to generate story. Please try again.');
      setGenerating(false);
      setProgress('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFEF5] w-full max-w-md rounded-3xl overflow-hidden border-4 border-[#5CB85C]">
        <div className="bg-[#5CB85C] text-white p-4 flex items-center justify-between">
          <h3 className="font-display text-xl flex items-center gap-2">
            <Wand2 size={24} />
            Create Custom Story
          </h3>
          <button 
            onClick={onClose} 
            disabled={generating}
            className="p-1 hover:bg-white/20 rounded-full disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {generating ? (
            <div className="text-center py-8">
              <Loader2 size={48} className="animate-spin text-[#5CB85C] mx-auto mb-4" />
              <p className="font-display text-lg text-gray-800 mb-2">Creating Your Story</p>
              <p className="font-crayon text-gray-500">{progress}</p>
              <p className="font-crayon text-xs text-gray-400 mt-4">
                This may take 30-60 seconds...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block font-crayon text-gray-600 mb-2">
                  What should the story be about?
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => { setTopic(e.target.value); setError(''); }}
                  placeholder="e.g., washing dishes, going to the dentist..."
                  className="w-full p-4 border-3 border-gray-200 rounded-xl font-crayon text-lg
                           focus:border-[#5CB85C] focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-2">
                  <AlertCircle size={18} className="text-red-500" />
                  <p className="font-crayon text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="mb-6">
                <p className="font-crayon text-sm text-gray-500 mb-2">Try these ideas:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTopics.map(t => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className="px-3 py-1 bg-green-50 border-2 border-green-200 rounded-full 
                               font-crayon text-sm text-green-700 hover:bg-green-100 transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border-2 border-blue-200 mb-6">
                <p className="font-crayon text-xs text-blue-700 flex items-start gap-2">
                  <ImageIcon size={14} className="flex-shrink-0 mt-0.5" />
                  Stories include AI-generated illustrations when available!
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-display border-3 border-gray-200 text-gray-600
                           hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!topic.trim()}
                  className="flex-1 py-3 rounded-xl font-display bg-[#5CB85C] text-white
                           hover:bg-green-600 transition-all flex items-center justify-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles size={20} />
                  Create Story
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// STORY READER COMPONENT
// ============================================
const StoryReader = ({ story, onClose, onSchedule }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const synthRef = useRef(null);

  const totalPages = story.pages.length;
  const currentPageData = story.pages[currentPage];

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      utterance.onend = () => setIsReading(false);
      synthRef.current = utterance;
      setIsReading(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleReading = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else {
      speak(currentPageData.text);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      setCurrentPage(prev => prev - 1);
    }
  };

  const category = STORY_CATEGORIES.find(c => c.id === story.category);

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4"
              style={{ borderColor: category?.color || '#8E6BBF' }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-display text-gray-600
                       hover:bg-gray-100 transition-all"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{story.emoji}</span>
            <span className="font-display text-gray-800">{story.title}</span>
            {story.isCustom && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-crayon rounded-full">
                Custom
              </span>
            )}
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-crayon text-sm text-gray-500">
              Page {currentPage + 1} of {totalPages}
            </span>
            <div className="flex gap-1">
              {story.pages.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    idx === currentPage ? 'scale-125' : ''
                  } ${
                    idx < currentPage ? 'bg-green-400' : 
                    idx === currentPage ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Story Card */}
        <div className="bg-white rounded-3xl border-4 shadow-crayon overflow-hidden"
             style={{ borderColor: category?.color || '#8E6BBF' }}>
          {/* Image/Emoji */}
          <div className="bg-gradient-to-b from-purple-100 to-white p-8 text-center">
            {currentPageData.imageUrl ? (
              <img 
                src={currentPageData.imageUrl} 
                alt={currentPageData.text}
                className="max-w-[280px] max-h-[280px] mx-auto rounded-2xl shadow-lg object-contain"
              />
            ) : (
              <span className="text-9xl block mb-4 animate-bounce-slow">
                {currentPageData.image}
              </span>
            )}
          </div>

          {/* Text */}
          <div className="p-6">
            <p className="text-2xl font-crayon text-gray-800 text-center leading-relaxed">
              {currentPageData.text}
            </p>
          </div>

          {/* Navigation */}
          <div className="p-4 bg-gray-50 flex items-center justify-between">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-crayon
                ${currentPage === 0 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-purple-600 hover:bg-purple-100'}`}
            >
              <ChevronLeft size={24} />
              Back
            </button>

            <button
              onClick={toggleReading}
              className={`p-3 rounded-full ${isReading ? 'bg-green-500' : 'bg-purple-600'} text-white`}
            >
              {isReading ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-crayon
                ${currentPage === totalPages - 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-purple-600 hover:bg-purple-100'}`}
            >
              Next
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Completion */}
        {currentPage === totalPages - 1 && (
          <div className="mt-6 p-6 bg-green-50 rounded-2xl border-4 border-green-300 text-center">
            <Sparkles className="w-12 h-12 text-green-500 mx-auto mb-2 animate-pulse" />
            <h3 className="font-display text-xl text-green-700 mb-2">Great Job! 🎉</h3>
            <p className="font-crayon text-green-600 mb-4">You finished the story!</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setCurrentPage(0)}
                className="px-4 py-2 bg-white border-2 border-green-400 rounded-xl font-crayon text-green-600
                           hover:bg-green-100 transition-all flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Read Again
              </button>
              <button
                onClick={() => onSchedule(story)}
                className="px-4 py-2 bg-purple-600 border-2 border-purple-700 rounded-xl font-crayon text-white
                           hover:bg-purple-700 transition-all flex items-center gap-2"
              >
                <CalendarPlus size={16} />
                Schedule Reading
              </button>
            </div>
          </div>
        )}

        {/* Schedule Button (always visible) */}
        <div className="mt-4 text-center">
          <button
            onClick={() => onSchedule(story)}
            className="px-6 py-3 bg-white border-3 border-purple-400 rounded-xl font-crayon text-purple-600
                       hover:bg-purple-50 transition-all inline-flex items-center gap-2"
          >
            <CalendarPlus size={18} />
            Add to Visual Schedule
          </button>
        </div>
      </main>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const SocialStories = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [customStories, setCustomStories] = useState([]);
  
  // Modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [storyToSchedule, setStoryToSchedule] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load data on mount
  useEffect(() => {
    // Load favorites
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {}
    }

    // Load custom stories
    setCustomStories(loadCustomStories());
  }, []);

  // Toggle favorite
  const toggleFavorite = (storyId) => {
    const newFavorites = favorites.includes(storyId)
      ? favorites.filter(id => id !== storyId)
      : [...favorites, storyId];
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  // Delete custom story
  const deleteCustomStory = (storyId) => {
    if (confirm('Delete this custom story?')) {
      const updated = customStories.filter(s => s.id !== storyId);
      setCustomStories(updated);
      saveCustomStories(updated);
      toast.success('Deleted', 'Custom story removed.');
    }
  };

  // Combine all stories
  const allStories = [...customStories, ...SOCIAL_STORIES];

  // Filter stories
  const filteredStories = allStories.filter(story => {
    const matchesCategory = !selectedCategory || story.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.topic?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle schedule button click
  const handleScheduleClick = (story) => {
    setStoryToSchedule(story);
    setShowScheduleModal(true);
  };

  // Handle add to schedule
  const handleAddToSchedule = ({ story, date, time, reminder }) => {
    try {
      const result = addActivityToSchedule({
        date: date,
        name: `Read: ${story.title}`,
        time: time,
        emoji: '📖',
        color: SOURCE_COLORS?.[SCHEDULE_SOURCES?.SOCIAL_STORY] || '#8E6BBF',
        source: SCHEDULE_SOURCES?.SOCIAL_STORY || 'social_story',
        notify: reminder,
        metadata: {
          storyId: story.id,
          storyTitle: story.title,
          category: story.category,
        },
      });

      setShowScheduleModal(false);
      setStoryToSchedule(null);

      if (result && result.success) {
        toast.schedule(
          'Story Time Scheduled!',
          `"${story.title}" is on your Visual Schedule for ${formatDateDisplay(date)} at ${formatTimeDisplay(time)}`
        );
      } else {
        toast.error('Oops!', result?.error || 'Could not add to schedule. Please try again.');
      }
    } catch (error) {
      console.error('Error adding story to schedule:', error);
      toast.error('Oops!', 'Something went wrong. Please try again.');
      setShowScheduleModal(false);
      setStoryToSchedule(null);
    }
  };

  // Handle new custom story created
  const handleStoryCreated = (newStory) => {
    setCustomStories(prev => [newStory, ...prev]);
    setSelectedStory(newStory); // Open the new story immediately
  };

  // If reading a story
  if (selectedStory) {
    return (
      <>
        <StoryReader 
          story={selectedStory} 
          onClose={() => setSelectedStory(null)}
          onSchedule={handleScheduleClick}
        />
        <AddToScheduleModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setStoryToSchedule(null);
          }}
          story={storyToSchedule}
          onAdd={handleAddToSchedule}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/activities')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                       rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#8E6BBF] crayon-text flex items-center gap-2">
              📚 Social Stories
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Create Custom Story Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full mb-4 p-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl
                     text-white font-display text-lg flex items-center justify-center gap-3
                     hover:from-green-500 hover:to-emerald-600 transition-all shadow-lg
                     border-4 border-green-300"
        >
          <Wand2 size={24} />
          Create Custom Story with AI
          <Sparkles size={20} />
        </button>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-3 border-gray-200 rounded-xl font-crayon
                       focus:border-[#8E6BBF] focus:outline-none transition-colors"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl font-crayon text-sm transition-all
              ${!selectedCategory 
                ? 'bg-[#8E6BBF] text-white' 
                : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#8E6BBF]'
              }`}
          >
            All Stories
          </button>
          {STORY_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-crayon text-sm transition-all
                ${selectedCategory === cat.id 
                  ? 'text-white' 
                  : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Custom Stories Section */}
        {customStories.length > 0 && !selectedCategory && !searchQuery && (
          <div className="mb-6">
            <h2 className="font-display text-gray-700 mb-3 flex items-center gap-2">
              <Sparkles size={18} className="text-green-500" />
              Your Custom Stories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {customStories.slice(0, 4).map(story => {
                const category = STORY_CATEGORIES.find(c => c.id === story.category);
                const isFavorite = favorites.includes(story.id);
                
                return (
                  <div
                    key={story.id}
                    className="bg-white rounded-2xl border-3 overflow-hidden shadow-sm hover:shadow-md transition-all relative"
                    style={{ borderColor: category?.color || '#5CB85C' }}
                  >
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-crayon rounded-full">
                      Custom
                    </span>
                    <div 
                      className="p-4 text-center"
                      style={{ backgroundColor: `${category?.color}20` || '#5CB85C20' }}
                    >
                      {story.pages[0]?.imageUrl ? (
                        <img 
                          src={story.pages[0].imageUrl} 
                          alt={story.title}
                          className="w-20 h-20 mx-auto rounded-xl object-cover"
                        />
                      ) : (
                        <span className="text-5xl">{story.emoji}</span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-display text-gray-800 text-sm">{story.title}</h3>
                        <button
                          onClick={() => deleteCustomStory(story.id)}
                          className="p-1 text-gray-300 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="font-crayon text-xs text-gray-500 mb-3">{story.description}</p>
                      <button
                        onClick={() => setSelectedStory(story)}
                        className="w-full py-2 rounded-xl font-crayon text-white text-sm
                                   hover:opacity-90 transition-all flex items-center justify-center gap-1"
                        style={{ backgroundColor: category?.color || '#5CB85C' }}
                      >
                        <BookOpen size={16} />
                        Read
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredStories.filter(s => !s.isCustom || selectedCategory || searchQuery).map(story => {
            const category = STORY_CATEGORIES.find(c => c.id === story.category);
            const isFavorite = favorites.includes(story.id);
            
            return (
              <div
                key={story.id}
                className="bg-white rounded-2xl border-3 overflow-hidden shadow-sm hover:shadow-md transition-all relative"
                style={{ borderColor: category?.color || '#8E6BBF' }}
              >
                {story.isCustom && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-crayon rounded-full z-10">
                    Custom
                  </span>
                )}
                <div 
                  className="p-4 text-center"
                  style={{ backgroundColor: `${category?.color}20` || '#8E6BBF20' }}
                >
                  {story.pages[0]?.imageUrl ? (
                    <img 
                      src={story.pages[0].imageUrl} 
                      alt={story.title}
                      className="w-20 h-20 mx-auto rounded-xl object-cover"
                    />
                  ) : (
                    <span className="text-5xl">{story.emoji}</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display text-gray-800">{story.title}</h3>
                    <button
                      onClick={() => toggleFavorite(story.id)}
                      className={`p-1 ${isFavorite ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      <Star size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <p className="font-crayon text-sm text-gray-500 mb-3">{story.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedStory(story)}
                      className="flex-1 py-2 rounded-xl font-crayon text-white text-sm
                                 hover:opacity-90 transition-all flex items-center justify-center gap-1"
                      style={{ backgroundColor: category?.color || '#8E6BBF' }}
                    >
                      <BookOpen size={16} />
                      Read
                    </button>
                    <button
                      onClick={() => handleScheduleClick(story)}
                      className="py-2 px-3 rounded-xl font-crayon text-gray-600 text-sm
                                 border-2 border-gray-200 hover:border-gray-300 transition-all"
                    >
                      <CalendarPlus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="font-crayon text-gray-500">No stories found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-xl font-crayon
                       hover:bg-green-600 transition-all flex items-center gap-2 mx-auto"
            >
              <Plus size={18} />
              Create a Custom Story
            </button>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 p-4 bg-purple-50 rounded-2xl border-3 border-purple-200">
          <h3 className="font-display text-[#8E6BBF] mb-2 flex items-center gap-2">
            <BookOpen size={18} />
            About Social Stories
          </h3>
          <ul className="font-crayon text-sm text-purple-700 space-y-1">
            <li>• Short stories that explain social situations</li>
            <li>• Help understand what to expect</li>
            <li>• Learn appropriate responses</li>
            <li>• Read regularly for best results!</li>
          </ul>
        </div>
      </main>

      {/* Modals */}
      <AddToScheduleModal
        isOpen={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false);
          setStoryToSchedule(null);
        }}
        story={storyToSchedule}
        onAdd={handleAddToSchedule}
      />

      <CreateStoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onStoryCreated={handleStoryCreated}
      />
    </div>
  );
};

export default SocialStories;
