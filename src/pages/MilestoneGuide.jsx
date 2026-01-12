// MilestoneGuide.jsx - Developmental milestones by age range
// Based on CDC, AAP, ASHA, and other professional association guidelines
// NOT a diagnostic tool - for informational purposes only

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Baby,
  Brain,
  MessageCircle,
  Users,
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
  ExternalLink
} from 'lucide-react';

// Developmental domains
const DOMAINS = [
  { 
    id: 'motor', 
    name: 'Motor Skills', 
    icon: Activity, 
    color: 'bg-blue-100 border-blue-400 text-blue-700',
    description: 'Gross and fine motor development'
  },
  { 
    id: 'speech', 
    name: 'Speech & Language', 
    icon: MessageCircle, 
    color: 'bg-green-100 border-green-400 text-green-700',
    description: 'Communication and language skills'
  },
  { 
    id: 'social', 
    name: 'Social & Emotional', 
    icon: Users, 
    color: 'bg-pink-100 border-pink-400 text-pink-700',
    description: 'Social interaction and emotional regulation'
  },
  { 
    id: 'cognitive', 
    name: 'Cognitive', 
    icon: Brain, 
    color: 'bg-purple-100 border-purple-400 text-purple-700',
    description: 'Thinking, learning, and problem-solving'
  },
];

