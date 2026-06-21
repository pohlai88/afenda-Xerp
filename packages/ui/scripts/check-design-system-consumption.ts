#!/usr/bin/env tsx
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  assertAllowedLayoutClassNameStrict,
  validateLayoutClassName,
} from "../src/governance/class-name";
import { assertMotionPolicyCoverageStrict } from "../src/governance/motion";
import {
  EXPORTED_STOCK_COMPONENTS,
  GOVERNED_COMPONENT_SOURCE_FILES,
  PRIMARY_UI_EXPORTS,
  STOCK_SHADCN_PENDING,
} from "../src/governance/primitive-registry";

const packageRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const uiSrcRoot = join(packageRoot, "src");
const designSystemRoot = join(packageRoot, "..", "design-system");

const designSystemBridgePath = "src/governance/design-system.ts";

/** Recipe ownership layer — semantic Tailwind is allowed here, forbidden in components. */
const recipeImplementationPaths = new Set([
  "src/governance/recipe.ts",
  "src/governance/recipe-maps.ts",
]);

const failures: string[] = [];

const classNamePolicySamples = [
  { className: "flex w-full justify-between overflow-hidden", valid: true },
  { className: "bg-red-500", valid: false },
  { className: "w-[123px]", valid: false },
  { className: "container", valid: false },
] as const;

for (const sample of classNamePolicySamples) {
  const result = validateLayoutClassName(sample.className);
  if (result.valid !== sample.valid) {
    failures.push(
      `class-name policy: expected "${sample.className}" to be ${sample.valid ? "valid" : "invalid"}`
    );
  }
}

try {
  assertAllowedLayoutClassNameStrict("text-white");
  failures.push(
    "class-name policy: strict assertion must reject semantic consumer className"
  );
} catch {
  // expected
}

