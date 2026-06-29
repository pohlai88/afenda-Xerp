/**
 * PAS-006D P06-008-R1 — metadata binding waiver wire contract (NO path).
 */

export type MetadataBindingWaiverReason =
  | "chrome-navigation"
  | "dialog-shell-only"
  | "static-error-surface"
  | "layout-trigger-only";

export interface MetadataBindingWaiverWire {
  readonly blockId: string;
  readonly notes: string;
  readonly reason: MetadataBindingWaiverReason;
  readonly waiverId: string;
}

const WAIVER_REASONS = [
  "chrome-navigation",
  "dialog-shell-only",
  "static-error-surface",
  "layout-trigger-only",
] as const satisfies readonly MetadataBindingWaiverReason[];

export function isMetadataBindingWaiverReason(
  value: string
): value is MetadataBindingWaiverReason {
  return (WAIVER_REASONS as readonly string[]).includes(value);
}

export function isMetadataBindingWaiverWire(
  value: unknown
): value is MetadataBindingWaiverWire {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record["blockId"] === "string" &&
    typeof record["waiverId"] === "string" &&
    typeof record["notes"] === "string" &&
    typeof record["reason"] === "string" &&
    isMetadataBindingWaiverReason(record["reason"])
  );
}
