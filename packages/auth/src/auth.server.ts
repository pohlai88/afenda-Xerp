import {
  clearPlatformUserIdCacheForTests,
  resolvePlatformActorUserId,
} from "./auth.actor-resolution.js";
import { type AfendaAuth, createAuthConfig } from "./auth.config.js";
import type { AfendaAuthSession } from "./auth.contract.js";
import {
  UnauthenticatedError,
  UnlinkedPlatformUserError,
} from "./auth.errors.js";
import { resetAuthInvitationStoreForTests } from "./auth.invitation.js";
import {
  assertTenantMfaPolicySatisfied,
  parseCompanyIdFromActiveWorkspaceId,
  type RequireAfendaAuthSessionOptions,
} from "./auth.mfa-policy.js";
import { readAuthConfigFingerprint } from "./auth.runtime.js";
import {
  type BetterAuthSessionLike,
  isAfendaAuthSessionLinked,
  normalizeAfendaAuthSession,
} from "./auth.session.js";

function readOptionalSessionString(value: unknown): string | null | undefined {
  if (value === undefined || value === null) {
    return value;
  }

  return typeof value === "string" ? value : undefined;
}

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
  resetAuthInvitationStoreForTests();
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

  const activeWorkspaceId =
    readOptionalSessionString(
      (result.session as { activeWorkspaceId?: unknown }).activeWorkspaceId
    ) ?? null;

  const sessionPayload: BetterAuthSessionLike = {
    session: {
      id: result.session.id,
      expiresAt: result.session.expiresAt,
      createdAt: result.session.createdAt,
      activeWorkspaceId,
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
  };

  return normalizeAfendaAuthSession(sessionPayload, platformUserId);
}

export async function requireAfendaAuthSession(
  requestHeaders: Headers,
  env: NodeJS.ProcessEnv = process.env,
  options: RequireAfendaAuthSessionOptions = {}
): Promise<AfendaAuthSession> {
  const session = await getAfendaAuthSession(requestHeaders, env);

  if (!session) {
    throw new UnauthenticatedError();
  }

  // Fail closed before any RBAC or operating-context resolution proceeds.
  if (!isAfendaAuthSessionLinked(session)) {
    throw new UnlinkedPlatformUserError();
  }

  if (options.tenantId) {
    const companyId =
      options.companyId ??
      parseCompanyIdFromActiveWorkspaceId(session.metadata.activeWorkspaceId);

    await assertTenantMfaPolicySatisfied({
      authUserId: session.user.authUserId,
      tenantId: options.tenantId,
      ...(companyId === undefined ? {} : { companyId }),
    });
  }

  return session;
}
