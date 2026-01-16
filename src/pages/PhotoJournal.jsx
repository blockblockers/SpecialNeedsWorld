// PhotoJournal.jsx - Photo Journal for ATLASassist
// Capture and organize special moments with photos and notes
// Great for memory keeping, communication, and sharing experiences

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Camera,
  Image,
  Plus,
  X,
  Trash2,
  Edit3,
  Calendar,
  Heart,
  Star,
  Smile,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Download,
  Share2
} from 'lucide-react';
import { compressImage } from '../services/storage';
import LocalOnlyNotice from '../components/LocalOnlyNotice';

const STORAGE_KEY = 'snw_photo_journal';

// Mood/feeling tags for entries
const MOOD_TAGS = [
  { id: 'happy', emoji: '😊', name: 'Happy', color: '#F5A623' },
  { id: 'excited', emoji: '🤩', name: 'Excited', color: '#E63B2E' },
  { id: 'proud', emoji: '🥳', name: 'Proud', color: '#8E6BBF' },
  { id: 'calm', emoji: '😌', name: 'Calm', color: '#4A9FD4' },
  { id: 'loved', emoji: '🥰', name: 'Loved', color: '#E86B9A' },
  { id: 'grateful', emoji: '🙏', name: 'Grateful', color: '#5CB85C' },
  { id: 'silly', emoji: '🤪', name: 'Silly', color: '#F8D14A' },
  { id: 'adventurous', emoji: '🚀', name: 'Adventure', color: '#20B2AA' },
];

// Category tags
const CATEGORY_TAGS = [
  { id: 'family', emoji: '👨‍👩‍👧‍👦', name: 'Family' },
  { id: 'friends', emoji: '👫', name: 'Friends' },
  { id: 'school', emoji: '🏫', name: 'School' },
  { id: 'play', emoji: '🎮', name: 'Play' },
  { id: 'outdoors', emoji: '🌳', name: 'Outdoors' },
  { id: 'pets', emoji: '🐾', name: 'Pets' },
  { id: 'food', emoji: '🍕', name: 'Food' },
  { id: 'art', emoji: '🎨', name: 'Art' },
  { id: 'sports', emoji: '⚽', name: 'Sports' },
  { id: 'special', emoji: '⭐', name: 'Special' },
];

