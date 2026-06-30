import { beforeEach, describe, expect, it } from "vitest";

import {
  assertRateLimitAllowed,
  createInMemoryRateLimitProvider,
  resetApiRateLimitProviderForTests,
  setApiRateLimitProviderForTests,
} from "@/server/api/runtime/api-rate-limit";

describe("api rate limit provider", () => {
  beforeEach(() => {
    resetApiRateLimitProviderForTests();
    setApiRateLimitProviderForTests(createInMemoryRateLimitProvider());
  });

  it("allows requests under the configured window limit", async () => {
    const snapshot = await assertRateLimitAllowed({
      contractId: "internal.v1.health.get",
      policy: "anonymous-low",
      requestId: "req-1",
      userId: null,
    });

    expect(snapshot).toMatchObject({
      allowed: true,
      limit: 30,
      remaining: expect.any(Number),
      resetAtUnix: expect.any(Number),
    });
  });

  it("rejects requests above the configured window limit", async () => {
    const context = {
      contractId: "internal.v1.health.get",
      policy: "anonymous-low" as const,
      requestId: "req-1",
      userId: null,
    };

    for (let index = 0; index < 30; index += 1) {
      await assertRateLimitAllowed(context);
    }

    await expect(assertRateLimitAllowed(context)).rejects.toMatchObject({
      code: "rate_limited",
    });
  });

  it("skips enforcement for disabled-local-dev policy", async () => {
    for (let index = 0; index < 200; index += 1) {
      await expect(
        assertRateLimitAllowed({
          contractId: "internal.v1.health.get",
          policy: "disabled-local-dev",
          requestId: `req-${index}`,
          userId: null,
        })
      ).resolves.toBeNull();
    }
  });
});
