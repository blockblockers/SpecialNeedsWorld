// SocialStories.jsx - Social Stories for ATLASassist
// UPDATED: Added Community Stories browser with user-created stories
// UPDATED: JWT authentication enabled - requires login for AI story creation
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
  Users,
  Globe,
  Heart,
  TrendingUp,
  Filter,
  LogIn,
} from 'lucide-react';
import { 
  addActivityToSchedule, 
  SCHEDULE_SOURCES, 
  getToday,
  formatDateDisplay,
  formatTimeDisplay 
} from '../services/scheduleHelper';
import { useToast } from '../components/ThemedToast';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { useAuth } from '../App';

// ============================================
// CONSTANTS
// ============================================

const STORY_CATEGORIES = [
  { id: 'all', name: 'All Stories', emoji: '📚', color: '#4A9FD4' },
  { id: 'daily', name: 'Daily Routines', emoji: '🌅', color: '#5CB85C' },
  { id: 'social', name: 'Social Situations', emoji: '👋', color: '#4A9FD4' },
  { id: 'emotions', name: 'Managing Emotions', emoji: '💜', color: '#8E6BBF' },
  { id: 'safety', name: 'Safety', emoji: '🛡️', color: '#E63B2E' },
  { id: 'school', name: 'School', emoji: '🎒', color: '#F5A623' },
  { id: 'health', name: 'Health & Body', emoji: '🏥', color: '#20B2AA' },
  { id: 'general', name: 'Other', emoji: '📖', color: '#6B7280' },
];

