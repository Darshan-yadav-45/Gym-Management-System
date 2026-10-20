import React from 'react';
import { 
  Users, 
  CreditCard, 
  Dumbbell, 
  Briefcase, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  ArrowRight, 
  Database, 
  Bell, 
  CheckCircle2, 
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminOverviewView({
  metrics,
  staffSummary,
  recruitmentSummary,
  applicationSummary,
  loading,
  onRefresh,
  onNavigateTab
}) {
  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <span>Platform Overview</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
              Live Database
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time platform metrics, recruitment pipeline, and gym operations
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 flex items-center gap-2 border border-white/5 cursor-pointer transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#ef233c]' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {loading && !metrics ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#ef233c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Top Primary Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* Total Members */}
            <div className="bg-[#14151b] border border-white/5 rounded-2xl p-4 shadow-md space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                <Users className="w-3 h-3 text-blue-400" /> Total Users
              </span>
              <p className="text-2xl sm:text-3xl font-black text-white">{metrics?.totalUsers ?? '—'}</p>
              <span className="text-[11px] text-emerald-400 font-semibold">{metrics?.activeUsers ?? 0} active</span>
            </div>

            {/* Active Subscriptions */}
            <div className="bg-[#14151b] border border-white/5 rounded-2xl p-4 shadow-md space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-emerald-400" /> Active Subs
              </span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">{metrics?.activeSubscriptions ?? '—'}</p>
              <span className="text-[11px] text-gray-400 font-semibold">{metrics?.premiumSubscribers ?? 0} premium</span>
            </div>

            {/* Expiring Soon */}
            <div className="bg-[#14151b] border border-white/5 rounded-2xl p-4 shadow-md space-y-1">
              <span className="text-[10px] uppercase font-bold text-yellow-400 tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3" /> Expiring &lt;7d
              </span>
              <p className="text-2xl sm:text-3xl font-black text-yellow-400">{metrics?.expiringSoonSubscriptions ?? '—'}</p>
              <span className="text-[11px] text-yellow-400/80 font-semibold">Requires alert</span>
            </div>

            {/* Total Trainers & Staff */}
            <div className="bg-[#14151b] border border-white/5 rounded-2xl p-4 shadow-md space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                <Dumbbell className="w-3 h-3 text-[#ef233c]" /> Gym Staff
              </span>
              <p className="text-2xl sm:text-3xl font-black text-white">{staffSummary?.totalStaff ?? '—'}</p>
              <span className="text-[11px] text-emerald-400 font-semibold">{staffSummary?.activeTrainers ?? 0} active trainers</span>
            </div>

            {/* Open Vacancies */}
            <div className="bg-[#14151b] border border-white/5 rounded-2xl p-4 shadow-md space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-purple-400" /> Open Vacancies
              </span>
              <p className="text-2xl sm:text-3xl font-black text-purple-400">{recruitmentSummary?.openVacancies ?? '—'}</p>
              <span className="text-[11px] text-gray-400 font-semibold">{recruitmentSummary?.totalPositionsAvailable ?? 0} open positions</span>
            </div>

            {/* Trainer Applications */}
            <div className="bg-[#14151b] border border-white/5 rounded-2xl p-4 shadow-md space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                <FileText className="w-3 h-3 text-cyan-400" /> Applications
              </span>
              <p className="text-2xl sm:text-3xl font-black text-cyan-400">{applicationSummary?.totalApplications ?? '—'}</p>
              <span className="text-[11px] text-cyan-300 font-semibold">{applicationSummary?.submitted ?? 0} new received</span>
            </div>
          </div>

          {/* Highlights & Modules Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Staff & Recruitment Snapshot */}
            <div className="bg-[#14151b] border border-white/5 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black uppercase text-white flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-[#ef233c]" /> Staff & Recruitment Status
                </h2>
                <button
                  onClick={() => onNavigateTab('staff')}
                  className="text-xs text-[#ef233c] hover:underline font-bold flex items-center gap-1"
                >
                  Manage &rarr;
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase text-gray-400 block font-bold">Total Trainers</span>
                  <span className="text-lg font-black text-white mt-0.5 block">{staffSummary?.totalTrainers ?? 0}</span>
                  <span className="text-[10px] text-gray-500 font-medium">Strength, Yoga, etc.</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase text-gray-400 block font-bold">Training Staff</span>
                  <span className="text-lg font-black text-white mt-0.5 block">{staffSummary?.totalTrainingStaff ?? 0}</span>
                  <span className="text-[10px] text-gray-500 font-medium">Floor & Physio</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase text-gray-400 block font-bold">Hired This Month</span>
                  <span className="text-lg font-black text-emerald-400 mt-0.5 block">+{staffSummary?.hiredThisMonth ?? 0}</span>
                  <span className="text-[10px] text-emerald-500 font-medium">Recent additions</span>
                </div>
              </div>

              <div className="p-3.5 bg-gradient-to-r from-red-500/10 to-transparent border border-[#ef233c]/20 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Looking to expand your coaching team?</span>
                  <span className="text-[11px] text-gray-400">Post new job openings or review submitted candidate resumes.</span>
                </div>
                <button
                  onClick={() => onNavigateTab('recruitment')}
                  className="px-3 py-1.5 bg-[#ef233c] hover:bg-[#d90429] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex-shrink-0"
                >
                  Post Vacancy
                </button>
              </div>
            </div>

            {/* Application Pipeline Snapshot */}
            <div className="bg-[#14151b] border border-white/5 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black uppercase text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" /> Candidate Pipeline
                </h2>
                <button
                  onClick={() => onNavigateTab('applications')}
                  className="text-xs text-cyan-400 hover:underline font-bold flex items-center gap-1"
                >
                  Review Pipeline &rarr;
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-[#181920] p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">New</span>
                  <span className="text-lg font-black text-white">{applicationSummary?.submitted ?? 0}</span>
                </div>
                <div className="bg-[#181920] p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-yellow-400 uppercase font-bold block">Review</span>
                  <span className="text-lg font-black text-yellow-400">{applicationSummary?.underReview ?? 0}</span>
                </div>
                <div className="bg-[#181920] p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-purple-400 uppercase font-bold block">Interview</span>
                  <span className="text-lg font-black text-purple-400">{applicationSummary?.interviewScheduled ?? 0}</span>
                </div>
                <div className="bg-[#181920] p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold block">Selected</span>
                  <span className="text-lg font-black text-emerald-400">{applicationSummary?.selected ?? 0}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#181920] rounded-2xl border border-white/5 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300">Staff scheduling rotas & shift tracking</span>
                </div>
                <button
                  onClick={() => onNavigateTab('schedules')}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold border border-white/5"
                >
                  View Rotas
                </button>
              </div>
            </div>
          </div>

          {/* Quick Operations Direct Jump Cards */}
          <div className="bg-[#14151b] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ef233c]" /> Admin Management Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => onNavigateTab('members')}
                className="bg-[#181920] hover:bg-[#20222d] border border-white/5 p-4 rounded-2xl text-left transition-all cursor-pointer group"
              >
                <Users className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-white block">Members Directory</span>
                <p className="text-[11px] text-gray-400 mt-1">Ordinary gym members, plan validity, and renewals.</p>
              </button>

              <button
                onClick={() => onNavigateTab('staff')}
                className="bg-[#181920] hover:bg-[#20222d] border border-white/5 p-4 rounded-2xl text-left transition-all cursor-pointer group"
              >
                <Dumbbell className="w-5 h-5 text-[#ef233c] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-white block">Trainers & Staff</span>
                <p className="text-[11px] text-gray-400 mt-1">Manage fitness coaches, salaries, and shifts.</p>
              </button>

              <button
                onClick={() => onNavigateTab('recruitment')}
                className="bg-[#181920] hover:bg-[#20222d] border border-white/5 p-4 rounded-2xl text-left transition-all cursor-pointer group"
              >
                <Briefcase className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-white block">Recruitment & Vacancies</span>
                <p className="text-[11px] text-gray-400 mt-1">Publish hiring ads with deadlines and quotas.</p>
              </button>

              <button
                onClick={() => onNavigateTab('notifications')}
                className="bg-[#181920] hover:bg-[#20222d] border border-white/5 p-4 rounded-2xl text-left transition-all cursor-pointer group"
              >
                <Bell className="w-5 h-5 text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-white block">Notifications & Alerts</span>
                <p className="text-[11px] text-gray-400 mt-1">Expiry broadcasts & SMTP audit logs.</p>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
