"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Clock, ArrowRight, Tag, TrendingUp, BookOpen } from "lucide-react";

const categories = ["All", "Destinations", "Tips & Tricks", "AI Travel", "Budget", "Sustainability", "Culture"];

const posts = [
  {
    slug: "10-hidden-gems-southeast-asia",
    title: "10 Hidden Gems in Southeast Asia",
    excerpt: "Discover lesser-known destinations that offer authentic cultural experiences away from the tourist crowds.",
    image: "/api/placeholder/800/450",
    category: "Destinations",
    date: "May 15, 2025",
    readTime: "5 min read",
    author: { name: "Aryan Mehta", avatar: "/api/placeholder/40/40" },
    featured: true,
  },
  {
    slug: "ai-travel-planning-guide",
    title: "How AI is Revolutionizing Travel Planning",
    excerpt: "From personalized itineraries to real-time recommendations, AI is changing how we explore the world.",
    image: "/api/placeholder/800/450",
    category: "AI Travel",
    date: "May 12, 2025",
    readTime: "7 min read",
    author: { name: "Priya Sharma", avatar: "/api/placeholder/40/40" },
    featured: true,
  },
  {
    slug: "budget-travel-europe-2025",
    title: "Budget Travel in Europe: 2025 Complete Guide",
    excerpt: "Explore Europe without breaking the bank. Our AI-powered tips help you save up to 40% on your trip.",
    image: "/api/placeholder/800/450",
    category: "Budget",
    date: "May 10, 2025",
    readTime: "9 min read",
    author: { name: "Lucas Oliveira", avatar: "/api/placeholder/40/40" },
    featured: false,
  },
  {
    slug: "sustainable-travel-tips",
    title: "Sustainable Travel: Making a Positive Impact",
    excerpt: "Learn how to travel responsibly and contribute positively to the destinations you visit.",
    image: "/api/placeholder/800/450",
    category: "Sustainability",
    date: "May 8, 2025",
    readTime: "6 min read",
    author: { name: "Aisha Rahman", avatar: "/api/placeholder/40/40" },
    featured: false,
  },
  {
    slug: "solo-travel-safety-guide",
    title: "The Ultimate Solo Travel Safety Guide",
    excerpt: "Everything you need to know to stay safe and confident while traveling alone around the world.",
    image: "/api/placeholder/800/450",
    category: "Tips & Tricks",
    date: "May 5, 2025",
    readTime: "8 min read",
    author: { name: "Aryan Mehta", avatar: "/api/placeholder/40/40" },
    featured: false,
  },
  {
    slug: "japanese-culture-travel",
    title: "Understanding Japanese Culture Before You Visit",
    excerpt: "A deep dive into customs, etiquette, and cultural nuances that will enrich your Japan experience.",
    image: "/api/placeholder/800/450",
    category: "Culture",
    date: "May 2, 2025",
    readTime: "10 min read",
    author: { name: "Priya Sharma", avatar: "/api/placeholder/40/40" },
    featured: false,
  },
];

const categoryColors: Record<string, string> = {
  Destinations: "bg-brand-500/20 text-brand-300",
  "AI Travel": "bg-purple-500/20 text-purple-300",
  Budget: "bg-green-500/20 text-green-300",
  Sustainability: "bg-accent-500/20 text-accent-300",
  "Tips & Tricks": "bg-yellow-500/20 text-yellow-300",
  Culture: "bg-orange-500/20 text-orange-300",
};

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = posts.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered.filter((p) => p.featured);
  const regular = filtered.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(27,113,245,0.12),transparent_60%)]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-500/30 text-brand-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen size={16} />
              Travel Inspiration
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-5">
              Stories &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">
                Guides
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Expert travel tips, destination guides, and AI-powered insights to fuel your next adventure.
            </p>
          </motion.div>

          {/* Search */}
          <div className="max-w-xl mx-auto relative mb-8">
            <Search size={18} className="absolute left-4 top-3.5 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-brand-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 pb-24">
        {/* Featured */}
        {featured.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-brand-400" />
              <h2 className="font-semibold text-white">Featured</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`} className="group block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors">
                    <div className="relative h-52 overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                      <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${categoryColors[post.category] || "bg-slate-700 text-slate-300"}`}>
                        {post.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-slate-400 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={post.author.avatar} alt={post.author.name} className="w-7 h-7 rounded-full" />
                          <span className="text-slate-400 text-xs">{post.author.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Clock size={12} />{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        {regular.length > 0 && (
          <section>
            <h2 className="font-semibold text-white mb-6">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regular.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link href={`/blog/${post.slug}`} className="group block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors h-full">
                    <div className="relative h-44 overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[post.category] || "bg-slate-700 text-slate-300"}`}>
                        {post.category}
                      </span>
                    </div>
                    <div className="p-5 space-y-3">
                      <h3 className="font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-slate-400 text-sm line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={11} />{post.readTime}</span>
                        <span className="text-brand-400 text-xs font-medium flex items-center gap-1">Read <ArrowRight size={12} /></span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <BookOpen size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400">No articles found. Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
