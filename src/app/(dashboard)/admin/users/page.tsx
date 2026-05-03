"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Trash2,
  Shield,
  User,
  Loader,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { adminApi, BackendUser } from "@/services/api.service";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    adminApi
      .getUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminApi.deleteUser(deleteId);
      setUsers((prev) => prev.filter((u) => u._id !== deleteId));
      setToast("User deleted successfully");
      setTimeout(() => setToast(""), 3000);
    } catch (e: any) {
      setToast(e.message || "Failed to delete user");
      setTimeout(() => setToast(""), 3000);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleRoleToggle = async (user: BackendUser) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      await adminApi.updateUserRole(user._id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
      );
      setToast(`Role updated to ${newRole}`);
      setTimeout(() => setToast(""), 3000);
    } catch (e: any) {
      setToast(e.message || "Failed to update role");
      setTimeout(() => setToast(""), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-slate-400 mt-1">{users.length} registered users</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-3.5 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-white text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader className="animate-spin text-brand-500" size={32} />
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-4">User</th>
                  <th className="text-left px-5 py-4">Email</th>
                  <th className="text-left px-5 py-4">Role</th>
                  <th className="text-left px-5 py-4">Joined</th>
                  <th className="text-right px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((user, i) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-600/30 flex items-center justify-center text-brand-300 font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-400">{user.email}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        {user.role === "admin" ? <Shield size={11} /> : <User size={11} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRoleToggle(user)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                        >
                          Toggle Role
                        </button>
                        <button
                          onClick={() => setDeleteId(user._id)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-500">No users found.</div>
            )}
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
              <h3 className="font-semibold text-white">Delete User?</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              This will permanently delete the user and all their data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-xl text-sm">
          <CheckCircle size={16} className="text-green-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
