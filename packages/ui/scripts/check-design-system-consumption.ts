#!/usr/bin/env tsx
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const uiSrcRoot = join(packageRoot, "src");
const designSystemRoot = join(packageRoot, "..", "design-system");

// Only this file may import @afenda/design-system directly.
const designSystemBridgePath = "src/governance/design-system.ts";

// Only this file may use semantic token utilities and recipe-owned arbitrary values.
const recipeImplementationPath = "src/governance/recipe.ts";

const failures: string[] = [];

const collectSourceFiles = (
  directory: string,
  options?: { includeGovernance?: boolean }
): string[] => {
  const entries = readdirSync(directory);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      if (entry === "__tests__") {
        continue;
      }

      if (entry === "governance" && !options?.includeGovernance) {
        files.push(...collectSourceFiles(fullPath, { includeGovernance: true }));
        continue;
      }

      files.push(...collectSourceFiles(fullPath, options));
      continue;
    }

    if (/\.(ts|tsx)$/u.test(entry) && !/\.test\.(ts|tsx)$/u.test(entry)) {
      files.push(fullPath);
    }
  }

  return files;
};

const readText = (path: string): string => readFileSync(path, "utf8");

// Authority duplication: these consts are owned by @afenda/design-system only.
const duplicateAuthorityPatterns = [
  /const\s+STATUS_TONES\s*=/u,
  /const\s+GOVERNED_STATES\s*=/u,
  /const\s+VARIANT_INTENTS\s*=/u,
  /const\s+VARIANT_AXES\s*=/u,
  /const\s+TOKEN_CATEGORIES\s*=/u,
];

// Raw palette utilities are prohibited in all files including recipe.ts.
const rawPalettePattern =
  /\b(?:bg|text|border)-(?:red|blue|green|yellow|orange|purple|pink|emerald|lime|cyan|sky|indigo|violet|fuchsia|rose|amber|teal)-\d{2,3}\b/u;

// Governed component files: no semantic styling classes, no arbitrary overrides.
const governedComponentFiles = [
  "src/components/button.tsx",
  "src/components/badge.tsx",
  "src/components/card.tsx",
];

// Arbitrary radius/shadow/typography in component files is prohibited.
const prohibitedArbitraryPattern = /\b(?:rounded|shadow|text)-\[/u;

// Recipe.ts must not export CVA runtime objects directly (they must stay internal).
const exportedCvaPattern = /export\s+const\s+\w+Variants\s*=/u;

// Recipe.ts must not introduce local variant/tone/size authority.
const localAuthorityPatterns = [
  /const\s+LOCAL_\w+\s*=/u,
  /tone:\s*\{\s*(?!neutral|info|success|warning|danger|forbidden|invalid)/u,
];

const deepImportPattern =
  /@afenda\/design-system\/(?:src|contracts|policies|recipes|tokens|variants)\//u;

const directDesignSystemImportPattern =
  /^\s*import\s+(?:type\s+)?(?:[\w*{}\s,]+)\s+from\s+["']@afenda\/design-system/mu;

for (const filePath of collectSourceFiles(uiSrcRoot)) {
  const relativePath = relative(packageRoot, filePath).replace(/\\/g, "/");
  const source = readText(filePath);
  const isDesignSystemBridge = relativePath === designSystemBridgePath;
  const isRecipeImplementation = relativePath === recipeImplementationPath;

  // ── Bridge-only rules ──────────────────────────────────────────────────────
  if (!isDesignSystemBridge) {
    for (const pattern of duplicateAuthorityPatterns) {
      if (pattern.test(source)) {
        failures.push(`${relativePath}: defines duplicate design authority registry`);
      }
    }

    if (deepImportPattern.test(source)) {
      failures.push(`${relativePath}: deep-imports @afenda/design-system private paths`);
    }

    if (directDesignSystemImportPattern.test(source)) {
      failures.push(
        `${relativePath}: imports @afenda/design-system directly instead of governance adapter`
      );
    }
  }

  // ── Recipe implementation rules ────────────────────────────────────────────
  if (isRecipeImplementation) {
    // CVA runtime objects must not be exported; only resolver functions are public.
    if (exportedCvaPattern.test(source)) {
      failures.push(
        `${relativePath}: exports CVA runtime object directly — rename to internal *RecipeRuntime and export only resolver functions`
      );
    }

    // Raw palette color-scale utilities are prohibited even in recipe implementation.
    if (rawPalettePattern.test(source)) {
      failures.push(`${relativePath}: uses raw color-scale palette utilities — use semantic token utilities only`);
    }
  }

  // ── Governed component file rules ──────────────────────────────────────────
  if (governedComponentFiles.includes(relativePath)) {
    if (rawPalettePattern.test(source)) {
      failures.push(`${relativePath}: uses raw semantic Tailwind palette classes`);
    }

    if (prohibitedArbitraryPattern.test(source)) {
      failures.push(
        `${relativePath}: uses arbitrary radius/shadow/typography utilities outside recipe ownership`
      );
    }
  }
}

// ── Reverse dependency check ───────────────────────────────────────────────────
const reverseDependencyImportPattern =
  /(?:import|export)\s+(?:type\s+)?(?:[\w*{}\s,]+)\s+from\s+["']@afenda\/ui(?:\/|["'])/u;

const designSystemFiles = collectSourceFiles(join(designSystemRoot, "src"));
for (const filePath of designSystemFiles) {
  const relativePath = relative(designSystemRoot, filePath).replace(/\\/g, "/");
  const source = readText(filePath);

  if (reverseDependencyImportPattern.test(source)) {
    failures.push(
      `packages/design-system/${relativePath}: reverse dependency on @afenda/ui`
    );
  }
}

// ── Package dependency check ───────────────────────────────────────────────────
const uiPackageJson = JSON.parse(readText(join(packageRoot, "package.json"))) as {
  dependencies?: Record<string, string>;
};

if (!uiPackageJson.dependencies?.["@afenda/design-system"]) {
  failures.push("packages/ui/package.json: missing @afenda/design-system dependency");
}

if (failures.length > 0) {
  console.error("Design-system consumption check failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("@afenda/ui design-system consumption check passed.");
