import { loadProtectedRequestOperatingContext } from "@/lib/context/load-protected-request-operating-context.server";

export type ProcurementRequisitionRow = {
  id: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  requester: string;
  department: string;
  amount: number;
  neededBy: Date;
};

export type ProcurementRequisitionsPageData =
  | {
      readonly kind: "error";
      readonly message: string;
      readonly title: string;
    }
  | {
      readonly blockId: "datatable-procurement-requisitions";
      readonly correlationId: string;
      readonly kind: "ready";
      readonly routePattern: string;
      readonly rows: readonly ProcurementRequisitionRow[];
      readonly spineDelegate: "loadProtectedRequestOperatingContext";
      readonly tenantId: string;
      readonly title: string;
    };

const FIXTURE_ROWS: ProcurementRequisitionRow[] = [
  {
    id: "REQ-2401",
    status: "submitted",
    requester: "Alex Morgan",
    department: "Operations",
    amount: 4200,
    neededBy: new Date("2026-07-15"),
  },
  {
    id: "REQ-2402",
    status: "approved",
    requester: "Jamie Lee",
    department: "Facilities",
    amount: 1850,
    neededBy: new Date("2026-07-08"),
  },
  {
    id: "REQ-2403",
    status: "draft",
    requester: "Sam Patel",
    department: "IT",
    amount: 960,
    neededBy: new Date("2026-08-01"),
  },
];

/** ERP-PROC-OP-007 — requisitions list route consumes PAS-001A IS-002 spine + fixture rows. */
export async function loadProcurementRequisitionsPage(): Promise<ProcurementRequisitionsPageData> {
  const { operatingResult } = await loadProtectedRequestOperatingContext();

  if (!operatingResult.ok) {
    return {
      kind: "error",
      title: "Requisitions",
      message: operatingResult.error.userMessage,
    };
  }

  return {
    kind: "ready",
    title: "Requisitions",
    routePattern: "/modules/procurement/requisitions",
    spineDelegate: "loadProtectedRequestOperatingContext",
    tenantId: operatingResult.value.tenant.tenantId,
    correlationId: operatingResult.value.correlationId,
    blockId: "datatable-procurement-requisitions",
    rows: FIXTURE_ROWS,
  };
}
