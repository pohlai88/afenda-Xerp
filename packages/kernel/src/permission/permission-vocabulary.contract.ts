/**
 * PAS-001 §8 — permission model vocabulary authority and ownership metadata.
 * Vocabulary only — no evaluation, registry checks, HTTP mapping, or persistence.
 */

import {
  isPermissionAction,
  type PermissionAction,
} from "./permission-action.contract.js";
import {
  isPermissionModelScope,
  type PermissionModelScope,
} from "./permission-model-scope.contract.js";

export const PERMISSION_VOCABULARY_AUTHORITY = {
  pas: "PAS-001",
  section: "8",
} as const;

export const PERMISSION_VOCABULARY_OWNERSHIP = [
  { concern: "permission model vocabulary", owner: "kernel" },
  { concern: "registry and checks", owner: "@afenda/permissions" },
  { concern: "role/permission storage", owner: "Database" },
  { concern: "route/action enforcement", owner: "ERP" },
  { concern: "HTTP error mapping", owner: "API governance" },
] as const;

export function getPermissionAction(value: string): PermissionAction | null {
  return isPermissionAction(value) ? value : null;
}

export function getPermissionModelScope(
  value: string
): PermissionModelScope | null {
  return isPermissionModelScope(value) ? value : null;
}
