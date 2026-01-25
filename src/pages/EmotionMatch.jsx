// EmotionMatch.jsx - Match faces to emotions activity
// 
// FEATURES:
// - AI-generated realistic human faces from shared library (Supabase)
// - Pre-seeded with stylized face illustrations (NOT emojis!)
// - Personal photos stored LOCALLY on device only (HIPAA compliant)
// - User-uploaded photos are PRIVATE (never shared to cloud)
// - AI-generated faces ARE shared to community library
// - Game stats integration for streak tracking

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  RotateCcw, 
  Trophy, 
  Star, 
  Volume2, 
  Loader2,
  ImageIcon,
  X,
  AlertCircle,
  Upload,
  Camera,
  Sparkles,
  User,
  Lock
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { recordGameCompletion } from '../services/gameStatsService';

// ============================================
// EMOTIONS DATA
// ============================================

const EMOTIONS = [
  { id: 'happy', word: 'Happy', color: '#F8D14A', description: 'feeling good and joyful' },
  { id: 'sad', word: 'Sad', color: '#4A9FD4', description: 'feeling unhappy or down' },
  { id: 'angry', word: 'Angry', color: '#E63B2E', description: 'feeling mad or upset' },
  { id: 'scared', word: 'Scared', color: '#8E6BBF', description: 'feeling afraid or worried' },
  { id: 'surprised', word: 'Surprised', color: '#F5A623', description: 'feeling amazed or shocked' },
  { id: 'tired', word: 'Tired', color: '#6B7280', description: 'feeling sleepy or worn out' },
  { id: 'excited', word: 'Excited', color: '#E86B9A', description: 'feeling very happy and eager' },
  { id: 'calm', word: 'Calm', color: '#5CB85C', description: 'feeling peaceful and relaxed' },
  { id: 'confused', word: 'Confused', color: '#9CA3AF', description: 'not sure what is happening' },
  { id: 'proud', word: 'Proud', color: '#10B981', description: 'feeling good about yourself' },
  { id: 'shy', word: 'Shy', color: '#F472B6', description: 'feeling bashful or timid' },
  { id: 'disgusted', word: 'Disgusted', color: '#84CC16', description: 'feeling grossed out' },
];

