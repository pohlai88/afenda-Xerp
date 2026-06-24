#!/usr/bin/env tsx
/**
 * Accounting domain contracts-only gate (PKG-R01 / ADR-0015).
 *
 * Prohibits Drizzle schemas, posting services, and @afenda/database deps
 * under packages/accounting until TIP-015+ ADR accepts runtime work.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ACCOUNTING_ALLOWED_RUNTIME_DEPENDENCIES,
  ACCOUNTING_DOMAIN_CONTRACTS_GATE,
  ACCOUNTING_DOMAIN_CONTRACTS_PACKAGE_SCRIPTS,
  ACCOUNTING_DOMAIN_CONTRACTS_SURFACE_RULE,
  ACCOUNTING_ERP_FORBIDDEN_IMPORT_PATTERN,
  ACCOUNTING_ERP_FORBIDDEN_ROUTE_DIRS,
  ACCOUNTING_ERP_SCAN_SKIP_DIR_NAMES,
  ACCOUNTING_ERP_SOURCE_ROOT,
  ACCOUNTING_FORBIDDEN_DEPENDENCIES,
  ACCOUNTING_FORBIDDEN_RELATIVE_DIRS,
  ACCOUNTING_FORBIDDEN_SOURCE_PATTERNS,
  ACCOUNTING_PACKAGE_ROOT,
  ACCOUNTING_POSTING_SERVICE_FILENAME_PATTERN,
  ACCOUNTING_POSTING_SOURCE_KEYWORDS,
} from "./accounting-domain-contracts-registry.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

export interface AccountingDomainContractsViolation {
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

function readJsonFile(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8")) as unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function findForbiddenImportViolations(
  source: string,
  relativePath: string
): AccountingDomainContractsViolation[] {
  const violations: AccountingDomainContractsViolation[] = [];

  for (const pattern of ACCOUNTING_FORBIDDEN_SOURCE_PATTERNS) {
    if (pattern.test(source)) {
      violations.push({
        rule: "forbidden-import",
        file: relativePath,
        message: `Forbidden import pattern ${pattern.source} — contracts-only lifecycle (ADR-0015)`,
      });
    }
  }

  return violations;
}

export function findPostingServiceSurfaceViolations(
  source: string,
  fileName: string,
  relativePath: string
): AccountingDomainContractsViolation[] {
  if (!ACCOUNTING_POSTING_SERVICE_FILENAME_PATTERN.test(fileName)) {
    return [];
  }

  const violations: AccountingDomainContractsViolation[] = [];

  for (const keyword of ACCOUNTING_POSTING_SOURCE_KEYWORDS) {
    if (source.includes(keyword)) {
      violations.push({
        rule: "posting-service-surface",
        file: relativePath,
        message: `Posting keyword "${keyword}" is prohibited in ${fileName} until TIP-015+`,
      });
    }
  }

  return violations;
}

function shouldSkipErpScanPath(relativePath: string): boolean {
  const normalized = relativePath.replace(/\\/g, "/");

  if (normalized.includes(".test.") || normalized.includes(".spec.")) {
    return true;
  }

  return ACCOUNTING_ERP_SCAN_SKIP_DIR_NAMES.some((dirName) =>
    normalized.includes(`/${dirName}/`)
  );
}

function collectErpProductionSourceFiles(
  directory: string,
  repoRoot: string,
  files: string[] = []
): string[] {
  if (!existsSync(directory)) {
    return files;
  }

  for (const entry of readdirSync(directory)) {
    const absolutePath = join(directory, entry);
    const stats = statSync(absolutePath);
    const relativePath = relative(repoRoot, absolutePath).replace(/\\/g, "/");

    if (stats.isDirectory()) {
      if (entry === "node_modules" || entry === "dist") {
        continue;
      }

      if (shouldSkipErpScanPath(`${relativePath}/`)) {
        continue;
      }

      collectErpProductionSourceFiles(absolutePath, repoRoot, files);
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

export function checkErpAccountingSurfaceDrift(
  root: string = repoRoot
): AccountingDomainContractsViolation[] {
  const violations: AccountingDomainContractsViolation[] = [];

  for (const relativeDir of ACCOUNTING_ERP_FORBIDDEN_ROUTE_DIRS) {
    const absoluteDir = join(root, relativeDir);
    if (existsSync(absoluteDir)) {
      violations.push({
        rule: "erp-accounting-route-drift",
        file: absoluteDir,
        message: `${relativeDir} is prohibited until TIP-015+ accounting UI ADR`,
      });
    }
  }

  const erpSourceRoot = join(root, ACCOUNTING_ERP_SOURCE_ROOT);
  for (const sourceFile of collectErpProductionSourceFiles(
    erpSourceRoot,
    root
  )) {
    const relativePath = relative(root, sourceFile).replace(/\\/g, "/");
    const source = readFileSync(sourceFile, "utf8");

    if (ACCOUNTING_ERP_FORBIDDEN_IMPORT_PATTERN.test(source)) {
      violations.push({
        rule: "erp-accounting-import-drift",
        file: relativePath,
        message:
          "Production @afenda/accounting imports in apps/erp are prohibited until TIP-015+ UI ADR",
      });
    }
  }

  return violations;
}

export function checkAccountingDomainContracts(): AccountingDomainContractsViolation[] {
  const violations: AccountingDomainContractsViolation[] = [];
  const packageRoot = join(repoRoot, ACCOUNTING_PACKAGE_ROOT);
  const packageJsonPath = join(packageRoot, "package.json");
  const registryPath = join(
    repoRoot,
    "scripts/governance/accounting-domain-contracts-registry.mts"
  );
  const gatePath = join(repoRoot, ACCOUNTING_DOMAIN_CONTRACTS_GATE);
  const rootPackageJsonPath = join(repoRoot, "package.json");

  if (!existsSync(packageRoot)) {
    violations.push({
      rule: "package-missing",
      file: packageRoot,
      message: `${ACCOUNTING_PACKAGE_ROOT} must exist for PKG-R01 contracts-only lifecycle`,
    });
    return violations;
  }

  if (existsSync(registryPath)) {
    const registrySource = readFileSync(registryPath, "utf8");
    if (!registrySource.includes(ACCOUNTING_DOMAIN_CONTRACTS_SURFACE_RULE)) {
      violations.push({
        rule: "registry-surface-rule-missing",
        file: registryPath,
        message: `Registry must export ${ACCOUNTING_DOMAIN_CONTRACTS_SURFACE_RULE}`,
      });
    }
  } else {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message: "accounting-domain-contracts-registry.mts is required",
    });
  }

  if (!existsSync(gatePath)) {
    violations.push({
      rule: "gate-missing",
      file: gatePath,
      message: `${ACCOUNTING_DOMAIN_CONTRACTS_GATE} is required`,
    });
  }

  if (existsSync(rootPackageJsonPath)) {
    const rootPackageJson = readFileSync(rootPackageJsonPath, "utf8");
    for (const scriptName of ACCOUNTING_DOMAIN_CONTRACTS_PACKAGE_SCRIPTS) {
      if (!rootPackageJson.includes(`"${scriptName}"`)) {
        violations.push({
          rule: "package-script-missing",
          file: rootPackageJsonPath,
          message: `package.json must define ${scriptName}`,
        });
      }
    }
  }

  for (const relativeDir of ACCOUNTING_FORBIDDEN_RELATIVE_DIRS) {
    const absoluteDir = join(repoRoot, relativeDir);
    if (existsSync(absoluteDir)) {
      violations.push({
        rule: "forbidden-directory",
        file: absoluteDir,
        message: `${relativeDir} is prohibited until TIP-015+ runtime ADR`,
      });
    }
  }

  if (existsSync(packageJsonPath)) {
    const packageJson = readJsonFile(packageJsonPath);
    if (isRecord(packageJson)) {
      const dependencies = isRecord(packageJson.dependencies)
        ? packageJson.dependencies
        : {};

      for (const forbiddenDependency of ACCOUNTING_FORBIDDEN_DEPENDENCIES) {
        if (forbiddenDependency in dependencies) {
          violations.push({
            rule: "forbidden-dependency",
            file: packageJsonPath,
            message: `${forbiddenDependency} is prohibited in @afenda/accounting dependencies until TIP-015+`,
          });
        }
      }

      for (const dependencyName of Object.keys(dependencies)) {
        if (
          dependencyName.startsWith("@afenda/") &&
          !(
            ACCOUNTING_ALLOWED_RUNTIME_DEPENDENCIES as readonly string[]
          ).includes(dependencyName)
        ) {
          violations.push({
            rule: "unexpected-runtime-dependency",
            file: packageJsonPath,
            message: `${dependencyName} is not an allowed runtime dependency for contracts-only @afenda/accounting`,
          });
        }
      }
    } else {
      violations.push({
        rule: "package-json-invalid",
        file: packageJsonPath,
        message: "packages/accounting/package.json must be a JSON object",
      });
    }
  } else {
    violations.push({
      rule: "package-json-missing",
      file: packageJsonPath,
      message: "packages/accounting/package.json is required",
    });
  }

  const sourceRoot = join(packageRoot, "src");
  for (const sourceFile of collectSourceFiles(sourceRoot)) {
    const relativePath = relative(repoRoot, sourceFile).replace(/\\/g, "/");
    const source = readFileSync(sourceFile, "utf8");
    const fileName = relativePath.split("/").at(-1) ?? relativePath;

    violations.push(
      ...findForbiddenImportViolations(source, relativePath),
      ...findPostingServiceSurfaceViolations(source, fileName, relativePath)
    );
  }

  violations.push(...checkErpAccountingSurfaceDrift(repoRoot));

  return violations;
}

export function formatAccountingDomainContractsViolations(
  violations: readonly AccountingDomainContractsViolation[]
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

function main(): void {
  const violations = checkAccountingDomainContracts();
  if (violations.length > 0) {
    console.error(formatAccountingDomainContractsViolations(violations));
    process.exit(1);
  }

  console.log(
    "Accounting domain contracts-only gate passed (PKG-R01 / ADR-0015)."
  );
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }

  return entry.endsWith("check-accounting-domain-contracts.mts");
})();

if (isDirectRun) {
  main();
}
