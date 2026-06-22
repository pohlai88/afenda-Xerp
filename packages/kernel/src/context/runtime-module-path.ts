/**
 * Normalizes dot-separated runtime module paths (Surface, Workflow).
 * Accepts legacy slash, hyphen, and underscore separators before validation.
 */
export type RuntimeModulePath = string;

const RUNTIME_MODULE_PATH_PATTERN =
  /^[a-z][a-z0-9]*(?:[._][a-z0-9]+)*$/;

export function normalizeRuntimeModulePath(
  value: string | null | undefined
): RuntimeModulePath | null {
  if (!value) {
    return null;
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[/\\]+/g, ".")
    .replace(/[-_\s]+/g, ".")
    .replace(/\.+/g, ".")
    .replace(/^\.+|\.+$/g, "");

  if (!normalized || !RUNTIME_MODULE_PATH_PATTERN.test(normalized)) {
    return null;
  }

  return normalized;
}
