// CommunityThread.jsx - View thread and replies
// UPDATED: Changed theme color from pink (#E86B9A) to indigo (#6366F1)
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

// Theme color - INDIGO
const THEME_COLOR = '#6366F1';

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
  const [reportTarget, setReportTarget] = useState(null);
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
      
      // Get thread author profile
      const { data: authorProfile } = await supabase
        .from('community_profiles')
        .select('display_name, avatar_id')
        .eq('user_id', threadData.user_id)
        .maybeSingle();

      setThread({
        ...threadData,
        community_profiles: authorProfile
      });

      // Load replies
      const { data: repliesData, error: repliesError } = await supabase
        .from('community_replies')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (repliesError) throw repliesError;

      // Get reply author profiles
      const replyUserIds = [...new Set(repliesData?.map(r => r.user_id) || [])];
      let replyProfilesMap = {};
      
      if (replyUserIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('community_profiles')
          .select('user_id, display_name, avatar_id')
          .in('user_id', replyUserIds);
        
        if (profilesData) {
          replyProfilesMap = profilesData.reduce((acc, p) => {
            acc[p.user_id] = p;
            return acc;
          }, {});
        }
      }

      const repliesWithProfiles = repliesData?.map(r => ({
        ...r,
        community_profiles: replyProfilesMap[r.user_id] || null
      })) || [];

      setReplies(repliesWithProfiles);
    } catch (error) {
      console.error('Error loading thread:', error);
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    loadThread();
  }, [loadThread]);

  // Submit reply
  const handleSubmitReply = async () => {
    if (!replyContent.trim() || submitting || !user || isGuest) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('community_replies')
        .insert({
          thread_id: threadId,
          user_id: user.id,
          content: replyContent.trim()
        });

      if (error) throw error;

      // Update thread reply count and last activity
      await supabase
        .from('community_threads')
        .update({ 
          reply_count: (thread?.reply_count || 0) + 1,
          last_activity_at: new Date().toISOString()
        })
        .eq('id', threadId);

      setReplyContent('');
      loadThread();
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Failed to post reply. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit report
  const handleSubmitReport = async () => {
    if (!reportReason || reportSubmitting) return;

    setReportSubmitting(true);
    try {
      const { error } = await supabase
        .from('community_reports')
        .insert({
          reporter_id: user?.id,
          content_type: reportTarget?.type,
          content_id: reportTarget?.id,
          reason: reportReason,
          description: reportDescription
        });

      if (error) throw error;

      setReportSuccess(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess(false);
        setReportReason('');
        setReportDescription('');
        setReportTarget(null);
      }, 2000);
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setReportSubmitting(false);
    }
  };

  // Format time
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
  const category = thread ? (CATEGORIES.find(c => c.id === thread.category) || CATEGORIES[0]) : CATEGORIES[0];
  const threadProfile = thread?.community_profiles;
  const threadAvatar = threadProfile ? getAvatar(threadProfile.avatar_id) : { emoji: '👤', color: 'bg-gray-200' };
  const threadAuthor = threadProfile?.display_name || 'Anonymous';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full mx-auto mb-3"></div>
          <p className="font-crayon text-gray-500">Loading discussion...</p>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center">
        <div className="text-center">
          <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="font-crayon text-gray-500 mb-4">Discussion not found</p>
          <button
            onClick={() => navigate('/community')}
            className="px-4 py-2 text-white rounded-lg font-crayon"
            style={{ backgroundColor: THEME_COLOR }}
          >
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between" style={{ backgroundColor: THEME_COLOR }}>
              <h3 className="font-display text-white flex items-center gap-2">
                <Flag size={20} />
                Report Content
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-white/80 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              {reportSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-green-600" />
                  </div>
                  <p className="font-display text-green-700">Report Submitted</p>
                  <p className="font-crayon text-sm text-gray-500 mt-1">Thank you for helping keep our community safe.</p>
                </div>
              ) : (
                <>
                  <p className="font-crayon text-sm text-gray-600 mb-4">
                    Please select a reason for your report:
                  </p>

                  <div className="space-y-2 mb-4">
                    {REPORT_REASONS.map(reason => (
                      <button
                        key={reason.id}
                        onClick={() => setReportReason(reason.id)}
                        className={`w-full p-3 rounded-xl border-2 text-left font-crayon text-sm transition-all
                          ${reportReason === reason.id 
                            ? 'border-indigo-400 bg-indigo-50' 
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
                    className="w-full p-3 border-2 border-gray-200 rounded-xl font-crayon text-sm resize-none
                             focus:outline-none focus:border-indigo-400"
                    rows={3}
                  />

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setShowReportModal(false)}
                      className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-crayon
                               hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitReport}
                      disabled={!reportReason || reportSubmitting}
                      className="flex-1 py-2.5 text-white rounded-xl font-crayon
                               disabled:opacity-50 transition-colors"
                      style={{ backgroundColor: THEME_COLOR }}
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
        </div>
      )}

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
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <MoreVertical size={16} className="text-gray-400" />
              </button>
              
              {openMenu === 'thread' && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border-2 border-gray-100 py-1 min-w-[140px] z-10">
                  <button
                    onClick={() => {
                      setReportTarget({ type: 'thread', id: thread.id });
                      setShowReportModal(true);
                      setOpenMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left font-crayon text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Flag size={14} />
                    Report
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Thread Title & Content */}
          <h1 className="font-display text-xl text-gray-800 mb-3">{thread.title}</h1>
          <p className="font-crayon text-gray-600 whitespace-pre-wrap">{thread.content}</p>
        </div>

        {/* Replies Section */}
        <div className="mb-6">
          <h2 className="font-display text-lg text-gray-700 mb-4 flex items-center gap-2">
            <MessageCircle size={20} style={{ color: THEME_COLOR }} />
            Replies ({replies.length})
          </h2>

          {replies.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <MessageCircle size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="font-crayon text-gray-500">No replies yet. Be the first to respond!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {replies.map(reply => {
                const replyProfile = reply.community_profiles;
                const replyAvatar = replyProfile ? getAvatar(replyProfile.avatar_id) : { emoji: '👤', color: 'bg-gray-200' };
                const replyAuthor = replyProfile?.display_name || 'Anonymous';

                return (
                  <div key={reply.id} className="bg-white rounded-xl border-2 border-gray-100 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 ${replyAvatar.color} rounded-full flex items-center justify-center text-sm`}>
                          {replyAvatar.emoji}
                        </div>
                        <div>
                          <span className="font-crayon text-sm text-gray-700">{replyAuthor}</span>
                          <span className="font-crayon text-xs text-gray-400 ml-2">
                            {formatTime(reply.created_at)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setReportTarget({ type: 'reply', id: reply.id });
                          setShowReportModal(true);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500"
                        title="Report"
                      >
                        <Flag size={14} />
                      </button>
                    </div>

                    <p className="font-crayon text-gray-600 text-sm whitespace-pre-wrap">{reply.content}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reply Input */}
        {user && !isGuest ? (
          <div className="bg-white rounded-2xl border-3 border-gray-200 p-4">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="w-full p-3 border-2 border-gray-200 rounded-xl font-crayon resize-none
                       focus:outline-none focus:border-indigo-400"
              rows={3}
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSubmitReply}
                disabled={!replyContent.trim() || submitting}
                className="px-4 py-2 text-white rounded-xl font-crayon flex items-center gap-2
                         disabled:opacity-50 transition-colors"
                style={{ backgroundColor: THEME_COLOR }}
              >
                <Send size={16} />
                {submitting ? 'Posting...' : 'Post Reply'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 rounded-xl border-2 border-yellow-200 p-4 text-center">
            <p className="font-crayon text-yellow-800">
              Sign in to reply to this discussion
            </p>
            <button
              onClick={() => navigate('/settings')}
              className="mt-2 px-4 py-2 bg-yellow-400 text-yellow-900 rounded-lg font-crayon text-sm
                       hover:bg-yellow-500 transition-colors"
            >
              Sign In
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CommunityThread;
