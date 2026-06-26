"use server";

import {
  AUTH_EVENT,
  describeSyncTenantSsoProviderSkipReason,
  persistAuthAuditEvent,
  type SyncTenantSsoProviderResult,
  syncTenantSsoProviderWithBetterAuth,
} from "@afenda/auth";
import {
  rotateTenantSsoOidcClientSecretEnvKey,
  rotateTenantSsoSamlCertificate,
  setTenantSsoProviderEnabled,
  upsertTenantSsoOidcProvider,
  upsertTenantSsoOidcProviderInputSchema,
  upsertTenantSsoSamlProvider,
  upsertTenantSsoSamlProviderInputSchema,
} from "@afenda/database";
import { AppErrors } from "@afenda/kernel";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
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

const UPDATE_SSO_PROVIDER_SETTINGS_ACTION =
  "system_admin.settings.integrations.sso.update" as const;

const upsertSsoOidcProviderPayloadSchema =
  upsertTenantSsoOidcProviderInputSchema.omit({ tenantId: true }).extend({
    protocol: z.literal("oidc").optional(),
  });

const upsertSsoSamlProviderPayloadSchema =
  upsertTenantSsoSamlProviderInputSchema.omit({ tenantId: true }).extend({
    protocol: z.literal("saml"),
  });

const upsertSsoProviderPayloadSchema = z.union([
  upsertSsoOidcProviderPayloadSchema,
  upsertSsoSamlProviderPayloadSchema,
]);

const rotateSsoOidcProviderPayloadSchema = z.object({
  clientSecretEnvKey: z.string().min(1).max(128),
  id: z.string().uuid(),
  protocol: z.literal("oidc"),
});

const rotateSsoSamlProviderPayloadSchema = z.object({
  cert: z.string().min(1),
  id: z.string().uuid(),
  idpMetadataXml: z.string().max(65_536).optional(),
  protocol: z.literal("saml"),
});

const rotateSsoProviderPayloadSchema = z.union([
  rotateSsoOidcProviderPayloadSchema,
  rotateSsoSamlProviderPayloadSchema,
]);

const updateSsoProviderSettingsInputSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("upsert"),
    payload: upsertSsoProviderPayloadSchema,
  }),
  z.object({
    mode: z.literal("toggle"),
    id: z.string().uuid(),
    enabled: z.boolean(),
  }),
  z.object({
    mode: z.literal("rotate"),
    payload: rotateSsoProviderPayloadSchema,
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

export interface UpdateSsoProviderSettingsData {
  readonly providerId: string;
  readonly syncNotice?: string;
  readonly tenantId: string;
}

export type UpdateSsoProviderSettingsActionState =
  ServerActionResult<UpdateSsoProviderSettingsData> | null;

function parseSsoProviderActionInput(formData: FormData): unknown {
  const mode = formData.get("mode");
  if (mode === "toggle") {
    return {
      mode: "toggle",
      id: formData.get("id"),
      enabled: parseFormBoolean(formData.get("enabled")),
    };
  }

  const payloadRaw = formData.get("payload");
  if (typeof payloadRaw !== "string") {
    if (mode === "rotate") {
      return { mode: "rotate", payload: {} };
    }

    return { mode: "upsert", payload: {} };
  }

  const payload = parseJsonPayload(payloadRaw);

  if (mode === "rotate") {
    return {
      mode: "rotate",
      payload,
    };
  }

  return {
    mode: "upsert",
    payload,
  };
}

function resolveSyncNotice(
  result: SyncTenantSsoProviderResult
): string | undefined {
  if (result.kind === "skipped") {
    return describeSyncTenantSsoProviderSkipReason(result.reason);
  }

  if (result.kind === "failed") {
    return result.message;
  }

  return;
}

async function emitSsoProviderConfiguredAudit(input: {
  readonly actorUserId: string;
  readonly correlationId: string;
  readonly providerId: string;
  readonly tenantId: string;
}): Promise<void> {
  await persistAuthAuditEvent({
    event: AUTH_EVENT.ssoProviderConfigured,
    result: "success",
    context: {
      correlationId: input.correlationId,
      platformUserId: input.actorUserId,
      ssoProviderId: input.providerId,
      tenantId: input.tenantId,
    },
  });
}

async function syncEnabledProvider(input: {
  readonly headers: Headers;
  readonly id: string;
  readonly tenantId: string;
}): Promise<string | undefined> {
  const syncResult = await syncTenantSsoProviderWithBetterAuth({
    headers: input.headers,
    id: input.id,
    tenantId: input.tenantId,
  });

  return resolveSyncNotice(syncResult);
}

export async function updateSsoProviderSettingsAction(
  _prevState: UpdateSsoProviderSettingsActionState,
  formData: FormData
): Promise<UpdateSsoProviderSettingsActionState> {
  const parsed = parseProtectedActionInput(
    updateSsoProviderSettingsInputSchema,
    parseSsoProviderActionInput(formData)
  );

  if (!parsed.ok) {
    return failServerAction({
      action: UPDATE_SSO_PROVIDER_SETTINGS_ACTION,
      error: parsed.error,
    });
  }

  const contextResult = await resolveActionOperatingContext();
  if (!contextResult.ok) {
    return failServerAction({
      action: UPDATE_SSO_PROVIDER_SETTINGS_ACTION,
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
      action: UPDATE_SSO_PROVIDER_SETTINGS_ACTION,
      actorUserId,
      module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
      result: "denied",
      targetType: "system_admin_integrations_settings",
    });

    return failServerAction({
      action: UPDATE_SSO_PROVIDER_SETTINGS_ACTION,
      error: AppErrors.forbidden(
        "You do not have permission to update integration settings."
      ),
      userId: actorUserId,
    });
  }

  const requestHeaders = await headers();

  if (parsed.value.mode === "rotate") {
    const rotatePayload = parsed.value.payload;
    const saved =
      rotatePayload.protocol === "saml"
        ? await rotateTenantSsoSamlCertificate({
            cert: rotatePayload.cert,
            id: rotatePayload.id,
            tenantId,
            ...(rotatePayload.idpMetadataXml === undefined
              ? {}
              : { idpMetadataXml: rotatePayload.idpMetadataXml }),
          })
        : await rotateTenantSsoOidcClientSecretEnvKey({
            clientSecretEnvKey: rotatePayload.clientSecretEnvKey,
            id: rotatePayload.id,
            tenantId,
          });

    const syncNotice = saved.enabled
      ? await syncEnabledProvider({
          headers: requestHeaders,
          id: saved.id,
          tenantId,
        })
      : undefined;

    await emitSsoProviderConfiguredAudit({
      actorUserId,
      correlationId: operatingContext.correlationId,
      providerId: saved.providerId,
      tenantId,
    });

    revalidatePath("/system-admin/settings/integrations");

    await recordActionAudit({
      action: UPDATE_SSO_PROVIDER_SETTINGS_ACTION,
      actorUserId,
      module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
      result: "success",
      targetType: "system_admin_integrations_settings",
    });

    return serverActionSuccess({
      providerId: saved.providerId,
      tenantId,
      ...(syncNotice === undefined ? {} : { syncNotice }),
    });
  }

  if (parsed.value.mode === "toggle") {
    const updated = await setTenantSsoProviderEnabled({
      id: parsed.value.id,
      tenantId,
      enabled: parsed.value.enabled,
    });

    if (!updated) {
      return failServerAction({
        action: UPDATE_SSO_PROVIDER_SETTINGS_ACTION,
        error: AppErrors.notFound("SSO provider was not found."),
        userId: actorUserId,
      });
    }

    const syncNotice = updated.enabled
      ? await syncEnabledProvider({
          headers: requestHeaders,
          id: updated.id,
          tenantId,
        })
      : undefined;

    await emitSsoProviderConfiguredAudit({
      actorUserId,
      correlationId: operatingContext.correlationId,
      providerId: updated.providerId,
      tenantId,
    });

    revalidatePath("/system-admin/settings/integrations");

    await recordActionAudit({
      action: UPDATE_SSO_PROVIDER_SETTINGS_ACTION,
      actorUserId,
      module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
      result: "success",
      targetType: "system_admin_integrations_settings",
    });

    return serverActionSuccess({
      providerId: updated.providerId,
      tenantId,
      ...(syncNotice === undefined ? {} : { syncNotice }),
    });
  }

  const payload = parsed.value.payload;
  const saved =
    payload.protocol === "saml"
      ? await upsertTenantSsoSamlProvider({
          displayName: payload.displayName,
          domain: payload.domain,
          enabled: payload.enabled,
          issuer: payload.issuer,
          metadata: payload.metadata,
          providerId: payload.providerId,
          tenantId,
        })
      : await upsertTenantSsoOidcProvider({
          displayName: payload.displayName,
          domain: payload.domain,
          enabled: payload.enabled,
          issuer: payload.issuer,
          metadata: payload.metadata,
          providerId: payload.providerId,
          tenantId,
        });

  const syncNotice = saved.enabled
    ? await syncEnabledProvider({
        headers: requestHeaders,
        id: saved.id,
        tenantId,
      })
    : undefined;

  await emitSsoProviderConfiguredAudit({
    actorUserId,
    correlationId: operatingContext.correlationId,
    providerId: saved.providerId,
    tenantId,
  });

  revalidatePath("/system-admin/settings/integrations");

  await recordActionAudit({
    action: UPDATE_SSO_PROVIDER_SETTINGS_ACTION,
    actorUserId,
    module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
    result: "success",
    targetType: "system_admin_integrations_settings",
  });

  return serverActionSuccess({
    providerId: saved.providerId,
    tenantId,
    ...(syncNotice === undefined ? {} : { syncNotice }),
  });
}
