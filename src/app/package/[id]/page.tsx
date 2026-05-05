"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin, Clock, Star, Users, CheckCircle, XCircle,
  ArrowLeft, Tag, Shield, Loader, AlertCircle,
} from "lucide-react";
import { TravelPackage } from "../../../types/package";
import PackageInteractions from "@/components/features/PackageInteractions";
import {
  AvailabilityBadge,
  LocationMap,
  CancellationPolicy,
  HostDetails,
  PackageFAQ,
} from "@/components/features/PackageDetailSections";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function fmt(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  }).format(value);
}

export default function PackageDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [pkg, setPkg] = useState<TravelPackage | null>(null);
  const [related, setRelated] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/packages/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Package not found");
        const data: TravelPackage = await res.json();
        setPkg(data);

        // Load related
        try {
          const relRes = await fetch(
            `${API_BASE}/api/packages?pageSize=5&category=${data.category}`,
            { cache: "no-store" }
          );
          if (relRes.ok) {
            const relData = await relRes.json();
            setRelated((relData.packages || []).filter((p: TravelPackage) => p._id !== id).slice(0, 4));
          }
        } catch { /* related optional */ }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load package");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-brand-400 mx-auto mb-4" size={36} />
          <p className="text-slate-400">Loading package details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Package Not Found</h2>
          <p className="text-slate-400 mb-6">{error || "This package doesn't exist or has been removed."}</p>
          <Link href="/explore"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-3 rounded-xl font-medium transition-colors">
            <ArrowLeft size={16} /> Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const images = pkg.images?.length ? pkg.images : ["/api/placeholder/1200/600"];
  const [mainImg, ...thumbs] = images;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <div className="relative h-[55vh] overflow-hidden">
        <img src={mainImg} alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Back */}
        <div className="absolute top-24 left-6">
          <button onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-slate-950/70 backdrop-blur border border-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-24 right-6 flex flex-col gap-2 items-end">
          <span className="px-3 py-1.5 rounded-full bg-brand-600/90 backdrop-blur text-white text-xs font-semibold capitalize">
            {pkg.category}
          </span>
          {pkg.isPopular && (
            <span className="px-3 py-1.5 rounded-full bg-amber-500/90 backdrop-blur text-white text-xs font-semibold">
              ⭐ Popular
            </span>
          )}
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <p className="text-brand-300 text-sm uppercase tracking-widest mb-2">
              {pkg.destination?.name}, {pkg.destination?.country}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">{pkg.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <Star size={15} className="text-amber-400 fill-amber-400" />
                {pkg.rating?.toFixed(1)} ({pkg.numReviews} reviews)
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={15} className="text-cyan-400" />
                {pkg.duration.days} days / {pkg.duration.nights} nights
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={15} className="text-brand-400" />
                {pkg.destination?.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

          {/* Left */}
          <div className="space-y-8">

            {/* Thumbnails */}
            {thumbs.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {thumbs.slice(0, 3).map((img, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden h-36 bg-slate-800">
                    <img src={img} alt={`${pkg.title} ${i + 2}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Tag size={18} className="text-brand-400" />
                About This Package
              </h2>
              <p className="text-slate-300 leading-relaxed">{pkg.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {[
                  { label: "Duration", value: `${pkg.duration.days}d / ${pkg.duration.nights}n`, icon: <Clock size={16} className="text-cyan-400" /> },
                  { label: "Category", value: pkg.category, icon: <Tag size={16} className="text-brand-400" /> },
                  { label: "Rating", value: `${pkg.rating?.toFixed(1)} ⭐`, icon: <Star size={16} className="text-amber-400" /> },
                  { label: "Reviews", value: `${pkg.numReviews}`, icon: <Users size={16} className="text-green-400" /> },
                ].map((s, i) => (
                  <div key={i} className="bg-slate-800/60 rounded-xl p-4 text-center">
                    <div className="flex justify-center mb-2">{s.icon}</div>
                    <p className="text-white font-bold text-sm capitalize">{s.value}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-400" />
                  What's Included
                </h3>
                <ul className="space-y-2.5">
                  {(pkg.inclusions || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0 mt-0.5 text-xs">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <XCircle size={16} className="text-red-400" />
                  Not Included
                </h3>
                <ul className="space-y-2.5">
                  {(pkg.exclusions || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5 text-xs">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Map */}
            <LocationMap pkg={pkg} />

            {/* Reviews & AI */}
            <PackageInteractions
              packageId={pkg._id}
              packageTitle={pkg.title}
              rating={pkg.rating}
              numReviews={pkg.numReviews}
              reviews={(pkg as any).reviews || []}
            />

            {/* Host + Cancellation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <HostDetails pkg={pkg} />
              <CancellationPolicy policy={(pkg as any).cancellationPolicy || "moderate"} />
            </div>

            {/* FAQ */}
            <PackageFAQ faqs={(pkg as any).faqs} />
          </div>

          {/* Right — sticky booking */}
          <div className="space-y-5">
            <div className="sticky top-24 space-y-5">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider">Starting from</p>
                    <p className="text-4xl font-bold text-white mt-1">{fmt(pkg.price)}</p>
                    <p className="text-slate-500 text-xs mt-1">per person</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-white font-semibold text-sm">{pkg.rating?.toFixed(1)}</span>
                    </div>
                    <p className="text-slate-500 text-xs">{pkg.numReviews} reviews</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    { label: "Duration", value: `${pkg.duration.days} days, ${pkg.duration.nights} nights` },
                    { label: "Destination", value: `${pkg.destination?.name}, ${pkg.destination?.country}` },
                    { label: "Category", value: pkg.category },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-800 last:border-0">
                      <span className="text-slate-400 text-sm">{item.label}</span>
                      <span className="text-white text-sm font-medium capitalize">{item.value}</span>
                    </div>
                  ))}
                </div>

                <Link href={`/booking?packageId=${pkg._id}`}
                  className="block w-full py-4 rounded-xl text-center font-bold text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 shadow-lg shadow-brand-600/25 transition-all text-base">
                  Book Now — {fmt(pkg.price)}
                </Link>

                <p className="text-center text-slate-500 text-xs mt-3 flex items-center justify-center gap-1">
                  <Shield size={12} />
                  Free cancellation · Instant confirmation
                </p>
              </div>

              <AvailabilityBadge pkg={pkg} />

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <p className="text-white font-medium text-sm">Share this package</p>
                <PackageInteractions
                  packageId={pkg._id}
                  packageTitle={pkg.title}
                  rating={pkg.rating}
                  numReviews={pkg.numReviews}
                  reviews={[]}
                  shareOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-10">
              <p className="text-brand-400 text-sm uppercase tracking-widest mb-2">Continue Exploring</p>
              <h2 className="text-3xl font-bold text-white">Similar Packages</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((r) => (
                <Link key={r._id} href={`/package/${r._id}`}
                  className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-500/10 transition-all">
                  <div className="relative h-44 overflow-hidden">
                    <img src={r.images?.[0] || "/api/placeholder/400/200"} alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-600/90 text-white text-xs font-semibold capitalize">
                      {r.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-white text-sm group-hover:text-brand-300 transition-colors line-clamp-2">{r.title}</h3>
                    <p className="text-slate-400 text-xs flex items-center gap-1"><MapPin size={11} />{r.destination?.name}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-white font-bold">{fmt(r.price)}</span>
                      <span className="text-xs text-amber-400 flex items-center gap-1">
                        <Star size={11} className="fill-amber-400" />{r.rating?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
