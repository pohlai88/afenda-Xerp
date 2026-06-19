/** Stable auth lifecycle event names for audit + observability. */
export const AUTH_EVENT = {
  signInSucceeded: "auth.sign_in.succeeded",
  signInFailed: "auth.sign_in.failed",
  signOut: "auth.sign_out",
  sessionCreated: "auth.session.created",
  sessionInvalidated: "auth.session.invalidated",
} as const;

export type AuthEventName = (typeof AUTH_EVENT)[keyof typeof AUTH_EVENT];

export interface AuthEventContext {
  readonly authUserId?: string;
  readonly correlationId?: string;
  readonly email?: string;
  readonly ipAddress?: string | null;
  readonly reason?: string;
  readonly sessionId?: string;
  readonly userAgent?: string | null;
}

export function createAuthCorrelationId(prefix = "auth"): string {
  return `${prefix}-${crypto.randomUUID()}`;
}
