// CommunityProfileSetup.jsx - Set up community profile
// UPDATED: Changed theme color from pink (#E86B9A) to indigo (#6366F1)
// Choose avatar and display name

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check,
  Sparkles,
  User
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../App';
import { AVATARS } from '../data/communityAvatars';

// Theme color - INDIGO
const THEME_COLOR = '#6366F1';

const CommunityProfileSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('star');
  const [saving, setSaving] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load existing profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('community_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading profile:', error);
        } else if (data) {
          setExistingProfile(data);
          setDisplayName(data.display_name || '');
          setSelectedAvatar(data.avatar_id || 'star');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // Handle save
  const handleSave = async () => {
    if (!displayName.trim()) {
      alert('Please enter a display name');
      return;
    }

    if (displayName.length < 2 || displayName.length > 30) {
      alert('Display name must be 2-30 characters');
      return;
    }

    setSaving(true);

    try {
      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('community_profiles')
          .update({
            display_name: displayName.trim(),
            avatar_id: selectedAvatar,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('community_profiles')
          .insert({
            user_id: user.id,
            display_name: displayName.trim(),
            avatar_id: selectedAvatar
          });

        if (error) throw error;
      }

      navigate('/community');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Get avatar by ID
  const getAvatar = (id) => AVATARS.find(a => a.id === id) || AVATARS[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full mx-auto mb-3"></div>
          <p className="font-crayon text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4" style={{ borderColor: THEME_COLOR }}>
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
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
            <h1 className="text-lg font-display crayon-text" style={{ color: THEME_COLOR }}>
              {existingProfile ? 'Edit Profile' : 'Create Profile'}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Info Box */}
        <div className="mb-6 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200">
          <div className="flex items-start gap-3">
            <Sparkles size={20} style={{ color: THEME_COLOR }} className="flex-shrink-0 mt-0.5" />
            <p className="font-crayon text-sm text-indigo-700">
              Your profile helps others recognize you in the community. 
              Choose a fun avatar and display name!
            </p>
          </div>
        </div>

        {/* Avatar Selection */}
        <div className="mb-6">
          <label className="block font-display text-gray-700 mb-3">
            Choose Your Avatar
          </label>
          
          {/* Current Avatar Preview */}
          <div className="flex justify-center mb-4">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg border-4 border-white"
              style={{ backgroundColor: getAvatar(selectedAvatar).color }}
            >
              <span className="text-5xl">{getAvatar(selectedAvatar).emoji}</span>
            </div>
          </div>
          
          {/* Avatar Grid */}
          <div className="grid grid-cols-5 gap-2">
            {AVATARS.map(avatar => (
              <button
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                className={`aspect-square rounded-xl flex items-center justify-center transition-all
                  ${selectedAvatar === avatar.id 
                    ? 'ring-4 ring-offset-2 scale-110' 
                    : 'hover:scale-105'
                  }`}
                style={{ 
                  backgroundColor: avatar.color,
                  ringColor: selectedAvatar === avatar.id ? THEME_COLOR : 'transparent'
                }}
              >
                <span className="text-2xl">{avatar.emoji}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Display Name Input */}
        <div className="mb-6">
          <label className="block font-display text-gray-700 mb-2">
            Display Name
          </label>
          <div className="relative">
            <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              maxLength={30}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border-3 border-gray-200 
                       font-crayon focus:outline-none focus:border-indigo-400"
            />
          </div>
          <p className="mt-1 text-xs font-crayon text-gray-400 text-right">
            {displayName.length}/30
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving || !displayName.trim()}
          className="w-full py-4 text-white rounded-xl font-display text-lg
                   flex items-center justify-center gap-2 shadow-md
                   disabled:opacity-50 transition-colors"
          style={{ backgroundColor: THEME_COLOR }}
        >
          {saving ? (
            <>
              <span className="animate-spin">⏳</span>
              Saving...
            </>
          ) : (
            <>
              <Check size={24} />
              {existingProfile ? 'Update Profile' : 'Create Profile'}
            </>
          )}
        </button>

        {/* Privacy Note */}
        <p className="mt-6 text-center font-crayon text-xs text-gray-400">
          Your email address will never be shown publicly.
          Only your display name and avatar are visible to others.
        </p>
      </main>
    </div>
  );
};

export default CommunityProfileSetup;
