"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Sparkles,
  CreditCard,
  User,
  MapPin,
  Shield,
} from "lucide-react";

const categories = [
  { id: "all", label: "All Questions", icon: <HelpCircle size={16} /> },
  { id: "booking", label: "Booking", icon: <CreditCard size={16} /> },
  { id: "ai", label: "AI Features", icon: <Sparkles size={16} /> },
  { id: "account", label: "Account", icon: <User size={16} /> },
  { id: "travel", label: "Travel", icon: <MapPin size={16} /> },
  { id: "privacy", label: "Privacy & Security", icon: <Shield size={16} /> },
];

const faqs = [
  {
    category: "ai",
    question: "How does the AI travel recommendation work?",
    answer:
      "Our AI analyzes your preferences — budget, travel style, season, and interests — to suggest personalized destinations and packages. It learns from your booking history and browsing behavior to improve recommendations over time. The more you use VoyageAI, the smarter it gets for you.",
  },
  {
    category: "ai",
    question: "Is the AI itinerary planner free to use?",
    answer:
      "Yes! The AI itinerary planner is completely free. Simply go to the AI Planner page, fill in your destination, budget, travel style, and interests, and our Gemini-powered AI will generate a full day-by-day itinerary, budget breakdown, and destination recommendations in seconds.",
  },
  {
    category: "ai",
    question: "How accurate are the AI budget estimates?",
    answer:
      "Our AI provides estimates based on current market data, seasonal pricing, and aggregated user data. Estimates are typically within 10–20% of actual costs. Prices vary based on season, availability, and personal choices. Always treat AI estimates as a starting point for planning.",
  },
  {
    category: "ai",
    question: "Can I edit the AI-generated itinerary?",
    answer:
      "Currently, you can copy the AI-generated itinerary and modify it manually. We're working on a fully editable itinerary feature that will let you drag, drop, and customize every element directly in the app. This feature is coming soon!",
  },
  {
    category: "booking",
    question: "How do I make a booking?",
    answer:
      "Browse packages on the Explore or Packages page, click on a package you like, then click 'Book Now'. Select your travel dates, number of guests, and payment method. Use promo code VoyageAI20 for 20% off your first booking. You'll receive a confirmation email once your booking is processed.",
  },
  {
    category: "booking",
    question: "What payment methods are accepted?",
    answer:
      "We accept secure payments through Stripe, supporting major credit/debit cards (Visa, Mastercard, Amex, Discover). All transactions are fully encrypted with 256-bit SSL encryption for your security.",
  },
  {
    category: "booking",
    question: "Can I cancel or modify my booking?",
    answer:
      "Yes. Go to your User Dashboard → My Bookings, find the booking you want to cancel, and click 'Cancel'. Cancellation policies vary by package — generally, cancellations 30+ days before departure receive a full refund. Modifications can be requested by contacting our support team.",
  },
  {
    category: "booking",
    question: "What is the promo code VoyageAI20?",
    answer:
      "VoyageAI20 gives you a 20% discount on any booking. Enter it in the 'Promo Code' field on the booking page before confirming. The discount is applied automatically to your total price. This code is valid for all packages and has no expiry date.",
  },
  {
    category: "booking",
    question: "How long does it take to get a refund?",
    answer:
      "Refunds are processed within 7–14 business days after approval. The time it takes to appear in your account depends on your bank or payment provider. You'll receive an email confirmation when your refund is initiated.",
  },
  {
    category: "account",
    question: "How do I create an account?",
    answer:
      "Click 'Sign In' in the top navigation, then 'Sign up here'. Fill in your name, email, and a strong password. You can also sign in using the pre-seeded admin account to preview high-privilege settings.",
  },
  {
    category: "account",
    question: "I forgot my password. What do I do?",
    answer:
      "On the login page, click 'Forgot Password'. Enter your registered email and we'll send you a password reset link. The link expires after 1 hour for security. If you don't receive the email, check your spam folder or contact support.",
  },
  {
    category: "account",
    question: "How do I become an admin?",
    answer:
      "Admin access is granted by the system administrator. If you're setting up VoyageAI for your organization, run the createAdmin script in the backend (npx tsx src/utils/createAdmin.ts) or contact us at admin@VoyageAI.com.",
  },
  {
    category: "travel",
    question: "Are the travel packages real?",
    answer:
      "All packages listed on VoyageAI are curated travel offerings with complete details on inclusions, itineraries, and tour operators. Booking options, reviews, and 24/7 AI-driven personalization are fully integrated and live.",
  },
  {
    category: "travel",
    question: "Does VoyageAI support international travel?",
    answer:
      "Yes! Our AI can recommend and plan trips to destinations worldwide. The platform supports packages across Asia, Europe, Americas, Africa, and beyond. Use the Explore page to filter by destination, or ask our AI Planner for recommendations based on your preferences.",
  },
  {
    category: "travel",
    question: "Can I get travel insurance through VoyageAI?",
    answer:
      "Travel insurance integration is on our roadmap. Currently, we recommend purchasing travel insurance separately through reputable providers. Our AI can include insurance cost estimates in your budget breakdown when you use the AI Planner.",
  },
  {
    category: "privacy",
    question: "Is my personal data safe?",
    answer:
      "Absolutely. We use AES-256 encryption for data at rest and TLS 1.3 for data in transit. We never sell your personal data to third parties. Your data is used only to improve your experience on VoyageAI. Read our full Privacy Policy for details.",
  },
  {
    category: "privacy",
    question: "How do I delete my account?",
    answer:
      "Go to User Dashboard → Settings → Danger Zone → Delete Account. This will permanently delete your account and all associated data. This action cannot be undone. If you're having issues, contact privacy@VoyageAI.com.",
  },
  {
    category: "privacy",
    question: "Does VoyageAI use cookies?",
    answer:
      "Yes, we use essential cookies to keep you logged in and remember your preferences, and analytics cookies to understand how our platform is used. You can manage cookie preferences through your browser settings. Disabling essential cookies may affect platform functionality.",
  },
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between p-5 text-left gap-4"
      >
        <span className="font-medium text-white text-sm md:text-base leading-snug">{question}</span>
        <span className="shrink-0 mt-0.5">
          {open
            ? <ChevronUp size={18} className="text-brand-400" />
            : <ChevronDown size={18} className="text-slate-500" />}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = faqs.filter((f) => {
    const matchCat = activeCategory === "all" || f.category === activeCategory;
    const matchSearch =
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(27,113,245,0.12),transparent_60%)]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-500/30 text-brand-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <HelpCircle size={16} />
              FAQ
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-5">
              Frequently Asked{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">
                Questions
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Everything you need to know about VoyageAI. Can't find your answer?{" "}
              <Link href="/contact" className="text-brand-400 hover:text-brand-300 transition-colors">
                Contact us
              </Link>
              .
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search size={18} className="absolute left-4 top-3.5 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 pb-24">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? "bg-brand-600 text-white"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              {cat.icon}
              {cat.label}
              <span className="text-xs opacity-60 ml-0.5">
                ({cat.id === "all" ? faqs.length : faqs.filter((f) => f.category === cat.id).length})
              </span>
            </button>
          ))}
        </div>

        {/* Results count */}
        {search && (
          <p className="text-slate-500 text-sm mb-5">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
          </p>
        )}

        {/* FAQ list */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
            <HelpCircle size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-300 font-medium">No questions found</p>
            <p className="text-slate-500 text-sm mt-1">Try a different search term or category</p>
          </div>
        )}

        {/* Still need help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            <MessageCircle size={28} className="text-white mb-3" />
            <h3 className="font-bold text-white text-lg mb-2">Still have questions?</h3>
            <p className="text-brand-100 text-sm mb-4">Our support team is ready to help you.</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-brand-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-50 transition-colors"
            >
              Contact Support
            </Link>
          </div>

          <div className="bg-gradient-to-br from-accent-600 to-accent-700 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            <Sparkles size={28} className="text-white mb-3" />
            <h3 className="font-bold text-white text-lg mb-2">Ask our AI</h3>
            <p className="text-accent-100 text-sm mb-4">Get instant answers from our AI travel assistant.</p>
            <Link
              href="/ai-planner"
              className="inline-flex items-center gap-2 bg-white text-accent-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-50 transition-colors"
            >
              Try AI Assistant
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
