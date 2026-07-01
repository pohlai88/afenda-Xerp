/**
 * @afenda.l1-contract-envelope metadata-binding
 * Role: Metadata binding waiver wire (blocks exempt from binding)
 * Family: metadata-binding · flat L1 wire
 * Relies on: wire-guard.helpers
 * Relied on by: registry/metadata-binding-waiver.registry, assert-metadata-binding-coverage
 * Refactored: 2026-07-01 · series flat-L1
 * Gate: check:studio-l1-contracts
 */

import { isNonEmptyString, isWireRecord } from "./wire-guard.helpers.js";

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
  if (!isWireRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value["blockId"]) &&
    isNonEmptyString(value["waiverId"]) &&
    isNonEmptyString(value["notes"]) &&
    typeof value["reason"] === "string" &&
    isMetadataBindingWaiverReason(value["reason"])
  );
}
