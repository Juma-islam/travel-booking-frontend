"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  X,
  Loader,
} from "lucide-react";

interface Review {
  id: string;
  packageTitle: string;
  packageImage: string;
  packageId: string;
  rating: number;
  comment: string;
  date: string;
  status: "published" | "pending" | "rejected";
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    packageTitle: "European Adventure",
    packageImage: "/api/placeholder/80/80",
    packageId: "pkg-1",
    rating: 5,
    comment: "Absolutely incredible experience! The guides were knowledgeable, hotels were top-notch, and the itinerary was perfectly planned. Would 100% recommend to anyone looking for a premium European tour.",
    date: "May 10, 2025",
    status: "published",
  },
  {
    id: "r2",
    packageTitle: "Bali Paradise",
    packageImage: "/api/placeholder/80/80",
    packageId: "pkg-2",
    rating: 4,
    comment: "Beautiful destination and great value for money. The beach resorts were stunning. Only minor issue was some delays on day 3, but overall a fantastic trip.",
    date: "April 22, 2025",
    status: "published",
  },
  {
    id: "r3",
    packageTitle: "Tokyo Discovery",
    packageImage: "/api/placeholder/80/80",
    packageId: "pkg-3",
    rating: 5,
    comment: "Tokyo exceeded all my expectations. The cultural experiences were immersive and the food recommendations were spot on!",
    date: "March 15, 2025",
    status: "pending",
  },
];

const statusConfig = {
  published: { label: "Published", color: "text-green-400 bg-green-500/10 border-green-500/20" },
  pending: { label: "Under Review", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  rejected: { label: "Rejected", color: "text-red-400 bg-red-500/10 border-red-500/20" },
};

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHover(s)}
          onMouseLeave={() => onChange && setHover(0)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            size={onChange ? 22 : 16}
            className={
              s <= (hover || value)
                ? "text-amber-400 fill-amber-400"
                : "text-slate-600"
            }
          />
        </button>
      ))}
    </div>
  );
}

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const [editForm, setEditForm] = useState({ rating: 5, comment: "" });
  const [addForm, setAddForm] = useState({ packageTitle: "", rating: 5, comment: "" });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const openEdit = (review: Review) => {
    setEditForm({ rating: review.rating, comment: review.comment });
    setEditId(review.id);
  };

  const saveEdit = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setReviews((prev) =>
      prev.map((r) =>
        r.id === editId
          ? { ...r, rating: editForm.rating, comment: editForm.comment, status: "pending" }
          : r
      )
    );
    setEditId(null);
    setSaving(false);
    showToast("Review updated — pending approval");
  };

  const confirmDelete = () => {
    setReviews((prev) => prev.filter((r) => r.id !== deleteId));
    setDeleteId(null);
    showToast("Review deleted");
  };

  const submitAdd = async () => {
    if (!addForm.packageTitle || !addForm.comment) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    const newReview: Review = {
      id: `r${Date.now()}`,
      packageTitle: addForm.packageTitle,
      packageImage: "/api/placeholder/80/80",
      packageId: "new",
      rating: addForm.rating,
      comment: addForm.comment,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      status: "pending",
    };
    setReviews((prev) => [newReview, ...prev]);
    setAddForm({ packageTitle: "", rating: 5, comment: "" });
    setShowAdd(false);
    setSaving(false);
    showToast("Review submitted — pending approval");
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Star size={22} className="text-amber-400" />
            My Reviews
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""} · Avg rating: {avgRating} ⭐
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-colors"
        >
          <Plus size={16} />
          Write a Review
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Reviews", value: reviews.length, color: "text-white" },
          { label: "Published", value: reviews.filter((r) => r.status === "published").length, color: "text-green-400" },
          { label: "Avg Rating", value: `${avgRating} ★`, color: "text-amber-400" },
        ].map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-slate-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <MessageSquare size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-300 font-medium">No reviews yet</p>
          <p className="text-slate-500 text-sm mt-1">Share your travel experiences with others</p>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-5 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Write your first review
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
            >
              <div className="flex gap-4">
                <img
                  src={review.packageImage}
                  alt={review.packageTitle}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="font-semibold text-white text-sm">{review.packageTitle}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <StarRating value={review.rating} />
                        <span className="text-slate-500 text-xs">{review.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusConfig[review.status].color}`}>
                        {statusConfig[review.status].label}
                      </span>
                      <button
                        onClick={() => openEdit(review)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-400 hover:bg-brand-400/10 transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(review.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mt-3 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-white">Edit Review</h3>
                <button onClick={() => setEditId(null)} className="text-slate-500 hover:text-white"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Rating</label>
                  <StarRating value={editForm.rating} onChange={(v) => setEditForm((p) => ({ ...p, rating: v }))} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Your Review</label>
                  <textarea
                    rows={4}
                    value={editForm.comment}
                    onChange={(e) => setEditForm((p) => ({ ...p, comment: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-500 focus:outline-none resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setEditId(null)} className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-medium">Cancel</button>
                  <button onClick={saveEdit} disabled={saving} className="flex-1 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving ? <><Loader size={14} className="animate-spin" /> Saving...</> : "Save Changes"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Review Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-white">Write a Review</h3>
                <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Package Name</label>
                  <input
                    value={addForm.packageTitle}
                    onChange={(e) => setAddForm((p) => ({ ...p, packageTitle: e.target.value }))}
                    placeholder="e.g. Bali Paradise"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Rating</label>
                  <StarRating value={addForm.rating} onChange={(v) => setAddForm((p) => ({ ...p, rating: v }))} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Your Review</label>
                  <textarea
                    rows={4}
                    value={addForm.comment}
                    onChange={(e) => setAddForm((p) => ({ ...p, comment: e.target.value }))}
                    placeholder="Share your experience..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-500 focus:outline-none resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-medium">Cancel</button>
                  <button onClick={submitAdd} disabled={saving || !addForm.packageTitle || !addForm.comment} className="flex-1 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving ? <><Loader size={14} className="animate-spin" /> Submitting...</> : "Submit Review"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-xl"><AlertTriangle className="text-red-400" size={20} /></div>
              <h3 className="font-semibold text-white">Delete Review?</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6">This will permanently delete your review.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-xl text-sm"
          >
            <CheckCircle size={16} className="text-green-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
