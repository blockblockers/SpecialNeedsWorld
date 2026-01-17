// TherapyTypes.jsx - Learn about different therapy types for ATLASassist
// Educational resource explaining various therapy approaches
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Stethoscope,
  MessageCircle,
  Brain,
  Activity,
  Users,
  Music,
  Palette,
  Dog,
  Waves,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info
} from 'lucide-react';

// Therapy types data
const THERAPY_TYPES = [
  {
    id: 'speech',
    name: 'Speech-Language Therapy',
    shortName: 'Speech Therapy',
    icon: MessageCircle,
    color: '#4A9FD4',
    emoji: '🗣️',
    description: 'Helps with communication, language, and speech skills',
    whoItHelps: 'People with speech delays, articulation issues, language disorders, stuttering, or social communication challenges',
    whatToExpect: [
      'Working on sounds and pronunciation',
      'Building vocabulary and sentences',
      'Learning social communication skills',
      'Using AAC (communication devices) if needed',
      'Fun games and activities'
    ],
    abbreviation: 'SLP / Speech',
    professionals: 'Speech-Language Pathologist (SLP)',
  },
  {
    id: 'ot',
    name: 'Occupational Therapy',
    shortName: 'OT',
    icon: Activity,
    color: '#5CB85C',
    emoji: '✋',
    description: 'Helps with daily living skills, fine motor, and sensory processing',
    whoItHelps: 'People who need help with everyday tasks, sensory sensitivities, handwriting, self-care, or motor coordination',
    whatToExpect: [
      'Working on fine motor skills (writing, cutting, buttons)',
      'Sensory activities and regulation strategies',
      'Self-care skills (dressing, eating, hygiene)',
      'Play-based learning',
      'Using adaptive tools and strategies'
    ],
    abbreviation: 'OT',
    professionals: 'Occupational Therapist (OT/OTR)',
  },
  {
    id: 'pt',
    name: 'Physical Therapy',
    shortName: 'PT',
    icon: Activity,
    color: '#E63B2E',
    emoji: '🏃',
    description: 'Helps with movement, strength, balance, and gross motor skills',
    whoItHelps: 'People with motor delays, balance issues, muscle weakness, coordination challenges, or mobility needs',
    whatToExpect: [
      'Exercises for strength and flexibility',
      'Balance and coordination activities',
      'Walking and movement training',
      'Using adaptive equipment if needed',
      'Fun movement games'
    ],
    abbreviation: 'PT',
    professionals: 'Physical Therapist (PT/DPT)',
  },
  {
    id: 'aba',
    name: 'Applied Behavior Analysis',
    shortName: 'ABA',
    icon: Brain,
    color: '#8E6BBF',
    emoji: '🧩',
    description: 'Uses positive reinforcement to teach skills and reduce challenging behaviors',
    whoItHelps: 'Often used for autistic individuals to build communication, social, and daily living skills',
    whatToExpect: [
      'Breaking skills into small steps',
      'Positive reinforcement and rewards',
      'Data collection to track progress',
      'Working on specific goals',
      'Parent and caregiver training'
    ],
    abbreviation: 'ABA',
    professionals: 'Board Certified Behavior Analyst (BCBA), Registered Behavior Technician (RBT)',
    note: 'Note: There are different approaches within ABA. Discuss with providers to find one that respects neurodiversity.',
  },
  {
    id: 'counseling',
    name: 'Counseling / Talk Therapy',
    shortName: 'Counseling',
    icon: Users,
    color: '#E86B9A',
    emoji: '💬',
    description: 'Talking with a trained professional about feelings, thoughts, and behaviors',
    whoItHelps: 'People experiencing anxiety, depression, trauma, life changes, or who want support with emotions',
    whatToExpect: [
      'Talking in a safe, private space',
      'Learning coping strategies',
      'Understanding feelings better',
      'Setting and working toward goals',
      'Play therapy for younger children'
    ],
    abbreviation: 'Therapy / Counseling',
    professionals: 'Psychologist, Licensed Counselor (LPC), Social Worker (LCSW), Therapist',
  },
  {
    id: 'music',
    name: 'Music Therapy',
    shortName: 'Music Therapy',
    icon: Music,
    color: '#F5A623',
    emoji: '🎵',
    description: 'Uses music to address physical, emotional, cognitive, and social needs',
    whoItHelps: 'People who respond well to music, need help with communication, emotional expression, or motor skills',
    whatToExpect: [
      'Singing songs and making music',
      'Playing instruments',
      'Movement to music',
      'Songwriting and music listening',
      'Using music for relaxation'
    ],
    abbreviation: 'MT',
    professionals: 'Board Certified Music Therapist (MT-BC)',
  },
  {
    id: 'art',
    name: 'Art Therapy',
    shortName: 'Art Therapy',
    icon: Palette,
    color: '#20B2AA',
    emoji: '🎨',
    description: 'Uses creative art-making to improve mental health and well-being',
    whoItHelps: 'People who benefit from non-verbal expression, trauma survivors, those with anxiety or emotional challenges',
    whatToExpect: [
      'Drawing, painting, and sculpting',
      'Expressing feelings through art',
      'No art skills needed!',
      'Processing experiences creatively',
      'Building self-esteem'
    ],
    abbreviation: 'AT',
    professionals: 'Art Therapist (ATR)',
  },
  {
    id: 'animal',
    name: 'Animal-Assisted Therapy',
    shortName: 'Animal Therapy',
    icon: Dog,
    color: '#8B4513',
    emoji: '🐕',
    description: 'Uses animals (often dogs or horses) as part of treatment',
    whoItHelps: 'People who connect with animals, need help with social skills, anxiety, or motor skills',
    whatToExpect: [
      'Interacting with trained therapy animals',
      'Horseback riding (hippotherapy)',
      'Caring for animals',
      'Building confidence and trust',
      'Calming and sensory benefits'
    ],
    abbreviation: 'AAT / Hippotherapy',
    professionals: 'Various therapists trained in animal-assisted interventions',
  },
  {
    id: 'aquatic',
    name: 'Aquatic Therapy',
    shortName: 'Aquatic Therapy',
    icon: Waves,
    color: '#00CED1',
    emoji: '🏊',
    description: 'Physical or occupational therapy in a warm water pool',
    whoItHelps: 'People who benefit from water\'s support for movement, sensory seekers, or those with muscle/joint issues',
    whatToExpect: [
      'Exercises in warm water',
      'Water provides support and resistance',
      'Fun pool activities',
      'Improved range of motion',
      'Sensory benefits of water'
    ],
    abbreviation: 'Aquatic PT/OT',
    professionals: 'Physical or Occupational Therapist with aquatic certification',
  },
];

