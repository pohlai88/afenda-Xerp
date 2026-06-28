/**
 * PAS-001B B103 — document ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/document`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed document-domain export surface.

export {
  ATTACHMENT_ROLES,
  type AttachmentRole,
  isAttachmentRole,
} from "./attachment-role.contract.js";
export {
  DOCUMENT_AUDIT_ACTIONS,
  type DocumentAuditAction,
  isDocumentAuditAction,
  parseDocumentAuditAction,
} from "./document-audit-actions.contract.js";
export {
  DOCUMENT_AUTHORITY_FINGERPRINT,
  DOCUMENT_AUTHORITY_PAS,
  DOCUMENT_CONTRACTS_OWNER,
  DOCUMENT_PACKAGE_LIFECYCLE,
  DOCUMENT_PACKAGE_LIFECYCLE_PHASES,
  DOCUMENT_REGISTRY_ID,
  type DocumentPackageLifecyclePhase,
  isDocumentPackageLifecyclePhase,
} from "./document-authority.contract.js";
export {
  DOCUMENT_CLASSES,
  type DocumentClass,
  isDocumentClass,
} from "./document-class.contract.js";
export {
  DOCUMENT_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  DOCUMENT_DOMAIN_VOCABULARY_POLICY,
  type DocumentDomainProhibitedRuntimeSurface,
} from "./document-domain-vocabulary.policy.js";
export {
  type assertDocumentDomainVocabularyRegistryIntegrity,
  DOCUMENT_DOMAIN_AUDIT_VOCABULARY,
  DOCUMENT_DOMAIN_AUTHORITY_METADATA,
  DOCUMENT_DOMAIN_BRANDED_ID_TYPE_NAMES,
  DOCUMENT_DOMAIN_BRANDED_IDS,
  DOCUMENT_DOMAIN_CLOSED_VOCABULARIES,
  DOCUMENT_DOMAIN_PERMISSION_VOCABULARY,
  DOCUMENT_DOMAIN_VOCABULARY_REGISTRY,
  DOCUMENT_DOMAIN_VOCABULARY_REGISTRY_ID,
  DOCUMENT_DOMAIN_WIRE_CONTEXT,
  type DocumentDomainBrandedIdEntry,
  type DocumentDomainClosedVocabularyEntry,
  type DocumentDomainVocabularyKind,
} from "./document-domain-vocabulary.registry.js";
export type {
  assertDocumentDomainWireContextJsonSerializable,
  DocumentDomainWireContext,
} from "./document-domain-wire-context.contract.js";
export {
  type BusinessDocumentId,
  brandBusinessDocumentId,
  brandDocumentRetentionCaseId,
  brandFiscalAttachmentId,
  type DocumentRetentionCaseId,
  type FiscalAttachmentId,
  toBusinessDocumentId,
  toDocumentRetentionCaseId,
  toFiscalAttachmentId,
} from "./document-id.contract.js";
export {
  DOCUMENT_LIFECYCLE_STATUSES,
  type DocumentLifecycleStatus,
  isDocumentLifecycleStatus,
} from "./document-lifecycle-status.contract.js";
export {
  DOCUMENT_PERMISSION_ACTIONS,
  DOCUMENT_PERMISSION_DOMAINS,
  DOCUMENT_PERMISSION_KEY_VOCABULARY,
  type DocumentPermissionAction,
  type DocumentPermissionDomain,
  type DocumentPermissionKey,
  toDocumentPermissionKey,
} from "./document-permission-vocabulary.contract.js";
export {
  isRetentionPolicy,
  RETENTION_POLICIES,
  type RetentionPolicy,
} from "./retention-policy.contract.js";
