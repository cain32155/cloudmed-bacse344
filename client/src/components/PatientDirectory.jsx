import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Phone, 
  Mail, 
  Droplet, 
  MapPin, 
  FileText,
  CalendarCheck
} from 'lucide-react';

export default function PatientDirectory({ 
  patients, 
  onAddPatientClick, 
  onEditPatient, 
  onDeletePatient 
}) {
  const [search, setSearch] = useState('');

  const filteredPatients = patients.filter((p) => {
    const term = search.toLowerCase();
    return (
      !search ||
      p.name.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term) ||
      p.phone.includes(term) ||
      p.blood_group.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-5">
      {/* Directory Toolbar */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-white text-base">Patient Medical Records</h3>
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-semibold">
            {patients.length} Total Patients
          </span>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patients by name, blood, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <button
            onClick={onAddPatientClick}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-1.5 px-3.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-600/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add New Patient
          </button>
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPatients.map((p) => (
          <div key={p.id} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-600 transition-all">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center font-bold text-base shadow-md">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">{p.name}</h4>
                    <p className="text-xs text-slate-400">{p.age} Yrs • {p.gender}</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <Droplet className="w-3 h-3 fill-rose-400/20" /> {p.blood_group}
                </span>
              </div>

              {/* Patient Details */}
              <div className="mt-4 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{p.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{p.email}</span>
                </div>
                {p.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{p.address}</span>
                  </div>
                )}
                {p.medical_history && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-cyan-400" /> Medical History
                    </p>
                    <p className="text-xs text-slate-200 line-clamp-2">{p.medical_history}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">Patient ID: #{p.id}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditPatient(p)}
                  title="Edit Patient Record (PUT)"
                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-cyan-600 hover:text-white text-cyan-400 transition-colors text-xs flex items-center gap-1 px-2.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => onDeletePatient(p.id)}
                  title="Delete Patient Record (DELETE)"
                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-rose-600 hover:text-white text-rose-400 transition-colors text-xs flex items-center gap-1 px-2.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredPatients.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-800/50 border border-slate-700/60 rounded-2xl">
            No patient records match search filter.
          </div>
        )}
      </div>
    </div>
  );
}
