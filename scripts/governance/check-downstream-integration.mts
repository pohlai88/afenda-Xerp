#!/usr/bin/env tsx
/**
 * ADR-0027 presentation-chain integration gate.
 *
 * Verifies the post-nuclear frontend stack:
 *   @afenda/shadcn-studio → apps/erp | apps/storybook
 *
 * Legacy packages (@afenda/ui, appshell, metadata-ui, css-authority) must not
 * exist on disk or appear in ERP/Storybook dependency graphs.
 */

import { existsSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const RETIRED_PACKAGES = [
  "@afenda/ui",
  "@afenda/ui-composition",
  "@afenda/metadata-ui",
  "@afenda/appshell",
  "@afenda/css-authority",
  "@afenda/design-system",
] as const;

const RETIRED_PACKAGE_DIRS = [
  "packages/ui",
  "packages/ui-composition",
  "packages/metadata-ui",
  "packages/appshell",
  "packages/css-authority",
  "packages/design-system",
] as const;

const ERP_GLOBALS = join(repoRoot, "apps/erp/src/app/globals.css");
const STORYBOOK_PREVIEW_CSS = join(
  repoRoot,
  "apps/storybook/.storybook/preview.css"
);

const APPROVED_ERP_CSS_IMPORTS = [
  "@afenda/shadcn-studio/shadcn-studio.css",
  "tailwindcss",
  "shadcn/tailwind.css",
] as const;

const FORBIDDEN_ERP_CSS_IMPORTS = [
  "@afenda/ui/",
  "@afenda/appshell/",
  "@afenda/metadata-ui/",
  "@afenda/css-authority/",
  "@afenda/design-system/",
] as const;

const CSS_IMPORT_PATTERN = /@import\s+["']([^"']+)["']/g;

export interface DownstreamViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function rel(file: string): string {
  return relative(repoRoot, file).replace(/\\/g, "/");
}

function readJson(path: string): Record<string, unknown> {
  return JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
}

function checkRetiredPackagesAbsent(
  violations: DownstreamViolation[]
): void {
  for (const dir of RETIRED_PACKAGE_DIRS) {
    const packageJsonPath = join(repoRoot, dir, "package.json");
    if (existsSync(packageJsonPath)) {
      violations.push({
        rule: "retired-package-filesystem",
        file: rel(packageJsonPath),
        message: `${dir} must not exist after ADR-0027 — remove or archive-lane only`,
      });
    }
  }
}

function checkConsumerDependencies(
  violations: DownstreamViolation[],
  consumerPath: string,
  consumerLabel: string,
  allowedRuntimeDeps: readonly string[]
): void {
  const packageJsonPath = join(repoRoot, consumerPath, "package.json");
  if (!existsSync(packageJsonPath)) {
    return;
  }

  const json = readJson(packageJsonPath) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const runtimeDeps = json.dependencies ?? {};
  const allowed = new Set(allowedRuntimeDeps);

  for (const retired of RETIRED_PACKAGES) {
    if (runtimeDeps[retired] || json.devDependencies?.[retired]) {
      violations.push({
        rule: "retired-package-dependency",
        file: rel(packageJsonPath),
        message: `${consumerLabel} must not depend on ${retired} (ADR-0027)`,
      });
    }
  }

  for (const [dep, spec] of Object.entries(runtimeDeps)) {
    if (!dep.startsWith("@afenda/")) {
      continue;
    }
    if (spec !== "workspace:*") {
      continue;
    }
    if (!allowed.has(dep)) {
      violations.push({
        rule: "unexpected-workspace-dependency",
        file: rel(packageJsonPath),
        message: `${consumerLabel} declares unexpected runtime workspace dependency ${dep}`,
      });
    }
  }
}

function checkCssImports(
  violations: DownstreamViolation[],
  cssPath: string,
  label: string,
  required: readonly string[],
  forbidden: readonly string[]
): void {
  if (!existsSync(cssPath)) {
    violations.push({
      rule: "css-entry-missing",
      file: rel(cssPath),
      message: `${label} CSS entry is missing`,
    });
    return;
  }

  const content = readFileSync(cssPath, "utf8");
  const imports = [...content.matchAll(CSS_IMPORT_PATTERN)].map(
    (match) => match[1] ?? ""
  );

  for (const requiredImport of required) {
    if (!imports.some((entry) => entry === requiredImport)) {
      violations.push({
        rule: "css-import-missing",
        file: rel(cssPath),
        message: `${label} must @import "${requiredImport}"`,
      });
    }
  }

  for (const forbiddenImport of forbidden) {
    if (content.includes(forbiddenImport)) {
      violations.push({
        rule: "css-import-forbidden",
        file: rel(cssPath),
        message: `${label} must not import legacy path containing "${forbiddenImport}"`,
      });
    }
  }

  if (label === "ERP globals") {
    const shadcnIdx = imports.indexOf("@afenda/shadcn-studio/shadcn-studio.css");
    const tailwindIdx = imports.indexOf("tailwindcss");
    const shadcnTailwindIdx = imports.indexOf("shadcn/tailwind.css");
    if (
      shadcnIdx > -1 &&
      tailwindIdx > -1 &&
      shadcnTailwindIdx > -1 &&
      !(shadcnIdx < tailwindIdx && tailwindIdx < shadcnTailwindIdx)
    ) {
      violations.push({
        rule: "css-import-order",
        file: rel(cssPath),
        message:
          "ERP globals.css import order must be shadcn-studio.css → tailwindcss → shadcn/tailwind.css",
      });
    }
  }
}

export function checkDownstreamIntegration(): DownstreamViolation[] {
  const violations: DownstreamViolation[] = [];

  checkRetiredPackagesAbsent(violations);

  checkConsumerDependencies(violations, "apps/erp", "apps/erp", [
    "@afenda/auth",
    "@afenda/database",
    "@afenda/observability",
    "@afenda/shadcn-studio",
  ]);

  checkConsumerDependencies(violations, "apps/storybook", "apps/storybook", [
    "@afenda/shadcn-studio",
    "@afenda/testing",
  ]);

  checkCssImports(
    violations,
    ERP_GLOBALS,
    "ERP globals",
    APPROVED_ERP_CSS_IMPORTS,
    FORBIDDEN_ERP_CSS_IMPORTS
  );

  if (existsSync(STORYBOOK_PREVIEW_CSS)) {
    const previewCss = readFileSync(STORYBOOK_PREVIEW_CSS, "utf8");
    for (const forbidden of FORBIDDEN_ERP_CSS_IMPORTS) {
      if (previewCss.includes(forbidden)) {
        violations.push({
          rule: "storybook-css-forbidden",
          file: rel(STORYBOOK_PREVIEW_CSS),
          message: `Storybook preview.css must not import legacy path "${forbidden}"`,
        });
      }
    }
  }

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

  console.log("downstream integration valid (ADR-0027 presentation chain)");
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
