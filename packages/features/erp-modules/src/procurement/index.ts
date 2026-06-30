/** ERP-PROC-OP-001 — operational scaffold stub (no business runtime). */
export const PROCUREMENT_OPERATIONAL_SLICE_ID = "ERP-PROC-OP-001" as const;

export const PROCUREMENT_OPERATIONAL_STATUS = "scaffold_only" as const;

export const PROCUREMENT_OPERATIONAL_SCAFFOLD = {
  sliceId: PROCUREMENT_OPERATIONAL_SLICE_ID,
  status: PROCUREMENT_OPERATIONAL_STATUS,
  authorizedAt: "2026-06-30",
  runtimePath: "packages/features/erp-modules/src/procurement/",
} as const;

/** ERP-PROC-OP-002 — ADR-locked runtime ownership contract. */
export {
  PROCUREMENT_OWNERSHIP_ATTESTATION,
  PROCUREMENT_OWNERSHIP_CONTRACT,
  PROCUREMENT_OWNERSHIP_MATRIX,
  PROCUREMENT_OWNERSHIP_SLICE_ID,
  PROCUREMENT_OWNERSHIP_STATUS,
} from "./procurement.ownership.contract.js";
