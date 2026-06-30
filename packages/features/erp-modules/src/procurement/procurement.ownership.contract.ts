/** ERP-PROC-OP-002 — ADR-locked runtime ownership contract (serializable; zero runtime deps). */

export const PROCUREMENT_OWNERSHIP_SLICE_ID = "ERP-PROC-OP-002" as const;

export const PROCUREMENT_OWNERSHIP_STATUS = "adr_locked" as const;

/** Eight defineModuleOwnership surfaces — gate-compared to PROCUREMENT_FOUNDATION_BUNDLE.ownership. */
interface ModuleOwnershipSurfaces {
  readonly appIngress: string;
  readonly businessMeaning: string;
  readonly databaseSchema: string;
  readonly metadataBinding: string;
  readonly permissionRegistry: string;
  readonly presentation: string;
  readonly runtimeBehavior: string;
  readonly wireVocabulary: string;
}

export const PROCUREMENT_OWNERSHIP_CONTRACT = {
  wireVocabulary: "@afenda/kernel",
  businessMeaning: "@afenda/enterprise-knowledge",
  runtimeBehavior: "@afenda/procurement",
  databaseSchema: "@afenda/database",
  appIngress: "apps/erp",
  permissionRegistry: "@afenda/permissions",
  metadataBinding: "apps/erp",
  presentation: "@afenda/shadcn-studio",
} as const satisfies ModuleOwnershipSurfaces;

/** Gap report F.2 extended matrix — supplier identity on PAS-001 business-reference authority. */
export const PROCUREMENT_OWNERSHIP_MATRIX = {
  wireVocabulary: PROCUREMENT_OWNERSHIP_CONTRACT.wireVocabulary,
  businessMeaning: PROCUREMENT_OWNERSHIP_CONTRACT.businessMeaning,
  supplierIdentity: "PAS-001 business-reference (SupplierId, supplier_no)",
  runtimeBehavior: PROCUREMENT_OWNERSHIP_CONTRACT.runtimeBehavior,
  databaseSchema: PROCUREMENT_OWNERSHIP_CONTRACT.databaseSchema,
  appIngress: PROCUREMENT_OWNERSHIP_CONTRACT.appIngress,
  permissionRegistry: PROCUREMENT_OWNERSHIP_CONTRACT.permissionRegistry,
  metadataBinding: PROCUREMENT_OWNERSHIP_CONTRACT.metadataBinding,
  presentation: PROCUREMENT_OWNERSHIP_CONTRACT.presentation,
} as const;

export const PROCUREMENT_OWNERSHIP_ATTESTATION = {
  sliceId: PROCUREMENT_OWNERSHIP_SLICE_ID,
  status: PROCUREMENT_OWNERSHIP_STATUS,
  authorizedAt: "2026-06-30",
  operationalFilesystem: "packages/features/erp-modules/src/procurement/",
  registryReservation: "@afenda/procurement",
  contractPath:
    "packages/features/erp-modules/src/procurement/procurement.ownership.contract.ts",
  adrAuthority: "docs/adr/ADR-0031-procurement-runtime-authority-boundary.md",
} as const;
