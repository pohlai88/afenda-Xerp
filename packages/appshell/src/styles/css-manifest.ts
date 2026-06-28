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
    prohibitedImporters: ["@afenda/ui-composition", "@afenda/metadata-ui"],
    classNamespace: "app-shell-",
    propertyNamespace: "--app-shell-",
  },
  {
    /**
     * Canonical shadcn/studio reusable pattern layer.
     * Consumed internally via @import in afenda-appshell.css — NOT a standalone export.
     * Apps must continue to import only "./afenda-appshell.css".
     */
    packageName: "@afenda/appshell",
    exportPath: "./afenda-appshell.css",
    sourceFile: "src/styles/afenda-appshell-studio.css",
    purpose: "studio-patterns",
    productionSafe: true,
    requiresTailwindTheme: false,
    internalOnly: true,
    allowedImporters: ["@afenda/appshell"],
    prohibitedImporters: [
      "apps/*",
      "@afenda/ui-composition",
      "@afenda/metadata-ui",
      "@afenda/ui",
    ],
    classNamespace: "app-shell-",
    propertyNamespace: "--app-shell-",
  },
  {
    /**
     * Auth shell BEM layer (.af-auth-shell*).
     * Consumed internally via @import in afenda-appshell.css — NOT a standalone export.
     */
    packageName: "@afenda/appshell",
    exportPath: "./afenda-appshell.css",
    sourceFile: "src/auth-shell/auth-shell.css",
    purpose: "auth-shell-structural",
    productionSafe: true,
    requiresTailwindTheme: false,
    internalOnly: true,
    allowedImporters: ["@afenda/appshell"],
    prohibitedImporters: [
      "apps/*",
      "@afenda/ui-composition",
      "@afenda/metadata-ui",
      "@afenda/ui",
    ],
    classNamespace: "af-auth-shell",
    propertyNamespace: "--af-auth-shell-",
  },
] as const satisfies CssManifest;

/** CSS budget for @afenda/appshell. */
export const APPSHELL_CSS_BUDGET = {
  maxSourceFiles: 3,
  allowedSourceFiles: [
    "src/styles/afenda-appshell.css",
    "src/styles/afenda-appshell-studio.css",
    "src/auth-shell/auth-shell.css",
  ] as const,
} as const;
