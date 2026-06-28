#!/usr/bin/env tsx
/**
 * Downstream UI composition integration gate.
 *
 * Verifies package boundaries, CSS import order, density bridge authority,
 * recipe map authority, and dependency graph among design-system → ui →
 * metadata / metadata-ui / appshell → apps/erp.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const INTEGRATION_PACKAGES = [
  "@afenda/design-system",
  "@afenda/ui",
  "@afenda/ui-composition",
  "@afenda/metadata-ui",
  "@afenda/appshell",
] as const;

type IntegrationPackage = (typeof INTEGRATION_PACKAGES)[number];

const PACKAGE_ROOTS: Record<IntegrationPackage, string> = {
  "@afenda/design-system": join(repoRoot, "packages/design-system"),
  "@afenda/ui": join(repoRoot, "packages/ui"),
  "@afenda/ui-composition": join(repoRoot, "packages/ui-composition"),
  "@afenda/metadata-ui": join(repoRoot, "packages/metadata-ui"),
  "@afenda/appshell": join(repoRoot, "packages/appshell"),
};

const ERP_GLOBALS = join(repoRoot, "apps/erp/src/app/globals.css");

const APPROVED_ERP_CSS_IMPORTS = [
  "tailwindcss",
  "@afenda/ui/afenda-ui.css",
  "@afenda/ui/afenda-ui-full.css",
  "@afenda/ui/styles.css",
  "@afenda/appshell/afenda-appshell.css",
  "@afenda/appshell/appshell-full.css",
  "@afenda/appshell/styles.css",
  "@afenda/metadata-ui/afenda-metadata-ui.css",
  "@afenda/metadata-ui/styles.css",
  "shadcn/tailwind.css",
] as const;

const FORBIDDEN_ERP_GLOBALS_IMPORTS = [
  "@afenda/metadata-ui/fixtures.css",
  "@afenda/appshell/fixtures.css",
  "metadata-ui/fixtures",
  "appshell/fixtures",
] as const;

const CSS_IMPORT_PATTERN = /@import\s+["']([^"']+)["']/g;

export interface DownstreamViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function collectSourceFiles(
  directory: string,
  options: {
    readonly extensions?: readonly string[];
    readonly skipDirs?: readonly string[];
  } = {}
): string[] {
  const extensions = options.extensions ?? [".ts", ".tsx", ".mts"];
  const skipDirs = new Set(
    options.skipDirs ?? ["node_modules", "dist", ".next"]
  );

  const files: string[] = [];

  if (!existsSync(directory)) {
    return files;
  }

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) {
        continue;
      }
      files.push(...collectSourceFiles(absolutePath, options));
      continue;
    }

    if (extensions.some((extension) => entry.name.endsWith(extension))) {
      files.push(absolutePath);
    }
  }

  return files;
}

function rel(file: string): string {
  return relative(repoRoot, file).replace(/\\/g, "/");
}

function readPackageJson(pkg: IntegrationPackage): {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
} {
  return JSON.parse(
    readFileSync(join(PACKAGE_ROOTS[pkg], "package.json"), "utf8")
  ) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
}

function packageImportsTarget(content: string, target: string): boolean {
  return (
    content.includes(`from "${target}"`) ||
    content.includes(`from '${target}'`) ||
    content.includes(`import("${target}")`) ||
    content.includes(`import '${target}'`) ||
    content.includes(`import "${target}"`)
  );
}

function productionSourceFiles(pkg: IntegrationPackage): string[] {
  return collectSourceFiles(join(PACKAGE_ROOTS[pkg], "src"), {
    skipDirs: ["node_modules", "dist", "__tests__", "_storybook"],
  }).filter((file) => !file.endsWith(".stories.tsx"));
}

function checkMetadataContractOnly(violations: DownstreamViolation[]): void {
  const metadataRoot = PACKAGE_ROOTS["@afenda/ui-composition"];
  const files = collectSourceFiles(metadataRoot, {
    extensions: [".ts", ".tsx", ".css"],
    skipDirs: ["node_modules", "dist", "__tests__"],
  });

  for (const file of files) {
    if (/\.(css|tsx)$/.test(file)) {
      violations.push({
        rule: "metadata-contract-only",
        file: rel(file),
        message:
          "@afenda/ui-composition must not ship CSS or TSX implementation files",
      });
    }

    const content = readFileSync(file, "utf8");
    for (const prohibited of [
      "@afenda/ui",
      "@afenda/metadata-ui",
      "@afenda/appshell",
    ]) {
      if (packageImportsTarget(content, prohibited)) {
        violations.push({
          rule: "metadata-no-ui-imports",
          file: rel(file),
          message: `@afenda/ui-composition must not import ${prohibited}`,
        });
      }
    }

    if (CSS_IMPORT_PATTERN.test(content)) {
      violations.push({
        rule: "metadata-no-css",
        file: rel(file),
        message: "@afenda/ui-composition must not import CSS",
      });
    }
  }
}

function checkPackageDependency(
  violations: DownstreamViolation[],
  pkg: IntegrationPackage,
  required: string | readonly string[],
  forbidden: readonly string[]
): void {
  const packageJson = readPackageJson(pkg);
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  for (const dep of Array.isArray(required) ? required : [required]) {
    if (!deps[dep]) {
      violations.push({
        rule: "required-dependency",
        file: rel(join(PACKAGE_ROOTS[pkg], "package.json")),
        message: `${pkg} must declare dependency on ${dep}`,
      });
    }
  }

  for (const dep of forbidden) {
    if (deps[dep]) {
      violations.push({
        rule: "forbidden-dependency",
        file: rel(join(PACKAGE_ROOTS[pkg], "package.json")),
        message: `${pkg} must not depend on ${dep}`,
      });
    }
  }
}

function checkProductionImports(
  violations: DownstreamViolation[],
  pkg: IntegrationPackage,
  forbidden: readonly string[],
  rule: string
): void {
  for (const file of productionSourceFiles(pkg)) {
    const content = readFileSync(file, "utf8");
    for (const target of forbidden) {
      if (packageImportsTarget(content, target)) {
        violations.push({
          rule,
          file: rel(file),
          message: `${pkg} production source must not import ${target}`,
        });
      }
    }
  }
}

function checkRequiredProductionImport(
  violations: DownstreamViolation[],
  pkg: IntegrationPackage,
  required: string,
  rule: string
): void {
  const files = productionSourceFiles(pkg);
  const hasImport = files.some((file) =>
    packageImportsTarget(readFileSync(file, "utf8"), required)
  );

  if (!hasImport) {
    violations.push({
      rule,
      file: rel(join(PACKAGE_ROOTS[pkg], "src")),
      message: `${pkg} production source must import ${required}`,
    });
  }
}

function checkDuplicateAuthority(
  violations: DownstreamViolation[],
  pkg: IntegrationPackage,
  pattern: RegExp,
  rule: string,
  message: string
): void {
  if (pkg === "@afenda/design-system" || pkg === "@afenda/ui") {
    return;
  }

  for (const file of productionSourceFiles(pkg)) {
    const content = readFileSync(file, "utf8");
    if (pattern.test(content)) {
      violations.push({
        rule,
        file: rel(file),
        message,
      });
    }
  }
}

function checkDownstreamTokenAuthority(
  violations: DownstreamViolation[]
): void {
  const downstream: IntegrationPackage[] = [
    "@afenda/ui",
    "@afenda/metadata-ui",
    "@afenda/appshell",
  ];

  for (const pkg of downstream) {
    const cssFiles = collectSourceFiles(PACKAGE_ROOTS[pkg], {
      extensions: [".css"],
      skipDirs: ["node_modules", "dist", "__tests__"],
    });

    for (const file of cssFiles) {
      const content = readFileSync(file, "utf8");
      if (/^\s*--afenda-[a-z0-9-]+\s*:/m.test(content)) {
        violations.push({
          rule: "no-downstream-token-authority",
          file: rel(file),
          message: `${pkg} must not define --afenda-* token authority`,
        });
      }
    }
  }

  const erpCssFiles = collectSourceFiles(join(repoRoot, "apps/erp/src"), {
    extensions: [".css"],
    skipDirs: ["node_modules", "dist", "__tests__"],
  });

  for (const file of erpCssFiles) {
    const content = readFileSync(file, "utf8");
    if (/^\s*--afenda-[a-z0-9-]+\s*:/m.test(content)) {
      violations.push({
        rule: "erp-no-token-authority",
        file: rel(file),
        message: "apps/erp must not define --afenda-* token authority in CSS",
      });
    }
  }
}

function checkErpGlobalsCss(violations: DownstreamViolation[]): void {
  if (!existsSync(ERP_GLOBALS)) {
    violations.push({
      rule: "erp-globals-exists",
      file: "apps/erp/src/app/globals.css",
      message: "ERP globals.css entrypoint is missing",
    });
    return;
  }

  const content = readFileSync(ERP_GLOBALS, "utf8");

  const imports = [...content.matchAll(CSS_IMPORT_PATTERN)].map(
    (match) => match[1]
  );

  for (const value of imports) {
    for (const forbidden of FORBIDDEN_ERP_GLOBALS_IMPORTS) {
      if (value.includes(forbidden)) {
        violations.push({
          rule: "erp-no-fixture-css",
          file: rel(ERP_GLOBALS),
          message: `ERP globals must not import fixture CSS (${value})`,
        });
      }
    }
  }

  const packageImports = imports.filter(
    (value) => value.startsWith("@afenda/") || value.startsWith("shadcn/")
  );

  for (const value of packageImports) {
    if (!(APPROVED_ERP_CSS_IMPORTS as readonly string[]).includes(value)) {
      violations.push({
        rule: "erp-approved-css-imports",
        file: rel(ERP_GLOBALS),
        message: `Unapproved ERP CSS import: ${value}`,
      });
    }
  }

  const uiIndex = imports.findIndex(
    (value) =>
      value.startsWith("@afenda/ui/") &&
      (value.includes("afenda-ui") || value.endsWith("styles.css"))
  );
  const appshellIndex = imports.findIndex(
    (value) =>
      value.startsWith("@afenda/appshell/") &&
      (value.includes("appshell") || value.endsWith("styles.css"))
  );
  const metadataUiIndex = imports.findIndex(
    (value) =>
      value.startsWith("@afenda/metadata-ui/") &&
      (value.includes("metadata-ui") || value.endsWith("styles.css"))
  );

  if (
    uiIndex >= 0 &&
    appshellIndex >= 0 &&
    metadataUiIndex >= 0 &&
    !(uiIndex < appshellIndex && appshellIndex < metadataUiIndex)
  ) {
    violations.push({
      rule: "erp-css-import-order",
      file: rel(ERP_GLOBALS),
      message:
        "ERP globals CSS import order must be ui → appshell → metadata-ui",
    });
  }
}

function checkDependencyGraph(violations: DownstreamViolation[]): void {
  checkPackageDependency(
    violations,
    "@afenda/design-system",
    [],
    [
      "@afenda/ui",
      "@afenda/ui-composition",
      "@afenda/metadata-ui",
      "@afenda/appshell",
    ]
  );

  checkPackageDependency(violations, "@afenda/ui", "@afenda/design-system", [
    "@afenda/metadata-ui",
    "@afenda/appshell",
    "@afenda/ui-composition",
  ]);

  checkPackageDependency(
    violations,
    "@afenda/ui-composition",
    [],
    [
      "@afenda/ui",
      "@afenda/metadata-ui",
      "@afenda/appshell",
      "@afenda/design-system",
    ]
  );

  checkPackageDependency(
    violations,
    "@afenda/metadata-ui",
    ["@afenda/ui-composition", "@afenda/ui"],
    ["@afenda/appshell"]
  );

  checkPackageDependency(violations, "@afenda/appshell", "@afenda/ui", [
    "@afenda/metadata-ui",
    "@afenda/ui-composition",
  ]);

  checkProductionImports(
    violations,
    "@afenda/metadata-ui",
    ["@afenda/appshell"],
    "metadata-ui-no-appshell-import"
  );

  checkProductionImports(
    violations,
    "@afenda/appshell",
    ["@afenda/metadata-ui", "@afenda/ui-composition"],
    "appshell-no-metadata-ui-import"
  );

  checkRequiredProductionImport(
    violations,
    "@afenda/metadata-ui",
    "@afenda/ui-composition",
    "metadata-ui-consumes-metadata"
  );

  checkRequiredProductionImport(
    violations,
    "@afenda/metadata-ui",
    "@afenda/ui/governance",
    "metadata-ui-consumes-ui-governance"
  );

  checkRequiredProductionImport(
    violations,
    "@afenda/appshell",
    "@afenda/ui/governance",
    "appshell-consumes-ui-governance"
  );
}

function checkCircularDependencies(violations: DownstreamViolation[]): void {
  const graph = new Map<IntegrationPackage, IntegrationPackage[]>();

  for (const pkg of INTEGRATION_PACKAGES) {
    const packageJson = readPackageJson(pkg);
    const deps = Object.keys({
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    }).filter((dep): dep is IntegrationPackage =>
      (INTEGRATION_PACKAGES as readonly string[]).includes(dep)
    );
    graph.set(pkg, deps);
  }

  const visiting = new Set<IntegrationPackage>();
  const visited = new Set<IntegrationPackage>();
  const stack: IntegrationPackage[] = [];

  function visit(node: IntegrationPackage): void {
    if (visited.has(node)) {
      return;
    }
    if (visiting.has(node)) {
      const cycleStart = stack.indexOf(node);
      const cycle = [...stack.slice(cycleStart), node].join(" → ");
      violations.push({
        rule: "no-circular-dependencies",
        file: "package dependency graph",
        message: `Circular dependency detected: ${cycle}`,
      });
      return;
    }

    visiting.add(node);
    stack.push(node);

    for (const dep of graph.get(node) ?? []) {
      visit(dep);
    }

    stack.pop();
    visiting.delete(node);
    visited.add(node);
  }

  for (const pkg of INTEGRATION_PACKAGES) {
    visit(pkg);
  }
}

function extractCssImportPaths(content: string): string[] {
  const cssImports = [...content.matchAll(CSS_IMPORT_PATTERN)].map(
    (match) => match[1]
  );
  const jsCssImports = [
    ...content.matchAll(/import\s+["'](@afenda\/[^"']+\.css)["']/g),
  ].map((match) => match[1]);

  return [...cssImports, ...jsCssImports];
}

function checkStorybookComposedCss(violations: DownstreamViolation[]): void {
  const composedStoryPaths = [
    join(
      repoRoot,
      "apps/storybook/stories/governance-integration-composed.stories.tsx"
    ),
    join(repoRoot, "apps/erp/src/stories/governance-integration.stories.tsx"),
  ];

  for (const storyPath of composedStoryPaths) {
    if (!existsSync(storyPath)) {
      continue;
    }

    const content = readFileSync(storyPath, "utf8");
    const imports = extractCssImportPaths(content);

    const uiImport = imports.find((value) => value.startsWith("@afenda/ui/"));
    const appshellImport = imports.find((value) =>
      value.startsWith("@afenda/appshell/")
    );
    const metadataUiImport = imports.find((value) =>
      value.startsWith("@afenda/metadata-ui/")
    );

    if (!(uiImport && appshellImport && metadataUiImport)) {
      violations.push({
        rule: "storybook-composed-css",
        file: rel(storyPath),
        message:
          "Composed integration story must import ui, appshell, and metadata-ui CSS",
      });
      continue;
    }

    const uiIndex = imports.indexOf(uiImport);
    const appshellIndex = imports.indexOf(appshellImport);
    const metadataUiIndex = imports.indexOf(metadataUiImport);

    if (!(uiIndex < appshellIndex && appshellIndex < metadataUiIndex)) {
      violations.push({
        rule: "storybook-composed-css-order",
        file: rel(storyPath),
        message:
          "Composed integration story CSS import order must be ui → appshell → metadata-ui",
      });
    }
  }
}

function checkLocalDensityBridgeDuplicates(
  violations: DownstreamViolation[]
): void {
  const forbiddenPatterns = [
    /density\s*===\s*["']standard["']\s*\?\s*["']default["']/,
    /\bexport\s+const\s+DENSITY_ATTRIBUTES\b/,
    /\bdensityAttributeMap\b/,
    /\btoDensityAttribute\b/,
    /\bfromDensityAttribute\b/,
  ];

  const downstream: IntegrationPackage[] = [
    "@afenda/metadata-ui",
    "@afenda/appshell",
  ];

  for (const pkg of downstream) {
    for (const file of productionSourceFiles(pkg)) {
      const content = readFileSync(file, "utf8");
      for (const pattern of forbiddenPatterns) {
        if (pattern.test(content)) {
          violations.push({
            rule: "no-local-density-bridge",
            file: rel(file),
            message: `${pkg} must not define duplicate density bridge helpers`,
          });
        }
      }
    }
  }
}

function checkDuplicateRecipeMaps(violations: DownstreamViolation[]): void {
  checkDuplicateAuthority(
    violations,
    "@afenda/metadata-ui",
    /\bexport\s+const\s+APP_SHELL_RECIPE_SLOTS\b/,
    "no-duplicate-appshell-recipes",
    "@afenda/metadata-ui must not define AppShell recipe maps"
  );
  checkDuplicateAuthority(
    violations,
    "@afenda/appshell",
    /\bexport\s+const\s+APP_SHELL_RECIPE_SLOTS\b/,
    "no-duplicate-appshell-recipes",
    "@afenda/appshell must not define duplicate AppShell recipe maps outside ui/governance"
  );
  checkDuplicateAuthority(
    violations,
    "@afenda/metadata-ui",
    /\bexport\s+const\s+METADATA_UI_RECIPE_SLOTS\b/,
    "no-duplicate-metadata-ui-recipes",
    "@afenda/metadata-ui must not define duplicate Metadata UI recipe maps outside ui/governance"
  );
  checkDuplicateAuthority(
    violations,
    "@afenda/appshell",
    /\bexport\s+const\s+METADATA_UI_RECIPE_SLOTS\b/,
    "no-duplicate-metadata-ui-recipes",
    "@afenda/appshell must not define Metadata UI recipe maps"
  );
}

export function checkDownstreamIntegration(): DownstreamViolation[] {
  const violations: DownstreamViolation[] = [];

  checkMetadataContractOnly(violations);
  checkDependencyGraph(violations);
  checkCircularDependencies(violations);
  checkDuplicateRecipeMaps(violations);
  checkLocalDensityBridgeDuplicates(violations);
  checkDownstreamTokenAuthority(violations);
  checkErpGlobalsCss(violations);
  checkStorybookComposedCss(violations);

  return violations;
}

export function formatDownstreamViolations(
  violations: readonly DownstreamViolation[]
): string {
  return violations
    .map(
      (violation) =>
        `[${violation.rule}] ${violation.file}: ${violation.message}`
    )
    .join("\n");
}

function main(): void {
  const violations = checkDownstreamIntegration();

  if (violations.length > 0) {
    console.error("downstream integration check failed:");
    console.error(formatDownstreamViolations(violations));
    process.exitCode = 1;
    return;
  }

  console.log("downstream integration valid");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-downstream-integration.mts")
    );
  } catch {
    return false;
  }
})();

if (isDirectRun) {
  main();
}
