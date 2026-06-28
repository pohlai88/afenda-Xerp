import type { Result } from "../contracts/result.contract.js";
import type {
  ConsolidationScopeContext,
  ConsolidationScopeWireContext,
} from "./consolidation-scope-context.contract.js";
import type {
  EntityGroupContext,
  EntityGroupWireContext,
} from "./entity-group-context.contract.js";
import type {
  LegalEntityContext,
  LegalEntityWireContext,
} from "./legal-entity-context.contract.js";
import type {
  OrganizationUnitContext,
  OrganizationUnitWireContext,
} from "./organization-unit-context.contract.js";
import type {
  OwnershipInterestContext,
  OwnershipInterestWireContext,
} from "./ownership-interest-context.contract.js";
import type {
  PermissionScopeContext,
  PermissionScopeWireContext,
} from "./permission-scope-context.contract.js";
import type {
  ProjectContext,
  ProjectWireContext,
} from "./project-context.contract.js";
import type { SurfaceContext } from "./surface-context.contract.js";
import type { TeamContext, TeamWireContext } from "./team-context.contract.js";
import type {
  TenantContext,
  TenantWireContext,
} from "./tenant-context.contract.js";
import type { WorkflowContext } from "./workflow-context.contract.js";
import type { WorkspaceContext } from "./workspace-context.contract.js";

export interface OperatingContextActor {
  readonly userId: string;
}

/** Server-resolved ERP operating context — all authority verified before assembly. */
export interface OperatingContext {
  readonly actor: OperatingContextActor;
  readonly consolidationScope: ConsolidationScopeContext | null;
  readonly correlationId: string;
  readonly entityGroup: EntityGroupContext | null;
  readonly legalEntity: LegalEntityContext;
  readonly organizationUnit: OrganizationUnitContext | null;
  readonly ownershipInterests: readonly OwnershipInterestContext[];
  readonly permissionScope: PermissionScopeContext;
  readonly project: ProjectContext | null;
  readonly surface: SurfaceContext | null;
  readonly team: TeamContext | null;
  readonly tenant: TenantContext;
  readonly workflow: WorkflowContext | null;
  readonly workspace: WorkspaceContext;
}

export type { TenantWireContext } from "./tenant-context.contract.js";

/** Wire workspace slice — derived scope, validated at composed ingress. */
export interface WorkspaceWireContext {
  readonly companyId: string;
  readonly organizationId: string | null;
  readonly projectId: string | null;
  readonly tenantId: string;
}

/** Wire surface slice — runtime metadata scope. */
export interface SurfaceWireContext {
  readonly surfaceId: string;
}

/** Wire workflow slice — runtime execution scope. */
export interface WorkflowWireContext {
  readonly surfaceId: string | null;
  readonly workflowId: string;
}

/**
 * Composed operating context wire payload — delegates layer asserts/parsers to child triads.
 * ERP resolver output is server-assembled; use parseUnknownOperatingContext at cache/API ingress.
 */
export interface OperatingContextWireContext {
  readonly actor: OperatingContextActor;
  readonly consolidationScope: ConsolidationScopeWireContext | null;
  readonly correlationId: string;
  readonly entityGroup: EntityGroupWireContext | null;
  readonly legalEntity: LegalEntityWireContext;
  readonly organizationUnit: OrganizationUnitWireContext | null;
  readonly ownershipInterests: readonly OwnershipInterestWireContext[];
  readonly permissionScope: PermissionScopeWireContext;
  readonly project: ProjectWireContext | null;
  readonly surface: SurfaceWireContext | null;
  readonly team: TeamWireContext | null;
  readonly tenant: TenantWireContext;
  readonly workflow: WorkflowWireContext | null;
  readonly workspace: WorkspaceWireContext;
}

export const OPERATING_CONTEXT_ERROR_CODES = [
  "TENANT_NOT_FOUND",
  "TENANT_NOT_OPERATIONAL",
  "RESERVED_TENANT_SUBDOMAIN",
  "COMPANY_NOT_FOUND",
  "COMPANY_NOT_OPERATIONAL",
  "COMPANY_SCOPE_MISMATCH",
  "ORGANIZATION_NOT_FOUND",
  "ORGANIZATION_NOT_OPERATIONAL",
  "ORGANIZATION_SCOPE_MISMATCH",
  "MEMBERSHIP_DENIED",
  "INVALID_SELECTION",
  "MISSING_LEGAL_ENTITY_SELECTION",
  "INVALID_SURFACE_ID",
  "INVALID_WORKFLOW_ID",
  "TEAM_NOT_FOUND",
  "TEAM_SCOPE_MISMATCH",
  "ENTITY_GROUP_NOT_FOUND",
  "ENTITY_GROUP_NOT_OPERATIONAL",
  "ENTITY_GROUP_SCOPE_MISMATCH",
  "PROJECT_SCOPE_MISMATCH",
] as const;

export type OperatingContextErrorCode =
  (typeof OPERATING_CONTEXT_ERROR_CODES)[number];

export interface OperatingContextError {
  readonly code: OperatingContextErrorCode;
  readonly userMessage: string;
}

export type OperatingContextResult = Result<
  OperatingContext,
  OperatingContextError
>;

/** Untrusted client selection hints — always verified server-side. */
export interface OperatingContextSelection {
  readonly companyId?: string | null;
  readonly companySlug?: string | null;
  readonly organizationId?: string | null;
  readonly organizationSlug?: string | null;
  readonly projectId?: string | null;
  readonly surfaceId?: string | null;
  readonly teamId?: string | null;
  readonly tenantSlug: string;
  readonly workflowId?: string | null;
}
