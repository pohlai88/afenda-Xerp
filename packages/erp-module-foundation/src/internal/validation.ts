const MODULE_SLUG_PATTERN = /^[a-z][a-z0-9-]*$/;
const KV_ID_PATTERN = /^KV-[A-Z0-9]+(?:-[A-Z0-9]+)*$/;
const PERMISSION_KEY_PATTERN = /^[a-z][a-z0-9_]*\.[a-z][a-z0-9A-Z_]*$/;
const EVENT_NAME_PATTERN = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]+)+$/;

export function assertNonEmptyString(value: string, field: string): void {
  if (value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string`);
  }
}

export function assertModuleSlugFormat(value: string, field: string): void {
  assertNonEmptyString(value, field);
  if (!MODULE_SLUG_PATTERN.test(value)) {
    throw new Error(`${field} must be lowercase kebab-case — got "${value}"`);
  }
}

export function assertKvIdFormat(value: string): void {
  assertNonEmptyString(value, "kvId");
  if (!KV_ID_PATTERN.test(value)) {
    throw new Error(`kvId must match KV-* pattern — got "${value}"`);
  }
}

export function assertPermissionKeyFormat(value: string): void {
  assertNonEmptyString(value, "permissionKey");
  if (!PERMISSION_KEY_PATTERN.test(value)) {
    throw new Error(
      `permissionKey must match domain.action format — got "${value}"`
    );
  }
}

export function assertEventNameFormat(value: string): void {
  assertNonEmptyString(value, "event");
  if (!EVENT_NAME_PATTERN.test(value)) {
    throw new Error(
      `event must use dotted module-scoped naming — got "${value}"`
    );
  }
}

export function assertUniqueStrings(
  values: readonly string[],
  label: string
): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      throw new Error(`duplicate ${label}: "${value}"`);
    }
    seen.add(value);
  }
}

export function assertModuleKvParity(
  module: string,
  kvId: string,
  expectedModule: string,
  expectedKvId: string,
  artifact: string
): string | null {
  if (module !== expectedModule) {
    return `${artifact}: module "${module}" !== "${expectedModule}"`;
  }
  if (kvId !== expectedKvId) {
    return `${artifact}: kvId "${kvId}" !== "${expectedKvId}"`;
  }
  return null;
}
