/** ERP-PROC-OP-005 — context spine consumer declaration (serializable; zero runtime deps). */

import {
  PROCUREMENT_PURCHASE_ORDERS_LIST_ROUTE,
  PROCUREMENT_REQUISITIONS_LIST_ROUTE,
} from "./procurement.pas006-ui.contract.js";

export const PROCUREMENT_CONTEXT_SPINE_CONSUMER_SLICE_ID =
  "ERP-PROC-OP-005" as const;

export const PROCUREMENT_CONTEXT_SPINE_CONSUMER_STATUS = "attested" as const;

interface ProcurementProtectedConsumerRoute {
  readonly delegate: "loadProtectedRequestOperatingContext";
  readonly module: string;
  readonly routePattern: string;
  readonly surfaceId: string;
}

interface ProcurementContextSpineConsumerContract {
  readonly consumerProofStatus: "attested";
  readonly forbiddenIngress: readonly string[];
  readonly kvId: string;
  readonly module: string;
  readonly protectedConsumerRoutes: readonly ProcurementProtectedConsumerRoute[];
  readonly requiredResolvers: readonly string[];
  readonly spineAuthority: string;
}

export const PROCUREMENT_CONTEXT_SPINE_REQUIRED_RESOLVERS = [
  "apps/erp/src/lib/context/resolve-operating-context.server.ts",
  "apps/erp/src/lib/context/load-protected-request-operating-context.server.ts",
] as const;

export const PROCUREMENT_CONTEXT_SPINE_FORBIDDEN_INGRESS = [
  "apps/erp/src/lib/context/resolve-operating-context-from-headers.server.ts",
] as const;

export const PROCUREMENT_FOUNDATION_READINESS_ROUTE = {
  surfaceId: "procurement.foundation.readiness",
  routePattern: "/modules/procurement/readiness",
  module: "app/(protected)/modules/procurement/readiness/page.tsx",
  delegate: "loadProtectedRequestOperatingContext",
} as const satisfies ProcurementProtectedConsumerRoute;

export const PROCUREMENT_CONTEXT_SPINE_CONSUMER_CONTRACT = {
  module: "procurement",
  kvId: "KV-PROC",
  spineAuthority: "PAS-001A IS-002 operating-context assembly",
  consumerProofStatus: "attested",
  requiredResolvers: [...PROCUREMENT_CONTEXT_SPINE_REQUIRED_RESOLVERS],
  forbiddenIngress: [...PROCUREMENT_CONTEXT_SPINE_FORBIDDEN_INGRESS],
  protectedConsumerRoutes: [
    PROCUREMENT_FOUNDATION_READINESS_ROUTE,
    {
      surfaceId: PROCUREMENT_REQUISITIONS_LIST_ROUTE.surfaceId,
      routePattern: PROCUREMENT_REQUISITIONS_LIST_ROUTE.routePattern,
      module: PROCUREMENT_REQUISITIONS_LIST_ROUTE.module,
      delegate: "loadProtectedRequestOperatingContext",
    },
    {
      surfaceId: PROCUREMENT_PURCHASE_ORDERS_LIST_ROUTE.surfaceId,
      routePattern: PROCUREMENT_PURCHASE_ORDERS_LIST_ROUTE.routePattern,
      module: PROCUREMENT_PURCHASE_ORDERS_LIST_ROUTE.module,
      delegate: "loadProtectedRequestOperatingContext",
    },
  ],
} as const satisfies ProcurementContextSpineConsumerContract;

export const PROCUREMENT_CONTEXT_SPINE_CONSUMER_ATTESTATION = {
  sliceId: PROCUREMENT_CONTEXT_SPINE_CONSUMER_SLICE_ID,
  status: PROCUREMENT_CONTEXT_SPINE_CONSUMER_STATUS,
  authorizedAt: "2026-06-30",
  contractPath:
    "packages/features/erp-modules/src/procurement/procurement.context-spine-consumer.contract.ts",
  loaderPath:
    "apps/erp/src/lib/procurement/load-procurement-foundation-readiness-page.server.ts",
  adrAuthority: "docs/adr/ADR-0031-procurement-runtime-authority-boundary.md",
} as const;
