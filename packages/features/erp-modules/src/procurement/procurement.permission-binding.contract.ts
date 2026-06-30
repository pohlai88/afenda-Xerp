/** ERP-PROC-OP-004 — permission binding declaration (serializable; zero runtime deps). */

export const PROCUREMENT_PERMISSION_BINDING_SLICE_ID =
  "ERP-PROC-OP-004" as const;

export const PROCUREMENT_PERMISSION_BINDING_STATUS = "declared" as const;

/**
 * Kernel-aligned permission keys — parity with
 * `PROCUREMENT_PERMISSION_KEY_VOCABULARY` (no cross-package import in contract).
 */
export const PROCUREMENT_KERNEL_PERMISSION_KEYS = [
  "procurement.requisition_read",
  "procurement.requisition_create",
  "procurement.requisition_submit",
  "procurement.requisition_approve",
  "procurement.requisition_cancel",
  "procurement.purchaseOrder_read",
  "procurement.purchaseOrder_create",
  "procurement.purchaseOrder_send",
  "procurement.purchaseOrder_receive",
  "procurement.purchaseOrder_close",
  "procurement.purchaseOrder_cancel",
  "procurement.rfq_read",
  "procurement.rfq_publish",
  "procurement.rfq_close",
  "procurement.supplierQuote_read",
  "procurement.supplierQuote_submit",
  "procurement.supplierQuote_accept",
  "procurement.supplierQuote_reject",
] as const;

interface ProcurementPermissionBindingContract {
  readonly kernelPermissionKeys: readonly string[];
  readonly kvId: string;
  readonly module: string;
  readonly permissionNamespace: string;
  readonly permissionParity: "deferred";
  readonly permissionRegistryOwner: string;
  readonly registryWiringStatus: "deferred";
}

export const PROCUREMENT_PERMISSION_BINDING_CONTRACT = {
  module: "procurement",
  kvId: "KV-PROC",
  permissionNamespace: "procurement",
  permissionParity: "deferred",
  permissionRegistryOwner: "@afenda/permissions",
  registryWiringStatus: "deferred",
  kernelPermissionKeys: [...PROCUREMENT_KERNEL_PERMISSION_KEYS],
} as const satisfies ProcurementPermissionBindingContract;

export const PROCUREMENT_PERMISSION_BINDING_ATTESTATION = {
  sliceId: PROCUREMENT_PERMISSION_BINDING_SLICE_ID,
  status: PROCUREMENT_PERMISSION_BINDING_STATUS,
  authorizedAt: "2026-06-30",
  contractPath:
    "packages/features/erp-modules/src/procurement/procurement.permission-binding.contract.ts",
  kernelAuthority:
    "packages/kernel/src/erp-domain/procurement/procurement-permission-vocabulary.contract.ts",
  registryWiringProhibitedUntil:
    "authorized ERP-MODULES permission enforcement slice — PERMISSION_REGISTRY wiring deferred",
  adrAuthority: "docs/adr/ADR-0031-procurement-runtime-authority-boundary.md",
} as const;
