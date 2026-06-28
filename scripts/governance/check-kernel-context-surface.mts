#!/usr/bin/env tsx
/**
 * Kernel operating-context surface gate (multi-tenancy.md §354–369).
 *
 * Verifies required contract files, barrel exports, dist freshness, and
 * forbidden deep-import patterns across workspace consumers.
 *
 * Standalone invocations (`pnpm quality:kernel-context-surface`) run
 * `pnpm --filter @afenda/kernel build` first via package.json choreography
 * so gitignored dist/ is always fresh before stale-dist checks (fdr-010-context-contracts Slice 2).
 */

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { KERNEL_OPERATING_CONTEXT_WIRE_INGRESS_MODULES } from "../../packages/kernel/src/context/context-registry.ts";
import { RETIRED_KERNEL_REPO_PATHS } from "../../packages/kernel/src/contracts/kernel-package-layout.contract.ts";

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

const RETIRED_CONTEXT_MODULES = [
  "app-shell-context.contract.ts",
  "accounting-readiness-context.contract.ts",
  "accounting-readiness-gate-live-status.contract.ts",
  "accounting-readiness-gate-requirement-id.contract.ts",
  "consolidation-scope-resolution.ts",
  "consolidation-scope-investee-merge.policy.ts",
  "runtime-module-path.ts",
] as const;

const RETIRED_KERNEL_BUSINESS_REFERENCE_IDENTITY_MODULES = [
  "contracts/business-reference-identity/business-master-data-scaffold.policy.ts",
  "contracts/business-master-data/business-master-data-scaffold.policy.ts",
] as const;

const FORBIDDEN_KERNEL_SCAFFOLD_EXPORTS = [
  "BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS",
  "BUSINESS_MASTER_DATA_RESERVED_PACKAGES",
  "BUSINESS_MASTER_DATA_RUNTIME_STATUS",
  "assertAuthorityOnlyRuntimeStatus",
  "isBusinessMasterDataReservedPackage",
  "BusinessMasterDataRuntimeStatus",
  "BusinessMasterDataReservedPackageId",
] as const;

const REQUIRED_PERMISSION_VOCABULARY_MODULE =
  "permission-grant-vocabulary.contract.ts" as const;

const REQUIRED_PERMISSION_SCOPE_MODULE =
  "permission-scope-context.contract.ts" as const;

const FORBIDDEN_KERNEL_ROOT_EXPORTS = [
  "formatWorkspaceDisplayLabel",
  "toAccountingReadinessContext",
  "resolveReportingCurrency",
  "ApplicationShellContextSwitchTarget",
  "ApplicationShellAllowedContextOptions",
  "AccountingReadinessGateLiveSnapshot",
  "isCostCenterOrganizationUnit",
  "deriveConsolidationScopeContext",
  "parseSurfaceId",
  "parseWorkflowId",
  "toSurfaceContext",
  "toWorkflowContext",
  "normalizeRuntimeModulePath",
  "mergeInvesteeConsolidationScopeEntry",
] as const;

const REQUIRED_DIST_EXPORTS = [
  "OperatingContext",
  "isOwnershipInterestEffectiveAt",
  "KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES",
] as const;

