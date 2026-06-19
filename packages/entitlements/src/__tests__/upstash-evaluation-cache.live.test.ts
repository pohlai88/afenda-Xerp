import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { EvaluationCacheEntry } from "../cache/evaluation-cache.js";
import {
  createUpstashEvaluationCacheFromEnv,
  hasUpstashRedisConfig,
  probeUpstashRedisConnectivity,
} from "../cache/redis-env.js";

const LIVE_REDIS_TEST_ENV = "AFENDA_LIVE_REDIS_TEST";
const LIVE_REDIS_TEST_CONFIRM = "yes";

function isLiveRedisTestEnabled(): boolean {
  return (
    process.env[LIVE_REDIS_TEST_ENV]?.trim().toLowerCase() ===
      LIVE_REDIS_TEST_CONFIRM && hasUpstashRedisConfig()
  );
}

describe.runIf(isLiveRedisTestEnabled())(
  "upstash evaluation cache (live Redis)",
  () => {
    const tenantId = `live_redis_${Date.now()}`;
    const cacheKey = `${tenantId}:company_live:accounting`;
    let cache: ReturnType<typeof createUpstashEvaluationCacheFromEnv>;

    const entry: EvaluationCacheEntry = {
      decision: {
        result: "allow",
        capabilityKey: "accounting",
        reason: "Live Redis integration test.",
        audit: null,
      },
      expiresAt: Date.now() + 60_000,
    };

    beforeAll(async () => {
      const reachable = await probeUpstashRedisConnectivity();

      if (!reachable) {
        throw new Error(
          "Upstash Redis unreachable — verify UPSTASH_REDIS_REST_URL in .env.config and UPSTASH_REDIS_REST_TOKEN in .env.secret, then run pnpm env:sync"
        );
      }

      cache = createUpstashEvaluationCacheFromEnv();
    });

    afterAll(async () => {
      await cache.invalidateTenant(tenantId);
    });

    it("stores and retrieves entries via Upstash REST", async () => {
      await cache.set(cacheKey, entry, 60_000);

      expect(await cache.get(cacheKey)).toEqual(entry);
    });

    it("invalidates tenant-scoped keys", async () => {
      await cache.set(cacheKey, entry, 60_000);

      await cache.invalidateTenant(tenantId);

      expect(await cache.get(cacheKey)).toBeNull();
    });
  }
);
