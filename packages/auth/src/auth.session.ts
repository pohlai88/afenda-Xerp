import type { AfendaAuthIdentity, AfendaAuthSession } from "./auth.contract.js";

/** Better Auth session shape accepted by the Afenda normalizer. */
export interface BetterAuthSessionLike {
  session: {
    id: string;
    expiresAt: Date;
    createdAt: Date;
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

export function normalizeAfendaAuthSession(
  session: BetterAuthSessionLike
): AfendaAuthSession {
  return {
    sessionId: session.session.id,
    user: {
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
      emailVerified: session.user.emailVerified,
    },
    metadata: {
      image: session.user.image ?? null,
      issuedAt: session.session.createdAt.toISOString(),
      expiresAt: session.session.expiresAt.toISOString(),
      ipAddress: session.session.ipAddress ?? null,
      userAgent: session.session.userAgent ?? null,
    },
  };
}

/** Maps a governed session into UI-safe identity fields (no session tokens). */
export function toAfendaAuthIdentity(
  session: AfendaAuthSession
): AfendaAuthIdentity {
  return {
    userId: session.user.userId,
    displayName: session.user.name,
    email: session.user.email,
  };
}
