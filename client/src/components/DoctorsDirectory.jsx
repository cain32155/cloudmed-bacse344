import React from 'react';
import { UserCheck, Stethoscope, Mail, Phone, Calendar, Building2 } from 'lucide-react';

export default function DoctorsDirectory({ doctors }) {
  return (
    <div className="space-y-5">
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-white text-base">Medical Staff & Specialists</h3>
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-semibold">
            {doctors.length} Doctors Available
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {doctors.map((doc) => (
          <div key={doc.id} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg flex items-start gap-4 hover:border-slate-600 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-md shadow-cyan-500/20">
              {doc.name.replace('Dr. ', '').charAt(0)}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white text-lg">{doc.name}</h4>
                  <p className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5" /> {doc.specialty}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-700 text-slate-300 border border-slate-600">
                  {doc.department}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-300 pt-1 border-t border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{doc.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{doc.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-amber-300/90 font-medium pt-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Available: {doc.available_days}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
