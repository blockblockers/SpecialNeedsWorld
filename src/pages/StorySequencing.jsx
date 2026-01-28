// StorySequencing.jsx - Order events and retell stories
// Speech therapy app for narrative skills and temporal sequencing

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Volume2, Check, RotateCcw, Trophy, Star, 
  ChevronUp, ChevronDown, Play, Shuffle, BookOpen
} from 'lucide-react';
import { getPictogramUrl } from '../services/arasaac';

// Story sequences
const STORIES = {
  morning: {
    name: 'Morning Routine',
    icon: '🌅',
    color: '#F5A623',
    steps: [
      { id: 1, text: 'Wake up in bed', arasaacId: 6063, order: 1 },
      { id: 2, text: 'Brush teeth', arasaacId: 6056, order: 2 },
      { id: 3, text: 'Get dressed', arasaacId: 6059, order: 3 },
      { id: 4, text: 'Eat breakfast', arasaacId: 6011, order: 4 },
      { id: 5, text: 'Go to school', arasaacId: 36761, order: 5 },
    ],
    retellPrompt: 'Tell me about your morning routine!',
  },
  baking: {
    name: 'Baking Cookies',
    icon: '🍪',
    color: '#8E6BBF',
    steps: [
      { id: 1, text: 'Gather ingredients', arasaacId: 6014, order: 1 },
      { id: 2, text: 'Mix the dough', arasaacId: 28451, order: 2 },
      { id: 3, text: 'Make cookie shapes', arasaacId: 2530, order: 3 },
      { id: 4, text: 'Put in the oven', arasaacId: 2717, order: 4 },
      { id: 5, text: 'Let them cool', arasaacId: null, order: 5 },
      { id: 6, text: 'Eat the cookies!', arasaacId: 6011, order: 6 },
    ],
    retellPrompt: 'How do you bake cookies?',
  },
  plant: {
    name: 'Growing a Plant',
    icon: '🌱',
    color: '#5CB85C',
    steps: [
      { id: 1, text: 'Get a pot with soil', arasaacId: 2559, order: 1 },
      { id: 2, text: 'Plant the seed', arasaacId: 2731, order: 2 },
      { id: 3, text: 'Water the seed', arasaacId: 2884, order: 3 },
      { id: 4, text: 'Put it in sunlight', arasaacId: 2802, order: 4 },
      { id: 5, text: 'Watch it grow!', arasaacId: 2557, order: 5 },
    ],
    retellPrompt: 'How do you grow a plant?',
  },
  birthday: {
    name: 'Birthday Party',
    icon: '🎂',
    color: '#E86B9A',
    steps: [
      { id: 1, text: 'Send invitations', arasaacId: 2587, order: 1 },
      { id: 2, text: 'Decorate the room', arasaacId: 2483, order: 2 },
      { id: 3, text: 'Guests arrive', arasaacId: 6044, order: 3 },
      { id: 4, text: 'Play games', arasaacId: 6994, order: 4 },
      { id: 5, text: 'Blow out candles', arasaacId: 2507, order: 5 },
      { id: 6, text: 'Open presents', arasaacId: 7006, order: 6 },
    ],
    retellPrompt: 'Tell me about a birthday party!',
  },
  doctor: {
    name: 'Visit to the Doctor',
    icon: '🏥',
    color: '#4A9FD4',
    steps: [
      { id: 1, text: 'Arrive at the clinic', arasaacId: 2563, order: 1 },
      { id: 2, text: 'Sit in waiting room', arasaacId: 2516, order: 2 },
      { id: 3, text: 'Nurse calls your name', arasaacId: 6044, order: 3 },
      { id: 4, text: 'Doctor examines you', arasaacId: 6022, order: 4 },
      { id: 5, text: 'Get a sticker', arasaacId: null, order: 5 },
    ],
    retellPrompt: 'What happens at the doctor?',
  },
};

