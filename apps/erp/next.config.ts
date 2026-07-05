import path from "node:path";
import { fileURLToPath } from "node:url";
import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const appDir = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.join(appDir, "../..");

const extensionAlias = {
  ".cjs": [".cts", ".cjs"],
  ".js": [".ts", ".tsx", ".js", ".jsx"],
  ".mjs": [".mts", ".mjs"],
} as const;

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
  outputFileTracingRoot: monorepoRoot,
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
  // Turbopack: root only — extensionAlias is webpack-only until Next honors it in turbopack.
  turbopack: {
    root: monorepoRoot,
  },
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.extensionAlias = { ...extensionAlias };
    config.resolve.alias = {
      ...config.resolve.alias,
      // transpilePackages resolves the package root only — wire subpath exports for webpack.
      "@afenda/shadcn-studio/theme": path.join(
        monorepoRoot,
        "packages/shadcn-studio/src/theme-runtime/index.ts"
      ),
      "@afenda/shadcn-studio/governance": path.join(
        monorepoRoot,
        "packages/shadcn-studio/src/meta-gates/index.ts"
      ),
    };
    return config;
  },
  async redirects() {
    return [
      {
        destination: "/system-admin/users",
        permanent: true,
        source: "/system-admin",
      },
      {
        destination: "/session-expired",
        permanent: true,
        source: "/401",
      },
      {
        destination: "/access-denied",
        permanent: true,
        source: "/403",
      },
      {
        destination: "/",
        permanent: true,
        source: "/500",
      },
      {
        destination: "/metadata-workspace",
        permanent: false,
        source: "/operator/auth/sign-in",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [...securityHeaders],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
