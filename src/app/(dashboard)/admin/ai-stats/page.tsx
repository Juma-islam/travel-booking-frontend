"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader, CheckCircle, XCircle, Clock, Zap, TrendingUp } from "lucide-react";
import { adminApi } from "@/services/api.service";

const endpointColors: Record<string, string> = {
  recommendations: "bg-brand-500",
  itinerary: "bg-cyan-500",
  budget: "bg-green-500",
  chatbot: "bg-purple-500",
  "review-summary": "bg-amber-500",
  general: "bg-slate-500",
};

export default function AdminAIStatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAIStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Loader className="animate-spin text-brand-500" size={32} />
    </div>
  );

  if (!stats) return (
    <div className="text-center py-24 text-slate-400">Failed to load AI stats</div>
  );

  const kpis = [
    { label: "Total API Calls", value: stats.totalCalls, icon: <Zap size={20} />, color: "text-brand-400", bg: "bg-brand-500/10" },
    { label: "Success Rate", value: `${stats.successRate}%`, icon: <CheckCircle size={20} />, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Failed Calls", value: stats.failedCalls, icon: <XCircle size={20} />, color: "text-red-400", bg: "bg-red-500/10" },
    { label: "Avg Response", value: `${stats.avgResponseTime}ms`, icon: <Clock size={20} />, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { label: "Total Tokens", value: stats.totalTokens.toLocaleString(), icon: <Sparkles size={20} />, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Successful", value: stats.successCalls, icon: <TrendingUp size={20} />, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles size={22} className="text-brand-400" />
          AI Usage Statistics
        </h1>
        <p className="text-slate-400 mt-1 text-sm">Gemini API usage across all features</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((k, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className={`inline-flex p-2.5 rounded-xl ${k.bg} ${k.color} mb-3`}>{k.icon}</div>
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-slate-400 text-sm mt-1">{k.label}</p>
          </motion.div>
        ))}
      </div>

      {/* By Endpoint */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-6 flex items-center gap-2">
          <Zap size={18} className="text-brand-400" />
          Usage by Endpoint
        </h2>
        {stats.byEndpoint.length === 0 ? (
          <p className="text-slate-500 text-sm">No data yet</p>
        ) : (
          <div className="space-y-4">
            {stats.byEndpoint.map((ep: any, i: number) => {
              const maxCount = Math.max(...stats.byEndpoint.map((e: any) => e.count));
              const pct = maxCount > 0 ? (ep.count / maxCount) * 100 : 0;
              const color = endpointColors[ep._id] || "bg-slate-500";
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                      <span className="text-slate-300 capitalize">{ep._id}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500 text-xs">
                      <span>{ep.count} calls</span>
                      <span>{Math.round(ep.avgTime)}ms avg</span>
                      <span>{ep.tokens.toLocaleString()} tokens</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                      className={`h-full ${color} rounded-full`} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Daily Usage */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-6 flex items-center gap-2">
          <TrendingUp size={18} className="text-green-400" />
          Daily Usage (Last 7 Days)
        </h2>
        {stats.dailyUsage.length === 0 ? (
          <p className="text-slate-500 text-sm">No data for the last 7 days</p>
        ) : (
          <div className="space-y-3">
            {stats.dailyUsage.map((day: any, i: number) => {
              const maxCount = Math.max(...stats.dailyUsage.map((d: any) => d.count));
              const pct = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
              return (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-slate-400 text-sm w-24 shrink-0">{day._id}</span>
                  <div className="flex-1 h-7 bg-slate-800 rounded-xl overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, delay: i * 0.1 }}
                      className="h-full bg-gradient-to-r from-brand-600 to-cyan-500 rounded-xl flex items-center justify-end pr-3">
                      {pct > 20 && <span className="text-white text-xs font-medium">{day.count}</span>}
                    </motion.div>
                  </div>
                  {pct <= 20 && <span className="text-brand-400 text-sm font-medium w-8 shrink-0">{day.count}</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
