/** ERP-PROC-OP-001 — operational scaffold stub (no business runtime). */
export const PROCUREMENT_OPERATIONAL_SLICE_ID = "ERP-PROC-OP-001" as const;

export const PROCUREMENT_OPERATIONAL_STATUS = "scaffold_only" as const;

export const PROCUREMENT_OPERATIONAL_SCAFFOLD = {
  sliceId: PROCUREMENT_OPERATIONAL_SLICE_ID,
  status: PROCUREMENT_OPERATIONAL_STATUS,
  authorizedAt: "2026-06-30",
  runtimePath: "packages/features/erp-modules/src/procurement/",
} as const;
