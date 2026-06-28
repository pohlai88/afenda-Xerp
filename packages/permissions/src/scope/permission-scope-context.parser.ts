import { assertWirePermissionScopeContext } from "./permission-scope-context.assert.js";
import type {
  PermissionScopeContext,
  PermissionScopeWireContext,
} from "./permission-scope-context.contract.js";

function parseValidatedPermissionScopeContext(
  value: PermissionScopeWireContext
): PermissionScopeContext {
  return {
    grantScopeType: value.grantScopeType,
    tenantId: value.tenantId,
    entityGroupId: value.entityGroupId,
    companyId: value.companyId,
    organizationId: value.organizationId,
    teamId: value.teamId,
    projectId: value.projectId,
    membershipId: value.membershipId,
    roleId: value.roleId,
    elevations: value.elevations,
  };
}

/** Validates wire ingress and returns the canonical resolved permission scope shape. */
export function parsePermissionScopeContext(
  value: PermissionScopeWireContext
): PermissionScopeContext {
  assertWirePermissionScopeContext(value);
  return parseValidatedPermissionScopeContext(value);
}

/** JSON/API ingress — assert unknown wire, then return resolved scope (plain string ids). */
export function parseUnknownPermissionScopeContext(
  value: unknown
): PermissionScopeContext {
  assertWirePermissionScopeContext(value);
  return parseValidatedPermissionScopeContext(value);
}

export function normalizePermissionScopeContextForWire(
  value: PermissionScopeContext
): PermissionScopeWireContext {
  return {
    grantScopeType: value.grantScopeType,
    tenantId: value.tenantId,
    entityGroupId: value.entityGroupId,
    companyId: value.companyId,
    organizationId: value.organizationId,
    teamId: value.teamId,
    projectId: value.projectId,
    membershipId: value.membershipId,
    roleId: value.roleId,
    elevations: value.elevations,
  };
}

/** Wire egress alias — same contract as `normalizePermissionScopeContextForWire`. */
export function serializePermissionScopeContext(
  value: PermissionScopeContext
): PermissionScopeWireContext {
  return normalizePermissionScopeContextForWire(value);
}
