// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { ArrowRight, Link } from 'lucide-react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Autoplay, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// const destinations = [
//   { _id: '1', name: 'Berlin', imageUrl: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc', price: 649 },
//   { _id: '2', name: 'Paris', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', price: 1499 },
//   { _id: '3', name: 'Tokyo', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf', price: 899 },
//   { _id: '4', name: 'New York', imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9', price: 1199 },
//   { _id: '5', name: 'London', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad', price: 999 },
// ];

// const stagger = {
//   animate: {
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// };

// const fadeInUp = {
//   initial: { opacity: 0, y: 30 },
//   animate: { opacity: 1, y: 0 },
// };

// function FeaturedDestinations() {
//   const [destinationsLoading, setDestinationsLoading] = useState(false);

//   useEffect(() => {
//     // Simuliramo učitavanje podataka
//     setDestinationsLoading(true);
//     setTimeout(() => {
//       setDestinationsLoading(false);
//     }, 1500);
//   }, []);

//   return (
//     <section className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden">
//       {/* Background Decorative Elements */}
//       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40 pointer-events-none">
//         <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-200 dark:bg-brand-900 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
//         <div className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
//       </div>

//       <div className="container mx-auto px-4 md:px-6 relative z-10">
//         <motion.div
//           initial="initial"
//           whileInView="animate"
//           viewport={{ once: true }}
//           variants={stagger}
//           className="text-center mb-16"
//         >
//           <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
//             Top <span className="text-brand-600 italic underline decoration-brand-600">Destinations</span>
//           </motion.h2>
//           <motion.p variants={fadeInUp} className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
//             Explore the world's most beautiful places
//           </motion.p>
//         </motion.div>

//         {destinationsLoading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[1, 2, 3, 4].map((n) => (
//               <div key={n} className="bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl h-[340px]"></div>
//             ))}
//           </div>
//         ) : destinations.length === 0 ? (
//           <div className="text-center text-slate-500 py-10">
//             <p className="text-xl font-semibold mb-2">No destinations found.</p>
//             <p>Please add some featured destinations from the admin dashboard.</p>
//           </div>
//         ) : (
//           <div className="relative w-full max-w-[100vw] overflow-hidden">
//             <Swiper
//               modules={[Navigation, Autoplay, Pagination]}
//               grabCursor={true}
//               slidesPerView="auto"
//               spaceBetween={20}
//               loop={true}
//               autoplay={{ delay: 3000, disableOnInteraction: false }}
//               navigation={{
//                 nextEl: '.swiper-button-next-custom',
//                 prevEl: '.swiper-button-prev-custom',
//               }}
//               pagination={{ clickable: true }}
//               className="w-full pt-2 pb-10 px-4"
//             >
//               {destinations.map((destination, index) => (
//                 <SwiperSlide key={destination._id || index} className="w-[240px] sm:w-[260px] md:w-[280px]">
//                   <div className={`relative h-[340px] rounded-xl overflow-hidden group shadow-md transition-transform ${index % 2 !== 0 ? 'mt-8' : ''}`}>
//                     <img
//                       src={destination.imageUrl || "/api/placeholder/400/500"}
//                       alt={destination.name}
//                       className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                     />
//                     {/* Gradient overlay just like the image */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>

//                     {/* Title at top left */}
//                     <div className="absolute top-4 left-4 z-10">
//                       <h3 className="text-xl font-bold text-white tracking-wide">
//                         {destination.name}
//                       </h3>
//                     </div>

//                     {/* Pricing at bottom left */}
//                     <div className="absolute bottom-4 left-4 z-10">
//                       <p className="text-white/90 text-xs font-medium mb-0.5">Starts From</p>
//                       <p className="text-white text-lg font-bold drop-shadow-md">${destination.price}</p>
//                     </div>

//                     {/* Circular arrow button at bottom right */}
//                     <Link
//                       href={`/destination/${destination._id || destination.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
//                       className="absolute bottom-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors shadow-md z-10"
//                     >
//                       <ArrowRight size={16} strokeWidth={2} className="text-slate-900" />
//                     </Link>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </Swiper>

//             {/* Carousel navigation controls below the slider */}
//             <div className="flex items-center justify-center mt-2 gap-4">
//               <button className="swiper-button-prev-custom w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all z-10 bg-white shadow-sm">
//                 <ArrowRight size={18} strokeWidth={1.5} className="rotate-180" />
//               </button>
//               <button className="swiper-button-next-custom w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all z-10 bg-white shadow-sm">
//                 <ArrowRight size={18} strokeWidth={1.5} />
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="text-center mt-12">
//           <Link
//             href="/explore"
//             className="group bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(37,99,235,0.3)] inline-flex items-center gap-2"
//           >
//             View All Destinations
//             <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default FeaturedDestinations;