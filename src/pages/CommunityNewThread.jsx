// CommunityNewThread.jsx - Create a new discussion thread
// UPDATED: Changed theme color from pink (#E86B9A) to indigo (#6366F1)
// Text and links only - no images

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send,
  AlertCircle,
  Link as LinkIcon
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../App';
import { CATEGORIES } from '../data/communityAvatars';

// Theme color - INDIGO
const THEME_COLOR = '#6366F1';

const CommunityNewThread = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Handle submit
  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (title.length < 5 || title.length > 150) {
      setError('Title must be 5-150 characters');
      return;
    }
    if (!content.trim()) {
      setError('Please enter your message');
      return;
    }
    if (content.length < 10 || content.length > 5000) {
      setError('Message must be 10-5000 characters');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const { data, error: insertError } = await supabase
        .from('community_threads')
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
          category,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Update user's thread count (optional - don't fail if this doesn't work)
      try {
        await supabase
          .from('community_profiles')
          .update({ thread_count: 1 })
          .eq('user_id', user.id);
      } catch (e) {
        // Ignore errors updating thread count
      }

      navigate(`/community/thread/${data.id}`);
    } catch (error) {
      console.error('Error creating thread:', error);
      setError('Failed to create discussion. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4" style={{ borderColor: THEME_COLOR }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/community')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 rounded-xl font-display font-bold transition-all shadow-md"
            style={{ borderColor: THEME_COLOR, color: THEME_COLOR }}
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
          <div className="flex-1">
            <h1 className="text-xl font-display crayon-text" style={{ color: THEME_COLOR }}>
              New Discussion
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Category Selection */}
        <div className="mb-6">
          <label className="block font-crayon text-gray-700 mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-crayon text-sm border-2 transition-all
                  ${category === cat.id
                    ? `${cat.color} scale-105`
                    : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <label className="block font-crayon text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What would you like to discuss?"
            maxLength={150}
            className="w-full px-4 py-3 bg-white rounded-xl border-3 border-gray-200 
                     font-crayon focus:outline-none focus:border-indigo-400"
          />
          <p className="mt-1 text-xs font-crayon text-gray-400 text-right">
            {title.length}/150
          </p>
        </div>

        {/* Content Input */}
        <div className="mb-6">
          <label className="block font-crayon text-gray-700 mb-2">
            Your Message
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, questions, or experiences..."
            maxLength={5000}
            rows={8}
            className="w-full px-4 py-3 bg-white rounded-xl border-3 border-gray-200 
                     font-crayon resize-none focus:outline-none focus:border-indigo-400"
          />
          <p className="mt-1 text-xs font-crayon text-gray-400 text-right">
            {content.length}/5000
          </p>
        </div>

        {/* Link Tip */}
        <div className="mb-6 p-3 bg-indigo-50 rounded-xl border-2 border-indigo-200">
          <div className="flex items-start gap-2">
            <LinkIcon size={16} className="text-indigo-500 flex-shrink-0 mt-0.5" />
            <p className="font-crayon text-xs text-indigo-700">
              You can include links in your message. Just paste the full URL (https://example.com).
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-xl border-2 border-red-200 flex items-center gap-2">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
            <p className="font-crayon text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={saving || !title.trim() || !content.trim()}
          className="w-full py-4 text-white rounded-xl font-display text-lg
                   flex items-center justify-center gap-2 shadow-md
                   disabled:opacity-50 transition-colors"
          style={{ backgroundColor: THEME_COLOR }}
        >
          {saving ? (
            <span className="animate-pulse">Posting...</span>
          ) : (
            <>
              <Send size={20} />
              Post Discussion
            </>
          )}
        </button>

        {/* Content Policy */}
        <p className="mt-4 font-crayon text-xs text-gray-400 text-center">
          By posting, you agree to be respectful and follow our community guidelines.
          No personal information, medical advice, or inappropriate content.
        </p>
      </main>
    </div>
  );
};

export default CommunityNewThread;
