import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const storybookTsconfig = join(appRoot, "tsconfig.storybook.json");
const addonDocsRoot = getAbsolutePath("@storybook/addon-docs");
const addonDocsBlocks = join(addonDocsRoot, "dist/blocks.js");
const shadcnTailwindCss = join(
  appRoot,
  "node_modules/shadcn/dist/tailwind.css"
);
const shadcnStudioV2Root = join(appRoot, "../../packages/shadcn-studio-v2");
const shadcnStudioV2SrcRoot = join(shadcnStudioV2Root, "src");
const testingRoot = join(appRoot, "../../packages/testing");
const nextLinkMock = join(testingRoot, "src/mocks/next-link.tsx");
const nextImageMock = join(testingRoot, "src/mocks/next-image.tsx");
const nextDynamicMock = join(testingRoot, "src/mocks/next-dynamic.tsx");
const nextNavigationMock = join(testingRoot, "src/mocks/next-navigation.tsx");
const storybookTest = join(
  appRoot,
  "node_modules/storybook/dist/test/index.js"
);

/** Vitest addon change-detection uses acorn without TS/JSX — breaks dev on .tsx CSF. Tests run via vitest.storybook.config.ts. */
// SB 10.4 main config: https://storybook.js.org/docs/configure
const storybookAddons = [
  getAbsolutePath("@chromatic-com/storybook"),
  getAbsolutePath("@storybook/addon-docs"),
  getAbsolutePath("@storybook/addon-designs"),
  getAbsolutePath("@storybook/addon-a11y"),
  getAbsolutePath("@storybook/addon-links"),
  getAbsolutePath("@storybook/addon-themes"),
  {
    name: getAbsolutePath("@storybook/addon-mcp"),
    options: {
      toolsets: {
        dev: true,
        docs: true,
        // Windows MCP Vitest spawning is unreliable; run local Storybook Vitest gates instead.
        test: false,
      },
    },
  },
];