// Stylized face illustrations - human-like faces (NOT emojis!)
const PLACEHOLDER_FACES = {
  happy: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#FFE4B5" stroke="#D4A574" stroke-width="2"/><ellipse cx="35" cy="40" rx="5" ry="6" fill="#4A3728"/><ellipse cx="65" cy="40" rx="5" ry="6" fill="#4A3728"/><path d="M 30 60 Q 50 80 70 60" stroke="#D4A574" stroke-width="3" fill="none"/><circle cx="28" cy="55" r="8" fill="#FFB6C1" opacity="0.5"/><circle cx="72" cy="55" r="8" fill="#FFB6C1" opacity="0.5"/></svg>`,
  sad: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#FFE4B5" stroke="#D4A574" stroke-width="2"/><ellipse cx="35" cy="42" rx="5" ry="6" fill="#4A3728"/><ellipse cx="65" cy="42" rx="5" ry="6" fill="#4A3728"/><path d="M 30 70 Q 50 55 70 70" stroke="#D4A574" stroke-width="3" fill="none"/><path d="M 30 35 L 40 38" stroke="#4A3728" stroke-width="2"/><path d="M 70 35 L 60 38" stroke="#4A3728" stroke-width="2"/></svg>`,
  angry: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#FFE4B5" stroke="#D4A574" stroke-width="2"/><ellipse cx="35" cy="45" rx="5" ry="5" fill="#4A3728"/><ellipse cx="65" cy="45" rx="5" ry="5" fill="#4A3728"/><path d="M 30 65 L 70 65" stroke="#D4A574" stroke-width="3"/><path d="M 25 35 L 40 40" stroke="#4A3728" stroke-width="3"/><path d="M 75 35 L 60 40" stroke="#4A3728" stroke-width="3"/></svg>`,
  scared: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#FFE4B5" stroke="#D4A574" stroke-width="2"/><ellipse cx="35" cy="40" rx="7" ry="9" fill="white" stroke="#4A3728" stroke-width="2"/><ellipse cx="65" cy="40" rx="7" ry="9" fill="white" stroke="#4A3728" stroke-width="2"/><circle cx="35" cy="40" r="3" fill="#4A3728"/><circle cx="65" cy="40" r="3" fill="#4A3728"/><ellipse cx="50" cy="70" rx="10" ry="8" fill="#D4A574"/></svg>`,
  surprised: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#FFE4B5" stroke="#D4A574" stroke-width="2"/><ellipse cx="35" cy="40" rx="8" ry="10" fill="white" stroke="#4A3728" stroke-width="2"/><ellipse cx="65" cy="40" rx="8" ry="10" fill="white" stroke="#4A3728" stroke-width="2"/><circle cx="35" cy="40" r="4" fill="#4A3728"/><circle cx="65" cy="40" r="4" fill="#4A3728"/><ellipse cx="50" cy="70" rx="12" ry="10" fill="#D4A574"/><path d="M 30 28 L 40 32" stroke="#4A3728" stroke-width="2"/><path d="M 70 28 L 60 32" stroke="#4A3728" stroke-width="2"/></svg>`,
  tired: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#FFE4B5" stroke="#D4A574" stroke-width="2"/><path d="M 28 42 Q 35 38 42 42" stroke="#4A3728" stroke-width="2" fill="none"/><path d="M 58 42 Q 65 38 72 42" stroke="#4A3728" stroke-width="2" fill="none"/><path d="M 35 68 Q 50 72 65 68" stroke="#D4A574" stroke-width="2" fill="none"/><ellipse cx="25" cy="55" rx="6" ry="4" fill="#B8A090" opacity="0.3"/><ellipse cx="75" cy="55" rx="6" ry="4" fill="#B8A090" opacity="0.3"/></svg>`,
  excited: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#FFE4B5" stroke="#D4A574" stroke-width="2"/><ellipse cx="35" cy="38" rx="6" ry="7" fill="#4A3728"/><ellipse cx="65" cy="38" rx="6" ry="7" fill="#4A3728"/><path d="M 25 58 Q 50 85 75 58" stroke="#D4A574" stroke-width="3" fill="#FFF"/><circle cx="25" cy="52" r="10" fill="#FFB6C1" opacity="0.6"/><circle cx="75" cy="52" r="10" fill="#FFB6C1" opacity="0.6"/><path d="M 28 30 L 42 35" stroke="#4A3728" stroke-width="2"/><path d="M 72 30 L 58 35" stroke="#4A3728" stroke-width="2"/></svg>`,
  calm: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#FFE4B5" stroke="#D4A574" stroke-width="2"/><path d="M 28 42 Q 35 45 42 42" stroke="#4A3728" stroke-width="2" fill="none"/><path d="M 58 42 Q 65 45 72 42" stroke="#4A3728" stroke-width="2" fill="none"/><path d="M 35 65 Q 50 72 65 65" stroke="#D4A574" stroke-width="2" fill="none"/></svg>`,
  confused: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#FFE4B5" stroke="#D4A574" stroke-width="2"/><ellipse cx="35" cy="42" rx="5" ry="6" fill="#4A3728"/><ellipse cx="65" cy="38" rx="5" ry="6" fill="#4A3728"/><path d="M 35 68 Q 55 65 65 70" stroke="#D4A574" stroke-width="3" fill="none"/><path d="M 25 35 L 40 38" stroke="#4A3728" stroke-width="2"/><path d="M 75 32 L 60 35" stroke="#4A3728" stroke-width="2"/></svg>`,
  proud: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#FFE4B5" stroke="#D4A574" stroke-width="2"/><path d="M 28 42 Q 35 38 42 42" stroke="#4A3728" stroke-width="2" fill="none"/><path d="M 58 42 Q 65 38 72 42" stroke="#4A3728" stroke-width="2" fill="none"/><path d="M 30 60 Q 50 75 70 60" stroke="#D4A574" stroke-width="3" fill="none"/><circle cx="50" cy="25" r="3" fill="#F8D14A"/></svg>`,
  shy: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#FFE4B5" stroke="#D4A574" stroke-width="2"/><ellipse cx="40" cy="42" rx="4" ry="5" fill="#4A3728"/><path d="M 58 42 Q 65 45 72 42" stroke="#4A3728" stroke-width="2" fill="none"/><path d="M 38 65 Q 50 70 62 65" stroke="#D4A574" stroke-width="2" fill="none"/><circle cx="30" cy="55" r="10" fill="#FFB6C1" opacity="0.6"/><circle cx="70" cy="55" r="10" fill="#FFB6C1" opacity="0.6"/></svg>`,
  disgusted: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#FFE4B5" stroke="#D4A574" stroke-width="2"/><ellipse cx="35" cy="42" rx="4" ry="4" fill="#4A3728"/><ellipse cx="65" cy="42" rx="4" ry="4" fill="#4A3728"/><path d="M 35 68 Q 45 60 55 68 Q 60 62 70 65" stroke="#D4A574" stroke-width="3" fill="none"/><path d="M 30 36 L 42 40" stroke="#4A3728" stroke-width="2"/><circle cx="48" cy="55" r="3" fill="#90EE90" opacity="0.4"/></svg>`,
};

