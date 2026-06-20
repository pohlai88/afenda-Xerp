export const DEFAULT_RETRY_POLICY = {
  backoffMs: 1000,
  backoffMultiplier: 2,
  maxAttempts: 3,
} as const satisfies RetryPolicy;

export interface RetryPolicy {
  readonly backoffMs: number;
  readonly backoffMultiplier?: number;
  readonly maxAttempts: number;
}

export function validateRetryPolicy(policy: RetryPolicy): RetryPolicy {
  if (!Number.isInteger(policy.maxAttempts) || policy.maxAttempts < 1) {
    throw new Error("retryPolicy.maxAttempts must be a positive integer.");
  }

  if (!Number.isInteger(policy.backoffMs) || policy.backoffMs < 0) {
    throw new Error("retryPolicy.backoffMs must be a non-negative integer.");
  }

  if (
    policy.backoffMultiplier !== undefined &&
    (!Number.isFinite(policy.backoffMultiplier) || policy.backoffMultiplier < 1)
  ) {
    throw new Error(
      "retryPolicy.backoffMultiplier must be a number greater than or equal to 1."
    );
  }

  return policy;
}

export function shouldRetry(policy: RetryPolicy, attempt: number): boolean {
  return attempt < policy.maxAttempts;
}

export function computeRetryDelayMs(
  policy: RetryPolicy,
  attempt: number
): number {
  const multiplier = policy.backoffMultiplier ?? 1;
  return policy.backoffMs * multiplier ** Math.max(attempt - 1, 0);
}
