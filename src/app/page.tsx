"use client";
import HomeSections from "@/components/features/HomeSections";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import {
  Plane,
  MapPin,
  Star,
  Users,
  Calendar,
  Search,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Globe,
  Camera,
  Heart,
  Shield,
  Clock,
  Award,
  ChevronDown,
  Mail,
  Phone,
  MessageCircle
} from "lucide-react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
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
        setDestinations(data.slice(0, 6));
      } catch {
        // Backend not running â€” silently fail, static content shows
      } finally {
        setDestinationsLoading(false);
      }
    };

    const fetchPackages = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/packages?sort=rating`);
        if (!res.ok) return;
        const data = await res.json();
        setPackages(data.packages ? data.packages.slice(0, 3) : []);
      } catch {
        // Backend not running â€” silently fail
      } finally {
        setPackagesLoading(false);
      }
    };

    fetchDestinations();
    fetchPackages();
  }, []);

  const heroSlides = [
    {
      title: "Discover Your Dream Destination",
      subtitle: "AI-powered travel recommendations tailored just for you",
      image: "/api/placeholder/1920/1080",
      cta: "Start Planning"
    },
    {
      title: "Smart Itineraries Made Easy",
      subtitle: "Let our AI create perfect travel plans in seconds",
      image: "/api/placeholder/1920/1080",
      cta: "Try AI Planner"
    },
    {
      title: "Budget-Friendly Adventures",
      subtitle: "Find the best deals and save money on your trips",
      image: "/api/placeholder/1920/1080",
      cta: "Explore Deals"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            {/* Beautiful aerial beach travel video */}
            <source src="https://videos.pexels.com/video-files/2882118/2882118-uhd_2560_1440_24fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Overlays for better text readability and gorgeous effect */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-transparent to-transparent opacity-80"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
              {heroSlides[currentSlide].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/explore"
                className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {heroSlides[currentSlide].cta}
                <ArrowRight className="inline ml-2" size={20} />
              </Link>
              <Link
                href="/ai-planner"
                className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300"
              >
                <Sparkles className="inline mr-2" size={20} />
                AI Assistant
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown size={32} className="text-white" />
        </motion.div>
      </section>

      {/* AI Features Preview */}
      <section className="py-20 bg-gradient-to-br from-brand-50 to-accent-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Powered by Advanced AI
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Experience the future of travel planning with our intelligent AI features
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="text-brand-600" size={32} />,
                title: "Smart Recommendations",
                description: "Get personalized destination suggestions based on your preferences, budget, and travel history."
              },
              {
                icon: <Calendar className="text-brand-600" size={32} />,
                title: "AI Itinerary Planner",
                description: "Create perfect day-by-day travel plans with optimized routes and activity suggestions."
              },
              {
                icon: <Star className="text-brand-600" size={32} />,
                title: "Review Intelligence",
                description: "Understand thousands of reviews instantly with AI-powered summaries and sentiment analysis."
              },
              {
                icon: <MessageCircle className="text-brand-600" size={32} />,
                title: "Travel Assistant",
                description: "Chat with our AI assistant for instant answers to all your travel questions."
              },
              {
                icon: <Globe className="text-brand-600" size={32} />,
                title: "Smart Search",
                description: "Natural language search that understands your travel needs and preferences."
              },
              {
                icon: <Award className="text-brand-600" size={32} />,
                title: "Budget Optimization",
                description: "Find the best deals and optimize your travel budget with intelligent cost analysis."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-200 dark:bg-brand-900 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Top <span className="text-brand-600 italic underline decoration-brand-600">Destinations</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Explore the world's most beautiful places
            </motion.p>
          </motion.div>

          {destinationsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl h-[340px]"></div>
              ))}
            </div>
          ) : destinations.length === 0 ? (
             <div className="text-center text-slate-500 py-10">
                <p className="text-xl font-semibold mb-2">No destinations found.</p>
                <p>Please add some featured destinations from the admin dashboard.</p>
             </div>
          ) : (
            <div className="relative w-full max-w-[100vw] overflow-hidden">
              <Swiper
                modules={[Navigation, Autoplay]}
                grabCursor={true}
                slidesPerView="auto"
                spaceBetween={20}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                navigation={{
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom',
                }}
                className="w-full pt-2 pb-10 px-4"
              >
                {destinations.map((destination, index) => {
                  const pseudoPrice = (destination.name.length * 113 % 1000) + 499;
                  return (
                    <SwiperSlide key={destination._id || index} className="w-[240px] sm:w-[260px] md:w-[280px]">
                      <div className={`relative h-[340px] rounded-xl overflow-hidden group shadow-md transition-transform ${index % 2 !== 0 ? 'mt-8' : ''}`}>
                        <img
                          src={destination.imageUrl || "/api/placeholder/400/500"}
                          alt={destination.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Gradient overlay just like the image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Title at top left */}
                        <div className="absolute top-4 left-4 z-10">
                          <h3 className="text-xl font-bold text-white tracking-wide">
                            {destination.name}
                          </h3>
                        </div>

                        {/* Pricing at bottom left */}
                        <div className="absolute bottom-4 left-4 z-10">
                          <p className="text-white/90 text-xs font-medium mb-0.5">Starts From</p>
                          <p className="text-white text-lg font-bold drop-shadow-md">${pseudoPrice}</p>
                        </div>

                        {/* Circular arrow button at bottom right */}
                        <Link
                          href={`/destination/${destination._id || destination.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                          className="absolute bottom-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors shadow-md z-10"
                        >
                          <ArrowRight size={16} strokeWidth={2} className="text-slate-900" />
                        </Link>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              
              {/* Carousel navigation controls below the slider */}
              <div className="flex items-center justify-center mt-2 gap-4">
                <button className="swiper-button-prev-custom w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all z-10 bg-white shadow-sm">
                  <ArrowRight size={18} strokeWidth={1.5} className="rotate-180" />
                </button>
                <button className="swiper-button-next-custom w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all z-10 bg-white shadow-sm">
                  <ArrowRight size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/explore"
              className="group bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(37,99,235,0.3)] inline-flex items-center gap-2"
            >
              View All Destinations
              <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Packages */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Popular Packages
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Curated travel packages designed for different budgets and preferences, top-rated by our travelers
            </motion.p>
          </motion.div>

          {packagesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white dark:bg-slate-900 animate-pulse rounded-2xl h-[450px]"></div>
              ))}
            </div>
          ) : packages.length === 0 ? (
             <div className="text-center text-slate-500 py-10">
                <p className="text-xl font-semibold mb-2">No packages found.</p>
                <p>Please add some travel packages from the admin dashboard.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg._id || index}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col group"
                >
                  <div className="relative overflow-hidden h-56">
                    <img
                      src={pkg.images && pkg.images.length > 0 ? pkg.images[0] : "/api/placeholder/400/250"}
                      alt={pkg.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">
                      {pkg.duration?.days || 1} Days / {pkg.duration?.nights || 1} Nights
                    </div>
                    <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-500 fill-current" size={16} />
                        <span className="text-sm font-bold text-slate-800 dark:text-white">{pkg.rating || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-600 transition-colors">
                        {pkg.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center text-slate-600 dark:text-slate-300 text-sm mb-4">
                      <MapPin size={16} className="mr-1 text-brand-500" />
                      {pkg.destination?.name || 'Multiple Destinations'}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(pkg.inclusions || []).slice(0, 3).map((highlight: string, i: number) => (
                        <span key={i} className="bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 px-2 py-1 rounded text-xs font-medium border border-brand-100 dark:border-brand-800/50">
                          {highlight}
                        </span>
                      ))}
                      {pkg.inclusions && pkg.inclusions.length > 3 && (
                        <span className="bg-slate-50 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded text-xs font-medium">
                          +{pkg.inclusions.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Starting from</div>
                        <span className="text-2xl font-bold text-brand-600">${pkg.price}</span>
                      </div>
                      <Link
                        href={`/package/${pkg._id || pkg.title.toLowerCase().replace(/\s+/g, '-')}`}
                        className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-brand-600 hover:text-white px-5 py-2.5 rounded-xl font-medium transition-colors duration-300"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
            >
              View All Packages <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-brand-600 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { number: "50K+", label: "Happy Travelers" },
              { number: "100+", label: "Destinations" },
              { number: "4.9", label: "Average Rating" },
              { number: "24/7", label: "AI Support" }
            ].map((stat, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-brand-100">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              What Our Travelers Say
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Real experiences from real travelers who used our AI-powered platform
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                location: "New York, USA",
                rating: 5,
                text: "TravelAI completely transformed my travel planning experience. The AI recommendations were spot-on, and I saved both time and money!",
                avatar: "/api/placeholder/60/60"
              },
              {
                name: "Michael Chen",
                location: "Toronto, Canada",
                rating: 5,
                text: "The itinerary planner created the perfect 2-week European tour for my family. Everything was perfectly timed and we had an amazing trip.",
                avatar: "/api/placeholder/60/60"
              },
              {
                name: "Emma Rodriguez",
                location: "Madrid, Spain",
                rating: 5,
                text: "As a solo traveler, I felt safe and well-prepared thanks to TravelAI's detailed recommendations and safety information.",
                avatar: "/api/placeholder/60/60"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-500 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Categories */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Travel Your Way
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Choose from a variety of travel styles and experiences
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Adventure", icon: "ðŸ”ï¸", description: "Thrilling outdoor activities" },
              { name: "Culture", icon: "ðŸ›ï¸", description: "Historical and cultural sites" },
              { name: "Relaxation", icon: "ðŸ–ï¸", description: "Peaceful beach getaways" },
              { name: "City Break", icon: "ðŸ™ï¸", description: "Urban exploration" },
              { name: "Nature", icon: "ðŸŒ²", description: "Natural wonders and wildlife" },
              { name: "Luxury", icon: "âœ¨", description: "Premium experiences" },
              { name: "Family", icon: "ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦", description: "Family-friendly destinations" },
              { name: "Solo", icon: "ðŸ§³", description: "Solo traveler adventures" }
            ].map((category, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {category.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Travel Inspiration
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Discover travel tips, destination guides, and inspiring stories
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "10 Hidden Gems in Southeast Asia",
                excerpt: "Discover lesser-known destinations that offer authentic cultural experiences away from the tourist crowds.",
                image: "/api/placeholder/400/250",
                date: "March 15, 2024",
                readTime: "5 min read"
              },
              {
                title: "Sustainable Travel: Making a Difference",
                excerpt: "Learn how to travel responsibly and contribute positively to the destinations you visit.",
                image: "/api/placeholder/400/250",
                date: "March 12, 2024",
                readTime: "7 min read"
              },
              {
                title: "Photography Tips for Travel Enthusiasts",
                excerpt: "Capture stunning memories with these professional photography tips for your next adventure.",
                image: "/api/placeholder/400/250",
                date: "March 10, 2024",
                readTime: "6 min read"
              }
            ].map((post, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    className="text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-2"
                  >
                    Read More
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
            >
              View All Articles
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Get answers to common questions about our AI-powered travel platform
            </motion.p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How does the AI travel recommendation work?",
                answer: "Our AI analyzes your preferences, budget, travel history, and current trends to suggest personalized destinations and itineraries that match your interests."
              },
              {
                question: "Is the AI itinerary planner free to use?",
                answer: "Yes, our basic AI itinerary planner is free. Premium features like detailed customization and PDF exports are available with our premium subscription."
              },
              {
                question: "How accurate are the budget estimates?",
                answer: "Our AI provides estimates based on current market data, seasonal pricing, and user-submitted costs. Actual prices may vary, but our estimates are typically within 10-15% accuracy."
              },
              {
                question: "Can I modify AI-generated itineraries?",
                answer: "Absolutely! All AI-generated itineraries are fully editable. You can add, remove, or rearrange activities, adjust timings, and customize according to your preferences."
              },
              {
                question: "Is my personal data safe?",
                answer: "We take privacy seriously. Your data is encrypted and never shared with third parties. We only use it to improve your travel recommendations and maintain our services."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter & CTA */}
      <section className="py-20 bg-brand-600 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Journey?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl mb-8 text-brand-100">
              Join thousands of travelers who trust TravelAI for their perfect vacation planning
            </motion.p>

            <motion.div variants={fadeInUp} className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl mb-8">
              <h3 className="text-2xl font-semibold mb-4">Stay Updated</h3>
              <p className="text-brand-100 mb-6">Get travel tips, destination guides, and exclusive deals delivered to your inbox.</p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="bg-white text-brand-600 px-6 py-3 rounded-lg font-semibold hover:bg-brand-50 transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/explore"
                className="bg-white text-brand-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Explore Destinations
              </Link>
              <Link
                href="/ai-planner"
                className="border-2 border-white text-white hover:bg-white hover:text-brand-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300"
              >
                Try AI Planner
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <HomeSections />
    </div>
  );
}


