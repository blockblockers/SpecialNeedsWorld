// CommunityProfileSetup.jsx - Set up community profile
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
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('community_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setExistingProfile(data);
          setDisplayName(data.display_name);
          setSelectedAvatar(data.avatar_id);
          setBio(data.bio || '');
        }
      } catch (e) {
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

  const selectedAvatarData = AVATARS.find(a => a.id === selectedAvatar) || AVATARS[0];

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
              {existingProfile ? 'Edit Profile' : 'Set Up Profile'}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl border-3 border-pink-300 p-4 mb-6 text-center">
          <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <h2 className="font-display text-lg text-purple-700 mb-1">
            {existingProfile ? 'Update Your Profile' : 'Welcome to the Community!'}
          </h2>
          <p className="font-crayon text-sm text-purple-600">
            Choose an avatar and display name to get started
          </p>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-2xl border-4 border-[#E86B9A] p-6 mb-6 text-center">
          <div className={`w-20 h-20 ${selectedAvatarData.color} rounded-full flex items-center justify-center text-4xl mx-auto mb-3 border-4 border-white shadow-lg`}>
            {selectedAvatarData.emoji}
          </div>
          <h3 className="font-display text-xl text-gray-800">
            {displayName || 'Your Name'}
          </h3>
          {bio && (
            <p className="font-crayon text-sm text-gray-500 mt-1">{bio}</p>
          )}
        </div>

        {/* Display Name Input */}
        <div className="mb-6">
          <label className="block font-crayon text-gray-700 mb-2 flex items-center gap-2">
            <User size={16} />
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Choose a friendly name"
            maxLength={30}
            className="w-full p-4 border-3 border-gray-300 rounded-xl font-crayon text-lg
                     focus:border-[#E86B9A] focus:outline-none"
          />
          <p className="font-crayon text-xs text-gray-400 mt-1">
            2-30 characters. This is how others will see you.
          </p>
        </div>

        {/* Avatar Selection */}
        <div className="mb-6">
          <label className="block font-crayon text-gray-700 mb-2">
            Choose Your Avatar
          </label>
          <div className="grid grid-cols-5 gap-3">
            {AVATARS.map(avatar => (
              <button
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                className={`aspect-square rounded-xl border-3 flex items-center justify-center text-2xl
                           transition-all hover:scale-110 ${avatar.color}
                           ${selectedAvatar === avatar.id 
                             ? 'border-[#E86B9A] scale-110 shadow-lg ring-2 ring-pink-300' 
                             : 'border-transparent'
                           }`}
                title={avatar.name}
              >
                {avatar.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Bio (Optional) */}
        <div className="mb-6">
          <label className="block font-crayon text-gray-700 mb-2">
            Short Bio (Optional)
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 200))}
            placeholder="Tell us a little about yourself..."
            rows={2}
            maxLength={200}
            className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon
                     focus:border-[#E86B9A] focus:outline-none resize-none"
          />
          <p className="font-crayon text-xs text-gray-400 mt-1">
            {bio.length}/200 characters
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-xl border-2 border-red-200">
            <p className="font-crayon text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving || !displayName.trim()}
          className="w-full py-4 bg-[#5CB85C] text-white rounded-xl border-3 border-green-600
                   font-display text-lg hover:scale-[1.02] transition-transform
                   flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <span className="animate-pulse">Saving...</span>
          ) : (
            <>
              <Check size={20} />
              {existingProfile ? 'Save Changes' : 'Create Profile'}
            </>
          )}
        </button>

        {/* Privacy Note */}
        <div className="mt-6 p-3 bg-blue-50 rounded-xl border-2 border-blue-200">
          <p className="font-crayon text-xs text-blue-600 text-center">
            🔒 Your real name and email are never shown. Only your display name and avatar are visible to others.
          </p>
        </div>
      </main>
    </div>
  );
};

export default CommunityProfileSetup;
