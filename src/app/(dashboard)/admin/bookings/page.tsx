"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Search,
  Loader,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Users,
  Filter,
} from "lucide-react";
import { bookingApi, Booking } from "@/services/api.service";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  confirmed: "bg-green-500/20 text-green-300 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
  completed: "bg-brand-500/20 text-brand-300 border-brand-500/30",
};

const statuses = ["all", "pending", "confirmed", "completed", "cancelled"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState("");

  useEffect(() => {
    bookingApi
      .getAll()
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    const pkg = b.packageItem?.title?.toLowerCase() || "";
    const user = typeof b.user === "object" ? b.user.name.toLowerCase() : "";
    const matchSearch = pkg.includes(search.toLowerCase()) || user.includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await bookingApi.updateStatus(id, status);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: status as any } : b))
      );
      setToast("Status updated");
      setTimeout(() => setToast(""), 2500);
    } catch {
      setToast("Failed to update status");
      setTimeout(() => setToast(""), 2500);
    }
  };

  const totalRevenue = bookings.filter((b) => b.isPaid).reduce((s, b) => s + b.totalPrice, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings</h1>
          <p className="text-slate-400 mt-1">
            {bookings.length} total • ${totalRevenue.toLocaleString()} revenue
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3.5 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by package or user..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-white text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                statusFilter === s
                  ? "bg-brand-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader className="animate-spin text-brand-500" size={32} />
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-4">Package</th>
                  <th className="text-left px-5 py-4">User</th>
                  <th className="text-left px-5 py-4">Dates</th>
                  <th className="text-left px-5 py-4">Guests</th>
                  <th className="text-left px-5 py-4">Amount</th>
                  <th className="text-left px-5 py-4">Status</th>
                  <th className="text-right px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((booking, i) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-white line-clamp-1">
                        {booking.packageItem?.title || "—"}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">#{booking._id.slice(-6).toUpperCase()}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      {typeof booking.user === "object" ? booking.user.name : "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs">
                      {new Date(booking.startDate).toLocaleDateString()} →{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-slate-300">{booking.guests}</td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-white">${booking.totalPrice}</span>
                      {booking.isPaid && (
                        <span className="ml-2 text-xs text-green-400">✓ Paid</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
                          statusColor[booking.status]
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                          className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:border-brand-500 focus:outline-none"
                        >
                          {["pending", "confirmed", "completed", "cancelled"].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-500">No bookings found.</div>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-xl text-sm">
          <CheckCircle size={16} className="text-green-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
