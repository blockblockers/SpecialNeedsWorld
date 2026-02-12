// PointToTalk.jsx - AAC Communication Board for ATLASassist
// ENHANCED: Quick Phrases, Recents Bar, Voice Settings, Larger Buttons, Visual Accessibility
// ENHANCED: Word Morphology, Prediction, Motor Planning, Partner Scanning, Analytics
// NAVIGATION: Back button goes to /hub

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Volume2, 
  Settings,
  Grid3X3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Undo2,
  MessageSquare,
  Edit2,
  Check,
  RotateCcw,
  Plus,
  Cloud,
  User,
  Upload,
  Loader2,
  FolderOpen,
  Info,
  TrendingUp,
  Users,
  Zap,
  Clock,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  BarChart2,
  PlayCircle,
  PauseCircle,
  Mic,
  Grid,
  Target,
  Accessibility,
  History,
  SlidersHorizontal,
  Contrast,
  Type
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { useToast } from '../components/ThemedToast';
import { useAuth } from '../App';

// ============================================
// STORAGE KEYS
// ============================================
const STORAGE_KEYS = {
  footer: 'snw_ptt_footer_words',
  customWords: 'snw_aac_custom_words',
  layout: 'snw_aac_layout',
  voiceSettings: 'snw_aac_voice_settings',
  accessibility: 'snw_aac_accessibility',
  recents: 'snw_aac_recents',
  analytics: 'snw_aac_analytics',
  motorPlanning: 'snw_aac_motor_planning',
};

// ============================================
// QUICK PHRASES - Pre-built sentences
// ============================================
const QUICK_PHRASES = [
  { id: 'qp-need-break', text: 'I need a break', emoji: '⏸️', color: '#8E6BBF', category: 'needs' },
  { id: 'qp-more-please', text: 'Can I have more please?', emoji: '🙏', color: '#5CB85C', category: 'needs' },
  { id: 'qp-dont-feel-good', text: "I don't feel good", emoji: '🤒', color: '#E86B9A', category: 'feelings' },
  { id: 'qp-need-bathroom', text: 'I need to go to the bathroom', emoji: '🚽', color: '#4A9FD4', category: 'needs' },
  { id: 'qp-help-please', text: 'Can you help me please?', emoji: '🙋', color: '#F5A623', category: 'help' },
  { id: 'qp-too-loud', text: "It's too loud", emoji: '🔊', color: '#E63B2E', category: 'sensory' },
  { id: 'qp-need-quiet', text: 'I need somewhere quiet', emoji: '🤫', color: '#87CEEB', category: 'sensory' },
  { id: 'qp-want-alone', text: 'I want to be alone', emoji: '🚪', color: '#8E6BBF', category: 'needs' },
  { id: 'qp-dont-understand', text: "I don't understand", emoji: '❓', color: '#F5A623', category: 'help' },
  { id: 'qp-say-again', text: 'Can you say that again?', emoji: '🔄', color: '#4A9FD4', category: 'help' },
  { id: 'qp-wait-please', text: 'Wait please, I need time', emoji: '⏳', color: '#F8D14A', category: 'needs' },
  { id: 'qp-all-done', text: "I'm all done", emoji: '✅', color: '#5CB85C', category: 'status' },
  { id: 'qp-hungry', text: "I'm hungry", emoji: '🍽️', color: '#F5A623', category: 'needs' },
  { id: 'qp-thirsty', text: "I'm thirsty", emoji: '💧', color: '#4A9FD4', category: 'needs' },
  { id: 'qp-tired', text: "I'm tired", emoji: '😴', color: '#87CEEB', category: 'feelings' },
  { id: 'qp-hurts', text: 'Something hurts', emoji: '🤕', color: '#E63B2E', category: 'feelings' },
  { id: 'qp-happy', text: "I'm happy", emoji: '😊', color: '#F8D14A', category: 'feelings' },
  { id: 'qp-sad', text: "I'm sad", emoji: '😢', color: '#4A9FD4', category: 'feelings' },
  { id: 'qp-scared', text: "I'm scared", emoji: '😨', color: '#8E6BBF', category: 'feelings' },
  { id: 'qp-excited', text: "I'm excited", emoji: '🤩', color: '#F5A623', category: 'feelings' },
  { id: 'qp-love-you', text: 'I love you', emoji: '❤️', color: '#E86B9A', category: 'social' },
  { id: 'qp-thank-you', text: 'Thank you so much', emoji: '💕', color: '#E86B9A', category: 'social' },
  { id: 'qp-sorry', text: "I'm sorry", emoji: '😔', color: '#87CEEB', category: 'social' },
  { id: 'qp-good-morning', text: 'Good morning', emoji: '🌅', color: '#F5A623', category: 'social' },
];

// ============================================
// LAYOUT DESCRIPTIONS
// ============================================
const LAYOUT_INFO = {
  basic: {
    title: 'Basic',
    icon: Grid3X3,
    color: '#5CB85C',
    description: 'Standard vocabulary with essential words. Great for getting started.',
    details: 'Includes common words organized by category. Your custom words appear alongside defaults.'
  },
  personal: {
    title: 'My Words',
    icon: User,
    color: '#F5A623',
    description: 'Your personal collection of custom words.',
    details: 'Words you create are saved here. Only you can see your personal words.'
  },
  cloud: {
    title: 'Community',
    icon: Cloud,
    color: '#4A9FD4',
    description: 'Most popular words from all users.',
    details: 'Shows top words per category. Community-curated vocabulary.'
  }
};

// ============================================
// WORD MORPHOLOGY - Verb tenses, plurals, pronouns
// ============================================
const WORD_MORPHOLOGY = {
  // Verbs with tenses
  want: { present: 'want', past: 'wanted', progressive: 'wanting', forms: ['want', 'wanted', 'wanting'] },
  need: { present: 'need', past: 'needed', progressive: 'needing', forms: ['need', 'needed', 'needing'] },
  like: { present: 'like', past: 'liked', progressive: 'liking', forms: ['like', 'liked', 'liking'] },
  go: { present: 'go', past: 'went', progressive: 'going', forms: ['go', 'went', 'going'] },
  see: { present: 'see', past: 'saw', progressive: 'seeing', forms: ['see', 'saw', 'seeing'] },
  hear: { present: 'hear', past: 'heard', progressive: 'hearing', forms: ['hear', 'heard', 'hearing'] },
  have: { present: 'have', past: 'had', progressive: 'having', forms: ['have', 'had', 'having'] },
  feel: { present: 'feel', past: 'felt', progressive: 'feeling', forms: ['feel', 'felt', 'feeling'] },
  eat: { present: 'eat', past: 'ate', progressive: 'eating', forms: ['eat', 'ate', 'eating'] },
  drink: { present: 'drink', past: 'drank', progressive: 'drinking', forms: ['drink', 'drank', 'drinking'] },
  play: { present: 'play', past: 'played', progressive: 'playing', forms: ['play', 'played', 'playing'] },
  help: { present: 'help', past: 'helped', progressive: 'helping', forms: ['help', 'helped', 'helping'] },
  
  // Pronouns
  I: { subject: 'I', object: 'me', possessive: 'my', forms: ['I', 'me', 'my', 'mine'] },
  you: { subject: 'you', object: 'you', possessive: 'your', forms: ['you', 'your', 'yours'] },
  he: { subject: 'he', object: 'him', possessive: 'his', forms: ['he', 'him', 'his'] },
  she: { subject: 'she', object: 'her', possessive: 'her', forms: ['she', 'her', 'hers'] },
  we: { subject: 'we', object: 'us', possessive: 'our', forms: ['we', 'us', 'our', 'ours'] },
  they: { subject: 'they', object: 'them', possessive: 'their', forms: ['they', 'them', 'their', 'theirs'] },
  
  // Common nouns with plurals
  cookie: { singular: 'cookie', plural: 'cookies', forms: ['cookie', 'cookies'] },
  apple: { singular: 'apple', plural: 'apples', forms: ['apple', 'apples'] },
  toy: { singular: 'toy', plural: 'toys', forms: ['toy', 'toys'] },
  book: { singular: 'book', plural: 'books', forms: ['book', 'books'] },
  game: { singular: 'game', plural: 'games', forms: ['game', 'games'] },
};

// ============================================
// PREDICTION - Next word suggestions
// ============================================
const PREDICTION_RULES = {
  'I': ['want', 'need', 'like', 'feel', 'am', 'can', "can't", 'see', 'hear'],
  'I want': ['food', 'water', 'play', 'help', 'hug', 'break', 'home', 'outside'],
  'I need': ['help', 'bathroom', 'break', 'water', 'food', 'hug', 'time'],
  'I feel': ['happy', 'sad', 'angry', 'scared', 'tired', 'sick', 'hungry', 'excited'],
  'I am': ['happy', 'sad', 'tired', 'hungry', 'thirsty', 'done', 'ready', 'sorry'],
  'I like': ['food', 'play', 'music', 'book', 'game', 'outside', 'hug'],
  "I don't like": ['this', 'that', 'it', 'food', 'loud', 'waiting'],
  'you': ['want', 'need', 'can', 'help'],
  'can': ['I', 'you', 'we', 'help'],
  'want': ['more', 'food', 'water', 'play', 'help', 'home', 'outside'],
  'need': ['help', 'more', 'bathroom', 'break', 'water', 'food'],
  'go': ['home', 'outside', 'bathroom', 'park', 'school', 'car'],
};

