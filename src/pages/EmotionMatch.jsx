// EmotionMatch.jsx - Match faces to emotions game
// 
// FLOW:
// 1. On load, check for AI faces in database
// 2. If AI faces exist → use them (default)
// 3. If no AI faces → use drawn placeholders for first game
// 4. After first game completes with placeholders → auto-generate 12 AI faces
// 5. When AI faces run out during play → auto-generate more
// 6. User can toggle between AI/Drawn faces (default: AI)
// 7. "Upload Photos" is separate for personal photos only

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  RotateCcw, 
  Trophy, 
  Star, 
  Volume2, 
  Loader2,
  X,
  Upload,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Camera
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { recordGameCompletion } from '../services/gameStatsService';
import { useToast } from '../components/ThemedToast';
import { useAuth } from '../App';

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

// Stylized face illustrations - fallback when no AI faces available
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
  const toast = useToast();
  const { user } = useAuth();
  
  // Game state
  const [mode, setMode] = useState('faceToWord');
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [currentFace, setCurrentFace] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState([]);
  
  // Face library state
  const [aiFaces, setAiFaces] = useState([]);
  const [usedFaceIds, setUsedFaceIds] = useState(new Set());
  const [isLoadingFaces, setIsLoadingFaces] = useState(true);
  const [isGeneratingFaces, setIsGeneratingFaces] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  
  // Settings - default to AI faces if available
  const [useAiFaces, setUseAiFaces] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [personalPhotos, setPersonalPhotos] = useState([]);
  
  // Track if this is first game (no AI faces in DB)
  const [isFirstGame, setIsFirstGame] = useState(false);

  // ============================================
  // LOAD AI FACES FROM SUPABASE
  // ============================================
  
  useEffect(() => {
    loadAiFaces();
    loadPersonalPhotos();
  }, []);

  const loadAiFaces = async () => {
    setIsLoadingFaces(true);
    
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using placeholders only');
      setIsFirstGame(true);
      setUseAiFaces(false);
      setIsLoadingFaces(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('emotion_faces')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading faces:', error);
        setIsFirstGame(true);
        setUseAiFaces(false);
      } else if (!data || data.length === 0) {
        console.log('No AI faces in database yet - first game mode');
        setIsFirstGame(true);
        setUseAiFaces(false);
      } else {
        setAiFaces(data);
        setIsFirstGame(false);
        setUseAiFaces(true); // Default to AI faces when available
        console.log(`Loaded ${data.length} AI faces`);
      }
    } catch (err) {
      console.error('Error loading faces:', err);
      setIsFirstGame(true);
      setUseAiFaces(false);
    } finally {
      setIsLoadingFaces(false);
    }
  };

  const loadPersonalPhotos = () => {
    try {
      const stored = localStorage.getItem('emotion_personal_photos');
      if (stored) {
        setPersonalPhotos(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error loading personal photos:', err);
    }
  };

  // ============================================
  // GENERATE AI FACES (Background)
  // ============================================

  const generateAiFaces = async (count = 12) => {
    if (!isSupabaseConfigured() || isGeneratingFaces) return false;

    setIsGeneratingFaces(true);
    setGenerationProgress('Generating AI faces...');

    try {
      console.log(`Requesting ${count} AI faces from Edge Function...`);
      
      const { data, error } = await supabase.functions.invoke('generate-emotion-faces', {
        body: {
          count,
          emotions: EMOTIONS.map(e => e.id),
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (data?.setup_required) {
        console.warn('API key not configured:', data.message);
        toast.warning('Setup Required', 'AI face generation is not configured yet.');
        return false;
      }

      if (data?.success && data?.generated > 0) {
        console.log(`Successfully generated ${data.generated} faces`);
        setGenerationProgress(`Generated ${data.generated} faces!`);
        
        // Reload faces from database
        await loadAiFaces();
        
        toast.success('Faces Ready!', `${data.generated} new AI faces added to the library`);
        return true;
      } else {
        console.warn('Generation returned no faces:', data);
        return false;
      }

    } catch (err) {
      console.error('Error generating faces:', err);
      toast.error('Generation Failed', err.message || 'Failed to generate AI faces');
      return false;
    } finally {
      setIsGeneratingFaces(false);
      setGenerationProgress('');
    }
  };

  // ============================================
  // GAME LOGIC
  // ============================================

  // Get a face for an emotion
  const getFaceForEmotion = (emotionId) => {
    // If using AI faces and we have them
    if (useAiFaces && aiFaces.length > 0) {
      const availableFaces = aiFaces.filter(
        f => f.emotion === emotionId && !usedFaceIds.has(f.id)
      );

      if (availableFaces.length > 0) {
        const face = availableFaces[Math.floor(Math.random() * availableFaces.length)];
        setUsedFaceIds(prev => new Set([...prev, face.id]));
        return { url: face.image_url, id: face.id, isAI: true };
      }
      
      // If we've used all AI faces for this emotion, check if we should generate more
      const allFacesForEmotion = aiFaces.filter(f => f.emotion === emotionId);
      if (allFacesForEmotion.length > 0 && availableFaces.length === 0) {
        // We have AI faces but used them all - will trigger generation after game
        console.log(`Used all AI faces for ${emotionId}`);
      }
    }

    // Fallback to placeholder
    return { url: getPlaceholderFace(emotionId), id: null, isAI: false };
  };

  // Check if we need more AI faces
  const checkAndGenerateMoreFaces = async () => {
    if (!isSupabaseConfigured() || isGeneratingFaces) return;
    
    // Count unused faces per emotion
    const unusedCounts = {};
    EMOTIONS.forEach(e => {
      unusedCounts[e.id] = aiFaces.filter(
        f => f.emotion === e.id && !usedFaceIds.has(f.id)
      ).length;
    });
    
    // If any emotion has less than 2 unused faces, generate more
    const needsMore = Object.values(unusedCounts).some(count => count < 2);
    
    if (needsMore && aiFaces.length > 0) {
      console.log('Running low on AI faces, generating more in background...');
      generateAiFaces(12);
    }
  };

  // Start the game
  const startGame = () => {
    setScore(0);
    setTotalQuestions(EMOTIONS.length);
    setQuestionsAnswered([]);
    setUsedFaceIds(new Set());
    setGameComplete(false);
    setGameStarted(true);
    nextQuestion([]);
  };

  // Get next question
  const nextQuestion = (answered) => {
    const remaining = EMOTIONS.filter(e => !answered.includes(e.id));
    
    if (remaining.length === 0) {
      endGame();
      return;
    }

    const emotion = remaining[Math.floor(Math.random() * remaining.length)];
    const face = getFaceForEmotion(emotion.id);
    
    // Get options (correct + 3 wrong)
    const wrongOptions = EMOTIONS
      .filter(e => e.id !== emotion.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const allOptions = [...wrongOptions, emotion].sort(() => Math.random() - 0.5);
    
    setCurrentEmotion(emotion);
    setCurrentFace(face);
    setOptions(allOptions);
    setFeedback(null);
    setSelectedAnswer(null);
  };

  // Handle answer selection
  const handleAnswer = (selected) => {
    if (feedback) return;
    
    setSelectedAnswer(selected.id);
    const isCorrect = selected.id === currentEmotion.id;
    
    if (isCorrect) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      speak('Great job!');
    } else {
      setFeedback('wrong');
      speak(`That's ${selected.word}. The answer is ${currentEmotion.word}.`);
    }

    setTimeout(() => {
      const newAnswered = [...questionsAnswered, currentEmotion.id];
      setQuestionsAnswered(newAnswered);
      nextQuestion(newAnswered);
    }, 1500);
  };

  // End game
  const endGame = async () => {
    setGameComplete(true);
    
    // Record game completion
    try {
      await recordGameCompletion('emotion-match', score, EMOTIONS.length);
    } catch (err) {
      console.error('Error recording game:', err);
    }

    // If this was the first game (no AI faces), generate them now
    if (isFirstGame && isSupabaseConfigured()) {
      console.log('First game complete - generating initial AI faces...');
      toast.info('Generating Faces', 'Creating AI faces for future games...');
      const success = await generateAiFaces(12);
      if (success) {
        setIsFirstGame(false);
      }
    } else {
      // Check if we need more faces
      checkAndGenerateMoreFaces();
    }
  };

  // Text to speech
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  // Toggle face type
  const toggleFaceType = () => {
    if (aiFaces.length === 0) {
      toast.info('No AI Faces Yet', 'Complete a game to generate AI faces!');
      return;
    }
    setUseAiFaces(!useAiFaces);
  };

  // ============================================
  // PERSONAL PHOTO UPLOAD
  // ============================================

  const handlePhotoUpload = async (emotion, file) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto = {
          id: `personal_${Date.now()}`,
          emotion,
          dataUrl: e.target.result,
          createdAt: new Date().toISOString(),
        };
        
        const updated = [...personalPhotos, newPhoto];
        setPersonalPhotos(updated);
        localStorage.setItem('emotion_personal_photos', JSON.stringify(updated));
        toast.success('Photo Added', `Personal photo added for ${emotion}`);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error uploading photo:', err);
      toast.error('Upload Failed', 'Could not save photo');
    }
  };

  const removePersonalPhoto = (photoId) => {
    const updated = personalPhotos.filter(p => p.id !== photoId);
    setPersonalPhotos(updated);
    localStorage.setItem('emotion_personal_photos', JSON.stringify(updated));
    toast.success('Removed', 'Personal photo removed');
  };

  // ============================================
  // RENDER - Upload Modal
  // ============================================

  const renderUploadModal = () => {
    if (!showUploadModal) return null;

    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-[#FFFEF5] w-full max-w-md max-h-[80vh] rounded-3xl overflow-hidden border-4 border-[#4A9FD4]">
          <div className="bg-[#4A9FD4] text-white p-4 flex items-center justify-between">
            <h3 className="font-display text-xl flex items-center gap-2">
              <Camera size={24} />
              Upload Personal Photos
            </h3>
            <button onClick={() => setShowUploadModal(false)} className="p-1 hover:bg-white/20 rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="p-4 overflow-y-auto max-h-[60vh]">
            <p className="font-crayon text-sm text-gray-600 mb-4">
              Add personal photos for each emotion. These stay on your device only.
            </p>

            <div className="space-y-3">
              {EMOTIONS.slice(0, 8).map(emotion => {
                const photos = personalPhotos.filter(p => p.emotion === emotion.id);
                
                return (
                  <div key={emotion.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                    <span 
                      className="font-crayon text-sm w-20"
                      style={{ color: emotion.color }}
                    >
                      {emotion.word}
                    </span>
                    
                    {photos.length > 0 ? (
                      <div className="flex gap-2 flex-1">
                        {photos.map(photo => (
                          <div key={photo.id} className="relative">
                            <img 
                              src={photo.dataUrl} 
                              alt={emotion.word}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <button
                              onClick={() => removePersonalPhoto(photo.id)}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 flex-1">No photos</span>
                    )}
                    
                    <label className="cursor-pointer p-2 bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-[#4A9FD4]">
                      <Upload size={16} className="text-gray-400" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handlePhotoUpload(emotion.id, e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-gray-400 mt-4 text-center">
              🔒 Photos are stored locally on your device only
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER - Menu Screen
  // ============================================

  if (!gameStarted) {
    const hasAiFaces = aiFaces.length > 0;

    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button 
              onClick={() => navigate('/games')} 
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F5A623] rounded-xl font-display font-bold text-[#F5A623] hover:bg-[#F5A623] hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <h1 className="text-lg font-display text-[#F5A623]">Emotion Match</h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl border-4 border-[#F5A623] p-6 shadow-crayon">
            <h2 className="text-2xl font-display text-center text-[#F5A623] mb-2">Emotion Match</h2>
            <p className="text-center text-gray-600 font-crayon mb-6">Match faces with feeling words</p>

            {/* Mode selection */}
            <div className="mb-6">
              <label className="block font-crayon text-gray-700 mb-2">Game Type:</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setMode('faceToWord')} 
                  className={`p-4 rounded-xl border-3 font-crayon transition-all ${
                    mode === 'faceToWord' 
                      ? 'border-[#F5A623] bg-orange-50 text-[#F5A623]' 
                      : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <span className="block text-xl mb-1">🖼️ → ?</span>
                  <span className="text-sm">See Face, Find Word</span>
                </button>
                <button 
                  onClick={() => setMode('wordToFace')} 
                  className={`p-4 rounded-xl border-3 font-crayon transition-all ${
                    mode === 'wordToFace' 
                      ? 'border-[#F5A623] bg-orange-50 text-[#F5A623]' 
                      : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <span className="block text-xl mb-1">? → 🖼️</span>
                  <span className="text-sm">See Word, Find Face</span>
                </button>
              </div>
            </div>

            {/* Face Type Toggle */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-crayon text-gray-700">Face Style:</span>
                <button
                  onClick={toggleFaceType}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-crayon text-sm transition-all ${
                    useAiFaces 
                      ? 'bg-[#8E6BBF] text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {useAiFaces ? (
                    <>
                      <Sparkles size={14} />
                      AI Real Faces
                    </>
                  ) : (
                    <>
                      <ToggleLeft size={14} />
                      Drawn Faces
                    </>
                  )}
                </button>
              </div>
              
              {isLoadingFaces ? (
                <p className="text-xs font-crayon text-gray-500 flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" /> Loading faces...
                </p>
              ) : hasAiFaces ? (
                <p className="text-xs font-crayon text-gray-500">
                  🤖 {aiFaces.length} AI faces available
                </p>
              ) : (
                <p className="text-xs font-crayon text-blue-600">
                  ✨ AI faces will be generated after your first game!
                </p>
              )}
            </div>

            {/* Upload Photos Link */}
            <div className="mb-6 text-center">
              <button
                onClick={() => setShowUploadModal(true)}
                className="text-[#4A9FD4] font-crayon text-sm underline hover:no-underline"
              >
                📷 Upload Personal Photos
              </button>
            </div>

            {/* Generation Progress */}
            {isGeneratingFaces && (
              <div className="mb-6 p-3 bg-purple-50 rounded-xl border-2 border-purple-200">
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-purple-600" />
                  <span className="font-crayon text-sm text-purple-700">{generationProgress}</span>
                </div>
              </div>
            )}

            {/* Start button */}
            <button 
              onClick={startGame} 
              disabled={isLoadingFaces}
              className="w-full py-4 bg-gradient-to-r from-[#F5A623] to-[#E86B9A] text-white rounded-2xl 
                       font-display text-xl shadow-lg hover:scale-[1.02] transition-transform 
                       flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoadingFaces ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Star size={24} className="fill-white" />
                  Start Game
                </>
              )}
            </button>
          </div>
        </main>

        {renderUploadModal()}
      </div>
    );
  }

  // ============================================
  // RENDER - Game Complete Screen
  // ============================================

  if (gameComplete) {
    const stars = score >= 10 ? 3 : score >= 7 ? 2 : 1;
    
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button 
              onClick={() => { setGameStarted(false); setGameComplete(false); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#5CB85C] rounded-xl font-display font-bold text-[#5CB85C] hover:bg-[#5CB85C] hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Menu
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
              {[...Array(3)].map((_, i) => (
                <Star key={i} size={32} className={i < stars ? 'text-[#F8D14A] fill-[#F8D14A]' : 'text-gray-300'} />
              ))}
            </div>

            {/* Show generation progress if happening */}
            {isGeneratingFaces && (
              <div className="mb-4 p-3 bg-purple-50 rounded-xl">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin text-purple-600" />
                  <span className="font-crayon text-sm text-purple-700">{generationProgress}</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button 
                onClick={startGame} 
                disabled={isGeneratingFaces}
                className="w-full py-3 bg-[#5CB85C] text-white rounded-xl font-display text-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <RotateCcw size={20} />
                Play Again
              </button>
              <button 
                onClick={() => { setGameStarted(false); setGameComplete(false); }}
                className="w-full py-3 border-3 border-gray-300 rounded-xl font-crayon text-gray-600 hover:border-gray-400 transition-colors"
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
  // RENDER - Game Play Screen
  // ============================================

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => setGameStarted(false)}
            className="flex items-center gap-2 px-3 py-2 bg-white border-3 border-[#F5A623] rounded-xl font-crayon text-[#F5A623]"
          >
            <X size={16} />
            Exit
          </button>
          <div className="flex items-center gap-4 font-crayon">
            <span className="text-gray-600">
              {questionsAnswered.length + 1}/{totalQuestions}
            </span>
            <span className="text-[#5CB85C] font-bold">
              Score: {score}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Question */}
        <div className="bg-white rounded-3xl border-4 border-[#F5A623] p-6 shadow-crayon mb-6">
          <p className="font-crayon text-center text-gray-600 mb-4">
            {MODES[mode].instruction}
          </p>

          {mode === 'faceToWord' ? (
            // Show face, pick word
            <div className="flex justify-center mb-6">
              <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-gray-200 bg-gray-50">
                {currentFace && (
                  <img
                    src={currentFace.url}
                    alt="Face showing emotion"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          ) : (
            // Show word, pick face
            <div className="text-center mb-6">
              <span 
                className="text-4xl font-display px-6 py-3 rounded-xl inline-block"
                style={{ backgroundColor: `${currentEmotion?.color}20`, color: currentEmotion?.color }}
              >
                {currentEmotion?.word}
              </span>
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {options.map(option => {
              const isSelected = selectedAnswer === option.id;
              const isCorrect = option.id === currentEmotion?.id;
              const showResult = feedback && (isSelected || isCorrect);
              
              return mode === 'faceToWord' ? (
                // Word buttons
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option)}
                  disabled={!!feedback}
                  className={`p-4 rounded-xl border-3 font-display text-lg transition-all ${
                    showResult
                      ? isCorrect
                        ? 'border-green-500 bg-green-100 text-green-700'
                        : isSelected
                          ? 'border-red-500 bg-red-100 text-red-700'
                          : 'border-gray-200 bg-white'
                      : 'border-gray-200 bg-white hover:border-[#F5A623] hover:bg-orange-50'
                  }`}
                >
                  {option.word}
                </button>
              ) : (
                // Face buttons
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option)}
                  disabled={!!feedback}
                  className={`aspect-square rounded-xl border-3 overflow-hidden transition-all ${
                    showResult
                      ? isCorrect
                        ? 'border-green-500 ring-4 ring-green-200'
                        : isSelected
                          ? 'border-red-500 ring-4 ring-red-200'
                          : 'border-gray-200'
                      : 'border-gray-200 hover:border-[#F5A623]'
                  }`}
                >
                  <img
                    src={getFaceForEmotion(option.id).url}
                    alt={option.word}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`text-center p-4 rounded-xl font-crayon text-lg ${
            feedback === 'correct'
              ? 'bg-green-100 text-green-700 border-3 border-green-400'
              : 'bg-red-100 text-red-700 border-3 border-red-400'
          }`}>
            {feedback === 'correct' ? (
              <>🎉 Yes! That's {currentEmotion?.word}!</>
            ) : (
              <>The answer is {currentEmotion?.word}</>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default EmotionMatch;
