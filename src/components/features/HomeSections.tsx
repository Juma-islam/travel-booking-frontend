"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
  Search,
  Sparkles,
  CreditCard,
  Shield,
  Tag,
  Clock,
  XCircle,
  Star,
  MapPin,
  Smartphone,
  Bell,
  Download,
  ArrowRight,
  Mail,
  Zap,
  Globe,
  Users,
  HeartHandshake,
  Mountain,
  Gem,
  Baby,
  User,
  Heart,
  DollarSign,
  Play,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

// ─── Shared helpers ────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-600/15 border border-brand-600/30 text-brand-400 text-xs font-semibold uppercase tracking-widest mb-4">
      <Sparkles size={12} />
      {children}
    </span>
  );
}

// ─── 1. HowItWorks ─────────────────────────────────────────────────────────────

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Search Your Dream",
    desc: "Tell us where you want to go, your budget, travel dates, and what kind of experience you're after.",
    color: "from-brand-600 to-brand-700",
    glow: "shadow-brand-600/30",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "AI Plans It All",
    desc: "Our Gemini-powered AI crafts a personalised itinerary with hand-picked hotels, activities, and transfers.",
    color: "from-cyan-500 to-cyan-600",
    glow: "shadow-cyan-500/30",
  },
  {
    icon: CreditCard,
    step: "03",
    title: "Book & Go",
    desc: "Confirm your trip in seconds with secure payment. Your adventure begins the moment you click Book.",
    color: "from-amber-500 to-amber-600",
    glow: "shadow-amber-500/30",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-slate-950 py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            Travel planning,{" "}
            <span className="bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">
              reimagined
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            From idea to itinerary in minutes — powered by AI, perfected for you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-14 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-brand-600/40 via-cyan-500/40 to-amber-500/40" />

          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className="relative flex flex-col items-center text-center group"
            >
              <div
                className={`relative w-28 h-28 rounded-3xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-6 shadow-2xl ${s.glow} group-hover:scale-105 transition-transform duration-300`}
              >
                <s.icon size={40} className="text-white" />
                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 2. TravelStyles ───────────────────────────────────────────────────────────

const styles = [
  { icon: Mountain, label: "Adventure", desc: "Hike, trek, and explore the wild", color: "from-emerald-500 to-teal-600", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { icon: Gem, label: "Luxury", desc: "5-star resorts and private villas", color: "from-amber-400 to-yellow-500", bg: "bg-amber-500/10 border-amber-500/20" },
  { icon: Baby, label: "Family", desc: "Kid-friendly fun for all ages", color: "from-sky-400 to-blue-500", bg: "bg-sky-500/10 border-sky-500/20" },
  { icon: User, label: "Solo", desc: "Discover yourself on the road", color: "from-violet-500 to-purple-600", bg: "bg-violet-500/10 border-violet-500/20" },
  { icon: Heart, label: "Honeymoon", desc: "Romantic escapes for two", color: "from-rose-500 to-pink-600", bg: "bg-rose-500/10 border-rose-500/20" },
  { icon: DollarSign, label: "Budget", desc: "See the world without breaking the bank", color: "from-brand-500 to-cyan-500", bg: "bg-brand-500/10 border-brand-500/20" },
];

export function TravelStyles() {
  return (
    <section className="bg-slate-900 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <SectionLabel>Travel Styles</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            Every traveller,{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-brand-400 bg-clip-text text-transparent">
              every style
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Whether you crave adrenaline or serenity, we have the perfect package waiting for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {styles.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`relative rounded-2xl border p-6 cursor-pointer group transition-all duration-300 ${s.bg}`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <s.icon size={22} className="text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{s.label}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              <ChevronRight
                size={16}
                className="absolute bottom-5 right-5 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 3. LiveStats ──────────────────────────────────────────────────────────────

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

const stats: StatItem[] = [
  { value: 50, suffix: "K+", label: "Happy Travelers", icon: Users, color: "text-brand-400" },
  { value: 100, suffix: "+", label: "Destinations", icon: Globe, color: "text-cyan-400" },
  { value: 4.9, suffix: "", label: "Average Rating", icon: Star, color: "text-amber-400" },
  { value: 24, suffix: "/7", label: "Support Available", icon: HeartHandshake, color: "text-rose-400" },
];

function AnimatedCounter({ value, suffix, color }: { value: number; suffix: string; color: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    const isDecimal = value % 1 !== 0;
    const duration = 1800;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(isDecimal ? Math.round(current * 10) / 10 : Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref} className={`text-5xl md:text-6xl font-black ${color}`}>
      {count}
      {suffix}
    </span>
  );
}

export function LiveStats() {
  return (
    <section className="bg-slate-950 py-24 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-600/5 via-cyan-500/5 to-amber-500/5 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <SectionLabel>By The Numbers</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">
            Trusted by thousands{" "}
            <span className="bg-gradient-to-r from-amber-400 to-brand-400 bg-clip-text text-transparent">
              worldwide
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className="relative rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center group hover:border-slate-600 transition-colors duration-300"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <s.icon size={22} className={s.color} />
                </div>
              </div>
              <AnimatedCounter value={s.value} suffix={s.suffix} color={s.color} />
              <p className="text-slate-400 text-sm mt-2 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 4. SeasonalDeals ──────────────────────────────────────────────────────────

const deals = [
  {
    season: "Summer",
    emoji: "☀️",
    destination: "Maldives & Bali",
    desc: "Crystal-clear waters, overwater bungalows, and endless sunshine await.",
    discount: "30% OFF",
    price: "$899",
    originalPrice: "$1,285",
    badge: "bg-amber-500",
    gradient: "from-amber-500/20 to-orange-600/10",
    border: "border-amber-500/20",
    img: "/api/placeholder/600/400",
  },
  {
    season: "Winter",
    emoji: "❄️",
    destination: "Swiss Alps & Norway",
    desc: "Ski the finest slopes and witness the magical Northern Lights.",
    discount: "25% OFF",
    price: "$1,199",
    originalPrice: "$1,599",
    badge: "bg-sky-500",
    gradient: "from-sky-500/20 to-blue-600/10",
    border: "border-sky-500/20",
    img: "/api/placeholder/600/400",
  },
  {
    season: "Spring",
    emoji: "🌸",
    destination: "Japan & South Korea",
    desc: "Cherry blossoms, ancient temples, and vibrant street food culture.",
    discount: "20% OFF",
    price: "$1,049",
    originalPrice: "$1,311",
    badge: "bg-rose-500",
    gradient: "from-rose-500/20 to-pink-600/10",
    border: "border-rose-500/20",
    img: "/api/placeholder/600/400",
  },
];

export function SeasonalDeals() {
  return (
    <section className="bg-slate-900 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <SectionLabel>Limited Time Deals</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            Seasonal{" "}
            <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
              savings
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Grab these exclusive deals before they disappear — prices drop every season.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {deals.map((d, i) => (
            <motion.div
              key={d.season}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className={`relative rounded-3xl border overflow-hidden bg-gradient-to-b ${d.gradient} ${d.border} group cursor-pointer`}
            >
              {/* Discount badge */}
              <div className={`absolute top-4 right-4 z-10 ${d.badge} text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg`}>
                {d.discount}
              </div>

              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.img}
                  alt={d.destination}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                <div className="absolute bottom-3 left-4 text-2xl">{d.emoji}</div>
                <div className="absolute bottom-3 right-4 text-xs font-semibold text-white/70 uppercase tracking-wider">
                  {d.season}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-white font-bold text-xl mb-2">{d.destination}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{d.desc}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-slate-500 text-sm line-through">{d.originalPrice}</span>
                    <div className="text-white font-black text-2xl">{d.price}</div>
                    <span className="text-slate-500 text-xs">per person</span>
                  </div>
                  <Link
                    href="/packages"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all duration-200 border border-white/10"
                  >
                    Book Now <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 5. TrustBadges ────────────────────────────────────────────────────────────

const badges = [
  {
    icon: Shield,
    title: "Secure Payment",
    desc: "256-bit SSL encryption on every transaction",
    color: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/20",
  },
  {
    icon: Tag,
    title: "Best Price Guarantee",
    desc: "Find it cheaper? We'll match it — no questions asked",
    color: "from-amber-500 to-yellow-500",
    glow: "shadow-amber-500/20",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    desc: "Real humans ready to help, any time of day or night",
    color: "from-brand-500 to-cyan-500",
    glow: "shadow-brand-500/20",
  },
  {
    icon: XCircle,
    title: "Free Cancellation",
    desc: "Plans change — cancel up to 48 hours before for free",
    color: "from-rose-500 to-pink-500",
    glow: "shadow-rose-500/20",
  },
];

export function TrustBadges() {
  return (
    <section className="bg-slate-950 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <SectionLabel>Why Choose Us</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">
            Book with{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              confidence
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {badges.map((b, i) => (
            <motion.div
              key={b.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-colors duration-300 group"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center mb-4 shadow-xl ${b.glow} group-hover:scale-110 transition-transform duration-300`}
              >
                <b.icon size={26} className="text-white" />
              </div>
              <h3 className="text-white font-bold text-base mb-2">{b.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 6. PartnerLogos ───────────────────────────────────────────────────────────

const partners = [
  "SkyWings Airlines",
  "LuxStay Hotels",
  "OceanView Resorts",
  "AlpineTrails",
  "CityBreaks Co.",
  "WildRoam Safaris",
  "AquaVentures",
  "PeakEscape",
];

export function PartnerLogos() {
  return (
    <section className="bg-slate-900 py-16 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="text-center text-slate-500 text-sm font-semibold uppercase tracking-widest mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          Trusted by travellers worldwide — in partnership with
        </motion.p>

        {/* Scrolling marquee */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-8"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {[...partners, ...partners].map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="flex-shrink-0 flex items-center justify-center px-8 py-4 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-500 transition-colors duration-300 min-w-[180px]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Globe size={14} className="text-white" />
                  </div>
                  <span className="text-slate-300 font-semibold text-sm whitespace-nowrap">{name}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="flex flex-wrap justify-center gap-3 mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          {["IATA Certified", "ISO 9001", "TripAdvisor Award", "Forbes Travel Guide"].map((cert) => (
            <span
              key={cert}
              className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-medium"
            >
              ✓ {cert}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── 7. VideoHeroCTA ───────────────────────────────────────────────────────────

export function VideoHeroCTA() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative bg-slate-950 py-0 overflow-hidden">
      {/* Full-width dark gradient backdrop */}
      <div className="relative min-h-[520px] flex items-center justify-center">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/api/placeholder/1600/520"
            alt="Travel background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-brand-950/80 to-slate-950/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
        </div>

        {/* Animated particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-brand-400/60"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{ y: [-10, 10, -10], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-widest mb-6">
              <Zap size={12} className="text-amber-400" />
              AI-Powered Travel Planning
            </span>

            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Start Your{" "}
              <span className="bg-gradient-to-r from-brand-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent">
                Journey
              </span>
            </h2>

            <p className="text-slate-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Let our AI craft your perfect trip in seconds. Thousands of destinations, one intelligent platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/ai-planner"
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-500 text-white font-bold text-lg shadow-2xl shadow-brand-600/40 hover:shadow-brand-600/60 hover:scale-105 transition-all duration-300"
              >
                <Sparkles size={20} />
                Plan with AI
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={() => setPlaying(true)}
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Play size={14} className="text-white ml-0.5" />
                </div>
                Watch Video
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video modal */}
      {playing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center p-4"
          onClick={() => setPlaying(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl aspect-video bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center text-slate-400">
              <Play size={48} className="mx-auto mb-4 text-brand-400" />
              <p className="text-lg font-semibold text-white">Travel Showcase Video</p>
              <p className="text-sm mt-1">Video player would render here</p>
            </div>
            <button
              onClick={() => setPlaying(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center justify-center hover:bg-slate-700 transition-colors"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

// ─── 8. PopularDestinations ────────────────────────────────────────────────────

const destinations = [
  { name: "Santorini", country: "Greece", rating: 4.9, price: "$1,299", tag: "Romantic", img: "/api/placeholder/400/300" },
  { name: "Kyoto", country: "Japan", rating: 4.8, price: "$1,099", tag: "Cultural", img: "/api/placeholder/400/300" },
  { name: "Bali", country: "Indonesia", rating: 4.9, price: "$899", tag: "Tropical", img: "/api/placeholder/400/300" },
  { name: "Machu Picchu", country: "Peru", rating: 4.7, price: "$1,499", tag: "Adventure", img: "/api/placeholder/400/300" },
  { name: "Amalfi Coast", country: "Italy", rating: 4.8, price: "$1,399", tag: "Scenic", img: "/api/placeholder/400/300" },
  { name: "Maldives", country: "Indian Ocean", rating: 5.0, price: "$2,199", tag: "Luxury", img: "/api/placeholder/400/300" },
];

export function PopularDestinations() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-slate-950 py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <div>
            <SectionLabel>Top Picks</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">
              Popular{" "}
              <span className="bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">
                destinations
              </span>
            </h2>
          </div>
          <Link
            href="/destinations"
            className="flex items-center gap-2 text-brand-400 hover:text-brand-300 font-semibold transition-colors group"
          >
            View all destinations
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700 snap-x snap-mandatory"
          style={{ scrollbarWidth: "thin" }}
        >
          {destinations.map((d, i) => (
            <motion.div
              key={d.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeIn}
              whileHover={{ y: -6 }}
              className="flex-shrink-0 w-72 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-slate-600 transition-all duration-300 group cursor-pointer snap-start"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.img}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand-600/90 text-white text-xs font-semibold backdrop-blur-sm">
                  {d.tag}
                </span>
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <span className="text-white text-xs font-bold">{d.rating}</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-white font-bold text-lg">{d.name}</h3>
                  <span className="text-brand-400 font-black text-lg">{d.price}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-4">
                  <MapPin size={13} />
                  {d.country}
                </div>
                <Link
                  href="/packages"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white text-sm font-semibold transition-all duration-300 border border-slate-700 hover:border-brand-600"
                >
                  Explore Package <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 9. MobileAppPromo ─────────────────────────────────────────────────────────

const appFeatures = [
  { icon: Bell, text: "Real-time booking notifications" },
  { icon: MapPin, text: "Offline maps & itineraries" },
  { icon: Sparkles, text: "AI trip planner on the go" },
  { icon: Shield, text: "Secure in-app payments" },
  { icon: Clock, text: "24/7 live chat support" },
  { icon: Star, text: "Exclusive app-only deals" },
];

export function MobileAppPromo() {
  return (
    <section className="bg-slate-900 py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <SectionLabel>Mobile App</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-5">
              Your trip in{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-brand-400 bg-clip-text text-transparent">
                your pocket
              </span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Download the TravelAI app and manage every aspect of your journey — from planning to check-in — right from your phone.
            </p>

            <ul className="space-y-3 mb-10">
              {appFeatures.map((f, i) => (
                <motion.li
                  key={f.text}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-600/20 border border-brand-600/30 flex items-center justify-center flex-shrink-0">
                    <f.icon size={15} className="text-brand-400" />
                  </div>
                  <span className="text-slate-300 text-sm">{f.text}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white text-slate-900 font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Download size={20} />
                <div className="text-left">
                  <div className="text-xs text-slate-500 leading-none">Download on the</div>
                  <div className="text-sm font-black leading-tight">App Store</div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-white font-bold hover:border-slate-500 transition-all duration-300"
              >
                <Smartphone size={20} className="text-brand-400" />
                <div className="text-left">
                  <div className="text-xs text-slate-500 leading-none">Get it on</div>
                  <div className="text-sm font-black leading-tight">Google Play</div>
                </div>
              </motion.button>
            </div>
          </motion.div>

          {/* Right: phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600/30 to-cyan-500/20 rounded-[3rem] blur-3xl scale-110" />

              {/* Phone frame */}
              <div className="relative w-64 h-[520px] rounded-[3rem] bg-slate-950 border-4 border-slate-700 overflow-hidden shadow-2xl shadow-brand-600/20">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-950 rounded-b-2xl z-10" />

                {/* Screen content */}
                <div className="h-full bg-gradient-to-b from-slate-900 to-slate-950 pt-8">
                  {/* App header */}
                  <div className="px-5 pt-4 pb-3 flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-xs">Good morning ✈️</p>
                      <p className="text-white font-bold text-sm">Where to next?</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-cyan-500 flex items-center justify-center">
                      <User size={14} className="text-white" />
                    </div>
                  </div>

                  {/* Search bar */}
                  <div className="mx-4 mb-4 px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-2">
                    <Search size={13} className="text-slate-500" />
                    <span className="text-slate-500 text-xs">Search destinations...</span>
                  </div>

                  {/* Featured card */}
                  <div className="mx-4 rounded-2xl overflow-hidden mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/api/placeholder/300/140" alt="Featured" className="w-full h-28 object-cover" />
                    <div className="bg-slate-800 p-3">
                      <p className="text-white font-bold text-xs">Bali, Indonesia</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-brand-400 font-black text-sm">$899</span>
                        <div className="flex items-center gap-1">
                          <Star size={10} className="text-amber-400 fill-amber-400" />
                          <span className="text-slate-400 text-xs">4.9</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mini cards row */}
                  <div className="px-4 flex gap-2">
                    {["Kyoto", "Santorini"].map((name) => (
                      <div key={name} className="flex-1 rounded-xl bg-slate-800 p-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/api/placeholder/120/70" alt={name} className="w-full h-12 object-cover rounded-lg mb-1.5" />
                        <p className="text-white text-xs font-semibold">{name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-6 top-20 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <div>
                    <p className="text-white text-xs font-bold">4.9 Rating</p>
                    <p className="text-slate-500 text-xs">50K+ reviews</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-8 bottom-24 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-600 to-cyan-500 flex items-center justify-center">
                    <Sparkles size={11} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">AI Planned</p>
                    <p className="text-slate-500 text-xs">In 30 seconds</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── 10. FinalCTA ──────────────────────────────────────────────────────────────

export function FinalCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="bg-slate-950 py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Newsletter */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="rounded-3xl bg-slate-900 border border-slate-800 p-10 mb-10 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-cyan-500 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-brand-600/30">
            <Mail size={26} className="text-white" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-3">
            Get exclusive travel deals
          </h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Join 50,000+ travellers who receive our weekly deals, destination guides, and AI travel tips.
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold max-w-sm mx-auto"
            >
              <span className="text-2xl">🎉</span>
              You&apos;re in! Check your inbox for a welcome gift.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-5 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none transition-colors text-sm"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 hover:shadow-brand-600/50 transition-all duration-300 whitespace-nowrap"
              >
                Subscribe Free
              </motion.button>
            </form>
          )}

          <p className="text-slate-600 text-xs mt-4">No spam, ever. Unsubscribe anytime.</p>
        </motion.div>

        {/* Big CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-cyan-600" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.3),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.3),transparent_60%)]" />

          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 border border-white/10" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 border border-white/10" />

          <div className="relative z-10 p-12 text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-5xl mb-5 inline-block"
            >
              ✈️
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Ready for your next adventure?
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
              Over 100 destinations, AI-crafted itineraries, and unbeatable prices — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/ai-planner"
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-brand-700 font-black text-lg shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300"
              >
                <Sparkles size={20} />
                Plan My Trip with AI
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/packages"
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/15 border border-white/30 text-white font-bold text-lg hover:bg-white/25 transition-all duration-300 backdrop-blur-sm"
              >
                Browse Packages
              </Link>
            </div>

            {/* Social proof strip */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-8 border-t border-white/20">
              {[
                { icon: Users, text: "50K+ travelers" },
                { icon: Star, text: "4.9 avg rating" },
                { icon: Globe, text: "100+ destinations" },
                { icon: Shield, text: "Secure booking" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-white/70 text-sm">
                  <item.icon size={15} className="text-white/50" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Default export: all sections ──────────────────────────────────────────────

export default function HomeSections() {
  return (
    <>
      <HowItWorks />
      <TravelStyles />
      <LiveStats />
      <SeasonalDeals />
      <TrustBadges />
      <PartnerLogos />
      <VideoHeroCTA />
      <PopularDestinations />
      <MobileAppPromo />
      <FinalCTA />
    </>
  );
}
