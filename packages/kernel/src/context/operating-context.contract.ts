import type { Result } from "../contracts/result.contract.js";
import type { ConsolidationScopeContext } from "./consolidation-scope-context.contract.js";
import type { EntityGroupContext } from "./entity-group-context.contract.js";
import type { LegalEntityContext } from "./legal-entity-context.contract.js";
import type { OperatingContextPermissionScope } from "./operating-context-permission-scope.contract.js";
import type { OrganizationUnitContext } from "./organization-unit-context.contract.js";
import type { OwnershipInterestContext } from "./ownership-interest-context.contract.js";
import type { ProjectContext } from "./project-context.contract.js";
import type { SurfaceContext } from "./surface-context.contract.js";
import type { TeamContext } from "./team-context.contract.js";
import type { TenantContext } from "./tenant-context.contract.js";
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
  readonly permissionScope: OperatingContextPermissionScope;
  readonly project: ProjectContext | null;
  readonly surface: SurfaceContext | null;
  readonly team: TeamContext | null;
  readonly tenant: TenantContext;
  readonly workflow: WorkflowContext | null;
  readonly workspace: WorkspaceContext;
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
