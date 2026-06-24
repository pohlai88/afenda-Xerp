import {
  TENANT_RLS_ISOLATION_POLICIES,
  type TenantRlsPolicyKind,
  type TenantRlsPolicyRow,
} from "./tenant-rls-coverage.contract.js";
import {
  collectTenantRlsSchemaParityGaps,
  TENANT_SCOPED_TABLE_NAMES,
  type TenantScopedTableName,
} from "./tenant-rls-schema-parity.contract.js";

/** Tables that use actor-scoped RLS — not tenant_id equality policies. */
export const TENANT_RLS_ACTOR_ISOLATION_TABLES = [
  "memberships",
] as const satisfies readonly TenantScopedTableName[];

export type TenantRlsRegistryInvariantRule =
  | "schema-parity-gap"
  | "duplicate-registry-table"
  | "policy-kind-mismatch"
  | "policy-name-kind-mismatch"
  | "registry-count-mismatch";

export interface TenantRlsRegistryInvariantViolation {
  readonly message: string;
  readonly rule: TenantRlsRegistryInvariantRule;
  readonly tableName?: string;
}

const ACTOR_ISOLATION_TABLE_SET = new Set<string>(
  TENANT_RLS_ACTOR_ISOLATION_TABLES
);

export function expectedPolicyKindForTable(
  tableName: string
): TenantRlsPolicyKind {
  return ACTOR_ISOLATION_TABLE_SET.has(tableName)
    ? "actor_isolation"
    : "tenant_isolation";
}

export function expectedPolicyNameSuffix(
  kind: TenantRlsPolicyKind
): "_tenant_isolation" | "_actor_isolation" {
  return kind === "actor_isolation" ? "_actor_isolation" : "_tenant_isolation";
}

export function collectTenantRlsRegistryInvariantViolations(
  registry: readonly TenantRlsPolicyRow[] = TENANT_RLS_ISOLATION_POLICIES
): TenantRlsRegistryInvariantViolation[] {
  const violations: TenantRlsRegistryInvariantViolation[] = [];

  for (const gap of collectTenantRlsSchemaParityGaps(registry)) {
    violations.push({
      rule: "schema-parity-gap",
      tableName: gap.tableName,
      message:
        gap.kind === "registry-missing-table"
          ? `Tenant-scoped table ${gap.tableName} is missing from TENANT_RLS_ISOLATION_POLICIES`
          : `Registry table ${gap.tableName} is not listed in TENANT_SCOPED_TABLE_NAMES`,
    });
  }

  if (registry.length !== TENANT_SCOPED_TABLE_NAMES.length) {
    violations.push({
      rule: "registry-count-mismatch",
      message: `Registry policy count (${registry.length}) must equal tenant-scoped table count (${TENANT_SCOPED_TABLE_NAMES.length})`,
    });
  }

  const seenTables = new Set<string>();

  for (const row of registry) {
    if (seenTables.has(row.tableName)) {
      violations.push({
        rule: "duplicate-registry-table",
        tableName: row.tableName,
        message: `Duplicate RLS registry entry for table ${row.tableName}`,
      });
    }
    seenTables.add(row.tableName);

    const expectedKind = expectedPolicyKindForTable(row.tableName);
    if (row.kind !== expectedKind) {
      violations.push({
        rule: "policy-kind-mismatch",
        tableName: row.tableName,
        message: `Table ${row.tableName} must use kind ${expectedKind}; found ${row.kind}`,
      });
    }

    const suffix = expectedPolicyNameSuffix(row.kind);
    if (!row.policyName.endsWith(suffix)) {
      violations.push({
        rule: "policy-name-kind-mismatch",
        tableName: row.tableName,
        message: `Policy ${row.policyName} must end with ${suffix} for kind ${row.kind}`,
      });
    }
  }

  return violations;
}
