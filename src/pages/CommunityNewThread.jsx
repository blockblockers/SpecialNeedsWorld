// CommunityNewThread.jsx - Create a new discussion thread
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

      // Update user's thread count
      await supabase.rpc('increment_thread_count', { user_id_param: user.id }).catch(() => {
        // If function doesn't exist, update manually
        supabase
          .from('community_profiles')
          .update({ thread_count: supabase.sql`thread_count + 1` })
          .eq('user_id', user.id);
      });

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
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E86B9A]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/community')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E86B9A] 
                       rounded-xl font-display font-bold text-[#E86B9A] hover:bg-[#E86B9A] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-display text-[#E86B9A] crayon-text">
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
            className="w-full p-4 border-3 border-gray-300 rounded-xl font-crayon text-lg
                     focus:border-[#E86B9A] focus:outline-none"
          />
          <p className="font-crayon text-xs text-gray-400 mt-1">
            {title.length}/150 characters
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
            placeholder="Share your thoughts, question, or experience..."
            rows={8}
            maxLength={5000}
            className="w-full p-4 border-3 border-gray-300 rounded-xl font-crayon
                     focus:border-[#E86B9A] focus:outline-none resize-none"
          />
          <div className="flex justify-between mt-1">
            <p className="font-crayon text-xs text-gray-400 flex items-center gap-1">
              <LinkIcon size={12} />
              Links are allowed
            </p>
            <p className="font-crayon text-xs text-gray-400">
              {content.length}/5000 characters
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
          <h3 className="font-display text-blue-700 mb-2 text-sm">💡 Tips for Great Discussions</h3>
          <ul className="font-crayon text-xs text-blue-600 space-y-1">
            <li>• Be specific in your title so others can find it</li>
            <li>• Share enough context for others to understand</li>
            <li>• Ask open-ended questions to encourage responses</li>
            <li>• Be kind and supportive in your language</li>
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-xl border-2 border-red-200 flex items-start gap-2">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="font-crayon text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={saving || !title.trim() || !content.trim()}
          className="w-full py-4 bg-[#5CB85C] text-white rounded-xl border-3 border-green-600
                   font-display text-lg hover:scale-[1.02] transition-transform
                   flex items-center justify-center gap-2 disabled:opacity-50"
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
