#!/usr/bin/env tsx
/**
 * Inventory domain contracts-only gate (PKGR02 / ADR-0020).
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  INVENTORY_CONTRACTS_ROOT,
  INVENTORY_DOMAIN_CONTRACTS_GATE,
  INVENTORY_DOMAIN_CONTRACTS_PACKAGE_SCRIPTS,
  INVENTORY_DOMAIN_CONTRACTS_SURFACE_RULE,
  INVENTORY_ERP_FORBIDDEN_IMPORT_PATTERN,
  INVENTORY_ERP_FORBIDDEN_ROUTE_DIRS,
  INVENTORY_ERP_SCAN_SKIP_DIR_NAMES,
  INVENTORY_ERP_SOURCE_ROOT,
  INVENTORY_FORBIDDEN_RELATIVE_DIRS,
  INVENTORY_FORBIDDEN_SOURCE_PATTERNS,
  INVENTORY_RETIRED_PACKAGE_ROOT,
  INVENTORY_STOCK_SERVICE_FILENAME_PATTERN,
  INVENTORY_STOCK_SOURCE_KEYWORDS,
} from "./inventory-domain-contracts-registry.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

export interface InventoryDomainContractsViolation {
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

  return INVENTORY_ERP_SCAN_SKIP_DIR_NAMES.some((dirName) =>
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
): InventoryDomainContractsViolation[] {
  const violations: InventoryDomainContractsViolation[] = [];

  for (const pattern of INVENTORY_FORBIDDEN_SOURCE_PATTERNS) {
    if (pattern.test(source)) {
      violations.push({
        rule: "forbidden-import",
        file: relativePath,
        message: `Forbidden import pattern ${pattern.source} — contracts-only lifecycle (ADR-0020)`,
      });
    }
  }

  return violations;
}

export function findStockServiceSurfaceViolations(
  source: string,
  fileName: string,
  relativePath: string
): InventoryDomainContractsViolation[] {
  if (!INVENTORY_STOCK_SERVICE_FILENAME_PATTERN.test(fileName)) {
    return [];
  }

  const violations: InventoryDomainContractsViolation[] = [];

  for (const keyword of INVENTORY_STOCK_SOURCE_KEYWORDS) {
    if (source.includes(keyword)) {
      violations.push({
        rule: "stock-service-surface",
        file: relativePath,
        message: `Stock keyword "${keyword}" is prohibited in ${fileName} until inventory runtime ADR`,
      });
    }
  }

  return violations;
}

export function checkErpInventorySurfaceDrift(
  root: string = repoRoot
): InventoryDomainContractsViolation[] {
  const violations: InventoryDomainContractsViolation[] = [];

  for (const relativeDir of INVENTORY_ERP_FORBIDDEN_ROUTE_DIRS) {
    const absoluteDir = join(root, relativeDir);
    if (existsSync(absoluteDir)) {
      violations.push({
        rule: "erp-inventory-route-drift",
        file: absoluteDir,
        message: `${relativeDir} is prohibited until inventory UI ADR`,
      });
    }
  }

  const erpSourceRoot = join(root, INVENTORY_ERP_SOURCE_ROOT);
  for (const sourceFile of collectErpProductionSourceFiles(
    erpSourceRoot,
    root
  )) {
    const relativePath = relative(root, sourceFile).replace(/\\/g, "/");
    const source = readFileSync(sourceFile, "utf8");

    if (INVENTORY_ERP_FORBIDDEN_IMPORT_PATTERN.test(source)) {
      violations.push({
        rule: "erp-inventory-import-drift",
        file: relativePath,
        message:
          "Production @afenda/inventory imports in apps/erp are prohibited (ADR-0020 retirement)",
      });
    }
  }

  return violations;
}

export function checkInventoryDomainContracts(): InventoryDomainContractsViolation[] {
  const violations: InventoryDomainContractsViolation[] = [];
  const contractsRoot = join(repoRoot, INVENTORY_CONTRACTS_ROOT);
  const registryPath = join(
    repoRoot,
    "scripts/governance/inventory-domain-contracts-registry.mts"
  );
  const gatePath = join(repoRoot, INVENTORY_DOMAIN_CONTRACTS_GATE);
  const rootPackageJsonPath = join(repoRoot, "package.json");

  if (!existsSync(contractsRoot)) {
    violations.push({
      rule: "contracts-root-missing",
      file: contractsRoot,
      message: `${INVENTORY_CONTRACTS_ROOT} must exist for PKGR02 kernel vocabulary lifecycle`,
    });
    return violations;
  }

  if (existsSync(registryPath)) {
    const registrySource = readFileSync(registryPath, "utf8");
    if (!registrySource.includes(INVENTORY_DOMAIN_CONTRACTS_SURFACE_RULE)) {
      violations.push({
        rule: "registry-surface-rule-missing",
        file: registryPath,
        message: `Registry must export ${INVENTORY_DOMAIN_CONTRACTS_SURFACE_RULE}`,
      });
    }
  } else {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message: "inventory-domain-contracts-registry.mts is required",
    });
  }

  if (!existsSync(gatePath)) {
    violations.push({
      rule: "gate-missing",
      file: gatePath,
      message: `${INVENTORY_DOMAIN_CONTRACTS_GATE} is required`,
    });
  }

  if (existsSync(rootPackageJsonPath)) {
    const rootPackageJson = readFileSync(rootPackageJsonPath, "utf8");
    for (const scriptName of INVENTORY_DOMAIN_CONTRACTS_PACKAGE_SCRIPTS) {
      if (!rootPackageJson.includes(`"${scriptName}"`)) {
        violations.push({
          rule: "package-script-missing",
          file: rootPackageJsonPath,
          message: `package.json must define ${scriptName}`,
        });
      }
    }
  }

  for (const relativeDir of INVENTORY_FORBIDDEN_RELATIVE_DIRS) {
    const absoluteDir = join(repoRoot, relativeDir);
    if (existsSync(absoluteDir)) {
      violations.push({
        rule: "forbidden-directory",
        file: absoluteDir,
        message:
          relativeDir === INVENTORY_RETIRED_PACKAGE_ROOT
            ? `${relativeDir} is retired — vocabulary lives in ${INVENTORY_CONTRACTS_ROOT} (ADR-0020)`
            : `${relativeDir} is prohibited until inventory runtime ADR`,
      });
    }
  }

  for (const sourceFile of collectSourceFiles(contractsRoot)) {
    const relativePath = relative(repoRoot, sourceFile).replace(/\\/g, "/");
    const source = readFileSync(sourceFile, "utf8");
    const fileName = relativePath.split("/").at(-1) ?? relativePath;

    violations.push(
      ...findForbiddenImportViolations(source, relativePath),
      ...findStockServiceSurfaceViolations(source, fileName, relativePath)
    );
  }

  violations.push(...checkErpInventorySurfaceDrift(repoRoot));

  return violations;
}

export function formatInventoryDomainContractsViolations(
  violations: readonly InventoryDomainContractsViolation[]
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

  return entry.endsWith("check-inventory-domain-contracts.mts");
})();

if (isDirectRun) {
  const violations = checkInventoryDomainContracts();
  if (violations.length > 0) {
    console.error(formatInventoryDomainContractsViolations(violations));
    process.exit(1);
  }

  console.log(
    "Inventory domain contracts-only gate passed (PKGR02 kernel vocabulary / ADR-0020)."
  );
}
