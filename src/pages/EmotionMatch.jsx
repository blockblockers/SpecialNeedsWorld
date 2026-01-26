// EmotionMatch.jsx - Match faces to emotions game
// 
// FEATURES:
// - AI-generated realistic human faces from shared library (Supabase)
// - Click "Start Game" to play with existing faces
// - Click "Generate More Faces" to add 12 new AI faces to the library
// - Personal photos stored LOCALLY on device only (HIPAA compliant)
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
  Lock,
  RefreshCw,
  Wand2
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { recordGameCompletion } from '../services/gameStatsService';
import { useToast } from '../components/ThemedToast';

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

// Stylized face illustrations - human-like faces (NOT emojis!) as fallback
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
  const [sharedFaces, setSharedFaces] = useState([]);
  const [usedFaceIds, setUsedFaceIds] = useState(new Set());
  const [faceCounts, setFaceCounts] = useState({});
  const [isLoadingFaces, setIsLoadingFaces] = useState(true);
  const [isGeneratingFaces, setIsGeneratingFaces] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  
  // Settings
  const [usePersonalPhotos, setUsePersonalPhotos] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  // ============================================
  // LOAD SHARED FACES FROM SUPABASE
  // ============================================
  
  useEffect(() => {
    loadSharedFaces();
    loadFaceCounts();
  }, []);

  const loadSharedFaces = async () => {
    setIsLoadingFaces(true);
    
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using placeholders only');
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
      } else {
        setSharedFaces(data || []);
        console.log(`Loaded ${data?.length || 0} shared faces`);
      }
    } catch (err) {
      console.error('Error loading faces:', err);
    } finally {
      setIsLoadingFaces(false);
    }
  };

  const loadFaceCounts = async () => {
    if (!isSupabaseConfigured()) return;

    try {
      const { data, error } = await supabase.rpc('get_emotion_face_counts');
      if (!error && data) {
        const counts = {};
        data.forEach(row => {
          counts[row.emotion] = row.count;
        });
        setFaceCounts(counts);
      }
    } catch (err) {
      console.error('Error loading face counts:', err);
    }
  };

  // ============================================
  // GENERATE AI FACES
  // ============================================

  const generateMoreFaces = async () => {
    if (!isSupabaseConfigured()) {
      toast.error('Not Available', 'Cloud features require Supabase configuration');
      return;
    }

    setIsGeneratingFaces(true);
    setGenerationProgress('Starting face generation...');

    try {
      const { data, error } = await supabase.functions.invoke('generate-emotion-faces', {
        body: {
          count: 12,
          emotions: EMOTIONS.map(e => e.id),
        },
      });

      if (error) throw error;

      if (data.setup_required) {
        toast.error('Setup Required', data.message || 'Please configure REPLICATE_API_KEY');
        return;
      }

      setGenerationProgress(`Generated ${data.generated} faces!`);
      
      // Reload faces
      await loadSharedFaces();
      await loadFaceCounts();

      toast.success('Faces Generated!', `Added ${data.generated} new faces to the library`);

    } catch (err) {
      console.error('Error generating faces:', err);
      toast.error('Generation Failed', err.message || 'Failed to generate faces');
    } finally {
      setIsGeneratingFaces(false);
      setGenerationProgress('');
    }
  };

  // ============================================
  // GAME LOGIC
  // ============================================

  // Get a face for an emotion (AI face or placeholder)
  const getFaceForEmotion = (emotionId) => {
    // Try to get an unused AI face
    const availableFaces = sharedFaces.filter(
      f => f.emotion === emotionId && !usedFaceIds.has(f.id)
    );

    if (availableFaces.length > 0) {
      const face = availableFaces[Math.floor(Math.random() * availableFaces.length)];
      setUsedFaceIds(prev => new Set([...prev, face.id]));
      return { url: face.image_url, id: face.id, isAI: true };
    }

    // Fallback to placeholder
    return { url: getPlaceholderFace(emotionId), id: null, isAI: false };
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
    if (feedback) return; // Already answered
    
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
    
    // Record game completion for stats
    try {
      await recordGameCompletion('emotion-match', score, EMOTIONS.length);
    } catch (err) {
      console.error('Error recording game:', err);
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

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  // Library modal
  const renderLibraryModal = () => {
    if (!showLibrary) return null;

    const totalFaces = sharedFaces.length;

    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-[#FFFEF5] w-full max-w-md rounded-3xl overflow-hidden border-4 border-[#F5A623]">
          <div className="bg-[#F5A623] text-white p-4 flex items-center justify-between">
            <h3 className="font-display text-xl flex items-center gap-2">
              <ImageIcon size={24} />
              Face Library
            </h3>
            <button onClick={() => setShowLibrary(false)} className="p-1 hover:bg-white/20 rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            {/* Stats */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-crayon text-gray-600">Total AI Faces:</span>
                <span className="font-display text-xl text-[#F5A623]">{totalFaces}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-crayon text-gray-500">
                {EMOTIONS.slice(0, 6).map(emotion => (
                  <div key={emotion.id} className="flex justify-between">
                    <span>{emotion.word}:</span>
                    <span className="font-bold">{faceCounts[emotion.id] || 0}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={generateMoreFaces}
              disabled={isGeneratingFaces}
              className="w-full py-4 bg-gradient-to-r from-[#8E6BBF] to-[#E86B9A] text-white rounded-xl
                       font-display text-lg hover:scale-[1.02] transition-transform disabled:opacity-70
                       flex items-center justify-center gap-2"
            >
              {isGeneratingFaces ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  {generationProgress || 'Generating...'}
                </>
              ) : (
                <>
                  <Wand2 size={24} />
                  Generate 12 New Faces
                </>
              )}
            </button>

            {totalFaces === 0 && (
              <p className="text-center font-crayon text-gray-500 mt-4 text-sm">
                No AI faces yet. Click above to generate some!
                <br />
                (Uses illustrated placeholders until then)
              </p>
            )}

            {/* Preview grid */}
            {totalFaces > 0 && (
              <div className="mt-4">
                <p className="font-crayon text-sm text-gray-600 mb-2">Recent faces:</p>
                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                  {sharedFaces.slice(0, 12).map(face => (
                    <img
                      key={face.id}
                      src={face.image_url}
                      alt={face.emotion}
                      className="w-full aspect-square rounded-lg object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // MAIN RENDERS
  // ============================================

  // Menu screen
  if (!gameStarted) {
    const totalAIFaces = sharedFaces.length;

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

            {/* Face library info */}
            <div className="mb-6 p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-crayon text-sm text-gray-600">Face Library</span>
                <button 
                  onClick={() => setShowLibrary(true)} 
                  className="text-[#F5A623] font-crayon text-sm underline"
                >
                  Manage
                </button>
              </div>
              <div className="flex gap-4 text-xs font-crayon text-gray-500">
                {isLoadingFaces ? (
                  <span className="flex items-center gap-1">
                    <Loader2 size={12} className="animate-spin" /> Loading...
                  </span>
                ) : (
                  <>
                    <span>🤖 {totalAIFaces} AI faces</span>
                    <span>📐 {Object.keys(PLACEHOLDER_FACES).length} placeholders</span>
                  </>
                )}
              </div>
              {totalAIFaces === 0 && !isLoadingFaces && (
                <p className="text-xs font-crayon text-blue-600 mt-1">
                  Click "Manage" to generate AI faces!
                </p>
              )}
            </div>

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

            <div className="space-y-3">
              <button 
                onClick={startGame} 
                className="w-full py-3 bg-[#5CB85C] text-white rounded-xl font-display text-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
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

  // Game play screen
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
