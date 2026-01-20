// FIXED: Changed theme color from yellow (#F8D14A) to brown (#CD853F) for better visibility
// FIXED: Back button is context-aware - goes to FAQ menu when viewing a topic, /resources when at top level
// FAQ.jsx - Frequently Asked Questions for ATLASassist
// Common questions and answers for families and caregivers
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Info,
  GraduationCap,
  Stethoscope,
  Home,
  Heart,
  Scale,
  Users
} from 'lucide-react';

// FAQ categories and questions
const FAQ_DATA = {
  diagnosis: {
    name: 'Getting a Diagnosis',
    icon: Stethoscope,
    color: '#E86B9A',
    emoji: '🩺',
    questions: [
      {
        q: 'How do I get my child evaluated for autism or other disabilities?',
        a: 'Start by talking to your pediatrician about your concerns. They can refer you to specialists like developmental pediatricians, psychologists, or neurologists. You can also request a free evaluation through your local school district (for children 3+) or Early Intervention program (for children under 3). Getting multiple opinions is okay - trust your instincts as a parent.',
      },
      {
        q: 'What\'s the difference between a medical diagnosis and a school evaluation?',
        a: 'A medical diagnosis is given by a doctor or psychologist and identifies a condition (like autism or ADHD). A school evaluation determines if a child qualifies for special education services. You don\'t need a medical diagnosis for school services, and having one doesn\'t guarantee school services - they measure different things.',
      },
      {
        q: 'How long does an evaluation take?',
        a: 'The evaluation itself might take 2-4 hours spread across multiple appointments. However, wait times to get an appointment can be 6-18 months with some specialists. School evaluations must be completed within 60 days of consent. Starting early and getting on multiple waitlists can help.',
      },
      {
        q: 'My child is very young - should I wait to see if they "grow out of it"?',
        a: 'Early intervention is extremely valuable! Research shows the earlier support begins, the better the outcomes. There\'s no harm in getting an evaluation - if your child doesn\'t qualify, great. If they do, starting services early gives them the best chance for development. Trust your concerns.',
      },
      {
        q: 'What if I disagree with the diagnosis or evaluation results?',
        a: 'It\'s okay to seek a second opinion from another professional. You can also ask for additional testing or assessment. For school evaluations, you can request an Independent Educational Evaluation (IEE) at the district\'s expense if you disagree with their findings.',
      },
    ],
  },
  school: {
    name: 'School & Education',
    icon: GraduationCap,
    color: '#4A9FD4',
    emoji: '🏫',
    questions: [
      {
        q: 'What\'s the difference between an IEP and a 504 Plan?',
        a: 'An IEP (Individualized Education Program) is for students who need specially designed instruction - it includes specific goals, services, and accommodations. A 504 Plan is for students who need accommodations but not special instruction. IEPs are more comprehensive but 504s are still legally binding and can be very helpful.',
      },
      {
        q: 'How do I request an evaluation from the school?',
        a: 'Put your request in writing! Send a letter or email to the school principal or special education department saying: "I am requesting an evaluation for my child [name] because I am concerned about [specific concerns]." Date it and keep a copy. The school has 15 days to respond and must evaluate within 60 days of your consent.',
      },
      {
        q: 'Can I bring someone to IEP meetings?',
        a: 'Yes! You can bring anyone who has knowledge of your child - advocates, therapists, family members, or friends for support. Let the school know ahead of time as a courtesy. Having someone take notes while you participate can be very helpful.',
      },
      {
        q: 'What if the school says they don\'t have the resources for what my child needs?',
        a: 'The school must provide a Free Appropriate Public Education (FAPE) regardless of cost or resources. If a service is needed for your child to receive FAPE, the school must provide it. Don\'t accept "we can\'t afford that" or "we don\'t have staff" - these aren\'t legal reasons to deny services.',
      },
      {
        q: 'How can I prepare for an IEP meeting?',
        a: 'Before the meeting: review current IEP, gather samples of work, write down your concerns and questions, talk to your child\'s teachers and therapists, bring documentation of outside services. During: take notes, ask for clarification, don\'t feel pressured to sign immediately. After: review what was discussed and follow up on any commitments.',
      },
      {
        q: 'What is extended school year (ESY) and how do I get it?',
        a: 'ESY provides services during summer breaks to prevent significant regression. It\'s not just summer school - it\'s specially designed instruction. The IEP team decides if your child qualifies based on data showing they regress significantly and take a long time to recoup skills. You can request ESY be considered at any IEP meeting.',
      },
    ],
  },
  services: {
    name: 'Therapy & Services',
    icon: Heart,
    color: '#5CB85C',
    emoji: '💚',
    questions: [
      {
        q: 'How do I find good therapists for my child?',
        a: 'Ask for recommendations from your pediatrician, school, local parent support groups, and other families. Check if your insurance covers services and ask for their provider list. Look for therapists experienced with your child\'s specific needs. Don\'t be afraid to try different providers until you find a good fit.',
      },
      {
        q: 'What should I look for in a therapist?',
        a: 'Good signs: they listen to you and your child, explain what they\'re doing and why, involve you in goal-setting, show respect for your child, adapt their approach as needed, communicate regularly. Red flags: dismissing your concerns, not letting you observe, using shame or punishment, refusing to explain their methods.',
      },
      {
        q: 'How much therapy is too much therapy?',
        a: 'There\'s no one-size-fits-all answer, but watch for signs of burnout: your child resisting or dreading therapy, exhaustion, regression, or loss of family/play time. Quality matters more than quantity. Your child also needs time to just be a kid. Balance is key - discuss concerns with your team.',
      },
      {
        q: 'What if we can\'t afford private therapy?',
        a: 'Options to explore: Early Intervention (free, birth-3), school services (free), Medicaid/CHIP, insurance appeals, sliding scale providers, university training clinics, nonprofit organizations, therapy grants (like ACT Today, UnitedHealthcare Children\'s Foundation). Many therapists offer telehealth which may have more availability.',
      },
      {
        q: 'Should I do what the therapist recommends even if it upsets my child?',
        a: 'Some discomfort with learning new skills is normal, but therapy shouldn\'t cause significant distress. You know your child best. Ask the therapist to explain the reasoning and discuss alternatives. Effective therapy builds on your child\'s strengths and interests. If something feels wrong, trust your instincts and speak up.',
      },
    ],
  },
  daily: {
    name: 'Daily Life',
    icon: Home,
    color: '#F5A623',
    emoji: '🏠',
    questions: [
      {
        q: 'How do I handle meltdowns in public?',
        a: 'Prevention helps: know triggers, plan for sensory breaks, bring comfort items, and keep outings short initially. During: stay calm, reduce demands, move to a quieter space if possible, don\'t worry about others\' opinions. After: let your child recover before processing. Consider carrying cards that explain your child\'s needs to give to concerned bystanders.',
      },
      {
        q: 'How can I help my child with transitions?',
        a: 'Strategies that help: visual schedules, timers/warnings before transitions (10 min, 5 min, 1 min), consistent routines, transition objects, social stories about what\'s next, music or songs for transitions, allowing extra time, validating their feelings about the change.',
      },
      {
        q: 'How do I explain my child\'s disability to others?',
        a: 'Keep it simple and age-appropriate. Focus on differences, not deficits: "Their brain works differently" or "They communicate in their own way." Share what helps: "Loud noises are hard for them" or "They need extra time to answer." Let your child participate in deciding what to share when they\'re ready.',
      },
      {
        q: 'My child is a picky eater - what can I do?',
        a: 'Picky eating is common, especially with sensory sensitivities. Don\'t force foods - this can create more aversion. Offer preferred foods alongside new ones. Address sensory factors (temperature, texture, presentation). Consider occupational therapy for feeding issues. Rule out medical causes. Small steps over time work better than big changes.',
      },
      {
        q: 'How do I help my child make friends?',
        a: 'Focus on quality over quantity - even one friend is wonderful. Arrange structured playdates with clear activities. Look for shared interest groups. Social skills groups can help. Teach and practice specific skills like greeting, turn-taking, and conversation. Accept that friendship may look different for your child, and that\'s okay.',
      },
      {
        q: 'How can I help siblings understand and cope?',
        a: 'Use age-appropriate language to explain. Give siblings one-on-one time. Acknowledge their feelings - it\'s okay to feel frustrated or embarrassed sometimes. Connect them with sibling support groups. Involve them in therapy when appropriate. Make sure they know they\'re not responsible for their sibling\'s behavior or care.',
      },
    ],
  },
  rights: {
    name: 'Rights & Advocacy',
    icon: Scale,
    color: '#8E6BBF',
    emoji: '⚖️',
    questions: [
      {
        q: 'What rights does my child have in school?',
        a: 'Under IDEA: right to free appropriate public education, evaluation, IEP, least restrictive environment, parent participation, and due process. Under Section 504: right to equal access and reasonable accommodations. Document everything, put requests in writing, and know you can disagree and appeal decisions.',
      },
      {
        q: 'What is an educational advocate and do I need one?',
        a: 'An advocate helps families navigate the special education system, attends meetings, and ensures your child gets appropriate services. You might want one if: you feel overwhelmed, the school isn\'t cooperating, you\'re facing complex issues, or you want support. Many advocates charge fees, but some nonprofits offer free services.',
      },
      {
        q: 'When should I consult a special education attorney?',
        a: 'Consider an attorney for: denial of services, significant disputes with the school, due process hearings, discrimination issues, or if you feel your child\'s rights are being violated. Many offer free consultations. The school must tell you about free/low-cost legal services in your area.',
      },
      {
        q: 'What happens when my child turns 18?',
        a: 'At 18, your child becomes their own legal guardian unless you pursue legal guardianship. School services continue until 21-22. Look into adult services early: Vocational Rehabilitation, Social Security, Medicaid waivers, supported employment, day programs. Start transition planning at age 14-16 through the IEP.',
      },
    ],
  },
  self_care: {
    name: 'Caregiver Self-Care',
    icon: Users,
    color: '#20B2AA',
    emoji: '🧘',
    questions: [
      {
        q: 'I feel guilty taking time for myself - is that normal?',
        a: 'Completely normal and very common among caregivers. But you can\'t pour from an empty cup. Taking care of yourself isn\'t selfish - it makes you a better caregiver. Start small: 10 minutes alone, a short walk, or a phone call with a friend. You deserve rest and joy too.',
      },
      {
        q: 'How do I deal with unsolicited advice from family/friends?',
        a: 'It\'s frustrating! Try: "Thanks, we\'re working with our team on what\'s best for [child]." Or: "I appreciate your concern. We\'ve got it handled." Set boundaries: "I\'m happy to share resources if you want to learn more, but I\'m not looking for advice right now." Some people won\'t understand - that\'s okay.',
      },
      {
        q: 'How do I find other parents who understand?',
        a: 'Look for: local parent support groups (ask at school or therapy), Facebook groups for your child\'s specific diagnosis, organizations like The Arc or Autism Society chapters, parent training offered by school districts, online communities. Connecting with others who "get it" can be incredibly validating.',
      },
      {
        q: 'I\'m feeling burned out - what can I do?',
        a: 'Burnout is real and serious. Steps: acknowledge it\'s happening, ask for help (specific requests work better), explore respite care options, cut non-essential commitments, talk to a therapist if possible, connect with other caregivers, take care of physical health. You don\'t have to do everything. It\'s okay to not be okay sometimes.',
      },
      {
        q: 'How do I maintain my relationship with my partner?',
        a: 'It takes intentional effort. Tips: schedule regular check-ins, divide caregiving tasks fairly, make time for dates (even at home), support each other\'s individual coping, attend therapy together if needed, communicate about stress and needs, remember you\'re a team. Many couples grow stronger through challenges.',
      },
    ],
  },
};

