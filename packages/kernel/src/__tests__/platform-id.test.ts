import { describe, expect, it } from "vitest";
import {
  brandCorrelationId,
  brandExecutionId,
  brandTenantId,
  toCorrelationId,
  toTenantId,
} from "../contracts/platform-id.contract.js";

describe("platform id contract", () => {
  it("brands identifiers at the trust boundary", () => {
    const tenantId = brandTenantId("tenant-1");
    const correlationId = brandCorrelationId("corr-1");
    const executionId = brandExecutionId("exec-1");

    expect(toTenantId(tenantId as NonNullable<typeof tenantId>)).toBe(
      "tenant-1"
    );
    expect(toCorrelationId(correlationId)).toBe("corr-1");
    expect(executionId).toBe("exec-1");
  });

  it("rejects empty required identifiers", () => {
    expect(() => brandCorrelationId("   ")).toThrow("correlationId");
    expect(() => brandExecutionId("")).toThrow("executionId");
  });

  it("returns null for optional absent identifiers", () => {
    expect(brandTenantId(null)).toBeNull();
    expect(brandTenantId(undefined)).toBeNull();
  });
});
