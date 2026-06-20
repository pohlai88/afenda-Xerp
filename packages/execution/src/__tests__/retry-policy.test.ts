import { describe, expect, it } from "vitest";
import {
  computeRetryDelayMs,
  DEFAULT_RETRY_POLICY,
  shouldRetry,
  validateRetryPolicy,
} from "../index.js";

describe("retry policy", () => {
  it("validates default retry policy", () => {
    expect(validateRetryPolicy(DEFAULT_RETRY_POLICY)).toEqual(
      DEFAULT_RETRY_POLICY
    );
  });

  it("rejects invalid maxAttempts", () => {
    expect(() =>
      validateRetryPolicy({ backoffMs: 100, maxAttempts: 0 })
    ).toThrow("maxAttempts");
  });

  it("computes exponential backoff delay", () => {
    const policy = { backoffMs: 1000, backoffMultiplier: 2, maxAttempts: 5 };

    expect(computeRetryDelayMs(policy, 1)).toBe(1000);
    expect(computeRetryDelayMs(policy, 2)).toBe(2000);
    expect(computeRetryDelayMs(policy, 3)).toBe(4000);
  });

  it("allows retry while attempts remain", () => {
    const policy = { backoffMs: 500, maxAttempts: 3 };

    expect(shouldRetry(policy, 1)).toBe(true);
    expect(shouldRetry(policy, 2)).toBe(true);
    expect(shouldRetry(policy, 3)).toBe(false);
  });
});