// Age ranges with milestones
const AGE_RANGES = [
  {
    id: '0-3m',
    label: '0-3 Months',
    emoji: '👶',
    milestones: {
      motor: [
        'Raises head and chest when on tummy',
        'Opens and shuts hands',
        'Brings hands to mouth',
        'Pushes down with legs when feet on firm surface',
        'Stretches and kicks legs',
      ],
      speech: [
        'Coos and makes gurgling sounds',
        'Turns head toward sounds',
        'Smiles at the sound of parent\'s voice',
        'Has different cries for different needs',
      ],
      social: [
        'Begins to develop a social smile',
        'Enjoys playing with people',
        'Can briefly calm self (brings hands to mouth)',
        'Makes eye contact',
      ],
      cognitive: [
        'Pays attention to faces',
        'Follows moving objects with eyes',
        'Recognizes familiar people at a distance',
        'Begins to act bored if activity doesn\'t change',
      ],
    },
    redFlags: [
      'Doesn\'t respond to loud sounds',
      'Doesn\'t watch things as they move',
      'Doesn\'t smile at people',
      'Doesn\'t bring hands to mouth',
      'Can\'t hold head up when pushing up on tummy',
    ],
  },
  {
    id: '4-6m',
    label: '4-6 Months',
    emoji: '🧒',
    milestones: {
      motor: [
        'Rolls over in both directions',
        'Begins to sit without support',
        'Supports weight on legs and might bounce',
        'Rocks back and forth, may crawl backward',
        'Brings objects to mouth',
      ],
      speech: [
        'Responds to own name',
        'Babbles with expression (strings of consonant sounds)',
        'Makes sounds to show joy and displeasure',
        'Responds to "no"',
      ],
      social: [
        'Knows familiar faces vs. strangers',
        'Likes to play with others, especially parents',
        'Responds to other people\'s emotions',
        'Likes to look at self in mirror',
      ],
      cognitive: [
        'Looks around at nearby things',
        'Brings things to mouth',
        'Shows curiosity and tries to get things out of reach',
        'Begins to pass things from one hand to another',
      ],
    },
    redFlags: [
      'Doesn\'t try to get things within reach',
      'Shows no affection for caregivers',
      'Doesn\'t respond to sounds around them',
      'Has difficulty getting things to mouth',
      'Doesn\'t make vowel sounds',
      'Doesn\'t roll over in either direction',
      'Seems very stiff or floppy',
    ],
  },
  {
    id: '7-12m',
    label: '7-12 Months',
    emoji: '👧',
    milestones: {
      motor: [
        'Gets to sitting position without help',
        'Crawls',
        'Pulls to stand, walks holding on to furniture',
        'May stand alone or take a few steps',
        'Uses pincer grasp (thumb and finger)',
      ],
      speech: [
        'Understands "no"',
        'Makes a lot of different sounds (babbling)',
        'Copies sounds and gestures',
        'Uses simple gestures like shaking head',
        'Says "mama" and "dada" meaningfully',
      ],
      social: [
        'May be shy or nervous with strangers',
        'Has favorite toys',
        'Shows fear in some situations',
        'Repeats sounds or actions to get attention',
        'Puts out arm or leg to help with dressing',
      ],
      cognitive: [
        'Explores things in different ways',
        'Finds hidden things easily',
        'Looks at correct picture when named',
        'Copies gestures',
        'Starts to use things correctly (phone, cup)',
        'Bangs two things together',
      ],
    },
    redFlags: [
      'Doesn\'t crawl',
      'Can\'t stand when supported',
      'Doesn\'t search for things hidden while watching',
      'Doesn\'t say single words like "mama"',
      'Doesn\'t learn gestures like waving',
      'Doesn\'t point to things',
      'Loses skills they once had',
    ],
  },
  {
    id: '12-18m',
    label: '12-18 Months',
    emoji: '🚶',
    milestones: {
      motor: [
        'Walks alone',
        'May walk up steps and run',
        'Pulls toys while walking',
        'Helps undress self',
        'Drinks from cup and eats with spoon',
        'Scribbles on own',
      ],
      speech: [
        'Says several single words',
        'Points to show what they want',
        'Says "no" and shakes head',
        'Points to one body part',
        'Follows simple commands without gestures',
      ],
      social: [
        'Hands you a book to read',
        'Shows affection to familiar people',
        'Has temper tantrums',
        'May be afraid of strangers',
        'Points to show others something interesting',
      ],
      cognitive: [
        'Knows what ordinary things are for (phone, brush)',
        'Points to get attention of others',
        'Shows interest in a doll or stuffed animal by pretending to feed',
        'Explores things in different ways',
        'Follows 1-step verbal commands',
      ],
    },
    redFlags: [
      'Doesn\'t point to show things to others',
      'Can\'t walk',
      'Doesn\'t know what familiar things are for',
      'Doesn\'t copy others',
      'Doesn\'t gain new words',
      'Doesn\'t have at least 6 words',
      'Doesn\'t notice or mind when caregiver leaves/returns',
      'Loses skills they once had',
    ],
  },
  {
    id: '18-24m',
    label: '18-24 Months',
    emoji: '👦',
    milestones: {
      motor: [
        'Runs',
        'Kicks a ball',
        'Climbs onto and down from furniture',
        'Walks up and down stairs holding on',
        'Throws ball overhand',
        'Makes or copies lines and circles',
      ],
      speech: [
        'Points to things in a book when asked',
        'Says sentences with 2-4 words',
        'Follows simple instructions',
        'Repeats words overheard',
        'Points to things when named',
        'Knows names of familiar people and body parts',
      ],
      social: [
        'Copies others, especially adults and older children',
        'Gets excited around other children',
        'Shows more independence',
        'Does what they were told not to do (testing limits)',
        'Plays mainly beside other children',
      ],
      cognitive: [
        'Finds things hidden under 2-3 covers',
        'Begins to sort shapes and colors',
        'Completes sentences in familiar books',
        'Plays simple make-believe games',
        'Builds towers of 4+ blocks',
        'Might use one hand more than other',
      ],
    },
    redFlags: [
      'Doesn\'t use 2-word phrases',
      'Doesn\'t know what to do with common things',
      'Doesn\'t copy actions and words',
      'Doesn\'t follow simple instructions',
      'Doesn\'t walk steadily',
      'Loses skills they once had',
    ],
  },
  {
    id: '2-3y',
    label: '2-3 Years',
    emoji: '🧒',
    milestones: {
      motor: [
        'Climbs well',
        'Runs easily',
        'Pedals a tricycle',
        'Walks up and down stairs, one foot per step',
        'Screws and unscrews jar lids',
        'Turns pages one at a time',
      ],
      speech: [
        'Follows 2-3 step instructions',
        'Can name most familiar things',
        'Understands words like "in," "on," and "under"',
        'Says first name, age, and gender',
        'Names a friend',
        'Says words like "I," "me," "we," "you"',
        'Talks well enough for strangers to understand most of the time',
        'Carries on conversation using 2-3 sentences',
      ],
      social: [
        'Copies adults and friends',
        'Shows affection without prompting',
        'Takes turns in games',
        'Shows concern for crying friend',
        'Dresses and undresses self',
        'Understands "mine," "his," "hers"',
        'Shows wide range of emotions',
        'Separates easily from parents',
      ],
      cognitive: [
        'Can work toys with buttons, levers, and moving parts',
        'Plays make-believe with dolls, animals, people',
        'Does puzzles with 3-4 pieces',
        'Understands what "two" means',
        'Copies a circle with pencil',
        'Turns book pages one at a time',
        'Builds towers of 6+ blocks',
        'Screws and unscrews jar lids',
      ],
    },
    redFlags: [
      'Falls down a lot or has trouble with stairs',
      'Drools or has very unclear speech',
      'Can\'t work simple toys',
      'Doesn\'t speak in sentences',
      'Doesn\'t understand simple instructions',
      'Doesn\'t play pretend or make-believe',
      'Doesn\'t want to play with other children or toys',
      'Doesn\'t make eye contact',
      'Loses skills they once had',
    ],
  },
  {
    id: '3-4y',
    label: '3-4 Years',
    emoji: '👧',
    milestones: {
      motor: [
        'Hops and stands on one foot up to 2 seconds',
        'Catches a bounced ball most of the time',
        'Pours, cuts with supervision, mashes own food',
        'Draws a person with 2-4 body parts',
        'Uses scissors',
        'Starts to copy some capital letters',
      ],
      speech: [
        'Knows some basic rules of grammar',
        'Sings a song or says a poem from memory',
        'Tells stories',
        'Can say first and last name',
        'Speaks clearly enough that even strangers understand',
      ],
      social: [
        'Enjoys doing new things',
        'Plays "Mom" and "Dad"',
        'More creative with make-believe play',
        'Would rather play with others than alone',
        'Cooperates with other children',
        'Often can\'t tell what\'s real vs. make-believe',
        'Talks about likes and interests',
      ],
      cognitive: [
        'Names some colors and numbers',
        'Understands counting',
        'Starts to understand time',
        'Remembers parts of a story',
        'Understands "same" and "different"',
        'Draws a person with 2-4 body parts',
        'Uses scissors',
        'Plays board or card games',
        'Tells you what they think is going to happen next in a book',
      ],
    },
    redFlags: [
      'Can\'t jump in place',
      'Has trouble scribbling',
      'Shows no interest in interactive games or make-believe',
      'Ignores other children or doesn\'t respond to non-family members',
      'Resists dressing, sleeping, using toilet',
      'Can\'t retell a favorite story',
      'Doesn\'t follow 3-part commands',
      'Doesn\'t understand "same" and "different"',
      'Doesn\'t use "me" and "you" correctly',
      'Speaks unclearly',
      'Loses skills they once had',
    ],
  },
  {
    id: '4-5y',
    label: '4-5 Years',
    emoji: '🧒',
    milestones: {
      motor: [
        'Stands on one foot for 10+ seconds',
        'Hops, may skip',
        'Can do somersaults',
        'Uses fork and spoon, sometimes knife',
        'Can use toilet on own',
        'Swings and climbs',
        'Prints some letters',
        'Draws person with body',
      ],
      speech: [
        'Speaks very clearly',
        'Tells a simple story using full sentences',
        'Uses future tense',
        'Says name and address',
        'Answers simple questions about a story',
      ],
      social: [
        'Wants to please friends',
        'Wants to be like friends',
        'More likely to agree with rules',
        'Likes to sing, dance, act',
        'Shows concern and sympathy',
        'Is aware of gender',
        'Can tell what\'s real vs. make-believe',
        'Shows more independence',
      ],
      cognitive: [
        'Counts 10 or more things',
        'Can draw a person with at least 6 body parts',
        'Can print some letters or numbers',
        'Copies a triangle and other shapes',
        'Knows about everyday things (money, food)',
        'Draws pictures',
      ],
    },
    redFlags: [
      'Doesn\'t show a wide range of emotions',
      'Shows extreme behavior',
      'Unusually withdrawn or not active',
      'Easily distracted, trouble focusing on one activity',
      'Doesn\'t respond to people or responds superficially',
      'Can\'t tell what\'s real vs. make-believe',
      'Doesn\'t play variety of games',
      'Can\'t give first and last name',
      'Doesn\'t talk about daily activities',
      'Loses skills they once had',
    ],
  },
];

