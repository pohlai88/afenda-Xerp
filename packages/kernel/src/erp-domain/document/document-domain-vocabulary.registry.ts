import { ATTACHMENT_ROLES } from "./attachment-role.contract.js";
import {
  DOCUMENT_AUDIT_ACTIONS,
  type isDocumentAuditAction,
} from "./document-audit-actions.contract.js";
import {
  DOCUMENT_PACKAGE_LIFECYCLE,
  DOCUMENT_PACKAGE_LIFECYCLE_PHASES,
} from "./document-authority.contract.js";
import { DOCUMENT_CLASSES } from "./document-class.contract.js";
import { DOCUMENT_LIFECYCLE_STATUSES } from "./document-lifecycle-status.contract.js";
import {
  DOCUMENT_PERMISSION_DOMAINS,
  DOCUMENT_PERMISSION_KEY_VOCABULARY,
} from "./document-permission-vocabulary.contract.js";
import { RETENTION_POLICIES } from "./retention-policy.contract.js";

export const DOCUMENT_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-DOCUMENT" as const;

export type DocumentDomainVocabularyKind =
  | "closed-vocabulary"
  | "branded-id"
  | "wire-context"
  | "audit-vocabulary"
  | "permission-vocabulary"
  | "authority-metadata";

export interface DocumentDomainClosedVocabularyEntry {
  readonly constantExport: string;
  readonly contractFile: string;
  readonly id: string;
  readonly kind: "closed-vocabulary";
  readonly narrowerExport: string;
  readonly pasSection: "4.8";
  readonly typeExport: string;
  readonly valueCount: number;
}

export const DOCUMENT_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "document-class",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "document-class.contract.ts",
    constantExport: "DOCUMENT_CLASSES",
    typeExport: "DocumentClass",
    narrowerExport: "isDocumentClass",
    valueCount: DOCUMENT_CLASSES.length,
  },
  {
    id: "retention-policy",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "retention-policy.contract.ts",
    constantExport: "RETENTION_POLICIES",
    typeExport: "RetentionPolicy",
    narrowerExport: "isRetentionPolicy",
    valueCount: RETENTION_POLICIES.length,
  },
  {
    id: "document-lifecycle-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "document-lifecycle-status.contract.ts",
    constantExport: "DOCUMENT_LIFECYCLE_STATUSES",
    typeExport: "DocumentLifecycleStatus",
    narrowerExport: "isDocumentLifecycleStatus",
    valueCount: DOCUMENT_LIFECYCLE_STATUSES.length,
  },
  {
    id: "attachment-role",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "attachment-role.contract.ts",
    constantExport: "ATTACHMENT_ROLES",
    typeExport: "AttachmentRole",
    narrowerExport: "isAttachmentRole",
    valueCount: ATTACHMENT_ROLES.length,
  },
] as const satisfies readonly DocumentDomainClosedVocabularyEntry[];

export interface DocumentDomainBrandedIdEntry {
  readonly brandFunction: string;
  readonly forbiddenOnPlatformFloor: boolean;
  readonly toFunction: string;
  readonly typeName: string;
}

export const DOCUMENT_DOMAIN_BRANDED_IDS = [
  {
    typeName: "BusinessDocumentId",
    brandFunction: "brandBusinessDocumentId",
    toFunction: "toBusinessDocumentId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "DocumentRetentionCaseId",
    brandFunction: "brandDocumentRetentionCaseId",
    toFunction: "toDocumentRetentionCaseId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "FiscalAttachmentId",
    brandFunction: "brandFiscalAttachmentId",
    toFunction: "toFiscalAttachmentId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly DocumentDomainBrandedIdEntry[];

export const DOCUMENT_DOMAIN_BRANDED_ID_TYPE_NAMES =
  DOCUMENT_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const DOCUMENT_DOMAIN_WIRE_CONTEXT = {
  id: "document-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "document-domain-wire-context.contract.ts",
  typeExport: "DocumentDomainWireContext",
  assertExport: "assertDocumentDomainWireContextJsonSerializable",
} as const;

export const DOCUMENT_DOMAIN_AUDIT_VOCABULARY = {
  id: "document-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "document-audit-actions.contract.ts",
  constantExport: "DOCUMENT_AUDIT_ACTIONS",
  typeExport: "DocumentAuditAction",
  narrowerExport: "isDocumentAuditAction",
  valueCount: DOCUMENT_AUDIT_ACTIONS.length,
} as const;

export const DOCUMENT_DOMAIN_PERMISSION_VOCABULARY = {
  id: "document-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "document-permission-vocabulary.contract.ts",
  domainsExport: "DOCUMENT_PERMISSION_DOMAINS",
  keysExport: "DOCUMENT_PERMISSION_KEY_VOCABULARY",
  domainCount: DOCUMENT_PERMISSION_DOMAINS.length,
  keyCount: DOCUMENT_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const DOCUMENT_DOMAIN_AUTHORITY_METADATA = {
  id: "document-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "document-authority.contract.ts",
  lifecycleExport: "DOCUMENT_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "DOCUMENT_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: DOCUMENT_PACKAGE_LIFECYCLE,
  phaseCount: DOCUMENT_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const DOCUMENT_DOMAIN_VOCABULARY_REGISTRY = {
  id: DOCUMENT_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: DOCUMENT_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: DOCUMENT_DOMAIN_BRANDED_IDS,
  wireContext: DOCUMENT_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: DOCUMENT_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: DOCUMENT_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: DOCUMENT_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof DOCUMENT_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isDocumentAuditAction
  >[0]
    ? true
    : never;

export type assertDocumentDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
