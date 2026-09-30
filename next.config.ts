import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimized for production deployment
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  async headers() {
    return [
      {
        // /lab's WASM artifact. Served from public/, fetched at runtime —
        // never bundled — so this is the only config this repo needs for
        // it. No `webpack` or `turbopack` key: the build runs on Turbopack
        // (`next build --turbopack`), which would silently ignore a
        // `webpack` key, and the module has no imports for a bundler to
        // resolve in the first place.
        source: "/wasm/:file*.wasm",
        headers: [
          { key: "Content-Type", value: "application/wasm" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