// Resources
const RESOURCES = [
  { 
    name: 'CDC Developmental Milestones', 
    url: 'https://www.cdc.gov/ncbddd/actearly/milestones/index.html',
    description: 'Official CDC milestone tracker and resources'
  },
  { 
    name: 'AAP Healthy Children', 
    url: 'https://www.healthychildren.org/English/ages-stages/Pages/default.aspx',
    description: 'American Academy of Pediatrics developmental guidance'
  },
  { 
    name: 'ASHA Developmental Milestones', 
    url: 'https://www.asha.org/public/speech/development/',
    description: 'Speech and language milestones from ASHA'
  },
  { 
    name: 'Zero to Three', 
    url: 'https://www.zerotothree.org/early-development/',
    description: 'Early childhood development resources'
  },
];

const MilestoneGuide = () => {
  const navigate = useNavigate();
  const [selectedAge, setSelectedAge] = useState(null);
  const [expandedDomains, setExpandedDomains] = useState({});
  const [showRedFlags, setShowRedFlags] = useState({});

  // Toggle domain expansion
  const toggleDomain = (ageId, domainId) => {
    const key = `${ageId}-${domainId}`;
    setExpandedDomains(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Toggle red flags
  const toggleRedFlags = (ageId) => {
    setShowRedFlags(prev => ({
      ...prev,
      [ageId]: !prev[ageId]
    }));
  };

  // Age selection screen
  if (!selectedAge) {
    return (
      <div className="min-h-screen bg-[#FFFEF5]">
        <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F8D14A]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/tools')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F8D14A] 
                         rounded-xl font-display font-bold text-[#F8D14A] hover:bg-[#F8D14A] 
                         hover:text-white transition-all shadow-md"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-display text-[#F8D14A] crayon-text">
                📊 Milestone Guide
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Disclaimer */}
          <div className="mb-6 p-4 bg-blue-50 rounded-2xl border-3 border-blue-300">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-crayon text-blue-800 text-sm">
                  <strong>Important:</strong> This guide provides general developmental milestones 
                  based on CDC, AAP, and ASHA guidelines. It is <strong>not</strong> a diagnostic tool. 
                  Every child develops at their own pace. If you have concerns, please consult your 
                  pediatrician or developmental specialist.
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-600 font-crayon mb-6">
            Select an age range to see typical milestones:
          </p>

          {/* Age Selection Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {AGE_RANGES.map((age) => (
              <button
                key={age.id}
                onClick={() => setSelectedAge(age)}
                className="bg-white rounded-2xl border-4 border-[#F8D14A] p-4 shadow-crayon
                           hover:scale-105 hover:-rotate-1 transition-all text-center"
              >
                <div className="text-4xl mb-2">{age.emoji}</div>
                <h3 className="font-display text-gray-800 text-sm">{age.label}</h3>
              </button>
            ))}
          </div>

          {/* Domain Legend */}
          <div className="mb-6">
            <h2 className="font-display text-gray-700 mb-3">Developmental Areas:</h2>
            <div className="grid grid-cols-2 gap-2">
              {DOMAINS.map(domain => {
                const IconComponent = domain.icon;
                return (
                  <div 
                    key={domain.id}
                    className={`p-3 rounded-xl border-2 ${domain.color}`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent size={18} />
                      <span className="font-crayon text-sm">{domain.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-2xl border-3 border-gray-300 p-4">
            <h2 className="font-display text-gray-700 mb-3 flex items-center gap-2">
              <ExternalLink size={18} />
              Professional Resources
            </h2>
            <div className="space-y-3">
              {RESOURCES.map(resource => (
                <a
                  key={resource.name}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <span className="font-crayon text-blue-600">{resource.name}</span>
                  <span className="block text-xs text-gray-500 font-crayon mt-1">
                    {resource.description}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Milestone detail screen
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#F8D14A]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSelectedAge(null)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#F8D14A] 
                       rounded-xl font-display font-bold text-[#F8D14A] hover:bg-[#F8D14A] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Ages
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#F8D14A] crayon-text">
              {selectedAge.emoji} {selectedAge.label}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Reminder */}
        <p className="text-center text-gray-500 font-crayon text-sm mb-6 italic">
          Remember: Every child develops at their own pace. These are general guidelines.
        </p>

        {/* Milestones by Domain */}
        <div className="space-y-4 mb-6">
          {DOMAINS.map(domain => {
            const IconComponent = domain.icon;
            const milestones = selectedAge.milestones[domain.id];
            const isExpanded = expandedDomains[`${selectedAge.id}-${domain.id}`] !== false;
            
            return (
              <div 
                key={domain.id}
                className={`rounded-2xl border-3 overflow-hidden ${domain.color}`}
              >
                <button
                  onClick={() => toggleDomain(selectedAge.id, domain.id)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <IconComponent size={24} />
                    <div>
                      <h3 className="font-display">{domain.name}</h3>
                      <p className="text-xs opacity-75 font-crayon">{domain.description}</p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                {isExpanded && (
                  <div className="px-4 pb-4">
                    <ul className="space-y-2">
                      {milestones.map((milestone, index) => (
                        <li 
                          key={index}
                          className="flex items-start gap-2 bg-white/50 rounded-lg p-2"
                        >
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span className="font-crayon text-gray-700 text-sm">{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Red Flags Section */}
        <div className="bg-red-50 rounded-2xl border-3 border-red-300 overflow-hidden">
          <button
            onClick={() => toggleRedFlags(selectedAge.id)}
            className="w-full p-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3 text-red-700">
              <AlertTriangle size={24} />
              <div>
                <h3 className="font-display">When to Talk to Your Doctor</h3>
                <p className="text-xs opacity-75 font-crayon">
                  Signs that may warrant professional evaluation
                </p>
              </div>
            </div>
            {showRedFlags[selectedAge.id] ? <ChevronUp size={20} className="text-red-700" /> : <ChevronDown size={20} className="text-red-700" />}
          </button>
          
          {showRedFlags[selectedAge.id] && (
            <div className="px-4 pb-4">
              <ul className="space-y-2">
                {selectedAge.redFlags.map((flag, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-2 bg-white/50 rounded-lg p-2"
                  >
                    <span className="text-red-500 mt-0.5">⚠️</span>
                    <span className="font-crayon text-red-800 text-sm">{flag}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-red-600 font-crayon italic">
                If you notice any of these signs, contact your pediatrician or call your state's 
                Early Intervention program. Early support makes a difference!
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              const currentIndex = AGE_RANGES.findIndex(a => a.id === selectedAge.id);
              if (currentIndex > 0) {
                setSelectedAge(AGE_RANGES[currentIndex - 1]);
                setExpandedDomains({});
                setShowRedFlags({});
              }
            }}
            disabled={AGE_RANGES.findIndex(a => a.id === selectedAge.id) === 0}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl border-3 border-gray-300
                     font-crayon disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-gray-200 transition-colors"
          >
            ← Younger
          </button>
          <button
            onClick={() => {
              const currentIndex = AGE_RANGES.findIndex(a => a.id === selectedAge.id);
              if (currentIndex < AGE_RANGES.length - 1) {
                setSelectedAge(AGE_RANGES[currentIndex + 1]);
                setExpandedDomains({});
                setShowRedFlags({});
              }
            }}
            disabled={AGE_RANGES.findIndex(a => a.id === selectedAge.id) === AGE_RANGES.length - 1}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl border-3 border-gray-300
                     font-crayon disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-gray-200 transition-colors"
          >
            Older →
          </button>
        </div>
      </main>
    </div>
  );
};

export default MilestoneGuide;
