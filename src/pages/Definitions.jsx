// FIXED: Back button is context-aware - goes to category list if in category, /resources if not
// Definitions.jsx - Common terms and definitions for ATLASassist
// Educational resource explaining terminology used in special needs community
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookMarked,
  Search,
  ChevronDown,
  ChevronUp,
  Info,
  Hash
} from 'lucide-react';

// Definitions organized by category
const DEFINITIONS = {
  education: {
    name: 'Education & School',
    color: '#4A9FD4',
    emoji: '🏫',
    terms: [
      {
        term: 'IEP',
        fullName: 'Individualized Education Program',
        definition: 'A legal document that outlines special education services, goals, and accommodations for a student with disabilities in public school.',
        example: 'An IEP might include speech therapy twice a week and extended time on tests.',
      },
      {
        term: '504 Plan',
        fullName: 'Section 504 Plan',
        definition: 'A plan that provides accommodations and modifications for students with disabilities who may not qualify for an IEP but still need support.',
        example: 'A 504 plan might allow a student to sit near the front of class or use a fidget tool.',
      },
      {
        term: 'LRE',
        fullName: 'Least Restrictive Environment',
        definition: 'The requirement that students with disabilities be educated with non-disabled peers to the maximum extent appropriate.',
        example: 'A student might spend most of the day in general education with support, rather than a separate classroom.',
      },
      {
        term: 'FAPE',
        fullName: 'Free Appropriate Public Education',
        definition: 'The right of every child with a disability to receive a free education that meets their unique needs.',
        example: 'Schools must provide necessary services at no cost to families.',
      },
      {
        term: 'Related Services',
        fullName: 'Related Services',
        definition: 'Support services that help a student benefit from special education, like speech therapy, OT, PT, or counseling.',
        example: 'A student\'s IEP might include occupational therapy as a related service.',
      },
      {
        term: 'Mainstreaming',
        fullName: 'Mainstreaming / Inclusion',
        definition: 'The practice of educating students with disabilities in general education classrooms with appropriate support.',
        example: 'A student with autism might be mainstreamed for math and reading with a paraprofessional.',
      },
      {
        term: 'Paraprofessional',
        fullName: 'Paraprofessional / Aide',
        definition: 'A trained assistant who works under a teacher\'s supervision to support students, especially those with special needs.',
        example: 'A one-on-one aide might help a student stay on task and manage transitions.',
      },
      {
        term: 'Transition Planning',
        fullName: 'Transition Planning',
        definition: 'Planning that begins by age 16 (or earlier) to prepare students for life after high school, including work, college, or independent living.',
        example: 'Transition goals might include job skills training or learning to use public transportation.',
      },
    ],
  },
  medical: {
    name: 'Medical & Diagnosis',
    color: '#E86B9A',
    emoji: '🏥',
    terms: [
      {
        term: 'ASD',
        fullName: 'Autism Spectrum Disorder',
        definition: 'A developmental condition affecting communication, behavior, and social interaction. It\'s called a "spectrum" because it affects everyone differently.',
        example: 'Some autistic people may be non-speaking while others are highly verbal.',
      },
      {
        term: 'ADHD',
        fullName: 'Attention-Deficit/Hyperactivity Disorder',
        definition: 'A neurodevelopmental condition affecting attention, impulse control, and activity level.',
        example: 'ADHD might look like difficulty focusing, fidgeting, or acting without thinking.',
      },
      {
        term: 'ID',
        fullName: 'Intellectual Disability',
        definition: 'A condition characterized by significant limitations in intellectual functioning and adaptive behavior.',
        example: 'A person with ID might need extra support with daily living skills.',
      },
      {
        term: 'DD',
        fullName: 'Developmental Delay',
        definition: 'When a child doesn\'t reach developmental milestones at expected times. May be in one or more areas.',
        example: 'A toddler might have a speech delay if they\'re not using words by 18 months.',
      },
      {
        term: 'Comorbidity',
        fullName: 'Comorbidity',
        definition: 'Having two or more conditions at the same time.',
        example: 'Many people with autism also have ADHD - these are comorbid conditions.',
      },
      {
        term: 'SPD',
        fullName: 'Sensory Processing Disorder',
        definition: 'Difficulty receiving and responding to sensory information (sounds, textures, lights, etc.).',
        example: 'A child with SPD might cover their ears in loud environments or avoid certain food textures.',
      },
      {
        term: 'Dyslexia',
        fullName: 'Dyslexia',
        definition: 'A learning difference that affects reading, writing, and spelling. Not related to intelligence.',
        example: 'A person with dyslexia might reverse letters or have difficulty sounding out words.',
      },
      {
        term: 'Apraxia',
        fullName: 'Apraxia of Speech',
        definition: 'A motor speech disorder where the brain has difficulty coordinating the muscle movements needed for speech.',
        example: 'A child with apraxia knows what they want to say but has trouble getting the words out correctly.',
      },
    ],
  },
  therapy: {
    name: 'Therapy & Services',
    color: '#5CB85C',
    emoji: '🩺',
    terms: [
      {
        term: 'OT',
        fullName: 'Occupational Therapy',
        definition: 'Therapy that helps with daily living skills, fine motor skills, and sensory processing.',
        example: 'OT might work on handwriting, using utensils, or managing sensory sensitivities.',
      },
      {
        term: 'PT',
        fullName: 'Physical Therapy',
        definition: 'Therapy that helps with movement, strength, balance, and gross motor skills.',
        example: 'PT might help a child learn to walk, climb stairs, or improve coordination.',
      },
      {
        term: 'SLP',
        fullName: 'Speech-Language Pathologist',
        definition: 'A professional who helps with speech, language, communication, and swallowing.',
        example: 'An SLP might help with pronunciation, building sentences, or using AAC devices.',
      },
      {
        term: 'ABA',
        fullName: 'Applied Behavior Analysis',
        definition: 'A therapy approach that uses positive reinforcement to teach skills and reduce challenging behaviors.',
        example: 'ABA might break down a skill like hand-washing into small, teachable steps.',
      },
      {
        term: 'BCBA',
        fullName: 'Board Certified Behavior Analyst',
        definition: 'A professional certified to design and supervise ABA therapy programs.',
        example: 'A BCBA creates the treatment plan that behavior technicians follow.',
      },
      {
        term: 'Early Intervention',
        fullName: 'Early Intervention (EI)',
        definition: 'Services for infants and toddlers (birth to 3) with developmental delays or disabilities.',
        example: 'Early intervention might include in-home therapy visits before a child starts school.',
      },
      {
        term: 'Respite Care',
        fullName: 'Respite Care',
        definition: 'Short-term care that gives family caregivers a break while their loved one is cared for by someone else.',
        example: 'A respite provider might care for a child for a few hours so parents can rest.',
      },
    ],
  },
  communication: {
    name: 'Communication',
    color: '#F5A623',
    emoji: '💬',
    terms: [
      {
        term: 'AAC',
        fullName: 'Augmentative and Alternative Communication',
        definition: 'Tools and strategies that help people communicate when speech is difficult. Can be low-tech (pictures) or high-tech (devices).',
        example: 'AAC includes picture boards, sign language, and tablet-based communication apps.',
      },
      {
        term: 'Non-speaking',
        fullName: 'Non-speaking / Non-verbal',
        definition: 'A person who does not use spoken words to communicate. Many non-speaking people communicate in other ways.',
        example: 'A non-speaking person might use AAC, sign language, or typing to communicate.',
      },
      {
        term: 'Echolalia',
        fullName: 'Echolalia',
        definition: 'Repeating words or phrases heard from others. Can be immediate or delayed. Often serves a communication purpose.',
        example: 'A child might repeat "want juice?" when they\'re thirsty - this is meaningful communication.',
      },
      {
        term: 'Pragmatic Language',
        fullName: 'Pragmatic Language / Social Communication',
        definition: 'The social use of language - knowing what to say, how to say it, and when to say it.',
        example: 'Pragmatic skills include taking turns in conversation and understanding sarcasm.',
      },
      {
        term: 'Receptive Language',
        fullName: 'Receptive Language',
        definition: 'The ability to understand language that is heard or read.',
        example: 'Following directions uses receptive language skills.',
      },
      {
        term: 'Expressive Language',
        fullName: 'Expressive Language',
        definition: 'The ability to use words, sentences, and gestures to communicate thoughts and needs.',
        example: 'Telling a story or asking for help uses expressive language.',
      },
    ],
  },
  behavior: {
    name: 'Behavior & Regulation',
    color: '#8E6BBF',
    emoji: '🧠',
    terms: [
      {
        term: 'Stimming',
        fullName: 'Self-Stimulatory Behavior (Stimming)',
        definition: 'Repetitive movements or sounds that help regulate sensory input and emotions. Natural and often helpful.',
        example: 'Hand flapping, rocking, humming, or spinning are common stims.',
      },
      {
        term: 'Meltdown',
        fullName: 'Meltdown',
        definition: 'An intense response to overwhelming situations. Not a tantrum - the person has lost control due to overload.',
        example: 'A meltdown might happen after too much sensory input or a sudden change in routine.',
      },
      {
        term: 'Shutdown',
        fullName: 'Shutdown',
        definition: 'A response to overwhelm where a person becomes very quiet, still, or withdraws.',
        example: 'During a shutdown, a person might stop responding or need to be alone in a quiet space.',
      },
      {
        term: 'Executive Function',
        fullName: 'Executive Function',
        definition: 'Mental skills used for planning, organizing, time management, and self-control.',
        example: 'Executive function challenges might make it hard to start tasks or manage time.',
      },
      {
        term: 'Self-Regulation',
        fullName: 'Self-Regulation',
        definition: 'The ability to manage emotions, behavior, and body in different situations.',
        example: 'Using deep breaths to calm down is a self-regulation strategy.',
      },
      {
        term: 'Sensory Overload',
        fullName: 'Sensory Overload',
        definition: 'When the brain receives more sensory input than it can process, leading to distress.',
        example: 'A crowded, noisy store might cause sensory overload.',
      },
      {
        term: 'Masking',
        fullName: 'Masking / Camouflaging',
        definition: 'Hiding natural behaviors to appear more neurotypical. Can be exhausting over time.',
        example: 'Forcing eye contact or suppressing stims to fit in are forms of masking.',
      },
    ],
  },
  legal: {
    name: 'Legal & Rights',
    color: '#20B2AA',
    emoji: '⚖️',
    terms: [
      {
        term: 'IDEA',
        fullName: 'Individuals with Disabilities Education Act',
        definition: 'A federal law ensuring free appropriate public education for children with disabilities.',
        example: 'IDEA guarantees the right to an IEP and related services.',
      },
      {
        term: 'ADA',
        fullName: 'Americans with Disabilities Act',
        definition: 'A civil rights law prohibiting discrimination against people with disabilities in all areas of public life.',
        example: 'The ADA requires buildings to be wheelchair accessible.',
      },
      {
        term: 'Due Process',
        fullName: 'Due Process',
        definition: 'A formal procedure to resolve disagreements between families and schools about special education.',
        example: 'If a school denies services, families can request due process to appeal.',
      },
      {
        term: 'Advocate',
        fullName: 'Advocate',
        definition: 'A person who speaks up for and supports another person\'s rights and needs.',
        example: 'A special education advocate might attend IEP meetings with families.',
      },
      {
        term: 'SSI',
        fullName: 'Supplemental Security Income',
        definition: 'A federal program providing monthly payments to people with disabilities who have limited income.',
        example: 'SSI can help cover basic needs like food and housing.',
      },
      {
        term: 'Guardianship',
        fullName: 'Guardianship',
        definition: 'A legal arrangement where a court appoints someone to make decisions for a person who cannot make them independently.',
        example: 'Guardianship might be considered when a child with disabilities turns 18.',
      },
    ],
  },
};

