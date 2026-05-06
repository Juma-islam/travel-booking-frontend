"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Search,
  Plus,
  Trash2,
  Edit,
  Loader,
  Star,
  CheckCircle,
  X,
  AlertTriangle,
} from "lucide-react";
import { packageApi, destinationApi } from "@/services/api.service";
import { ImageUpload, MultiImageUpload } from "@/components/ui/ImageUpload";

const categories = ["solo", "family", "couple", "adventure", "relaxation"];

const emptyForm = {
  title: "",
  description: "",
  price: "",
  durationDays: "",
  durationNights: "",
  category: "adventure",
  destination: "",
  inclusions: "",
  exclusions: "",
  images: "",
  isPopular: false,
};

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    Promise.all([
      packageApi.getAll({ pageSize: "100" }),
      destinationApi.getAll(),
    ])
      .then(([pkgRes, destRes]) => {
        setPackages(pkgRes.packages || []);
        setDestinations(destRes || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = packages.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (pkg: any) => {
    setForm({
      title: pkg.title,
      description: pkg.description,
      price: String(pkg.price),
      durationDays: String(pkg.duration?.days),
      durationNights: String(pkg.duration?.nights),
      category: pkg.category,
      destination: pkg.destination?._id || pkg.destination || "",
      inclusions: (pkg.inclusions || []).join(", "),
      exclusions: (pkg.exclusions || []).join(", "),
      images: (pkg.images || []).join(", "),
      isPopular: pkg.isPopular || false,
    });
    setEditId(pkg._id);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        duration: { days: Number(form.durationDays), nights: Number(form.durationNights) },
        category: form.category,
        destination: form.destination,
        inclusions: form.inclusions.split(",").map((s) => s.trim()).filter(Boolean),
        exclusions: form.exclusions.split(",").map((s) => s.trim()).filter(Boolean),
        images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
        isPopular: form.isPopular,
      };

      if (editId) {
        const updated = await packageApi.update(editId, payload);
        setPackages((prev) => prev.map((p) => (p._id === editId ? updated : p)));
        showToast("Package updated");
      } else {
        const created = await packageApi.create({ ...payload, destination: form.destination });
        setPackages((prev) => [created, ...prev]);
        showToast("Package created");
      }
      setShowForm(false);
    } catch (e: any) {
      showToast(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await packageApi.delete(deleteId);
      setPackages((prev) => prev.filter((p) => p._id !== deleteId));
      showToast("Package deleted");
    } catch (e: any) {
      showToast(e.message || "Delete failed");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Packages</h1>
          <p className="text-slate-400 mt-1">{packages.length} packages</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Package
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-3.5 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search packages..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-white text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader className="animate-spin text-brand-500" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((pkg, i) => (
            <motion.div
              key={pkg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
            >
              <div className="relative h-40 overflow-hidden bg-slate-800">
                <img
                  src={pkg.images?.[0] || "/api/placeholder/400/160"}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                />
                {pkg.isPopular && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-lg">
                    Popular
                  </span>
                )}
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-white text-sm line-clamp-2">{pkg.title}</h3>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="capitalize">{pkg.category}</span>
                  <span className="flex items-center gap-1">
                    <Star size={11} className="text-yellow-400" /> {pkg.rating?.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">${pkg.price}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(pkg)}
                      className="p-1.5 bg-brand-600/20 hover:bg-brand-600/30 text-brand-400 rounded-lg transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(pkg._id)}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">No packages found.</div>
          )}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl my-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-white text-lg">
                {editId ? "Edit Package" : "Add Package"}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1.5">Title</label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1.5">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Price ($)</label>
                  <input
                    required
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none"
                  >
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Days</label>
                  <input
                    required
                    type="number"
                    value={form.durationDays}
                    onChange={(e) => setForm((p) => ({ ...p, durationDays: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Nights</label>
                  <input
                    required
                    type="number"
                    value={form.durationNights}
                    onChange={(e) => setForm((p) => ({ ...p, durationNights: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1.5">Destination</label>
                  <select
                    value={form.destination}
                    onChange={(e) => setForm((p) => ({ ...p, destination: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none"
                  >
                    <option value="">Select destination</option>
                    {destinations.map((d) => (
                      <option key={d._id} value={d._id}>{d.name}, {d.country}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1.5">Inclusions (comma-separated)</label>
                  <input
                    value={form.inclusions}
                    onChange={(e) => setForm((p) => ({ ...p, inclusions: e.target.value }))}
                    placeholder="Flight, Hotel, Meals"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1.5">Exclusions (comma-separated)</label>
                  <input
                    value={form.exclusions}
                    onChange={(e) => setForm((p) => ({ ...p, exclusions: e.target.value }))}
                    placeholder="Visa, Travel Insurance"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1.5">Images</label>
                  <MultiImageUpload
                    values={form.images ? form.images.split(",").map((s) => s.trim()).filter(Boolean) : []}
                    onChange={(urls) => setForm((p) => ({ ...p, images: urls.join(", ") }))}
                    max={5}
                  />
                  <p className="text-xs text-slate-600 mt-1">Or paste URLs: <input
                    value={form.images}
                    onChange={(e) => setForm((p) => ({ ...p, images: e.target.value }))}
                    placeholder="https://... (comma separated)"
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs focus:border-brand-500 focus:outline-none w-full mt-1"
                  /></p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPopular"
                    checked={form.isPopular}
                    onChange={(e) => setForm((p) => ({ ...p, isPopular: e.target.checked }))}
                    className="w-4 h-4 accent-brand-600"
                  />
                  <label htmlFor="isPopular" className="text-sm text-slate-300">Mark as Popular</label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium disabled:opacity-50"
                >
                  {saving ? "Saving..." : editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-xl">
                <AlertTriangle className="text-red-400" size={20} />
              </div>
              <h3 className="font-semibold text-white">Delete Package?</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6">This will permanently delete the package.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium">Delete</button>
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
