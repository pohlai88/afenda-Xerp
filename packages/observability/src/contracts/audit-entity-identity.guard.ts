/**
 * PAS-001 §4.1.9 — local dual-field guards for @afenda/observability.
 *
 * Mirrors kernel `parseInternalEntityPk` semantics without a package dependency
 * (architecture: observability approvedRuntimeByPackage is empty).
 */

import { AuditValidationError } from "./audit-validation.error.js";

/** Aligns with kernel CANONICAL_ID_PATTERN — format tier only. */
const CANONICAL_ENTERPRISE_ID_PATTERN = /^[a-z]{3}_[0-9A-HJKMNP-TV-Z]{26}$/;

const TENANT_HUMAN_REFERENCE_PATTERN = /^[A-Z][A-Z0-9]{0,9}-[A-Z0-9]+$/;

/** Parity with kernel `UUID_V7_WIRE_PATTERN_SOURCE` (RFC 9562 UUID v7). */
const UUID_V7_WIRE_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type AuditInternalEntityPkLabel = "EntityPk" | "TenantPk";

export function assertAuditInternalEntityPkWire(
  value: string,
  label: AuditInternalEntityPkLabel
): string {
  const raw = value.trim();

  if (!raw) {
    throw new AuditValidationError(`${label} is required.`);
  }

  if (CANONICAL_ENTERPRISE_ID_PATTERN.test(raw)) {
    throw new AuditValidationError(
      `${label} must not be a canonical enterprise ID.`
    );
  }

  if (TENANT_HUMAN_REFERENCE_PATTERN.test(raw)) {
    throw new AuditValidationError(
      `${label} must not be a tenant human reference.`
    );
  }

  if (!UUID_V7_WIRE_PATTERN.test(raw)) {
    throw new AuditValidationError(
      `${label} has invalid internal entity PK format.`
    );
  }

  return raw.toLowerCase();
}
