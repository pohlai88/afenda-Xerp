import {
  normalizeCompanyIdForWire,
  normalizeEntityGroupIdForWire,
  normalizeMembershipIdForWire,
  normalizeOrganizationIdForWire,
  normalizeProjectIdForWire,
  normalizeRoleIdForWire,
  normalizeTenantIdForWire,
  parseMembershipId,
  parseOptionalCompanyId,
  parseOptionalEntityGroupId,
  parseOptionalOrganizationId,
  parseOptionalProjectId,
  parseOrganizationId,
  parseRoleId,
  parseTeamId,
  parseTenantId,
  toOrganizationId,
  toTeamId,
} from "../identity/index.js";
import { assertWirePermissionScopeContext } from "./permission-scope-context.assert.js";
import type {
  PermissionScopeContext,
  PermissionScopeWireContext,
} from "./permission-scope-context.contract.js";
import type { TeamAuthorityId } from "./team-context.contract.js";

function requiredWireString(value: string | null, label: string): string {
  if (value === null) {
    throw new Error(
      `${label} wire normalization produced null from required branded value.`
    );
  }

  return value;
}

function parseOptionalTeamAuthorityId(
  value: string | null
): TeamAuthorityId | null {
  if (value === null) {
    return null;
  }

  try {
    return parseTeamId(value);
  } catch {
    return parseOrganizationId(value);
  }
}

function normalizeTeamAuthorityIdForWire(value: TeamAuthorityId): string {
  const raw = `${value}`;

  if (raw.startsWith("org_")) {
    return toOrganizationId(parseOrganizationId(raw));
  }

  return toTeamId(parseTeamId(raw));
}

function brandValidatedPermissionScopeContext(
  value: PermissionScopeWireContext
): PermissionScopeContext {
  return {
    grantScopeType: value.grantScopeType,
    tenantId: parseTenantId(value.tenantId),
    entityGroupId: parseOptionalEntityGroupId(value.entityGroupId),
    companyId: parseOptionalCompanyId(value.companyId),
    organizationId: parseOptionalOrganizationId(value.organizationId),
    teamId: parseOptionalTeamAuthorityId(value.teamId),
    projectId: parseOptionalProjectId(value.projectId),
    membershipId: parseMembershipId(value.membershipId),
    roleId: parseRoleId(value.roleId),
    elevations: value.elevations,
  };
}

/**
 * Projects validated permission-scope wire into branded kernel `OperatingContext` fields.
 * Wire assert/parser canonical owner: `@afenda/permissions`.
 */
export function brandPermissionScopeContextFromWire(
  value: PermissionScopeWireContext
): PermissionScopeContext {
  assertWirePermissionScopeContext(value);
  return brandValidatedPermissionScopeContext(value);
}

/** JSON/API ingress — assert wire, then brand enterprise ids for `OperatingContext`. */
export function brandPermissionScopeContextFromUnknownWire(
  value: unknown
): PermissionScopeContext {
  assertWirePermissionScopeContext(value);
  return brandValidatedPermissionScopeContext(value);
}

/** @deprecated Use `brandPermissionScopeContextFromWire` — kernel branding projection only. */
export function parsePermissionScopeContext(
  value: PermissionScopeWireContext
): PermissionScopeContext {
  return brandPermissionScopeContextFromWire(value);
}

/** @deprecated Use `brandPermissionScopeContextFromUnknownWire` — kernel branding projection only. */
export function parseUnknownPermissionScopeContext(
  value: unknown
): PermissionScopeContext {
  return brandPermissionScopeContextFromUnknownWire(value);
}

export function normalizePermissionScopeContextForWire(
  value: PermissionScopeContext
): PermissionScopeWireContext {
  const teamIdWire =
    value.teamId === null
      ? null
      : normalizeTeamAuthorityIdForWire(value.teamId);

  return {
    grantScopeType: value.grantScopeType,
    tenantId: requiredWireString(
      normalizeTenantIdForWire(value.tenantId),
      "tenantId"
    ),
    entityGroupId:
      value.entityGroupId === null
        ? null
        : normalizeEntityGroupIdForWire(value.entityGroupId),
    companyId: normalizeCompanyIdForWire(value.companyId),
    organizationId: normalizeOrganizationIdForWire(value.organizationId),
    teamId: teamIdWire,
    projectId: normalizeProjectIdForWire(value.projectId),
    membershipId: requiredWireString(
      normalizeMembershipIdForWire(value.membershipId),
      "membershipId"
    ),
    roleId: requiredWireString(normalizeRoleIdForWire(value.roleId), "roleId"),
    elevations: value.elevations,
  };
}

/** Wire egress alias — same contract as `normalizePermissionScopeContextForWire`. */
export function serializePermissionScopeContext(
  value: PermissionScopeContext
): PermissionScopeWireContext {
  return normalizePermissionScopeContextForWire(value);
}
