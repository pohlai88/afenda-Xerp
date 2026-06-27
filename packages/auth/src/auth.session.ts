import { parseOptionalUserId } from "@afenda/kernel";

import type {
  AfendaAuthIdentity,
  AfendaAuthSession,
  AuthActorLinkStatus,
} from "./auth.contract.js";
import { UnlinkedPlatformUserError } from "./auth.errors.js";

/** Better Auth session shape accepted by the Afenda normalizer. */
export interface BetterAuthSessionLike {
  session: {
    id: string;
    expiresAt: Date;
    createdAt: Date;
    activeWorkspaceId?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    image?: string | null;
  };
}

function resolveAuthActorLinkStatus(
  platformUserId: string | null
): AuthActorLinkStatus {
  return platformUserId ? "linked" : "unlinked";
}

export function resolveActiveWorkspaceId(
  activeWorkspaceId: string | null | undefined
): string | null {
  if (activeWorkspaceId === undefined || activeWorkspaceId === null) {
    return null;
  }

  const trimmed = activeWorkspaceId.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function normalizeAfendaAuthSession(
  session: BetterAuthSessionLike,
  platformUserId: string | null = null
): AfendaAuthSession {
  return {
    sessionId: session.session.id,
    user: {
      authUserId: session.user.id,
      email: session.user.email,
      name: session.user.name,
      emailVerified: session.user.emailVerified,
      linkStatus: resolveAuthActorLinkStatus(platformUserId),
      userId: platformUserId,
    },
    metadata: {
      activeWorkspaceId: resolveActiveWorkspaceId(
        session.session.activeWorkspaceId
      ),
      image: session.user.image ?? null,
      issuedAt: session.session.createdAt.toISOString(),
      expiresAt: session.session.expiresAt.toISOString(),
      ipAddress: session.session.ipAddress ?? null,
      userAgent: session.session.userAgent ?? null,
    },
  };
}

export function isAfendaAuthSessionLinked(session: AfendaAuthSession): boolean {
  const userId = session.user.userId?.trim() ?? null;
  return (
    session.user.linkStatus === "linked" && userId !== null && userId.length > 0
  );
}

/** Maps a governed session into UI-safe identity fields (no session tokens). */
export function toAfendaAuthIdentity(
  session: AfendaAuthSession
): AfendaAuthIdentity {
  const userId = parseOptionalUserId(session.user.userId);
  if (userId === null) {
    throw new UnlinkedPlatformUserError();
  }

  return {
    userId,
    displayName: session.user.name,
    email: session.user.email,
  };
}
