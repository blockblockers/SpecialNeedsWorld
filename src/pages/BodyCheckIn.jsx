// BodyCheckIn.jsx - Body sensations and pain tracker
// NAVIGATION: Back button goes to /wellness (parent hub)

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  History, 
  X, 
  Info,
  CheckCircle2,
  Frown,
  Meh,
  Smile,
  AlertCircle
} from 'lucide-react';

// Storage key
const STORAGE_KEY = 'snw_body_checkins';

// Body parts to check
const BODY_PARTS = [
  { id: 'head', name: 'Head', emoji: '🤕', x: 50, y: 8 },
  { id: 'eyes', name: 'Eyes', emoji: '👀', x: 50, y: 12 },
  { id: 'ears', name: 'Ears', emoji: '👂', x: 50, y: 14 },
  { id: 'throat', name: 'Throat', emoji: '🗣️', x: 50, y: 20 },
  { id: 'chest', name: 'Chest', emoji: '💗', x: 50, y: 30 },
  { id: 'stomach', name: 'Stomach', emoji: '🤢', x: 50, y: 42 },
  { id: 'leftArm', name: 'Left Arm', emoji: '💪', x: 25, y: 38 },
  { id: 'rightArm', name: 'Right Arm', emoji: '💪', x: 75, y: 38 },
  { id: 'back', name: 'Back', emoji: '🔙', x: 50, y: 35 },
  { id: 'leftLeg', name: 'Left Leg', emoji: '🦵', x: 38, y: 70 },
  { id: 'rightLeg', name: 'Right Leg', emoji: '🦵', x: 62, y: 70 },
  { id: 'feet', name: 'Feet', emoji: '🦶', x: 50, y: 92 },
];

// Feeling options for each body part
const FEELINGS = [
  { id: 'good', label: 'Feels Good', emoji: '😊', color: '#5CB85C' },
  { id: 'okay', label: 'Okay', emoji: '😐', color: '#F5A623' },
  { id: 'hurts', label: 'Hurts a Little', emoji: '😟', color: '#E86B9A' },
  { id: 'hurts-lot', label: 'Hurts a Lot', emoji: '😢', color: '#E63B2E' },
  { id: 'weird', label: 'Feels Weird', emoji: '🤔', color: '#8E6BBF' },
  { id: 'tingly', label: 'Tingly', emoji: '⚡', color: '#4A9FD4' },
  { id: 'tired', label: 'Tired/Heavy', emoji: '😴', color: '#6B5B95' },
];

