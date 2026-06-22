import {
  getDb,
  withRlsSessionContext,
  type AfendaDatabase,
} from "@afenda/database";
import {
  err,
  ok,
  type OperatingContextError,
  type PermissionScopeContext,
  type Result,
} from "@afenda/kernel";
import {
  createProductionAuthorizationDataSources,
  isDeniedScopedMembershipResolution,
  isMatchedScopedMembershipResolution,
  isRoleActive,
  PERMISSION_REGISTRY,
  resolvePermissionScopeContext,
  resolveScopedMembership,
  type AuthorizationDenialCode,
  type AuthorizationResult,
  type MembershipContract,
  type RoleScope,
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

export async function loadActorMemberships(input: {
  readonly actorUserId: string;
  readonly db?: AfendaDatabase;
  readonly tenantId: string;
}): Promise<readonly MembershipContract[]> {
  const db = input.db ?? getDb();

  return withRlsSessionContext(
    db,
    {
      tenantId: input.tenantId,
      platformUserId: input.actorUserId,
    },
    async (tx) => {
      const { permission } = createProductionAuthorizationDataSources(tx);
      return permission.findMembershipsForActor({
        actorId: input.actorUserId,
        tenantId: input.tenantId,
      });
    }
  );
}

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
      organizationId,
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
  const role = await permission.getRole(
    membershipResolution.membership.roleId
  );

  if (!(role && isRoleActive(role))) {
    return err(membershipDeniedError());
  }

  const permissionScope = resolvePermissionScopeContext({
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
