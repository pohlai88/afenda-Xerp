import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const appDir = path.dirname(fileURLToPath(import.meta.url));

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
] as const;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: path.join(appDir, "../.."),
  // Playwright and other tooling often hit the dev server via 127.0.0.1 while
  // Next.js binds localhost — without this, Turbopack HMR is blocked and client
  // components never hydrate (dashboard layout fetch never runs).
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [
      {
        hostname: "cdn.shadcnstudio.com",
        pathname: "/ss-assets/**",
        protocol: "https",
      },
      // Figma Desktop MCP image exports (Dev Mode MCP server on port 3845)
      {
        hostname: "127.0.0.1",
        pathname: "/**",
        port: "3845",
        protocol: "http",
      },
      {
        hostname: "localhost",
        pathname: "/**",
        port: "3845",
        protocol: "http",
      },
    ],
  },
  experimental: {
    sri: {
      algorithm: "sha256",
    },
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  transpilePackages: [
    "@afenda/auth",
    "@afenda/database",
    "@afenda/observability",
    "@afenda/shadcn-studio",
  ],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [...securityHeaders],
      },
    ];
  },
};

export default nextConfig;
