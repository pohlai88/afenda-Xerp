import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    instrumentationHook: true,
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
};

export default nextConfig;
