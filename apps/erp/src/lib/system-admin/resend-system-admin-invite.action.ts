"use server";

import { resendAuthInvitationById } from "@afenda/auth";
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

const RESEND_SYSTEM_ADMIN_INVITE_ACTION =
  "system_admin.settings.members.invite.resend" as const;

export interface ResendSystemAdminInviteData {
  readonly inviteId: string;
}

export type ResendSystemAdminInviteActionState =
  ServerActionResult<ResendSystemAdminInviteData> | null;

export async function resendSystemAdminInviteAction(
  _previousState: ResendSystemAdminInviteActionState,
  formData: FormData
): Promise<ResendSystemAdminInviteActionState> {
  const contextResult = await resolveActionOperatingContext();
  if (!contextResult.ok) {
    return failServerAction({
      action: RESEND_SYSTEM_ADMIN_INVITE_ACTION,
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
      action: RESEND_SYSTEM_ADMIN_INVITE_ACTION,
      actorUserId,
      module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
      result: "denied",
      targetType: "system_admin_members",
    });

    return failServerAction({
      action: RESEND_SYSTEM_ADMIN_INVITE_ACTION,
      error: AppErrors.forbidden(),
      userId: actorUserId,
    });
  }

  const inviteId = formData.get("inviteId");

  if (typeof inviteId !== "string" || inviteId.trim().length === 0) {
    return failServerAction({
      action: RESEND_SYSTEM_ADMIN_INVITE_ACTION,
      error: AppErrors.validation(),
      userId: actorUserId,
    });
  }

  const normalizedInviteId = inviteId.trim();
  const resent = await resendAuthInvitationById(normalizedInviteId, {
    correlationId: operatingContext.correlationId,
    platformUserId: actorUserId,
    tenantId: operatingContext.tenant.tenantId,
  });

  if (!resent) {
    return failServerAction({
      action: RESEND_SYSTEM_ADMIN_INVITE_ACTION,
      error: AppErrors.notFound("Invitation"),
      userId: actorUserId,
    });
  }

  revalidatePath("/system-admin/settings/members");

  await recordActionAudit({
    action: RESEND_SYSTEM_ADMIN_INVITE_ACTION,
    actorUserId,
    module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
    result: "success",
    targetType: "system_admin_members",
  });

  return serverActionSuccess({ inviteId: normalizedInviteId });
}
