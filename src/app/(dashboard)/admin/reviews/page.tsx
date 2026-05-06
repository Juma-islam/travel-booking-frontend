"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle, XCircle, Trash2, Loader, Search, Eye, AlertTriangle } from "lucide-react";
import { adminApi } from "@/services/api.service";

const statusConfig: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  published: "bg-green-500/20 text-green-300 border-green-500/30",
  rejected: "bg-red-500/20 text-red-300 border-red-500/30",
};

const tabs = ["all", "pending", "published", "rejected"];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [preview, setPreview] = useState<any | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const load = async (status?: string) => {
    setLoading(true);
    try {
      const data = await adminApi.getReviews(status === "all" ? undefined : status);
      setReviews(data);
    } catch { setReviews([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(activeTab); }, [activeTab]);

  const handleStatus = async (id: string, status: string) => {
    try {
      await adminApi.updateReview(id, status);
      setReviews((prev) => prev.map((r) => r._id === id ? { ...r, status } : r));
      showToast(`Review ${status}`);
    } catch { showToast("Failed to update"); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminApi.deleteReview(deleteId);
      setReviews((prev) => prev.filter((r) => r._id !== deleteId));
      showToast("Review deleted");
    } catch { showToast("Failed to delete"); }
    finally { setDeleteId(null); }
  };

  const filtered = reviews.filter((r) =>
    r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.package?.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.comment?.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Star size={22} className="text-amber-400" />
            Manage Reviews
            {pendingCount > 0 && (
              <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-amber-500 text-white">{pendingCount} pending</span>
            )}
          </h1>
          <p className="text-slate-400 mt-1 text-sm">{reviews.length} total reviews</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${activeTab === tab ? "bg-brand-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-3.5 text-slate-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by user, package, or content..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-white text-sm focus:border-brand-500 focus:outline-none" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader className="animate-spin text-brand-500" size={32} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <Star size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400">No reviews found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review, i) => (
            <motion.div key={review._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Package image */}
                <div className="w-full sm:w-20 h-20 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                  <img src={review.package?.images?.[0] || "/api/placeholder/80/80"} alt="" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-semibold text-white text-sm">{review.package?.title || "Package"}</p>
                      <p className="text-slate-400 text-xs">by {review.user?.name} · {review.user?.email}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={12} className={s <= review.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"} />
                        ))}
                        <span className="text-slate-500 text-xs ml-1">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${statusConfig[review.status]}`}>
                      {review.status}
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm line-clamp-2">{review.comment}</p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {review.status !== "published" && (
                      <button onClick={() => handleStatus(review._id, "published")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-xl text-xs font-medium transition-colors">
                        <CheckCircle size={13} /> Approve
                      </button>
                    )}
                    {review.status !== "rejected" && (
                      <button onClick={() => handleStatus(review._id, "rejected")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-medium transition-colors">
                        <XCircle size={13} /> Reject
                      </button>
                    )}
                    <button onClick={() => setPreview(review)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors">
                      <Eye size={13} /> View Full
                    </button>
                    <button onClick={() => setDeleteId(review._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-medium transition-colors">
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Review Details</h3>
              <button onClick={() => setPreview(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => <Star key={s} size={16} className={s <= preview.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"} />)}
                <span className="text-white font-semibold ml-2">{preview.rating}/5</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{preview.comment}</p>
              <div className="text-xs text-slate-500 space-y-1">
                <p>Package: {preview.package?.title}</p>
                <p>User: {preview.user?.name} ({preview.user?.email})</p>
                <p>Date: {new Date(preview.createdAt).toLocaleString()}</p>
                <p>Status: <span className="capitalize">{preview.status}</span></p>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              {preview.status !== "published" && (
                <button onClick={() => { handleStatus(preview._id, "published"); setPreview(null); }}
                  className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-medium">Approve</button>
              )}
              {preview.status !== "rejected" && (
                <button onClick={() => { handleStatus(preview._id, "rejected"); setPreview(null); }}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium">Reject</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-xl"><AlertTriangle className="text-red-400" size={20} /></div>
              <h3 className="font-semibold text-white">Delete Review?</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6">This will permanently delete the review.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-xl text-sm">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-xl text-sm">
          <CheckCircle size={16} className="text-green-400" /> {toast}
        </div>
      )}
    </div>
  );
}
