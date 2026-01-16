// CommunityProfileSetup.jsx - Set up community profile
// FIXED: Changed .single() to .maybeSingle() to prevent 406 errors
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

const CommunityProfileSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('star');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [existingProfile, setExistingProfile] = useState(null);

  // Load existing profile if any
  // FIXED: Using .maybeSingle() instead of .single() to avoid 406 errors
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('community_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(); // FIXED: Changed from .single() to .maybeSingle()

        if (error) {
          console.error('Error loading profile:', error);
          return;
        }

        if (data) {
          setExistingProfile(data);
          setDisplayName(data.display_name);
          setSelectedAvatar(data.avatar_id);
          setBio(data.bio || '');
        }
      } catch (e) {
        console.error('Error in loadProfile:', e);
        // No profile yet, that's okay
      }
    };

    loadProfile();
  }, [user]);

  // Save profile
  const handleSave = async () => {
    if (!displayName.trim()) {
      setError('Please enter a display name');
      return;
    }

    if (displayName.length < 2 || displayName.length > 30) {
      setError('Display name must be 2-30 characters');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const profileData = {
        user_id: user.id,
        display_name: displayName.trim(),
        avatar_id: selectedAvatar,
        bio: bio.trim() || null,
      };

      if (existingProfile) {
        // Update existing
        const { error } = await supabase
          .from('community_profiles')
          .update(profileData)
          .eq('id', existingProfile.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('community_profiles')
          .insert(profileData);

        if (error) throw error;
      }

      navigate('/community');
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Get avatar by ID
  const getAvatar = (id) => AVATARS.find(a => a.id === id) || AVATARS[0];

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E86B9A]">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
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
            <h1 className="text-lg font-display text-[#E86B9A] crayon-text">
              {existingProfile ? 'Edit Profile' : 'Create Profile'}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Info Box */}
        <div className="mb-6 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
          <div className="flex items-start gap-3">
            <Sparkles size={20} className="text-purple-500 flex-shrink-0 mt-0.5" />
            <p className="font-crayon text-sm text-purple-700">
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
                    ? 'ring-4 ring-[#E86B9A] ring-offset-2 scale-110' 
                    : 'hover:scale-105'
                  }`}
                style={{ backgroundColor: avatar.color }}
              >
                <span className="text-2xl">{avatar.emoji}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Display Name */}
        <div className="mb-6">
          <label className="block font-display text-gray-700 mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Choose a friendly name"
            maxLength={30}
            className="w-full px-4 py-3 bg-white border-3 border-gray-300 rounded-xl font-crayon
                     focus:border-[#E86B9A] focus:outline-none"
          />
          <p className="mt-1 font-crayon text-xs text-gray-400">
            {displayName.length}/30 characters
          </p>
        </div>

        {/* Bio (Optional) */}
        <div className="mb-6">
          <label className="block font-display text-gray-700 mb-2">
            Short Bio <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a little about yourself..."
            maxLength={200}
            rows={3}
            className="w-full px-4 py-3 bg-white border-3 border-gray-300 rounded-xl font-crayon
                     focus:border-[#E86B9A] focus:outline-none resize-none"
          />
          <p className="mt-1 font-crayon text-xs text-gray-400">
            {bio.length}/200 characters
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="font-crayon text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving || !displayName.trim()}
          className="w-full py-4 bg-[#5CB85C] border-4 border-green-600 rounded-xl
                   font-display text-xl text-white shadow-crayon
                   hover:bg-green-600 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2"
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
