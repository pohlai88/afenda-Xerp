import {
  extractPermissionAction,
  extractPermissionDomain,
  isRegisteredPermissionKey,
  PERMISSION_REGISTRY,
  type RegisteredPermissionKey,
} from "@afenda/permissions";

export interface PermissionRegistryEntry {
  readonly action: string;
  readonly domain: string;
  readonly key: RegisteredPermissionKey;
}

function collectPermissionRegistryEntries(
  value: unknown,
  entries: PermissionRegistryEntry[]
): void {
  if (typeof value === "string") {
    if (!isRegisteredPermissionKey(value)) {
      return;
    }

    entries.push({
      domain: extractPermissionDomain(value),
      action: extractPermissionAction(value),
      key: value,
    });
    return;
  }

  if (value && typeof value === "object") {
    for (const nested of Object.values(value)) {
      collectPermissionRegistryEntries(nested, entries);
    }
  }
}

export function listPermissionRegistryEntries(): readonly PermissionRegistryEntry[] {
  const entries: PermissionRegistryEntry[] = [];
  collectPermissionRegistryEntries(PERMISSION_REGISTRY, entries);
  return entries.sort((left, right) => left.key.localeCompare(right.key));
}
