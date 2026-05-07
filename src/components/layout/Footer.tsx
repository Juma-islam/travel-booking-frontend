"use client";

import Link from "next/link";
import { Mail, MapPin, ArrowRight, Sparkles } from "lucide-react";

/* ── VoyageAI Logo ── */
function VoyageLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="fAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#fLogoGrad)" />
      <circle cx="20" cy="20" r="11" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
      <path d="M28 14L12 19.5L17.5 21.5L19.5 28L25 22L28 14Z" fill="white" opacity="0.95" />
      <circle cx="28" cy="12" r="3.5" fill="url(#fAmberGrad)" />
    </svg>
  );
}

const quickLinks = [
  { href: "/explore", label: "Explore Destinations" },
  { href: "/packages", label: "Tour Packages" },
  { href: "/ai-planner", label: "AI Trip Planner" },
  { href: "/blog", label: "Travel Blog" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const supportLinks = [
  { href: "/help", label: "Help Center" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 text-slate-400 overflow-hidden">
      {/* Top gradient border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-600/50 to-transparent" />

      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-4 md:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="space-y-5 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <VoyageLogo size={32} />
              <span className="text-xl font-bold text-white">
                Voyage<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-400">AI</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              AI-powered travel planning that learns your preferences and creates perfect trips — faster than ever.
            </p>
            {/* AI badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-950/80 border border-brand-800/50 text-brand-300 text-xs font-medium">
              <Sparkles size={12} />
              Powered by Gemini AI
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Explore</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-brand-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-brand-400" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-cyan-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-cyan-400" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact info */}
            <div className="mt-6 space-y-2.5">
              <a href="mailto:hello@VoyageAI.com" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <Mail size={14} className="text-brand-500 shrink-0" />
                hello@VoyageAI.com
              </a>
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={14} className="text-cyan-500 shrink-0" />
                Bangalore, India
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Stay Updated</h3>
            <p className="text-sm mb-4 leading-relaxed">
              Get the latest travel deals, AI tips, and destination guides in your inbox.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-slate-900 border border-slate-800 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-brand-500 transition-colors placeholder-slate-600"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all"
              >
                Subscribe
                <ArrowRight size={15} />
              </button>
            </form>
            <p className="text-xs text-slate-600 mt-2">No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} VoyageAI. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {supportLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-slate-400 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