// Simple body outline SVG
const BodyOutline = ({ selectedParts, onPartClick }) => (
  <svg viewBox="0 0 100 100" className="w-full max-w-xs mx-auto">
    {/* Head */}
    <circle cx="50" cy="12" r="10" fill="#FFE4C4" stroke="#DEB887" strokeWidth="1" />
    
    {/* Neck */}
    <rect x="47" y="22" width="6" height="6" fill="#FFE4C4" stroke="#DEB887" strokeWidth="0.5" />
    
    {/* Body */}
    <ellipse cx="50" cy="40" rx="15" ry="18" fill="#FFE4C4" stroke="#DEB887" strokeWidth="1" />
    
    {/* Arms */}
    <ellipse cx="30" cy="38" rx="5" ry="15" fill="#FFE4C4" stroke="#DEB887" strokeWidth="1" transform="rotate(-15 30 38)" />
    <ellipse cx="70" cy="38" rx="5" ry="15" fill="#FFE4C4" stroke="#DEB887" strokeWidth="1" transform="rotate(15 70 38)" />
    
    {/* Legs */}
    <ellipse cx="42" cy="72" rx="6" ry="18" fill="#FFE4C4" stroke="#DEB887" strokeWidth="1" />
    <ellipse cx="58" cy="72" rx="6" ry="18" fill="#FFE4C4" stroke="#DEB887" strokeWidth="1" />
    
    {/* Clickable areas with status indicators */}
    {BODY_PARTS.map(part => {
      const status = selectedParts[part.id];
      const feeling = status ? FEELINGS.find(f => f.id === status) : null;
      
      return (
        <g key={part.id} onClick={() => onPartClick(part)} className="cursor-pointer">
          <circle
            cx={part.x}
            cy={part.y}
            r="6"
            fill={feeling ? feeling.color : 'transparent'}
            stroke={feeling ? feeling.color : '#999'}
            strokeWidth="1.5"
            strokeDasharray={feeling ? '0' : '2,2'}
            opacity={feeling ? 0.7 : 0.3}
            className="hover:opacity-100 transition-opacity"
          />
          {feeling && (
            <text
              x={part.x}
              y={part.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="6"
            >
              {feeling.emoji}
            </text>
          )}
        </g>
      );
    })}
  </svg>
);

// Body part selection modal
const BodyPartModal = ({ part, currentFeeling, onSelect, onClose }) => {
  if (!part) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#4A9FD4] text-white p-4 flex items-center gap-3">
          <span className="text-2xl">{part.emoji}</span>
          <h3 className="font-display text-xl flex-1">How does your {part.name} feel?</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Feeling Options */}
        <div className="p-4 space-y-2">
          {FEELINGS.map(feeling => (
            <button
              key={feeling.id}
              onClick={() => onSelect(part.id, feeling.id)}
              className={`w-full p-3 rounded-xl border-3 flex items-center gap-3 transition-all
                        ${currentFeeling === feeling.id 
                          ? 'border-current scale-[1.02] shadow-md' 
                          : 'border-gray-200 hover:border-gray-300'}`}
              style={{ 
                borderColor: currentFeeling === feeling.id ? feeling.color : undefined,
                backgroundColor: currentFeeling === feeling.id ? `${feeling.color}15` : undefined 
              }}
            >
              <span className="text-2xl">{feeling.emoji}</span>
              <span className="font-crayon text-gray-700">{feeling.label}</span>
              {currentFeeling === feeling.id && (
                <CheckCircle2 size={20} className="ml-auto" style={{ color: feeling.color }} />
              )}
            </button>
          ))}
          
          {/* Clear option */}
          {currentFeeling && (
            <button
              onClick={() => onSelect(part.id, null)}
              className="w-full p-2 text-gray-500 font-crayon text-sm hover:bg-gray-100 rounded-lg mt-2"
            >
              Clear selection
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// History modal
const HistoryModal = ({ history, onClose, onClear }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[80vh] overflow-hidden">
      {/* Header */}
      <div className="bg-[#8E6BBF] text-white p-4 flex items-center gap-3">
        <History size={24} />
        <h3 className="font-display text-xl flex-1">Check-In History</h3>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto max-h-[50vh]">
        {history.length === 0 ? (
          <div className="text-center py-8">
            <History size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="font-crayon text-gray-500">No check-ins yet</p>
            <p className="font-crayon text-sm text-gray-400 mt-1">
              Your body check-ins will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.slice().reverse().map((entry, index) => (
              <div 
                key={index}
                className="p-3 bg-gray-50 rounded-xl"
              >
                <p className="font-crayon text-xs text-gray-400 mb-2">
                  {new Date(entry.timestamp).toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(entry.parts).map(([partId, feelingId]) => {
                    const part = BODY_PARTS.find(p => p.id === partId);
                    const feeling = FEELINGS.find(f => f.id === feelingId);
                    if (!part || !feeling) return null;
                    return (
                      <span 
                        key={partId}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-crayon"
                        style={{ backgroundColor: `${feeling.color}20`, color: feeling.color }}
                      >
                        {part.emoji} {feeling.emoji}
                      </span>
                    );
                  })}
                </div>
                {entry.notes && (
                  <p className="font-crayon text-sm text-gray-600 mt-2 italic">
                    "{entry.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t">
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="w-full py-2 text-red-500 font-crayon text-sm hover:bg-red-50 rounded-lg mb-2"
          >
            Clear History
          </button>
        )}
        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-200 rounded-xl font-crayon text-gray-600 hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

// Main Component
const BodyCheckIn = () => {
  const navigate = useNavigate();
  
  // State
  const [selectedParts, setSelectedParts] = useState({});
  const [selectedPart, setSelectedPart] = useState(null);
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load history
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
  }, []);

  // Handle body part click
  const handlePartClick = (part) => {
    setSelectedPart(part);
  };

  // Handle feeling selection
  const handleFeelingSelect = (partId, feelingId) => {
    if (feelingId === null) {
      const newParts = { ...selectedParts };
      delete newParts[partId];
      setSelectedParts(newParts);
    } else {
      setSelectedParts(prev => ({ ...prev, [partId]: feelingId }));
    }
    setSelectedPart(null);
    setSaved(false);
  };

  // Save check-in
  const handleSave = () => {
    if (Object.keys(selectedParts).length === 0) return;

    const newEntry = {
      timestamp: new Date().toISOString(),
      parts: selectedParts,
      notes: notes.trim() || null,
    };

    const newHistory = [...history, newEntry].slice(-50); // Keep last 50
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Clear current check-in
  const handleClear = () => {
    setSelectedParts({});
    setNotes('');
    setSaved(false);
  };

  // Clear history
  const handleClearHistory = () => {
    if (confirm('Clear all body check-in history?')) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Calculate overall status
  const getOverallStatus = () => {
    const parts = Object.values(selectedParts);
    if (parts.length === 0) return null;
    
    const hasHurtsLot = parts.includes('hurts-lot');
    const hasHurts = parts.includes('hurts');
    const allGood = parts.every(p => p === 'good' || p === 'okay');
    
    if (hasHurtsLot) return { text: 'Some parts hurt a lot', icon: Frown, color: '#E63B2E' };
    if (hasHurts) return { text: 'Some parts hurt a little', icon: Meh, color: '#E86B9A' };
    if (allGood) return { text: 'Body feels okay!', icon: Smile, color: '#5CB85C' };
    return { text: 'Some parts feel different', icon: Meh, color: '#F5A623' };
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#4A9FD4]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/wellness')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#4A9FD4] 
                       rounded-xl font-display font-bold text-[#4A9FD4] hover:bg-[#4A9FD4] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#4A9FD4] crayon-text">
              🫀 Body Check-In
            </h1>
          </div>
          <button
            onClick={() => setShowInfo(true)}
            className="p-2 text-gray-400 hover:text-[#4A9FD4]"
          >
            <Info size={20} />
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className="p-2 text-gray-400 hover:text-[#8E6BBF]"
          >
            <History size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 font-crayon mb-4">
          Tap on a body part to say how it feels! 👆
        </p>

        {/* Body Diagram */}
        <div className="bg-white rounded-2xl border-3 border-gray-200 p-4 mb-4">
          <BodyOutline 
            selectedParts={selectedParts} 
            onPartClick={handlePartClick}
          />
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {FEELINGS.slice(0, 4).map(feeling => (
              <div 
                key={feeling.id}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-crayon"
                style={{ backgroundColor: `${feeling.color}20`, color: feeling.color }}
              >
                <span>{feeling.emoji}</span>
                <span>{feeling.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Body Part Buttons */}
        <div className="bg-white rounded-2xl border-3 border-gray-200 p-4 mb-4">
          <h3 className="font-display text-gray-700 mb-3">Quick Select Body Part:</h3>
          <div className="flex flex-wrap gap-2">
            {BODY_PARTS.map(part => {
              const feeling = selectedParts[part.id] 
                ? FEELINGS.find(f => f.id === selectedParts[part.id]) 
                : null;
              return (
                <button
                  key={part.id}
                  onClick={() => handlePartClick(part)}
                  className="px-3 py-2 rounded-xl border-2 font-crayon text-sm flex items-center gap-1.5 transition-all"
                  style={{
                    borderColor: feeling?.color || '#e5e7eb',
                    backgroundColor: feeling ? `${feeling.color}15` : 'white',
                  }}
                >
                  <span>{part.emoji}</span>
                  <span>{part.name}</span>
                  {feeling && <span>{feeling.emoji}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overall Status */}
        {overallStatus && (
          <div 
            className="rounded-2xl border-3 p-4 mb-4 flex items-center gap-3"
            style={{ 
              borderColor: overallStatus.color, 
              backgroundColor: `${overallStatus.color}10` 
            }}
          >
            <overallStatus.icon size={32} style={{ color: overallStatus.color }} />
            <div>
              <p className="font-display" style={{ color: overallStatus.color }}>
                {overallStatus.text}
              </p>
              <p className="font-crayon text-sm text-gray-500">
                {Object.keys(selectedParts).length} body parts checked
              </p>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="bg-white rounded-2xl border-3 border-gray-200 p-4 mb-4">
          <label className="block font-crayon text-gray-600 mb-2">
            📝 Any notes? (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tell us more about how you feel..."
            className="w-full p-3 border-2 border-gray-200 rounded-xl font-crayon resize-none
                     focus:border-[#4A9FD4] focus:outline-none"
            rows={2}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 py-3 border-3 border-gray-300 rounded-xl font-crayon text-gray-600
                     hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleSave}
            disabled={Object.keys(selectedParts).length === 0}
            className="flex-1 py-3 bg-[#5CB85C] border-3 border-green-600 rounded-xl font-display 
                     text-white flex items-center justify-center gap-2 hover:bg-green-600
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saved ? (
              <>
                <CheckCircle2 size={20} />
                Saved!
              </>
            ) : (
              <>
                <Save size={20} />
                Save Check-In
              </>
            )}
          </button>
        </div>

        {/* Helpful Tip */}
        <div className="mt-6 p-4 bg-[#4A9FD4]/10 rounded-2xl border-3 border-[#4A9FD4]/30">
          <div className="flex items-start gap-3">
            <AlertCircle size={24} className="text-[#4A9FD4] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-display text-[#4A9FD4]">Important!</h3>
              <p className="font-crayon text-sm text-gray-600 mt-1">
                If something hurts a lot or you feel very sick, tell a grown-up right away!
                This tool helps you tell others how you feel.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Body Part Modal */}
      <BodyPartModal
        part={selectedPart}
        currentFeeling={selectedPart ? selectedParts[selectedPart.id] : null}
        onSelect={handleFeelingSelect}
        onClose={() => setSelectedPart(null)}
      />

      {/* History Modal */}
      {showHistory && (
        <HistoryModal
          history={history}
          onClose={() => setShowHistory(false)}
          onClear={handleClearHistory}
        />
      )}

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-[#4A9FD4]">How to Use</h2>
              <button onClick={() => setShowInfo(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-3 font-crayon text-gray-600">
              <p><strong>1. Tap a body part:</strong> Click on the body or use the buttons below.</p>
              <p><strong>2. Say how it feels:</strong> Pick from options like "feels good" or "hurts".</p>
              <p><strong>3. Add notes:</strong> Write anything extra you want to share.</p>
              <p><strong>4. Save it:</strong> Press "Save Check-In" to remember how you felt.</p>
              <p><strong>5. Show others:</strong> Use this to help doctors or parents understand how you feel!</p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full mt-4 py-3 bg-[#4A9FD4] text-white rounded-xl font-display"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyCheckIn;
