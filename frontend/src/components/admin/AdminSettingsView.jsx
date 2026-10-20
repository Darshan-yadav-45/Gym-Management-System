import React from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Database, 
  Mail, 
  MessageSquare, 
  Globe, 
  Clock, 
  Lock, 
  ExternalLink, 
  Sparkles,
  Server
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminSettingsView({ currentUser }) {
  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-gray-400" />
            <span>Platform Settings & System Status</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            FitFlow Gym management configurations, timezone alignment, security parameters, and communication channels
          </p>
        </div>
      </div>

      {/* Grid of Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Admin Account & Security */}
        <div className="bg-[#14151b] border border-white/5 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ef233c]" /> Active Administrator
            </h2>
            <span className="text-[10px] bg-red-500/20 text-[#ef233c] border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
              ROLE_ADMIN
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-[#181920] rounded-xl border border-white/5 flex justify-between items-center">
              <span className="text-gray-400">Admin Username / Email:</span>
              <span className="text-white font-mono font-bold">{currentUser?.email || 'appu12813@gmail.com'}</span>
            </div>
            <div className="p-3 bg-[#181920] rounded-xl border border-white/5 flex justify-between items-center">
              <span className="text-gray-400">Authentication Scheme:</span>
              <span className="text-emerald-400 font-mono font-bold">JWT Bearer (HS256)</span>
            </div>
            <div className="p-3 bg-[#181920] rounded-xl border border-white/5 flex justify-between items-center">
              <span className="text-gray-400">Password Encryption:</span>
              <span className="text-white font-mono font-bold">BCrypt (Strength 10)</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            All administrative actions (payroll access, candidate status changes, staff creation) require authorized server-side evaluation.
          </p>
        </div>

        {/* Card 2: Public Careers Portal Settings */}
        <div className="bg-[#14151b] border border-white/5 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-400" /> Public Recruitment Portal
            </h2>
            <span className="text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
              Public Route
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-[#181920] rounded-xl border border-white/5 flex justify-between items-center">
              <span className="text-gray-400">Careers Route:</span>
              <a
                href="/careers/trainers"
                target="_blank"
                rel="noreferrer"
                className="text-[#ef233c] hover:underline font-mono font-bold flex items-center gap-1"
              >
                <span>/careers/trainers</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="p-3 bg-[#181920] rounded-xl border border-white/5 flex justify-between items-center">
              <span className="text-gray-400">Auto Status Enforcement:</span>
              <span className="text-emerald-400 font-bold">Active (Opening & Deadline Based)</span>
            </div>
            <div className="p-3 bg-[#181920] rounded-xl border border-white/5 flex justify-between items-center">
              <span className="text-gray-400">Resume Storage Folder:</span>
              <span className="text-white font-mono font-bold">uploads/resumes/</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            Only vacancies marked as <strong>OPEN</strong> accept candidate applications. Scheduled and expired postings display appropriate feedback.
          </p>
        </div>

        {/* Card 3: Communications & Alerts Gateway */}
        <div className="bg-[#14151b] border border-white/5 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-yellow-400" /> Notifications & Communications
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-[#181920] rounded-xl border border-white/5 flex justify-between items-center">
              <span className="text-gray-400">Admin Email Identity:</span>
              <span className="text-white font-mono font-bold">appu12813@gmail.com</span>
            </div>
            <div className="p-3 bg-[#181920] rounded-xl border border-white/5 flex justify-between items-center">
              <span className="text-gray-400">SMTP Host / Port:</span>
              <span className="text-white font-mono font-bold">smtp.gmail.com:587</span>
            </div>
            <div className="p-3 bg-[#181920] rounded-xl border border-white/5 flex justify-between items-center">
              <span className="text-gray-400">Audit Trail Logging:</span>
              <span className="text-emerald-400 font-bold">Enabled (PostgreSQL Table email_logs)</span>
            </div>
          </div>
        </div>

        {/* Card 4: Database & Infrastructure */}
        <div className="bg-[#14151b] border border-white/5 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" /> PostgreSQL Database
            </h2>
            <Link
              to="/admin/db"
              className="text-xs text-blue-400 hover:underline font-bold flex items-center gap-1"
            >
              <span>Explore Schema</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-[#181920] rounded-xl border border-white/5 flex justify-between items-center">
              <span className="text-gray-400">Database Engine:</span>
              <span className="text-white font-mono font-bold">PostgreSQL 17</span>
            </div>
            <div className="p-3 bg-[#181920] rounded-xl border border-white/5 flex justify-between items-center">
              <span className="text-gray-400">Staff & Recruitment Tables:</span>
              <span className="text-emerald-400 font-bold">5 Entities Migrated</span>
            </div>
            <div className="p-3 bg-[#181920] rounded-xl border border-white/5 flex justify-between items-center">
              <span className="text-gray-400">ORM Layer:</span>
              <span className="text-white font-mono font-bold">Hibernate 6.6 / Spring Data JPA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
