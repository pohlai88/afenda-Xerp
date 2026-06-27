/**
 * ADR-0001 / TIP-007 — frozen platform entity ownership map.
 * Serializable registry only; no authorization or persistence logic.
 */

export const PLATFORM_ENTITY_IDS = [
  "tenant",
  "company",
  "organization",
  "workspace",
  "user",
  "membership",
  "role",
  "permission",
  "policy",
  "approval",
  "audit",
] as const;

export type PlatformEntityId = (typeof PLATFORM_ENTITY_IDS)[number];

/** Repo-relative path from monorepo root — validated by drift tests. */
export type RepoRelativePath = `${string}`;

export interface PlatformEntityAuthorityEntry {
  readonly auditOwner: string;
  /** Authorization consumer contracts under packages/permissions. */
  readonly authorizationConsumerPaths: readonly RepoRelativePath[];
  readonly displayName: string;
  readonly entityId: PlatformEntityId;
  /** Primary exported type or branded ID symbol from the kernel contract. */
  readonly kernelContractExport: string | null;
  /** Kernel serializable contract file, when kernel owns the authority shape. */
  readonly kernelContractPath: RepoRelativePath | null;
  readonly readOwner: string;
  /** Drizzle schema files under packages/database — empty when derived or gate-only. */
  readonly schemaPaths: readonly RepoRelativePath[];
  readonly writeOwner: string;
}

