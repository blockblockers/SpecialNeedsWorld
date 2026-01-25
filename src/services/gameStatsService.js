// gameStatsService.js - Centralized game statistics tracking
// Used by Games.jsx and all individual game components

const STORAGE_KEY = 'atlas_game_stats';

// Default stats structure
const DEFAULT_STATS = {
  playerName: '',
  avatarEmoji: '😊',
  gamesPlayed: 0,
  totalStars: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastPlayedDate: null,
  gameHistory: [], // Array of { gameId, stars, score, playedAt }
  achievements: [],
  // Per-game stats
  byGame: {
    bubbles: { played: 0, bestScore: 0, totalStars: 0 },
    memory: { played: 0, bestScore: 0, totalStars: 0 },
    'sound-match': { played: 0, bestScore: 0, totalStars: 0 },
    sorting: { played: 0, bestScore: 0, totalStars: 0 },
    shapes: { played: 0, bestScore: 0, totalStars: 0 },
    pattern: { played: 0, bestScore: 0, totalStars: 0 },
    'emotion-match': { played: 0, bestScore: 0, totalStars: 0 },
  },
};

// Load stats from localStorage
export const loadGameStats = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to handle new fields
      return { ...DEFAULT_STATS, ...parsed, byGame: { ...DEFAULT_STATS.byGame, ...parsed.byGame } };
    }
  } catch (error) {
    console.error('Error loading game stats:', error);
  }
  return { ...DEFAULT_STATS };
};

// Save stats to localStorage
export const saveGameStats = (stats) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving game stats:', error);
  }
};

// Get today's date string
const getToday = () => new Date().toISOString().split('T')[0];

// Calculate streak based on last played date
const calculateStreak = (lastPlayedDate, currentStreak) => {
  if (!lastPlayedDate) return 0;
  
  const today = getToday();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (lastPlayedDate === today) {
    // Already played today, streak continues
    return currentStreak;
  } else if (lastPlayedDate === yesterdayStr) {
    // Played yesterday, streak continues with +1 when they play today
    return currentStreak;
  } else {
    // More than 1 day gap, streak resets
    return 0;
  }
};

// Record a completed game
export const recordGameCompletion = (gameId, stars = 0, score = 0) => {
  const stats = loadGameStats();
  const today = getToday();
  
  // Check if this is first game today (for streak)
  const isFirstGameToday = stats.lastPlayedDate !== today;
  
  // Update streak
  if (isFirstGameToday) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (stats.lastPlayedDate === yesterdayStr) {
      // Consecutive day, increment streak
      stats.currentStreak += 1;
    } else if (!stats.lastPlayedDate) {
      // First time playing ever
      stats.currentStreak = 1;
    } else {
      // Gap in play, reset streak
      stats.currentStreak = 1;
    }
    
    // Update longest streak
    if (stats.currentStreak > stats.longestStreak) {
      stats.longestStreak = stats.currentStreak;
    }
  }
  
  // Update general stats
  stats.gamesPlayed += 1;
  stats.totalStars += stars;
  stats.lastPlayedDate = today;
  
  // Update per-game stats
  if (!stats.byGame[gameId]) {
    stats.byGame[gameId] = { played: 0, bestScore: 0, totalStars: 0 };
  }
  stats.byGame[gameId].played += 1;
  stats.byGame[gameId].totalStars += stars;
  if (score > stats.byGame[gameId].bestScore) {
    stats.byGame[gameId].bestScore = score;
  }
  
  // Add to history (keep last 50)
  stats.gameHistory.unshift({
    gameId,
    stars,
    score,
    playedAt: new Date().toISOString(),
  });
  if (stats.gameHistory.length > 50) {
    stats.gameHistory = stats.gameHistory.slice(0, 50);
  }
  
  // Check for achievements
  checkAchievements(stats);
  
  // Save
  saveGameStats(stats);
  
  return stats;
};

// Update player profile
export const updatePlayerProfile = (name, avatarEmoji) => {
  const stats = loadGameStats();
  if (name !== undefined) stats.playerName = name;
  if (avatarEmoji !== undefined) stats.avatarEmoji = avatarEmoji;
  saveGameStats(stats);
  return stats;
};

// Get current streak (recalculated)
export const getCurrentStreak = () => {
  const stats = loadGameStats();
  return calculateStreak(stats.lastPlayedDate, stats.currentStreak);
};

// Check and award achievements
const checkAchievements = (stats) => {
  const achievements = stats.achievements || [];
  
  const newAchievements = [];
  
  // First game
  if (stats.gamesPlayed === 1 && !achievements.includes('first_game')) {
    newAchievements.push('first_game');
  }
  
  // 10 games
  if (stats.gamesPlayed >= 10 && !achievements.includes('10_games')) {
    newAchievements.push('10_games');
  }
  
  // 50 games
  if (stats.gamesPlayed >= 50 && !achievements.includes('50_games')) {
    newAchievements.push('50_games');
  }
  
  // 3 day streak
  if (stats.currentStreak >= 3 && !achievements.includes('streak_3')) {
    newAchievements.push('streak_3');
  }
  
  // 7 day streak
  if (stats.currentStreak >= 7 && !achievements.includes('streak_7')) {
    newAchievements.push('streak_7');
  }
  
  // 50 stars
  if (stats.totalStars >= 50 && !achievements.includes('50_stars')) {
    newAchievements.push('50_stars');
  }
  
  // 100 stars
  if (stats.totalStars >= 100 && !achievements.includes('100_stars')) {
    newAchievements.push('100_stars');
  }
  
  stats.achievements = [...achievements, ...newAchievements];
  
  return newAchievements;
};

// Achievement definitions
export const ACHIEVEMENTS = {
  first_game: { name: 'First Steps', emoji: '🎮', description: 'Play your first game' },
  '10_games': { name: 'Getting Started', emoji: '🌟', description: 'Play 10 games' },
  '50_games': { name: 'Game Master', emoji: '🏆', description: 'Play 50 games' },
  streak_3: { name: 'Hat Trick', emoji: '🔥', description: '3 day streak' },
  streak_7: { name: 'Week Warrior', emoji: '⚡', description: '7 day streak' },
  '50_stars': { name: 'Star Collector', emoji: '⭐', description: 'Earn 50 stars' },
  '100_stars': { name: 'Superstar', emoji: '💫', description: 'Earn 100 stars' },
};

// Reset all stats (for testing or user request)
export const resetAllStats = () => {
  saveGameStats({ ...DEFAULT_STATS });
  return { ...DEFAULT_STATS };
};

export default {
  loadGameStats,
  saveGameStats,
  recordGameCompletion,
  updatePlayerProfile,
  getCurrentStreak,
  resetAllStats,
  ACHIEVEMENTS,
};
