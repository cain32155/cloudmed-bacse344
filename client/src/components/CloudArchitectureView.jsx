import React from 'react';
import { Cloud, Server, Database, Shield, Cpu, Globe, ArrowDown, Layers, Box } from 'lucide-react';

export default function CloudArchitectureView() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">System Architecture & Cloud Deployment</h3>
            <p className="text-xs text-slate-400">
              BACSE344 Architectural Diagram & Cloud Infrastructure Component Specifications
            </p>
          </div>
        </div>
      </div>

      {/* Cloud Architecture Visual Flow Diagram */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-6">
        <h4 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          3-Tier Cloud Architecture Diagram
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Tier 1: Client Tier */}
          <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 space-y-3 relative group hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-extrabold uppercase">
                Tier 1: Presentation
              </span>
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <h5 className="font-bold text-white text-base">Client SPA (React + Tailwind)</h5>
            <p className="text-xs text-slate-400">
              Hosted on Cloud CDN (Vercel / Netlify / Render Static).
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
              <li>• Responsive single-page dashboard</li>
              <li>• Axios HTTP Client for REST calls</li>
              <li>• Real-time CRUD UI updates</li>
            </ul>
          </div>

          {/* Tier 2: REST API Backend */}
          <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 space-y-3 relative group hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-extrabold uppercase">
                Tier 2: Application
              </span>
              <Server className="w-5 h-5 text-cyan-400" />
            </div>
            <h5 className="font-bold text-white text-base">Express REST API Gateway</h5>
            <p className="text-xs text-slate-400">
              Hosted on Cloud Compute (Render Web Service / AWS Elastic Beanstalk).
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
              <li>• Node.js REST API server</li>
              <li>• Express routing & CORS middleware</li>
              <li>• JSON Request validation & Health checks</li>
            </ul>
          </div>

          {/* Tier 3: Database */}
          <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 space-y-3 relative group hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase">
                Tier 3: Persistence
              </span>
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <h5 className="font-bold text-white text-base">Cloud Database Instance</h5>
            <p className="text-xs text-slate-400">
              Cloud Database Service (Supabase / MongoDB Atlas / Render Postgres).
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
              <li>• Relational schema with Foreign Keys</li>
              <li>• Persistent record storage for Patients & Appointments</li>
              <li>• Automated cloud snapshots</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cloud Components Detailed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Docker Containerization */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-cyan-400" />
            <h4 className="font-bold text-white text-base">Containerization & Docker</h4>
          </div>
          <p className="text-xs text-slate-300">
            CloudMed is packaged using multi-stage Docker containerization to ensure identical execution environments across local development and cloud production.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl font-mono text-[11px] text-cyan-300 border border-slate-800">
            <code>
              FROM node:18-alpine<br />
              WORKDIR /app<br />
              COPY package*.json ./<br />
              RUN npm install --production<br />
              EXPOSE 5000<br />
              CMD ["npm", "start"]
            </code>
          </div>
        </div>

        {/* Free Cloud Deployment Guide */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h4 className="font-bold text-white text-base">Cloud Deployment Instructions</h4>
          </div>
          <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside">
            <li><strong className="text-white">Push to GitHub:</strong> Upload project repository to GitHub.</li>
            <li><strong className="text-white">Backend (Render / Railway):</strong> Connect repo, set environment variables (`PORT=5000`), build command `npm install`, start command `npm start`.</li>
            <li><strong className="text-white">Frontend (Vercel / Netlify):</strong> Connect repo `client` folder, set build command `npm run build`, output dir `dist`.</li>
            <li><strong className="text-white">Database:</strong> Attach cloud database URI string for persistent storage.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
