import { assertPermissionKey, type PermissionKey } from "@afenda/database";
import {
  type AuthorizationActor,
  type AuthorizationContextInput,
  assertAuthorizationActor,
  assertTenantContext,
  createAuthorizationCorrelationId,
} from "./authorization-context.js";
import type { AuthorizationDenialCode } from "./authorization-denial-code.js";
import {
  type AuthorizationDecision,
  AuthorizationDeniedError,
  type AuthorizationResult,
  buildAuthorizationDecision,
  createAllowedAuthorizationResult,
  createDeniedAuthorizationResult,
} from "./authorization-error.js";
import {
  isMembershipActive,
  type MembershipContract,
  membershipMatchesCompany,
  membershipMatchesOrganization,
} from "./membership.contract.js";
import {
  extractPermissionAction,
  type PermissionTargetType,
  resolveBoundaryPermissionKey,
} from "./permission.contract.js";
import { isRoleActive, type RoleContract } from "./role.contract.js";
import {
  getTenantAccessBlockReason,
  isTenantOperational,
  type TenantContract,
} from "./tenant.contract.js";
import {
  isPlatformUserActive,
  type PlatformUserContract,
} from "./user.contract.js";

export interface PermissionCheckRequest {
  readonly action?: string;
  readonly actor: AuthorizationActor;
  readonly context: AuthorizationContextInput;
  readonly correlationId?: string;
  readonly permissionKey: PermissionKey | string;
  readonly targetId?: string | null;
  readonly targetType?: PermissionTargetType | null;
}

export interface PermissionDataSource {
  findMembershipsForActor(input: {
    actorId: string;
    tenantId: string;
  }): Promise<readonly MembershipContract[]>;

  getPermissionsForRole(roleId: string): Promise<readonly PermissionKey[]>;

  getPlatformUser(actorId: string): Promise<PlatformUserContract | null>;

  getRole(roleId: string): Promise<RoleContract | null>;

  getTenant(tenantId: string): Promise<TenantContract | null>;

  isCompanyInTenant(companyId: string, tenantId: string): Promise<boolean>;
}

type DecisionFields = Pick<
  AuthorizationDecision,
  "result" | "reason" | "membershipId" | "roleId"
>;

type DecisionBuilder = (partial: DecisionFields) => AuthorizationDecision;

function deny(
  build: DecisionBuilder,
  code: AuthorizationDenialCode,
  partial: DecisionFields
): AuthorizationResult {
  return createDeniedAuthorizationResult(build(partial), code);
}

async function validatePlatformActor(
  dataSource: PermissionDataSource,
  actorId: string,
  build: DecisionBuilder
): Promise<AuthorizationResult | null> {
  const platformUser = await dataSource.getPlatformUser(actorId);

  if (!platformUser) {
    return deny(build, "missing_actor", {
      result: "deny",
      reason: "Platform user was not found for the authenticated actor.",
      membershipId: null,
      roleId: null,
    });
  }

  if (!isPlatformUserActive(platformUser)) {
    return deny(build, "inactive_actor", {
      result: "deny",
      reason: `Platform user status "${platformUser.status}" cannot act.`,
      membershipId: null,
      roleId: null,
    });
  }

  return null;
}

async function validateTenant(
  dataSource: PermissionDataSource,
  tenantId: string,
  build: DecisionBuilder
): Promise<AuthorizationResult | null> {
  const tenant = await dataSource.getTenant(tenantId);

  if (!tenant) {
    return deny(build, "missing_tenant", {
      result: "deny",
      reason: "Tenant was not found for the requested workspace context.",
      membershipId: null,
      roleId: null,
    });
  }

  if (!isTenantOperational(tenant)) {
    return deny(build, "inactive_tenant", {
      result: "deny",
      reason:
        getTenantAccessBlockReason(tenant.status) ??
        `Tenant status "${tenant.status}" cannot access the workspace.`,
      membershipId: null,
      roleId: null,
    });
  }

  return null;
}

