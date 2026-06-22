import { describe, expect, it } from "vitest";

import {
  COMPANY_ACCESS_BLOCK_REASON,
  denyOperatingContext,
  tenantSlugMissingError,
} from "../context-errors";

describe("context-errors", () => {
  it("returns tenant slug missing error with TENANT_NOT_FOUND code", () => {
    expect(tenantSlugMissingError()).toEqual({
      code: "TENANT_NOT_FOUND",
      userMessage: "Workspace tenant could not be resolved from the request.",
    });
  });

  it("denies operating context with err result shape", () => {
    const result = denyOperatingContext({
      correlationId: "corr-test",
      tenantSlug: "dev-local",
      error: {
        code: "MEMBERSHIP_DENIED",
        userMessage: "You do not have access to this workspace scope.",
      },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("MEMBERSHIP_DENIED");
    }
  });

  it("exposes operational block reasons for legal entities", () => {
    expect(COMPANY_ACCESS_BLOCK_REASON["suspended"]).toContain("suspended");
    expect(COMPANY_ACCESS_BLOCK_REASON["archived"]).toContain("archived");
  });
});
