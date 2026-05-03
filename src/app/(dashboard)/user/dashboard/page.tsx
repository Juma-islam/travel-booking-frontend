"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  DollarSign,
  Heart,
  Star,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  Sparkles,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { bookingApi, Booking } from "@/services/api.service";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  confirmed: "bg-green-500/20 text-green-300 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
  completed: "bg-brand-500/20 text-brand-300 border-brand-500/30",
};

const statusIcon: Record<string, React.ReactNode> = {
  pending: <Clock size={14} />,
  confirmed: <CheckCircle size={14} />,
  cancelled: <XCircle size={14} />,
  completed: <CheckCircle size={14} />,
};

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingApi
      .getMyBookings()
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const totalSpent = bookings
    .filter((b) => b.isPaid)
    .reduce((s, b) => s + b.totalPrice, 0);

  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: <CalendarCheck size={22} />,
      color: "text-brand-400",
      bg: "bg-brand-500/10",
    },
    {
      label: "Total Spent",
      value: `$${totalSpent.toLocaleString()}`,
      icon: <DollarSign size={22} />,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Completed Trips",
      value: bookings.filter((b) => b.status === "completed").length,
      icon: <CheckCircle size={22} />,
      color: "text-accent-400",
      bg: "bg-accent-500/10",
    },
    {
      label: "Upcoming Trips",
      value: bookings.filter((b) => b.status === "confirmed").length,
      icon: <MapPin size={22} />,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-400 mt-1">Here's what's happening with your travels.</p>
        </div>
        <Link
          href="/ai-planner"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Sparkles size={16} />
          Plan a Trip
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
          >
            <div className={`inline-flex p-2.5 rounded-xl ${s.bg} ${s.color} mb-3`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-slate-400 text-sm mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
          <Link
            href="/user/bookings"
            className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader className="animate-spin text-brand-500" size={28} />
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="text-center py-16">
            <CalendarCheck size={40} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400">No bookings yet</p>
            <Link
              href="/packages"
              className="mt-4 inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm font-medium"
            >
              Browse packages <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {recentBookings.map((booking) => (
              <div key={booking._id} className="flex items-center gap-4 p-4 hover:bg-slate-800/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden shrink-0">
                  <img
                    src={booking.packageItem?.images?.[0] || "/api/placeholder/48/48"}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">
                    {booking.packageItem?.title || "Package"}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {new Date(booking.startDate).toLocaleDateString()} →{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-white text-sm">${booking.totalPrice}</p>
                  <span
                    className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                      statusColor[booking.status]
                    }`}
                  >
                    {statusIcon[booking.status]}
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/explore", label: "Explore Destinations", icon: <MapPin size={20} />, color: "from-brand-600 to-brand-700" },
          { href: "/ai-planner", label: "AI Trip Planner", icon: <Sparkles size={20} />, color: "from-accent-600 to-accent-700" },
          { href: "/packages", label: "Browse Packages", icon: <Star size={20} />, color: "from-purple-600 to-purple-700" },
        ].map((action, i) => (
          <Link
            key={i}
            href={action.href}
            className={`flex items-center gap-3 p-5 rounded-2xl bg-gradient-to-br ${action.color} text-white font-medium hover:opacity-90 transition-opacity`}
          >
            {action.icon}
            {action.label}
            <ArrowRight size={16} className="ml-auto" />
          </Link>
        ))}
      </div>

      {/* AI Recommendations Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles size={18} className="text-brand-400" />
            AI Recommendations
          </h2>
          <Link href="/ai-planner" className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1">
            Plan a trip <ArrowRight size={14} />
          </Link>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { dest: "Santorini, Greece", tag: "Romantic", price: "From $1,299", emoji: "🏛️", reason: "Based on your couple travel preference" },
            { dest: "Kyoto, Japan", tag: "Cultural", price: "From $1,499", emoji: "⛩️", reason: "Matches your interest in history & culture" },
            { dest: "Maldives", tag: "Relaxation", price: "From $2,199", emoji: "🏝️", reason: "Perfect for your upcoming vacation window" },
          ].map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-brand-500/40 transition-colors"
            >
              <div className="text-3xl mb-3">{rec.emoji}</div>
              <p className="font-semibold text-white text-sm">{rec.dest}</p>
              <p className="text-xs text-slate-500 mt-0.5 mb-2">{rec.reason}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-600/20 text-brand-300">{rec.tag}</span>
                <span className="text-xs font-semibold text-white">{rec.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="divide-y divide-slate-800">
          {[
            { action: "Booking confirmed", detail: "European Adventure · Jun 10–20", time: "2h ago", color: "bg-green-500" },
            { action: "Review submitted", detail: "Bali Paradise · 4 stars", time: "1d ago", color: "bg-brand-500" },
            { action: "AI plan generated", detail: "7-day Tokyo itinerary", time: "3d ago", color: "bg-purple-500" },
            { action: "Package saved", detail: "Caribbean Paradise added to wishlist", time: "5d ago", color: "bg-amber-500" },
            { action: "Profile updated", detail: "Email & password changed", time: "1w ago", color: "bg-slate-500" },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-3.5">
              <div className={`w-2 h-2 rounded-full shrink-0 ${activity.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{activity.action}</p>
                <p className="text-slate-500 text-xs">{activity.detail}</p>
              </div>
              <span className="text-slate-600 text-xs shrink-0">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
