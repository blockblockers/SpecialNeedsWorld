// SocialStories.jsx - Social Stories creator and viewer
// Generates personalized visual stories to help understand situations

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Sparkles, 
  Search,
  ChevronLeft,
  ChevronRight,
  Heart,
  HeartOff,
  Share2,
  RotateCcw,
  Loader2,
  BookMarked,
  Lightbulb,
  Cloud,
  CloudOff
} from 'lucide-react';
import { useAuth } from '../App';
import {
  generateStory,
  getPopularStories,
  searchStories,
  saveStoryToFavorites,
  removeStoryFromFavorites,
  getUserSavedStories,
  SUGGESTED_TOPICS,
} from '../services/socialStories';
import { searchPictograms, getPictogramUrl } from '../services/arasaac';

// ============================================
// STORY VIEWER COMPONENT
// ============================================

const StoryViewer = ({ story, onClose, onSave, isSaved }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [pictograms, setPictograms] = useState({}); // Cache pictogram IDs by keyword
  const [loadingPictogram, setLoadingPictogram] = useState(false);
  
  if (!story || !story.pages) return null;
  
  const pages = story.pages;
  const totalPages = pages.length;
  const page = pages[currentPage];
  
  // Load pictogram for current page
  useEffect(() => {
    const loadPictogram = async () => {
      const keyword = page?.arasaacKeyword;
      if (!keyword || pictograms[keyword]) return;
      
      setLoadingPictogram(true);
      try {
        const results = await searchPictograms(keyword, 'en');
        if (results && results.length > 0) {
          setPictograms(prev => ({
            ...prev,
            [keyword]: results[0]._id
          }));
        }
      } catch (error) {
        console.error('Error loading pictogram:', error);
      } finally {
        setLoadingPictogram(false);
      }
    };
    
    loadPictogram();
  }, [page, pictograms]);
  
  const goToPage = (newPage) => {
    if (newPage < 0 || newPage >= totalPages || isFlipping) return;
    
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsFlipping(false);
    }, 300);
  };
  
  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  
  // Swipe handlers
  const [touchStart, setTouchStart] = useState(null);
  
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextPage();
      else prevPage();
    }
    
    setTouchStart(null);
  };
  
  // Generate a simple illustration based on page number
  const getPageColor = (pageNum) => {
    const colors = [
      '#FFE5E5', '#E5FFE5', '#E5E5FF', '#FFF5E5', 
      '#F5E5FF', '#E5FFF5', '#FFE5F5', '#F5FFE5'
    ];
    return colors[pageNum % colors.length];
  };
  
  // Get emoji for the page - use page's emoji or fallback
  const getPageEmoji = (page, pageNum, total) => {
    // If the page has an emoji, use it
    if (page?.emoji) return page.emoji;
    
    // Fallback emojis based on position
    if (pageNum === 0) return '📖';
    if (pageNum === total - 1) return '🌟';
    const emojis = ['🌈', '✨', '💫', '🎈', '🌻', '🦋'];
    return emojis[(pageNum - 1) % emojis.length];
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full font-crayon text-gray-700"
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              className={`p-2 rounded-full ${
                isSaved ? 'bg-pink-500 text-white' : 'bg-white text-gray-600'
              }`}
            >
              {isSaved ? <Heart size={20} fill="currentColor" /> : <Heart size={20} />}
            </button>
          </div>
        </div>
        
        {/* Book */}
        <div 
          className="relative bg-white rounded-3xl overflow-hidden shadow-2xl"
          style={{ 
            aspectRatio: '4/3',
            perspective: '1000px',
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Page Content */}
          <div 
            className={`absolute inset-0 p-6 sm:p-8 flex flex-col transition-all duration-300 ${
              isFlipping ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
            style={{ backgroundColor: getPageColor(currentPage) }}
          >
            {/* Illustration Area */}
            <div className="flex-1 flex items-center justify-center mb-4">
              <div className="w-full max-w-xs aspect-square bg-white/60 rounded-2xl flex flex-col items-center justify-center p-4 border-4 border-dashed border-white/50">
                {/* Show ARASAAC pictogram if available, otherwise emoji */}
                {page.arasaacKeyword && pictograms[page.arasaacKeyword] ? (
                  <img 
                    src={getPictogramUrl(pictograms[page.arasaacKeyword])}
                    alt={page.imageDescription}
                    className="w-32 h-32 sm:w-40 sm:h-40 object-contain mb-2"
                    onError={(e) => {
                      // Fallback to emoji on error
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : loadingPictogram ? (
                  <div className="w-32 h-32 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <span className="text-6xl sm:text-8xl mb-2">
                    {getPageEmoji(page, currentPage, totalPages)}
                  </span>
                )}
                {/* Hidden emoji fallback */}
                <span className="text-6xl sm:text-8xl mb-2 hidden">
                  {getPageEmoji(page, currentPage, totalPages)}
                </span>
                <p className="text-xs sm:text-sm text-gray-500 text-center font-crayon">
                  {page.imageDescription}
                </p>
              </div>
            </div>
            
            {/* Story Text */}
            <div className="bg-white/80 rounded-2xl p-4 sm:p-6">
              <p className="text-lg sm:text-xl font-display text-gray-800 text-center leading-relaxed">
                {page.text}
              </p>
            </div>
            
            {/* Page Number */}
            <div className="absolute bottom-2 right-4 text-sm font-crayon text-gray-400">
              {currentPage + 1} / {totalPages}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 
                       flex items-center justify-center shadow-lg transition-opacity
                       ${currentPage === 0 ? 'opacity-30' : 'opacity-100 hover:bg-white'}`}
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 
                       flex items-center justify-center shadow-lg transition-opacity
                       ${currentPage === totalPages - 1 ? 'opacity-30' : 'opacity-100 hover:bg-white'}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        {/* Page Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {pages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentPage 
                  ? 'bg-white scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
        
        {/* Story Info */}
        <div className="mt-4 text-center">
          <h3 className="font-display text-white text-lg">{story.topic}</h3>
        </div>
      </div>
    </div>
  );
};

