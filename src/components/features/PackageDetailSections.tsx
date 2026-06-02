"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Shield, CheckCircle, XCircle, AlertTriangle,
  ChevronDown, ChevronUp, Star, Users, Award, Clock,
  MessageSquare, ExternalLink, Info,
} from "lucide-react";
import { TravelPackage } from "@/types/package";

// ─── Availability Badge ───────────────────────────────────────────────────────
export function AvailabilityBadge({ pkg }: { pkg: TravelPackage }) {
  const maxGuests = pkg.maxGuests ?? 20;
  const booked = pkg.bookedSlots ?? 0;
  const available = maxGuests - booked;
  const isAvailable = pkg.isAvailable !== false && available > 0;
  const pct = Math.round((booked / maxGuests) * 100);
  const isAlmostFull = pct >= 70;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Users size={16} className="text-cyan-400" />
          Availability
        </h3>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
          isAvailable
            ? isAlmostFull
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              : "bg-green-500/20 text-green-300 border border-green-500/30"
            : "bg-red-500/20 text-red-300 border border-red-500/30"
        }`}>
          {isAvailable ? (
            <><CheckCircle size={12} />{isAlmostFull ? "Almost Full" : "Available"}</>
          ) : (
            <><XCircle size={12} />Sold Out</>
          )}
        </span>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>{booked} booked</span>
          <span>{available} spots left</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8 }}
            className={`h-full rounded-full ${
              pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-green-500"
            }`}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">{pct}% booked · {maxGuests} total capacity</p>
      </div>

      {isAlmostFull && isAvailable && (
        <div className="flex items-center gap-2 text-amber-400 text-xs bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
          <AlertTriangle size={13} />
          Only {available} spot{available !== 1 ? "s" : ""} remaining — book soon!
        </div>
      )}
    </div>
  );
}

// ─── Location Map ─────────────────────────────────────────────────────────────
export function LocationMap({ pkg }: { pkg: TravelPackage }) {
  const destName = pkg.destination?.name || pkg.title;
  const country = pkg.destination?.country || "";
  const hasCoords = pkg.coordinates?.lat && pkg.coordinates?.lng;

  // Build Google Maps embed URL
  const query = encodeURIComponent(hasCoords ? `${pkg.coordinates!.lat},${pkg.coordinates!.lng}` : `${destName}, ${country}`);
  const embedUrl = `https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  const mapsLink = `https://www.google.com/maps/search/${query}`;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-slate-800">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <MapPin size={16} className="text-brand-400" />
          Location
        </h3>
        <a href={mapsLink} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors">
          Open in Maps <ExternalLink size={12} />
        </a>
      </div>

      {/* Map iframe — uses Google Maps embed */}
      <div className="relative h-56 bg-slate-800">
        <iframe
          title={`Map of ${destName}`}
          src={embedUrl}
          className="w-full h-full border-0 opacity-80"
          loading="lazy"
        />
        {/* Overlay with destination name */}
        <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur px-3 py-2 rounded-xl flex items-center gap-2">
          <MapPin size={14} className="text-brand-400" />
          <span className="text-white text-sm font-medium">{destName}{country ? `, ${country}` : ""}</span>
        </div>
        {/* Click overlay to open Google Maps */}
        <a href={mapsLink} target="_blank" rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-slate-950/40">
          <span className="bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <ExternalLink size={14} /> View on Google Maps
          </span>
        </a>
      </div>

      <div className="p-4 text-xs text-slate-500 flex items-center gap-1.5">
        <Info size={12} />
        Map shows approximate location. Exact meeting point provided after booking.
      </div>
    </div>
  );
}

// ─── Cancellation Policy ──────────────────────────────────────────────────────
const POLICIES = {
  flexible: {
    label: "Flexible",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    icon: <CheckCircle size={16} className="text-green-400" />,
    rules: [
      { days: "Any time before departure", refund: "Full refund", color: "text-green-400" },
      { days: "No cancellation fee", refund: "100% back", color: "text-green-400" },
    ],
    description: "Cancel anytime before your trip starts for a full refund. No questions asked.",
  },
  moderate: {
    label: "Moderate",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    icon: <Shield size={16} className="text-amber-400" />,
    rules: [
      { days: "30+ days before", refund: "Full refund", color: "text-green-400" },
      { days: "15–29 days before", refund: "50% refund", color: "text-amber-400" },
      { days: "7–14 days before", refund: "25% refund", color: "text-orange-400" },
      { days: "Less than 7 days", refund: "No refund", color: "text-red-400" },
    ],
    description: "Partial refunds available depending on how far in advance you cancel.",
  },
  strict: {
    label: "Strict",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    icon: <AlertTriangle size={16} className="text-red-400" />,
    rules: [
      { days: "30+ days before", refund: "50% refund", color: "text-amber-400" },
      { days: "Less than 30 days", refund: "No refund", color: "text-red-400" },
    ],
    description: "Limited refunds. We recommend purchasing travel insurance for this package.",
  },
};

