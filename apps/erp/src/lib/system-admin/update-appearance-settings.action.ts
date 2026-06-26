"use server";

import {
  getTenantSettingsByTenantId,
  type TenantAppearanceSettings,
  upsertTenantSettingsSection,
} from "@afenda/database";
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
import { parseTenantSettingsPayloadFormData } from "./parse-tenant-settings-payload-form-data";
import { SYSTEM_ADMIN_MUTATION_AUDIT_MODULE } from "./system-admin-mutation-audit.registry";
import { SYSTEM_ADMIN_SETTINGS_SAVE_DENIED_MESSAGE } from "./system-admin-settings.copy.contract";
import { updateAppearanceSettingsInputSchema } from "./system-admin-settings.schema";
import {
  deleteTenantBrandLogoObject,
  finalizeTenantBrandLogoObject,
} from "./tenant-brand-logo-storage.server";

const UPDATE_APPEARANCE_SETTINGS_ACTION =
  "system_admin.settings.appearance.update" as const;

export interface UpdateAppearanceSettingsData {
  readonly acknowledged: true;
  readonly tenantId: string;
}

export type UpdateAppearanceSettingsActionState =
  ServerActionResult<UpdateAppearanceSettingsData> | null;

export async function updateAppearanceSettingsAction(
  _prevState: UpdateAppearanceSettingsActionState,
  formData: FormData
): Promise<UpdateAppearanceSettingsActionState> {
  const parsed = parseProtectedActionInput(
    updateAppearanceSettingsInputSchema,
    parseTenantSettingsPayloadFormData(formData)
  );
  if (!parsed.ok) {
    return failServerAction({
      action: UPDATE_APPEARANCE_SETTINGS_ACTION,
      error: parsed.error,
    });
  }

  const contextResult = await resolveActionOperatingContext();
  if (!contextResult.ok) {
    return failServerAction({
      action: UPDATE_APPEARANCE_SETTINGS_ACTION,
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
      action: UPDATE_APPEARANCE_SETTINGS_ACTION,
      actorUserId,
      module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
      result: "denied",
      targetType: "system_admin_settings",
    });

    return failServerAction({
      action: UPDATE_APPEARANCE_SETTINGS_ACTION,
      error: AppErrors.forbidden(SYSTEM_ADMIN_SETTINGS_SAVE_DENIED_MESSAGE),
      userId: actorUserId,
    });
  }

  const tenantId = operatingContext.tenant.tenantId;
  const { logoUploadMeta, ...appearancePayload } = parsed.value.payload;

  const existing = await getTenantSettingsByTenantId(tenantId);
  const previousLogoObjectId = existing?.appearance?.logoObjectId ?? null;
  const nextLogoObjectId = appearancePayload.logoObjectId;

  if (
    previousLogoObjectId !== null &&
    previousLogoObjectId !== nextLogoObjectId
  ) {
    await deleteTenantBrandLogoObject({
      logoObjectId: previousLogoObjectId,
      tenantId,
    });
  }

  if (
    nextLogoObjectId !== null &&
    nextLogoObjectId !== previousLogoObjectId &&
    logoUploadMeta
  ) {
    const finalized = await finalizeTenantBrandLogoObject({
      logoObjectId: nextLogoObjectId,
      mimeType: logoUploadMeta.mimeType,
      size: logoUploadMeta.size,
      tenantId,
    });

    if (!finalized) {
      return failServerAction({
        action: UPDATE_APPEARANCE_SETTINGS_ACTION,
        error: AppErrors.internal(
          new Error("Unable to finalize uploaded logo.")
        ),
        userId: actorUserId,
      });
    }
  }

  const value: TenantAppearanceSettings = appearancePayload;

  await upsertTenantSettingsSection({
    tenantId,
    section: "appearance",
    value,
    audit: {
      actorType: "user",
      actorUserId,
      correlationId: operatingContext.correlationId,
      source: "app",
    },
  });

  revalidatePath("/system-admin/settings/appearance");

  await recordActionAudit({
    action: UPDATE_APPEARANCE_SETTINGS_ACTION,
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
