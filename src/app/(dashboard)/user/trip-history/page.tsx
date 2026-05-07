"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  History,
  MapPin,
  CalendarCheck,
  Star,
  DollarSign,
  Loader,
  ArrowRight,
  CheckCircle,
  Users,
  Plane,
} from "lucide-react";
import { bookingApi, Booking } from "@/services/api.service";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface RatingState {
  [bookingId: string]: number;
}

export default function TripHistoryPage() {
  const [trips, setTrips] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<RatingState>({});
  const [ratedIds, setRatedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    bookingApi
      .getMyBookings()
      .then((all) => setTrips(all.filter((b) => b.status === "completed")))
      .catch(() => setTrips([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRate = (bookingId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [bookingId]: rating }));
  };

  const submitRating = (booking: Booking) => {
    const rating = ratings[booking._id];
    if (!rating) return;
    setRatedIds((prev) => new Set([...prev, booking._id]));
    showToast(`Thanks for rating ${booking.packageItem?.title || "your trip"}!`);
  };

  const totalSpent = trips.reduce((sum, t) => sum + t.totalPrice, 0);
  const avgRating =
    Object.values(ratings).length > 0
      ? (Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length).toFixed(1)
      : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <History size={22} className="text-brand-400" />
          Trip History
        </h1>
        <p className="text-slate-400 mt-1">All your completed travel adventures.</p>
      </div>

      {/* Stats */}
      {!loading && trips.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Trips Completed",
              value: trips.length,
              icon: <Plane size={18} className="text-brand-400" />,
              color: "text-white",
            },
            {
              label: "Total Spent",
              value: `$${totalSpent.toLocaleString()}`,
              icon: <DollarSign size={18} className="text-green-400" />,
              color: "text-green-300",
            },
            {
              label: "Destinations",
              value: new Set(trips.map((t) => t.packageItem?.destination?.name).filter(Boolean)).size,
              icon: <MapPin size={18} className="text-cyan-400" />,
              color: "text-cyan-300",
            },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-xl">{stat.icon}</div>
              <div>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-slate-500 text-xs">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader className="animate-spin text-brand-500" size={32} />
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-24 bg-slate-900 border border-slate-800 rounded-2xl">
          <History size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-300 font-medium text-lg">No completed trips yet</p>
          <p className="text-slate-500 text-sm mt-1">Your completed adventures will appear here.</p>
          <Link
            href="/explore"
            className="mt-5 inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            Explore Packages <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip, i) => {
            const isRated = ratedIds.has(trip._id);
            const currentRating = ratings[trip._id] || 0;

            return (
              <motion.div
                key={trip._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row gap-4 p-5">
                  {/* Image */}
                  <div className="w-full sm:w-36 h-36 rounded-xl overflow-hidden bg-slate-800 shrink-0 relative">
                    <img
                      src={trip.packageItem?.images?.[0] || "/api/placeholder/144/144"}
                      alt={trip.packageItem?.title || "Trip"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                    <span className="absolute bottom-2 left-2 flex items-center gap-1 bg-green-500/90 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      <CheckCircle size={10} /> Completed
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-white text-base">
                          {trip.packageItem?.title || "Travel Package"}
                        </h3>
                        {trip.packageItem?.destination?.name && (
                          <p className="text-slate-400 text-sm mt-0.5 flex items-center gap-1">
                            <MapPin size={12} />
                            {trip.packageItem.destination.name}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 text-xs text-slate-500">
                        #{trip._id.slice(-8).toUpperCase()}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <CalendarCheck size={13} />
                        {new Date(trip.startDate).toLocaleDateString()} &rarr;{" "}
                        {new Date(trip.endDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users size={13} />
                        {trip.guests} guest{trip.guests > 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1.5 text-green-400 font-medium">
                        <DollarSign size={13} />
                        ${trip.totalPrice.toLocaleString()}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-3">
                      {isRated ? (
                        <div className="flex items-center gap-2 text-sm text-amber-400">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={14}
                                className={s <= (ratings[trip._id] || 0) ? "fill-amber-400 text-amber-400" : "text-slate-600"}
                              />
                            ))}
                          </div>
                          <span className="text-slate-400 text-xs">Thanks for your rating!</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Rate this trip:</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                onClick={() => handleRate(trip._id, s)}
                                className="transition-transform hover:scale-110"
                              >
                                <Star
                                  size={16}
                                  className={
                                    s <= currentRating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-slate-600 hover:text-amber-400"
                                  }
                                />
                              </button>
                            ))}
                          </div>
                          {currentRating > 0 && (
                            <button
                              onClick={() => submitRating(trip)}
                              className="text-xs px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors"
                            >
                              Submit
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-xl text-sm">
          <CheckCircle size={16} className="text-green-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
