// PrintablesLibrary.jsx - Comprehensive Printables with ALL User Content Integration
// ENHANCED: "My Creations" pulls from ALL saved data across the app
// Sources: Choice Boards, Visual Schedules, Social Stories, Quick Notes, Goals, 
//          Care Team, Feelings/Emotion data, Sleep logs, Reminders, etc.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer,
  Download,
  Search,
  Filter,
  Star,
  Eye,
  X,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Grid3X3,
  List,
  Clock,
  FileText,
  Heart,
  Smile,
  Calendar,
  MessageCircle,
  Target,
  Award,
  Sparkles,
  Brain,
  Users,
  CheckSquare,
  Lightbulb,
  HelpCircle,
  Plus,
  FolderOpen,
  Moon,
  Droplets,
  Bell,
  StickyNote,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../App';

// ============================================
// STORAGE KEYS - All user data sources
// ============================================
const STORAGE_KEYS = {
  PRINTABLES: 'snw_printables',
  CHOICE_BOARDS: 'snw_choice_boards',
  SCHEDULES: 'snw_calendar_schedules',
  NOTES: 'snw_notes',
  GOALS: 'snw_goals',
  TEAM: 'snw_team',
  FEELINGS: 'snw_feelings',
  SLEEP: 'snw_sleep',
  REMINDERS: 'snw_reminders',
  WATER: 'snw_water',
  SOCIAL_STORIES: 'snw_saved_stories',
};

// ============================================
// PRINTABLE CATEGORIES
// ============================================
const CATEGORIES = [
  { id: 'all', name: 'All', icon: Grid3X3, color: '#4A9FD4' },
  { id: 'my-creations', name: 'My Creations', icon: FolderOpen, color: '#8E6BBF' },
  { id: 'emotions', name: 'Emotions', icon: Smile, color: '#F5A623' },
  { id: 'coping', name: 'Coping & Calm', icon: Heart, color: '#20B2AA' },
  { id: 'schedules', name: 'Schedules', icon: Calendar, color: '#E63B2E' },
  { id: 'communication', name: 'Communication', icon: MessageCircle, color: '#8E6BBF' },
  { id: 'behavior', name: 'Behavior', icon: Target, color: '#5CB85C' },
  { id: 'social', name: 'Social Skills', icon: Users, color: '#E86B9A' },
  { id: 'learning', name: 'Learning', icon: Brain, color: '#0891B2' },
];

// User creation types for display
const CREATION_TYPES = {
  'choice-board': { name: 'Choice Board', emoji: '⭐', color: '#F5A623', icon: Grid3X3 },
  'schedule': { name: 'Visual Schedule', emoji: '📅', color: '#E63B2E', icon: Calendar },
  'social-story': { name: 'Social Story', emoji: '📖', color: '#E86B9A', icon: BookOpen },
  'note': { name: 'Quick Note', emoji: '📝', color: '#F8D14A', icon: StickyNote },
  'goal': { name: 'Goal', emoji: '🎯', color: '#5CB85C', icon: Target },
  'team-member': { name: 'Care Team', emoji: '👥', color: '#4A9FD4', icon: Users },
  'feelings-log': { name: 'Feelings Log', emoji: '😊', color: '#F5A623', icon: Smile },
  'sleep-log': { name: 'Sleep Log', emoji: '😴', color: '#8E6BBF', icon: Moon },
  'reminder': { name: 'Reminder', emoji: '🔔', color: '#E63B2E', icon: Bell },
};

