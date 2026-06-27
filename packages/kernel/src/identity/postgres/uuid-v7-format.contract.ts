/**
 * PAS-001 §4.1.9 / §4.1.12 / ADR-0022 — RFC 9562 UUID v7 wire format authority.
 *
 * PostgreSQL `uuid_generate_v7()` and platform `id uuid` PK columns use hyphenated
 * lowercase wire form at audit/event trust boundaries.
 */

/** RFC 9562 UUID v7 — version nibble 7, variant 10xx (8/9/a/b). */
export const UUID_V7_WIRE_PATTERN_SOURCE =
  "^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$" as const;

export const UUID_V7_WIRE_PATTERN = new RegExp(
  UUID_V7_WIRE_PATTERN_SOURCE,
  "i"
);

export function isUuidV7WireForm(value: string): boolean {
  return UUID_V7_WIRE_PATTERN.test(value);
}

export function assertUuidV7WireForm(value: string, label: string): string {
  if (!isUuidV7WireForm(value)) {
    throw new Error(`${label} has invalid internal entity PK format.`);
  }

  return value.toLowerCase();
}
