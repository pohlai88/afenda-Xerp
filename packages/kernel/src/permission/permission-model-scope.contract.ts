/**
 * PAS §8 permission model scope vocabulary — distinct from grant-scope words in
 * `context/permission-grant-vocabulary.contract.ts` (membership/RLS boundaries).
 */

export const PERMISSION_MODEL_SCOPES = [
  "tenant",
  "entity_group",
  "legal_entity",
  "organization_unit",
  "team",
  "project",
  "own_data",
  "assigned",
  "global",
] as const;

export type PermissionModelScope = (typeof PERMISSION_MODEL_SCOPES)[number];

/**
 * PAS §8 model scope words that map to different grant-scope vocabulary in context/.
 * `@afenda/permissions` owns runtime grant resolution — kernel documents aliases only.
 */
export const PERMISSION_MODEL_SCOPE_GRANT_ALIASES = {
  legal_entity: "company",
  organization_unit: "organization",
} as const satisfies Partial<
  Record<PermissionModelScope, "company" | "organization">
>;

export function isPermissionModelScope(
  value: string
): value is PermissionModelScope {
  return (PERMISSION_MODEL_SCOPES as readonly string[]).includes(value);
}
