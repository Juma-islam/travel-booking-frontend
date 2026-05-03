"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Search, MapPin, Filter, Heart, Star, Sparkles, Globe, Clock, X } from "lucide-react";
import { fetchPackages } from "../../services/package.service";
import { TravelPackage } from "../../types/package";

const categories = ["All", "solo", "family", "couple", "adventure", "relaxation"];
const sortOptions = ["Recommended", "Price: Low to High", "Price: High to Low", "Rating"];

export default function ExplorePage() {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [budgetRange, setBudgetRange] = useState([0, 2500]);
  const [sortOption, setSortOption] = useState("Recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPackages = async () => {
      setLoading(true);
      try {
        const response = await fetchPackages();
        setPackages(response.packages || []);
      } catch {
        setError("Could not load packages. Please make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  const filteredDestinations = useMemo(() => {
    let results = packages;

    if (selectedCategory !== "All") {
      results = results.filter(dest => dest.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchTerm.trim()) {
      results = results.filter(dest =>
        dest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.destination?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.destination?.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    results = results.filter(dest => dest.price >= budgetRange[0] && dest.price <= budgetRange[1]);

    if (sortOption === "Price: Low to High") {
      results = [...results].sort((a, b) => a.price - b.price);
    } else if (sortOption === "Price: High to Low") {
      results = [...results].sort((a, b) => b.price - a.price);
    } else if (sortOption === "Rating") {
      results = [...results].sort((a, b) => b.rating - a.rating);
    }

    return results;
  }, [searchTerm, selectedCategory, budgetRange, sortOption, packages]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
      <div className="container mx-auto px-4 md:px-6 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-4xl bg-linear-to-r from-brand-600 via-indigo-600 to-cyan-600 p-10 shadow-2xl shadow-brand-500/20 text-white overflow-hidden"
        >
          <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                <Sparkles className="text-white" size={18} />
                AI-powered Explore
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-tight lg:text-5xl">
                Discover curated travel experiences with intelligent search
              </h1>
              <p className="mt-4 max-w-2xl text-base text-white/80">
                Filter by budget, vibe, rating and category. Explore top destinations with immersive visuals and instant recommendations.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/10 p-6 backdrop-blur border border-white/10">
                  <div className="flex items-center gap-3 text-2xl font-semibold">
                    <Star className="text-yellow-300" size={28} />
                    <span>4.8+</span>
                  </div>
                  <p className="mt-3 text-sm text-white/80">Top rated recommendations</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-6 backdrop-blur border border-white/10">
                  <div className="flex items-center gap-3 text-2xl font-semibold">
                    <Globe className="text-cyan-200" size={28} />
                    <span>120+</span>
                  </div>
                  <p className="mt-3 text-sm text-white/80">Unique destinations worldwide</p>
                </div>
              </div>
            </div>

            <div className="rounded-4xl bg-white/10 p-6 backdrop-blur border border-white/10 shadow-[0_30px_80px_rgba(255,255,255,0.08)]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-white/70">Featured AI Picks</p>
                  <h2 className="text-2xl font-bold">Instant match</h2>
                </div>
                <button className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25 transition">
                  Explore
                </button>
              </div>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4200, disableOnInteraction: false }}
                loop
                className="rounded-[1.75rem] overflow-hidden"
              >
                {packages.slice(0, 3).map(pkg => (
                  <SwiperSlide key={pkg._id}>
                    <div className="relative h-72 w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={pkg.images?.[0] || '/api/placeholder/800/600'} alt={pkg.title} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <div className="text-sm uppercase tracking-[0.28em] text-white/80">{pkg.destination?.name || 'Destination'}</div>
                        <h3 className="mt-3 text-2xl font-bold">{pkg.title}</h3>
                        <p className="mt-2 text-sm text-white/80">{pkg.duration?.days} Days • {pkg.rating?.toFixed(1)} ⭐</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-10 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]"
        >
          <section className="rounded-4xl bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Find your next destination</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                  Search by city, experience, or travel vibe and refine results instantly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(prev => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-900 dark:text-white transition hover:border-brand-500"
              >
                <Filter size={18} />
                {showFilters ? "Hide" : "Show"} Filters
              </button>
            </div>

            {loading && (
              <div className="rounded-4xl border border-slate-200 bg-slate-50 p-4 text-center text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                Loading packages from MongoDB...
              </div>
            )}
            {error && (
              <div className="rounded-4xl border border-rose-200 bg-rose-50 p-4 text-center text-rose-700 dark:border-rose-700 dark:bg-rose-950/20 dark:text-rose-200">
                {error}
              </div>
            )}
            <div className="mt-6 grid gap-4 md:grid-cols-[1fr,0.8fr]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-4 text-slate-400" size={18} />
                <input
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search for destinations, themes, or locations"
                  className="w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-12 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 transition"
                />
              </div>
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                <div className="flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span>Budget cap</span>
                  <span className="font-semibold text-slate-900 dark:text-white">${budgetRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="100"
                  value={budgetRange[1]}
                  onChange={e => setBudgetRange([0, Number(e.target.value)])}
                  className="mt-4 w-full accent-brand-600"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {categories.map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    selectedCategory === category ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {showFilters && (
              <div className="mt-6 rounded-[1.75rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Sort by</p>
                    <select
                      value={sortOption}
                      onChange={e => setSortOption(e.target.value)}
                      className="mt-3 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white"
                    >
                      {sortOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Popular themes</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {['Family', 'Honeymoon', 'Wellness', 'Nature', 'City Life'].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSearchTerm(tag)}
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-brand-600 hover:text-brand-600 transition dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Showing {filteredDestinations.length} experiences</p>
                <h2 className="text-3xl font-bold">Top travel packages</h2>
              </div>
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                  <MapPin size={18} />
                  <span>Available in 24 regions</span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {filteredDestinations.length > 0 ? (
                filteredDestinations.map(dest => (
                  <motion.article
                    key={dest._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="group rounded-4xl bg-white dark:bg-slate-900 overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800"
                  >
                    <div className="relative h-80 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={dest.images?.[0] || '/api/placeholder/400/250'} alt={dest.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                      <button className="absolute top-5 right-5 inline-flex items-center justify-center rounded-full bg-white/90 p-3 text-slate-900 shadow-lg backdrop-blur transition hover:bg-white">
                        <Heart size={18} />
                      </button>
                      <div className="absolute bottom-5 left-5 text-white">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/80">
                          <span>{dest.category}</span>
                          <span>•</span>
                          <span>{dest.duration?.days}d / {dest.duration?.nights}n</span>
                        </div>
                        <h3 className="mt-3 text-2xl font-bold">{dest.title}</h3>
                        <p className="mt-2 text-sm text-white/80">{dest.destination?.name}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2">
                        {(dest.inclusions || []).slice(0, 3).map((tag: string) => (
                          <span key={tag} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-6 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Starting from</p>
                          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">${dest.price}</p>
                        </div>
                        <div className="rounded-3xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                          {dest.rating?.toFixed(1)} ⭐ ({dest.numReviews || 0})
                        </div>
                      </div>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link href={`/package/${dest._id}`} className="rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
                          Book Now
                        </Link>
                        <button
                          type="button"
                          onClick={() => setSelectedPackage(dest)}
                          className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          Quick View
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))
              ) : (
                <div className="rounded-4xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
                  <p className="text-xl font-semibold">No packages found</p>
                  <p className="mt-3 text-slate-500 dark:text-slate-400">Try changing your filters or search terms to discover more travel experiences.</p>
                </div>
              )}
            </div>
          </section>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-16 px-4 md:px-6"
      >
        <div className="container mx-auto rounded-4xl bg-brand-600 p-10 text-white shadow-2xl shadow-brand-500/20">
          <div className="grid gap-8 lg:grid-cols-3">
            <div>
              <span className="text-sm uppercase tracking-[0.3em] text-brand-100/80">AI boosted</span>
              <h2 className="mt-4 text-3xl font-bold">Need help choosing your next trip?</h2>
              <p className="mt-4 text-slate-100/85">Our intelligent search engine suggests the best travel packages based on your mood, dates, and budget.</p>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-white/10 p-6">
                <div className="flex items-center gap-3 text-white/90">
                  <Clock size={20} />
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em]">Fast results</p>
                    <p className="mt-1 text-base">Instant search and booking recommendations.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl bg-white/10 p-6">
                <div className="flex items-center gap-3 text-white/90">
                  <MapPin size={20} />
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em]">Smart filtering</p>
                    <p className="mt-1 text-base">Budget, rating, and category filters with one click.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Link href="/register" className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                <Sparkles size={20} />
                Start planning your trip
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-4xl bg-white text-slate-900 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedPackage(null)}
              className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-900 shadow-lg transition hover:bg-slate-200"
            >
              <X size={20} />
            </button>
            <div className="grid gap-6 p-8 md:grid-cols-[1.05fr,0.95fr]">
              <div className="rounded-3xl overflow-hidden bg-slate-950 text-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedPackage.images?.[0] || '/api/placeholder/800/600'} alt={selectedPackage.title} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{selectedPackage.destination?.country}</p>
                  <h2 className="mt-4 text-4xl font-bold">{selectedPackage.title}</h2>
                  <p className="mt-3 text-slate-600">{selectedPackage.destination?.name} • {selectedPackage.duration?.days} Days, {selectedPackage.duration?.nights} Nights</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {(selectedPackage.inclusions || []).slice(0, 4).map((item: string) => (
                    <span key={item} className="rounded-full border border-brand-600 bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-slate-700">{selectedPackage.description}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 p-5">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Price</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">${selectedPackage.price}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 p-5">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Rating</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{selectedPackage.rating?.toFixed(1) || '0.0'} ⭐</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/package/${selectedPackage._id}`} className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
                    View Package
                  </Link>
                  <Link href={`/booking?packageId=${selectedPackage._id}`} className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