// ============================================
// CORE VOCABULARY
// ============================================
const CORE_WORDS = {
  starters: [
    { id: 'i', text: 'I', emoji: '👤', color: '#4A9FD4' },
    { id: 'you', text: 'You', emoji: '👉', color: '#5CB85C' },
    { id: 'we', text: 'We', emoji: '👥', color: '#8E6BBF' },
    { id: 'he', text: 'He', emoji: '👦', color: '#4A9FD4' },
    { id: 'she', text: 'She', emoji: '👧', color: '#E86B9A' },
    { id: 'it', text: 'It', emoji: '👆', color: '#F5A623' },
  ],
  verbs: [
    { id: 'want', text: 'want', emoji: '🙏', color: '#E63B2E', needsNoun: true, hasSubmenu: true, hasMorphology: true },
    { id: 'need', text: 'need', emoji: '❗', color: '#E63B2E', needsNoun: true, hasSubmenu: true, hasMorphology: true },
    { id: 'like', text: 'like', emoji: '👍', color: '#5CB85C', needsNoun: true, hasSubmenu: true, hasMorphology: true },
    { id: 'dont-like', text: "don't like", emoji: '👎', color: '#E63B2E', needsNoun: true, hasSubmenu: true },
    { id: 'feel', text: 'feel', emoji: '💭', color: '#8E6BBF', needsAdjective: true, hasSubmenu: true, hasMorphology: true },
    { id: 'am', text: 'am', emoji: '✨', color: '#F5A623', needsAdjective: true, hasSubmenu: true },
    { id: 'see', text: 'see', emoji: '👀', color: '#4A9FD4', needsNoun: true, hasSubmenu: true, hasMorphology: true },
    { id: 'hear', text: 'hear', emoji: '👂', color: '#4A9FD4', needsNoun: true, hasSubmenu: true, hasMorphology: true },
    { id: 'have', text: 'have', emoji: '🤲', color: '#5CB85C', needsNoun: true, hasSubmenu: true, hasMorphology: true },
    { id: 'go', text: 'go', emoji: '🚶', color: '#4A9FD4', needsPlace: true, hasSubmenu: true, hasMorphology: true },
    { id: 'can', text: 'can', emoji: '💪', color: '#5CB85C' },
    { id: 'cant', text: "can't", emoji: '🚫', color: '#E63B2E' },
  ],
  adjectives: [
    { id: 'happy', text: 'happy', emoji: '😊', color: '#F8D14A' },
    { id: 'sad', text: 'sad', emoji: '😢', color: '#4A9FD4' },
    { id: 'angry', text: 'angry', emoji: '😠', color: '#E63B2E' },
    { id: 'scared', text: 'scared', emoji: '😨', color: '#8E6BBF' },
    { id: 'tired', text: 'tired', emoji: '😴', color: '#87CEEB' },
    { id: 'hungry', text: 'hungry', emoji: '🍽️', color: '#F5A623' },
    { id: 'thirsty', text: 'thirsty', emoji: '💧', color: '#4A9FD4' },
    { id: 'sick', text: 'sick', emoji: '🤒', color: '#8E6BBF' },
    { id: 'hurt', text: 'hurt', emoji: '🤕', color: '#E86B9A' },
    { id: 'excited', text: 'excited', emoji: '🤩', color: '#F5A623' },
    { id: 'bored', text: 'bored', emoji: '😑', color: '#87CEEB' },
    { id: 'hot', text: 'hot', emoji: '🥵', color: '#E63B2E' },
    { id: 'cold', text: 'cold', emoji: '🥶', color: '#4A9FD4' },
    { id: 'done', text: 'done', emoji: '✅', color: '#5CB85C' },
    { id: 'ready', text: 'ready', emoji: '👍', color: '#5CB85C' },
    { id: 'sorry', text: 'sorry', emoji: '😔', color: '#8E6BBF' },
  ],
  quickWords: [
    { id: 'yes', text: 'Yes', emoji: '✅', color: '#5CB85C' },
    { id: 'no', text: 'No', emoji: '❌', color: '#E63B2E' },
    { id: 'help', text: 'Help', emoji: '🙋', color: '#F5A623' },
    { id: 'stop', text: 'Stop', emoji: '🛑', color: '#E63B2E' },
    { id: 'more', text: 'More', emoji: '➕', color: '#4A9FD4' },
    { id: 'all-done', text: 'All done', emoji: '🏁', color: '#5CB85C' },
    { id: 'wait', text: 'Wait', emoji: '✋', color: '#F5A623' },
    { id: 'hello', text: 'Hello', emoji: '👋', color: '#4A9FD4' },
    { id: 'goodbye', text: 'Goodbye', emoji: '👋', color: '#8E6BBF' },
    { id: 'please', text: 'Please', emoji: '🙏', color: '#E86B9A' },
    { id: 'thank-you', text: 'Thank you', emoji: '💕', color: '#E86B9A' },
    { id: 'sorry', text: 'Sorry', emoji: '😔', color: '#87CEEB' },
    { id: 'bathroom', text: 'Bathroom', emoji: '🚽', color: '#8E6BBF' },
    { id: 'break', text: 'Break', emoji: '⏸️', color: '#F5A623' },
    { id: 'again', text: 'Again', emoji: '🔄', color: '#4A9FD4' },
    { id: 'my-turn', text: 'My turn', emoji: '👆', color: '#5CB85C' },
  ],
  questions: [
    { id: 'what', text: 'What?', emoji: '❓', color: '#4A9FD4' },
    { id: 'where', text: 'Where?', emoji: '📍', color: '#E63B2E' },
    { id: 'when', text: 'When?', emoji: '🕐', color: '#F5A623' },
    { id: 'who', text: 'Who?', emoji: '👤', color: '#8E6BBF' },
    { id: 'why', text: 'Why?', emoji: '🤔', color: '#5CB85C' },
    { id: 'how', text: 'How?', emoji: '💭', color: '#87CEEB' },
  ],
};

// ============================================
// FOOTER QUICK WORDS
// ============================================
const AVAILABLE_FOOTER_WORDS = [
  { id: 'yes', text: 'Yes', emoji: '✅', color: '#5CB85C' },
  { id: 'no', text: 'No', emoji: '❌', color: '#E63B2E' },
  { id: 'please', text: 'Please', emoji: '🙏', color: '#E86B9A' },
  { id: 'thank-you', text: 'Thank you', emoji: '💕', color: '#8E6BBF' },
  { id: 'help', text: 'Help', emoji: '🙋', color: '#F5A623' },
  { id: 'stop', text: 'Stop', emoji: '🛑', color: '#E63B2E' },
  { id: 'more', text: 'More', emoji: '➕', color: '#4A9FD4' },
  { id: 'all-done', text: 'All done', emoji: '🏁', color: '#5CB85C' },
  { id: 'wait', text: 'Wait', emoji: '✋', color: '#F5A623' },
  { id: 'bathroom', text: 'Bathroom', emoji: '🚽', color: '#8E6BBF' },
  { id: 'hungry', text: 'Hungry', emoji: '🍽️', color: '#F5A623' },
  { id: 'thirsty', text: 'Thirsty', emoji: '💧', color: '#4A9FD4' },
  { id: 'tired', text: 'Tired', emoji: '😴', color: '#87CEEB' },
  { id: 'hurt', text: 'Hurt', emoji: '🤕', color: '#E86B9A' },
  { id: 'happy', text: 'Happy', emoji: '😊', color: '#F8D14A' },
  { id: 'sad', text: 'Sad', emoji: '😢', color: '#4A9FD4' },
  { id: 'hello', text: 'Hello', emoji: '👋', color: '#4A9FD4' },
  { id: 'goodbye', text: 'Goodbye', emoji: '👋', color: '#8E6BBF' },
  { id: 'sorry', text: 'Sorry', emoji: '😔', color: '#87CEEB' },
  { id: 'my-turn', text: 'My turn', emoji: '👆', color: '#5CB85C' },
];

const DEFAULT_FOOTER_WORDS = ['yes', 'no', 'please', 'thank-you'];

// ============================================
// NOUN CATEGORIES
// ============================================
const NOUN_CATEGORIES = [
  { id: 'food', name: 'Food', emoji: '🍎', color: '#5CB85C' },
  { id: 'drinks', name: 'Drinks', emoji: '🥤', color: '#4A9FD4' },
  { id: 'activities', name: 'Activities', emoji: '🎮', color: '#8E6BBF' },
  { id: 'places', name: 'Places', emoji: '🏠', color: '#F5A623' },
  { id: 'people', name: 'People', emoji: '👨‍👩‍👧', color: '#E86B9A' },
  { id: 'things', name: 'Things', emoji: '🎾', color: '#F8D14A' },
  { id: 'body', name: 'Body', emoji: '🦵', color: '#E63B2E' },
  { id: 'feelings', name: 'Feelings', emoji: '💜', color: '#8E6BBF' },
];

