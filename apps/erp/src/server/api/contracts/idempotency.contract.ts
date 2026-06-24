import { z } from "zod";

import type { ApiIdempotencyPolicy, ApiRouteContract } from "./api-contract";
import { isMutationMethod } from "./method-policy.contract";

export const IDEMPOTENCY_KEY_HEADER = "idempotency-key";

export const IDEMPOTENCY_KEY_MIN_LENGTH = 8;
export const IDEMPOTENCY_KEY_MAX_LENGTH = 128;

export const idempotencyKeySchema = z
  .string()
  .trim()
  .min(IDEMPOTENCY_KEY_MIN_LENGTH)
  .max(IDEMPOTENCY_KEY_MAX_LENGTH);

export type IdempotencyKey = z.infer<typeof idempotencyKeySchema>;

/** Serializable replay payload stored between retries. */
export const idempotencyStoredResponseSchema = z.object({
  statusCode: z.number().int().min(200).max(599),
  data: z.unknown(),
});

export type IdempotencyStoredResponse = z.infer<
  typeof idempotencyStoredResponseSchema
>;

export function readIdempotencyKeyHeader(
  request: Request
): IdempotencyKey | null {
  const raw = request.headers.get(IDEMPOTENCY_KEY_HEADER);
  if (raw === null || raw.trim().length === 0) {
    return null;
  }

  return idempotencyKeySchema.parse(raw);
}

export function assertIdempotencyPolicy(
  contract: ApiRouteContract<unknown, unknown>
): void {
  if (contract.idempotency === undefined) {
    return;
  }

  if (!isMutationMethod(contract.method)) {
    throw new Error(
      `Contract ${contract.id} declares idempotency on non-mutation method ${contract.method}.`
    );
  }

  if (
    contract.idempotency.mode !== "required" &&
    contract.idempotency.mode !== "optional"
  ) {
    throw new Error(
      `Contract ${contract.id} has unsupported idempotency mode.`
    );
  }
}

export function requiresIdempotencyKey(
  policy: ApiIdempotencyPolicy | undefined
): policy is ApiIdempotencyPolicy {
  return policy?.mode === "required";
}

export function acceptsIdempotencyKey(
  policy: ApiIdempotencyPolicy | undefined
): boolean {
  return policy?.mode === "required" || policy?.mode === "optional";
}
