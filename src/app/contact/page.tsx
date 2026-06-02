"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Clock,
  Sparkles,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const contactInfo = [
  {
    icon: <Mail size={22} />,
    label: "Email Us",
    value: "hello@VoyageAI.com",
    sub: "We reply within 24 hours",
    color: "text-brand-400",
    bg: "bg-brand-500/10",
  },
  {
    icon: <Phone size={22} />,
    label: "Call Us",
    value: "+1 (800) TRAVEL-AI",
    sub: "Mon–Fri, 9am–6pm EST",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: <MapPin size={22} />,
    label: "Office",
    value: "Bangalore, India",
    sub: "Global HQ",
    color: "text-accent-400",
    bg: "bg-accent-500/10",
  },
  {
    icon: <Clock size={22} />,
    label: "AI Support",
    value: "24 / 7",
    sub: "Always available",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
];

const topics = [
  "General Inquiry",
  "Booking Support",
  "Technical Issue",
  "Partnership",
  "Press & Media",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(27,113,245,0.15),transparent_60%)]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-500/30 text-brand-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MessageCircle size={16} />
              Get in Touch
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-bold text-white mb-5">
              We'd love to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">
                hear from you
              </span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl text-slate-400 max-w-2xl mx-auto">
              Have a question, feedback, or just want to say hello? Our team is here for you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors"
              >
                <div className={`inline-flex p-2.5 rounded-xl ${item.bg} ${item.color} mb-3`}>
                  {item.icon}
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{item.label}</p>
                <p className="font-semibold text-white text-sm">{item.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Send a Message</h2>
              <p className="text-slate-400 text-sm mb-7">Fill out the form and we'll get back to you shortly.</p>

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex p-4 bg-green-500/10 rounded-2xl mb-4">
                    <CheckCircle size={40} className="text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-400">We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setStatus("idle"); setForm({ name: "", email: "", topic: "", message: "" }); }}
                    className="mt-6 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">Full Name</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Your name"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:border-brand-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">Email Address</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        placeholder="your@email.com"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:border-brand-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Topic</label>
                    <select
                      value={form.topic}
                      onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select a topic</option>
                      {topics.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us how we can help..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:border-brand-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
                      <AlertCircle size={14} />
                      Failed to send message. Please try again.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold transition-colors"
                  >
                    {status === "loading" ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                    ) : (
                      <><Send size={18} /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Right side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Map */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden h-64 relative">
                <iframe
                  title="VoyageAI Headquarters Map"
                  src="https://maps.google.com/maps?q=Bangalore,%20India&t=&z=12&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 opacity-80"
                  loading="lazy"
                />
              </div>

              {/* AI Support CTA */}
              <div className="bg-gradient-to-br from-brand-600 to-accent-600 rounded-3xl p-7 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="inline-flex p-2.5 bg-white/20 rounded-xl mb-4">
                    <Sparkles size={22} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Try AI Assistant</h3>
                  <p className="text-white/80 text-sm mb-5">
                    Get instant answers to your travel questions with our 24/7 AI chatbot.
                  </p>
                  <a
                    href="/ai-planner"
                    className="inline-flex items-center gap-2 bg-white text-brand-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-50 transition-colors"
                  >
                    <Sparkles size={16} />
                    Chat with AI
                  </a>
                </div>
              </div>

              {/* FAQ link */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-2">Looking for quick answers?</h3>
                <p className="text-slate-400 text-sm mb-4">Check our FAQ page for common questions about bookings, payments, and more.</p>
                <a href="/faq" className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors">
                  Browse FAQ →
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
