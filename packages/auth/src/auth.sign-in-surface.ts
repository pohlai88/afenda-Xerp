import { resolveBetterAuthSocialProviders } from "./auth.env.js";
import type { AuthEnvReaderInput } from "./auth.env-reader.js";
import { readAuthRuntimeEnv } from "./auth.env-reader.js";
import {
  type AfendaAuthSocialProviderId,
  isAfendaAuthSocialProviderId,
} from "./auth.social-providers.js";

/** Serializable sign-in surface — safe for Server → Client boundaries (Slice 19). */
export interface SignInProviderSurface {
  readonly emailDeliveryEnabled: boolean;
  readonly invitationGateEnabled: boolean;
  readonly passkeyEnabled: boolean;
  readonly socialProviderIds: readonly AfendaAuthSocialProviderId[];
  readonly ssoEnabled: boolean;
}

function isEnvFlagEnabled(value: string | undefined): boolean {
  return value !== "disabled";
}

/** Resolves which alternate sign-in methods the ERP sign-in page may offer. */
export function resolveSignInProviderSurface(
  env: AuthEnvReaderInput = readAuthRuntimeEnv()
): SignInProviderSurface {
  const socialProviders = resolveBetterAuthSocialProviders(env);
  const socialProviderIds: AfendaAuthSocialProviderId[] = [];

  if (socialProviders) {
    for (const providerId of Object.keys(socialProviders)) {
      if (isAfendaAuthSocialProviderId(providerId)) {
        socialProviderIds.push(providerId);
      }
    }
  }

  return {
    emailDeliveryEnabled: Boolean(env["AFENDA_AUTH_EMAIL_API_KEY"]?.trim()),
    invitationGateEnabled: isEnvFlagEnabled(env["AFENDA_AUTH_INVITATION_GATE"]),
    passkeyEnabled: isEnvFlagEnabled(env["AFENDA_AUTH_PASSKEY"]),
    socialProviderIds,
    ssoEnabled: isEnvFlagEnabled(env["AFENDA_AUTH_SSO"]),
  };
}
