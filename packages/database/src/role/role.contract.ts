/**
 * Role write governance — types and pure builders (no I/O).
 *
 * Table: `schema/role.schema.ts`
 * Writes: `role.service.ts`
 */
import type { RoleScope, RoleStatus } from "../database.types.js";

const ROLE_KEY_SEGMENT_PATTERN = /^[a-z][a-z0-9_]*$/u;
const ROLE_KEY_PATTERN = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/u;
const MAX_ROLE_KEY_LENGTH = 128;
const MAX_ROLE_KEY_SEGMENT_LENGTH = 64;

export class InvalidRoleKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidRoleKeyError";
  }
}

export class RoleScopeTenantMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RoleScopeTenantMismatchError";
  }
}

export class RoleKeyImmutableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RoleKeyImmutableError";
  }
}

/** Lowercases role keys. Do not pass display names — derive keys intentionally. */
export function normalizeRoleKey(value: string): string {
  return value.trim().toLowerCase();
}

function assertRoleKeySegment(value: string, label: string): void {
  if (!value) {
    throw new InvalidRoleKeyError(`Role key ${label} must be non-empty.`);
  }

  if (value.length > MAX_ROLE_KEY_SEGMENT_LENGTH) {
    throw new InvalidRoleKeyError(
      `Role key ${label} must be ${MAX_ROLE_KEY_SEGMENT_LENGTH} characters or less.`
    );
  }

  if (!ROLE_KEY_SEGMENT_PATTERN.test(value)) {
    throw new InvalidRoleKeyError(
      `Role key ${label} must use lowercase snake_case segments separated by dots.`
    );
  }
}

/**
 * Canonical dot-case role keys, e.g. `system_admin.users.manager`.
 * Prohibits raw display names such as `"Admin User"`.
 */
export function assertRoleKey(value: string): string {
  const normalized = normalizeRoleKey(value);

  if (normalized.length > MAX_ROLE_KEY_LENGTH) {
    throw new InvalidRoleKeyError(
      `Role key must be ${MAX_ROLE_KEY_LENGTH} characters or less.`
    );
  }

  if (!ROLE_KEY_PATTERN.test(normalized)) {
    throw new InvalidRoleKeyError(
      `Invalid role key "${value}". Expected lowercase dot-case with at least two segments, e.g. "finance.approver".`
    );
  }

  for (const segment of normalized.split(".")) {
    assertRoleKeySegment(segment, "segment");
  }

  return normalized;
}

/** Platform scope requires null tenantId; tenant-bound scopes require tenantId. */
export function assertRoleScopeMatchesTenant(
  scope: RoleScope,
  tenantId: string | null
): void {
  if (scope === "platform") {
    if (tenantId !== null) {
      throw new RoleScopeTenantMismatchError(
        "Platform-scoped roles must have tenantId = null."
      );
    }
    return;
  }

  if (tenantId === null || tenantId.trim() === "") {
    throw new RoleScopeTenantMismatchError(
      `Scope "${scope}" requires a tenantId. Platform scope is the only tenant-less role scope.`
    );
  }
}

export function isRoleOperational(role: Pick<RoleRecord, "status">): boolean {
  return role.status === "active";
}

export interface RoleWriteInput {
  readonly description?: string | null;
  readonly key: string;
  readonly name: string;
  readonly scope: RoleScope;
  readonly status?: RoleStatus;
  readonly tenantId: string | null;
}

export interface RoleInsertRow {
  description: string | null;
  key: string;
  name: string;
  scope: RoleScope;
  status: RoleStatus;
  tenantId: string | null;
}

export type RoleRecord = RoleInsertRow;

/** Role key, tenantId, and scope are immutable after create. */
export type RoleUpdatePatch = Partial<
  Pick<RoleInsertRow, "name" | "description" | "status">
> & {
  readonly key?: never;
  readonly tenantId?: never;
  readonly scope?: never;
};

export function buildRoleInsertRow(input: RoleWriteInput): RoleInsertRow {
  assertRoleScopeMatchesTenant(input.scope, input.tenantId);

  return {
    tenantId: input.tenantId,
    key: assertRoleKey(input.key),
    name: input.name.trim(),
    description: input.description?.trim() || null,
    scope: input.scope,
    status: input.status ?? "active",
  };
}

export function buildRoleUpdatePatch(input: RoleUpdatePatch): RoleUpdatePatch {
  if ("key" in input && input.key !== undefined) {
    throw new RoleKeyImmutableError("Role key is immutable after create.");
  }
  if ("tenantId" in input && input.tenantId !== undefined) {
    throw new RoleKeyImmutableError("Role tenantId is immutable after create.");
  }
  if ("scope" in input && input.scope !== undefined) {
    throw new RoleKeyImmutableError("Role scope is immutable after create.");
  }

  const patch: RoleUpdatePatch = {};

  if (input.name !== undefined) {
    patch.name = input.name.trim();
  }
  if (input.description !== undefined) {
    patch.description = input.description?.trim() || null;
  }
  if (input.status !== undefined) {
    patch.status = input.status;
  }

  return patch;
}
