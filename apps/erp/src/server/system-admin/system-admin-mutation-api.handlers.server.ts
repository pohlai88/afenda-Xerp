import type {
  SystemAdminMembershipRoleRequestDto,
  SystemAdminUserInviteRequestDto,
} from "@/server/api/contracts/system-admin/system-admin.api-contract";
import type { ApiRequestContext } from "@/server/api/runtime/api-request-context";

import { assignMembershipRole } from "./assign-membership-role.server";
import { inviteCompanyUser } from "./invite-company-user.server";
import { requireCompanyScopedApiActor } from "./require-company-scoped-api-actor.server";

export function handleSystemAdminUserInvitePost(
  context: ApiRequestContext<SystemAdminUserInviteRequestDto>
) {
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
}

export function handleSystemAdminMembershipRolePost(
  context: ApiRequestContext<SystemAdminMembershipRoleRequestDto>
) {
  const actor = requireCompanyScopedApiActor(context);

  return assignMembershipRole({
    actorUserId: actor.actorUserId,
    correlationId: actor.correlationId,
    membershipId: context.requestBody.membershipId,
    operatingCompanyId: actor.companyId,
    roleId: context.requestBody.roleId,
    targetCompanyId: context.requestBody.companyId,
  });
}