// Convert SVG to data URL
const svgToDataUrl = (svg) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

// Get placeholder face for emotion
const getPlaceholderFace = (emotionId) => {
  const svg = PLACEHOLDER_FACES[emotionId];
  return svg ? svgToDataUrl(svg) : null;
};

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
  const [expressions, setExpressions] = useState({});
  const [loadingExpressions, setLoadingExpressions] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false);
  const [generatingFace, setGeneratingFace] = useState(null);
  const [creditError, setCreditError] = useState(false);
  
  // Personal photos (PRIVATE - stored locally only)
  const [personalPhotos, setPersonalPhotos] = useState({});
  const [usePersonalPhotos, setUsePersonalPhotos] = useState(false);
  const [uploadingFor, setUploadingFor] = useState(null);
  const [libraryTab, setLibraryTab] = useState('my-photos');
  
  const PERSONAL_PHOTOS_KEY = 'atlas_emotion_personal_photos';
  
  // Load personal photos on mount
  useEffect(() => {
    loadPersonalPhotos();
  }, []);
  
  const loadPersonalPhotos = () => {
    try {
      const saved = localStorage.getItem(PERSONAL_PHOTOS_KEY);
      if (saved) setPersonalPhotos(JSON.parse(saved));
      const preference = localStorage.getItem('atlas_emotion_use_personal');
      if (preference === 'true') setUsePersonalPhotos(true);
    } catch (error) {
      console.error('Error loading personal photos:', error);
    }
  };
  
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
  
  const togglePersonalPhotos = (value) => {
    setUsePersonalPhotos(value);
    localStorage.setItem('atlas_emotion_use_personal', value.toString());
  };

  // Load expressions from database
  useEffect(() => {
    loadExpressions();
  }, []);
  
  const loadExpressions = async () => {
    setLoadingExpressions(true);
    
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using placeholder faces');
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
      
      const grouped = {};
      (data || []).forEach(expr => {
        if (!grouped[expr.emotion_id]) grouped[expr.emotion_id] = [];
        grouped[expr.emotion_id].push(expr.image_url);
      });
      
      setExpressions(grouped);
      console.log('Loaded', Object.values(grouped).flat().length, 'AI faces');
    } catch (error) {
      console.error('Error loading expressions:', error);
    } finally {
      setLoadingExpressions(false);
    }
  };

  // Get face image (personal > AI > placeholder)
  const getExpressionImage = (emotionId) => {
    if (usePersonalPhotos) {
      const personalImages = personalPhotos[emotionId];
      if (personalImages?.length > 0) {
        return personalImages[Math.floor(Math.random() * personalImages.length)];
      }
    }
    
    const emotionImages = expressions[emotionId];
    if (emotionImages?.length > 0) {
      return emotionImages[Math.floor(Math.random() * emotionImages.length)];
    }
    
    return getPlaceholderFace(emotionId);
  };
  
  const hasPersonalPhotos = Object.values(personalPhotos).flat().length > 0;
  const totalPersonalPhotos = Object.values(personalPhotos).flat().length;
  const totalAIFaces = Object.values(expressions).flat().length;

  // Generate new AI face (shared with community)
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
        setExpressions(prev => ({
          ...prev,
          [emotionId]: [...(prev[emotionId] || []), data.imageUrl],
        }));
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

  // Upload personal photo (PRIVATE - never shared)
  const handleFileUpload = async (emotionId, file) => {
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, WebP, or GIF image.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB.');
      return;
    }
    
    setUploadingFor(emotionId);
    
    try {
      const base64Image = await resizeAndConvertToBase64(file, 400, 400);
      const updatedPhotos = {
        ...personalPhotos,
        [emotionId]: [...(personalPhotos[emotionId] || []), base64Image],
      };
      
      setPersonalPhotos(updatedPhotos);
      savePersonalPhotos(updatedPhotos);
      
      if (!hasPersonalPhotos) togglePersonalPhotos(true);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to save image.');
    } finally {
      setUploadingFor(null);
    }
  };
  
  const resizeAndConvertToBase64 = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };
  
  const deletePersonalPhoto = (emotionId, index) => {
    const updatedPhotos = {
      ...personalPhotos,
      [emotionId]: personalPhotos[emotionId].filter((_, i) => i !== index),
    };
    setPersonalPhotos(updatedPhotos);
    savePersonalPhotos(updatedPhotos);
  };
  
  const handleFileSelect = (emotionId) => (event) => {
    const file = event.target.files?.[0];
    if (file) handleFileUpload(emotionId, file);
    event.target.value = '';
  };

  // Speech
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
      speak(mode === 'faceToWord' 
        ? `This face is feeling... can you find the word?`
        : `Find the face that shows ${currentEmotion.word}`);
    }
  };

  // Game logic
  const generateQuestion = useCallback(() => {
    const remaining = EMOTIONS.filter(e => !questionsAnswered.includes(e.id));
    
    if (remaining.length === 0) {
      setGameComplete(true);
      const stars = score >= 10 ? 3 : score >= 7 ? 2 : 1;
      try {
        recordGameCompletion('emotion-match', stars, score);
      } catch (e) {
        console.log('Stats service not available');
      }
      return;
    }

    const correct = remaining[Math.floor(Math.random() * remaining.length)];
    const others = EMOTIONS.filter(e => e.id !== correct.id);
    const wrongAnswers = others.sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [correct, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    const optionsWithImages = allOptions.map(opt => ({
      ...opt,
      imageUrl: getExpressionImage(opt.id),
    }));
    
    setCurrentEmotion({ ...correct, imageUrl: getExpressionImage(correct.id) });
    setOptions(optionsWithImages);
    setFeedback(null);
    setSelectedAnswer(null);
  }, [questionsAnswered, personalPhotos, usePersonalPhotos, expressions, score]);

  const startGame = useCallback(() => {
    setScore(0);
    setTotalQuestions(0);
    setQuestionsAnswered([]);
    setGameComplete(false);
    setCurrentEmotion(null);
    setGameStarted(true);
    
    setTimeout(() => {
      const correct = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
      const others = EMOTIONS.filter(e => e.id !== correct.id);
      const wrongAnswers = others.sort(() => Math.random() - 0.5).slice(0, 3);
      const allOptions = [correct, ...wrongAnswers].sort(() => Math.random() - 0.5);
      
      const getImage = (emotionId) => {
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
        if (expressions[emotionId]?.length > 0) {
          return expressions[emotionId][Math.floor(Math.random() * expressions[emotionId].length)];
        }
        return getPlaceholderFace(emotionId);
      };
      
      setCurrentEmotion({ ...correct, imageUrl: getImage(correct.id) });
      setOptions(allOptions.map(opt => ({ ...opt, imageUrl: getImage(opt.id) })));
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

  // Render face (always image, never emoji)
  const renderFace = (emotion, size = 'large') => {
    const imageUrl = emotion.imageUrl || getPlaceholderFace(emotion.id);
    const sizeClass = size === 'large' ? 'w-32 h-32' : 'w-16 h-16';
    
    return (
      <div 
        className={`${sizeClass} rounded-2xl overflow-hidden shadow-lg flex items-center justify-center`}
        style={{ backgroundColor: emotion.color + '30' }}
      >
        <img 
          src={imageUrl} 
          alt={emotion.word}
          className={`w-full h-full ${imageUrl?.includes('svg') ? 'object-contain p-2' : 'object-cover'}`}
          onError={(e) => { e.target.src = getPlaceholderFace(emotion.id); }}
        />
      </div>
    );
  };

  // Library modal
  const renderLibraryModal = () => {
    if (!showLibrary) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-[#FFFEF5] w-full max-w-lg max-h-[80vh] rounded-3xl border-4 border-[#F5A623] overflow-hidden">
          <div className="bg-[#F5A623] text-white p-4 flex items-center justify-between">
            <h3 className="font-display text-lg flex items-center gap-2">
              <ImageIcon size={20} />
              Expression Library
            </h3>
            <button onClick={() => setShowLibrary(false)} className="p-1 hover:bg-white/20 rounded-full">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex border-b-2 border-gray-200">
            <button
              onClick={() => setLibraryTab('my-photos')}
              className={`flex-1 py-3 font-crayon text-sm flex items-center justify-center gap-2 transition-colors
                ${libraryTab === 'my-photos' ? 'bg-blue-50 text-blue-700 border-b-3 border-blue-500' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <User size={16} />My Photos
              {totalPersonalPhotos > 0 && <span className="bg-blue-500 text-white text-xs px-1.5 rounded-full">{totalPersonalPhotos}</span>}
            </button>
            <button
              onClick={() => setLibraryTab('ai-library')}
              className={`flex-1 py-3 font-crayon text-sm flex items-center justify-center gap-2 transition-colors
                ${libraryTab === 'ai-library' ? 'bg-purple-50 text-purple-700 border-b-3 border-purple-500' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Sparkles size={16} />AI Faces
              {totalAIFaces > 0 && <span className="bg-purple-500 text-white text-xs px-1.5 rounded-full">{totalAIFaces}</span>}
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto max-h-[50vh]">
            {totalPersonalPhotos > 0 && (
              <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-crayon text-gray-700 text-sm">Use my photos in the game</span>
                  <div className="relative">
                    <input type="checkbox" checked={usePersonalPhotos} onChange={(e) => togglePersonalPhotos(e.target.checked)} className="sr-only" />
                    <div className={`w-12 h-6 rounded-full transition-colors ${usePersonalPhotos ? 'bg-blue-500' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${usePersonalPhotos ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`} />
                    </div>
                  </div>
                </label>
              </div>
            )}
            
            {libraryTab === 'my-photos' ? (
              <>
                <div className="mb-4 p-3 bg-green-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-start gap-2">
                    <Lock size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-crayon text-green-800 text-sm font-bold">100% Private</p>
                      <p className="font-crayon text-green-600 text-xs mt-1">Your photos stay on this device only. NEVER uploaded.</p>
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
                        <div className="w-20 h-20 mx-auto rounded-xl border-3 flex items-center justify-center mb-1 relative overflow-hidden"
                          style={{ borderColor: emotion.color, backgroundColor: `${emotion.color}20` }}>
                          {hasPhotos ? (
                            <>
                              <img src={emotionPhotos[0]} alt={emotion.word} className="w-full h-full object-cover" />
                              <button onClick={() => deletePersonalPhoto(emotion.id, 0)}
                                className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">×</button>
                            </>
                          ) : (
                            <img src={getPlaceholderFace(emotion.id)} alt={emotion.word} className="w-full h-full object-contain p-1 opacity-50" />
                          )}
                          {emotionPhotos.length > 1 && <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1.5 rounded-full">{emotionPhotos.length}</span>}
                          {isUploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 size={24} className="text-white animate-spin" /></div>}
                        </div>
                        <p className="font-crayon text-xs text-gray-700 mb-1">{emotion.word}</p>
                        <div className="flex gap-1 justify-center">
                          <label className={`px-2 py-1 rounded-lg text-xs font-crayon flex items-center gap-1 cursor-pointer ${isUploading ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                            <Upload size={10} />
                            <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={handleFileSelect(emotion.id)} />
                          </label>
                          <label className={`px-2 py-1 rounded-lg text-xs font-crayon flex items-center gap-1 cursor-pointer ${isUploading ? 'bg-gray-200 text-gray-500' : 'bg-green-500 text-white hover:bg-green-600'}`}>
                            <Camera size={10} />
                            <input type="file" accept="image/*" capture="environment" className="hidden" disabled={isUploading} onChange={handleFileSelect(emotion.id)} />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 p-3 bg-purple-50 rounded-xl border-2 border-purple-200">
                  <div className="flex items-start gap-2">
                    <Sparkles size={18} className="text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-crayon text-purple-800 text-sm font-bold">AI-Generated Faces</p>
                      <p className="font-crayon text-purple-600 text-xs mt-1">These faces are shared with all users.</p>
                    </div>
                  </div>
                </div>
                
                {creditError && (
                  <div className="mb-4 p-3 bg-amber-100 border-2 border-amber-400 rounded-xl flex items-start gap-2">
                    <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="font-crayon text-amber-800 text-sm">Unable to generate new faces - API credits exhausted.</p>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-4">
                  {EMOTIONS.map(emotion => {
                    const emotionImages = expressions[emotion.id] || [];
                    const hasImages = emotionImages.length > 0;
                    const isGenerating = generatingFace === emotion.id;
                    
                    return (
                      <div key={emotion.id} className="text-center">
                        <div className="w-20 h-20 mx-auto rounded-xl border-3 flex items-center justify-center mb-1 relative overflow-hidden"
                          style={{ borderColor: emotion.color, backgroundColor: `${emotion.color}20` }}>
                          {hasImages ? (
                            <img src={emotionImages[0]} alt={emotion.word} className="w-full h-full object-cover" />
                          ) : (
                            <img src={getPlaceholderFace(emotion.id)} alt={emotion.word} className="w-full h-full object-contain p-1 opacity-50" />
                          )}
                          {hasImages && <span className="absolute bottom-1 right-1 bg-purple-500 text-white text-xs px-1.5 rounded-full">{emotionImages.length}</span>}
                          {isGenerating && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 size={24} className="text-white animate-spin" /></div>}
                        </div>
                        <p className="font-crayon text-xs text-gray-700 mb-1">{emotion.word}</p>
                        <button onClick={() => generateNewFace(emotion.id)} disabled={isGenerating || creditError}
                          className={`px-3 py-1 rounded-lg text-xs font-crayon flex items-center gap-1 mx-auto ${isGenerating || creditError ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-purple-500 text-white hover:bg-purple-600'}`}>
                          {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                          Generate
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Menu screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => navigate('/games')} className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F5A623] rounded-xl font-display font-bold text-[#F5A623] hover:bg-[#F5A623] hover:text-white transition-all shadow-md">
              <ArrowLeft size={16} />Back
            </button>
            <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
            <h1 className="text-lg font-display text-[#F5A623]">Emotion Match</h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl border-4 border-[#F5A623] p-6 shadow-crayon">
            <h2 className="text-2xl font-display text-center text-[#F5A623] mb-2">Emotion Match</h2>
            <p className="text-center text-gray-600 font-crayon mb-6">Match faces with feeling words</p>

            <div className="mb-6">
              <label className="block font-crayon text-gray-700 mb-2">Game Type:</label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setMode('faceToWord')} className={`p-4 rounded-xl border-3 font-crayon transition-all ${mode === 'faceToWord' ? 'border-[#F5A623] bg-orange-50 text-[#F5A623]' : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'}`}>
                  <span className="block text-xl mb-1">🖼️ → ?</span>
                  <span className="text-sm">See Face, Find Word</span>
                </button>
                <button onClick={() => setMode('wordToFace')} className={`p-4 rounded-xl border-3 font-crayon transition-all ${mode === 'wordToFace' ? 'border-[#F5A623] bg-orange-50 text-[#F5A623]' : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'}`}>
                  <span className="block text-xl mb-1">? → 🖼️</span>
                  <span className="text-sm">See Word, Find Face</span>
                </button>
              </div>
            </div>

            <div className="mb-6 p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-crayon text-sm text-gray-600">Face Library</span>
                <button onClick={() => setShowLibrary(true)} className="text-[#F5A623] font-crayon text-sm underline">Manage</button>
              </div>
              <div className="flex gap-4 text-xs font-crayon text-gray-500">
                <span>🤖 {totalAIFaces} AI faces</span>
                <span>📷 {totalPersonalPhotos} my photos</span>
              </div>
              {usePersonalPhotos && totalPersonalPhotos > 0 && <p className="text-xs font-crayon text-blue-600 mt-1">✓ Using your personal photos</p>}
            </div>

            <button onClick={startGame} className="w-full py-4 bg-gradient-to-r from-[#F5A623] to-[#E86B9A] text-white rounded-2xl font-display text-xl shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
              <Star size={24} className="fill-white" />Start Game
            </button>
          </div>
        </main>
        {renderLibraryModal()}
      </div>
    );
  }

  // Game complete screen
  if (gameComplete) {
    const stars = score >= 10 ? 3 : score >= 7 ? 2 : 1;
    
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => { setGameStarted(false); setGameComplete(false); setCurrentEmotion(null); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#5CB85C] rounded-xl font-display font-bold text-[#5CB85C] hover:bg-[#5CB85C] hover:text-white transition-all shadow-md">
              <ArrowLeft size={16} />Back
            </button>
            <h1 className="text-lg font-display text-[#F5A623]">Emotion Match</h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8 text-center">
          <div className="bg-white rounded-3xl border-4 border-[#5CB85C] p-8 shadow-crayon">
            <Trophy size={64} className="text-[#F8D14A] mx-auto mb-4" />
            <h2 className="text-3xl font-display text-[#5CB85C] mb-2">Great Job!</h2>
            <p className="font-crayon text-xl text-gray-700 mb-4">You got {score} out of {totalQuestions}!</p>
            
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(3)].map((_, i) => <Star key={i} size={32} className={i < stars ? 'text-[#F8D14A] fill-[#F8D14A]' : 'text-gray-300'} />)}
            </div>

            <div className="space-y-3">
              <button onClick={startGame} className="w-full py-3 bg-[#5CB85C] text-white rounded-xl font-display text-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                <RotateCcw size={20} />Play Again
              </button>
              <button onClick={() => { setGameStarted(false); setGameComplete(false); setCurrentEmotion(null); }}
                className="w-full py-3 border-3 border-gray-300 rounded-xl font-crayon text-gray-600 hover:border-gray-400 transition-colors">
                Change Settings
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Loading screen
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
  
  // Game play screen
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => { setGameStarted(false); setCurrentEmotion(null); }}
            className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#F5A623] rounded-xl font-display text-[#F5A623] hover:bg-[#F5A623] hover:text-white transition-all text-sm">
            <ArrowLeft size={16} />Exit
          </button>
          <div className="flex items-center gap-4">
            <span className="font-display text-[#F5A623]">{MODES[mode].label}</span>
            <span className="px-3 py-1 bg-[#F5A623] text-white rounded-full font-display">{score} / {totalQuestions}</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#F5A623] transition-all duration-300" style={{ width: `${(questionsAnswered.length / EMOTIONS.length) * 100}%` }} />
          </div>
          <p className="text-center font-crayon text-sm text-gray-500 mt-1">{questionsAnswered.length} of {EMOTIONS.length} emotions</p>
        </div>

        <div className="bg-white rounded-3xl border-4 border-[#F5A623] p-6 mb-6 text-center">
          <p className="font-crayon text-gray-600 mb-4">{MODES[mode].instruction}</p>
          
          {mode === 'faceToWord' ? (
            <div className="flex flex-col items-center">{renderFace(currentEmotion, 'large')}</div>
          ) : (
            <>
              <p className="text-4xl font-display mb-2" style={{ color: currentEmotion?.color }}>{currentEmotion?.word}</p>
              <p className="text-sm text-gray-500 font-crayon">({currentEmotion?.description})</p>
            </>
          )}
          
          <button onClick={speakCurrent} className="mt-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" title="Hear it">
            <Volume2 size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrect = option.id === currentEmotion?.id;
            const showCorrect = feedback && isCorrect;
            const showWrong = feedback === 'wrong' && isSelected;

            return (
              <button key={option.id} onClick={() => handleAnswer(option)} disabled={!!feedback}
                className={`p-4 rounded-2xl border-4 transition-all duration-300
                  ${showCorrect ? 'border-[#5CB85C] bg-green-100 scale-105' : showWrong ? 'border-[#E63B2E] bg-red-100 animate-shake' : 'border-gray-300 bg-white hover:border-[#F5A623] hover:scale-105'}
                  ${feedback && !showCorrect && !showWrong ? 'opacity-50' : ''}`}>
                {mode === 'faceToWord' ? (
                  <span className="block text-xl font-display" style={{ color: option.color }}>{option.word}</span>
                ) : (
                  <div className="flex flex-col items-center">{renderFace(option, 'small')}</div>
                )}
              </button>
            );
          })}
        </div>

        {feedback && (
          <div className={`mt-6 p-4 rounded-2xl text-center font-crayon text-lg ${feedback === 'correct' ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-red-100 text-red-700 border-2 border-red-300'}`}>
            {feedback === 'correct' ? '🎉 Correct! Great job!' : `Try again! That's ${options.find(o => o.id === selectedAnswer)?.word}`}
          </div>
        )}
      </main>
      
      {renderLibraryModal()}
      
      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default EmotionMatch;
