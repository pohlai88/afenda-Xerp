import type { AfendaDatabase } from "@afenda/database";
import {
  err,
  type OperatingContextError,
  ok,
  type Result,
} from "@afenda/kernel";
import {
  type AuthorizationDenialCode,
  type AuthorizationResult,
  createProductionAuthorizationDataSources,
  isDeniedScopedMembershipResolution,
  isMatchedScopedMembershipResolution,
  isRoleActive,
  type MembershipContract,
  PERMISSION_REGISTRY,
  type PermissionScopeContext,
  type RoleScope,
  resolvePermissionScopeContext,
  resolveScopedMembership,
} from "@afenda/permissions";

export interface ResolvedGrantScope {
  readonly membership: MembershipContract;
  readonly permissionScope: PermissionScopeContext;
}

export type ResolveGrantScopeResult = Result<
  ResolvedGrantScope,
  OperatingContextError
>;

function createMembershipDenial(
  code: AuthorizationDenialCode,
  partial: {
    readonly membershipId: string | null;
    readonly reason: string;
    readonly result: "deny";
    readonly roleId: string | null;
  }
): AuthorizationResult {
  return {
    allowed: false,
    code,
    decision: {
      actorId: "",
      tenantId: "",
      companyId: null,
      entityGroupId: null,
      organizationId: null,
      workspaceId: null,
      membershipId: partial.membershipId,
      roleId: partial.roleId,
      permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
      action: "resolve_operating_context",
      targetType: "workspace",
      targetId: null,
      result: partial.result,
      reason: partial.reason,
      correlationId: "",
      evaluatedAt: new Date().toISOString(),
    },
  };
}

function membershipDeniedError(): OperatingContextError {
  return {
    code: "MEMBERSHIP_DENIED",
    userMessage: "You do not have access to this workspace scope.",
  };
}

export { loadActorMemberships } from "./load-actor-memberships.server";

export interface ResolveGrantScopeInput {
  readonly actorUserId: string;
  readonly companyId: string;
  readonly db?: AfendaDatabase;
  readonly entityGroupId?: string | null;
  readonly memberships: readonly MembershipContract[];
  readonly organizationId?: string | null;
  readonly projectId?: string | null;
  readonly roleScope?: RoleScope;
  readonly teamId?: string | null;
  readonly tenantId: string;
}

/**
 * Resolves the narrowest matching membership and kernel permission scope.
 * Fail-closed when membership or role cannot be verified.
 */
export async function resolveGrantScope(
  input: ResolveGrantScopeInput
): Promise<ResolveGrantScopeResult> {
  const organizationId = input.organizationId ?? null;
  const membershipResolution = resolveScopedMembership(
    input.memberships,
    {
      tenantId: input.tenantId,
      companyId: input.companyId,
      entityGroupId: input.entityGroupId ?? null,
      organizationId,
      projectId: input.projectId ?? null,
      teamId: input.teamId ?? null,
    },
    createMembershipDenial
  );

  if (
    isDeniedScopedMembershipResolution(membershipResolution) ||
    !isMatchedScopedMembershipResolution(membershipResolution)
  ) {
    return err(membershipDeniedError());
  }

  const db = input.db;
  const { permission } = createProductionAuthorizationDataSources(db);
  const role = await permission.getRole(membershipResolution.membership.roleId);

  if (!(role && isRoleActive(role))) {
    return err(membershipDeniedError());
  }

  const permissionScope = resolvePermissionScopeContext({
    companyId: input.companyId,
    entityGroupId: input.entityGroupId ?? null,
    membership: membershipResolution.membership,
    organizationId,
    projectId: input.projectId ?? null,
    roleScope: input.roleScope ?? role.scope,
    teamId: input.teamId ?? null,
  });

  return ok({
    membership: membershipResolution.membership,
    permissionScope,
  });
}
