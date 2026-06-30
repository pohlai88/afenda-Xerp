import { systemAdminPermissionsGetContract } from "@/server/api/contracts/system-admin/system-admin.contract";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";
import { listSystemAdminPermissions } from "@/server/system-admin/list-system-admin-permissions.server";
import { requireCompanyScopedApiActor } from "@/server/system-admin/require-company-scoped-api-actor.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = createApiHandler({
  contract: systemAdminPermissionsGetContract,
  async handler(context) {
    requireCompanyScopedApiActor(context);
    const result = await listSystemAdminPermissions();

    return result;
  },
});
