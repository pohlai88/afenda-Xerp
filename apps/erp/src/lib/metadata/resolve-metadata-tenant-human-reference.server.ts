/**
 * ERP metadata ingress — tenant human reference trust boundary (PAS-001 §4.1.13).
 *
 * Metadata UI carries wire strings; ERP applies kernel parse* / normalize* here.
 */

import {
  normalizeTenantHumanReferenceForWire,
  parseOptionalTenantHumanReferenceForScope,
  parseTenantHumanReferenceForScope,
  type TenantHumanReference,
} from "@afenda/kernel";
import type {
  MetadataTenantHumanReferenceFieldBinding,
  MetadataTenantHumanReferenceScope,
  MetadataTenantHumanReferenceWireValue,
} from "@afenda/ui-composition";

export function parseMetadataTenantHumanReferenceAtBoundary<
  TScope extends MetadataTenantHumanReferenceScope,
>(
  scope: TScope,
  wire: MetadataTenantHumanReferenceWireValue
): TenantHumanReference<TScope> {
  return parseTenantHumanReferenceForScope(
    scope,
    wire
  ) as TenantHumanReference<TScope>;
}

export function parseOptionalMetadataTenantHumanReferenceAtBoundary<
  TScope extends MetadataTenantHumanReferenceScope,
>(
  scope: TScope,
  wire: MetadataTenantHumanReferenceWireValue | null | undefined
): TenantHumanReference<TScope> | null {
  return parseOptionalTenantHumanReferenceForScope(
    scope,
    wire
  ) as TenantHumanReference<TScope> | null;
}

export function normalizeMetadataTenantHumanReferenceAtBoundary<
  TScope extends MetadataTenantHumanReferenceScope,
>(
  _scope: TScope,
  value: TenantHumanReference<TScope>
): MetadataTenantHumanReferenceWireValue {
  return normalizeTenantHumanReferenceForWire(value);
}

export function parseMetadataTenantHumanReferenceFieldBindingAtBoundary<
  TScope extends MetadataTenantHumanReferenceScope,
>(binding: MetadataTenantHumanReferenceFieldBinding & { scope: TScope }) {
  return parseMetadataTenantHumanReferenceAtBoundary(
    binding.scope,
    binding.wireValue
  );
}

export function serializeMetadataTenantHumanReferenceFieldBindingAtBoundary<
  TScope extends MetadataTenantHumanReferenceScope,
>(
  scope: TScope,
  value: TenantHumanReference<TScope>
): MetadataTenantHumanReferenceFieldBinding {
  return {
    scope,
    wireValue: normalizeMetadataTenantHumanReferenceAtBoundary(scope, value),
  };
}
