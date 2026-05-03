"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plane,
  Sparkles,
  Globe,
  Shield,
  Heart,
  Users,
  Award,
  Target,
  Zap,
  ArrowRight,
  MapPin,
  Star,
  CheckCircle,
  ExternalLink,
  Mail,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const team = [
  {
    name: "Aryan Mehta",
    role: "CEO & Co-Founder",
    bio: "Former Google engineer with a passion for making travel accessible to everyone through AI.",
    avatar: "/api/placeholder/120/120",
    socials: { linkedin: "#", twitter: "#", github: "#" },
  },
  {
    name: "Priya Sharma",
    role: "CTO & Co-Founder",
    bio: "AI/ML expert who built recommendation systems at Airbnb before founding TravelAI.",
    avatar: "/api/placeholder/120/120",
    socials: { linkedin: "#", twitter: "#", github: "#" },
  },
  {
    name: "Lucas Oliveira",
    role: "Head of Design",
    bio: "Award-winning UX designer obsessed with crafting seamless travel experiences.",
    avatar: "/api/placeholder/120/120",
    socials: { linkedin: "#", twitter: "#", github: "#" },
  },
  {
    name: "Aisha Rahman",
    role: "Head of Partnerships",
    bio: "Built global travel networks across 40+ countries, connecting travelers with authentic experiences.",
    avatar: "/api/placeholder/120/120",
    socials: { linkedin: "#", twitter: "#", github: "#" },
  },
];

const values = [
  {
    icon: <Sparkles className="text-brand-600" size={28} />,
    title: "Innovation First",
    description:
      "We push the boundaries of what's possible with AI to make travel planning smarter, faster, and more personal.",
  },
  {
    icon: <Heart className="text-rose-500" size={28} />,
    title: "Traveler-Centric",
    description:
      "Every feature we build starts with one question: does this make the traveler's life better?",
  },
  {
    icon: <Shield className="text-green-500" size={28} />,
    title: "Trust & Safety",
    description:
      "Your data, your privacy. We never sell your information and use industry-leading security standards.",
  },
  {
    icon: <Globe className="text-accent-500" size={28} />,
    title: "Global Perspective",
    description:
      "We celebrate diversity and build for travelers from every corner of the world.",
  },
  {
    icon: <Target className="text-orange-500" size={28} />,
    title: "Precision",
    description:
      "Our AI doesn't guess — it learns your preferences and delivers recommendations that actually fit.",
  },
  {
    icon: <Zap className="text-yellow-500" size={28} />,
    title: "Speed & Simplicity",
    description:
      "Plan a full trip in minutes, not hours. We respect your time as much as you do.",
  },
];

const milestones = [
  { year: "2021", event: "TravelAI founded in Bangalore, India" },
  { year: "2022", event: "Launched AI itinerary planner — 10K users in first month" },
  { year: "2023", event: "Expanded to 50+ countries, raised Series A funding" },
  { year: "2024", event: "Reached 50K happy travelers, launched mobile app" },
  { year: "2025", event: "Introduced Gemini-powered travel assistant" },
];