// ============================================
// PRE-MADE PRINTABLES DATA
// ============================================
const PRINTABLES = [
  // EMOTIONS
  {
    id: 'emotion-faces-chart',
    name: 'Emotion Faces Chart',
    description: 'Grid of 12 emotion faces with labels',
    category: 'emotions',
    tags: ['feelings', 'identification'],
    pages: 1,
    popular: true,
    printContent: 'emotion-faces',
  },
  {
    id: 'feelings-thermometer',
    name: 'Feelings Thermometer',
    description: 'Visual scale from calm to very upset',
    category: 'emotions',
    tags: ['intensity', 'regulation'],
    pages: 1,
    popular: true,
    printContent: 'thermometer',
  },
  
  // COPING
  {
    id: 'calm-down-cards',
    name: 'Calm Down Strategy Cards',
    description: '16 calming strategies with visuals',
    category: 'coping',
    tags: ['regulation', 'strategies'],
    pages: 2,
    popular: true,
    printContent: 'calm-cards',
  },
  {
    id: 'breathing-exercises',
    name: 'Breathing Exercise Posters',
    description: '4 visual breathing techniques',
    category: 'coping',
    tags: ['breathing', 'calm'],
    pages: 4,
    printContent: 'breathing',
  },
  
  // SCHEDULES
  {
    id: 'first-then-board',
    name: 'First-Then Board',
    description: 'Classic first-then template',
    category: 'schedules',
    tags: ['first-then', 'motivation'],
    pages: 1,
    popular: true,
    printContent: 'first-then',
  },
  {
    id: 'visual-schedule-daily',
    name: 'Daily Visual Schedule Template',
    description: 'Blank schedule with time slots',
    category: 'schedules',
    tags: ['routine', 'daily'],
    pages: 1,
    printContent: 'daily-schedule',
  },
  {
    id: 'morning-routine',
    name: 'Morning Routine Chart',
    description: 'Visual checklist for morning tasks',
    category: 'schedules',
    tags: ['morning', 'routine'],
    pages: 1,
    popular: true,
    printContent: 'morning-routine',
  },
  
  // COMMUNICATION
  {
    id: 'basic-needs-board',
    name: 'Basic Needs Communication Board',
    description: '12 essential symbols',
    category: 'communication',
    tags: ['AAC', 'basic needs'],
    pages: 1,
    popular: true,
    printContent: 'needs-board',
  },
  
  // BEHAVIOR
  {
    id: 'token-board-10',
    name: 'Token Board (10 Tokens)',
    description: 'Visual reinforcement board',
    category: 'behavior',
    tags: ['tokens', 'reinforcement'],
    pages: 1,
    popular: true,
    printContent: 'token-board',
  },
];

