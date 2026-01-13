// ShapeMatch.jsx - Shape sorter matching game
// Match shapes to their corresponding holes/outlines
// Progressive difficulty from simple to challenging

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trophy, Star, Play, Sparkles, Lock } from 'lucide-react';

// ============================================
// SHAPE DEFINITIONS
// ============================================

const SHAPES = {
  // Basic shapes
  circle: {
    name: 'Circle',
    color: '#E63B2E',
    svg: (size, filled = true, strokeColor = '#333') => `
      <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" 
        fill="${filled ? '#E63B2E' : 'none'}" 
        stroke="${strokeColor}" 
        stroke-width="3"
        stroke-dasharray="${filled ? 'none' : '8,4'}"
      />
    `,
  },
  square: {
    name: 'Square',
    color: '#4A9FD4',
    svg: (size, filled = true, strokeColor = '#333') => `
      <rect x="4" y="4" width="${size-8}" height="${size-8}" 
        fill="${filled ? '#4A9FD4' : 'none'}" 
        stroke="${strokeColor}" 
        stroke-width="3"
        stroke-dasharray="${filled ? 'none' : '8,4'}"
      />
    `,
  },
  triangle: {
    name: 'Triangle',
    color: '#5CB85C',
    svg: (size, filled = true, strokeColor = '#333') => `
      <polygon points="${size/2},4 ${size-4},${size-4} 4,${size-4}" 
        fill="${filled ? '#5CB85C' : 'none'}" 
        stroke="${strokeColor}" 
        stroke-width="3"
        stroke-dasharray="${filled ? 'none' : '8,4'}"
      />
    `,
  },
  star: {
    name: 'Star',
    color: '#F8D14A',
    svg: (size, filled = true, strokeColor = '#333') => {
      const cx = size/2, cy = size/2, r1 = size/2-4, r2 = size/4;
      let points = '';
      for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 72 - 90) * Math.PI / 180;
        const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180;
        points += `${cx + r1 * Math.cos(outerAngle)},${cy + r1 * Math.sin(outerAngle)} `;
        points += `${cx + r2 * Math.cos(innerAngle)},${cy + r2 * Math.sin(innerAngle)} `;
      }
      return `<polygon points="${points.trim()}" 
        fill="${filled ? '#F8D14A' : 'none'}" 
        stroke="${strokeColor}" 
        stroke-width="3"
        stroke-dasharray="${filled ? 'none' : '8,4'}"
      />`;
    },
  },
  heart: {
    name: 'Heart',
    color: '#E86B9A',
    svg: (size, filled = true, strokeColor = '#333') => `
      <path d="M${size/2},${size-8} 
        C${size/2},${size-8} 8,${size/2} 8,${size/3}
        C8,${size/6} ${size/4},4 ${size/2},${size/3}
        C${size*3/4},4 ${size-8},${size/6} ${size-8},${size/3}
        C${size-8},${size/2} ${size/2},${size-8} ${size/2},${size-8}Z"
        fill="${filled ? '#E86B9A' : 'none'}" 
        stroke="${strokeColor}" 
        stroke-width="3"
        stroke-dasharray="${filled ? 'none' : '8,4'}"
      />
    `,
  },
  diamond: {
    name: 'Diamond',
    color: '#8E6BBF',
    svg: (size, filled = true, strokeColor = '#333') => `
      <polygon points="${size/2},4 ${size-4},${size/2} ${size/2},${size-4} 4,${size/2}" 
        fill="${filled ? '#8E6BBF' : 'none'}" 
        stroke="${strokeColor}" 
        stroke-width="3"
        stroke-dasharray="${filled ? 'none' : '8,4'}"
      />
    `,
  },
  pentagon: {
    name: 'Pentagon',
    color: '#20B2AA',
    svg: (size, filled = true, strokeColor = '#333') => {
      const cx = size/2, cy = size/2, r = size/2-4;
      let points = '';
      for (let i = 0; i < 5; i++) {
        const angle = (i * 72 - 90) * Math.PI / 180;
        points += `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)} `;
      }
      return `<polygon points="${points.trim()}" 
        fill="${filled ? '#20B2AA' : 'none'}" 
        stroke="${strokeColor}" 
        stroke-width="3"
        stroke-dasharray="${filled ? 'none' : '8,4'}"
      />`;
    },
  },
  hexagon: {
    name: 'Hexagon',
    color: '#F5A623',
    svg: (size, filled = true, strokeColor = '#333') => {
      const cx = size/2, cy = size/2, r = size/2-4;
      let points = '';
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60 - 90) * Math.PI / 180;
        points += `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)} `;
      }
      return `<polygon points="${points.trim()}" 
        fill="${filled ? '#F5A623' : 'none'}" 
        stroke="${strokeColor}" 
        stroke-width="3"
        stroke-dasharray="${filled ? 'none' : '8,4'}"
      />`;
    },
  },
  oval: {
    name: 'Oval',
    color: '#87CEEB',
    svg: (size, filled = true, strokeColor = '#333') => `
      <ellipse cx="${size/2}" cy="${size/2}" rx="${size/2-4}" ry="${size/3}" 
        fill="${filled ? '#87CEEB' : 'none'}" 
        stroke="${strokeColor}" 
        stroke-width="3"
        stroke-dasharray="${filled ? 'none' : '8,4'}"
      />
    `,
  },
  cross: {
    name: 'Cross',
    color: '#DC143C',
    svg: (size, filled = true, strokeColor = '#333') => {
      const w = size/3, h = size-8;
      return `<path d="M${size/2-w/2},4 h${w} v${h/3-4} h${h/3-4} v${w} h${-(h/3-4)} v${h/3-4} h${-w} v${-(h/3-4)} h${-(h/3-4)} v${-w} h${h/3-4} Z"
        fill="${filled ? '#DC143C' : 'none'}" 
        stroke="${strokeColor}" 
        stroke-width="3"
        stroke-dasharray="${filled ? 'none' : '8,4'}"
      />`;
    },
  },
};

