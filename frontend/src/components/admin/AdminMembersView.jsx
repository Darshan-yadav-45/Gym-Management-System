import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Clock, 
  Calendar,
  X,
  Phone,
  Mail,
  UserCheck,
  UserX
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminMembersView({ onNotify }) {
  const [members, setMembers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadMembers(page, search, statusFilter);
  }, [page, statusFilter]);

  const loadMembers = async (p = 0, q = '', s = '') => {
    setLoading(true);
    try {
      const data = await adminService.getMembers(p, 15, q, s);
      setMembers(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load gym members:', err);
      onNotify?.('Failed to load members from database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadMembers(0, search, statusFilter);
  };

  const handleToggleStatus = async (memberId, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} this gym member's account?`)) return;

    setActionLoading(true);
    try {
      const res = await adminService.toggleUserStatus(memberId);
      onNotify?.(res.message || 'Member account status updated successfully.', 'success');
      loadMembers(page, search, statusFilter);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update member status.';
      onNotify?.(msg, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendReminder = async (memberId, memberName) => {
    if (!confirm(`Dispatch subscription reminder for ${memberName} (Email & SMS)?`)) return;
    try {
      const res = await adminService.sendUserReminder(memberId);
      onNotify?.(res.message || `Reminder dispatched for ${memberName}.`, 'success');
      loadMembers(page, search, statusFilter);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send reminder.';
      onNotify?.(msg, 'error');
    }
  };

  const handleSendSms = async (memberId, memberName, phone) => {
    if (!phone) {
      alert(`Member ${memberName} does not have a phone number registered.`);
      return;
    }
    const customMsg = prompt(
      `Send SMS notification to ${memberName} (${phone}) from Admin:`,
      `FitFlow Alert: Hi ${memberName}, your gym membership needs your attention. Visit fitflow.com to manage your subscription.`
    );
    if (!customMsg) return;

    try {
      const res = await adminService.sendUserSms(memberId, customMsg);
      onNotify?.(res.message || `SMS dispatched to ${phone}.`, 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to dispatch SMS.';
      onNotify?.(msg, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search/Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            <span>Gym Members</span>
            <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full font-bold">
              {totalElements} Total
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Registered gym members directory with active subscriptions, remaining days, and account controls
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#14151b] border border-white/10 rounded-xl px-3 py-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
            >
              <option value="" className="bg-[#14151b]">All Subscriptions</option>
              <option value="ACTIVE" className="bg-[#14151b]">Active Subs</option>
              <option value="EXPIRING_SOON" className="bg-[#14151b]">Expiring Soon (&lt;7d)</option>
              <option value="EXPIRED" className="bg-[#14151b]">Expired</option>
              <option value="FREE" className="bg-[#14151b]">Free Plan</option>
            </select>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email..."
                className="w-48 sm:w-60 bg-[#14151b] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#ef233c]"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 bg-[#ef233c] hover:bg-[#d90429] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setStatusFilter('');
                setPage(0);
                loadMembers(0, '', '');
              }}
              className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-white/5 cursor-pointer"
              title="Reset Search"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </form>
        </div>
      </div>

      {/* Members Directory Table */}
      <div className="bg-[#14151b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181920] text-gray-400 font-bold uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Member Info</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Account Access</th>
                <th className="py-3 px-4">Subscription Plan</th>
                <th className="py-3 px-4">Subscription Period</th>
                <th className="py-3 px-4">Remaining Days</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-gray-400">
                    <div className="w-7 h-7 border-3 border-[#ef233c] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading member directory...</span>
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-gray-400">
                    <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="font-bold text-white text-sm">No members found</p>
                    <p className="text-xs text-gray-500 mt-1">Try adjusting your search query or filter criteria.</p>
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Name & Email */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-white block text-sm">{m.name}</span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-gray-500" />
                        {m.email}
                      </span>
                      {m.registeredAt && (
                        <span className="text-[10px] text-gray-500 block mt-0.5">
                          Registered: {m.registeredAt.split('T')[0]}
                        </span>
                      )}
                    </td>

                    {/* Phone */}
                    <td className="py-3 px-4 text-gray-300">
                      {m.phone ? (
                        <span className="font-mono text-emerald-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {m.phone}
                        </span>
                      ) : (
                        <span className="text-gray-500 italic">Not provided</span>
                      )}
                    </td>

                    {/* Account Status */}
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1 ${
                        m.enabled
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}>
                        {m.enabled ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {m.enabled ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </td>

                    {/* Plan */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-white block">{m.subscriptionPlanName || 'Free Membership'}</span>
                      <span className={`text-[10px] font-bold uppercase ${
                        m.subscriptionStatus === 'ACTIVE'
                          ? 'text-emerald-400'
                          : m.subscriptionStatus === 'EXPIRING_SOON'
                          ? 'text-yellow-400'
                          : m.subscriptionStatus === 'EXPIRED'
                          ? 'text-red-400'
                          : 'text-gray-500'
                      }`}>
                        {m.subscriptionStatus || 'FREE'}
                      </span>
                    </td>

                    {/* Subscription Period */}
                    <td className="py-3 px-4 text-gray-300">
                      <span className="block text-[11px] text-gray-300">Start: {m.subscriptionStartDate || '—'}</span>
                      <span className="block text-[11px] text-gray-400">Exp: {m.subscriptionEndDate || 'Ongoing / None'}</span>
                    </td>

                    {/* Remaining Days */}
                    <td className="py-3 px-4">
                      {typeof m.remainingDays === 'number' ? (
                        m.remainingDays > 7 ? (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold font-mono text-[11px]">
                            {m.remainingDays} days left
                          </span>
                        ) : m.remainingDays > 0 ? (
                          <span className="bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full font-bold font-mono text-[11px] flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {m.remainingDays} days left
                          </span>
                        ) : (
                          <span className="bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold font-mono text-[11px]">
                            Expired
                          </span>
                        )
                      ) : (
                        <span className="text-gray-500 text-[11px] font-mono">Ongoing</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedMember(m)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 flex items-center gap-1 transition-colors cursor-pointer"
                          title="View Member Profile"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Details</span>
                        </button>

                        <button
                          onClick={() => handleSendReminder(m.id, m.name)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Send Email & SMS Alert"
                        >
                          <Send className="w-3 h-3" />
                          <span>Remind</span>
                        </button>

                        {m.phone && (
                          <button
                            onClick={() => handleSendSms(m.id, m.name, m.phone)}
                            className="px-2 py-1.5 rounded-lg text-[11px] font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 flex items-center gap-1 transition-colors cursor-pointer"
                            title="Direct SMS"
                          >
                            <MessageSquare className="w-3 h-3" />
                          </button>
                        )}

                        <button
                          disabled={actionLoading}
                          onClick={() => handleToggleStatus(m.id, m.enabled)}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                            m.enabled
                              ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {m.enabled ? 'Deactivate' : 'Activate'}
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
            Page <strong className="text-white">{page + 1}</strong> of <strong className="text-white">{totalPages}</strong> ({totalElements} members)
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

      {/* Member Full Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14151b] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-[#181920] border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">{selectedMember.name}</h3>
                <span className="text-xs text-gray-400">{selectedMember.email}</span>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Role</span>
                  <span className="text-white font-bold mt-0.5 block">{selectedMember.role}</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Account Access</span>
                  <span className={`font-bold mt-0.5 block ${selectedMember.enabled ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedMember.enabled ? 'Active Account' : 'Deactivated'}
                  </span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Phone (SMS)</span>
                  <span className="text-emerald-400 font-bold mt-0.5 block font-mono">{selectedMember.phone || 'No phone registered'}</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Subscription Plan</span>
                  <span className="text-white font-bold mt-0.5 block">{selectedMember.subscriptionPlanName || 'Free Membership'}</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Subscription Status</span>
                  <span className="text-yellow-400 font-bold mt-0.5 block">{selectedMember.subscriptionStatus || 'FREE'}</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Remaining Days</span>
                  <span className="text-cyan-400 font-bold mt-0.5 block font-mono">
                    {typeof selectedMember.remainingDays === 'number' ? `${selectedMember.remainingDays} days` : 'Ongoing / Lifetime'}
                  </span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Start Date</span>
                  <span className="text-gray-200 mt-0.5 block">{selectedMember.subscriptionStartDate || '—'}</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Expiry Date</span>
                  <span className="text-gray-200 mt-0.5 block">{selectedMember.subscriptionEndDate || 'Ongoing'}</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Selected AI Coach</span>
                  <span className="text-purple-400 font-bold mt-0.5 block">{selectedMember.selectedCoachName || 'None assigned'}</span>
                </div>
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Fitness Goal</span>
                  <span className="text-gray-200 mt-0.5 block">{selectedMember.fitnessGoal || 'General Fitness'}</span>
                </div>
              </div>

              <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Last Notification Audit</span>
                <span className="font-mono text-gray-200 mt-1 block">{selectedMember.lastNotificationStatus || 'No prior email notifications dispatched.'}</span>
              </div>
            </div>

            <div className="p-4 bg-[#181920] border-t border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleSendReminder(selectedMember.id, selectedMember.name);
                    setSelectedMember(null);
                  }}
                  className="px-3.5 py-2 bg-[#ef233c] hover:bg-[#d90429] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reminder</span>
                </button>

                {selectedMember.phone && (
                  <button
                    onClick={() => {
                      handleSendSms(selectedMember.id, selectedMember.name, selectedMember.phone);
                      setSelectedMember(null);
                    }}
                    className="px-3.5 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send SMS</span>
                  </button>
                )}
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
