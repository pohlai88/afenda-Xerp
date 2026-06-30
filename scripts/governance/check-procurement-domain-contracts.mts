#!/usr/bin/env tsx
/**
 * Procurement domain contracts-only gate (PAS-001B B80).
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  PROCUREMENT_CONTRACTS_ROOT,
  PROCUREMENT_DOMAIN_CONTRACTS_GATE,
  PROCUREMENT_DOMAIN_CONTRACTS_PACKAGE_SCRIPTS,
  PROCUREMENT_DOMAIN_CONTRACTS_SURFACE_RULE,
  PROCUREMENT_ERP_AUTHORIZED_FOUNDATION_ROUTE_FILES,
  PROCUREMENT_ERP_FORBIDDEN_IMPORT_PATTERN,
  PROCUREMENT_ERP_FORBIDDEN_ROUTE_DIRS,
  PROCUREMENT_ERP_SCAN_SKIP_DIR_NAMES,
  PROCUREMENT_ERP_SOURCE_ROOT,
  PROCUREMENT_FORBIDDEN_RELATIVE_DIRS,
  PROCUREMENT_FORBIDDEN_SOURCE_PATTERNS,
  PROCUREMENT_POSTING_SERVICE_FILENAME_PATTERN,
  PROCUREMENT_POSTING_SOURCE_KEYWORDS,
} from "./procurement-domain-contracts-registry.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const PROCUREMENT_PACKAGE_ROOT = "packages/procurement" as const;

export interface ProcurementDomainContractsViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function collectSourceFiles(directory: string, files: string[] = []): string[] {
  if (!existsSync(directory)) {
    return files;
  }

  for (const entry of readdirSync(directory)) {
    const absolutePath = join(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      if (entry === "node_modules" || entry === "dist") {
        continue;
      }

      collectSourceFiles(absolutePath, files);
      continue;
    }

    if (entry.endsWith(".ts") || entry.endsWith(".tsx")) {
      files.push(absolutePath);
    }
  }

  return files;
}

function shouldSkipErpScanPath(relativePath: string): boolean {
  const normalized = relativePath.replace(/\\/g, "/");

  if (normalized.includes(".test.") || normalized.includes(".spec.")) {
    return true;
  }

  return PROCUREMENT_ERP_SCAN_SKIP_DIR_NAMES.some((dirName) =>
    normalized.includes(`/${dirName}/`)
  );
}

function collectErpProductionSourceFiles(
  directory: string,
  root: string,
  files: string[] = []
): string[] {
  if (!existsSync(directory)) {
    return files;
  }

  for (const entry of readdirSync(directory)) {
    const absolutePath = join(directory, entry);
    const stats = statSync(absolutePath);
    const relativePath = relative(root, absolutePath).replace(/\\/g, "/");

    if (stats.isDirectory()) {
      if (entry === "node_modules" || entry === "dist") {
        continue;
      }

      if (shouldSkipErpScanPath(`${relativePath}/`)) {
        continue;
      }

      collectErpProductionSourceFiles(absolutePath, root, files);
      continue;
    }

    if (
      (entry.endsWith(".ts") || entry.endsWith(".tsx")) &&
      !shouldSkipErpScanPath(relativePath)
    ) {
      files.push(absolutePath);
    }
  }

  return files;
}

export function findForbiddenImportViolations(
  source: string,
  relativePath: string
): ProcurementDomainContractsViolation[] {
  const violations: ProcurementDomainContractsViolation[] = [];

  for (const pattern of PROCUREMENT_FORBIDDEN_SOURCE_PATTERNS) {
    if (pattern.test(source)) {
      violations.push({
        rule: "forbidden-import",
        file: relativePath,
        message: `Forbidden import pattern ${pattern.source} — contracts-only lifecycle (PAS-001B)`,
      });
    }
  }

  return violations;
}

export function findPostingServiceSurfaceViolations(
  source: string,
  fileName: string,
  relativePath: string
): ProcurementDomainContractsViolation[] {
  if (!PROCUREMENT_POSTING_SERVICE_FILENAME_PATTERN.test(fileName)) {
    return [];
  }

  const violations: ProcurementDomainContractsViolation[] = [];

  for (const keyword of PROCUREMENT_POSTING_SOURCE_KEYWORDS) {
    if (source.includes(keyword)) {
      violations.push({
        rule: "posting-service-surface",
        file: relativePath,
        message: `Procurement keyword "${keyword}" is prohibited in ${fileName} until procurement runtime ADR`,
      });
    }
  }

  return violations;
}

export function checkErpProcurementSurfaceDrift(
  root: string = repoRoot
): ProcurementDomainContractsViolation[] {
  const violations: ProcurementDomainContractsViolation[] = [];
  const authorizedRouteFiles = new Set(
    PROCUREMENT_ERP_AUTHORIZED_FOUNDATION_ROUTE_FILES.map((relativePath) =>
      join(root, relativePath).replace(/\\/g, "/")
    )
  );

  for (const relativeDir of PROCUREMENT_ERP_FORBIDDEN_ROUTE_DIRS) {
    const absoluteDir = join(root, relativeDir);
    if (!existsSync(absoluteDir)) {
      continue;
    }

    for (const sourceFile of collectSourceFiles(absoluteDir)) {
      const normalized = sourceFile.replace(/\\/g, "/");
      if (
        (sourceFile.endsWith(".tsx") || sourceFile.endsWith(".ts")) &&
        !authorizedRouteFiles.has(normalized) &&
        !normalized.includes("/__tests__/")
      ) {
        violations.push({
          rule: "erp-procurement-route-drift",
          file: relative(root, sourceFile).replace(/\\/g, "/"),
          message: `${relativeDir} allows only ERP-PROC-OP-005/007 authorized foundation and PAS-006 UI scaffold files until business runtime slice`,
        });
      }
    }
  }

  const erpSourceRoot = join(root, PROCUREMENT_ERP_SOURCE_ROOT);
  for (const sourceFile of collectErpProductionSourceFiles(
    erpSourceRoot,
    root
  )) {
    const relativePath = relative(root, sourceFile).replace(/\\/g, "/");
    const source = readFileSync(sourceFile, "utf8");

    if (PROCUREMENT_ERP_FORBIDDEN_IMPORT_PATTERN.test(source)) {
      violations.push({
        rule: "erp-procurement-import-drift",
        file: relativePath,
        message:
          "Production @afenda/procurement imports in apps/erp are prohibited until runtime ADR",
      });
    }
  }

  return violations;
}

export function checkProcurementDomainContracts(): ProcurementDomainContractsViolation[] {
  const violations: ProcurementDomainContractsViolation[] = [];
  const contractsRoot = join(repoRoot, PROCUREMENT_CONTRACTS_ROOT);
  const registryPath = join(
    repoRoot,
    "scripts/governance/procurement-domain-contracts-registry.mts"
  );
  const gatePath = join(repoRoot, PROCUREMENT_DOMAIN_CONTRACTS_GATE);
  const rootPackageJsonPath = join(repoRoot, "package.json");

  if (!existsSync(contractsRoot)) {
    violations.push({
      rule: "contracts-root-missing",
      file: contractsRoot,
      message: `${PROCUREMENT_CONTRACTS_ROOT} must exist for PAS-001B kernel vocabulary lifecycle`,
    });
    return violations;
  }

  if (existsSync(registryPath)) {
    const registrySource = readFileSync(registryPath, "utf8");
    if (!registrySource.includes(PROCUREMENT_DOMAIN_CONTRACTS_SURFACE_RULE)) {
      violations.push({
        rule: "registry-surface-rule-missing",
        file: registryPath,
        message: `Registry must export ${PROCUREMENT_DOMAIN_CONTRACTS_SURFACE_RULE}`,
      });
    }
  } else {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message: "procurement-domain-contracts-registry.mts is required",
    });
  }

  if (!existsSync(gatePath)) {
    violations.push({
      rule: "gate-missing",
      file: gatePath,
      message: `${PROCUREMENT_DOMAIN_CONTRACTS_GATE} is required`,
    });
  }

  if (existsSync(rootPackageJsonPath)) {
    const rootPackageJson = readFileSync(rootPackageJsonPath, "utf8");
    for (const scriptName of PROCUREMENT_DOMAIN_CONTRACTS_PACKAGE_SCRIPTS) {
      if (!rootPackageJson.includes(`"${scriptName}"`)) {
        violations.push({
          rule: "package-script-missing",
          file: rootPackageJsonPath,
          message: `package.json must define ${scriptName}`,
        });
      }
    }
  }

  for (const relativeDir of PROCUREMENT_FORBIDDEN_RELATIVE_DIRS) {
    const absoluteDir = join(repoRoot, relativeDir);
    if (existsSync(absoluteDir)) {
      violations.push({
        rule: "forbidden-directory",
        file: absoluteDir,
        message:
          relativeDir === PROCUREMENT_PACKAGE_ROOT
            ? `${relativeDir} is prohibited — vocabulary lives in ${PROCUREMENT_CONTRACTS_ROOT} (PAS-001B)`
            : `${relativeDir} is prohibited until procurement runtime ADR`,
      });
    }
  }

  for (const sourceFile of collectSourceFiles(contractsRoot)) {
    const relativePath = relative(repoRoot, sourceFile).replace(/\\/g, "/");
    const source = readFileSync(sourceFile, "utf8");
    const fileName = relativePath.split("/").at(-1) ?? relativePath;

    violations.push(
      ...findForbiddenImportViolations(source, relativePath),
      ...findPostingServiceSurfaceViolations(source, fileName, relativePath)
    );
  }

  violations.push(...checkErpProcurementSurfaceDrift(repoRoot));

  return violations;
}

export function formatProcurementDomainContractsViolations(
  violations: readonly ProcurementDomainContractsViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map(
      (violation) =>
        `[${violation.rule}] ${violation.file}\n  ${violation.message}`
    )
    .join("\n\n");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }

  return entry.endsWith("check-procurement-domain-contracts.mts");
})();

if (isDirectRun) {
  const violations = checkProcurementDomainContracts();
  if (violations.length > 0) {
    console.error(formatProcurementDomainContractsViolations(violations));
    process.exit(1);
  }

  console.log(
    "Procurement domain contracts-only gate passed (PAS-001B kernel vocabulary)."
  );
}
