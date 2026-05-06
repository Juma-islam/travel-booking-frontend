"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Suspense } from "react";

function CancelContent() {
  const params = useSearchParams();
  const bookingId = params.get("bookingId");

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl"
      >
        <div className="inline-flex p-4 bg-red-500/10 rounded-2xl mb-5">
          <XCircle size={48} className="text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Payment Cancelled</h1>
        <p className="text-slate-400 mb-6">
          Your payment was cancelled. Your booking is still saved — you can complete payment anytime.
        </p>

        <div className="space-y-3">
          {bookingId && (
            <Link
              href={`/booking?packageId=${bookingId}`}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-colors"
            >
              <RefreshCw size={18} />
              Try Again
            </Link>
          )}
          <Link
            href="/user/bookings"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            View My Bookings
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function BookingCancelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <CancelContent />
    </Suspense>
  );
}
