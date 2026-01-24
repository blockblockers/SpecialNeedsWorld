// EmotionMatch.jsx - Match faces to emotions activity
// 
// FEATURES:
// - AI-generated realistic faces from shared library (Supabase)
// - Personal photos stored LOCALLY on device only (HIPAA compliant)
// - Toggle to switch between personal photos and shared AI library
// - Falls back to emojis if no images are available
// - User photos never leave the device - no cloud upload

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  RotateCcw, 
  Trophy, 
  Star, 
  Volume2, 
  Plus, 
  Loader2,
  ImageIcon,
  RefreshCw,
  X,
  AlertCircle,
  Upload,
  Camera,
  Sparkles,
  User
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

// ============================================
// EMOTIONS DATA
// ============================================

const EMOTIONS = [
  { id: 'happy', word: 'Happy', color: '#F8D14A', emoji: '😊', description: 'feeling good and joyful' },
  { id: 'sad', word: 'Sad', color: '#4A9FD4', emoji: '😢', description: 'feeling unhappy or down' },
  { id: 'angry', word: 'Angry', color: '#E63B2E', emoji: '😠', description: 'feeling mad or upset' },
  { id: 'scared', word: 'Scared', color: '#8E6BBF', emoji: '😨', description: 'feeling afraid or worried' },
  { id: 'surprised', word: 'Surprised', color: '#F5A623', emoji: '😲', description: 'feeling amazed or shocked' },
  { id: 'tired', word: 'Tired', color: '#6B7280', emoji: '😴', description: 'feeling sleepy or worn out' },
  { id: 'excited', word: 'Excited', color: '#E86B9A', emoji: '🤩', description: 'feeling very happy and eager' },
  { id: 'calm', word: 'Calm', color: '#5CB85C', emoji: '😌', description: 'feeling peaceful and relaxed' },
  { id: 'confused', word: 'Confused', color: '#9CA3AF', emoji: '😕', description: 'not sure what is happening' },
  { id: 'proud', word: 'Proud', color: '#10B981', emoji: '😤', description: 'feeling good about yourself' },
  { id: 'shy', word: 'Shy', color: '#F472B6', emoji: '🙈', description: 'feeling bashful or timid' },
  { id: 'disgusted', word: 'Disgusted', color: '#84CC16', emoji: '🤢', description: 'feeling grossed out' },
];

// Game modes
const MODES = {
  faceToWord: { label: 'Face → Word', instruction: 'Tap the word that matches the face!' },
  wordToFace: { label: 'Word → Face', instruction: 'Tap the face that matches the word!' },
};

// ============================================
// MAIN COMPONENT
// ============================================

