"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio-v2/clients";
import type { SystemAdminDiagnosticsSnapshotDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

export interface SystemAdminDiagnosticsPanelProps {
  readonly snapshot: SystemAdminDiagnosticsSnapshotDto;
}

export function SystemAdminDiagnosticsPanel({
  snapshot,
}: SystemAdminDiagnosticsPanelProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Operating scope</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Tenant</dt>
              <dd className="font-mono text-xs">{snapshot.tenantId}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Company</dt>
              <dd className="font-mono text-xs">{snapshot.companyId}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Workspace scope</dt>
              <dd className="font-mono text-xs">{snapshot.workspaceId}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Correlation</dt>
              <dd className="font-mono text-xs">{snapshot.correlationId}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Platform health</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">API contracts</dt>
              <dd>{snapshot.apiContractCount}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Protected surfaces</dt>
              <dd>{snapshot.protectedSurfaceCount}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Recent audit events</dt>
              <dd>{snapshot.recentAuditEventCount}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm">Spine delegates</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm md:grid-cols-2">
            {snapshot.spineDelegateIds.map((delegateId) => (
              <li className="font-mono text-xs" key={delegateId}>
                {delegateId}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
