import type { NextConfig } from "next";
import path from "node:path";

const frontendRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  outputFileTracingRoot: frontendRoot,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/*/image/upload/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    root: frontendRoot,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
