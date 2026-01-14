// GoalTracker.jsx - Enhanced Goal & IEP Tracker for ATLASassist
// Privacy-focused: All data stored locally on device
// Features:
// - IEP Document Repository
// - Goal tracking with status (open, in-progress, mastered, discontinued)
// - Progress history/logs
// - Objectives under goals
// - Service tracking
// - Metrics & Reports
// - Data export

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Target,
  Check,
  X,
  Trash2,
  Edit2,
  Star,
  TrendingUp,
  Calendar,
  FileText,
  FolderOpen,
  Clock,
  BarChart3,
  Users,
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  Circle,
  XCircle,
  PauseCircle,
  History,
  MessageSquare,
  Paperclip,
  Filter,
  Search,
  BookOpen
} from 'lucide-react';
import LocalOnlyNotice from '../components/LocalOnlyNotice';

// ============================================
// CONSTANTS
// ============================================

const STORAGE_KEYS = {
  IEPS: 'snw_ieps',
  GOALS: 'snw_goals_v2',
  PROGRESS_LOGS: 'snw_progress_logs',
  SERVICES: 'snw_services',
};

// Goal categories
const GOAL_CATEGORIES = [
  { id: 'communication', label: 'Communication', emoji: '🗣️', color: '#4A9FD4' },
  { id: 'social', label: 'Social Skills', emoji: '👥', color: '#8E6BBF' },
  { id: 'academic', label: 'Academic', emoji: '📚', color: '#5CB85C' },
  { id: 'motor', label: 'Motor Skills', emoji: '🏃', color: '#F5A623' },
  { id: 'daily', label: 'Daily Living', emoji: '🏠', color: '#E86B9A' },
  { id: 'behavior', label: 'Behavior', emoji: '⭐', color: '#F8D14A' },
  { id: 'sensory', label: 'Sensory', emoji: '🎨', color: '#20B2AA' },
  { id: 'cognitive', label: 'Cognitive', emoji: '🧠', color: '#E63B2E' },
  { id: 'other', label: 'Other', emoji: '🎯', color: '#6C757D' },
];

// Goal statuses
const GOAL_STATUSES = [
  { id: 'not-started', label: 'Not Started', emoji: '⬜', color: '#9CA3AF', icon: Circle },
  { id: 'in-progress', label: 'In Progress', emoji: '🔵', color: '#3B82F6', icon: Clock },
  { id: 'on-hold', label: 'On Hold', emoji: '⏸️', color: '#F59E0B', icon: PauseCircle },
  { id: 'mastered', label: 'Mastered', emoji: '✅', color: '#10B981', icon: CheckCircle2 },
  { id: 'discontinued', label: 'Discontinued', emoji: '❌', color: '#EF4444', icon: XCircle },
];

// Progress levels for quick updates
const PROGRESS_LEVELS = [
  { value: 0, label: 'Not Started', color: '#E5E7EB' },
  { value: 25, label: 'Emerging', color: '#FCA5A5' },
  { value: 50, label: 'Developing', color: '#FCD34D' },
  { value: 75, label: 'Approaching', color: '#93C5FD' },
  { value: 100, label: 'Mastered', color: '#86EFAC' },
];

// Service types
const SERVICE_TYPES = [
  { id: 'speech', label: 'Speech Therapy', emoji: '🗣️' },
  { id: 'ot', label: 'Occupational Therapy', emoji: '✋' },
  { id: 'pt', label: 'Physical Therapy', emoji: '🏃' },
  { id: 'aba', label: 'ABA Therapy', emoji: '📊' },
  { id: 'counseling', label: 'Counseling', emoji: '💭' },
  { id: 'special-ed', label: 'Special Education', emoji: '📚' },
  { id: 'aide', label: '1:1 Aide', emoji: '👤' },
  { id: 'other', label: 'Other', emoji: '📋' },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getSchoolYear = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  // School year typically starts in August/September
  if (month >= 7) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
};

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

