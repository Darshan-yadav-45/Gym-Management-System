import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  DollarSign, 
  Award, 
  Briefcase, 
  X, 
  RefreshCw,
  Phone,
  Mail,
  UserCheck,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminStaffView({ onNotify, onNavigateSchedules }) {
  const [staffList, setStaffList] = useState([]);
  const [summary, setSummary] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);

  // Modals
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [viewStaff, setViewStaff] = useState(null);
  const [statusModalStaff, setStatusModalStaff] = useState(null);
  const [newStatus, setNewStatus] = useState('ACTIVE');
  const [resignationDate, setResignationDate] = useState('');
  const [saving, setSaving] = useState(false);

  // Form State
  const initialForm = {
    fullName: '',
    email: '',
    phone: '',
    designation: 'Senior Fitness Trainer',
    specialization: 'Strength & Conditioning',
    yearsOfExperience: 3,
    qualifications: '',
    monthlySalary: 3500,
    employmentType: 'FULL_TIME',
    joiningDate: new Date().toISOString().split('T')[0],
    assignedShift: 'Morning (06:00 - 14:00)',
    status: 'ACTIVE',
    photoUrl: '',
    bio: ''
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadStaff(page, search, statusFilter);
    loadSummary();
  }, [page, statusFilter]);

  const loadSummary = async () => {
    try {
      const data = await adminService.getStaffSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load staff metrics:', err);
    }
  };

  const loadStaff = async (p = 0, q = '', s = '') => {
    setLoading(true);
    try {
      const data = await adminService.getStaff(q, s, p, 15);
      setStaffList(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load staff directory:', err);
      onNotify?.('Failed to load staff directory.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadStaff(0, search, statusFilter);
  };

  const openCreateModal = () => {
    setFormData(initialForm);
    setSelectedStaff(null);
    setModalMode('create');
  };

  const openEditModal = (staff) => {
    setSelectedStaff(staff);
    setFormData({
      fullName: staff.fullName || '',
      email: staff.email || '',
      phone: staff.phone || '',
      designation: staff.designation || '',
      specialization: staff.specialization || '',
      yearsOfExperience: staff.yearsOfExperience || 0,
      qualifications: staff.qualifications || '',
      monthlySalary: staff.monthlySalary || 0,
      employmentType: staff.employmentType || 'FULL_TIME',
      joiningDate: staff.joiningDate || '',
      assignedShift: staff.assignedShift || '',
      status: staff.status || 'ACTIVE',
      photoUrl: staff.photoUrl || '',
      bio: staff.bio || ''
    });
    setModalMode('edit');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modalMode === 'create') {
        await adminService.createStaff(formData);
        onNotify?.('New trainer/staff member added successfully.', 'success');
      } else {
        await adminService.updateStaff(selectedStaff.id, formData);
        onNotify?.('Staff member details updated successfully.', 'success');
      }
      setModalMode(null);
      loadStaff(page, search, statusFilter);
      loadSummary();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save staff record. Check required fields or unique email.';
      onNotify?.(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!statusModalStaff) return;
    setSaving(true);
    try {
      await adminService.updateStaffStatus(
        statusModalStaff.id, 
        newStatus, 
        newStatus === 'RESIGNED' ? resignationDate : null
      );
      onNotify?.(`Staff status updated to ${newStatus}.`, 'success');
      setStatusModalStaff(null);
      loadStaff(page, search, statusFilter);
      loadSummary();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update employment status.';
      onNotify?.(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStaff = async (staff) => {
    if (!confirm(`Are you sure you want to remove ${staff.fullName} from staff? If the staff has assigned schedules, they should be deactivated instead.`)) return;
    try {
      await adminService.deleteStaff(staff.id);
      onNotify?.('Staff record removed.', 'success');
      loadStaff(page, search, statusFilter);
      loadSummary();
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not delete staff. Consider marking as Inactive instead.';
      onNotify?.(msg, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-[#ef233c]" />
            <span>Trainers & Training Staff</span>
            <span className="text-xs bg-red-500/20 text-[#ef233c] border border-red-500/30 px-2.5 py-0.5 rounded-full font-bold">
              {totalElements} Staff Members
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage fitness trainers, physiotherapists, gym floor specialists, assigned shifts, and confidential payroll
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="self-start sm:self-auto px-4 py-2 bg-[#ef233c] hover:bg-[#d90429] text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-red-950/50 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Trainer / Staff</span>
        </button>
      </div>

      {/* Summary Cards Grid — Exactly as required in Part 4 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* 1. Total Trainers */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-4 shadow-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Trainers</span>
          <p className="text-2xl sm:text-3xl font-black text-white">{summary?.totalTrainers ?? '—'}</p>
          <span className="text-[11px] text-gray-400 font-semibold">Specialized Coaches</span>
        </div>

        {/* 2. Active Trainers */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-4 shadow-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Active Trainers</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400">{summary?.activeTrainers ?? '—'}</p>
          <span className="text-[11px] text-emerald-400/80 font-semibold">Currently on duty</span>
        </div>

        {/* 3. Inactive Trainers */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-4 shadow-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Inactive Trainers</span>
          <p className="text-2xl sm:text-3xl font-black text-gray-400">{summary?.inactiveTrainers ?? '—'}</p>
          <span className="text-[11px] text-gray-500 font-semibold">Leave or resigned</span>
        </div>

        {/* 4. Total Training Staff */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-4 shadow-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Training Staff</span>
          <p className="text-2xl sm:text-3xl font-black text-purple-400">{summary?.totalTrainingStaff ?? '—'}</p>
          <span className="text-[11px] text-gray-400 font-semibold">Floor & Physio</span>
        </div>

        {/* 5. Trainers Available */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-4 shadow-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Currently Available</span>
          <p className="text-2xl sm:text-3xl font-black text-cyan-400">{summary?.availableNow ?? '—'}</p>
          <span className="text-[11px] text-cyan-300 font-semibold">Taking clients</span>
        </div>

        {/* 6. Hired This Month */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-4 shadow-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#ef233c] tracking-wider">Hired This Month</span>
          <p className="text-2xl sm:text-3xl font-black text-[#ef233c]">+{summary?.hiredThisMonth ?? '0'}</p>
          <span className="text-[11px] text-red-400 font-semibold">New team members</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#14151b] border border-white/5 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
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
              <option value="ACTIVE" className="bg-[#14151b]">ACTIVE</option>
              <option value="INACTIVE" className="bg-[#14151b]">INACTIVE</option>
              <option value="ON_LEAVE" className="bg-[#14151b]">ON_LEAVE</option>
              <option value="RESIGNED" className="bg-[#14151b]">RESIGNED</option>
              <option value="TERMINATED" className="bg-[#14151b]">TERMINATED</option>
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
              placeholder="Search name, designation, specialization..."
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

      {/* Staff Directory Table */}
      <div className="bg-[#14151b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181920] text-gray-400 font-bold uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Designation & Specialization</th>
                <th className="py-3 px-4">Experience & Type</th>
                <th className="py-3 px-4">Assigned Shift</th>
                <th className="py-3 px-4">Monthly Salary</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-gray-400">
                    <div className="w-7 h-7 border-3 border-[#ef233c] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading staff directory...</span>
                  </td>
                </tr>
              ) : staffList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-gray-400">
                    <Dumbbell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="font-bold text-white text-sm">No staff records found</p>
                    <p className="text-xs text-gray-500 mt-1">Add your first trainer using the "Add Trainer / Staff" button above.</p>
                  </td>
                </tr>
              ) : (
                staffList.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Member Name / Photo / Staff ID */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {s.photoUrl ? (
                          <img
                            src={s.photoUrl}
                            alt={s.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-white/10 flex-shrink-0"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ef233c]/30 to-purple-600/30 border border-white/10 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {s.fullName?.charAt(0) || 'T'}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-sm block">{s.fullName}</span>
                            <span className="text-[10px] bg-white/5 font-mono text-gray-400 px-1.5 py-0.2 rounded border border-white/5">
                              {s.staffCode}
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-gray-500" />
                            {s.email}
                          </span>
                          {s.phone && (
                            <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1 mt-0.5">
                              <Phone className="w-2.5 h-2.5 text-gray-500" />
                              {s.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Designation & Specialization */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-white block">{s.designation}</span>
                      <span className="text-[11px] text-[#ef233c] font-medium block">{s.specialization}</span>
                      {s.qualifications && (
                        <span className="text-[10px] text-gray-500 block truncate max-w-xs" title={s.qualifications}>
                          {s.qualifications}
                        </span>
                      )}
                    </td>

                    {/* Experience & Employment Type */}
                    <td className="py-3 px-4">
                      <span className="text-white font-semibold block">{s.yearsOfExperience} yrs experience</span>
                      <span className="text-[10px] font-mono text-gray-400 uppercase">
                        {s.employmentType?.replace('_', ' ')}
                      </span>
                      {s.joiningDate && (
                        <span className="text-[10px] text-gray-500 block">Joined: {s.joiningDate}</span>
                      )}
                    </td>

                    {/* Assigned Shift */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                        <span className="text-gray-200 font-medium">
                          {s.assignedShift || 'Standard (06:00 - 14:00)'}
                        </span>
                      </div>
                    </td>

                    {/* Confidential Monthly Salary */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-emerald-400 font-mono text-sm">
                          ${Number(s.monthlySalary || 0).toLocaleString()}
                        </span>
                        <span className="text-[9px] uppercase font-bold text-gray-500 bg-white/5 px-1 py-0.5 rounded">
                          /mo
                        </span>
                      </div>
                      <span className="text-[9px] text-emerald-500/70 font-semibold flex items-center gap-0.5 mt-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" /> Confidential Admin Access
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1 ${
                        s.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : s.status === 'ON_LEAVE'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {s.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewStaff(s)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
                          title="View Full Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-colors cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setStatusModalStaff(s);
                            setNewStatus(s.status || 'ACTIVE');
                            setResignationDate(s.resignationDate || '');
                          }}
                          className="p-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 transition-colors cursor-pointer"
                          title="Update Status / Resignation"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteStaff(s)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                          title="Delete Staff"
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
            Page <strong className="text-white">{page + 1}</strong> of <strong className="text-white">{totalPages}</strong> ({totalElements} staff)
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

      {/* CREATE / EDIT STAFF MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#14151b] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-[#181920] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-[#ef233c]" />
                <h3 className="text-base font-black text-white">
                  {modalMode === 'create' ? 'Add New Trainer / Staff Member' : `Edit Staff: ${selectedStaff?.fullName}`}
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
              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                    placeholder="e.g. Marcus Vance"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                    placeholder="trainer@fitflowgym.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                    placeholder="+1 (555) 345-6789"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Designation *</label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                    placeholder="e.g. Senior Strength Coach"
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
                    placeholder="e.g. Weight Loss, Strength Training, Yoga"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Years of Experience *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    required
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                  />
                </div>
              </div>

              {/* Employment, Confidential Salary & Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                  <label className="block text-emerald-400 font-bold mb-1">Monthly Salary ($ USD) *</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    required
                    value={formData.monthlySalary}
                    onChange={(e) => setFormData({ ...formData, monthlySalary: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#181920] border border-emerald-500/30 rounded-xl px-3 py-2 text-emerald-300 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Joining Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Assigned Shift / Working Hours</label>
                  <input
                    type="text"
                    value={formData.assignedShift}
                    onChange={(e) => setFormData({ ...formData, assignedShift: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                    placeholder="e.g. Morning (06:00 - 14:00)"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="ON_LEAVE">ON LEAVE</option>
                    <option value="RESIGNED">RESIGNED</option>
                    <option value="TERMINATED">TERMINATED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Qualifications & Certifications</label>
                <input
                  type="text"
                  value={formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                  className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                  placeholder="e.g. CSCS, NASM-CPT, B.S. Kinesiology, CPR/AED"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Profile Photo URL (Optional)</label>
                <input
                  type="url"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Professional Bio / Notes</label>
                <textarea
                  rows="2"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-[#181920] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#ef233c]"
                  placeholder="Brief summary of coaching experience, specialty, achievements..."
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
                  className="px-5 py-2 bg-[#ef233c] hover:bg-[#d90429] text-white font-bold rounded-xl shadow-lg cursor-pointer flex items-center gap-2"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{modalMode === 'create' ? 'Create Staff Record' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW FULL PROFILE MODAL */}
      {viewStaff && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14151b] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-[#181920] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {viewStaff.photoUrl ? (
                  <img src={viewStaff.photoUrl} alt="" className="w-12 h-12 rounded-full object-cover border border-white/10" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#ef233c]/20 border border-[#ef233c]/30 flex items-center justify-center text-white font-bold text-lg">
                    {viewStaff.fullName?.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-black text-white">{viewStaff.fullName}</h3>
                  <span className="text-xs text-gray-400">{viewStaff.designation} • {viewStaff.staffCode}</span>
                </div>
              </div>
              <button
                onClick={() => setViewStaff(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Email</span>
                  <span className="text-white font-mono mt-0.5 block truncate">{viewStaff.email}</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Phone</span>
                  <span className="text-white font-mono mt-0.5 block">{viewStaff.phone || 'None'}</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Specialization</span>
                  <span className="text-[#ef233c] font-bold mt-0.5 block">{viewStaff.specialization}</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Experience</span>
                  <span className="text-white font-bold mt-0.5 block">{viewStaff.yearsOfExperience} Years</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Employment Type</span>
                  <span className="text-white font-mono mt-0.5 block">{viewStaff.employmentType}</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Employment Status</span>
                  <span className="text-emerald-400 font-bold mt-0.5 block">{viewStaff.status}</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-emerald-500/20 col-span-2">
                  <span className="text-emerald-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Confidential Monthly Salary (Admin Only)
                  </span>
                  <span className="text-2xl font-black text-emerald-400 font-mono mt-0.5 block">
                    ${Number(viewStaff.monthlySalary || 0).toLocaleString()} <span className="text-xs text-gray-400 font-normal">USD / month</span>
                  </span>
                </div>
              </div>

              <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Qualifications</span>
                <span className="text-gray-200 mt-1 block">{viewStaff.qualifications || 'No certifications recorded.'}</span>
              </div>

              {viewStaff.bio && (
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Bio</span>
                  <p className="text-gray-300 mt-1 leading-relaxed">{viewStaff.bio}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#181920] border-t border-white/10 flex justify-end">
              <button
                onClick={() => setViewStaff(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE STATUS & RESIGNATION MODAL */}
      {statusModalStaff && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14151b] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-[#181920] border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-black text-white">Update Status: {statusModalStaff.fullName}</h3>
              <button
                onClick={() => setStatusModalStaff(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Employment Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="ON_LEAVE">ON LEAVE</option>
                  <option value="RESIGNED">RESIGNED</option>
                  <option value="TERMINATED">TERMINATED</option>
                </select>
              </div>

              {newStatus === 'RESIGNED' && (
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Resignation / End Date</label>
                  <input
                    type="date"
                    required
                    value={resignationDate}
                    onChange={(e) => setResignationDate(e.target.value)}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ef233c]"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStatusModalStaff(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#ef233c] hover:bg-[#d90429] text-white font-bold rounded-xl shadow-lg cursor-pointer"
                >
                  {saving ? 'Updating...' : 'Confirm Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
