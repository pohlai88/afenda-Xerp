import { systemAdminUserInvitePostContract } from "@/server/api/contracts/system-admin/system-admin.contract";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";
import { inviteCompanyUser } from "@/server/system-admin/invite-company-user.server";
import { requireCompanyScopedApiActor } from "@/server/system-admin/require-company-scoped-api-actor.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = createApiHandler({
  contract: systemAdminUserInvitePostContract,
  handler(context) {
    const actor = requireCompanyScopedApiActor(context);

    return inviteCompanyUser({
      actorUserId: actor.actorUserId,
      companyId: actor.companyId,
      correlationId: actor.correlationId,
      displayName: context.requestBody.displayName,
      email: context.requestBody.email,
      roleId: context.requestBody.roleId,
      tenantId: actor.tenantId,
    });
  },
});
