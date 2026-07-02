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
const shadcnStudioRoot = join(appRoot, "../../packages/shadcn-studio");
const shadcnStudioSrcRoot = join(shadcnStudioRoot, "src");
const testingRoot = join(appRoot, "../../packages/testing");
const nextLinkMock = join(testingRoot, "src/mocks/next-link.tsx");
const nextImageMock = join(testingRoot, "src/mocks/next-image.tsx");
const nextDynamicMock = join(testingRoot, "src/mocks/next-dynamic.tsx");
const storybookTest = join(
  appRoot,
  "node_modules/storybook/dist/test/index.js"
);

/** Vitest addon change-detection uses acorn without TS/JSX — breaks dev on .tsx CSF. Tests run via vitest.storybook.config.ts. */
const storybookAddons = [
  getAbsolutePath("@chromatic-com/storybook"),
  getAbsolutePath("@storybook/addon-docs"),
  getAbsolutePath("@storybook/addon-designs"),
  getAbsolutePath("@storybook/addon-a11y"),
  {
    name: getAbsolutePath("@storybook/addon-mcp"),
    options: {
      toolsets: {
        dev: true,
        docs: true,
        test: true,
      },
    },
  },
];

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.stories.@(ts|tsx)",
    "../../../packages/shadcn-studio/src/**/*.stories.@(ts|tsx)",
  ],
  staticDirs: [
    join(appRoot, "public"),
    {
      from: join(shadcnStudioRoot, "public"),
      to: "/studio-assets",
    },
  ],
  addons: storybookAddons,
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  docs: {
    defaultName: "Documentation",
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
        find: "@afenda/shadcn-studio/shadcn-studio.css",
        replacement: join(shadcnStudioRoot, "src/styles/shadcn-studio.css"),
      },
      {
        find: "@afenda/shadcn-studio/lab",
        replacement: join(shadcnStudioSrcRoot, "lab/index.ts"),
      },
      {
        find: "@afenda/shadcn-studio",
        replacement: join(shadcnStudioRoot, "src/index.ts"),
      },
      {
        find: "@/components/ui",
        replacement: join(shadcnStudioSrcRoot, "components-ui"),
      },
      {
        find: "@/components/shadcn-studio",
        replacement: join(shadcnStudioSrcRoot, "components-layouts"),
      },
      {
        find: "@/components-auth-shell",
        replacement: join(shadcnStudioSrcRoot, "components-auth-shell"),
      },
      {
        find: "@/lib/utils",
        replacement: join(shadcnStudioSrcRoot, "utils/utils.ts"),
      },
      {
        find: "@/hooks",
        replacement: join(shadcnStudioSrcRoot, "hooks"),
      },
      { find: "@", replacement: shadcnStudioSrcRoot },
      { find: "next/link", replacement: nextLinkMock },
      { find: "next/image", replacement: nextImageMock },
      { find: "next/dynamic", replacement: nextDynamicMock },
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
    ];
    viteConfig.optimizeDeps.esbuildOptions ??= {};
    viteConfig.optimizeDeps.esbuildOptions.jsx = "automatic";
    viteConfig.optimizeDeps.esbuildOptions.jsxImportSource = "react";
    viteConfig.optimizeDeps.esbuildOptions.alias = {
      ...(viteConfig.optimizeDeps.esbuildOptions.alias ?? {}),
      "@storybook/addon-docs/blocks": addonDocsBlocks,
      "@/components/ui": join(shadcnStudioSrcRoot, "components-ui"),
      "@/components/shadcn-studio": join(
        shadcnStudioSrcRoot,
        "components-layouts"
      ),
      "@/components-auth-shell": join(
        shadcnStudioSrcRoot,
        "components-auth-shell"
      ),
      "@/lib/utils": join(shadcnStudioSrcRoot, "utils/utils.ts"),
      "@/hooks": join(shadcnStudioSrcRoot, "hooks"),
      "@": shadcnStudioSrcRoot,
      "@afenda/shadcn-studio/lab": join(shadcnStudioSrcRoot, "lab/index.ts"),
      "next/link": nextLinkMock,
      "next/image": nextImageMock,
      "next/dynamic": nextDynamicMock,
      "storybook/test": storybookTest,
    };
    viteConfig.optimizeDeps.include = [
      ...(viteConfig.optimizeDeps.include ?? []).filter(
        (dep) => dep !== "next/link"
      ),
      "@storybook/addon-docs/blocks",
      "@afenda/shadcn-studio/lab",
      "@afenda/shadcn-studio",
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
