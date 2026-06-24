/**
 * Membership write governance — types and pure builders (no I/O).
 *
 * Table: `schema/membership.schema.ts`
 * Writes: `membership.service.ts`
 */
import type {
  MembershipScopeType,
  MembershipStatus,
  RoleScope,
} from "../database.types.js";

export class MembershipScopeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MembershipScopeValidationError";
  }
}

export class MembershipScopeMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MembershipScopeMismatchError";
  }
}

export class MembershipDuplicateGrantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MembershipDuplicateGrantError";
  }
}

export class MembershipRoleScopeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MembershipRoleScopeError";
  }
}

export interface MembershipWriteInput {
  readonly companyId?: string | null;
  readonly entityGroupId?: string | null;
  readonly organizationId?: string | null;
  readonly projectId?: string | null;
  readonly roleId: string;
  readonly scopeType: MembershipScopeType;
  readonly status?: MembershipStatus;
  readonly teamId?: string | null;
  readonly tenantId: string;
  readonly userId: string;
}

export interface MembershipInsertRow {
  companyId: string | null;
  entityGroupId: string | null;
  organizationId: string | null;
  projectId: string | null;
  roleId: string;
  scopeType: MembershipScopeType;
  status: MembershipStatus;
  teamId: string | null;
  tenantId: string;
  userId: string;
}

export type MembershipUpdatePatch = Partial<
  Pick<MembershipInsertRow, "status" | "roleId">
>;

const ROLE_SCOPE_BY_MEMBERSHIP_SCOPE: Record<
  MembershipScopeType,
  readonly RoleScope[]
> = {
  tenant: ["tenant", "platform"],
  entity_group: ["tenant", "platform"],
  company: ["company", "tenant", "platform"],
  organization: ["organization", "company", "tenant", "platform"],
  project: ["tenant", "platform"],
  team: ["tenant", "platform"],
};

/** Validates nullable scope columns match explicit scope type. */
export function assertMembershipScopeShape(
  scopeType: MembershipScopeType,
  companyId: string | null,
  organizationId: string | null,
  entityGroupId: string | null = null,
  projectId: string | null = null,
  teamId: string | null = null
): void {
  if (scopeType === "tenant") {
    if (
      companyId !== null ||
      organizationId !== null ||
      entityGroupId !== null ||
      projectId !== null ||
      teamId !== null
    ) {
      throw new MembershipScopeValidationError(
        "Tenant-scoped memberships must not set companyId, entityGroupId, organizationId, projectId, or teamId."
      );
    }
    return;
  }

  if (scopeType === "entity_group") {
    if (
      !entityGroupId ||
      companyId !== null ||
      organizationId !== null ||
      projectId !== null ||
      teamId !== null
    ) {
      throw new MembershipScopeValidationError(
        "Entity-group-scoped memberships require entityGroupId and must not set companyId, organizationId, projectId, or teamId."
      );
    }
    return;
  }

  if (scopeType === "company") {
    if (
      !companyId ||
      organizationId !== null ||
      entityGroupId !== null ||
      projectId !== null ||
      teamId !== null
    ) {
      throw new MembershipScopeValidationError(
        "Company-scoped memberships require companyId and must not set entityGroupId, organizationId, projectId, or teamId."
      );
    }
    return;
  }

  if (scopeType === "project") {
    if (
      !projectId ||
      companyId !== null ||
      organizationId !== null ||
      entityGroupId !== null ||
      teamId !== null
    ) {
      throw new MembershipScopeValidationError(
        "Project-scoped memberships require projectId and must not set companyId, organizationId, entityGroupId, or teamId."
      );
    }
    return;
  }

  if (scopeType === "team") {
    if (
      !teamId ||
      companyId !== null ||
      organizationId !== null ||
      entityGroupId !== null ||
      projectId !== null
    ) {
      throw new MembershipScopeValidationError(
        "Team-scoped memberships require teamId and must not set companyId, organizationId, entityGroupId, or projectId."
      );
    }
    return;
  }

  if (
    !(companyId && organizationId) ||
    entityGroupId !== null ||
    projectId !== null ||
    teamId !== null
  ) {
    throw new MembershipScopeValidationError(
      "Organization-scoped memberships require both companyId and organizationId and must not set entityGroupId, projectId, or teamId."
    );
  }
}

export function assertRoleMatchesMembershipScope(
  membershipScopeType: MembershipScopeType,
  roleScope: RoleScope
): void {
  const allowedScopes = ROLE_SCOPE_BY_MEMBERSHIP_SCOPE[membershipScopeType];

  if (!allowedScopes.includes(roleScope)) {
    throw new MembershipRoleScopeError(
      `Role scope "${roleScope}" is not valid for membership scope "${membershipScopeType}".`
    );
  }
}

export function buildMembershipInsertRow(
  input: MembershipWriteInput
): MembershipInsertRow {
  const companyId = input.companyId ?? null;
  const entityGroupId = input.entityGroupId ?? null;
  const organizationId = input.organizationId ?? null;
  const projectId = input.projectId ?? null;
  const teamId = input.teamId ?? null;

  assertMembershipScopeShape(
    input.scopeType,
    companyId,
    organizationId,
    entityGroupId,
    projectId,
    teamId
  );

  return {
    tenantId: input.tenantId,
    companyId,
    entityGroupId,
    organizationId,
    projectId,
    teamId,
    userId: input.userId,
    roleId: input.roleId,
    scopeType: input.scopeType,
    status: input.status ?? "active",
  };
}

export function buildMembershipUpdatePatch(
  input: MembershipUpdatePatch
): MembershipUpdatePatch {
  const patch: MembershipUpdatePatch = {};

  if (input.status !== undefined) {
    patch.status = input.status;
  }
  if (input.roleId !== undefined) {
    patch.roleId = input.roleId;
  }

  return patch;
}

export function buildMembershipScopeKey(
  membership: Pick<
    MembershipInsertRow,
    | "userId"
    | "tenantId"
    | "companyId"
    | "entityGroupId"
    | "organizationId"
    | "projectId"
    | "teamId"
    | "roleId"
    | "scopeType"
  >
): string {
  return [
    membership.userId,
    membership.tenantId,
    membership.scopeType,
    membership.companyId ?? "",
    membership.entityGroupId ?? "",
    membership.organizationId ?? "",
    membership.projectId ?? "",
    membership.teamId ?? "",
    membership.roleId,
  ].join(":");
}
