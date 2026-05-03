"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  CreditCard,
  User,
  Sparkles,
  MapPin,
  Shield,
  MessageCircle,
  ArrowRight,
  ChevronRight,
  Plane,
  Bell,
  Settings,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

const categories = [
  {
    icon: <Plane size={24} />,
    title: "Getting Started",
    color: "text-brand-400",
    bg: "bg-brand-500/10",
    border: "border-brand-500/20",
    articles: [
      { title: "How to create your account", href: "/faq#account" },
      { title: "Exploring destinations", href: "/explore" },
      { title: "Using the AI Planner", href: "/ai-planner" },
      { title: "Demo account walkthrough", href: "/login" },
    ],
  },
  {
    icon: <CreditCard size={24} />,
    title: "Bookings & Payments",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    articles: [
      { title: "How to book a package", href: "/faq#booking" },
      { title: "Using promo codes (TRAVELAI20)", href: "/faq#booking" },
      { title: "Cancellation & refund policy", href: "/faq#booking" },
      { title: "Payment methods accepted", href: "/faq#booking" },
    ],
  },
  {
    icon: <Sparkles size={24} />,
    title: "AI Features",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    articles: [
      { title: "How AI recommendations work", href: "/faq#ai" },
      { title: "Generating an AI itinerary", href: "/ai-planner" },
      { title: "AI budget estimator guide", href: "/ai-planner" },
      { title: "Understanding AI limitations", href: "/faq#ai" },
    ],
  },
  {
    icon: <User size={24} />,
    title: "Account & Profile",
    color: "text-accent-400",
    bg: "bg-accent-500/10",
    border: "border-accent-500/20",
    articles: [
      { title: "Updating your profile", href: "/user/profile" },
      { title: "Managing notifications", href: "/user/settings" },
      { title: "Dark mode & preferences", href: "/user/settings" },
      { title: "Deleting your account", href: "/faq#privacy" },
    ],
  },
  {
    icon: <Shield size={24} />,
    title: "Privacy & Security",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    articles: [
      { title: "How we protect your data", href: "/privacy" },
      { title: "Cookie policy", href: "/privacy#cookies" },
      { title: "Your data rights", href: "/privacy#rights" },
      { title: "Reporting a security issue", href: "/contact" },
    ],
  },
  {
    icon: <Settings size={24} />,
    title: "Technical Support",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    articles: [
      { title: "Backend setup guide", href: "#backend-setup" },
      { title: "Environment variables", href: "#env-setup" },
      { title: "Running the AI features", href: "#ai-setup" },
      { title: "Common errors & fixes", href: "#troubleshooting" },
    ],
  },
];

const guides = [
  {
    id: "backend-setup",
    title: "Backend Setup Guide",
    icon: <Settings size={20} />,
    steps: [
      { step: "1", text: "Navigate to the backend folder: cd backend" },
      { step: "2", text: "Install dependencies: npm install" },
      { step: "3", text: "Create a .env file with MONGO_URI, JWT_SECRET, GEMINI_API_KEY, PORT=5000" },
      { step: "4", text: "Start the server: npm run dev" },
      { step: "5", text: "Server runs at http://localhost:5000" },
    ],
  },
  {
    id: "env-setup",
    title: "Environment Variables",
    icon: <Shield size={20} />,
    steps: [
      { step: "PORT", text: "5000 (backend server port)" },
      { step: "MONGO_URI", text: "Your MongoDB connection string (Atlas or local)" },
      { step: "JWT_SECRET", text: "Any random secret string for JWT signing" },
      { step: "GEMINI_API_KEY", text: "Get from Google AI Studio (aistudio.google.com)" },
      { step: "FRONTEND_URL", text: "http://localhost:3000 (for CORS)" },
    ],
  },
  {
    id: "ai-setup",
    title: "Setting Up AI Features",
    icon: <Sparkles size={20} />,
    steps: [
      { step: "1", text: "Go to aistudio.google.com and sign in with Google" },
      { step: "2", text: "Click 'Get API Key' and create a new key" },
      { step: "3", text: "Copy the key and add it to backend/.env as GEMINI_API_KEY" },
      { step: "4", text: "Restart the backend server" },
      { step: "5", text: "Test by visiting /ai-planner and generating a plan" },
    ],
  },
  {
    id: "troubleshooting",
    title: "Common Errors & Fixes",
    icon: <HelpCircle size={20} />,
    steps: [
      { step: "401", text: "Unauthorized — Login again or check if backend is running" },
      { step: "404", text: "Not Found — Check API_BASE URL in frontend .env.local" },
      { step: "CORS", text: "Add your frontend URL to CORS origins in backend/src/server.ts" },
      { step: "AI Error", text: "Check GEMINI_API_KEY is valid and has quota remaining" },
      { step: "DB Error", text: "Verify MONGO_URI is correct and MongoDB is accessible" },
    ],
  },
];

