"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Package,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { adminApi, AdminStats } from "@/services/api.service";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-300",
  confirmed: "bg-green-500/20 text-green-300",
  cancelled: "bg-red-500/20 text-red-300",
  completed: "bg-brand-500/20 text-brand-300",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .getStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader className="animate-spin text-brand-500" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24">
        <p className="text-red-400">{error}</p>
        <p className="text-slate-500 text-sm mt-2">Make sure the backend is running and you are logged in as admin.</p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: <Users size={22} />,
      color: "text-brand-400",
      bg: "bg-brand-500/10",
      href: "/admin/users",
    },
    {
      label: "Total Packages",
      value: stats?.totalPackages ?? 0,
      icon: <Package size={22} />,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      href: "/admin/packages",
    },
    {
      label: "Total Bookings",
      value: stats?.totalBookings ?? 0,
      icon: <CalendarCheck size={22} />,
      color: "text-accent-400",
      bg: "bg-accent-500/10",
      href: "/admin/bookings",
    },
    {
      label: "Total Revenue",
      value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`,
      icon: <DollarSign size={22} />,
      color: "text-green-400",
      bg: "bg-green-500/10",
      href: "/admin/analytics",
    },
  ];

  // Build status breakdown map
  const statusMap: Record<string, number> = {};
  stats?.statusBreakdown?.forEach((s: any) => {
    statusMap[s._id] = s.count;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1">Platform overview and key metrics.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              href={s.href}
              className="block bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors"
            >
              <div className={`inline-flex p-2.5 rounded-xl ${s.bg} ${s.color} mb-3`}>
                {s.icon}
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-slate-400 text-sm mt-1">{s.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Booking Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
            <TrendingUp size={18} className="text-brand-400" />
            Booking Status Breakdown
          </h2>
          <div className="space-y-3">
            {["pending", "confirmed", "completed", "cancelled"].map((status) => {
              const count = statusMap[status] || 0;
              const total = stats?.totalBookings || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="capitalize text-slate-300">{status}</span>
                    <span className="text-slate-400">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        status === "confirmed" ? "bg-green-500" :
                        status === "pending" ? "bg-yellow-500" :
                        status === "cancelled" ? "bg-red-500" : "bg-brand-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
            <DollarSign size={18} className="text-green-400" />
            Monthly Revenue (Last 6 Months)
          </h2>
          {stats?.monthlyRevenue && stats.monthlyRevenue.length > 0 ? (
            <div className="space-y-3">
              {stats.monthlyRevenue.map((m: any, i: number) => {
                const rev = stats.monthlyRevenue ?? [];
                const maxRev = Math.max(...rev.map((x: any) => x.revenue));
                const pct = maxRev > 0 ? Math.round((m.revenue / maxRev) * 100) : 0;
                const monthName = new Date(m._id.year, m._id.month - 1).toLocaleString("default", { month: "short" });
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-slate-300">{monthName} {m._id.year}</span>
                      <span className="text-green-400 font-medium">${m.revenue.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No revenue data yet.</p>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="font-semibold text-white">Recent Bookings</h2>
          <Link
            href="/admin/bookings"
            className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {stats?.recentBookings && stats.recentBookings.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {stats.recentBookings.map((booking: any) => (
              <div key={booking._id} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">
                    {booking.packageItem?.title || "Package"}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {typeof booking.user === "object" ? booking.user.name : "User"} •{" "}
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-white text-sm">${booking.totalPrice}</p>
                  <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">No bookings yet.</div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { href: "/admin/users", label: "Manage Users", icon: <Users size={18} /> },
          { href: "/admin/packages", label: "Manage Packages", icon: <Package size={18} /> },
          { href: "/admin/bookings", label: "All Bookings", icon: <CalendarCheck size={18} /> },
          { href: "/admin/destinations", label: "Destinations", icon: <CheckCircle size={18} /> },
        ].map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className="flex items-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            <span className="text-brand-400">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
