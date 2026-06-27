/**
 * PAS-001 §4.1.13 / ADR-0023 — tenant human reference governance policy constants.
 *
 * Kernel classifies human reference scopes and parses at trust boundaries.
 * Domain modules own allocation; Kernel must not generate human numbers.
 */

export const TENANT_HUMAN_REFERENCE_PROHIBITED_PATTERNS = [
  "createEmployeeNo",
  "createCustomerNo",
  "createSupplierNo",
  "createSkuNo",
  "createAssetNo",
  "createDocumentNo",
  "createWarehouseCode",
  "nextEmployeeNo",
  "nextCustomerNo",
  "allocateDocumentNo",
  "human reference in ID_FAMILIES",
  "human reference as database PK",
  "foreign key to human reference column",
  "RLS on human reference column",
  "global unique on human number without tenant_id",
] as const;

export type TenantHumanReferenceProhibitedPattern =
  (typeof TENANT_HUMAN_REFERENCE_PROHIBITED_PATTERNS)[number];

export const TENANT_HUMAN_REFERENCE_POLICY = {
  kernelClassifiesOnly: true,
  kernelDoesNotGenerate: true,
  humanReferencesNotInIdFamilies: true,
  humanReferencesNeverPkFkOrRls: true,
  uniquenessAlwaysTenantScoped: true,
  documentCompositeUniqueColumns: [
    "tenant_id",
    "document_type",
    "document_no",
  ] as const,
  approvedHumanReferenceIngress: "parseEmployeeNo | parseCustomerNo | …",
  approvedHumanReferenceEgress: "normalize*ForWire",
  prohibitedPatterns: TENANT_HUMAN_REFERENCE_PROHIBITED_PATTERNS,
  enforcementGates: {
    kernelContract: "check:tenant-human-reference-kernel-contract",
    uniqueness: "check:tenant-human-reference-uniqueness",
    noHumanReferenceFk: "check:no-human-reference-fk",
    noHumanReferenceRls: "check:no-human-reference-rls",
    noKernelGeneration: "check:no-kernel-human-number-generation",
  },
} as const;
