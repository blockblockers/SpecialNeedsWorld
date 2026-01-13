// CommunityThread.jsx - View thread and replies
// Includes reply functionality and report button

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send,
  MessageCircle,
  Clock,
  Flag,
  MoreVertical,
  Trash2,
  Edit2,
  X,
  AlertTriangle,
  Check,
  Link as LinkIcon
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../App';
import { CATEGORIES, getAvatar, REPORT_REASONS } from '../data/communityAvatars';

const CommunityThread = () => {
  const navigate = useNavigate();
  const { threadId } = useParams();
  const { user, isGuest } = useAuth();
  
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState(null); // { type: 'thread' | 'reply', id: string }
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  // Load thread and replies
  const loadThread = useCallback(async () => {
    try {
      // Load thread
      const { data: threadData, error: threadError } = await supabase
        .from('community_threads')
        .select('*')
        .eq('id', threadId)
        .single();

      if (threadError) throw threadError;

      // Load replies
      const { data: repliesData, error: repliesError } = await supabase
        .from('community_replies')
        .select('*')
        .eq('thread_id', threadId)
        .eq('is_hidden', false)
        .order('created_at', { ascending: true });

      if (repliesError) throw repliesError;
      
      // Get all user IDs
      const userIds = [
        threadData?.user_id,
        ...(repliesData?.map(r => r.user_id) || [])
      ].filter(Boolean);
      const uniqueUserIds = [...new Set(userIds)];
      
      // Fetch profiles
      let profilesMap = {};
      if (uniqueUserIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('community_profiles')
          .select('user_id, display_name, avatar_id')
          .in('user_id', uniqueUserIds);
        
        if (profilesData) {
          profilesMap = profilesData.reduce((acc, p) => {
            acc[p.user_id] = p;
            return acc;
          }, {});
        }
      }
      
      // Attach profile to thread
      setThread({
        ...threadData,
        community_profiles: profilesMap[threadData.user_id] || null
      });
      
      // Attach profiles to replies
      setReplies(repliesData?.map(r => ({
        ...r,
        community_profiles: profilesMap[r.user_id] || null
      })) || []);

      // Increment view count
      await supabase
        .from('community_threads')
        .update({ view_count: (threadData.view_count || 0) + 1 })
        .eq('id', threadId);

    } catch (error) {
      console.error('Error loading thread:', error);
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    loadThread();
  }, [loadThread]);

  // Format time
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Submit reply
  const handleSubmitReply = async () => {
    if (!replyContent.trim() || isGuest || !user) return;
    if (replyContent.length < 2 || replyContent.length > 2000) return;

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('community_replies')
        .insert({
          thread_id: threadId,
          user_id: user.id,
          content: replyContent.trim(),
        });

      if (error) throw error;

      // Update thread reply_count and last_activity_at
      await supabase
        .from('community_threads')
        .update({ 
          reply_count: (thread?.reply_count || 0) + 1,
          last_activity_at: new Date().toISOString()
        })
        .eq('id', threadId);

      setReplyContent('');
      loadThread(); // Reload to show new reply
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Failed to post reply. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete reply
  const handleDeleteReply = async (replyId) => {
    if (!confirm('Delete this reply?')) return;

    try {
      const { error } = await supabase
        .from('community_replies')
        .delete()
        .eq('id', replyId);

      if (error) throw error;

      // Update thread reply_count
      await supabase
        .from('community_threads')
        .update({ 
          reply_count: Math.max((thread?.reply_count || 1) - 1, 0)
        })
        .eq('id', threadId);

      loadThread();
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
    setOpenMenu(null);
  };

  // Delete thread
  const handleDeleteThread = async () => {
    if (!confirm('Delete this entire discussion? This cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('community_threads')
        .delete()
        .eq('id', threadId);

      if (error) throw error;
      navigate('/community');
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
  };

  // Open report modal
  const openReportModal = (type, id) => {
    setReportTarget({ type, id });
    setReportReason('');
    setReportDescription('');
    setReportSuccess(false);
    setShowReportModal(true);
    setOpenMenu(null);
  };

  // Submit report
  const handleSubmitReport = async () => {
    if (!reportReason) return;

    setReportSubmitting(true);

    try {
      const reportData = {
        reporter_id: user?.id || null,
        reason: reportReason,
        description: reportDescription.trim() || null,
      };

      if (reportTarget.type === 'thread') {
        reportData.thread_id = reportTarget.id;
      } else {
        reportData.reply_id = reportTarget.id;
      }

      const { error } = await supabase
        .from('community_reports')
        .insert(reportData);

      if (error) throw error;

      setReportSuccess(true);
      setTimeout(() => {
        setShowReportModal(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setReportSubmitting(false);
    }
  };

  // Render content with clickable links
  const renderContent = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-crayon text-gray-500">Loading discussion...</p>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-xl text-gray-500 mb-4">Discussion not found</p>
          <button
            onClick={() => navigate('/community')}
            className="px-4 py-2 bg-[#E86B9A] text-white rounded-xl font-crayon"
          >
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  const category = CATEGORIES.find(c => c.id === thread.category) || CATEGORIES[0];
  const threadAvatar = thread.community_profiles 
    ? getAvatar(thread.community_profiles.avatar_id)
    : getAvatar('star');
  const threadAuthor = thread.community_profiles?.display_name || 'Anonymous';
  const isThreadOwner = user && thread.user_id === user.id;

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            {reportSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-display text-xl text-gray-800 mb-2">Report Submitted</h3>
                <p className="font-crayon text-gray-600">Thank you for helping keep our community safe.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg text-gray-800 flex items-center gap-2">
                    <Flag size={18} className="text-red-500" />
                    Report Content
                  </h3>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="font-crayon text-sm text-gray-600 mb-4">
                  Why are you reporting this {reportTarget?.type}?
                </p>

                <div className="space-y-2 mb-4">
                  {REPORT_REASONS.map(reason => (
                    <button
                      key={reason.id}
                      onClick={() => setReportReason(reason.id)}
                      className={`w-full p-3 text-left rounded-xl border-2 font-crayon text-sm transition-all
                        ${reportReason === reason.id
                          ? 'border-red-400 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      {reason.name}
                    </button>
                  ))}
                </div>

                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Additional details (optional)"
                  rows={2}
                  maxLength={500}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl font-crayon text-sm
                           focus:border-red-300 focus:outline-none resize-none mb-4"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-crayon"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReport}
                    disabled={!reportReason || reportSubmitting}
                    className="flex-1 py-2 bg-red-500 text-white rounded-xl font-crayon
                             disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>

                <p className="mt-3 font-crayon text-xs text-gray-400 text-center">
                  Reports are reviewed by our team. False reports may result in account action.
                </p>
              </>
            )}
          </div>
        </div>
      )}

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
            <span className={`px-2 py-0.5 rounded-full text-xs font-crayon ${category.color}`}>
              {category.emoji} {category.name}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Thread Content */}
        <div className="bg-white rounded-2xl border-3 border-gray-200 p-4 mb-6">
          {/* Thread Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${threadAvatar.color} rounded-full flex items-center justify-center text-xl`}>
                {threadAvatar.emoji}
              </div>
              <div>
                <span className="font-crayon text-gray-800">{threadAuthor}</span>
                <p className="font-crayon text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} />
                  {formatTime(thread.created_at)}
                </p>
              </div>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === 'thread' ? null : 'thread')}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <MoreVertical size={18} />
              </button>
              
              {openMenu === 'thread' && (
                <div className="absolute right-0 top-8 bg-white rounded-xl border-2 border-gray-200 shadow-lg py-1 z-10 min-w-[150px]">
                  <button
                    onClick={() => openReportModal('thread', thread.id)}
                    className="w-full px-4 py-2 text-left font-crayon text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Flag size={14} />
                    Report
                  </button>
                  {isThreadOwner && (
                    <button
                      onClick={handleDeleteThread}
                      className="w-full px-4 py-2 text-left font-crayon text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Thread Title & Content */}
          <h1 className="font-display text-xl text-gray-800 mb-3">{thread.title}</h1>
          <div className="font-crayon text-gray-700 whitespace-pre-wrap">
            {renderContent(thread.content)}
          </div>

          {/* Thread Stats */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-4 text-gray-400">
            <span className="flex items-center gap-1 text-sm font-crayon">
              <MessageCircle size={16} />
              {thread.reply_count} {thread.reply_count === 1 ? 'reply' : 'replies'}
            </span>
          </div>
        </div>

        {/* Replies */}
        {replies.length > 0 && (
          <div className="mb-6">
            <h2 className="font-display text-lg text-gray-700 mb-3 flex items-center gap-2">
              <MessageCircle size={18} />
              Replies ({replies.length})
            </h2>
            
            <div className="space-y-3">
              {replies.map(reply => {
                const replyAvatar = reply.community_profiles 
                  ? getAvatar(reply.community_profiles.avatar_id)
                  : getAvatar('star');
                const replyAuthor = reply.community_profiles?.display_name || 'Anonymous';
                const isReplyOwner = user && reply.user_id === user.id;

                return (
                  <div key={reply.id} className="bg-white rounded-xl border-2 border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 ${replyAvatar.color} rounded-full flex items-center justify-center text-lg`}>
                          {replyAvatar.emoji}
                        </div>
                        <div>
                          <span className="font-crayon text-sm text-gray-800">{replyAuthor}</span>
                          <p className="font-crayon text-xs text-gray-400">
                            {formatTime(reply.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === reply.id ? null : reply.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        {openMenu === reply.id && (
                          <div className="absolute right-0 top-6 bg-white rounded-xl border-2 border-gray-200 shadow-lg py-1 z-10 min-w-[150px]">
                            <button
                              onClick={() => openReportModal('reply', reply.id)}
                              className="w-full px-4 py-2 text-left font-crayon text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Flag size={14} />
                              Report
                            </button>
                            {isReplyOwner && (
                              <button
                                onClick={() => handleDeleteReply(reply.id)}
                                className="w-full px-4 py-2 text-left font-crayon text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="font-crayon text-gray-700 whitespace-pre-wrap">
                      {renderContent(reply.content)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reply Form */}
        {thread.is_locked ? (
          <div className="bg-gray-100 rounded-xl p-4 text-center">
            <p className="font-crayon text-gray-500">This discussion is locked</p>
          </div>
        ) : user && !isGuest ? (
          <div className="bg-white rounded-2xl border-3 border-gray-200 p-4">
            <h3 className="font-display text-gray-700 mb-3">Add a Reply</h3>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              maxLength={2000}
              className="w-full p-3 border-2 border-gray-200 rounded-xl font-crayon
                       focus:border-[#E86B9A] focus:outline-none resize-none mb-3"
            />
            <div className="flex items-center justify-between">
              <p className="font-crayon text-xs text-gray-400 flex items-center gap-1">
                <LinkIcon size={12} />
                Links allowed • {replyContent.length}/2000
              </p>
              <button
                onClick={handleSubmitReply}
                disabled={submitting || !replyContent.trim() || replyContent.length < 2}
                className="px-4 py-2 bg-[#5CB85C] text-white rounded-xl font-crayon
                         disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? 'Posting...' : (
                  <>
                    <Send size={16} />
                    Reply
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 rounded-xl border-2 border-yellow-200 p-4 text-center">
            <p className="font-crayon text-yellow-800">
              Sign in to join the conversation
            </p>
            <button
              onClick={() => navigate('/settings')}
              className="mt-2 px-4 py-2 bg-yellow-400 text-yellow-900 rounded-lg font-crayon text-sm"
            >
              Sign In
            </button>
          </div>
        )}
      </main>

      {/* Click outside to close menu */}
      {openMenu && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setOpenMenu(null)}
        />
      )}
    </div>
  );
};

export default CommunityThread;
