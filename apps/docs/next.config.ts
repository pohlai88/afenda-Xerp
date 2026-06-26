import path from "node:path";
import { fileURLToPath } from "node:url";
import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const appDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(appDir, "../.."),
  async rewrites() {
    return [
      {
        source: "/:lang/docs/:path*.mdx",
        destination: "/llms.mdx/:lang/docs/:path*",
      },
    ];
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
