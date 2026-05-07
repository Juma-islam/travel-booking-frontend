"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Send,
  Users,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Tag,
  CalendarCheck,
  Shield,
  Loader,
  BellRing,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const NOTIFICATION_TYPES = [
  { value: "system", label: "System", icon: <Shield size={14} />, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/30" },
  { value: "promo", label: "Promotion", icon: <Tag size={14} />, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
  { value: "alert", label: "Alert", icon: <AlertCircle size={14} />, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
  { value: "booking", label: "Booking", icon: <CalendarCheck size={14} />, color: "text-green-400", bg: "bg-green-500/10 border-green-500/30" },
  { value: "ai", label: "AI Update", icon: <Sparkles size={14} />, color: "text-brand-400", bg: "bg-brand-500/10 border-brand-500/30" },
];

interface SentRecord {
  id: string;
  title: string;
  message: string;
  type: string;
  count: number;
  sentAt: string;
}

export default function AdminNotificationsPage() {
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "system",
  });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [history, setHistory] = useState<SentRecord[]>([]);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;

    setSending(true);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;

      const res = await fetch(`${API_BASE}/api/admin/notifications/broadcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || "Broadcast sent successfully!", true);
        setHistory((prev) => [
          {
            id: Date.now().toString(),
            title: form.title,
            message: form.message,
            type: form.type,
            count: data.count || 0,
            sentAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        setForm({ title: "", message: "", type: "system" });
      } else {
        const err = await res.json().catch(() => ({ message: "Failed to send" }));
        showToast(err.message || "Failed to send broadcast", false);
      }
    } catch {
      // Demo mode — simulate success
      showToast("Broadcast sent (demo mode — backend not connected)", true);
      setHistory((prev) => [
        {
          id: Date.now().toString(),
          title: form.title,
          message: form.message,
          type: form.type,
          count: 0,
          sentAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setForm({ title: "", message: "", type: "system" });
    } finally {
      setSending(false);
    }
  };

  const selectedType = NOTIFICATION_TYPES.find((t) => t.value === form.type) || NOTIFICATION_TYPES[0];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BellRing size={22} className="text-brand-400" />
          Broadcast Notifications
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Send notifications to all registered users at once.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Compose Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5"
        >
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Send size={18} className="text-brand-400" />
            Compose Broadcast
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Type selector */}
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider mb-3">
                Notification Type
              </label>
              <div className="flex flex-wrap gap-2">
                {NOTIFICATION_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, type: t.value }))}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                      form.type === t.value
                        ? `${t.bg} ${t.color} border-current`
                        : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                    }`}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. New Packages Available!"
                maxLength={100}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none transition-colors text-sm"
              />
              <p className="text-xs text-slate-600 mt-1 text-right">{form.title.length}/100</p>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="Write your notification message here..."
                maxLength={500}
                required
                rows={4}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none transition-colors text-sm resize-none"
              />
              <p className="text-xs text-slate-600 mt-1 text-right">{form.message.length}/500</p>
            </div>

            {/* Preview */}
            {(form.title || form.message) && (
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Preview</p>
                <div className="flex gap-3">
                  <div
                    className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border ${selectedType.bg} ${selectedType.color}`}
                  >
                    {selectedType.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{form.title || "Notification Title"}</p>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      {form.message || "Your message will appear here..."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={sending || !form.title.trim() || !form.message.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-600/20"
            >
              {sending ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send to All Users
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Info + History */}
        <div className="space-y-5">
          {/* Info card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
              <Users size={16} className="text-brand-400" />
              Broadcast Info
            </h3>
            <div className="space-y-3 text-sm">
              {[
                { label: "Recipients", value: "All registered users" },
                { label: "Delivery", value: "Instant (in-app)" },
                { label: "Visibility", value: "User notification center" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-slate-800 last:border-0">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-300">
              ⚠️ Broadcasts are sent to all users immediately. Use responsibly.
            </div>
          </div>

          {/* Sent history */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-semibold text-white flex items-center gap-2 text-sm mb-4">
              <Bell size={16} className="text-slate-400" />
              Recent Broadcasts
            </h3>
            {history.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">No broadcasts sent yet.</p>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 5).map((item) => {
                  const cfg = NOTIFICATION_TYPES.find((t) => t.value === item.type) || NOTIFICATION_TYPES[0];
                  return (
                    <div key={item.id} className="flex gap-3 p-3 bg-slate-800/50 rounded-xl">
                      <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${cfg.bg} ${cfg.color}`}>
                        {cfg.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-xs font-semibold truncate">{item.title}</p>
                        <p className="text-slate-500 text-xs mt-0.5 truncate">{item.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-600">
                            {new Date(item.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {item.count > 0 && (
                            <span className="text-xs text-green-400">→ {item.count} users</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm border ${
              toast.ok
                ? "bg-slate-800 border-green-500/30 text-white"
                : "bg-slate-800 border-red-500/30 text-white"
            }`}
          >
            {toast.ok ? (
              <CheckCircle size={16} className="text-green-400" />
            ) : (
              <AlertCircle size={16} className="text-red-400" />
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