const loadFromStorage = (key, defaultValue = []) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.error(`Error loading ${key}:`, e);
    return defaultValue;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key}:`, e);
  }
};

// ============================================
// MAIN COMPONENT
// ============================================

const GoalTracker = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Main view state
  const [activeTab, setActiveTab] = useState('goals'); // goals, ieps, services, metrics
  
  // Data state
  const [ieps, setIeps] = useState([]);
  const [goals, setGoals] = useState([]);
  const [progressLogs, setProgressLogs] = useState([]);
  const [services, setServices] = useState([]);
  
  // UI state
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState(null); // 'goal', 'iep', 'service', 'log', 'objective'
  const [editingId, setEditingId] = useState(null);
  const [expandedGoals, setExpandedGoals] = useState(new Set());
  const [selectedIep, setSelectedIep] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogModal, setShowLogModal] = useState(null); // goal id for logging
  
  // Form data
  const [formData, setFormData] = useState({});

  // Load all data on mount
  useEffect(() => {
    setIeps(loadFromStorage(STORAGE_KEYS.IEPS));
    setGoals(loadFromStorage(STORAGE_KEYS.GOALS));
    setProgressLogs(loadFromStorage(STORAGE_KEYS.PROGRESS_LOGS));
    setServices(loadFromStorage(STORAGE_KEYS.SERVICES));
  }, []);

  // Save helpers
  const saveIeps = (data) => { setIeps(data); saveToStorage(STORAGE_KEYS.IEPS, data); };
  const saveGoals = (data) => { setGoals(data); saveToStorage(STORAGE_KEYS.GOALS, data); };
  const saveProgressLogs = (data) => { setProgressLogs(data); saveToStorage(STORAGE_KEYS.PROGRESS_LOGS, data); };
  const saveServices = (data) => { setServices(data); saveToStorage(STORAGE_KEYS.SERVICES, data); };

  // ============================================
  // IEP FUNCTIONS
  // ============================================

  const openIepForm = (iep = null) => {
    setFormType('iep');
    setEditingId(iep?.id || null);
    setFormData(iep || {
      schoolYear: getSchoolYear(),
      startDate: '',
      endDate: '',
      school: '',
      caseManager: '',
      notes: '',
    });
    setShowForm(true);
  };

  const saveIep = () => {
    const iep = {
      id: editingId || `iep-${Date.now()}`,
      ...formData,
      createdAt: editingId ? ieps.find(i => i.id === editingId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      saveIeps(ieps.map(i => i.id === editingId ? iep : i));
    } else {
      saveIeps([...ieps, iep]);
    }
    resetForm();
  };

  const deleteIep = (id) => {
    if (confirm('Delete this IEP? Goals linked to it will become unlinked.')) {
      saveIeps(ieps.filter(i => i.id !== id));
      // Unlink goals from deleted IEP
      saveGoals(goals.map(g => g.iepId === id ? { ...g, iepId: null } : g));
    }
  };

  // ============================================
  // GOAL FUNCTIONS
  // ============================================

  const openGoalForm = (goal = null) => {
    setFormType('goal');
    setEditingId(goal?.id || null);
    setFormData(goal || {
      title: '',
      description: '',
      category: 'communication',
      status: 'not-started',
      progress: 0,
      iepId: selectedIep !== 'all' ? selectedIep : null,
      targetDate: '',
      baseline: '',
      targetCriteria: '',
      objectives: [],
      notes: '',
    });
    setShowForm(true);
  };

  const saveGoal = () => {
    const goal = {
      id: editingId || `goal-${Date.now()}`,
      ...formData,
      createdAt: editingId ? goals.find(g => g.id === editingId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      saveGoals(goals.map(g => g.id === editingId ? goal : g));
    } else {
      saveGoals([...goals, goal]);
    }
    resetForm();
  };

  const deleteGoal = (id) => {
    if (confirm('Delete this goal and all its progress logs?')) {
      saveGoals(goals.filter(g => g.id !== id));
      saveProgressLogs(progressLogs.filter(l => l.goalId !== id));
    }
  };

  const updateGoalStatus = (goalId, status) => {
    const newProgress = status === 'mastered' ? 100 : 
                       status === 'not-started' ? 0 : 
                       goals.find(g => g.id === goalId)?.progress || 0;
    
    saveGoals(goals.map(g => 
      g.id === goalId 
        ? { ...g, status, progress: newProgress, updatedAt: new Date().toISOString() }
        : g
    ));
  };

  const updateGoalProgress = (goalId, progress) => {
    const status = progress === 100 ? 'mastered' : 
                  progress === 0 ? 'not-started' : 'in-progress';
    
    saveGoals(goals.map(g => 
      g.id === goalId 
        ? { ...g, progress, status, updatedAt: new Date().toISOString() }
        : g
    ));
  };

  // ============================================
  // OBJECTIVE FUNCTIONS
  // ============================================

  const addObjective = (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const newObjective = {
      id: `obj-${Date.now()}`,
      title: '',
      progress: 0,
      mastered: false,
      createdAt: new Date().toISOString(),
    };

    saveGoals(goals.map(g => 
      g.id === goalId 
        ? { ...g, objectives: [...(g.objectives || []), newObjective] }
        : g
    ));
  };

  const updateObjective = (goalId, objectiveId, updates) => {
    saveGoals(goals.map(g => {
      if (g.id !== goalId) return g;
      return {
        ...g,
        objectives: (g.objectives || []).map(obj =>
          obj.id === objectiveId ? { ...obj, ...updates } : obj
        ),
      };
    }));
  };

  const deleteObjective = (goalId, objectiveId) => {
    saveGoals(goals.map(g => {
      if (g.id !== goalId) return g;
      return {
        ...g,
        objectives: (g.objectives || []).filter(obj => obj.id !== objectiveId),
      };
    }));
  };

  // ============================================
  // PROGRESS LOG FUNCTIONS
  // ============================================

  const openLogModal = (goalId) => {
    setShowLogModal(goalId);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      progress: goals.find(g => g.id === goalId)?.progress || 0,
      note: '',
      trialData: '',
    });
  };

  const saveProgressLog = () => {
    const log = {
      id: `log-${Date.now()}`,
      goalId: showLogModal,
      ...formData,
      createdAt: new Date().toISOString(),
    };

    saveProgressLogs([...progressLogs, log]);
    
    // Update goal progress
    updateGoalProgress(showLogModal, formData.progress);
    
    setShowLogModal(null);
    setFormData({});
  };

  // ============================================
  // SERVICE FUNCTIONS
  // ============================================

  const openServiceForm = (service = null) => {
    setFormType('service');
    setEditingId(service?.id || null);
    setFormData(service || {
      type: 'speech',
      provider: '',
      frequency: '',
      duration: '',
      location: '',
      notes: '',
    });
    setShowForm(true);
  };

  const saveService = () => {
    const service = {
      id: editingId || `svc-${Date.now()}`,
      ...formData,
      createdAt: editingId ? services.find(s => s.id === editingId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      saveServices(services.map(s => s.id === editingId ? service : s));
    } else {
      saveServices([...services, service]);
    }
    resetForm();
  };

  const deleteService = (id) => {
    if (confirm('Delete this service?')) {
      saveServices(services.filter(s => s.id !== id));
    }
  };

  // ============================================
  // EXPORT/IMPORT
  // ============================================

  const exportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      version: '2.0',
      ieps,
      goals,
      progressLogs,
      services,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goal-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (confirm('This will replace all existing data. Continue?')) {
          if (data.ieps) saveIeps(data.ieps);
          if (data.goals) saveGoals(data.goals);
          if (data.progressLogs) saveProgressLogs(data.progressLogs);
          if (data.services) saveServices(data.services);
          alert('Data imported successfully!');
        }
      } catch (err) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // ============================================
  // FORM HELPERS
  // ============================================

  const resetForm = () => {
    setShowForm(false);
    setFormType(null);
    setEditingId(null);
    setFormData({});
  };

  const toggleGoalExpanded = (goalId) => {
    setExpandedGoals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(goalId)) {
        newSet.delete(goalId);
      } else {
        newSet.add(goalId);
      }
      return newSet;
    });
  };

  // ============================================
  // FILTERED DATA
  // ============================================

  const filteredGoals = goals.filter(goal => {
    if (selectedIep !== 'all' && goal.iepId !== selectedIep) return false;
    if (statusFilter !== 'all' && goal.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && goal.category !== categoryFilter) return false;
    if (searchQuery && !goal.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // ============================================
  // METRICS
  // ============================================

  const metrics = {
    totalGoals: goals.length,
    byStatus: GOAL_STATUSES.reduce((acc, status) => {
      acc[status.id] = goals.filter(g => g.status === status.id).length;
      return acc;
    }, {}),
    byCategory: GOAL_CATEGORIES.reduce((acc, cat) => {
      acc[cat.id] = goals.filter(g => g.category === cat.id).length;
      return acc;
    }, {}),
    averageProgress: goals.length > 0 
      ? Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length) 
      : 0,
    recentLogs: progressLogs.slice(-10).reverse(),
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#5CB85C] 
                       rounded-xl font-display font-bold text-[#5CB85C] hover:bg-[#5CB85C] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#5CB85C] crayon-text flex items-center gap-2">
              🎯 Goal & IEP Tracker
            </h1>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={exportData}
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              title="Export Data"
            >
              <Download size={18} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              title="Import Data"
            >
              <Upload size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b-2 border-gray-200 bg-white sticky top-[68px] z-30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'goals', label: 'Goals', icon: Target, count: goals.length },
              { id: 'ieps', label: 'IEPs', icon: FileText, count: ieps.length },
              { id: 'services', label: 'Services', icon: Users, count: services.length },
              { id: 'metrics', label: 'Metrics', icon: BarChart3 },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-crayon text-sm border-b-3 transition-all whitespace-nowrap
                  ${activeTab === tab.id 
                    ? 'border-[#5CB85C] text-[#5CB85C]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-[#5CB85C]/20' : 'bg-gray-100'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Privacy Notice */}
        <div className="mb-4">
          <LocalOnlyNotice />
        </div>

        {/* GOALS TAB */}
        {activeTab === 'goals' && (
          <div>
            {/* Filters */}
            <div className="mb-4 space-y-3">
              {/* Search and Add */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search goals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl font-crayon
                             focus:border-[#5CB85C] focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => openGoalForm()}
                  className="px-4 py-2 bg-[#5CB85C] text-white rounded-xl font-crayon
                           hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Goal
                </button>
              </div>

              {/* Filter Pills */}
              <div className="flex gap-2 flex-wrap">
                {/* IEP Filter */}
                <select
                  value={selectedIep}
                  onChange={(e) => setSelectedIep(e.target.value)}
                  className="px-3 py-1.5 border-2 border-gray-200 rounded-lg font-crayon text-sm
                           focus:border-[#5CB85C] focus:outline-none bg-white"
                >
                  <option value="all">All IEPs</option>
                  <option value="">No IEP</option>
                  {ieps.map(iep => (
                    <option key={iep.id} value={iep.id}>{iep.schoolYear}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 border-2 border-gray-200 rounded-lg font-crayon text-sm
                           focus:border-[#5CB85C] focus:outline-none bg-white"
                >
                  <option value="all">All Statuses</option>
                  {GOAL_STATUSES.map(status => (
                    <option key={status.id} value={status.id}>{status.emoji} {status.label}</option>
                  ))}
                </select>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 border-2 border-gray-200 rounded-lg font-crayon text-sm
                           focus:border-[#5CB85C] focus:outline-none bg-white"
                >
                  <option value="all">All Categories</option>
                  {GOAL_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Goals List */}
            {filteredGoals.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="font-display text-xl text-gray-500 mb-2">No Goals Found</h2>
                <p className="font-crayon text-gray-400 mb-4">
                  {goals.length === 0 ? 'Start tracking IEP goals, therapy goals, and personal goals!' : 'Try adjusting your filters'}
                </p>
                {goals.length === 0 && (
                  <button
                    onClick={() => openGoalForm()}
                    className="px-6 py-3 bg-[#5CB85C] text-white rounded-xl font-crayon hover:scale-105 transition-transform"
                  >
                    <Plus size={20} className="inline mr-2" />
                    Add First Goal
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredGoals.map(goal => {
                  const category = GOAL_CATEGORIES.find(c => c.id === goal.category);
                  const status = GOAL_STATUSES.find(s => s.id === goal.status);
                  const StatusIcon = status?.icon || Circle;
                  const isExpanded = expandedGoals.has(goal.id);
                  const goalLogs = progressLogs.filter(l => l.goalId === goal.id);
                  const linkedIep = ieps.find(i => i.id === goal.iepId);

                  return (
                    <div
                      key={goal.id}
                      className="bg-white rounded-2xl border-3 shadow-sm overflow-hidden"
                      style={{ borderColor: category?.color || '#E5E7EB' }}
                    >
                      {/* Goal Header */}
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{category?.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-display text-gray-800">{goal.title}</h3>
                              <span 
                                className="px-2 py-0.5 rounded-full text-xs font-crayon flex items-center gap-1"
                                style={{ backgroundColor: `${status?.color}20`, color: status?.color }}
                              >
                                <StatusIcon size={12} />
                                {status?.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-crayon text-gray-500 mt-1 flex-wrap">
                              <span>{category?.label}</span>
                              {linkedIep && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <FileText size={10} />
                                    IEP {linkedIep.schoolYear}
                                  </span>
                                </>
                              )}
                              {goal.targetDate && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Calendar size={10} />
                                    Target: {formatDate(goal.targetDate)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => toggleGoalExpanded(goal.id)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs font-crayon text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{goal.progress || 0}%</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full transition-all duration-300"
                              style={{ 
                                width: `${goal.progress || 0}%`,
                                backgroundColor: PROGRESS_LEVELS.find(l => l.value <= (goal.progress || 0))?.color || '#E5E7EB'
                              }}
                            />
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {PROGRESS_LEVELS.map(level => (
                            <button
                              key={level.value}
                              onClick={() => updateGoalProgress(goal.id, level.value)}
                              className={`px-2 py-1 rounded-lg text-xs font-crayon transition-all
                                ${goal.progress === level.value 
                                  ? 'ring-2 ring-offset-1' 
                                  : 'opacity-60 hover:opacity-100'
                                }`}
                              style={{ 
                                backgroundColor: level.color,
                                ringColor: level.color,
                              }}
                            >
                              {level.value}%
                            </button>
                          ))}
                          <button
                            onClick={() => openLogModal(goal.id)}
                            className="px-2 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs font-crayon
                                     hover:bg-blue-200 transition-colors flex items-center gap-1"
                          >
                            <History size={12} />
                            Log
                          </button>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="border-t-2 border-gray-100 p-4 bg-gray-50">
                          {/* Description */}
                          {goal.description && (
                            <div className="mb-4">
                              <h4 className="font-crayon text-sm text-gray-600 mb-1">Description</h4>
                              <p className="text-sm text-gray-700 bg-white p-2 rounded-lg">{goal.description}</p>
                            </div>
                          )}

                          {/* Baseline & Target */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            {goal.baseline && (
                              <div>
                                <h4 className="font-crayon text-sm text-gray-600 mb-1">Baseline</h4>
                                <p className="text-sm text-gray-700 bg-white p-2 rounded-lg">{goal.baseline}</p>
                              </div>
                            )}
                            {goal.targetCriteria && (
                              <div>
                                <h4 className="font-crayon text-sm text-gray-600 mb-1">Target Criteria</h4>
                                <p className="text-sm text-gray-700 bg-white p-2 rounded-lg">{goal.targetCriteria}</p>
                              </div>
                            )}
                          </div>

                          {/* Objectives */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-crayon text-sm text-gray-600">Objectives</h4>
                              <button
                                onClick={() => addObjective(goal.id)}
                                className="text-xs text-[#5CB85C] font-crayon hover:underline flex items-center gap-1"
                              >
                                <Plus size={12} />
                                Add Objective
                              </button>
                            </div>
                            {(goal.objectives || []).length === 0 ? (
                              <p className="text-xs text-gray-400 italic">No objectives added yet</p>
                            ) : (
                              <div className="space-y-2">
                                {goal.objectives.map(obj => (
                                  <div key={obj.id} className="flex items-center gap-2 bg-white p-2 rounded-lg">
                                    <button
                                      onClick={() => updateObjective(goal.id, obj.id, { mastered: !obj.mastered })}
                                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                        ${obj.mastered ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
                                    >
                                      {obj.mastered && <Check size={12} className="text-white" />}
                                    </button>
                                    <input
                                      type="text"
                                      value={obj.title}
                                      onChange={(e) => updateObjective(goal.id, obj.id, { title: e.target.value })}
                                      placeholder="Objective description..."
                                      className={`flex-1 text-sm font-crayon bg-transparent focus:outline-none
                                        ${obj.mastered ? 'line-through text-gray-400' : ''}`}
                                    />
                                    <button
                                      onClick={() => deleteObjective(goal.id, obj.id)}
                                      className="text-gray-400 hover:text-red-500"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Progress History */}
                          {goalLogs.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-crayon text-sm text-gray-600 mb-2">Progress History</h4>
                              <div className="space-y-1 max-h-32 overflow-y-auto">
                                {goalLogs.slice(-5).reverse().map(log => (
                                  <div key={log.id} className="text-xs bg-white p-2 rounded-lg flex items-start gap-2">
                                    <span className="text-gray-400">{formatDate(log.date)}</span>
                                    <span className="font-bold" style={{ color: PROGRESS_LEVELS.find(l => l.value <= log.progress)?.color }}>
                                      {log.progress}%
                                    </span>
                                    {log.note && <span className="text-gray-600 flex-1">{log.note}</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          {goal.notes && (
                            <div className="mb-4">
                              <h4 className="font-crayon text-sm text-gray-600 mb-1">Notes</h4>
                              <p className="text-sm text-gray-700 bg-white p-2 rounded-lg">{goal.notes}</p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => openGoalForm(goal)}
                              className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-crayon text-sm
                                       hover:bg-gray-300 transition-colors flex items-center justify-center gap-1"
                            >
                              <Edit2 size={14} />
                              Edit
                            </button>
                            <select
                              value={goal.status}
                              onChange={(e) => updateGoalStatus(goal.id, e.target.value)}
                              className="px-3 py-2 border-2 border-gray-200 rounded-lg font-crayon text-sm bg-white"
                            >
                              {GOAL_STATUSES.map(s => (
                                <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => deleteGoal(goal.id)}
                              className="py-2 px-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* IEPS TAB */}
        {activeTab === 'ieps' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-lg text-gray-700">IEP Documents</h2>
              <button
                onClick={() => openIepForm()}
                className="px-4 py-2 bg-[#5CB85C] text-white rounded-xl font-crayon
                         hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Add IEP
              </button>
            </div>

            {ieps.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border-3 border-gray-200">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="font-display text-xl text-gray-500 mb-2">No IEPs Added</h2>
                <p className="font-crayon text-gray-400 mb-4">
                  Add IEP records to organize goals by school year
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {ieps.sort((a, b) => b.schoolYear.localeCompare(a.schoolYear)).map(iep => {
                  const iepGoals = goals.filter(g => g.iepId === iep.id);
                  const masteredCount = iepGoals.filter(g => g.status === 'mastered').length;

                  return (
                    <div key={iep.id} className="bg-white rounded-2xl border-3 border-blue-200 p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <FileText className="text-blue-600" size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-lg text-gray-800">IEP {iep.schoolYear}</h3>
                          <div className="text-sm font-crayon text-gray-500 space-y-1 mt-1">
                            {iep.school && <p>🏫 {iep.school}</p>}
                            {iep.caseManager && <p>👤 Case Manager: {iep.caseManager}</p>}
                            {(iep.startDate || iep.endDate) && (
                              <p>📅 {formatDate(iep.startDate)} - {formatDate(iep.endDate)}</p>
                            )}
                            <p>🎯 {iepGoals.length} goals ({masteredCount} mastered)</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openIepForm(iep)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteIep(iep.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      {iep.notes && (
                        <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">{iep.notes}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-lg text-gray-700">Services & Therapies</h2>
              <button
                onClick={() => openServiceForm()}
                className="px-4 py-2 bg-[#5CB85C] text-white rounded-xl font-crayon
                         hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Add Service
              </button>
            </div>

            {services.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border-3 border-gray-200">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="font-display text-xl text-gray-500 mb-2">No Services Added</h2>
                <p className="font-crayon text-gray-400 mb-4">
                  Track therapy services and providers
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {services.map(service => {
                  const serviceType = SERVICE_TYPES.find(s => s.id === service.type);

                  return (
                    <div key={service.id} className="bg-white rounded-2xl border-3 border-purple-200 p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{serviceType?.emoji}</span>
                        <div className="flex-1">
                          <h3 className="font-display text-gray-800">{serviceType?.label}</h3>
                          <div className="text-sm font-crayon text-gray-500 space-y-1 mt-1">
                            {service.provider && <p>👤 {service.provider}</p>}
                            {service.frequency && <p>📅 {service.frequency}</p>}
                            {service.duration && <p>⏱️ {service.duration}</p>}
                            {service.location && <p>📍 {service.location}</p>}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openServiceForm(service)}
                            className="p-1.5 text-gray-400 hover:text-gray-600"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => deleteService(service.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      {service.notes && (
                        <p className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">{service.notes}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* METRICS TAB */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border-3 border-blue-200 p-4 text-center">
                <p className="text-3xl font-display text-blue-600">{metrics.totalGoals}</p>
                <p className="font-crayon text-sm text-gray-500">Total Goals</p>
              </div>
              <div className="bg-white rounded-2xl border-3 border-green-200 p-4 text-center">
                <p className="text-3xl font-display text-green-600">{metrics.byStatus.mastered || 0}</p>
                <p className="font-crayon text-sm text-gray-500">Mastered</p>
              </div>
              <div className="bg-white rounded-2xl border-3 border-yellow-200 p-4 text-center">
                <p className="text-3xl font-display text-yellow-600">{metrics.byStatus['in-progress'] || 0}</p>
                <p className="font-crayon text-sm text-gray-500">In Progress</p>
              </div>
              <div className="bg-white rounded-2xl border-3 border-purple-200 p-4 text-center">
                <p className="text-3xl font-display text-purple-600">{metrics.averageProgress}%</p>
                <p className="font-crayon text-sm text-gray-500">Avg Progress</p>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="bg-white rounded-2xl border-3 border-gray-200 p-4">
              <h3 className="font-display text-gray-700 mb-3">Goals by Status</h3>
              <div className="space-y-2">
                {GOAL_STATUSES.map(status => {
                  const count = metrics.byStatus[status.id] || 0;
                  const percentage = metrics.totalGoals > 0 ? (count / metrics.totalGoals) * 100 : 0;
                  return (
                    <div key={status.id} className="flex items-center gap-3">
                      <span className="w-20 font-crayon text-sm text-gray-600">{status.emoji} {status.label}</span>
                      <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all"
                          style={{ width: `${percentage}%`, backgroundColor: status.color }}
                        />
                      </div>
                      <span className="w-8 text-right font-crayon text-sm text-gray-500">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl border-3 border-gray-200 p-4">
              <h3 className="font-display text-gray-700 mb-3">Goals by Category</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {GOAL_CATEGORIES.filter(cat => metrics.byCategory[cat.id] > 0).map(cat => (
                  <div 
                    key={cat.id} 
                    className="p-3 rounded-xl text-center"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    <span className="text-2xl">{cat.emoji}</span>
                    <p className="font-display text-lg" style={{ color: cat.color }}>
                      {metrics.byCategory[cat.id]}
                    </p>
                    <p className="font-crayon text-xs text-gray-500">{cat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border-3 border-gray-200 p-4">
              <h3 className="font-display text-gray-700 mb-3">Recent Progress Logs</h3>
              {metrics.recentLogs.length === 0 ? (
                <p className="text-center text-gray-400 font-crayon py-4">No progress logs yet</p>
              ) : (
                <div className="space-y-2">
                  {metrics.recentLogs.map(log => {
                    const goal = goals.find(g => g.id === log.goalId);
                    return (
                      <div key={log.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-400 w-20">{formatDate(log.date)}</span>
                        <span className="flex-1 font-crayon text-sm truncate">{goal?.title || 'Unknown Goal'}</span>
                        <span 
                          className="px-2 py-0.5 rounded text-xs font-bold"
                          style={{ 
                            backgroundColor: PROGRESS_LEVELS.find(l => l.value <= log.progress)?.color,
                          }}
                        >
                          {log.progress}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* FORMS MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#FFFEF5] w-full max-w-lg max-h-[90vh] rounded-3xl border-4 border-[#5CB85C] overflow-hidden">
            {/* Form Header */}
            <div className="bg-[#5CB85C] text-white p-4 flex items-center justify-between">
              <h3 className="font-display text-xl">
                {formType === 'goal' && (editingId ? 'Edit Goal' : 'Add Goal')}
                {formType === 'iep' && (editingId ? 'Edit IEP' : 'Add IEP')}
                {formType === 'service' && (editingId ? 'Edit Service' : 'Add Service')}
              </h3>
              <button onClick={resetForm} className="p-1 hover:bg-white/20 rounded-full">
                <X size={24} />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* GOAL FORM */}
              {formType === 'goal' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-crayon text-gray-700 mb-1">Goal Title *</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Use 3-word sentences"
                      className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-crayon text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Full goal description..."
                      rows={2}
                      className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-crayon text-gray-700 mb-1">Category</label>
                      <select
                        value={formData.category || 'communication'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none bg-white"
                      >
                        {GOAL_CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-crayon text-gray-700 mb-1">Link to IEP</label>
                      <select
                        value={formData.iepId || ''}
                        onChange={(e) => setFormData({ ...formData, iepId: e.target.value || null })}
                        className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none bg-white"
                      >
                        <option value="">No IEP</option>
                        {ieps.map(iep => (
                          <option key={iep.id} value={iep.id}>IEP {iep.schoolYear}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-crayon text-gray-700 mb-1">Baseline</label>
                      <input
                        type="text"
                        value={formData.baseline || ''}
                        onChange={(e) => setFormData({ ...formData, baseline: e.target.value })}
                        placeholder="e.g., 2/10 trials"
                        className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-crayon text-gray-700 mb-1">Target Criteria</label>
                      <input
                        type="text"
                        value={formData.targetCriteria || ''}
                        onChange={(e) => setFormData({ ...formData, targetCriteria: e.target.value })}
                        placeholder="e.g., 8/10 trials"
                        className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-crayon text-gray-700 mb-1">Target Date</label>
                    <input
                      type="date"
                      value={formData.targetDate || ''}
                      onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                      className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-crayon text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional notes..."
                      rows={2}
                      className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* IEP FORM */}
              {formType === 'iep' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-crayon text-gray-700 mb-1">School Year *</label>
                    <input
                      type="text"
                      value={formData.schoolYear || ''}
                      onChange={(e) => setFormData({ ...formData, schoolYear: e.target.value })}
                      placeholder="e.g., 2024-2025"
                      className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-crayon text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={formData.startDate || ''}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-crayon text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={formData.endDate || ''}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-crayon text-gray-700 mb-1">School</label>
                    <input
                      type="text"
                      value={formData.school || ''}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      placeholder="School name"
                      className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-crayon text-gray-700 mb-1">Case Manager</label>
                    <input
                      type="text"
                      value={formData.caseManager || ''}
                      onChange={(e) => setFormData({ ...formData, caseManager: e.target.value })}
                      placeholder="Case manager name"
                      className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-crayon text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="IEP notes, accommodations, etc."
                      rows={3}
                      className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* SERVICE FORM */}
              {formType === 'service' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-crayon text-gray-700 mb-1">Service Type *</label>
                    <select
                      value={formData.type || 'speech'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none bg-white"
                    >
                      {SERVICE_TYPES.map(svc => (
                        <option key={svc.id} value={svc.id}>{svc.emoji} {svc.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-crayon text-gray-700 mb-1">Provider Name</label>
                    <input
                      type="text"
                      value={formData.provider || ''}
                      onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                      placeholder="Therapist/Provider name"
                      className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-crayon text-gray-700 mb-1">Frequency</label>
                      <input
                        type="text"
                        value={formData.frequency || ''}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                        placeholder="e.g., 2x weekly"
                        className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-crayon text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        value={formData.duration || ''}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="e.g., 30 min"
                        className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-crayon text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., School, Clinic"
                      className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-crayon text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional notes..."
                      rows={2}
                      className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-[#5CB85C] focus:outline-none resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Form Footer */}
            <div className="p-4 border-t-3 border-gray-200 flex gap-3">
              <button
                onClick={resetForm}
                className="flex-1 py-3 bg-gray-200 rounded-xl font-crayon text-gray-600 hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (formType === 'goal') saveGoal();
                  if (formType === 'iep') saveIep();
                  if (formType === 'service') saveService();
                }}
                disabled={
                  (formType === 'goal' && !formData.title?.trim()) ||
                  (formType === 'iep' && !formData.schoolYear?.trim()) ||
                  (formType === 'service' && !formData.type)
                }
                className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl font-display hover:bg-green-600 transition-all 
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROGRESS LOG MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#FFFEF5] w-full max-w-sm rounded-3xl border-4 border-blue-400 overflow-hidden">
            <div className="bg-blue-500 text-white p-4 flex items-center justify-between">
              <h3 className="font-display text-xl flex items-center gap-2">
                <History size={24} />
                Log Progress
              </h3>
              <button onClick={() => setShowLogModal(null)} className="p-1 hover:bg-white/20 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block font-crayon text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-crayon text-gray-700 mb-2">Progress</label>
                <div className="flex gap-2">
                  {PROGRESS_LEVELS.map(level => (
                    <button
                      key={level.value}
                      onClick={() => setFormData({ ...formData, progress: level.value })}
                      className={`flex-1 py-2 rounded-xl text-sm font-crayon transition-all
                        ${formData.progress === level.value ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`}
                      style={{ backgroundColor: level.color }}
                    >
                      {level.value}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-crayon text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.note || ''}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="What happened today?"
                  rows={2}
                  className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-crayon text-gray-700 mb-1">Trial Data (optional)</label>
                <input
                  type="text"
                  value={formData.trialData || ''}
                  onChange={(e) => setFormData({ ...formData, trialData: e.target.value })}
                  placeholder="e.g., 7/10 correct"
                  className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 border-t-3 border-gray-200 flex gap-3">
              <button
                onClick={() => setShowLogModal(null)}
                className="flex-1 py-3 bg-gray-200 rounded-xl font-crayon text-gray-600 hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveProgressLog}
                className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-display hover:bg-blue-600 transition-all 
                         flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Save Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalTracker;
