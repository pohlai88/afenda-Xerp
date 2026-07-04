import { AUTH_PATHS } from "./auth-path.registry";

export type UnauthenticatedRedirectPath =
  | typeof AUTH_PATHS.sessionExpired
  | typeof AUTH_PATHS.signIn;

/**
 * Uses Better Auth `getSessionCookie` output — not raw Cookie header substring matching.
 * Non-empty cookie without a valid session → session-expired; absent cookie → sign-in.
 */
export function resolveUnauthenticatedRedirectPath(
  sessionCookie: string | null | undefined
): UnauthenticatedRedirectPath {
  if (
    sessionCookie !== null &&
    sessionCookie !== undefined &&
    sessionCookie.length > 0
  ) {
    return AUTH_PATHS.sessionExpired;
  }

  return AUTH_PATHS.signIn;
}