// ============================================
// LEVELS
// ============================================

const LEVELS = [
  {
    id: 1,
    name: 'Level 1',
    description: 'Basic Shapes',
    shapes: ['circle', 'square', 'triangle'],
    gridSize: 3,
    color: '#5CB85C',
    unlocked: true,
  },
  {
    id: 2,
    name: 'Level 2',
    description: 'More Shapes',
    shapes: ['circle', 'square', 'triangle', 'star'],
    gridSize: 4,
    color: '#4A9FD4',
    unlocked: false,
  },
  {
    id: 3,
    name: 'Level 3',
    description: 'Getting Harder',
    shapes: ['circle', 'square', 'triangle', 'star', 'heart'],
    gridSize: 5,
    color: '#F5A623',
    unlocked: false,
  },
  {
    id: 4,
    name: 'Level 4',
    description: 'Shape Expert',
    shapes: ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'],
    gridSize: 6,
    color: '#8E6BBF',
    unlocked: false,
  },
  {
    id: 5,
    name: 'Level 5',
    description: 'Shape Master!',
    shapes: ['circle', 'square', 'triangle', 'star', 'heart', 'diamond', 'pentagon', 'hexagon'],
    gridSize: 8,
    color: '#E63B2E',
    unlocked: false,
  },
];

const STORAGE_KEY = 'snw_shape_match_progress';

// ============================================
// COMPONENT
// ============================================

