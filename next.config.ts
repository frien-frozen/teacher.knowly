import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Optimize images from external sources if needed later
  images: {
    domains: [],
    unoptimized: true, // Safer for static export if you choose that route
  },
  // Fix for some heavy dependencies in the future
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