// Therapy card component
const TherapyCard = ({ therapy, isExpanded, onToggle }) => {
  const IconComponent = therapy.icon;
  
  return (
    <div 
      className="bg-white rounded-2xl border-4 overflow-hidden shadow-crayon transition-all"
      style={{ borderColor: therapy.color }}
    >
      {/* Header - always visible */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
          style={{ backgroundColor: therapy.color }}
        >
          <span className="text-2xl">{therapy.emoji}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-display text-gray-800">{therapy.name}</h3>
          <p className="font-crayon text-sm text-gray-500">{therapy.abbreviation}</p>
        </div>
        {isExpanded ? (
          <ChevronUp size={24} className="text-gray-400" />
        ) : (
          <ChevronDown size={24} className="text-gray-400" />
        )}
      </button>
      
      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Description */}
          <p className="font-crayon text-gray-600 p-3 rounded-xl" style={{ backgroundColor: therapy.color + '15' }}>
            {therapy.description}
          </p>
          
          {/* Who it helps */}
          <div>
            <h4 className="font-display text-sm text-gray-700 mb-1">Who It Helps:</h4>
            <p className="font-crayon text-sm text-gray-600">{therapy.whoItHelps}</p>
          </div>
          
          {/* What to expect */}
          <div>
            <h4 className="font-display text-sm text-gray-700 mb-2">What to Expect:</h4>
            <ul className="space-y-1">
              {therapy.whatToExpect.map((item, i) => (
                <li key={i} className="flex items-start gap-2 font-crayon text-sm text-gray-600">
                  <span style={{ color: therapy.color }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Professional */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <h4 className="font-display text-xs text-gray-500 mb-1">Provided By:</h4>
            <p className="font-crayon text-sm text-gray-700">{therapy.professionals}</p>
          </div>
          
          {/* Note if exists */}
          {therapy.note && (
            <div className="p-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl flex gap-2">
              <Info size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="font-crayon text-xs text-yellow-700">{therapy.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TherapyTypes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  
  // Filter therapies based on search
  const filteredTherapies = THERAPY_TYPES.filter(therapy => 
    therapy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    therapy.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    therapy.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    therapy.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E86B9A]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/resources')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E86B9A] 
                       rounded-xl font-display font-bold text-[#E86B9A] hover:bg-[#E86B9A] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img 
            src="/logo.jpeg" 
            alt="ATLASassist" 
            className="w-10 h-10 rounded-lg shadow-sm"
          />
          <h1 className="text-lg sm:text-xl font-display text-[#E86B9A] crayon-text flex items-center gap-2">
            <Stethoscope size={22} />
            Therapy Types
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Intro */}
        <p className="text-center text-gray-600 font-crayon mb-6">
          Learn about different types of therapy and what to expect
        </p>
        
        {/* Search */}
        <div className="relative mb-6">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search therapies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-3 border-gray-200 
                     font-crayon focus:border-[#E86B9A] focus:outline-none"
          />
        </div>
        
        {/* Therapy List */}
        <div className="space-y-3">
          {filteredTherapies.map(therapy => (
            <TherapyCard
              key={therapy.id}
              therapy={therapy}
              isExpanded={expandedId === therapy.id}
              onToggle={() => setExpandedId(expandedId === therapy.id ? null : therapy.id)}
            />
          ))}
        </div>
        
        {filteredTherapies.length === 0 && (
          <div className="text-center py-8">
            <p className="font-crayon text-gray-500">No therapies found matching "{searchQuery}"</p>
          </div>
        )}
        
        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div className="flex gap-2">
            <Info size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="font-crayon text-xs text-gray-500">
              This information is for educational purposes only and is not medical advice. 
              Always consult with qualified healthcare professionals to determine the best 
              therapies for your specific needs.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TherapyTypes;
