/**
 * Metadata UI tenant human reference field contracts.
 *
 * Authority: structural mirror via `@afenda/ui-composition`; kernel parse* runs in ERP.
 */

export type {
  MetadataTenantHumanReferenceFieldBinding,
  MetadataTenantHumanReferenceScope,
  MetadataTenantHumanReferenceWireValue,
} from "@afenda/ui-composition";
export {
  assertMetadataTenantHumanReferenceWireShape,
  isMetadataTenantHumanReferenceFieldBinding,
  isMetadataTenantHumanReferenceScope,
  METADATA_TENANT_HUMAN_REFERENCE_MAX_WIRE_LENGTH,
  METADATA_TENANT_HUMAN_REFERENCE_SCOPE_COLUMNS,
  METADATA_TENANT_HUMAN_REFERENCE_SCOPE_LABELS,
  METADATA_TENANT_HUMAN_REFERENCE_SCOPES,
  normalizeMetadataTenantHumanReferenceWireValue,
  serializeMetadataTenantHumanReferenceFieldBinding,
} from "@afenda/ui-composition";
