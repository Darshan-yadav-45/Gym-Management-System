import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Dumbbell, 
  Briefcase, 
  FileText, 
  Calendar, 
  CreditCard, 
  Bell, 
  Settings, 
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const ADMIN_SECTIONS = [
  { id: 'overview', label: 'Overview', icon: TrendingUp, desc: 'Live platform analytics & KPIs' },
  { id: 'members', label: 'Members', icon: Users, desc: 'Gym member accounts & renewals' },
  { id: 'staff', label: 'Trainers & Training Staff', icon: Dumbbell, desc: 'Staff directory & profiles' },
  { id: 'recruitment', label: 'Recruitment & Vacancies', icon: Briefcase, desc: 'Job postings & hiring goals' },
  { id: 'applications', label: 'Trainer Applications', icon: FileText, desc: 'Candidate pipeline & review' },
  { id: 'schedules', label: 'Staff Schedules', icon: Calendar, desc: 'Shift assignments & rotas' },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, desc: 'Member plan enrollments' },
  { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Deadline alerts & email audit' },
  { id: 'settings', label: 'Settings', icon: Settings, desc: 'Admin console & integrations' }
];

export default function AdminSidebar({ 
  activeTab, 
  onSelectTab, 
  counts = {},
  isMobileOpen = false,
  onCloseMobile = () => {} 
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile} 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#121319] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand / Logo */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ef233c] to-[#9e0c1b] flex items-center justify-center text-white shadow-lg shadow-red-900/30">
              <Dumbbell className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-wider text-white font-display">
                  FIT<span className="text-[#ef233c] italic">FLOW</span>
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest bg-red-500/20 text-[#ef233c] border border-red-500/30 px-1.5 py-0.5 rounded-full">
                  Admin
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium">Management & Recruitment</p>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-gray-500">
            Navigation Menu
          </div>
          {ADMIN_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeTab === sec.id;
            const count = counts[sec.id];

            return (
              <button
                key={sec.id}
                onClick={() => {
                  onSelectTab(sec.id);
                  onCloseMobile();
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer group
                  ${isActive 
                    ? 'bg-gradient-to-r from-[#ef233c] to-[#b81428] text-white shadow-lg shadow-red-950/50' 
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'}
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`
                    p-1.5 rounded-lg transition-colors
                    ${isActive ? 'bg-black/20 text-white' : 'text-gray-400 group-hover:text-white group-hover:bg-white/5'}
                  `}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                  </div>
                  <div className="truncate">
                    <span className="block truncate">{sec.label}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {typeof count === 'number' && (
                    <span className={`
                      text-[10px] font-bold px-2 py-0.5 rounded-full font-mono
                      ${isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 group-hover:text-gray-200'}
                    `}>
                      {count}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom helper card */}
        <div className="p-3 border-t border-white/5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#181922] to-[#14151b] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-300">
              <Sparkles className="w-3.5 h-3.5 text-[#ef233c]" />
              <span>Public Careers Portal</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Open hiring listings are published at <code className="text-gray-400 font-mono">/careers/trainers</code>.
            </p>
            <a
              href="/careers/trainers"
              target="_blank"
              rel="noreferrer"
              className="inline-block text-[11px] font-bold text-[#ef233c] hover:underline"
            >
              Preview Careers Page &rarr;
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