// Game modes
const MODES = {
  sequence: {
    name: 'Put in Order',
    description: 'Arrange the steps in the right order',
    icon: Shuffle,
  },
  retell: {
    name: 'Retell Story',
    description: 'Practice telling the story',
    icon: BookOpen,
  },
};

const StorySequencing = () => {
  const navigate = useNavigate();
  
  // State
  const [selectedStory, setSelectedStory] = useState(null);
  const [gameMode, setGameMode] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [shuffledSteps, setShuffledSteps] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [currentRetellStep, setCurrentRetellStep] = useState(0);

  // Text to speech
  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Start game
  const startGame = () => {
    if (!selectedStory || !gameMode) return;
    
    const story = STORIES[selectedStory];
    
    if (gameMode === 'sequence') {
      // Shuffle steps
      const shuffled = [...story.steps].sort(() => Math.random() - 0.5);
      setShuffledSteps(shuffled);
    } else {
      setShuffledSteps([...story.steps]);
      setCurrentRetellStep(0);
    }
    
    setAttempts(0);
    setShowResult(false);
    setGameStarted(true);
  };

  // Move step up/down
  const moveStep = (index, direction) => {
    const newSteps = [...shuffledSteps];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= newSteps.length) return;
    
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    setShuffledSteps(newSteps);
  };

  // Check sequence
  const checkSequence = () => {
    setAttempts(prev => prev + 1);
    const isCorrect = shuffledSteps.every((step, idx) => step.order === idx + 1);
    
    if (isCorrect) {
      setShowResult(true);
    } else {
      // Highlight incorrect positions
      speak("Not quite right. Try again!");
    }
  };

  // Check if current order is correct
  const isStepCorrect = (step, index) => {
    return step.order === index + 1;
  };

  const storyData = selectedStory ? STORIES[selectedStory] : null;

  // Selection screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F5A623]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/speech-therapy')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F5A623] 
                         rounded-xl font-display font-bold text-[#F5A623] hover:bg-[#F5A623] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-display text-[#F5A623] flex items-center gap-2">
                📖 Story Sequencing
              </h1>
              <p className="text-sm text-gray-500 font-crayon">Order events and retell stories</p>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Introduction */}
          <div className="bg-white rounded-2xl border-4 border-[#F5A623] p-5 mb-6 shadow-lg">
            <h2 className="font-display text-xl text-[#F5A623] mb-2 flex items-center gap-2">
              <BookOpen size={24} />
              Story Time!
            </h2>
            <p className="font-crayon text-gray-600">
              Practice putting story events in order and retelling what happens. 
              This helps with understanding sequences and telling your own stories!
            </p>
          </div>

          {/* Story Selection */}
          <h3 className="font-display text-gray-700 mb-3">1. Choose a Story</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {Object.entries(STORIES).map(([key, story]) => (
              <button
                key={key}
                onClick={() => setSelectedStory(key)}
                className={`bg-white rounded-2xl border-4 p-4 shadow-lg transition-all
                           flex items-center gap-4 text-left
                           ${selectedStory === key ? 'scale-105' : 'hover:scale-102'}`}
                style={{ 
                  borderColor: story.color,
                  backgroundColor: selectedStory === key ? `${story.color}15` : 'white',
                }}
              >
                <span className="text-4xl">{story.icon}</span>
                <div>
                  <h4 className="font-display" style={{ color: story.color }}>{story.name}</h4>
                  <p className="text-sm text-gray-500 font-crayon">{story.steps.length} steps</p>
                </div>
              </button>
            ))}
          </div>

          {/* Mode Selection */}
          {selectedStory && (
            <>
              <h3 className="font-display text-gray-700 mb-3">2. Choose Activity</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {Object.entries(MODES).map(([key, mode]) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setGameMode(key)}
                      className={`bg-white rounded-2xl border-4 p-4 shadow-lg transition-all
                                 flex items-center gap-4 text-left
                                 ${gameMode === key 
                                   ? 'border-[#F5A623] bg-orange-50 scale-105' 
                                   : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                                      ${gameMode === key ? 'bg-[#F5A623]/20' : 'bg-gray-100'}`}>
                        <Icon size={24} className={gameMode === key ? 'text-[#F5A623]' : 'text-gray-400'} />
                      </div>
                      <div>
                        <h4 className={`font-display ${gameMode === key ? 'text-[#F5A623]' : 'text-gray-700'}`}>
                          {mode.name}
                        </h4>
                        <p className="text-sm text-gray-500 font-crayon">{mode.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Start Button */}
          {selectedStory && gameMode && (
            <button
              onClick={startGame}
              className="w-full py-4 bg-[#F5A623] text-xl font-display text-white rounded-2xl
                         shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Play size={24} />
              Start Activity
            </button>
          )}
        </main>
      </div>
    );
  }

  // Results screen
  if (showResult) {
    const stars = Math.max(1, 5 - attempts + 1);

    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4"
                style={{ borderColor: storyData.color }}>
          <div className="max-w-2xl mx-auto px-4 py-3">
            <h1 className="text-xl font-display text-center" style={{ color: storyData.color }}>
              Story Complete!
            </h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl border-4 border-[#F8D14A] p-6 shadow-lg text-center">
            <Trophy size={64} className="mx-auto text-[#F8D14A] mb-4" />
            <h2 className="text-2xl font-display text-[#F8D14A] mb-2">
              {storyData.icon} {storyData.name}
            </h2>
            <p className="text-gray-500 font-crayon mb-4">
              You got the story in order{attempts > 1 ? ` in ${attempts} tries` : ' on your first try'}!
            </p>

            <div className="flex justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={32}
                  className={i < stars ? 'text-[#F8D14A] fill-[#F8D14A]' : 'text-gray-300'}
                />
              ))}
            </div>

            {/* Correct sequence */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <p className="font-display text-gray-700 mb-3">The Story:</p>
              {storyData.steps.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-2 py-1">
                  <span className="w-6 h-6 rounded-full bg-[#5CB85C] text-white text-sm 
                                   flex items-center justify-center font-display">
                    {idx + 1}
                  </span>
                  <span className="font-crayon text-gray-600">{step.text}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="flex-1 py-3 bg-[#5CB85C] text-white font-display rounded-xl
                           flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Try Again
              </button>
              <button
                onClick={() => setGameStarted(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 font-display rounded-xl"
              >
                New Story
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // SEQUENCE MODE - Put in order
  if (gameMode === 'sequence') {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4"
                style={{ borderColor: storyData.color }}>
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setGameStarted(false)}
              className="p-2 bg-white border-3 rounded-xl"
              style={{ borderColor: storyData.color }}
            >
              <ArrowLeft size={20} style={{ color: storyData.color }} />
            </button>
            <div className="flex-1 text-center">
              <span className="font-display" style={{ color: storyData.color }}>
                {storyData.icon} {storyData.name}
              </span>
            </div>
            {attempts > 0 && (
              <span className="text-sm font-crayon text-gray-500">
                Tries: {attempts}
              </span>
            )}
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-6">
          <p className="text-center font-crayon text-gray-600 mb-4">
            Drag or use arrows to put the story in order:
          </p>

          {/* Steps to arrange */}
          <div className="space-y-3 mb-6">
            {shuffledSteps.map((step, index) => (
              <div
                key={step.id}
                className="bg-white rounded-xl border-4 p-3 shadow-lg flex items-center gap-3"
                style={{ borderColor: storyData.color }}
              >
                {/* Position indicator */}
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-white font-display"
                      style={{ backgroundColor: storyData.color }}>
                  {index + 1}
                </span>

                {/* Image */}
                {step.arasaacId && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={getPictogramUrl(step.arasaacId)} 
                      alt={step.text}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                {/* Text */}
                <div className="flex-1">
                  <p className="font-crayon text-gray-700">{step.text}</p>
                </div>

                {/* Listen */}
                <button
                  onClick={() => speak(step.text)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Volume2 size={18} style={{ color: storyData.color }} />
                </button>

                {/* Move buttons */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveStep(index, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                  >
                    <ChevronUp size={18} style={{ color: storyData.color }} />
                  </button>
                  <button
                    onClick={() => moveStep(index, 'down')}
                    disabled={index === shuffledSteps.length - 1}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                  >
                    <ChevronDown size={18} style={{ color: storyData.color }} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Check button */}
          <button
            onClick={checkSequence}
            className="w-full py-4 text-white font-display rounded-xl shadow-lg
                       flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: storyData.color }}
          >
            <Check size={24} />
            Check My Order
          </button>
        </main>
      </div>
    );
  }

  // RETELL MODE - Practice telling the story
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4"
              style={{ borderColor: storyData.color }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setGameStarted(false)}
            className="p-2 bg-white border-3 rounded-xl"
            style={{ borderColor: storyData.color }}
          >
            <ArrowLeft size={20} style={{ color: storyData.color }} />
          </button>
          <div className="flex-1 text-center">
            <span className="font-display" style={{ color: storyData.color }}>
              {storyData.icon} Retell: {storyData.name}
            </span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-gray-200">
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              width: `${((currentRetellStep + 1) / shuffledSteps.length) * 100}%`,
              backgroundColor: storyData.color 
            }}
          />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Prompt */}
        <div className="bg-white rounded-xl border-3 p-4 mb-6"
             style={{ borderColor: storyData.color }}>
          <p className="font-display text-center" style={{ color: storyData.color }}>
            {storyData.retellPrompt}
          </p>
        </div>

        {/* Current step */}
        <div className="bg-white rounded-3xl border-4 shadow-xl p-6 text-center mb-6"
             style={{ borderColor: storyData.color }}>
          <span className="inline-block w-10 h-10 rounded-full text-white font-display mb-4
                          flex items-center justify-center mx-auto"
                style={{ backgroundColor: storyData.color }}>
            {currentRetellStep + 1}
          </span>

          {shuffledSteps[currentRetellStep]?.arasaacId && (
            <div className="w-32 h-32 mx-auto mb-4 rounded-xl overflow-hidden bg-gray-100">
              <img 
                src={getPictogramUrl(shuffledSteps[currentRetellStep].arasaacId)} 
                alt={shuffledSteps[currentRetellStep].text}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <p className="font-crayon text-xl text-gray-700 mb-4">
            {shuffledSteps[currentRetellStep]?.text}
          </p>

          <button
            onClick={() => speak(shuffledSteps[currentRetellStep]?.text)}
            className="px-4 py-2 rounded-xl text-white font-crayon flex items-center gap-2 mx-auto"
            style={{ backgroundColor: storyData.color }}
          >
            <Volume2 size={18} />
            Listen
          </button>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentRetellStep(prev => Math.max(0, prev - 1))}
            disabled={currentRetellStep === 0}
            className="flex-1 py-3 bg-gray-200 text-gray-700 font-display rounded-xl
                       disabled:opacity-50"
          >
            Previous
          </button>
          {currentRetellStep < shuffledSteps.length - 1 ? (
            <button
              onClick={() => setCurrentRetellStep(prev => prev + 1)}
              className="flex-1 py-3 text-white font-display rounded-xl"
              style={{ backgroundColor: storyData.color }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => setShowResult(true)}
              className="flex-1 py-3 bg-[#5CB85C] text-white font-display rounded-xl
                         flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Done!
            </button>
          )}
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {shuffledSteps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentRetellStep(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentRetellStep ? 'w-6' : ''
              }`}
              style={{ 
                backgroundColor: idx <= currentRetellStep ? storyData.color : '#E5E7EB' 
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default StorySequencing;
