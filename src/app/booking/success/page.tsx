"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Loader, ArrowRight, CalendarCheck } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const bookingId = params.get("bookingId");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Give webhook time to process
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl"
      >
        {loading ? (
          <>
            <Loader className="animate-spin text-brand-400 mx-auto mb-4" size={40} />
            <h2 className="text-xl font-bold text-white mb-2">Confirming Payment...</h2>
            <p className="text-slate-400 text-sm">Please wait while we confirm your payment.</p>
          </>
        ) : (
          <>
            <div className="inline-flex p-4 bg-green-500/10 rounded-2xl mb-5">
              <CheckCircle size={48} className="text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Payment Successful! 🎉</h1>
            <p className="text-slate-400 mb-2">Your booking has been confirmed.</p>
            {bookingId && (
              <p className="text-slate-500 text-sm mb-6">
                Booking ID: <span className="text-white font-mono">#{bookingId.slice(-8).toUpperCase()}</span>
              </p>
            )}

            <div className="space-y-3">
              <Link href="/user/bookings"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-colors">
                <CalendarCheck size={18} />
                View My Bookings
              </Link>
              <Link href="/explore"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 font-medium transition-colors">
                Continue Exploring
                <ArrowRight size={16} />
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader className="animate-spin text-brand-400" size={32} />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
