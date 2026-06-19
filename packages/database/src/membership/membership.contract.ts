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
  readonly organizationId?: string | null;
  readonly roleId: string;
  readonly scopeType: MembershipScopeType;
  readonly status?: MembershipStatus;
  readonly tenantId: string;
  readonly userId: string;
}

export interface MembershipInsertRow {
  companyId: string | null;
  organizationId: string | null;
  roleId: string;
  scopeType: MembershipScopeType;
  status: MembershipStatus;
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
  company: ["company", "tenant", "platform"],
  organization: ["organization", "company", "tenant", "platform"],
};

/** Validates nullable scope columns match explicit scope type. */
export function assertMembershipScopeShape(
  scopeType: MembershipScopeType,
  companyId: string | null,
  organizationId: string | null
): void {
  if (scopeType === "tenant") {
    if (companyId !== null || organizationId !== null) {
      throw new MembershipScopeValidationError(
        "Tenant-scoped memberships must not set companyId or organizationId."
      );
    }
    return;
  }

  if (scopeType === "company") {
    if (!companyId || organizationId !== null) {
      throw new MembershipScopeValidationError(
        "Company-scoped memberships require companyId and must not set organizationId."
      );
    }
    return;
  }

  if (!(companyId && organizationId)) {
    throw new MembershipScopeValidationError(
      "Organization-scoped memberships require both companyId and organizationId."
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
  const organizationId = input.organizationId ?? null;

  assertMembershipScopeShape(input.scopeType, companyId, organizationId);

  return {
    tenantId: input.tenantId,
    companyId,
    organizationId,
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
    | "organizationId"
    | "roleId"
    | "scopeType"
  >
): string {
  return [
    membership.userId,
    membership.tenantId,
    membership.scopeType,
    membership.companyId ?? "",
    membership.organizationId ?? "",
    membership.roleId,
  ].join(":");
}
