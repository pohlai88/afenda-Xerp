/**
 * @afenda/metadata-ui CSS manifest.
 *
 * Source of truth for every CSS file owned and exported by @afenda/metadata-ui.
 * Consumed by: governance script, css-manifest tests, downstream READMEs.
 */
import type { CssManifest } from "@afenda/ui/governance";

export const metadataUiCssManifest = [
  {
    packageName: "@afenda/metadata-ui",
    exportPath: "./afenda-metadata-ui.css",
    sourceFile: "src/afenda-metadata-ui.css",
    purpose: "renderer-structural",
    productionSafe: true,
    requiresTailwindTheme: false,
    allowedImporters: ["apps/*", "@afenda/metadata-ui/storybook", "@afenda/storybook"],
    prohibitedImporters: ["@afenda/metadata", "@afenda/appshell"],
    classNamespace: "metadata-",
    propertyNamespace: "none",
  },
  {
    packageName: "@afenda/metadata-ui",
    exportPath: "./fixtures.css",
    sourceFile: "src/fixtures/metadata-ui-fixtures.css",
    purpose: "fixture",
    productionSafe: false,
    requiresTailwindTheme: false,
    allowedImporters: [
      "@afenda/metadata-ui/storybook",
      "@afenda/storybook",
      "apps/storybook",
    ],
    prohibitedImporters: ["apps/erp", "@afenda/metadata", "@afenda/appshell"],
    classNamespace: "metadata-fixture-",
    propertyNamespace: "none",
  },
] as const satisfies CssManifest;

/**
 * CSS budget for @afenda/metadata-ui.
 * afenda-metadata-ui.css = production structural, fixtures CSS = storybook-only.
 */
export const METADATA_UI_CSS_BUDGET = {
  maxSourceFiles: 2,
  allowedSourceFiles: [
    "src/afenda-metadata-ui.css",
    "src/fixtures/metadata-ui-fixtures.css",
  ] as const,
} as const;
