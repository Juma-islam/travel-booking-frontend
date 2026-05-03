"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Save, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/services/api.service";

export default function UserProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload: any = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      await authApi.updateProfile(payload);
      setSuccess("Profile updated successfully!");
      setForm((p) => ({ ...p, password: "", confirmPassword: "" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-slate-400 mt-1">Manage your personal information.</p>
      </div>

      {/* Avatar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-brand-600 flex items-center justify-center text-white text-3xl font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-white text-lg">{user?.name}</p>
          <p className="text-slate-400 text-sm">{user?.email}</p>
          <span className="mt-2 inline-block px-3 py-1 bg-brand-600/20 text-brand-300 border border-brand-500/30 rounded-full text-xs font-medium capitalize">
            {user?.role || "user"}
          </span>
        </div>
      </div>

      {/* Form */}
      <motion.form
        onSubmit={handleSave}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5"
      >
        <h2 className="font-semibold text-white">Edit Information</h2>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Full Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-3.5 text-slate-500" />
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-white text-sm focus:border-brand-500 focus:outline-none"
              placeholder="Your name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-3.5 text-slate-500" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-white text-sm focus:border-brand-500 focus:outline-none"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="border-t border-slate-800 pt-5">
          <p className="text-sm text-slate-400 mb-4">Change Password (leave blank to keep current)</p>
          <div className="space-y-4">
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3.5 text-slate-500" />
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-10 py-3 text-white text-sm focus:border-brand-500 focus:outline-none"
                placeholder="New password"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3.5 text-slate-500" />
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-white text-sm focus:border-brand-500 focus:outline-none"
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
            <CheckCircle size={16} /> {success}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </motion.form>
    </div>
  );
}
