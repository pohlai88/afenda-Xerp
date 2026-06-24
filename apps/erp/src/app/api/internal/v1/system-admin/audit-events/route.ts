import { systemAdminAuditEventsGetContract } from "@/server/api/contracts/system-admin/system-admin.contract";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";
import { listSystemAdminAuditEvents } from "@/server/system-admin/list-system-admin-audit-events.server";
import { requireTenantScopedApiActor } from "@/server/system-admin/require-tenant-scoped-api-actor.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = createApiHandler({
  contract: systemAdminAuditEventsGetContract,
  handler(context) {
    const actor = requireTenantScopedApiActor(context);
    return listSystemAdminAuditEvents({ tenantId: actor.tenantId });
  },
});
