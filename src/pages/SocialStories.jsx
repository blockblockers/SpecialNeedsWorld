// SocialStories.jsx - Social Stories for ATLASassist
// FIXED: Back button now navigates to /activities (not /wellness)
// Stories to help prepare for new situations

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Book,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Volume2,
  X,
  Edit2,
  Trash2,
  Plus,
  Sparkles
} from 'lucide-react';

const STORAGE_KEY = 'snw_custom_stories';

// Text-to-speech helper
const speak = (text) => {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    speechSynthesis.speak(utterance);
  }
};

// Story templates
const STORY_TEMPLATES = [
  {
    id: 'doctor-visit',
    title: 'Going to the Doctor',
    emoji: '🏥',
    color: '#4A9FD4',
    pages: [
      { emoji: '🏥', text: 'Today I am going to the doctor.' },
      { emoji: '🚗', text: 'We will drive to the doctor\'s office.' },
      { emoji: '🪑', text: 'First, I will wait in the waiting room.' },
      { emoji: '👩‍⚕️', text: 'The doctor will call my name.' },
      { emoji: '📏', text: 'They might check my height and weight.' },
      { emoji: '💓', text: 'They might listen to my heart.' },
      { emoji: '😊', text: 'The doctor wants to help me stay healthy.' },
      { emoji: '🌟', text: 'I did a great job at the doctor!' },
    ],
  },
  {
    id: 'dentist-visit',
    title: 'Going to the Dentist',
    emoji: '🦷',
    color: '#20B2AA',
    pages: [
      { emoji: '🦷', text: 'Today I am going to the dentist.' },
      { emoji: '🪥', text: 'The dentist helps keep my teeth clean and healthy.' },
      { emoji: '🪑', text: 'I will sit in a special chair that moves up and down.' },
      { emoji: '💡', text: 'There is a bright light so the dentist can see my teeth.' },
      { emoji: '🔍', text: 'The dentist will count my teeth and look for any problems.' },
      { emoji: '✨', text: 'They might polish my teeth to make them shiny.' },
      { emoji: '😁', text: 'Clean teeth make me smile!' },
      { emoji: '🌟', text: 'I did a great job at the dentist!' },
    ],
  },
  {
    id: 'haircut',
    title: 'Getting a Haircut',
    emoji: '💇',
    color: '#E86B9A',
    pages: [
      { emoji: '💇', text: 'Today I am getting a haircut.' },
      { emoji: '🏪', text: 'We will go to a place that cuts hair.' },
      { emoji: '🪑', text: 'I will sit in a special chair.' },
      { emoji: '👕', text: 'They will put a cape over my clothes to keep them dry.' },
      { emoji: '💦', text: 'They might spray my hair with water.' },
      { emoji: '✂️', text: 'The scissors make a snipping sound. That\'s okay!' },
      { emoji: '🪮', text: 'They will comb my hair and cut a little bit.' },
      { emoji: '🌟', text: 'I look great with my new haircut!' },
    ],
  },
  {
    id: 'grocery-store',
    title: 'Going to the Grocery Store',
    emoji: '🛒',
    color: '#5CB85C',
    pages: [
      { emoji: '🛒', text: 'Today I am going to the grocery store.' },
      { emoji: '📝', text: 'We have a list of things to buy.' },
      { emoji: '🛒', text: 'I can help push the cart or ride in it.' },
      { emoji: '🍎', text: 'We will walk through different aisles to find food.' },
      { emoji: '🔊', text: 'The store might be noisy. I can use my calm-down tools.' },
      { emoji: '💳', text: 'At the end, we pay for our food.' },
      { emoji: '🛍️', text: 'We put the groceries in bags.' },
      { emoji: '🌟', text: 'I was a great helper at the store!' },
    ],
  },
  {
    id: 'new-school',
    title: 'Starting at a New School',
    emoji: '🏫',
    color: '#8E6BBF',
    pages: [
      { emoji: '🏫', text: 'I am starting at a new school.' },
      { emoji: '😊', text: 'It\'s okay to feel nervous about new things.' },
      { emoji: '👩‍🏫', text: 'I will have a new teacher who wants to help me learn.' },
      { emoji: '👫', text: 'I will meet new friends in my class.' },
      { emoji: '📚', text: 'We will learn new things and do fun activities.' },
      { emoji: '🍎', text: 'I will eat lunch at school.' },
      { emoji: '🚌', text: 'At the end of the day, I will go home.' },
      { emoji: '🌟', text: 'My new school will be great!' },
    ],
  },
  {
    id: 'fire-drill',
    title: 'Fire Drill at School',
    emoji: '🔔',
    color: '#E63B2E',
    pages: [
      { emoji: '🔔', text: 'Sometimes at school we have fire drills.' },
      { emoji: '📢', text: 'A loud bell or alarm will ring. This is just practice!' },
      { emoji: '🚶', text: 'When I hear the alarm, I will stop what I\'m doing.' },
      { emoji: '👩‍🏫', text: 'My teacher will tell us where to go.' },
      { emoji: '🚶‍♂️', text: 'We will walk quietly in a line to go outside.' },
      { emoji: '🏃‍♂️', text: 'We don\'t run - we walk calmly.' },
      { emoji: '🧍', text: 'Outside, we stand together and wait.' },
      { emoji: '🌟', text: 'When the drill is over, we go back inside. I did great!' },
    ],
  },
  {
    id: 'birthday-party',
    title: 'Going to a Birthday Party',
    emoji: '🎂',
    color: '#F5A623',
    pages: [
      { emoji: '🎂', text: 'I am going to a birthday party!' },
      { emoji: '🎁', text: 'I might bring a gift for my friend.' },
      { emoji: '👋', text: 'When I arrive, I will say hello.' },
      { emoji: '🎮', text: 'We will play games and have fun.' },
      { emoji: '🎵', text: 'There might be music. It might be loud.' },
      { emoji: '🍰', text: 'We will eat cake and sing Happy Birthday.' },
      { emoji: '👋', text: 'When it\'s time to go, I will say goodbye and thank you.' },
      { emoji: '🌟', text: 'Birthday parties are fun!' },
    ],
  },
  {
    id: 'restaurant',
    title: 'Eating at a Restaurant',
    emoji: '🍽️',
    color: '#F8D14A',
    pages: [
      { emoji: '🍽️', text: 'Today I am eating at a restaurant.' },
      { emoji: '🚶', text: 'We will walk in and wait to be seated.' },
      { emoji: '📋', text: 'A server will give us a menu to choose our food.' },
      { emoji: '🗣️', text: 'I will tell the server what I want to eat.' },
      { emoji: '⏳', text: 'We wait for our food. I can draw or play a quiet game.' },
      { emoji: '🍝', text: 'The server brings our food. Time to eat!' },
      { emoji: '💳', text: 'When we\'re done, we pay the bill.' },
      { emoji: '🌟', text: 'I did great at the restaurant!' },
    ],
  },
];

