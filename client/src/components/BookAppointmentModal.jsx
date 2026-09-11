import React, { useState } from 'react';
import { X, Calendar, Clock, User, UserPlus, Stethoscope, FileText, Droplet } from 'lucide-react';

export default function BookAppointmentModal({ isOpen, onClose, patients, doctors, onBookSuccess }) {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const [patientMode, setPatientMode] = useState('existing'); // 'existing' or 'new'
  const [formData, setFormData] = useState({
    patient_id: patients[0]?.id || '',
    patient_name: '',
    patient_age: '28',
    patient_blood_group: 'O+',
    doctor_id: doctors[0]?.id || '',
    appointment_date: todayStr,
    appointment_time: '10:00 AM',
    reason: '',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (patientMode === 'existing' && !formData.patient_id) {
      setError('Please select a patient from the dropdown.');
      return;
    }

    if (patientMode === 'new' && !formData.patient_name.trim()) {
      setError('Please enter the patient full name.');
      return;
    }

    if (!formData.doctor_id || !formData.reason.trim()) {
      setError('Please fill in all required appointment fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        patient_id: patientMode === 'existing' ? formData.patient_id : 'new',
        patient_name: formData.patient_name.trim()
      };
      await onBookSuccess(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to book appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[92vh] flex flex-col">
        <div className="p-5 border-b border-slate-700/60 flex items-center justify-between bg-slate-800/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Book New Appointment</h3>
              <p className="text-xs text-slate-400">Schedule consultation with any patient name</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* Patient Mode Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Patient Selection Method
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 border border-slate-700/80 rounded-xl">
              <button
                type="button"
                onClick={() => setPatientMode('existing')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  patientMode === 'existing'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Select Existing Patient
              </button>
              <button
                type="button"
                onClick={() => setPatientMode('new')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  patientMode === 'new'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                + Type New Patient Name
              </button>
            </div>
          </div>

          {/* Existing Patient Dropdown */}
          {patientMode === 'existing' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-cyan-400" /> Choose Patient *
              </label>
              <select
                value={formData.patient_id}
                onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              >
                <option value="">Select Patient from Directory</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (#{p.id} - Blood: {p.blood_group})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            /* Custom New Patient Name Input */
            <div className="space-y-3 p-3.5 bg-slate-900/60 border border-cyan-500/30 rounded-xl">
              <div>
                <label className="block text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <UserPlus className="w-3.5 h-3.5 text-cyan-400" /> Patient Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Type any patient name (e.g. Rishi Kumar, Jane Doe)"
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                  className="w-full bg-slate-900 border border-cyan-500/50 rounded-xl px-3.5 py-2 text-sm text-white font-medium focus:outline-none focus:border-cyan-400 shadow-inner"
                  required={patientMode === 'new'}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Age</label>
                  <input
                    type="number"
                    placeholder="28"
                    min="1"
                    max="120"
                    value={formData.patient_age}
                    onChange={(e) => setFormData({ ...formData, patient_age: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                    <Droplet className="w-3 h-3 text-rose-400" /> Blood Group
                  </label>
                  <select
                    value={formData.patient_blood_group}
                    onChange={(e) => setFormData({ ...formData, patient_blood_group: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Select Doctor */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5 text-cyan-400" /> Doctor / Specialist *
            </label>
            <select
              value={formData.doctor_id}
              onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialty} - {d.department})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Date *
              </label>
              <input
                type="date"
                value={formData.appointment_date}
                onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Time Slot *
              </label>
              <select
                value={formData.appointment_time}
                onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              >
                {['09:00 AM', '10:00 AM', '11:15 AM', '02:00 PM', '03:30 PM', '05:00 PM'].map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> Reason for Visit *
            </label>
            <input
              type="text"
              placeholder="e.g. Annual Cardiac Checkup, General Fever"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Additional Notes (Optional)
            </label>
            <textarea
              placeholder="Symptoms, previous prescriptions..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="2"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-700/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-5 py-2 rounded-xl text-sm transition-all shadow-md shadow-cyan-600/20 disabled:opacity-50 flex items-center gap-1.5"
            >
              {submitting ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
