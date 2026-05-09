"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { ArrowRight, MapPin, Star } from "lucide-react";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const destinations = [
  {
    _id: "1",
    name: "Santorini",
    country: "Greece",
    rating: 4.9,
    price: 1299,
    tag: "Romantic",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
  },
  {
    _id: "2",
    name: "Kyoto",
    country: "Japan",
    rating: 4.8,
    price: 1099,
    tag: "Cultural",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80",
  },
  {
    _id: "3",
    name: "Bali",
    country: "Indonesia",
    rating: 4.9,
    price: 899,
    tag: "Tropical",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
  },
  {
    _id: "4",
    name: "Machu Picchu",
    country: "Peru",
    rating: 4.7,
    price: 1499,
    tag: "Adventure",
    imageUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&q=80",
  },
  {
    _id: "5",
    name: "Amalfi Coast",
    country: "Italy",
    rating: 4.8,
    price: 1399,
    tag: "Scenic",
    imageUrl: "https://images.unsplash.com/photo-1533606688076-b6683a5f59f1?w=600&q=80",
  },
  {
    _id: "6",
    name: "Maldives",
    country: "Indian Ocean",
    rating: 5.0,
    price: 2199,
    tag: "Luxury",
    imageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80",
  },
  {
    _id: "7",
    name: "Dubai",
    country: "UAE",
    rating: 4.8,
    price: 1599,
    tag: "Modern",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
  },
  {
    _id: "8",
    name: "Paris",
    country: "France",
    rating: 4.9,
    price: 1249,
    tag: "Romantic",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
  },
];

export default function FeaturedDestinations() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-200 dark:bg-brand-900 rounded-full blur-3xl opacity-70" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl opacity-70" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Top{" "}
            <span className="text-brand-600 italic underline decoration-brand-600">
              Destinations
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Explore the world's most beautiful places
          </p>
        </motion.div>

        {/* Swiper */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            slidesPerView={1}
            spaceBetween={20}
            loop={true}
            grabCursor={true}
            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{
              nextEl: ".fd-next",
              prevEl: ".fd-prev",
            }}
            pagination={{ clickable: true, el: ".fd-pagination" }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="!pb-12"
          >
            {destinations.map((d, i) => (
              <SwiperSlide key={d._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative h-[340px] rounded-2xl overflow-hidden shadow-md cursor-pointer"
                >
                  {/* Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={d.imageUrl}
                    alt={d.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Tag badge */}
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-brand-600/90 text-white text-xs font-semibold backdrop-blur-sm">
                    {d.tag}
                  </span>

                  {/* Rating */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-white text-xs font-bold">{d.rating}</span>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white tracking-wide mb-0.5">
                      {d.name}
                    </h3>
                    <div className="flex items-center gap-1 text-white/70 text-xs mb-3">
                      <MapPin size={11} />
                      {d.country}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-xs">Starts From</p>
                        <p className="text-white text-lg font-black">${d.price}</p>
                      </div>
                      <Link
                        href={`/packages`}
                        className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors shadow-md group/btn"
                      >
                        <ArrowRight size={16} strokeWidth={2} className="text-slate-900 group-hover/btn:text-white" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Nav buttons */}
          <button className="fd-prev absolute left-0 top-1/2 -translate-y-6 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white flex items-center justify-center hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all shadow-md">
            <ArrowRight size={17} className="rotate-180" />
          </button>
          <button className="fd-next absolute right-0 top-1/2 -translate-y-6 translate-x-4 z-10 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white flex items-center justify-center hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all shadow-md">
            <ArrowRight size={17} />
          </button>

          {/* Pagination */}
          <div className="fd-pagination flex justify-center mt-2" />
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_20px_rgba(79,70,229,0.3)]"
          >
            View All Destinations
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
