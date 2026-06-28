/**
 * PAS-001 §4.1.13 / ADR-0023 — tenant human reference wire parser tier.
 */

import { assertTenantHumanReferenceWireText } from "./tenant-human-reference.assert.js";
import type {
  TenantHumanReference,
  TenantHumanReferenceScope,
} from "./tenant-human-reference.contract.js";
import { TENANT_HUMAN_REFERENCE_SCOPE_DEFINITIONS } from "./tenant-human-reference.contract.js";

export function parseTenantHumanReferenceWireForScope<
  TScope extends TenantHumanReferenceScope,
>(scope: TScope, wire: string): TenantHumanReference<TScope> {
  const definition = TENANT_HUMAN_REFERENCE_SCOPE_DEFINITIONS[scope];
  const validated = assertTenantHumanReferenceWireText(wire, definition.label);
  return validated as TenantHumanReference<TScope>;
}

export function parseOptionalTenantHumanReferenceWireForScope<
  TScope extends TenantHumanReferenceScope,
>(
  scope: TScope,
  wire: string | null | undefined
): TenantHumanReference<TScope> | null {
  if (wire == null) {
    return null;
  }

  return parseTenantHumanReferenceWireForScope(scope, wire);
}

/** Unknown wire ingress — assert shape, then apply scoped parse*. */
export function parseUnknownTenantHumanReferenceWireForScope<
  TScope extends TenantHumanReferenceScope,
>(scope: TScope, value: unknown): TenantHumanReference<TScope> {
  if (typeof value !== "string") {
    throw new Error(
      `${TENANT_HUMAN_REFERENCE_SCOPE_DEFINITIONS[scope].label} must be a string.`
    );
  }

  return parseTenantHumanReferenceWireForScope(scope, value);
}
