"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import VoyageLogo from "@/components/ui/VoyageLogo";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [devLink, setDevLink] = useState(""); // dev mode only

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Request failed");

      setSent(true);
      // Dev mode: show reset link directly
      if (data.resetUrl) setDevLink(data.resetUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <VoyageLogo size={40} />
            <span className="text-2xl font-bold text-white">
              Voyage<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-400">AI</span>
            </span>
          </Link>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          {!sent ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex p-3 bg-brand-500/10 rounded-2xl mb-4">
                  <Mail size={28} className="text-brand-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
                <p className="text-slate-400 text-sm">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-3.5 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="your@email.com"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none transition-colors"
                    />
                  </div>
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
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 disabled:opacity-50 shadow-lg shadow-brand-600/20 transition-all"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                  ) : (
                    <><Send size={16} /> Send Reset Link</>
                  )}
                </button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="inline-flex p-4 bg-green-500/10 rounded-2xl mb-5">
                <CheckCircle size={36} className="text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Check Your Email</h2>
              <p className="text-slate-400 text-sm mb-2">
                We've sent a password reset link to
              </p>
              <p className="font-semibold text-white mb-6">{email}</p>
              <p className="text-slate-500 text-xs mb-6">
                Didn't receive it? Check your spam folder or try again.
              </p>

              {/* Dev mode reset link */}
              {devLink && (
                <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-left">
                  <p className="text-amber-400 text-xs font-semibold mb-2 flex items-center gap-1">
                    <Sparkles size={12} /> DEV MODE — Reset Link:
                  </p>
                  <Link
                    href={devLink.replace(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", "").replace("http://localhost:3000", "")}
                    className="text-brand-400 text-xs break-all hover:text-brand-300 transition-colors"
                  >
                    Click here to reset password →
                  </Link>
                </div>
              )}

              <button
                onClick={() => { setSent(false); setEmail(""); setDevLink(""); }}
                className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
              >
                Try a different email
              </button>
            </motion.div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft size={15} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
