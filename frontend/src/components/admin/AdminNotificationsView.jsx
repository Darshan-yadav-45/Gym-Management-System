import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  Search,
  Filter,
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw, 
  X, 
  AlertTriangle,
  Users,
  ShieldCheck,
  Calendar,
  RotateCw,
  CheckSquare,
  Square
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminNotificationsView({ onNotify }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ summary: {}, memberships: [] });
  const [emailLogs, setEmailLogs] = useState([]);
  const [emailStatus, setEmailStatus] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL | EXPIRING_SOON | ACTIVE | EXPIRED | FREE
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Action states
  const [actionLoading, setActionLoading] = useState(false);
  const [testEmailMsg, setTestEmailMsg] = useState('');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [activeTab, setActiveTab] = useState('memberships'); // memberships | history

  useEffect(() => {
    loadAllNotificationData();
  }, []);

  const loadAllNotificationData = async () => {
    setLoading(true);
    try {
      const [membershipsData, logsData, statusData] = await Promise.all([
        adminService.getMembershipNotificationOverview().catch(() => ({ summary: {}, memberships: [] })),
        adminService.getEmailHistory(0, 50).catch(() => []),
        adminService.getEmailStatus().catch(() => null)
      ]);

      setData(membershipsData || { summary: {}, memberships: [] });
      const logs = Array.isArray(logsData?.content) ? logsData.content : (Array.isArray(logsData) ? logsData : []);
      setEmailLogs(logs);
      setEmailStatus(statusData);
    } catch (err) {
      console.error('Failed to load notifications data:', err);
      onNotify?.('Failed to load membership notification records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    setIsSendingTestEmail(true);
    setTestEmailMsg('');
    try {
      const res = await adminService.sendTestEmail();
      setTestEmailMsg(res.message || 'Test email dispatched successfully.');
      onNotify?.(res.message || 'Test email sent successfully.', 'success');
      loadAllNotificationData();
    } catch (err) {
      const msg = err.response?.data?.message || 'SMTP delivery failed. Check your environment SMTP configuration.';
      setTestEmailMsg(`Error: ${msg}`);
      onNotify?.(msg, 'error');
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  const handleSendSingle2Day = async (userId, userName) => {
    setActionLoading(true);
    try {
      const res = await adminService.sendIndividual2DayReminder(userId);
      onNotify?.(res.message || `2-Day expiry reminder sent to ${userName}.`, 'success');
      loadAllNotificationData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send 2-day reminder.';
      onNotify?.(msg, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendSingleExpired = async (userId, userName) => {
    setActionLoading(true);
    try {
      const res = await adminService.sendIndividualExpiredNotice(userId);
      onNotify?.(res.message || `Expired notification sent to ${userName}.`, 'success');
      loadAllNotificationData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send expired notification.';
      onNotify?.(msg, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkSend = async (type) => {
    if (selectedUserIds.length === 0) {
      onNotify?.('Please select at least one user from the table.', 'error');
      return;
    }
    setActionLoading(true);
    try {
      const res = await adminService.sendBulkReminders(selectedUserIds, type);
      onNotify?.(res.message || `Bulk reminders processed for ${selectedUserIds.length} users.`, 'success');
      setSelectedUserIds([]);
      loadAllNotificationData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Bulk reminder operation failed.';
      onNotify?.(msg, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRetryEmail = async (logId) => {
    setActionLoading(true);
    try {
      const res = await adminService.retryEmailNotification(logId);
      onNotify?.(res.message || 'Email re-sent successfully.', 'success');
      loadAllNotificationData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to retry email delivery.';
      onNotify?.(msg, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter memberships
  const memberships = data.memberships || [];
  const filteredMemberships = memberships.filter((m) => {
    const matchesSearch = 
      (m.userName && m.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.membershipType && m.membershipType.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'EXPIRING_SOON') return m.isExpiring2Days || m.status === 'EXPIRING_SOON';
    if (statusFilter === 'ACTIVE') return m.status === 'ACTIVE';
    if (statusFilter === 'EXPIRED') return m.status === 'EXPIRED';
    if (statusFilter === 'FREE') return m.status === 'FREE';

    return true;
  });

  const toggleSelectAll = () => {
    if (selectedUserIds.length === filteredMemberships.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredMemberships.map((m) => m.userId));
    }
  };

  const toggleSelectUser = (id) => {
    setSelectedUserIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const summary = data.summary || {};

  return (
    <div className="space-y-6">
      
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Mail className="w-6 h-6 text-[#ef233c]" />
              <span>Membership Email Notifications</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#ef233c]/20 text-[#ef233c] border border-[#ef233c]/30">
              Admin Console
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Automated 2-day expiry reminders, expired notices, and comprehensive email delivery audit logs
          </p>
        </div>

        {/* Actions bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadAllNotificationData}
            disabled={loading}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            title="Refresh Notification Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleSendTestEmail}
            disabled={isSendingTestEmail}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            title="Send test email to authenticated admin"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSendingTestEmail ? 'Sending...' : 'Test SMTP'}</span>
          </button>
        </div>
      </div>

      {/* SMTP Banner Feedback */}
      {testEmailMsg && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 ${
          testEmailMsg.startsWith('Error')
            ? 'bg-red-500/15 border border-red-500/30 text-red-300'
            : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
        }`}>
          <div className="flex items-center gap-2">
            {testEmailMsg.startsWith('Error') ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{testEmailMsg}</span>
          </div>
          <button onClick={() => setTestEmailMsg('')} className="p-1 hover:bg-white/10 rounded cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── 6 KPI Metric Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div className="bg-[#181920] p-4 rounded-2xl border border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
            Total Users
          </span>
          <div className="text-2xl font-black text-white font-display">
            {summary.totalUsers || 0}
          </div>
          <span className="text-[10px] text-gray-500 mt-0.5 block">Registered accounts</span>
        </div>

        <div className="bg-[#181920] p-4 rounded-2xl border border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            Active Members
          </span>
          <div className="text-2xl font-black text-emerald-400 font-display">
            {summary.activeMemberships || 0}
          </div>
          <span className="text-[10px] text-gray-500 mt-0.5 block">Valid memberships</span>
        </div>

        <div className="bg-[#181920] p-4 rounded-2xl border border-yellow-500/30 bg-yellow-950/10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 block mb-1">
            Expiring in 2 Days
          </span>
          <div className="text-2xl font-black text-yellow-400 font-display">
            {summary.expiringWithin2Days || 0}
          </div>
          <span className="text-[10px] text-yellow-500/80 mt-0.5 block">Action required</span>
        </div>

        <div className="bg-[#181920] p-4 rounded-2xl border border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block mb-1">
            Expired Members
          </span>
          <div className="text-2xl font-black text-red-400 font-display">
            {summary.expiredMemberships || 0}
          </div>
          <span className="text-[10px] text-gray-500 mt-0.5 block">Renewal needed</span>
        </div>

        <div className="bg-[#181920] p-4 rounded-2xl border border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
            Emails Sent
          </span>
          <div className="text-2xl font-black text-cyan-400 font-display">
            {summary.emailsSentSuccessfully || 0}
          </div>
          <span className="text-[10px] text-gray-500 mt-0.5 block">Accepted by SMTP</span>
        </div>

        <div className="bg-[#181920] p-4 rounded-2xl border border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block mb-1">
            Emails Failed
          </span>
          <div className="text-2xl font-black text-orange-400 font-display">
            {summary.emailsFailed || 0}
          </div>
          <span className="text-[10px] text-gray-500 mt-0.5 block">Delivery errors</span>
        </div>

      </div>

      {/* ── Sub Navigation Tabs ─────────────────────────────────── */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          onClick={() => setActiveTab('memberships')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
            activeTab === 'memberships'
              ? 'border-[#ef233c] text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          User Memberships ({filteredMemberships.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
            activeTab === 'history'
              ? 'border-[#ef233c] text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Delivery Audit History ({emailLogs.length})
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: MEMBERSHIP NOTIFICATIONS TABLE                    */}
      {/* ======================================================== */}
      {activeTab === 'memberships' && (
        <div className="space-y-4">
          
          {/* Controls: Search, Filter, Bulk Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#181920] p-4 rounded-2xl border border-white/5">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user name, email, or plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#121318] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ef233c] transition-colors"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  statusFilter === 'ALL' ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('EXPIRING_SOON')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  statusFilter === 'EXPIRING_SOON' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                Expiring in 2 Days
              </button>
              <button
                onClick={() => setStatusFilter('ACTIVE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  statusFilter === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('EXPIRED')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  statusFilter === 'EXPIRED' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                Expired
              </button>
            </div>

          </div>

          {/* Bulk Action Bar (Visible when users selected) */}
          {selectedUserIds.length > 0 && (
            <div className="bg-[#201518] border border-[#ef233c]/40 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-200">
                <span className="w-6 h-6 rounded-full bg-[#ef233c] text-white flex items-center justify-center text-[10px]">
                  {selectedUserIds.length}
                </span>
                <span>User(s) Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkSend('2DAY')}
                  disabled={actionLoading}
                  className="px-3.5 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/40 text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  Send 2-Day Reminders (Bulk)
                </button>
                <button
                  onClick={() => handleBulkSend('EXPIRED')}
                  disabled={actionLoading}
                  className="px-3.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  Send Expired Notices (Bulk)
                </button>
                <button
                  onClick={() => setSelectedUserIds([])}
                  className="px-2.5 py-1.5 text-xs text-gray-400 hover:text-white cursor-pointer"
                >
                  Deselect All
                </button>
              </div>
            </div>
          )}

          {/* Memberships Table */}
          <div className="bg-[#181920] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#14151b] border-b border-white/5 text-gray-400 uppercase font-black tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 w-10">
                      <button onClick={toggleSelectAll} className="cursor-pointer text-gray-400 hover:text-white">
                        {selectedUserIds.length === filteredMemberships.length && filteredMemberships.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-[#ef233c]" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="p-4">User Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Membership Plan</th>
                    <th className="p-4">Start Date</th>
                    <th className="p-4">Expiry Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Email Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredMemberships.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-gray-500 italic">
                        No user memberships match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredMemberships.map((m) => {
                      const isSelected = selectedUserIds.includes(m.userId);
                      return (
                        <tr 
                          key={m.userId}
                          className={`hover:bg-white/[0.02] transition-colors ${
                            isSelected ? 'bg-red-500/[0.04]' : ''
                          }`}
                        >
                          <td className="p-4">
                            <button onClick={() => toggleSelectUser(m.userId)} className="cursor-pointer text-gray-400 hover:text-white">
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-[#ef233c]" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                          <td className="p-4 font-bold text-white whitespace-nowrap">
                            {m.userName}
                          </td>
                          <td className="p-4 text-gray-300 font-mono text-[11px] whitespace-nowrap">
                            {m.email}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-gray-200">
                              {m.membershipType}
                            </span>
                          </td>
                          <td className="p-4 text-gray-400 font-mono text-[11px] whitespace-nowrap">
                            {m.startDate}
                          </td>
                          <td className="p-4 font-mono text-[11px] whitespace-nowrap">
                            <span className={m.isExpiring2Days ? 'text-yellow-400 font-bold bg-yellow-500/10 px-2 py-0.5 rounded' : 'text-gray-300'}>
                              {m.expiryDate}
                            </span>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            {m.status === 'ACTIVE' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                Active
                              </span>
                            )}
                            {(m.status === 'EXPIRING_SOON' || m.isExpiring2Days) && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                                Expiring in 2 Days
                              </span>
                            )}
                            {m.status === 'EXPIRED' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                                Expired
                              </span>
                            )}
                            {m.status === 'FREE' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-gray-400">
                                Free Tier
                              </span>
                            )}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            {m.emailStatus === 'SENT' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Sent</span>
                              </span>
                            )}
                            {m.emailStatus === 'FAILED' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400" title={m.errorMsg}>
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Failed</span>
                              </span>
                            )}
                            {m.emailStatus === 'PENDING' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-yellow-400">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Pending</span>
                              </span>
                            )}
                            {m.emailStatus === 'NONE' && (
                              <span className="text-[10px] text-gray-500 italic">None</span>
                            )}
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleSendSingle2Day(m.userId, m.userName)}
                                disabled={actionLoading}
                                className="px-2.5 py-1 bg-yellow-500/15 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30 rounded-lg text-[11px] font-bold transition-all disabled:opacity-50 cursor-pointer"
                                title="Send 2-Day Expiry Reminder Email"
                              >
                                Send 2-Day Reminder
                              </button>
                              <button
                                onClick={() => handleSendSingleExpired(m.userId, m.userName)}
                                disabled={actionLoading}
                                className="px-2.5 py-1 bg-red-500/15 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg text-[11px] font-bold transition-all disabled:opacity-50 cursor-pointer"
                                title="Send Membership Expired Notice Email"
                              >
                                Send Expired Notice
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: AUDIT & DELIVERY HISTORY                          */}
      {/* ======================================================== */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="bg-[#181920] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#14151b] border-b border-white/5 text-gray-400 uppercase font-black tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Log ID</th>
                    <th className="p-4">Recipient Email</th>
                    <th className="p-4">Notification Type</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Delivery Status</th>
                    <th className="p-4">Attempts</th>
                    <th className="p-4">Sent / Attempted Date</th>
                    <th className="p-4">Provider Response</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {emailLogs.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-gray-500 italic">
                        No delivery logs recorded yet.
                      </td>
                    </tr>
                  ) : (
                    emailLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-mono text-gray-400">
                          #{log.id}
                        </td>
                        <td className="p-4 font-mono text-white text-[11px]">
                          {log.recipientEmail}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-gray-300 border border-white/5">
                            {log.notificationType}
                          </span>
                        </td>
                        <td className="p-4 text-gray-300 max-w-xs truncate">
                          {log.subject}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          {log.deliveryStatus === 'SENT' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              SENT
                            </span>
                          )}
                          {log.deliveryStatus === 'FAILED' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                              FAILED
                            </span>
                          )}
                          {log.deliveryStatus === 'SKIPPED' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-500/15 text-gray-400 border border-gray-500/30">
                              SKIPPED
                            </span>
                          )}
                          {log.deliveryStatus === 'PENDING' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                              PENDING
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-mono text-gray-400 text-center">
                          {log.attemptCount}
                        </td>
                        <td className="p-4 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                          {log.lastAttemptAt ? log.lastAttemptAt.replace('T', ' ').substring(0, 16) : (log.createdAt ? log.createdAt.replace('T', ' ').substring(0, 16) : '—')}
                        </td>
                        <td className="p-4 text-gray-400 text-[11px] max-w-xs truncate" title={log.providerResponse}>
                          {log.providerResponse || '—'}
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          {log.deliveryStatus === 'FAILED' ? (
                            <button
                              onClick={() => handleRetryEmail(log.id)}
                              disabled={actionLoading}
                              className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1 ml-auto cursor-pointer"
                            >
                              <RotateCw className="w-3 h-3" />
                              <span>Retry</span>
                            </button>
                          ) : (
                            <span className="text-gray-600 text-[10px]">No action</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