async function validateCompanyTenant(
  dataSource: PermissionDataSource,
  companyId: string,
  tenantId: string,
  build: DecisionBuilder
): Promise<AuthorizationResult | null> {
  const companyValid = await dataSource.isCompanyInTenant(companyId, tenantId);

  if (!companyValid) {
    return deny(build, "tenant_mismatch", {
      result: "deny",
      reason: "Company does not belong to the requested tenant.",
      membershipId: null,
      roleId: null,
    });
  }

  return null;
}

function resolveScopedMembership(
  memberships: readonly MembershipContract[],
  context: AuthorizationContextInput & { tenantId: string },
  build: DecisionBuilder
): AuthorizationResult | MembershipContract {
  const activeMemberships = memberships.filter(isMembershipActive);

  if (activeMemberships.length === 0) {
    return deny(build, "missing_membership", {
      result: "deny",
      reason: "No active membership found for actor in the requested tenant.",
      membershipId: null,
      roleId: null,
    });
  }

  const companyScopedMemberships = activeMemberships.filter((membership) =>
    membershipMatchesCompany(membership, context.companyId)
  );

  if (companyScopedMemberships.length === 0) {
    const referenceMembership = activeMemberships[0];
    return deny(build, "company_mismatch", {
      result: "deny",
      reason: "Membership company scope does not match the requested company.",
      membershipId: referenceMembership?.id ?? null,
      roleId: referenceMembership?.roleId ?? null,
    });
  }

  const organizationScopedMemberships = companyScopedMemberships.filter(
    (membership) =>
      membershipMatchesOrganization(membership, context.organizationId)
  );

  if (organizationScopedMemberships.length === 0) {
    const referenceMembership = companyScopedMemberships[0];
    return deny(build, "company_mismatch", {
      result: "deny",
      reason:
        "Membership organization scope does not match the requested organization.",
      membershipId: referenceMembership?.id ?? null,
      roleId: referenceMembership?.roleId ?? null,
    });
  }

  const membership = organizationScopedMemberships[0];

  if (!membership) {
    return deny(build, "missing_membership", {
      result: "deny",
      reason: "No membership matched the requested authorization scope.",
      membershipId: null,
      roleId: null,
    });
  }

  return membership;
}

export async function checkPermission(
  request: PermissionCheckRequest,
  dataSource: PermissionDataSource
): Promise<AuthorizationResult> {
  assertAuthorizationActor(request.actor);
  assertTenantContext(request.context);

  const tenantId = request.context.tenantId;
  const permissionKey = assertPermissionKey(request.permissionKey);
  const action = request.action ?? extractPermissionAction(permissionKey);
  const correlationId =
    request.correlationId ?? createAuthorizationCorrelationId();

  const build: DecisionBuilder = (partial) =>
    buildAuthorizationDecision({
      actorId: request.actor.actorId,
      tenantId,
      companyId: request.context.companyId ?? null,
      organizationId: request.context.organizationId ?? null,
      workspaceId: request.context.workspaceId ?? null,
      membershipId: partial.membershipId,
      roleId: partial.roleId,
      permissionKey,
      action,
      targetType: request.targetType ?? null,
      targetId: request.targetId ?? null,
      result: partial.result,
      reason: partial.reason,
      correlationId,
    });

  const actorDenial = await validatePlatformActor(
    dataSource,
    request.actor.actorId,
    build
  );
  if (actorDenial) {
    return actorDenial;
  }

  const tenantDenial = await validateTenant(dataSource, tenantId, build);
  if (tenantDenial) {
    return tenantDenial;
  }

  if (request.context.companyId) {
    const companyDenial = await validateCompanyTenant(
      dataSource,
      request.context.companyId,
      tenantId,
      build
    );
    if (companyDenial) {
      return companyDenial;
    }
  }

  const memberships = await dataSource.findMembershipsForActor({
    actorId: request.actor.actorId,
    tenantId,
  });
  const membershipResult = resolveScopedMembership(
    memberships,
    request.context,
    build
  );

  if (!("id" in membershipResult)) {
    return membershipResult;
  }

  const membership = membershipResult;
  const role = await dataSource.getRole(membership.roleId);

  if (!(role && isRoleActive(role))) {
    return deny(build, "permission_denied", {
      result: "deny",
      reason: "Assigned role is inactive, archived, or missing.",
      membershipId: membership.id,
      roleId: membership.roleId,
    });
  }

  const grantedPermissions = await dataSource.getPermissionsForRole(role.id);
  const hasPermission = grantedPermissions.includes(permissionKey);

  if (!hasPermission) {
    return deny(build, "permission_denied", {
      result: "deny",
      reason: `Permission "${permissionKey}" is not granted to role "${role.key}".`,
      membershipId: membership.id,
      roleId: role.id,
    });
  }

  return createAllowedAuthorizationResult(
    build({
      result: "allow",
      reason: `Permission "${permissionKey}" granted via role "${role.key}".`,
      membershipId: membership.id,
      roleId: role.id,
    })
  );
}