// Question card component
const QuestionCard = ({ faq, isExpanded, onToggle, color }) => {
  return (
    <div className="bg-white rounded-xl border-3 border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start gap-3 text-left hover:bg-gray-50 transition-colors"
      >
        <HelpCircle 
          size={20} 
          className="flex-shrink-0 mt-0.5"
          style={{ color: color }}
        />
        <span className="flex-1 font-crayon text-gray-700">
          {faq.q}
        </span>
        {isExpanded ? (
          <ChevronUp size={18} className="text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4">
          <div 
            className="p-3 rounded-xl font-crayon text-gray-600 text-sm leading-relaxed"
            style={{ backgroundColor: color + '15' }}
          >
            {faq.a}
          </div>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQ, setExpandedQ] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Get all questions for search
  const allQuestions = Object.entries(FAQ_DATA).flatMap(([catId, category]) => 
    category.questions.map((q, i) => ({ 
      ...q, 
      categoryId: catId, 
      categoryColor: category.color,
      id: `${catId}-${i}`
    }))
  );
  
  // Filter based on search
  const filteredQuestions = searchQuery
    ? allQuestions.filter(faq => 
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#CD853F]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/resources')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#CD853F] 
                       rounded-xl font-display font-bold text-[#CD853F] hover:bg-[#CD853F] 
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
          <h1 className="text-lg sm:text-xl font-display text-[#CD853F] crayon-text flex items-center gap-2">
            <HelpCircle size={22} />
            FAQ
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Intro */}
        <p className="text-center text-gray-600 font-crayon mb-6">
          Frequently asked questions and answers
        </p>
        
        {/* Search */}
        <div className="relative mb-6">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedCategory(null);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-3 border-gray-200 
                     font-crayon focus:border-[#CD853F] focus:outline-none"
          />
        </div>
        
        {/* Search Results */}
        {searchQuery && (
          <div className="mb-6">
            <h2 className="font-display text-gray-700 mb-3">
              Search Results ({filteredQuestions.length})
            </h2>
            <div className="space-y-2">
              {filteredQuestions.map(faq => (
                <QuestionCard
                  key={faq.id}
                  faq={faq}
                  isExpanded={expandedQ === faq.id}
                  onToggle={() => setExpandedQ(expandedQ === faq.id ? null : faq.id)}
                  color={faq.categoryColor}
                />
              ))}
              {filteredQuestions.length === 0 && (
                <p className="text-center font-crayon text-gray-500 py-4">
                  No questions found matching "{searchQuery}"
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Category Grid */}
        {!searchQuery && !selectedCategory && (
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(FAQ_DATA).map(([catId, category]) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={catId}
                  onClick={() => setSelectedCategory(catId)}
                  className="p-4 rounded-2xl border-4 text-left hover:scale-105 transition-transform"
                  style={{ 
                    backgroundColor: category.color + '20',
                    borderColor: category.color 
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{category.emoji}</span>
                    <IconComponent size={18} style={{ color: category.color }} />
                  </div>
                  <h3 className="font-display text-gray-800 text-sm">{category.name}</h3>
                  <p className="font-crayon text-xs text-gray-500 mt-1">
                    {category.questions.length} questions
                  </p>
                </button>
              );
            })}
          </div>
        )}
        
        {/* Selected Category */}
        {!searchQuery && selectedCategory && FAQ_DATA[selectedCategory] && (
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
              style={{ backgroundColor: FAQ_DATA[selectedCategory].color + '20' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{FAQ_DATA[selectedCategory].emoji}</span>
                <h2 className="font-display text-gray-800">
                  {FAQ_DATA[selectedCategory].name}
                </h2>
              </div>
            </div>
            
            <div className="space-y-2">
              {FAQ_DATA[selectedCategory].questions.map((faq, i) => (
                <QuestionCard
                  key={i}
                  faq={faq}
                  isExpanded={expandedQ === `${selectedCategory}-${i}`}
                  onToggle={() => setExpandedQ(
                    expandedQ === `${selectedCategory}-${i}` 
                      ? null 
                      : `${selectedCategory}-${i}`
                  )}
                  color={FAQ_DATA[selectedCategory].color}
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
              This information is for general guidance only. Laws, policies, and best practices 
              may vary by location and change over time. Always consult with qualified professionals 
              for advice specific to your situation.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
