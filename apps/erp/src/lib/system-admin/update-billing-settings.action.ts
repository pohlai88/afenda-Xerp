"use server";

import { upsertTenantSettingsSection } from "@afenda/database";
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
import { updateBillingSettingsInputSchema } from "./system-admin-settings.schema";

const UPDATE_BILLING_SETTINGS_ACTION =
  "system_admin.settings.billing.update" as const;

export interface UpdateBillingSettingsData {
  readonly acknowledged: true;
  readonly tenantId: string;
}

export type UpdateBillingSettingsActionState =
  ServerActionResult<UpdateBillingSettingsData> | null;

function parseBillingActionInput(formData: FormData): unknown {
  const payloadRaw = formData.get("payload");
  let payload: unknown;

  if (typeof payloadRaw === "string" && payloadRaw.length > 0) {
    try {
      payload = JSON.parse(payloadRaw) as unknown;
    } catch {
      payload = undefined;
    }
  }

  return {
    intent: formData.get("intent"),
    payload,
  };
}

export async function updateBillingSettingsAction(
  _prevState: UpdateBillingSettingsActionState,
  formData: FormData
): Promise<UpdateBillingSettingsActionState> {
  const parsed = parseProtectedActionInput(
    updateBillingSettingsInputSchema,
    parseBillingActionInput(formData)
  );
  if (!parsed.ok) {
    return failServerAction({
      action: UPDATE_BILLING_SETTINGS_ACTION,
      error: parsed.error,
    });
  }

  const contextResult = await resolveActionOperatingContext();
  if (!contextResult.ok) {
    return failServerAction({
      action: UPDATE_BILLING_SETTINGS_ACTION,
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
      action: UPDATE_BILLING_SETTINGS_ACTION,
      actorUserId,
      module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
      result: "denied",
      targetType: "system_admin_settings",
    });

    return failServerAction({
      action: UPDATE_BILLING_SETTINGS_ACTION,
      error: AppErrors.forbidden(SYSTEM_ADMIN_SETTINGS_SAVE_DENIED_MESSAGE),
      userId: actorUserId,
    });
  }

  const tenantId = operatingContext.tenant.tenantId;

  await upsertTenantSettingsSection({
    tenantId,
    section: "billing",
    value: parsed.value.payload,
    audit: {
      actorType: "user",
      actorUserId,
      correlationId: operatingContext.correlationId,
      source: "app",
    },
  });

  revalidatePath("/system-admin/settings/billing");

  await recordActionAudit({
    action: UPDATE_BILLING_SETTINGS_ACTION,
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
