/** ADR-0035 probe constants — worker-safe copy for Trigger.dev (no apps/erp import). */

export const SERVICE_ACTOR_S2S_TOKEN_PREFIX = "afenda-s2s-v1" as const;

export const SERVICE_ACTOR_S2S_TOKEN_MAX_TTL_MS = 5 * 60 * 1000;

export const SERVICE_ACTOR_REQUEST_HEADERS = {
  actorKind: "x-afenda-actor-kind",
  authSubjectId: "x-afenda-auth-subject-id",
  integrationProvider: "x-afenda-integration-provider",
  integrationExternalId: "x-afenda-integration-external-id",
} as const;

export type ServiceActorS2sProbeClaims = {
  readonly sub: string;
  readonly actorKind: "service" | "delegated_application";
  readonly provider: string;
  readonly externalId: string;
  readonly iat: number;
  readonly exp: number;
};
