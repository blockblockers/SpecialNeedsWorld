// SocialStories.jsx - Create and view visual social stories
// NAVIGATION: Back button goes to /wellness (parent hub)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Play, 
  Pause,
  ChevronLeft, 
  ChevronRight, 
  X, 
  Book,
  Edit2,
  Trash2,
  Volume2,
  Save,
  Image
} from 'lucide-react';

// Pre-made social stories templates
const STORY_TEMPLATES = [
  {
    id: 'doctor',
    title: 'Going to the Doctor',
    emoji: '🏥',
    color: '#4A9FD4',
    pages: [
      { text: "Today I'm going to visit the doctor.", emoji: '🏥' },
      { text: "The waiting room might have other people.", emoji: '👥' },
      { text: "A nurse will call my name.", emoji: '👩‍⚕️' },
      { text: "The doctor will check my body to help me stay healthy.", emoji: '🩺' },
      { text: "It might feel different, but it will be okay.", emoji: '😊' },
      { text: "When we're done, I can feel proud of myself!", emoji: '⭐' },
    ]
  },
  {
    id: 'haircut',
    title: 'Getting a Haircut',
    emoji: '💇',
    color: '#E86B9A',
    pages: [
      { text: "Today I'm getting a haircut.", emoji: '💇' },
      { text: "I'll sit in a special chair.", emoji: '💺' },
      { text: "The hairdresser will put a cape on me.", emoji: '🦸' },
      { text: "I might hear scissors or clippers.", emoji: '✂️' },
      { text: "It doesn't hurt, just tickles sometimes.", emoji: '😊' },
      { text: "My new haircut will look great!", emoji: '⭐' },
    ]
  },
  {
    id: 'school',
    title: 'First Day of School',
    emoji: '🏫',
    color: '#5CB85C',
    pages: [
      { text: "Today is a new day at school.", emoji: '🏫' },
      { text: "I will meet my teacher.", emoji: '👩‍🏫' },
      { text: "There will be other kids in my class.", emoji: '👧👦' },
      { text: "I can say 'hello' to make new friends.", emoji: '👋' },
      { text: "If I feel nervous, I can take deep breaths.", emoji: '🌬️' },
      { text: "School can be fun!", emoji: '🎉' },
    ]
  },
  {
    id: 'restaurant',
    title: 'Eating at a Restaurant',
    emoji: '🍽️',
    color: '#F5A623',
    pages: [
      { text: "Today we're going to a restaurant.", emoji: '🍽️' },
      { text: "We'll wait to be seated at a table.", emoji: '🪑' },
      { text: "A server will bring us menus.", emoji: '📋' },
      { text: "I can choose what I want to eat.", emoji: '🤔' },
      { text: "I'll use my inside voice.", emoji: '🤫' },
      { text: "Eating out can be a fun treat!", emoji: '😊' },
    ]
  },
  {
    id: 'dentist',
    title: 'Going to the Dentist',
    emoji: '🦷',
    color: '#8E6BBF',
    pages: [
      { text: "Today I'm going to the dentist.", emoji: '🦷' },
      { text: "I'll sit in a big chair that moves.", emoji: '💺' },
      { text: "There will be bright lights above me.", emoji: '💡' },
      { text: "The dentist will count my teeth.", emoji: '🔢' },
      { text: "I'll open my mouth wide like a hippo!", emoji: '🦛' },
      { text: "Clean teeth help me stay healthy!", emoji: '✨' },
    ]
  },
];

const STORAGE_KEY = 'snw_social_stories';

// Speak function
const speak = (text) => {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  }
};

// Story Card
const StoryCard = ({ story, onClick, onDelete, isCustom }) => (
  <button
    onClick={() => onClick(story)}
    className="w-full p-4 rounded-2xl text-left transition-all hover:scale-[1.02] shadow-md hover:shadow-lg bg-white group"
    style={{ borderLeft: `4px solid ${story.color}` }}
  >
    <div className="flex items-center gap-3">
      <span className="text-4xl">{story.emoji}</span>
      <div className="flex-1">
        <h3 className="font-display text-gray-800">{story.title}</h3>
        <p className="text-xs text-gray-500 font-crayon">{story.pages?.length || 0} pages</p>
      </div>
      {isCustom && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(story.id); }}
          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 rounded-full transition-all"
        >
          <Trash2 size={16} className="text-red-400" />
        </button>
      )}
      <ChevronRight size={20} className="text-gray-400" />
    </div>
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
          {/* IMPORTANT: Back button goes to /wellness (parent hub) */}
          <button
            onClick={() => navigate('/wellness')}
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
