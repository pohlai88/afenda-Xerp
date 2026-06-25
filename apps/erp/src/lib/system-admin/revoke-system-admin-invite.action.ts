"use server";

import { revokeAuthInvitationById } from "@afenda/auth";
import { AppErrors } from "@afenda/kernel";
import { revalidatePath } from "next/cache";

import { failServerAction } from "@/lib/server-actions/fail-server-action";
import { recordActionAudit } from "@/lib/server-actions/record-action-audit";
import { resolveActionOperatingContext } from "@/lib/server-actions/resolve-action-operating-context.server";
import {
  type ServerActionResult,
  serverActionSuccess,
} from "@/lib/server-actions/server-action-result";

import { guardSystemAdminSection } from "./guard-system-admin-section.server";
import { SYSTEM_ADMIN_MUTATION_AUDIT_MODULE } from "./system-admin-mutation-audit.registry";

const REVOKE_SYSTEM_ADMIN_INVITE_ACTION =
  "system_admin.settings.members.invite.revoke" as const;

export interface RevokeSystemAdminInviteData {
  readonly inviteId: string;
}

export type RevokeSystemAdminInviteActionState =
  ServerActionResult<RevokeSystemAdminInviteData> | null;

export async function revokeSystemAdminInviteAction(
  _previousState: RevokeSystemAdminInviteActionState,
  formData: FormData
): Promise<RevokeSystemAdminInviteActionState> {
  const contextResult = await resolveActionOperatingContext();
  if (!contextResult.ok) {
    return failServerAction({
      action: REVOKE_SYSTEM_ADMIN_INVITE_ACTION,
      error: AppErrors.unauthorized(),
    });
  }

  const { operatingContext } = contextResult;
  const actorUserId = operatingContext.actor.userId;

  const guardResult = await guardSystemAdminSection({
    sectionId: "settings",
    operatingContext,
    correlationId: operatingContext.correlationId,
  });

  if (guardResult.kind !== "allowed") {
    await recordActionAudit({
      action: REVOKE_SYSTEM_ADMIN_INVITE_ACTION,
      actorUserId,
      module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
      result: "denied",
      targetType: "system_admin_members",
    });

    return failServerAction({
      action: REVOKE_SYSTEM_ADMIN_INVITE_ACTION,
      error: AppErrors.forbidden(),
      userId: actorUserId,
    });
  }

  const inviteId = formData.get("inviteId");

  if (typeof inviteId !== "string" || inviteId.trim().length === 0) {
    return failServerAction({
      action: REVOKE_SYSTEM_ADMIN_INVITE_ACTION,
      error: AppErrors.validation(),
      userId: actorUserId,
    });
  }

  const normalizedInviteId = inviteId.trim();
  const revoked = revokeAuthInvitationById(normalizedInviteId);

  if (!revoked) {
    return failServerAction({
      action: REVOKE_SYSTEM_ADMIN_INVITE_ACTION,
      error: AppErrors.notFound("Invitation"),
      userId: actorUserId,
    });
  }

  revalidatePath("/system-admin/settings/members");

  await recordActionAudit({
    action: REVOKE_SYSTEM_ADMIN_INVITE_ACTION,
    actorUserId,
    module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
    result: "success",
    targetType: "system_admin_members",
  });

  return serverActionSuccess({ inviteId: normalizedInviteId });
}
