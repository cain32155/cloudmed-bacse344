import React from 'react';
import { Search, Bell, Server, Database } from 'lucide-react';

export default function Header({ searchTerm, setSearchTerm, activeTab }) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'System Dashboard';
      case 'appointments': return 'Appointment Records Management';
      case 'patients': return 'Patient Records Directory';
      case 'doctors': return 'Medical Staff Directory';
      case 'apidocs': return 'RESTful API Documentation';
      case 'cloudarch': return 'Cloud Architecture & Service Specification';
      default: return 'CloudMed System';
    }
  };

  return (
    <header className="h-16 bg-slate-800/80 border-b border-slate-700/60 px-6 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
      <div>
        <h2 className="text-xl font-bold text-white">{getTabTitle()}</h2>
        <p className="text-xs text-slate-400">Cloud-Hosted Healthcare Infrastructure</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        {(activeTab === 'appointments' || activeTab === 'patients') && (
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        )}

        {/* System Badges */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
            <Server className="w-3.5 h-3.5" />
            API Online
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20">
            <Database className="w-3.5 h-3.5" />
            Cloud Database Connected
          </span>
        </div>
      </div>
    </header>
  );
}
