"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Plane,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Loader,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Lowercase", ok: /[a-z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i < score ? colors[score - 1] : "bg-slate-700"}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {checks.map((c) => (
            <span key={c.label} className={`text-xs ${c.ok ? "text-green-400" : "text-slate-600"}`}>
              {c.ok ? "✓" : "○"} {c.label}
            </span>
          ))}
        </div>
        <span className={`text-xs font-medium ${score >= 3 ? "text-green-400" : "text-slate-500"}`}>
          {labels[score - 1] || ""}
        </span>
      </div>
    </div>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const email = params.get("email") || "";

  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Verify token on mount
  useEffect(() => {
    if (!token || !email) {
      setVerifying(false);
      setTokenValid(false);
      return;
    }

    fetch(`${API_BASE}/api/auth/verify-reset-token?token=${token}&email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          setTokenValid(true);
          setUserName(data.name || "");
        } else {
          setTokenValid(false);
        }
      })
      .catch(() => setTokenValid(false))
      .finally(() => setVerifying(false));
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");

      // Auto-login
      if (data.token) {
        localStorage.setItem("auth-token", data.token);
        localStorage.setItem("auth-user", JSON.stringify({
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          createdAt: new Date(),
        }));
      }

      setSuccess(true);
      setTimeout(() => router.push("/user/dashboard"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (verifying) {
    return (
      <div className="text-center py-12">
        <Loader className="animate-spin text-brand-400 mx-auto mb-4" size={32} />
        <p className="text-slate-400">Verifying reset link...</p>
      </div>
    );
  }

  // Invalid token
  if (!tokenValid) {
    return (
      <div className="text-center py-6">
        <div className="inline-flex p-4 bg-red-500/10 rounded-2xl mb-5">
          <AlertCircle size={36} className="text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-3">Link Expired or Invalid</h2>
        <p className="text-slate-400 text-sm mb-6">
          This password reset link has expired or is invalid. Reset links are valid for 1 hour.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          Request New Link
        </Link>
      </div>
    );
  }

  // Success
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6"
      >
        <div className="inline-flex p-4 bg-green-500/10 rounded-2xl mb-5">
          <CheckCircle size={36} className="text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-3">Password Reset!</h2>
        <p className="text-slate-400 text-sm mb-2">
          Your password has been updated successfully.
        </p>
        <p className="text-slate-500 text-xs">Redirecting to dashboard...</p>
        <div className="mt-4 w-32 h-1 bg-slate-800 rounded-full overflow-hidden mx-auto">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5 }}
            className="h-full bg-gradient-to-r from-brand-600 to-cyan-500 rounded-full"
          />
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-brand-500/10 rounded-2xl mb-4">
          <ShieldCheck size={28} className="text-brand-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Set New Password</h1>
        {userName && (
          <p className="text-slate-400 text-sm">Hi <span className="text-white font-medium">{userName}</span>, choose a strong password.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-3.5 text-slate-500" />
            <input
              type={showPw ? "text" : "password"}
              required
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Enter new password"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-11 py-3 text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <PasswordStrength password={password} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-3.5 text-slate-500" />
            <input
              type={showConfirm ? "text" : "password"}
              required
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setError(""); }}
              placeholder="Confirm new password"
              className={`w-full bg-slate-800 border rounded-xl pl-10 pr-11 py-3 text-white placeholder-slate-500 focus:outline-none transition-colors ${
                confirm && password !== confirm
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-slate-700 focus:border-brand-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {confirm && password !== confirm && (
            <p className="text-red-400 text-xs mt-1.5">Passwords do not match</p>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
          >
            <AlertCircle size={15} />
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading || !password || !confirm || password !== confirm}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 disabled:opacity-50 shadow-lg shadow-brand-600/20 transition-all"
        >
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Resetting...</>
          ) : (
            <><ShieldCheck size={16} /> Reset Password</>
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-600/30">
              <Plane size={20} className="-rotate-45 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              Travel<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-400">AI</span>
            </span>
          </Link>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          <Suspense fallback={
            <div className="text-center py-12">
              <Loader className="animate-spin text-brand-400 mx-auto" size={28} />
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>

          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
              <ArrowLeft size={15} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
