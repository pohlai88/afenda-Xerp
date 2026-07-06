"use client";

import { EvidenceWidget, MetricWidget } from "@afenda/shadcn-studio-v2/clients";
import type { AccountingStandardsReadinessAttestationRow } from "@/lib/accounting-standards/load-accounting-standards-readiness-page.server";
import { mapAttestationStatusToEvidenceItemStatus } from "@/lib/presentation/map-attestation-status-to-evidence-item-status";

export interface AccountingReadinessPanelProps {
  readonly aggregateStatus: string;
  readonly attestationRows: readonly AccountingStandardsReadinessAttestationRow[];
  readonly correlationId: string;
  readonly evidenceSnapshotCount: number;
  readonly fingerprint: string;
  readonly jurisdictionCode: string | null;
  readonly routePattern: string;
  readonly spineDelegate: string;
  readonly tenantId: string;
  readonly transactionDate: string | null;
}

export function AccountingReadinessPanel({
  aggregateStatus,
  attestationRows,
  correlationId,
  evidenceSnapshotCount,
  fingerprint,
  jurisdictionCode,
  routePattern,
  spineDelegate,
  tenantId,
  transactionDate,
}: AccountingReadinessPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricWidget
          description="Aggregate validation status from standards workflow."
          label="Aggregate status"
          state="ready"
          useCase="erp-workspace"
          value={aggregateStatus}
        />
        <MetricWidget
          description="Persisted evidence snapshots for this readiness proof."
          label="Evidence snapshots"
          state="ready"
          useCase="audit"
          value={evidenceSnapshotCount}
        />
        <MetricWidget
          description="Authority fingerprint for the validation record."
          label="Fingerprint"
          state="ready"
          useCase="erp-workspace"
          value={fingerprint.slice(0, 12)}
        />
      </div>

      <EvidenceWidget
        description={`Protected route ${routePattern} resolves tenant context and runs standards-backed validation via ${spineDelegate}.`}
        items={[
          {
            id: "tenant",
            label: "Tenant",
            status: "complete",
          },
          {
            id: "correlation",
            label: "Correlation",
            status: "complete",
          },
          {
            id: "jurisdiction",
            label: "Jurisdiction",
            status: jurisdictionCode == null ? "missing" : "complete",
          },
          {
            id: "transaction-date",
            label: "Transaction date",
            status: transactionDate == null ? "missing" : "complete",
          },
        ]}
        label="Validation workflow proof"
        state="ready"
        summary={`${tenantId.slice(0, 8)}… · ${correlationId.slice(0, 12)}…`}
        useCase="audit"
      />

      <EvidenceWidget
        description="Contracts-only validation — no ledger mutation (ADR-0010)."
        items={attestationRows.map((row) => ({
          id: row.sliceId,
          label: row.label,
          status: mapAttestationStatusToEvidenceItemStatus(row.status),
        }))}
        label="Consumer attestation chain"
        state="ready"
        summary={`${attestationRows.length} attestation rows`}
        useCase="erp-workspace"
      />
    </div>
  );
}
