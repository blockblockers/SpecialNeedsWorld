// Community.jsx - Community forum hub
// UPDATED: Changed theme color from pink (#E86B9A) to indigo (#6366F1)
// UPDATED: Added animated background
// Browse threads, search, create discussions

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus,
  Search,
  MessageCircle,
  Clock,
  User,
  Filter,
  ChevronRight,
  Users,
  Sparkles,
  Cloud,
  CloudOff,
  RefreshCw,
  Heart
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { useAuth } from '../App';
import { CATEGORIES, getAvatar } from '../data/communityAvatars';
import AnimatedBackground from '../components/AnimatedBackground';

// Theme color - INDIGO
const THEME_COLOR = '#6366F1';

const Community = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hasProfile, setHasProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Check if user has a community profile
  const checkProfile = useCallback(async () => {
    if (!user || isGuest) {
      setProfileLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('community_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking profile:', error);
      } else {
        setHasProfile(!!data);
      }
    } catch (err) {
      console.error('Error checking profile:', err);
    } finally {
      setProfileLoading(false);
    }
  }, [user, isGuest]);

  // Load threads
  const loadThreads = useCallback(async () => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('community_threads')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('last_activity_at', { ascending: false })
        .limit(50);

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      const { data: threadsData, error: threadsError } = await query;

      if (threadsError) throw threadsError;

      // Get user profiles for threads
      const userIds = [...new Set(threadsData?.map(t => t.user_id) || [])];
      let profilesMap = {};
      
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('community_profiles')
          .select('user_id, display_name, avatar_id')
          .in('user_id', userIds);
        
        if (profilesData) {
          profilesMap = profilesData.reduce((acc, p) => {
            acc[p.user_id] = p;
            return acc;
          }, {});
        }
      }
      
      // Attach profiles to threads
      const threadsWithProfiles = threadsData?.map(t => ({
        ...t,
        community_profiles: profilesMap[t.user_id] || null
      })) || [];
      
      setThreads(threadsWithProfiles);
    } catch (error) {
      console.error('Error loading threads:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    checkProfile();
    loadThreads();
  }, [checkProfile, loadThreads]);

  // Format relative time
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Get category info
  const getCategoryInfo = (categoryId) => {
    return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5] relative">
      {/* Animated Background */}
      <AnimatedBackground intensity="light" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4" style={{ borderColor: THEME_COLOR }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 rounded-xl font-display font-bold transition-all shadow-md hover:text-white"
            style={{ 
              borderColor: THEME_COLOR, 
              color: THEME_COLOR,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = THEME_COLOR;
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = THEME_COLOR;
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img 
            src="/logo.jpeg" 
            alt="ATLASassist" 
            className="w-10 h-10 rounded-lg shadow-sm"
          />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display crayon-text flex items-center gap-2" style={{ color: THEME_COLOR }}>
              <Users size={24} />
              Communities
            </h1>
          </div>
          {user && !isGuest && hasProfile && (
            <button
              onClick={() => navigate('/community/new')}
              className="p-2 text-white rounded-full transition-colors"
              style={{ backgroundColor: THEME_COLOR }}
            >
              <Plus size={20} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        {/* Description Banner */}
        <div className="mb-6 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={24} />
            <h2 className="text-lg font-display">Communities</h2>
          </div>
          <p className="text-white/90 font-crayon text-sm">
            Share experiences, ask questions, and find encouragement. 
            Connect with other families on the journey. 💜
          </p>
        </div>

        {/* Sign In Prompt for Guests */}
        {(isGuest || !user) && (
          <div className="bg-yellow-50 rounded-xl border-2 border-yellow-200 p-4 mb-4 flex items-center gap-3">
            <User size={24} className="text-yellow-600" />
            <div className="flex-1">
              <p className="font-crayon text-yellow-800 text-sm">
                Sign in to join discussions and share your experiences
              </p>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="px-3 py-1.5 bg-yellow-400 text-yellow-900 rounded-lg font-crayon text-sm
                       hover:bg-yellow-500 transition-colors"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Profile Setup Prompt */}
        {user && !isGuest && !hasProfile && !profileLoading && (
          <div className="bg-indigo-50 rounded-xl border-2 border-indigo-200 p-4 mb-4 flex items-center gap-3">
            <Sparkles size={24} style={{ color: THEME_COLOR }} />
            <div className="flex-1">
              <p className="font-crayon text-indigo-800 text-sm">
                Set up your community profile to start participating!
              </p>
            </div>
            <button
              onClick={() => navigate('/community/profile-setup')}
              className="px-3 py-1.5 text-white rounded-lg font-crayon text-sm transition-colors"
              style={{ backgroundColor: THEME_COLOR }}
            >
              Set Up
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions..."
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border-3 border-gray-200 
                       font-crayon focus:outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full font-crayon text-sm whitespace-nowrap border-2 transition-all
                ${selectedCategory === 'all' 
                  ? 'text-white' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              style={selectedCategory === 'all' ? { backgroundColor: THEME_COLOR, borderColor: THEME_COLOR } : {}}
            >
              All Topics
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full font-crayon text-sm whitespace-nowrap border-2 transition-all
                  ${selectedCategory === cat.id 
                    ? 'text-white' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                style={selectedCategory === cat.id ? { 
                  backgroundColor: cat.color, 
                  borderColor: cat.color 
                } : {}}
              >
                <span>{cat.emoji}</span> {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Threads List */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw size={32} className="mx-auto text-gray-400 animate-spin mb-3" />
            <p className="font-crayon text-gray-500">Loading discussions...</p>
          </div>
        ) : threads.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="font-crayon text-gray-500 mb-2">No discussions yet</p>
            {user && !isGuest && hasProfile && (
              <button
                onClick={() => navigate('/community/new')}
                className="px-4 py-2 text-white rounded-lg font-crayon text-sm transition-colors"
                style={{ backgroundColor: THEME_COLOR }}
              >
                Start the First Discussion
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {threads.map(thread => {
              const category = getCategoryInfo(thread.category);
              const profile = thread.community_profiles;
              const avatar = profile ? getAvatar(profile.avatar_id) : null;
              
              return (
                <button
                  key={thread.id}
                  onClick={() => navigate(`/community/thread/${thread.id}`)}
                  className="w-full bg-white rounded-xl border-3 border-gray-200 p-4 text-left
                           hover:shadow-md transition-all"
                  style={{ '--hover-border': THEME_COLOR }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = THEME_COLOR}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                >
                  <div className="flex gap-3">
                    {/* Avatar */}
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: avatar?.color || THEME_COLOR }}
                    >
                      <span className="text-lg">{avatar?.emoji || '👤'}</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title & Category */}
                      <div className="flex items-start gap-2 mb-1">
                        <h3 className="font-display text-sm text-gray-800 flex-1 line-clamp-2">
                          {thread.is_pinned && <span style={{ color: THEME_COLOR }}>📌 </span>}
                          {thread.title}
                        </h3>
                        <span 
                          className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-crayon text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.emoji}
                        </span>
                      </div>
                      
                      {/* Preview */}
                      <p className="font-crayon text-xs text-gray-500 line-clamp-1 mb-2">
                        {thread.content}
                      </p>
                      
                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs font-crayon text-gray-400">
                        <span>{profile?.display_name || 'Anonymous'}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatTime(thread.last_activity_at || thread.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={12} />
                          {thread.reply_count || 0}
                        </span>
                      </div>
                    </div>
                    
                    <ChevronRight size={20} className="text-gray-400 flex-shrink-0 self-center" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Refresh Button */}
        {!loading && (
          <button
            onClick={loadThreads}
            className="w-full mt-6 py-3 bg-gray-100 rounded-xl font-crayon text-gray-600
                     hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        )}
      </main>
    </div>
  );
};

export default Community;
