"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Tag,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader,
  ArrowLeft,
  Star,
  Clock,
  MapPin,
} from "lucide-react";
import { fetchPackageById } from "../../services/package.service";
import { bookingApi } from "../../services/api.service";
import { useAuth } from "../../contexts/AuthContext";
import { TravelPackage } from "../../types/package";

export default function BookingPage() {
  const router = useRouter();
  const params = useSearchParams();
  const packageId = params.get("packageId");
  const { isAuthenticated, user } = useAuth();

  const [travelPackage, setTravelPackage] = useState<TravelPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    startDate: today,
    endDate: "",
    guests: 1,
    paymentMethod: "MockPayment",
    promoCode: "",
  });

  useEffect(() => {
    if (!packageId) { setError("Package ID is missing."); setLoading(false); return; }
    fetchPackageById(packageId)
      .then(setTravelPackage)
      .catch(() => setError("Unable to load package details."))
      .finally(() => setLoading(false));
  }, [packageId]);

  const totalPrice = travelPackage
    ? travelPackage.price * form.guests * (form.promoCode === "TRAVELAI20" ? 0.8 : 1)
    : 0;

  const discount = travelPackage
    ? travelPackage.price * form.guests - totalPrice
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { router.push("/login"); return; }
    if (!form.endDate) { setError("Please select an end date."); return; }
    if (form.endDate <= form.startDate) { setError("End date must be after start date."); return; }

    setSubmitting(true);
    setError("");
    try {
      const booking = await bookingApi.create({
        packageId: packageId!,
        startDate: form.startDate,
        endDate: form.endDate,
        guests: form.guests,
        paymentMethod: form.paymentMethod,
        promoCode: form.promoCode || undefined,
      });
      setSuccess(`Booking confirmed! ID: #${booking._id.slice(-8).toUpperCase()}`);
      setTimeout(() => router.push("/user/bookings"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/explore" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Explore
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">Complete Your Booking</h1>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader className="animate-spin text-brand-500" size={32} />
          </div>
        ) : error && !travelPackage ? (
          <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            <AlertCircle size={18} /> {error}
          </div>
        ) : travelPackage ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Package Summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <img
                  src={travelPackage.images?.[0] || "/api/placeholder/800/300"}
                  alt={travelPackage.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-white">{travelPackage.title}</h2>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {travelPackage.destination?.name}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {travelPackage.duration.days}d / {travelPackage.duration.nights}n</span>
                    <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400" /> {travelPackage.rating?.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-white flex items-center gap-2"><Calendar size={18} className="text-brand-400" /> Travel Dates</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Start Date</label>
                    <input
                      type="date"
                      required
                      min={today}
                      value={form.startDate}
                      onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">End Date</label>
                    <input
                      type="date"
                      required
                      min={form.startDate || today}
                      value={form.endDate}
                      onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Guests */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h3 className="font-semibold text-white flex items-center gap-2 mb-4"><Users size={18} className="text-brand-400" /> Guests</h3>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setForm((p) => ({ ...p, guests: Math.max(1, p.guests - 1) }))} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg transition-colors">−</button>
                  <span className="text-2xl font-bold text-white w-8 text-center">{form.guests}</span>
                  <button type="button" onClick={() => setForm((p) => ({ ...p, guests: Math.min(20, p.guests + 1) }))} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg transition-colors">+</button>
                  <span className="text-slate-400 text-sm">person{form.guests > 1 ? "s" : ""}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h3 className="font-semibold text-white flex items-center gap-2 mb-4"><Tag size={18} className="text-brand-400" /> Promo Code</h3>
                <div className="flex gap-3">
                  <input
                    value={form.promoCode}
                    onChange={(e) => setForm((p) => ({ ...p, promoCode: e.target.value.toUpperCase() }))}
                    placeholder="e.g. TRAVELAI20"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none"
                  />
                  {form.promoCode === "TRAVELAI20" && (
                    <span className="flex items-center gap-1 text-green-400 text-sm font-medium">
                      <CheckCircle size={16} /> 20% off!
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-xs mt-2">Try: TRAVELAI20 for 20% discount</p>
              </div>

              {/* Payment */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h3 className="font-semibold text-white flex items-center gap-2 mb-4"><CreditCard size={18} className="text-brand-400" /> Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                  {["MockPayment", "Credit Card", "PayPal", "Bank Transfer"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, paymentMethod: method }))}
                      className={`px-4 py-3 rounded-xl text-sm font-medium border transition-colors ${
                        form.paymentMethod === method
                          ? "border-brand-500 bg-brand-600/20 text-brand-300"
                          : "border-slate-700 bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
                  <CheckCircle size={16} /> {success}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !!success}
                className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white py-4 rounded-xl font-semibold text-base transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? <><Loader size={18} className="animate-spin" /> Processing...</> : isAuthenticated ? "Confirm Booking" : "Login to Book"}
              </button>
            </motion.form>

            {/* Price Summary */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24"
              >
                <h3 className="font-semibold text-white mb-5">Price Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>${travelPackage.price} × {form.guests} guest{form.guests > 1 ? "s" : ""}</span>
                    <span>${(travelPackage.price * form.guests).toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Promo discount (20%)</span>
                      <span>−${discount.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-800 pt-3 flex justify-between font-bold text-white text-lg">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(0)}</span>
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-xs text-slate-500">
                  <p>✓ Free cancellation within 24 hours</p>
                  <p>✓ Instant booking confirmation</p>
                  <p>✓ 24/7 AI travel support</p>
                </div>
              </motion.div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