const popularArticles = [
  { title: "How to use the AI Planner", href: "/ai-planner", badge: "Popular" },
  { title: "Promo code TRAVELAI20 — 20% off", href: "/faq#booking", badge: "Offer" },
  { title: "Cancel or modify a booking", href: "/faq#booking", badge: null },
  { title: "Setting up the backend", href: "#backend-setup", badge: "Dev" },
  { title: "Privacy & data protection", href: "/privacy", badge: null },
  { title: "Contact support team", href: "/contact", badge: null },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [activeGuide, setActiveGuide] = useState<string | null>(null);

  const allArticles = categories.flatMap((c) => c.articles);
  const searchResults = search
    ? allArticles.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(27,113,245,0.15),transparent_55%)]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-500/30 text-brand-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen size={16} />
              Help Center
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-5">
              How can we{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">
                help you?
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Search our knowledge base or browse categories below.
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search size={20} className="absolute left-5 top-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for help articles..."
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-13 pr-5 py-4 text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none transition-colors text-lg"
              />
              {search && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl z-10">
                  {searchResults.map((result, i) => (
                    <Link
                      key={i}
                      href={result.href}
                      onClick={() => setSearch("")}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-800 transition-colors text-sm text-slate-300 hover:text-white"
                    >
                      <BookOpen size={14} className="text-brand-400 shrink-0" />
                      {result.title}
                      <ChevronRight size={14} className="ml-auto text-slate-600" />
                    </Link>
                  ))}
                </div>
              )}
              {search && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center text-slate-500 text-sm shadow-2xl z-10">
                  No articles found for "{search}"
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 pb-24 space-y-16">
        {/* Popular Articles */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <Bell size={18} className="text-brand-400" />
            Popular Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {popularArticles.map((article, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={article.href}
                  className="flex items-center gap-3 p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-brand-500/50 hover:bg-slate-800/50 transition-all group"
                >
                  <BookOpen size={16} className="text-brand-400 shrink-0" />
                  <span className="text-slate-300 group-hover:text-white text-sm flex-1 transition-colors">
                    {article.title}
                  </span>
                  {article.badge && (
                    <span className="text-xs px-2 py-0.5 bg-brand-600/20 text-brand-300 rounded-full shrink-0">
                      {article.badge}
                    </span>
                  )}
                  <ArrowRight size={14} className="text-slate-600 group-hover:text-brand-400 transition-colors shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <MapPin size={18} className="text-brand-400" />
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`bg-slate-900 border ${cat.border} rounded-2xl p-6 hover:border-opacity-60 transition-all`}
              >
                <div className={`inline-flex p-3 rounded-xl ${cat.bg} ${cat.color} mb-4`}>
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-white mb-4">{cat.title}</h3>
                <ul className="space-y-2.5">
                  {cat.articles.map((article, j) => (
                    <li key={j}>
                      <Link
                        href={article.href}
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
                      >
                        <ChevronRight size={14} className={`${cat.color} shrink-0 group-hover:translate-x-0.5 transition-transform`} />
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Developer Guides */}
        <section id="developer-guides">
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Settings size={18} className="text-brand-400" />
            Developer Guides
          </h2>
          <p className="text-slate-500 text-sm mb-5">Setup and configuration guides for developers.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {guides.map((guide) => (
              <button
                key={guide.id}
                onClick={() => setActiveGuide(activeGuide === guide.id ? null : guide.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                  activeGuide === guide.id
                    ? "bg-brand-600/10 border-brand-500/40 text-white"
                    : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                }`}
              >
                <span className={activeGuide === guide.id ? "text-brand-400" : "text-slate-500"}>
                  {guide.icon}
                </span>
                <span className="font-medium text-sm">{guide.title}</span>
                <ChevronRight
                  size={16}
                  className={`ml-auto transition-transform ${activeGuide === guide.id ? "rotate-90 text-brand-400" : "text-slate-600"}`}
                />
              </button>
            ))}
          </div>

          {activeGuide && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
            >
              {(() => {
                const guide = guides.find((g) => g.id === activeGuide)!;
                return (
                  <>
                    <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
                      <span className="text-brand-400">{guide.icon}</span>
                      {guide.title}
                    </h3>
                    <div className="space-y-3">
                      {guide.steps.map((s, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <span className="shrink-0 w-8 h-8 rounded-lg bg-brand-600/20 text-brand-300 text-xs font-bold flex items-center justify-center">
                            {s.step}
                          </span>
                          <code className="text-slate-300 text-sm bg-slate-800 px-3 py-2 rounded-lg flex-1 font-mono">
                            {s.text}
                          </code>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </section>

        {/* Contact CTA */}
        <section>
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-white mb-3">Still need help?</h2>
                <p className="text-slate-400">
                  Our support team is available Monday–Friday, 9am–6pm EST. For urgent issues, our AI assistant is available 24/7.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row md:flex-col gap-3">
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-3 rounded-xl font-medium transition-colors"
                >
                  <MessageCircle size={18} />
                  Contact Support
                </Link>
                <Link
                  href="/faq"
                  className="flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white px-5 py-3 rounded-xl font-medium transition-colors"
                >
                  <HelpCircle size={18} />
                  Browse FAQ
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