// Story Card Component
const StoryCard = ({ story, onClick, onDelete, isCustom }) => (
  <button
    onClick={() => onClick(story)}
    className="w-full p-4 bg-white rounded-2xl border-4 shadow-crayon
               hover:shadow-crayon-lg hover:-translate-y-1 transition-all
               flex items-center gap-4 text-left"
    style={{ borderColor: story.color }}
  >
    <div 
      className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: `${story.color}20` }}
    >
      <span className="text-4xl">{story.emoji}</span>
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-display text-gray-800 truncate">{story.title}</h3>
      <p className="font-crayon text-sm text-gray-500">{story.pages.length} pages</p>
    </div>
    {isCustom && onDelete && (
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(story.id); }}
        className="p-2 text-gray-400 hover:text-red-500"
      >
        <Trash2 size={20} />
      </button>
    )}
    <ChevronRight size={20} className="text-gray-400" />
  </button>
);

// Story Viewer
const StoryViewer = ({ story, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying && currentPage < story.pages.length - 1) {
      timer = setTimeout(() => {
        setCurrentPage(currentPage + 1);
        speak(story.pages[currentPage + 1].text);
      }, 4000);
    } else if (isPlaying && currentPage >= story.pages.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentPage, story.pages]);

  const nextPage = () => {
    if (currentPage < story.pages.length - 1) {
      setCurrentPage(currentPage + 1);
      speak(story.pages[currentPage + 1].text);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      speak(story.pages[currentPage - 1].text);
    }
  };

  const togglePlay = () => {
    if (!isPlaying) {
      speak(story.pages[currentPage].text);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden" style={{ borderTop: `6px solid ${story.color}` }}>
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-display text-lg" style={{ color: story.color }}>{story.title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Page */}
        <div className="p-8 text-center min-h-[300px] flex flex-col items-center justify-center" style={{ backgroundColor: `${story.color}10` }}>
          <span className="text-8xl mb-6">{story.pages[currentPage].emoji}</span>
          <p className="text-xl font-crayon text-gray-800 leading-relaxed">{story.pages[currentPage].text}</p>
        </div>

        {/* Controls */}
        <div className="p-4 border-t bg-gray-50">
          {/* Progress */}
          <div className="flex gap-1 justify-center mb-4">
            {story.pages.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentPage(i); speak(story.pages[i].text); }}
                className={`w-3 h-3 rounded-full transition-all ${i === currentPage ? 'w-8' : ''}`}
                style={{ backgroundColor: i === currentPage ? story.color : '#d1d5db' }}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="p-3 rounded-full bg-white shadow-md disabled:opacity-30"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={togglePlay}
              className="p-4 rounded-full text-white shadow-lg"
              style={{ backgroundColor: story.color }}
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} />}
            </button>
            <button
              onClick={() => speak(story.pages[currentPage].text)}
              className="p-3 rounded-full bg-white shadow-md"
            >
              <Volume2 size={24} style={{ color: story.color }} />
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === story.pages.length - 1}
              className="p-3 rounded-full bg-white shadow-md disabled:opacity-30"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 font-crayon mt-3">
            Page {currentPage + 1} of {story.pages.length}
          </p>
        </div>
      </div>
    </div>
  );
};

