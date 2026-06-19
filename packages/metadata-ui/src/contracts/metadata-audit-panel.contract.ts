export const METADATA_AUDIT_EVIDENCE_TYPES = [
  "actor",
  "permission",
  "policy",
  "timestamp",
  "target",
] as const;

export type MetadataAuditEvidenceType =
  (typeof METADATA_AUDIT_EVIDENCE_TYPES)[number];

export interface MetadataAuditField {
  readonly evidenceType: MetadataAuditEvidenceType;
  readonly key: string;
  readonly label: string;
}

export interface MetadataAuditPanelContract {
  readonly fields: readonly MetadataAuditField[];
  readonly title: string;
}
