// ListeningGames.jsx - Auditory processing activities
// Speech therapy app for listening and auditory discrimination skills

import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Volume2, Check, X, RotateCcw, Trophy, Star, 
  Ear, Play, Pause, HelpCircle
} from 'lucide-react';

// Sound sequences for memory game
const SOUND_SEQUENCES = {
  animals: {
    name: 'Animal Sounds',
    icon: '🐾',
    color: '#F5A623',
    sounds: [
      { id: 'dog', label: 'Dog', emoji: '🐕', sound: 'woof' },
      { id: 'cat', label: 'Cat', emoji: '🐱', sound: 'meow' },
      { id: 'cow', label: 'Cow', emoji: '🐄', sound: 'moo' },
      { id: 'duck', label: 'Duck', emoji: '🦆', sound: 'quack' },
      { id: 'pig', label: 'Pig', emoji: '🐷', sound: 'oink' },
      { id: 'sheep', label: 'Sheep', emoji: '🐑', sound: 'baa' },
    ],
  },
  instruments: {
    name: 'Instruments',
    icon: '🎵',
    color: '#8E6BBF',
    sounds: [
      { id: 'drum', label: 'Drum', emoji: '🥁', sound: 'boom boom' },
      { id: 'bell', label: 'Bell', emoji: '🔔', sound: 'ding' },
      { id: 'guitar', label: 'Guitar', emoji: '🎸', sound: 'strum' },
      { id: 'piano', label: 'Piano', emoji: '🎹', sound: 'plink' },
      { id: 'trumpet', label: 'Trumpet', emoji: '🎺', sound: 'toot' },
      { id: 'whistle', label: 'Whistle', emoji: '📯', sound: 'tweet' },
    ],
  },
  environment: {
    name: 'Everyday Sounds',
    icon: '🏠',
    color: '#4A9FD4',
    sounds: [
      { id: 'phone', label: 'Phone', emoji: '📱', sound: 'ring ring' },
      { id: 'door', label: 'Door', emoji: '🚪', sound: 'knock knock' },
      { id: 'clock', label: 'Clock', emoji: '⏰', sound: 'tick tock' },
      { id: 'water', label: 'Water', emoji: '💧', sound: 'splash' },
      { id: 'car', label: 'Car', emoji: '🚗', sound: 'vroom' },
      { id: 'train', label: 'Train', emoji: '🚂', sound: 'choo choo' },
    ],
  },
};

// Game modes
const GAME_MODES = {
  identify: {
    name: 'Sound Identify',
    description: 'Hear a sound, find the match',
    icon: Ear,
    color: '#5CB85C',
  },
  sequence: {
    name: 'Sound Sequence',
    description: 'Remember the order of sounds',
    icon: Play,
    color: '#E86B9A',
  },
  different: {
    name: 'Odd One Out',
    description: 'Find the different sound',
    icon: HelpCircle,
    color: '#F5A623',
  },
};