const EmotionMatch = () => {
  const navigate = useNavigate();
  
  // Game state
  const [mode, setMode] = useState('faceToWord');
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState([]);
  
  // Expression library state
  const [expressions, setExpressions] = useState({}); // { emotionId: [imageUrls] } - shared AI faces
  const [loadingExpressions, setLoadingExpressions] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false);
  const [generatingFace, setGeneratingFace] = useState(null);
  const [creditError, setCreditError] = useState(false);
  
  // Personal photos (stored LOCALLY on device only - never uploaded)
  const [personalPhotos, setPersonalPhotos] = useState({}); // { emotionId: [base64Images] }
  const [usePersonalPhotos, setUsePersonalPhotos] = useState(false); // Toggle between personal & shared
  const [uploadingFor, setUploadingFor] = useState(null);
  const [libraryTab, setLibraryTab] = useState('my-photos'); // 'my-photos' or 'ai-library'
  
  // Local storage key for personal photos (HIPAA compliant - stays on device)
  const PERSONAL_PHOTOS_KEY = 'atlas_emotion_personal_photos';
  
  // Load personal photos from localStorage on mount
  useEffect(() => {
    loadPersonalPhotos();
  }, []);
  
  const loadPersonalPhotos = () => {
    try {
      const saved = localStorage.getItem(PERSONAL_PHOTOS_KEY);
      if (saved) {
        setPersonalPhotos(JSON.parse(saved));
      }
      // Check if user prefers personal photos
      const preference = localStorage.getItem('atlas_emotion_use_personal');
      if (preference === 'true') {
        setUsePersonalPhotos(true);
      }
    } catch (error) {
      console.error('Error loading personal photos:', error);
    }
  };
  
  // Save personal photos to localStorage
  const savePersonalPhotos = (photos) => {
    try {
      localStorage.setItem(PERSONAL_PHOTOS_KEY, JSON.stringify(photos));
    } catch (error) {
      console.error('Error saving personal photos:', error);
      if (error.name === 'QuotaExceededError') {
        alert('Storage is full. Please delete some photos to add more.');
      }
    }
  };
  
  // Toggle personal photos preference
  const togglePersonalPhotos = (value) => {
    setUsePersonalPhotos(value);
    localStorage.setItem('atlas_emotion_use_personal', value.toString());
  };

  // ============================================
  // LOAD EXPRESSIONS FROM DATABASE
  // ============================================
  
  useEffect(() => {
    loadExpressions();
  }, []);
  
  const loadExpressions = async () => {
    setLoadingExpressions(true);
    
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using emoji fallback');
      setLoadingExpressions(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('emotion_expressions')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Group by emotion
      const grouped = {};
      (data || []).forEach(expr => {
        if (!grouped[expr.emotion_id]) {
          grouped[expr.emotion_id] = [];
        }
        grouped[expr.emotion_id].push(expr.image_url);
      });
      
      setExpressions(grouped);
      console.log('Loaded expressions:', Object.keys(grouped).length, 'emotions');
    } catch (error) {
      console.error('Error loading expressions:', error);
    } finally {
      setLoadingExpressions(false);
    }
  };

  // Get a random image for an emotion (considers personal vs shared preference)
  const getExpressionImage = (emotionId) => {
    // If using personal photos and we have some for this emotion
    if (usePersonalPhotos) {
      const personalImages = personalPhotos[emotionId];
      if (personalImages && personalImages.length > 0) {
        return personalImages[Math.floor(Math.random() * personalImages.length)];
      }
    }
    
    // Fall back to shared AI-generated images
    const emotionImages = expressions[emotionId];
    if (emotionImages && emotionImages.length > 0) {
      return emotionImages[Math.floor(Math.random() * emotionImages.length)];
    }
    return null;
  };
  
  // Check if we have any personal photos
  const hasPersonalPhotos = Object.values(personalPhotos).flat().length > 0;
  const totalPersonalPhotos = Object.values(personalPhotos).flat().length;

  // ============================================
  // GENERATE NEW FACE
  // ============================================
  
  const generateNewFace = async (emotionId) => {
    if (generatingFace || creditError) return;
    
    setGeneratingFace(emotionId);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-emotion-face', {
        body: { emotion: emotionId, saveToLibrary: true },
      });
      
      if (error) throw error;
      
      if (data.error === 'INSUFFICIENT_CREDITS') {
        setCreditError(true);
        return;
      }
      
      if (data.imageUrl) {
        // Add to local state
        setExpressions(prev => ({
          ...prev,
          [emotionId]: [...(prev[emotionId] || []), data.imageUrl],
        }));
        console.log('Generated new face for:', emotionId);
      }
    } catch (error) {
      console.error('Error generating face:', error);
      if (error.message?.includes('402') || error.message?.includes('credits')) {
        setCreditError(true);
      }
    } finally {
      setGeneratingFace(null);
    }
  };

  // ============================================
  // UPLOAD USER'S OWN IMAGE (Stored LOCALLY on device only - HIPAA compliant)
  // ============================================
  
  const handleFileUpload = async (emotionId, file) => {
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, WebP, or GIF image.');
      return;
    }
    
    // Validate file size (max 5MB before resize)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB.');
      return;
    }
    
    setUploadingFor(emotionId);
    
    try {
      // Convert to base64 and resize for efficient local storage
      const base64Image = await resizeAndConvertToBase64(file, 400, 400);
      
      // Save to local state
      const updatedPhotos = {
        ...personalPhotos,
        [emotionId]: [...(personalPhotos[emotionId] || []), base64Image],
      };
      
      setPersonalPhotos(updatedPhotos);
      savePersonalPhotos(updatedPhotos);
      
      // If this is their first photo, enable personal photos mode
      if (!hasPersonalPhotos) {
        togglePersonalPhotos(true);
      }
      
      console.log('Saved personal photo for:', emotionId);
      setShowUploadOptions(null);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to save image. Please try again.');
    } finally {
      setUploadingFor(null);
    }
  };
  
  // Resize image and convert to base64 for efficient local storage
  const resizeAndConvertToBase64 = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Calculate new dimensions
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          
          // Draw to canvas and export as JPEG for smaller size
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 JPEG (good quality, reasonable size)
          const base64 = canvas.toDataURL('image/jpeg', 0.85);
          resolve(base64);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };
  
  // Delete a personal photo
  const deletePersonalPhoto = (emotionId, index) => {
    const updatedPhotos = {
      ...personalPhotos,
      [emotionId]: personalPhotos[emotionId].filter((_, i) => i !== index),
    };
    setPersonalPhotos(updatedPhotos);
    savePersonalPhotos(updatedPhotos);
  };
  
  // Handle file input change
  const handleFileSelect = (emotionId) => (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(emotionId, file);
    }
    // Reset input
    event.target.value = '';
  };
  
  // Handle camera capture
  const handleCameraCapture = (emotionId) => (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(emotionId, file);
    }
    event.target.value = '';
  };

  // ============================================
  // SPEECH
  // ============================================
  
  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const speakCurrent = () => {
    if (currentEmotion) {
      if (mode === 'faceToWord') {
        speak(`This face is feeling... can you find the word?`);
      } else {
        speak(`Find the face that shows ${currentEmotion.word}`);
      }
    }
  };

  // ============================================
  // GAME LOGIC
  // ============================================
  
  const generateQuestion = useCallback(() => {
    const remaining = EMOTIONS.filter(e => !questionsAnswered.includes(e.id));
    
    if (remaining.length === 0) {
      setGameComplete(true);
      return;
    }

    const correct = remaining[Math.floor(Math.random() * remaining.length)];
    const others = EMOTIONS.filter(e => e.id !== correct.id);
    const wrongAnswers = others.sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [correct, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    // Attach images to options - getExpressionImage will use current state
    const optionsWithImages = allOptions.map(opt => ({
      ...opt,
      imageUrl: getExpressionImage(opt.id),
    }));
    
    setCurrentEmotion({
      ...correct,
      imageUrl: getExpressionImage(correct.id),
    });
    setOptions(optionsWithImages);
    setFeedback(null);
    setSelectedAnswer(null);
  }, [questionsAnswered, personalPhotos, usePersonalPhotos, expressions]);

  const startGame = useCallback(() => {
    setScore(0);
    setTotalQuestions(0);
    setQuestionsAnswered([]);
    setGameComplete(false);
    setCurrentEmotion(null);
    setGameStarted(true);
    
    // Use setTimeout to ensure state is set before generating
    setTimeout(() => {
      // Generate the first question after state is updated
      const remaining = EMOTIONS;
      if (remaining.length === 0) return;
      
      const correct = remaining[Math.floor(Math.random() * remaining.length)];
      const others = EMOTIONS.filter(e => e.id !== correct.id);
      const wrongAnswers = others.sort(() => Math.random() - 0.5).slice(0, 3);
      const allOptions = [correct, ...wrongAnswers].sort(() => Math.random() - 0.5);
      
      // Get images for options
      const getImage = (emotionId) => {
        // Check personal photos first
        const storedPersonal = localStorage.getItem('atlas_emotion_personal_photos');
        const usePersonal = localStorage.getItem('atlas_emotion_use_personal') === 'true';
        if (usePersonal && storedPersonal) {
          try {
            const photos = JSON.parse(storedPersonal);
            if (photos[emotionId]?.length > 0) {
              return photos[emotionId][Math.floor(Math.random() * photos[emotionId].length)];
            }
          } catch (e) {}
        }
        // Fall back to expressions state
        if (expressions[emotionId]?.length > 0) {
          return expressions[emotionId][Math.floor(Math.random() * expressions[emotionId].length)];
        }
        return null;
      };
      
      const optionsWithImages = allOptions.map(opt => ({
        ...opt,
        imageUrl: getImage(opt.id),
      }));
      
      setCurrentEmotion({
        ...correct,
        imageUrl: getImage(correct.id),
      });
      setOptions(optionsWithImages);
      setFeedback(null);
      setSelectedAnswer(null);
    }, 50);
  }, [expressions]);

  useEffect(() => {
    if (gameStarted && !gameComplete && !currentEmotion) {
      generateQuestion();
    }
  }, [gameStarted, gameComplete, currentEmotion, generateQuestion]);

  const handleAnswer = (emotion) => {
    if (feedback) return;
    
    setSelectedAnswer(emotion.id);
    setTotalQuestions(prev => prev + 1);
    
    if (emotion.id === currentEmotion.id) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      speak('Great job!');
      
      setTimeout(() => {
        setQuestionsAnswered(prev => [...prev, currentEmotion.id]);
        setCurrentEmotion(null);
      }, 1500);
    } else {
      setFeedback('wrong');
      speak(`That's ${emotion.word}. Try to find ${currentEmotion.word}.`);
      
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
      }, 2000);
    }
  };

  // ============================================
  // RENDER FACE (Image or Emoji fallback)
  // ============================================
  
  const renderFace = (emotion, size = 'large') => {
    const imageUrl = emotion.imageUrl;
    const sizeClass = size === 'large' ? 'w-32 h-32' : 'w-16 h-16';
    
    if (imageUrl) {
      return (
        <img 
          src={imageUrl} 
          alt={emotion.word}
          className={`${sizeClass} rounded-2xl object-cover shadow-lg`}
          onError={(e) => {
            // Fallback to emoji on error
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
      );
    }
    
    // Emoji fallback
    return (
      <span className={`${size === 'large' ? 'text-8xl' : 'text-5xl'}`}>
        {emotion.emoji}
      </span>
    );
  };

  // ============================================
  // EXPRESSION LIBRARY MODAL
  // ============================================
  
  const renderLibraryModal = () => {
    if (!showLibrary) return null;
    
    return (
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={() => setShowUploadOptions(null)} // Close dropdown when clicking outside
      >
        <div 
          className="bg-[#FFFEF5] w-full max-w-lg max-h-[80vh] rounded-3xl border-4 border-[#F5A623] overflow-hidden"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
        >
          <div className="bg-[#F5A623] text-white p-4 flex items-center justify-between">
            <h3 className="font-display text-lg flex items-center gap-2">
              <ImageIcon size={20} />
              Expression Library
            </h3>
            <button onClick={() => setShowLibrary(false)} className="p-1 hover:bg-white/20 rounded-full">
              <X size={24} />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b-2 border-gray-200">
            <button
              onClick={() => setLibraryTab('my-photos')}
              className={`flex-1 py-3 font-crayon text-sm flex items-center justify-center gap-2 transition-colors
                ${libraryTab === 'my-photos' 
                  ? 'bg-blue-50 text-blue-700 border-b-3 border-blue-500' 
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              <User size={16} />
              My Photos
              {totalPersonalPhotos > 0 && (
                <span className="bg-blue-500 text-white text-xs px-1.5 rounded-full">{totalPersonalPhotos}</span>
              )}
            </button>
            <button
              onClick={() => setLibraryTab('ai-library')}
              className={`flex-1 py-3 font-crayon text-sm flex items-center justify-center gap-2 transition-colors
                ${libraryTab === 'ai-library' 
                  ? 'bg-purple-50 text-purple-700 border-b-3 border-purple-500' 
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              <Sparkles size={16} />
              AI Library
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto max-h-[50vh]">
            {/* Use My Photos Toggle - only show if user has photos */}
            {totalPersonalPhotos > 0 && (
              <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-crayon text-gray-700 text-sm">
                    Use my photos in the game
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={usePersonalPhotos}
                      onChange={(e) => togglePersonalPhotos(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${usePersonalPhotos ? 'bg-blue-500' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${usePersonalPhotos ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`} />
                    </div>
                  </div>
                </label>
                <p className="font-crayon text-xs text-gray-500 mt-1">
                  {usePersonalPhotos ? '✓ Using your personal photos' : 'Using shared AI faces'}
                </p>
              </div>
            )}
            
            {libraryTab === 'my-photos' ? (
              /* My Photos Tab */
              <>
                {/* Privacy notice */}
                <div className="mb-4 p-3 bg-green-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 text-lg">🔒</span>
                    <div>
                      <p className="font-crayon text-green-800 text-sm font-bold">
                        Private & Secure
                      </p>
                      <p className="font-crayon text-green-600 text-xs mt-1">
                        Your photos stay on this device only. They are never uploaded to any server.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {EMOTIONS.map(emotion => {
                    const emotionPhotos = personalPhotos[emotion.id] || [];
                    const hasPhotos = emotionPhotos.length > 0;
                    const isUploading = uploadingFor === emotion.id;
                    
                    return (
                      <div key={emotion.id} className="text-center relative">
                        <div 
                          className="w-20 h-20 mx-auto rounded-xl border-3 flex items-center justify-center mb-1 relative overflow-hidden"
                          style={{ borderColor: emotion.color, backgroundColor: `${emotion.color}20` }}
                        >
                          {hasPhotos ? (
                            <>
                              <img 
                                src={emotionPhotos[0]} 
                                alt={emotion.word}
                                className="w-full h-full object-cover"
                              />
                              {/* Delete button */}
                              <button
                                onClick={() => deletePersonalPhoto(emotion.id, 0)}
                                className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </>
                          ) : (
                            <span className="text-3xl">{emotion.emoji}</span>
                          )}
                          
                          {/* Count badge */}
                          {emotionPhotos.length > 1 && (
                            <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1.5 rounded-full font-crayon">
                              {emotionPhotos.length}
                            </span>
                          )}
                          
                          {/* Upload progress overlay */}
                          {isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 size={24} className="text-white animate-spin" />
                            </div>
                          )}
                        </div>
                        
                        <p className="font-crayon text-xs text-gray-700 mb-1">{emotion.word}</p>
                        
                        {/* Add photo buttons */}
                        <div className="flex gap-1 justify-center">
                          <label className={`px-2 py-1 rounded-lg text-xs font-crayon flex items-center gap-1 cursor-pointer
                            ${isUploading ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                          >
                            <Upload size={10} />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={isUploading}
                              onChange={handleFileSelect(emotion.id)}
                            />
                          </label>
                          <label className={`px-2 py-1 rounded-lg text-xs font-crayon flex items-center gap-1 cursor-pointer
                            ${isUploading ? 'bg-gray-200 text-gray-500' : 'bg-green-500 text-white hover:bg-green-600'}`}
                          >
                            <Camera size={10} />
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              className="hidden"
                              disabled={isUploading}
                              onChange={handleCameraCapture(emotion.id)}
                            />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* AI Library Tab */
              <>
                {creditError && (
                  <div className="mb-4 p-3 bg-amber-100 border-2 border-amber-400 rounded-xl flex items-start gap-2">
                    <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-crayon text-amber-800 text-sm">
                        Unable to generate new faces - API credits exhausted.
                      </p>
                      <p className="font-crayon text-amber-600 text-xs mt-1">
                        Existing faces in the library are still available.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-4">
                  {EMOTIONS.map(emotion => {
                    const emotionImages = expressions[emotion.id] || [];
                    const hasImages = emotionImages.length > 0;
                    const isGenerating = generatingFace === emotion.id;
                    
                    return (
                      <div key={emotion.id} className="text-center">
                        <div 
                          className="w-20 h-20 mx-auto rounded-xl border-3 flex items-center justify-center mb-1 relative overflow-hidden"
                          style={{ borderColor: emotion.color, backgroundColor: `${emotion.color}20` }}
                        >
                          {hasImages ? (
                            <img 
                              src={emotionImages[0]} 
                              alt={emotion.word}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl">{emotion.emoji}</span>
                          )}
                          
                          {/* Count badge */}
                          {hasImages && (
                            <span className="absolute bottom-1 right-1 bg-purple-500 text-white text-xs px-1.5 rounded-full font-crayon">
                              {emotionImages.length}
                            </span>
                          )}
                          
                          {/* Generating overlay */}
                          {isGenerating && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 size={24} className="text-white animate-spin" />
                            </div>
                          )}
                        </div>
                        
                        <p className="font-crayon text-xs text-gray-700 mb-1">{emotion.word}</p>
                        
                        {/* Generate button */}
                        <button
                          onClick={() => generateNewFace(emotion.id)}
                          disabled={isGenerating || creditError}
                          className={`px-2 py-1 rounded-lg text-xs font-crayon flex items-center gap-1 mx-auto
                            ${isGenerating 
                              ? 'bg-gray-200 text-gray-500' 
                              : creditError
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-purple-500 text-white hover:bg-purple-600'
                            }`}
                        >
                          {isGenerating ? (
                            <><Loader2 size={12} className="animate-spin" /></>
                          ) : (
                            <><Sparkles size={12} /> AI</>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            
            <div className="mt-4 pt-4 border-t-2 border-gray-200">
              {/* Upload tips */}
              {libraryTab === 'my-photos' && (
                <div className="bg-blue-50 rounded-xl p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <User size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-crayon text-blue-800 text-sm font-bold">
                        Personalize Learning!
                      </p>
                      <p className="font-crayon text-blue-600 text-xs mt-1">
                        Add photos of family members showing different emotions. 
                        Familiar faces make learning more engaging!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => {
                  loadExpressions();
                  loadPersonalPhotos();
                }}
                className="w-full px-4 py-2 bg-gray-100 rounded-xl font-crayon text-gray-600 hover:bg-gray-200 flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // START SCREEN
  // ============================================
  
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/activities')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F5A623] 
                         rounded-xl font-display font-bold text-[#F5A623] hover:bg-[#F5A623] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-display text-[#F5A623] crayon-text flex items-center gap-2">
                😊 Emotion Match
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl border-4 border-[#F5A623] p-6 shadow-crayon">
            <h2 className="text-2xl font-display text-center text-[#F5A623] mb-2">
              Learn Emotions!
            </h2>
            <p className="text-center text-gray-600 font-crayon mb-6">
              Match faces with feeling words
            </p>

            {/* Expression count */}
            {loadingExpressions ? (
              <div className="flex items-center justify-center gap-2 mb-4 text-gray-500">
                <Loader2 size={16} className="animate-spin" />
                <span className="font-crayon text-sm">Loading faces...</span>
              </div>
            ) : (
              <div className="text-center mb-4">
                {totalPersonalPhotos > 0 ? (
                  <div className="space-y-2">
                    <span className="font-crayon text-sm text-gray-600 block">
                      🔒 {totalPersonalPhotos} personal photo{totalPersonalPhotos !== 1 ? 's' : ''} on this device
                    </span>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={usePersonalPhotos}
                        onChange={(e) => togglePersonalPhotos(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-500"
                      />
                      <span className="font-crayon text-sm text-blue-700">Use my photos</span>
                    </label>
                  </div>
                ) : (
                  <span className="font-crayon text-sm text-gray-600">
                    {Object.values(expressions).flat().length > 0 
                      ? `${Object.values(expressions).flat().length} AI faces available`
                      : 'Using emoji faces (add photos in library)'}
                  </span>
                )}
                <button
                  onClick={() => setShowLibrary(true)}
                  className="ml-2 text-[#F5A623] underline font-crayon text-sm hover:text-orange-600"
                >
                  View Library
                </button>
              </div>
            )}

            {/* Mode Selection */}
            <div className="mb-6">
              <label className="block font-crayon text-gray-700 mb-2">Activity Type:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode('faceToWord')}
                  className={`p-4 rounded-xl border-3 font-crayon transition-all
                    ${mode === 'faceToWord' 
                      ? 'border-[#F5A623] bg-orange-50 text-[#F5A623]' 
                      : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                    }`}
                >
                  <span className="flex items-center justify-center gap-1 mb-1">
                    😊 → ?
                  </span>
                  <span className="text-sm">See Face</span>
                  <span className="block text-xs">Find Word</span>
                </button>
                <button
                  onClick={() => setMode('wordToFace')}
                  className={`p-4 rounded-xl border-3 font-crayon transition-all
                    ${mode === 'wordToFace' 
                      ? 'border-[#F5A623] bg-orange-50 text-[#F5A623]' 
                      : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                    }`}
                >
                  <span className="flex items-center justify-center gap-1 mb-1">
                    ? → 😊
                  </span>
                  <span className="text-sm">See Word</span>
                  <span className="block text-xs">Find Face</span>
                </button>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startGame}
              disabled={loadingExpressions}
              className="w-full py-4 bg-gradient-to-r from-[#F5A623] to-orange-500 text-white 
                       rounded-2xl font-display text-xl shadow-lg hover:scale-105 
                       transition-transform disabled:opacity-50"
            >
              ▶️ Start Activity!
            </button>

            {/* More Expressions Button */}
            <button
              onClick={() => setShowLibrary(true)}
              className="w-full mt-3 py-3 bg-white border-3 border-[#F5A623] text-[#F5A623]
                       rounded-xl font-crayon hover:bg-orange-50 transition-all
                       flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add Photos
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-orange-50 rounded-2xl border-3 border-orange-200">
            <h3 className="font-display text-[#F5A623] mb-2">About This Activity</h3>
            <ul className="font-crayon text-sm text-orange-700 space-y-1">
              <li>• Learn to recognize emotions in faces</li>
              <li>• {EMOTIONS.length} different emotions to learn</li>
              <li>• 🔒 Your photos stay private on this device</li>
              <li>• Or use AI-generated faces from the shared library</li>
            </ul>
          </div>
        </main>
        
        {renderLibraryModal()}
      </div>
    );
  }

  // ============================================
  // GAME COMPLETE SCREEN
  // ============================================
  
  if (gameComplete) {
    const percentage = Math.round((score / totalQuestions) * 100);
    
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/activities')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F5A623] 
                         rounded-xl font-display font-bold text-[#F5A623] hover:bg-[#F5A623] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <h1 className="text-lg font-display text-[#F5A623]">Emotion Match</h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8 text-center">
          <div className="bg-white rounded-3xl border-4 border-[#5CB85C] p-8 shadow-crayon">
            <Trophy size={64} className="text-[#F8D14A] mx-auto mb-4" />
            <h2 className="text-3xl font-display text-[#5CB85C] mb-2">Great Job!</h2>
            <p className="font-crayon text-xl text-gray-700 mb-4">
              You got {score} out of {totalQuestions}!
            </p>
            
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={32} 
                  className={i < Math.ceil(percentage / 20) ? 'text-[#F8D14A] fill-[#F8D14A]' : 'text-gray-300'}
                />
              ))}
            </div>

            <div className="space-y-3">
              <button
                onClick={startGame}
                className="w-full py-3 bg-[#5CB85C] text-white rounded-xl font-display text-lg 
                         hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Try Again
              </button>
              <button
                onClick={() => setGameStarted(false)}
                className="w-full py-3 border-3 border-gray-300 rounded-xl font-crayon text-gray-600 
                         hover:border-gray-400 transition-colors"
              >
                Change Settings
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ============================================
  // GAME PLAY SCREEN
  // ============================================
  
  // Show loading while generating question
  if (!currentEmotion) {
    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-[#F5A623] animate-spin mx-auto mb-4" />
          <p className="font-crayon text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => {
              setGameStarted(false);
              setCurrentEmotion(null);
            }}
            className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#F5A623] 
                       rounded-xl font-display text-[#F5A623] hover:bg-[#F5A623] 
                       hover:text-white transition-all text-sm"
          >
            <ArrowLeft size={16} />
            Exit
          </button>
          
          <div className="flex items-center gap-4">
            <span className="font-display text-[#F5A623]">
              {MODES[mode].label}
            </span>
            <span className="px-3 py-1 bg-[#F5A623] text-white rounded-full font-display">
              {score} / {totalQuestions}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Progress */}
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#F5A623] transition-all duration-300"
              style={{ width: `${(questionsAnswered.length / EMOTIONS.length) * 100}%` }}
            />
          </div>
          <p className="text-center font-crayon text-sm text-gray-500 mt-1">
            {questionsAnswered.length} of {EMOTIONS.length} emotions
          </p>
        </div>

        {/* Question */}
        <div className="bg-white rounded-3xl border-4 border-[#F5A623] p-6 mb-6 text-center">
          <p className="font-crayon text-gray-600 mb-4">
            {MODES[mode].instruction}
          </p>
          
          {mode === 'faceToWord' ? (
            <div className="flex flex-col items-center">
              {renderFace(currentEmotion, 'large')}
              {/* Hidden emoji fallback */}
              <span className="hidden text-8xl">{currentEmotion?.emoji}</span>
            </div>
          ) : (
            <>
              <p className="text-4xl font-display mb-2" style={{ color: currentEmotion?.color }}>
                {currentEmotion?.word}
              </p>
              <p className="text-sm text-gray-500 font-crayon">
                ({currentEmotion?.description})
              </p>
            </>
          )}
          
          <button
            onClick={speakCurrent}
            className="mt-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            title="Hear it"
          >
            <Volume2 size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrect = option.id === currentEmotion?.id;
            const showCorrect = feedback && isCorrect;
            const showWrong = feedback === 'wrong' && isSelected;

            return (
              <button
                key={option.id}
                onClick={() => handleAnswer(option)}
                disabled={!!feedback}
                className={`
                  p-4 rounded-2xl border-4 transition-all duration-300
                  ${showCorrect 
                    ? 'border-[#5CB85C] bg-green-100 scale-105' 
                    : showWrong 
                      ? 'border-[#E63B2E] bg-red-100 animate-shake' 
                      : 'border-gray-300 bg-white hover:border-[#F5A623] hover:scale-105'
                  }
                  ${feedback && !showCorrect && !showWrong ? 'opacity-50' : ''}
                `}
              >
                {mode === 'faceToWord' ? (
                  <span className="block text-xl font-display" style={{ color: option.color }}>
                    {option.word}
                  </span>
                ) : (
                  <div className="flex flex-col items-center">
                    {option.imageUrl ? (
                      <img 
                        src={option.imageUrl} 
                        alt={option.word}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    ) : (
                      <span className="text-5xl">{option.emoji}</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`
            mt-6 p-4 rounded-2xl text-center font-crayon text-lg
            ${feedback === 'correct' 
              ? 'bg-green-100 text-green-700 border-2 border-green-300' 
              : 'bg-red-100 text-red-700 border-2 border-red-300'
            }
          `}>
            {feedback === 'correct' 
              ? '🎉 Correct! Great job!' 
              : `Try again! That's ${options.find(o => o.id === selectedAnswer)?.word}`
            }
          </div>
        )}
      </main>
      
      {renderLibraryModal()}
      
      {/* Shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default EmotionMatch;
