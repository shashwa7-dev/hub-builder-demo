/** @type {import('next').NextConfig} */
const nextConfig = {
  //cloudflare bug
  experimental: {
    runtime: "edge",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    // Skip type checking during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip ESLint during builds
    ignoreDuringBuilds: true,
  },
  // Mark server-only packages for Next.js 16+
  serverExternalPackages: [
    "@langchain/langgraph",
    "@langchain/langgraph-checkpoint-redis",
    "redis",
    "@redis/client",
    "@e2b/code-interpreter",
    "e2b",
  ],
};

module.exports = nextConfig;
