/**
 * Serializable auth boundary contracts (TIP-004).
 * ARCH-AUTH-001: Afenda `users.id` is canonical; Better Auth `authUserId` is login-only.
 */

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
  /** Active workspace scope for operating context; null when unset (ARCH-AUTH-001 FR-A05). */
  readonly activeWorkspaceId: string | null;
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

/** Extension points — attested in `auth.integration.test.ts` (ARCH-AUTH-001 Slice 7). */
export interface AfendaAuthExtensionPoints {
  readonly enterpriseSso: "active" | "planned";
  /** Invite-only sign-up gate — integration-tested (Slice 7). */
  readonly invitation: "active";
  /** Better Auth twoFactor plugin + tenant MFA policy helpers — integration-tested (Slice 7). */
  readonly mfa: "active";
  readonly organization: "planned";
  readonly passkey: "active" | "planned";
  /** Better Auth socialProviders + tenant OAuth allowlist — integration-tested (Slice 13c). */
  readonly socialOAuth: "active" | "planned";
}

export const AFENDA_AUTH_EXTENSION_POINTS = {
  enterpriseSso: "active",
  invitation: "active",
  mfa: "active",
  organization: "planned",
  passkey: "active",
  socialOAuth: "active",
} as const satisfies AfendaAuthExtensionPoints;

/** Stable auth lifecycle event names for audit + observability. */
export const AUTH_EVENT = {
  emailVerificationSent: "auth.email_verification.sent",
  emailVerified: "auth.email.verified",
  invitationAccepted: "auth.invitation.accepted",
  invitationRejected: "auth.invitation.rejected",
  invitationSent: "auth.invitation.sent",
  mfaBypassBlocked: "auth.mfa.bypass_blocked",
  mfaDisabled: "auth.mfa.disabled",
  mfaEnrolled: "auth.mfa.enrolled",
  mfaPolicyUpdated: "auth.mfa.policy_updated",
  mfaVerified: "auth.mfa.verified",
  mirrorSyncFailed: "auth.mirror.sync_failed",
  oauthProviderConfigured: "auth.oauth.provider_configured",
  oauthSignInFailed: "auth.oauth.sign_in.failed",
  oauthSignInSucceeded: "auth.oauth.sign_in.succeeded",
  passwordResetCompleted: "auth.password_reset.completed",
  passwordResetRequested: "auth.password_reset.requested",
  passkeyDeleted: "auth.passkey.deleted",
  passkeyRegistered: "auth.passkey.registered",
  passkeySignInFailed: "auth.passkey.sign_in.failed",
  passkeySignInSucceeded: "auth.passkey.sign_in.succeeded",
  sessionCreated: "auth.session.created",
  sessionDeviceRevoked: "auth.session.device_revoked",
  sessionInvalidated: "auth.session.invalidated",
  sessionRevokedAll: "auth.session.revoked_all",
  signInFailed: "auth.sign_in.failed",
  signInSucceeded: "auth.sign_in.succeeded",
  signOut: "auth.sign_out",
  ssoProviderConfigured: "auth.sso.provider_configured",
  ssoSignInFailed: "auth.sso.sign_in.failed",
  ssoSignInSucceeded: "auth.sso.sign_in.succeeded",
  workspaceContextSwitched: "auth.workspace.context_switched",
} as const satisfies Record<
  | "emailVerificationSent"
  | "emailVerified"
  | "invitationAccepted"
  | "invitationRejected"
  | "invitationSent"
  | "mfaBypassBlocked"
  | "mfaDisabled"
  | "mfaEnrolled"
  | "mfaPolicyUpdated"
  | "mfaVerified"
  | "mirrorSyncFailed"
  | "oauthProviderConfigured"
  | "oauthSignInFailed"
  | "oauthSignInSucceeded"
  | "passwordResetCompleted"
  | "passwordResetRequested"
  | "passkeyDeleted"
  | "passkeyRegistered"
  | "passkeySignInFailed"
  | "passkeySignInSucceeded"
  | "sessionCreated"
  | "sessionDeviceRevoked"
  | "sessionInvalidated"
  | "sessionRevokedAll"
  | "signInFailed"
  | "signInSucceeded"
  | "signOut"
  | "ssoProviderConfigured"
  | "ssoSignInFailed"
  | "ssoSignInSucceeded"
  | "workspaceContextSwitched",
  string
>;

export type AuthEventName = (typeof AUTH_EVENT)[keyof typeof AUTH_EVENT];

/** Whether a Better Auth identity is linked to a platform `users.id`. */
export type AuthActorLinkStatus = "linked" | "unlinked";

export interface AuthEventContext {
  readonly authUserId?: string;
  readonly correlationId?: string;
  readonly email?: string;
  readonly invitationId?: string;
  readonly ipAddress?: string | null;
  readonly mfaRequired?: string;
  readonly oauthProviderId?: string;
  readonly passkeyId?: string;
  /** Pre-resolved platform `users.id`; skips identity-link lookup when set. */
  readonly platformUserId?: string;
  readonly reason?: string;
  readonly sessionId?: string;
  readonly ssoProviderId?: string;
  readonly tenantId?: string;
  readonly userAgent?: string | null;
}

export type AuthAuditResult = "success" | "failure" | "denied";

export interface AuthAuditRecordInput {
  readonly context?: AuthEventContext;
  readonly event: AuthEventName;
  readonly reason?: string;
  readonly result: AuthAuditResult;
}
