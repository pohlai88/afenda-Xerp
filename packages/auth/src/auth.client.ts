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

export function createAfendaAuthClient(baseURL?: string) {
  return createAuthClient({
    ...(baseURL === undefined ? {} : { baseURL }),
    plugins: [twoFactorClient(), multiSessionClient()],
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
