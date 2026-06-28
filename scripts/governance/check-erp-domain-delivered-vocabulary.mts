#!/usr/bin/env tsx
/**
 * Unified PAS-001B gate — validates all delivered ERP domain vocabulary modules.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ERP_DOMAIN_DELIVERED_MODULES,
  ERP_DOMAIN_MODULE_MATURITY,
  ERP_DOMAIN_MODULES,
  type ErpDomainModule,
} from "../../packages/kernel/src/erp-domain/erp-domain-layout.contract.ts";
import {
  ERP_DOMAIN_CONTRACTS_ROOT,
  ERP_DOMAIN_DELIVERED_VOCABULARY_GATE,
  ERP_DOMAIN_DELIVERED_VOCABULARY_GATE_COMMAND,
  ERP_DOMAIN_DELIVERED_VOCABULARY_PACKAGE_SCRIPT,
  ERP_DOMAIN_DELIVERED_VOCABULARY_SURFACE_RULE,
  ERP_DOMAIN_ERP_SCAN_SKIP_DIR_NAMES,
  ERP_DOMAIN_ERP_SOURCE_ROOT,
  ERP_DOMAIN_FORBIDDEN_RELATIVE_DIR_SUFFIXES,
  ERP_DOMAIN_FORBIDDEN_SOURCE_PATTERNS,
  ERP_DOMAIN_MODULE_RETIRED_PACKAGE_ROOTS,
  ERP_DOMAIN_RUNTIME_SERVICE_FILENAME_PATTERN,
  ERP_DOMAIN_RUNTIME_SOURCE_KEYWORDS,
} from "./erp-domain-delivered-vocabulary-registry.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

export interface ErpDomainDeliveredVocabularyViolation {
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

export function findForbiddenImportViolations(
  source: string,
  relativePath: string
): ErpDomainDeliveredVocabularyViolation[] {
  const violations: ErpDomainDeliveredVocabularyViolation[] = [];

  for (const pattern of ERP_DOMAIN_FORBIDDEN_SOURCE_PATTERNS) {
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

export function findRuntimeServiceSurfaceViolations(
  source: string,
  fileName: string,
  relativePath: string
): ErpDomainDeliveredVocabularyViolation[] {
  if (!ERP_DOMAIN_RUNTIME_SERVICE_FILENAME_PATTERN.test(fileName)) {
    return [];
  }

  const violations: ErpDomainDeliveredVocabularyViolation[] = [];

  for (const keyword of ERP_DOMAIN_RUNTIME_SOURCE_KEYWORDS) {
    if (source.includes(keyword)) {
      violations.push({
        rule: "runtime-service-surface",
        file: relativePath,
        message: `Runtime keyword "${keyword}" is prohibited in ${fileName} until domain runtime ADR`,
      });
    }
  }

  return violations;
}

function forbiddenDirsForModule(slug: ErpDomainModule): readonly string[] {
  const moduleRoot = `${ERP_DOMAIN_CONTRACTS_ROOT}/${slug}`;
  const dirs = ERP_DOMAIN_FORBIDDEN_RELATIVE_DIR_SUFFIXES.map(
    (suffix) => `${moduleRoot}/${suffix}`
  );

  const retired =
    ERP_DOMAIN_MODULE_RETIRED_PACKAGE_ROOTS[
      slug as keyof typeof ERP_DOMAIN_MODULE_RETIRED_PACKAGE_ROOTS
    ];
  if (retired) {
    return [...dirs, retired];
  }

  return [...dirs, `packages/${slug}`];
}

export function checkDeliveredModuleContracts(
  slug: ErpDomainModule,
  root: string = repoRoot
): ErpDomainDeliveredVocabularyViolation[] {
  const violations: ErpDomainDeliveredVocabularyViolation[] = [];
  const contractsRoot = join(root, ERP_DOMAIN_CONTRACTS_ROOT, slug);

  if (!existsSync(contractsRoot)) {
    violations.push({
      rule: "contracts-root-missing",
      file: contractsRoot,
      message: `${ERP_DOMAIN_CONTRACTS_ROOT}/${slug} must exist for delivered maturity`,
    });
    return violations;
  }

  for (const relativeDir of forbiddenDirsForModule(slug)) {
    const absoluteDir = join(root, relativeDir);
    if (existsSync(absoluteDir)) {
      violations.push({
        rule: "forbidden-directory",
        file: absoluteDir,
        message: `${relativeDir} is prohibited for contracts-only vocabulary lifecycle`,
      });
    }
  }

  for (const sourceFile of collectSourceFiles(contractsRoot)) {
    const relativePath = relative(root, sourceFile).replace(/\\/g, "/");
    const source = readFileSync(sourceFile, "utf8");
    const fileName = relativePath.split("/").at(-1) ?? relativePath;

    violations.push(
      ...findForbiddenImportViolations(source, relativePath),
      ...findRuntimeServiceSurfaceViolations(source, fileName, relativePath)
    );
  }

  return violations;
}

export function checkErpDomainDeliveredVocabulary(
  root: string = repoRoot
): ErpDomainDeliveredVocabularyViolation[] {
  const violations: ErpDomainDeliveredVocabularyViolation[] = [];
  const gatePath = join(root, ERP_DOMAIN_DELIVERED_VOCABULARY_GATE);
  const rootPackageJsonPath = join(root, "package.json");

  if (!existsSync(gatePath)) {
    violations.push({
      rule: "gate-missing",
      file: gatePath,
      message: `${ERP_DOMAIN_DELIVERED_VOCABULARY_GATE} is required`,
    });
  }

  if (existsSync(rootPackageJsonPath)) {
    const rootPackageJson = readFileSync(rootPackageJsonPath, "utf8");
    if (!rootPackageJson.includes(`"${ERP_DOMAIN_DELIVERED_VOCABULARY_PACKAGE_SCRIPT}"`)) {
      violations.push({
        rule: "package-script-missing",
        file: rootPackageJsonPath,
        message: `package.json must define ${ERP_DOMAIN_DELIVERED_VOCABULARY_PACKAGE_SCRIPT}`,
      });
    }
  }

  const deliveredCount = ERP_DOMAIN_DELIVERED_MODULES.length;
  const maturityDelivered = ERP_DOMAIN_MODULES.filter(
    (slug) => ERP_DOMAIN_MODULE_MATURITY[slug] === "delivered"
  ).length;

  if (deliveredCount !== maturityDelivered) {
    violations.push({
      rule: "delivered-count-drift",
      file: join(root, ERP_DOMAIN_CONTRACTS_ROOT, "erp-domain-layout.contract.ts"),
      message: `ERP_DOMAIN_DELIVERED_MODULES (${deliveredCount}) != maturity delivered count (${maturityDelivered})`,
    });
  }

  for (const slug of ERP_DOMAIN_DELIVERED_MODULES) {
    violations.push(...checkDeliveredModuleContracts(slug, root));
  }

  return violations;
}

export function formatErpDomainDeliveredVocabularyViolations(
  violations: readonly ErpDomainDeliveredVocabularyViolation[]
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

  return entry.endsWith("check-erp-domain-delivered-vocabulary.mts");
})();

if (isDirectRun) {
  const violations = checkErpDomainDeliveredVocabulary();
  if (violations.length > 0) {
    console.error(formatErpDomainDeliveredVocabularyViolations(violations));
    process.exit(1);
  }

  console.log(
    `ERP domain delivered vocabulary gate passed (PAS-001B — ${ERP_DOMAIN_DELIVERED_MODULES.length} delivered modules; ${ERP_DOMAIN_DELIVERED_VOCABULARY_GATE_COMMAND}).`
  );
}
