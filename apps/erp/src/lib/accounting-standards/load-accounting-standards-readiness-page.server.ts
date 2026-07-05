import { loadProtectedRequestOperatingContext } from "@/lib/context/load-protected-request-operating-context.server";
import { resolveAccountingReadinessContext } from "@/lib/context/resolve-accounting-readiness.server";
import { ACCOUNTING_STANDARDS_CONSUMER_ATTESTATION } from "./accounting-standards-consumer.attestation";
import { runAccountingStandardsValidationForReadiness } from "./run-accounting-standards-validation.server";

export interface AccountingStandardsReadinessAttestationRow {
  readonly label: string;
  readonly sliceId: string;
  readonly status: string;
}

export type AccountingStandardsReadinessPageData =
  | {
      readonly kind: "error";
      readonly message: string;
      readonly title: string;
    }
  | {
      readonly aggregateStatus: string;
      readonly attestationRows: readonly AccountingStandardsReadinessAttestationRow[];
      readonly correlationId: string;
      readonly evidenceSnapshotCount: number;
      readonly fingerprint: string;
      readonly jurisdictionCode: string | null;
      readonly kind: "ready";
      readonly routePattern: string;
      readonly spineDelegate: "loadProtectedRequestOperatingContext";
      readonly tenantId: string;
      readonly title: string;
      readonly transactionDate: string | null;
    };

const FOUNDATION_ATTESTATION_ROWS = [
  {
    label: "PAS-003 consumer workflow",
    sliceId: ACCOUNTING_STANDARDS_CONSUMER_ATTESTATION.sliceId,
    status: ACCOUNTING_STANDARDS_CONSUMER_ATTESTATION.status,
  },
  {
    label: "Evidence snapshot persistence",
    sliceId: "PAS-003-B20-EVIDENCE",
    status: "delivered",
  },
] as const satisfies readonly AccountingStandardsReadinessAttestationRow[];

/** PAS-003 B20 — ERP consumer proof for accounting standards validation. */
export async function loadAccountingStandardsReadinessPage(): Promise<AccountingStandardsReadinessPageData> {
  const { operatingResult } = await loadProtectedRequestOperatingContext();

  if (!operatingResult.ok) {
    return {
      kind: "error",
      title: "Accounting standards readiness",
      message: operatingResult.error.userMessage,
    };
  }

  const operatingContext = operatingResult.value;
  const readiness = resolveAccountingReadinessContext(operatingContext);
  const workflow = runAccountingStandardsValidationForReadiness({
    readiness,
    tenantId: operatingContext.tenant.tenantId,
    companyId: operatingContext.legalEntity.companyId,
  });

  return {
    kind: "ready",
    title: "Accounting standards readiness",
    routePattern: "/standards/accounting-readiness",
    spineDelegate: "loadProtectedRequestOperatingContext",
    tenantId: operatingContext.tenant.tenantId,
    correlationId: operatingContext.correlationId,
    attestationRows: FOUNDATION_ATTESTATION_ROWS,
    aggregateStatus: workflow.report.aggregateStatus,
    fingerprint: workflow.evidenceRecord.fingerprint,
    evidenceSnapshotCount: workflow.evidenceRecord.evidenceSnapshots.length,
    jurisdictionCode: workflow.report.jurisdictionCode,
    transactionDate: workflow.report.transactionDate,
  };
}
