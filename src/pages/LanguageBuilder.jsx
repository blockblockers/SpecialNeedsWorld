// LanguageBuilder.jsx - Build sentences and vocabulary
// Speech therapy app for language development

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Volume2, Check, RotateCcw, Trophy, Star, 
  Sparkles, Shuffle, Plus, X, HelpCircle
} from 'lucide-react';
import { getPictogramUrl } from '../services/arasaac';

// Sentence building blocks
const WORD_CATEGORIES = {
  subjects: {
    name: 'Who',
    color: '#E63B2E',
    words: [
      { word: 'I', arasaacId: 36358 },
      { word: 'The boy', arasaacId: 2502 },
      { word: 'The girl', arasaacId: 2564 },
      { word: 'The dog', arasaacId: 2545 },
      { word: 'The cat', arasaacId: 2513 },
      { word: 'Mom', arasaacId: 6485 },
      { word: 'Dad', arasaacId: 6484 },
      { word: 'My friend', arasaacId: 6044 },
    ],
  },
  verbs: {
    name: 'Action',
    color: '#4A9FD4',
    words: [
      { word: 'is eating', arasaacId: 6011 },
      { word: 'is playing', arasaacId: 6994 },
      { word: 'is sleeping', arasaacId: 2766 },
      { word: 'is running', arasaacId: 6002 },
      { word: 'is reading', arasaacId: 2786 },
      { word: 'is jumping', arasaacId: 6001 },
      { word: 'wants', arasaacId: 9447 },
      { word: 'likes', arasaacId: 26684 },
    ],
  },
  objects: {
    name: 'What',
    color: '#5CB85C',
    words: [
      { word: 'an apple', arasaacId: 2479 },
      { word: 'a ball', arasaacId: 2483 },
      { word: 'a book', arasaacId: 2506 },
      { word: 'water', arasaacId: 2884 },
      { word: 'a cookie', arasaacId: 2530 },
      { word: 'a toy', arasaacId: 2868 },
      { word: 'food', arasaacId: 6011 },
      { word: 'outside', arasaacId: null },
    ],
  },
  locations: {
    name: 'Where',
    color: '#F5A623',
    words: [
      { word: 'at home', arasaacId: 2563 },
      { word: 'at school', arasaacId: 36761 },
      { word: 'in the park', arasaacId: 2723 },
      { word: 'in bed', arasaacId: 2492 },
      { word: 'outside', arasaacId: 2723 },
      { word: 'in the kitchen', arasaacId: 2580 },
    ],
  },
};

// Pre-built sentence templates for guided mode
const SENTENCE_TEMPLATES = [
  { 
    template: ['subjects', 'verbs', 'objects'],
    example: 'The boy is eating an apple',
  },
  { 
    template: ['subjects', 'verbs', 'locations'],
    example: 'The dog is sleeping at home',
  },
  { 
    template: ['subjects', 'verbs'],
    example: 'The girl is running',
  },
];

// Game modes
const MODES = {
  free: {
    name: 'Free Build',
    description: 'Build any sentence you want',
    icon: Sparkles,
  },
  guided: {
    name: 'Guided Practice',
    description: 'Follow sentence patterns',
    icon: HelpCircle,
  },
};

