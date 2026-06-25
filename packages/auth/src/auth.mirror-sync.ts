import { randomUUID } from "node:crypto";

import {
  type AfendaDatabase,
  authIdentityLinks,
  findPlatformUserIdByAuthUserId,
  getDb,
  insertAuthIdentityLink,
} from "@afenda/database";
import { and, eq } from "drizzle-orm";

import { persistAuthAuditEvent } from "./auth.audit.js";
import { AUTH_EVENT } from "./auth.contract.js";
import { getAuth } from "./auth.server.js";

/** Provider id for platform-provisioned identity links (no credential account). */
export const AFENDA_PLATFORM_MIRROR_PROVIDER_ID = "afenda-platform" as const;

export interface SyncAuthMirrorUserInput {
  readonly displayName: string;
  readonly email: string;
  /** Canonical Afenda `users.id` (ARCH-AUTH-001) — not Better Auth `authUserId`. */
  readonly userId: string;
}

export interface SyncAuthMirrorUserOptions {
  readonly platformDb?: AfendaDatabase;
}

export interface SyncAuthMirrorUserResult {
  readonly authUserId: string;
  readonly createdAuthUser: boolean;
  readonly createdIdentityLink: boolean;
  readonly updatedAuthUser: boolean;
}

export class AuthMirrorSyncConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthMirrorSyncConflictError";
  }
}

type AuthInternalAdapter = Awaited<
  Awaited<ReturnType<typeof getAuth>>["$context"]
>["internalAdapter"];

async function resolveAuthInternalAdapter(): Promise<AuthInternalAdapter> {
  const auth = getAuth();
  const context = await auth.$context;
  return context.internalAdapter;
}

async function findAuthUserIdByPlatformUserId(
  platformUserId: string,
  platformDb: AfendaDatabase
): Promise<string | null> {
  const [row] = await platformDb
    .select({ authUserId: authIdentityLinks.authUserId })
    .from(authIdentityLinks)
    .where(eq(authIdentityLinks.userId, platformUserId))
    .limit(1);

  return row?.authUserId ?? null;
}

async function hasMirrorIdentityLink(
  authUserId: string,
  platformUserId: string,
  platformDb: AfendaDatabase
): Promise<boolean> {
  const [row] = await platformDb
    .select({ id: authIdentityLinks.id })
    .from(authIdentityLinks)
    .where(
      and(
        eq(authIdentityLinks.authUserId, authUserId),
        eq(authIdentityLinks.userId, platformUserId),
        eq(authIdentityLinks.providerId, AFENDA_PLATFORM_MIRROR_PROVIDER_ID)
      )
    )
    .limit(1);

  return row !== undefined;
}

async function upsertMirrorAuthUser(
  adapter: AuthInternalAdapter,
  email: string,
  displayName: string,
  preferredAuthUserId: string | null
): Promise<{
  authUserId: string;
  createdAuthUser: boolean;
  updatedAuthUser: boolean;
}> {
  const existingByEmail = await adapter.findUserByEmail(email);
  const authUserId = preferredAuthUserId ?? existingByEmail?.user.id ?? null;

  if (authUserId === null) {
    const created = await adapter.createUser({
      email,
      emailVerified: false,
      name: displayName,
    });

    if (!created) {
      throw new Error("Better Auth mirror user create returned no user.");
    }

    return {
      authUserId: created.id,
      createdAuthUser: true,
      updatedAuthUser: false,
    };
  }

  await adapter.updateUser(authUserId, {
    email,
    name: displayName,
  });

  return {
    authUserId,
    createdAuthUser: false,
    updatedAuthUser: true,
  };
}

async function auditMirrorSyncFailure(
  input: SyncAuthMirrorUserInput,
  reason: string
): Promise<void> {
  try {
    await persistAuthAuditEvent({
      event: AUTH_EVENT.mirrorSyncFailed,
      result: "failure",
      reason,
      context: {
        email: input.email.trim().toLowerCase(),
        platformUserId: input.userId,
        correlationId: `auth-mirror-${randomUUID()}`,
        reason,
      },
    });
  } catch {
    // Audit must not block mirror sync failure propagation.
  }
}

/**
 * Idempotently mirrors a canonical platform user into Better Auth `auth_user`
 * and ensures an `auth_identity_links` row exists. Does not create credentials.
 */
export async function syncAuthMirrorUser(
  input: SyncAuthMirrorUserInput,
  options: SyncAuthMirrorUserOptions = {}
): Promise<SyncAuthMirrorUserResult> {
  const platformDb = options.platformDb ?? getDb();
  const email = input.email.trim().toLowerCase();
  const displayName = input.displayName.trim() || email;
  const platformUserId = input.userId;

  try {
    const adapter = await resolveAuthInternalAdapter();
    const preferredAuthUserId = await findAuthUserIdByPlatformUserId(
      platformUserId,
      platformDb
    );

    const { authUserId, createdAuthUser, updatedAuthUser } =
      await upsertMirrorAuthUser(
        adapter,
        email,
        displayName,
        preferredAuthUserId
      );

    const linkedPlatformUserId = await findPlatformUserIdByAuthUserId(
      authUserId,
      platformDb
    );

    if (
      linkedPlatformUserId != null &&
      linkedPlatformUserId !== platformUserId
    ) {
      throw new AuthMirrorSyncConflictError(
        `Auth user "${email}" is already linked to a different platform user.`
      );
    }

    let createdIdentityLink = false;

    if (
      !(await hasMirrorIdentityLink(authUserId, platformUserId, platformDb))
    ) {
      await insertAuthIdentityLink(
        {
          authUserId,
          providerId: AFENDA_PLATFORM_MIRROR_PROVIDER_ID,
          userId: platformUserId,
        },
        platformDb
      );
      createdIdentityLink = true;
    }

    return {
      authUserId,
      createdAuthUser,
      createdIdentityLink,
      updatedAuthUser,
    };
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "Auth mirror sync failed.";

    await auditMirrorSyncFailure(input, reason);
    throw error;
  }
}
