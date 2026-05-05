import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Faster image loading — allow external image domains
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Reduce bundle size
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "swiper",
    ],
  },

  // Compress responses
  compress: true,

  // Faster page transitions — prefetch on hover
  // (Next.js does this by default for <Link>)
};

export default nextConfig;