const ListeningGames = () => {
  const navigate = useNavigate();
  
  // Game state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [gameMode, setGameMode] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(5);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState(null);
  
  // Mode-specific state
  const [targetSound, setTargetSound] = useState(null);
  const [options, setOptions] = useState([]);
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [sequenceLength, setSequenceLength] = useState(2);

  // Text to speech for sounds
  const speak = useCallback((text, rate = 0.9) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Play a sound
  const playSound = useCallback((sound) => {
    speak(sound.sound);
  }, [speak]);

  // Play sequence of sounds
  const playSequence = useCallback(async (sounds) => {
    setIsPlayingSequence(true);
    for (let i = 0; i < sounds.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      playSound(sounds[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    setIsPlayingSequence(false);
  }, [playSound]);

  // Setup round based on game mode
  const setupRound = useCallback(() => {
    const categoryData = SOUND_SEQUENCES[selectedCategory];
    const sounds = categoryData.sounds;

    if (gameMode === 'identify') {
      // Pick random target and 3 options
      const shuffled = [...sounds].sort(() => Math.random() - 0.5);
      const target = shuffled[0];
      const opts = shuffled.slice(0, 4).sort(() => Math.random() - 0.5);
      setTargetSound(target);
      setOptions(opts);
      // Play target after short delay
      setTimeout(() => playSound(target), 500);
    } 
    else if (gameMode === 'sequence') {
      // Create sequence of sounds
      const shuffled = [...sounds].sort(() => Math.random() - 0.5);
      const seq = shuffled.slice(0, sequenceLength);
      setSequence(seq);
      setUserSequence([]);
      setOptions(sounds);
      // Play sequence after short delay
      setTimeout(() => playSequence(seq), 500);
    }
    else if (gameMode === 'different') {
      // Pick one sound to repeat and one different
      const shuffled = [...sounds].sort(() => Math.random() - 0.5);
      const repeatedSound = shuffled[0];
      const differentSound = shuffled[1];
      const differentPosition = Math.floor(Math.random() * 3);
      
      const opts = [repeatedSound, repeatedSound, repeatedSound];
      opts[differentPosition] = differentSound;
      
      setTargetSound(differentSound);
      setOptions(opts);
    }
  }, [selectedCategory, gameMode, sequenceLength, playSound, playSequence]);

  // Start game
  const startGame = () => {
    if (!selectedCategory || !gameMode) return;
    setCurrentRound(0);
    setScore({ correct: 0, total: 0 });
    setShowResult(false);
    setFeedback(null);
    setSequenceLength(2);
    setGameStarted(true);
  };

  // Setup first round when game starts
  useEffect(() => {
    if (gameStarted && currentRound < totalRounds) {
      setupRound();
    }
  }, [gameStarted, currentRound, setupRound, totalRounds]);

  // Handle answer for identify mode
  const handleIdentifyAnswer = (selected) => {
    const correct = selected.id === targetSound.id;
    
    setFeedback({
      correct,
      message: correct ? '🎉 Correct!' : `That was ${targetSound.label}`,
    });

    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    setTimeout(() => {
      setFeedback(null);
      if (currentRound < totalRounds - 1) {
        setCurrentRound(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  // Handle sequence selection
  const handleSequenceSelect = (sound) => {
    const newUserSequence = [...userSequence, sound];
    setUserSequence(newUserSequence);
    playSound(sound);

    // Check if sequence is complete
    if (newUserSequence.length === sequence.length) {
      const correct = newUserSequence.every((s, i) => s.id === sequence[i].id);
      
      setFeedback({
        correct,
        message: correct ? '🎉 Perfect sequence!' : 'Not quite right. Listen again!',
      });

      setScore(prev => ({
        correct: prev.correct + (correct ? 1 : 0),
        total: prev.total + 1,
      }));

      setTimeout(() => {
        setFeedback(null);
        setUserSequence([]);
        if (currentRound < totalRounds - 1) {
          // Increase sequence length every 2 rounds
          if (correct && (currentRound + 1) % 2 === 0) {
            setSequenceLength(prev => Math.min(prev + 1, 5));
          }
          setCurrentRound(prev => prev + 1);
        } else {
          setShowResult(true);
        }
      }, 2000);
    }
  };

  // Handle odd one out
  const handleDifferentAnswer = (index) => {
    const correct = options[index].id === targetSound.id;
    
    setFeedback({
      correct,
      message: correct ? '🎉 You found it!' : `The different one was #${options.findIndex(o => o.id === targetSound.id) + 1}`,
    });

    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    setTimeout(() => {
      setFeedback(null);
      if (currentRound < totalRounds - 1) {
        setCurrentRound(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const categoryData = selectedCategory ? SOUND_SEQUENCES[selectedCategory] : null;
  const modeData = gameMode ? GAME_MODES[gameMode] : null;

  // Selection screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#4A9FD4]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/speech-therapy')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#4A9FD4] 
                         rounded-xl font-display font-bold text-[#4A9FD4] hover:bg-[#4A9FD4] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-display text-[#4A9FD4] flex items-center gap-2">
                👂 Listening Games
              </h1>
              <p className="text-sm text-gray-500 font-crayon">Auditory processing activities</p>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Introduction */}
          <div className="bg-white rounded-2xl border-4 border-[#4A9FD4] p-5 mb-6 shadow-lg">
            <h2 className="font-display text-xl text-[#4A9FD4] mb-2 flex items-center gap-2">
              <Ear size={24} />
              Train Your Ears!
            </h2>
            <p className="font-crayon text-gray-600">
              These games help you practice listening carefully and remembering sounds. 
              Put on headphones for the best experience!
            </p>
          </div>

          {/* Category Selection */}
          <h3 className="font-display text-gray-700 mb-3">1. Choose Sound Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {Object.entries(SOUND_SEQUENCES).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`bg-white rounded-2xl border-4 p-4 shadow-lg transition-all text-center
                           ${selectedCategory === key ? 'scale-105' : 'hover:scale-102'}`}
                style={{ 
                  borderColor: category.color,
                  backgroundColor: selectedCategory === key ? `${category.color}15` : 'white',
                }}
              >
                <span className="text-4xl block mb-2">{category.icon}</span>
                <span className="font-display" style={{ color: category.color }}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>

          {/* Game Mode Selection */}
          {selectedCategory && (
            <>
              <h3 className="font-display text-gray-700 mb-3">2. Choose Game</h3>
              <div className="grid grid-cols-1 gap-3 mb-6">
                {Object.entries(GAME_MODES).map(([key, mode]) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setGameMode(key)}
                      className={`bg-white rounded-2xl border-4 p-4 shadow-lg transition-all
                                 flex items-center gap-4 text-left
                                 ${gameMode === key ? 'scale-102' : 'hover:scale-101'}`}
                      style={{ 
                        borderColor: mode.color,
                        backgroundColor: gameMode === key ? `${mode.color}15` : 'white',
                      }}
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                           style={{ backgroundColor: `${mode.color}20` }}>
                        <Icon size={24} style={{ color: mode.color }} />
                      </div>
                      <div>
                        <h4 className="font-display" style={{ color: mode.color }}>{mode.name}</h4>
                        <p className="text-sm text-gray-500 font-crayon">{mode.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Start Button */}
          {selectedCategory && gameMode && (
            <button
              onClick={startGame}
              className="w-full py-4 text-xl font-display text-white rounded-2xl
                         shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: modeData.color }}
            >
              <Play size={24} />
              Start Game
            </button>
          )}
        </main>
      </div>
    );
  }

  // Results screen
  if (showResult) {
    const percentage = Math.round((score.correct / score.total) * 100);
    const stars = Math.ceil(percentage / 20);

    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4"
                style={{ borderColor: modeData.color }}>
          <div className="max-w-2xl mx-auto px-4 py-3">
            <h1 className="text-xl font-display text-center" style={{ color: modeData.color }}>
              Game Complete!
            </h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl border-4 border-[#F8D14A] p-6 shadow-lg text-center">
            <Trophy size={64} className="mx-auto text-[#F8D14A] mb-4" />
            <h2 className="text-2xl font-display text-[#F8D14A] mb-2">Great Listening!</h2>
            
            <div className="my-6">
              <div className="text-5xl font-display" style={{ color: modeData.color }}>
                {score.correct} / {score.total}
              </div>
              <p className="text-gray-500 font-crayon mt-2">{percentage}% correct</p>
            </div>

            <div className="flex justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={32}
                  className={i < stars ? 'text-[#F8D14A] fill-[#F8D14A]' : 'text-gray-300'}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCurrentRound(0);
                  setScore({ correct: 0, total: 0 });
                  setShowResult(false);
                  setSequenceLength(2);
                }}
                className="flex-1 py-3 bg-[#5CB85C] text-white font-display rounded-xl
                           flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Play Again
              </button>
              <button
                onClick={() => setGameStarted(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 font-display rounded-xl"
              >
                Change Game
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Game screens based on mode
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4"
              style={{ borderColor: modeData.color }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setGameStarted(false)}
            className="p-2 bg-white border-3 rounded-xl"
            style={{ borderColor: modeData.color }}
          >
            <X size={20} style={{ color: modeData.color }} />
          </button>
          
          <div className="flex-1 text-center">
            <span className="font-display" style={{ color: modeData.color }}>
              {modeData.name}
            </span>
          </div>
          
          <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-green-600 fill-green-600" />
            <span className="font-display text-green-700">{score.correct}</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-gray-200">
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              width: `${((currentRound + 1) / totalRounds) * 100}%`,
              backgroundColor: modeData.color 
            }}
          />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* IDENTIFY MODE */}
        {gameMode === 'identify' && (
          <>
            <div className="text-center mb-6">
              <p className="font-crayon text-gray-600 mb-4">Listen and find the matching picture:</p>
              <button
                onClick={() => targetSound && playSound(targetSound)}
                className="p-6 rounded-full shadow-lg hover:scale-110 transition-transform"
                style={{ backgroundColor: modeData.color }}
              >
                <Volume2 size={48} className="text-white" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => !feedback && handleIdentifyAnswer(option)}
                  disabled={!!feedback}
                  className={`bg-white rounded-2xl border-4 p-6 shadow-lg transition-all
                             ${feedback 
                               ? option.id === targetSound.id 
                                 ? 'border-green-400 bg-green-50' 
                                 : 'border-gray-200'
                               : 'hover:scale-105'}`}
                  style={{ borderColor: !feedback ? categoryData.color : undefined }}
                >
                  <span className="text-5xl block mb-2">{option.emoji}</span>
                  <span className="font-crayon text-gray-700">{option.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* SEQUENCE MODE */}
        {gameMode === 'sequence' && (
          <>
            <div className="text-center mb-6">
              <p className="font-crayon text-gray-600 mb-2">
                Remember the {sequence.length} sounds in order!
              </p>
              <button
                onClick={() => !isPlayingSequence && playSequence(sequence)}
                disabled={isPlayingSequence}
                className="px-6 py-3 rounded-xl shadow-lg transition-transform flex items-center 
                           gap-2 mx-auto disabled:opacity-50"
                style={{ backgroundColor: modeData.color, color: 'white' }}
              >
                {isPlayingSequence ? <Pause size={20} /> : <Play size={20} />}
                {isPlayingSequence ? 'Playing...' : 'Play Again'}
              </button>
            </div>

            {/* User's progress */}
            <div className="flex justify-center gap-2 mb-6">
              {sequence.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-10 h-10 rounded-full border-3 flex items-center justify-center
                             text-xl transition-all`}
                  style={{ 
                    borderColor: modeData.color,
                    backgroundColor: userSequence[idx] ? `${modeData.color}20` : 'white',
                  }}
                >
                  {userSequence[idx]?.emoji || (idx + 1)}
                </div>
              ))}
            </div>

            {/* Options */}
            <div className="grid grid-cols-3 gap-3">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => !feedback && !isPlayingSequence && handleSequenceSelect(option)}
                  disabled={!!feedback || isPlayingSequence}
                  className="bg-white rounded-xl border-3 p-4 shadow-lg transition-all
                             hover:scale-105 disabled:opacity-50"
                  style={{ borderColor: categoryData.color }}
                >
                  <span className="text-3xl block mb-1">{option.emoji}</span>
                  <span className="font-crayon text-gray-700 text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ODD ONE OUT MODE */}
        {gameMode === 'different' && (
          <>
            <div className="text-center mb-6">
              <p className="font-crayon text-gray-600">
                Listen to each sound. Which one is different?
              </p>
            </div>

            <div className="space-y-4">
              {options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => !feedback && handleDifferentAnswer(idx)}
                  disabled={!!feedback}
                  className={`w-full bg-white rounded-xl border-4 p-4 shadow-lg transition-all
                             flex items-center gap-4
                             ${feedback 
                               ? option.id === targetSound.id 
                                 ? 'border-green-400 bg-green-50' 
                                 : 'border-gray-200'
                               : 'hover:scale-102'}`}
                  style={{ borderColor: !feedback ? categoryData.color : undefined }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-display"
                       style={{ backgroundColor: categoryData.color }}>
                    {idx + 1}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSound(option);
                    }}
                    className="p-3 rounded-full hover:bg-gray-100"
                  >
                    <Volume2 size={24} style={{ color: categoryData.color }} />
                  </button>
                  <span className="font-crayon text-gray-700">Sound {idx + 1}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Feedback */}
        {feedback && (
          <div className={`mt-6 p-4 rounded-xl text-center font-display text-lg
                          ${feedback.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {feedback.message}
          </div>
        )}

        {/* Progress */}
        <p className="text-center text-gray-500 font-crayon mt-6">
          Round {currentRound + 1} of {totalRounds}
        </p>
      </main>
    </div>
  );
};

export default ListeningGames;
