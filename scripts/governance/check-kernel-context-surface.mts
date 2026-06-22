#!/usr/bin/env tsx
/**
 * Kernel operating-context surface gate (multi-tenancy.md §354–369).
 *
 * Verifies required contract files, barrel exports, dist freshness, and
 * forbidden deep-import patterns across workspace consumers.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const kernelRoot = join(repoRoot, "packages/kernel");
const contextRoot = join(kernelRoot, "src/context");
const contextIndexSource = join(contextRoot, "index.ts");
const contextRegistrySource = join(contextRoot, "context-registry.ts");
const kernelRootIndexSource = join(kernelRoot, "src/index.ts");
const distContextIndex = join(kernelRoot, "dist/context/index.d.ts");
const distRootIndex = join(kernelRoot, "dist/index.d.ts");

const CONSUMER_SCAN_ROOTS = [
  join(repoRoot, "apps/erp/src"),
  join(repoRoot, "packages/appshell/src"),
  join(repoRoot, "packages/permissions/src"),
  join(repoRoot, "packages/auth/src"),
  join(repoRoot, "packages/execution/src"),
] as const;

const FORBIDDEN_IMPORT_PATTERNS = [
  /@afenda\/kernel\/dist\//,
  /@afenda\/kernel\/src\//,
  /@afenda\/kernel\/context\/[^"']+/,
] as const;

const REQUIRED_DIST_EXPORTS = [
  "OperatingContext",
  "deriveConsolidationScopeContext",
  "isOwnershipInterestEffectiveAt",
  "KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES",
] as const;

export interface KernelContextViolation {
  readonly rule: string;
  readonly file: string;
  readonly message: string;
}

function listSourceFiles(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist") {
        continue;
      }
      files.push(...listSourceFiles(fullPath));
      continue;
    }

    if (/\.(ts|tsx|mts)$/.test(entry.name) && !/\.(test|spec)\./.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function parseRegistryModuleFiles(source: string): {
  readonly required: readonly string[];
  readonly support: readonly string[];
  readonly primaryTypes: readonly string[];
} {
  const required: string[] = [];
  const support: string[] = [];
  const primaryTypes: string[] = [];

  const requiredBlock = source.match(
    /KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES\s*=\s*\[([\s\S]*?)\]\s*as\s*const/
  );
  if (requiredBlock?.[1]) {
    for (const fileMatch of requiredBlock[1].matchAll(/file:\s*"([^"]+)"/g)) {
      required.push(fileMatch[1] ?? "");
    }
    for (const typeMatch of requiredBlock[1].matchAll(/primaryType:\s*"([^"]+)"/g)) {
      primaryTypes.push(typeMatch[1] ?? "");
    }
  }

  const supportBlock = source.match(
    /KERNEL_OPERATING_CONTEXT_SUPPORT_MODULES\s*=\s*\[([\s\S]*?)\]\s*as\s*const/
  );
  if (supportBlock?.[1]) {
    for (const fileMatch of supportBlock[1].matchAll(/"([^"]+\.ts)"/g)) {
      support.push(fileMatch[1] ?? "");
    }
  }

  return { required, support, primaryTypes };
}

function isNewerOrEqual(sourcePath: string, distPath: string): boolean {
  if (!existsSync(distPath)) {
    return false;
  }

  const sourceMtime = statSync(sourcePath).mtimeMs;
  const distMtime = statSync(distPath).mtimeMs;
  return distMtime >= sourceMtime;
}

export function checkKernelContextSurface(): KernelContextViolation[] {
  const violations: KernelContextViolation[] = [];

  if (!existsSync(contextRegistrySource)) {
    violations.push({
      rule: "registry-missing",
      file: contextRegistrySource,
      message: "context-registry.ts is missing",
    });
    return violations;
  }

  const registrySource = readFileSync(contextRegistrySource, "utf8");
  const { required, support, primaryTypes } =
    parseRegistryModuleFiles(registrySource);

  for (const file of required) {
    const path = join(contextRoot, file);
    if (!existsSync(path)) {
      violations.push({
        rule: "required-module-missing",
        file: path,
        message: `Required context contract ${file} is missing`,
      });
    }
  }

  for (const file of support) {
    const path = join(contextRoot, file);
    if (!existsSync(path)) {
      violations.push({
        rule: "support-module-missing",
        file: path,
        message: `Supporting context module ${file} is missing`,
      });
    }
  }

  if (!support.includes("consolidation-scope-resolution.stub.ts")) {
    violations.push({
      rule: "consolidation-stub-registry",
      file: contextRegistrySource,
      message:
        "consolidation-scope-resolution.stub.ts must remain in KERNEL_OPERATING_CONTEXT_SUPPORT_MODULES",
    });
  }

  const indexSource = readFileSync(contextIndexSource, "utf8");
  for (const primaryType of primaryTypes) {
    if (!indexSource.includes(`type ${primaryType}`)) {
      violations.push({
        rule: "index-export-missing",
        file: contextIndexSource,
        message: `${primaryType} is not exported from context/index.ts`,
      });
    }
  }

  const rootIndexSource = readFileSync(kernelRootIndexSource, "utf8");
  for (const symbol of REQUIRED_DIST_EXPORTS) {
    if (!rootIndexSource.includes(symbol)) {
      violations.push({
        rule: "root-reexport-missing",
        file: kernelRootIndexSource,
        message: `${symbol} is not re-exported from packages/kernel/src/index.ts`,
      });
    }
  }

  const accountingSource = join(contextRoot, "accounting-readiness.contract.ts");
  if (existsSync(accountingSource)) {
    const accounting = readFileSync(accountingSource, "utf8");
    if (
      accounting.includes('from "./index.js"') ||
      accounting.includes("from './index.js'")
    ) {
      violations.push({
        rule: "circular-import",
        file: accountingSource,
        message: "accounting-readiness.contract.ts must not import context/index.js",
      });
    }
  }

  for (const scanRoot of CONSUMER_SCAN_ROOTS) {
    for (const file of listSourceFiles(scanRoot)) {
      const source = readFileSync(file, "utf8");
      for (const pattern of FORBIDDEN_IMPORT_PATTERNS) {
        if (pattern.test(source)) {
          violations.push({
            rule: "forbidden-deep-import",
            file,
            message: `Use @afenda/kernel or @afenda/kernel/context — not deep kernel paths (${pattern})`,
          });
        }
      }
    }
  }

  if (existsSync(distContextIndex)) {
    const distSource = readFileSync(distContextIndex, "utf8");
    for (const symbol of REQUIRED_DIST_EXPORTS) {
      if (!distSource.includes(symbol)) {
        violations.push({
          rule: "dist-export-missing",
          file: distContextIndex,
          message: `Built dist is missing export ${symbol} — run pnpm --filter @afenda/kernel build`,
        });
      }
    }

    if (!isNewerOrEqual(contextIndexSource, distContextIndex)) {
      violations.push({
        rule: "stale-dist",
        file: distContextIndex,
        message:
          "dist/context/index.d.ts is older than src/context/index.ts — run pnpm --filter @afenda/kernel build",
      });
    }

    if (
      existsSync(distRootIndex) &&
      !isNewerOrEqual(kernelRootIndexSource, distRootIndex)
    ) {
      violations.push({
        rule: "stale-dist",
        file: distRootIndex,
        message:
          "dist/index.d.ts is older than src/index.ts — run pnpm --filter @afenda/kernel build",
      });
    }
  }

  return violations;
}

export function formatKernelContextViolations(
  violations: readonly KernelContextViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}\n  ${v.message}`)
    .join("\n\n");
}

function main(): void {
  const violations = checkKernelContextSurface();
  if (violations.length > 0) {
    console.error(formatKernelContextViolations(violations));
    process.exit(1);
  }

  console.log("Kernel context surface gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-kernel-context-surface.mts")
    );
  } catch {
    return entry.endsWith("check-kernel-context-surface.mts");
  }
})();

if (isDirectRun) {
  main();
}
