"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ChevronDown, ChevronUp } from "lucide-react";

const sections = [
  {
    title: "Information We Collect",
    content: `We collect information you provide directly to us, such as when you create an account, make a booking, or contact us for support. This includes:

• Name, email address, and password
• Payment information (processed securely via our payment partners)
• Travel preferences and booking history
• Communications you send us

We also automatically collect certain information when you use our services, including log data, device information, and cookies.`,
  },
  {
    title: "How We Use Your Information",
    content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Process bookings and send related confirmations
• Send promotional communications (with your consent)
• Personalize your experience using AI recommendations
• Detect and prevent fraud and abuse
• Comply with legal obligations

We never sell your personal data to third parties.`,
  },
  {
    title: "AI & Data Processing",
    content: `Our AI systems process your travel preferences and history to generate personalized recommendations. This processing is done to improve your experience and is governed by our legitimate interest in providing a quality service.

You can opt out of AI-powered personalization at any time through your account settings. Opting out will not affect your ability to use our core booking services.`,
  },
  {
    title: "Data Sharing",
    content: `We may share your information with:

• Travel partners and service providers necessary to fulfill your bookings
• Payment processors to handle transactions securely
• Analytics providers to help us understand usage patterns
• Law enforcement when required by law

All third parties are contractually required to protect your data and use it only for the specified purpose.`,
  },
  {
    title: "Data Security",
    content: `We implement industry-standard security measures including:

• AES-256 encryption for data at rest
• TLS 1.3 for data in transit
• Regular security audits and penetration testing
• Multi-factor authentication options
• Strict access controls for our team

Despite these measures, no system is 100% secure. We encourage you to use a strong, unique password for your account.`,
  },
  {
    title: "Your Rights",
    content: `Depending on your location, you may have the right to:

• Access the personal data we hold about you
• Correct inaccurate data
• Request deletion of your data
• Object to or restrict processing
• Data portability
• Withdraw consent at any time

To exercise these rights, contact us at privacy@travelai.com. We will respond within 30 days.`,
  },
  {
    title: "Cookies",
    content: `We use cookies and similar technologies to:

• Keep you logged in
• Remember your preferences
• Analyze how our services are used
• Deliver relevant advertising

You can control cookies through your browser settings. Disabling certain cookies may affect the functionality of our services.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through a prominent notice on our website. Your continued use of our services after the effective date constitutes acceptance of the updated policy.`,
  },
];

function AccordionItem({ title, content, index }: { title: string; content: string; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="border border-slate-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/50 transition-colors"
      >
        <span className="font-semibold text-white">{title}</span>
        {open ? <ChevronUp size={18} className="text-brand-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-500 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed whitespace-pre-line border-t border-slate-800 pt-4">
          {content}
        </div>
      )}
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(27,113,245,0.1),transparent_60%)]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-500/30 text-brand-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield size={16} />
              Privacy Policy
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Your Privacy Matters</h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We're committed to protecting your personal information. Last updated: May 1, 2025.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 md:px-6 pb-24">
        {/* Summary banner */}
        <div className="bg-brand-600/10 border border-brand-500/20 rounded-2xl p-6 mb-10 flex gap-4">
          <Shield size={24} className="text-brand-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-white mb-1">The short version</p>
            <p className="text-slate-400 text-sm">
              We collect only what we need, never sell your data, use AI to improve your experience with your consent, and give you full control over your information.
            </p>
          </div>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <AccordionItem title={section.title} content={section.content} index={i} />
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center text-slate-500 text-sm">
          Questions? Contact us at{" "}
          <a href="mailto:privacy@travelai.com" className="text-brand-400 hover:text-brand-300">
            privacy@travelai.com
          </a>
        </div>
      </div>
    </div>
  );
}
