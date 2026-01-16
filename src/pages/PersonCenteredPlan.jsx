// PersonCenteredPlan.jsx - Person-Centered Planning Tool
// Comprehensive life planning document focused on the individual
// Part of the Planning & Documents hub

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User,
  Heart,
  Target,
  Users,
  Home,
  Briefcase,
  GraduationCap,
  Car,
  DollarSign,
  Shield,
  Sparkles,
  Save,
  Printer,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  X,
  Camera,
  Plus,
  Trash2,
  Star,
  Clock,
  MapPin,
  Phone,
  Calendar,
  CheckCircle,
  Circle,
  Edit3,
  Eye
} from 'lucide-react';

// ============================================
// STORAGE KEY
// ============================================
const STORAGE_KEY = 'snw_person_centered_plan';

// ============================================
// PLAN SECTIONS
// ============================================
const SECTIONS = [
  {
    id: 'profile',
    title: 'About Me',
    icon: User,
    color: '#4A9FD4',
    description: 'Who I am as a person',
    fields: [
      { id: 'name', label: 'My Name', type: 'text', required: true },
      { id: 'birthday', label: 'Birthday', type: 'date' },
      { id: 'aboutMe', label: 'About Me (in my own words or from those who know me best)', type: 'textarea', rows: 4, placeholder: 'Describe who I am as a person - my personality, what makes me unique...' },
      { id: 'history', label: 'My History / Background', type: 'textarea', rows: 3, placeholder: 'Important things about my life story...' },
    ],
  },
  {
    id: 'strengths',
    title: 'My Strengths & Gifts',
    icon: Star,
    color: '#F8D14A',
    description: 'What I\'m good at and bring to others',
    fields: [
      { id: 'strengths', label: 'Things I\'m Good At', type: 'textarea', rows: 3, placeholder: 'Skills, talents, abilities...' },
      { id: 'gifts', label: 'Gifts I Bring to Others', type: 'textarea', rows: 3, placeholder: 'How I make others\' lives better, what I contribute...' },
      { id: 'accomplishments', label: 'Things I\'m Proud Of', type: 'textarea', rows: 3, placeholder: 'Accomplishments, achievements, milestones...' },
      { id: 'positiveTraits', label: 'Positive Traits Others See in Me', type: 'textarea', rows: 2, placeholder: 'Kind, funny, determined, creative...' },
    ],
  },
  {
    id: 'preferences',
    title: 'What\'s Important TO Me',
    icon: Heart,
    color: '#E86B9A',
    description: 'Things that matter most in my life',
    fields: [
      { id: 'importantTo', label: 'What\'s Most Important TO Me', type: 'textarea', rows: 4, placeholder: 'Things that make me happy, bring meaning to my life, non-negotiables...' },
      { id: 'likes', label: 'Things I Like / Enjoy', type: 'textarea', rows: 3, placeholder: 'Activities, hobbies, interests, favorites...' },
      { id: 'dislikes', label: 'Things I Don\'t Like / Want to Avoid', type: 'textarea', rows: 3, placeholder: 'Things that upset me, make me uncomfortable...' },
      { id: 'routines', label: 'Routines & Rituals That Matter', type: 'textarea', rows: 2, placeholder: 'Daily routines, traditions, habits that are important...' },
    ],
  },
  {
    id: 'support',
    title: 'What\'s Important FOR Me',
    icon: Shield,
    color: '#5CB85C',
    description: 'Support I need to be healthy and safe',
    fields: [
      { id: 'importantFor', label: 'What\'s Important FOR Me (Health & Safety)', type: 'textarea', rows: 4, placeholder: 'Things I need to stay healthy, safe, and well - even if I don\'t always like them...' },
      { id: 'healthNeeds', label: 'Health & Medical Needs', type: 'textarea', rows: 3, placeholder: 'Medical conditions, medications, therapies, appointments...' },
      { id: 'safetyNeeds', label: 'Safety Considerations', type: 'textarea', rows: 2, placeholder: 'Things to be aware of for my safety...' },
      { id: 'supportNeeds', label: 'Support I Need Daily', type: 'textarea', rows: 3, placeholder: 'Assistance with daily activities, prompts, supervision...' },
    ],
  },
  {
    id: 'communication',
    title: 'How to Support Me',
    icon: Users,
    color: '#8E6BBF',
    description: 'Best ways to communicate and help',
    fields: [
      { id: 'commStyle', label: 'How I Communicate', type: 'textarea', rows: 3, placeholder: 'How I express myself - words, AAC, gestures, behavior...' },
      { id: 'bestSupport', label: 'Best Ways to Support Me', type: 'textarea', rows: 3, placeholder: 'What works well, how to approach me, tips for helpers...' },
      { id: 'avoidDoing', label: 'Things to Avoid When Supporting Me', type: 'textarea', rows: 2, placeholder: 'What doesn\'t work, triggers, things that make it worse...' },
      { id: 'decisionMaking', label: 'How I Make Decisions', type: 'textarea', rows: 2, placeholder: 'How I like to be involved in decisions, what help I need...' },
    ],
  },
  {
    id: 'relationships',
    title: 'People in My Life',
    icon: Users,
    color: '#0891B2',
    description: 'Important relationships and connections',
    fields: [
      { id: 'family', label: 'Family', type: 'textarea', rows: 2, placeholder: 'Important family members and relationships...' },
      { id: 'friends', label: 'Friends & Social Connections', type: 'textarea', rows: 2, placeholder: 'Friends, social groups, community connections...' },
      { id: 'professionals', label: 'Professionals & Service Providers', type: 'textarea', rows: 2, placeholder: 'Doctors, therapists, teachers, support workers...' },
      { id: 'relationshipGoals', label: 'Relationship Goals', type: 'textarea', rows: 2, placeholder: 'How I want to grow my relationships, connections I want to make...' },
    ],
  },
  {
    id: 'living',
    title: 'Where I Live',
    icon: Home,
    color: '#E63B2E',
    description: 'My home and living situation',
    fields: [
      { id: 'currentLiving', label: 'Where I Live Now', type: 'textarea', rows: 2, placeholder: 'Current living situation...' },
      { id: 'idealLiving', label: 'My Ideal Living Situation', type: 'textarea', rows: 3, placeholder: 'Where and how I want to live, what\'s important in my home...' },
      { id: 'livingSupport', label: 'Support I Need at Home', type: 'textarea', rows: 2, placeholder: 'Help I need with daily living, household tasks...' },
      { id: 'livingGoals', label: 'Living Goals', type: 'textarea', rows: 2, placeholder: 'Changes I want to make, skills I want to learn...' },
    ],
  },
  {
    id: 'work',
    title: 'Work & Purpose',
    icon: Briefcase,
    color: '#F5A623',
    description: 'Employment, volunteering, and meaningful activities',
    fields: [
      { id: 'currentWork', label: 'Current Work / Activities', type: 'textarea', rows: 2, placeholder: 'Job, volunteer work, day program, school...' },
      { id: 'workStrengths', label: 'Work-Related Strengths', type: 'textarea', rows: 2, placeholder: 'Skills and abilities for work...' },
      { id: 'idealWork', label: 'My Ideal Work / Purpose', type: 'textarea', rows: 3, placeholder: 'What kind of work I want to do, what gives me purpose...' },
      { id: 'workGoals', label: 'Work / Career Goals', type: 'textarea', rows: 2, placeholder: 'Employment goals, skills to develop...' },
    ],
  },
  {
    id: 'education',
    title: 'Learning & Growth',
    icon: GraduationCap,
    color: '#20B2AA',
    description: 'Education and personal development',
    fields: [
      { id: 'currentEducation', label: 'Current Learning', type: 'textarea', rows: 2, placeholder: 'School, classes, training I\'m doing now...' },
      { id: 'learningStyle', label: 'How I Learn Best', type: 'textarea', rows: 2, placeholder: 'Learning preferences, accommodations that help...' },
      { id: 'wantToLearn', label: 'Things I Want to Learn', type: 'textarea', rows: 3, placeholder: 'Skills, subjects, experiences I want...' },
      { id: 'educationGoals', label: 'Education Goals', type: 'textarea', rows: 2, placeholder: 'Degrees, certifications, skills to master...' },
    ],
  },
  {
    id: 'community',
    title: 'Community & Fun',
    icon: MapPin,
    color: '#EC4899',
    description: 'Recreation, hobbies, and community involvement',
    fields: [
      { id: 'hobbies', label: 'Hobbies & Interests', type: 'textarea', rows: 3, placeholder: 'Things I do for fun, activities I enjoy...' },
      { id: 'communityInvolvement', label: 'Community Involvement', type: 'textarea', rows: 2, placeholder: 'Groups, clubs, religious community, neighborhood...' },
      { id: 'funGoals', label: 'Fun & Recreation Goals', type: 'textarea', rows: 2, placeholder: 'New activities to try, places to go, experiences I want...' },
      { id: 'transportation', label: 'How I Get Around', type: 'textarea', rows: 2, placeholder: 'Transportation I use, independence with travel...' },
    ],
  },
  {
    id: 'dreams',
    title: 'My Dreams & Goals',
    icon: Sparkles,
    color: '#8B5CF6',
    description: 'Vision for the future',
    fields: [
      { id: 'dreams', label: 'My Dreams for the Future', type: 'textarea', rows: 4, placeholder: 'Big dreams, hopes, aspirations...' },
      { id: 'shortTermGoals', label: 'Goals for This Year', type: 'textarea', rows: 3, placeholder: 'Things I want to accomplish in the next 12 months...' },
      { id: 'longTermGoals', label: 'Long-Term Goals (3-5 years)', type: 'textarea', rows: 3, placeholder: 'Where I see myself in a few years...' },
      { id: 'nextSteps', label: 'Next Steps to Take', type: 'textarea', rows: 3, placeholder: 'Actions to take, who will help, timeline...' },
    ],
  },
];