const NOUNS = {
  food: [
    { id: 'apple', text: 'apple', emoji: '🍎', color: '#E63B2E', hasMorphology: true },
    { id: 'banana', text: 'banana', emoji: '🍌', color: '#F8D14A' },
    { id: 'cookie', text: 'cookie', emoji: '🍪', color: '#8B5A2B', hasMorphology: true },
    { id: 'pizza', text: 'pizza', emoji: '🍕', color: '#F5A623' },
    { id: 'sandwich', text: 'sandwich', emoji: '🥪', color: '#5CB85C' },
    { id: 'chicken', text: 'chicken', emoji: '🍗', color: '#F5A623' },
    { id: 'snack', text: 'snack', emoji: '🍿', color: '#E86B9A' },
    { id: 'breakfast', text: 'breakfast', emoji: '🥣', color: '#87CEEB' },
    { id: 'lunch', text: 'lunch', emoji: '🥗', color: '#5CB85C' },
    { id: 'dinner', text: 'dinner', emoji: '🍽️', color: '#8E6BBF' },
    { id: 'ice-cream', text: 'ice cream', emoji: '🍦', color: '#E86B9A' },
    { id: 'fruit', text: 'fruit', emoji: '🍇', color: '#8E6BBF' },
  ],
  drinks: [
    { id: 'water', text: 'water', emoji: '💧', color: '#4A9FD4' },
    { id: 'juice', text: 'juice', emoji: '🧃', color: '#F5A623' },
    { id: 'milk', text: 'milk', emoji: '🥛', color: '#FFFEF5', textColor: '#333' },
    { id: 'drink', text: 'drink', emoji: '🥤', color: '#4A9FD4' },
  ],
  activities: [
    { id: 'play', text: 'play', emoji: '🎮', color: '#5CB85C', hasMorphology: true },
    { id: 'read', text: 'read', emoji: '📚', color: '#8E6BBF' },
    { id: 'watch-tv', text: 'watch TV', emoji: '📺', color: '#87CEEB' },
    { id: 'outside', text: 'go outside', emoji: '🌳', color: '#5CB85C' },
    { id: 'sleep', text: 'sleep', emoji: '🛏️', color: '#8E6BBF' },
    { id: 'hug', text: 'a hug', emoji: '🤗', color: '#E86B9A' },
    { id: 'walk', text: 'walk', emoji: '🚶‍♂️', color: '#5CB85C' },
    { id: 'draw', text: 'draw', emoji: '✏️', color: '#F8D14A' },
    { id: 'music', text: 'music', emoji: '🎵', color: '#F5A623' },
    { id: 'swim', text: 'swim', emoji: '🏊', color: '#4A9FD4' },
    { id: 'game', text: 'game', emoji: '🎲', color: '#E63B2E', hasMorphology: true },
    { id: 'break', text: 'a break', emoji: '⏸️', color: '#87CEEB' },
  ],
  places: [
    { id: 'home', text: 'home', emoji: '🏠', color: '#8B5A2B' },
    { id: 'school', text: 'school', emoji: '🏫', color: '#E63B2E' },
    { id: 'park', text: 'park', emoji: '🌳', color: '#5CB85C' },
    { id: 'store', text: 'store', emoji: '🏪', color: '#4A9FD4' },
    { id: 'bathroom', text: 'bathroom', emoji: '🚽', color: '#87CEEB' },
    { id: 'bedroom', text: 'bedroom', emoji: '🛏️', color: '#8E6BBF' },
    { id: 'kitchen', text: 'kitchen', emoji: '🍳', color: '#F5A623' },
    { id: 'car', text: 'car', emoji: '🚗', color: '#E63B2E' },
    { id: 'doctor', text: 'doctor', emoji: '🏥', color: '#E86B9A' },
    { id: 'restaurant', text: 'restaurant', emoji: '🍽️', color: '#F5A623' },
    { id: 'playground', text: 'playground', emoji: '🛝', color: '#5CB85C' },
  ],
  people: [
    { id: 'mom', text: 'mom', emoji: '👩', color: '#E86B9A' },
    { id: 'dad', text: 'dad', emoji: '👨', color: '#4A9FD4' },
    { id: 'brother', text: 'brother', emoji: '👦', color: '#5CB85C' },
    { id: 'sister', text: 'sister', emoji: '👧', color: '#F5A623' },
    { id: 'grandma', text: 'grandma', emoji: '👵', color: '#8E6BBF' },
    { id: 'grandpa', text: 'grandpa', emoji: '👴', color: '#8B5A2B' },
    { id: 'teacher', text: 'teacher', emoji: '👩‍🏫', color: '#E63B2E' },
    { id: 'friend', text: 'friend', emoji: '🧑‍🤝‍🧑', color: '#F8D14A' },
  ],
  things: [
    { id: 'toy', text: 'toy', emoji: '🧸', color: '#8B5A2B', hasMorphology: true },
    { id: 'ball', text: 'ball', emoji: '⚽', color: '#5CB85C' },
    { id: 'book', text: 'book', emoji: '📖', color: '#8E6BBF', hasMorphology: true },
    { id: 'phone', text: 'phone', emoji: '📱', color: '#4A9FD4' },
    { id: 'tablet', text: 'tablet', emoji: '📱', color: '#87CEEB' },
    { id: 'blanket', text: 'blanket', emoji: '🛏️', color: '#E86B9A' },
    { id: 'clothes', text: 'clothes', emoji: '👕', color: '#F5A623' },
    { id: 'shoes', text: 'shoes', emoji: '👟', color: '#E63B2E' },
  ],
  body: [
    { id: 'head', text: 'head', emoji: '🗣️', color: '#F5A623' },
    { id: 'tummy', text: 'tummy', emoji: '😣', color: '#5CB85C' },
    { id: 'arm', text: 'arm', emoji: '💪', color: '#4A9FD4' },
    { id: 'leg', text: 'leg', emoji: '🦵', color: '#8E6BBF' },
    { id: 'hand', text: 'hand', emoji: '✋', color: '#F8D14A' },
    { id: 'foot', text: 'foot', emoji: '🦶', color: '#E63B2E' },
  ],
  feelings: [
    { id: 'happy', text: 'happy', emoji: '😊', color: '#F8D14A' },
    { id: 'sad', text: 'sad', emoji: '😢', color: '#4A9FD4' },
    { id: 'angry', text: 'angry', emoji: '😠', color: '#E63B2E' },
    { id: 'scared', text: 'scared', emoji: '😨', color: '#8E6BBF' },
    { id: 'excited', text: 'excited', emoji: '🤩', color: '#F5A623' },
    { id: 'calm', text: 'calm', emoji: '😌', color: '#87CEEB' },
  ],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

const loadFromStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage save error:', e);
  }
};

// ============================================
// VOICE SETTINGS HOOK
// ============================================

const useVoiceSettings = () => {
  const [settings, setSettings] = useState(() => 
    loadFromStorage(STORAGE_KEYS.voiceSettings, {
      rate: 0.9,
      pitch: 1.0,
      voiceIndex: 0,
    })
  );
  const [availableVoices, setAvailableVoices] = useState([]);
  
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      // Filter to English voices for simplicity
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      setAvailableVoices(englishVoices.length > 0 ? englishVoices : voices);
    };
    
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);
  
  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveToStorage(STORAGE_KEYS.voiceSettings, updated);
  };
  
  return { settings, updateSettings, availableVoices };
};

// ============================================
// SPEECH SYNTHESIS HOOK WITH SETTINGS
// ============================================

const useSpeech = (voiceSettings, availableVoices) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  const speak = useCallback((text) => {
    if (!isSupported || !text) return;
    
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceSettings.rate;
    utterance.pitch = voiceSettings.pitch;
    
    if (availableVoices.length > 0 && voiceSettings.voiceIndex < availableVoices.length) {
      utterance.voice = availableVoices[voiceSettings.voiceIndex];
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesis.speak(utterance);
  }, [isSupported, voiceSettings, availableVoices]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking, isSupported };
};

// ============================================
// RECENTS HOOK
// ============================================

const useRecents = (maxItems = 10) => {
  const [recents, setRecents] = useState(() => 
    loadFromStorage(STORAGE_KEYS.recents, [])
  );
  
  const addRecent = useCallback((word) => {
    setRecents(prev => {
      // Remove duplicates
      const filtered = prev.filter(w => w.id !== word.id);
      // Add to front, limit to maxItems
      const updated = [word, ...filtered].slice(0, maxItems);
      saveToStorage(STORAGE_KEYS.recents, updated);
      return updated;
    });
  }, [maxItems]);
  
  const clearRecents = useCallback(() => {
    setRecents([]);
    saveToStorage(STORAGE_KEYS.recents, []);
  }, []);
  
  return { recents, addRecent, clearRecents };
};

// ============================================
// ANALYTICS HOOK
// ============================================

