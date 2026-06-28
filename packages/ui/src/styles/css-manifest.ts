/**
 * @afenda/ui CSS manifest.
 *
 * Source of truth for the single CSS file owned and exported by @afenda/ui.
 * Consumed by: governance script, css-manifest tests, downstream READMEs.
 *
 * afenda-ui.css is hand-authored. It @imports afenda-tokens (design-system shim)
 * and @afenda/css-authority/css/afenda-css-authority.css for shadcn bridge +
 * @theme + base. It adds primitive structural hooks only.
 */
import type { CssManifest } from "../governance/css-manifest.js";

export const uiCssManifest = [
  {
    packageName: "@afenda/ui",
    exportPath: "./afenda-ui.css",
    sourceFile: "src/styles/afenda-ui.css",
    purpose: "primitive-structural",
    productionSafe: true,
    requiresTailwindTheme: true,
    allowedImporters: ["apps/*", "@afenda/storybook"],
    prohibitedImporters: ["@afenda/ui-composition"],
    classNamespace: "data-attr-only",
    propertyNamespace: ["--afenda-", "none"] as const,
  },
] as const satisfies CssManifest;

/**
 * CSS budget for @afenda/ui — exactly one hand-authored file.
 */
export const UI_CSS_BUDGET = {
  maxSourceFiles: 1,
  allowedSourceFiles: ["src/styles/afenda-ui.css"] as const,
} as const;
