import { consumeApiRateLimitBucket } from "@afenda/database";

import type { ApiRateLimitPolicy } from "../meta-contracts/rate-limit.contract";
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

export interface ApiRateLimitConsumeResult {
  readonly allowed: boolean;
  readonly limit: number;
  readonly remaining: number;
  readonly resetAtUnix: number;
  readonly retryAfterSeconds: number | null;
}

export interface ApiRateLimitSnapshot extends ApiRateLimitConsumeResult {
  readonly policy: ApiRateLimitPolicy;
}

export interface ApiRateLimitProvider {
  consume(input: {
    readonly bucketKey: string;
    readonly config: ApiRateLimitWindowConfig;
  }): Promise<ApiRateLimitConsumeResult>;
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

function buildAllowedConsumeResult(
  config: ApiRateLimitWindowConfig,
  input: {
    readonly count: number;
    readonly windowStartMs: number;
  }
): ApiRateLimitConsumeResult {
  const resetAtUnix = Math.ceil(
    (input.windowStartMs + config.windowSeconds * 1000) / 1000
  );

  return {
    allowed: true,
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - input.count),
    resetAtUnix,
    retryAfterSeconds: null,
  };
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
        return buildAllowedConsumeResult(input.config, {
          count: 1,
          windowStartMs: nowMs,
        });
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
        return buildAllowedConsumeResult(input.config, {
          count: 1,
          windowStartMs: nowMs,
        });
      }

      if (existing.count >= input.config.maxRequests) {
        const retryAfterSeconds = Math.max(
          1,
          Math.ceil(
            (existing.windowStartMs + existing.windowSeconds * 1000 - nowMs) /
              1000
          )
        );
        return {
          allowed: false,
          limit: input.config.maxRequests,
          remaining: 0,
          resetAtUnix: Math.ceil(
            (existing.windowStartMs + existing.windowSeconds * 1000) / 1000
          ),
          retryAfterSeconds,
        };
      }

      const nextCount = existing.count + 1;
      buckets.set(input.bucketKey, {
        ...existing,
        count: nextCount,
      });

      return buildAllowedConsumeResult(input.config, {
        count: nextCount,
        windowStartMs: existing.windowStartMs,
      });
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

export async function consumeRateLimitForRequest(
  context: ApiRateLimitContext
): Promise<ApiRateLimitSnapshot | null> {
  const config = resolveRateLimitConfig(context.policy);
  if (config === null) {
    return null;
  }

  const result = await getApiRateLimitProvider().consume({
    bucketKey: buildRateLimitBucketKey(context),
    config,
  });

  return {
    ...result,
    policy: context.policy,
  };
}

export async function assertRateLimitAllowed(
  context: ApiRateLimitContext
): Promise<ApiRateLimitSnapshot | null> {
  const snapshot = await consumeRateLimitForRequest(context);
  if (snapshot !== null && !snapshot.allowed) {
    throw new ApiRouteError(
      "rate_limited",
      "Too many requests. Please retry later.",
      snapshot.retryAfterSeconds === null
        ? undefined
        : { retryAfterSeconds: snapshot.retryAfterSeconds }
    );
  }

  return snapshot?.allowed === true ? snapshot : null;
}