// ============================================
// HELPER: Load all user creations
// ============================================
const loadAllUserCreations = (userId) => {
  const creations = [];
  
  // 1. CHOICE BOARDS
  try {
    const boardsData = localStorage.getItem(`${STORAGE_KEYS.CHOICE_BOARDS}_${userId}`) || 
                       localStorage.getItem(STORAGE_KEYS.CHOICE_BOARDS);
    if (boardsData) {
      const boards = JSON.parse(boardsData);
      boards.forEach(board => {
        creations.push({
          id: `choice-board-${board.id}`,
          type: 'choice-board',
          name: board.name || 'Untitled Choice Board',
          description: `${board.options?.length || 0} choices`,
          data: board,
          createdAt: board.createdAt || new Date().toISOString(),
        });
      });
    }
  } catch (e) { console.error('Error loading choice boards:', e); }
  
  // 2. VISUAL SCHEDULES
  try {
    const schedulesData = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
    if (schedulesData) {
      const schedules = JSON.parse(schedulesData);
      Object.entries(schedules).forEach(([date, schedule]) => {
        if (schedule.items && schedule.items.length > 0) {
          creations.push({
            id: `schedule-${date}`,
            type: 'schedule',
            name: schedule.name || `Schedule for ${date}`,
            description: `${schedule.items.length} activities`,
            data: { date, ...schedule },
            createdAt: schedule.updatedAt || date,
          });
        }
      });
    }
  } catch (e) { console.error('Error loading schedules:', e); }
  
  // 3. SOCIAL STORIES (saved favorites)
  try {
    const storiesData = localStorage.getItem(STORAGE_KEYS.SOCIAL_STORIES);
    if (storiesData) {
      const stories = JSON.parse(storiesData);
      stories.forEach(story => {
        creations.push({
          id: `story-${story.id}`,
          type: 'social-story',
          name: story.title || 'Untitled Story',
          description: story.topic || 'Social Story',
          data: story,
          createdAt: story.savedAt || new Date().toISOString(),
        });
      });
    }
  } catch (e) { console.error('Error loading social stories:', e); }
  
  // 4. QUICK NOTES
  try {
    const notesData = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (notesData) {
      const notes = JSON.parse(notesData);
      notes.forEach(note => {
        creations.push({
          id: `note-${note.id}`,
          type: 'note',
          name: note.title || 'Untitled Note',
          description: note.content?.substring(0, 50) + '...' || 'Quick note',
          data: note,
          createdAt: note.createdAt || new Date().toISOString(),
        });
      });
    }
  } catch (e) { console.error('Error loading notes:', e); }
  
  // 5. GOALS
  try {
    const goalsData = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (goalsData) {
      const goals = JSON.parse(goalsData);
      goals.forEach(goal => {
        creations.push({
          id: `goal-${goal.id}`,
          type: 'goal',
          name: goal.title || goal.name || 'Untitled Goal',
          description: goal.description || `${goal.progress || 0}% complete`,
          data: goal,
          createdAt: goal.createdAt || new Date().toISOString(),
        });
      });
    }
  } catch (e) { console.error('Error loading goals:', e); }
  
  // 6. CARE TEAM
  try {
    const teamData = localStorage.getItem(STORAGE_KEYS.TEAM);
    if (teamData) {
      const team = JSON.parse(teamData);
      if (team.length > 0) {
        creations.push({
          id: 'team-contacts',
          type: 'team-member',
          name: 'My Care Team',
          description: `${team.length} team members`,
          data: team,
          createdAt: team[0]?.createdAt || new Date().toISOString(),
        });
      }
    }
  } catch (e) { console.error('Error loading team:', e); }
  
  // 7. FEELINGS LOG (summary)
  try {
    const feelingsData = localStorage.getItem(STORAGE_KEYS.FEELINGS);
    if (feelingsData) {
      const feelings = JSON.parse(feelingsData);
      const entries = Object.keys(feelings);
      if (entries.length > 0) {
        creations.push({
          id: 'feelings-summary',
          type: 'feelings-log',
          name: 'Feelings Journal',
          description: `${entries.length} entries recorded`,
          data: feelings,
          createdAt: new Date().toISOString(),
        });
      }
    }
  } catch (e) { console.error('Error loading feelings:', e); }
  
  // 8. SLEEP LOG (summary)
  try {
    const sleepData = localStorage.getItem(STORAGE_KEYS.SLEEP);
    if (sleepData) {
      const sleep = JSON.parse(sleepData);
      const entries = Object.keys(sleep);
      if (entries.length > 0) {
        creations.push({
          id: 'sleep-summary',
          type: 'sleep-log',
          name: 'Sleep Tracker Log',
          description: `${entries.length} nights tracked`,
          data: sleep,
          createdAt: new Date().toISOString(),
        });
      }
    }
  } catch (e) { console.error('Error loading sleep:', e); }
  
  // 9. REMINDERS
  try {
    const remindersData = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (remindersData) {
      const reminders = JSON.parse(remindersData);
      if (reminders.length > 0) {
        creations.push({
          id: 'reminders-list',
          type: 'reminder',
          name: 'My Reminders',
          description: `${reminders.length} reminders`,
          data: reminders,
          createdAt: reminders[0]?.createdAt || new Date().toISOString(),
        });
      }
    }
  } catch (e) { console.error('Error loading reminders:', e); }
  
  // Sort by most recent first
  creations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  return creations;
};

