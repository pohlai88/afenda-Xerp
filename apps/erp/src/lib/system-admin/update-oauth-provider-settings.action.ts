"use server";

import { AUTH_EVENT, persistAuthAuditEvent } from "@afenda/auth";
import {
  mergeTenantOAuthProviderSettings,
  TENANT_OAUTH_CLIENT_SECRET_ENV_KEY,
  TENANT_OAUTH_PROVIDER_IDS,
  type TenantOAuthProviderConfig,
  type TenantOAuthProviderId,
} from "@afenda/database";
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

const UPDATE_OAUTH_PROVIDER_SETTINGS_ACTION =
  "system_admin.settings.integrations.oauth.update" as const;

const tenantOAuthProviderIdSchema = z.enum(TENANT_OAUTH_PROVIDER_IDS);

const oauthProviderPatchSchema = z.object({
  clientId: z.string().max(255).optional(),
  [TENANT_OAUTH_CLIENT_SECRET_ENV_KEY]: z.string().min(1).max(128).optional(),
  displayName: z.string().min(1).max(255).optional(),
  enabled: z.boolean().optional(),
});

const updateOauthProviderSettingsInputSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("toggle"),
    providerId: tenantOAuthProviderIdSchema,
    enabled: z.boolean(),
  }),
  z.object({
    mode: z.literal("upsert"),
    payload: oauthProviderPatchSchema.extend({
      providerId: tenantOAuthProviderIdSchema,
    }),
  }),
]);

function parseFormBoolean(value: FormDataEntryValue | null): boolean {
  return value === "true";
}

function parseJsonPayload(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return {};
  }
}

export interface UpdateOauthProviderSettingsData {
  readonly providerId: TenantOAuthProviderId;
  readonly tenantId: string;
}

export type UpdateOauthProviderSettingsActionState =
  ServerActionResult<UpdateOauthProviderSettingsData> | null;

function parseOauthProviderActionInput(formData: FormData): unknown {
  const mode = formData.get("mode");
  if (mode === "toggle") {
    return {
      mode: "toggle",
      providerId: formData.get("providerId"),
      enabled: parseFormBoolean(formData.get("enabled")),
    };
  }

  const payloadRaw = formData.get("payload");
  if (typeof payloadRaw !== "string") {
    return { mode: "upsert", payload: {} };
  }

  return {
    mode: "upsert",
    payload: parseJsonPayload(payloadRaw),
  };
}

async function emitOauthProviderConfiguredAudit(input: {
  readonly actorUserId: string;
  readonly correlationId: string;
  readonly providerId: TenantOAuthProviderId;
  readonly tenantId: string;
}): Promise<void> {
  await persistAuthAuditEvent({
    event: AUTH_EVENT.oauthProviderConfigured,
    result: "success",
    context: {
      correlationId: input.correlationId,
      oauthProviderId: input.providerId,
      platformUserId: input.actorUserId,
      tenantId: input.tenantId,
    },
  });
}

function buildOAuthProviderPatch(
  patch: z.infer<typeof oauthProviderPatchSchema>
): Partial<TenantOAuthProviderConfig> {
  return {
    ...(patch.clientId === undefined ? {} : { clientId: patch.clientId }),
    ...(patch.displayName === undefined
      ? {}
      : { displayName: patch.displayName }),
    ...(patch.enabled === undefined ? {} : { enabled: patch.enabled }),
    ...(patch[TENANT_OAUTH_CLIENT_SECRET_ENV_KEY] === undefined
      ? {}
      : {
          [TENANT_OAUTH_CLIENT_SECRET_ENV_KEY]:
            patch[TENANT_OAUTH_CLIENT_SECRET_ENV_KEY],
        }),
  };
}

export async function updateOauthProviderSettingsAction(
  _prevState: UpdateOauthProviderSettingsActionState,
  formData: FormData
): Promise<UpdateOauthProviderSettingsActionState> {
  const parsed = parseProtectedActionInput(
    updateOauthProviderSettingsInputSchema,
    parseOauthProviderActionInput(formData)
  );

  if (!parsed.ok) {
    return failServerAction({
      action: UPDATE_OAUTH_PROVIDER_SETTINGS_ACTION,
      error: parsed.error,
    });
  }

  const contextResult = await resolveActionOperatingContext();
  if (!contextResult.ok) {
    return failServerAction({
      action: UPDATE_OAUTH_PROVIDER_SETTINGS_ACTION,
      error: contextResult.error,
    });
  }

  const { operatingContext } = contextResult;
  const actorUserId = operatingContext.actor.userId;
  const tenantId = operatingContext.tenant.tenantId;

  const guardResult = await guardSystemAdminSection({
    sectionId: "settings",
    operatingContext,
    correlationId: operatingContext.correlationId,
  });

  if (guardResult.kind !== "allowed") {
    await recordActionAudit({
      action: UPDATE_OAUTH_PROVIDER_SETTINGS_ACTION,
      actorUserId,
      module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
      result: "denied",
      targetType: "system_admin_integrations_settings",
    });

    return failServerAction({
      action: UPDATE_OAUTH_PROVIDER_SETTINGS_ACTION,
      error: AppErrors.forbidden(
        "You do not have permission to update integration settings."
      ),
      userId: actorUserId,
    });
  }

  if (parsed.value.mode === "toggle") {
    const updated = await mergeTenantOAuthProviderSettings({
      audit: {
        actorType: "user",
        actorUserId,
        correlationId: operatingContext.correlationId,
        source: "app",
      },
      patch: { enabled: parsed.value.enabled },
      providerId: parsed.value.providerId,
      tenantId,
    });

    await emitOauthProviderConfiguredAudit({
      actorUserId,
      correlationId: operatingContext.correlationId,
      providerId: updated.enabled
        ? parsed.value.providerId
        : parsed.value.providerId,
      tenantId,
    });

    revalidatePath("/system-admin/settings/integrations");
    revalidatePath("/sign-in");

    await recordActionAudit({
      action: UPDATE_OAUTH_PROVIDER_SETTINGS_ACTION,
      actorUserId,
      module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
      result: "success",
      targetType: "system_admin_integrations_settings",
    });

    return serverActionSuccess({
      providerId: parsed.value.providerId,
      tenantId,
    });
  }

  const payload = oauthProviderPatchSchema
    .extend({ providerId: tenantOAuthProviderIdSchema })
    .parse(parsed.value.payload);

  const { providerId, ...rawPatch } = payload;

  await mergeTenantOAuthProviderSettings({
    audit: {
      actorType: "user",
      actorUserId,
      correlationId: operatingContext.correlationId,
      source: "app",
    },
    patch: buildOAuthProviderPatch(rawPatch),
    providerId,
    tenantId,
  });

  await emitOauthProviderConfiguredAudit({
    actorUserId,
    correlationId: operatingContext.correlationId,
    providerId,
    tenantId,
  });

  revalidatePath("/system-admin/settings/integrations");
  revalidatePath("/sign-in");

  await recordActionAudit({
    action: UPDATE_OAUTH_PROVIDER_SETTINGS_ACTION,
    actorUserId,
    module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
    result: "success",
    targetType: "system_admin_integrations_settings",
  });

  return serverActionSuccess({
    providerId,
    tenantId,
  });
}
