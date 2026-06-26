import { consumeApiRateLimitBucket } from "@afenda/database";

import type { ApiRateLimitPolicy } from "../contracts/rate-limit.contract";
import { ApiRouteError } from "./api-validation";

export interface ApiRateLimitContext {
  readonly contractId: string;
  readonly policy: ApiRateLimitPolicy;
  readonly requestId: string;
  readonly userId: string | null;
}

export interface ApiRateLimitWindowConfig {
  readonly maxRequests: number;
  readonly windowSeconds: number;
}

export interface ApiRateLimitProvider {
  consume(input: {
    readonly bucketKey: string;
    readonly config: ApiRateLimitWindowConfig;
  }): Promise<{
    readonly allowed: boolean;
    readonly retryAfterSeconds: number | null;
  }>;
}

const API_RATE_LIMIT_POLICY_LIMITS: Record<
  ApiRateLimitPolicy,
  ApiRateLimitWindowConfig | null
> = {
  "anonymous-low": { maxRequests: 30, windowSeconds: 60 },
  "authenticated-standard": { maxRequests: 120, windowSeconds: 60 },
  "authenticated-sensitive": { maxRequests: 60, windowSeconds: 60 },
  "service-token": { maxRequests: 300, windowSeconds: 60 },
  "disabled-local-dev": null,
};

function buildRateLimitBucketKey(context: ApiRateLimitContext): string {
  const subject = context.userId ?? "anonymous";
  return [context.policy, subject, context.contractId].join(":");
}

function resolveRateLimitConfig(
  policy: ApiRateLimitPolicy
): ApiRateLimitWindowConfig | null {
  return API_RATE_LIMIT_POLICY_LIMITS[policy];
}

export function createInMemoryRateLimitProvider(): ApiRateLimitProvider {
  const buckets = new Map<
    string,
    {
      readonly count: number;
      readonly windowStartMs: number;
      readonly windowSeconds: number;
    }
  >();

  return {
    async consume(input) {
      const nowMs = Date.now();
      const existing = buckets.get(input.bucketKey);

      if (!existing) {
        buckets.set(input.bucketKey, {
          count: 1,
          windowSeconds: input.config.windowSeconds,
          windowStartMs: nowMs,
        });
        return { allowed: true, retryAfterSeconds: null };
      }

      const elapsedSeconds = Math.floor(
        (nowMs - existing.windowStartMs) / 1000
      );

      if (elapsedSeconds >= existing.windowSeconds) {
        buckets.set(input.bucketKey, {
          count: 1,
          windowSeconds: input.config.windowSeconds,
          windowStartMs: nowMs,
        });
        return { allowed: true, retryAfterSeconds: null };
      }

      if (existing.count >= input.config.maxRequests) {
        const retryAfterSeconds = Math.max(
          1,
          Math.ceil(
            (existing.windowStartMs + existing.windowSeconds * 1000 - nowMs) /
              1000
          )
        );
        return { allowed: false, retryAfterSeconds };
      }

      buckets.set(input.bucketKey, {
        ...existing,
        count: existing.count + 1,
      });

      return { allowed: true, retryAfterSeconds: null };
    },
  };
}

export function createPostgresRateLimitProvider(): ApiRateLimitProvider {
  return {
    consume(input) {
      return consumeApiRateLimitBucket(input);
    },
  };
}

let activeRateLimitProvider: ApiRateLimitProvider | undefined;

function resolveDefaultRateLimitProvider(): ApiRateLimitProvider {
  if (process.env["API_RATE_LIMIT_PROVIDER"] === "memory") {
    return createInMemoryRateLimitProvider();
  }

  return createPostgresRateLimitProvider();
}

export function getApiRateLimitProvider(): ApiRateLimitProvider {
  activeRateLimitProvider ??= resolveDefaultRateLimitProvider();
  return activeRateLimitProvider;
}

export function setApiRateLimitProviderForTests(
  provider: ApiRateLimitProvider
): void {
  activeRateLimitProvider = provider;
}

export function resetApiRateLimitProviderForTests(): void {
  activeRateLimitProvider = undefined;
}

export async function assertRateLimitAllowed(
  context: ApiRateLimitContext
): Promise<void> {
  const config = resolveRateLimitConfig(context.policy);
  if (config === null) {
    return;
  }

  const result = await getApiRateLimitProvider().consume({
    bucketKey: buildRateLimitBucketKey(context),
    config,
  });

  if (!result.allowed) {
    throw new ApiRouteError(
      "rate_limited",
      "Too many requests. Please retry later.",
      result.retryAfterSeconds === null
        ? undefined
        : { retryAfterSeconds: result.retryAfterSeconds }
    );
  }
}
