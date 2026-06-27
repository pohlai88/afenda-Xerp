/** Permission action vocabulary — evaluation lives in @afenda/permissions. */

export const PERMISSION_ACTIONS = [
  "create",
  "read",
  "update",
  "delete",
  "approve",
  "export",
  "import",
  "manage",
  "assign",
  "revoke",
] as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

export function isPermissionAction(value: string): value is PermissionAction {
  return (PERMISSION_ACTIONS as readonly string[]).includes(value);
}
