import type { StorybookConfig } from "@storybook/react-vite";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Resolves the absolute path of a package.
 * Needed in monorepos and Yarn PnP setups.
 */
function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

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
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  async viteFinal(viteConfig) {
    const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = {
      ...(typeof viteConfig.resolve.alias === "object" &&
      !Array.isArray(viteConfig.resolve.alias)
        ? viteConfig.resolve.alias
        : {}),
      "@afenda/ui/governance": join(packageRoot, "src/governance/index.ts"),
      "@afenda/ui/governance/component-props": join(
        packageRoot,
        "src/governance/component-props.ts"
      ),
      "@afenda/ui/governance/primitive-governance": join(
        packageRoot,
        "src/governance/primitive-governance.ts"
      ),
      "@afenda/ui/governance/governed-render": join(
        packageRoot,
        "src/governance/governed-render.ts"
      ),
      "@afenda/ui/governance/create-governed-slot": join(
        packageRoot,
        "src/governance/create-governed-slot.tsx"
      ),
      "@afenda/ui/lib/utils": join(packageRoot, "src/lib/utils.ts"),
    };

    viteConfig.optimizeDeps ??= {};
    viteConfig.optimizeDeps.include = [
      ...(viteConfig.optimizeDeps.include ?? []),
      "@afenda/design-system",
    ];

    return viteConfig;
  },
};

export default config;