export async function requirePermission(
  request: PermissionCheckRequest,
  dataSource: PermissionDataSource
): Promise<AuthorizationDecision> {
  const result = await checkPermission(
    {
      ...request,
      permissionKey: resolveBoundaryPermissionKey(request.permissionKey),
    },
    dataSource
  );

  if (!result.allowed) {
    throw new AuthorizationDeniedError(result.decision, result.code);
  }

  return result.decision;
}

/** In-memory data source for tests and local development stubs. */
export class InMemoryPermissionDataSource implements PermissionDataSource {
  private readonly companiesByTenant = new Map<string, Set<string>>();
  private readonly memberships: MembershipContract[] = [];
  private readonly platformUsers = new Map<string, PlatformUserContract>();
  private readonly rolePermissions = new Map<string, PermissionKey[]>();
  private readonly roles = new Map<string, RoleContract>();
  private readonly tenants = new Map<string, TenantContract>();

  seedCompany(tenantId: string, companyId: string): this {
    const companies = this.companiesByTenant.get(tenantId) ?? new Set<string>();
    companies.add(companyId);
    this.companiesByTenant.set(tenantId, companies);
    return this;
  }

  seedRole(role: RoleContract, permissions: readonly PermissionKey[]): this {
    this.roles.set(role.id, role);
    this.rolePermissions.set(role.id, [...permissions]);
    return this;
  }

  seedMembership(membership: MembershipContract): this {
    this.memberships.push(membership);
    return this;
  }

  seedPlatformUser(user: PlatformUserContract): this {
    this.platformUsers.set(user.id, user);
    return this;
  }

  seedTenant(tenant: TenantContract): this {
    this.tenants.set(tenant.id, tenant);
    return this;
  }

  findMembershipsForActor(input: {
    actorId: string;
    tenantId: string;
  }): Promise<readonly MembershipContract[]> {
    return Promise.resolve(
      this.memberships.filter(
        (membership) =>
          membership.userId === input.actorId &&
          membership.tenantId === input.tenantId
      )
    );
  }

  getPermissionsForRole(roleId: string): Promise<readonly PermissionKey[]> {
    return Promise.resolve(this.rolePermissions.get(roleId) ?? []);
  }

  getPlatformUser(actorId: string): Promise<PlatformUserContract | null> {
    return Promise.resolve(this.platformUsers.get(actorId) ?? null);
  }

  getRole(roleId: string): Promise<RoleContract | null> {
    return Promise.resolve(this.roles.get(roleId) ?? null);
  }

  getTenant(tenantId: string): Promise<TenantContract | null> {
    return Promise.resolve(this.tenants.get(tenantId) ?? null);
  }

  isCompanyInTenant(companyId: string, tenantId: string): Promise<boolean> {
    return Promise.resolve(
      this.companiesByTenant.get(tenantId)?.has(companyId) ?? false
    );
  }
}