try {
  assertMotionPolicyCoverageStrict();
} catch (error) {
  failures.push(
    `motion policy: ${error instanceof Error ? error.message : String(error)}`
  );
}

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

      if (
        entry === "shadcn-studio" &&
        fullPath.replace(/\\/g, "/").endsWith("src/components")
      ) {
        continue;
      }

      if (entry === "governance" && !options?.includeGovernance) {
        files.push(
          ...collectSourceFiles(fullPath, { includeGovernance: true })
        );
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

const duplicateAuthorityPatterns = [
  /const\s+STATUS_TONES\s*=/u,
  /const\s+GOVERNED_STATES\s*=/u,
  /const\s+VARIANT_INTENTS\s*=/u,
  /const\s+VARIANT_AXES\s*=/u,
  /const\s+TOKEN_CATEGORIES\s*=/u,
];

const rawPalettePattern =
  /\b(?:bg|text|border)-(?:red|blue|green|yellow|orange|purple|pink|emerald|lime|cyan|sky|indigo|violet|fuchsia|rose|amber|teal)-\d{2,3}\b/u;

const governedComponentFiles = [...GOVERNED_COMPONENT_SOURCE_FILES];

const prohibitedSemanticPattern =
  /\b(?:bg|text|border|ring|shadow|rounded|opacity|animate|duration|ease)-/u;

const prohibitedArbitraryPattern = /\b(?:rounded|shadow|text)-\[/u;

const exportedCvaPattern = /export\s+const\s+\w+Variants\s*=/u;

const deepImportPattern =
  /@afenda\/design-system\/(?:src|contracts|policies|recipes|tokens|variants)\//u;

const directDesignSystemImportPattern =
  /^\s*import\s+(?:type\s+)?(?:[\w*{}\s,]+)\s+from\s+["']@afenda\/design-system/mu;

const componentCvaPattern = /\bcva\s*\(/u;

const resolvePrimitiveGovernancePattern = /resolvePrimitiveGovernance\s*\(/u;

const governedAttributesBeforePropsPattern =
  /\{\.\.\.governed\.dataAttributes\}\s*\n?\s*(?:className=\{[^}]+\}\s*\n?\s*)?\{\.\.\.props\}/u;

const stateStringPropPattern = /state\?:\s*string/u;

const stockShadcnCompatUsagePattern =
  /\b(?:mapStockButtonProps|mapStockButtonSize|mapStockButtonVisualToGoverned)\b/u;

const stockShadcnCompatAllowedPaths = new Set<string>([
  "src/governance/stock-shadcn-compat.ts",
  "src/governance/index.ts",
  ...STOCK_SHADCN_PENDING,
]);

for (const filePath of collectSourceFiles(uiSrcRoot)) {
  const relativePath = relative(packageRoot, filePath).replace(/\\/g, "/");
  const source = readText(filePath);
  const isDesignSystemBridge = relativePath === designSystemBridgePath;
  const isRecipeImplementation = recipeImplementationPaths.has(relativePath);
  const isGovernedComponent = governedComponentFiles.includes(relativePath);

  if (!isDesignSystemBridge) {
    for (const pattern of duplicateAuthorityPatterns) {
      if (pattern.test(source)) {
        failures.push(
          `${relativePath}: defines duplicate design authority registry`
        );
      }
    }

    if (deepImportPattern.test(source)) {
      failures.push(
        `${relativePath}: deep-imports @afenda/design-system private paths`
      );
    }

    if (
      relativePath.startsWith("src/components/") &&
      directDesignSystemImportPattern.test(source)
    ) {
      failures.push(
        `${relativePath}: imports @afenda/design-system directly instead of governance adapter`
      );
    }
  }

  if (isRecipeImplementation) {
    if (exportedCvaPattern.test(source)) {
      failures.push(
        `${relativePath}: exports CVA runtime object directly — rename to internal *RecipeRuntime and export only resolver functions`
      );
    }

    if (rawPalettePattern.test(source)) {
      failures.push(
        `${relativePath}: uses raw color-scale palette utilities — use semantic token utilities only`
      );
    }
  }

  if (isGovernedComponent) {
    if (componentCvaPattern.test(source)) {
      failures.push(
        `${relativePath}: governed component must not define local cva()`
      );
    }

    if (!resolvePrimitiveGovernancePattern.test(source)) {
      failures.push(
        `${relativePath}: governed component must call resolvePrimitiveGovernance()`
      );
    }

    if (rawPalettePattern.test(source)) {
      failures.push(
        `${relativePath}: uses raw semantic Tailwind palette classes`
      );
    }

    if (prohibitedSemanticPattern.test(source)) {
      failures.push(
        `${relativePath}: uses raw semantic Tailwind classes outside recipe ownership`
      );
    }

    if (prohibitedArbitraryPattern.test(source)) {
      failures.push(
        `${relativePath}: uses arbitrary radius/shadow/typography utilities outside recipe ownership`
      );
    }

    if (governedAttributesBeforePropsPattern.test(source)) {
      failures.push(
        `${relativePath}: {...governed.dataAttributes} must not precede {...props} — use applyGovernedPresentation()`
      );
    }

    if (stateStringPropPattern.test(source)) {
      failures.push(
        `${relativePath}: state prop must use GovernedState via Governed*Props — not state?: string`
      );
    }
  }

  if (
    stockShadcnCompatUsagePattern.test(source) &&
    !stockShadcnCompatAllowedPaths.has(relativePath)
  ) {
    failures.push(
      `${relativePath}: imports stock shadcn Button compatibility bridge outside STOCK_SHADCN_PENDING — use governed Button props directly`
    );
  }
}

const indexSource = readText(join(uiSrcRoot, "index.ts"));
for (const exportName of PRIMARY_UI_EXPORTS) {
  if (!indexSource.includes(exportName)) {
    failures.push(
      `src/index.ts: missing primary export "${exportName}" for registry coverage`
    );
  }
}

for (const pendingFile of STOCK_SHADCN_PENDING) {
  if (!readText(join(packageRoot, pendingFile))) {
    failures.push(
      `${pendingFile}: listed in STOCK_SHADCN_PENDING but file is missing`
    );
  }
}

if (
  (EXPORTED_STOCK_COMPONENTS as readonly string[]).length === 0 &&
  (STOCK_SHADCN_PENDING as readonly string[]).length > 0
) {
  failures.push(
    "EXPORTED_STOCK_COMPONENTS must not be empty while STOCK_SHADCN_PENDING has entries"
  );
}

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

const uiPackageJson = JSON.parse(
  readText(join(packageRoot, "package.json"))
) as {
  dependencies?: Record<string, string>;
};

if (!uiPackageJson.dependencies?.["@afenda/design-system"]) {
  failures.push(
    "packages/ui/package.json: missing @afenda/design-system dependency"
  );
}

if (failures.length > 0) {
  console.error("Design-system consumption check failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("@afenda/ui design-system consumption check passed.");
