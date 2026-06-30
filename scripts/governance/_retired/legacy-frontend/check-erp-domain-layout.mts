#!/usr/bin/env tsx
/**
 * PAS-001B — ERP domain layout catalog gate.
 *
 * Failure matrix (must fail when any condition holds):
 * 1. ERP_DOMAIN_MODULES contains duplicate slugs
 * 2. ERP_DOMAIN_MODULE_MATURITY misses any slug
 * 3. Any maturity value outside delivered | catalog-only | blocked
 * 4. Any catalog-only module has a folder under erp-domain/
 * 5. Any catalog-only module has a package.json subpath export
 * 6. Any delivered module lacks folder, index.ts, registry, policy, test, or gate
 * 7. accounting is not delivered
 * 8. accounting subpath export is missing
 * 9. Any module lacks LoB metadata
 * 10. PAS catalog count / slug bijection disagrees with layout contract tables
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ERP_DOMAIN_EXTERNAL_RUNTIME_REFERENCES,
  ERP_DOMAIN_MODULE_INDEX_PATHS,
  ERP_DOMAIN_MODULE_MATURITY,
  ERP_DOMAIN_MODULE_MATURITY_VALUES,
  ERP_DOMAIN_MODULE_METADATA,
  ERP_DOMAIN_MODULE_SCOPE_DEFINITIONS,
  ERP_DOMAIN_MODULES,
  ERP_DOMAIN_PAS_CATALOG_EXPECTED_COUNT,
  type ErpDomainModule,
  type ErpDomainModuleMaturity,
} from "../../packages/kernel/src/erp-domain/erp-domain-layout.contract.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const erpDomainRoot = join(repoRoot, "packages/kernel/src/erp-domain");
const kernelPackageJsonPath = join(repoRoot, "packages/kernel/package.json");
const governanceRoot = join(repoRoot, "scripts/governance");

const ALLOWED_MATURITY = new Set<string>(ERP_DOMAIN_MODULE_MATURITY_VALUES);

export const ERP_DOMAIN_LAYOUT_GATE_FAILURE_MATRIX = [
  "ERP_DOMAIN_MODULES contains duplicate slugs",
  "ERP_DOMAIN_MODULE_MATURITY misses any slug or has extra keys",
  "Any maturity value outside delivered | catalog-only | blocked",
  "Any catalog-only module has a folder under packages/kernel/src/erp-domain/",
  "Any catalog-only module has a package.json subpath export",
  "Any delivered module lacks folder, index.ts, registry, policy, test, or gate script",
  "accounting is not delivered",
  "accounting subpath export is missing",
  "Any module lacks LoB metadata",
  "PAS catalog count or slug bijection disagrees with erp-domain-layout.contract.ts",
] as const;

export interface ErpDomainLayoutViolation {
  readonly message: string;
  readonly rule: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAllowedMaturity(value: string): value is ErpDomainModuleMaturity {
  return ALLOWED_MATURITY.has(value);
}

function readKernelErpDomainExports(): Set<string> {
  const raw = JSON.parse(
    readFileSync(kernelPackageJsonPath, "utf8")
  ) as unknown;
  if (!(isRecord(raw) && isRecord(raw.exports))) {
    return new Set();
  }

  const slugs = new Set<string>();
  for (const exportKey of Object.keys(raw.exports)) {
    const match = /^\.\/erp-domain\/([a-z0-9-]+)$/.exec(exportKey);
    if (match?.[1]) {
      slugs.add(match[1]);
    }
  }

  return slugs;
}

function listErpDomainChildDirectories(): string[] {
  if (!existsSync(erpDomainRoot)) {
    return [];
  }

  return readdirSync(erpDomainRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function gateScriptPathFromCommand(gateCommand: string): string | null {
  const match = /^pnpm check:([a-z0-9-]+)$/.exec(gateCommand.trim());
  if (!match?.[1]) {
    return null;
  }
  return join(governanceRoot, `check-${match[1]}.mts`);
}

function checkDuplicateSlugs(violations: ErpDomainLayoutViolation[]): void {
  const seen = new Set<string>();
  for (const slug of ERP_DOMAIN_MODULES) {
    if (seen.has(slug)) {
      violations.push({
        rule: "duplicate-slug",
        message: `ERP_DOMAIN_MODULES contains duplicate slug "${slug}".`,
      });
    }
    seen.add(slug);
  }
}

function checkMaturityBijection(violations: ErpDomainLayoutViolation[]): void {
  const maturityKeys = Object.keys(ERP_DOMAIN_MODULE_MATURITY);
  const moduleSet = new Set<string>(ERP_DOMAIN_MODULES);

  for (const slug of ERP_DOMAIN_MODULES) {
    if (!(slug in ERP_DOMAIN_MODULE_MATURITY)) {
      violations.push({
        rule: "maturity-missing-slug",
        message: `ERP_DOMAIN_MODULE_MATURITY missing slug "${slug}".`,
      });
    }
  }

  for (const key of maturityKeys) {
    if (!moduleSet.has(key)) {
      violations.push({
        rule: "maturity-extra-slug",
        message: `ERP_DOMAIN_MODULE_MATURITY has extra key "${key}" not in ERP_DOMAIN_MODULES.`,
      });
    }
  }

  for (const slug of ERP_DOMAIN_MODULES) {
    const maturity = ERP_DOMAIN_MODULE_MATURITY[slug as ErpDomainModule];
    if (!isAllowedMaturity(maturity)) {
      violations.push({
        rule: "maturity-invalid-value",
        message: `Module "${slug}" maturity "${String(maturity)}" is outside delivered | catalog-only | blocked.`,
      });
    }
  }
}

function checkCatalogBijection(violations: ErpDomainLayoutViolation[]): void {
  if (ERP_DOMAIN_MODULES.length !== ERP_DOMAIN_PAS_CATALOG_EXPECTED_COUNT) {
    violations.push({
      rule: "pas-catalog-count-mismatch",
      message: `ERP_DOMAIN_MODULES length ${ERP_DOMAIN_MODULES.length} !== PAS-001B §3 expected count ${ERP_DOMAIN_PAS_CATALOG_EXPECTED_COUNT}.`,
    });
  }

  const metadataKeys = Object.keys(ERP_DOMAIN_MODULE_METADATA);
  const moduleSet = new Set<string>(ERP_DOMAIN_MODULES);

  if (metadataKeys.length !== ERP_DOMAIN_MODULES.length) {
    violations.push({
      rule: "pas-catalog-metadata-count",
      message: `ERP_DOMAIN_MODULE_METADATA key count ${metadataKeys.length} !== ERP_DOMAIN_MODULES length ${ERP_DOMAIN_MODULES.length}.`,
    });
  }

  for (const key of metadataKeys) {
    if (!moduleSet.has(key)) {
      violations.push({
        rule: "pas-catalog-metadata-extra",
        message: `ERP_DOMAIN_MODULE_METADATA has extra key "${key}" not in ERP_DOMAIN_MODULES.`,
      });
    }
  }

  for (const slug of Object.keys(ERP_DOMAIN_MODULE_SCOPE_DEFINITIONS)) {
    if (!moduleSet.has(slug)) {
      violations.push({
        rule: "pas-catalog-scope-extra",
        message: `ERP_DOMAIN_MODULE_SCOPE_DEFINITIONS has slug "${slug}" not in ERP_DOMAIN_MODULES.`,
      });
    }
  }
}

function checkLoBMetadata(violations: ErpDomainLayoutViolation[]): void {
  for (const slug of ERP_DOMAIN_MODULES) {
    const metadata = ERP_DOMAIN_MODULE_METADATA[slug];
    if (!metadata?.lobPillar) {
      violations.push({
        rule: "missing-lob-metadata",
        message: `Module "${slug}" lacks LoB metadata (lobPillar).`,
      });
    }
  }
}

function checkExternalRuntimeReferences(
  violations: ErpDomainLayoutViolation[]
): void {
  for (const [slug, registryId] of Object.entries(
    ERP_DOMAIN_EXTERNAL_RUNTIME_REFERENCES
  )) {
    const moduleSlug = slug as ErpDomainModule;
    const metadata = ERP_DOMAIN_MODULE_METADATA[moduleSlug];
    if (metadata?.runtimeOwnerPackage !== registryId) {
      violations.push({
        rule: "external-runtime-reference-mismatch",
        message: `Module "${slug}" runtimeOwnerPackage must be external reference "${registryId}" only (catalog-only cross-link).`,
      });
    }
    if (ERP_DOMAIN_MODULE_MATURITY[moduleSlug] === "delivered") {
      violations.push({
        rule: "external-runtime-reference-delivered",
        message: `Module "${slug}" is external-runtime reference only and must not be delivered while catalog-only.`,
      });
    }
  }
}

function checkDeliveredModuleSurfaces(
  violations: ErpDomainLayoutViolation[],
  onDiskDirs: Set<string>,
  packageExports: Set<string>
): void {
  for (const slug of ERP_DOMAIN_MODULES) {
    const maturity = ERP_DOMAIN_MODULE_MATURITY[slug];
    const onDisk = onDiskDirs.has(slug);

    if (maturity === "catalog-only") {
      if (onDisk) {
        violations.push({
          rule: "catalog-only-no-folder",
          message: `Catalog-only module "${slug}" must not have folder packages/kernel/src/erp-domain/${slug}/ (PAS-001B Rule 1).`,
        });
      }
      if (packageExports.has(slug)) {
        violations.push({
          rule: "catalog-only-no-export",
          message: `Catalog-only module "${slug}" must not have package.json export "./erp-domain/${slug}".`,
        });
      }
      continue;
    }

    if (maturity !== "delivered") {
      continue;
    }

    const moduleDir = join(erpDomainRoot, slug);

    if (!onDisk) {
      violations.push({
        rule: "delivered-requires-folder",
        message: `Delivered module "${slug}" missing folder packages/kernel/src/erp-domain/${slug}/.`,
      });
    }

    const indexPath = ERP_DOMAIN_MODULE_INDEX_PATHS[slug as ErpDomainModule];
    if (!(indexPath && existsSync(join(repoRoot, indexPath)))) {
      violations.push({
        rule: "delivered-requires-index",
        message: `Delivered module "${slug}" missing index.ts barrel.`,
      });
    }

    const registryPath = join(
      moduleDir,
      `${slug}-domain-vocabulary.registry.ts`
    );
    if (!existsSync(registryPath)) {
      violations.push({
        rule: "delivered-requires-registry",
        message: `Delivered module "${slug}" missing ${slug}-domain-vocabulary.registry.ts.`,
      });
    }

    const policyPath = join(moduleDir, `${slug}-domain-vocabulary.policy.ts`);
    if (!existsSync(policyPath)) {
      violations.push({
        rule: "delivered-requires-policy",
        message: `Delivered module "${slug}" missing ${slug}-domain-vocabulary.policy.ts.`,
      });
    }

    const registryTestPath = join(
      moduleDir,
      "__tests__",
      `${slug}-domain-vocabulary.contract.test.ts`
    );
    if (!existsSync(registryTestPath)) {
      violations.push({
        rule: "delivered-requires-registry-test",
        message: `Delivered module "${slug}" missing registry test at ${registryTestPath}.`,
      });
    }

    const metadata = ERP_DOMAIN_MODULE_METADATA[slug];
    const gateCommand = metadata?.vocabularyGate;
    if (gateCommand) {
      const gatePath = gateScriptPathFromCommand(gateCommand);
      if (!(gatePath && existsSync(gatePath))) {
        violations.push({
          rule: "delivered-requires-gate-script",
          message: `Delivered module "${slug}" vocabularyGate "${gateCommand}" missing script at scripts/governance/.`,
        });
      }
    } else {
      violations.push({
        rule: "delivered-requires-gate",
        message: `Delivered module "${slug}" missing vocabularyGate in module metadata.`,
      });
    }

    if (!packageExports.has(slug)) {
      violations.push({
        rule: "delivered-requires-package-export",
        message: `Delivered module "${slug}" missing package.json export "./erp-domain/${slug}".`,
      });
    }
  }
}

function checkAccountingDelivered(
  violations: ErpDomainLayoutViolation[],
  packageExports: Set<string>
): void {
  if (ERP_DOMAIN_MODULE_MATURITY.accounting !== "delivered") {
    violations.push({
      rule: "accounting-not-delivered",
      message: 'Module "accounting" must have maturity "delivered".',
    });
  }

  if (!packageExports.has("accounting")) {
    violations.push({
      rule: "accounting-export-missing",
      message:
        'Delivered module "accounting" missing package.json export "./erp-domain/accounting".',
    });
  }
}

function checkExportSurface(
  violations: ErpDomainLayoutViolation[],
  packageExports: Set<string>
): void {
  for (const exportSlug of packageExports) {
    const slug = exportSlug as ErpDomainModule;
    if (!ERP_DOMAIN_MODULES.includes(slug)) {
      violations.push({
        rule: "export-unknown-slug",
        message: `package.json exports unknown erp-domain slug "./erp-domain/${exportSlug}".`,
      });
      continue;
    }

    if (ERP_DOMAIN_MODULE_MATURITY[slug] !== "delivered") {
      violations.push({
        rule: "export-non-delivered",
        message: `package.json exports "./erp-domain/${exportSlug}" but maturity is "${ERP_DOMAIN_MODULE_MATURITY[slug]}" (only delivered modules may export).`,
      });
    }
  }
}

export function checkErpDomainLayout(): ErpDomainLayoutViolation[] {
  const violations: ErpDomainLayoutViolation[] = [];
  const onDiskDirs = new Set(listErpDomainChildDirectories());
  const packageExports = readKernelErpDomainExports();

  checkDuplicateSlugs(violations);
  checkMaturityBijection(violations);
  checkCatalogBijection(violations);
  checkLoBMetadata(violations);
  checkExternalRuntimeReferences(violations);
  checkDeliveredModuleSurfaces(violations, onDiskDirs, packageExports);
  checkAccountingDelivered(violations, packageExports);
  checkExportSurface(violations, packageExports);

  const allowedRootFiles = new Set(["erp-domain-layout.contract.ts"]);
  if (existsSync(erpDomainRoot)) {
    for (const entry of readdirSync(erpDomainRoot, { withFileTypes: true })) {
      if (entry.isFile() && !allowedRootFiles.has(entry.name)) {
        violations.push({
          rule: "erp-domain-root-file",
          message: `Unexpected file at erp-domain root: ${entry.name}`,
        });
      }
    }
  }

  return violations;
}

const violations = checkErpDomainLayout();

if (violations.length > 0) {
  for (const violation of violations) {
    process.stderr.write(`[${violation.rule}] ${violation.message}\n`);
  }
  process.exit(1);
}

process.stdout.write(
  `ERP domain layout gate passed (PAS-001B — ${ERP_DOMAIN_MODULES.length} catalog slugs, ${Object.values(ERP_DOMAIN_MODULE_MATURITY).filter((m) => m === "delivered").length} delivered; failure matrix ${ERP_DOMAIN_LAYOUT_GATE_FAILURE_MATRIX.length}/10 enforced).\n`
);
