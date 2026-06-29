export const API_AUTH_POLICIES = [
  "public",
  "session-required",
  "session-required-email-verified",
  "service-token-required",
  "internal-only",
] as const;

export type ApiAuthPolicy = (typeof API_AUTH_POLICIES)[number];

export function isPublicAuthPolicy(authPolicy: ApiAuthPolicy): boolean {
  return authPolicy === "public";
}

export function requiresSessionAuth(authPolicy: ApiAuthPolicy): boolean {
  return (
    authPolicy === "session-required" ||
    authPolicy === "session-required-email-verified"
  );
}
