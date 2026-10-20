import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw 
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminSubscriptionsView({ onNotify }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubscriptions(page, statusFilter);
  }, [page, statusFilter]);

  const loadSubscriptions = async (p = 0, s = '') => {
    setLoading(true);
    try {
      const data = await adminService.getSubscriptions(p, 15, s);
      setSubscriptions(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
      onNotify?.('Failed to load subscriptions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            <span>Subscriptions Management</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
              {totalElements} Total
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Monitor member subscription lifecycles, active premium entitlements, and renewal statuses
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="bg-[#14151b] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ef233c] cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="FREE">FREE</option>
            <option value="EXPIRING_SOON">EXPIRING SOON</option>
            <option value="EXPIRED">EXPIRED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-[#14151b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181920] text-gray-400 font-bold uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Subscriber</th>
                <th className="py-3 px-4">Plan Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">End Date</th>
                <th className="py-3 px-4">Auto Renew</th>
                <th className="py-3 px-4">Premium Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-gray-400">
                    <div className="w-7 h-7 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading subscriptions...</span>
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-gray-400">
                    <CreditCard className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="font-bold text-white text-sm">No subscriptions found</p>
                    <p className="text-xs text-gray-500 mt-1">Try selecting a different status filter.</p>
                  </td>
                </tr>
              ) : (
                subscriptions.map((s) => (
                  <tr key={s.subscriptionId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block text-sm">{s.userName}</span>
                      <span className="text-[11px] text-gray-400">{s.userEmail}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white text-sm">
                      {s.planName || 'Free Membership'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        s.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : s.status === 'EXPIRING_SOON'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : s.status === 'EXPIRED'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-white/5 text-gray-400'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-300 font-mono text-[11px]">{s.startDate || '—'}</td>
                    <td className="py-3.5 px-4 text-gray-300 font-mono text-[11px]">{s.endDate || 'Ongoing / Lifetime'}</td>
                    <td className="py-3.5 px-4">
                      {s.autoRenew ? (
                        <span className="text-emerald-400 font-semibold">Enabled</span>
                      ) : (
                        <span className="text-gray-500">Disabled</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {s.isPremiumActive ? (
                        <span className="text-emerald-400 font-black flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> YES
                        </span>
                      ) : (
                        <span className="text-gray-500 font-semibold">No</span>
                      )}
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
            Page <strong className="text-white">{page + 1}</strong> of <strong className="text-white">{totalPages}</strong> ({totalElements} subscriptions)
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
    </div>
  );
}
