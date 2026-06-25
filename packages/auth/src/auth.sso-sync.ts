import {
  getTenantSsoProviderById,
  parseTenantSsoOidcMetadata,
  TENANT_SSO_CLIENT_SECRET_ENV_KEY,
} from "@afenda/database";

import { getAuth } from "./auth.server.js";

export interface SyncTenantSsoProviderInput {
  readonly env?: NodeJS.ProcessEnv;
  readonly headers: Headers;
  readonly id: string;
  readonly tenantId: string;
}

export type SyncTenantSsoProviderSkipReason =
  | "missing_client_secret"
  | "provider_disabled"
  | "provider_not_found"
  | "unsupported_protocol";

export type SyncTenantSsoProviderResult =
  | { readonly kind: "failed"; readonly message: string }
  | {
      readonly kind: "skipped";
      readonly reason: SyncTenantSsoProviderSkipReason;
    }
  | { readonly kind: "synced"; readonly providerId: string };

function readClientSecret(
  clientSecretEnvKey: string | null | undefined,
  env: NodeJS.ProcessEnv
): string | undefined {
  if (!clientSecretEnvKey) {
    return;
  }

  const value = env[clientSecretEnvKey]?.trim();
  return value || undefined;
}

export async function syncTenantSsoProviderWithBetterAuth(
  input: SyncTenantSsoProviderInput
): Promise<SyncTenantSsoProviderResult> {
  const env = input.env ?? process.env;
  const record = await getTenantSsoProviderById({
    id: input.id,
    tenantId: input.tenantId,
  });

  if (!record) {
    return { kind: "skipped", reason: "provider_not_found" };
  }

  if (!record.enabled) {
    return { kind: "skipped", reason: "provider_disabled" };
  }

  if (record.protocol !== "oidc") {
    return { kind: "skipped", reason: "unsupported_protocol" };
  }

  const metadata = parseTenantSsoOidcMetadata(record.metadata);
  const clientSecret = readClientSecret(
    metadata[TENANT_SSO_CLIENT_SECRET_ENV_KEY],
    env
  );

  if (!clientSecret) {
    return { kind: "skipped", reason: "missing_client_secret" };
  }

  const auth = getAuth(env);

  try {
    await auth.api.registerSSOProvider({
      body: {
        providerId: record.providerId,
        issuer: record.issuer,
        domain: record.domain,
        oidcConfig: {
          clientId: metadata.clientId,
          clientSecret,
          ...(metadata.scopes === undefined ? {} : { scopes: metadata.scopes }),
          ...(metadata.authorizationEndpoint === undefined
            ? {}
            : { authorizationEndpoint: metadata.authorizationEndpoint }),
          ...(metadata.tokenEndpoint === undefined
            ? {}
            : { tokenEndpoint: metadata.tokenEndpoint }),
          ...(metadata.jwksEndpoint === undefined
            ? {}
            : { jwksEndpoint: metadata.jwksEndpoint }),
          ...(metadata.discoveryEndpoint === undefined
            ? {}
            : { discoveryEndpoint: metadata.discoveryEndpoint }),
          pkce: metadata.pkce ?? true,
        },
      },
      headers: input.headers,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "SSO provider sync failed.";
    return { kind: "failed", message };
  }

  return { kind: "synced", providerId: record.providerId };
}

export function describeSyncTenantSsoProviderSkipReason(
  reason: SyncTenantSsoProviderSkipReason
): string {
  switch (reason) {
    case "missing_client_secret":
      return "SSO provider saved, but Better Auth sync was skipped because the client secret environment variable is missing or empty.";
    case "provider_disabled":
      return "SSO provider saved, but Better Auth sync was skipped because the provider is disabled.";
    case "provider_not_found":
      return "SSO provider saved, but Better Auth sync was skipped because the provider record was not found.";
    case "unsupported_protocol":
      return "SSO provider saved, but Better Auth sync was skipped because only OIDC providers can be synced.";
    default: {
      const exhaustive: never = reason;
      return exhaustive;
    }
  }
}
