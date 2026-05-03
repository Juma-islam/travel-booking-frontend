"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Star, Clock, ArrowRight, Trash2 } from "lucide-react";
import { packageApi } from "@/services/api.service";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load wishlist from localStorage
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(saved);

    if (saved.length > 0) {
      Promise.all(saved.map((id: string) => packageApi.getById(id).catch(() => null)))
        .then((results) => setPackages(results.filter(Boolean)))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const removeFromWishlist = (id: string) => {
    const updated = wishlist.filter((w) => w !== id);
    setWishlist(updated);
    setPackages((prev) => prev.filter((p) => p._id !== id));
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Wishlist</h1>
        <p className="text-slate-400 mt-1">Packages you've saved for later.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-24 bg-slate-900 border border-slate-800 rounded-2xl">
          <Heart size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-300 font-medium">Your wishlist is empty</p>
          <p className="text-slate-500 text-sm mt-1">Save packages you love while browsing</p>
          <Link
            href="/explore"
            className="mt-4 inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm"
          >
            Explore packages <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={pkg.images?.[0] || "/api/placeholder/400/200"}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => removeFromWishlist(pkg._id)}
                  className="absolute top-3 right-3 p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-xl transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-white text-sm line-clamp-2">{pkg.title}</h3>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {pkg.duration?.days}d / {pkg.duration?.nights}n
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-400" /> {pkg.rating?.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">${pkg.price}</span>
                  <Link
                    href={`/package/${pkg._id}`}
                    className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-medium transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
