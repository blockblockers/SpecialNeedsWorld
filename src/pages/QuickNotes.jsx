// QuickNotes.jsx - Simple notes for parents
// Privacy-focused: Local storage only, no PHI

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  FileText,
  Trash2,
  Search,
  Pin,
  Check
} from 'lucide-react';
import LocalOnlyNotice from '../components/LocalOnlyNotice';

// Note colors
const NOTE_COLORS = [
  { id: 'yellow', bg: 'bg-yellow-100', border: 'border-yellow-300' },
  { id: 'blue', bg: 'bg-blue-100', border: 'border-blue-300' },
  { id: 'green', bg: 'bg-green-100', border: 'border-green-300' },
  { id: 'pink', bg: 'bg-pink-100', border: 'border-pink-300' },
  { id: 'purple', bg: 'bg-purple-100', border: 'border-purple-300' },
  { id: 'white', bg: 'bg-white', border: 'border-gray-300' },
];

const STORAGE_KEY = 'snw_notes';

const QuickNotes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    color: 'yellow',
    pinned: false,
  });

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading notes:', e);
      }
    }
  }, []);

  // Save notes to localStorage
  const saveNotes = (newNotes) => {
    // Sort: pinned first, then by date
    newNotes.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    setNotes(newNotes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.content.trim()) return;

    const note = {
      id: editingId || Date.now().toString(),
      ...formData,
      title: formData.title.trim() || 'Untitled Note',
      createdAt: editingId ? notes.find(n => n.id === editingId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let newNotes;
    if (editingId) {
      newNotes = notes.map(n => n.id === editingId ? note : n);
    } else {
      newNotes = [...notes, note];
    }

    saveNotes(newNotes);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      color: 'yellow',
      pinned: false,
    });
    setShowForm(false);
    setEditingId(null);
  };

  // Edit note
  const handleEdit = (note) => {
    setFormData({
      title: note.title === 'Untitled Note' ? '' : note.title,
      content: note.content,
      color: note.color,
      pinned: note.pinned || false,
    });
    setEditingId(note.id);
    setShowForm(true);
  };

  // Delete note
  const handleDelete = (id) => {
    if (confirm('Delete this note?')) {
      saveNotes(notes.filter(n => n.id !== id));
    }
  };

  // Toggle pin
  const togglePin = (id) => {
    const newNotes = notes.map(n => 
      n.id === id ? { ...n, pinned: !n.pinned, updatedAt: new Date().toISOString() } : n
    );
    saveNotes(newNotes);
  };

  // Get color info
  const getColorInfo = (colorId) => {
    return NOTE_COLORS.find(c => c.id === colorId) || NOTE_COLORS[0];
  };

  // Filter notes
  const filteredNotes = notes.filter(note => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return note.title.toLowerCase().includes(query) || 
           note.content.toLowerCase().includes(query);
  });

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E86B9A]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E86B9A] 
                       rounded-xl font-display font-bold text-[#E86B9A] hover:bg-[#E86B9A] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#E86B9A] crayon-text">
              📝 Quick Notes
            </h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="p-2 bg-[#5CB85C] text-white rounded-full border-3 border-green-600
                       hover:scale-110 transition-transform shadow-sm"
          >
            <Plus size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Privacy Notice - Compact */}
        <div className="mb-4">
          <LocalOnlyNotice compact />
        </div>

        {/* Search */}
        {notes.length > 0 && !showForm && (
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-2 border-3 border-gray-300 rounded-xl font-crayon
                       focus:border-[#E86B9A] focus:outline-none"
            />
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-6 bg-white rounded-2xl border-4 border-[#E86B9A] p-4 shadow-crayon">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Title (optional)"
                className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon text-lg
                         focus:border-[#E86B9A] focus:outline-none"
              />

              {/* Content */}
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Write your note here..."
                rows={5}
                required
                className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon
                         focus:border-[#E86B9A] focus:outline-none resize-none"
              />

              {/* Color Selection */}
              <div className="flex items-center gap-2">
                <span className="font-crayon text-gray-600 text-sm">Color:</span>
                {NOTE_COLORS.map(color => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setFormData({...formData, color: color.id})}
                    className={`w-8 h-8 rounded-full ${color.bg} border-2 ${color.border}
                      ${formData.color === color.id ? 'ring-2 ring-[#E86B9A] ring-offset-2' : ''}
                    `}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl border-3 border-green-600
                           font-crayon hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  {editingId ? 'Save' : 'Add Note'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl border-3 border-gray-300
                           font-crayon hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Empty State */}
        {notes.length === 0 && !showForm && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="font-display text-xl text-gray-500 mb-2">No Notes Yet</h2>
            <p className="font-crayon text-gray-400 mb-4">
              Jot down quick reminders and observations!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-[#E86B9A] text-white rounded-xl border-3 border-pink-600
                       font-crayon hover:scale-105 transition-transform"
            >
              <Plus size={20} className="inline mr-2" />
              Write First Note
            </button>
          </div>
        )}

        {/* Notes Grid */}
        {filteredNotes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredNotes.map(note => {
              const colorInfo = getColorInfo(note.color);
              
              return (
                <div
                  key={note.id}
                  className={`${colorInfo.bg} rounded-2xl border-3 ${colorInfo.border} shadow-sm overflow-hidden`}
                >
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-display text-gray-800 flex items-center gap-1">
                        {note.pinned && <Pin size={14} className="text-[#E86B9A]" />}
                        {note.title}
                      </h3>
                      <span className="text-xs text-gray-500 font-crayon whitespace-nowrap">
                        {formatDate(note.updatedAt)}
                      </span>
                    </div>

                    {/* Content */}
                    <p className="font-crayon text-gray-700 text-sm mb-3 whitespace-pre-wrap line-clamp-4">
                      {note.content}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(note)}
                        className="flex-1 py-1.5 bg-white/50 text-gray-700 rounded-lg font-crayon text-sm
                                 hover:bg-white transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => togglePin(note.id)}
                        className={`p-1.5 rounded-lg transition-colors
                          ${note.pinned ? 'bg-[#E86B9A] text-white' : 'bg-white/50 text-gray-500 hover:bg-white'}`}
                        title={note.pinned ? 'Unpin' : 'Pin'}
                      >
                        <Pin size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="p-1.5 bg-white/50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No results */}
        {searchQuery && filteredNotes.length === 0 && (
          <p className="text-center text-gray-500 font-crayon py-8">
            No notes match "{searchQuery}"
          </p>
        )}
      </main>
    </div>
  );
};

export default QuickNotes;
