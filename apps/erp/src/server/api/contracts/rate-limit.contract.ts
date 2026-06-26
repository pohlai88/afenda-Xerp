export const API_RATE_LIMIT_POLICIES = [
  "anonymous-low",
  "authenticated-standard",
  "authenticated-sensitive",
  "service-token",
  "disabled-local-dev",
] as const;

export type ApiRateLimitPolicy = (typeof API_RATE_LIMIT_POLICIES)[number];

/** Serializable rate-limit declaration on route contracts — enforcement is adapter-backed. */
export interface ApiRateLimitPolicyDeclaration {
  readonly policy: ApiRateLimitPolicy;
}
