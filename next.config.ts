import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimized for production deployment
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
};

export default nextConfig;
