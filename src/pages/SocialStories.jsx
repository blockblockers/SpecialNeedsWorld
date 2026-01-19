// SocialStories.jsx - Social Stories for ATLASassist
// UPDATED: Added Visual Schedule integration
// Schedule story reading times for consistent practice

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

// Social story categories
const STORY_CATEGORIES = [
  { id: 'daily', name: 'Daily Routines', emoji: '🌅', color: '#5CB85C' },
  { id: 'social', name: 'Social Situations', emoji: '👋', color: '#4A9FD4' },
  { id: 'emotions', name: 'Managing Emotions', emoji: '💭', color: '#8E6BBF' },
  { id: 'safety', name: 'Safety', emoji: '🛡️', color: '#E63B2E' },
  { id: 'school', name: 'School', emoji: '🏫', color: '#F5A623' },
  { id: 'health', name: 'Health & Body', emoji: '🏥', color: '#20B2AA' },
];

// Sample social stories
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
    description: 'Understanding how to wait patiently',
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
    description: 'Learning to handle angry feelings',
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
    description: 'What to do during a fire drill',
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
    description: 'Preparing for classroom changes',
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
    title: 'Going to the Doctor',
    category: 'health',
    emoji: '👨‍⚕️',
    description: 'What happens at doctor visits',
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
    description: 'Steps for getting dressed each day',
    pages: [
      { text: 'Each day I get dressed.', image: '👕' },
      { text: 'First, I put on my underwear.', image: '1️⃣' },
      { text: 'Then I put on my shirt.', image: '2️⃣' },
      { text: 'Next, I put on my pants or shorts.', image: '3️⃣' },
      { text: 'Last, I put on my socks and shoes.', image: '👟' },
      { text: 'Now I\'m ready for my day!', image: '🌟' },
    ],
  },
  {
    id: 'saying-hello',
    title: 'Saying Hello',
    category: 'social',
    emoji: '👋',
    description: 'How to greet people',
    pages: [
      { text: 'When I see someone I know, I can say hello.', image: '👋' },
      { text: 'I can wave my hand.', image: '✋' },
      { text: 'I can say "Hi" or "Hello."', image: '💬' },
      { text: 'I can smile at them.', image: '😊' },
      { text: 'Saying hello makes people feel good!', image: '❤️' },
    ],
  },
  {
    id: 'feeling-worried',
    title: 'When I Feel Worried',
    category: 'emotions',
    emoji: '😟',
    description: 'Coping with worry and anxiety',
    pages: [
      { text: 'Sometimes I feel worried. That\'s normal.', image: '😟' },
      { text: 'My tummy might feel funny.', image: '🦋' },
      { text: 'I can take slow, deep breaths.', image: '🧘' },
      { text: 'I can talk to someone I trust.', image: '🗣️' },
      { text: 'I can think of happy things.', image: '🌈' },
      { text: 'The worry will get smaller.', image: '💪' },
    ],
  },
  {
    id: 'washing-hands',
    title: 'Washing My Hands',
    category: 'health',
    emoji: '🧼',
    description: 'Proper handwashing steps',
    pages: [
      { text: 'I wash my hands to stay healthy.', image: '🧼' },
      { text: 'I turn on the water.', image: '🚰' },
      { text: 'I add soap and rub my hands together.', image: '🫧' },
      { text: 'I scrub for 20 seconds - that\'s singing "Happy Birthday" twice!', image: '🎵' },
      { text: 'I rinse off all the soap.', image: '💧' },
      { text: 'I dry my hands with a towel.', image: '🧻' },
      { text: 'Clean hands keep germs away!', image: '✨' },
    ],
  },
];

