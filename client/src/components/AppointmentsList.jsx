import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Filter, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Plus,
  User,
  Stethoscope,
  FileText
} from 'lucide-react';

export default function AppointmentsList({ 
  appointments, 
  onBookClick, 
  onEditAppointment, 
  onDeleteAppointment,
  selectedStatus,
  setSelectedStatus
}) {
  const [localSearch, setLocalSearch] = useState('');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = selectedStatus === 'All' || apt.status === selectedStatus;
    const term = localSearch.toLowerCase();
    const matchesSearch = 
      !localSearch || 
      apt.patient_name.toLowerCase().includes(term) ||
      apt.doctor_name.toLowerCase().includes(term) ||
      apt.reason.toLowerCase().includes(term);

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" /> Scheduled
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Action & Filter Toolbar */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 mr-1 hidden sm:block" />
          {['All', 'Scheduled', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedStatus === status
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Local Search and Add Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <button
            onClick={onBookClick}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-1.5 px-3.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-600/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Book New
          </button>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs font-semibold uppercase bg-slate-900/80 text-slate-400 border-b border-slate-700/60">
              <tr>
                <th className="px-5 py-3.5">ID</th>
                <th className="px-5 py-3.5">Patient Details</th>
                <th className="px-5 py-3.5">Doctor & Specialty</th>
                <th className="px-5 py-3.5">Schedule</th>
                <th className="px-5 py-3.5">Reason / Medical Notes</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-slate-400">#{apt.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30">
                        {apt.patient_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{apt.patient_name}</p>
                        <p className="text-xs text-slate-400">{apt.patient_phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-cyan-400" />
                      <div>
                        <p className="font-medium text-slate-200">{apt.doctor_name}</p>
                        <p className="text-xs text-cyan-400">{apt.doctor_specialty}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.appointment_date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{apt.appointment_time}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 max-w-xs">
                    <p className="font-medium text-slate-200 truncate">{apt.reason}</p>
                    {apt.notes && (
                      <p className="text-xs text-slate-400 italic truncate flex items-center gap-1 mt-0.5">
                        <FileText className="w-3 h-3 text-slate-500 shrink-0" /> {apt.notes}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4">{getStatusBadge(apt.status)}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Update Action */}
                      <button
                        onClick={() => onEditAppointment(apt)}
                        title="Update Appointment (PUT)"
                        className="p-2 rounded-lg bg-slate-700/80 hover:bg-cyan-600 hover:text-white text-cyan-400 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {/* Delete Action */}
                      <button
                        onClick={() => onDeleteAppointment(apt.id)}
                        title="Delete Appointment (DELETE)"
                        className="p-2 rounded-lg bg-slate-700/80 hover:bg-rose-600 hover:text-white text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">
                    No appointments match the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
