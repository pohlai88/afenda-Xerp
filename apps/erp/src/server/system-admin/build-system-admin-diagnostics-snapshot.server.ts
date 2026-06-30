import type { OperatingContext } from "@afenda/kernel";

import { CONTEXT_INTEGRATION_WIRING } from "@/lib/context/context-integration-registry";
import { OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY } from "@/lib/context/operating-context-protected-surface.registry";
import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";
import type { SystemAdminDiagnosticsSnapshotDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

import { listSystemAdminAuditEvents } from "./list-system-admin-audit-events.server";

export async function buildSystemAdminDiagnosticsSnapshot(input: {
  readonly operatingContext: OperatingContext;
}): Promise<SystemAdminDiagnosticsSnapshotDto> {
  const audit = await listSystemAdminAuditEvents({
    limit: 100,
    tenantId: input.operatingContext.workspace.tenantId,
  });

  return {
    apiContractCount: API_CONTRACTS.length,
    companyId: input.operatingContext.workspace.companyId,
    correlationId: input.operatingContext.correlationId,
    protectedSurfaceCount: OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY.length,
    recentAuditEventCount: audit.events.length,
    spineDelegateIds: CONTEXT_INTEGRATION_WIRING.map((entry) => entry.id),
    tenantId: input.operatingContext.workspace.tenantId,
    workspaceId:
      input.operatingContext.workspace.organizationId ??
      input.operatingContext.workspace.companyId,
  };
}