const config: StorybookConfig = {
  // Agentic pilot (2026-07-03): scoped catalog — apps/storybook/stories + storybook/agentic only.
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  staticDirs: [join(appRoot, "public")],
  addons: storybookAddons,
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  docs: {
    defaultName: "Documentation",
  },
  tags: {
    // SB 10.4 custom tags — sidebar filter defaults: writing-stories/tags
    "ai-generated": { defaultFilterSelection: "exclude" },
  },
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      tsconfigPath: storybookTsconfig,
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/u.test(prop.parent.fileName) : true,
    },
  },
  async viteFinal(viteConfig) {
    const storybookAliases = [
      {
        find: "@storybook/addon-docs/blocks",
        replacement: addonDocsBlocks,
      },
      {
        find: "shadcn/tailwind.css",
        replacement: shadcnTailwindCss,
      },
      {
        find: "@afenda/shadcn-studio-v2/shadcn-default.css",
        replacement: join(shadcnStudioV2SrcRoot, "styles/shadcn-default.css"),
      },
      {
        find: "@afenda/shadcn-studio-v2/themes/swiss-noir.css",
        replacement: join(shadcnStudioV2SrcRoot, "styles/swiss-noir.css"),
      },
      {
        find: "@afenda/shadcn-studio-v2/themes/verdant-noir.css",
        replacement: join(shadcnStudioV2SrcRoot, "styles/verdant-noir.css"),
      },
      {
        find: "@afenda/shadcn-studio-v2/lab",
        replacement: join(shadcnStudioV2SrcRoot, "storybook/lab.ts"),
      },
      {
        find: "@afenda/shadcn-studio-v2/clients",
        replacement: join(shadcnStudioV2SrcRoot, "clients.ts"),
      },
      {
        find: "@afenda/shadcn-studio-v2",
        replacement: join(shadcnStudioV2SrcRoot, "index.ts"),
      },
      {
        find: "@/components/ui",
        replacement: join(shadcnStudioV2SrcRoot, "components/ui"),
      },
      {
        find: "@/lib/utils",
        replacement: join(shadcnStudioV2SrcRoot, "lib/cn.ts"),
      },
      {
        find: "@/hooks",
        replacement: join(shadcnStudioV2SrcRoot, "hooks"),
      },
      { find: "@", replacement: shadcnStudioV2SrcRoot },
      { find: "next/link", replacement: nextLinkMock },
      { find: "next/image", replacement: nextImageMock },
      { find: "next/dynamic", replacement: nextDynamicMock },
      { find: "next/navigation", replacement: nextNavigationMock },
      { find: "storybook/test", replacement: storybookTest },
    ];

    viteConfig.resolve ??= {};
    viteConfig.resolve.extensions = [
      ".tsx",
      ".ts",
      ".jsx",
      ".js",
      ".mjs",
      ".json",
    ];
    viteConfig.resolve.alias = [
      ...storybookAliases,
      ...(Array.isArray(viteConfig.resolve.alias)
        ? viteConfig.resolve.alias
        : typeof viteConfig.resolve.alias === "object" &&
            viteConfig.resolve.alias !== null
          ? Object.entries(viteConfig.resolve.alias).map(
              ([find, replacement]) => ({
                find,
                replacement,
              })
            )
          : []),
    ];

    viteConfig.define = {
      ...(viteConfig.define ?? {}),
      "process.env.NODE_ENV": JSON.stringify(
        process.env["NODE_ENV"] ?? "development"
      ),
      // Dev server must define this — preview.tsx reads it; vitest sets "true" in vitest.storybook.config.ts.
      __AFENDA_VITEST_STORYBOOK__: JSON.stringify(
        process.env["VITEST_STORYBOOK"] === "true" ? "true" : "false"
      ),
      __AFENDA_VITEST_STORYBOOK_A11Y__: JSON.stringify(
        process.env["VITEST_STORYBOOK_A11Y"] === "true" ? "true" : "false"
      ),
    };

    viteConfig.server ??= {};
    viteConfig.server.watch ??= {};
    const existingIgnored = viteConfig.server.watch.ignored;
    viteConfig.server.watch.ignored = [
      ...(Array.isArray(existingIgnored)
        ? existingIgnored
        : existingIgnored
          ? [existingIgnored]
          : []),
      "**/storybook-static/**",
    ];

    viteConfig.optimizeDeps ??= {};
    viteConfig.optimizeDeps.exclude = [
      ...(viteConfig.optimizeDeps.exclude ?? []),
      "next",
      "next/link",
      "next/image",
      "next/dynamic",
      "next/navigation",
    ];
    viteConfig.optimizeDeps.esbuildOptions ??= {};
    viteConfig.optimizeDeps.esbuildOptions.jsx = "automatic";
    viteConfig.optimizeDeps.esbuildOptions.jsxImportSource = "react";
    viteConfig.optimizeDeps.esbuildOptions.alias = {
      ...(viteConfig.optimizeDeps.esbuildOptions.alias ?? {}),
      "@storybook/addon-docs/blocks": addonDocsBlocks,
      "@/components/ui": join(shadcnStudioV2SrcRoot, "components/ui"),
      "@/lib/utils": join(shadcnStudioV2SrcRoot, "lib/cn.ts"),
      "@/hooks": join(shadcnStudioV2SrcRoot, "hooks"),
      "@": shadcnStudioV2SrcRoot,
      "@afenda/shadcn-studio-v2/lab": join(
        shadcnStudioV2SrcRoot,
        "storybook/lab.ts"
      ),
      "@afenda/shadcn-studio-v2/clients": join(
        shadcnStudioV2SrcRoot,
        "clients.ts"
      ),
      "next/link": nextLinkMock,
      "next/image": nextImageMock,
      "next/dynamic": nextDynamicMock,
      "next/navigation": nextNavigationMock,
      "storybook/test": storybookTest,
    };
    viteConfig.optimizeDeps.include = [
      ...(viteConfig.optimizeDeps.include ?? []).filter(
        (dep) => dep !== "next/link"
      ),
      "@storybook/addon-docs/blocks",
      "@afenda/shadcn-studio-v2/lab",
      "@afenda/shadcn-studio-v2/clients",
      "@afenda/shadcn-studio-v2",
      "next-themes",
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ];

    return viteConfig;
  },
};

export default config;
