import { assertWireTenantExtensionBoundaryVocabulary } from "./tenant-extension-boundary.assert.js";
import type {
  TenantExtensionBoundaryVocabulary,
  WireTenantExtensionBoundaryVocabulary,
} from "./tenant-extension-boundary.contract.js";

function parseValidatedTenantExtensionBoundaryVocabulary(
  value: WireTenantExtensionBoundaryVocabulary
): TenantExtensionBoundaryVocabulary {
  return {
    kind: value.kind as TenantExtensionBoundaryVocabulary["kind"],
    fieldKey: value.fieldKey.trim(),
  };
}

export function parseTenantExtensionBoundaryVocabulary(
  value: WireTenantExtensionBoundaryVocabulary
): TenantExtensionBoundaryVocabulary {
  assertWireTenantExtensionBoundaryVocabulary(value);
  return parseValidatedTenantExtensionBoundaryVocabulary(value);
}

export function parseUnknownTenantExtensionBoundaryVocabulary(
  value: unknown
): TenantExtensionBoundaryVocabulary {
  assertWireTenantExtensionBoundaryVocabulary(value);
  return parseValidatedTenantExtensionBoundaryVocabulary(value);
}

export function serializeTenantExtensionBoundaryVocabulary(
  value: TenantExtensionBoundaryVocabulary
): WireTenantExtensionBoundaryVocabulary {
  return {
    kind: value.kind,
    fieldKey: value.fieldKey,
  };
}
