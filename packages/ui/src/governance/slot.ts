import { SLOT_ROLES, type SlotContract, type SlotRole } from "./design-system";
import { enforceGovernanceOr } from "./dev-env";

const slotRoleSet = new Set<string>(SLOT_ROLES);

function formatSlotRoleViolation(role: string): string {
  return `TIP-004 slot policy violation. Unsupported slot role "${role}". Allowed roles: ${SLOT_ROLES.join(
    ", "
  )}. Components must use governed slot roles from @afenda/design-system only.`;
}

function formatSlotContractViolation(roles: readonly string[]): string {
  return `TIP-004 slot contract violation. Unsupported slot roles: ${roles.join(
    ", "
  )}. Allowed roles: ${SLOT_ROLES.join(", ")}.`;
}

export function getSlotRoles(): readonly SlotRole[] {
  return SLOT_ROLES;
}

export function isSlotRole(role: string): role is SlotRole {
  return slotRoleSet.has(role);
}

export function assertSlotRole(role: string): asserts role is SlotRole {
  if (!isSlotRole(role)) {
    throw new Error(formatSlotRoleViolation(role));
  }
}

export function resolveSlotRole(
  role: string | undefined,
  fallback: SlotRole = "root"
): SlotRole {
  if (!role) {
    return fallback;
  }

  if (!isSlotRole(role)) {
    return enforceGovernanceOr(formatSlotRoleViolation(role), fallback);
  }

  return role;
}

export function getUnknownSlotRoles(
  slots: readonly SlotContract[]
): readonly string[] {
  return slots.map((slot) => slot.role).filter((role) => !isSlotRole(role));
}

export function assertSlotContract(slots: readonly SlotContract[]): void {
  const unknownRoles = getUnknownSlotRoles(slots);

  if (unknownRoles.length > 0) {
    throw new Error(formatSlotContractViolation(unknownRoles));
  }
}