const LanguageBuilder = () => {
  const navigate = useNavigate();
  
  // Game state
  const [mode, setMode] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [sentence, setSentence] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [templateIndex, setTemplateIndex] = useState(0);
  const [completedSentences, setCompletedSentences] = useState([]);
  const [showWordPicker, setShowWordPicker] = useState(null);

  // Text to speech
  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Start game
  const startGame = (selectedMode) => {
    setMode(selectedMode);
    setSentence([]);
    setCompletedSentences([]);
    
    if (selectedMode === 'guided') {
      const template = SENTENCE_TEMPLATES[0];
      setCurrentTemplate(template);
      setTemplateIndex(0);
    }
    
    setGameStarted(true);
  };

  // Add word to sentence
  const addWord = (category, wordData) => {
    const newWord = {
      ...wordData,
      category,
      color: WORD_CATEGORIES[category].color,
    };
    
    setSentence([...sentence, newWord]);
    setShowWordPicker(null);

    // In guided mode, move to next slot
    if (mode === 'guided' && currentTemplate) {
      const nextIndex = templateIndex + 1;
      if (nextIndex < currentTemplate.template.length) {
        setTemplateIndex(nextIndex);
      }
    }
  };

  // Remove word from sentence
  const removeWord = (index) => {
    const newSentence = sentence.filter((_, i) => i !== index);
    setSentence(newSentence);
    
    if (mode === 'guided') {
      setTemplateIndex(Math.max(0, newSentence.length));
    }
  };

  // Complete sentence
  const completeSentence = () => {
    if (sentence.length === 0) return;
    
    const sentenceText = sentence.map(w => w.word).join(' ');
    speak(sentenceText);
    
    setCompletedSentences([...completedSentences, {
      words: [...sentence],
      text: sentenceText,
    }]);
    
    // Reset for next sentence
    setSentence([]);
    setTemplateIndex(0);
    
    // Move to next template in guided mode
    if (mode === 'guided') {
      const nextTemplateIdx = (SENTENCE_TEMPLATES.indexOf(currentTemplate) + 1) % SENTENCE_TEMPLATES.length;
      setCurrentTemplate(SENTENCE_TEMPLATES[nextTemplateIdx]);
    }
  };

  // Get sentence text
  const getSentenceText = () => {
    return sentence.map(w => w.word).join(' ');
  };

  // Mode selection screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/speech-therapy')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#5CB85C] 
                         rounded-xl font-display font-bold text-[#5CB85C] hover:bg-[#5CB85C] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-display text-[#5CB85C] flex items-center gap-2">
                📝 Language Builder
              </h1>
              <p className="text-sm text-gray-500 font-crayon">Build sentences and vocabulary</p>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Introduction */}
          <div className="bg-white rounded-2xl border-4 border-[#5CB85C] p-5 mb-6 shadow-lg">
            <h2 className="font-display text-xl text-[#5CB85C] mb-2">Build Sentences!</h2>
            <p className="font-crayon text-gray-600">
              Practice building sentences by combining words. Choose who does what, 
              where they do it, and more!
            </p>
          </div>

          {/* Mode Selection */}
          <h3 className="font-display text-gray-700 mb-3">Choose a Mode</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(MODES).map(([key, modeData]) => {
              const Icon = modeData.icon;
              return (
                <button
                  key={key}
                  onClick={() => startGame(key)}
                  className="bg-white rounded-2xl border-4 border-[#5CB85C] p-6 shadow-lg 
                             hover:scale-105 transition-all text-left"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#5CB85C]/20 flex items-center justify-center mb-3">
                    <Icon size={28} className="text-[#5CB85C]" />
                  </div>
                  <h3 className="font-display text-xl text-[#5CB85C] mb-1">{modeData.name}</h3>
                  <p className="font-crayon text-gray-500 text-sm">{modeData.description}</p>
                </button>
              );
            })}
          </div>

          {/* Word Categories Preview */}
          <div className="mt-8">
            <h3 className="font-display text-gray-700 mb-3">Word Types</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(WORD_CATEGORIES).map(([key, cat]) => (
                <div
                  key={key}
                  className="bg-white rounded-xl border-3 p-3 text-center"
                  style={{ borderColor: cat.color }}
                >
                  <span className="font-display" style={{ color: cat.color }}>
                    {cat.name}
                  </span>
                  <p className="text-xs text-gray-500 font-crayon mt-1">
                    {cat.words.length} words
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Main game screen
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#5CB85C]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setGameStarted(false)}
            className="p-2 bg-white border-3 border-[#5CB85C] rounded-xl"
          >
            <X size={20} className="text-[#5CB85C]" />
          </button>
          
          <div className="flex-1">
            <span className="font-display text-[#5CB85C]">
              {mode === 'guided' ? 'Guided Practice' : 'Free Build'}
            </span>
          </div>
          
          <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-green-600 fill-green-600" />
            <span className="font-display text-green-700">{completedSentences.length}</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Guided Mode Template */}
        {mode === 'guided' && currentTemplate && (
          <div className="bg-blue-50 rounded-xl p-3 mb-4 border-2 border-blue-200">
            <p className="text-sm text-blue-700 font-crayon">
              <strong>Pattern:</strong> {currentTemplate.template.map(t => WORD_CATEGORIES[t].name).join(' + ')}
            </p>
            <p className="text-xs text-blue-500 font-crayon mt-1">
              Example: "{currentTemplate.example}"
            </p>
          </div>
        )}

        {/* Sentence Building Area */}
        <div className="bg-white rounded-2xl border-4 border-[#5CB85C] p-4 mb-6 shadow-lg min-h-[120px]">
          <div className="flex flex-wrap gap-2 items-center">
            {sentence.length === 0 ? (
              <p className="text-gray-400 font-crayon">Tap a category below to add words...</p>
            ) : (
              sentence.map((word, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-white font-crayon
                             cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: word.color }}
                  onClick={() => removeWord(index)}
                >
                  {word.arasaacId && (
                    <img 
                      src={getPictogramUrl(word.arasaacId)} 
                      alt="" 
                      className="w-6 h-6 bg-white rounded"
                    />
                  )}
                  <span>{word.word}</span>
                  <X size={14} />
                </div>
              ))
            )}
          </div>
          
          {sentence.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => speak(getSentenceText())}
                className="flex items-center gap-2 px-3 py-2 bg-[#5CB85C]/20 rounded-xl 
                           text-[#5CB85C] font-crayon hover:bg-[#5CB85C]/30 transition-colors"
              >
                <Volume2 size={18} />
                Listen
              </button>
              <button
                onClick={completeSentence}
                className="flex items-center gap-2 px-4 py-2 bg-[#5CB85C] text-white 
                           rounded-xl font-display hover:bg-green-600 transition-colors"
              >
                <Check size={18} />
                Done
              </button>
            </div>
          )}
        </div>

        {/* Word Category Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {Object.entries(WORD_CATEGORIES).map(([key, category]) => {
            const isActiveSlot = mode === 'guided' && currentTemplate?.template[templateIndex] === key;
            return (
              <button
                key={key}
                onClick={() => setShowWordPicker(key)}
                className={`p-4 rounded-xl border-4 font-display text-lg transition-all
                           ${isActiveSlot ? 'scale-105 ring-4 ring-yellow-400' : 'hover:scale-102'}`}
                style={{ 
                  borderColor: category.color, 
                  color: category.color,
                  backgroundColor: isActiveSlot ? `${category.color}20` : 'white',
                }}
              >
                <Plus size={20} className="mx-auto mb-1" style={{ color: category.color }} />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Completed Sentences */}
        {completedSentences.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-display text-gray-700 mb-3">Your Sentences</h3>
            <div className="space-y-2">
              {completedSentences.map((s, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-gray-200"
                >
                  <Star className="w-5 h-5 text-[#F8D14A] fill-[#F8D14A] flex-shrink-0" />
                  <p className="font-crayon text-gray-700 flex-1">{s.text}</p>
                  <button
                    onClick={() => speak(s.text)}
                    className="p-2 text-[#5CB85C] hover:bg-green-50 rounded-lg"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Word Picker Modal */}
      {showWordPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl border-4 p-6 w-full max-w-md 
                          max-h-[70vh] overflow-y-auto shadow-2xl"
               style={{ borderColor: WORD_CATEGORIES[showWordPicker].color }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display" 
                  style={{ color: WORD_CATEGORIES[showWordPicker].color }}>
                Choose: {WORD_CATEGORIES[showWordPicker].name}
              </h2>
              <button
                onClick={() => setShowWordPicker(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {WORD_CATEGORIES[showWordPicker].words.map((wordData, idx) => (
                <button
                  key={idx}
                  onClick={() => addWord(showWordPicker, wordData)}
                  className="bg-white rounded-xl border-3 p-3 hover:scale-105 transition-all
                             flex flex-col items-center gap-2"
                  style={{ borderColor: WORD_CATEGORIES[showWordPicker].color }}
                >
                  {wordData.arasaacId && (
                    <img 
                      src={getPictogramUrl(wordData.arasaacId)} 
                      alt={wordData.word}
                      className="w-12 h-12 object-contain"
                    />
                  )}
                  <span className="font-crayon text-gray-700 text-center text-sm">
                    {wordData.word}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageBuilder;
