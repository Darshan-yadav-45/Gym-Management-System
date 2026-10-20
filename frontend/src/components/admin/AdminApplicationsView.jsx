import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  UserCheck, 
  UserX, 
  Briefcase, 
  DollarSign, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Send,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminApplicationsView({ initialVacancyId = null, onNotify, onNavigateStaff }) {
  const [applications, setApplications] = useState([]);
  const [summary, setSummary] = useState(null);
  const [vacanciesList, setVacanciesList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filters
  const [vacancyFilter, setVacancyFilter] = useState(initialVacancyId || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Selected Detail Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [appHistory, setAppHistory] = useState([]);
  const [loadingAppDetail, setLoadingAppDetail] = useState(false);

  // Action Modals
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewData, setInterviewData] = useState({
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00 AM',
    location: 'FitFlow HQ - Studio 1 / Google Meet',
    notes: 'Please bring your NASM/ACE certificate copies and sports attire.'
  });

  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [convertData, setConvertData] = useState({
    designation: 'Personal Trainer',
    monthlySalary: 3800,
    employmentType: 'FULL_TIME',
    joiningDate: new Date().toISOString().split('T')[0],
    assignedShift: 'Morning (06:00 - 14:00)'
  });

  const [newNote, setNewNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadVacanciesDropdown();
    loadSummary();
  }, []);

  useEffect(() => {
    loadApplications(page, vacancyFilter, statusFilter, search);
  }, [page, vacancyFilter, statusFilter]);

  const loadVacanciesDropdown = async () => {
    try {
      const data = await adminService.getVacancies('', '', 0, 100);
      setVacanciesList(data.content || []);
    } catch (err) {
      console.error('Failed to load vacancies dropdown:', err);
    }
  };

  const loadSummary = async () => {
    try {
      const data = await adminService.getApplicationSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load application summary:', err);
    }
  };

  const loadApplications = async (p = 0, vId = '', s = '', q = '') => {
    setLoading(true);
    try {
      const data = await adminService.getApplications(vId || null, s, q, p, 15);
      setApplications(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load applications:', err);
      onNotify?.('Failed to load trainer applications.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadApplications(0, vacancyFilter, statusFilter, search);
  };

  const handleOpenDetail = async (app) => {
    setSelectedApp(app);
    setLoadingAppDetail(true);
    try {
      const freshData = await adminService.getApplication(app.id);
      setSelectedApp(freshData);
      setAppHistory(freshData.statusHistory || []);
    } catch (err) {
      console.error('Failed to load full application details:', err);
    } finally {
      setLoadingAppDetail(false);
    }
  };

  const handleStatusTransition = async (status, reason = '') => {
    if (!selectedApp) return;

    if (['SELECTED', 'REJECTED'].includes(status)) {
      if (!confirm(`Are you sure you want to change status to ${status}? This is a consequential candidate action.`)) {
        return;
      }
    }

    setActionLoading(true);
    try {
      const updated = await adminService.updateApplicationStatus(selectedApp.id, status, reason);
      setSelectedApp(updated);
      onNotify?.(`Application updated to ${status}.`, 'success');
      loadApplications(page, vacancyFilter, statusFilter, search);
      loadSummary();
      // Reload history
      const freshData = await adminService.getApplication(selectedApp.id);
      setAppHistory(freshData.statusHistory || []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update application status.';
      onNotify?.(msg, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleScheduleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    setActionLoading(true);
    try {
      const updated = await adminService.scheduleInterview(
        selectedApp.id,
        interviewData.date,
        interviewData.time,
        interviewData.location,
        interviewData.notes
      );
      setSelectedApp(updated);
      setInterviewModalOpen(false);
      onNotify?.('Interview scheduled and invitation recorded.', 'success');
      loadApplications(page, vacancyFilter, statusFilter, search);
      loadSummary();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to schedule interview.';
      onNotify?.(msg, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNoteSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedApp) return;
    setActionLoading(true);
    try {
      const updated = await adminService.addApplicationNote(selectedApp.id, newNote.trim());
      setSelectedApp(updated);
      setNewNote('');
      onNotify?.('Internal feedback note appended.', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add note.';
      onNotify?.(msg, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenConvertModal = () => {
    if (!selectedApp) return;
    setConvertData({
      designation: selectedApp.desiredPosition || 'Personal Trainer',
      monthlySalary: 3800,
      employmentType: 'FULL_TIME',
      joiningDate: selectedApp.expectedJoiningDate || new Date().toISOString().split('T')[0],
      assignedShift: 'Morning (06:00 - 14:00)'
    });
    setConvertModalOpen(true);
  };

  const handleConvertSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    setActionLoading(true);
    try {
      const res = await adminService.convertToStaff(selectedApp.id, convertData);
      setConvertModalOpen(false);
      onNotify?.(res.message || 'Candidate successfully converted to official gym staff member!', 'success');
      loadApplications(page, vacancyFilter, statusFilter, search);
      loadSummary();
      // Reload application
      const freshData = await adminService.getApplication(selectedApp.id);
      setSelectedApp(freshData);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to convert candidate to staff.';
      onNotify?.(msg, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            <span>Trainer Applications</span>
            <span className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-bold">
              {totalElements} Total
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Review candidate qualifications, schedule interviews, maintain audit history, and hire staff
          </p>
        </div>

        <button
          onClick={() => {
            loadApplications(page, vacancyFilter, statusFilter, search);
            loadSummary();
          }}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 flex items-center gap-2 border border-white/5 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 8 Application Summary Cards (Part 8 Requirements) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
        {/* 1. Total */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-3 text-center space-y-0.5 shadow-md">
          <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-wider">Total</span>
          <p className="text-xl font-black text-white">{summary?.totalApplications ?? '—'}</p>
        </div>

        {/* 2. New (Submitted) */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-3 text-center space-y-0.5 shadow-md">
          <span className="text-[9px] uppercase font-bold text-cyan-400 block tracking-wider">New</span>
          <p className="text-xl font-black text-cyan-400">{summary?.submitted ?? '—'}</p>
        </div>

        {/* 3. Under Review */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-3 text-center space-y-0.5 shadow-md">
          <span className="text-[9px] uppercase font-bold text-yellow-400 block tracking-wider">Review</span>
          <p className="text-xl font-black text-yellow-400">{summary?.underReview ?? '—'}</p>
        </div>

        {/* 4. Shortlisted */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-3 text-center space-y-0.5 shadow-md">
          <span className="text-[9px] uppercase font-bold text-blue-400 block tracking-wider">Shortlisted</span>
          <p className="text-xl font-black text-blue-400">{summary?.shortlisted ?? '—'}</p>
        </div>

        {/* 5. Interview Scheduled */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-3 text-center space-y-0.5 shadow-md">
          <span className="text-[9px] uppercase font-bold text-purple-400 block tracking-wider">Interview</span>
          <p className="text-xl font-black text-purple-400">{summary?.interviewScheduled ?? '—'}</p>
        </div>

        {/* 6. Selected */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-3 text-center space-y-0.5 shadow-md">
          <span className="text-[9px] uppercase font-bold text-emerald-400 block tracking-wider">Selected</span>
          <p className="text-xl font-black text-emerald-400">{summary?.selected ?? '—'}</p>
        </div>

        {/* 7. Rejected */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-3 text-center space-y-0.5 shadow-md">
          <span className="text-[9px] uppercase font-bold text-red-400 block tracking-wider">Rejected</span>
          <p className="text-xl font-black text-red-400">{summary?.rejected ?? '—'}</p>
        </div>

        {/* 8. Withdrawn */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-3 text-center space-y-0.5 shadow-md">
          <span className="text-[9px] uppercase font-bold text-gray-500 block tracking-wider">Withdrawn</span>
          <p className="text-xl font-black text-gray-400">{summary?.withdrawn ?? '—'}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#14151b] border border-white/5 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2">
          {/* Vacancy dropdown */}
          <div className="flex items-center gap-1.5 bg-[#181920] border border-white/10 rounded-xl px-3 py-1.5 text-xs">
            <Briefcase className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={vacancyFilter}
              onChange={(e) => {
                setVacancyFilter(e.target.value);
                setPage(0);
              }}
              className="bg-transparent text-white focus:outline-none cursor-pointer text-xs max-w-xs"
            >
              <option value="" className="bg-[#14151b]">All Vacancies</option>
              {vacanciesList.map((v) => (
                <option key={v.id} value={v.id} className="bg-[#14151b]">
                  {v.title} ({v.status})
                </option>
              ))}
            </select>
          </div>

          {/* Status dropdown */}
          <div className="flex items-center gap-1.5 bg-[#181920] border border-white/10 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
            >
              <option value="" className="bg-[#14151b]">All Statuses</option>
              <option value="SUBMITTED" className="bg-[#14151b]">SUBMITTED (New)</option>
              <option value="UNDER_REVIEW" className="bg-[#14151b]">UNDER_REVIEW</option>
              <option value="SHORTLISTED" className="bg-[#14151b]">SHORTLISTED</option>
              <option value="INTERVIEW_SCHEDULED" className="bg-[#14151b]">INTERVIEW_SCHEDULED</option>
              <option value="SELECTED" className="bg-[#14151b]">SELECTED</option>
              <option value="REJECTED" className="bg-[#14151b]">REJECTED</option>
              <option value="WITHDRAWN" className="bg-[#14151b]">WITHDRAWN</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference, candidate, email..."
              className="w-56 sm:w-72 bg-[#181920] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ef233c]"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-[#ef233c] hover:bg-[#d90429] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Applications Table */}
      <div className="bg-[#14151b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181920] text-gray-400 font-bold uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Ref & Candidate</th>
                <th className="py-3 px-4">Applied Position</th>
                <th className="py-3 px-4">Experience & Specialization</th>
                <th className="py-3 px-4">Submitted Date</th>
                <th className="py-3 px-4">Vacancy Deadline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-gray-400">
                    <div className="w-7 h-7 border-3 border-[#ef233c] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading candidate applications...</span>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-gray-400">
                    <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="font-bold text-white text-sm">No applications found</p>
                    <p className="text-xs text-gray-500 mt-1">Candidates who apply via the public careers portal will appear here.</p>
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Reference & Name */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] text-[#ef233c] font-black block">
                        {app.referenceNumber || app.applicationReference}
                      </span>
                      <span className="font-bold text-white text-sm block mt-0.5">{app.fullName}</span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gray-500" />
                        {app.email}
                      </span>
                      {app.phone && (
                        <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1 mt-0.5">
                          <Phone className="w-2.5 h-2.5" />
                          {app.phone}
                        </span>
                      )}
                    </td>

                    {/* Applied Position & Vacancy */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block">{app.desiredPosition}</span>
                      <span className="text-[11px] text-purple-400 block truncate max-w-xs" title={app.vacancyTitle}>
                        {app.vacancyTitle || 'Open Hiring Call'}
                      </span>
                      {app.convertedToStaff && (
                        <span className="mt-1 inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                          <ShieldCheck className="w-2.5 h-2.5" /> Converted Staff
                        </span>
                      )}
                    </td>

                    {/* Experience & Specialization */}
                    <td className="py-3.5 px-4">
                      <span className="text-white font-semibold block">{app.experienceYears ?? app.yearsOfExperience ?? 0} yrs exp</span>
                      <span className="text-[11px] text-cyan-300 font-medium block">{app.specialization}</span>
                      {app.currentLocation && (
                        <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5" /> {app.currentLocation}
                        </span>
                      )}
                    </td>

                    {/* Submission Date */}
                    <td className="py-3.5 px-4 text-gray-300">
                      <span className="block text-[11px] font-medium text-gray-200">
                        {app.createdAt ? app.createdAt.split('T')[0] : (app.submittedAt ? app.submittedAt.split('T')[0] : '—')}
                      </span>
                      <span className="block text-[10px] text-gray-500">
                        {app.createdAt ? new Date(app.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </td>

                    {/* Vacancy Deadline */}
                    <td className="py-3.5 px-4 text-gray-400">
                      <span className="text-[11px] font-mono text-yellow-400 block font-semibold">
                        {app.vacancyDeadline || 'None'}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1 ${
                        app.status === 'SUBMITTED'
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : app.status === 'UNDER_REVIEW'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : app.status === 'SHORTLISTED'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : app.status === 'INTERVIEW_SCHEDULED'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : app.status === 'SELECTED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : app.status === 'REJECTED'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-white/10 text-gray-400 border border-white/10'
                      }`}>
                        {app.status?.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(app)}
                        className="px-3 py-1.5 bg-[#ef233c]/20 hover:bg-[#ef233c] text-white border border-[#ef233c]/30 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect & Act</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-3.5 bg-[#181920] border-t border-white/5 flex items-center justify-between text-xs">
          <span className="text-gray-400">
            Page <strong className="text-white">{page + 1}</strong> of <strong className="text-white">{totalPages}</strong> ({totalElements} applications)
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-30 disabled:hover:bg-white/5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-30 disabled:hover:bg-white/5 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* FULL APPLICATION DETAIL & WORKFLOW MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#14151b] border border-white/10 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 bg-[#181920] border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#ef233c] font-black">
                    {selectedApp.referenceNumber || selectedApp.applicationReference}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    selectedApp.status === 'SELECTED'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : selectedApp.status === 'REJECTED'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    {selectedApp.status?.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white mt-0.5">{selectedApp.fullName}</h3>
                <span className="text-xs text-gray-400">
                  Applied for: <strong className="text-gray-200">{selectedApp.desiredPosition}</strong> ({selectedApp.vacancyTitle})
                </span>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              
              {/* Primary Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Email Address</span>
                  <span className="text-white font-mono mt-0.5 block truncate">{selectedApp.email}</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Phone Number</span>
                  <span className="text-emerald-400 font-mono mt-0.5 block">{selectedApp.phone || 'Not provided'}</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Experience</span>
                  <span className="text-white font-bold mt-0.5 block">{selectedApp.experienceYears ?? selectedApp.yearsOfExperience ?? 0} Years</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Specialization</span>
                  <span className="text-[#ef233c] font-bold mt-0.5 block truncate">{selectedApp.specialization}</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Current Location</span>
                  <span className="text-gray-200 mt-0.5 block">{selectedApp.currentLocation || 'Not specified'}</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Expected Joining</span>
                  <span className="text-cyan-400 font-bold mt-0.5 block">{selectedApp.availabilityDate || selectedApp.expectedJoiningDate || 'Immediate'}</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Submitted At</span>
                  <span className="text-gray-200 mt-0.5 block font-mono">
                    {selectedApp.createdAt ? selectedApp.createdAt.replace('T', ' ').substring(0, 16) : (selectedApp.submittedAt ? selectedApp.submittedAt.replace('T', ' ').substring(0, 16) : '—')}
                  </span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Resume Document</span>
                  {selectedApp.resumeUrl ? (
                    <a
                      href={`http://localhost:8080/api/admin/applications/${selectedApp.id}/resume`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#ef233c] hover:underline font-bold mt-0.5 inline-flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download Resume</span>
                    </a>
                  ) : (
                    <span className="text-gray-500 italic mt-0.5 block">No file uploaded</span>
                  )}
                </div>
              </div>

              {/* Qualifications & Fitness Certifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#181920] p-4 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Educational Qualifications</span>
                  <p className="text-gray-200 leading-relaxed">{selectedApp.educationalQualifications || 'None provided'}</p>
                </div>
                <div className="bg-[#181920] p-4 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Fitness Certifications & Credentials</span>
                  <p className="text-white font-semibold leading-relaxed">{selectedApp.fitnessCertifications || 'None provided'}</p>
                </div>
              </div>

              {/* Work Experience & Bio Summary */}
              {selectedApp.previousExperience && (
                <div className="bg-[#181920] p-4 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Previous Employment & Roles</span>
                  <p className="text-gray-300 leading-relaxed">{selectedApp.previousExperience}</p>
                </div>
              )}

              {selectedApp.professionalSummary && (
                <div className="bg-[#181920] p-4 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Professional Summary & Philosophy</span>
                  <p className="text-gray-300 leading-relaxed">{selectedApp.professionalSummary}</p>
                </div>
              )}

              {/* Interview Schedule (if recorded) */}
              {selectedApp.interviewDate && (
                <div className="bg-purple-950/20 border border-purple-500/30 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-purple-300 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-purple-400" /> Interview Scheduled
                    </span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-mono font-bold">
                      {selectedApp.interviewDate} at {selectedApp.interviewTime}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-gray-400 block">Meeting Venue / Link:</span>
                      <span className="text-white font-mono">{selectedApp.interviewLocation || 'FitFlow Gym HQ'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Interview Notes / Instructions:</span>
                      <span className="text-gray-300">{selectedApp.interviewNotes || 'Standard interview protocol.'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Audit Trail / History */}
              <div className="bg-[#181920] p-4 rounded-2xl border border-white/5 space-y-3">
                <span className="text-xs font-black uppercase text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-400" /> Status Audit Trail & History
                </span>
                {appHistory.length === 0 ? (
                  <p className="text-gray-500 text-xs italic">No status transitions recorded yet.</p>
                ) : (
                  <div className="space-y-2">
                    {appHistory.map((h, idx) => (
                      <div key={idx} className="p-2.5 bg-[#121319] rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-400">{h.oldStatus || 'NONE'}</span>
                          <ArrowRight className="w-3 h-3 text-[#ef233c]" />
                          <span className="font-bold text-white uppercase">{h.newStatus}</span>
                          {h.changedBy && (
                            <span className="text-[10px] text-gray-500 font-mono">by {h.changedBy}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {h.reason && <span className="text-gray-400 italic">"{h.reason}"</span>}
                          <span className="text-[10px] text-gray-500 font-mono">
                            {h.createdAt ? h.createdAt.replace('T', ' ').substring(0, 16) : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Internal Admin Notes */}
              <div className="bg-[#181920] p-4 rounded-2xl border border-white/5 space-y-3">
                <span className="text-xs font-black uppercase text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-400" /> Internal Hiring Notes (Confidential)
                </span>
                {selectedApp.internalNotes ? (
                  <div className="p-3 bg-[#121319] rounded-xl border border-white/5 font-mono text-[11px] text-gray-300 whitespace-pre-wrap">
                    {selectedApp.internalNotes}
                  </div>
                ) : (
                  <p className="text-gray-500 text-xs italic">No internal comments logged for this candidate.</p>
                )}

                {/* Append note form */}
                <form onSubmit={handleAddNoteSubmit} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add an internal reviewer comment..."
                    className="flex-1 bg-[#121319] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ef233c]"
                  />
                  <button
                    type="submit"
                    disabled={!newNote.trim() || actionLoading}
                    className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold disabled:opacity-30 cursor-pointer"
                  >
                    Add Note
                  </button>
                </form>
              </div>

            </div>

            {/* Modal Actions Footer: Structured Workflow (Part 8) */}
            <div className="p-4 bg-[#181920] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* 1. Mark Under Review */}
                {selectedApp.status === 'SUBMITTED' && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleStatusTransition('UNDER_REVIEW', 'Application opened for review by Admin')}
                    className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Mark Under Review
                  </button>
                )}

                {/* 2. Shortlist */}
                {['SUBMITTED', 'UNDER_REVIEW'].includes(selectedApp.status) && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleStatusTransition('SHORTLISTED', 'Candidate qualifications matched criteria')}
                    className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Shortlist Candidate
                  </button>
                )}

                {/* 3. Schedule Interview */}
                {['UNDER_REVIEW', 'SHORTLISTED'].includes(selectedApp.status) && (
                  <button
                    disabled={actionLoading}
                    onClick={() => setInterviewModalOpen(true)}
                    className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule Interview</span>
                  </button>
                )}

                {/* 4. Select Candidate */}
                {['SHORTLISTED', 'INTERVIEW_SCHEDULED', 'UNDER_REVIEW'].includes(selectedApp.status) && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleStatusTransition('SELECTED', 'Selected following review/interview')}
                    className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Select Candidate</span>
                  </button>
                )}

                {/* 5. Reject Candidate */}
                {!['SELECTED', 'REJECTED', 'WITHDRAWN'].includes(selectedApp.status) && (
                  <button
                    disabled={actionLoading}
                    onClick={() => {
                      const reason = prompt('Optional reason for rejection (will be recorded in audit log):', 'Application does not meet current hiring needs');
                      if (reason !== null) {
                        handleStatusTransition('REJECTED', reason);
                      }
                    }}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}

                {/* 6. Mark Withdrawn */}
                {!['SELECTED', 'REJECTED', 'WITHDRAWN'].includes(selectedApp.status) && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleStatusTransition('WITHDRAWN', 'Candidate withdrew application')}
                    className="px-2.5 py-1.5 text-gray-400 hover:text-white rounded-xl text-xs font-medium cursor-pointer"
                  >
                    Withdraw
                  </button>
                )}

                {/* 7. CONVERT TO OFFICIAL STAFF BUTTON (Part 8 requirement) */}
                {selectedApp.status === 'SELECTED' && !selectedApp.convertedToStaff && (
                  <button
                    disabled={actionLoading}
                    onClick={handleOpenConvertModal}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-950/50 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Convert to Official Staff</span>
                  </button>
                )}

                {selectedApp.convertedToStaff && (
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Staff Record Created (ID #{selectedApp.convertedStaffId})
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl text-xs cursor-pointer ml-auto"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      {interviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14151b] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-[#181920] border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>Schedule Interview: {selectedApp?.fullName}</span>
              </h3>
              <button
                onClick={() => setInterviewModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleInterviewSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Interview Date *</label>
                  <input
                    type="date"
                    required
                    value={interviewData.date}
                    onChange={(e) => setInterviewData({ ...interviewData, date: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Interview Time *</label>
                  <input
                    type="text"
                    required
                    value={interviewData.time}
                    onChange={(e) => setInterviewData({ ...interviewData, time: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    placeholder="e.g. 10:00 AM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Location or Meeting Link *</label>
                <input
                  type="text"
                  required
                  value={interviewData.location}
                  onChange={(e) => setInterviewData({ ...interviewData, location: e.target.value })}
                  className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  placeholder="e.g. FitFlow Downtown HQ Studio 1 OR https://meet.google.com/..."
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Interview Notes / Instructions</label>
                <textarea
                  rows="3"
                  value={interviewData.notes}
                  onChange={(e) => setInterviewData({ ...interviewData, notes: e.target.value })}
                  className="w-full bg-[#181920] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Notes for applicant regarding practical demo, attire, certifications..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInterviewModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg cursor-pointer flex items-center gap-2"
                >
                  {actionLoading ? 'Scheduling...' : 'Save & Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONVERT CANDIDATE TO STAFF MODAL */}
      {convertModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14151b] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-[#181920] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">
                  Convert to Staff: {selectedApp?.fullName}
                </h3>
              </div>
              <button
                onClick={() => setConvertModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConvertSubmit} className="p-6 space-y-4 text-xs">
              <p className="text-gray-400 leading-relaxed">
                Confirm employment terms before onboarding <strong>{selectedApp?.fullName}</strong> into the active Gym Staff directory. This will decrement the remaining open position count for this vacancy.
              </p>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Official Designation *</label>
                <input
                  type="text"
                  required
                  value={convertData.designation}
                  onChange={(e) => setConvertData({ ...convertData, designation: e.target.value })}
                  className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-400 font-bold mb-1">Agreed Monthly Salary ($ USD) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={convertData.monthlySalary}
                    onChange={(e) => setConvertData({ ...convertData, monthlySalary: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#181920] border border-emerald-500/30 rounded-xl px-3 py-2 text-emerald-300 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Employment Type *</label>
                  <select
                    value={convertData.employmentType}
                    onChange={(e) => setConvertData({ ...convertData, employmentType: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="FULL_TIME">FULL TIME</option>
                    <option value="PART_TIME">PART TIME</option>
                    <option value="CONTRACT">CONTRACT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Official Joining Date *</label>
                  <input
                    type="date"
                    required
                    value={convertData.joiningDate}
                    onChange={(e) => setConvertData({ ...convertData, joiningDate: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Initial Shift Assignment</label>
                  <input
                    type="text"
                    value={convertData.assignedShift}
                    onChange={(e) => setConvertData({ ...convertData, assignedShift: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Morning (06:00 - 14:00)"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConvertModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg cursor-pointer flex items-center gap-2"
                >
                  {actionLoading ? 'Creating Staff...' : 'Confirm & Onboard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
