import { describe, expect, it, vi } from "vitest";
import {
  buildEvaluationCacheKey,
  createCachedCapabilityEvaluator,
  createMemoryEvaluationCache,
} from "../cache/evaluation-cache";
import { evaluateCapability } from "../evaluation/capability-evaluation";
import { basicTierFixture, buildContext } from "../fixtures/tier-fixtures";

describe("evaluation cache", () => {
  it("returns cached decisions within TTL", async () => {
    let currentTime = 1000;
    const cache = createMemoryEvaluationCache({
      ttlMs: 5000,
      now: () => currentTime,
    });
    const evaluate = vi.fn(evaluateCapability);
    const cachedEvaluate = createCachedCapabilityEvaluator(evaluate, {
      cache,
      ttlMs: 5000,
      now: () => currentTime,
    });

    const input = {
      capabilityKey: "accounting",
      context: buildContext("tenant_basic", "company_basic", "accounting"),
      entitlements: basicTierFixture.entitlements,
      featureFlags: basicTierFixture.featureFlags,
      usageLimits: basicTierFixture.usageLimits,
      betaFlags: basicTierFixture.betaFlags,
      killSwitches: basicTierFixture.killSwitches,
      localizations: basicTierFixture.localizations,
      evaluatedAt: "2026-06-20T00:00:00.000Z",
      correlationId: "corr_cache_1",
    } as const;

    const first = await cachedEvaluate(input);
    currentTime += 1000;
    const second = await cachedEvaluate(input);

    expect(first).toEqual(second);
    expect(evaluate).toHaveBeenCalledTimes(1);
  });

  it("re-evaluates after TTL expiry", async () => {
    let currentTime = 0;
    const cache = createMemoryEvaluationCache({
      ttlMs: 1000,
      now: () => currentTime,
    });
    const evaluate = vi.fn(evaluateCapability);
    const cachedEvaluate = createCachedCapabilityEvaluator(evaluate, {
      cache,
      ttlMs: 1000,
      now: () => currentTime,
    });

    const input = {
      capabilityKey: "accounting",
      context: buildContext("tenant_basic", "company_basic", "accounting"),
      entitlements: basicTierFixture.entitlements,
      featureFlags: basicTierFixture.featureFlags,
      usageLimits: basicTierFixture.usageLimits,
      betaFlags: basicTierFixture.betaFlags,
      killSwitches: basicTierFixture.killSwitches,
      localizations: basicTierFixture.localizations,
      evaluatedAt: "2026-06-20T00:00:00.000Z",
      correlationId: "corr_cache_2",
    } as const;

    await cachedEvaluate(input);
    currentTime = 1001;
    await cachedEvaluate(input);

    expect(evaluate).toHaveBeenCalledTimes(2);
  });

  it("invalidates all tenant cache entries", async () => {
    const cache = createMemoryEvaluationCache({ ttlMs: 60_000 });
    const key = buildEvaluationCacheKey({
      tenantId: "tenant_a",
      companyId: "company_a",
      capabilityKey: "accounting",
    });

    await cache.set(
      key,
      {
        decision: {
          result: "allow",
          capabilityKey: "accounting",
          reason: "Capability is available.",
          audit: null,
        },
        expiresAt: Date.now() + 60_000,
      },
      60_000
    );

    await cache.invalidateTenant("tenant_a");

    expect(await cache.get(key)).toBeNull();
  });
});
