import {
  clearPlatformUserIdCacheForTests,
  resolvePlatformActorUserId,
} from "./auth.actor-resolution.js";
import { type AfendaAuth, createAuthConfig } from "./auth.config.js";
import type { AfendaAuthSession } from "./auth.contract.js";
import { UnauthenticatedError, UnlinkedPlatformUserError } from "./auth.errors.js";
import { readAuthConfigFingerprint } from "./auth.runtime.js";
import { isAfendaAuthSessionLinked, normalizeAfendaAuthSession } from "./auth.session.js";

let authSingleton: AfendaAuth | undefined;
let authEnvFingerprint: string | undefined;

export function getAuth(env: NodeJS.ProcessEnv = process.env): AfendaAuth {
  const fingerprint = readAuthConfigFingerprint(env);

  if (!authSingleton || authEnvFingerprint !== fingerprint) {
    authSingleton = createAuthConfig({ env });
    authEnvFingerprint = fingerprint;
  }

  return authSingleton;
}

export function resetAuthForTests(): void {
  authSingleton = undefined;
  authEnvFingerprint = undefined;
  clearPlatformUserIdCacheForTests();
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

  const platformUserId = await resolvePlatformActorUserId({
    authUserId: result.user.id,
  });

  return normalizeAfendaAuthSession(
    {
      session: {
        id: result.session.id,
        expiresAt: result.session.expiresAt,
        createdAt: result.session.createdAt,
        ipAddress: result.session.ipAddress ?? null,
        userAgent: result.session.userAgent ?? null,
      },
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        emailVerified: result.user.emailVerified,
        image: result.user.image ?? null,
      },
    },
    platformUserId
  );
}

export async function requireAfendaAuthSession(
  requestHeaders: Headers,
  env: NodeJS.ProcessEnv = process.env
): Promise<AfendaAuthSession> {
  const session = await getAfendaAuthSession(requestHeaders, env);

  if (!session) {
    throw new UnauthenticatedError();
  }

  if (!isAfendaAuthSessionLinked(session)) {
    throw new UnlinkedPlatformUserError();
  }

  return session;
}
