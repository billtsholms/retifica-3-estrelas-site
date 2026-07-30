import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All local photography is pre-compressed to WebP in /public.
    // Serving it directly keeps the Cloudflare worker lean and avoids a runtime
    // image-transform request for assets that are already optimized.
    unoptimized: true,
  },
};

export default nextConfig;
