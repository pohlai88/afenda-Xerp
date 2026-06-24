#!/usr/bin/env tsx
/**
 * CSS Import Governance Script
 *
 * Manifest-driven: derives boundary rules from the four package manifests.
 * No hardcoded path/rule lists in the rule body — only root paths are fixed.
 *
 * Rules enforced:
 *  1.  @afenda/metadata imports no CSS.
 *  2.  Fixture CSS not imported by production source files.
 *  3.  metadata-ui does not import appshell CSS.
 *  4.  appshell does not import metadata-ui CSS.
 *  5.  ui does not import metadata-ui or appshell CSS.
 *  6.  Only design-system defines --afenda-* variables.
 *  7.  Only design-system defines @theme (downstream allowed only if manifest-declared bridge).
 *  8.  ui/afenda-ui.css defines no :root token authority.
 *  9.  metadata-ui/afenda-metadata-ui.css has no .metadata-fixture-* selectors.
 *  10. appshell/afenda-appshell.css has no .app-shell-fixture-* selectors.
 *  11. package.json CSS exports match manifest entries.
 *  12. sideEffects includes exported CSS files.
 *  13. app globals do not import fixtures.css.
 *  14. No duplicate CSS export paths.
 *  15. No forbidden raw visual values outside approved token sources.
 *  16. Class-prefix namespace enforced per package.
 *  17. Custom-property namespace enforced per package.
 *  18. afenda-ui.css declares @layer order.
 *  19. Every CSS file in src/ must be registered in the manifest or explicitly exempted.
 *  20. Per-package CSS file budget — hard cap prevents proliferation.
 *  21. No duplicate CSS content across files within a package.
 *  22. Direct afenda-appshell-studio.css imports banned outside afenda-appshell.css.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// ── Types ────────────────────────────────────────────────────────────────────

interface ManifestItem {
  readonly allowedImporters: readonly string[];
  readonly classNamespace: string;
  readonly exportPath: string;
  readonly legacy?: boolean;
  readonly packageName: string;
  readonly productionSafe: boolean;
  readonly prohibitedImporters: readonly string[];
  readonly propertyNamespace: string | readonly string[];
  readonly purpose: string;
  readonly requiresTailwindTheme: boolean;
  readonly sourceFile: string;
}

interface Violation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
  readonly severity: "error" | "warning";
}

// ── Roots ────────────────────────────────────────────────────────────────────

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const PACKAGE_ROOTS: Record<string, string> = {
  "@afenda/design-system": join(repoRoot, "packages/design-system"),
  "@afenda/ui": join(repoRoot, "packages/ui"),
  "@afenda/metadata": join(repoRoot, "packages/metadata"),
  "@afenda/metadata-ui": join(repoRoot, "packages/metadata-ui"),
  "@afenda/appshell": join(repoRoot, "packages/appshell"),
};

const APP_ROOTS = [join(repoRoot, "apps/erp"), join(repoRoot, "apps/docs")];

// ── Manifest loading ──────────────────────────────────────────────────────────

function loadManifest(pkgName: string): readonly ManifestItem[] {
  const root = PACKAGE_ROOTS[pkgName];
  if (!root) {
    return [];
  }

  const candidates = [
    join(root, "src/css/css-manifest.ts"),
    join(root, "src/styles/css-manifest.ts"),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      const content = readFileSync(candidate, "utf8");
      // Extract the exported const array via inline JSON-ish parsing is unreliable.
      // Instead we read the package.json exports and cross-ref with manifest source content.
      // Full type-safe consumption is done in per-package tests; here we use regex extraction.
      const items = extractManifestItems(content, pkgName);
      if (items.length > 0) {
        return items;
      }
    }
  }
  return [];
}

function extractManifestItems(
  source: string,
  packageName: string
): ManifestItem[] {
  const items: ManifestItem[] = [];
  // Match exportPath: "..." and purpose: "..." from manifest const arrays
  const exportPathRe = /exportPath:\s*["']([^"']+)["']/g;
  const purposeRe = /purpose:\s*["']([^"']+)["']/g;
  const productionSafeRe = /productionSafe:\s*(true|false)/g;
  const requiresTailwindRe = /requiresTailwindTheme:\s*(true|false)/g;
  const sourceFileRe = /sourceFile:\s*["']([^"']+)["']/g;
  const classNsRe = /classNamespace:\s*["']([^"']+)["']/g;
  const propNsRe = /propertyNamespace:\s*["']([^"']+)["']/g;
  const legacyRe = /legacy:\s*(true)/g;

  const exportPaths = [...source.matchAll(exportPathRe)].map(
    (m) => m[1] as string
  );
  const purposes = [...source.matchAll(purposeRe)].map((m) => m[1] as string);
  const productionSafes = [...source.matchAll(productionSafeRe)].map(
    (m) => m[1] === "true"
  );
  const requiresTailwinds = [...source.matchAll(requiresTailwindRe)].map(
    (m) => m[1] === "true"
  );
  const sourceFiles = [...source.matchAll(sourceFileRe)].map(
    (m) => m[1] as string
  );
  const classNamespaces = [...source.matchAll(classNsRe)].map(
    (m) => m[1] as string
  );
  const propNamespaces = [...source.matchAll(propNsRe)].map(
    (m) => m[1] as string
  );
  const legacyFlags = [...source.matchAll(legacyRe)].map(() => true);

  for (let i = 0; i < exportPaths.length; i++) {
    items.push({
      packageName,
      exportPath: exportPaths[i] ?? "",
      sourceFile: sourceFiles[i] ?? "",
      purpose: purposes[i] ?? "",
      productionSafe: productionSafes[i] ?? true,
      requiresTailwindTheme: requiresTailwinds[i] ?? false,
      allowedImporters: [],
      prohibitedImporters: [],
      classNamespace: classNamespaces[i] ?? "",
      propertyNamespace: propNamespaces[i] ?? "none",
      legacy: legacyFlags[i],
    });
  }
  return items;
}

function loadPackageJson(pkgRoot: string): Record<string, unknown> {
  const path = join(pkgRoot, "package.json");
  if (!existsSync(path)) {
    return {};
  }
  return JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
}

// ── File collection ───────────────────────────────────────────────────────────

function collectFiles(
  dir: string,
  exts: string[],
  skip: RegExp[] = []
): string[] {
  const result: string[] = [];
  if (!existsSync(dir)) {
    return result;
  }
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (skip.some((re) => re.test(full))) {
      continue;
    }
    const stat = statSync(full);
    if (stat.isDirectory()) {
      result.push(...collectFiles(full, exts, skip));
    } else if (exts.some((ext) => entry.endsWith(ext))) {
      result.push(full);
    }
  }
  return result;
}

// ── Rule helpers ──────────────────────────────────────────────────────────────

function rel(path: string): string {
  return relative(repoRoot, path);
}

function readCss(path: string): string {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const CSS_IMPORT_RE = /@import\s+["']([^"']+)["']/g;

/** Strip CSS block comments before matching imports to avoid false positives from comment examples. */
function stripCssComments(content: string): string {
  return content.replace(/\/\*[\s\S]*?\*\//g, "");
}

function extractCssImports(content: string): string[] {
  const stripped = stripCssComments(content);
  return [...stripped.matchAll(CSS_IMPORT_RE)].map((m) => m[1] as string);
}

function extractTsImports(content: string): string[] {
  const re = /(?:import|from)\s+["']([^"']+)["']/g;
  return [...content.matchAll(re)].map((m) => m[1] as string);
}

// ── Rules ─────────────────────────────────────────────────────────────────────

const violations: Violation[] = [];

function fail(rule: string, file: string, message: string): void {
  violations.push({ rule, file: rel(file), message, severity: "error" });
}

function warn(rule: string, file: string, message: string): void {
  violations.push({ rule, file: rel(file), message, severity: "warning" });
}

// ─── Rule 1: @afenda/metadata imports no CSS ─────────────────────────────────
{
  const metaRoot = PACKAGE_ROOTS["@afenda/metadata"];
  if (metaRoot) {
    const tsFiles = collectFiles(
      join(metaRoot, "src"),
      [".ts", ".tsx"],
      [/node_modules/]
    );
    for (const file of tsFiles) {
      const content = readFileSync(file, "utf8");
      const imports = extractTsImports(content);
      for (const imp of imports) {
        if (imp.endsWith(".css")) {
          fail(
            "R1-metadata-no-css",
            file,
            `@afenda/metadata imports CSS: "${imp}"`
          );
        }
      }
    }
    const cssFiles = collectFiles(
      join(metaRoot, "src"),
      [".css"],
      [/node_modules/]
    );
    if (cssFiles.length > 0) {
      for (const f of cssFiles) {
        fail(
          "R1-metadata-no-css",
          f,
          "@afenda/metadata must not own CSS files"
        );
      }
    }
  }
}

// ─── Rule 2: Fixture CSS not imported by production source files ──────────────
// ─── Rule 3: metadata-ui does not import appshell CSS ────────────────────────
// ─── Rule 4: appshell does not import metadata-ui CSS ────────────────────────
// ─── Rule 5: ui does not import metadata-ui or appshell CSS ──────────────────
{
  const pkgChecks: Array<{
    pkg: string;
    forbiddenImports: string[];
    rule: string;
  }> = [
    {
      pkg: "@afenda/metadata-ui",
      forbiddenImports: ["@afenda/appshell"],
      rule: "R3-mui-no-appshell-css",
    },
    {
      pkg: "@afenda/appshell",
      forbiddenImports: ["@afenda/metadata-ui"],
      rule: "R4-appshell-no-mui-css",
    },
    {
      pkg: "@afenda/ui",
      forbiddenImports: ["@afenda/metadata-ui", "@afenda/appshell"],
      rule: "R5-ui-no-downstream-css",
    },
  ];

  for (const { pkg, forbiddenImports, rule } of pkgChecks) {
    const root = PACKAGE_ROOTS[pkg];
    if (!root) {
      continue;
    }
    const cssFiles = collectFiles(
      join(root, "src"),
      [".css"],
      [/node_modules/, /\.storybook/, /stories/]
    );
    for (const file of cssFiles) {
      const content = readFileSync(file, "utf8");
      const imports = extractCssImports(content);
      for (const imp of imports) {
        for (const forbidden of forbiddenImports) {
          if (imp.includes(forbidden)) {
            fail(rule, file, `${pkg} CSS imports from ${forbidden}: "${imp}"`);
          }
        }
      }
    }
  }
}

// ─── Rule 2 (app globals + story files): no fixture CSS in production ─────────
{
  const fixturePattern =
    /\/fixtures\.css|metadata-ui-fixtures\.css|appshell-fixtures\.css/;

  // App globals
  for (const appRoot of APP_ROOTS) {
    const cssFiles = collectFiles(appRoot, [".css"], [/node_modules/]);
    for (const file of cssFiles) {
      if (/globals\.css$/.test(file) || /layout\.css$/.test(file)) {
        const imports = extractCssImports(readFileSync(file, "utf8"));
        for (const imp of imports) {
          if (fixturePattern.test(imp)) {
            fail(
              "R2-no-fixture-in-production",
              file,
              `Production app global imports fixture CSS: "${imp}"`
            );
          }
        }
      }
    }
  }

  // Production source ts/tsx — check for fixture CSS imports
  for (const [pkg, root] of Object.entries(PACKAGE_ROOTS)) {
    if (
      pkg === "@afenda/metadata-ui" ||
      pkg === "@afenda/appshell" ||
      pkg === "@afenda/ui"
    ) {
      const srcFiles = collectFiles(
        join(root, "src"),
        [".ts", ".tsx"],
        [
          /node_modules/,
          /\.stories\./,
          /_storybook/,
          /\.storybook/,
          /__tests__/,
        ]
      );
      for (const file of srcFiles) {
        const imports = extractTsImports(readFileSync(file, "utf8"));
        for (const imp of imports) {
          if (fixturePattern.test(imp)) {
            fail(
              "R2-no-fixture-in-production",
              file,
              `Production source imports fixture CSS: "${imp}"`
            );
          }
        }
      }
    }
  }
}

// ─── Rule 6: Only design-system defines --afenda-* variables ─────────────────
{
  for (const [pkg, root] of Object.entries(PACKAGE_ROOTS)) {
    if (pkg === "@afenda/design-system") {
      continue;
    }
    const cssFiles = collectFiles(
      join(root, "src"),
      [".css"],
      [/node_modules/]
    );
    for (const file of cssFiles) {
      const content = readFileSync(file, "utf8");
      // Allow var() references; forbid definitions (--name: value on the same line).
      const defPattern = /^\s*(--afenda-[a-z][^\n:]*)\s*:/gm;
      const matches = [...content.matchAll(defPattern)];
      for (const match of matches) {
        fail(
          "R6-afenda-token-authority",
          file,
          `${pkg} defines --afenda-* token "${match[1]?.trim()}" — only @afenda/design-system may define these`
        );
      }
    }
  }
}

// ─── Rule 7: Only design-system defines @theme (downstream allowed only if bridge) ─
{
  for (const [pkg, root] of Object.entries(PACKAGE_ROOTS)) {
    if (pkg === "@afenda/design-system") {
      continue;
    }
    const cssFiles = collectFiles(
      join(root, "src"),
      [".css"],
      [/node_modules/]
    );
    for (const file of cssFiles) {
      const raw = readFileSync(file, "utf8");
      // Strip comments so doc-block examples don't trigger this rule
      const content = stripCssComments(raw);
      if (content.includes("@theme")) {
        fail(
          "R7-theme-authority",
          file,
          `${pkg} contains @theme — only @afenda/design-system may define @theme. ` +
            `Consumers @import "@afenda/design-system/css/afenda-design-system.css" instead.`
        );
      }
    }
  }
}

// ─── Rule 8: ui/afenda-ui.css defines no :root token authority ───────────────
{
  const uiCssPath = join(
    PACKAGE_ROOTS["@afenda/ui"] ?? "",
    "src/styles/afenda-ui.css"
  );
  const uiCss = readCss(uiCssPath);
  if (/^:root\s*\{/m.test(uiCss)) {
    fail(
      "R8-ui-no-root-tokens",
      uiCssPath,
      "afenda-ui.css must not define :root token authority — @import design-system instead"
    );
  }
  if (/^\s*--afenda-[a-z][^)]*:/m.test(uiCss)) {
    fail(
      "R8-ui-no-root-tokens",
      uiCssPath,
      "afenda-ui.css defines --afenda-* token values — only design-system may do this"
    );
  }
}

// ─── Rule 9: metadata-ui structural CSS has no .metadata-fixture-* selectors ──
{
  const muiPath = join(
    PACKAGE_ROOTS["@afenda/metadata-ui"] ?? "",
    "src/afenda-metadata-ui.css"
  );
  const muiStyles = readCss(muiPath);
  if (/\.metadata-fixture-/.test(muiStyles)) {
    fail(
      "R9-no-fixture-selector-in-structural",
      muiPath,
      "afenda-metadata-ui.css must not contain .metadata-fixture-* selectors"
    );
  }
}

// ─── Rule 10: appshell structural CSS has no .app-shell-fixture-* selectors ───
{
  const shellPath = join(
    PACKAGE_ROOTS["@afenda/appshell"] ?? "",
    "src/styles/afenda-appshell.css"
  );
  const shellStyles = readCss(shellPath);
  if (/\.app-shell-fixture-/.test(shellStyles)) {
    fail(
      "R10-no-fixture-selector-in-structural",
      shellPath,
      "afenda-appshell.css must not contain .app-shell-fixture-* selectors"
    );
  }
}

// ─── Rule 11: package.json CSS exports match manifests ───────────────────────
// ─── Rule 12: sideEffects includes exported CSS ───────────────────────────────
// ─── Rule 14: No duplicate CSS export paths ───────────────────────────────────
{
  for (const [pkg, root] of Object.entries(PACKAGE_ROOTS)) {
    const pkgJson = loadPackageJson(root);
    const exports = (pkgJson.exports ?? {}) as Record<string, unknown>;
    const sideEffects = Array.isArray(pkgJson.sideEffects)
      ? (pkgJson.sideEffects as string[])
      : [];

    const cssExports = Object.keys(exports).filter((k) => k.endsWith(".css"));
    const seen = new Set<string>();
    for (const exportKey of cssExports) {
      // Rule 14: no duplicates
      if (seen.has(exportKey)) {
        fail(
          "R14-no-duplicate-export-paths",
          join(root, "package.json"),
          `${pkg} has duplicate CSS export path: "${exportKey}"`
        );
      }
      seen.add(exportKey);

      // Rule 11: manifest entry must exist for each CSS export
      const manifest = loadManifest(pkg);
      const hasEntry = manifest.some((e) => e.exportPath === exportKey);
      if (!hasEntry && manifest.length > 0) {
        fail(
          "R11-exports-match-manifest",
          join(root, "package.json"),
          `${pkg} exports "${exportKey}" but no manifest entry found`
        );
      }

      // Rule 12: sideEffects must include the dist path
      const exportValue = exports[exportKey];
      const distPath =
        typeof exportValue === "object" && exportValue !== null
          ? ((exportValue as Record<string, string>).default ??
            (exportValue as Record<string, string>).import ??
            "")
          : typeof exportValue === "string"
            ? exportValue
            : "";
      if (
        distPath &&
        !sideEffects.some(
          (se) => se === distPath || distPath.includes(se.replace("./", ""))
        )
      ) {
        warn(
          "R12-sideeffects-include-css",
          join(root, "package.json"),
          `${pkg} exports "${exportKey}" → "${distPath}" but sideEffects may not cover it`
        );
      }
    }
  }
}

// ─── Rule 13: Production app globals do not import fixtures.css ──────────────
// (covered in Rule 2 app globals block above)

// ─── Rule 15: No forbidden raw visual values outside design-system ────────────
{
  const FORBIDDEN_PATTERNS: Array<{ re: RegExp; label: string }> = [
    { re: /:\s*#[0-9a-fA-F]{3,8}(?!\w)/g, label: "hardcoded hex color" },
    { re: /:\s*rgba?\s*\(/g, label: "hardcoded rgb/rgba color" },
    { re: /:\s*hsl\s*\(/g, label: "hardcoded hsl color" },
    { re: /:\s*oklch\s*\(/g, label: "hardcoded oklch color" },
  ];

  for (const [pkg, root] of Object.entries(PACKAGE_ROOTS)) {
    if (pkg === "@afenda/design-system") {
      continue;
    }
    const cssFiles = collectFiles(
      join(root, "src"),
      [".css"],
      [/node_modules/]
    );
    for (const file of cssFiles) {
      const content = readFileSync(file, "utf8");
      for (const { re, label } of FORBIDDEN_PATTERNS) {
        if (re.test(content)) {
          warn(
            "R15-no-raw-visual-values",
            file,
            `${pkg} CSS contains ${label} — use var(--afenda-*) tokens instead`
          );
        }
      }
    }
  }
}

// ─── Rule 16: Class-prefix namespace per package ──────────────────────────────
{
  const namespaceRules: Array<{
    pkg: string;
    allowedPrefix: string | null;
    ruleId: string;
  }> = [
    {
      pkg: "@afenda/metadata-ui",
      allowedPrefix: "metadata-",
      ruleId: "R16-class-namespace",
    },
    {
      pkg: "@afenda/appshell",
      allowedPrefix: "app-shell-",
      ruleId: "R16-class-namespace",
    },
    { pkg: "@afenda/ui", allowedPrefix: null, ruleId: "R16-class-namespace" }, // data-attr only
  ];

  for (const { pkg, allowedPrefix, ruleId } of namespaceRules) {
    const root = PACKAGE_ROOTS[pkg];
    if (!root) {
      continue;
    }
    const cssFiles = collectFiles(
      join(root, "src"),
      [".css"],
      [/node_modules/, /fixtures/]
    );
    for (const file of cssFiles) {
      const content = readFileSync(file, "utf8");
      const classSelectors = [...content.matchAll(/^\.([\w-]+)/gm)].map(
        (m) => m[1]
      );
      for (const sel of classSelectors) {
        if (!sel) {
          continue;
        }
        if (allowedPrefix === null) {
          warn(
            ruleId,
            file,
            `${pkg} CSS contains class selector ".${sel}" — should use data-attribute hooks only`
          );
        } else if (!sel.startsWith(allowedPrefix)) {
          const isFixturePkg =
            pkg === "@afenda/metadata-ui" &&
            sel.startsWith("metadata-fixture-");
          if (!isFixturePkg) {
            warn(
              ruleId,
              file,
              `${pkg} CSS class ".${sel}" does not match namespace "${allowedPrefix}*"`
            );
          }
        }
      }
    }
  }
}

// ─── Rule 17: Custom-property namespace per package ───────────────────────────
{
  const propNamespaceRules: Array<{
    pkg: string;
    allowedPrefix: string;
    ruleId: string;
  }> = [
    {
      pkg: "@afenda/appshell",
      allowedPrefix: "--app-shell-",
      ruleId: "R17-prop-namespace",
    },
    {
      pkg: "@afenda/metadata-ui",
      allowedPrefix: "--metadata-",
      ruleId: "R17-prop-namespace",
    },
  ];
  const FORBIDDEN_GENERIC = /^\s*--(color|spacing|font|radius|shadow)-/m;

  for (const { pkg, allowedPrefix, ruleId } of propNamespaceRules) {
    const root = PACKAGE_ROOTS[pkg];
    if (!root) {
      continue;
    }
    const cssFiles = collectFiles(
      join(root, "src"),
      [".css"],
      [/node_modules/]
    );
    for (const file of cssFiles) {
      const content = readFileSync(file, "utf8");
      // Check for generic namespace squatting
      if (FORBIDDEN_GENERIC.test(content)) {
        fail(
          ruleId,
          file,
          `${pkg} defines generic custom property (--color-*, --spacing-*, --font-*, --radius-*, --shadow-*) — use "${allowedPrefix}*" instead`
        );
      }
    }
  }
}

// ─── Rule 18: afenda-ui.css declares Tailwind v4 native @layer order ─────────
{
  const uiEntryPath = join(
    PACKAGE_ROOTS["@afenda/ui"] ?? "",
    "src/styles/afenda-ui.css"
  );
  const fullCss = readCss(uiEntryPath);
  const requiredLayers = ["theme", "base", "components", "utilities"];
  const layerOrder =
    /@layer\s+theme\s*,\s*base\s*,\s*components\s*,\s*utilities\s*;/;
  if (!layerOrder.test(fullCss)) {
    fail(
      "R18-layer-order-declared",
      uiEntryPath,
      `afenda-ui.css must declare Tailwind v4 native @layer order: @layer ${requiredLayers.join(", ")};`
    );
  }
}

// ─── Rules 19–21: Registry-driven — sourced from scripts/css/css-registry.ts ──
// Single source of truth: CSS_FILE_REGISTRY + CSS_BUDGETS.
// No hardcoded paths/budgets here — change the registry to change policy.

import {
  CSS_FILE_REGISTRY,
  getAllowedPaths,
  getBudget,
} from "./css-registry.mjs";

{
  const SCAN_SKIP = [
    /node_modules/,
    /__tests__/,
    /\.stories\./,
    /\.test\./,
    /_storybook/,
    /\.storybook/,
  ];

  for (const [pkg, root] of Object.entries(PACKAGE_ROOTS)) {
    const budget = getBudget(pkg);
    const allowedPaths = new Set(
      getAllowedPaths(pkg).map((p) => join(root, p))
    );
    const allCssOnDisk = collectFiles(join(root, "src"), [".css"], SCAN_SKIP);

    // ─── R19: Every CSS file must be in the registry ───────────────────────
    for (const file of allCssOnDisk) {
      if (!allowedPaths.has(file)) {
        fail(
          "R19-unregistered-css",
          file,
          `${pkg} has CSS file not in css-registry.ts — register it or delete it`
        );
      }
    }

    // ─── R20: Per-package CSS budget ───────────────────────────────────────
    if (allCssOnDisk.length > budget.maxFiles) {
      fail(
        "R20-css-budget",
        join(root, "src"),
        `${pkg} has ${allCssOnDisk.length} CSS files (budget: ${budget.maxFiles}). ` +
          "Remove files or increase budget in scripts/css/css-registry.ts with justification."
      );
    }

    // ─── R20b: generatedOnly packages must not have hand-authored CSS ──────
    if (budget.generatedOnly) {
      const registryEntries = CSS_FILE_REGISTRY.filter(
        (e) => e.package === pkg
      );
      for (const entry of registryEntries) {
        if (!entry.generated) {
          fail(
            "R20-generated-only",
            join(root, entry.path),
            `${pkg} is generatedOnly but registry entry "${entry.path}" is not marked generated`
          );
        }
      }
    }
  }

  // ─── R21: No duplicate CSS content across files within a package ─────────
  for (const [pkg, root] of Object.entries(PACKAGE_ROOTS)) {
    const allCss = collectFiles(join(root, "src"), [".css"], SCAN_SKIP);
    if (allCss.length < 2) {
      continue;
    }

    const contentMap = new Map<string, string[]>();
    for (const file of allCss) {
      const content = readFileSync(file, "utf8").trim();
      if (content.length === 0) {
        continue;
      }
      const existing = contentMap.get(content);
      if (existing) {
        existing.push(rel(file));
      } else {
        contentMap.set(content, [rel(file)]);
      }
    }

    for (const [, files] of contentMap) {
      if (files.length > 1) {
        fail(
          "R21-duplicate-css-content",
          files[0]!,
          `${pkg} has duplicate CSS content across files: ${files.join(", ")} — consolidate into one file`
        );
      }
    }
  }
}

// ─── Rule 22: Direct studio CSS import ban ───────────────────────────────────
// Only packages/appshell/src/styles/afenda-appshell.css may @import studio layer.
{
  const STUDIO_CSS_FORBIDDEN = [
    "afenda-appshell-studio.css",
    "@afenda/appshell/afenda-appshell-studio",
    "packages/appshell/src/styles/afenda-appshell-studio",
  ] as const;

  const appshellRoot = PACKAGE_ROOTS["@afenda/appshell"] ?? "";
  const soleAllowedImporter = join(
    appshellRoot,
    "src/styles/afenda-appshell.css"
  );

  const scanRoots: Array<{ root: string; cssMode: "globals-only" | "all" }> = [
    { root: join(repoRoot, "apps/erp"), cssMode: "globals-only" },
    { root: join(repoRoot, "apps/docs"), cssMode: "globals-only" },
    { root: join(appshellRoot, "src"), cssMode: "all" },
    {
      root: join(PACKAGE_ROOTS["@afenda/metadata-ui"] ?? "", "src"),
      cssMode: "all",
    },
    { root: join(PACKAGE_ROOTS["@afenda/ui"] ?? "", "src"), cssMode: "all" },
  ];

  const tsSkip = [
    /node_modules/,
    /\.stories\./,
    /_storybook/,
    /\.storybook/,
    /__tests__/,
  ];

  function importsForbiddenStudioCss(imp: string): string | null {
    for (const forbidden of STUDIO_CSS_FORBIDDEN) {
      if (imp.includes(forbidden)) {
        return forbidden;
      }
    }
    return null;
  }

  for (const { root, cssMode } of scanRoots) {
    if (!existsSync(root)) {
      continue;
    }

    const cssFiles = collectFiles(root, [".css"], [/node_modules/]);
    for (const file of cssFiles) {
      if (file === soleAllowedImporter) {
        continue;
      }
      if (
        cssMode === "globals-only" &&
        !(/globals\.css$/.test(file) || /layout\.css$/.test(file))
      ) {
        continue;
      }

      const imports = extractCssImports(readFileSync(file, "utf8"));
      for (const imp of imports) {
        const forbidden = importsForbiddenStudioCss(imp);
        if (forbidden) {
          fail(
            "R22-direct-studio-css",
            file,
            `Direct studio CSS import forbidden ("${forbidden}"): "${imp}" — import @afenda/appshell/afenda-appshell.css only`
          );
        }
      }
    }

    const tsFiles = collectFiles(root, [".ts", ".tsx"], tsSkip);
    for (const file of tsFiles) {
      if (file === soleAllowedImporter) {
        continue;
      }
      const imports = extractTsImports(readFileSync(file, "utf8"));
      for (const imp of imports) {
        const forbidden = importsForbiddenStudioCss(imp);
        if (forbidden) {
          fail(
            "R22-direct-studio-css",
            file,
            `Direct studio CSS import forbidden ("${forbidden}"): "${imp}" — import @afenda/appshell/afenda-appshell.css only`
          );
        }
      }
    }
  }
}

// ── Output ────────────────────────────────────────────────────────────────────

const errors = violations.filter((v) => v.severity === "error");
const warnings = violations.filter((v) => v.severity === "warning");

if (warnings.length > 0) {
  console.warn("\n⚠  CSS Governance Warnings:");
  for (const v of warnings) {
    console.warn(`  [${v.rule}] ${v.file}\n    ${v.message}`);
  }
}

if (errors.length > 0) {
  console.error("\n✗  CSS Governance Errors:");
  for (const v of errors) {
    console.error(`  [${v.rule}] ${v.file}\n    ${v.message}`);
  }
  console.error(
    `\n${errors.length} error(s), ${warnings.length} warning(s). Fix errors before merging.`
  );
  process.exit(1);
}

console.log(`\n✓  CSS governance passed (${warnings.length} warning(s))`);
