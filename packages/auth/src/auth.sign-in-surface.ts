import { resolveBetterAuthSocialProviders } from "./auth.env.js";
import type { AuthEnvReaderInput } from "./auth.env-reader.js";
import { readAuthRuntimeEnv } from "./auth.env-reader.js";
import {
  type AfendaAuthSocialProviderId,
  isAfendaAuthSocialProviderId,
} from "./auth.social-providers.js";

/** Serializable sign-in surface — safe for Server → Client boundaries (Slice 19). */
export interface SignInProviderSurface {
  readonly passkeyEnabled: boolean;
  readonly socialProviderIds: readonly AfendaAuthSocialProviderId[];
  readonly ssoEnabled: boolean;
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
    passkeyEnabled: env["AFENDA_AUTH_PASSKEY"] !== "disabled",
    socialProviderIds,
    ssoEnabled: true,
  };
}
