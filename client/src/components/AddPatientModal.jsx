import React, { useState } from 'react';
import { X, UserPlus, Droplet, Phone, Mail, MapPin, FileText } from 'lucide-react';

export default function AddPatientModal({ isOpen, onClose, onAddSuccess }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    blood_group: 'A+',
    phone: '',
    email: '',
    address: '',
    medical_history: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.age || !formData.phone.trim() || !formData.email.trim()) {
      setError('Please fill in all required patient fields.');
      return;
    }

    setSubmitting(true);
    try {
      await onAddSuccess(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add patient record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-700/60 flex items-center justify-between bg-slate-800/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Add Patient Record</h3>
              <p className="text-xs text-slate-400">Registers new patient in system (REST POST)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Age *
              </label>
              <input
                type="number"
                placeholder="28"
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Droplet className="w-3 h-3 text-rose-400" /> Blood *
              </label>
              <select
                value={formData.blood_group}
                onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-bold text-rose-400"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-cyan-400" /> Phone *
              </label>
              <input
                type="text"
                placeholder="+1-555-0199"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email *
              </label>
              <input
                type="email"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Address
            </label>
            <input
              type="text"
              placeholder="Residential city, state"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> Medical History Notes
            </label>
            <textarea
              placeholder="Pre-existing conditions, allergies, regular medications..."
              value={formData.medical_history}
              onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
              rows="2"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
            ></textarea>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-700/60">
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
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-5 py-2 rounded-xl text-sm transition-all shadow-md shadow-cyan-600/20 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Register Patient (POST)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
