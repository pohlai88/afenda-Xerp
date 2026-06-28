/**
 * Metadata runtime permission model wire vocabulary (PAS-001 §8 consumer projection).
 *
 * Structural mirror of `@afenda/kernel` `PermissionModelWireDescriptor` — evaluation
 * remains in `@afenda/permissions`; ERP maps verified operating context at the trust boundary.
 */

export const METADATA_RUNTIME_PERMISSION_ACTIONS = [
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

export type MetadataRuntimePermissionAction =
  (typeof METADATA_RUNTIME_PERMISSION_ACTIONS)[number];

export const METADATA_RUNTIME_PERMISSION_MODEL_SCOPES = [
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

export type MetadataRuntimePermissionModelScope =
  (typeof METADATA_RUNTIME_PERMISSION_MODEL_SCOPES)[number];

/** JSON-safe permission model descriptor carrier for metadata runtime and diagnostics. */
export interface MetadataRuntimePermissionModelDescriptor {
  readonly action: MetadataRuntimePermissionAction;
  readonly module: string;
  readonly scope: MetadataRuntimePermissionModelScope;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNonEmptyModule(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isMetadataRuntimePermissionAction(
  value: string
): value is MetadataRuntimePermissionAction {
  return (METADATA_RUNTIME_PERMISSION_ACTIONS as readonly string[]).includes(
    value
  );
}

export function isMetadataRuntimePermissionModelScope(
  value: string
): value is MetadataRuntimePermissionModelScope {
  return (
    METADATA_RUNTIME_PERMISSION_MODEL_SCOPES as readonly string[]
  ).includes(value);
}

export function isMetadataRuntimePermissionModelDescriptor(
  value: unknown
): value is MetadataRuntimePermissionModelDescriptor {
  if (!isRecord(value)) {
    return false;
  }

  const moduleValue = value["module"];
  const action = value["action"];
  const scope = value["scope"];

  if (!isNonEmptyModule(moduleValue)) {
    return false;
  }

  if (
    typeof action !== "string" ||
    !isMetadataRuntimePermissionAction(action)
  ) {
    return false;
  }

  if (
    typeof scope !== "string" ||
    !isMetadataRuntimePermissionModelScope(scope)
  ) {
    return false;
  }

  return true;
}

/** Formats `module.action@scope` for diagnostics surfaces. */
export function formatMetadataRuntimePermissionModelDescriptor(
  descriptor: MetadataRuntimePermissionModelDescriptor
): string {
  return `${descriptor.module}.${descriptor.action}@${descriptor.scope}`;
}

export function formatMetadataRuntimePermissionModelDescriptors(
  descriptors: readonly MetadataRuntimePermissionModelDescriptor[]
): string {
  return descriptors
    .map(formatMetadataRuntimePermissionModelDescriptor)
    .join(", ");
}
