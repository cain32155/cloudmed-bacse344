import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  UserCheck, 
  FileCode2, 
  Cloud, 
  Activity,
  PlusCircle
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onBookClick }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'patients', label: 'Patients Directory', icon: Users },
    { id: 'doctors', label: 'Medical Staff', icon: UserCheck },
    { id: 'apidocs', label: 'REST API Docs', icon: FileCode2 },
    { id: 'cloudarch', label: 'Cloud Architecture', icon: Cloud },
  ];

  return (
    <aside className="w-64 bg-slate-800/90 border-r border-slate-700/60 flex flex-col h-screen sticky top-0 backdrop-blur-md">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-700/60 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-wide flex items-center gap-1.5">
            CloudMed <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">v1.0</span>
          </h1>
          <p className="text-xs text-slate-400">Cloud Healthcare System</p>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="p-4">
        <button
          onClick={onBookClick}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-600/20 active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* BACSE344 Course Banner */}
      <div className="p-4 border-t border-slate-700/60 bg-slate-900/40">
        <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs">
          <p className="text-slate-400 font-medium">Course Submission</p>
          <p className="font-semibold text-slate-200">BACSE344 - Cloud Architecture</p>
          <p className="text-cyan-400 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Cloud Deployed & Ready
          </p>
        </div>
      </div>
    </aside>
  );
}
