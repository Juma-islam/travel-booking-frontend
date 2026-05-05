"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, DollarSign, TrendingUp, Users, Package, CalendarCheck, Loader } from "lucide-react";
import { adminApi, AdminStats } from "@/services/api.service";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats().then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader className="animate-spin text-brand-500" size={32} />
      </div>
    );
  }

  const statusMap: Record<string, number> = {};
  stats?.statusBreakdown?.forEach((s: any) => { statusMap[s._id] = s.count; });

  const conversionRate = stats?.totalBookings
    ? Math.round(((statusMap["confirmed"] || 0) + (statusMap["completed"] || 0)) / stats.totalBookings * 100)
    : 0;

  const avgBookingValue = stats?.totalBookings
    ? Math.round((stats.totalRevenue || 0) / stats.totalBookings)
    : 0;

  const kpis = [
    { label: "Total Revenue", value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: <DollarSign size={20} />, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Conversion Rate", value: `${conversionRate}%`, icon: <TrendingUp size={20} />, color: "text-brand-400", bg: "bg-brand-500/10" },
    { label: "Avg Booking Value", value: `$${avgBookingValue}`, icon: <BarChart3 size={20} />, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Total Users", value: stats?.totalUsers || 0, icon: <Users size={20} />, color: "text-accent-400", bg: "bg-accent-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 mt-1">Platform performance overview.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className={`inline-flex p-2.5 rounded-xl ${k.bg} ${k.color} mb-3`}>{k.icon}</div>
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-slate-400 text-sm mt-1">{k.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-6 flex items-center gap-2">
          <DollarSign size={18} className="text-green-400" />
          Monthly Revenue Trend
        </h2>
        {stats?.monthlyRevenue && stats.monthlyRevenue.length > 0 ? (
          <div className="space-y-4">
            {stats.monthlyRevenue.map((m: any, i: number) => {
              const rev = stats.monthlyRevenue ?? [];
              const maxRev = Math.max(...rev.map((x: any) => x.revenue));
              const pct = maxRev > 0 ? (m.revenue / maxRev) * 100 : 0;
              const monthName = new Date(m._id.year, m._id.month - 1).toLocaleString("default", { month: "long" });
              return (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-slate-400 text-sm w-24 shrink-0">{monthName}</span>
                  <div className="flex-1 h-8 bg-slate-800 rounded-xl overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-xl flex items-center justify-end pr-3"
                    >
                      {pct > 20 && <span className="text-white text-xs font-medium">${m.revenue.toLocaleString()}</span>}
                    </motion.div>
                  </div>
                  {pct <= 20 && <span className="text-green-400 text-sm font-medium w-20 shrink-0">${m.revenue.toLocaleString()}</span>}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No revenue data available yet.</p>
        )}
      </div>

      {/* Booking Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-6">Booking Status Distribution</h2>
          <div className="space-y-4">
            {[
              { status: "confirmed", color: "bg-green-500", label: "Confirmed" },
              { status: "completed", color: "bg-brand-500", label: "Completed" },
              { status: "pending", color: "bg-yellow-500", label: "Pending" },
              { status: "cancelled", color: "bg-red-500", label: "Cancelled" },
            ].map(({ status, color, label }) => {
              const count = statusMap[status] || 0;
              const total = stats?.totalBookings || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${color}`} />
                      <span className="text-slate-300">{label}</span>
                    </div>
                    <span className="text-slate-400">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7 }}
                      className={`h-full ${color} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-6">Platform Summary</h2>
          <div className="space-y-3">
            {[
              { label: "Total Users", value: stats?.totalUsers || 0, icon: <Users size={16} className="text-brand-400" /> },
              { label: "Total Packages", value: stats?.totalPackages || 0, icon: <Package size={16} className="text-purple-400" /> },
              { label: "Total Bookings", value: stats?.totalBookings || 0, icon: <CalendarCheck size={16} className="text-accent-400" /> },
              { label: "Paid Bookings", value: (statusMap["confirmed"] || 0) + (statusMap["completed"] || 0), icon: <DollarSign size={16} className="text-green-400" /> },
              { label: "Cancelled Bookings", value: statusMap["cancelled"] || 0, icon: <TrendingUp size={16} className="text-red-400" /> },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-800 last:border-0">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  {row.icon}
                  {row.label}
                </div>
                <span className="font-semibold text-white">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
