"use client";

import { EvidenceWidget, MetricWidget } from "@afenda/shadcn-studio-v2/clients";
import type { SystemAdminDiagnosticsSnapshotDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

export interface SystemAdminDiagnosticsPanelProps {
  readonly snapshot: SystemAdminDiagnosticsSnapshotDto;
}

export function SystemAdminDiagnosticsPanel({
  snapshot,
}: SystemAdminDiagnosticsPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricWidget
          description="Governed API route contracts"
          label="API contracts"
          state="ready"
          useCase="erp-workspace"
          value={snapshot.apiContractCount}
        />
        <MetricWidget
          description="Registered protected operating-context surfaces"
          label="Protected surfaces"
          state="ready"
          useCase="erp-workspace"
          value={snapshot.protectedSurfaceCount}
        />
        <MetricWidget
          description="Recent audit events for the active tenant"
          label="Recent audit events"
          state="ready"
          tone="success"
          useCase="audit"
          value={snapshot.recentAuditEventCount}
        />
      </div>

      <EvidenceWidget
        description="Operating scope identifiers for the active request."
        items={[
          {
            id: "tenant",
            label: "Tenant",
            status: "complete",
          },
          {
            id: "company",
            label: "Company",
            status: "complete",
          },
          {
            id: "workspace",
            label: "Workspace scope",
            status: "complete",
          },
          {
            id: "correlation",
            label: "Correlation",
            status: "complete",
          },
        ]}
        label="Operating scope"
        state="ready"
        summary={`${snapshot.tenantId.slice(0, 8)}… · ${snapshot.correlationId.slice(0, 12)}…`}
        useCase="audit"
      />

      {snapshot.spineDelegateIds.length === 0 ? (
        <EvidenceWidget
          description="Spine delegate identifiers resolved for this operating context."
          label="Spine delegates"
          state="empty"
          stateMessages={{
            empty: {
              description: "No spine delegates are registered for this scope.",
              title: "No spine delegates",
            },
          }}
          useCase="erp-workspace"
        />
      ) : (
        <EvidenceWidget
          description="Spine delegate identifiers resolved for this operating context."
          items={snapshot.spineDelegateIds.map((delegateId) => ({
            id: delegateId,
            label: delegateId,
            status: "complete" as const,
          }))}
          label="Spine delegates"
          state="ready"
          summary={`${snapshot.spineDelegateIds.length} delegates`}
          useCase="erp-workspace"
        />
      )}
    </div>
  );
}