// Term card component
const TermCard = ({ term, isExpanded, onToggle, color }) => {
  return (
    <div className="bg-white rounded-xl border-3 border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span 
          className="px-2 py-1 rounded-lg font-display text-white text-sm"
          style={{ backgroundColor: color }}
        >
          {term.term}
        </span>
        <span className="flex-1 font-crayon text-gray-700 text-sm">
          {term.fullName}
        </span>
        {isExpanded ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-3 pb-3 space-y-2">
          <p className="font-crayon text-gray-600 text-sm p-2 rounded-lg bg-gray-50">
            {term.definition}
          </p>
          {term.example && (
            <p className="font-crayon text-xs text-gray-500 italic">
              Example: {term.example}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const Definitions = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTerm, setExpandedTerm] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Get all terms for search
  const allTerms = Object.entries(DEFINITIONS).flatMap(([catId, category]) => 
    category.terms.map(term => ({ ...term, categoryId: catId, categoryColor: category.color }))
  );
  
  // Filter based on search
  const filteredTerms = searchQuery
    ? allTerms.filter(term => 
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  // Handle back navigation - context aware
  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      navigate('/resources');
    }
  };
  
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#20B2AA]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#20B2AA] 
                       rounded-xl font-display font-bold text-[#20B2AA] hover:bg-[#20B2AA] 
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
          <h1 className="text-lg sm:text-xl font-display text-[#20B2AA] crayon-text flex items-center gap-2">
            <BookMarked size={22} />
            Definitions
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Intro */}
        <p className="text-center text-gray-600 font-crayon mb-6">
          Common terms and what they mean
        </p>
        
        {/* Search */}
        <div className="relative mb-6">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search terms..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedCategory(null);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-3 border-gray-200 
                     font-crayon focus:border-[#20B2AA] focus:outline-none"
          />
        </div>
        
        {/* Search Results */}
        {searchQuery && (
          <div className="mb-6">
            <h2 className="font-display text-gray-700 mb-3">
              Search Results ({filteredTerms.length})
            </h2>
            <div className="space-y-2">
              {filteredTerms.map(term => (
                <TermCard
                  key={`${term.categoryId}-${term.term}`}
                  term={term}
                  isExpanded={expandedTerm === `${term.categoryId}-${term.term}`}
                  onToggle={() => setExpandedTerm(
                    expandedTerm === `${term.categoryId}-${term.term}` 
                      ? null 
                      : `${term.categoryId}-${term.term}`
                  )}
                  color={term.categoryColor}
                />
              ))}
              {filteredTerms.length === 0 && (
                <p className="text-center font-crayon text-gray-500 py-4">
                  No terms found matching "{searchQuery}"
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Category Grid */}
        {!searchQuery && !selectedCategory && (
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(DEFINITIONS).map(([catId, category]) => (
              <button
                key={catId}
                onClick={() => setSelectedCategory(catId)}
                className="p-4 rounded-2xl border-4 text-left hover:scale-105 transition-transform"
                style={{ 
                  backgroundColor: category.color + '20',
                  borderColor: category.color 
                }}
              >
                <span className="text-2xl mb-2 block">{category.emoji}</span>
                <h3 className="font-display text-gray-800 text-sm">{category.name}</h3>
                <p className="font-crayon text-xs text-gray-500 mt-1">
                  {category.terms.length} terms
                </p>
              </button>
            ))}
          </div>
        )}
        
        {/* Selected Category */}
        {!searchQuery && selectedCategory && DEFINITIONS[selectedCategory] && (
          <div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 font-crayon text-gray-600 mb-4 hover:text-gray-800"
            >
              <ArrowLeft size={16} />
              All Categories
            </button>
            
            <div 
              className="p-4 rounded-2xl mb-4"
              style={{ backgroundColor: DEFINITIONS[selectedCategory].color + '20' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{DEFINITIONS[selectedCategory].emoji}</span>
                <h2 className="font-display text-gray-800">
                  {DEFINITIONS[selectedCategory].name}
                </h2>
              </div>
            </div>
            
            <div className="space-y-2">
              {DEFINITIONS[selectedCategory].terms.map(term => (
                <TermCard
                  key={term.term}
                  term={term}
                  isExpanded={expandedTerm === term.term}
                  onToggle={() => setExpandedTerm(expandedTerm === term.term ? null : term.term)}
                  color={DEFINITIONS[selectedCategory].color}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div className="flex gap-2">
            <Info size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="font-crayon text-xs text-gray-500">
              These definitions are simplified for general understanding. 
              Medical and legal terms may have more specific meanings in professional contexts.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Definitions;