// Pre-built stories for offline/fallback
const BUILT_IN_STORIES = [
  {
    id: 'brushing-teeth',
    topic: 'Brushing My Teeth',
    category: 'daily',
    emoji: '🦷',
    is_public: true,
    use_count: 100,
    pages: [
      { pageNumber: 1, text: 'Every morning and night, you brush your teeth.', imageDescription: 'Toothbrush and toothpaste' },
      { pageNumber: 2, text: 'You put a small amount of toothpaste on your toothbrush.', imageDescription: 'Putting toothpaste on brush' },
      { pageNumber: 3, text: 'You brush all your teeth - front, back, and top.', imageDescription: 'Child brushing teeth' },
      { pageNumber: 4, text: 'You brush for about 2 minutes. You can count or sing a song!', imageDescription: 'Timer showing 2 minutes' },
      { pageNumber: 5, text: 'Then you spit and rinse with water.', imageDescription: 'Rinsing mouth' },
      { pageNumber: 6, text: 'Clean teeth make you feel good! Great job!', imageDescription: 'Smiling with clean teeth' },
    ],
  },
  {
    id: 'waiting-turn',
    topic: 'Waiting My Turn',
    category: 'social',
    emoji: '⏳',
    is_public: true,
    use_count: 85,
    pages: [
      { pageNumber: 1, text: 'Sometimes you need to wait your turn.', imageDescription: 'Children in line' },
      { pageNumber: 2, text: 'Other people want a turn too. That is okay.', imageDescription: 'Multiple children waiting' },
      { pageNumber: 3, text: 'While waiting, you can take deep breaths.', imageDescription: 'Child breathing calmly' },
      { pageNumber: 4, text: 'You can think about something fun while you wait.', imageDescription: 'Child thinking happy thoughts' },
      { pageNumber: 5, text: 'When it is your turn, you will feel proud for waiting!', imageDescription: 'Happy child getting their turn' },
    ],
  },
  {
    id: 'going-to-doctor',
    topic: 'Going to the Doctor',
    category: 'health',
    emoji: '👨‍⚕️',
    is_public: true,
    use_count: 72,
    pages: [
      { pageNumber: 1, text: 'Sometimes you need to visit the doctor.', imageDescription: 'Doctor office building' },
      { pageNumber: 2, text: 'The doctor helps keep you healthy and safe.', imageDescription: 'Friendly doctor' },
      { pageNumber: 3, text: 'A nurse might check your height and weight.', imageDescription: 'Nurse with scale' },
      { pageNumber: 4, text: 'The doctor will look at your ears, eyes, and throat.', imageDescription: 'Doctor examining child' },
      { pageNumber: 5, text: 'If you feel scared, you can squeeze a hand or take deep breaths.', imageDescription: 'Child holding parent hand' },
      { pageNumber: 6, text: 'After the visit, you did a great job! The doctor helps you stay healthy.', imageDescription: 'Happy child leaving doctor' },
    ],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const categorizeStory = (topic) => {
  const topicLower = topic.toLowerCase();
  
  if (topicLower.includes('bath') || topicLower.includes('shower') || topicLower.includes('brush') || 
      topicLower.includes('toilet') || topicLower.includes('potty') || topicLower.includes('wash') ||
      topicLower.includes('morning') || topicLower.includes('bedtime') || topicLower.includes('routine')) {
    return { category: 'daily', emoji: '🌅' };
  }
  if (topicLower.includes('friend') || topicLower.includes('play') || topicLower.includes('share') ||
      topicLower.includes('turn') || topicLower.includes('hello') || topicLower.includes('meet') ||
      topicLower.includes('party') || topicLower.includes('birthday')) {
    return { category: 'social', emoji: '👋' };
  }
  if (topicLower.includes('angry') || topicLower.includes('sad') || topicLower.includes('scared') ||
      topicLower.includes('worry') || topicLower.includes('feel') || topicLower.includes('calm') ||
      topicLower.includes('happy') || topicLower.includes('emotion')) {
    return { category: 'emotions', emoji: '💜' };
  }
  if (topicLower.includes('safe') || topicLower.includes('stranger') || topicLower.includes('emergency') ||
      topicLower.includes('fire') || topicLower.includes('police') || topicLower.includes('lost')) {
    return { category: 'safety', emoji: '🛡️' };
  }
  if (topicLower.includes('school') || topicLower.includes('class') || topicLower.includes('teacher') ||
      topicLower.includes('homework') || topicLower.includes('bus') || topicLower.includes('learn')) {
    return { category: 'school', emoji: '🎒' };
  }
  if (topicLower.includes('doctor') || topicLower.includes('dentist') || topicLower.includes('hospital') ||
      topicLower.includes('medicine') || topicLower.includes('shot') || topicLower.includes('sick') ||
      topicLower.includes('haircut')) {
    return { category: 'health', emoji: '🏥' };
  }
  
  return { category: 'general', emoji: '📖' };
};

// Generate a simple fallback story locally
const generateLocalStory = (topic) => {
  const { category, emoji } = categorizeStory(topic);
  return {
    id: `local_${Date.now()}`,
    topic,
    topic_normalized: topic.toLowerCase().trim(),
    category,
    emoji,
    is_public: false,
    use_count: 1,
    created_at: new Date().toISOString(),
    pages: [
      { pageNumber: 1, text: `Today you will learn about ${topic}.`, imageDescription: 'Introduction scene' },
      { pageNumber: 2, text: `${topic} is something many people do.`, imageDescription: 'People doing the activity' },
      { pageNumber: 3, text: 'It is okay to feel a little nervous about new things.', imageDescription: 'Child feeling uncertain' },
      { pageNumber: 4, text: 'You can take your time and go at your own pace.', imageDescription: 'Taking it slow' },
      { pageNumber: 5, text: 'If you need help, you can ask someone you trust.', imageDescription: 'Asking for help' },
      { pageNumber: 6, text: `Great job learning about ${topic}! You did it!`, imageDescription: 'Celebration' },
    ],
  };
};

// ============================================
// MAIN COMPONENT
// ============================================

const SocialStories = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // View state
  const [view, setView] = useState('browse'); // browse, create, reading, community
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Story data
  const [stories, setStories] = useState(BUILT_IN_STORIES);
  const [communityStories, setCommunityStories] = useState([]);
  const [savedStories, setSavedStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingCommunity, setLoadingCommunity] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');
  
  // Create story state
  const [newTopic, setNewTopic] = useState('');
  
  // TTS state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  
  // Schedule modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(getToday());
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduleNotify, setScheduleNotify] = useState(true);

  // ============================================
  // DATA LOADING
  // ============================================
  
  useEffect(() => {
    loadStories();
    loadSavedStories();
  }, [user]);

  const loadStories = async () => {
    if (!isSupabaseConfigured()) return;
    
    setLoading(true);
    try {
      // Load popular public stories
      const { data, error } = await supabase
        .from('social_stories')
        .select('*')
        .eq('is_public', true)
        .order('use_count', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Merge with built-in stories, avoiding duplicates
        const allStories = [...BUILT_IN_STORIES];
        data.forEach(story => {
          if (!allStories.find(s => s.id === story.id || s.topic?.toLowerCase() === story.topic?.toLowerCase())) {
            allStories.push(story);
          }
        });
        setStories(allStories);
      }
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCommunityStories = async () => {
    if (!isSupabaseConfigured()) return;
    
    setLoadingCommunity(true);
    try {
      // Load user-created public stories, sorted by newest
      const { data, error } = await supabase
        .from('social_stories')
        .select('*')
        .eq('is_public', true)
        .not('created_by', 'is', null) // Only user-created stories
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      setCommunityStories(data || []);
    } catch (error) {
      console.error('Error loading community stories:', error);
    } finally {
      setLoadingCommunity(false);
    }
  };

  const loadSavedStories = async () => {
    if (!isSupabaseConfigured() || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_saved_stories')
        .select('story_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setSavedStories(data?.map(d => d.story_id) || []);
    } catch (error) {
      console.error('Error loading saved stories:', error);
    }
  };

  // ============================================
  // STORY GENERATION
  // ============================================

  const generateStory = async () => {
    // Require login for AI generation
    if (!user) {
      showToast('Please sign in to create custom stories', 'info');
      navigate('/login');
      return;
    }

    if (!newTopic.trim()) {
      showToast('Please enter a topic for your story', 'error');
      return;
    }

    setGenerating(true);
    setGenerationStatus('Checking for existing stories...');

    try {
      // First check if story already exists
      if (isSupabaseConfigured()) {
        const { data: existingStories, error: searchError } = await supabase
          .from('social_stories')
          .select('*')
          .ilike('topic_normalized', newTopic.toLowerCase().trim())
          .limit(1);

        // Check if we found an existing story (ignore errors, just continue)
        if (!searchError && existingStories && existingStories.length > 0) {
          const existing = existingStories[0];
          setGenerationStatus('Found existing story!');
          setSelectedStory(existing);
          setCurrentPage(0);
          setView('reading');
          setGenerating(false);
          showToast('Found an existing story on this topic!', 'success');
          return;
        }
      }

      setGenerationStatus('Creating your story with AI...');

      // Call Edge Function
      if (isSupabaseConfigured()) {
        // Get the current session for auth token
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          showToast('Session expired. Please sign in again.', 'error');
          navigate('/login');
          return;
        }

        const { data, error } = await supabase.functions.invoke('generate-social-story', {
          body: { topic: newTopic.trim(), pageCount: 6 },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (error) {
          console.error('Edge function error:', error);
          throw new Error(error.message || 'Failed to generate story');
        }

        if (data.error) {
          throw new Error(data.error);
        }

        setGenerationStatus('Saving to library...');

        // Save to database
        const { category, emoji } = categorizeStory(newTopic);
        const storyData = {
          topic: newTopic.trim(),
          topic_normalized: newTopic.toLowerCase().trim(),
          pages: data.pages,
          category: data.category || category,
          emoji: data.emoji || emoji,
          is_public: true,
          created_by: user?.id || null,
          use_count: 1,
        };

        const { data: savedStory, error: saveError } = await supabase
          .from('social_stories')
          .insert(storyData)
          .select()
          .single();

        if (saveError) {
          console.error('Save error:', saveError);
          // Still show the story even if save fails
          setSelectedStory({ ...storyData, id: `temp_${Date.now()}`, pages: data.pages });
        } else {
          setSelectedStory(savedStory);
          // Refresh stories list
          loadStories();
        }

        setCurrentPage(0);
        setView('reading');
        showToast('Story created successfully!', 'success');
      } else {
        // Fallback to local generation
        const localStory = generateLocalStory(newTopic);
        setSelectedStory(localStory);
        setCurrentPage(0);
        setView('reading');
        showToast('Story created (offline mode)', 'success');
      }
    } catch (error) {
      console.error('Error generating story:', error);
      
      const errorMessage = error?.message || 'Unknown error';
      
      // Check for specific error types
      if (errorMessage.includes('401') || errorMessage.includes('authentication') || errorMessage.includes('unauthorized')) {
        showToast('Session expired. Please sign in again.', 'error');
        setGenerating(false);
        setGenerationStatus('');
        navigate('/login');
        return;
      } else if (errorMessage.includes('API key')) {
        showToast('API key not configured. Using fallback story.', 'warning');
      } else {
        showToast(`Error: ${errorMessage}`, 'error');
      }
      
      // Use local fallback for any error
      const localStory = generateLocalStory(newTopic);
      setSelectedStory(localStory);
      setCurrentPage(0);
      setView('reading');
    } finally {
      setGenerating(false);
      setGenerationStatus('');
      setNewTopic('');
    }
  };

  // ============================================
  // STORY ACTIONS
  // ============================================

  const openStory = async (story) => {
    setSelectedStory(story);
    setCurrentPage(0);
    setView('reading');

    // Increment use count
    if (isSupabaseConfigured() && story.id && !story.id.startsWith('temp_') && !story.id.startsWith('local_')) {
      try {
        await supabase
          .from('social_stories')
          .update({ use_count: (story.use_count || 0) + 1 })
          .eq('id', story.id);
      } catch (e) {
        console.error('Error updating use count:', e);
      }
    }
  };

  const toggleSaveStory = async (storyId) => {
    if (!user) {
      showToast('Please sign in to save stories', 'info');
      return;
    }

    const isSaved = savedStories.includes(storyId);

    try {
      if (isSaved) {
        await supabase
          .from('user_saved_stories')
          .delete()
          .eq('user_id', user.id)
          .eq('story_id', storyId);
        setSavedStories(prev => prev.filter(id => id !== storyId));
        showToast('Removed from favorites', 'success');
      } else {
        await supabase
          .from('user_saved_stories')
          .insert({ user_id: user.id, story_id: storyId });
        setSavedStories(prev => [...prev, storyId]);
        showToast('Added to favorites!', 'success');
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      showToast('Failed to update favorites', 'error');
    }
  };

  // ============================================
  // TEXT TO SPEECH
  // ============================================

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        // Auto-advance if autoPlay is on
        if (autoPlay && selectedStory && currentPage < selectedStory.pages.length - 1) {
          setTimeout(() => setCurrentPage(prev => prev + 1), 500);
        }
      };
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    if (autoPlay && selectedStory && view === 'reading') {
      const pageText = selectedStory.pages[currentPage]?.text;
      if (pageText) {
        speak(pageText);
      }
    }
  }, [currentPage, autoPlay, selectedStory, view]);

  // ============================================
  // SCHEDULE INTEGRATION
  // ============================================

  const handleAddToSchedule = () => {
    if (!selectedStory) return;

    const result = addActivityToSchedule({
      date: scheduleDate,
      name: `Read: ${selectedStory.topic}`,
      time: scheduleTime || null,
      emoji: selectedStory.emoji || '📖',
      source: SCHEDULE_SOURCES.SOCIAL_STORY,
      notify: scheduleNotify && !!scheduleTime,
      metadata: { storyId: selectedStory.id },
    });

    if (result.success) {
      showToast('Added to schedule!', 'success');
      setShowScheduleModal(false);
    } else {
      showToast('Failed to add to schedule', 'error');
    }
  };

  // ============================================
  // FILTER STORIES
  // ============================================

  const filteredStories = stories.filter(story => {
    const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      story.topic?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredCommunityStories = communityStories.filter(story => {
    const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      story.topic?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ============================================
  // RENDER: BROWSE VIEW
  // ============================================

  const renderBrowseView = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-3 border-gray-200 font-crayon
                     focus:border-[#8E6BBF] focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {STORY_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full font-crayon text-sm transition-all
                ${selectedCategory === cat.id
                  ? 'text-white shadow-md'
                  : 'bg-white border-2 text-gray-600 hover:border-gray-300'
                }`}
              style={selectedCategory === cat.id ? { backgroundColor: cat.color } : { borderColor: '#E5E7EB' }}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Create New Button - Login Required */}
      {user ? (
        <button
          onClick={() => setView('create')}
          className="w-full py-4 bg-gradient-to-r from-[#8E6BBF] to-purple-500 text-white 
                   rounded-2xl font-display text-lg shadow-lg hover:scale-[1.02] transition-transform
                   flex items-center justify-center gap-2"
        >
          <Wand2 size={24} />
          Create Custom Story with AI
        </button>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 bg-gray-100 border-3 border-gray-300 text-gray-600
                   rounded-2xl font-display text-lg transition-all hover:bg-gray-200
                   flex items-center justify-center gap-2"
        >
          <LogIn size={24} />
          Sign In to Create Custom Stories
        </button>
      )}

      {/* Community Stories Button */}
      <button
        onClick={() => {
          setView('community');
          loadCommunityStories();
        }}
        className="w-full py-3 bg-white border-3 border-[#4A9FD4] text-[#4A9FD4]
                 rounded-xl font-crayon hover:bg-blue-50 transition-all
                 flex items-center justify-center gap-2"
      >
        <Globe size={20} />
        Browse Community Stories ({communityStories.length || '...'})
      </button>

      {/* Stories Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="animate-spin text-[#8E6BBF]" />
        </div>
      ) : filteredStories.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="font-crayon text-gray-500">No stories found</p>
          {user ? (
            <button
              onClick={() => setView('create')}
              className="mt-4 text-[#8E6BBF] underline font-crayon"
            >
              Create one!
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="mt-4 text-[#8E6BBF] underline font-crayon"
            >
              Sign in to create one!
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredStories.map(story => (
            <button
              key={story.id}
              onClick={() => openStory(story)}
              className="bg-white rounded-2xl border-3 p-4 text-left transition-all
                       hover:scale-[1.02] hover:shadow-lg relative"
              style={{ borderColor: STORY_CATEGORIES.find(c => c.id === story.category)?.color || '#E5E7EB' }}
            >
              <div className="text-3xl mb-2">{story.emoji || '📖'}</div>
              <h3 className="font-display text-gray-800 text-sm leading-tight mb-1">
                {story.topic}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{story.pages?.length || 0} pages</span>
                {story.use_count > 10 && (
                  <span className="flex items-center gap-1">
                    <TrendingUp size={12} />
                    Popular
                  </span>
                )}
              </div>
              {savedStories.includes(story.id) && (
                <Heart size={16} className="absolute top-2 right-2 text-red-400 fill-red-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // ============================================
  // RENDER: COMMUNITY VIEW
  // ============================================

  const renderCommunityView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setView('browse')}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="font-display text-xl text-[#4A9FD4]">Community Stories</h2>
          <p className="font-crayon text-sm text-gray-500">Stories created by other users</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {STORY_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full font-crayon text-sm transition-all
              ${selectedCategory === cat.id
                ? 'text-white shadow-md'
                : 'bg-white border-2 text-gray-600 hover:border-gray-300'
              }`}
            style={selectedCategory === cat.id ? { backgroundColor: cat.color } : { borderColor: '#E5E7EB' }}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {/* Community Stories List */}
      {loadingCommunity ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="animate-spin text-[#4A9FD4]" />
        </div>
      ) : filteredCommunityStories.length === 0 ? (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="font-crayon text-gray-500">No community stories yet</p>
          {user ? (
            <button
              onClick={() => setView('create')}
              className="mt-4 text-[#8E6BBF] underline font-crayon"
            >
              Be the first to create one!
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="mt-4 text-[#8E6BBF] underline font-crayon"
            >
              Sign in to create one!
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCommunityStories.map(story => (
            <button
              key={story.id}
              onClick={() => openStory(story)}
              className="w-full bg-white rounded-xl border-3 border-gray-200 p-4 text-left
                       hover:border-[#4A9FD4] transition-all flex items-center gap-4"
            >
              <div className="text-3xl">{story.emoji || '📖'}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-gray-800 truncate">{story.topic}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span>{story.pages?.length || 0} pages</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(story.created_at).toLocaleDateString()}
                  </span>
                  {story.use_count > 0 && (
                    <span>Read {story.use_count}x</span>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveStory(story.id);
                }}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Heart 
                  size={20} 
                  className={savedStories.includes(story.id) ? 'text-red-400 fill-red-400' : 'text-gray-300'}
                />
              </button>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // ============================================
  // RENDER: CREATE VIEW
  // ============================================

  const renderCreateView = () => {
    // Double-check user is logged in
    if (!user) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('browse')}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="font-display text-xl text-[#8E6BBF]">Create Custom Story</h2>
              <p className="font-crayon text-sm text-gray-500">Sign in required</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-3 border-gray-200 p-8 text-center">
            <LogIn size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-display text-lg text-gray-700 mb-2">Sign In Required</h3>
            <p className="font-crayon text-gray-500 mb-6">
              Please sign in to create custom stories with AI
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-[#8E6BBF] text-white rounded-xl font-display
                       hover:bg-purple-600 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('browse')}
            className="p-2 rounded-lg hover:bg-gray-100"
            disabled={generating}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-display text-xl text-[#8E6BBF]">Create Custom Story</h2>
            <p className="font-crayon text-sm text-gray-500">AI will write a story just for you</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-3 border-[#8E6BBF] p-6 space-y-4">
          <div>
            <label className="block font-crayon text-gray-700 mb-2">What is the story about?</label>
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="e.g., Going to the grocery store"
              disabled={generating}
              className="w-full px-4 py-3 rounded-xl border-3 border-gray-200 font-crayon
                       focus:border-[#8E6BBF] focus:outline-none disabled:bg-gray-100"
            />
          </div>

          {/* Suggestions */}
          <div>
            <p className="font-crayon text-sm text-gray-500 mb-2">Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {['Getting a haircut', 'Fire drill at school', 'Making new friends', 'Going to a restaurant'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setNewTopic(suggestion)}
                  disabled={generating}
                  className="px-3 py-1 bg-purple-50 text-[#8E6BBF] rounded-full font-crayon text-sm
                           hover:bg-purple-100 transition-colors disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateStory}
            disabled={generating || !newTopic.trim()}
            className="w-full py-4 bg-gradient-to-r from-[#8E6BBF] to-purple-500 text-white 
                     rounded-xl font-display text-lg shadow-lg hover:scale-[1.02] transition-transform
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                {generationStatus || 'Creating...'}
              </>
            ) : (
              <>
                <Sparkles size={24} />
                Create Story
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 font-crayon">
            Stories are shared with the community to help others
          </p>
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER: READING VIEW
  // ============================================

  const renderReadingView = () => {
    if (!selectedStory) return null;

    const page = selectedStory.pages[currentPage];
    const totalPages = selectedStory.pages.length;
    const isLastPage = currentPage === totalPages - 1;
    const isFirstPage = currentPage === 0;

    return (
      <div className="space-y-4">
        {/* Story Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              stopSpeaking();
              setView('browse');
              setSelectedStory(null);
            }}
            className="flex items-center gap-2 text-[#8E6BBF] font-crayon"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveStory(selectedStory.id)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Heart 
                size={20} 
                className={savedStories.includes(selectedStory.id) ? 'text-red-400 fill-red-400' : 'text-gray-400'}
              />
            </button>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <CalendarPlus size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Story Title */}
        <h2 className="text-xl font-display text-center text-[#8E6BBF]">
          {selectedStory.emoji} {selectedStory.topic}
        </h2>

        {/* Story Page */}
        <div className="bg-white rounded-3xl border-4 border-[#8E6BBF] p-6 min-h-[300px] flex flex-col items-center justify-center">
          {/* Page Image/Emoji */}
          <div className="text-6xl mb-6">
            {page.emoji || selectedStory.emoji || '📖'}
          </div>

          {/* Page Text */}
          <p className="text-xl font-crayon text-center text-gray-800 leading-relaxed">
            {page.text}
          </p>
        </div>

        {/* Progress */}
        <div className="flex justify-center gap-1">
          {selectedStory.pages.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentPage ? 'bg-[#8E6BBF] scale-125' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={isFirstPage}
            className="p-3 rounded-full bg-gray-100 text-gray-600 disabled:opacity-30"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => isSpeaking ? stopSpeaking() : speak(page.text)}
              className={`p-3 rounded-full ${isSpeaking ? 'bg-[#8E6BBF] text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`p-3 rounded-full ${autoPlay ? 'bg-[#5CB85C] text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {autoPlay ? <Pause size={24} /> : <Play size={24} />}
            </button>
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={isLastPage}
            className="p-3 rounded-full bg-[#8E6BBF] text-white disabled:opacity-30"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 font-crayon">
          Page {currentPage + 1} of {totalPages}
        </p>
      </div>
    );
  };

  // ============================================
  // RENDER: SCHEDULE MODAL
  // ============================================

  const renderScheduleModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFEF5] w-full max-w-sm rounded-3xl overflow-hidden border-4 border-[#8E6BBF]">
        <div className="bg-[#8E6BBF] text-white p-4 flex items-center justify-between">
          <h3 className="font-display text-lg flex items-center gap-2">
            <CalendarPlus size={20} />
            Add to Schedule
          </h3>
          <button onClick={() => setShowScheduleModal(false)} className="p-1 hover:bg-white/20 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block font-crayon text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-3 border-gray-200 font-crayon"
            />
          </div>

          <div>
            <label className="block font-crayon text-gray-700 mb-2">Time (optional)</label>
            <input
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-3 border-gray-200 font-crayon"
            />
          </div>

          {scheduleTime && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={scheduleNotify}
                onChange={(e) => setScheduleNotify(e.target.checked)}
                className="w-5 h-5 rounded"
              />
              <span className="font-crayon text-gray-700">Send reminder notification</span>
            </label>
          )}

          <button
            onClick={handleAddToSchedule}
            className="w-full py-3 bg-[#8E6BBF] text-white rounded-xl font-display
                     hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Add to Schedule
          </button>
        </div>
      </div>
    </div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================

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
            <h1 className="text-lg sm:text-xl font-display text-[#8E6BBF] crayon-text">
              📖 Social Stories
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {view === 'browse' && renderBrowseView()}
        {view === 'community' && renderCommunityView()}
        {view === 'create' && renderCreateView()}
        {view === 'reading' && renderReadingView()}
      </main>

      {/* Schedule Modal */}
      {showScheduleModal && renderScheduleModal()}
    </div>
  );
};

export default SocialStories;
