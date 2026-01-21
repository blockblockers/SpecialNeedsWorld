// FeelingsTracker.jsx - Track daily emotions and moods
// UPDATED: Added photo uploads for emotions + trends monitoring graph
// NAVIGATION: Back button goes to /wellness (parent hub)
// Photos are stored in localStorage and included in JSON backup

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, TrendingUp, X, 
  Camera, Upload, Trash2, Image as ImageIcon, Calendar
} from 'lucide-react';
import LocalOnlyNotice from '../components/LocalOnlyNotice';

// Feelings with faces - user can add custom photos
const DEFAULT_FEELINGS = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: 'bg-yellow-100 border-yellow-400' },
  { id: 'calm', emoji: '😌', label: 'Calm', color: 'bg-green-100 border-green-400' },
  { id: 'excited', emoji: '🤩', label: 'Excited', color: 'bg-pink-100 border-pink-400' },
  { id: 'tired', emoji: '😴', label: 'Tired', color: 'bg-blue-100 border-blue-400' },
  { id: 'sad', emoji: '😢', label: 'Sad', color: 'bg-blue-200 border-blue-500' },
  { id: 'worried', emoji: '😟', label: 'Worried', color: 'bg-purple-100 border-purple-400' },
  { id: 'angry', emoji: '😠', label: 'Angry', color: 'bg-red-100 border-red-400' },
  { id: 'frustrated', emoji: '😤', label: 'Frustrated', color: 'bg-orange-100 border-orange-400' },
  { id: 'silly', emoji: '🤪', label: 'Silly', color: 'bg-pink-200 border-pink-500' },
  { id: 'scared', emoji: '😨', label: 'Scared', color: 'bg-gray-100 border-gray-400' },
  { id: 'confused', emoji: '😕', label: 'Confused', color: 'bg-gray-200 border-gray-500' },
  { id: 'proud', emoji: '🥳', label: 'Proud', color: 'bg-green-200 border-green-500' },
];

// Time of day options
const TIME_OF_DAY = [
  { id: 'morning', label: 'Morning', emoji: '🌅' },
  { id: 'afternoon', label: 'Afternoon', emoji: '☀️' },
  { id: 'evening', label: 'Evening', emoji: '🌙' },
];

const STORAGE_KEY = 'snw_feelings';
const PHOTOS_KEY = 'snw_feelings_photos';

