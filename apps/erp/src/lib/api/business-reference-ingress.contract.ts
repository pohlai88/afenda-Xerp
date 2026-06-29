/**
 * PAS-001-AUD-05 / ADR-0028 — ERP business reference ingress wiring registry.
 *
 * Machine-readable attestation surface for governance gate
 * `check:erp-business-reference-ingress-attestation`.
 */
export const ERP_BMD_INGRESS_WIRING = [
  {
    id: "customer",
    module: "@/lib/api/parse-route-id",
    delegate: "parseRouteCustomerId",
    kernelParser: "parseCustomerId",
  },
  {
    id: "supplier",
    module: "@/lib/api/parse-route-id",
    delegate: "parseRouteSupplierId",
    kernelParser: "parseSupplierId",
  },
  {
    id: "product",
    module: "@/lib/api/parse-route-id",
    delegate: "parseRouteProductId",
    kernelParser: "parseProductId",
  },
  {
    id: "employee",
    module: "@/lib/api/parse-route-id",
    delegate: "parseRouteEmployeeId",
    kernelParser: "parseEmployeeId",
  },
  {
    id: "warehouse",
    module: "@/lib/api/parse-route-id",
    delegate: "parseRouteWarehouseId",
    kernelParser: "parseWarehouseId",
  },
  {
    id: "document",
    module: "@/lib/api/parse-route-id",
    delegate: "parseRouteDocumentId",
    kernelParser: "parseDocumentId",
  },
  {
    id: "asset",
    module: "@/lib/api/parse-route-id",
    delegate: "parseRouteAssetId",
    kernelParser: "parseAssetId",
  },
] as const;

export type ErpBmdIngressFamily = (typeof ERP_BMD_INGRESS_WIRING)[number]["id"];
