import React from 'react';
import { 
  CalendarCheck, 
  Users, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  TrendingUp,
  Activity,
  Calendar
} from 'lucide-react';

export default function Dashboard({ stats, appointments, setActiveTab, onBookClick, onEditAppointment }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" /> Scheduled
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute -right-3 -bottom-3 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Appointments</p>
              <h3 className="text-3xl font-extrabold text-white mt-2">{stats.totalAppointments || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5"><TrendingUp className="w-3 h-3"/> Active</span> system records
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scheduled Today</p>
              <h3 className="text-3xl font-extrabold text-amber-400 mt-2">{stats.scheduledAppointments || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            Pending doctor consultations
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Patients</p>
              <h3 className="text-3xl font-extrabold text-white mt-2">{stats.totalPatients || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            Stored in cloud database
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Medical Staff</p>
              <h3 className="text-3xl font-extrabold text-white mt-2">{stats.totalDoctors || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            Across 4 primary departments
          </p>
        </div>
      </div>

      {/* Main Section: Quick Actions & Recent Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments Table (2 cols) */}
        <div className="lg:col-span-2 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-100 text-lg">Recent Appointments</h3>
              <p className="text-xs text-slate-400">Latest consultations booked in the system</p>
            </div>
            <button
              onClick={() => setActiveTab('appointments')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs font-semibold uppercase bg-slate-900/60 text-slate-400">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Patient</th>
                  <th className="px-4 py-3">Doctor / Dept</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-lg text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {appointments.slice(0, 5).map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-white">
                      <div>
                        {apt.patient_name}
                        <span className="block text-xs text-slate-400 font-normal">{apt.patient_phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        {apt.doctor_name}
                        <span className="block text-xs text-cyan-400">{apt.doctor_specialty}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 text-slate-200">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {apt.appointment_date}
                      </div>
                      <span className="text-xs text-slate-400">{apt.appointment_time}</span>
                    </td>
                    <td className="px-4 py-3.5">{getStatusBadge(apt.status)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => onEditAppointment(apt)}
                        className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-slate-400">
                      No appointments recorded yet. Click "Book Appointment" to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cloud Infrastructure Info Panel (1 col) */}
        <div className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
            <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Cloud System Overview
            </h3>
            <p className="text-xs text-slate-400 mt-1">BACSE344 Architectural Specifications</p>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">REST API Engine</p>
                  <p className="text-sm font-semibold text-slate-200">Node.js Express v4.21</p>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Database Layer</p>
                  <p className="text-sm font-semibold text-slate-200">Cloud SQLite / Supabase</p>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">CRUD Operations</p>
                  <p className="text-sm font-semibold text-slate-200">Fully Supported (4/4)</p>
                </div>
                <span className="px-2 py-0.5 text-xs font-bold bg-cyan-500/20 text-cyan-400 rounded">GET POST PUT DELETE</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('cloudarch')}
              className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-cyan-300 font-medium py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              Explore Full Architecture Diagram <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
