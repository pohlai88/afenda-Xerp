import { updateMembership } from "@afenda/database";

import { recordErpAuditEvent } from "@/lib/observability/record-erp-audit-event";
import { ApiRouteError } from "@/server/api/runtime/api-validation";

export async function assignMembershipRole(input: {
  readonly actorUserId: string;
  readonly correlationId: string;
  readonly membershipId: string;
  readonly operatingCompanyId: string;
  readonly roleId: string;
  readonly targetCompanyId: string;
}): Promise<{ readonly membershipId: string; readonly roleId: string }> {
  if (input.targetCompanyId !== input.operatingCompanyId) {
    await recordErpAuditEvent({
      action: "system_admin.membership.role.assignment_denied",
      actorUserId: input.actorUserId,
      correlationId: input.correlationId,
      module: "system_admin",
      result: "denied",
      source: "api",
      targetId: input.membershipId,
      targetType: "membership",
    });

    throw new ApiRouteError(
      "forbidden",
      "Role assignment is not permitted outside the operating company scope."
    );
  }

  const updated = await updateMembership(input.membershipId, {
    audit: {
      actorType: "user",
      actorUserId: input.actorUserId,
      correlationId: input.correlationId,
      source: "api",
    },
    roleId: input.roleId,
  });

  return {
    membershipId: updated.id,
    roleId: input.roleId,
  };
}
