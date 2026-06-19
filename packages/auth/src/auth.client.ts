import { createAuthClient } from "better-auth/react";

export function createAfendaAuthClient(baseURL?: string) {
  return createAuthClient(
    baseURL
      ? {
          baseURL,
        }
      : undefined
  );
}

export const authClient = createAfendaAuthClient();

export const { signIn, signOut, signUp, useSession } = authClient;
