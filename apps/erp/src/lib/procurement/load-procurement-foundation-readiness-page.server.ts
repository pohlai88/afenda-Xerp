import {
  PROCUREMENT_CONTEXT_SPINE_CONSUMER_ATTESTATION,
  PROCUREMENT_CONTEXT_SPINE_CONSUMER_CONTRACT,
  PROCUREMENT_OPERATIONAL_SCAFFOLD,
  PROCUREMENT_OWNERSHIP_ATTESTATION,
  PROCUREMENT_PERMISSION_BINDING_ATTESTATION,
} from "@afenda/erp-modules/procurement";

import { loadProtectedRequestOperatingContext } from "@/lib/context/load-protected-request-operating-context.server";

export interface ProcurementFoundationReadinessAttestationRow {
  readonly label: string;
  readonly sliceId: string;
  readonly status: string;
}

export type ProcurementFoundationReadinessPageData =
  | {
      readonly kind: "error";
      readonly message: string;
      readonly title: string;
    }
  | {
      readonly attestationRows: readonly ProcurementFoundationReadinessAttestationRow[];
      readonly correlationId: string;
      readonly kind: "ready";
      readonly routePattern: string;
      readonly spineDelegate: "loadProtectedRequestOperatingContext";
      readonly tenantId: string;
      readonly title: string;
    };

const FOUNDATION_ATTESTATION_ROWS = [
  {
    label: "Operational scaffold",
    sliceId: PROCUREMENT_OPERATIONAL_SCAFFOLD.sliceId,
    status: PROCUREMENT_OPERATIONAL_SCAFFOLD.status,
  },
  {
    label: "Ownership contract",
    sliceId: PROCUREMENT_OWNERSHIP_ATTESTATION.sliceId,
    status: PROCUREMENT_OWNERSHIP_ATTESTATION.status,
  },
  {
    label: "Permission binding",
    sliceId: PROCUREMENT_PERMISSION_BINDING_ATTESTATION.sliceId,
    status: PROCUREMENT_PERMISSION_BINDING_ATTESTATION.status,
  },
  {
    label: "Context spine consumer",
    sliceId: PROCUREMENT_CONTEXT_SPINE_CONSUMER_ATTESTATION.sliceId,
    status: PROCUREMENT_CONTEXT_SPINE_CONSUMER_ATTESTATION.status,
  },
] as const satisfies readonly ProcurementFoundationReadinessAttestationRow[];

/** ERP-PROC-OP-005 — foundation readiness route consumes PAS-001A IS-002 spine. */
export async function loadProcurementFoundationReadinessPage(): Promise<ProcurementFoundationReadinessPageData> {
  const { operatingResult } = await loadProtectedRequestOperatingContext();

  if (!operatingResult.ok) {
    return {
      kind: "error",
      title: "Procurement foundation readiness",
      message: operatingResult.error.userMessage,
    };
  }

  const route =
    PROCUREMENT_CONTEXT_SPINE_CONSUMER_CONTRACT.protectedConsumerRoutes[0];

  return {
    kind: "ready",
    title: "Procurement foundation readiness",
    routePattern: route.routePattern,
    spineDelegate: route.delegate,
    tenantId: operatingResult.value.tenant.tenantId,
    correlationId: operatingResult.value.correlationId,
    attestationRows: FOUNDATION_ATTESTATION_ROWS,
  };
}
