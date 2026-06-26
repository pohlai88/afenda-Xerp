import { passkeyClient } from "@better-auth/passkey/client";
import { ssoClient } from "@better-auth/sso/client";
import {
  multiSessionClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export type { AfendaAuthDeviceSession } from "./auth.client.contract.js";
export {
  isAfendaAuthDeviceSession,
  parseAfendaAuthDeviceSessions,
  readAfendaAuthSessionTwoFactorEnabled,
} from "./auth.client.contract.js";
export { isAuthChangeEmailEnabled } from "./auth.env.js";
export {
  type PasskeyDisplayLabelInput,
  resolvePasskeyDisplayLabel,
} from "./auth.passkey-label.js";
export {
  SIGN_IN_SOCIAL_PROVIDER_IDS,
  type SignInProviderSurface,
  type SignInSocialProviderId,
} from "./auth.sign-in-surface.js";

export function createAfendaAuthClient(baseURL?: string) {
  return createAuthClient({
    ...(baseURL === undefined ? {} : { baseURL }),
    plugins: [
      twoFactorClient(),
      multiSessionClient(),
      passkeyClient(),
      ssoClient(),
    ],
  });
}

export const authClient = createAfendaAuthClient();

type AfendaAuthClient = typeof authClient;

export const signIn: AfendaAuthClient["signIn"] = authClient.signIn;
export const signOut: AfendaAuthClient["signOut"] = authClient.signOut;
export const signUp: AfendaAuthClient["signUp"] = authClient.signUp;
export const useSession: AfendaAuthClient["useSession"] = authClient.useSession;
export const twoFactor: AfendaAuthClient["twoFactor"] = authClient.twoFactor;
export const multiSession: AfendaAuthClient["multiSession"] =
  authClient.multiSession;
export const passkey: AfendaAuthClient["passkey"] = authClient.passkey;
