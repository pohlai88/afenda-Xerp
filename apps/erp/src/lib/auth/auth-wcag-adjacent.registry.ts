/**
 * PAS-006C P06-007 — auth-adjacent surface registry for WCAG 2.2 AA pack.
 */

import { ERROR_PAGE_PUBLIC_PATH_PREFIXES } from "@/lib/presentation/error-page-surface.registry";

export const AUTH_ADJACENT_SURFACE_PATHS = [
  "/sign-in",
  "/mfa",
  "/mfa/recovery",
  "/session-expired",
  "/access-denied",
  "/security/review",
  ...ERROR_PAGE_PUBLIC_PATH_PREFIXES.filter(
    (path) => path !== "/session-expired" && path !== "/access-denied"
  ),
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
  "login-page-04": [
    "login.branding.title",
    "login.form.title",
    "login.email",
    "login.password",
    "login.submit",
  ],
};
