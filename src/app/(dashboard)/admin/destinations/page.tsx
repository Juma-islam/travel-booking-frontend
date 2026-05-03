"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Plus, Trash2, Edit, Loader, CheckCircle, X, AlertTriangle } from "lucide-react";
import { destinationApi } from "@/services/api.service";

const emptyForm = { name: "", country: "", description: "", imageUrl: "", isTrending: false };

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    destinationApi.getAll().then(setDestinations).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.country.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (d: any) => {
    setForm({ name: d.name, country: d.country, description: d.description, imageUrl: d.imageUrl, isTrending: d.isTrending });
    setEditId(d._id);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        const updated = await destinationApi.update(editId, form);
        setDestinations((prev) => prev.map((d) => (d._id === editId ? updated : d)));
        showToast("Destination updated");
      } else {
        const created = await destinationApi.create(form);
        setDestinations((prev) => [created, ...prev]);
        showToast("Destination created");
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
      await destinationApi.delete(deleteId);
      setDestinations((prev) => prev.filter((d) => d._id !== deleteId));
      showToast("Destination deleted");
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
          <h1 className="text-2xl font-bold text-white">Destinations</h1>
          <p className="text-slate-400 mt-1">{destinations.length} destinations</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <Plus size={16} /> Add Destination
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-3.5 text-slate-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search destinations..." className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-white text-sm focus:border-brand-500 focus:outline-none" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader className="animate-spin text-brand-500" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((dest, i) => (
            <motion.div key={dest._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="relative h-36 overflow-hidden bg-slate-800">
                <img src={dest.imageUrl || "/api/placeholder/400/144"} alt={dest.name} className="w-full h-full object-cover" />
                {dest.isTrending && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-brand-600 text-white text-xs font-medium rounded-lg">Trending</span>
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-white text-sm">{dest.name}</h3>
                    <p className="text-slate-400 text-xs">{dest.country}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openEdit(dest)} className="p-1.5 bg-brand-600/20 hover:bg-brand-600/30 text-brand-400 rounded-lg transition-colors"><Edit size={13} /></button>
                    <button onClick={() => setDeleteId(dest._id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
                <p className="text-slate-500 text-xs line-clamp-2">{dest.description}</p>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && <div className="col-span-full text-center py-12 text-slate-500">No destinations found.</div>}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white">{editId ? "Edit Destination" : "Add Destination"}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              {[
                { key: "name", label: "Name", placeholder: "e.g. Cox's Bazar" },
                { key: "country", label: "Country", placeholder: "e.g. Bangladesh" },
                { key: "imageUrl", label: "Image URL", placeholder: "https://..." },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
                  <input required value={(form as any)[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none" />
                </div>
              ))}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Description</label>
                <textarea required rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none resize-none" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isTrending" checked={form.isTrending} onChange={(e) => setForm((p) => ({ ...p, isTrending: e.target.checked }))} className="w-4 h-4 accent-brand-600" />
                <label htmlFor="isTrending" className="text-sm text-slate-300">Mark as Trending</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-medium">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium disabled:opacity-50">{saving ? "Saving..." : editId ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-red-500/20 rounded-xl"><AlertTriangle className="text-red-400" size={20} /></div><h3 className="font-semibold text-white">Delete Destination?</h3></div>
            <p className="text-slate-400 text-sm mb-6">This will permanently delete the destination.</p>
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
