"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import {
  MapPin, Star, Calendar, Search, ArrowRight, Sparkles, Globe, Clock, Shield,
  Tag, Users, Heart, Plane, ChevronRight, ChevronLeft, Mountain, Umbrella, 
  Coffee, Camera, Play, CheckCircle, Smartphone
} from "lucide-react";

export default function Home() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [destinationsLoading, setDestinationsLoading] = useState(true);
  const [packages, setPackages] = useState<any[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/destinations?isTrending=true`);
        if (!res.ok) return;
        const data = await res.json();
        setDestinations(data.slice(0, 8)); // Fetch top 8
      } catch {
        console.error("Failed to fetch destinations");
      } finally {
        setDestinationsLoading(false);
      }
    };

    const fetchPackages = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/packages?sort=rating`);
        if (!res.ok) return;
        const data = await res.json();
        setPackages(data.packages ? data.packages.slice(0, 6) : []); // Fetch top 6
      } catch {
        console.error("Failed to fetch packages");
      } finally {
        setPackagesLoading(false);
      }
    };

    fetchDestinations();
    fetchPackages();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 selection:bg-brand-500 selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover scale-105" style={{ filter: "brightness(0.65)" }}>
            <source src="https://videos.pexels.com/video-files/2882118/2882118-uhd_2560_1440_24fps.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center text-center mt-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-[0.2em] uppercase mb-6 shadow-2xl">
              ✨ Discover the world with AI
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight max-w-4xl drop-shadow-lg">
              Extraordinary travels <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400 font-serif italic font-medium">
                crafted just for you.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-12 drop-shadow-md font-medium">
              Experience the future of travel. Let our intelligent AI curate your perfect journey from flight to stay.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-5xl bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-2 md:p-3 flex flex-col md:flex-row items-center gap-2 backdrop-blur-2xl border border-white/20"
          >
            <div className="flex-1 w-full flex items-center px-4 py-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors group cursor-text">
              <MapPin className="text-brand-500 mr-3 group-hover:scale-110 transition-transform" size={22} />
              <div className="flex flex-col text-left w-full">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Location</span>
                <input type="text" placeholder="Where are you going?" className="bg-transparent border-none outline-none text-slate-900 dark:text-white font-bold text-sm md:text-base w-full placeholder-slate-400" />
              </div>
            </div>
            
            <div className="hidden md:block w-px h-12 bg-slate-200 dark:bg-slate-700"></div>
            
            <div className="flex-1 w-full flex items-center px-4 py-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors group cursor-text">
              <Calendar className="text-brand-500 mr-3 group-hover:scale-110 transition-transform" size={22} />
              <div className="flex flex-col text-left w-full">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Dates</span>
                <input type="text" placeholder="Add dates" className="bg-transparent border-none outline-none text-slate-900 dark:text-white font-bold text-sm md:text-base w-full placeholder-slate-400" />
              </div>
            </div>

            <div className="hidden md:block w-px h-12 bg-slate-200 dark:bg-slate-700"></div>

            <div className="flex-1 w-full flex items-center px-4 py-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors group cursor-text">
              <Users className="text-brand-500 mr-3 group-hover:scale-110 transition-transform" size={22} />
              <div className="flex flex-col text-left w-full">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Guests</span>
                <input type="text" placeholder="Add guests" className="bg-transparent border-none outline-none text-slate-900 dark:text-white font-bold text-sm md:text-base w-full placeholder-slate-400" />
              </div>
            </div>

            <Link href="/explore" className="w-full md:w-auto bg-brand-600 hover:bg-brand-500 text-white px-10 py-5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-brand-500/40 hover:shadow-brand-500/60">
              <Search size={20} />
              <span>Search</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. PARTNER LOGOS */}
      <section className="py-10 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-8">Trusted by world-class partners</p>
          <div className="flex justify-center gap-10 md:gap-20 items-center opacity-50 grayscale flex-wrap hover:grayscale-0 transition-all duration-700">
            {["SkyWings", "LuxStay", "OceanView", "AlpineTrails", "CityBreaks"].map((brand, i) => (
              <div key={i} className="flex items-center gap-2 hover:opacity-100 transition-opacity cursor-default">
                <Globe size={28} />
                <span className="text-2xl font-black tracking-tighter">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NEW & GORGEOUS: TRAVEL STYLES (CATEGORIES) */}
      <section className="py-28 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <span className="text-brand-600 font-bold tracking-widest uppercase text-xs mb-3 block">Curated Experiences</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Find Your Travel Style</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6">
            {[
              { icon: Mountain, name: "Adventure", img: "https://images.unsplash.com/photo-1533692328991-08159ff19fca?q=80&w=600" },
              { icon: Umbrella, name: "Beach", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600" },
              { icon: Coffee, name: "City Tour", img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=600" },
              { icon: Heart, name: "Romantic", img: "https://images.unsplash.com/photo-1494249465471-5655b7878482?q=80&w=600" },
              { icon: Camera, name: "Wildlife", img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=600" },
              { icon: Plane, name: "Global", img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600" }
            ].map((cat, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="group cursor-pointer relative h-64 md:h-80 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-500">
                    <cat.icon size={20} strokeWidth={2.5} />
                  </div>
                  <span className="font-bold text-white text-lg tracking-wide">{cat.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TOP DESTINATIONS (MASONRY-ISH GRID) */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <span className="text-brand-600 font-bold tracking-widest uppercase text-xs mb-3 block">Explore The World</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Top Destinations</h2>
            </div>
            <Link href="/explore" className="group flex items-center gap-2 text-slate-900 dark:text-white font-bold hover:text-brand-600 dark:hover:text-brand-400 transition-colors border-b-2 border-transparent hover:border-brand-600 pb-1">
              View all destinations <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>

          {destinationsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 h-[600px]">
              <div className="md:col-span-2 md:row-span-2 bg-slate-100 dark:bg-slate-800 rounded-[2rem] animate-pulse"></div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-[2rem] animate-pulse"></div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-[2rem] animate-pulse"></div>
              <div className="md:col-span-2 bg-slate-100 dark:bg-slate-800 rounded-[2rem] animate-pulse"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-[300px_300px] gap-4 md:gap-6 h-auto md:h-[624px]">
              {destinations.slice(0, 5).map((dest, i) => {
                const isLarge = i === 0;
                const isWide = i === 3;
                const fallbackImg = `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop`;
                return (
                  <Link 
                    href={`/destination/${dest._id || dest.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    key={dest._id || i}
                    className={`group relative rounded-[2rem] overflow-hidden block h-full shadow-lg hover:shadow-2xl transition-all duration-700
                      ${isLarge ? 'md:col-span-2 md:row-span-2' : isWide ? 'md:col-span-2 md:row-span-1' : 'md:col-span-1 md:row-span-1'}
                    `}
                  >
                    <img 
                      src={dest.imageUrl || fallbackImg} 
                      alt={dest.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                    
                    <div className="absolute top-6 left-6 flex gap-2">
                      <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 uppercase tracking-wider">
                        <MapPin size={12} /> {dest.country || "Global"}
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                      <div>
                        <h3 className={`${isLarge ? 'text-4xl md:text-5xl' : 'text-2xl'} font-black text-white mb-2 drop-shadow-md`}>{dest.name}</h3>
                        <div className="flex items-center gap-1.5 text-amber-400">
                          <Star size={16} className="fill-current" />
                          <span className="text-white font-bold text-sm shadow-sm">4.8</span>
                          <span className="text-slate-200 text-xs ml-1 font-medium">(2.4k reviews)</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/40 flex items-center justify-center transform group-hover:bg-white group-hover:text-slate-900 group-hover:-rotate-45 transition-all duration-500">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 5. NEW & GORGEOUS: WHY CHOOSE US (CORE VALUES) */}
      <section className="py-28 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920" alt="Mountain Background" className="w-full h-full object-cover opacity-15 mix-blend-luminosity scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-900"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
            <span className="text-amber-400 font-bold tracking-widest uppercase text-xs mb-3 block">Our Guarantees</span>
            <h2 className="text-4xl md:text-5xl font-black text-white">Why Travel With Us</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Tag, title: "Best Price", desc: "We ensure you get the absolute best prices available on the market, matching any competitor." },
              { icon: Shield, title: "Secure Booking", desc: "Your payments and personal data are protected by top-tier military-grade encryption." },
              { icon: Clock, title: "24/7 Support", desc: "Our travel experts and AI assistant are always here to help you, anytime, anywhere." },
              { icon: CheckCircle, title: "Verified Partners", desc: "We only work with highly rated hotels and certified, trusted tour operators globally." }
            ].map((item, i) => (
              <motion.div 
                key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group flex flex-col items-center text-center p-8 rounded-[2rem] bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 hover:-translate-y-2 transition-all duration-500 shadow-2xl"
              >
                <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-900 transition-all duration-500">
                  <item.icon size={28} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (AI FEATURES) */}
      <section className="py-28 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-brand-600 font-bold tracking-widest uppercase text-xs mb-3 block">Intelligent Planning</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Your personal AI Travel Agent</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
              Planning a trip used to take days. Now, it takes seconds. Our Gemini-powered AI crafts personalized itineraries based on your budget, style, and dreams.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: "Smart Itineraries", desc: "Get minute-by-minute plans perfectly optimized for location and time.", bg: "from-amber-400 to-orange-500" },
              { icon: Search, title: "Natural Search", desc: "Just say 'I want a romantic beach trip under $2000' and watch the magic happen.", bg: "from-cyan-400 to-blue-500" },
              { icon: Heart, title: "Personalized Match", desc: "Our AI learns your preferences to suggest hotels and activities you will absolutely love.", bg: "from-brand-400 to-indigo-500" }
            ].map((feat, i) => (
              <motion.div 
                key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feat.bg} opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`}></div>
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feat.bg} flex items-center justify-center mb-8 text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <feat.icon size={28} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 relative z-10">{feat.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium relative z-10">{feat.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/ai-planner" className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-full font-bold shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <Sparkles size={20} className="text-amber-400" /> <span>Try AI Planner Now</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. NEW & GORGEOUS: SEASONAL PROMO (SPLIT BANNER) */}
      <section className="py-12 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="rounded-[3rem] overflow-hidden flex flex-col md:flex-row relative shadow-2xl group">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1600" alt="Summer Promo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
            
            <div className="p-12 md:p-20 flex-1 text-white z-10 flex flex-col justify-center bg-gradient-to-r from-cyan-900/95 via-cyan-900/80 to-transparent backdrop-blur-sm">
              <span className="inline-block px-4 py-1.5 bg-amber-400 text-slate-900 font-black text-xs uppercase tracking-[0.2em] rounded-full mb-6 w-max shadow-lg">Summer Promo</span>
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight drop-shadow-md">Get up to 30% Off <br/><span className="text-cyan-300">Tropical Getaways</span></h2>
              <p className="text-cyan-50 text-lg mb-10 max-w-md font-medium leading-relaxed drop-shadow">Book your summer vacation early and enjoy exclusive discounts on luxury resorts in Bali, Maldives, and Hawaii.</p>
              <Link href="/packages" className="bg-white text-cyan-900 font-bold px-10 py-5 rounded-xl w-max hover:bg-slate-100 transition-colors shadow-xl flex items-center gap-2">
                View Deals <ArrowRight size={20} />
              </Link>
            </div>
            <div className="hidden md:block flex-1 z-10"></div>
          </div>
        </div>
      </section>

      {/* 8. FEATURED PACKAGES */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <span className="text-brand-600 font-bold tracking-widest uppercase text-xs mb-3 block">Curated For You</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Trending Packages</h2>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="pkg-prev w-14 h-14 rounded-full border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all shadow-sm">
                <ChevronLeft size={24} />
              </button>
              <button className="pkg-next w-14 h-14 rounded-full border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all shadow-sm">
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>

          {packagesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(n => <div key={n} className="h-[450px] bg-slate-200 dark:bg-slate-800 rounded-[2rem] animate-pulse"></div>)}
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-20 text-slate-500 font-medium">No packages found.</div>
          ) : (
            <Swiper
              modules={[Navigation, Autoplay]} spaceBetween={30} slidesPerView={1}
              breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              navigation={{ prevEl: '.pkg-prev', nextEl: '.pkg-next' }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              className="!pb-16"
            >
              {packages.map((pkg, i) => (
                <SwiperSlide key={pkg._id || i}>
                  <div className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl border border-slate-100 dark:border-slate-800/50 group h-full flex flex-col transition-all duration-500 hover:-translate-y-2">
                    <div className="relative h-64 overflow-hidden">
                      <img src={pkg.images?.[0] || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800"} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md text-slate-900 font-bold px-3 py-1.5 rounded-full text-xs flex items-center gap-1 shadow-lg">
                        <Star size={14} className="text-amber-500 fill-current" /> {pkg.rating || "4.5"}
                      </div>
                      <div className="absolute bottom-5 left-5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-bold flex items-center gap-2">
                        <Clock size={14} /> {pkg.duration?.days || 1}D / {pkg.duration?.nights || 1}N
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="text-xs text-brand-600 font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <MapPin size={14} /> {pkg.destination?.name || "Multiple Locations"}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 line-clamp-2 group-hover:text-brand-600 transition-colors">{pkg.title}</h3>
                      
                      <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                        {(pkg.inclusions || []).slice(0, 3).map((inc: string, idx: number) => (
                          <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-3 py-1.5 rounded-lg font-semibold">{inc}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/50">
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Starting from</p>
                          <p className="text-3xl font-black text-slate-900 dark:text-white">${pkg.price}</p>
                        </div>
                        <Link href={`/package/${pkg._id || pkg.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`} className="bg-slate-900 dark:bg-brand-600 text-white px-6 py-3 rounded-xl font-bold transition-colors hover:bg-brand-600 dark:hover:bg-brand-500 shadow-md">
                          Book
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* 9. NEW & GORGEOUS: INTERACTIVE / MOBILE APP CTA */}
      <section className="py-24 bg-white dark:bg-slate-900 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-16 md:gap-24 relative z-10">
          <div className="flex-1 relative order-2 md:order-1">
            <div className="absolute inset-0 bg-brand-500/10 rounded-full blur-[100px] transform scale-150"></div>
            <img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=600&auto=format&fit=crop" alt="App Preview" className="relative z-10 h-[500px] w-auto object-cover rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] mx-auto border-8 border-white dark:border-slate-800" />
            
            {/* Floating element */}
            <div className="absolute top-1/4 -right-10 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4 z-20 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><CheckCircle size={24} /></div>
              <div>
                <p className="text-xs text-slate-500 font-bold">Booking Confirmed</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">Maldives Trip</p>
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left order-1 md:order-2">
            <span className="text-brand-600 font-bold tracking-widest uppercase text-xs mb-3 block">Travel Everywhere</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">Take VoyageAI in your pocket</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 font-medium leading-relaxed">Download our mobile app to manage your bookings, get real-time AI assistance, and access offline itineraries on the go. Available for iOS and Android.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="flex items-center justify-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-xl font-bold shadow-xl hover:-translate-y-1 transition-transform">
                <Smartphone size={24} /> App Store
              </button>
              <button className="flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:-translate-y-1 transition-transform border border-slate-200 dark:border-slate-700">
                <Play size={24} /> Google Play
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. NEW & GORGEOUS: LATEST BLOG / ARTICLES */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <span className="text-brand-600 font-bold tracking-widest uppercase text-xs mb-3 block">Travel Inspiration</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Latest Travel Guides</h2>
            </div>
            <Link href="/blog" className="group flex items-center gap-2 text-slate-900 dark:text-white font-bold hover:text-brand-600 dark:hover:text-brand-400 transition-colors border-b-2 border-transparent hover:border-brand-600 pb-1">
              Read all articles <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "10 Hidden Gems in Southeast Asia for 2024", date: "April 15", category: "Guides", img: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=800" },
              { title: "How to Pack Light for a 2-Week Europe Trip", date: "April 10", category: "Tips", img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800" },
              { title: "The Ultimate Guide to Sustainable Travel", date: "April 02", category: "Eco Travel", img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800" }
            ].map((blog, i) => (
              <div key={i} className="group cursor-pointer bg-white dark:bg-slate-900 rounded-[2rem] p-4 shadow-md hover:shadow-xl transition-all duration-500 border border-slate-100 dark:border-slate-800">
                <div className="relative h-64 rounded-3xl overflow-hidden mb-6">
                  <img src={blog.img} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-xs font-black text-slate-900 uppercase tracking-wider">{blog.category}</div>
                </div>
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-3">
                    <Calendar size={14} /> <span>{blog.date}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors leading-snug mb-4">{blog.title}</h3>
                  <p className="text-brand-600 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">Read Article <ArrowRight size={16} /></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. STATS & TESTIMONIALS */}
      <section className="relative py-32 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920" alt="Background" className="w-full h-full object-cover opacity-20 scale-105 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-brand-950/90 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-28 text-center">
            {[
              { num: "50k+", label: "Happy Travelers" },
              { num: "120+", label: "Destinations" },
              { num: "15+", label: "Years Experience" },
              { num: "99%", label: "Satisfaction Rate" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-5xl md:text-7xl font-black text-white mb-3 drop-shadow-lg">{stat.num}</div>
                <div className="text-brand-300 font-bold tracking-[0.2em] uppercase text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-[3rem] p-10 md:p-16 shadow-2xl">
            <Swiper modules={[Pagination, Autoplay]} pagination={{ clickable: true }} autoplay={{ delay: 6000 }} className="pb-12 text-white">
              {[
                { name: "Sarah Jenkins", role: "Solo Traveler", img: "https://randomuser.me/api/portraits/women/44.jpg", quote: "The AI planner completely changed how I travel. It found hidden gems I never would have discovered on my own. Flawless experience!" },
                { name: "The Miller Family", role: "Family Vacation", img: "https://randomuser.me/api/portraits/men/32.jpg", quote: "Booking a trip for 5 used to be a nightmare. VoyageAI curated the perfect itinerary that kept both the kids and adults entertained." },
                { name: "David Chen", role: "Business & Leisure", img: "https://randomuser.me/api/portraits/men/46.jpg", quote: "I use this platform for all my trips now. The interface is gorgeous, the recommendations are spot-on, and the customer support is top tier." }
              ].map((t, i) => (
                <SwiperSlide key={i}>
                  <Star size={40} className="mx-auto text-amber-400 fill-amber-400 mb-8 opacity-80 drop-shadow-md" />
                  <h3 className="text-2xl md:text-3xl font-serif italic font-medium mb-10 leading-relaxed">"{t.quote}"</h3>
                  <div className="flex items-center justify-center gap-5">
                    <div className="w-16 h-16 rounded-full border-2 border-brand-400 overflow-hidden shadow-lg">
                      <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-lg text-white">{t.name}</p>
                      <p className="text-brand-300 text-sm font-medium">{t.role}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* 12. CTA / NEWSLETTER */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-br from-brand-600 to-cyan-600 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-[0_30px_60px_rgba(79,70,229,0.3)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
            
            <h2 className="text-4xl md:text-6xl font-black mb-6 relative z-10 drop-shadow-md">Don't miss the best deals</h2>
            <p className="text-lg md:text-xl text-brand-100 mb-12 max-w-2xl mx-auto relative z-10 font-medium">
              Subscribe to our newsletter and receive exclusive AI-curated travel itineraries, early bird discounts, and travel guides directly in your inbox.
            </p>
            
            <form className="relative z-10 max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/70 px-8 py-5 rounded-2xl outline-none focus:bg-white/20 transition-colors font-medium text-lg shadow-inner"
                required
              />
              <button className="bg-white text-brand-600 font-black px-10 py-5 rounded-2xl hover:bg-slate-50 transition-colors shadow-xl">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
