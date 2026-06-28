/**
 * Procurement permission vocabulary — documents domains/actions for PERMISSION_REGISTRY parity.
 */
export const PROCUREMENT_PERMISSION_DOMAINS = [
  "requisition",
  "purchaseOrder",
  "rfq",
  "supplierQuote",
] as const;

export type ProcurementPermissionDomain =
  (typeof PROCUREMENT_PERMISSION_DOMAINS)[number];

export const PROCUREMENT_PERMISSION_ACTIONS = {
  requisition: ["read", "create", "submit", "approve", "cancel"] as const,
  purchaseOrder: [
    "read",
    "create",
    "send",
    "receive",
    "close",
    "cancel",
  ] as const,
  rfq: ["read", "publish", "close"] as const,
  supplierQuote: ["read", "submit", "accept", "reject"] as const,
} as const satisfies Record<ProcurementPermissionDomain, readonly string[]>;

export type ProcurementPermissionAction<
  TDomain extends ProcurementPermissionDomain = ProcurementPermissionDomain,
> = (typeof PROCUREMENT_PERMISSION_ACTIONS)[TDomain][number];

export function toProcurementPermissionKey(
  domain: ProcurementPermissionDomain,
  action: ProcurementPermissionAction
): string {
  return `procurement.${domain}_${action}`;
}

export const PROCUREMENT_PERMISSION_KEY_VOCABULARY = [
  toProcurementPermissionKey("requisition", "read"),
  toProcurementPermissionKey("requisition", "create"),
  toProcurementPermissionKey("requisition", "submit"),
  toProcurementPermissionKey("requisition", "approve"),
  toProcurementPermissionKey("requisition", "cancel"),
  toProcurementPermissionKey("purchaseOrder", "read"),
  toProcurementPermissionKey("purchaseOrder", "create"),
  toProcurementPermissionKey("purchaseOrder", "send"),
  toProcurementPermissionKey("purchaseOrder", "receive"),
  toProcurementPermissionKey("purchaseOrder", "close"),
  toProcurementPermissionKey("purchaseOrder", "cancel"),
  toProcurementPermissionKey("rfq", "read"),
  toProcurementPermissionKey("rfq", "publish"),
  toProcurementPermissionKey("rfq", "close"),
  toProcurementPermissionKey("supplierQuote", "read"),
  toProcurementPermissionKey("supplierQuote", "submit"),
  toProcurementPermissionKey("supplierQuote", "accept"),
  toProcurementPermissionKey("supplierQuote", "reject"),
] as const;

export type ProcurementPermissionKey =
  (typeof PROCUREMENT_PERMISSION_KEY_VOCABULARY)[number];
