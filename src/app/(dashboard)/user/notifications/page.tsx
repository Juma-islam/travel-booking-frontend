"use client";

import { useEffect, useState } from "react";
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
  Loader,
} from "lucide-react";
import { notificationApi, BackendNotification } from "../../../../services/api.service";

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

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

const filters = ["all", "booking", "ai", "promo", "system", "alert"] as const;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<BackendNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | NotifType>("all");

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationApi.getMyNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = activeFilter === "all"
    ? notifications
    : notifications.filter((n) => n.type === activeFilter);

  const markAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const markRead = async (id: string) => {
    const notif = notifications.find((n) => n._id === id);
    if (notif?.read) return;
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotif = async (id: string) => {
    try {
      await notificationApi.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const clearAll = async () => {
    try {
      await notificationApi.deleteAllNotifications();
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

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
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader className="animate-spin text-brand-400" size={32} />
        </div>
      ) : filtered.length === 0 ? (
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
                key={notif._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => markRead(notif._id)}
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
                    <span className="text-xs text-slate-600 shrink-0">{timeAgo(notif.createdAt)}</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">{notif.message}</p>
                </div>

                {/* Delete on hover */}
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNotif(notif._id); }}
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
