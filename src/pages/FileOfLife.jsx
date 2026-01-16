// FileOfLife.jsx - Emergency Medical Information Document
// Standardized format recognized by first responders
// Part of the Planning & Documents hub

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart,
  Save,
  Printer,
  Download,
  ChevronRight,
  ChevronLeft,
  Check,
  Camera,
  X,
  HelpCircle,
  AlertTriangle,
  Shield,
  Phone,
  Pill,
  Stethoscope,
  User,
  Users,
  FileText,
  QrCode,
  CreditCard,
  Eye,
  Edit3,
  Plus,
  Trash2,
  MessageCircle,
  Sparkles,
  Clock
} from 'lucide-react';

// ============================================
// STORAGE KEY
// ============================================
const STORAGE_KEY = 'snw_file_of_life';

// ============================================
// FORM SECTIONS
// ============================================
const SECTIONS = [
  {
    id: 'personal',
    title: 'Personal Information',
    icon: User,
    color: '#4A9FD4',
    fields: [
      { id: 'fullName', label: 'Full Legal Name', type: 'text', required: true },
      { id: 'preferredName', label: 'Preferred Name / Nickname', type: 'text' },
      { id: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { id: 'address', label: 'Home Address', type: 'textarea', rows: 2 },
      { id: 'bloodType', label: 'Blood Type', type: 'select', options: ['Unknown', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
      { id: 'weight', label: 'Approximate Weight', type: 'text', placeholder: 'e.g., 75 lbs' },
    ],
  },
  {
    id: 'emergency',
    title: 'Emergency Contacts',
    icon: Phone,
    color: '#E63B2E',
    fields: [
      { id: 'contact1Name', label: 'Emergency Contact 1 - Name', type: 'text', required: true },
      { id: 'contact1Relation', label: 'Relationship', type: 'text', placeholder: 'e.g., Mother' },
      { id: 'contact1Phone', label: 'Phone Number', type: 'tel', required: true },
      { id: 'contact2Name', label: 'Emergency Contact 2 - Name', type: 'text' },
      { id: 'contact2Relation', label: 'Relationship', type: 'text' },
      { id: 'contact2Phone', label: 'Phone Number', type: 'tel' },
      { id: 'contact3Name', label: 'Emergency Contact 3 - Name', type: 'text' },
      { id: 'contact3Relation', label: 'Relationship', type: 'text' },
      { id: 'contact3Phone', label: 'Phone Number', type: 'tel' },
    ],
  },
  {
    id: 'physician',
    title: 'Physician Information',
    icon: Stethoscope,
    color: '#5CB85C',
    fields: [
      { id: 'primaryDoc', label: 'Primary Care Physician', type: 'text' },
      { id: 'primaryDocPhone', label: 'Physician Phone', type: 'tel' },
      { id: 'specialists', label: 'Specialists (Name & Specialty)', type: 'textarea', rows: 3, placeholder: 'e.g., Dr. Smith - Neurologist\nDr. Jones - Cardiologist' },
      { id: 'preferredHospital', label: 'Preferred Hospital', type: 'text' },
      { id: 'hospitalAddress', label: 'Hospital Address', type: 'text' },
    ],
  },
  {
    id: 'conditions',
    title: 'Medical Conditions',
    icon: Heart,
    color: '#8E6BBF',
    fields: [
      { id: 'diagnoses', label: 'Diagnoses / Medical Conditions', type: 'textarea', rows: 4, placeholder: 'List all medical diagnoses', required: true },
      { id: 'surgeries', label: 'Past Surgeries', type: 'textarea', rows: 2, placeholder: 'Type and approximate date' },
      { id: 'implants', label: 'Medical Devices / Implants', type: 'textarea', rows: 2, placeholder: 'e.g., Pacemaker, VP shunt, cochlear implant' },
    ],
  },
  {
    id: 'allergies',
    title: 'Allergies',
    icon: AlertTriangle,
    color: '#F5A623',
    fields: [
      { id: 'drugAllergies', label: 'Drug Allergies', type: 'textarea', rows: 2, placeholder: 'List all medication allergies and reactions' },
      { id: 'foodAllergies', label: 'Food Allergies', type: 'textarea', rows: 2, placeholder: 'List food allergies - note if anaphylactic' },
      { id: 'otherAllergies', label: 'Other Allergies', type: 'textarea', rows: 2, placeholder: 'Environmental, latex, etc.' },
      { id: 'hasEpiPen', label: 'Carries EpiPen?', type: 'select', options: ['No', 'Yes - carries at all times', 'Yes - in backpack/bag', 'Yes - at home only'] },
    ],
  },
  {
    id: 'medications',
    title: 'Current Medications',
    icon: Pill,
    color: '#0891B2',
    fields: [
      { id: 'medications', label: 'Current Medications', type: 'textarea', rows: 5, placeholder: 'Name - Dose - Frequency - Purpose\n\nExample:\nKeppra - 500mg - 2x daily - Seizures\nRisperidone - 0.5mg - at bedtime - Behavior' },
      { id: 'asNeededMeds', label: 'As-Needed (PRN) Medications', type: 'textarea', rows: 3, placeholder: 'Rescue medications, breakthrough meds' },
      { id: 'medNotes', label: 'Important Medication Notes', type: 'textarea', rows: 2, placeholder: 'Interactions, cannot crush, etc.' },
    ],
  },
  {
    id: 'communication',
    title: 'Communication Needs',
    icon: MessageCircle,
    color: '#E86B9A',
    fields: [
      { id: 'commMethod', label: 'How They Communicate', type: 'textarea', rows: 2, placeholder: 'Verbal, AAC device, sign language, gestures, etc.' },
      { id: 'commTips', label: 'Communication Tips for Responders', type: 'textarea', rows: 3, placeholder: 'How to best communicate with this person' },
      { id: 'nonVerbalCues', label: 'Non-Verbal Cues', type: 'textarea', rows: 2, placeholder: 'Signs of pain, distress, or needs' },
    ],
  },
  {
    id: 'behavior',
    title: 'Behavioral Considerations',
    icon: Sparkles,
    color: '#8B5CF6',
    fields: [
      { id: 'behaviorNotes', label: 'Important Behavioral Information', type: 'textarea', rows: 3, placeholder: 'Information first responders should know about behavior' },
      { id: 'triggers', label: 'Known Triggers', type: 'textarea', rows: 2, placeholder: 'Things that may cause distress' },
      { id: 'calmingTechniques', label: 'Calming Techniques', type: 'textarea', rows: 3, placeholder: 'What helps them stay calm in stressful situations' },
      { id: 'flightRisk', label: 'Elopement / Flight Risk?', type: 'select', options: ['No', 'Yes - may run', 'Yes - may hide', 'Yes - attracted to water', 'Yes - attracted to roads/traffic'] },
    ],
  },
  {
    id: 'sensory',
    title: 'Sensory Sensitivities',
    icon: Sparkles,
    color: '#EC4899',
    fields: [
      { id: 'sensoryIssues', label: 'Sensory Sensitivities', type: 'textarea', rows: 3, placeholder: 'Sensitive to: loud noises, bright lights, touch, etc.' },
      { id: 'sensoryHelps', label: 'What Helps', type: 'textarea', rows: 2, placeholder: 'Noise-canceling headphones, dim lights, etc.' },
      { id: 'painExpression', label: 'How They Express Pain', type: 'textarea', rows: 2, placeholder: 'May not show typical pain responses - describe how they show pain' },
    ],
  },
  {
    id: 'insurance',
    title: 'Insurance & Legal',
    icon: CreditCard,
    color: '#64748B',
    fields: [
      { id: 'insurance', label: 'Insurance Provider', type: 'text' },
      { id: 'insuranceId', label: 'Insurance ID / Policy Number', type: 'text' },
      { id: 'insurancePhone', label: 'Insurance Phone', type: 'tel' },
      { id: 'medicaid', label: 'Medicaid Number (if applicable)', type: 'text' },
      { id: 'guardian', label: 'Legal Guardian (if different from emergency contact)', type: 'text' },
      { id: 'guardianPhone', label: 'Guardian Phone', type: 'tel' },
      { id: 'poa', label: 'Healthcare Power of Attorney', type: 'text' },
      { id: 'dnr', label: 'DNR/DNI/POLST on file?', type: 'select', options: ['No', 'Yes - at home', 'Yes - on person', 'Yes - at hospital'] },
    ],
  },
];

// ============================================
// FORM FIELD COMPONENT
// ============================================
const FormField = ({ field, value, onChange }) => {
  const baseClasses = "w-full px-4 py-3 rounded-xl border-3 border-gray-200 focus:border-[#E63B2E] outline-none font-crayon transition-colors";
  
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
// FILE OF LIFE PREVIEW (Full Sheet)
// ============================================
const FileOfLifePreview = ({ data, photo }) => {
  const handlePrint = () => {
    window.print();
  };
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <div className="bg-white rounded-2xl border-3 border-gray-200 overflow-hidden">
      {/* Print Buttons */}
      <div className="p-3 bg-gray-50 border-b flex justify-between items-center print:hidden">
        <span className="font-display text-sm text-gray-600">Preview - Full Sheet</span>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-[#E63B2E] text-white rounded-lg font-display text-sm hover:bg-red-700 transition-colors"
        >
          <Printer size={16} />
          Print Full Sheet
        </button>
      </div>
      
      {/* File of Life Content */}
      <div className="p-4 print:p-2" id="file-of-life">
        {/* Header with Red Cross */}
        <div className="bg-[#E63B2E] text-white p-4 rounded-xl mb-4 print:rounded-none print:mb-2">
          <div className="flex items-center gap-4">
            {/* File of Life Symbol */}
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="text-[#E63B2E] font-bold text-xs text-center leading-tight">
                <Heart className="mx-auto mb-1" size={20} fill="#E63B2E" />
                FILE OF<br/>LIFE
              </div>
            </div>
            
            {/* Photo */}
            <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
              {photo ? (
                <img src={photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={32} className="text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Name & DOB */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{data.fullName || 'NAME'}</h1>
              {data.preferredName && <p className="text-sm opacity-90">"{data.preferredName}"</p>}
              <p className="text-sm mt-1">DOB: {formatDate(data.dob) || '___________'}</p>
              {data.bloodType && data.bloodType !== 'Unknown' && (
                <p className="text-sm">Blood Type: <strong>{data.bloodType}</strong></p>
              )}
            </div>
          </div>
        </div>
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-3 text-xs print:text-[10px]">
          {/* LEFT COLUMN */}
          <div className="space-y-3">
            {/* Emergency Contacts - Red */}
            <div className="p-2 bg-red-50 border-2 border-red-300 rounded-lg">
              <h2 className="font-bold text-red-700 mb-1 flex items-center gap-1">
                <Phone size={12} /> EMERGENCY CONTACTS
              </h2>
              {data.contact1Name && (
                <p className="font-semibold">
                  {data.contact1Name} ({data.contact1Relation})<br/>
                  <span className="text-red-700">{data.contact1Phone}</span>
                </p>
              )}
              {data.contact2Name && (
                <p className="mt-1">
                  {data.contact2Name} ({data.contact2Relation})<br/>
                  {data.contact2Phone}
                </p>
              )}
              {data.contact3Name && (
                <p className="mt-1">
                  {data.contact3Name} ({data.contact3Relation})<br/>
                  {data.contact3Phone}
                </p>
              )}
            </div>
            
            {/* Physician */}
            <div className="p-2 bg-green-50 border-2 border-green-300 rounded-lg">
              <h2 className="font-bold text-green-700 mb-1 flex items-center gap-1">
                <Stethoscope size={12} /> PHYSICIAN
              </h2>
              {data.primaryDoc && (
                <p>{data.primaryDoc}<br/>{data.primaryDocPhone}</p>
              )}
              {data.preferredHospital && (
                <p className="mt-1"><strong>Hospital:</strong> {data.preferredHospital}</p>
              )}
            </div>
            
            {/* Allergies - Yellow/Orange - IMPORTANT */}
            <div className="p-2 bg-orange-100 border-2 border-orange-400 rounded-lg">
              <h2 className="font-bold text-orange-700 mb-1 flex items-center gap-1">
                <AlertTriangle size={12} /> ⚠️ ALLERGIES
              </h2>
              {data.drugAllergies && (
                <p><strong>DRUG:</strong> {data.drugAllergies}</p>
              )}
              {data.foodAllergies && (
                <p className="mt-1"><strong>FOOD:</strong> {data.foodAllergies}</p>
              )}
              {data.otherAllergies && (
                <p className="mt-1"><strong>OTHER:</strong> {data.otherAllergies}</p>
              )}
              {data.hasEpiPen && data.hasEpiPen !== 'No' && (
                <p className="mt-1 font-bold text-orange-800">📍 EpiPen: {data.hasEpiPen}</p>
              )}
              {!data.drugAllergies && !data.foodAllergies && !data.otherAllergies && (
                <p className="text-gray-500 italic">None listed</p>
              )}
            </div>
            
            {/* Medical Conditions */}
            <div className="p-2 bg-purple-50 border-2 border-purple-300 rounded-lg">
              <h2 className="font-bold text-purple-700 mb-1 flex items-center gap-1">
                <Heart size={12} /> MEDICAL CONDITIONS
              </h2>
              <p className="whitespace-pre-line">{data.diagnoses || 'None listed'}</p>
              {data.implants && (
                <p className="mt-1"><strong>Devices/Implants:</strong> {data.implants}</p>
              )}
            </div>
          </div>
          
          {/* RIGHT COLUMN */}
          <div className="space-y-3">
            {/* Medications - Blue */}
            <div className="p-2 bg-cyan-50 border-2 border-cyan-300 rounded-lg">
              <h2 className="font-bold text-cyan-700 mb-1 flex items-center gap-1">
                <Pill size={12} /> CURRENT MEDICATIONS
              </h2>
              <p className="whitespace-pre-line text-[9px]">{data.medications || 'None listed'}</p>
              {data.asNeededMeds && (
                <p className="mt-1 text-[9px]"><strong>PRN:</strong> {data.asNeededMeds}</p>
              )}
            </div>
            
            {/* Communication */}
            <div className="p-2 bg-pink-50 border-2 border-pink-300 rounded-lg">
              <h2 className="font-bold text-pink-700 mb-1 flex items-center gap-1">
                <MessageCircle size={12} /> COMMUNICATION
              </h2>
              {data.commMethod && <p>{data.commMethod}</p>}
              {data.commTips && <p className="mt-1"><strong>Tips:</strong> {data.commTips}</p>}
              {data.painExpression && (
                <p className="mt-1"><strong>Pain cues:</strong> {data.painExpression}</p>
              )}
            </div>
            
            {/* Behavioral */}
            <div className="p-2 bg-violet-50 border-2 border-violet-300 rounded-lg">
              <h2 className="font-bold text-violet-700 mb-1 flex items-center gap-1">
                <Sparkles size={12} /> BEHAVIORAL NOTES
              </h2>
              {data.behaviorNotes && <p>{data.behaviorNotes}</p>}
              {data.triggers && <p className="mt-1"><strong>Triggers:</strong> {data.triggers}</p>}
              {data.calmingTechniques && (
                <p className="mt-1"><strong>Calming:</strong> {data.calmingTechniques}</p>
              )}
              {data.flightRisk && data.flightRisk !== 'No' && (
                <p className="mt-1 font-bold text-violet-800">⚠️ ELOPEMENT RISK: {data.flightRisk}</p>
              )}
            </div>
            
            {/* Insurance */}
            <div className="p-2 bg-gray-50 border-2 border-gray-300 rounded-lg">
              <h2 className="font-bold text-gray-700 mb-1 flex items-center gap-1">
                <CreditCard size={12} /> INSURANCE
              </h2>
              {data.insurance && <p>{data.insurance}</p>}
              {data.insuranceId && <p>ID: {data.insuranceId}</p>}
              {data.medicaid && <p>Medicaid: {data.medicaid}</p>}
              {data.guardian && (
                <p className="mt-1"><strong>Guardian:</strong> {data.guardian} {data.guardianPhone}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-3 pt-2 border-t border-gray-200 flex justify-between items-center text-[9px] text-gray-500">
          <p>Created with ATLASassist • Keep on refrigerator</p>
          <p>Updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// WALLET CARD PREVIEW
// ============================================
const WalletCardPreview = ({ data, photo }) => {
  return (
    <div className="bg-white rounded-xl border-3 border-gray-200 overflow-hidden max-w-sm mx-auto">
      <div className="p-3 bg-gray-50 border-b print:hidden">
        <span className="font-display text-sm text-gray-600">Wallet Card Preview</span>
      </div>
      
      <div className="p-3" style={{ width: '3.5in', height: '2.25in', fontSize: '8px' }}>
        {/* Header */}
        <div className="bg-[#E63B2E] text-white p-1 rounded flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <Heart size={12} fill="#E63B2E" className="text-[#E63B2E]" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-xs">{data.fullName || 'NAME'}</p>
            <p className="text-[7px]">DOB: {data.dob || '___'}</p>
          </div>
          <div className="w-10 h-10 bg-white rounded overflow-hidden">
            {photo ? (
              <img src={photo} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={16} className="text-gray-400" />
              </div>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="grid grid-cols-2 gap-1 text-[7px]">
          <div>
            <p className="font-bold text-red-700">ALLERGIES:</p>
            <p className="truncate">{data.drugAllergies || 'None'}</p>
            
            <p className="font-bold text-purple-700 mt-1">CONDITIONS:</p>
            <p className="line-clamp-2">{data.diagnoses || 'See full File of Life'}</p>
          </div>
          <div>
            <p className="font-bold text-red-700">EMERGENCY:</p>
            <p>{data.contact1Name}: {data.contact1Phone}</p>
            
            <p className="font-bold text-cyan-700 mt-1">MEDS:</p>
            <p className="line-clamp-2">{data.medications?.split('\n')[0] || 'See full list'}</p>
          </div>
        </div>
        
        {/* Communication note */}
        {data.commMethod && (
          <div className="mt-1 p-1 bg-pink-50 rounded text-[7px]">
            <strong>Communication:</strong> {data.commMethod}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const FileOfLife = () => {
  const navigate = useNavigate();
  
  // State
  const [formData, setFormData] = useState({});
  const [photo, setPhoto] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [view, setView] = useState('form'); // form, preview, wallet
  const [showInfo, setShowInfo] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  const fileInputRef = useRef(null);
  
  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setFormData(data.formData || {});
        setPhoto(data.photo || null);
        setLastSaved(data.lastSaved || null);
      } catch (e) {
        console.error('Error loading File of Life:', e);
      }
    }
  }, []);
  
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
  
  // Save data
  const saveData = () => {
    const data = {
      formData,
      photo,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setHasChanges(false);
    setLastSaved(data.lastSaved);
  };
  
  // Navigation
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
    const filledFields = Object.values(formData).filter(v => v?.toString().trim()).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#E63B2E]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => {
              if (hasChanges) {
                if (confirm('Save changes before leaving?')) {
                  saveData();
                }
              }
              navigate('/planning');
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#E63B2E] 
                       rounded-xl font-display font-bold text-[#E63B2E] hover:bg-[#E63B2E] 
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
            <h1 className="text-lg sm:text-xl font-display text-[#E63B2E] crayon-text flex items-center gap-2">
              <Heart size={24} fill="#E63B2E" />
              File of Life
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
            onClick={() => setView('form')}
            className={`flex-1 py-3 rounded-xl font-display transition-all ${
              view === 'form' 
                ? 'bg-[#E63B2E] text-white shadow-md' 
                : 'bg-white border-2 border-gray-200 text-gray-600'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => { saveData(); setView('preview'); }}
            className={`flex-1 py-3 rounded-xl font-display transition-all ${
              view === 'preview' 
                ? 'bg-[#E63B2E] text-white shadow-md' 
                : 'bg-white border-2 border-gray-200 text-gray-600'
            }`}
          >
            Full Sheet
          </button>
          <button
            onClick={() => { saveData(); setView('wallet'); }}
            className={`flex-1 py-3 rounded-xl font-display transition-all ${
              view === 'wallet' 
                ? 'bg-[#E63B2E] text-white shadow-md' 
                : 'bg-white border-2 border-gray-200 text-gray-600'
            }`}
          >
            Wallet Card
          </button>
        </div>

        {/* ============================================ */}
        {/* FORM VIEW */}
        {/* ============================================ */}
        {view === 'form' && (
          <div>
            {/* Important Notice */}
            <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-xl mb-4 flex items-start gap-2">
              <Shield size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="font-crayon text-sm text-amber-700">
                <strong>Privacy:</strong> This medical information stays on your device only. 
                We recommend printing and storing it safely.
              </p>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm font-crayon text-gray-500 mb-1">
                <span>Completion</span>
                <span>{calculateProgress()}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#E63B2E] transition-all duration-300"
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
                  {section.title.split(' ')[0]}
                </button>
              ))}
            </div>
            
            {/* Photo Upload (shown in Personal section) */}
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
                  <p className="font-crayon text-xs text-gray-400 mt-1">
                    Recent, clear photo helps responders
                  </p>
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
                         hover:bg-gray-50 transition-colors disabled:opacity-50
                         flex items-center justify-center gap-2"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              
              {currentSection < SECTIONS.length - 1 ? (
                <button
                  onClick={goToNextSection}
                  className="flex-1 py-3 bg-[#E63B2E] text-white rounded-xl font-display
                           hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={() => { saveData(); setView('preview'); }}
                  className="flex-1 py-3 bg-[#5CB85C] text-white rounded-xl font-display
                           hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye size={18} />
                  Preview & Print
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
        {/* FULL SHEET PREVIEW */}
        {/* ============================================ */}
        {view === 'preview' && (
          <FileOfLifePreview data={formData} photo={photo} />
        )}
        
        {/* ============================================ */}
        {/* WALLET CARD PREVIEW */}
        {/* ============================================ */}
        {view === 'wallet' && (
          <div>
            <p className="text-center font-crayon text-sm text-gray-600 mb-4">
              Print this card and keep it in wallet or backpack
            </p>
            <WalletCardPreview data={formData} photo={photo} />
            <button
              onClick={() => window.print()}
              className="w-full mt-4 py-3 bg-[#E63B2E] text-white rounded-xl font-display
                       hover:bg-red-700 transition-colors flex items-center justify-center gap-2 print:hidden"
            >
              <Printer size={18} />
              Print Wallet Card
            </button>
          </div>
        )}
        
        {/* Update Reminder */}
        <div className="mt-6 p-4 bg-gray-50 rounded-2xl print:hidden">
          <h3 className="font-display text-sm text-gray-600 mb-2 flex items-center gap-2">
            <Clock size={16} />
            Remember to Update
          </h3>
          <ul className="font-crayon text-xs text-gray-500 space-y-1">
            <li>✓ After any medication changes</li>
            <li>✓ After new diagnoses or surgeries</li>
            <li>✓ When contact info changes</li>
            <li>✓ At least once a year</li>
          </ul>
        </div>
      </main>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-[#E63B2E]">About File of Life</h2>
              <button onClick={() => setShowInfo(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-3 font-crayon text-gray-600">
              <p>
                <strong>What is it?</strong> The File of Life is a standardized medical information 
                form recognized by emergency responders (EMTs, paramedics, firefighters) nationwide.
              </p>
              <p>
                <strong>The Red Symbol</strong> The "File of Life" emblem is recognized by first 
                responders as a signal that important medical information is available.
              </p>
              <p>
                <strong>Where to Keep It:</strong>
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>🧲 On the refrigerator (traditional location)</li>
                <li>💳 Wallet card version in wallet/purse</li>
                <li>🎒 Copy in school backpack</li>
                <li>🚗 Copy in car</li>
                <li>📱 Photo on phone</li>
              </ul>
              <p className="text-amber-600">
                <strong>⚠️ Privacy:</strong> This information stays on YOUR device only. 
                ATLASassist does not upload or store your medical information in the cloud.
              </p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full mt-4 py-3 bg-[#E63B2E] text-white rounded-xl font-display"
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
          #file-of-life, #file-of-life * {
            visibility: visible;
          }
          #file-of-life {
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

export default FileOfLife;
