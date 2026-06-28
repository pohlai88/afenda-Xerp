#!/usr/bin/env tsx
/**
 * PAS-001 §4.1 / ADR-0021 — kernel identity surface gate.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  IDENTITY_MODULE_BRAND_FILES,
  IDENTITY_MODULE_GOVERNANCE_FILES,
  IDENTITY_MODULE_POSTGRES_FILES,
  IDENTITY_MODULE_PRIMITIVE_FILES,
} from "../../packages/kernel/src/identity/governance/identity-module-layout.contract.ts";
import {
  ENTERPRISE_ID_FAMILIES,
  FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS,
  ID_FAMILIES,
  PLATFORM_ID_FAMILY_REGISTRY,
} from "../../packages/kernel/src/identity/registry/id-family.registry.ts";
import { collectDirectBrandContractImportViolations } from "./identity/kernel-brand-barrel.governance.mts";
import { collectPrimitiveContractSourceViolations } from "./identity/kernel-primitives.governance.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const identitySources = {
  tenantHierarchy: join(
    repoRoot,
    "packages/kernel/src/identity/families/tenant-hierarchy-id.contract.ts"
  ),
  identityAccess: join(
    repoRoot,
    "packages/kernel/src/identity/families/identity-access-id.contract.ts"
  ),
  auditExecution: join(
    repoRoot,
    "packages/kernel/src/identity/families/audit-execution-id.contract.ts"
  ),
  enterpriseHierarchy: join(
    repoRoot,
    "packages/kernel/src/identity/families/enterprise-hierarchy-id.contract.ts"
  ),
  businessReference: join(
    repoRoot,
    "packages/kernel/src/identity/families/business-reference-id.contract.ts"
  ),
  canonicalParser: join(
    repoRoot,
    "packages/kernel/src/identity/canonical/canonical-id-parser.contract.ts"
  ),
  prefixRegistry: join(
    repoRoot,
    "packages/kernel/src/identity/registry/enterprise-id-prefix.registry.ts"
  ),
  canonicalValidator: join(
    repoRoot,
    "packages/kernel/src/identity/canonical/canonical-id-validator.contract.ts"
  ),
  canonicalGenerator: join(
    repoRoot,
    "packages/kernel/src/identity/canonical/canonical-id-generator.contract.ts"
  ),
  primitives: join(
    repoRoot,
    "packages/kernel/src/identity/primitives/index.ts"
  ),
  primitiveLocale: join(
    repoRoot,
    "packages/kernel/src/identity/primitives/locale-code.contract.ts"
  ),
  primitiveCurrency: join(
    repoRoot,
    "packages/kernel/src/identity/primitives/currency-code.contract.ts"
  ),
  primitiveTimezone: join(
    repoRoot,
    "packages/kernel/src/identity/primitives/timezone-id.contract.ts"
  ),
  primitiveDateFormat: join(
    repoRoot,
    "packages/kernel/src/identity/primitives/date-format.contract.ts"
  ),
  primitiveNumberFormat: join(
    repoRoot,
    "packages/kernel/src/identity/primitives/number-format.contract.ts"
  ),
  primitiveCountryCode: join(
    repoRoot,
    "packages/kernel/src/identity/primitives/country-code.contract.ts"
  ),
  primitiveUomCode: join(
    repoRoot,
    "packages/kernel/src/identity/primitives/uom-code.contract.ts"
  ),
  identityIndex: join(repoRoot, "packages/kernel/src/identity/index.ts"),
  familiesIndex: join(
    repoRoot,
    "packages/kernel/src/identity/families/index.ts"
  ),
  kernelRootIndex: join(repoRoot, "packages/kernel/src/index.ts"),
} as const;

const APPROVED_FAMILY_FILES = new Set([
  "index.ts",
  "define-enterprise-family.ts",
  "tenant-hierarchy-id.contract.ts",
  "identity-access-id.contract.ts",
  "audit-execution-id.contract.ts",
  "enterprise-hierarchy-id.contract.ts",
  "business-reference-id.contract.ts",
]);

const APPROVED_BRAND_FILES = new Set<string>(IDENTITY_MODULE_BRAND_FILES);

const APPROVED_PRIMITIVE_FILES = new Set<string>(
  IDENTITY_MODULE_PRIMITIVE_FILES
);

const APPROVED_POSTGRES_FILES = new Set<string>(IDENTITY_MODULE_POSTGRES_FILES);

const APPROVED_GOVERNANCE_FILES = new Set<string>(
  IDENTITY_MODULE_GOVERNANCE_FILES
);

const APPROVED_IDENTITY_SUBFOLDERS = new Set([
  "brand",
  "canonical",
  "registry",
  "families",
  "primitives",
  "tenant-human-reference",
  "postgres",
  "wire",
  "governance",
  "__tests__",
]);

const enterpriseSourceByFamilyKey: Partial<
  Record<keyof typeof ID_FAMILIES, string>
> = {
  tenant: identitySources.tenantHierarchy,
  entityGroup: identitySources.tenantHierarchy,
  company: identitySources.tenantHierarchy,
  organization: identitySources.tenantHierarchy,
  team: identitySources.tenantHierarchy,
  project: identitySources.tenantHierarchy,
  user: identitySources.identityAccess,
  role: identitySources.identityAccess,
  membership: identitySources.identityAccess,
  permission: identitySources.identityAccess,
  policy: identitySources.identityAccess,
  auditEvent: identitySources.auditExecution,
  execution: identitySources.auditExecution,
  correlation: identitySources.auditExecution,
  ownershipInterest: identitySources.enterpriseHierarchy,
  customer: identitySources.businessReference,
  supplier: identitySources.businessReference,
  product: identitySources.businessReference,
  employee: identitySources.businessReference,
  warehouse: identitySources.businessReference,
  document: identitySources.businessReference,
  asset: identitySources.businessReference,
};

const primitiveSourceByFamilyKey: Partial<
  Record<keyof typeof ID_FAMILIES, string>
> = {
  localeCode: identitySources.primitiveLocale,
  timezoneId: identitySources.primitiveTimezone,
  dateFormat: identitySources.primitiveDateFormat,
  numberFormat: identitySources.primitiveNumberFormat,
  currencyCode: identitySources.primitiveCurrency,
  countryCode: identitySources.primitiveCountryCode,
  uomCode: identitySources.primitiveUomCode,
};

export interface IdentitySurfaceViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

const tenantHierarchySource = readFileSync(
  identitySources.tenantHierarchy,
  "utf8"
);
const identityAccessSource = readFileSync(
  identitySources.identityAccess,
  "utf8"
);
const auditExecutionSource = readFileSync(
  identitySources.auditExecution,
  "utf8"
);
const enterpriseHierarchySource = readFileSync(
  identitySources.enterpriseHierarchy,
  "utf8"
);
const businessReferenceSource = readFileSync(
  identitySources.businessReference,
  "utf8"
);
const canonicalParserSource = readFileSync(
  identitySources.canonicalParser,
  "utf8"
);
const canonicalGeneratorSource = readFileSync(
  identitySources.canonicalGenerator,
  "utf8"
);
const identityIndex = readFileSync(identitySources.identityIndex, "utf8");
const kernelRootIndex = readFileSync(identitySources.kernelRootIndex, "utf8");

const combinedEnterpriseSource = [
  tenantHierarchySource,
  identityAccessSource,
  auditExecutionSource,
  enterpriseHierarchySource,
  businessReferenceSource,
].join("\n");

const retiredPlatformIdPaths = [
  "packages/kernel/src/contracts/platform-id.contract.ts",
  "packages/kernel/src/contracts/platform-id-registry.contract.ts",
  "packages/kernel/src/contracts/platform-id-boundary.contract.ts",
] as const;

export function checkKernelIdentitySurface(): IdentitySurfaceViolation[] {
  const violations: IdentitySurfaceViolation[] = [];

  function hasBarrelExport(source: string, symbol: string): boolean {
    return (
      source.includes(`export function ${symbol}`) ||
      source.includes(`export const ${symbol}`) ||
      source.includes(`export { ${symbol}`) ||
      (source.includes(`${symbol},`) && source.includes("export {"))
    );
  }

  for (const relativePath of retiredPlatformIdPaths) {
    const absolutePath = join(repoRoot, relativePath);
    if (existsSync(absolutePath)) {
      violations.push({
        rule: "retired-platform-id-contract",
        file: absolutePath,
        message: `${relativePath} is retired — identity authority lives in packages/kernel/src/identity/`,
      });
    }
  }

  const hasExportedCallable = (source: string, functionName: string): boolean =>
    source.includes(`export function ${functionName}`) ||
    source.includes(`export const ${functionName} =`) ||
    source.includes(`export { ${functionName}`) ||
    (source.includes(`${functionName},`) && source.includes("export {"));

  if (PLATFORM_ID_FAMILY_REGISTRY.length !== 29) {
    violations.push({
      rule: "registry-count",
      file: identitySources.familiesIndex,
      message: `Expected 29 PAS §4.1 families, registry has ${PLATFORM_ID_FAMILY_REGISTRY.length}`,
    });
  }

  const enterprisePrefixes = ENTERPRISE_ID_FAMILIES.map(
    (family) => ID_FAMILIES[family].prefix
  );
  if (new Set(enterprisePrefixes).size !== enterprisePrefixes.length) {
    violations.push({
      rule: "duplicate-prefix",
      file: identitySources.familiesIndex,
      message: "Enterprise ID prefixes must be unique across ID_FAMILIES",
    });
  }

  for (const forbidden of FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS) {
    if (combinedEnterpriseSource.includes(`export type ${forbidden}`)) {
      violations.push({
        rule: "forbidden-platform-floor-id",
        file: identitySources.familiesIndex,
        message: `${forbidden} must not be exported from kernel identity family contracts`,
      });
    }

    if (kernelRootIndex.includes(`type ${forbidden}`)) {
      violations.push({
        rule: "forbidden-root-export",
        file: identitySources.kernelRootIndex,
        message: `${forbidden} must not be exported from @afenda/kernel root barrel`,
      });
    }
  }

  for (const familyKey of Object.keys(
    ID_FAMILIES
  ) as (keyof typeof ID_FAMILIES)[]) {
    const family = ID_FAMILIES[familyKey];
    const sourcePath = family.prefix
      ? (enterpriseSourceByFamilyKey[familyKey] ??
        identitySources.businessReference)
      : (primitiveSourceByFamilyKey[familyKey] ?? identitySources.primitives);
    const sourceContent = readFileSync(sourcePath, "utf8");

    if (family.prefix && !family.prefix.match(/^[a-z]{3}$/)) {
      violations.push({
        rule: "invalid-prefix",
        file: sourcePath,
        message: `${family.typeName} prefix must be 3 lowercase letters`,
      });
    }

    if (!hasExportedCallable(sourceContent, family.parseFunction)) {
      violations.push({
        rule: "missing-parse",
        file: sourcePath,
        message: `Missing export function ${family.parseFunction} for ${family.typeName}`,
      });
    }

    if (
      family.generates &&
      family.createFunction &&
      !hasExportedCallable(combinedEnterpriseSource, family.createFunction)
    ) {
      violations.push({
        rule: "missing-create",
        file: identitySources.canonicalGenerator,
        message: `Missing export function ${family.createFunction} for ${family.typeName}`,
      });
    }

    if (!sourceContent.includes(`export type ${family.typeName}`)) {
      violations.push({
        rule: "missing-type",
        file: sourcePath,
        message: `Missing export type ${family.typeName}`,
      });
    }

    if (
      family.parseOptionalFunction &&
      !hasExportedCallable(sourceContent, family.parseOptionalFunction)
    ) {
      violations.push({
        rule: "missing-parse-optional",
        file: sourcePath,
        message: `Missing export function ${family.parseOptionalFunction} for ${family.typeName}`,
      });
    }

    if (!hasExportedCallable(sourceContent, family.toFunction)) {
      violations.push({
        rule: "registry-helper-missing",
        file: sourcePath,
        message: `Missing export function ${family.toFunction} for ${family.typeName}`,
      });
    }

    if (!hasExportedCallable(identityIndex, family.normalizeForWireFunction)) {
      violations.push({
        rule: "missing-wire-normalizer",
        file: identitySources.identityIndex,
        message: `Missing export function ${family.normalizeForWireFunction} for ${family.typeName}`,
      });
    }
  }

  if (ENTERPRISE_ID_FAMILIES.length !== 22) {
    violations.push({
      rule: "enterprise-family-count",
      file: identitySources.familiesIndex,
      message: `Expected 22 enterprise ID families, found ${ENTERPRISE_ID_FAMILIES.length}`,
    });
  }

  if (!hasExportedCallable(canonicalParserSource, "parseCanonicalId")) {
    violations.push({
      rule: "missing-parse-canonical",
      file: identitySources.canonicalParser,
      message: "Missing parseCanonicalId export",
    });
  }

  if (!hasExportedCallable(canonicalGeneratorSource, "createCanonicalId")) {
    violations.push({
      rule: "missing-create-canonical",
      file: identitySources.canonicalGenerator,
      message: "Missing createCanonicalId export",
    });
  }

  const canonicalValidatorPath = identitySources.canonicalValidator;
  let canonicalValidatorSource = "";
  if (existsSync(canonicalValidatorPath)) {
    canonicalValidatorSource = readFileSync(canonicalValidatorPath, "utf8");
    if (
      !hasExportedCallable(canonicalValidatorSource, "isCanonicalEnterpriseId")
    ) {
      violations.push({
        rule: "missing-validator",
        file: canonicalValidatorPath,
        message: "Missing isCanonicalEnterpriseId export",
      });
    }
  } else {
    violations.push({
      rule: "missing-validator-module",
      file: canonicalValidatorPath,
      message:
        "Missing canonical-id-validator.contract.ts — PAS §4.1.2 validation surface",
    });
  }

  if (
    !hasExportedCallable(
      canonicalValidatorSource,
      "isRegisteredCanonicalEnterpriseId"
    )
  ) {
    violations.push({
      rule: "missing-registry-tier-validator",
      file: canonicalValidatorPath,
      message: "Missing isRegisteredCanonicalEnterpriseId export",
    });
  }

  const prefixRegistrySource = readFileSync(
    identitySources.prefixRegistry,
    "utf8"
  );

  if (
    !hasExportedCallable(prefixRegistrySource, "isRegisteredEnterpriseIdPrefix")
  ) {
    violations.push({
      rule: "missing-prefix-registry",
      file: identitySources.prefixRegistry,
      message: "Missing isRegisteredEnterpriseIdPrefix export",
    });
  }

  if (
    !hasExportedCallable(
      canonicalParserSource,
      "parseRegisteredCanonicalEnterpriseId"
    )
  ) {
    violations.push({
      rule: "missing-family-unknown-parser",
      file: identitySources.canonicalParser,
      message: "Missing parseRegisteredCanonicalEnterpriseId export",
    });
  }

  if (!identityIndex.includes("REGISTERED_ENTERPRISE_ID_PREFIXES")) {
    violations.push({
      rule: "missing-prefix-registry-export",
      file: identitySources.identityIndex,
      message:
        "identity/index.ts must export REGISTERED_ENTERPRISE_ID_PREFIXES",
    });
  }

  if (!identityIndex.includes("assertPlatformIdBoundaryRegistryCoverage")) {
    violations.push({
      rule: "boundary-coverage-guard-missing",
      file: identitySources.identityIndex,
      message:
        "identity/index.ts must export assertPlatformIdBoundaryRegistryCoverage",
    });
  }

  const forbiddenLegacyExports = [
    "brandRequiredId",
    "brandOptionalId",
    "brandTenantId",
    "brandCustomerId",
    "brandProductId",
    "brandUserId",
    "brandExecutionId",
    "brandCorrelationId",
  ] as const;

  for (const symbol of forbiddenLegacyExports) {
    if (hasBarrelExport(identityIndex, symbol)) {
      violations.push({
        rule: "legacy-brand-exported-from-identity-index",
        file: identitySources.identityIndex,
        message: `${symbol} must not be exported from identity/index.ts — use parse* instead`,
      });
    }

    if (hasBarrelExport(kernelRootIndex, symbol)) {
      violations.push({
        rule: "legacy-brand-exported-from-root",
        file: identitySources.kernelRootIndex,
        message: `${symbol} must not be exported from @afenda/kernel — use parse* instead`,
      });
    }
  }

  if (
    /\bfrom\s+["'].*legacy-brand-boundary\.contract/.test(identityIndex) ||
    /\bexport\s+\*?\s*.*legacy-brand-boundary\.contract/.test(identityIndex) ||
    /\bfrom\s+["'].*legacy-brand-boundary\.contract/.test(kernelRootIndex) ||
    /\bexport\s+\*?\s*.*legacy-brand-boundary\.contract/.test(kernelRootIndex)
  ) {
    violations.push({
      rule: "legacy-brand-barrel-reexport",
      file: identitySources.identityIndex,
      message:
        "legacy-brand-boundary.contract.ts must not be re-exported from public barrels",
    });
  }

  const identityDir = join(repoRoot, "packages/kernel/src/identity");
  for (const entry of readdirSync(identityDir)) {
    const entryPath = join(identityDir, entry);
    if (entry.endsWith(".ts")) {
      if (entry === "index.ts") {
        continue;
      }
      violations.push({
        rule: "unexpected-identity-root-file",
        file: entryPath,
        message: `${entry} must not live at identity root — use nested PAS §4.1.2 folders`,
      });
      continue;
    }

    if (!statSync(entryPath).isDirectory()) {
      continue;
    }

    if (!APPROVED_IDENTITY_SUBFOLDERS.has(entry)) {
      violations.push({
        rule: "unexpected-identity-subfolder",
        file: entryPath,
        message: `${entry}/ is outside the PAS §4.1.2 nested identity layout`,
      });
    }
  }

  const familiesDir = join(repoRoot, "packages/kernel/src/identity/families");
  for (const entry of readdirSync(familiesDir)) {
    const entryPath = join(familiesDir, entry);
    if (!statSync(entryPath).isFile()) {
      if (entry === "__tests__") {
        continue;
      }
      violations.push({
        rule: "unexpected-families-subfolder",
        file: entryPath,
        message: `${entry}/ is not allowed under identity/families/`,
      });
      continue;
    }

    if (!APPROVED_FAMILY_FILES.has(entry)) {
      violations.push({
        rule: "unexpected-family-contract-file",
        file: entryPath,
        message: `${entry} is outside the PAS §4.1.4 approved family contract layout`,
      });
    }
  }

  const brandDir = join(repoRoot, "packages/kernel/src/identity/brand");
  for (const entry of readdirSync(brandDir)) {
    const entryPath = join(brandDir, entry);
    if (!statSync(entryPath).isFile()) {
      if (entry === "__tests__") {
        continue;
      }
      violations.push({
        rule: "unexpected-brand-subfolder",
        file: entryPath,
        message: `${entry}/ is not allowed under identity/brand/ except __tests__/`,
      });
      continue;
    }

    if (!APPROVED_BRAND_FILES.has(entry)) {
      violations.push({
        rule: "unexpected-brand-contract-file",
        file: entryPath,
        message: `${entry} is outside the PAS §4.1.2 approved brand contract layout`,
      });
    }
  }

  const primitivesDir = join(
    repoRoot,
    "packages/kernel/src/identity/primitives"
  );
  for (const entry of readdirSync(primitivesDir)) {
    const entryPath = join(primitivesDir, entry);
    if (!statSync(entryPath).isFile()) {
      if (entry === "__tests__") {
        continue;
      }
      violations.push({
        rule: "unexpected-primitives-subfolder",
        file: entryPath,
        message: `${entry}/ is not allowed under identity/primitives/ except __tests__/`,
      });
      continue;
    }

    if (!APPROVED_PRIMITIVE_FILES.has(entry)) {
      violations.push({
        rule: "primitive-module-layout-drift",
        file: entryPath,
        message: `${entry} is outside the PAS §4.1.5 approved primitive module layout`,
      });
    }
  }

  const postgresDir = join(repoRoot, "packages/kernel/src/identity/postgres");
  for (const entry of readdirSync(postgresDir)) {
    const entryPath = join(postgresDir, entry);
    if (!statSync(entryPath).isFile()) {
      if (entry === "__tests__") {
        continue;
      }
      violations.push({
        rule: "unexpected-postgres-subfolder",
        file: entryPath,
        message: `${entry}/ is not allowed under identity/postgres/ except __tests__/`,
      });
      continue;
    }

    if (!APPROVED_POSTGRES_FILES.has(entry)) {
      violations.push({
        rule: "postgres-module-layout-drift",
        file: entryPath,
        message: `${entry} is outside the PAS §4.1.12 approved postgres module layout`,
      });
    }
  }

  const governanceDir = join(
    repoRoot,
    "packages/kernel/src/identity/governance"
  );
  for (const entry of readdirSync(governanceDir)) {
    const entryPath = join(governanceDir, entry);
    if (!statSync(entryPath).isFile()) {
      if (entry === "__tests__") {
        continue;
      }
      violations.push({
        rule: "unexpected-governance-subfolder",
        file: entryPath,
        message: `${entry}/ is not allowed under identity/governance/ except __tests__/`,
      });
      continue;
    }

    if (!APPROVED_GOVERNANCE_FILES.has(entry)) {
      violations.push({
        rule: "governance-module-layout-drift",
        file: entryPath,
        message: `${entry} is outside the PAS §4.1 approved governance module layout`,
      });
    }
  }

  function collectKernelTypeScriptFiles(directory: string): string[] {
    const files: string[] = [];
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const entryPath = join(directory, entry.name);
      if (entry.isDirectory()) {
        files.push(...collectKernelTypeScriptFiles(entryPath));
        continue;
      }
      if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
        files.push(entryPath);
      }
    }
    return files;
  }

  violations.push(
    ...collectDirectBrandContractImportViolations(
      collectKernelTypeScriptFiles(join(repoRoot, "packages/kernel/src")).map(
        (filePath) => ({
          path: filePath.slice(repoRoot.length + 1).replace(/\\/g, "/"),
          source: readFileSync(filePath, "utf8"),
        })
      )
    )
  );

  violations.push(
    ...collectPrimitiveContractSourceViolations(
      collectKernelTypeScriptFiles(
        join(repoRoot, "packages/kernel/src/identity/primitives")
      ).map((filePath) => ({
        path: filePath.slice(repoRoot.length + 1).replace(/\\/g, "/"),
        source: readFileSync(filePath, "utf8"),
      }))
    )
  );

  return violations;
}

export function formatIdentitySurfaceViolations(
  violations: readonly IdentitySurfaceViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}\n  ${v.message}`)
    .join("\n\n");
}

const violations = checkKernelIdentitySurface();

if (violations.length > 0) {
  console.error("Kernel identity surface gate failed:\n");
  console.error(formatIdentitySurfaceViolations(violations));
  process.exit(1);
}

console.log("Kernel identity surface gate passed (PAS-001 §4.1 / ADR-0021).");
