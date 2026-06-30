import { z } from "zod";

export const SERVICE_ACTOR_S2S_TOKEN_PREFIX = "afenda-s2s-v1" as const;

/** Maximum token lifetime — 5 minutes per ADR-0035. */
export const SERVICE_ACTOR_S2S_TOKEN_MAX_TTL_MS = 5 * 60 * 1000;

/** Clock skew allowance for `iat` / `exp` validation. */
export const SERVICE_ACTOR_S2S_TOKEN_CLOCK_SKEW_MS = 30 * 1000;

export const serviceActorS2sTokenPayloadSchema = z.object({
  sub: z.string().min(1),
  actorKind: z.enum(["service", "delegated_application"]),
  provider: z.string().min(1),
  externalId: z.string().min(1),
  iat: z.number().int().nonnegative(),
  exp: z.number().int().positive(),
});

export type ServiceActorS2sTokenPayload = z.infer<
  typeof serviceActorS2sTokenPayloadSchema
>;

export type VerifiedServiceActorClaims = {
  readonly sub: string;
  readonly actorKind: "service" | "delegated_application";
  readonly provider: string;
  readonly externalId: string;
  readonly iat: number;
  readonly exp: number;
};
