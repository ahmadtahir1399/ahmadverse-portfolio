import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Project images are served locally from /public/projects/**, so no remote
  // image hosts are needed.
  images: {
    // Serve AVIF first, then WebP, to browsers that support them - the
    // source JPG/PNG files stay as-is; next/image converts on demand.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
