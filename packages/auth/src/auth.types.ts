/** Normalized, UI-safe Afenda auth identity (TIP-004 contract for TIP-005). */
export interface AfendaAuthUser {
  readonly email: string;
  readonly emailVerified: boolean;
  readonly name: string;
  readonly userId: string;
}

/** Governed session contract — no permission or tenant fields. */
export interface AfendaAuthSession {
  readonly metadata: AfendaAuthSessionMetadata;
  readonly sessionId: string;
  readonly user: AfendaAuthUser;
}

export interface AfendaAuthSessionMetadata {
  readonly expiresAt: string;
  readonly image: string | null;
  readonly ipAddress: string | null;
  readonly issuedAt: string;
  readonly userAgent: string | null;
}

/** Serializable identity surface safe for AppShell and client boundaries. */
export interface AfendaAuthIdentity {
  readonly displayName: string;
  readonly email: string;
  readonly userId: string;
}

/** Extension points reserved for future MFA, SSO, invitations (metadata only). */
export interface AfendaAuthExtensionPoints {
  readonly enterpriseSso: "planned";
  readonly invitation: "planned";
  readonly mfa: "planned";
  readonly organization: "planned";
  readonly passkey: "planned";
}

export const AFENDA_AUTH_EXTENSION_POINTS = {
  mfa: "planned",
  passkey: "planned",
  invitation: "planned",
  organization: "planned",
  enterpriseSso: "planned",
} as const satisfies AfendaAuthExtensionPoints;

export class UnauthenticatedError extends Error {
  constructor(message = "Authentication is required.") {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

export function isUnauthenticatedError(
  error: unknown
): error is UnauthenticatedError {
  return error instanceof UnauthenticatedError;
}

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
