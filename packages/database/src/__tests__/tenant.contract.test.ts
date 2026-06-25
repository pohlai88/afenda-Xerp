import { describe, expect, it } from "vitest";

import {
  assertTenantSlug,
  buildTenantInsertRow,
  getTenantAccessBlockReason,
  InvalidTenantSlugError,
  isTenantOperational,
  normalizeTenantSlug,
} from "../tenant/tenant.contract.js";

describe("tenant contract", () => {
  it("normalizes tenant slugs to lowercase kebab-case", () => {
    expect(normalizeTenantSlug("My Tenant")).toBe("my-tenant");
    expect(assertTenantSlug("My Tenant")).toBe("my-tenant");
  });

  it("rejects invalid tenant slugs", () => {
    expect(() => assertTenantSlug("")).toThrow(InvalidTenantSlugError);
  });

  it("builds normalized insert rows", () => {
    const row = buildTenantInsertRow({
      slug: " My Tenant ",
      name: "  Acme Workspace  ",
    });

    expect(row).toEqual({
      mfaRequired: false,
      slug: "my-tenant",
      name: "Acme Workspace",
      status: "active",
    });
  });

  it("persists explicit MFA policy on insert rows", () => {
    const row = buildTenantInsertRow({
      slug: "secure-tenant",
      name: "Secure Tenant",
      mfaRequired: true,
    });

    expect(row.mfaRequired).toBe(true);
  });

  it("controls workspace access by tenant status", () => {
    expect(isTenantOperational({ status: "active" })).toBe(true);
    expect(isTenantOperational({ status: "suspended" })).toBe(false);
    expect(isTenantOperational({ status: "archived" })).toBe(false);
    expect(getTenantAccessBlockReason("suspended")).toContain("suspended");
  });
});
