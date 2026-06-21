import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

/**
 * Resolves the absolute path of a package.
 * Needed in monorepos and Yarn PnP setups.
 */
function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const NODE_MODULES_PATTERN = /node_modules/;

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-vitest"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  typescript: {
    // Vite builder: typecheck via `pnpm typecheck` / tsconfig.storybook.json, not fork-ts-checker.
    check: false,
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      // Compiler options only — include/exclude come from this file, not tsconfig paths.
      tsconfigPath: join(
        dirname(fileURLToPath(import.meta.url)),
        "../tsconfig.storybook.json"
      ),
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) =>
        prop.parent ? !NODE_MODULES_PATTERN.test(prop.parent.fileName) : true,
    },
  },
  async viteFinal(viteConfig) {
    const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
    const srcRoot = join(packageRoot, "src");
    const appshellRoot = join(packageRoot, "../appshell");
    const testingRoot = join(packageRoot, "../testing");
    const nextLinkMock = join(testingRoot, "src/mocks/next-link.tsx");

    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = {
      ...(typeof viteConfig.resolve.alias === "object" &&
      !Array.isArray(viteConfig.resolve.alias)
        ? viteConfig.resolve.alias
        : {}),
      "@": srcRoot,
      "#": srcRoot,
      "@afenda/ui": join(srcRoot, "index.ts"),
      "@afenda/appshell": join(appshellRoot, "src/index.ts"),
      "next/link": nextLinkMock,
      "@afenda/ui/governance": join(srcRoot, "governance/index.ts"),
      "@afenda/ui/governance/recipe-maps": join(
        srcRoot,
        "governance/recipe-maps.ts"
      ),
      "@afenda/ui/lib/utils": join(srcRoot, "lib/utils.ts"),
    };

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
      "@afenda/appshell",
    ];
    viteConfig.optimizeDeps.esbuildOptions ??= {};
    viteConfig.optimizeDeps.esbuildOptions.alias = {
      ...(viteConfig.optimizeDeps.esbuildOptions.alias ?? {}),
      "@": srcRoot,
      "#": srcRoot,
      "@afenda/ui": join(srcRoot, "index.ts"),
      "next/link": nextLinkMock,
    };
    viteConfig.optimizeDeps.include = [
      ...(viteConfig.optimizeDeps.include ?? []).filter(
        (dep) => dep !== "@afenda/appshell" && dep !== "next/link"
      ),
      "@afenda/design-system",
    ];

    return viteConfig;
  },
};

export default config;