// ============================================
// PRINTABLE CARD COMPONENT
// ============================================
const PrintableCard = ({ printable, isSaved, onToggleSave, onPreview, isUserCreation = false }) => {
  const category = isUserCreation 
    ? CREATION_TYPES[printable.type] 
    : CATEGORIES.find(c => c.id === printable.category) || CATEGORIES[0];
  
  return (
    <div className="bg-white rounded-xl border-3 border-gray-200 overflow-hidden hover:shadow-md transition-all group">
      {/* Header */}
      <div 
        className="p-3 flex items-center gap-2"
        style={{ backgroundColor: `${category?.color}15` }}
      >
        <span className="text-xl">{isUserCreation ? category?.emoji : '📄'}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-sm text-gray-800 truncate">{printable.name}</h3>
          <p className="font-crayon text-xs text-gray-500 truncate">{printable.description}</p>
        </div>
        {isUserCreation && (
          <span 
            className="px-2 py-0.5 text-white text-xs font-crayon rounded-full"
            style={{ backgroundColor: category?.color }}
          >
            {category?.name}
          </span>
        )}
      </div>
      
      {/* Actions */}
      <div className="p-3 flex gap-2">
        <button
          onClick={() => onPreview(printable)}
          className="flex-1 py-2 bg-gray-100 rounded-lg font-crayon text-sm text-gray-600
                   hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
        >
          <Eye size={14} />
          Preview & Print
        </button>
        <button
          onClick={() => onToggleSave(printable.id)}
          className={`p-2 rounded-lg transition-colors ${
            isSaved 
              ? 'bg-[#F5A623] text-white' 
              : 'bg-gray-100 text-gray-400 hover:text-[#F5A623]'
          }`}
        >
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>
    </div>
  );
};