export function CancellationPolicy({ policy = "moderate" }: { policy?: "flexible" | "moderate" | "strict" }) {
  const p = POLICIES[policy];
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Shield size={16} className="text-brand-400" />
          Cancellation Policy
        </h3>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${p.bg} ${p.color}`}>
          {p.icon}{p.label}
        </span>
      </div>

      <p className="text-slate-400 text-sm">{p.description}</p>

      <div className="space-y-2">
        {p.rules.map((rule, i) => (
          <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-800 last:border-0">
            <span className="text-slate-400 text-sm">{rule.days}</span>
            <span className={`text-sm font-semibold ${rule.color}`}>{rule.refund}</span>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-800/50 rounded-xl p-3">
        <Info size={12} className="shrink-0 mt-0.5" />
        Cancellations must be submitted through your booking dashboard. Processing takes 7–14 business days.
      </div>
    </div>
  );
}

// ─── Host Details ─────────────────────────────────────────────────────────────
export function HostDetails({ pkg }: { pkg: TravelPackage }) {
  const host = pkg.host || {
    name: "VoyageAI Tours",
    bio: "Professional travel operator with years of experience crafting unforgettable journeys.",
    responseRate: 98,
    totalTours: 150,
    joinedYear: 2021,
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
      <h3 className="font-semibold text-white flex items-center gap-2">
        <Award size={16} className="text-amber-400" />
        Your Host
      </h3>

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg shadow-brand-600/20">
          {host.avatar ? (
            <img src={host.avatar} alt={host.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            host.name.charAt(0).toUpperCase()
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white">{host.name}</p>
          <p className="text-slate-400 text-xs mt-0.5">Member since {host.joinedYear}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-slate-300">{pkg.rating?.toFixed(1)} · {pkg.numReviews} reviews</span>
          </div>
        </div>
      </div>

      {host.bio && <p className="text-slate-400 text-sm leading-relaxed">{host.bio}</p>}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Response Rate", value: `${host.responseRate}%`, icon: <MessageSquare size={14} className="text-cyan-400" /> },
          { label: "Total Tours", value: `${host.totalTours}+`, icon: <MapPin size={14} className="text-brand-400" /> },
          { label: "Years Active", value: `${new Date().getFullYear() - (host.joinedYear || 2021)}+`, icon: <Clock size={14} className="text-amber-400" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-800/60 rounded-xl p-3 text-center">
            <div className="flex justify-center mb-1">{stat.icon}</div>
            <p className="text-white font-bold text-sm">{stat.value}</p>
            <p className="text-slate-500 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      <Link href="/contact"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 text-sm font-medium transition-colors">
        <MessageSquare size={15} />
        Contact Host
      </Link>
    </div>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────
const DEFAULT_FAQS = [
  { question: "What's included in the package price?", answer: "The package price includes all listed inclusions such as accommodation, guided tours, and specified meals. Please check the inclusions list for exact details." },
  { question: "Can I customize the itinerary?", answer: "Yes! Contact our host to discuss customization options. Additional activities or upgrades may incur extra charges." },
  { question: "What happens if I need to cancel?", answer: "Cancellations are subject to our cancellation policy shown above. We recommend purchasing travel insurance for added protection." },
  { question: "Is travel insurance included?", answer: "Travel insurance is not included but strongly recommended. We can suggest reputable providers upon request." },
  { question: "What should I pack?", answer: "A detailed packing list will be sent to you after booking confirmation. Generally, pack for the local climate and any specific activities included." },
];

export function PackageFAQ({ faqs }: { faqs?: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
      <h3 className="font-semibold text-white flex items-center gap-2">
        <MessageSquare size={16} className="text-brand-400" />
        Frequently Asked Questions
      </h3>
      <div className="space-y-2">
        {items.map((faq, i) => (
          <div key={i} className="border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
            <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left">
              <span className="text-white text-sm font-medium pr-4">{faq.question}</span>
              {openIndex === i
                ? <ChevronUp size={16} className="text-brand-400 shrink-0" />
                : <ChevronDown size={16} className="text-slate-500 shrink-0" />}
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="px-4 pb-4 text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-3">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