export interface KernelContextViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
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

    if (
      /\.(ts|tsx|mts)$/.test(entry.name) &&
      !/\.(test|spec)\./.test(entry.name)
    ) {
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
    for (const typeMatch of requiredBlock[1].matchAll(
      /primaryType:\s*"([^"]+)"/g
    )) {
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

  for (const triad of KERNEL_OPERATING_CONTEXT_WIRE_INGRESS_MODULES) {
    for (const file of [triad.contract, triad.assert, triad.parser] as const) {
      const path = join(contextRoot, file);
      if (!existsSync(path)) {
        violations.push({
          rule: "wire-ingress-module-missing",
          file: path,
          message: `Wire ingress triad file missing for ${triad.slug}: ${file}`,
        });
      }

      const contractPath = join(contextRoot, triad.contract);
      if (existsSync(contractPath)) {
        const contractSource = readFileSync(contractPath, "utf8");
        if (!contractSource.includes(`interface ${triad.wireType}`)) {
          violations.push({
            rule: "wire-type-missing",
            file: contractPath,
            message: `${triad.contract} must export wire interface ${triad.wireType}`,
          });
        }
      }
    }
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

  for (const retiredModule of RETIRED_CONTEXT_MODULES) {
    const retiredPath = join(contextRoot, retiredModule);
    if (existsSync(retiredPath)) {
      violations.push({
        rule: "retired-context-module",
        file: retiredPath,
        message: `${retiredModule} was moved out of kernel — delete the orphaned file`,
      });
    }
  }

  for (const repoRelative of RETIRED_KERNEL_REPO_PATHS) {
    const retiredPath = join(repoRoot, repoRelative);
    if (existsSync(retiredPath)) {
      violations.push({
        rule: "retired-kernel-repo-path",
        file: retiredPath,
        message: `${repoRelative} was relocated — delete the orphaned file`,
      });
    }
  }

  const kernelSrcRoot = join(kernelRoot, "src");
  for (const retiredModule of RETIRED_KERNEL_BUSINESS_REFERENCE_IDENTITY_MODULES) {
    const retiredPath = join(kernelSrcRoot, retiredModule);
    if (existsSync(retiredPath)) {
      violations.push({
        rule: "retired-business-master-data-scaffold-module",
        file: retiredPath,
        message: `${retiredModule} was moved to @afenda/architecture-authority — delete the orphaned file`,
      });
    }
  }

  const businessReferenceIdentityIndexSource = join(
    kernelSrcRoot,
    "contracts/business-reference-identity/index.ts"
  );
  if (existsSync(businessReferenceIdentityIndexSource)) {
    const businessReferenceIdentityIndex = readFileSync(
      businessReferenceIdentityIndexSource,
      "utf8"
    );
    for (const symbol of FORBIDDEN_KERNEL_SCAFFOLD_EXPORTS) {
      if (businessReferenceIdentityIndex.includes(symbol)) {
        violations.push({
          rule: "prohibited-kernel-scaffold-export",
          file: businessReferenceIdentityIndexSource,
          message: `${symbol} must not be exported from @afenda/kernel — use @afenda/architecture-authority (ADR-0020)`,
        });
      }
    }
  }

  const permissionVocabularyPath = join(
    contextRoot,
    REQUIRED_PERMISSION_VOCABULARY_MODULE
  );
  const permissionScopePath = join(
    contextRoot,
    REQUIRED_PERMISSION_SCOPE_MODULE
  );

  if (!existsSync(permissionVocabularyPath)) {
    violations.push({
      rule: "permission-vocabulary-module-missing",
      file: permissionVocabularyPath,
      message: `${REQUIRED_PERMISSION_VOCABULARY_MODULE} must exist — grant vocabulary is split from resolved scope (Slice 8)`,
    });
  }

  if (existsSync(permissionScopePath)) {
    const permissionScopeSource = readFileSync(permissionScopePath, "utf8");
    const inlineVocabularyPatterns = [
      /export\s+const\s+PERMISSION_GRANT_SCOPE_TYPES\b/,
      /export\s+interface\s+PermissionGrantElevationFlags\b/,
      /export\s+type\s+PermissionGrantScopeType\b/,
      /export\s+const\s+DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS\b/,
      /export\s+function\s+isPermissionGrantScopeType\b/,
    ] as const;

    for (const pattern of inlineVocabularyPatterns) {
      if (pattern.test(permissionScopeSource)) {
        violations.push({
          rule: "permission-vocabulary-inline",
          file: permissionScopePath,
          message: `Grant vocabulary definitions must live in ${REQUIRED_PERMISSION_VOCABULARY_MODULE}, not permission-scope-context.contract.ts`,
        });
        break;
      }
    }
  }

  for (const symbol of FORBIDDEN_KERNEL_ROOT_EXPORTS) {
    if (rootIndexSource.includes(symbol)) {
      violations.push({
        rule: "prohibited-kernel-root-export",
        file: kernelRootIndexSource,
        message: `${symbol} must not be exported from @afenda/kernel — use appshell or ERP owner`,
      });
    }
  }

  for (const file of listSourceFiles(join(kernelRoot, "src"))) {
    const source = readFileSync(file, "utf8");
    if (/from\s+["']@afenda\/kernel["']/.test(source)) {
      violations.push({
        rule: "kernel-self-import",
        file,
        message:
          "Kernel source must import from itself using relative paths — not @afenda/kernel",
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

/** Build @afenda/kernel when dist is missing or older than src (test/direct callers). */
export function ensureKernelDistFresh(): void {
  const isDistStale = (): boolean => {
    if (!(existsSync(distContextIndex) && existsSync(distRootIndex))) {
      return true;
    }

    return !(
      isNewerOrEqual(contextIndexSource, distContextIndex) &&
      isNewerOrEqual(kernelRootIndexSource, distRootIndex)
    );
  };

  if (!isDistStale()) {
    return;
  }

  const runKernelBuild = (force: boolean): void => {
    const args = ["--filter", "@afenda/kernel", "exec", "tsc", "-b"];
    if (force) {
      args.push("--force");
    }

    const result = spawnSync("pnpm", args, {
      cwd: repoRoot,
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    if (result.status !== 0) {
      throw new Error(
        `pnpm ${args.join(" ")} failed — cannot verify kernel context surface`
      );
    }
  };

  runKernelBuild(false);

  if (isDistStale()) {
    runKernelBuild(true);
  }

  if (isDistStale()) {
    throw new Error(
      "Kernel dist remains stale after build — run pnpm --filter @afenda/kernel clean && pnpm --filter @afenda/kernel build"
    );
  }
}

function main(): void {
  ensureKernelDistFresh();
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
