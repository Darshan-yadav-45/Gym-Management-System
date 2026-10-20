import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Clock, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  X, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  Send,
  Sparkles
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminRecruitmentView({ onNotify, onNavigateApplications }) {
  const [vacancies, setVacancies] = useState([]);
  const [summary, setSummary] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);

  // Modals
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const initialForm = {
    title: '',
    department: 'Personal Training',
    specialization: 'Strength & Conditioning',
    totalVacancies: 2,
    jobDescription: '',
    requiredQualifications: 'NASM, ACE, CSCS or equivalent national fitness certification',
    minimumExperienceYears: 2,
    preferredExperienceYears: 4,
    employmentType: 'FULL_TIME',
    salaryRange: '$3,500 - $5,000 / month',
    location: 'Main FitFlow Flagship Gym, Downtown',
    openingDate: new Date().toISOString().split('T')[0],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    expectedJoiningDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    workingDaysAndShift: 'Monday - Friday (06:00 - 14:00)',
    status: 'OPEN'
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadVacancies(page, search, statusFilter);
    loadSummary();
  }, [page, statusFilter]);

  const loadSummary = async () => {
    try {
      const data = await adminService.getRecruitmentSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load recruitment summary:', err);
    }
  };

  const loadVacancies = async (p = 0, q = '', s = '') => {
    setLoading(true);
    try {
      const data = await adminService.getVacancies(q, s, p, 15);
      setVacancies(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load vacancies:', err);
      onNotify?.('Failed to load vacancies.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadVacancies(0, search, statusFilter);
  };

  const openCreateModal = () => {
    setFormData(initialForm);
    setSelectedVacancy(null);
    setModalMode('create');
  };

  const openEditModal = (v) => {
    setSelectedVacancy(v);
    setFormData({
      title: v.title || '',
      department: v.department || '',
      specialization: v.specialization || '',
      totalVacancies: v.totalVacancies || 1,
      jobDescription: v.jobDescription || '',
      requiredQualifications: v.requiredQualifications || '',
      minimumExperienceYears: v.minimumExperienceYears || 0,
      preferredExperienceYears: v.preferredExperienceYears || 0,
      employmentType: v.employmentType || 'FULL_TIME',
      salaryRange: v.salaryRange || '',
      location: v.location || '',
      openingDate: v.openingDate || '',
      applicationDeadline: v.applicationDeadline || '',
      expectedJoiningDate: v.expectedJoiningDate || '',
      workingDaysAndShift: v.workingDaysAndShift || '',
      status: v.status || 'OPEN'
    });
    setModalMode('edit');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modalMode === 'create') {
        await adminService.createVacancy(formData);
        onNotify?.('Job vacancy created and published successfully.', 'success');
      } else {
        await adminService.updateVacancy(selectedVacancy.id, formData);
        onNotify?.('Job vacancy updated successfully.', 'success');
      }
      setModalMode(null);
      loadVacancies(page, search, statusFilter);
      loadSummary();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save job vacancy.';
      onNotify?.(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (v, newStatus) => {
    try {
      await adminService.updateVacancyStatus(v.id, newStatus);
      onNotify?.(`Vacancy status set to ${newStatus}.`, 'success');
      loadVacancies(page, search, statusFilter);
      loadSummary();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update vacancy status.';
      onNotify?.(msg, 'error');
    }
  };

  const handleDeleteVacancy = async (v) => {
    if (!confirm(`Are you sure you want to delete "${v.title}"? Note: Vacancies with submitted applications should instead be set to CLOSED or CANCELLED to preserve applicant history.`)) return;
    try {
      await adminService.deleteVacancy(v.id);
      onNotify?.('Vacancy record removed.', 'success');
      loadVacancies(page, search, statusFilter);
      loadSummary();
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not delete vacancy. Try closing it instead to preserve applicant history.';
      onNotify?.(msg, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-purple-400" />
            <span>Recruitment & Vacancies</span>
            <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-bold">
              {totalElements} Postings
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Publish trainer job opportunities, configure application deadlines, and monitor hiring quotas
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="self-start sm:self-auto px-4 py-2 bg-gradient-to-r from-[#ef233c] to-[#b81428] hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-red-950/50 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Vacancy</span>
        </button>
      </div>

      {/* Recruitment Dashboard Summary Cards (Part 5 Requirements) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {/* 1. Total Published Vacancies */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-3.5 shadow-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Published</span>
          <p className="text-2xl font-black text-white">{summary?.totalPublished ?? '—'}</p>
          <span className="text-[10px] text-gray-400">Total Created</span>
        </div>

        {/* 2. Scheduled Vacancies */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-3.5 shadow-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-yellow-400 tracking-wider">Scheduled</span>
          <p className="text-2xl font-black text-yellow-400">{summary?.scheduledVacancies ?? '—'}</p>
          <span className="text-[10px] text-yellow-400/80">Future Opening</span>
        </div>

        {/* 3. Currently Open */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-3.5 shadow-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Currently Open</span>
          <p className="text-2xl font-black text-emerald-400">{summary?.openVacancies ?? '—'}</p>
          <span className="text-[10px] text-emerald-400/80">Accepting Applicants</span>
        </div>

        {/* 4. Closed Vacancies */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-3.5 shadow-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Closed</span>
          <p className="text-2xl font-black text-gray-400">{summary?.closedVacancies ?? '—'}</p>
          <span className="text-[10px] text-gray-500">Filled or Expired</span>
        </div>

        {/* 5. Total Positions Available */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-3.5 shadow-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Open Positions</span>
          <p className="text-2xl font-black text-cyan-400">{summary?.totalPositionsAvailable ?? '—'}</p>
          <span className="text-[10px] text-cyan-300 font-semibold">Vacancies Unfilled</span>
        </div>

        {/* 6. Total Applications Received */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-3.5 shadow-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#ef233c] tracking-wider">Total Received</span>
          <p className="text-2xl font-black text-[#ef233c]">{summary?.totalApplicationsReceived ?? '—'}</p>
          <span className="text-[10px] text-red-400">Candidate Pipeline</span>
        </div>

        {/* 7. Approaching Deadline */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-3.5 shadow-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Due Soon (&lt;7d)</span>
          <p className="text-2xl font-black text-orange-400">{summary?.approachingDeadline ?? '—'}</p>
          <span className="text-[10px] text-orange-300">Closing Soon</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#14151b] border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="bg-[#181920] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">OPEN (Accepting Applications)</option>
            <option value="SCHEDULED">SCHEDULED (Upcoming)</option>
            <option value="DRAFT">DRAFT</option>
            <option value="CLOSED">CLOSED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, category, specialization..."
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

      {/* Vacancies List Table */}
      <div className="bg-[#14151b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181920] text-gray-400 font-bold uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Opportunity</th>
                <th className="py-3 px-4">Positions & Fill Rate</th>
                <th className="py-3 px-4">Dates & Deadlines</th>
                <th className="py-3 px-4">Type & Compensation</th>
                <th className="py-3 px-4">Applications</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-gray-400">
                    <div className="w-7 h-7 border-3 border-[#ef233c] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading hiring vacancies...</span>
                  </td>
                </tr>
              ) : vacancies.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-gray-400">
                    <Briefcase className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="font-bold text-white text-sm">No job vacancies found</p>
                    <p className="text-xs text-gray-500 mt-1">Click "Publish New Vacancy" to post your first trainer hiring advertisement.</p>
                  </td>
                </tr>
              ) : (
                vacancies.map((v) => (
                  <tr key={v.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Title, Department, Specialization */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white text-sm block">{v.title}</span>
                      <span className="text-[11px] text-[#ef233c] font-semibold">{v.specialization}</span>
                      <span className="text-[10px] text-gray-500 block">{v.department} • {v.location}</span>
                    </td>

                    {/* Vacancies / Fill rate */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-white font-bold">{v.filledCount || 0}</span>
                        <span className="text-gray-500">/</span>
                        <span className="text-gray-300">{v.totalVacancies} filled</span>
                      </div>
                      <span className="text-[10px] font-bold text-cyan-400 block mt-0.5">
                        {v.remainingPositions} open position{v.remainingPositions === 1 ? '' : 's'}
                      </span>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4 text-gray-300">
                      <span className="block text-[11px] text-gray-400">Open: {v.openingDate || 'Immediate'}</span>
                      <span className="block text-[11px] font-bold text-yellow-400">Deadline: {v.applicationDeadline || 'No limit'}</span>
                      {v.expectedJoiningDate && (
                        <span className="block text-[10px] text-gray-500">Join: {v.expectedJoiningDate}</span>
                      )}
                    </td>

                    {/* Employment & Salary */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white block uppercase text-[10px] font-mono">
                        {v.employmentType?.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-emerald-400 font-bold block">
                        {v.salaryRange || 'Disclosed upon interview'}
                      </span>
                      <span className="text-[10px] text-gray-400 block truncate max-w-xs">{v.workingDaysAndShift}</span>
                    </td>

                    {/* Applications Count Button */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onNavigateApplications?.(v.id)}
                        className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Users className="w-3 h-3" />
                        <span>{v.applicationsCount || 0} Apps</span>
                      </button>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1 ${
                        v.status === 'OPEN'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : v.status === 'SCHEDULED'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : v.status === 'DRAFT'
                          ? 'bg-white/10 text-gray-400 border border-white/10'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {v.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(v)}
                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 cursor-pointer"
                          title="Edit Vacancy"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {v.status !== 'OPEN' ? (
                          <button
                            onClick={() => handleStatusChange(v, 'OPEN')}
                            className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold cursor-pointer"
                            title="Publish / Open for applicants"
                          >
                            Open
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(v, 'CLOSED')}
                            className="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] font-bold cursor-pointer"
                            title="Close Vacancy"
                          >
                            Close
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteVacancy(v)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 cursor-pointer"
                          title="Delete Vacancy"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
            Page <strong className="text-white">{page + 1}</strong> of <strong className="text-white">{totalPages}</strong> ({totalElements} vacancies)
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

      {/* CREATE / EDIT VACANCY MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#14151b] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-[#181920] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-black text-white">
                  {modalMode === 'create' ? 'Publish Hiring Opportunity' : `Edit Vacancy: ${selectedVacancy?.title}`}
                </h3>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-gray-400 font-bold mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                    placeholder="e.g. Senior Personal Trainer"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Department / Category *</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                    placeholder="e.g. Personal Training, Group Classes"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Specialization *</label>
                  <input
                    type="text"
                    required
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                    placeholder="e.g. Strength Training, Weight Loss, Yoga"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Number of Vacancies (Quota) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.totalVacancies}
                    onChange={(e) => setFormData({ ...formData, totalVacancies: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Employment Type *</label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                  >
                    <option value="FULL_TIME">FULL TIME</option>
                    <option value="PART_TIME">PART TIME</option>
                    <option value="CONTRACT">CONTRACT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Monthly Salary Range (Public/Published)</label>
                  <input
                    type="text"
                    value={formData.salaryRange}
                    onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                    placeholder="e.g. $3,500 - $5,000 / month"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Gym Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                    placeholder="e.g. FitFlow Flagship, Downtown"
                  />
                </div>
              </div>

              {/* Dates & Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Opening Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.openingDate}
                    onChange={(e) => setFormData({ ...formData, openingDate: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                  />
                </div>

                <div>
                  <label className="block text-yellow-400 font-bold mb-1">Application Deadline *</label>
                  <input
                    type="date"
                    required
                    value={formData.applicationDeadline}
                    onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                    className="w-full bg-[#181920] border border-yellow-500/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Expected Joining Date</label>
                  <input
                    type="date"
                    value={formData.expectedJoiningDate}
                    onChange={(e) => setFormData({ ...formData, expectedJoiningDate: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Min Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.minimumExperienceYears}
                    onChange={(e) => setFormData({ ...formData, minimumExperienceYears: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Preferred Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.preferredExperienceYears}
                    onChange={(e) => setFormData({ ...formData, preferredExperienceYears: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                  >
                    <option value="OPEN">OPEN (Published now)</option>
                    <option value="SCHEDULED">SCHEDULED (Starts on opening date)</option>
                    <option value="DRAFT">DRAFT (Hidden)</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Working Days & Shift</label>
                <input
                  type="text"
                  value={formData.workingDaysAndShift}
                  onChange={(e) => setFormData({ ...formData, workingDaysAndShift: e.target.value })}
                  className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                  placeholder="e.g. Monday - Friday, Morning Shift (06:00 - 14:00)"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Required Qualifications *</label>
                <textarea
                  rows="2"
                  required
                  value={formData.requiredQualifications}
                  onChange={(e) => setFormData({ ...formData, requiredQualifications: e.target.value })}
                  className="w-full bg-[#181920] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#ef233c]"
                  placeholder="e.g. Certified Personal Trainer (NASM, ACE, ISSA, CSCS) or B.S. in Exercise Science."
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Job Description & Responsibilities *</label>
                <textarea
                  rows="4"
                  required
                  value={formData.jobDescription}
                  onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                  className="w-full bg-[#181920] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#ef233c]"
                  placeholder="Outline client goals, personal training sessions, equipment guidance, and attendance requirements..."
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-gradient-to-r from-[#ef233c] to-[#b81428] hover:opacity-90 text-white font-bold rounded-xl shadow-lg cursor-pointer flex items-center gap-2"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{modalMode === 'create' ? 'Publish Opportunity' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
