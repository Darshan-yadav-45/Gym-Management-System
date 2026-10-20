import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Database, 
  LogOut, 
  Menu, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { authService } from '../services/authService';
import { adminService } from '../services/adminService';

// Admin Subcomponents
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminOverviewView from '../components/admin/AdminOverviewView';
import AdminMembersView from '../components/admin/AdminMembersView';
import AdminStaffView from '../components/admin/AdminStaffView';
import AdminRecruitmentView from '../components/admin/AdminRecruitmentView';
import AdminApplicationsView from '../components/admin/AdminApplicationsView';
import AdminSchedulesView from '../components/admin/AdminSchedulesView';
import AdminSubscriptionsView from '../components/admin/AdminSubscriptionsView';
import AdminNotificationsView from '../components/admin/AdminNotificationsView';
import AdminSettingsView from '../components/admin/AdminSettingsView';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null); // { message, type }

  // High-level Metrics for Overview & Sidebar Counts
  const [metrics, setMetrics] = useState(null);
  const [staffSummary, setStaffSummary] = useState(null);
  const [recruitmentSummary, setRecruitmentSummary] = useState(null);
  const [applicationSummary, setApplicationSummary] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Cross-tab parameters
  const [appFilterVacancyId, setAppFilterVacancyId] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/admin/login');
      return;
    }
    if (user.role !== 'ADMIN') {
      alert('Access Denied: Administrator role required to view the FitFlow Admin Console.');
      navigate('/dashboard/routines');
      return;
    }
    setCurrentUser(user);
    loadPlatformMetrics();
  }, [navigate]);

  const loadPlatformMetrics = async () => {
    setLoadingMetrics(true);
    try {
      const [m, st, rec, app] = await Promise.all([
        adminService.getDashboardMetrics().catch(() => null),
        adminService.getStaffSummary().catch(() => null),
        adminService.getRecruitmentSummary().catch(() => null),
        adminService.getApplicationSummary().catch(() => null)
      ]);
      setMetrics(m);
      setStaffSummary(st);
      setRecruitmentSummary(rec);
      setApplicationSummary(app);
    } catch (err) {
      console.error('Failed to load admin overview metrics:', err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleNavigateToApplicationsWithVacancy = (vacancyId) => {
    setAppFilterVacancyId(vacancyId);
    setActiveTab('applications');
  };

  // Badge counts for sidebar
  const sidebarCounts = {
    overview: undefined,
    members: metrics?.totalUsers,
    staff: staffSummary?.totalStaff,
    recruitment: recruitmentSummary?.openVacancies,
    applications: applicationSummary?.totalApplications,
    schedules: undefined,
    subscriptions: metrics?.activeSubscriptions,
    notifications: metrics?.usersRequiringFollowUp,
    settings: undefined
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-200 font-sans selection:bg-[#ef233c] selection:text-white flex flex-col">
      
      {/* ======================================================== */}
      {/* TOP HEADER BAR                                           */}
      {/* ======================================================== */}
      <header className="bg-[#14151b] border-b border-white/10 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center gap-1 group">
              <span className="text-xl sm:text-2xl font-black font-display tracking-[0.15em] text-white">
                FIT<span className="text-[#ef233c] font-bold italic">FLOW</span>
              </span>
            </Link>

            <span className="bg-red-500/20 text-[#ef233c] border border-[#ef233c]/30 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Admin Console
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Careers Portal Link */}
            <a
              href="/careers/trainers"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-bold items-center gap-1.5 transition-colors border border-purple-500/20 hidden md:flex"
              title="Preview Public Trainer Opportunities Page"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Careers Portal</span>
            </a>

            <Link
              to="/dashboard/routines"
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors border border-white/5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Member Dashboard</span>
            </Link>

            <Link
              to="/admin/db"
              className="px-3 py-1.5 rounded-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-blue-500/30"
              title="Open Raw PostgreSQL DB Explorer"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">DB Explorer</span>
            </Link>

            <button
              onClick={() => {
                authService.logout();
                navigate('/admin/login');
              }}
              title="Sign Out"
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* MAIN LAYOUT: SIDEBAR + CONTENT AREA                      */}
      {/* ======================================================== */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* 9-Section Responsive Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={(tabId) => {
            setActiveTab(tabId);
            if (tabId !== 'applications') {
              setAppFilterVacancyId(null);
            }
          }}
          counts={sidebarCounts}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Toast Notification Banner */}
          {notification && (
            <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between gap-2 shadow-lg animate-in fade-in duration-200 ${
              notification.type === 'error'
                ? 'bg-red-500/20 border border-red-500/40 text-red-200'
                : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200'
            }`}>
              <div className="flex items-center gap-2">
                {notification.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                )}
                <span>{notification.message}</span>
              </div>
              <button onClick={() => setNotification(null)} className="hover:opacity-75 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* VIEW 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <AdminOverviewView
              metrics={metrics}
              staffSummary={staffSummary}
              recruitmentSummary={recruitmentSummary}
              applicationSummary={applicationSummary}
              loading={loadingMetrics}
              onRefresh={loadPlatformMetrics}
              onNavigateTab={(tabId) => setActiveTab(tabId)}
            />
          )}

          {/* VIEW 2: MEMBERS MANAGEMENT */}
          {activeTab === 'members' && (
            <AdminMembersView
              onNotify={showNotification}
            />
          )}

          {/* VIEW 3: TRAINERS & TRAINING STAFF */}
          {activeTab === 'staff' && (
            <AdminStaffView
              onNotify={showNotification}
              onNavigateSchedules={() => setActiveTab('schedules')}
            />
          )}

          {/* VIEW 4: RECRUITMENT & VACANCIES */}
          {activeTab === 'recruitment' && (
            <AdminRecruitmentView
              onNotify={showNotification}
              onNavigateApplications={handleNavigateToApplicationsWithVacancy}
            />
          )}

          {/* VIEW 5: TRAINER APPLICATIONS */}
          {activeTab === 'applications' && (
            <AdminApplicationsView
              initialVacancyId={appFilterVacancyId}
              onNotify={showNotification}
              onNavigateStaff={() => setActiveTab('staff')}
            />
          )}

          {/* VIEW 6: STAFF SCHEDULES */}
          {activeTab === 'schedules' && (
            <AdminSchedulesView
              onNotify={showNotification}
            />
          )}

          {/* VIEW 7: SUBSCRIPTIONS */}
          {activeTab === 'subscriptions' && (
            <AdminSubscriptionsView
              onNotify={showNotification}
            />
          )}

          {/* VIEW 8: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <AdminNotificationsView
              onNotify={showNotification}
            />
          )}

          {/* VIEW 9: SETTINGS */}
          {activeTab === 'settings' && (
            <AdminSettingsView
              currentUser={currentUser}
            />
          )}

        </main>
      </div>

    </div>
  );
}
