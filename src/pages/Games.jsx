// Games.jsx - Games hub for ATLASassist
// ADDED: PlayerProfileCard with streak tracking
// ADDED: Player Stats modal with detailed statistics
// ADDED: Game stats service integration
// UPDATED: Added description banner

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  Star, 
  Trophy, 
  Flame, 
  BarChart3, 
  X,
  Edit2,
  Check,
  Award,
  Calendar,
  Target,
  TrendingUp,
  Gamepad2
} from 'lucide-react';
import { 
  loadGameStats, 
  updatePlayerProfile, 
  ACHIEVEMENTS 
} from '../services/gameStatsService';

// Avatar emoji options
const AVATAR_OPTIONS = ['😊', '😎', '🤩', '🦊', '🐱', '🐶', '🦁', '🐼', '🦄', '🐸', '🐵', '🦋', '🌟', '⭐', '🚀', '🎮'];

// Game definitions
const games = [
  {
    id: 'bubbles',
    name: 'Bubble Pop',
    description: 'Pop colorful bubbles!',
    color: '#4A9FD4',
    emoji: '🫧',
    path: '/games/bubbles',
    ready: true,
  },
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'Find matching pairs!',
    color: '#F5A623',
    emoji: '🧠',
    path: '/games/memory',
    ready: true,
  },
  {
    id: 'emotion-match',
    name: 'Emotion Match',
    description: 'Match faces to feelings!',
    color: '#E86B9A',
    emoji: '😊',
    path: '/games/emotion-match',
    ready: true,
  },
  {
    id: 'sound-match',
    name: 'Sound Match',
    description: 'Match sounds to pictures!',
    color: '#8E6BBF',
    emoji: '🔊',
    path: '/games/sound-match',
    ready: true,
  },
  {
    id: 'sorting',
    name: 'Color Sort',
    description: 'Sort by colors!',
    color: '#5CB85C',
    emoji: '🔴',
    path: '/games/sorting',
    ready: true,
  },
  {
    id: 'shapes',
    name: 'Shape Match',
    description: 'Match shapes to holes!',
    color: '#20B2AA',
    emoji: '🔷',
    path: '/games/shapes',
    ready: true,
  },
  {
    id: 'pattern',
    name: 'Pattern Sequence',
    description: 'Remember the pattern!',
    color: '#E86B9A',
    emoji: '🎵',
    path: '/games/pattern',
    ready: true,
  },
];

// ============================================
// PLAYER PROFILE CARD COMPONENT
// ============================================

