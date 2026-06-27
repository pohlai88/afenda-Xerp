import path from "node:path";
import { fileURLToPath } from "node:url";
import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const appDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(appDir, "../.."),
  async redirects() {
    return [
      {
        source: "/:lang/docs/getting-started",
        destination: "/:lang/docs/build-afenda/getting-started",
        permanent: true,
      },
      {
        source: "/:lang/docs/getting-started/:path*",
        destination: "/:lang/docs/build-afenda/getting-started/:path*",
        permanent: true,
      },
      {
        source: "/:lang/docs/monorepo-map",
        destination: "/:lang/docs/build-afenda/monorepo-map",
        permanent: true,
      },
      {
        source: "/:lang/docs/monorepo-map/:path*",
        destination: "/:lang/docs/build-afenda/monorepo-map/:path*",
        permanent: true,
      },
      {
        source: "/:lang/docs/contributing",
        destination: "/:lang/docs/build-afenda/contributing",
        permanent: true,
      },
      {
        source: "/:lang/docs/contributing/:path*",
        destination: "/:lang/docs/build-afenda/contributing/:path*",
        permanent: true,
      },
      {
        source: "/:lang/docs/apps/:path*",
        destination: "/:lang/docs/build-afenda/apps/:path*",
        permanent: true,
      },
      {
        source: "/:lang/docs/api-reference",
        destination: "/:lang/docs/integrate/internal-v1",
        permanent: true,
      },
      {
        source: "/:lang/docs/api-reference/:path*",
        destination: "/:lang/docs/integrate/internal-v1/:path*",
        permanent: true,
      },
      {
        source: "/:lang/docs/(guides)/getting-started",
        destination: "/:lang/docs/build-afenda/getting-started",
        permanent: true,
      },
      {
        source: "/:lang/docs/(guides)/getting-started/:path*",
        destination: "/:lang/docs/build-afenda/getting-started/:path*",
        permanent: true,
      },
      {
        source: "/:lang/docs/(guides)/monorepo-map",
        destination: "/:lang/docs/build-afenda/monorepo-map",
        permanent: true,
      },
      {
        source: "/:lang/docs/(guides)/monorepo-map/:path*",
        destination: "/:lang/docs/build-afenda/monorepo-map/:path*",
        permanent: true,
      },
      {
        source: "/:lang/docs/(guides)/contributing",
        destination: "/:lang/docs/build-afenda/contributing",
        permanent: true,
      },
      {
        source: "/:lang/docs/(guides)/contributing/:path*",
        destination: "/:lang/docs/build-afenda/contributing/:path*",
        permanent: true,
      },
      {
        source: "/:lang/docs/(guides)/api-reference",
        destination: "/:lang/docs/integrate/internal-v1",
        permanent: true,
      },
      {
        source: "/:lang/docs/(guides)/api-reference/:path*",
        destination: "/:lang/docs/integrate/internal-v1/:path*",
        permanent: true,
      },
    ];
  },
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
