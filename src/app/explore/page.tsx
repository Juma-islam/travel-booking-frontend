"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Filter, Heart, Star, Sparkles, Globe, Clock,
  X, GitCompare, Eye, Loader, LayoutGrid, List, Wand2,
} from "lucide-react";
import { TravelPackage } from "../../types/package";
import { authApi, isDemoToken } from "../../services/api.service";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const CATEGORIES = ["All", "solo", "family", "couple", "adventure", "relaxation"];
const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low â†’ High" },
  { value: "price-desc", label: "Price: High â†’ Low" },
  { value: "rating", label: "Highest Rated" },
];
const PAGE_SIZE = 9;

// â”€â”€â”€ Wishlist helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("wishlist") || "[]"); } catch { return []; }
}
function toggleWishlistItem(id: string): boolean {
  const list = getWishlist();
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  localStorage.setItem("wishlist", JSON.stringify(next));
  return next.includes(id);
}

// â”€â”€â”€ Grid Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function GridCard({ pkg, onQuickView, onCompare, inCompare, wishlisted, onWishlist }: {
  pkg: TravelPackage; onQuickView: (p: TravelPackage) => void;
  onCompare: (p: TravelPackage) => void; inCompare: boolean;
  wishlisted: boolean; onWishlist: (id: string) => void;
}) {
  return (
    <motion.article layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300">
      <div className="relative h-52 overflow-hidden">
        <img src={pkg.images?.[0] || "/api/placeholder/400/250"} alt={pkg.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="px-2.5 py-1 rounded-full bg-brand-600/90 text-white text-xs font-semibold backdrop-blur capitalize">{pkg.category}</span>
          {pkg.isPopular && <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-xs font-semibold backdrop-blur">Popular</span>}
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button onClick={() => onWishlist(pkg._id)}
            className={`p-2 rounded-xl backdrop-blur shadow transition-all ${wishlisted ? "bg-red-500 text-white" : "bg-white/90 text-slate-700 hover:bg-red-50 hover:text-red-500"}`}>
            <Heart size={14} className={wishlisted ? "fill-current" : ""} />
          </button>
          <button onClick={() => onCompare(pkg)}
            className={`p-2 rounded-xl backdrop-blur shadow transition-all ${inCompare ? "bg-brand-600 text-white" : "bg-white/90 text-slate-700 hover:bg-brand-50 hover:text-brand-600"}`}>
            <GitCompare size={14} />
          </button>
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-slate-950/80 backdrop-blur px-2.5 py-1.5 rounded-xl">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-white text-xs font-semibold">{pkg.rating?.toFixed(1)}</span>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-1">{pkg.title}</h3>
          <p className="text-slate-400 text-xs mt-1 flex items-center gap-1"><MapPin size={11} />{pkg.destination?.name}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(pkg.inclusions || []).slice(0, 2).map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 text-xs border border-brand-500/20">{tag}</span>
          ))}
          {(pkg.inclusions || []).length > 2 && <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs">+{pkg.inclusions.length - 2}</span>}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Clock size={11} />{pkg.duration?.days}d/{pkg.duration?.nights}n</span>
          <span>{pkg.numReviews || 0} reviews</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-xs text-slate-500">From</p>
            <p className="text-xl font-bold text-white">${pkg.price.toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onQuickView(pkg)} className="p-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"><Eye size={14} /></button>
            <Link href={`/package/${pkg._id}`} className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors">View</Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// â”€â”€â”€ List Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ListCard({ pkg, onQuickView, onCompare, inCompare, wishlisted, onWishlist }: {
  pkg: TravelPackage; onQuickView: (p: TravelPackage) => void;
  onCompare: (p: TravelPackage) => void; inCompare: boolean;
  wishlisted: boolean; onWishlist: (id: string) => void;
}) {
  return (
    <motion.article layout initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
      className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-brand-500/40 transition-all duration-300 flex">
      <div className="relative w-44 shrink-0 overflow-hidden">
        <img src={pkg.images?.[0] || "/api/placeholder/200/200"} alt={pkg.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        {pkg.isPopular && <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-xs font-semibold">Popular</span>}
      </div>
      <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 text-xs border border-brand-500/20 capitalize">{pkg.category}</span>
              <span className="flex items-center gap-1 text-xs text-amber-400"><Star size={11} className="fill-amber-400" />{pkg.rating?.toFixed(1)}</span>
            </div>
            <h3 className="font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-1">{pkg.title}</h3>
            <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1"><MapPin size={11} />{pkg.destination?.name}, {pkg.destination?.country}</p>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button onClick={() => onWishlist(pkg._id)} className={`p-1.5 rounded-lg transition-colors ${wishlisted ? "text-red-400" : "text-slate-500 hover:text-red-400"}`}>
              <Heart size={14} className={wishlisted ? "fill-current" : ""} />
            </button>
            <button onClick={() => onCompare(pkg)} className={`p-1.5 rounded-lg transition-colors ${inCompare ? "text-brand-400" : "text-slate-500 hover:text-brand-400"}`}>
              <GitCompare size={14} />
            </button>
          </div>
        </div>
        <p className="text-slate-400 text-sm line-clamp-2 my-2">{pkg.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Clock size={11} />{pkg.duration?.days}d/{pkg.duration?.nights}n</span>
            <span>{pkg.numReviews || 0} reviews</span>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-lg font-bold text-white">${pkg.price.toLocaleString()}</p>
            <div className="flex gap-1.5">
              <button onClick={() => onQuickView(pkg)} className="p-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white transition-colors"><Eye size={13} /></button>
              <Link href={`/package/${pkg._id}`} className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors">View</Link>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// â”€â”€â”€ Compare Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CompareModal({ packages, onClose }: { packages: TravelPackage[]; onClose: () => void }) {
  const [a, b] = packages;
  const rows = [
    { label: "Price", aVal: `$${a?.price?.toLocaleString() || "â€”"}`, bVal: `$${b?.price?.toLocaleString() || "â€”"}`, lowerIsBetter: true },
    { label: "Duration", aVal: `${a?.duration?.days || "â€”"}d / ${a?.duration?.nights || "â€”"}n`, bVal: `${b?.duration?.days || "â€”"}d / ${b?.duration?.nights || "â€”"}n`, lowerIsBetter: false },
    { label: "Rating", aVal: `${a?.rating?.toFixed(1) || "â€”"} â­`, bVal: `${b?.rating?.toFixed(1) || "â€”"} â­`, lowerIsBetter: false },
    { label: "Reviews", aVal: `${a?.numReviews || 0}`, bVal: `${b?.numReviews || 0}`, lowerIsBetter: false },
    { label: "Category", aVal: a?.category || "â€”", bVal: b?.category || "â€”", lowerIsBetter: false },
    { label: "Destination", aVal: a?.destination?.name || "â€”", bVal: b?.destination?.name || "â€”", lowerIsBetter: false },
    { label: "Inclusions", aVal: (a?.inclusions || []).slice(0, 3).join(", ") || "â€”", bVal: (b?.inclusions || []).slice(0, 3).join(", ") || "â€”", lowerIsBetter: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl my-4 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><GitCompare size={20} className="text-brand-400" />Compare Packages</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><X size={20} /></button>
        </div>
        <div className="grid grid-cols-[120px_1fr_1fr] border-b border-slate-800">
          <div className="p-4" />
          {[a, b].map((pkg, i) => pkg ? (
            <div key={i} className="p-4 border-l border-slate-800">
              <img src={pkg.images?.[0] || "/api/placeholder/300/150"} alt={pkg.title} className="w-full h-28 object-cover rounded-xl mb-3" />
              <h3 className="font-semibold text-white text-sm line-clamp-2">{pkg.title}</h3>
              <p className="text-slate-400 text-xs mt-1">{pkg.destination?.name}</p>
            </div>
          ) : (
            <div key={i} className="p-4 border-l border-slate-800 flex items-center justify-center text-slate-600 text-sm">No package selected</div>
          ))}
        </div>
        <div className="divide-y divide-slate-800/50">
          {rows.map((row, i) => {
            const aNum = parseFloat(row.aVal.replace(/[^0-9.]/g, "") || "0");
            const bNum = parseFloat(row.bVal.replace(/[^0-9.]/g, "") || "0");
            const aWins = aNum !== bNum && (row.lowerIsBetter ? aNum < bNum : aNum > bNum);
            const bWins = aNum !== bNum && (row.lowerIsBetter ? bNum < aNum : bNum > aNum);
            return (
              <div key={i} className="grid grid-cols-[120px_1fr_1fr]">
                <div className="p-4 text-slate-500 text-sm font-medium">{row.label}</div>
                <div className={`p-4 border-l border-slate-800 text-sm ${aWins ? "text-green-400 font-semibold" : "text-slate-300"}`}>{row.aVal}</div>
                <div className={`p-4 border-l border-slate-800 text-sm ${bWins ? "text-green-400 font-semibold" : "text-slate-300"}`}>{row.bVal}</div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-[120px_1fr_1fr] border-t border-slate-800 p-4 gap-3">
          <div />
          {[a, b].map((pkg, i) => pkg ? (
            <Link key={i} href={`/booking?packageId=${pkg._id}`} onClick={onClose}
              className="flex items-center justify-center py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors">
              Book Now
            </Link>
          ) : <div key={i} />)}
        </div>
      </motion.div>
    </div>
  );
}

// â”€â”€â”€ Quick View Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function QuickViewModal({ pkg, onClose }: { pkg: TravelPackage; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"><X size={18} /></button>
        <div className="grid md:grid-cols-2">
          <div className="relative h-64 md:h-auto overflow-hidden">
            <img src={pkg.images?.[0] || "/api/placeholder/600/400"} alt={pkg.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
          </div>
          <div className="p-6 space-y-4">
            <div>
              <span className="text-xs text-brand-400 uppercase tracking-wider">{pkg.category}</span>
              <h2 className="text-2xl font-bold text-white mt-1">{pkg.title}</h2>
              <p className="text-slate-400 text-sm mt-1 flex items-center gap-1"><MapPin size={13} />{pkg.destination?.name}, {pkg.destination?.country}</p>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">{pkg.description}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Price", value: `$${pkg.price.toLocaleString()}` },
                { label: "Duration", value: `${pkg.duration?.days}d/${pkg.duration?.nights}n` },
                { label: "Rating", value: `${pkg.rating?.toFixed(1)} â­` },
                { label: "Reviews", value: `${pkg.numReviews || 0}` },
              ].map((item) => (
                <div key={item.label} className="bg-slate-800 rounded-xl p-3">
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="text-lg font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Link href={`/package/${pkg._id}`} onClick={onClose} className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold text-center transition-colors">View Details</Link>
              <Link href={`/booking?packageId=${pkg._id}`} onClick={onClose} className="flex-1 py-3 rounded-xl border border-brand-500/50 text-brand-300 hover:bg-brand-500/10 text-sm font-semibold text-center transition-colors">Book Now</Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// â”€â”€â”€ Compare Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CompareBar({ items, onRemove, onCompare, onClear }: {
  items: TravelPackage[]; onRemove: (id: string) => void;
  onCompare: () => void; onClear: () => void;
}) {
  return (
    <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 border border-brand-500/40 rounded-2xl shadow-2xl shadow-brand-500/20 px-5 py-4 flex items-center gap-4 max-w-2xl w-full mx-4">
      <GitCompare size={18} className="text-brand-400 shrink-0" />
      <div className="flex-1 flex gap-3">
        {[0, 1].map((i) => (
          <div key={i} className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${items[i] ? "bg-slate-800 text-white" : "border border-dashed border-slate-700 text-slate-600"}`}>
            {items[i] ? (
              <>
                <span className="truncate flex-1">{items[i].title}</span>
                <button onClick={() => onRemove(items[i]._id)} className="text-slate-500 hover:text-red-400 shrink-0"><X size={13} /></button>
              </>
            ) : (
              <span>Select package {i + 1}</span>
            )}
          </div>
        ))}
      </div>
      <button onClick={onCompare} disabled={items.length < 2}
        className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold disabled:opacity-40 transition-colors shrink-0">
        Compare
      </button>
      <button onClick={onClear} className="text-slate-500 hover:text-white transition-colors shrink-0"><X size={16} /></button>
    </motion.div>
  );
}

// â”€â”€â”€ Skeleton â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CardSkeleton({ view }: { view: "grid" | "list" }) {
  if (view === "list") {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex animate-pulse">
        <div className="w-44 shrink-0 bg-slate-800" />
        <div className="flex-1 p-5 space-y-3">
          <div className="h-4 bg-slate-800 rounded w-3/4" />
          <div className="h-3 bg-slate-800 rounded w-1/2" />
          <div className="h-3 bg-slate-800 rounded w-full" />
          <div className="h-3 bg-slate-800 rounded w-5/6" />
          <div className="flex justify-between items-center pt-2">
            <div className="h-6 bg-slate-800 rounded w-20" />
            <div className="h-8 bg-slate-800 rounded w-24" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-52 bg-slate-800" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-slate-800 rounded w-1/2" />
        <div className="flex gap-2"><div className="h-5 bg-slate-800 rounded-full w-16" /><div className="h-5 bg-slate-800 rounded-full w-20" /></div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-7 bg-slate-800 rounded w-20" />
          <div className="h-8 bg-slate-800 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function ExplorePage() {
  const [allPackages, setAllPackages] = useState<TravelPackage[]>([]);
  const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);

  // UI state
  const [view, setView] = useState<"grid" | "list">("grid");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<TravelPackage[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [quickViewPkg, setQuickViewPkg] = useState<TravelPackage | null>(null);
  const [aiSearching, setAiSearching] = useState(false);
  const [aiToast, setAiToast] = useState("");

  // Infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Load all packages once
  useEffect(() => {
    setWishlist(getWishlist());
    fetch(`${API_BASE}/api/packages?pageSize=100`)
      .then((r) => r.json())
      .then((data) => setAllPackages(data.packages || []))
      .catch(() => setError("Could not load packages. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  // Filtered + sorted list
  const filtered = useMemo(() => {
    let res = allPackages;
    if (category !== "All") res = res.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.destination?.name?.toLowerCase().includes(q) ||
        p.destination?.country?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    res = res.filter((p) => p.price <= maxPrice && (p.rating || 0) >= minRating);
    if (sort === "price-asc") res = [...res].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") res = [...res].sort((a, b) => b.price - a.price);
    else if (sort === "rating") res = [...res].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return res;
  }, [allPackages, category, search, maxPrice, minRating, sort]);

  const displayed = filtered.slice(0, displayedCount);
  const hasMore = displayedCount < filtered.length;

  // Infinite scroll â€” use ref to avoid stale closure loop
  const hasMoreRef = useRef(hasMore);
  const loadingMoreRef = useRef(loadingMore);
  hasMoreRef.current = hasMore;
  loadingMoreRef.current = loadingMore;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMoreRef.current && !loadingMoreRef.current) {
          setLoadingMore(true);
          setTimeout(() => {
            setDisplayedCount((c) => c + PAGE_SIZE);
            setLoadingMore(false);
          }, 500);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []); // empty deps â€” refs handle freshness

  // Reset count when filters change
  useEffect(() => { setDisplayedCount(PAGE_SIZE); }, [search, category, maxPrice, minRating, sort]);

  // Wishlist toggle
  const handleWishlist = (id: string) => {
    toggleWishlistItem(id);
    setWishlist(getWishlist());
  };

  // Compare toggle
  const handleCompare = (pkg: TravelPackage) => {
    setCompareList((prev) => {
      if (prev.find((p) => p._id === pkg._id)) return prev.filter((p) => p._id !== pkg._id);
      if (prev.length >= 2) return [prev[1], pkg];
      return [...prev, pkg];
    });
  };

  // AI Smart Search
  const handleAiSearch = async () => {
    if (!search.trim()) {
      setAiToast("Type something to search first!");
      setTimeout(() => setAiToast(""), 3000);
      return;
    }
    setAiSearching(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: search,
          context: `Extract destination, category, and price range from this search query and return JSON only (no markdown, no explanation): {"destination": "string or empty", "category": "solo|family|couple|adventure|relaxation or empty", "maxPrice": number or 10000}`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const raw: string = data.reply || data.result || "";
        // Strip markdown code fences if present
        const cleaned = raw.replace(/```json|```/g, "").trim();
        try {
          const parsed = JSON.parse(cleaned);
          if (parsed.destination) setSearch(parsed.destination);
          if (parsed.category && CATEGORIES.map((c) => c.toLowerCase()).includes(parsed.category.toLowerCase())) {
            setCategory(parsed.category);
          }
          if (parsed.maxPrice && typeof parsed.maxPrice === "number") {
            setMaxPrice(Math.min(10000, Math.max(500, parsed.maxPrice)));
          }
          setAiToast("AI filters applied!");
        } catch {
          setAiToast("AI search applied — showing results for: " + search);
        }
      } else {
        setAiToast("AI search unavailable — using text search");
      }
    } catch {
      setAiToast("AI search unavailable — using text search");
    } finally {
      setAiSearching(false);
      setTimeout(() => setAiToast(""), 3000);
    }
  };

  const activeFilters = [
    search && `"${search}"`,
    category !== "All" && category,
    maxPrice < 10000 && `â‰¤$${maxPrice}`,
    minRating > 0 && `${minRating}â˜…+`,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-32">
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.2),transparent_55%)]">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-500/30 text-brand-300 px-4 py-2 rounded-full text-sm font-medium mb-5">
              <Sparkles size={15} />
              AI-Powered Explore
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Discover Your Next{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-400">Adventure</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
              {allPackages.length > 0 ? `${allPackages.length} packages across ${new Set(allPackages.map((p) => p.destination?.country)).size} countries` : "Curated travel experiences worldwide"}
            </p>
            <div className="flex justify-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-1.5"><Star size={14} className="text-amber-400 fill-amber-400" />4.8+ avg rating</span>
              <span className="flex items-center gap-1.5"><Globe size={14} className="text-cyan-400" />120+ destinations</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-brand-400" />Worldwide coverage</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 space-y-6">
        {/* Search + Controls bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-4 top-3.5 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destinations, packages, themes..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none transition-colors" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAiSearch}
              disabled={aiSearching}
              title="AI Smart Search — let AI extract filters from your query"
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border border-brand-500/40 bg-brand-600/10 text-brand-300 hover:bg-brand-600/20 hover:border-brand-500/60 transition-colors disabled:opacity-50"
            >
              {aiSearching ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Wand2 size={16} />
              )}
              <span className="hidden sm:inline">AI Search</span>
            </button>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-colors ${showFilters ? "border-brand-500 bg-brand-600/20 text-brand-300" : "border-slate-700 bg-slate-900 text-slate-400 hover:text-white"}`}>
              <Filter size={16} />
              Filters
              {activeFilters.length > 0 && <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center">{activeFilters.length}</span>}
            </button>
            {/* View toggle */}
            <div className="flex bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <button onClick={() => setView("grid")} className={`p-3 transition-colors ${view === "grid" ? "bg-brand-600 text-white" : "text-slate-400 hover:text-white"}`}><LayoutGrid size={16} /></button>
              <button onClick={() => setView("list")} className={`p-3 transition-colors ${view === "list" ? "bg-brand-600 text-white" : "text-slate-400 hover:text-white"}`}><List size={16} /></button>
            </div>
          </div>
        </div>

        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Category */}
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-3">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button key={cat} onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors ${category === cat ? "bg-brand-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Max Price */}
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-3">Max Price: <span className="text-white font-semibold">${maxPrice.toLocaleString()}</span></label>
                  <input type="range" min="500" max="10000" step="500" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-brand-600" />
                  <div className="flex justify-between text-xs text-slate-600 mt-1"><span>$500</span><span>$10,000</span></div>
                </div>
                {/* Min Rating */}
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-3">Min Rating</label>
                  <div className="flex gap-2 flex-wrap">
                    {[0, 3, 3.5, 4, 4.5].map((r) => (
                      <button key={r} onClick={() => setMinRating(r)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${minRating === r ? "bg-amber-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
                        {r === 0 ? "Any" : `${r}â˜…+`}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Sort */}
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-3">Sort By</label>
                  <select value={sort} onChange={(e) => setSort(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none">
                    {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${category === cat ? "bg-brand-600 text-white" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-500">Active:</span>
            {activeFilters.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-600/20 border border-brand-500/30 text-brand-300 text-xs font-medium">
                {f}
              </span>
            ))}
            <button onClick={() => { setSearch(""); setCategory("All"); setMaxPrice(10000); setMinRating(0); setSort("recommended"); }}
              className="text-xs text-slate-500 hover:text-white transition-colors">Clear all</button>
          </div>
        )}

        {/* Results header */}
        <div className="flex items-center justify-between">
          <p className="text-slate-400 text-sm">
            {loading ? "Loading..." : `${filtered.length} package${filtered.length !== 1 ? "s" : ""} found`}
            {displayed.length < filtered.length && ` Â· showing ${displayed.length}`}
          </p>
          {compareList.length > 0 && (
            <span className="text-xs text-brand-400 flex items-center gap-1.5">
              <GitCompare size={13} />{compareList.length}/2 selected for compare
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 text-sm">{error}</div>
        )}

        {/* Package grid/list */}
        {loading ? (
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-4"}>
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} view={view} />)}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-24 bg-slate-900 border border-slate-800 rounded-2xl">
            <Search size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-300 font-medium text-lg">No packages found</p>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search terms</p>
            <button onClick={() => { setSearch(""); setCategory("All"); setMaxPrice(10000); setMinRating(0); }}
              className="mt-5 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium transition-colors">
              Clear filters
            </button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-4"}>
              {displayed.map((pkg) =>
                view === "grid" ? (
                  <GridCard key={pkg._id} pkg={pkg} onQuickView={setQuickViewPkg} onCompare={handleCompare}
                    inCompare={compareList.some((p) => p._id === pkg._id)}
                    wishlisted={wishlist.includes(pkg._id)} onWishlist={handleWishlist} />
                ) : (
                  <ListCard key={pkg._id} pkg={pkg} onQuickView={setQuickViewPkg} onCompare={handleCompare}
                    inCompare={compareList.some((p) => p._id === pkg._id)}
                    wishlisted={wishlist.includes(pkg._id)} onWishlist={handleWishlist} />
                )
              )}
            </div>
          </AnimatePresence>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-4" />

        {/* Loading more indicator */}
        {loadingMore && (
          <div className="flex justify-center py-6">
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <Loader size={18} className="animate-spin text-brand-400" />
              Loading more packages...
            </div>
          </div>
        )}

        {/* End of results */}
        {!loading && !loadingMore && !hasMore && displayed.length > 0 && (
          <div className="text-center py-8 text-slate-600 text-sm">
            âœ“ All {filtered.length} packages loaded
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {quickViewPkg && <QuickViewModal pkg={quickViewPkg} onClose={() => setQuickViewPkg(null)} />}
        {showCompare && compareList.length >= 2 && <CompareModal packages={compareList} onClose={() => setShowCompare(false)} />}
      </AnimatePresence>

      {/* Compare bar */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <CompareBar items={compareList} onRemove={(id) => setCompareList((p) => p.filter((x) => x._id !== id))}
            onCompare={() => setShowCompare(true)} onClear={() => setCompareList([])} />
        )}
      </AnimatePresence>

      {/* AI Search Toast */}
      <AnimatePresence>
        {aiToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-800 border border-brand-500/40 text-white px-5 py-3 rounded-xl shadow-xl text-sm"
          >
            <Sparkles size={15} className="text-brand-400" />
            {aiToast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


