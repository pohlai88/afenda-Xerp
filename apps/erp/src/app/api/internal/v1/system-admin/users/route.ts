import { systemAdminUsersGetContract } from "@/server/api/contracts/system-admin/system-admin.contract";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";
import { listSystemAdminUsers } from "@/server/system-admin/list-system-admin-users.server";
import { requireCompanyScopedApiActor } from "@/server/system-admin/require-company-scoped-api-actor.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = createApiHandler({
  contract: systemAdminUsersGetContract,
  async handler(context) {
    const actor = requireCompanyScopedApiActor(context);
    const result = await listSystemAdminUsers({
      companyId: actor.companyId,
      tenantId: actor.tenantId,
    });

    return result;
  },
});
