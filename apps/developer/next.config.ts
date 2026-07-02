import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const appDir = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.join(appDir, "../..");

const isProduction = process.env.NODE_ENV === "production";
const sandboxEnabled =
  process.env.AFENDA_DEVELOPER_SANDBOX === "true" ||
  process.env.AFENDA_DEVELOPER_SANDBOX === "1";

if (isProduction && !sandboxEnabled) {
  throw new Error(
    "@afenda/developer is lab-lane only (ADR-0039). Set AFENDA_DEVELOPER_SANDBOX=true to build or boot in production mode."
  );
}

const extensionAlias = {
  ".cjs": [".cts", ".cjs"],
  ".js": [".ts", ".tsx", ".js", ".jsx"],
  ".mjs": [".mts", ".mjs"],
} as const;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: monorepoRoot,
  allowedDevOrigins: ["127.0.0.1"],
  transpilePackages: ["@afenda/shadcn-studio"],
  turbopack: {
    root: monorepoRoot,
  },
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.extensionAlias = { ...extensionAlias };
    config.resolve.alias = {
      ...config.resolve.alias,
      "@afenda/shadcn-studio/theme": path.join(
        monorepoRoot,
        "packages/shadcn-studio/src/theme/index.ts"
      ),
    };
    return config;
  },
};

export default nextConfig;
