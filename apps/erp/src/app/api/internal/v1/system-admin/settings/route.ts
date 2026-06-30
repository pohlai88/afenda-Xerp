import { systemAdminSettingsGetContract } from "@/server/api/contracts/system-admin/system-admin.contract";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";
import { listSystemAdminSettings } from "@/server/system-admin/list-system-admin-settings.server";
import { requireCompanyScopedApiActor } from "@/server/system-admin/require-company-scoped-api-actor.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = createApiHandler({
  contract: systemAdminSettingsGetContract,
  async handler(context) {
    requireCompanyScopedApiActor(context);
    const result = await listSystemAdminSettings();

    return result;
  },
});
