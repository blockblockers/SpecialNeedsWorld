// RewardChart.jsx - Visual reward system for ATLASassist
// Earn stars for achievements and track progress toward goals
// Great for positive reinforcement and motivation

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star,
  Plus,
  X,
  Trash2,
  Edit3,
  Trophy,
  Gift,
  Sparkles,
  Check,
  Target,
  RotateCcw
} from 'lucide-react';
import LocalOnlyNotice from '../components/LocalOnlyNotice';

const STORAGE_KEY = 'snw_reward_chart';

// Default reward chart template
const DEFAULT_BEHAVIORS = [
  { id: 'morning-routine', name: 'Completed morning routine', emoji: '🌅', stars: 1 },
  { id: 'homework', name: 'Finished homework', emoji: '📚', stars: 1 },
  { id: 'kind-words', name: 'Used kind words', emoji: '💬', stars: 1 },
  { id: 'helping', name: 'Helped someone', emoji: '🤝', stars: 2 },
  { id: 'tried-hard', name: 'Tried my best', emoji: '💪', stars: 1 },
  { id: 'good-listener', name: 'Was a good listener', emoji: '👂', stars: 1 },
  { id: 'cleaned-up', name: 'Cleaned up', emoji: '🧹', stars: 1 },
  { id: 'stayed-calm', name: 'Stayed calm', emoji: '😌', stars: 2 },
];

// Default rewards to work toward
const DEFAULT_REWARDS = [
  { id: 'screen-time', name: '30 min screen time', emoji: '📱', starsNeeded: 5 },
  { id: 'treat', name: 'Special treat', emoji: '🍦', starsNeeded: 10 },
  { id: 'activity', name: 'Choose an activity', emoji: '🎮', starsNeeded: 15 },
  { id: 'outing', name: 'Special outing', emoji: '🎢', starsNeeded: 25 },
  { id: 'big-reward', name: 'Big reward!', emoji: '🎁', starsNeeded: 50 },
];

// Star colors for variety
const STAR_COLORS = ['#F8D14A', '#F5A623', '#E63B2E', '#E86B9A', '#8E6BBF', '#4A9FD4', '#5CB85C'];

