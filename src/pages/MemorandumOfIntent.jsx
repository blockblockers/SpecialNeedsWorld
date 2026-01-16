// MemorandumOfIntent.jsx - Letter of Intent / Memorandum of Intent
// Document for future caregivers about an individual's life and needs
// Part of the Planning & Documents hub

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText,
  Heart,
  Home,
  DollarSign,
  Users,
  Shield,
  Briefcase,
  Calendar,
  Clock,
  Save,
  Printer,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  X,
  Camera,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit3,
  Scale,
  Stethoscope,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

// ============================================
// STORAGE KEY
// ============================================
const STORAGE_KEY = 'snw_memorandum_of_intent';

// ============================================
// DOCUMENT SECTIONS
// ============================================
const SECTIONS = [
  {
    id: 'intro',
    title: 'Introduction',
    icon: FileText,
    color: '#4A9FD4',
    description: 'Basic information and purpose of this document',
    fields: [
      { id: 'personName', label: 'This Letter of Intent is for', type: 'text', required: true, placeholder: 'Full legal name' },
      { id: 'preparedBy', label: 'Prepared by', type: 'text', placeholder: 'Your name and relationship' },
      { id: 'preparedDate', label: 'Date Prepared', type: 'date' },
      { id: 'purpose', label: 'Purpose Statement', type: 'textarea', rows: 3, placeholder: 'This document is intended to provide guidance for future caregivers about [name]\'s life, preferences, and needs...' },
    ],
  },
  {
    id: 'family',
    title: 'Family & Relationships',
    icon: Users,
    color: '#E86B9A',
    description: 'Important people in their life',
    fields: [
      { id: 'familyHistory', label: 'Family Background', type: 'textarea', rows: 3, placeholder: 'Parents, siblings, family history...' },
      { id: 'currentCaregiver', label: 'Current Primary Caregiver(s)', type: 'textarea', rows: 2, placeholder: 'Who provides care now?' },
      { id: 'futureCaregiver', label: 'Preferred Future Caregiver(s)', type: 'textarea', rows: 2, placeholder: 'Who should provide care if current caregivers cannot?' },
      { id: 'importantRelationships', label: 'Important Relationships to Maintain', type: 'textarea', rows: 3, placeholder: 'Friends, extended family, community connections that should be maintained...' },
      { id: 'relationshipNotes', label: 'Notes About Relationships', type: 'textarea', rows: 2, placeholder: 'Any family dynamics or relationship considerations...' },
    ],
  },
  {
    id: 'living',
    title: 'Housing & Living',
    icon: Home,
    color: '#5CB85C',
    description: 'Where and how they should live',
    fields: [
      { id: 'currentLiving', label: 'Current Living Situation', type: 'textarea', rows: 2, placeholder: 'Where they live now...' },
      { id: 'idealLiving', label: 'Ideal Future Living Situation', type: 'textarea', rows: 3, placeholder: 'Preferred type of housing, location, living companions...' },
      { id: 'livingRequirements', label: 'Living Environment Requirements', type: 'textarea', rows: 3, placeholder: 'Accessibility needs, safety considerations, must-haves...' },
      { id: 'livingPreferences', label: 'Living Preferences', type: 'textarea', rows: 2, placeholder: 'Preferred routines, room setup, personal items...' },
      { id: 'unacceptableLiving', label: 'Living Situations to Avoid', type: 'textarea', rows: 2, placeholder: 'What would NOT be acceptable...' },
    ],
  },
  {
    id: 'daily',
    title: 'Daily Life & Care',
    icon: Calendar,
    color: '#F5A623',
    description: 'Daily routines and care needs',
    fields: [
      { id: 'dailyRoutine', label: 'Typical Daily Routine', type: 'textarea', rows: 4, placeholder: 'Morning to evening routine...' },
      { id: 'personalCare', label: 'Personal Care Needs', type: 'textarea', rows: 3, placeholder: 'Bathing, dressing, grooming assistance needed...' },
      { id: 'mealPreferences', label: 'Food & Meal Preferences', type: 'textarea', rows: 3, placeholder: 'Dietary needs, favorite foods, eating assistance...' },
      { id: 'sleepNeeds', label: 'Sleep Needs & Routines', type: 'textarea', rows: 2, placeholder: 'Bedtime routine, sleep schedule, nighttime needs...' },
      { id: 'transportationNeeds', label: 'Transportation Needs', type: 'textarea', rows: 2, placeholder: 'How they get around, assistance needed...' },
    ],
  },
  {
    id: 'medical',
    title: 'Medical Information',
    icon: Stethoscope,
    color: '#E63B2E',
    description: 'Health conditions and medical care',
    fields: [
      { id: 'diagnoses', label: 'Medical Diagnoses', type: 'textarea', rows: 3, placeholder: 'All diagnoses and conditions...' },
      { id: 'medications', label: 'Current Medications', type: 'textarea', rows: 3, placeholder: 'Medication name, dose, frequency, purpose...' },
      { id: 'allergies', label: 'Allergies', type: 'textarea', rows: 2, placeholder: 'Drug, food, environmental allergies...' },
      { id: 'medicalProviders', label: 'Medical Providers', type: 'textarea', rows: 3, placeholder: 'Primary care, specialists, therapists - names and contact info...' },
      { id: 'medicalPreferences', label: 'Medical Care Preferences', type: 'textarea', rows: 2, placeholder: 'Preferred hospitals, how to handle medical decisions...' },
      { id: 'endOfLife', label: 'End of Life Wishes', type: 'textarea', rows: 3, placeholder: 'Any wishes regarding end of life care (optional but important)...' },
    ],
  },
  {
    id: 'behavior',
    title: 'Behavior & Communication',
    icon: Heart,
    color: '#8E6BBF',
    description: 'How they communicate and express themselves',
    fields: [
      { id: 'communication', label: 'How They Communicate', type: 'textarea', rows: 3, placeholder: 'Verbal, AAC, signs, behaviors that communicate...' },
      { id: 'behaviorPatterns', label: 'Behavior Patterns to Understand', type: 'textarea', rows: 3, placeholder: 'Typical behaviors and what they mean...' },
      { id: 'triggers', label: 'Known Triggers & Stressors', type: 'textarea', rows: 2, placeholder: 'Things that cause distress...' },
      { id: 'calmingStrategies', label: 'Calming Strategies That Work', type: 'textarea', rows: 3, placeholder: 'What helps when upset...' },
      { id: 'behaviorDontDo', label: 'What NOT to Do', type: 'textarea', rows: 2, placeholder: 'Approaches that make things worse...' },
    ],
  },
  {
    id: 'education',
    title: 'Education & Work',
    icon: Briefcase,
    color: '#20B2AA',
    description: 'Learning, employment, and day activities',
    fields: [
      { id: 'educationHistory', label: 'Education History', type: 'textarea', rows: 2, placeholder: 'Schools attended, degrees, programs...' },
      { id: 'currentDayProgram', label: 'Current Day Program / Work', type: 'textarea', rows: 2, placeholder: 'What they do during the day now...' },
      { id: 'idealDayActivities', label: 'Ideal Day Activities', type: 'textarea', rows: 3, placeholder: 'What kind of day program, work, or activities would be ideal...' },
      { id: 'workStrengths', label: 'Work-Related Strengths', type: 'textarea', rows: 2, placeholder: 'Skills, abilities, interests for employment...' },
      { id: 'learningStyle', label: 'How They Learn Best', type: 'textarea', rows: 2, placeholder: 'Learning style, accommodations that help...' },
    ],
  },
  {
    id: 'social',
    title: 'Social & Recreation',
    icon: MapPin,
    color: '#EC4899',
    description: 'Hobbies, interests, and community',
    fields: [
      { id: 'hobbies', label: 'Hobbies & Interests', type: 'textarea', rows: 3, placeholder: 'Things they enjoy doing...' },
      { id: 'socialActivities', label: 'Social Activities & Groups', type: 'textarea', rows: 2, placeholder: 'Clubs, groups, community involvement...' },
      { id: 'religiousSpiritual', label: 'Religious / Spiritual Preferences', type: 'textarea', rows: 2, placeholder: 'Faith, religious practices, spiritual needs...' },
      { id: 'vacationPreferences', label: 'Vacation / Travel Preferences', type: 'textarea', rows: 2, placeholder: 'How they like to spend holidays, travel preferences...' },
      { id: 'likes', label: 'Likes', type: 'textarea', rows: 2, placeholder: 'Favorite things, activities, foods, music...' },
      { id: 'dislikes', label: 'Dislikes', type: 'textarea', rows: 2, placeholder: 'Things to avoid...' },
    ],
  },
  {
    id: 'financial',
    title: 'Financial & Legal',
    icon: DollarSign,
    color: '#64748B',
    description: 'Financial resources and legal matters',
    fields: [
      { id: 'incomeResources', label: 'Income & Resources', type: 'textarea', rows: 3, placeholder: 'SSI, SSDI, trust funds, employment income...' },
      { id: 'benefits', label: 'Government Benefits', type: 'textarea', rows: 2, placeholder: 'Medicaid, Medicare, SNAP, housing assistance...' },
      { id: 'specialNeedsTrust', label: 'Special Needs Trust Information', type: 'textarea', rows: 3, placeholder: 'If there is a trust: trustee name, bank, purpose...' },
      { id: 'financialAdvisor', label: 'Financial Advisor / Contact', type: 'textarea', rows: 2, placeholder: 'Name and contact info...' },
      { id: 'guardianship', label: 'Guardianship / Conservatorship', type: 'textarea', rows: 2, placeholder: 'Current legal arrangements...' },
      { id: 'futureGuardian', label: 'Successor Guardian', type: 'textarea', rows: 2, placeholder: 'Who should be guardian if current guardian cannot serve...' },
    ],
  },
  {
    id: 'final',
    title: 'Final Wishes',
    icon: Shield,
    color: '#9333EA',
    description: 'Final thoughts and wishes',
    fields: [
      { id: 'finalWishes', label: 'My Final Wishes for Them', type: 'textarea', rows: 4, placeholder: 'What I want most for their life and happiness...' },
      { id: 'importantValues', label: 'Important Values to Honor', type: 'textarea', rows: 3, placeholder: 'Values and principles that should guide their care...' },
      { id: 'additionalNotes', label: 'Additional Notes', type: 'textarea', rows: 3, placeholder: 'Anything else future caregivers should know...' },
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
// DOCUMENT PREVIEW
// ============================================
const DocumentPreview = ({ data }) => {
  const handlePrint = () => window.print();
  
  const hasContent = (sectionId) => {
    const section = SECTIONS.find(s => s.id === sectionId);
    return section?.fields.some(f => data[f.id]?.trim());
  };
  
  return (
    <div className="bg-white rounded-2xl border-3 border-gray-200 overflow-hidden">
      {/* Print Button */}
      <div className="p-3 bg-gray-50 border-b flex justify-between items-center print:hidden">
        <span className="font-display text-sm text-gray-600">Document Preview</span>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-[#4A9FD4] text-white rounded-lg font-display text-sm hover:bg-blue-600 transition-colors"
        >
          <Printer size={16} />
          Print Document
        </button>
      </div>
      
      {/* Document Content */}
      <div className="p-8 print:p-6" id="memorandum-print">
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
          <h1 className="text-3xl font-display text-[#4A9FD4] mb-2">
            Letter of Intent
          </h1>
          <h2 className="text-xl font-display text-gray-700">
            For: {data.personName || '[Name]'}
          </h2>
          {data.preparedBy && (
            <p className="font-crayon text-gray-500 mt-2">
              Prepared by: {data.preparedBy}
            </p>
          )}
          {data.preparedDate && (
            <p className="font-crayon text-sm text-gray-400">
              Date: {new Date(data.preparedDate).toLocaleDateString('en-US', { 
                month: 'long', day: 'numeric', year: 'numeric' 
              })}
            </p>
          )}
        </div>
        
        {/* Legal Notice */}
        <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl print:bg-amber-50">
          <p className="font-crayon text-sm text-amber-800">
            <strong>Important:</strong> This is a Letter of Intent, not a legal document. 
            It is meant to provide guidance and express wishes but is not legally binding. 
            Legal documents such as wills, trusts, and guardianship papers should be prepared 
            with an attorney.
          </p>
        </div>
        
        {/* Purpose */}
        {data.purpose && (
          <div className="mb-6">
            <p className="font-crayon text-gray-700 italic">{data.purpose}</p>
          </div>
        )}
        
        {/* Sections */}
        <div className="space-y-6 print:space-y-4">
          {SECTIONS.filter(s => s.id !== 'intro' && hasContent(s.id)).map(section => (
            <div key={section.id} className="print:break-inside-avoid">
              <h3 
                className="font-display text-lg mb-3 pb-2 border-b flex items-center gap-2"
                style={{ color: section.color, borderColor: `${section.color}50` }}
              >
                {(() => {
                  const Icon = section.icon;
                  return <Icon size={20} />;
                })()}
                {section.title}
              </h3>
              
              <div className="space-y-4 pl-2">
                {section.fields.map(field => {
                  const value = data[field.id];
                  if (!value?.trim()) return null;
                  
                  return (
                    <div key={field.id}>
                      <p className="font-display text-sm text-gray-600 mb-1">{field.label}</p>
                      <p className="font-crayon text-gray-800 whitespace-pre-line">{value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200">
          <p className="font-crayon text-center text-gray-500">
            This Letter of Intent was created with love and care for {data.personName || '[Name]'}.
          </p>
          <p className="font-crayon text-center text-xs text-gray-400 mt-2">
            Created with ATLASassist • Review and update this document regularly
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const MemorandumOfIntent = () => {
  const navigate = useNavigate();
  
  // State
  const [data, setData] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [view, setView] = useState('edit');
  const [showInfo, setShowInfo] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed.data || {});
        setLastSaved(parsed.lastSaved || null);
      } catch (e) {
        console.error('Error loading memorandum:', e);
      }
    }
  }, []);
  
  // Save data
  const saveData = () => {
    const saveObj = { data, lastSaved: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveObj));
    setHasChanges(false);
    setLastSaved(saveObj.lastSaved);
  };
  
  // Handle field change
  const handleFieldChange = (fieldId, value) => {
    setData(prev => ({ ...prev, [fieldId]: value }));
    setHasChanges(true);
  };
  
  // Navigation
  const goNext = () => currentSection < SECTIONS.length - 1 && setCurrentSection(prev => prev + 1);
  const goPrev = () => currentSection > 0 && setCurrentSection(prev => prev - 1);
  
  // Progress
  const calculateProgress = () => {
    const totalFields = SECTIONS.reduce((acc, s) => acc + s.fields.length, 0);
    const filledFields = Object.values(data).filter(v => v?.toString().trim()).length;
    return Math.round((filledFields / totalFields) * 100);
  };
  
  const section = SECTIONS[currentSection];

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#4A9FD4]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => {
              if (hasChanges && confirm('Save changes before leaving?')) saveData();
              navigate('/planning');
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#4A9FD4] 
                       rounded-xl font-display font-bold text-[#4A9FD4] hover:bg-[#4A9FD4] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <img src="/logo.jpeg" alt="ATLASassist" className="w-10 h-10 rounded-lg shadow-sm" />
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#4A9FD4] crayon-text flex items-center gap-2">
              <Scale size={24} />
              Letter of Intent
            </h1>
          </div>
          <button onClick={() => setShowInfo(true)} className="p-2 rounded-full hover:bg-gray-100">
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
              view === 'edit' ? 'bg-[#4A9FD4] text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-600'
            }`}
          >
            <Edit3 size={18} /> Edit Document
          </button>
          <button
            onClick={() => { saveData(); setView('preview'); }}
            className={`flex-1 py-3 rounded-xl font-display transition-all flex items-center justify-center gap-2 ${
              view === 'preview' ? 'bg-[#4A9FD4] text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-600'
            }`}
          >
            <Eye size={18} /> Preview & Print
          </button>
        </div>

        {/* EDIT VIEW */}
        {view === 'edit' && (
          <div>
            {/* Important Notice */}
            <div className="mb-4 p-3 bg-amber-50 border-2 border-amber-300 rounded-xl flex items-start gap-2">
              <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="font-crayon text-sm text-amber-700">
                <strong>Note:</strong> This is a guidance document, not a legal will or trust. 
                Work with an attorney for legal documents.
              </p>
            </div>
            
            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm font-crayon text-gray-500 mb-1">
                <span>Completion</span>
                <span>{calculateProgress()}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#4A9FD4] transition-all" style={{ width: `${calculateProgress()}%` }} />
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
                      currentSection === i ? 'text-white shadow-md' : hasContent ? 'bg-white border-2 text-gray-600' : 'bg-gray-100 text-gray-400'
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
            
            {/* Current Section Form */}
            <div className="p-4 rounded-2xl mb-4" style={{ backgroundColor: `${section.color}10` }}>
              <h2 className="font-display text-lg mb-1 flex items-center gap-2" style={{ color: section.color }}>
                {(() => { const Icon = section.icon; return <Icon size={20} />; })()}
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
                className="flex-1 py-3 border-3 border-gray-200 rounded-xl font-display text-gray-600 hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ChevronLeft size={18} /> Previous
              </button>
              
              {currentSection < SECTIONS.length - 1 ? (
                <button
                  onClick={goNext}
                  className="flex-1 py-3 text-white rounded-xl font-display hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ backgroundColor: section.color }}
                >
                  Next <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={() => { saveData(); setView('preview'); }}
                  className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl font-display hover:bg-green-600 flex items-center justify-center gap-2"
                >
                  <Eye size={18} /> Preview Document
                </button>
              )}
            </div>
            
            {/* Save Button */}
            {hasChanges && (
              <button
                onClick={saveData}
                className="w-full mt-3 py-3 border-3 border-[#5CB85C] text-[#5CB85C] rounded-xl font-display hover:bg-[#5CB85C] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Save size={18} /> Save Progress
              </button>
            )}
            
            {lastSaved && (
              <p className="text-center font-crayon text-xs text-gray-400 mt-2">
                <Clock size={12} className="inline mr-1" />
                Last saved: {new Date(lastSaved).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* PREVIEW VIEW */}
        {view === 'preview' && <DocumentPreview data={data} />}
        
        {/* Tips */}
        <div className="mt-6 p-4 bg-[#4A9FD4]/10 rounded-2xl border-3 border-[#4A9FD4]/30 print:hidden">
          <h3 className="font-display text-[#4A9FD4] mb-2">💡 Tips for Your Letter of Intent</h3>
          <ul className="font-crayon text-sm text-gray-600 space-y-1">
            <li>• Update this document at least annually</li>
            <li>• Share copies with potential future caregivers</li>
            <li>• Store with your legal documents (will, trust)</li>
            <li>• Include as much detail as possible - small things matter</li>
            <li>• Consider including photos separately</li>
          </ul>
        </div>
      </main>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-[#4A9FD4]">About Letter of Intent</h2>
              <button onClick={() => setShowInfo(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-3 font-crayon text-gray-600">
              <p>
                <strong>What is it?</strong> A Letter of Intent (or Memorandum of Intent) is a document 
                that provides future caregivers with detailed information about your loved one's life, 
                preferences, needs, and your wishes for their care.
              </p>
              <p>
                <strong>Why create one?</strong>
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Ensures continuity of care if you can no longer provide it</li>
                <li>Helps future caregivers understand the whole person</li>
                <li>Preserves important information that might otherwise be lost</li>
                <li>Provides peace of mind that your wishes are documented</li>
              </ul>
              <p>
                <strong>Is it legal?</strong> No - this is a guidance document, not a legal document. 
                You should also work with an attorney to create a will, special needs trust, and 
                guardianship documents.
              </p>
              <p>
                <strong>Who should have a copy?</strong>
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Successor guardians or caregivers</li>
                <li>Trustees of any special needs trust</li>
                <li>Close family members</li>
                <li>Your attorney</li>
              </ul>
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

      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #memorandum-print, #memorandum-print * { visibility: visible; }
          #memorandum-print { position: absolute; left: 0; top: 0; width: 100%; }
          header, .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default MemorandumOfIntent;
