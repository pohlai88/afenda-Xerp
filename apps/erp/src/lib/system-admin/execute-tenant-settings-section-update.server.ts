import {
  type TenantAppearanceSettings,
  type TenantBillingSettings,
  type TenantIntegrationsSettings,
  type TenantNotificationsSettings,
  type TenantSettingsSectionKey,
  type TenantWorkspaceSettings,
  upsertTenantSettingsSection,
} from "@afenda/database";
import { AppErrors } from "@afenda/kernel";
import { revalidatePath } from "next/cache";
import type { ZodType } from "zod";

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

export interface TenantSettingsSectionUpdateData {
  readonly acknowledged: true;
  readonly tenantId: string;
}

export type TenantSettingsSectionUpdateState =
  ServerActionResult<TenantSettingsSectionUpdateData> | null;

type TenantSettingsSectionValueMap = {
  appearance: TenantAppearanceSettings;
  billing: TenantBillingSettings;
  integrations: TenantIntegrationsSettings;
  notifications: TenantNotificationsSettings;
  workspace: TenantWorkspaceSettings;
};

export async function executeTenantSettingsSectionUpdate<
  TSection extends TenantSettingsSectionKey,
  TSchema extends { payload: TenantSettingsSectionValueMap[TSection] },
>(input: {
  readonly action: string;
  readonly schema: ZodType<TSchema>;
  readonly formData: FormData;
  readonly section: TSection;
  readonly settingsPath: string;
}): Promise<TenantSettingsSectionUpdateState> {
  const parsed = parseProtectedActionInput(
    input.schema,
    parseTenantSettingsPayloadFormData(input.formData)
  );
  if (!parsed.ok) {
    return failServerAction({
      action: input.action,
      error: parsed.error,
    });
  }

  const contextResult = await resolveActionOperatingContext();
  if (!contextResult.ok) {
    return failServerAction({
      action: input.action,
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
      action: input.action,
      actorUserId,
      module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
      result: "denied",
      targetType: "system_admin_settings",
    });

    return failServerAction({
      action: input.action,
      error: AppErrors.forbidden(SYSTEM_ADMIN_SETTINGS_SAVE_DENIED_MESSAGE),
      userId: actorUserId,
    });
  }

  const tenantId = operatingContext.tenant.tenantId;

  await upsertTenantSettingsSection({
    tenantId,
    section: input.section,
    value: parsed.value.payload,
    audit: {
      actorType: "user",
      actorUserId,
      correlationId: operatingContext.correlationId,
      source: "app",
    },
  });

  revalidatePath(input.settingsPath);

  await recordActionAudit({
    action: input.action,
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
