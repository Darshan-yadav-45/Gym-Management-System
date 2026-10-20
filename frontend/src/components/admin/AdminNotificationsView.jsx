import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Mail, 
  Send, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw, 
  X, 
  AlertTriangle 
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminNotificationsView({ onNotify }) {
  const [deadlines, setDeadlines] = useState({ expiringSoon: [], expired: [], totalRequiringAction: 0 });
  const [recipientsData, setRecipientsData] = useState({ recipients: ['lakalkakaakaaa@gmail.com', 'appu12813@gmail.com', 'darshankm703@gmail.com'], count: 3 });
  const [emailLogs, setEmailLogs] = useState([]);
  const [emailStatus, setEmailStatus] = useState(null);
  const [smsStatus, setSmsStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const [testEmailMsg, setTestEmailMsg] = useState('');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [isSendingDeadlineReminders, setIsSendingDeadlineReminders] = useState(false);
  const [confirmBroadcastOpen, setConfirmBroadcastOpen] = useState(false);

  useEffect(() => {
    loadAllNotificationData();
  }, []);

  const loadAllNotificationData = async () => {
    setLoading(true);
    try {
      const [deadlinesData, logsData, statusData, smsData, recData] = await Promise.all([
        adminService.getDeadlines().catch(() => ({ expiringSoon: [], expired: [] })),
        adminService.getEmailHistory(0, 50).catch(() => []),
        adminService.getEmailStatus().catch(() => null),
        adminService.getSmsStatus().catch(() => null),
        adminService.getRecipients().catch(() => null)
      ]);
      setDeadlines(deadlinesData || { expiringSoon: [], expired: [], totalRequiringAction: 0 });
      const logs = Array.isArray(logsData?.content) ? logsData.content : (Array.isArray(logsData) ? logsData : []);
      setEmailLogs(logs);
      setEmailStatus(statusData);
      setSmsStatus(smsData);
      if (recData && recData.recipients) {
        setRecipientsData(recData);
      }
    } catch (err) {
      console.error('Failed to load notifications data:', err);
      onNotify?.('Failed to load notification audit records.', 'error');
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
      loadAllNotificationData();
    } catch (err) {
      const msg = err.response?.data?.message || 'SMTP delivery failed. Check your environment SMTP configuration.';
      setTestEmailMsg(`Error: ${msg}`);
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  const handleBroadcastReminders = async () => {
    setConfirmBroadcastOpen(false);
    setIsSendingDeadlineReminders(true);
    setTestEmailMsg('');
    try {
      const res = await adminService.sendDeadlineReminders();
      let msg = res.message || 'Deadline notifications dispatched to configured recipients.';
      if (res.sent === 0) {
        if (!emailStatus?.emailEnabled) {
          msg += ' (Notice: Live SMTP is currently disabled, so reminders were recorded to the Audit Log below as SKIPPED).';
        } else if (res.failed > 0) {
          msg += ' (Notice: Delivery failed due to SMTP authentication. Google requires a 16-character App Password).';
        } else if (res.skipped > 0) {
          msg += ' (Notice: Reminders were skipped because duplicate notifications were already dispatched today).';
        }
      }
      setTestEmailMsg(msg);
      loadAllNotificationData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to dispatch deadline reminders.';
      setTestEmailMsg(`Error: ${msg}`);
    } finally {
      setIsSendingDeadlineReminders(false);
    }
  };

  const handleSendSingleReminder = async (userId, userName) => {
    try {
      const res = await adminService.sendUserReminder(userId);
      onNotify?.(res.message || `Reminder dispatched for ${userName}.`, 'success');
      loadAllNotificationData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send reminder.';
      onNotify?.(msg, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-yellow-400" />
            <span>Subscription Deadline Alerts & Email Audit</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage membership expiry notifications, inspect configured admin recipients, and view live delivery audit logs
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSendTestEmail}
            disabled={isSendingTestEmail}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSendingTestEmail ? 'Sending...' : 'Test SMTP'}</span>
          </button>

          <button
            onClick={() => setConfirmBroadcastOpen(true)}
            disabled={isSendingDeadlineReminders}
            className="px-4 py-2 bg-[#ef233c] hover:bg-[#d90429] active:scale-95 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{isSendingDeadlineReminders ? 'Broadcasting...' : 'Broadcast Reminders to Recipients'}</span>
          </button>
        </div>
      </div>

      {testEmailMsg && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 ${
          testEmailMsg.startsWith('Error')
            ? 'bg-red-500/15 border border-red-500/30 text-red-200'
            : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-200'
        }`}>
          <div className="flex items-center gap-2">
            {testEmailMsg.startsWith('Error') ? <AlertCircle className="w-4 h-4 text-red-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            <span>{testEmailMsg}</span>
          </div>
          <button onClick={() => setTestEmailMsg('')} className="hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Configured Recipients */}
        <div className="bg-[#14151b] border border-white/5 rounded-3xl p-5 space-y-3 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#ef233c]" /> Configured Recipients
              </h3>
              <span className="text-[10px] font-bold bg-[#ef233c]/20 text-[#ef233c] px-2 py-0.5 rounded-full border border-[#ef233c]/30">
                {recipientsData.recipients?.length || 3} Addresses
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Deadline alerts are targeted to these backend-configured addresses:
            </p>
            <div className="space-y-1.5 pt-2">
              {(recipientsData.recipients || []).map((email, idx) => (
                <div key={idx} className="bg-[#181920] border border-white/10 rounded-xl p-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="text-xs font-mono font-bold text-gray-200 truncate" title={email}>
                    {email}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-gray-500 pt-1">
            Configured via <code className="text-gray-400">DEADLINE_NOTIFICATION_EMAILS</code> (Admin: <strong className="text-gray-300">appu12813@gmail.com</strong>).
          </p>
        </div>

        {/* Card 2: SMTP Email Delivery Status */}
        <div className="bg-[#14151b] border border-white/5 rounded-3xl p-5 space-y-3 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" /> SMTP Email Status
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                emailStatus?.emailEnabled
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
              }`}>
                {emailStatus?.emailEnabled ? 'Live SMTP Active' : 'Audit Mode (Disabled)'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {emailStatus?.emailEnabled
                ? 'Real-time SMTP dispatch is enabled. Outbound emails are sent from appu12813@gmail.com.'
                : 'Live SMTP is disabled. Reminders are safely recorded in the live Audit Log below without sending real emails.'}
            </p>
          </div>
          <div className="p-3 bg-[#181920] rounded-xl border border-white/5 text-[11px] text-gray-400">
            <span>To enable live outbound emails:</span>
            <p className="text-[10px] text-gray-500 mt-1">
              Set <code className="text-gray-300">fitflow.mail.enabled=true</code> with Gmail ID <strong className="text-white">appu12813@gmail.com</strong> and 16-char App Password.
            </p>
          </div>
        </div>

        {/* Card 3: SMS Provider Channel Status */}
        <div className="bg-[#14151b] border border-white/5 rounded-3xl p-5 space-y-3 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" /> SMS Channel Status
              </h3>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Sender: appu12813@gmail.com
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              SMS notifications dispatch directly to user phone numbers with Admin identity (appu12813@gmail.com).
            </p>
          </div>
          <div className="p-3 bg-[#181920] rounded-xl border border-white/5 text-[11px] text-gray-400">
            <span>Channel: <strong className="text-white">Direct SMS Alert Gateway</strong></span>
            <p className="text-[10px] text-gray-500 mt-1">Optional: configure <code className="text-gray-400">TWILIO_ACCOUNT_SID</code> for live telecom carrier routing.</p>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines & Expired Subscriptions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Expiring Soon */}
        <div className="bg-[#14151b] border border-white/5 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" /> Expiring Within 7 Days ({deadlines.expiringSoon?.length || 0})
            </h3>
            <span className="text-xs text-yellow-400 font-bold">Action Needed</span>
          </div>

          {!deadlines?.expiringSoon || deadlines.expiringSoon.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">No subscriptions currently in the 7-day expiry reminder window.</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(deadlines.expiringSoon || []).map((sub) => (
                <div key={sub.subscriptionId} className="bg-[#181920] p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{sub.userName}</span>
                    <span className="text-[11px] text-gray-400">{sub.userEmail} • {sub.planName}</span>
                    <span className="text-[10px] text-yellow-400 block font-semibold">Expires: {sub.endDate}</span>
                  </div>
                  <button
                    onClick={() => handleSendSingleReminder(sub.userId, sub.userName)}
                    className="px-2.5 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg text-[10px] font-bold border border-yellow-500/30 cursor-pointer"
                  >
                    Send Alert
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expired Subscriptions */}
        <div className="bg-[#14151b] border border-white/5 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" /> Expired Subscriptions ({deadlines.expired?.length || 0})
            </h3>
            <span className="text-xs text-red-400 font-bold">Renewal Required</span>
          </div>

          {!deadlines?.expired || deadlines.expired.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">No subscriptions currently marked as expired.</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(deadlines.expired || []).map((sub) => (
                <div key={sub.subscriptionId} className="bg-[#181920] p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{sub.userName}</span>
                    <span className="text-[11px] text-gray-400">{sub.userEmail} • {sub.planName}</span>
                    <span className="text-[10px] text-red-400 block font-semibold">Ended: {sub.endDate || 'Lapsed'}</span>
                  </div>
                  <button
                    onClick={() => handleSendSingleReminder(sub.userId, sub.userName)}
                    className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-[10px] font-bold border border-red-500/30 cursor-pointer"
                  >
                    Send Notice
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Email Delivery History Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
          <Mail className="w-4 h-4 text-emerald-400" /> Live Email Delivery Audit Log
        </h3>

        <div className="bg-[#14151b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181920] text-gray-400 font-bold uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Notification Type</th>
                  <th className="py-3 px-4">Delivery Status</th>
                  <th className="py-3 px-4">Attempt Time</th>
                  <th className="py-3 px-4">Audit Note / Provider Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-400">
                      <div className="w-6 h-6 border-2 border-[#ef233c] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <span>Loading email history...</span>
                    </td>
                  </tr>
                ) : !Array.isArray(emailLogs) || emailLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-400">
                      No email delivery records logged yet.
                    </td>
                  </tr>
                ) : (
                  emailLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-bold text-white">{log.recipientEmail}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] text-gray-300">{log.notificationType}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          log.deliveryStatus === 'SENT'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : log.deliveryStatus === 'FAILED'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {log.deliveryStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : '—'}
                      </td>
                      <td className="py-3 px-4 text-gray-400 max-w-xs truncate" title={log.providerResponse || log.errorMessage}>
                        {log.providerResponse || log.errorMessage || 'Delivered to SMTP server.'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Broadcast Reminders Confirmation Modal */}
      {confirmBroadcastOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14151b] border border-white/10 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">Broadcast Deadline Reminders?</h3>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                This operation will check all upcoming and expired subscriptions in the PostgreSQL database and dispatch notifications to the <strong>3 configured administrator addresses</strong>:
              </p>
              <ul className="mt-2 space-y-1 text-xs font-mono text-gray-300 bg-[#181920] p-2.5 rounded-xl border border-white/5">
                {(recipientsData.recipients || []).map((email, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{email}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmBroadcastOpen(false)}
                className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleBroadcastReminders}
                className="flex-1 py-2 rounded-xl bg-[#ef233c] hover:bg-[#d90429] text-xs font-bold text-white transition-colors cursor-pointer shadow-lg"
              >
                Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