const RewardChart = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    totalStars: 0,
    earnedToday: [],
    history: [],
    behaviors: DEFAULT_BEHAVIORS,
    rewards: DEFAULT_REWARDS,
    claimedRewards: [],
  });
  const [showAddBehavior, setShowAddBehavior] = useState(false);
  const [showAddReward, setShowAddReward] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmoji, setCelebrationEmoji] = useState('⭐');
  const [editingBehavior, setEditingBehavior] = useState(null);
  const [editingReward, setEditingReward] = useState(null);
  
  // Form state
  const [newBehavior, setNewBehavior] = useState({ name: '', emoji: '⭐', stars: 1 });
  const [newReward, setNewReward] = useState({ name: '', emoji: '🎁', starsNeeded: 10 });

  // Today's date
  const today = new Date().toISOString().split('T')[0];

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Reset daily earned if new day
        if (parsed.lastDate !== today) {
          parsed.earnedToday = [];
          parsed.lastDate = today;
        }
        setData(parsed);
      } catch (e) {
        console.error('Error loading reward chart:', e);
      }
    }
  }, [today]);

  // Save data
  const saveData = (newData) => {
    const dataToSave = { ...newData, lastDate: today };
    setData(dataToSave);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  };

  // Earn stars for a behavior
  const earnStars = (behavior) => {
    const newTotal = data.totalStars + behavior.stars;
    const newHistory = [
      { 
        id: Date.now(), 
        behaviorId: behavior.id, 
        name: behavior.name, 
        emoji: behavior.emoji,
        stars: behavior.stars, 
        date: today,
        timestamp: new Date().toISOString()
      },
      ...data.history.slice(0, 99) // Keep last 100
    ];
    
    // Show celebration
    setCelebrationEmoji(behavior.emoji);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 1500);
    
    saveData({
      ...data,
      totalStars: newTotal,
      earnedToday: [...data.earnedToday, { behaviorId: behavior.id, timestamp: Date.now() }],
      history: newHistory,
    });
  };

  // Claim a reward
  const claimReward = (reward) => {
    if (data.totalStars < reward.starsNeeded) {
      alert(`You need ${reward.starsNeeded - data.totalStars} more stars!`);
      return;
    }
    
    if (!confirm(`Claim "${reward.name}" for ${reward.starsNeeded} stars?`)) return;
    
    const newTotal = data.totalStars - reward.starsNeeded;
    const newClaimed = [
      { ...reward, claimedAt: new Date().toISOString() },
      ...data.claimedRewards.slice(0, 49)
    ];
    
    // Big celebration for claimed reward
    setCelebrationEmoji(reward.emoji);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
    
    saveData({
      ...data,
      totalStars: newTotal,
      claimedRewards: newClaimed,
    });
  };

  // Add custom behavior
  const addBehavior = () => {
    if (!newBehavior.name.trim()) return;
    
    const behavior = {
      id: `custom-${Date.now()}`,
      name: newBehavior.name.trim(),
      emoji: newBehavior.emoji,
      stars: newBehavior.stars,
      custom: true,
    };
    
    saveData({
      ...data,
      behaviors: [...data.behaviors, behavior],
    });
    
    setNewBehavior({ name: '', emoji: '⭐', stars: 1 });
    setShowAddBehavior(false);
  };

  // Add custom reward
  const addReward = () => {
    if (!newReward.name.trim()) return;
    
    const reward = {
      id: `custom-${Date.now()}`,
      name: newReward.name.trim(),
      emoji: newReward.emoji,
      starsNeeded: newReward.starsNeeded,
      custom: true,
    };
    
    saveData({
      ...data,
      rewards: [...data.rewards, reward],
    });
    
    setNewReward({ name: '', emoji: '🎁', starsNeeded: 10 });
    setShowAddReward(false);
  };

  // Delete behavior
  const deleteBehavior = (behaviorId) => {
    if (!confirm('Delete this behavior?')) return;
    saveData({
      ...data,
      behaviors: data.behaviors.filter(b => b.id !== behaviorId),
    });
  };

  // Delete reward
  const deleteReward = (rewardId) => {
    if (!confirm('Delete this reward?')) return;
    saveData({
      ...data,
      rewards: data.rewards.filter(r => r.id !== rewardId),
    });
  };

  // Reset all stars
  const resetStars = () => {
    if (!confirm('Reset all stars? This cannot be undone.')) return;
    saveData({
      ...data,
      totalStars: 0,
      earnedToday: [],
      history: [],
      claimedRewards: [],
    });
  };

  // Get times earned today for a behavior
  const getTimesEarnedToday = (behaviorId) => {
    return data.earnedToday.filter(e => e.behaviorId === behaviorId).length;
  };

  // Emoji picker options
  const EMOJI_OPTIONS = ['⭐', '🌟', '✨', '💫', '🏆', '🎯', '💪', '👍', '❤️', '🎉', '🌈', '🦋', '🎨', '📚', '🎮', '🍎', '🧹', '😊', '🤝', '🎁', '🍦', '🎢', '📱', '🎵'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 pointer-events-none">
          <div className="text-center animate-bounce-in">
            <span className="text-8xl block mb-4">{celebrationEmoji}</span>
            <div className="flex gap-2 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={32} 
                  fill={STAR_COLORS[i % STAR_COLORS.length]} 
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4 border-[#F8D14A]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/activities')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F8D14A] 
                       rounded-xl font-display font-bold text-[#F5A623] hover:bg-[#F8D14A] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#F5A623] crayon-text">
              ⭐ Reward Chart
            </h1>
          </div>
          <button
            onClick={resetStars}
            className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white"
            title="Reset stars"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Privacy Notice */}
        <div className="mb-4">
          <LocalOnlyNotice compact />
        </div>

        {/* Star Counter */}
        <div className="bg-white rounded-2xl border-4 border-[#F8D14A] p-6 mb-6 text-center shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Star size={48} fill="#F8D14A" className="text-[#F8D14A]" />
            <span className="text-5xl font-display text-[#F5A623]">{data.totalStars}</span>
            <Star size={48} fill="#F8D14A" className="text-[#F8D14A]" />
          </div>
          <p className="font-crayon text-gray-600">Total Stars Earned!</p>
          
          {/* Mini star visualization */}
          <div className="flex justify-center flex-wrap gap-1 mt-4 max-w-xs mx-auto">
            {[...Array(Math.min(data.totalStars, 20))].map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                fill={STAR_COLORS[i % STAR_COLORS.length]}
                className="text-yellow-400"
              />
            ))}
            {data.totalStars > 20 && (
              <span className="font-crayon text-sm text-gray-500">+{data.totalStars - 20} more</span>
            )}
          </div>
        </div>

        {/* Earn Stars Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display text-gray-700 flex items-center gap-2">
              <Target size={24} className="text-[#5CB85C]" />
              Earn Stars
            </h2>
            <button
              onClick={() => setShowAddBehavior(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#5CB85C] text-white rounded-full 
                       font-crayon text-sm hover:bg-green-600 transition-colors"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.behaviors.map(behavior => {
              const timesToday = getTimesEarnedToday(behavior.id);
              return (
                <div key={behavior.id} className="relative group">
                  <button
                    onClick={() => earnStars(behavior)}
                    className="w-full bg-white rounded-xl border-3 border-green-200 p-4 text-left
                             hover:border-green-400 hover:shadow-md transition-all flex items-center gap-3"
                  >
                    <span className="text-3xl">{behavior.emoji}</span>
                    <div className="flex-1">
                      <p className="font-crayon text-gray-700">{behavior.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(behavior.stars)].map((_, i) => (
                          <Star key={i} size={14} fill="#F8D14A" className="text-[#F8D14A]" />
                        ))}
                        <span className="font-crayon text-xs text-gray-400 ml-1">
                          +{behavior.stars} {behavior.stars === 1 ? 'star' : 'stars'}
                        </span>
                      </div>
                    </div>
                    {timesToday > 0 && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-crayon text-xs">
                        x{timesToday} today
                      </span>
                    )}
                  </button>
                  
                  {/* Delete button for custom behaviors */}
                  {behavior.custom && (
                    <button
                      onClick={() => deleteBehavior(behavior.id)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full 
                               opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rewards Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display text-gray-700 flex items-center gap-2">
              <Gift size={24} className="text-[#E86B9A]" />
              Rewards
            </h2>
            <button
              onClick={() => setShowAddReward(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#E86B9A] text-white rounded-full 
                       font-crayon text-sm hover:bg-pink-600 transition-colors"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          <div className="space-y-3">
            {data.rewards.map(reward => {
              const progress = Math.min(100, (data.totalStars / reward.starsNeeded) * 100);
              const canClaim = data.totalStars >= reward.starsNeeded;
              
              return (
                <div key={reward.id} className="relative group">
                  <div className={`
                    bg-white rounded-xl border-3 p-4 transition-all
                    ${canClaim ? 'border-green-400 shadow-md' : 'border-gray-200'}
                  `}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{reward.emoji}</span>
                      <div className="flex-1">
                        <p className="font-display text-gray-700">{reward.name}</p>
                        <p className="font-crayon text-sm text-gray-500">
                          {reward.starsNeeded} stars needed
                        </p>
                      </div>
                      <button
                        onClick={() => claimReward(reward)}
                        disabled={!canClaim}
                        className={`px-4 py-2 rounded-xl font-crayon transition-all
                          ${canClaim 
                            ? 'bg-[#5CB85C] text-white hover:bg-green-600' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        {canClaim ? '🎉 Claim!' : `${reward.starsNeeded - data.totalStars} to go`}
                      </button>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          canClaim ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-yellow-300 to-yellow-400'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-right font-crayon text-xs text-gray-400 mt-1">
                      {data.totalStars}/{reward.starsNeeded} stars
                    </p>
                  </div>
                  
                  {/* Delete button for custom rewards */}
                  {reward.custom && (
                    <button
                      onClick={() => deleteReward(reward.id)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full 
                               opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent History */}
        {data.history.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-display text-gray-700 mb-3">Recent Stars</h2>
            <div className="bg-white rounded-xl border-2 border-gray-200 divide-y divide-gray-100">
              {data.history.slice(0, 5).map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3">
                  <span className="text-xl">{item.emoji}</span>
                  <div className="flex-1">
                    <p className="font-crayon text-gray-700 text-sm">{item.name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(item.stars)].map((_, i) => (
                      <Star key={i} size={12} fill="#F8D14A" className="text-[#F8D14A]" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="p-4 bg-yellow-50 rounded-2xl border-3 border-yellow-200">
          <p className="text-center text-gray-600 font-crayon text-sm">
            💡 <strong>Tip:</strong> Earn stars by completing tasks and good behaviors. 
            Save up stars to claim awesome rewards!
          </p>
        </div>
      </main>

      {/* Add Behavior Modal */}
      {showAddBehavior && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-display text-xl text-gray-700 mb-4">Add New Behavior</h3>
            
            <input
              type="text"
              value={newBehavior.name}
              onChange={(e) => setNewBehavior(prev => ({ ...prev, name: e.target.value }))}
              placeholder="What behavior earns stars?"
              className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl font-crayon mb-4
                       focus:border-[#5CB85C] focus:outline-none"
            />
            
            <div className="mb-4">
              <label className="font-crayon text-gray-600 text-sm mb-2 block">Choose an emoji:</label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.slice(0, 12).map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setNewBehavior(prev => ({ ...prev, emoji }))}
                    className={`text-2xl p-2 rounded-lg transition-all
                      ${newBehavior.emoji === emoji ? 'bg-green-100 scale-110' : 'hover:bg-gray-100'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="font-crayon text-gray-600 text-sm mb-2 block">Stars to earn:</label>
              <div className="flex gap-2">
                {[1, 2, 3, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => setNewBehavior(prev => ({ ...prev, stars: num }))}
                    className={`flex-1 py-2 rounded-xl font-crayon transition-all flex items-center justify-center gap-1
                      ${newBehavior.stars === num ? 'bg-[#F8D14A] text-white' : 'bg-gray-100'}`}
                  >
                    {num} <Star size={14} fill={newBehavior.stars === num ? 'white' : '#F8D14A'} />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddBehavior(false)}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-crayon"
              >
                Cancel
              </button>
              <button
                onClick={addBehavior}
                disabled={!newBehavior.name.trim()}
                className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl font-crayon
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Reward Modal */}
      {showAddReward && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-display text-xl text-gray-700 mb-4">Add New Reward</h3>
            
            <input
              type="text"
              value={newReward.name}
              onChange={(e) => setNewReward(prev => ({ ...prev, name: e.target.value }))}
              placeholder="What's the reward?"
              className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl font-crayon mb-4
                       focus:border-[#E86B9A] focus:outline-none"
            />
            
            <div className="mb-4">
              <label className="font-crayon text-gray-600 text-sm mb-2 block">Choose an emoji:</label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.slice(12).map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setNewReward(prev => ({ ...prev, emoji }))}
                    className={`text-2xl p-2 rounded-lg transition-all
                      ${newReward.emoji === emoji ? 'bg-pink-100 scale-110' : 'hover:bg-gray-100'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="font-crayon text-gray-600 text-sm mb-2 block">Stars needed:</label>
              <div className="flex gap-2">
                {[5, 10, 15, 25, 50].map(num => (
                  <button
                    key={num}
                    onClick={() => setNewReward(prev => ({ ...prev, starsNeeded: num }))}
                    className={`flex-1 py-2 rounded-xl font-crayon text-sm transition-all
                      ${newReward.starsNeeded === num ? 'bg-[#E86B9A] text-white' : 'bg-gray-100'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddReward(false)}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-crayon"
              >
                Cancel
              </button>
              <button
                onClick={addReward}
                disabled={!newReward.name.trim()}
                className="flex-1 py-3 bg-[#E86B9A] text-white rounded-xl font-crayon
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardChart;
