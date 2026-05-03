import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft, Tag, Share2, BookOpen } from "lucide-react";

const posts: Record<string, any> = {
  "10-hidden-gems-southeast-asia": {
    title: "10 Hidden Gems in Southeast Asia",
    excerpt: "Discover lesser-known destinations that offer authentic cultural experiences away from the tourist crowds.",
    image: "/api/placeholder/1200/600",
    category: "Destinations",
    date: "May 15, 2025",
    readTime: "5 min read",
    author: { name: "Aryan Mehta", avatar: "/api/placeholder/48/48", role: "CEO & Co-Founder" },
    content: `
Southeast Asia is one of the world's most diverse and captivating regions. While destinations like Bali, Bangkok, and Singapore attract millions of visitors each year, there are countless hidden gems waiting to be discovered.

## 1. Kampot, Cambodia
Nestled along the Kampot River, this sleepy town offers a glimpse into authentic Cambodian life. Famous for its pepper plantations and French colonial architecture, Kampot is the perfect antidote to over-tourism.

## 2. Hsipaw, Myanmar
Tucked away in the Shan Hills, Hsipaw is a trekker's paradise. The journey there on the famous Gokteik Viaduct railway is an adventure in itself.

## 3. Mrauk U, Myanmar
Often called the "Bagan of the West," Mrauk U is home to hundreds of ancient temples scattered across rolling hills — and you'll likely have them all to yourself.

## 4. Don Det, Laos
Part of the 4,000 Islands archipelago in southern Laos, Don Det is a car-free island where time seems to stand still. Rent a bicycle and explore at your own pace.

## 5. Pu Luong, Vietnam
A nature reserve in northern Vietnam, Pu Luong offers terraced rice fields, traditional stilt houses, and some of the best hiking in the country — without the crowds of Sapa.

## Planning Your Visit
Our AI Travel Planner can help you create a custom itinerary for any of these destinations, complete with budget estimates, accommodation recommendations, and day-by-day schedules.
    `,
  },
  "ai-travel-planning-guide": {
    title: "How AI is Revolutionizing Travel Planning",
    excerpt: "From personalized itineraries to real-time recommendations, AI is changing how we explore the world.",
    image: "/api/placeholder/1200/600",
    category: "AI Travel",
    date: "May 12, 2025",
    readTime: "7 min read",
    author: { name: "Priya Sharma", avatar: "/api/placeholder/48/48", role: "CTO & Co-Founder" },
    content: `
Artificial intelligence is transforming every industry, and travel is no exception. From the moment you start dreaming about a trip to the day you return home, AI is making every step smarter, faster, and more personalized.

## Personalized Recommendations
Traditional travel planning meant hours of research across dozens of websites. AI changes this by learning your preferences — your budget, travel style, interests, and past trips — to deliver recommendations that actually fit you.

## Smart Itinerary Generation
Our AI can generate a complete day-by-day itinerary in seconds. It considers factors like opening hours, travel time between attractions, local events, and even weather patterns to create the optimal schedule.

## Real-Time Budget Optimization
AI continuously monitors prices and availability, alerting you to deals and suggesting cost-saving alternatives without compromising on experience quality.

## The Future of Travel
As AI continues to evolve, we'll see even more personalization — from AI travel companions that learn your preferences over time to predictive systems that suggest your next trip before you even start thinking about it.
    `,
  },
};

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = posts[params.slug];
  if (!post) return notFound();

  const relatedSlugs = Object.keys(posts).filter((s) => s !== params.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Image */}
      <div className="relative h-[50vh] overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto">
          <span className="inline-block px-3 py-1 bg-brand-600/80 text-white text-xs font-medium rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">{post.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        {/* Meta */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-8 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-xl" />
            <div>
              <p className="font-semibold text-white text-sm">{post.author.name}</p>
              <p className="text-slate-500 text-xs">{post.author.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <span>{post.date}</span>
            <span className="flex items-center gap-1"><Clock size={14} />{post.readTime}</span>
          </div>
        </div>

        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none
          prose-headings:text-white prose-headings:font-bold
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-p:text-slate-300 prose-p:leading-relaxed
          prose-strong:text-white
          prose-a:text-brand-400 prose-a:no-underline hover:prose-a:text-brand-300">
          {post.content.split('\n').map((line: string, i: number) => {
            if (line.startsWith('## ')) return <h2 key={i}>{line.replace('## ', '')}</h2>;
            if (line.trim() === '') return <br key={i} />;
            return <p key={i}>{line}</p>;
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-brand-600 to-accent-600 rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Ready to Plan Your Trip?</h3>
          <p className="text-white/80 mb-6">Let our AI create a personalized itinerary based on this article.</p>
          <Link href="/ai-planner" className="inline-flex items-center gap-2 bg-white text-brand-700 px-6 py-3 rounded-xl font-semibold hover:bg-brand-50 transition-colors">
            <BookOpen size={18} />
            Try AI Planner
          </Link>
        </div>

        {/* Related */}
        {relatedSlugs.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-bold text-white mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {relatedSlugs.map((slug) => {
                const related = posts[slug];
                return (
                  <Link key={slug} href={`/blog/${slug}`} className="group flex gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-colors">
                    <img src={related.image} alt={related.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                    <div>
                      <p className="font-semibold text-white text-sm group-hover:text-brand-300 transition-colors line-clamp-2">{related.title}</p>
                      <p className="text-slate-500 text-xs mt-1 flex items-center gap-1"><Clock size={11} />{related.readTime}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