const useAnalytics = () => {
  const [analytics, setAnalytics] = useState(() => 
    loadFromStorage(STORAGE_KEYS.analytics, {
      wordFrequency: {},
      phrasePatterns: {},
      sessionCount: 0,
      totalWords: 0,
      lastUsed: null,
      hourlyUsage: {},
    })
  );
  
  const trackWord = useCallback((word) => {
    const now = new Date();
    const hour = now.getHours();
    
    setAnalytics(prev => {
      const updated = {
        ...prev,
        wordFrequency: {
          ...prev.wordFrequency,
          [word.id]: (prev.wordFrequency[word.id] || 0) + 1,
        },
        totalWords: prev.totalWords + 1,
        lastUsed: now.toISOString(),
        hourlyUsage: {
          ...prev.hourlyUsage,
          [hour]: (prev.hourlyUsage[hour] || 0) + 1,
        },
      };
      saveToStorage(STORAGE_KEYS.analytics, updated);
      return updated;
    });
  }, []);
  
  const trackPhrase = useCallback((words) => {
    if (words.length < 2) return;
    const pattern = words.map(w => w.id).join(' → ');
    
    setAnalytics(prev => {
      const updated = {
        ...prev,
        phrasePatterns: {
          ...prev.phrasePatterns,
          [pattern]: (prev.phrasePatterns[pattern] || 0) + 1,
        },
      };
      saveToStorage(STORAGE_KEYS.analytics, updated);
      return updated;
    });
  }, []);
  
  const getTopWords = useCallback((limit = 10) => {
    return Object.entries(analytics.wordFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([id, count]) => ({ id, count }));
  }, [analytics.wordFrequency]);
  
  const clearAnalytics = useCallback(() => {
    const reset = {
      wordFrequency: {},
      phrasePatterns: {},
      sessionCount: 0,
      totalWords: 0,
      lastUsed: null,
      hourlyUsage: {},
    };
    setAnalytics(reset);
    saveToStorage(STORAGE_KEYS.analytics, reset);
  }, []);
  
  return { analytics, trackWord, trackPhrase, getTopWords, clearAnalytics };
};

// ============================================
// ACCESSIBILITY HOOK
// ============================================

const useAccessibility = () => {
  const [settings, setSettings] = useState(() => 
    loadFromStorage(STORAGE_KEYS.accessibility, {
      buttonSize: 'normal', // 'small', 'normal', 'large', 'xlarge'
      gridColumns: 4, // 3, 4, 5, 6
      highContrast: false,
      reducedMotion: false,
      showLabels: true,
    })
  );
  
  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveToStorage(STORAGE_KEYS.accessibility, updated);
  };
  
  return { settings, updateSettings };
};

// ============================================
// PARTNER SCANNING HOOK
// ============================================

const usePartnerScanning = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scanSpeed, setScanSpeed] = useState(2000); // ms
  const [scanItems, setScanItems] = useState([]);
  const scanIntervalRef = useRef(null);
  
  const startScanning = useCallback((items) => {
    setScanItems(items);
    setCurrentIndex(0);
    setIsScanning(true);
  }, []);
  
  const stopScanning = useCallback(() => {
    setIsScanning(false);
    setCurrentIndex(0);
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
  }, []);
  
  const selectCurrent = useCallback(() => {
    if (scanItems.length > 0 && currentIndex < scanItems.length) {
      return scanItems[currentIndex];
    }
    return null;
  }, [scanItems, currentIndex]);
  
  useEffect(() => {
    if (isScanning && scanItems.length > 0) {
      scanIntervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % scanItems.length);
      }, scanSpeed);
    }
    
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [isScanning, scanItems.length, scanSpeed]);
  
  return { 
    isScanning, 
    currentIndex, 
    scanSpeed, 
    setScanSpeed,
    startScanning, 
    stopScanning, 
    selectCurrent 
  };
};

// ============================================
// WORD BUTTON COMPONENT
// ============================================

const WordButton = ({ 
  word, 
  onClick, 
  size = 'normal', 
  showSubmenuIndicator = false,
  isHighlighted = false,
  highContrast = false,
  reducedMotion = false,
  onLongPress = null,
}) => {
  const longPressRef = useRef(null);
  const [isPressed, setIsPressed] = useState(false);
  
  const sizeConfig = {
    small: { 
      padding: 'p-2', 
      minHeight: 'min-h-[60px]', 
      text: 'text-xs',
      emoji: 'text-xl',
    },
    normal: { 
      padding: 'p-3', 
      minHeight: 'min-h-[80px]', 
      text: 'text-sm',
      emoji: 'text-2xl',
    },
    large: { 
      padding: 'p-4', 
      minHeight: 'min-h-[100px]', 
      text: 'text-base',
      emoji: 'text-3xl',
    },
    xlarge: { 
      padding: 'p-5', 
      minHeight: 'min-h-[120px]', 
      text: 'text-lg',
      emoji: 'text-4xl',
    },
  };
  
  const config = sizeConfig[size];
  
  const handleTouchStart = () => {
    setIsPressed(true);
    if (onLongPress) {
      longPressRef.current = setTimeout(() => {
        onLongPress(word);
      }, 500);
    }
  };
  
  const handleTouchEnd = () => {
    setIsPressed(false);
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
    }
  };
  
  return (
    <button
      onClick={() => onClick(word)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      className={`
        ${config.padding} ${config.minHeight} rounded-xl border-3 
        ${reducedMotion ? '' : 'transition-all hover:scale-105 active:scale-95'}
        shadow-md relative flex flex-col items-center justify-center gap-1
        ${isHighlighted ? 'ring-4 ring-yellow-400 ring-offset-2 animate-pulse' : ''}
        ${isPressed ? 'scale-95' : ''}
      `}
      style={{ 
        backgroundColor: highContrast ? (word.color === '#FFFEF5' ? '#000' : word.color) : word.color,
        borderColor: highContrast ? '#fff' : word.color,
        color: highContrast ? '#fff' : (word.textColor || 'white'),
      }}
    >
      {showSubmenuIndicator && word.hasSubmenu && (
        <div className="absolute top-1 right-1 bg-white/30 rounded-full p-0.5">
          <ChevronRight size={10} />
        </div>
      )}
      
      {word.hasMorphology && (
        <div className="absolute top-1 left-1 bg-white/30 rounded-full p-0.5">
          <Type size={8} />
        </div>
      )}
      
      <span className={`${config.emoji} leading-none`}>{word.emoji}</span>
      <span className={`font-crayon ${config.text} leading-tight text-center w-full`}>
        {word.text}
      </span>
    </button>
  );
};

// ============================================
// SENTENCE STRIP COMPONENT
// ============================================

