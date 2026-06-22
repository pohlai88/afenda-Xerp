/** Serializable auth boundary contracts (TIP-004). Types and constants only. */

import type { UserId } from "@afenda/kernel";

export interface AfendaAuthUser {
  /** Better Auth `user.id` — login identity only; never use for authorization. */
  readonly authUserId: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly linkStatus: AuthActorLinkStatus;
  readonly name: string;
  /** Platform `users.id` when linked; null when no identity bridge exists. */
  readonly userId: string | null;
}

export interface AfendaAuthSessionMetadata {
  readonly expiresAt: string;
  readonly image: string | null;
  readonly ipAddress: string | null;
  readonly issuedAt: string;
  readonly userAgent: string | null;
}

/** Governed session contract — no permission or tenant fields. */
export interface AfendaAuthSession {
  readonly metadata: AfendaAuthSessionMetadata;
  readonly sessionId: string;
  readonly user: AfendaAuthUser;
}

/** Serializable identity surface safe for AppShell and client boundaries. */
export interface AfendaAuthIdentity {
  readonly displayName: string;
  readonly email: string;
  readonly userId: UserId;
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
  enterpriseSso: "planned",
  invitation: "planned",
  mfa: "planned",
  organization: "planned",
  passkey: "planned",
} as const satisfies AfendaAuthExtensionPoints;

/** Stable auth lifecycle event names for audit + observability. */
export const AUTH_EVENT = {
  sessionCreated: "auth.session.created",
  sessionInvalidated: "auth.session.invalidated",
  signInFailed: "auth.sign_in.failed",
  signInSucceeded: "auth.sign_in.succeeded",
  signOut: "auth.sign_out",
} as const;

export type AuthEventName = (typeof AUTH_EVENT)[keyof typeof AUTH_EVENT];

/** Whether a Better Auth identity is linked to a platform `users.id`. */
export type AuthActorLinkStatus = "linked" | "unlinked";

export interface AuthEventContext {
  readonly authUserId?: string;
  readonly correlationId?: string;
  readonly email?: string;
  readonly ipAddress?: string | null;
  /** Pre-resolved platform `users.id`; skips identity-link lookup when set. */
  readonly platformUserId?: string;
  readonly reason?: string;
  readonly sessionId?: string;
  readonly userAgent?: string | null;
}

export type AuthAuditResult = "success" | "failure" | "denied";

export interface AuthAuditRecordInput {
  readonly context?: AuthEventContext;
  readonly event: AuthEventName;
  readonly reason?: string;
  readonly result: AuthAuditResult;
}
