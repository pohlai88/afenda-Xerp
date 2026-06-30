/** ERP-PROC-OP-006 — audit/outbox declaration (serializable; zero runtime deps). */

export const PROCUREMENT_AUDIT_OUTBOX_SLICE_ID = "ERP-PROC-OP-006" as const;

export const PROCUREMENT_AUDIT_OUTBOX_STATUS = "declared" as const;

/**
 * Wire audit vocabulary — parity with
 * `PROCUREMENT_AUDIT_ACTIONS` (no cross-package import in contract).
 */
export const PROCUREMENT_WIRE_AUDIT_ACTIONS = [
  "requisition.drafted",
  "requisition.submitted",
  "requisition.approved",
  "requisition.rejected",
  "requisition.cancelled",
  "rfq.published",
  "rfq.closed",
  "purchase_order.drafted",
  "purchase_order.sent",
  "purchase_order.acknowledged",
  "purchase_order.received",
  "purchase_order.closed",
  "purchase_order.cancelled",
] as const;

export type ProcurementWireAuditAction =
  (typeof PROCUREMENT_WIRE_AUDIT_ACTIONS)[number];

/** Module-prefixed audit map entries for PAS-001C `module_prefixed` namespace mode. */
export const PROCUREMENT_MODULE_PREFIXED_AUDIT_ACTIONS =
  PROCUREMENT_WIRE_AUDIT_ACTIONS.map(
    (action) => `procurement.${action}` as const
  );

export type ProcurementModulePrefixedAuditAction =
  (typeof PROCUREMENT_MODULE_PREFIXED_AUDIT_ACTIONS)[number];

interface PlannedOutboxEntry {
  readonly event: string;
  readonly requirement: "deferred";
}

interface ProcurementAuditOutboxContract {
  readonly auditNamespaceMode: "module_prefixed";
  readonly auditWriterStatus: "deferred";
  readonly kvId: string;
  readonly module: string;
  readonly modulePrefixedAuditActions: readonly string[];
  readonly outboxWriterStatus: "deferred";
  readonly plannedOutboxEntries: readonly PlannedOutboxEntry[];
  readonly wireAuditActions: readonly string[];
}

export const PROCUREMENT_PLANNED_OUTBOX_ENTRIES = [
  { event: "procurement.requisition.drafted", requirement: "deferred" },
  { event: "procurement.requisition.submitted", requirement: "deferred" },
  { event: "procurement.requisition.approved", requirement: "deferred" },
  { event: "procurement.requisition.rejected", requirement: "deferred" },
  { event: "procurement.requisition.cancelled", requirement: "deferred" },
  { event: "procurement.rfq.published", requirement: "deferred" },
  { event: "procurement.rfq.closed", requirement: "deferred" },
  { event: "procurement.purchase_order.drafted", requirement: "deferred" },
  { event: "procurement.purchase_order.sent", requirement: "deferred" },
  {
    event: "procurement.purchase_order.acknowledged",
    requirement: "deferred",
  },
  { event: "procurement.purchase_order.received", requirement: "deferred" },
  { event: "procurement.purchase_order.closed", requirement: "deferred" },
  {
    event: "procurement.purchase_order.cancelled",
    requirement: "deferred",
  },
] as const satisfies readonly PlannedOutboxEntry[];

export const PROCUREMENT_AUDIT_OUTBOX_CONTRACT = {
  module: "procurement",
  kvId: "KV-PROC",
  auditNamespaceMode: "module_prefixed",
  auditWriterStatus: "deferred",
  outboxWriterStatus: "deferred",
  wireAuditActions: [...PROCUREMENT_WIRE_AUDIT_ACTIONS],
  modulePrefixedAuditActions: [...PROCUREMENT_MODULE_PREFIXED_AUDIT_ACTIONS],
  plannedOutboxEntries: [...PROCUREMENT_PLANNED_OUTBOX_ENTRIES],
} as const satisfies ProcurementAuditOutboxContract;

export const PROCUREMENT_AUDIT_OUTBOX_ATTESTATION = {
  sliceId: PROCUREMENT_AUDIT_OUTBOX_SLICE_ID,
  status: PROCUREMENT_AUDIT_OUTBOX_STATUS,
  authorizedAt: "2026-06-30",
  contractPath:
    "packages/features/erp-modules/src/procurement/procurement.audit-outbox.contract.ts",
  kernelAuthority:
    "packages/kernel/src/erp-domain/procurement/procurement-audit-actions.contract.ts",
  writersProhibitedUntil:
    "authorized ERP-MODULES audit/outbox runtime slice — no durable writers until handoff",
  adrAuthority: "docs/adr/ADR-0031-procurement-runtime-authority-boundary.md",
} as const;
