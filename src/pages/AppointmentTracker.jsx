// AppointmentTracker.jsx - Track appointments with cloud sync
// Syncs to database for cross-device access (scheduling data, not diagnoses)

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Calendar,
  Clock,
  MapPin,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Cloud,
  CloudOff,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../App';

// Appointment types
const APPOINTMENT_TYPES = [
  { id: 'therapy', emoji: '🗣️', label: 'Therapy', color: 'bg-blue-100 border-blue-400' },
  { id: 'doctor', emoji: '👨‍⚕️', label: 'Doctor', color: 'bg-green-100 border-green-400' },
  { id: 'school', emoji: '🏫', label: 'School', color: 'bg-yellow-100 border-yellow-400' },
  { id: 'evaluation', emoji: '📋', label: 'Evaluation', color: 'bg-purple-100 border-purple-400' },
  { id: 'specialist', emoji: '🔬', label: 'Specialist', color: 'bg-pink-100 border-pink-400' },
  { id: 'other', emoji: '📅', label: 'Other', color: 'bg-gray-100 border-gray-400' },
];

const LOCAL_STORAGE_KEY = 'snw_appointments';

const AppointmentTracker = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    type: 'therapy',
    providerName: '',
    date: '',
    time: '',
    location: '',
    notes: '',
  });

  // Load appointments
  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setSyncError(null);

    if (isGuest || !user) {
      // Guest mode: load from localStorage
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          setAppointments(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading local appointments:', e);
        }
      }
      setLoading(false);
      return;
    }

    // Authenticated: load from Supabase
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: true });

      if (error) throw error;

      // Transform from database format
      const transformed = data.map(apt => ({
        id: apt.id,
        type: apt.type,
        providerName: apt.provider_name,
        date: apt.appointment_date,
        time: apt.appointment_time,
        location: apt.location,
        notes: apt.notes,
        createdAt: apt.created_at,
        updatedAt: apt.updated_at,
      }));

      setAppointments(transformed);
    } catch (error) {
      console.error('Error loading appointments:', error);
      setSyncError('Failed to load appointments');
      // Fallback to localStorage
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setAppointments(JSON.parse(saved));
      }
    } finally {
      setLoading(false);
    }
  }, [user, isGuest]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Save appointment
  const saveAppointment = async (appointmentData) => {
    setSyncing(true);
    setSyncError(null);

    if (isGuest || !user) {
      // Guest mode: save to localStorage
      let newAppointments;
      if (editingId) {
        newAppointments = appointments.map(a => 
          a.id === editingId ? { ...appointmentData, id: editingId } : a
        );
      } else {
        newAppointments = [...appointments, { ...appointmentData, id: Date.now().toString() }];
      }
      setAppointments(newAppointments);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newAppointments));
      setSyncing(false);
      return true;
    }

    // Authenticated: save to Supabase
    try {
      const dbData = {
        user_id: user.id,
        type: appointmentData.type,
        provider_name: appointmentData.providerName,
        appointment_date: appointmentData.date,
        appointment_time: appointmentData.time || null,
        location: appointmentData.location || null,
        notes: appointmentData.notes || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('appointments')
          .update(dbData)
          .eq('id', editingId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('appointments')
          .insert(dbData);

        if (error) throw error;
      }

      await loadAppointments();
      return true;
    } catch (error) {
      console.error('Error saving appointment:', error);
      setSyncError('Failed to save appointment');
      return false;
    } finally {
      setSyncing(false);
    }
  };

  // Delete appointment
  const deleteAppointment = async (id) => {
    if (!confirm('Delete this appointment?')) return;

    setSyncing(true);

    if (isGuest || !user) {
      const newAppointments = appointments.filter(a => a.id !== id);
      setAppointments(newAppointments);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newAppointments));
      setSyncing(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      await loadAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setSyncError('Failed to delete appointment');
    } finally {
      setSyncing(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.type || !formData.date) return;

    const success = await saveAppointment({
      ...formData,
      createdAt: editingId ? appointments.find(a => a.id === editingId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (success) {
      resetForm();
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      type: 'therapy',
      providerName: '',
      date: '',
      time: '',
      location: '',
      notes: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  // Edit appointment
  const handleEdit = (apt) => {
    setFormData({
      type: apt.type,
      providerName: apt.providerName || '',
      date: apt.date,
      time: apt.time || '',
      location: apt.location || '',
      notes: apt.notes || '',
    });
    setEditingId(apt.id);
    setShowForm(true);
    setExpandedId(null);
  };

  // Get type info
  const getTypeInfo = (typeId) => {
    return APPOINTMENT_TYPES.find(t => t.id === typeId) || APPOINTMENT_TYPES[5];
  };

  // Check if date is past
  const isPast = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const aptDate = new Date(dateStr + 'T00:00:00');
    return aptDate < today;
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Format time for display
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Separate upcoming and past
  const upcomingAppointments = appointments.filter(a => !isPast(a.date));
  const pastAppointments = appointments.filter(a => isPast(a.date));

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
            <h1 className="text-lg sm:text-xl font-display text-[#8E6BBF] crayon-text">
              📅 Appointments
            </h1>
          </div>
          
          {/* Sync Status */}
          <div className="flex items-center gap-2">
            {syncing && <RefreshCw size={16} className="text-blue-500 animate-spin" />}
            {!isGuest && user ? (
              <div className="flex items-center gap-1 text-green-600" title="Synced to cloud">
                <Cloud size={16} />
                <span className="text-xs font-crayon hidden sm:inline">Synced</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-400" title="Local only (sign in to sync)">
                <CloudOff size={16} />
                <span className="text-xs font-crayon hidden sm:inline">Local</span>
              </div>
            )}
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

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Sync Info Banner */}
        {!isGuest && user && (
          <div className="mb-4 p-3 bg-green-50 rounded-xl border-2 border-green-200 flex items-center gap-2">
            <Cloud size={18} className="text-green-600" />
            <p className="text-sm text-green-700 font-crayon">
              ✓ Appointments sync across all your devices
            </p>
          </div>
        )}

        {isGuest && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-xl border-2 border-yellow-200 flex items-center gap-2">
            <CloudOff size={18} className="text-yellow-600" />
            <p className="text-sm text-yellow-700 font-crayon">
              Sign in to sync appointments across devices
            </p>
          </div>
        )}

        {syncError && (
          <div className="mb-4 p-3 bg-red-50 rounded-xl border-2 border-red-200">
            <p className="text-sm text-red-700 font-crayon">{syncError}</p>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-6 bg-white rounded-2xl border-4 border-[#8E6BBF] p-4 shadow-crayon">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-lg text-[#8E6BBF]">
                {editingId ? 'Edit Appointment' : 'New Appointment'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block font-crayon text-gray-700 mb-2">Type:</label>
                <div className="grid grid-cols-3 gap-2">
                  {APPOINTMENT_TYPES.map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({...formData, type: type.id})}
                      className={`p-2 rounded-xl border-2 font-crayon text-sm transition-all
                        ${formData.type === type.id 
                          ? `${type.color} border-2` 
                          : 'bg-gray-50 border-gray-200 hover:border-gray-400'
                        }`}
                    >
                      <span className="text-xl">{type.emoji}</span>
                      <span className="block text-xs mt-1">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Provider Name */}
              <div>
                <label className="block font-crayon text-gray-700 mb-1">Provider/Contact Name:</label>
                <input
                  type="text"
                  value={formData.providerName}
                  onChange={(e) => setFormData({...formData, providerName: e.target.value})}
                  placeholder="Dr. Smith, ABC Therapy, etc."
                  className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon
                           focus:border-[#8E6BBF] focus:outline-none"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-crayon text-gray-700 mb-1">Date: *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                    className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon
                             focus:border-[#8E6BBF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-crayon text-gray-700 mb-1">Time:</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon
                             focus:border-[#8E6BBF] focus:outline-none"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block font-crayon text-gray-700 mb-1">Location:</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Address or virtual link"
                  className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon
                           focus:border-[#8E6BBF] focus:outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-crayon text-gray-700 mb-1">Notes:</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Anything to remember..."
                  rows={2}
                  className="w-full p-3 border-3 border-gray-300 rounded-xl font-crayon
                           focus:border-[#8E6BBF] focus:outline-none resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={syncing}
                className="w-full py-3 bg-[#5CB85C] text-white rounded-xl border-3 border-green-600
                         font-crayon text-lg hover:scale-[1.02] transition-transform 
                         flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {syncing ? (
                  <RefreshCw size={20} className="animate-spin" />
                ) : (
                  <Check size={20} />
                )}
                {editingId ? 'Save Changes' : 'Add Appointment'}
              </button>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw size={32} className="text-gray-400 mx-auto animate-spin mb-4" />
            <p className="font-crayon text-gray-500">Loading appointments...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && appointments.length === 0 && !showForm && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="font-display text-xl text-gray-500 mb-2">No Appointments Yet</h2>
            <p className="font-crayon text-gray-400 mb-4">
              Keep track of therapy, doctor visits, and more!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-[#8E6BBF] text-white rounded-xl border-3 border-purple-600
                       font-crayon hover:scale-105 transition-transform"
            >
              <Plus size={20} className="inline mr-2" />
              Add First Appointment
            </button>
          </div>
        )}

        {/* Upcoming Appointments */}
        {!loading && upcomingAppointments.length > 0 && (
          <div className="mb-6">
            <h2 className="font-display text-gray-700 mb-3 flex items-center gap-2">
              <Calendar size={18} />
              Upcoming ({upcomingAppointments.length})
            </h2>
            <div className="space-y-3">
              {upcomingAppointments.map(apt => {
                const typeInfo = getTypeInfo(apt.type);
                const isExpanded = expandedId === apt.id;
                
                return (
                  <div
                    key={apt.id}
                    className={`bg-white rounded-2xl border-3 ${typeInfo.color} shadow-sm overflow-hidden`}
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : apt.id)}
                      className="w-full p-4 flex items-center gap-3 text-left"
                    >
                      <span className="text-3xl">{typeInfo.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-gray-800 truncate">
                          {apt.providerName || typeInfo.label}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-crayon">
                          <Clock size={14} />
                          <span>{formatDate(apt.date)}</span>
                          {apt.time && <span>at {formatTime(apt.time)}</span>}
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-200">
                        {apt.location && (
                          <div className="flex items-center gap-2 mt-3 text-gray-600 font-crayon">
                            <MapPin size={16} />
                            <span>{apt.location}</span>
                          </div>
                        )}
                        {apt.notes && (
                          <p className="mt-2 text-gray-600 font-crayon text-sm bg-gray-50 p-2 rounded-lg">
                            {apt.notes}
                          </p>
                        )}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEdit(apt)}
                            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-crayon
                                     hover:bg-gray-200 flex items-center justify-center gap-1"
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => deleteAppointment(apt.id)}
                            className="py-2 px-3 bg-red-100 text-red-600 rounded-lg
                                     hover:bg-red-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Past Appointments */}
        {!loading && pastAppointments.length > 0 && (
          <div>
            <h2 className="font-display text-gray-500 mb-3 flex items-center gap-2">
              <Clock size={18} />
              Past ({pastAppointments.length})
            </h2>
            <div className="space-y-2 opacity-60">
              {pastAppointments.slice(0, 5).map(apt => {
                const typeInfo = getTypeInfo(apt.type);
                
                return (
                  <div
                    key={apt.id}
                    className="bg-white rounded-xl border-2 border-gray-200 p-3 flex items-center gap-3"
                  >
                    <span className="text-2xl opacity-50">{typeInfo.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-crayon text-gray-600 truncate">
                        {apt.providerName || typeInfo.label}
                      </p>
                      <p className="text-xs text-gray-400 font-crayon">{formatDate(apt.date)}</p>
                    </div>
                    <button
                      onClick={() => deleteAppointment(apt.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AppointmentTracker;
