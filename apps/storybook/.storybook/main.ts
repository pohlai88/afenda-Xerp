import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const NODE_MODULES_PATTERN = /node_modules/;
const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const shadcnTailwindCss = join(
  appRoot,
  "node_modules/shadcn/dist/tailwind.css"
);
const uiRoot = join(appRoot, "../../packages/ui");
const uiSrcRoot = join(uiRoot, "src");
const appshellRoot = join(appRoot, "../../packages/appshell");
const designSystemRoot = join(appRoot, "../../packages/design-system");
const metadataUiRoot = join(appRoot, "../../packages/metadata-ui");
const metadataRoot = join(appRoot, "../../packages/metadata");
const testingRoot = join(appRoot, "../../packages/testing");
const nextLinkMock = join(testingRoot, "src/mocks/next-link.tsx");
const nextImageMock = join(testingRoot, "src/mocks/next-image.tsx");
const nextDynamicMock = join(testingRoot, "src/mocks/next-dynamic.tsx");
const governanceRoot = join(uiSrcRoot, "governance");

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.stories.@(ts|tsx)",
    "../../../packages/ui/src/**/*.stories.@(ts|tsx)",
    "../../../packages/appshell/src/**/*.stories.@(ts|tsx)",
    "../../../packages/metadata-ui/src/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-vitest"),
    getAbsolutePath("@storybook/addon-mcp"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      tsconfigPath: join(appRoot, "tsconfig.storybook.json"),
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) =>
        prop.parent ? !NODE_MODULES_PATTERN.test(prop.parent.fileName) : true,
    },
  },
  async viteFinal(viteConfig) {
    const storybookAliases = [
      {
        find: "shadcn/tailwind.css",
        replacement: shadcnTailwindCss,
      },
      {
        find: "@afenda/ui/afenda-ui.css",
        replacement: join(uiSrcRoot, "styles/afenda-ui.css"),
      },
      {
        find: "@afenda/design-system/css/afenda-design-system.css",
        replacement: join(designSystemRoot, "src/css/afenda-design-system.css"),
      },
      {
        find: "@afenda/appshell/afenda-appshell.css",
        replacement: join(appshellRoot, "src/styles/afenda-appshell.css"),
      },
      {
        find: /^@afenda\/ui\/governance\/(.+)$/,
        replacement: `${governanceRoot}/$1`,
      },
      {
        find: "@afenda/ui/governance",
        replacement: join(governanceRoot, "index.ts"),
      },
      {
        find: "@afenda/ui/lib/utils",
        replacement: join(uiSrcRoot, "lib/utils.ts"),
      },
      {
        find: "@afenda/ui",
        replacement: join(uiSrcRoot, "index.ts"),
      },
      {
        find: "@afenda/appshell",
        replacement: join(appshellRoot, "src/index.ts"),
      },
      {
        find: "@afenda/metadata-ui/afenda-metadata-ui.css",
        replacement: join(metadataUiRoot, "src/afenda-metadata-ui.css"),
      },
      {
        find: "@afenda/metadata-ui/fixtures.css",
        replacement: join(
          metadataUiRoot,
          "src/fixtures/metadata-ui-fixtures.css"
        ),
      },
      {
        find: "@afenda/metadata-ui/server",
        replacement: join(metadataUiRoot, "src/server.ts"),
      },
      {
        find: "@afenda/metadata-ui",
        replacement: join(metadataUiRoot, "src/index.ts"),
      },
      {
        find: "@afenda/metadata",
        replacement: join(metadataRoot, "src/index.ts"),
      },
      { find: "next/link", replacement: nextLinkMock },
      { find: "next/image", replacement: nextImageMock },
      { find: "next/dynamic", replacement: nextDynamicMock },
      { find: "@", replacement: uiSrcRoot },
      { find: "#", replacement: uiSrcRoot },
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
    };

    viteConfig.optimizeDeps ??= {};
    viteConfig.optimizeDeps.exclude = [
      ...(viteConfig.optimizeDeps.exclude ?? []),
      "next",
      "next/link",
      "next/image",
      "next/dynamic",
      "@afenda/appshell",
    ];
    viteConfig.optimizeDeps.esbuildOptions ??= {};
    viteConfig.optimizeDeps.esbuildOptions.jsx = "automatic";
    viteConfig.optimizeDeps.esbuildOptions.jsxImportSource = "react";
    viteConfig.optimizeDeps.esbuildOptions.alias = {
      ...(viteConfig.optimizeDeps.esbuildOptions.alias ?? {}),
      "@afenda/ui/governance": join(governanceRoot, "index.ts"),
      "@afenda/ui/lib/utils": join(uiSrcRoot, "lib/utils.ts"),
      "@afenda/ui": join(uiSrcRoot, "index.ts"),
      "@": uiSrcRoot,
      "#": uiSrcRoot,
      "next/link": nextLinkMock,
      "next/image": nextImageMock,
      "next/dynamic": nextDynamicMock,
    };
    viteConfig.optimizeDeps.include = [
      ...(viteConfig.optimizeDeps.include ?? []).filter(
        (dep) => dep !== "@afenda/appshell" && dep !== "next/link"
      ),
      "@afenda/design-system",
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ];

    return viteConfig;
  },
};

export default config;