// ============================================
// PREVIEW MODAL COMPONENT
// ============================================
const PrintablePreviewModal = ({ printable, onClose, isUserCreation = false }) => {
  if (!printable) return null;
  
  const category = isUserCreation 
    ? CREATION_TYPES[printable.type] 
    : CATEGORIES.find(c => c.id === printable.category);
  
  // Render preview based on content type
  const renderPreviewContent = () => {
    // USER CREATIONS
    if (isUserCreation) {
      switch (printable.type) {
        case 'choice-board':
          return (
            <div className="p-4">
              <h3 className="text-center font-display text-lg mb-4" style={{ color: category?.color }}>
                {printable.name}
              </h3>
              <div className={`grid gap-3 ${printable.data.options?.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {printable.data.options?.map((option, i) => (
                  <div 
                    key={i}
                    className="aspect-square rounded-xl border-3 flex flex-col items-center justify-center p-2"
                    style={{ 
                      borderColor: option.color || '#4A9FD4',
                      backgroundColor: `${option.color || '#4A9FD4'}15`
                    }}
                  >
                    {option.image ? (
                      <img src={option.image} alt={option.name} className="w-12 h-12 object-cover rounded-lg mb-1" />
                    ) : (
                      <span className="text-3xl mb-1">{option.emoji || '⭐'}</span>
                    )}
                    <span className="font-display text-xs text-center">{option.name}</span>
                  </div>
                ))}
              </div>
            </div>
          );
          
        case 'schedule':
          return (
            <div className="p-4">
              <h3 className="text-center font-display text-lg mb-4" style={{ color: category?.color }}>
                {printable.name}
              </h3>
              <div className="space-y-2">
                {printable.data.items?.map((item, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-lg border-2"
                    style={{ borderColor: item.color || '#4A9FD4' }}
                  >
                    <span className="font-crayon text-xs text-gray-500 w-12">{item.time}</span>
                    <span className="text-xl">{item.emoji || '📌'}</span>
                    <span className="font-display text-sm flex-1">{item.name}</span>
                    {item.completed && <CheckSquare size={16} className="text-green-500" />}
                  </div>
                ))}
              </div>
            </div>
          );
          
        case 'social-story':
          return (
            <div className="p-4">
              <h3 className="text-center font-display text-lg mb-4" style={{ color: category?.color }}>
                {printable.name}
              </h3>
              <div className="prose prose-sm max-w-none">
                {printable.data.pages?.map((page, i) => (
                  <div key={i} className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="font-crayon text-gray-700">{page.text}</p>
                  </div>
                )) || (
                  <p className="font-crayon text-gray-600">{printable.data.content || 'No content'}</p>
                )}
              </div>
            </div>
          );
          
        case 'note':
          return (
            <div className="p-4">
              <h3 className="font-display text-lg mb-3" style={{ color: category?.color }}>
                {printable.data.title || 'Note'}
              </h3>
              <div className="p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200 min-h-[200px]">
                <p className="font-crayon text-gray-700 whitespace-pre-wrap">{printable.data.content}</p>
              </div>
              <p className="mt-2 text-xs font-crayon text-gray-400">
                Created: {new Date(printable.data.createdAt).toLocaleDateString()}
              </p>
            </div>
          );
          
        case 'goal':
          return (
            <div className="p-4">
              <h3 className="font-display text-lg mb-3" style={{ color: category?.color }}>
                🎯 {printable.data.title || printable.data.name}
              </h3>
              <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <p className="font-crayon text-gray-700 mb-3">{printable.data.description}</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-green-500 h-4 rounded-full transition-all"
                    style={{ width: `${printable.data.progress || 0}%` }}
                  />
                </div>
                <p className="text-center font-crayon text-sm text-green-600 mt-2">
                  {printable.data.progress || 0}% Complete
                </p>
              </div>
            </div>
          );
          
        case 'team-member':
          return (
            <div className="p-4">
              <h3 className="text-center font-display text-lg mb-4" style={{ color: category?.color }}>
                👥 My Care Team
              </h3>
              <div className="space-y-3">
                {printable.data.map((member, i) => (
                  <div key={i} className="p-3 bg-blue-50 rounded-xl border-2 border-blue-200">
                    <div className="font-display text-gray-800">{member.name}</div>
                    <div className="font-crayon text-sm text-gray-600">{member.role || member.type}</div>
                    {member.phone && <div className="font-crayon text-xs text-gray-500">📞 {member.phone}</div>}
                    {member.email && <div className="font-crayon text-xs text-gray-500">📧 {member.email}</div>}
                  </div>
                ))}
              </div>
            </div>
          );
          
        case 'feelings-log':
          const feelingsEntries = Object.entries(printable.data).slice(-7);
          return (
            <div className="p-4">
              <h3 className="text-center font-display text-lg mb-4" style={{ color: category?.color }}>
                😊 My Feelings This Week
              </h3>
              <div className="space-y-2">
                {feelingsEntries.map(([key, entry], i) => {
                  const [date, time] = key.split('_');
                  return (
                    <div key={i} className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                      <span className="font-crayon text-xs text-gray-500 w-20">{date}</span>
                      <span className="font-crayon text-xs text-gray-400 w-16">{time}</span>
                      <span className="text-2xl">{getEmoji(entry.feeling)}</span>
                      <span className="font-crayon text-sm capitalize">{entry.feeling}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
          
        case 'sleep-log':
          const sleepEntries = Object.entries(printable.data).slice(-7);
          return (
            <div className="p-4">
              <h3 className="text-center font-display text-lg mb-4" style={{ color: category?.color }}>
                😴 Sleep Log
              </h3>
              <div className="space-y-2">
                {sleepEntries.map(([date, entry], i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                    <span className="font-crayon text-xs text-gray-500 w-24">{date}</span>
                    <span className="text-sm">🌙 {entry.bedtime || '--'}</span>
                    <span className="text-sm">☀️ {entry.waketime || '--'}</span>
                    <span className="text-lg">{getQualityEmoji(entry.quality)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
          
        case 'reminder':
          return (
            <div className="p-4">
              <h3 className="text-center font-display text-lg mb-4" style={{ color: category?.color }}>
                🔔 My Reminders
              </h3>
              <div className="space-y-2">
                {printable.data.map((reminder, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border-2 border-red-200">
                    <Bell size={18} className="text-red-500" />
                    <div className="flex-1">
                      <div className="font-display text-sm">{reminder.title || reminder.name}</div>
                      <div className="font-crayon text-xs text-gray-500">{reminder.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
          
        default:
          return (
            <div className="p-8 text-center">
              <span className="text-6xl block mb-4">{category?.emoji}</span>
              <h3 className="font-display text-lg text-gray-700">{printable.name}</h3>
              <p className="font-crayon text-sm text-gray-500">{printable.description}</p>
            </div>
          );
      }
    }
    
    // PRE-MADE PRINTABLES
    switch (printable.printContent) {
      case 'emotion-faces':
        return (
          <div className="grid grid-cols-4 gap-3 p-4">
            {['😊 Happy', '😢 Sad', '😠 Angry', '😨 Scared', '😮 Surprised', '😴 Tired', 
              '🤩 Excited', '😌 Calm', '😤 Frustrated', '😕 Confused', '😊 Proud', '🥰 Loved'].map((emotion, i) => (
              <div key={i} className="text-center p-2 border-2 border-gray-200 rounded-xl">
                <span className="text-3xl block mb-1">{emotion.split(' ')[0]}</span>
                <span className="font-display text-xs">{emotion.split(' ')[1]}</span>
              </div>
            ))}
          </div>
        );
      
      case 'thermometer':
        return (
          <div className="p-6 flex justify-center">
            <div className="w-32">
              {[5, 4, 3, 2, 1].map((level) => (
                <div key={level} className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ 
                      backgroundColor: level === 5 ? '#E63B2E' : level === 4 ? '#F5A623' : 
                                       level === 3 ? '#F8D14A' : level === 2 ? '#87CEEB' : '#5CB85C' 
                    }}
                  >
                    {level}
                  </div>
                  <span className="font-crayon text-sm">
                    {level === 5 ? 'Very Upset' : level === 4 ? 'Upset' : 
                     level === 3 ? 'A Little Upset' : level === 2 ? 'Okay' : 'Calm'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'first-then':
        return (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="border-4 border-[#4A9FD4] rounded-2xl p-3">
                <h3 className="text-center font-display text-lg text-[#4A9FD4] mb-3">FIRST</h3>
                <div className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                  <span className="text-gray-400 font-crayon text-sm">Add picture</span>
                </div>
              </div>
              <div className="border-4 border-[#5CB85C] rounded-2xl p-3">
                <h3 className="text-center font-display text-lg text-[#5CB85C] mb-3">THEN</h3>
                <div className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                  <span className="text-gray-400 font-crayon text-sm">Add picture</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'token-board':
        return (
          <div className="p-4">
            <h3 className="text-center font-display mb-3">I am working for:</h3>
            <div className="w-24 h-16 mx-auto border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center mb-4">
              <span className="text-gray-400 font-crayon text-xs">Reward</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-square border-3 border-[#F8D14A] rounded-full flex items-center justify-center">
                  <Star size={20} className="text-gray-200" />
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'needs-board':
        return (
          <div className="p-3">
            <div className="grid grid-cols-4 gap-2">
              {['🥤 Drink', '🍎 Hungry', '🚽 Bathroom', '🆘 Help',
                '⏹️ Stop', '⏳ Wait', '✅ Yes', '❌ No',
                '😴 Tired', '🤕 Hurt', '🎮 Play', '🏠 Home'].map((item, i) => (
                <div key={i} className="text-center p-2 border-2 border-gray-200 rounded-xl bg-gray-50">
                  <span className="text-xl block mb-1">{item.split(' ')[0]}</span>
                  <span className="font-display text-xs">{item.split(' ')[1]}</span>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'calm-cards':
        return (
          <div className="p-3">
            <div className="grid grid-cols-4 gap-2">
              {['🌬️ Breathe', '🚶 Walk', '🧸 Hug', '🎵 Music',
                '💧 Water', '🔢 Count', '🖍️ Draw', '💪 Squeeze'].map((item, i) => (
                <div key={i} className="text-center p-2 border-2 border-[#20B2AA] rounded-xl bg-[#20B2AA]/10">
                  <span className="text-xl block mb-1">{item.split(' ')[0]}</span>
                  <span className="font-crayon text-xs">{item.split(' ')[1]}</span>
                </div>
              ))}
            </div>
            <p className="text-center font-crayon text-xs text-gray-400 mt-2">Shows 8 of 16</p>
          </div>
        );

      case 'morning-routine':
        return (
          <div className="p-4">
            <h3 className="text-center font-display text-lg mb-3">☀️ Morning Routine</h3>
            <div className="space-y-2">
              {['Wake Up', 'Use Bathroom', 'Brush Teeth', 'Get Dressed', 'Eat Breakfast', 'Pack Bag'].map((task, i) => (
                <div key={i} className="flex items-center gap-3 p-2 border-2 border-gray-200 rounded-lg">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded" />
                  <span className="font-crayon">{task}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-8 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-display text-lg text-gray-700">{printable.name}</h3>
            <p className="font-crayon text-sm text-gray-500">{printable.description}</p>
            <p className="font-crayon text-xs text-gray-400 mt-2">Click Print to generate</p>
          </div>
        );
    }
  };
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between" style={{ backgroundColor: `${category?.color}15` }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{isUserCreation ? category?.emoji : '📄'}</span>
            <div>
              <h2 className="font-display text-lg" style={{ color: category?.color }}>{printable.name}</h2>
              <p className="font-crayon text-xs text-gray-500">{printable.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/50">
            <X size={24} className="text-gray-400" />
          </button>
        </div>
        
        {/* Preview */}
        <div className="overflow-y-auto" style={{ maxHeight: '55vh' }}>
          <div className="bg-white border-2 border-gray-200 m-4 rounded-xl" id="print-preview">
            {renderPreviewContent()}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-display text-gray-600
                     hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-3 rounded-xl font-display text-white flex items-center justify-center gap-2
                     hover:opacity-90 transition-opacity"
            style={{ backgroundColor: category?.color }}
          >
            <Printer size={18} />
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper functions for emoji lookup
const getEmoji = (feeling) => {
  const map = { happy: '😊', calm: '😌', excited: '🤩', tired: '😴', sad: '😢', 
                worried: '😟', angry: '😠', frustrated: '😤', silly: '🤪', 
                scared: '😨', confused: '😕', proud: '🥳' };
  return map[feeling] || '😊';
};

const getQualityEmoji = (quality) => {
  const map = { great: '😴', good: '🙂', okay: '😐', poor: '😟', bad: '😫' };
  return map[quality] || '😐';
};

// ============================================
// MAIN COMPONENT
// ============================================
const PrintablesLibrary = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedPrintables, setSavedPrintables] = useState([]);
  const [previewPrintable, setPreviewPrintable] = useState(null);
  const [userCreations, setUserCreations] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  
  // Load user creations from ALL sources
  useEffect(() => {
    const userId = user?.id || 'guest';
    const creations = loadAllUserCreations(userId);
    setUserCreations(creations);
    
    // Load saved printables
    const saved = localStorage.getItem(STORAGE_KEYS.PRINTABLES);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSavedPrintables(data.saved || []);
      } catch (e) {
        console.error('Error loading printables data:', e);
      }
    }
  }, [user]);
  
  // Save preferences
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRINTABLES, JSON.stringify({
      saved: savedPrintables,
    }));
  }, [savedPrintables]);
  
  // Toggle save
  const toggleSave = (printableId) => {
    setSavedPrintables(prev => 
      prev.includes(printableId)
        ? prev.filter(id => id !== printableId)
        : [...prev, printableId]
    );
  };
  
  // Handle preview
  const handlePreview = (printable, isUserCreation = false) => {
    setPreviewPrintable({ ...printable, isUserCreation });
  };
  
  // Filter printables
  const filteredPrintables = selectedCategory === 'my-creations'
    ? userCreations
    : PRINTABLES.filter(p => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesSearch = !searchQuery || 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
  
  const popularPrintables = PRINTABLES.filter(p => p.popular);

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/resources')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F5A623] 
                       rounded-xl font-display font-bold text-[#F5A623] hover:bg-[#F5A623] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#F5A623] crayon-text flex items-center gap-2">
              <Printer size={24} />
              Printables Library
            </h1>
          </div>
          <button onClick={() => setShowInfo(true)} className="p-2 rounded-full hover:bg-gray-100">
            <HelpCircle size={22} className="text-gray-400" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search printables..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border-3 border-gray-200 focus:border-[#F5A623] 
                     outline-none font-crayon transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 mb-4">
          {CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.id;
            const hasContent = cat.id === 'my-creations' ? userCreations.length > 0 : true;
            
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-crayon text-sm transition-all
                          flex items-center gap-2
                          ${isActive 
                            ? 'text-white shadow-md' 
                            : 'bg-white border-2 border-gray-200 text-gray-600'
                          }`}
                style={isActive ? { backgroundColor: cat.color } : {}}
              >
                {cat.id === 'my-creations' && <FolderOpen size={14} />}
                {cat.name}
                {cat.id === 'my-creations' && hasContent && (
                  <span className="bg-white/30 px-1.5 py-0.5 rounded-full text-xs">
                    {userCreations.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* My Creations Section */}
        {selectedCategory === 'my-creations' && (
          <div className="mb-6">
            {userCreations.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                <FolderOpen size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="font-display text-gray-600 mb-2">No Creations Yet</h3>
                <p className="font-crayon text-sm text-gray-500 mb-4">
                  Your saved content from across the app will appear here!
                </p>
                <div className="flex gap-2 justify-center flex-wrap">
                  <button onClick={() => navigate('/activities/choice-board')} className="px-3 py-2 bg-[#F5A623] text-white rounded-lg font-crayon text-sm">
                    Create Choice Board
                  </button>
                  <button onClick={() => navigate('/tools/visual-schedule')} className="px-3 py-2 bg-[#E63B2E] text-white rounded-lg font-crayon text-sm">
                    Create Schedule
                  </button>
                  <button onClick={() => navigate('/services/notes')} className="px-3 py-2 bg-[#F8D14A] text-white rounded-lg font-crayon text-sm">
                    Add Notes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {userCreations.map(creation => (
                  <PrintableCard
                    key={creation.id}
                    printable={creation}
                    isSaved={savedPrintables.includes(creation.id)}
                    onToggleSave={toggleSave}
                    onPreview={(p) => handlePreview(p, true)}
                    isUserCreation={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Popular Section */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="mb-8">
            <h2 className="font-display text-lg text-gray-700 mb-3 flex items-center gap-2">
              <Star size={20} className="text-[#F8D14A]" />
              Popular Printables
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularPrintables.map(p => (
                <PrintableCard
                  key={p.id}
                  printable={p}
                  isSaved={savedPrintables.includes(p.id)}
                  onToggleSave={toggleSave}
                  onPreview={(pr) => handlePreview(pr, false)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Filtered Results */}
        {selectedCategory !== 'my-creations' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPrintables.map(p => (
              <PrintableCard
                key={p.id}
                printable={p}
                isSaved={savedPrintables.includes(p.id)}
                onToggleSave={toggleSave}
                onPreview={(pr) => handlePreview(pr, false)}
              />
            ))}
          </div>
        )}

        {/* Tip Box */}
        <div className="mt-8 p-4 bg-[#F5A623]/10 rounded-2xl border-2 border-[#F5A623]/30">
          <div className="flex items-start gap-3">
            <Lightbulb size={20} className="text-[#F5A623] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display text-[#F5A623]">Pro Tip</h3>
              <p className="font-crayon text-sm text-gray-600 mt-1">
                Everything you create in ATLASassist appears in "My Creations" - choice boards, schedules, 
                notes, goals, sleep logs, feelings journals, and more!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      {previewPrintable && (
        <PrintablePreviewModal
          printable={previewPrintable}
          onClose={() => setPreviewPrintable(null)}
          isUserCreation={previewPrintable.isUserCreation}
        />
      )}

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="font-display text-xl text-[#F5A623] mb-4">About Printables</h2>
            <div className="space-y-3 font-crayon text-gray-600">
              <p>📄 Browse pre-made visual supports and templates</p>
              <p>📁 "My Creations" shows ALL your saved content:</p>
              <ul className="ml-4 text-sm space-y-1">
                <li>⭐ Choice Boards</li>
                <li>📅 Visual Schedules</li>
                <li>📖 Social Stories</li>
                <li>📝 Quick Notes</li>
                <li>🎯 Goals</li>
                <li>👥 Care Team</li>
                <li>😊 Feelings Logs</li>
                <li>😴 Sleep Logs</li>
                <li>🔔 Reminders</li>
              </ul>
              <p>🖨️ Preview and print anything!</p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full mt-6 py-3 bg-[#F5A623] text-white rounded-xl font-display hover:bg-orange-500"
            >
              Got It!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintablesLibrary;
