"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  CalendarCheck,
  Heart,
  Star,
  Bell,
  Loader,
  BellOff,
  Sparkles,
  Tag,
  AlertCircle,
  CheckCircle,
  User,
  RefreshCw,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ActivityItem {
  _id: string;
  type: "booking" | "ai" | "promo" | "system" | "alert";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  booking: {
    icon: <CalendarCheck size={15} />,
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    label: "Booking",
  },
  ai: {
    icon: <Sparkles size={15} />,
    color: "text-brand-400",
    bg: "bg-brand-500/10 border-brand-500/20",
    label: "AI",
  },
  promo: {
    icon: <Tag size={15} />,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    label: "Promo",
  },
  system: {
    icon: <CheckCircle size={15} />,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    label: "System",
  },
  alert: {
    icon: <AlertCircle size={15} />,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    label: "Alert",
  },
};



function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const ALL_TYPES = ["all", "booking", "ai", "promo", "system", "alert"] as const;
type FilterType = (typeof ALL_TYPES)[number];

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchActivities = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;

      if (!token) {
        setActivities([]);
        return;
      }

      const res = await fetch(`${API_BASE}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data: ActivityItem[] = await res.json();
        setActivities(data);
      } else {
        setActivities([]);
      }
    } catch {
      setActivities([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filtered =
    filter === "all" ? activities : activities.filter((a) => a.type === filter);

  // Group by date
  const grouped = filtered.reduce<Record<string, ActivityItem[]>>((acc, item) => {
    const date = new Date(item.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let label: string;
    if (date.toDateString() === today.toDateString()) {
      label = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = "Yesterday";
    } else {
      label = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    }

    if (!acc[label]) acc[label] = [];
    acc[label].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity size={22} className="text-brand-400" />
            Activity Log
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Your recent bookings, AI interactions, and account activity.
          </p>
        </div>
        <button
          onClick={() => fetchActivities(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {ALL_TYPES.map((t) => {
          const count =
            t === "all" ? activities.length : activities.filter((a) => a.type === t).length;
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors ${
                filter === t
                  ? "bg-brand-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {t} <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader className="animate-spin text-brand-500" size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <BellOff size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-300 font-medium">No activity found</p>
          <p className="text-slate-500 text-sm mt-1">
            {filter === "all" ? "Your activity will appear here." : `No ${filter} activity yet.`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([dateLabel, items]) => (
            <div key={dateLabel}>
              {/* Date separator */}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-xs text-slate-500 font-medium px-2">{dateLabel}</span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <div className="space-y-2">
                {items.map((item, i) => {
                  const cfg = typeConfig[item.type] || typeConfig.system;
                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-700 transition-colors"
                    >
                      {/* Icon */}
                      <div
                        className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border ${cfg.bg} ${cfg.color}`}
                      >
                        {cfg.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-white text-sm">{item.title}</p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} capitalize`}
                            >
                              {cfg.label}
                            </span>
                          </div>
                          <span className="text-xs text-slate-600 shrink-0 whitespace-nowrap">
                            {timeAgo(item.createdAt)}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mt-1 leading-relaxed">{item.message}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
