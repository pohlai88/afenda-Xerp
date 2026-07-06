/**
 * PAS §4.1 / Action 7 — identity boundary drift guardrails (ADR-0021).
 *
 * Consumer packages must parse canonical enterprise IDs via @afenda/kernel parse*.
 * Unchecked casts, local aliases, legacy brand helpers, and raw Brand imports are
 * prohibited outside packages/kernel/src/identity/.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { PLATFORM_ID_FAMILY_TYPE_NAMES } from "../../../packages/kernel/src/identity/registry/id-family.registry.ts";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

/** Active consumer roots only — ADR-0027 retired appshell/metadata-ui/ui-composition. */
export const IDENTITY_BOUNDARY_SCAN_ROOTS = [
  "apps/erp/src",
  "packages/auth/src",
  "packages/database/src",
  "packages/execution/src",
  "packages/permissions/src",
  "packages/shadcn-studio-v2/src",
] as const;

export const IDENTITY_BOUNDARY_ALLOWLIST_PREFIXES = [
  "packages/kernel/src/identity/",
  "packages/kernel/src/__tests__/",
] as const;

export const FORBIDDEN_LEGACY_BRAND_HELPERS = [
  "brandRequiredId",
  "brandOptionalId",
  "brandTenantId",
  "brandEntityGroupId",
  "brandCompanyId",
  "brandOrganizationId",
  "brandTeamId",
  "brandProjectId",
  "brandUserId",
  "brandRoleId",
  "brandMembershipId",
  "brandPermissionId",
  "brandPolicyId",
  "brandAuditEventId",
  "brandOwnershipInterestId",
  "brandCustomerId",
  "brandSupplierId",
  "brandProductId",
  "brandEmployeeId",
  "brandWarehouseId",
  "brandExecutionId",
  "brandCorrelationId",
] as const;

const ENTERPRISE_ID_TYPE_NAMES = PLATFORM_ID_FAMILY_TYPE_NAMES;

const FORBIDDEN_LEGACY_BRAND_PATTERN = new RegExp(
  `\\b(${FORBIDDEN_LEGACY_BRAND_HELPERS.join("|")})\\b`,
  "g"
);

const FORBIDDEN_LEGACY_IMPORT_PATTERN =
  /\blegacy-brand-boundary\.contract(?:\.js)?\b/;

const FORBIDDEN_ENTERPRISE_ID_CAST_PATTERN = new RegExp(
  `\\bas\\s+(${ENTERPRISE_ID_TYPE_NAMES.join("|")})\\b`,
  "g"
);

const FORBIDDEN_CANONICAL_ENTERPRISE_ID_CAST_PATTERN =
  /\bas\s+CanonicalEnterpriseId(?:<[^>]+>)?\b/g;

const FORBIDDEN_CANONICAL_ID_CAST_PATTERN = /\bas\s+CanonicalId(?:<[^>]+>)?\b/g;

const LOCAL_ID_ALIAS_PATTERN = new RegExp(
  `\\btype\\s+(${ENTERPRISE_ID_TYPE_NAMES.join("|")})\\s*=\\s*string\\b`,
  "g"
);

