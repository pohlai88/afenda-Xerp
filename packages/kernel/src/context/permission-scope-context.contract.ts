/**
 * Resolved permission grant scope on `OperatingContext`.
 *
 * Resolver output originates in `@afenda/permissions`; kernel owns wire ingress triad
 * and branded fields so `OperatingContext` does not import `@afenda/permissions`.
 */
import type {
  CompanyId,
  EntityGroupId,
  MembershipId,
  OrganizationId,
  ProjectId,
  RoleId,
  TenantId,
} from "../identity/index.js";
import type {
  PermissionGrantElevationFlags,
  PermissionGrantScopeType,
} from "./permission-grant-vocabulary.contract.js";
import type { TeamAuthorityId } from "./team-context.contract.js";

export interface PermissionScopeContext {
  readonly companyId: CompanyId | null;
  readonly elevations: PermissionGrantElevationFlags;
  readonly entityGroupId: EntityGroupId | null;
  readonly grantScopeType: PermissionGrantScopeType;
  readonly membershipId: MembershipId;
  readonly organizationId: OrganizationId | null;
  readonly projectId: ProjectId | null;
  readonly roleId: RoleId;
  readonly teamId: TeamAuthorityId | null;
  readonly tenantId: TenantId;
}

/** JSON/wire format — plain string ids and JSON primitives. Parse via parser at ingress. */
export interface PermissionScopeWireContext {
  readonly companyId: string | null;
  readonly elevations: PermissionGrantElevationFlags;
  readonly entityGroupId: string | null;
  readonly grantScopeType: PermissionGrantScopeType;
  readonly membershipId: string;
  readonly organizationId: string | null;
  readonly projectId: string | null;
  readonly roleId: string;
  readonly teamId: string | null;
  readonly tenantId: string;
}