const PlayerProfileCard = ({ stats, onEditProfile, onViewStats }) => {
  const streakColor = stats.currentStreak >= 7 ? '#E63B2E' : 
                      stats.currentStreak >= 3 ? '#F5A623' : '#5CB85C';
  
  return (
    <div className="bg-white rounded-2xl border-4 border-[#5CB85C] p-4 mb-6 shadow-crayon">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <button
          onClick={onEditProfile}
          className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F8D14A] to-[#F5A623] 
                   flex items-center justify-center text-3xl shadow-md hover:scale-105 transition-transform"
        >
          {stats.avatarEmoji || '😊'}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-[#5CB85C] 
                        flex items-center justify-center">
            <Edit2 size={12} className="text-gray-500" />
          </div>
        </button>
        
        {/* Name & Stats */}
        <div className="flex-1">
          <h2 className="font-display text-lg text-gray-800">
            {stats.playerName || 'Player'}
          </h2>
          <div className="flex items-center gap-4 mt-1">
            {/* Streak */}
            <div className="flex items-center gap-1">
              <Flame size={18} style={{ color: streakColor }} className={stats.currentStreak > 0 ? 'animate-pulse' : ''} />
              <span className="font-display text-lg" style={{ color: streakColor }}>
                {stats.currentStreak}
              </span>
              <span className="font-crayon text-xs text-gray-500">day streak</span>
            </div>
            
            {/* Stars */}
            <div className="flex items-center gap-1">
              <Star size={18} className="text-[#F8D14A] fill-[#F8D14A]" />
              <span className="font-display text-lg text-[#F5A623]">{stats.totalStars}</span>
            </div>
          </div>
        </div>
        
        {/* Stats Button */}
        <button
          onClick={onViewStats}
          className="p-3 bg-[#5CB85C] text-white rounded-xl hover:bg-green-600 transition-colors"
          title="View Stats"
        >
          <BarChart3 size={24} />
        </button>
      </div>
      
      {/* Quick Stats Row */}
      <div className="flex justify-between mt-4 pt-3 border-t-2 border-dashed border-gray-200">
        <div className="text-center">
          <p className="font-display text-xl text-[#4A9FD4]">{stats.gamesPlayed}</p>
          <p className="font-crayon text-xs text-gray-500">Games Played</p>
        </div>
        <div className="text-center">
          <p className="font-display text-xl text-[#F5A623]">{stats.totalStars}</p>
          <p className="font-crayon text-xs text-gray-500">Total Stars</p>
        </div>
        <div className="text-center">
          <p className="font-display text-xl text-[#E63B2E]">{stats.longestStreak}</p>
          <p className="font-crayon text-xs text-gray-500">Best Streak</p>
        </div>
        <div className="text-center">
          <p className="font-display text-xl text-[#8E6BBF]">{stats.achievements?.length || 0}</p>
          <p className="font-crayon text-xs text-gray-500">Badges</p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// EDIT PROFILE MODAL
// ============================================

const EditProfileModal = ({ stats, onSave, onClose }) => {
  const [name, setName] = useState(stats.playerName || '');
  const [avatar, setAvatar] = useState(stats.avatarEmoji || '😊');
  
  const handleSave = () => {
    onSave(name, avatar);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFEF5] w-full max-w-sm rounded-3xl border-4 border-[#5CB85C] overflow-hidden">
        <div className="bg-[#5CB85C] text-white p-4 flex items-center justify-between">
          <h3 className="font-display text-lg">Edit Profile</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Avatar Selection */}
          <div>
            <label className="block font-crayon text-gray-700 mb-2">Choose Avatar</label>
            <div className="grid grid-cols-8 gap-2">
              {AVATAR_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setAvatar(emoji)}
                  className={`w-10 h-10 rounded-xl text-2xl flex items-center justify-center transition-all
                    ${avatar === emoji 
                      ? 'bg-[#5CB85C] scale-110 shadow-md' 
                      : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          {/* Name Input */}
          <div>
            <label className="block font-crayon text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              className="w-full px-4 py-3 rounded-xl border-3 border-gray-200 font-crayon
                       focus:border-[#5CB85C] focus:outline-none"
            />
          </div>
          
          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-[#5CB85C] text-white rounded-xl font-display
                     hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// STATS MODAL
// ============================================

const StatsModal = ({ stats, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFEF5] w-full max-w-md max-h-[85vh] rounded-3xl border-4 border-[#5CB85C] overflow-hidden">
        <div className="bg-[#5CB85C] text-white p-4 flex items-center justify-between">
          <h3 className="font-display text-lg flex items-center gap-2">
            <Trophy size={20} />
            Player Stats
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
          {/* Profile Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#F8D14A] to-[#F5A623] 
                          flex items-center justify-center text-4xl shadow-lg mb-2">
              {stats.avatarEmoji || '😊'}
            </div>
            <h2 className="font-display text-xl text-gray-800">{stats.playerName || 'Player'}</h2>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center border-2 border-blue-200">
              <Target size={24} className="text-blue-500 mx-auto mb-1" />
              <p className="font-display text-2xl text-blue-600">{stats.gamesPlayed}</p>
              <p className="font-crayon text-xs text-blue-500">Games Played</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4 text-center border-2 border-yellow-200">
              <Star size={24} className="text-yellow-500 mx-auto mb-1 fill-yellow-500" />
              <p className="font-display text-2xl text-yellow-600">{stats.totalStars}</p>
              <p className="font-crayon text-xs text-yellow-500">Total Stars</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 text-center border-2 border-orange-200">
              <Flame size={24} className="text-orange-500 mx-auto mb-1" />
              <p className="font-display text-2xl text-orange-600">{stats.currentStreak}</p>
              <p className="font-crayon text-xs text-orange-500">Current Streak</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 text-center border-2 border-red-200">
              <TrendingUp size={24} className="text-red-500 mx-auto mb-1" />
              <p className="font-display text-2xl text-red-600">{stats.longestStreak}</p>
              <p className="font-crayon text-xs text-red-500">Longest Streak</p>
            </div>
          </div>
          
          {/* Per-Game Stats */}
          <div className="mb-6">
            <h4 className="font-display text-gray-700 mb-3 flex items-center gap-2">
              <BarChart3 size={18} />
              Game Stats
            </h4>
            <div className="space-y-2">
              {games.map(game => {
                const gameStats = stats.byGame?.[game.id] || { played: 0, bestScore: 0, totalStars: 0 };
                if (gameStats.played === 0) return null;
                
                return (
                  <div 
                    key={game.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl border-2"
                    style={{ borderColor: game.color + '50' }}
                  >
                    <span className="text-2xl">{game.emoji}</span>
                    <div className="flex-1">
                      <p className="font-crayon text-sm text-gray-800">{game.name}</p>
                      <p className="font-crayon text-xs text-gray-500">
                        Played {gameStats.played}x • Best: {gameStats.bestScore}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-[#F8D14A] fill-[#F8D14A]" />
                      <span className="font-display text-sm text-[#F5A623]">{gameStats.totalStars}</span>
                    </div>
                  </div>
                );
              })}
              {Object.values(stats.byGame || {}).every(g => g.played === 0) && (
                <p className="text-center font-crayon text-gray-500 py-4">
                  No games played yet. Start playing to see your stats!
                </p>
              )}
            </div>
          </div>
          
          {/* Achievements */}
          <div>
            <h4 className="font-display text-gray-700 mb-3 flex items-center gap-2">
              <Award size={18} />
              Achievements ({stats.achievements?.length || 0})
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(ACHIEVEMENTS).map(([key, achievement]) => {
                const unlocked = stats.achievements?.includes(key);
                return (
                  <div 
                    key={key}
                    className={`p-3 rounded-xl text-center transition-all
                      ${unlocked 
                        ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-300' 
                        : 'bg-gray-100 border-2 border-gray-200 opacity-50'
                      }`}
                    title={achievement.description}
                  >
                    <span className="text-2xl block mb-1">{achievement.emoji}</span>
                    <p className="font-crayon text-xs text-gray-600 truncate">{achievement.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Last Played */}
          {stats.lastPlayedDate && (
            <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-200 text-center">
              <p className="font-crayon text-xs text-gray-400 flex items-center justify-center gap-1">
                <Calendar size={12} />
                Last played: {new Date(stats.lastPlayedDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN GAMES COMPONENT
// ============================================

const Games = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(loadGameStats());
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Refresh stats when component mounts (in case returning from a game)
  useEffect(() => {
    setStats(loadGameStats());
  }, []);

  const handleGameClick = (game) => {
    if (game.ready) {
      navigate(game.path);
    }
  };

  const handleSaveProfile = (name, avatar) => {
    const updatedStats = updatePlayerProfile(name, avatar);
    setStats(updatedStats);
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#5CB85C] 
                       rounded-xl font-display font-bold text-[#5CB85C] hover:bg-[#5CB85C] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#5CB85C] crayon-text">
              Games
            </h1>
          </div>
          <Sparkles className="text-[#F8D14A] w-6 h-6 animate-pulse" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Description Banner */}
        <div className="mb-6 bg-gradient-to-r from-[#5CB85C] to-[#16A34A] rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Gamepad2 size={24} />
            <h2 className="text-lg font-display">Games</h2>
          </div>
          <p className="text-white/90 font-crayon text-sm">
            Fun games to play! Practice matching, memory, patterns, and more. 
            Track your progress and earn stars! 🎮
          </p>
        </div>

        {/* Player Profile Card */}
        <PlayerProfileCard 
          stats={stats}
          onEditProfile={() => setShowEditProfile(true)}
          onViewStats={() => setShowStats(true)}
        />

        {/* Games Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {games.map((game, index) => {
            const gameStats = stats.byGame?.[game.id] || { played: 0, totalStars: 0 };
            
            return (
              <button
                key={game.id}
                onClick={() => handleGameClick(game)}
                disabled={!game.ready}
                className={`
                  relative p-4 rounded-2xl border-4 text-center
                  transition-all duration-200 shadow-crayon
                  ${game.ready 
                    ? 'hover:scale-105 hover:-rotate-1 active:scale-95 cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed'
                  }
                `}
                style={{
                  backgroundColor: game.color + '20',
                  borderColor: game.color,
                  borderRadius: index % 2 === 0 ? '20px 8px 20px 8px' : '8px 20px 8px 20px',
                }}
              >
                {/* Stars earned badge */}
                {gameStats.totalStars > 0 && (
                  <div className="absolute -top-2 -right-2 bg-[#F8D14A] text-white px-2 py-0.5 
                                rounded-full text-xs font-display flex items-center gap-1 shadow-md">
                    <Star size={10} className="fill-white" />
                    {gameStats.totalStars}
                  </div>
                )}
                
                {/* Icon container with white background */}
                <div 
                  className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center mb-2 mx-auto"
                  style={{ border: `2px solid ${game.color}` }}
                >
                  <span className="text-3xl">{game.emoji}</span>
                </div>
                
                {/* Name - dark text */}
                <h3 className="font-display text-gray-800 text-sm leading-tight">
                  {game.name}
                </h3>
                
                {/* Description */}
                <p className="font-crayon text-xs text-gray-500 mt-1">
                  {game.description}
                </p>
                
                {/* Play count */}
                {gameStats.played > 0 && (
                  <p className="font-crayon text-xs text-gray-400 mt-1">
                    Played {gameStats.played}x
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal
          stats={stats}
          onSave={handleSaveProfile}
          onClose={() => setShowEditProfile(false)}
        />
      )}

      {/* Stats Modal */}
      {showStats && (
        <StatsModal
          stats={stats}
          onClose={() => setShowStats(false)}
        />
      )}
    </div>
  );
};

export default Games;