const ShapeMatch = () => {
  const navigate = useNavigate();
  
  // Game state
  const [gameState, setGameState] = useState('menu'); // menu, playing, complete
  const [currentLevel, setCurrentLevel] = useState(null);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [levelBestScores, setLevelBestScores] = useState({});
  
  // Round state
  const [shapes, setShapes] = useState([]);
  const [holes, setHoles] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastMatch, setLastMatch] = useState(null);

  // Load progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.unlockedLevels) setUnlockedLevels(data.unlockedLevels);
        if (data.bestScores) setLevelBestScores(data.bestScores);
      }
    } catch (e) {
      console.error('Error loading progress:', e);
    }
  }, []);

  // Save progress
  const saveProgress = useCallback((newUnlocked, newScores) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        unlockedLevels: newUnlocked,
        bestScores: newScores,
      }));
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  }, []);

  // Shuffle array
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Start a level
  const startLevel = (levelId) => {
    const level = LEVELS.find(l => l.id === levelId);
    if (!level || !unlockedLevels.includes(levelId)) return;

    setCurrentLevel(level);
    
    // Create shape cards
    const levelShapes = shuffleArray(level.shapes.map((shapeId, idx) => ({
      id: `shape-${idx}`,
      shapeType: shapeId,
      matched: false,
    })));

    // Create holes (same shapes but shuffled differently)
    const levelHoles = shuffleArray(level.shapes.map((shapeId, idx) => ({
      id: `hole-${idx}`,
      shapeType: shapeId,
      filled: false,
    })));

    setShapes(levelShapes);
    setHoles(levelHoles);
    setMatchedPairs([]);
    setSelectedShape(null);
    setScore(0);
    setMoves(0);
    setShowSuccess(false);
    setLastMatch(null);
    setGameState('playing');
  };

  // Handle shape selection
  const handleShapeClick = (shape) => {
    if (shape.matched || showSuccess) return;
    setSelectedShape(shape);
  };

  // Handle hole click
  const handleHoleClick = (hole) => {
    if (!selectedShape || hole.filled || showSuccess) return;

    setMoves(m => m + 1);

    if (selectedShape.shapeType === hole.shapeType) {
      // Correct match!
      setLastMatch({ shape: selectedShape, hole });
      setShowSuccess(true);
      
      // Play success sound
      playSuccessSound();

      setTimeout(() => {
        setShapes(prev => prev.map(s => 
          s.id === selectedShape.id ? { ...s, matched: true } : s
        ));
        setHoles(prev => prev.map(h => 
          h.id === hole.id ? { ...h, filled: true } : h
        ));
        setMatchedPairs(prev => [...prev, { shapeId: selectedShape.id, holeId: hole.id }]);
        setScore(s => s + 10);
        setSelectedShape(null);
        setShowSuccess(false);
        setLastMatch(null);
      }, 600);
    } else {
      // Wrong match - shake and deselect
      playErrorSound();
      setSelectedShape(null);
    }
  };

  // Check for level completion
  useEffect(() => {
    if (gameState === 'playing' && shapes.length > 0 && shapes.every(s => s.matched)) {
      // Level complete!
      const bonus = Math.max(0, (currentLevel.shapes.length * 5) - moves) * 2;
      const finalScore = score + bonus;
      
      setTimeout(() => {
        // Unlock next level
        const nextLevelId = currentLevel.id + 1;
        let newUnlocked = [...unlockedLevels];
        if (nextLevelId <= LEVELS.length && !newUnlocked.includes(nextLevelId)) {
          newUnlocked = [...newUnlocked, nextLevelId];
          setUnlockedLevels(newUnlocked);
        }

        // Update best score
        const newScores = { ...levelBestScores };
        if (!newScores[currentLevel.id] || finalScore > newScores[currentLevel.id]) {
          newScores[currentLevel.id] = finalScore;
          setLevelBestScores(newScores);
        }

        saveProgress(newUnlocked, newScores);
        setScore(finalScore);
        setGameState('complete');
      }, 500);
    }
  }, [shapes, gameState, score, moves, currentLevel, unlockedLevels, levelBestScores, saveProgress]);

  // Play success sound
  const playSuccessSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
      
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    } catch (e) {
      // Audio not supported
    }
  };

  // Play error sound
  const playErrorSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.type = 'square';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
      // Audio not supported
    }
  };

  // Calculate stars
  const getStars = () => {
    if (!currentLevel) return 0;
    const perfectMoves = currentLevel.shapes.length;
    const ratio = perfectMoves / Math.max(moves, 1);
    if (ratio >= 0.8) return 3;
    if (ratio >= 0.5) return 2;
    return 1;
  };

  // Render shape SVG
  const renderShape = (shapeType, size, filled = true, strokeColor = '#333') => {
    const shape = SHAPES[shapeType];
    if (!shape) return null;
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${shape.svg(size, filled, strokeColor)}</svg>`;
  };

  // ============================================
  // MENU VIEW
  // ============================================

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/games')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                         rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Games
            </button>
            <h1 className="text-xl font-display text-[#8E6BBF] crayon-text flex items-center gap-2">
              🔷 Shape Match
            </h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Instructions */}
          <div className="bg-white rounded-3xl border-4 border-[#8E6BBF] p-6 shadow-crayon mb-6">
            <h2 className="font-display text-xl text-[#8E6BBF] mb-4 flex items-center gap-2">
              <Sparkles size={24} />
              How to Play
            </h2>
            <div className="space-y-3 font-crayon text-gray-600">
              <p className="flex items-start gap-3">
                <span className="w-8 h-8 bg-[#4A9FD4] text-white rounded-full flex items-center justify-center flex-shrink-0 font-display">1</span>
                <span>Tap a colored shape to select it</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="w-8 h-8 bg-[#F5A623] text-white rounded-full flex items-center justify-center flex-shrink-0 font-display">2</span>
                <span>Tap the matching hole to place it</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="w-8 h-8 bg-[#5CB85C] text-white rounded-full flex items-center justify-center flex-shrink-0 font-display">3</span>
                <span>Match all shapes to complete the level!</span>
              </p>
            </div>
          </div>

          {/* Level Selection */}
          <h2 className="font-display text-lg text-gray-700 mb-4">Choose a Level:</h2>
          
          <div className="grid gap-4">
            {LEVELS.map((level) => {
              const isUnlocked = unlockedLevels.includes(level.id);
              const bestScore = levelBestScores[level.id];

              return (
                <button
                  key={level.id}
                  onClick={() => isUnlocked && startLevel(level.id)}
                  disabled={!isUnlocked}
                  className={`p-4 rounded-2xl border-4 text-left transition-all relative overflow-hidden
                    ${isUnlocked 
                      ? 'bg-white hover:scale-[1.02] hover:-rotate-1 shadow-crayon' 
                      : 'bg-gray-100 opacity-60 cursor-not-allowed'
                    }`}
                  style={{ borderColor: isUnlocked ? level.color : '#ccc' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-display text-xl"
                        style={{ backgroundColor: level.color }}
                      >
                        {isUnlocked ? level.id : <Lock size={24} />}
                      </div>
                      <div>
                        <h3 className="font-display text-lg text-gray-800">{level.name}</h3>
                        <p className="font-crayon text-sm text-gray-500">{level.description}</p>
                        <p className="font-crayon text-xs text-gray-400 mt-1">
                          {level.shapes.length} shapes
                        </p>
                      </div>
                    </div>
                    
                    {isUnlocked && (
                      <div className="text-right">
                        {bestScore ? (
                          <div>
                            <p className="font-crayon text-xs text-gray-400">Best</p>
                            <p className="font-display text-lg" style={{ color: level.color }}>
                              {bestScore}
                            </p>
                          </div>
                        ) : (
                          <Play size={24} style={{ color: level.color }} />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Shape preview */}
                  {isUnlocked && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {level.shapes.slice(0, 6).map((shapeId) => (
                        <div
                          key={shapeId}
                          className="w-8 h-8"
                          dangerouslySetInnerHTML={{ __html: renderShape(shapeId, 32, true) }}
                        />
                      ))}
                      {level.shapes.length > 6 && (
                        <span className="font-crayon text-sm text-gray-400 self-center">
                          +{level.shapes.length - 6}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // ============================================
  // COMPLETE VIEW
  // ============================================

  if (gameState === 'complete') {
    const stars = getStars();
    const nextLevel = LEVELS.find(l => l.id === currentLevel.id + 1);

    return (
      <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border-4 border-[#F8D14A] p-8 shadow-crayon text-center max-w-sm w-full">
          <Trophy className="w-20 h-20 text-[#F8D14A] mx-auto mb-4 animate-bounce" />
          
          <h2 className="text-2xl font-display text-[#5CB85C] mb-2">
            Level Complete! 🎉
          </h2>
          
          <p className="font-display text-lg" style={{ color: currentLevel.color }}>
            {currentLevel.name}
          </p>
          
          <div className="flex justify-center gap-2 my-4">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                size={40}
                className={star <= stars ? 'text-[#F8D14A] fill-[#F8D14A]' : 'text-gray-300'}
              />
            ))}
          </div>

          <div className="space-y-2 mb-6 p-4 bg-gray-100 rounded-xl">
            <p className="font-crayon text-gray-600">
              Score: <span className="font-display text-[#5CB85C]">{score}</span>
            </p>
            <p className="font-crayon text-gray-600">
              Moves: <span className="font-display text-[#4A9FD4]">{moves}</span>
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => startLevel(currentLevel.id)}
              className="w-full py-3 bg-[#F5A623] text-white rounded-xl font-display
                         hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Play Again
            </button>
            
            {nextLevel && unlockedLevels.includes(nextLevel.id) && (
              <button
                onClick={() => startLevel(nextLevel.id)}
                className="w-full py-3 text-white rounded-xl font-display
                           hover:scale-105 transition-transform flex items-center justify-center gap-2"
                style={{ backgroundColor: nextLevel.color }}
              >
                <Play size={20} />
                Next Level
              </button>
            )}
            
            <button
              onClick={() => setGameState('menu')}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-crayon
                         hover:bg-gray-300 transition-colors"
            >
              Back to Levels
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // PLAYING VIEW
  // ============================================

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header 
        className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4"
        style={{ borderColor: currentLevel?.color }}
      >
        <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">
          <button
            onClick={() => setGameState('menu')}
            className="flex items-center gap-2 px-3 py-2 bg-white border-3 rounded-xl font-crayon"
            style={{ borderColor: currentLevel?.color, color: currentLevel?.color }}
          >
            <ArrowLeft size={16} />
            Levels
          </button>
          
          <div className="text-center">
            <p className="font-crayon text-xs text-gray-500">{currentLevel?.name}</p>
            <p className="font-display" style={{ color: currentLevel?.color }}>
              {matchedPairs.length} / {shapes.length}
            </p>
          </div>
          
          <div className="text-center">
            <p className="font-crayon text-xs text-gray-500">Score</p>
            <p className="font-display text-[#5CB85C]">{score}</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Instruction */}
        <div className="text-center mb-4">
          <p className="font-crayon text-gray-600">
            {selectedShape 
              ? `Now tap the matching ${SHAPES[selectedShape.shapeType]?.name} hole!`
              : 'Tap a shape to select it'
            }
          </p>
        </div>

        {/* Shapes to place */}
        <div className="mb-6">
          <h3 className="font-crayon text-sm text-gray-500 mb-2 text-center">Shapes</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {shapes.filter(s => !s.matched).map((shape) => {
              const isSelected = selectedShape?.id === shape.id;
              const shapeSize = 60;

              return (
                <button
                  key={shape.id}
                  onClick={() => handleShapeClick(shape)}
                  className={`p-2 rounded-xl transition-all ${
                    isSelected 
                      ? 'bg-yellow-200 scale-110 ring-4 ring-yellow-400' 
                      : 'bg-white hover:scale-105 shadow-md'
                  }`}
                  style={{ 
                    opacity: showSuccess && lastMatch?.shape.id === shape.id ? 0.5 : 1,
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: renderShape(shape.shapeType, shapeSize, true) }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-1 bg-gray-200 rounded" />
          <span className="font-crayon text-gray-400">⬇️ Match to ⬇️</span>
          <div className="flex-1 h-1 bg-gray-200 rounded" />
        </div>

        {/* Holes to fill */}
        <div>
          <h3 className="font-crayon text-sm text-gray-500 mb-2 text-center">Holes</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {holes.map((hole) => {
              const isFilled = hole.filled;
              const holeSize = 60;
              const isTarget = selectedShape && selectedShape.shapeType === hole.shapeType;

              return (
                <button
                  key={hole.id}
                  onClick={() => handleHoleClick(hole)}
                  disabled={isFilled}
                  className={`p-2 rounded-xl transition-all ${
                    isFilled 
                      ? 'bg-green-100 opacity-50' 
                      : isTarget && selectedShape
                        ? 'bg-green-50 ring-4 ring-green-300 hover:scale-105'
                        : selectedShape
                          ? 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
                          : 'bg-gray-100'
                  }`}
                  style={{
                    opacity: showSuccess && lastMatch?.hole.id === hole.id ? 1 : isFilled ? 0.5 : 1,
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{ 
                      __html: renderShape(
                        hole.shapeType, 
                        holeSize, 
                        isFilled || (showSuccess && lastMatch?.hole.id === hole.id), 
                        isFilled ? '#5CB85C' : '#999'
                      ) 
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Moves counter */}
        <div className="mt-6 text-center">
          <p className="font-crayon text-sm text-gray-400">
            Moves: {moves}
          </p>
        </div>

        {/* Success animation overlay */}
        {showSuccess && (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
            <div className="text-6xl animate-bounce">✨</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ShapeMatch;
