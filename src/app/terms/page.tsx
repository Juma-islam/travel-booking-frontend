"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using TravelAI's website, mobile application, or any of our services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.

These terms apply to all visitors, users, and others who access or use our platform. We reserve the right to update these terms at any time, and your continued use of the platform constitutes acceptance of any changes.`,
  },
  {
    title: "2. Use of Services",
    content: `You may use our services only for lawful purposes and in accordance with these Terms. You agree not to:

• Use the service in any way that violates applicable laws or regulations
• Attempt to gain unauthorized access to any part of the platform
• Transmit any unsolicited or unauthorized advertising or promotional material
• Impersonate any person or entity or misrepresent your affiliation
• Engage in any conduct that restricts or inhibits anyone's use of the platform
• Use automated tools to scrape, crawl, or extract data without permission`,
  },
  {
    title: "3. Account Registration",
    content: `To access certain features, you must create an account. You agree to:

• Provide accurate, current, and complete information during registration
• Maintain and promptly update your account information
• Keep your password confidential and not share it with others
• Notify us immediately of any unauthorized use of your account
• Accept responsibility for all activities that occur under your account

We reserve the right to suspend or terminate accounts that violate these terms.`,
  },
  {
    title: "4. Booking & Payments",
    content: `When you make a booking through TravelAI:

• All prices are displayed in USD unless otherwise stated
• Prices are subject to change until a booking is confirmed
• Payment is processed securely through our payment partners
• A booking confirmation will be sent to your registered email
• Bookings are subject to availability at the time of confirmation
• We act as an intermediary between you and travel service providers

TravelAI is not responsible for the quality of services provided by third-party travel operators.`,
  },
  {
    title: "5. Cancellation & Refunds",
    content: `Cancellation policies vary by package and service provider. General guidelines:

• Cancellations made 30+ days before departure: Full refund minus processing fee
• Cancellations made 15–29 days before departure: 50% refund
• Cancellations made 7–14 days before departure: 25% refund
• Cancellations made less than 7 days before departure: No refund

Refunds are processed within 7–14 business days. Some packages may have different cancellation terms, which will be clearly stated at the time of booking.`,
  },
  {
    title: "6. AI-Generated Content",
    content: `Our platform uses artificial intelligence to generate travel recommendations, itineraries, and other content. Please note:

• AI-generated content is provided for informational purposes only
• We do not guarantee the accuracy or completeness of AI recommendations
• Travel conditions, prices, and availability may change
• Always verify important travel information with official sources
• AI suggestions should not replace professional travel advice for complex trips

By using our AI features, you acknowledge these limitations.`,
  },
  {
    title: "7. Intellectual Property",
    content: `All content on TravelAI, including text, graphics, logos, images, and software, is the property of TravelAI or its content suppliers and is protected by intellectual property laws.

You may not reproduce, distribute, modify, or create derivative works without our express written permission. User-generated content (reviews, photos) remains your property, but you grant us a license to use it on our platform.`,
  },
  {
    title: "8. Privacy & Data",
    content: `Your use of TravelAI is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our services, you consent to the collection and use of your information as described in our Privacy Policy.

We implement industry-standard security measures to protect your data, but cannot guarantee absolute security of information transmitted over the internet.`,
  },
  {
    title: "9. Limitation of Liability",
    content: `To the maximum extent permitted by law, TravelAI shall not be liable for:

• Indirect, incidental, special, or consequential damages
• Loss of profits, data, or goodwill
• Service interruptions or errors
• Actions of third-party travel providers
• Force majeure events (natural disasters, pandemics, etc.)

Our total liability for any claim shall not exceed the amount you paid for the specific service giving rise to the claim.`,
  },
  {
    title: "10. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.

Any disputes arising from these Terms or your use of our services shall be subject to the exclusive jurisdiction of the courts located in Bangalore, Karnataka, India.

If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.`,
  },
];

function AccordionItem({ title, content, index }: { title: string; content: string; index: number }) {
  const [open, setOpen] = useState(index < 2);
  return (
    <div className="border border-slate-800 rounded-2xl overflow-hidden transition-colors hover:border-slate-700">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="font-semibold text-white text-sm md:text-base">{title}</span>
        {open
          ? <ChevronUp size={18} className="text-brand-400 shrink-0 ml-3" />
          : <ChevronDown size={18} className="text-slate-500 shrink-0 ml-3" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed whitespace-pre-line border-t border-slate-800 pt-4">
          {content}
        </div>
      )}
    </div>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(27,113,245,0.1),transparent_60%)]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-500/30 text-brand-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileText size={16} />
              Legal
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Terms &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">
                Conditions
              </span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Please read these terms carefully before using TravelAI. Last updated: May 1, 2025.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 md:px-6 pb-24">
        {/* Key points banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8"
        >
          <p className="text-sm font-semibold text-white mb-4">Key Points at a Glance</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Free to browse, account required to book",
              "AI content is informational, not guaranteed",
              "Cancellation policy varies by package",
              "Your data is protected per our Privacy Policy",
              "Disputes governed by Indian law",
              "We act as intermediary for travel services",
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-400">
                <CheckCircle size={15} className="text-green-400 shrink-0 mt-0.5" />
                {point}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <AccordionItem title={section.title} content={section.content} index={i} />
            </motion.div>
          ))}
        </div>

        <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
          <p className="text-slate-400 text-sm">
            Questions about these terms?{" "}
            <a href="/contact" className="text-brand-400 hover:text-brand-300 transition-colors font-medium">
              Contact our legal team
            </a>
            {" "}or email{" "}
            <a href="mailto:legal@travelai.com" className="text-brand-400 hover:text-brand-300 transition-colors">
              legal@travelai.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