// ============================================
// FORM FIELD COMPONENT
// ============================================
const FormField = ({ field, value, onChange, sectionColor }) => {
  if (field.type === 'textarea') {
    return (
      <div>
        <label className="block font-display text-sm text-gray-700 mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          rows={field.rows || 3}
          className="w-full px-4 py-3 rounded-xl border-3 border-gray-200 focus:outline-none 
                   font-crayon transition-colors resize-none"
          style={{ borderColor: value ? sectionColor : undefined }}
        />
      </div>
    );
  }
  
  return (
    <div>
      <label className="block font-display text-sm text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={field.type}
        value={value || ''}
        onChange={(e) => onChange(field.id, e.target.value)}
        placeholder={field.placeholder}
        className="w-full px-4 py-3 rounded-xl border-3 border-gray-200 focus:outline-none 
                 font-crayon transition-colors"
        style={{ borderColor: value ? sectionColor : undefined }}
      />
    </div>
  );
};

// ============================================
// PLAN PREVIEW COMPONENT
// ============================================
const PlanPreview = ({ data, photo }) => {
  const handlePrint = () => {
    window.print();
  };
  
  const hasContent = (sectionId) => {
    const section = SECTIONS.find(s => s.id === sectionId);
    return section?.fields.some(f => data[f.id]?.trim());
  };
  
  return (
    <div className="bg-white rounded-2xl border-3 border-gray-200 overflow-hidden">
      {/* Print Button */}
      <div className="p-3 bg-gray-50 border-b flex justify-between items-center print:hidden">
        <span className="font-display text-sm text-gray-600">Person-Centered Plan Preview</span>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-[#8E6BBF] text-white rounded-lg font-display text-sm hover:bg-purple-600 transition-colors"
        >
          <Printer size={16} />
          Print Plan
        </button>
      </div>
      
      {/* Plan Content */}
      <div className="p-6 print:p-4" id="person-centered-plan">
        {/* Header */}
        <div className="text-center mb-6 pb-4 border-b-2 border-gray-200">
          <h1 className="text-2xl font-display text-[#8E6BBF] mb-1">
            Person-Centered Plan
          </h1>
          <h2 className="text-xl font-display text-gray-700">
            {data.name || 'My Name'}
          </h2>
          {data.birthday && (
            <p className="font-crayon text-gray-500 mt-1">
              Birthday: {new Date(data.birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          )}
          <p className="font-crayon text-xs text-gray-400 mt-2">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>
        
        {/* Photo */}
        {photo && (
          <div className="flex justify-center mb-6">
            <img 
              src={photo} 
              alt="Profile" 
              className="w-32 h-32 rounded-xl object-cover border-3 border-gray-200"
            />
          </div>
        )}
        
        {/* Sections */}
        <div className="space-y-6 print:space-y-4">
          {SECTIONS.filter(section => hasContent(section.id)).map(section => (
            <div 
              key={section.id}
              className="p-4 rounded-xl print:p-2 print:border print:border-gray-300"
              style={{ backgroundColor: `${section.color}10` }}
            >
              <h3 
                className="font-display text-lg mb-3 flex items-center gap-2"
                style={{ color: section.color }}
              >
                {(() => {
                  const Icon = section.icon;
                  return <Icon size={20} />;
                })()}
                {section.title}
              </h3>
              
              <div className="space-y-3">
                {section.fields.map(field => {
                  const value = data[field.id];
                  if (!value?.trim()) return null;
                  
                  return (
                    <div key={field.id}>
                      <p className="font-display text-sm text-gray-600">{field.label}</p>
                      <p className="font-crayon text-gray-800 whitespace-pre-line">{value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="font-crayon text-xs text-gray-400">
            Created with ATLASassist • This is a living document - update regularly!
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const PersonCenteredPlan = () => {
  const navigate = useNavigate();
  
  // State
  const [data, setData] = useState({});
  const [photo, setPhoto] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [view, setView] = useState('edit'); // edit, preview
  const [showInfo, setShowInfo] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  const fileInputRef = useRef(null);
  
  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed.data || {});
        setPhoto(parsed.photo || null);
        setLastSaved(parsed.lastSaved || null);
      } catch (e) {
        console.error('Error loading plan:', e);
      }
    }
  }, []);
  
  // Save data
  const saveData = () => {
    const saveObj = {
      data,
      photo,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveObj));
    setHasChanges(false);
    setLastSaved(saveObj.lastSaved);
  };
  
  // Handle field change
  const handleFieldChange = (fieldId, value) => {
    setData(prev => ({ ...prev, [fieldId]: value }));
    setHasChanges(true);
  };
  
  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Navigation
  const goNext = () => {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };
  
  const goPrev = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };
  
  // Calculate progress
  const calculateProgress = () => {
    const totalFields = SECTIONS.reduce((acc, s) => acc + s.fields.length, 0);
    const filledFields = Object.values(data).filter(v => v?.toString().trim()).length;
    return Math.round((filledFields / totalFields) * 100);
  };
  
  const section = SECTIONS[currentSection];

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => {
              if (hasChanges && confirm('Save changes before leaving?')) {
                saveData();
              }
              navigate('/planning');
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                       rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
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
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#8E6BBF] crayon-text flex items-center gap-2">
              <Target size={24} />
              Person-Centered Plan
            </h1>
          </div>
          
          <button
            onClick={() => setShowInfo(true)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <HelpCircle size={22} className="text-gray-400" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* View Toggle */}
        <div className="flex gap-2 mb-4 print:hidden">
          <button
            onClick={() => setView('edit')}
            className={`flex-1 py-3 rounded-xl font-display transition-all flex items-center justify-center gap-2 ${
              view === 'edit' 
                ? 'bg-[#8E6BBF] text-white shadow-md' 
                : 'bg-white border-2 border-gray-200 text-gray-600'
            }`}
          >
            <Edit3 size={18} />
            Edit Plan
          </button>
          <button
            onClick={() => { saveData(); setView('preview'); }}
            className={`flex-1 py-3 rounded-xl font-display transition-all flex items-center justify-center gap-2 ${
              view === 'preview' 
                ? 'bg-[#8E6BBF] text-white shadow-md' 
                : 'bg-white border-2 border-gray-200 text-gray-600'
            }`}
          >
            <Eye size={18} />
            Preview & Print
          </button>
        </div>

        {/* ============================================ */}
        {/* EDIT VIEW */}
        {/* ============================================ */}
        {view === 'edit' && (
          <div>
            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm font-crayon text-gray-500 mb-1">
                <span>Completion</span>
                <span>{calculateProgress()}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#8E6BBF] transition-all duration-300"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
            </div>
            
            {/* Section Navigation */}
            <div className="flex gap-1 overflow-x-auto pb-2 mb-4">
              {SECTIONS.map((s, i) => {
                const Icon = s.icon;
                const hasContent = s.fields.some(f => data[f.id]?.trim());
                return (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSection(i)}
                    className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                      currentSection === i 
                        ? 'text-white shadow-md' 
                        : hasContent
                          ? 'bg-white border-2 text-gray-600'
                          : 'bg-gray-100 text-gray-400'
                    }`}
                    style={{
                      backgroundColor: currentSection === i ? s.color : undefined,
                      borderColor: hasContent && currentSection !== i ? s.color : undefined,
                    }}
                    title={s.title}
                  >
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>
            
            {/* Photo Upload (in About Me section) */}
            {currentSection === 0 && (
              <div className="mb-4 flex items-center gap-4">
                <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border-3 border-dashed border-gray-300">
                  {photo ? (
                    <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={32} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-100 rounded-lg font-crayon text-sm text-gray-600 hover:bg-gray-200"
                  >
                    {photo ? 'Change Photo' : 'Add Photo'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Current Section Form */}
            <div 
              className="p-4 rounded-2xl mb-4"
              style={{ backgroundColor: `${section.color}10` }}
            >
              <h2 
                className="font-display text-lg mb-1 flex items-center gap-2"
                style={{ color: section.color }}
              >
                {(() => {
                  const Icon = section.icon;
                  return <Icon size={20} />;
                })()}
                {section.title}
              </h2>
              <p className="font-crayon text-sm text-gray-500 mb-4">{section.description}</p>
              
              <div className="space-y-4">
                {section.fields.map(field => (
                  <FormField
                    key={field.id}
                    field={field}
                    value={data[field.id]}
                    onChange={handleFieldChange}
                    sectionColor={section.color}
                  />
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <button
                onClick={goPrev}
                disabled={currentSection === 0}
                className="flex-1 py-3 border-3 border-gray-200 rounded-xl font-display text-gray-600
                         hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              
              {currentSection < SECTIONS.length - 1 ? (
                <button
                  onClick={goNext}
                  className="flex-1 py-3 text-white rounded-xl font-display
                           hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ backgroundColor: section.color }}
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={() => { saveData(); setView('preview'); }}
                  className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl font-display
                           hover:bg-green-600 flex items-center justify-center gap-2"
                >
                  <Eye size={18} />
                  Preview Plan
                </button>
              )}
            </div>
            
            {/* Save Button */}
            {hasChanges && (
              <button
                onClick={saveData}
                className="w-full mt-3 py-3 border-3 border-[#5CB85C] text-[#5CB85C] rounded-xl font-display
                         hover:bg-[#5CB85C] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Save Progress
              </button>
            )}
            
            {/* Last Saved */}
            {lastSaved && (
              <p className="text-center font-crayon text-xs text-gray-400 mt-2">
                <Clock size={12} className="inline mr-1" />
                Last saved: {new Date(lastSaved).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/* PREVIEW VIEW */}
        {/* ============================================ */}
        {view === 'preview' && (
          <PlanPreview data={data} photo={photo} />
        )}
        
        {/* Tip Box */}
        <div className="mt-6 p-4 bg-[#8E6BBF]/10 rounded-2xl border-3 border-[#8E6BBF]/30 print:hidden">
          <h3 className="font-display text-[#8E6BBF] mb-2">💡 Tips for Person-Centered Planning</h3>
          <ul className="font-crayon text-sm text-gray-600 space-y-1">
            <li>• Write in first person ("I like..." not "They like...")</li>
            <li>• Include the person's voice - their words matter most</li>
            <li>• Balance what's important TO them with what's important FOR them</li>
            <li>• Review and update regularly - at least once a year</li>
            <li>• Share with everyone who supports this person</li>
          </ul>
        </div>
      </main>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-[#8E6BBF]">About Person-Centered Planning</h2>
              <button onClick={() => setShowInfo(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-3 font-crayon text-gray-600">
              <p>
                <strong>What is it?</strong> A process that puts the individual at the center of 
                planning for their life. It focuses on their strengths, preferences, and dreams.
              </p>
              <p>
                <strong>Key Principles:</strong>
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>The person is at the center of all planning</li>
                <li>Family and friends are partners in planning</li>
                <li>Focus on capacities and strengths, not limitations</li>
                <li>Reflect what's important TO the person and FOR the person</li>
                <li>Actions lead to positive change in the person's life</li>
              </ul>
              <p>
                <strong>Important TO vs FOR:</strong>
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li><strong>Important TO:</strong> What makes life worth living - preferences, relationships, routines</li>
                <li><strong>Important FOR:</strong> What keeps the person healthy and safe</li>
                <li>Both must be balanced for a good quality of life</li>
              </ul>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full mt-4 py-3 bg-[#8E6BBF] text-white rounded-xl font-display"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #person-centered-plan, #person-centered-plan * { visibility: visible; }
          #person-centered-plan { position: absolute; left: 0; top: 0; width: 100%; }
          header, .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default PersonCenteredPlan;