const SentenceStrip = ({ words, onSpeak, onClear, onUndo, isSpeaking }) => {
  return (
    <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border-4 border-[#87CEEB] shadow-lg min-h-[70px]">
      <div className="flex-1 flex items-center gap-1 overflow-x-auto py-1">
        {words.length === 0 ? (
          <span className="font-crayon text-gray-400 text-sm">
            Tap words to build a sentence...
          </span>
        ) : (
          words.map((word, idx) => (
            <span 
              key={idx} 
              className="px-2 py-1 rounded-lg font-crayon text-white text-sm whitespace-nowrap flex items-center gap-1"
              style={{ backgroundColor: word.color }}
            >
              <span>{word.emoji}</span>
              <span>{word.text}</span>
            </span>
          ))
        )}
      </div>
      
      <div className="flex gap-1">
        <button
          onClick={onUndo}
          disabled={words.length === 0}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-30"
        >
          <Undo2 size={18} className="text-gray-600" />
        </button>
        <button
          onClick={onClear}
          disabled={words.length === 0}
          className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors disabled:opacity-30"
        >
          <Trash2 size={18} className="text-red-500" />
        </button>
        <button
          onClick={onSpeak}
          disabled={words.length === 0 || isSpeaking}
          className="p-2 rounded-full bg-[#5CB85C] hover:bg-green-600 text-white transition-colors disabled:opacity-30"
        >
          <Volume2 size={18} />
        </button>
      </div>
    </div>
  );
};

// ============================================
// RECENTS BAR COMPONENT
// ============================================

const RecentsBar = ({ recents, onWordClick, onClear }) => {
  if (recents.length === 0) return null;
  
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-2 border-2 border-amber-200">
      <div className="flex items-center gap-2 mb-1">
        <History size={14} className="text-amber-600" />
        <span className="font-crayon text-xs text-amber-700">Recent words</span>
        <button 
          onClick={onClear}
          className="ml-auto text-amber-500 hover:text-amber-700 text-xs"
        >
          Clear
        </button>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {recents.map((word, idx) => (
          <button
            key={`${word.id}-${idx}`}
            onClick={() => onWordClick(word)}
            className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg bg-white border-2 
                     hover:scale-105 active:scale-95 transition-all"
            style={{ borderColor: word.color }}
          >
            <span className="text-sm">{word.emoji}</span>
            <span className="font-crayon text-xs" style={{ color: word.color }}>
              {word.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================
// PREDICTION BAR COMPONENT
// ============================================

const PredictionBar = ({ sentence, onWordClick, allWords }) => {
  const predictions = useMemo(() => {
    if (sentence.length === 0) return [];
    
    // Build current phrase
    const phrase = sentence.map(w => w.text).join(' ');
    
    // Check for matching prediction rules
    for (const [pattern, suggestions] of Object.entries(PREDICTION_RULES)) {
      if (phrase.toLowerCase().endsWith(pattern.toLowerCase())) {
        return suggestions.slice(0, 5).map(text => {
          // Find the word object
          const foundWord = findWordByText(text, allWords);
          return foundWord || { id: text, text, emoji: '💬', color: '#87CEEB' };
        });
      }
    }
    
    // Default: show common follow-ups based on last word
    const lastWord = sentence[sentence.length - 1];
    if (PREDICTION_RULES[lastWord?.text]) {
      return PREDICTION_RULES[lastWord.text].slice(0, 5).map(text => {
        const foundWord = findWordByText(text, allWords);
        return foundWord || { id: text, text, emoji: '💬', color: '#87CEEB' };
      });
    }
    
    return [];
  }, [sentence, allWords]);
  
  if (predictions.length === 0) return null;
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-2 border-2 border-blue-200">
      <div className="flex items-center gap-2 mb-1">
        <Zap size={14} className="text-blue-600" />
        <span className="font-crayon text-xs text-blue-700">Next word suggestions</span>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {predictions.map((word, idx) => (
          <button
            key={`pred-${word.id}-${idx}`}
            onClick={() => onWordClick(word)}
            className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border-2 
                     hover:scale-105 active:scale-95 transition-all shadow-sm"
            style={{ borderColor: word.color }}
          >
            <span className="text-lg">{word.emoji}</span>
            <span className="font-crayon text-sm" style={{ color: word.color }}>
              {word.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Helper to find word by text
const findWordByText = (text, allWords) => {
  const searchText = text.toLowerCase();
  
  // Search in all word collections
  for (const word of CORE_WORDS.quickWords) {
    if (word.text.toLowerCase() === searchText) return word;
  }
  for (const word of CORE_WORDS.verbs) {
    if (word.text.toLowerCase() === searchText) return word;
  }
  for (const word of CORE_WORDS.adjectives) {
    if (word.text.toLowerCase() === searchText) return word;
  }
  for (const category of Object.values(NOUNS)) {
    for (const word of category) {
      if (word.text.toLowerCase() === searchText) return word;
    }
  }
  
  return null;
};

// ============================================
// MORPHOLOGY TOOLBAR COMPONENT
// ============================================

const MorphologyToolbar = ({ word, onSelect, onClose }) => {
  const morphology = WORD_MORPHOLOGY[word.text.toLowerCase()];
  
  if (!morphology) {
    onClose();
    return null;
  }
  
  return (
    <div className="fixed bottom-24 left-0 right-0 z-50 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border-4 border-purple-400 overflow-hidden">
        <div className="bg-purple-500 text-white p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type size={18} />
            <span className="font-display">Word forms: {word.text}</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={20} />
          </button>
        </div>
        <div className="p-3 flex flex-wrap gap-2">
          {morphology.forms.map((form, idx) => (
            <button
              key={form}
              onClick={() => {
                onSelect({ ...word, text: form, id: `${word.id}-${form}` });
                onClose();
              }}
              className="px-4 py-2 rounded-xl border-2 border-purple-300 bg-purple-50 
                       hover:bg-purple-100 hover:scale-105 active:scale-95 transition-all
                       font-crayon text-purple-700"
            >
              {form}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// QUICK PHRASES SECTION COMPONENT
// ============================================

const QuickPhrasesSection = ({ onSelect, buttonSize, highContrast, reducedMotion }) => {
  const [showAll, setShowAll] = useState(false);
  const displayPhrases = showAll ? QUICK_PHRASES : QUICK_PHRASES.slice(0, 8);
  
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border-2 border-purple-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-sm text-purple-700 flex items-center gap-1">
          <MessageSquare size={16} />
          Quick Phrases
        </h3>
        <button 
          onClick={() => setShowAll(!showAll)}
          className="text-xs font-crayon text-purple-600 hover:text-purple-800"
        >
          {showAll ? 'Show less' : `Show all (${QUICK_PHRASES.length})`}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {displayPhrases.map(phrase => (
          <button
            key={phrase.id}
            onClick={() => onSelect(phrase)}
            className={`p-3 rounded-xl border-2 text-left flex items-start gap-2
                      hover:scale-102 active:scale-98 transition-all
                      ${reducedMotion ? '' : 'hover:shadow-md'}`}
            style={{ 
              borderColor: phrase.color,
              backgroundColor: highContrast ? phrase.color : `${phrase.color}15`,
            }}
          >
            <span className="text-xl flex-shrink-0">{phrase.emoji}</span>
            <span 
              className="font-crayon text-sm leading-tight"
              style={{ color: highContrast ? '#fff' : phrase.color }}
            >
              {phrase.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================
// SCANNING OVERLAY COMPONENT
// ============================================

const ScanningOverlay = ({ isActive, onSelect, onStop, scanSpeed, onSpeedChange }) => {
  if (!isActive) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 p-3 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="animate-pulse">
            <Target size={24} className="text-yellow-800" />
          </div>
          <span className="font-display text-yellow-900">Partner Scanning Active</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-yellow-800">Speed:</span>
            <input
              type="range"
              min="500"
              max="4000"
              step="250"
              value={scanSpeed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-sm text-yellow-800">{scanSpeed / 1000}s</span>
          </div>
          
          <button
            onClick={onSelect}
            className="px-6 py-2 bg-green-500 text-white rounded-xl font-display 
                     hover:bg-green-600 active:scale-95 transition-all shadow-lg"
          >
            SELECT
          </button>
          
          <button
            onClick={onStop}
            className="px-4 py-2 bg-red-500 text-white rounded-xl font-display 
                     hover:bg-red-600 active:scale-95 transition-all"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// ANALYTICS MODAL COMPONENT
// ============================================

const AnalyticsModal = ({ isOpen, onClose, analytics, getTopWords, onClear }) => {
  if (!isOpen) return null;
  
  const topWords = getTopWords(15);
  const maxCount = topWords[0]?.count || 1;
  
  // Peak usage hours
  const peakHours = Object.entries(analytics.hourlyUsage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFEF5] w-full max-w-lg rounded-3xl overflow-hidden border-4 border-[#8E6BBF] max-h-[80vh] flex flex-col">
        <div className="bg-[#8E6BBF] text-white p-4 flex items-center justify-between flex-shrink-0">
          <h3 className="font-display text-xl flex items-center gap-2">
            <BarChart2 size={24} />
            Usage Analytics
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-display text-blue-600">{analytics.totalWords}</p>
              <p className="text-xs font-crayon text-blue-500">Total Words</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-display text-green-600">
                {Object.keys(analytics.wordFrequency).length}
              </p>
              <p className="text-xs font-crayon text-green-500">Unique Words</p>
            </div>
          </div>
          
          {/* Top Words */}
          <div className="mb-4">
            <h4 className="font-display text-sm text-gray-700 mb-2">Most Used Words</h4>
            {topWords.length > 0 ? (
              <div className="space-y-1.5">
                {topWords.map(({ id, count }) => {
                  const word = findWordByText(id, {}) || { emoji: '💬', text: id };
                  return (
                    <div key={id} className="flex items-center gap-2">
                      <span className="text-lg w-6">{word.emoji}</span>
                      <span className="font-crayon text-sm flex-1">{id}</span>
                      <div className="flex-1 max-w-24">
                        <div 
                          className="h-3 rounded-full bg-purple-400"
                          style={{ width: `${(count / maxCount) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No data yet</p>
            )}
          </div>
          
          {/* Peak Hours */}
          {peakHours.length > 0 && (
            <div className="mb-4">
              <h4 className="font-display text-sm text-gray-700 mb-2">Peak Usage Times</h4>
              <div className="flex gap-2">
                {peakHours.map(([hour, count]) => (
                  <div key={hour} className="bg-amber-50 rounded-lg px-3 py-2 text-center">
                    <p className="font-display text-amber-600">
                      {hour > 12 ? `${hour - 12}PM` : hour === 0 ? '12AM' : `${hour}AM`}
                    </p>
                    <p className="text-xs text-amber-500">{count} words</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button
            onClick={() => {
              if (confirm('Clear all analytics data?')) {
                onClear();
              }
            }}
            className="w-full py-2 border-2 border-red-300 text-red-500 rounded-xl font-crayon
                     hover:bg-red-50 transition-colors"
          >
            Clear Analytics Data
          </button>
        </div>
        
        <div className="p-4 border-t flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#8E6BBF] text-white rounded-xl font-display hover:bg-purple-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SETTINGS MODAL COMPONENT
// ============================================

const SettingsModal = ({ 
  isOpen, 
  onClose, 
  voiceSettings, 
  onVoiceChange, 
  availableVoices,
  accessibility,
  onAccessibilityChange,
  onShowAnalytics,
  onStartScanning,
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFEF5] w-full max-w-md rounded-3xl overflow-hidden border-4 border-[#4A9FD4] max-h-[85vh] flex flex-col">
        <div className="bg-[#4A9FD4] text-white p-4 flex items-center justify-between flex-shrink-0">
          <h3 className="font-display text-xl flex items-center gap-2">
            <Settings size={24} />
            Settings
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1 space-y-6">
          {/* Voice Settings */}
          <div>
            <h4 className="font-display text-lg text-gray-800 mb-3 flex items-center gap-2">
              <Volume2 size={18} />
              Voice Settings
            </h4>
            
            <div className="space-y-4">
              {/* Voice Selection */}
              {availableVoices.length > 0 && (
                <div>
                  <label className="block text-sm font-crayon text-gray-600 mb-1">Voice</label>
                  <select
                    value={voiceSettings.voiceIndex}
                    onChange={(e) => onVoiceChange({ voiceIndex: Number(e.target.value) })}
                    className="w-full p-2 border-2 border-gray-200 rounded-xl font-crayon"
                  >
                    {availableVoices.map((voice, idx) => (
                      <option key={idx} value={idx}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Speech Rate */}
              <div>
                <label className="block text-sm font-crayon text-gray-600 mb-1">
                  Speed: {voiceSettings.rate.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={voiceSettings.rate}
                  onChange={(e) => onVoiceChange({ rate: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Slower</span>
                  <span>Faster</span>
                </div>
              </div>
              
              {/* Pitch */}
              <div>
                <label className="block text-sm font-crayon text-gray-600 mb-1">
                  Pitch: {voiceSettings.pitch.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={voiceSettings.pitch}
                  onChange={(e) => onVoiceChange({ pitch: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Lower</span>
                  <span>Higher</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Button Size */}
          <div>
            <h4 className="font-display text-lg text-gray-800 mb-3 flex items-center gap-2">
              <Maximize2 size={18} />
              Button Size
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {['small', 'normal', 'large', 'xlarge'].map((size) => (
                <button
                  key={size}
                  onClick={() => onAccessibilityChange({ buttonSize: size })}
                  className={`p-3 rounded-xl border-3 font-crayon text-sm capitalize transition-all
                    ${accessibility.buttonSize === size 
                      ? 'border-[#5CB85C] bg-[#5CB85C]/10 text-[#5CB85C]' 
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {size === 'xlarge' ? 'XL' : size.charAt(0).toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          {/* Grid Columns */}
          <div>
            <h4 className="font-display text-lg text-gray-800 mb-3 flex items-center gap-2">
              <Grid size={18} />
              Grid Size
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {[3, 4, 5, 6].map((cols) => (
                <button
                  key={cols}
                  onClick={() => onAccessibilityChange({ gridColumns: cols })}
                  className={`p-3 rounded-xl border-3 font-crayon transition-all
                    ${accessibility.gridColumns === cols 
                      ? 'border-[#5CB85C] bg-[#5CB85C]/10 text-[#5CB85C]' 
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {cols}×{cols}
                </button>
              ))}
            </div>
          </div>
          
          {/* Accessibility Options */}
          <div>
            <h4 className="font-display text-lg text-gray-800 mb-3 flex items-center gap-2">
              <Accessibility size={18} />
              Accessibility
            </h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                <span className="font-crayon flex items-center gap-2">
                  <Contrast size={18} />
                  High Contrast
                </span>
                <input
                  type="checkbox"
                  checked={accessibility.highContrast}
                  onChange={(e) => onAccessibilityChange({ highContrast: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
              </label>
              
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                <span className="font-crayon flex items-center gap-2">
                  <PauseCircle size={18} />
                  Reduced Motion
                </span>
                <input
                  type="checkbox"
                  checked={accessibility.reducedMotion}
                  onChange={(e) => onAccessibilityChange({ reducedMotion: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
              </label>
            </div>
          </div>
          
          {/* Tools */}
          <div>
            <h4 className="font-display text-lg text-gray-800 mb-3 flex items-center gap-2">
              <SlidersHorizontal size={18} />
              Tools
            </h4>
            <div className="space-y-2">
              <button
                onClick={onStartScanning}
                className="w-full p-3 border-2 border-yellow-400 bg-yellow-50 rounded-xl font-crayon
                         text-yellow-700 hover:bg-yellow-100 transition-colors flex items-center justify-center gap-2"
              >
                <Target size={18} />
                Start Partner Scanning
              </button>
              
              <button
                onClick={onShowAnalytics}
                className="w-full p-3 border-2 border-purple-400 bg-purple-50 rounded-xl font-crayon
                         text-purple-700 hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
              >
                <BarChart2 size={18} />
                View Usage Analytics
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#4A9FD4] text-white rounded-xl font-display hover:bg-blue-600"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// ADD WORD MODAL (existing, cleaned up)
// ============================================

const AddWordModal = ({ isOpen, onClose, onSave, isLoading }) => {
  const [text, setText] = useState('');
  const [emoji, setEmoji] = useState('💬');
  const [color, setColor] = useState('#4A9FD4');
  const [category, setCategory] = useState('things');
  
  if (!isOpen) return null;
  
  const colors = ['#E63B2E', '#F5A623', '#F8D14A', '#5CB85C', '#4A9FD4', '#8E6BBF', '#E86B9A', '#87CEEB'];
  
  const handleSave = () => {
    if (!text.trim()) return;
    onSave({
      id: `custom-${Date.now()}`,
      text: text.trim(),
      emoji,
      color,
      category,
      isCustom: true,
    });
    setText('');
    setEmoji('💬');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFEF5] w-full max-w-sm rounded-3xl overflow-hidden border-4 border-[#5CB85C]">
        <div className="bg-[#5CB85C] text-white p-4 flex items-center justify-between">
          <h3 className="font-display text-xl flex items-center gap-2">
            <Plus size={24} />
            Add Word
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-crayon text-gray-600 mb-1">Word</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter word..."
              className="w-full p-3 border-2 border-gray-200 rounded-xl font-crayon focus:border-[#5CB85C] outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-crayon text-gray-600 mb-1">Emoji</label>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl text-2xl text-center focus:border-[#5CB85C] outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-crayon text-gray-600 mb-1">Color</label>
            <div className="flex gap-2 flex-wrap">
              {colors.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-3 ${color === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-crayon text-gray-600 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl font-crayon focus:border-[#5CB85C] outline-none"
            >
              {NOUN_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-crayon hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!text.trim() || isLoading}
              className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl font-crayon 
                       hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// LAYOUT INFO MODAL
// ============================================

const LayoutInfoModal = ({ isOpen, onClose, layout }) => {
  if (!isOpen || !layout) return null;
  
  const info = LAYOUT_INFO[layout];
  const Icon = info.icon;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFEF5] w-full max-w-sm rounded-3xl overflow-hidden border-4" style={{ borderColor: info.color }}>
        <div className="p-4 text-white flex items-center gap-3" style={{ backgroundColor: info.color }}>
          <Icon size={28} />
          <h3 className="font-display text-xl">{info.title} Layout</h3>
          <button onClick={onClose} className="ml-auto p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <p className="font-crayon text-gray-700 mb-4">{info.description}</p>
          <p className="font-crayon text-gray-500 text-sm">{info.details}</p>
          <button
            onClick={onClose}
            className="w-full mt-6 py-3 rounded-xl font-display text-white"
            style={{ backgroundColor: info.color }}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const PointToTalk = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  
  // Voice settings
  const { settings: voiceSettings, updateSettings: updateVoiceSettings, availableVoices } = useVoiceSettings();
  const { speak, isSpeaking } = useSpeech(voiceSettings, availableVoices);
  
  // Accessibility
  const { settings: accessibility, updateSettings: updateAccessibility } = useAccessibility();
  
  // Recents & Analytics
  const { recents, addRecent, clearRecents } = useRecents(10);
  const { analytics, trackWord, trackPhrase, getTopWords, clearAnalytics } = useAnalytics();
  
  // Partner scanning
  const { 
    isScanning, 
    currentIndex, 
    scanSpeed, 
    setScanSpeed,
    startScanning, 
    stopScanning, 
    selectCurrent 
  } = usePartnerScanning();
  
  // Core state
  const [sentence, setSentence] = useState([]);
  const [view, setView] = useState('main');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [footerWords, setFooterWords] = useState(() => 
    loadFromStorage(STORAGE_KEYS.footer, DEFAULT_FOOTER_WORDS)
  );
  const [editingFooter, setEditingFooter] = useState(false);
  const [tempFooterWords, setTempFooterWords] = useState([]);
  
  // Layout state
  const [layout, setLayout] = useState(() => loadFromStorage(STORAGE_KEYS.layout, 'basic'));
  const [customWords, setCustomWords] = useState(() => loadFromStorage(STORAGE_KEYS.customWords, []));
  const [cloudWords, setCloudWords] = useState([]);
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLayoutInfo, setShowLayoutInfo] = useState(false);
  const [selectedLayoutInfo, setSelectedLayoutInfo] = useState(null);
  
  // Morphology state
  const [morphologyWord, setMorphologyWord] = useState(null);
  
  // Contextual state
  const lastWord = sentence[sentence.length - 1];
  const needsNoun = lastWord?.needsNoun;
  const needsAdjective = lastWord?.needsAdjective;
  const needsPlace = lastWord?.needsPlace;
  
  // Save layout changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.layout, layout);
  }, [layout]);
  
  // Load cloud words
  useEffect(() => {
    if (layout === 'cloud' && isSupabaseConfigured()) {
      loadCloudWords();
    }
  }, [layout]);
  
  const loadCloudWords = async () => {
    setLoadingCloud(true);
    try {
      const { data, error } = await supabase
        .from('aac_words')
        .select('*')
        .eq('is_public', true)
        .gte('use_count', 2)
        .order('use_count', { ascending: false })
        .limit(100);
      
      if (!error && data) {
        setCloudWords(data);
      }
    } catch (err) {
      console.error('Error loading cloud words:', err);
    }
    setLoadingCloud(false);
  };
  
  // Add custom word
  const handleAddCustomWord = async (word) => {
    const newWords = [...customWords, word];
    setCustomWords(newWords);
    saveToStorage(STORAGE_KEYS.customWords, newWords);
    
    if (user && !user.isGuest && isSupabaseConfigured()) {
      try {
        await supabase.from('aac_words').insert({
          text: word.text,
          text_normalized: word.text.toLowerCase().trim(),
          emoji: word.emoji,
          color: word.color,
          category: word.category,
          is_public: true,
          use_count: 0,
          created_by: user.id,
        });
        toast.success('Word Added', 'Saved locally and to cloud');
      } catch (err) {
        toast.success('Word Added', 'Saved locally');
      }
    } else {
      toast.success('Word Added', 'Saved to your library');
    }
  };
  
  // Add word to sentence
  const addWord = useCallback((word) => {
    setSentence(prev => [...prev, word]);
    speak(word.text);
    addRecent(word);
    trackWord(word);
    
    if (word.needsNoun) setView('categories');
    else if (word.needsPlace) {
      setSelectedCategory('places');
      setView('nouns');
    }
  }, [speak, addRecent, trackWord]);
  
  // Handle quick phrase (speaks immediately)
  const handleQuickPhrase = useCallback((phrase) => {
    speak(phrase.text);
    trackWord(phrase);
    toast.success('Speaking', phrase.text);
  }, [speak, trackWord, toast]);
  
  // Handle morphology selection
  const handleMorphologySelect = useCallback((word) => {
    setSentence(prev => [...prev, word]);
    speak(word.text);
    addRecent(word);
    trackWord(word);
  }, [speak, addRecent, trackWord]);

  // Add noun and return to main
  const addNoun = (noun) => {
    setSentence(prev => [...prev, noun]);
    speak(noun.text);
    addRecent(noun);
    trackWord(noun);
    setView('main');
    setSelectedCategory(null);
  };

  // Actions
  const speakSentence = () => {
    if (sentence.length > 0) {
      const text = sentence.map(w => w.text).join(' ');
      speak(text);
      trackPhrase(sentence);
    }
  };
  
  const clearSentence = () => setSentence([]);
  const undoLastWord = () => setSentence(prev => prev.slice(0, -1));
  
  const selectCategory = (cat) => {
    setSelectedCategory(cat.id);
    setView('nouns');
  };
  
  const goBack = () => {
    if (view === 'nouns') {
      setView('categories');
      setSelectedCategory(null);
    } else if (view === 'categories') {
      setView('main');
    }
  };

  // Footer editing
  const startEditingFooter = () => {
    setTempFooterWords([...footerWords]);
    setEditingFooter(true);
  };
  
  const toggleFooterWord = (wordId) => {
    if (tempFooterWords.includes(wordId)) {
      setTempFooterWords(prev => prev.filter(id => id !== wordId));
    } else if (tempFooterWords.length < 4) {
      setTempFooterWords(prev => [...prev, wordId]);
    }
  };
  
  const saveFooterConfig = () => {
    if (tempFooterWords.length === 4) {
      setFooterWords(tempFooterWords);
      saveToStorage(STORAGE_KEYS.footer, tempFooterWords);
      setEditingFooter(false);
    }
  };
  
  const cancelFooterEdit = () => {
    setTempFooterWords([]);
    setEditingFooter(false);
  };
  
  const resetFooterDefaults = () => {
    setTempFooterWords([...DEFAULT_FOOTER_WORDS]);
  };
  
  const getFooterWord = (wordId) => {
    return AVAILABLE_FOOTER_WORDS.find(w => w.id === wordId) || AVAILABLE_FOOTER_WORDS[0];
  };

  // Get words based on layout
  const getWordsForCategory = (categoryId) => {
    const baseWords = NOUNS[categoryId] || [];
    
    if (layout === 'personal') {
      const myWords = customWords.filter(w => w.category === categoryId);
      return [...myWords, ...baseWords];
    }
    
    if (layout === 'cloud') {
      const cloudCatWords = cloudWords.filter(w => w.category === categoryId);
      return [...cloudCatWords.map(w => ({
        id: w.id,
        text: w.text,
        emoji: w.emoji,
        color: w.color,
        useCount: w.use_count,
      })), ...baseWords];
    }
    
    const myWords = customWords.filter(w => w.category === categoryId);
    return [...baseWords, ...myWords];
  };
  
  // Handle long press for morphology
  const handleLongPress = (word) => {
    if (word.hasMorphology && WORD_MORPHOLOGY[word.text.toLowerCase()]) {
      setMorphologyWord(word);
    }
  };
  
  // Get all words for prediction
  const allWords = useMemo(() => {
    const words = [];
    Object.values(CORE_WORDS).forEach(category => {
      if (Array.isArray(category)) words.push(...category);
    });
    Object.values(NOUNS).forEach(category => {
      words.push(...category);
    });
    return words;
  }, []);
  
  // Start partner scanning
  const handleStartScanning = () => {
    const items = [...CORE_WORDS.quickWords, ...CORE_WORDS.starters, ...CORE_WORDS.verbs];
    startScanning(items);
    setShowSettings(false);
  };
  
  // Handle scan select
  const handleScanSelect = () => {
    const item = selectCurrent();
    if (item) {
      addWord(item);
    }
  };

  // Grid columns class
  const gridColsClass = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }[accessibility.gridColumns] || 'grid-cols-4';

  return (
    <div className={`min-h-screen bg-[#FFFEF5] flex flex-col pb-20 ${isScanning ? 'pt-16' : ''}`}>
      {/* Partner Scanning Overlay */}
      <ScanningOverlay
        isActive={isScanning}
        onSelect={handleScanSelect}
        onStop={stopScanning}
        scanSpeed={scanSpeed}
        onSpeedChange={setScanSpeed}
      />
      
      {/* Morphology Toolbar */}
      {morphologyWord && (
        <MorphologyToolbar
          word={morphologyWord}
          onSelect={handleMorphologySelect}
          onClose={() => setMorphologyWord(null)}
        />
      )}
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#4A9FD4]">
        <div className="max-w-4xl mx-auto px-3 py-2 flex items-center gap-2">
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-1 px-3 py-2 bg-white border-3 border-[#4A9FD4] 
                     rounded-xl font-display font-bold text-[#4A9FD4] hover:bg-[#4A9FD4] 
                     hover:text-white transition-all text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-display text-[#4A9FD4]">💬 Point to Talk</h1>
          </div>
          
          {/* Add Word Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 bg-[#5CB85C] text-white rounded-full hover:bg-green-600 transition-colors"
            title="Add custom word"
          >
            <Plus size={18} />
          </button>
          
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 bg-white border-2 border-gray-200 rounded-full hover:border-[#4A9FD4] transition-colors"
          >
            <Settings size={18} className="text-gray-600" />
          </button>
        </div>
        
        {/* Layout Selector */}
        <div className="max-w-4xl mx-auto px-3 pb-2 flex gap-2">
          {Object.entries(LAYOUT_INFO).map(([key, info]) => {
            const Icon = info.icon;
            return (
              <button
                key={key}
                onClick={() => setLayout(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl font-crayon text-xs transition-all
                  ${layout === key 
                    ? 'text-white shadow-md' 
                    : 'bg-white border-2 text-gray-600 hover:border-gray-400'
                  }`}
                style={layout === key ? { backgroundColor: info.color, borderColor: info.color } : { borderColor: '#e5e7eb' }}
              >
                <Icon size={14} />
                {info.title}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLayoutInfo(key);
                    setShowLayoutInfo(true);
                  }}
                  className="ml-1 opacity-60 hover:opacity-100"
                >
                  <Info size={12} />
                </button>
              </button>
            );
          })}
        </div>
      </header>

      {/* Sentence Strip */}
      <div className="px-3 py-2 bg-gradient-to-b from-[#87CEEB]/20 to-transparent">
        <div className="max-w-4xl mx-auto space-y-2">
          <SentenceStrip 
            words={sentence}
            onSpeak={speakSentence}
            onClear={clearSentence}
            onUndo={undoLastWord}
            isSpeaking={isSpeaking}
          />
          
          {/* Prediction Bar */}
          <PredictionBar 
            sentence={sentence}
            onWordClick={addWord}
            allWords={allWords}
          />
          
          {/* Recents Bar */}
          <RecentsBar 
            recents={recents}
            onWordClick={addWord}
            onClear={clearRecents}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-3 py-3 overflow-y-auto">
        {view === 'main' && (
          <div className="space-y-4">
            {/* Quick Phrases Section */}
            <QuickPhrasesSection 
              onSelect={handleQuickPhrase}
              buttonSize={accessibility.buttonSize}
              highContrast={accessibility.highContrast}
              reducedMotion={accessibility.reducedMotion}
            />
            
            {/* Quick Words */}
            <div>
              <h3 className="font-display text-sm text-gray-600 mb-2 flex items-center gap-1">
                ⚡ Quick Words
              </h3>
              <div className={`grid ${gridColsClass} gap-2`}>
                {CORE_WORDS.quickWords.map((word, idx) => (
                  <WordButton 
                    key={word.id} 
                    word={word} 
                    onClick={addWord}
                    size={accessibility.buttonSize}
                    isHighlighted={isScanning && currentIndex === idx}
                    highContrast={accessibility.highContrast}
                    reducedMotion={accessibility.reducedMotion}
                    onLongPress={handleLongPress}
                  />
                ))}
              </div>
            </div>
            
            {/* Show adjectives if needed */}
            {needsAdjective && (
              <div className="bg-purple-50 rounded-xl p-3 border-3 border-purple-200 animate-pulse-once">
                <h3 className="font-display text-sm text-purple-700 mb-2">💭 How do you feel?</h3>
                <div className={`grid ${gridColsClass} gap-2`}>
                  {CORE_WORDS.adjectives.map(word => (
                    <WordButton 
                      key={word.id} 
                      word={word} 
                      onClick={addWord}
                      size={accessibility.buttonSize}
                      highContrast={accessibility.highContrast}
                      reducedMotion={accessibility.reducedMotion}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Starters */}
            {!needsAdjective && (
              <div>
                <h3 className="font-display text-sm text-gray-600 mb-2">👤 Start with...</h3>
                <div className={`grid grid-cols-6 gap-2`}>
                  {CORE_WORDS.starters.map(word => (
                    <WordButton 
                      key={word.id} 
                      word={word} 
                      onClick={addWord}
                      size={accessibility.buttonSize}
                      highContrast={accessibility.highContrast}
                      reducedMotion={accessibility.reducedMotion}
                      onLongPress={handleLongPress}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Verbs */}
            {!needsAdjective && (
              <div>
                <h3 className="font-display text-sm text-gray-600 mb-2">💬 Actions</h3>
                <div className={`grid ${gridColsClass} gap-2`}>
                  {CORE_WORDS.verbs.map(word => (
                    <WordButton 
                      key={word.id} 
                      word={word} 
                      onClick={addWord}
                      size={accessibility.buttonSize}
                      showSubmenuIndicator
                      highContrast={accessibility.highContrast}
                      reducedMotion={accessibility.reducedMotion}
                      onLongPress={handleLongPress}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Questions */}
            <div>
              <h3 className="font-display text-sm text-gray-600 mb-2">❓ Questions</h3>
              <div className={`grid grid-cols-6 gap-2`}>
                {CORE_WORDS.questions.map(word => (
                  <WordButton 
                    key={word.id} 
                    word={word} 
                    onClick={addWord}
                    size={accessibility.buttonSize}
                    highContrast={accessibility.highContrast}
                    reducedMotion={accessibility.reducedMotion}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Categories View */}
        {view === 'categories' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={goBack}
                className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h3 className="font-display text-lg text-gray-700">Choose a category</h3>
            </div>
            <div className={`grid ${gridColsClass} gap-3`}>
              {NOUN_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(cat)}
                  className={`p-4 rounded-xl border-3 flex flex-col items-center justify-center gap-2
                            hover:scale-105 active:scale-95 transition-all shadow-md`}
                  style={{ 
                    backgroundColor: cat.color, 
                    borderColor: cat.color,
                    minHeight: accessibility.buttonSize === 'xlarge' ? '120px' : 
                              accessibility.buttonSize === 'large' ? '100px' : '80px'
                  }}
                >
                  <span className={accessibility.buttonSize === 'xlarge' ? 'text-4xl' : 
                                  accessibility.buttonSize === 'large' ? 'text-3xl' : 'text-2xl'}>
                    {cat.emoji}
                  </span>
                  <span className="font-crayon text-white text-sm">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nouns View */}
        {view === 'nouns' && selectedCategory && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={goBack}
                className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h3 className="font-display text-lg text-gray-700">
                {NOUN_CATEGORIES.find(c => c.id === selectedCategory)?.emoji}{' '}
                {NOUN_CATEGORIES.find(c => c.id === selectedCategory)?.name}
              </h3>
            </div>
            <div className={`grid ${gridColsClass} gap-2`}>
              {getWordsForCategory(selectedCategory).map(word => (
                <WordButton 
                  key={word.id} 
                  word={word} 
                  onClick={addNoun}
                  size={accessibility.buttonSize}
                  highContrast={accessibility.highContrast}
                  reducedMotion={accessibility.reducedMotion}
                  onLongPress={handleLongPress}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer - Quick Words */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t-4 border-[#4A9FD4] z-40">
        <div className="max-w-4xl mx-auto px-3 py-2 flex items-center justify-around gap-2">
          {footerWords.map((wordId) => {
            const word = getFooterWord(wordId);
            return (
              <button
                key={wordId}
                onClick={() => addWord(word)}
                className={`flex flex-col items-center p-2 rounded-xl transition-all 
                          ${accessibility.reducedMotion ? '' : 'hover:scale-105 active:scale-95'}`}
                style={{ backgroundColor: `${word.color}20` }}
              >
                <span className="text-2xl">{word.emoji}</span>
                <span className="font-crayon text-xs" style={{ color: word.color }}>
                  {word.text}
                </span>
              </button>
            );
          })}
          
          <button
            onClick={startEditingFooter}
            className="flex flex-col items-center p-2 text-gray-400 hover:text-[#4A9FD4] transition-colors"
            title="Customize quick words"
          >
            <Edit2 size={20} />
            <span className="text-xs font-crayon mt-0.5">Edit</span>
          </button>
        </div>
      </nav>

      {/* Footer Edit Modal */}
      {editingFooter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#FFFEF5] w-full max-w-md rounded-3xl overflow-hidden border-4 border-[#F5A623]">
            <div className="bg-[#F5A623] text-white p-4 flex items-center justify-between">
              <h3 className="font-display text-xl flex items-center gap-2">
                <Edit2 size={24} />
                Customize Quick Words
              </h3>
              <button onClick={cancelFooterEdit} className="p-1 hover:bg-white/20 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4">
              <p className="font-crayon text-gray-600 text-center mb-4">
                Choose 4 words for your quick access bar
              </p>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                <p className="font-crayon text-xs text-gray-500 mb-2">Selected ({tempFooterWords.length}/4):</p>
                <div className="flex justify-around min-h-[50px] items-center">
                  {tempFooterWords.map((wordId, idx) => {
                    const word = getFooterWord(wordId);
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <span className="text-2xl">{word.emoji}</span>
                        <span className="text-xs font-crayon" style={{ color: word.color }}>{word.text}</span>
                      </div>
                    );
                  })}
                  {[...Array(4 - tempFooterWords.length)].map((_, idx) => (
                    <div key={`empty-${idx}`} className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg" />
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
                {AVAILABLE_FOOTER_WORDS.map(word => {
                  const isSelected = tempFooterWords.includes(word.id);
                  return (
                    <button
                      key={word.id}
                      onClick={() => toggleFooterWord(word.id)}
                      disabled={!isSelected && tempFooterWords.length >= 4}
                      className={`p-2 rounded-xl border-3 flex flex-col items-center transition-all relative
                        ${isSelected 
                          ? 'border-green-500 bg-green-50 ring-2 ring-green-300' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                        }
                        ${!isSelected && tempFooterWords.length >= 4 ? 'opacity-40 cursor-not-allowed' : ''}
                      `}
                    >
                      <span className="text-xl">{word.emoji}</span>
                      <span className="text-xs font-crayon mt-1 truncate w-full text-center" style={{ color: word.color }}>
                        {word.text}
                      </span>
                      {isSelected && (
                        <Check size={14} className="text-green-500 absolute top-1 right-1" />
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 flex gap-2">
                <button
                  onClick={resetFooterDefaults}
                  className="flex-1 py-2 px-3 border-3 border-gray-200 rounded-xl font-crayon text-gray-600
                           hover:bg-gray-50 transition-all flex items-center justify-center gap-1"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
                <button
                  onClick={cancelFooterEdit}
                  className="flex-1 py-2 px-3 border-3 border-gray-200 rounded-xl font-crayon text-gray-600
                           hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveFooterConfig}
                  disabled={tempFooterWords.length !== 4}
                  className="flex-1 py-2 px-3 bg-[#5CB85C] text-white rounded-xl font-crayon
                           hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-1"
                >
                  <Check size={16} />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        voiceSettings={voiceSettings}
        onVoiceChange={updateVoiceSettings}
        availableVoices={availableVoices}
        accessibility={accessibility}
        onAccessibilityChange={updateAccessibility}
        onShowAnalytics={() => {
          setShowSettings(false);
          setShowAnalytics(true);
        }}
        onStartScanning={handleStartScanning}
      />
      
      {/* Analytics Modal */}
      <AnalyticsModal
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        analytics={analytics}
        getTopWords={getTopWords}
        onClear={clearAnalytics}
      />
      
      {/* Add Word Modal */}
      <AddWordModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddCustomWord}
        isLoading={false}
      />
      
      {/* Layout Info Modal */}
      <LayoutInfoModal
        isOpen={showLayoutInfo}
        onClose={() => setShowLayoutInfo(false)}
        layout={selectedLayoutInfo}
      />
    </div>
  );
};

export default PointToTalk;