const PhotoJournal = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [filterTag, setFilterTag] = useState(null);
  
  // New entry form state
  const [newEntry, setNewEntry] = useState({
    photo: null,
    caption: '',
    mood: null,
    categories: [],
    date: new Date().toISOString().split('T')[0],
  });
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Load entries
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading journal:', e);
      }
    }
  }, []);

  // Save entries
  const saveEntries = (newEntries) => {
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  // Handle photo selection
  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const compressed = await compressImage(file, 800, 0.8);
      setNewEntry(prev => ({ ...prev, photo: compressed }));
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Could not process this image. Please try another.');
    }
  };

  // Add new entry
  const addEntry = () => {
    if (!newEntry.photo) {
      alert('Please add a photo first!');
      return;
    }
    
    const entry = {
      id: Date.now(),
      ...newEntry,
      createdAt: new Date().toISOString(),
    };
    
    const newEntries = [entry, ...entries];
    saveEntries(newEntries);
    
    // Reset form
    setNewEntry({
      photo: null,
      caption: '',
      mood: null,
      categories: [],
      date: new Date().toISOString().split('T')[0],
    });
    setShowAddModal(false);
  };

  // Delete entry
  const deleteEntry = (entryId) => {
    if (!confirm('Delete this memory?')) return;
    
    const newEntries = entries.filter(e => e.id !== entryId);
    saveEntries(newEntries);
    setSelectedEntry(null);
  };

  // Toggle category
  const toggleCategory = (categoryId) => {
    setNewEntry(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(c => c !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  // Filter entries
  const filteredEntries = filterTag
    ? entries.filter(e => e.mood === filterTag || e.categories?.includes(filterTag))
    : entries;

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  // Entry detail view
  if (selectedEntry) {
    const entry = entries.find(e => e.id === selectedEntry);
    if (!entry) {
      setSelectedEntry(null);
      return null;
    }
    
    const mood = MOOD_TAGS.find(m => m.id === entry.mood);
    const entryIndex = entries.findIndex(e => e.id === selectedEntry);
    
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E86B9A]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSelectedEntry(null)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E86B9A] 
                         rounded-xl font-display font-bold text-[#E86B9A] hover:bg-[#E86B9A] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <p className="font-crayon text-gray-600">{formatDate(entry.date)}</p>
            </div>
            <button
              onClick={() => deleteEntry(entry.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Photo */}
          <div className="mb-6 rounded-2xl overflow-hidden border-4 border-[#E86B9A] shadow-lg">
            <img 
              src={entry.photo} 
              alt={entry.caption || 'Memory'} 
              className="w-full"
            />
          </div>

          {/* Mood */}
          {mood && (
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{mood.emoji}</span>
              <span className="font-display text-lg" style={{ color: mood.color }}>
                Feeling {mood.name}
              </span>
            </div>
          )}

          {/* Caption */}
          {entry.caption && (
            <p className="font-crayon text-lg text-gray-700 mb-4 p-4 bg-white rounded-xl border-2 border-gray-200">
              {entry.caption}
            </p>
          )}

          {/* Categories */}
          {entry.categories?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {entry.categories.map(catId => {
                const cat = CATEGORY_TAGS.find(c => c.id === catId);
                return cat ? (
                  <span key={catId} className="px-3 py-1 bg-gray-100 rounded-full font-crayon text-sm">
                    {cat.emoji} {cat.name}
                  </span>
                ) : null;
              })}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => {
                if (entryIndex < entries.length - 1) {
                  setSelectedEntry(entries[entryIndex + 1].id);
                }
              }}
              disabled={entryIndex >= entries.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl font-crayon
                       disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
            >
              <ChevronLeft size={20} />
              Older
            </button>
            <button
              onClick={() => {
                if (entryIndex > 0) {
                  setSelectedEntry(entries[entryIndex - 1].id);
                }
              }}
              disabled={entryIndex <= 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl font-crayon
                       disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
            >
              Newer
              <ChevronRight size={20} />
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Add entry modal
  if (showAddModal) {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E86B9A]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => {
                setShowAddModal(false);
                setNewEntry({
                  photo: null,
                  caption: '',
                  mood: null,
                  categories: [],
                  date: new Date().toISOString().split('T')[0],
                });
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E86B9A] 
                         rounded-xl font-display font-bold text-[#E86B9A] hover:bg-[#E86B9A] 
                         hover:text-white transition-all shadow-md"
            >
              <X size={16} />
              Cancel
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-display text-[#E86B9A]">Add Memory</h1>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Photo Selection */}
          <div className="mb-6">
            {newEntry.photo ? (
              <div className="relative">
                <img 
                  src={newEntry.photo} 
                  alt="Preview" 
                  className="w-full rounded-2xl border-4 border-[#E86B9A]"
                />
                <button
                  onClick={() => setNewEntry(prev => ({ ...prev, photo: null }))}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 p-8 bg-white rounded-2xl border-4 border-dashed border-[#E86B9A] 
                           flex flex-col items-center gap-3 hover:bg-pink-50 transition-colors"
                >
                  <Camera size={48} className="text-[#E86B9A]" />
                  <span className="font-crayon text-gray-600">Take Photo</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 p-8 bg-white rounded-2xl border-4 border-dashed border-[#4A9FD4] 
                           flex flex-col items-center gap-3 hover:bg-blue-50 transition-colors"
                >
                  <Image size={48} className="text-[#4A9FD4]" />
                  <span className="font-crayon text-gray-600">Choose Photo</span>
                </button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>

          {/* Date */}
          <div className="mb-6">
            <label className="font-display text-gray-700 mb-2 block">When was this?</label>
            <input
              type="date"
              value={newEntry.date}
              onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl font-crayon
                       focus:border-[#E86B9A] focus:outline-none"
            />
          </div>

          {/* Caption */}
          <div className="mb-6">
            <label className="font-display text-gray-700 mb-2 block">What happened?</label>
            <textarea
              value={newEntry.caption}
              onChange={(e) => setNewEntry(prev => ({ ...prev, caption: e.target.value }))}
              placeholder="Write about this memory..."
              rows={3}
              className="w-full px-4 py-3 border-3 border-gray-200 rounded-xl font-crayon
                       focus:border-[#E86B9A] focus:outline-none resize-none"
            />
          </div>

          {/* Mood Selection */}
          <div className="mb-6">
            <label className="font-display text-gray-700 mb-2 block">How did you feel?</label>
            <div className="flex flex-wrap gap-2">
              {MOOD_TAGS.map(mood => (
                <button
                  key={mood.id}
                  onClick={() => setNewEntry(prev => ({ 
                    ...prev, 
                    mood: prev.mood === mood.id ? null : mood.id 
                  }))}
                  className={`px-3 py-2 rounded-xl border-2 flex items-center gap-2 transition-all
                    ${newEntry.mood === mood.id 
                      ? 'border-current scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  style={{ 
                    color: mood.color,
                    backgroundColor: newEntry.mood === mood.id ? `${mood.color}20` : 'white'
                  }}
                >
                  <span className="text-xl">{mood.emoji}</span>
                  <span className="font-crayon text-sm">{mood.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Tags */}
          <div className="mb-6">
            <label className="font-display text-gray-700 mb-2 block">Tags</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_TAGS.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full border-2 flex items-center gap-1 transition-all
                    ${newEntry.categories.includes(cat.id)
                      ? 'bg-[#E86B9A] border-[#E86B9A] text-white'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <span>{cat.emoji}</span>
                  <span className="font-crayon text-sm">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={addEntry}
            disabled={!newEntry.photo}
            className="w-full py-4 bg-[#E86B9A] text-white rounded-xl font-display text-lg
                     hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            <Heart size={24} />
            Save Memory
          </button>
        </main>
      </div>
    );
  }

  // Main gallery view
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E86B9A]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/activities')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E86B9A] 
                       rounded-xl font-display font-bold text-[#E86B9A] hover:bg-[#E86B9A] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#E86B9A] crayon-text">
              📸 Photo Journal
            </h1>
          </div>
          
          {/* View toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50"
          >
            {viewMode === 'grid' ? <List size={20} /> : <Grid3X3 size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Privacy Notice */}
        <div className="mb-4">
          <LocalOnlyNotice compact />
        </div>

        {/* Filter Tags */}
        {entries.length > 0 && (
          <div className="mb-6 overflow-x-auto pb-2">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterTag(null)}
                className={`px-3 py-1.5 rounded-full font-crayon text-sm whitespace-nowrap
                  ${!filterTag ? 'bg-[#E86B9A] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                All ({entries.length})
              </button>
              {MOOD_TAGS.map(mood => {
                const count = entries.filter(e => e.mood === mood.id).length;
                if (count === 0) return null;
                return (
                  <button
                    key={mood.id}
                    onClick={() => setFilterTag(filterTag === mood.id ? null : mood.id)}
                    className={`px-3 py-1.5 rounded-full font-crayon text-sm whitespace-nowrap flex items-center gap-1
                      ${filterTag === mood.id ? 'text-white' : 'bg-gray-100 text-gray-600'}`}
                    style={{ backgroundColor: filterTag === mood.id ? mood.color : undefined }}
                  >
                    {mood.emoji} {count}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl block mb-4">📸</span>
            <h2 className="text-xl font-display text-gray-700 mb-2">No memories yet!</h2>
            <p className="font-crayon text-gray-500 mb-6">
              Start capturing special moments
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-[#E86B9A] text-white rounded-xl font-display
                       hover:bg-pink-600 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Add First Memory
            </button>
          </div>
        ) : (
          <>
            {/* Photo Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredEntries.map(entry => {
                  const mood = MOOD_TAGS.find(m => m.id === entry.mood);
                  return (
                    <button
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry.id)}
                      className="relative aspect-square rounded-xl overflow-hidden border-3 border-white 
                               shadow-md hover:shadow-lg transition-all hover:scale-102"
                    >
                      <img 
                        src={entry.photo} 
                        alt={entry.caption || 'Memory'} 
                        className="w-full h-full object-cover"
                      />
                      {mood && (
                        <span className="absolute top-2 right-2 text-2xl drop-shadow-lg">
                          {mood.emoji}
                        </span>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-white font-crayon text-xs truncate">
                          {formatDate(entry.date)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEntries.map(entry => {
                  const mood = MOOD_TAGS.find(m => m.id === entry.mood);
                  return (
                    <button
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry.id)}
                      className="w-full bg-white rounded-xl border-3 border-gray-200 overflow-hidden
                               flex gap-4 p-3 hover:shadow-md transition-all text-left"
                    >
                      <img 
                        src={entry.photo} 
                        alt={entry.caption || 'Memory'} 
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {mood && <span className="text-xl">{mood.emoji}</span>}
                          <span className="font-crayon text-sm text-gray-500">
                            {formatDate(entry.date)}
                          </span>
                        </div>
                        {entry.caption && (
                          <p className="font-crayon text-gray-700 line-clamp-2">
                            {entry.caption}
                          </p>
                        )}
                        {entry.categories?.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {entry.categories.slice(0, 3).map(catId => {
                              const cat = CATEGORY_TAGS.find(c => c.id === catId);
                              return cat ? (
                                <span key={catId} className="text-sm">{cat.emoji}</span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* Add Button */}
      {entries.length > 0 && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-[#E86B9A] text-white rounded-full 
                   shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center"
        >
          <Plus size={32} />
        </button>
      )}
    </div>
  );
};

export default PhotoJournal;
