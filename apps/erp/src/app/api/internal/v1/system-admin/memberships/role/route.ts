import { systemAdminMembershipRolePostContract } from "@/server/api/contracts/system-admin/system-admin.contract";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";
import { handleSystemAdminMembershipRolePost } from "@/server/system-admin/system-admin-mutation-api.handlers.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = createApiHandler({
  contract: systemAdminMembershipRolePostContract,
  handler: handleSystemAdminMembershipRolePost,
});
