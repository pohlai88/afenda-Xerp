/** Shared runtime guards for JSON wire contracts (PAS-006). */

export function isWireRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

export function isOptionalNonEmptyString(
  value: unknown
): value is string | undefined {
  return value === undefined || isNonEmptyString(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isOptionalBoolean(
  value: unknown
): value is boolean | undefined {
  return value === undefined || typeof value === "boolean";
}

export function isStringMemberOf<T extends string>(
  value: unknown,
  allowed: readonly T[]
): value is T {
  return (
    typeof value === "string" && (allowed as readonly string[]).includes(value)
  );
}

export function isReadonlyArrayOf<T>(
  value: unknown,
  guard: (item: unknown) => item is T
): value is readonly T[] {
  return Array.isArray(value) && value.every(guard);
}
