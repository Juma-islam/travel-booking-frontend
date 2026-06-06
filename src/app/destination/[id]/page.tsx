"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Clock, Star, Users, CheckCircle, ArrowLeft,
  Tag, Shield, Loader, AlertCircle, Sparkles, Globe, Filter,
  ArrowRight, Search
} from "lucide-react";
import { TravelPackage } from "../../../types/package";

interface Destination {
  _id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  isTrending: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const CATEGORIES = ["All", "solo", "family", "couple", "adventure", "relaxation"];

export default function DestinationDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        // 1. Fetch Destination Details
        const destRes = await fetch(`${API_BASE}/api/destinations/${id}`, { cache: "no-store" });
        if (!destRes.ok) throw new Error("Destination details not found");
        const destData: Destination = await destRes.json();
        setDestination(destData);

        // 2. Fetch Packages for this Destination
        const pkgsRes = await fetch(`${API_BASE}/api/packages?destination=${id}&pageSize=100`, { cache: "no-store" });
        if (pkgsRes.ok) {
          const pkgsData = await pkgsRes.json();
          setPackages(pkgsData.packages || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load destination details");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Filter packages based on category
  const filteredPackages = useMemo(() => {
    if (selectedCategory === "All") return packages;
    return packages.filter((pkg) => pkg.category?.toLowerCase() === selectedCategory.toLowerCase());
  }, [packages, selectedCategory]);

  // Calculate statistics for the destination
  const stats = useMemo(() => {
    if (packages.length === 0) return { avgPrice: 0, avgRating: 4.5, totalReviews: 0 };
    const total = packages.reduce((acc, p) => acc + p.price, 0);
    const ratingSum = packages.reduce((acc, p) => acc + (p.rating || 0), 0);
    const reviewSum = packages.reduce((acc, p) => acc + (p.numReviews || 0), 0);
    return {
      avgPrice: Math.round(total / packages.length),
      avgRating: Number((ratingSum / packages.length).toFixed(1)),
      totalReviews: reviewSum,
    };
  }, [packages]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-brand-500 mx-auto mb-4" size={36} />
          <p className="text-slate-400">Loading destination details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !destination) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Destination Not Found</h2>
          <p className="text-slate-400 mb-6">{error || "This destination details could not be loaded."}</p>
          <Link href="/explore"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-3 rounded-xl font-medium transition-colors shadow-lg">
            <ArrowLeft size={16} /> Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative h-[60vh] min-h-[450px] overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          <img 
            src={destination.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200"} 
            alt={destination.name} 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        </div>

        {/* Floating Back Button */}
        <div className="absolute top-28 left-6 md:left-12 z-20">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-slate-950/80 backdrop-blur border border-slate-800 hover:border-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-900 transition-all shadow-xl"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="bg-brand-600/90 backdrop-blur px-4 py-1.5 rounded-full text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 uppercase tracking-wider">
                <MapPin size={12} /> {destination.country}
              </span>
              {destination.isTrending && (
                <span className="bg-amber-500/90 backdrop-blur px-4 py-1.5 rounded-full text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles size={12} /> Trending
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-xl mb-3">
              {destination.name}
            </h1>
            <p className="text-slate-300 text-lg font-medium leading-relaxed drop-shadow-md">
              {destination.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS BAR & DESCRIPTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 -mt-6">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="flex flex-col justify-center pt-4 md:pt-0">
              <span className="text-3xl md:text-4xl font-black text-white">{packages.length}</span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1.5">Available Packages</span>
            </div>
            <div className="flex flex-col justify-center pt-4 md:pt-0">
              <span className="text-3xl md:text-4xl font-black text-white">
                {stats.avgPrice > 0 ? `$${stats.avgPrice.toLocaleString()}` : "—"}
              </span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1.5">Average Starting Price</span>
            </div>
            <div className="flex flex-col justify-center pt-4 md:pt-0">
              <span className="text-3xl md:text-4xl font-black text-white flex items-center justify-center gap-1.5">
                {stats.avgRating} <Star size={20} className="fill-amber-400 text-amber-400" />
              </span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1.5">Rating</span>
            </div>
            <div className="flex flex-col justify-center pt-4 md:pt-0">
              <span className="text-3xl md:text-4xl font-black text-white">{stats.totalReviews}</span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1.5">Total Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AVAILABLE PACKAGES SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-slate-900 pb-6">
          <div>
            <span className="text-brand-400 font-bold tracking-widest uppercase text-xs mb-2 block">Our Offerings</span>
            <h2 className="text-3xl md:text-4xl font-black text-white">Packages in {destination.name}</h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-500/25"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Packages List */}
        <AnimatePresence mode="wait">
          {filteredPackages.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-20 bg-slate-900/40 border border-slate-800/80 rounded-[2.5rem] p-8"
            >
              <Search size={48} className="mx-auto text-slate-600 mb-4 animate-bounce" />
              <h3 className="text-xl font-bold text-white mb-2">No Packages Found</h3>
              <p className="text-slate-400 max-w-md mx-auto mb-6">
                There are no packages under the category "{selectedCategory}" in {destination.name} right now. Check out other categories or explore all deals.
              </p>
              <button 
                onClick={() => setSelectedCategory("All")}
                className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Clear Filter
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPackages.map((pkg, i) => {
                const mainImg = pkg.images?.[0] || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800";
                return (
                  <motion.div
                    key={pkg._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="bg-slate-900 border border-slate-800/80 rounded-[2rem] overflow-hidden flex flex-col group hover:border-brand-500/40 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 hover:-translate-y-1.5"
                  >
                    {/* Card Image */}
                    <div className="relative h-60 overflow-hidden">
                      <img 
                        src={mainImg} 
                        alt={pkg.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                      
                      <div className="absolute top-4 left-4 flex gap-1.5">
                        <span className="bg-brand-600/90 backdrop-blur text-white text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-full tracking-wider border border-white/10 shadow-lg">
                          {pkg.category}
                        </span>
                        {pkg.isPopular && (
                          <span className="bg-amber-500/90 backdrop-blur text-slate-950 text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-full tracking-wider border border-white/10 shadow-lg">
                            ★ Popular
                          </span>
                        )}
                      </div>

                      <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur text-amber-400 font-bold px-3 py-1.5 rounded-full text-xs flex items-center gap-1 shadow-lg border border-slate-800">
                        <Star size={14} className="fill-current" /> 
                        <span className="text-white">{pkg.rating?.toFixed(1) || "4.5"}</span>
                      </div>

                      <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-lg text-white text-xs font-bold flex items-center gap-2 border border-slate-800/80">
                        <Clock size={14} className="text-cyan-400" /> 
                        {pkg.duration?.days || 1}D / {pkg.duration?.nights || 1}N
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-brand-400 transition-colors leading-tight">
                          {pkg.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-6 line-clamp-3">
                          {pkg.description}
                        </p>

                        {/* Inclusions */}
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {(pkg.inclusions || []).slice(0, 3).map((inc, index) => (
                            <span 
                              key={index} 
                              className="bg-slate-800 text-slate-300 text-[11px] px-3 py-1.5 rounded-lg font-semibold border border-slate-800/40"
                            >
                              {inc}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-5 border-t border-slate-800/60">
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Starting from</p>
                          <p className="text-2xl font-black text-white">${pkg.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link 
                            href={`/package/${pkg._id}`} 
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors border border-slate-700"
                          >
                            Details
                          </Link>
                          <Link 
                            href={`/booking?packageId=${pkg._id}`} 
                            className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-lg shadow-brand-500/20"
                          >
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 4. CHOOSE OTHER DESTINATIONS CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-24">
        <div className="bg-gradient-to-br from-brand-600/80 to-cyan-700/80 rounded-[3rem] p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
          
          <h2 className="text-3xl md:text-5xl font-black mb-4 relative z-10 drop-shadow-md">
            Want to see more of the world?
          </h2>
          <p className="text-base md:text-lg text-brand-100 mb-8 max-w-2xl mx-auto relative z-10 font-medium">
            Explore and customize your packages with AI-curated suggestions or browse all of our trending locations globally.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10">
            <Link 
              href="/explore" 
              className="w-full sm:w-auto bg-white text-slate-900 font-extrabold px-8 py-4 rounded-xl hover:bg-slate-100 transition-colors shadow-xl flex items-center justify-center gap-2 text-sm"
            >
              Browse All Packages <ArrowRight size={16} />
            </Link>
            <Link 
              href="/ai-planner" 
              className="w-full sm:w-auto bg-slate-950/40 backdrop-blur-md text-white font-extrabold px-8 py-4 rounded-xl border border-white/20 hover:bg-slate-950/60 transition-colors shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              <Sparkles size={16} className="text-amber-400" /> Start AI Planner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
