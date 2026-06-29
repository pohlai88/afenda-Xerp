/**
 * PAS-006C P06-007 — auth-adjacent surface registry for WCAG 2.2 AA pack.
 */

export const AUTH_ADJACENT_SURFACE_PATHS = [
  "/sign-in",
  "/mfa",
  "/mfa/recovery",
  "/session-expired",
  "/access-denied",
  "/security/review",
] as const;

export type AuthAdjacentSurfacePath =
  (typeof AUTH_ADJACENT_SURFACE_PATHS)[number];

/** Presentation blocks wired to auth-adjacent ERP routes. */
export const AUTH_ADJACENT_AUTH_BLOCK_IDS = ["login-page-04"] as const;

export type AuthAdjacentAuthBlockId =
  (typeof AUTH_ADJACENT_AUTH_BLOCK_IDS)[number];

/** Slot ids that must exist for WCAG form labeling on auth blocks. */
export const AUTH_ADJACENT_WCAG_REQUIRED_SLOTS: Readonly<
  Record<AuthAdjacentAuthBlockId, readonly string[]>
> = {
  "login-page-04": ["login.email", "login.password", "login.submit"],
};
