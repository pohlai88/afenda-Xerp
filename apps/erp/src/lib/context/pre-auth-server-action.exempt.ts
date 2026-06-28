/**
 * Server actions that run before tenant-scoped session exists.
 * These must NOT call `resolveActionOperatingContext` — no workspace context is available yet.
 */
export const PRE_AUTH_SERVER_ACTION_EXEMPT_PATHS = [
  "src/lib/auth/auth-mfa-challenge.action.ts",
  "src/lib/auth/security-review.action.ts",
] as const;

export type PreAuthServerActionExemptPath =
  (typeof PRE_AUTH_SERVER_ACTION_EXEMPT_PATHS)[number];

export function isPreAuthServerActionExempt(
  relativePath: string
): relativePath is PreAuthServerActionExemptPath {
  return (PRE_AUTH_SERVER_ACTION_EXEMPT_PATHS as readonly string[]).includes(
    relativePath
  );
}
