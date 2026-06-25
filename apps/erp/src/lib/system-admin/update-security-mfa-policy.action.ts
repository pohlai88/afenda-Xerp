"use server";

import { updateTenantMfaPolicy } from "@afenda/auth";
import { AppErrors } from "@afenda/kernel";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { failServerAction } from "@/lib/server-actions/fail-server-action";
import { parseProtectedActionInput } from "@/lib/server-actions/parse-protected-action-input";
import { recordActionAudit } from "@/lib/server-actions/record-action-audit";
import { resolveActionOperatingContext } from "@/lib/server-actions/resolve-action-operating-context.server";
import {
  type ServerActionResult,
  serverActionSuccess,
} from "@/lib/server-actions/server-action-result";

import { guardSystemAdminSection } from "./guard-system-admin-section.server";
import { SYSTEM_ADMIN_MUTATION_AUDIT_MODULE } from "./system-admin-mutation-audit.registry";

const UPDATE_SECURITY_MFA_POLICY_ACTION =
  "system_admin.settings.security.mfa_policy.update" as const;

const updateSecurityMfaPolicyInputSchema = z.object({
  mfaRequired: z.coerce.boolean(),
});

export interface UpdateSecurityMfaPolicyData {
  readonly mfaRequired: boolean;
  readonly tenantId: string;
}

export type UpdateSecurityMfaPolicyActionState =
  ServerActionResult<UpdateSecurityMfaPolicyData> | null;

function parseMfaPolicyActionInput(formData: FormData): unknown {
  return {
    mfaRequired: formData.get("mfaRequired"),
  };
}

export async function updateSecurityMfaPolicyAction(
  _prevState: UpdateSecurityMfaPolicyActionState,
  formData: FormData
): Promise<UpdateSecurityMfaPolicyActionState> {
  const parsed = parseProtectedActionInput(
    updateSecurityMfaPolicyInputSchema,
    parseMfaPolicyActionInput(formData)
  );

  if (!parsed.ok) {
    return failServerAction({
      action: UPDATE_SECURITY_MFA_POLICY_ACTION,
      error: parsed.error,
    });
  }

  const contextResult = await resolveActionOperatingContext();
  if (!contextResult.ok) {
    return failServerAction({
      action: UPDATE_SECURITY_MFA_POLICY_ACTION,
      error: contextResult.error,
    });
  }

  const { operatingContext, session } = contextResult;
  const actorUserId = operatingContext.actor.userId;

  const guardResult = await guardSystemAdminSection({
    sectionId: "settings",
    operatingContext,
    correlationId: operatingContext.correlationId,
  });

  if (guardResult.kind !== "allowed") {
    await recordActionAudit({
      action: UPDATE_SECURITY_MFA_POLICY_ACTION,
      actorUserId,
      module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
      result: "denied",
      targetType: "system_admin_security_settings",
    });

    return failServerAction({
      action: UPDATE_SECURITY_MFA_POLICY_ACTION,
      error: AppErrors.forbidden(
        "You do not have permission to update security settings."
      ),
      userId: actorUserId,
    });
  }

  const tenantId = operatingContext.tenant.tenantId;

  await updateTenantMfaPolicy({
    auditCorrelationId: operatingContext.correlationId,
    authUserId: session.user.authUserId,
    mfaRequired: parsed.value.mfaRequired,
    tenantId,
  });

  revalidatePath("/system-admin/settings/security");

  await recordActionAudit({
    action: UPDATE_SECURITY_MFA_POLICY_ACTION,
    actorUserId,
    module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
    result: "success",
    targetType: "system_admin_security_settings",
  });

  return serverActionSuccess({
    mfaRequired: parsed.value.mfaRequired,
    tenantId,
  });
}
