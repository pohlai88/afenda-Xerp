import { systemAdminMembershipsGetContract } from "@/server/api/contracts/system-admin/system-admin.contract";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";
import { listSystemAdminMemberships } from "@/server/system-admin/list-system-admin-memberships.server";
import { requireCompanyScopedApiActor } from "@/server/system-admin/require-company-scoped-api-actor.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = createApiHandler({
  contract: systemAdminMembershipsGetContract,
  async handler(context) {
    const actor = requireCompanyScopedApiActor(context);
    const result = await listSystemAdminMemberships({
      companyId: actor.companyId,
      tenantId: actor.tenantId,
    });

    return result;
  },
});
