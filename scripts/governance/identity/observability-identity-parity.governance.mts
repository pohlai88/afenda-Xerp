/**
 * PAS-001 §4.1.9 — observability ↔ kernel audit wire pattern parity.
 */

import { CANONICAL_ID_PATTERN_SOURCE } from "../../../packages/kernel/src/identity/canonical/canonical-id-format.contract.ts";
import { UUID_V7_WIRE_PATTERN_SOURCE } from "../../../packages/kernel/src/identity/postgres/index.ts";
import { TENANT_HUMAN_REFERENCE_PATTERN_SOURCE } from "../../../packages/kernel/src/identity/primitives/primitive-brand.helpers.ts";
import {
  AUDIT_CANONICAL_ENTERPRISE_ID_PATTERN_SOURCE,
  AUDIT_TENANT_HUMAN_REFERENCE_PATTERN_SOURCE,
  AUDIT_UUID_V7_WIRE_PATTERN_SOURCE,
} from "../../../packages/observability/src/contracts/audit-entity-wire-patterns.contract.ts";

export interface ObservabilityIdentityParityViolation {
  readonly field: string;
  readonly kernel: string;
  readonly observability: string;
}

export function checkObservabilityIdentityParity(): ObservabilityIdentityParityViolation[] {
  const violations: ObservabilityIdentityParityViolation[] = [];

  const pairs: Array<{
    field: string;
    kernel: string;
    observability: string;
  }> = [
    {
      field: "canonicalEnterpriseId",
      kernel: CANONICAL_ID_PATTERN_SOURCE,
      observability: AUDIT_CANONICAL_ENTERPRISE_ID_PATTERN_SOURCE,
    },
    {
      field: "uuidV7Wire",
      kernel: UUID_V7_WIRE_PATTERN_SOURCE,
      observability: AUDIT_UUID_V7_WIRE_PATTERN_SOURCE,
    },
    {
      field: "tenantHumanReference",
      kernel: TENANT_HUMAN_REFERENCE_PATTERN_SOURCE,
      observability: AUDIT_TENANT_HUMAN_REFERENCE_PATTERN_SOURCE,
    },
  ];

  for (const { field, kernel, observability } of pairs) {
    if (kernel !== observability) {
      violations.push({ field, kernel, observability });
    }
  }

  return violations;
}

export function formatObservabilityIdentityParityViolations(
  violations: readonly ObservabilityIdentityParityViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map(
      (v) => `[${v.field}] kernel=${v.kernel} observability=${v.observability}`
    )
    .join("\n");
}
