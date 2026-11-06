import path from "node:path";
import { fileURLToPath } from "node:url";

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("next").NextConfig} */
const nextConfig = {
  outputFileTracingRoot: frontendRoot,
  async redirects() {
    return [{ source: "/travel-trade", destination: "/collaborations", permanent: true }];
  },
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
  },
};

export default nextConfig;
