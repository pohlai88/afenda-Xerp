import { resolveBetterAuthSocialProviders } from "./auth.env.js";

export const SIGN_IN_SOCIAL_PROVIDER_IDS = ["google", "microsoft"] as const;

export type SignInSocialProviderId =
  (typeof SIGN_IN_SOCIAL_PROVIDER_IDS)[number];

/** Serializable sign-in surface — safe for Server → Client boundaries (Slice 19). */
export interface SignInProviderSurface {
  readonly passkeyEnabled: boolean;
  readonly socialProviderIds: readonly SignInSocialProviderId[];
  readonly ssoEnabled: boolean;
}

function isSignInSocialProviderId(
  value: string
): value is SignInSocialProviderId {
  return (SIGN_IN_SOCIAL_PROVIDER_IDS as readonly string[]).includes(value);
}

/** Resolves which alternate sign-in methods the ERP sign-in page may offer. */
export function resolveSignInProviderSurface(
  env: NodeJS.ProcessEnv = process.env
): SignInProviderSurface {
  const socialProviders = resolveBetterAuthSocialProviders(env);
  const socialProviderIds = socialProviders
    ? (Object.keys(socialProviders).filter(
        isSignInSocialProviderId
      ) as SignInSocialProviderId[])
    : [];

  return {
    passkeyEnabled: env["AFENDA_AUTH_PASSKEY"] !== "disabled",
    socialProviderIds,
    ssoEnabled: true,
  };
}
