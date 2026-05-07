"use client";

import { motion } from "framer-motion";
import { Wrench, Clock, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.1),transparent_70%)]" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative text-center max-w-lg">
        <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="inline-flex p-5 bg-brand-600/20 border border-brand-500/30 rounded-3xl mb-8">
          <Wrench size={48} className="text-brand-400" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Under Maintenance</h1>
        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
          We're making VoyageAI even better. We'll be back shortly with new features and improvements.
        </p>
        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-10">
          <Clock size={16} className="text-brand-400" />
          <span>Expected back in a few hours</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <p className="text-slate-400 text-sm mb-4">Get notified when we're back:</p>
          <div className="flex gap-3">
            <input type="email" placeholder="your@email.com"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-500 focus:outline-none" />
            <button className="px-4 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
              <Mail size={15} /> Notify
            </button>
          </div>
        </div>
        <Link href="/" className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm transition-colors">
          <ArrowRight size={15} /> Go to Homepage
        </Link>
      </motion.div>
    </div>
  );
}
