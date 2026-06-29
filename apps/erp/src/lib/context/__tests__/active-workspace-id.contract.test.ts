import { describe, expect, it } from "vitest";

import {
  formatActiveWorkspaceId,
  parseActiveWorkspaceId,
} from "../active-workspace-id.contract";

describe("active-workspace-id.contract", () => {
  it("formats tenant, company, and organization into a serializable key", () => {
    expect(
      formatActiveWorkspaceId({
        tenantId: "tenant-001",
        companyId: "company-001",
        organizationId: "org-001",
      })
    ).toBe("tenant-001:company-001:org-001");
  });

  it("uses root when organization scope is absent", () => {
    expect(
      formatActiveWorkspaceId({
        tenantId: "tenant-001",
        companyId: "company-001",
        organizationId: null,
      })
    ).toBe("tenant-001:company-001:root");
  });

  it("parses organization scope from serialized key", () => {
    expect(parseActiveWorkspaceId("tenant-001:company-001:org-001")).toEqual({
      tenantId: "tenant-001",
      companyId: "company-001",
      organizationId: "org-001",
    });
  });

  it("parses root organization segment as null", () => {
    expect(parseActiveWorkspaceId("tenant-001:company-001:root")).toEqual({
      tenantId: "tenant-001",
      companyId: "company-001",
      organizationId: null,
    });
  });

  it("returns null for malformed or empty values", () => {
    expect(parseActiveWorkspaceId(null)).toBeNull();
    expect(parseActiveWorkspaceId("")).toBeNull();
    expect(parseActiveWorkspaceId("tenant-only")).toBeNull();
    expect(parseActiveWorkspaceId("a:b:")).toBeNull();
  });
});