// =====================================================
// ADD TO SCHEDULE MODAL
// =====================================================
const AddToScheduleModal = ({ isOpen, onClose, story, onAdd }) => {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [enableReminder, setEnableReminder] = useState(true);

  if (!isOpen || !story) return null;

  const handleAdd = () => {
    onAdd({
      story,
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
          <h3 className="font-display text-xl flex-1">Schedule Story Time</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Use Case Description */}
          <div className="p-3 bg-purple-50 rounded-xl border-2 border-purple-200">
            <p className="font-crayon text-sm text-purple-700">
              📖 <strong>Why schedule story time?</strong> Regular reading of social stories 
              helps reinforce learning and build consistent routines. Schedule a reminder 
              to read this story at the same time each day for best results!
            </p>
          </div>

          {/* Story Preview */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#8E6BBF' }}
            >
              <span className="text-2xl">{story.emoji}</span>
            </div>
            <div>
              <p className="font-display text-gray-800">Read: {story.title}</p>
              <p className="font-crayon text-sm text-gray-500">{story.pages?.length || 0} pages</p>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">
              <Calendar size={16} className="inline mr-1" />
              When?
            </label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setSelectedDate(getToday())}
                className={`flex-1 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                          ${selectedDate === getToday() 
                            ? 'border-[#8E6BBF] bg-purple-50 text-[#8E6BBF]' 
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate(getTomorrow())}
                className={`flex-1 py-2 rounded-xl font-crayon text-sm border-2 transition-all
                          ${selectedDate === getTomorrow() 
                            ? 'border-[#8E6BBF] bg-purple-50 text-[#8E6BBF]' 
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
              >
                Tomorrow
              </button>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border-2 border-gray-200 rounded-xl font-crayon"
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block font-crayon text-gray-600 mb-2">
              <Clock size={16} className="inline mr-1" />
              What time?
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl font-crayon text-lg"
            />
            <p className="font-crayon text-xs text-gray-400 mt-1">
              Tip: Pick a consistent time like after breakfast or before bed
            </p>
          </div>

          {/* Reminder Toggle */}
          <button
            type="button"
            onClick={() => setEnableReminder(!enableReminder)}
            className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all
              ${enableReminder 
                ? 'bg-purple-50 border-purple-400' 
                : 'bg-gray-50 border-gray-200'}`}
          >
            <div className={`p-2 rounded-full ${enableReminder ? 'bg-purple-500' : 'bg-gray-300'}`}>
              {enableReminder ? (
                <Bell size={16} className="text-white" />
              ) : (
                <BellOff size={16} className="text-white" />
              )}
            </div>
            <span className="font-crayon text-gray-700 flex-1 text-left">
              {enableReminder ? 'Reminder on' : 'No reminder'}
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
            Add to Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

// Story Reader Component
const StoryReader = ({ story, onClose, onSchedule }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const speechRef = useRef(null);

  const totalPages = story.pages.length;

  // Text-to-speech
  const speakText = (text) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Auto-read current page
  useEffect(() => {
    if (isReading) {
      speakText(story.pages[currentPage].text);
    }
  }, [currentPage, isReading]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleReading = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
    }
    setIsReading(!isReading);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                       rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-display text-[#8E6BBF] truncate">
              {story.emoji} {story.title}
            </h1>
          </div>
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`p-2 rounded-full ${speechEnabled ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}
          >
            {speechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-crayon text-gray-500">
              Page {currentPage + 1} of {totalPages}
            </span>
            <div className="flex gap-1">
              {story.pages.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentPage ? 'bg-[#8E6BBF] scale-125' : 
                    idx < currentPage ? 'bg-green-400' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Story Card */}
        <div className="bg-white rounded-3xl border-4 border-[#8E6BBF] shadow-crayon overflow-hidden">
          {/* Image/Emoji */}
          <div className="bg-gradient-to-b from-purple-100 to-white p-8 text-center">
            <span className="text-9xl block mb-4 animate-bounce-slow">
              {story.pages[currentPage].image}
            </span>
          </div>

          {/* Text */}
          <div className="p-6">
            <p className="text-2xl font-crayon text-gray-800 text-center leading-relaxed">
              {story.pages[currentPage].text}
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
                  : 'text-[#8E6BBF] hover:bg-purple-100'}`}
            >
              <ChevronLeft size={24} />
              Back
            </button>

            <button
              onClick={toggleReading}
              className={`p-3 rounded-full ${isReading ? 'bg-green-500' : 'bg-[#8E6BBF]'} text-white`}
            >
              {isReading ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-crayon
                ${currentPage === totalPages - 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-[#8E6BBF] hover:bg-purple-100'}`}
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
                className="px-4 py-2 bg-[#8E6BBF] border-2 border-purple-600 rounded-xl font-crayon text-white
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
            className="px-6 py-3 bg-white border-3 border-[#8E6BBF] rounded-xl font-crayon text-[#8E6BBF]
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

// Main Component
const SocialStories = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  
  // Schedule modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [storyToSchedule, setStoryToSchedule] = useState(null);

  // Load favorites
  useEffect(() => {
    const saved = localStorage.getItem('snw_social_stories_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Toggle favorite
  const toggleFavorite = (storyId) => {
    const newFavorites = favorites.includes(storyId)
      ? favorites.filter(id => id !== storyId)
      : [...favorites, storyId];
    setFavorites(newFavorites);
    localStorage.setItem('snw_social_stories_favorites', JSON.stringify(newFavorites));
  };

  // Filter stories
  const filteredStories = SOCIAL_STORIES.filter(story => {
    const matchesCategory = !selectedCategory || story.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle schedule button click
  const handleScheduleClick = (story) => {
    setStoryToSchedule(story);
    setShowScheduleModal(true);
  };

  // Handle add to schedule
  const handleAddToSchedule = ({ story, date, time, reminder }) => {
    const result = addActivityToSchedule({
      date: date,
      name: `Read: ${story.title}`,
      time: time,
      emoji: '📖',
      color: SOURCE_COLORS[SCHEDULE_SOURCES.SOCIAL_STORY],
      source: SCHEDULE_SOURCES.SOCIAL_STORY,
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
      toast.error('Oops!', 'Could not add to schedule. Please try again.');
    }
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

        {/* Stories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredStories.map(story => {
            const category = STORY_CATEGORIES.find(c => c.id === story.category);
            const isFavorite = favorites.includes(story.id);
            
            return (
              <div
                key={story.id}
                className="bg-white rounded-2xl border-3 overflow-hidden shadow-sm hover:shadow-md transition-all"
                style={{ borderColor: category?.color || '#8E6BBF' }}
              >
                <div 
                  className="p-4 text-center"
                  style={{ backgroundColor: `${category?.color}20` || '#8E6BBF20' }}
                >
                  <span className="text-5xl">{story.emoji}</span>
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

      {/* Schedule Modal */}
      <AddToScheduleModal
        isOpen={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false);
          setStoryToSchedule(null);
        }}
        story={storyToSchedule}
        onAdd={handleAddToSchedule}
      />
    </div>
  );
};

export default SocialStories;
