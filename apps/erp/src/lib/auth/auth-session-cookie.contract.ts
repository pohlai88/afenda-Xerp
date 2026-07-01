/** Better Auth session cookie — must match OpenAPI `AFENDA_SESSION_COOKIE_NAME`. */
export const AFENDA_AUTH_SESSION_COOKIE_NAME =
  "better-auth.session_token" as const;

export type AfendaAuthSessionCookieName =
  typeof AFENDA_AUTH_SESSION_COOKIE_NAME;

/** Detects a Better Auth session cookie (including multi-session suffix variants). */
export function hasAfendaAuthSessionCookie(
  cookieHeader: string | null
): boolean {
  if (cookieHeader === null || cookieHeader.length === 0) {
    return false;
  }

  return cookieHeader.includes(`${AFENDA_AUTH_SESSION_COOKIE_NAME}`);
}
