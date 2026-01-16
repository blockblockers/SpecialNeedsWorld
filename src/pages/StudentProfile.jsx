// StudentProfile.jsx - Student Profile / One-Pager Generator
// Creates a single-page summary document for teachers, aides, and school staff
// Part of the Planning & Documents hub

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User,
  Save,
  Printer,
  Download,
  ChevronRight,
  ChevronLeft,
  Check,
  Camera,
  X,
  HelpCircle,
  FileText,
  Share2,
  Eye,
  Edit3,
  Plus,
  Trash2,
  AlertCircle,
  Heart,
  MessageCircle,
  Zap,
  BookOpen,
  Users,
  Shield,
  Sparkles
} from 'lucide-react';

// ============================================
// STORAGE KEY
// ============================================
const STORAGE_KEY = 'snw_student_profiles';

// ============================================
// FORM SECTIONS
// ============================================
const SECTIONS = [
  {
    id: 'basic',
    title: 'Basic Information',
    icon: User,
    color: '#4A9FD4',
    fields: [
      { id: 'name', label: 'Name', type: 'text', placeholder: 'Full name', required: true },
      { id: 'nickname', label: 'Nickname / Preferred Name', type: 'text', placeholder: 'What do they like to be called?' },
      { id: 'age', label: 'Age', type: 'text', placeholder: 'e.g., 8 years old' },
      { id: 'grade', label: 'Grade / Class', type: 'text', placeholder: 'e.g., 3rd Grade' },
      { id: 'school', label: 'School', type: 'text', placeholder: 'School name' },
      { id: 'schoolYear', label: 'School Year', type: 'text', placeholder: 'e.g., 2024-2025' },
    ],
  },
  {
    id: 'about',
    title: 'About Me',
    icon: Heart,
    color: '#E86B9A',
    fields: [
      { id: 'likes', label: 'Things I Like / Interests', type: 'textarea', placeholder: 'Favorite activities, topics, toys, shows, etc.', rows: 3 },
      { id: 'strengths', label: 'My Strengths', type: 'textarea', placeholder: 'What am I good at? What do I enjoy?', rows: 2 },
      { id: 'motivators', label: 'What Motivates Me', type: 'textarea', placeholder: 'Rewards, activities, or things that encourage me', rows: 2 },
      { id: 'personality', label: 'My Personality', type: 'textarea', placeholder: 'Am I shy? Outgoing? Curious? Describe me!', rows: 2 },
    ],
  },
  {
    id: 'communication',
    title: 'Communication',
    icon: MessageCircle,
    color: '#F5A623',
    fields: [
      { id: 'commStyle', label: 'How I Communicate', type: 'textarea', placeholder: 'Verbal, AAC device, sign language, gestures, etc.', rows: 2 },
      { id: 'expressiveLevel', label: 'Expressive Language', type: 'select', options: ['Full sentences', 'Short phrases', 'Single words', 'Non-verbal / AAC', 'Other'] },
      { id: 'receptiveLevel', label: 'Receptive Language', type: 'select', options: ['Understands most conversation', 'Needs simple language', 'Needs visual supports', 'Responds to tone/gestures', 'Other'] },
      { id: 'commTips', label: 'Communication Tips', type: 'textarea', placeholder: 'Best ways to communicate with me, things to avoid', rows: 2 },
      { id: 'aacInfo', label: 'AAC / Device Info', type: 'textarea', placeholder: 'If applicable: device name, how to use it, where buttons are', rows: 2 },
    ],
  },
  {
    id: 'sensory',
    title: 'Sensory Needs',
    icon: Sparkles,
    color: '#8E6BBF',
    fields: [
      { id: 'sensoryLikes', label: 'Sensory Things I Like', type: 'textarea', placeholder: 'Textures, sounds, movements I enjoy', rows: 2 },
      { id: 'sensoryAvoid', label: 'Sensory Things I Avoid', type: 'textarea', placeholder: 'Sounds, textures, lights, smells that bother me', rows: 2 },
      { id: 'sensoryTools', label: 'Sensory Tools That Help', type: 'textarea', placeholder: 'Fidgets, noise-canceling headphones, weighted items, etc.', rows: 2 },
      { id: 'sensoryBreaks', label: 'Sensory Break Needs', type: 'textarea', placeholder: 'How often? What helps? Signs I need a break?', rows: 2 },
    ],
  },
  {
    id: 'learning',
    title: 'Learning Style',
    icon: BookOpen,
    color: '#5CB85C',
    fields: [
      { id: 'learnsBest', label: 'I Learn Best When...', type: 'textarea', placeholder: 'Visual aids, hands-on, verbal instruction, small groups, etc.', rows: 2 },
      { id: 'challenges', label: 'Things That Are Hard For Me', type: 'textarea', placeholder: 'Academic or environmental challenges', rows: 2 },
      { id: 'accommodations', label: 'Helpful Accommodations', type: 'textarea', placeholder: 'Extra time, preferential seating, visual schedules, etc.', rows: 2 },
      { id: 'transitions', label: 'Transitions', type: 'textarea', placeholder: 'How I handle changes, warnings needed, strategies that help', rows: 2 },
    ],
  },
  {
    id: 'support',
    title: 'Support Needs',
    icon: Shield,
    color: '#E63B2E',
    fields: [
      { id: 'triggers', label: 'Things That Upset Me / Triggers', type: 'textarea', placeholder: 'Situations, sounds, changes that are difficult', rows: 2 },
      { id: 'warningSignals', label: 'Warning Signs I\'m Getting Upset', type: 'textarea', placeholder: 'What does it look like when I\'m starting to struggle?', rows: 2 },
      { id: 'calmingStrategies', label: 'What Helps Me Calm Down', type: 'textarea', placeholder: 'Strategies, tools, people, or places that help', rows: 3 },
      { id: 'doNotDo', label: 'Please Do NOT Do These Things', type: 'textarea', placeholder: 'Things that make it worse or I really dislike', rows: 2 },
    ],
  },
  {
    id: 'safety',
    title: 'Safety & Medical',
    icon: AlertCircle,
    color: '#DC2626',
    fields: [
      { id: 'allergies', label: 'Allergies', type: 'textarea', placeholder: 'Food, environmental, medication allergies', rows: 2 },
      { id: 'medical', label: 'Medical Conditions', type: 'textarea', placeholder: 'Diagnoses, conditions staff should know about', rows: 2 },
      { id: 'medications', label: 'Medications at School', type: 'textarea', placeholder: 'Names, times, what they\'re for', rows: 2 },
      { id: 'safetyNeeds', label: 'Safety Concerns', type: 'textarea', placeholder: 'Elopement risk, pica, seizures, etc.', rows: 2 },
    ],
  },
  {
    id: 'team',
    title: 'Important People',
    icon: Users,
    color: '#0891B2',
    fields: [
      { id: 'parent1', label: 'Parent/Guardian 1', type: 'text', placeholder: 'Name and relationship' },
      { id: 'parent1Phone', label: 'Phone', type: 'tel', placeholder: 'Phone number' },
      { id: 'parent2', label: 'Parent/Guardian 2', type: 'text', placeholder: 'Name and relationship' },
      { id: 'parent2Phone', label: 'Phone', type: 'tel', placeholder: 'Phone number' },
      { id: 'emergency', label: 'Emergency Contact', type: 'text', placeholder: 'Name, relationship, phone' },
      { id: 'therapists', label: 'Therapists / Specialists', type: 'textarea', placeholder: 'Names and roles (OT, SLP, etc.)', rows: 2 },
    ],
  },
];

