import {
  findPendingMemberInvitationForEmail,
  getEnabledTenantSsoProviderForTenantDomain,
  getTenantSsoProviderByProviderId,
  resolveTenantIdFromSsoEmailDomain,
} from "@afenda/database";
import { persistAuthAuditEvent } from "./auth.audit.js";
import { AUTH_EVENT } from "./auth.contract.js";
import type { AuthEnvReaderInput } from "./auth.env-reader.js";
import { readAuthRuntimeEnv } from "./auth.env-reader.js";
import { isAuthInvitationGateEnabled } from "./auth.invitation.js";

/** Better Auth SSO callback routes attested in integration tests (Slice 13a). */
export const AFENDA_AUTH_SSO_OIDC_CALLBACK_PREFIX = "/sso/callback/" as const;
export const AFENDA_AUTH_SSO_SAML_CALLBACK_PREFIX =
  "/sso/saml2/callback/" as const;

export class AuthSsoInvitationRejectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthSsoInvitationRejectedError";
  }
}

export interface AssertSsoSignUpInvitationAllowedInput {
  readonly email: string;
  readonly env?: AuthEnvReaderInput;
  readonly ssoProviderId?: string;
  readonly tenantId?: string;
}

function extractEmailDomain(email: string): string | null {
  const normalized = email.trim().toLowerCase();
  const atIndex = normalized.lastIndexOf("@");
  if (atIndex <= 0 || atIndex === normalized.length - 1) {
    return null;
  }

  return normalized.slice(atIndex + 1);
}

async function resolveInvitationTenantId(
  input: AssertSsoSignUpInvitationAllowedInput
): Promise<string | null> {
  const domain = extractEmailDomain(input.email);
  if (!domain) {
    return null;
  }

  if (input.ssoProviderId !== undefined) {
    const provider = await getTenantSsoProviderByProviderId({
      providerId: input.ssoProviderId,
    });

    if (!provider?.enabled || provider.domain !== domain) {
      return null;
    }

    return provider.tenantId;
  }

  if (input.tenantId !== undefined) {
    const provider = await getEnabledTenantSsoProviderForTenantDomain({
      domain,
      tenantId: input.tenantId,
    });
    return provider ? input.tenantId : null;
  }

  return resolveTenantIdFromSsoEmailDomain(input.email);
}

export async function assertSsoSignUpInvitationAllowed(
  input: AssertSsoSignUpInvitationAllowedInput
): Promise<void> {
  const env = input.env ?? readAuthRuntimeEnv();

  if (!isAuthInvitationGateEnabled(env)) {
    return;
  }

  const email = input.email.trim().toLowerCase();
  const tenantId = await resolveInvitationTenantId(input);

  if (!tenantId) {
    await persistAuthAuditEvent({
      event: AUTH_EVENT.ssoSignInFailed,
      result: "denied",
      reason:
        "SSO sign-up requires a tenant-scoped enabled IdP for this email domain.",
      context: { email },
    });
    throw new AuthSsoInvitationRejectedError(
      "SSO sign-up requires a tenant-scoped enabled IdP for this email domain."
    );
  }

  const pending = await findPendingMemberInvitationForEmail({
    email,
    tenantId,
  });

  if (!pending) {
    await persistAuthAuditEvent({
      event: AUTH_EVENT.ssoSignInFailed,
      result: "denied",
      reason: "SSO sign-up requires a pending invitation for this email.",
      context: {
        email,
        tenantId,
      },
    });
    throw new AuthSsoInvitationRejectedError(
      "SSO sign-up requires a pending invitation for this email."
    );
  }
}

export function isAfendaAuthSsoCallbackPath(path: string): boolean {
  return (
    path.startsWith(AFENDA_AUTH_SSO_OIDC_CALLBACK_PREFIX) ||
    path.startsWith(AFENDA_AUTH_SSO_SAML_CALLBACK_PREFIX)
  );
}

export function createAfendaSsoPluginOptions(
  env: AuthEnvReaderInput = readAuthRuntimeEnv()
) {
  return {
    disableImplicitSignUp: true,
    provisionUser: async ({
      user,
      provider,
    }: {
      readonly provider: { readonly providerId: string };
      readonly user: { readonly email: string };
    }) => {
      await assertSsoSignUpInvitationAllowed({
        email: user.email,
        env,
        ssoProviderId: provider.providerId,
      });
    },
  };
}
