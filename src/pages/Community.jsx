// Community.jsx - Community forum hub
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
        .single();

      if (data) {
        setHasProfile(true);
      }
    } catch (error) {
      // No profile yet
    } finally {
      setProfileLoading(false);
    }
  }, [user, isGuest]);

  // Load threads
  const loadThreads = useCallback(async () => {
    setLoading(true);

    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('community_threads')
        .select(`
          *,
          community_profiles!community_threads_user_id_fkey (
            display_name,
            avatar_id
          )
        `)
        .eq('is_hidden', false)
        .order('is_pinned', { ascending: false })
        .order('last_activity_at', { ascending: false })
        .limit(50);

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setThreads(data || []);
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
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get category info
  const getCategoryInfo = (categoryId) => {
    return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
  };

  // Handle create thread
  const handleCreateThread = () => {
    if (isGuest || !user) {
      alert('Please sign in to create a discussion');
      return;
    }
    if (!hasProfile) {
      navigate('/community/profile/setup');
      return;
    }
    navigate('/community/new');
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E86B9A]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E86B9A] 
                       rounded-xl font-display font-bold text-[#E86B9A] hover:bg-[#E86B9A] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Home
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-display text-[#E86B9A] crayon-text flex items-center gap-2">
              <Users size={20} />
              Community
            </h1>
          </div>
          
          {/* Sync Status */}
          {!isGuest && user ? (
            <div className="flex items-center gap-1 text-green-600" title="Connected">
              <Cloud size={16} />
            </div>
          ) : (
            <div className="flex items-center gap-1 text-gray-400" title="Sign in to participate">
              <CloudOff size={16} />
            </div>
          )}

          <button
            onClick={handleCreateThread}
            className="p-2 bg-[#5CB85C] text-white rounded-full border-3 border-green-600
                       hover:scale-110 transition-transform shadow-sm"
          >
            <Plus size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl border-3 border-pink-300 p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-3xl">💝</div>
            <div>
              <h2 className="font-display text-lg text-purple-700">Welcome to Our Community!</h2>
              <p className="font-crayon text-sm text-purple-600">
                A supportive space for parents and caregivers of children with special needs. 
                Share experiences, ask questions, and find encouragement.
              </p>
            </div>
          </div>
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
          <div className="bg-purple-50 rounded-xl border-2 border-purple-200 p-4 mb-4 flex items-center gap-3">
            <Sparkles size={24} className="text-purple-600" />
            <div className="flex-1">
              <p className="font-crayon text-purple-800 text-sm">
                Set up your community profile to start participating!
              </p>
            </div>
            <button
              onClick={() => navigate('/community/profile/setup')}
              className="px-3 py-1.5 bg-purple-500 text-white rounded-lg font-crayon text-sm
                       hover:bg-purple-600 transition-colors"
            >
              Set Up Profile
            </button>
          </div>
        )}

        {/* Search */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions..."
            className="w-full pl-10 pr-4 py-3 bg-white border-3 border-gray-300 rounded-xl font-crayon
                     focus:border-[#E86B9A] focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-6 overflow-x-auto -mx-4 px-4">
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-crayon text-sm border-2 transition-all
                ${selectedCategory === 'all'
                  ? 'bg-[#E86B9A] border-pink-600 text-white'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-pink-400'
                }`}
            >
              All Topics
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-crayon text-sm border-2 transition-all
                  ${selectedCategory === cat.id
                    ? `${cat.color} scale-105`
                    : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="font-crayon text-gray-500">Loading discussions...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && threads.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-display text-xl text-gray-500 mb-2">
              {searchQuery ? 'No discussions found' : 'No discussions yet'}
            </h3>
            <p className="font-crayon text-gray-400 mb-4">
              {searchQuery 
                ? 'Try a different search term'
                : 'Be the first to start a conversation!'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateThread}
                className="px-6 py-3 bg-[#E86B9A] text-white rounded-xl border-3 border-pink-600
                         font-crayon hover:scale-105 transition-transform"
              >
                <Plus size={20} className="inline mr-2" />
                Start a Discussion
              </button>
            )}
          </div>
        )}

        {/* Thread List */}
        {!loading && threads.length > 0 && (
          <div className="space-y-3">
            {threads.map(thread => {
              const category = getCategoryInfo(thread.category);
              const avatar = thread.community_profiles 
                ? getAvatar(thread.community_profiles.avatar_id)
                : getAvatar('star');
              const displayName = thread.community_profiles?.display_name || 'Anonymous';

              return (
                <button
                  key={thread.id}
                  onClick={() => navigate(`/community/thread/${thread.id}`)}
                  className="w-full bg-white rounded-2xl border-3 border-gray-200 p-4 text-left
                           hover:border-[#E86B9A] hover:shadow-md transition-all"
                >
                  {/* Pinned Badge */}
                  {thread.is_pinned && (
                    <div className="flex items-center gap-1 text-yellow-600 mb-2">
                      <Sparkles size={14} />
                      <span className="font-crayon text-xs">Pinned</span>
                    </div>
                  )}

                  {/* Category & Time */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-crayon ${category.color}`}>
                      {category.emoji} {category.name}
                    </span>
                    <span className="text-xs text-gray-400 font-crayon flex items-center gap-1">
                      <Clock size={12} />
                      {formatTime(thread.last_activity_at)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-gray-800 mb-2 line-clamp-2">
                    {thread.title}
                  </h3>

                  {/* Preview */}
                  <p className="font-crayon text-sm text-gray-500 line-clamp-2 mb-3">
                    {thread.content}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 ${avatar.color} rounded-full flex items-center justify-center text-sm`}>
                        {avatar.emoji}
                      </div>
                      <span className="font-crayon text-xs text-gray-600">{displayName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <span className="flex items-center gap-1 text-xs font-crayon">
                        <MessageCircle size={14} />
                        {thread.reply_count}
                      </span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Community Guidelines */}
        <div className="mt-8 p-4 bg-blue-50 rounded-2xl border-3 border-blue-200">
          <h3 className="font-display text-blue-700 mb-2 flex items-center gap-2">
            <Heart size={18} />
            Community Guidelines
          </h3>
          <ul className="font-crayon text-sm text-blue-600 space-y-1">
            <li>• Be kind and supportive to all members</li>
            <li>• Respect privacy - no sharing personal info about others</li>
            <li>• Share experiences, not medical advice</li>
            <li>• Report inappropriate content using the flag button</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Community;
