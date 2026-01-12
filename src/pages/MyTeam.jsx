// MyTeam.jsx - Track care team contacts
// Privacy-focused: Just names, roles, and contact info
// No PHI or medical details

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Users,
  Check,
  X,
  Trash2,
  Edit2,
  Phone,
  Mail,
  MapPin,
  ExternalLink
} from 'lucide-react';
import LocalOnlyNotice from '../components/LocalOnlyNotice';

// Provider types
const PROVIDER_TYPES = [
  { id: 'therapist', label: 'Therapist', emoji: '🗣️', color: 'bg-blue-100 border-blue-400' },
  { id: 'doctor', label: 'Doctor', emoji: '👨‍⚕️', color: 'bg-green-100 border-green-400' },
  { id: 'teacher', label: 'Teacher', emoji: '👩‍🏫', color: 'bg-purple-100 border-purple-400' },
  { id: 'specialist', label: 'Specialist', emoji: '🩺', color: 'bg-pink-100 border-pink-400' },
  { id: 'coordinator', label: 'Coordinator', emoji: '📋', color: 'bg-orange-100 border-orange-400' },
  { id: 'aide', label: 'Aide/Support', emoji: '🤝', color: 'bg-teal-100 border-teal-400' },
  { id: 'other', label: 'Other', emoji: '👤', color: 'bg-gray-100 border-gray-400' },
];

const STORAGE_KEY = 'snw_team';

