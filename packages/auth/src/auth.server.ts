import { type AfendaAuth, createAuthConfig } from "./auth.config.js";
import {
  type AfendaAuthSession,
  normalizeAfendaAuthSession,
  UnauthenticatedError,
} from "./auth.types.js";

let authSingleton: AfendaAuth | undefined;

export function getAuth(env: NodeJS.ProcessEnv = process.env): AfendaAuth {
  if (!authSingleton) {
    authSingleton = createAuthConfig({ env });
  }

  return authSingleton;
}

export function resetAuthForTests(): void {
  authSingleton = undefined;
}

export async function getAfendaAuthSession(
  requestHeaders: Headers,
  env: NodeJS.ProcessEnv = process.env
): Promise<AfendaAuthSession | null> {
  const auth = getAuth(env);
  const result = await auth.api.getSession({ headers: requestHeaders });

  if (!result) {
    return null;
  }

  return normalizeAfendaAuthSession(result);
}

export async function requireAfendaAuthSession(
  requestHeaders: Headers,
  env: NodeJS.ProcessEnv = process.env
): Promise<AfendaAuthSession> {
  const session = await getAfendaAuthSession(requestHeaders, env);

  if (!session) {
    throw new UnauthenticatedError();
  }

  return session;
}