// ============================================
// STORY CARD COMPONENT
// ============================================

const StoryCard = ({ story, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white rounded-2xl border-4 border-[#8E6BBF] p-4 text-left
               hover:shadow-crayon-lg hover:-translate-y-1 transition-all"
    style={{ borderRadius: '15px 225px 15px 255px/255px 15px 225px 15px' }}
  >
    <div className="flex items-start gap-3">
      <div className="w-12 h-12 bg-[#8E6BBF]/20 rounded-xl flex items-center justify-center flex-shrink-0">
        <BookOpen size={24} className="text-[#8E6BBF]" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-gray-800 truncate">{story.topic}</h3>
        <p className="font-crayon text-xs text-gray-500 mt-1">
          {story.pages?.length || 0} pages • {story.use_count || 0} reads
        </p>
      </div>
    </div>
  </button>
);

// ============================================
// MAIN COMPONENT
// ============================================

const SocialStories = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State
  const [view, setView] = useState('home'); // home, create, viewer
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStory, setCurrentStory] = useState(null);
  const [popularStories, setPopularStories] = useState([]);
  const [savedStories, setSavedStories] = useState([]);
  const [savedStoryIds, setSavedStoryIds] = useState(new Set());
  const [error, setError] = useState(null);
  
  // Load popular stories on mount
  useEffect(() => {
    loadPopularStories();
    if (user?.id) {
      loadSavedStories();
    }
  }, [user?.id]);
  
  const loadPopularStories = async () => {
    const stories = await getPopularStories(6);
    setPopularStories(stories);
  };
  
  const loadSavedStories = async () => {
    const stories = await getUserSavedStories(user?.id);
    setSavedStories(stories);
    setSavedStoryIds(new Set(stories.map(s => s.id)));
  };
  
  // Generate or find story
  const handleCreateStory = async (selectedTopic = topic) => {
    if (!selectedTopic.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateStory(selectedTopic, {
        userId: user?.id,
      });
      
      setCurrentStory(result.story);
      setView('viewer');
      
      // Refresh popular stories
      loadPopularStories();
    } catch (err) {
      console.error('Error creating story:', err);
      setError('Failed to create story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Toggle save
  const handleToggleSave = async () => {
    if (!currentStory) return;
    
    const isSaved = savedStoryIds.has(currentStory.id);
    
    if (isSaved) {
      await removeStoryFromFavorites(user?.id, currentStory.id);
      setSavedStoryIds(prev => {
        const next = new Set(prev);
        next.delete(currentStory.id);
        return next;
      });
    } else {
      await saveStoryToFavorites(user?.id, currentStory.id);
      setSavedStoryIds(prev => new Set([...prev, currentStory.id]));
    }
    
    loadSavedStories();
  };
  
  // Open existing story
  const handleOpenStory = (story) => {
    setCurrentStory(story);
    setView('viewer');
  };
  
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => view === 'home' ? navigate('/activities') : setView('home')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                       rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
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
          <h1 className="text-xl sm:text-2xl font-display text-[#8E6BBF] crayon-text flex items-center gap-2">
            📖 Social Stories
          </h1>
          
          {/* Sync Status */}
          <div className="ml-auto flex items-center gap-1">
            {user && !user.isGuest ? (
              <div className="flex items-center gap-1 text-green-600" title="Stories sync across devices">
                <Cloud size={16} />
                <span className="text-xs font-crayon hidden sm:inline">Synced</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-400" title="Sign in to sync">
                <CloudOff size={16} />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {view === 'home' && (
          <div className="space-y-8">
            {/* Sync Info Banner */}
            {user && !user.isGuest && (
              <div className="p-3 bg-green-50 rounded-xl border-2 border-green-200 flex items-center gap-2">
                <Cloud size={18} className="text-green-600" />
                <p className="text-sm text-green-700 font-crayon">
                  ✓ Your saved stories sync across all your devices
                </p>
              </div>
            )}

            {/* Create New Story */}
            <section className="bg-white rounded-3xl border-4 border-[#8E6BBF] p-6 shadow-crayon">
              <h2 className="font-display text-xl text-[#8E6BBF] flex items-center gap-2 mb-4">
                <Sparkles size={24} /> Create a New Story
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="font-crayon text-sm text-gray-600 block mb-1">
                    What would you like a story about?
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Going to the dentist, Making friends..."
                    className="w-full px-4 py-3 rounded-xl border-3 border-[#8E6BBF]/30 
                               font-crayon focus:border-[#8E6BBF] focus:outline-none"
                  />
                </div>
                
                <button
                  onClick={() => handleCreateStory()}
                  disabled={!topic.trim() || isGenerating}
                  className="w-full py-4 bg-[#8E6BBF] text-white rounded-xl font-display text-lg
                             flex items-center justify-center gap-2 disabled:opacity-50
                             hover:bg-[#7B5AA6] transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Creating your story...
                    </>
                  ) : (
                    <>
                      <BookOpen size={20} />
                      Create Story
                    </>
                  )}
                </button>
                
                {error && (
                  <p className="text-red-500 font-crayon text-sm text-center">{error}</p>
                )}
              </div>
            </section>
            
            {/* Suggested Topics */}
            <section>
              <h2 className="font-display text-lg text-gray-700 flex items-center gap-2 mb-3">
                <Lightbulb size={20} className="text-[#F5A623]" /> 
                Suggested Topics
              </h2>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TOPICS.slice(0, 8).map((suggestion) => (
                  <button
                    key={suggestion.topic}
                    onClick={() => {
                      setTopic(suggestion.topic);
                      handleCreateStory(suggestion.topic);
                    }}
                    disabled={isGenerating}
                    className="px-3 py-2 bg-white border-2 border-[#8E6BBF]/30 rounded-full
                               font-crayon text-sm text-gray-700 hover:border-[#8E6BBF]
                               hover:bg-[#8E6BBF]/10 transition-all disabled:opacity-50"
                  >
                    {suggestion.emoji} {suggestion.topic}
                  </button>
                ))}
              </div>
            </section>
            
            {/* Saved Stories */}
            {savedStories.length > 0 && (
              <section>
                <h2 className="font-display text-lg text-gray-700 flex items-center gap-2 mb-3">
                  <Heart size={20} className="text-pink-500" /> 
                  My Saved Stories
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedStories.map((story) => (
                    <StoryCard 
                      key={story.id} 
                      story={story} 
                      onClick={() => handleOpenStory(story)}
                    />
                  ))}
                </div>
              </section>
            )}
            
            {/* Popular Stories */}
            {popularStories.length > 0 && (
              <section>
                <h2 className="font-display text-lg text-gray-700 flex items-center gap-2 mb-3">
                  <BookMarked size={20} className="text-[#4A9FD4]" /> 
                  Popular Stories
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {popularStories.map((story) => (
                    <StoryCard 
                      key={story.id} 
                      story={story} 
                      onClick={() => handleOpenStory(story)}
                    />
                  ))}
                </div>
              </section>
            )}
            
            {/* Info Box */}
            <section className="bg-[#E5F6FF] rounded-2xl p-4 border-3 border-[#4A9FD4]/30">
              <h3 className="font-display text-[#4A9FD4] mb-2">💡 What are Social Stories?</h3>
              <p className="font-crayon text-sm text-gray-600">
                Social Stories are short, personalized stories that help explain everyday situations, 
                events, or activities in a simple, visual way. They were developed to help individuals 
                with autism and other neurodiverse conditions understand what to expect and how to respond.
              </p>
            </section>
          </div>
        )}
      </main>
      
      {/* Story Viewer Modal */}
      {view === 'viewer' && currentStory && (
        <StoryViewer
          story={currentStory}
          onClose={() => setView('home')}
          onSave={handleToggleSave}
          isSaved={savedStoryIds.has(currentStory.id)}
        />
      )}
      
      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
            <div className="w-16 h-16 bg-[#8E6BBF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 size={32} className="text-[#8E6BBF] animate-spin" />
            </div>
            <h3 className="font-display text-xl text-[#8E6BBF] mb-2">Creating Your Story</h3>
            <p className="font-crayon text-gray-600">
              We're crafting a special story just for you. This may take a moment...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialStories;