// Main Component
const SocialStories = () => {
  const navigate = useNavigate();
  const [customStories, setCustomStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [showViewer, setShowViewer] = useState(false);

  // Load custom stories
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCustomStories(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading:', e);
      }
    }
  }, []);

  const deleteCustomStory = (id) => {
    const updated = customStories.filter(s => s.id !== id);
    setCustomStories(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const openStory = (story) => {
    setSelectedStory(story);
    setShowViewer(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* FIXED: Back button goes to /activities */}
          <button
            onClick={() => navigate('/activities')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#5CB85C] 
                       rounded-xl font-display font-bold text-[#5CB85C] hover:bg-[#5CB85C] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#5CB85C] crayon-text">
              📖 Social Stories
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <p className="text-center font-crayon text-gray-600">
          Stories to help prepare for new situations
        </p>

        {/* Template Stories */}
        <div>
          <h2 className="font-display text-gray-700 mb-3 flex items-center gap-2">
            <Book size={18} className="text-[#5CB85C]" />
            Story Library
          </h2>
          <div className="space-y-3">
            {STORY_TEMPLATES.map(story => (
              <StoryCard
                key={story.id}
                story={story}
                onClick={openStory}
                isCustom={false}
              />
            ))}
          </div>
        </div>

        {/* Custom Stories */}
        {customStories.length > 0 && (
          <div>
            <h2 className="font-display text-gray-700 mb-3 flex items-center gap-2">
              <Edit2 size={18} className="text-[#F5A623]" />
              My Stories
            </h2>
            <div className="space-y-3">
              {customStories.map(story => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onClick={openStory}
                  onDelete={deleteCustomStory}
                  isCustom={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tip */}
        <div className="p-4 bg-green-50 rounded-2xl border-3 border-green-200">
          <p className="font-crayon text-gray-700 text-center">
            💡 <strong>Tip:</strong> Read stories before new experiences to help you know what to expect!
          </p>
        </div>
      </main>

      {/* Story Viewer */}
      {showViewer && selectedStory && (
        <StoryViewer
          story={selectedStory}
          onClose={() => { setShowViewer(false); setSelectedStory(null); }}
        />
      )}
    </div>
  );
};

export default SocialStories;
