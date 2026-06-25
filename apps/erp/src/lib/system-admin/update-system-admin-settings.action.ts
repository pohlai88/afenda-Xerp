"use server";

import { updateTenant } from "@afenda/database";
import { AppErrors } from "@afenda/kernel";
import { revalidatePath } from "next/cache";

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
import { SYSTEM_ADMIN_SETTINGS_SAVE_DENIED_MESSAGE } from "./system-admin-settings.copy.contract";
import { updateSystemAdminSettingsInputSchema } from "./system-admin-settings.schema";

const UPDATE_SYSTEM_ADMIN_SETTINGS_ACTION =
  "system_admin.settings.update" as const;

export interface UpdateSystemAdminSettingsData {
  readonly acknowledged: true;
  readonly tenantId: string;
}

export type UpdateSystemAdminSettingsActionState =
  ServerActionResult<UpdateSystemAdminSettingsData> | null;

function parseSettingsActionInput(formData: FormData): unknown {
  return {
    intent: formData.get("intent"),
    companyName: formData.get("companyName") ?? undefined,
  };
}

export async function updateSystemAdminSettingsAction(
  _prevState: UpdateSystemAdminSettingsActionState,
  formData: FormData
): Promise<UpdateSystemAdminSettingsActionState> {
  const parsed = parseProtectedActionInput(
    updateSystemAdminSettingsInputSchema,
    parseSettingsActionInput(formData)
  );
  if (!parsed.ok) {
    return failServerAction({
      action: UPDATE_SYSTEM_ADMIN_SETTINGS_ACTION,
      error: parsed.error,
    });
  }

  const contextResult = await resolveActionOperatingContext();
  if (!contextResult.ok) {
    return failServerAction({
      action: UPDATE_SYSTEM_ADMIN_SETTINGS_ACTION,
      error: contextResult.error,
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
      action: UPDATE_SYSTEM_ADMIN_SETTINGS_ACTION,
      actorUserId,
      module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
      result: "denied",
      targetType: "system_admin_settings",
    });

    return failServerAction({
      action: UPDATE_SYSTEM_ADMIN_SETTINGS_ACTION,
      error: AppErrors.forbidden(SYSTEM_ADMIN_SETTINGS_SAVE_DENIED_MESSAGE),
      userId: actorUserId,
    });
  }

  const tenantId = operatingContext.tenant.tenantId;
  const { companyName } = parsed.value;

  if (companyName !== undefined) {
    await updateTenant(tenantId, {
      name: companyName,
      audit: {
        actorType: "user",
        actorUserId,
        correlationId: operatingContext.correlationId,
        source: "app",
      },
    });

    revalidatePath("/system-admin/settings", "layout");
  }

  await recordActionAudit({
    action: UPDATE_SYSTEM_ADMIN_SETTINGS_ACTION,
    actorUserId,
    module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
    result: "success",
    targetType: "system_admin_settings",
  });

  return serverActionSuccess({
    acknowledged: true,
    tenantId,
  });
}