const MyTeam = () => {
  const navigate = useNavigate();
  const [team, setTeam] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    type: 'therapist',
    phone: '',
    email: '',
    location: '',
    notes: '',
  });

  // Load team from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTeam(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading team:', e);
      }
    }
  }, []);

  // Save team to localStorage
  const saveTeam = (newTeam) => {
    setTeam(newTeam);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTeam));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    const member = {
      id: editingId || Date.now().toString(),
      ...formData,
      createdAt: editingId ? team.find(m => m.id === editingId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let newTeam;
    if (editingId) {
      newTeam = team.map(m => m.id === editingId ? member : m);
    } else {
      newTeam = [...team, member];
    }

    saveTeam(newTeam);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      type: 'therapist',
      phone: '',
      email: '',
      location: '',
      notes: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  // Edit member
  const handleEdit = (member) => {
    setFormData({
      name: member.name,
      role: member.role || '',
      type: member.type,
      phone: member.phone || '',
      email: member.email || '',
      location: member.location || '',
      notes: member.notes || '',
    });
    setEditingId(member.id);
    setShowForm(true);
  };

  // Delete member
  const handleDelete = (id) => {
    if (confirm('Remove this team member?')) {
      saveTeam(team.filter(m => m.id !== id));
    }
  };

  // Get type info
  const getTypeInfo = (typeId) => {
    return PROVIDER_TYPES.find(t => t.id === typeId) || PROVIDER_TYPES[6];
  };

  // Format phone for tel: link
  const formatPhoneLink = (phone) => {
    return 'tel:' + phone.replace(/\D/g, '');
  };

  // Group by type
  const groupedTeam = PROVIDER_TYPES.map(type => ({
    ...type,
    members: team.filter(m => m.type === type.id)
  })).filter(group => group.members.length > 0);

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#8E6BBF]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#8E6BBF] 
                       rounded-xl font-display font-bold text-[#8E6BBF] hover:bg-[#8E6BBF] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-display text-[#8E6BBF] crayon-text flex items-center gap-2">
              👥 My Team
            </h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="p-2 bg-[#5CB85C] text-white rounded-full border-3 border-green-600
                       hover:scale-110 transition-transform shadow-sm"
          >
            <Plus size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Privacy Notice */}
        <div className="mb-4">
          <LocalOnlyNotice />
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-6 bg-white rounded-2xl border-4 border-[#8E6BBF] p-4 shadow-crayon">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-lg text-[#8E6BBF]">
                {editingId ? 'Edit Team Member' : 'Add Team Member'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block font-crayon text-gray-700 mb-1">Name: *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Dr. Smith, Ms. Johnson, etc."
                  required
                  className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon
                           focus:border-[#8E6BBF] focus:outline-none"
                />
              </div>

              {/* Type Selection */}
              <div>
                <label className="block font-crayon text-gray-700 mb-2">Type:</label>
                <div className="grid grid-cols-4 gap-2">
                  {PROVIDER_TYPES.slice(0, 4).map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({...formData, type: type.id})}
                      className={`p-2 rounded-xl border-2 font-crayon text-xs transition-all
                        ${formData.type === type.id 
                          ? `${type.color} border-2` 
                          : 'bg-gray-50 border-gray-200 hover:border-gray-400'
                        }`}
                    >
                      <span className="text-lg">{type.emoji}</span>
                      <span className="block mt-1">{type.label}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {PROVIDER_TYPES.slice(4).map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({...formData, type: type.id})}
                      className={`p-2 rounded-xl border-2 font-crayon text-xs transition-all
                        ${formData.type === type.id 
                          ? `${type.color} border-2` 
                          : 'bg-gray-50 border-gray-200 hover:border-gray-400'
                        }`}
                    >
                      <span className="text-lg">{type.emoji}</span>
                      <span className="block mt-1">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Role/Title */}
              <div>
                <label className="block font-crayon text-gray-700 mb-1">Role/Title (optional):</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  placeholder="Speech Therapist, Case Manager, etc."
                  className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon
                           focus:border-[#8E6BBF] focus:outline-none"
                />
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-crayon text-gray-700 mb-1">Phone:</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                    className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon
                             focus:border-[#8E6BBF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-crayon text-gray-700 mb-1">Email:</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@example.com"
                    className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon
                             focus:border-[#8E6BBF] focus:outline-none"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block font-crayon text-gray-700 mb-1">Location/Office (optional):</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="ABC Therapy Center, Room 204"
                  className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon
                           focus:border-[#8E6BBF] focus:outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-crayon text-gray-700 mb-1">Notes (optional):</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Best times to contact, etc."
                  rows={2}
                  className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon
                           focus:border-[#8E6BBF] focus:outline-none resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-[#5CB85C] text-white rounded-xl border-3 border-green-600
                         font-crayon text-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                <Check size={20} />
                {editingId ? 'Save Changes' : 'Add Team Member'}
              </button>
            </form>
          </div>
        )}

        {/* Empty State */}
        {team.length === 0 && !showForm && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="font-display text-xl text-gray-500 mb-2">No Team Members Yet</h2>
            <p className="font-crayon text-gray-400 mb-4">
              Keep track of therapists, doctors, teachers, and other providers!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-[#8E6BBF] text-white rounded-xl border-3 border-purple-600
                       font-crayon hover:scale-105 transition-transform"
            >
              <Plus size={20} className="inline mr-2" />
              Add First Team Member
            </button>
          </div>
        )}

        {/* Team List - Grouped by Type */}
        {groupedTeam.map(group => (
          <div key={group.id} className="mb-6">
            <h2 className="font-display text-lg text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-xl">{group.emoji}</span>
              {group.label}s ({group.members.length})
            </h2>
            <div className="space-y-3">
              {group.members.map(member => (
                <div
                  key={member.id}
                  className={`bg-white rounded-2xl border-3 ${group.color} shadow-sm overflow-hidden`}
                >
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">{group.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-gray-800 text-lg">
                          {member.name}
                        </h3>
                        {member.role && (
                          <p className="font-crayon text-gray-600 text-sm">
                            {member.role}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-3">
                      {member.phone && (
                        <a
                          href={formatPhoneLink(member.phone)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-crayon"
                        >
                          <Phone size={16} />
                          {member.phone}
                          <ExternalLink size={12} />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-crayon text-sm"
                        >
                          <Mail size={16} />
                          {member.email}
                          <ExternalLink size={12} />
                        </a>
                      )}
                      {member.location && (
                        <div className="flex items-center gap-2 text-gray-600 font-crayon text-sm">
                          <MapPin size={16} />
                          {member.location}
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {member.notes && (
                      <p className="text-sm font-crayon text-gray-500 bg-gray-50 p-2 rounded-lg mb-3">
                        {member.notes}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-crayon text-sm
                                 hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="py-2 px-3 bg-red-100 text-red-600 rounded-lg
                                 hover:bg-red-200 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Tip */}
        {team.length > 0 && (
          <div className="mt-8 p-4 bg-white rounded-2xl border-3 border-[#87CEEB] shadow-sm">
            <p className="text-center text-gray-600 font-crayon text-sm">
              💡 <strong>Tip:</strong> Tap phone numbers to call directly!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyTeam;
