import { systemAdminMembershipRolePostContract } from "@/server/api/contracts/system-admin/system-admin.contract";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";
import { assignMembershipRole } from "@/server/system-admin/assign-membership-role.server";
import { requireCompanyScopedApiActor } from "@/server/system-admin/require-company-scoped-api-actor.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = createApiHandler({
  contract: systemAdminMembershipRolePostContract,
  handler(context) {
    const actor = requireCompanyScopedApiActor(context);

    return assignMembershipRole({
      actorUserId: actor.actorUserId,
      correlationId: actor.correlationId,
      membershipId: context.requestBody.membershipId,
      operatingCompanyId: actor.companyId,
      roleId: context.requestBody.roleId,
      targetCompanyId: context.requestBody.companyId,
    });
  },
});
