import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  X, 
  RefreshCw,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { adminService } from '../../services/adminService';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AdminSchedulesView({ onNotify }) {
  const [schedules, setSchedules] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [viewMode, setViewMode] = useState('weekly'); // 'weekly' | 'list'
  const [loading, setLoading] = useState(false);

  // Modal State
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [saving, setSaving] = useState(false);
  const [conflictWarning, setConflictWarning] = useState('');

  // Form State
  const initialForm = {
    staffId: '',
    shiftName: 'Morning Shift',
    startTime: '06:00',
    endTime: '14:00',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    scheduleDate: '',
    restDays: 'Saturday, Sunday',
    notes: 'Floor guidance & personal client bookings',
    status: 'SCHEDULED'
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadStaffOptions();
    loadSchedules();
  }, [selectedStaffId]);

  const loadStaffOptions = async () => {
    try {
      const data = await adminService.getStaff('', 'ACTIVE', 0, 100);
      setStaffList(data.content || []);
    } catch (err) {
      console.error('Failed to load staff options for schedules:', err);
    }
  };

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const data = await adminService.getSchedules(selectedStaffId || null);
      setSchedules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load schedules:', err);
      onNotify?.('Failed to load staff schedules.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({
      ...initialForm,
      staffId: staffList[0]?.id || ''
    });
    setConflictWarning('');
    setSelectedSchedule(null);
    setModalMode('create');
  };

  const openEditModal = (s) => {
    setSelectedSchedule(s);
    setConflictWarning('');
    setFormData({
      staffId: s.staffId || '',
      shiftName: s.shiftName || '',
      startTime: s.startTime || '06:00',
      endTime: s.endTime || '14:00',
      workingDays: s.workingDays ? s.workingDays.split(',').map((d) => d.trim()) : [],
      scheduleDate: s.scheduleDate || '',
      restDays: s.restDays || '',
      notes: s.notes || '',
      status: s.status || 'SCHEDULED'
    });
    setModalMode('edit');
  };

  const handleToggleDay = (day) => {
    const current = formData.workingDays || [];
    if (current.includes(day)) {
      setFormData({ ...formData, workingDays: current.filter((d) => d !== day) });
    } else {
      setFormData({ ...formData, workingDays: [...current, day] });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setConflictWarning('');

    const payload = {
      ...formData,
      workingDays: Array.isArray(formData.workingDays) ? formData.workingDays.join(', ') : formData.workingDays
    };

    try {
      if (modalMode === 'create') {
        await adminService.createSchedule(payload);
        onNotify?.('Staff shift assigned successfully.', 'success');
      } else {
        await adminService.updateSchedule(selectedSchedule.id, payload);
        onNotify?.('Staff shift schedule updated.', 'success');
      }
      setModalMode(null);
      loadSchedules();
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not save schedule.';
      if (msg.includes('Overlap') || msg.includes('conflict') || msg.includes('already assigned')) {
        setConflictWarning(`Conflict Detected: ${msg}`);
      } else {
        onNotify?.(msg, 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSchedule = async (s) => {
    if (!confirm(`Cancel and delete shift "${s.shiftName}" for ${s.staffName}?`)) return;
    try {
      await adminService.deleteSchedule(s.id);
      onNotify?.('Shift schedule removed.', 'success');
      loadSchedules();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete shift schedule.';
      onNotify?.(msg, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-yellow-400" />
            <span>Staff Schedules & Shifts</span>
            <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2.5 py-0.5 rounded-full font-bold">
              {schedules.length} Assigned Rota{schedules.length === 1 ? '' : 's'}
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage daily and weekly trainer rotas, working hours, rest days, and prevent overlapping shift conflicts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="bg-[#14151b] border border-white/10 rounded-xl p-1 flex items-center text-xs">
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                viewMode === 'weekly' ? 'bg-[#ef233c] text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Weekly Rota
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-[#ef233c] text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              All Shifts
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#ef233c] hover:bg-[#d90429] text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Assign Shift</span>
          </button>
        </div>
      </div>

      {/* Filter by Staff */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#14151b] border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400 font-bold">Filter By Trainer:</span>
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="bg-[#181920] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="">All Staff Members ({staffList.length})</option>
            {staffList.map((st) => (
              <option key={st.id} value={st.id}>
                {st.fullName} ({st.designation})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={loadSchedules}
          className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl border border-white/5 cursor-pointer"
          title="Refresh Schedules"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-yellow-400' : ''}`} />
        </button>
      </div>

      {/* VIEW MODE 1: WEEKLY ROTA VIEW */}
      {viewMode === 'weekly' && (
        <div className="bg-[#14151b] border border-white/5 rounded-3xl p-5 shadow-xl space-y-4">
          <h2 className="text-sm font-black uppercase text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-400" /> Weekly Day-by-Day Shift Rotas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {DAYS_OF_WEEK.map((day) => {
              const daySchedules = schedules.filter((s) => {
                if (!s.workingDays) return false;
                return s.workingDays.toLowerCase().includes(day.toLowerCase());
              });

              return (
                <div key={day} className="bg-[#181920] border border-white/5 rounded-2xl p-3 flex flex-col min-h-[220px]">
                  <div className="pb-2 border-b border-white/5 flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{day.substring(0, 3)}</span>
                    <span className="text-[10px] bg-white/5 text-gray-400 px-1.5 py-0.2 rounded font-mono">
                      {daySchedules.length}
                    </span>
                  </div>

                  <div className="flex-1 space-y-2 pt-2.5 overflow-y-auto max-h-80">
                    {daySchedules.length === 0 ? (
                      <span className="text-[10px] text-gray-500 italic block py-4 text-center">No shifts</span>
                    ) : (
                      daySchedules.map((s) => (
                        <div
                          key={s.id}
                          className="p-2.5 rounded-xl bg-[#14151b] border border-white/5 hover:border-white/20 transition-all space-y-1 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-white truncate block">{s.staffName}</span>
                            <button
                              onClick={() => openEditModal(s)}
                              className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-[10px] text-yellow-400 font-mono block">
                            {s.startTime} - {s.endTime}
                          </span>
                          <span className="text-[9px] text-gray-400 block truncate">{s.shiftName}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: DETAILED SHIFTS TABLE */}
      {viewMode === 'list' && (
        <div className="bg-[#14151b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181920] text-gray-400 font-bold uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Trainer / Staff</th>
                  <th className="py-3 px-4">Shift Name</th>
                  <th className="py-3 px-4">Timing</th>
                  <th className="py-3 px-4">Working Days</th>
                  <th className="py-3 px-4">Rest Days / Leave</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-gray-400">
                      <div className="w-7 h-7 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <span>Loading shift schedules...</span>
                    </td>
                  </tr>
                ) : schedules.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-gray-400">
                      <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="font-bold text-white text-sm">No shift schedules assigned</p>
                      <p className="text-xs text-gray-500 mt-1">Click "Assign Shift" above to allocate working hours for your trainers.</p>
                    </td>
                  </tr>
                ) : (
                  schedules.map((s) => (
                    <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-white block text-sm">{s.staffName}</span>
                        <span className="text-[11px] text-gray-400">{s.staffDesignation}</span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-white">
                        {s.shiftName}
                        {s.notes && (
                          <span className="text-[10px] text-gray-500 block truncate max-w-xs">{s.notes}</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-yellow-400 font-bold text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {s.startTime} - {s.endTime}
                        </span>
                        {s.scheduleDate && (
                          <span className="text-[10px] text-gray-500 block">Date: {s.scheduleDate}</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-gray-300">
                        <span className="text-[11px] font-medium">{s.workingDays || 'All weekdays'}</span>
                      </td>

                      <td className="py-3 px-4 text-gray-400 text-[11px]">
                        {s.restDays || 'Weekends'}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          s.status === 'SCHEDULED'
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : s.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {s.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(s)}
                            className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 cursor-pointer"
                            title="Edit Shift"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(s)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 cursor-pointer"
                            title="Delete Shift"
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
        </div>
      )}

      {/* ASSIGN / EDIT SHIFT MODAL WITH CONFLICT DETECTION */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14151b] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-[#181920] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <h3 className="text-base font-black text-white">
                  {modalMode === 'create' ? 'Assign Staff Shift' : 'Edit Shift Schedule'}
                </h3>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              {conflictWarning && (
                <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{conflictWarning}</span>
                </div>
              )}

              <div>
                <label className="block text-gray-400 font-bold mb-1">Staff Member *</label>
                <select
                  required
                  value={formData.staffId}
                  onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                  className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                >
                  <option value="">Select Trainer / Staff</option>
                  {staffList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Shift Name *</label>
                <input
                  type="text"
                  required
                  value={formData.shiftName}
                  onChange={(e) => setFormData({ ...formData, shiftName: e.target.value })}
                  className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                  placeholder="e.g. Morning Shift, Evening Coaching, Weekend Floor"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Start Time (HH:mm) *</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1">End Time (HH:mm) *</label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-2">Working Days</label>
                <div className="flex flex-wrap gap-1.5">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = (formData.workingDays || []).includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => handleToggleDay(day)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-yellow-500 text-black shadow'
                            : 'bg-[#181920] text-gray-400 hover:text-white border border-white/5'
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">Specific Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.scheduleDate}
                    onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Rest Days / Leave</label>
                  <input
                    type="text"
                    value={formData.restDays}
                    onChange={(e) => setFormData({ ...formData, restDays: e.target.value })}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                    placeholder="e.g. Saturday, Sunday"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Notes / Special Instructions</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                  placeholder="e.g. Oversee free weights section, conduct group warm-up"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
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
                  className="px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl shadow-lg cursor-pointer flex items-center gap-2"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{modalMode === 'create' ? 'Assign Shift' : 'Save Shift'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
