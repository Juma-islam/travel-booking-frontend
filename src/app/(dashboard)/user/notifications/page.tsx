"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle,
  CalendarCheck,
  Sparkles,
  Tag,
  AlertCircle,
  Trash2,
  Check,
  BellOff,
} from "lucide-react";

type NotifType = "booking" | "ai" | "promo" | "system" | "alert";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const typeConfig: Record<NotifType, { icon: React.ReactNode; color: string; bg: string }> = {
  booking: { icon: <CalendarCheck size={16} />, color: "text-green-400", bg: "bg-green-500/10" },
  ai: { icon: <Sparkles size={16} />, color: "text-brand-400", bg: "bg-brand-500/10" },
  promo: { icon: <Tag size={16} />, color: "text-amber-400", bg: "bg-amber-500/10" },
  system: { icon: <CheckCircle size={16} />, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  alert: { icon: <AlertCircle size={16} />, color: "text-red-400", bg: "bg-red-500/10" },
};

const INITIAL: Notification[] = [
  {
    id: "1",
    type: "booking",
    title: "Booking Confirmed!",
    message: "Your booking for European Adventure has been confirmed. Travel dates: Jun 10 – Jun 20.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "ai",
    title: "AI Recommendation Ready",
    message: "Based on your travel history, we've found 3 new destinations you might love. Check them out!",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "promo",
    title: "Limited Time Offer 🎉",
    message: "Use code SUMMER25 for 25% off all beach packages this week only. Expires in 48 hours.",
    time: "1 day ago",
    read: false,
  },
  {
    id: "4",
    type: "system",
    title: "Profile Updated",
    message: "Your profile information has been successfully updated.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "5",
    type: "booking",
    title: "Payment Received",
    message: "We've received your payment of $2,499 for the Bali Paradise package. Invoice sent to your email.",
    time: "3 days ago",
    read: true,
  },
  {
    id: "6",
    type: "alert",
    title: "Trip Reminder",
    message: "Your trip to Tokyo starts in 7 days! Make sure your documents are ready.",
    time: "4 days ago",
    read: true,
  },
  {
    id: "7",
    type: "ai",
    title: "Itinerary Generated",
    message: "Your AI-generated 7-day Bali itinerary is ready. View and customize it in the AI Planner.",
    time: "5 days ago",
    read: true,
  },
  {
    id: "8",
    type: "promo",
    title: "New Packages Available",
    message: "12 new packages have been added to Southeast Asia. Prices start from $599.",
    time: "1 week ago",
    read: true,
  },
];

const filters = ["all", "booking", "ai", "promo", "system", "alert"] as const;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL);
  const [activeFilter, setActiveFilter] = useState<"all" | NotifType>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = activeFilter === "all"
    ? notifications
    : notifications.filter((n) => n.type === activeFilter);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const deleteNotif = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const clearAll = () => setNotifications([]);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell size={22} />
            Notifications
            {unreadCount > 0 && (
              <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-brand-600 text-white">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-brand-600/20 text-brand-300 hover:bg-brand-600/30 transition-colors"
            >
              <Check size={14} />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <Trash2 size={14} />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const count = f === "all" ? notifications.length : notifications.filter((n) => n.type === f).length;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors ${
                activeFilter === f
                  ? "bg-brand-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {f} <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <BellOff size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-300 font-medium">No notifications</p>
          <p className="text-slate-500 text-sm mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((notif, i) => {
            const cfg = typeConfig[notif.type];
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => markRead(notif.id)}
                className={`relative flex gap-4 p-4 rounded-2xl border cursor-pointer transition-all group ${
                  notif.read
                    ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                    : "bg-slate-900 border-brand-500/30 hover:border-brand-500/50"
                }`}
              >
                {/* Unread dot */}
                {!notif.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-500" />
                )}

                {/* Icon */}
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg} ${cfg.color}`}>
                  {cfg.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`font-semibold text-sm ${notif.read ? "text-slate-300" : "text-white"}`}>
                      {notif.title}
                    </p>
                    <span className="text-xs text-slate-600 shrink-0">{notif.time}</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">{notif.message}</p>
                </div>

                {/* Delete on hover */}
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                  className="absolute top-3 right-3 p-1 rounded-lg opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <Trash2 size={13} />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
