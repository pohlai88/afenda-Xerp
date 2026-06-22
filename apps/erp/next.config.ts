import type { NextConfig } from "next";

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
  // Playwright and other tooling often hit the dev server via 127.0.0.1 while
  // Next.js binds localhost — without this, Turbopack HMR is blocked and client
  // components never hydrate (dashboard layout fetch never runs).
  allowedDevOrigins: ["127.0.0.1"],
  experimental: {
    sri: {
      algorithm: "sha256",
    },
  },
  transpilePackages: [
    "@afenda/appshell",
    "@afenda/auth",
    "@afenda/database",
    "@afenda/design-system",
    "@afenda/kernel",
    "@afenda/metadata-ui",
    "@afenda/observability",
    "@afenda/permissions",
    "@afenda/testing",
    "@afenda/ui",
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