// ============================================
// FORM FIELD COMPONENT
// ============================================
const FormField = ({ field, value, onChange }) => {
  const baseClasses = "w-full px-4 py-3 rounded-xl border-3 border-gray-200 focus:border-[#4A9FD4] outline-none font-crayon transition-colors";
  
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
          className={`${baseClasses} resize-none`}
        />
      </div>
    );
  }
  
  if (field.type === 'select') {
    return (
      <div>
        <label className="block font-display text-sm text-gray-700 mb-1">
          {field.label}
        </label>
        <select
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={baseClasses}
        >
          <option value="">Select...</option>
          {field.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
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
        className={baseClasses}
      />
    </div>
  );
};

// ============================================
// ONE-PAGER PREVIEW COMPONENT
// ============================================
const OnePagerPreview = ({ data, photo }) => {
  const printRef = useRef(null);
  
  const handlePrint = () => {
    window.print();
  };
  
  // Helper to check if section has content
  const hasContent = (sectionId) => {
    const section = SECTIONS.find(s => s.id === sectionId);
    if (!section) return false;
    return section.fields.some(field => data[field.id]?.trim());
  };
  
  return (
    <div className="bg-white rounded-2xl border-3 border-gray-200 overflow-hidden">
      {/* Print Button */}
      <div className="p-3 bg-gray-50 border-b flex justify-between items-center print:hidden">
        <span className="font-display text-sm text-gray-600">Preview</span>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-[#4A9FD4] text-white rounded-lg font-display text-sm hover:bg-blue-600 transition-colors"
        >
          <Printer size={16} />
          Print
        </button>
      </div>
      
      {/* One-Pager Content */}
      <div ref={printRef} className="p-6 print:p-4" id="one-pager">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4 pb-4 border-b-2 border-gray-200">
          {/* Photo */}
          <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-gray-200">
            {photo ? (
              <img src={photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-gray-400" />
            )}
          </div>
          
          {/* Name & Basic Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-display text-[#4A9FD4]">
              {data.name || 'Student Name'}
            </h1>
            {data.nickname && (
              <p className="font-crayon text-gray-500">"{data.nickname}"</p>
            )}
            <div className="flex flex-wrap gap-3 mt-2 text-sm font-crayon text-gray-600">
              {data.age && <span>Age: {data.age}</span>}
              {data.grade && <span>• {data.grade}</span>}
              {data.school && <span>• {data.school}</span>}
            </div>
            {data.schoolYear && (
              <p className="font-crayon text-xs text-gray-400 mt-1">{data.schoolYear}</p>
            )}
          </div>
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm print:text-xs">
          {/* About Me */}
          {hasContent('about') && (
            <div className="p-3 rounded-xl bg-pink-50 border border-pink-200">
              <h2 className="font-display text-[#E86B9A] mb-2 flex items-center gap-1">
                <Heart size={14} /> About Me
              </h2>
              {data.likes && (
                <p className="font-crayon text-gray-600 mb-1">
                  <strong>I like:</strong> {data.likes}
                </p>
              )}
              {data.strengths && (
                <p className="font-crayon text-gray-600 mb-1">
                  <strong>Strengths:</strong> {data.strengths}
                </p>
              )}
              {data.motivators && (
                <p className="font-crayon text-gray-600">
                  <strong>Motivators:</strong> {data.motivators}
                </p>
              )}
            </div>
          )}
          
          {/* Communication */}
          {hasContent('communication') && (
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
              <h2 className="font-display text-[#F5A623] mb-2 flex items-center gap-1">
                <MessageCircle size={14} /> Communication
              </h2>
              {data.commStyle && (
                <p className="font-crayon text-gray-600 mb-1">
                  <strong>How I communicate:</strong> {data.commStyle}
                </p>
              )}
              {data.commTips && (
                <p className="font-crayon text-gray-600">
                  <strong>Tips:</strong> {data.commTips}
                </p>
              )}
            </div>
          )}
          
          {/* Sensory */}
          {hasContent('sensory') && (
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
              <h2 className="font-display text-[#8E6BBF] mb-2 flex items-center gap-1">
                <Sparkles size={14} /> Sensory Needs
              </h2>
              {data.sensoryLikes && (
                <p className="font-crayon text-gray-600 mb-1">
                  <strong>I like:</strong> {data.sensoryLikes}
                </p>
              )}
              {data.sensoryAvoid && (
                <p className="font-crayon text-gray-600 mb-1">
                  <strong>I avoid:</strong> {data.sensoryAvoid}
                </p>
              )}
              {data.sensoryTools && (
                <p className="font-crayon text-gray-600">
                  <strong>Tools that help:</strong> {data.sensoryTools}
                </p>
              )}
            </div>
          )}
          
          {/* Learning */}
          {hasContent('learning') && (
            <div className="p-3 rounded-xl bg-green-50 border border-green-200">
              <h2 className="font-display text-[#5CB85C] mb-2 flex items-center gap-1">
                <BookOpen size={14} /> Learning Style
              </h2>
              {data.learnsBest && (
                <p className="font-crayon text-gray-600 mb-1">
                  <strong>I learn best:</strong> {data.learnsBest}
                </p>
              )}
              {data.accommodations && (
                <p className="font-crayon text-gray-600">
                  <strong>Helpful:</strong> {data.accommodations}
                </p>
              )}
            </div>
          )}
          
          {/* Support Needs - Full Width */}
          {hasContent('support') && (
            <div className="col-span-2 p-3 rounded-xl bg-red-50 border border-red-200">
              <h2 className="font-display text-[#E63B2E] mb-2 flex items-center gap-1">
                <Shield size={14} /> Support Needs
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  {data.triggers && (
                    <p className="font-crayon text-gray-600 mb-1">
                      <strong>⚠️ Triggers:</strong> {data.triggers}
                    </p>
                  )}
                  {data.warningSignals && (
                    <p className="font-crayon text-gray-600">
                      <strong>Warning signs:</strong> {data.warningSignals}
                    </p>
                  )}
                </div>
                <div>
                  {data.calmingStrategies && (
                    <p className="font-crayon text-gray-600 mb-1">
                      <strong>✅ What helps:</strong> {data.calmingStrategies}
                    </p>
                  )}
                  {data.doNotDo && (
                    <p className="font-crayon text-gray-600">
                      <strong>🚫 Do NOT:</strong> {data.doNotDo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Safety - if has content */}
          {hasContent('safety') && (
            <div className="p-3 rounded-xl bg-red-100 border-2 border-red-300">
              <h2 className="font-display text-red-700 mb-2 flex items-center gap-1">
                <AlertCircle size={14} /> ⚠️ Safety & Medical
              </h2>
              {data.allergies && (
                <p className="font-crayon text-gray-700 mb-1">
                  <strong>ALLERGIES:</strong> {data.allergies}
                </p>
              )}
              {data.medical && (
                <p className="font-crayon text-gray-700 mb-1">
                  <strong>Medical:</strong> {data.medical}
                </p>
              )}
              {data.safetyNeeds && (
                <p className="font-crayon text-gray-700">
                  <strong>Safety:</strong> {data.safetyNeeds}
                </p>
              )}
            </div>
          )}
          
          {/* Contacts */}
          {hasContent('team') && (
            <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200">
              <h2 className="font-display text-[#0891B2] mb-2 flex items-center gap-1">
                <Users size={14} /> Contacts
              </h2>
              {data.parent1 && (
                <p className="font-crayon text-gray-600">
                  {data.parent1} {data.parent1Phone && `- ${data.parent1Phone}`}
                </p>
              )}
              {data.parent2 && (
                <p className="font-crayon text-gray-600">
                  {data.parent2} {data.parent2Phone && `- ${data.parent2Phone}`}
                </p>
              )}
              {data.emergency && (
                <p className="font-crayon text-gray-600 mt-1">
                  <strong>Emergency:</strong> {data.emergency}
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-200 text-center">
          <p className="font-crayon text-xs text-gray-400">
            Created with ATLASassist • Updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const StudentProfile = () => {
  const navigate = useNavigate();
  
  // State
  const [profiles, setProfiles] = useState([]);
  const [currentProfileId, setCurrentProfileId] = useState(null);
  const [formData, setFormData] = useState({});
  const [photo, setPhoto] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [view, setView] = useState('list'); // list, form, preview
  const [showInfo, setShowInfo] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const fileInputRef = useRef(null);
  
  // Load profiles
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setProfiles(data.profiles || []);
      } catch (e) {
        console.error('Error loading profiles:', e);
      }
    }
  }, []);
  
  // Save profiles
  const saveProfiles = (updatedProfiles) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profiles: updatedProfiles }));
    setProfiles(updatedProfiles);
  };
  
  // Create new profile
  const createNewProfile = () => {
    const newId = `profile_${Date.now()}`;
    setCurrentProfileId(newId);
    setFormData({});
    setPhoto(null);
    setCurrentSection(0);
    setHasChanges(false);
    setView('form');
  };
  
  // Edit existing profile
  const editProfile = (profile) => {
    setCurrentProfileId(profile.id);
    setFormData(profile.data || {});
    setPhoto(profile.photo || null);
    setCurrentSection(0);
    setHasChanges(false);
    setView('form');
  };
  
  // Delete profile
  const deleteProfile = (profileId) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      const updated = profiles.filter(p => p.id !== profileId);
      saveProfiles(updated);
    }
  };
  
  // Handle field change
  const handleFieldChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
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
  
  // Save current profile
  const saveCurrentProfile = () => {
    const profile = {
      id: currentProfileId,
      data: formData,
      photo,
      updatedAt: new Date().toISOString(),
      name: formData.name || 'Unnamed Profile',
    };
    
    const existingIndex = profiles.findIndex(p => p.id === currentProfileId);
    let updated;
    if (existingIndex >= 0) {
      updated = [...profiles];
      updated[existingIndex] = profile;
    } else {
      updated = [...profiles, profile];
    }
    
    saveProfiles(updated);
    setHasChanges(false);
  };
  
  // Navigation between sections
  const goToNextSection = () => {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };
  
  const goToPrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };
  
  // Calculate progress
  const calculateProgress = () => {
    const totalFields = SECTIONS.reduce((acc, section) => acc + section.fields.length, 0);
    const filledFields = Object.values(formData).filter(v => v?.trim()).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#4A9FD4]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => {
              if (view === 'form' && hasChanges) {
                if (confirm('You have unsaved changes. Save before leaving?')) {
                  saveCurrentProfile();
                }
              }
              if (view === 'list') {
                navigate('/planning');
              } else {
                setView('list');
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#4A9FD4] 
                       rounded-xl font-display font-bold text-[#4A9FD4] hover:bg-[#4A9FD4] 
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
            <h1 className="text-lg sm:text-xl font-display text-[#4A9FD4] crayon-text flex items-center gap-2">
              <FileText size={24} />
              Student Profile
            </h1>
          </div>
          
          {/* Actions */}
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
        
        {/* ============================================ */}
        {/* LIST VIEW */}
        {/* ============================================ */}
        {view === 'list' && (
          <div>
            <p className="text-center text-gray-600 font-crayon mb-6">
              📄 Create one-page summaries for teachers and school staff
            </p>
            
            {/* Create New Button */}
            <button
              onClick={createNewProfile}
              className="w-full p-4 mb-4 border-3 border-dashed border-[#4A9FD4] rounded-2xl
                       font-display text-[#4A9FD4] hover:bg-[#4A9FD4]/10 transition-colors
                       flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Create New Profile
            </button>
            
            {/* Existing Profiles */}
            {profiles.length > 0 ? (
              <div className="space-y-3">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="p-4 bg-white rounded-2xl border-3 border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      {/* Photo */}
                      <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {profile.photo ? (
                          <img src={profile.photo} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User size={24} className="text-gray-400" />
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="font-display text-gray-800">{profile.name}</h3>
                        <p className="font-crayon text-xs text-gray-500">
                          Updated: {new Date(profile.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => { editProfile(profile); setView('preview'); }}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                          title="View"
                        >
                          <Eye size={18} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => editProfile(profile)}
                          className="p-2 rounded-lg bg-[#4A9FD4]/10 hover:bg-[#4A9FD4]/20 transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={18} className="text-[#4A9FD4]" />
                        </button>
                        <button
                          onClick={() => deleteProfile(profile.id)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <User size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="font-crayon text-gray-500">No profiles yet</p>
                <p className="font-crayon text-sm text-gray-400">
                  Create your first student profile above
                </p>
              </div>
            )}
            
            {/* Info Box */}
            <div className="mt-6 p-4 bg-[#4A9FD4]/10 rounded-2xl border-3 border-[#4A9FD4]/30">
              <h3 className="font-display text-[#4A9FD4] mb-2">💡 What is a Student Profile?</h3>
              <p className="font-crayon text-sm text-gray-600">
                A one-page document that gives teachers, aides, and school staff a quick snapshot 
                of your child. Share it at the start of each school year, with substitute teachers, 
                or anyone new working with your child.
              </p>
            </div>
          </div>
        )}
        
        {/* ============================================ */}
        {/* FORM VIEW */}
        {/* ============================================ */}
        {view === 'form' && (
          <div>
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm font-crayon text-gray-500 mb-1">
                <span>Progress</span>
                <span>{calculateProgress()}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#5CB85C] transition-all duration-300"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
            </div>
            
            {/* Section Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-2 mb-4">
              {SECTIONS.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(index)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-crayon transition-all
                            ${currentSection === index 
                              ? 'text-white' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                  style={{
                    backgroundColor: currentSection === index ? section.color : undefined
                  }}
                >
                  {section.title}
                </button>
              ))}
            </div>
            
            {/* Photo Upload (shown in Basic section) */}
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
                    className="px-4 py-2 bg-gray-100 rounded-lg font-crayon text-sm text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    {photo ? 'Change Photo' : 'Add Photo'}
                  </button>
                  {photo && (
                    <button
                      onClick={() => { setPhoto(null); setHasChanges(true); }}
                      className="ml-2 text-red-500 text-sm font-crayon hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {/* Current Section */}
            <div 
              className="p-4 rounded-2xl mb-4"
              style={{ backgroundColor: `${SECTIONS[currentSection].color}10` }}
            >
              <h2 
                className="font-display text-lg mb-4 flex items-center gap-2"
                style={{ color: SECTIONS[currentSection].color }}
              >
                {(() => {
                  const Icon = SECTIONS[currentSection].icon;
                  return <Icon size={20} />;
                })()}
                {SECTIONS[currentSection].title}
              </h2>
              
              <div className="space-y-4">
                {SECTIONS[currentSection].fields.map(field => (
                  <FormField
                    key={field.id}
                    field={field}
                    value={formData[field.id]}
                    onChange={handleFieldChange}
                  />
                ))}
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex gap-3">
              <button
                onClick={goToPrevSection}
                disabled={currentSection === 0}
                className="flex-1 py-3 border-3 border-gray-200 rounded-xl font-display text-gray-600
                         hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              
              {currentSection < SECTIONS.length - 1 ? (
                <button
                  onClick={goToNextSection}
                  className="flex-1 py-3 bg-[#4A9FD4] text-white rounded-xl font-display
                           hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={() => { saveCurrentProfile(); setView('preview'); }}
                  className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl font-display
                           hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye size={18} />
                  Preview & Save
                </button>
              )}
            </div>
            
            {/* Save Button */}
            {hasChanges && (
              <button
                onClick={saveCurrentProfile}
                className="w-full mt-3 py-3 border-3 border-[#5CB85C] text-[#5CB85C] rounded-xl font-display
                         hover:bg-[#5CB85C] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Save Progress
              </button>
            )}
          </div>
        )}
        
        {/* ============================================ */}
        {/* PREVIEW VIEW */}
        {/* ============================================ */}
        {view === 'preview' && (
          <div>
            <div className="flex gap-2 mb-4 print:hidden">
              <button
                onClick={() => setView('form')}
                className="flex-1 py-3 border-3 border-[#4A9FD4] text-[#4A9FD4] rounded-xl font-display
                         hover:bg-[#4A9FD4]/10 transition-colors flex items-center justify-center gap-2"
              >
                <Edit3 size={18} />
                Edit
              </button>
              <button
                onClick={() => setView('list')}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-display
                         hover:bg-gray-200 transition-colors"
              >
                All Profiles
              </button>
            </div>
            
            <OnePagerPreview data={formData} photo={photo} />
          </div>
        )}
      </main>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-[#4A9FD4]">About Student Profiles</h2>
              <button onClick={() => setShowInfo(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-3 font-crayon text-gray-600">
              <p>
                <strong>What is it?</strong> A one-page summary that helps teachers and staff 
                quickly understand your child's needs, strengths, and how to best support them.
              </p>
              <p>
                <strong>Who should get one?</strong>
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Classroom teachers</li>
                <li>Special education teachers</li>
                <li>Paraprofessionals/aides</li>
                <li>Substitute teachers</li>
                <li>Specials teachers (art, music, PE)</li>
                <li>School counselors</li>
                <li>Therapists (OT, SLP, PT)</li>
              </ul>
              <p>
                <strong>When to update:</strong> At the start of each school year, after 
                significant changes, or when starting with new providers.
              </p>
              <p>
                <strong>Tips:</strong>
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Keep it to one page - brief is better</li>
                <li>Focus on what's most important</li>
                <li>Include a recent photo</li>
                <li>Update contact info regularly</li>
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
          body * {
            visibility: hidden;
          }
          #one-pager, #one-pager * {
            visibility: visible;
          }
          #one-pager {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          header, .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentProfile;
