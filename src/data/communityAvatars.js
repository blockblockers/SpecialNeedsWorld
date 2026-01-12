// communityAvatars.js - Predefined avatars for community profiles
// 20 family-friendly, inclusive avatars

export const AVATARS = [
  // Stars & Celestial
  { id: 'star', emoji: '⭐', name: 'Star', color: 'bg-yellow-100' },
  { id: 'sun', emoji: '☀️', name: 'Sunshine', color: 'bg-orange-100' },
  { id: 'moon', emoji: '🌙', name: 'Moon', color: 'bg-purple-100' },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow', color: 'bg-pink-100' },
  
  // Nature
  { id: 'flower', emoji: '🌸', name: 'Flower', color: 'bg-pink-100' },
  { id: 'tree', emoji: '🌳', name: 'Tree', color: 'bg-green-100' },
  { id: 'butterfly', emoji: '🦋', name: 'Butterfly', color: 'bg-blue-100' },
  { id: 'sunflower', emoji: '🌻', name: 'Sunflower', color: 'bg-yellow-100' },
  
  // Animals
  { id: 'cat', emoji: '🐱', name: 'Cat', color: 'bg-orange-100' },
  { id: 'dog', emoji: '🐕', name: 'Dog', color: 'bg-amber-100' },
  { id: 'bunny', emoji: '🐰', name: 'Bunny', color: 'bg-pink-100' },
  { id: 'bear', emoji: '🐻', name: 'Bear', color: 'bg-amber-100' },
  { id: 'owl', emoji: '🦉', name: 'Owl', color: 'bg-purple-100' },
  { id: 'turtle', emoji: '🐢', name: 'Turtle', color: 'bg-green-100' },
  
  // Hearts & Symbols
  { id: 'heart', emoji: '💜', name: 'Purple Heart', color: 'bg-purple-100' },
  { id: 'sparkle', emoji: '✨', name: 'Sparkles', color: 'bg-yellow-100' },
  { id: 'puzzle', emoji: '🧩', name: 'Puzzle Piece', color: 'bg-blue-100' },
  { id: 'diamond', emoji: '💎', name: 'Diamond', color: 'bg-cyan-100' },
  
  // Fun
  { id: 'rocket', emoji: '🚀', name: 'Rocket', color: 'bg-red-100' },
  { id: 'cloud', emoji: '☁️', name: 'Cloud', color: 'bg-blue-100' },
];

// Get avatar by ID
export const getAvatar = (avatarId) => {
  return AVATARS.find(a => a.id === avatarId) || AVATARS[0];
};

// Forum categories
export const CATEGORIES = [
  { id: 'general', name: 'General Discussion', emoji: '💬', color: 'bg-gray-100 border-gray-400' },
  { id: 'question', name: 'Questions', emoji: '❓', color: 'bg-blue-100 border-blue-400' },
  { id: 'support', name: 'Support & Encouragement', emoji: '💝', color: 'bg-pink-100 border-pink-400' },
  { id: 'tips', name: 'Tips & Advice', emoji: '💡', color: 'bg-yellow-100 border-yellow-400' },
  { id: 'resources', name: 'Resources', emoji: '📚', color: 'bg-green-100 border-green-400' },
  { id: 'wins', name: 'Wins & Celebrations', emoji: '🎉', color: 'bg-purple-100 border-purple-400' },
];

// Report reasons
export const REPORT_REASONS = [
  { id: 'spam', name: 'Spam or advertising' },
  { id: 'inappropriate', name: 'Inappropriate content' },
  { id: 'harassment', name: 'Harassment or bullying' },
  { id: 'misinformation', name: 'Harmful misinformation' },
  { id: 'privacy', name: 'Privacy violation' },
  { id: 'other', name: 'Other concern' },
];

export default { AVATARS, getAvatar, CATEGORIES, REPORT_REASONS };
