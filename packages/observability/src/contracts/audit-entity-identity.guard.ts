/**
 * PAS-001 §4.1.9 — local dual-field guards for @afenda/observability.
 *
 * Mirrors kernel `parseInternalEntityPk` semantics without a package dependency
 * (architecture: observability approvedRuntimeByPackage is empty).
 */

import {
  AUDIT_CANONICAL_ENTERPRISE_ID_PATTERN,
  AUDIT_TENANT_HUMAN_REFERENCE_PATTERN,
  AUDIT_UUID_V7_WIRE_PATTERN,
} from "./audit-entity-wire-patterns.contract.js";
import { AuditValidationError } from "./audit-validation.error.js";

export type AuditInternalEntityPkLabel = "EntityPk" | "TenantPk";

export function assertAuditInternalEntityPkWire(
  value: string,
  label: AuditInternalEntityPkLabel
): string {
  const raw = value.trim();

  if (!raw) {
    throw new AuditValidationError(`${label} is required.`);
  }

  if (AUDIT_CANONICAL_ENTERPRISE_ID_PATTERN.test(raw)) {
    throw new AuditValidationError(
      `${label} must not be a canonical enterprise ID.`
    );
  }

  if (AUDIT_TENANT_HUMAN_REFERENCE_PATTERN.test(raw)) {
    throw new AuditValidationError(
      `${label} must not be a tenant human reference.`
    );
  }

  if (!AUDIT_UUID_V7_WIRE_PATTERN.test(raw)) {
    throw new AuditValidationError(
      `${label} has invalid internal entity PK format.`
    );
  }

  return raw.toLowerCase();
}
