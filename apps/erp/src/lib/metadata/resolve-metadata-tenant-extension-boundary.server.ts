import {
  assertTenantExtensionFieldKeyDoesNotForkKernelBrand,
  parseUnknownTenantExtensionBoundaryVocabulary,
  type TenantExtensionBoundaryVocabulary,
} from "@afenda/kernel/context";

/**
 * Metadata ingress — extension field keys must not mimic canonical enterprise IDs (PAS-001 B108).
 */
export function assertMetadataTenantExtensionFieldKey(fieldKey: string): void {
  assertTenantExtensionFieldKeyDoesNotForkKernelBrand(
    fieldKey,
    "metadataExtensionFieldKey"
  );
}

/** Parses wire extension boundary vocabulary at metadata trust boundary. */
export function parseMetadataTenantExtensionBoundaryVocabulary(
  value: unknown
): TenantExtensionBoundaryVocabulary {
  return parseUnknownTenantExtensionBoundaryVocabulary(value);
}
