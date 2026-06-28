/**
 * PAS-001 §4.1.13 / ADR-0023 — tenant human reference wire assert tier.
 *
 * Rejects malformed wire before scoped branding in parser/contract.
 */

import { rejectIfCanonicalEnterpriseId } from "../primitives/primitive-brand.helpers.js";

export const TENANT_HUMAN_REFERENCE_MAX_WIRE_LENGTH = 64 as const;

/** Unbranded wire carrier — JSON-safe string after assert. */
export type WireTenantHumanReference = string;

export function assertTenantHumanReferenceWireText(
  value: string,
  label: string
): WireTenantHumanReference {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error(`${label} is required.`);
  }

  rejectIfCanonicalEnterpriseId(trimmed, label);

  if (trimmed.length > TENANT_HUMAN_REFERENCE_MAX_WIRE_LENGTH) {
    throw new Error(`${label} must not exceed 64 characters.`);
  }

  return trimmed;
}