const FeelingsTracker = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // State
  const [entries, setEntries] = useState({});
  const [emotionPhotos, setEmotionPhotos] = useState({}); // { happy: 'base64...', sad: 'base64...' }
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('morning');
  const [activeTab, setActiveTab] = useState('track'); // 'track', 'trends', 'photos'
  const [photoUploadEmotion, setPhotoUploadEmotion] = useState(null);
  const [trendsPeriod, setTrendsPeriod] = useState(7); // days

  // Load saved data
  useEffect(() => {
    const savedEntries = localStorage.getItem(STORAGE_KEY);
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (e) {
        console.error('Error loading feelings:', e);
      }
    }
    
    const savedPhotos = localStorage.getItem(PHOTOS_KEY);
    if (savedPhotos) {
      try {
        setEmotionPhotos(JSON.parse(savedPhotos));
      } catch (e) {
        console.error('Error loading photos:', e);
      }
    }
  }, []);

  // Save entries
  const saveEntries = (newEntries) => {
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  // Save photos
  const savePhotos = (newPhotos) => {
    setEmotionPhotos(newPhotos);
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(newPhotos));
  };

  // Get entry key
  const getEntryKey = () => `${selectedDate}_${selectedTime}`;

  // Get current entry - now stores objects with timestamp
  const currentEntry = entries[getEntryKey()] || [];

  // Toggle feeling
  const toggleFeeling = (feelingId) => {
    const key = getEntryKey();
    const current = entries[key] || [];
    
    let updated;
    if (current.includes(feelingId)) {
      updated = current.filter(id => id !== feelingId);
    } else {
      updated = [...current, feelingId];
    }
    
    const newEntries = { ...entries, [key]: updated };
    saveEntries(newEntries);
  };

  // Change date
  const changeDate = (days) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return 'Today';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Handle photo upload
  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file || !photoUploadEmotion) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Limit file size (1MB)
    if (file.size > 1024 * 1024) {
      alert('Image must be less than 1MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      const newPhotos = { ...emotionPhotos, [photoUploadEmotion]: base64 };
      savePhotos(newPhotos);
      setPhotoUploadEmotion(null);
    };
    reader.readAsDataURL(file);
  };

  // Remove photo
  const removePhoto = (emotionId) => {
    const newPhotos = { ...emotionPhotos };
    delete newPhotos[emotionId];
    savePhotos(newPhotos);
  };

  // Calculate trends data
  const getTrendsData = useCallback(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - trendsPeriod);
    
    // Count feelings by day
    const dailyData = {};
    const feelingCounts = {};
    
    Object.entries(entries).forEach(([key, feelings]) => {
      const [dateStr] = key.split('_');
      const date = new Date(dateStr);
      
      if (date >= startDate && date <= endDate) {
        if (!dailyData[dateStr]) {
          dailyData[dateStr] = { total: 0, positive: 0, negative: 0 };
        }
        
        feelings.forEach(f => {
          feelingCounts[f] = (feelingCounts[f] || 0) + 1;
          dailyData[dateStr].total++;
          
          // Classify as positive or negative
          const positiveEmotions = ['happy', 'calm', 'excited', 'silly', 'proud'];
          if (positiveEmotions.includes(f)) {
            dailyData[dateStr].positive++;
          } else {
            dailyData[dateStr].negative++;
          }
        });
      }
    });
    
    // Get most common feelings
    const sortedFeelings = Object.entries(feelingCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    return { dailyData, feelingCounts, sortedFeelings };
  }, [entries, trendsPeriod]);

  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const trendsData = getTrendsData();

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#FF6B6B]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/wellness')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#FF6B6B] 
                       rounded-xl font-display font-bold text-[#FF6B6B] hover:bg-[#FF6B6B] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#FF6B6B] crayon-text">
              😊 How Do I Feel?
            </h1>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="flex gap-2 bg-white rounded-xl p-1 border-3 border-gray-200">
          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-2 px-3 rounded-lg font-crayon transition-all flex items-center justify-center gap-1
              ${activeTab === 'track' ? 'bg-[#FF6B6B] text-white' : 'hover:bg-gray-100'}`}
          >
            <Calendar size={16} />
            Track
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`flex-1 py-2 px-3 rounded-lg font-crayon transition-all flex items-center justify-center gap-1
              ${activeTab === 'trends' ? 'bg-[#FF6B6B] text-white' : 'hover:bg-gray-100'}`}
          >
            <TrendingUp size={16} />
            Trends
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex-1 py-2 px-3 rounded-lg font-crayon transition-all flex items-center justify-center gap-1
              ${activeTab === 'photos' ? 'bg-[#FF6B6B] text-white' : 'hover:bg-gray-100'}`}
          >
            <Camera size={16} />
            Photos
          </button>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Privacy Notice */}
        <LocalOnlyNotice compact />

        {/* ========== TRACK TAB ========== */}
        {activeTab === 'track' && (
          <>
            {/* Date Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => changeDate(-1)}
                className="p-2 bg-white border-3 border-gray-300 rounded-full hover:border-gray-400"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="text-center">
                <span className="font-display text-xl text-gray-800">{formatDate(selectedDate)}</span>
              </div>
              
              <button
                onClick={() => changeDate(1)}
                disabled={isToday}
                className={`p-2 bg-white border-3 border-gray-300 rounded-full 
                           ${isToday ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}`}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Time of Day */}
            <div className="flex justify-center gap-2">
              {TIME_OF_DAY.map(time => (
                <button
                  key={time.id}
                  onClick={() => setSelectedTime(time.id)}
                  className={`px-4 py-2 rounded-xl font-crayon transition-all ${
                    selectedTime === time.id
                      ? 'bg-[#FF6B6B] text-white'
                      : 'bg-white border-2 border-gray-200 hover:border-[#FF6B6B]'
                  }`}
                >
                  {time.emoji} {time.label}
                </button>
              ))}
            </div>

            {/* Instructions */}
            <p className="text-center font-crayon text-gray-600">
              How are you feeling this {selectedTime}? Tap all that apply!
            </p>

            {/* Feelings Grid - Shows custom photos if available */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {DEFAULT_FEELINGS.map(feeling => {
                const isSelected = currentEntry.includes(feeling.id);
                const hasPhoto = emotionPhotos[feeling.id];
                
                return (
                  <button
                    key={feeling.id}
                    onClick={() => toggleFeeling(feeling.id)}
                    className={`p-3 rounded-2xl border-4 transition-all ${feeling.color} ${
                      isSelected 
                        ? 'scale-110 shadow-lg ring-4 ring-offset-2 ring-[#FF6B6B]' 
                        : 'hover:scale-105'
                    }`}
                  >
                    {hasPhoto ? (
                      <img 
                        src={emotionPhotos[feeling.id]} 
                        alt={feeling.label}
                        className="w-12 h-12 mx-auto rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl block">{feeling.emoji}</span>
                    )}
                    <span className="text-xs font-crayon text-gray-700 mt-1 block">{feeling.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected feelings summary */}
            {currentEntry.length > 0 && (
              <div className="p-4 bg-[#FF6B6B]/20 rounded-2xl border-3 border-[#FF6B6B]/30">
                <p className="font-crayon text-gray-700 text-center">
                  You're feeling: {currentEntry.map(id => {
                    const feeling = DEFAULT_FEELINGS.find(f => f.id === id);
                    return feeling ? `${feeling.emoji} ${feeling.label}` : '';
                  }).join(', ')}
                </p>
              </div>
            )}
          </>
        )}

        {/* ========== TRENDS TAB ========== */}
        {activeTab === 'trends' && (
          <>
            {/* Period Selector */}
            <div className="flex justify-center gap-2">
              {[7, 14, 30].map(days => (
                <button
                  key={days}
                  onClick={() => setTrendsPeriod(days)}
                  className={`px-4 py-2 rounded-xl font-crayon transition-all ${
                    trendsPeriod === days
                      ? 'bg-[#FF6B6B] text-white'
                      : 'bg-white border-2 border-gray-200 hover:border-[#FF6B6B]'
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>

            {/* Top Feelings */}
            <div className="bg-white rounded-2xl border-4 border-[#FF6B6B] p-4">
              <h3 className="font-display text-[#FF6B6B] mb-3">Top Feelings This Period</h3>
              {trendsData.sortedFeelings.length === 0 ? (
                <p className="text-gray-500 font-crayon text-center py-4">
                  No data yet. Start tracking your feelings!
                </p>
              ) : (
                <div className="space-y-2">
                  {trendsData.sortedFeelings.map(([feelingId, count], index) => {
                    const feeling = DEFAULT_FEELINGS.find(f => f.id === feelingId);
                    if (!feeling) return null;
                    
                    const maxCount = trendsData.sortedFeelings[0][1];
                    const percentage = (count / maxCount) * 100;
                    
                    return (
                      <div key={feelingId} className="flex items-center gap-3">
                        <span className="text-2xl w-8">{feeling.emoji}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-crayon">{feeling.label}</span>
                            <span className="font-display text-gray-500">{count}x</span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Daily Mood Graph */}
            <div className="bg-white rounded-2xl border-4 border-[#FF6B6B] p-4">
              <h3 className="font-display text-[#FF6B6B] mb-3">Daily Mood Balance</h3>
              <p className="font-crayon text-sm text-gray-500 mb-3">
                🟢 Positive | 🔴 Challenging
              </p>
              
              {Object.keys(trendsData.dailyData).length === 0 ? (
                <p className="text-gray-500 font-crayon text-center py-4">
                  No data for this period.
                </p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(trendsData.dailyData)
                    .sort((a, b) => b[0].localeCompare(a[0]))
                    .slice(0, 10)
                    .map(([date, data]) => {
                      const total = data.positive + data.negative;
                      const positivePercent = total > 0 ? (data.positive / total) * 100 : 50;
                      
                      return (
                        <div key={date} className="flex items-center gap-2">
                          <span className="font-crayon text-xs text-gray-500 w-20">
                            {formatDate(date)}
                          </span>
                          <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden flex">
                            <div 
                              className="h-full bg-green-400"
                              style={{ width: `${positivePercent}%` }}
                            />
                            <div 
                              className="h-full bg-red-400"
                              style={{ width: `${100 - positivePercent}%` }}
                            />
                          </div>
                          <span className="font-crayon text-xs text-gray-500 w-8">
                            {total}
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-100 rounded-2xl border-3 border-green-400 p-4 text-center">
                <p className="text-3xl font-display text-green-600">
                  {Object.values(trendsData.dailyData).reduce((sum, d) => sum + d.positive, 0)}
                </p>
                <p className="font-crayon text-green-700 text-sm">Positive Feelings</p>
              </div>
              <div className="bg-red-100 rounded-2xl border-3 border-red-400 p-4 text-center">
                <p className="text-3xl font-display text-red-600">
                  {Object.values(trendsData.dailyData).reduce((sum, d) => sum + d.negative, 0)}
                </p>
                <p className="font-crayon text-red-700 text-sm">Challenging Feelings</p>
              </div>
            </div>
          </>
        )}

        {/* ========== PHOTOS TAB ========== */}
        {activeTab === 'photos' && (
          <>
            <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-3">
              <p className="font-crayon text-sm text-blue-700">
                📸 <strong>Personalize with photos!</strong> Upload pictures that represent each emotion to you. 
                These photos are saved locally and included in your data backup.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {DEFAULT_FEELINGS.map(feeling => {
                const hasPhoto = emotionPhotos[feeling.id];
                
                return (
                  <div 
                    key={feeling.id}
                    className={`p-4 rounded-2xl border-4 ${feeling.color} text-center`}
                  >
                    {hasPhoto ? (
                      <div className="relative">
                        <img 
                          src={emotionPhotos[feeling.id]} 
                          alt={feeling.label}
                          className="w-20 h-20 mx-auto rounded-xl object-cover shadow-md"
                        />
                        <button
                          onClick={() => removePhoto(feeling.id)}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full
                                   hover:bg-red-600 shadow-md"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => {
                          setPhotoUploadEmotion(feeling.id);
                          fileInputRef.current?.click();
                        }}
                        className="w-20 h-20 mx-auto rounded-xl bg-white/50 border-3 border-dashed border-gray-300
                                 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-all"
                      >
                        <Upload size={24} className="text-gray-400" />
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <span className="text-2xl">{feeling.emoji}</span>
                      <p className="font-crayon text-sm text-gray-700">{feeling.label}</p>
                    </div>
                    
                    {!hasPhoto && (
                      <button
                        onClick={() => {
                          setPhotoUploadEmotion(feeling.id);
                          fileInputRef.current?.click();
                        }}
                        className="mt-2 px-3 py-1 bg-white rounded-lg font-crayon text-xs
                                 border-2 border-gray-300 hover:border-[#FF6B6B] transition-all"
                      >
                        Add Photo
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {/* Photo count */}
            <div className="text-center text-gray-500 font-crayon">
              {Object.keys(emotionPhotos).length} of {DEFAULT_FEELINGS.length} emotions have photos
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default FeelingsTracker;