const FORBIDDEN_KERNEL_BRAND_IMPORT_PATTERN =
  /import\s+(?:type\s+)?\{[^}]*\bBrand\b[^}]*\}\s+from\s+["']@afenda\/kernel["']/g;

export interface IdentityBoundarySource {
  readonly path: string;
  readonly source: string;
}

export interface IdentityBoundaryViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function isAllowlisted(relativePath: string): boolean {
  return IDENTITY_BOUNDARY_ALLOWLIST_PREFIXES.some((prefix) =>
    relativePath.startsWith(prefix)
  );
}

/** Strip string literals so `it("… as TenantId …")` does not false-positive cast rules. */
export function stripStringLiteralsForIdentityBoundaryScan(
  source: string
): string {
  return source
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/'(?:\\.|[^'\\])*'/g, "''")
    .replace(/`(?:\\.|[^`\\])*`/g, "``");
}

export function collectIdentityBoundaryViolations(
  sources: readonly IdentityBoundarySource[]
): IdentityBoundaryViolation[] {
  const violations: IdentityBoundaryViolation[] = [];

  for (const file of sources) {
    const relativePath = file.path.replace(/\\/g, "/");
    if (isAllowlisted(relativePath)) {
      continue;
    }

    const legacyBrandMatches = file.source.match(
      FORBIDDEN_LEGACY_BRAND_PATTERN
    );
    const codeWithoutStringLiterals =
      stripStringLiteralsForIdentityBoundaryScan(file.source);
    const castMatches = codeWithoutStringLiterals.match(
      FORBIDDEN_ENTERPRISE_ID_CAST_PATTERN
    );
    const canonicalCastMatches = [
      ...(codeWithoutStringLiterals.match(
        FORBIDDEN_CANONICAL_ENTERPRISE_ID_CAST_PATTERN
      ) ?? []),
      ...(codeWithoutStringLiterals.match(
        FORBIDDEN_CANONICAL_ID_CAST_PATTERN
      ) ?? []),
    ];
    const aliasMatches = codeWithoutStringLiterals.match(
      LOCAL_ID_ALIAS_PATTERN
    );
    const brandImportMatches = file.source.match(
      FORBIDDEN_KERNEL_BRAND_IMPORT_PATTERN
    );

    if (legacyBrandMatches) {
      violations.push({
        rule: "legacy-brand-helper",
        file: relativePath,
        message: `forbidden legacy brand helper ${[
          ...new Set(legacyBrandMatches),
        ].join(", ")} — use parse* at trust boundaries`,
      });
    }

    if (FORBIDDEN_LEGACY_IMPORT_PATTERN.test(file.source)) {
      violations.push({
        rule: "legacy-brand-import",
        file: relativePath,
        message:
          "forbidden import of legacy-brand-boundary.contract — use @afenda/kernel parse* exports",
      });
    }

    if (castMatches) {
      violations.push({
        rule: "enterprise-id-cast",
        file: relativePath,
        message: `forbidden cast ${castMatches.join(", ")}`,
      });
    }

    if (canonicalCastMatches.length > 0) {
      violations.push({
        rule: "canonical-enterprise-id-cast",
        file: relativePath,
        message: `forbidden cast ${canonicalCastMatches.join(", ")}`,
      });
    }

    if (aliasMatches) {
      violations.push({
        rule: "local-enterprise-id-alias",
        file: relativePath,
        message: `local ID alias ${aliasMatches.join(", ")}`,
      });
    }

    if (brandImportMatches) {
      violations.push({
        rule: "kernel-brand-import",
        file: relativePath,
        message:
          'forbidden import { Brand } from "@afenda/kernel" outside kernel identity — use parse* for enterprise IDs',
      });
    }
  }

  return violations;
}

function collectSourceFiles(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(fullPath));
      continue;
    }

    if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      files.push(fullPath);
    }
  }

  return files;
}

export function collectConsumerIdentityBoundarySources(): IdentityBoundarySource[] {
  const sources: IdentityBoundarySource[] = [];

  for (const scanRoot of IDENTITY_BOUNDARY_SCAN_ROOTS) {
    const directory = join(repoRoot, scanRoot);
    for (const file of collectSourceFiles(directory)) {
      sources.push({
        path: relative(repoRoot, file).replace(/\\/g, "/"),
        source: readFileSync(file, "utf8"),
      });
    }
  }

  return sources;
}

/** @deprecated Use collectIdentityBoundaryViolations */
export function collectUnsafeIdCastViolations(
  sources: readonly IdentityBoundarySource[]
): string[] {
  return collectIdentityBoundaryViolations(sources).map(
    (violation) => `${violation.file}: ${violation.message}`
  );
}

/** @deprecated Use ENTERPRISE_ID_TYPE_NAMES from kernel registry */
export const ENTERPRISE_ID_TYPE_NAMES_EXPORT = ENTERPRISE_ID_TYPE_NAMES;
