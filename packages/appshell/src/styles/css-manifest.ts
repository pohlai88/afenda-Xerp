/**
 * @afenda/appshell CSS manifest.
 *
 * Source of truth for every CSS file owned and exported by @afenda/appshell.
 * Consumed by: governance script, css-manifest tests, downstream READMEs.
 */
import type { CssManifest } from "@afenda/ui/governance";

export const appShellCssManifest = [
  {
    packageName: "@afenda/appshell",
    exportPath: "./afenda-appshell.css",
    sourceFile: "src/styles/afenda-appshell.css",
    purpose: "shell-structural",
    productionSafe: true,
    requiresTailwindTheme: false,
    allowedImporters: [
      "apps/*",
      "@afenda/appshell/storybook",
      "@afenda/storybook",
    ],
    prohibitedImporters: ["@afenda/metadata", "@afenda/metadata-ui"],
    classNamespace: "app-shell-",
    propertyNamespace: "--app-shell-",
  },
] as const satisfies CssManifest;

/** CSS budget for @afenda/appshell — 1 file only. */
export const APPSHELL_CSS_BUDGET = {
  maxSourceFiles: 1,
  allowedSourceFiles: ["src/styles/afenda-appshell.css"] as const,
} as const;
