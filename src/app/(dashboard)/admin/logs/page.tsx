"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, RefreshCw, Loader, CalendarCheck, Users, Star, Sparkles, Filter } from "lucide-react";
import { adminApi } from "@/services/api.service";

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  booking: { icon: <CalendarCheck size={14} />, color: "text-green-400", bg: "bg-green-500/10" },
  user: { icon: <Users size={14} />, color: "text-brand-400", bg: "bg-brand-500/10" },
  review: { icon: <Star size={14} />, color: "text-amber-400", bg: "bg-amber-500/10" },
  ai: { icon: <Sparkles size={14} />, color: "text-purple-400", bg: "bg-purple-500/10" },
};

const statusDot: Record<string, string> = {
  success: "bg-green-500",
  error: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-brand-500",
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [limit, setLimit] = useState(50);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getLogs(limit);
      setLogs(data);
    } catch { setLogs([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [limit]);

  const filtered = filter === "all" ? logs : logs.filter((l) => l.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity size={22} className="text-cyan-400" />
            System Logs
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Real-time activity across the platform</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter size={15} className="text-slate-500" />
        {["all", "booking", "user", "review", "ai"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors ${filter === f ? "bg-brand-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
            {f}
          </button>
        ))}
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}
          className="ml-auto bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-300 text-xs focus:outline-none">
          <option value={25}>Last 25</option>
          <option value={50}>Last 50</option>
          <option value={100}>Last 100</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader className="animate-spin text-brand-500" size={32} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <Activity size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400">No logs found</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="divide-y divide-slate-800/50">
            {filtered.map((log, i) => {
              const cfg = typeConfig[log.type] || typeConfig.ai;
              return (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="flex items-start gap-4 px-5 py-3.5 hover:bg-slate-800/30 transition-colors">
                  {/* Type icon */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg} ${cfg.color}`}>
                    {cfg.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{log.message}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{log.detail}</p>
                  </div>

                  {/* Status + time */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className={`w-2 h-2 rounded-full ${statusDot[log.status] || "bg-slate-500"}`} />
                    <span className="text-slate-600 text-xs">
                      {new Date(log.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