export const PLATFORM_ENTITY_AUTHORITY_REGISTRY = [
  {
    entityId: "tenant",
    displayName: "Tenant",
    kernelContractPath:
      "packages/kernel/src/context/tenant-context.contract.ts",
    kernelContractExport: "TenantContext",
    schemaPaths: ["packages/database/src/schema/tenant.schema.ts"],
    authorizationConsumerPaths: ["packages/permissions/src/tenant.contract.ts"],
    writeOwner: "Platform admin / System Admin (TIP-013)",
    readOwner: "Scoped packages via kernel context",
    auditOwner: "packages/database/src/schema/audit.schema.ts",
  },
  {
    entityId: "company",
    displayName: "Legal Entity (Company)",
    kernelContractPath:
      "packages/kernel/src/context/legal-entity-context.contract.ts",
    kernelContractExport: "LegalEntityContext",
    schemaPaths: ["packages/database/src/schema/company.schema.ts"],
    authorizationConsumerPaths: [
      "packages/permissions/src/scope/membership.contract.ts",
    ],
    writeOwner: "Tenant-scoped admin",
    readOwner: "Scoped packages via LegalEntityContext",
    auditOwner: "packages/database/src/schema/audit.schema.ts",
  },
  {
    entityId: "organization",
    displayName: "Organization Unit",
    kernelContractPath:
      "packages/kernel/src/context/organization-unit-context.contract.ts",
    kernelContractExport: "OrganizationUnitContext",
    schemaPaths: ["packages/database/src/schema/organization.schema.ts"],
    authorizationConsumerPaths: [
      "packages/permissions/src/scope/membership.contract.ts",
    ],
    writeOwner: "Company-scoped admin",
    readOwner: "Scoped packages via OrganizationUnitContext",
    auditOwner: "packages/database/src/schema/audit.schema.ts",
  },
  {
    entityId: "workspace",
    displayName: "Workspace",
    kernelContractPath:
      "packages/kernel/src/context/workspace-context.contract.ts",
    kernelContractExport: "WorkspaceContext",
    schemaPaths: [],
    authorizationConsumerPaths: [
      "packages/permissions/src/scope/membership.contract.ts",
    ],
    writeOwner: "ERP host (apps/erp/src/lib/context/)",
    readOwner: "@afenda/appshell via app-shell-context-switch.contract.ts",
    auditOwner: "Context resolution observability adapter",
  },
  {
    entityId: "user",
    displayName: "User",
    kernelContractPath:
      "packages/kernel/src/identity/families/identity-access-id.contract.ts",
    kernelContractExport: "UserId",
    schemaPaths: ["packages/database/src/schema/user.schema.ts"],
    authorizationConsumerPaths: ["packages/permissions/src/user.contract.ts"],
    writeOwner: "Identity provider + platform admin",
    readOwner: "Authorization actor resolution",
    auditOwner: "packages/database/src/schema/audit.schema.ts",
  },
  {
    entityId: "membership",
    displayName: "Membership",
    kernelContractPath:
      "packages/kernel/src/context/permission-scope-context.contract.ts",
    kernelContractExport: "PermissionScopeContext",
    schemaPaths: ["packages/database/src/schema/membership.schema.ts"],
    authorizationConsumerPaths: [
      "packages/permissions/src/scope/membership.contract.ts",
    ],
    writeOwner: "Tenant / company admin",
    readOwner: "@afenda/permissions grant resolution",
    auditOwner: "packages/database/src/schema/audit.schema.ts",
  },
  {
    entityId: "role",
    displayName: "Role",
    kernelContractPath: null,
    kernelContractExport: null,
    schemaPaths: [
      "packages/database/src/schema/role.schema.ts",
      "packages/database/src/schema/role-permission.schema.ts",
    ],
    authorizationConsumerPaths: [
      "packages/permissions/src/grants/role.contract.ts",
    ],
    writeOwner: "Platform admin",
    readOwner: "@afenda/permissions PERMISSION_REGISTRY",
    auditOwner: "packages/database/src/schema/audit.schema.ts",
  },
  {
    entityId: "permission",
    displayName: "Permission",
    kernelContractPath:
      "packages/kernel/src/identity/families/identity-access-id.contract.ts",
    kernelContractExport: "PermissionId",
    schemaPaths: ["packages/database/src/schema/permission.schema.ts"],
    authorizationConsumerPaths: [
      "packages/permissions/src/grants/permission.contract.ts",
    ],
    writeOwner: "Architecture Authority (registry)",
    readOwner: "All authorization checks",
    auditOwner: "packages/permissions/src/policy-audit.ts",
  },
  {
    entityId: "policy",
    displayName: "Policy",
    kernelContractPath: null,
    kernelContractExport: null,
    schemaPaths: ["packages/database/src/schema/policy.schema.ts"],
    authorizationConsumerPaths: ["packages/permissions/src/policy.contract.ts"],
    writeOwner: "Platform admin",
    readOwner: "@afenda/permissions policy evaluation",
    auditOwner: "packages/permissions/src/policy-audit.ts",
  },
  {
    entityId: "approval",
    displayName: "Approval (policy gate outcome)",
    kernelContractPath: null,
    kernelContractExport: null,
    schemaPaths: [],
    authorizationConsumerPaths: ["packages/permissions/src/policy.contract.ts"],
    writeOwner: "Policy-defined approvers (future workflow)",
    readOwner: "Policy engine require_approval gate",
    auditOwner: "Policy evaluation audit",
  },
  {
    entityId: "audit",
    displayName: "Audit Event",
    kernelContractPath:
      "packages/kernel/src/identity/families/audit-execution-id.contract.ts",
    kernelContractExport: "AuditEventId",
    schemaPaths: ["packages/database/src/schema/audit.schema.ts"],
    authorizationConsumerPaths: ["packages/permissions/src/policy-audit.ts"],
    writeOwner: "Mutation handlers / spine",
    readOwner: "Observability + compliance readers",
    auditOwner: "packages/database audit pipeline",
  },
] as const satisfies readonly PlatformEntityAuthorityEntry[];

export function getPlatformEntityAuthority(
  entityId: PlatformEntityId
): PlatformEntityAuthorityEntry {
  const entry = PLATFORM_ENTITY_AUTHORITY_REGISTRY.find(
    (candidate) => candidate.entityId === entityId
  );

  if (!entry) {
    throw new Error(`Unknown platform entity: ${entityId}`);
  }

  return entry;
}

export function isPlatformEntityId(value: string): value is PlatformEntityId {
  return (PLATFORM_ENTITY_IDS as readonly string[]).includes(value);
}
