/**
 * Canonical CSS File Registry
 *
 * Single source of truth for every CSS file allowed to exist across the monorepo.
 * The governance script, per-package tests, and documentation all derive from this.
 *
 * Adding a CSS file? Add it here first. If it's not here, R19 will reject it.
 *
 * Packages that need this at build time (design-system can't import @afenda/ui)
 * maintain local manifest files that re-declare their entries. The governance
 * script validates that local manifests stay in sync with this registry.
 */

// ── Per-package budgets ──────────────────────────────────────────────────────
// maxFiles: hard cap on CSS source files (not counting dist or test files)
// generatedOnly: if true, no hand-authored CSS is permitted

export interface CssBudget {
  readonly generatedOnly: boolean;
  readonly maxFiles: number;
}

export const CSS_BUDGETS: Record<string, CssBudget> = {
  "@afenda/css-authority": { maxFiles: 4, generatedOnly: false },
  "@afenda/design-system": { maxFiles: 2, generatedOnly: true },
  "@afenda/ui": { maxFiles: 1, generatedOnly: false },
  "@afenda/metadata-ui": { maxFiles: 2, generatedOnly: false },
  "@afenda/appshell": { maxFiles: 3, generatedOnly: false },
  "@afenda/metadata": { maxFiles: 0, generatedOnly: true },
};

// ── Complete file inventory ──────────────────────────────────────────────────
// Every CSS source file that is allowed to exist, its owning package, and role.

export interface CssFileEntry {
  /** Package.json export path this file backs (if exported) */
  readonly exportPath?: string;
  /** If true, this file is produced by a build script — never edit manually */
  readonly generated: boolean;
  /** Package that owns this file */
  readonly package: string;
  /** Path relative to package root */
  readonly path: string;
  /** Why this file exists */
  readonly role:
    | "generated-tokens" // output of generate-tokens-css.ts (raw --afenda-* tokens)
    | "generated-theme" // output of generate-tokens-css.ts (Tailwind @theme bridge)
    | "authored-structural" // hand-authored structural CSS
    | "authored-studio-patterns" // internal @import-only: reusable shadcn/studio patterns
    | "authored-fixture"; // storybook/demo only
}

export const CSS_FILE_REGISTRY: readonly CssFileEntry[] = [
  // ── @afenda/css-authority (PAS-005) ─────────────────────────────────────
  {
    package: "@afenda/css-authority",
    path: "src/css/afenda-runtime-bridge.css",
    role: "generated-theme",
    generated: true,
  },
  {
    package: "@afenda/css-authority",
    path: "src/css/vendored/shadcn-theme.css",
    role: "authored-structural",
    generated: false,
  },
  {
    package: "@afenda/css-authority",
    path: "src/css/afenda-css-authority.css",
    role: "generated-theme",
    generated: true,
    exportPath: "./css/afenda-css-authority.css",
  },

  // ── @afenda/design-system (2 files, both generated) ─────────────────────
  // Canonical theme/tokens. Never named globals.css — that name is app-only.
  {
    package: "@afenda/design-system",
    path: "src/css/afenda-tokens.css",
    role: "generated-tokens",
    generated: true,
    exportPath: "./css/afenda-tokens.css",
  },
  {
    package: "@afenda/design-system",
    path: "src/css/afenda-design-system.css",
    role: "generated-theme",
    generated: true,
    exportPath: "./css/afenda-design-system.css",
  },

  // ── @afenda/ui (1 file) ────────────────────────────────────────────────
  // Single entry: @imports design-system theme + adds primitive structural hooks.
  {
    package: "@afenda/ui",
    path: "src/styles/afenda-ui.css",
    role: "authored-structural",
    generated: false,
    exportPath: "./afenda-ui.css",
  },

  // ── @afenda/metadata-ui (2 files) ──────────────────────────────────────
  {
    package: "@afenda/metadata-ui",
    path: "src/afenda-metadata-ui.css",
    role: "authored-structural",
    generated: false,
    exportPath: "./afenda-metadata-ui.css",
  },
  {
    package: "@afenda/metadata-ui",
    path: "src/fixtures/metadata-ui-fixtures.css",
    role: "authored-fixture",
    generated: false,
    exportPath: "./fixtures.css",
  },

  // ── @afenda/appshell (3 files) ──────────────────────────────────────────
  {
    package: "@afenda/appshell",
    path: "src/styles/afenda-appshell.css",
    role: "authored-structural",
    generated: false,
    exportPath: "./afenda-appshell.css",
  },
  {
    /**
     * Internal @import-only layer — not a standalone package.json export.
     * Consumed by afenda-appshell.css via `@import "./afenda-appshell-studio.css"`.
     * Apps must NOT import this file directly.
     */
    package: "@afenda/appshell",
    path: "src/styles/afenda-appshell-studio.css",
    role: "authored-studio-patterns",
    generated: false,
  },
  {
    /**
     * Internal @import-only layer — not a standalone package.json export.
     * Consumed by afenda-appshell.css via `@import "../auth-shell/auth-shell.css"`.
     */
    package: "@afenda/appshell",
    path: "src/auth-shell/auth-shell.css",
    role: "authored-structural",
    generated: false,
  },

  // ── @afenda/metadata (0 files — pure contract) ─────────────────────────
  // (intentionally empty)
] as const;

// ── Derived helpers ──────────────────────────────────────────────────────────

export function getFilesForPackage(pkg: string): readonly CssFileEntry[] {
  return CSS_FILE_REGISTRY.filter((e) => e.package === pkg);
}

export function getBudget(pkg: string): CssBudget {
  return CSS_BUDGETS[pkg] ?? { maxFiles: 0, generatedOnly: true };
}

export function getAllowedPaths(pkg: string): readonly string[] {
  return getFilesForPackage(pkg).map((e) => e.path);
}

export function isRegistered(pkg: string, relativePath: string): boolean {
  const normalised = relativePath.replace(/\\/g, "/");
  return CSS_FILE_REGISTRY.some(
    (e) => e.package === pkg && e.path === normalised
  );
}
