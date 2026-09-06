import React from 'react';
import { FileCode2, Copy, Check, Server, ShieldCheck, Database } from 'lucide-react';

export default function ApiDocsView() {
  const [copiedEndpoint, setCopiedEndpoint] = React.useState('');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(text);
    setTimeout(() => setCopiedEndpoint(''), 2000);
  };

  const apiEndpoints = [
    {
      method: 'GET',
      path: '/api/appointments',
      desc: 'Fetch all appointments. Supports query filtering: ?status=Scheduled&doctor_id=1&date=YYYY-MM-DD',
      response: `{ "success": true, "count": 4, "data": [ { "id": 1, "patient_name": "Alice Johnson", "status": "Scheduled" } ] }`
    },
    {
      method: 'POST',
      path: '/api/appointments',
      desc: 'Book new appointment. Requires patient_id, doctor_id, appointment_date, appointment_time, reason.',
      response: `{ "success": true, "message": "Appointment booked successfully", "data": { "id": 5, ... } }`
    },
    {
      method: 'PUT',
      path: '/api/appointments/:id',
      desc: 'Update appointment status (Scheduled, Completed, Cancelled), notes, or rescheduled date/time.',
      response: `{ "success": true, "message": "Appointment updated successfully", "data": { ... } }`
    },
    {
      method: 'DELETE',
      path: '/api/appointments/:id',
      desc: 'Cancel and delete an appointment from cloud database by ID.',
      response: `{ "success": true, "message": "Appointment #1 deleted successfully" }`
    },
    {
      method: 'GET',
      path: '/api/patients',
      desc: 'Retrieve patient directory. Supports search filter: ?search=alice',
      response: `{ "success": true, "count": 4, "data": [ { "id": 1, "name": "Alice Johnson", "blood_group": "A+" } ] }`
    },
    {
      method: 'POST',
      path: '/api/patients',
      desc: 'Register a new patient record with medical history details.',
      response: `{ "success": true, "message": "Patient created successfully", "data": { "id": 5, ... } }`
    },
    {
      method: 'PUT',
      path: '/api/patients/:id',
      desc: 'Update patient medical details, contact numbers, or address.',
      response: `{ "success": true, "message": "Patient updated successfully", "data": { ... } }`
    },
    {
      method: 'DELETE',
      path: '/api/patients/:id',
      desc: 'Delete patient record and associated appointment history.',
      response: `{ "success": true, "message": "Patient #1 deleted successfully" }`
    },
    {
      method: 'GET',
      path: '/api/doctors',
      desc: 'List all active medical specialists and availability schedules.',
      response: `{ "success": true, "count": 4, "data": [...] }`
    },
    {
      method: 'GET',
      path: '/api/analytics/overview',
      desc: 'Get system analytics for cloud dashboard (counts for total, scheduled, patients, doctors).',
      response: `{ "success": true, "data": { "totalAppointments": 4, "totalPatients": 4, ... } }`
    }
  ];

  const getMethodBadge = (method) => {
    switch (method) {
      case 'GET': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'POST': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'PUT': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'DELETE': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">RESTful API Documentation</h3>
            <p className="text-xs text-slate-400">
              Complete REST API specification implemented for BACSE344 - Cloud Infrastructure and Architecture.
            </p>
          </div>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="space-y-4">
        {apiEndpoints.map((ep, idx) => (
          <div key={idx} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${getMethodBadge(ep.method)}`}>
                  {ep.method}
                </span>
                <span className="font-mono text-sm text-slate-100 font-semibold">{ep.path}</span>
              </div>
              <button
                onClick={() => copyToClipboard(`http://localhost:5000${ep.path}`)}
                className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors self-start sm:self-auto"
              >
                {copiedEndpoint === `http://localhost:5000${ep.path}` ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Endpoint
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Endpoint URL
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-300">{ep.desc}</p>

            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 font-mono text-[11px] text-cyan-300/90 overflow-x-auto">
              <pre>{ep.response}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
