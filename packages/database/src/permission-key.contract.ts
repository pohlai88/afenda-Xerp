/**
 * Canonical permission key shape — shared primitive for catalog and authz.
 *
 * Table: `schema/permission.schema.ts`
 * Catalog writes: `permission/permission.service.ts`
 */
export type PermissionKey = string & {
  readonly __permissionKeyBrand: unique symbol;
};

const PERMISSION_KEY_PATTERN = /^[a-z][a-z0-9_]*\.[a-z][a-z0-9_]*$/u;
const PERMISSION_SEGMENT_PATTERN = /^[a-z][a-z0-9_]*$/u;
const MAX_PERMISSION_SEGMENT_LENGTH = 64;

export class InvalidPermissionKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPermissionKeyError";
  }
}

function assertPermissionSegment(value: string, label: string): void {
  if (!value) {
    throw new InvalidPermissionKeyError(
      `Permission ${label} must be non-empty.`
    );
  }

  if (value.length > MAX_PERMISSION_SEGMENT_LENGTH) {
    throw new InvalidPermissionKeyError(
      `Permission ${label} must be ${MAX_PERMISSION_SEGMENT_LENGTH} characters or less.`
    );
  }

  if (!PERMISSION_SEGMENT_PATTERN.test(value)) {
    throw new InvalidPermissionKeyError(
      `Permission ${label} must use lowercase snake_case only.`
    );
  }
}

function validatePermissionKeyCandidate(value: string): boolean {
  if (!PERMISSION_KEY_PATTERN.test(value)) {
    return false;
  }

  const dotIndex = value.indexOf(".");
  if (dotIndex <= 0 || dotIndex === value.length - 1) {
    return false;
  }

  const domain = value.slice(0, dotIndex);
  const action = value.slice(dotIndex + 1);

  try {
    assertPermissionSegment(domain, "domain");
    assertPermissionSegment(action, "action");
  } catch {
    return false;
  }

  return true;
}

export function isPermissionKey(value: string): value is PermissionKey {
  return validatePermissionKeyCandidate(value.trim());
}

export function assertPermissionKey(value: string): PermissionKey {
  const trimmed = value.trim();

  if (!isPermissionKey(trimmed)) {
    throw new InvalidPermissionKeyError(
      `Invalid permission key "${value}". Expected "{domain}.{action}" with lowercase snake_case segments.`
    );
  }

  return trimmed;
}

export function createPermissionKey(
  domain: string,
  action: string
): PermissionKey {
  const normalizedDomain = domain.trim().toLowerCase();
  const normalizedAction = action.trim().toLowerCase();

  assertPermissionSegment(normalizedDomain, "domain");
  assertPermissionSegment(normalizedAction, "action");

  return assertPermissionKey(`${normalizedDomain}.${normalizedAction}`);
}
