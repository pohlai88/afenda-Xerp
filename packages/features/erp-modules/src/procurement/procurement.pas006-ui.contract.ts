/** ERP-PROC-OP-007 — PAS-006 UI declaration (serializable; zero runtime deps). */

export const PROCUREMENT_PAS006_UI_SLICE_ID = "ERP-PROC-OP-007" as const;

export const PROCUREMENT_PAS006_UI_STATUS = "scaffold_attested" as const;

interface ProcurementPas006UiRoute {
  readonly blockId: string;
  readonly dataSource: "fixture";
  readonly loaderPath: string;
  readonly module: string;
  readonly pagePath: string;
  readonly permissionEnforcement: "deferred";
  readonly routePattern: string;
  readonly surfaceId: string;
  readonly surfaceTemplateId: string;
}

interface ProcurementPas006UiContract {
  readonly blockIds: readonly string[];
  readonly databaseBackedLists: false;
  readonly kvId: string;
  readonly module: string;
  readonly mutationActions: "deferred";
  readonly permissionEnforcement: "deferred";
  readonly presentationPackage: "@afenda/shadcn-studio";
  readonly routes: readonly ProcurementPas006UiRoute[];
  readonly uiProofStatus: "scaffold_attested";
}

export const PROCUREMENT_REQUISITIONS_LIST_ROUTE = {
  surfaceId: "procurement.requisitions.list",
  routePattern: "/modules/procurement/requisitions",
  module: "app/(protected)/modules/procurement/requisitions/page.tsx",
  pagePath:
    "apps/erp/src/app/(protected)/modules/procurement/requisitions/page.tsx",
  loaderPath:
    "apps/erp/src/lib/procurement/load-procurement-requisitions-page.server.ts",
  blockId: "datatable-procurement-requisitions",
  surfaceTemplateId: "surface-template.procurement-requisitions-table",
  dataSource: "fixture",
  permissionEnforcement: "deferred",
} as const satisfies ProcurementPas006UiRoute;

export const PROCUREMENT_PURCHASE_ORDERS_LIST_ROUTE = {
  surfaceId: "procurement.purchase_orders.list",
  routePattern: "/modules/procurement/purchase-orders",
  module: "app/(protected)/modules/procurement/purchase-orders/page.tsx",
  pagePath:
    "apps/erp/src/app/(protected)/modules/procurement/purchase-orders/page.tsx",
  loaderPath:
    "apps/erp/src/lib/procurement/load-procurement-purchase-orders-page.server.ts",
  blockId: "datatable-procurement-purchase-orders",
  surfaceTemplateId: "surface-template.procurement-purchase-orders-table",
  dataSource: "fixture",
  permissionEnforcement: "deferred",
} as const satisfies ProcurementPas006UiRoute;

export const PROCUREMENT_PAS006_UI_BLOCK_IDS = [
  "datatable-procurement-requisitions",
  "datatable-procurement-purchase-orders",
] as const;

export const PROCUREMENT_PAS006_UI_CONTRACT = {
  module: "procurement",
  kvId: "KV-PROC",
  presentationPackage: "@afenda/shadcn-studio",
  uiProofStatus: "scaffold_attested",
  databaseBackedLists: false,
  permissionEnforcement: "deferred",
  mutationActions: "deferred",
  blockIds: [...PROCUREMENT_PAS006_UI_BLOCK_IDS],
  routes: [
    PROCUREMENT_REQUISITIONS_LIST_ROUTE,
    PROCUREMENT_PURCHASE_ORDERS_LIST_ROUTE,
  ],
} as const satisfies ProcurementPas006UiContract;

export const PROCUREMENT_PAS006_UI_ATTESTATION = {
  sliceId: PROCUREMENT_PAS006_UI_SLICE_ID,
  status: PROCUREMENT_PAS006_UI_STATUS,
  authorizedAt: "2026-06-30",
  contractPath:
    "packages/features/erp-modules/src/procurement/procurement.pas006-ui.contract.ts",
  adrAuthority: "docs/adr/ADR-0031-procurement-runtime-authority-boundary.md",
  deferredUntil: [
    "database-backed list queries",
    "permission enforcement runtime",
    "audit/outbox writers",
  ],
} as const;
