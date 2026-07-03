export interface SystemAdminDiagnosticsSnapshotBlock {
  readonly apiContractCount: number;
  readonly companyId: string;
  readonly correlationId: string;
  readonly protectedSurfaceCount: number;
  readonly recentAuditEventCount: number;
  readonly spineDelegateIds: readonly string[];
  readonly tenantId: string;
  readonly workspaceId: string;
}

export interface SystemAdminDiagnosticsPanelBlockProps {
  readonly snapshot: SystemAdminDiagnosticsSnapshotBlock;
}

export function SystemAdminDiagnosticsPanelBlock({
  snapshot,
}: SystemAdminDiagnosticsPanelBlockProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-md border p-4">
        <h2 className="font-medium text-sm">Operating scope</h2>
        <dl className="mt-3 space-y-2 text-sm">
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
      </section>

      <section className="rounded-md border p-4">
        <h2 className="font-medium text-sm">Platform health</h2>
        <dl className="mt-3 space-y-2 text-sm">
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
      </section>

      <section className="rounded-md border p-4 md:col-span-2">
        <h2 className="font-medium text-sm">Spine delegates</h2>
        <ul className="mt-3 grid gap-2 text-sm md:grid-cols-2">
          {snapshot.spineDelegateIds.map((delegateId) => (
            <li className="font-mono text-xs" key={delegateId}>
              {delegateId}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
