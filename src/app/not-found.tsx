"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plane, Home, ArrowLeft, Compass, MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Animated plane */}
        <motion.div
          animate={{ x: [0, 30, -10, 20, 0], y: [0, -20, 10, -15, 0], rotate: [0, 5, -3, 4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex mb-8"
        >
          <div className="bg-brand-600/20 border border-brand-500/30 p-6 rounded-3xl">
            <Plane size={56} className="text-brand-400 -rotate-45" />
          </div>
        </motion.div>

        {/* 404 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-[120px] md:text-[160px] font-bold leading-none bg-gradient-to-br from-brand-400 to-accent-400 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-4">
            Destination Not Found
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto">
            Looks like this page took a wrong turn. The destination you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-6 py-3.5 rounded-xl font-semibold transition-colors"
            >
              <Home size={18} />
              Back to Home
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 border border-slate-700 hover:border-brand-500 text-slate-300 hover:text-white px-6 py-3.5 rounded-xl font-semibold transition-colors"
            >
              <Compass size={18} />
              Explore Destinations
            </Link>
          </div>
        </motion.div>

        {/* Floating dots */}
        <div className="mt-16 flex justify-center gap-3">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 rounded-full bg-brand-500/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
