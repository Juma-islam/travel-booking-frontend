"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  DollarSign,
  Star,
  Clock,
  Users,
  Sparkles,
  X,
} from "lucide-react";
import { fetchPackages } from "../../services/package.service";
import { TravelPackage, PackageListResponse } from "../../types/package";

const categories = ["All", "solo", "family", "couple", "adventure", "relaxation"];
const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function PackagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get("maxPrice")) || 5000);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "recommended");
  const [showFilters, setShowFilters] = useState(false);

  const pageSize = 12;

  const loadPackages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        pageNumber: String(currentPage),
        pageSize: String(pageSize),
      });

      if (searchTerm) {
        params.append("keyword", searchTerm);
      }

      if (selectedCategory !== "All") {
        params.append("category", selectedCategory);
      }

      if (maxPrice < 5000) {
        params.append("maxPrice", String(maxPrice));
      }

      // Fetch from API directly to support pagination
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE}/api/packages?${params}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load packages");
      }

      const data: PackageListResponse = await response.json();
      let results = data.packages || [];

      // Client-side sorting
      if (sortBy === "price-low") {
        results = [...results].sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-high") {
        results = [...results].sort((a, b) => b.price - a.price);
      } else if (sortBy === "rating") {
        results = [...results].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      setPackages(results);
      setTotalPages(data.pages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load packages");
      setPackages([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedCategory, maxPrice, sortBy]);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (selectedCategory !== "All") params.append("category", selectedCategory);
    if (maxPrice < 5000) params.append("maxPrice", String(maxPrice));
    if (sortBy !== "recommended") params.append("sort", sortBy);

    const newUrl = `/packages${params.toString() ? `?${params.toString()}` : ""}`;
    router.replace(newUrl);
  }, [searchTerm, selectedCategory, maxPrice, sortBy, router]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setMaxPrice(5000);
    setSortBy("recommended");
    setCurrentPage(1);
  };

  const isFilterActive =
    searchTerm !== "" ||
    selectedCategory !== "All" ||
    maxPrice < 5000 ||
    sortBy !== "recommended";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_40%)] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-600/20 px-4 py-2 text-sm font-semibold text-brand-300 border border-brand-500/30 mb-4">
              <Sparkles size={16} />
              Discover Amazing Journeys
            </div>
            <h1 className="mt-6 text-5xl font-bold tracking-tight text-white sm:text-6xl">
              Explore Travel Packages
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Browse our curated collection of travel packages tailored to every adventure style and budget
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
          {/* Sidebar Filters */}
          <aside
            className={`space-y-6 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 h-fit sticky top-20 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search in sidebar */}
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-[0.28em] text-slate-400">
                Search
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 text-slate-500" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Package name..."
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-10 py-2.5 text-sm text-white placeholder:text-slate-500 transition focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <label className="text-sm uppercase tracking-[0.28em] text-slate-400">
                Category
              </label>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`w-full rounded-2xl px-4 py-2.5 text-sm font-medium transition text-left ${
                      selectedCategory === cat
                        ? "border border-brand-500 bg-brand-600/20 text-brand-200"
                        : "border border-slate-700 bg-slate-950/80 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm uppercase tracking-[0.28em] text-slate-400">
                  Max Price
                </label>
                <span className="text-sm font-semibold text-brand-300">
                  ${maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="500"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full accent-brand-600"
              />
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>$0</span>
                <span>$10,000</span>
              </div>
            </div>

            {/* Sort */}
            <div className="space-y-3">
              <label className="text-sm uppercase tracking-[0.28em] text-slate-400">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-sm text-white transition focus:border-brand-500 focus:outline-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {isFilterActive && (
              <button
                onClick={handleClearFilters}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
              >
                Clear all filters
              </button>
            )}
          </aside>

          {/* Main Content Area */}
          <div className="space-y-8">
            {/* Top Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Showing {packages.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} – {Math.min(currentPage * pageSize, (currentPage - 1) * pageSize + packages.length)} packages
                </p>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-600"
              >
                <Filter size={18} />
                {showFilters ? "Hide" : "Show"} Filters
              </button>
            </div>

            {/* Error State */}
            {error && (
              <div className="rounded-2xl border border-rose-800/50 bg-rose-950/30 p-4 text-rose-200">
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: pageSize }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-3xl bg-slate-800 h-96" />
                ))}
              </div>
            ) : packages.length > 0 ? (
              <>
                {/* Packages Grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {packages.map((pkg) => (
                    <motion.div
                      key={pkg._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group rounded-3xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-lg transition hover:shadow-2xl hover:shadow-brand-500/10 hover:border-slate-700"
                    >
                      <div className="relative h-56 overflow-hidden bg-slate-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={pkg.images?.[0] || "/api/placeholder/400/320"}
                          alt={pkg.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                          <div className="rounded-full bg-brand-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                            {pkg.category}
                          </div>
                          {pkg.isPopular && (
                            <div className="rounded-full bg-amber-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                              Popular
                            </div>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="absolute top-4 right-4 rounded-2xl bg-slate-950/80 px-3 py-2 backdrop-blur border border-slate-700">
                          <div className="flex items-center gap-1">
                            <Star size={16} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-semibold text-white">{pkg.rating?.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 p-6">
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-brand-300 transition line-clamp-2">
                            {pkg.title}
                          </h3>
                          <div className="mt-2 flex items-center gap-1 text-sm text-slate-400">
                            <MapPin size={16} />
                            {pkg.destination?.name}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {pkg.inclusions.slice(0, 2).map((item) => (
                            <span
                              key={item}
                              className="rounded-full bg-brand-600/20 px-2.5 py-1 text-xs font-medium text-brand-200 border border-brand-500/30"
                            >
                              {item}
                            </span>
                          ))}
                          {pkg.inclusions.length > 2 && (
                            <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300">
                              +{pkg.inclusions.length - 2} more
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-slate-300">
                            <Clock size={16} className="text-brand-400" />
                            <span>{pkg.duration.days}d / {pkg.duration.nights}n</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <Users size={16} className="text-brand-400" />
                            <span>{pkg.numReviews} reviews</span>
                          </div>
                        </div>

                        <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                              From
                            </p>
                            <p className="mt-1 text-2xl font-bold text-white">
                              ${pkg.price}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Link
                            href={`/package/${pkg._id}`}
                            className="flex-1 rounded-2xl bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-brand-500"
                          >
                            View Details
                          </Link>
                          <Link
                            href={`/booking?packageId=${pkg._id}`}
                            className="flex-1 rounded-2xl border border-brand-500/50 bg-brand-600/10 px-4 py-2.5 text-center text-sm font-semibold text-brand-200 transition hover:bg-brand-600/20"
                          >
                            Book
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/50 px-6 py-4">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm font-semibold text-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed hover:border-slate-600"
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">
                      Page
                    </span>
                    <span className="rounded-full bg-brand-600/20 px-4 py-2 text-sm font-semibold text-brand-200 border border-brand-500/30">
                      {currentPage} of {totalPages}
                    </span>
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm font-semibold text-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed hover:border-slate-600"
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 p-12 text-center">
                <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
                  <Search size={24} className="text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-white">No packages found</h3>
                <p className="mt-2 text-slate-400">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-6 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