const stats = [
  { number: "50K+", label: "Happy Travelers", icon: <Users size={24} /> },
  { number: "100+", label: "Destinations", icon: <MapPin size={24} /> },
  { number: "4.9★", label: "Average Rating", icon: <Star size={24} /> },
  { number: "40+", label: "Countries Covered", icon: <Globe size={24} /> },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-accent-600">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Plane size={16} className="-rotate-45" />
              Our Story
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Travel Smarter,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-brand-300">
                Live Deeper
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-brand-100 max-w-3xl mx-auto leading-relaxed"
            >
              We're on a mission to make world-class travel accessible to everyone — powered by AI, driven by passion.
            </motion.p>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="white" className="dark:fill-slate-900" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="text-center p-6 rounded-2xl bg-brand-50 dark:bg-slate-800 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-3 text-brand-600">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-brand-600 font-semibold text-sm uppercase tracking-widest">Our Mission</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mt-3 mb-6 leading-tight">
                Making the world feel{" "}
                <span className="text-brand-600">smaller</span>, one trip at a time
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Travel shouldn't be stressful. It should be the best part of your year. We built TravelAI because we believe everyone deserves a personal travel expert — one that knows your taste, respects your budget, and never sleeps.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                By combining cutting-edge AI with deep travel expertise, we've created a platform that feels less like a booking tool and more like a trusted friend who's been everywhere.
              </p>
              <div className="space-y-3">
                {[
                  "Personalized AI recommendations for every traveler",
                  "Transparent pricing with no hidden fees",
                  "24/7 AI support in your language",
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-green-500 shrink-0" size={20} />
                    <span className="text-slate-700 dark:text-slate-300">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center">
                <div className="text-center text-white p-12">
                  <Globe size={80} className="mx-auto mb-6 opacity-80" />
                  <p className="text-2xl font-bold">Explore the World</p>
                  <p className="text-brand-100 mt-2">100+ destinations and counting</p>
                </div>
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-xl">
                  <Award className="text-green-600" size={24} />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">Top Rated</div>
                  <div className="text-xs text-slate-500">Travel Platform 2024</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="text-brand-600 font-semibold text-sm uppercase tracking-widest">
              What We Stand For
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mt-3 mb-4">
              Our Core Values
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              These aren't just words on a wall — they're the principles behind every decision we make.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {values.map((value, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="p-8 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800"
              >
                <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl w-fit">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-gradient-to-br from-brand-50 to-accent-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="text-brand-600 font-semibold text-sm uppercase tracking-widest">
              How We Got Here
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mt-3 mb-4">
              Our Journey
            </motion.h2>
          </motion.div>

          <div className="max-w-3xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-brand-200 dark:bg-brand-800" />

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={stagger}
              className="space-y-10"
            >
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="flex items-start gap-8 pl-4"
                >
                  <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-brand-600 text-white text-xs font-bold shrink-0 shadow-lg shadow-brand-500/30">
                    {i + 1}
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md flex-1 hover:shadow-lg transition-shadow">
                    <span className="text-brand-600 font-bold text-lg">{m.year}</span>
                    <p className="text-slate-700 dark:text-slate-300 mt-1">{m.event}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="text-brand-600 font-semibold text-sm uppercase tracking-widest">
              The People Behind It
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mt-3 mb-4">
              Meet the Team
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              A small team with a big dream — to change how the world travels.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="text-center group"
              >
                <div className="relative mx-auto w-28 h-28 mb-5">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-28 h-28 rounded-2xl object-cover shadow-lg group-hover:shadow-xl transition-shadow"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-600/20 to-accent-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{member.name}</h3>
                <p className="text-brand-600 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 px-2">
                  {member.bio}
                </p>
                <div className="flex justify-center gap-3">
                  <a href={member.socials.linkedin} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-100 dark:hover:bg-brand-900 text-slate-500 hover:text-brand-600 transition-colors">
                    <ExternalLink size={16} />
                  </a>
                  <a href={member.socials.twitter} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-100 dark:hover:bg-brand-900 text-slate-500 hover:text-brand-600 transition-colors">
                    <ExternalLink size={16} />
                  </a>
                  <a href={member.socials.github} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-100 dark:hover:bg-brand-900 text-slate-500 hover:text-brand-600 transition-colors">
                    <ExternalLink size={16} />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-brand-600 to-accent-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to start your adventure?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
              Join 50,000+ travelers who plan smarter with TravelAI.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/explore"
                className="bg-white text-brand-700 hover:bg-brand-50 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center gap-2 justify-center"
              >
                Start Exploring
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/ai-planner"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 inline-flex items-center gap-2 justify-center"
              >
                <Sparkles size={20} />
                Try AI Planner
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-12 flex items-center justify-center gap-2 text-brand-100">
              <Mail size={18} />
              <span>Questions? Reach us at </span>
              <a href="mailto:hello@travelai.com" className="text-white font-medium hover:underline">
                hello@travelai.com
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
